// Tests for the diplomacy module (docs/specs/03_gameplay/03_diplomacy_and_factions.md, vanilla removal stage 2):
// the leagues and their rules, the autonomy states, the Peace Council, occupation and resistance, research sharing,
// and the Erdae text. They run on the module's own output (a Staged built from the roster) and check it against the
// installed game's documentation and localisation. Run: node --test tools/content/diplomacy.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { GAME } from './lib/paths.mjs';
import { parse } from './lib/clausewitz.mjs';
import { buildDiplomacy, loadDiplomacyData, validateDiplomacy, makeRoster, loadBannedRules, wordHits, playerText, indentLines, KEPT_ENGINE_IDS, VANILLA_ID } from './modules/diplomacy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
const roster = makeRoster(countries);
const data = await loadDiplomacyData();
const banned = await loadBannedRules();

const build = async (ctx = {}) => { const staged = new Staged(); const result = await buildDiplomacy(staged, { countries, ...ctx }); return { staged, result }; };
const { staged, result } = await build();
const text = rel => staged.files.get(rel).toString('utf8');
const clone = () => structuredClone(data);
const problemsOf = d => validateDiplomacy(d, roster);

// ------------------------------------------------------------------------------------- game vocabulary (installed)
const docNames = async f => new Set([...(await readFile(`${GAME}/documentation/${f}`, 'utf8')).matchAll(/^## ([A-Za-z0-9_]+)\s*$/gm)].map(m => m[1]));
const triggers = await docNames('triggers_documentation.md'), effects = await docNames('effects_documentation.md');
const vanillaLoc = new Map();
for (const f of (await readdir(`${GAME}/localisation/english`)).filter(x => x.endsWith('_l_english.yml'))) {
  for (const line of (await readFile(`${GAME}/localisation/english/${f}`, 'utf8')).replace(/^﻿/, '').split(/\r?\n/)) {
    const m = line.match(/^\s+([A-Za-z0-9_.\-']+):\d*\s+"(.*)"\s*(#.*)?$/);
    if (m) vanillaLoc.set(m[1], { value: m[2], file: f });
  }
}
const readYml = rel => {
  const body = text(rel).replace(/^﻿/, '');
  const out = new Map();
  for (const line of body.split('\n').slice(1)) { if (!line.trim()) continue; const m = line.match(/^ ([A-Za-z0-9_.\-']+):0 "(.*)"$/); assert(m, `localisation line shape: ${line.slice(0, 80)}`); out.set(m[1], m[2].replace(/\\n/g, '\n').replace(/\\"/g, '"')); }
  return out;
};
const replaceLoc = readYml('localisation/replace/zin_leagues_l_english.yml'), englishLoc = readYml('localisation/english/zin_leagues_l_english.yml');
const allLoc = k => replaceLoc.has(k) || englishLoc.has(k);

// ----------------------------------------------------------------------------------------------- shape of the output
test('The module writes every file of the stage-2 rows it owns, and nothing is empty but the two upgrade files', () => {
  const need = ['common/factions/templates/zin_factions.txt', 'common/factions/rules/zin_factions.txt', 'common/factions/rules/groups/zin_factions.txt', 'common/factions/goals/zin_factions.txt',
    'common/factions/member_upgrades/zin_factions.txt', 'common/factions/member_upgrades/member_groups/zin_factions.txt', 'common/factions/icons/zin_factions.txt',
    'common/autonomous_states/zin_autonomy.txt', 'common/occupation_laws/occupation_laws.txt', 'common/resistance_compliance_modifiers/resistance_modifiers.txt',
    'common/peace_conference/ai_peace/zin_peace.txt', 'common/peace_conference/categories/zin_peace.txt', 'common/peace_conference/cost_modifiers/zin_peace.txt',
    'common/technology_sharing/zin_tech_sharing.txt', 'common/bop/zin_bop.txt', 'common/modifiers/AAT_power_balance_modifiers.txt', 'common/modifiers/BBA_power_balance_modifiers.txt', 'common/modifiers/MUN_power_balance_modifiers.txt',
    'common/collections/zin_regions.txt', 'localisation/replace/zin_leagues_l_english.yml', 'localisation/english/zin_leagues_l_english.yml'];
  for (const f of need) assert(staged.files.has(f), `missing ${f}`);
  for (const f of ['common/factions/upgrades/zin_factions.txt', 'common/factions/upgrades/groups/zin_factions.txt']) {
    assert(staged.files.has(f));
    assert.equal(parse(text(f)).length, 0, `${f} holds only a comment header`);
    assert(/^# /m.test(text(f)));
  }
  for (const f of need.filter(x => x.endsWith('.txt'))) assert(parse(text(f)).some(e => e.k && Array.isArray(e.v)), `${f} defines something`);
  assert.equal(result.files.length, staged.files.size, 'the result lists every staged file');
});

test('Every script file is balanced, parses, and is indented by its braces', () => {
  for (const [rel, bytes] of staged.files) {
    if (!rel.endsWith('.txt') && !rel.endsWith('.gfx')) continue;
    const t = bytes.toString('utf8');
    assert.equal((t.match(/\{/g) ?? []).length, (t.match(/\}/g) ?? []).length, `${rel}: braces balance`);
    assert(!/ {2,}\S/.test(t.replace(/#.*$/gm, '')) || rel.endsWith('.gfx'), `${rel}: tabs, not spaces`);
    assert(!t.includes('\r'), `${rel}: LF endings`);
    parse(t);
  }
  assert.deepEqual(indentLines(['a = {', 'b = { c }', '}']), ['a = {', '\tb = { c }', '}']);
});

test('The output is deterministic: two builds give the same bytes', async () => {
  const again = await build();
  assert.deepEqual([...again.staged.files.keys()], [...staged.files.keys()]);
  for (const [k, v] of staged.files) assert(v.equals(again.staged.files.get(k)), k);
});

test('Counts: eighteen templates, seventeen joining rules, six goals, nine oaths, five autonomy states, six laws', () => {
  const c = result.counts;
  assert.equal(c.templates, 18, '17 leagues and the engine fallback');
  assert.equal(c.joiningRules, 17);
  assert.equal(c.goals, 6);
  assert.equal(c.manifests, 9);
  assert.equal(c.autonomyStates, 5);
  assert.equal(c.occupationLaws, 6);
  assert.equal(c.resistanceModifiers, 4);
  assert.equal(c.peaceCategories, 11);
  assert.equal(c.sharingGroups, 17);
  assert.equal(c.memberUpgrades, 4);
  assert(c.costModifiers >= 30 && c.aiDesires >= 30);
});

// ------------------------------------------------------------------------------------------------- leagues and rules
const SEVENTEEN = ['concord', 'leren', 'cold_lands', 'east_lands', 'dark_lands', 'no_refusal', 'not_shadow', 'sworn', 'crossing', 'pupor_charter', 'free_north', 'warden_league', 'free_steadings', 'free_dominions', 'lost_cause', 'elven_kin', 'sun_realms'].map(k => `zin_faction_rule_join_${k}`);
const defined = (rel, filter = () => true) => parse(text(rel)).filter(e => e.k && Array.isArray(e.v) && filter(e)).map(e => e.k);

test('zin_rule_group_joining is the single joining group and lists all seventeen rules, each defined once', () => {
  const groups = parse(text('common/factions/rules/groups/zin_factions.txt'));
  const joining = groups.filter(g => g.v.some(r => r.k === 'rules' && r.v.some(x => /^zin_faction_rule_join_/.test(x.v))));
  assert.equal(joining.length, 1);
  assert.equal(joining[0].k, 'zin_rule_group_joining');
  const listed = joining[0].v.find(r => r.k === 'rules').v.map(x => x.v);
  assert.deepEqual([...listed].sort(), [...SEVENTEEN].sort());
  const rules = defined('common/factions/rules/zin_factions.txt');
  for (const id of SEVENTEEN) assert.equal(rules.filter(r => r === id).length, 1, `${id} defined exactly once`);
  assert.equal(new Set(rules).size, rules.length, 'no rule defined twice');
});

test('The joining group is built from the joining rule list, so a rule cannot be left out of it', async () => {
  const d = clone(); d.base.joiningRules.push({ key: 'extra', name: 'Extra', trigger: ['always = yes'] });
  const { staged: s } = await build({ diplomacyData: d });
  const group = parse(s.files.get('common/factions/rules/groups/zin_factions.txt').toString('utf8')).find(g => g.k === 'zin_rule_group_joining').v.find(r => r.k === 'rules').v.map(x => x.v);
  assert(group.includes('zin_faction_rule_join_extra'), 'the group is built from the joining rule list, so a new rule cannot be left out');
  assert.equal(group.length, 18);
});

test('Every template resolves its rules, goals, oath and emblem, and is script-only', () => {
  const rules = new Set([...defined('common/factions/rules/zin_factions.txt'), ...SEVENTEEN]);
  const goals = new Set(defined('common/factions/goals/zin_factions.txt'));
  const icons = new Set(parse(text('common/factions/icons/zin_factions.txt'))[0].v[0].v.map(x => x.v));
  const sprites = text('interface/zin_diplomacy.gfx');
  const templates = parse(text('common/factions/templates/zin_factions.txt'));
  assert.equal(templates.length, 18);
  for (const t of templates) {
    const get = k => t.v.find(x => x.k === k);
    assert.deepEqual(get('visible').v.map(x => `${x.k}=${x.v}`), ['always=no'], `${t.k} is script-only`);
    assert.equal(get('can_leader_join_other_factions').v, 'no');
    for (const r of get('default_rules').v) assert(rules.has(r.v), `${t.k}: rule ${r.v}`);
    for (const g of get('goals')?.v ?? []) assert(goals.has(g.v), `${t.k}: goal ${g.v}`);
    const m = get('manifest')?.v; if (m) assert(goals.has(m), `${t.k}: oath ${m}`);
    assert(icons.has(get('icon').v), `${t.k}: icon in the pool`);
    assert(sprites.includes(`name = "${get('icon').v}"`) && sprites.includes(`name = "${get('icon').v}_miniature"`), `${t.k}: sprite and miniature`);
    assert(allLoc(get('name').v), `${t.k}: name text`);
  }
});

test('The seven working leagues follow the spec table', () => {
  const byId = new Map(parse(text('common/factions/templates/zin_factions.txt')).map(t => [t.k, t.v]));
  const rulesOf = id => byId.get(id).find(x => x.k === 'default_rules').v.map(x => x.v);
  assert.deepEqual(rulesOf('zin_faction_concord'), ['zin_faction_rule_join_concord', 'zin_faction_rule_join_no_refusal', 'zin_faction_rule_join_not_shadow', 'war_declaration_rule_faction_leader_only', 'call_to_war_rule_faction_leader_only', 'change_leader_rule_never', 'faction_peace_rule_puppeting_focus']);
  assert.deepEqual(rulesOf('zin_faction_leren_compact'), ['zin_faction_rule_join_leren', 'zin_faction_rule_join_no_refusal', 'war_declaration_rule_any_country', 'call_to_war_rule_faction_leader_only', 'change_leader_rule_never', 'faction_peace_rule_no_puppeting']);
  assert.deepEqual(rulesOf('zin_faction_northern_accord'), ['zin_faction_rule_join_cold_lands', 'zin_faction_rule_join_no_refusal', 'war_declaration_rule_any_country', 'call_to_war_rule_major_only', 'change_leader_rule_manpower', 'faction_peace_rule_conquest_focus']);
  assert.deepEqual(rulesOf('zin_faction_noris_treaty'), ['zin_faction_rule_join_east_lands', 'zin_faction_rule_join_no_refusal', 'war_declaration_rule_any_country', 'call_to_war_rule_major_only', 'change_leader_rule_industry', 'faction_peace_rule_conquest_focus']);
  assert.deepEqual(rulesOf('zin_faction_dark_sea_accord'), ['zin_faction_rule_join_dark_lands', 'zin_faction_rule_join_no_refusal', 'zin_faction_rule_join_not_shadow', 'war_declaration_rule_any_country', 'call_to_war_rule_major_only', 'change_leader_rule_manpower', 'faction_peace_rule_liberation_focus']);
  assert.deepEqual(rulesOf('zin_faction_southern_dominion'), ['zin_faction_rule_join_sworn', 'war_declaration_rule_faction_leader_only', 'call_to_war_rule_faction_leader_only', 'change_leader_rule_never', 'faction_peace_rule_conquest_focus']);
  assert.deepEqual(rulesOf('zin_faction_pupor_charter'), ['zin_faction_rule_join_pupor_charter', 'war_declaration_rule_faction_leader_only', 'call_to_war_rule_faction_leader_only', 'change_leader_rule_never', 'faction_peace_rule_no_puppeting']);
  assert.deepEqual(rulesOf('zin_faction_lost_cause'), ['zin_faction_rule_join_lost_cause', 'war_declaration_rule_faction_leader_only', 'change_leader_rule_never']);
  assert.deepEqual(rulesOf('zin_faction_western_crossing').slice(0, 1), ['zin_faction_rule_join_crossing']);
  assert(rulesOf('zin_faction_free_crowns').includes('zin_faction_rule_join_east_lands'), 'the Free Crowns use the East Lands rule');
  assert(!byId.get('zin_faction_lost_cause').some(x => x.k === 'manifest'), 'the Lost Cause has no oath');
});

test('The start leagues resolve to roster tags: the Concord has 26 chartered dominions, Andos Enda is not in the Leren Compact', () => {
  const start = new Map(result.factions.map(f => [f.id, f]));
  assert.equal(start.size, 7);
  assert.equal(start.get('zin_faction_concord').members.length, 26);
  assert.equal(start.get('zin_faction_concord').leaderTag, roster.tag('Aenor'));
  assert.deepEqual(start.get('zin_faction_leren_compact').members, ['Eekedor']);
  assert(!start.get('zin_faction_leren_compact').members.includes('Andos Enda'));
  assert.deepEqual(start.get('zin_faction_southern_dominion').members, ['Demon', 'Dolon', 'Nezer']);
  assert.deepEqual(start.get('zin_faction_dark_sea_accord').members, ['Belonton']);
});

test('The joining rules test the capital region, the Refusal and the story flags the spec names', () => {
  const rules = text('common/factions/rules/zin_factions.txt');
  const block = id => rules.slice(rules.indexOf(`${id} = {`), rules.indexOf('\n}\n', rules.indexOf(`${id} = {`)));
  assert(block('zin_faction_rule_join_concord').includes('zin_is_region_middle_lands = yes'));
  assert(block('zin_faction_rule_join_concord').includes('has_global_flag = zin_lost_cause_shield'));
  assert(block('zin_faction_rule_join_leren').includes(`tag = ${roster.tag('Andos Enda')}`) && block('zin_faction_rule_join_leren').includes('zin_refusal_lifted'));
  assert(block('zin_faction_rule_join_no_refusal').includes('NOT = { zin_diplo_refusal_binds = yes }'));
  assert(block('zin_faction_rule_join_not_shadow').includes('NOT = { has_government = communism }'));
  assert(block('zin_faction_rule_join_pupor_charter').includes('zin_tritons_corsair_haven'), 'a corsair haven cannot join the Pupor Charter');
  assert(block('zin_faction_rule_join_free_north').includes(`NOT = { tag = ${roster.tag('Lerendor')} }`), 'Lerendor cannot join the Free Crowns of the North');
  assert(block('zin_faction_rule_join_free_north').includes('zin_leren_lean'));
  assert(block('zin_faction_rule_join_warden_league').includes('zin_mirolon_league_friend'));
  assert(block('zin_faction_rule_join_free_dominions').includes('zin_aenor_free_dominion'));
  assert(block('zin_faction_rule_join_lost_cause').includes('zin_eindil_regard') && block('zin_faction_rule_join_lost_cause').includes('zin_west_stranded'));
  assert(block('zin_faction_rule_join_sworn').includes('zin_is_region_dead_lands') && block('zin_faction_rule_join_sworn').includes('zin_is_region_dark_lands'));
});

test('Every rule belongs to a group and every group lists defined rules', () => {
  const rules = new Set([...defined('common/factions/rules/zin_factions.txt'), ...SEVENTEEN]);
  const groups = parse(text('common/factions/rules/groups/zin_factions.txt'));
  const listed = new Set();
  for (const g of groups) for (const r of g.v.find(x => x.k === 'rules').v) { assert(rules.has(r.v), `${g.k}: ${r.v}`); listed.add(r.v); }
  for (const r of rules) assert(listed.has(r), `${r} is in no group`);
  assert.equal(groups.filter(g => g.k !== 'zin_rule_group_joining').filter(g => g.v[0].v.some(x => /^zin_faction_rule_join_/.test(x.v))).length, 0, 'no other group lists a ZIN joining rule');
});

test('The engine rule keys the templates and defines name are all kept, with Erdae text', () => {
  for (const id of ['war_declaration_rule_any_country', 'war_declaration_rule_independent_countries_only', 'war_declaration_rule_faction_leader_only', 'war_declaration_rule_major_only', 'call_to_war_rule_faction_leader_only', 'call_to_war_rule_major_only', 'call_to_war_rule_independent_only',
    'change_leader_rule_never', 'change_leader_rule_manpower', 'change_leader_rule_industry', 'change_leader_rule_influence', 'change_leader_rule_manifest_below_35', 'faction_peace_rule_puppeting_focus', 'faction_peace_rule_no_puppeting', 'faction_peace_rule_liberation_focus', 'faction_peace_rule_ideology_focus', 'faction_peace_rule_conquest_focus', 'faction_peace_take_claimed_focus',
    'goals_only_faction_leader', 'government_in_exile_allowed', 'manpower_contribution_small', 'manpower_contribution_medium', 'manpower_contribution_high', 'dismissal_rule_world_tension', 'dismissal_rule_offensive_war']) {
    assert(defined('common/factions/rules/zin_factions.txt').includes(id), id);
    assert(replaceLoc.has(id), `${id} has Erdae text that replaces the vanilla line`);
  }
  assert(defined('common/factions/templates/zin_factions.txt').includes('faction_template_generic'), 'the define FACTION_DEFAULT_TEMPLATE names this key');
});

test('Peace rules point at defined price modifiers and carry their tooltip text', () => {
  const costs = new Set(defined('common/peace_conference/cost_modifiers/zin_peace.txt').concat(parse(text('common/peace_conference/cost_modifiers/zin_peace.txt'))[0].v.map(x => x.k)));
  const rules = parse(text('common/factions/rules/zin_factions.txt')).filter(r => r.v.some(x => x.k === 'type' && x.v === 'peace_conference_rules'));
  assert.equal(rules.length, 6);
  for (const r of rules) {
    for (const c of r.v.find(x => x.k === 'peace_action_modifiers').v) assert(costs.has(c.v), `${r.k}: ${c.v}`);
    const tt = r.v.find(x => x.k === 'modifier').v[0].v;
    assert(replaceLoc.has(tt), `${tt} is text`);
  }
});

test('Goals: the four ZIN goals and the two engine unlock goals; the oaths read collections and variables that exist', () => {
  const g = text('common/factions/goals/zin_factions.txt');
  for (const id of ['zin_faction_goal_grow_the_league', 'zin_faction_goal_hold_the_line', 'zin_faction_goal_against_the_dark', 'zin_faction_goal_dominion_of_the_south', 'faction_goal_unlock_research', 'faction_goal_unlock_military']) assert(g.includes(`${id} = {`), id);
  assert(g.includes(`controls_state = ${roster.capitalState('Mirolon')}`), 'Volgan wins by holding Mirolon\'s capital state');
  assert(g.includes('category = short_term') && g.includes('category = medium_term') && g.includes('category = long_term'));
  const oaths = parse(g).filter(e => e.v.some(x => x.k === 'is_manifest'));
  assert.equal(oaths.length, 9);
  const colls = new Set(defined('common/collections/zin_regions.txt'));
  for (const o of oaths) {
    const r = o.v.find(x => x.k === 'ratio_progress').v;
    for (const k of ['total_amount_collection', 'completed_amount_collection']) { const v = r.find(x => x.k === k)?.v; if (v) assert(colls.has(v.replace('collection:', '')), `${o.k}: ${v}`); }
    assert(r.find(x => x.k === 'progress_sections'), `${o.k}: a fulfilled bonus`);
  }
  const concord = oaths.find(o => o.k === 'zin_faction_manifest_common_defence').v.find(x => x.k === 'ratio_progress').v;
  assert.equal(concord.find(x => x.k === 'total_amount').v, 'global.zin_diplo_concord_members');
  assert(text('common/scripted_effects/zin_diplomacy_leagues.txt').includes('global.zin_diplo_concord_loyal'));
});

test('The oaths give the spec\'s fulfilled bonuses', () => {
  const g = text('common/factions/goals/zin_factions.txt');
  const bonus = id => g.slice(g.indexOf(`${id} = {`), g.indexOf('\n}\n', g.indexOf(`${id} = {`)));
  assert(bonus('zin_faction_manifest_common_defence').includes('production_factory_max_efficiency_factor = 0.05'));
  assert(bonus('zin_faction_manifest_lords_of_the_strait').includes('naval_damage_factor = 0.05'));
  assert(bonus('zin_faction_manifest_frozen_crown').includes('winter_attrition_factor = -0.1'));
  assert(bonus('zin_faction_manifest_northern_roads').includes('trade_opinion_factor = 0.1'));
  assert(bonus('zin_faction_manifest_southern_roads').includes('trade_opinion_factor = 0.1'));
  assert(bonus('zin_faction_manifest_hold_the_dark_sea').includes('army_defence_factor = 0.05'));
  assert(bonus('zin_faction_manifest_dominion_of_the_south').includes('army_attack_factor = 0.05'));
  assert(bonus('zin_faction_manifest_cross_the_sea').includes('naval_invasion_prep_speed = 0.1'));
  assert(bonus('zin_faction_manifest_kindred').includes('army_core_defence_factor = 0.05'));
});

test('Member upgrades keep the engine ids the contribution rules set', () => {
  const ups = defined('common/factions/member_upgrades/zin_factions.txt');
  assert.deepEqual(ups, ['manpower_contribution_full_enable', 'faction_manpower_sharing1', 'faction_manpower_sharing2', 'faction_manpower_sharing3']);
  const group = parse(text('common/factions/member_upgrades/member_groups/zin_factions.txt'))[0].v;
  assert.equal(group.find(x => x.k === 'upgrade_type').v, 'faction_member_upgrade_manpower');
  assert.equal(group.find(x => x.k === 'default_upgrade').v, 'manpower_contribution_full_enable');
  for (const u of ups) assert(allLoc(u), `${u} has text`);
});

// ------------------------------------------------------------------------------------------------------------ subjects
test('Autonomy: autonomy_puppet is the one default, always allowed, and no vanilla state is defined', () => {
  const states = parse(text('common/autonomous_states/zin_autonomy.txt')).map(s => Object.fromEntries(s.v.map(x => [x.k, x.v])));
  assert.deepEqual(states.map(s => s.id), ['autonomy_puppet', 'zin_autonomy_chartered_dominion', 'zin_autonomy_sworn_realm', 'zin_autonomy_eastern_client', 'zin_autonomy_tributary_hold']);
  assert.equal(states.filter(s => s.default === 'yes').length, 1);
  assert.equal(states[0].default, 'yes');
  assert.equal(states[0].allowed[0].k, 'always', 'the puppet effect needs a default state that can always apply');
  assert.equal(new Set(states.map(s => s.min_freedom_level)).size, 5, 'no two states share a level');
  for (const s of states) { assert.equal(s.is_puppet, 'yes', `${s.id}: end_puppet must work`); assert(allLoc(s.id), s.id); assert(englishLoc.has(`${s.id}_desc`)); }
  for (const [rel, bytes] of staged.files) if (rel.endsWith('.txt') && !rel.startsWith('localisation')) assert(!/autonomy_(dominion|satellite|colony|integrated_puppet|reichs\w+|supervised_state|collaboration_government|personal_union|free_state)\b/.test(bytes.toString('utf8')), `${rel} names a vanilla autonomy state`);
});

test('Autonomy values follow the spec (levels tuned so that no two states share one)', () => {
  const by = new Map(parse(text('common/autonomous_states/zin_autonomy.txt')).map(s => [s.v.find(x => x.k === 'id').v, s.v]));
  const mod = (id, k) => by.get(id).find(x => x.k === 'modifier').v.find(x => x.k === k)?.v;
  const rule = (id, k) => by.get(id).find(x => x.k === 'rule').v.find(x => x.k === k)?.v;
  assert.equal(by.get('zin_autonomy_chartered_dominion').find(x => x.k === 'min_freedom_level').v, '0.5');
  assert.equal(rule('zin_autonomy_chartered_dominion', 'can_not_declare_war'), 'yes');
  assert.equal(rule('zin_autonomy_chartered_dominion', 'can_decline_call_to_war'), 'no', 'a common army in war');
  assert.equal(mod('zin_autonomy_chartered_dominion', 'extra_trade_to_overlord_factor'), '0.25');
  assert.equal(mod('zin_autonomy_chartered_dominion', 'overlord_trade_cost_factor'), '-0.25');
  assert.equal(mod('zin_autonomy_chartered_dominion', 'autonomy_manpower_share'), '0.1');
  assert.equal(mod('zin_autonomy_sworn_realm', 'autonomy_manpower_share'), '0.3');
  assert.equal(rule('zin_autonomy_sworn_realm', 'can_decline_call_to_war'), 'no');
  assert.equal(rule('zin_autonomy_eastern_client', 'can_not_declare_war'), 'no');
  assert.equal(mod('zin_autonomy_eastern_client', 'extra_trade_to_overlord_factor'), '0.15');
  assert.equal(mod('zin_autonomy_tributary_hold', 'autonomy_manpower_share'), '0.2');
  assert.equal(mod('zin_autonomy_tributary_hold', 'extra_trade_to_overlord_factor'), '0.2');
  assert.equal(rule('zin_autonomy_tributary_hold', 'can_not_declare_war'), 'yes');
  assert(Number(by.get('zin_autonomy_sworn_realm').find(x => x.k === 'min_freedom_level').v) > 0, 'a level of 0 is the annexed level');
  for (const id of ['zin_autonomy_chartered_dominion', 'zin_autonomy_sworn_realm', 'zin_autonomy_eastern_client', 'zin_autonomy_tributary_hold']) {
    const filter = by.get(id).find(x => x.k === 'allowed_levels_filter').v.map(x => x.v);
    assert.deepEqual(filter, [id], `${id} stays in its own level`);
  }
});

test('Each autonomy state has a sprite for its icon, built on the engine convention GFX_<id>_icon', () => {
  const sprites = text('interface/zin_diplomacy.gfx');
  for (const id of ['zin_autonomy_chartered_dominion', 'zin_autonomy_sworn_realm', 'zin_autonomy_eastern_client', 'zin_autonomy_tributary_hold']) assert(sprites.includes(`name = "GFX_${id}_icon"`), id);
});

test('Occupation: five laws and a hidden missing-garrison law; the ids resistance_activity.txt names are kept; no tag condition', () => {
  const laws = new Map(parse(text('common/occupation_laws/occupation_laws.txt')).map(l => [l.k, l.v]));
  assert.deepEqual([...laws.keys()], ['zin_occupation_light_hand', 'harsh_quotas_occupation', 'zin_occupation_iron_hand', 'forced_labor_occupation', 'zin_occupation_no_garrison', 'zin_occupation_missing_garrison']);
  const has = (id, k) => laws.get(id).some(x => x.k === k);
  assert.equal([...laws.keys()].filter(id => has(id, 'default_law')).length, 1);
  assert(has('zin_occupation_light_hand', 'default_law'), 'The Light Hand is the default');
  assert.equal([...laws.keys()].filter(id => has(id, 'missing_garrison_law')).length, 1);
  assert(!text('common/occupation_laws/occupation_laws.txt').includes('main_fallback_law'), 'main_fallback_law is not a key of the installed game');
  const mod = (id, k) => laws.get(id).find(x => x.k === 'state_modifier').v.find(x => x.k === k)?.v;
  assert.equal(mod('zin_occupation_light_hand', 'compliance_gain'), '0.05');
  assert.equal(mod('zin_occupation_light_hand', 'resistance_target'), '-0.1');
  assert.equal(mod('harsh_quotas_occupation', 'resistance_target'), '-0.2');
  assert.equal(mod('zin_occupation_iron_hand', 'resistance_target'), '-0.35');
  assert.equal(mod('zin_occupation_iron_hand', 'compliance_gain'), '-0.05');
  assert.equal(mod('forced_labor_occupation', 'resistance_target'), '-0.15');
  assert.equal(mod('forced_labor_occupation', 'compliance_gain'), '-0.03');
  assert.equal(mod('zin_occupation_no_garrison', 'required_garrison_factor'), '-1');
  for (const id of ['harsh_quotas_occupation', 'forced_labor_occupation']) assert(laws.has(id), `resistance_activity.txt names ${id}`);
});

test('The kept resistance_activity.txt names only occupation laws that are still defined', async () => {
  const src = await readFile(`${GAME}/common/resistance_activity/resistance_activity.txt`, 'utf8');
  const named = new Set([...src.matchAll(/occupation_law = (\w+)/g)].map(m => m[1]));
  const laws = new Set(defined('common/occupation_laws/occupation_laws.txt'));
  for (const id of named) assert(laws.has(id), `resistance_activity.txt names ${id}`);
});

test('Resistance modifiers keep their ids and thresholds and name no vanilla country', () => {
  const t = text('common/resistance_compliance_modifiers/resistance_modifiers.txt');
  assert.deepEqual(defined('common/resistance_compliance_modifiers/resistance_modifiers.txt'), ['resistance_25', 'resistance_50', 'resistance_75', 'resistance_90']);
  for (const th of [25, 50, 75, 90]) assert(t.includes(`threshold = ${th}`));
  assert(!/RAJ|DIP|original_tag|has_dlc/.test(t));
  assert(t.includes('occupied_countries.2'), 'the uprising event stays named (stage 1 bridges it)');
});

test('No stage-2 file names a vanilla country tag, a DLC or a vanilla family of ids', () => {
  const tags = new Set(countries.map(c => c.tag));
  for (const [rel, bytes] of staged.files) {
    if (!rel.endsWith('.txt')) continue;
    const t = bytes.toString('utf8').replace(/#.*$/gm, '');
    assert(!/\b(original_tag|has_dlc)\b/.test(t), `${rel}: no tag or DLC condition`);
    for (const m of t.matchAll(/\btag = ([A-Za-z0-9_]+)/g)) assert(tags.has(m[1]) || ['ROOT', 'FROM', 'PREV'].includes(m[1].split('.')[0]), `${rel}: tag ${m[1]} is not in the roster`);
    for (const m of t.matchAll(/\b(joining_rule_[a-z_]+|faction_template_[a-z_]+|faction_manifest_[a-z_]+|faction_goal_[a-z_]+|autonomy_(?:puppet|dominion|satellite|colony|integrated_puppet|reichskommissariat|reichsprotectorate|supervised_state|collaboration_government|personal_union|occupation_zone|communist_satellite))\b/g)) {
      const id = m[1];
      if (/^zin_/.test(id) || id === 'faction_manifest_fulfillment') continue; // a trigger, not a manifest id
      assert(!VANILLA_ID.test(id) || KEPT_ENGINE_IDS.has(id.replace(/_(name|desc)$/, '')), `${rel}: vanilla name ${id}`);
    }
  }
});

// ---------------------------------------------------------------------------------------------------- Peace Council
test('Peace categories keep the engine keys and the default; prices and desires name only real action types', () => {
  const cats = parse(text('common/peace_conference/categories/zin_peace.txt'))[0].v;
  assert.deepEqual(cats.map(c => c.k), ['other', 'occupation', 'ideology', 'is_core', 'core_of_ally', 'has_claim', 'defensive_war', 'treaties_or_conferences', 'belonged_to_someone_else', 'events_or_focuses', 'continuous_political_action']);
  assert.equal(cats.filter(c => c.v.some(x => x.k === 'default')).length, 1);
  for (const c of cats) assert(replaceLoc.has(c.v.find(x => x.k === 'name').v), `${c.k}: Erdae name`);
  const costs = parse(text('common/peace_conference/cost_modifiers/zin_peace.txt'))[0].v;
  for (const c of costs) {
    const mult = Number(c.v.find(x => x.k === 'cost_multiplier').v);
    assert(mult > 0 && mult <= 3, `${c.k}: ${mult}`);
    const cat = c.v.find(x => x.k === 'category')?.v;
    if (cat) assert(cats.some(x => x.k === cat), `${c.k}: category ${cat}`);
  }
  assert.equal(costs.filter(c => c.v.some(x => x.k === 'faction_modifier')).length, 9, 'the nine faction rule modifiers');
  const desires = text('common/peace_conference/ai_peace/zin_peace.txt');
  assert(desires.includes(`tag = ${roster.tag('Zol')}`) && /zin_peace_zol_takes_no_land[\s\S]*ai_desire = -1000/.test(desires), 'Zol takes no land');
  assert(desires.includes(`tag = ${roster.tag('Volgan')}`), 'Volgan has its own block');
  for (const m of desires.matchAll(/peace_action_type = \{ ([^}]*) \}/g)) for (const a of m[1].split(' ')) assert(['take_states', 'puppet', 'force_government', 'liberate'].includes(a), a);
});

test('Research sharing: one group per league, open to its members at 0.10', () => {
  const groups = parse(text('common/technology_sharing/zin_tech_sharing.txt'));
  assert.equal(groups.length, 17);
  for (const g of groups) {
    const id = g.v.find(x => x.k === 'id').v;
    assert.equal(g.v.find(x => x.k === 'research_sharing_per_country_bonus').v, '0.1');
    assert(/^has_faction_template = zin_faction_/.test(text('common/technology_sharing/zin_tech_sharing.txt').split(`id = ${id}`)[1].split('available = {')[1].trim()));
    assert(englishLoc.has(`${id}_name`) && englishLoc.has(`${id}_desc`));
  }
});

test('The interim balance of power is never started and uses real modifiers', () => {
  const bop = text('common/bop/zin_bop.txt');
  assert(bop.includes('zin_court_balance = {') && /^# .*never started/m.test(bop));
  assert.equal(defined('common/bop/zin_bop.txt').length, 1);
  for (const [f, n] of [['AAT', 1], ['BBA', 2], ['MUN', 3]]) assert(text(`common/modifiers/${f}_power_balance_modifiers.txt`).includes(`zin_court_power_balance_${n} = {`));
  assert(![...staged.files.keys()].some(k => /on_actions/.test(k) && text(k).includes('set_power_balance')));
});

// ------------------------------------------------------------------------------------- scripts against the installed game
const STRUCT = new Set(['OR', 'AND', 'NOT', 'NOR', 'if', 'else', 'else_if', 'IF', 'ELSE', 'limit', 'hidden_effect', 'hidden_trigger', 'custom_effect_tooltip', 'custom_trigger_tooltip', 'faction_members', 'game', 'every_other_country', 'every_country', 'effect', 'trigger']);
const ARG = new Set(['id', 'hours', 'days', 'target', 'type', 'upgrade', 'input', 'operators', 'value', 'var', 'compare', 'tooltip', 'base', 'add', 'factor', 'exists', 'name', 'modifier', 'min', 'max']);
const SCOPE_HEAD = new Set(['ROOT', 'FROM', 'PREV', 'THIS', 'OWNER', 'CONTROLLER', 'CAPITAL', 'OCCUPIED', 'capital_scope', 'global', 'controller']);
const VAR_PARENT = new Set(['set_variable', 'add_to_variable', 'subtract_from_variable', 'set_temp_variable', 'add_to_temp_variable', 'check_variable']);
test('Every trigger, effect and argument written exists in the installed game, in this module or in a named dependency', () => {
  const mine = new Set([...result.definitions.triggers, ...result.definitions.effects]);
  const outside = new Set(result.dependencies.map(d => d.name));
  const tags = new Set(countries.map(c => c.tag));
  const bad = [];
  const walk = (entries, parent, where) => {
    for (const e of entries) {
      if (e.k) {
        const head = e.k.split('.')[0];
        const ok = STRUCT.has(e.k) || ARG.has(e.k) || triggers.has(e.k) || effects.has(e.k) || mine.has(e.k) || outside.has(e.k) || SCOPE_HEAD.has(head) || VAR_PARENT.has(parent) || tags.has(e.k) || /^(GFX|zin_)/.test(e.k) && VAR_PARENT.has(parent);
        if (!ok) bad.push(`${where}: ${e.k}`);
      }
      if (Array.isArray(e.v)) walk(e.v, e.k, where);
    }
  };
  for (const s of result.scripts) walk(parse(s.text), null, s.where);
  assert.deepEqual(bad, []);
  assert(result.scripts.length > 100, 'the scripts are recorded for the check');
});

test('Negative: a key the game does not define is caught by the vocabulary check', () => {
  const fragment = parse('OR = { is_not_a_real_trigger = yes }');
  const bad = [];
  const walk = (entries, parent) => { for (const e of entries) { if (e.k && !STRUCT.has(e.k) && !triggers.has(e.k) && !effects.has(e.k)) bad.push(e.k); if (Array.isArray(e.v)) walk(e.v, e.k); } };
  walk(fragment);
  assert.deepEqual(bad, ['is_not_a_real_trigger']);
});

test('Every modifier written is a real game modifier; an unknown one fails the build', async () => {
  const d = clone(); d.subjects.autonomy[1].modifier.not_a_real_modifier = 1;
  await assert.rejects(build({ diplomacyData: d }), /Unknown modifier not_a_real_modifier/);
  const e = clone(); e.base.engineRules[2].modifier.stability_factor_x = 0.1;
  await assert.rejects(build({ diplomacyData: e }), /Unknown modifier stability_factor_x/);
});

test('Dependencies on other modules are listed, and none of them is something this module defines', () => {
  const names = new Set(result.dependencies.map(d => d.name));
  for (const n of ['zin_leren_is_north_crown', 'zin_leren_is_dark_shore', 'zin_cold_is_clan_realm', 'zin_elves_is_magical_realm', 'zin_sun_is_lands_of_the_sun_country', 'zin_afrit_rules_here', 'zin_afrit_is_hub', 'zin_is_region_middle_lands', 'zin_is_region_dead_lands', 'zin_concord_loyalty', 'occupied_countries.2']) assert(names.has(n), n);
  for (const t of result.definitions.triggers) assert(!names.has(t), t);
  assert(!names.has('zin_diplo_refusal_binds'));
});

// -------------------------------------------------------------------------------------------------------- localisation
test('Localisation files are UTF-8 with BOM and l_english, one key per line', () => {
  for (const rel of ['localisation/replace/zin_leagues_l_english.yml', 'localisation/english/zin_leagues_l_english.yml']) {
    const bytes = staged.files.get(rel);
    assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf], `${rel}: BOM`);
    assert(bytes.toString('utf8').replace(/^﻿/, '').startsWith('l_english:\n'));
  }
  assert(replaceLoc.size > 500 && englishLoc.size > 150);
});

test('Every key in the replace file exists in the installed game, keeps its placeholders and says something new', () => {
  const missing = [], lost = [], same = [];
  const slots = s => [...s.matchAll(/\$[^$\s]*\$/g)].map(m => m[0]);
  for (const [k, v] of replaceLoc) {
    const van = vanillaLoc.get(k);
    if (!van) { missing.push(k); continue; }
    for (const s of slots(van.value.replace(/\\n/g, '\n'))) if (!v.includes(s)) lost.push(`${k} lost ${s}`);
    if (van.value.replace(/\\n/g, '\n') === v) same.push(k);
  }
  assert.deepEqual(missing, [], 'keys the game does not define');
  assert.deepEqual(lost, [], 'engine placeholders dropped');
  assert.deepEqual(same, [], 'equals the vanilla value (check C5)');
});

test('ZIN-only keys never collide with a vanilla key', () => {
  assert.deepEqual([...englishLoc.keys()].filter(k => vanillaLoc.has(k)), []);
  for (const k of englishLoc.keys()) assert(!replaceLoc.has(k), `${k} in both files`);
});

test('Every definition has text: leagues, rules, groups, goals, oaths, upgrades, states, laws, sharing, collections, causes', () => {
  const need = [];
  for (const t of result.definitions.templates) need.push(t === 'faction_template_generic' ? 'zin_faction_generic' : t);
  need.push(...result.definitions.rules, ...result.definitions.groups, ...result.definitions.upgrades, ...result.definitions.autonomy, ...result.definitions.laws, ...result.definitions.resistance);
  for (const g of result.definitions.goals) need.push(`${g}_name`, `${g}_desc`);
  for (const m of result.definitions.manifests) need.push(`${m}_name`, `${m}_desc`);
  for (const s of result.definitions.sharing) need.push(`${s}_name`, `${s}_desc`);
  for (const c of result.definitions.collections) need.push(`ZIN_COLLECTION_${c.replace(/^zin_/, '').toUpperCase()}`);
  for (const cb of ['broken_truce', 'old_grudge', 'caravan_roads', 'orc_raids', 'crown_defied', 'against_the_dark', 'eastern_ambition', 'free_east', 'high_king', 'hold_defiance']) need.push(`zin_cb_${cb}`, `zin_cb_${cb}_desc`);
  for (const k of need) assert(allLoc(k), `no text for ${k}`);
  assert(englishLoc.has('RULE_DESC_ZIN_SUBJECT') && englishLoc.get('RULE_DESC_ZIN_SUBJECT').includes('$DESC$'));
});

test('The interface strings of this family are re-themed: actions, causes of war, council, subjects', () => {
  assert.equal(replaceLoc.get('DIPLOMACY_NONAGGRESSIONPACT_TITLE'), 'Oath of Peace');
  assert.equal(replaceLoc.get('DIPLOMACY_GUARANTEE_TITLE'), 'Pledge of Protection');
  assert.equal(replaceLoc.get('DIPLOMACY_MILACC_TITLE'), 'Ask for a Right of Passage');
  assert.equal(replaceLoc.get('DIPLOMACY_SEND_ATTACHE_TITLE'), 'Send Lent Captains');
  assert.equal(replaceLoc.get('DIPLOMACY_STAGE_COUP_TITLE'), 'Foment a Usurpation');
  assert.equal(replaceLoc.get('DIPLOMACY_EMBARGO_TITLE'), 'Close the Roads');
  assert.equal(replaceLoc.get('autonomy_puppet'), 'Vassal');
  assert.equal(replaceLoc.get('annex_everything'), 'Absorb');
  assert.equal(replaceLoc.get('PEACE_CONFERENCE_NAME'), 'Peace Council of $CAPITAL$');
  assert.equal(replaceLoc.get('PEACE_WARGOALS'), 'Causes of War');
  assert(![...replaceLoc.values()].some(v => /Allies|Axis|Comintern|lend[- ]lease|Faction\b|World Tension/i.test(playerText(v))), 'no leftover vanilla word');
});

test('No player text contains a word the sweep bans', () => {
  assert(banned.length > 100, 'banned_words.json is loaded');
  const hits = [];
  for (const [k, v] of [...replaceLoc, ...englishLoc]) { const h = wordHits(v, banned); if (h.length) hits.push(`${k}: ${h.join(' ')} -> ${playerText(v).slice(0, 90)}`); }
  assert.deepEqual(hits, []);
});

test('Negative: a modern word in text is caught (factory, tank, democracy, 1936)', () => {
  for (const w of ['The factory burns.', 'A tank is built.', 'Rule by democracy.', 'In 1936 the war began.', 'Lend-lease aid arrives.']) assert(wordHits(w, banned).length > 0, w);
  assert.deepEqual(wordHits('A host of riders crosses the Wall.', banned), []);
  assert.deepEqual(wordHits('The $COUNTRY|H$ keeps §Ya guild§! workshop.', banned), [], 'placeholders and colour codes are not text');
});

// ------------------------------------------------------------------------------------------------- negative data tests
test('Negative: a duplicate id fails validation', () => {
  const d = clone(); d.base.goals.push(structuredClone(d.base.goals[0]));
  assert(problemsOf(d).some(p => /Duplicate goal id zin_faction_goal_grow_the_league/.test(p)));
  const e = clone(); e.subjects.autonomy.push(structuredClone(e.subjects.autonomy[1]));
  assert(problemsOf(e).some(p => /Duplicate autonomy id/.test(p)));
});

test('Negative: a missing prerequisite fails validation (rule, goal, oath, upgrade, group member)', () => {
  const a = clone(); a.base.factions[0].rules.join.push('nonexistent');
  assert(problemsOf(a).some(p => /joining rule nonexistent, which is not defined/.test(p)));
  const b = clone(); b.base.factions[0].goals.push('nonexistent');
  assert(problemsOf(b).some(p => /goal nonexistent/.test(p)));
  const c = clone(); c.base.factions[0].manifest = 'nonexistent';
  assert(problemsOf(c).some(p => /manifest nonexistent/.test(p)));
  const d = clone(); d.base.ruleGroups[0].rules.push('no_such_rule');
  assert(problemsOf(d).some(p => /lists rule no_such_rule/.test(p)));
  const e = clone(); e.base.engineRules.push({ id: 'war_declaration_rule_orphan', type: 'war_declaration_rules', name: 'Orphan', ai: ['base = 0'] });
  assert(problemsOf(e).some(p => /war_declaration_rule_orphan is in no rule group/.test(p)));
  const f = clone(); f.base.engineRules.find(r => r.id === 'manpower_contribution_small').effect = ['set_faction_member_upgrade_min = {', 'upgrade = faction_manpower_sharing9', '}'];
  assert(problemsOf(f).some(p => /sets an upgrade that is not defined/.test(p)));
  const g = clone(); g.base.engineRules.find(r => r.id === 'faction_peace_rule_no_puppeting').peaceMods = ['no_such_cost'];
  assert(problemsOf(g).some(p => /cost modifier no_such_cost/.test(p)));
});

test('Negative: a vanilla name used as a definition fails validation', () => {
  const a = clone(); a.base.engineRules.push({ id: 'joining_rule_non_fascist', type: 'joining_rules', name: 'x', ai: ['base = 0'] });
  assert(problemsOf(a).some(p => /Vanilla rule id joining_rule_non_fascist/.test(p)));
  const b = clone(); b.subjects.autonomy.push({ ...structuredClone(b.subjects.autonomy[1]), id: 'autonomy_satellite', min_freedom_level: 0.8 });
  assert(problemsOf(b).some(p => /autonomy_satellite must be autonomy_puppet or start with zin_autonomy_/.test(p)));
  assert(VANILLA_ID.test('faction_goal_a_military_base') && VANILLA_ID.test('faction_manifest_strength_in_unity') && !VANILLA_ID.test('faction_goal_unlock_research'));
  const c = clone(); c.base.goals[0].id = 'faction_goal_growing_the_faction';
  assert(problemsOf(c).some(p => /Vanilla goal id/.test(p)));
});

test('Negative: the engine\'s required autonomy and law keys cannot be dropped', () => {
  const a = clone(); a.subjects.autonomy = a.subjects.autonomy.filter(x => x.id !== 'autonomy_puppet');
  assert(problemsOf(a).some(p => /autonomy_puppet must stay defined as the default/.test(p)));
  const b = clone(); b.subjects.autonomy[1].default = true;
  assert(problemsOf(b).some(p => /Exactly one autonomy state must be the default/.test(p)));
  const c = clone(); c.subjects.autonomy[2].min_freedom_level = c.subjects.autonomy[1].min_freedom_level;
  assert(problemsOf(c).some(p => /share a min_freedom_level/.test(p)));
  const d = clone(); d.subjects.occupation = d.subjects.occupation.filter(x => x.id !== 'forced_labor_occupation');
  assert(problemsOf(d).some(p => /names forced_labor_occupation/.test(p)));
  const e = clone(); e.subjects.occupation.forEach(l => { delete l.default; });
  assert(problemsOf(e).some(p => /Exactly one occupation law must be default_law/.test(p)));
  const f = clone(); f.base.fallbackTemplate.id = 'faction_template_other';
  assert(problemsOf(f).some(p => /must keep the engine key faction_template_generic/.test(p)));
});

test('Negative: an unknown country, rule type or peace action fails', async () => {
  const a = clone(); a.base.factions[0].leader = 'Atlantis';
  assert(problemsOf(a).some(p => /leader Atlantis/.test(p)));
  const b = clone(); b.base.engineRules[0].type = 'made_up_rules';
  assert(problemsOf(b).some(p => /unknown type made_up_rules/.test(p)));
  const c = clone(); c.peace.costs[0].types = ['annex'];
  assert(problemsOf(c).some(p => /unknown action annex/.test(p)));
  const d = clone(); d.peace.costs[0].mult = 0;
  assert(problemsOf(d).some(p => /multiplier above 0/.test(p)));
  const e = clone(); e.base.manifests.find(m => m.free_of).free_of = 'Atlantis';
  assert(problemsOf(e).some(p => /Atlantis, which is not in the roster/.test(p)));
  const f = clone(); f.base.goals[0].category = 'eternal';
  assert(problemsOf(f).some(p => /unknown category eternal/.test(p)));
  const g = clone(); g.base.joiningRules[0].trigger = ['is_subject_of = TAG[Atlantis]'];
  await assert.rejects(build({ diplomacyData: g }), /Country not in the roster: Atlantis/);
  await assert.rejects(build({ diplomacyData: a }), /Diplomacy data is invalid/);
});

test('Negative: the same file staged twice is refused, and a key written twice in text is refused', async () => {
  const s = new Staged(); await buildDiplomacy(s, { countries });
  await assert.rejects(buildDiplomacy(s, { countries }), /Duplicate staged file/);
  const d = clone(); d.text.english.zin_faction_concord = 'Twice';
  await assert.rejects(build({ diplomacyData: d }), /Duplicate localisation key zin_faction_concord/);
});

test('Externals: a rule, template or state another module writes is listed but not defined here', async () => {
  const { staged: s, result: r } = await build({ diplomacy: { externalRules: ['zin_faction_rule_join_elven_kin', 'zin_faction_rule_join_sun_realms'], externalTemplates: ['zin_faction_kindred'], externalAutonomy: ['zin_autonomy_tributary_hold'] } });
  const rules = parse(s.files.get('common/factions/rules/zin_factions.txt').toString('utf8')).map(x => x.k);
  assert(!rules.includes('zin_faction_rule_join_elven_kin') && !rules.includes('zin_faction_rule_join_sun_realms'));
  const group = parse(s.files.get('common/factions/rules/groups/zin_factions.txt').toString('utf8')).find(g => g.k === 'zin_rule_group_joining').v[0].v;
  assert.equal(group.length, 17, 'the group still lists all seventeen');
  assert(!r.definitions.templates.includes('zin_faction_kindred'));
  assert(!r.definitions.autonomy.includes('zin_autonomy_tributary_hold'));
  assert.equal(r.counts.autonomyStates, 4);
});

test('The result names the roster of start leagues for the politics step', () => {
  assert.deepEqual(result.factions.map(f => f.leaderTag).sort(), ['Aenor', 'Lerendor', 'Coldor', 'Noris', 'Stabilo', 'Dondor', 'Volgan'].map(n => roster.tag(n)).sort());
});

test('Collections: twelve regions, the held collections the oaths read, and the lost cores of a league', () => {
  const colls = defined('common/collections/zin_regions.txt');
  for (const k of ['middle_lands', 'north_lands', 'cold_lands', 'west_lands', 'tritons_islands', 'dark_lands', 'magical_lands', 'zols_mistake', 'dead_lands', 'east_lands', 'islands_of_the_south', 'lands_of_the_sun']) assert(colls.includes(`zin_region_${k}`), k);
  for (const k of ['zin_region_north_lands_held', 'zin_region_cold_lands_held', 'zin_region_east_lands_held', 'zin_region_dead_lands_held', 'zin_region_magical_lands_held', 'zin_region_middle_lands_coast', 'zin_region_middle_lands_coast_held', 'zin_region_dark_lands_free', 'zin_faction_cores_lost']) assert(colls.includes(k), k);
  assert(text('common/collections/zin_regions.txt').includes(`controller = { tag = ${roster.tag('Goldoroth')} }`));
});
