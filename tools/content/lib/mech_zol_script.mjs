// Scripted triggers and effects of Zol's Mistake (docs/specs/04_mechanics/zols_mistake.md).
// zolScripts(D, T) returns { triggers, effects } as { name: body } objects. Nothing here names a servant, a keeper of Furviatlon
// or what feeding is; the effects speak only of power, bonds, hosts and the Convergence.
import { dedent, list, num, call, takeArgs, dateTrigger } from './mech_court_lib.mjs';

const rule = (r, o) => `has_game_rule = { rule = ${r} option = ${o} }`;
const ge = (v, n) => `check_variable = { var = ${v} value = ${n} compare = greater_than_or_equals }`;

export function zolScripts(D, T) {
  const ZOL = T.zol, S = D.start;
  const triggers = {}, effects = {};
  const orders = ['great', 'lesser', 'divine'];

  // ---------------------------------------------------------------------------------------------- triggers
  triggers.zin_is_zol = `tag = ${ZOL}`;
  triggers.zin_zol_is_manifest = list('has_global_flag = zin_zol_manifested', 'NOT = { has_global_flag = zin_zol_withdrawn }');
  triggers.zin_zol_can_rise = dedent(`
    NOT = { has_global_flag = zin_zol_rising }
    NOT = { has_country_flag = zin_zol_presence_lapsed }
    OR = {
    	AND = {
    		${ge('zin_mistake_power', D.risingPower)}
    		${ge('zin_zol_islands_stirring', 'zin_zol_islands_needed')}
    		OR = {
    			AND = {
    				has_country_flag = zin_zol_route_appointed
    				zin_zol_after_appointed_hour = yes
    			}
    			AND = {
    				has_country_flag = zin_zol_route_hastened
    				zin_zol_after_hastened_hour = yes
    			}
    			AND = {
    				has_country_flag = zin_zol_route_patience
    				has_country_flag = zin_zol_greater_hour
    				zin_zol_after_greater_hour = yes
    			}
    		}
    	}
    	# someone attacked him first: power, island and date limits are ignored, and so is the Unending Patience
    	AND = {
    		has_war = yes
    		any_enemy_country = { always = yes }
    	}
    }`);
  triggers.zin_zol_can_manifest = dedent(`
    has_global_flag = zin_zol_rising
    NOT = { has_global_flag = zin_zol_manifested }
    has_war = yes
    ${ge('zin_zol_convergence', D.manifestConvergence)}
    ${ge('zin_mistake_power', D.manifestPower)}`);
  triggers.zin_zol_ai_route_appointed = dedent(`
    ${rule('zin_rule_dark_powers', 'HISTORICAL')}
    NOT = { zin_rules_is_free = yes }`);
  triggers.zin_zol_ai_route_hastened = rule('zin_rule_dark_powers', 'AGGRESSIVE');
  triggers.zin_zol_ai_route_patience = rule('zin_rule_dark_powers', 'RESTRAINED');
  // The catch-up the AI keeps under the historical rule (and the aggressive rule).
  triggers.zin_zol_ai_keeps_history = dedent(`
    is_ai = yes
    OR = {
    	AND = {
    		${rule('zin_rule_dark_powers', 'HISTORICAL')}
    		zin_rules_is_historical = yes
    	}
    	${rule('zin_rule_dark_powers', 'AGGRESSIVE')}
    }`);
  triggers.__dates = Object.entries(D.dates).map(([k, d]) => dateTrigger(`zin_zol_after_${k}`, d, `zin_zol_after_${k}: ${d} at the standard pace, shifted by zin_story_pace`)).join('\n');

  // ---------------------------------------------------------------------------------------------- variables
  const adder = (name, variable, lo, hi) => dedent(`
    ${takeArgs('value')}
    ${ZOL} = {
    	add_to_variable = { ${variable} = zin_value }
    	clamp_variable = { var = ${variable} min = ${lo} max = ${hi} }
    	zin_zol_refresh_presence = yes
    }`);
  effects.zin_zol_add_mistake_power = adder('power', 'zin_mistake_power', 0, 100);
  orders.forEach(o => { effects[`zin_zol_add_bond_${o}`] = adder(o, `zin_zol_bond_${o}`, 0, 5); });
  effects.zin_zol_add_growth_bonus = adder('growth', 'zin_zol_growth_bonus', 0, 0.5);
  effects.zin_zol_add_fading_pressure = adder('pressure', 'zin_zol_fading_pressure', D.growth.pressureFloor, 0.3);
  effects.zin_zol_add_return_rate = adder('return', 'zin_zol_return_rate', D.returnRate.base, D.returnRate.cap);
  effects.zin_zol_add_host_cap = adder('hostcap', 'zin_zol_host_cap_bonus', 0, 20);
  effects.zin_zol_add_convergence = adder('conv', 'zin_zol_convergence', 0, 100);
  effects.zin_zol_add_convergence_rate = adder('convrate', 'zin_zol_convergence_rate', 0, 3);
  effects.zin_zol_set_manifest_cost = dedent(`
    ${takeArgs('value')}
    ${ZOL} = {
    	set_variable = { zin_zol_manifest_cost = zin_value }
    	clamp_variable = { var = zin_zol_manifest_cost min = 2 max = 3 }
    }`);
  effects.zin_zol_shorten_wound = dedent(`
    ${takeArgs('days')}
    ${ZOL} = {
    	if = {
    		limit = { has_idea = zin_zol_wounded }
    		set_temp_variable = { zin_neg = zin_days }
    		multiply_temp_variable = { zin_neg = -1 }
    		modify_timed_idea = {
    			idea = zin_zol_wounded
    			days = zin_neg
    		}
    	}
    }`);

  effects.zin_zol_refresh_presence = dedent(`
    # The dynamic modifier "The Presence": political power from the Presence, weekly manpower after the rising. Scope: Zol.
    set_variable = { zin_zol_presence_pp = zin_mistake_power }
    multiply_variable = { zin_zol_presence_pp = 0.005 }
    set_variable = { zin_zol_presence_manpower = 0 }
    if = {
    	limit = { has_global_flag = zin_zol_rising }
    	set_variable = { zin_zol_presence_manpower = zin_mistake_power }
    	multiply_variable = { zin_zol_presence_manpower = 0.5 }
    }
    force_update_dynamic_modifier = yes
    zin_zol_ui_refresh = yes`);

  // ---------------------------------------------------------------------------------------------- the black islands
  const R = D.rumour;
  effects.zin_zol_rumour_roll = dedent(`
    # A rumour roll after an island wakes (section 4): one random coastal country hears "Tales of Black Ships". Scope: Zol.
    set_temp_variable = { zin_rc = ${R.base} }
    if = {
    	limit = { has_country_flag = zin_zol_isles_loud }
    	set_temp_variable = { zin_rc = ${R.loud} }
    }
    if = {
    	limit = { has_country_flag = zin_zol_isles_dark }
    	set_temp_variable = { zin_rc = ${R.dark} }
    }
    if = {
    	limit = { has_country_flag = zin_zol_veiled }
    	multiply_temp_variable = { zin_rc = 0.5 }
    }
    if = {
    	limit = { has_idea = zin_zol_open_service }
    	multiply_temp_variable = { zin_rc = 2 }
    	clamp_temp_variable = { var = zin_rc max = ${R.open} }
    }
    if = {
    	limit = { has_country_flag = zin_zol_unwatched }
    	set_temp_variable = { zin_rc = 0 }
    }
    round_temp_variable = zin_rc
    meta_effect = {
    	text = {
    		random = {
    			chance = [C]
    			random_country = {
    				limit = {
    					zin_is_zol_coast_country = yes
    					NOT = { tag = ${ZOL} }
    				}
    				country_event = { id = zin_mistake.2 }
    			}
    			if = {
    				limit = { check_variable = { global.zin_zol_tales < ${R.gatheringDarkCap / R.gatheringDarkPerTale} } }
    				add_to_variable = { global.zin_zol_tales = 1 }
    				set_temp_variable = { zin_arg_value = ${R.gatheringDarkPerTale} }
    				zin_world_add_gathering_dark = yes
    			}
    		}
    	}
    	C = "[?zin_rc|0]"
    }`);
  // An island stirs. Scope: the island state.
  effects.zin_zol_wake_island_here = dedent(`
    set_state_flag = zin_zol_island_stirring
    ${ZOL} = {
    	add_to_variable = { zin_zol_islands_stirring = 1 }
    	set_temp_variable = { zin_arg_value = 0.5 }
    	zin_zol_add_mistake_power = yes
    	zin_zol_rumour_roll = yes
    }`);
  effects.zin_zol_wake_island = dedent(`
    # Wakes zin_arg_count random islands that do not stir yet (-1: every remaining island). Scope: any.
    ${takeArgs('count')}
    set_temp_variable = { zin_wi = 0 }
    if = {
    	limit = { check_variable = { zin_count < 0 } }
    	set_temp_variable = { zin_count = 99 }
    }
    while_loop_effect = {
    	limit = { check_variable = { zin_wi < zin_count } }
    	add_to_temp_variable = { zin_wi = 1 }
    	clear_global_event_target = zin_zol_island_pick
    	random_state = {
    		limit = {
    			zin_is_site_ocean_of_zol_island = yes
    			NOT = { has_state_flag = zin_zol_island_stirring }
    		}
    		save_global_event_target_as = zin_zol_island_pick
    	}
    	if = {
    		limit = { has_event_target = zin_zol_island_pick }
    		event_target:zin_zol_island_pick = { zin_zol_wake_island_here = yes }
    	}
    	else = {
    		set_temp_variable = { zin_wi = 99 }
    	}
    }`);

  // ---------------------------------------------------------------------------------------------- hosts
  const hostTemplate = (name, regiments, support) => list(
    'if = {', `limit = { NOT = { has_template = "${name}" } }`, 'division_template = {', `name = "${name}"`, `division_names_group = ${T.hostGroup}`, 'regiments = {', regiments.map((u, i) => `${u} = { x = ${Math.floor(i / 5)} y = ${i % 5} }`), '}',
    support ? list('support = {', `${support} = { x = 0 y = 0 }`, '}') : '', '}', '}');
  effects.zin_zol_make_templates = list('# The two division templates (the warfare spec\'s deathless battalions).',
    hostTemplate('The Deathless Host', Array(10).fill('zin_zol_deathless')),
    hostTemplate('The Presence', Array(4).fill('zin_zol_deathless'), 'zin_zol_manifestation'));
  // Raises one host at a muster site. zin_site: 1 Furviatlon, 2 Sodoloro, 3 a stirring island. The state needs its first province (zin_zol_first_province).
  effects.zin_zol_muster_one = dedent(`
    zin_zol_make_templates = yes
    clear_global_event_target = zin_zol_muster_state
    if = {
    	limit = { check_variable = { zin_site = 3 } }
    	random_owned_state = {
    		limit = {
    			zin_is_site_ocean_of_zol_island = yes
    			has_state_flag = zin_zol_island_stirring
    			NOT = { has_state_flag = zin_glo_cleansed }
    		}
    		save_global_event_target_as = zin_zol_muster_state
    	}
    }
    else_if = {
    	limit = { check_variable = { zin_site = 2 } }
    	random_owned_state = {
    		limit = {
    			zin_is_site_sodoloro = yes
    			NOT = { has_state_flag = zin_glo_cleansed }
    		}
    		save_global_event_target_as = zin_zol_muster_state
    	}
    }
    if = {
    	limit = { NOT = { has_event_target = zin_zol_muster_state } }
    	random_owned_state = {
    		limit = {
    			zin_is_site_furviatlon = yes
    			NOT = { has_state_flag = zin_glo_cleansed }
    		}
    		save_global_event_target_as = zin_zol_muster_state
    	}
    }
    if = {
    	limit = { has_event_target = zin_zol_muster_state }
    	set_temp_variable = { zin_prov = event_target:zin_zol_muster_state.zin_zol_first_province }
    	meta_effect = {
    		text = {
    			create_unit = {
    				division = "name = \\"The Deathless Host\\" division_template = \\"The Deathless Host\\" start_experience_factor = 0.2 start_equipment_factor = 1"
    				owner = THIS
    				prioritize_location = [P]
    				allow_spawning_on_enemy_provs = no
    			}
    		}
    		P = "[?zin_prov|0]"
    	}
    	add_manpower = ${D.manpowerPerHost}
    	add_equipment_to_stockpile = {
    		type = zin_deathless_equipment
    		amount = ${D.bondsPerHost}
    	}
    	add_to_variable = { zin_zol_hosts = 1 }
    }`);
  effects.zin_zol_raise_host = dedent(`
    # Creates zin_arg_count hosts (default 1) at the allowed muster sites. zin_arg_free 1 skips the power and political cost (the rising and the focuses).
    ${takeArgs('count', 'free')}
    ${ZOL} = {
    	if = {
    		limit = { check_variable = { zin_count < 1 } }
    		set_temp_variable = { zin_count = 1 }
    	}
    	set_temp_variable = { zin_hi = 0 }
    	while_loop_effect = {
    		limit = { check_variable = { zin_hi < zin_count } }
    		add_to_temp_variable = { zin_hi = 1 }
    		set_temp_variable = { zin_site = 1 }
    		random_list = {
    			40 = { }
    			30 = {
    				trigger = { has_country_flag = zin_zol_muster_sodoloro }
    				set_temp_variable = { zin_site = 2 }
    			}
    			40 = {
    				trigger = {
    					has_country_flag = zin_zol_muster_islands
    					check_variable = { zin_zol_islands_stirring > 0 }
    				}
    				set_temp_variable = { zin_site = 3 }
    			}
    		}
    		zin_zol_muster_one = yes
    	}
    	if = {
    		limit = { check_variable = { zin_free = 0 } }
    		set_temp_variable = { zin_arg_value = -2 }
    		zin_zol_add_mistake_power = yes
    		add_political_power = -10
    	}
    	zin_zol_refresh_presence = yes
    }`);
  effects.zin_zol_count_hosts = dedent(`
    # zin_zol_hosts: the divisions alive, less the Presence. Scope: Zol.
    set_variable = { zin_zol_hosts = num_divisions }
    if = {
    	limit = { zin_zol_is_manifest = yes }
    	add_to_variable = { zin_zol_hosts = -1 }
    	clamp_variable = { var = zin_zol_hosts min = 0 }
    }`);
  effects.zin_zol_harden_wastes = dedent(`
    ${ZOL} = {
    	every_owned_state = {
    		if = {
    			limit = { NOT = { has_dynamic_modifier = { modifier = zin_zol_black_waste } } }
    			add_dynamic_modifier = { modifier = zin_zol_black_waste }
    		}
    	}
    }`);
  effects.zin_zol_spread_deathfield = dedent(`
    ${ZOL} = {
    	every_controlled_state = {
    		limit = { NOT = { is_owned_by = PREV } }
    		add_dynamic_modifier = {
    			modifier = zin_zol_deathfield
    			days = ${D.withdraw.deathfieldDays}
    		}
    	}
    }`);

  // ---------------------------------------------------------------------------------------------- the dead return
  effects.zin_zol_return_the_fallen = dedent(`
    # Section 6. For each enemy, the casualties it has inflicted since the last tick, in steps of 50: if the enemy has no potent magic,
    # Zol regains return_rate x 50 manpower and return_rate x 250 deathless bonds a step. Scope: Zol.
    save_global_event_target_as = zin_zol_self
    set_temp_variable = { zin_steps_all = 0 }
    every_enemy_country = {
    	save_global_event_target_as = zin_zol_enemy
    	set_temp_variable = { zin_steps = 0 }
    	set_temp_variable = { zin_next = zin_zol_fallen_seen_k }
    	add_to_temp_variable = { zin_next = 0.05 }
    	while_loop_effect = {
    		limit = {
    			check_variable = { zin_steps < 200 }
    			meta_trigger = {
    				text = { event_target:zin_zol_self = { casualties_inflicted_by = { opponent = event_target:zin_zol_enemy thousands > [T] } } }
    				T = "[?zin_next|.2]"
    			}
    		}
    		add_to_variable = { zin_zol_fallen_seen_k = 0.05 }
    		add_to_temp_variable = { zin_next = 0.05 }
    		add_to_temp_variable = { zin_steps = 1 }
    		if = {
    			limit = { zin_has_potent_magic = no }
    			add_to_temp_variable = { zin_steps_all = 1 }
    		}
    	}
    }
    if = {
    	limit = { check_variable = { zin_steps_all > 0 } }
    	set_temp_variable = { zin_gain_m = zin_steps_all }
    	multiply_temp_variable = { zin_gain_m = zin_zol_return_rate }
    	multiply_temp_variable = { zin_gain_m = 50 }
    	round_temp_variable = zin_gain_m
    	set_temp_variable = { zin_gain_b = zin_gain_m }
    	multiply_temp_variable = { zin_gain_b = 5 }
    	add_manpower = zin_gain_m
    	add_equipment_to_stockpile = {
    		type = zin_deathless_equipment
    		amount = zin_gain_b
    	}
    }`);
  // Each enemy with potent magic gets the bane (and loses it when the war or the magic ends).
  effects.zin_zol_bane_upkeep = dedent(`
    every_country = {
    	limit = {
    		OR = {
    			has_idea = zin_zol_bane
    			has_idea = zin_zol_bane_known
    		}
    		OR = {
    			NOT = { has_war_with = ${ZOL} }
    			zin_has_potent_magic = no
    		}
    	}
    	remove_ideas = { zin_zol_bane zin_zol_bane_known }
    }
    every_enemy_country = {
    	limit = { zin_has_potent_magic = yes }
    	if = {
    		limit = { ${ZOL} = { has_country_flag = zin_zol_knows_bane } }
    		if = {
    			limit = { NOT = { has_idea = zin_zol_bane_known } }
    			remove_ideas = zin_zol_bane
    			add_ideas = zin_zol_bane_known
    		}
    	}
    	else_if = {
    		limit = { NOT = { has_idea = zin_zol_bane } }
    		add_ideas = zin_zol_bane
    	}
    }`);

  // ---------------------------------------------------------------------------------------------- the rising
  effects.zin_zol_after_rise_common = dedent(`
    # Steps 2 to 4 of the rising, shared with the second stirring. Scope: Zol.
    set_rule = { can_not_declare_war = no }
    remove_ideas = zin_zol_the_dormancy
    if = {
    	limit = { NOT = { has_idea = zin_zol_the_rising } }
    	add_ideas = zin_zol_the_rising
    }
    set_temp_variable = { zin_n = zin_mistake_power }
    divide_temp_variable = { zin_n = 10 }
    if = {
    	limit = { has_country_flag = zin_zol_greater_hour }
    	multiply_temp_variable = { zin_n = 1.5 }
    }
    round_temp_variable = zin_n
    set_temp_variable = { zin_arg_count = zin_n }
    set_temp_variable = { zin_arg_free = 1 }
    zin_zol_raise_host = yes`);
  effects.zin_zol_rise = dedent(`
    # The dead rise beyond the Mistake (section 7). Scope: any (acts on Zol).
    ${ZOL} = {
    	if = {
    		limit = { NOT = { has_global_flag = zin_zol_rising } }
    		set_global_flag = zin_zol_rising
    		zin_zol_after_rise_common = yes
    		if = {
    			limit = { has_country_flag = zin_zol_greater_hour }
    			set_temp_variable = { zin_arg_value = 20 }
    			zin_zol_add_convergence = yes
    		}
    		country_event = { id = zin_mistake.10 }
    		set_temp_variable = { zin_arg_value = 10 }
    		zin_world_add_gathering_dark = yes
    		news_event = { id = zin_mistake.11 }
    		every_country = {
    			limit = { has_country_flag = zin_zol_forewarned }
    			add_timed_idea = {
    				idea = zin_zol_forewarned
    				days = ${R.forewarnedDays}
    			}
    		}
    		zin_zol_refresh_presence = yes
    	}
    }`);
  effects.zin_zol_second_rise = dedent(`
    ${ZOL} = {
    	zin_zol_after_rise_common = yes
    	set_temp_variable = { zin_arg_value = 5 }
    	zin_world_add_gathering_dark = yes
    	news_event = { id = zin_mistake.30 }
    }`);

  // ---------------------------------------------------------------------------------------------- Volgan and the elves' edge
  effects.zin_zol_wargoal_elven_edge = dedent(`
    # War on the Magical Lands realm with the most states next to a Zol-owned state. Scope: Zol.
    save_global_event_target_as = zin_zol_self
    set_temp_variable = { zin_best = 0 }
    clear_global_event_target = zin_zol_edge
    every_country = {
    	limit = { has_country_flag = zin_region_magical_lands }
    	set_temp_variable = { zin_edge = 0 }
    	every_owned_state = {
    		limit = { any_neighbor_state = { is_owned_by = event_target:zin_zol_self } }
    		add_to_temp_variable = { zin_edge = 1 }
    	}
    	if = {
    		limit = { check_variable = { zin_edge > zin_best } }
    		set_temp_variable = { zin_best = zin_edge }
    		save_global_event_target_as = zin_zol_edge
    	}
    }
    if = {
    	limit = { has_event_target = zin_zol_edge }
    	declare_war_on = {
    		target = event_target:zin_zol_edge
    		type = annex_everything
    	}
    }`);
  effects.zin_zol_strike_volgan = dedent(`
    # A player Zol strikes Volgan first (section 8): claims on the bordering Volgan-held states, then war. Nothing happens once the clash is on.
    if = {
    	limit = {
    		country_exists = ${T.volgan}
    		NOT = { has_war_with = ${T.volgan} }
    		NOT = { has_global_flag = zin_volgan_zol_clash }
    	}
    	save_global_event_target_as = zin_zol_self
    	every_state = {
    		limit = {
    			is_controlled_by = ${T.volgan}
    			any_neighbor_state = { is_owned_by = event_target:zin_zol_self }
    		}
    		add_claim_by = ${ZOL}
    	}
    	declare_war_on = {
    		target = ${T.volgan}
    		type = take_claimed_state
    	}
    }`);

  // ---------------------------------------------------------------------------------------------- the manifestation
  effects.zin_zol_manifest = dedent(`
    # Zol comes forth (section 9). Scope: any (acts on Zol).
    ${ZOL} = {
    	if = {
    		limit = { zin_zol_can_manifest = yes }
    		set_global_flag = zin_zol_manifested
    		set_temp_variable = { zin_arg_value = ${D.formCost.powerOnManifest} }
    		zin_zol_add_mistake_power = yes
    		set_variable = { zin_zol_convergence = 0 }
    		add_ideas = zin_zol_form_taken
    		zin_zol_make_templates = yes
    		clear_global_event_target = zin_zol_muster_state
    		random_state = {
    			limit = {
    				zin_is_region_middle_lands = yes
    				is_controlled_by = ${ZOL}
    				NOT = { has_state_flag = zin_glo_cleansed }
    			}
    			save_global_event_target_as = zin_zol_muster_state
    		}
    		if = {
    			limit = { NOT = { has_event_target = zin_zol_muster_state } }
    			random_owned_state = {
    				limit = { zin_is_site_furviatlon = yes }
    				save_global_event_target_as = zin_zol_muster_state
    			}
    		}
    		set_temp_variable = { zin_prov = event_target:zin_zol_muster_state.zin_zol_first_province }
    		meta_effect = {
    			text = {
    				create_unit = {
    					division = "name = \\"The Presence\\" division_template = \\"The Presence\\" start_experience_factor = 0.5 start_equipment_factor = 1"
    					owner = THIS
    					prioritize_location = [P]
    					allow_spawning_on_enemy_provs = no
    				}
    			}
    			P = "[?zin_prov|0]"
    		}
    		zin_war_grant_zol_manifestation = yes
    		activate_mission = zin_zol_the_form_endures
    		set_variable = { zin_zol_manifest_cost = ${D.formCost.weeklyPower} }
    		if = {
    			limit = { has_country_flag = zin_zol_cost_of_form }
    			set_variable = { zin_zol_manifest_cost = ${D.formCost.afterTheCost} }
    		}
    		set_temp_variable = { zin_arg_value = 10 }
    		zin_world_add_gathering_dark = yes
    		news_event = { id = zin_mistake.20 }
    		# Eindil's host meets the form: with Glo, zin_mistake.21 fires the journey's event; without it the journey's event fires here.
    		if = {
    			limit = {
    				NOT = { has_global_flag = zin_glo_with_eindil }
    				var:global.zin_eindil_host = { has_war_with = ${ZOL} }
    			}
    			var:global.zin_eindil_host = { country_event = { id = zin_eindil.101 days = 7 } }
    		}
    		zin_zol_refresh_presence = yes
    	}
    }`);

  effects.zin_zol_withdraw = dedent(`
    # Zol withdraws (section 9). zin_arg_cause: 0 Lorien's stand or the form spent after a manifestation (news .24), 1 any other cause (news .25).
    ${takeArgs('cause')}
    ${ZOL} = {
    	if = {
    		limit = { NOT = { has_global_flag = zin_zol_withdrawn } }
    		set_global_flag = zin_zol_withdrawn
    		if = {
    			limit = { has_global_flag = zin_zol_manifested }
    			remove_ideas = zin_zol_form_taken
    			zin_war_remove_zol_manifestation = yes
    			delete_unit = { division_template = "The Presence" }
    			if = {
    				limit = { has_active_mission = zin_zol_the_form_endures }
    				remove_mission = zin_zol_the_form_endures
    			}
    			add_timed_idea = {
    				idea = zin_zol_wounded
    				days = ${D.withdraw.woundedDays}
    			}
    			zin_zol_spread_deathfield = yes
    		}
    		set_temp_variable = { zin_pw = zin_mistake_power }
    		add_to_temp_variable = { zin_pw = -${D.withdraw.powerDrop} }
    		clamp_temp_variable = { var = zin_pw min = ${D.withdraw.powerFloor} }
    		set_variable = { zin_mistake_power = zin_pw }
    		# the hosts that stand outside the Mistake lose coherence or leave the field
    		every_state = {
    			limit = { NOT = { is_owned_by = ${ZOL} } }
    			${ZOL} = { delete_unit = { state = PREV } }
    		}
    		every_enemy_country = {
    			${ZOL} = { white_peace = PREV }
    		}
    		set_rule = { can_not_declare_war = yes }
    		if = {
    			limit = { check_variable = { zin_cause = 0 } }
    			news_event = { id = zin_mistake.24 }
    		}
    		else = {
    			news_event = { id = zin_mistake.25 }
    		}
    		zin_zol_refresh_presence = yes
    	}
    }`);

  // Lapse and return (power 0 and back to 10).
  effects.zin_zol_lapse = dedent(`
    # The Presence lapses: every host is removed and the peace is made. The bonds keep sustaining him, so power can return.
    set_country_flag = zin_zol_presence_lapsed
    delete_unit = { division_template = "The Deathless Host" }
    delete_unit = { division_template = "The Presence" }
    every_enemy_country = {
    	${ZOL} = { white_peace = PREV }
    }
    set_rule = { can_not_declare_war = yes }
    set_variable = { zin_zol_hosts = 0 }
    country_event = { id = zin_mistake.6 }`);
  effects.zin_zol_unlapse = dedent(`
    clr_country_flag = zin_zol_presence_lapsed
    if = {
    	limit = { has_global_flag = zin_zol_rising }
    	set_rule = { can_not_declare_war = no }
    }
    country_event = { id = zin_mistake.6 }`);

  // A service falters: one order with two or more points loses one.
  effects.zin_zol_falter = dedent(`
    # Scope: Zol. The text never gives a reason.
    set_temp_variable = { zin_lost = 0 }
    random_list = {
    	1 = {
    		trigger = { ${ge('zin_zol_bond_great', 2)} }
    		add_to_variable = { zin_zol_bond_great = -1 }
    		set_temp_variable = { zin_lost = 1 }
    	}
    	1 = {
    		trigger = { ${ge('zin_zol_bond_lesser', 2)} }
    		add_to_variable = { zin_zol_bond_lesser = -1 }
    		set_temp_variable = { zin_lost = 2 }
    	}
    	1 = {
    		trigger = { ${ge('zin_zol_bond_divine', 2)} }
    		add_to_variable = { zin_zol_bond_divine = -1 }
    		set_temp_variable = { zin_lost = 3 }
    	}
    }
    if = {
    	limit = {
    		has_country_flag = zin_zol_bonds_steadfast
    		check_variable = { zin_lost > 0 }
    	}
    	set_variable = { zin_zol_lost_order = zin_lost }
    	country_event = { id = zin_mistake.7 days = 180 }
    }
    zin_zol_refresh_presence = yes`);
  effects.zin_zol_restore_order = dedent(`
    if = {
    	limit = { check_variable = { zin_zol_lost_order = 1 } }
    	add_to_variable = { zin_zol_bond_great = 1 }
    }
    else_if = {
    	limit = { check_variable = { zin_zol_lost_order = 2 } }
    	add_to_variable = { zin_zol_bond_lesser = 1 }
    }
    else_if = {
    	limit = { check_variable = { zin_zol_lost_order = 3 } }
    	add_to_variable = { zin_zol_bond_divine = 1 }
    }
    set_variable = { zin_zol_lost_order = 0 }
    clamp_variable = { var = zin_zol_bond_great min = 0 max = 5 }
    clamp_variable = { var = zin_zol_bond_lesser min = 0 max = 5 }
    clamp_variable = { var = zin_zol_bond_divine min = 0 max = 5 }
    zin_zol_refresh_presence = yes`);

  // ---------------------------------------------------------------------------------------------- the months and the weeks
  const g = D.growth;
  effects.zin_zol_monthly = dedent(`
    # Zol's monthly tick (section 2). Scope: Zol.
    set_temp_variable = { zin_ch = ${g.base} }
    ${orders.map(o => `set_temp_variable = { zin_t = zin_zol_bond_${o} }\nmultiply_temp_variable = { zin_t = ${g[o]} }\nadd_to_temp_variable = { zin_ch = zin_t }`).join('\n')}
    add_to_temp_variable = { zin_ch = zin_zol_growth_bonus }
    set_temp_variable = { zin_press = zin_zol_fading_pressure }
    set_temp_variable = { zin_bonds = zin_zol_bond_great }
    add_to_temp_variable = { zin_bonds = zin_zol_bond_lesser }
    add_to_temp_variable = { zin_bonds = zin_zol_bond_divine }
    if = {
    	limit = { check_variable = { zin_bonds < ${g.weakBonds + 1} } }
    	multiply_temp_variable = { zin_press = 2 }
    }
    subtract_from_temp_variable = { zin_ch = zin_press }
    add_to_variable = { zin_mistake_power = zin_ch }
    clamp_variable = { var = zin_mistake_power min = 0 max = 100 }
    if = {
    	limit = {
    		check_variable = { zin_mistake_power < 15 }
    		NOT = { has_country_flag = zin_zol_thin_seen }
    	}
    	set_country_flag = zin_zol_thin_seen
    	country_event = { id = zin_mistake.5 }
    }
    if = {
    	limit = { check_variable = { zin_mistake_power > 24 } }
    	clr_country_flag = zin_zol_thin_seen
    }
    if = {
    	limit = {
    		NOT = { has_country_flag = zin_zol_presence_lapsed }
    		check_variable = { zin_mistake_power < 0.01 }
    	}
    	zin_zol_lapse = yes
    }
    else_if = {
    	limit = {
    		has_country_flag = zin_zol_presence_lapsed
    		${ge('zin_mistake_power', 10)}
    	}
    	zin_zol_unlapse = yes
    }
    zin_zol_count_hosts = yes
    zin_war_feed_deathless = yes
    if = {
    	limit = {
    		has_war = yes
    		has_global_flag = zin_war_of_last_crowns
    		has_global_flag = zin_zol_rising
    	}
    	set_temp_variable = { zin_arg_value = 2 }
    	add_to_temp_variable = { zin_arg_value = zin_zol_convergence_rate }
    	zin_zol_add_convergence = yes
    }
    if = {
    	limit = { has_global_flag = zin_zol_rising }
    	zin_zol_return_the_fallen = yes
    }
    zin_zol_bane_upkeep = yes
    zin_zol_refresh_presence = yes
    zin_zol_ai_catch_ups = yes`);

  // The catch-ups of an AI Zol that keeps history (and the aggressive rule).
  effects.zin_zol_ai_catch_ups = dedent(`
    if = {
    	limit = {
    		zin_zol_ai_keeps_history = yes
    		NOT = { has_global_flag = zin_zol_rising }
    		OR = {
    			AND = {
    				${rule('zin_rule_dark_powers', 'AGGRESSIVE')}
    				zin_zol_after_forced_rising_early = yes
    			}
    			AND = {
    				${rule('zin_rule_dark_powers', 'HISTORICAL')}
    				zin_zol_after_forced_rising = yes
    			}
    		}
    	}
    	# power to 55 and every island awake, then the rising
    	if = {
    		limit = { check_variable = { zin_mistake_power < ${D.risingPower} } }
    		set_variable = { zin_mistake_power = ${D.risingPower} }
    	}
    	set_temp_variable = { zin_arg_count = -1 }
    	zin_zol_wake_island = yes
    	zin_zol_rise = yes
    }`);
  effects.zin_zol_weekly_manifest = dedent(`
    # Weekly: the form's cost and its end, and the manifestation catch-up for an AI that keeps history. Scope: Zol.
    if = {
    	limit = { zin_zol_is_manifest = yes }
    	set_temp_variable = { zin_arg_value = zin_zol_manifest_cost }
    	multiply_temp_variable = { zin_arg_value = -1 }
    	zin_zol_add_mistake_power = yes
    	if = {
    		limit = { check_variable = { zin_mistake_power < ${D.formCost.endsBelow} } }
    		set_temp_variable = { zin_arg_cause = 1 }
    		zin_zol_withdraw = yes
    	}
    	else_if = {
    		limit = { check_variable = { num_equipment_in_armies@zin_zol_manifestation_equipment < 1 } }
    		set_temp_variable = { zin_arg_cause = 1 }
    		zin_zol_withdraw = yes
    	}
    }
    else_if = {
    	limit = {
    		zin_zol_ai_keeps_history = yes
    		has_global_flag = zin_zol_rising
    		NOT = { has_global_flag = zin_zol_manifested }
    		has_war = yes
    		OR = {
    			has_global_flag = zin_volgan_body_destroyed
    			zin_zol_after_late_manifest = yes
    		}
    	}
    	if = {
    		limit = { check_variable = { zin_zol_convergence < ${D.manifestConvergence} } }
    		set_variable = { zin_zol_convergence = ${D.manifestConvergence} }
    	}
    	if = {
    		limit = { check_variable = { zin_mistake_power < ${D.manifestPower} } }
    		set_variable = { zin_mistake_power = ${D.manifestPower} }
    	}
    	zin_zol_manifest = yes
    }`);

  effects.zin_zol_startup_values = dedent(`
    # Start values and rules. Scope: Zol.
    set_variable = { zin_mistake_power = ${S.power} }
    set_variable = { zin_zol_bond_great = ${S.bondGreat} }
    set_variable = { zin_zol_bond_lesser = ${S.bondLesser} }
    set_variable = { zin_zol_bond_divine = ${S.bondDivine} }
    set_variable = { zin_zol_growth_bonus = 0 }
    set_variable = { zin_zol_fading_pressure = ${S.fadingPressure} }
    set_variable = { zin_zol_islands_stirring = 0 }
    set_variable = { zin_zol_host_cap_bonus = 0 }
    set_variable = { zin_zol_hosts = 0 }
    set_variable = { zin_zol_return_rate = ${S.returnRate} }
    set_variable = { zin_zol_convergence = 0 }
    set_variable = { zin_zol_convergence_rate = 0 }
    set_variable = { zin_zol_manifest_cost = ${D.formCost.weeklyPower} }
    set_variable = { zin_zol_lost_order = 0 }
    set_variable = { global.zin_zol_tales = 0 }
    if = {
    	limit = { ${rule('zin_rule_dark_powers', 'AGGRESSIVE')} }
    	set_variable = { zin_zol_host_cap_bonus = 2 }
    }
    # the rising needs 4 stirring islands, or all of them when the map holds fewer
    set_variable = { zin_zol_islands_needed = 0 }
    every_state = {
    	limit = { zin_is_site_ocean_of_zol_island = yes }
    	${ZOL} = { add_to_variable = { zin_zol_islands_needed = 1 } }
    }
    clamp_variable = { var = zin_zol_islands_needed max = 4 }
    add_ideas = { zin_zol_without_a_body zin_zol_the_dormancy }
    add_dynamic_modifier = { modifier = zin_zol_presence }
    set_rule = {
    	can_not_declare_war = yes
    	can_create_factions = no
    	can_join_factions = no
    	can_guarantee_other_ideologies = no
    	can_send_volunteers = no
    	can_puppet = no
    }
    # the order of battle of the politics step is replaced: Zol starts with no land division (R3)
    delete_unit = { division_template = "Infantry Division" }
    zin_zol_make_templates = yes
    zin_zol_refresh_presence = yes`);

  return { triggers, effects };
}
