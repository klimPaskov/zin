// Lerendor and the Treaty of the Narrow Strait (docs/specs/04_mechanics/lerendor_narrow_strait.md): strait standing, the toll
// quarrel and the strait dues, the union of the two crowns, the Leren Compact and the smaller crowns (lean and hegemony), the three
// routes, the call to honour the treaty, the withdrawal at the war, closing the strait, the Dark Lands across the straits and
// Zol's dead from the north.
//
//   const r = await buildLerendor(staged, { countries, table? })
//   returns { kit, counts }; throws on a text, id, picture or reference error.
//
// Data: data/mech_powers_lerendor.json (numbers, names, externals), data/mech_powers_lerendor_text.json (all text).
// Events .30 to .33, .35, .36, .40, .41, .45 and .51 are written by the events slice (docs/specs/06_events); this module fires them.
import { ZIN } from '../lib/paths.mjs';
import { loadCatalogKeys } from '../lib/inst_util.mjs';
import { Kit, loadMech, num, ge, gt, le, lt, eq, bump, call, ai, fmt } from '../lib/mp_kit.mjs';
import { meterFill } from '../lib/mech_court_gui.mjs';

export async function buildLerendor(staged, ctx) {
  const { countries } = ctx;
  const D = await loadMech('mech_powers_lerendor.json'), T = await loadMech('mech_powers_lerendor_text.json');
  const byName = new Map(countries.map(c => [c.name, c]));
  const tag = name => { const c = byName.get(name); if (!c) throw new Error(`Lerendor: country ${name} is not in the roster`); return c.tag; };
  const R = D.realms, LER = tag(R.lerendor), AEN = tag(R.aenor), EEK = tag(R.eekedor), REN = tag(R.ren), AND_ = tag(R.andos_enda), GOLD = tag(R.goldoroth), DON = tag(R.dondor), BLACK = tag(R.blackton), ZOL = tag(R.zol);
  const north = countries.filter(c => c.scan === R.north_scan && c.tag !== LER);
  const dark = countries.filter(c => c.scan === R.dark_scan);
  for (const n of Object.keys(D.leans.north)) if (!north.some(c => c.name === n)) throw new Error(`Lerendor: ${n} is not a North Lands country in the roster`);
  for (const n of Object.keys(D.leans.dark)) if (!dark.some(c => c.name === n)) throw new Error(`Lerendor: ${n} is not a Dark Lands country in the roster`);
  const catalog = new Set(await loadCatalogKeys());
  const K = new Kit('leren', D, T);
  const N = k => K.N(k);
  const art = key => { if (!catalog.has(key)) throw new Error(`Lerendor: icon ${key} is not in the catalog`); return key; };
  const SD = 'zin_strait_standing';
  const gd = v => call('zin_world_add_gathering_dark', { value: v });
  const exists = t => `country_exists = ${t}`;
  const inLer = body => `if = {\nlimit = { country_exists = ${LER} }\n${LER} = {\n${body}\n}\n}`;
  const standing = v => call('zin_leren_add_strait_standing', { value: v });
  const flag = (a, b) => `OR = {\nhas_country_flag = ${a}\nhas_country_flag = ${b}\n}`;

  // ============================================================================================ scripted triggers
  const trig = [];
  const T_ = (name, body, note) => trig.push(K.trigger(name, body, note));
  T_('zin_is_lerendor', `original_tag = ${LER}`, 'Generated tag check.');
  T_('zin_leren_is_aenor', `original_tag = ${AEN}`, 'Generated tag check: the crown that signed the treaty, not a breakaway realm.');
  T_('zin_leren_treaty_in_force', `country_exists = ${LER}\ncountry_exists = ${AEN}\nNOT = { has_global_flag = zin_leren_withdrawal }`);
  T_('zin_leren_honours_treaty', `country_exists = ${LER}\n${LER} = { has_country_flag = zin_leren_route_honour }`);
  T_('zin_leren_stands_apart', `country_exists = ${LER}\n${LER} = { has_country_flag = zin_leren_route_break }`);
  T_('zin_leren_seeks_supremacy', `country_exists = ${LER}\n${LER} = { has_country_flag = zin_leren_route_supremacy }`);
  T_('zin_leren_strait_trusted', `country_exists = ${LER}\n${LER} = { ${ge(SD, N('standing.trusted'))} }`);
  T_('zin_leren_strait_broken', `country_exists = ${LER}\n${LER} = { ${le(SD, N('standing.broken'))} }`);
  T_('zin_leren_state_held', `controller = {\nOR = {\noriginal_tag = ${LER}\nis_subject_of = ${LER}\n}\n}`, 'State scope: Lerendor or one of its subjects controls the state.');
  T_('zin_leren_guards_strait', `country_exists = ${LER}\nany_state = {\nzin_is_site_sonargur = yes\nzin_leren_state_held = yes\n}\nNOT = {\nany_state = {\nzin_is_site_strait_north = yes\nNOT = { zin_leren_state_held = yes }\n}\n}`, 'Lerendor\'s own shore holds the strait: Sonargur and every state of the Leren shore (enough to close it, O9).');
  T_('zin_leren_holds_strait', `zin_leren_guards_strait = yes\nNOT = {\nany_state = {\nzin_is_site_strait_gateway = yes\nNOT = { zin_leren_state_held = yes }\n}\n}`, 'The whole strait: also R\'en\'s coast (O9).');
  T_('zin_leren_strait_barred', `zin_leren_holds_strait = yes\n${LER} = {\nhas_war_with = ${ZOL}\nOR = {\nhas_completed_focus = zin_lerendor_hold_the_capes\nhas_completed_focus = zin_lerendor_the_watch_holds\n}\n}`, 'The hook for the Zol slice: Lerendor holds the strait, fights Zol and has the capes held.');
  T_('zin_leren_is_north_crown', `NOT = { original_tag = ${LER} }\ncapital_scope = { zin_is_region_north_lands = yes }`);
  T_('zin_leren_is_dark_shore', `capital_scope = { zin_is_region_dark_lands = yes }\nany_owned_state = { is_coastal = yes }`);
  for (const k of ['compact_open', 'envoys', 'tariff', 'marriages', 'open_compact', 'one_banner', 'dark_shore', 'dark_protection', 'full_dues', 'iron_toll', 'seas_closed']) {
    T_(`zin_leren_tree_${k}`, `country_exists = ${LER}\n${LER} = {\n${flag(`zin_leren_${k}`, `zin_lerendor_${k}`)}\n}`, `The Lerendor tree's flag for ${k.replace(/_/g, ' ')}: the mechanic's name zin_leren_${k} or the tree's zin_lerendor_${k}.`);
  }
  T_('zin_leren_is_compact_target', `OR = {\nzin_leren_is_north_crown = yes\nAND = {\nzin_leren_is_dark_shore = yes\nzin_leren_tree_dark_shore = yes\n}\noriginal_tag = ${AND_}\n}\nNOT = { has_war_with = ${LER} }`, 'A crown Lerendor may court into the Leren Compact (Andos Enda only with zin_refusal_lifted, S5).');
  trig.push(`zin_leren_date_question = {\n\tdate > ${N('gates').question_from}\n}`); K.def('trigger', 'zin_leren_date_question');
  trig.push(`zin_leren_date_tales = {\n\tdate > ${N('gates').tales_from}\n\tdate < ${N('gates').tales_until}\n}`); K.def('trigger', 'zin_leren_date_tales');
  T_('zin_leren_question_open', `OR = {\nhas_global_flag = zin_golden_king_dead\nzin_leren_date_question = yes\n${ge(SD, N('standing.question_gate'))}\n${le(SD, -N('standing.question_gate'))}\n}`, 'Scope: Lerendor. The Question of the Strait may be asked.');
  T_('zin_leren_estates_active', `OR = {\nhas_idea = zin_lerendor_estates_in_council\nhas_idea = zin_lerendor_estates_ascendant_spirit\n}`, 'Scope: Lerendor. The estates\' spirit is active.');
  // Peace gates: nothing that makes a claim or a cause of war is reachable without one of these.
  T_('zin_leren_gate_aenor', `zin_leren_seeks_supremacy = yes\nhas_global_flag = zin_leren_withdrawal`, 'Peace gate: any cause of war or claim against Aenor.');
  T_('zin_leren_gate_ren', `zin_leren_seeks_supremacy = yes\nOR = {\nhas_global_flag = zin_war_of_last_crowns\n${REN} = {\nany_enemy_country = { is_in_faction_with = ${LER} }\n}\n}`, 'Peace gate: any cause of war or claim against R\'en.');
  T_('zin_leren_gate_far_shore', `zin_leren_seeks_supremacy = yes\nhas_global_flag = zin_leren_withdrawal`, 'Peace gate: claims on the far shore of the strait.');
  T_('zin_leren_gate_dark_shore', `OR = {\nhas_global_flag = zin_war_of_last_crowns\nAND = {\ncountry_exists = ${GOLD}\n${GOLD} = {\nOR = {\nhas_war_with = ${DON}\nhas_war_with = ${BLACK}\n}\n}\n}\n}`, 'Peace gate: wars and claims on the Dark Shore.');
  K.add('common/scripted_triggers/zin_leren.txt', trig.join('\n\n'));

  // ============================================================================================ scripted effects
  const eff = [];
  const E_ = (name, body, note) => eff.push(K.effect(name, body, note));
  E_('zin_leren_update_treaty_band', `if = {
limit = { ${ge(SD, N('standing.trusted'))} }
if = { limit = { NOT = { has_idea = zin_leren_treaty_trusted } } add_ideas = zin_leren_treaty_trusted }
if = { limit = { has_idea = zin_leren_treaty_broken_faith } remove_ideas = zin_leren_treaty_broken_faith }
}
else_if = {
limit = { ${le(SD, N('standing.broken'))} }
if = { limit = { NOT = { has_idea = zin_leren_treaty_broken_faith } } add_ideas = zin_leren_treaty_broken_faith }
if = { limit = { has_idea = zin_leren_treaty_trusted } remove_ideas = zin_leren_treaty_trusted }
}
else = {
if = { limit = { has_idea = zin_leren_treaty_trusted } remove_ideas = zin_leren_treaty_trusted }
if = { limit = { has_idea = zin_leren_treaty_broken_faith } remove_ideas = zin_leren_treaty_broken_faith }
}`, 'Scope: Lerendor. Swaps the band spirits at 40 and -40.');
  E_('zin_leren_add_strait_standing', `if = {
limit = { zin_leren_treaty_in_force = yes }
${LER} = {
${bump(SD, 'zin_arg_value', -100, 100)}
zin_leren_update_treaty_band = yes
}
}`, 'Any scope. Argument: zin_arg_value. Adds to Lerendor\'s standing while the treaty stands (the only way other specs change it).');
  const tollVar = (name, key) => [0, 1, 2, 3, 4].map((l, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { ${eq('zin_leren_toll_level', l)} }\nset_variable = { ${name} = ${num(N(`toll.${key}.${l}`))} }\n}`).join('\n');
  E_('zin_leren_set_toll_level', `set_temp_variable = { zin_leren_t_level = zin_arg_level }
if = { limit = { ${gt('zin_leren_t_level', 4)} } set_temp_variable = { zin_leren_t_level = 4 } }
if = { limit = { ${lt('zin_leren_t_level', 0)} } set_temp_variable = { zin_leren_t_level = 0 } }
if = { limit = { ${gt('zin_leren_t_level', 3)} NOT = { zin_leren_tree_iron_toll = yes } } set_temp_variable = { zin_leren_t_level = 3 } }
if = { limit = { ${gt('zin_leren_t_level', 2)} NOT = { zin_leren_tree_full_dues = yes } NOT = { zin_leren_tree_iron_toll = yes } } set_temp_variable = { zin_leren_t_level = 2 } }
set_variable = { zin_leren_toll_level = zin_leren_t_level }
${tollVar('zin_leren_toll_pp', 'pp')}
${tollVar('zin_leren_toll_cg', 'cg')}
force_update_dynamic_modifier = yes`, 'Scope: Lerendor. Argument: zin_arg_level (0 to 4). Level 3 needs Full Strait Dues, level 4 the Iron Toll (section 2).');
  E_('zin_leren_add_union_cohesion', `${bump('zin_leren_union_cohesion', 'zin_arg_value', 0, 100)}
set_variable = { zin_leren_union_stab = zin_leren_union_cohesion }
add_to_variable = { zin_leren_union_stab = -50 }
divide_variable = { zin_leren_union_stab = ${N('cohesion.per_stab')} }
set_variable = { zin_leren_union_pp = zin_leren_union_cohesion }
add_to_variable = { zin_leren_union_pp = -50 }
divide_variable = { zin_leren_union_pp = ${N('cohesion.per_pp')} }
force_update_dynamic_modifier = yes
if = {
limit = {
${ge('zin_leren_union_cohesion', N('cohesion.one_throne'))}
NOT = { has_country_flag = zin_leren_one_throne_seen }
}
set_country_flag = zin_leren_one_throne_seen
country_event = { id = zin_leren.81 }
}`, 'Scope: Lerendor. Argument: zin_arg_value. Cohesion drives the stability and authority of the union (section 3).');
  E_('zin_leren_add_lean', bump('zin_leren_lean', 'zin_arg_value', -100, 100), 'Scope: a North Lands, Dark Lands or Andos Enda country. Argument: zin_arg_value. Parim\'s courting uses negative values.');
  E_('zin_leren_update_hegemony', `set_temp_variable = { zin_leren_t_heg = 0 }
every_state = {
limit = {
zin_is_region_north_lands = yes
NOT = { has_state_flag = zin_leren_home_state }
}
if = {
limit = { zin_leren_state_held = yes }
add_to_temp_variable = { zin_leren_t_heg = 1.5 }
}
else_if = {
limit = { controller = { is_in_faction_with = ${LER} } }
add_to_temp_variable = { zin_leren_t_heg = 1 }
}
}
multiply_temp_variable = { zin_leren_t_heg = 100 }
divide_temp_variable = { zin_leren_t_heg = ${N('hegemony.states')} }
clamp_temp_variable = { var = zin_leren_t_heg min = 0 max = 100 }
set_variable = { zin_leren_hegemony = zin_leren_t_heg }
set_variable = { zin_leren_heg_pp = zin_leren_hegemony }
divide_variable = { zin_leren_heg_pp = ${N('hegemony.pp_div')} }
set_variable = { zin_leren_heg_trade = zin_leren_hegemony }
divide_variable = { zin_leren_heg_trade = ${N('hegemony.trade_div')} }
force_update_dynamic_modifier = yes`, 'Scope: Lerendor. Weight 1 for a North Lands state a Compact member holds, 1.5 for one Lerendor or its subjects hold, over the 54 states Lerendor did not start with (section 4).');

  // ---- withdrawal, honour, supremacy
  E_('zin_leren_clear_grievances', `if = { limit = { has_idea = zin_leren_grievance_1716 } remove_ideas = zin_leren_grievance_1716 }
if = { limit = { has_idea = zin_leren_grievance_unanswered } remove_ideas = zin_leren_grievance_unanswered }
if = {
limit = { country_exists = ${AEN} }
remove_opinion_modifier = { target = ${AEN} modifier = zin_opinion_toll_of_1716 }
remove_opinion_modifier = { target = ${AEN} modifier = zin_leren_envoys_mocked }
}`, 'Scope: Lerendor. Removes the grievance spirits and the opinions of the toll quarrel.');
  E_('zin_leren_withdraw', `if = {
limit = {
zin_leren_treaty_in_force = yes
}
set_global_flag = zin_leren_withdrawal
set_variable = { global.zin_leren_withdrawal_date = global.date }
set_variable = { global.zin_leren_withdrawal_year = global.year }
${LER} = {
remove_opinion_modifier = { target = ${AEN} modifier = zin_leren_treaty_partner }
add_opinion_modifier = { target = ${AEN} modifier = zin_leren_treaty_broken }
diplomatic_relation = { country = ${AEN} relation = military_access active = no }
if = { limit = { is_in_faction_with = ${AEN} } leave_faction = yes }
add_timed_idea = { idea = zin_leren_treaty_torn days = ${N('cooldown.torn_days')} }
if = { limit = { has_idea = zin_leren_grievance_unanswered } remove_ideas = zin_leren_grievance_unanswered }
country_event = { id = zin_leren.30 }
}
${AEN} = {
remove_opinion_modifier = { target = ${LER} modifier = zin_leren_treaty_partner }
add_opinion_modifier = { target = ${LER} modifier = zin_leren_treaty_broken }
diplomatic_relation = { country = ${LER} relation = military_access active = no }
country_event = { id = zin_leren.31 }
}
${gd(N('gd.withdrawal'))}
every_country = {
limit = { is_ai = no }
news_event = { id = zin_leren.32 }
}
}`, 'Any scope. The withdrawal of section 7: flag, date, opinions, access, faction, the torn treaty, Gathering Dark +4, the events. Standing is frozen because zin_leren_add_strait_standing does nothing once the flag is set.');
  E_('zin_leren_join_aenor_defence', `if = { limit = { zin_leren_treaty_in_force = yes } ${LER} = {
${AEN} = {
every_enemy_country = {
limit = {
${AEN} = { has_defensive_war_with = PREV }
NOT = { is_in_faction_with = ${LER} }
NOT = { is_subject_of = ${LER} }
}
save_event_target_as = zin_leren_foe
${LER} = {
add_to_war = {
targeted_alliance = ${AEN}
enemy = event_target:zin_leren_foe
hostility_reason = asked_to_join
single_target_only = yes
}
}
}
}
set_global_flag = zin_leren_treaty_honoured
}
every_country = {
limit = { is_ai = no }
news_event = { id = zin_leren.33 }
}
}`, 'Any scope. Lerendor joins every defensive war of Aenor under the treaty (section 6).');
  E_('zin_leren_invite_to_compact', `var:zin_arg_target = { country_event = { id = zin_leren.70 } }`, 'Scope: Lerendor. Argument: zin_arg_target.');
  E_('zin_leren_offer_protection', `var:zin_arg_target = { country_event = { id = zin_leren.71 } }`, 'Scope: Lerendor. Argument: zin_arg_target.');
  E_('zin_leren_close_strait', `var:zin_arg_target = {
add_timed_idea = { idea = zin_leren_strait_closed days = ${N('cooldown.close_days')} }
add_opinion_modifier = { target = ${LER} modifier = zin_leren_strait_closed_on_us }
country_event = { id = zin_leren.90 }
}`, 'Scope: Lerendor. Argument: zin_arg_target. The strait is shut to one country for 180 days.');
  E_('zin_leren_claim_r_en', `if = {
limit = { zin_leren_gate_ren = yes }
every_state = {
limit = { owner = { original_tag = ${REN} } }
add_claim_by = ${LER}
}
create_wargoal = {
type = puppet_wargoal_focus
target = ${REN}
}
}`, 'Scope: Lerendor. Claims on every state R\'en owns and a cause of war to make it a vassal, when the peace gate is open.');
  E_('zin_leren_claim_far_shore', `if = {
limit = { zin_leren_gate_far_shore = yes }
every_state = {
limit = {
zin_is_site_strait_south = yes
NOT = { owner = { original_tag = ${LER} } }
}
add_claim_by = ${LER}
}
every_country = {
limit = {
NOT = { original_tag = ${LER} }
any_owned_state = { zin_is_site_strait_south = yes }
}
${LER} = { create_wargoal = { type = take_claimed_state target = PREV } }
}
}`, 'Scope: Lerendor. Claims on the far shore and a cause of war against each owner, when the peace gate is open.');
  E_('zin_leren_declare_supremacy', `set_global_flag = zin_leren_strait_supremacy
every_country = {
limit = { is_ai = no }
news_event = { id = zin_leren.60 }
}`, 'Any scope. Lerendor proclaims itself Sovereign of the Narrow Sea; toll level 4 is allowed by its own tree flag.');

  // ---- startup and monthly
  const leanRows = [
    ...north.map(c => ({ c, v: D.leans.north[c.name] ?? D.leans.northDefault })),
    ...dark.map(c => ({ c, v: D.leans.dark[c.name] ?? D.leans.darkDefault })),
    { c: byName.get(R.andos_enda), v: D.leans.other[R.andos_enda] },
  ];
  E_('zin_leren_ui_refresh', `${meterFill(SD, 'zin_ui_standing_fill', 'signed')}
${meterFill('zin_leren_union_cohesion', 'zin_ui_cohesion_fill')}
${meterFill('zin_leren_hegemony', 'zin_ui_hegemony_fill')}
set_variable = { zin_ui_compact_members = 0 }
every_country = {
limit = {
zin_leren_is_north_crown = yes
is_in_faction_with = ${LER}
}
${LER} = { add_to_variable = { zin_ui_compact_members = 1 } }
}
add_to_variable = { global.zin_ui_tick = 1 }`, 'Scope: Lerendor. Meter fills of the Narrow Strait panel and the count of Compact crowns.');
  E_('zin_leren_startup', `# Lerendor
${LER} = {
save_global_event_target_as = zin_leren_country
set_variable = { ${SD} = ${N('standing.start')} }
set_variable = { zin_leren_toll_level = ${N('toll.start')} }
set_variable = { zin_leren_union_cohesion = ${N('cohesion.start')} }
set_variable = { zin_leren_hegemony = 0 }
add_ideas = zin_leren_grievance_1716
add_dynamic_modifier = { modifier = zin_leren_strait_dues }
add_dynamic_modifier = { modifier = zin_leren_union }
add_dynamic_modifier = { modifier = zin_leren_hegemony_mod }
${call('zin_leren_set_toll_level', { level: N('toll.start') })}
${call('zin_leren_add_union_cohesion', { value: 0 })}
every_owned_state = {
limit = { zin_is_region_north_lands = yes }
set_state_flag = zin_leren_home_state
}
zin_leren_update_hegemony = yes
zin_leren_update_treaty_band = yes
zin_leren_ui_refresh = yes
add_opinion_modifier = { target = ${AEN} modifier = zin_leren_treaty_partner }
reverse_add_opinion_modifier = { target = ${AEN} modifier = zin_leren_treaty_partner }
}
# the leans of the smaller crowns
${leanRows.map(({ c, v }) => `${c.tag} = { set_variable = { zin_leren_lean = ${v} } }`).join('\n')}`, 'Run by the hidden event zin_leren.1: start values, spirits, dynamic modifiers, the leans, the treaty partner opinions (section 4 and the start situation).');

  E_('zin_leren_monthly', `# standing drifts with the dues, the Golden Court and the route (frozen after the withdrawal)
set_temp_variable = { zin_leren_t_drift = 0 }
if = { limit = { ${eq('zin_leren_toll_level', 0)} } add_to_temp_variable = { zin_leren_t_drift = ${N('standing.drift.0')} } }
if = { limit = { ${eq('zin_leren_toll_level', 2)} } add_to_temp_variable = { zin_leren_t_drift = ${N('standing.drift.2')} } }
if = { limit = { ${eq('zin_leren_toll_level', 3)} } add_to_temp_variable = { zin_leren_t_drift = ${N('standing.drift.3')} } }
if = { limit = { ${eq('zin_leren_toll_level', 4)} } add_to_temp_variable = { zin_leren_t_drift = ${N('standing.drift.4')} } }
if = { limit = { country_exists = ${AEN} ${AEN} = { ${ge('zin_court_corruption', N('standing.corruption_at'))} } } add_to_temp_variable = { zin_leren_t_drift = ${N('standing.corruption_drift')} } }
if = { limit = { has_country_flag = zin_leren_route_honour } add_to_temp_variable = { zin_leren_t_drift = ${N('standing.route_honour')} } }
if = { limit = { has_country_flag = zin_leren_route_break } add_to_temp_variable = { zin_leren_t_drift = ${N('standing.route_break')} } }
if = { limit = { has_country_flag = zin_leren_route_supremacy } add_to_temp_variable = { zin_leren_t_drift = ${N('standing.route_supremacy')} } }
set_temp_variable = { zin_arg_value = zin_leren_t_drift }
zin_leren_add_strait_standing = yes
# cohesion
set_temp_variable = { zin_leren_t_coh = 0 }
if = { limit = { ${ge('zin_leren_toll_level', 3)} } add_to_temp_variable = { zin_leren_t_coh = ${N('cohesion.toll_drain')} } }
if = { limit = { zin_leren_estates_active = yes } add_to_temp_variable = { zin_leren_t_coh = ${N('cohesion.estates_gain')} } }
set_temp_variable = { zin_arg_value = zin_leren_t_coh }
zin_leren_add_union_cohesion = yes
# the dues weigh on the coastal crowns, the Iron Toll on all of them
if = {
limit = { ${ge('zin_leren_toll_level', N('toll.lean_drain_from'))} }
every_country = {
limit = {
zin_leren_is_north_crown = yes
any_owned_state = { is_coastal = yes }
}
${call('zin_leren_add_lean', { value: N('toll.lean_drain') })}
}
}
if = {
limit = { ${eq('zin_leren_toll_level', 4)} }
every_country = {
limit = { zin_leren_is_north_crown = yes }
${call('zin_leren_add_lean', { value: N('toll.iron_lean_drain') })}
}
}
zin_leren_update_hegemony = yes
zin_leren_update_treaty_band = yes
# the Keepers of the Strait
if = {
limit = {
zin_leren_guards_strait = yes
has_war = yes
NOT = { has_idea = zin_leren_keepers_of_the_strait }
}
add_ideas = zin_leren_keepers_of_the_strait
}
if = {
limit = {
has_idea = zin_leren_keepers_of_the_strait
OR = {
NOT = { zin_leren_guards_strait = yes }
NOT = { has_war = yes }
}
}
remove_ideas = zin_leren_keepers_of_the_strait
}
# a war with no attacker left does not call the treaty again
every_country = {
limit = {
has_country_flag = zin_leren_called_against
NOT = { has_war_with = ${AEN} }
}
clr_country_flag = zin_leren_called_against
}
# Aenor's defensive war calls the treaty once, however many attack (O9)
if = {
limit = {
zin_leren_treaty_in_force = yes
NOT = { has_country_flag = zin_leren_asked_for_time }
}
random_country = {
limit = {
has_war_with = ${AEN}
${AEN} = { has_defensive_war_with = PREV }
NOT = { is_in_faction_with = ${LER} }
NOT = { is_subject_of = ${LER} }
NOT = { has_country_flag = zin_leren_called_against }
}
save_event_target_as = zin_leren_first_attacker
}
if = {
limit = { has_event_target = zin_leren_first_attacker }
every_country = {
limit = {
has_war_with = ${AEN}
${AEN} = { has_defensive_war_with = PREV }
}
set_country_flag = zin_leren_called_against
}
event_target:zin_leren_first_attacker = { ${LER} = { country_event = { id = zin_leren.20 } } }
clear_global_event_target = zin_leren_first_attacker
}
}
# the war has come: the court decides for an AI Lerendor, a human is asked
if = {
limit = {
zin_leren_treaty_in_force = yes
has_global_flag = { flag = zin_war_of_last_crowns days > ${N('cooldown.ai_fallback_days') - 1} }
is_ai = yes
NOT = { has_country_flag = zin_leren_route_honour }
${le(SD, N('standing.withdraw_at'))}
NOT = { has_country_flag = zin_leren_court_decided }
}
set_country_flag = zin_leren_court_decided
country_event = { id = zin_leren.35 }
}
if = {
limit = {
zin_leren_treaty_in_force = yes
has_global_flag = { flag = zin_war_of_last_crowns days > ${N('cooldown.prompt_days') - 1} }
is_ai = no
NOT = { has_country_flag = zin_leren_route_honour }
NOT = { has_country_flag = zin_leren_route_break }
NOT = { has_country_flag = zin_leren_route_supremacy }
NOT = { has_country_flag = zin_leren_prompted }
}
set_country_flag = zin_leren_prompted
country_event = { id = zin_leren.36 }
}
if = {
limit = {
zin_leren_strait_barred = yes
NOT = { has_global_flag = zin_leren_barred_news }
}
set_global_flag = zin_leren_barred_news
every_country = {
limit = { is_ai = no }
news_event = { id = zin_leren.55 }
}
}
if = {
limit = {
has_completed_focus = zin_lerendor_faithful_to_the_crown
has_global_flag = zin_afrit_king_of_east
NOT = { has_country_flag = zin_leren_crown_fled_asked }
}
set_country_flag = zin_leren_crown_fled_asked
country_event = { id = zin_lerendor.14 }
}
zin_leren_ui_refresh = yes
# last, the trees refresh their layouts (decision E4)
every_country = {
limit = {
OR = {
zin_is_lerendor = yes
zin_leren_is_north_crown = yes
}
}
mark_focus_tree_layout_dirty = yes
}`, 'Scope: Lerendor. The monthly pulse of section 1 to 7: drifts, hegemony, bands, the Keepers of the Strait, the call to the treaty, the withdrawal checks, the layouts.');
  K.add('common/scripted_effects/zin_leren.txt', eff.join('\n\n'));

  // ============================================================================================ ideas, modifiers, opinions
  const ideas = [
    ['zin_leren_grievance_1716', 'toll_house', { war_support_factor: 0.03, political_power_gain: -0.05 }],
    ['zin_leren_grievance_unanswered', 'seal_wax', { war_support_factor: 0.05, stability_factor: -0.02 }],
    ['zin_leren_treaty_trusted', 'scroll_treaty', { stability_factor: 0.03, consumer_goods_factor: -0.02, opinion_gain_monthly_factor: 0.1 }],
    ['zin_leren_treaty_broken_faith', 'chain_broken', { war_support_factor: 0.05, stability_factor: -0.03, drift_defence_factor: 0.1 }],
    ['zin_leren_treaty_torn', 'scroll_sealed', { war_support_factor: 0.05, stability_factor: -0.05, political_power_gain: 0.1 }],
    ['zin_leren_strait_closed', 'strait_chain', { naval_speed_factor: -0.1, navy_max_range_factor: -0.15, consumer_goods_factor: 0.02 }],
    ['zin_leren_keepers_of_the_strait', 'lighthouse', { naval_detection: 0.1, convoy_raiding_efficiency_factor: 0.1, positioning: 0.05 }],
    ['zin_leren_charter_trade', 'ledger_coins', { consumer_goods_factor: -0.01 }],
  ];
  K.add('common/ideas/zin_leren.txt', `ideas = {\n\tcountry = {\n${ideas.map(([id, pic, mods]) => K.idea({ id, picture: `zin_${art(pic)}`, mods })).join('\n')}\n\t}\n}`);
  const dyn = (id, icon, mods) => { K.def('dynamic', id); K.loc.set(id, T.dynamic[id]); return `${id} = {\n\tenable = { always = yes }\n\ticon = GFX_idea_zin_${art(icon)}\n${Object.entries(mods).map(([k, v]) => `\t${k} = ${v}`).join('\n')}\n}`; };
  K.add('common/dynamic_modifiers/zin_leren.txt', [
    dyn('zin_leren_strait_dues', 'toll_house', { political_power_gain: 'zin_leren_toll_pp', consumer_goods_factor: 'zin_leren_toll_cg' }),
    dyn('zin_leren_union', 'two_crowns', { stability_factor: 'zin_leren_union_stab', political_power_factor: 'zin_leren_union_pp' }),
    dyn('zin_leren_hegemony_mod', 'banner_league', { political_power_gain: 'zin_leren_heg_pp', faction_trade_opinion_factor: 'zin_leren_heg_trade' }),
  ].join('\n\n'));
  const op = [['zin_leren_treaty_partner', 20, { trade: true }], ['zin_leren_envoys_mocked', -20, { decay: 1 }], ['zin_leren_treaty_broken', -40, { decay: 0.5 }], ['zin_leren_compact_kin', 15, {}], ['zin_leren_strait_closed_on_us', -30, { decay: 1 }], ['zin_leren_appeal_heard', 5, { decay: 0.5 }], ['zin_leren_marriage_ties', 20, { decay: 0.2 }]];
  K.add('common/opinion_modifiers/zin_leren.txt', `opinion_modifiers = {\n${op.map(([id, v, o]) => { if (!T.opinions[id]) throw new Error(`no text for opinion ${id}`); K.loc.set(id, T.opinions[id]); return K.opinion(id, v, o).replace(/^/gm, '\t'); }).join('\n')}\n}`);

  // ============================================================================================ decisions
  K.add('common/decisions/categories/zin_leren.txt', [
    K.category('zin_leren_strait', art('strait_chain'), { visible: 'zin_is_lerendor = yes' }),
    K.category('zin_leren_compact', art('alliance_rings'), { visible: 'zin_is_lerendor = yes\nzin_leren_tree_compact_open = yes' }),
  ].join('\n'));
  const onlyLer = `original_tag = ${LER}`;
  const route = (r) => `has_country_flag = zin_leren_route_${r}`;
  const strait = [], compact = [];
  const maxToll = `OR = {\n${lt('zin_leren_toll_level', N('toll.max'))}\nAND = {\n${lt('zin_leren_toll_level', 3)}\nzin_leren_tree_full_dues = yes\n}\nAND = {\n${lt('zin_leren_toll_level', 4)}\nzin_leren_tree_iron_toll = yes\n}\n}`;
  strait.push(K.decision({ id: 'zin_leren_toll_lower', icon: art('toll_house'), allowed: onlyLer, available: gt('zin_leren_toll_level', 0), cost: N('cost.toll'), cooldown: N('cooldown.toll'),
    complete: `set_temp_variable = { zin_arg_level = zin_leren_toll_level }
add_to_temp_variable = { zin_arg_level = -1 }
zin_leren_set_toll_level = yes
${standing(N('standing.toll_lower'))}`,
    ai: ai(0, [{ add: 40, when: `${route('honour')}\n${gt('zin_leren_toll_level', 1)}` }, { add: 20, when: `${gt('zin_leren_toll_level', 2)}\nNOT = { ${route('supremacy')} }` }]) }));
  strait.push(K.decision({ id: 'zin_leren_toll_raise', icon: art('toll_house'), allowed: onlyLer, available: maxToll, cost: N('cost.toll'), cooldown: N('cooldown.toll'),
    complete: `set_temp_variable = { zin_arg_level = zin_leren_toll_level }\nadd_to_temp_variable = { zin_arg_level = 1 }\nzin_leren_set_toll_level = yes\n${standing(N('standing.toll_raise'))}`,
    ai: ai(0, [{ add: 70, when: `OR = {\n${route('break')}\nzin_rules_ai_branch_leren_historical = yes\n}\n${lt('zin_leren_toll_level', 2)}\nhas_country_flag = zin_leren_toll_mocked` }, { add: 30, when: `${route('supremacy')}` }, { factor: 0, when: route('honour') }]) }));
  strait.push(K.decision({ id: 'zin_leren_appeal_to_the_treaty', icon: art('scroll_treaty'), allowed: onlyLer, available: 'zin_leren_treaty_in_force = yes', cost: N('cost.appeal'), cooldown: N('cooldown.appeal'),
    complete: `${standing(N('standing.appeal'))}
${AEN} = { add_opinion_modifier = { target = ${LER} modifier = zin_leren_appeal_heard } }`,
    ai: ai(0, [{ add: 35, when: route('honour') }]) }));
  strait.push(K.decision({ id: 'zin_leren_close_the_strait', icon: art('strait_chain'), allowed: onlyLer,
    targeted: { root: `OR = {\n${route('break')}\n${route('supremacy')}\nhas_war = yes\n}`, trigger: `FROM = {\nNOT = { original_tag = ROOT }\nNOT = { has_idea = zin_leren_strait_closed }\nOR = {\nhas_war_with = ROOT\nAND = {\nhas_global_flag = zin_leren_withdrawal\nhas_war = yes\nNOT = { is_in_faction_with = ROOT }\n}\n}\n}` },
    available: `zin_leren_guards_strait = yes\nOR = {\nzin_leren_tree_seas_closed = yes\nhas_completed_focus = zin_lerendor_strait_watch\n}`, cost: N('cost.close_strait'),
    complete: 'FROM = { save_event_target_as = zin_leren_closing }\nset_temp_variable = { zin_arg_target = FROM }\nzin_leren_close_strait = yes',
    ai: ai(0, [{ add: 40, when: `has_global_flag = zin_leren_withdrawal\nOR = {\n${route('break')}\n${route('supremacy')}\n}\nhas_political_power > ${N('ai.ai_closes_pp') - 1}\nFROM = { has_navy_size = { size > ${N('ai.close_ships')} } }` }, { add: 40, when: `FROM = { original_tag = ${ZOL} }\nhas_global_flag = zin_leren_withdrawal` }, { factor: 0, when: route('honour') }]) }));
  const cPer = (id, icon, treeKey, extraAvail, cost, cooldown, complete, aiMods, extra = {}) => compact.push(K.decision({ id, icon: art(icon), allowed: onlyLer,
    targeted: { root: `zin_leren_tree_${treeKey} = yes`, trigger: 'FROM = { zin_leren_is_compact_target = yes }' },
    available: extraAvail, cost, cooldown, complete, ai: ai(0, aiMods), ...extra }));
  const leanOn = v => `FROM = {\n${call('zin_leren_add_lean', { value: v })}\n}`;
  cPer('zin_leren_send_envoys', 'envoy', 'envoys', 'always = yes', N('cost.envoys'), N('cooldown.envoys'), leanOn(N('lean.envoys')), [{ add: 40, when: 'FROM = { zin_leren_is_north_crown = yes }' }]);
  cPer('zin_leren_trade_charter', 'ledger_coins', 'tariff', 'always = yes', N('cost.charter'), undefined, `${leanOn(N('lean.charter'))}\nadd_timed_idea = { idea = zin_leren_charter_trade days = ${N('cooldown.charter_days')} }`, [{ add: 25, when: 'always = yes' }], { fire_only_once: true });
  cPer('zin_leren_marriage_pact', 'handshake_oath', 'marriages', 'always = yes', N('cost.marriage'), undefined, `${leanOn(N('lean.marriage'))}\nFROM = { add_opinion_modifier = { target = ${LER} modifier = zin_leren_marriage_ties } }`, [{ add: 15, when: 'always = yes' }], { fire_only_once: true });
  cPer('zin_leren_invite_to_compact', 'banner_league', 'open_compact', `FROM = {\n${ge('zin_leren_lean', N('lean.invite_at'))}\nis_in_faction = no\nNOT = { zin_diplo_refusal_binds = yes }\n}`, N('cost.invite'), N('cooldown.invite'),
    'set_temp_variable = { zin_arg_target = FROM }\nzin_leren_invite_to_compact = yes',
    [{ add: 60, when: `FROM = { ${ge('zin_leren_lean', N('lean.invite_ai_at'))} }\n${ge('global.zin_gathering_dark', N('lean.gathering_for_invites'))}\nNOT = { ${AEN} = { has_guaranteed = FROM } }` }]);
  cPer('zin_leren_offer_protection', 'fort_wall', 'one_banner', `OR = {\nzin_leren_tree_one_banner = yes\nhas_country_flag = zin_leren_route_supremacy\n}\n${ge('zin_leren_hegemony', N('hegemony.protection_at'))}\nFROM = {\nNOT = { original_tag = ${AND_} }\nOR = {\n${ge('zin_leren_lean', N('hegemony.protect_lean'))}\nAND = {\n${ge('zin_leren_lean', N('hegemony.protect_lean_supremacy'))}\n${LER} = { ${route('supremacy')} }\n}\nAND = {\n${ge('zin_leren_lean', N('hegemony.protect_lean_seeks'))}\nhas_country_flag = zin_regional_blackton_seeks_protection\n}\n}\nOR = {\nzin_leren_is_north_crown = yes\nAND = {\nzin_leren_is_dark_shore = yes\nzin_leren_tree_dark_protection = yes\n}\n}\n}`,
    N('cost.protection'), N('cooldown.protection'), 'set_temp_variable = { zin_arg_target = FROM }\nzin_leren_offer_protection = yes',
    [{ add: 30, when: `FROM = { ${ge('zin_leren_lean', 80)} }` }, { factor: 0, when: `has_global_flag = zin_leren_withdrawal\n${route('honour')}` }]);
  K.add('common/decisions/zin_leren.txt', `zin_leren_strait = {\n${strait.join('\n')}\n}\nzin_leren_compact = {\n${compact.join('\n')}\n}`);

  // ============================================================================================ events
  const evs = [];
  const EV = spec => evs.push(K.event(spec));
  const nearTo = (n) => n;
  void nearTo;
  EV({ id: 'zin_leren.1', kind: 'hidden', immediate: 'zin_leren_startup = yes' });
  EV({ id: 'zin_leren.10', kind: 'country', pic: 'strait_toll', options: [
    { effect: `set_country_flag = zin_leren_toll_ready
add_political_power = 25`, ai: ai(80) },
    { effect: standing(N('standing.arbitration')), ai: ai(20) }] });
  const redress = `${LER} = {
set_country_flag = zin_leren_toll_redressed
${standing(N('standing.redress'))}
zin_leren_clear_grievances = yes
country_event = { id = zin_leren.12 days = 2 }
}`;
  const mocking = `${LER} = {
set_country_flag = zin_leren_toll_mocked
${standing(-N('standing.mocked_again'))}
add_opinion_modifier = { target = ${AEN} modifier = zin_leren_envoys_mocked }
country_event = { id = zin_leren.12 days = 2 }
}`;
  const histMock = `zin_rules_is_historical = yes\nNOT = { has_global_flag = zin_golden_king_dead }`;
  EV({ id: 'zin_leren.11', kind: 'country', pic: 'leren_envoys', options: [
    { effect: `add_political_power = -${N('cost.redress')}\n${redress}`, ai: ai(20, [{ factor: 0, when: histMock }]) },
    { effect: `${LER} = {\nset_country_flag = zin_leren_toll_arbitrated\n${standing(N('standing.arbitration'))}\ncountry_event = { id = zin_leren.13 days = ${N('cooldown.arbitration_days')} }\ncountry_event = { id = zin_leren.12 days = 2 }\n}`, ai: ai(30, [{ factor: 0, when: histMock }]) },
    { effect: `add_political_power = 25\n${mocking}`, ai: ai(50, [{ factor: 1.5, when: ge('zin_court_corruption', N('route.ai_mock_corruption')) }, { add: 1000, when: histMock }]) }] });
  EV({ id: 'zin_leren.12', kind: 'country', pic: 'strait_toll', descs: [{ key: 'redressed', trigger: 'has_country_flag = zin_leren_toll_redressed' }, { key: 'mocked', trigger: 'has_country_flag = zin_leren_toll_mocked' }], options: [
    { trigger: 'has_country_flag = zin_leren_toll_redressed', effect: 'clr_country_flag = zin_leren_toll_redressed', ai: ai(100) },
    { trigger: `has_country_flag = zin_leren_toll_mocked\nNOT = { has_country_flag = zin_leren_toll_redressed }`, effect: `if = { limit = { has_idea = zin_leren_grievance_1716 } swap_ideas = { remove_idea = zin_leren_grievance_1716 add_idea = zin_leren_grievance_unanswered } }`, ai: ai(100) },
    { trigger: `has_country_flag = zin_leren_toll_arbitrated\nNOT = { has_country_flag = zin_leren_toll_mocked }\nNOT = { has_country_flag = zin_leren_toll_redressed }`, ai: ai(100) }] });
  EV({ id: 'zin_leren.13', kind: 'country', pic: 'generic_court', descs: [{ key: 'won', trigger: 'has_country_flag = zin_leren_ruled_for_ler' }],
    immediate: `set_temp_variable = { zin_leren_t_chance = 50 }
if = {
limit = { ${exists(EEK)} }
${EEK} = { set_temp_variable = { zin_leren_t_eek = zin_leren_lean } }
divide_temp_variable = { zin_leren_t_eek = 4 }
add_to_temp_variable = { zin_leren_t_chance = zin_leren_t_eek }
}
clamp_temp_variable = { var = zin_leren_t_chance min = 10 max = 90 }
set_temp_variable_to_random = { var = zin_leren_t_roll min = 0 max = 100 }
if = {
limit = { check_variable = { var = zin_leren_t_roll value = zin_leren_t_chance compare = less_than } }
set_country_flag = zin_leren_ruled_for_ler
}
else = {
clr_country_flag = zin_leren_ruled_for_ler
}`,
    options: [
      { trigger: 'has_country_flag = zin_leren_ruled_for_ler', effect: `${standing(N('standing.arbitration_won'))}\nzin_leren_clear_grievances = yes`, ai: ai(100) },
      { trigger: 'NOT = { has_country_flag = zin_leren_ruled_for_ler }', effect: standing(N('standing.arbitration_lost')), ai: ai(100) }] });
  EV({ id: 'zin_leren.15', kind: 'country', pic: 'strait_toll',
    trigger: `${onlyLer}\nzin_leren_treaty_in_force = yes\n${ge('zin_leren_toll_level', 2)}`, mtth: `days = ${N('cooldown.mtth_incident')}`, options: [
      { effect: `add_political_power = ${N('cost.seize')}\n${standing(N('standing.incident_seize'))}`, ai: ai(40, [{ factor: 2, when: route('supremacy') }]) },
      { effect: standing(N('standing.incident_waive')), ai: ai(40, [{ factor: 2, when: route('honour') }]) },
      { effect: `add_political_power = -${N('cost.refer')}\n${standing(2)}\n${AEN} = { add_opinion_modifier = { target = ${LER} modifier = zin_leren_appeal_heard } }`, ai: ai(20) }] });
  const askTime = `set_country_flag = { flag = zin_leren_asked_for_time days = ${N('cooldown.ask_time_days')} }\ncountry_event = { id = zin_leren.20 days = ${N('cooldown.ask_time_days')} }`;
  const honourWar = (extra) => `${extra ?? ''}`;
  void honourWar;
  EV({ id: 'zin_leren.20', kind: 'country', pic: 'generic_war', options: [
    { effect: `${standing(N('standing.call_time'))}\nif = {\nlimit = { NOT = { has_country_flag = zin_leren_asked_once } }\nset_country_flag = zin_leren_asked_once\n${askTime}\n}\n${AEN} = { country_event = { id = zin_leren.21 } }`, ai: ai(0, [{ add: 40, when: `NOT = { ${route('honour')} }\nNOT = { ${route('break')} }\nNOT = { ${route('supremacy')} }` }, { add: 10, when: route('honour') }]) },
    { effect: `${standing(N('standing.call_refuse'))}\nif = {\nlimit = { ${le(SD, N('standing.withdraw_at'))} }\nzin_leren_withdraw = yes\n}\n${AEN} = { country_event = { id = zin_leren.21 } }`, ai: ai(0, [{ add: 100, when: `OR = {\n${route('break')}\n${route('supremacy')}\nzin_rules_ai_branch_leren_historical = yes\n}` }, { add: 20, when: `NOT = { ${route('honour')} }\nNOT = { ${route('break')} }\nNOT = { ${route('supremacy')} }` }]) },
    { effect: `zin_leren_join_aenor_defence = yes\n${standing(N('standing.call_honour'))}\n${AEN} = { country_event = { id = zin_leren.21 } }`, ai: ai(0, [{ add: 90, when: `OR = {\n${route('honour')}\nzin_rules_ai_branch_leren_honour = yes\n}` }, { add: 40, when: `NOT = { ${route('honour')} }\nNOT = { ${route('break')} }\nNOT = { ${route('supremacy')} }` }]) }] });
  EV({ id: 'zin_leren.21', kind: 'country', pic: 'generic_court', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_leren.50', kind: 'country', pic: 'black_ships_tale',
    trigger: `${onlyLer}\nzin_leren_date_tales = yes\nhas_country_flag = zin_leren_heard_fishermen`, mtth: `days = ${N('cooldown.mtth_tales')}`, options: [{ effect: `navy_experience = ${N('cost.tales_navy')}`, ai: ai(100) }] });
  EV({ id: 'zin_leren.55', kind: 'news', pic: 'strait_toll', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_leren.60', kind: 'news', pic: 'strait_toll', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_leren.70', kind: 'country', pic: 'generic_court', options: [
    { effect: `${LER} = { add_to_faction = PREV }
add_opinion_modifier = { target = ${LER} modifier = zin_leren_compact_kin }
reverse_add_opinion_modifier = { target = ${LER} modifier = zin_leren_compact_kin }
${LER} = { country_event = { id = zin_leren.72 } }`,
      ai: ai(0, [{ add: 40, when: 'always = yes' }, { factor: 0, when: 'zin_diplo_refusal_binds = yes' }]) },
    { effect: `${call('zin_leren_add_lean', { value: N('lean.decline') })}\n${LER} = { country_event = { id = zin_leren.72 } }`, ai: ai(60) }] });
  EV({ id: 'zin_leren.71', kind: 'country', pic: 'generic_court', options: [
    { effect: `${LER} = { puppet = PREV }\n${LER} = { country_event = { id = zin_leren.72 } }`, ai: ai(0, [{ add: 40, when: 'always = yes' }, { add: 40, when: `has_war_with = ${ZOL}` }, { factor: 0, when: 'zin_diplo_refusal_binds = yes' }]) },
    { effect: `${call('zin_leren_add_lean', { value: N('lean.refuse_protection') })}\n${LER} = { country_event = { id = zin_leren.72 } }`, ai: ai(60) }] });
  EV({ id: 'zin_leren.72', kind: 'country', pic: 'leren_envoys', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_leren.80', kind: 'country', pic: 'generic_court', trigger: `${onlyLer}\n${le('zin_leren_union_cohesion', N('cohesion.question_at'))}`, mtth: `days = ${N('cooldown.mtth_estates')}`, options: [
    { effect: `add_political_power = -${N('cost.estates')}\n${call('zin_leren_add_union_cohesion', { value: N('cohesion.grant') })}`, ai: ai(60) },
    { effect: `${call('zin_leren_add_union_cohesion', { value: N('cohesion.hold') })}\nadd_stability = -0.05\nadd_war_support = 0.03`, ai: ai(40) }] });
  EV({ id: 'zin_leren.81', kind: 'country', pic: 'generic_peace', options: [{ effect: 'add_stability = 0.03', ai: ai(100) }] });
  EV({ id: 'zin_leren.90', kind: 'country', pic: 'generic_sea', options: [{ ai: ai(100) }] });
  K.add('events/zin_leren.txt', `add_namespace = zin_leren\n\n${evs.join('\n\n')}`);

  // ============================================================================================ game rule
  const rule = T.rule;
  K.def('rule', 'zin_rule_leren_route');
  K.loc.set('ZIN_RULE_LEREN_ROUTE', rule.name); K.loc.set('ZIN_RULE_LEREN_ROUTE_DESC', rule.desc);
  const opts = [['DEFAULT', true], ['historical'], ['honour'], ['supremacy'], ['free']];
  K.add('common/game_rules/zin_leren.txt', `zin_rule_leren_route = {\n\tname = ZIN_RULE_LEREN_ROUTE\n\tgroup = RULE_GROUP_ZIN\n${opts.map(([o, d]) => { const key = `ZIN_RULE_LEREN_ROUTE_${o.toUpperCase()}`; K.loc.set(key, rule.options[o].n); K.loc.set(`${key}_DESC`, rule.options[o].d); return `\t${d ? 'default' : 'option'} = {\n\t\tname = ${o}\n\t\ttext = ${key}\n\t\tdesc = ${key}_DESC\n\t}`; }).join('\n')}\n}`);

  // ============================================================================================ on_actions and AI strategy
  K.add('common/on_actions/zin_leren.txt', `on_actions = {
	on_startup = {
		effect = {
			${LER} = { country_event = { id = zin_leren.1 days = 1 } }
		}
	}
	on_monthly_${LER} = {
		effect = {
			zin_leren_monthly = yes
		}
	}
}`);
  const befriend = R.befriend.map(n => tag(n));
  K.add('common/ai_strategy/zin_leren.txt', [
    `zin_leren_befriend_north = {\n\tallowed = { original_tag = ${LER} }\n\tenable = { always = yes }\n\tabort_when_not_enabled = yes\n${befriend.map(t => `\tai_strategy = { type = befriend id = "${t}" value = ${N('ai.befriend')} }`).join('\n')}\n}`,
    `zin_leren_face_the_dead = {\n\tallowed = { original_tag = ${LER} }\n\tenable = { has_global_flag = zin_zol_rising }\n\tabort_when_not_enabled = yes\n\tai_strategy = { type = prepare_for_war id = "${ZOL}" value = ${N('ai.prepare_zol')} }\n\tai_strategy = {\n\t\ttype = garrison\n\t\tvalue = ${N('ai.garrison')}\n\t\tstate_trigger = { zin_is_site_strait_north = yes }\n\t}\n}`,
  ].join('\n\n'));

  K.stage(staged);
  staged.add('localisation/english/zin_leren_l_english.yml', K.loc.bytes());
  staged.text('interface/zz_zin_leren.gfx', K.spriteText('Decision and category pictures of the Lerendor mechanic: each shows a picture of the icon catalog until the art pass draws its own. Loaded after the vanilla files (zz_).'));
  const kinds = k => K.defs.get(k)?.size ?? 0;
  return { kit: K, counts: { effects: kinds('effect'), triggers: kinds('trigger'), decisions: kinds('decision'), categories: kinds('category'), ideas: kinds('idea'), events: kinds('event'), dynamic: kinds('dynamic'), opinions: kinds('opinion'), leans: leanRows.length, locKeys: K.loc.size }, tags: { LER, AEN, EEK, REN, AND: AND_, GOLD, DON, BLACK, ZOL }, north: north.map(c => c.tag), dark: dark.map(c => c.tag) };
}
