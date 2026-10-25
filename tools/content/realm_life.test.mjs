// Tests for realm life (modules/realm_life.mjs, G1 to G10) and the start variety (modules/start_variety.mjs, V1 to V13) of
// docs/design/alternate_history.md sections 7 and 8, with docs/specs/04_mechanics/realm_life.md. They build the two modules, the courts
// and the rules into one Staged and read the generated script.
// Run: node --test tools/content/realm_life.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { countryTable } from './lib/roster.mjs';
import { parse } from './lib/clausewitz.mjs';
import { loadCharacterData } from './modules/characters.mjs';
import { buildRules, loadRules } from './modules/rules.mjs';
import { buildRealmLife, loadRealmLife, realmPlan, heirsToRecruit, FILES } from './modules/realm_life.mjs';
import { buildStartVariety, loadStartVariety, rangeProblems, LIGHT, FULL, FILES as VFILES } from './modules/start_variety.mjs';
import { storyWiring } from './checks/story_wiring.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ZIN = path.resolve(here, '../..');
const countries = countryTable();
const tagOf = name => countries.find(c => c.name === name).tag;
const staged = new Staged();
// The courts module needs the warfare slices' traits staged first; the heirs are read from its data instead (the build hands the
// courts' skipped list in as well).
const courts = loadCharacterData();
const characters = { skipped: [] };
const realm = await buildRealmLife(staged, { countries, skipped: characters.skipped });
const variety = await buildStartVariety(staged, { countries });
// The owners' own rule files are not staged here, so only the rules of data/game_rules.json are written.
await buildRules(staged, { data: { ...(await loadRules()), ownerRules: [] } });
const D = await loadRealmLife(), V = await loadStartVariety();
const design = JSON.parse(readFileSync(path.join(ZIN, 'docs/design/alternate_history.json'), 'utf8'));
const text = rel => staged.files.get(rel).toString('utf8');
const strip = t => t.replace(/#.*$/gm, '');
const block = (t, name) => { const i = t.indexOf(`${name} = {`); assert(i >= 0, `${name} is defined`); let d = 0, j = t.indexOf('{', i); for (; j < t.length; j++) { if (t[j] === '{') d++; else if (t[j] === '}' && --d === 0) break; } return t.slice(i, j + 1); };
const effects = strip(text(FILES.effects)), triggers = strip(text(FILES.triggers)), events = strip(text(FILES.events)), onActions = strip(text(FILES.onActions));
const mine = [...Object.values(FILES), ...Object.values(VFILES)].filter(f => f.endsWith('.txt'));

test('Every file parses, keeps the operators the game reads and every localisation has its BOM', () => {
  for (const rel of mine) {
    const t = text(rel);
    assert.doesNotThrow(() => parse(t), rel);
    assert(!/<=|>=/.test(strip(t)), `${rel}: no unsupported operators`);
    assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length, `${rel}: balanced braces`);
  }
  for (const name of ['zin_realm_life', 'zin_start_variety']) assert(text(`localisation/english/${name}_l_english.yml`).startsWith('﻿l_english:'), name);
});

test('The events are the design plan row: 10 to 17, 20 to 22, 30 to 32, 40 to 42, 50, 51, 60 to 63, 70, 71 (80 left to the path)', () => {
  const want = [10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 30, 31, 32, 40, 41, 42, 50, 51, 60, 61, 62, 63, 70, 71];
  assert.deepEqual(D.events.map(e => e.id), want);
  const defined = [...events.matchAll(/^country_event = \{\s*id = (zin_realm\.\d+)/gm)].map(m => m[1]);
  assert.deepEqual(defined, ['zin_realm.1', ...want.map(n => `zin_realm.${n}`)]);
  const row = design.plan.find(p => /realm_life\.mjs/.test(p.target));
  for (const n of want) assert(row.content.includes(`.${n}`) || /\.\d+` to `\.\d+`/.test(row.content), `plan row ${n}`);
  assert(!/zin_realm\.80/.test(events), 'A Duty Passes stays the historical path\'s (zin_path.11 to .17)');
  // every zin_realm event any of these files fires is written
  for (const rel of mine) for (const m of strip(text(rel)).matchAll(/country_event = \{ id = (zin_realm\.\d+)/g)) assert(defined.includes(m[1]), `${rel} fires ${m[1]}`);
  // every written event has options, a picture and a timeout, and every option an AI weight
  for (const e of parse(text(FILES.events)).filter(x => x.k === 'country_event')) {
    const keys = e.v.map(x => x.k);
    if (keys.includes('hidden')) continue;
    for (const k of ['title', 'desc', 'picture', 'timeout_days', 'option']) assert(keys.includes(k), `${k}`);
    for (const o of e.v.filter(x => x.k === 'option')) assert(o.v.some(x => x.k === 'ai_chance'), 'every option has an AI chance');
  }
});

test('No two events one step apart share a picture, and every picture is in the catalog', () => {
  const pic = new Map(D.events.map(e => [e.id, e.picture]));
  const links = [[12, 13], [12, 15], [13, 15], [16, 10], [16, 11], [16, 15], [20, 21], [20, 22], [40, 41], [60, 61], [60, 62], [70, 71]];
  for (const [a, b] of links) assert.notEqual(pic.get(a), pic.get(b), `${a} and ${b}`);
  const cells = JSON.parse(readFileSync(path.join(here, 'data/presentation-cells.json'), 'utf8')).events.map(e => e.key);
  for (const p of pic.values()) assert(cells.includes(p), p);
});

test('K34: the pulse is four weekly batches inside the world tick, never an every-country on_monthly', () => {
  const tick = block(effects, 'zin_story_tick_realm');
  for (const d of D.batch.days) assert(tick.includes(`country_event = { id = zin_realm.1 days = ${d} }`), `batch at ${d} days`);
  assert(tick.includes('zin_realm_run_batch = yes'), 'batch 0 at once');
  assert.match(block(effects, 'zin_realm_run_batch'), /every_country = \{\s*limit = \{ check_variable = \{ zin_realm_slot = global\.zin_realm_batch \} \}\s*zin_realm_pulse = yes/);
  for (const rel of mine.filter(f => f.startsWith('common/on_actions/'))) assert(!/on_(daily|weekly|monthly)/.test(text(rel)), `${rel}: no per-country tick`);
  const slots = new Set(realm.plan.rows.map(r => r.slot));
  assert.deepEqual([...slots].sort(), [0, 1, 2, 3]);
  for (const s of slots) assert(realm.plan.rows.filter(r => r.slot === s).length > 30, `slot ${s} carries a quarter`);
  // the pulse never reads ROOT (ROOT is the world runner there)
  for (const name of ['zin_realm_pulse', 'zin_realm_note_ruler', 'zin_realm_age_ruler', 'zin_realm_succeed', 'zin_realm_check_ambition', 'zin_realm_check_subject', 'zin_realm_check_risings', 'zin_realm_check_war', 'zin_realm_check_kinship', 'zin_realm_check_raid', 'zin_realm_raid', 'zin_realm_check_exiles', 'zin_realm_found_exile_court', 'zin_realm_offer_terms', 'zin_realm_house_golden_king']) assert(!/\bROOT\b/.test(block(effects, name)), `${name} uses THIS and PREV`);
});

test('G1: the people rates of the design, the story rulers exempt, and tier A immortal on the historical path', () => {
  for (const [p, r] of Object.entries({ men: 1, orcs: 1.3, goblins: 1.3, dwarves: 0.6, giants: 0.5, elves: 0.05 })) assert.equal(D.people.rate[p], r, p);
  const story = block(triggers, 'zin_realm_is_story_ruler');
  for (const id of ['AEN_zin_ruler', 'zin_aurevan', 'zin_lorien', 'zin_volgan', 'zin_horos', 'zin_zol_will', 'NET_zin_ruler']) assert(story.includes(`character = ${id}`), id);
  assert(story.includes('has_country_leader_with_trait = zin_trait_ancient_king'));
  assert(story.includes('zin_aenor_is_realm = yes'), 'the Aenor court\'s whole line');
  assert.match(block(triggers, 'zin_realm_mortal'), /zin_rules_is_historical = yes\s*OR = \{\s*zin_realm_tier_a = yes/);
  assert.match(block(triggers, 'zin_realm_story_pending'), new RegExp(`original_tag = ${tagOf('Mirolon')}\\s*NOT = \\{ has_global_flag = zin_path_cp15_done \\}`));
  // every realm has a slot, a land and, unless its rulers have no rate, a rate and a start vigour inside 0 to 100
  for (const r of realm.plan.rows) {
    assert(onActions.includes(`${r.tag} = {\n\t\t\t\tset_variable = { zin_realm_slot = ${r.slot} }`), `${r.tag} has its slot`);
    if (r.rate !== null) {
      assert(r.vigour > 0 && r.vigour <= 100, `${r.tag} vigour ${r.vigour}`);
      assert(block(onActions, r.tag).includes(`zin_ruler_vigour = ${r.vigour}`), `${r.tag} vigour written`);
    }
  }
  assert(onActions.includes('set_character_flag = zin_realm_known'), 'the sitting rulers are known at the start');
});

test('G2: the named heirs are recruited in the histories, never during play, and the child heir reigns through a regency', () => {
  const heirs = heirsToRecruit(realm.plan, characters.skipped);
  assert.equal(heirs.size, realm.heirRecruits.size);
  assert(heirs.size >= 30, `${heirs.size} heirs`);
  assert(!heirs.has(tagOf('Aenor')), 'Prince Eronel stays the Aenor court\'s');
  assert(!heirs.has(tagOf('Mirolon')), 'Maeric stays the Volgan mechanic\'s');
  // characters.mjs defines every heir it owns with a country leader role in the realm's stance and recruits none
  const charSrc = readFileSync(path.join(here, 'modules/characters.mjs'), 'utf8');
  assert(/role === 'ruler' \|\| role === 'heir'[\s\S]*leaderBlock/.test(charSrc), 'heirs carry a country leader role');
  const heirIds = new Map(courts.filter(r => r.heir?.id).map(r => [r.tag, r.heir.id]));
  for (const [tag, [id]] of heirs) {
    assert.equal(heirIds.get(tag), id, `${tag}: ${id} is the court's heir`);
    assert(block(triggers, 'zin_realm_has_named_heir').includes(`has_character = ${id}`), id);
    assert(block(effects, 'zin_realm_crown_heir').includes(`promote_character = ${id}`), id);
    void tag;
  }
  for (const rel of mine) assert(!/recruit_character|generate_character/.test(strip(text(rel))), `${rel}: no recruit during play`);
  const s = block(effects, 'zin_realm_seat_heir');
  assert.match(s, /add_timed_idea = \{ idea = zin_realm_regency days = zin_t_days \}/);
  assert.match(s, /clamp_temp_variable = \{ var = zin_t_days min = constant:zin_realm\.regency_min_days max = constant:zin_realm\.regency_max_days \}/);
  assert.match(block(effects, 'zin_realm_tick_regency'), /NOT = \{ has_idea = zin_realm_regency \}[\s\S]*zin_realm\.14/);
});

test('G3: crises only where the crown may fall, the historical path elects in tier B and the contested crown is budgeted', () => {
  const allowed = block(triggers, 'zin_realm_crisis_allowed');
  for (const p of D.crisisPending) assert(allowed.includes(p.trigger ?? `original_tag = ${tagOf(p.realm)}`), p.realm);
  assert(allowed.includes('NOT = { has_character = zin_eindil }'), 'the heir\'s host');
  assert.match(block(triggers, 'zin_realm_crisis_may_turn'), /NOT = \{ zin_realm_tier_b = yes \}/);
  const c = block(triggers, 'zin_realm_crown_may_be_contested');
  assert(c.includes(`num_of_controlled_states > ${D.constants.crisis_min_states - 1}`) && c.includes('global.zin_realm_contested_crowns'));
  const ev13 = D.events.find(e => e.id === 13);
  assert(ev13.options.slice(1).every(o => o.trigger.includes('zin_realm_crisis_may_turn = yes')), 'only the election on the historical path in tier B');
  assert.match(block(effects, 'zin_realm_contest_crown'), /start_civil_war = \{\s*ideology = democratic\s*ruling_party = democratic/);
});

test('G4 to G9: each system has its check, its exemptions and its story owners left alone', () => {
  const pulse = block(effects, 'zin_realm_pulse');
  assert.match(pulse, /NOT = \{ zin_rules_is_historical = yes \}\s*zin_realm_crisis_allowed = yes\s*\}\s*zin_realm_check_ambition/, 'G4 off on the historical path');
  assert.match(pulse, /is_subject = yes\s*NOT = \{ zin_rules_is_historical = yes \}/, 'G5 subjects off on the historical path');
  assert(block(effects, 'zin_realm_check_subject').includes('NOT = { zin_realm_bond_owned = yes }'));
  assert(block(triggers, 'zin_realm_bond_owned').includes('has_country_flag = zin_afrit_eastern_client'), 'the clients of the East keep their autonomy rule');
  assert(block(effects, 'zin_realm_check_war').includes('NOT = { zin_realm_story_war_side = yes }'), 'G6 leaves story wars to their owners');
  assert.match(block(triggers, 'zin_realm_pointless_war'), /has_global_flag = zin_afrit_dead\s*has_country_flag = zin_afrit_eastern_client/, 'peace with the East after the false god');
  assert(block(triggers, 'zin_realm_alliance_owned').includes('zin_aenor_is_concord_dominion = yes'), 'G7 leaves the Concord alone');
  assert.match(D.mtth.zin_realm_match_will.modifiers.at(-1).if, /zin_rules_is_historical = yes/);
  const raid = block(effects, 'zin_realm_check_raid');
  assert.match(raid, /has_global_flag = zin_war_of_last_crowns\s*NOT = \{ zin_realm_tier_a = yes \}/, 'never a great power before CP11');
  assert.equal(realm.plan.raiders.length, D.raiders.realms.length);
  assert(!realm.plan.raiders.includes(tagOf('Goldoroth')), 'Goldoroth\'s raids are the Dark Lands mechanic\'s');
  assert(block(triggers, 'zin_realm_court_may_flee').includes('NOT = { zin_rules_is_historical = yes }'), 'G9: story courts only on the historical path');
});

test('SL-25, Q-65: the exiled Golden King keeps a court that can return', () => {
  assert.match(onActions, /on_capitulation = \{[\s\S]*has_global_flag = zin_golden_king_exiled[\s\S]*zin_realm_house_golden_king = yes/);
  assert.match(onActions, /on_annex = \{[\s\S]*has_global_flag = zin_golden_king_exiled[\s\S]*zin_realm_house_golden_king = yes/);
  assert.match(block(effects, 'zin_realm_run_batch'), /has_global_flag = zin_golden_king_exiled\s*NOT = \{ has_global_flag = zin_realm_gk_court \}/, 'the weekly batch catches it');
  const house = block(effects, 'zin_realm_house_golden_king');
  assert(house.indexOf(`${tagOf('Lerendor')} = {`) < house.indexOf(`${tagOf('Selen')} = {`), 'Lerendor first, by the treaty');
  assert(house.includes(`NOT = { owns_state = ${tagOf('Aenor') && countries.find(c => c.name === 'Aenor').capitalState} }`), 'never the realm that holds Parim');
  assert(block(effects, 'zin_realm_restore_exiles').includes('set_global_flag = zin_golden_king_restored'));
  assert(D.events.find(e => e.id === 50).desc.some(d => (d.if ?? '').includes('zin_realm_shelters_golden_court')));
});

test('The decisions of the Court: costs, AI weights and tooltips', () => {
  const dec = strip(text(FILES.decisions));
  for (const [id, d] of Object.entries(D.decisions)) {
    const b = block(dec, id);
    assert(b.includes(`cost = ${d.cost}`), `${id} cost`);
    assert(b.includes('ai_will_do'), `${id} AI`);
    assert(b.includes(`custom_effect_tooltip = ${id}_tt`), `${id} tooltip`);
    assert(b.includes(`icon = zin_realm_${d.icon}`), `${id} icon`);
  }
  assert(text(FILES.gfx).includes('GFX_decision_category_zin_realm_court'));
  assert.match(block(dec, 'zin_realm_seek_match'), /set_temp_variable = \{ zin_t_w = mtth:zin_realm_match_will \}/);
});

test('The story wiring check finds nothing in these files', () => {
  const files = new Map([...staged.files].filter(([k]) => mine.includes(k) || k.startsWith('common/scripted_triggers/zin_rules')));
  const r = storyWiring(files, { config: { enforce: [], enforceAll: false, owners: [{ owner: 'realm life', pattern: '/zin_(realm|start_variety|variety)' }], allowance: [] } });
  // flags these files read that another owner sets
  const external = new Set(['zin_golden_king_exiled', 'zin_afrit_dead', 'zin_war_of_last_crowns', 'zin_afrit_eastern_client', 'zin_region_east_lands', 'zin_path_cp06_done', 'zin_path_cp15_done', 'zin_path_cp23_done']);
  const own = r.findings.filter(f => f.owner === 'realm life' && !(f.check === 'flag_never_set' && external.has(f.id)));
  assert.deepEqual(own.map(f => `${f.check} ${f.id}`), []);
});

test('The start variety: the rule, its branches, the draws once in on_startup and the ranges of the design', () => {
  const rules = JSON.parse(readFileSync(path.join(here, 'data/game_rules.json'), 'utf8'));
  const rule = rules.rules.find(r => r.id === 'zin_rule_start_variety');
  assert.deepEqual(rule.options.map(o => o.key), ['DEFAULT', 'OFF', 'LIGHT', 'FULL']);
  assert.deepEqual(rule.branch, { HISTORICAL: 'OFF', PLAUSIBLE: 'LIGHT', FREE: 'FULL' });
  assert.deepEqual(rule.options.map(o => o.name), design.variety.rule.options.map(o => o.name));
  const wrappers = strip(text('common/scripted_triggers/zin_rules.txt'));
  for (const o of ['off', 'light', 'full']) assert(wrappers.includes(`zin_rules_ai_branch_variety_${o} = {`), o);
  assert.deepEqual(rangeProblems(V), []);
  assert.deepEqual([...LIGHT, ...FULL].sort(), design.variety.options.map(o => o.id).sort());
  for (const o of design.variety.options) assert.equal((o.level === 'FULL' ? FULL : LIGHT).includes(o.id), true, o.id);
  const oa = strip(text(VFILES.onActions));
  assert.match(oa, /on_startup = \{\s*effect = \{\s*if = \{\s*limit = \{ zin_variety_on = yes \}\s*set_global_flag = zin_start_variety_drawn/);
  assert('zin_rules.txt' < path.basename(VFILES.onActions), 'drawn after the story pace is set');
  assert(!/has_game_rule = \{ rule = zin_rule_start_variety/.test(strip(text(VFILES.effects)) + oa), 'the rule is read through its wrappers');
});

test('The start variety keeps the invariants: AI realms only under LIGHT (players too under FULL, Q-92), at most two feuds, no canon figure and no war between great powers', () => {
  const fx = strip(text(VFILES.effects));
  const apply = block(fx, 'zin_variety_apply');
  assert(!/zin_eindil = \{|recruit_character|declare_war_on|create_faction|add_to_faction|zin_afrit_reveal/.test(apply), 'no heir, no war, no league, no reveal');
  assert.match(block(fx, 'zin_variety_add_temper'), /random_list = \{[\s\S]*add_country_leader_trait = zin_trait_temper_bold/);
  assert(apply.includes('NOT = { zin_realm_is_story_ruler = yes }'), 'V4 spares the canon figures');
  assert.equal((fx.match(/^zin_variety_start_feud_\d+ = \{/gm) ?? []).length, 2, 'K34: at most two feuds');
  // Q-92: under FULL the feuds, lands and bonds reach player realms; the tempers reach them only under FULL.
  assert(!block(strip(text(VFILES.triggers)), 'zin_variety_feud_ready').includes('is_ai = yes'), 'feuds (FULL only) reach players');
  assert.match(apply, /OR = \{\s*is_ai = yes\s*has_global_flag = zin_start_variety_full\s*\}/, 'V4: tempers for players under FULL only');
  assert.match(block(fx, 'zin_variety_temper_new_ruler'), /OR = \{\s*is_ai = yes\s*has_global_flag = zin_start_variety_full/);
  for (const g of Object.values(V.V6.groups)) for (const n of g) assert(countries.find(c => c.name === n).focusTier !== 'major', `${n} is a minor realm`);
  assert(block(fx, 'zin_variety_end_feuds').includes('cancel_border_war'), 'the feuds end');
  assert.match(apply, /change_state_after_war|zin_variety_start_feud_1/);
  for (const [a, b] of V.V8.pairs) assert(text(VFILES.effects).includes(`# ${a} and ${b}`), `${a} and ${b}`);
  assert.match(apply, /transfer_state_to = \w+\s*add_claim_by = \w+/, 'the giver keeps a claim');
  assert(!/zin_realm_match = /.test(apply), 'V9 courts but does not wed (S5)');
  const traits = strip(text(VFILES.traits));
  for (const k of ['bold', 'cautious', 'pious', 'grasping', 'scholarly', 'vengeful', 'generous', 'weary']) assert(traits.includes(`zin_trait_temper_${k} = {`), k);
  // Q-91: twenty tempers, the rarer ones weighing less in the draw
  assert.equal(Object.keys(V.tempers).length, 20);
  for (const [k, tp] of Object.entries(V.tempers)) { assert(traits.includes(`zin_trait_temper_${k} = {`), k); assert(block(fx, 'zin_variety_add_temper').includes(`${tp.weight ?? V.V4.weightDefault} = { add_country_leader_trait = zin_trait_temper_${k} }`), `${k} weight`); }
  assert(Object.values(V.tempers).some(tp => tp.weight === 1), 'the rarest tempers');
});

test('The owners read the drawn values: the camps at the King\'s death and the court\'s temper in the reign events', () => {
  const src = readFileSync(path.join(here, 'lib/mech_aenor_script.mjs'), 'utf8');
  for (const k of V.V3.camps) assert(src.includes(`global.zin_sv_camp_${k}`), k);
  assert(src.includes('constant:zin_variety.eronel_favour_camp'));
  const reign = readFileSync(path.join(here, 'data/events_crown_reign1.json'), 'utf8');
  for (const t of V.V1.tempers) assert(reign.includes(`flag:zin_gk_temper_${t}`), t);
  assert(strip(text(VFILES.onActions)).includes('set_country_flag = zin_gk_temper_gilded'));
});

test('The design twin records the status of every system and every variety', () => {
  for (const s of design.systems) assert(/^(implemented|superseded)/.test(s.status ?? ''), `${s.id}: ${s.status}`);
  for (const o of design.variety.options) assert(/^implemented/.test(o.status ?? ''), `${o.id}: ${o.status}`);
  assert(/superseded/.test(design.systems.find(s => s.id === 'G10').status), 'G10 is the historical path\'s');
});

// ------------------------------------------------------------------------------------------------ owner answers of K55 and K59
test('Q-85 (K55): rulers age by the year, so a reign lasts decades and the long-lived reign for many lifetimes of men', () => {
  const C = D.constants, age = block(effects, 'zin_realm_age_ruler');
  assert.match(age, /multiply_temp_variable = \{ zin_t_wear = zin_ruler_rate \}\s*divide_temp_variable = \{ zin_t_wear = constant:zin_realm\.months_per_year \}/, 'a month wears rate / 12 of a year');
  assert.equal(C.months_per_year, 12);
  // a man of the mean fresh vigour reigns decades; an elf of the same vigour many centuries
  const mean = (C.new_ruler_min + C.new_ruler_max) / 2;
  assert(mean - C.vigour_frail >= 20, `${mean} years of vigour less the frail line give a reign of decades`);
  assert((mean - C.vigour_frail) / D.people.rate.elves >= 400, 'the elves reign for centuries');
  for (const r of realm.plan.rows) if (r.rate !== null) assert(r.vigour > 0 && r.vigour <= C.vigour_max, `${r.tag} vigour ${r.vigour}`);
  assert(block(effects, 'zin_realm_note_ruler').includes('has_country_flag = zin_realm_vigour_given'), 'a crowned heir keeps the years his own age gave him');
  assert.match(block(effects, 'zin_realm_seat_heir'), /zin_t_left = zin_realm_heir_life[\s\S]*set_variable = \{ zin_ruler_vigour = zin_t_left \}/);
});

test('Q-87 (K59): every realm but the story\'s has a pre-built heir, and the succession can fail into dispute, crisis or usurpation', () => {
  const H = JSON.parse(readFileSync(path.join(here, 'data/world/heirs.json'), 'utf8'));
  const none = ['yeldenne', 'puvulan', 'worshipdom', 'zols_mistake', 'gala', 'nether', 'god_forest', 'mushroom_forest', 'goldoroth'];
  for (const r of courts) assert(r.heir?.id || none.includes(r.key), `${r.key} has an heir`);
  for (const k of none) assert(!H.heirs[k], `${k} has no pre-built heir`);
  assert(!H.heirs.yeldenne, 'K56: Yeldenne is retired');
  for (const h of Object.values(H.heirs)) {
    assert(['male', 'none'].includes(h.gender), `${h.id}: a man (K54, Q-104), or a being without sex`);
    assert(h.name && h.role && h.people && h.custom, h.id);
  }
  // every pre-built heir of a realm whose ruler is not the story's is recruited in its history
  const heirs = heirsToRecruit(realm.plan, characters.skipped);
  for (const r of courts.filter(c => c.heir?.prebuilt)) assert(heirs.has(r.tag) || realm.plan.rows.find(x => x.tag === r.tag).story, r.key);
  // the dispute: the roll, the event and its four answers
  const s = block(effects, 'zin_realm_succeed');
  assert.match(s, /mtth:zin_realm_succession_dispute[\s\S]*zin_realm_crisis_allowed = yes[\s\S]*zin_realm\.16[\s\S]*zin_realm_seat_heir = yes/);
  assert.match(s, /zin_realm_elective_custom = yes[\s\S]*mtth:zin_realm_election_dispute[\s\S]*zin_realm_open_crisis = yes/, 'an election that cannot agree');
  const e16 = D.events.find(e => e.id === 16);
  assert.deepEqual(e16.options.map(o => o.effect[0]), ['zin_realm_hold_disputed_crown = yes', 'zin_realm_pass_over_heir = yes', 'zin_realm_fight_for_heir = yes', 'zin_realm_captain_takes_crown = yes']);
  assert(e16.options[2].trigger.includes('zin_realm_crown_may_be_contested = yes'), 'a civil war only when the crown may be contested');
  assert(block(effects, 'zin_realm_fight_for_heir').includes('zin_arg_way = 2'), 'the rival raises a banner');
  // the heir may die before the ruler, and then no heir can be determined until another is named
  assert(block(effects, 'zin_realm_pulse').includes('zin_realm_check_heir = yes'));
  assert.match(block(effects, 'zin_realm_check_heir'), /mtth:zin_realm_heir_death[\s\S]*zin_realm_remove_heir = yes[\s\S]*zin_realm\.17/);
  for (const [tag, [id]] of heirs) assert(block(effects, 'zin_realm_remove_heir').includes(`retire_character = ${id}`), `${tag} ${id}`);
  for (const k of ['blood', 'elective', 'contested', 'open']) assert(realm.plan.rows.some(r => r.custom === k), k);
  assert(realm.plan.rows.find(r => r.tag === tagOf('Stabilo')).custom === 'elective', 'the bench of houses chooses');
});

test('Q-89 (K59): the corsair and steppe-rider realms join the raiders, the corsairs by sea and the riders by land', () => {
  for (const n of ['Nondondor', 'Windy Lands', 'Konori', 'Hunhun', 'Noris', 'Delbiz']) assert(realm.plan.raiders.includes(tagOf(n)), n);
  assert.equal(realm.plan.raiders.length, 25);
  for (const n of ['Noris', 'Delbiz']) assert(realm.plan.steppe.includes(tagOf(n)), `${n} raids as the steppe riders do (owner, 25 October 2026)`);
  for (const t of [...realm.plan.corsairs, ...realm.plan.steppe]) assert(realm.plan.raiders.includes(t), `${t} raids`);
  const raid = block(effects, 'zin_realm_check_raid');
  assert.match(raid, /zin_realm_is_corsair = yes[\s\S]*any_owned_state = \{ is_coastal = yes \}/, 'corsairs strike the coast');
  assert.match(raid, /zin_realm_is_steppe_rider = yes\s*\}\s*if = \{\s*limit = \{ any_neighbor_country/, 'riders raid a neighbour only');
  assert(raid.includes('PREV = { zin_aenor_is_concord_dominion = yes }'), 'a chartered dominion never raids the crown or the Concord');
  assert.match(block(effects, 'zin_realm_raid'), /zin_realm_is_corsair = yes \} navy_experience[\s\S]*zin_realm_is_steppe_rider = yes \} army_experience/);
  assert(D.mtth.zin_realm_raid_chance.modifiers.some(m => m.if === 'zin_realm_is_steppe_rider = yes' && m.factor > 1), 'the riders ride more often');
});

test('Q-91 and Q-92 (K59): the tempers feed realm life, and the full start variety reaches player realms', () => {
  const used = new Set(Object.values(D.mtth).flatMap(m => m.modifiers.map(x => x.if.match(/zin_trait_temper_(\w+)/)?.[1]).filter(Boolean)));
  for (const k of used) assert(V.tempers[k], `the mtth reads the temper ${k}`);
  for (const k of ['just', 'suspicious', 'ambitious', 'cruel', 'fortunate', 'touched', 'beloved']) assert(used.has(k), `${k} has an effect beyond its modifiers`);
  const fx = strip(text(VFILES.effects));
  const apply = block(fx, 'zin_variety_apply');
  assert(!/is_ai = yes\s*num_of_controlled_states/.test(apply), 'V8 lands reach players');
  assert(!/exists = yes\s*is_ai = yes\s*\}/.test(apply.slice(apply.indexOf('# V9'))), 'V9 bonds reach players');
});
