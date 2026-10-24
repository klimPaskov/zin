// Tests of the politics input of the drawn-map import: the validator's rules on small synthetic cases, and the
// committed tools/politics/data/realm_seeds.json against the roster, the rules and (when the private drawing is
// present) the land the import reads and a byte-for-byte rebuild.
//   node --test tools/politics/realm_seeds.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCountries, RULES } from './countries_validator.mjs';
import { ringsOverlap, pointInRing, outlines, FRAME } from './geometry.mjs';
import { buildRealmSeeds, landPredicate, OUT, PLACE, WEIGHT } from './realm_seeds.mjs';
import { loadWorld, PATHS, ZIN } from './world_inputs.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
// a synthetic world: land is the rectangle 100..900 x 100..500, everything else water
const isLand = (x, y) => x >= 100 && x < 900 && y >= 100 && y < 500;
const realm = (tag, capital, extra = {}) => ({ tag, capital, ...extra });
const valid = (realms, extra = {}) => ({ source: 'workspace', realms, islands: 'one-owner', connectedMainland: true, ...extra });
const codes = r => r.errors.map(e => e.code);

test('a small valid request passes', () => {
  const r = validateCountries(valid([realm('AAA', [200, 200], { weight: 2, claim: [box(150, 150, 300, 300)] }), realm('BBB', [700, 300], { seeds: [[800, 400]], overlord: 'AAA', exclude: [box(100, 100, 400, 500)] })]), { isLand, knownTags: new Set(['AAA', 'BBB']) });
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
});

test('a capital or seed in water is refused', () => {
  const r = validateCountries(valid([realm('AAA', [50, 50]), realm('BBB', [700, 300], { seeds: [[950, 300]] })]), { isLand });
  assert.deepEqual(codes(r).filter(c => c === 'MAP_WORLD_REALM_POINT_WATER').length, 2);
  assert.ok(r.errors.some(e => e.tag === 'AAA' && e.code === 'MAP_WORLD_REALM_POINT_WATER'));
  assert.ok(r.errors.some(e => e.tag === 'BBB' && /seeds\[0\]/u.test(e.message)));
});

test('overlapping claims of two realms are refused, claims that only share a border are not', () => {
  const overlap = validateCountries(valid([realm('AAA', [120, 120], { claim: [box(150, 150, 400, 400)] }), realm('BBB', [800, 450], { claim: [box(300, 300, 600, 480)] })]), { isLand });
  assert.ok(codes(overlap).includes('REALM_CLAIMS_OVERLAP'));
  const nested = validateCountries(valid([realm('AAA', [120, 120], { claim: [box(150, 150, 600, 480)] }), realm('BBB', [800, 450], { claim: [box(200, 200, 300, 300)] })]), { isLand });
  assert.ok(codes(nested).includes('REALM_CLAIMS_OVERLAP'));
  const same = validateCountries(valid([realm('AAA', [120, 120], { claim: [box(150, 150, 300, 300)] }), realm('BBB', [800, 450], { claim: [box(150, 150, 300, 300)] })]), { isLand });
  assert.ok(codes(same).includes('REALM_CLAIMS_OVERLAP'));
  const touching = validateCountries(valid([realm('AAA', [120, 120], { claim: [box(150, 150, 300, 300)] }), realm('BBB', [800, 450], { claim: [box(300, 150, 450, 300)] })]), { isLand });
  assert.deepEqual(codes(touching), []);
});

test('a point inside another realm\'s claim, its own exclusion or the unowned area is refused', () => {
  const r = validateCountries(valid([
    realm('AAA', [200, 200], { claim: [box(150, 150, 300, 300)] }),
    realm('BBB', [250, 250]),
    realm('CCC', [600, 300], { exclude: [box(550, 250, 650, 350)] }),
    realm('DDD', [800, 450]),
  ], { unowned: [box(780, 430, 820, 470)] }), { isLand });
  assert.ok(r.errors.some(e => e.code === 'REALM_POINT_IN_CLAIM' && e.tag === 'BBB' && e.other === 'AAA'));
  assert.ok(r.errors.some(e => e.code === 'REALM_POINT_IN_OWN_EXCLUSION' && e.tag === 'CCC'));
  assert.ok(r.errors.some(e => e.code === 'REALM_POINT_UNOWNED' && e.tag === 'DDD'));
  // a realm's own claim holds its own capital
  assert.ok(!r.errors.some(e => e.code === 'REALM_POINT_IN_CLAIM' && e.tag === 'AAA'));
});

test('a claim that its own exclusion or the unowned area also covers is refused', () => {
  const r = validateCountries(valid([realm('AAA', [200, 200], { claim: [box(150, 150, 300, 300)], exclude: [box(250, 250, 400, 400)] }), realm('BBB', [700, 400], { claim: [box(650, 150, 750, 250)] })], { unowned: [box(700, 200, 800, 300)] }), { isLand });
  assert.ok(codes(r).includes('REALM_CLAIM_EXCLUDED'));
  assert.ok(codes(r).includes('REALM_CLAIM_UNOWNED'));
});

test('overlord cycles, self-overlords and unknown overlords are refused', () => {
  const two = validateCountries(valid([realm('AAA', [200, 200], { overlord: 'BBB' }), realm('BBB', [400, 200], { overlord: 'AAA' })]), { isLand });
  assert.equal(codes(two).filter(c => c === 'REALM_OVERLORD_CYCLE').length, 1);
  const three = validateCountries(valid([realm('AAA', [200, 200], { overlord: 'BBB' }), realm('BBB', [400, 200], { overlord: 'CCC' }), realm('CCC', [600, 200], { overlord: 'AAA' })]), { isLand });
  assert.equal(codes(three).filter(c => c === 'REALM_OVERLORD_CYCLE').length, 1);
  const self = validateCountries(valid([realm('AAA', [200, 200], { overlord: 'AAA' })]), { isLand });
  assert.ok(codes(self).includes('REALM_OVERLORD_CYCLE'));
  const unknown = validateCountries(valid([realm('AAA', [200, 200], { overlord: 'ZZZ' })]), { isLand });
  assert.ok(codes(unknown).includes('REALM_OVERLORD_UNKNOWN'));
  const chain = validateCountries(valid([realm('AAA', [200, 200]), realm('BBB', [400, 200], { overlord: 'AAA' }), realm('CCC', [600, 200], { overlord: 'BBB' })]), { isLand });
  assert.deepEqual(codes(chain), []);
});

test('unknown, malformed and duplicate tags are refused', () => {
  const r = validateCountries(valid([realm('AAA', [200, 200]), realm('XYZ', [400, 200]), realm('ab1', [600, 200]), realm('AAA', [700, 300])]), { isLand, knownTags: new Set(['AAA']) });
  assert.ok(r.errors.some(e => e.code === 'MAP_WORLD_REALM_TAG_UNKNOWN' && e.tag === 'XYZ'));
  assert.ok(codes(r).includes('REALM_TAG_INVALID'));
  assert.ok(codes(r).includes('REALM_TAG_DUPLICATE'));
});

test('the form, weights, frame and polygons are checked', () => {
  assert.ok(codes(validateCountries({ source: 'mod', realms: [] })).includes('COUNTRIES_FORM_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200])], { islands: 'some' }))).includes('COUNTRIES_FORM_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { weight: RULES.weightMax + 1 })]))).includes('REALM_WEIGHT_RANGE'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { weight: 0.01 })]))).includes('REALM_WEIGHT_RANGE'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [FRAME.width, 10])]))).includes('REALM_POINT_OUTSIDE_FRAME'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { claim: [[[1, 1], [2, 2]]] })]))).includes('REALM_POLYGON_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { stray: 1 })]))).includes('COUNTRIES_FORM_INVALID'));
});

test('points of two realms closer than the separation are a warning, not an error', () => {
  const r = validateCountries(valid([realm('AAA', [200, 200]), realm('BBB', [205, 200])]), { isLand, minSeparationPx: 12 });
  assert.equal(r.ok, true);
  assert.equal(r.warnings[0].code, 'REALM_POINTS_CLOSE');
});

test('geometry: overlap and outline helpers', () => {
  assert.equal(ringsOverlap(box(0, 0, 10, 10), box(5, 5, 15, 15)), true);
  assert.equal(ringsOverlap(box(0, 0, 10, 10), box(10, 0, 20, 10)), false);
  assert.equal(ringsOverlap(box(0, 0, 10, 10), box(20, 20, 30, 30)), false);
  assert.equal(pointInRing(5, 5, box(0, 0, 10, 10)), true);
  const w = 20, h = 10, mask = new Uint8Array(w * h);
  for (let y = 2; y < 8; y++) for (let x = 2; x < 8; x++) mask[y * w + x] = 1;
  for (let y = 4; y < 6; y++) for (let x = 4; x < 6; x++) mask[y * w + x] = 0; // a hole, filled by outlines
  const rings = outlines(mask, w, h, 4, { tolPx: 0 });
  assert.equal(rings.length, 1);
  assert.equal(pointInRing(20, 20, rings[0]), true);
});

// ---------------------------------------------------------------------------------------------------- the real output
const committed = JSON.parse(readFileSync(OUT.seeds, 'utf8'));
const roster = JSON.parse(readFileSync(path.join(ZIN, PATHS.roster), 'utf8'));
const drawingPresent = existsSync(path.join(ZIN, PATHS.drawing));

test('the committed realm seeds cover the roster once, with its overlords and weights in range', () => {
  const c = committed.countries;
  assert.equal(c.source, 'workspace');
  assert.equal(c.realms.length, roster.realms.length);
  assert.deepEqual(c.realms.map(r => r.tag), roster.realms.map(r => r.tag));
  const tagOf = new Map(roster.realms.map(r => [r.key, r.tag]));
  for (const r of roster.realms) {
    const out = c.realms.find(x => x.tag === r.tag);
    assert.equal(out.overlord, r.overlord ? tagOf.get(r.overlord) : undefined, `${r.tag} overlord`);
    assert.ok(out.weight >= WEIGHT.min && out.weight <= WEIGHT.max, `${r.tag} weight`);
    for (const p of [out.capital, ...(out.seeds ?? [])]) assert.ok(Number.isInteger(p[0]) && Number.isInteger(p[1]), `${r.tag} integer point`);
  }
  const v = validateCountries(c, { knownTags: new Set(roster.realms.map(r => r.tag)), minSeparationPx: PLACE.validatorMinSeparationPx });
  assert.deepEqual(v.errors, []);
});

test('the committed realm seeds stand on the land the import reads', { skip: drawingPresent ? false : 'the private drawing is absent; the land check needs it' }, async () => {
  const world = await loadWorld({ drawing: true, marginPx: 0 });
  const v = validateCountries(committed.countries, { isLand: landPredicate(world), knownTags: new Set(roster.realms.map(r => r.tag)), minSeparationPx: PLACE.validatorMinSeparationPx });
  assert.deepEqual(v.errors, []);
});

test('the generator is deterministic and reproduces the committed file', { skip: drawingPresent ? false : 'the private drawing is absent; the committed output was built with it' }, async () => {
  const a = await buildRealmSeeds({ drawing: true });
  const b = await buildRealmSeeds({ world: a.world });
  assert.deepEqual(a.countries, b.countries);
  assert.deepEqual(a.countries, committed.countries);
});

test('the report and the data file agree', () => {
  const report = JSON.parse(readFileSync(OUT.report, 'utf8'));
  assert.equal(report.realms.length, committed.countries.realms.length);
  for (const r of committed.countries.realms) {
    const rr = report.realms.find(x => x.tag === r.tag);
    assert.deepEqual(rr.capital.point, r.capital, `${r.tag} capital`);
    assert.deepEqual(rr.seeds.map(s => s.point), r.seeds ?? [], `${r.tag} seeds`);
  }
  assert.equal(report.validation.ok, true);
  assert.ok(here.endsWith('politics'));
});
