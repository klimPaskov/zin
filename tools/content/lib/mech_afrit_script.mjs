// Scripted triggers and effects of Afrit and the Hidden Council (docs/specs/04_mechanics/afrit_hidden_council.md).
// afritScripts(D, T) returns { triggers, effects, tooltips } as { name: body } objects plus the mask-safe tooltip texts.
// Every effect hides its work while the secret holds and shows one mask-safe tooltip (text secrecy rule 3).
import { dedent, list, num, call, takeArgs, dateTrigger } from './mech_court_lib.mjs';
import { setStance } from './mech_aenor_script.mjs';

const rule = (r, o) => `has_game_rule = { rule = ${r} option = ${o} }`;
const ge = (v, n) => `check_variable = { var = ${v} value = ${n} compare = greater_than_or_equals }`;

export function afritScripts(D, T) {
  const HUB = T.hub, AEN = T.aenor;
  const triggers = {}, effects = {}, tooltips = {};
  const tt = (key, text) => { tooltips[key] = text; return `custom_effect_tooltip = ${key}`; };
  const hidden = (...body) => `hidden_effect = {\n${list(body)}\n}`;
  const seatVar = s => `global.zin_afrit_seat_${s}`;
  const seats = Object.keys(D.seatCodes), arts = D.artifacts;

  // ---------------------------------------------------------------------------------------------- triggers
  triggers.zin_afrit_is_hub = `original_tag = ${HUB}`;
  triggers.zin_afrit_rules_here = 'has_country_leader = { character = zin_aurevan }';
  triggers.zin_afrit_secret_kept = 'NOT = { has_global_flag = zin_afrit_revealed }';
  triggers.zin_afrit_can_deepen_foothold = dedent(`
    # Scope: the target country.
    NOT = { zin_afrit_is_hub = yes }
    NOT = { has_country_flag = zin_afrit_houses_purged }
    NOT = { has_war_with = ${HUB} }
    check_variable = { zin_afrit_cap > 0 }
    NOT = { check_variable = { zin_footholds = zin_afrit_cap } }
    NOT = { check_variable = { zin_footholds > zin_afrit_cap } }`);
  triggers.zin_afrit_eastern_candidate = dedent(`
    has_country_flag = zin_region_east_lands
    OR = {
    	${ge('zin_footholds', 4)}
    	AND = {
    		${ge('zin_footholds', 3)}
    		has_country_flag = zin_east_pledged
    	}
    }
    NOT = { has_war_with = ${HUB} }
    NOT = { zin_afrit_is_hub = yes }
    NOT = {
    	AND = {
    		is_subject = yes
    		OVERLORD = {
    			OR = {
    				zin_aenor_is_realm = yes
    				tag = ${T.volgan}
    			}
    		}
    	}
    }`);
  triggers.zin_afrit_holds_parim = dedent(`
    any_country = {
    	OR = {
    		zin_afrit_rules_here = yes
    		zin_afrit_is_hub = yes
    		AND = {
    			is_subject = yes
    			OVERLORD = { zin_afrit_is_hub = yes }
    		}
    	}
    	any_controlled_state = { zin_is_site_parim = yes }
    }`);
  triggers.zin_afrit_ashen_throne_ready = dedent(`
    NOT = { has_global_flag = zin_afrit_dead }
    NOT = { has_global_flag = zin_eindil_crowned }
    NOT = { has_global_flag = zin_afrit_lost_necklace }
    zin_afrit_holds_parim = yes
    ${ge('global.zin_afrit_deep_count', 12)}
    OR = {
    	AND = {
    		has_global_flag = zin_afrit_palace_held
    		zin_afrit_date_ashen_a = yes
    	}
    	AND = {
    		has_global_flag = zin_afrit_claims_erdae
    		zin_afrit_date_ashen_b = yes
    	}
    	AND = {
    		has_global_flag = zin_afrit_stand_in_parim
    		has_global_flag = zin_war_of_last_crowns
    		zin_afrit_date_ashen_b = yes
    	}
    }`);
  triggers.zin_afrit_can_close_houses = dedent(`
    # Scope: a country other than the hub. Available once it is suspicious, or the name is out, or the Veil has thinned and it is a Light court.
    NOT = { zin_afrit_is_hub = yes }
    NOT = { zin_afrit_rules_here = yes }
    check_variable = { zin_footholds > 0 }
    OR = {
    	has_country_flag = zin_afrit_suspicious
    	has_global_flag = zin_afrit_revealed
    	AND = {
    		check_variable = { global.zin_afrit_veil < ${D.veil.thinsAt} }
    		has_government = democratic
    	}
    }`);
  const dates = { regicideFallback: 'zin_afrit_date_regicide_fallback', flight: 'zin_afrit_date_flight', returnOpen: 'zin_afrit_date_return_open', return: 'zin_afrit_date_return', parim: 'zin_afrit_date_parim', ashenA: 'zin_afrit_date_ashen_a', ashenB: 'zin_afrit_date_ashen_b' };
  triggers.__dates = Object.entries(dates).map(([k, n]) => dateTrigger(n, D.dates[k], `${n}: ${D.dates[k]} at the standard pace, shifted by zin_story_pace`)).join('\n');

  // ---------------------------------------------------------------------------------------------- footholds and the Houses
  effects.zin_afrit_compute_cap = dedent(`
    # Stores the country variable zin_afrit_cap: how deep the network can go in this country (section "Caps"). Scope: the target.
    set_temp_variable = { zin_cap_t = ${D.caps.base} }
    if = {
    	limit = {
    		OR = {
    			${D.capZeroTags.map(t => `tag = ${t}`).join('\n')}
    			has_country_flag = zin_people_the_dead
    		}
    	}
    	set_temp_variable = { zin_cap_t = 0 }
    }
    else_if = {
    	limit = {
    		OR = {
    			has_country_flag = zin_people_elves
    			has_country_flag = zin_people_sun_elves
    		}
    	}
    	set_temp_variable = { zin_cap_t = ${D.caps.elves} }
    }
    else_if = {
    	limit = { zin_aenor_is_realm = yes }
    	set_temp_variable = { zin_cap_t = ${D.caps.aenor} }
    }
    else = {
    	if = {
    		limit = { ${HUB} = { has_country_flag = zin_worshipdom_cap4 } }
    		set_temp_variable = { zin_cap_t = 4 }
    	}
    	if = {
    		limit = { ${HUB} = { has_country_flag = zin_worshipdom_cap5 } }
    		set_temp_variable = { zin_cap_t = 5 }
    	}
    	if = {
    		limit = {
    			has_country_flag = zin_region_east_lands
    			${HUB} = { has_country_flag = zin_worshipdom_eastern_chapter }
    		}
    		add_to_temp_variable = { zin_cap_t = 1 }
    	}
    	if = {
    		limit = {
    			has_country_flag = zin_region_east_lands
    			${HUB} = { has_country_flag = zin_worshipdom_eastern_reserve }
    		}
    		set_temp_variable = { zin_cap_t = 5 }
    	}
    	clamp_temp_variable = { var = zin_cap_t max = 5 }
    }
    set_variable = { zin_afrit_cap = zin_cap_t }`);

  effects.zin_afrit_refresh_houses = dedent(`
    # The dynamic modifier "Houses of the First Light" follows the depth. Scope: the target.
    set_variable = { zin_afrit_dm_stab = 0 }
    set_variable = { zin_afrit_dm_pp_gain = 0 }
    ${D.houses.stability.map((s, i) => `if = {\n\tlimit = { check_variable = { zin_footholds = ${i} } }\n\tset_variable = { zin_afrit_dm_stab = ${s} }\n\tset_variable = { zin_afrit_dm_pp_gain = ${D.houses.politicalPower[i]} }\n}`).join('\n')}
    set_variable = { zin_afrit_open_cost = zin_footholds }
    multiply_variable = { zin_afrit_open_cost = ${D.houseCost.perLevel} }
    add_to_variable = { zin_afrit_open_cost = ${D.houseCost.base} }
    if = {
    	limit = { check_variable = { zin_footholds > 0 } }
    	if = {
    		limit = { NOT = { has_dynamic_modifier = { modifier = zin_afrit_houses } } }
    		add_dynamic_modifier = { modifier = zin_afrit_houses }
    	}
    	force_update_dynamic_modifier = yes
    }
    else = {
    	if = {
    		limit = { has_dynamic_modifier = { modifier = zin_afrit_houses } }
    		remove_dynamic_modifier = { modifier = zin_afrit_houses }
    	}
    }`);

  effects.zin_afrit_add_footholds = dedent(`
    ${takeArgs('value')}
    ${hidden(
      'zin_afrit_compute_cap = yes',
      'add_to_variable = { zin_footholds = zin_value }',
      'clamp_variable = { var = zin_footholds min = 0 }',
      'if = {', 'limit = { check_variable = { zin_footholds > zin_afrit_cap } }', 'set_variable = { zin_footholds = zin_afrit_cap }', '}',
      'zin_afrit_refresh_houses = yes')}
    ${tt('zin_afrit_tt_houses', 'The Houses of the First Light tend to their work.')}`);

  effects.zin_afrit_spread_footholds = dedent(`
    # Raises up to zin_arg_count countries of a region (zin_arg_region, 0 = any) whose footholds are at least zin_arg_min and below zin_arg_below.
    ${takeArgs('region', 'value', 'count', 'min', 'below')}
    ${hidden(
      'if = {', 'limit = { check_variable = { zin_below < 1 } }', 'set_temp_variable = { zin_below = 6 }', '}',
      'set_temp_variable = { zin_sp_i = 0 }',
      'while_loop_effect = {', 'limit = { check_variable = { zin_sp_i < zin_count } }', 'add_to_temp_variable = { zin_sp_i = 1 }',
      'set_temp_variable = { zin_sp_best = -1 }', 'clear_global_event_target = zin_afrit_spread_pick',
      'every_country = {',
      'limit = {', 'zin_afrit_can_deepen_foothold = yes', 'NOT = { has_country_flag = zin_afrit_spread_mark }', 'check_variable = { var = zin_footholds value = zin_min compare = greater_than_or_equals }', 'check_variable = { zin_footholds < zin_below }',
      'OR = {', 'check_variable = { zin_region = 0 }',
      ...Object.entries(D.regionCodes).map(([k, c]) => `AND = {\ncheck_variable = { zin_region = ${c} }\nhas_country_flag = zin_region_${k}\n}`), '}', '}',
      'if = {', 'limit = { check_variable = { zin_footholds > zin_sp_best } }', 'set_temp_variable = { zin_sp_best = zin_footholds }', 'save_global_event_target_as = zin_afrit_spread_pick', '}', '}',
      'if = {', 'limit = { has_event_target = zin_afrit_spread_pick }',
      'event_target:zin_afrit_spread_pick = {', 'set_country_flag = zin_afrit_spread_mark', 'set_temp_variable = { zin_arg_value = zin_value }', 'zin_afrit_add_footholds = yes', '}', '}',
      'else = {', 'set_temp_variable = { zin_sp_i = zin_count }', '}', '}',
      'every_country = {', 'limit = { has_country_flag = zin_afrit_spread_mark }', 'clr_country_flag = zin_afrit_spread_mark', '}')}
    ${tt('zin_afrit_tt_houses', 'The Houses of the First Light tend to their work.')}`);

  const w = D.watch;
  effects.zin_afrit_compute_watch = dedent(`
    # Sets the temporary variable zin_afrit_watch, 0 to 8: how closely this court watches the pilgrims. Scope: the target.
    set_temp_variable = { zin_afrit_watch = ${w.base} }
    if = {
    	limit = {
    		has_government = democratic
    		NOT = { zin_afrit_is_hub = yes }
    		NOT = { zin_afrit_rules_here = yes }
    	}
    	add_to_temp_variable = { zin_afrit_watch = ${w.light} }
    }
    if = {
    	limit = {
    		OR = {
    			tag = ${T.selen}
    			tag = ${T.mirolon}
    		}
    	}
    	add_to_temp_variable = { zin_afrit_watch = ${w.selenOrMirolon} }
    }
    if = {
    	limit = {
    		OR = {
    			has_country_flag = zin_people_elves
    			has_country_flag = zin_people_sun_elves
    		}
    	}
    	add_to_temp_variable = { zin_afrit_watch = ${w.elves} }
    }
    if = {
    	limit = { has_country_flag = zin_lost_cause_member }
    	add_to_temp_variable = { zin_afrit_watch = ${w.lostCause} }
    }
    if = {
    	limit = { has_country_flag = zin_afrit_suspicious }
    	add_to_temp_variable = { zin_afrit_watch = ${w.suspicious} }
    }
    if = {
    	limit = { has_government = neutrality }
    	add_to_temp_variable = { zin_afrit_watch = ${w.wild} }
    }
    if = {
    	limit = { ${ge('zin_footholds', 3)} }
    	add_to_temp_variable = { zin_afrit_watch = ${w.deep} }
    }
    clamp_temp_variable = { var = zin_afrit_watch min = 0 max = 8 }`);

  // Open a House resolves 60 days after the decision (remove_effect). Scope: the target; the hub is event_target:zin_afrit_hub.
  const hc = D.houseCost;
  effects.zin_afrit_open_house_resolve = dedent(`
    save_global_event_target_as = zin_afrit_hub_target
    zin_afrit_compute_watch = yes
    set_temp_variable = { zin_ch = zin_afrit_watch }
    multiply_temp_variable = { zin_ch = -${hc.chancePerWatch} }
    add_to_temp_variable = { zin_ch = ${hc.chanceBase} }
    set_temp_variable = { zin_wh = global.zin_afrit_seat_whispers }
    multiply_temp_variable = { zin_wh = ${hc.chancePerWhispers} }
    add_to_temp_variable = { zin_ch = zin_wh }
    clamp_temp_variable = { var = zin_ch min = 10 max = 95 }
    set_temp_variable = { zin_ok = 0 }
    meta_effect = {
    	text = {
    		random = {
    			chance = [C]
    			set_temp_variable = { zin_ok = 1 }
    		}
    	}
    	C = "[?zin_ch|0]"
    }
    set_temp_variable = { zin_half = zin_afrit_watch }
    divide_temp_variable = { zin_half = 2 }
    round_temp_variable = zin_half
    if = {
    	limit = { check_variable = { zin_ok = 1 } }
    	set_temp_variable = { zin_arg_value = 1 }
    	zin_afrit_add_footholds = yes
    	set_temp_variable = { zin_arg_value = zin_half }
    	multiply_temp_variable = { zin_arg_value = -1 }
    	zin_afrit_add_veil = yes
    	event_target:zin_afrit_hub = { country_event = { id = zin_afrit.3 } }
    }
    else = {
    	set_country_flag = { flag = zin_afrit_suspicious days = ${hc.suspiciousDays} }
    	set_temp_variable = { zin_arg_value = zin_afrit_watch }
    	add_to_temp_variable = { zin_arg_value = 2 }
    	multiply_temp_variable = { zin_arg_value = -1 }
    	zin_afrit_add_veil = yes
    	event_target:zin_afrit_hub = { country_event = { id = zin_afrit.4 } }
    }`);

  effects.zin_afrit_purge_houses = dedent(`
    # Close the Houses: footholds to 0 (or down one, never below 2, if the hub has fortified them). Scope: the target.
    ${hidden(
      'if = {', `limit = { ${HUB} = { has_country_flag = zin_worshipdom_houses_fortified } check_variable = { zin_footholds > 2 } }`, 'add_to_variable = { zin_footholds = -1 }', '}',
      'else_if = {', `limit = { NOT = { ${HUB} = { has_country_flag = zin_worshipdom_houses_fortified } } }`, 'set_variable = { zin_footholds = 0 }', '}',
      'add_stability = -0.05', `set_country_flag = { flag = zin_afrit_houses_purged days = 365 }`, 'zin_afrit_refresh_houses = yes',
      'if = {', 'limit = { zin_afrit_secret_kept = yes }', 'set_temp_variable = { zin_arg_value = -5 }', 'zin_afrit_add_veil = yes', '}',
      'save_global_event_target_as = zin_afrit_hub_target', `${HUB} = { country_event = { id = zin_afrit.5 } }`)}
    ${tt('zin_afrit_tt_closed', 'The doors of the Houses are shut.')}`);

  // ---------------------------------------------------------------------------------------------- the Veil and the plot
  effects.zin_afrit_add_veil = dedent(`
    ${takeArgs('value')}
    if = {
    	limit = { zin_afrit_secret_kept = yes }
    	${hidden(
      'if = {', `limit = { check_variable = { zin_value < 0 } ${HUB} = { has_idea = zin_worshipdom_radiant_face } }`, 'multiply_temp_variable = { zin_value = 0.5 }', '}',
      'set_temp_variable = { zin_old = global.zin_afrit_veil }',
      'add_to_variable = { global.zin_afrit_veil = zin_value }',
      'clamp_variable = { var = global.zin_afrit_veil min = 0 max = 100 }',
      'if = {', `limit = {\ncheck_variable = { global.zin_afrit_veil < ${D.veil.firstFloor} }\nNOT = { has_global_flag = zin_afrit_abandoned_aenor }\nNOT = { ROOT = { is_ai = no } }\n}`, `set_variable = { global.zin_afrit_veil = ${D.veil.firstFloor} }`, '}',
      'set_temp_variable = { zin_delta = global.zin_afrit_veil }', 'subtract_from_temp_variable = { zin_delta = zin_old }', 'add_to_variable = { global.zin_afrit_veil_month = zin_delta }',
      'if = {', `limit = {\ncheck_variable = { global.zin_afrit_veil < ${D.veil.thinsAt} }\nNOT = { has_global_flag = zin_afrit_veil_thin_seen }\n}`, 'set_global_flag = zin_afrit_veil_thin_seen', `${HUB} = { country_event = { id = zin_afrit.41 } }`, '}',
      'if = {', `limit = {\ncheck_variable = { global.zin_afrit_veil < ${D.veil.exposedBelow} }\ncheck_variable = { global.zin_afrit_regicide_plot > 0 }\nzin_aenor_king_alive = yes\nNOT = { has_global_flag = zin_golden_king_plot_exposed }\nNOT = { has_global_flag = zin_afrit_exposure_fired }\n}`, 'set_global_flag = zin_afrit_exposure_fired', `${HUB} = { country_event = { id = zin_afrit.16 } }`, '}',
      'if = {', 'limit = { check_variable = { global.zin_afrit_veil < 0.01 } }', 'zin_afrit_reveal = yes', '}')}
    }`);

  effects.zin_afrit_add_plot = dedent(`
    ${takeArgs('value')}
    ${hidden(
      'add_to_variable = { global.zin_afrit_regicide_plot = zin_value }', 'clamp_variable = { var = global.zin_afrit_regicide_plot min = 0 max = 100 }',
      'if = {', 'limit = {\ncheck_variable = { global.zin_afrit_regicide_plot > 99.99 }\nNOT = { has_global_flag = zin_afrit_plot_ready_seen }\n}', 'set_global_flag = zin_afrit_plot_ready_seen', `${HUB} = { country_event = { id = zin_afrit.14 } }`, '}')}
    ${tt('zin_afrit_tt_prayers', 'The faithful pray for the King.')}`);

  effects.zin_afrit_raise_seat = dedent(`
    ${takeArgs('seat', 'value')}
    ${hidden(...seats.map((s, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { check_variable = { zin_seat = ${D.seatCodes[s]} } }\nadd_to_variable = { ${seatVar(s)} = zin_value }\nclamp_variable = { var = ${seatVar(s)} min = 0 max = 5 }\n}`), 'zin_afrit_refresh_graces = yes')}
    ${tt('zin_afrit_tt_chapter', 'The chapter sends word.')}`);

  effects.zin_afrit_attune_artifact = dedent(`
    ${takeArgs('artifact')}
    ${hidden(...arts.map((a, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { check_variable = { zin_artifact = ${a.code} } }\nset_global_flag = zin_afrit_attuned_${a.key}\n}`), 'zin_afrit_refresh_graces = yes')}
    ${tt('zin_afrit_tt_vaults', 'The vaults are opened and the lamps are lit.')}`);

  // Graces: one dynamic modifier on the realm Aurevan leads.
  const gv = D.graceVariables;
  effects.zin_afrit_refresh_graces = dedent(`
    # Each held artifact gives 50% of its graces unattuned and 100% attuned, times (0.8 + 0.05 x Relics).
    ${hidden(
      'every_country = {', 'limit = { has_dynamic_modifier = { modifier = zin_afrit_graces } }', 'remove_dynamic_modifier = { modifier = zin_afrit_graces }', '}',
      'random_country = {', 'limit = { zin_afrit_rules_here = yes }',
      ...Object.values(gv).map(v => `set_variable = { ${v} = 0 }`),
      'set_temp_variable = { zin_gf = global.zin_afrit_seat_relics }', 'multiply_temp_variable = { zin_gf = 0.05 }', 'add_to_temp_variable = { zin_gf = 0.8 }',
      ...arts.map(a => list(
        `set_temp_variable = { zin_ga = 0 }`,
        `if = {`, `limit = { NOT = { has_global_flag = zin_afrit_lost_${a.key} } }`, 'set_temp_variable = { zin_ga = 0.5 }',
        `if = {`, `limit = { has_global_flag = zin_afrit_attuned_${a.key} }`, 'set_temp_variable = { zin_ga = 1 }', '}',
        a.key === 'necklace' ? 'if = {\nlimit = { zin_aenor_is_realm = yes }\nmultiply_temp_variable = { zin_ga = 1.5 }\n}' : '',
        a.key === 'crown' ? `if = {\nlimit = {\nzin_aenor_is_realm = yes\n${HUB} = { has_country_flag = zin_worshipdom_oaths_renewed }\n}\nmultiply_temp_variable = { zin_ga = 2 }\n}` : '',
        'multiply_temp_variable = { zin_ga = zin_gf }',
        ...Object.entries(a.graces).map(([m, v]) => `set_temp_variable = { zin_gv = zin_ga }\nmultiply_temp_variable = { zin_gv = ${v} }\nadd_to_variable = { ${gv[m]} = zin_gv }`), '}')),
      'add_dynamic_modifier = { modifier = zin_afrit_graces }', 'force_update_dynamic_modifier = yes', '}')}`);

  effects.zin_afrit_ready_regicide = dedent(`
    ${hidden('set_global_flag = zin_afrit_regicide_ready')}
    ${tt('zin_afrit_tt_vigil', 'A vigil is kept for the King.')}`);

  effects.zin_afrit_plot_exposed = dedent(`
    # The Council's reaction to an exposure (called only by zin_aenor_expose_plot). Names no one in public.
    ${hidden('set_variable = { global.zin_afrit_regicide_plot = 0 }',
      'if = {', 'limit = { zin_afrit_secret_kept = yes }', 'set_temp_variable = { zin_arg_value = -30 }', 'zin_afrit_add_veil = yes', '}',
      `${HUB} = { country_event = { id = zin_afrit.16 } }`, 'news_event = { id = zin_afrit.17 }')}
    ${tt('zin_afrit_tt_vigil', 'A vigil is kept for the King.')}`);

  // ---------------------------------------------------------------------------------------------- the crowning
  effects.zin_afrit_crown_aurevan = dedent(`
    # The Faithful's seals pass to the Deliverer. Scope: any (the hub's event).
    ${hidden(
      'set_global_flag = zin_aurevan_crowned',
      'random_country = {', 'limit = {\nzin_aenor_is_realm = yes\nzin_aenor_ruled_by_faithful = yes\n}', 'save_global_event_target_as = zin_afrit_crown_realm', '}',
      'if = {', 'limit = { NOT = { has_event_target = zin_afrit_crown_realm } }', 'zin_aenor_find_parim_realm = yes', 'event_target:zin_aenor_parim_realm = { save_global_event_target_as = zin_afrit_crown_realm }', '}',
      `${HUB} = {`, 'remove_country_leader_role = { character = zin_aurevan ideology = zin_light_sanctuary }', 'recruit_character = zin_ilvane',
      'add_country_leader_role = { character = zin_ilvane promote_leader = yes country_leader = { ideology = zin_light_sanctuary expire = "2000.1.1.1" } }', '}',
      'event_target:zin_afrit_crown_realm = {', 'recruit_character = zin_aurevan',
      'add_country_leader_role = { character = zin_aurevan promote_leader = yes country_leader = { ideology = zin_light_sanctuary expire = "2000.1.1.1" traits = { zin_trait_deliverer } } }',
      setStance('zin_light_sanctuary'),
      'set_temp_variable = { zin_arg_value = 10 }', 'if = {', `limit = { ${HUB} = { has_country_flag = zin_worshipdom_proclamation_ready } }`, 'add_to_temp_variable = { zin_arg_value = 10 }', 'add_stability = 0.1', '}',
      'zin_aenor_add_council_influence = yes',
      'news_event = { id = zin_afrit.21 }', `${HUB} = { country_event = { id = zin_afrit.22 days = 30 } }`, '}',
      'zin_afrit_refresh_graces = yes', 'zin_reign_on_crowning = yes')}
    ${tt('zin_afrit_tt_crown', 'The temples lay the crown before the Deliverer.')}`);

  effects.zin_afrit_crown_eronel = dedent(`
    # Prince Eronel is crowned in Aenor (called by the immediate block of the news event zin_afrit.23). Scope: the Aenor realm.
    recruit_character = zin_eronel
    promote_character = zin_eronel
    set_country_flag = zin_reign_eronel_crowned
    country_event = { id = zin_reign.65 days = 2 }`);
  effects.zin_afrit_raise_pliant_heir = dedent(`
    ${hidden('set_global_flag = zin_afrit_kingdom_behind_throne', 'news_event = { id = zin_afrit.23 }')}
    ${tt('zin_afrit_tt_tutor', 'The temples send a tutor to the heir.')}`);

  // ---------------------------------------------------------------------------------------------- Yeldenne
  effects.zin_afrit_northern_voyage = dedent(`
    # The hub sails north. The voyage takes 60 days, 30 with the maps of the cold coast.
    ${hidden(
      'set_temp_variable = { zin_vd = 60 }', 'if = {', 'limit = { has_country_flag = zin_worshipdom_cold_maps }', 'set_temp_variable = { zin_vd = 30 }', '}',
      'country_event = { id = zin_afrit.32 }', 'country_event = { id = zin_afrit.8 days = zin_vd }',
      'random_country = {', `limit = {\nzin_afrit_rules_here = yes\nNOT = { zin_afrit_is_hub = yes }\nNOT = { ${HUB} = { has_country_flag = zin_worshipdom_merovan_charge } }\n}`, 'add_ideas = zin_afrit_aurevan_away', '}')}
    ${tt('zin_afrit_tt_ships', 'The pilgrim ships put out to sea.')}`);
  effects.zin_afrit_wound = dedent(`
    # Afrit is wounded at Yeldenne. zin_arg_days: how long the Deliverer rests (365 by default).
    ${takeArgs('days')}
    ${hidden(
      'if = {', 'limit = { check_variable = { zin_days < 1 } }', 'set_temp_variable = { zin_days = 365 }', '}',
      'set_global_flag = zin_afrit_wounded',
      'random_country = {', 'limit = { zin_afrit_rules_here = yes }', 'save_global_event_target_as = zin_afrit_ruled_realm', '}',
      'if = {', 'limit = { has_event_target = zin_afrit_ruled_realm }', 'event_target:zin_afrit_ruled_realm = {', 'add_timed_idea = { idea = zin_afrit_deliverer_rests days = zin_days }', 'remove_ideas = zin_afrit_aurevan_away', '}', '}',
      'set_temp_variable = { zin_arg_value = -15 }', 'zin_afrit_add_veil = yes',
      `${HUB} = { country_event = { id = zin_afrit.34 } }`)}
    ${tt('zin_afrit_tt_rest', 'The Deliverer withdraws to rest.')}`);

  // ---------------------------------------------------------------------------------------------- the reveal
  effects.zin_afrit_reveal = dedent(`
    # The name is spoken, once. zin_arg_voluntary: 1 when the hub casts off the mask itself.
    ${takeArgs('voluntary')}
    if = {
    	limit = { zin_afrit_secret_kept = yes }
    	${hidden(
      'set_global_flag = zin_afrit_revealed',
      'if = {', 'limit = { NOT = { has_global_flag = zin_aurevan_crowned } }', 'set_global_flag = zin_afrit_unmasked_early', '}',
      `${HUB} = { country_event = { id = zin_afrit.42 } }`, 'news_event = { id = zin_afrit.43 }',
      'every_country = {', 'limit = { zin_afrit_rules_here = yes }', 'add_country_leader_trait = zin_trait_unmasked', '}', 'zin_aurevan = { set_character_name = zin_name_afrit }', `${HUB} = { remove_ideas = { zin_worshipdom_radiant_face zin_worshipdom_endless_regency } }`,
      `${HUB} = {`, setStance('zin_shadow_worship'), '}',
      'every_country = {', 'limit = { zin_afrit_rules_here = yes NOT = { zin_afrit_is_hub = yes } }', setStance('zin_shadow_worship'), '}',
      'every_country = {', 'limit = {\nhas_government = democratic\nNOT = { zin_afrit_is_hub = yes }\nNOT = { zin_afrit_rules_here = yes }\n}', 'country_event = { id = zin_afrit.45 }', '}',
      'every_country = {', 'limit = { zin_aenor_is_realm = yes }', 'country_event = { id = zin_reign.85 days = 3 }', '}',
      'every_country = {', 'limit = { check_variable = { zin_footholds > 2 } }', 'set_temp_variable = { zin_arg_value = zin_footholds }', 'multiply_temp_variable = { zin_arg_value = 5 }', 'set_temp_variable = { zin_arg_ideology = 3 }', 'zin_politics_add_drift = yes', '}',
      'set_temp_variable = { zin_arg_value = 5 }', 'zin_world_add_gathering_dark = yes',
      'if = {', 'limit = { has_global_flag = zin_afrit_unmasked_early }', 'zin_afrit_unmasked_early_effects = yes', '}')}
    }
    ${tt('zin_afrit_tt_name', 'The Deliverer is no longer veiled.')}`);

  effects.zin_afrit_unmasked_early_effects = dedent(`
    # The catastrophe the hub player plays to avoid: the name comes out before the crown is taken.
    ${HUB} = {
    	add_ideas = zin_afrit_unmasked
    	country_event = { id = zin_afrit.44 }
    }
    ${AEN} = {
    	set_temp_variable = { zin_arg_value = -40 }
    	zin_aenor_add_council_influence = yes
    }
    zin_aenor_expose_plot = yes
    every_country = {
    	limit = { check_variable = { zin_footholds > 0 } }
    	set_temp_variable = { zin_arg_value = -1 }
    	zin_afrit_add_footholds = yes
    	if = {
    		limit = { has_government = democratic check_variable = { zin_footholds > 0 } }
    		set_temp_variable = { zin_arg_value = -1 }
    		zin_afrit_add_footholds = yes
    	}
    }
    set_temp_variable = { zin_arg_value = 10 }
    zin_world_add_gathering_dark = yes`);

  // ---------------------------------------------------------------------------------------------- the flight east
  effects.zin_afrit_kneel = dedent(`
    # A court kneels to the King of the East. Scope: the court.
    ${hidden(
      'set_country_flag = zin_afrit_eastern_client', 'zin_east_prepare_kneel = yes', 'save_event_target_as = zin_afrit_kneeler',
      'if = {', 'limit = { is_subject = no }', `${HUB} = {`, 'puppet = event_target:zin_afrit_kneeler', 'set_autonomy = { target = event_target:zin_afrit_kneeler autonomy_state = zin_autonomy_eastern_client }', '}', '}',
      'else = {', `${HUB} = { give_military_access = event_target:zin_afrit_kneeler }`, '}')}
    ${tt('zin_afrit_tt_kneel', 'The court takes the Deliverer for its king.')}`);
  effects.zin_afrit_kneel_chance = dedent(`
    # Sets the country variable zin_afrit_kneel_chance (5 to 95), the AI's chance to kneel at zin_afrit.51. Scope: the court.
    set_variable = { zin_afrit_kneel_chance = zin_footholds }
    multiply_variable = { zin_afrit_kneel_chance = ${D.acceptance.perFoothold} }
    add_to_variable = { zin_afrit_kneel_chance = ${D.acceptance.offset} }
    if = {
    	limit = { check_variable = { zin_east_kneel_bias > 0 } }
    	set_temp_variable = { zin_kb = zin_east_kneel_bias }
    	divide_temp_variable = { zin_kb = ${D.acceptance.biasDivisor} }
    	add_to_variable = { zin_afrit_kneel_chance = zin_kb }
    }
    if = {
    	limit = { ${HUB} = { has_country_flag = zin_worshipdom_roads_east } }
    	add_to_variable = { zin_afrit_kneel_chance = ${D.acceptance.roadsEast} }
    }
    if = {
    	limit = { has_government = fascism }
    	add_to_variable = { zin_afrit_kneel_chance = ${D.acceptance.dominion} }
    }
    if = {
    	limit = { has_government = democratic }
    	add_to_variable = { zin_afrit_kneel_chance = ${D.acceptance.light} }
    }
    ${D.rivalCodes.map(([a, b]) => `if = {\n\tlimit = {\n\t\ttag = ${a}\n\t\t${b} = { has_country_flag = zin_afrit_eastern_client }\n\t}\n\tadd_to_variable = { zin_afrit_kneel_chance = ${D.acceptance.rival} }\n}\nif = {\n\tlimit = {\n\t\ttag = ${b}\n\t\t${a} = { has_country_flag = zin_afrit_eastern_client }\n\t}\n\tadd_to_variable = { zin_afrit_kneel_chance = ${D.acceptance.rival} }\n}`).join('\n')}
    if = {
    	limit = { ${HUB} = { has_country_flag = zin_worshipdom_second_embassy } }
    	add_to_variable = { zin_afrit_kneel_chance = ${D.acceptance.secondEmbassy} }
    }
    clamp_variable = { var = zin_afrit_kneel_chance min = ${D.acceptance.min} max = ${D.acceptance.max} }`);

  effects.zin_afrit_flee_east = dedent(`
    # Afrit leaves Aenor (section "The flight east"). Scope: any.
    ${hidden(
      'if = {', 'limit = { zin_afrit_secret_kept = yes }', 'zin_afrit_reveal = yes', '}',
      'set_global_flag = zin_afrit_abandoned_aenor',
      'every_country = {', 'limit = { zin_aenor_is_realm = yes }', 'country_event = { id = zin_aenor.300 }', '}',
      'random_country = {', 'limit = { zin_afrit_rules_here = yes NOT = { zin_afrit_is_hub = yes } }', 'save_global_event_target_as = zin_afrit_left_realm', '}',
      'if = {', 'limit = { has_event_target = zin_afrit_left_realm }', 'event_target:zin_afrit_left_realm = {', 'remove_country_leader_role = { character = zin_aurevan ideology = zin_shadow_worship }', 'remove_ideas = zin_afrit_aurevan_away', '}', '}',
      `${HUB} = {`, 'recruit_character = zin_aurevan', 'add_country_leader_role = { character = zin_aurevan promote_leader = yes country_leader = { ideology = zin_shadow_worship expire = "2000.1.1.1" traits = { zin_trait_deliverer zin_trait_unmasked } } }', setStance('zin_shadow_worship'),
      'remove_ideas = zin_worshipdom_deliverers_peace', 'country_event = { id = zin_afrit.53 }', '}',
      'if = {', `limit = { ${rule('zin_rule_afrit', 'HISTORICAL')} }`, 'zin_afrit_historical_kneel = yes', '}',
      'every_country = {', 'limit = {\nzin_afrit_eastern_candidate = yes\nNOT = { has_country_flag = zin_afrit_eastern_client }\n}', 'zin_afrit_kneel_chance = yes', 'country_event = { id = zin_afrit.51 }', '}',
      `${HUB} = { country_event = { id = zin_afrit.9 days = 30 } }`)}
    ${tt('zin_afrit_tt_east', 'The Deliverer turns his face to the East.')}`);

  effects.zin_afrit_historical_kneel = dedent(`
    # Under the historical rule the two AI candidates with the highest footholds kneel at once (ties: the state count, then the engine's order).
    ${hidden(
      'set_temp_variable = { zin_kn_i = 0 }',
      'while_loop_effect = {', 'limit = { check_variable = { zin_kn_i < 2 } }', 'add_to_temp_variable = { zin_kn_i = 1 }', 'set_temp_variable = { zin_kn_best = -1 }', 'clear_global_event_target = zin_afrit_kneel_pick',
      'every_country = {', 'limit = {\nzin_afrit_eastern_candidate = yes\nis_ai = yes\nNOT = { has_country_flag = zin_afrit_eastern_client }\n}',
      'set_temp_variable = { zin_kn_score = zin_footholds }', 'multiply_temp_variable = { zin_kn_score = 100 }', 'add_to_temp_variable = { zin_kn_score = num_owned_states }',
      'if = {', 'limit = { check_variable = { zin_kn_score > zin_kn_best } }', 'set_temp_variable = { zin_kn_best = zin_kn_score }', 'save_global_event_target_as = zin_afrit_kneel_pick', '}', '}',
      'if = {', 'limit = { has_event_target = zin_afrit_kneel_pick }', 'event_target:zin_afrit_kneel_pick = { zin_afrit_kneel = yes }', '}', '}')}`);

  effects.zin_afrit_proclaim_king_of_east = dedent(`
    ${hidden(
      'if = {', 'limit = { NOT = { has_global_flag = zin_afrit_king_of_east } }', 'set_global_flag = zin_afrit_king_of_east',
      `${HUB} = {`, 'set_cosmetic_tag = zin_cosmetic_worshipdom_east', '}', 'zin_aurevan = { set_character_name = zin_name_afrit_king_of_east }', '}')}
    ${tt('zin_afrit_tt_dawn', 'The kings of the East name the Deliverer their king.')}`);

  effects.zin_afrit_raise_eastern_host = dedent(`
    # Creates zin_arg_divisions hosts of the Host of the East for the hub in the capital of the client with most states.
    ${takeArgs('divisions')}
    ${hidden(
      'set_temp_variable = { zin_mx = 0 }', 'clear_global_event_target = zin_afrit_host_seat',
      'every_country = {', 'limit = { has_country_flag = zin_afrit_eastern_client }', 'if = {', 'limit = { check_variable = { num_owned_states > zin_mx } }', 'set_temp_variable = { zin_mx = num_owned_states }', 'save_global_event_target_as = zin_afrit_host_seat', '}', '}',
      'if = {', 'limit = { has_event_target = zin_afrit_host_seat }', 'event_target:zin_afrit_host_seat = {', 'capital_scope = { save_event_target_as = zin_afrit_host_state }', '}',
      'if = {', `limit = { NOT = { has_template = "Host of the East" } }`, 'division_template = {', 'name = "Host of the East"', `division_names_group = ${T.hostGroup}`, 'regiments = {', 'zin_men_infantry = { x = 0 y = 0 }', 'zin_men_infantry = { x = 0 y = 1 }', 'zin_men_infantry = { x = 0 y = 2 }', 'zin_men_archers = { x = 1 y = 0 }', 'zin_men_camel_riders = { x = 1 y = 1 }', '}', '}', '}',
      'set_temp_variable = { zin_prov = event_target:zin_afrit_host_state.zin_aenor_first_province }',
      'meta_effect = {', 'text = {', 'create_unit = {', 'division = "name = \\"Host of the East\\" division_template = \\"Host of the East\\" start_experience_factor = 0.4 start_equipment_factor = 1"', 'owner = THIS', 'prioritize_location = [P]', 'allow_spawning_on_enemy_provs = no', 'count = [N]', '}', '}', 'P = "[?zin_prov|0]"', 'N = "[?zin_divisions|0]"', '}', '}',
      'set_temp_variable = { zin_arg_value = 1 }', 'zin_world_add_gathering_dark = yes')}
    ${tt('zin_afrit_tt_host', 'The pilgrims of the East gather under one banner.')}`);

  effects.zin_afrit_wargoal_refuser = dedent(`
    # A war goal on the eastern refuser with the most states.
    ${hidden(
      'set_temp_variable = { zin_mx = 0 }', 'clear_global_event_target = zin_afrit_refuser',
      'every_country = {', 'limit = {\nhas_country_flag = zin_afrit_refused_east\nNOT = { has_war_with = THIS }\n}', 'if = {', 'limit = { check_variable = { num_owned_states > zin_mx } }', 'set_temp_variable = { zin_mx = num_owned_states }', 'save_global_event_target_as = zin_afrit_refuser', '}', '}',
      'if = {', 'limit = { has_event_target = zin_afrit_refuser }', 'create_wargoal = { type = take_state target = event_target:zin_afrit_refuser }', '}')}
    ${tt('zin_afrit_tt_refuser', 'A letter is sent to the doubtful court.')}`);

  effects.zin_afrit_return = dedent(`
    # The return from the East: the hub declares war on the controller of Parim and on the country that has Eindil.
    ${hidden(
      'set_global_flag = zin_afrit_returned',
      'zin_aenor_find_parim_realm = yes',
      'every_state = {', 'limit = { zin_is_site_parim = yes }', 'controller = {', 'if = {', `limit = {\nNOT = { tag = ${HUB} }\nNOT = { is_subject_of = ${HUB} }\nNOT = { has_war_with = ${HUB} }\n}`, `${HUB} = { declare_war_on = { target = PREV type = annex_everything } }`, '}', '}', '}',
      'every_country = {', 'limit = {\nhas_character = zin_eindil\nNOT = { tag = ' + HUB + ' }\nNOT = { has_war_with = ' + HUB + ' }\n}', `${HUB} = { declare_war_on = { target = PREV type = annex_everything } }`, '}',
      'set_temp_variable = { zin_arg_value = 5 }', 'zin_world_add_gathering_dark = yes')}
    ${tt('zin_afrit_tt_return', 'The pilgrims turn homeward.')}`);

  effects.zin_afrit_retake_aenor = dedent(`
    # Lord of all Erdae (zin_afrit.62): Aurevan leads Aenor again, or the hub annexes what its side holds.
    ${hidden(
      'set_global_flag = zin_afrit_claims_erdae',
      'if = {', `limit = { country_exists = ${AEN} }`, `${HUB} = { white_peace = ${AEN} }`,
      `${AEN} = {`, 'recruit_character = zin_aurevan', 'add_country_leader_role = { character = zin_aurevan promote_leader = yes country_leader = { ideology = zin_shadow_worship expire = "2000.1.1.1" traits = { zin_trait_deliverer zin_trait_unmasked } } }', setStance('zin_shadow_worship'), `give_military_access = ${HUB}`, '}',
      `${HUB} = { give_military_access = ${AEN} recruit_character = zin_ilvane }`, '}',
      'else = {', 'every_state = {', `limit = { is_controlled_by = ${HUB} NOT = { is_owned_by = ${HUB} } zin_is_region_middle_lands = yes }`, `transfer_state_to = ${HUB}`, '}', '}',
      'zin_afrit_refresh_graces = yes')}
    ${tt('zin_afrit_tt_erdae', 'The Deliverer takes the crown of Parim again.')}`);
  effects.zin_afrit_claim_middle_lands = dedent(`
    ${hidden(`every_state = {`, `limit = { zin_is_region_middle_lands = yes NOT = { is_owned_by = ${HUB} } NOT = { is_claimed_by = ${HUB} } }`, `add_claim_by = ${HUB}`, '}')}
    ${tt('zin_afrit_tt_claims', 'Old claims are read out in every hall.')}`);

  // ---------------------------------------------------------------------------------------------- the palace
  effects.zin_afrit_begin_palace_battle = dedent(`
    ${hidden('clr_global_flag = zin_afrit_palace_held', `${HUB} = { country_event = { id = zin_afrit.70 } }`)}
    ${tt('zin_afrit_tt_wards', 'The wards of the palace are woken.')}`);
  effects.zin_afrit_lose_artifact = dedent(`
    ${takeArgs('artifact')}
    ${hidden(...arts.map((a, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { check_variable = { zin_artifact = ${a.code} } }\nset_global_flag = zin_afrit_lost_${a.key}\n}`),
      'add_to_variable = { global.zin_afrit_artifacts = -1 }', 'clamp_variable = { var = global.zin_afrit_artifacts min = 0 max = 4 }', 'zin_afrit_refresh_graces = yes')}
    ${tt('zin_afrit_tt_lost', 'A treasure of the hermitage is lost.')}`);
  // The hub's defences (each once per stage): burn the reserves, draw on the Necklace, go through the doors.
  effects.zin_afrit_palace_defend = dedent(`
    ${takeArgs('kind')}
    ${hidden(
      'if = {', 'limit = { check_variable = { zin_kind = 1 } }', 'add_political_power = -150', 'set_global_flag = zin_afrit_def_burn', '}',
      'else_if = {', 'limit = { check_variable = { zin_kind = 2 } }', 'set_global_flag = zin_afrit_def_necklace', 'set_temp_variable = { zin_arg_value = 3 }', 'zin_world_add_gathering_dark = yes', '}',
      'else_if = {', 'limit = { check_variable = { zin_kind = 3 } }', 'set_global_flag = zin_afrit_def_doors', '}')}
    ${tt('zin_afrit_tt_defend', 'The hermitage answers the intruders.')}`);
  // One stage of the palace battle: the roll for Eindil's side (zin_arg_stage 1 to 4). Success: the artifact is lost, the journey is told, the next stage follows.
  const stages = D.palace;
  const stageMods = {
    1: `if = {\n\tlimit = { any_country = { has_character = zin_alleria } }\n\tadd_to_temp_variable = { zin_pc = 20 }\n}\nif = {\n\tlimit = {\n\t\thas_global_flag = zin_afrit_attuned_ring\n\t\tcheck_variable = { global.zin_afrit_seat_relics = 5 }\n\t}\n\tadd_to_temp_variable = { zin_pc = -10 }\n}`,
    2: `if = {\n\tlimit = { ${AEN} = { check_variable = { zin_council_influence < 50 } } }\n\tadd_to_temp_variable = { zin_pc = 15 }\n}\nif = {\n\tlimit = { ${HUB} = { has_country_flag = zin_worshipdom_oaths_renewed } }\n\tadd_to_temp_variable = { zin_pc = -10 }\n}`,
    3: `if = {\n\tlimit = { has_global_flag = zin_glo_with_eindil }\n\tadd_to_temp_variable = { zin_pc = 15 }\n}`,
    4: `if = {\n\tlimit = { has_global_flag = zin_eindil_golbran_joined }\n\tadd_to_temp_variable = { zin_pc = 30 }\n}\nif = {\n\tlimit = {\n\t\thas_global_flag = zin_afrit_attuned_necklace\n\t\tcheck_variable = { global.zin_afrit_seat_relics = 5 }\n\t}\n\tadd_to_temp_variable = { zin_pc = -10 }\n}`,
  };
  // The journey's palace events go to the Host (the country that employs Eindil), whoever that is when the stage falls.
  const toHost = id => list('if = {', 'limit = { has_variable = global.zin_eindil_host }', `var:global.zin_eindil_host = { country_event = { id = zin_eindil.${id} } }`, '}', 'else = {', 'random_country = {', 'limit = { has_character = zin_eindil }', `country_event = { id = zin_eindil.${id} }`, '}', '}');
  const onSuccess = (s, i) => list(
    `set_temp_variable = { zin_arg_artifact = ${D.artifactCodes[s.artifact]} }`, 'zin_afrit_lose_artifact = yes',
    s.journey ? toHost(s.journey) : '',
    s.stage < 4 ? `${HUB} = { country_event = { id = zin_afrit.${stages[i + 1].event} } }` : `${HUB} = { news_event = { id = zin_afrit.75 } }`);
  effects.zin_afrit_palace_roll = dedent(`
    ${takeArgs('stage')}
    ${hidden(
      'set_temp_variable = { zin_pc = 0 }',
      ...stages.map((s, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { check_variable = { zin_stage = ${s.stage} } }\nset_temp_variable = { zin_pc = ${s.base} }\n${stageMods[s.stage]}\n}`),
      `if = {`, `limit = { ${HUB} = { has_country_flag = zin_worshipdom_palace_wards } }`, 'add_to_temp_variable = { zin_pc = -10 }', '}',
      `if = {`, `limit = { ${HUB} = { has_country_flag = zin_worshipdom_palace_wards_2 } }`, 'add_to_temp_variable = { zin_pc = -5 }', '}',
      'if = {', 'limit = { has_global_flag = zin_afrit_def_burn }', 'add_to_temp_variable = { zin_pc = -10 }', 'clr_global_flag = zin_afrit_def_burn', '}',
      'if = {', 'limit = { has_global_flag = zin_afrit_def_necklace }', 'add_to_temp_variable = { zin_pc = -10 }', 'clr_global_flag = zin_afrit_def_necklace', '}',
      'set_temp_variable = { zin_rel = global.zin_afrit_seat_relics }', 'multiply_temp_variable = { zin_rel = -2 }', 'add_to_temp_variable = { zin_pc = zin_rel }',
      'clamp_temp_variable = { var = zin_pc min = 5 max = 95 }',
      'set_temp_variable = { zin_won = 0 }',
      'if = {', `limit = { ${rule('zin_rule_afrit', 'HISTORICAL')} }`, 'set_temp_variable = { zin_won = 1 }', '}',
      'else = {', 'meta_effect = {', 'text = {', 'random = {', 'chance = [C]', 'set_temp_variable = { zin_won = 1 }', '}', '}', 'C = "[?zin_pc|0]"', '}', '}',
      // the Ring lets Afrit slip through a door at the first stage; the Necklace stage needs Golbran alive and with Eindil
      'if = {', 'limit = { check_variable = { zin_stage = 1 } has_global_flag = zin_afrit_def_doors has_global_flag = zin_afrit_attuned_ring }', 'set_temp_variable = { zin_won = 0 }', '}',
      'if = {', 'limit = { check_variable = { zin_stage = 4 } NOT = { has_global_flag = zin_eindil_golbran_joined } }', 'set_temp_variable = { zin_won = 0 }', '}',
      'if = {', 'limit = { has_global_flag = zin_golbran_dead check_variable = { zin_stage = 4 } }', 'set_temp_variable = { zin_won = 0 }', '}',
      'clr_global_flag = zin_afrit_def_doors',
      'if = {', 'limit = { check_variable = { zin_won = 0 } }', 'set_global_flag = zin_afrit_palace_held', `${HUB} = { country_event = { id = zin_afrit.76 } }`, '}',
      'else = {', ...stages.map((s, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { check_variable = { zin_stage = ${s.stage} } }\n${onSuccess(s, i)}\n}`), '}')}`);

  effects.zin_afrit_die = dedent(`
    # Afrit's death, called once by the immediate block of zin_afrit.75 (O2). The journey narrates; the Worshipdom goes quiet.
    ${hidden(
      'if = {', 'limit = { NOT = { has_global_flag = zin_afrit_dead } }', 'set_global_flag = zin_afrit_dead',
      'every_country = {', 'limit = { zin_afrit_rules_here = yes }', 'kill_country_leader = yes', 'if = {', 'limit = { has_dynamic_modifier = { modifier = zin_afrit_graces } }', 'remove_dynamic_modifier = { modifier = zin_afrit_graces }', '}', '}',
      `${HUB} = {`, 'drop_cosmetic_tag = yes', 'recruit_character = zin_ilvane', 'add_country_leader_role = { character = zin_ilvane promote_leader = yes country_leader = { ideology = zin_shadow_worship expire = "2000.1.1.1" } }', 'remove_ideas = { zin_worshipdom_eastern_throne zin_worshipdom_host_of_the_east zin_worshipdom_gods_court }', '}',
      'zin_afrit_refresh_graces = yes', 'set_global_flag = zin_afrit_footholds_decay', '}')}
    ${tt('zin_afrit_tt_fall', 'The false god falls.')}`);

  // ---------------------------------------------------------------------------------------------- the Council's month (zin_afrit.2)
  effects.zin_afrit_monthly = dedent(`
    # The Council's month: veil regeneration and last change, tithes, plot drift, seat drifts, graces, caps, decay after death, fallbacks.
    ${hidden(
      'set_variable = { global.zin_afrit_veil_last_change = global.zin_afrit_veil_month }', 'set_variable = { global.zin_afrit_veil_month = 0 }',
      'if = {', 'limit = { zin_afrit_secret_kept = yes }', 'set_temp_variable = { zin_arg_value = global.zin_afrit_seat_censers }', 'multiply_temp_variable = { zin_arg_value = 0.4 }', 'zin_afrit_add_veil = yes', '}',
      // plot: +0.5 x Seals a month once the verdict is given; the fever instrument adds 0.5 a month
      'if = {', 'limit = { has_completed_focus = zin_worshipdom_the_councils_verdict zin_aenor_king_alive = yes NOT = { has_country_flag = zin_worshipdom_stay_hand } }', 'set_temp_variable = { zin_arg_value = global.zin_afrit_seat_seals }', 'multiply_temp_variable = { zin_arg_value = 0.5 }', 'if = {', 'limit = { has_country_flag = zin_worshipdom_instrument_fever }', 'add_to_temp_variable = { zin_arg_value = 0.5 }', '}', 'zin_afrit_add_plot = yes', '}',
      // Seals: council influence drifts up while below 50 + 10 x level
      'if = {', 'limit = { zin_aenor_king_alive = yes }', 'set_temp_variable = { zin_cap_s = global.zin_afrit_seat_seals }', 'multiply_temp_variable = { zin_cap_s = 10 }', 'add_to_temp_variable = { zin_cap_s = 50 }',
      `${AEN} = {`, 'if = {', 'limit = { check_variable = { var = zin_council_influence value = zin_cap_s compare = less_than } }', 'set_temp_variable = { zin_arg_value = 0.25 }', 'zin_aenor_add_council_influence = yes', '}', '}', '}',
      // tithes
      'set_temp_variable = { zin_tithe = 0 }',
      'every_country = {', 'limit = { check_variable = { zin_footholds > 1 } NOT = { zin_aenor_is_realm = yes } NOT = { zin_afrit_is_hub = yes } }', `add_to_temp_variable = { zin_tithe = ${D.houses.tithe} }`, '}',
      `clamp_temp_variable = { var = zin_tithe max = ${D.houses.titheCap} }`,
      `if = {`, `limit = { ${AEN} = { check_variable = { var = zin_council_influence value = 60 compare = greater_than_or_equals } } }`, `add_to_temp_variable = { zin_tithe = ${D.houses.aenorTithe} }`, '}',
      'add_political_power = zin_tithe',
      // counts for the panel and the Ashen Throne
      'set_variable = { global.zin_afrit_deep_count = 0 }', 'every_country = {', 'limit = { check_variable = { zin_footholds > 3 } }', 'add_to_variable = { global.zin_afrit_deep_count = 1 }', '}',
      'every_country = {', 'limit = { check_variable = { zin_footholds > 0 } }', 'zin_afrit_compute_cap = yes', '}',
      'zin_afrit_refresh_graces = yes',
      'if = {', 'limit = { has_global_flag = zin_afrit_footholds_decay }', 'zin_afrit_decay_footholds = yes', '}',
      'zin_afrit_historical_fallbacks = yes',
      'zin_afrit_ui_refresh = yes')}`);

  effects.zin_afrit_decay_footholds = dedent(`
    # After Afrit's death three countries a month lose one foothold (deepest first, then the engine's order).
    set_temp_variable = { zin_dc_i = 0 }
    while_loop_effect = {
    	limit = { check_variable = { zin_dc_i < 3 } }
    	add_to_temp_variable = { zin_dc_i = 1 }
    	set_temp_variable = { zin_dc_best = 0 }
    	clear_global_event_target = zin_afrit_decay_pick
    	every_country = {
    		limit = {
    			check_variable = { zin_footholds > 0 }
    			NOT = { has_country_flag = zin_afrit_decay_mark }
    		}
    		if = {
    			limit = { check_variable = { zin_footholds > zin_dc_best } }
    			set_temp_variable = { zin_dc_best = zin_footholds }
    			save_global_event_target_as = zin_afrit_decay_pick
    		}
    	}
    	if = {
    		limit = { has_event_target = zin_afrit_decay_pick }
    		event_target:zin_afrit_decay_pick = {
    			set_country_flag = zin_afrit_decay_mark
    			set_temp_variable = { zin_arg_value = -1 }
    			zin_afrit_add_footholds = yes
    		}
    	}
    	else = {
    		set_temp_variable = { zin_dc_i = 3 }
    	}
    }
    every_country = {
    	limit = { has_country_flag = zin_afrit_decay_mark }
    	clr_country_flag = zin_afrit_decay_mark
    }`);

  effects.zin_afrit_historical_fallbacks = dedent(`
    # The established path (rule HISTORICAL, or FREE with the dates kept): the Council is ready by 15 Emberleaf 4A 1750 whatever the plot says.
    if = {
    	limit = {
    		OR = {
    			${rule('zin_rule_afrit', 'HISTORICAL')}
    			AND = {
    				${rule('zin_rule_afrit', 'DEFAULT')}
    				zin_rules_is_historical = yes
    			}
    		}
    		NOT = { ${rule('zin_rule_golden_king_death', 'NO_AI_PLOT')} }
    		zin_afrit_date_regicide_fallback = yes
    		NOT = { has_global_flag = zin_afrit_regicide_ready }
    		NOT = { has_global_flag = zin_golden_king_plot_exposed }
    		NOT = { has_global_flag = zin_afrit_kingdom_behind_throne }
    		NOT = { has_global_flag = zin_golden_king_dead }
    	}
    	zin_afrit_ready_regicide = yes
    }
    if = {
    	limit = {
    		${rule('zin_rule_afrit', 'HISTORICAL')}
    		zin_afrit_date_flight = yes
    		has_global_flag = zin_aurevan_crowned
    		NOT = { has_global_flag = zin_afrit_abandoned_aenor }
    		NOT = { has_global_flag = zin_afrit_stand_in_parim }
    		has_global_flag = zin_war_of_last_crowns
    	}
    	zin_afrit_flee_east = yes
    }`);

  effects.zin_afrit_startup_values = dedent(`
    # Start values that are not per country. Scope: the hub.
    set_variable = { global.zin_afrit_veil = ${D.start.veil} }
    set_variable = { global.zin_afrit_veil_last_change = 0 }
    set_variable = { global.zin_afrit_veil_month = 0 }
    set_variable = { global.zin_afrit_regicide_plot = ${D.start.plot} }
    set_variable = { global.zin_afrit_artifacts = ${D.start.artifacts} }
    set_variable = { global.zin_afrit_deep_count = 0 }
    ${seats.map(s => `set_variable = { ${seatVar(s)} = ${D.start.seats[s]} }`).join('\n')}`);

  return { triggers, effects, tooltips };
}
