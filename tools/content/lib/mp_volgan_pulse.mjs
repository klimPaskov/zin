// The start, the monthly pulses, the on_actions and the AI strategies of the Volgan and Mirolon mechanic
// (docs/specs/04_mechanics/volgan_southern_dominion.md, sections 1 to 13 and "AI").
import { ge, gt, le, lt, eq, bump, call } from './mp_kit.mjs';

export function writePulse(V) {
  const { K, N, VOL, MIR, HEREZ, ZOL, AEN, members, dark, exists, gd, inVol, inMir, ST, VL, NP, PF, PS } = V;
  const eff = [];
  const E_ = (name, body, note) => eff.push(K.effect(name, body, note));
  const oaths = V.D.oaths;
  const memberNames = V.D.realms.members;

  // ---- the start
  const volganLeader = V.defineVolgan ? `if = {
limit = { NOT = { has_character = zin_volgan } }
recruit_character = zin_volgan
}
add_country_leader_role = {
character = zin_volgan
promote_leader = yes
country_leader = { ideology = zin_shadow_dread expire = "1965.1.1.1" traits = { zin_trait_dread_lord } }
}` : '';
  E_('zin_dominion_startup', `${inVol(`set_variable = { ${ST} = ${N('strength.start')} }
set_variable = { ${VL} = ${N('veil.start')} }
set_variable = { ${NP} = ${N('nether.start')} }
set_variable = { zin_volgan_musters = 0 }
set_variable = { zin_volgan_free_gates = 0 }
set_variable = { zin_dominion_gate_cost = ${N('nether.gate_cost')} }
set_variable = { zin_volgan_envoy_cost = ${N('dark.envoy_cost')} }
set_variable = { zin_volgan_muster_schedule = ${N('pace.schedule_start')} }
add_dynamic_modifier = { modifier = zin_dominion_hosts }
zin_volgan_refresh_strength = yes
add_ideas = zin_volgan_long_recovery
add_ideas = zin_volgan_storm_girt_realm
${volganLeader}
zin_dominion_ui_refresh_volgan = yes`)}
set_variable = { global.zin_volgan_veil_band = 0 }
${members.map((m, i) => `if = {\nlimit = { ${exists(m)} }\n${m} = { set_variable = { zin_dominion_oath = ${oaths[memberNames[i]]} } }\n}`).join('\n')}
every_country = {
limit = { zin_dominion_is_dark_lands_country = yes }
set_variable = { zin_volgan_pact = 0 }
}
${inMir(`set_variable = { ${PF} = ${N('mirolon.proof_start')} }
set_variable = { ${PS} = ${N('mirolon.passes_start')} }
set_variable = { zin_mirolon_fort_level = 0 }
set_variable = { zin_mirolon_war_days = 0 }
add_ideas = zin_mirolon_long_watch
add_ideas = zin_mirolon_unheeded_warnings
recruit_character = zin_mirolon_maeric
add_country_leader_role = {
character = zin_mirolon_maeric
promote_leader = yes
country_leader = { ideology = zin_light_wardens expire = "1965.1.1.1" traits = { zin_trait_elected_speaker } }
}
zin_mirolon_raise_pass_forts = yes
zin_dominion_ui_refresh_mirolon = yes`)}`, 'Run by the hidden event zin_dominion.1 the day after the start: start values, the dynamic modifier, the start spirits of both trees, Mirolon\'s forts at level 2 and High Warden Maeric (section "Files").');

  // ---- the panels' gauge positions (the windows only read these)
  const slider = (x, v) => `set_variable = { ${x} = ${v} }
multiply_variable = { ${x} = 5.2 }
add_to_variable = { ${x} = 27 }`;
  E_('zin_dominion_ui_refresh_volgan', `${slider('zin_ui_hosts_x', ST)}
${slider('zin_ui_veil_x', VL)}
${slider('zin_ui_nether_x', NP)}
set_variable = { zin_ui_dark_1 = 0 }
set_variable = { zin_ui_dark_2 = 0 }
set_variable = { zin_ui_dark_3 = 0 }
every_country = {
limit = { zin_dominion_is_dark_lands_country = yes ${eq('zin_volgan_pact', 1)} }
${VOL} = { add_to_variable = { zin_ui_dark_1 = 1 } }
}
every_country = {
limit = { zin_dominion_is_dark_lands_country = yes ${eq('zin_volgan_pact', 2)} }
${VOL} = { add_to_variable = { zin_ui_dark_2 = 1 } }
}
every_country = {
limit = { zin_dominion_is_dark_lands_country = yes ${eq('zin_volgan_pact', 3)} }
${VOL} = { add_to_variable = { zin_ui_dark_3 = 1 } }
}
add_to_variable = { global.zin_ui_tick = 1 }`, 'Scope: Volgan. Positions of the gauge markers of the Southern Dominion panel.');
  E_('zin_dominion_ui_refresh_mirolon', `${slider('zin_ui_proof_x', PF)}
${slider('zin_ui_passes_x', PS)}
add_to_variable = { global.zin_ui_tick = 1 }`, 'Scope: Mirolon. Positions of the gauge markers of the Watch panel.');

  // ---- Volgan's pulse
  const membersAtOath = members.map(m => `if = {\nlimit = {\n${exists(m)}\n${m} = { ${ge('zin_dominion_oath', N('strength.member_oath'))} }\n}\nadd_to_temp_variable = { zin_volgan_t_members = ${N('strength.per_member')} }\n}`).join('\n');
  const faltering = members.map(m => `if = {
limit = {
${exists(m)}
${m} = {
${lt('zin_dominion_oath', N('court.falter_below'))}
NOT = { has_country_flag = zin_dominion_oath_warned }
}
}
${m} = {
set_country_flag = { flag = zin_dominion_oath_warned days = 365 }
country_event = { id = zin_dominion.22 }
}
}`).join('\n');
  E_('zin_dominion_monthly_volgan', `# strength: recovery, then the toll of war
if = {
limit = { NOT = { has_global_flag = zin_volgan_body_destroyed } }
set_temp_variable = { zin_volgan_t_gain = ${N('strength.monthly')} }
set_temp_variable = { zin_volgan_t_members = 0 }
${membersAtOath}
clamp_temp_variable = { var = zin_volgan_t_members max = ${N('strength.member_max')} }
add_to_temp_variable = { zin_volgan_t_gain = zin_volgan_t_members }
if = { limit = { has_idea = zin_volgan_dominion_tribute } add_to_temp_variable = { zin_volgan_t_gain = ${N('strength.tribute')} } }
if = { limit = { ${ge(NP, N('strength.nether_at'))} } add_to_temp_variable = { zin_volgan_t_gain = ${N('strength.nether')} } }
set_temp_variable = { zin_volgan_t_dark = 0 }
every_country = {
limit = {
zin_dominion_is_dark_lands_country = yes
${ge('zin_volgan_pact', N('strength.dark_pact'))}
}
add_to_temp_variable = { zin_volgan_t_dark = ${N('strength.dark')} }
}
clamp_temp_variable = { var = zin_volgan_t_dark max = ${N('strength.dark_max')} }
add_to_temp_variable = { zin_volgan_t_gain = zin_volgan_t_dark }
set_temp_variable = { zin_arg_value = zin_volgan_t_gain }
zin_volgan_add_dominion_strength = yes
}
if = {
limit = { has_war = yes }
${call('zin_volgan_add_dominion_strength', { value: N('strength.war') })}
if = {
limit = { surrender_progress > ${N('strength.surrender_at')} }
${call('zin_volgan_add_dominion_strength', { value: N('strength.surrender') })}
}
}
# the veil mends while no muster is held and no war is fought
if = {
limit = {
NOT = { has_war = yes }
${lt(VL, N('veil.monthly_cap'))}
NOT = { has_country_flag = zin_volgan_mustered }
}
set_temp_variable = { zin_volgan_t_veil = ${N('veil.monthly')} }
if = { limit = { has_idea = zin_volgan_storm_rites } add_to_temp_variable = { zin_volgan_t_veil = ${N('veil.storm_rites')} } }
set_temp_variable = { zin_arg_value = zin_volgan_t_veil }
zin_volgan_add_veil = yes
if = { limit = { ${gt(VL, N('veil.monthly_cap'))} } set_variable = { ${VL} = ${N('veil.monthly_cap')} } }
}
# the oaths drift unless the Dominion was summoned in the last 180 days
if = {
limit = { NOT = { has_country_flag = zin_dominion_summoned } }
${call('zin_volgan_add_oath', { target: -1, value: N('court.drift') })}
}
${faltering}
# the cost of the envoys, the Nether Gate and the muster schedule follow the trees' flags and the calendar
set_variable = { zin_volgan_envoy_cost = ${N('dark.envoy_cost')} }
if = { limit = { has_country_flag = zin_volgan_envoys_cheap } set_variable = { zin_volgan_envoy_cost = ${N('dark.envoy_cheap')} } }
if = {
limit = {
has_country_flag = zin_volgan_free_gates
NOT = { has_country_flag = zin_dominion_gates_granted }
}
set_country_flag = zin_dominion_gates_granted
set_variable = { zin_volgan_free_gates = ${N('nether.free_gates')} }
}
set_variable = { zin_dominion_gate_cost = ${N('nether.gate_cost')} }
if = { limit = { ${gt('zin_volgan_free_gates', 0)} } set_variable = { zin_dominion_gate_cost = 0 } }
set_temp_variable = { zin_volgan_t_years = global.year }
add_to_temp_variable = { zin_volgan_t_years = -1748 }
if = { limit = { ${gt('global.zin_story_pace', 0)} } divide_temp_variable = { zin_volgan_t_years = global.zin_story_pace } }
multiply_temp_variable = { zin_volgan_t_years = ${N('pace.schedule_year')} }
add_to_temp_variable = { zin_volgan_t_years = ${N('pace.schedule_start')} }
set_variable = { zin_volgan_muster_schedule = zin_volgan_t_years }
if = {
limit = {
has_game_rule = { rule = zin_rule_dark_powers option = AGGRESSIVE }
}
add_to_variable = { zin_volgan_muster_schedule = 5 }
}
# the Abyss Host follows the march
if = {
limit = {
has_global_flag = zin_volgan_marches
has_country_flag = zin_volgan_abyss_march
NOT = { has_country_flag = zin_volgan_abyss_host_spawned }
}
zin_volgan_spawn_abyss_host = yes
}
# Mirolon falls when it yields, or when its capital and its passes are in Volgan's hands
if = {
limit = {
${exists(MIR)}
has_war_with = ${MIR}
NOT = { has_global_flag = zin_mirolon_fallen }
zin_volgan_mirolon_taken = yes
}
zin_dominion_mirolon_falls = yes
}
# the march catch-up (SL-34): under the historical branch an AI Volgan that has not taken its focus marches 30 days after Mirolon's fall
if = {
limit = {
is_ai = yes
zin_rules_is_historical = yes
has_game_rule = { rule = zin_rule_dark_powers option = HISTORICAL }
has_global_flag = { flag = zin_mirolon_fallen days > ${N('war.march_catchup_days') - 1} }
NOT = { has_global_flag = zin_volgan_marches }
NOT = { has_global_flag = zin_volgan_body_destroyed }
}
zin_volgan_begin_march = yes
}
# the dead against the dead
if = {
limit = {
has_war_with = ${ZOL}
NOT = { has_global_flag = zin_volgan_zol_clash }
}
set_global_flag = zin_volgan_zol_clash
}
if = {
limit = {
zin_dominion_clash_ready = yes
NOT = { has_country_flag = zin_dominion_clash_asked }
}
set_country_flag = { flag = zin_dominion_clash_asked days = 90 }
if = {
limit = { is_ai = yes }
if = {
limit = { zin_rules_is_historical = yes }
zin_volgan_strike_zol = yes
}
else = {
random_list = {
80 = { zin_volgan_strike_zol = yes }
20 = { }
}
}
}
else = {
country_event = { id = zin_dominion.13 }
}
}
if = {
limit = {
zin_dominion_compact_active = yes
has_global_flag = zin_zol_withdrawn
}
zin_dominion_end_compact = yes
}
# a sandbox rule: the throne may stir, once a year, from 1 Thaw 4A 1765
if = {
limit = {
has_game_rule = { rule = zin_rule_volgan_spirit option = STIRRING }
has_global_flag = zin_volgan_body_destroyed
NOT = { has_global_flag = zin_dominion_stirred }
zin_dominion_after_1765_03 = yes
NOT = { has_country_flag = zin_dominion_stir_rolled }
}
set_country_flag = { flag = zin_dominion_stir_rolled days = 365 }
random = {
chance = ${N('stirring.chance')}
country_event = { id = zin_dominion.25 }
}
}
# the Middle Lands states Volgan holds (Wake the Old Battlefields)
set_temp_variable = { zin_volgan_t_mid = 0 }
every_controlled_state = {
limit = { zin_dominion_is_middle_lands_state = yes }
add_to_temp_variable = { zin_volgan_t_mid = 1 }
}
set_variable = { zin_dominion_middle_held = zin_volgan_t_mid }
zin_dominion_ui_refresh_volgan = yes
# last, the trees refresh their layouts (decision E4)
mark_focus_tree_layout_dirty = yes
${[MIR, ...members].map(t => `if = {\nlimit = { ${exists(t)} }\n${t} = { mark_focus_tree_layout_dirty = yes }\n}`).join('\n')}`, 'Scope: Volgan. The Dominion pulse (sections 1 to 13): strength, the veil, the oaths, costs, the Abyss Host, Mirolon\'s fall, the clash and the compact, the sandbox rule, the layouts.');

  // ---- Mirolon's pulse
  E_('zin_dominion_monthly_mirolon', `# days at war without losing a pass
if = {
limit = {
${exists(VOL)}
has_war_with = ${VOL}
NOT = {
any_state = {
zin_is_site_mirolon_passes = yes
controller = { original_tag = ${VOL} }
}
}
}
add_to_variable = { zin_mirolon_war_days = 30 }
}
else = {
set_variable = { zin_mirolon_war_days = 0 }
}
if = {
limit = {
${ge('zin_mirolon_war_days', N('mirolon.hold_days'))}
NOT = { has_country_flag = zin_mirolon_holds }
}
set_country_flag = zin_mirolon_holds
${inVol(`${call('zin_volgan_add_dominion_strength', { value: N('strength.mirolon_holds') })}\nadd_timed_idea = { idea = zin_dominion_march_stalls days = 365 }\ncountry_event = { id = zin_dominion.20 }`)}
country_event = { id = zin_dominion.20 }
}
# Hold the Passes: forts ready, proof earned, and no pass state lost
if = {
limit = {
${exists(VOL)}
has_war_with = ${VOL}
${ge(PS, N('mirolon.hold_passes'))}
${ge(PF, N('mirolon.hold_proof'))}
zin_mirolon_passes_held = yes
}
if = { limit = { NOT = { has_idea = zin_dominion_hold_the_passes } } add_ideas = zin_dominion_hold_the_passes }
}
else_if = {
limit = { has_idea = zin_dominion_hold_the_passes }
remove_ideas = zin_dominion_hold_the_passes
}
zin_dominion_ui_refresh_mirolon = yes
mark_focus_tree_layout_dirty = yes`, 'Scope: Mirolon. The Watch pulse (section 8): the days the passes have held, Hold the Passes, the layout.');
  K.add('common/scripted_effects/zin_dominion_pulse.txt', eff.join('\n\n'));

  // ---- on_actions
  K.add('common/on_actions/zin_dominion.txt', `on_actions = {
	on_startup = {
		effect = {
			${VOL} = { country_event = { id = zin_dominion.1 days = 1 } }
		}
	}
	on_monthly_${VOL} = {
		effect = {
			zin_dominion_monthly_volgan = yes
		}
	}
	on_monthly_${MIR} = {
		effect = {
			zin_dominion_monthly_mirolon = yes
		}
	}
	on_declare_war = {
		effect = {
			if = {
				limit = {
					zin_is_volgan = yes
					FROM = { zin_is_mirolon = yes }
				}
				zin_dominion_war_started = yes
			}
		}
	}
	on_capitulation_immediate = {
		effect = {
			if = {
				limit = { zin_is_mirolon = yes }
				zin_dominion_mirolon_capitulated = yes
			}
		}
	}
	# ROOT is the new controller, FROM the old one, FROM.FROM the state (the hook runs in the state's scope)
	on_state_control_changed = {
		effect = {
			FROM.FROM = {
				if = {
					limit = {
						OR = {
							zin_is_site_mirolon_passes = yes
							zin_is_site_nafeher = yes
						}
					}
					zin_dominion_state_changed = yes
				}
			}
		}
	}
	# ROOT annexed FROM: Volgan's realm conquered with his body unbroken (B34.D2)
	on_annex = {
		effect = {
			if = {
				limit = {
					FROM = { tag = ${VOL} }
					NOT = { has_global_flag = zin_volgan_body_destroyed }
				}
				zin_volgan_withdraws_south = yes
			}
		}
	}
}`);
  // The state-control hook: a pass state or Nafeher changing hands (strength -20 when Volgan loses Nafeher, once).
  const hook = K.effect('zin_dominion_state_changed', `if = {
limit = {
zin_is_site_nafeher = yes
NOT = { controller = { original_tag = ${VOL} } }
NOT = { has_global_flag = zin_dominion_nafeher_lost }
}
set_global_flag = zin_dominion_nafeher_lost
${call('zin_volgan_add_dominion_strength', { value: N('strength.loses_nafeher') })}
}
if = {
limit = { zin_is_site_mirolon_passes = yes }
${inMir('if = {\nlimit = { has_idea = zin_dominion_hold_the_passes }\nremove_ideas = zin_dominion_hold_the_passes\n}')}
}`, 'Scope: a state. A pass state or Nafeher changed hands (sections 1 and 8).');
  K.add('common/scripted_effects/zin_dominion_pulse.txt', hook);

  // ---- AI strategies
  K.add('common/ai_strategy/zin_dominion.txt', [
    `zin_dominion_war_on_mirolon = {\n\tallowed = { original_tag = ${VOL} }\n\tenable = {\n\t\tzin_dominion_after_1753_03 = yes\n\t\tNOT = { has_global_flag = zin_volgan_body_destroyed }\n\t}\n\tabort_when_not_enabled = yes\n\tai_strategy = { type = prepare_for_war id = "${MIR}" value = ${N('ai.prepare')} }\n\tai_strategy = { type = antagonize id = "${MIR}" value = ${N('ai.antagonize')} }\n}`,
    `zin_dominion_conquer_the_march = {\n\tallowed = { original_tag = ${VOL} }\n\tenable = {\n\t\thas_global_flag = zin_volgan_marches\n\t\tNOT = { has_global_flag = zin_volgan_body_destroyed }\n\t}\n\tabort_when_not_enabled = yes\n\tai_strategy = { type = conquer id = "${AEN}" value = ${N('ai.conquer')} }\n\tai_strategy = { type = conquer id = "${HEREZ}" value = ${N('ai.conquer')} }\n\tai_strategy = { type = front_unit_request id = "${AEN}" value = ${N('ai.front')} }\n\tai_strategy = { type = front_unit_request id = "${HEREZ}" value = ${N('ai.front')} }\n}`,
    `zin_dominion_mirolon_watches = {\n\tallowed = { original_tag = ${MIR} }\n\tenable = { always = yes }\n\tabort_when_not_enabled = yes\n\tai_strategy = { type = antagonize id = "${VOL}" value = ${N('ai.antagonize')} }\n}`,
    `zin_dominion_mirolon_fronts = {\n\tallowed = { original_tag = ${MIR} }\n\tenable = { ${ge('global.zin_volgan_veil_band', 1)} }\n\tabort_when_not_enabled = yes\n\tai_strategy = { type = front_unit_request id = "${VOL}" value = ${N('ai.front')} }\n}`,
  ].join('\n\n'));
  return eff;
}
