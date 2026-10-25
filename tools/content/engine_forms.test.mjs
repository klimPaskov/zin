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

test('recruit_on_actions: recruit_character in an on_action fails; history passes; in-game effects are reported', () => {
  assert.deepEqual(rules({ 'common/on_actions/x.txt': 'on_actions = {\n\ton_startup = { effect = { AEN = { recruit_character = zin_a } } }\n}\n' }), ['recruit_on_actions']);
  assert.deepEqual(rules({ 'history/countries/AEN - Aenor.txt': 'capital = 1\nrecruit_character = zin_a\nset_politics = { }\n' }), []);
  const r = checkEngineForms(tree({ 'events/x.txt': 'country_event = {\n\tid = x.1\n\toption = { recruit_character = zin_a }\n}\n' }));
  assert.deepEqual([r.errors.length, r.reported.recruit_in_game], [0, ['events/x.txt:3']]);
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
