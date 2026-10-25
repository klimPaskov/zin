// The Dark Lands mechanic (docs/specs/04_mechanics/dark_lands.md): the armed peace between Goldoroth and the Dark Sea Accord,
// Goldoroth's horde and its four clan blocs, sway and the Iron Yoke, the free holds and their Moot, Volgan's envoys as the holds
// see them, the Sea of Darkness, the straits, and the region in the War of the Last Crowns.
//   buildMechDark(staged, { countries, assignment?, data?, panels? }) -> { files, counts, definitions, dependencies, ... }
// Data: tools/content/data/mech_regions_dark.json (roster, numbers, text). This file writes the scripted triggers and effects;
// mech_dark_content.mjs the startup, the pulse, decisions, ideas, events, characters, on_actions and AI; mech_dark_panels.mjs the
// Horde and Accord windows. Site triggers are the key-sites table's, the autonomy states and the general causes of war the
// diplomacy module's, the game rule zin_rule_ai_goldoroth and its wrappers the rules module's (docs/design/stage2/mech_dark.md).
// The events zin_dark.80 and zin_dark.82 belong to the events engineers (docs/specs/06_events/03_war_of_the_last_crowns.md):
// fired here through hooks, never defined here (modules/events_mech_war.mjs writes them from data/events_mech_dark.json).
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fmt, ind, call, HEADER, Texts, resolveCountries, dateTrigger, assertCleanText } from '../lib/mech_kit.mjs';
import { defaultPeople } from './peoples.mjs';
import { IDEOLOGIES } from './ideologies.mjs';
import { buildDarkContent } from './mech_dark_content.mjs';
import { buildDarkPanels, darkScriptedLocalisation } from './mech_dark_panels.mjs';

const PANEL_TEXT = /^zin_(horde|accord)_/;

const here = path.dirname(fileURLToPath(import.meta.url));
export const DARK_DATA_FILE = path.join(here, '../data/mech_regions_dark.json');
export const loadDarkData = async (file = DARK_DATA_FILE) => JSON.parse(await readFile(file, 'utf8'));
export const DARK_SPEC = 'docs/specs/04_mechanics/dark_lands.md';

export const BLOCS = [
  { key: 'volcano', code: 1, variable: 'zin_goldoroth_favour_volcano', chief: 'zin_goldoroth_sungor', boon: 'zin_dark_boon_volcano', sulk: 'zin_dark_sulk_volcano' },
  { key: 'iron', code: 2, variable: 'zin_goldoroth_favour_iron', chief: 'zin_goldoroth_ulgra', boon: 'zin_dark_boon_iron', sulk: 'zin_dark_sulk_iron' },
  { key: 'war', code: 3, variable: 'zin_goldoroth_favour_war', chief: 'zin_goldoroth_britag', boon: 'zin_dark_boon_war', sulk: 'zin_dark_sulk_war' },
  { key: 'warrens', code: 4, variable: 'zin_goldoroth_favour_warrens', chief: 'zin_goldoroth_snikkit', boon: 'zin_dark_boon_warrens', sulk: 'zin_dark_sulk_warrens' },
];
/** The peoples whose realms are holds (zin_dark_is_hold); goblins are part of the orc people until the owner assigns them. */
export const HOLD_PEOPLES = ['orcs', 'trolls'];
/** Names no Dark Lands text may carry: the old setting names and the secrets of the specs (D3, the shared contract's secret). */
export const FORBIDDEN_TEXT = /\b(Erdae|Arda|Afrit|Hidden Council|King of Demons|Einendil|Eindil)\b/;
// Position of a stance in the foundation's list (modules/ideologies.mjs order): the code zin_politics_set_stance reads from zin_arg_stance.
const STANCES = Object.values(IDEOLOGIES).flatMap(d => Object.keys(d.stances));
export const stanceCode = s => { const i = STANCES.indexOf(s); if (i < 0) throw new Error(`Unknown stance ${s}`); return i + 1; };

/** Names this module uses and does not define; the owner of each is listed in docs/design/stage2/mech_dark.md. */
export const DARK_DEPENDENCIES = {
  effects: ['zin_world_add_gathering_dark', 'zin_volgan_add_dominion_strength', 'zin_volgan_add_veil', 'zin_leren_add_lean', 'zin_politics_set_stance'],
  triggers: ['zin_is_region_dark_lands', 'zin_is_site_goldoroth_march', 'zin_is_site_sea_of_darkness_coast', 'zin_is_site_dark_strait_north_shore', 'zin_is_site_dark_strait_south_shore', 'zin_is_site_dark_strait_far_shore', 'zin_is_site_dark_strait_south_far', 'zin_is_site_ocean_of_zol_coast', 'zin_is_site_troll_forest', 'zin_is_site_parim', 'zin_rules_ai_branch_goldoroth_independent', 'zin_rules_ai_branch_goldoroth_sworn_to_volgan', 'zin_rules_ai_random_goldoroth', 'zin_rules_is_historical'],
  autonomy: ['zin_autonomy_tributary_hold', 'zin_autonomy_sworn_realm'],
  gameRules: ['zin_rule_ai_goldoroth', 'zin_rule_historical_path', 'zin_rule_story_pace'],
  events: ['zin_dark.80', 'zin_dark.82'],
  externalEventRefs: ['zin_diplo.23'],
  focuses: ['zin_volgan_goldoroth_question', 'zin_lerendor_friends_of_the_dark_sea_accord', 'zin_lerendor_bargain_with_goldoroth'],
  ideas: ['zin_goldoroth_quarrelsome_clans', 'zin_goldoroth_warrens_heard', 'zin_goldoroth_sworn_to_nafeher'],
  dynamicModifiers: ['zin_cb_orc_raids'],
  cosmeticTags: ['zin_cosmetic_goldoroth_great'],
  variables: ['zin_volgan_pact', 'zin_gathering_dark', 'zin_story_pace', 'zin_court_corruption', 'zin_aenor_lost_cause', 'zin_leren_lean'],
  globalFlags: ['zin_war_of_last_crowns', 'zin_volgan_marches', 'zin_zol_rising', 'zin_volgan_body_destroyed'],
  countryFlags: ['zin_region_dark_lands', 'zin_people_orcs', 'zin_people_trolls', 'zin_people_minor_goblins', 'zin_goldoroth_swift_raids', 'zin_goldoroth_blood_price', 'zin_goldoroth_contests', 'zin_goldoroth_tallymen', 'zin_goldoroth_centralised', 'zin_goldoroth_master_of_clans', 'zin_goldoroth_heir_volcano', 'zin_goldoroth_heir_iron', 'zin_goldoroth_heir_war', 'zin_goldoroth_heir_warrens', 'zin_goldoroth_sway_open', 'zin_goldoroth_yoke_cheap', 'zin_goldoroth_light_yoke', 'zin_goldoroth_hard_yoke', 'zin_goldoroth_clash_open', 'zin_goldoroth_raids_open', 'zin_goldoroth_moot_open', 'zin_goldoroth_no_masters', 'zin_goldoroth_southern_bargain', 'zin_goldoroth_hunt_open', 'zin_goldoroth_corsairs', 'zin_goldoroth_tolls_open', 'zin_goldoroth_strait_wardens', 'zin_goldoroth_mercy', 'zin_goldoroth_ash_rites', 'zin_dark_trolls_for_pay', 'zin_dark_took_southern_gifts', 'zin_regional_dondor_beacon_chain', 'zin_regional_dondor_muster_drill', 'zin_regional_blackton_paid_corsairs'],
};

export async function buildMechDark(staged, ctx) {
  const data = ctx.data ?? await loadDarkData();
  const N = data.numbers, R = data.roster, T = new Texts(data.text);
  for (const [k, v] of Object.entries(data.text)) if (FORBIDDEN_TEXT.test(v)) throw new Error(`mech_dark: the text ${k} names what no Dark Lands text may name: ${v.match(FORBIDDEN_TEXT)[0]}`);
  const holdsAll = [R.dulundur, R.bordon, R.dreson, R.troll_forest, R.dun, R.belonton, ...R.other_holds];
  const found = resolveCountries(ctx.countries, [R.goldoroth, R.dondor, R.blackton, ...holdsAll], R.scan);
  const others = resolveCountries(ctx.countries, [R.lerendor, R.aenor, R.volgan, R.zol]);
  const darkAll = ctx.countries.filter(c => c.scan === R.scan);
  if (darkAll.length !== R.expectedCountries) throw new Error(`The roster has ${darkAll.length} ${R.scan} countries, the data expects ${R.expectedCountries}`);
  const statesTotal = darkAll.reduce((a, c) => a + c.states, 0);
  if (statesTotal !== R.expectedStates) throw new Error(`The ${R.scan} countries hold ${statesTotal} states, the data expects ${R.expectedStates}`);
  const named = new Set([R.goldoroth, R.dondor, R.blackton, ...holdsAll]);
  const missing = darkAll.filter(c => !named.has(c.name));
  if (missing.length) throw new Error(`Dark Lands countries missing from the data: ${missing.map(c => c.name).join(', ')}`);
  for (const n of Object.keys(R.sway)) if (!named.has(n)) throw new Error(`The sway table names ${n}, which is not a Dark Lands country of the data`);
  const tag = n => (found.get(n) ?? others.get(n)).tag;
  const tags = { GOL: tag(R.goldoroth), DON: tag(R.dondor), BLK: tag(R.blackton), LER: tag(R.lerendor), AEN: tag(R.aenor), VOL: tag(R.volgan), ZOL: tag(R.zol), TRF: tag(R.troll_forest), BEL: tag(R.belonton), DUL: tag(R.dulundur) };
  const { GOL, DON, BLK, AEN, VOL, ZOL } = tags;
  // The people of each country (the country table's assignment; the peoples module's defaults without it): holds are orc and troll realms.
  const peopleOf = c => ctx.assignment?.get(c.tag) ?? defaultPeople(c);
  const holdTags = darkAll.filter(c => c.tag !== GOL && c.tag !== DON && HOLD_PEOPLES.includes(peopleOf(c))).map(c => c.tag);
  const swayTags = darkAll.filter(c => c.tag !== GOL && c.tag !== DON).map(c => c.tag);
  const files = new Map();
  const put = (rel, text) => files.set(rel, text.endsWith('\n') ? text : text + '\n');
  const defs = { effects: [], triggers: [], dateTriggers: [], events: [], decisions: [], categories: [], ideas: [], opinions: [], dynamicModifiers: [], characters: [], traits: [], aiStrategies: [], scriptedGuis: [] };
  const swayOf = c => R.sway[c.name] ?? R.defaultSway;
  const ge = (v, n) => `check_variable = { ${v} > ${n - 0.01} }`;
  const ctxx = { N, R, T, tags, put, defs, countries: ctx.countries, darkAll, swayOf, statesTotal, holdTags, swayTags, peopleOf, ge };

  // ------------------------------------------------------------------------------------------------ triggers
  const trig = [];
  const T_ = (id, body) => { defs.triggers.push(id); trig.push(`${id} = {\n${ind(1, fmt(body))}\n}`); };
  T_('zin_dark_is_dark', 'has_country_flag = zin_region_dark_lands');
  T_('zin_dark_is_hold', `zin_dark_is_dark = yes
NOT = { original_tag = ${GOL} }
NOT = { original_tag = ${DON} }
OR = {
  has_country_flag = zin_people_orcs
  has_country_flag = zin_people_trolls
  has_country_flag = zin_people_minor_goblins
}`);
  T_('zin_dark_is_free_hold', 'zin_dark_is_hold = yes\nis_subject = no');
  T_('zin_dark_is_tributary', `is_subject_of = ${GOL}\nhas_autonomy_state = zin_autonomy_tributary_hold`);
  T_('zin_dark_is_accord_member', `OR = {\n  AND = {\n    original_tag = ${DON}\n    is_in_faction = yes\n  }\n  is_in_faction_with = ${DON}\n}`);
  T_('zin_dark_is_sea_master', 'has_country_flag = zin_dark_sea_master');
  T_('zin_dark_is_runner', `OR = {\n  original_tag = ${GOL}\n  AND = {\n    NOT = { country_exists = ${GOL} }\n    original_tag = ${DON}\n  }\n}`);
  const bands = N.tension_bands;
  bands.forEach(([band, lo, hi]) => T_(`zin_dark_tension_band_${band}`, [lo > 0 ? `NOT = { check_variable = { global.zin_dark_border_tension < ${lo} } }` : '', hi <= 100 ? `check_variable = { global.zin_dark_border_tension < ${hi} }` : ''].filter(Boolean).join('\n')));
  T_('zin_goldoroth_unity_at_least', `${GOL} = {\n  NOT = { check_variable = { zin_goldoroth_unity < zin_arg_value } }\n}`);
  for (const [key, [y, m, d]] of Object.entries(N.dates)) { const id = `zin_dark_date_${key}`; trig.push(dateTrigger(id, y, m, d, `Standard date ${y}.${m}.${d}, shifted by the story pace.`)); defs.triggers.push(id); defs.dateTriggers.push(id); }
  // A targeted cause is read with its scope: Goldoroth holds it against some Dark Lands country.
  const holdsCause = cause => `any_country = {\n  zin_dark_is_dark = yes\n  ${GOL} = { has_dynamic_modifier = { modifier = ${cause} scope = PREV } }\n}`;
  T_('zin_goldoroth_war_open', `OR = {
  has_global_flag = zin_war_of_last_crowns
  has_global_flag = zin_volgan_marches
  ${GOL} = { has_war = yes }
  AND = {
    zin_dark_date_defiance_cb = yes
    OR = {
${ind(3, holdsCause('zin_cb_hold_defiance'))}
${ind(3, holdsCause('zin_cb_orc_raids'))}
    }
  }
}`);
  T_('zin_goldoroth_may_war_dondor', `OR = {
  has_global_flag = zin_war_of_last_crowns
  has_global_flag = zin_volgan_marches
  ${GOL} = { has_dynamic_modifier = { modifier = zin_cb_orc_raids scope = ${DON} } }
}
NOT = { has_global_flag = zin_dark_truce_against_dead }`);
  T_('zin_goldoroth_refuses_masters', `original_tag = ${GOL}\nhas_country_flag = zin_goldoroth_no_masters`);
  T_('zin_goldoroth_seeks_the_south', `original_tag = ${GOL}\nhas_country_flag = zin_goldoroth_southern_bargain`);
  T_('zin_dark_hold_under_cocanoor', 'zin_dark_is_tributary = yes');
  T_('zin_dark_hold_in_moot', 'has_country_flag = zin_dark_moot_member');
  T_('zin_dark_hold_fears_cocanoor', `is_subject = no
${ge('zin_goldoroth_sway', N.fear_sway_min)}
check_variable = { zin_goldoroth_sway < ${N.fear_sway_max + 1} }
${GOL} = { has_country_flag = zin_goldoroth_no_masters }`);
  T_('zin_dark_took_southern_gifts', 'has_country_flag = zin_dark_took_southern_gifts');
  T_('zin_dark_hold_at_war_with_goldoroth', `has_war_with = ${GOL}`);
  T_('zin_dark_rule_independent', `original_tag = ${GOL}\nis_ai = yes\nOR = {\n  zin_rules_ai_branch_goldoroth_independent = yes\n  AND = {\n    zin_rules_ai_random_goldoroth = yes\n    check_variable = { global.zin_dark_rule_roll = 1 }\n  }\n}`);
  T_('zin_dark_rule_sworn', `original_tag = ${GOL}\nis_ai = yes\nOR = {\n  zin_rules_ai_branch_goldoroth_sworn_to_volgan = yes\n  AND = {\n    zin_rules_ai_random_goldoroth = yes\n    check_variable = { global.zin_dark_rule_roll = 2 }\n  }\n}`);
  const shore = (code, site) => `AND = {
    check_variable = { zin_arg_strait = ${code} }
    any_state = { ${site} = yes }
    NOT = {
      any_state = {
        ${site} = yes
        NOT = {
          OR = {
            is_controlled_by = PREV
            controller = { is_subject_of = PREV.PREV }
          }
        }
      }
    }
  }`;
  T_('zin_dark_holds_strait_shore', `OR = {\n  ${shore(1, 'zin_is_site_dark_strait_north_shore')}\n  ${shore(2, 'zin_is_site_dark_strait_south_shore')}\n}`);
  T_('zin_dark_shore_barred', `any_state = { zin_is_site_dark_strait_north_shore = yes }
NOT = {
  any_state = {
    zin_is_site_dark_strait_north_shore = yes
    NOT = {
      AND = {
        controller = { has_war_with = ${ZOL} }
        any_province_building_level = {
          building = coastal_bunker
          level > ${N.shore_fort_level - 1}
        }
      }
    }
  }
}`);
  T_('zin_dark_moot_eligible', `zin_dark_is_free_hold = yes\ncheck_variable = { zin_volgan_pact < ${N.moot_pact_max + 0.01} }\nNOT = { is_in_faction_with = ${VOL} }`);
  T_('zin_dark_moot_may_be_called', `OR = {
  ${GOL} = { ${ge('zin_goldoroth_unity', N.moot_unity)} }
  any_country = {
    zin_dark_is_hold = yes
    ${GOL} = { has_dynamic_modifier = { modifier = zin_cb_hold_defiance scope = PREV } }
  }
  any_country = {
    zin_dark_is_hold = yes
    has_war_with = ${GOL}
  }
}`);
  // Scope: Goldoroth in a targeted decision (FROM is the target): its divisions are at least three times the target's.
  T_('zin_dark_outnumbers_threefold', `set_temp_variable = { zin_dark_theirs = FROM.num_divisions }
multiply_temp_variable = { zin_dark_theirs = ${N.host_ratio} }
NOT = { check_variable = { num_divisions < zin_dark_theirs } }`);
  put('common/scripted_triggers/zin_dark.txt', `${HEADER('mech_dark', DARK_SPEC)}\n\n${trig.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ effects
  const eff = [];
  const E_ = (id, body) => { defs.effects.push(id); eff.push(`${id} = {\n${ind(1, fmt(body))}\n}`); };
  const blocSwitch = body => BLOCS.map(b => `if = {\n  limit = { check_variable = { zin_arg_bloc = ${b.code} } }\n${ind(1, fmt(body(b)))}\n}`).join('\n');
  // The border war of section 2: the states come from event targets saved in the same chain (as vanilla FRA.txt does).
  const borderWar = (changeState, onWin, onLose, onCancel) => `start_border_war = {
  change_state_after_war = ${changeState}
  combat_width = ${N.clash_width}
  minimum_duration_in_days = ${N.clash_days}
  attacker = {
    state = event_target:zin_dark_clash_a
    num_provinces = ${N.clash_provinces}
    on_win = ${onWin}
    on_lose = ${onLose}
    on_cancel = ${onCancel}
  }
  defender = {
    state = event_target:zin_dark_clash_b
    num_provinces = ${N.clash_provinces}
    on_win = ${onLose}
    on_lose = ${onWin}
    on_cancel = ${onCancel}
  }
}`;

  E_('zin_dark_add_border_tension', 'add_to_variable = { global.zin_dark_border_tension = zin_arg_value }\nclamp_variable = { var = global.zin_dark_border_tension min = 0 max = 100 }');
  E_('zin_dark_refresh_shield', `every_country = {
  limit = { zin_dark_is_accord_member = yes }
  set_variable = { zin_dark_shield_def = global.zin_dark_accord_resolve }
  multiply_variable = { zin_dark_shield_def = ${N.shield_def} }
  set_variable = { zin_dark_shield_core = global.zin_dark_accord_resolve }
  multiply_variable = { zin_dark_shield_core = ${N.shield_core} }
  set_variable = { zin_dark_shield_ws = global.zin_dark_accord_resolve }
  multiply_variable = { zin_dark_shield_ws = ${N.shield_ws} }
  add_dynamic_modifier = { modifier = zin_dark_accord_shield }
  force_update_dynamic_modifier = yes
}
every_country = {
  limit = {
    zin_dark_is_accord_member = no
    has_dynamic_modifier = { modifier = zin_dark_accord_shield }
  }
  remove_dynamic_modifier = { modifier = zin_dark_accord_shield }
}`);
  E_('zin_dark_add_accord_resolve', `add_to_variable = { global.zin_dark_accord_resolve = zin_arg_value }
clamp_variable = { var = global.zin_dark_accord_resolve min = 0 max = 100 }
zin_dark_refresh_shield = yes`);
  E_('zin_goldoroth_refresh_temper', `if = {
  limit = {
    ${ge('zin_goldoroth_temper', N.temper_restless)}
    NOT = { has_idea = zin_dark_restless_clans }
  }
  add_ideas = zin_dark_restless_clans
}
if = {
  limit = {
    check_variable = { zin_goldoroth_temper < ${N.temper_restless - N.rearm_gap} }
    has_idea = zin_dark_restless_clans
  }
  remove_ideas = zin_dark_restless_clans
}
if = {
  limit = {
    check_variable = { zin_goldoroth_temper < ${N.temper_settled + 0.01} }
    NOT = { has_idea = zin_dark_settled_hearths }
  }
  add_ideas = zin_dark_settled_hearths
}
if = {
  limit = {
    check_variable = { zin_goldoroth_temper > ${N.temper_settled + N.rearm_gap} }
    has_idea = zin_dark_settled_hearths
  }
  remove_ideas = zin_dark_settled_hearths
}
if = {
  limit = {
    ${ge('zin_goldoroth_temper', N.temper_restless)}
    NOT = { has_country_flag = zin_goldoroth_temper_70 }
  }
  set_country_flag = zin_goldoroth_temper_70
  country_event = { id = zin_dark.43 }
}
if = {
  limit = { check_variable = { zin_goldoroth_temper < ${N.temper_restless - N.rearm_gap} } }
  clr_country_flag = zin_goldoroth_temper_70
}
if = {
  limit = {
    ${ge('zin_goldoroth_temper', N.temper_blood)}
    NOT = { has_country_flag = zin_goldoroth_temper_90 }
  }
  set_country_flag = zin_goldoroth_temper_90
  country_event = { id = zin_dark.42 }
}
if = {
  limit = { check_variable = { zin_goldoroth_temper < ${N.temper_blood - N.rearm_gap} } }
  clr_country_flag = zin_goldoroth_temper_90
}`);
  E_('zin_goldoroth_add_temper', `${GOL} = {
  add_to_variable = { zin_goldoroth_temper = zin_arg_value }
  clamp_variable = { var = zin_goldoroth_temper min = 0 max = 100 }
  zin_goldoroth_refresh_temper = yes
}`);
  E_('zin_goldoroth_refresh_favours', BLOCS.map(b => `if = {
  limit = {
    ${ge(b.variable, N.boon_favour)}
    NOT = { has_idea = ${b.boon} }
  }
  add_ideas = ${b.boon}
}
if = {
  limit = {
    check_variable = { ${b.variable} < ${N.boon_favour - N.rearm_gap} }
    has_idea = ${b.boon}
  }
  remove_ideas = ${b.boon}
}
if = {
  limit = {
    check_variable = { ${b.variable} < ${N.sulk_favour + 0.01} }
    NOT = { has_idea = ${b.sulk} }
  }
  add_ideas = ${b.sulk}
}
if = {
  limit = {
    check_variable = { ${b.variable} > ${N.sulk_favour + N.rearm_gap} }
    has_idea = ${b.sulk}
  }
  remove_ideas = ${b.sulk}
}`).join('\n'));
  E_('zin_goldoroth_add_favour', `${GOL} = {
${ind(1, blocSwitch(b => `add_to_variable = { ${b.variable} = zin_arg_value }\nclamp_variable = { var = ${b.variable} min = 0 max = 100 }`))}
  zin_goldoroth_refresh_favours = yes
}`);
  // Scope: the country whose sway changes; zin_arg_value is the change. Gains are halved at pact 2 or in the Moot; each cap applies on its own (the lowest wins).
  const cap = (when, value) => `if = {\n  limit = {\n${ind(2, when)}\n    check_variable = { zin_goldoroth_sway > ${value} }\n  }\n  set_variable = { zin_goldoroth_sway = ${value} }\n}`;
  E_('zin_goldoroth_apply_sway', `set_temp_variable = { zin_dark_gain = zin_arg_value }
if = {
  limit = {
    check_variable = { zin_dark_gain > 0 }
    OR = {
      check_variable = { zin_volgan_pact = 2 }
      has_country_flag = zin_dark_moot_member
    }
  }
  multiply_temp_variable = { zin_dark_gain = ${N.sway_halving} }
}
add_to_variable = { zin_goldoroth_sway = zin_dark_gain }
clamp_variable = { var = zin_goldoroth_sway min = 0 max = 100 }
${cap('zin_dark_is_accord_member = yes', N.cap_accord)}
${cap(`check_variable = { zin_volgan_pact > 2.99 }`, N.cap_pact3)}
${cap(`original_tag = ${BLK}`, N.cap_blackton)}
${cap(`original_tag = ${DON}`, 0)}`);
  E_('zin_goldoroth_add_sway', `if = {
  limit = { check_variable = { zin_arg_target = -1 } }
  every_country = {
    limit = {
      zin_dark_is_free_hold = yes
      is_neighbor_of = ${GOL}
    }
    zin_goldoroth_apply_sway = yes
  }
}
else_if = {
  limit = { check_variable = { zin_arg_target = -2 } }
  every_country = {
    limit = { zin_dark_is_free_hold = yes }
    zin_goldoroth_apply_sway = yes
  }
}
else = {
  var:zin_arg_target = { zin_goldoroth_apply_sway = yes }
}`);
  E_('zin_goldoroth_yoke_check', `var:zin_arg_target = {
  if = {
    limit = {
      zin_dark_date_yoke = yes
      zin_dark_is_free_hold = yes
      is_in_faction = no
      NOT = { has_war_with = ${GOL} }
      OR = {
        ${ge('zin_goldoroth_sway', N.yoke_sway)}
        AND = {
          ${ge('zin_goldoroth_sway', N.yoke_sway_cheap)}
          ${GOL} = { has_country_flag = zin_goldoroth_yoke_cheap }
        }
      }
    }
    country_event = { id = zin_dark.50 }
  }
}`);
  E_('zin_goldoroth_take_tributary', `var:zin_arg_target = {
  ${GOL} = {
    puppet = PREV
    set_autonomy = { target = PREV autonomy_state = zin_autonomy_tributary_hold end_wars = no end_civil_wars = no }
  }
  add_ideas = zin_dark_tributary_hold
  set_variable = { zin_dark_tribute_days = 0 }
}
${GOL} = { country_event = { id = zin_dark.51 } }`);
  E_('zin_goldoroth_tribute_on_capitulation', `# on_capitulation: ROOT capitulates, FROM is the winner.
if = {
  limit = {
    zin_dark_is_free_hold = yes
    FROM = {
      original_tag = ${GOL}
      has_country_flag = zin_goldoroth_mercy
    }
  }
  FROM = {
    puppet = ROOT
    set_autonomy = { target = ROOT autonomy_state = zin_autonomy_tributary_hold end_wars = yes end_civil_wars = no }
  }
  set_variable = { zin_goldoroth_sway = ${N.mercy_sway} }
  set_variable = { zin_dark_tribute_days = 0 }
  add_ideas = zin_dark_tributary_hold
}`);
  E_('zin_goldoroth_refresh_unity', `set_temp_variable = { zin_dark_held = 0 }
every_state = {
  limit = {
    zin_is_region_dark_lands = yes
    owner = {
      OR = {
        original_tag = ${GOL}
        is_subject_of = ${GOL}
      }
    }
  }
  add_to_temp_variable = { zin_dark_held = 1 }
}
multiply_temp_variable = { zin_dark_held = 100 }
divide_temp_variable = { zin_dark_held = global.zin_dark_states_total }
${GOL} = {
  set_variable = { zin_goldoroth_unity = zin_dark_held }
  clamp_variable = { var = zin_goldoroth_unity min = 0 max = 100 }
  if = {
    limit = {
      ${ge('zin_goldoroth_unity', N.unity_news)}
      NOT = { has_country_flag = zin_goldoroth_unity_50 }
    }
    set_country_flag = zin_goldoroth_unity_50
    news_event = { id = zin_dark.60 }
${ind(2, call('zin_dark_add_accord_resolve', { value: N.unity_resolve }))}
  }
}`);
  // The heir is the chief of the bloc the tree named (zin_goldoroth.2), else the challenger; without either the Warking stays.
  E_('zin_goldoroth_crown_heir', `set_temp_variable = { zin_dark_heir = 0 }
${BLOCS.map(b => `if = {\n  limit = {\n    check_variable = { zin_dark_heir = 0 }\n    ${GOL} = { has_country_flag = zin_goldoroth_heir_${b.key} }\n  }\n  set_temp_variable = { zin_dark_heir = ${b.code} }\n}`).join('\n')}
if = {
  limit = { check_variable = { zin_dark_heir = 0 } }
  set_temp_variable = { zin_dark_heir = global.zin_dark_challenger }
}
if = {
  limit = { check_variable = { zin_dark_heir > 0 } }
  ${GOL} = {
    kill_country_leader = yes
${BLOCS.map(b => `    if = {\n      limit = { check_variable = { zin_dark_heir = ${b.code} } }\n      add_country_leader_role = {\n        character = ${b.chief}\n        promote_leader = yes\n        country_leader = {\n          ideology = ${N.warking_stance}\n          expire = "${N.leader_expire}"\n        }\n      }\n    }`).join('\n')}
    add_stability = -${N.heir_stability}
  }
${ind(1, BLOCS.map(b => `set_temp_variable = { zin_arg_bloc = ${b.code} }\nif = {\n  limit = { check_variable = { zin_dark_heir = ${b.code} } }\n  set_temp_variable = { zin_arg_value = ${N.heir_own} }\n}\nelse = {\n  set_temp_variable = { zin_arg_value = -${N.heir_others} }\n}\nzin_goldoroth_add_favour = yes`).join('\n'))}
${ind(1, BLOCS.map(b => `${GOL} = { clr_country_flag = zin_goldoroth_heir_${b.key} }`).join('\n'))}
}
set_variable = { global.zin_dark_challenger = 0 }`);
  E_('zin_goldoroth_warking_takes_field', `${GOL} = {
  random_character = {
    limit = { is_country_leader = yes }
    if = {
      limit = { is_field_marshal = no }
      add_field_marshal_role = {
        skill = ${N.warking_skill}
        attack_skill = ${N.warking_skill}
        defense_skill = ${N.warking_skill - 1}
        planning_skill = ${N.warking_skill - 1}
        logistics_skill = ${N.warking_skill - 1}
      }
    }
    add_unit_leader_trait = zin_trait_black_iron_warlord
  }
}`);
  E_('zin_goldoroth_core_dark_lands', `${GOL} = {
  every_owned_state = {
    limit = { zin_is_region_dark_lands = yes }
    add_core_of = ${GOL}
  }
}`);
  E_('zin_goldoroth_claim_strait_shores', `every_state = {
  limit = { zin_is_site_dark_strait_far_shore = yes }
  add_claim_by = ${GOL}
}`);
  E_('zin_goldoroth_proclaim_one_kingdom', `if = {
  limit = { NOT = { ${GOL} = { has_country_flag = zin_goldoroth_one_kingdom } } }
  ${GOL} = {
    set_country_flag = zin_goldoroth_one_kingdom
    set_cosmetic_tag = ${N.cosmetic_tag}
    add_stability = ${N.one_kingdom_stability}
    add_political_power = ${N.one_kingdom_pp}
  }
${ind(1, call('zin_world_add_gathering_dark', { value: N.one_kingdom_dark }))}
  ${GOL} = { news_event = { id = zin_dark.61 } }
}`);
  E_('zin_goldoroth_kneel', `if = {
  limit = { NOT = { ${GOL} = { has_country_flag = zin_goldoroth_kneeled } } }
  ${GOL} = {
    set_country_flag = zin_goldoroth_kneeled
    every_subject_country = {
      limit = {
        zin_dark_is_tributary = yes
        ${ge('zin_goldoroth_sway', N.kneel_annex_sway)}
      }
      PREV = { annex_country = { target = PREV } }
    }
    every_subject_country = {
      limit = { zin_dark_is_tributary = yes }
      PREV = { end_puppet = PREV }
      set_temp_variable = { zin_arg_value = -${N.kneel_release_sway} }
      zin_goldoroth_apply_sway = yes
    }
  }
  ${VOL} = {
    puppet = ${GOL}
    set_autonomy = { target = ${GOL} autonomy_state = zin_autonomy_sworn_realm end_wars = yes end_civil_wars = no }
  }
  ${GOL} = {
    set_politics = { ruling_party = ${N.kneel_government} elections_allowed = no }
${ind(2, call('zin_politics_set_stance', { stance: stanceCode(N.kneel_stance) }))}
    add_ideas = zin_goldoroth_sworn_to_nafeher
  }
${ind(1, call('zin_volgan_add_dominion_strength', { value: N.kneel_strength }))}
  if = {
    limit = { NOT = { has_global_flag = zin_volgan_marches } }
${ind(2, call('zin_volgan_add_veil', { value: -N.kneel_veil }))}
  }
${ind(1, call('zin_world_add_gathering_dark', { value: N.kneel_dark }))}
  ${GOL} = { news_event = { id = zin_dark.62 } }
}`);
  // Level 3 comes only from Volgan's "Sworn to Nafeher": a country below 3 never reaches it here; a sworn country stays sworn unless lowered.
  E_('zin_dark_add_volgan_pact', `var:zin_arg_target = {
  set_temp_variable = { zin_dark_pact_was = zin_volgan_pact }
  add_to_variable = { zin_volgan_pact = zin_arg_value }
  clamp_variable = { var = zin_volgan_pact min = 0 max = 3 }
  if = {
    limit = {
      check_variable = { zin_volgan_pact > 2.99 }
      check_variable = { zin_dark_pact_was < 2.99 }
    }
    set_variable = { zin_volgan_pact = 2 }
  }
}`);
  // The two causes of war, in the diplomacy spec's form: a dynamic modifier on the holder, added with the target as its scope.
  E_('zin_dark_grant_hold_cb', `var:zin_arg_target = {
  ${GOL} = {
    add_dynamic_modifier = { modifier = zin_cb_hold_defiance scope = PREV days = ${N.cb_days} }
  }
}`);
  E_('zin_dark_grant_raid_cb', `var:zin_arg_target = {
  add_dynamic_modifier = { modifier = zin_cb_orc_raids scope = ${GOL} days = ${N.cb_days} }
  ${GOL} = {
    add_dynamic_modifier = { modifier = zin_cb_orc_raids scope = PREV days = ${N.cb_days} }
  }
}`);
  const bordersRealm = `OR = {\n  is_neighbor_of = ${GOL}\n  any_other_country = {\n    is_subject_of = ${GOL}\n    is_neighbor_of = PREV\n  }\n}`;
  E_('zin_goldoroth_wargoal_defiant', `${GOL} = {
  every_country = {
    limit = {
      has_country_flag = zin_dark_refused_yoke
      NOT = { has_war_with = ${GOL} }
${ind(3, bordersRealm)}
      OR = {
        has_global_flag = zin_war_of_last_crowns
        has_global_flag = zin_volgan_marches
        ${GOL} = { has_dynamic_modifier = { modifier = zin_cb_hold_defiance scope = PREV } }
      }
    }
    ${GOL} = { create_wargoal = { type = annex_everything target = PREV } }
  }
}`);
  E_('zin_goldoroth_wargoal_sworn', `${GOL} = {
  every_country = {
    limit = {
      zin_dark_is_dark = yes
      NOT = { original_tag = ${GOL} }
      check_variable = { zin_volgan_pact > 2.99 }
      NOT = { has_war_with = ${GOL} }
${ind(3, bordersRealm)}
    }
    ${GOL} = { create_wargoal = { type = annex_everything target = PREV } }
  }
}`);
  // take_state needs state ids in its generator, so the chosen state and its owner are pasted in through meta_effect.
  E_('zin_goldoroth_wargoal_strait_south', `set_temp_variable = { zin_dark_goal_state = 0 }
random_state = {
  limit = {
    zin_is_site_dark_strait_south_far = yes
    owner = {
      OR = {
        original_tag = ${AEN}
        is_subject_of = ${AEN}
      }
    }
  }
  set_temp_variable = { zin_dark_goal_state = THIS }
  set_temp_variable = { zin_dark_goal_owner = OWNER }
}
if = {
  limit = { check_variable = { zin_dark_goal_state > 0 } }
  ${GOL} = {
    meta_effect = {
      text = {
        create_wargoal = {
          type = take_state
          target = var:zin_dark_goal_owner
          generator = { [STATE] }
        }
      }
      STATE = "[?zin_dark_goal_state|0]"
    }
  }
}`);
  E_('zin_goldoroth_rally_free_dark', `every_country = {
  limit = {
    zin_dark_is_dark = yes
    NOT = { original_tag = ${GOL} }
    ${ge('zin_goldoroth_sway', N.rally_sway)}
    check_variable = { zin_volgan_pact < ${N.rally_pact_max + 0.01} }
  }
  give_military_access = ${GOL}
  add_opinion_modifier = { target = ${GOL} modifier = zin_dark_gifts }
}`);
  E_('zin_goldoroth_offer_access_against_dead', `every_country = {
  limit = {
    zin_dark_is_dark = yes
    NOT = { original_tag = ${GOL} }
    has_war_with = ${ZOL}
  }
  give_military_access = ${GOL}
  ${GOL} = { give_military_access = PREV }
}`);
  E_('zin_dark_start_border_clash', `# The target is Dondor (section 2); the attacker's state is a march state that borders it.
if = {
  limit = {
    zin_dark_date_war_floor = yes
    NOT = { has_global_flag = zin_dark_clash_active }
    country_exists = ${DON}
  }
  ${GOL} = {
    random_owned_state = {
      limit = {
        zin_is_site_goldoroth_march = yes
        any_neighbor_state = { is_owned_by = ${DON} }
      }
      save_event_target_as = zin_dark_clash_a
      random_neighbor_state = {
        limit = { is_owned_by = ${DON} }
        save_event_target_as = zin_dark_clash_b
      }
    }
  }
  if = {
    limit = {
      has_event_target = zin_dark_clash_a
      has_event_target = zin_dark_clash_b
    }
    set_global_flag = zin_dark_clash_active
    ${GOL} = {
      if = {
        limit = { has_global_flag = zin_war_of_last_crowns }
${ind(4, borderWar('yes', 'zin_dark.2', 'zin_dark.3', 'zin_dark.4'))}
      }
      else = {
${ind(4, borderWar('no', 'zin_dark.2', 'zin_dark.3', 'zin_dark.4'))}
      }
    }
${ind(2, call('zin_world_add_gathering_dark', { value: N.clash_dark }))}
    ${GOL} = { news_event = { id = zin_dark.15 } }
  }
}`);
  // Both sides' callbacks fire; the clash flag makes the result apply once (acceptance 5).
  E_('zin_dark_end_clash', `if = {
  limit = { has_global_flag = zin_dark_clash_active }
  clr_global_flag = zin_dark_clash_active
  if = {
    limit = { check_variable = { zin_arg_result = 1 } }
    ${GOL} = { country_event = { id = zin_dark.16 } }
    ${DON} = { country_event = { id = zin_dark.16 } }
  }
  else_if = {
    limit = { check_variable = { zin_arg_result = 2 } }
    ${GOL} = { country_event = { id = zin_dark.17 } }
    ${DON} = { country_event = { id = zin_dark.17 } }
  }
  else = {
    ${GOL} = { country_event = { id = zin_dark.18 } }
    ${DON} = { country_event = { id = zin_dark.18 } }
  }
}`);
  // Scope: the payer. The blood-price without its Authority: the victim's option and the Accord's decision both use it.
  E_('zin_dark_blood_price_paid', `${call('zin_dark_add_border_tension', { value: -N.answer_blood_tension })}
${GOL} = {
  if = {
    limit = { has_country_flag = zin_goldoroth_blood_price }
    add_political_power = ${N.blood_price_gold + N.blood_price_bonus}
${ind(2, call('zin_goldoroth_add_temper', { value: -N.blood_price_temper }))}
  }
  else = { add_political_power = ${N.blood_price_gold} }
  add_opinion_modifier = { target = PREV modifier = zin_dark_blood_price_paid }
}`);
  // Scope: the raided country. answer: beacons 1, blood-price 2, in kind 3.
  E_('zin_dark_answer_raid', `if = {
  limit = { check_variable = { zin_arg_answer = 1 } }
  if = {
    limit = { zin_dark_is_accord_member = yes }
${ind(2, call('zin_dark_add_accord_resolve', { value: N.answer_beacons }))}
  }
  else = {
    add_opinion_modifier = { target = ${DON} modifier = zin_dark_beacons_lit }
  }
}
else_if = {
  limit = { check_variable = { zin_arg_answer = 2 } }
  add_political_power = -${N.blood_price}
  zin_dark_blood_price_paid = yes
}
else = {
  add_war_support = ${N.answer_kind_ws}
${ind(1, call('zin_dark_add_border_tension', { value: N.answer_kind_tension }))}
}`);
  E_('zin_dark_resolve_raid', `# kind: march 1, hold 2, corsair 3; the target is zin_arg_target (Dondor for a march raid)
if = {
  limit = { var:zin_arg_target = { zin_dark_is_accord_member = yes } }
  if = {
    limit = { check_variable = { global.zin_dark_raid_dark_added < ${N.raid_dark_cap - 0.01} } }
${ind(2, call('zin_world_add_gathering_dark', { value: N.raid_dark }))}
    add_to_variable = { global.zin_dark_raid_dark_added = ${N.raid_dark} }
  }
  set_variable = { global.zin_dark_raid_quiet_until = global.num_days }
  add_to_variable = { global.zin_dark_raid_quiet_until = ${N.raid_quiet_days} }
}
${GOL} = { set_country_flag = { flag = zin_goldoroth_fed days = ${N.fed_days} } }
var:zin_arg_target = { set_country_flag = { flag = zin_dark_raided_recently days = ${N.raided_days} } }
if = {
  limit = { check_variable = { zin_arg_kind = 1 } }
  ${GOL} = {
    add_equipment_to_stockpile = { type = zin_arms_equipment amount = ${N.raid_march_arms} }
    army_experience = ${N.raid_march_xp}
${ind(2, call('zin_goldoroth_add_temper', { value: -N.raid_march_temper }))}
${ind(2, call('zin_goldoroth_add_favour', { bloc: 3, value: N.raid_march_war }))}
  }
${ind(1, call('zin_dark_add_border_tension', { value: N.raid_march_tension }))}
  var:zin_arg_target = { country_event = { id = zin_dark.11 } }
}
else_if = {
  limit = { check_variable = { zin_arg_kind = 2 } }
  ${GOL} = {
    add_equipment_to_stockpile = { type = zin_arms_equipment amount = ${N.raid_hold_arms} }
${ind(2, call('zin_goldoroth_add_temper', { value: -N.raid_hold_temper }))}
  }
  var:zin_arg_target = {
    add_opinion_modifier = { target = ${GOL} modifier = zin_dark_raided }
    set_temp_variable = { zin_dark_theirs = num_divisions }
  }
  multiply_temp_variable = { zin_dark_theirs = ${N.host_ratio} }
  ${GOL} = {
    if = {
      limit = { NOT = { check_variable = { num_divisions < zin_dark_theirs } } }
      set_temp_variable = { zin_arg_value = ${N.raid_hold_sway} }
    }
    else = { set_temp_variable = { zin_arg_value = -${N.raid_hold_sway} } }
  }
  var:zin_arg_target = { zin_goldoroth_apply_sway = yes }
${ind(1, call('zin_dark_add_border_tension', { value: N.raid_hold_tension }))}
  var:zin_arg_target = { country_event = { id = zin_dark.12 } }
}
else = {
  ${GOL} = {
    add_equipment_to_stockpile = { type = zin_arms_equipment amount = ${N.raid_corsair_arms} }
    add_political_power = ${N.raid_corsair_pp}
${ind(2, call('zin_goldoroth_add_temper', { value: -N.raid_corsair_temper }))}
  }
  var:zin_arg_target = {
    if = {
      limit = { zin_dark_is_accord_member = yes }
${ind(3, call('zin_dark_add_border_tension', { value: N.raid_corsair_tension }))}
    }
    if = {
      limit = { original_tag = ${BLK} }
      ${tags.LER} = { add_opinion_modifier = { target = ${GOL} modifier = zin_dark_corsair_outrage } }
    }
    country_event = { id = zin_dark.13 }
  }
}
if = {
  limit = {
    var:zin_arg_target = { zin_dark_is_accord_member = yes }
    ${ge('global.zin_gathering_dark', N.cb_dark)}
    ${ge('global.zin_dark_border_tension', N.cb_tension)}
  }
  zin_dark_grant_raid_cb = yes
}
${GOL} = { country_event = { id = zin_dark.10 } }`);
  const content = await buildDarkContent({ ...ctxx, E_, BLOCS, blocSwitch, assignment: ctx.assignment });
  put('common/scripted_effects/zin_dark.txt', `${HEADER('mech_dark', DARK_SPEC)}\n# Scripted effects take no parameters in 1.19.3 (decision E1): a call sets zin_arg_<name> temporary variables first.\n# bloc: volcano 1, iron 2, war 3, warrens 4; kind: march 1, hold 2, corsair 3; strait: north 1, south 2; target: bordering -1, holds -2;\n# answer: beacons 1, blood-price 2, in kind 3; result: won 1, lost 2, cancelled 3.\n\n${eff.join('\n\n')}`);
  const panels = ctx.panels === false ? { files: new Map(), scriptedGuis: [], windows: [] } : await buildDarkPanels({ ...ctxx, BLOCS });
  for (const [rel, text] of panels.files) put(rel, text);
  put('common/scripted_localisation/zin_dark.txt', darkScriptedLocalisation(ctxx));
  defs.scriptedGuis.push(...panels.scriptedGuis);
  // Without the windows their own texts (zin_horde_*, zin_accord_*) stay in the data for the interface module to take.
  const unused = T.unused().filter(k => ctx.panels !== false || !PANEL_TEXT.test(k));
  if (unused.length) throw new Error(`mech_dark: the data file holds text nothing uses: ${unused.join(', ')}`);
  const entries = T.entries();
  await assertCleanText('mech_dark', entries);
  for (const [rel, text] of files) staged.text(rel, text);
  staged.loc('zin_dark', entries);
  return {
    files: [...files.keys(), 'localisation/english/zin_dark_l_english.yml'].sort(), text: entries, definitions: defs, dependencies: DARK_DEPENDENCIES, externalEvents: DARK_DEPENDENCIES.events,
    counts: { effects: defs.effects.length, triggers: defs.triggers.length, dateTriggers: defs.dateTriggers.length, events: defs.events.length, decisions: defs.decisions.length, categories: defs.categories.length, ideas: defs.ideas.length, opinions: defs.opinions.length, dynamicModifiers: defs.dynamicModifiers.length, characters: defs.characters.length, traits: defs.traits.length, aiStrategies: defs.aiStrategies.length, scriptedGuis: defs.scriptedGuis.length, windows: panels.windows.length, textKeys: Object.keys(entries).length },
    tags, holdTags, swayTags, content, windows: panels.windows,
  };
}
