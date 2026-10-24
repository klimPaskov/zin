// The eastern kings mechanic (docs/specs/04_mechanics/eastern_kings.md): the caravan roads and their charters, the rivalry of Noris
// and Stabilo, the courts' lean, the kneel bias, the eastern coalition and the invasion of the Magical Lands, the King of the East as
// the East lives it, the unified East, and the South Lands desert.
//   buildMechEast(staged, { countries, data?, treeDir? }) -> { files, counts, definitions, dependencies, externalEvents, ... }
// This file writes the scripted triggers and the effects; mech_east_content.mjs the ideas, modifiers, decisions, events, on_actions and AI.
// Deviations (docs/design/stage2/mech_regions.md): the road, rift and South Lands state lists are rows of the key-sites table (decision
// E7: sites.mjs resolves the `path` rule), not computed here; the events the events engineers own (zin_east.41 to .46, .50 to .52, .60)
// are fired, and served by effects of this module, never defined.
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fmt, ind, join, call, num, HEADER, Texts, resolveCountries, dateTrigger, assertCleanText } from '../lib/mech_kit.mjs';
import { buildEastContent } from './mech_east_content.mjs';
import { ZIN } from '../lib/paths.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const EAST_DATA_FILE = path.join(here, '../data/mech_regions_east.json');
export const loadEastData = async (file = EAST_DATA_FILE) => JSON.parse(await readFile(file, 'utf8'));
export const EAST_SPEC = 'docs/specs/04_mechanics/eastern_kings.md';
export const ROADS = [{ key: 'salt', code: 1 }, { key: 'gold', code: 2 }, { key: 'rift', code: 3 }, { key: 'lake', code: 4 }, { key: 'sand', code: 5 }];

/** Names this module uses and does not define. */
export const EAST_DEPENDENCIES = {
  effects: ['zin_afrit_add_footholds', 'zin_afrit_add_veil', 'zin_elves_on_eastern_invasion'],
  treeEffects: ['zin_noris_monthly', 'zin_stabilo_monthly', 'zin_stabilo_add_debt'],
  triggers: ['zin_is_region_east_lands', 'zin_is_region_south_lands', 'zin_is_site_road_salt', 'zin_is_site_road_gold', 'zin_is_site_road_rift', 'zin_is_site_road_lake', 'zin_is_site_road_sand', 'zin_is_site_rift_east', 'zin_is_site_rift_west', 'zin_afrit_is_hub', 'zin_rules_is_historical', 'zin_rules_ai_branch_east_refuse_afrit', 'zin_rules_ai_branch_east_unite_without_afrit', 'zin_rules_ai_random_east'],
  autonomy: ['zin_autonomy_eastern_client'],
  factionTemplates: ['zin_faction_free_crowns'],
  gameRules: ['zin_rule_ai_east'],
  dynamicModifiers: ['zin_cb_eastern_ambition'],
  opinions: ['zin_opinion_caravan_rivalry'],
  events: ['zin_east.41', 'zin_east.42', 'zin_east.43', 'zin_east.44', 'zin_east.45', 'zin_east.46', 'zin_east.50', 'zin_east.51', 'zin_east.52', 'zin_east.60'],
  externalEventRefs: ['zin_stabilo.30', 'zin_stabilo.31', 'zin_stabilo.33'],
  variables: ['zin_footholds', 'zin_stabilo_debt', 'zin_gathering_dark', 'zin_story_pace'],
  globalFlags: ['zin_golden_king_dead', 'zin_war_of_last_crowns', 'zin_afrit_king_of_east', 'zin_afrit_dead', 'zin_afrit_returned', 'zin_afrit_abandoned_aenor', 'zin_eindil_returned', 'zin_eastern_invasion'],
  countryFlags: ['zin_region_east_lands', 'zin_region_magical_lands', 'zin_afrit_eastern_client', 'zin_afrit_refused_east', 'zin_east_pledged', 'zin_east_rift_ambition', 'zin_east_route_resist', 'zin_east_court_audit', 'zin_east_wells_unlocked', 'zin_east_courts_noris', 'zin_east_courts_stabilo', 'zin_noris_route_shield', 'zin_noris_route_high_king', 'zin_noris_envoys', 'zin_noris_open_treaty', 'zin_noris_banner', 'zin_noris_audit', 'zin_stabilo_route_free', 'zin_stabilo_route_empire', 'zin_stabilo_envoys', 'zin_stabilo_open_pact', 'zin_stabilo_pact_under_prince', 'zin_stabilo_audit', 'zin_stabilo_rival_banks', 'zin_stabilo_ledger_open', 'zin_stabilo_loans_to_kings', 'zin_stabilo_collect', 'zin_stabilo_bought_off', 'zin_story_war'],
};

export async function buildMechEast(staged, ctx) {
  const data = ctx.data ?? await loadEastData();
  const N = data.numbers, R = data.roster, T = new Texts(data.text);
  const found = resolveCountries(ctx.countries, [R.noris, R.stabilo, ...R.great, ...Object.keys(R.leans)], R.scan);
  const others = resolveCountries(ctx.countries, [R.aenor, R.worshipdom]);
  const east = ctx.countries.filter(c => c.scan === R.scan);
  if (east.length !== R.expectedCountries) throw new Error(`The roster has ${east.length} ${R.scan} countries, the data expects ${R.expectedCountries}`);
  const statesTotal = east.reduce((a, c) => a + c.states, 0);
  if (statesTotal !== R.expectedStates) throw new Error(`The ${R.scan} countries hold ${statesTotal} states, the data expects ${R.expectedStates}`);
  const tag = n => (found.get(n) ?? others.get(n)).tag;
  const tags = { NOR: tag(R.noris), STA: tag(R.stabilo), AEN: tag(R.aenor), WOR: tag(R.worshipdom) };
  const { NOR, STA, AEN, WOR } = tags;
  const files = new Map();
  const put = (rel, text) => files.set(rel, text.endsWith('\n') ? text : text + '\n');
  const defs = { effects: [], triggers: [], dateTriggers: [], events: [], decisions: [], categories: [], ideas: [], opinions: [], dynamicModifiers: [], aiStrategies: [], stubs: [], scriptedLocs: [] };
  const treeDir = ctx.treeDir ?? path.join(ZIN, 'docs/design/focus');
  const treeDeclares = async (file, name) => { const f = path.join(treeDir, file); if (!existsSync(f)) return false; try { return name in (JSON.parse(await readFile(f, 'utf8')).scripted_effects ?? {}); } catch { return false; } };

  // ------------------------------------------------------------------------------------------------ triggers
  const trig = [];
  const T_ = (id, body) => { defs.triggers.push(id); trig.push(`${id} = {\n${ind(1, fmt(body))}\n}`); };
  T_('zin_is_noris', `original_tag = ${NOR}`);
  T_('zin_is_stabilo', `original_tag = ${STA}`);
  T_('zin_east_in_region', 'has_country_flag = zin_region_east_lands');
  T_('zin_east_is_power', `OR = {\n  original_tag = ${NOR}\n  original_tag = ${STA}\n}`);
  T_('zin_east_is_court', `zin_east_in_region = yes\nzin_east_is_power = no`);
  T_('zin_east_is_south_court', 'has_country_flag = zin_east_south_court');
  T_('zin_east_faces_rift', 'any_owned_state = { zin_is_site_rift_east = yes }');
  T_('zin_east_is_runner', `OR = {
  original_tag = ${NOR}
  AND = {
    NOT = { country_exists = ${NOR} }
    original_tag = ${STA}
  }
  AND = {
    NOT = { country_exists = ${NOR} }
    NOT = { country_exists = ${STA} }
    zin_east_in_region = yes
    NOT = {
      any_other_country = {
        zin_east_in_region = yes
        check_variable = { num_owned_states > PREV.num_owned_states }
      }
    }
  }
}`);
  for (const [key, [y, m, d]] of Object.entries(N.dates)) { const id = `zin_east_after_${key}`; trig.push(dateTrigger(id, y, m, d, `Standard date ${y}.${m}.${d}, shifted by the story pace.`)); defs.triggers.push(id); defs.dateTriggers.push(id); }
  T_('zin_east_caravan_war_open', `OR = {
  has_global_flag = zin_war_of_last_crowns
  AND = {
    check_variable = { global.zin_east_rivalry > ${num(N.war_rivalry - 0.01)} }
    check_variable = { global.zin_gathering_dark > ${num(N.war_dark - 0.01)} }
    zin_east_after_caravan_war = yes
  }
}`);
  T_('zin_east_question_open', `OR = {
  has_global_flag = zin_afrit_king_of_east
  has_global_flag = zin_eastern_invasion
  AND = {
    has_global_flag = zin_golden_king_dead
    zin_east_after_rift_talk = yes
  }
}`);
  T_('zin_east_rule_refuse', `is_ai = yes\nOR = {\n  zin_rules_ai_branch_east_refuse_afrit = yes\n  AND = {\n    zin_rules_ai_random_east = yes\n    check_variable = { global.zin_east_rule_roll = 1 }\n  }\n}`);
  T_('zin_east_rule_unite', `is_ai = yes\nOR = {\n  zin_rules_ai_branch_east_unite_without_afrit = yes\n  AND = {\n    zin_rules_ai_random_east = yes\n    check_variable = { global.zin_east_rule_roll = 2 }\n  }\n}`);
  T_('zin_east_free_crown', 'has_country_flag = zin_afrit_refused_east\nhas_global_flag = zin_afrit_king_of_east\nNOT = { has_global_flag = zin_afrit_dead }');
  put('common/scripted_triggers/zin_east.txt', `${HEADER('mech_east', EAST_SPEC)}\n\n${trig.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ effects
  const eff = [];
  const E_ = (id, body) => { defs.effects.push(id); eff.push(`${id} = {\n${ind(1, fmt(body))}\n}`); };
  const roadSwitch = body => ROADS.map(r => `if = {\n  limit = { check_variable = { zin_arg_road = ${r.code} } }\n${ind(1, fmt(body(r)))}\n}`).join('\n');
  const inf = r => `zin_east_inf_${r.key}`;
  const powers = [{ tag: NOR, code: 1, name: 'noris' }, { tag: STA, code: 2, name: 'stabilo' }];
  const mine = '(is_controlled_by = PREV)';

  E_('zin_east_add_road_influence', roadSwitch(r => `add_to_variable = { ${inf(r)} = zin_arg_value }\nclamp_variable = { var = ${inf(r)} min = 0 max = 100 }`));
  E_('zin_east_add_all_roads', ROADS.map(r => `add_to_variable = { ${inf(r)} = zin_arg_value }\nclamp_variable = { var = ${inf(r)} min = 0 max = 100 }`).join('\n'));
  E_('zin_east_add_rivalry', `add_to_variable = { global.zin_east_rivalry = zin_arg_value }
clamp_variable = { var = global.zin_east_rivalry min = 0 max = 100 }
if = {
  limit = {
    has_global_flag = zin_east_roads_concord_cap
    check_variable = { global.zin_east_rivalry > ${N.concord_cap} }
  }
  set_variable = { global.zin_east_rivalry = ${N.concord_cap} }
}`);
  E_('zin_east_add_lean', `if = {
  limit = { has_variable = zin_east_lean }
  add_to_variable = { zin_east_lean = zin_arg_value }
  clamp_variable = { var = zin_east_lean min = -100 max = 100 }
}`);
  E_('zin_east_refresh_wealth', `set_variable = { zin_east_charters = 0 }
${powers.map(p => `if = {\n  limit = { original_tag = ${p.tag} }\n${ind(1, ROADS.map(r => `if = {\n  limit = { check_variable = { global.zin_east_road_${r.key} = ${p.code} } }\n  add_to_variable = { zin_east_charters = 1 }\n}`).join('\n'))}\n}`).join('\n')}
if = {
  limit = { has_global_flag = zin_east_roads_concord }
  set_variable = { zin_east_charters = ${N.concord_roads_half} }
}
set_variable = { zin_east_cw_pp = zin_east_charters }
multiply_variable = { zin_east_cw_pp = ${N.wealth_pp} }
set_variable = { zin_east_cw_trade = zin_east_charters }
multiply_variable = { zin_east_cw_trade = ${N.wealth_trade} }
set_variable = { zin_east_cw_cg = zin_east_charters }
multiply_variable = { zin_east_cw_cg = -${N.wealth_cg} }
force_update_dynamic_modifier = yes`);
  E_('zin_east_update_dominance', `set_temp_variable = { zin_east_mine = 0 }
set_temp_variable = { zin_east_allies = 0 }
every_state = {
  limit = {
    zin_is_region_east_lands = yes
    OR = {
      is_controlled_by = PREV
      controller = { is_subject_of = PREV.PREV }
    }
  }
  add_to_temp_variable = { zin_east_mine = 1 }
}
every_state = {
  limit = {
    zin_is_region_east_lands = yes
    NOT = { is_controlled_by = PREV }
    controller = {
      is_in_faction_with = PREV.PREV
      NOT = { is_subject_of = PREV.PREV }
    }
  }
  add_to_temp_variable = { zin_east_allies = 1 }
}
multiply_temp_variable = { zin_east_allies = 0.5 }
add_to_temp_variable = { zin_east_mine = zin_east_allies }
multiply_temp_variable = { zin_east_mine = 100 }
divide_temp_variable = { zin_east_mine = global.zin_east_states_total }
set_variable = { zin_east_dominance = zin_east_mine }
clamp_variable = { var = zin_east_dominance min = 0 max = 100 }`);
  E_('zin_east_count_roads', ROADS.map(r => `set_variable = { zin_east_ctrl_${r.key} = 0 }
every_state = {
  limit = {
    zin_is_site_road_${r.key} = yes
    OR = {
      is_controlled_by = PREV
      controller = {
        OR = {
          is_subject_of = PREV.PREV
          is_in_faction_with = PREV.PREV
        }
      }
    }
  }
  add_to_variable = { PREV.zin_east_ctrl_${r.key} = 1 }
}`).join('\n'));

  // the monthly influence, charter and rivalry update, one block per road
  const roadMonth = r => {
    const k = r.key;
    const drift = p => `${p.tag} = {
  set_temp_variable = { zin_e_other = ${p.code === 1 ? `zin_e_sc_${k}` : `zin_e_nc_${k}`} }
  if = {
    limit = { check_variable = { zin_east_ctrl_${k} > zin_e_other } }
    add_to_variable = { ${inf(r)} = ${N.drift_control} }
  }
  if = {
    limit = { check_variable = { global.zin_east_road_${k} = ${p.code} } }
    add_to_variable = { ${inf(r)} = ${N.drift_holder} }
  }
  add_to_variable = { ${inf(r)} = zin_east_caravan_bonus }
  if = {
    limit = { check_variable = { ${inf(r)} > ${N.drift_cap_above} } }
    add_to_variable = { ${inf(r)} = -${N.drift_cap} }
  }
  clamp_variable = { var = ${inf(r)} min = 0 max = 100 }
}`;
    return `# ${k}
${NOR} = { set_temp_variable = { zin_e_nc_${k} = zin_east_ctrl_${k} } }
${STA} = { set_temp_variable = { zin_e_sc_${k} = zin_east_ctrl_${k} } }
if = {
  limit = { NOT = { has_global_flag = zin_east_roads_concord } }
${ind(1, drift(powers[0]))}
${ind(1, drift(powers[1]))}
  # conquest: two thirds of the road in one alliance's hands
  set_temp_variable = { zin_e_total3 = global.zin_east_roadn_${k} }
  multiply_temp_variable = { zin_e_total3 = ${N.conquest_share} }
  add_to_temp_variable = { zin_e_total3 = -0.5 }
  set_temp_variable = { zin_e_n3 = zin_e_nc_${k} }
  multiply_temp_variable = { zin_e_n3 = 3 }
  set_temp_variable = { zin_e_s3 = zin_e_sc_${k} }
  multiply_temp_variable = { zin_e_s3 = 3 }
  if = {
    limit = {
      check_variable = { global.zin_east_roadn_${k} > 0 }
      check_variable = { zin_e_n3 > zin_e_total3 }
    }
    ${NOR} = { set_variable = { ${inf(r)} = 100 } }
    ${STA} = { set_variable = { ${inf(r)} = 0 } }
  }
  else_if = {
    limit = {
      check_variable = { global.zin_east_roadn_${k} > 0 }
      check_variable = { zin_e_s3 > zin_e_total3 }
    }
    ${STA} = { set_variable = { ${inf(r)} = 100 } }
    ${NOR} = { set_variable = { ${inf(r)} = 0 } }
  }
  ${NOR} = { set_temp_variable = { zin_e_n = ${inf(r)} } }
  ${STA} = { set_temp_variable = { zin_e_s = ${inf(r)} } }
  # a power that is gone gives its charters up
  if = {
    limit = { NOT = { country_exists = ${NOR} } }
    set_variable = { global.zin_east_road_${k} = 0 }
  }
  if = {
    limit = { NOT = { country_exists = ${STA} } }
    set_variable = { global.zin_east_road_${k} = 0 }
  }
  set_temp_variable = { zin_e_lead = zin_e_n }
  subtract_from_temp_variable = { zin_e_lead = zin_e_s }
  set_temp_variable = { zin_e_back = zin_e_s }
  subtract_from_temp_variable = { zin_e_back = zin_e_n }
  set_temp_variable = { zin_e_new = global.zin_east_road_${k} }
  if = {
    limit = { check_variable = { global.zin_east_road_${k} = 0 } }
    if = {
      limit = {
        country_exists = ${NOR}
        check_variable = { zin_e_n > ${N.charter_free - 0.01} }
        check_variable = { zin_e_lead > ${N.charter_gap - 0.01} }
      }
      set_temp_variable = { zin_e_new = 1 }
    }
    else_if = {
      limit = {
        country_exists = ${STA}
        check_variable = { zin_e_s > ${N.charter_free - 0.01} }
        check_variable = { zin_e_back > ${N.charter_gap - 0.01} }
      }
      set_temp_variable = { zin_e_new = 2 }
    }
  }
  else_if = {
    limit = {
      check_variable = { global.zin_east_road_${k} = 1 }
      check_variable = { zin_e_n < ${N.charter_lose} }
      check_variable = { zin_e_s > ${N.charter_free - 0.01} }
    }
    set_temp_variable = { zin_e_new = 2 }
  }
  else_if = {
    limit = {
      check_variable = { global.zin_east_road_${k} = 2 }
      check_variable = { zin_e_s < ${N.charter_lose} }
      check_variable = { zin_e_n > ${N.charter_free - 0.01} }
    }
    set_temp_variable = { zin_e_new = 1 }
  }
  if = {
    limit = { NOT = { check_variable = { zin_e_new = global.zin_east_road_${k} } } }
    set_variable = { global.zin_east_road_${k} = zin_e_new }
    set_variable = { global.zin_east_last_road = ${r.code} }
    set_variable = { global.zin_east_last_winner = zin_e_new }
    set_temp_variable = { zin_arg_value = ${N.charter_rivalry} }
    zin_east_add_rivalry = yes
    zin_east_charter_changed = yes
  }
}
# courts on a held road drift toward its holder
if = {
  limit = { check_variable = { global.zin_east_road_${k} = 1 } }
  every_country = {
    limit = {
      zin_east_is_court = yes
      any_owned_state = { zin_is_site_road_${k} = yes }
    }
    set_temp_variable = { zin_arg_value = ${N.court_drift} }
    zin_east_add_lean = yes
  }
}
if = {
  limit = { check_variable = { global.zin_east_road_${k} = 2 } }
  every_country = {
    limit = {
      zin_east_is_court = yes
      any_owned_state = { zin_is_site_road_${k} = yes }
    }
    set_temp_variable = { zin_arg_value = -${N.court_drift} }
    zin_east_add_lean = yes
  }
}`;
  };
  E_('zin_east_charter_changed', `# the loser is shaken, the winner is envied; the news goes to both powers and to every court on the road
if = {
  limit = { check_variable = { global.zin_east_last_winner = 1 } }
  ${STA} = {
    set_country_flag = { flag = zin_east_in_crisis days = 365 }
    add_opinion_modifier = { target = ${NOR} modifier = zin_east_charter_lost }
  }
}
else_if = {
  limit = { check_variable = { global.zin_east_last_winner = 2 } }
  ${NOR} = {
    set_country_flag = { flag = zin_east_in_crisis days = 365 }
    add_opinion_modifier = { target = ${STA} modifier = zin_east_charter_lost }
  }
}
if = { limit = { country_exists = ${NOR} } ${NOR} = { country_event = { id = zin_east.10 } } }
if = { limit = { country_exists = ${STA} } ${STA} = { country_event = { id = zin_east.10 } } }
${ROADS.map(r => `if = {\n  limit = { check_variable = { global.zin_east_last_road = ${r.code} } }\n  every_country = {\n    limit = {\n      zin_east_is_court = yes\n      any_owned_state = { zin_is_site_road_${r.key} = yes }\n    }\n    country_event = { id = zin_east.10 }\n  }\n}`).join('\n')}`);
  E_('zin_east_roads_month', `# a power that is gone leaves the survivor +20 influence on each road, once
if = {
  limit = {
    NOT = { country_exists = ${NOR} }
    NOT = { has_global_flag = zin_east_noris_gone }
  }
  set_global_flag = zin_east_noris_gone
  ${STA} = {
${ind(2, call('zin_east_add_all_roads', { value: N.survivor_influence }))}
  }
}
if = {
  limit = {
    NOT = { country_exists = ${STA} }
    NOT = { has_global_flag = zin_east_stabilo_gone }
  }
  set_global_flag = zin_east_stabilo_gone
  ${NOR} = {
${ind(2, call('zin_east_add_all_roads', { value: N.survivor_influence }))}
  }
}
${NOR} = { zin_east_count_roads = yes }
${STA} = { zin_east_count_roads = yes }
${ROADS.map(roadMonth).join('\n')}
${NOR} = { zin_east_refresh_wealth = yes }
${STA} = { zin_east_refresh_wealth = yes }`);

  E_('zin_east_update_bias', `set_temp_variable = { zin_east_b = 0 }
if = {
  limit = { has_country_flag = zin_east_coalition_member }
  add_to_temp_variable = { zin_east_b = ${N.bias_coalition} }
}
if = {
  limit = { has_country_flag = zin_east_owes_temples }
  add_to_temp_variable = { zin_east_b = ${N.bias_temples} }
}
if = {
  limit = { has_country_flag = zin_east_in_crisis }
  add_to_temp_variable = { zin_east_b = ${N.bias_crisis} }
}
if = {
  limit = { is_faction_leader = yes }
  add_to_temp_variable = { zin_east_b = -${N.bias_leader} }
}
if = {
  limit = {
    is_in_faction = yes
    any_other_country = {
      is_faction_leader = yes
      is_in_faction_with = PREV
      has_country_flag = zin_afrit_refused_east
    }
  }
  add_to_temp_variable = { zin_east_b = -${N.bias_refuser_faction} }
}
if = {
  limit = { check_variable = { zin_stabilo_debt > ${N.bias_debt - 0.01} } }
  if = {
    limit = { ${STA} = { has_country_flag = zin_stabilo_rival_banks } }
    add_to_temp_variable = { zin_east_b = -${N.bias_debt_rivals} }
  }
  else = { add_to_temp_variable = { zin_east_b = -${N.bias_debt_value} } }
}
if = {
  limit = { has_country_flag = zin_east_pledged }
  add_to_temp_variable = { zin_east_b = ${N.bias_pledged} }
}
if = {
  limit = {
    OR = {
      has_country_flag = zin_east_route_resist
      has_country_flag = zin_noris_route_shield
      has_country_flag = zin_stabilo_route_free
    }
  }
  add_to_temp_variable = { zin_east_b = -${N.bias_resist} }
}
if = {
  limit = {
    OR = {
      has_country_flag = zin_noris_route_high_king
      has_country_flag = zin_stabilo_route_empire
    }
  }
  add_to_temp_variable = { zin_east_b = -${N.bias_unite} }
}
if = {
  limit = {
    OR = {
      zin_east_rule_refuse = yes
      zin_east_rule_unite = yes
    }
  }
  add_to_temp_variable = { zin_east_b = -${N.bias_rule} }
}
if = {
  limit = { has_country_flag = zin_east_delayed_host }
  add_to_temp_variable = { zin_east_b = -${N.bias_delayed} }
}
set_variable = { zin_east_kneel_bias = zin_east_b }
clamp_variable = { var = zin_east_kneel_bias min = -100 max = 100 }`);

  // the coalition (section 5): weights, selection, the crossing and the turn west. The events of the events engineers call these.
  E_('zin_east_compute_weight', `set_temp_variable = { zin_e_w = zin_footholds }
multiply_temp_variable = { zin_e_w = ${N.weight_foothold} }
set_temp_variable = { zin_e_states = num_owned_states }
divide_temp_variable = { zin_e_states = 2 }
round_temp_variable = { zin_e_states }
clamp_temp_variable = { var = zin_e_states min = 0 max = ${N.weight_states_cap} }
add_to_temp_variable = { zin_e_w = zin_e_states }
if = {
  limit = { zin_east_faces_rift = yes }
  add_to_temp_variable = { zin_e_w = ${N.weight_rift} }
}
if = {
  limit = { has_country_flag = zin_east_rift_ambition }
  add_to_temp_variable = { zin_e_w = ${N.weight_ambition} }
}
if = {
  limit = { has_government = fascism }
  add_to_temp_variable = { zin_e_w = ${N.weight_dominion} }
}
if = {
  limit = { has_country_flag = zin_east_in_crisis }
  add_to_temp_variable = { zin_e_w = ${N.weight_crisis} }
}
if = {
  limit = { has_country_flag = zin_east_rift_whispered }
  add_to_temp_variable = { zin_e_w = ${N.weight_whispered} }
}
set_temp_variable = { zin_e_bias5 = zin_east_kneel_bias }
divide_temp_variable = { zin_e_bias5 = 5 }
add_to_temp_variable = { zin_e_w = zin_e_bias5 }
if = {
  limit = { has_government = democratic }
  add_to_temp_variable = { zin_e_w = -${N.weight_light} }
}
if = {
  limit = { has_war = yes }
  add_to_temp_variable = { zin_e_w = -${N.weight_war} }
}
if = {
  limit = {
    OR = {
      has_country_flag = zin_east_route_resist
      has_country_flag = zin_noris_route_shield
      has_country_flag = zin_stabilo_route_free
    }
  }
  if = {
    limit = { zin_east_is_power = yes }
    add_to_temp_variable = { zin_e_w = -${N.weight_resist_power} }
  }
  else = { add_to_temp_variable = { zin_e_w = -${N.weight_resist_court} } }
}
set_variable = { zin_east_coalition_weight = zin_e_w }`);
  E_('zin_east_join_coalition', `set_country_flag = zin_east_coalition_member
add_ideas = zin_east_coalition_ambition`);
  E_('zin_east_form_coalition', `if = {
  limit = { NOT = { has_global_flag = zin_east_coalition_formed } }
  set_global_flag = zin_east_coalition_formed
  every_country = {
    limit = { zin_east_in_region = yes }
    zin_east_compute_weight = yes
  }
  random_country = {
    limit = {
      zin_east_in_region = yes
      check_variable = { num_owned_states > ${N.leader_states - 0.01} }
      NOT = {
        any_other_country = {
          zin_east_in_region = yes
          check_variable = { num_owned_states > ${N.leader_states - 0.01} }
          OR = {
            check_variable = { zin_east_coalition_weight > PREV.zin_east_coalition_weight }
            AND = {
              check_variable = { zin_east_coalition_weight = PREV.zin_east_coalition_weight }
              check_variable = { num_owned_states > PREV.num_owned_states }
            }
          }
        }
      }
    }
    set_country_flag = zin_east_coalition_leader
    if = {
      limit = { is_ai = yes }
      zin_east_join_coalition = yes
    }
    else = { country_event = { id = zin_east.42 } }
  }
  every_country = {
    limit = {
      zin_east_in_region = yes
      NOT = { has_country_flag = zin_east_coalition_leader }
      check_variable = { zin_east_coalition_weight > ${N.weight_ask - 0.01} }
    }
    country_event = { id = zin_east.42 }
  }
  # on the historical path at least two AI courts besides the leader join
  if = {
    limit = { zin_rules_is_historical = yes }
    set_variable = { global.zin_east_joined = 0 }
    every_country = {
      limit = {
        zin_east_in_region = yes
        has_country_flag = zin_east_coalition_member
        NOT = { has_country_flag = zin_east_coalition_leader }
      }
      add_to_variable = { global.zin_east_joined = 1 }
    }
    ${[1, 2].map(() => `if = {
      limit = { check_variable = { global.zin_east_joined < 1.99 } }
      random_country = {
        limit = {
          zin_east_in_region = yes
          is_ai = yes
          NOT = { has_country_flag = zin_east_coalition_member }
          NOT = { has_country_flag = zin_east_coalition_leader }
          NOT = {
            any_other_country = {
              zin_east_in_region = yes
              is_ai = yes
              NOT = { has_country_flag = zin_east_coalition_member }
              NOT = { has_country_flag = zin_east_coalition_leader }
              check_variable = { zin_east_coalition_weight > PREV.zin_east_coalition_weight }
            }
          }
        }
        zin_east_join_coalition = yes
      }
      add_to_variable = { global.zin_east_joined = 1 }
    }`).join('\n    ')}
  }
}`);
  // ------------------------------------------------------------------------------------------------ the coalition and the crossing
  const leaderTarget = `every_country = {
  limit = { has_country_flag = zin_east_coalition_leader }
  save_global_event_target_as = zin_east_leader
}`;
  E_('zin_east_cross_rift', `if = {
  limit = {
    NOT = { has_global_flag = zin_eastern_invasion }
    any_country = { has_country_flag = zin_east_coalition_leader }
  }
  set_global_flag = zin_eastern_invasion
  every_country = {
    limit = { has_country_flag = zin_region_magical_lands }
    set_variable = { zin_east_rift_count = 0 }
    every_owned_state = {
      limit = { zin_is_site_rift_west = yes }
      add_to_variable = { PREV.zin_east_rift_count = 1 }
    }
  }
${ind(1, leaderTarget)}
${[1, 2, 3].map(() => `  random_country = {
    limit = {
      has_country_flag = zin_region_magical_lands
      check_variable = { zin_east_rift_count > 0.99 }
      NOT = { has_country_flag = zin_east_rift_target }
      NOT = {
        any_other_country = {
          has_country_flag = zin_region_magical_lands
          NOT = { has_country_flag = zin_east_rift_target }
          check_variable = { zin_east_rift_count > PREV.zin_east_rift_count }
        }
      }
    }
    set_country_flag = zin_east_rift_target
    save_global_event_target_as = zin_east_rift_foe
    event_target:zin_east_leader = {
      set_country_flag = { flag = zin_story_war days = 1 }
      declare_war_on = { target = event_target:zin_east_rift_foe type = annex_everything }
    }
    every_country = {
      limit = {
        has_country_flag = zin_east_coalition_member
        NOT = { has_country_flag = zin_east_coalition_leader }
      }
      add_to_war = { targeted_alliance = event_target:zin_east_leader enemy = event_target:zin_east_rift_foe hostility_reason = asked_to_join }
    }
  }`).join('\n')}
  every_country = {
    limit = {
      has_country_flag = zin_east_coalition_member
      check_variable = { zin_footholds > 2.99 }
    }
    every_country = {
      limit = { has_country_flag = zin_east_rift_target }
      PREV = { add_dynamic_modifier = { modifier = zin_cb_eastern_ambition scope = PREV days = ${N.cb_days} } }
    }
    add_dynamic_modifier = { modifier = zin_cb_eastern_ambition scope = ${AEN} days = ${N.cb_days} }
  }
  zin_elves_on_eastern_invasion = yes
}`);
  E_('zin_east_turn_west', `if = {
  limit = {
    NOT = { has_global_flag = zin_east_turns_west }
    country_exists = ${AEN}
    any_country = { has_country_flag = zin_east_coalition_leader }
  }
  set_global_flag = zin_east_turns_west
${ind(1, leaderTarget)}
  event_target:zin_east_leader = {
    set_country_flag = { flag = zin_story_war days = 1 }
    declare_war_on = { target = ${AEN} type = annex_everything }
  }
  every_country = {
    limit = {
      has_country_flag = zin_east_coalition_member
      NOT = { has_country_flag = zin_east_coalition_leader }
    }
    add_to_war = { targeted_alliance = event_target:zin_east_leader enemy = ${AEN} hostility_reason = asked_to_join }
  }
}`);
  E_('zin_east_make_coalition_peace', `# a coalition member makes white peace with every enemy in the Magical and Middle Lands
every_country = {
  limit = {
    has_war_with = PREV
    OR = {
      has_country_flag = zin_region_magical_lands
      has_country_flag = zin_region_middle_lands
    }
  }
  PREV = { white_peace = PREV }
}
remove_ideas = zin_east_coalition_ambition
set_country_flag = zin_east_coalition_peace`);
  E_('zin_east_offer_coalition_peace', `every_country = {
  limit = { has_country_flag = zin_east_coalition_member }
  country_event = { id = zin_east.45 }
}`);
  E_('zin_east_claim_rift', `if = {
  limit = {
    has_global_flag = zin_eastern_invasion
    has_country_flag = zin_east_coalition_member
  }
  every_state = {
    limit = {
      zin_is_site_rift_west = yes
      controller = { has_country_flag = zin_east_coalition_member }
    }
    add_claim_by = PREV
  }
}`);
  E_('zin_east_serve_stranger', `set_country_flag = zin_east_companies_with_eindil
army_experience = ${N.stranded_xp}`);
  E_('zin_east_order_home', `add_manpower = ${N.stranded_manpower}`);

  // ------------------------------------------------------------------------------------------------ roads, claims, causes
  E_('zin_east_claim_road', `if = {
  limit = {
    OR = {
      zin_east_caravan_war_open = yes
      has_global_flag = zin_afrit_king_of_east
    }
  }
${roadSwitch(r => `  if = {
    limit = { original_tag = ${NOR} }
    every_state = {
      limit = {
        zin_is_site_road_${r.key} = yes
        owner = {
          OR = {
            original_tag = ${STA}
            is_in_faction_with = ${STA}
          }
        }
      }
      add_claim_by = PREV
    }
  }
  else_if = {
    limit = { original_tag = ${STA} }
    every_state = {
      limit = {
        zin_is_site_road_${r.key} = yes
        owner = {
          OR = {
            original_tag = ${NOR}
            is_in_faction_with = ${NOR}
          }
        }
      }
      add_claim_by = PREV
    }
  }`).split('\n').map(l => '  ' + l).join('\n')}
}`);
  E_('zin_east_grant_free_cb', `# the cause against the Dominion of the East and every client; the modifier ends when the King falls
if = {
  limit = { zin_east_free_crown = yes }
  if = {
    limit = { NOT = { has_dynamic_modifier = { modifier = zin_cb_free_east scope = ${tags.WOR} } } }
    add_dynamic_modifier = { modifier = zin_cb_free_east scope = ${tags.WOR} days = ${N.free_cb_days} }
  }
  every_country = {
    limit = { has_country_flag = zin_afrit_eastern_client }
    PREV = {
      if = {
        limit = { NOT = { has_dynamic_modifier = { modifier = zin_cb_free_east scope = PREV } } }
        add_dynamic_modifier = { modifier = zin_cb_free_east scope = PREV days = ${N.free_cb_days} }
      }
    }
  }
}`);
  E_('zin_east_grant_high_king_cb', `if = {
  limit = {
    OR = {
      has_global_flag = zin_war_of_last_crowns
      has_global_flag = zin_afrit_king_of_east
    }
  }
  every_country = {
    limit = {
      zin_east_is_court = yes
      OR = {
        has_country_flag = zin_afrit_eastern_client
        AND = {
          PREV = { original_tag = ${NOR} }
          check_variable = { zin_east_lean < -0.01 }
        }
        AND = {
          PREV = { original_tag = ${STA} }
          check_variable = { zin_east_lean > 0.01 }
        }
      }
    }
    PREV = { add_dynamic_modifier = { modifier = zin_cb_high_king scope = PREV days = ${N.high_king_days} } }
  }
}`);
  E_('zin_east_declare_united', `if = {
  limit = {
    check_variable = { zin_east_dominance > ${N.united_dominance - 0.01} }
    NOT = { has_country_flag = zin_afrit_eastern_client }
    NOT = { has_global_flag = zin_east_united }
  }
  set_global_flag = zin_east_united
  add_ideas = zin_east_united_crown
  news_event = { id = zin_east.80 }
}`);

  // ------------------------------------------------------------------------------------------------ the King of the East
  E_('zin_east_prepare_kneel', `# the ruling ideology is kept to restore it when the King falls
if = {
  limit = { has_government = democratic }
  set_variable = { zin_east_old_ideology = 0 }
}
else_if = {
  limit = { has_government = fascism }
  set_variable = { zin_east_old_ideology = 1 }
}
else_if = {
  limit = { has_government = communism }
  set_variable = { zin_east_old_ideology = 2 }
}
else = { set_variable = { zin_east_old_ideology = 3 } }
if = {
  limit = { is_in_faction = yes }
  every_other_country = {
    limit = {
      is_faction_leader = yes
      is_in_faction_with = PREV
    }
    add_opinion_modifier = { target = PREV modifier = zin_east_knelt }
  }
  leave_faction = yes
}
# a subject of another country stays that country's subject; it only opens its roads to the Dominion
if = {
  limit = { is_subject = yes }
  give_military_access = ${WOR}
}`);
  E_('zin_east_restore_ideology', `if = {
  limit = { has_variable = zin_east_old_ideology }
  if = {
    limit = {
      check_variable = { zin_east_old_ideology = 0 }
      NOT = { has_government = democratic }
    }
    set_politics = { ruling_party = democratic elections_allowed = no }
  }
  else_if = {
    limit = {
      check_variable = { zin_east_old_ideology = 1 }
      NOT = { has_government = fascism }
    }
    set_politics = { ruling_party = fascism elections_allowed = no }
  }
  else_if = {
    limit = {
      check_variable = { zin_east_old_ideology = 2 }
      NOT = { has_government = communism }
    }
    set_politics = { ruling_party = communism elections_allowed = no }
  }
  else_if = {
    limit = {
      check_variable = { zin_east_old_ideology = 3 }
      NOT = { has_government = neutrality }
    }
    set_politics = { ruling_party = neutrality elections_allowed = no }
  }
}`);
  E_('zin_east_refuse_king', `set_country_flag = zin_afrit_refused_east`);
  E_('zin_east_gifts_to_king', `${WOR} = { add_opinion_modifier = { target = PREV modifier = zin_east_gifts_to_king } }`);
  E_('zin_east_enforce_refusers', `# historical path: at least two eastern countries refuse (the lowest bias refuse first)
if = {
  limit = { zin_rules_is_historical = yes }
  set_variable = { global.zin_east_refusers = 0 }
  every_country = {
    limit = {
      zin_east_in_region = yes
      has_country_flag = zin_afrit_refused_east
    }
    add_to_variable = { global.zin_east_refusers = 1 }
  }
${[1, 2].map(() => `  if = {
    limit = { check_variable = { global.zin_east_refusers < 1.99 } }
    random_country = {
      limit = {
        zin_east_in_region = yes
        is_ai = yes
        NOT = { has_country_flag = zin_afrit_refused_east }
        NOT = { has_country_flag = zin_afrit_eastern_client }
        NOT = {
          any_other_country = {
            zin_east_in_region = yes
            is_ai = yes
            NOT = { has_country_flag = zin_afrit_refused_east }
            NOT = { has_country_flag = zin_afrit_eastern_client }
            check_variable = { zin_east_kneel_bias < PREV.zin_east_kneel_bias }
          }
        }
      }
      set_country_flag = zin_afrit_refused_east
    }
    add_to_variable = { global.zin_east_refusers = 1 }
  }`).join('\n')}
}`);
  E_('zin_east_name_first_crown', `# the First of the Free Crowns: the refuser that leads a faction and holds most states, else the refuser with most states
if = {
  limit = { NOT = { any_country = { has_country_flag = zin_east_free_crowns_leader } } }
  if = {
    limit = {
      any_country = {
        zin_east_free_crown = yes
        is_faction_leader = yes
      }
    }
    random_country = {
      limit = {
        zin_east_free_crown = yes
        is_faction_leader = yes
        NOT = {
          any_other_country = {
            zin_east_free_crown = yes
            is_faction_leader = yes
            check_variable = { num_owned_states > PREV.num_owned_states }
          }
        }
      }
      set_country_flag = zin_east_free_crowns_leader
    }
  }
  else = {
    random_country = {
      limit = {
        zin_east_free_crown = yes
        NOT = {
          any_other_country = {
            zin_east_free_crown = yes
            check_variable = { num_owned_states > PREV.num_owned_states }
          }
        }
      }
      set_country_flag = zin_east_free_crowns_leader
    }
  }
  every_country = {
    limit = { has_country_flag = zin_east_free_crowns_leader }
    country_event = { id = zin_east.51 }
  }
}`);
  E_('zin_east_send_levies', `add_manpower = -${N.levies_manpower}
set_country_flag = zin_east_sent_levies`);
  E_('zin_east_send_gold', `add_political_power = -${N.gold_pp}
${WOR} = { add_political_power = ${N.gold_pp} }`);
  E_('zin_east_delay_host', `set_country_flag = { flag = zin_east_delayed_host days = ${N.delay_days} }
${WOR} = { add_opinion_modifier = { target = PREV modifier = zin_east_host_delayed } }`);
  E_('zin_east_after_the_king', `if = {
  limit = { NOT = { has_global_flag = zin_east_after_king_done } }
  set_global_flag = zin_east_after_king_done
  every_country = {
    limit = { has_country_flag = zin_afrit_eastern_client }
    if = {
      limit = { is_subject_of = ${WOR} }
      ${WOR} = { end_puppet = PREV }
    }
    add_timed_idea = { idea = zin_east_kings_debt days = ${N.after_days} }
    zin_east_restore_ideology = yes
  }
  every_country = {
    limit = { has_country_flag = zin_afrit_refused_east }
    add_timed_idea = { idea = zin_east_vindicated days = ${N.after_days} }
    remove_ideas = zin_east_free_crowns
  }
  if = {
    limit = { check_variable = { global.zin_east_rivalry < ${N.after_rivalry - 0.01} } }
    set_variable = { global.zin_east_rivalry = ${N.after_rivalry} }
  }
  every_country = {
    limit = { zin_east_in_region = yes }
    country_event = { id = zin_east.60 }
  }
}`);

  // ------------------------------------------------------------------------------------------------ the desert
  E_('zin_east_dig_wells_in', `set_state_flag = zin_east_wells
if = {
  limit = { has_dynamic_modifier = { modifier = zin_east_dry_land } }
  remove_dynamic_modifier = { modifier = zin_east_dry_land }
}
add_dynamic_modifier = { modifier = zin_east_wells }
add_building_construction = { type = infrastructure level = 1 instant_build = yes }`);
  E_('zin_east_wells_random', `random_owned_state = {
  limit = {
    zin_is_region_south_lands = yes
    NOT = { has_state_flag = zin_east_wells }
  }
  zin_east_dig_wells_in = yes
}`);

  // ------------------------------------------------------------------------------------------------ the monthly update
  E_('zin_east_rivalry_month', `${ROADS.map(r => `if = {
  limit = {
    check_variable = { global.zin_east_road_${r.key} = 0 }
    ${NOR} = { check_variable = { ${inf(r)} > ${N.contested_influence - 0.01} } }
    ${STA} = { check_variable = { ${inf(r)} > ${N.contested_influence - 0.01} } }
  }
${ind(1, call('zin_east_add_rivalry', { value: N.contested_rivalry }))}
}`).join('\n')}
if = {
  limit = {
    has_global_flag = zin_afrit_king_of_east
    ${NOR} = { has_country_flag = zin_afrit_refused_east }
    ${STA} = { has_country_flag = zin_afrit_refused_east }
  }
${ind(1, call('zin_east_add_rivalry', { value: -N.both_refuse_rivalry }))}
}
if = {
  limit = {
    has_global_flag = zin_afrit_king_of_east
    OR = {
      AND = {
        ${NOR} = { has_country_flag = zin_afrit_eastern_client }
        ${STA} = { has_country_flag = zin_afrit_refused_east }
      }
      AND = {
        ${STA} = { has_country_flag = zin_afrit_eastern_client }
        ${NOR} = { has_country_flag = zin_afrit_refused_east }
      }
    }
  }
${ind(1, call('zin_east_add_rivalry', { value: N.split_rivalry }))}
}
if = {
  limit = { check_variable = { global.zin_east_rivalry > ${N.rivalry_rest + N.rivalry_drift - 0.01} } }
${ind(1, call('zin_east_add_rivalry', { value: -N.rivalry_drift }))}
}
else_if = {
  limit = { check_variable = { global.zin_east_rivalry < ${N.rivalry_rest - N.rivalry_drift + 0.01} } }
${ind(1, call('zin_east_add_rivalry', { value: N.rivalry_drift }))}
}`);
  E_('zin_east_country_month', `${call('zin_east_update_bias')}
# a South Lands court owns at least half its states in the desert
set_temp_variable = { zin_e_south = 0 }
every_owned_state = {
  limit = { zin_is_region_south_lands = yes }
  add_to_temp_variable = { zin_e_south = 1 }
}
set_temp_variable = { zin_e_diff = zin_e_south }
multiply_temp_variable = { zin_e_diff = 2 }
subtract_from_temp_variable = { zin_e_diff = num_owned_states }
if = {
  limit = {
    check_variable = { zin_e_south > 0.99 }
    check_variable = { zin_e_diff > -0.01 }
  }
  set_country_flag = zin_east_south_court
}
else = { clr_country_flag = zin_east_south_court }
if = {
  limit = { has_stability < ${N.crisis_stability} }
  set_country_flag = { flag = zin_east_in_crisis days = ${N.crisis_days} }
}
mark_focus_tree_layout_dirty = yes`);
  E_('zin_east_free_crowns_month', `if = {
  limit = {
    has_global_flag = zin_afrit_king_of_east
    NOT = { has_global_flag = zin_afrit_dead }
  }
  every_country = {
    limit = { zin_east_free_crown = yes }
    zin_east_grant_free_cb = yes
    if = {
      limit = { NOT = { has_country_flag = zin_east_free_crown_set } }
      set_country_flag = zin_east_free_crown_set
      add_ideas = zin_east_free_crowns
      every_other_country = {
        limit = { zin_east_free_crown = yes }
        add_opinion_modifier = { target = PREV modifier = zin_east_free_crown_kin }
      }
      every_country = {
        limit = { has_country_flag = zin_afrit_eastern_client }
        PREV = { add_opinion_modifier = { target = PREV modifier = zin_east_knelt } }
      }
    }
  }
}`);
  E_('zin_east_monthly', `# the caravan month: roads, rivalry, the courts, the King's shadow, then the trees' own monthly work
zin_east_roads_month = yes
zin_east_rivalry_month = yes
if = {
  limit = {
    has_global_flag = zin_east_caravan_war
    NOT = { ${NOR} = { has_war_with = ${STA} } }
  }
  clr_global_flag = zin_east_caravan_war
  ${NOR} = { remove_ideas = zin_east_caravan_war_strain }
  ${STA} = { remove_ideas = zin_east_caravan_war_strain }
}
every_country = {
  limit = { zin_east_in_region = yes }
  zin_east_country_month = yes
}
${NOR} = { zin_east_update_dominance = yes }
${STA} = { zin_east_update_dominance = yes }
zin_east_free_crowns_month = yes
# envoys speak of the rift once the Golden King has been dead a year, or from the shifted date
if = {
  limit = {
    has_global_flag = zin_golden_king_dead
    NOT = { has_global_flag = zin_east_gk_seen }
  }
  set_global_flag = zin_east_gk_seen
  set_global_flag = { flag = zin_east_gk_wait days = ${N.rift_talk_wait} }
}
if = {
  limit = {
    OR = {
      zin_east_after_rift_talk = yes
      AND = {
        has_global_flag = zin_east_gk_seen
        NOT = { has_global_flag = zin_east_gk_wait }
      }
    }
  }
  every_country = {
    limit = {
      zin_east_in_region = yes
      check_variable = { zin_footholds > 2.99 }
      NOT = { has_country_flag = zin_east_rift_talk }
    }
    set_country_flag = zin_east_rift_talk
    country_event = { id = zin_east.40 }
  }
}
# the trees' monthly work (declared by the Noris and Stabilo trees)
if = { limit = { country_exists = ${NOR} } ${NOR} = { zin_noris_monthly = yes } }
if = { limit = { country_exists = ${STA} } ${STA} = { zin_stabilo_monthly = yes } }`);
  E_('zin_east_pick_runner', `if = {
  limit = { country_exists = ${NOR} }
  ${NOR} = { save_global_event_target_as = zin_east_runner }
}
else_if = {
  limit = { country_exists = ${STA} }
  ${STA} = { save_global_event_target_as = zin_east_runner }
}`);
  E_('zin_east_on_declare_war', `# ROOT declares on FROM
if = {
  limit = {
    OR = {
      AND = {
        original_tag = ${NOR}
        FROM = { original_tag = ${STA} }
      }
      AND = {
        original_tag = ${STA}
        FROM = { original_tag = ${NOR} }
      }
    }
  }
  if = {
    limit = { has_global_flag = zin_east_roads_concord }
    clr_global_flag = zin_east_roads_concord
    clr_global_flag = zin_east_roads_concord_cap
    ${NOR} = {
      remove_ideas = zin_east_shared_roads
      remove_opinion_modifier = { target = ${STA} modifier = zin_east_concord }
    }
    ${STA} = {
      remove_ideas = zin_east_shared_roads
      remove_opinion_modifier = { target = ${NOR} modifier = zin_east_concord }
    }
  }
  set_global_flag = zin_east_caravan_war
  ${NOR} = { add_ideas = zin_east_caravan_war_strain }
  ${STA} = { add_ideas = zin_east_caravan_war_strain }
  every_country = {
    limit = { zin_east_in_region = yes }
    news_event = { id = zin_east.25 }
  }
}`);
  E_('zin_east_on_peace', `if = {
  limit = {
    has_idea = zin_east_coalition_ambition
    NOT = {
      any_country = {
        has_country_flag = zin_region_magical_lands
        has_war_with = PREV
      }
    }
  }
  remove_ideas = zin_east_coalition_ambition
}
if = {
  limit = {
    has_global_flag = zin_east_caravan_war
    NOT = { ${NOR} = { has_war_with = ${STA} } }
  }
  clr_global_flag = zin_east_caravan_war
  ${NOR} = { remove_ideas = zin_east_caravan_war_strain }
  ${STA} = { remove_ideas = zin_east_caravan_war_strain }
}`);
  E_('zin_east_on_capitulation', `if = {
  limit = { zin_east_in_region = yes }
  set_country_flag = { flag = zin_east_in_crisis days = ${N.crisis_days} }
}`);
  E_('zin_east_sign_concord', `set_global_flag = zin_east_roads_concord
set_global_flag = { flag = zin_east_roads_concord_cap days = ${N.concord_cap_days} }
${NOR} = {
  add_ideas = zin_east_shared_roads
  add_opinion_modifier = { target = ${STA} modifier = zin_east_concord }
}
${STA} = {
  add_ideas = zin_east_shared_roads
  add_opinion_modifier = { target = ${NOR} modifier = zin_east_concord }
}
if = {
  limit = { check_variable = { global.zin_east_rivalry > ${N.concord_cap} } }
  set_variable = { global.zin_east_rivalry = ${N.concord_cap} }
}
${NOR} = { zin_east_refresh_wealth = yes }
${STA} = { zin_east_refresh_wealth = yes }
every_country = {
  limit = { zin_east_in_region = yes }
  news_event = { id = zin_east.24 }
}`);
  E_('zin_east_make_report', `# the numbers the hub's report shows
set_variable = { global.zin_east_rep_footholds = 0 }
set_variable = { global.zin_east_rep_pledged = 0 }
set_variable = { global.zin_east_rep_ready = 0 }
every_country = {
  limit = {
    zin_east_in_region = yes
    check_variable = { zin_footholds > 2.99 }
  }
  add_to_variable = { global.zin_east_rep_footholds = 1 }
  zin_east_compute_weight = yes
  if = {
    limit = { check_variable = { zin_east_coalition_weight > ${N.weight_ask - 0.01} } }
    add_to_variable = { global.zin_east_rep_ready = 1 }
  }
}
every_country = {
  limit = {
    zin_east_in_region = yes
    has_country_flag = zin_east_pledged
  }
  add_to_variable = { global.zin_east_rep_pledged = 1 }
}`);

  // ------------------------------------------------------------------------------------------------ the startup
  const roadStart = ROADS.map(r => N.roads[r.key]);
  E_('zin_east_startup', `if = {
  limit = { NOT = { has_global_flag = zin_east_started } }
  set_global_flag = zin_east_started
  set_variable = { global.zin_east_rivalry = ${N.rivalry_start} }
  set_variable = { global.zin_east_states_total = ${statesTotal} }
  set_variable = { global.zin_east_rule_roll = 0 }
  set_variable = { global.zin_east_wells_turn = 1 }
  set_variable = { global.zin_east_last_road = 0 }
  set_variable = { global.zin_east_last_winner = 0 }
  if = {
    limit = { zin_rules_ai_random_east = yes }
    random_list = {
      34 = { set_variable = { global.zin_east_rule_roll = 0 } }
      33 = { set_variable = { global.zin_east_rule_roll = 1 } }
      33 = { set_variable = { global.zin_east_rule_roll = 2 } }
    }
  }
${ROADS.map(r => `  set_variable = { global.zin_east_road_${r.key} = ${N.roads[r.key].charter} }
  set_variable = { global.zin_east_roadn_${r.key} = 0 }
  every_state = {
    limit = { zin_is_site_road_${r.key} = yes }
    add_to_variable = { global.zin_east_roadn_${r.key} = 1 }
  }`).join('\n')}
  ${NOR} = {
    save_global_event_target_as = zin_east_noris
${ROADS.map(r => `    set_variable = { ${inf(r)} = ${N.roads[r.key].noris} }`).join('\n')}
    set_variable = { zin_east_caravan_bonus = 0 }
    set_variable = { zin_east_dominance = 0 }
    zin_east_refresh_wealth = yes
    add_dynamic_modifier = { modifier = zin_east_caravan_wealth }
    add_ai_strategy = { type = antagonize id = "${STA}" value = ${N.ai_antagonize} }
${[...R.befriendNoris, ...R.befriendBoth].map(n => `    add_ai_strategy = { type = befriend id = "${tag(n)}" value = ${n === R.befriendBoth[0] ? N.ai_befriend_great : N.ai_befriend} }`).join('\n')}
  }
  ${STA} = {
    save_global_event_target_as = zin_east_stabilo
${ROADS.map(r => `    set_variable = { ${inf(r)} = ${N.roads[r.key].stabilo} }`).join('\n')}
    set_variable = { zin_east_caravan_bonus = 0 }
    set_variable = { zin_east_dominance = 0 }
    zin_east_refresh_wealth = yes
    add_dynamic_modifier = { modifier = zin_east_caravan_wealth }
    add_ai_strategy = { type = antagonize id = "${NOR}" value = ${N.ai_antagonize} }
${[...R.befriendStabilo, ...R.befriendBoth].map(n => `    add_ai_strategy = { type = befriend id = "${tag(n)}" value = ${n === R.befriendBoth[0] ? N.ai_befriend_great : N.ai_befriend} }`).join('\n')}
  }
  every_country = {
    limit = {
      zin_east_in_region = yes
      zin_east_is_power = no
    }
    set_variable = { zin_east_lean = 0 }
  }
${Object.entries(R.leans).map(([n, v]) => `  ${tag(n)} = { set_variable = { zin_east_lean = ${v} } }`).join('\n')}
  every_country = {
    limit = { zin_east_in_region = yes }
    set_variable = { zin_east_kneel_bias = 0 }
  }
  every_state = {
    limit = { zin_is_region_south_lands = yes }
    add_dynamic_modifier = { modifier = zin_east_dry_land }
  }
  zin_east_pick_runner = yes
}`);
  // The tree-declared names are stubs only when the focus designs do not declare them (the Noris and Stabilo trees do).
  const declared = {
    zin_noris_monthly: await treeDeclares('noris.json', 'zin_noris_monthly'),
    zin_stabilo_monthly: await treeDeclares('stabilo.json', 'zin_stabilo_monthly'),
    zin_stabilo_add_debt: await treeDeclares('stabilo.json', 'zin_stabilo_add_debt'),
  };
  for (const [name, ok] of Object.entries(declared)) {
    if (ok) continue;
    defs.stubs.push(name);
    eff.push(`# stub until the ${name.split('_')[1]} tree lands\n${name} = {\n\t# nothing yet\n\tlog = "${name} stub"\n}`);
  }

  const ctxx = { found, others, east, statesTotal, N, R, T, tags, put, defs, E_, ROADS, roadSwitch, inf, tag, powers, declared };
  const content = await buildEastContent({ ...ctxx, countries: ctx.countries });
  put('common/scripted_effects/zin_east.txt', `${HEADER('mech_east', EAST_SPEC)}\n# Scripted effects take no parameters in 1.19.3 (decision E1): a call sets zin_arg_<name> temporary variables first.\n# road: salt 1, gold 2, rift 3, lake 4, sand 5.\n\n${eff.join('\n\n')}`);
  const unused = T.unused();
  if (unused.length) throw new Error(`mech_east: the data file holds text nothing uses: ${unused.join(', ')}`);
  const entries = T.entries();
  await assertCleanText('mech_east', entries);
  for (const [rel, text] of files) staged.text(rel, text);
  staged.loc('zin_east', entries);
  return {
    files: [...files.keys(), 'localisation/english/zin_east_l_english.yml'].sort(), text: entries, definitions: defs, dependencies: EAST_DEPENDENCIES, externalEvents: EAST_DEPENDENCIES.events,
    counts: { effects: defs.effects.length, triggers: defs.triggers.length, events: defs.events.length, decisions: defs.decisions.length, categories: defs.categories.length, ideas: defs.ideas.length, opinions: defs.opinions.length, dynamicModifiers: defs.dynamicModifiers.length, aiStrategies: defs.aiStrategies.length, scriptedLocs: defs.scriptedLocs.length, stubs: defs.stubs.length, textKeys: Object.keys(entries).length },
    tags, content, statesTotal,
  };
}
