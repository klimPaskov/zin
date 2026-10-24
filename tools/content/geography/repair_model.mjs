// Deterministic, idempotent repair of the physical errors of the geography model of Aoaz.
//
// It reads tools/content/data/geography/aoaz.json (never writes it) and returns a repaired copy in which every
// physical rule of the converter-independent checker (tools/content/geography/check_model.mjs) holds. Names are not
// touched: the name findings are only reported (sea and region names are renamed later from the regional dossiers).
// The rules, in the order they run:
//   A rings      self-crossing, self-touching, spiked rings and stray holes are rebuilt from their even-odd fill;
//   B nether     the Nether becomes a land south of the Dead Lands island, large enough for three states of three
//                provinces, with region_nether, the Nether Mountains standing on it and three access routes (the
//                Nether Sound and the Ember Narrows as straits, the Cinder Gate as a pass);
//   C edges      the engine wraps the map, so the bands x<0.04, x>0.96, y<0.025, y>0.975 become open sea (R-18): land
//                is cut along a natural coast (seeded fractal noise per edge id, never a straight line); small lands
//                that a cut would mostly destroy are moved out of the band with everything standing on them; lines and
//                points are pulled inward; the former edge cliffs become coastal ice strips; `edges`, `wrapPolicy` and
//                `edgePolicy` say open sea;
//   D lakes      lakes are shrunk onto land; E biomes: terrain areas are clipped to land; F ranges: spines are moved
//                onto land; G volcanoes and H sites: onto land, sites out of lakes onto the shore (with `lake`);
//   I seas       the open water is partitioned among the seas (the smaller sea keeps contested water; unclaimed water
//                goes to the nearest sea through the water), then each sea is re-traced from its cells;
//   J regions    land no region claims goes to the region of its land or the nearest region; areaPx is recomputed;
//   K rivers     each river runs downhill: violating stretches are re-routed around higher ground near the drawn
//                course (Dijkstra over relief classes with a non-increasing cap); a mouth on land is extended along the
//                lowest ground to the nearest reachable water, or the river is marked endorheic when it ends in a
//                desert basin;
//   L paths      roads and passes keep three quarters of their vertices on land; M metadata: areas, bounding boxes,
//                anchors, drawing coordinates (through each feature's sheet) and feature counts.
// Every rule is a pure function of the model; no clock, no Math.random. Running the repair on its own output changes
// nothing (idempotent).
//
//   node tools/content/geography/repair_model.mjs                       summary only, nothing is written
//   node tools/content/geography/repair_model.mjs <out.json> [--overrides <file>] [--drawing [jpg]] [--report <file>]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkModel, ringsOf, pointInGeometry, distanceToGeometry, distanceToPath, reliefClassAt, FEATURE_ARRAYS } from './check_model.mjs';
import * as G from './geo_core.mjs';
import { toDrawing } from './drawing_mask.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_MODEL_PATH = path.join(here, '../data/geography/aoaz.json');
export const DEFAULT_DRAWING_PATH = path.join(here, '../../../docs/reference/originals/Erdae-working.jpg');

export const OPTIONS = Object.freeze({
  moveLandBelowPx: 120000,      // lands smaller than this are moved out of a band instead of cut ...
  moveWhenKeepsUnder: 0.65,     // ... when a cut would keep less than this share of them
  landMargin: 0.004,            // how far a moved land clears the coast
  collisionGapPx: 6,            // a moved land keeps this much sea to every other land
  pullWhenKeepsUnder: 0.4,      // a terrain area keeping less than this share after a cut is moved inward instead
  rangeClipKeepsAtLeast: 0.6,   // a range keeping this share of its spine after a clip is clipped, otherwise pulled
  biomeMinShare: 0.78,          // terrain areas under this share on land are clipped to land (the checker asks 0.70)
  lakeMinShare: 0.985,          // lakes under this share on land are shrunk onto land (the checker asks 0.97)
  rangeMinShare: 0.93,          // spines under this share on land are moved onto land (the checker asks 0.90)
  pathMinShare: 0.8,            // roads and passes under this share of vertices on land are moved (the checker asks 0.75)
});
const CG = Object.freeze({ ox: 0, oy: 0, cell: 4, w: 1280, h: 640 }); // the checker's grid
const AREA_FEATURES = ['lands', 'lakes', 'forests', 'deserts', 'marshes', 'ice', 'plains', 'hills'];
const BIOMES = ['forests', 'deserts', 'marshes', 'ice', 'plains', 'hills'];
const LINE_FEATURES = ['ranges', 'rivers', 'roads', 'straits'];
const POINT_FEATURES = ['volcanoes', 'sites', 'coasts'];
const r4 = v => Math.round(v * 1e4) / 1e4;
const pt5 = p => [G.round5(p[0]), G.round5(p[1])];

// ---------------------------------------------------------------------------------------------------- shared helpers
const clone = v => JSON.parse(JSON.stringify(v));
function mapCoords(g, f) {
  if (g.type === 'Point') return { type: 'Point', coordinates: f(g.coordinates) };
  if (g.type === 'LineString') return { type: 'LineString', coordinates: g.coordinates.map(f) };
  if (g.type === 'Polygon') return { type: 'Polygon', coordinates: g.coordinates.map(r => r.map(f)) };
  return { type: 'MultiPolygon', coordinates: g.coordinates.map(part => part.map(r => r.map(f))) };
}
const translate = (g, v) => mapCoords(g, p => pt5([p[0] + v[0], p[1] + v[1]]));
const allPoints = g => g.type === 'Point' ? [g.coordinates] : g.type === 'LineString' ? g.coordinates : ringsOf(g).flatMap(part => part.flat());
const outerPoints = g => g.type === 'Point' ? [g.coordinates] : g.type === 'LineString' ? g.coordinates : ringsOf(g).flatMap(part => part[0]);
export function landMask(m, grid = CG) { const mask = new Uint8Array(grid.w * grid.h); for (const l of m.lands ?? []) G.rasterizeInto(l.geometry, grid, mask, 1); return mask; }
export function lakeMask(m, grid = CG) { const mask = new Uint8Array(grid.w * grid.h); for (const l of m.lakes ?? []) G.rasterizeInto(l.geometry, grid, mask, 1); return mask; }
/** Share of an area geometry's checker cells that are land (the checker's BIOME_OFF_LAND measure). */
function landShare(g, land) {
  const m = G.rasterize(g, CG); let c = 0, on = 0;
  for (let i = 0; i < m.length; i++) if (m[i]) { c++; if (land[i]) on++; }
  return c ? on / c : 1;
}
/** Share of a spine on land, sampled exactly as the checker samples RANGE_OVER_WATER. */
function spineShare(c, land) {
  const dense = [];
  for (let i = 0; i + 1 < c.length; i++) for (let t = 0; t < 8; t++) dense.push([c[i][0] + ((c[i + 1][0] - c[i][0]) * t) / 8, c[i][1] + ((c[i + 1][1] - c[i][1]) * t) / 8]);
  dense.push(c[c.length - 1]);
  return dense.filter(p => land[G.cellIndexOf(CG, p)] === 1).length / dense.length;
}
/** Even-odd rebuild of an area at `cell` pixels; drops slivers under `minPx`. */
function rebuildArea(g, cell = 1, minPx = 2) {
  const grid = G.makeGrid(G.geometryBounds(g), cell, 3);
  return G.vectorize(G.rasterize(g, grid), grid, { tolerances: [0.8, 0.6, 0.4, 0], minPartPx: minPx, minHolePx: minPx });
}
/** Area geometry intersected with the model's land (eroded by `erodePx`), at one-pixel resolution. */
function clipToLand(g, lands, erodePx = 0, minPx = 30) {
  const grid = G.makeGrid(G.geometryBounds(g), 1, 4);
  const mask = G.rasterize(g, grid);
  let land = new Uint8Array(grid.w * grid.h);
  for (const l of lands) G.rasterizeInto(l.geometry, grid, land, 1);
  if (erodePx) land = G.erode(land, grid, erodePx);
  for (let i = 0; i < mask.length; i++) mask[i] = mask[i] && land[i] ? 1 : 0;
  return G.vectorize(mask, grid, { tolerances: [1.0, 0.7, 0.5, 0.3, 0], minPartPx: minPx, minHolePx: minPx });
}
/** All four coasts cut, with a raster fallback for a degenerate crossing. */
function cutAll(g) {
  let cur = g;
  for (const side of G.SIDE_ORDER) {
    if (!cur) return null;
    const r = G.cutGeometry(cur, side);
    if (!r.ok) {
      const grid = G.makeGrid(G.geometryBounds(cur), 1, 3);
      const mask = G.rasterize(cur, grid);
      for (let j = 0; j < grid.h; j++) for (let i = 0; i < grid.w; i++) if (G.edgeClearance(G.cellCentre(grid, i, j)) <= 0) mask[j * grid.w + i] = 0;
      cur = G.vectorize(mask, grid, { minPartPx: 2, minHolePx: 2, tolerances: [0.6, 0.4, 0] });
    } else cur = r.geometry;
  }
  return cur;
}
/** The translation that pushes every point of a set out of all four bands by `margin`. */
function clearanceVector(points, margin) {
  let v = [0, 0];
  for (let iter = 0; iter < 10; iter++) {
    let moved = false;
    for (const side of G.SIDE_ORDER) {
      const s = G.SIDES[side];
      let need = 0;
      for (const p of points) need = Math.max(need, margin - s.g([p[0] + v[0], p[1] + v[1]]));
      if (need > 1e-9) { v = [v[0] + s.normal[0] * need, v[1] + s.normal[1] * need]; moved = true; }
    }
    if (!moved) break;
  }
  return v;
}
/** Index of nearest interior land cell (all four neighbours land) for every checker cell. */
function nearestLandIndex(land, lake = null) {
  const labels = new Int32Array(land.length).fill(-1);
  const ok = i => land[i] && !(lake && lake[i]);
  for (let j = 1; j < CG.h - 1; j++) for (let i = 1; i < CG.w - 1; i++) {
    const c = j * CG.w + i;
    if (ok(c) && ok(c - 1) && ok(c + 1) && ok(c - CG.w) && ok(c + CG.w)) labels[c] = c;
  }
  return G.growLabels(labels, CG, () => true);
}
const cellPoint = c => G.cellCentre(CG, c % CG.w, Math.floor(c / CG.w));

/** True when a feature stands on a land geometry (used to carry features with a moved land). */
function standsOn(array, f, landGeom) {
  const g = f.geometry;
  const pts = outerPoints(g);
  const inside = p => pointInGeometry(p[0], p[1], landGeom) || distanceToGeometry(p[0], p[1], landGeom) < 0.0025;
  if (g.type === 'Point') return inside(pts[0]);
  const share = pts.filter(inside).length / pts.length;
  return share >= 0.5;
}

// ---------------------------------------------------------------------------------------------------- A rings
export function repairRings(m, log) {
  for (const array of AREA_FEATURES) for (const f of m[array] ?? []) {
    const defects = G.geometryDefects(f.geometry);
    if (!defects.length) continue;
    const g = rebuildArea(f.geometry);
    if (g) { f.geometry = g; log.push({ rule: 'rings', id: f.id, action: `rebuilt from its even-odd fill (${defects.join('; ')})` }); }
    else log.push({ rule: 'rings', id: f.id, action: 'UNRESOLVED: could not rebuild', unresolved: true });
  }
}

// ---------------------------------------------------------------------------------------------------- B the Nether
/**
 * Authored outline of the Nether (normalised), drawn over the land the working drawing shows at the foot of the Dead
 * Lands sheet (world y 0.912 to 0.940, the sheet's lower edge) and carried south past the sheet's edge, with the sound
 * north of it, a gap to the islets west of it and the Ember Narrows to the South Lands east of it.
 */
export const NETHER_OUTLINE = Object.freeze([
  [0.566, 0.938], [0.572, 0.932], [0.582, 0.929], [0.591, 0.927], [0.597, 0.918], [0.604, 0.9125], [0.614, 0.9115],
  [0.624, 0.913], [0.632, 0.918], [0.637, 0.925], [0.638, 0.933], [0.634, 0.942], [0.627, 0.950], [0.616, 0.956],
  [0.603, 0.960], [0.589, 0.959], [0.577, 0.954], [0.568, 0.947],
]);
/** The Nether Mountains: a volcanic spine along the long axis of the Nether. */
export const NETHER_SPINE = Object.freeze([[0.580, 0.9405], [0.596, 0.9355], [0.611, 0.9315], [0.626, 0.9300]]);
export const NETHER_MIN_AREA_PX = 26000;

function netherOutline() {
  const ring = G.chaikin(NETHER_OUTLINE.map(p => [p[0], p[1]]), 3);
  const n = ring.length, K = 40, A = 9;
  return ring.map((p, i) => {
    const a = G.toPx(ring[(i - 1 + n) % n]), b = G.toPx(ring[(i + 1) % n]);
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
    const t = i / n;
    const v = G.fbm1('land_nether_island', t * K) * (1 - t) + G.fbm1('land_nether_island', (t - 1) * K) * t;
    const off = A * (v - 0.5) * 2;
    const P = G.toPx(p);
    return G.fromPx([P[0] + (ty / l) * off, P[1] - (tx / l) * off]);
  });
}
/** Closest pair of points between the outer rings of two area geometries, inside a window. */
function closestPair(ga, gb, window) {
  const inW = p => p[0] >= window[0] && p[0] <= window[2] && p[1] >= window[1] && p[1] <= window[3];
  let best = null;
  for (const pa of ringsOf(ga)) for (const pb of ringsOf(gb)) {
    const ringA = pa[0], ringB = pb[0];
    for (const p of ringA) {
      if (!inW(p)) continue;
      const c = G.closestOnPath(p, ringB, true);
      if (c && (!best || c.dist < best.dist)) best = { a: p, b: c.point, dist: c.dist };
    }
  }
  return best;
}
const inward = (p, g, px = 2) => {
  // nudge a coast point a little into its land
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]];
  for (const d of dirs) { const q = [p[0] + (d[0] * px) / G.W, p[1] + (d[1] * px) / G.H]; if (pointInGeometry(q[0], q[1], g)) return pt5(q); }
  return pt5(p);
};

export function repairNether(m, log) {
  const nether = m.lands.find(l => l.id === 'land_nether_island');
  const dead = m.lands.find(l => l.id === 'land_dead_lands_island');
  if (!nether || !dead) { log.push({ rule: 'nether', id: 'land_nether_island', action: 'UNRESOLVED: the Nether or the Dead Lands island is missing', unresolved: true }); return; }
  const outline = netherOutline();
  const bounds = G.boundsOf(outline);
  const grid = G.makeGrid([bounds[0] - 0.01, bounds[1] - 0.01, bounds[2] + 0.01, bounds[3] + 0.01], 1, 2);
  const mask = G.rasterize({ type: 'Polygon', coordinates: [outline] }, grid);
  let others = new Uint8Array(grid.w * grid.h);
  for (const l of m.lands) if (l !== nether) G.rasterizeInto(l.geometry, grid, others, 1);
  others = G.dilate(others, grid, 8);
  for (let j = 0; j < grid.h; j++) for (let i = 0; i < grid.w; i++) {
    const c = j * grid.w + i;
    if (others[c] || G.edgeClearance(G.cellCentre(grid, i, j)) < 0.004) mask[c] = 0;
  }
  const geometry = G.vectorize(G.largestComponent(mask, grid), grid, { tolerances: [1.0, 0.7, 0.5, 0], minPartPx: 50, minHolePx: 1e9 });
  if (!geometry) { log.push({ rule: 'nether', id: nether.id, action: 'UNRESOLVED: the outline left no land', unresolved: true }); return; }
  const before = G.geometryAreaPx(nether.geometry);
  const netherChanged = JSON.stringify(nether.geometry) !== JSON.stringify(geometry);
  nether.geometry = geometry;
  nether.regions = ['nether'];
  nether.elevation = 3;
  nether.notes = 'The Nether: the volcanic land south of the Dead Lands island and the seat of the King of Demons (vault: the Nether lies in the south of the Dead Lands). Drawn at the foot of the Dead Lands sheet and carried south past the sheet edge; sized by the repair for at least three states of three provinces. Reached over the Nether Sound from the Dead Lands island, over the Ember Narrows from the South Lands, and inland through the Cinder Gate across the Nether Mountains.';
  if (netherChanged) log.push({ rule: 'nether', id: nether.id, action: `outline rebuilt: ${Math.round(before)} px to ${Math.round(G.geometryAreaPx(geometry))} px` });

  // The Nether Mountains stand on the Nether.
  const range = m.ranges.find(r => r.id === 'range_nether');
  if (range && JSON.stringify(range.geometry.coordinates) !== JSON.stringify(NETHER_SPINE)) {
    range.geometry = { type: 'LineString', coordinates: NETHER_SPINE.map(p => [p[0], p[1]]) };
    range.region = 'nether';
    range.notes = 'Volcanic spine along the long axis of the Nether, overlooking the Nether Sound from the south. The drawing puts the Nether Mountains on the south shore by the drawn Nether; the repair stands them on the Nether itself.';
    log.push({ rule: 'nether', id: range.id, action: 'moved onto the Nether along its long axis' });
  }
  for (const f of [...m.volcanoes, ...m.sites]) {
    if (!['volcano_nether_island', 'site_nether'].includes(f.id)) continue;
    f.region = 'nether';
    if (!pointInGeometry(f.geometry.coordinates[0], f.geometry.coordinates[1], geometry)) {
      const c = G.closestOnPath(f.geometry.coordinates, ringsOf(geometry)[0][0], true);
      f.geometry.coordinates = inward(c.point, geometry, 6);
    }
  }

  // Access routes.
  const add = (array, feature) => { if (!m[array].some(f => f.id === feature.id)) { m[array].push(feature); log.push({ rule: 'nether', id: feature.id, action: `added ${{ straits: 'strait', passes: 'pass' }[array] ?? array} "${feature.name}"` }); } };
  const sound = closestPair(geometry, dead.geometry, [0.585, 0.895, 0.635, 0.925]);
  if (sound) {
    const a = inward(sound.b, dead.geometry, 1), b = inward(sound.a, geometry, 1);
    add('straits', {
      id: 'strait_nether_sound', name: 'Nether Sound', established: false, source: 'repair', kind: 'straits', elevation: 0,
      geometry: { type: 'LineString', coordinates: [a, pt5([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]), b] },
      region: 'nether', joins: ['Dead Lands Island', 'The Nether (island)'], widthClass: 'narrow',
      notes: 'Proposed narrow sound between the south shore of the Dead Lands island and the Nether; the shortest crossing into the Nether.',
    });
  }
  const east = m.lands.find(l => l.id === 'land_eastern_mainland');
  const narrows = east ? closestPair(geometry, east.geometry, [0.62, 0.9, 0.66, 0.97]) : null;
  if (narrows) {
    const a = inward(narrows.a, geometry, 1), b = inward(narrows.b, east.geometry, 1);
    add('straits', {
      id: 'strait_ember_narrows', name: 'Ember Narrows', established: false, source: 'repair', kind: 'straits', elevation: 0,
      geometry: { type: 'LineString', coordinates: [a, pt5([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]), b] },
      region: 'nether', joins: ['The Nether (island)', 'Eastern Mainland'], widthClass: 'narrow',
      notes: 'Proposed hot narrows between the east cape of the Nether and the South Lands: the dangerous southern approach of the vault.',
    });
  }
  if (sound) {
    const landing = inward(sound.a, geometry, 4);
    const spine = G.closestOnPath(landing, NETHER_SPINE, false).point;
    let south = [spine[0], spine[1] + 0.008];
    for (let k = 0; k < 8 && !pointInGeometry(south[0], south[1], geometry); k++) south = [spine[0], spine[1] + 0.008 * (1 - (k + 1) / 9)];
    add('passes', {
      id: 'pass_cinder_gate', name: 'The Cinder Gate', established: false, source: 'repair', kind: 'passes', elevation: 4,
      geometry: { type: 'LineString', coordinates: [landing, pt5(spine), pt5(south)] },
      region: 'nether',
      notes: 'Proposed fortified volcanic pass (vault: proposed local texture) from the landing of the Nether Sound over the Nether Mountains into the burning south of the Nether.',
    });
  }
}

// ---------------------------------------------------------------------------------------------------- C edge bands
const SIDE_LABEL = { west: 'west', east: 'east', north: 'north', south: 'south' };
/** The side of a thin strip that lies along one edge of the frame, or null. */
function edgeStripSide(g) {
  const b = G.geometryBounds(g);
  if (b[2] < 0.03 && b[3] - b[1] > 0.1) return 'west';
  if (b[0] > 0.97 && b[3] - b[1] > 0.1) return 'east';
  if (b[3] < 0.03 && b[2] - b[0] > 0.1) return 'north';
  if (b[1] > 0.97 && b[2] - b[0] > 0.1) return 'south';
  return null;
}
/** A coastal strip along one side between positions t0 and t1 (outer edge on the coast, depth `depth` inland). */
function coastalStrip(side, t0, t1, depth) {
  const s = G.SIDES[side];
  const n = Math.max(8, Math.ceil(Math.abs(t1 - t0) / 0.002));
  const outer = [], inner = [];
  for (let k = 0; k <= n; k++) {
    const t = t0 + ((t1 - t0) * k) / n, p = s.point(t);
    outer.push(pt5([p[0] - s.normal[0] * 0.001, p[1] - s.normal[1] * 0.001]));
    inner.push(pt5([p[0] + s.normal[0] * depth, p[1] + s.normal[1] * depth]));
  }
  const ring = G.orientPart([[...outer, ...inner.reverse()].map(p => [Math.min(1, Math.max(0, p[0])), Math.min(1, Math.max(0, p[1]))])])[0];
  return { type: 'Polygon', coordinates: [ring] };
}

export function repairEdges(m, log, opts = OPTIONS) {
  const moved = new Set(), moves = [];
  const others = FEATURE_ARRAYS.filter(a => !['seas', 'regions', 'lands'].includes(a));
  // C1: small lands that a cut would mostly destroy are moved out of the bands with what stands on them.
  const candidates = m.lands.filter(l => G.geometryReachesCoast(l.geometry)).map(l => {
    const a0 = G.geometryAreaPx(l.geometry), cut = cutAll(l.geometry), a1 = cut ? G.geometryAreaPx(cut) : 0;
    return { l, a0, keep: a1 / a0, cut };
  }).sort((p, q) => q.a0 - p.a0 || p.l.id.localeCompare(q.l.id));
  const original = new Map(m.lands.map(l => [l.id, clone(l.geometry)]));
  const members = new Map();
  for (const c of candidates) {
    if (!(c.a0 < opts.moveLandBelowPx && c.keep < opts.moveWhenKeepsUnder)) continue;
    const list = [];
    for (const array of others) for (const f of m[array] ?? []) {
      if ([...members.values()].some(ls => ls.includes(f))) continue;
      if (standsOn(array, f, c.l.geometry)) list.push(f);
    }
    members.set(c.l.id, list);
  }
  for (const c of candidates) {
    const l = c.l;
    if (members.has(l.id)) {
      let v = clearanceVector(allPoints(l.geometry), opts.landMargin);
      const len = Math.hypot(v[0] * G.W, v[1] * G.H) || 1, unit = [v[0] / len, v[1] / len];
      let ok = false;
      for (let step = 0; step < 30; step++) {
        const g = translate(l.geometry, v);
        if (!collides(g, m.lands.filter(o => o !== l), opts.collisionGapPx) && !G.geometryReachesCoast(g)) { ok = true; break; }
        v = [v[0] + unit[0] * 10, v[1] + unit[1] * 10];
      }
      if (ok) {
        v = [Math.round(v[0] * 1e6) / 1e6, Math.round(v[1] * 1e6) / 1e6];
        l.geometry = translate(l.geometry, v);
        moved.add(l.id);
        for (const f of members.get(l.id)) { f.geometry = translate(f.geometry, v); moved.add(f.id); }
        moves.push({ id: l.id, vector: v, from: original.get(l.id), to: clone(l.geometry), carried: members.get(l.id).map(f => f.id) });
        log.push({ rule: 'edges', id: l.id, action: `moved out of the band by ${Math.round(v[0] * G.W)}, ${Math.round(v[1] * G.H)} px (a cut would keep ${(100 * c.keep).toFixed(0)}%), carrying ${members.get(l.id).length} feature(s)` });
        continue;
      }
      log.push({ rule: 'edges', id: l.id, action: 'could not be moved clear of other lands; cut instead' });
    }
    if (!c.cut) { log.push({ rule: 'edges', id: l.id, action: 'UNRESOLVED: the land lies wholly in the band and cannot be moved', unresolved: true }); continue; }
    l.geometry = c.cut;
    log.push({ rule: 'edges', id: l.id, action: `cut along the natural coast, keeping ${(100 * c.keep).toFixed(0)}% of its area` });
  }
  // C2: everything else that reaches a band.
  for (const array of others) for (const f of m[array] ?? []) {
    if (moved.has(f.id) || !G.geometryReachesCoast(f.geometry)) continue;
    const g = f.geometry;
    if (g.type === 'Polygon' || g.type === 'MultiPolygon') {
      const a0 = G.geometryAreaPx(g), cut = cutAll(g), keep = cut ? G.geometryAreaPx(cut) / a0 : 0;
      const strip = keep < 0.05 ? edgeStripSide(g) : null;
      if (strip) {
        const b = G.geometryBounds(g), along = strip === 'west' || strip === 'east' ? [b[1], b[3]] : [b[0], b[2]];
        f.geometry = coastalStrip(strip, Math.max(0, along[0]), Math.min(1, along[1]), strip === 'west' || strip === 'east' ? 0.011 : 0.016);
        f.edgeStrip = SIDE_LABEL[strip];
        log.push({ rule: 'edges', id: f.id, action: `the edge cliff becomes a coastal strip along the new ${strip} coast` });
      } else if (keep >= opts.pullWhenKeepsUnder) {
        f.geometry = cut;
        log.push({ rule: 'edges', id: f.id, action: `cut along the natural coast, keeping ${(100 * keep).toFixed(0)}%` });
      } else {
        const v = clearanceVector(allPoints(g), 0.003);
        f.geometry = translate(g, v);
        log.push({ rule: 'edges', id: f.id, action: `pulled inward by ${Math.round(v[0] * G.W)}, ${Math.round(v[1] * G.H)} px (a cut would keep ${(100 * keep).toFixed(0)}%)` });
      }
    } else if (g.type === 'LineString') {
      const c = g.coordinates;
      if (array === 'ranges') {
        const pieces = G.clipLine(c).sort((p, q) => G.lineLengthPx(q) - G.lineLengthPx(p));
        const share = pieces.length ? G.lineLengthPx(pieces[0]) / G.lineLengthPx(c) : 0;
        if (share >= opts.rangeClipKeepsAtLeast) { f.geometry = { type: 'LineString', coordinates: G.dedupeLine(pieces[0].map(p => pt5(G.pushInside(p, 0.002))), 0.5) }; log.push({ rule: 'edges', id: f.id, action: `spine clipped at the coast, keeping ${(100 * share).toFixed(0)}%` }); continue; }
        const margin = Math.max(0.004, f.halfWidth ?? 0.004);
        f.geometry = { type: 'LineString', coordinates: G.dedupeLine(c.map(p => pt5(G.pushInside(p, margin))), 2) };
        log.push({ rule: 'edges', id: f.id, action: 'spine pulled inward to clear the coast by its half-width' });
      } else {
        let cc = G.dedupeLine(c.map(p => pt5(G.pushInside(p, 0.003))), 2);
        if (cc.length < 2) cc = [pt5(G.pushInside(c[0], 0.003)), pt5(G.pushInside(c[0], 0.006))];
        f.geometry = { type: 'LineString', coordinates: cc };
        log.push({ rule: 'edges', id: f.id, action: 'pulled inward to clear the coast' });
      }
    } else {
      const q = pt5(G.pushInside(g.coordinates, 0.004));
      log.push({ rule: 'edges', id: f.id, action: `pulled inward by ${Math.round(G.distPx(q, g.coordinates))} px` });
      f.geometry = { type: 'Point', coordinates: q };
    }
  }
  // C3: the policy says open sea.
  for (const e of m.edges ?? []) {
    const side = e.side;
    const c = G.COASTS[side];
    e.policy = `open sea (R-18): the engine wraps the map, so the band ${side === 'west' ? 'x < 0.04' : side === 'east' ? 'x > 0.96' : side === 'north' ? 'y < 0.025' : 'y > 0.975'} is open water with no land; lands that the drawing runs off this edge end in a natural coast generated from seeded fractal noise (seed "${c.seed}", depth ${c.base.toFixed(4)} to ${(c.base + c.amp).toFixed(4)} of the frame).`;
    e.coast = { seed: c.seed, base: c.base, amp: c.amp, freq: c.freq, octaves: 6 };
    const addition = 'Repaired: no cliff and no edge province; the water of the band belongs to the neighbouring seas.';
    if (!(e.note ?? '').includes(addition)) e.note = `${e.note ?? ''} ${addition}`.trim();
    delete e.x; delete e.y;
    e.band = side === 'west' ? { x: [0, G.BAND.x] } : side === 'east' ? { x: [1 - G.BAND.x, 1] } : side === 'north' ? { y: [0, G.BAND.y] } : { y: [1 - G.BAND.y, 1] };
  }
  m.wrapPolicy = 'The engine wraps the map east to west. The bands x < 0.04, x > 0.96, y < 0.025 and y > 0.975 are open sea (requirement R-18): no land, lake, range, river or site enters them, so the seam runs through water and the seas on its two sides may join. Lands that the drawing runs off an edge end in a natural coast (seeded fractal noise per edge id, see `edges[].coast`); the drawing\'s land in the bands is forced to sea by tools/content/geography/edge_overrides.json.';
  m.edgePolicy = { runsOffEdge: [], band: { x: G.BAND.x, y: G.BAND.y }, note: 'Nothing runs off an edge; every edge band is open sea.' };
  if (m.orientation) m.orientation.note = 'Aoaz is flat, but the engine wraps the map east to west: the edge bands are open sea so that the seam lies in water.';
  return moves;
}
/** Areas traced on a pixel grid can poke a fraction of a pixel past the coast: cut them exactly onto it. */
export function trimToCoasts(m, log) {
  for (const array of AREA_FEATURES) for (const f of m[array] ?? []) {
    if (!G.geometryReachesCoast(f.geometry)) continue;
    const g = cutAll(f.geometry);
    if (!g) { log.push({ rule: 'edges', id: f.id, action: 'UNRESOLVED: nothing left inside the coasts', unresolved: true }); continue; }
    f.geometry = g;
    log.push({ rule: 'edges', id: f.id, action: 'trimmed exactly onto the natural coast' });
  }
}
function collides(g, lands, gapPx) {
  const b = G.geometryBounds(g);
  const grid = G.makeGrid(b, 2, Math.ceil(gapPx / 2) + 2);
  const mask = G.rasterize(g, grid);
  let other = new Uint8Array(grid.w * grid.h);
  for (const l of lands) {
    const lb = G.geometryBounds(l.geometry);
    if (lb[2] < b[0] - 0.01 || lb[0] > b[2] + 0.01 || lb[3] < b[1] - 0.02 || lb[1] > b[3] + 0.02) continue;
    G.rasterizeInto(l.geometry, grid, other, 1);
  }
  other = G.dilate(other, grid, Math.ceil(gapPx / 2));
  for (let i = 0; i < mask.length; i++) if (mask[i] && other[i]) return true;
  return false;
}

// ---------------------------------------------------------------------------------------------------- D lakes, E biomes
export function repairLakes(m, log, opts = OPTIONS) {
  const land = landMask(m);
  for (const l of m.lakes) {
    const share = landShare(l.geometry, land);
    const offVertex = ringsOf(l.geometry).some(part => part[0].some(p => !m.lands.some(x => pointInGeometry(p[0], p[1], x.geometry))));
    if (share >= opts.lakeMinShare && !offVertex) continue;
    const g = clipToLand(l.geometry, m.lands, 3, 20);
    if (g) { l.geometry = g; log.push({ rule: 'lakes', id: l.id, action: `shrunk onto land (${(100 * share).toFixed(1)}% on land before)` }); }
    else log.push({ rule: 'lakes', id: l.id, action: 'UNRESOLVED: no land under the lake', unresolved: true });
  }
}
export function repairBiomes(m, log, opts = OPTIONS) {
  const land = landMask(m);
  for (const array of BIOMES) for (const f of m[array] ?? []) {
    const share = landShare(f.geometry, land);
    if (share >= opts.biomeMinShare) continue;
    const g = clipToLand(f.geometry, m.lands, 0, 40);
    if (g) { f.geometry = g; log.push({ rule: 'biomes', id: f.id, action: `clipped to land (${(100 * share).toFixed(0)}% on land before)` }); }
    else log.push({ rule: 'biomes', id: f.id, action: 'UNRESOLVED: no land under the area', unresolved: true });
  }
}

// ---------------------------------------------------------------------------------------------------- F ranges, G volcanoes, H sites, L paths
export function repairRanges(m, log, opts = OPTIONS) {
  const land = landMask(m), near = nearestLandIndex(land);
  for (const r of m.ranges) {
    const c = r.geometry.coordinates;
    const share = spineShare(c, land);
    if (share >= opts.rangeMinShare) continue;
    const snapped = G.densifyLine(c, 3).map(({ p }) => {
      const k = G.cellIndexOf(CG, p);
      return k >= 0 && land[k] ? p : cellPoint(near[Math.max(0, k)]);
    });
    const dense = G.dedupeLine(snapped.map(pt5), 0.5);
    let best = null;
    for (const tol of [2.5, 1.5, 0.8, 0]) {
      const cand = G.dedupeLine(G.simplifyLine(dense, tol), 0.5);
      if (cand.length >= 2 && spineShare(cand, land) >= opts.rangeMinShare) { best = cand; break; }
    }
    if (!best) { log.push({ rule: 'ranges', id: r.id, action: `UNRESOLVED: spine cannot be put on land (${(100 * share).toFixed(0)}%)`, unresolved: true }); continue; }
    const moved = Math.max(...c.map(p => { const q = G.closestOnPath(p, best, false); return q.dist; }));
    r.geometry = { type: 'LineString', coordinates: best };
    log.push({ rule: 'ranges', id: r.id, action: `spine moved onto land (${(100 * share).toFixed(0)}% on land before, vertices moved up to ${Math.round(moved)} px)` });
  }
}
export function repairPoints(m, log) {
  const land = landMask(m), lake = lakeMask(m), near = nearestLandIndex(land, lake);
  const lakeOf = p => m.lakes.find(l => pointInGeometry(p[0], p[1], l.geometry) || G.rasterize(l.geometry, CG)[G.cellIndexOf(CG, p)]);
  for (const v of m.volcanoes) {
    const p = v.geometry.coordinates, k = G.cellIndexOf(CG, p);
    if ((land[k] && !lake[k]) || (!lake[k] && m.lands.some(l => distanceToGeometry(p[0], p[1], l.geometry) < 0.004))) continue;
    const q = pt5(cellPoint(near[k]));
    log.push({ rule: 'points', id: v.id, action: `volcano moved onto land by ${Math.round(G.distPx(q, v.geometry.coordinates))} px` });
    v.geometry = { type: 'Point', coordinates: q };
  }
  for (const s of m.sites) {
    const p = s.geometry.coordinates, k = G.cellIndexOf(CG, p);
    const inLake = lake[k] || m.lakes.some(l => pointInGeometry(p[0], p[1], l.geometry));
    if (inLake) {
      const L = lakeOf(p);
      const target = G.nearestCell(CG, k, c => land[c] === 1 && !lake[c], 60);
      if (target < 0) { log.push({ rule: 'points', id: s.id, action: 'UNRESOLVED: no shore near the site', unresolved: true }); continue; }
      const q = pt5(cellPoint(target));
      s.geometry = { type: 'Point', coordinates: q };
      if (L) s.lake = L.id;
      log.push({ rule: 'points', id: s.id, action: `moved out of ${L ? L.name : 'a lake'} onto the shore (${Math.round(G.distPx(q, p))} px)${s.kind === 'port' ? ' as a lake port' : ''}` });
      continue;
    }
    const onWaterOk = s.onWater === true || s.kind === 'port' || s.kind === 'chasm';
    if (land[k] || onWaterOk) continue;
    if (m.lands.some(l => distanceToGeometry(p[0], p[1], l.geometry) < 0.004)) continue;
    const target = G.nearestCell(CG, k, c => land[c] === 1 && !lake[c], 120);
    if (target < 0) continue;
    const q = pt5(cellPoint(target));
    s.geometry = { type: 'Point', coordinates: q };
    log.push({ rule: 'points', id: s.id, action: `moved onto land (${Math.round(G.distPx(q, p))} px)` });
  }
  // L: roads and passes
  for (const f of [...m.roads, ...m.passes]) {
    const c = f.geometry.type === 'LineString' ? f.geometry.coordinates : [f.geometry.coordinates];
    const onLand = p => land[G.cellIndexOf(CG, p)] === 1 || m.lands.some(l => distanceToGeometry(p[0], p[1], l.geometry) < 0.004);
    const share = c.filter(onLand).length / c.length;
    if (share >= OPTIONS.pathMinShare) continue;
    const moved = c.map(p => onLand(p) ? p : pt5(cellPoint(near[G.cellIndexOf(CG, p)])));
    f.geometry = f.geometry.type === 'LineString' ? { type: 'LineString', coordinates: G.dedupeLine(moved, 0.5) } : { type: 'Point', coordinates: moved[0] };
    log.push({ rule: 'paths', id: f.id, action: `vertices off land moved onto land (${(100 * share).toFixed(0)}% on land before)` });
  }
}

// ---------------------------------------------------------------------------------------------------- I seas
/** Components of one owner smaller than `minCells` go to the owner that surrounds them most (so no sliver seas). */
function absorbSlivers(owner, grid, count, minCells) {
  for (let k = 0; k < count; k++) {
    const mask = new Uint8Array(owner.length);
    let any = false;
    for (let i = 0; i < owner.length; i++) if (owner[i] === k) { mask[i] = 1; any = true; }
    if (!any) continue;
    const { labels, sizes } = G.labelComponents(mask, grid);
    if (sizes.length < 2) continue;
    const votes = sizes.map(() => new Map());
    for (let c = 0; c < owner.length; c++) {
      const l = labels[c];
      if (l < 0 || sizes[l] >= minCells) continue;
      const i = c % grid.w, j = (c - i) / grid.w;
      for (const n of [i > 0 ? c - 1 : -1, i + 1 < grid.w ? c + 1 : -1, j > 0 ? c - grid.w : -1, j + 1 < grid.h ? c + grid.w : -1]) {
        if (n < 0 || owner[n] < 0 || owner[n] === k) continue;
        votes[l].set(owner[n], (votes[l].get(owner[n]) ?? 0) + 1);
      }
    }
    const target = votes.map(v => [...v].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0] ?? -1);
    for (let c = 0; c < owner.length; c++) { const l = labels[c]; if (l >= 0 && sizes[l] < minCells && target[l] >= 0) owner[c] = target[l]; }
  }
}
export function repairSeas(m, log) {
  const grid = CG; // the checker's own grid: traced outlines then re-rasterise to exactly the same cells
  const land = landMask(m, grid), lake = lakeMask(m, grid);
  const water = i => !land[i] && !lake[i];
  const owner = new Int16Array(grid.w * grid.h).fill(-1);
  const seas = m.seas;
  // A storm belt is an overlay over other seas: it keeps its whole outline as `stormZone` and, as a sea, only the
  // water no other sea claims. Elsewhere the smaller sea keeps contested water.
  for (const s of seas) if (s.kind === 'storm_belt' && !s.stormZone) {
    s.stormZone = clone(s.geometry);
    log.push({ rule: 'seas', id: s.id, action: 'storm belt: its drawn outline is kept as stormZone (the attrition overlay); as a sea it keeps the water no other sea claims' });
  }
  const order = seas.map((s, k) => ({ k, a: G.geometryAreaPx(s.geometry), storm: s.kind === 'storm_belt' ? 1 : 0 })).sort((p, q) => q.storm - p.storm || q.a - p.a || p.k - q.k);
  const tmp = new Uint8Array(grid.w * grid.h);
  for (const { k } of order) {
    tmp.fill(0);
    G.rasterizeInto(seas[k].geometry, grid, tmp, 1);
    for (let i = 0; i < tmp.length; i++) if (tmp[i] && water(i)) owner[i] = k;
  }
  let unclaimed = 0;
  for (let i = 0; i < owner.length; i++) if (owner[i] < 0 && water(i)) unclaimed++;
  G.growLabels(owner, grid, i => water(i));
  const rest = Int16Array.from(owner);
  G.growLabels(rest, grid, () => true);
  for (let i = 0; i < owner.length; i++) if (owner[i] < 0 && water(i)) owner[i] = rest[i];
  absorbSlivers(owner, grid, seas.length, 6);
  // Each sea is re-traced from its cells; a sea whose cells are unchanged keeps its drawn outline.
  for (let k = 0; k < seas.length; k++) {
    const s = seas[k];
    const old = G.rasterize(s.geometry, grid);
    let x0 = grid.w, y0 = grid.h, x1 = -1, y1 = -1, same = true;
    for (let j = 0; j < grid.h; j++) for (let i = 0; i < grid.w; i++) {
      const c = j * grid.w + i;
      if (owner[c] === k) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j; }
      if ((owner[c] === k) !== (old[c] === 1)) same = false;
    }
    if (x1 < 0) { log.push({ rule: 'seas', id: s.id, action: 'UNRESOLVED: the sea keeps no water', unresolved: true }); continue; }
    if (same && !G.geometryDefects(s.geometry).length) continue;
    const sub = { ox: (x0 - 2) * grid.cell, oy: (y0 - 2) * grid.cell, cell: grid.cell, w: x1 - x0 + 5, h: y1 - y0 + 5 };
    const mask = new Uint8Array(sub.w * sub.h);
    for (let j = 0; j < sub.h; j++) for (let i = 0; i < sub.w; i++) {
      const gi = i + x0 - 2, gj = j + y0 - 2;
      if (gi >= 0 && gj >= 0 && gi < grid.w && gj < grid.h && owner[gj * grid.w + gi] === k) mask[j * sub.w + i] = 1;
    }
    const g = G.vectorize(mask, sub, { tolerances: [1.0, 0.8, 0.6, 0.4, 0], minPartPx: 4, minHolePx: 4 });
    if (!g) { log.push({ rule: 'seas', id: s.id, action: 'UNRESOLVED: could not trace the sea', unresolved: true }); continue; }
    const before = G.geometryAreaPx(s.geometry);
    s.geometry = g;
    log.push({ rule: 'seas', id: s.id, action: `re-traced from its water (${Math.round(before)} px to ${Math.round(G.geometryAreaPx(g))} px)` });
  }
  if (unclaimed) log.push({ rule: 'seas', id: 'seas', action: `${unclaimed} unclaimed water cells (4 px) given to the nearest sea` });
  // Anchors stay in their sea.
  for (const s of seas) {
    if (!Array.isArray(s.anchor) || pointInGeometry(s.anchor[0], s.anchor[1], s.geometry)) continue;
    const grid2 = G.makeGrid(G.geometryBounds(s.geometry), 4, 1);
    const mask = G.rasterize(s.geometry, grid2), dist = G.insideDistance(mask, grid2);
    let best = -1;
    for (let i = 0; i < dist.length; i++) if (best < 0 || dist[i] > dist[best]) best = i;
    const q = G.cellCentre(grid2, best % grid2.w, Math.floor(best / grid2.w));
    log.push({ rule: 'seas', id: s.id, action: `anchor moved into the sea (${s.anchor} to ${q.map(r4)})` });
    s.anchor = q.map(r4);
  }
}

// ---------------------------------------------------------------------------------------------------- J regions
export function repairRegions(m, log) {
  const grid = CG;
  const regions = m.regions.filter(r => r.kind === 'region');
  if (!m.regions.some(r => r.id === 'region_nether') && m.lands.some(l => l.id === 'land_nether_island')) {
    const dead = m.regions.find(r => r.id === 'region_dead_lands');
    const nether = {
      id: 'region_nether', name: 'The Nether', established: true, source: 'vault', kind: 'region', elevation: 'Volcanic upland 2 to 5.',
      geometry: null, areaPx: 0, parent: 'dead_lands',
      climate: 'Volcanic heat.', season: 'Burning all year.', terrain: { mountain: 0.35, hills: 0.3, desert: 0.2, plains: 0.15 }, snowShare: 0,
      density: { provincesPerState: [3, 3, 4], provinceAreaPx: 2600 }, people: 'The King of Demons and the Netherborn houses (the extent of his domain is unknown).',
      fertility: 'Almost none; ash fields.', ranges: ['Nether Mountains'], naturalBorders: ['The Nether Sound', 'The Ember Narrows', 'The Sea of Lava'],
      notes: 'Vault: the Nether lies in the south of the Dead Lands (region_dead_lands) and is the seat of the King of Demons. A region of its own within region_dead_lands, below it, so that the import gives it its own states; the repair adds it.',
    };
    m.regions.splice(dead ? m.regions.indexOf(dead) + 1 : m.regions.length, 0, nether);
    regions.splice(dead ? regions.indexOf(dead) + 1 : regions.length, 0, nether);
    log.push({ rule: 'regions', id: 'region_nether', action: 'added region_nether (within region_dead_lands)' });
  }
  const land = new Int16Array(grid.w * grid.h).fill(-1);
  m.lands.forEach((l, k) => { const t = G.rasterize(l.geometry, grid); for (let i = 0; i < t.length; i++) if (t[i]) land[i] = k; });
  const owner = new Int16Array(grid.w * grid.h).fill(-1);
  const order = regions.map((r, k) => ({ k, a: r.geometry ? G.geometryAreaPx(r.geometry) : 0 })).sort((p, q) => q.a - p.a || p.k - q.k);
  const tmp = new Uint8Array(grid.w * grid.h);
  const orig = regions.map(r => r.geometry ? G.rasterize(r.geometry, grid) : new Uint8Array(grid.w * grid.h));
  for (const { k } of order) { const t = orig[k]; for (let i = 0; i < t.length; i++) if (t[i]) owner[i] = k; }
  // The Nether: its land and a margin of its sea.
  const netherK = regions.findIndex(r => r.id === 'region_nether');
  const netherLand = m.lands.findIndex(l => l.id === 'land_nether_island');
  if (netherK >= 0 && netherLand >= 0) {
    tmp.fill(0);
    for (let i = 0; i < land.length; i++) if (land[i] === netherLand) tmp[i] = 1;
    const zone = G.dilate(tmp, grid, 4);
    for (let i = 0; i < zone.length; i++) if (zone[i] && (land[i] < 0 || land[i] === netherLand)) owner[i] = netherK;
  }
  // Land no region claims: the region its land names (when it names exactly one), else the nearest region.
  const byRegionKey = new Map(regions.map((r, k) => [r.id.replace(/^region_/u, ''), k]));
  let orphans = 0;
  const assigned = new Int16Array(owner.length).fill(-1);
  for (let i = 0; i < owner.length; i++) {
    if (owner[i] >= 0 || land[i] < 0) continue;
    orphans++;
    const names = m.lands[land[i]].regions ?? [];
    if (names.length === 1 && byRegionKey.has(names[0])) assigned[i] = byRegionKey.get(names[0]);
  }
  const near = Int16Array.from(owner);
  G.growLabels(near, grid, () => true);
  for (let i = 0; i < owner.length; i++) if (owner[i] < 0 && land[i] >= 0) { if (assigned[i] < 0) assigned[i] = near[i]; owner[i] = assigned[i]; }
  // A margin of two cells of unowned water around assigned land, so that coasts stay covered.
  const margin = new Int16Array(owner.length).fill(-1);
  for (let i = 0; i < owner.length; i++) if (assigned[i] >= 0) margin[i] = assigned[i];
  G.growLabels(margin, grid, i => owner[i] < 0, 2);
  for (let i = 0; i < owner.length; i++) if (owner[i] < 0 && margin[i] >= 0) owner[i] = margin[i];
  if (orphans) log.push({ rule: 'regions', id: 'regions', action: `${orphans} unclaimed land cells (4 px) given to a region` });
  regions.forEach((r, k) => {
    let changed = !r.geometry || G.geometryDefects(r.geometry).length > 0;
    let x0 = grid.w, y0 = grid.h, x1 = -1, y1 = -1;
    for (let j = 0; j < grid.h; j++) for (let i = 0; i < grid.w; i++) {
      const c = j * grid.w + i;
      if (owner[c] === k) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j; }
      if (!changed && (owner[c] === k) !== (orig[k][c] === 1)) changed = true;
    }
    if (changed && x1 >= 0) {
      const sub = { ox: (x0 - 2) * grid.cell, oy: (y0 - 2) * grid.cell, cell: grid.cell, w: x1 - x0 + 5, h: y1 - y0 + 5 };
      const mask = new Uint8Array(sub.w * sub.h);
      for (let j = 0; j < sub.h; j++) for (let i = 0; i < sub.w; i++) {
        const gi = i + x0 - 2, gj = j + y0 - 2;
        if (gi >= 0 && gj >= 0 && gi < grid.w && gj < grid.h && owner[gj * grid.w + gi] === k) mask[j * sub.w + i] = 1;
      }
      const g = G.vectorize(mask, sub, { tolerances: [1.0, 0.8, 0.6, 0.4, 0], minPartPx: 4, minHolePx: 4 });
      if (g) { r.geometry = g; log.push({ rule: 'regions', id: r.id, action: 're-traced from its cells' }); }
      else log.push({ rule: 'regions', id: r.id, action: 'UNRESOLVED: could not trace the region', unresolved: true });
    }
    const a = Math.round(G.geometryAreaPx(r.geometry));
    if (r.areaPx !== a) { if (r.areaPx && Math.abs(r.areaPx - a) / a > 0.25) log.push({ rule: 'regions', id: r.id, action: `areaPx ${r.areaPx} to ${a}` }); r.areaPx = a; }
  });
}

// ---------------------------------------------------------------------------------------------------- K rivers
export function reliefSampler(m, land) {
  const BX = 64, BY = 32;
  const buckets = Array.from({ length: BX * BY }, () => ({ ranges: [], volcanoes: [], hills: [] }));
  const put = (key, f, b) => {
    for (let by = Math.max(0, Math.floor(b[1] * BY)); by <= Math.min(BY - 1, Math.floor(b[3] * BY)); by++)
      for (let bx = Math.max(0, Math.floor(b[0] * BX)); bx <= Math.min(BX - 1, Math.floor(b[2] * BX)); bx++) buckets[by * BX + bx][key].push(f);
  };
  for (const r of m.ranges) { const hw = r.halfWidth ?? 0.005, b = G.boundsOf(r.geometry.coordinates), d = hw * 3.7; put('ranges', r, [b[0] - d, b[1] - 2 * d, b[2] + d, b[3] + 2 * d]); }
  for (const v of m.volcanoes) { const [x, y] = v.geometry.coordinates; put('volcanoes', v, [x - 0.0125, y - 0.025, x + 0.0125, y + 0.025]); }
  for (const h of m.hills) if (h.kind !== 'chasm') put('hills', h, G.geometryBounds(h.geometry));
  const ctx = { land };
  return (x, y) => {
    const b = buckets[Math.min(BY - 1, Math.max(0, Math.floor(y * BY))) * BX + Math.min(BX - 1, Math.max(0, Math.floor(x * BX)))];
    return reliefClassAt(b, x, y, ctx);
  };
}
/** The checker's river findings for one river (the whole model is checked so that confluences count). */
function riverFindings(m, river) {
  // Only the rivers the mouth could join take part, so that the check stays cheap; the result is the checker's own.
  const end = river.geometry.coordinates[river.geometry.coordinates.length - 1];
  const rivers = m.rivers.filter(o => o === river || distanceToPath(end[0], end[1], o.geometry.coordinates) < 0.01);
  const mini = { schemaVersion: 1, frame: m.frame, lands: m.lands, lakes: m.lakes, ranges: m.ranges, volcanoes: m.volcanoes, hills: m.hills, rivers };
  return checkModel(mini).errors.filter(e => e.id === river.id && e.code.startsWith('RIVER_'));
}
class Heap {
  constructor() { this.k = []; this.v = []; }
  get size() { return this.k.length; }
  push(key, val) {
    const k = this.k, v = this.v; let i = k.length; k.push(key); v.push(val);
    while (i > 0) { const p = (i - 1) >> 1; if (k[p] < key || (k[p] === key && v[p] <= val)) break; k[i] = k[p]; v[i] = v[p]; i = p; }
    k[i] = key; v[i] = val;
  }
  pop() {
    const k = this.k, v = this.v, topK = k[0], topV = v[0], lk = k.pop(), lv = v.pop();
    if (k.length) {
      let i = 0; const n = k.length;
      for (;;) { let c = 2 * i + 1; if (c >= n) break; if (c + 1 < n && (k[c + 1] < k[c] || (k[c + 1] === k[c] && v[c + 1] < v[c]))) c++; if (k[c] > lk || (k[c] === lk && v[c] >= lv)) break; k[i] = k[c]; v[i] = v[c]; i = c; }
      k[i] = lk; v[i] = lv;
    }
    return [topK, topV];
  }
}
/**
 * Least-cost route on a 2 px grid from `from` with a non-increasing relief cap: a step into a cell of class k is
 * allowed when k <= cap and lowers the cap to k. Goals: water (class 0 or a lake) or cells of `targets` (sample
 * index by cell). Cost per pixel: 1 + 0.25 * class (+ a penalty for leaving `course`, when given).
 */
function route({ from, cap, relief, lakeCG, course = null, targets = null, water = false, reach = 0.03, avoid = null, lakeOk = null }) {
  const pts = [from, ...(course ?? []), ...(targets ? targets.map(t => t.p) : [])];
  const b = G.boundsOf(pts);
  const grid = G.makeGrid([b[0] - reach, b[1] - 2 * reach, b[2] + reach, b[3] + 2 * reach].map((v, i) => Math.min(1, Math.max(0, v))), 2, 0);
  const n = grid.w * grid.h;
  const cls = new Int8Array(n).fill(-1);
  const classOf = c => { if (cls[c] < 0) { const p = G.cellCentre(grid, c % grid.w, Math.floor(c / grid.w)); cls[c] = relief(p[0], p[1]); } return cls[c]; };
  const isLake = c => { const p = G.cellCentre(grid, c % grid.w, Math.floor(c / grid.w)); return lakeCG[G.cellIndexOf(CG, p)] === 1 && (!lakeOk || lakeOk(p)); };
  const avoidCache = new Int8Array(n).fill(-1);
  const avoided = c => { if (!avoid) return false; if (avoidCache[c] < 0) avoidCache[c] = G.closestOnPath(G.cellCentre(grid, c % grid.w, Math.floor(c / grid.w)), avoid, false).dist < 4 ? 1 : 0; return avoidCache[c] === 1; };
  const targetAt = new Map();
  if (targets) for (const t of targets) { const c = G.cellIndexOf(grid, t.p); if (c >= 0 && !targetAt.has(c)) targetAt.set(c, t.k); }
  const devCache = new Float32Array(n).fill(-1);
  const dev = c => { if (!course) return 0; if (devCache[c] < 0) devCache[c] = G.closestOnPath(G.cellCentre(grid, c % grid.w, Math.floor(c / grid.w)), course, false).dist; return devCache[c]; };
  const start = G.cellIndexOf(grid, from);
  if (start < 0) return null;
  const S = 6, dist = new Float64Array(n * S).fill(Infinity), prev = new Int32Array(n * S).fill(-1);
  const heap = new Heap();
  const s0 = start * S + cap;
  dist[s0] = 0; heap.push(0, s0);
  const steps = [[1, 0, 2], [-1, 0, 2], [0, 1, 2], [0, -1, 2], [1, 1, 2.83], [-1, 1, 2.83], [1, -1, 2.83], [-1, -1, 2.83]];
  let goal = -1;
  while (heap.size) {
    const [d, st] = heap.pop();
    if (d > dist[st]) continue;
    const c = (st / S) | 0, cp = st % S;
    if (st !== s0) {
      if (water && (classOf(c) === 0 || isLake(c))) { goal = st; break; }
      if (targetAt.has(c)) { goal = st; break; }
    }
    const i = c % grid.w, j = (c - i) / grid.w;
    for (const [di, dj, len] of steps) {
      const x = i + di, y = j + dj;
      if (x < 0 || y < 0 || x >= grid.w || y >= grid.h) continue;
      const nc = y * grid.w + x, k = classOf(nc);
      if (k === 0 && !water) continue;
      if (k > cp || avoided(nc)) continue;
      const ncap = k === 0 ? cp : Math.min(cp, k);
      const dv = dev(nc);
      const w = len * (1 + 0.25 * k + (course ? 0.5 * (dv / 6) * (dv / 6) : 0));
      const ns = nc * S + ncap;
      if (d + w < dist[ns]) { dist[ns] = d + w; prev[ns] = st; heap.push(d + w, ns); }
    }
  }
  if (goal < 0) return null;
  const path = [];
  for (let st = goal; st >= 0; st = prev[st]) { const c = (st / S) | 0; path.push(G.cellCentre(grid, c % grid.w, Math.floor(c / grid.w))); }
  path.reverse();
  path[0] = from;
  const gc = (goal / S) | 0;
  return { path, cap: goal % S, k: targetAt.get(gc) ?? -1 };
}

/** A river ending within this distance (frame-width units) of a desert ends in that desert's basin. */
export const ENDORHEIC_DESERT_REACH = 0.02;
/** ... and is endorheic when the nearest water downhill is farther than this (pixels). */
export const ENDORHEIC_MIN_EXTENSION_PX = 150;
/** A polyline without its last `px` pixels. */
function trimTail(c, px) {
  let rest = px; const out = c.slice();
  while (out.length > 1 && rest > 0) { const d = G.distPx(out[out.length - 1], out[out.length - 2]); if (d > rest) { const t = rest / d, a = out[out.length - 2], b = out[out.length - 1]; out[out.length - 1] = [b[0] + (a[0] - b[0]) * t, b[1] + (a[1] - b[1]) * t]; break; } rest -= d; out.pop(); }
  return out.length >= 2 ? out : null;
}
/** A polyline without its first `px` pixels. */
function trimHead(c, px) {
  const r = trimTail(c.slice().reverse(), px);
  return r ? r.reverse() : null;
}
/** Walk one river downstream with a non-increasing relief cap; returns { coords, notes, endorheic, closed }. */
export function walkRiver(r, env) {
  const { relief, lakeCG, nearLake, lakeIndexAt, reachesWater, deserts } = env;
  const c0 = r.geometry.coordinates;
  const course = c0.map(p => [p[0], p[1]]);
  const dense = G.densifyLine(c0, 2);
  const cls = dense.map(d => relief(d.p[0], d.p[1]));
  const total = dense.length;
  const notes = [];
  let s = 0;
  while (s < total - 1 && cls[s] === 0) s++;
  if (s > 0) notes.push('source moved out of the water onto land');
  const lakeOutlet = s === 0 && nearLake(dense[0].p);
  const sourceLake = nearLake(dense[s].p) ? lakeIndexAt(dense[s].p) : -1;
  let out = [dense[s].p], cap = Math.max(1, cls[s]), i = s, src = s, ended = false;
  while (i < total - 1) {
    const j = i + 1;
    if (cls[j] === 0 || cls[j] <= cap) {
      if (dense[j].v >= 0 || j === total - 1) out.push(dense[j].p);
      if (cls[j] > 0) cap = Math.min(cap, cls[j]);
      i = j; continue;
    }
    let e = j;
    while (e < total && !(cls[e] > 0 && cls[e] <= cap)) e++;
    // (a) round the higher ground and rejoin the drawn course
    const targets = [];
    for (let k = e; k < total; k++) if (cls[k] > 0 && cls[k] <= cap) targets.push({ p: dense[k].p, k });
    const res = targets.length ? route({ from: dense[i].p, cap, relief, lakeCG, course, targets, reach: 0.02 }) : null;
    if (res && G.lineLengthPx(res.path) <= 2.5 * G.lineLengthPx(dense.slice(i, res.k + 1).map(d => d.p)) + 80) {
      if (out[out.length - 1] !== dense[i].p) out.push(dense[i].p);
      out.push(...G.simplifyLine(res.path, 1.0).slice(1, -1), dense[res.k].p);
      cap = Math.min(res.cap, cls[res.k]);
      i = res.k;
      notes.push('a stretch re-routed around higher ground');
      continue;
    }
    // (b) the drawn source lies below ground the river crosses early: the river rises on that high ground instead
    if (!lakeOutlet && i - src < 0.35 * (total - src)) {
      let peak = j;
      for (let k = j; k < Math.min(e, total); k++) if (cls[k] > cls[peak]) peak = k;
      out = [dense[peak].p]; cap = cls[peak]; i = peak; src = peak;
      notes.push('source raised onto the high ground the drawn course crossed');
      continue;
    }
    // (c) the river ends before the higher ground and finds its own way to water
    if (out[out.length - 1] !== dense[i].p) out.push(dense[i].p);
    notes.push('drawn course left before higher ground');
    ended = true;
    break;
  }
  let endorheic = null, closed = false;
  const end = out[out.length - 1];
  if (!reachesWater(end) || out.length < 2) {
    // The river may not flow back along itself or into the lake it leaves.
    const own = out.length >= 2 ? trimTail(out, 10) : null;
    const lakeOk = p => sourceLake < 0 || lakeIndexAt(p) !== sourceLake;
    let ext = null;
    for (const reach of [0.03, 0.07, 0.15]) { ext = route({ from: end, cap, relief, lakeCG, water: true, reach, avoid: own, lakeOk }); if (ext) break; }
    const desert = deserts.find(d => pointInGeometry(end[0], end[1], d.geometry) || distanceToGeometry(end[0], end[1], d.geometry) < ENDORHEIC_DESERT_REACH);
    const extLen = ext ? G.lineLengthPx(ext.path) : Infinity;
    if (desert && extLen > ENDORHEIC_MIN_EXTENSION_PX && out.length >= 2) { endorheic = desert; notes.push(`marked endorheic: it dies at ${desert.name}, ${ext ? `${Math.round(extLen)} px` : 'too far'} from water downhill`); }
    else if (ext) { out.push(...G.simplifyLine(ext.path, 1.0).slice(1)); notes.push(`extended ${Math.round(extLen)} px along low ground to water`); }
    else { closed = true; notes.push('no water reachable downhill: the drawn course crosses higher ground the relief model has no gap in'); }
  }
  void ended;
  return { coords: G.dedupeLine(out.map(pt5), 0.3), notes, endorheic, closed };
}

export function repairRivers(m, log) {
  const land = landMask(m), lakeCG = lakeMask(m);
  const relief = reliefSampler(m, land);
  const lakeRasters = m.lakes.map(l => G.rasterize(l.geometry, CG));
  const nearLake = p => { const k = G.cellIndexOf(CG, p); return lakeRasters.some(t => t[k]) || m.lakes.some(l => distanceToGeometry(p[0], p[1], l.geometry) < 0.004); };
  const lakeIndexAt = p => { const k = G.cellIndexOf(CG, p); const i = lakeRasters.findIndex(t => t[k]); if (i >= 0) return i; let best = -1, bd = 0.004; m.lakes.forEach((l, j) => { const d = distanceToGeometry(p[0], p[1], l.geometry); if (d < bd) { bd = d; best = j; } }); return best; };
  for (const r of m.rivers) {
    const before = riverFindings(m, r);
    if (!before.length) continue;
    const reachesWater = p => {
      const k = G.cellIndexOf(CG, p);
      if (nearLake(p) || !land[k] || lakeCG[k]) return true;
      if (m.lands.every(l => !pointInGeometry(p[0], p[1], l.geometry)) || m.lands.some(l => distanceToGeometry(p[0], p[1], l.geometry) < 0.003)) return true;
      return m.rivers.some(o => o !== r && distanceToPath(p[0], p[1], o.geometry.coordinates) < 0.004);
    };
    const res = walkRiver(r, { relief, lakeCG, nearLake, lakeIndexAt, reachesWater, deserts: m.deserts });
    const saved = r.geometry;
    r.geometry = { type: 'LineString', coordinates: res.coords };
    if (res.endorheic) { r.endorheic = true; r.basin = res.endorheic.id; }
    let after = riverFindings(m, r);
    // Rounding can put a vertex on the far side of a relief boundary: try the densified course, then a source a few
    // pixels further downstream, and keep the first variant the checker accepts.
    const variants = [];
    if (res.coords.length > 2) variants.push(G.dedupeLine(G.densifyLine(res.coords, 3).map(d => pt5(d.p)), 0.3));
    for (const px of [2, 4, 6, 9, 12]) { const t = trimHead(res.coords, px); if (t) variants.push(t.map(pt5)); }
    for (const v of variants) {
      if (!after.length) break;
      r.geometry = { type: 'LineString', coordinates: v };
      const f = riverFindings(m, r);
      if (f.length < after.length) after = f; else r.geometry = { type: 'LineString', coordinates: res.coords };
      if (!f.length) { r.geometry = { type: 'LineString', coordinates: v }; break; }
    }
    if (res.coords.length < 2 || res.closed) {
      // Nothing valid to offer: the drawn course stays as it is and the finding is reported.
      r.geometry = saved; delete r.endorheic; delete r.basin; after = before;
    }
    const unique = [...new Set(res.notes)].map(n => { const c = res.notes.filter(x => x === n).length; return c > 1 ? `${n} (${c} times)` : n; });
    log.push({ rule: 'rivers', id: r.id, action: `${unique.join('; ') || 'course adjusted'}${after.length ? ` - UNRESOLVED: ${after.map(e => e.code).join(', ')}` : ''}`, unresolved: after.length > 0 });
  }
}

// ---------------------------------------------------------------------------------------------------- M metadata
export function refreshMetadata(m, original) {
  const byId = new Map();
  for (const array of FEATURE_ARRAYS) for (const f of original[array] ?? []) byId.set(f.id, f);
  for (const array of FEATURE_ARRAYS) for (const f of m[array] ?? []) {
    const o = byId.get(f.id);
    const changed = !o || JSON.stringify(o.geometry) !== JSON.stringify(f.geometry);
    if (!changed) continue;
    if (array === 'lands') {
      f.areaPx = Math.round(G.geometryAreaPx(f.geometry));
      const b = G.geometryBounds(f.geometry);
      f.bbox = b.map(r4);
    }
    if (array === 'seas' && f.areaPx !== undefined) f.areaPx = Math.round(G.geometryAreaPx(f.geometry));
    const sheetId = f.drawing?.sheet ?? f.drawingOffSheet ?? (array !== 'lands' && array !== 'seas' && array !== 'regions' && f.region === 'nether' ? 'dead' : null);
    const s = sheetId ? m.sheets?.[sheetId] : null;
    if (!s) continue;
    const d = mapCoords(f.geometry, p => toDrawing(s, p).map(r4));
    const box = s.drawingBox, tol = 0.005;
    if (allPoints(d).every(p => p[0] >= box[0] - tol && p[0] <= box[2] + tol && p[1] >= box[1] - tol && p[1] <= box[3] + tol)) { f.drawing = { sheet: sheetId, ...d }; delete f.drawingOffSheet; }
    else { delete f.drawing; f.drawingOffSheet = sheetId; } // the repaired place lies past the edge of its sheet
  }
  m.featureCounts = Object.fromEntries(FEATURE_ARRAYS.map(a => [a, (m[a] ?? []).length]));
}

// ---------------------------------------------------------------------------------------------------- the repair
/**
 * Repair a model. Returns { model, log, moves } where `model` is a new object (the input is not changed), `log` the
 * list of actions ({ rule, id, action, unresolved? }) and `moves` the lands moved out of the bands.
 */
export function repairModel(input, opts = OPTIONS) {
  const original = clone(input);
  const m = clone(input);
  const log = [];
  repairRings(m, log);
  repairNether(m, log);
  const moves = repairEdges(m, log, opts);
  repairRings(m, log);
  repairLakes(m, log, opts);
  repairBiomes(m, log, opts);
  trimToCoasts(m, log);
  repairRanges(m, log, opts);
  repairPoints(m, log);
  repairSeas(m, log);
  repairRegions(m, log);
  repairRivers(m, log);
  refreshMetadata(m, original);
  m.repair = {
    tool: 'tools/content/geography/repair_model.mjs',
    note: 'Physical repair of the geography model: rings, the Nether, open-sea edge bands, lakes, terrain areas, ranges, points, seas, regions and rivers. Names are unchanged.',
    coasts: G.COASTS,
    // Lands moved out of a band, kept across runs so that a repaired model regenerates the same overrides.
    moved: [...(input.repair?.moved ?? []), ...moves.map(mv => ({ id: mv.id, vector: mv.vector, carried: mv.carried }))],
  };
  return { model: m, log, moves };
}

// ---------------------------------------------------------------------------------------------------- overrides
const ringOut = ring => ring.map(p => [r4(p[0]), r4(p[1])]);
/**
 * The surface override file: polygons forced to sea over the drawing's land in the four bands (shaped to the natural
 * coasts), then, for each land the repair moved, its drawn place forced to sea and its new place forced to land, and
 * the Nether (whose southern part lies past the edge of its sheet) forced to land. Later entries win.
 */
export function buildOverrides(repaired) {
  const surface = G.SIDE_ORDER.map(side => ({ id: `edge_${side}_open_sea`, kind: 'sea', polygon: G.bandPolygon(side) }));
  for (const mv of repaired.repair?.moved ?? []) {
    const land = repaired.lands.find(l => l.id === mv.id);
    if (!land) continue;
    const from = translate(land.geometry, [-mv.vector[0], -mv.vector[1]]);
    ringsOf(from).forEach((part, k) => surface.push({ id: `${mv.id}_vacated${k ? `_${k}` : ''}`, kind: 'sea', polygon: ringOut(part[0]) }));
    ringsOf(land.geometry).forEach((part, k) => surface.push({ id: `${mv.id}_moved${k ? `_${k}` : ''}`, kind: 'land', polygon: ringOut(part[0]), ...(part.length > 1 ? { holes: part.slice(1).map(ringOut) } : {}) }));
  }
  const nether = repaired.lands.find(l => l.id === 'land_nether_island');
  if (nether) ringsOf(nether.geometry).forEach((part, k) => surface.push({ id: `land_nether_island${k ? `_${k}` : ''}`, kind: 'land', polygon: ringOut(part[0]) }));
  return {
    schemaVersion: 1,
    name: 'Aoaz surface overrides: open-sea edge bands, moved lands and the Nether',
    frame: { widthPx: G.W, heightPx: G.H, units: 'normalised', origin: 'top-left' },
    generatedBy: 'tools/content/geography/repair_model.mjs (deterministic; regenerate, do not edit by hand)',
    precedence: 'Entries apply in order over the drawing\'s surface; a later entry wins where entries overlap.',
    note: 'Requirement R-18: the engine wraps the map, so the bands x < 0.04, x > 0.96, y < 0.025 and y > 0.975 are open sea. The band polygons follow the natural coasts of the repaired model (seeded fractal noise per edge id).',
    surface,
  };
}

// ---------------------------------------------------------------------------------------------------- drawing agreement
/** Land IoU per region against the drawing (before: the input model; after: the repaired model and the overrides). */
export async function drawingAgreement(before, after, overrides, jpgPath) {
  const dm = await import('./drawing_mask.mjs');
  const grid = CG;
  const bySheet = await dm.drawingLandBySheet(after, jpgPath, grid);
  const landOf = mm => { const l = landMask(mm, grid); return l; };
  const lb = landOf(before), la = landOf(after);
  const regions = after.regions.filter(r => r.kind === 'region');
  const zone = new Int16Array(grid.w * grid.h).fill(-1);
  regions.forEach((r, k) => { const t = G.rasterize(r.geometry, grid); for (let i = 0; i < t.length; i++) if (t[i] && zone[i] < 0) zone[i] = k; });
  G.growLabels(zone, grid, () => true);
  const sheetsOf = new Map();
  for (const array of FEATURE_ARRAYS) for (const f of before[array] ?? []) if (f.drawing?.sheet && f.region) {
    if (!sheetsOf.has(f.region)) sheetsOf.set(f.region, new Set());
    sheetsOf.get(f.region).add(f.drawing.sheet);
  }
  for (const array of FEATURE_ARRAYS) for (const f of after[array] ?? []) { const sh = f.drawing?.sheet ?? f.drawingOffSheet; if (sh && f.region) { if (!sheetsOf.has(f.region)) sheetsOf.set(f.region, new Set()); sheetsOf.get(f.region).add(sh); } }
  const forced = new Uint8Array(grid.w * grid.h).fill(255);
  for (const e of overrides?.surface ?? []) {
    const g = { type: 'Polygon', coordinates: [e.polygon, ...(e.holes ?? [])] };
    G.rasterizeInto(g, grid, forced, e.kind === 'land' ? 1 : 0);
  }
  const rows = [];
  const all = { b: [0, 0], a: [0, 0], ar: [0, 0] };
  regions.forEach((r, k) => {
    const key = r.id.replace(/^region_/u, '');
    const ids = sheetsOf.has(key) ? [...sheetsOf.get(key)] : [];
    if (!ids.length) { rows.push({ region: r.id, sheets: [], before: null, after: null, afterRaw: null }); return; }
    const d = dm.combineSheets(bySheet, ids);
    const acc = { b: [0, 0], a: [0, 0], ar: [0, 0] };
    for (let i = 0; i < d.length; i++) {
      if (zone[i] !== k || d[i] === 255) continue;
      const dd = d[i] === 1, df = forced[i] === 255 ? dd : forced[i] === 1;
      const B = lb[i] === 1, A = la[i] === 1;
      if (B && dd) acc.b[0]++; if (B || dd) acc.b[1]++;
      if (A && df) acc.a[0]++; if (A || df) acc.a[1]++;
      if (A && dd) acc.ar[0]++; if (A || dd) acc.ar[1]++;
    }
    for (const key2 of ['b', 'a', 'ar']) { all[key2][0] += acc[key2][0]; all[key2][1] += acc[key2][1]; }
    const f = v => (v[1] ? v[0] / v[1] : null);
    rows.push({ region: r.id, sheets: ids.sort(), before: f(acc.b), after: f(acc.a), afterRaw: f(acc.ar) });
  });
  const f = v => (v[1] ? v[0] / v[1] : null);
  return { rows, total: { before: f(all.b), after: f(all.a), afterRaw: f(all.ar) } };
}

// ---------------------------------------------------------------------------------------------------- command line
const countBy = list => list.reduce((o, e) => { o[e.code] = (o[e.code] ?? 0) + 1; return o; }, {});
export const isNameCode = code => code.startsWith('NAME_') || code.startsWith('SEA_NAME') || ['SEA_STEM_DUPLICATE', 'SEA_MEANING_DUPLICATE', 'SEA_CONTRADICTION', 'REGION_NAME_TERRAIN', 'DARDAN_PLACED'].includes(code);

async function main(argv) {
  const args = argv.slice(2);
  const flag = (name, takesValue = true) => { const i = args.indexOf(name); if (i < 0) return undefined; if (!takesValue) { args.splice(i, 1); return true; } const v = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : null; args.splice(i, v === null ? 1 : 2); return v; };
  const inPath = flag('--in') ?? DEFAULT_MODEL_PATH;
  const overridesPath = flag('--overrides');
  const reportPath = flag('--report');
  const drawing = flag('--drawing');
  const outPath = args[0];
  if (outPath && path.resolve(outPath) === path.resolve(DEFAULT_MODEL_PATH)) throw new Error('refusing to overwrite aoaz.json');
  if (outPath && path.resolve(outPath) === path.resolve(inPath)) throw new Error('refusing to overwrite the input model');
  const input = JSON.parse(readFileSync(inPath, 'utf8'));
  const t0 = checkModel(input);
  const { model, log } = repairModel(input);
  const t1 = checkModel(model);
  const overrides = buildOverrides(model);
  const summary = { before: countBy(t0.errors), after: countBy(t1.errors), actions: {}, unresolved: log.filter(e => e.unresolved), remainingPhysical: t1.errors.filter(e => !isNameCode(e.code)) };
  for (const e of log) summary.actions[e.rule] = (summary.actions[e.rule] ?? 0) + 1;
  if (drawing !== undefined) {
    const jpg = drawing ?? DEFAULT_DRAWING_PATH;
    if (existsSync(jpg)) summary.drawing = await drawingAgreement(input, model, overrides, jpg);
    else summary.drawing = `drawing not found at ${jpg}`;
  }
  if (outPath) writeFileSync(outPath, `${JSON.stringify(model, null, 1)}\n`);
  if (overridesPath) writeFileSync(overridesPath, `${JSON.stringify(overrides, null, 1)}\n`);
  if (reportPath) writeFileSync(reportPath, `${JSON.stringify({ summary, log }, null, 1)}\n`);
  const codes = [...new Set([...Object.keys(summary.before), ...Object.keys(summary.after)])].sort();
  console.log('errors by code (before -> after):');
  for (const c of codes) console.log(`  ${c.padEnd(26)} ${String(summary.before[c] ?? 0).padStart(4)} -> ${String(summary.after[c] ?? 0).padStart(4)}${isNameCode(c) ? '   (name: reported, not repaired)' : ''}`);
  console.log(`total ${t0.errors.length} -> ${t1.errors.length}; actions: ${Object.entries(summary.actions).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  for (const e of summary.remainingPhysical) console.log(`  remaining ${e.code} ${e.id}: ${e.message}`);
  for (const e of summary.unresolved) console.log(`  unresolved ${e.rule} ${e.id}: ${e.action}`);
  if (summary.drawing && typeof summary.drawing === 'object') {
    console.log('land IoU against the drawing per region (before -> after with overrides; after against the raw drawing):');
    for (const r of summary.drawing.rows) console.log(`  ${r.region.padEnd(24)} ${r.before === null ? '   n/a' : r.before.toFixed(3)} -> ${r.after === null ? '  n/a' : r.after.toFixed(3)}   (raw ${r.afterRaw === null ? 'n/a' : r.afterRaw.toFixed(3)})  sheets ${r.sheets.join('+') || 'none'}`);
    const t = summary.drawing.total;
    console.log(`  ${'all'.padEnd(24)} ${t.before.toFixed(3)} -> ${t.after.toFixed(3)}   (raw ${t.afterRaw.toFixed(3)})`);
  } else if (summary.drawing) console.log(summary.drawing);
  if (!outPath) console.log('(summary only: pass an output path to write the repaired model)');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv).catch(e => { console.error(e); process.exitCode = 1; });
