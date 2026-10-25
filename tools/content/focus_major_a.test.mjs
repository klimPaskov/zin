// Tests of the first batch of major focus trees (docs/design/stage2/focus_major_a.md): aenor, coldor, gala and goldoroth.
// They run the focus compiler's own check API (analyseTrees and compileTree) on the four tree files without writing any
// game file, then compare the trees with their specs and plant failures in copies of the data.
//   node --test tools/content/focus_major_a.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { ZIN } from './lib/paths.mjs';
import { analyseTrees, compileTree } from './modules/focus_compiler.mjs';
import { Registry, loadArgCodes, loadRegistry, exclusiveClosure, gateWarnings } from './checks/focus_checks.mjs';
import { absolutePositions } from './lib/focus_model.mjs';
import { compileBanned, findBanned, loadRuleSet } from './lib/banned.mjs';
import { countryTable } from './lib/roster.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const json = async f => JSON.parse(await readFile(f, 'utf8'));
const IDS = ['aenor', 'coldor', 'gala', 'goldoroth'];
const EXPECT = {
  aenor: { focuses: 140, spirits: 53, events: 20, x: 28, y: 21, pairs: [['sale_of_offices', 'audit_treasury'], ['golden_jubilee', 'reform_the_court'], ['golden_charters', 'charters_renewed'], ['kings_own_counsel', 'one_faith_one_realm'], ['commissions_for_sale', 'commissions_by_merit'], ['equal_tolls', 'restore_by_force']] },
  coldor: { focuses: 107, spirits: 26, events: 3, x: 29, y: 12, pairs: [['favour_the_ports', 'favour_the_steadings'], ['the_iron_hand', 'the_open_hand'], ['stand_apart', 'timber_and_ships'], ['stand_apart', 'the_white_companies'], ['timber_and_ships', 'the_white_companies']] },
  gala: { focuses: 82, spirits: 15, events: 13, x: 25, y: 13, pairs: [['kings_patience', 'kings_warning'], ['courteous_distance', 'welcome_priests'], ['letters_to_parim', 'refusal_holds']] },
  goldoroth: { focuses: 110, spirits: 41, events: 24, x: 29, y: 14, pairs: [['one_warking_one_law', 'clans_rule_together'], ['chiefs_keep_their_halls', 'one_fire_under_cocanoor'], ['keep_the_armed_peace', 'the_long_grudge'], ['black_iron_crown', 'southern_bargain'], ['ally_of_the_south', 'kneel_to_nafeher'], ['horde_unbound', 'iron_discipline']] },
};

// ------------------------------------------------------------------------------------------------ setup
const RAW = {};
for (const id of IDS) RAW[id] = await json(`${ZIN}/docs/design/focus/${id}.json`);
const EXTRA = await json(`${here}/data/focus_registry_major_a.json`);
const BASE = await json(`${here}/data/focus_registry.json`);
function registryData(extra = EXTRA) {
  const d = structuredClone(BASE);
  for (const [k, v] of Object.entries(extra)) {
    if (k === 'source' || k === 'arg_code_prefixes') continue;
    if (Array.isArray(v)) d[k] = [...new Set([...(d[k] ?? []), ...v])];
    else if (k === 'branch') for (const [kk, vv] of Object.entries(v)) d.branch[kk] = [...new Set([...(d.branch[kk] ?? []), ...vv])];
  }
  return d;
}
async function codes(withExtra = true) {
  const c = await loadArgCodes();
  for (const [owner, prefixes] of Object.entries(EXTRA.arg_code_prefixes)) {
    const o = c.owners.find(x => x.owner.startsWith(owner));
    o.prefixes = withExtra ? [...new Set([...o.prefixes, ...prefixes])] : o.prefixes.filter(p => !prefixes.includes(p));
  }
  return c;
}
// Runs every compiler check on the four trees after `mutate` changed a copy of their data.
async function analyse(mutate, { registry = registryData(), withCodes = true } = {}) {
  const raw = structuredClone(RAW);
  mutate?.(raw);
  const entries = IDS.map(id => ({ name: id, data: raw[id] }));
  return analyseTrees(entries, new Staged(), { registry: new Registry(registry), codes: await codes(withCodes), warn: () => {} });
}
const failsWith = async (mutate, code, opts) => {
  const a = await analyse(mutate, opts);
  assert(a.problems.some(p => p.code === code), `expected ${code}, got ${[...new Set(a.problems.map(p => p.code))].join(', ') || 'no problem'}`);
  return a;
};
const focus = (raw, tree, key) => raw[tree].focuses.find(f => f.key === key);

const clean = await analyse();
const glossary = await json(`${here}/data/glossary.json`);
const RULES = compileBanned(await loadRuleSet({ glossary }));
const readable = v => String(v).replace(/§./g, '').replace(/£\w+(\|\w+)?/g, '').replace(/\$[^$]*\$/g, '').replace(/\[[^\]]*\]/g, '').replace(/\\n/g, ' ').normalize('NFKC');
const compiled = new Map(clean.list.map(t => [t.id, compileTree(t, clean.ctx)]));

// ------------------------------------------------------------------------------------------------ the trees pass the compiler's checks
test('The four trees pass every compiler check', () => {
  assert.deepEqual(clean.problems.map(p => p.message), []);
  assert.equal(clean.list.length, 4);
  for (const t of clean.list) assert.deepEqual(gateWarnings(t, clean.ctx), [], `${t.id}: gated pictures are provable`);
});

test('Counts, tiers and grid sizes match the specs', () => {
  for (const id of IDS) {
    const t = RAW[id], e = EXPECT[id];
    assert.equal(t.tier, 'major');
    // Each major tree serves the one realm of the roster whose key is the tree id (Gala Elves is the realm Gala).
    assert.deepEqual(t.countries, [countryTable().find(c => c.key === id).name]);
    assert.equal(t.focuses.length, e.focuses, `${id} focuses`);
    assert.equal(Object.keys(t.spirits).length, e.spirits, `${id} spirits`);
    assert.equal(Object.keys(t.events).length, e.events, `${id} events`);
    assert(t.focuses.length >= 80 && t.focuses.length <= 140, `${id} is in the major range`);
    const { pos } = absolutePositions(t);
    const xs = [...pos.values()].map(p => p.x), ys = [...pos.values()].map(p => p.y);
    assert.equal(Math.min(...xs), 0); assert.equal(Math.max(...xs), e.x, `${id} width`);
    assert.equal(Math.min(...ys), 0); assert.equal(Math.max(...ys), e.y, `${id} depth`);
    assert.equal(new Set([...pos.values()].map(p => `${p.x},${p.y}`)).size, e.focuses, `${id} positions are unique`);
  }
});

test('Focus ids, prerequisites and exclusives resolve and are symmetric', () => {
  for (const t of clean.list) {
    const keys = new Set(t.focuses.map(f => f.key)), { pos } = absolutePositions(t);
    assert.equal(keys.size, t.focuses.length, `${t.id}: keys are unique`);
    for (const f of t.focuses) {
      for (const g of f.prerequisite ?? []) for (const k of g) { assert(keys.has(k), `${t.id}.${f.key} needs ${k}`); assert(pos.get(k).y < pos.get(f.key).y, `${f.key} sits below ${k}`); }
      assert.equal(f.days % 7, 0);
    }
    const closure = exclusiveClosure(t);
    for (const [a, b] of EXPECT[t.id].pairs) { assert(closure.get(a).has(b) && closure.get(b).has(a), `${t.id}: ${a} / ${b}`); }
    const out = compiled.get(t.id).files.get(`common/national_focus/zin_${t.id}.txt`);
    assert.equal((out.match(/^\tfocus = \{/gm) ?? []).length, EXPECT[t.id].focuses);
    for (const f of t.focuses) assert(out.includes(`id = zin_${t.id}_${f.key}\n`), `${f.key} is compiled`);
  }
});

test('Each tree matches the table of its spec: key, position and days of every focus', async () => {
  for (const id of IDS) {
    const md = (await readFile(`${ZIN}/docs/specs/05_focus_trees/major/${id}.md`, 'utf8')).split('\n');
    const by = new Map(RAW[id].focuses.map(f => [f.key, f]));
    const seen = new Set();
    for (const line of md) {
      if (!line.startsWith('|')) continue;
      const c = line.split('|').slice(1, -1).map(s => s.trim());
      const key = (c[0] ?? '').replace(/`/g, '');
      const pi = c.findIndex(x => /^\d+,\d+$/.test(x));
      if (c.length < 7 || pi < 0 || !/^[a-z][a-z0-9_]+$/.test(key)) continue;
      const f = by.get(key);
      assert(f, `${id}: the spec lists ${key}`);
      assert.equal(`${f.x},${f.y}`, c[pi], `${id}.${key} position`);
      assert.equal(String(f.days), c[pi + 1].replace(/\D/g, ''), `${id}.${key} days`);
      seen.add(key);
    }
    assert.equal(seen.size, by.size, `${id}: every focus has a row in the spec`);
  }
});

// ------------------------------------------------------------------------------------------------ text and localisation
test('Localisation is complete for every focus, spirit and event, with no empty value', () => {
  for (const t of clean.list) {
    const loc = compiled.get(t.id).loc;
    for (const f of t.focuses) for (const k of [`zin_${t.id}_${f.key}`, `zin_${t.id}_${f.key}_desc`]) assert(typeof loc[k] === 'string' && loc[k].trim().length > 2, `${k} has text`);
    for (const k of Object.keys(t.spirits)) for (const s of [`zin_${t.id}_${k}`, `zin_${t.id}_${k}_desc`]) assert(loc[s]?.trim().length > 2, `${s} has text`);
    for (const [k, ev] of Object.entries(t.events)) {
      const id = `${t.event_namespace ?? `zin_${t.id}`}.${(t.event_base ?? 0) + ev.n}`;
      for (const s of [`${id}.t`, `${id}.d`]) assert(loc[s]?.trim().length > 10, `${s} (${k}) has text`);
      ev.options.forEach((o, i) => assert(loc[`${id}.${'abcdefghijklmnopqrstuvwxyz'[i]}`]?.trim().length > 2, `${id} option ${i + 1} has text`));
    }
    for (const [k, v] of Object.entries(loc)) { assert.equal(typeof v, 'string', k); assert(!/lorem ipsum|TODO|TBD|placeholder/i.test(v), `${k} is real text`); }
  }
});

test('No player text holds a banned or modern word (errors and reviews)', () => {
  let n = 0;
  for (const t of clean.list) for (const [k, v] of Object.entries(compiled.get(t.id).loc)) {
    n++;
    assert.deepEqual(findBanned(readable(v), RULES).map(h => `${h.id}:${h.word}`), [], `${k}: ${v.slice(0, 60)}`);
  }
  assert(n > 1000, 'a large set of texts was scanned');
});

test('The secrets hold: no Afrit or Hidden Council anywhere, and Eindil is named in one gated event only', () => {
  for (const t of clean.list) for (const [k, v] of Object.entries(compiled.get(t.id).loc)) {
    assert.doesNotMatch(v, /Afrit|Hidden Council|demon/i, k);
    if (/Eindil|\bson of Ein\b/i.test(v)) assert.equal(k, 'zin_gala.11.d', 'only the naming event says the name');
  }
  const naming = focus(RAW, 'gala', 'name_in_the_water');
  assert(naming.available.some(c => c.global_flag === 'zin_eindil_named'), 'the focus that fires the naming needs the flag');
  assert.doesNotMatch(compiled.get('aenor').loc.zin_aenor_son_of_ein, /Ein|Eindil/, 'the stranger has no name in a visible focus name');
  assert.doesNotMatch(compiled.get('aenor').loc.zin_aenor_rangers_of_selen_desc + compiled.get('aenor').loc['zin_aenor.506.d'], /Alleria/);
});

test('Texts use Windows-1252 only and the secrets of the lore stay closed', () => {
  for (const t of clean.list) for (const [k, v] of Object.entries(compiled.get(t.id).loc)) {
    for (const ch of v) { const c = ch.codePointAt(0); assert(c <= 0xff || '–—‘’“”'.includes(ch), `${k} holds U+${c.toString(16)}`); }
    assert.doesNotMatch(v, /Hierarch|Einendil|Kusven|\bRush\b|Klinti|Gorbat/, k);
  }
  const gala = Object.values(compiled.get('gala').loc).join(' ');
  assert.doesNotMatch(gala, /kin of the Sunhot|kindred of the Sunhot|related to the Sunhot/i, 'Gala and the Sunhot elves are never called kin');
  assert.doesNotMatch(Object.values(compiled.get('goldoroth').loc).join(' '), /fire (ends|kills|destroys) (the )?(dead|Zol)/i);
});

// ------------------------------------------------------------------------------------------------ mechanics and safety
test('The trees compile deterministically and refuse nothing the mechanics must still write', () => {
  for (const t of clean.list) {
    const again = compileTree(t, clean.ctx), first = compiled.get(t.id);
    assert.deepEqual([...again.files.keys()], [...first.files.keys()]);
    for (const [rel, body] of first.files) assert.equal(again.files.get(rel), body, rel);
    assert.deepEqual(again.loc, first.loc);
    for (const body of first.files.values()) assert(!body.includes('undefined') && !body.includes('NaN'), 'no undefined values');
  }
  for (const id of IDS) assert(compiled.get(id).stats.raw <= 10, `${id} uses at most ten raw blocks`);
  assert.equal(compiled.get('aenor').stats.events, 20);
  assert(compiled.get('aenor').files.get('events/zin_aenor.txt').includes('id = zin_aenor.519'), 'Aenor events use ids 500 to 519');
  assert(!compiled.get('aenor').files.get('events/zin_aenor.txt').includes('id = zin_aenor.499'));
});

test('Every event times out in thirty days and the first-era branches declare no war', () => {
  for (const id of IDS) {
    const ev = compiled.get(id).files.get(`events/zin_${id}.txt`);
    const n = (ev.match(/^country_event = \{/gm) ?? []).length;
    assert.equal((ev.match(/timeout_days = 30/g) ?? []).length, n);
  }
  const wars = t => t.focuses.filter(f => JSON.stringify(f.effects ?? []).includes('"wargoal"')).map(f => f.key);
  assert.deepEqual(wars(RAW.gala), [], 'Gala never makes a war goal');
  assert.equal(JSON.stringify(RAW.gala).includes('claims_on'), false);
  assert.deepEqual(wars(RAW.aenor), ['pacify_bloody_forest']);
  assert.equal(focus(RAW, 'aenor', 'pacify_bloody_forest').ai.base, 0, 'no first-era war for the AI');
  for (const k of wars(RAW.coldor)) assert(['isengard_must_kneel'].includes(k));
  assert.equal(focus(RAW, 'goldoroth', 'the_long_grudge').available[0].after, '1750.1.1');
});

test('Branch roots follow the branch rules of the specs', () => {
  const needs = (tree, key, test) => assert(JSON.stringify(focus(RAW, tree, key).available).includes(test), `${tree}.${key} needs ${test}`);
  needs('aenor', 'regency_of_gold', 'zin_aenor_ruled_by_court');
  needs('aenor', 'hold_parim', 'zin_aenor_ruled_by_faithful');
  needs('aenor', 'seals_of_government', 'zin_aenor_ruled_by_faithful');
  needs('aenor', 'the_concord_stands', 'zin_aenor_ruled_by_faithful');
  needs('aenor', 'send_for_the_stranger', 'zin_aenor_ruled_by_captains');
  needs('aenor', 'retake_parim', 'zin_aenor_parim_lost');
  needs('aenor', 'poison_in_the_cup', 'zin_golden_king_plot_exposed');
  needs('aenor', 'a_kingdom_of_ruins', 'zin_eindil_crowned');
  needs('gala', 'king_has_fallen', 'zin_lorien_dead');
  needs('gala', 'stranger_from_islands', 'zin_gala_stage_5');
  needs('goldoroth', 'hour_of_the_black_iron', 'zin_goldoroth_war_open');
  needs('goldoroth', 'dead_on_the_dark_shore', 'zin_zol_rising');
  needs('coldor', 'the_world_beyond_the_ice', 'zin_war_of_last_crowns');
  assert.deepEqual(focus(RAW, 'coldor', 'the_empty_hall').allow_branch, [{ global_flag: 'zin_horos_dead' }]);
  assert.deepEqual(focus(RAW, 'coldor', 'word_from_the_far_ice').allow_branch, [{ global_flag: 'zin_eindil_awake' }]);
  assert.equal(focus(RAW, 'gala', 'king_has_fallen').prerequisite, undefined, 'After the King is free-standing');
});

test('Calls with keywords compile to their codes', () => {
  const g = compiled.get('goldoroth').files.get('common/national_focus/zin_goldoroth.txt');
  assert.match(g, /set_temp_variable = \{ zin_arg_bloc = 3 \}\n\t+set_temp_variable = \{ zin_arg_value = 10 \}\n\t+zin_goldoroth_add_favour = yes/);
  assert.match(g, /set_temp_variable = \{ zin_arg_target = -1 \}/);
  const a = compiled.get('aenor').files.get('common/national_focus/zin_aenor.txt');
  assert.match(a, /set_temp_variable = \{ zin_arg_camp = 4 \}\n\t+set_temp_variable = \{ zin_arg_value = 15 \}\n\t+zin_aenor_add_camp_support = yes/);
  assert.match(a, /set_temp_variable = \{ zin_arg_charter = 3 \}\n\t+zin_aenor_set_charter_all = yes/);
  const s = compiled.get('gala').files.get('common/national_focus/zin_gala.txt');
  assert.match(s, /set_temp_variable = \{ zin_arg_sight = 1 \}\n\t+zin_sun_mirror_vision = yes/);
});

// ------------------------------------------------------------------------------------------------ negative tests
test('Negative: a trigger no module writes fails the build', async () => {
  await failsWith(r => focus(r, 'aenor', 'the_golden_court').available = [{ check: 'zin_aenor_no_such_trigger' }], 'trigger_unresolved');
  await failsWith(r => focus(r, 'gala', 'kings_ships').effects.push({ call: 'zin_gala_no_such_effect' }), 'effect_unresolved');
});

test('Negative: the registry rows are needed (the mechanics are not built yet)', async () => {
  const a = await analyse(null, { registry: registryData({}) });
  const codesFound = new Set(a.problems.map(p => p.code));
  for (const c of ['effect_unresolved', 'trigger_unresolved', 'flag_unresolved', 'event_unresolved', 'allow_branch_changing']) assert(codesFound.has(c), c);
  const b = await analyse(null, { withCodes: false });
  assert(b.problems.some(p => p.code === 'call_keyword_nocode' && /zin_goldoroth_add_favour/.test(p.message)), 'Goldoroth keyword codes need the zin_goldoroth_ prefix on the dark_lands owner');
});

test('Negative: duplicate keys, positions and missing prerequisites fail', async () => {
  await failsWith(r => r.coldor.focuses.push({ ...focus(r, 'coldor', 'winter_crown') }), 'duplicate_key');
  await failsWith(r => { const f = focus(r, 'gala', 'kings_audiences'); f.x = 2; f.y = 1; }, 'duplicate_position');
  await failsWith(r => { focus(r, 'goldoroth', 'war_pits').prerequisite = [['no_such_focus']]; }, 'prerequisite_missing');
  await failsWith(r => { focus(r, 'aenor', 'royal_mint').prerequisite = [['crown_purse']]; }, 'prerequisite_above');
  await failsWith(r => { focus(r, 'aenor', 'royal_mint').mutually_exclusive = ['no_such_focus']; }, 'exclusive_missing');
  await failsWith(r => { focus(r, 'aenor', 'royal_mint').days = 30; }, 'days_multiple');
  await failsWith(r => { focus(r, 'aenor', 'honest_ledgers').prerequisite = [['royal_mint']]; focus(r, 'aenor', 'royal_mint').prerequisite = [['honest_ledgers']]; }, 'prerequisite_cycle');
  await failsWith(r => { r.gala.spirits.sun_harbour = r.gala.spirits.his_memory; }, 'key_collision');
});

test('Negative: unresolved references of every kind fail', async () => {
  await failsWith(r => focus(r, 'aenor', 'royal_mint').effects.push({ add_spirit: 'no_such_spirit' }), 'spirit_unknown');
  await failsWith(r => focus(r, 'aenor', 'royal_mint').effects.push({ event: 'no_such_event' }), 'event_unknown');
  await failsWith(r => focus(r, 'aenor', 'royal_mint').effects.push({ event: 'zin_nowhere.1' }), 'event_unresolved');
  await failsWith(r => focus(r, 'gala', 'kings_ships').available = [{ flag: 'zin_gala_never_set' }], 'flag_unresolved');
  await failsWith(r => focus(r, 'coldor', 'winter_crown').effects.push({ opinion: { target: 'Horidor', modifier: 'no_such_modifier' } }), 'opinion_unknown');
  await failsWith(r => focus(r, 'goldoroth', 'war_pits').effects.push({ building: { type: 'arms_factory', level: 1, where: 'no_such_site' } }), 'site_unresolved');
  await failsWith(r => focus(r, 'goldoroth', 'war_pits').effects.push({ call: 'zin_goldoroth_diplomacy', args: { act: 'no_such_act' } }), 'call_keyword_nocode');
  await failsWith(r => focus(r, 'goldoroth', 'war_pits').effects.push({ call: 'zin_goldoroth_diplomacy' }), 'call_arg_missing');
  await failsWith(r => { r.coldor.scripted_effects.zin_coldor_recruit.effects.push({ raw: 'set_temp_variable = { zin_arg_undeclared = 1 }' }); }, 'effect_arg_undeclared');
});

test('Negative: art, modifiers and schema errors fail', async () => {
  await failsWith(r => { focus(r, 'aenor', 'royal_mint').icon = 'no_such_icon'; }, 'icon_unknown');
  await failsWith(r => { r.aenor.events.court_feast.picture = 'no_such_picture'; }, 'picture_unknown');
  await failsWith(r => { r.aenor.spirits.gilded_parim.modifier = { not_a_modifier_at_all: 1 }; }, 'modifier_unknown');
  const bad = await analyse(r => { delete focus(r, 'gala', 'kings_ships').desc; });
  assert(bad.problems.some(p => p.code === 'schema' && /desc/.test(p.message)), 'a focus without text is a schema error');
  const empty = await analyse(r => { focus(r, 'gala', 'kings_ships').name = ''; });
  assert(empty.problems.some(p => p.code === 'schema'), 'an empty name is a schema error');
  const unknown = await analyse(r => { focus(r, 'gala', 'kings_ships').wizardry = true; });
  assert(unknown.problems.some(p => p.code === 'schema' && /wizardry/.test(p.message)), 'an unknown field is a schema error');
  await failsWith(r => { r.coldor.countries = ['No Such Realm']; }, 'schema');
});

test('Negative: allow_branch, raw limit and secrets fail', async () => {
  await failsWith(r => { focus(r, 'coldor', 'winter_crown').allow_branch = [{ flag: 'zin_coldor_accord_open' }]; }, 'allow_branch_changing');
  await failsWith(r => { focus(r, 'coldor', 'the_empty_hall').available = []; }, 'allow_branch_not_repeated');
  await failsWith(r => { for (let i = 0; i < 11; i++) focus(r, 'gala', 'kings_ships').effects.push({ raw: `add_stability = 0.0${i}` }); }, 'raw_limit');
  await failsWith(r => { focus(r, 'aenor', 'royal_mint').desc = 'Afrit counts the coins.'; }, 'secret_leak');
  await failsWith(r => { focus(r, 'aenor', 'royal_mint').desc = 'The Hidden Council counts the coins.'; }, 'secret_leak');
  await failsWith(r => { focus(r, 'aenor', 'royal_mint').desc = 'Einendil counts the coins.'; }, 'text_superseded');
  await failsWith(r => { focus(r, 'aenor', 'royal_mint').desc = 'The mint strikes 中 coins.'; }, 'text_charset');
  await failsWith(r => { focus(r, 'aenor', 'royal_mint').desc = 'Counted by Aldis Veleran.'; }, 'retired_name');
});

test('Negative: the banned-word scan catches modern words, real names and platform names', async () => {
  const hit = async text => {
    const a = await analyse(r => { focus(r, 'aenor', 'royal_mint').desc = text; });
    const loc = compileTree(a.list.find(t => t.id === 'aenor'), a.ctx).loc;
    return findBanned(readable(loc.zin_aenor_royal_mint_desc), RULES).map(h => h.word.toLowerCase());
  };
  assert((await hit('The factory builds tanks for the coal trains.')).includes('factory'));
  assert((await hit('Prime ministers meet in the senate.')).length >= 2);
  assert((await hit('A Hearts of Iron veteran from Germany.')).length >= 2);
  assert((await hit('Colour, honour and harbour are the spellings of the lake.')).length === 0);
  assert((await hit('Chancellor Merovan keeps the seals.')).includes('chancellor'), 'the modern title is refused');
});

test('Negative: a tree id that equals a mechanic id or a repeated tree fails', async () => {
  const reg = registryData(); reg.ideas = [...reg.ideas, 'zin_aenor_the_golden_court'];
  await failsWith(null, 'collision_mechanic', { registry: reg });
  const a = await analyseTrees([...IDS.map(id => ({ name: id, data: structuredClone(RAW[id]) })), { name: 'gala', data: structuredClone(RAW.gala) }], new Staged(), { registry: new Registry(registryData()), codes: await codes(), warn: () => {} });
  assert(a.problems.some(p => p.code === 'collision_tree' || p.code === 'coverage_many'), 'the same country twice is refused');
});

test('The registry data names every outside owner the trees depend on, and nothing the trees define', () => {
  for (const kind of ['scripted_effects', 'scripted_triggers', 'events', 'ideas', 'opinion_modifiers', 'flags', 'global_flags', 'characters']) {
    assert(Array.isArray(EXTRA[kind]) && EXTRA[kind].length > 0 || kind === 'faction_templates', kind);
    assert.equal(new Set(EXTRA[kind]).size, EXTRA[kind].length, `${kind} has no duplicate`);
  }
  for (const id of IDS) for (const name of Object.keys(RAW[id].scripted_effects ?? {})) assert(!EXTRA.scripted_effects.includes(name), `${name} is the tree's own`);
  for (const id of IDS) for (const name of Object.keys(RAW[id].scripted_triggers ?? {})) assert(!EXTRA.scripted_triggers.includes(name), `${name} is the tree's own`);
  assert(EXTRA.branch.refreshed_flags.includes('zin_horos_dead'));
  assert.deepEqual(EXTRA.arg_code_prefixes, { dark_lands: ['zin_goldoroth_'] });
  assert(EXTRA.events.every(e => /^zin_[a-z]+\.\d+$/.test(e)));
});

test('The merged registry is a superset of the shared one and loadRegistry still reads the shared file', async () => {
  const shared = await loadRegistry();
  const merged = new Registry(registryData());
  assert(shared.has('global_flags', 'zin_afrit_revealed') || !shared.has('global_flags', 'zin_golden_king_dead'));
  assert(merged.has('global_flags', 'zin_golden_king_dead'));
  assert(merged.has('scripted_effects', 'zin_aenor_add_court_corruption'));
  assert(merged.branch.refreshed_flags.has('zin_eindil_awake') && merged.branch.refreshed_flags.has('zin_horos_dead'));
});
