// Tests of the bays, gulfs and strait crossings of decision K46 (coast_features.mjs) and of the vanilla crossing
// calibration (vanilla_crossings.mjs). Synthetic models on the 4-pixel grid; the private drawing is never read.
//
//   node --test tools/content/geography/coast_features.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as G from './geo_core.mjs';
import { edt2, closing, findBays, selectBays, findCrossings, landLabels, gapCandidates, landDetourAtLeast, CG, COAST } from './coast_features.mjs';
import { landMask } from './repair_model.mjs';
import { readBmp, summarise } from './vanilla_crossings.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const px = (x, y) => [x / G.W, y / G.H];
const poly = pts => ({ type: 'Polygon', coordinates: [pts.map(p => px(...p))] });
const f = (id, geometry, extra = {}) => ({ id, name: id.replace(/_/gu, ' '), established: false, source: 'test', kind: 'test', elevation: 1, geometry, ...extra });
function world(parts) {
  return { seas: [f('sea_all', poly([[300, 300], [4800, 300], [4800, 2260], [300, 2260]]))], lakes: [], lands: [], straits: [], sites: [], coasts: [], regions: [f('region_r', poly([[300, 300], [4800, 300], [4800, 2260], [300, 2260]]), { kind: 'region' })], ...parts };
}

// ---------------------------------------------------------------------------------------------------- rasters
test('distance transform and closing: exact squared distances; a closing fills a gap narrower than the disc and leaves a wide one open', () => {
  const w = 40, h = 20, m = new Uint8Array(w * h);
  m[10 * w + 10] = 1;
  const d = edt2(m, w, h);
  assert.equal(d[10 * w + 13], 9);
  assert.equal(d[14 * w + 13], 25);
  const two = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x < 10 || x >= 14) two[y * w + x] = 1; // a gap 4 cells wide
  const c = closing(two, w, h, 3);
  assert.equal(c[10 * w + 12], 1, 'a 4-cell gap closes with a radius of 3');
  const wide = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x < 10 || x >= 30) wide[y * w + x] = 1;
  assert.equal(closing(wide, w, h, 3)[10 * w + 20], 0, 'a 20-cell gap stays open');
});

// ---------------------------------------------------------------------------------------------------- bays
// A land with an inlet 300 px deep behind an 80-px mouth on the east: a bay.
const C_LAND = poly([[1000, 800], [1600, 800], [1600, 960], [1300, 960], [1300, 1040], [1600, 1040], [1600, 1200], [1000, 1200]]);
test('bays: water behind a narrow mouth of one land is a bay with a proposed name after its shore site; open coast is no bay (negative)', () => {
  const m = world({ lands: [f('land_c', C_LAND, { kind: 'continent' })], sites: [f('site_harbour', { type: 'Point', coordinates: px(1250, 1000) }, { kind: 'port' })] });
  const surface = landMask(m, CG);
  const found = findBays(m, surface);
  assert.ok(found.some(b => b.strict), 'the inner water is found');
  const { bays } = selectBays(m, found);
  assert.equal(bays.length, 1);
  const b = bays[0];
  assert.equal(b.name, 'Bay of site harbour');
  assert.equal(b.nameStatus, 'proposed');
  assert.equal(b.land, 'land_c');
  assert.ok(b.cells.every(c => !surface[c]), 'the bay is water');
  const open = world({ lands: [f('land_square', poly([[1000, 800], [1600, 800], [1600, 1400], [1000, 1400]]), { kind: 'continent' })] });
  assert.deepEqual(selectBays(open, findBays(open, landMask(open, CG))).bays, []);
});

test('bays: a named coast point of the model names the water it lies in, with its kind and status; a named point in open water has no water of its own', () => {
  const m = world({ lands: [f('land_c', C_LAND, { kind: 'continent' })], coasts: [f('gulf_inner', { type: 'Point', coordinates: px(1450, 1000) }, { kind: 'gulf', name: 'Gulf of Test', established: true }), f('bay_out', { type: 'Point', coordinates: px(3000, 1100) }, { kind: 'bay', name: 'Bay of Nowhere' })] });
  const { bays, namedWithoutWater } = selectBays(m, findBays(m, landMask(m, CG)));
  assert.deepEqual(bays.map(b => [b.id, b.name, b.kind, b.nameStatus]), [['sea_gulf_inner', 'Gulf of Test', 'gulf', 'established']]);
  assert.deepEqual(namedWithoutWater.map(p => p.id), ['bay_out']);
});

test('bays: water among small islands is no bay; water in the import\'s sea bands is no bay (negative)', () => {
  const isles = [];
  for (let k = 0; k < 6; k++) isles.push(f(`land_i${k}`, poly([[1000 + 120 * k, 1000], [1060 + 120 * k, 1000], [1060 + 120 * k, 1060], [1000 + 120 * k, 1060]]), { kind: 'island' }));
  const m = world({ lands: isles });
  assert.deepEqual(selectBays(m, findBays(m, landMask(m, CG))).bays, []);
  const edge = world({ lands: [f('land_e', poly([[0, 40], [5120, 40], [5120, 100], [0, 100]]), { kind: 'continent' })] });
  assert.deepEqual(selectBays(edge, findBays(edge, landMask(edge, CG))).bays, []);
});

// ---------------------------------------------------------------------------------------------------- crossings
const TWO = () => world({
  lands: [f('land_a', poly([[1000, 1000], [1500, 1000], [1500, 1400], [1000, 1400]]), { kind: 'continent' }), f('land_b', poly([[1520, 1000], [1900, 1000], [1900, 1400], [1520, 1400]]), { kind: 'island' }), f('land_far', poly([[3000, 1000], [3300, 1000], [3300, 1400], [3000, 1400]]), { kind: 'island' })],
});
test('narrow gaps: two lands 20 px apart get a proposed strait crossing between shore points; lands 1,100 px apart get none (negative)', () => {
  const { crossings } = findCrossings(TWO(), COAST, {});
  const gaps = crossings.filter(c => c.source === 'narrow gap');
  assert.ok(gaps.length >= 1 && gaps.length <= COAST.maxPerPair, JSON.stringify(gaps));
  assert.ok(gaps.every(x => x.lands.join() === 'land_a,land_b'), 'the far island gets none');
  for (let i = 1; i < gaps.length; i++) assert.ok(G.distPx(gaps[i].between[0], gaps[0].between[0]) >= COAST.pairSpacingPx, 'crossings of one pair are spaced');
  const g = gaps[0];
  assert.ok(g.widthPx <= COAST.narrowGapPx && g.widthPx >= 12);
  assert.equal(g.nameStatus, 'proposed');
  assert.match(g.name, /Sound|Narrows/u);
  assert.ok(g.between[0][0] < g.between[1][0]);
});

test('model straits: a strait between two lands crosses at its narrowest place near its course; a strait within one land saves a long walk round, not a cove', () => {
  const m = TWO();
  m.straits = [f('strait_ab', { type: 'LineString', coordinates: [px(1510, 1050), px(1510, 1350)] })];
  const { crossings } = findCrossings(m, COAST, { strait_ab: { sides: [['land_a'], ['land_b']], note: 'test' } });
  const s = crossings.find(c => c.id === 'strait_ab');
  assert.deepEqual(s.lands.slice().sort(), ['land_a', 'land_b']);
  assert.ok(s.widthPx <= 28);
  const mid = c => [(c.between[0][0] + c.between[1][0]) / 2, (c.between[0][1] + c.between[1][1]) / 2];
  assert.ok(!crossings.some(c => c.source === 'narrow gap' && G.distPx(mid(c), mid(s)) < COAST.pairSpacingPx), 'the narrow gap the strait covers gets no second crossing');
  // one land bent round a channel: the two arms meet only far away by land
  const u = world({ lands: [f('land_u', poly([[1000, 1000], [2000, 1000], [2000, 1080], [1100, 1080], [1100, 1100], [2000, 1100], [2000, 1180], [1000, 1180]]), { kind: 'continent' })] });
  u.straits = [f('strait_u', { type: 'LineString', coordinates: [px(1300, 1090), px(1900, 1090)] })];
  const one = findCrossings(u, COAST, { strait_u: { sides: [['land_u'], ['land_u']], note: 'test' } }).crossings.find(c => c.id === 'strait_u');
  assert.equal(one.sameLand, true);
  assert.ok(one.widthPx <= 24, JSON.stringify(one));
  const labels = landLabels(u);
  const a = G.cellIndexOf(CG, px(1500, 1076)), b = G.cellIndexOf(CG, px(1500, 1104));
  assert.equal(landDetourAtLeast(labels, 0, a, b, 600), true, 'round by land the arms are far apart');
  assert.equal(landDetourAtLeast(labels, 0, a, G.cellIndexOf(CG, px(1520, 1076)), 600), false, 'two points of one coast are not');
});

test('gap candidates: every pair of facing shores of two lands, narrowest first; one land facing itself is none (negative)', () => {
  const m = TWO();
  const labels = landLabels(m);
  const sea = new Uint8Array(labels.length);
  for (let c = 0; c < sea.length; c++) sea[c] = labels[c] < 0 ? 1 : 0;
  const all = gapCandidates(labels, sea, 200);
  assert.ok(all.length > 0);
  assert.ok(all.every(g => g.a !== g.b));
  assert.ok(all.every((g, k) => k === 0 || g.widthPx >= all[k - 1].widthPx));
});

// ---------------------------------------------------------------------------------------------------- vanilla calibration
test('vanilla: a 24-bit BMP is read top row first; the summary gives quantiles and the named crossings', () => {
  const w = 2, h = 2, stride = 8, size = 54 + stride * h, bytes = Buffer.alloc(size);
  bytes.write('BM'); bytes.writeUInt32LE(size, 2); bytes.writeUInt32LE(54, 10); bytes.writeUInt32LE(40, 14); bytes.writeInt32LE(w, 18); bytes.writeInt32LE(h, 22); bytes.writeUInt16LE(1, 26); bytes.writeUInt16LE(24, 28);
  bytes.set([0, 0, 255], 54); // bottom-left pixel red (BGR)
  bytes.set([255, 0, 0], 54 + stride); // top-left pixel blue
  const bmp = readBmp(bytes);
  assert.deepEqual([...bmp.rgb.subarray(0, 3)], [0, 0, 255], 'the top row comes first');
  assert.deepEqual([...bmp.rgb.subarray(6, 9)], [255, 0, 0]);
  const s = summarise({ width: 10, height: 5, rows: [{ comment: 'Bosphorus', widthPx: 3, rule: null }, { comment: 'x', widthPx: 10, rule: null }, { comment: 'Suez', widthPx: 20, rule: 'SUEZ_CANAL' }] });
  assert.equal(s.crossings, 2, 'canals are not straits');
  assert.equal(s.quantilesPx.max, 10);
  assert.equal(s.named.Bosphorus, 3);
});

test('tracked data: every model strait has a crossing or a reason, every crossing joins two shore points, and the narrow-gap threshold is above every vanilla crossing', () => {
  const doc = JSON.parse(readFileSync(path.join(here, '../data/geography/coast_features.json'), 'utf8'));
  const model = JSON.parse(readFileSync(path.join(here, '../data/geography/aoaz.repaired.json'), 'utf8'));
  for (const s of model.straits) {
    const c = doc.crossings.find(x => x.strait === s.id);
    assert.ok(c, `${s.id} has a crossing`);
    assert.ok(c.unresolved || (c.between.length === 2 && c.lands.length === 2), s.id);
  }
  for (const c of doc.crossings.filter(x => x.source === 'narrow gap')) assert.ok(c.widthPx <= doc.constants.narrowGapPx && c.lands[0] !== c.lands[1], c.id);
  if (doc.vanilla) assert.ok(doc.constants.narrowGapPx >= doc.vanilla.quantilesPx.max);
  for (const b of doc.bays) assert.ok(['established', 'proposed'].includes(b.nameStatus) && !/\bocean\b/iu.test(b.name), b.id);
  assert.ok(existsSync(path.join(here, 'vanilla_crossings.mjs')));
});
