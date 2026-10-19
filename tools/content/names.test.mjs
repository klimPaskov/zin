// Tests for the language-driven name generator (lib/language_generator.mjs, lib/sound_laws.mjs), the builder module
// (modules/names.mjs) and the name checks (checks/names_check.mjs). They need no staged tree: buildNames runs on an
// in-memory Staged, so `node --test tools/content/names.test.mjs` works on its own.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import {
  NameRegistry, PLACE_KINDS, blendShares, buildContext, carriesSignature, checkName, composeRecipe, createNameGenerator, editDistance, isWindows1252, keyOf,
  loadNamingData, neutralBlend, nonWindows1252,
} from './lib/language_generator.mjs';
import { applyLaws, parseLaws } from './lib/sound_laws.mjs';
import { BANNED, buildNames, placeNames, resetNaming, resolveName } from './modules/names.mjs';
import { assertNoViolations, checkLanguageBatches, checkRelatedness, checkSamples, checkStagedNames, parseNamesFile } from './checks/names_check.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = loadNamingData();
const ctx = buildContext(data);
const { countries } = JSON.parse(readFileSync(path.join(here, 'data/countries.json'), 'utf8'));
const { labels } = JSON.parse(readFileSync(path.join(here, 'data/labels.json'), 'utf8'));
const tagOf = name => countries.find(c => c.name === name).tag;
const freshGenerator = () => createNameGenerator(data, { context: ctx });
const codes = problems => problems.map(p => p.code);
const build = () => { resetNaming(); const staged = new Staged(); const pools = buildNames(staged, countries, labels); return { staged, pools, text: staged.files.get('common/names/zin_names.txt').toString('utf8') }; };
let built; // one shared build for the tests that only read it
const getBuilt = () => (built ??= build());

// The sample names of languages.json that break a rule the generator enforces. Found by checkSamples and listed here so
// that a new defect fails the test; a fixed defect is simply no longer reported.
const KNOWN_SAMPLE_DEFECTS = new Set(['dondric Edddun', 'alerhic Beria', 'trollish Torrrokk', 'trollish Glooo', 'trollish Wooo']);

test('The language data parses: 24 languages, each with at least 40 elements including the 27 core ones', () => {
  assert.equal(ctx.languages.size, 24);
  for (const [id, info] of ctx.languages) {
    assert(info.elements.length >= 40, `${id} has ${info.elements.length} elements`);
    assert(info.elements.slice(0, 27).every(e => e.core), `${id} core elements`);
  }
  assert.equal(data.languages.reserved_languages.length, 5, 'the five reserved languages carry no data');
});

test('Every sample recipe of languages.json builds its sample again with the generator\'s own rules', () => {
  let total = 0; const mismatches = [];
  for (const [id, info] of ctx.languages) for (const [bucket, kind] of [['places', 'place'], ['persons', 'person']]) for (const s of info.data.samples[bucket]) {
    total++;
    const built = composeRecipe(info, s.recipe, kind);
    if (built.text !== s.name) mismatches.push(`${id} ${s.name} [${s.recipe}] -> ${built.text ?? built.reason}`);
  }
  assert.equal(total, 1440);
  assert.deepEqual(mismatches, []);
});

test('Every sample name obeys the rules the generator enforces, except the defects reported here', t => {
  const rows = checkSamples(data, ctx), bad = rows.filter(r => r.problems.length);
  assert.equal(rows.length, 1440);
  for (const r of bad) t.diagnostic(`sample ${r.language} ${r.name}: ${r.problems.join('; ')}`);
  const unexpected = bad.filter(r => !KNOWN_SAMPLE_DEFECTS.has(`${r.language} ${r.name}`));
  assert.deepEqual(unexpected.map(r => `${r.language} ${r.name} ${r.problems}`), [], 'a sample name breaks a rule that is not listed as a known defect');
  assert(bad.length <= KNOWN_SAMPLE_DEFECTS.size);
});

test('The declared sound tables are wider than the data: the generator enforces the letters each language really uses', t => {
  let outside = 0;
  for (const info of ctx.languages.values()) for (const s of [...info.data.samples.places, ...info.data.samples.persons]) if ([...keyOf(s.name)].some(ch => !info.declaredLetters.has(ch))) outside++;
  t.diagnostic(`${outside} of 1440 sample names use a letter that the language's sound table does not list`);
  assert(outside > 0, 'the discrepancy this test documents has disappeared: tighten checkName to the declared letters');
  for (const info of ctx.languages.values()) for (const ch of info.declaredLetters) assert(info.letters.has(ch), `${info.id} ${ch}`);
});

test('Negative: banned substrings, modern words and banned_words.json rules reject a name', () => {
  assert(codes(checkName(ctx, 'aenoran', 'Kassim', { kind: 'place' })).includes('banned'), 'ass');
  assert(codes(checkName(ctx, 'aenoran', 'Godelan', { kind: 'place' })).includes('banned'), 'god');
  assert(codes(checkName(ctx, 'aenoran', 'Pizza', { kind: 'place' })).includes('banned'), 'modern word');
  assert(codes(checkName(ctx, 'aenoran', 'Berlin', { kind: 'place' })).includes('banned'), 'banned_words.json real-world rule');
  for (const word of ['rush', 'klinti', 'zol', 'volgan', 'afrit']) assert(ctx.banned.substrings.includes(word), word);
  for (const word of BANNED) assert(ctx.banned.substrings.includes(word), `names.mjs BANNED word ${word}`);
  assert(!ctx.banned.check('Aldenel').length, 'a plain name passes');
});

test('Established names are exempt from the substring filter (Titanos holds "tit")', () => {
  assert(codes(checkName(ctx, 'gigantic', 'Titanos', { kind: 'place' })).includes('banned'));
  assert(!codes(checkName(ctx, 'gigantic', 'Titanos', { kind: 'place', exempt: true })).includes('banned'));
});

test('Negative: only characters of Windows-1252 and the alphabet of the contract', () => {
  assert.deepEqual(nonWindows1252('Šodolôrō'), ['ō']);
  assert.deepEqual(nonWindows1252('Šodolôro'), []);
  assert(isWindows1252('é') && isWindows1252('€') && !isWindows1252('ō') && !isWindows1252('中'));
  assert(codes(checkName(ctx, 'aenoran', 'Zhōng', { kind: 'place' })).includes('font'));
  assert(codes(checkName(ctx, 'aenoran', 'Ab1cd', { kind: 'place' })).includes('alphabet'));
  assert(codes(checkName(ctx, 'aenoran', 'Dun--Rell', { kind: 'place' })).includes('alphabet'));
  assert(!codes(checkName(ctx, 'gunwaithic', 'Chalwe-Gwit', { kind: 'place' })).includes('alphabet'), 'a hyphen between letter groups is allowed');
});

test('Negative: length limits, repeated letters and consonant runs', () => {
  assert(codes(checkName(ctx, 'aenoran', 'Ala', { kind: 'place' })).includes('length'), 'places need 4 letters');
  assert(codes(checkName(ctx, 'aenoran', 'Alaralaralaralararal', { kind: 'place' })).includes('length'), 'places stop at 18 letters');
  assert(codes(checkName(ctx, 'aenoran', 'Ab', { kind: 'given' })).includes('length'));
  assert(codes(checkName(ctx, 'dondric', 'Edddun', { kind: 'place' })).includes('repeat'));
  assert(codes(checkName(ctx, 'orcish', 'Zrkstgh', { kind: 'place' })).includes('consonants'));
});

test('Negative: a letter the language never uses, and a leak marker of another language', () => {
  assert(codes(checkName(ctx, 'aenoran', 'Qamar', { kind: 'place' })).includes('inventory'), 'q is not Aenoran');
  assert(codes(checkName(ctx, 'sylvan', 'Mirotzan', { kind: 'place' })).includes('leak'), 'tz belongs to Orran');
  assert(codes(checkName(ctx, 'leren', 'Alerzgon', { kind: 'place' })).includes('leak'), 'zg belongs to Orcish');
  assert(!codes(checkName(ctx, 'sylvan', 'Lusiel', { kind: 'given' })).includes('leak'), 'iel is Sylvan');
  assert(codes(checkName(ctx, 'dondric', 'Lusiel', { kind: 'given' })).includes('leak'), 'iel is not Dondric');
  assert(ctx.markerOwners.get('x').has('leren'), 'the data is wider than the spec table: Leren words contain x');
});

test('Negative: an unknown language is refused', () => {
  const gen = freshGenerator();
  assert.throws(() => gen.place({ language: 'dwarvish', kind: 'city', entityId: 'x' }), /Unknown language "dwarvish"/);
  assert.throws(() => gen.pool('choral', 'male', 10, 'x'), /Unknown language/);
  assert.deepEqual(codes(checkName(ctx, 'roka_people', 'Abcdef', { kind: 'place' })), ['language']);
  assert.throws(() => gen.place({ language: 'aenoran', kind: 'volcano', entityId: 'x' }), /Unknown place kind/);
});

test('Negative: a duplicate, a near-duplicate across languages and an established name are refused by the registry', () => {
  const reg = new NameRegistry();
  assert.equal(reg.claim('Valeroth', { language: 'aenoran' }).ok, true);
  assert.equal(reg.claim('Valeroth', { language: 'aenoran' }).reason, 'duplicate', 'a unique name has one holder');
  assert.equal(reg.claim('Valeroth', { language: 'leren' }).reason, 'duplicate-language', 'another language cannot hold it');
  assert.equal(reg.claim('Valerath', { language: 'leren' }).reason, 'near-language', 'one edit away from another language\'s name');
  assert.equal(reg.claim('Valerath', { language: 'aenoran' }).reason, 'near', 'one edit away inside the language (unique names)');
  assert.equal(reg.claim('Valerothe', { language: 'aenoran' }).reason, 'near', 'one insertion');
  assert.equal(reg.claim('Valeronthel', { language: 'leren' }).ok, true, 'two or more edits away is fine');
  assert.equal(reg.claim('Bor', { language: 'aenoran' }).ok && reg.claim('Bar', { language: 'leren' }).ok, true, 'names under five letters are not compared');
  reg.reserve('Lorien');
  assert.equal(reg.claim('Lorien', { language: 'galic' }).reason, 'reserved');
  assert.equal(reg.claim('Lorian', { language: 'galic' }).reason, 'near-reserved');
  reg.reserve('Šodolôro');
  assert.equal(reg.claim('Sodoloro', { language: 'galic' }).reason, 'reserved', 'accents fold: the game spelling is the canonical one');
  assert.equal(editDistance('kitten', 'sitting'), 3);
  assert.equal(editDistance('abcdef', 'xyz', 2), 3, 'early exit above the bound');
});

test('A given name or house stem may be shared inside one language but never across two', () => {
  const reg = new NameRegistry();
  assert.equal(reg.claim('Corwen', { language: 'aenoran', unique: false }).ok, true);
  assert.equal(reg.claim('Corwen', { language: 'aenoran', unique: false }).ok, true);
  assert.equal(reg.claim('Corwen', { language: 'coldic', unique: false }).reason, 'duplicate-language');
  assert.equal(reg.claim('Corwin', { language: 'aenoran', unique: false }).ok, true, 'shared words of one people may be close');
  assert.equal(reg.claim('Corwen', { language: 'aenoran', unique: true }).reason, 'duplicate', 'a place cannot take a name already in use');
});

test('The established vault names are reserved: a generated name may not equal one', () => {
  for (const name of ['Eindil', 'Lorien', 'Volgan', 'Zol', 'Parim', 'Šodolôro', 'Mp\'E', 'Einendil']) assert(ctx.reserved.has(keyOf(name)), name);
  assert(codes(checkName(ctx, 'galic', 'Lorien', { kind: 'given' })).includes('reserved'));
  for (const c of countries.slice(0, 40)) assert(ctx.reserved.has(keyOf(c.name)), c.name);
  for (const c of countries.slice(0, 40)) assert(ctx.reserved.has(keyOf(c.capital)), c.capital);
  assert(ctx.reserved.size > 1000, `${ctx.reserved.size} reserved names`);
  const gen = freshGenerator();
  assert.equal(gen.registry.claim('Eindil', { language: 'ainic' }).reason, 'reserved');
});

test('The generator is deterministic: the same inputs give the same names, other inputs other names', () => {
  const a = freshGenerator(), b = freshGenerator();
  const run = g => PLACE_KINDS.flatMap(kind => ['x1', 'x2', 'x3'].map(id => g.place({ language: 'sylvan', kind, entityId: `${kind}-${id}` }).text));
  const first = run(a);
  assert.deepEqual(first, run(b));
  const other = freshGenerator();
  assert.notDeepEqual(first, PLACE_KINDS.flatMap(kind => ['y1', 'y2', 'y3'].map(id => other.place({ language: 'sylvan', kind, entityId: `${kind}-${id}` }).text)));
  const p1 = a.person({ language: 'leren', sex: 'm', entityId: 'p1' }), p2 = b.person({ language: 'leren', sex: 'm', entityId: 'p1' });
  assert.deepEqual(p1, p2);
  assert.deepEqual(a.pool('leren', 'male', 30, 'Y1'), b.pool('leren', 'male', 30, 'Y1'));
  assert.notDeepEqual(a.pool('leren', 'male', 30, 'Y1'), a.pool('leren', 'male', 30, 'Y2'));
});

test('Every kind of name in every language passes every rule, with its parts and gloss', () => {
  const gen = freshGenerator();
  for (const language of gen.languages()) {
    for (const kind of PLACE_KINDS) for (let i = 0; i < 6; i++) {
      const name = gen.place({ language, kind, entityId: `all:${kind}:${i}`, size: i === 0 ? 'capital' : i === 1 ? 'hamlet' : undefined, features: i === 2 ? ['river', 'ford'] : [] });
      assert.deepEqual(checkName(ctx, language, name.text, { kind: 'place' }), [], `${language} ${kind} ${name.text}`);
      assert(name.parts.length >= 1 && name.gloss && name.key === keyOf(name.text), `${language} ${name.text}`);
    }
  }
});

test('Places are unique across the whole world: 4,800 names over all 24 languages share one registry', () => {
  const gen = freshGenerator(), keys = new Set(), owner = new Map();
  for (const language of gen.languages()) for (let i = 0; i < 200; i++) {
    const name = gen.place({ language, kind: PLACE_KINDS[i % PLACE_KINDS.length], entityId: `u:${language}:${i}` });
    assert(!keys.has(name.key), `duplicate ${name.text}`);
    keys.add(name.key); owner.set(name.key, language);
  }
  assert.equal(keys.size, 4800);
  for (const key of keys) assert.equal(gen.registry.owner(key).language, owner.get(key));
});

test('Persons: a full name is a given name and a house, and the words belong to one language', () => {
  const gen = freshGenerator(), names = new Set();
  for (const language of gen.languages()) for (let i = 0; i < 40; i++) {
    const p = gen.person({ language, sex: i % 2 ? 'f' : 'm', entityId: `${language}-${i}`, epithet: i % 4 === 0 });
    assert(!names.has(p.key), `duplicate person ${p.text}`);
    names.add(p.key);
    assert.deepEqual(checkName(ctx, language, p.text, { kind: 'full' }), [], p.text);
    assert.equal(gen.registry.owner(p.given).language, language, p.given);
  }
  assert(gen.person({ language: 'mirolic', sex: 'm', entityId: 'of-style' }).text.includes(' of '), 'Mirolic is "of" a place');
  assert.equal(gen.title('aenoran', 'ruler_f'), 'Queen');
  assert.equal(gen.title('sylvan', 'ruler_m'), data.languages.languages.sylvan.person.titles.ruler_m);
  assert.equal(gen.epithets('aenoran').length, 8);
});

test('generate answers every kind of name for every language, deterministically, and refuses what it cannot make', () => {
  const gen = freshGenerator();
  for (const language of gen.languages()) {
    const titled = Boolean(data.languages.languages[language].person.titles.ruler_m); // the Rite-Tongue has offices, no rulers
    for (const kind of ['given_m', 'given_f', 'house', 'epithet', ...(titled ? ['ruler_title', 'title'] : [])]) {
      const n = gen.generate({ language, kind, entityId: 'g1' });
      assert(n.text && n.key === keyOf(n.text) && n.language === language && n.kind === kind, `${language} ${kind}`);
      assert.deepEqual(gen.generate({ language, kind, entityId: 'g1' }), n, 'the same request, the same name');
    }
    assert.deepEqual(checkName(ctx, language, gen.generate({ language, kind: 'given_f', entityId: 'g2' }).text, { kind: 'given' }), [], language);
  }
  const a = gen.generate({ language: 'leren', kind: 'given_m', entityId: 'g3' }), salted = gen.generate({ language: 'leren', kind: 'given_m', entityId: 'g3', seed: 'second' });
  assert(gen.generate({ language: 'leren', kind: 'given_m', entityId: 'g3', seed: 'second' }).text === salted.text, 'the seed salts the draw but stays deterministic');
  assert(a.text !== undefined);
  assert.equal(gen.generate({ language: 'aenoran', kind: 'city', entityId: 'g4' }).kind, 'city');
  assert.throws(() => gen.generate({ language: 'aenoran', kind: 'wizard', entityId: 'g5' }), /Unknown name kind/);
  assert.throws(() => gen.generate({ language: 'orran', kind: 'ruler_title', role: 'emperor', entityId: 'g6' }), /has no title/);
  assert.throws(() => gen.generate({ language: 'grave_rite', kind: 'ruler_title', entityId: 'g8' }), /grave_rite has no title ruler_m/);
  assert.equal(gen.generate({ language: 'grave_rite', kind: 'title', role: 'warden', entityId: 'g9' }).text, data.languages.languages.grave_rite.person.titles.warden);
  assert.throws(() => gen.generate({ language: 'goblinoid', kind: 'house', entityId: 'g7' }), /Unknown language/);
});

test('The 250-and-250 reference run of the spec passes for all languages, and relatedness holds', t => {
  const batches = checkLanguageBatches(data, { ctx });
  assert.deepEqual(batches.violations, []);
  for (const [language, row] of Object.entries(batches.report)) { assert.equal(row.places, 250, language); assert.equal(row.persons, 250, language); assert.equal(row.duplicates, 0, language); }
  const weak = Object.entries(batches.report).filter(([, r]) => r.infeasibleKinds.length).map(([l, r]) => `${l}: ${r.infeasibleKinds}`);
  t.diagnostic(`signature unreachable for: ${weak.join('; ')}`);
  assert(weak.length >= 1, 'the dictionary of some languages cannot carry the signature of every kind (documented in the report)');
  const related = checkRelatedness(data);
  assert.deepEqual(related.violations, []);
  assert(related.total >= 850 && related.matched / related.total >= 0.97, `${related.matched} of ${related.total}`);
  for (const e of related.exceptions) t.diagnostic(`sound laws: ${e.language} ${e.word} ${e.proto} -> ${e.got}, data says ${e.expected}`);
});

test('Sound laws: the families derive their daughters from the proto lexicon', () => {
  const lang = id => data.languages.languages[id];
  const laws = id => parseLaws(lang(id).sound_laws, { nuclei: [...(lang(id).sound.diphthongs ?? '').split(' '), ...lang(id).sound.vowels.split(' ')].filter(x => x.length > 1) });
  const proto = (family, word) => data.languages.families[family].proto[word];
  assert.equal(applyLaws(proto('ainic', 'river'), laws('aenoran')), 'sire');
  assert.equal(applyLaws(proto('ainic', 'river'), laws('leren')), 'sir');
  assert.equal(applyLaws(proto('ainic', 'river'), laws('dondric')), 'zir');
  assert.equal(applyLaws(proto('ainic', 'river'), laws('mirolic')), 'hira');
  assert.equal(applyLaws(proto('ainic', 'coast'), laws('leren')), 'lis');
  assert.equal(applyLaws(proto('elvish', 'sea'), laws('sylvan')), lang('sylvan').elements.sea.form);
  assert.equal(applyLaws(proto('boreal', 'lake'), laws('coldic')), lang('coldic').elements.lake.form);
  assert.equal(parseLaws(['th > t', 'bogus rule without arrow']).unknown.length, 1, 'a law the parser cannot read is reported, never guessed');
  assert.equal(parseLaws(['th > t', 'bogus rule without arrow']).rules.length, 1);
  for (const id of ['aenoran', 'leren', 'dondric', 'mirolic', 'grave_rite', 'alerhic', 'coldic', 'gunwaithic', 'noric', 'stabilic', 'tritonic', 'galic', 'sunhot', 'sylvan']) assert.deepEqual(laws(id).unknown, [], id);
});

test('Negative: a daughter word that its sound laws do not give fails the relatedness check', () => {
  const copy = structuredClone(data);
  copy.languages.languages.aenoran.elements.river.form = 'zurat';
  const result = checkRelatedness(copy);
  assert.equal(result.exceptions.some(e => e.language === 'aenoran' && e.word === 'river'), true);
  const wrecked = structuredClone(data);
  for (const e of Object.values(wrecked.languages.languages.leren.elements)) if (e.origin === 'regular') e.form = `${e.form}x`;
  const bad = checkRelatedness(wrecked);
  assert(bad.violations.some(v => v.code === 'relatedness' && /leren/.test(v.detail)));
  const lonely = structuredClone(data);
  delete lonely.languages.families.ainic.proto.river;
  assert(checkRelatedness(lonely).violations.some(v => /no proto-form/.test(v.detail)));
});

test('Signatures: the data\'s plain-word signatures become tests', () => {
  const sylvan = ctx.languages.get('sylvan'), mirolic = ctx.languages.get('mirolic'), aenoran = ctx.languages.get('aenoran');
  assert(carriesSignature(sylvan.signature, 'Lusiel') && carriesSignature(sylvan.signature, 'Ornawen') && !carriesSignature(sylvan.signature, 'Garr'));
  assert(carriesSignature(mirolic.signature, 'Paron') && !carriesSignature(mirolic.signature, 'Balur'));
  assert(carriesSignature(aenoran.signature, 'Silesire') && carriesSignature(aenoran.signature, 'Ozuhil') && !carriesSignature(aenoran.signature, 'Taron'));
  for (const info of ctx.languages.values()) assert.deepEqual(info.signatureUnparsed, [], info.id);
});

test('The neutral blend of the Middle Lands languages, and its shares', () => {
  const blend = neutralBlend(data);
  assert.deepEqual(blend.map(b => b.language), ['aenoran', 'gigantic', 'longspeech', 'orran']);
  assert(blend[0].weight > blend[3].weight && blend[3].weight > blend[1].weight);
  for (const n of [1, 12, 50, 60, 90]) assert.equal(blendShares(blend, n).reduce((a, b) => a + b.n, 0), n);
});

test('buildNames: every country has a pool from its culture\'s language, at the engine floors, in the format of the game', () => {
  const { pools, text } = getBuilt();
  const blocks = parseNamesFile(text);
  assert.equal(blocks.size, 306, '305 countries and the default pool');
  assert(text.startsWith('# Generated by the ZIN content builder'));
  for (const c of countries) {
    const b = blocks.get(c.tag);
    assert(b, c.tag);
    assert(b.male.length >= 20 && b.female.length >= 20 && b.surnames.length >= 40 && b.callsigns.length === 12, `${c.tag} ${b.male.length}/${b.female.length}/${b.surnames.length}`);
  }
  const d = blocks.get('default');
  assert(d.male.length >= 20 && d.female.length >= 20 && d.surnames.length >= 40);
  assert(pools.get('zin:all-erdae').male.length === d.male.length, 'the default pool is kept under its old key');
  assert(pools.get(tagOf('Aenor')).male.includes(blocks.get(tagOf('Aenor')).male[0]));
  assert(pools.get(countries[0].scan), 'pools are still reachable by drawn sheet');
  assert.match(text, /\tcallsigns = \{ "[A-Za-z' -]+"/);
});

test('buildNames: countries speak the language of their culture, Zol\'s Mistake takes the blend', () => {
  const { pools } = getBuilt();
  const language = name => pools.get(tagOf(name)).language;
  assert.equal(language('Aenor'), 'aenoran'); assert.equal(language('Coldor'), 'coldic'); assert.equal(language('Noris'), 'noric');
  assert.equal(language('Volgan'), 'grave_rite'); assert.equal(language('Kilinti'), 'longspeech'); assert.equal(language('Goldoroth'), 'orcish');
  assert.equal(language('Zol'), null);
  const blend = neutralBlend(data).map(b => b.language), g = freshGenerator();
  const names = [...pools.get(tagOf('Zol')).male, ...pools.get('zin:all-erdae').male];
  g.nameSpace('aenoran');
  for (const n of names) assert(blend.includes(g.registry.owner(n).language), `${n} is not a name of the Middle Lands`);
});

test('buildNames is deterministic and its report counts the names', () => {
  const again = build();
  assert.equal(again.text, getBuilt().text);
  assert.equal(again.staged.files.get('docs/design/names_report.json').toString(), getBuilt().staged.files.get('docs/design/names_report.json').toString());
  const report = JSON.parse(getBuilt().staged.files.get('docs/design/names_report.json'));
  assert.equal(report.pools.blocks, 306);
  assert(report.pools.entries.male > 10000 && report.pools.distinct.surnames > 1000);
  assert.equal(Object.keys(report.languages).length, 24 - 2, 'ainic and goblin speak for no country');
  assert.deepEqual(report.countriesWithoutLanguage, [tagOf('Zol')]);
  assert.equal(Object.values(report.collisions).reduce((a, b) => a + b, 0), 0);
});

test('No name of any pool breaks a rule: banned words, glyphs, form, floors, leaks between languages', () => {
  const { text } = getBuilt();
  const tagLanguage = new Map(data.countryCultures.countries.map(c => [c.tag, c.language ?? null]));
  tagLanguage.set('default', null);
  const generator = freshGenerator();
  const result = checkStagedNames({ text, data, ctx, tagLanguage, blend: neutralBlend(data).map(b => b.language), generator });
  assert.deepEqual(result.violations, []);
  const lower = text.toLowerCase();
  for (const word of ['afrit', 'volgan', 'zol', 'rush', 'klinti', 'edvoid']) assert(!lower.replace(/\byz0[a-z0-9]\b/g, '').includes(` ${word}`), word);
  assert.deepEqual(nonWindows1252(text.replace(/[\t\r\n]/g, ' ')), []);
});

test('Negative: a planted Sunhot name in an Orcish pool is a leak', () => {
  const { text } = getBuilt(), generator = freshGenerator();
  const tagLanguage = new Map(data.countryCultures.countries.map(c => [c.tag, c.language ?? null])); tagLanguage.set('default', null);
  const blocks = parseNamesFile(text), orcTag = tagOf('Goldoroth'), sunhotTag = data.countryCultures.countries.find(c => c.language === 'sunhot').tag;
  const sunhotName = blocks.get(sunhotTag).male.find(n => !blocks.get(orcTag).male.includes(n));
  assert(sunhotName, 'a Sunhot name exists');
  const start = text.indexOf(`${orcTag} = {`), at = text.indexOf('names = { ', start) + 'names = { '.length;
  const result = checkStagedNames({ text: `${text.slice(0, at)}${sunhotName} ${text.slice(at)}`, data, ctx, tagLanguage, blend: neutralBlend(data).map(b => b.language), generator });
  assert(result.violations.some(v => v.code === 'leak' && /sunhot/.test(v.detail) && /orcish/.test(v.detail)), JSON.stringify(result.violations.slice(0, 3)));
});

test('Negative: a planted banned name, a glyph outside Windows-1252, a short pool and a twin entry are caught', () => {
  const { text } = getBuilt(), generator = freshGenerator();
  const tagLanguage = new Map(data.countryCultures.countries.map(c => [c.tag, c.language ?? null])); tagLanguage.set('default', null);
  const blend = neutralBlend(data).map(b => b.language), run = t => checkStagedNames({ text: t, data, ctx, tagLanguage, blend, generator }).violations;
  const tag = tagOf('Aenor'), start = text.indexOf(`${tag} = {`), at = text.indexOf('names = { ', start) + 'names = { '.length;
  assert(run(`${text.slice(0, at)}Kassim ${text.slice(at)}`).some(v => v.code === 'banned' && /Kassim/.test(v.detail)), 'banned');
  assert(run(`${text.slice(0, at)}Zhōng ${text.slice(at)}`).some(v => v.code === 'font'), 'font');
  assert(run(`${text.slice(0, at)}Pizza ${text.slice(at)}`).some(v => v.code === 'banned'), 'modern word');
  assert(run(`${text.slice(0, at)}Lorien ${text.slice(at)}`).some(v => v.code === 'reserved'), 'vault name');
  const first = parseNamesFile(text).get(tag).male[0];
  assert(run(`${text.slice(0, at)}${first} ${text.slice(at)}`).some(v => v.code === 'pool-size' && /twice/.test(v.detail)), 'twin entry');
  const sStart = text.indexOf('\tsurnames = { ', start), sEnd = text.indexOf(' }', sStart);
  assert(run(`${text.slice(0, sStart)}\tsurnames = { Aldan Berin${text.slice(sEnd)}`).some(v => v.code === 'pool-size' && /surnames/.test(v.detail)), 'short pool');
  assert(run(text.replace(`${tag} = {`, 'Z99 = {')).some(v => v.code === 'missing'), 'missing block');
  assert.throws(() => assertNoViolations(run(`${text.slice(0, at)}Kassim ${text.slice(at)}`), 'The name checks'), /The name checks failed with \d+ violation/);
  assert.doesNotThrow(() => assertNoViolations([]));
});

test('Negative: buildNames refuses a country with no culture', () => {
  resetNaming();
  assert.throws(() => buildNames(new Staged(), [{ tag: 'Q99', name: 'Nowhere', scan: 'Cold Lands', capital: 'Nowhere City', regions: [] }], labels), /no culture in country_cultures.json/);
  resetNaming();
});

test('placeNames: bulk, unique, deterministic, layered, and shared with the persons\' registry', () => {
  resetNaming();
  const a = placeNames('Aenor', 'city', 60), cold = placeNames('Cold Lands', 'river', 60);
  assert.equal(a.length, 60);
  assert.equal(new Set([...a, ...cold].map(n => n.key)).size, 120, 'unique across both calls');
  for (const n of a) assert(['aenoran', 'ainic', 'orran', 'sylvan'].includes(n.language) || n.layer !== 'current', `${n.text} ${n.language}`);
  for (const n of [...a, ...cold]) assert.deepEqual(checkName(ctx, n.language, n.text, { kind: 'place' }), [], n.text);
  assert(a.filter(n => n.layer === 'current').length > 30, 'most settlements use the current language');
  assert(cold.some(n => n.layer !== 'current'), 'rivers lean on older layers');
  assert(a.every(n => n.gloss && n.parts.length), 'each name keeps its parts and gloss');
  resetNaming();
  assert.deepEqual(placeNames('Aenor', 'city', 60).map(n => n.text), a.map(n => n.text), 'same data, same names');
  assert.deepEqual(placeNames('Aenor', 'city', 5, { layers: false }).map(n => n.layer), Array(5).fill('current'));
  for (const kind of PLACE_KINDS) assert.equal(placeNames(tagOf('Noris'), kind, 3).length, 3, kind);
  resetNaming();
});

test('placeNames: a region mixes the languages of its countries; the registry refuses what persons hold', () => {
  resetNaming();
  const dead = placeNames('Dead Lands', 'settlement', 80, { layers: false });
  assert(new Set(dead.map(n => n.language)).size >= 2, 'Mirolic, Infernal and the Rite-Tongue share the Dead Lands');
  const person = (() => { const b = getBuilt(); return b.pools.get(tagOf('Aenor')).male[0]; })();
  const noris = placeNames('Noris', 'city', 100, { layers: false });
  for (const n of noris) assert.notEqual(n.key, keyOf(person));
  const kingdoms = placeNames({ language: 'yonic' }, 'region', 10);
  assert(kingdoms.every(n => n.language === 'yonic' || n.layer !== 'current'));
  const culture = placeNames({ culture: 'ice_clans' }, 'mountain', 6);
  assert.equal(culture.length, 6);
  resetNaming();
});

test('Negative: placeNames refuses an unknown target, an unknown kind, a bad count and a country with no language', () => {
  resetNaming();
  assert.throws(() => placeNames('Atlantis', 'city', 3), /Unknown naming target "Atlantis"/);
  assert.throws(() => placeNames('Aenor', 'volcano', 3), /Unknown place kind "volcano"/);
  assert.throws(() => placeNames('Aenor', 'city', -1), /whole number/);
  assert.throws(() => placeNames('Aenor', 'city', 2.5), /whole number/);
  assert.throws(() => placeNames('Zol', 'city', 3), /has no language/);
  assert.throws(() => placeNames({ language: 'dwarvish' }, 'city', 3), /Unknown language/);
  assert.throws(() => placeNames(42, 'city', 3), /needs a country/);
  assert.deepEqual(placeNames('Aenor', 'city', 0), []);
  resetNaming();
});

test('resolveName answers the NameRequest of the spec for places and persons', () => {
  resetNaming();
  const city = resolveName({ kind: 'settlement', entityId: 'vp-1', cultureId: 'lake_aenoran', size: 'town' });
  assert(city.text && city.language && city.key === keyOf(city.text));
  const m = resolveName({ kind: 'given_m', entityId: 'c-1', cultureId: 'steppe_rider' }), f = resolveName({ kind: 'given_f', entityId: 'c-2', cultureId: 'steppe_rider' });
  assert(m.text && f.text && m.language === 'aenoran' && m.dialect === 'rider');
  assert.deepEqual(resolveName({ kind: 'given_m', entityId: 'c-1', cultureId: 'steppe_rider' }), m, 'the same request, the same name');
  assert(/^of /.test(resolveName({ kind: 'house', entityId: 'h-1', cultureId: 'mirolon_wardens' }).text));
  assert(resolveName({ kind: 'epithet', entityId: 'e-1', cultureId: 'lake_aenoran' }).gloss.startsWith('the '));
  assert.equal(resolveName({ kind: 'ruler_title', entityId: 't-1', cultureId: 'lake_aenoran', role: 'ruler_f' }).text, 'Queen');
  assert.throws(() => resolveName({ kind: 'given_m', entityId: 'x', cultureId: 'no_such_culture' }), /Unknown culture/);
  assert.throws(() => resolveName({ kind: 'given_m', entityId: 'x', cultureId: 'zols_dead' }), /has no language/);
  assert.throws(() => resolveName({ kind: 'monster', entityId: 'x', cultureId: 'lake_aenoran' }), /Unknown name kind/);
  resetNaming();
});

test('The name file keeps the format the game reads: blocks of male, female, surnames and callsigns', () => {
  const { text } = getBuilt();
  assert.match(text, /^default = \{\n\tmale = \{\n\t\tnames = \{ [A-Za-z]/m);
  assert.match(text, /\n\tfemale = \{\n\t\tnames = \{ /);
  assert.match(text, /\n\tsurnames = \{ /);
  const lines = text.split('\n');
  assert.equal(lines.filter(l => /^\S+ = \{$/.test(l)).length, 306);
  assert.equal(lines.filter(l => l === '}').length, 306);
  const sample = parseNamesFile('x = {\n\tmale = {\n\t\tnames = { A "B C" }\n\t}\n\tfemale = {\n\t\tnames = { D }\n\t}\n\tsurnames = { "of E" F }\n\tcallsigns = { "G" }\n}\n').get('x');
  assert.deepEqual(sample, { male: ['A', 'B C'], female: ['D'], surnames: ['of E', 'F'], callsigns: ['G'] });
});
