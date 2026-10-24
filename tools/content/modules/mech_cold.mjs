// The Cold Lands mechanic (docs/specs/04_mechanics/cold_lands.md): the Northern Accord and Isengard's defiance, the tribes'
// lean and the winter moot, the Long Winters, the old pacts with the yeti and the giants, the far north-west, the silent
// castle, the Neck Road and Windwaith, and the Cold Lands in the War of the Last Crowns.
//   buildMechCold(staged, { countries, data? }) -> { files, counts, definitions, dependencies, ... }
// Data: tools/content/data/mech_regions_cold.json (roster names, every number, every player-visible text).
// Site triggers (zin_is_site_*, zin_is_region_*) are the key-sites table's, the factions and joining rules the diplomacy
// module's, the game rule zin_rule_cold_isengard the rules module's; the note lists each.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fmt, ind, join, call, num, HEADER, Texts, resolveCountries, dateTrigger, renderEvent, renderDecision, renderCategory, renderIdea, renderDynamicModifier, renderOpinion, assertCleanText, knownPictures, knownIcons } from '../lib/mech_kit.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const COLD_DATA_FILE = path.join(here, '../data/mech_regions_cold.json');
export const loadColdData = async (file = COLD_DATA_FILE) => JSON.parse(await readFile(file, 'utf8'));
const SPEC = 'docs/specs/04_mechanics/cold_lands.md';

/** Names this module uses and does not define; each is owned by the module or spec named in docs/design/stage2/mech_regions.md. */
export const COLD_DEPENDENCIES = {
  effects: ['zin_west_add_fleet', 'zin_eindil_add_regard', 'zin_eindil_add_renown', 'zin_eindil_join_coalition', 'zin_yeldenne_add_wards', 'zin_lost_cause_add_strength'],
  triggers: ['zin_is_region_cold_lands', 'zin_is_region_far_northwest', 'zin_is_site_yeldenne', 'zin_is_site_isengard_march', 'zin_is_site_eindil_ice', 'zin_is_site_yeldenne_landing', 'zin_is_site_parim', 'zin_rules_is_historical', 'zin_is_site_neck_road', 'zin_is_site_fandanar'],
  ideas: ['zin_coldor_ports_against_interior'],
  opinions: ['zin_opinion_cold_rivalry'],
  gameRules: ['zin_rule_cold_isengard'],
  factionTemplates: ['zin_faction_northern_accord'],
  globalFlags: ['zin_eindil_awake', 'zin_horos_dead', 'zin_afrit_at_yeldenne', 'zin_war_of_last_crowns', 'zin_western_crossing', 'zin_west_council', 'zin_eindil_returned', 'zin_glo_sealed'],
  variables: ['zin_gathering_dark', 'zin_story_pace', 'zin_west_route', 'zin_west_convener', 'zin_eindil_regard'],
  countryFlags: ['zin_region_cold_lands', 'zin_coldor_accord_decisions', 'zin_coldor_accord_open', 'zin_coldor_cheap_envoys', 'zin_regional_yeti_lands_open_to_truce', 'zin_regional_yeti_lands_apart', 'zin_regional_titanos_open_to_pacts', 'zin_regional_titanos_apart', 'zin_regional_windwaith_free_harbours', 'zin_yeldenne_forewarned', 'zin_glo_conqueror', 'zin_cold_winter_stores', 'zin_cold_timber_market', 'zin_cold_iron_hand', 'zin_cold_open_hand', 'zin_cold_conquest', 'zin_cold_hall_respected', 'zin_cold_guides_north', 'zin_cold_watch_fires', 'zin_cold_route_apart', 'zin_cold_route_crossing', 'zin_cold_route_companies', 'zin_lost_cause_member'],
  events: [],
};

const YETI = { key: 'yeti', country: 'Yeti Lands', pact: 'zin_cold_yeti_pact', event: 'zin_cold.51', openFlag: 'zin_regional_yeti_lands_open_to_truce', apartFlag: 'zin_regional_yeti_lands_apart' };
const GIANT = { key: 'giant', country: 'Titanos', pact: 'zin_cold_giant_pact', event: 'zin_cold.52', openFlag: 'zin_regional_titanos_open_to_pacts', apartFlag: 'zin_regional_titanos_apart' };

export async function buildMechCold(staged, ctx) {
  const data = ctx.data ?? await loadColdData();
  const N = data.numbers, R = data.roster, T = new Texts(data.text);
  const found = resolveCountries(ctx.countries, [...R.core, ...Object.keys(R.leans)], R.scan);
  const others = resolveCountries(ctx.countries, R.others);
  const cold = ctx.countries.filter(c => c.scan === R.scan);
  if (cold.length !== R.expectedCountries) throw new Error(`The roster has ${cold.length} ${R.scan} countries, the data expects ${R.expectedCountries}`);
  const tag = n => { const c = found.get(n) ?? others.get(n); if (!c) throw new Error(`${n} is not resolved`); return c.tag; };
  const COL = tag('Coldor'), ISE = tag('Isengard'), YEL = tag('Yeldenne'), HOR = tag('Horidor'), WIN = tag('Windwaith'), GUN = tag('Gunwaith');
  const YET = tag(YETI.country), TIT = tag(GIANT.country), AEN = tag('Aenor');
  const clans = cold.filter(c => ![COL, ISE, YEL].includes(c.tag));
  const pictures = await knownPictures(), icons = await knownIcons();
  const files = new Map();
  const put = (rel, text) => files.set(rel, text.endsWith('\n') ? text : text + '\n');
  const defs = { effects: [], triggers: [], events: [], decisions: [], categories: [], ideas: [], opinions: [], dynamicModifiers: [], aiStrategies: [], globalFlags: new Set(), countryFlags: new Set(), variables: new Set() };

  // ------------------------------------------------------------------------------------------------ triggers
  const trig = [];
  const T_ = (id, body) => { defs.triggers.push(id); trig.push(`${id} = {\n${ind(1, fmt(body))}\n}`); };
  T_('zin_cold_is_cold', 'has_country_flag = zin_region_cold_lands');
  T_('zin_cold_is_clan_realm', 'zin_cold_is_cold = yes\nhas_variable = zin_cold_lean');
  T_('zin_cold_historical', 'OR = {\n  has_game_rule = { rule = zin_rule_cold_isengard option = HISTORICAL }\n  AND = {\n    has_game_rule = { rule = zin_rule_cold_isengard option = DEFAULT }\n    zin_rules_is_historical = yes\n  }\n}');
  T_('zin_cold_rule_open_hand', 'has_game_rule = { rule = zin_rule_cold_isengard option = OPEN_HAND }');
  T_('zin_cold_rule_conquest', 'has_game_rule = { rule = zin_rule_cold_isengard option = CONQUEST }');
  T_('zin_cold_rule_free', 'OR = {\n  has_game_rule = { rule = zin_rule_cold_isengard option = FREE }\n  AND = {\n    has_game_rule = { rule = zin_rule_cold_isengard option = DEFAULT }\n    NOT = { zin_rules_is_historical = yes }\n  }\n}');
  defs.dateTriggers = [];
  for (const [key, [y, m, d]] of Object.entries(N.dates)) { const id = `zin_cold_date_${key}`; trig.push(dateTrigger(id, y, m, d, `Standard date ${y}.${m}.${d}, shifted by the story pace.`)); defs.triggers.push(id); defs.dateTriggers.push(id); }
  T_('zin_cold_march_war_allowed', `NOT = { has_global_flag = zin_cold_march_war_active }
NOT = { ${COL} = { has_country_flag = zin_cold_march_war_fought } }
country_exists = ${COL}
country_exists = ${ISE}
NOT = { ${COL} = { has_war_with = ${ISE} } }
OR = {
  AND = {
    zin_cold_date_march_open = yes
    OR = {
      check_variable = { global.zin_gathering_dark > ${num(N.march_dark - 0.01)} }
      ${ISE} = { check_variable = { zin_cold_isengard_defiance > ${num(N.march_defiance - 0.01)} } }
    }
  }
  AND = {
    zin_cold_historical = yes
    zin_cold_date_march_historical = yes
  }
}`);
  T_('zin_cold_isengard_may_swear', `country_exists = ${ISE}
${ISE} = {
  check_variable = { zin_cold_isengard_defiance < ${num(N.swear_defiance + 0.01)} }
  NOT = { has_war_with = ${COL} }
}`);
  T_('zin_cold_isengard_settled', `OR = {
  has_global_flag = zin_cold_isengard_sworn
  AND = {
    country_exists = ${ISE}
    ${ISE} = { is_subject_of = ${COL} }
  }
  AND = {
    NOT = { country_exists = ${ISE} }
    has_variable = global.zin_cold_isengard_seat
    var:global.zin_cold_isengard_seat = { is_owned_by = ${COL} }
  }
}`);
  T_('zin_cold_winter_is_hard', `check_variable = { global.zin_cold_winter > 0.99 }\nhas_global_flag = zin_cold_winter_season`);
  T_('zin_cold_is_runner', `OR = {
  original_tag = ${COL}
  AND = {
    NOT = { country_exists = ${COL} }
    zin_cold_is_cold = yes
    NOT = {
      any_other_country = {
        zin_cold_is_cold = yes
        check_variable = { num_owned_states > PREV.num_owned_states }
      }
    }
  }
}`);
  T_('zin_cold_pact_is_open', `has_variable = zin_cold_yeti_pact`);
  put('common/scripted_triggers/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\n\n${trig.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ effects
  const eff = [];
  const E_ = (id, body) => { defs.effects.push(id); eff.push(`${id} = {\n${ind(1, fmt(body))}\n}`); };
  const winters = Object.entries(N.historical_winters).map(([year, sev]) => `if = {\n  limit = { check_variable = { global.year = ${year} } }\n  set_variable = { global.zin_cold_winter = ${sev} }\n}`).join('\n');
  const sev = N.winter_modifiers;

  E_('zin_cold_add_lean', `if = {
  limit = { has_variable = zin_cold_lean }
  add_to_variable = { zin_cold_lean = zin_arg_value }
  clamp_variable = { var = zin_cold_lean min = -100 max = 100 }
}`);
  E_('zin_cold_add_lean_all', `every_country = {
  limit = { zin_cold_is_clan_realm = yes }
  zin_cold_add_lean = yes
}`);
  E_('zin_cold_add_defiance', `${ISE} = {
  add_to_variable = { zin_cold_isengard_defiance = zin_arg_value }
  clamp_variable = { var = zin_cold_isengard_defiance min = 0 max = 100 }
  if = {
    limit = { check_variable = { zin_cold_isengard_defiance < ${num(N.swear_defiance + 0.01)} } }
    set_global_flag = zin_cold_charter_ready
  }
  else_if = {
    limit = { check_variable = { zin_cold_isengard_defiance > ${N.swear_defiance + 5} } }
    clr_global_flag = zin_cold_charter_ready
  }
}`);
  E_('zin_cold_update_reach', `set_temp_variable = { zin_cold_weight = 0 }
every_state = {
  limit = {
    zin_is_region_cold_lands = yes
    NOT = { is_owned_by = ${COL} }
    NOT = { zin_is_site_yeldenne = yes }
    controller = {
      OR = {
        original_tag = ${COL}
        is_subject_of = ${COL}
      }
    }
  }
  add_to_temp_variable = { zin_cold_weight = ${N.reach_weight_crown} }
}
every_state = {
  limit = {
    zin_is_region_cold_lands = yes
    NOT = { is_owned_by = ${COL} }
    NOT = { zin_is_site_yeldenne = yes }
    controller = {
      is_in_faction_with = ${COL}
      NOT = { original_tag = ${COL} }
      NOT = { is_subject_of = ${COL} }
    }
  }
  add_to_temp_variable = { zin_cold_weight = ${N.reach_weight_member} }
}
multiply_temp_variable = { zin_cold_weight = 100 }
divide_temp_variable = { zin_cold_weight = ${N.reach_divisor} }
${COL} = {
  set_variable = { zin_cold_accord_reach = zin_cold_weight }
  clamp_variable = { var = zin_cold_accord_reach min = 0 max = 100 }
  set_variable = { zin_cold_reach_pp = zin_cold_accord_reach }
  divide_variable = { zin_cold_reach_pp = ${N.reach_pp_divisor} }
  set_variable = { zin_cold_reach_winter = zin_cold_accord_reach }
  divide_variable = { zin_cold_reach_winter = -${N.reach_winter_divisor} }
  force_update_dynamic_modifier = yes
}`);

  E_('zin_cold_start_march_war', `if = {
  limit = { zin_cold_march_war_allowed = yes }
  ${COL} = {
    random_owned_state = {
      limit = {
        zin_is_site_isengard_march = yes
        any_neighbor_state = {
          is_owned_by = ${ISE}
          zin_is_site_isengard_march = yes
        }
      }
      set_variable = { global.zin_cold_march_a = THIS }
      random_neighbor_state = {
        limit = {
          is_owned_by = ${ISE}
          zin_is_site_isengard_march = yes
        }
        set_variable = { global.zin_cold_march_b = THIS }
      }
    }
  }
  if = {
    limit = {
      has_variable = global.zin_cold_march_a
      has_variable = global.zin_cold_march_b
    }
    set_global_flag = zin_cold_march_war_active
    start_border_war = {
      change_state_after_war = no
      combat_width = ${N.march_width}
      minimum_duration_in_days = ${N.march_days}
      attacker = {
        state = var:global.zin_cold_march_a
        num_provinces = ${N.march_provinces}
        on_win = zin_cold.34
        on_lose = zin_cold.35
        on_cancel = zin_cold.36
      }
      defender = {
        state = var:global.zin_cold_march_b
        num_provinces = ${N.march_provinces}
        on_win = zin_cold.35
        on_lose = zin_cold.34
        on_cancel = zin_cold.36
      }
    }
  }
}`);
  E_('zin_cold_end_march_war', `if = {
  limit = { has_global_flag = zin_cold_march_war_active }
  clr_global_flag = zin_cold_march_war_active
  set_variable = { global.zin_cold_march_winner = zin_arg_winner }
  ${COL} = { set_country_flag = zin_cold_march_war_fought }
  if = {
    limit = { check_variable = { zin_arg_winner = 1 } }
${ind(2, call('zin_cold_add_defiance', { value: N.march_defiance_coldor_win }))}
    ${COL} = { add_war_support = ${N.march_war_support} }
    ${ISE} = { add_stability = -${N.march_stability} }
  }
  else = {
${ind(2, call('zin_cold_add_defiance', { value: N.march_defiance_isengard_win }))}
    ${ISE} = { add_war_support = ${N.march_war_support} }
    ${COL} = { add_stability = -${N.march_stability} }
  }
  news_event = { id = zin_cold.32 }
}`);
  E_('zin_cold_isengard_swears', `if = {
  limit = {
    country_exists = ${ISE}
    country_exists = ${COL}
    NOT = { has_global_flag = zin_cold_isengard_sworn }
  }
  set_global_flag = zin_cold_isengard_sworn
  ${ISE} = {
    remove_opinion_modifier = { target = ${COL} modifier = zin_opinion_cold_rivalry }
    add_opinion_modifier = { target = ${COL} modifier = zin_cold_accord_kin }
    add_ideas = zin_cold_sworn_to_the_accord
    if = {
      limit = { is_in_faction = no }
      ${COL} = {
        if = {
          limit = { is_faction_leader = yes }
          add_to_faction = ${ISE}
        }
      }
    }
  }
  ${COL} = {
    remove_opinion_modifier = { target = ${ISE} modifier = zin_opinion_cold_rivalry }
    add_opinion_modifier = { target = ${ISE} modifier = zin_cold_accord_kin }
  }
}`);
  for (const p of [YETI, GIANT]) {
    E_(`zin_cold_add_${p.key}_pact`, `set_temp_variable = { zin_cold_prev = ${p.pact} }
add_to_variable = { ${p.pact} = zin_arg_value }
clamp_variable = { var = ${p.pact} min = 0 max = 3 }
if = {
  limit = {
    check_variable = { zin_cold_prev < 0.99 }
    check_variable = { ${p.pact} > 0.99 }
  }
  diplomatic_relation = { country = ${p.key === 'yeti' ? YET : TIT} relation = non_aggression_pact active = yes }
  ${p.key === 'yeti' ? YET : TIT} = {
${ind(2, call('zin_cold_add_lean', { value: N.pact_lean }))}
  }
}
if = {
  limit = { check_variable = { ${p.pact} > 2.99 } }
  set_country_flag = zin_cold_${p.key}_hearth
}`);
  }
  E_('zin_cold_apply_winter', `set_variable = { zin_cold_winter_attr = 0 }
set_variable = { zin_cold_winter_stab = 0 }
set_variable = { zin_cold_winter_pop = 0 }
if = {
  limit = {
    check_variable = { global.zin_cold_winter > 0.99 }
    check_variable = { global.zin_cold_winter < 1.99 }
  }
  set_variable = { zin_cold_winter_attr = ${sev.hard[0]} }
  set_variable = { zin_cold_winter_stab = ${sev.hard[1]} }
  set_variable = { zin_cold_winter_pop = ${sev.hard[2]} }
}
if = {
  limit = { check_variable = { global.zin_cold_winter > 1.99 } }
  set_variable = { zin_cold_winter_attr = ${sev.bitter[0]} }
  set_variable = { zin_cold_winter_stab = ${sev.bitter[1]} }
  set_variable = { zin_cold_winter_pop = ${sev.bitter[2]} }
}
if = {
  limit = { has_country_flag = zin_cold_winter_stores }
  multiply_variable = { zin_cold_winter_attr = 0.5 }
  multiply_variable = { zin_cold_winter_stab = 0.5 }
  multiply_variable = { zin_cold_winter_pop = 0.5 }
}
add_dynamic_modifier = { modifier = zin_cold_winter_mod }
force_update_dynamic_modifier = yes`);
  E_('zin_cold_roll_winter', `if = {
  limit = {
    zin_rules_is_historical = yes
    check_variable = { global.year < ${Math.max(...Object.keys(N.historical_winters).map(Number)) + 0.99} }
  }
${ind(1, winters)}
}
else = {
  random_list = {
    ${N.winter_odds[0]} = { set_variable = { global.zin_cold_winter = 0 } }
    ${N.winter_odds[1]} = { set_variable = { global.zin_cold_winter = 1 } }
    ${N.winter_odds[2]} = { set_variable = { global.zin_cold_winter = 2 } }
  }
}
set_global_flag = zin_cold_winter_season
every_country = {
  limit = { zin_cold_is_cold = yes }
  zin_cold_apply_winter = yes
}`);
  E_('zin_cold_end_winter', `clr_global_flag = zin_cold_winter_season
every_country = {
  limit = { zin_cold_is_cold = yes }
  if = {
    limit = { has_dynamic_modifier = { modifier = zin_cold_winter_mod } }
    remove_dynamic_modifier = { modifier = zin_cold_winter_mod }
  }
  clr_country_flag = zin_cold_fed_this_winter
  clr_country_flag = zin_cold_raided_this_winter
}`);
  E_('zin_cold_feed', `if = {
  limit = { country_exists = ${COL} }
  var:zin_arg_target = {
${ind(2, call('zin_cold_add_lean', { value: N.feed_lean }))}
    add_stability = ${N.feed_stability}
    set_country_flag = zin_cold_fed_by_fandanar
    set_country_flag = zin_cold_fed_this_winter
    add_opinion_modifier = { target = ${COL} modifier = zin_cold_fed_us }
  }
}`);
  E_('zin_cold_feed_by_isengard', `var:zin_arg_target = {
${ind(1, call('zin_cold_add_lean', { value: -N.isengard_feed_lean }))}
  add_stability = ${N.feed_stability}
  set_country_flag = zin_cold_fed_by_isengard
  set_country_flag = zin_cold_fed_this_winter
  add_opinion_modifier = { target = ${ISE} modifier = zin_cold_fed_us }
}`);
  E_('zin_cold_open_neck_road', `if = {
  limit = { NOT = { has_global_flag = zin_cold_neck_road } }
  set_global_flag = zin_cold_neck_road
  ${COL} = { add_timed_idea = { idea = zin_cold_neck_road_trade days = ${N.neck_road_days} } }
  ${GUN} = { add_timed_idea = { idea = zin_cold_neck_road_trade days = ${N.neck_road_days} } }
}`);
  E_('zin_cold_sell_timber', `add_political_power = ${N.timber_pp}
${call('zin_west_add_fleet', { value: N.timber_fleet })}`);
  E_('zin_cold_chart_far_ice', `set_country_flag = zin_cold_far_ice_charted
add_ideas = zin_cold_far_ice_charted_idea
every_country = {
  limit = {
    zin_cold_is_clan_realm = yes
    any_owned_state = { zin_is_region_far_northwest = yes }
  }
${ind(1, call('zin_cold_add_lean', { value: N.chart_lean }))}
}`);
  E_('zin_cold_reward_ice_host', `every_country = {
  limit = { any_owned_state = { zin_is_site_eindil_ice = yes } }
  zin_cold_add_lean = yes
}`);
  E_('zin_cold_send_wardens', `${call('zin_eindil_add_regard', { value: N.wardens_regard })}\n${call('zin_eindil_add_renown', { value: N.wardens_renown })}`);
  E_('zin_cold_join_crossing', `if = {
  limit = {
    NOT = { has_global_flag = zin_cold_joins_crossing }
    has_variable = global.zin_west_convener
  }
  set_global_flag = zin_cold_joins_crossing
  var:global.zin_west_convener = {
    if = {
      limit = { is_faction_leader = yes }
      add_to_faction = ${COL}
      if = {
        limit = { has_war_with = ${AEN} }
        ${COL} = { add_to_war = { targeted_alliance = PREV enemy = ${AEN} hostility_reason = asked_to_join } }
      }
    }
  }
}`);
  E_('zin_cold_sail_white_companies', `if = {
  limit = {
    has_equipment = { zin_arms_equipment > ${N.white_equipment - 1} }
    has_manpower > ${N.white_manpower - 1}
  }
  add_manpower = -${N.white_manpower}
  add_equipment_to_stockpile = { type = zin_arms_equipment amount = -${N.white_equipment} }
  if = {
    limit = { NOT = { has_template = "White Company" } }
    division_template = {
      name = "White Company"
      division_names_group = ZIN_HOSTS
      regiments = {
        zin_men_infantry = { x = 0 y = 0 }
        zin_men_infantry = { x = 0 y = 1 }
        zin_men_infantry = { x = 0 y = 2 }
        zin_men_infantry = { x = 1 y = 0 }
        zin_men_infantry = { x = 1 y = 1 }
        zin_men_infantry = { x = 1 y = 2 }
        zin_men_archers = { x = 2 y = 0 }
        zin_men_archers = { x = 2 y = 1 }
        zin_men_cavalry = { x = 2 y = 2 }
      }
      support = {
        zin_support_scouts = { x = 0 y = 0 }
        zin_support_healers = { x = 0 y = 1 }
        zin_support_quartermasters = { x = 0 y = 2 }
      }
    }
  }
  zin_eindil_join_coalition = yes
  create_unit = {
    division = "name = \\"White Company\\" division_template = \\"White Company\\" start_experience_factor = ${N.white_xp} start_equipment_factor = 1"
    owner = ${COL}
    count = ${N.white_divisions}
    allow_spawning_on_enemy_provs = no
    country_score = {
      base = 10
      modifier = {
        add = 500
        is_in_faction_with = ${COL}
        NOT = { original_tag = ${COL} }
      }
      modifier = {
        add = 300
        original_tag = ${AEN}
      }
    }
  }
${ind(1, call('zin_eindil_add_regard', { value: N.white_regard }))}
}`);
  // ------------------------------------------------------------------------------------------------ the monthly runner and hooks
  // The seasons are dated by the calendar, not by the story pace: a monthly tick that falls on 1 Mistfall, 1 Deepwinter or 1 Thaw
  // (a window of two days around the first of the month) fires the matching hidden event once.
  const seasonChecks = (eventId, month) => {
    const out = [];
    for (let y = N.season_years[0]; y <= N.season_years[1]; y++) {
      const before = month === 1 ? `${y - 1}.12.31` : `${y}.${month - 1}.${[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 2]}`;
      out.push(`if = {\n  limit = {\n    date > ${before}\n    date < ${y}.${month}.2\n  }\n  country_event = { id = ${eventId} }\n}`);
    }
    return out.join('\n');
  };
  E_('zin_cold_monthly', `${seasonChecks('zin_cold.10', 11)}
${seasonChecks('zin_cold.20', 1)}
${seasonChecks('zin_cold.13', 3)}
if = {
  limit = { country_exists = ${COL} }
  ${COL} = { zin_cold_update_reach = yes }
}
if = {
  limit = { has_global_flag = zin_cold_winter_season }
  every_country = {
    limit = { zin_cold_is_cold = yes }
    zin_cold_apply_winter = yes
  }
}
if = {
  limit = { country_exists = ${ISE} }
  ${ISE} = {
    set_temp_variable = { zin_cold_drift = 0 }
    if = {
      limit = { ${COL} = { check_variable = { zin_cold_accord_reach > ${num(N.reach_defiance - 0.01)} } } }
      add_to_temp_variable = { zin_cold_drift = -${N.defiance_reach} }
    }
    if = {
      limit = { ${COL} = { any_enemy_country = { zin_cold_is_cold = no } } }
      add_to_temp_variable = { zin_cold_drift = ${N.defiance_foreign_war} }
    }
    if = {
      limit = { has_idea = zin_cold_bread_from_fandanar }
      add_to_temp_variable = { zin_cold_drift = -${N.defiance_bread} }
    }
    set_temp_variable = { zin_arg_value = zin_cold_drift }
    zin_cold_add_defiance = yes
    if = {
      limit = { check_variable = { zin_cold_isengard_defiance > ${num(N.court_defiance - 0.01)} } }
      every_country = {
        limit = {
          zin_cold_is_clan_realm = yes
          is_neighbor_of = ${ISE}
        }
        set_temp_variable = { zin_arg_value = -${N.court_lean} }
        zin_cold_add_lean = yes
      }
    }
  }
  if = {
    limit = {
      has_global_flag = zin_cold_charter_ready
      zin_cold_isengard_may_swear = yes
      ${COL} = {
        has_country_flag = zin_cold_iron_hand
        has_country_flag = zin_cold_march_war_fought
      }
      NOT = { has_global_flag = zin_cold_charter_sent }
    }
    set_global_flag = zin_cold_charter_sent
    ${ISE} = { country_event = { id = zin_cold.30 } }
  }
}
every_country = {
  limit = { zin_cold_is_cold = yes }
  mark_focus_tree_layout_dirty = yes
}`);
  E_('zin_cold_on_declare_war', `if = {
  limit = {
    FROM = { original_tag = ${COL} }
    zin_cold_is_cold = no
  }
  set_variable = { global.zin_cold_invader = ROOT }
  ${COL} = {
    if = {
      limit = { check_variable = { zin_cold_yeti_pact > 2.99 } }
      ${YET} = { country_event = { id = zin_cold.50 } }
    }
    if = {
      limit = { check_variable = { zin_cold_giant_pact > 2.99 } }
      ${TIT} = { country_event = { id = zin_cold.50 } }
    }
  }
}`);
  E_('zin_cold_startup', `set_variable = { global.zin_cold_winter = 0 }
${ISE} = {
  set_variable = { zin_cold_isengard_defiance = ${N.defiance_start} }
  capital_scope = { set_variable = { global.zin_cold_isengard_seat = THIS } }
}
${COL} = {
  set_variable = { zin_cold_accord_reach = 0 }
  set_variable = { zin_cold_yeti_pact = 0 }
  set_variable = { zin_cold_giant_pact = 0 }
  set_variable = { zin_cold_timber_sales = 0 }
  set_variable = { zin_cold_reach_pp = 0 }
  set_variable = { zin_cold_reach_winter = 0 }
  add_ideas = zin_coldor_ports_against_interior
  add_dynamic_modifier = { modifier = zin_cold_reach_mod }
}
${clans.map(c => R.leans[c.name] !== undefined
    ? `${c.tag} = { set_variable = { zin_cold_lean = ${R.leans[c.name]} } }`
    : `${c.tag} = {\n  set_variable = { zin_cold_lean = ${R.defaultLean} }\n  if = {\n    limit = { is_neighbor_of = ${ISE} }\n    set_variable = { zin_cold_lean = ${R.borderLean} }\n  }\n}`).join('\n')}
${COL} = { add_opinion_modifier = { target = ${ISE} modifier = zin_opinion_cold_rivalry } }
${ISE} = { add_opinion_modifier = { target = ${COL} modifier = zin_opinion_cold_rivalry } }
${COL} = { add_opinion_modifier = { target = ${HOR} modifier = zin_cold_accord_kin } }
${HOR} = { add_opinion_modifier = { target = ${COL} modifier = zin_cold_accord_kin } }
every_state = {
  limit = { zin_is_region_far_northwest = yes }
  add_dynamic_modifier = { modifier = zin_cold_far_ice }
}
${COL} = { zin_cold_update_reach = yes }`);
  put('common/scripted_effects/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\n# Scripted effects take no parameters in 1.19.3 (decision E1): a call sets zin_arg_<name> temporary variables first.\n# winner: coldor 1, isengard 2 (zin_cold_end_march_war).\n\n${eff.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ ideas and modifiers
  const spirit = (id, picture, modifier) => ({ id, picture, modifier });
  const ideaList = [
    spirit('zin_cold_bread_from_fandanar', 'zin_granary', { stability_factor: 0.03 }),
    spirit('zin_cold_sworn_to_the_accord', 'zin_banner_league', { stability_factor: 0.05, army_core_defence_factor: 0.05 }),
    spirit('zin_cold_neck_road_trade', 'zin_traders_road', { consumer_goods_factor: -0.02, political_power_gain: 0.05 }),
    spirit('zin_cold_harbour_compact', 'zin_harbour_lake', { consumer_goods_factor: -0.01, naval_speed_factor: 0.05 }),
    spirit('zin_cold_hall_guard', 'zin_castle_ice', { political_power_gain: -0.05, army_core_defence_factor: 0.03 }),
    spirit('zin_cold_far_ice_charted_idea', 'zin_compass_rose', { attrition: -0.05 }),
  ];
  const ideaTexts = [];
  for (const i of ideaList) { if (!icons.has(`GFX_idea_${i.picture}`)) throw new Error(`Idea ${i.id}: picture ${i.picture} is not in the icon catalog`); ideaTexts.push(await renderIdea(i, T)); defs.ideas.push(i.id); }
  put('common/ideas/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\nideas = {\n\tcountry = {\n${ind(2, ideaTexts.join('\n\n'))}\n\t}\n}`);
  const dyn = [
    { id: 'zin_cold_reach_mod', modifier: { political_power_gain: 'zin_cold_reach_pp', winter_attrition_factor: 'zin_cold_reach_winter' } },
    { id: 'zin_cold_winter_mod', modifier: { winter_attrition_factor: 'zin_cold_winter_attr', stability_factor: 'zin_cold_winter_stab', monthly_population: 'zin_cold_winter_pop' } },
    { id: 'zin_cold_far_ice', modifier: { local_supplies: -0.3, attrition: 0.1 } },
  ];
  const dynTexts = [];
  for (const m of dyn) { dynTexts.push(await renderDynamicModifier(m, T)); defs.dynamicModifiers.push(m.id); }
  put('common/dynamic_modifiers/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\n\n${dynTexts.join('\n\n')}`);
  const opinions = [{ id: 'zin_cold_accord_kin', value: 15 }, { id: 'zin_cold_fed_us', value: 15, decay: 1 }, { id: 'zin_cold_hall_friend', value: 20 }, { id: 'zin_cold_temple_swords', value: -10, decay: 0.5 }, { id: 'zin_cold_marriage_kin', value: 20 }, { id: 'zin_cold_road_refused', value: -10, decay: 0.5 }];
  put('common/opinion_modifiers/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\nopinion_modifiers = {\n${ind(1, opinions.map(o => renderOpinion(o, T)).join('\n\n'))}\n}`);
  defs.opinions.push(...opinions.map(o => o.id));

  // ------------------------------------------------------------------------------------------------ decisions
  const onlyCol = `original_tag = ${COL}`, onlyIse = `original_tag = ${ISE}`;
  const cats = [
    { id: 'zin_cold_accord', icon: 'GFX_idea_zin_banner_league', allowed: onlyCol, visible: 'has_country_flag = zin_coldor_accord_decisions' },
    { id: 'zin_cold_isengard', icon: 'GFX_idea_zin_war_drums', allowed: onlyIse },
    { id: 'zin_cold_trade', icon: 'GFX_idea_zin_timber_mill', allowed: onlyCol },
  ];
  for (const c of cats) { if (!icons.has(c.icon)) throw new Error(`Category ${c.id}: icon ${c.icon} is not in the catalog`); defs.categories.push(c.id); }
  put('common/decisions/categories/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\n\n${cats.map(c => renderCategory(c, T)).join('\n\n')}`);

  const leanAt = (op, v) => `FROM = { check_variable = { zin_cold_lean ${op} ${v} } }`;
  const leanFrom = `FROM = {\n  zin_cold_is_clan_realm = yes\n  NOT = { has_war_with = ROOT }\n}`;
  const lean = (v) => `set_temp_variable = { zin_arg_value = ${v} }\nFROM = { zin_cold_add_lean = yes }\ncustom_effect_tooltip = ${v > 0 ? 'zin_cold_tt_lean_up' : 'zin_cold_tt_lean_down'}`;
  const hiddenLean = v => `hidden_effect = {\n${ind(1, `set_temp_variable = { zin_arg_value = ${v} }\nFROM = { zin_cold_add_lean = yes }`)}\n}\ncustom_effect_tooltip = ${v > 0 ? 'zin_cold_tt_lean_up' : 'zin_cold_tt_lean_down'}`;
  const envoyMods = [{ add: 12, when: leanAt('>', 40) }, { add: 8, when: leanAt('>', 20) }, { add: 4, when: leanAt('>', 0) }, { factor: 0, when: 'NOT = { has_political_power > 40 }' }];
  const envoy = (suffix, cost, visible) => ({ id: `zin_cold_send_envoys${suffix}`, icon: 'GFX_idea_zin_envoy', allowed: onlyCol, target_root_trigger: 'has_country_flag = zin_coldor_accord_decisions', target_trigger: leanFrom, visible, available: leanAt('<', 99.99), cost, days_re_enable: N.envoys_cooldown, complete_effect: hiddenLean(N.envoys_lean), ai: { base: 1, mods: envoyMods }, alias: suffix ? 'zin_cold_send_envoys' : undefined });
  const feed = (suffix, cost, visible) => ({ id: `zin_cold_feed_the_steadings${suffix}`, icon: 'GFX_idea_zin_alms_bread', allowed: onlyCol, target_root_trigger: 'has_country_flag = zin_coldor_accord_decisions', target_trigger: leanFrom, visible, available: `zin_cold_winter_is_hard = yes\nFROM = { NOT = { has_country_flag = zin_cold_fed_this_winter } }`, cost, days_re_enable: N.feed_cooldown, complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  zin_cold_feed = yes\n}\ncustom_effect_tooltip = zin_cold_tt_feed`, ai: { base: 0, mods: [{ add: 10, when: `${leanAt('>', -20)}\n${leanAt('<', 50)}` }, { add: 10, when: 'has_political_power > 99' }, { factor: 0, when: 'NOT = { has_political_power > 60 }' }] }, alias: suffix ? 'zin_cold_feed_the_steadings' : undefined });
  const decisionsList = [
    { ...envoy('', N.envoys_cost, 'NOT = { has_country_flag = zin_coldor_cheap_envoys }'), cat: 'zin_cold_accord' },
    { ...envoy('_cheap', N.envoys_cost_cheap, 'has_country_flag = zin_coldor_cheap_envoys'), cat: 'zin_cold_accord' },
    { ...feed('', N.feed_cost, 'NOT = { has_country_flag = zin_cold_winter_stores }'), cat: 'zin_cold_accord' },
    { ...feed('_cheap', N.feed_cost_stores, 'has_country_flag = zin_cold_winter_stores'), cat: 'zin_cold_accord' },
    { id: 'zin_cold_invite_to_accord', cat: 'zin_cold_accord', icon: 'GFX_idea_zin_handshake_oath', allowed: onlyCol, target_root_trigger: 'has_country_flag = zin_coldor_accord_open',
      target_trigger: `FROM = {\n  zin_cold_is_clan_realm = yes\n  is_in_faction = no\n  NOT = { has_war_with = ROOT }\n  NOT = { is_guaranteed_by = ${ISE} }\n}`, available: leanAt('>', N.invite_lean - 0.01), cost: N.invite_cost, days_re_enable: N.invite_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_cold.40 } }',
      ai: { base: 0, mods: [{ add: 20, when: leanAt('>', 59.99) }, { factor: 0, when: 'NOT = { has_political_power > 60 }' }] } },
    { id: 'zin_cold_offer_protection', cat: 'zin_cold_accord', icon: 'GFX_idea_zin_pass_fort', allowed: onlyCol, target_root_trigger: 'has_country_flag = zin_coldor_accord_decisions',
      target_trigger: `FROM = {\n  zin_cold_is_clan_realm = yes\n  is_subject = no\n  NOT = { has_war_with = ROOT }\n}`, available: `${leanAt('>', N.protect_lean - 0.01)}\ncheck_variable = { zin_cold_accord_reach > ${num(N.protect_reach - 0.01)} }`, cost: N.protect_cost, days_re_enable: N.protect_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_cold.41 } }',
      ai: { base: 0, mods: [{ add: 10, when: leanAt('>', 84.99) }, { factor: 0, when: 'NOT = { has_political_power > 150 }' }] } },
    { id: 'zin_cold_bread_for_isengard', cat: 'zin_cold_accord', icon: 'GFX_idea_zin_granary', allowed: onlyCol, visible: 'has_country_flag = zin_cold_open_hand',
      available: `zin_cold_winter_is_hard = yes\ncountry_exists = ${ISE}\nNOT = { ${ISE} = { has_idea = zin_cold_bread_from_fandanar } }`, cost: N.bread_cost, days_re_enable: N.bread_cooldown,
      complete_effect: `${ISE} = { add_timed_idea = { idea = zin_cold_bread_from_fandanar days = ${N.bread_days} } }`,
      ai: { base: 0, mods: [{ add: 12, when: 'has_political_power > 120' }] } },
    { id: 'zin_cold_winter_gifts', cat: 'zin_cold_isengard', icon: 'GFX_idea_zin_tribute_chest', allowed: onlyIse,
      target_trigger: `FROM = {\n  zin_cold_is_clan_realm = yes\n  NOT = { has_war_with = ROOT }\n}`, available: leanAt('>', -99.99), cost: N.gifts_cost, days_re_enable: N.gifts_cooldown,
      complete_effect: hiddenLean(-N.gifts_lean),
      ai: { base: 1, mods: [{ add: 10, when: 'FROM = { is_neighbor_of = ROOT }' }, { factor: 0, when: 'NOT = { has_political_power > 50 }' }] } },
    { id: 'zin_cold_isengard_feeds', cat: 'zin_cold_isengard', icon: 'GFX_idea_zin_alms_bread', allowed: onlyIse,
      target_trigger: `FROM = {\n  zin_cold_is_clan_realm = yes\n  NOT = { has_war_with = ROOT }\n}`, available: `zin_cold_winter_is_hard = yes\nFROM = { NOT = { has_country_flag = zin_cold_fed_this_winter } }`, cost: N.isengard_feed_cost, days_re_enable: N.feed_cooldown,
      complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  zin_cold_feed_by_isengard = yes\n}\ncustom_effect_tooltip = zin_cold_tt_isengard_feed`,
      ai: { base: 0, mods: [{ add: 10, when: 'FROM = { is_neighbor_of = ROOT }' }, { add: 6, when: 'has_political_power > 99' }] } },
    { id: 'zin_cold_sell_timber_west', cat: 'zin_cold_trade', icon: 'GFX_idea_zin_timber_mill', allowed: onlyCol, visible: 'has_country_flag = zin_cold_timber_market',
      available: 'OR = {\n  has_global_flag = zin_west_council\n  check_variable = { global.zin_west_route > 0 }\n}', days_re_enable: N.timber_cooldown,
      complete_effect: `zin_cold_sell_timber = yes\nadd_to_variable = { zin_cold_timber_sales = 1 }`,
      ai: { base: 3, mods: [{ add: 200, when: 'zin_cold_date_timber_1 = yes\ncheck_variable = { zin_cold_timber_sales < 0.99 }' }, { add: 200, when: 'zin_cold_date_timber_2 = yes\ncheck_variable = { zin_cold_timber_sales < 1.99 }' }, { factor: 0, when: 'zin_cold_historical = yes\nNOT = { zin_cold_date_timber_1 = yes }' }] } },
    { id: 'zin_cold_renew_old_pact', cat: 'zin_cold_trade', icon: 'GFX_idea_zin_yeti_claw', allowed: onlyCol, targets: [YET, TIT],
      target_trigger: `OR = {\n  AND = {\n    FROM = { original_tag = ${YET} }\n    ROOT = { check_variable = { zin_cold_yeti_pact < 0.99 } has_country_flag = zin_cold_yeti_refused }\n    FROM = { NOT = { has_country_flag = ${YETI.apartFlag} } }\n  }\n  AND = {\n    FROM = { original_tag = ${TIT} }\n    ROOT = { check_variable = { zin_cold_giant_pact < 0.99 } has_country_flag = zin_cold_giant_refused }\n    FROM = { NOT = { has_country_flag = ${GIANT.apartFlag} } }\n  }\n}`,
      cost: N.renew_cost, days_re_enable: N.renew_cooldown,
      complete_effect: `if = {\n  limit = { FROM = { original_tag = ${YET} } }\n  FROM = { country_event = { id = ${YETI.event} } }\n}\nelse = {\n  FROM = { country_event = { id = ${GIANT.event} } }\n}`,
      ai: { base: 4, mods: [{ factor: 0, when: 'NOT = { has_political_power > 80 }' }] } },
  ];
  const byCat = new Map();
  for (const d of decisionsList) {
    if (!icons.has(d.icon)) throw new Error(`Decision ${d.id}: icon ${d.icon} is not in the catalog`);
    if (d.alias) { T.alias(d.id, d.alias); T.alias(`${d.id}_desc`, `${d.alias}_desc`); }
    defs.decisions.push(d.id);
    if (!byCat.has(d.cat)) byCat.set(d.cat, []);
    byCat.get(d.cat).push(renderDecision({ ...d, extraText: d.id.includes('send_envoys') ? ['zin_cold_tt_lean_up'] : undefined }, T));
  }
  for (const k of ['zin_cold_tt_lean_up', 'zin_cold_tt_lean_down', 'zin_cold_tt_feed', 'zin_cold_tt_isengard_feed']) T.use(k);
  put('common/decisions/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\n\n${[...byCat].map(([cat, list]) => `${cat} = {\n${ind(1, list.join('\n\n'))}\n}`).join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ events
  const leanSteps = (varName, step, from) => Array.from({ length: 10 }, (_, i) => ({ add: step, when: `check_variable = { ${varName} > ${from + i * 10} }` }));
  const eventsList = [
    { id: 'zin_cold.1', hidden: true, fire_only_once: true, immediate: 'zin_cold_startup = yes' },
    { id: 'zin_cold.10', hidden: true, immediate: `zin_cold_roll_winter = yes\nevery_country = {\n  limit = { zin_cold_is_cold = yes }\n  country_event = { id = zin_cold.11 }\n}` },
    { id: 'zin_cold.11', picture: 'GFX_zin_evt_generic_wilds', descVariants: [{ key: 'mild', trigger: 'check_variable = { global.zin_cold_winter < 0.99 }' }, { key: 'hard', trigger: 'check_variable = { global.zin_cold_winter > 0.99 }\ncheck_variable = { global.zin_cold_winter < 1.99 }' }, { key: 'bitter', trigger: 'check_variable = { global.zin_cold_winter > 1.99 }' }], options: [{ key: 'a' }] },
    { id: 'zin_cold.12', picture: 'GFX_zin_evt_generic_wilds', mtth: `days = ${N.raiders_mtth}`,
      trigger: `OR = {\n  original_tag = ${COL}\n  original_tag = ${ISE}\n}\ncheck_variable = { global.zin_cold_winter > 1.99 }\nhas_global_flag = zin_cold_winter_season\nNOT = { has_country_flag = zin_cold_raided_this_winter }\nany_country = { zin_cold_is_clan_realm = yes }`,
      immediate: `set_country_flag = zin_cold_raided_this_winter\nrandom_country = {\n  limit = { zin_cold_is_clan_realm = yes }\n  save_event_target_as = zin_cold_raider\n}`,
      options: [
        { key: 'a', ai: 30, effect: `add_political_power = -${N.raiders_cost}` },
        { key: 'b', ai: 40 },
        { key: 'c', ai: 30, effect: `add_political_power = -${N.raiders_cost}` },
      ] },
    { id: 'zin_cold.13', hidden: true, immediate: 'zin_cold_end_winter = yes' },
    { id: 'zin_cold.20', hidden: true, immediate: `every_country = {\n  limit = { zin_cold_is_clan_realm = yes }\n  if = {\n    limit = { has_country_flag = zin_cold_fed_by_fandanar }\n    set_temp_variable = { zin_arg_value = ${N.moot_lean} }\n    zin_cold_add_lean = yes\n    clr_country_flag = zin_cold_fed_by_fandanar\n  }\n  if = {\n    limit = { has_country_flag = zin_cold_fed_by_isengard }\n    set_temp_variable = { zin_arg_value = -${N.moot_lean} }\n    zin_cold_add_lean = yes\n    clr_country_flag = zin_cold_fed_by_isengard\n  }\n}\nif = {\n  limit = { country_exists = ${COL} }\n  ${COL} = { country_event = { id = zin_cold.21 } }\n}\nif = {\n  limit = { country_exists = ${ISE} }\n  ${ISE} = { country_event = { id = zin_cold.21 } }\n}` },
    { id: 'zin_cold.21', picture: 'GFX_zin_evt_generic_court', options: [{ key: 'a' }] },
    { id: 'zin_cold.30', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 100, mods: [{ factor: 0, when: `check_variable = { zin_cold_isengard_defiance < ${num(N.swear_defiance + 0.01)} }` }] }, effect: `${call('zin_cold_add_defiance', { value: N.charter_refused })}` },
      { key: 'b', ai: { base: 0, mods: [{ add: 100, when: `check_variable = { zin_cold_isengard_defiance < ${num(N.swear_defiance + 0.01)} }` }] }, effect: 'zin_cold_isengard_swears = yes' },
    ] },
    { id: 'zin_cold.31', picture: 'GFX_zin_evt_generic_war', mtth: `days = ${N.forts_mtth}`,
      trigger: `original_tag = ${COL}\ncountry_exists = ${ISE}\nzin_cold_historical = no\nzin_cold_march_war_allowed = yes\n${ISE} = {\n  is_ai = yes\n  check_variable = { zin_cold_isengard_defiance > ${num(N.march_defiance - 0.01)} }\n}`,
      options: [{ key: 'a', ai: 100, effect: 'zin_cold_start_march_war = yes' }] },
    { id: 'zin_cold.32', kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: 'zin_cold_is_cold = yes', descVariants: [{ key: 'coldor', trigger: 'check_variable = { global.zin_cold_march_winner = 1 }' }, { key: 'isengard', trigger: 'check_variable = { global.zin_cold_march_winner = 2 }' }], options: [{ key: 'a' }] },
    { id: 'zin_cold.33', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 100, mods: [{ factor: 0, when: `check_variable = { zin_cold_isengard_defiance < ${N.marriage_defiance + 0.01}  }` }] }, effect: `${call('zin_cold_add_defiance', { value: N.marriage_refused })}` },
      { key: 'b', ai: { base: 0, mods: [{ add: 100, when: `check_variable = { zin_cold_isengard_defiance < ${N.marriage_defiance + 0.01} }` }] }, effect: `${call('zin_cold_add_defiance', { value: -N.marriage_accepted })}\nadd_opinion_modifier = { target = ${COL} modifier = zin_cold_marriage_kin }\n${COL} = { add_opinion_modifier = { target = ${ISE} modifier = zin_cold_marriage_kin } }` },
    ] },
    { id: 'zin_cold.34', hidden: true, immediate: call('zin_cold_end_march_war', { winner: 1 }) },
    { id: 'zin_cold.35', hidden: true, immediate: call('zin_cold_end_march_war', { winner: 2 }) },
    { id: 'zin_cold.36', hidden: true, immediate: `if = {\n  limit = { has_global_flag = zin_cold_march_war_active }\n  clr_global_flag = zin_cold_march_war_active\n${ind(1, call('zin_cold_add_defiance', { value: 0 }))}\n}` },
    { id: 'zin_cold.40', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 40 }, effect: `${call('zin_cold_add_lean', { value: -N.decline_lean })}` },
      { key: 'b', ai: { base: 0, mods: leanSteps('zin_cold_lean', 10, -1) }, effect: `FROM = { add_to_faction = ROOT }\nadd_opinion_modifier = { target = FROM modifier = zin_cold_accord_kin }\nFROM = { add_opinion_modifier = { target = ROOT modifier = zin_cold_accord_kin } }` },
    ] },
    { id: 'zin_cold.41', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 60 }, effect: `${call('zin_cold_add_lean', { value: -N.refuse_lean })}` },
      { key: 'b', ai: { base: 0, mods: [...leanSteps('zin_cold_lean', 10, 39), { factor: 2, when: 'has_war = yes' }] }, effect: 'FROM = { puppet = ROOT }' },
    ] },
    { id: 'zin_cold.50', picture: 'GFX_zin_evt_generic_war', options: [
      { key: 'a', ai: 0 },
      { key: 'b', ai: 100, effect: `if = {\n  limit = { has_variable = global.zin_cold_invader }\n  var:global.zin_cold_invader = {\n    ROOT = { add_to_war = { targeted_alliance = FROM enemy = PREV hostility_reason = asked_to_join } }\n  }\n}` },
    ] },
    ...[[YETI, 'zin_cold_yeti_refused'], [GIANT, 'zin_cold_giant_refused']].map(([p, refused]) => ({ id: p.event, picture: 'GFX_zin_evt_generic_wilds', options: [
      { key: 'a', ai: { base: 100, mods: [{ factor: 0, when: `has_country_flag = ${p.apartFlag}` }, { factor: 0.5, when: `has_country_flag = ${p.openFlag}` }] }, effect: `${call(`zin_cold_add_lean`, { value: -5 })}\nFROM = { set_country_flag = ${refused} }` },
      { key: 'b', ai: { base: 60, mods: [...leanSteps('zin_cold_lean', 1, 9).slice(0, 5), { factor: 2, when: `has_country_flag = ${p.openFlag}` }, { factor: 0, when: `has_country_flag = ${p.apartFlag}` }] }, effect: `FROM = {\n  clr_country_flag = ${refused}\n${ind(2, call(`zin_cold_add_${p.key}_pact`, { value: 1 }))}\n}` },
    ] })),
    { id: 'zin_cold.60', picture: 'GFX_zin_evt_generic_wilds', fire_only_once: true, auto: true,
      trigger: `original_tag = ${COL}\nhas_country_flag = zin_cold_watch_fires\nhas_global_flag = zin_afrit_at_yeldenne\nNOT = { has_global_flag = zin_horos_dead }`, mtth: 'days = 2',
      options: [
        { key: 'a', ai: 100 },
        { key: 'b', ai: 0, effect: `set_global_flag = zin_yeldenne_forewarned\nrandom_country = {\n  limit = { any_owned_state = { zin_is_site_parim = yes } }\n  ROOT = { add_opinion_modifier = { target = PREV modifier = zin_cold_temple_swords } }\n}` },
      ] },
    { id: 'zin_cold.61', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 100, mods: [{ factor: 0, when: `FROM = { has_country_flag = zin_cold_hall_respected NOT = { has_country_flag = zin_glo_conqueror } }` }] } },
      { key: 'b', ai: { base: 0, mods: [{ add: 100, when: `FROM = { has_country_flag = zin_cold_hall_respected NOT = { has_country_flag = zin_glo_conqueror } }` }] }, effect: `${call('zin_yeldenne_add_wards', { value: N.guard_wards })}\nFROM = {\n  give_guarantee = ROOT\n  add_ideas = zin_cold_hall_guard\n  add_opinion_modifier = { target = ROOT modifier = zin_cold_hall_friend }\n}\nadd_opinion_modifier = { target = FROM modifier = zin_cold_hall_friend }` },
    ] },
    { id: 'zin_cold.70', picture: 'GFX_zin_evt_generic_peace', options: [
      { key: 'a', ai: 0, effect: `${GUN} = { add_opinion_modifier = { target = ROOT modifier = zin_cold_road_refused } }` },
      { key: 'b', ai: 100, effect: 'zin_cold_open_neck_road = yes' },
    ] },
    { id: 'zin_cold.71', picture: 'GFX_zin_evt_generic_sea', options: [
      { key: 'a', ai: { base: 100, mods: [{ factor: 0, when: 'check_variable = { zin_cold_lean > -0.01 }' }, { factor: 0, when: 'NOT = { has_country_flag = zin_regional_windwaith_free_harbours }' }] }, effect: `${call('zin_cold_add_lean', { value: -10 })}` },
      { key: 'b', ai: { base: 0, mods: [{ add: 100, when: 'check_variable = { zin_cold_lean > -0.01 }' }, { factor: 0, when: 'has_country_flag = zin_regional_windwaith_free_harbours' }] }, effect: `add_ideas = zin_cold_harbour_compact\nFROM = { add_ideas = zin_cold_harbour_compact }\n${call('zin_cold_add_lean', { value: 20 })}` },
    ] },
  ];
  eventsList.find(e => e.id === 'zin_cold.12').options = [
    { key: 'a', ai: 30, effect: `add_political_power = -${N.raiders_cost}` },
    { key: 'b', ai: 40, effect: `army_experience = ${N.raiders_xp}\nif = {\n  limit = { original_tag = ${COL} }\n  event_target:zin_cold_raider = {\n${ind(2, call('zin_cold_add_lean', { value: -10 }))}\n  }\n}\nelse = {\n  event_target:zin_cold_raider = {\n${ind(2, call('zin_cold_add_lean', { value: 10 }))}\n  }\n}` },
    { key: 'c', ai: 30, effect: `add_political_power = -${N.raiders_cost}\nif = {\n  limit = { original_tag = ${COL} }\n  event_target:zin_cold_raider = {\n${ind(2, call('zin_cold_add_lean', { value: 10 }))}\n    set_country_flag = zin_cold_fed_by_fandanar\n  }\n}\nelse = {\n  event_target:zin_cold_raider = {\n${ind(2, call('zin_cold_add_lean', { value: -10 }))}\n    set_country_flag = zin_cold_fed_by_isengard\n  }\n}` },
  ];
  const eventTexts = [];
  for (const e of eventsList) {
    if (!e.hidden && !pictures.has(e.picture)) throw new Error(`Event ${e.id}: picture ${e.picture} is not in the catalog`);
    eventTexts.push(renderEvent(e, T)); defs.events.push(e.id);
  }
  put('events/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\nadd_namespace = zin_cold\n\n${eventTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ on_actions and AI
  put('common/on_actions/zin_cold.txt', `${HEADER('mech_cold', SPEC)}
on_actions = {
	on_startup = {
		effect = {
			${COL} = { country_event = { id = zin_cold.1 } }
		}
	}
	on_monthly = {
		effect = {
			if = {
				limit = { zin_cold_is_runner = yes }
				zin_cold_monthly = yes
			}
		}
	}
	on_declare_war = {
		effect = {
			zin_cold_on_declare_war = yes
		}
	}
}`);
  const strat = (id, enable, lines) => `${id} = {\n\tenable = { ${enable} }\n\tabort_when_not_enabled = yes\n${lines.map(([type, tg, v]) => `\tai_strategy = {\n\t\ttype = ${type}\n\t\tid = "${tg}"\n\t\tvalue = ${v}\n\t}`).join('\n')}\n}`;
  put('common/ai_strategy/zin_cold.txt', [
    HEADER('mech_cold', SPEC),
    strat('zin_cold_coldor_stance', `original_tag = ${COL}`, [['befriend', HOR, N.ai_befriend_horidor], ['antagonize', ISE, N.ai_antagonize_isengard]]),
    strat('zin_cold_isengard_stance', `original_tag = ${ISE}`, [['antagonize', COL, N.ai_isengard_antagonize]]),
    strat('zin_cold_clans_lean_fandanar', `zin_cold_is_clan_realm = yes\n\t\tcheck_variable = { zin_cold_lean > 50 }`, [['befriend', COL, N.ai_clan_befriend]]),
    strat('zin_cold_clans_lean_isengard', `zin_cold_is_clan_realm = yes\n\t\tcheck_variable = { zin_cold_lean < -50 }`, [['befriend', ISE, N.ai_clan_befriend]]),
  ].join('\n\n'));
  defs.aiStrategies.push('zin_cold_coldor_stance', 'zin_cold_isengard_stance', 'zin_cold_clans_lean_fandanar', 'zin_cold_clans_lean_isengard');

  // ------------------------------------------------------------------------------------------------ text and output
  const unused = T.unused();
  if (unused.length) throw new Error(`mech_cold: the data file holds text nothing uses: ${unused.join(', ')}`);
  const entries = T.entries();
  await assertCleanText('mech_cold', entries);
  for (const [rel, text] of files) staged.text(rel, text);
  staged.loc('zin_cold', entries);
  return {
    files: [...files.keys(), 'localisation/english/zin_cold_l_english.yml'].sort(), text: entries, definitions: defs, dependencies: COLD_DEPENDENCIES, externalEvents: [],
    counts: { effects: defs.effects.length, triggers: defs.triggers.length, events: defs.events.length, decisions: defs.decisions.length, categories: defs.categories.length, ideas: defs.ideas.length, opinions: defs.opinions.length, dynamicModifiers: defs.dynamicModifiers.length, textKeys: Object.keys(entries).length },
    tags: { coldor: COL, isengard: ISE, yeldenne: YEL, horidor: HOR, windwaith: WIN, gunwaith: GUN, yeti: YET, titanos: TIT, clanRealms: clans.length },
  };
}
