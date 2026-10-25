// Tests of checks/engine_forms.mjs and of the C3 technology names (checks/vanilla_refs.mjs): each rule against the form the first
// integrated Linux run logged (docs/plans/zin-errors/r3b_profile.md) and against the form the builder writes instead.
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkEngineForms } from './checks/engine_forms.mjs';
import { definitions, references, danglingReferences } from './checks/vanilla_refs.mjs';

const tree = entries => new Map(Object.entries(entries).map(([k, v]) => [k, Buffer.from(v)]));
const rules = r => checkEngineForms(tree(r)).errors.map(e => e.rule);

test('rule_desc: a rule-level desc fails, option desc passes', () => {
  assert.deepEqual(rules({ 'common/game_rules/x.txt': 'zin_rule_a = {\n\tname = A\n\tdesc = A_DESC\n\tgroup = G\n\tdefault = { name = DEFAULT text = A_D desc = A_D_DESC }\n}\n' }), ['rule_desc']);
  assert.deepEqual(rules({ 'common/game_rules/x.txt': 'zin_rule_a = {\n\tname = A\n\tgroup = G\n\tdefault = { name = DEFAULT text = A_D desc = A_D_DESC }\n}\n' }), []);
});

test('opinion_var_target: target = var: fails; scoping to the variable and naming PREV passes', () => {
  assert.deepEqual(rules({ 'common/scripted_effects/x.txt': 'zin_x = {\n\tadd_opinion_modifier = { target = var:zin_arg_who modifier = m }\n}\n' }), ['opinion_var_target']);
  assert.deepEqual(rules({ 'common/scripted_effects/x.txt': 'zin_x = {\n\treverse_add_opinion_modifier = { target = var:global.zin_host modifier = m }\n}\n' }), ['opinion_var_target']);
  assert.deepEqual(rules({ 'common/scripted_effects/x.txt': 'zin_x = {\n\tvar:zin_arg_who = { reverse_add_opinion_modifier = { target = PREV modifier = m } }\n}\n' }), []);
});

test('effect_arguments: a ZIN scripted effect called with a block of KEY = value fails; temp variables and = yes pass', () => {
  const def = 'zin_politics_set_stance = { }\n';
  assert.deepEqual(rules({ 'common/scripted_effects/a.txt': def, 'common/scripted_effects/b.txt': 'zin_b = {\n\tzin_politics_set_stance = { STANCE = zin_dom_conquest }\n}\n' }), ['effect_arguments']);
  assert.deepEqual(rules({ 'common/scripted_effects/a.txt': def, 'common/scripted_effects/b.txt': 'zin_b = {\n\tset_temp_variable = { zin_arg_stance = 8 }\n\tzin_politics_set_stance = yes\n}\n' }), []);
});

test('convoy_types: a second convoy type fails', () => {
  const eq = types => `equipments = {\n\tconvoy = { is_archetype = yes type = convoy }\n${types.map(t => `\t${t} = { archetype = convoy }`).join('\n')}\n}\n`;
  assert.deepEqual(rules({ 'common/units/equipment/x.txt': eq(['convoy_0', 'convoy_1']) }), ['convoy_types']);
  assert.deepEqual(rules({ 'common/units/equipment/x.txt': eq(['convoy_1']) }), []);
});

test('recruit_on_actions: recruit_character in an on_action fails; history and the set_nationality move pass; other in-game calls are reported', () => {
  assert.deepEqual(rules({ 'common/on_actions/x.txt': 'on_actions = {\n\ton_startup = { effect = { AEN = { recruit_character = zin_a } } }\n}\n' }), ['recruit_on_actions']);
  assert.deepEqual(rules({ 'history/countries/AEN - Aenor.txt': 'capital = 1\nrecruit_character = zin_a\nset_politics = { }\n' }), []);
  const r = checkEngineForms(tree({ 'events/x.txt': 'country_event = {\n\tid = x.1\n\toption = { recruit_character = zin_a }\n}\n' }));
  assert.deepEqual([r.errors.length, r.reported.recruit_in_game], [0, ['events/x.txt:3']]);
  assert.deepEqual(rules({ 'events/x.txt': 'country_event = {\n\tid = x.1\n\toption = { if = { limit = { NOT = { has_character = zin_a } } zin_a = { set_nationality = PREV } } }\n}\n' }), []);
});

test('opinion_check_block: has_opinion_modifier with a target block fails; the targeted flag passes', () => {
  assert.deepEqual(rules({ 'common/scripted_triggers/x.txt': 'zin_x = {\n\thas_opinion_modifier = { target = FROM modifier = zin_m }\n}\n' }), ['opinion_check_block']);
  assert.deepEqual(rules({ 'common/scripted_triggers/x.txt': 'zin_x = {\n\thas_country_flag = zin_m_@FROM\n\thas_opinion_modifier = zin_m\n}\n' }), []);
});

test('decision_state_trigger: state_trigger in a decision fails; state_target passes', () => {
  const dec = k => `zin_cat = {\n\tzin_dec = {\n\t\t${k} = yes\n\t\ttarget_trigger = { FROM = { is_coastal = yes } }\n\t}\n}\n`;
  assert.deepEqual(rules({ 'common/decisions/x.txt': dec('state_trigger') }), ['decision_state_trigger']);
  assert.deepEqual(rules({ 'common/decisions/x.txt': dec('state_target') }), []);
});

test('trait_slot: a leader trait with slot fails', () => {
  assert.deepEqual(rules({ 'common/country_leader/x.txt': 'leader_traits = {\n\tzin_t = {\n\t\tslot = political_advisor\n\t\tstability_factor = 0.05\n\t}\n}\n' }), ['trait_slot']);
  assert.deepEqual(rules({ 'common/country_leader/x.txt': 'leader_traits = {\n\tzin_t = {\n\t\trandom = no\n\t\tstability_factor = 0.05\n\t}\n}\n' }), []);
});

test('iterator_as_effect: any_country in an effect fails; in its limit, a trigger or as every_country it passes', () => {
  assert.deepEqual(rules({ 'common/decisions/x.txt': 'zin_cat = {\n\tzin_dec = {\n\t\tcomplete_effect = {\n\t\t\tany_country = { limit = { tag = AEN } add_stability = 0.05 }\n\t\t}\n\t}\n}\n' }), ['iterator_as_effect']);
  assert.deepEqual(rules({ 'common/scripted_effects/x.txt': 'zin_x = {\n\tany_country = { limit = { tag = AEN } add_stability = 0.05 }\n}\n' }), ['iterator_as_effect']);
  assert.deepEqual(rules({ 'common/decisions/x.txt': 'zin_cat = {\n\tzin_dec = {\n\t\tavailable = { any_country = { tag = AEN } }\n\t\tcomplete_effect = {\n\t\t\tif = { limit = { any_country = { tag = AEN } } every_country = { limit = { tag = AEN } add_stability = 0.05 } }\n\t\t}\n\t}\n}\n' }), []);
});

test('random_list_trigger: a trigger block in a random_list option fails; modifier factor 0 passes', () => {
  assert.deepEqual(rules({ 'common/scripted_effects/x.txt': 'zin_x = {\n\trandom_list = {\n\t\t10 = { trigger = { has_country_flag = f } add_stability = 0.05 }\n\t\t10 = { }\n\t}\n}\n' }), ['random_list_trigger']);
  assert.deepEqual(rules({ 'common/scripted_effects/x.txt': 'zin_x = {\n\trandom_list = {\n\t\t10 = { modifier = { factor = 0 NOT = { has_country_flag = f } } add_stability = 0.05 }\n\t\t10 = { }\n\t}\n}\n' }), []);
});

test('market_strategy_id and bonus_enum: an archetype as a market id fails; the category passes; the bonus enum must match the staged equipment', () => {
  const enums = list => `script_enum_equipment_category = {\n\tinfantry\n\tsupport\n}\nscript_enum_equipment_bonus_type = {\n${list.map(k => `\t${k}`).join('\n')}\n}\n`;
  const eq = 'equipments = {\n\tzin_arms_equipment = { is_archetype = yes type = infantry }\n\tzin_arms_equipment_0 = { archetype = zin_arms_equipment }\n\tzin_hull_x = { is_archetype = yes alias = heavy_cruiser }\n}\n';
  const strat = id => `zin_s = {\n\tai_strategy = {\n\t\ttype = equipment_market_for_sale_threshold\n\t\tid = ${id}\n\t\tvalue = 10\n\t}\n}\n`;
  const good = enums(['infantry', 'support', 'zin_arms_equipment', 'zin_arms_equipment_0', 'zin_hull_x', 'heavy_cruiser']);
  assert.deepEqual(rules({ 'common/script_enums.txt': good, 'common/units/equipment/x.txt': eq, 'common/ai_strategy/x.txt': strat('zin_arms_equipment') }), ['market_strategy_id']);
  assert.deepEqual(rules({ 'common/script_enums.txt': good, 'common/units/equipment/x.txt': eq, 'common/ai_strategy/x.txt': strat('infantry') }), []);
  assert.deepEqual(rules({ 'common/script_enums.txt': enums(['infantry', 'support', 'zin_arms_equipment', 'zin_arms_equipment_0', 'zin_hull_x', 'infantry_equipment_1']), 'common/units/equipment/x.txt': eq }), ['bonus_enum', 'bonus_enum']);
});

test('tech_gridbox: a root technology of a folder needs its gridbox in the tree window; a path child does not', () => {
  const techs = 'technologies = {\n\tzin_tech_a = {\n\t\tpath = { leads_to_tech = zin_tech_b research_cost_coeff = 1 }\n\t\tfolder = { name = zin_arms_folder position = { x = 0 y = 0 } }\n\t}\n\tzin_tech_b = {\n\t\tfolder = { name = zin_arms_folder position = { x = 0 y = 2 } }\n\t}\n}\n';
  const gui = box => `guiTypes = {\n\tcontainerWindowType = {\n\t\tname = "countrytechtreeview"\n\t\tcontainerWindowType = {\n\t\t\tname = "zin_arms_folder"\n\t\t\tgridboxtype = {\n\t\t\t\tname = "${box}"\n\t\t\t\tslotsize = { width = 70 height = 70 }\n\t\t\t}\n\t\t}\n\t}\n}\n`;
  assert.deepEqual(rules({ 'common/technologies/x.txt': techs, 'interface/countrytechtreeview.gui': gui('zin_tech_a_tree') }), []);
  assert.deepEqual(rules({ 'common/technologies/x.txt': techs, 'interface/countrytechtreeview.gui': gui('infantry_weapons_tree') }), ['tech_gridbox']);
  assert.deepEqual(rules({ 'common/technologies/x.txt': techs }), ['tech_gridbox']);
});

test('strategy_state_trigger is reported, not enforced: state_trigger on a garrison strategy', () => {
  const r = checkEngineForms(tree({ 'common/ai_strategy/x.txt': 'zin_s = {\n\tai_strategy = {\n\t\ttype = garrison\n\t\tvalue = 50\n\t\tstate_trigger = { is_coastal = yes }\n\t}\n\tai_strategy = {\n\t\ttype = front_unit_request\n\t\tvalue = 50\n\t\tstate_trigger = { is_coastal = yes }\n\t}\n}\n' }));
  assert.deepEqual([r.errors.length, r.reported.strategy_state_trigger], [0, ['common/ai_strategy/x.txt:5']]);
});

test('ship_variant: a modular hull ship needs version_name and the variant in its country history', () => {
  const eq = 'equipments = {\n\tzin_hull_galley = { is_archetype = yes module_slots = { fixed_propulsion_slot = { required = yes } } }\n\tzin_hull_galley_0 = { archetype = zin_hull_galley }\n}\n';
  const oob = v => `units = {\n\tfleet = {\n\t\ttask_force = {\n\t\t\tship = { name = "A" definition = zin_ship_galley equipment = { zin_hull_galley_0 = { amount = 1 owner = AEN${v ? ` version_name = "${v}"` : ''} } } }\n\t\t}\n\t}\n}\n`;
  const hist = 'capital = 1\ncreate_equipment_variant = {\n\tname = "Oared Galley"\n\ttype = zin_hull_galley_0\n\tmodules = { fixed_propulsion_slot = zin_mod_oars }\n}\n';
  assert.deepEqual(rules({ 'common/units/equipment/x.txt': eq, 'history/units/AEN_world.txt': oob(null), 'history/countries/AEN - Aenor.txt': hist }), ['ship_variant']);
  assert.deepEqual(rules({ 'common/units/equipment/x.txt': eq, 'history/units/AEN_world.txt': oob('Other Galley'), 'history/countries/AEN - Aenor.txt': hist }), ['ship_variant']);
  assert.deepEqual(rules({ 'common/units/equipment/x.txt': eq, 'history/units/AEN_world.txt': oob('Oared Galley'), 'history/countries/AEN - Aenor.txt': hist }), []);
});

test('C3 technology names: a vanilla or short technology name in ZIN set_technology or has_tech dangles; a ZIN technology does not', () => {
  const tech = { rel: 'common/technologies/zin_arms.txt', source: 'mod', text: 'technologies = {\n\t@cost = 1\n\tzin_tech_iron_arms = { research_cost = 1 }\n}\n' };
  const hist = body => ({ rel: 'history/countries/AEN - Aenor.txt', source: 'mod', text: body });
  const universe = definitions([{ rel: 'common/technologies/infantry.txt', source: 'game', text: 'technologies = {\n\tinfantry_weapons = { }\n\ttech_support = { }\n}\n' }]);
  const dangling = files => danglingReferences(files, universe).filter(r => r.cat === 'technology').map(r => r.name).sort();
  assert.deepEqual(definitions([tech]).get('technology') && [...definitions([tech]).get('technology').keys()], ['zin_tech_iron_arms']);
  assert.deepEqual(dangling([tech, hist('set_technology = {\n\tinfantry_weapons = 1\n\ttech_support = 1\n}\n')]), ['infantry_weapons', 'tech_support']);
  assert.deepEqual(dangling([tech, hist('set_technology = {\n\tiron_arms = 1\n}\n')]), ['iron_arms']);
  assert.deepEqual(dangling([tech, hist('set_technology = {\n\tzin_tech_iron_arms = 1\n\tpopup = no\n}\n'), { rel: 'events/x.txt', source: 'mod', text: 'x = {\n\ttrigger = { has_tech = zin_tech_iron_arms }\n}\n' }]), []);
  assert.deepEqual(references([{ rel: 'events/x.txt', source: 'mod', text: 'x = {\n\ttrigger = { has_tech = basic_train }\n}\n' }], universe).map(r => `${r.cat}:${r.name}`), ['technology:basic_train']);
});
