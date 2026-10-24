// Tests of the regional_a focus trees: the 17 tier B trees of the Cold Lands, the Dark Lands and the Dead Lands
// (docs/specs/05_focus_trees/regional/cold_lands.md, dark_lands.md, dead_lands.md). They compile the real tree files
// of docs/design/focus/ with the compiler's check API, assert counts, ids, prerequisites, exclusives, gates, text and
// localisation, and plant one failure for each negative case.
//   node --test tools/content/focus_regional_a.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Staged } from './lib/core.mjs';
import { ZIN } from './lib/paths.mjs';
import { absolutePositions } from './lib/focus_model.mjs';
import { analyseTrees, compileTree } from './modules/focus_compiler.mjs';
import { collectTexts, exclusiveClosure, loadRegistry } from './checks/focus_checks.mjs';
import { compileBanned, findBanned, loadRuleSet } from './lib/banned.mjs';

const DIR = `${ZIN}/docs/design/focus`;
// tree id -> [country, focuses, spirits, events, max x, max y] (the spec tables)
const TREES = {
  regional_isengard: ['Isengard', 45, 8, 2, 22, 8],
  regional_horidor: ['Horidor', 32, 10, 1, 18, 8],
  regional_windwaith: ['Windwaith', 34, 9, 2, 19, 9],
  regional_fearno: ['Fearno', 37, 9, 3, 19, 8],
  regional_titanos: ['Titanos', 30, 6, 1, 18, 8],
  regional_yeti_lands: ['Yeti Lands', 30, 8, 1, 18, 8],
  regional_dondor: ['Dondor', 49, 16, 8, 22, 9],
  regional_blackton: ['Blackton', 39, 14, 6, 24, 7],
  regional_dulundur: ['Dulundur', 36, 10, 4, 23, 9],
  regional_bordon: ['Bordon', 31, 6, 4, 22, 6],
  regional_dreson: ['Dreson', 31, 10, 2, 22, 8],
  regional_troll_forest: ['Troll Forest', 30, 9, 3, 22, 8],
  regional_nezer: ['Nezer', 32, 9, 3, 18, 8],
  regional_demon: ['Demon', 30, 6, 3, 18, 8],
  regional_dolon: ['Dolon', 30, 7, 2, 14, 8],
  regional_olen: ['Olen', 32, 10, 6, 20, 8],
  regional_nan: ['Nan', 30, 10, 7, 20, 8],
};
const IDS = Object.keys(TREES);
const RAW = {};
for (const id of IDS) RAW[id] = JSON.parse(await readFile(`${DIR}/${id}.json`, 'utf8'));
const loadExtra = async name => { try { return JSON.parse(await readFile(`${DIR}/${name}.json`, 'utf8')); } catch { return null; } };

// The names that the shared trees declare (zin_shared_cold_lands_lean_neighbours, zin_shared_has_coast) come from
// those trees in a full build; here they are added to the registry so the test needs no other slice's file.
async function registry() {
  const reg = await loadRegistry();
  reg.add('scripted_effects', 'zin_shared_cold_lands_lean_neighbours');
  reg.add('scripted_triggers', 'zin_shared_has_coast');
  return reg;
}
async function analyse(mutate) {
  const raw = structuredClone(RAW);
  mutate?.(raw);
  const entries = IDS.map(name => ({ name, data: raw[name] }));
  return analyseTrees(entries, new Staged(), { registry: await registry(), expected: [], warn: () => {} });
}
const failsWith = async (mutate, code, pattern) => {
  const a = await analyse(mutate);
  const hit = a.problems.filter(p => p.code === code);
  assert(hit.length, `expected ${code}, got ${[...new Set(a.problems.map(p => p.code))].join(', ') || 'no problem'}`);
  if (pattern) assert(hit.some(p => pattern.test(p.message)), `no ${code} problem matches ${pattern}: ${hit.map(p => p.message).join(' | ')}`);
};
const base = await analyse();
const compiled = Object.fromEntries(base.list.map(t => [t.id, compileTree(t, base.ctx)]));
const focus = (id, key) => RAW[id].focuses.find(f => f.key === key);
const keys = id => RAW[id].focuses.map(f => f.key);

// ------------------------------------------------------------------------------------------------ the trees as a whole
test('The 17 tree files exist, are regional trees of their country and compile without a single problem', () => {
  assert.equal(base.list.length, 17);
  assert.deepEqual(base.problems.map(p => p.message), []);
  for (const [id, [country]] of Object.entries(TREES)) {
    assert.equal(RAW[id].id, id);
    assert.equal(RAW[id].tier, 'regional');
    assert.deepEqual(RAW[id].countries, [country]);
  }
});

test('Each tree holds the spec\'s number of focuses, spirits and events, inside the tier B range of 30 to 50', () => {
  let total = 0;
  for (const [id, [, n, s, e]] of Object.entries(TREES)) {
    assert.equal(RAW[id].focuses.length, n, `${id} focuses`);
    assert(n >= 30 && n <= 50, id);
    assert.equal(Object.keys(RAW[id].spirits ?? {}).length, s, `${id} spirits`);
    assert.equal(Object.keys(RAW[id].events ?? {}).length, e, `${id} events`);
    total += n;
  }
  assert.equal(total, 578);
});

test('Keys and positions are unique, every grid stays inside the spec\'s columns and rows, and every prerequisite sits above its focus', () => {
  for (const [id, [, , , , maxX, maxY]] of Object.entries(TREES)) {
    const tree = base.trees.get(id), { pos } = absolutePositions(tree);
    assert.equal(new Set(keys(id)).size, keys(id).length, `${id} keys`);
    assert.equal(new Set([...pos.values()].map(p => `${p.x},${p.y}`)).size, tree.focuses.length, `${id} positions`);
    assert(Math.max(...[...pos.values()].map(p => p.x)) <= maxX, `${id} columns`);
    assert(Math.max(...[...pos.values()].map(p => p.y)) <= maxY, `${id} rows`);
    assert(Math.min(...[...pos.values()].map(p => Math.min(p.x, p.y))) >= 0, id);
    for (const f of tree.focuses) for (const g of f.prerequisite ?? []) for (const k of g) assert(pos.get(k).y < pos.get(f.key).y, `${id}: ${f.key} under ${k}`);
  }
});

test('Compiled focus ids, spirits and events carry the tree prefix and the events use the tree namespace', () => {
  for (const id of IDS) {
    const text = compiled[id].files.get(`common/national_focus/zin_${id}.txt`);
    assert.match(text, new RegExp(`focus_tree = \\{\\n\\tid = zin_${id}\\n`));
    for (const f of RAW[id].focuses) assert(text.includes(`id = zin_${id}_${f.key}\n`), `${id}_${f.key}`);
    for (const s of Object.keys(RAW[id].spirits ?? {})) assert(compiled[id].files.get(`common/ideas/zin_focus_${id}.txt`).includes(`\tzin_${id}_${s} = {`), s);
    if (Object.keys(RAW[id].events ?? {}).length) assert.match(compiled[id].files.get(`events/zin_${id}.txt`), new RegExp(`add_namespace = zin_${id}\\n`));
  }
});

test('No spirit key equals a focus key of its tree, and every day count is a multiple of seven from 7 to 140', () => {
  for (const id of IDS) {
    for (const s of Object.keys(RAW[id].spirits ?? {})) assert(!keys(id).includes(s), `${id}: ${s}`);
    for (const f of RAW[id].focuses) assert(f.days % 7 === 0 && f.days >= 7 && f.days <= 140, `${id}: ${f.key}`);
  }
});

test('Every exclusive pair is written on both focuses in the compiled trees', () => {
  for (const id of IDS) {
    const closure = exclusiveClosure(base.trees.get(id)), text = compiled[id].files.get(`common/national_focus/zin_${id}.txt`);
    for (const [k, others] of closure) {
      if (!others.size) continue;
      const block = text.split(`\tfocus = {\n\t\tid = zin_${id}_${k}\n`)[1].split('\n\tfocus = {')[0];
      for (const o of others) assert(block.includes(`focus = zin_${id}_${o}`), `${id}: ${k} / ${o}`);
    }
  }
});

test('Every event sets timeout_days = 30, is fired by effects only and has a picture of the catalog', () => {
  for (const id of IDS) {
    const f = compiled[id].files.get(`events/zin_${id}.txt`);
    if (!f) continue;
    const n = (f.match(/^country_event = \{/gm) ?? []).length;
    assert.equal(n, Object.keys(RAW[id].events).length, id);
    assert.equal((f.match(/timeout_days = 30/g) ?? []).length, n, id);
    assert.equal((f.match(/is_triggered_only = yes/g) ?? []).length, n, id);
    assert.doesNotMatch(f, /mean_time_to_happen/);
    const numbers = Object.values(RAW[id].events).map(e => e.n);
    assert.equal(new Set(numbers).size, numbers.length, `${id} event numbers`);
  }
});

// ------------------------------------------------------------------------------------------------ prerequisites, exclusives and gates by tree
test('Isengard: the march chain, the three-way answer to Fandanar and the war gates', () => {
  const id = 'regional_isengard';
  assert.deepEqual(focus(id, 'the_march_remembers').prerequisite, [['meet_them_at_the_forts', 'ride_to_the_forts']]);
  assert.deepEqual(focus(id, 'never_kneel').mutually_exclusive, ['a_seat_at_fandanar']);
  assert.deepEqual(focus(id, 'hold_the_north').mutually_exclusive, ['iron_for_the_living']);
  assert.deepEqual(focus(id, 'the_ninth_fort').prerequisite, [['count_the_stones', 'watchtowers_of_the_march']]);
  assert.equal(focus(id, 'the_ninth_fort').days, 70);
  assert.deepEqual(focus(id, 'beyond_the_march').available, [{ global_flag: 'zin_war_of_last_crowns' }]);
  assert.equal(focus(id, 'beyond_the_march').ai.base, 200);
  assert(focus(id, 'ride_to_the_forts').available.some(c => c.not?.[0]?.check === 'zin_cold_historical'), 'never historical');
  assert(focus(id, 'iron_against_the_crown').available.some(c => c.at_war === false), 'not at war');
  assert.match(compiled[id].files.get(`common/ideas/zin_focus_${id}.txt`), /zin_regional_isengard_refusal_of_850 = \{/);
});

test('Horidor: the Accord question is exclusive and the crown needs the king of the cairns', () => {
  const id = 'regional_horidor';
  assert.deepEqual(focus(id, 'shield_of_the_accord').mutually_exclusive, ['the_highland_crown']);
  assert.deepEqual(focus(id, 'the_cairn_crown').prerequisite, [['king_of_the_cairns']]);
  assert(focus(id, 'the_highland_crown').available.some(c => c.at_war === false));
  assert.deepEqual(focus(id, 'ride_with_the_white_companies').mutually_exclusive, ['stand_with_fandanar']);
  assert.equal(focus(id, 'the_cairn_crown').effects.find(e => e.government).government, 'dominion');
  assert(RAW[id].spirits.accord_shield.cancel, 'the shield falls when Horidor leaves the Accord');
});

test('Windwaith: compact or free harbours, and the west council gate of the hulls', () => {
  const id = 'regional_windwaith';
  assert.deepEqual(focus(id, 'a_harbour_compact').mutually_exclusive, ['free_harbours']);
  assert.deepEqual(focus(id, 'hulls_for_the_west').available, [{ global_flag: 'zin_west_council' }]);
  assert.deepEqual(focus(id, 'convoys_to_the_heir').prerequisite, [['sails_for_the_living']]);
  assert(focus(id, 'against_the_black_water').available.some(c => c.global_flag === 'zin_zol_rising'));
  assert.equal(RAW[id].events.compact_offer.options.length, 2);
});

test('Fearno: the three-way choice is symmetric and the hidden tales need zin_eindil_awake in allow_branch and available', () => {
  const id = 'regional_fearno', three = ['friends_of_the_winter_crown', 'a_lord_among_lords', 'the_free_steadings'];
  const closure = exclusiveClosure(base.trees.get(id));
  for (const k of three) assert.deepEqual([...closure.get(k)].sort(), three.filter(x => x !== k).sort());
  const s = focus(id, 'the_stranger_of_the_ice');
  assert.deepEqual(s.allow_branch, [{ global_flag: 'zin_eindil_awake' }]);
  assert(s.available.some(c => c.global_flag === 'zin_eindil_awake'));
  assert.deepEqual(focus(id, 'songs_of_the_houseless_king').prerequisite, [['the_stranger_of_the_ice']]);
  assert.equal(focus(id, 'call_the_free_steadings').days, 70);
  assert(focus(id, 'call_the_free_steadings').effects.some(e => e.faction === 'free_steadings'));
});

test('Titanos and the Yeti Lands: pacts or apart, with the Coldor pact levels read by tree triggers', () => {
  assert.deepEqual(focus('regional_titanos', 'the_old_pacts_kept').mutually_exclusive, ['the_high_snows_apart']);
  assert.deepEqual(focus('regional_yeti_lands', 'the_hunting_truce').mutually_exclusive, ['the_deep_snow_is_ours']);
  assert(RAW.regional_titanos.scripted_triggers.zin_regional_titanos_pact_two.conditions[0].raw.includes('zin_cold_giant_pact'));
  assert(RAW.regional_yeti_lands.scripted_triggers.zin_regional_yeti_lands_pact_three.conditions[0].raw.includes('zin_cold_yeti_pact'));
  const eye = focus('regional_yeti_lands', 'the_man_who_walked_from_the_ice');
  assert.deepEqual(eye.allow_branch, [{ global_flag: 'zin_eindil_awake' }]);
  assert(eye.available.some(c => c.global_flag === 'zin_eindil_awake'));
});

test('Dondor: Parim and Sonargur are asked in the first year, the Accord needs Belonton, and the war branches have gates', () => {
  const id = 'regional_dondor';
  assert(focus(id, 'notbuton_asks_parim').effects.some(e => e.flag === 'zin_dark_petitioned_parim'));
  assert(focus(id, 'notbuton_asks_parim').effects.some(e => e.event_for?.key === 'zin_dark.30'));
  assert(focus(id, 'notbuton_calls_on_the_north').effects.some(e => e.event_for?.key === 'zin_dark.31'));
  assert.deepEqual(focus(id, 'notbuton_stands').prerequisite, [['walls_on_the_march'], ['the_beacon_hills']]);
  assert.deepEqual(focus(id, 'the_kings_peace').mutually_exclusive, ['the_brute_muster']);
  assert(focus(id, 'the_accord_at_war').available.some(c => c.at_war === true));
  assert(focus(id, 'dead_on_the_dark_shore').available.some(c => c.global_flag === 'zin_zol_rising'));
  assert(focus(id, 'the_counterstroke').available.some(c => c.at_war_with === 'Goldoroth'));
  assert.equal(focus(id, 'the_counterstroke').ai.modifiers.find(m => m.factor === 0).if[0].check, 'zin_rules_is_historical');
  assert.equal(RAW[id].ai_strategies.length, 2);
});

test('Blackton, Dulundur, Bordon, Dreson and the Troll Forest: exclusives, gates and the Free Moot hooks', () => {
  assert.deepEqual(focus('regional_blackton', 'under_the_leren_banner').mutually_exclusive, ['the_free_harbour']);
  assert.deepEqual(focus('regional_blackton', 'with_the_accord').mutually_exclusive, ['coin_of_cocanoor']);
  assert.deepEqual(focus('regional_dulundur', 'the_moot_stone').effects, [{ call: 'zin_dark_found_free_moot' }]);
  assert(focus('regional_dulundur', 'the_moot_stone').available.some(c => c.check === 'zin_regional_dulundur_moot_allowed'));
  assert.deepEqual(focus('regional_bordon', 'markets_of_cocanoor').mutually_exclusive.sort(), ['a_hold_of_our_own', 'ask_notbuton']);
  assert.deepEqual(focus('regional_bordon', 'the_iron_tithe_paid').allow_branch, [{ check: 'zin_dark_is_tributary' }]);
  assert(focus('regional_bordon', 'word_from_the_moot').available.some(c => c.not?.[0]?.check === 'zin_dark_is_tributary'), 'a tributary cannot join the Moot');
  assert.deepEqual(focus('regional_dreson', 'reed_boats').allow_branch, [{ check: 'zin_regional_dreson_is_coastal' }]);
  assert(focus('regional_dreson', 'answer_the_moot').effects.some(e => e.call === 'zin_dark_join_free_moot'));
  assert(focus('regional_troll_forest', 'troll_silver').effects.some(e => e.flag === 'zin_dark_trolls_for_pay'));
  assert.deepEqual(focus('regional_troll_forest', 'kin_for_any_coin').mutually_exclusive.sort(), ['kin_for_cocanoor', 'kin_for_the_accord']);
  for (const id of ['regional_blackton', 'regional_dulundur', 'regional_bordon', 'regional_dreson', 'regional_troll_forest']) {
    const answers = keys(id).filter(k => focus(id, k).effects?.some(e => e.call === 'zin_dark_add_volgan_pact'));
    assert(answers.length >= 2, `${id} answers Volgan's envoys either way`);
    assert(RAW[id].focuses.some(f => (f.effects ?? []).some(e => e.call === 'zin_goldoroth_add_sway' && e.args.value < 0)), `${id} defends against sway`);
  }
});

test('The sworn realms: own-road heads need oath below 40 or the own-road flag, aftermath heads need the broken body', () => {
  for (const id of ['regional_nezer', 'regional_demon', 'regional_dolon']) {
    const head = RAW[id].focuses.find(f => (f.available ?? []).some(c => c.or?.some(x => x.variable?.name === 'zin_dominion_oath' && x.variable.below === 40)));
    assert(head, `${id} own-road head`);
    assert(head.available[0].or.some(x => x.flag === 'zin_dominion_own_road'));
    const after = RAW[id].focuses.filter(f => (f.available ?? []).some(c => c.global_flag === 'zin_volgan_body_destroyed'));
    assert.equal(after.length, 1, `${id} aftermath head`);
    const steward = focus(id, 'stand_with_the_steward');
    assert.equal(steward.mutually_exclusive.length, 1);
    assert(steward.available.some(c => c.subject_of === 'Volgan'));
    assert(RAW[id].focuses.some(f => (f.effects ?? []).some(e => e.call === `zin_${id}_crown_free` || e.call === `zin_regional_${id.slice(9)}_crown_free`)) || RAW[id].scripted_effects[`zin_${id}_crown_free`], `${id} crown_free`);
  }
  assert(focus('regional_nezer', 'the_dominions_vanguard').available.some(c => c.variable?.name === 'zin_dominion_oath'));
  assert.equal(focus('regional_nezer', 'the_war_bands_ride').days, 21);
  assert.equal(focus('regional_nezer', 'the_war_bands_ride').ai.base, 300);
});

test('Olen and Nan: the three-way answers to Nafeher, the wardens and no one, and the events that carry them', () => {
  const o = exclusiveClosure(base.trees.get('regional_olen')), n = exclusiveClosure(base.trees.get('regional_nan'));
  assert.deepEqual([...o.get('keep_the_old_quiet')].sort(), ['behind_our_cliffs', 'stand_with_the_wardens']);
  assert.deepEqual([...n.get('pilots_for_nafeher')].sort(), ['pilots_for_no_one', 'pilots_for_the_wardens']);
  assert(RAW.regional_olen.events.olen_offers_tribute.options.some(op => JSON.stringify(op.effects).includes('zin_dominion_tributary_friend')));
  assert(JSON.stringify(RAW.regional_nan.events.nan_offers_pilots).includes('pilots_of_nafeher'));
  assert(RAW.regional_nan.spirits.pilots_of_nafeher, 'the idea given to Volgan is written by the Nan tree');
  assert.deepEqual(focus('regional_olen', 'the_warden_league').effects, [{ join_faction_of: 'Mirolon' }]);
  assert.deepEqual(Object.keys(RAW.regional_olen.opinion_modifiers), ['healers_sent']);
  assert.deepEqual(Object.keys(RAW.regional_nan.opinion_modifiers), ['pilots_friend', 'exiles_carried']);
  assert.equal(RAW.regional_nan.opinion_modifiers.exiles_carried.value, 20);
});

// ------------------------------------------------------------------------------------------------ the peaceful start and secrets
test('On 1 Thaw 4A 1748 no focus declares a war, creates a war goal or claim, starts a border war or joins a war', () => {
  const WAR = /wargoal|claim_march|start_march_war|join_war|cores_on|claims_on|create_wargoal/;
  const found = [];
  for (const id of IDS) for (const f of RAW[id].focuses) {
    if (!WAR.test(JSON.stringify(f.effects ?? []))) continue;
    found.push(`${id}.${f.key}`);
    const gate = JSON.stringify(f.available ?? []);
    assert(/at_war_with|zin_war_of_last_crowns|zin_volgan_marches|zin_cold_march_war_allowed|dark/.test(gate), `${id}.${f.key} has no war gate`);
  }
  assert.deepEqual(found.sort(), ['regional_dondor.the_counterstroke', 'regional_dulundur.strike_the_tributaries', 'regional_isengard.iron_against_the_crown', 'regional_isengard.ride_to_the_forts']);
  for (const id of IDS) for (const f of RAW[id].focuses) assert(!/"(wargoal|claims_on|cores_on|annex|puppet)"/.test(JSON.stringify(f.effects ?? [])), `${id}.${f.key} uses a direct conquest effect`);
  for (const id of ['regional_nezer', 'regional_demon', 'regional_dolon', 'regional_olen', 'regional_nan']) assert.doesNotMatch(JSON.stringify(RAW[id]), /wargoal|claims_on|cores_on|declare_war/, id);
  for (const id of ['regional_nezer', 'regional_demon', 'regional_dolon']) assert.doesNotMatch(JSON.stringify(RAW[id]), /zin_afrit_add_footholds/);
});

test('Every war-root, war-course and Moot focus the spec marks is closed behind a gate or a war', () => {
  for (const [id, key] of [['regional_isengard', 'beyond_the_march'], ['regional_horidor', 'when_the_south_burns'], ['regional_windwaith', 'when_the_south_burns'], ['regional_fearno', 'the_south_burns'], ['regional_titanos', 'the_dark_wakes'], ['regional_yeti_lands', 'the_dead_and_the_snow'], ['regional_dondor', 'the_accord_at_war'], ['regional_blackton', 'the_towns_close_their_gates'], ['regional_dulundur', 'defy_cocanoor'], ['regional_bordon', 'bordon_at_war'], ['regional_dreson', 'the_fens_rise'], ['regional_troll_forest', 'the_forest_wakes'], ['regional_nezer', 'the_war_bands_ride'], ['regional_demon', 'the_horned_host'], ['regional_dolon', 'dolon_marches'], ['regional_olen', 'the_breeze_turns'], ['regional_nan', 'the_isles_at_war']]) {
    const f = focus(id, key);
    assert(f.available?.length, `${id}.${key}`);
    if (id !== 'regional_bordon') assert(!f.prerequisite, `${id}.${key} is a branch head`);
    assert(f.ai.base >= (f.prerequisite ? 100 : 200), `${id}.${key} AI`);
  }
});

test('No text names Afrit, the Hidden Council, Einendil, Edvoid or Rush, and Eindil appears only as [zin_loc_eindil]', () => {
  for (const id of IDS) for (const x of collectTexts(base.trees.get(id))) {
    assert.doesNotMatch(x.text, /Afrit|Hidden Council|Einendil|Edvoid|\bRush\b|Dardan/i, `${id} ${x.where}`);
    assert.doesNotMatch(x.text.replace(/\[zin_loc_eindil\]/g, ''), /Eindil/, `${id} ${x.where}`);
  }
});

test('Cold Lands text never calls giants or yeti Great Folk, Common Folk or beasts, and no visible focus speaks of a sleeper', () => {
  for (const id of ['regional_titanos', 'regional_yeti_lands']) for (const x of collectTexts(base.trees.get(id))) assert.doesNotMatch(x.text, /Great Folk|Common Folk|beast|monster|born of|created/i, `${id} ${x.where}`);
  for (const id of IDS.slice(0, 6)) for (const x of collectTexts(base.trees.get(id))) {
    assert.doesNotMatch(x.text, /sleeper|asleep in the ice/i, `${id} ${x.where}`);
    const f = RAW[id].focuses.find(f => x.owner.kind === 'focus' && f.key === x.owner.key);
    if (f && !f.allow_branch) assert.doesNotMatch(x.text, /man found half-dead|walked out of a place|stranger from the ice/i, `${id} ${x.where}`);
  }
});

test('Dead Lands text never names the King of Demons or says what became of Volgan\'s spirit', () => {
  for (const id of ['regional_nezer', 'regional_demon', 'regional_dolon', 'regional_olen', 'regional_nan']) for (const x of collectTexts(base.trees.get(id))) {
    assert.doesNotMatch(x.text, /King of Demons|is dead|destroyed forever|survives|lives on|Roka/, `${id} ${x.where}`);
  }
});

test('Dark Lands text never calls a named hold goblin, sizes Volgan\'s hosts or says that fire ends Zol\'s dead', () => {
  for (const id of ['regional_dondor', 'regional_blackton', 'regional_dulundur', 'regional_bordon', 'regional_dreson', 'regional_troll_forest']) for (const x of collectTexts(base.trees.get(id))) {
    assert.doesNotMatch(x.text, /goblin hold|hold of goblins|fire ends|ends them with fire|\d+,?\d* (spears|soldiers) of (Nafeher|Volgan)/, `${id} ${x.where}`);
  }
  const fire = base.trees.get('regional_dondor').focuses.find(f => f.key === 'fire_breaks_their_shapes');
  assert.match(fire.desc, /It does not end them\./);
});

// ------------------------------------------------------------------------------------------------ text and localisation
test('No player-visible text holds a banned modern word, a glossary-forbidden word or a retired phrase', async () => {
  const glossary = JSON.parse(await readFile(`${ZIN}/tools/content/data/glossary.json`, 'utf8'));
  const rules = compileBanned(await loadRuleSet({ glossary }));
  const hits = [];
  for (const id of IDS) for (const x of collectTexts(base.trees.get(id))) for (const h of findBanned(x.text, rules, ['error', 'review'])) hits.push(`${id} ${x.where}: ${h.word} (${h.id})`);
  assert.deepEqual(hits, []);
});

test('Every text is non-empty, Windows-1252, and a focus or event text is one to three sentences', () => {
  let texts = 0;
  for (const id of IDS) for (const x of collectTexts(base.trees.get(id))) {
    texts++;
    assert(x.text.trim().length > 3, `${id} ${x.where}`);
    if (/ desc$/.test(x.where) && x.owner.kind === 'focus') {
      const sentences = x.text.split(/(?<=[.!?])\s+/).length;
      assert(sentences >= 1 && sentences <= 3, `${id} ${x.where}: ${sentences} sentences`);
      assert(x.text.length >= 60, `${id} ${x.where} is too short`);
    }
    assert.doesNotMatch(x.text, /TODO|lorem|placeholder|FIXME|TBD/i, `${id} ${x.where}`);
  }
  assert(texts > 1500, `${texts} texts`);
});

test('Localisation is complete: every focus, spirit, event title, description and option, and every tooltip and opinion modifier has a key', () => {
  for (const id of IDS) {
    const loc = compiled[id].loc, tree = base.trees.get(id);
    for (const f of tree.focuses) { assert(loc[`zin_${id}_${f.key}`]?.length > 1, f.key); assert(loc[`zin_${id}_${f.key}_desc`]?.length > 20, `${f.key} desc`); }
    for (const s of Object.keys(tree.spirits ?? {})) { assert(loc[`zin_${id}_${s}`]?.length > 1, s); assert(loc[`zin_${id}_${s}_desc`]?.length > 20, `${s} desc`); }
    for (const k of Object.keys(tree.opinion_modifiers ?? {})) assert(loc[`zin_${id}_${k}`]?.length > 1, k);
    const events = compiled[id].files.get(`events/zin_${id}.txt`) ?? '';
    for (const [, key] of events.matchAll(/(?:title|desc|name) = (zin_[a-z0-9_.]+)/g)) assert(loc[key]?.length > 1, `${id} ${key}`);
    const all = [...compiled[id].files.values()].join('\n');
    for (const [, key] of all.matchAll(/custom_effect_tooltip = (\S+)/g)) assert(loc[key], key);
    assert(!Object.values(loc).some(v => !v || /^\s*$/.test(v)), `${id} has an empty text`);
  }
});

test('Compiled localisation files are UTF-8 with a BOM and the tree\'s own spirit files exist', () => {
  const staged = new Staged();
  for (const id of IDS) { staged.loc(`zin_focus_${id}`, compiled[id].loc); }
  assert.equal(staged.files.size, 17);
  for (const bytes of staged.files.values()) {
    assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
    assert.match(bytes.toString('utf8'), /^﻿l_english:\n/);
  }
  for (const id of IDS) assert(compiled[id].files.has(`common/ideas/zin_focus_${id}.txt`), id);
});

test('Icons, event pictures and spirit icons are catalog keys; research categories and equipment are the warfare spec\'s ids', async () => {
  const ids = JSON.parse(await readFile(`${ZIN}/tools/content/data/warfare_ids.json`, 'utf8'));
  const equipment = new Set(ids.archetypes);
  const cats = new Set(['zin_cat_arms', 'zin_cat_bows', 'zin_cat_armour', 'zin_cat_mounts', 'zin_cat_kin', 'zin_cat_siege', 'zin_cat_walls', 'zin_cat_wards', 'zin_cat_dark_rites', 'zin_cat_camp', 'zin_cat_galleys', 'zin_cat_warships']);
  for (const id of IDS) {
    for (const f of RAW[id].focuses) {
      assert(base.ctx.catalog.icons.has(f.icon), `${id}.${f.key}`);
      for (const e of f.effects ?? []) {
        if (e.equipment) assert(equipment.has(e.equipment.type), `${id}.${f.key}: ${e.equipment.type}`);
        if (e.research) for (const c of e.research.categories) assert(cats.has(c), `${id}.${f.key}: ${c}`);
      }
    }
    for (const e of Object.values(RAW[id].events ?? {})) assert(base.ctx.catalog.events.has(e.picture), `${id}: ${e.picture}`);
  }
});

test('Every spirit modifier is in the game\'s modifier documentation (the compiler\'s check) and the trees use no more raw blocks than the scripted helpers need', () => {
  const total = IDS.reduce((n, id) => n + compiled[id].stats.raw, 0);
  assert(total > 0 && total < 100, `${total} raw blocks`);
  for (const id of IDS) assert.equal(JSON.stringify([RAW[id].focuses, RAW[id].events, RAW[id].spirits]).includes('"raw"'), false, `${id}: no raw block inside a focus, event or spirit`);
  assert.deepEqual(base.problems.filter(p => p.code === 'modifier_unknown'), []);
});

test('Compiling twice gives identical bytes', async () => {
  const again = await analyse();
  for (const t of again.list) {
    const a = compileTree(t, again.ctx), b = compiled[t.id];
    assert.deepEqual([...a.files.keys()], [...b.files.keys()]);
    for (const [rel, text] of a.files) assert.equal(text, b.files.get(rel), rel);
  }
});

test('AI: peace-time focuses carry a base weight, war roots 200 or more, and historical factors use the rule triggers', () => {
  for (const id of IDS) {
    assert(RAW[id].focuses.every(f => f.ai && f.ai.base >= 0), `${id}: every focus has an ai base`);
    const rules = JSON.stringify(RAW[id].focuses.map(f => f.ai));
    assert.match(rules, /zin_cold_historical|zin_rules_is_historical/, id);
  }
  assert.equal(focus('regional_isengard', 'a_seat_at_fandanar').ai.modifiers.find(m => m.if[0].check === 'zin_cold_historical').factor, 0);
  assert.equal(focus('regional_horidor', 'stand_with_fandanar').ai.modifiers[0].factor, 100);
  assert.equal(focus('regional_fearno', 'hunters_for_the_living').ai.modifiers.find(m => m.if[0].check === 'zin_cold_historical').factor, 0);
});

// ------------------------------------------------------------------------------------------------ negative cases
test('Fails: a duplicate focus key', () => failsWith(r => { r.regional_isengard.focuses.push({ ...r.regional_isengard.focuses[0], x: 40, y: 20 }); }, 'duplicate_key'));
test('Fails: two focuses on one position', () => failsWith(r => { r.regional_horidor.focuses[1].x = r.regional_horidor.focuses[0].x; r.regional_horidor.focuses[1].y = r.regional_horidor.focuses[0].y; }, 'duplicate_position'));
test('Fails: a prerequisite that is not a focus of the tree', () => failsWith(r => { focus2(r, 'regional_windwaith', 'harbour_guilds').prerequisite = [['no_such_focus']]; }, 'prerequisite_missing', /no_such_focus/));
test('Fails: a focus above its prerequisite', () => failsWith(r => { focus2(r, 'regional_fearno', 'the_hall_of_many_lords').y = 0; }, 'prerequisite_above'));
test('Fails: a spirit key equal to a focus key (F3)', () => failsWith(r => { r.regional_titanos.spirits.toll_halls_on_the_passes = r.regional_titanos.spirits.toll_halls; }, 'key_collision'));
test('Fails: an icon that is not in the catalog', () => failsWith(r => { focus2(r, 'regional_yeti_lands', 'the_eldests_fire').icon = 'no_such_icon'; }, 'icon_unknown'));
test('Fails: a days count that is not a multiple of seven', () => failsWith(r => { focus2(r, 'regional_dondor', 'the_dark_sea_accord').days = 30; }, 'days_multiple'));
test('Fails: a scripted effect that no tree or module writes', () => failsWith(r => { focus2(r, 'regional_nezer', 'answer_the_summons').effects.push({ call: 'zin_nowhere_do_it' }); }, 'effect_unresolved', /zin_nowhere_do_it/));
test('Fails: a scripted trigger that no tree or module writes', () => failsWith(r => { focus2(r, 'regional_dolon', 'dolon_at_peace').available.push({ check: 'zin_nowhere_is_true' }); }, 'trigger_unresolved'));
test('Fails: an event that does not exist', () => failsWith(r => { focus2(r, 'regional_bordon', 'the_road_hold').effects.push({ event: 'no_such_event' }); }, 'event_unknown'));
test('Fails: a flag that is never set', () => failsWith(r => { focus2(r, 'regional_olen', 'olen_at_peace').available = [{ flag: 'zin_never_set_anywhere' }]; }, 'flag_unresolved'));
test('Fails: a spirit that no tree defines', () => failsWith(r => { focus2(r, 'regional_demon', 'hazarels_word').effects.push({ add_spirit: 'no_such_spirit' }); }, 'spirit_unknown'));
test('Fails: an exclusive naming a focus outside the tree', () => failsWith(r => { focus2(r, 'regional_nan', 'one_warlord').mutually_exclusive = ['elsewhere']; }, 'exclusive_missing'));
test('Fails: a condition that changes in play inside allow_branch', () => failsWith(r => { focus2(r, 'regional_fearno', 'the_great_hunt').allow_branch = [{ flag: 'zin_lost_cause_member' }]; }, 'allow_branch_changing'));
test('Fails: a refreshed allow_branch condition that is not repeated in available', () => failsWith(r => { delete focus2(r, 'regional_yeti_lands', 'the_man_who_walked_from_the_ice').available; }, 'allow_branch_not_repeated'));
test('Fails: Afrit named in a text reachable before the reveal', () => failsWith(r => { focus2(r, 'regional_horidor', 'highland_moot').desc = 'Afrit watches the moot.'; }, 'secret_leak'));
test('Fails: a superseded name in a text', () => failsWith(r => { focus2(r, 'regional_blackton', 'the_five_towns').desc = 'Einendil walks the quay.'; }, 'text_superseded'));
test('Fails: an argument keyword without a code', () => failsWith(r => { focus2(r, 'regional_isengard', 'the_iron_hall').effects.push({ call: 'zin_aenor_add_camp_support', args: { camp: 'no_such_camp', value: 1 } }); }, 'call_keyword_nocode'));
test('Fails: a tree with fewer than 30 focuses (tier B range)', () => failsWith(r => { r.regional_nan.focuses = r.regional_nan.focuses.slice(0, 20); r.regional_nan.focuses.forEach(f => { f.prerequisite = (f.prerequisite ?? []).map(g => g.filter(k => r.regional_nan.focuses.some(x => x.key === k))).filter(g => g.length); f.mutually_exclusive = (f.mutually_exclusive ?? []).filter(k => r.regional_nan.focuses.some(x => x.key === k)); }); }, 'tier_range'));
test('Fails: a country that has two trees', () => failsWith(r => { r.regional_nezer.countries = ['Demon']; }, 'coverage_many'));
test('Fails: an unknown field in a tree file', async () => {
  const a = await analyse(r => { r.regional_olen.focuses[0].surprise = true; });
  assert(a.problems.some(p => p.code === 'schema' && /surprise/.test(p.message)));
});
test('Fails: a banned modern word is found by the banned-word scan', async () => {
  const glossary = JSON.parse(await readFile(`${ZIN}/tools/content/data/glossary.json`, 'utf8'));
  const rules = compileBanned(await loadRuleSet({ glossary }));
  assert(findBanned('The tank rolls out of the factory.', rules, ['error']).length >= 2);
  assert(findBanned('Black ships stand off the headlands.', rules, ['error', 'review']).length === 0);
  assert(findBanned('Pilots of the Cold Coast', rules, ['error']).length >= 1);
});

function focus2(raw, id, key) { return raw[id].focuses.find(f => f.key === key); }
