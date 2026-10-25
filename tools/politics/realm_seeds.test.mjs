// Tests of the politics input of the drawn-map import: the validator's rules on small synthetic cases, and the
// committed tools/politics/data/realm_seeds.json and create_world_call.json against the roster, the rules, the tool's
// published schema (when the tool repository and its Ajv are reachable) and (when the private drawing is present)
// the land the import reads and a byte-for-byte rebuild.
//   node --test tools/politics/realm_seeds.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { validateCountries, validateSubjects, RULES } from './countries_validator.mjs';
import { ringsOverlap, pointInRing, outlines, FRAME } from './geometry.mjs';
import { buildRealmSeeds, landPredicate, createWorldCall, schemaCheck, formatSeeds, OUT, PLACE, WEIGHT, DEFAULT_TOOL, RETIRED_REALMS } from './realm_seeds.mjs';
import { loadWorld, PATHS, ZIN } from './world_inputs.mjs';

const pt = (x, y) => ({ x, y });
const box = (x0, y0, x1, y1) => [pt(x0, y0), pt(x1, y0), pt(x1, y1), pt(x0, y1)];
// a synthetic world: land is the rectangle 100..900 x 100..500, everything else water
const isLand = (x, y) => x >= 100 && x < 900 && y >= 100 && y < 500;
const realm = (tag, capital, extra = {}) => ({ tag, capital: pt(...capital), ...extra });
const valid = (realms, extra = {}) => ({ source: 'workspace', realms, islands: 'one-owner', ...extra });
const codes = r => r.errors.map(e => e.code);

test('a small valid request passes', () => {
  const r = validateCountries(valid([realm('AAA', [200, 200], { weight: 2, claim: [box(150, 150, 300, 300)] }), realm('BBB', [700, 300], { seeds: [pt(800, 400)], exclude: [box(100, 100, 400, 500)] })]), { isLand, knownTags: new Set(['AAA', 'BBB']) });
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
});

test('a capital or seed in water is refused', () => {
  const r = validateCountries(valid([realm('AAA', [50, 50]), realm('BBB', [700, 300], { seeds: [pt(950, 300)] })]), { isLand });
  assert.equal(codes(r).filter(c => c === 'MAP_WORLD_REALM_POINT_WATER').length, 2);
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
  assert.ok(!r.errors.some(e => e.code === 'REALM_POINT_IN_CLAIM' && e.tag === 'AAA'));
});

test('a claim that its own exclusion or the unowned area also covers is refused', () => {
  const r = validateCountries(valid([realm('AAA', [200, 200], { claim: [box(150, 150, 300, 300)], exclude: [box(250, 250, 400, 400)] }), realm('BBB', [700, 400], { claim: [box(650, 150, 750, 250)] })], { unowned: [box(700, 200, 800, 300)] }), { isLand });
  assert.ok(codes(r).includes('REALM_CLAIM_EXCLUDED'));
  assert.ok(codes(r).includes('REALM_CLAIM_UNOWNED'));
});

test('subject relations: cycles, self-overlords and unknown overlords are refused', () => {
  const tags = ['AAA', 'BBB', 'CCC'];
  assert.equal(validateSubjects([{ tag: 'AAA', overlord: 'BBB' }, { tag: 'BBB', overlord: 'AAA' }], tags).errors.filter(e => e.code === 'REALM_OVERLORD_CYCLE').length, 1);
  assert.equal(validateSubjects([{ tag: 'AAA', overlord: 'BBB' }, { tag: 'BBB', overlord: 'CCC' }, { tag: 'CCC', overlord: 'AAA' }], tags).errors.filter(e => e.code === 'REALM_OVERLORD_CYCLE').length, 1);
  assert.ok(validateSubjects([{ tag: 'AAA', overlord: 'AAA' }], tags).errors.some(e => e.code === 'REALM_OVERLORD_CYCLE'));
  assert.ok(validateSubjects([{ tag: 'AAA', overlord: 'ZZZ' }], tags).errors.some(e => e.code === 'REALM_OVERLORD_UNKNOWN'));
  assert.equal(validateSubjects([{ tag: 'BBB', overlord: 'AAA' }, { tag: 'CCC', overlord: 'BBB' }], tags).ok, true);
});

test('unknown, malformed and duplicate tags are refused', () => {
  const r = validateCountries(valid([realm('AAA', [200, 200]), realm('XYZ', [400, 200]), realm('1AB', [600, 200]), realm('AAA', [700, 300])]), { isLand, knownTags: new Set(['AAA']) });
  assert.ok(r.errors.some(e => e.code === 'MAP_WORLD_REALM_TAG_UNKNOWN' && e.tag === 'XYZ'));
  assert.ok(codes(r).includes('REALM_TAG_INVALID'));
  assert.ok(codes(r).includes('REALM_TAG_DUPLICATE'));
});

test('the schema\'s shape and limits are checked', () => {
  assert.ok(codes(validateCountries({ source: 'mod', realms: [] })).includes('COUNTRIES_FORM_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200])], { islands: 'some' }))).includes('COUNTRIES_FORM_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200])], { connectedMainland: true }))).includes('COUNTRIES_FORM_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { overlord: 'BBB' })]))).includes('COUNTRIES_FORM_INVALID'));
  assert.ok(codes(validateCountries(valid([{ tag: 'AAA', capital: [200, 200] }]))).includes('REALM_POINT_INVALID'));
  assert.ok(codes(validateCountries(valid([{ tag: 'AAA', capital: { x: 200.5, y: 200 } }]))).includes('REALM_POINT_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { weight: RULES.weightMax + 1 })]))).includes('REALM_WEIGHT_RANGE'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { weight: 0.01 })]))).includes('REALM_WEIGHT_RANGE'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [FRAME.width, 10])]))).includes('REALM_POINT_OUTSIDE_FRAME'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { claim: [[pt(1, 1), pt(2, 2)]] })]))).includes('REALM_POLYGON_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { claim: [] })]))).includes('REALM_POLYGON_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { exclude: Array.from({ length: RULES.maxExcludePolygons + 1 }, () => box(600, 300, 700, 400)) })]))).includes('REALM_POLYGON_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { seeds: Array.from({ length: RULES.maxSeeds + 1 }, () => pt(300, 300)) })]))).includes('REALM_POINT_INVALID'));
  assert.ok(codes(validateCountries(valid([realm('AAA', [200, 200], { stray: 1 })]))).includes('COUNTRIES_FORM_INVALID'));
});

test('points of two realms closer than the separation are a warning, not an error', () => {
  const r = validateCountries(valid([realm('AAA', [200, 200]), realm('BBB', [205, 200])]), { isLand, minSeparationPx: 12 });
  assert.equal(r.ok, true);
  assert.equal(r.warnings[0].code, 'REALM_POINTS_CLOSE');
});

test('geometry: overlap and outline helpers', () => {
  const b = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  assert.equal(ringsOverlap(b(0, 0, 10, 10), b(5, 5, 15, 15)), true);
  assert.equal(ringsOverlap(b(0, 0, 10, 10), b(10, 0, 20, 10)), false);
  assert.equal(ringsOverlap(b(0, 0, 10, 10), b(20, 20, 30, 30)), false);
  assert.equal(pointInRing(5, 5, b(0, 0, 10, 10)), true);
  const w = 20, h = 10, mask = new Uint8Array(w * h);
  for (let y = 2; y < 8; y++) for (let x = 2; x < 8; x++) mask[y * w + x] = 1;
  for (let y = 4; y < 6; y++) for (let x = 4; x < 6; x++) mask[y * w + x] = 0; // a hole, filled by outlines
  const rings = outlines(mask, w, h, 4, { tolPx: 0 });
  assert.equal(rings.length, 1);
  assert.equal(pointInRing(20, 20, rings[0]), true);
});

// ---------------------------------------------------------------------------------------------------- the real output
const committed = JSON.parse(readFileSync(OUT.seeds, 'utf8'));
const report = JSON.parse(readFileSync(OUT.report, 'utf8'));
const roster = JSON.parse(readFileSync(path.join(ZIN, PATHS.roster), 'utf8'));
const drawingPresent = existsSync(path.join(ZIN, PATHS.drawing));

test('the committed realm seeds cover the roster once, in the schema\'s shape, with weights in range', () => {
  const c = committed.countries;
  const live = roster.realms.filter(r => !RETIRED_REALMS.has(r.tag));
  assert.deepEqual(Object.keys(c).sort(), ['islands', 'realms', 'source', 'unowned']);
  assert.equal(c.realms.length, live.length);
  assert.deepEqual(c.realms.map(r => r.tag), live.map(r => r.tag));
  for (const r of c.realms) {
    assert.ok(r.weight >= WEIGHT.min && r.weight <= WEIGHT.max, `${r.tag} weight`);
    assert.equal(r.overlord, undefined);
  }
  const v = validateCountries(c, { knownTags: new Set(roster.realms.map(r => r.tag)), minSeparationPx: PLACE.validatorMinSeparationPx });
  assert.deepEqual(v.errors, []);
});

test('the roster\'s subject relations are in the report and valid', () => {
  const tagOf = new Map(roster.realms.map(r => [r.key, r.tag]));
  const expected = roster.realms.filter(r => r.overlord).map(r => ({ tag: r.tag, overlord: tagOf.get(r.overlord) }));
  assert.deepEqual(report.subjects.relations.map(s => ({ tag: s.tag, overlord: s.overlord })), expected);
  assert.equal(report.subjects.validation.ok, true);
});

test('the create_world call is the preview call with the committed countries', () => {
  const call = JSON.parse(readFileSync(OUT.call, 'utf8'));
  assert.deepEqual(call, createWorldCall(committed.countries));
  assert.equal(call.arguments.preview, true);
  assert.equal(call.arguments.operations[0].kind, 'create_world');
});

let schemaReachable = true;
try { await schemaCheck(createWorldCall(committed.countries)); } catch { schemaReachable = false; }
test('the create_world call validates against the tool\'s published map-operation schema', { skip: schemaReachable ? false : `the tool repository or its Ajv is not reachable at ${DEFAULT_TOOL}` }, async () => {
  assert.deepEqual(await schemaCheck(JSON.parse(readFileSync(OUT.call, 'utf8'))), []);
  // the schema rejects the old shape: [x, y] points and the connectedMainland key
  const old = createWorldCall({ ...committed.countries, connectedMainland: true, realms: [{ tag: 'AEN', capital: [3061, 1464] }] });
  assert.ok((await schemaCheck(old)).length > 0);
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
  assert.equal(formatSeeds({ ...committed, countries: a.countries }), readFileSync(OUT.seeds, 'utf8'));
});

test('the report and the data file agree', () => {
  assert.equal(report.realms.length, committed.countries.realms.length);
  for (const r of committed.countries.realms) {
    const rr = report.realms.find(x => x.tag === r.tag);
    assert.deepEqual({ x: rr.capital.point[0], y: rr.capital.point[1] }, r.capital, `${r.tag} capital`);
    assert.deepEqual(rr.seeds.map(s => ({ x: s.point[0], y: s.point[1] })), r.seeds ?? [], `${r.tag} seeds`);
  }
  assert.equal(report.validation.ok, true);
});
