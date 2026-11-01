// The Cold Lands mechanic (docs/specs/04_mechanics/cold_lands.md): the Northern Accord and Isengard's defiance, the tribes'
// lean and the winter moot, the Long Winters, the old pacts with the yeti and the giants, the far north-west, the silent
// castle, the Neck Road and Windwaith, and the Cold Lands in the War of the Last Crowns.
//   buildMechCold(staged, { countries, data? }) -> { files, counts, definitions, dependencies, tags, ... }
// Data: tools/content/data/mech_regions_cold.json (roster names, every number, every AI weight, every player-visible text).
// Integration note: docs/design/stage2/mech_cold.md. Names this module uses and does not define are COLD_DEPENDENCIES, grouped
// by owner; the site triggers (zin_is_site_*, zin_is_region_*) belong to the key-sites table, the rule wrappers zin_rules_* to
// modules/rules.mjs (which also writes zin_rule_cold_isengard from data/game_rules.json).
// The seasons are the spec's own clock: the startup event schedules the first Mistfall and Deepwinter, every season event
// schedules the next one from its due day (global.zin_cold_due_*), and the monthly runner fires a season whose anchor country
// vanished with the queued event (a day number past its due day), so the calendar holds when Coldor is gone.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fmt, ind, call, num, HEADER, Texts, resolveCountries, dateTrigger, dayOf, renderEvent, renderDecision, renderCategory, renderIdea, renderDynamicModifier, renderOpinion, assertCleanText, knownPictures, knownIcons } from '../lib/mech_kit.mjs';
import { MONTHS, START_YEAR } from '../lib/calendar.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const COLD_DATA_FILE = path.join(here, '../data/mech_regions_cold.json');
export const loadColdData = async (file = COLD_DATA_FILE) => JSON.parse(await readFile(file, 'utf8'));
export const COLD_SPEC = 'docs/specs/04_mechanics/cold_lands.md';
const SPEC = COLD_SPEC;

/** Names the module uses and does not define, by owner (docs/design/stage2/mech_cold.md lists each with its spec). */
export const COLD_DEPENDENCIES = [
  { owner: 'key-sites table (modules/sites.mjs, not written yet)', spec: 'docs/specs/01_map/02_key_sites.md', kind: 'scripted trigger (state)',
    names: ['zin_is_region_cold_lands', 'zin_is_region_far_northwest', 'zin_is_site_yeldenne', 'zin_is_site_isengard_march', 'zin_is_site_eindil_ice', 'zin_is_site_parim'] },
  { owner: 'foundation game rules (modules/rules.mjs)', spec: 'docs/specs/00_foundation/05_defines_and_rules.md', kind: 'scripted trigger',
    names: ['zin_rules_is_historical', 'zin_rules_ai_branch_cold_historical', 'zin_rules_ai_plausible_cold'] },
  { owner: 'foundation game rules (modules/rules.mjs)', spec: 'docs/specs/00_foundation/05_defines_and_rules.md', kind: 'global variable', names: ['zin_story_pace'] },
  { owner: 'western crossing (modules/mech_crossing.mjs)', spec: 'docs/specs/04_mechanics/western_crossing.md', kind: 'scripted effect', names: ['zin_west_add_fleet'] },
  { owner: 'western crossing (modules/mech_crossing.mjs)', spec: 'docs/specs/04_mechanics/western_crossing.md', kind: 'global flag',
    names: ['zin_west_council', 'zin_west_route_divided', 'zin_west_route_crossing', 'zin_west_route_relief', 'zin_west_route_hold'] },
  { owner: 'western crossing (modules/mech_crossing.mjs)', spec: 'docs/specs/04_mechanics/western_crossing.md', kind: 'global variable', names: ['zin_west_convener'] },
  { owner: 'Eindil journey (modules/mech_eindil.mjs)', spec: 'docs/specs/04_mechanics/eindil_journey.md', kind: 'scripted effect',
    names: ['zin_eindil_add_regard', 'zin_eindil_add_renown', 'zin_eindil_join_coalition'] },
  { owner: 'Yeldenne and Glo (modules/mech_yeldenne.mjs)', spec: 'docs/specs/04_mechanics/yeldenne_and_glo.md', kind: 'scripted effect', names: ['zin_yeldenne_add_wards'] },
  { owner: 'Yeldenne and Glo (modules/mech_yeldenne.mjs)', spec: 'docs/specs/04_mechanics/yeldenne_and_glo.md', kind: 'global flag', names: ['zin_horos_dead', 'zin_yeldenne_forewarned'] },
  { owner: 'Yeldenne and Glo (modules/mech_yeldenne.mjs)', spec: 'docs/specs/04_mechanics/yeldenne_and_glo.md', kind: 'country flag', names: ['zin_glo_petitioned'] },
  { owner: 'Afrit and the Hidden Council (modules/mech_afrit.mjs)', spec: 'docs/specs/04_mechanics/afrit_hidden_council.md', kind: 'global flag', names: ['zin_afrit_at_yeldenne'] },
  { owner: 'world systems (not written yet)', spec: 'docs/specs/04_mechanics/04_magic_and_world_systems.md', kind: 'global variable', names: ['zin_gathering_dark'] },
  { owner: 'economy (modules/economy.mjs)', spec: 'docs/specs/03_gameplay/02_economy.md', kind: 'country flag', names: ['zin_region_cold_lands'] },
  { owner: 'start situation (modules/vanilla_removal.mjs start opinions)', spec: 'docs/specs/02_lore/01_start_situation.md', kind: 'opinion modifier', names: ['zin_opinion_cold_rivalry'] },
  { owner: 'Coldor tree (focus compiler, docs/design/focus/coldor.json)', spec: 'docs/specs/05_focus_trees/major/coldor.md', kind: 'idea', names: ['zin_coldor_ports_against_interior'] },
  { owner: 'Coldor tree (focus compiler, docs/design/focus/coldor.json)', spec: 'docs/specs/05_focus_trees/major/coldor.md', kind: 'country flag (set by the tree, read here)',
    names: ['zin_coldor_accord_decisions', 'zin_coldor_accord_open', 'zin_coldor_cheap_envoys', 'zin_cold_open_hand', 'zin_cold_iron_hand', 'zin_cold_winter_stores', 'zin_cold_timber_market', 'zin_cold_watch_fires', 'zin_cold_hall_respected', 'zin_cold_route_crossing'] },
  { owner: 'regional Cold Lands trees (focus compiler)', spec: 'docs/specs/05_focus_trees/regional/cold_lands.md', kind: 'country flag',
    names: ['zin_regional_yeti_lands_open_to_truce', 'zin_regional_yeti_lands_apart', 'zin_regional_titanos_open_to_pacts', 'zin_regional_titanos_apart', 'zin_regional_windwaith_free_harbours'] },
  { owner: 'warfare (modules/warfare.mjs, data/warfare_ids.json)', spec: 'docs/specs/03_gameplay/01_warfare.md', kind: 'sub-unit',
    names: ['zin_men_infantry', 'zin_men_archers', 'zin_men_cavalry', 'zin_support_scouts', 'zin_support_healers', 'zin_support_quartermasters'] },
  { owner: 'warfare (modules/warfare.mjs, data/warfare_ids.json)', spec: 'docs/specs/03_gameplay/01_warfare.md', kind: 'equipment', names: ['zin_arms_equipment'] },
  { owner: 'warfare (modules/warfare.mjs, data/warfare_ids.json)', spec: 'docs/specs/03_gameplay/01_warfare.md', kind: 'division names group', names: ['ZIN_HOSTS'] },
];
/** Every external name, flattened. */
export const coldExternals = () => new Set(COLD_DEPENDENCIES.flatMap(d => d.names));

const PACTS = [
  { key: 'yeti', country: 'Yeti Lands', pact: 'zin_cold_yeti_pact', event: 'zin_cold.51', openFlag: 'zin_regional_yeti_lands_open_to_truce', apartFlag: 'zin_regional_yeti_lands_apart' },
  { key: 'giant', country: 'Nivaros', pact: 'zin_cold_giant_pact', event: 'zin_cold.52', openFlag: 'zin_regional_titanos_open_to_pacts', apartFlag: 'zin_regional_titanos_apart' },
];

// ------------------------------------------------------------------------------------------------ text placeholders
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
/** A whole number from 0 to 999 in words, as the texts write it. */
export function numberWord(n) {
  if (!Number.isInteger(n) || n < 0 || n > 999) throw new Error(`No number word for ${n}`);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '');
  return `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` and ${numberWord(n % 100)}` : ''}`;
}
/**
 * Resolves the data file's text placeholders: {tag:<country name>} becomes [TAG.GetName] (so a renamed country is named as
 * the game names it), {n:<key>} a number of the data, {w:<key>} that number in words, {month:<1-12>} the calendar's month.
 */
export function resolveText(text, { tags, numbers }) {
  return String(text).replace(/\{(tag|n|w|month):([^}]+)\}/g, (all, kind, arg) => {
    if (kind === 'tag') { const t = tags.get(arg); if (!t) throw new Error(`Text names the country ${arg}, which the roster does not resolve`); return `[${t}.GetName]`; }
    if (kind === 'month') { const m = MONTHS[Number(arg) - 1]; if (!m) throw new Error(`No month ${arg}`); return m.name; }
    if (!(arg in numbers)) throw new Error(`Text names the number ${arg}, which the data file lacks`);
    return kind === 'n' ? num(numbers[arg]) : numberWord(numbers[arg]);
  });
}

export async function buildMechCold(staged, ctx) {
  const data = ctx.data ?? await loadColdData();
  const N = data.numbers, R = data.roster, S = data.seasons, AI = data.ai;
  const found = resolveCountries(ctx.countries, [...R.core, ...Object.keys(R.leans)], R.scan);
  const others = resolveCountries(ctx.countries, R.others);
  const cold = ctx.countries.filter(c => c.scan === R.scan);
  if (cold.length !== R.expectedCountries) throw new Error(`The roster has ${cold.length} ${R.scan} countries, the data expects ${R.expectedCountries}`);
  const tag = n => { const c = found.get(n) ?? others.get(n); if (!c) throw new Error(`${n} is not resolved`); return c.tag; };
  // K56: Yeldenne is a place in Pertolor's land; Pertolor keeps the hall (its state's owner) and is a clan realm like the rest.
  const COL = tag('Coldor'), ISE = tag('Melkgard'), KEEPER = tag('Pertolor'), HOR = tag('Horidor'), WIN = tag('Vindael'), GUN = tag('Gunwyn'), AEN = tag('Aenor');
  const pactTag = p => tag(p.country);
  const clans = cold.filter(c => ![COL, ISE].includes(c.tag));
  for (const name of Object.keys(R.leans)) if (!clans.some(c => c.name === name)) throw new Error(`The lean table names ${name}, which is not a lean-holding Cold Lands country`);
  const textTags = new Map([...found, ...others].map(([n, c]) => [n, c.tag]));
  const T = new Texts(Object.fromEntries(Object.entries(data.text).map(([k, v]) => [k, resolveText(v, { tags: textTags, numbers: N })])));
  const pictures = await knownPictures(), icons = await knownIcons();
  const files = new Map();
  const put = (rel, text) => files.set(rel, text.endsWith('\n') ? text : text + '\n');
  const defs = { effects: [], triggers: [], dateTriggers: [], events: [], decisions: [], categories: [], ideas: [], opinions: [], dynamicModifiers: [], aiStrategies: [] };
  const below = v => num(v + 0.01), above = v => num(v - 0.01);   // inclusive bounds with the strict operators

  // ------------------------------------------------------------------------------------------------ triggers
  const trig = [];
  const T_ = (id, body, note) => { defs.triggers.push(id); trig.push(`${note ? `# ${note}\n` : ''}${id} = {\n${ind(1, fmt(body))}\n}`); };
  T_('zin_cold_is_cold', 'has_country_flag = zin_region_cold_lands', 'A Cold Lands country by its roster region (the economy slice sets the flag on startup).');
  T_('zin_cold_is_clan_realm', `zin_cold_is_cold = yes\nhas_variable = zin_cold_lean\nNOT = {\n  original_tag = ${COL}\n  original_tag = ${ISE}\n}`,
    'Every lean-holding Cold Lands country: the clans, Horidor, Holdon, Fearno, Windwaith, the Yeti Lands and Titanos; never Coldor or Isengard.');
  T_('zin_cold_historical', 'zin_rules_ai_branch_cold_historical = yes', 'zin_rule_cold_isengard resolves to HISTORICAL (directly, or DEFAULT under the historical path), through the rules wrapper.');
  for (const [key, [y, m, d]] of Object.entries(N.dates)) {
    const id = `zin_cold_date_${key}`;
    trig.push(dateTrigger(id, y, m, d, `Standard date ${y}.${m}.${d}, shifted by the story pace.`));
    defs.triggers.push(id); defs.dateTriggers.push(id);
  }
  T_('zin_cold_march_war_allowed', `NOT = { has_global_flag = zin_cold_march_war_active }
country_exists = ${COL}
country_exists = ${ISE}
NOT = { ${COL} = { has_country_flag = zin_cold_march_war_fought } }
NOT = { ${COL} = { has_war_with = ${ISE} } }
OR = {
  AND = {
    zin_cold_date_march_open = yes
    OR = {
      check_variable = { global.zin_gathering_dark > ${above(N.march_dark)} }
      ${ISE} = { check_variable = { zin_cold_isengard_defiance > ${above(N.march_defiance)} } }
    }
  }
  AND = {
    zin_cold_historical = yes
    zin_cold_date_march_historical = yes
  }
}`, 'The peace gate of the March Forts (section 1): after 1 Thaw 1751 with the dark gathering or Isengard defiant, or after 1 Thaw 1752 under the historical rule; fought once.');
  T_('zin_cold_isengard_may_swear', `country_exists = ${ISE}
${ISE} = {
  check_variable = { zin_cold_isengard_defiance < ${below(N.swear_defiance)} }
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
}`, "Read by Coldor's The Cold Lands at Peace.");
  T_('zin_cold_winter_is_hard', `check_variable = { global.zin_cold_winter > 0.99 }\nhas_global_flag = zin_cold_winter_season`);
  T_('zin_cold_is_runner', `NOT = { has_global_flag = zin_cold_month_ran }
OR = {
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
}`, 'The monthly anchor: Coldor, or the Cold Lands country with the most states; the month flag keeps a tie from running twice.');
  put('common/scripted_triggers/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\n\n${trig.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ effects
  const eff = [];
  const E_ = (id, body, note) => { defs.effects.push(id); eff.push(`${note ? `# ${note}\n` : ''}${id} = {\n${ind(1, fmt(body))}\n}`); };
  const sev = N.winter_modifiers;
  const winterYears = Object.keys(N.historical_winters).map(Number);
  if (Math.min(...winterYears) !== START_YEAR) throw new Error(`The historical winters start in ${Math.min(...winterYears)}, the campaign in ${START_YEAR}`);
  const winters = Object.entries(N.historical_winters).map(([year, s]) => `if = {\n  limit = { check_variable = { global.year = ${year} } }\n  set_variable = { global.zin_cold_winter = ${s} }\n}`).join('\n');
  const SEASONS = { mistfall: 'zin_cold.10', moot: 'zin_cold.20', thaw: 'zin_cold.13' };
  const due = key => `global.zin_cold_due_${key}`;
  // Queues a season event on the current country for its due day (meta_effect: the delay of country_event takes no variable).
  const queue = key => `set_variable = { global.zin_cold_delay = ${due(key)} }
subtract_from_variable = { global.zin_cold_delay = global.num_days }
clamp_variable = { var = global.zin_cold_delay min = 1 max = ${S.year_days} }
meta_effect = {
  text = {
    country_event = { id = ${SEASONS[key]} days = [DAYS] }
  }
  DAYS = "[?global.zin_cold_delay|0]"
}`;

  E_('zin_cold_add_lean', `if = {
  limit = { has_variable = zin_cold_lean }
  add_to_variable = { zin_cold_lean = zin_arg_value }
  clamp_variable = { var = zin_cold_lean min = -100 max = 100 }
}`, 'Scope: the country whose lean moves. zin_arg_value: positive toward Fandanar, negative toward Isengard.');
  E_('zin_cold_add_lean_all', `every_country = {
  limit = { zin_cold_is_clan_realm = yes }
  zin_cold_add_lean = yes
}`, 'zin_arg_value on every lean-holding Cold Lands country.');
  E_('zin_cold_add_defiance', `if = {
  limit = { country_exists = ${ISE} }
  ${ISE} = {
    add_to_variable = { zin_cold_isengard_defiance = zin_arg_value }
    clamp_variable = { var = zin_cold_isengard_defiance min = 0 max = 100 }
    if = {
      limit = { check_variable = { zin_cold_isengard_defiance < ${below(N.swear_defiance)} } }
      set_global_flag = zin_cold_charter_ready
    }
    else = {
      clr_global_flag = zin_cold_charter_ready
    }
  }
}`, "zin_arg_value on Isengard's defiance; the flag zin_cold_charter_ready marks the swear threshold.");
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
  add_to_temp_variable = { zin_cold_weight = ${num(N.reach_weight_crown)} }
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
  add_to_temp_variable = { zin_cold_weight = ${num(N.reach_weight_member)} }
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
}`, "The Accord's reach (section 1): 100 x weight / 150 over the Cold Lands states Coldor does not own, Mp'E excluded.");

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
      save_event_target_as = zin_cold_march_attacker
      random_neighbor_state = {
        limit = {
          is_owned_by = ${ISE}
          zin_is_site_isengard_march = yes
        }
        save_event_target_as = zin_cold_march_defender
      }
    }
  }
  if = {
    limit = {
      has_event_target = zin_cold_march_attacker
      has_event_target = zin_cold_march_defender
    }
    set_global_flag = zin_cold_march_war_active
    start_border_war = {
      change_state_after_war = no
      combat_width = ${N.march_width}
      minimum_duration_in_days = ${N.march_days}
      attacker = {
        state = event_target:zin_cold_march_attacker
        num_provinces = ${N.march_provinces}
        on_win = zin_cold.34
        on_lose = zin_cold.35
        on_cancel = zin_cold.36
      }
      defender = {
        state = event_target:zin_cold_march_defender
        num_provinces = ${N.march_provinces}
        on_win = zin_cold.35
        on_lose = zin_cold.34
        on_cancel = zin_cold.36
      }
    }
  }
}`, 'The March Forts (section 1): a border war between a Coldor and an Isengard march state; the attacker is always the Coldor side.');
  E_('zin_cold_end_march_war', `if = {
  limit = { has_global_flag = zin_cold_march_war_active }
  clr_global_flag = zin_cold_march_war_active
  set_variable = { global.zin_cold_march_winner = zin_arg_winner }
  ${COL} = { set_country_flag = zin_cold_march_war_fought }
  if = {
    limit = { check_variable = { zin_arg_winner = 1 } }
${ind(2, call('zin_cold_add_defiance', { value: N.march_defiance_coldor_win }))}
    ${COL} = { add_war_support = ${num(N.march_war_support)} }
    ${ISE} = { add_stability = -${num(N.march_stability)} }
  }
  else = {
${ind(2, call('zin_cold_add_defiance', { value: N.march_defiance_isengard_win }))}
    ${ISE} = { add_war_support = ${num(N.march_war_support)} }
    ${COL} = { add_stability = -${num(N.march_stability)} }
  }
  news_event = { id = zin_cold.32 }
}`, 'zin_arg_winner: 1 Coldor, 2 Isengard. Both sides fire their result event; the flag makes the second call a no-op.');
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
  }
  ${COL} = {
    remove_opinion_modifier = { target = ${ISE} modifier = zin_opinion_cold_rivalry }
    add_opinion_modifier = { target = ${ISE} modifier = zin_cold_accord_kin }
    if = {
      limit = {
        is_faction_leader = yes
        ${ISE} = { is_in_faction = no }
      }
      add_to_faction = ${ISE}
    }
  }
}`, 'Isengard swears to the Northern Accord (section 1): a league, not a crown; it keeps its warlord and its forts.');
  for (const p of PACTS) {
    E_(`zin_cold_add_${p.key}_pact`, `set_temp_variable = { zin_cold_prev = ${p.pact} }
add_to_variable = { ${p.pact} = zin_arg_value }
clamp_variable = { var = ${p.pact} min = 0 max = 3 }
if = {
  limit = {
    check_variable = { zin_cold_prev < 0.99 }
    check_variable = { ${p.pact} > 0.99 }
    country_exists = ${pactTag(p)}
  }
  diplomatic_relation = { country = ${pactTag(p)} relation = non_aggression_pact active = yes }
  ${pactTag(p)} = {
${ind(2, call('zin_cold_add_lean', { value: N.pact_lean }))}
  }
}`, `Scope Coldor. zin_arg_value levels on the ${p.key} pact; reaching level 1 makes the non-aggression pact and lean +${N.pact_lean} (section 4).`);
  }
  E_('zin_cold_set_winter_values', `set_variable = { zin_cold_winter_attr = 0 }
set_variable = { zin_cold_winter_stab = 0 }
set_variable = { zin_cold_winter_pop = 0 }
if = {
  limit = {
    check_variable = { global.zin_cold_winter > 0.99 }
    check_variable = { global.zin_cold_winter < 1.99 }
  }
  set_variable = { zin_cold_winter_attr = ${num(sev.hard[0])} }
  set_variable = { zin_cold_winter_stab = ${num(sev.hard[1])} }
  set_variable = { zin_cold_winter_pop = ${num(sev.hard[2])} }
}
if = {
  limit = { check_variable = { global.zin_cold_winter > 1.99 } }
  set_variable = { zin_cold_winter_attr = ${num(sev.bitter[0])} }
  set_variable = { zin_cold_winter_stab = ${num(sev.bitter[1])} }
  set_variable = { zin_cold_winter_pop = ${num(sev.bitter[2])} }
}
if = {
  limit = { has_country_flag = zin_cold_winter_stores }
  multiply_variable = { zin_cold_winter_attr = 0.5 }
  multiply_variable = { zin_cold_winter_stab = 0.5 }
  multiply_variable = { zin_cold_winter_pop = 0.5 }
}
if = {
  limit = { NOT = { has_dynamic_modifier = { modifier = zin_cold_winter_mod } } }
  add_dynamic_modifier = { modifier = zin_cold_winter_mod }
}
force_update_dynamic_modifier = yes`, 'Scope: a Cold Lands country. The values of zin_cold_winter_mod for this winter; winter stores halve them (section 3).');
  E_('zin_cold_roll_winter', `if = {
  limit = {
    zin_rules_is_historical = yes
    check_variable = { global.year < ${Math.max(...winterYears) + 0.99} }
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
  zin_cold_set_winter_values = yes
}`, 'Sets zin_cold_winter (0 mild, 1 hard, 2 bitter; the fixed list under the historical path) and opens the winter season.');
  E_('zin_cold_end_winter', `clr_global_flag = zin_cold_winter_season
every_country = {
  limit = { zin_cold_is_cold = yes }
  if = {
    limit = { has_dynamic_modifier = { modifier = zin_cold_winter_mod } }
    remove_dynamic_modifier = { modifier = zin_cold_winter_mod }
  }
  clr_country_flag = zin_cold_fed_this_winter
  clr_country_flag = zin_cold_raided_this_winter
}`, 'The Thaw: the season ends and no winter modifier remains.');
  E_('zin_cold_feed', `if = {
  limit = { country_exists = ${COL} }
  var:zin_arg_target = {
${ind(2, call('zin_cold_add_lean', { value: N.feed_lean }))}
    add_stability = ${num(N.feed_stability)}
    set_country_flag = zin_cold_fed_by_fandanar
    set_country_flag = zin_cold_fed_this_winter
    add_opinion_modifier = { target = ${COL} modifier = zin_cold_fed_us }
  }
}`, 'zin_arg_target: the steading Coldor feeds.');
  E_('zin_cold_feed_by_isengard', `var:zin_arg_target = {
${ind(1, call('zin_cold_add_lean', { value: -N.isengard_feed_lean }))}
  add_stability = ${num(N.feed_stability)}
  set_country_flag = zin_cold_fed_by_isengard
  set_country_flag = zin_cold_fed_this_winter
  add_opinion_modifier = { target = ${ISE} modifier = zin_cold_fed_us }
}`, 'zin_arg_target: the steading Isengard feeds.');
  E_('zin_cold_open_neck_road', `if = {
  limit = { NOT = { has_global_flag = zin_cold_neck_road } }
  set_global_flag = zin_cold_neck_road
  if = {
    limit = { country_exists = ${COL} }
    ${COL} = { add_timed_idea = { idea = zin_cold_neck_road_trade days = ${N.neck_road_days} } }
  }
  if = {
    limit = { country_exists = ${GUN} }
    ${GUN} = { add_timed_idea = { idea = zin_cold_neck_road_trade days = ${N.neck_road_days} } }
  }
}`, 'The Neck Road opens (section 7).');
  E_('zin_cold_sell_timber', `add_political_power = ${N.timber_pp}
${call('zin_west_add_fleet', { value: N.timber_fleet })}`, 'Scope Coldor: a timber sale to the West (section 7).');
  E_('zin_cold_chart_far_ice', `set_country_flag = zin_cold_far_ice_charted
add_ideas = zin_cold_far_ice_charted_idea
every_country = {
  limit = {
    zin_cold_is_clan_realm = yes
    any_owned_state = { zin_is_region_far_northwest = yes }
  }
${ind(1, call('zin_cold_add_lean', { value: N.chart_lean }))}
}`, 'Scope Coldor: Beyond the Last Steading (section 5).');
  E_('zin_cold_reward_ice_host', `every_country = {
  limit = { any_owned_state = { zin_is_site_eindil_ice = yes } }
  zin_cold_add_lean = yes
}`, "zin_arg_value toward Fandanar for the owner of the ice host's state (section 5).");
  E_('zin_cold_send_wardens', `${call('zin_eindil_add_regard', { value: N.wardens_regard })}\n${call('zin_eindil_add_renown', { value: N.wardens_renown })}`,
    "Scope Coldor: the wardens' option of journey event 11 (regard and renown, no delay).");
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
}`, "Scope any: A Share of the Plunder (section 8); the joining rule reads zin_cold_joins_crossing.");
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
    division = "name = \\"White Company\\" division_template = \\"White Company\\" start_experience_factor = ${num(N.white_xp)} start_equipment_factor = 1"
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
}`, "Scope Coldor: the White Companies sail (section 8); the template follows the warfare spec's composition.");

  // ------------------------------------------------------------------------------------------------ the seasons
  E_('zin_cold_schedule_seasons', `set_variable = { ${due('mistfall')} = global.num_days }
add_to_variable = { ${due('mistfall')} = ${dayOf(START_YEAR, ...S.mistfall)} }
set_variable = { ${due('moot')} = global.num_days }
add_to_variable = { ${due('moot')} = ${dayOf(START_YEAR + 1, ...S.deepwinter)} }
${queue('mistfall')}
${queue('moot')}`, `Startup: 1 Mistfall ${START_YEAR} lies ${dayOf(START_YEAR, ...S.mistfall)} days and 1 Deepwinter ${START_YEAR + 1} ${dayOf(START_YEAR + 1, ...S.deepwinter)} days after the start.`);
  E_('zin_cold_next_mistfall', `set_variable = { ${due('thaw')} = ${due('mistfall')} }
add_to_variable = { ${due('thaw')} = ${S.thaw_after} }
add_to_variable = { ${due('mistfall')} = ${S.year_days} }
${queue('mistfall')}
${queue('thaw')}`, 'The Thaw falls 120 days after this Mistfall; the next Mistfall a year after this one, counted from the due day.');
  E_('zin_cold_next_moot', `add_to_variable = { ${due('moot')} = ${S.year_days} }\n${queue('moot')}`);
  const catchUp = key => `if = {
  limit = { has_variable = ${due(key)} }
  set_temp_variable = { zin_cold_t_late = ${due(key)} }
  add_to_temp_variable = { zin_cold_t_late = ${S.catch_up_grace} }
  if = {
    limit = { check_variable = { global.num_days > zin_cold_t_late } }
    country_event = { id = ${SEASONS[key]} }
  }
}`;
  E_('zin_cold_monthly', `set_global_flag = { flag = zin_cold_month_ran days = ${N.runner_guard_days} }
${catchUp('mistfall')}
${catchUp('moot')}
${catchUp('thaw')}
if = {
  limit = { country_exists = ${COL} }
  ${COL} = { zin_cold_update_reach = yes }
}
if = {
  limit = { has_global_flag = zin_cold_winter_season }
  every_country = {
    limit = { zin_cold_is_cold = yes }
    zin_cold_set_winter_values = yes
  }
}
if = {
  limit = { country_exists = ${ISE} }
  ${ISE} = {
    set_temp_variable = { zin_cold_drift = 0 }
    if = {
      limit = {
        country_exists = ${COL}
        ${COL} = { check_variable = { zin_cold_accord_reach > ${above(N.reach_defiance)} } }
      }
      add_to_temp_variable = { zin_cold_drift = -${num(N.defiance_reach)} }
    }
    if = {
      limit = {
        country_exists = ${COL}
        ${COL} = { any_enemy_country = { zin_cold_is_cold = no } }
      }
      add_to_temp_variable = { zin_cold_drift = ${num(N.defiance_foreign_war)} }
    }
    if = {
      limit = { has_idea = zin_cold_bread_from_fandanar }
      add_to_temp_variable = { zin_cold_drift = -${num(N.defiance_bread)} }
    }
    set_temp_variable = { zin_arg_value = zin_cold_drift }
    zin_cold_add_defiance = yes
    if = {
      limit = { check_variable = { zin_cold_isengard_defiance > ${above(N.court_defiance)} } }
      every_country = {
        limit = {
          zin_cold_is_clan_realm = yes
          is_neighbor_of = ${ISE}
        }
        set_temp_variable = { zin_arg_value = -${num(N.court_lean)} }
        zin_cold_add_lean = yes
      }
    }
  }
  if = {
    limit = {
      has_global_flag = zin_cold_charter_ready
      NOT = { has_global_flag = zin_cold_charter_sent }
      zin_cold_isengard_may_swear = yes
      country_exists = ${COL}
      ${COL} = {
        has_country_flag = zin_cold_iron_hand
        has_country_flag = zin_cold_march_war_fought
      }
    }
    set_global_flag = zin_cold_charter_sent
    ${ISE} = { country_event = { id = zin_cold.30 } }
  }
}
if = {
  limit = {
    country_exists = ${COL}
    ${COL} = {
      has_idea = zin_cold_hall_guard
      NOT = { has_guaranteed = ${KEEPER} }
    }
  }
  ${COL} = { remove_ideas = zin_cold_hall_guard }
}
every_country = {
  limit = { zin_cold_is_cold = yes }
  mark_focus_tree_layout_dirty = yes
}`, 'The monthly runner (on Coldor, or the anchor): lost seasons, reach, winter values, defiance drift, the Iron Hand charter, the hall guard, and last the Cold Lands tree layouts (E4).');
  E_('zin_cold_on_declare_war', `if = {
  limit = {
    FROM = { original_tag = ${COL} }
    zin_cold_is_cold = no
  }
  set_variable = { global.zin_cold_invader = ROOT }
  ${COL} = {
${PACTS.map(p => `    if = {
      limit = {
        check_variable = { ${p.pact} > 2.99 }
        country_exists = ${pactTag(p)}
      }
      ${pactTag(p)} = { country_event = { id = zin_cold.50 } }
    }`).join('\n')}
  }
}`, 'on_declare_war (ROOT declares, FROM is the target): an outsider attacks Coldor; a level-3 pact calls Hearth and Height.');
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
${COL} = { zin_cold_update_reach = yes }
zin_cold_schedule_seasons = yes`, 'zin_cold.1 on Coldor (section "The situation on 1 Thaw 4A 1748").');
  put('common/scripted_effects/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\n# Scripted effects take no parameters in 1.19.3 (decision E1): a call sets zin_arg_<name> temporary variables first.\n# winner: coldor 1, isengard 2 (zin_cold_end_march_war).\n\n${eff.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ ideas and modifiers
  const ideaList = [
    { id: 'zin_cold_bread_from_fandanar', picture: 'zin_granary', modifier: { stability_factor: 0.03 } },
    { id: 'zin_cold_sworn_to_the_accord', picture: 'zin_banner_league', modifier: { stability_factor: 0.05, army_core_defence_factor: 0.05 } },
    { id: 'zin_cold_neck_road_trade', picture: 'zin_traders_road', modifier: { consumer_goods_factor: -0.02, political_power_gain: 0.05 } },
    { id: 'zin_cold_harbour_compact', picture: 'zin_harbour_lake', modifier: { consumer_goods_factor: -0.01, naval_speed_factor: 0.05 } },
    { id: 'zin_cold_hall_guard', picture: 'zin_castle_ice', modifier: { political_power_gain: -0.05, army_core_defence_factor: 0.03 } },
    { id: 'zin_cold_far_ice_charted_idea', picture: 'zin_compass_rose', modifier: { attrition: -N.far_ice_attrition * N.far_ice_charted_share } },
  ];
  const ideaTexts = [];
  for (const i of ideaList) { if (!icons.has(`GFX_idea_${i.picture}`)) throw new Error(`Idea ${i.id}: picture ${i.picture} is not in the icon catalog`); ideaTexts.push(await renderIdea(i, T)); defs.ideas.push(i.id); }
  put('common/ideas/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\nideas = {\n\tcountry = {\n${ind(2, ideaTexts.join('\n\n'))}\n\t}\n}`);
  const dyn = [
    { id: 'zin_cold_reach_mod', modifier: { political_power_gain: 'zin_cold_reach_pp', winter_attrition_factor: 'zin_cold_reach_winter' } },
    { id: 'zin_cold_winter_mod', modifier: { winter_attrition_factor: 'zin_cold_winter_attr', stability_factor: 'zin_cold_winter_stab', monthly_population: 'zin_cold_winter_pop' } },
    { id: 'zin_cold_far_ice', modifier: { local_supplies: -N.far_ice_supplies, attrition: N.far_ice_attrition } },
  ];
  const dynTexts = [];
  for (const m of dyn) { dynTexts.push(await renderDynamicModifier(m, T)); defs.dynamicModifiers.push(m.id); }
  put('common/dynamic_modifiers/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\n\n${dynTexts.join('\n\n')}`);
  const opinions = [
    { id: 'zin_cold_accord_kin', value: N.opinion_accord_kin }, { id: 'zin_cold_fed_us', value: N.opinion_fed_us, decay: 1 }, { id: 'zin_cold_hall_friend', value: N.opinion_hall_friend },
    { id: 'zin_cold_temple_swords', value: -N.opinion_temple_swords, decay: 0.5 }, { id: 'zin_cold_marriage_kin', value: N.opinion_marriage_kin }, { id: 'zin_cold_road_refused', value: -N.opinion_road_refused, decay: 0.5 },
  ];
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
  // A requirement the player reads has a text of its own, never a raw flag or variable name (CLAUDE.md, localisation rule 7).
  const tip = (key, body) => `custom_trigger_tooltip = {\n  tooltip = ${T.use(key)}\n${body.split('\n').map(l => `  ${l}`).join('\n')}\n}`;
  const hardWinter = () => tip('zin_cold_tt_hard_winter', 'zin_cold_winter_is_hard = yes');
  const notFed = () => tip('zin_cold_tt_not_fed', 'FROM = { NOT = { has_country_flag = zin_cold_fed_this_winter } }');
  const pp = v => `has_political_power > ${v - 1}`;
  const notIsengardWard = { factor: 0, when: `FROM = { is_guaranteed_by = ${ISE} }` };
  const leanFrom = `FROM = {\n  zin_cold_is_clan_realm = yes\n  NOT = { has_war_with = ROOT }\n}`;
  const hiddenLean = v => `hidden_effect = {\n${ind(1, `set_temp_variable = { zin_arg_value = ${v} }\nFROM = { zin_cold_add_lean = yes }`)}\n}\ncustom_effect_tooltip = ${v > 0 ? 'zin_cold_tt_lean_up' : 'zin_cold_tt_lean_down'}`;
  const envoy = (suffix, cost, visible) => ({ id: `zin_cold_send_envoys${suffix}`, icon: 'GFX_idea_zin_envoy', allowed: onlyCol, target_root_trigger: 'has_country_flag = zin_coldor_accord_decisions', target_trigger: leanFrom, visible,
    available: tip('zin_cold_tt_room_to_lean', leanAt('<', 99.99)), cost, days_re_enable: N.envoys_cooldown, complete_effect: hiddenLean(N.envoys_lean),
    ai: { base: AI.envoys.base, mods: [...AI.envoys.lean_steps.map(([l, w]) => ({ add: w, when: leanAt('>', l) })), notIsengardWard, { factor: 0, when: `NOT = { ${pp(AI.envoys.min_pp)} }` }] }, alias: suffix ? 'zin_cold_send_envoys' : undefined });
  const feed = (suffix, cost, visible) => ({ id: `zin_cold_feed_the_steadings${suffix}`, icon: 'GFX_idea_zin_alms_bread', allowed: onlyCol, target_root_trigger: 'has_country_flag = zin_coldor_accord_decisions', target_trigger: leanFrom, visible,
    available: `${hardWinter()}\n${notFed()}`, cost, days_re_enable: N.feed_cooldown,
    complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  zin_cold_feed = yes\n}\ncustom_effect_tooltip = zin_cold_tt_feed`,
    ai: { base: 0, mods: [{ add: AI.feed.weight, when: `${leanAt('>', above(AI.feed.lean_min))}\n${leanAt('<', below(AI.feed.lean_max))}` }, notIsengardWard, { factor: 0, when: `NOT = { ${pp(AI.feed.min_pp)} }` }] }, alias: suffix ? 'zin_cold_feed_the_steadings' : undefined });
  const decisionsList = [
    { ...envoy('', N.envoys_cost, 'NOT = { has_country_flag = zin_coldor_cheap_envoys }'), cat: 'zin_cold_accord' },
    { ...envoy('_cheap', N.envoys_cost_cheap, 'has_country_flag = zin_coldor_cheap_envoys'), cat: 'zin_cold_accord' },
    { ...feed('', N.feed_cost, 'NOT = { has_country_flag = zin_cold_winter_stores }'), cat: 'zin_cold_accord' },
    { ...feed('_cheap', N.feed_cost_stores, 'has_country_flag = zin_cold_winter_stores'), cat: 'zin_cold_accord' },
    { id: 'zin_cold_invite_to_accord', cat: 'zin_cold_accord', icon: 'GFX_idea_zin_handshake_oath', allowed: onlyCol, target_root_trigger: 'has_country_flag = zin_coldor_accord_open', visible: 'has_country_flag = zin_coldor_accord_open',
      target_trigger: `FROM = {\n  zin_cold_is_clan_realm = yes\n  is_in_faction = no\n  NOT = { has_war_with = ROOT }\n}`, available: tip('zin_cold_tt_invite_lean', leanAt('>', above(N.invite_lean))), cost: N.invite_cost, days_re_enable: N.invite_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_cold.40 } }',
      ai: { base: 0, mods: [{ add: AI.invite.weight, when: leanAt('>', above(AI.invite.lean)) }, notIsengardWard, { factor: 0, when: `NOT = { ${pp(AI.invite.min_pp)} }` }] } },
    { id: 'zin_cold_offer_protection', cat: 'zin_cold_accord', icon: 'GFX_idea_zin_pass_fort', allowed: onlyCol, target_root_trigger: 'has_country_flag = zin_coldor_accord_decisions', visible: 'has_country_flag = zin_coldor_accord_decisions',
      target_trigger: `FROM = {\n  zin_cold_is_clan_realm = yes\n  is_subject = no\n  NOT = { has_war_with = ROOT }\n}`, available: `${tip('zin_cold_tt_protect_lean', leanAt('>', above(N.protect_lean)))}\n${tip('zin_cold_tt_protect_reach', `check_variable = { zin_cold_accord_reach > ${above(N.protect_reach)} }`)}`, cost: N.protect_cost, days_re_enable: N.protect_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_cold.41 } }',
      ai: { base: 0, mods: [{ add: AI.protect.weight, when: leanAt('>', above(AI.protect.lean)) }, notIsengardWard, { factor: 0, when: `NOT = { ${pp(AI.protect.min_pp)} }` }] } },
    { id: 'zin_cold_bread_for_isengard', cat: 'zin_cold_accord', icon: 'GFX_idea_zin_granary', allowed: onlyCol, visible: 'has_country_flag = zin_cold_open_hand',
      available: `${hardWinter()}\ncountry_exists = ${ISE}\nNOT = { ${ISE} = { has_idea = zin_cold_bread_from_fandanar } }`, cost: N.bread_cost, days_re_enable: N.bread_cooldown,
      complete_effect: `${ISE} = { add_timed_idea = { idea = zin_cold_bread_from_fandanar days = ${N.bread_days} } }`,
      ai: { base: 0, mods: [{ add: AI.bread.weight, when: pp(AI.bread.pp) }] } },
    { id: 'zin_cold_winter_gifts', cat: 'zin_cold_isengard', icon: 'GFX_idea_zin_tribute_chest', allowed: onlyIse, target_root_trigger: onlyIse, visible: onlyIse,
      target_trigger: leanFrom, available: tip('zin_cold_tt_room_to_lean_isengard', leanAt('>', -99.99)), cost: N.gifts_cost, days_re_enable: N.gifts_cooldown,
      complete_effect: hiddenLean(-N.gifts_lean),
      ai: { base: AI.gifts.base, mods: [{ add: AI.gifts.neighbour, when: 'FROM = { is_neighbor_of = ROOT }' }, { factor: 0, when: `NOT = { ${pp(AI.gifts.min_pp)} }` }] } },
    { id: 'zin_cold_isengard_feeds', cat: 'zin_cold_isengard', icon: 'GFX_idea_zin_alms_bread', allowed: onlyIse, target_root_trigger: 'zin_cold_winter_is_hard = yes', visible: onlyIse,
      target_trigger: leanFrom, available: `${hardWinter()}\n${notFed()}`, cost: N.isengard_feed_cost, days_re_enable: N.feed_cooldown,
      complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  zin_cold_feed_by_isengard = yes\n}\ncustom_effect_tooltip = zin_cold_tt_isengard_feed`,
      ai: { base: 0, mods: [{ add: AI.isengard_feed.neighbour, when: 'FROM = { is_neighbor_of = ROOT }' }, { add: AI.isengard_feed.pp_weight, when: pp(AI.isengard_feed.pp) }] } },
    { id: 'zin_cold_sell_timber_west', cat: 'zin_cold_trade', icon: 'GFX_idea_zin_timber_mill', allowed: onlyCol, visible: 'has_country_flag = zin_cold_timber_market',
      available: tip('zin_cold_tt_west_ready', 'OR = {\n  has_global_flag = zin_west_council\n  has_global_flag = zin_west_route_divided\n  has_global_flag = zin_west_route_crossing\n  has_global_flag = zin_west_route_relief\n  has_global_flag = zin_west_route_hold\n}'), days_re_enable: N.timber_cooldown,
      complete_effect: `zin_cold_sell_timber = yes\nadd_to_variable = { zin_cold_timber_sales = 1 }`,
      ai: { base: AI.timber.base, mods: [
        { add: AI.timber.dated, when: 'zin_cold_date_timber_1 = yes\ncheck_variable = { zin_cold_timber_sales < 0.99 }' },
        { add: AI.timber.dated, when: 'zin_cold_date_timber_2 = yes\ncheck_variable = { zin_cold_timber_sales < 1.99 }' },
        { factor: 0, when: 'zin_cold_historical = yes\nNOT = { zin_cold_date_timber_1 = yes }' },
        { factor: 0, when: 'zin_cold_historical = yes\nNOT = { zin_cold_date_timber_2 = yes }\ncheck_variable = { zin_cold_timber_sales > 0.99 }' },
        { factor: 0, when: 'zin_cold_historical = yes\ncheck_variable = { zin_cold_timber_sales > 1.99 }\nNOT = { has_country_flag = zin_cold_route_crossing }' },
      ] } },
    { id: 'zin_cold_renew_old_pact', cat: 'zin_cold_trade', icon: 'GFX_idea_zin_yeti_claw', allowed: onlyCol, targets: PACTS.map(pactTag),
      target_root_trigger: `OR = {\n${PACTS.map(p => `  has_country_flag = zin_cold_${p.key}_refused`).join('\n')}\n}`, visible: onlyCol,
      target_trigger: `OR = {\n${PACTS.map(p => `  AND = {\n    FROM = { original_tag = ${pactTag(p)} }\n    ROOT = {\n      check_variable = { ${p.pact} < 0.99 }\n      has_country_flag = zin_cold_${p.key}_refused\n    }\n    FROM = { NOT = { has_country_flag = ${p.apartFlag} } }\n  }`).join('\n')}\n}`,
      available: tip('zin_cold_tt_pact_waiting', `OR = {\n${PACTS.map(p => `  AND = {\n    FROM = { original_tag = ${pactTag(p)} }\n    NOT = { has_country_flag = zin_cold_${p.key}_waiting }\n  }`).join('\n')}\n}`),
      cost: N.renew_cost, days_re_enable: N.renew_cooldown,
      complete_effect: PACTS.map((p, i) => `${i ? 'else_if' : 'if'} = {\n  limit = { FROM = { original_tag = ${pactTag(p)} } }\n  FROM = { country_event = { id = ${p.event} } }\n}`).join('\n'),
      ai: { base: AI.renew.base, mods: [{ factor: 0, when: `NOT = { ${pp(AI.renew.min_pp)} }` }] } },
  ];
  const byCat = new Map();
  for (const d of decisionsList) {
    if (!icons.has(d.icon)) throw new Error(`Decision ${d.id}: icon ${d.icon} is not in the catalog`);
    if (d.alias) { T.alias(d.id, d.alias); T.alias(`${d.id}_desc`, `${d.alias}_desc`); }
    defs.decisions.push(d.id);
    if (!byCat.has(d.cat)) byCat.set(d.cat, []);
    byCat.get(d.cat).push(renderDecision(d, T));
  }
  for (const k of ['zin_cold_tt_lean_up', 'zin_cold_tt_lean_down', 'zin_cold_tt_feed', 'zin_cold_tt_isengard_feed']) T.use(k);
  put('common/decisions/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\n\n${[...byCat].map(([cat, list]) => `${cat} = {\n${ind(1, list.join('\n\n'))}\n}`).join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ events
  // AI chance from the lean: `step` per ten points of lean above `from` (inclusive), so a weight follows lean / 10 x step.
  const leanSteps = (step, from, to) => { const out = []; for (let t = from; t <= to; t += 10) out.push({ add: step, when: `check_variable = { zin_cold_lean > ${above(t)} }` }); return out; };
  const pactAccept = leanSteps(10 / AI.pact_lean_divisor, -90, 100);    // 60 + lean / 2: 10 at lean -100, +5 per ten points
  const pactBase = AI.pact_base - 100 / AI.pact_lean_divisor;
  const raiderLean = (punisher) => `if = {\n  limit = { original_tag = ${COL} }\n  event_target:zin_cold_raider = {\n${ind(2, call('zin_cold_add_lean', { value: punisher ? -N.raiders_lean : N.raiders_lean }))}${punisher ? '' : '\n    set_country_flag = zin_cold_fed_by_fandanar'}\n  }\n}\nelse = {\n  event_target:zin_cold_raider = {\n${ind(2, call('zin_cold_add_lean', { value: punisher ? N.raiders_lean : -N.raiders_lean }))}${punisher ? '' : '\n    set_country_flag = zin_cold_fed_by_isengard'}\n  }\n}`;
  const yeldenneFriend = `FROM = {\n  has_country_flag = zin_cold_hall_respected\n  NOT = { has_country_flag = zin_glo_petitioned }\n}`;
  const eventsList = [
    { id: 'zin_cold.1', hidden: true, fire_only_once: true, immediate: 'zin_cold_startup = yes' },
    { id: 'zin_cold.10', hidden: true, immediate: `zin_cold_roll_winter = yes\nevery_country = {\n  limit = { zin_cold_is_cold = yes }\n  country_event = { id = zin_cold.11 }\n}\nzin_cold_next_mistfall = yes` },
    { id: 'zin_cold.11', picture: 'GFX_zin_evt_generic_wilds', descVariants: [{ key: 'mild', trigger: 'check_variable = { global.zin_cold_winter < 0.99 }' }, { key: 'hard', trigger: 'check_variable = { global.zin_cold_winter > 0.99 }\ncheck_variable = { global.zin_cold_winter < 1.99 }' }, { key: 'bitter', trigger: 'check_variable = { global.zin_cold_winter > 1.99 }' }], options: [{ key: 'a' }] },
    { id: 'zin_cold.12', picture: 'GFX_zin_evt_generic_wilds', mtth: `days = ${N.raiders_mtth}`,
      trigger: `OR = {\n  original_tag = ${COL}\n  original_tag = ${ISE}\n}\ncheck_variable = { global.zin_cold_winter > 1.99 }\nhas_global_flag = zin_cold_winter_season\nNOT = { has_country_flag = zin_cold_raided_this_winter }\nany_country = { zin_cold_is_clan_realm = yes }`,
      immediate: `set_country_flag = zin_cold_raided_this_winter\nrandom_country = {\n  limit = { zin_cold_is_clan_realm = yes }\n  save_event_target_as = zin_cold_raider\n}`,
      options: [
        { key: 'a', ai: AI.raiders[0], effect: `add_political_power = -${N.raiders_cost}` },
        { key: 'b', ai: AI.raiders[1], effect: `army_experience = ${N.raiders_xp}\n${raiderLean(true)}` },
        { key: 'c', ai: AI.raiders[2], effect: `add_political_power = -${N.raiders_cost}\n${raiderLean(false)}` },
      ] },
    { id: 'zin_cold.13', hidden: true, immediate: `zin_cold_end_winter = yes\nclear_variable = ${due('thaw')}` },
    { id: 'zin_cold.20', hidden: true, immediate: `every_country = {\n  limit = { zin_cold_is_clan_realm = yes }\n  if = {\n    limit = { has_country_flag = zin_cold_fed_by_fandanar }\n${ind(2, call('zin_cold_add_lean', { value: N.moot_lean }))}\n    clr_country_flag = zin_cold_fed_by_fandanar\n  }\n  if = {\n    limit = { has_country_flag = zin_cold_fed_by_isengard }\n${ind(2, call('zin_cold_add_lean', { value: -N.moot_lean }))}\n    clr_country_flag = zin_cold_fed_by_isengard\n  }\n}\nif = {\n  limit = { country_exists = ${COL} }\n  ${COL} = { country_event = { id = zin_cold.21 } }\n}\nif = {\n  limit = { country_exists = ${ISE} }\n  ${ISE} = { country_event = { id = zin_cold.21 } }\n}\nzin_cold_next_moot = yes` },
    { id: 'zin_cold.21', picture: 'GFX_zin_evt_generic_court', options: [{ key: 'a' }] },
    { id: 'zin_cold.30', picture: 'GFX_zin_evt_generic_court', immediate: call('zin_cold_add_defiance', { value: -N.charter_offered }), options: [
      { key: 'a', ai: { base: AI.charter, mods: [{ factor: 0, when: `check_variable = { zin_cold_isengard_defiance < ${below(N.swear_defiance)} }` }] }, effect: call('zin_cold_add_defiance', { value: N.charter_refused }) },
      { key: 'b', ai: { base: 0, mods: [{ add: AI.charter, when: `check_variable = { zin_cold_isengard_defiance < ${below(N.swear_defiance)} }` }] }, effect: 'zin_cold_isengard_swears = yes' },
    ] },
    // Q-95 (K59): under PLAUSIBLE Coldor leans to history, so the march war (the free branch's) comes three times more slowly.
    { id: 'zin_cold.31', picture: 'GFX_zin_evt_generic_war', mtth: `days = ${N.forts_mtth}\nmodifier = {\n  factor = 3\n  zin_rules_ai_plausible_cold = yes\n}`,
      trigger: `original_tag = ${COL}\ncountry_exists = ${ISE}\nzin_cold_historical = no\nzin_cold_march_war_allowed = yes\n${ISE} = {\n  is_ai = yes\n  check_variable = { zin_cold_isengard_defiance > ${above(N.march_defiance)} }\n}`,
      options: [{ key: 'a', ai: 100, effect: 'zin_cold_start_march_war = yes' }] },
    { id: 'zin_cold.32', kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: 'zin_cold_is_cold = yes', descVariants: [{ key: 'coldor', trigger: 'check_variable = { global.zin_cold_march_winner = 1 }' }, { key: 'isengard', trigger: 'check_variable = { global.zin_cold_march_winner = 2 }' }], options: [{ key: 'a' }] },
    { id: 'zin_cold.33', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: AI.marriage, mods: [{ factor: 0, when: `check_variable = { zin_cold_isengard_defiance < ${below(N.marriage_defiance)} }` }] }, effect: call('zin_cold_add_defiance', { value: N.marriage_refused }) },
      { key: 'b', ai: { base: 0, mods: [{ add: AI.marriage, when: `check_variable = { zin_cold_isengard_defiance < ${below(N.marriage_defiance)} }` }] }, effect: `${call('zin_cold_add_defiance', { value: -N.marriage_accepted })}\nadd_opinion_modifier = { target = ${COL} modifier = zin_cold_marriage_kin }\n${COL} = { add_opinion_modifier = { target = ${ISE} modifier = zin_cold_marriage_kin } }` },
    ] },
    { id: 'zin_cold.34', hidden: true, immediate: call('zin_cold_end_march_war', { winner: 1 }) },
    { id: 'zin_cold.35', hidden: true, immediate: call('zin_cold_end_march_war', { winner: 2 }) },
    { id: 'zin_cold.36', hidden: true, immediate: 'clr_global_flag = zin_cold_march_war_active' },
    { id: 'zin_cold.40', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 100, mods: leanSteps(-AI.join_step, 10, 100) }, effect: call('zin_cold_add_lean', { value: -N.decline_lean }) },
      { key: 'b', ai: { base: 0, mods: leanSteps(AI.join_step, 10, 100) }, effect: `FROM = { add_to_faction = ROOT }\nadd_opinion_modifier = { target = FROM modifier = zin_cold_accord_kin }\nFROM = { add_opinion_modifier = { target = ROOT modifier = zin_cold_accord_kin } }` },
    ] },
    { id: 'zin_cold.41', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 100, mods: leanSteps(-AI.join_step, AI.protect_offset + 10, 100) }, effect: call('zin_cold_add_lean', { value: -N.refuse_lean }) },
      { key: 'b', ai: { base: 0, mods: [...leanSteps(AI.join_step, AI.protect_offset + 10, 100), { factor: AI.protect_war_factor, when: 'has_war = yes' }] }, effect: 'FROM = { puppet = ROOT }' },
    ] },
    { id: 'zin_cold.50', picture: 'GFX_zin_evt_generic_war', trigger: 'NOT = { has_war_with = FROM }', options: [
      { key: 'a', ai: 0 },
      { key: 'b', ai: AI.hearth, effect: `if = {\n  limit = { has_variable = global.zin_cold_invader }\n  var:global.zin_cold_invader = {\n    ROOT = { add_to_war = { targeted_alliance = FROM enemy = PREV hostility_reason = asked_to_join } }\n  }\n}` },
    ] },
    ...PACTS.map(p => ({ id: p.event, picture: 'GFX_zin_evt_generic_wilds', options: [
      { key: 'a', ai: { base: 100 - pactBase, mods: [...leanSteps(-10 / AI.pact_lean_divisor, -90, 100), { add: 100, when: `has_country_flag = ${p.apartFlag}` }] },
        effect: `${call('zin_cold_add_lean', { value: -N.pact_refused })}\nFROM = {\n  set_country_flag = zin_cold_${p.key}_refused\n  set_country_flag = { flag = zin_cold_${p.key}_waiting days = ${N.renew_wait} }\n}` },
      { key: 'b', ai: { base: pactBase, mods: [...pactAccept, { factor: AI.pact_open_factor, when: `has_country_flag = ${p.openFlag}` }, { factor: 0, when: `has_country_flag = ${p.apartFlag}` }] },
        effect: `FROM = {\n  clr_country_flag = zin_cold_${p.key}_refused\n${ind(1, call(`zin_cold_add_${p.key}_pact`, { value: 1 }))}\n}` },
    ] })),
    { id: 'zin_cold.60', picture: 'GFX_zin_evt_generic_wilds', fire_only_once: true, auto: true,
      trigger: `original_tag = ${COL}\nhas_country_flag = zin_cold_watch_fires\nhas_global_flag = zin_afrit_at_yeldenne\nNOT = { has_global_flag = zin_horos_dead }`, mtth: 'days = 2',
      options: [
        { key: 'a', ai: 100 },
        { key: 'b', ai: 0, effect: `set_global_flag = zin_yeldenne_forewarned\nrandom_country = {\n  limit = { any_owned_state = { zin_is_site_parim = yes } }\n  ROOT = { add_opinion_modifier = { target = PREV modifier = zin_cold_temple_swords } }\n}` },
      ] },
    { id: 'zin_cold.61', picture: 'GFX_zin_evt_yeldenne_hall', options: [
      { key: 'a', ai: { base: 100, mods: [{ factor: 0, when: yeldenneFriend }] } },
      { key: 'b', ai: { base: 0, mods: [{ add: 100, when: yeldenneFriend }] }, effect: `${call('zin_yeldenne_add_wards', { value: N.guard_wards })}\nFROM = {\n  give_guarantee = ROOT\n  add_ideas = zin_cold_hall_guard\n}` },
    ] },
    { id: 'zin_cold.70', picture: 'GFX_zin_evt_generic_peace', options: [
      { key: 'a', ai: 0, effect: `if = {\n  limit = { country_exists = ${GUN} }\n  ${GUN} = { add_opinion_modifier = { target = ROOT modifier = zin_cold_road_refused } }\n}` },
      { key: 'b', ai: 100, effect: 'zin_cold_open_neck_road = yes' },
    ] },
    { id: 'zin_cold.71', picture: 'GFX_zin_evt_generic_sea', trigger: 'NOT = { has_idea = zin_cold_harbour_compact }', options: [
      { key: 'a', ai: { base: 100, mods: [{ factor: 0, when: 'check_variable = { zin_cold_lean > -0.01 }\nNOT = { has_country_flag = zin_regional_windwaith_free_harbours }' }] }, effect: call('zin_cold_add_lean', { value: -N.compact_refused }) },
      { key: 'b', ai: { base: 0, mods: [{ add: 100, when: 'check_variable = { zin_cold_lean > -0.01 }' }, { factor: 0, when: 'has_country_flag = zin_regional_windwaith_free_harbours' }] }, effect: `add_ideas = zin_cold_harbour_compact\nFROM = { add_ideas = zin_cold_harbour_compact }\n${call('zin_cold_add_lean', { value: N.compact_lean })}` },
    ] },
  ];
  const eventTexts = [];
  for (const e of eventsList) {
    if (!e.hidden && !pictures.has(e.picture)) throw new Error(`Event ${e.id}: picture ${e.picture} is not in the catalog`);
    eventTexts.push(renderEvent(e, T)); defs.events.push(e.id);
  }
  put('events/zin_cold.txt', `${HEADER('mech_cold', SPEC)}\nadd_namespace = zin_cold\n\n${eventTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ on_actions and AI
  // The monthly runner hangs on the Cold Lands tags' own monthly hooks (on_monthly_<TAG>), never on the every-country on_monthly:
  // Coldor runs it, and only if Coldor is gone does the largest other Cold Lands country take it over (zin_cold_is_runner).
  const monthly = cold.map(c => `\ton_monthly_${c.tag} = {\n\t\teffect = {\n\t\t\tif = {\n\t\t\t\tlimit = { zin_cold_is_runner = yes }\n\t\t\t\tzin_cold_monthly = yes\n\t\t\t}\n\t\t}\n\t}`).join('\n');
  put('common/on_actions/zin_cold.txt', `${HEADER('mech_cold', SPEC)}
on_actions = {
	on_startup = {
		effect = {
			${COL} = { country_event = { id = zin_cold.1 } }
		}
	}
${monthly}
	on_declare_war = {
		effect = {
			zin_cold_on_declare_war = yes
		}
	}
}`);
  const strat = (id, allowed, enable, lines) => `${id} = {\n${allowed ? `\tallowed = { ${allowed} }\n` : ''}\tenable = {\n${ind(2, fmt(enable))}\n\t}\n\tabort_when_not_enabled = yes\n${lines.map(([type, tg, v]) => `\tai_strategy = {\n\t\ttype = ${type}\n\t\tid = "${tg}"\n\t\tvalue = ${v}\n\t}`).join('\n')}\n}`;
  const strategies = [
    ['zin_cold_coldor_stance', `original_tag = ${COL}`, `original_tag = ${COL}`, [['befriend', HOR, N.ai_befriend_horidor], ['antagonize', ISE, N.ai_antagonize_isengard]]],
    ['zin_cold_isengard_stance', `original_tag = ${ISE}`, `original_tag = ${ISE}`, [['antagonize', COL, N.ai_isengard_antagonize]]],
    ['zin_cold_clans_lean_fandanar', null, `zin_cold_is_clan_realm = yes\ncheck_variable = { zin_cold_lean > 50 }`, [['befriend', COL, N.ai_clan_befriend]]],
    ['zin_cold_clans_lean_isengard', null, `zin_cold_is_clan_realm = yes\ncheck_variable = { zin_cold_lean < -50 }`, [['befriend', ISE, N.ai_clan_befriend]]],
  ];
  put('common/ai_strategy/zin_cold.txt', [HEADER('mech_cold', SPEC), ...strategies.map(s => strat(...s))].join('\n\n'));
  defs.aiStrategies.push(...strategies.map(s => s[0]));

  // ------------------------------------------------------------------------------------------------ text and output
  const unused = T.unused();
  if (unused.length) throw new Error(`mech_cold: the data file holds text nothing uses: ${unused.join(', ')}`);
  const entries = T.entries();
  await assertCleanText('mech_cold', entries);
  for (const [rel, text] of files) staged.text(rel, text);
  staged.loc('zin_cold', entries);
  return {
    files: [...files.keys(), 'localisation/english/zin_cold_l_english.yml'].sort(), text: entries, definitions: defs, dependencies: COLD_DEPENDENCIES, externalEvents: [],
    counts: { effects: defs.effects.length, triggers: defs.triggers.length, events: defs.events.length, decisions: defs.decisions.length, categories: defs.categories.length, ideas: defs.ideas.length, opinions: defs.opinions.length, dynamicModifiers: defs.dynamicModifiers.length, aiStrategies: defs.aiStrategies.length, textKeys: Object.keys(entries).length },
    tags: { coldor: COL, isengard: ISE, keeper: KEEPER, horidor: HOR, windwaith: WIN, gunwaith: GUN, aenor: AEN, yeti: pactTag(PACTS[0]), titanos: pactTag(PACTS[1]), clanRealms: clans.length, cold: cold.map(c => c.tag) },
  };
}
