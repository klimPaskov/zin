// Tests of the regional C focus trees: the five Magical Lands tier B trees (docs/specs/05_focus_trees/regional/
// magical_lands.md) and the eleven Middle Lands tier B trees (regional/middle_lands.md). They compile the real tree
// files of docs/design/focus/ with the compiler's check API, assert counts, ids, prerequisites, localisation and
// text rules, and plant one failure for each check that guards these trees.
//   node --test tools/content/focus_regional_c.test.mjs
import test from 'node:test';
import { countryTable, successor } from './lib/roster.mjs';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Staged } from './lib/core.mjs';
import { ZIN, GAME } from './lib/paths.mjs';
import { absolutePositions, eventNumbers } from './lib/focus_model.mjs';
import { validateTree } from './lib/focus_schema.mjs';
import { loadRuleSet, compileBanned, findBanned } from './lib/banned.mjs';
import { analyseTrees, buildFocusTrees, compileTree, TREE_DIR } from './modules/focus_compiler.mjs';
import { PEOPLES } from './modules/peoples.mjs';
import { Registry, mergeRegistryData, collectTexts, exclusiveClosure, loadArgCodes, TIER_RANGES } from './checks/focus_checks.mjs';

const DATA = path.join(ZIN, 'tools/content/data');
const json = async f => JSON.parse(await readFile(f, 'utf8'));

// ------------------------------------------------------------------------------------------------ the slice
// Tree id -> [country, focuses, spirits, events]; counts are the specs' tables (magical_lands.md "Identifiers created",
// middle_lands.md "Identifiers created", where the timed event spirits are counted in the spirits column).
const TREES = {
  regional_lccimio: ['Lccimio', 40, 8, 3],
  regional_the_end: ['The End', 39, 10, 3],
  regional_herrodon: ['Herrodon', 34, 6, 6],
  regional_andos_enda: ['Andos Enda', 36, 11, 4],
  regional_nolorim: ['Nolorim', 32, 8, 4],
  regional_selen: ['Selen', 47, 17, 4],
  regional_noleksun: ['Noleksun', 32, 9, 4],
  regional_herez: ['Herez', 32, 8, 5],
  regional_konori: ['Konori', 31, 10, 4],
  regional_kilinti: ['Kilinti', 32, 12, 4],
  regional_kingson: ['Kingson', 33, 11, 5],
  regional_hunhun: ['Hunhun', 31, 11, 3],
  regional_hiloron: ['Hiloron', 32, 9, 2],
  regional_bloody_forest: ['Bloody Forest', 32, 10, 4],
  regional_cursed_lands: ['Cursed Lands', 30, 9, 5],
  regional_asgard: ['Asgard', 33, 11, 2],
};
const IDS = Object.keys(TREES);
// The realm of the roster that continues a spec's country (The End is Eldafaen).
const realm = old => countryTable().find(c => c.key === successor(old).primary).name;
const MAGICAL = IDS.slice(0, 5), MIDDLE = IDS.slice(5);

const BASE = {};
for (const id of IDS) BASE[id] = await json(path.join(TREE_DIR, `${id}.json`));
const registryData = mergeRegistryData([await json(path.join(DATA, 'focus_registry.json')), await json(path.join(DATA, 'focus_registry_regional_c.json'))]);
const registry = () => new Registry(structuredClone(registryData), { pending: true });
const ROSTER = countryTable();
const CODES = await loadArgCodes();

async function analyse(mutate) {
  const raw = structuredClone(BASE);
  mutate?.(raw);
  const entries = Object.entries(raw).map(([name, data]) => ({ name, data }));
  return analyseTrees(entries, new Staged(), { registry: registry(), expected: [], codes: CODES, warn: () => {} });
}
const codesOf = a => a.problems.map(p => p.code);
const failsWith = async (mutate, code, pattern) => {
  const a = await analyse(mutate);
  const hit = a.problems.filter(p => p.code === code);
  assert(hit.length, `expected ${code}, got ${[...new Set(codesOf(a))].join(', ') || 'no problem'}`);
  if (pattern) assert(hit.some(p => pattern.test(p.message)), `no ${code} problem matches ${pattern}: ${hit.map(p => p.message).join(' | ')}`);
};
const focus = (raw, tree, key) => raw[tree].focuses.find(f => f.key === key);

const clean = await analyse();   // the real trees, once, for the positive tests
const compiled = new Map(clean.list.map(t => [t.id, compileTree(t, clean.ctx)]));
const text = (id, rel) => compiled.get(id).files.get(rel);
const strip = s => s.replace(/\[[^\]]*\]/g, ' ').replace(/\$[^$]*\$/g, ' ');

// ------------------------------------------------------------------------------------------------ counts and structure
test('The slice is sixteen tier B trees: five Magical Lands and eleven Middle Lands', () => {
  assert.equal(IDS.length, 16);
  assert.equal(MAGICAL.length, 5);
  assert.equal(MIDDLE.length, 11);
  assert.equal(clean.list.length, 16);
});

test('Every tree has the specs\' focus, spirit and event counts', () => {
  for (const [id, [country, focuses, spirits, events]] of Object.entries(TREES)) {
    const t = BASE[id];
    assert.equal(t.id, id);
    assert.equal(t.tier, 'regional');
    assert.deepEqual(t.countries, [realm(country)], `${id} serves the realm that continues ${country}`);
    assert.equal(t.focuses.length, focuses, `${id} focuses`);
    assert.equal(Object.keys(t.spirits ?? {}).length, spirits, `${id} spirits`);
    assert.equal(Object.keys(t.events ?? {}).length, events, `${id} events`);
  }
  assert.equal(MAGICAL.reduce((n, id) => n + BASE[id].focuses.length, 0), 181);
  assert.equal(MIDDLE.reduce((n, id) => n + BASE[id].focuses.length, 0), 365);
});

test('Every focus count lies in the tier B range of 30 to 50', () => {
  const [lo, hi] = TIER_RANGES.regional;
  for (const id of IDS) assert(BASE[id].focuses.length >= lo && BASE[id].focuses.length <= hi, id);
});

test('Each tree passes the schema, the build checks and the roster (no problem at all)', () => {
  assert.deepEqual(clean.problems.map(p => p.message), []);
  const roster = new Set(ROSTER.map(c => c.name));
  const ctx = { countries: roster, regions: new Set(ROSTER.map(c => c.scan)), people: new Set(Object.keys(PEOPLES)) };
  for (const id of IDS) {
    assert.deepEqual(validateTree(BASE[id], ctx), [], id);
    for (const c of BASE[id].countries) assert(roster.has(c), c);
  }
});

test('Every country has exactly one tree among the sixteen and no tree is shared', () => {
  const seen = new Map();
  for (const id of IDS) for (const c of BASE[id].countries) { assert(!seen.has(c), `${c} in ${seen.get(c)} and ${id}`); seen.set(c, id); }
  assert.equal(seen.size, 16);
});

test('Focus ids compile to zin_<tree>_<key>, are unique and all appear in the compiled tree file', () => {
  const all = new Set();
  for (const id of IDS) {
    const file = text(id, `common/national_focus/zin_${id}.txt`);
    assert(file, id);
    assert.equal((file.match(/^\tfocus = \{/gm) ?? []).length, BASE[id].focuses.length, id);
    for (const f of BASE[id].focuses) {
      const fid = `zin_${id}_${f.key}`;
      assert(!all.has(fid), `duplicate ${fid}`);
      all.add(fid);
      assert(file.includes(`id = ${fid}\n`), fid);
    }
  }
  assert.equal(all.size, 546);
});

test('Positions are unique, every focus sits below its prerequisites and prerequisites exist', () => {
  for (const id of IDS) {
    const { pos } = absolutePositions(BASE[id]);
    const at = new Set(), keys = new Set(BASE[id].focuses.map(f => f.key));
    for (const f of BASE[id].focuses) {
      const p = pos.get(f.key), k = `${p.x},${p.y}`;
      assert(!at.has(k), `${id}: ${k} used twice`);
      at.add(k);
      assert(f.days % 7 === 0 && f.days >= 7 && f.days <= 140, `${id}.${f.key} days`);
      for (const group of f.prerequisite ?? []) for (const pre of group) {
        assert(keys.has(pre), `${id}.${f.key} needs ${pre}`);
        assert(pos.get(pre).y < p.y, `${id}.${f.key} is not below ${pre}`);
      }
    }
  }
});

test('Row-0 focuses and branch heads are the only focuses without a prerequisite', () => {
  for (const id of IDS) {
    const heads = BASE[id].focuses.filter(f => !(f.prerequisite ?? []).length);
    assert(heads.length >= 4, `${id} has ${heads.length} heads`);
    for (const f of heads) assert(f.y === 0 || f.y >= 5, `${id}.${f.key} sits at row ${f.y}`);
  }
});

test('Mutual exclusions are symmetric in the data and written on both focuses', () => {
  let pairs = 0;
  for (const id of IDS) {
    const closure = exclusiveClosure(clean.trees.get(id));
    const file = text(id, `common/national_focus/zin_${id}.txt`);
    for (const f of BASE[id].focuses) for (const ex of f.mutually_exclusive ?? []) {
      pairs++;
      assert(closure.get(ex).has(f.key), `${id}: ${ex} lacks ${f.key}`);
      const block = file.split(`id = zin_${id}_${ex}\n`)[1].split('\n\tfocus = {')[0];
      assert(block.includes(`focus = zin_${id}_${f.key}`), `${id}: ${ex} does not list ${f.key} in the compiled file`);
    }
  }
  assert(pairs >= 20, `pairs ${pairs}`);
});

test('Each tree has the exclusive choices its spec names', () => {
  const pairs = [
    ['regional_lccimio', 'the_old_houses_hold', 'the_open_houses'], ['regional_lccimio', 'keep_the_roads_open', 'toll_the_pilgrims'],
    ['regional_the_end', 'wardens_for_life', 'wardens_by_turns'], ['regional_herrodon', 'a_crown_above_the_houses', 'a_crown_among_the_houses'],
    ['regional_herrodon', 'honour_the_old_slights', 'let_the_groves_grow_wild'], ['regional_andos_enda', 'one_voice_for_andos_enda', 'every_grove_its_voice'],
    ['regional_andos_enda', 'remember_every_slight', 'forgive_the_old_slights'], ['regional_nolorim', 'wardens_first', 'valleys_first'],
    ['regional_selen', 'for_the_free_dominions', 'for_order_in_parim'], ['regional_selen', 'for_order_in_parim', 'for_the_strangers_host'],
    ['regional_herez', 'stand_with_the_lost_cause', 'a_league_of_the_south'], ['regional_kilinti', 'timber_for_the_crown', 'no_axe_in_the_old_wood'],
    ['regional_kingson', 'honest_tolls', 'the_full_toll'], ['regional_kingson', 'shut_the_gates', 'open_the_gates'],
    ['regional_bloody_forest', 'a_truce_with_parim', 'the_old_defiance'], ['regional_bloody_forest', 'blood_for_the_living', 'gifts_from_the_south'],
    ['regional_cursed_lands', 'bar_the_barrows', 'open_the_veil'], ['regional_asgard', 'bar_the_harbours', 'spare_the_isle'],
  ];
  for (const [id, a, b] of pairs) {
    assert((focus(BASE, id, a).mutually_exclusive ?? []).includes(b) || (focus(BASE, id, b).mutually_exclusive ?? []).includes(a), `${id}: ${a} / ${b}`);
  }
});

// ------------------------------------------------------------------------------------------------ localisation and text
test('Every focus, spirit, event and option has non-empty localisation text in the compiled tree', () => {
  let keys = 0;
  for (const id of IDS) {
    const loc = compiled.get(id).loc, t = BASE[id];
    for (const f of t.focuses) {
      const fid = `zin_${id}_${f.key}`;
      assert(loc[fid] && loc[`${fid}_desc`], fid);
      assert.equal(loc[fid], f.name);
      assert.equal(loc[`${fid}_desc`], f.desc);
      keys += 2;
    }
    for (const [k, s] of Object.entries(t.spirits ?? {})) {
      assert(loc[`zin_${id}_${k}`] && loc[`zin_${id}_${k}_desc`], `${id} spirit ${k}`);
      assert(s.modifier && Object.keys(s.modifier).length, `${id} spirit ${k} has no modifier`);
      keys += 2;
    }
    const numbers = eventNumbers(t);
    for (const [k, e] of Object.entries(t.events ?? {})) {
      const eid = `zin_${id}.${numbers.get(k)}`;
      assert(loc[`${eid}.t`] && loc[`${eid}.d`], `${id} event ${k}`);
      e.options.forEach((o, i) => assert(loc[`${eid}.${'abcdefghijklmnopqrstuvwxyz'[i]}`], `${id} event ${k} option ${i + 1}`));
      keys += 2 + e.options.length;
    }
    for (const [key, value] of Object.entries(loc)) assert(typeof value === 'string' && value.trim().length > 2, `${id}: ${key}`);
  }
  assert(keys > 1500, `keys ${keys}`);
});

test('Descriptions are one to three sentences and no text carries a double quote, a colour code or a placeholder', () => {
  for (const id of IDS) for (const x of collectTexts(BASE[id])) {
    assert(!/"|§|\bTODO\b|\bTBD\b|lorem|placeholder/i.test(x.text), `${id} ${x.where}: ${x.text}`);
    if (/ desc$/.test(x.where) && x.where.startsWith('focus')) {
      const sentences = strip(x.text).split(/(?<=[.!?])\s+/).filter(s => s.trim()).length;
      assert(sentences >= 1 && sentences <= 3, `${id} ${x.where}: ${sentences} sentences`);
      assert(x.text.length >= 60 && x.text.length <= 400, `${id} ${x.where}: ${x.text.length} characters`);
    }
  }
});

test('No text uses a banned modern word, a glossary-forbidden word or an American spelling', async () => {
  const glossary = await json(path.join(DATA, 'glossary.json'));
  const rules = compileBanned(await loadRuleSet({ glossary }));
  let scanned = 0;
  for (const id of IDS) for (const x of collectTexts(BASE[id])) {
    scanned++;
    const hits = findBanned(strip(x.text), rules, ['error', 'review']);
    assert.deepEqual(hits.map(h => h.word), [], `${id} ${x.where}: ${x.text}`);
  }
  assert(scanned > 1100, `scanned ${scanned}`);
});

test('The banned-word scan finds a planted modern word', async () => {
  const glossary = await json(path.join(DATA, 'glossary.json'));
  const rules = compileBanned(await loadRuleSet({ glossary }));
  for (const planted of ['The factory hums.', 'Two divisions march.', 'Steel and coal for the tanks.', 'The government of Germany.']) assert(findBanned(planted, rules, ['error', 'review']).length > 0, planted);
});

test('Text keeps the secrets: no Eindil, Afrit or Hidden Council in any text, only the scripted names', () => {
  let scripted = 0;
  for (const id of IDS) for (const x of collectTexts(BASE[id])) {
    assert(!/Eindil|Afrit|Hidden Council|Einendil|Kusven|\bRush\b/.test(strip(x.text)), `${id} ${x.where}`);
    if (/\[zin_loc_(eindil|deliverer)\]/.test(x.text)) scripted++;
    assert(!/(^|\W)(Eindil|Afrit)/i.test(BASE[id].focuses.map(f => f.name).join(' | ')), `${id} focus names`);
  }
  assert(scripted >= 5, `scripted names ${scripted}`);
});

test('Texts use only Windows-1252 characters and avoid the retired names', () => {
  const cp = c => { const n = c.codePointAt(0); return n === 10 || (n >= 0x20 && n <= 0x7e) || (n >= 0xa0 && n <= 0xff); };
  for (const id of IDS) for (const x of collectTexts(BASE[id])) {
    assert([...x.text].every(cp), `${id} ${x.where}`);
    assert(!/Hierarch|Aldis Veleran|Klinti\b|Huhun|Gorbat|Sovereign Spirit/.test(x.text), `${id} ${x.where}`);
  }
});

test('No focus, spirit, event title or option name repeats a vanilla text (the installed game, read only)', async () => {
  const dir = path.join(GAME, 'localisation/english');
  if (!existsSync(dir)) return;
  const vanilla = new Set();
  for (const n of (await readdir(dir)).filter(n => /_l_english\.yml$/i.test(n))) {
    for (const m of (await readFile(path.join(dir, n), 'utf8')).matchAll(/^\s*[A-Za-z0-9_.]+:\d*\s+"([^"]+)"/gm)) vanilla.add(m[1].toLowerCase());
  }
  assert(vanilla.size > 50000, `vanilla texts ${vanilla.size}`);
  const names = t => [
    ...t.focuses.map(f => ['focus ' + f.key, f.name]), ...Object.entries(t.spirits ?? {}).map(([k, v]) => ['spirit ' + k, v.name]),
    ...Object.entries(t.events ?? {}).flatMap(([k, e]) => [['event ' + k, e.title], ...e.options.map((o, i) => [`event ${k} option ${i + 1}`, o.name])]),
  ];
  let checked = 0;
  for (const id of IDS) for (const [what, name] of names(BASE[id])) { checked++; assert(!vanilla.has(name.toLowerCase()), `${id} ${what} reuses the vanilla text "${name}"`); }
  assert(checked > 850, `checked ${checked}`);
  const planted = structuredClone(BASE.regional_asgard);
  planted.focuses[0].name = 'Army Reform';
  assert(names(planted).some(([, n]) => vanilla.has(n.toLowerCase())), 'a planted vanilla name is found');
});

// ------------------------------------------------------------------------------------------------ compiled output
test('The slice compiles twice to identical bytes through the builder\'s own entry point', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'zin-regional-c-'));
  try {
    for (const id of IDS) await writeFile(path.join(dir, `${id}.json`), await readFile(path.join(TREE_DIR, `${id}.json`)));
    const run = async () => { const staged = new Staged(); const total = await buildFocusTrees(staged, { dir, registry: registry(), codes: CODES, warn: () => {} }); return { staged, total }; };
    const a = await run(), b = await run();
    assert.equal(a.total.trees, 16);
    assert.equal(a.total.focuses, 546);
    assert.equal(a.total.spirits, 8 + 10 + 6 + 11 + 8 + 17 + 9 + 8 + 10 + 12 + 11 + 11 + 9 + 10 + 9 + 11);
    assert.deepEqual([...a.staged.files.keys()], [...b.staged.files.keys()]);
    for (const [rel, bytes] of a.staged.files) assert(bytes.equals(b.staged.files.get(rel)), rel);
    for (const id of IDS) {
      assert(a.staged.files.has(`common/national_focus/zin_${id}.txt`), id);
      assert(a.staged.files.has(`localisation/english/zin_focus_${id}_l_english.yml`), id);
      assert(a.staged.files.has(`common/ideas/zin_focus_${id}.txt`), id);
      assert(a.staged.files.has(`events/zin_${id}.txt`), id);
    }
    assert(a.staged.files.has('common/on_actions/zin_focus_layout.txt'));
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('Every compiled event is triggered only by effects, times out after 30 days and lives in the tree\'s namespace', () => {
  let events = 0;
  for (const id of IDS) {
    const file = text(id, `events/zin_${id}.txt`);
    const n = Object.keys(BASE[id].events).length;
    assert.match(file, new RegExp(`add_namespace = zin_${id}\\n`));
    assert.equal((file.match(/^country_event = \{/gm) ?? []).length, n, id);
    assert.equal((file.match(/timeout_days = 30/g) ?? []).length, n, id);
    assert.equal((file.match(/is_triggered_only = yes/g) ?? []).length, n, id);
    assert.doesNotMatch(file, /mean_time_to_happen|trigger = \{/);
    for (let i = 1; i <= n; i++) assert(file.includes(`id = zin_${id}.${i}\n`), `${id}.${i}`);
    events += n;
  }
  assert.equal(events, 3 + 3 + 6 + 4 + 4 + 4 + 4 + 5 + 4 + 4 + 5 + 3 + 2 + 4 + 5 + 2);
});

test('Every scripted effect and trigger a tree declares is written, with its tree\'s prefix', () => {
  const effects = [], triggers = [];
  for (const id of IDS) {
    for (const k of Object.keys(BASE[id].scripted_effects ?? {})) { assert(k.startsWith(`zin_${id}_`), k); effects.push(k); assert(text(id, `common/scripted_effects/zin_${id}.txt`).includes(`${k} = {`), k); }
    for (const k of Object.keys(BASE[id].scripted_triggers ?? {})) { assert(k.startsWith(`zin_${id}_`), k); triggers.push(k); assert(text(id, `common/scripted_triggers/zin_${id}.txt`).includes(`${k} = {`), k); }
  }
  for (const name of ['zin_regional_herrodon_court_keeper', 'zin_regional_nolorim_ask_kin', 'zin_regional_selen_raise_rangers', 'zin_regional_selen_suspect_houses', 'zin_regional_noleksun_call_the_free']) assert(effects.includes(name), name);
  for (const name of ['zin_regional_lccimio_east_quiet', 'zin_regional_the_end_faces_the_mistake', 'zin_regional_herrodon_keeper_friend', 'zin_regional_herez_mirolon_friend', 'zin_regional_herez_league_exists', 'zin_regional_herez_cores_occupied']) assert(triggers.includes(name), name);
  assert(text('regional_andos_enda', 'common/scripted_effects/zin_regional_andos_enda.txt').includes('zin_regional_andos_enda_opinion = {'));
  assert(text('regional_andos_enda', 'common/opinion_modifiers/zin_regional_andos_enda.txt').includes('zin_regional_andos_enda_northern_letters = {'));
});

test('Global variables are read with the global. prefix and no tree writes a raw block that sets a game state', () => {
  let globals = 0;
  for (const id of IDS) {
    const file = text(id, `common/national_focus/zin_${id}.txt`);
    for (const m of file.matchAll(/check_variable = \{ (global\.)?(zin_[a-z_]+) [<>=]/g)) {
      if (['zin_elves_kinship', 'zin_elves_rivalry', 'zin_elves_wall_grievance', 'zin_gathering_dark', 'zin_eindil_stage', 'zin_eindil_renown', 'zin_dragons_free', 'zin_world_dragon_pacts', 'zin_west_fleet'].includes(m[2])) { assert(m[1], `${id}: ${m[2]} must be global`); globals++; }
    }
  }
  assert(globals >= 15, `global reads ${globals}`);
  for (const id of IDS) for (const raw of JSON.stringify(BASE[id]).matchAll(/"raw":"((?:[^"\\]|\\.)*)"/g)) assert(!/set_global_flag|declare_war|create_wargoal/.test(raw[1]) && !/set_country_flag = (?!zin_regional_)/.test(raw[1]), `${id}: ${raw[1].slice(0, 80)}`);
});

// ------------------------------------------------------------------------------------------------ story rules
test('Peaceful start (Magical Lands): no focus declares war, makes a claim or joins a human faction, and the Refusal is never lifted', () => {
  for (const id of MAGICAL) {
    const focuses = JSON.stringify(BASE[id].focuses);
    assert.doesNotMatch(focuses, /"wargoal"|"claims_on"|"cores_on"|"annex"|"puppet"|"invite"|"faction"|join_faction_of|declare_war/, id);
    assert.doesNotMatch(JSON.stringify(BASE[id]), /zin_refusal_lifted|zin_diplo_lift_refusal|declare_war|"wargoal"|"claims_on"|"cores_on"/, id);
    // the one subject realm a Magical Lands event can make is Herrodon's offer to its lost kin, behind a focus the historical AI never takes
    const puppets = Object.entries(BASE[id].events ?? {}).filter(([, e]) => JSON.stringify(e).includes('"puppet"')).map(([k]) => k);
    assert.deepEqual(puppets, id === 'regional_herrodon' ? ['under_one_crown'] : [], id);
  }
});

test('The only war goal in the Magical Lands trees is the Feud of the Groves, behind rivalry 90, 1750 and peace', () => {
  const feuds = [];
  for (const id of MAGICAL) for (const f of BASE[id].focuses) if (JSON.stringify(f.effects ?? []).includes('zin_elves_begin_feud')) feuds.push([id, f]);
  assert.deepEqual(feuds.map(([id]) => id).sort(), ['regional_andos_enda', 'regional_herrodon']);
  for (const [id, f] of feuds) {
    assert.equal(f.key, 'the_feud_of_the_groves');
    const av = JSON.stringify(f.available);
    assert.match(av, /global\.zin_elves_rivalry/);
    assert.match(av, /"above":89/);
    assert.match(av, /1750\.3\.1/);
    assert(f.ai.modifiers.some(m => m.factor === 0 && JSON.stringify(m.if).includes('zin_rules_is_historical')), `${id}: the historical AI never takes the feud`);
    assert(f.y >= 3);
  }
});

test('Every war branch head of the Magical Lands trees is gated on a war and sits in a low row', () => {
  const heads = { regional_lccimio: 'the_rift_burns', regional_the_end: 'the_end_stands', regional_herrodon: 'the_groves_defended', regional_andos_enda: 'the_federation_defends', regional_nolorim: 'the_passes_hold' };
  for (const [id, key] of Object.entries(heads)) {
    const f = focus(BASE, id, key);
    assert(f.y >= 6 && !(f.prerequisite ?? []).length, `${id}.${key}`);
    assert(f.available?.length, `${id}.${key} needs a gate`);
    assert(/at_war|zin_eastern_invasion|zin_regional/.test(JSON.stringify(f.available)), `${id}.${key}`);
    assert(f.ai.base >= 500, `${id}.${key} weighs ${f.ai.base}`);
  }
});

test('Every Kindred focus has AI weight 300 and is open only once the Kindred exists', () => {
  let n = 0;
  for (const id of MAGICAL) for (const f of BASE[id].focuses) if (JSON.stringify(f.effects ?? []).includes('zin_elves_join_kindred')) {
    n++;
    assert.equal(f.ai.base, 300, `${id}.${f.key}`);
    const trig = (BASE[id].scripted_triggers ?? {})[`zin_${id}_may_join_kindred`];
    assert(trig && JSON.stringify(trig).includes('zin_elves_kindred_exists'), id);
    assert(JSON.stringify(f.available).includes(`zin_${id}_may_join_kindred`), `${id}.${f.key}`);
  }
  assert.equal(n, 5);
});

test('Nolorim\'s guest branch is open only to its host and Nolorim\'s pass watch adds up as the spec says', () => {
  const t = BASE.regional_nolorim;
  for (const k of ['a_guest_in_the_passes', 'hide_the_guest', 'the_mountain_paths']) assert(JSON.stringify(focus(BASE, 'regional_nolorim', k).available).includes('zin_eindil_is_host'), k);
  const watch = k => (focus(BASE, 'regional_nolorim', k).effects ?? []).filter(e => e.call === 'zin_elves_add_pass_watch').reduce((n, e) => n + e.args.value, 0);
  const branchB = ['stone_in_the_passes', 'watchtowers_on_the_heights', 'the_high_roads', 'walls_across_the_passes', 'the_magic_mountains_road', 'beacons_to_the_kin'].reduce((n, k) => n + watch(k), 0);
  assert.equal(branchB, 35);
  assert.equal(watch('nolwes_watch'), 3);
  assert.equal(watch('wardens_first'), 5);
  assert.equal(t.focuses.filter(f => f.available && JSON.stringify(f.available).includes('zin_eindil_is_host')).length, 3);
});

test('The End\'s boat event sets zin_zol_forewarned and its black-north branch hides behind the Mistake trigger', () => {
  const t = BASE.regional_the_end;
  assert(JSON.stringify(t.events.black_ships_seen.options[0].effects).includes('zin_zol_forewarned'));
  const head = focus(BASE, 'regional_the_end', 'eyes_on_the_black_north');
  assert.deepEqual(head.allow_branch, [{ check: 'zin_regional_the_end_faces_the_mistake' }]);
  assert.deepEqual(head.available, head.allow_branch);
  assert(focus(BASE, 'regional_the_end', 'the_edge_of_the_woods').available.some(c => c.global_flag === 'zin_zol_rising'));
});

test('Peaceful start (Middle Lands): the war branches open only from story flags or a war, never from the start', () => {
  const story = ['zin_war_of_last_crowns', 'zin_volgan_marches', 'zin_zol_rising', 'zin_western_crossing', 'zin_eastern_invasion', 'zin_wall_accord_broken', 'at_war', 'has_war', 'zin_golden_king_dead', 'zin_eindil_returned', 'zin_regional_'];
  const heads = {
    regional_selen: 'selen_under_arms', regional_noleksun: 'the_frontier_burns', regional_herez: 'the_storm_breaks', regional_konori: 'the_steppe_rides_to_war',
    regional_kilinti: 'the_woods_awake', regional_kingson: 'the_gates_are_tested', regional_hunhun: 'the_long_ride', regional_hiloron: 'the_giants_wake',
    regional_bloody_forest: 'the_woods_close', regional_cursed_lands: 'when_the_dead_walk', regional_asgard: 'the_western_sails',
  };
  for (const [id, key] of Object.entries(heads)) {
    const f = focus(BASE, id, key);
    assert(f.y >= 5 && !(f.prerequisite ?? []).length, `${id}.${key}`);
    assert(f.available?.length && story.some(s => JSON.stringify(f.available).includes(s)), `${id}.${key} needs a story gate`);
    assert(f.ai.base >= 100, `${id}.${key}`);
  }
  for (const id of MIDDLE) assert.doesNotMatch(JSON.stringify(BASE[id].focuses.flatMap(f => f.effects ?? [])), /"wargoal"|"claims_on"|"cores_on"|declare_war|create_wargoal/, id);
});

test('The Concord charter helpers are called with keyword codes, and only by dominions that can use them', () => {
  const calls = [];
  for (const id of MIDDLE) for (const f of BASE[id].focuses) JSON.stringify(f.effects ?? []).replace(/"call":"(zin_concord_[a-z_]+)","args":(\{[^}]*\})/g, (_, name, args) => { calls.push([id, f.key, name, JSON.parse(args)]); return ''; });
  assert(calls.length >= 25, `calls ${calls.length}`);
  for (const [, , name, args] of calls) {
    if (name === 'zin_concord_petition_charter') assert(['old', 'golden', 'shield', 'free'].includes(args.charter));
    if (name === 'zin_concord_back_camp') assert(['court', 'faithful', 'dominions', 'host'].includes(args.camp));
  }
  const text2 = text('regional_selen', 'common/national_focus/zin_regional_selen.txt');
  assert.match(text2, /set_temp_variable = \{ zin_arg_charter = 3 \}\n\t+zin_concord_petition_charter = yes/);
  assert.match(text2, /set_temp_variable = \{ zin_arg_camp = 3 \}\n\t+set_temp_variable = \{ zin_arg_value = 10 \}\n\t+zin_concord_back_camp = yes/);
});

test('The secret holds in the Middle Lands: the almoners are the Deliverer\'s and no event names Eindil', () => {
  for (const id of MIDDLE) {
    const events = JSON.stringify(BASE[id].events ?? {});
    assert(!/Eindil|Afrit/.test(events.replace(/\[zin_loc_[a-z]+\]/g, '')), id);
    const houses = BASE[id].events && Object.values(BASE[id].events).filter(e => /almoners/i.test(e.desc));
    for (const e of houses ?? []) assert.match(e.desc, /Deliverer/, id);
  }
  assert(JSON.stringify(BASE.regional_selen.events.alleria_reports).includes('[zin_loc_eindil]'));
});

test('AI: every Middle Lands and Magical Lands tree carries a historical route and the never-historical choices have weight zero', () => {
  for (const id of IDS) {
    const routed = BASE[id].focuses.filter(f => (f.ai?.modifiers ?? []).some(m => m.add === 30 && JSON.stringify(m.if).includes('zin_rules_is_historical')));
    assert(routed.length >= 12, `${id}: ${routed.length} routed focuses`);
  }
  const never = {
    regional_selen: ['petition_for_the_old_liberties', 'voice_of_the_dominions', 'count_the_almoners', 'for_the_free_dominions', 'break_the_charter'],
    regional_noleksun: ['petition_parim', 'the_free_dominion'], regional_kingson: ['honest_tolls', 'open_the_gates'], regional_hunhun: ['old_freedoms_of_the_ride', 'riders_of_the_free_dominions'],
    regional_bloody_forest: ['blood_for_the_living', 'gifts_from_the_south'], regional_cursed_lands: ['a_crack_in_the_veil'],
    regional_herrodon: ['the_feud_of_the_groves', 'one_crown_of_the_woods'], regional_andos_enda: ['the_feud_of_the_groves'],
  };
  for (const [id, keys] of Object.entries(never)) for (const k of keys) assert(focus(BASE, id, k).ai.modifiers.some(m => m.factor === 0 && JSON.stringify(m.if).includes('zin_rules_is_historical')), `${id}.${k}`);
});

test('Strategies: the Magical Lands trees befriend the Magical Forest or prepare against the coalition only after the invasion', () => {
  const s = id => BASE[id].ai_strategies ?? [];
  assert.deepEqual(s('regional_herrodon').map(x => [x.type, x.target, x.value]), [['befriend', 'Magical Forest', 30]]);
  assert.deepEqual(s('regional_andos_enda').map(x => [x.type, x.target, x.value]), [['befriend', 'Magical Forest', 30]]);
  assert.deepEqual(s('regional_nolorim').map(x => [x.type, x.target, x.value]), [['befriend', 'Magical Forest', 40]]);
  for (const id of ['regional_lccimio', 'regional_the_end']) {
    assert(s(id).length === 2 && s(id).every(x => x.type === 'prepare_for_war' && JSON.stringify(x.if) === '[{"global_flag":"zin_eastern_invasion"}]'), id);
  }
  assert.match(text('regional_herrodon', 'common/ai_strategy/zin_regional_herrodon.txt'), /type = befriend/);
});

// ------------------------------------------------------------------------------------------------ registry
test('The registry file lists every outside name the trees use and nothing a tree defines itself', () => {
  const reg = registryData;
  for (const name of ['zin_elves_add_kinship', 'zin_concord_petition_charter', 'zin_aenor_event_for_parim', 'zin_eindil_aid_host']) assert(reg.scripted_effects.includes(name), name);
  for (const name of ['zin_elves_kindred_exists', 'zin_aenor_is_concord_dominion', 'zin_rules_is_historical', 'zin_shared_bound_away_from_host']) assert(reg.scripted_triggers.includes(name), name);
  assert(reg.faction_templates.includes('zin_faction_free_dominions'));
  assert(reg.branch.refreshed_checks.includes('zin_elves_is_rift_realm'));
  const own = new Set(IDS.flatMap(id => [...Object.keys(BASE[id].scripted_effects ?? {}), ...Object.keys(BASE[id].scripted_triggers ?? {})]));
  for (const name of [...reg.scripted_effects, ...reg.scripted_triggers]) assert(!own.has(name), `${name} is declared by a tree`);
  assert(CODES.owners.some(o => o.prefixes.includes('zin_concord_') && o.args.charter.free === 3 && o.args.camp.host === 4));
});

// ------------------------------------------------------------------------------------------------ negative cases
test('Negative: an unknown trigger is refused', async () => {
  await failsWith(raw => { focus(raw, 'regional_selen', 'rangers_of_selen').available = [{ check: 'zin_no_such_trigger' }]; }, 'trigger_unresolved', /zin_no_such_trigger/);
});

test('Negative: an unknown scripted effect is refused', async () => {
  await failsWith(raw => { focus(raw, 'regional_kingson', 'the_gate_of_kingson').effects.push({ call: 'zin_no_such_effect' }); }, 'effect_unresolved', /zin_no_such_effect/);
});

test('Negative: a duplicate focus key and a shared position are refused', async () => {
  await failsWith(raw => { raw.regional_asgard.focuses.push(structuredClone(focus(raw, 'regional_asgard', 'the_sea_watch'))); }, 'duplicate_key', /the_sea_watch/);
  await failsWith(raw => { const f = focus(raw, 'regional_asgard', 'lighthouses'); const g = focus(raw, 'regional_asgard', 'the_western_beacons'); g.x = f.x; g.y = f.y; }, 'duplicate_position');
});

test('Negative: a missing prerequisite, a self prerequisite, a loop and a focus above its prerequisite are refused', async () => {
  await failsWith(raw => { focus(raw, 'regional_herez', 'march_wardens').prerequisite = [['no_such_focus']]; }, 'prerequisite_missing', /no_such_focus/);
  await failsWith(raw => { focus(raw, 'regional_herez', 'march_wardens').prerequisite = [['march_wardens']]; }, 'prerequisite_self');
  await failsWith(raw => { focus(raw, 'regional_herez', 'the_southern_marches').prerequisite = [['forts_of_the_marches']]; }, 'prerequisite_cycle');
  await failsWith(raw => { focus(raw, 'regional_herez', 'march_wardens').y = 0; }, 'prerequisite_above');
});

test('Negative: a spirit that shares a key with a focus is refused (F3)', async () => {
  await failsWith(raw => { raw.regional_selen.spirits.rangers_of_selen = { name: 'Rangers', desc: 'A spirit that shares a focus key.', modifier: { stability_factor: 0.01 } }; }, 'key_collision', /rangers_of_selen/);
});

test('Negative: an unresolved event, spirit, flag and focus_done reference is refused', async () => {
  await failsWith(raw => { focus(raw, 'regional_konori', 'the_hundreds').effects.push({ event: 'no_such_event' }); }, 'event_unknown');
  await failsWith(raw => { focus(raw, 'regional_konori', 'the_hundreds').effects.push({ add_spirit: 'no_such_spirit' }); }, 'spirit_unknown');
  await failsWith(raw => { focus(raw, 'regional_konori', 'the_hundreds').available = [{ flag: 'zin_flag_nobody_sets' }]; }, 'flag_unresolved', /zin_flag_nobody_sets/);
  await failsWith(raw => { focus(raw, 'regional_konori', 'the_hundreds').available = [{ focus_done: 'nothing_here' }]; }, 'focus_done_unknown');
});

test('Negative: an unknown icon, event picture, modifier and research name are refused', async () => {
  await failsWith(raw => { focus(raw, 'regional_hunhun', 'the_riders_moot').icon = 'no_such_icon'; }, 'icon_unknown');
  await failsWith(raw => { raw.regional_hunhun.events.a_quarrel_over_grazing.picture = 'no_such_picture'; }, 'picture_unknown');
  await failsWith(raw => { raw.regional_hunhun.spirits.riders_moot.modifier.no_such_modifier = 0.1; }, 'modifier_unknown', /no_such_modifier/);
});

test('Negative: a changing condition in allow_branch and a retired name in text are refused', async () => {
  await failsWith(raw => { focus(raw, 'regional_nolorim', 'eyes_on_the_south').allow_branch = [{ flag: 'zin_elves_wanderers_extra' }]; }, 'allow_branch_changing');
  await failsWith(raw => { focus(raw, 'regional_nolorim', 'eyes_on_the_south').desc = 'Scouts watch for Einendil on the southern ridges.'; }, 'text_superseded');
  await failsWith(raw => { focus(raw, 'regional_nolorim', 'eyes_on_the_south').desc = 'Scouts ask the Hierarch about the southern ridges.'; }, 'retired_name');
});

test('Negative: a leak of Afrit\'s name before the reveal and a keyword without a code are refused', async () => {
  await failsWith(raw => { focus(raw, 'regional_lccimio', 'the_temple_on_the_road').desc = 'The hermitage belongs to Afrit, and the Elders close the road.'; }, 'secret_leak');
  await failsWith(raw => { focus(raw, 'regional_selen', 'petition_for_the_old_liberties').effects = [{ call: 'zin_concord_petition_charter', args: { charter: 'imaginary' } }]; }, 'call_keyword_nocode', /imaginary/);
});

test('Negative: bad counts, days and unknown schema fields are refused', async () => {
  await failsWith(raw => { raw.regional_asgard.focuses.splice(5); }, 'tier_range', /30 to 50/);
  await failsWith(raw => { focus(raw, 'regional_asgard', 'the_sea_watch').days = 36; }, 'days_multiple');
  const roster = new Set(ROSTER.map(c => c.name));
  const ctx = { countries: roster, regions: new Set(ROSTER.map(c => c.scan)), people: new Set(Object.keys(PEOPLES)) };
  const bad = structuredClone(BASE.regional_asgard);
  bad.focuses[0].surprise = 1;
  assert(validateTree(bad, ctx).some(e => /surprise/.test(e.path)));
  const wrongCountry = structuredClone(BASE.regional_asgard);
  wrongCountry.countries = ['Nowhere'];
  assert(validateTree(wrongCountry, ctx).some(e => /Nowhere/.test(e.message)));
  const noDesc = structuredClone(BASE.regional_asgard);
  delete noDesc.focuses[0].desc;
  assert(validateTree(noDesc, ctx).some(e => /desc/.test(e.path)));
});

test('Negative: a missing localisation text, an empty name and a modern word in a planted description are caught', async () => {
  const glossary = await json(path.join(DATA, 'glossary.json'));
  const rules = compileBanned(await loadRuleSet({ glossary }));
  const t = structuredClone(BASE.regional_asgard);
  t.focuses[0].desc = 'The isle builds a factory beside the harbour.';
  assert(collectTexts(t).some(x => findBanned(strip(x.text), rules, ['error']).length));
  await failsWith(raw => { focus(raw, 'regional_asgard', 'the_sea_watch').name = '   '; }, 'text_empty');
});

test('Negative: a tree that names a vanilla-style id for a mechanic idea collides with the mechanic', async () => {
  const reg = registry();
  reg.sets.ideas.add('zin_regional_asgard_house_moot');
  const raw = structuredClone(BASE);
  const a = await analyseTrees(Object.entries(raw).map(([name, data]) => ({ name, data })), new Staged(), { registry: reg, expected: [], codes: CODES, warn: () => {} });
  assert(a.problems.some(p => p.code === 'collision_mechanic'), 'collision with a mechanic idea');
});
