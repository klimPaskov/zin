// The elves, the Wall and the dragons (docs/specs/04_mechanics/elves_wall_and_dragons.md): the Kinship and the Kindred of the
// Woods, the Elven Refusal in play and the Wanderers, the Wall's daily quarrel, Herrodon and Andos Enda, Nolorim's passes,
// the roost bond with Dragon Mountain, Varner, the pilgrim roads and the answer to the eastern invasion.
//
//   const r = await buildElves(staged, { countries, table?, wards? })
//     countries  the roster (lib/roster.mjs)
//     table      Map tag -> { people, stance } (modules/countries.mjs loadCountryTable); derived from docs/design/countries.csv
//     wards      true to write Varner's research bonus (default: the staged technology tags hold zin_cat_wards)
//   returns { kit, counts }; throws on a text, id, picture or reference error.
//
// Data: data/mech_powers_elves.json (numbers, names, external references), data/mech_powers_elves_text.json (all text).
// The Kindred's faction template, joining rule and manifest are the diplomacy slice's (modules/diplomacy.mjs) and are not written here.
import { ZIN } from '../lib/paths.mjs';
import { loadCatalogKeys } from '../lib/inst_util.mjs';
import { Kit, loadMech, num, ge, gt, lt, eq, bump, call, afterDateTrigger, ai } from '../lib/mp_kit.mjs';

export async function buildElves(staged, ctx) {
  const { countries } = ctx;
  const D = await loadMech('mech_powers_elves.json'), T = await loadMech('mech_powers_elves_text.json');
  let table = ctx.table;
  if (!table) { const { loadCountryTable } = await import('./countries.mjs'); table = await loadCountryTable(countries, `${ZIN}/docs/design/countries.csv`); }
  const byName = new Map(countries.map(c => [c.name, c]));
  const tag = name => { const c = byName.get(name); if (!c) throw new Error(`Elves: country ${name} is not in the roster`); return c.tag; };
  const R = D.realms, MF = tag(R.magical_forest), HER = tag(R.herrodon), AND_ = tag(R.andos_enda), NOL = tag(R.nolorim), AEN = tag(R.aenor), KIN = tag(R.kingson), WOR = tag(R.worshipdom), GALA = tag(R.gala);
  const realms = countries.filter(c => c.scan === R.magical_scan && R.elf_peoples.includes(table.get(c.tag).people)).map(c => c.tag).sort();
  // The elves outside the Magical Lands: the Sunhot elves (people sun_elves) and the Gala Elves and any other elven-people realm of another sheet.
  const sun = countries.filter(c => !realms.includes(c.tag) && [...R.elf_peoples, ...R.sun_peoples].includes(table.get(c.tag).people)).map(c => c.tag).sort();
  for (const t of [MF, HER, AND_, NOL]) if (!realms.includes(t)) throw new Error(`Elves: ${t} is not a Magical Lands elven realm in the table`);
  const wards = ctx.wards ?? [...staged.files].some(([k, v]) => /^common\/technology_tags\//.test(k) && v.toString('utf8').includes('zin_cat_wards'));
  const catalog = new Set(await loadCatalogKeys());
  const K = new Kit('elves', D, T);
  const N = k => K.N(k);
  const art = key => { if (!catalog.has(key)) throw new Error(`Elves: icon ${key} is not in the catalog`); return key; };
  const KS = 'global.zin_elves_kinship', RV = 'global.zin_elves_rivalry', GR = 'global.zin_elves_wall_grievance', RB = 'global.zin_elves_roost_bond';
  const GD = 'global.zin_gathering_dark', WM = 'global.zin_elves_pass_watch_mirror';
  const ownerOr = list => `OR = {\n${list.map(t => `original_tag = ${t}`).join('\n')}\n}`;
  const news = (id, extra) => `every_country = {\nlimit = {\nis_ai = no\n${extra ?? ''}\n}\nnews_event = { id = ${id} }\n}`;
  const gd = v => call('zin_world_add_gathering_dark', { value: v });
  const exists = t => `country_exists = ${t}`;
  const inEast = 'capital_scope = { zin_is_region_east_lands = yes }';
  const holdsMagical = 'any_controlled_state = { zin_is_region_magical_lands = yes }';
  const wor = body => `if = {\nlimit = { country_exists = ${WOR} }\n${body}\n}`;

  // ============================================================================================ scripted triggers
  const trig = [];
  const T_ = (name, body, note) => trig.push(K.trigger(name, body, note));
  T_('zin_elves_is_magical_realm', ownerOr(realms), 'Generated: the Magical Lands elven realms (roster sheet Magical Lands, people elves).');
  T_('zin_elves_is_elven_country', `OR = {\nzin_elves_is_magical_realm = yes\n${sun.map(t => `original_tag = ${t}`).join('\n')}\n}`, 'Every elven realm: the Magical Lands elves and the elves of the Lands of the Sun (people elves or sun_elves). Tags, so a decision\'s allowed block can read it at the start.');
  T_('zin_elves_is_wall_realm', 'has_country_flag = zin_elves_wall_realm');
  T_('zin_elves_is_rift_realm', 'has_country_flag = zin_elves_rift_realm');
  T_('zin_elves_is_pilgrim_road_realm', 'has_country_flag = zin_elves_pilgrim_realm');
  T_('zin_elves_kindred_exists', 'has_global_flag = zin_elves_kindred_formed');
  T_('zin_elves_in_kindred', `has_global_flag = zin_elves_kindred_formed\nOR = {\nhas_country_flag = zin_elves_kindred_leader\nAND = {\nis_in_faction = yes\nany_allied_country = { has_country_flag = zin_elves_kindred_leader }\n}\n}`, 'The country leads the Kindred of the Woods or sits in the league its leader flag marks.');
  T_('zin_elves_realm_occupied', `has_war = yes\nany_owned_state = {\nNOT = { is_controlled_by = OWNER }\ncontroller = {\nNOT = { zin_elves_is_elven_country = yes }\n}\n}`, 'A realm at war whose state is held by a hand that is not elven.');
  T_('zin_elves_dark_power_holds_state', `any_owned_state = {\nNOT = { is_controlled_by = OWNER }\ncontroller = { zin_diplo_is_dark_power = yes }\n}`, 'A dark power holds one of the realm\'s states (the diplomacy slice\'s condition for Break the Refusal).');
  T_('zin_elves_kindred_ready', `NOT = { has_global_flag = zin_elves_kindred_formed }\nOR = {\n${ge(KS, N('kinship.ready'))}\nhas_global_flag = zin_eastern_invasion\nany_country = {\nzin_elves_is_magical_realm = yes\nzin_elves_realm_occupied = yes\n}\n}`, 'The Kindred does not exist and the woods may raise it (section 3.2).');
  T_('zin_elves_eastern_threat', `zin_elves_is_magical_realm = yes\nOR = {\nany_enemy_country = {\n${inEast}\n${holdsMagical}\n}\nAND = {\nzin_elves_is_rift_realm = yes\nhas_global_flag = zin_eastern_invasion\nany_enemy_country = { has_country_flag = zin_east_coalition_leader }\n}\n}`, 'An eastern host stands in the Magical Lands, or the coalition leader is at war with a rift realm.');
  T_('zin_elves_dragon_need', `zin_elves_is_magical_realm = yes\nOR = {\nany_enemy_country = { zin_diplo_is_dark_power = yes }\nzin_elves_eastern_threat = yes\n}`, 'The war condition of the Dragon Pact.');
  T_('zin_elves_marches_by_rule', `OR = {\nzin_rules_ai_branch_elves_march = yes\nAND = {\nzin_rules_ai_random_elves = yes\nhas_country_flag = zin_elves_ai_marcher\n}\n}`, 'The only reader of the elves\' march rule triggers (section 4.3).');
  trig.push(afterDateTrigger('zin_elves_date_question', D.numbers.dates.refusal_question)); K.def('trigger', 'zin_elves_date_question');
  trig.push(afterDateTrigger('zin_elves_date_feud', D.numbers.dates.feud_after)); K.def('trigger', 'zin_elves_date_feud');
  T_('zin_elves_refusal_question_open', `OR = {\nhas_global_flag = zin_golden_king_dead\nhas_global_flag = zin_eindil_named\nhas_global_flag = zin_eastern_invasion\nzin_elves_date_question = yes\n}`, 'The question of the Refusal is open (section 4.3).');
  T_('zin_elves_march_allowed', `zin_elves_date_question = yes\nOR = {\nAND = {\nzin_elves_dark_power_holds_state = yes\n${ge(GD, 75)}\n}\nAND = {\nzin_elves_marches_by_rule = yes\n${ge(GD, 75)}\nany_country = {\nzin_elves_is_elven_country = yes\nany_enemy_country = { zin_diplo_is_dark_power = yes }\n}\n}\nhas_global_flag = zin_kusven_forth\n}`, 'The woods may march (section 4.3); never before the question is open.');
  T_('zin_elves_tends_roosts', `OR = {\nhas_character = zin_magical_forest_perlan\nhas_idea = zin_magical_forest_wyrm_songs\nhas_idea = zin_shared_magical_lands_wyrm_songs\n}`, 'The Keeper employs Perlan or holds Songs for the Wyrms (either tree\'s spirit).');
  T_('zin_elves_wanderers_room', `OR = {\n${lt('zin_elves_wanderers_out', N('wanderers.base_missions'))}\nAND = {\nOR = {\nhas_country_flag = zin_magical_forest_healers\nhas_country_flag = zin_elves_wanderers_extra\n}\n${lt('zin_elves_wanderers_out', N('wanderers.slots'))}\n}\n}`, 'The sender has a free Wanderer mission (2, or 3 with the healer focuses).');
  K.add('common/scripted_triggers/zin_elves.txt', trig.join('\n\n'));

  // ============================================================================================ scripted effects
  const eff = [];
  const E_ = (name, body, note) => eff.push(K.effect(name, body, note));
  E_('zin_elves_add_kinship', bump(KS, 'zin_arg_value', 0, 100), 'Argument: zin_arg_value.');
  E_('zin_elves_add_rivalry', bump(RV, 'zin_arg_value', 0, 100), 'Argument: zin_arg_value.');
  E_('zin_elves_add_roost_bond', bump(RB, 'zin_arg_value', 0, 100), 'Argument: zin_arg_value.');
  const aenorWallRealms = (add) => `if = {
limit = { country_exists = ${AEN} }
every_country = {
limit = { zin_elves_is_wall_realm = yes }
${add ? `add_opinion_modifier = { target = ${AEN} modifier = zin_opinion_cold_roads }` : `remove_opinion_modifier = { target = ${AEN} modifier = zin_opinion_cold_roads }`}
}
}`;
  E_('zin_elves_add_wall_grievance', `${bump(GR, 'zin_arg_value', 0, 100)}
if = {
limit = {
${ge(GR, N('grievance.cold_roads_on'))}
NOT = { has_global_flag = zin_elves_cold_roads }
}
set_global_flag = zin_elves_cold_roads
${aenorWallRealms(true)}
}
if = {
limit = {
${lt(GR, N('grievance.cold_roads_off'))}
has_global_flag = zin_elves_cold_roads
}
clr_global_flag = zin_elves_cold_roads
${aenorWallRealms(false)}
}`, 'Argument: zin_arg_value. Cold Roads begins at 50 and ends below 40 (section 5.1).');
  // Both directions from the target's scope (PREV is the caller): the target field of an opinion modifier takes no var: token.
  E_('zin_elves_goodwill', `var:zin_arg_target = {
reverse_add_opinion_modifier = { target = PREV modifier = zin_opinion_elven_goodwill }
add_opinion_modifier = { target = PREV modifier = zin_opinion_elven_goodwill }
}`, 'Scope: country. Argument: zin_arg_target (a country).');
  E_('zin_elves_sync_refusal', `if = {
limit = {
has_country_flag = zin_refusal_lifted
has_idea = zin_elves_the_old_refusal
}
swap_ideas = { remove_idea = zin_elves_the_old_refusal add_idea = zin_elves_refusal_set_aside }
}
if = {
limit = {
NOT = { has_country_flag = zin_refusal_lifted }
has_idea = zin_elves_refusal_set_aside
}
swap_ideas = { remove_idea = zin_elves_refusal_set_aside add_idea = zin_elves_the_old_refusal }
}`, 'Scope: country. The Refusal spirit follows zin_refusal_lifted (section 4.1).');

  // ---- the passes
  E_('zin_elves_refresh_passes', `every_state = {
limit = { zin_is_site_nolorim_passes = yes }
remove_dynamic_modifier = { modifier = zin_elves_high_passes }
remove_dynamic_modifier = { modifier = zin_elves_high_passes_2 }
if = {
limit = { owner = { original_tag = ${NOL} } }
if = {
limit = { ${ge(WM, N('watch.second_modifier_at'))} }
add_dynamic_modifier = { modifier = zin_elves_high_passes_2 }
}
else = {
add_dynamic_modifier = { modifier = zin_elves_high_passes }
}
}
}`, 'The High Passes follow the watch (the mirror is set by zin_elves_add_pass_watch).');
  E_('zin_elves_raise_pass_forts', `set_temp_variable = { zin_elves_t_level = 0 }
set_temp_variable = { zin_elves_t_cut = ${N('watch.per_level')} }
while_loop_effect = {
limit = {
check_variable = { var = ${WM} value = zin_elves_t_cut compare = greater_than_or_equals }
${lt('zin_elves_t_level', N('watch.max_level'))}
}
add_to_temp_variable = { zin_elves_t_level = 1 }
add_to_temp_variable = { zin_elves_t_cut = ${N('watch.per_level')} }
}
while_loop_effect = {
limit = { check_variable = { var = global.zin_elves_pass_fort_level value = zin_elves_t_level compare = less_than } }
add_to_variable = { global.zin_elves_pass_fort_level = 1 }
every_state = {
limit = { zin_is_site_nolorim_passes = yes }
add_building_construction = {
type = bunker
level = 1
instant_build = yes
province = { all_provinces = yes limit_to_border = yes }
}
}
}
zin_elves_refresh_passes = yes`, 'Forts only rise: one level for every 20 points of watch, up to level 5 (section 7).');
  E_('zin_elves_add_pass_watch', `if = {
limit = { country_exists = ${NOL} }
${NOL} = {
${bump('zin_elves_pass_watch', 'zin_arg_value', 0, 100)}
set_temp_variable = { zin_elves_t_watch = zin_elves_pass_watch }
}
set_variable = { ${WM} = zin_elves_t_watch }
zin_elves_raise_pass_forts = yes
}`, 'Argument: zin_arg_value. A no-op when Nolorim does not exist (section 7).');

  // ---- the Kindred
  E_('zin_elves_raise_kindred', `if = {
limit = { NOT = { has_global_flag = zin_elves_kindred_formed } }
create_faction_from_template = zin_faction_kindred
set_country_flag = zin_elves_kindred_leader
set_global_flag = zin_elves_kindred_formed
set_global_flag = { flag = zin_elves_kindred_recent_war days = ${N('kindred.dissolve_days')} }
every_country = {
limit = {
zin_elves_is_magical_realm = yes
NOT = { has_country_flag = zin_elves_kindred_leader }
}
country_event = { id = zin_elves.31 }
}
${news('zin_elves.32', `OR = {\nzin_elves_is_magical_realm = yes\ntag = ${AEN}\n}`)}
}`, 'Scope: the leader. Section 3.2.');
  E_('zin_elves_join_kindred', `if = {
limit = {
has_global_flag = zin_elves_kindred_formed
zin_elves_is_magical_realm = yes
NOT = { zin_elves_in_kindred = yes }
}
set_country_flag = zin_elves_joining_tmp
random_country = {
limit = { has_country_flag = zin_elves_kindred_leader }
add_to_faction = PREV
}
every_country = {
limit = {
zin_elves_in_kindred = yes
NOT = { has_country_flag = zin_elves_joining_tmp }
}
add_opinion_modifier = { target = PREV modifier = zin_opinion_kindred }
reverse_add_opinion_modifier = { target = PREV modifier = zin_opinion_kindred }
}
clr_country_flag = zin_elves_joining_tmp
zin_elves_join_kin_defence = yes
}`, 'Scope: an elven realm. The option "Stand with the kin" as an effect (also called by the regional trees).');
  E_('zin_elves_join_kin_defence', `every_country = {
limit = {
zin_elves_in_kindred = yes
zin_elves_realm_occupied = yes
}
save_event_target_as = zin_elves_defended
every_enemy_country = {
limit = {
NOT = { zin_elves_is_elven_country = yes }
any_controlled_state = { is_owned_by = event_target:zin_elves_defended }
}
save_event_target_as = zin_elves_foe
every_country = {
limit = {
zin_elves_in_kindred = yes
NOT = { has_war_with = event_target:zin_elves_foe }
}
add_to_war = {
targeted_alliance = event_target:zin_elves_defended
enemy = event_target:zin_elves_foe
hostility_reason = asked_to_join
single_target_only = yes
}
}
}
}`, 'Elves helping elves: members join the war of a member whose state a foreign hand holds (section 3.2).');
  E_('zin_elves_kindred_upkeep', `if = {
limit = { has_global_flag = zin_elves_kindred_formed }
if = {
limit = {
any_country = {
zin_elves_in_kindred = yes
zin_elves_realm_occupied = yes
}
}
set_global_flag = { flag = zin_elves_kindred_recent_war days = ${N('kindred.dissolve_days')} }
}
zin_elves_join_kin_defence = yes
if = {
limit = { NOT = { has_global_flag = zin_elves_kindred_recent_war } }
every_country = {
limit = { zin_elves_in_kindred = yes }
every_country = {
limit = { zin_elves_in_kindred = yes }
remove_opinion_modifier = { target = PREV modifier = zin_opinion_kindred }
}
}
every_country = {
limit = { has_country_flag = zin_elves_kindred_leader }
dismantle_faction = yes
clr_country_flag = zin_elves_kindred_leader
}
clr_global_flag = zin_elves_kindred_formed
}
}`, 'Monthly: defence, and dissolution 730 days after the last war ends (section 3.2).');

  // ---- the feud
  E_('zin_elves_begin_feud', `if = {
limit = {
NOT = { has_global_flag = zin_elves_feud }
zin_elves_date_feud = yes
}
set_global_flag = zin_elves_feud
var:zin_arg_attacker = { save_event_target_as = zin_elves_feud_attacker }
if = {
limit = { event_target:zin_elves_feud_attacker = { original_tag = ${AND_} } }
${HER} = {
save_event_target_as = zin_elves_feud_rival
random_owned_state = {
limit = { zin_is_site_boundary_groves = yes }
save_event_target_as = zin_elves_feud_state
}
}
}
else = {
${AND_} = {
save_event_target_as = zin_elves_feud_rival
random_owned_state = { save_event_target_as = zin_elves_feud_state }
}
}
event_target:zin_elves_feud_attacker = {
add_opinion_modifier = { target = event_target:zin_elves_feud_rival modifier = zin_opinion_feud_of_groves }
reverse_add_opinion_modifier = { target = event_target:zin_elves_feud_rival modifier = zin_opinion_feud_of_groves }
if = {
limit = { has_event_target = zin_elves_feud_state }
event_target:zin_elves_feud_state = { add_claim_by = event_target:zin_elves_feud_attacker }
create_wargoal = {
type = take_claimed_state
target = event_target:zin_elves_feud_rival
}
}
country_event = { id = zin_elves.25 days = ${N('cooldown.feud_peace_after')} }
}
event_target:zin_elves_feud_rival = { country_event = { id = zin_elves.25 days = ${N('cooldown.feud_peace_after')} } }
${call('zin_elves_add_kinship', { value: N('kinship.feud') })}
${gd(2)}
${news('zin_elves.24', 'zin_elves_is_magical_realm = yes')}
}`, 'Any scope. Argument: zin_arg_attacker (Herrodon or Andos Enda). The feud decision effect; also called by their focuses behind the same gates (section 6). The cause of war is the claimed state, so no state id is needed in script.');

  // ---- the Wall
  const bothWays = (target, mod, remove) => `if = {
limit = { country_exists = ${target} }
${remove ? `remove_opinion_modifier = { target = ${target} modifier = ${mod} }\n${target} = { remove_opinion_modifier = { target = PREV modifier = ${mod} } }` : `add_opinion_modifier = { target = ${target} modifier = ${mod} }\nreverse_add_opinion_modifier = { target = ${target} modifier = ${mod} }`}
}`;
  E_('zin_elves_close_wall_roads', `if = {
limit = { NOT = { has_global_flag = zin_elves_wall_roads_closed } }
set_global_flag = zin_elves_wall_roads_closed
every_country = {
limit = { zin_elves_is_wall_realm = yes }
add_ideas = zin_elves_wall_roads_shut
${bothWays(AEN, 'zin_opinion_wall_roads_closed', false)}
${bothWays(KIN, 'zin_opinion_wall_roads_closed', false)}
}
${gd(1)}
${news('zin_elves.10', `OR = {\nzin_elves_is_wall_realm = yes\ntag = ${AEN}\ntag = ${KIN}\n}`)}
}`, 'The roads are closed; the Accord is not broken (section 5.1).');
  E_('zin_elves_reopen_wall_roads', `if = {
limit = { has_global_flag = zin_elves_wall_roads_closed }
clr_global_flag = zin_elves_wall_roads_closed
every_country = {
limit = { zin_elves_is_wall_realm = yes }
remove_ideas = zin_elves_wall_roads_shut
${bothWays(AEN, 'zin_opinion_wall_roads_closed', true)}
${bothWays(KIN, 'zin_opinion_wall_roads_closed', true)}
}
}`, 'Reopening clears the flag, the idea and the opinions.');
  E_('zin_elves_open_gates', `set_country_flag = zin_elves_gates_open
if = {
limit = { country_exists = ${AEN} }
give_military_access = ${AEN}
${AEN} = {
every_subject_country = { give_military_access = PREV }
}
${call('zin_elves_goodwill', { target: AEN })}
}
if = {
limit = { country_exists = ${KIN} }
give_military_access = ${KIN}
}`, 'Scope: the Magical Forest. Right of passage for Aenor, its subjects and Kingson (section 5.5); never lifts the Refusal.');
  E_('zin_elves_bar_gates', `clr_country_flag = zin_elves_gates_open
if = {
limit = { country_exists = ${AEN} }
diplomatic_relation = { country = ${AEN} relation = military_access active = no }
${AEN} = {
every_subject_country = { diplomatic_relation = { country = PREV relation = military_access active = no } }
}
}
if = {
limit = { country_exists = ${KIN} }
diplomatic_relation = { country = ${KIN} relation = military_access active = no }
}
add_timed_idea = { idea = zin_elves_gates_barred days = ${N('gates.barred_days')} }`, 'Scope: the Magical Forest. Ends the access and steadies the woods for 180 days.');

  // ---- pilgrim roads
  E_('zin_elves_set_pilgrim_roads', `set_temp_variable = { zin_elves_t_was = zin_elves_pilgrim_roads }
set_variable = { zin_elves_pilgrim_roads = zin_arg_value }
set_variable = { zin_elves_pilgrim_months = 0 }
remove_ideas = zin_elves_pilgrim_roads_open
remove_ideas = zin_elves_pilgrim_tolls
${wor(`${WOR} = {\nremove_opinion_modifier = { target = PREV modifier = zin_opinion_pilgrim_tolls }\nremove_opinion_modifier = { target = PREV modifier = zin_opinion_pilgrim_roads_closed }\n}`)}
if = {
limit = { ${eq('zin_arg_value', N('pilgrim.open'))} }
add_ideas = zin_elves_pilgrim_roads_open
}
if = {
limit = { ${eq('zin_arg_value', N('pilgrim.toll'))} }
add_ideas = zin_elves_pilgrim_tolls
${wor(`${WOR} = { add_opinion_modifier = { target = PREV modifier = zin_opinion_pilgrim_tolls } }`)}
}
if = {
limit = { ${eq('zin_arg_value', N('pilgrim.closed'))} }
${wor(`${WOR} = { add_opinion_modifier = { target = PREV modifier = zin_opinion_pilgrim_roads_closed } }`)}
if = {
limit = { ${gt('zin_elves_t_was', 0)} }
${call('zin_afrit_add_footholds', { value: N('pilgrim.close_footholds') })}
}
}`, 'Scope: a pilgrim-road realm. Argument: zin_arg_value (0 closed, 1 toll, 2 open). Section 10.');

  // ---- the wanderers
  E_('zin_elves_count_wanderers', `set_variable = { zin_elves_wanderers_out = 0 }
if = { limit = { has_country_flag = zin_elves_mission_a } add_to_variable = { zin_elves_wanderers_out = 1 } }
if = { limit = { has_country_flag = zin_elves_mission_b } add_to_variable = { zin_elves_wanderers_out = 1 } }
if = { limit = { has_country_flag = zin_elves_mission_c } add_to_variable = { zin_elves_wanderers_out = 1 } }`, 'Scope: a sender. A mission holds a timed slot flag as long as its idea lasts.');
  const slot = days => `if = {
limit = { NOT = { has_country_flag = zin_elves_mission_a } }
set_country_flag = { flag = zin_elves_mission_a days = ${days} }
}
else_if = {
limit = { NOT = { has_country_flag = zin_elves_mission_b } }
set_country_flag = { flag = zin_elves_mission_b days = ${days} }
}
else = {
set_country_flag = { flag = zin_elves_mission_c days = ${days} }
}
zin_elves_count_wanderers = yes`;
  const cut = (name, base, flagsMap) => `set_variable = { ${name} = ${base} }\n${flagsMap}`;
  void cut;
  const reduce = (name, flag, by) => `if = { limit = { has_country_flag = ${flag} } add_to_variable = { ${name} = -${by} } }`;
  const costLines = name => [reduce(name, 'zin_magical_forest_healers', N('wanderers.healers_not_hosts')), reduce(name, 'zin_elves_wanderers_extra', N('wanderers.extra')), reduce(name, 'zin_gala_friends_not_allies', N('wanderers.gala_friends')), `if = { limit = { has_country_flag = zin_magical_forest_free_wanderers } set_variable = { ${name} = 0 } }`, `clamp_variable = { var = ${name} min = 0 max = 99 }`].join('\n');
  E_('zin_elves_refresh_costs', `set_variable = { zin_elves_cost_healers = ${N('cost.healers')} }
${costLines('zin_elves_cost_healers')}
set_variable = { zin_elves_cost_wardens = ${N('cost.wardens')} }
${costLines('zin_elves_cost_wardens')}
set_variable = { zin_elves_cost_wall_moot = ${N('cost.wall_moot')} }
if = { limit = { has_country_flag = zin_magical_forest_wall_moot } set_variable = { zin_elves_cost_wall_moot = ${N('cost.wall_moot_focus')} } }
set_variable = { zin_elves_cost_kindred = ${N('cost.kindred')} }
if = { limit = { has_global_flag = zin_eastern_invasion } set_variable = { zin_elves_cost_kindred = 0 } }`, 'Scope: an elven realm. The costs the focuses change; refreshed each month and at the start (a focus flag shows within a month).');

  // ---- dragons
  E_('zin_elves_on_dragon_corrupted', `add_to_variable = { global.zin_elves_corruptions_seen = 1 }
set_global_flag = zin_elves_roost_sickness
${call('zin_elves_add_roost_bond', { value: N('bond.corruption') })}
every_country = {
limit = { zin_world_is_dragon_keeper = yes }
country_event = { id = zin_elves.45 }
}`, 'A dragon was bound by corruption: called once per dragon by zin_world.50, or by the monthly count (section 8).');
  E_('zin_elves_focus_dragon_pact', `if = {
limit = {
${ge('global.zin_dragons_free', 1)}
${lt('zin_world_dragon_pacts', 3)}
}
set_temp_variable = { zin_arg_to = THIS }
zin_world_give_dragon = yes
add_to_variable = { zin_world_dragon_pacts = 1 }
set_country_flag = zin_war_dragon_pact
add_to_variable = { global.zin_elves_pacts_seen = 1 }
${call('zin_elves_add_roost_bond', { value: N('bond.pact') })}
}`, 'Scope: the taker. A Dragon Pact by focus: pool -1, Pact +1, bond -10 once (section 8).');

  // ---- Varner
  E_('zin_elves_on_varner_dead', `every_country = {
limit = { zin_elves_is_magical_realm = yes }
add_timed_idea = { idea = zin_elves_wizard_gone days = ${N('varner.gone_days')} }
country_event = { id = zin_elves.51 }
}`, 'The Wizard is gone: a year of unease and resolve in every Magical Lands realm. No permanent effect (section 9).');

  // ---- the eastern invasion
  E_('zin_elves_on_eastern_invasion', `if = {
limit = { NOT = { has_global_flag = zin_elves_invasion_answered } }
set_global_flag = zin_elves_invasion_answered
every_country = {
limit = {
OR = {
zin_elves_is_magical_realm = yes
tag = ${AEN}
}
}
country_event = { id = zin_elves.70 }
}
${call('zin_elves_add_kinship', { value: N('eastern.kinship') })}
${call('zin_elves_add_pass_watch', { value: N('eastern.watch') })}
every_country = {
limit = {
zin_elves_is_magical_realm = yes
has_war = yes
any_enemy_country = { ${inEast} }
}
add_timed_idea = { idea = zin_elves_woods_defended days = ${N('eastern.woods_days')} }
}
if = {
limit = { country_exists = ${AEN} }
${AEN} = { country_event = { id = zin_elves.71 days = 3 } }
}
if = {
limit = { country_exists = ${KIN} }
${KIN} = { country_event = { id = zin_elves.71 days = 3 } }
}
}`, 'Section 11: the Kindred becomes ready, the passes fill with wardens, the woods stand. Guarded by zin_elves_invasion_answered.');
  E_('zin_elves_check_passes_lost', `if = {
limit = { any_state = { zin_is_site_nolorim_passes = yes } }
if = {
limit = {
NOT = { has_global_flag = zin_elves_passes_lost_seen }
NOT = {
any_state = {
zin_is_site_nolorim_passes = yes
controller = { zin_elves_is_elven_country = yes }
}
}
}
set_global_flag = zin_elves_passes_lost_seen
${call('zin_elves_add_kinship', { value: N('kinship.passes_lost') })}
${gd(1)}
every_country = {
limit = { zin_elves_is_magical_realm = yes }
country_event = { id = zin_elves.41 }
}
}
if = {
limit = {
has_global_flag = zin_elves_passes_lost_seen
any_state = {
zin_is_site_nolorim_passes = yes
controller = { zin_elves_is_elven_country = yes }
}
}
clr_global_flag = zin_elves_passes_lost_seen
}
}`, 'Once per war: every pass state is in foreign hands (section 7).');

  // ---- start and monthly
  E_('zin_elves_startup', `set_variable = { ${KS} = ${N('kinship.start')} }
set_variable = { ${RV} = ${N('rivalry.start')} }
set_variable = { ${GR} = ${N('grievance.start')} }
set_variable = { ${RB} = ${N('bond.start')} }
set_variable = { global.zin_elves_pass_fort_level = 0 }
set_variable = { global.zin_elves_pacts_seen = 0 }
set_variable = { global.zin_elves_corruptions_seen = 0 }
set_variable = { ${WM} = ${N('watch.start')} }
if = {
limit = { country_exists = ${NOL} }
${NOL} = { set_variable = { zin_elves_pass_watch = ${N('watch.start')} } }
}
every_country = {
limit = { zin_elves_is_magical_realm = yes }
set_variable = { zin_elves_wanderers_out = 0 }
if = {
limit = {
any_owned_state = {
any_neighbor_state = { zin_is_site_great_wall = yes }
}
}
set_country_flag = zin_elves_wall_realm
}
if = {
limit = {
any_owned_state = { zin_is_site_rift_west = yes }
}
set_country_flag = zin_elves_rift_realm
}
if = {
limit = {
OR = {
zin_elves_is_wall_realm = yes
any_owned_state = {
any_neighbor_state = { is_owned_by = ${WOR} }
}
}
}
set_country_flag = zin_elves_pilgrim_realm
set_variable = { zin_elves_pilgrim_roads = ${N('pilgrim.open')} }
set_variable = { zin_elves_pilgrim_months = 0 }
add_ideas = zin_elves_pilgrim_roads_open
}
}
every_country = {
limit = {
is_ai = yes
zin_elves_is_elven_country = yes
}
if = {
limit = { zin_rules_ai_random_elves = yes }
random = {
chance = 50
set_country_flag = zin_elves_ai_marcher
}
}
}
every_country = {
limit = { zin_elves_is_elven_country = yes }
zin_elves_refresh_costs = yes
}
zin_elves_raise_pass_forts = yes`, 'Run once by the hidden event zin_elves.1: start values, the startup lists of section 2, the level-1 pass forts, the random marchers.');

  E_('zin_elves_monthly', `# kinship
if = { limit = { ${ge(RV, N('kinship.rivalry_drain_at'))} } ${call('zin_elves_add_kinship', { value: N('kinship.rivalry_drain') })} }
if = { limit = { has_global_flag = zin_elves_kindred_formed } ${call('zin_elves_add_kinship', { value: N('kinship.kindred_drift') })} }
if = {
limit = {
any_country = {
zin_elves_is_magical_realm = yes
zin_elves_realm_occupied = yes
}
}
${call('zin_elves_add_kinship', { value: N('kinship.war_drift') })}
}
# rivalry
${call('zin_elves_add_rivalry', { value: N('rivalry.drift') })}
if = {
limit = {
has_global_flag = zin_elves_kindred_formed
country_exists = ${HER}
country_exists = ${AND_}
${HER} = { zin_elves_in_kindred = yes }
${AND_} = { zin_elves_in_kindred = yes }
}
${call('zin_elves_add_rivalry', { value: N('rivalry.kindred_drift') })}
}
if = {
limit = {
OR = {
NOT = { country_exists = ${HER} }
NOT = { country_exists = ${AND_} }
AND = {
country_exists = ${HER}
${HER} = {
is_subject = yes
overlord = { NOT = { zin_elves_is_elven_country = yes } }
}
}
AND = {
country_exists = ${AND_}
${AND_} = {
is_subject = yes
overlord = { NOT = { zin_elves_is_elven_country = yes } }
}
}
}
}
set_variable = { ${RV} = 0 }
}
# the Wall grievance
if = {
limit = {
country_exists = ${AEN}
${AEN} = { ${ge('zin_court_corruption', N('grievance.high_at'))} }
NOT = { has_global_flag = zin_wall_accord_broken }
}
${call('zin_elves_add_wall_grievance', { value: N('grievance.monthly_high') })}
}
if = {
limit = {
country_exists = ${AEN}
${AEN} = { ${lt('zin_court_corruption', N('grievance.low_at'))} }
}
${call('zin_elves_add_wall_grievance', { value: N('grievance.monthly_low') })}
}
if = { limit = { has_global_flag = zin_eindil_crowned } ${call('zin_elves_add_wall_grievance', { value: N('grievance.after_crown') })} }
if = {
limit = {
has_global_flag = zin_aurevan_crowned
NOT = { has_global_flag = zin_elves_customs_offered }
}
set_global_flag = zin_elves_customs_offered
every_country = {
limit = { zin_elves_is_wall_realm = yes }
country_event = { id = zin_elves.9 days = 4 }
}
}
# the roost bond
if = {
limit = { any_country = { zin_world_is_dragon_keeper = yes zin_elves_tends_roosts = yes } }
${call('zin_elves_add_roost_bond', { value: N('bond.monthly_good') })}
}
if = {
limit = {
has_global_flag = zin_elves_roost_sickness
NOT = { any_country = { zin_world_is_dragon_keeper = yes has_country_flag = zin_elves_roosts_guarded } }
}
${call('zin_elves_add_roost_bond', { value: N('bond.monthly_sick') })}
}
set_temp_variable = { zin_elves_t_pacts = 0 }
set_temp_variable = { zin_elves_t_corrupt = 0 }
every_country = {
limit = { OR = { ${gt('zin_world_dragon_pacts', 0)} ${gt('zin_world_corrupted_dragons', 0)} } }
add_to_temp_variable = { zin_elves_t_pacts = zin_world_dragon_pacts }
add_to_temp_variable = { zin_elves_t_corrupt = zin_world_corrupted_dragons }
}
while_loop_effect = {
limit = { check_variable = { var = zin_elves_t_pacts value = global.zin_elves_pacts_seen compare = greater_than } }
add_to_variable = { global.zin_elves_pacts_seen = 1 }
${call('zin_elves_add_roost_bond', { value: N('bond.pact') })}
}
while_loop_effect = {
limit = { check_variable = { var = zin_elves_t_corrupt value = global.zin_elves_corruptions_seen compare = greater_than } }
zin_elves_on_dragon_corrupted = yes
}
if = {
limit = {
has_global_flag = zin_eindil_dragon_pact
NOT = { has_global_flag = zin_elves_eindil_dragon_seen }
}
set_global_flag = zin_elves_eindil_dragon_seen
${call('zin_elves_add_roost_bond', { value: N('bond.eindil') })}
}
# the Refusal, costs, Wanderers, pilgrims
every_country = {
limit = { zin_elves_is_elven_country = yes }
zin_elves_sync_refusal = yes
zin_elves_refresh_costs = yes
zin_elves_count_wanderers = yes
}
every_country = {
limit = {
zin_elves_is_pilgrim_road_realm = yes
${eq('zin_elves_pilgrim_roads', N('pilgrim.open'))}
}
add_to_variable = { zin_elves_pilgrim_months = 1 }
if = {
limit = { ${ge('zin_elves_pilgrim_months', N('pilgrim.months_for_foothold'))} }
set_variable = { zin_elves_pilgrim_months = 0 }
${call('zin_afrit_add_footholds', { value: 1 })}
}
}
# the Kindred, the passes, the eastern invasion
zin_elves_kindred_upkeep = yes
zin_elves_check_passes_lost = yes
if = {
limit = {
has_global_flag = zin_eastern_invasion
NOT = { has_global_flag = zin_elves_invasion_answered }
}
zin_elves_on_eastern_invasion = yes
}
every_country = {
limit = {
zin_elves_is_magical_realm = yes
has_war = yes
has_global_flag = zin_elves_invasion_answered
any_enemy_country = { ${inEast} }
}
add_timed_idea = { idea = zin_elves_woods_defended days = ${N('eastern.woods_days')} }
}
if = {
limit = {
has_global_flag = zin_afrit_revealed
NOT = { has_global_flag = zin_elves_temple_noticed }
}
set_global_flag = zin_elves_temple_noticed
every_country = {
limit = { zin_elves_is_magical_realm = yes }
country_event = { id = zin_elves.60 days = 2 }
}
}
# the high passes follow the watch; last, the elven trees refresh their layouts (decision E4)
zin_elves_refresh_passes = yes
every_country = {
limit = { zin_elves_is_magical_realm = yes }
mark_focus_tree_layout_dirty = yes
}`, 'The monthly runner: drifts of kinship, rivalry, grievance and bond, the counts of Pacts and corruptions, the Refusal sync, pilgrim months, the Kindred, the passes and the eastern check.');
  K.add('common/scripted_effects/zin_elves.txt', eff.join('\n\n'));

  // ============================================================================================ ideas, modifiers, opinions
  const ideas = [
    ['zin_elves_refusal_set_aside', 'banner_plain', { war_support_factor: 0.05, drift_defence_factor: 0.1 }],
    ['zin_elves_wanderers_lore', 'healer_herbs', { research_speed_factor: 0.03, stability_factor: 0.02 }],
    ['zin_elves_wanderers_lore_gala', 'healer_herbs', { research_speed_factor: 0.05, stability_factor: 0.02 }],
    ['zin_elves_wanderers_wardens', 'ranger_cloak', { army_org_factor: 0.03, recon_factor: 0.1, army_morale_factor: 0.03 }],
    ['zin_elves_wall_roads_shut', 'charter_wall', { consumer_goods_factor: 0.02, drift_defence_factor: 0.05 }],
    ['zin_elves_pilgrim_roads_open', 'courier_pilgrim', { stability_factor: 0.02, production_speed_buildings_factor: 0.03 }],
    ['zin_elves_pilgrim_tolls', 'toll_house', { political_power_gain: 0.05 }],
    ['zin_elves_varners_counsel', 'wizard_tower', { research_speed_factor: 0.05, stability_factor: 0.03 }],
    ['zin_elves_wizard_gone', 'scroll_sealed', { stability_factor: -0.03, war_support_factor: 0.05 }],
    ['zin_elves_woods_defended', 'forest_ancient', { army_defence_factor: 0.1, army_core_defence_factor: 0.1, war_support_factor: 0.1 }],
    ['zin_elves_gates_barred', 'fort_wall', { stability_factor: 0.05 }],
  ];
  K.add('common/ideas/zin_elves.txt', `ideas = {\n\tcountry = {\n${ideas.map(([id, pic, mods]) => K.idea({ id, picture: `zin_${art(pic)}`, mods })).join('\n')}\n\t}\n}`);

  const dyn = (id, mods) => {
    const t = T.dynamic[id];
    K.def('dynamic', id); K.loc.set(id, t.n);
    return `${id} = {\n\tenable = { always = yes }\n\ticon = GFX_idea_zin_${art(t.icon)}\n${Object.entries(mods).map(([k, v]) => `\t${k} = ${num(v)}`).join('\n')}\n}`;
  };
  K.add('common/dynamic_modifiers/zin_elves.txt', [
    dyn('zin_elves_high_passes', { enemy_attrition: 0.1, enemy_army_speed_factor: -0.1 }),
    dyn('zin_elves_high_passes_2', { enemy_attrition: 0.15, enemy_army_speed_factor: -0.15 }),
    dyn('zin_elves_wandering_paths', { enemy_attrition: 0.15, enemy_army_speed_factor: -0.1 }),
  ].join('\n\n'));

  const op = [['zin_opinion_elven_goodwill', 15, { decay: 0.25 }], ['zin_opinion_kindred', 20, {}], ['zin_opinion_cold_roads', -10, {}], ['zin_opinion_wall_roads_closed', -15, {}], ['zin_opinion_feud_of_groves', -30, { decay: 0.5 }], ['zin_opinion_pilgrim_tolls', -10, {}], ['zin_opinion_pilgrim_roads_closed', -25, {}]];
  K.add('common/opinion_modifiers/zin_elves.txt', `opinion_modifiers = {\n${op.map(([id, v, o]) => { if (!T.opinions[id]) throw new Error(`no text for opinion ${id}`); K.loc.set(id, T.opinions[id]); return K.opinion(id, v, o).replace(/^/gm, '\t'); }).join('\n')}\n}`);

  // ============================================================================================ decisions
  K.add('common/decisions/categories/zin_elves.txt', [
    K.category('zin_elves_kin', art('elven_council'), { visible: 'zin_elves_is_magical_realm = yes' }),
    K.category('zin_elves_wanderers', art('healer_herbs'), { visible: 'zin_elves_is_elven_country = yes' }),
    K.category('zin_elves_roosts', art('dragon_mountain'), { visible: 'zin_world_is_dragon_keeper = yes' }),
  ].join('\n'));

  const onlyMF = `original_tag = ${MF}`, magical = 'zin_elves_is_magical_realm = yes';
  const recent = flag => `NOT = { has_country_flag = ${flag} }`;
  const kin = [], wand = [], roost = [];
  kin.push(K.decision({ id: 'zin_elves_call_elder_moot', icon: art('elven_council'), allowed: onlyMF,
    available: `${ge(KS, N('kinship.moot'))}\n${recent('zin_elves_moot_called')}`, cost: N('cost.elder_moot'),
    complete: `set_country_flag = { flag = zin_elves_moot_called days = ${N('cooldown.elder_moot')} }\ncountry_event = { id = zin_elves.30 }`,
    ai: ai(60, [{ add: 40, when: ge(KS, 50) }, { factor: 0, when: 'has_war = yes' }]) }));
  kin.push(K.decision({ id: 'zin_elves_raise_the_kindred', icon: art('banner_league'), allowed: magical,
    visible: `zin_elves_kindred_ready = yes\nOR = {\noriginal_tag = ${MF}\nNOT = { country_exists = ${MF} }\n}`,
    available: 'zin_elves_kindred_ready = yes', cost: 'zin_elves_cost_kindred', complete: 'zin_elves_raise_kindred = yes',
    ai: ai(0, [{ add: 100, when: 'has_global_flag = zin_eastern_invasion' }, { add: 20, when: ge(KS, 70) }]) }));
  kin.push(K.decision({ id: 'zin_elves_mediate_rivals', icon: art('olive_branch'), allowed: onlyMF,
    available: `${exists(HER)}\n${exists(AND_)}\n${ge(RV, N('rivalry.mediation_floor'))}\n${recent('zin_elves_mediated')}`, cost: N('cost.mediate'),
    complete: `${call('zin_elves_add_rivalry', { value: N('rivalry.mediation') })}
${call('zin_elves_add_kinship', { value: N('kinship.mediation') })}
if = {
limit = { has_country_flag = zin_magical_forest_mediator }
set_country_flag = { flag = zin_elves_mediated days = ${N('rivalry.mediation_cooldown_flag')} }
}
else = {
set_country_flag = { flag = zin_elves_mediated days = ${N('rivalry.mediation_cooldown')} }
}
${HER} = { add_opinion_modifier = { target = ${MF} modifier = zin_opinion_elven_goodwill } country_event = { id = zin_elves.23 } }
${AND_} = { add_opinion_modifier = { target = ${MF} modifier = zin_opinion_elven_goodwill } country_event = { id = zin_elves.23 } }`,
    ai: ai(0, [{ add: 80, when: `${ge(RV, N('rivalry.mediate_ai_hist'))}\nzin_rules_is_historical = yes` }, { add: 80, when: `${ge(RV, N('rivalry.mediate_ai_other'))}\nNOT = { zin_rules_is_historical = yes }` }]) }));
  kin.push(K.decision({ id: 'zin_elves_settle_the_feud', icon: art('war_council_map'),
    allowed: `OR = {\noriginal_tag = ${HER}\noriginal_tag = ${AND_}\n}`,
    available: `${ge(RV, N('rivalry.feud_at'))}\nzin_elves_date_feud = yes\nNOT = { has_war = yes }\nNOT = { has_global_flag = zin_elves_feud }\nNOT = {\nAND = {\n${HER} = { zin_elves_in_kindred = yes }\n${AND_} = { zin_elves_in_kindred = yes }\n}\n}`,
    visible: `${exists(HER)}\n${exists(AND_)}`, cost: N('cost.feud'), complete: 'set_temp_variable = { zin_arg_attacker = THIS }\nzin_elves_begin_feud = yes',
    ai: ai(0, [{ add: 40, when: `zin_rules_is_free = yes\n${ge(RV, N('rivalry.feud_ai_at'))}\nNOT = { any_country = { has_country_flag = zin_elves_mediated } }` }]) }));
  kin.push(K.decision({ id: 'zin_elves_wardens_for_the_passes', icon: art('pass_fort'), allowed: magical,
    visible: `NOT = { original_tag = ${NOL} }\n${exists(NOL)}`, available: recent('zin_elves_passes_wardened'), cost: N('cost.passes'),
    complete: `set_country_flag = { flag = zin_elves_passes_wardened days = ${N('cooldown.passes')} }
${call('zin_elves_add_pass_watch', { value: N('watch.wardens') })}
${call('zin_elves_add_kinship', { value: N('kinship.wardens_for_passes') })}
${NOL} = { country_event = { id = zin_elves.40 } }`,
    ai: ai(5, [{ add: 40, when: 'has_global_flag = zin_eastern_invasion' }, { factor: 0.2, when: 'has_war = yes' }, { factor: 0, when: ge(WM, 100) }]) }));
  kin.push(K.decision({ id: 'zin_elves_call_wall_moot', icon: art('handshake_oath'), allowed: magical,
    visible: 'zin_elves_is_wall_realm = yes', available: `${ge(GR, N('grievance.moot_at'))}\n${exists(AEN)}\n${recent('zin_elves_wall_moot_called')}\nNOT = { has_global_flag = zin_elves_moot_open }`, cost: 'zin_elves_cost_wall_moot',
    complete: `set_country_flag = { flag = zin_elves_wall_moot_called days = ${N('cooldown.wall_moot')} }
save_global_event_target_as = zin_elves_moot_caller
set_global_flag = zin_elves_moot_open
${AEN} = { country_event = { id = zin_elves.5 } }`,
    ai: ai(0, [{ add: 70, when: `${ge(GR, 50)}\n${onlyMF}` }]) }));
  kin.push(K.decision({ id: 'zin_elves_close_the_wall_roads', icon: art('charter_wall'), allowed: onlyMF,
    visible: 'NOT = { has_global_flag = zin_elves_wall_roads_closed }',
    available: `OR = {\n${ge(GR, N('grievance.close_at'))}\nAND = {\n${ge(GR, N('grievance.close_at_focus'))}\nhas_completed_focus = zin_magical_forest_close_the_wall_roads\n}\n}`, cost: N('cost.close_roads'),
    complete: 'zin_elves_close_wall_roads = yes',
    ai: ai(0, [{ add: 15, when: `zin_rules_is_free = yes\n${ge(GR, N('grievance.close_at'))}` }]) }));
  kin.push(K.decision({ id: 'zin_elves_reopen_the_wall_roads', icon: art('charter_wall'), allowed: onlyMF,
    visible: 'has_global_flag = zin_elves_wall_roads_closed', available: lt(GR, N('grievance.reopen_below')), cost: N('cost.reopen_roads'),
    complete: 'zin_elves_reopen_wall_roads = yes', ai: ai(40) }));
  kin.push(K.decision({ id: 'zin_elves_open_wall_gates', icon: art('fort_wall'), allowed: onlyMF,
    visible: `has_country_flag = zin_magical_forest_wall_gates\nOR = {\nhas_global_flag = zin_war_of_last_crowns\nhas_global_flag = zin_eastern_invasion\n}\nNOT = { has_country_flag = zin_elves_gates_open }`,
    available: `${exists(AEN)}\nNOT = { has_war_with = ${AEN} }`, cost: N('cost.open_gates'), complete: 'zin_elves_open_gates = yes',
    ai: ai(0, [{ add: 60, when: `has_global_flag = zin_eastern_invasion\nany_enemy_country = {\n${inEast}\n${holdsMagical}\n}` }, { factor: 0.2, when: 'zin_rules_is_historical = yes' }]) }));
  kin.push(K.decision({ id: 'zin_elves_bar_wall_gates', icon: art('fort_wall'), allowed: onlyMF,
    visible: 'has_country_flag = zin_elves_gates_open', cost: 0, complete: 'zin_elves_bar_gates = yes',
    ai: ai(0, [{ add: 50, when: 'NOT = { has_global_flag = zin_eastern_invasion }' }]) }));
  const pilgrimVisible = v => `zin_elves_is_pilgrim_road_realm = yes\nNOT = { ${eq('zin_elves_pilgrim_roads', v)} }`;
  const pilgrimDone = v => `set_country_flag = { flag = zin_elves_pilgrim_cooldown days = ${N('cooldown.pilgrim')} }\n${call('zin_elves_set_pilgrim_roads', { value: v })}`;
  kin.push(K.decision({ id: 'zin_elves_pilgrim_roads_open_decision', icon: art('courier_pilgrim'), allowed: magical,
    visible: pilgrimVisible(N('pilgrim.open')), available: recent('zin_elves_pilgrim_cooldown'), cost: 0, complete: pilgrimDone(N('pilgrim.open')),
    ai: ai(0, [{ add: 20, when: eq('zin_elves_pilgrim_roads', 1) }, { factor: 0, when: 'has_global_flag = zin_afrit_revealed' }]) }));
  kin.push(K.decision({ id: 'zin_elves_pilgrim_roads_toll_decision', icon: art('toll_house'), allowed: magical,
    visible: pilgrimVisible(N('pilgrim.toll')), available: recent('zin_elves_pilgrim_cooldown'), cost: N('cost.pilgrim_toll'), complete: pilgrimDone(N('pilgrim.toll')),
    ai: ai(0, [{ add: 15, when: `${eq('zin_elves_pilgrim_roads', 2)}\nNOT = { has_political_power > 150 }` }, { factor: 0, when: 'has_global_flag = zin_afrit_revealed' }]) }));
  kin.push(K.decision({ id: 'zin_elves_pilgrim_roads_close_decision', icon: art('hermitage_hills'), allowed: magical,
    visible: pilgrimVisible(N('pilgrim.closed')), available: recent('zin_elves_pilgrim_cooldown'), cost: N('cost.pilgrim_close'), complete: pilgrimDone(N('pilgrim.closed')),
    ai: ai(0, [{ add: 80, when: 'has_global_flag = zin_afrit_revealed' }]) }));
  kin.push(K.decision({ id: 'zin_elves_seek_the_wizard', icon: art('wizard_tower'), allowed: magical,
    available: `${ge(KS, N('varner.min_kinship'))}\nOR = {\n${ge(GD, N('varner.gathering_at'))}\nhas_global_flag = zin_eindil_named\nhas_global_flag = zin_zol_rising\n}\nNOT = { has_global_flag = zin_varner_dead }`,
    cost: N('cost.wizard'), cooldown: N('cooldown.wizard'), days_remove: N('varner.delay_days'),
    complete: 'set_country_flag = zin_elves_varner_sought', remove: 'country_event = { id = zin_elves.50 }',
    ai: ai(0, [{ add: 30, when: ge(GD, 40) }]) }));

  const sender = `NOT = { original_tag = ROOT }\nNOT = { has_government = communism }\nNOT = { has_war_with = ROOT }\nhas_opinion = { target = ROOT value > -1 }`;
  wand.push(K.decision({ id: 'zin_elves_send_healers', icon: art('healer_herbs'), allowed: 'zin_elves_is_elven_country = yes',
    targeted: { root: 'zin_elves_wanderers_room = yes', trigger: `FROM = {\n${sender}\n}` },
    available: `zin_elves_wanderers_room = yes\nFROM = {\nNOT = { has_idea = zin_elves_wanderers_lore }\nNOT = { has_idea = zin_elves_wanderers_lore_gala }\n}`, cost: 'zin_elves_cost_healers', cooldown: N('cooldown.healers'),
    complete: `${slot(N('wanderers.lore_days'))}
if = {
limit = {
original_tag = ${GALA}
has_country_flag = zin_gala_healers
}
FROM = {
add_timed_idea = { idea = zin_elves_wanderers_lore_gala days = ${N('wanderers.lore_gala_days')} }
country_event = { id = zin_elves.55 }
}
}
else = {
FROM = {
add_timed_idea = { idea = zin_elves_wanderers_lore days = ${N('wanderers.lore_days')} }
country_event = { id = zin_elves.55 }
}
}`,
    ai: ai(0, [{ add: 20, when: 'FROM = { has_government = democratic }' }, { factor: 0, when: 'has_war = yes' }]) }));
  wand.push(K.decision({ id: 'zin_elves_send_wardens', icon: art('ranger_cloak'), allowed: 'zin_elves_is_elven_country = yes',
    targeted: { root: 'zin_elves_wanderers_room = yes', trigger: `FROM = {\n${sender}\nany_enemy_country = { zin_diplo_is_dark_power = yes }\n}` },
    available: `zin_elves_wanderers_room = yes\nhas_manpower > ${N('cost.wardens_manpower') - 1}\nFROM = {\nNOT = { has_idea = zin_elves_wanderers_wardens }\n}`, cost: 'zin_elves_cost_wardens', cooldown: N('cooldown.wardens'),
    complete: `add_manpower = -${N('cost.wardens_manpower')}
${slot(N('wanderers.wardens_days'))}
FROM = {
add_timed_idea = { idea = zin_elves_wanderers_wardens days = ${N('wanderers.wardens_days')} }
country_event = { id = zin_elves.56 }
}`,
    ai: ai(0, [{ add: 40, when: 'has_global_flag = zin_war_of_last_crowns' }, { factor: 0, when: 'has_war = yes' }]) }));
  roost.push(K.decision({ id: 'zin_elves_tend_the_roosts', icon: art('dragon_wing'), allowed: magical,
    visible: 'zin_world_is_dragon_keeper = yes', available: lt(RB, 100), cost: N('cost.tend_roosts'), cooldown: N('cooldown.tend'),
    complete: call('zin_elves_add_roost_bond', { value: N('bond.tend') }),
    ai: ai(10, [{ add: 40, when: lt(RB, 50) }, { factor: 0, when: ge(RB, 95) }]) }));
  K.add('common/decisions/zin_elves.txt', [['zin_elves_kin', kin], ['zin_elves_wanderers', wand], ['zin_elves_roosts', roost]].map(([c, list]) => `${c} = {\n${list.join('\n')}\n}`).join('\n'));

  // ============================================================================================ events
  const evs = [];
  const EV = spec => evs.push(K.event(spec));
  const crowned = 'has_global_flag = zin_aurevan_crowned';
  const bands = sign => [...[20, 40, 60, 80, 100].map(n => ({ add: sign * 10, when: `NOT = { ${crowned} }\n${ge('zin_court_corruption', n)}` })), { add: sign * 10, when: crowned }];
  const rv = N('rivalry.rival_events');
  const quiet = (a, b) => `NOT = { has_war = yes }\n${b} = { NOT = { has_war = yes } }`;
  const watchTarget = `watch.start`; void watchTarget;
  const bothExist = `${exists(HER)}\n${exists(AND_)}`;

  EV({ id: 'zin_elves.1', kind: 'hidden', immediate: 'zin_elves_startup = yes' });
  EV({ id: 'zin_elves.5', kind: 'country', pic: 'concord_council', options: [
    { effect: `${call('zin_elves_add_wall_grievance', { value: N('grievance.moot_heard') })}
add_political_power = -${N('cost.aenor_moot_hear')}
${call('zin_economy_add_gold', { value: -N('cost.aenor_moot_gold') })}
zin_elves_reopen_wall_roads = yes
set_global_flag = zin_elves_moot_heard
set_temp_variable = { zin_arg_target = THIS }
event_target:zin_elves_moot_caller = {
${call('zin_elves_goodwill', { target: 'PREV' })}
country_event = { id = zin_elves.6 }
}`, ai: ai(70, bands(-1)) },
    { effect: `${call('zin_elves_add_wall_grievance', { value: N('grievance.moot_stand') })}
add_political_power = ${N('cost.aenor_moot_hear')}
clr_global_flag = zin_elves_moot_heard
event_target:zin_elves_moot_caller = { country_event = { id = zin_elves.6 } }`, ai: ai(30, bands(1)) },
  ] });
  EV({ id: 'zin_elves.6', kind: 'country', pic: 'generic_peace', descs: [{ key: 'heard', trigger: 'has_global_flag = zin_elves_moot_heard' }],
    options: [{ effect: 'clr_global_flag = zin_elves_moot_heard\nclr_global_flag = zin_elves_moot_open', ai: ai(100) }] });
  EV({ id: 'zin_elves.7', kind: 'country', pic: 'mirolon_passes',
    trigger: `zin_world_is_dragon_keeper = yes\nzin_elves_is_magical_realm = yes\n${ge('global.zin_dragons_free', 1)}\nNOT = { has_global_flag = zin_wall_accord_broken }\nNOT = { has_war = yes }\nNOT = { has_country_flag = zin_elves_dragon_event_recent }`,
    mtth: `days = ${N('cooldown.dragon_event') - 10}`,
    immediate: `set_country_flag = { flag = zin_elves_dragon_event_recent days = ${N('cooldown.dragon_event')} }`,
    options: [
      { effect: `if = {
limit = { NOT = { has_country_flag = zin_magical_forest_wyrm_guard } }
add_political_power = -${N('cost.pay_herdsmen')}
}
${call('zin_elves_add_wall_grievance', { value: N('grievance.dragon_paid') })}
set_global_flag = zin_elves_dragon_paid
if = {
limit = { ${exists(AEN)} }
${call('zin_elves_goodwill', { target: AEN })}
${AEN} = { country_event = { id = zin_elves.8 } }
}`, ai: ai(70) },
      { effect: `${call('zin_elves_add_wall_grievance', { value: N('grievance.dragon_refused') })}
clr_global_flag = zin_elves_dragon_paid
if = {
limit = { ${exists(AEN)} }
add_opinion_modifier = { target = ${AEN} modifier = zin_opinion_cold_roads }
${AEN} = { country_event = { id = zin_elves.8 } }
}`, ai: ai(30) },
    ] });
  EV({ id: 'zin_elves.8', kind: 'country', pic: 'generic_wilds', descs: [{ key: 'paid', trigger: 'has_global_flag = zin_elves_dragon_paid' }], options: [{ ai: ai(100) }] });
  EV({ id: 'zin_elves.10', kind: 'news', pic: 'generic_court', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_elves.20', kind: 'country', pic: 'generic_wilds', trigger: `original_tag = ${HER}\n${exists(AND_)}\n${quiet(HER, AND_)}`, mtth: 'days = 540', options: [
    { effect: call('zin_elves_add_rivalry', { value: rv.groves_set }), ai: ai(60) },
    { effect: call('zin_elves_add_rivalry', { value: rv.groves_leave }), ai: ai(40) }] });
  EV({ id: 'zin_elves.21', kind: 'country', pic: 'generic_wilds', trigger: `original_tag = ${AND_}\n${exists(HER)}\n${quiet(AND_, HER)}`, mtth: 'days = 540', options: [
    { effect: call('zin_elves_add_rivalry', { value: rv.slight_kind }), ai: ai(55) },
    { effect: `${call('zin_elves_add_rivalry', { value: rv.slight_pass })}\nadd_political_power = -10`, ai: ai(45) }] });
  EV({ id: 'zin_elves.22', kind: 'country', pic: 'generic_wilds', trigger: `zin_world_is_dragon_keeper = yes\n${magical}\n${bothExist}\nNOT = { has_war = yes }\n${HER} = { NOT = { has_war = yes } }\n${AND_} = { NOT = { has_war = yes } }`, mtth: 'days = 540', options: [
    { effect: call('zin_elves_add_rivalry', { value: rv.claim_favour }), ai: ai(10) },
    { effect: call('zin_elves_add_rivalry', { value: rv.claim_favour }), ai: ai(10) },
    { effect: `${call('zin_elves_add_rivalry', { value: rv.claim_roost })}\n${call('zin_elves_add_roost_bond', { value: N('bond.roost_claim') })}`, ai: ai(80) }] });
  EV({ id: 'zin_elves.23', kind: 'country', pic: 'generic_wilds', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_elves.24', kind: 'news', pic: 'generic_war', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_elves.25', kind: 'country', pic: 'generic_wilds', trigger: `has_global_flag = zin_elves_feud\nOR = {\nhas_war_with = ${HER}\nhas_war_with = ${AND_}\n}`, options: [
    { effect: `if = {\nlimit = { original_tag = ${HER} }\nwhite_peace = ${AND_}\n}\nelse = {\nwhite_peace = ${HER}\n}\nclr_global_flag = zin_elves_feud`, ai: ai(80) },
    { ai: ai(20) }] });
  EV({ id: 'zin_elves.30', kind: 'country', pic: 'generic_wilds', options: [
    { effect: `${call('zin_elves_add_kinship', { value: N('kinship.elder_moot') })}
every_country = {
limit = {
zin_elves_is_magical_realm = yes
NOT = { original_tag = ${MF} }
}
add_opinion_modifier = { target = ${MF} modifier = zin_opinion_elven_goodwill }
}`, ai: ai(50) },
    { effect: `${call('zin_elves_add_kinship', { value: N('kinship.elder_moot_wall') })}\n${call('zin_elves_add_wall_grievance', { value: N('grievance.elder_moot_wall') })}`, ai: ai(30) },
    { trigger: ge(RV, N('rivalry.mediation_floor')), effect: `${call('zin_elves_add_kinship', { value: N('kinship.elder_moot_rivals') })}\n${call('zin_elves_add_rivalry', { value: N('rivalry.moot_rivals') })}`, ai: ai(20) }] });
  const underThreat = 'OR = {\nzin_elves_eastern_threat = yes\nany_enemy_country = { zin_diplo_is_dark_power = yes }\n}';
  EV({ id: 'zin_elves.31', kind: 'country', pic: 'generic_wilds', options: [
    { effect: 'zin_elves_join_kindred = yes', ai: ai(N('kindred.join_ai_base'), [...[20, 40, 60, 80].map(n => ({ add: 5, when: ge(KS, n) })), { add: N('kindred.join_ai_war'), when: underThreat },
      { add: N('kindred.rival_ai_penalty'), when: `${ge(RV, 60)}\nOR = {\nAND = {\noriginal_tag = ${HER}\n${exists(AND_)}\n${AND_} = { zin_elves_in_kindred = yes }\n}\nAND = {\noriginal_tag = ${AND_}\n${exists(HER)}\n${HER} = { zin_elves_in_kindred = yes }\n}\n}` }]) },
    { ai: ai(70, [{ factor: 0.5, when: underThreat }]) }] });
  EV({ id: 'zin_elves.32', kind: 'news', pic: 'generic_war', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_elves.40', kind: 'country', pic: 'generic_wilds', options: [{ effect: `add_opinion_modifier = { target = ${MF} modifier = zin_opinion_elven_goodwill }`, ai: ai(100) }] });
  EV({ id: 'zin_elves.41', kind: 'country', pic: 'generic_war', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_elves.45', kind: 'country', pic: 'generic_wilds', descs: [{ key: 'revealed', trigger: 'has_global_flag = zin_afrit_revealed' }], options: [
    { effect: `add_political_power = -${N('cost.guard_roosts')}\n${call('zin_afrit_add_footholds', { value: -1 })}\nset_country_flag = { flag = zin_elves_roosts_guarded days = 365 }\n${call('zin_elves_add_roost_bond', { value: N('bond.guard') })}`, ai: ai(80) },
    { ai: ai(20) }] });
  const bonus = wards ? `\nadd_tech_bonus = {\nname = zin_elves_varners_counsel\nbonus = ${num(N('varner.tech_bonus'))}\nuses = 1\ncategory = zin_cat_wards\n}` : '';
  EV({ id: 'zin_elves.50', kind: 'country', pic: 'generic_wilds', options: [{ effect: `add_timed_idea = { idea = zin_elves_varners_counsel days = ${N('varner.counsel_days')} }${bonus}`, ai: ai(100) }] });
  EV({ id: 'zin_elves.55', kind: 'country', pic: 'generic_peace', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_elves.56', kind: 'country', pic: 'generic_peace', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_elves.60', kind: 'country', pic: 'unmasking', options: [
    { effect: `${call('zin_elves_set_pilgrim_roads', { value: N('pilgrim.closed') })}\n${call('zin_afrit_add_footholds', { value: N('pilgrim.reveal_footholds') })}`, ai: ai(80) },
    { ai: ai(20) }] });
  EV({ id: 'zin_elves.72', kind: 'country', pic: 'generic_sea', options: [
    { effect: 'zin_elves_open_gates = yes', ai: ai(N('eastern.accept_ai'), [{ factor: 0.5, when: 'zin_rules_is_historical = yes' }]) },
    { ai: ai(80) }] });
  EV({ id: 'zin_elves.73', kind: 'country', pic: 'generic_sea',
    trigger: `${magical}\nhas_global_flag = zin_eastern_invasion\nhas_war = yes\nany_enemy_country = {\n${inEast}\nNOT = { ${holdsMagical} }\n}\nNOT = { has_country_flag = zin_elves_quiet_asked }`,
    mtth: 'days = 30', immediate: 'set_country_flag = { flag = zin_elves_quiet_asked days = 120 }',
    options: [
      { effect: `random_enemy_country = {\nlimit = { ${inEast} }\nsave_event_target_as = zin_elves_quiet_foe\n}\nif = {\nlimit = { has_event_target = zin_elves_quiet_foe }\nwhite_peace = event_target:zin_elves_quiet_foe\n}`, ai: ai(90, [{ add: -70, when: 'has_country_flag = zin_magical_forest_carry_war' }]) },
      { ai: ai(10, [{ add: 70, when: 'has_country_flag = zin_magical_forest_carry_war' }]) }] });
  K.add('events/zin_elves.txt', `add_namespace = zin_elves\n\n${evs.join('\n\n')}`);

  // ============================================================================================ on_actions and AI strategy
  K.add('common/on_actions/zin_elves.txt', `on_actions = {
	# The hidden event waits one day so the peoples module has set its flags.
	on_startup = {
		effect = {
			${MF} = { country_event = { id = zin_elves.1 days = 1 } }
		}
	}
	on_monthly_${MF} = {
		effect = {
			zin_elves_monthly = yes
		}
	}
	# Fallback runner: when the Magical Forest does not exist, the first Magical Lands realm to reach the month runs it once.
	on_monthly = {
		effect = {
			if = {
				limit = {
					NOT = { country_exists = ${MF} }
					zin_elves_is_magical_realm = yes
					NOT = { has_global_flag = zin_elves_monthly_done }
				}
				set_global_flag = { flag = zin_elves_monthly_done days = 25 }
				zin_elves_monthly = yes
			}
		}
	}
	on_capitulation = {
		effect = {
			zin_elves_check_passes_lost = yes
			zin_elves_join_kin_defence = yes
		}
	}
}`);
  const strategies = [];
  for (const a of realms) {
    const others = realms.filter(b => b !== a);
    strategies.push(`zin_elves_befriend_${a.toLowerCase()} = {\n\tallowed = { original_tag = ${a} }\n\tenable = { always = yes }\n\tabort_when_not_enabled = yes\n${others.map(b => `\tai_strategy = { type = befriend id = "${b}" value = ${N('ai.befriend')} }`).join('\n')}\n}`);
  }
  strategies.push(`zin_elves_antagonize_herrodon = {\n\tallowed = { original_tag = ${HER} }\n\tenable = { ${ge(RV, 60)} }\n\tabort_when_not_enabled = yes\n\tai_strategy = { type = antagonize id = "${AND_}" value = ${N('ai.antagonize')} }\n}`);
  strategies.push(`zin_elves_antagonize_andos_enda = {\n\tallowed = { original_tag = ${AND_} }\n\tenable = { ${ge(RV, 60)} }\n\tabort_when_not_enabled = yes\n\tai_strategy = { type = antagonize id = "${HER}" value = ${N('ai.antagonize')} }\n}`);
  strategies.push(`zin_elves_protect_kin = {\n\tallowed = { original_tag = ${MF} }\n\tenable = {\n\t\thas_global_flag = zin_elves_kindred_formed\n\t\thas_war = yes\n\t}\n\tabort_when_not_enabled = yes\n${realms.filter(b => b !== MF).map(b => `\tai_strategy = { type = protect id = "${b}" value = ${N('ai.protect')} }`).join('\n')}\n}`);
  K.add('common/ai_strategy/zin_elves.txt', strategies.join('\n\n'));

  // ============================================================================================ staged files
  K.stage(staged);
  staged.add('localisation/english/zin_elves_l_english.yml', K.loc.bytes());
  staged.text('interface/zz_zin_elves.gfx', K.spriteText('Decision and category pictures of the elves mechanic: each shows a picture of the icon catalog until the art pass draws its own. Loaded after the vanilla files (zz_).'));
  const kinds = k => K.defs.get(k)?.size ?? 0;
  return { kit: K, counts: { effects: kinds('effect'), triggers: kinds('trigger'), decisions: kinds('decision'), categories: kinds('category'), ideas: kinds('idea'), events: kinds('event'), dynamic: kinds('dynamic'), opinions: kinds('opinion'), strategies: strategies.length, locKeys: K.loc.size, realms: realms.length, sunRealms: sun.length }, tags: { MF, HER, AND: AND_, NOL, AEN, KIN, WOR, GALA }, realms };
}
