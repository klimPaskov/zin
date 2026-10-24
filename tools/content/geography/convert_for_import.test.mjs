// Tests of the conversion of the geography model into the drawn-map import's inputs (convert_for_import.mjs) and of the
// import measures that need no drawing (import_measures.mjs warp and agreement on synthetic pictures).
//
// Synthetic models and pictures only; the private drawing is never read. The last tests convert the tracked model again
// and compare the result with the tracked outputs (determinism), and, when the HOI4 Agent Tools repository is present,
// validate the tracked outputs against its published schemas.
//
//   node --test tools/content/geography/convert_for_import.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as G from './geo_core.mjs';
import { pointInGeometry } from './check_model.mjs';
import {
  schemaRing, areaFields, bridgeRings, clipRing, sheetsDocument, annotationsFrom, convertModel, carveSeas, edgeBandLand, previewCall, IMPORT,
} from './convert_for_import.mjs';
import { fillRings, warp, agreement, toolHeuristicLand, classifyLand, workingSize } from './import_measures.mjs';
import { DEFAULT_TOOL, toolAjv, toolSchema, schemaErrors } from './validate_import.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const rect = (x0, y0, x1, y1) => ({ type: 'Polygon', coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]] });
const f = (id, geometry, extra = {}) => ({ id, name: id.replace(/_/gu, ' '), established: false, source: 'test', kind: 'test', elevation: 1, geometry, ...extra });

// ---------------------------------------------------------------------------------------------------- geometry
test('rings: the closing vertex and repeated vertices go, long rings are simplified under the limit; a clean ring is kept (negative)', () => {
  assert.deepEqual(schemaRing([[0.1, 0.1], [0.2, 0.1], [0.2, 0.1], [0.2, 0.2], [0.1, 0.1]]), [[0.1, 0.1], [0.2, 0.1], [0.2, 0.2]]);
  const circle = Array.from({ length: 3000 }, (_, k) => [0.5 + 0.2 * Math.cos((2 * Math.PI * k) / 3000), 0.5 + 0.4 * Math.sin((2 * Math.PI * k) / 3000)]);
  const r = schemaRing(circle);
  assert.ok(r.length <= IMPORT.maxRingVertices && r.length >= 100);
  const square = [[0.1, 0.1], [0.3, 0.1], [0.3, 0.3], [0.1, 0.3]];
  assert.deepEqual(schemaRing(square), square);
});

test('areas: a MultiPolygon gives its outer rings to polygons and every hole to holes, largest part first', () => {
  const g = { type: 'MultiPolygon', coordinates: [rect(0.1, 0.1, 0.12, 0.12).coordinates, [[[0.3, 0.3], [0.6, 0.3], [0.6, 0.6], [0.3, 0.6]], [[0.4, 0.4], [0.5, 0.4], [0.5, 0.5], [0.4, 0.5]]]] };
  const a = areaFields(g);
  assert.equal(a.polygons.length, 2);
  assert.equal(a.polygons[0][0][0], 0.3, 'the largest part comes first');
  assert.equal(a.holes.length, 1);
  assert.equal(areaFields(rect(0.1, 0.1, 0.2, 0.2)).holes, undefined, 'no holes, no field');
});

test('bridged rings: one ring holds a part and its hole for an even-odd fill; the hole stays empty', () => {
  const outer = [[0.1, 0.1], [0.5, 0.1], [0.5, 0.5], [0.1, 0.5]], hole = [[0.2, 0.2], [0.3, 0.2], [0.3, 0.3], [0.2, 0.3]];
  const ring = bridgeRings([outer, hole]);
  const m = fillRings([ring], new Uint8Array(200 * 100), 1, 200, 100);
  const at = (x, y) => m[Math.floor(y * 100) * 200 + Math.floor(x * 200)];
  assert.equal(at(0.4, 0.4), 1);
  assert.equal(at(0.25, 0.25), 0, 'the hole is not filled');
  assert.equal(at(0.7, 0.7), 0);
  assert.deepEqual(bridgeRings([outer]), outer, 'one ring needs no bridge');
});

// ---------------------------------------------------------------------------------------------------- sheets
const SHEET = { drawingBox: [0.1, 0.1, 0.5, 0.5], clipBox: [0.1, 0.1, 0.49, 0.5], drawingAnchor: [0.3, 0.3], worldAnchor: [0.7, 0.4], scaleWorldPerDrawing: [-1.2, 1.5], mirrorX: true, order: 3 };
test('sheets: box, anchor, target, a negative scale for the mirror, the order and the source; an affine sheet keeps its affine form', () => {
  const doc = sheetsDocument({ sheets: { east: { ...SHEET, clip: rect(0.15, 0.15, 0.45, 0.45) }, sun: { ...SHEET, order: 5, affine: [0.5, 0.01, 0.1, -0.02, 0.7, 0.2] } } });
  assert.equal(doc.version, 1);
  assert.equal(doc.fill, 'sea');
  assert.deepEqual(doc.source, { ...IMPORT.source });
  assert.deepEqual(doc.sheets.map(s => s.id), ['sun', 'east'], 'higher order first');
  const east = doc.sheets[1];
  assert.deepEqual(east.box, [0.1, 0.1, 0.49, 0.5], 'the clip box cuts the pencil frame');
  assert.deepEqual(east.scale, [-1.2, 1.5]);
  assert.deepEqual(east.anchor, [0.3, 0.3]);
  assert.deepEqual(east.target, [0.7, 0.4]);
  assert.equal(east.order, 3);
  assert.ok(east.clip.length >= 3);
  assert.deepEqual(doc.sheets[0].affine, [0.5, 0.01, 0.1, -0.02, 0.7, 0.2]);
  assert.equal(doc.sheets[0].anchor, undefined);
});

test('sheets: a clip with many vertices and several parts becomes one ring under 512 vertices that covers the same cells', () => {
  const blob = (cx, cy, r, n) => [Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)])];
  const clip = { type: 'MultiPolygon', coordinates: [blob(0.2, 0.2, 0.05, 900), blob(0.4, 0.4, 0.05, 900)] };
  const ring = clipRing({ ...SHEET, id: 'east', clip });
  assert.ok(ring.length <= IMPORT.maxClipVertices, `${ring.length} vertices`);
  const m = fillRings([ring], new Uint8Array(400 * 400), 1, 400, 400);
  const at = (x, y) => m[Math.floor(y * 400) * 400 + Math.floor(x * 400)];
  assert.equal(at(0.2, 0.2), 1);
  assert.equal(at(0.4, 0.4), 1);
  assert.equal(at(0.3, 0.3), 0, 'the space between the parts is outside');
});

// ---------------------------------------------------------------------------------------------------- annotations
test('annotations: the forced land and sea of the overrides become polygons that paint the same cells; later entries win', () => {
  const overrides = { surface: [
    { id: 'band', kind: 'sea', polygon: [[0.1, 0.1], [0.3, 0.1], [0.3, 0.3], [0.1, 0.3]] },
    { id: 'isle', kind: 'land', polygon: [[0.15, 0.15], [0.2, 0.15], [0.2, 0.2], [0.15, 0.2]] },
  ] };
  const { annotations, dropped } = annotationsFrom(overrides);
  assert.deepEqual(dropped, []);
  assert.deepEqual(annotations.map(a => a.kind), ['sea', 'land'], 'sea first, then land');
  const W = 1280, H = 640, painted = new Uint8Array(W * H).fill(255);
  for (const a of annotations) fillRings([a.polygon.map(p => [p.x, p.y])], painted, a.kind === 'land' ? 1 : 0, W, H);
  const at = (x, y) => painted[Math.floor(y * H) * W + Math.floor(x * W)];
  assert.equal(at(0.25, 0.25), 0);
  assert.equal(at(0.175, 0.175), 1, 'the land entry inside the sea entry wins');
  assert.equal(at(0.5, 0.5), 255, 'nothing is forced outside the entries');
});

// ---------------------------------------------------------------------------------------------------- the model
function model() {
  return {
    sheets: {},
    seas: [f('sea_a_ocean', rect(0.05, 0.05, 0.95, 0.95), { kind: 'ocean', name: 'A Sea', established: true }), f('sea_belt', rect(0.9, 0.9, 0.95, 0.95), { kind: 'storm_belt' })],
    lands: [f('land_main', rect(0.2, 0.2, 0.5, 0.5), { kind: 'continent', regions: ['test'], biome: 'forest', fertility: 0.5 }), f('land_isle', rect(0.52, 0.2, 0.6, 0.5), { kind: 'island', regions: ['test', 'other'] })],
    regions: [f('region_test', rect(0.15, 0.15, 0.65, 0.55), { kind: 'region', terrain: { plains: 1 }, density: { provincesPerState: [2, 3, 4], provinceAreaPx: 500 } }), f('zone_x', rect(0.3, 0.3, 0.4, 0.4), { kind: 'zone' })],
    ranges: [f('range_wall', { type: 'LineString', coordinates: [[0.3, 0.25], [0.3, 0.45]] }, { halfWidth: 0.004, peakClass: 5, wall: true }), f('range_ring', { type: 'LineString', coordinates: [[0.35, 0.3], [0.45, 0.3], [0.45, 0.4], [0.35, 0.3]] }, { halfWidth: 0.003, peakClass: 4 })],
    passes: [f('pass_gate', { type: 'Point', coordinates: [0.301, 0.35] })],
    volcanoes: [f('volcano_v', { type: 'Point', coordinates: [0.4, 0.45] }, { elevation: 5, status: 'active' })],
    rivers: [
      f('river_lake', { type: 'LineString', coordinates: [[0.25, 0.25], [0.27, 0.3], [0.28, 0.33]] }, { width: 2 }),
      f('river_shore', { type: 'LineString', coordinates: [[0.4, 0.42], [0.45, 0.45], [0.4999, 0.46]] }, { width: 3 }),
      f('river_basin', { type: 'LineString', coordinates: [[0.22, 0.4], [0.24, 0.42]] }, { width: 1, endorheic: true, basin: 'desert_x' }),
    ],
    lakes: [f('lake_l', rect(0.27, 0.32, 0.29, 0.34))],
    forests: [f('forest_f', rect(0.21, 0.21, 0.25, 0.25))],
    deserts: [], marshes: [], ice: [], plains: [], hills: [],
    straits: [f('strait_s', { type: 'LineString', coordinates: [[0.51, 0.25], [0.51, 0.45]] })],
    sites: [f('site_cap', { type: 'Point', coordinates: [0.35, 0.35] }, { kind: 'region_seat' }), f('site_port', { type: 'Point', coordinates: [0.28, 0.33] }, { kind: 'port', lake: 'lake_l' })],
    roads: [f('road_r', { type: 'LineString', coordinates: [[0.25, 0.3], [0.45, 0.3]] })],
    coasts: [f('cape_c', { type: 'Point', coordinates: [0.5, 0.21] }, { kind: 'cape' })],
    edges: [{ id: 'edge_west', name: 'West', side: 'west', policy: 'open sea' }],
    registration: {},
  };
}
const COAST = {
  seaKinds: [],
  bays: [{ id: 'sea_bay_test', name: 'Bay of Test', nameStatus: 'proposed', nameSource: 'test', kind: 'bay', areaPx: 100, mouthPx: 10, depthPx: 10, at: [0.1, 0.1], geometry: rect(0.06, 0.06, 0.12, 0.12) }],
  crossings: [
    { id: 'strait_s', name: 'S Strait', strait: 'strait_s', source: 'model strait', lands: ['land_main', 'land_isle'], between: [[0.495, 0.3], [0.525, 0.3]], widthPx: 102 },
    { id: 'strait_one', name: 'One Land', strait: null, source: 'model strait', lands: ['land_main', 'land_main'], between: [[0.25, 0.3], [0.26, 0.3]], widthPx: 50, sameLand: true },
  ],
};
test('model: seas are never Oceans, the storm belt is a sea; bays are carved out as gulfs; zones, terrain areas, biomes and region terrain are held back', () => {
  const { geography, held } = convertModel(model(), { coast: COAST, roster: { realms: [{ tag: 'CAP', name: 'Capland', focusTier: 'major', capital: { siteId: 'site_cap', name: 'Cap' } }] } });
  assert.ok(geography.seas.every(s => s.kind !== 'ocean'));
  assert.deepEqual(geography.seas.map(s => [s.id, s.kind]), [['sea_a_ocean', 'sea'], ['sea_belt', 'sea'], ['sea_bay_test', 'gulf']]);
  assert.ok(geography.seas[1].tags.includes('storm-belt'));
  const parent = geography.seas[0], bay = geography.seas[2];
  const parentGeom = { type: 'MultiPolygon', coordinates: parent.polygons.map((r, k) => [r, ...(k === 0 ? parent.holes ?? [] : [])]) };
  assert.ok(!pointInGeometry(0.09, 0.09, parentGeom), 'the bay is cut out of its sea');
  assert.ok(pointInGeometry(0.09, 0.09, { type: 'Polygon', coordinates: bay.polygons }));
  assert.ok(geography.lands.every(l => l.biome === undefined && l.fertility === undefined));
  assert.equal(geography.lands[0].region, 'region_test');
  assert.equal(geography.lands[1].region, 'region_test', 'a key that names no region of the model is ignored');
  assert.deepEqual(geography.regions.map(r => r.id), ['region_test']);
  assert.equal(geography.regions[0].terrain, undefined);
  assert.deepEqual(held.zones.map(z => z.id), ['zone_x']);
  assert.deepEqual(held.terrainAreas.map(t => t.id), ['forest_f']);
  assert.equal(geography.biomes, undefined);
  assert.equal(geography.climate, undefined);
});

test('model: relief, sites and water follow the schema; a wall is an impassable massif, a capital carries its tag, a river into a lake names the lake', () => {
  const { geography, held, issues } = convertModel(model(), { coast: COAST, roster: { realms: [{ tag: 'CAP', name: 'Capland', focusTier: 'major', capital: { siteId: 'site_cap', name: 'Cap' } }] } });
  const wall = geography.ranges.find(r => r.id === 'range_wall');
  assert.equal(wall.profile, 'massif');
  assert.equal(wall.barrier, 'impassable');
  assert.equal(wall.peak, IMPORT.peakByClass[5]);
  const ring = geography.ranges.find(r => r.id === 'range_ring');
  assert.equal(ring.closed, true);
  assert.equal(ring.path.length, 3, 'a closed path loses its repeated vertex');
  assert.equal(geography.passes[0].range, 'range_wall');
  assert.equal(geography.volcanoes[0].active, true);
  const cap = geography.sites.find(s => s.id === 'site_cap');
  assert.deepEqual([cap.kind, cap.country, cap.importance], ['capital', 'CAP', 5]);
  const port = geography.sites.find(s => s.id === 'site_port');
  assert.deepEqual([port.kind, port.lake], ['port', 'lake_l']);
  assert.deepEqual(geography.rivers.find(r => r.id === 'river_lake').mouth, { lake: 'lake_l' });
  const shore = geography.rivers.find(r => r.id === 'river_shore');
  assert.ok(!pointInGeometry(shore.mouth[0], shore.mouth[1], model().lands[0].geometry), 'a mouth on the shore moves into the water');
  assert.ok(issues.some(e => e.id === 'river_shore' && /mouth moved/u.test(e.issue)));
  assert.deepEqual(held.rivers.map(r => r.id), ['river_basin']);
  assert.equal(geography.rivers.find(r => r.id === 'river_shore').size, IMPORT.riverSizeByWidth[3]);
  assert.deepEqual(geography.places.map(p => [p.id, p.kind]), [['cape_c', 'cape']]);
});

test('model: every crossing between two lands is an open strait with its two shore points; a crossing within one land is held back (negative)', () => {
  const { geography, held } = convertModel(model(), { coast: COAST });
  assert.deepEqual(geography.straits.map(s => s.id), ['strait_s']);
  const s = geography.straits[0];
  assert.deepEqual(s.between, [[0.495, 0.3], [0.525, 0.3]]);
  assert.equal(s.rule, 'open');
  assert.ok(s.tags.includes('crossing'));
  assert.deepEqual(held.straits.map(x => x.id), ['strait_one']);
});

test('model: the names list carries every renamed feature with its former label and every proposed coast name', () => {
  const m = model();
  m.sites[0] = { ...m.sites[0], name: 'Cap', formerLabel: 'Capland', renamedBy: 'name_table', nameStatus: 'proposed' };
  const { names } = convertModel(m, { coast: COAST, design: { sites: [{ id: 'site_cap', name: 'Capland' }] }, nameTable: { entries: [{ id: 'site_cap', oldName: 'Capland', newName: 'Cap', reason: 'the capital' }] } });
  const cap = names.find(n => n.id === 'site_cap');
  assert.deepEqual([cap.name, cap.formerLabel, cap.nameStatus, cap.reason], ['Cap', 'Capland', 'proposed', 'the capital']);
  assert.deepEqual(cap.at, [0.35, 0.35]);
  assert.ok(names.some(n => n.id === 'sea_bay_test' && n.formerLabel === null && n.nameStatus === 'proposed'));
});

test('edge bands: land in the sea bands is found per land; land clear of them is not (negative)', () => {
  const geo = { lands: [{ id: 'land_west', name: 'W', polygons: [[[0.01, 0.4], [0.1, 0.4], [0.1, 0.5], [0.01, 0.5]]] }, { id: 'land_mid', name: 'M', polygons: [[[0.4, 0.4], [0.5, 0.4], [0.5, 0.5], [0.4, 0.5]]] }] };
  const hits = edgeBandLand(geo);
  assert.deepEqual(hits.map(h => h.id), ['land_west']);
  assert.ok(hits[0].px > 0);
});

test('carving: seas untouched by a bay keep their geometry; no bay changes nothing (negative)', () => {
  const seas = [f('sea_a', rect(0.05, 0.05, 0.5, 0.5)), f('sea_b', rect(0.6, 0.6, 0.9, 0.9))];
  const { geometry } = carveSeas(seas, [{ id: 'bay', geometry: rect(0.1, 0.1, 0.2, 0.2) }]);
  assert.deepEqual([...geometry.keys()], ['sea_a']);
  assert.equal(carveSeas(seas, []).geometry.size, 0);
});

test('preview call: create_world at 5,120 x 2,560 with the sea-band edge, the registered drawing, the sheets and the model', () => {
  const call = previewCall({ palette: [{ kind: 'sea', color: { r: 1, g: 2, b: 3 } }] });
  const op = call.arguments.operations[0];
  assert.equal(call.tool, 'hoi4_map_rewrite');
  assert.equal(call.arguments.preview, true);
  assert.deepEqual([op.kind, op.width, op.height, op.edge.mode], ['create_world', 5120, 2560, 'sea-band']);
  assert.equal(op.reference.imagePath, 'docs/reference/originals/Erdae.png');
  assert.equal(op.reference.sheetsPath, 'tools/content/data/geography/import/aoaz.sheets.json');
  assert.equal(op.geographyPath, 'tools/content/data/geography/import/aoaz.geography.json');
  assert.equal(op.reference.palette.length, 1);
});

// ---------------------------------------------------------------------------------------------------- import measures
test('warp: the higher order wins where sheets overlap, a clip cuts its sheet, a mirrored sheet reads mirrored; pixels outside every sheet are sea', () => {
  // a 100 x 50 picture: left half red, right half blue
  const pw = 100, ph = 50, data = Buffer.alloc(pw * ph * 3);
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) data.set(x < 50 ? [200, 40, 40] : [40, 40, 200], (y * pw + x) * 3);
  const doc = { sheets: [
    { id: 'low', box: [0, 0, 1, 1], anchor: [0, 0], target: [0, 0], scale: [0.5, 1], order: 1 },
    { id: 'high', box: [0, 0, 1, 1], clip: [[0, 0], [0.2, 0], [0.2, 1], [0, 1]], anchor: [0, 0], target: [0.25, 0], scale: [0.5, 1], order: 2 },
    { id: 'mirror', box: [0, 0, 1, 1], anchor: [0, 0], target: [1, 0], scale: [-0.25, 1], order: 3 },
  ] };
  const { rgb, owner } = warp(doc, { data, width: pw, height: ph });
  const W = 5120, at = (x, y) => (Math.floor(y * 2560) * W + Math.floor(x * W));
  assert.equal(doc.sheets[owner[at(0.1, 0.5)]].id, 'low');
  assert.equal(doc.sheets[owner[at(0.3, 0.5)]].id, 'high', 'the clipped high sheet covers its clip');
  assert.equal(doc.sheets[owner[at(0.45, 0.5)]].id, 'low', 'beyond its clip the high sheet gives way');
  assert.equal(doc.sheets[owner[at(0.9, 0.5)]].id, 'mirror');
  assert.equal(rgb[at(0.95, 0.5) * 3], 200, 'the mirrored sheet reads its left half at the right');
  assert.equal(owner[at(0.6, 0.5)], 255);
  assert.ok(workingSize(doc).width >= 2560);
});

test('agreement: land IoU over the frame and per zone; a perfect reading scores 1, a reading of only sea scores 0', () => {
  const W = 5120, H = 2560, model = new Uint8Array(W * H), zones = new Array(1280 * 640).fill('z');
  for (let y = 1000; y < 1200; y++) model.fill(1, y * W + 1000, y * W + 1400);
  assert.equal(agreement(null, model, model, zones).total, 1);
  assert.equal(agreement(null, model, new Uint8Array(W * H), zones).total, 0);
  assert.equal(toolHeuristicLand(40, 60, 160), 0, 'blue is sea');
  assert.equal(toolHeuristicLand(90, 160, 60), 1, 'green is land');
  assert.equal(classifyLand(Buffer.from([40, 60, 160]), new Uint8Array([255]), toolHeuristicLand)[0], 0, 'outside every sheet is sea');
});

// ---------------------------------------------------------------------------------------------------- the tracked outputs
test('determinism: converting the tracked model again writes the tracked import files byte for byte', () => {
  const out = mkdtempSync(path.join(os.tmpdir(), 'zin-import-'));
  try {
    execFileSync(process.execPath, [path.join(here, 'convert_for_import.mjs'), '--out', out], { encoding: 'utf8' });
    for (const file of ['aoaz.geography.json', 'aoaz.sheets.json', 'aoaz.annotations.json', 'aoaz.names.json', 'aoaz.held_back.json', 'preview_call.json', 'preview_call_palette.json']) {
      assert.equal(readFileSync(path.join(out, file), 'utf8'), readFileSync(path.join(here, '../data/geography/import', file), 'utf8'), file);
    }
  } finally { rmSync(out, { recursive: true, force: true }); }
});

test('schemas: the tracked geography model and sheet document are valid against the tool\'s published schemas', { skip: !existsSync(path.join(DEFAULT_TOOL, 'package.json')) && 'the HOI4 Agent Tools repository is not present' }, () => {
  const ajv = toolAjv(DEFAULT_TOOL);
  const dir = path.join(here, '../data/geography/import');
  for (const [file, schema] of [['aoaz.geography.json', 'schemas/geography-model.schema.json'], ['aoaz.sheets.json', 'schemas/reference-sheets.schema.json']]) {
    const errors = schemaErrors(ajv, toolSchema(DEFAULT_TOOL, 'origin/main', schema), JSON.parse(readFileSync(path.join(dir, file), 'utf8')));
    assert.deepEqual(errors, [], file);
  }
  const names = JSON.parse(readFileSync(path.join(dir, 'aoaz.geography.json'), 'utf8'));
  for (const a of ['seas', 'lands', 'regions', 'straits', 'sites']) for (const x of names[a]) assert.ok(!/\bocean\b|waith/iu.test(x.name), `${x.id} ${x.name}`);
});

test('untangleLine cuts a loop at the crossing and leaves a clean line alone', () => {
  const clean = [[0.1, 0.1], [0.2, 0.1], [0.3, 0.2]];
  assert.deepEqual(G.untangleLine(clean), clean);
  // the line runs right, turns back down across its own first segment, then goes on
  const looped = [[0.1, 0.1], [0.3, 0.1], [0.3, 0.2], [0.2, 0.05], [0.2, 0.0]];
  const u = G.untangleLine(looped);
  assert.equal(u.length, 3);
  assert.deepEqual(u[0], [0.1, 0.1]);
  assert.ok(Math.abs(u[1][0] - 0.2) < 1e-9 && Math.abs(u[1][1] - 0.1) < 1e-9, 'cut at the crossing point');
  assert.deepEqual(u[2], [0.2, 0.0]);
  // a vertex repeated later in the line (a touch) is a loop too
  assert.equal(G.untangleLine([[0, 0], [0.1, 0], [0.1, 0.1], [0.1, 0], [0.2, 0]]).length, 3);
  assert.equal(G.segmentIntersection([0, 0], [1, 0], [0, 1], [1, 1]), null);
});
