// The Lands of the Sun mechanic (docs/specs/04_mechanics/lands_of_the_sun.md): Lorien's counsel, the Noon Council and the
// Noon League, the Mirror of First Rain, and Lorien's last march and death. Writes the scripted effects and triggers, the
// decisions, ideas, opinion modifier, on_actions, AI strategies, events and text of the namespace zin_sun.
//   buildMechSun(staged, { countries, assignment?, data? }) -> { files, counts, definitions, externalEvents, dependencies, ... }
// Data: tools/content/data/mech_regions_sun.json (roster names, every number, every player-visible text).
// The faction template zin_faction_noon_league, the joining rule zin_faction_rule_join_sun_realms and the site trigger
// zin_is_site_gala are not written here: the diplomacy module and the key-sites table own them (see docs/design/stage2/mech_regions.md).
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fmt, ind, join, call, num, HEADER, Texts, resolveCountries, renderEvent, renderDecision, renderCategory, renderIdea, renderOpinion, assertCleanText, knownPictures, knownIcons } from '../lib/mech_kit.mjs';
import { defaultPeople } from './peoples.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const SUN_DATA_FILE = path.join(here, '../data/mech_regions_sun.json');
export const loadSunData = async (file = SUN_DATA_FILE) => JSON.parse(await readFile(file, 'utf8'));
const SPEC = 'docs/specs/04_mechanics/lands_of_the_sun.md';

// The five sights, in the order the Mirror reads them when asked to look at `any`: centre, south, north, seas, east.
export const SIGHTS = [{ key: 'north', code: 1 }, { key: 'south', code: 2 }, { key: 'seas', code: 3 }, { key: 'east', code: 4 }, { key: 'centre', code: 5 }];
const READING_ORDER = [5, 2, 1, 3, 4];

/** Names this module uses and does not define: other owners, by the contract register (lands_of_the_sun.md, "What other specs own"). */
export const SUN_DEPENDENCIES = {
  effects: ['zin_world_add_gathering_dark', 'zin_afrit_add_veil', 'zin_elves_goodwill', 'zin_diplo_lift_refusal'],
  triggers: ['zin_is_site_gala', 'zin_is_region_lands_of_the_sun', 'zin_is_region_middle_lands'],
  characters: ['zin_lorien'],
  factionTemplates: ['zin_faction_noon_league'],
  events: ['zin_sun.40', 'zin_sun.42'],
  globalFlags: ['zin_golden_king_dead', 'zin_afrit_regicide_ready', 'zin_war_of_last_crowns', 'zin_zol_rising', 'zin_aurevan_crowned', 'zin_lorien_dead'],
  variables: ['zin_mistake_power', 'zin_dominion_strength', 'zin_west_resolve', 'zin_council_influence', 'zin_gathering_dark', 'zin_story_pace', 'zin_eindil_host'],
  countryFlags: ['zin_gala_audiences', 'zin_gala_mirror_open', 'zin_gala_true_traces', 'zin_gala_cautious_seers', 'zin_gala_share_sight', 'zin_gala_kings_warning', 'zin_gala_mediator', 'zin_gala_courtyard_guarded', 'zin_gala_ready_to_ride', 'zin_refusal_lifted', 'zin_story_war', 'zin_east_rift_talk', 'zin_people_elves', 'zin_people_sun_elves', 'zin_region_islands_of_the_south'],
  ideas: ['zin_gala_still_water_spirit'],
};

export async function buildMechSun(staged, ctx) {
  const data = ctx.data ?? await loadSunData();
  const N = data.numbers, T = new Texts(data.text);
  const R = data.roster;
  const names = [R.gala, R.lands_of_light, R.elvana, R.igara, R.magical_forest, R.aenor, R.zol, R.volgan, R.worshipdom, ...R.heeders];
  const found = resolveCountries(ctx.countries, names);
  const sunCountries = ctx.countries.filter(c => c.scan === R.scan);
  if (sunCountries.length !== R.expectedCountries) throw new Error(`The roster has ${sunCountries.length} ${R.scan} countries, the data expects ${R.expectedCountries}`);
  const people = c => ctx.assignment?.get(c.tag) ?? defaultPeople(c);
  const realms = sunCountries.filter(c => people(c) === 'sun_elves');
  if (realms.length !== R.expectedSunhotRealms) throw new Error(`The roster has ${realms.length} Sunhot realms, the data expects ${R.expectedSunhotRealms}`);
  const tag = n => found.get(n).tag;
  const GALA = tag(R.gala), LOL = tag(R.lands_of_light), AENOR = tag(R.aenor), ZOL = tag(R.zol), VOLGAN = tag(R.volgan), FOREST = tag(R.magical_forest);
  const pictures = await knownPictures(), icons = await knownIcons();
  const files = new Map();
  const put = (rel, text) => { files.set(rel, text.endsWith('\n') ? text : text + '\n'); };
  const defs = { effects: [], triggers: [], events: [], decisions: [], categories: [], ideas: [], opinions: [], aiStrategies: [] };

  const sightFlag = k => `zin_sun_sight_${k}`, heedFlag = k => `zin_sun_heeded_${k}`;
  const counselCost = n => ({ custom_cost_trigger: `check_variable = { zin_gala_counsel > ${num(n - 0.01)} }`, custom_cost_text: `zin_sun_cost_counsel_${n}`, extraText: [`zin_sun_cost_counsel_${n}`, `zin_sun_cost_counsel_${n}_blocked`, `zin_sun_cost_counsel_${n}_tooltip`] });

  // ------------------------------------------------------------------------------------------------ triggers
  const trig = [];
  const T_ = (id, body) => { defs.triggers.push(id); trig.push(`${id} = {\n${ind(1, fmt(body))}\n}`); };
  T_('zin_sun_is_lands_of_the_sun_country', `OR = {\n${sunCountries.map(c => `  original_tag = ${c.tag}`).join('\n')}\n}`);
  T_('zin_sun_is_sunhot_realm', 'has_country_flag = zin_people_sun_elves');
  T_('zin_sun_is_elven_realm', 'OR = {\n  has_country_flag = zin_people_elves\n  has_country_flag = zin_people_sun_elves\n}');
  T_('zin_sun_is_gala', `OR = {\n  has_character = zin_lorien\n  original_tag = ${GALA}\n}`);
  T_('zin_sun_mirror_available', 'NOT = { has_global_flag = zin_mirror_stilled }');
  T_('zin_sun_league_needed', `OR = {\n  check_variable = { global.zin_gathering_dark > ${num(N.league_dark - 0.01)} }\n  has_global_flag = zin_sun_foreign_hold\n}`);
  T_('zin_sun_is_runner', `OR = {\n  original_tag = ${GALA}\n  AND = {\n    NOT = { country_exists = ${GALA} }\n    has_country_flag = zin_sun_council_president\n  }\n}`);
  T_('zin_sun_lorien_leads', `${GALA} = {\n  has_country_leader = { character = zin_lorien ruling_only = no }\n}\nNOT = { has_global_flag = zin_lorien_dead }`);
  T_('zin_sun_sight_true_north', `${ZOL} = { check_variable = { zin_mistake_power > ${num(N.sight_north - 0.01)} } }`);
  T_('zin_sun_sight_true_south', `${VOLGAN} = { check_variable = { zin_dominion_strength > ${num(N.sight_south - 0.01)} } }`);
  T_('zin_sun_sight_true_seas', `check_variable = { global.zin_west_resolve > ${num(N.sight_seas - 0.01)} }`);
  T_('zin_sun_sight_true_east', 'OR = {\n  has_global_flag = zin_war_of_last_crowns\n  any_country = { has_country_flag = zin_east_rift_talk }\n}');
  T_('zin_sun_sight_true_centre', `NOT = { has_global_flag = zin_golden_king_dead }\nOR = {\n  has_global_flag = zin_afrit_regicide_ready\n  ${AENOR} = { check_variable = { zin_council_influence > ${num(N.sight_centre - 0.01)} } }\n}`);
  T_('zin_sun_has_warnable_sight', `OR = {\n${SIGHTS.filter(s => s.key !== 'centre').map(s => `  has_country_flag = ${sightFlag(s.key)}`).join('\n')}\n  AND = {\n    has_country_flag = ${sightFlag('centre')}\n    FROM = { original_tag = ${AENOR} }\n  }\n}`);
  T_('zin_sun_has_heeded_any', `OR = {\n${SIGHTS.filter(s => s.key !== 'centre').map(s => `  has_country_flag = ${heedFlag(s.key)}`).join('\n')}\n}`);
  put('common/scripted_triggers/zin_sun.txt', `${HEADER('mech_sun', SPEC)}\n\n${trig.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ effects
  const eff = [];
  const E_ = (id, body) => { defs.effects.push(id); eff.push(`${id} = {\n${ind(1, fmt(body))}\n}`); };
  const sightFire = (code, extra) => `if = {\n  limit = { ${code} }\n${ind(1, fmt(extra))}\n}`;

  E_('zin_sun_add_gala_counsel', `${GALA} = {\n  add_to_variable = { zin_gala_counsel = zin_arg_value }\n  clamp_variable = { var = zin_gala_counsel min = 0 max = 100 }\n}`);
  E_('zin_sun_add_old_lords', `${GALA} = {\n  add_to_variable = { zin_gala_old_lords = zin_arg_value }\n  clamp_variable = { var = zin_gala_old_lords min = 0 max = 5 }\n}`);
  E_('zin_sun_add_concord', `add_to_variable = { global.zin_sun_concord = zin_arg_value }\nclamp_variable = { var = global.zin_sun_concord min = 0 max = 100 }`);
  E_('zin_sun_add_clarity', `if = {\n  limit = {\n    NOT = {\n      AND = {\n        has_global_flag = zin_mirror_stilled\n        check_variable = { zin_arg_value > 0 }\n      }\n    }\n  }\n  add_to_variable = { global.zin_mirror_clarity = zin_arg_value }\n  clamp_variable = { var = global.zin_mirror_clarity min = 0 max = 100 }\n}`);
  E_('zin_sun_spend_clarity', `subtract_from_variable = { global.zin_mirror_clarity = zin_arg_value }\nclamp_variable = { var = global.zin_mirror_clarity min = 0 max = 100 }`);

  E_('zin_sun_startup', `set_global_flag = zin_sun_noon_council
set_variable = { global.zin_sun_concord = ${N.concord_start} }
set_variable = { global.zin_mirror_clarity = ${N.clarity_start} }
set_variable = { global.zin_sun_league_peace_days = 0 }
${GALA} = {
  set_variable = { zin_gala_counsel = ${N.counsel_start} }
  set_variable = { zin_gala_old_lords = ${N.old_lords_start} }
  set_variable = { zin_sun_last_sight = 0 }
}
${LOL} = { set_country_flag = zin_sun_council_president }`);

  // The Mirror: which sights are true now, read in the order centre, south, north, seas, east.
  const wantSight = code => `OR = {\n  check_variable = { zin_arg_sight = 0 }\n  check_variable = { zin_arg_sight = ${code} }\n}`;
  const readSteps = READING_ORDER.map(code => {
    const s = SIGHTS.find(x => x.code === code);
    return `if = {\n  limit = {\n    check_variable = { zin_sun_seen = 0 }\n${ind(2, fmt(wantSight(code)))}\n    zin_sun_sight_true_${s.key} = yes\n  }\n  set_temp_variable = { zin_sun_seen = ${code} }\n}`;
  }).join('\n');
  E_('zin_sun_mirror_vision', `set_temp_variable = { zin_sun_seen = 0 }
${readSteps}
set_temp_variable = { zin_sun_cost = ${N.vision_cost} }
if = {
  limit = { has_country_flag = zin_gala_true_traces }
  set_temp_variable = { zin_sun_cost = ${N.vision_cost_true_traces} }
}
if = {
  limit = { check_variable = { zin_sun_seen = 0 } }
  multiply_temp_variable = { zin_sun_cost = 0.5 }
}
set_temp_variable = { zin_arg_value = zin_sun_cost }
zin_sun_spend_clarity = yes
set_variable = { zin_sun_last_sight = zin_sun_seen }
${SIGHTS.map(s => sightFire(`check_variable = { zin_sun_seen = ${s.code} }`, `set_country_flag = { flag = ${sightFlag(s.key)} days = ${N.sight_days} }`)).join('\n')}
country_event = { id = zin_sun.10 }`);

  // Warnings: the sight to send, then the event to the target.
  const pick = SIGHTS.filter(s => s.key !== 'centre');
  E_('zin_sun_send_warning', `set_temp_variable = { zin_sun_pick = 0 }
if = {
  limit = {
    var:zin_arg_target = { original_tag = ${AENOR} }
    has_country_flag = ${sightFlag('centre')}
  }
  set_temp_variable = { zin_sun_pick = 5 }
}
${pick.map(s => `if = {\n  limit = {\n    check_variable = { zin_sun_pick = 0 }\n    check_variable = { zin_sun_last_sight = ${s.code} }\n    has_country_flag = ${sightFlag(s.key)}\n  }\n  set_temp_variable = { zin_sun_pick = ${s.code} }\n}`).join('\n')}
${[2, 1, 3, 4].map(code => { const s = SIGHTS.find(x => x.code === code); return `if = {\n  limit = {\n    check_variable = { zin_sun_pick = 0 }\n    has_country_flag = ${sightFlag(s.key)}\n  }\n  set_temp_variable = { zin_sun_pick = ${code} }\n}`; }).join('\n')}
if = {
  limit = { check_variable = { zin_sun_pick > 0 } }
  var:zin_arg_target = {
    set_variable = { zin_sun_warned_sight = zin_sun_pick }
    country_event = { id = zin_sun.20 }
  }
}`);

  // The fear of prophecy (section 5): a heeded warning may do the prophecy's work.
  E_('zin_sun_prophecy_fear', `add_war_support = ${N.fear_war_support}
${call('zin_world_add_gathering_dark', { value: N.fear_dark })}
${GALA} = { country_event = { id = zin_sun.21 } }`);
  E_('zin_sun_heed_warning', `${SIGHTS.map(s => `if = {\n  limit = { check_variable = { zin_sun_warned_sight = ${s.code} } }\n  set_country_flag = { flag = ${heedFlag(s.key)} days = ${N.sight_days} }\n${s.key === 'centre' ? ind(1, call('zin_afrit_add_veil', { value: N.centre_veil })) : `  add_timed_idea = { idea = ${heedFlag(s.key)} days = ${N.heed_days} }`}\n}`).join('\n')}
if = {
  limit = { ${GALA} = { has_country_flag = zin_gala_cautious_seers } }
  random_list = {
    ${N.fear_chance_cautious} = { zin_sun_prophecy_fear = yes }
    ${100 - N.fear_chance_cautious} = { }
  }
}
else = {
  random_list = {
    ${N.fear_chance} = { zin_sun_prophecy_fear = yes }
    ${100 - N.fear_chance} = { }
  }
}`);

  // The Noon League.
  E_('zin_sun_form_noon_league', `if = {
  limit = {
    NOT = { has_global_flag = zin_sun_noon_league }
    is_in_faction = no
  }
  create_faction_from_template = zin_faction_noon_league
  set_global_flag = zin_sun_noon_league
  set_variable = { global.zin_sun_league_peace_days = 0 }
  news_event = { id = zin_sun.30 }
  every_country = {
    limit = {
      OR = {
        zin_sun_is_sunhot_realm = yes
        original_tag = ${GALA}
      }
      NOT = { is_in_faction_with = PREV }
      is_in_faction = no
    }
    country_event = { id = zin_sun.31 }
  }
}`);

  // Lorien's last march (section 7).
  const stand = [[1, 0, 1], [2, 2, 3], [3, 4, 5]];
  E_('zin_sun_lorien_rides', `set_global_flag = zin_lorien_rides
if = {
  limit = { NOT = { has_country_flag = zin_refusal_lifted } }
  zin_diplo_lift_refusal = yes
}
if = {
  limit = { has_country_flag = zin_gala_ready_to_ride }
${ind(1, call('zin_sun_add_old_lords', { value: 1 }))}
}
if = {
  limit = { NOT = { has_war_with = ${ZOL} } }
  if = {
    limit = {
      has_variable = global.zin_eindil_host
      var:global.zin_eindil_host = { has_war_with = ${ZOL} }
    }
    var:global.zin_eindil_host = {
      ${GALA} = { add_to_war = { targeted_alliance = PREV enemy = ${ZOL} hostility_reason = asked_to_join } }
    }
  }
  else = {
    ${ZOL} = {
      every_enemy_country = {
        set_variable = { zin_sun_mid_states = 0 }
        every_controlled_state = {
          limit = { zin_is_region_middle_lands = yes }
          add_to_variable = { PREV.zin_sun_mid_states = 1 }
        }
      }
    }
    if = {
      limit = { any_country = { has_war_with = ${ZOL} } }
      random_country = {
        limit = {
          has_war_with = ${ZOL}
          NOT = { original_tag = ${GALA} }
          NOT = {
            any_other_country = {
              has_war_with = ${ZOL}
              NOT = { original_tag = ${GALA} }
              check_variable = { zin_sun_mid_states > PREV.zin_sun_mid_states }
            }
          }
        }
        ${GALA} = { add_to_war = { targeted_alliance = PREV enemy = ${ZOL} hostility_reason = asked_to_join } }
      }
    }
    else = {
      set_country_flag = { flag = zin_story_war days = 1 }
      declare_war_on = { target = ${ZOL} type = annex_everything }
    }
  }
}
add_timed_idea = { idea = zin_sun_kings_ride days = ${N.kings_ride_days} }
set_temp_variable = { zin_sun_stand_days = zin_gala_old_lords }
multiply_temp_variable = { zin_sun_stand_days = ${N.stand_days_per_lord} }
add_to_temp_variable = { zin_sun_stand_days = ${N.stand_days_base} }
clamp_temp_variable = { var = zin_sun_stand_days min = ${N.stand_days_base} max = ${N.stand_days_max} }
${stand.map(([n, lo, hi]) => `every_country = {\n  limit = {\n    has_war_with = ${ZOL}\n    ${GALA} = {\n      check_variable = { zin_gala_old_lords > ${lo - 0.01} }\n      check_variable = { zin_gala_old_lords < ${hi + 0.99} }\n    }\n  }\n  add_timed_idea = { idea = zin_sun_old_powers_stand_${n} days = zin_sun_stand_days }\n}`).join('\n')}
news_event = { id = zin_sun.40 }`);

  E_('zin_sun_lorien_falls', `if = {
  limit = { NOT = { has_global_flag = zin_lorien_dead } }
  set_global_flag = zin_lorien_dead
  every_country = {
    limit = {
      has_character = zin_lorien
      has_country_leader = { character = zin_lorien ruling_only = yes }
    }
    kill_country_leader = yes
  }
  every_country = {
    limit = {
      has_character = zin_lorien
      NOT = { has_country_leader = { character = zin_lorien ruling_only = yes } }
    }
    retire_character = zin_lorien
  }
  ${GALA} = {
    set_variable = { zin_gala_old_lords = 0 }
    multiply_variable = { zin_gala_counsel = 0.5 }
    add_timed_idea = { idea = zin_sun_king_fallen days = ${N.king_fallen_days} }
    country_event = { id = zin_sun.42 days = ${N.after_king_days} }
  }
  multiply_variable = { global.zin_mirror_clarity = 0.5 }
${ind(1, call('zin_sun_add_concord', { value: N.concord_mourning }))}
  every_country = {
    limit = { zin_sun_is_elven_realm = yes }
    add_timed_idea = { idea = zin_sun_mourning days = ${N.mourning_days} }
  }
}`);

  // Housekeeping around the Mirror and the Council.
  E_('zin_sun_refresh_foreign_hold', `clr_global_flag = zin_sun_foreign_hold
every_state = {
  limit = {
    zin_is_region_lands_of_the_sun = yes
    controller = {
      NOT = { zin_sun_is_lands_of_the_sun_country = yes }
      any_enemy_country = {
        OR = {
          zin_sun_is_sunhot_realm = yes
          original_tag = ${GALA}
        }
      }
    }
  }
  set_global_flag = zin_sun_foreign_hold
}
if = {
  limit = { NOT = { has_global_flag = zin_sun_foreign_hold } }
  clr_global_flag = zin_sun_concord_rallied
}`);
  E_('zin_sun_refresh_president', `every_country = {
  limit = { has_country_flag = zin_sun_council_president }
  clr_country_flag = zin_sun_council_president
}
if = {
  limit = { country_exists = ${LOL} }
  ${LOL} = { set_country_flag = zin_sun_council_president }
}
else = {
  random_country = {
    limit = {
      zin_sun_is_sunhot_realm = yes
      NOT = {
        any_other_country = {
          zin_sun_is_sunhot_realm = yes
          check_variable = { num_owned_states > PREV.num_owned_states }
        }
      }
    }
    set_country_flag = zin_sun_council_president
  }
}
if = {
  limit = { NOT = { any_country = { zin_sun_is_sunhot_realm = yes } } }
  clr_global_flag = zin_sun_noon_council
}`);
  E_('zin_sun_refresh_mirror', `if = {
  limit = { has_global_flag = zin_mirror_stilled }
  every_state = {
    limit = {
      zin_is_site_gala = yes
      controller = { zin_sun_is_elven_realm = yes }
    }
    clr_global_flag = zin_mirror_stilled
  }
}`);
  E_('zin_sun_monthly', `zin_sun_refresh_president = yes
zin_sun_refresh_foreign_hold = yes
zin_sun_refresh_mirror = yes
if = {
  limit = {
    NOT = {
      any_country = {
        zin_sun_is_sunhot_realm = yes
        any_enemy_country = { zin_sun_is_sunhot_realm = yes }
      }
    }
  }
${ind(1, call('zin_sun_add_concord', { value: N.concord_monthly }))}
}
if = {
  limit = { zin_sun_lorien_leads = yes }
${ind(1, call('zin_sun_add_gala_counsel', { value: N.counsel_monthly }))}
}
set_temp_variable = { zin_sun_regain = ${N.clarity_regain} }
if = {
  limit = { ${GALA} = { has_idea = zin_gala_still_water_spirit } }
  add_to_temp_variable = { zin_sun_regain = ${N.clarity_regain_still_water} }
}
set_temp_variable = { zin_arg_value = zin_sun_regain }
zin_sun_add_clarity = yes
if = {
  limit = { has_global_flag = zin_sun_noon_league }
  random_country = {
    limit = { has_country_flag = zin_sun_council_president }
    if = {
      limit = { has_war = no }
      add_to_variable = { global.zin_sun_league_peace_days = 30 }
    }
    else = { set_variable = { global.zin_sun_league_peace_days = 0 } }
  }
  if = {
    limit = { check_variable = { global.zin_sun_league_peace_days > ${N.league_peace_days - 0.01} } }
    random_country = {
      limit = { has_country_flag = zin_sun_council_president is_faction_leader = yes }
      dismantle_faction = yes
    }
    clr_global_flag = zin_sun_noon_league
    set_variable = { global.zin_sun_league_peace_days = 0 }
  }
}
every_country = {
  limit = { zin_sun_is_lands_of_the_sun_country = yes }
  mark_focus_tree_layout_dirty = yes
}`);

  // on_action hooks (ROOT and FROM as the engine passes them).
  E_('zin_sun_on_declare_war', `if = {
  limit = {
    zin_sun_is_sunhot_realm = yes
    FROM = { zin_sun_is_sunhot_realm = yes }
  }
${ind(1, call('zin_sun_add_concord', { value: N.concord_war_between }))}
}`);
  E_('zin_sun_on_capitulation', `if = {
  limit = {
    original_tag = ${GALA}
    NOT = { has_global_flag = zin_lorien_rides }
    NOT = { has_global_flag = zin_lorien_dead }
  }
  if = {
    limit = {
      country_exists = ${LOL}
      NOT = { ${LOL} = { has_war_with = FROM } }
    }
    become_exiled_in = { target = ${LOL} legitimacy = ${N.exile_legitimacy} }
  }
  else_if = {
    limit = {
      any_country = {
        zin_sun_is_elven_realm = yes
        NOT = { original_tag = ${GALA} }
        NOT = { has_war_with = FROM }
      }
    }
    random_country = {
      limit = {
        zin_sun_is_elven_realm = yes
        NOT = { original_tag = ${GALA} }
        NOT = { has_war_with = FROM }
        NOT = {
          any_other_country = {
            zin_sun_is_elven_realm = yes
            NOT = { original_tag = ${GALA} }
            NOT = { has_war_with = FROM }
            check_variable = { num_owned_states > PREV.num_owned_states }
          }
        }
      }
      PREV = { become_exiled_in = { target = PREV legitimacy = ${N.exile_legitimacy} } }
    }
  }
  else = {
    become_exiled_in = { target = ${FOREST} legitimacy = ${N.exile_legitimacy} }
  }
}`);
  E_('zin_sun_on_state_control', `FROM.FROM = {
  if = {
    limit = { zin_is_site_gala = yes }
    if = {
      limit = { ROOT = { zin_sun_is_elven_realm = no } }
      if = {
        limit = { ${GALA} = { has_country_flag = zin_gala_courtyard_guarded } }
        ${GALA} = { country_event = { id = zin_sun.36 days = ${N.guarded_days} } }
      }
      else = {
        set_global_flag = zin_mirror_stilled
        ${GALA} = { country_event = { id = zin_sun.35 } }
        ROOT = { country_event = { id = zin_sun.35 } }
      }
    }
    else_if = {
      limit = { ROOT = { zin_sun_is_elven_realm = yes } }
      clr_global_flag = zin_mirror_stilled
    }
  }
  else_if = {
    limit = {
      zin_is_region_lands_of_the_sun = yes
      ROOT = { zin_sun_is_lands_of_the_sun_country = no }
      FROM = { zin_sun_is_lands_of_the_sun_country = yes }
      NOT = { has_global_flag = zin_sun_concord_rallied }
      ROOT = { has_war_with = FROM }
    }
    set_global_flag = zin_sun_concord_rallied
${ind(2, call('zin_sun_add_concord', { value: N.concord_rally }))}
  }
}`);
  put('common/scripted_effects/zin_sun.txt', `${HEADER('mech_sun', SPEC)}\n# Scripted effects take no parameters in 1.19.3 (decision E1): a call sets zin_arg_<name> temporary variables first.\n# sight codes: north 1, south 2, seas 3, east 4, centre 5, any 0.\n\n${eff.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ ideas
  const ideaList = [
    { id: 'zin_sun_council_timber', picture: 'zin_timber_mill', modifier: { industrial_capacity_dockyard: 0.15, production_speed_buildings_factor: 0.05 } },
    { id: 'zin_sun_heeded_north', picture: 'zin_beacon', modifier: { coastal_bunker_effectiveness_factor: 0.1, army_core_defence_factor: 0.05 } },
    { id: 'zin_sun_heeded_south', picture: 'zin_fort_wall', modifier: { army_core_defence_factor: 0.05, dig_in_speed_factor: 0.1 } },
    { id: 'zin_sun_heeded_seas', picture: 'zin_lighthouse', modifier: { coastal_bunker_effectiveness_factor: 0.1, naval_detection: 0.1 } },
    { id: 'zin_sun_heeded_east', picture: 'zin_eye_watchful', modifier: { army_core_defence_factor: 0.05, war_support_factor: 0.03 } },
    { id: 'zin_sun_kings_ride', picture: 'zin_gala_sun', modifier: { army_attack_factor: 0.2, army_morale_factor: 0.2 } },
    { id: 'zin_sun_old_powers_stand_1', picture: 'zin_forest_ancient', modifier: { army_defence_factor: 0.05, army_org_factor: 0.03 } },
    { id: 'zin_sun_old_powers_stand_2', picture: 'zin_forest_ancient', modifier: { army_defence_factor: 0.1, army_org_factor: 0.05 } },
    { id: 'zin_sun_old_powers_stand_3', picture: 'zin_forest_ancient', modifier: { army_defence_factor: 0.15, army_org_factor: 0.08 } },
    { id: 'zin_sun_king_fallen', picture: 'zin_banner_laid_down', modifier: { stability_factor: -0.1, war_support_factor: 0.1, political_power_gain: -0.1 } },
    { id: 'zin_sun_mourning', picture: 'zin_tree_silver', modifier: { stability_factor: -0.02 } },
  ];
  const ideaTexts = [];
  for (const i of ideaList) {
    if (!icons.has(`GFX_idea_${i.picture}`)) throw new Error(`Idea ${i.id}: picture ${i.picture} is not in the icon catalog`);
    ideaTexts.push(await renderIdea(i, T)); defs.ideas.push(i.id);
  }
  put('common/ideas/zin_sun.txt', `${HEADER('mech_sun', SPEC)}\nideas = {\n\tcountry = {\n${ind(2, ideaTexts.join('\n\n'))}\n\t}\n}`);

  // ------------------------------------------------------------------------------------------------ opinion modifier
  put('common/opinion_modifiers/zin_sun.txt', `${HEADER('mech_sun', SPEC)}\nopinion_modifiers = {\n${ind(1, renderOpinion({ id: 'zin_opinion_warning_dismissed', value: -5, decay: 0.25 }, T))}\n}`);
  defs.opinions.push('zin_opinion_warning_dismissed');

  // ------------------------------------------------------------------------------------------------ decisions
  const cats = [
    { id: 'zin_sun_counsel', icon: 'GFX_idea_zin_gala_sun', allowed: `original_tag = ${GALA}`, visible_when_empty: false },
    { id: 'zin_sun_mirror', icon: 'GFX_idea_zin_mirror_rain', allowed: `original_tag = ${GALA}`, visible: 'zin_sun_mirror_available = yes' },
    { id: 'zin_sun_council', icon: 'GFX_idea_zin_concord_circle', allowed: 'always = yes', visible: 'has_country_flag = zin_sun_council_president' },
  ];
  for (const c of cats) { if (!icons.has(c.icon)) throw new Error(`Category ${c.id}: icon ${c.icon} is not in the catalog`); defs.categories.push(c.id); }
  put('common/decisions/categories/zin_sun.txt', `${HEADER('mech_sun', SPEC)}\n\n${cats.map(c => renderCategory(c, T)).join('\n\n')}`);

  const onlyGala = `original_tag = ${GALA}`;
  const heeders = R.heeders.map(n => tag(n));
  const sendWord = (suffix, cost, visibleExtra, textAlias) => ({
    id: `zin_sun_send_word${suffix}`, icon: 'GFX_idea_zin_scroll_sealed', allowed: onlyGala,
    target_root_trigger: 'zin_sun_mirror_available = yes',
    target_trigger: `FROM = {\n  NOT = { original_tag = ${GALA} }\n  NOT = { original_tag = ${tag(R.worshipdom)} }\n}`,
    visible: visibleExtra, available: 'zin_sun_has_warnable_sight = yes', cost, days_re_enable: N.warn_cooldown,
    complete_effect: `set_temp_variable = { zin_arg_target = FROM }\nset_temp_variable = { zin_arg_sight = 0 }\nzin_sun_send_warning = yes`,
    ai: { base: 0, mods: [
      { add: 10, when: `FROM = {\n  OR = {\n${heeders.map(t => `    original_tag = ${t}`).join('\n')}\n  }\n}` },
      { add: 6, when: `FROM = { original_tag = ${AENOR} }` },
      { factor: 0, when: 'FROM = { zin_sun_has_heeded_any = yes }' },
      { factor: 0, when: 'NOT = { zin_sun_has_warnable_sight = yes }' },
    ] },
    alias: textAlias,
  });
  const decisionsList = [
    { id: 'zin_sun_audience', cat: 'zin_sun_counsel', icon: 'GFX_idea_zin_envoy', allowed: onlyGala,
      target_root_trigger: 'has_country_flag = zin_gala_audiences',
      target_trigger: `FROM = {\n  NOT = { original_tag = ${GALA} }\n  OR = {\n    zin_sun_is_lands_of_the_sun_country = yes\n    zin_sun_is_elven_realm = yes\n    has_country_flag = zin_region_islands_of_the_south\n  }\n}`,
      cost: N.audience_cost, days_re_enable: N.audience_cooldown,
      complete_effect: `${call('zin_sun_add_gala_counsel', { value: N.audience_counsel })}\n${call('zin_elves_goodwill', { target: 'FROM' })}\nFROM = { country_event = { id = zin_sun.5 } }`,
      ai: { base: 3, mods: [{ add: 6, when: `FROM = { original_tag = ${LOL} }` }, { factor: 0, when: 'NOT = { has_political_power > 60 }' }] } },
    { id: 'zin_sun_ask_timber', cat: 'zin_sun_counsel', icon: 'GFX_idea_zin_timber_mill', allowed: onlyGala,
      available: `NOT = { has_idea = zin_sun_council_timber }`, ...counselCost(N.timber_spend), days_re_enable: N.timber_days,
      complete_effect: `${call('zin_sun_add_gala_counsel', { value: -N.timber_spend })}\nadd_timed_idea = { idea = zin_sun_council_timber days = ${N.timber_days} }`,
      ai: { base: 2, mods: [{ factor: 0, when: 'NOT = { check_variable = { zin_gala_counsel > 55 } }' }] } },
    { id: 'zin_sun_ask_sun_guard', cat: 'zin_sun_counsel', icon: 'GFX_idea_zin_pass_fort', allowed: onlyGala,
      available: `OR = {\n  check_variable = { global.zin_gathering_dark > ${num(N.guard_dark - 0.01)} }\n  has_war = yes\n}\nany_country = { has_country_flag = zin_sun_council_president }`, ...counselCost(N.guard_spend), days_re_enable: N.guard_cooldown,
      complete_effect: `${call('zin_sun_add_gala_counsel', { value: -N.guard_spend })}\nrandom_country = {\n  limit = { has_country_flag = zin_sun_council_president }\n  country_event = { id = zin_sun.6 }\n}`,
      ai: { base: 0, mods: [{ add: 10, when: `OR = {\n  check_variable = { global.zin_gathering_dark > ${num(N.guard_dark - 0.01)} }\n  has_war = yes\n}` }] } },
    { id: 'zin_sun_speak_quarrel', cat: 'zin_sun_counsel', icon: 'GFX_idea_zin_olive_branch', allowed: onlyGala,
      target_root_trigger: 'has_country_flag = zin_gala_mediator',
      target_trigger: `FROM = {\n  zin_sun_is_sunhot_realm = yes\n  any_other_country = {\n    zin_sun_is_sunhot_realm = yes\n    has_opinion = { target = PREV value < 0 }\n  }\n}`,
      ...counselCost(N.quarrel_spend), days_re_enable: N.quarrel_cooldown,
      complete_effect: `${call('zin_sun_add_gala_counsel', { value: -N.quarrel_spend })}\nFROM = {\n  random_other_country = {\n    limit = {\n      zin_sun_is_sunhot_realm = yes\n      has_opinion = { target = PREV value < 0 }\n    }\n    set_temp_variable = { zin_arg_target = PREV }\n    zin_elves_goodwill = yes\n  }\n}\n${call('zin_sun_add_concord', { value: N.quarrel_concord })}`,
      ai: { base: 2, mods: [{ factor: 0, when: 'NOT = { check_variable = { zin_gala_counsel > 35 } }' }] } },
    { id: 'zin_sun_look_mirror', cat: 'zin_sun_mirror', icon: 'GFX_idea_zin_mirror_rain', allowed: onlyGala,
      visible: 'has_country_flag = zin_gala_mirror_open', available: `zin_sun_mirror_available = yes\ncheck_variable = { global.zin_mirror_clarity > ${num(N.look_clarity - 0.01)} }`, cost: N.look_cost, days_re_enable: N.look_cooldown,
      complete_effect: `set_temp_variable = { zin_arg_sight = 0 }\nzin_sun_mirror_vision = yes`,
      ai: { base: 0, mods: [{ add: 20, when: 'check_variable = { global.zin_mirror_clarity > 49.99 }' }] } },
    sendWord('', N.warn_cost, `has_country_flag = zin_gala_mirror_open\nNOT = {\n  has_country_flag = zin_gala_share_sight\n  has_country_flag = zin_gala_kings_warning\n}`),
    sendWord('_half', N.warn_cost - N.warn_discount, `has_country_flag = zin_gala_mirror_open\nOR = {\n  AND = {\n    has_country_flag = zin_gala_share_sight\n    NOT = { has_country_flag = zin_gala_kings_warning }\n  }\n  AND = {\n    has_country_flag = zin_gala_kings_warning\n    NOT = { has_country_flag = zin_gala_share_sight }\n  }\n}`, 'zin_sun_send_word'),
    sendWord('_free', Math.max(0, N.warn_cost - 2 * N.warn_discount), `has_country_flag = zin_gala_mirror_open\nhas_country_flag = zin_gala_share_sight\nhas_country_flag = zin_gala_kings_warning`, 'zin_sun_send_word'),
    { id: 'zin_sun_old_lords', cat: 'zin_sun_mirror', icon: 'GFX_idea_zin_forest_ancient', allowed: onlyGala,
      available: `OR = {\n  has_global_flag = zin_zol_rising\n  check_variable = { global.zin_gathering_dark > ${num(N.old_lords_dark - 0.01)} }\n}\ncheck_variable = { zin_gala_old_lords < 5 }\nNOT = { has_global_flag = zin_lorien_dead }`, cost: N.old_lords_cost, days_re_enable: N.old_lords_cooldown,
      complete_effect: call('zin_sun_add_old_lords', { value: 1 }),
      ai: { base: 1, mods: [{ add: 100, when: 'has_global_flag = zin_zol_rising' }] } },
    { id: 'zin_sun_raise_league', cat: 'zin_sun_council', icon: 'GFX_idea_zin_banner_league', allowed: 'always = yes',
      available: `zin_sun_league_needed = yes\ncheck_variable = { global.zin_sun_concord > ${num(N.league_concord - 0.01)} }\nNOT = { has_global_flag = zin_sun_noon_league }\nis_in_faction = no`, cost: N.league_cost,
      complete_effect: 'zin_sun_form_noon_league = yes',
      ai: { base: 0, mods: [{ add: 100, when: 'zin_sun_league_needed = yes' }] } },
  ];
  const byCat = new Map();
  for (const d of decisionsList) {
    if (!icons.has(d.icon)) throw new Error(`Decision ${d.id}: icon ${d.icon} is not in the catalog`);
    // One affordability predicate for the cost row and the gate (decision skill, custom costs).
    if (d.custom_cost_trigger) d.available = join(d.available, d.custom_cost_trigger);
    if (d.alias) { T.alias(d.id, d.alias); T.alias(`${d.id}_desc`, `${d.alias}_desc`); }
    defs.decisions.push(d.id);
    const cat = d.cat ?? 'zin_sun_mirror';
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(renderDecision(d, T));
  }
  put('common/decisions/zin_sun.txt', `${HEADER('mech_sun', SPEC)}\n\n${[...byCat].map(([cat, list]) => `${cat} = {\n${ind(1, list.join('\n\n'))}\n}`).join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ events
  const eventsList = [];
  const gift = id => ({ id, kind: 'country_event' });
  eventsList.push({ id: 'zin_sun.5', picture: 'GFX_zin_evt_gala_court', options: [{ key: 'a' }] });
  eventsList.push({ id: 'zin_sun.6', picture: 'GFX_zin_evt_gala_court', options: [
    { key: 'a', ai: { base: 80, mods: [{ factor: 0.125, when: 'OR = {\n  has_war = yes\n  has_opinion = { target = FROM value < 0 }\n}' }] }, effect: 'give_guarantee = FROM' },
    { key: 'b', ai: 20, effect: call('zin_sun_add_gala_counsel', { value: N.guard_refund }) },
  ] });
  const sightDescs = [{ key: 'rain', code: 0 }, ...SIGHTS.map(s => ({ key: s.key, code: s.code }))];
  eventsList.push({ id: 'zin_sun.10', picture: 'GFX_zin_evt_gala_court', descVariants: sightDescs.map(s => ({ key: s.key, trigger: `check_variable = { zin_sun_last_sight = ${s.code} }` })), options: [{ key: 'a' }] });
  eventsList.push({ id: 'zin_sun.20', picture: 'GFX_zin_evt_gala_court', descVariants: SIGHTS.map(s => ({ key: s.key, trigger: `check_variable = { zin_sun_warned_sight = ${s.code} }` })), options: [
    { key: 'a', ai: { base: 60 }, effect: `${GALA} = { add_opinion_modifier = { target = ROOT modifier = zin_opinion_warning_dismissed } }` },
    { key: 'b', ai: { base: 10, mods: [
      { add: 30, when: `OR = {\n${[...heeders].map(t => `  original_tag = ${t}`).join('\n')}\n}` },
      { add: 10, when: `has_opinion = { target = ${GALA} value > 24 }` },
      { add: 10, when: `has_opinion = { target = ${GALA} value > 49 }` },
      { add: -15, when: `has_opinion = { target = ${GALA} value < -24 }` },
      { factor: 0.5, when: `original_tag = ${AENOR}\nNOT = { has_global_flag = zin_golden_king_dead }` },
      { factor: 0, when: `original_tag = ${AENOR}\nhas_global_flag = zin_aurevan_crowned` },
    ] }, effect: 'zin_sun_heed_warning = yes' },
  ] });
  eventsList.push({ id: 'zin_sun.21', picture: 'GFX_zin_evt_gala_court', options: [{ key: 'a' }] });
  eventsList.push({ id: 'zin_sun.30', kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: `OR = {\n  zin_sun_is_sunhot_realm = yes\n  original_tag = ${GALA}\n}`, options: [{ key: 'a' }] });
  eventsList.push({ id: 'zin_sun.31', picture: 'GFX_zin_evt_generic_war', options: [
    { key: 'a', ai: { base: 20 }, effect: '' },
    { key: 'b', ai: { base: 40, mods: [10, 30, 50, 70, 90].map(v => ({ add: 10, when: `check_variable = { global.zin_sun_concord > ${v} }` })) }, effect: 'FROM = { add_to_faction = ROOT }' },
  ] });
  eventsList.push({ id: 'zin_sun.35', picture: 'GFX_zin_evt_generic_court', descVariants: [{ key: 'gala', trigger: `original_tag = ${GALA}` }, { key: 'occupier', trigger: `NOT = { original_tag = ${GALA} }` }], options: [{ key: 'a' }] });
  eventsList.push({ id: 'zin_sun.36', hidden: true, immediate: `every_state = {\n  limit = {\n    zin_is_site_gala = yes\n    controller = { zin_sun_is_elven_realm = no }\n  }\n  if = {\n    limit = { NOT = { has_global_flag = zin_mirror_stilled } }\n    set_global_flag = zin_mirror_stilled\n    ROOT = { country_event = { id = zin_sun.35 } }\n    CONTROLLER = { country_event = { id = zin_sun.35 } }\n  }\n}` });
  const eventTexts = [];
  for (const e of eventsList) {
    if (!pictures.has(e.picture) && !e.hidden) throw new Error(`Event ${e.id}: picture ${e.picture} is not in the catalog`);
    eventTexts.push(renderEvent(e, T)); defs.events.push(e.id);
  }
  put('events/zin_sun.txt', `${HEADER('mech_sun', SPEC)}\nadd_namespace = zin_sun\n\n${eventTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ on_actions
  put('common/on_actions/zin_sun.txt', `${HEADER('mech_sun', SPEC)}
on_actions = {
	on_startup = {
		effect = {
			if = {
				limit = { NOT = { has_global_flag = zin_sun_started } }
				set_global_flag = zin_sun_started
				zin_sun_startup = yes
			}
		}
	}
	on_monthly = {
		effect = {
			if = {
				limit = { zin_sun_is_runner = yes }
				zin_sun_monthly = yes
			}
		}
	}
	on_declare_war = {
		effect = {
			zin_sun_on_declare_war = yes
		}
	}
	on_capitulation_immediate = {
		effect = {
			zin_sun_on_capitulation = yes
		}
	}
	on_state_control_changed = {
		effect = {
			zin_sun_on_state_control = yes
		}
	}
}`);

  // ------------------------------------------------------------------------------------------------ AI strategies
  const others = realms.concat(sunCountries.filter(c => !realms.includes(c)));
  const strategies = [
    ...[GALA, LOL].map(t => `\tai_strategy = {\n\t\ttype = befriend\n\t\tid = "${t}"\n\t\tvalue = ${N.ai_befriend}\n\t}`),
    ...others.map(c => `\tai_strategy = {\n\t\ttype = conquer\n\t\tid = "${c.tag}"\n\t\tvalue = ${N.ai_conquer}\n\t}`),
  ];
  put('common/ai_strategy/zin_sun.txt', `${HEADER('mech_sun', SPEC)}\n# The Sunhot AI never starts a war: it befriends Gala and the Lands of Light and will conquer no country of its own region.\nzin_sun_peaceful_realms = {\n\tenable = { zin_sun_is_sunhot_realm = yes }\n\tabort_when_not_enabled = yes\n${strategies.join('\n')}\n}`);
  defs.aiStrategies.push('zin_sun_peaceful_realms');

  // ------------------------------------------------------------------------------------------------ text
  const unused = T.unused();
  if (unused.length) throw new Error(`mech_sun: the data file holds text nothing uses: ${unused.join(', ')}`);
  const entries = T.entries();
  await assertCleanText('mech_sun', entries);
  for (const [rel, text] of files) staged.text(rel, text);
  staged.loc('zin_sun', entries);
  const outFiles = [...files.keys(), 'localisation/english/zin_sun_l_english.yml'].sort();
  return {
    files: outFiles, text: entries, definitions: defs, dependencies: SUN_DEPENDENCIES,
    externalEvents: SUN_DEPENDENCIES.events,
    counts: { effects: defs.effects.length, triggers: defs.triggers.length, events: defs.events.length, decisions: defs.decisions.length, categories: defs.categories.length, ideas: defs.ideas.length, opinions: defs.opinions.length, textKeys: Object.keys(entries).length },
    tags: { gala: GALA, landsOfLight: LOL, aenor: AENOR, zol: ZOL, volgan: VOLGAN, sunhotRealms: realms.length },
  };
}
