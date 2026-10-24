// Tests of the steps added to the geography pipeline: sheet registration (sheet_registration.mjs and the repair's
// applyRegistration), model corrections, archipelago moves, gorges, the rename table (name_table.mjs and the repair's
// applyNameTable) and the sheet authority behind the clips and the undrawn-land overrides.
//
// Every rule has a positive case (the defect is fixed) and a negative case (a feature without the defect is left as it
// was, or a second run changes nothing). All rasters and models are synthetic; the private drawing is never read.
//
//   node --test tools/content/geography/geography_steps.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkModel, FEATURE_ARRAYS, pointInGeometry, ringsOf } from './check_model.mjs';
import * as G from './geo_core.mjs';
import {
  applyRegistration, correctModel, correctDarkLands, repairEdges, openGorges, applyNameTable, generatedMask, sheetAuthority,
  buildOverrides, GENERATED,
} from './repair_model.mjs';
import {
  candidate, sheetToWorld, sheetToDrawing, frameInset, insetBox, registerAll, parseLabels, labelExpectation, REGISTRATION, DRAWING_PX,
} from './sheet_registration.mjs';
import { buildNameTable, EXTRA_BANNED, fictionLike, unapplyNames } from './name_table.mjs';
import { chooseLayoutOverrides, importSurface, regionAgreement, LAYOUT } from './layout_overrides.mjs';

const rect = (x0, y0, x1, y1) => ({ type: 'Polygon', coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1]]] });
const feature = (id, geometry, extra = {}) => ({ id, name: id.replace(/_/gu, ' '), established: false, source: 'test', kind: 'test', elevation: 1, geometry, ...extra });
function mini(parts = {}) {
  const m = { schemaVersion: 1, frame: { widthPx: 5120, heightPx: 2560 }, sheets: {}, edges: [] };
  for (const a of FEATURE_ARRAYS) m[a] = [];
  return Object.assign(m, JSON.parse(JSON.stringify(parts)));
}
const codes = (m, ...wanted) => checkModel(m).errors.filter(e => wanted.includes(e.code));
const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

// ---------------------------------------------------------------------------------------------------- registration
// An undistorted sheet: 0.8 world pixels per drawing pixel on both axes.
const K = 0.8;
const SHEET = Object.freeze({ drawingBox: [0.1, 0.1, 0.9, 0.9], drawingAnchor: [0.5, 0.5], worldAnchor: [0.5, 0.5], scaleWorldPerDrawing: [K * DRAWING_PX[0] / G.W, K * DRAWING_PX[1] / G.H], mirrorX: false });
/** A drawing raster (400 x 200) with one drawn island at drawing x 0.4..0.6, y 0.4..0.6, and optional frame lines. */
function drawing({ frame = false } = {}) {
  const w = 400, h = 200, land = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (x + 0.5) / w, dy = (y + 0.5) / h;
    if (dx >= 0.4 && dx <= 0.6 && dy >= 0.4 && dy <= 0.6) land[y * w + x] = 1;
    if (frame && x >= 40 && x <= 41) land[y * w + x] = 1; // a pencil frame line two pixels inside the left box edge
  }
  return { w, h, land, sha256: 'test' };
}
/** The model: the island where the true sheet puts it; its sheet is recorded shifted by `shift` world units. */
function registeredWorld(shift = [0, 0]) {
  const a = sheetToWorld(SHEET, [0.4, 0.4]), b = sheetToWorld(SHEET, [0.6, 0.6]);
  return mini({
    sheets: { west: { ...SHEET, worldAnchor: [SHEET.worldAnchor[0] + shift[0], SHEET.worldAnchor[1] + shift[1]] } },
    lands: [feature('land_isle', rect(a[0], a[1], b[0], b[1]), { regions: ['test'] })],
    regions: [feature('region_test', rect(0.3, 0.3, 0.7, 0.7), { kind: 'region' })],
    sites: [feature('site_a', { type: 'Point', coordinates: [0.5, 0.5] }, { region: 'test', drawing: { sheet: 'west', type: 'Point', coordinates: [0.5, 0.5] } })],
  });
}
const FAST = { ...REGISTRATION, translateRange: 0.016, translateStep: 0.004, scaleRange: 0.04, scaleStep: 0.04, fineSteps: [0.002, 0.001, 0.0005], rotationRange: 0 };

test('registration: the transforms round-trip in the anchor and the affine form', () => {
  for (const p of [[0, 0, 0, 0, 0], [0.01, -0.02, 0.05, 0.05, 0], [0.01, 0.01, 0.02, -0.01, 0.03]]) {
    const s = candidate(SHEET, p);
    for (const d of [[0.2, 0.3], [0.5, 0.5], [0.85, 0.7]]) { const back = sheetToDrawing(s, sheetToWorld(s, d)); close(back[0], d[0], 1e-9); close(back[1], d[1], 1e-9); }
    assert.equal(!!s.affine, p[4] !== 0, 'only a rotation needs the affine form');
  }
  const same = candidate(SHEET, [0, 0, 0, 0, 0]);
  assert.deepEqual(same.worldAnchor.map(v => Math.round(v * 1e9)), SHEET.worldAnchor.map(v => Math.round(v * 1e9)), 'zero parameters keep the recorded transform');
});

test('registration: a frame line is cut off the paper; land drawn to the paper edge is kept (negative)', () => {
  const inset = frameInset(drawing({ frame: true }), [0.1, 0.1, 0.9, 0.9]);
  assert.ok(inset[0] > 0 && inset[0] < 10, `the left frame line is found (${inset})`);
  assert.deepEqual(inset.slice(1), [0, 0, 0]);
  assert.deepEqual(frameInset(drawing(), [0.1, 0.1, 0.9, 0.9]), [0, 0, 0, 0]);
  // land that runs on from the edge is content, not a frame
  const r = drawing(); for (let y = 0; y < r.h; y++) for (let x = 40; x < 120; x++) r.land[y * r.w + x] = 1;
  assert.equal(frameInset(r, [0.1, 0.1, 0.9, 0.9])[0], 0);
  const box = insetBox([0.1, 0.1, 0.9, 0.9], [8, 0, 0, 0]);
  close(box[0], 0.1 + 8 / DRAWING_PX[0], 1e-6);
});

test('registration: a shifted sheet is moved back onto the model by land IoU; an aligned sheet is kept (negative)', () => {
  const r = registerAll(registeredWorld([0.008, -0.004]), drawing(), [], { opts: FAST }).west;
  assert.match(r.decision, /^refined/u);
  assert.ok(r.iou.after > 0.95 && r.iou.framed < 0.85, `IoU ${r.iou.framed} -> ${r.iou.after}`);
  close(r.after.worldAnchor[0], SHEET.worldAnchor[0], 0.0015);
  close(r.after.worldAnchor[1], SHEET.worldAnchor[1], 0.0015);
  assert.ok(Math.abs(Math.log(r.after.scaleWorldPerDrawing[0] / SHEET.scaleWorldPerDrawing[0]) - Math.log(r.after.scaleWorldPerDrawing[1] / SHEET.scaleWorldPerDrawing[1])) < 1e-4, 'an undistorted sheet stays undistorted');
  const kept = registerAll(registeredWorld(), drawing(), [], { opts: FAST }).west;
  assert.match(kept.decision, /^kept/u);
  assert.deepEqual(kept.after.worldAnchor, SHEET.worldAnchor);
});

test('registration: a fit that loses the drawn labels is refused', () => {
  // A sea label that lies on the coast through the recorded (shifted) sheet and inside the land through the fitted one.
  const labels = parseLabels('| Name | Scan | Type | Full-map x, y | Reading | Notes |\n| Test Sea | West-Earth | sea | 0.58, 0.5 | confirmed | |\n| Test Land | West-Earth | land_region | 0.5, 0.5 | confirmed | |');
  assert.equal(labels.length, 2);
  assert.equal(labelExpectation('sea'), 'water');
  assert.equal(labelExpectation('map_heading'), null);
  const shifted = registeredWorld([0.01, 0]);
  shifted.sheets.west.worldAnchor = [SHEET.worldAnchor[0] + 0.0105, SHEET.worldAnchor[1]];
  const r = registerAll(shifted, drawing(), labels, { opts: FAST }).west;
  assert.match(r.decision, /^refused/u);
  assert.deepEqual(r.after.worldAnchor, shifted.sheets.west.worldAnchor, 'the recorded transform stays');
});

test('applyRegistration: the sheets take the registered transforms and keep the recorded ones; no file changes nothing (negative)', () => {
  const m = registeredWorld([0.01, 0]);
  const reg = { drawing: { sha256: 'x' }, sheets: { west: { decision: 'refined: test', iou: { framed: 0.5, after: 0.9 }, labels: { before: 1, after: 1 }, after: { ...SHEET, clipBox: [0.11, 0.1, 0.9, 0.9] } } } };
  const log = [];
  applyRegistration(m, reg, log);
  assert.deepEqual(m.sheets.west.worldAnchor, SHEET.worldAnchor);
  assert.deepEqual(m.sheets.west.clipBox, [0.11, 0.1, 0.9, 0.9]);
  assert.equal(m.registration.before.west.worldAnchor[0], SHEET.worldAnchor[0] + 0.01);
  const once = JSON.stringify(m), log2 = [];
  applyRegistration(m, reg, log2);
  assert.equal(JSON.stringify(m), once, 'a second run changes nothing');
  assert.deepEqual(log2, []);
  const n = registeredWorld([0.01, 0]), copy = JSON.stringify(n);
  applyRegistration(n, null, []);
  assert.equal(JSON.stringify(n), copy);
});

// ---------------------------------------------------------------------------------------------------- corrections
function aenorWorld() {
  return mini({
    lands: [feature('land_aenor_isle', rect(0.40, 0.50, 0.44, 0.52), { regions: ['aenor_isle'] }), feature('land_central_mainland', rect(0.45, 0.40, 0.60, 0.60), { regions: ['middle_lands', 'aenor_isle'] })],
    regions: [
      feature('region_aenor_isle', { type: 'MultiPolygon', coordinates: [rect(0.399, 0.499, 0.441, 0.521).coordinates, rect(0.45, 0.49, 0.47, 0.53).coordinates] }, { kind: 'region' }),
      feature('region_middle_lands', rect(0.47, 0.40, 0.60, 0.60), { kind: 'region' }),
    ],
    plains: [feature('plain_aenor_isle', rect(0.46, 0.45, 0.50, 0.47), { region: 'aenor_isle' })],
    ranges: [feature('range_tinta', { type: 'LineString', coordinates: [[0.46, 0.50], [0.47, 0.52]] }, { region: 'aenor_isle', halfWidth: 0.0036 })],
  });
}
test('corrections: Aenor Isle loses its box over the mainland and Rish and the Tinta Hills stand on the isle; a second run changes nothing (negative)', () => {
  const m = aenorWorld(), isle = m.lands[0].geometry, log = [];
  correctModel(m, log);
  assert.equal(ringsOf(m.regions[0].geometry).length, 1);
  assert.equal(ringsOf(m.regions[1].geometry).length, 2, 'the box goes to the Middle Lands');
  assert.ok(ringsOf(m.plains[0].geometry)[0][0].every(p => p[0] >= 0.3995 && p[0] <= 0.4405 && p[1] >= 0.4995 && p[1] <= 0.5205), 'Rish lies on the isle');
  assert.ok(pointInGeometry(0.42, 0.51, m.plains[0].geometry), 'in its middle');
  assert.ok(m.ranges[0].geometry.coordinates.every(p => pointInGeometry(p[0], p[1], isle)), 'the Tinta Hills are on the isle');
  assert.ok(m.ranges[0].geometry.coordinates.every(p => p[0] > 0.4 + 0.7 * 0.04), 'at its east end');
  assert.equal(log.length, 3);
  const once = JSON.stringify(m), log2 = [];
  correctModel(m, log2);
  assert.equal(JSON.stringify(m), once);
  assert.deepEqual(log2, []);
});

function darkWorld() {
  return mini({
    lands: [feature('land_dondor_arm', rect(0.40, 0.40, 0.45, 0.46), { regions: ['dark_lands'] }), feature('land_central_mainland', rect(0.47, 0.38, 0.60, 0.60), { regions: ['middle_lands', 'dark_lands'] })],
    regions: [
      feature('region_dark_lands', { type: 'MultiPolygon', coordinates: [rect(0.399, 0.399, 0.451, 0.461).coordinates, rect(0.48, 0.40, 0.52, 0.45).coordinates] }, { kind: 'region' }),
      feature('region_middle_lands', rect(0.52, 0.38, 0.60, 0.60), { kind: 'region' }),
    ],
    ranges: [feature('range_the_darkness', { type: 'LineString', coordinates: [[0.41, 0.43], [0.44, 0.43], [0.46, 0.43], [0.49, 0.43]] }, { region: 'dark_lands', halfWidth: 0.004 })],
    passes: [feature('pass_path_of_dark', { type: 'Point', coordinates: [0.49, 0.44] }, { region: 'dark_lands' })],
    coasts: [feature('peninsula_nothingness', { type: 'Point', coordinates: [0.485, 0.42] }, { region: 'dark_lands' })],
  });
}
test('corrections: the Dark Lands part over the Selen coast goes to the Middle Lands, the ridge ends on the arm; an arm-only Dark Lands is untouched (negative)', () => {
  const m = darkWorld(), arm = m.lands[0].geometry, log = [];
  correctDarkLands(m, log);
  assert.equal(ringsOf(m.regions[0].geometry).length, 1);
  assert.equal(ringsOf(m.regions[1].geometry).length, 2);
  assert.ok(m.ranges[0].geometry.coordinates.every(p => pointInGeometry(p[0], p[1], arm)));
  assert.ok(pointInGeometry(...m.passes[0].geometry.coordinates, arm));
  assert.ok(pointInGeometry(...m.coasts[0].geometry.coordinates, arm));
  const once = JSON.stringify(m), log2 = [];
  correctDarkLands(m, log2);
  assert.equal(JSON.stringify(m), once);
  assert.deepEqual(log2, []);
});

// ---------------------------------------------------------------------------------------------------- archipelagos
test('edges: an archipelago in the band moves as one piece with what stands on it; one clear of the bands stays (negative)', () => {
  const m = mini({
    lands: [
      feature('land_isle_a', rect(0.020, 0.50, 0.032, 0.53), { regions: ['tritons_islands'] }),
      feature('land_isle_b', rect(0.060, 0.50, 0.075, 0.52), { regions: ['tritons_islands'] }),
      feature('land_main', rect(0.30, 0.30, 0.60, 0.70), { regions: ['west_lands'] }),
    ],
    sites: [feature('site_b', { type: 'Point', coordinates: [0.067, 0.51] }, { region: 'tritons_islands' })],
  });
  const before = m.lands.slice(0, 2).map(l => G.geometryBounds(l.geometry));
  const moves = repairEdges(m, []);
  assert.equal(moves.filter(mv => mv.group === 'tritons_islands').length, 2);
  const after = m.lands.slice(0, 2).map(l => G.geometryBounds(l.geometry));
  const v = [after[0][0] - before[0][0], after[0][1] - before[0][1]];
  close(after[1][0] - before[1][0], v[0], 1e-4);
  close(after[1][1] - before[1][1], v[1], 1e-4);
  assert.ok(after.every(b => b[0] > G.BAND.x), 'both islands clear the band');
  close(m.sites[0].geometry.coordinates[0], 0.067 + v[0], 1e-4);
  assert.deepEqual(G.geometryBounds(m.lands[2].geometry), [0.30, 0.30, 0.60, 0.70]);
  const clear = mini({ lands: [feature('land_isle_c', rect(0.20, 0.50, 0.21, 0.52), { regions: ['tritons_islands'] })] });
  const copy = JSON.stringify(clear.lands);
  assert.deepEqual(repairEdges(clear, []), []);
  assert.equal(JSON.stringify(clear.lands), copy);
});

// ---------------------------------------------------------------------------------------------------- gorges
function gorgeWorld(riverY = 0.5) {
  return mini({
    lands: [feature('land_a', rect(0.30, 0.30, 0.70, 0.70))],
    lakes: [feature('lake_low', rect(0.40, 0.47, 0.43, 0.53))],
    ranges: [feature('range_ring', { type: 'LineString', coordinates: [[0.50, 0.33], [0.50, 0.67]] }, { halfWidth: 0.004, peakClass: 5 })],
    rivers: [feature('river_x', { type: 'LineString', coordinates: [[0.58, riverY], [0.50, riverY], [0.432, riverY]] })],
  });
}
const GZ = [{ pass: 'pass_gorge', river: 'river_x', range: 'range_ring', gapPx: 160, maxGapPx: 400, minPartPx: 40 }];
test('gorges: the range opens where the river crosses it and the gorge is a pass; a second run changes nothing (negative)', () => {
  const m = gorgeWorld(), log = [];
  assert.ok(codes(m, 'RIVER_UPHILL').length, 'the drawn course climbs over the range');
  openGorges(m, log, GZ);
  assert.deepEqual(codes(m, 'RIVER_UPHILL'), []);
  const parts = m.ranges.filter(r => r.id.startsWith('range_ring'));
  assert.equal(parts.length, 2, 'the ring keeps both sides of the gorge');
  const gap = (parts[1].geometry.coordinates[0][1] - parts[0].geometry.coordinates.at(-1)[1]) * G.H;
  assert.ok(gap >= 160 && gap <= 400, `an opening of ${gap} px`);
  assert.ok(parts[0].geometry.coordinates[0][1] === 0.33 && parts[1].geometry.coordinates.at(-1)[1] === 0.67, 'the ends of the ring are untouched');
  const pass = m.passes.find(p => p.id === 'pass_gorge');
  assert.equal(pass.geometry.type, 'LineString');
  assert.ok(pass.geometry.coordinates.every(p => Math.abs(p[1] - 0.5) < 1e-9), 'the gorge follows the river');
  const once = JSON.stringify(m), log2 = [];
  openGorges(m, log2, GZ);
  assert.equal(JSON.stringify(m), once);
  assert.deepEqual(log2, []);
});
test('gorges: a river that already runs downhill leaves the range closed (negative)', () => {
  const m = gorgeWorld();
  m.rivers[0].geometry.coordinates = [[0.45, 0.5], [0.432, 0.5]];
  const copy = JSON.stringify(m);
  openGorges(m, [], GZ);
  assert.equal(JSON.stringify(m), copy);
});

// ---------------------------------------------------------------------------------------------------- names
const NAMES = { entries: [
  { id: 'sea_x_ocean', array: 'seas', oldName: 'X Ocean', newName: 'X Sea', language: null, meaning: null, reason: 'no Ocean', source: 'owner' },
  { id: 'site_y', array: 'sites', oldName: 'Asgard', newName: 'Orohaf', language: 'aenoran', meaning: 'island harbour', reason: 'myth', source: 'middle_lands.md' },
  { id: 'site_z', array: 'sites', oldName: 'Wrong Old', newName: 'New Z', language: null, meaning: null, reason: 'test', source: 'test' },
] };
function namesWorld() {
  return mini({
    seas: [feature('sea_x_ocean', rect(0.1, 0.1, 0.2, 0.2), { name: 'X Ocean', established: true })],
    sites: [feature('site_y', { type: 'Point', coordinates: [0.5, 0.5] }, { name: 'Asgard', established: true }), feature('site_z', { type: 'Point', coordinates: [0.6, 0.6] }, { name: 'Zed' })],
  });
}
test('names: the table renames, keeps the old label and marks a proposal; a feature whose name differs is reported, a second run changes nothing (negative)', () => {
  const m = namesWorld(), log = [];
  applyNameTable(m, NAMES, log);
  assert.equal(m.seas[0].name, 'X Sea');
  assert.equal(m.seas[0].formerLabel, 'X Ocean');
  assert.equal(m.seas[0].established, false);
  assert.equal(m.seas[0].nameStatus, 'owner decision');
  assert.equal(m.sites[0].nameLanguage, 'aenoran');
  assert.equal(m.sites[0].nameStatus, 'proposed');
  assert.equal(m.sites[1].name, 'Zed', 'a table entry for another name is not applied');
  assert.ok(log.some(e => e.id === 'site_z' && e.unresolved));
  assert.deepEqual(codes(m, 'RENAME_NOT_PROPOSAL'), []);
  const once = JSON.stringify(m), log2 = [];
  applyNameTable(m, NAMES, log2);
  assert.equal(JSON.stringify(m), once);
  assert.equal(log2.filter(e => !e.unresolved).length, 0);
  unapplyNames(m);
  assert.equal(m.seas[0].name, 'X Ocean', 'the table can be rebuilt from a renamed model');
});

test('names: an island takes the drawn label beside it, else a generated name; banned and borrowed candidates are refused', () => {
  const m = registeredWorld();
  m.lands = [feature('land_island_901', rect(0.45, 0.45, 0.46, 0.46), { name: 'Island 901 (tritons_islands)', regions: ['tritons_islands'] }), feature('land_island_902', rect(0.62, 0.62, 0.63, 0.63), { name: 'Island 902 (tritons_islands)', regions: ['tritons_islands'] })];
  const near = sheetToDrawing(m.sheets.west, [0.455, 0.462]);
  const labels = parseLabels(`| Name | Scan | Type | Full-map x, y | Reading | Notes |\n| Kelpholm | West-Earth | island | ${near[0].toFixed(5)}, ${near[1].toFixed(5)} | confirmed | |\n| Unsure | West-Earth | island | 0.9, 0.9 | uncertain | |`);
  const asked = [];
  const generate = (language, kind, seed) => { asked.push(language); return [{ text: 'Mordar', gloss: 'x' }, { text: 'Green Ocean', gloss: 'x' }, { text: 'Dunwaith', gloss: 'x' }, { text: 'Seilobrennos', gloss: 'sea mountain' }]; };
  const t = buildNameTable(m, labels, generate);
  const byId = Object.fromEntries(t.entries.map(e => [e.id, e]));
  assert.equal(byId.land_island_901.newName, 'Kelpholm');
  assert.match(byId.land_island_901.source, /name_table\.md/u);
  assert.equal(byId.land_island_902.newName, 'Seilobrennos', 'Mordar is too close to other fiction, Ocean and -waith are refused');
  assert.ok(asked.every(l => l === 'tritonic'), 'the island\'s region gives the language');
  assert.ok(fictionLike('Mordar') && fictionLike('Isengard') && !fictionLike('Parim'));
  assert.ok(EXTRA_BANNED.some(([, re]) => re.test('The Frozen Ocean')) && EXTRA_BANNED.some(([, re]) => re.test('Lerenwaith')));
  assert.ok(!EXTRA_BANNED.some(([, re]) => re.test('Norrai Sea')));
});

// ---------------------------------------------------------------------------------------------------- layout overrides
const CGRID = { ox: 0, oy: 0, cell: 4, w: 1280, h: 640 };
/** Drawing masks for the one sheet of paperWorld: the model's land plus the given extra drawn rectangles. */
function drawnMasks(m, extra) {
  const mask = new Uint8Array(CGRID.w * CGRID.h);
  for (const l of m.lands) G.rasterizeInto(l.geometry, CGRID, mask, 1);
  for (const r of extra) G.rasterizeInto(rect(...r), CGRID, mask, 1);
  return { sheets: [{ id: 'west' }], masks: [mask] };
}
test('layout overrides: where the drawing disagrees the model wins, with the fewest forced cells that reach the target; an agreeing region gets none (negative)', () => {
  const m = paperWorld([0.05, 0.05, 0.95, 0.95]);
  m.seas = [feature('sea_round', rect(0.2, 0.2, 0.8, 0.8))];
  const masks = drawnMasks(m, [[0.62, 0.40, 0.66, 0.60], [0.30, 0.50, 0.31, 0.51]]); // a drawn coast the layout moved, and a speck
  const imp = importSurface(m, [], masks);
  const before = regionAgreement(imp).get('test').iou;
  assert.ok(before < LAYOUT.target, `the drawing disagrees (${before})`);
  const { entries, regions } = chooseLayoutOverrides(m, imp);
  assert.equal(entries.length, 1, 'only the large patch is forced; the speck is left to the drawing');
  assert.equal(entries[0].kind, 'sea');
  assert.equal(entries[0].feature, 'sea_round');
  assert.match(entries[0].reason, /model wins/u);
  assert.equal(regions.region_test.patches, 1);
  const after = regionAgreement(importSurface(m, entries, masks)).get('test').iou;
  assert.ok(after >= LAYOUT.target, `the region reaches the target (${after})`);
  const again = chooseLayoutOverrides(m, importSurface(m, entries, masks));
  assert.deepEqual(again.entries, [], 'a second pass forces nothing more');
  const good = chooseLayoutOverrides(m, importSurface(m, [], drawnMasks(m, [[0.30, 0.50, 0.31, 0.51]])));
  assert.deepEqual(good.entries, []);
  const ov = buildOverrides(m, { entries });
  assert.equal(ov.surface.at(-1).id, entries[0].id, 'the repair appends the layout entries last');
});

// ---------------------------------------------------------------------------------------------------- checker: island names
test('checker: a single isle may be called an Isle; an Islands name on a single island still fails (negative)', () => {
  const world = name => mini({
    lands: [feature('land_a', rect(0.40, 0.40, 0.45, 0.45), { regions: ['test'] })],
    regions: [feature('region_test', rect(0.399, 0.399, 0.451, 0.451), { kind: 'region', name, areaPx: Math.round(0.052 * 0.052 * 5120 * 2560) })],
  });
  assert.deepEqual(codes(world('Aenor Isle'), 'REGION_NAME_TERRAIN'), []);
  assert.equal(codes(world('The Lonely Islands'), 'REGION_NAME_TERRAIN').length, 1);
  assert.equal(codes(world('The Pupor Isles'), 'REGION_NAME_TERRAIN').length, 1);
});

// ---------------------------------------------------------------------------------------------------- authority
function paperWorld(box) {
  return mini({
    sheets: { west: { ...SHEET, drawingBox: box } },
    lands: [feature('land_a', rect(0.40, 0.40, 0.60, 0.60), { regions: ['test'] })],
    regions: [feature('region_test', rect(0.39, 0.39, 0.61, 0.61), { kind: 'region' })],
    sites: [feature('site_a', { type: 'Point', coordinates: [0.5, 0.5] }, { region: 'test', drawing: { sheet: 'west', type: 'Point', coordinates: [0.5, 0.5] } })],
  });
}
test('authority: land past the paper of its region\'s sheets is forced to land; land the sheet draws is not (negative)', () => {
  // a box covering only the west half of the land
  const half = paperWorld([0.1, 0.1, sheetToDrawing(SHEET, [0.5, 0.5])[0], 0.9]);
  const { auth } = sheetAuthority(half);
  assert.ok(auth.some(v => v === 0) && auth.some(v => v < 0));
  const undrawn = buildOverrides(half).surface.filter(e => e.id.startsWith('undrawn_land'));
  assert.equal(undrawn.length, 1);
  const g = { type: 'Polygon', coordinates: [undrawn[0].polygon] };
  assert.ok(pointInGeometry(0.55, 0.5, g) && !pointInGeometry(0.45, 0.5, g));
  const whole = paperWorld([0.05, 0.05, 0.95, 0.95]);
  assert.deepEqual(buildOverrides(whole).surface.filter(e => e.id.startsWith('undrawn_land')), []);
});
test('authority: the layout\'s generated bands and lands are undrawn, and a moved land carries its band (negative: the middle is drawn)', () => {
  const m = mini({ lands: [feature('land_northern_wastes', rect(0.3, 0.06, 0.4, 0.1)), feature('land_south', rect(0.5, 0.90, 0.6, 0.94))] });
  const grid = { ox: 0, oy: 0, cell: 4, w: 1280, h: 640 };
  const at = (x, y) => generatedMask(m, grid)[G.cellIndexOf(grid, [x, y])];
  assert.equal(at(0.35, 0.08), 1, 'the generated wasteland');
  assert.equal(at(0.5, 0.02), 1, 'the top band');
  assert.equal(at(0.5, 0.5), 0);
  assert.equal(at(0.55, 0.93), 0, 'above the bottom band');
  m.repair = { moved: [{ id: 'land_south', vector: [0, -0.03] }] };
  assert.equal(at(0.55, 0.93), 1, `a land moved 0.03 up carries the band below ${GENERATED.bottom.toFixed(3)} with it`);
});
