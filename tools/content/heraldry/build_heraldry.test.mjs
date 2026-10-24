// Tests of the heraldry generator (tools/content/heraldry/build_heraldry.mjs, spec docs/specs/08_art_and_assets/06_heraldry.md).
// The build must pass every check on the real data, be deterministic and idempotent, and every rule must fail at
// least one deliberately broken copy of the data (the negative tests). Nothing here writes a file.
//   node --test tools/content/heraldry/build_heraldry.test.mjs
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadSources, build, runChecks, serialize, designHash, designDistance, smallGridDistance, stripNegations,
  checkCoverage, checkGrammars, checkRecordRules, checkForms, checkDistinctness, checkCaps, checkForbidden, checkDynamic,
  TUNING, DESIGNS, CULTURE_RENAMES,
} from './build_heraldry.mjs';

let src, base;
before(() => {
  src = loadSources();
  base = build(src);
});
const fresh = () => JSON.parse(JSON.stringify(base.doc));
const rec = (doc, key) => doc.countries.find((r) => r.key === key);
const rules = (findings) => findings.map((f) => f.rule);
const hasRule = (findings, rule) => findings.some((f) => f.rule === rule || f.rule.startsWith(`${rule}:`) || f.rule === `forbidden:${rule}` || f.rule === `canon:${rule}`);
const rehash = (r) => { r.design_hash = designHash(r); return r; };

// ---- The real data ------------------------------------------------------------------------------------------------

test('the build has no errors and every check passes on the real data', () => {
  assert.deepEqual(base.errors, []);
  const checks = runChecks(base.doc, src);
  assert.deepEqual(checks.findings, [], JSON.stringify(checks.findings.slice(0, 10), null, 1));
});

test('every realm of the roster has exactly one design, keyed by key and tag', () => {
  const keys = base.doc.countries.map((r) => r.key);
  assert.equal(keys.length, src.roster.realms.length);
  assert.equal(new Set(keys).size, keys.length);
  for (const realm of src.roster.realms) {
    const r = rec(base.doc, realm.key);
    assert.ok(r, `no design for ${realm.key}`);
    assert.equal(r.tag, realm.tag);
  }
  assert.equal(DESIGNS.length, src.roster.realms.length);
});

test('every culture of cultures_new.json, every renamed id and the Baelim and mycids have grammars', () => {
  for (const id of Object.keys(src.culturesNew.cultures)) assert.ok(base.doc.cultures[id], id);
  for (const [from, to] of Object.entries(CULTURE_RENAMES)) { assert.ok(base.doc.cultures[to], to); assert.equal(base.doc.cultures[from], undefined, from); }
  assert.equal(base.doc.cultures.vale_folk, undefined);
  assert.ok(base.doc.peoples.find((p) => p.id === 'tree_people'));
  assert.ok(base.doc.peoples.find((p) => p.id === 'mycids'));
  assert.equal(base.doc.cultures.baelim.people, 'tree_people');
  assert.notEqual(base.doc.cultures.baelim.line, base.doc.cultures.kilinti_ents.line);
});

test('the build is deterministic and idempotent', () => {
  const again = build(src);
  assert.equal(serialize(again.doc), serialize(base.doc));
  const second = build({ ...src, heraldry: JSON.parse(serialize(base.doc)) });
  assert.equal(serialize(second.doc), serialize(base.doc));
});

test('owner canon: Hirolon sovereign, Tirlan its protectorate, the Concord charter, the Dominion base, the Will of Zol', () => {
  const doc = base.doc;
  assert.ok(!rec(doc, 'hirolon').marks.some((m) => m.tincture.overlord_mark));
  assert.ok(rec(doc, 'tirlan').marks.some((m) => m.mark === 'ward_border' && m.tincture.source === 'hill_giants'));
  for (const realm of src.roster.realms.filter((r) => r.overlord === 'aenor')) assert.ok(rec(doc, realm.key).marks.some((m) => m.mark === 'charter_border'), realm.key);
  for (const realm of src.roster.realms.filter((r) => r.overlord === 'puvulan')) assert.ok(rec(doc, realm.key).marks.some((m) => m.mark === 'grave_base'), realm.key);
  const zol = rec(doc, 'zols_mistake');
  assert.equal(zol.primary_charge.id, 'broken_rings_sigil');
  assert.equal(zol.secondary_charge, null);
  assert.equal(zol.marks.length, 0);
  assert.equal(doc.dynamic.story.length, 9);
  assert.equal(doc.dynamic.fallback.length, 75);
});

test('the distance is zero for a design against itself and grows with each difference', () => {
  const a = rec(base.doc, 'aenor');
  assert.equal(designDistance(a, a), 0);
  const b = JSON.parse(JSON.stringify(a));
  b.primary_charge.id = 'lake_barge'; b.primary_charge.class = 'ship';
  assert.ok(designDistance(a, b) >= 4);
  assert.ok(smallGridDistance(a, a) < 1e-9);
});

test('grammar prose that forbids a motif is not read as the motif', () => {
  assert.equal(/\bpalms?\b/i.test(stripNegations('Water is drawn as wells; never a palm tree (banned everywhere).')), false);
  assert.equal(/\bpalms?\b/i.test(stripNegations('A palm on sand.')), true);
});

// ---- Negative tests: one or more per rule ----------------------------------------------------------------------

test('coverage fails for a missing design, a duplicate design, a foreign key and a wrong tag', () => {
  let doc = fresh(); doc.countries = doc.countries.filter((r) => r.key !== 'kea');
  assert.ok(hasRule(checkCoverage(doc, src.roster), 'coverage'));
  doc = fresh(); doc.countries.push(JSON.parse(JSON.stringify(rec(doc, 'kea'))));
  assert.ok(hasRule(checkCoverage(doc, src.roster), 'coverage'));
  doc = fresh(); rec(doc, 'kea').key = 'atlantis';
  assert.ok(hasRule(checkCoverage(doc, src.roster), 'coverage'));
  doc = fresh(); rec(doc, 'kea').tag = 'Y6A';
  assert.ok(hasRule(checkCoverage(doc, src.roster), 'coverage'));
});

test('identical designs fail by hash, near-identical ones by distance', () => {
  let doc = fresh();
  const copy = JSON.parse(JSON.stringify(rec(doc, 'stabilo')));
  Object.assign(copy, { key: 'stabilo_copy', tag: 'ZZZ', region: 'west_lands' });
  doc.countries.push(copy);
  const f1 = checkDistinctness(doc).findings;
  assert.ok(f1.some((x) => x.rule === 'distinct' && /hash/.test(x.message)));
  doc = fresh();
  const near = JSON.parse(JSON.stringify(rec(doc, 'stabilo')));
  Object.assign(near, { key: 'stabilo_near', tag: 'ZZY', region: 'west_lands' });
  near.field.tinctures[0] = { ...near.field.tinctures[0], hex: '#8c3030' }; // caravan red nudged
  rehash(near);
  doc.countries.push(near);
  const f2 = checkDistinctness(doc).findings;
  assert.ok(f2.some((x) => x.rule === 'distinct' && /near-identical/.test(x.message)), JSON.stringify(f2));
});

test('a shared small-flag signature or too-alike small flags in a region fail', () => {
  const doc = fresh();
  const a = rec(doc, 'saopon'), b = rec(doc, 'kradlon');
  b.field = JSON.parse(JSON.stringify(a.field));
  b.primary_charge.tincture = { ...a.primary_charge.tincture };
  rehash(b);
  const f = checkDistinctness(doc).findings;
  assert.ok(f.some((x) => x.rule === 'small_flag' && /signature/.test(x.message)));
  assert.ok(f.some((x) => x.rule === 'small_flag' && /too alike/.test(x.message)));
});

test('a tincture outside the culture palette, an undeclared borrowing or two borrowings fail', () => {
  let doc = fresh();
  rec(doc, 'aenor').field.tinctures[0] = { name: 'clan madder', hex: '#6b2f2a', source: 'gunwyn_clans' };
  assert.ok(hasRule(checkRecordRules(doc), 'palette'));
  doc = fresh();
  rec(doc, 'aenor').field.tinctures[0] = { name: 'violet', hex: '#7f00ff', source: 'lake_aenoran' };
  assert.ok(hasRule(checkRecordRules(doc), 'palette'));
  doc = fresh();
  const r = rec(doc, 'hirolon');
  r.primary_charge.tincture = { name: 'fleece cream', hex: '#e8e0c0', source: 'hilofrim_herders', borrowed: true };
  assert.ok(checkRecordRules(doc).some((x) => x.rule === 'palette' && /borrowed tinctures/.test(x.message)));
});

test('a division or line outside the grammar fails', () => {
  let doc = fresh(); rec(doc, 'girdon').field.division = 'gyronny';
  assert.ok(hasRule(checkRecordRules(doc), 'grammar_fit'));
  doc = fresh(); rec(doc, 'girdon').field.line = 'wavy';
  assert.ok(hasRule(checkRecordRules(doc), 'grammar_fit'));
});

test('low contrast without fimbriation, a weak secondary and an over-full achievement fail', () => {
  let doc = fresh();
  const r = rec(doc, 'sensai'); delete r.primary_charge.fimbriated;
  assert.ok(hasRule(checkRecordRules(doc), 'contrast'));
  doc = fresh(); rec(doc, 'aenor').primary_charge.contrast = 1.2; rec(doc, 'aenor').primary_charge.fimbriated = { name: 'deep lake', hex: '#1d3a5c', source: 'lake_aenoran' };
  assert.ok(hasRule(checkRecordRules(doc), 'contrast'));
  doc = fresh(); rec(doc, 'selen').secondary_charge.contrast = 1.1;
  assert.ok(hasRule(checkRecordRules(doc), 'contrast'));
  doc = fresh(); const k = rec(doc, 'konori');
  k.secondary_charge = { id: 'milk_bowl', name: 'a wooden bowl', class: 'vessel', tincture: k.primary_charge.tincture, contrast: 3 };
  assert.ok(hasRule(checkRecordRules(doc), 'budget'));
});

test('the marks of rank and form are enforced', () => {
  const doc0 = fresh();
  const strip = (key, mark) => { const doc = fresh(); const r = rec(doc, key); r.marks = r.marks.filter((m) => m.mark !== mark); return doc; };
  assert.ok(hasRule(checkForms(strip('selen', 'charter_border'), src.roster), 'form'), 'dominion without charter border');
  assert.ok(hasRule(checkForms(strip('dolon', 'grave_base'), src.roster), 'form'), 'sworn realm without grave base');
  assert.ok(hasRule(checkForms(strip('tirlan', 'ward_border'), src.roster), 'form'), 'Tirlan without ward');
  assert.ok(hasRule(checkForms(strip('gunwyn', 'crown'), src.roster), 'form'), 'kingdom without crown');
  assert.ok(hasRule(checkForms(strip('fotan', 'label'), src.roster), 'form'), 'Ainic realm without label');
  let doc = fresh(); rec(doc, 'hirolon').marks.push(JSON.parse(JSON.stringify(rec(doc0, 'selen').marks.find((m) => m.mark === 'charter_border'))));
  assert.ok(hasRule(checkForms(doc, src.roster), 'form'), 'charter border on sovereign Hirolon');
  doc = fresh(); rec(doc, 'worshipdom').marks.push({ mark: 'label', text: '', tincture: { name: 'bread brown', hex: '#9a6c3e', source: 'zilin_pilgrims' } });
  assert.ok(hasRule(checkForms(doc, src.roster), 'form'), 'theocracy with label');
  doc = fresh(); rec(doc, 'aenor').marks.push({ mark: 'label', text: '', tincture: { name: 'Parim white', hex: '#f2f0e6', source: 'lake_aenoran' } });
  assert.ok(hasRule(checkForms(doc, src.roster), 'form'), 'Aenor with label');
  doc = fresh(); rec(doc, 'kvittumm').primary_charge.count = 1;
  assert.ok(hasRule(checkForms(doc, src.roster), 'form'), 'confederation without tripled charge');
  doc = fresh(); rec(doc, 'olodor').marks = [];
  assert.ok(hasRule(checkForms(doc, src.roster), 'form'), 'enclave without orle');
});

test('the regional cap, the culture cap and the class share are enforced', () => {
  let doc = fresh();
  for (const key of ['dreson', 'britadon', 'skragdurg']) { const r = rec(doc, key); r.primary_charge = { ...r.primary_charge, id: 'anvil', class: 'tool' }; }
  const f = checkCaps(doc).findings;
  assert.ok(f.some((x) => /used 3 times/.test(x.message)), 'regional cap');
  assert.ok(f.some((x) => /repeated in culture/.test(x.message)), 'culture cap');
  doc = fresh();
  for (const r of doc.countries.filter((x) => x.region === 'cold_lands').slice(0, 10)) r.primary_charge.class = 'beast';
  assert.ok(checkCaps(doc).findings.some((x) => /charge class beast/.test(x.message)), 'class share');
});

test('regional clichés fail: palm trees, snowflakes, a second camel, skulls, a sun disc twice in a culture', () => {
  let doc = fresh(); rec(doc, 'wahatud').blazon += ' Behind it a palm tree.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'palm_tree'));
  doc = fresh(); rec(doc, 'coldor').primary_charge.name = 'a snowflake';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'snowflake'));
  doc = fresh(); rec(doc, 'naamis').secondary_charge = { id: 'kneeling_camel', name: 'a camel kneeling', class: 'beast', tincture: { name: 'coast white', hex: '#f0f0e8' } };
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'camel'));
  doc = fresh(); rec(doc, 'santon').primary_charge.id = 'skull_cairn';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'skull'));
  doc = fresh(); rec(doc, 'dun').primary_charge.id = 'skull_cairn'; rec(doc, 'bordon').primary_charge.id = 'skull_cairn';
  assert.ok(checkForbidden(doc, src.pantheon).some((x) => x.rule === 'forbidden:skull' && /more than one/.test(x.message)));
  doc = fresh(); rec(doc, 'lands_of_light').secondary_charge = { id: 'sun_court', name: 'a sun court', class: 'building', tincture: { name: 'noon gold', hex: '#e0a02a' } };
  rec(doc, 'lands_of_light').culture = 'sunhot_light';
  doc.countries.push({ ...JSON.parse(JSON.stringify(rec(doc, 'lands_of_light'))), key: 'x', primary_charge: { ...rec(doc, 'lands_of_light').primary_charge, id: 'sun_court' } });
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'sun_disc'));
});

test('real-world flags and arms and their look-alikes fail', () => {
  for (const words of ['A tricolour of three equal bands.', 'A cross throughout in white.', 'A saltire of gold.', 'Stars in a canton.', 'An eagle displayed.', 'A crescent and star.', 'A fleur-de-lis of gold.', 'A rising sun with rays to the edges.', 'A skull and crossbones.', 'Chequy red and white.', 'A hammer and sickle.']) {
    const doc = fresh(); rec(doc, 'kersian').blazon += ` ${words}`;
    assert.ok(checkForbidden(doc, src.pantheon).some((x) => x.rule.startsWith('forbidden:')), words);
  }
  const doc = fresh(); rec(doc, 'azano').field = { division: 'plain', line: null, tinctures: [rec(doc, 'azano').field.tinctures[0]] };
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'plain_disc'), 'a plain disc on a plain field');
});

test('real religious symbols, crosses of any arrangement and a pentagram outside a demon sigil fail', () => {
  for (const words of ['A lotus in white.', 'An ankh.', 'A hexagram.', 'An inverted cross.', 'A chalice of gold.', 'A triquetra.']) {
    const doc = fresh(); rec(doc, 'mora').blazon += ` ${words}`;
    assert.ok(checkForbidden(doc, src.pantheon).some((x) => x.rule.startsWith('forbidden:')), words);
  }
  let doc = fresh(); rec(doc, 'nether').blazon += ' A cross of flame.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'cross'), 'a cross even on a demon realm');
  doc = fresh(); rec(doc, 'aenor').primary_charge.id = 'kings_seal';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'pentagram'), 'pentagram outside the demons');
  doc = fresh(); rec(doc, 'veshazel').primary_charge.id = 'kings_seal';
  assert.ok(checkForbidden(doc, src.pantheon).some((x) => x.rule === 'forbidden:pentagram' && /more than one/.test(x.message)), 'a second pentagram');
});

test('other fiction, lettering, the owner emblem and the Great Wall as masonry fail', () => {
  for (const words of ['A white tree.', 'A round door.', 'A flaming eye.', 'A white hand.']) {
    const doc = fresh(); rec(doc, 'dobbum').blazon += ` ${words}`;
    assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'other_fiction'), words);
  }
  for (const words of ['The motto written on a scroll.', 'Runes round the border.', 'A monogram in gold.']) {
    const doc = fresh(); rec(doc, 'pazoma').blazon += ` ${words}`;
    assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'lettering'), words);
  }
  let doc = fresh(); rec(doc, 'adel').blazon += ' A square frame with crossed diagonals and a staff.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'owner_emblem'));
  doc = fresh(); rec(doc, 'kingson').primary_charge.name = 'a gate-tower between two peaks';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'wall_motifs'));
  doc = fresh(); rec(doc, 'klungori_guard').blazon += ' Above it battlements of grey stone.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'wall_motifs'));
});

test('canon guards fail: named gods and their devices, named persons, Zol\'s servant, the wider world, Afrit\'s signs', () => {
  let doc = fresh(); rec(doc, 'aenor').meaning += ' Under Lumae.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'named_god'));
  doc = fresh(); rec(doc, 'aenor').primary_charge.name = 'a bowl-lamp with one flame';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'god_device'), "Lumae's lamp");
  doc = fresh(); rec(doc, 'kunhrim').primary_charge.name = 'a flaming anvil';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'god_device'), "Irumas's anvil");
  doc = fresh(); rec(doc, 'ren').primary_charge.name = 'a tower on a mount';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'god_device'), "Kerun's tower");
  doc = fresh(); rec(doc, 'puvulan').blazon += ' Above the gate the figure of Volgan.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'named_person'));
  doc = fresh(); rec(doc, 'zols_mistake').meaning += ' Kusven keeps it.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'zol_servant'));
  doc = fresh(); rec(doc, 'zols_mistake').blazon += ' A black oval.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'zol_servant'));
  doc = fresh(); rec(doc, 'zols_mistake').secondary_charge = { id: 'ring_of_names', name: 'a ring of short notches', class: 'token', tincture: { name: 'cold grey', hex: '#6a6a72' } };
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'zol_emblem'));
  doc = fresh(); rec(doc, 'goodin').meaning += ' Its traders sail to Erdu.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'wider_world'));
  doc = fresh(); rec(doc, 'worshipdom').blazon += ' Above it a veiled eye.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'afrit_deny'));
  doc = fresh(); rec(doc, 'aenor').meaning += ' The ash of the god-king.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'afrit_deny'));
  doc = fresh(); rec(doc, 'yeldenne').blazon += ' A blue sword.';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'reserved_glo_sword'));
  doc = fresh(); doc.cultures.ice_giants.charges[0].meaning = 'the Ice-Throne of Titanos';
  assert.ok(hasRule(checkForbidden(doc, src.pantheon), 'retired_names'), 'a retired name in a grammar');
});

test('grammar rules fail: duplicate charge ids, a palette without a metal, a dwarven tincture shared with the elves, a missing grammar', () => {
  let doc = fresh(); doc.cultures.baelim.charges.push({ ...doc.cultures.kilinti_ents.charges[0] });
  assert.ok(hasRule(checkGrammars(doc, src.culturesNew), 'grammar'));
  doc = fresh(); doc.cultures.baelim.palette = doc.cultures.baelim.palette.filter((t) => t.class !== 'metal');
  assert.ok(checkGrammars(doc, src.culturesNew).some((x) => /no metal/.test(x.message)));
  doc = fresh(); doc.cultures.west_delvers.palette.push({ ...doc.cultures.forest_council_elves.palette[0] });
  assert.ok(checkGrammars(doc, src.culturesNew).some((x) => /elven tincture/.test(x.message)));
  doc = fresh(); delete doc.cultures.mycid_rings;
  assert.ok(checkGrammars(doc, src.culturesNew).some((x) => x.where === 'mycid_rings'));
  doc = fresh(); doc.cultures.baelim.line = doc.cultures.kilinti_ents.line;
  assert.ok(checkGrammars(doc, src.culturesNew).some((x) => /ents' line/.test(x.message)));
});

test('dynamic-tag rules fail: a missing fallback, a repeated fallback, a story parent with an old debug tag', () => {
  let doc = fresh(); doc.dynamic.fallback.pop();
  assert.ok(hasRule(checkDynamic(doc, src.roster), 'dynamic'));
  doc = fresh(); doc.dynamic.fallback[1] = { ...JSON.parse(JSON.stringify(doc.dynamic.fallback[0])), tag: 'D02' };
  assert.ok(hasRule(checkDynamic(doc, src.roster), 'dynamic'));
  doc = fresh(); doc.dynamic.story[0].parent = 'Y0L';
  assert.ok(hasRule(checkDynamic(doc, src.roster), 'dynamic'));
});

test('the tuning table holds the thresholds the spec states', () => {
  assert.equal(TUNING.primaryPerRegion, 2);
  assert.equal(TUNING.primaryPerCulture, 1);
  assert.equal(TUNING.elementMax, 4);
  assert.equal(TUNING.classShareMax, 0.4);
  assert.ok(rules(runChecks(base.doc, src).findings).length === 0);
});
