// Tests of the geography repair (repair_model.mjs) and its geometry core (geo_core.mjs).
//
// Each repair rule is exercised on a small synthetic model built here: a positive case (the defect the checker
// reports is gone after the rule) and a negative case (a feature without the defect is left exactly as it was, or a
// second run changes nothing). The geometry core is tested for determinism, the natural coast cut, tracing and
// validation. The full-model test (repair of aoaz.json, about two minutes) runs only with ZIN_GEO_FULL=1.
//
//   node --test tools/content/geography/repair_model.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkModel, FEATURE_ARRAYS, pointInGeometry, loadModel } from './check_model.mjs';
import * as G from './geo_core.mjs';
import {
  repairRings, repairNether, repairEdges, repairLakes, repairBiomes, repairRanges, repairPoints, repairSeas, repairRegions,
  repairRivers, buildOverrides, repairModel, isNameCode, NETHER_MIN_AREA_PX,
} from './repair_model.mjs';

const rect = (x0, y0, x1, y1) => ({ type: 'Polygon', coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1]]] });
const feature = (id, geometry, extra = {}) => ({ id, name: id.replace(/_/gu, ' '), established: false, source: 'test', kind: 'test', elevation: 1, geometry, ...extra });
/** A minimal model: every feature array present and empty unless given. */
function mini(parts = {}) {
  const m = { schemaVersion: 1, frame: { widthPx: 5120, heightPx: 2560 }, sheets: {}, edges: [] };
  for (const a of FEATURE_ARRAYS) m[a] = [];
  return Object.assign(m, JSON.parse(JSON.stringify(parts)));
}
const codes = (m, ...wanted) => checkModel(m).errors.filter(e => wanted.includes(e.code));
const same = (a, b) => assert.equal(JSON.stringify(a), JSON.stringify(b));

// ---------------------------------------------------------------------------------------------------- geometry core
test('fractal noise is deterministic, seeded and inside 0..1', () => {
  const a = [], b = [];
  for (let i = 0; i < 400; i++) { a.push(G.fbm1('edge_west', i / 37)); b.push(G.fbm1('edge_east', i / 37)); }
  same(a, Array.from({ length: 400 }, (_, i) => G.fbm1('edge_west', i / 37)));
  assert.ok(a.every(v => v >= 0 && v <= 1));
  assert.notDeepEqual(a, b);
  for (const side of G.SIDE_ORDER) for (let t = 0; t <= 1; t += 0.01) {
    const d = G.coastDepth(side, t), c = G.COASTS[side];
    assert.ok(d >= c.base - 1e-12 && d <= c.base + c.amp + 1e-12);
    assert.ok(d > (side === 'west' || side === 'east' ? G.BAND.x : G.BAND.y));
  }
});

test('the edge cut keeps the map side along a natural, irregular coast', () => {
  const g = rect(0, 0.3, 0.25, 0.7);
  const r = G.cutGeometry(g, 'west');
  assert.ok(r.ok);
  assert.deepEqual(G.geometryDefects(r.geometry), []);
  const pts = r.geometry.coordinates[0];
  assert.ok(pts.every(p => G.SIDES.west.g(p) > -1e-9), 'no vertex left in the cut band');
  const coast = pts.filter(p => p[0] < 0.08);
  assert.ok(coast.length > 100, 'the coast is sampled finely');
  const mean = coast.reduce((s, p) => s + p[0], 0) / coast.length;
  const sd = Math.sqrt(coast.reduce((s, p) => s + (p[0] - mean) ** 2, 0) / coast.length);
  assert.ok(sd > 0.002, `the coast is not a straight cut (sd ${sd})`);
  assert.ok(pts.every(p => p[0] > G.BAND.x));
  // every drawn vertex on the kept side survives
  assert.ok(g.coordinates[0].filter(p => G.SIDES.west.g(p) > 0).every(p => pts.some(q => q[0] === p[0] && q[1] === p[1])));
});

test('the edge cut leaves inland polygons alone and removes polygons inside the band (negative)', () => {
  const inland = rect(0.3, 0.3, 0.4, 0.4);
  same(G.cutGeometry(inland, 'west').geometry, inland);
  assert.equal(G.cutGeometry(rect(0.001, 0.3, 0.03, 0.4), 'west').geometry, null);
});

test('the edge cut keeps holes and merges a hole the coast opens', () => {
  const g = { type: 'Polygon', coordinates: [[[0, 0.3], [0.3, 0.3], [0.3, 0.6], [0, 0.6]], [[0.2, 0.4], [0.2, 0.45], [0.25, 0.45], [0.25, 0.4]], [[0.01, 0.5], [0.01, 0.55], [0.1, 0.55], [0.1, 0.5]]] };
  const r = G.cutGeometry(g, 'west');
  assert.ok(r.ok);
  assert.deepEqual(G.geometryDefects(r.geometry), []);
  assert.equal(r.geometry.coordinates.length, 2, 'the inland hole stays, the hole the coast crosses becomes a bay');
  assert.ok(!pointInGeometry(0.08, 0.525, r.geometry), 'the bay is water');
});

test('tracing a mask gives a valid geometry that rasterises back to the same cells', () => {
  const grid = { ox: 0, oy: 0, cell: 4, w: 64, h: 48 };
  const mask = new Uint8Array(grid.w * grid.h);
  for (let j = 5; j < 40; j++) for (let i = 5; i < 50; i++) if (!(i > 20 && i < 30 && j > 15 && j < 25)) mask[j * grid.w + i] = 1;
  mask[2 * grid.w + 60] = 1; mask[3 * grid.w + 61] = 1; // a diagonal pair: the saddle keeps them apart
  const g = G.vectorize(mask, grid, { minPartPx: 1, minHolePx: 1 });
  assert.deepEqual(G.geometryDefects(g), []);
  same([...G.rasterize(g, grid)], [...mask]);
  assert.equal(G.vectorize(new Uint8Array(grid.w * grid.h), grid), null);
});

test('validation finds crossings, touches and spikes (negative: a square is clean)', () => {
  assert.notDeepEqual(G.geometryDefects({ type: 'Polygon', coordinates: [[[0.1, 0.1], [0.2, 0.2], [0.2, 0.1], [0.1, 0.2]]] }), []);
  assert.notDeepEqual(G.geometryDefects({ type: 'Polygon', coordinates: [[[0.1, 0.1], [0.2, 0.1], [0.3, 0.1], [0.2, 0.1], [0.2, 0.2]]] }), []);
  assert.deepEqual(G.geometryDefects(rect(0.1, 0.1, 0.2, 0.2)), []);
});

// ---------------------------------------------------------------------------------------------------- A rings
test('rings: a self-crossing land is rebuilt, a clean land is untouched', () => {
  const bow = { type: 'Polygon', coordinates: [[[0.3, 0.3], [0.4, 0.4], [0.4, 0.3], [0.3, 0.4]]] };
  const m = mini({ lands: [feature('land_bow', bow), feature('land_square', rect(0.5, 0.5, 0.6, 0.6))] });
  assert.ok(codes(m, 'RING_SELF_CROSS').length);
  const log = [];
  repairRings(m, log);
  assert.equal(codes(m, 'RING_SELF_CROSS', 'RING_SELF_TOUCH', 'RING_SPIKE').length, 0);
  assert.equal(m.lands[0].geometry.type, 'MultiPolygon', 'both lobes of the bow tie survive');
  same(m.lands[1].geometry, rect(0.5, 0.5, 0.6, 0.6));
  assert.deepEqual(log.map(e => e.id), ['land_bow']);
});

// ---------------------------------------------------------------------------------------------------- B the Nether
function netherWorld() {
  return mini({
    lands: [
      feature('land_dead_lands_island', { type: 'Polygon', coordinates: [[[0.585, 0.80], [0.62, 0.80], [0.625, 0.85], [0.615, 0.903], [0.598, 0.905], [0.58, 0.85]]] }, { regions: ['dead_lands'] }),
      feature('land_nether_island', rect(0.59, 0.93, 0.61, 0.95), { name: 'The Nether (island)', regions: ['dead_lands'] }),
      feature('land_eastern_mainland', { type: 'Polygon', coordinates: [[[0.66, 0.80], [0.9, 0.80], [0.9, 0.95], [0.655, 0.95]]] }, { regions: ['south_lands'] }),
    ],
    seas: [feature('sea_lava_sea', rect(0.5, 0.75, 0.66, 0.97), { name: 'Sea of Lava' })],
    ranges: [feature('range_nether', { type: 'LineString', coordinates: [[0.6, 0.85], [0.61, 0.86]] }, { name: 'Nether Mountains', halfWidth: 0.006, peakClass: 5 })],
    volcanoes: [feature('volcano_nether_island', { type: 'Point', coordinates: [0.600, 0.940] }, { name: 'Mount Nether' })],
    sites: [feature('site_nether', { type: 'Point', coordinates: [0.600, 0.935] }, { name: 'The Nether' })],
    regions: [feature('region_dead_lands', rect(0.55, 0.78, 0.65, 0.97), { name: 'Dead Lands', kind: 'region', areaPx: 1 })],
  });
}
test('nether: a land south of the Dead Lands, large enough, with its region, range and access routes', () => {
  const m = netherWorld();
  assert.ok(codes(m, 'NETHER_TOO_SMALL', 'NETHER_REGION', 'NETHER_RANGE').length);
  const log = [];
  repairNether(m, log);
  repairRegions(m, log);
  assert.deepEqual(codes(m, 'NETHER_MISSING', 'NETHER_NOT_BELOW', 'NETHER_TOO_SMALL', 'NETHER_IN_EDGE', 'NETHER_REGION', 'NETHER_SITE', 'NETHER_RANGE', 'NETHER_VOLCANO', 'NETHER_SEA', 'LANDS_OVERLAP', 'REGIONS_OVERLAP'), []);
  const nether = m.lands.find(l => l.id === 'land_nether_island');
  assert.ok(G.geometryAreaPx(nether.geometry) >= NETHER_MIN_AREA_PX);
  assert.deepEqual(G.geometryDefects(nether.geometry), []);
  assert.deepEqual(m.straits.map(s => s.id).sort(), ['strait_ember_narrows', 'strait_nether_sound']);
  assert.ok(m.passes.some(p => p.id === 'pass_cinder_gate' && p.geometry.coordinates.every(q => pointInGeometry(q[0], q[1], nether.geometry))));
  assert.equal(m.regions.find(r => r.id === 'region_nether')?.parent, 'dead_lands');
  // the name of the Nether land is kept
  assert.equal(nether.name, 'The Nether (island)');
});
test('nether: without the Dead Lands island nothing is invented (negative)', () => {
  const m = netherWorld();
  m.lands = m.lands.filter(l => l.id !== 'land_dead_lands_island');
  const before = JSON.stringify(m), log = [];
  repairNether(m, log);
  assert.equal(JSON.stringify(m), before);
  assert.ok(log[0].unresolved);
});

// ---------------------------------------------------------------------------------------------------- C edge bands
function edgeWorld() {
  return mini({
    lands: [
      feature('land_big', rect(0, 0.2, 0.3, 0.5)),
      feature('land_islet', rect(0.005, 0.6, 0.02, 0.62)),
      feature('land_inland', rect(0.4, 0.4, 0.5, 0.5)),
    ],
    sites: [feature('site_islet', { type: 'Point', coordinates: [0.012, 0.61] }), feature('site_edge', { type: 'Point', coordinates: [0.01, 0.3] }), feature('site_inland', { type: 'Point', coordinates: [0.45, 0.45] })],
    ice: [feature('ice_cliff', rect(0, 0.2, 0.014, 0.45))],
    ranges: [feature('range_edge', { type: 'LineString', coordinates: [[0.005, 0.25], [0.005, 0.45]] }, { halfWidth: 0.004 })],
    rivers: [feature('river_edge', { type: 'LineString', coordinates: [[0.2, 0.3], [0.1, 0.3], [0.01, 0.3]] })],
    edges: [{ id: 'edge_west', name: 'The Hoarfrost Barrier', side: 'west', x: [0, 0.014], policy: 'cliff' }],
  });
}
test('edges: lands are cut or moved out of the band, lines and points pulled in, the cliff becomes a coastal strip', () => {
  const m = edgeWorld();
  assert.ok(codes(m, 'EDGE_BAND_LAND').length >= 5);
  const log = [];
  const moves = repairEdges(m, log);
  assert.deepEqual(codes(m, 'EDGE_BAND_LAND'), []);
  assert.deepEqual(moves.map(mv => mv.id), ['land_islet']);
  const islet = m.lands.find(l => l.id === 'land_islet'), site = m.sites.find(s => s.id === 'site_islet');
  assert.ok(pointInGeometry(site.geometry.coordinates[0], site.geometry.coordinates[1], islet.geometry), 'the site moved with its island');
  assert.ok(G.geometryAreaPx(islet.geometry) > 3800, 'the island keeps its shape');
  assert.equal(m.ice[0].edgeStrip, 'west');
  assert.match(m.edges[0].policy, /^open sea/u);
  assert.match(m.wrapPolicy, /open sea/u);
  assert.deepEqual(m.edgePolicy.runsOffEdge, []);
  same(m.lands.find(l => l.id === 'land_inland').geometry, rect(0.4, 0.4, 0.5, 0.5));
  same(m.sites.find(s => s.id === 'site_inland').geometry.coordinates, [0.45, 0.45]);
  for (const g of buildOverrides({ ...m, repair: { moved: moves } }).surface.map(e => ({ type: 'Polygon', coordinates: [e.polygon] }))) assert.deepEqual(G.geometryDefects(g), []);
});
test('edges: a model clear of the bands is left alone (negative)', () => {
  const m = mini({ lands: [feature('land_inland', rect(0.4, 0.4, 0.5, 0.5))], sites: [feature('site_inland', { type: 'Point', coordinates: [0.45, 0.45] })] });
  const lands = JSON.stringify(m.lands), sites = JSON.stringify(m.sites), log = [];
  repairEdges(m, log);
  assert.equal(JSON.stringify(m.lands), lands);
  assert.equal(JSON.stringify(m.sites), sites);
  assert.deepEqual(log, []);
});
test('overrides: the band polygons force sea exactly seaward of the natural coasts', () => {
  const o = buildOverrides(mini({ lands: [] }));
  assert.deepEqual(o.surface.map(e => e.id), ['edge_west_open_sea', 'edge_east_open_sea', 'edge_north_open_sea', 'edge_south_open_sea']);
  const geo = o.surface.map(e => ({ type: 'Polygon', coordinates: [e.polygon] }));
  for (const g of geo) assert.deepEqual(G.geometryDefects(g), []);
  assert.ok(pointInGeometry(0.02, 0.5, geo[0]) && pointInGeometry(0.98, 0.5, geo[1]) && pointInGeometry(0.5, 0.01, geo[2]) && pointInGeometry(0.5, 0.99, geo[3]));
  assert.ok(!geo.some(g => pointInGeometry(0.1, 0.5, g) || pointInGeometry(0.5, 0.1, g)), 'the map side is not forced');
  for (let t = 0.05; t < 0.95; t += 0.05) assert.ok(!pointInGeometry(G.coastDepth('west', t) + 0.002, t, geo[0]));
});

// ---------------------------------------------------------------------------------------------------- D lakes, E biomes
test('lakes: a lake over the coast is shrunk onto land; a lake on land is untouched', () => {
  const m = mini({ lands: [feature('land_a', rect(0.3, 0.3, 0.5, 0.5))], lakes: [feature('lake_coast', rect(0.48, 0.4, 0.52, 0.45)), feature('lake_inland', rect(0.35, 0.35, 0.4, 0.4))] });
  assert.ok(codes(m, 'LAKE_OUTSIDE_LAND', 'LAKE_VERTEX_OFF_LAND').length);
  const log = [];
  repairLakes(m, log);
  assert.deepEqual(codes(m, 'LAKE_OUTSIDE_LAND', 'LAKE_VERTEX_OFF_LAND', 'LAKE_CROSSES_COAST'), []);
  same(m.lakes[1].geometry, rect(0.35, 0.35, 0.4, 0.4));
  assert.deepEqual(log.map(e => e.id), ['lake_coast']);
});
test('biomes: a forest half over the sea is clipped to land; a forest on land is untouched', () => {
  const m = mini({ lands: [feature('land_a', rect(0.3, 0.3, 0.5, 0.5))], forests: [feature('forest_coast', rect(0.45, 0.35, 0.55, 0.45)), feature('forest_inland', rect(0.32, 0.32, 0.36, 0.36))] });
  assert.equal(codes(m, 'BIOME_OFF_LAND').length, 1);
  const log = [];
  repairBiomes(m, log);
  assert.deepEqual(codes(m, 'BIOME_OFF_LAND'), []);
  same(m.forests[1].geometry, rect(0.32, 0.32, 0.36, 0.36));
  assert.deepEqual(log.map(e => e.id), ['forest_coast']);
});

// ---------------------------------------------------------------------------------------------------- F ranges, H points
test('ranges: a spine over water is moved onto the nearest land; a spine on land is untouched', () => {
  const m = mini({
    lands: [feature('land_a', rect(0.3, 0.3, 0.4, 0.5)), feature('land_b', rect(0.41, 0.3, 0.5, 0.5))],
    ranges: [feature('range_coast', { type: 'LineString', coordinates: [[0.398, 0.32], [0.402, 0.40], [0.398, 0.48]] }, { halfWidth: 0.004 }), feature('range_inland', { type: 'LineString', coordinates: [[0.33, 0.35], [0.36, 0.45]] }, { halfWidth: 0.004 })],
  });
  assert.equal(codes(m, 'RANGE_OVER_WATER').length, 1);
  const log = [];
  repairRanges(m, log);
  assert.deepEqual(codes(m, 'RANGE_OVER_WATER'), []);
  same(m.ranges[1].geometry.coordinates, [[0.33, 0.35], [0.36, 0.45]]);
  assert.deepEqual(log.map(e => e.id), ['range_coast']);
});
test('points: a site in a lake goes to the shore and names the lake; a site on land stays', () => {
  const m = mini({
    lands: [feature('land_a', rect(0.3, 0.3, 0.5, 0.5))],
    lakes: [feature('lake_a', rect(0.35, 0.35, 0.40, 0.40))],
    sites: [feature('site_lake', { type: 'Point', coordinates: [0.39, 0.375] }, { kind: 'port' }), feature('site_land', { type: 'Point', coordinates: [0.45, 0.45] })],
  });
  assert.ok(codes(m, 'SITE_IN_LAKE').length);
  const log = [];
  repairPoints(m, log);
  assert.deepEqual(codes(m, 'SITE_IN_LAKE', 'SITE_OFF_LAND'), []);
  assert.equal(m.sites[0].lake, 'lake_a');
  assert.ok(G.distPx(m.sites[0].geometry.coordinates, [0.40, 0.375]) < 12, 'the port stands on the nearest shore');
  same(m.sites[1].geometry.coordinates, [0.45, 0.45]);
});

// ---------------------------------------------------------------------------------------------------- I seas, J regions
test('seas: overlaps, seas on land and unclaimed water are resolved; a second run changes nothing', () => {
  const m = mini({
    lands: [feature('land_a', rect(0.3, 0.3, 0.5, 0.5))],
    seas: [feature('sea_west', rect(0, 0, 0.45, 1), { kind: 'sea' }), feature('sea_east', rect(0.42, 0, 0.9, 1), { kind: 'sea' }), feature('sea_belt', rect(0.25, 0.25, 0.95, 0.55), { kind: 'storm_belt' })],
  });
  assert.ok(codes(m, 'SEAS_OVERLAP', 'SEA_ON_LAND', 'WATER_UNCLAIMED').length >= 3);
  const log = [];
  repairSeas(m, log);
  assert.deepEqual(codes(m, 'SEAS_OVERLAP', 'SEA_ON_LAND', 'WATER_UNCLAIMED', 'HOLE_OUTSIDE', 'HOLE_TOUCH', 'RING_SELF_CROSS', 'RING_SELF_TOUCH'), []);
  assert.ok(m.seas[2].stormZone, 'the storm belt keeps its outline as an overlay');
  const once = JSON.stringify(m.seas), log2 = [];
  repairSeas(m, log2);
  assert.equal(JSON.stringify(m.seas), once);
  assert.deepEqual(log2, []);
});
test('regions: unclaimed land goes to a region and areas are recomputed; a second run changes nothing', () => {
  const m = mini({
    lands: [feature('land_a', rect(0.3, 0.3, 0.5, 0.5), { regions: ['east'] }), feature('land_b', rect(0.6, 0.6, 0.62, 0.62), { regions: ['west'] })],
    regions: [feature('region_west', rect(0.29, 0.29, 0.4, 0.51), { kind: 'region', areaPx: 5 }), feature('region_east', rect(0.42, 0.29, 0.51, 0.51), { kind: 'region', areaPx: 5 })],
  });
  assert.ok(codes(m, 'REGION_COVERAGE', 'REGION_AREA_STALE').length);
  const log = [];
  repairRegions(m, log);
  assert.deepEqual(codes(m, 'REGION_COVERAGE', 'REGION_AREA_STALE', 'REGIONS_OVERLAP'), []);
  assert.ok(pointInGeometry(0.61, 0.61, m.regions[0].geometry), 'an island goes to the region its land names');
  const once = JSON.stringify(m.regions), log2 = [];
  repairRegions(m, log2);
  assert.equal(JSON.stringify(m.regions), once);
  assert.deepEqual(log2, []);
});

// ---------------------------------------------------------------------------------------------------- K rivers
function riverWorld() {
  return mini({
    lands: [feature('land_a', rect(0.3, 0.3, 0.5, 0.6))],
    ranges: [feature('range_spine', { type: 'LineString', coordinates: [[0.40, 0.36], [0.40, 0.44]] }, { halfWidth: 0.004, peakClass: 4 })],
    deserts: [feature('desert_basin', rect(0.42, 0.455, 0.48, 0.52))],
    rivers: [
      feature('river_short', { type: 'LineString', coordinates: [[0.40, 0.40], [0.44, 0.40], [0.47, 0.40]] }),
      feature('river_across', { type: 'LineString', coordinates: [[0.33, 0.35], [0.40, 0.35], [0.47, 0.35]] }),
      feature('river_wadi', { type: 'LineString', coordinates: [[0.405, 0.445], [0.43, 0.47], [0.45, 0.48]] }),
      feature('river_good', { type: 'LineString', coordinates: [[0.399, 0.43], [0.36, 0.43], [0.32, 0.43], [0.297, 0.43]] }),
    ],
  });
}
test('rivers: mouths reach water, courses run downhill, a desert river dies in its basin; a valid river is untouched', () => {
  const m = riverWorld();
  const before = checkModel(m).errors.filter(e => e.code.startsWith('RIVER_'));
  assert.ok(before.some(e => e.id === 'river_short' && e.code === 'RIVER_MOUTH_ON_LAND'));
  assert.ok(before.some(e => e.id === 'river_across' && e.code === 'RIVER_UPHILL'));
  assert.ok(!before.some(e => e.id === 'river_good'));
  const good = JSON.stringify(m.rivers[3]);
  const log = [];
  repairRivers(m, log);
  assert.deepEqual(checkModel(m).errors.filter(e => e.code.startsWith('RIVER_')), []);
  assert.equal(JSON.stringify(m.rivers[3]), good);
  assert.equal(m.rivers[2].endorheic, true);
  assert.equal(m.rivers[2].basin, 'desert_basin');
  assert.ok(log.find(e => e.id === 'river_across').action.includes('re-routed'), 'the crossing is re-routed round the range end');
  assert.ok(m.rivers[1].geometry.coordinates.some(p => p[1] < 0.335), 'the detour goes round the north end of the range');
  assert.deepEqual(log.map(e => e.id).sort(), ['river_across', 'river_short', 'river_wadi']);
});

// ---------------------------------------------------------------------------------------------------- the whole model
test('the whole model: only name findings and the Great River gorge remain; the repair is idempotent', { skip: !process.env.ZIN_GEO_FULL && 'set ZIN_GEO_FULL=1 (about two minutes)' }, () => {
  const input = loadModel();
  const { model } = repairModel(input);
  const left = checkModel(model).errors.filter(e => !isNameCode(e.code));
  assert.deepEqual(left.map(e => `${e.code} ${e.id}`), ['RIVER_UPHILL river_great']);
  assert.equal(JSON.stringify(repairModel(model).model), JSON.stringify(model));
  assert.equal(JSON.stringify(input), JSON.stringify(loadModel()), 'the input is not changed');
});
