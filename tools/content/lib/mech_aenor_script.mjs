// Scripted triggers and effects of Aenor's Golden Court and succession (docs/specs/04_mechanics/aenor_court_and_succession.md).
// aenorScripts(D, T) returns { triggers, effects } as { name: body } objects; the module writes them to
// common/scripted_triggers/zin_aenor_court.txt and common/scripted_effects/zin_aenor_court.txt.
// D is data/mech_aenor.json, T the tag table { aenor, hub, selen, dominions: [{...row, tag}] }.
import { dedent, list, num, call, takeArgs, dateTrigger } from './mech_court_lib.mjs';
import { IDEOLOGIES } from '../modules/ideologies.mjs';

// Position of a stance in the foundation's list (modules/ideologies.mjs order); the code zin_politics_set_stance reads from zin_arg_stance.
export const STANCES = Object.values(IDEOLOGIES).flatMap(d => Object.keys(d.stances));
export const stanceCode = s => { const i = STANCES.indexOf(s); if (i < 0) throw new Error(`Unknown stance ${s}`); return i + 1; };
export const setStance = s => call('zin_politics_set_stance', { stance: stanceCode(s) });

const ge = (v, n) => `check_variable = { var = ${v} value = ${n} compare = greater_than_or_equals }`;
const le = (v, n) => `check_variable = { var = ${v} value = ${n} compare = less_than_or_equals }`;
const rule = (r, o) => `has_game_rule = { rule = ${r} option = ${o} }`;
const GKD = 'zin_rule_golden_king_death';

export function aenorScripts(D, T) {
  const R = D.rates, S = D.start;
  const AEN = T.aenor, HUB = T.hub;
  const triggers = {}, effects = {};

  // ---------------------------------------------------------------------------------------------------- triggers
  triggers.zin_aenor_is_realm = `original_tag = ${AEN}`;
  triggers.zin_aenor_is_concord_dominion = list('is_subject = yes', 'NOT = { has_country_flag = zin_aenor_free_dominion }', 'has_variable = zin_concord_loyalty', 'OVERLORD = { zin_aenor_is_realm = yes }');
  triggers.zin_aenor_king_alive = 'NOT = { has_global_flag = zin_golden_king_dead }';
  triggers.zin_aenor_council_dominant = ge('zin_council_influence', R.dominantAt);
  triggers.zin_aenor_council_faltering = le('zin_council_influence', R.falteringAt);
  triggers.zin_aenor_court_gilded = ge('zin_court_corruption', R.gildedAt);
  triggers.zin_aenor_court_honest = le('zin_court_corruption', R.honestAt);
  triggers.zin_aenor_dominion_steadfast = ge('zin_concord_loyalty', 75);
  triggers.zin_aenor_dominion_loyal = list(ge('zin_concord_loyalty', 50), 'check_variable = { zin_concord_loyalty < 75 }');
  triggers.zin_aenor_dominion_restless = list(ge('zin_concord_loyalty', 25), 'check_variable = { zin_concord_loyalty < 50 }');
  triggers.zin_aenor_dominion_defiant = 'check_variable = { zin_concord_loyalty < 25 }';
  triggers.zin_aenor_hand_known = 'OR = {\n\thas_country_flag = zin_aenor_hidden_hand_seen\n\thas_global_flag = zin_afrit_revealed\n}';
  triggers.zin_aenor_host_available = list('has_global_flag = zin_eindil_named', ge('global.zin_eindil_stage', 8));
  [['court', 1], ['faithful', 2], ['dominions', 3], ['host', 4], ['captains', 5]].forEach(([k, n]) => { triggers[`zin_aenor_ruled_by_${k}`] = `check_variable = { zin_aenor_ruling_camp = ${n} }`; });
  triggers.zin_aenor_parim_lost = dedent(`
    NOT = {
    	any_country = {
    		zin_aenor_is_realm = yes
    		any_controlled_state = { zin_is_site_parim = yes }
    	}
    }`);
  triggers.zin_aenor_eindil_rules = 'has_country_leader = { character = zin_eindil }';
  triggers.zin_aenor_free_dominions_exist = 'any_country = { has_country_flag = zin_aenor_free_dominion }';
  triggers.zin_lost_cause_exists = dedent(`
    OR = {
    	AND = {
    		has_global_flag = zin_lost_cause_shield
    		any_country = {
    			zin_aenor_is_realm = yes
    			is_faction_leader = yes
    		}
    	}
    	AND = {
    		has_global_flag = zin_lost_cause_with_eindil
    		any_country = {
    			is_faction_leader = yes
    			has_character = zin_eindil
    		}
    	}
    }`);
  triggers.zin_aenor_eindil_can_be_crowned = dedent(`
    has_global_flag = zin_afrit_dead
    has_global_flag = zin_eindil_named
    has_global_flag = zin_eindil_returned
    NOT = { has_global_flag = zin_eindil_crowned }
    NOT = { has_global_flag = zin_eindil_lost }
    zin_aenor_is_realm = yes
    check_variable = { global.zin_eindil_crowning_realm = THIS }
    OR = {
    	has_character = zin_eindil
    	any_other_country = {
    		has_character = zin_eindil
    		OR = {
    			is_in_faction_with = PREV
    			is_faction_leader = yes
    		}
    	}
    }
    OR = {
    	NOT = { has_global_flag = zin_eindil_cast_down }
    	has_global_flag = zin_eindil_recovered
    }
    any_controlled_state = { zin_is_site_parim = yes }
    has_capitulated = no
    NOT = {
    	any_enemy_country = {
    		meta_trigger = {
    			text = { divisions_in_state = { state = [S] size > 0 } }
    			S = "[?global.zin_site_parim|0]"
    		}
    	}
    }
    OR = {
    	NOT = { ${rule('zin_rule_historical_path', 'HISTORICAL')} }
    	zin_aenor_date_coronation = yes
    }`);
  triggers.zin_aenor_date_death_floor = dedent(`
    OR = {
    	AND = {
    		NOT = { ${rule(GKD, 'DELAYED')} }
    		zin_aenor_date_death_floor_standard = yes
    	}
    	AND = {
    		${rule(GKD, 'DELAYED')}
    		zin_aenor_date_death_floor_delayed = yes
    	}
    }`);
  const dateBodies = {};
  dateBodies.zin_aenor_date_death_floor_standard = D.dates.deathFloor;
  dateBodies.zin_aenor_date_death_floor_delayed = D.dates.deathFloorDelayed;
  dateBodies.zin_aenor_date_coronation = D.dates.coronation;
  triggers.__dates = Object.entries(dateBodies).map(([n, d]) => dateTrigger(n, d, `${n}: ${d} at the standard pace, shifted by zin_story_pace`)).join('\n');

  // ---------------------------------------------------------------------------------------------------- effects: finding the realm
  effects.zin_aenor_find_parim_realm = dedent(`
    # Saves the global event target zin_aenor_parim_realm: the Aenor realm that controls Parim's state, else the original Aenor country.
    clear_global_event_target = zin_aenor_parim_realm
    every_state = {
    	limit = { zin_is_site_parim = yes }
    	controller = {
    		if = {
    			limit = { zin_aenor_is_realm = yes }
    			save_global_event_target_as = zin_aenor_parim_realm
    		}
    	}
    }
    if = {
    	limit = { NOT = { has_event_target = zin_aenor_parim_realm } }
    	${AEN} = {
    		if = {
    			limit = { exists = yes }
    			save_global_event_target_as = zin_aenor_parim_realm
    		}
    	}
    }`);
  effects.zin_aenor_event_for_parim = '# F7: trees and story events fire an event to the realm that holds Parim with this call, then\n# event_target:zin_aenor_parim_realm = { country_event = { id = <event> } } (written by the compilers).\nzin_aenor_find_parim_realm = yes';

  // ---------------------------------------------------------------------------------------------------- effects: variables
  // Wrapper (any scope) + _here (the realm). The argument travels as the temporary variable zin_arg_value.
  const wrap = (name, hereBody) => {
    effects[`${name}_here`] = hereBody;
    effects[name] = dedent(`
      ${takeArgs('value')}
      if = {
      	limit = { zin_aenor_is_realm = yes }
      	set_temp_variable = { zin_arg_value = zin_value }
      	${name}_here = yes
      }
      else = {
      	zin_aenor_find_parim_realm = yes
      	if = {
      		limit = { has_event_target = zin_aenor_parim_realm }
      		event_target:zin_aenor_parim_realm = {
      			set_temp_variable = { zin_arg_value = zin_value }
      			${name}_here = yes
      		}
      	}
      }`);
  };
  wrap('zin_aenor_add_court_corruption', dedent(`
    ${takeArgs('value')}
    add_to_variable = { zin_court_corruption = zin_value }
    if = {
    	limit = { zin_aenor_king_alive = yes }
    	clamp_variable = { var = zin_court_corruption min = ${R.corruptionFloorWhileKing} max = 100 }
    }
    else = {
    	clamp_variable = { var = zin_court_corruption min = 0 max = 100 }
    }
    zin_aenor_refresh_modifiers = yes`));
  wrap('zin_aenor_add_council_influence', dedent(`
    ${takeArgs('value')}
    add_to_variable = { zin_council_influence = zin_value }
    clamp_variable = { var = zin_council_influence min = 0 max = 100 }
    if = {
    	limit = {
    		zin_aenor_council_faltering = yes
    		NOT = { has_country_flag = zin_aenor_council_falter_seen }
    		zin_aenor_king_alive = yes
    	}
    	set_country_flag = zin_aenor_council_falter_seen
    	country_event = { id = zin_aenor.22 }
    }
    if = {
    	limit = { check_variable = { zin_council_influence > 40 } }
    	clr_country_flag = zin_aenor_council_falter_seen
    }
    zin_aenor_refresh_modifiers = yes`));

  effects.zin_aenor_add_concord_loyalty = dedent(`
    ${takeArgs('value')}
    add_to_variable = { zin_concord_loyalty = zin_value }
    clamp_variable = { var = zin_concord_loyalty min = 0 max = 100 }`);
  effects.zin_aenor_add_concord_loyalty_all = dedent(`
    ${takeArgs('value')}
    every_subject_country = {
    	limit = { zin_aenor_is_concord_dominion = yes }
    	set_temp_variable = { zin_arg_value = zin_value }
    	zin_aenor_add_concord_loyalty = yes
    }
    zin_aenor_refresh_modifiers = yes`);
  effects.zin_aenor_add_lost_cause = dedent(`
    ${takeArgs('value')}
    add_to_variable = { zin_aenor_lost_cause = zin_value }
    clamp_variable = { var = zin_aenor_lost_cause min = 0 max = 100 }`);

  // Charters ------------------------------------------------------------------------------------------------
  const charterIdeas = D.charters.map(c => `zin_concord_charter_${c.key}`);
  effects.zin_aenor_set_charter = dedent(`
    ${takeArgs('charter')}
    remove_ideas = { ${charterIdeas.join(' ')} }
    ${D.charters.map((c, i) => `${i ? 'else_if' : 'if'} = {\n\tlimit = { check_variable = { zin_charter = ${c.code} } }\n\tadd_ideas = zin_concord_charter_${c.key}\n}`).join('\n')}
    set_country_flag = { flag = zin_concord_charter_recent days = 180 }`);
  effects.zin_aenor_set_charter_all = dedent(`
    ${takeArgs('charter')}
    every_subject_country = {
    	limit = { zin_aenor_is_concord_dominion = yes }
    	set_temp_variable = { zin_arg_charter = zin_charter }
    	zin_aenor_set_charter = yes
    }
    zin_aenor_refresh_modifiers = yes`);

  // The dynamic modifiers and the Concord average -----------------------------------------------------------
  effects.zin_aenor_refresh_modifiers = dedent(`
    # Recomputes the inputs of the dynamic modifiers and the average loyalty of the current dominions.
    set_variable = { zin_aenor_dm_court_pp = zin_court_corruption }
    multiply_variable = { zin_aenor_dm_court_pp = 0.01 }
    set_variable = { zin_aenor_dm_court_cg = zin_court_corruption }
    multiply_variable = { zin_aenor_dm_court_cg = 0.002 }
    set_variable = { zin_aenor_dm_court_stab = zin_court_corruption }
    multiply_variable = { zin_aenor_dm_court_stab = -0.001 }
    set_variable = { zin_aenor_dm_court_eff = zin_court_corruption }
    multiply_variable = { zin_aenor_dm_court_eff = -0.001 }
    set_variable = { zin_aenor_dm_temple_stab = zin_council_influence }
    multiply_variable = { zin_aenor_dm_temple_stab = 0.001 }
    set_variable = { zin_aenor_dm_temple_drift = zin_council_influence }
    multiply_variable = { zin_aenor_dm_temple_drift = 0.004 }
    set_variable = { zin_aenor_dm_temple_pop = zin_council_influence }
    multiply_variable = { zin_aenor_dm_temple_pop = 0.002 }
    set_temp_variable = { zin_ca_sum = 0 }
    set_temp_variable = { zin_ca_n = 0 }
    every_subject_country = {
    	limit = { zin_aenor_is_concord_dominion = yes }
    	add_to_temp_variable = { zin_ca_sum = zin_concord_loyalty }
    	add_to_temp_variable = { zin_ca_n = 1 }
    }
    if = {
    	limit = { check_variable = { zin_ca_n > 0 } }
    	set_variable = { zin_aenor_concord_avg = zin_ca_sum }
    	divide_variable = { zin_aenor_concord_avg = zin_ca_n }
    }
    else = {
    	set_variable = { zin_aenor_concord_avg = 0 }
    }
    # Temple Favour reads as The Hidden Hand once the Council is seen.
    if = {
    	limit = {
    		zin_aenor_hand_known = yes
    		has_dynamic_modifier = { modifier = zin_aenor_temple_favour }
    	}
    	remove_dynamic_modifier = { modifier = zin_aenor_temple_favour }
    	add_dynamic_modifier = { modifier = zin_aenor_hidden_hand }
    }
    force_update_dynamic_modifier = yes
    zin_aenor_ui_refresh = yes`);

  // ---------------------------------------------------------------------------------------------------- effects: the monthly pulse
  effects.zin_aenor_dominion_pulse = dedent(`
    # Monthly loyalty of one Concord dominion (scope: the dominion).
    set_temp_variable = { zin_ld = OVERLORD.zin_court_corruption }
    subtract_from_temp_variable = { zin_ld = 50 }
    if = {
    	limit = { check_variable = { zin_ld > 0 } }
    	multiply_temp_variable = { zin_ld = -0.02 }
    	if = {
    		limit = { OVERLORD = { zin_aenor_court_gilded = yes } }
    		multiply_temp_variable = { zin_ld = 2 }
    	}
    	add_to_variable = { zin_concord_loyalty = zin_ld }
    }
    ${[['old', 0], ['golden', -0.5], ['shield', 0.2], ['free', 0.4], ['wall', 0.1]].filter(([, v]) => v).map(([k, v]) => `if = {\n\tlimit = { has_idea = zin_concord_charter_${k} }\n\tadd_to_variable = { zin_concord_loyalty = ${num(v)} }\n}`).join('\n')}
    if = {
    	limit = {
    		has_global_flag = zin_lost_cause_shield
    		is_in_faction_with = OVERLORD
    	}
    	add_to_variable = { zin_concord_loyalty = 0.1 }
    }
    if = {
    	limit = {
    		OVERLORD = { has_war = yes }
    		any_owned_state = { NOT = { is_controlled_by = PREV } }
    	}
    	add_to_variable = { zin_concord_loyalty = -0.3 }
    }
    clamp_variable = { var = zin_concord_loyalty min = 0 max = 100 }`);

  effects.zin_aenor_monthly_pulse = dedent(`
    # The monthly pulse of one Aenor realm (hidden event zin_aenor.2).
    if = {
    	limit = {
    		zin_aenor_king_alive = yes
    		check_variable = { zin_court_corruption < ${R.corruptionDriftCeiling} }
    	}
    	add_to_variable = { zin_court_corruption = ${R.corruptionDrift} }
    }
    if = {
    	limit = { zin_aenor_king_alive = yes }
    	add_to_variable = { zin_council_influence = ${R.councilDrift} }
    	clamp_variable = { var = zin_council_influence min = 0 max = 100 }
    	clamp_variable = { var = zin_court_corruption min = ${R.corruptionFloorWhileKing} max = 100 }
    }
    else = {
    	if = {
    		limit = {
    			check_variable = { zin_court_corruption < 26 }
    			has_dynamic_modifier = { modifier = zin_aenor_golden_court }
    		}
    		remove_dynamic_modifier = { modifier = zin_aenor_golden_court }
    	}
    }
    every_subject_country = {
    	limit = { zin_aenor_is_concord_dominion = yes }
    	zin_aenor_dominion_pulse = yes
    }
    if = {
    	limit = {
    		tag = ${AEN}
    		zin_aenor_king_alive = yes
    		NOT = { has_global_flag = zin_golden_king_plot_exposed }
    	}
    	zin_aenor_tick_death_clock = yes
    }
    if = {
    	limit = {
    		zin_aenor_king_alive = yes
    		NOT = { has_global_flag = zin_golden_king_plot_exposed }
    		NOT = { has_global_flag = zin_golden_king_survives }
    	}
    	zin_aenor_check_royal_health = yes
    }
    zin_aenor_check_camps_rival = yes
    if = {
    	limit = {
    		has_global_flag = zin_eindil_returned
    		has_global_flag = zin_golden_king_dead
    		has_capitulated = no
    		NOT = { has_country_flag = zin_aenor_return_told }
    		NOT = { has_country_flag = zin_aenor_eindil_crowned_here }
    	}
    	set_country_flag = zin_aenor_return_told
    	if = {
    		limit = {
    			OR = {
    				zin_aenor_ruled_by_captains = yes
    				zin_aenor_ruled_by_dominions = yes
    			}
    		}
    		country_event = { id = zin_aenor.320 }
    	}
    	else_if = {
    		limit = {
    			OR = {
    				zin_aenor_ruled_by_faithful = yes
    				zin_aenor_ruled_by_court = yes
    			}
    		}
    		country_event = { id = zin_aenor.321 }
    	}
    }
    zin_aenor_refresh_modifiers = yes`);

  // ---------------------------------------------------------------------------------------------------- the death clock
  effects.zin_aenor_start_clock = dedent(`
    # Start: (975 + random 0-20) x pace days, +730 under DELAYED.
    set_variable = { zin_aenor_king_clock = ${S.clockBase} }
    set_temp_variable_to_random = {
    	var = zin_rnd
    	min = 0
    	max = 21
    	integer = yes
    }
    add_to_variable = { zin_aenor_king_clock = zin_rnd }
    if = {
    	limit = { ${rule(GKD, 'DELAYED')} }
    	add_to_variable = { zin_aenor_king_clock = ${S.clockDelayedExtra} }
    }
    set_temp_variable = { zin_pace = global.zin_story_pace }
    if = {
    	limit = { check_variable = { zin_pace < 0.1 } }
    	set_temp_variable = { zin_pace = 1 }
    }
    multiply_variable = { zin_aenor_king_clock = zin_pace }
    round_variable = zin_aenor_king_clock
    set_variable = { zin_aenor_clock_pace = 1 }
    set_variable = { zin_aenor_clock_hastened = 0 }
    set_variable = { zin_aenor_inquiry_bonus = 0 }`);

  effects.zin_aenor_tick_death_clock = dedent(`
    # Monthly tick of the hidden death clock and the scheduling of the King's death (section 5). Scope: the original Aenor country.
    set_variable = { zin_aenor_clock_pace = 1 }
    if = {
    	limit = { NOT = { ${rule(GKD, 'HISTORICAL')} } }
    	if = {
    		limit = { zin_aenor_council_dominant = yes }
    		multiply_variable = { zin_aenor_clock_pace = ${R.paceDominant} }
    	}
    	if = {
    		limit = { zin_aenor_council_faltering = yes }
    		multiply_variable = { zin_aenor_clock_pace = ${R.paceFaltering} }
    	}
    	if = {
    		limit = { has_idea = zin_aenor_kings_tasters }
    		multiply_variable = { zin_aenor_clock_pace = ${R.paceTasters} }
    	}
    }
    set_temp_variable = { zin_ct = zin_aenor_clock_pace }
    multiply_temp_variable = { zin_ct = ${R.clockStep} }
    subtract_from_variable = { zin_aenor_king_clock = zin_ct }
    clamp_variable = { var = zin_aenor_king_clock min = 0 }
    # The clock sets the Council's flag itself when the Worshipdom is gone, or under the historical rule.
    if = {
    	limit = {
    		check_variable = { zin_aenor_king_clock < 1 }
    		NOT = { has_global_flag = zin_afrit_regicide_ready }
    		NOT = { has_global_flag = zin_golden_king_plot_exposed }
    		NOT = { has_global_flag = zin_afrit_kingdom_behind_throne }
    		NOT = { ${rule(GKD, 'NO_AI_PLOT')} }
    		OR = {
    			NOT = { country_exists = ${HUB} }
    			${rule(GKD, 'HISTORICAL')}
    		}
    	}
    	zin_afrit_ready_regicide = yes
    	# B07.D5: with no Council left to strike, the King dies in his own time.
    	if = {
    		limit = {
    			NOT = { country_exists = ${HUB} }
    			NOT = { any_country = { has_character = zin_aurevan } }
    		}
    		set_global_flag = zin_golden_king_natural
    	}
    }
    if = {
    	limit = {
    		check_variable = { zin_aenor_king_clock < ${R.clockStep} }
    		zin_aenor_date_death_floor = yes
    		has_global_flag = zin_afrit_regicide_ready
    		NOT = { has_global_flag = zin_golden_king_plot_exposed }
    		NOT = { has_country_flag = zin_aenor_death_scheduled }
    	}
    	set_country_flag = zin_aenor_death_scheduled
    	set_temp_variable = { zin_feast_days = zin_aenor_king_clock }
    	subtract_from_temp_variable = { zin_feast_days = 1 }
    	clamp_temp_variable = { var = zin_feast_days min = 0 }
    	set_temp_variable = { zin_death_days = zin_aenor_king_clock }
    	clamp_temp_variable = { var = zin_death_days min = 1 }
    	country_event = { id = zin_reign.19 days = zin_feast_days }
    	news_event = { id = zin_aenor.200 days = zin_death_days }
    }`);

  effects.zin_aenor_hasten_death_clock = dedent(`
    ${takeArgs('days')}
    ${AEN} = {
    	if = {
    		limit = {
    			NOT = { ${rule(GKD, 'HISTORICAL')} }
    			zin_aenor_king_alive = yes
    			NOT = { has_global_flag = zin_golden_king_plot_exposed }
    		}
    		set_temp_variable = { zin_room = ${R.hastenCap} }
    		subtract_from_temp_variable = { zin_room = zin_aenor_clock_hastened }
    		if = {
    			limit = { check_variable = { zin_days > zin_room } }
    			set_temp_variable = { zin_days = zin_room }
    		}
    		add_to_variable = { zin_aenor_clock_hastened = zin_days }
    		subtract_from_variable = { zin_aenor_king_clock = zin_days }
    		clamp_variable = { var = zin_aenor_king_clock min = 0 }
    	}
    }`);
  effects.zin_aenor_delay_death_clock = dedent(`
    ${takeArgs('days')}
    ${AEN} = {
    	if = {
    		limit = {
    			NOT = { ${rule(GKD, 'HISTORICAL')} }
    			zin_aenor_king_alive = yes
    		}
    		add_to_variable = { zin_aenor_king_clock = zin_days }
    	}
    }`);
  effects.zin_aenor_check_royal_health = dedent(`
    # The only omen: with the royal physicians questioned, the King's health is told in words (zin_aenor.240 reads the variable).
    if = {
    	limit = { has_country_flag = zin_aenor_royal_physicians }
    	set_temp_variable = { zin_old_health = zin_aenor_king_health }
    	if = {
    		limit = { check_variable = { zin_aenor_king_clock > 365 } }
    		set_variable = { zin_aenor_king_health = 0 }
    	}
    	else_if = {
    		limit = { check_variable = { zin_aenor_king_clock > 180 } }
    		set_variable = { zin_aenor_king_health = 1 }
    	}
    	else = {
    		set_variable = { zin_aenor_king_health = 2 }
    	}
    	if = {
    		limit = { NOT = { check_variable = { zin_aenor_king_health = zin_old_health } } }
    		country_event = { id = zin_aenor.240 }
    	}
    }`);

  effects.zin_aenor_expose_plot = dedent(`
    # The only way the plot becomes known. Sets the one exposure flag, stops the clock, tells Aenor and the Council.
    # It names the Chancellor's circle and men in temple robes. It never names Afrit and never sets zin_afrit_revealed.
    if = {
    	limit = {
    		NOT = { has_global_flag = zin_golden_king_plot_exposed }
    		zin_aenor_king_alive = yes
    	}
    	set_global_flag = zin_golden_king_plot_exposed
    	${AEN} = {
    		country_event = { id = zin_aenor.250 }
    	}
    	zin_afrit_plot_exposed = yes
    }`);

  // ---------------------------------------------------------------------------------------------------- Lost Cause
  // A unit created in a state needs a province: the builder stores the first province of every Aenor state as the state variable
  // zin_aenor_first_province (zin_aenor.1). The template is created on first use, in whichever realm raises the unit.
  const musterTemplate = (name, regiments) => list(
    `if = {`, `limit = { NOT = { has_template = "${name}" } }`, 'division_template = {', `name = "${name}"`, `division_names_group = ${T.hostGroup}`, 'regiments = {',
    regiments.map(([u, x, y]) => `${u} = { x = ${x} y = ${y} }`), '}', '}', '}');
  const musterUnit = (name, state, count, xp) => list(
    'random_owned_state = {', `limit = { ${state} }`, 'save_event_target_as = zin_aenor_muster_state', '}',
    'if = {', 'limit = { has_event_target = zin_aenor_muster_state }',
    'set_temp_variable = { zin_prov = event_target:zin_aenor_muster_state.zin_aenor_first_province }',
    'meta_effect = {', 'text = {', 'create_unit = {',
    `division = "name = \\"${name}\\" division_template = \\"${name}\\" start_experience_factor = ${xp} start_equipment_factor = 1"`,
    'owner = THIS', 'prioritize_location = [P]', 'allow_spawning_on_enemy_provs = no', `count = ${count}`, '}', '}', 'P = "[?zin_prov|0]"', '}', '}',
    'clear_global_event_target = zin_aenor_muster_state');
  effects.zin_aenor_raise_frontier_company = list(
    '# One ranger brigade in a frontier state: a Lost Cause company (the decision pays 50 PP and 1,000 manpower).',
    musterTemplate('Frontier Company', [['zin_men_rangers', 0, 0], ['zin_men_rangers', 0, 1], ['zin_men_archers', 1, 0]]),
    musterUnit('Frontier Company', 'zin_is_site_aenor_marches = yes', 1, 0.5));
  effects.zin_aenor_raise_lost_cause_shield = dedent(`
    # The Shield of the Concord: Shield Charters open at once. The faction part waits for the succession (S3).
    set_global_flag = zin_lost_cause_shield
    if = {
    	limit = { zin_aenor_king_alive = yes }
    	set_country_flag = zin_aenor_shield_pending
    }
    else = {
    	zin_aenor_apply_shield = yes
    }`);
  effects.zin_aenor_apply_shield = dedent(`
    # Renames the Concord faction The Lost Cause and opens the invitation decision.
    clr_country_flag = zin_aenor_shield_pending
    if = {
    	limit = { is_faction_leader = yes }
    	set_faction_name = zin_faction_lost_cause
    }
    set_country_flag = zin_aenor_shield_open`);

  // ---------------------------------------------------------------------------------------------------- the succession
  effects.zin_aenor_compute_camps = dedent(`
    # Initial support of the four camps at the King's death (section 6).
    set_variable = { zin_aenor_camp_court = zin_court_corruption }
    multiply_variable = { zin_aenor_camp_court = 0.5 }
    if = {
    	limit = { has_idea = zin_aenor_gilded_parim }
    	add_to_variable = { zin_aenor_camp_court = 10 }
    }
    if = {
    	limit = { zin_aenor_court_honest = yes }
    	add_to_variable = { zin_aenor_camp_court = -10 }
    }
    set_variable = { zin_aenor_camp_faithful = zin_council_influence }
    multiply_variable = { zin_aenor_camp_faithful = 0.8 }
    if = {
    	limit = { ${le('zin_council_influence', R.brokenAt)} }
    	multiply_variable = { zin_aenor_camp_faithful = 0.5 }
    }
    set_variable = { zin_aenor_camp_dominions = 100 }
    subtract_from_variable = { zin_aenor_camp_dominions = zin_aenor_concord_avg }
    multiply_variable = { zin_aenor_camp_dominions = 0.6 }
    set_temp_variable = { zin_nd = 0 }
    every_subject_country = {
    	limit = {
    		zin_aenor_is_concord_dominion = yes
    		zin_aenor_dominion_defiant = yes
    	}
    	add_to_temp_variable = { zin_nd = 5 }
    }
    add_to_variable = { zin_aenor_camp_dominions = zin_nd }
    if = {
    	limit = { zin_aenor_host_available = yes }
    	set_variable = { zin_aenor_camp_host = zin_aenor_lost_cause }
    	multiply_variable = { zin_aenor_camp_host = 0.5 }
    	if = {
    		limit = { has_global_flag = zin_lost_cause_with_eindil }
    		add_to_variable = { zin_aenor_camp_host = 20 }
    	}
    }
    else = {
    	set_variable = { zin_aenor_camp_host = 0 }
    }
    # Start variety V3 (modules/start_variety.mjs): the drawn shift of each camp and Prince Eronel's standing (all zero when the rule is off).
    add_to_variable = { zin_aenor_camp_court = global.zin_sv_camp_court }
    add_to_variable = { zin_aenor_camp_faithful = global.zin_sv_camp_faithful }
    add_to_variable = { zin_aenor_camp_dominions = global.zin_sv_camp_dominions }
    if = {
    	limit = { zin_aenor_host_available = yes }
    	add_to_variable = { zin_aenor_camp_host = global.zin_sv_camp_host }
    }
    set_temp_variable = { zin_ef = zin_aenor_eronel_favour }
    multiply_temp_variable = { zin_ef = constant:zin_variety.eronel_favour_camp }
    add_to_variable = { zin_aenor_camp_court = zin_ef }
    clamp_variable = { var = zin_aenor_camp_court min = 0 max = 100 }
    clamp_variable = { var = zin_aenor_camp_faithful min = 0 max = 100 }
    clamp_variable = { var = zin_aenor_camp_dominions min = 0 max = 100 }
    clamp_variable = { var = zin_aenor_camp_host min = 0 max = 100 }
    zin_aenor_reset_popularities = yes`);

  effects.zin_aenor_reset_popularities = dedent(`
    # Party popularities follow the camps. While the secret holds, the Faithful and the Host share the Light party.
    set_temp_variable = { zin_pt = zin_aenor_camp_court }
    add_to_temp_variable = { zin_pt = zin_aenor_camp_faithful }
    add_to_temp_variable = { zin_pt = zin_aenor_camp_dominions }
    add_to_temp_variable = { zin_pt = zin_aenor_camp_host }
    if = {
    	limit = { check_variable = { zin_pt > 0 } }
    	set_temp_variable = { zin_pf = zin_aenor_camp_court }
    	multiply_temp_variable = { zin_pf = 100 }
    	divide_temp_variable = { zin_pf = zin_pt }
    	round_temp_variable = zin_pf
    	set_temp_variable = { zin_pn = zin_aenor_camp_dominions }
    	multiply_temp_variable = { zin_pn = 100 }
    	divide_temp_variable = { zin_pn = zin_pt }
    	round_temp_variable = zin_pn
    	if = {
    		limit = { has_global_flag = zin_afrit_revealed }
    		set_temp_variable = { zin_pc = zin_aenor_camp_faithful }
    		multiply_temp_variable = { zin_pc = 100 }
    		divide_temp_variable = { zin_pc = zin_pt }
    		round_temp_variable = zin_pc
    		set_temp_variable = { zin_pd = 100 }
    		subtract_from_temp_variable = { zin_pd = zin_pf }
    		subtract_from_temp_variable = { zin_pd = zin_pn }
    		subtract_from_temp_variable = { zin_pd = zin_pc }
    	}
    	else = {
    		set_temp_variable = { zin_pc = 0 }
    		set_temp_variable = { zin_pd = 100 }
    		subtract_from_temp_variable = { zin_pd = zin_pf }
    		subtract_from_temp_variable = { zin_pd = zin_pn }
    	}
    	meta_effect = {
    		text = {
    			set_popularities = {
    				democratic = [D]
    				fascism = [F]
    				communism = [C]
    				neutrality = [N]
    			}
    		}
    		D = "[?zin_pd|0]"
    		F = "[?zin_pf|0]"
    		C = "[?zin_pc|0]"
    		N = "[?zin_pn|0]"
    	}
    }`);

  effects.zin_aenor_add_camp_support = dedent(`
    ${takeArgs('camp', 'value')}
    ${D.camps.map((c, i) => `${i ? 'else_if' : 'if'} = {\n\tlimit = { check_variable = { zin_camp = ${c.code} } }\n\tadd_to_variable = { zin_aenor_camp_${c.key} = zin_value }\n\tclamp_variable = { var = zin_aenor_camp_${c.key} min = 0 max = 100 }\n}`).join('\n')}
    if = {
    	limit = { zin_aenor_king_alive = no }
    	zin_aenor_reset_popularities = yes
    }`);

  effects.zin_aenor_check_camps_rival = dedent(`
    # A camp that reaches the rival mark while it does not rule rises, at most once a year per camp (zin_aenor.216).
    if = {
    	limit = {
    		zin_aenor_king_alive = no
    		has_country_flag = zin_aenor_succession_open
    	}
    	${D.camps.filter(c => c.key !== 'dominions' || true).map(c => `if = {\n\tlimit = {\n\t\tcheck_variable = { zin_aenor_camp_${c.key} > ${R.campRival - 1} }\n\t\tNOT = { check_variable = { zin_aenor_ruling_camp = ${c.code} } }\n\t\tNOT = { has_country_flag = zin_aenor_rival_${c.key}_year }\n\t\tNOT = { has_capitulated = yes }\n\t\t${c.key === 'host' ? 'zin_aenor_host_available = yes' : 'always = yes'}\n\t}\n\tset_country_flag = { flag = zin_aenor_rival_${c.key}_year days = 365 }\n\tcountry_event = { id = zin_aenor.216 }\n\tset_temp_variable = { zin_arg_camp = ${c.code} }\n\tzin_aenor_raise_camp = yes\n}`).join('\n')}
    }`);

  effects.zin_aenor_open_succession = dedent(`
    # Body of zin_aenor.200 The King Is Dead. Scope: the Aenor realm (the original country).
    set_global_flag = zin_golden_king_dead
    set_country_flag = zin_aenor_succession_open
    retire_character = ${T.rulerId}
    add_ideas = zin_aenor_interregnum
    zin_aenor_compute_camps = yes
    set_country_flag = { flag = zin_aenor_thirty_days days = 30 }
    if = {
    	limit = { has_country_flag = zin_aenor_shield_pending }
    	zin_aenor_apply_shield = yes
    }
    every_subject_country = {
    	limit = {
    		zin_aenor_is_concord_dominion = yes
    		zin_aenor_dominion_defiant = yes
    	}
    	zin_aenor_secede_dominion = yes
    }
    zin_aenor_gather_free_dominions = yes
    zin_reign_on_king_dead = yes`);

  // Party names of the camps. Before the reveal the Faithful and the Host share the Light party.
  effects.zin_aenor_set_party_names = dedent(`
    set_party_name = {
    	ideology = fascism
    	long_name = zin_aenor_party_court_long
    	name = zin_aenor_party_court
    }
    set_party_name = {
    	ideology = neutrality
    	long_name = zin_aenor_party_dominions_long
    	name = zin_aenor_party_dominions
    }
    if = {
    	limit = { has_global_flag = zin_afrit_revealed }
    	set_party_name = {
    		ideology = communism
    		long_name = zin_aenor_party_faithful_revealed_long
    		name = zin_aenor_party_faithful_revealed
    	}
    	if = {
    		limit = { has_global_flag = zin_eindil_named }
    		set_party_name = {
    			ideology = democratic
    			long_name = zin_aenor_party_host_named_long
    			name = zin_aenor_party_host_named
    		}
    	}
    	else = {
    		set_party_name = {
    			ideology = democratic
    			long_name = zin_aenor_party_host_long
    			name = zin_aenor_party_host
    		}
    	}
    }
    else = {
    	set_party_name = {
    		ideology = democratic
    		long_name = zin_aenor_party_faithful_long
    		name = zin_aenor_party_faithful
    	}
    }`);

  // The seals are given (zin_aenor.210).
  effects.zin_aenor_give_seals = dedent(`
    # Body of zin_aenor.210 The Seals of Parim: the ruling camp takes the crown. Scope: the Aenor realm.
    remove_ideas = zin_aenor_interregnum
    zin_aenor_set_party_names = yes
    if = {
    	limit = { zin_aenor_ruled_by_faithful = yes }
    	add_to_variable = { zin_council_influence = 10 }
    	clamp_variable = { var = zin_council_influence min = 0 max = 100 }
    	set_country_flag = zin_aenor_faithful_rule
    	# The seals go to Afrit's seat (role R02, SL-11): the Worshipdom, or whoever employs the Deliverer when it is gone.
    	zin_afrit_resolve_seat = yes
    	if = {
    		limit = { has_event_target = zin_afrit_seat }
    		event_target:zin_afrit_seat = { country_event = { id = zin_afrit.20 } }
    	}
    	else = {
    		${setStance('zin_light_sanctuary')}
    		recruit_character = zin_merovan
    		promote_character = zin_merovan
    	}
    }
    else_if = {
    	limit = { zin_aenor_ruled_by_court = yes }
    	recruit_character = zin_aenor_golden_regency
    	promote_character = zin_aenor_golden_regency
    	${setStance('zin_dom_court')}
    	country_event = { id = zin_reign.50 }
    }
    else_if = {
    	limit = { zin_aenor_ruled_by_dominions = yes }
    	recruit_character = zin_aenor_concord_speaker
    	promote_character = zin_aenor_concord_speaker
    	${setStance('zin_wild_freeholds')}
    	set_temp_variable = { zin_arg_charter = 3 }
    	zin_aenor_set_charter_all = yes
    	set_temp_variable = { zin_arg_value = 15 }
    	zin_aenor_add_concord_loyalty_all = yes
    	country_event = { id = zin_reign.55 }
    }
    else_if = {
    	limit = { zin_aenor_ruled_by_host = yes }
    	zin_aenor_receive_eindil = yes
    	country_event = { id = zin_reign.60 }
    }
    zin_aenor_reset_popularities = yes`);

  effects.zin_aenor_choose_camp = dedent(`
    # The ruling camp is chosen in zin_aenor.201; the camp number is in zin_arg_camp. Scope: the Aenor realm.
    ${takeArgs('camp')}
    set_variable = { zin_aenor_ruling_camp = zin_camp }
    ${[['1', 'fascism'], ['2', 'democratic'], ['3', 'neutrality'], ['4', 'democratic']].map(([c, g], i) => `${i ? 'else_if' : 'if'} = {\n\tlimit = { check_variable = { zin_camp = ${c} } }\n\tset_politics = { ruling_party = ${g} }\n}`).join('\n')}
    if = {
    	limit = {
    		check_variable = { zin_camp = 2 }
    		has_global_flag = zin_afrit_revealed
    	}
    	set_politics = { ruling_party = communism }
    }
    zin_aenor_set_party_names = yes`);

  effects.zin_aenor_best_camp = dedent(`
    # The camp with the highest support (ties: Faithful, Court, Dominions, Host). Stores the camp number in zin_aenor_best.
    set_temp_variable = { zin_aenor_best = 2 }
    set_temp_variable = { zin_bv = zin_aenor_camp_faithful }
    if = {
    	limit = { check_variable = { zin_aenor_camp_court > zin_bv } }
    	set_temp_variable = { zin_aenor_best = 1 }
    	set_temp_variable = { zin_bv = zin_aenor_camp_court }
    }
    if = {
    	limit = { check_variable = { zin_aenor_camp_dominions > zin_bv } }
    	set_temp_variable = { zin_aenor_best = 3 }
    	set_temp_variable = { zin_bv = zin_aenor_camp_dominions }
    }
    if = {
    	limit = {
    		zin_aenor_host_available = yes
    		check_variable = { zin_aenor_camp_host > zin_bv }
    	}
    	set_temp_variable = { zin_aenor_best = 4 }
    }`);

  effects.zin_aenor_pick_ai_camp = dedent(`
    # The camp the AI follows at zin_aenor.201 (rule zin_rule_ai_aenor_succession). Stores the country variable zin_aenor_ai_camp.
    zin_aenor_best_camp = yes
    set_variable = { zin_aenor_ai_camp = zin_aenor_best }
    if = {
    	limit = { zin_rules_ai_branch_aenor_golden_court = yes }
    	set_variable = { zin_aenor_ai_camp = 1 }
    }
    else_if = {
    	limit = { zin_rules_ai_branch_aenor_free_dominions = yes }
    	set_variable = { zin_aenor_ai_camp = 3 }
    }
    else_if = {
    	limit = { zin_rules_ai_random_aenor = yes }
    	random_list = {
    		${D.camps.map(c => list('5 = {', c.key === 'host' ? 'modifier = {\nfactor = 0\nNOT = { zin_aenor_host_available = yes }\n}' : '',
      `modifier = {\nadd = 10\ncheck_variable = { zin_aenor_camp_${c.key} > 24 }\n}`, `modifier = {\nadd = 20\ncheck_variable = { zin_aenor_camp_${c.key} > 49 }\n}`,
      `set_variable = { zin_aenor_ai_camp = ${c.code} }`, '}')).join('\n')}
    	}
    }
    else_if = {
    	limit = { zin_rules_is_historical = yes }
    	set_variable = { zin_aenor_ai_camp = 2 }
    }`);

  effects.zin_aenor_resolve_risings = dedent(`
    # Day 30 of the succession: every other camp at the rising mark rises, the rest are silenced (zin_aenor.215). Scope: the Aenor realm.
    set_temp_variable = { zin_quiet = 0 }
    ${D.camps.map(c => list('if = {', 'limit = {', `NOT = { check_variable = { zin_aenor_ruling_camp = ${c.code} } }`, c.key === 'host' ? 'zin_aenor_host_available = yes' : '',
      `check_variable = { zin_aenor_camp_${c.key} > ${R.campRise - 1} }`, '}', `set_temp_variable = { zin_arg_camp = ${c.code} }`, 'zin_aenor_raise_camp = yes', '}',
      'else_if = {', 'limit = {', `NOT = { check_variable = { zin_aenor_ruling_camp = ${c.code} } }`, `check_variable = { zin_aenor_camp_${c.key} > 0 }`, '}', 'set_temp_variable = { zin_quiet = 1 }', '}')).join('\n')}
    if = {
    	limit = { check_variable = { zin_quiet = 1 } }
    	country_event = { id = zin_aenor.215 }
    }`);

  // ---------------------------------------------------------------------------------------------------- risings and civil wars
  const rebel = { 1: 'fascism', 4: 'democratic' };
  effects.zin_aenor_raise_camp = dedent(`
    # One camp rises (section 7). The camp number is in zin_arg_camp (court 1, faithful 2, dominions 3, host 4).
    ${takeArgs('camp')}
    save_event_target_as = zin_aenor_old_realm
    if = {
    	limit = { check_variable = { zin_camp = 3 } }
    	zin_aenor_free_dominions_rise = yes
    }
    else_if = {
    	limit = {
    		has_capitulated = no
    		NOT = { check_variable = { zin_aenor_ruling_camp = zin_camp } }
    	}
    	set_temp_variable = { zin_rb = 0 }
    	every_country = {
    		limit = {
    			zin_aenor_is_realm = yes
    			NOT = { tag = ${AEN} }
    		}
    		add_to_temp_variable = { zin_rb = 1 }
    	}
    	if = {
    		limit = { check_variable = { zin_rb < 3 } }
    		if = {
    			limit = { check_variable = { zin_camp = 1 } }
    			set_temp_variable = { zin_sz = zin_aenor_camp_court }
    			clamp_temp_variable = { var = zin_sz max = 45 }
    			zin_aenor_rise_court = yes
    		}
    		else_if = {
    			limit = { check_variable = { zin_camp = 2 } }
    			set_temp_variable = { zin_sz = zin_aenor_camp_faithful }
    			clamp_temp_variable = { var = zin_sz max = 50 }
    			zin_aenor_rise_faithful = yes
    		}
    		else_if = {
    			limit = {
    				check_variable = { zin_camp = 4 }
    				zin_aenor_host_available = yes
    			}
    			set_temp_variable = { zin_sz = zin_aenor_camp_host }
    			clamp_temp_variable = { var = zin_sz max = 45 }
    			zin_aenor_rise_host = yes
    		}
    	}
    	set_temp_variable = { zin_rb_after = 0 }
    	every_country = {
    		limit = {
    			zin_aenor_is_realm = yes
    			NOT = { tag = ${AEN} }
    		}
    		add_to_temp_variable = { zin_rb_after = 1 }
    	}
    	if = {
    		limit = { check_variable = { zin_rb_after > zin_rb } }
    		if = {
    			limit = { check_variable = { zin_camp = 1 } }
    			news_event = { id = zin_aenor.211 }
    		}
    		else_if = {
    			limit = { check_variable = { zin_camp = 2 } }
    			news_event = { id = zin_aenor.212 }
    		}
    		else_if = {
    			limit = { check_variable = { zin_camp = 4 } }
    			news_event = { id = zin_aenor.213 }
    		}
    	}
    }`);

  // start_civil_war needs literal ideologies; the government keeps its own party (ruling_party), including when both sides share an ideology.
  const lean = { 1: 'court', 2: 'temple', 4: 'march' }, campFlag = { 1: 'court', 2: 'faithful', 4: 'host' };
  const civil = (rebelIdeology, camp, extra = '') => list(
    `set_temp_variable = { zin_rc = ${camp} }`, 'divide_temp_variable = { zin_sz = 100 }',
    ['democratic', 'fascism', 'communism', 'neutrality'].map((gov, i) => list(
      `${i ? 'else_if' : 'if'} = {`, `limit = { has_government = ${gov} }`,
      'meta_effect = {', 'text = {', 'start_civil_war = {', `ideology = ${rebelIdeology}`, `ruling_party = ${gov}`, 'size = [SIZE]',
      'states_filter = {', `has_state_flag = zin_aenor_lean_${lean[camp]}`, 'NOT = { zin_is_site_parim = yes }', '}',
      'keep_unit_leaders_trigger = {', `NOT = { has_character_flag = zin_aenor_camp_${campFlag[camp]} }`, '}',
      'zin_aenor_breakaway_setup = yes', '}', '}', 'SIZE = "[?zin_sz|.2]"', '}', '}')),
    extra);
  effects.zin_aenor_rise_court = civil('fascism', 1, 'zin_aenor_fill_breakaway = yes');
  effects.zin_aenor_rise_host = civil('democratic', 4, 'zin_aenor_fill_breakaway = yes');
  effects.zin_aenor_rise_faithful = dedent(`
    if = {
    	limit = { has_global_flag = zin_afrit_revealed }
    	${civil('communism', 2, 'zin_aenor_fill_breakaway = yes').replace(/\n/g, '\n\t')}
    }
    else = {
    	${civil('democratic', 2, 'zin_aenor_fill_breakaway = yes').replace(/\n/g, '\n\t')}
    }`);

  effects.zin_aenor_breakaway_setup = dedent(`
    # Runs in the scope of the new country, inside start_civil_war. The old realm is event_target:zin_aenor_old_realm.
    save_global_event_target_as = zin_aenor_new_realm
    set_variable = { zin_aenor_ruling_camp = zin_rc }
    set_variable = { zin_aenor_camp_court = event_target:zin_aenor_old_realm.zin_aenor_camp_court }
    set_variable = { zin_aenor_camp_faithful = event_target:zin_aenor_old_realm.zin_aenor_camp_faithful }
    set_variable = { zin_aenor_camp_dominions = event_target:zin_aenor_old_realm.zin_aenor_camp_dominions }
    set_variable = { zin_aenor_camp_host = event_target:zin_aenor_old_realm.zin_aenor_camp_host }
    set_variable = { zin_court_corruption = event_target:zin_aenor_old_realm.zin_court_corruption }
    set_variable = { zin_council_influence = event_target:zin_aenor_old_realm.zin_council_influence }
    set_variable = { zin_aenor_lost_cause = event_target:zin_aenor_old_realm.zin_aenor_lost_cause }
    set_variable = { zin_aenor_concord_avg = event_target:zin_aenor_old_realm.zin_aenor_concord_avg }
    set_country_flag = zin_aenor_breakaway
    set_country_flag = zin_aenor_succession_open
    if = {
    	limit = { check_variable = { zin_rc = 1 } }
    	set_cosmetic_tag = zin_cosmetic_aenor_court
    	set_country_flag = zin_aenor_breakaway_court
    }
    else_if = {
    	limit = { check_variable = { zin_rc = 2 } }
    	set_cosmetic_tag = zin_cosmetic_aenor_faithful
    	set_country_flag = zin_aenor_breakaway_faithful
    }
    else = {
    	set_cosmetic_tag = zin_cosmetic_aenor_host
    	set_country_flag = zin_aenor_breakaway_host
    }
    add_dynamic_modifier = { modifier = zin_aenor_golden_court }
    add_dynamic_modifier = { modifier = zin_aenor_temple_favour }
    zin_aenor_set_party_names = yes
    # The first civil war ends the long peace of the institutions.
    event_target:zin_aenor_old_realm = { remove_ideas = zin_aenor_seventeen_centuries }
    # Rival breakaways go for each other's throats.
    every_country = {
    	limit = {
    		zin_aenor_is_realm = yes
    		has_country_flag = zin_aenor_breakaway
    		NOT = { tag = PREV }
    		NOT = { has_war_with = PREV }
    	}
    	PREV = { declare_war_on = { target = PREV type = annex_everything } }
    }`);

  effects.zin_aenor_fill_breakaway = dedent(`
    # The states with the camp's leaning go with the breakaway; neighbours follow until its share of the realm is met.
    if = {
    	limit = { has_event_target = zin_aenor_new_realm }
    	set_temp_variable = { zin_want = num_owned_states }
    	event_target:zin_aenor_new_realm = { set_temp_variable = { zin_have = num_owned_states } }
    	add_to_temp_variable = { zin_want = zin_have }
    	multiply_temp_variable = { zin_want = zin_sz }
    	round_temp_variable = zin_want
    	set_temp_variable = { zin_loops = 0 }
    	while_loop_effect = {
    		limit = {
    			check_variable = { zin_have < zin_want }
    			check_variable = { zin_loops < 8 }
    		}
    		add_to_temp_variable = { zin_loops = 1 }
    		random_owned_state = {
    			limit = {
    				NOT = { zin_is_site_parim = yes }
    				is_capital = no
    				any_neighbor_state = { is_owned_by = event_target:zin_aenor_new_realm }
    			}
    			transfer_state_to = event_target:zin_aenor_new_realm
    		}
    		add_to_temp_variable = { zin_have = 1 }
    	}
    }`);

  effects.zin_aenor_free_dominions_rise = dedent(`
    # The Dominions camp is no civil war: every Restless and Defiant dominion secedes and joins The Free Dominions.
    every_subject_country = {
    	limit = {
    		zin_aenor_is_concord_dominion = yes
    		OR = {
    			zin_aenor_dominion_restless = yes
    			zin_aenor_dominion_defiant = yes
    		}
    	}
    	zin_aenor_secede_dominion = yes
    }
    zin_aenor_gather_free_dominions = yes
    news_event = { id = zin_aenor.214 }`);

  effects.zin_aenor_secede_dominion = dedent(`
    # A dominion breaks its charter (section 7). Scope: the dominion.
    save_event_target_as = zin_aenor_seceder
    OVERLORD = { save_event_target_as = zin_aenor_old_realm }
    event_target:zin_aenor_old_realm = { end_puppet = event_target:zin_aenor_seceder }
    if = {
    	limit = { is_in_faction = yes }
    	remove_from_faction = THIS
    }
    set_country_flag = zin_aenor_free_dominion
    remove_ideas = { ${charterIdeas.join(' ')} zin_shared_concord_dominions_charter_loyalists_spirit }
    add_ideas = zin_aenor_free_dominion
    country_event = { id = zin_aenor.220 }
    country_event = { id = zin_reign.37 }
    event_target:zin_aenor_old_realm = { country_event = { id = zin_aenor.220 } }`);

  effects.zin_aenor_gather_free_dominions = dedent(`
    # Every free dominion joins The Free Dominions; the largest of them founds it if it does not exist yet.
    if = {
    	limit = { NOT = { any_country = { has_country_flag = zin_aenor_free_dominion is_faction_leader = yes } } }
    	set_temp_variable = { zin_mx = 0 }
    	every_country = {
    		limit = {
    			has_country_flag = zin_aenor_free_dominion
    			is_in_faction = no
    		}
    		if = {
    			limit = { check_variable = { num_owned_states > zin_mx } }
    			set_temp_variable = { zin_mx = num_owned_states }
    			save_event_target_as = zin_aenor_free_leader
    		}
    	}
    	if = {
    		limit = { has_event_target = zin_aenor_free_leader }
    		event_target:zin_aenor_free_leader = { create_faction_from_template = zin_faction_free_dominions }
    	}
    }
    random_country = {
    	limit = {
    		has_country_flag = zin_aenor_free_dominion
    		is_faction_leader = yes
    	}
    	save_global_event_target_as = zin_aenor_free_leader
    }
    if = {
    	limit = { has_event_target = zin_aenor_free_leader }
    	every_country = {
    		limit = {
    			has_country_flag = zin_aenor_free_dominion
    			is_in_faction = no
    		}
    		event_target:zin_aenor_free_leader = { add_to_faction = PREV }
    	}
    }`);

  effects.zin_aenor_rejoin_dominion = dedent(`
    # A free dominion takes a Free Charter and returns to the Concord (zin_aenor.110, .402). Scope: the dominion; the realm is event_target:zin_aenor_rejoin_realm.
    if = {
    	limit = { is_in_faction = yes }
    	remove_from_faction = THIS
    }
    clr_country_flag = zin_aenor_free_dominion
    remove_ideas = zin_aenor_free_dominion
    save_event_target_as = zin_aenor_rejoiner
    event_target:zin_aenor_rejoin_realm = {
    	puppet = event_target:zin_aenor_rejoiner
    	set_autonomy = {
    		target = event_target:zin_aenor_rejoiner
    		autonomy_state = zin_autonomy_chartered_dominion
    	}
    }
    set_variable = { zin_concord_loyalty = 60 }
    set_temp_variable = { zin_arg_charter = 3 }
    zin_aenor_set_charter = yes
    event_target:zin_aenor_rejoin_realm = {
    	if = {
    		limit = { is_faction_leader = yes }
    		add_to_faction = event_target:zin_aenor_rejoiner
    	}
    }`);

  effects.zin_aenor_invite_free_dominions = dedent(`
    # Letters to the Free Dominions: rejoin under a Free Charter, or stay free.
    save_global_event_target_as = zin_aenor_rejoin_realm
    every_country = {
    	limit = { has_country_flag = zin_aenor_free_dominion }
    	country_event = { id = zin_aenor.110 }
    }`);
  effects.zin_aenor_convene_concord_council = 'country_event = { id = zin_aenor.100 }';
  effects.zin_aenor_raise_golden_guard = list(
    '# Two guard divisions in Parim.',
    musterTemplate('Golden Guard', [['zin_men_heavy_infantry', 0, 0], ['zin_men_heavy_infantry', 0, 1], ['zin_men_heavy_infantry', 1, 0], ['zin_men_archers', 1, 1]]),
    musterUnit('Golden Guard', 'zin_is_site_parim = yes', 2, 0.6));
  effects.zin_aenor_wargoal_on_parim_holder = dedent(`
    # A war goal against whoever controls Parim, unless it is an ally or a realm of Aenor. Scope: the Aenor realm.
    save_global_event_target_as = zin_aenor_wg_self
    clear_global_event_target = zin_aenor_wg_target
    every_state = {
    	limit = { zin_is_site_parim = yes }
    	controller = {
    		if = {
    			limit = {
    				NOT = { zin_aenor_is_realm = yes }
    				NOT = { is_in_faction_with = event_target:zin_aenor_wg_self }
    			}
    			save_global_event_target_as = zin_aenor_wg_target
    		}
    	}
    }
    if = {
    	limit = { has_event_target = zin_aenor_wg_target }
    	create_wargoal = {
    		type = annex_everything
    		target = event_target:zin_aenor_wg_target
    	}
    }`);

  effects.zin_aenor_follow_coin_roll = dedent(`
    # Step 2 of the King's Health: 30% + (50 - council)% + the inquiry bonus, less 15% while the Council watches the Lost Cause.
    # Success sets zin_aenor_poisoner_found and costs the Council veil (zin_aenor.241 reports it).
    set_temp_variable = { zin_ch = 50 }
    subtract_from_temp_variable = { zin_ch = zin_council_influence }
    add_to_temp_variable = { zin_ch = 30 }
    add_to_temp_variable = { zin_ch = zin_aenor_inquiry_bonus }
    if = {
    	limit = { has_global_flag = zin_afrit_lost_cause_watched }
    	add_to_temp_variable = { zin_ch = -15 }
    }
    clamp_temp_variable = { var = zin_ch min = 0 max = 100 }
    meta_effect = {
    	text = {
    		random = {
    			chance = [C]
    			set_country_flag = zin_aenor_poisoner_found
    		}
    	}
    	C = "[?zin_ch|0]"
    }
    if = {
    	limit = { has_country_flag = zin_aenor_poisoner_found }
    	set_temp_variable = { zin_arg_value = -10 }
    	zin_afrit_add_veil = yes
    }`);
  // Step 3: the King believes if corruption is below 60, otherwise half the time (called by the option "Show the King" of zin_aenor.242).
  effects.zin_aenor_proof_shown = dedent(`
    if = {
    	limit = { check_variable = { zin_court_corruption < 60 } }
    	zin_aenor_expose_plot = yes
    }
    else = {
    	random = {
    		chance = 50
    		zin_aenor_expose_plot = yes
    	}
    }`);

  // ---------------------------------------------------------------------------------------------------- Eindil and the crown
  effects.zin_aenor_people_choose = dedent(`
    # The crown is offered (journey zin_eindil.130): sets the flag and fires zin_aenor.400 after 7 days.
    set_country_flag = zin_aenor_people_chose
    country_event = { id = zin_aenor.400 days = 7 }`);

  effects.zin_aenor_receive_eindil = dedent(`
    # Eindil leaves his host and leads this realm as the Hailed King.
    zin_eindil_set_host = yes
    recruit_character = zin_eindil
    add_country_leader_role = {
    	character = zin_eindil
    	promote_leader = yes
    	country_leader = {
    		ideology = zin_light_wardens
    		expire = "2000.1.1.1"
    	}
    }
    add_ideas = zin_aenor_hailed_king
    set_country_flag = zin_aenor_hailed_king
    set_variable = { zin_aenor_ruling_camp = 4 }
    zin_aenor_set_party_names = yes`);
  effects.zin_aenor_regency_while_king_lost = dedent(`
    # The Captains' Regency leads while Eindil is lost after the cliff.
    set_variable = { zin_aenor_ruling_camp_before_loss = zin_aenor_ruling_camp }
    set_variable = { zin_aenor_ruling_camp = 5 }
    recruit_character = zin_aenor_captains_regency
    promote_character = zin_aenor_captains_regency
    country_event = { id = zin_aenor.330 }`);
  effects.zin_aenor_exile_king = dedent(`
    # SL-25: the original Aenor is annexed or capitulates while the Golden King lives. He goes into exile (zin_golden_king_exiled, set
    # once) and every country hears zin_aenor.470; a conquered court no longer counts as the Golden Court enduring.
    if = {
    	limit = {
    		zin_aenor_king_alive = yes
    		NOT = { has_global_flag = zin_golden_king_exiled }
    	}
    	set_global_flag = zin_golden_king_exiled
    	news_event = { id = zin_aenor.470 }
    }`);
  effects.zin_aenor_restore_hailed_king = dedent(`
    # Eindil leads again after his recovery.
    set_variable = { zin_aenor_ruling_camp = 4 }
    promote_character = zin_eindil
    country_event = { id = zin_aenor.331 }`);
  effects.zin_aenor_crown_eindil = dedent(`
    # The coronation (section 8). Scope: the crowning realm.
    zin_aenor_receive_eindil = yes
    set_global_flag = zin_eindil_crowned
    news_event = { id = zin_aenor.401 }
    set_country_flag = zin_aenor_eindil_crowned_here
    zin_eindil = { set_character_name = zin_aenor_eindil_king_name }
    ${setStance('zin_light_wardens')}
    remove_ideas = { zin_aenor_interregnum zin_aenor_hailed_king zin_aenor_throne_abandoned }
    clr_country_flag = zin_aenor_hailed_king
    # Crowned while Afrit lives but is reduced (SL-09): the false god is beyond the Rift, out of the age's reckoning (owner question Q1).
    if = {
    	limit = { NOT = { has_global_flag = zin_afrit_dead } }
    	set_global_flag = zin_afrit_beyond_the_rift
    }
    remove_dynamic_modifier = { modifier = zin_aenor_golden_court }
    add_ideas = zin_aenor_rightful_king
    # A Charter of Equals goes to every Concord dominion, every Free Dominion and Selen.
    save_global_event_target_as = zin_aenor_rejoin_realm
    every_country = {
    	limit = {
    		OR = {
    			zin_aenor_is_concord_dominion = yes
    			has_country_flag = zin_aenor_free_dominion
    			tag = ${T.selen}
    		}
    	}
    	country_event = { id = zin_aenor.402 }
    }
    zin_world_check_endings = yes`);

  return { triggers, effects };
}
