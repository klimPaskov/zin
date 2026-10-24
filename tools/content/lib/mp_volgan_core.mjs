// Scripted triggers and effects of the Volgan and Mirolon mechanic (docs/specs/04_mechanics/volgan_southern_dominion.md).
// V is the context built by modules/mech_volgan.mjs: the kit, the resolved tags, the number lookup N and small script helpers.
import { ge, gt, le, lt, eq, bump, call, afterDateTrigger } from './mp_kit.mjs';

export function writeTriggers(V) {
  const { K, N, VOL, MIR, HEREZ, ZOL, members, dead, dark, middle, ownerOr, exists, volHeld, ST, VL } = V;
  const trig = [];
  const T_ = (name, body, note) => trig.push(K.trigger(name, body, note));
  const volIs = body => `${exists(VOL)}\n${VOL} = {\n${body}\n}`;
  T_('zin_is_volgan', `original_tag = ${VOL}`, 'Generated tag check (read by the interface).');
  T_('zin_is_mirolon', `original_tag = ${MIR}`, 'Generated tag check (read by the interface).');
  T_('zin_dominion_is_member', ownerOr(members), 'Demon, Dolon or Nezer: the sworn realms of the Southern Dominion.');
  T_('zin_dominion_is_dark_lands_country', ownerOr(dark.map(c => c.tag)), 'Generated: the roster\'s Dark Lands countries.');
  T_('zin_dominion_is_ember_lands_country', ownerOr(dead.map(c => c.tag)), 'Generated: the roster\'s Ember Lands countries.');
  T_('zin_dominion_is_free_dead_realm', `zin_dominion_is_ember_lands_country = yes\nNOT = { original_tag = ${VOL} }\nNOT = { original_tag = ${MIR} }\nNOT = { is_subject_of = ${VOL} }`, 'A free Ember Lands realm: not Volgan, not Mirolon, not Volgan\'s subject.');
  T_('zin_dominion_is_middle_lands_state', `OR = {\n${middle.map(c => `is_core_of = ${c.tag}`).join('\n')}\n}`, 'State scope: a core of any roster Middle Lands country (the key sites region trigger may replace it with the same states).');
  T_('zin_dominion_is_bound_by_the_dead', 'OR = {\nhas_country_flag = zin_people_orcs\nhas_country_flag = zin_people_trolls\n}', 'Scope: a country of orcs or trolls (goblins are orcs today): the Dark Lands acceptance table doubles them.');
  for (const [date, key] of Object.entries(N('pace.dates'))) { trig.push(afterDateTrigger(`zin_dominion_after_${key}`, date)); K.def('trigger', `zin_dominion_after_${key}`); }
  T_('zin_volgan_hosts_stirring', volIs(ge(ST, N('strength.stirring'))));
  T_('zin_volgan_hosts_ready', volIs(ge(ST, N('strength.ready'))));
  T_('zin_volgan_great_host', volIs(`OR = {\n${ge(ST, N('strength.great'))}\nAND = {\nis_ai = yes\nzin_rules_is_historical = yes\nzin_dominion_after_1755_04 = yes\n${ge(ST, N('strength.great_ai'))}\n}\n}`), 'Strength 70, or 60 for the historical AI after 1 Rainwake 4A 1755.');
  T_('zin_volgan_veil_intact', volIs(ge(VL, N('veil.band_rumoured'))));
  T_('zin_volgan_may_break_veil', volIs(`zin_dominion_after_1750_01 = yes\n${ge(ST, N('strength.break_veil_at'))}\nNOT = { has_war = yes }\nNOT = { has_global_flag = zin_volgan_body_destroyed }`));
  T_('zin_volgan_war_open', `OR = {\nhas_global_flag = zin_war_of_last_crowns\nAND = {\n${exists(VOL)}\n${VOL} = { has_country_flag = zin_volgan_veil_broken }\n}\n}`);
  const holdsAllPasses = `any_state = {\nzin_is_site_mirolon_seat = yes\ncontroller = { original_tag = ${VOL} }\n}\nNOT = {\nany_state = {\nzin_is_site_mirolon_passes = yes\nNOT = { controller = { original_tag = ${VOL} } }\n}\n}`;
  T_('zin_volgan_mirolon_taken', `OR = {\nNOT = { ${exists(MIR)} }\nAND = {\n${exists(MIR)}\n${MIR} = { is_subject_of = ${VOL} }\n}\nAND = {\n${exists(MIR)}\n${holdsAllPasses}\n}\n}`, 'Mirolon does not exist, or is Volgan\'s subject, or Volgan holds its capital and every pass state.');
  T_('zin_volgan_body_intact', 'NOT = { has_global_flag = zin_volgan_body_destroyed }');
  T_('zin_volgan_mirolon_clientable', `OR = {\nNOT = { ${exists(MIR)} }\nAND = {\n${exists(MIR)}\n${MIR} = { has_capitulated = yes }\n}\n}`, 'Mirolon is gone or has yielded: a client crown can be made of it.');
  T_('zin_mirolon_occupied', `any_state = {\nis_core_of = ${MIR}\ncontroller = { ${volHeld} }\n}`, 'Volgan or one of its subjects controls a Mirolon core state.');
  T_('zin_volgan_children_ready', `${volIs(`${gt('num_subjects', 3)}\n${ge(ST, N('strength.children'))}`)}\nNOT = { has_global_flag = zin_volgan_body_destroyed }\nNOT = { has_global_flag = zin_eindil_crowned }\nany_state = {\nzin_is_site_parim = yes\ncontroller = { ${volHeld} }\n}`, 'Children of Volgan: body intact, Parim held, four subjects, strength 60, Eindil not crowned (world systems read it; section 13).');
  T_('zin_volgan_tree_compact_open', `${exists(VOL)}\nNOT = { has_global_flag = zin_volgan_body_destroyed }\nany_country = {\nhas_character = zin_eindil\nhas_war_with = ${VOL}\nhas_war_with = ${ZOL}\n}`, 'Helper for the tree: Volgan\'s body intact, and Volgan and Zol both at war with the country that has zin_eindil.');
  T_('zin_volgan_tree_at_war_for_parim', `${exists(VOL)}\nany_state = {\nzin_is_site_parim = yes\ncontroller = { has_war_with = ${VOL} }\n}`, 'Helper for the tree: Volgan is at war with the controller of the Parim state.');
  T_('zin_volgan_tree_holds_parim', `any_state = {\nzin_is_site_parim = yes\ncontroller = { ${volHeld} }\n}`, 'Helper for the tree: Volgan or one of its subjects controls the Parim state.');
  T_('zin_mirolon_passes_held', `${exists(VOL)}\n${exists(MIR)}\n${MIR} = { has_war_with = ${VOL} }\nNOT = {\nany_state = {\nzin_is_site_mirolon_passes = yes\ncontroller = { original_tag = ${VOL} }\n}\n}`, 'Mirolon is at war with Volgan and Volgan holds no pass state.');
  T_('zin_dominion_compact_active', 'has_global_flag = zin_black_compact\nNOT = { has_global_flag = zin_black_compact_ended }', 'The Black Compact is in force (whichever event set it).');
  T_('zin_dominion_clash_ready', `${exists(VOL)}\n${exists(ZOL)}\nhas_global_flag = zin_volgan_marches\nhas_global_flag = zin_zol_rising\nNOT = { has_global_flag = zin_volgan_zol_clash }\nNOT = { ${VOL} = { has_war_with = ${ZOL} } }\n${VOL} = {\nany_controlled_state = {\nany_neighbor_state = { controller = { original_tag = ${ZOL} } }\n}\n}`, 'Volgan and Zol are not at war and their hosts border: the clash may begin (section 11).');
  K.add('common/scripted_triggers/zin_dominion.txt', trig.join('\n\n'));
}

export function writeEffects(V) {
  const { K, N, VOL, MIR, HEREZ, ZOL, DON, GALA, members, grave, abyss, hostGroup, exists, gd, inVol, inMir, newsAll, volHeld, ST, VL, NP, PF, PS } = V;
  const eff = [];
  const E_ = (name, body, note) => eff.push(K.effect(name, body, note));
  const regiments = (unit, rows, cols) => Array.from({ length: rows * cols }, (_, i) => `${unit} = { x = ${i % cols} y = ${Math.floor(i / cols)} }`).join('\n');
  const addStrength = (v, exempt) => call('zin_volgan_add_dominion_strength', exempt ? { value: v, exempt: 1 } : { value: v });
  const addOathAll = v => call('zin_volgan_add_oath', { target: -1, value: v });

  // ---- strength, veil, pact, oath
  E_('zin_volgan_refresh_strength', `set_variable = { zin_dominion_org = ${ST} }
multiply_variable = { zin_dominion_org = ${N('hosts.org')} }
set_variable = { zin_dominion_morale = ${ST} }
multiply_variable = { zin_dominion_morale = ${N('hosts.morale')} }
set_variable = { zin_dominion_recruit = ${ST} }
multiply_variable = { zin_dominion_recruit = ${N('hosts.recruit')} }
set_variable = { zin_dominion_training = ${ST} }
multiply_variable = { zin_dominion_training = ${N('hosts.training')} }
force_update_dynamic_modifier = yes`, 'Scope: Volgan. Recomputes the values of zin_dominion_hosts from strength.');
  E_('zin_volgan_add_dominion_strength', inVol(`set_temp_variable = { zin_volgan_t_gain = zin_arg_value }
if = {
limit = {
${gt('zin_volgan_t_gain', 0)}
${gt(ST, N('strength.halve_above'))}
${eq('zin_arg_exempt', 0)}
}
divide_temp_variable = { zin_volgan_t_gain = 2 }
}
set_temp_variable = { zin_arg_exempt = 0 }
add_to_variable = { ${ST} = zin_volgan_t_gain }
clamp_variable = { var = ${ST} min = 0 max = 100 }
if = {
limit = {
has_global_flag = zin_volgan_body_destroyed
NOT = { has_global_flag = zin_dominion_stirred }
}
clamp_variable = { var = ${ST} min = 0 max = ${N('strength.cap_after_body')} }
}
zin_volgan_refresh_strength = yes`), 'Any scope. Arguments: zin_arg_value, optional zin_arg_exempt (1 skips the halving above 75: the Great Muster and Mirolon\'s fall). Gains above 75 are halved; after the body breaks the cap is 40 (section 1).');
  E_('zin_volgan_add_veil', inVol(`${bump(VL, 'zin_arg_value', 0, 100)}
set_variable = { global.zin_volgan_veil_band = 0 }
if = { limit = { ${lt(VL, N('veil.band_hidden'))} } set_variable = { global.zin_volgan_veil_band = 1 } }
if = { limit = { ${lt(VL, N('veil.band_rumoured'))} } set_variable = { global.zin_volgan_veil_band = 2 } }
if = { limit = { ${lt(VL, N('veil.band_suspected'))} } set_variable = { global.zin_volgan_veil_band = 3 } }
if = {
limit = {
${lt(VL, N('veil.band_hidden'))}
NOT = { has_country_flag = zin_volgan_veil_70 }
}
set_country_flag = zin_volgan_veil_70
every_country = {
limit = {
OR = {
original_tag = ${MIR}
original_tag = ${HEREZ}
zin_dominion_is_free_dead_realm = yes
}
}
country_event = { id = zin_dominion.2 }
}
${gd(N('veil.rumour_gd'))}
}
if = {
limit = {
${lt(VL, N('veil.band_rumoured'))}
NOT = { has_country_flag = zin_volgan_veil_50 }
}
set_country_flag = zin_volgan_veil_50
${gd(N('veil.suspect_gd'))}
}
if = {
limit = {
${lt(VL, N('veil.band_suspected'))}
NOT = { has_country_flag = zin_volgan_veil_30 }
}
set_country_flag = zin_volgan_veil_30
${newsAll('zin_dominion.4')}
${gd(N('veil.seen_gd'))}
}`), 'Any scope. Argument: zin_arg_value. Adds to the veil, sets the global band mirror (0 Hidden, 1 Rumoured, 2 Suspected, 3 Seen) and fires each downward crossing once (section 2).');
  E_('zin_volgan_add_nether_pact', inVol(`${bump(NP, 'zin_arg_value', 0, 100)}
if = {
limit = {
has_country_flag = zin_volgan_nether_bent
${gt(NP, N('nether.cap_bent'))}
}
set_variable = { ${NP} = ${N('nether.cap_bent')} }
}
if = {
limit = {
${ge(NP, N('nether.gate_at'))}
NOT = { has_country_flag = zin_volgan_gate_pact }
}
set_country_flag = zin_volgan_gate_pact
}`), 'Any scope. Argument: zin_arg_value. Capped at 75 on the Bend road; the gate pact begins at 70 (section 5).');
  E_('zin_volgan_add_oath', `if = {
limit = { ${eq('zin_arg_target', -1)} }
${members.map(m => `if = {\nlimit = { ${exists(m)} }\n${m} = {\n${bump('zin_dominion_oath', 'zin_arg_value', 0, 100)}\n}\n}`).join('\n')}
}
else = {
var:zin_arg_target = {
${bump('zin_dominion_oath', 'zin_arg_value', 0, 100)}
}
}`, 'Any scope. Arguments: zin_arg_target (-1 every member, otherwise a member), zin_arg_value.');
  E_('zin_volgan_abyss_wait', `set_country_flag = { flag = zin_volgan_abyss_wait days = ${N('abyss.wait_days')} }`, 'Scope: Volgan. The wait before Descend Again (section 6).');
  E_('zin_volgan_muster_done', `add_to_variable = { zin_volgan_musters = 1 }
set_country_flag = { flag = zin_volgan_mustered days = ${N('muster.flag_days')} }`, 'Scope: Volgan. Every grave muster counts and stops the veil from recovering for 30 days.');

  // ---- grave hosts and the Abyss Host
  const unit = (name, group) => `division = "name = \\"${name}\\" division_template = \\"${name}\\" start_experience_factor = 0.4 start_equipment_factor = 0.7"\nowner = ${VOL}`;
  E_('zin_volgan_spawn_grave_host', inVol(`if = {
limit = { NOT = { has_template = "Grave Host" } }
division_template = {
name = "Grave Host"
division_names_group = ${hostGroup}
regiments = {
${regiments(grave, 4, 2)}
}
}
}
set_temp_variable = { zin_volgan_t_left = zin_arg_count }
while_loop_effect = {
limit = { ${gt('zin_volgan_t_left', 0)} }
subtract_from_temp_variable = { zin_volgan_t_left = 1 }
if = {
limit = { ${eq('zin_arg_where', 0)} }
random_state = {
limit = { zin_is_site_nafeher = yes }
create_unit = {
${unit('Grave Host')}
}
}
}
else = {
var:zin_arg_where = {
create_unit = {
${unit('Grave Host')}
}
}
}
}`), 'Any scope. Arguments: zin_arg_count, zin_arg_where (0 Nafeher, otherwise a state). Creates the "Grave Host" template if missing, then the divisions inside the state\'s scope.');
  E_('zin_volgan_spawn_abyss_host', inVol(`unlock_subunit = ${abyss}
if = {
limit = { NOT = { has_template = "Abyss Host" } }
division_template = {
name = "Abyss Host"
division_names_group = ${hostGroup}
regiments = {
${regiments(abyss, 3, 2)}
}
}
}
random_state = {
limit = { zin_is_site_nafeher = yes }
create_unit = {
${unit('Abyss Host')}
count = 2
}
}
set_country_flag = zin_volgan_abyss_host_spawned`), 'Any scope. Two Abyss Host divisions at Nafeher; the sub-unit is unlocked first (section 10).');

  // ---- tribute, spoils, clients, offers
  E_('zin_volgan_make_client', `if = {
limit = { country_exists = var:zin_arg_target }
${VOL} = { puppet = var:zin_arg_target }
}
else = {
${VOL} = { release_puppet = var:zin_arg_target }
}
${VOL} = { set_autonomy = { target = var:zin_arg_target autonomy_state = zin_autonomy_sworn_realm } }`, 'Any scope. Argument: zin_arg_target. A capitulated realm becomes Volgan\'s vassal; an annexed one is released as one, in the Sworn Realm autonomy (section 9).');
  E_('zin_volgan_tree_offer_spoils', `every_country = {
limit = {
zin_dominion_is_dark_lands_country = yes
${eq('zin_volgan_pact', 1)}
}
set_variable = { zin_volgan_offer_level = 2 }
country_event = { id = zin_dominion.8 }
}`, 'Helper for the Volgan tree: every Dark Lands country at pact 1 is offered the Pact of Spoils.');
  const bands = [100, 80, 60, 40, 20, 0, -20, -40, -60, -80, -101];
  E_('zin_volgan_tree_offer_oath', `set_temp_variable = { zin_volgan_t_offered = 0 }
${bands.map(b => `every_country = {
limit = {
zin_dominion_is_dark_lands_country = yes
${eq('zin_volgan_pact', 2)}
NOT = { has_country_flag = zin_volgan_oath_offered_tmp }
has_opinion = { target = ${VOL} value > ${b - 1} }
}
if = {
limit = { ${lt('zin_volgan_t_offered', N('dark.sworn_max'))} }
add_to_temp_variable = { zin_volgan_t_offered = 1 }
set_country_flag = zin_volgan_oath_offered_tmp
set_variable = { zin_volgan_offer_level = 3 }
country_event = { id = zin_dominion.8 }
}
}`).join('\n')}
every_country = {
limit = { has_country_flag = zin_volgan_oath_offered_tmp }
clr_country_flag = zin_volgan_oath_offered_tmp
}`, 'Helper for the Volgan tree: the three countries at pact 2 with the best opinion of Volgan are offered the oath (opinion bands of 20, best first; ties in roster order).');
  E_('zin_volgan_court_dark_lands', `if = {
limit = { ${eq('zin_arg_target', -2)} }
every_country = {
limit = {
zin_dominion_is_dark_lands_country = yes
zin_dominion_is_bound_by_the_dead = yes
NOT = { is_subject_of = ${VOL} }
NOT = { has_war_with = ${VOL} }
}
set_variable = { zin_volgan_offer_level = 1 }
country_event = { id = zin_dominion.8 }
}
}
else = {
var:zin_arg_target = {
set_variable = { zin_volgan_offer_level = 1 }
country_event = { id = zin_dominion.8 }
}
}`, 'Any scope. Argument: zin_arg_target (-2 every orc or troll Dark Lands country, otherwise one country). Sends the envoys\' offer (section 7).');
  E_('zin_volgan_tree_offer_compact', `if = {
limit = {
NOT = { has_global_flag = zin_black_compact }
${exists(ZOL)}
}
${ZOL} = { country_event = { id = zin_dominion.14 } }
}`, 'Helper for the Volgan tree: the one offer of the Black Compact (decision O4).');

  // ---- the war on Mirolon, the fall, the exile
  const calledMembers = members.map(m => `if = {
limit = {
${exists(m)}
${m} = { NOT = { has_war_with = ${MIR} } }
OR = {
${m} = { ${ge('zin_dominion_oath', N('court.member_oath'))} }
${VOL} = { has_country_flag = zin_volgan_war_council }
}
}
${m} = {
add_to_war = {
targeted_alliance = ${VOL}
enemy = ${MIR}
hostility_reason = asked_to_join
single_target_only = yes
}
}
}`).join('\n');
  E_('zin_dominion_war_started', `${inVol(`if = {
limit = { ${ge(VL, N('surprise.unready_veil'))} }
if = {
limit = { has_idea = zin_volgan_patience_of_ages }
add_timed_idea = { idea = zin_dominion_out_of_the_storms days = ${N('surprise.storms_days_patience')} }
}
else = {
add_timed_idea = { idea = zin_dominion_out_of_the_storms days = ${N('surprise.storms_days')} }
}
${inMir(`if = {\nlimit = { ${lt(PS, N('mirolon.unready_passes'))} }\nadd_timed_idea = { idea = zin_dominion_caught_unready days = ${N('surprise.unready_days')} }\n}`)}
}
if = {
limit = { ${lt(VL, N('surprise.forewarned_veil'))} }
${inMir(`add_timed_idea = { idea = zin_dominion_forewarned days = ${N('surprise.forewarned_days')} }`)}
}
${calledMembers}
country_event = { id = zin_dominion.10 }`)}
${inMir('country_event = { id = zin_dominion.10 }')}`, 'Any scope. Volgan has declared war on Mirolon: the surprise spirits, the members called into the war, the events (sections 2 and 9).');
  E_('zin_dominion_mirolon_falls', `if = {
limit = { NOT = { has_global_flag = zin_mirolon_fallen } }
set_global_flag = zin_mirolon_fallen
${inVol(`${addStrength(N('strength.mirolon_falls'), true)}\n${addOathAll(N('court.mirolon_falls_oath'))}`)}
${gd(N('war.gd_fall'))}
${newsAll('zin_dominion.11')}
}`, 'Any scope. Mirolon has fallen: flag, strength +10, oaths +10, Gathering Dark +5, the news (section 9).');
  const hostFallback = `if = {
limit = {
${exists(HEREZ)}
NOT = { ${HEREZ} = { has_war_with = ${VOL} } }
}
become_exiled_in = { target = ${HEREZ} legitimacy = 60 }
}
else_if = {
limit = {
any_country = {
zin_aenor_is_realm = yes
NOT = { has_war_with = ${VOL} }
}
}
random_country = {
limit = {
zin_aenor_is_realm = yes
NOT = { has_war_with = ${VOL} }
}
save_event_target_as = zin_dominion_exile_host
}
become_exiled_in = { target = event_target:zin_dominion_exile_host legitimacy = 60 }
}
else_if = {
limit = { ${exists(GALA)} }
become_exiled_in = { target = ${GALA} legitimacy = 60 }
}`;
  E_('zin_dominion_mirolon_capitulated', `if = {
limit = { ${exists(MIR)} }
${MIR} = {
if = {
limit = { has_country_flag = zin_mirolon_exile_ready }
${hostFallback}
country_event = { id = zin_dominion.24 }
}
}
}
if = {
limit = { zin_volgan_mirolon_taken = yes }
zin_dominion_mirolon_falls = yes
}`, 'Any scope. Mirolon yielded: its court goes into exile when the Exile Court is built, in Herez, else Aenor, else the Gala Elves; the fall is recorded (section 9).');

  // ---- the march
  E_('zin_volgan_wargoal_parim', inVol(`random_country = {
limit = {
any_owned_state = { zin_is_site_parim = yes }
NOT = { original_tag = ${VOL} }
}
save_event_target_as = zin_dominion_parim_holder
}
if = {
limit = { has_event_target = zin_dominion_parim_holder }
create_wargoal = { type = annex_everything target = event_target:zin_dominion_parim_holder }
if = {
limit = { NOT = { has_war_with = event_target:zin_dominion_parim_holder } }
declare_war_on = { target = event_target:zin_dominion_parim_holder type = annex_everything }
}
}`), 'Any scope. A cause of war on the country that holds Parim, and the declaration (section 10).');
  E_('zin_volgan_begin_march', `${inVol(`set_global_flag = zin_volgan_marches
${call('zin_volgan_add_veil', { value: -100 })}
${gd(N('war.gd_march'))}
${newsAll('zin_dominion.12')}
if = {
limit = { ${exists(HEREZ)} }
create_wargoal = { type = annex_everything target = ${HEREZ} }
}
zin_volgan_wargoal_parim = yes
every_country = {
limit = {
zin_dominion_is_dark_lands_country = yes
${eq('zin_volgan_pact', 3)}
}
add_to_faction = ${VOL}
}
every_country = {
limit = {
zin_dominion_is_dark_lands_country = yes
${eq('zin_volgan_pact', 2)}
}
give_military_access = ${VOL}
}
if = { limit = { has_idea = zin_volgan_veil_of_storms } remove_ideas = zin_volgan_veil_of_storms }
if = { limit = { has_idea = zin_volgan_storm_rites } remove_ideas = zin_volgan_storm_rites }
if = {
limit = { has_country_flag = zin_volgan_abyss_march }
zin_volgan_spawn_abyss_host = yes
}
every_country = {
limit = { has_country_flag = zin_dominion_tributary_friend }
country_event = { id = zin_dominion.28 }
}`)}`, 'Any scope. Section 10: the march north.');
  E_('zin_volgan_raise_northern_front', inVol(`every_country = {
limit = {
zin_dominion_is_dark_lands_country = yes
${eq('zin_volgan_pact', 3)}
}
give_military_access = ${VOL}
if = {
limit = { ${exists(DON)} any_neighbor_country = { original_tag = ${DON} } }
random_state = {
limit = { controller = { original_tag = ${DON} } }
add_claim_by = PREV
}
create_wargoal = { type = take_claimed_state target = ${DON} }
}
else = {
army_experience = 20
}
}`), 'Any scope. Section 10: every sworn Dark Lands country claims a Dondor state next to it, or earns experience.');
  E_('zin_volgan_take_field', inVol(`add_field_marshal_role = {
character = zin_volgan
skill = 6
attack_skill = 6
defense_skill = 4
planning_skill = 4
logistics_skill = 3
traits = { zin_trait_great_spirit_in_arms }
}`), 'Any scope. Section 10: Volgan takes the field (the engine never kills generals; only zin_volgan_destroy_body removes the role).');

  // ---- Zol and the compact
  E_('zin_volgan_strike_zol', inVol(`if = {
limit = {
${exists(ZOL)}
NOT = { has_war_with = ${ZOL} }
}
random_state = {
limit = {
controller = { original_tag = ${ZOL} }
any_neighbor_state = { controller = { ${volHeld} } }
}
add_claim_by = ${VOL}
}
create_wargoal = { type = take_claimed_state target = ${ZOL} }
declare_war_on = { target = ${ZOL} type = take_claimed_state }
}`), 'Any scope. "Then we break them too": Volgan declares on Zol over a claimed state (no annexation goal). The pulse sets zin_volgan_zol_clash.');
  E_('zin_dominion_end_compact', `if = {
limit = { zin_dominion_compact_active = yes }
set_global_flag = zin_black_compact_ended
${inVol(`diplomatic_relation = { country = ${ZOL} relation = military_access active = no }
if = { limit = { has_idea = zin_volgan_two_darks } remove_ideas = zin_volgan_two_darks }
country_event = { id = zin_dominion.23 }`)}
if = {
limit = { ${exists(ZOL)} }
${ZOL} = {
diplomatic_relation = { country = ${VOL} relation = military_access active = no }
country_event = { id = zin_dominion.23 }
}
}
}`, 'Any scope. The compact ends when the body breaks or Zol withdraws; neither side declares war on the other (section 11).');
  E_('zin_dominion_champion_falls', `${inVol('add_timed_idea = { idea = zin_dominion_champion_falls days = 180 }')}
set_global_flag = zin_volgan_struck_down_eindil`, 'Any scope. The first duel, Volgan\'s side (section 12); called by zin_dominion.16.');

  // ---- the broken body
  E_('zin_dominion_member_breaks_free', `set_temp_variable = { zin_volgan_t_member = THIS }
if = {
limit = { is_subject_of = ${VOL} }
${VOL} = { end_puppet = var:zin_volgan_t_member }
}
if = {
limit = { is_in_faction_with = ${VOL} }
leave_faction = yes
}`, 'Scope: a member. It goes its own way when the body breaks (section 4); called by zin_dominion.18 and by the AI rule of zin_volgan_destroy_body.');
  E_('zin_dominion_let_mirolon_go', inVol(`if = {
limit = {
${exists(MIR)}
has_war_with = ${MIR}
}
white_peace = ${MIR}
}
every_state = {
limit = {
is_core_of = ${MIR}
controller = { ${volHeld} }
}
transfer_state_to = ${MIR}
}`), 'Any scope. The Steward lets Mirolon go: white peace and its cores back (section 12); called by zin_dominion.19.');
  E_('zin_dominion_hold_mirolon', inVol(`every_state = {
limit = {
is_core_of = ${MIR}
controller = { original_tag = ${VOL} }
}
add_resistance = 15
}`), 'Any scope. The Steward holds what was taken; the cores of Mirolon rise (section 12); called by zin_dominion.19.');
  E_('zin_volgan_steward_rule', inVol(`add_country_leader_role = {
character = zin_volgan_ember_herald
promote_leader = yes
country_leader = {
ideology = zin_shadow_dread
expire = "1965.1.1.1"
traits = { zin_trait_dread_lord }
}
}
set_country_flag = zin_volgan_silent_throne
if = {
limit = { NOT = { has_idea = zin_dominion_silent_throne } }
add_ideas = zin_dominion_silent_throne
}`), 'Any scope. Sets the Steward\'s ideology and the Silent Throne (section 12).');
  E_('zin_volgan_destroy_body', `if = {
limit = { NOT = { has_global_flag = zin_volgan_body_destroyed } }
set_global_flag = zin_volgan_body_destroyed
${newsAll('zin_dominion.17')}
${inVol(`remove_country_leader_role = { character = zin_volgan ideology = zin_shadow_dread }
remove_unit_leader_role = { character = zin_volgan }
zin_volgan_steward_rule = yes
if = { limit = { ${gt(ST, N('strength.body_floor'))} } set_variable = { ${ST} = ${N('strength.body_floor')} } }
clamp_variable = { var = ${ST} min = 0 max = ${N('strength.cap_after_body')} }
zin_volgan_refresh_strength = yes
damage_units = { limit = { original_tag = ${VOL} } org_damage = 0.5 str_damage = 0.25 ratio = yes army = yes }
add_timed_idea = { idea = zin_dominion_broken_host days = 365 }
if = { limit = { has_idea = zin_volgan_host_of_first_age } remove_ideas = zin_volgan_host_of_first_age }
if = { limit = { has_idea = zin_volgan_one_dominion } remove_ideas = zin_volgan_one_dominion }
if = { limit = { has_idea = zin_volgan_gates_opened } remove_ideas = zin_volgan_gates_opened }
if = { limit = { has_idea = zin_volgan_two_darks } remove_ideas = zin_volgan_two_darks }
${addOathAll(N('court.body_oath'))}`)}
${members.map(m => `if = {
limit = { ${exists(m)} }
if = {
limit = { ${m} = { is_ai = no } }
${m} = { country_event = { id = zin_dominion.18 } }
}
else_if = {
limit = { ${m} = { ${lt('zin_dominion_oath', N('court.keep_at'))} } }
${m} = { zin_dominion_member_breaks_free = yes }
}
}`).join('\n')}
every_country = {
limit = {
zin_dominion_is_dark_lands_country = yes
${gt('zin_volgan_pact', 0)}
}
add_to_variable = { zin_volgan_pact = -${N('dark.body_drop')} }
clamp_variable = { var = zin_volgan_pact min = 0 max = 3 }
}
${gd(N('war.gd_body'))}
zin_dominion_end_compact = yes
if = {
limit = { zin_mirolon_occupied = yes }
${inVol(`if = {
limit = { is_ai = yes }
random_list = {
90 = { zin_dominion_let_mirolon_go = yes }
10 = { zin_dominion_hold_mirolon = yes }
}
}
else = {
country_event = { id = zin_dominion.19 }
}`)}
}
${inVol(`if = {
limit = { is_ai = yes }
every_enemy_country = {
limit = { NOT = { zin_dominion_is_ember_lands_country = yes } }
country_event = { id = zin_dominion.26 days = 30 }
}
}
mark_focus_tree_layout_dirty = yes`)}
${inMir('mark_focus_tree_layout_dirty = yes')}
${members.map(m => `if = {\nlimit = { ${exists(m)} }\n${m} = { mark_focus_tree_layout_dirty = yes }\n}`).join('\n')}
}`, 'Any scope. The body breaks (section 12): the leader roles are removed (he is not killed), the Steward rules, the hosts reel, the members are tested, the compact ends. A second call does nothing.');

  // ---- Mirolon's watch
  const levelLoop = `set_temp_variable = { zin_mirolon_t_level = 1 }
set_temp_variable = { zin_mirolon_t_cut = ${N('mirolon.per_level')} }
while_loop_effect = {
limit = {
check_variable = { var = ${PS} value = zin_mirolon_t_cut compare = greater_than_or_equals }
${lt('zin_mirolon_t_level', N('mirolon.forts_max'))}
}
add_to_temp_variable = { zin_mirolon_t_level = 1 }
add_to_temp_variable = { zin_mirolon_t_cut = ${N('mirolon.per_level')} }
}`;
  E_('zin_mirolon_raise_pass_forts', inMir(`${levelLoop}
while_loop_effect = {
limit = { check_variable = { var = zin_mirolon_fort_level value = zin_mirolon_t_level compare = less_than } }
add_to_variable = { zin_mirolon_fort_level = 1 }
every_state = {
limit = {
zin_is_site_mirolon_passes = yes
controller = { original_tag = ${MIR} }
}
add_building_construction = {
type = bunker
level = 1
instant_build = yes
province = { all_provinces = yes limit_to_border = yes }
}
}
}`), 'Any scope. Raises the bunker level of the pass states Mirolon controls to floor(passes / 20) + 1, up to 6, one level at a time; forts are never removed (section 8).');
  E_('zin_mirolon_add_passes', `${inMir(`${bump(PS, 'zin_arg_value', 0, 100)}\nzin_mirolon_raise_pass_forts = yes`)}`, 'Any scope. Argument: zin_arg_value.');
  E_('zin_mirolon_add_proof', inMir(`set_temp_variable = { zin_mirolon_t_gain = zin_arg_value }
if = {
limit = {
${gt('zin_mirolon_t_gain', 0)}
${ge('global.zin_volgan_veil_band', 2)}
}
multiply_temp_variable = { zin_mirolon_t_gain = 2 }
}
${bump(PF, 'zin_mirolon_t_gain', 0, 100)}
if = {
limit = {
${ge(PF, N('mirolon.proof_25'))}
NOT = { has_country_flag = zin_mirolon_proof_25 }
}
set_country_flag = zin_mirolon_proof_25
every_country = {
limit = {
OR = {
original_tag = ${HEREZ}
zin_dominion_is_free_dead_realm = yes
}
}
country_event = { id = zin_dominion.3 }
}
}
if = {
limit = {
${ge(PF, N('mirolon.proof_50'))}
NOT = { has_country_flag = zin_mirolon_proof_50 }
}
set_country_flag = zin_mirolon_proof_50
}
if = {
limit = {
${ge(PF, N('mirolon.proof_75'))}
NOT = { has_country_flag = zin_mirolon_proof_75 }
}
set_country_flag = zin_mirolon_proof_75
if = { limit = { has_idea = zin_mirolon_unheeded_warnings } remove_ideas = zin_mirolon_unheeded_warnings }
${gd(N('war.gd_proof'))}
${call('zin_volgan_add_veil', { value: N('veil.proof_75') })}
${newsAll('zin_dominion.27')}
}`), 'Any scope. Argument: zin_arg_value (doubled while the veil is below 50). Fires the thresholds 25, 50 and 75 once each (section 8).');
  const scoutOk = `${call('zin_mirolon_add_proof', { value: N('mirolon.scout_proof') })}\n${call('zin_volgan_add_veil', { value: N('veil.scout') })}`;
  E_('zin_mirolon_scout', inMir(`if = {
limit = { ${eq('global.zin_volgan_veil_band', 0)} }
random_list = {
${N('mirolon.lost_chance')} = {
${call('zin_mirolon_add_proof', { value: 1 })}
add_political_power = ${N('mirolon.lost_pp')}
country_event = { id = zin_dominion.6 }
}
${100 - N('mirolon.lost_chance')} = {
${scoutOk}
}
}
}
else = {
${scoutOk}
}`), 'Any scope. Send Scouts South: proof +5 and veil -3; with the veil hidden, three scouting parties in ten are lost (proof +1, 10 Authority, veil unchanged) (section 8).');
  E_('zin_mirolon_scorch', inMir(`every_state = {
limit = {
zin_is_site_mirolon_passes = yes
controller = { original_tag = ${MIR} }
}
damage_building = { type = infrastructure damage = ${N('mirolon.scorch')} }
}`), 'Any scope. Burn the Bridges: the roads of the pass states Mirolon controls are broken (section 8).');
  E_('zin_mirolon_raise_resistance', `every_state = {
limit = {
is_core_of = ${MIR}
controller = { ${volHeld} }
}
add_resistance = ${N('mirolon.resistance')}
}`, 'Any scope. The Hidden Mirolon: resistance in every Mirolon core state Volgan holds (section 8).');
  E_('zin_mirolon_restore', `if = {
limit = { ${exists(VOL)} ${VOL} = { has_country_flag = zin_volgan_silent_throne } }
${inVol('country_event = { id = zin_dominion.19 }')}
}
else = {
${inMir(`if = {
limit = { ${exists(VOL)} }
create_wargoal = { type = take_core_state target = ${VOL} }
}`)}
}`, 'Any scope. Mirolon asks for its homes: the Steward is asked, or Mirolon takes a cause of war for its cores (section 8).');
  K.add('common/scripted_effects/zin_dominion.txt', eff.join('\n\n'));
}
