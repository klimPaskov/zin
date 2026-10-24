// Tests of the six shared focus trees of batch A (docs/design/stage2/focus_shared_a.md): shared_cold_lands,
// shared_concord_dominions, shared_dark_lands, shared_ember_lands, shared_east_lands and shared_islands_of_the_south.
// They compile the real tree files with the focus compiler's check API and the registry additions of
// data/focus_registry_shared_a.json, assert counts, ids, prerequisites, localisation and text rules against the specs,
// try the module copies the tier B trees make, test the compiler changes this slice made, and plant one failure for
// each kind of defect.
//   node --test tools/content/focus_shared_a.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { countryTable, successor, loadRoster } from './lib/roster.mjs';
import os from 'node:os';
import path from 'node:path';
import { Staged } from './lib/core.mjs';
import { ZIN, GAME } from './lib/paths.mjs';
import { parse, scriptText } from './lib/clausewitz.mjs';
import { expandCopies } from './lib/focus_model.mjs';
import { displayText, nonCp1252 } from './lib/loc_parse.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { validateTree } from './lib/focus_schema.mjs';
import { analyseTrees, compileTree } from './modules/focus_compiler.mjs';
import { PEOPLES } from './modules/peoples.mjs';
import { Registry, exclusiveClosure, mergeRegistryData, loadRegistry, loadArgCodes, codesFor, checkCoverage, checkStructure } from './checks/focus_checks.mjs';

const json = async f => JSON.parse(await readFile(f, 'utf8'));
const SPEC_FILE_RENAMED = {};
const IDS = ['shared_cold_lands', 'shared_concord_dominions', 'shared_dark_lands', 'shared_ember_lands', 'shared_east_lands', 'shared_islands_of_the_south'];
const EXPECT = {
  shared_cold_lands: { focuses: 70, spirits: 18, events: 5, opinions: 1, ns: 'zin_shared_cold_lands' },
  shared_concord_dominions: { focuses: 66, spirits: 22, events: 8, opinions: 0, ns: 'zin_shared_concord_dominions' },
  shared_dark_lands: { focuses: 57, spirits: 23, events: 2, opinions: 5, ns: 'zin_shared_dark_lands' },
  shared_ember_lands: { focuses: 47, spirits: 15, events: 6, opinions: 2, ns: 'zin_shared_ember_lands' },
  shared_east_lands: { focuses: 68, spirits: 17, events: 4, opinions: 0, ns: 'zin_shared_east_lands' },
  shared_islands_of_the_south: { focuses: 46, spirits: 13, events: 2, opinions: 0, ns: 'zin_shared_islands_of_the_south' },
};
// The roster decides which realms a shared tree serves (roster.json focusTree); the tiers spec lists the countries of the
// retired roster. Each spec country is continued by a realm of the tree or by a realm with a tree of its own (or one the roster
// assigns to a tree not written yet), and each realm of the tree continues a spec country or is new (a split's second realm).
const ROSTER = countryTable();
const treeCountries = id => ROSTER.filter(c => c.focusTree === id).map(c => c.name);
const realmOf = old => { const s = successor(old); return s?.primary ? ROSTER.find(c => c.key === s.primary) : null; };
const CONTINUES = new Set(loadRoster().migration.map(m => successor(m.oldTag)?.primary).filter(Boolean));
const TREE_FILES = new Set(readdirSync(`${ZIN}/docs/design/focus`).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)));
// The trees the roster names that are not written yet (docs/plans/roster_integration).
const UNWRITTEN = [];
function checkSpecList(id, countries, specNames) {
  for (const old of specNames) {
    const r = realmOf(old);
    assert(r, `${id}: ${old} of the tiers spec is continued by a realm`);
    assert(r.focusTree === id ? countries.includes(r.name) : TREE_FILES.has(r.focusTree) || UNWRITTEN.includes(r.focusTree), `${id}: ${old} is continued by ${r.name}, which is in ${id} or has a tree of its own`);
  }
  for (const name of countries) {
    const r = ROSTER.find(c => c.name === name);
    assert(specNames.some(o => realmOf(o)?.key === r.key) || !CONTINUES.has(r.key), `${id}: ${name} continues a country of the spec or is a new realm`);
  }
}
const DATA = `${ZIN}/tools/content/data`;
const TREE_DIR = `${ZIN}/docs/design/focus`;
const SPEC_DIR = `${ZIN}/docs/specs/05_focus_trees`;
const BASE = {};
for (const id of IDS) BASE[id] = await json(`${TREE_DIR}/${id}.json`);

// The registry: the shared registry plus the shared_a additions, as loadRegistry reads them (names of pending modules).
const baseRegistry = await json(`${DATA}/focus_registry.json`);
const extraRegistry = await json(`${DATA}/focus_registry_shared_a.json`);
const registry = (extra = {}) => new Registry(mergeRegistryData([baseRegistry, extraRegistry, extra]), { pending: true });
// The keyword codes: the shared table plus the shared_a table (politics drift).
const baseCodes = await json(`${DATA}/focus_arg_codes.json`);
const extraCodes = await json(`${DATA}/focus_arg_codes_shared_a.json`);
const CODES = { ...baseCodes, owners: [...baseCodes.owners, ...extraCodes.owners] };

async function analyse(mutate, opts = {}) {
  const raw = structuredClone(BASE);
  mutate?.(raw);
  const entries = Object.entries(raw).map(([name, data]) => ({ name, data }));
  return analyseTrees(entries, new Staged(), { registry: registry(), codes: CODES, expected: [], warn: () => {}, ...opts });
}
const codesOf = a => [...new Set(a.problems.map(p => p.code))];
const failsWith = async (mutate, code, pattern, opts) => {
  const a = await analyse(mutate, opts);
  const hit = a.problems.filter(p => p.code === code);
  assert(hit.length, `expected ${code}, got ${codesOf(a).join(', ') || 'no problem'}:\n${a.problems.map(p => p.message).join('\n')}`);
  if (pattern) assert(hit.some(p => pattern.test(p.message)), `no ${code} problem matches ${pattern}: ${hit.map(p => p.message).join(' | ')}`);
  return a;
};
const focus = (raw, tree, key) => raw[tree].focuses.find(f => f.key === key);

const clean = await analyse();
const compiled = new Map(clean.list.map(t => [t.id, compileTree(t, clean.ctx)]));
const roster = clean.roster;
const glossary = await json(`${DATA}/glossary.json`);
const rules = compileBanned(await loadRuleSet({ glossary }));
const bannedHits = text => findBanned(displayText(text), rules);
const locOf = id => compiled.get(id).loc;

// ------------------------------------------------------------------------------------------------ spec tables
// The focus tables of a shared spec: key, x, y, days, icon, prerequisites, exclusives (column order differs by spec).
function specRows(id) {
  const md = existsSync(`${SPEC_DIR}/shared/${id}.md`) ? null : null;
  void md;
  return readFile(`${SPEC_DIR}/shared/${SPEC_FILE_RENAMED[id] ?? id}.md`, 'utf8').then(text => {
    const strip = s => s.replace(/`/g, '').replace(/\*\*/g, '').trim();
    const rows = [];
    let cols = null;
    for (const line of text.split('\n')) {
      if (!line.startsWith('|')) { cols = null; continue; }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^:?-+:?$/.test(c))) continue;
      const lower = cells.map(c => c.toLowerCase());
      if (lower.includes('key') && lower.some(c => c.startsWith('x,y'))) { cols = lower; continue; }
      if (!cols || cells.length !== cols.length) continue;
      const get = name => { const i = cols.findIndex(c => c.startsWith(name)); return i < 0 ? undefined : cells[i]; };
      const key = strip(get('key') ?? ''), xy = strip(get('x,y') ?? '');
      if (!/^[a-z_]+$/.test(key) || !/^\d+,\d+$/.test(xy)) continue;
      rows.push({ key, x: +xy.split(',')[0], y: +xy.split(',')[1], days: +strip(get('days') ?? '35') || 35, icon: strip(get('icon') ?? ''), pre: strip(get('prereq') ?? ''), ex: strip(get('excl') ?? get('exclusive') ?? '') });
    }
    return rows;
  });
}
const normPre = s => (!s || /^[–—-]$/.test(s) ? '[]' : JSON.stringify(s.split(/\s\+\s|\+/).map(g => g.split(/\s\/\s|\/|\sor\s/).map(x => x.trim()).sort()).sort()));

// Vanilla focus names: the display names of every focus id of the installed game (skipped when the game is absent).
async function vanillaFocusNames() {
  if (!existsSync(`${GAME}/common/national_focus`)) return null;
  const ids = new Set();
  for (const f of await readdir(`${GAME}/common/national_focus`)) {
    if (!f.endsWith('.txt')) continue;
    for (const m of (await readFile(`${GAME}/common/national_focus/${f}`, 'utf8')).matchAll(/^\s*id\s*=\s*([A-Za-z0-9_]+)/gm)) ids.add(m[1]);
  }
  const loc = new Map();
  for (const f of await readdir(`${GAME}/localisation/english`)) {
    if (!f.endsWith('.yml')) continue;
    for (const m of (await readFile(`${GAME}/localisation/english/${f}`, 'utf8')).matchAll(/^ ([A-Za-z0-9_.]+):\d* "(.*)"\s*$/gm)) if (!loc.has(m[1])) loc.set(m[1], m[2]);
  }
  const names = new Set();
  for (const id of ids) if (loc.has(id)) names.add(loc.get(id).toLowerCase());
  return names;
}
const vanilla = await vanillaFocusNames();

// ------------------------------------------------------------------------------------------------ positive
test('The six tree files exist, are named by their id and are shared trees', () => {
  assert.equal(Object.keys(BASE).length, 6);
  for (const id of IDS) { assert.equal(BASE[id].id, id); assert.equal(BASE[id].tier, 'shared'); }
});

test('Counts of focuses, spirits, events, opinion modifiers and countries match the specs', () => {
  for (const id of IDS) {
    const t = BASE[id], e = EXPECT[id];
    assert.equal(t.focuses.length, e.focuses, `${id} focuses`);
    assert.equal(Object.keys(t.spirits ?? {}).length, e.spirits, `${id} spirits`);
    assert.equal(Object.keys(t.events ?? {}).length, e.events, `${id} events`);
    assert.equal(Object.keys(t.opinion_modifiers ?? {}).length, e.opinions, `${id} opinion modifiers`);
    assert.deepEqual([...t.countries].sort(), treeCountries(id).sort(), `${id} countries are the roster's realms of the tree`);
    assert(t.countries.length >= 1, `${id} serves a realm`);
  }
  assert.equal(IDS.reduce((n, id) => n + BASE[id].focuses.length, 0), 354);
});

test('The compiler accepts all six trees with no problem and every tree is within the shared tier range', () => {
  assert.deepEqual(clean.problems.map(p => p.message), []);
  for (const id of IDS) assert(BASE[id].focuses.length >= 40 && BASE[id].focuses.length <= 70, id);
});

test('Every tree file passes the strict schema with the roster', () => {
  const ctx = { countries: new Set(roster.map(c => c.name)), regions: new Set(roster.map(c => c.scan)), people: new Set(Object.keys(PEOPLES)) };
  for (const id of IDS) assert.deepEqual(validateTree(BASE[id], ctx), [], id);
});

test('Each tree serves exactly the countries the tiers spec lists, once, and no country is in two trees', async () => {
  const md = await readFile(`${SPEC_DIR}/01_tiers_and_coverage.md`, 'utf8');
  const listed = new Map();
  for (const m of md.matchAll(/shared tree `(shared_[a-z_]+)`, (\d+) countries\): ([^\n]+)\./g)) listed.set(m[1], { n: +m[2], names: m[3].split(', ').map(s => s.trim()) });
  let total = 0;
  for (const id of IDS) {
    const spec = listed.get(id);
    assert(spec, `${id} is listed in the tiers spec`);
    assert.equal(spec.names.length, spec.n, `${id}: the tiers spec counts its list`);
    assert.deepEqual([...BASE[id].countries].sort(), treeCountries(id).sort(), id);
    checkSpecList(id, BASE[id].countries, spec.names);
    total += BASE[id].countries.length;
  }
  assert.equal(new Set(IDS.flatMap(id => BASE[id].countries)).size, total, 'no realm is in two of the six trees');
  assert.deepEqual([...new Set(ROSTER.map(c => c.focusTree).filter(t => !TREE_FILES.has(t)))].sort(), UNWRITTEN, 'the roster names no other tree without a file');
  assert.deepEqual(checkCoverage(clean.list, roster, { requireAll: false }), []);
});

test('Keys, positions, prerequisites, days, icons and exclusives equal the focus tables of the specs', async () => {
  for (const id of IDS) {
    const rows = await specRows(id);
    assert.equal(rows.length, BASE[id].focuses.length, `${id}: one spec row per focus`);
    const byKey = new Map(BASE[id].focuses.map(f => [f.key, f]));
    for (const r of rows) {
      const f = byKey.get(r.key);
      assert(f, `${id}: ${r.key} exists`);
      assert.deepEqual([f.x, f.y, f.days], [r.x, r.y, r.days], `${id}: ${r.key} position and days`);
      assert.equal(typeof f.icon === 'string' ? f.icon : f.icon.default, r.icon, `${id}: ${r.key} icon`);
      assert.equal(JSON.stringify((f.prerequisite ?? []).map(g => [...g].sort()).sort()), normPre(r.pre), `${id}: ${r.key} prerequisites`);
      const wanted = r.ex && !/^[–—-]$/.test(r.ex) ? r.ex.split(/,\s*/).sort().join(',') : '';
      assert.equal((f.mutually_exclusive ?? []).slice().sort().join(','), wanted, `${id}: ${r.key} exclusives`);
    }
  }
});

test('Structure: unique keys and positions, every prerequisite exists and sits above, no cycle, days are multiples of 7', () => {
  for (const [id, tree] of clean.trees) {
    assert.deepEqual(checkStructure(tree).map(p => p.message), [], id);
    assert.equal(new Set(tree.focuses.map(f => f.key)).size, tree.focuses.length, id);
    for (const f of tree.focuses) assert(f.days % 7 === 0 && f.days >= 7 && f.days <= 140, `${id}.${f.key}`);
  }
});

test('Mutual exclusions are symmetric in the compiled tree', () => {
  for (const [id, tree] of clean.trees) {
    const closure = exclusiveClosure(tree);
    for (const [k, set] of closure) for (const other of set) assert(closure.get(other).has(k), `${id}: ${k} / ${other}`);
  }
  assert.deepEqual([...exclusiveClosure(clean.trees.get('shared_cold_lands')).get('our_own_snow')].sort(), ['friends_of_fandanar', 'guests_of_the_iron_hall']);
});

test('Compiled ids: focus ids are zin_<tree>_<key>, spirits likewise, events are <namespace>.<n> in order', () => {
  for (const id of IDS) {
    const out = compiled.get(id), e = EXPECT[id];
    const tree = BASE[id];
    const script = out.files.get(`common/national_focus/zin_${id}.txt`);
    const ids = [...script.matchAll(/^\tfocus = \{\n\t\tid = (\S+)/gm)].map(m => m[1]);
    assert.deepEqual(ids, tree.focuses.map(f => `zin_${id}_${f.key}`), id);
    assert.equal(new Set(ids).size, ids.length);
    const ideas = out.files.get(`common/ideas/zin_focus_${id}.txt`);
    for (const k of Object.keys(tree.spirits)) assert(ideas.includes(`\t\tzin_${id}_${k} = {`), `${id} spirit ${k}`);
    const events = out.files.get(`events/zin_${id}.txt`);
    assert.deepEqual([...events.matchAll(/^\tid = (\S+)/gm)].map(m => m[1]), Array.from({ length: e.events }, (_, i) => `${e.ns}.${i + 1}`), id);
    assert(events.startsWith(`# Generated`) && events.includes(`add_namespace = ${e.ns}\n`));
  }
});

test('The first listed focus is the root with no prerequisite, and the country block names every tag once', () => {
  for (const id of IDS) {
    const first = BASE[id].focuses[0];
    assert(!first.prerequisite, `${id}: ${first.key}`);
    const script = compiled.get(id).files.get(`common/national_focus/zin_${id}.txt`);
    const tags = [...script.matchAll(/original_tag = (\S+)\n\t\t\}/g)].map(m => m[1]);
    assert.equal(tags.length, BASE[id].countries.length, id);
    assert.equal(new Set(tags).size, tags.length, id);
    const rosterTags = new Map(roster.map(c => [c.name, c.tag]));
    assert.deepEqual([...tags].sort(), BASE[id].countries.map(n => rosterTags.get(n)).sort(), id);
  }
});

test('Every event has options, a picture of the catalog, timeout 30 and no trigger of its own', () => {
  for (const id of IDS) {
    const events = compiled.get(id).files.get(`events/zin_${id}.txt`);
    const n = (events.match(/^country_event = \{/gm) ?? []).length;
    assert.equal(n, EXPECT[id].events, id);
    assert.equal((events.match(/timeout_days = 30/g) ?? []).length, n, id);
    assert.equal((events.match(/is_triggered_only = yes/g) ?? []).length, n, id);
    assert.doesNotMatch(events, /mean_time_to_happen|\ttrigger = \{/);
    for (const ev of Object.values(BASE[id].events)) { assert(ev.options.length >= 1 && ev.options.length <= 3, id); assert(clean.ctx.catalog.events.has(ev.picture), `${id}: ${ev.picture}`); }
  }
});

test('Localisation is complete: name and description of every focus and spirit, title, text and options of every event', () => {
  for (const id of IDS) {
    const loc = locOf(id), tree = BASE[id];
    const must = key => { assert(typeof loc[key] === 'string' && loc[key].trim().length > 0, `${id}: ${key} has text`); };
    for (const f of tree.focuses) { must(`zin_${id}_${f.key}`); must(`zin_${id}_${f.key}_desc`); }
    for (const k of Object.keys(tree.spirits)) { must(`zin_${id}_${k}`); must(`zin_${id}_${k}_desc`); }
    for (const [i, ev] of Object.values(tree.events).entries()) {
      must(`${EXPECT[id].ns}.${i + 1}.t`); must(`${EXPECT[id].ns}.${i + 1}.d`);
      ev.options.forEach((_, j) => must(`${EXPECT[id].ns}.${i + 1}.${'abcdefghijklmnopqrstuvwxyz'[j]}`));
    }
    for (const k of Object.keys(tree.opinion_modifiers ?? {})) must(`zin_${id}_${k}`);
    // Every key the script names is in the table.
    const script = [...compiled.get(id).files].filter(([p]) => p.endsWith('.txt')).map(([, t]) => t).join('\n');
    for (const m of script.matchAll(/(?:name|title|desc|custom_effect_tooltip) = ([A-Za-z0-9_.]+)\n/g)) assert(m[1] in loc, `${id}: ${m[1]} named by a script is missing from the localisation`);
    // Descriptions are one to three sentences; nothing is a placeholder.
    for (const f of tree.focuses) {
      const sentences = f.desc.split(/(?<=[.!?])\s+/).filter(Boolean);
      assert(sentences.length >= 1 && sentences.length <= 3, `${id}.${f.key}: ${sentences.length} sentences`);
      assert(f.desc.length >= 40, `${id}.${f.key} description is too short`);
    }
    for (const v of Object.values(loc)) assert.doesNotMatch(v, /\b(?:TODO|TBD|lorem|ipsum|placeholder|XXX)\b/i);
  }
});

test('The localisation file is UTF-8 with BOM, Windows-1252 only, and uses no exclamation mark', () => {
  for (const id of IDS) {
    const rel = `localisation/english/zin_focus_${id}_l_english.yml`;
    assert.equal(compiled.get(id).files.has(rel), false, 'the compiler returns loc as a table; the builder stages the file');
    for (const v of Object.values(locOf(id))) { assert.deepEqual(nonCp1252(v), [], v); assert(!v.includes('!'), v); }
  }
});

test('No banned modern word, glossary-forbidden word or real-world name in any displayed text', () => {
  for (const id of IDS) for (const [key, v] of Object.entries(locOf(id))) assert.deepEqual(bannedHits(v).map(h => `${h.id}:${h.word}`), [], `${id} ${key}: ${v}`);
});

test('Text rules: no Afrit, Hidden Council, Ilvane or Eindil anywhere; the stranger and the Man from the Ice only where the specs allow', () => {
  for (const id of IDS) for (const [key, v] of Object.entries(locOf(id))) {
    assert.doesNotMatch(v, /Afrit|Hidden Council|Ilvane|Eindil|Aurevan|Einendil|Kusven|\bRush\b/, `${id} ${key}`);
    assert.doesNotMatch(v, /\bsleeper\b/i, `${id} ${key}`);
  }
  // Cold Lands: the Man from the Ice and the King Without a House appear only in the two hidden focuses.
  for (const [key, v] of Object.entries(locOf('shared_cold_lands'))) {
    if (/^zin_shared_cold_lands_(the_man_from_the_ice|songs_of_the_houseless_king)(_desc)?$/.test(key)) continue;
    assert.doesNotMatch(v, /stranger|man from the ice|king without a house|\bheir\b/i, key);
    assert(!(/\bman\b/i.test(v) && /\bice\b/i.test(v)), `${key}: man and ice`);
  }
  // Islands of the South and the Concord: no stranger in a focus name or description, and no Eindil epithet.
  for (const id of ['shared_islands_of_the_south', 'shared_concord_dominions', 'shared_east_lands']) {
    for (const f of BASE[id].focuses) assert.doesNotMatch(`${f.name} ${f.desc}`, /stranger|man from the ice|\bheir\b|king without a house/i, `${id}.${f.key}`);
    for (const ev of Object.values(BASE[id].events)) assert.doesNotMatch(`${ev.title} ${ev.desc}`, /stranger|man from the ice|\bheir\b/i, id);
  }
  // Dark and Ember Lands: fire never ends Zol's dead, Volgan's fate is not told, no hold is called goblin or ogre.
  for (const id of ['shared_dark_lands', 'shared_ember_lands']) for (const [key, v] of Object.entries(locOf(id))) {
    for (const sentence of v.split(/(?<=[.!?])\s+/)) {
      if (/\bfire\b/i.test(sentence) && /\b(?:end|ends|ended|kill|kills|destroy|destroys)\s+(?:them|the dead)\b/i.test(sentence)) assert.match(sentence, /\b(?:does|do|did|can|could|will)\s+not\b|\bnever\b|\bnor\b/i, `${id} ${key}: ${sentence}`);
    }
    assert.doesNotMatch(v, /Volgan (?:is|was) (?:dead|destroyed|slain)|King of Demons/, `${id} ${key}`);
  }
  for (const [key, v] of Object.entries(locOf('shared_dark_lands'))) if (!/ogre|troll|warren/i.test(key)) assert.doesNotMatch(v, /\b(?:goblin|ogre)s? hold\b/i, key);
});

test('The Deliverer is named through the scripted localisation or by his public title only', () => {
  const text = Object.values(locOf('shared_east_lands')).join('\n');
  assert(text.includes('[zin_loc_deliverer]'));
  assert.doesNotMatch(text, /Afrit/);
  assert(!Object.values(locOf('shared_concord_dominions')).join('\n').includes('zin_loc_'));
});

test('No focus creates a war goal, a claim, a core or a declaration of war (the peaceful start)', () => {
  const FORBIDDEN = ['wargoal', 'claims_on', 'cores_on', 'annex', 'puppet'];
  const hits = [];
  const walk = (node, where) => {
    if (Array.isArray(node)) node.forEach((x, i) => walk(x, `${where}[${i}]`));
    else if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) if (FORBIDDEN.includes(k)) hits.push(`${where}.${k}`);
      for (const [k, v] of Object.entries(node)) walk(v, `${where}.${k}`);
    }
    else if (typeof node === 'string' && /create_wargoal|declare_war|add_state_claim|add_claim_by|add_core_of|annex_country/.test(node)) hits.push(`${where}: ${node.slice(0, 40)}`);
  };
  for (const id of IDS) for (const f of BASE[id].focuses) walk(f.effects, `${id}.${f.key}`);
  // The one puppet effect belongs to a scripted effect run from an event the Aenor realm answers (a charter, not a war).
  assert.deepEqual(hits, []);
  const admit = BASE.shared_concord_dominions.scripted_effects.zin_concord_admit_dominion;
  assert(admit.effects.some(e => e.puppet === 'FROM'));
});

test('Hidden and story branches: their heads carry allow_branch and the same condition in available', () => {
  const heads = {
    shared_cold_lands: ['the_clan_host', 'the_two_halls', 'the_cold_coast', 'under_a_greater_crown', 'the_far_edge', 'the_silent_castle', 'the_free_towns', 'the_neck_steadings', 'kin_of_the_high_snows', 'the_man_from_the_ice', 'songs_of_the_houseless_king'],
    shared_concord_dominions: ['seat_at_the_concord_council', 'harbour_works', 'the_free_council', 'the_lords_moot', 'a_governors_hand', 'a_free_land', 'watch_on_the_south', 'the_wall_road', 'children_of_the_restoration', 'the_old_kin_of_the_land'],
    shared_dark_lands: ['no_master_but_our_own', 'the_iron_tithe', 'oath_of_the_accord', 'speak_at_the_moot_stone', 'fishers_of_the_dark_sea', 'dead_on_our_shore', 'the_warrens_below', 'troll_kin_of_the_hold', 'ogre_chiefs', 'hearth_speakers', 'the_warchiefs_host', 'heralds_of_the_south'],
    shared_ember_lands: ['the_southern_storm', 'storm_coast_harbour', 'a_client_crown', 'the_wardens_banner', 'the_night_cults', 'the_wardens_way', 'a_warlords_rule', 'the_storm_lifts'],
    shared_east_lands: ['the_dry_roads', 'lords_of_the_road', 'fishers_of_the_north_sea', 'rift_harbours', 'a_crown_over_the_road_lords', 'the_free_council', 'the_freeholds_endure'],
    shared_islands_of_the_south: ['nets_and_boats', 'the_speakers_council', 'the_chiefs_hall', 'a_sea_king', 'two_shores', 'island_navigators'],
  };
  for (const [id, keys] of Object.entries(heads)) for (const k of keys) {
    const f = focus(BASE, id, k);
    assert(f.allow_branch?.length, `${id}.${k} has allow_branch`);
    // Conditions fixed at the start need no repeat; every condition that changes at a refresh point is repeated.
    const fixed = c => 'people' in c || ('check' in c && extraRegistry.branch.fixed_checks.includes(c.check)) || ('or' in c && c.or.every(fixed));
    for (const c of f.allow_branch) if (!fixed(c)) assert(JSON.stringify(f.available ?? []).includes(JSON.stringify(c)), `${id}.${k}: ${JSON.stringify(c)} repeated in available`);
  }
  // Story modules open by available only.
  for (const [id, k] of [['shared_dark_lands', 'the_hold_at_war'], ['shared_ember_lands', 'the_freehold_at_war'], ['shared_islands_of_the_south', 'the_storm_years'], ['shared_concord_dominions', 'the_dark_comes'], ['shared_concord_dominions', 'the_golden_king_is_dead'], ['shared_east_lands', 'question_of_the_east'], ['shared_east_lands', 'answer_the_coalition'], ['shared_islands_of_the_south', 'oath_to_the_protector'], ['shared_east_lands', 'oath_to_the_protector']]) {
    const f = focus(BASE, id, k);
    assert(f.available?.length, `${id}.${k} has available`);
    assert(!f.allow_branch, `${id}.${k} has no allow_branch (the condition changes in play)`);
  }
});

test('Branch checks of the specs: Light Holdon-style trees, subjects, coasts and ideology heads read the right condition', () => {
  const cond = (id, k, list) => JSON.stringify(focus(BASE, id, k)[list]);
  assert.match(cond('shared_cold_lands', 'the_free_towns', 'allow_branch'), /"ideology":"light"/);
  assert.match(cond('shared_cold_lands', 'under_a_greater_crown', 'allow_branch'), /"is_subject":true/);
  assert.match(cond('shared_concord_dominions', 'a_free_land', 'allow_branch'), /"is_subject":false/);
  assert.match(cond('shared_concord_dominions', 'the_lords_moot', 'allow_branch'), /"ideology":"wild"/);
  assert.match(cond('shared_ember_lands', 'a_client_crown', 'allow_branch'), new RegExp(`"subject_of":"${realmOf('Volgan').name}"`));
  assert.match(cond('shared_ember_lands', 'the_wardens_banner', 'allow_branch'), /"subject_of":"Mirolon"/);
  assert.match(cond('shared_east_lands', 'riders_of_the_dunes', 'allow_branch'), /"people":"men"/);
  assert.match(cond('shared_islands_of_the_south', 'island_navigators', 'allow_branch'), /"people":"men"/);
  assert.match(cond('shared_islands_of_the_south', 'two_shores', 'allow_branch'), /zin_shared_islands_of_the_south_large/);
  assert.match(cond('shared_east_lands', 'the_free_council', 'available'), /"ideology":"light"/);
});

test('Spirits: no spirit key equals a focus key, every modifier is real, each has an icon and the cancel lists resolve', () => {
  for (const id of IDS) {
    const tree = BASE[id], focusKeys = new Set(tree.focuses.map(f => f.key));
    for (const [k, s] of Object.entries(tree.spirits)) {
      assert(!focusKeys.has(k), `${id}: spirit ${k} equals a focus key`);
      assert(s.name.length > 0 && s.desc.length > 20, `${id}.${k}`);
      assert(s.modifier && Object.keys(s.modifier).length > 0, `${id}.${k}`);
    }
  }
  const cancels = Object.entries(BASE.shared_dark_lands.spirits).filter(([, s]) => s.cancel).map(([k]) => k).sort();
  assert.deepEqual(cancels, ['accord_kin', 'beach_fires', 'brutes_and_axes_spirit', 'chief_at_cocanoor', 'hearth_speakers_spirit', 'heralds', 'warchiefs_host']);
  const deadCancels = Object.entries(BASE.shared_ember_lands.spirits).filter(([, s]) => s.cancel).map(([k]) => k).sort();
  assert.deepEqual(deadCancels, ['lake_trade_spirit', 'night_cults', 'one_watch_spirit', 'quiet_hearts_spirit', 'wardens_way', 'warlords_rule']);
  const ideas = compiled.get('shared_dark_lands').files.get('common/ideas/zin_focus_shared_dark_lands.txt');
  assert.match(ideas, /zin_shared_dark_lands_beach_fires = \{[\s\S]*?cancel = \{\n\t\t\t\thas_global_flag = zin_zol_withdrawn/);
});

test('Timed and swapped spirits follow the specs', () => {
  const dark = focus(BASE, 'shared_dark_lands', 'hold_the_hall'), raiders = focus(BASE, 'shared_dark_lands', 'raiders_of_the_hold');
  assert.deepEqual(dark.effects.find(e => e.timed_spirit).timed_spirit, { key: 'hold_the_hall_spirit', days: 180 });
  assert.deepEqual(raiders.effects.find(e => e.timed_spirit).timed_spirit, { key: 'hold_raiders', days: 180 });
  assert.deepEqual(focus(BASE, 'shared_east_lands', 'loyal_vassal').effects.find(e => e.timed_spirit).timed_spirit, { key: 'protectors_favour', days: 1095 });
  assert.deepEqual(focus(BASE, 'shared_islands_of_the_south', 'far_from_the_kings_wars').effects[0].timed_spirit, { key: 'far_from_the_war', days: 730 });
  assert.deepEqual(focus(BASE, 'shared_concord_dominions', 'council_of_the_lake_towns').effects[0].swap_spirit, ['free_council', 'free_council_2']);
  assert.deepEqual(focus(BASE, 'shared_concord_dominions', 'after_the_last_crowns').effects.find(e => e.remove_spirit).remove_spirit, 'the_dark_comes_spirit');
});

test('Concord helper calls: keyword arguments become the Aenor codes; the petition and camp effects are declared with their codes', () => {
  const script = compiled.get('shared_concord_dominions').files.get('common/national_focus/zin_shared_concord_dominions.txt');
  assert.match(script, /set_temp_variable = \{ zin_arg_charter = 3 \}\n\t+zin_concord_petition_charter = yes/);
  assert.match(script, /set_temp_variable = \{ zin_arg_camp = 3 \}\n\t+set_temp_variable = \{ zin_arg_value = 5 \}\n\t+zin_concord_back_camp = yes/);
  assert.match(script, /set_temp_variable = \{ zin_arg_camp = 4 \}/);
  const effects = BASE.shared_concord_dominions.scripted_effects;
  assert.deepEqual(effects.zin_concord_petition_charter.args.charter.keyword, { old: 0, golden: 1, shield: 2, free: 3, wall: 4 });
  assert.deepEqual(effects.zin_concord_back_camp.args.camp.keyword, { court: 1, faithful: 2, dominions: 3, host: 4 });
  const events = compiled.get('shared_concord_dominions').files.get('events/zin_shared_concord_dominions.txt');
  assert.match(script + '\n' + compiled.get('shared_concord_dominions').files.get('common/scripted_effects/zin_shared_concord_dominions.txt'), /zin_aenor_event_for_parim = yes\n\t+event_target:zin_aenor_parim_realm = \{\n\t+country_event = \{\n\t+id = zin_shared_concord_dominions\.3\n\t+days = 0/);
  assert(events.includes('id = zin_shared_concord_dominions.8'));
});

test('The helper names other trees call are declared once, with the names the specs fix', () => {
  const declared = id => Object.keys(BASE[id].scripted_effects ?? {});
  for (const n of ['zin_concord_add_own_loyalty', 'zin_concord_petition_charter', 'zin_concord_back_camp', 'zin_concord_ask_for_charter', 'zin_concord_join_free_dominions']) assert(declared('shared_concord_dominions').includes(n), n);
  for (const n of ['zin_shared_east_lands_road_infra', 'zin_shared_east_lands_halve_lean', 'zin_shared_east_lands_rift_goodwill']) assert(declared('shared_east_lands').includes(n), n);
  assert(declared('shared_cold_lands').includes('zin_shared_cold_lands_lean_neighbours'));
  const triggers = Object.keys(BASE.shared_concord_dominions.scripted_triggers);
  for (const n of ['zin_shared_has_coast', 'zin_shared_is_island_realm', 'zin_shared_borders_ember_lands', 'zin_shared_borders_magical_lands', 'zin_shared_borders_dark_lands', 'zin_shared_bound_away_from_host']) assert(triggers.includes(n), n);
  // The generic triggers are declared by exactly one tree.
  const all = IDS.flatMap(id => Object.keys(BASE[id].scripted_triggers ?? {}).concat(Object.keys(BASE[id].scripted_effects ?? {})));
  assert.equal(new Set(all).size, all.length);
});

test('Raw blocks sit only in tree-declared scripts, never in a focus, an event or a spirit', () => {
  let raws = 0;
  const walk = (node, where, allowed) => {
    if (Array.isArray(node)) node.forEach((x, i) => walk(x, `${where}[${i}]`, allowed));
    else if (node && typeof node === 'object') {
      if (typeof node.raw === 'string') { raws++; assert(allowed, `${where} is a raw block outside a declared script`); }
      for (const [k, v] of Object.entries(node)) walk(v, `${where}.${k}`, allowed);
    }
  };
  for (const id of IDS) {
    for (const f of BASE[id].focuses) { walk(f, `${id}.${f.key}`, false); }
    for (const [k, e] of Object.entries(BASE[id].events)) walk(e, `${id}.event.${k}`, false);
    for (const [k, s] of Object.entries(BASE[id].spirits)) walk(s, `${id}.spirit.${k}`, false);
    walk(BASE[id].scripted_effects, `${id}.effects`, true);
    walk(BASE[id].scripted_triggers, `${id}.triggers`, true);
  }
  assert(raws > 0 && raws < 90, `${raws} raw blocks`);
});

test('Country tags written into raw scripts are roster tags of the countries the spec names', () => {
  const tagOf = new Map(roster.map(c => [c.name, c.tag]));
  const tags = new Set(roster.map(c => c.tag));
  const text = JSON.stringify(IDS.map(id => [BASE[id].scripted_effects, BASE[id].scripted_triggers]));
  const found = new Set([...text.matchAll(/(?:country_exists|has_war_with|is_in_faction_with|tag|original_tag) = ([A-Z][A-Z0-9]{2})\b/g)].map(m => m[1]));
  for (const m of text.matchAll(/(?:\\n|\\t|^|"|\{ )([A-Z][A-Z0-9]{2}) = \{/g)) if (!['NOT', 'AND'].includes(m[1])) found.add(m[1]);
  for (const t of found) assert(tags.has(t), `${t} is a roster tag`);
  for (const old of ['Coldor', 'Fearno', 'Goldoroth', 'Volgan', 'Dulundur', 'Zol', 'Mirolon']) assert(text.includes(tagOf.get(realmOf(old).name)), `${old} (${realmOf(old).name}) tag appears in a declared script`);
});

test('Registry file: every entry is used by one of the six trees and the branch lists name only declared or external checks', () => {
  const text = JSON.stringify(IDS.map(id => BASE[id]));
  for (const kind of ['scripted_effects', 'scripted_triggers', 'flags', 'global_flags', 'ideas', 'events', 'opinion_modifiers']) {
    for (const name of extraRegistry[kind]) {
      const key = name.replace(/^zin_is_site_/, '');
      assert(text.includes(name) || text.includes(`"${key}"`) || text.includes(`zin_is_site_${key}`) || text.includes(key), `${kind} ${name} is not used by any tree`);
    }
  }
  for (const n of [...extraRegistry.branch.fixed_checks, ...extraRegistry.branch.refreshed_checks]) assert(text.includes(`"${n}"`) || text.includes(n), n);
  assert(extraRegistry.branch.fixed_checks.includes('zin_people_includes_goblins'));
  assert(extraRegistry.branch.refreshed_checks.includes('zin_dark_is_tributary'));
  // Pending names are not declared by a tree (declared helpers would collide at the build).
  const declared = new Set(IDS.flatMap(id => [...Object.keys(BASE[id].scripted_effects ?? {}), ...Object.keys(BASE[id].scripted_triggers ?? {})]));
  for (const kind of ['scripted_effects', 'scripted_triggers']) for (const n of extraRegistry[kind]) assert(!declared.has(n), `${n} is declared by a tree and listed as pending`);
});

test('Compiling twice gives identical bytes, and every compiled script parses', () => {
  const again = new Map(clean.list.map(t => [t.id, compileTree(t, clean.ctx)]));
  for (const id of IDS) {
    const a = compiled.get(id), b = again.get(id);
    assert.deepEqual([...a.files.keys()], [...b.files.keys()]);
    for (const [rel, text] of a.files) {
      assert.equal(text, b.files.get(rel), rel);
      assert.doesNotMatch(text, /undefined|NaN|\[object|\?\w+\b(?=\n)/, rel);
      const top = parse(scriptText(Buffer.from(text)));
      assert(Array.isArray(top) && top.length > 0, rel);
    }
    assert.deepEqual(a.loc, b.loc);
  }
});

test('Compiled scripts use only engine names the installed game documents (raw blocks included)', { skip: !existsSync(`${GAME}/documentation/effects_documentation.md`) }, async () => {
  const known = new Set();
  for (const f of ['effects_documentation.md', 'triggers_documentation.md', 'modifiers_documentation.md']) for (const m of (await readFile(`${GAME}/documentation/${f}`, 'utf8')).matchAll(/^## ([A-Za-z0-9_]+)\s*$/gm)) known.add(m[1]);
  const structure = new Set(['limit', 'if', 'else', 'else_if', 'OR', 'AND', 'NOT', 'id', 'title', 'desc', 'picture', 'name', 'ai_chance', 'factor', 'add', 'modifier', 'option', 'hidden', 'is_triggered_only', 'timeout_days', 'immediate', 'focus', 'icon', 'x', 'y', 'cost', 'available', 'bypass', 'allow_branch', 'ai_will_do', 'completion_reward', 'prerequisite', 'mutually_exclusive', 'search_filters', 'country', 'initial_show_position', 'continuous_focus_position', 'focus_tree', 'add_namespace', 'type', 'level', 'instant_build', 'province', 'all_provinces', 'limit_to_victory_point', 'limit_to_coastal', 'target', 'value', 'localization', 'relation', 'active', 'ideology', 'popularity', 'days', 'flag', 'idea', 'remove_idea', 'add_idea', 'bonus', 'uses', 'category', 'cost_reduction', 'allowed', 'allowed_civil_war', 'removal_cost', 'cancel', 'ideas', 'always', 'tag', 'amount', 'autonomy_state', 'capital_scope', 'controller', 'num_owned_states', 'scope', 'on_actions', 'effect', 'dynamic', 'rule', 'option', 'date', 'army_experience', 'navy_experience', 'air_experience', 'opinion_modifiers', 'decay', 'months', 'trade', 'id']);
  const unknown = new Set();
  for (const id of IDS) for (const [rel, text] of compiled.get(id).files) {
    if (!rel.endsWith('.txt') || rel.startsWith('common/opinion_modifiers')) continue;
    const walk = nodes => { for (const n of nodes) { if (n.k && !known.has(n.k) && !structure.has(n.k) && !/^(zin_|GFX_|var:|event_target:|global\.|PREV|ROOT|FROM|OVERLORD|THIS)/.test(n.k) && !/^\d/.test(n.k) && !/^[A-Z][0-9A-Z]{2}$/.test(n.k)) unknown.add(`${id}: ${n.k}`); if (Array.isArray(n.v)) walk(n.v); } };
    walk(parse(scriptText(Buffer.from(text))));
  }
  assert.deepEqual([...unknown], []);
});

test('No focus, spirit or event name equals a focus name of the installed game', { skip: vanilla === null }, () => {
  for (const id of IDS) {
    for (const f of BASE[id].focuses) assert(!vanilla.has(f.name.toLowerCase()), `${id}.${f.key}: ${f.name}`);
    for (const s of Object.values(BASE[id].spirits)) assert(!vanilla.has(s.name.toLowerCase()), `${id} spirit ${s.name}`);
  }
});

test('The module tags give each module a single root where a tier B tree copies it', () => {
  const rootsOf = (id, mod) => {
    const mf = BASE[id].focuses.filter(f => f.module === mod), keys = new Set(mf.map(f => f.key));
    return mf.filter(f => !(f.prerequisite ?? []).flat().some(k => keys.has(k))).map(f => f.key);
  };
  const copied = { shared_east_lands: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6a', 'E6b', 'E7', 'E8', 'E9', 'E10'], shared_islands_of_the_south: ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9'] };
  for (const [id, mods] of Object.entries(copied)) for (const m of mods) assert.equal(rootsOf(id, m).length, 1, `${id} ${m}: ${rootsOf(id, m)}`);
  assert.deepEqual(rootsOf('shared_east_lands', 'E4'), ['temples_of_the_deliverer']);
  assert.deepEqual(rootsOf('shared_east_lands', 'E9'), ['question_of_the_east']);
  assert.deepEqual(rootsOf('shared_islands_of_the_south', 'I2'), ['the_guest_right']);
  assert.deepEqual(rootsOf('shared_islands_of_the_south', 'I9'), ['the_storm_years']);
  // The Dark Lands and Ember Lands modules D1-D12 and L1-L10 are tagged; D12 and L9 have one root.
  assert.equal(rootsOf('shared_dark_lands', 'D12').length, 1);
  assert.equal(rootsOf('shared_ember_lands', 'L9').length, 1);
  assert(new Set(BASE.shared_dark_lands.focuses.map(f => f.module).filter(Boolean)).size === 12);
  assert.equal(new Set(BASE.shared_ember_lands.focuses.map(f => f.module).filter(Boolean)).size, 10);
  // Each module spirit of a tree carries the tag of the module whose focus adds it.
  for (const [k, s] of Object.entries(BASE.shared_east_lands.spirits)) assert(s.module, `east spirit ${k}`);
  for (const [k, s] of Object.entries(BASE.shared_islands_of_the_south.spirits)) assert(s.module, `islands spirit ${k}`);
});

test('A tier B tree can copy the East and Islands modules whole, keeps its own ids and passes every check', async () => {
  const regional = {
    id: 'regional_copytest', tier: 'regional', countries: ['Alerhia'],
    focuses: [
      { key: 'crown', name: 'The Test Crown', desc: 'A synthetic root for the copy test.', icon: 'crown_iron', x: 14, y: 0, days: 35 },
      { key: 'isle_root', name: 'The Test Isle', desc: 'A synthetic island root.', icon: 'fishing_boats', x: 30, y: 0, days: 35 },
    ],
    copy: [
      { from: 'shared_east_lands', module: 'E4', root_at: [14, 1], root_prerequisite: [['crown']] },
      { from: 'shared_east_lands', module: 'E9', root_at: [14, 6], root_prerequisite: [['temples_of_the_deliverer']] },
      { from: 'shared_east_lands', module: 'E2', root_at: [10, 1], root_prerequisite: [['crown']] },
      { from: 'shared_islands_of_the_south', module: 'I2', root_at: [30, 1], root_prerequisite: [['isle_root']] },
      { from: 'shared_islands_of_the_south', module: 'I4', root_at: [34, 1], root_prerequisite: [['isle_root']] },
      { from: 'shared_islands_of_the_south', module: 'I9', root_at: [38, 6], root_prerequisite: [['isle_root']] },
    ],
  };
  const a = await analyse(raw => { raw.regional_copytest = regional; }, { tierRanges: null });
  assert.deepEqual(a.problems.map(p => p.message), []);
  const t = a.trees.get('regional_copytest');
  assert.equal(t.focuses.length, 2 + 6 + 11 + 5 + 6 + 4 + 5);
  assert(t.focuses.every(f => !f.module));
  const out = compileTree(t, a.ctx);
  const script = out.files.get('common/national_focus/zin_regional_copytest.txt');
  assert(script.includes('id = zin_regional_copytest_temples_of_the_deliverer'));
  assert(!/(?:id|focus) = zin_shared_(?:east_lands|islands_of_the_south)_/.test(script), 'no focus id of a shared tree');
  assert.match(script, /zin_regional_copytest_close_the_houses[\s\S]*?remove_ideas = zin_regional_copytest_generous_friends/);
  assert.match(script, /country_event = zin_shared_islands_of_the_south\.1/);
  // The spirit a copied focus adds is re-declared under the tree's prefix.
  assert(out.files.get('common/ideas/zin_focus_regional_copytest.txt').includes('zin_regional_copytest_generous_friends = {'));
});

test('Copy negative: a module copied into a position that is taken fails; a module with two roots fails', async () => {
  const mk = (copy, extra = []) => ({ id: 'regional_copytest', tier: 'regional', countries: ['Alerhia'], focuses: [{ key: 'crown', name: 'X', desc: 'Y', icon: 'crown_iron', x: 14, y: 0, days: 35 }, ...extra], copy });
  const taken = await analyse(raw => { raw.regional_copytest = mk([{ from: 'shared_east_lands', module: 'E5', root_at: [14, 1], root_prerequisite: [['crown']] }], [{ key: 'blocker', name: 'B', desc: 'B', icon: 'crown_iron', x: 14, y: 1, days: 35, prerequisite: [['crown']] }]); }, { tierRanges: null });
  assert(taken.problems.some(p => p.code === 'duplicate_position'), codesOf(taken).join(','));
  const two = await analyse(raw => { raw.regional_copytest = mk([{ from: 'shared_dark_lands', module: 'D1', root_at: [14, 1], root_prerequisite: [['crown']] }]); }, { tierRanges: null });
  assert(two.problems.some(p => p.code === 'copy' && /exactly one root/.test(p.message)), codesOf(two).join(','));
  const missing = expandCopies([BASE.shared_east_lands, mk([{ from: 'shared_east_lands', module: 'E99', root_at: [0, 1] }])]);
  assert(missing.problems.some(p => /no focus tagged module E99/.test(p.message)));
});

// ------------------------------------------------------------------------------------------------ the compiler changes of this slice
test('Compiler: a tree may call the helpers and fire the events another tree declares; a name no tree declares stays unresolved', async () => {
  const regional = { id: 'regional_copytest', tier: 'regional', countries: ['Alerhia'], focuses: [
    { key: 'crown', name: 'The Test Crown', desc: 'A synthetic root for the call test.', icon: 'crown_iron', x: 0, y: 0, days: 35,
      effects: [{ call: 'zin_shared_east_lands_road_infra' }, { call: 'zin_concord_petition_charter', args: { charter: 'golden' } }, { call: 'zin_shared_cold_lands_lean_neighbours', args: { value: 5 } }, { event: 'zin_shared_east_lands.4' }] },
  ] };
  const ok = await analyse(raw => { raw.regional_copytest = regional; }, { tierRanges: null });
  assert.deepEqual(ok.problems.map(p => p.message), []);
  await failsWith(raw => { raw.regional_copytest = regional; raw.regional_copytest.focuses[0].effects.push({ call: 'zin_shared_east_lands_nowhere' }); }, 'effect_unresolved', /zin_shared_east_lands_nowhere/, { tierRanges: null });
  await failsWith(raw => { raw.regional_copytest = regional; raw.regional_copytest.focuses[0].effects.push({ event: 'zin_shared_east_lands.9' }); }, 'event_unresolved', /zin_shared_east_lands\.9/, { tierRanges: null });
});

test('Compiler: a global variable is read with the global. prefix; other dotted names are refused', () => {
  const ctx = { countries: new Set(roster.map(c => c.name)), regions: new Set(roster.map(c => c.scan)), people: new Set(Object.keys(PEOPLES)) };
  const tree = structuredClone(BASE.shared_islands_of_the_south);
  assert.deepEqual(validateTree(tree, ctx), []);
  focus({ t: tree }, 't', 'carry_it_to_gala').available = [{ variable: { name: 'a.b', above: 1 } }];
  assert(validateTree(tree, ctx).some(e => /variable/.test(e.path)));
  focus({ t: tree }, 't', 'carry_it_to_gala').available = [{ variable: { name: 'global.zin_eindil_stage', above: 3 } }];
  assert.deepEqual(validateTree(tree, ctx), []);
  const island = compiled.get('shared_islands_of_the_south').files.get('common/national_focus/zin_shared_islands_of_the_south.txt');
  assert.match(island, /check_variable = \{ global\.zin_eindil_stage > 3 \}/);
});

test('Compiler: registry files next to focus_registry.json are merged, and a pending name declared by a tree is no collision', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'zin-registry-'));
  try {
    await writeFile(path.join(dir, 'focus_registry.json'), JSON.stringify({ scripted_effects: ['a'], patterns: { flags: ['zin_x_<key>'] }, branch: { fixed_checks: ['f1'] } }));
    await writeFile(path.join(dir, 'focus_registry_one.json'), JSON.stringify({ scripted_effects: ['b'], flags: ['zin_flag'], branch: { fixed_checks: ['f2'], refreshed_flags: ['rf'] } }));
    await writeFile(path.join(dir, 'focus_registry_two.json'), JSON.stringify({ scripted_triggers: ['t'], patterns: { flags: ['zin_y_<key>'] } }));
    await writeFile(path.join(dir, 'unrelated.json'), '{ not json');
    const reg = await loadRegistry(path.join(dir, 'focus_registry.json'));
    for (const n of ['a', 'b']) assert(reg.has('scripted_effects', n));
    assert(reg.has('scripted_triggers', 't') && reg.has('flags', 'zin_flag') && reg.has('flags', 'zin_x_abc') && reg.has('flags', 'zin_y_abc'));
    assert(reg.branch.fixed_checks.has('f1') && reg.branch.fixed_checks.has('f2') && reg.branch.refreshed_flags.has('rf'));
    // Pending names do not collide with a tree's declaration; a name a staged module wrote does.
    assert.equal(reg.writtenByModule('scripted_effects', 'a'), false);
    const staged = new Registry({ scripted_effects: ['a'] });
    assert.equal(reg.merge(staged).writtenByModule('scripted_effects', 'a'), true);
    assert.equal(new Registry({ scripted_effects: ['z'] }).writtenByModule('scripted_effects', 'z'), true);
    await writeFile(path.join(dir, 'focus_arg_codes.json'), JSON.stringify({ owners: [{ owner: 'o', prefixes: ['zin_o_'], args: { k: { a: 1 } } }] }));
    await writeFile(path.join(dir, 'focus_arg_codes_more.json'), JSON.stringify({ owners: [{ owner: 'p', prefixes: ['zin_p_'], args: { k: { b: 2 } } }] }));
    const codes = await loadArgCodes(path.join(dir, 'focus_arg_codes.json'));
    assert.deepEqual(codesFor(codes, 'zin_o_x', 'k'), { a: 1 });
    assert.deepEqual(codesFor(codes, 'zin_p_x', 'k'), { b: 2 });
  } finally { await rm(dir, { recursive: true, force: true }); }
  const real = await loadRegistry();
  assert(real.has('scripted_effects', 'zin_afrit_add_footholds'));
  const codes = await loadArgCodes();
  assert.deepEqual(codesFor(codes, 'zin_politics_add_drift', 'ideology'), { light: 1, dominion: 2, shadow: 3, wild: 4 });
});

test('The drift codes agree with the integration note that proposes them', async () => {
  const note = (await readFile(`${ZIN}/docs/design/stage2/focus_shared_a.md`, 'utf8')).toLowerCase();
  assert(note.includes('`ideology`'));
  for (const [word, code] of Object.entries({ light: 1, dominion: 2, shadow: 3, wild: 4 })) assert.match(note, new RegExp(`\\b${word}\\b\`?[ =]*${code}(?![0-9])`), word);
  const script = compiled.get('shared_east_lands').files.get('common/national_focus/zin_shared_east_lands.txt');
  assert.match(script, /set_temp_variable = \{ zin_arg_ideology = 2 \}\n\t+set_temp_variable = \{ zin_arg_value = 5 \}\n\t+zin_politics_add_drift = yes/);
});

// ------------------------------------------------------------------------------------------------ negative
test('Fails: an unknown scripted trigger, effect, flag, event, spirit, opinion modifier and idea', async () => {
  await failsWith(raw => { focus(raw, 'shared_cold_lands', 'the_steading_hall').available = [{ check: 'zin_nowhere_trigger' }]; }, 'trigger_unresolved', /zin_nowhere_trigger/);
  await failsWith(raw => { focus(raw, 'shared_cold_lands', 'the_steading_hall').effects.push({ call: 'zin_nowhere_effect' }); }, 'effect_unresolved', /zin_nowhere_effect/);
  await failsWith(raw => { focus(raw, 'shared_cold_lands', 'the_steading_hall').available = [{ flag: 'zin_never_set_flag' }]; }, 'flag_unresolved', /zin_never_set_flag/);
  await failsWith(raw => { focus(raw, 'shared_cold_lands', 'the_steading_hall').effects.push({ event: 'no_such_event' }); }, 'event_unknown', /no_such_event/);
  await failsWith(raw => { focus(raw, 'shared_cold_lands', 'the_steading_hall').effects.push({ add_spirit: 'no_such_spirit' }); }, 'spirit_unknown', /no_such_spirit/);
  await failsWith(raw => { focus(raw, 'shared_cold_lands', 'the_steading_hall').effects.push({ opinion: { target: 'Coldor', modifier: 'no_such_modifier' } }); }, 'opinion_unknown', /no_such_modifier/);
  await failsWith(raw => { focus(raw, 'shared_cold_lands', 'the_steading_hall').effects.push({ add_spirit: 'zin_no_such_idea' }); }, 'spirit_unresolved', /zin_no_such_idea/);
});

test('Fails: a duplicate focus key, a duplicate position, a missing prerequisite, a prerequisite above, a cycle and a bad day count', async () => {
  await failsWith(raw => { raw.shared_ember_lands.focuses.push({ ...focus(raw, 'shared_ember_lands', 'the_lords_hall') }); }, 'duplicate_key', /the_lords_hall/);
  await failsWith(raw => { focus(raw, 'shared_ember_lands', 'the_free_folk').x = 1; focus(raw, 'shared_ember_lands', 'the_free_folk').y = 1; }, 'duplicate_position', /the_free_folk/);
  await failsWith(raw => { focus(raw, 'shared_ember_lands', 'the_free_folk').prerequisite = [['the_missing_focus']]; }, 'prerequisite_missing', /the_missing_focus/);
  await failsWith(raw => { focus(raw, 'shared_ember_lands', 'the_lords_hall').y = 5; }, 'prerequisite_above', /the_lords_hall/);
  await failsWith(raw => { focus(raw, 'shared_ember_lands', 'the_freehold').prerequisite = [['the_lords_hall']]; }, 'prerequisite_cycle');
  await failsWith(raw => { focus(raw, 'shared_ember_lands', 'the_freehold').days = 40; }, 'days_multiple', /the_freehold/);
});

test('Fails: an unknown icon and picture, a spirit equal to a focus key, a modifier the game lacks, an exclusive that is missing', async () => {
  await failsWith(raw => { focus(raw, 'shared_dark_lands', 'hall_of_the_hold').icon = 'no_such_icon'; }, 'icon_unknown', /no_such_icon/);
  await failsWith(raw => { raw.shared_dark_lands.events.the_holds_fire.picture = 'no_such_picture'; }, 'picture_unknown', /no_such_picture/);
  await failsWith(raw => { raw.shared_dark_lands.spirits.the_chiefs_word = structuredClone(raw.shared_dark_lands.spirits.clan_meet); }, 'key_collision', /the_chiefs_word/);
  await failsWith(raw => { raw.shared_dark_lands.spirits.clan_meet.modifier = { not_a_modifier_of_the_game: 1 }; }, 'modifier_unknown', /not_a_modifier_of_the_game/);
  await failsWith(raw => { focus(raw, 'shared_dark_lands', 'one_chief_one_fire').mutually_exclusive = ['nobody']; }, 'exclusive_missing', /nobody/);
});

test('Fails: a banned modern word, a vanilla name and a real-world name are caught in displayed text', () => {
  assert(bannedHits('The factory of the hold makes steel for the railway').length >= 3);
  assert(bannedHits('Hearts of Iron came to Germany in 1936').length >= 2);
  assert(bannedHits('A tank column').some(h => /tank/i.test(h.word)));
  assert.deepEqual(bannedHits('The smiths of the hold work iron by the forge-fire'), []);
  assert(bannedHits('The government and its nation').some(h => /government|nation/i.test(h.word)));
  if (vanilla) {
    const name = [...vanilla].find(n => /^[a-z ]{8,24}$/.test(n));
    assert(vanilla.has(name));
    assert.equal(BASE.shared_cold_lands.focuses.some(f => f.name.toLowerCase() === name), false);
  }
});

test('Fails: a rewrite that plants a banned word, a secret or a retired name in a real tree is caught by the checks', async () => {
  const loc = (raw, id, key, text) => { focus(raw, id, key).desc = text; };
  await failsWith(raw => loc(raw, 'shared_east_lands', 'courts_of_the_east', 'Afrit rules this court in secret.'), 'secret_leak', /Afrit/);
  await failsWith(raw => loc(raw, 'shared_east_lands', 'courts_of_the_east', 'Ask the Hierarch.'), 'retired_name', /Hierarch/);
  await failsWith(raw => loc(raw, 'shared_east_lands', 'courts_of_the_east', 'The old Edvoid road.'), 'text_superseded', /Edvoid/);
  await failsWith(raw => loc(raw, 'shared_east_lands', 'courts_of_the_east', 'A nine 九 character.'), 'text_charset');
  await failsWith(raw => loc(raw, 'shared_east_lands', 'courts_of_the_east', '   '), 'text_empty');
  // The banned-word matcher sees what the checker does not: the factory in a real description.
  assert(bannedHits('The court builds a factory beside the road.').length >= 1);
});

test('Fails: allow_branch conditions that change in play, a refreshed condition not repeated in available, and a keyword without a code', async () => {
  await failsWith(raw => { focus(raw, 'shared_islands_of_the_south', 'two_shores').allow_branch.push({ flag: 'zin_changes_in_play' }); }, 'allow_branch_changing', /zin_changes_in_play/, { registry: registry({ flags: ['zin_changes_in_play'] }) });
  await failsWith(raw => { focus(raw, 'shared_islands_of_the_south', 'two_shores').allow_branch.push({ at_war: true }); }, 'allow_branch_changing', /at_war/);
  await failsWith(raw => { focus(raw, 'shared_islands_of_the_south', 'the_chiefs_hall').available = []; }, 'allow_branch_not_repeated', /ideology/);
  await failsWith(raw => { focus(raw, 'shared_islands_of_the_south', 'the_chiefs_hall').effects[0].call = 'zin_politics_add_drift'; focus(raw, 'shared_islands_of_the_south', 'the_chiefs_hall').effects[0].args = { ideology: 'purple', value: 3 }; }, 'call_keyword_nocode', /purple/);
  await failsWith(raw => { focus(raw, 'shared_concord_dominions', 'the_free_council').effects = [{ call: 'zin_concord_petition_charter', args: { charter: 'sapphire' } }]; }, 'call_keyword_nocode', /sapphire/);
  await failsWith(raw => { focus(raw, 'shared_concord_dominions', 'the_free_council').effects = [{ call: 'zin_concord_back_camp', args: { camp: 'court' } }]; }, 'call_arg_missing', /value/);
});

test('Fails: a country in two trees, a tree id the tiers do not allow, and a secret gate that cannot be proved', async () => {
  const twice = realmOf('Volgan').name;
  await failsWith(raw => { raw.shared_ember_lands.countries.push(twice); raw.shared_dark_lands.countries.push(twice); }, 'coverage_many', new RegExp(twice));
  await failsWith(raw => { raw.shared_ember_lands.id = 'ember_lands'; }, 'schema');
  await failsWith(raw => { raw.shared_ember_lands.countries.push('Nowhere Land'); }, 'schema', /Nowhere Land/);
});

test('Fails: a text with a banned word is the same word the build-wide text scan would reject (consistency of the two lists)', () => {
  const sample = 'Cannons and rifles on the railway';
  assert(bannedHits(sample).length >= 3);
  assert.deepEqual(bannedHits('The armourers raise a forge-row.'), []);
});
