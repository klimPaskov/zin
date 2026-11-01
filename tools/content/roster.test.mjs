// Tests of the roster loader (lib/roster.mjs), the state assignment and the courts (requirements R-20 to R-29, R-65).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRoster, countryTable, successor, cultureRows, stateOwners, gamePeopleOf, supersededWorldFile, STATE_ASSIGNMENT_FILE } from './lib/roster.mjs';
import { checkTags } from './lib/tags.mjs';
import { assignStates } from '../migrations/roster_state_assignment.mjs';
import { loadCharacterData } from './modules/characters.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ZIN = path.resolve(here, '../..');
const R = loadRoster(), countries = countryTable();

test('The country table is the roster: 155 realms with real tags, names, cultures, faiths, peoples and political forms', () => {
  assert.equal(countries.length, R.realms.length);
  assert.equal(countries.length, 155);
  assert.ok(!R.realms.some(r => r.tag === 'YEL'), 'K56: Yeldenne is a town in Pertolor\'s land, not a realm');
  assert.equal(new Set(countries.map(c => c.tag)).size, countries.length);
  for (const c of countries) {
    assert.match(c.tag, /^[A-Z]{3}$/, c.name);
    for (const f of ['name', 'adjective', 'culture', 'faith', 'people', 'gamePeople', 'politicalForm', 'stance', 'ideology', 'scan']) assert.ok(c[f], `${c.name} has no ${f}`);
  }
  assert.equal(countries.find(c => c.key === 'aenor').tag, 'AEN');
  assert.equal(countries.find(c => c.key === 'noris').tag, 'NRS');
});

test('The tag check passes on the roster and counts the dynamic tags below the crash limit', () => {
  const r = checkTags(countries.map(c => ({ tag: c.tag, name: c.name })), { dynamic: R.dynamicTags });
  assert.deepEqual(r.errors, []);
  assert.ok(r.stats.total < r.stats.limit);
});

test('Overlords: Hirolon is sovereign and Tirlan its protectorate; the Concord has thirteen chartered dominions (K35, K36)', () => {
  const by = k => countries.find(c => c.key === k);
  assert.equal(by('hirolon').overlord, null);
  assert.equal(by('tirlan').overlordKey, 'hirolon');
  assert.equal(by('tirlan').subjectType, 'protectorate');
  assert.equal(countries.filter(c => c.overlordKey === 'aenor' && c.subjectType === 'chartered dominion').length, 13);
  const D = JSON.parse(readFileSync(path.join(here, 'data/mech_aenor.json'), 'utf8')).dominions;
  assert.equal(D.length, 13);
  assert.equal(D.reduce((a, d) => a + d.seats, 0), 26);
});

test('Every old row has a fate, and successor() resolves tags and names to the realm that took the role', () => {
  assert.equal(R.migration.length, 305);
  assert.equal(successor('Y0L').primary, 'aenor');
  assert.equal(successor('Isengard').primary, 'melkgard');
  assert.equal(successor('Tieri').fate, 'merged');
  assert.equal(successor('Tieri').primary, 'aenor');
  assert.equal(successor('Y8D').primary, 'puvulan');
  assert.deepEqual(successor('Volgan').keys, ['puvulan', 'nether']);
  assert.equal(successor('Y7Y').primary, 'eldafaen');   // a removed row: the wild land's holder
  assert.equal(successor('Nowhere'), null);
});

test('The state assignment gives every state of the old map to a realm, every realm land and a capital in its own states', () => {
  const owners = stateOwners();
  assert.equal(owners.size, 1332);
  for (const c of countries) {
    assert.ok(c.states > 0, `${c.name} has no state`);
    assert.ok(c.stateIds.includes(c.capitalState), `${c.name}'s capital ${c.capitalState} is not its own state`);
  }
  const a = R.assignment;
  for (const s of a.states) assert.ok(s.rule && s.reason, `state ${s.id} has no rule or reason`);
  assert.equal(countries.reduce((n, c) => n + c.states, 0), 1332);
});

test('The state assignment file is what the assignment script writes (deterministic)', () => {
  assert.equal(readFileSync(STATE_ASSIGNMENT_FILE, 'utf8'), JSON.stringify(assignStates(), null, 1) + '\n');
});

test('The culture rows of the realms name cultures, languages and faiths of the world data', () => {
  const C = JSON.parse(readFileSync(path.join(here, 'data/world/cultures.json'), 'utf8'));
  const L = JSON.parse(readFileSync(path.join(here, 'data/world/languages.json'), 'utf8')).languages;
  for (const r of cultureRows()) {
    assert.ok(C.cultures[r.culture], `${r.country}: culture ${r.culture}`);
    assert.ok(C.faiths[r.faith], `${r.country}: faith ${r.faith}`);
    if (r.language) assert.ok(L[r.language], `${r.country}: language ${r.language}`);
  }
  for (const id of ['dwarvish', 'gnomish', 'hearthspeech', 'pack_tongue', 'lowspeech']) assert.ok(L[id], id);
});

test('Peoples without a kit borrow one; the roster keeps its own people', () => {
  assert.equal(gamePeopleOf('dwarves'), 'men');
  assert.equal(gamePeopleOf('goblins'), 'orcs');
  assert.equal(gamePeopleOf('elves'), 'elves');
  assert.throws(() => gamePeopleOf('dragons'), /No game people/);
  assert.equal(countries.find(c => c.key === 'kunhrim').people, 'dwarves');
});

test('Every realm has one court; character ids are unique and rulers carry the realm stance', () => {
  const data = loadCharacterData(), keys = new Set(), ids = new Set();
  for (const r of data) {
    assert.ok(!keys.has(r.key), `${r.key} twice`); keys.add(r.key);
    for (const c of [r.ruler, r.heir?.id ? r.heir : null, ...r.advisors, ...r.commanders, ...(r.figures ?? [])].filter(Boolean)) { assert.ok(!ids.has(c.id), c.id); ids.add(c.id); }
  }
  assert.equal(keys.size, 155);
  // 1,031 court characters and the 109 pre-built heirs of data/world/heirs.json (owner answer Q-87). Yeldenne's ruler Horos and its
  // warden are retired with the realm (K56: Horos is story only); the five valley people moved to Pertolor's court under their own ids.
  assert.equal(ids.size, 1140);
});

test('No old debug tag is left in the builder data or the focus designs (records excepted)', () => {
  const old = new Set(R.migration.map(m => m.oldTag));
  const RECORDS = /world[\\/](roster|legacy_countries|state_assignment|heraldry)\.json$|[\\/]history[\\/]|[\\/]characters[\\/]|flags-cells\.json$|geography[\\/]|vanilla[\\/]|ui[\\/]/;
  const hits = [];
  const walk = d => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (p.endsWith('.json') && !RECORDS.test(p)) { const t = readFileSync(p, 'utf8'); for (const m of t.matchAll(/(?<![§A-Za-z0-9_])Y[0-9A-Z]{2}(?![A-Za-z0-9_])/g)) if (old.has(m[0])) hits.push(`${path.relative(ZIN, p)}: ${m[0]}`); } } };
  walk(path.join(here, 'data')); walk(path.join(ZIN, 'docs/design/focus'));
  assert.deepEqual(hits, []);
});

test('The superseded files are exactly the map generator\'s country files of the debug-tag roster', () => {
  assert.ok(supersededWorldFile('history/countries/Y0L - Aenor.txt'));
  assert.ok(supersededWorldFile('gfx/flags/small/Y01.tga'));
  assert.ok(supersededWorldFile('common/country_tags/00_zin_countries.txt'));
  assert.ok(!supersededWorldFile('history/countries/AEN - Aenor.txt'));
  assert.ok(!supersededWorldFile('history/states/1-Horidor.txt'));
  assert.ok(!supersededWorldFile('common/country_tags/zz_zin_dynamic_countries.txt'));
});
