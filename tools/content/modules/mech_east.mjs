// The eastern kings mechanic (docs/specs/04_mechanics/eastern_kings.md): the caravan roads and their charters, the rivalry of Noris
// and Stabilo, the courts' lean, the kneel bias, the eastern coalition and the invasion of the Magical Lands, the King of the East as
// the East lives it, the unified East, and the South Lands desert.
//   buildMechEast(staged, { countries, data?, treeDir? }) -> { files, counts, definitions, dependencies, externalEvents, ... }
// This file writes the scripted triggers and the effects; mech_east_content.mjs the ideas, modifiers, decisions, events, on_actions and AI.
// Integration note, deviations and dependencies: docs/design/stage2/mech_east.md. In short: the road, rift and South Lands state lists are
// rows of the key-sites table (decision E7: sites.mjs owns every zin_is_site_* and zin_is_region_* trigger and resolves the rows this
// module declares in SITE_ROWS from the spec's waypoints), not resolved here; the events
// the war events spec owns (zin_east.41 to .46, .50 to .52, .60) are fired here at their beats and served by effects of this module, never
// defined; the monthly runner is the self-scheduling hidden event zin_east.2 of the spec (no every-country on_monthly).
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fmt, ind, call, num, HEADER, Texts, resolveCountries, dateTrigger, assertCleanText } from '../lib/mech_kit.mjs';
import { buildEastContent } from './mech_east_content.mjs';
import { ZIN } from '../lib/paths.mjs';
import { countryTable } from '../lib/roster.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const EAST_DATA_FILE = path.join(here, '../data/mech_regions_east.json');
export const loadEastData = async (file = EAST_DATA_FILE) => JSON.parse(await readFile(file, 'utf8'));
export const EAST_SPEC = 'docs/specs/04_mechanics/eastern_kings.md';
export const EAST_NOTE = 'docs/design/stage2/mech_east.md';
export const ROADS = [{ key: 'salt', code: 1 }, { key: 'gold', code: 2 }, { key: 'rift', code: 3 }, { key: 'lake', code: 4 }, { key: 'sand', code: 5 }];

/**
 * Names this module uses and does not define, grouped by the owner that must define them. Kinds: effects, triggers, events (fired here),
 * categories, templates, dynamicModifiers, scriptedLoc, variables, globalFlags, countryFlags. The test checks both ways: every
 * name the staged script uses and does not define is listed here, and every name listed here is used.
 */
export const EAST_DEPENDENCIES = [
  { owner: 'key sites (modules/sites.mjs, decision E7; not built)', spec: 'docs/specs/01_map/02_key_sites.md',
    triggers: ['zin_is_region_east_lands', 'zin_is_region_south_lands', 'zin_is_region_magical_lands', 'zin_is_region_middle_lands', ...ROADS.map(r => `zin_is_site_road_${r.key}`), 'zin_is_site_rift_east', 'zin_is_site_rift_west'] },
  { owner: 'Afrit mechanic (modules/mech_afrit.mjs)', spec: 'docs/specs/04_mechanics/afrit_hidden_council.md',
    effects: ['zin_afrit_add_footholds', 'zin_afrit_add_veil'], triggers: ['zin_afrit_is_hub', 'zin_afrit_eastern_candidate'], categories: ['zin_afrit_council'], scriptedLoc: ['zin_loc_deliverer'],
    variables: ['zin_footholds'], globalFlags: ['zin_afrit_king_of_east', 'zin_afrit_dead', 'zin_afrit_returned'], countryFlags: ['zin_afrit_eastern_client'] },
  { owner: 'elves (modules/mech_elves.mjs)', spec: 'docs/specs/04_mechanics/elves_wall_and_dragons.md', effects: ['zin_elves_on_eastern_invasion'], triggers: ['zin_elves_is_magical_realm'] },
  { owner: 'rules (modules/rules.mjs)', spec: 'docs/specs/00_foundation/05_defines_and_rules.md',
    triggers: ['zin_rules_is_historical', 'zin_rules_is_free', 'zin_rules_ai_branch_east_refuse_afrit', 'zin_rules_ai_branch_east_unite_without_afrit', 'zin_rules_ai_random_east'], variables: ['zin_story_pace'] },
  { owner: 'diplomacy (modules/diplomacy.mjs)', spec: 'docs/specs/03_gameplay/03_diplomacy_and_factions.md',
    templates: ['zin_faction_free_crowns'], dynamicModifiers: ['zin_cb_eastern_ambition'], countryFlags: ['zin_story_war'] },
  { owner: 'world systems (not built)', spec: 'docs/specs/03_gameplay/05_world_tension_and_endings.md', variables: ['zin_gathering_dark'], globalFlags: ['zin_war_of_last_crowns'] },
  { owner: 'Aenor succession (modules/mech_aenor.mjs)', spec: 'docs/specs/04_mechanics/aenor_court_and_succession.md', globalFlags: ['zin_golden_king_dead'] },
  { owner: 'Eindil journey (modules/mech_eindil.mjs)', spec: 'docs/specs/04_mechanics/eindil_journey.md', globalFlags: ['zin_eindil_returned'] },
  { owner: 'war events (modules/events_mech_war.mjs, data/events_mech_east.json)', spec: 'docs/specs/06_events/03_war_of_the_last_crowns.md',
    events: ['zin_east.41', 'zin_east.42', 'zin_east.43', 'zin_east.44', 'zin_east.45', 'zin_east.46', 'zin_east.50', 'zin_east.51', 'zin_east.52', 'zin_east.60'] },
  { owner: 'Noris tree (docs/design/focus/noris.json, focus compiler)', spec: 'docs/specs/05_focus_trees/major/noris.md',
    effects: ['zin_noris_monthly'], countryFlags: ['zin_noris_route_shield', 'zin_noris_route_high_king', 'zin_noris_envoys', 'zin_noris_open_treaty', 'zin_noris_banner', 'zin_noris_audit', 'zin_noris_riders_for_host'] },
  { owner: 'Stabilo tree (docs/design/focus/stabilo.json, focus compiler)', spec: 'docs/specs/05_focus_trees/major/stabilo.md',
    effects: ['zin_stabilo_monthly', 'zin_stabilo_add_debt'], events: ['zin_stabilo.30', 'zin_stabilo.31'], variables: ['zin_stabilo_debt'],
    countryFlags: ['zin_stabilo_route_free', 'zin_stabilo_route_empire', 'zin_stabilo_envoys', 'zin_stabilo_open_pact', 'zin_stabilo_pact_under_prince', 'zin_stabilo_audit', 'zin_stabilo_rival_banks', 'zin_stabilo_ledger_open', 'zin_stabilo_loans_to_kings', 'zin_stabilo_collect'] },
  { owner: 'eastern trees (Noris, Stabilo, the tier B courts, shared_east_lands)', spec: 'docs/specs/05_focus_trees/',
    countryFlags: ['zin_east_pledged', 'zin_east_route_resist', 'zin_east_court_audit', 'zin_east_wells_unlocked', 'zin_east_courts_noris', 'zin_east_courts_stabilo'] },
];
/**
 * The site rows this spec hands to the key-sites module (E7): the two seats, the five roads by their waypoints, the rift coasts and
 * the two regions. sites.mjs owns the triggers they become (zin_is_site_<key>, zin_is_region_<key>); this module writes none.
 */
export function eastSiteRows(data, countries) {
  const rows = data.sites?.rows ?? [];
  const names = new Set(countries.map(c => c.name));
  const keys = new Set(rows.map(r => r.key));
  const waypoint = w => {
    if (typeof w !== 'string') { if (!w?.nearest?.target) throw new Error(`mech_east: a site waypoint is neither a name nor a nearest rule: ${JSON.stringify(w)}`); return waypoint(w.nearest.target); }
    const [kind, name] = w.split(/:(.*)/s);
    if (kind === 'capital' && !names.has(name)) throw new Error(`mech_east: site waypoint ${w} names no country of the roster`);
    if (kind === 'site' && !keys.has(name)) throw new Error(`mech_east: site waypoint ${w} names no site row`);
    if (!['capital', 'site'].includes(kind)) throw new Error(`mech_east: site waypoint ${w} is not capital:<country> or site:<key>`);
  };
  for (const r of rows) for (const p of [r.rule?.path, ...(r.rule?.branches ?? [])].filter(Boolean)) p.forEach(waypoint);
  for (const r of ROADS) if (!keys.has(`road_${r.key}`)) throw new Error(`mech_east: the site rows have no road_${r.key}`);
  return rows.map(r => ({ ...r, trigger: `zin_is_${r.kind === 'region' ? 'region' : 'site'}_${r.key}`, module: 'mech_east' }));
}
export const SITE_ROWS = eastSiteRows(await loadEastData(), countryTable());
/** Every external name of one kind, across owners. */
export const eastExternals = kind => [...new Set(EAST_DEPENDENCIES.flatMap(d => d[kind] ?? []))];
/** The tree-declared effects the mechanic calls, with the design file that must declare each (no stub is ever written for them). */
export const TREE_EFFECTS = { zin_noris_monthly: 'noris.json', zin_stabilo_monthly: 'stabilo.json', zin_stabilo_add_debt: 'stabilo.json' };

export async function buildMechEast(staged, ctx) {
  const data = ctx.data ?? await loadEastData();
  const N = data.numbers, R = data.roster, T = new Texts(data.text);
  const found = resolveCountries(ctx.countries, [R.noris, R.stabilo, ...R.great, ...Object.keys(R.leans), ...R.befriendNoris, ...R.befriendStabilo, ...R.befriendBoth], R.scan);
  const others = resolveCountries(ctx.countries, [R.aenor, R.worshipdom]);
  const east = ctx.countries.filter(c => c.scan === R.scan);
  if (east.length !== R.expectedCountries) throw new Error(`The roster has ${east.length} ${R.scan} countries, the data expects ${R.expectedCountries}`);
  const statesTotal = east.reduce((a, c) => a + c.states, 0);
  if (statesTotal !== R.expectedStates) throw new Error(`The ${R.scan} countries hold ${statesTotal} states, the data expects ${R.expectedStates}`);
  // The start values of the spec's tables: charters 0 free, 1 Noris, 2 Stabilo; influence 0 to 100; lean -100 to 100 and only on courts.
  for (const r of ROADS) {
    const row = N.roads[r.key];
    if (!row) throw new Error(`mech_east: the data has no start row for the ${r.key} road`);
    if (![0, 1, 2].includes(row.charter)) throw new Error(`mech_east: the ${r.key} road's start charter must be 0, 1 or 2, not ${row.charter}`);
    for (const side of ['noris', 'stabilo']) if (!(row[side] >= 0 && row[side] <= 100)) throw new Error(`mech_east: the ${r.key} road's ${side} influence must lie in 0 to 100, not ${row[side]}`);
  }
  for (const [n, v] of Object.entries(R.leans)) {
    if (n === R.noris || n === R.stabilo) throw new Error(`mech_east: ${n} is a power; the lean belongs to the courts only`);
    if (!(v >= -100 && v <= 100)) throw new Error(`mech_east: the start lean of ${n} must lie in -100 to 100, not ${v}`);
  }
  const tag = n => (found.get(n) ?? others.get(n)).tag;
  const siteRows = eastSiteRows(data, ctx.countries);
  const tags = { NOR: tag(R.noris), STA: tag(R.stabilo), AEN: tag(R.aenor), WOR: tag(R.worshipdom) };
  const { NOR, STA, AEN, WOR } = tags;
  // The Magical Lands realms the coalition may cross to: the roster's Magical Lands countries without the Worshipdom (the elves
  // module's zin_elves_is_magical_realm list).
  const realms = ctx.countries.filter(c => c.scan === R.magicalScan && c.tag !== WOR);
  // A fixed tie-break by tag (decision of the spec: "ties: ... then tag"): the earliest tag ranks highest.
  const ranked = [...east, ...realms].map(c => c.tag).sort();
  const files = new Map();
  const put = (rel, text) => files.set(rel, text.endsWith('\n') ? text : text + '\n');
  const defs = { effects: [], triggers: [], dateTriggers: [], events: [], decisions: [], categories: [], ideas: [], opinions: [], dynamicModifiers: [], aiStrategies: [], scriptedLocs: [] };

  // The tree-declared effects must be declared by the Noris and Stabilo designs; the mechanic never stages a stub for them.
  const treeDir = ctx.treeDir ?? path.join(ZIN, 'docs/design/focus');
  for (const [name, file] of Object.entries(TREE_EFFECTS)) {
    const f = path.join(treeDir, file);
    const declared = existsSync(f) && name in (JSON.parse(await readFile(f, 'utf8')).scripted_effects ?? {});
    if (!declared) throw new Error(`mech_east calls ${name}, which ${file} in ${treeDir} does not declare (the mechanic writes no stub for a tree name)`);
  }

  // A comparison for "the best country": the first variable (descending, or ascending with low), then the state count, then the tag rank.
  // Used inside any_other_country, where THIS is the rival and PREV the candidate.
  const outranks = (v, { low = false, states = true } = {}) => {
    const cmp = low ? '<' : '>';
    const rows = [`check_variable = { ${v} ${cmp} PREV.${v} }`];
    if (states) rows.push(`AND = {\n  check_variable = { ${v} = PREV.${v} }\n  check_variable = { num_owned_states > PREV.num_owned_states }\n}`);
    rows.push(`AND = {\n  check_variable = { ${v} = PREV.${v} }\n${states ? '  check_variable = { num_owned_states = PREV.num_owned_states }\n' : ''}  check_variable = { zin_east_rank > PREV.zin_east_rank }\n}`);
    return `OR = {\n${ind(1, fmt(rows.join('\n')))}\n}`;
  };
  // The best country of a pool (pool: trigger lines; order: the outranks comparison).
  const best = (pool, order, body) => `random_country = {
  limit = {
${ind(2, fmt(pool))}
    NOT = {
      any_other_country = {
${ind(4, fmt(pool))}
${ind(4, fmt(order))}
      }
    }
  }
${ind(1, fmt(body))}
}`;
  const ge = (v, x) => `check_variable = { ${v} > ${num(x - 0.01)} }`;

  // ------------------------------------------------------------------------------------------------ triggers
  const trig = [];
  const T_ = (id, body) => { defs.triggers.push(id); trig.push(`${id} = {\n${ind(1, fmt(body))}\n}`); };
  T_('zin_is_noris', `original_tag = ${NOR}`);
  T_('zin_is_stabilo', `original_tag = ${STA}`);
  // A country whose capital_scope resolves: it exists and controls a state. AND stops at the first false line, so a capital_scope after
  // this guard is never evaluated on a tag that is not in play or holds no land (the wiki's Scopes page, "Invalid event target").
  T_('zin_east_has_capital', 'exists = yes\nnum_of_controlled_states > 0');
  const capitalIn = body => `zin_east_has_capital = yes\ncapital_scope = ${body}`;
  // An East Lands country: its capital lies in the East Lands (spec, Scripted triggers: zin_east_is_court).
  T_('zin_east_in_region', capitalIn('{ zin_is_region_east_lands = yes }'));
  T_('zin_east_is_power', `OR = {\n  original_tag = ${NOR}\n  original_tag = ${STA}\n}`);
  T_('zin_east_is_court', `zin_east_in_region = yes\nzin_east_is_power = no`);
  T_('zin_east_is_south_court', 'has_country_flag = zin_east_south_court');
  T_('zin_east_faces_rift', 'any_owned_state = { zin_is_site_rift_east = yes }');
  for (const [key, [y, m, d]] of Object.entries(N.dates)) { const id = `zin_east_after_${key}`; trig.push(dateTrigger(id, y, m, d, `Standard date ${y}.${m}.${d}, shifted by the story pace.`)); defs.triggers.push(id); defs.dateTriggers.push(id); }
  T_('zin_east_caravan_war_open', `OR = {
  has_global_flag = zin_war_of_last_crowns
  AND = {
    ${ge('global.zin_east_rivalry', N.war_rivalry)}
    ${ge('global.zin_gathering_dark', N.war_dark)}
    zin_east_after_caravan_war = yes
  }
}`);
  // The peace gate of every eastern claim (spec, Peace gates): the war, the Caravan War gate, or the King of the East.
  T_('zin_east_claims_open', 'OR = {\n  zin_east_caravan_war_open = yes\n  has_global_flag = zin_afrit_king_of_east\n}');
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
  // At war with a realm of the Magical or Middle Lands (the coalition's peace, the stranded companies).
  T_('zin_east_at_war_in_the_west', `any_enemy_country = {\n${ind(1, capitalIn('{\n  OR = {\n    zin_is_region_magical_lands = yes\n    zin_is_region_middle_lands = yes\n  }\n}'))}\n}`);
  put('common/scripted_triggers/zin_east.txt', `${HEADER('mech_east', EAST_SPEC)}\n# Integration note: ${EAST_NOTE}.\n\n${trig.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ effects
  const eff = [];
  const E_ = (id, body) => { defs.effects.push(id); eff.push(`${id} = {\n${ind(1, fmt(body))}\n}`); };
  const roadSwitch = body => ROADS.map(r => `if = {\n  limit = { check_variable = { zin_arg_road = ${r.code} } }\n${ind(1, fmt(body(r)))}\n}`).join('\n');
  const inf = r => `zin_east_inf_${r.key}`;
  const powers = [{ tag: NOR, code: 1, name: 'noris' }, { tag: STA, code: 2, name: 'stabilo' }];
  // A major news event reaches every country from one firing; firing it in every country would show each player one window per country.
  const everyNews = id => `news_event = { id = ${id} }`;

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
  set_variable = { zin_east_charters = ${num(ROADS.length * N.concord_road_share)} }
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
multiply_temp_variable = { zin_east_allies = ${N.dominance_faction_share} }
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

  // the monthly influence, charter and rivalry update, one block per road (spec section 1)
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
    // a power that no longer exists reads as 0 on every count and influence
    const read = (p, temp, v) => `set_temp_variable = { ${temp} = 0 }\nif = {\n  limit = { country_exists = ${p.tag} }\n  ${p.tag} = { set_temp_variable = { ${temp} = ${v} } }\n}`;
    return `# ${k}
${read(powers[0], `zin_e_nc_${k}`, `zin_east_ctrl_${k}`)}
${read(powers[1], `zin_e_sc_${k}`, `zin_east_ctrl_${k}`)}
${drift(powers[0])}
${drift(powers[1])}
# a power that is gone gives up the charters it held
${powers.map(p => `if = {\n  limit = {\n    NOT = { country_exists = ${p.tag} }\n    check_variable = { global.zin_east_road_${k} = ${p.code} }\n  }\n  set_variable = { global.zin_east_road_${k} = 0 }\n}`).join('\n')}
# charters freeze while the Concord holds
if = {
  limit = { NOT = { has_global_flag = zin_east_roads_concord } }
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
${ind(1, read(powers[0], 'zin_e_n', inf(r)))}
${ind(1, read(powers[1], 'zin_e_s', inf(r)))}
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
        ${ge('zin_e_n', N.charter_free)}
        ${ge('zin_e_lead', N.charter_gap)}
      }
      set_temp_variable = { zin_e_new = 1 }
    }
    else_if = {
      limit = {
        country_exists = ${STA}
        ${ge('zin_e_s', N.charter_free)}
        ${ge('zin_e_back', N.charter_gap)}
      }
      set_temp_variable = { zin_e_new = 2 }
    }
  }
  else_if = {
    limit = {
      check_variable = { global.zin_east_road_${k} = 1 }
      country_exists = ${STA}
      check_variable = { zin_e_n < ${N.charter_lose} }
      ${ge('zin_e_s', N.charter_free)}
    }
    set_temp_variable = { zin_e_new = 2 }
  }
  else_if = {
    limit = {
      check_variable = { global.zin_east_road_${k} = 2 }
      country_exists = ${NOR}
      check_variable = { zin_e_s < ${N.charter_lose} }
      ${ge('zin_e_n', N.charter_free)}
    }
    set_temp_variable = { zin_e_new = 1 }
  }
  # one charter changes hands in a month, so the news names the right road; another waits for the next month
  if = {
    limit = {
      check_variable = { zin_e_moved = 0 }
      NOT = { check_variable = { zin_e_new = global.zin_east_road_${k} } }
    }
    set_temp_variable = { zin_e_moved = 1 }
    set_variable = { global.zin_east_road_${k} = zin_e_new }
    set_variable = { global.zin_east_last_road = ${r.code} }
    set_variable = { global.zin_east_last_winner = zin_e_new }
${ind(2, call('zin_east_add_rivalry', { value: N.charter_rivalry }))}
    zin_east_charter_changed = yes
  }
}
# courts on a held road drift toward its holder
${powers.map(p => `if = {
  limit = { check_variable = { global.zin_east_road_${k} = ${p.code} } }
  every_country = {
    limit = {
      zin_east_is_court = yes
      any_owned_state = { zin_is_site_road_${k} = yes }
    }
${ind(2, call('zin_east_add_lean', { value: p.code === 1 ? N.court_drift : -N.court_drift }))}
  }
}`).join('\n')}`;
  };
  E_('zin_east_charter_changed', `# the loser is shaken, the winner is envied; the news goes to both powers and to every court on the road
if = {
  limit = { check_variable = { global.zin_east_last_winner = 1 } }
  ${STA} = {
    set_country_flag = { flag = zin_east_in_crisis days = ${N.crisis_days} }
    add_opinion_modifier = { target = ${NOR} modifier = zin_east_charter_lost }
  }
}
else_if = {
  limit = { check_variable = { global.zin_east_last_winner = 2 } }
  ${NOR} = {
    set_country_flag = { flag = zin_east_in_crisis days = ${N.crisis_days} }
    add_opinion_modifier = { target = ${STA} modifier = zin_east_charter_lost }
  }
}
if = {
  limit = { country_exists = ${NOR} }
  ${NOR} = { country_event = { id = zin_east.10 } }
}
if = {
  limit = { country_exists = ${STA} }
  ${STA} = { country_event = { id = zin_east.10 } }
}
${ROADS.map(r => `if = {\n  limit = { check_variable = { global.zin_east_last_road = ${r.code} } }\n  every_country = {\n    limit = {\n      zin_east_is_court = yes\n      any_owned_state = { zin_is_site_road_${r.key} = yes }\n    }\n    country_event = { id = zin_east.10 }\n  }\n}`).join('\n')}`);
  E_('zin_east_roads_month', `# a power that is gone leaves the survivor +${N.survivor_influence} influence on each road, once
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
set_temp_variable = { zin_e_moved = 0 }
${ROADS.map(roadMonth).join('\n')}
${NOR} = { zin_east_refresh_wealth = yes }
${STA} = { zin_east_refresh_wealth = yes }`);

  E_('zin_east_update_bias', `# the eastern pressures toward kneeling (spec section 4); recomputed every month
set_temp_variable = { zin_east_b = 0 }
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
  limit = { ${ge('zin_stabilo_debt', N.bias_debt)} }
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
# a client that delayed the King's host (zin_east.52) leans away for a year
if = {
  limit = { has_country_flag = zin_east_delayed_host }
  add_to_temp_variable = { zin_east_b = -${N.bias_delayed} }
}
set_variable = { zin_east_kneel_bias = zin_east_b }
clamp_variable = { var = zin_east_kneel_bias min = -100 max = 100 }`);

  // ------------------------------------------------------------------------------------------------ the coalition (section 5)
  E_('zin_east_compute_weight', `# the coalition weight of one East Lands country (spec section 5); kept as a country variable for the AI of zin_east.42
set_temp_variable = { zin_e_w = zin_footholds }
multiply_temp_variable = { zin_e_w = ${N.weight_foothold} }
set_temp_variable = { zin_e_states = num_owned_states }
divide_temp_variable = { zin_e_states = 2 }
# rounded down: a half becomes a quarter below, and rounds to the whole below
add_to_temp_variable = { zin_e_states = -0.25 }
round_temp_variable = zin_e_states
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
divide_temp_variable = { zin_e_bias5 = ${N.weight_bias_divisor} }
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
  limit = { has_country_flag = zin_east_route_resist }
  add_to_temp_variable = { zin_e_w = -${N.weight_resist_court} }
}
if = {
  limit = {
    OR = {
      has_country_flag = zin_noris_route_shield
      has_country_flag = zin_stabilo_route_free
    }
  }
  add_to_temp_variable = { zin_e_w = -${N.weight_resist_power} }
}
set_variable = { zin_east_coalition_weight = zin_e_w }`);
  E_('zin_east_join_coalition', `# the join option of zin_east.42
set_country_flag = zin_east_coalition_member
add_ideas = zin_east_coalition_ambition`);
  const leaderPool = `zin_east_in_region = yes\n${ge('num_owned_states', N.leader_states)}\nNOT = { has_country_flag = zin_east_declined_lead }`;
  E_('zin_east_pick_leader', `# the leader: the highest weight among East Lands countries with ${N.leader_states} or more states (ties: most states, then tag)
if = {
  limit = {
    NOT = { has_global_flag = zin_eastern_invasion }
    NOT = { any_country = { has_country_flag = zin_east_coalition_leader } }
  }
${ind(1, best(leaderPool, outranks('zin_east_coalition_weight'), `set_country_flag = zin_east_coalition_leader
if = {
  limit = { is_ai = yes }
  zin_east_join_coalition = yes
}
else = { country_event = { id = zin_east.42 } }`))}
}`);
  E_('zin_east_stay_out', `# the stay-out option of zin_east.42: a leader that declines passes the lead to the next court
if = {
  limit = { has_country_flag = zin_east_coalition_leader }
  clr_country_flag = zin_east_coalition_leader
  clr_country_flag = zin_east_coalition_member
  set_country_flag = zin_east_declined_lead
  remove_ideas = zin_east_coalition_ambition
  zin_east_pick_leader = yes
}`);
  E_('zin_east_form_coalition', `# the coalition gathers (called by the hidden zin_east.41 on the runner): weights, the leader, the asks, the crossing in ${N.cross_days} days
if = {
  limit = { NOT = { has_global_flag = zin_east_coalition_formed } }
  set_global_flag = zin_east_coalition_formed
  every_country = {
    limit = { zin_east_in_region = yes }
    zin_east_compute_weight = yes
  }
  zin_east_pick_leader = yes
  every_country = {
    limit = {
      zin_east_in_region = yes
      NOT = { has_country_flag = zin_east_coalition_leader }
      ${ge('zin_east_coalition_weight', N.weight_ask)}
    }
    country_event = { id = zin_east.42 }
  }
  country_event = { id = zin_east.3 days = ${N.cross_days} }
}`);
  const notMember = 'NOT = { has_country_flag = zin_east_coalition_member }\nNOT = { has_country_flag = zin_east_coalition_leader }';
  E_('zin_east_enforce_coalition', `# historical path: at least ${N.coalition_min_members} AI members besides the leader (the highest weights join)
set_temp_variable = { zin_e_joined = 0 }
every_country = {
  limit = {
    has_country_flag = zin_east_coalition_member
    NOT = { has_country_flag = zin_east_coalition_leader }
  }
  add_to_temp_variable = { zin_e_joined = 1 }
}
${Array.from({ length: N.coalition_min_members }, () => `if = {
  limit = { check_variable = { zin_e_joined < ${num(N.coalition_min_members - 0.01)} } }
${ind(1, best(`zin_east_in_region = yes\nis_ai = yes\n${notMember}`, outranks('zin_east_coalition_weight'), 'zin_east_join_coalition = yes'))}
  add_to_temp_variable = { zin_e_joined = 1 }
}`).join('\n')}`);
  const realmTarget = `zin_elves_is_magical_realm = yes\ncheck_variable = { zin_east_rift_count > 0.99 }\nNOT = { has_country_flag = zin_east_rift_target }`;
  E_('zin_east_cross_rift', `# the crossing of the rift (spec section 5 step 4; the hidden zin_east.3, ${N.cross_days} days after the coalition gathers)
if = {
  limit = {
    NOT = { has_global_flag = zin_eastern_invasion }
    any_country = { has_country_flag = zin_east_coalition_leader }
  }
  if = {
    limit = { zin_rules_is_historical = yes }
    zin_east_enforce_coalition = yes
  }
  random_country = {
    limit = { has_country_flag = zin_east_coalition_leader }
    save_event_target_as = zin_east_leader
  }
  set_global_flag = zin_eastern_invasion
  set_global_flag = { flag = zin_east_invasion_young days = ${N.west_wait_days} }
  every_country = {
    limit = { zin_elves_is_magical_realm = yes }
    set_variable = { zin_east_rift_count = 0 }
    every_owned_state = {
      limit = { zin_is_site_rift_west = yes }
      add_to_variable = { PREV.zin_east_rift_count = 1 }
    }
  }
  # up to ${N.rift_targets} realms that own rift-coast states, those with the most first (ties: tag); the war takes the claimed coast
${Array.from({ length: N.rift_targets }, () => ind(1, best(realmTarget, outranks('zin_east_rift_count', { states: false }), `set_country_flag = zin_east_rift_target
save_event_target_as = zin_east_rift_foe
every_owned_state = {
  limit = { zin_is_site_rift_west = yes }
  add_claim_by = event_target:zin_east_leader
}
event_target:zin_east_leader = {
  set_country_flag = { flag = zin_story_war days = 1 }
  if = {
    limit = { NOT = { has_war_with = event_target:zin_east_rift_foe } }
    declare_war_on = { target = event_target:zin_east_rift_foe type = take_claimed_state }
  }
}
every_country = {
  limit = {
    has_country_flag = zin_east_coalition_member
    NOT = { has_country_flag = zin_east_coalition_leader }
    NOT = { has_war_with = event_target:zin_east_rift_foe }
  }
  add_to_war = { targeted_alliance = event_target:zin_east_leader enemy = event_target:zin_east_rift_foe hostility_reason = asked_to_join single_target_only = yes }
}`))).join('\n')}
  # members with three footholds or more gain the eastern ambition against the realms and Aenor
  every_country = {
    limit = {
      has_country_flag = zin_east_coalition_member
      ${ge('zin_footholds', N.cb_footholds)}
    }
    every_country = {
      limit = { zin_elves_is_magical_realm = yes }
      PREV = { add_dynamic_modifier = { modifier = zin_cb_eastern_ambition scope = PREV days = ${N.cb_days} } }
    }
    add_dynamic_modifier = { modifier = zin_cb_eastern_ambition scope = ${AEN} days = ${N.cb_days} }
  }
  zin_elves_on_eastern_invasion = yes
  ${everyNews('zin_east.43')}
}`);
  E_('zin_east_turn_west', `# the host turns west (spec section 5 step 5): the leader declares on Aenor, whoever rules it, and the members join
if = {
  limit = {
    NOT = { has_global_flag = zin_east_turns_west }
    any_country = { has_country_flag = zin_east_coalition_leader }
  }
  set_global_flag = zin_east_turns_west
  if = {
    limit = { country_exists = ${AEN} }
    random_country = {
      limit = { has_country_flag = zin_east_coalition_leader }
      set_country_flag = { flag = zin_story_war days = 1 }
      if = {
        limit = { NOT = { has_war_with = ${AEN} } }
        declare_war_on = { target = ${AEN} type = annex_everything }
      }
      save_event_target_as = zin_east_leader
    }
    every_country = {
      limit = {
        has_country_flag = zin_east_coalition_member
        NOT = { has_country_flag = zin_east_coalition_leader }
        NOT = { has_war_with = ${AEN} }
      }
      add_to_war = { targeted_alliance = event_target:zin_east_leader enemy = ${AEN} hostility_reason = asked_to_join single_target_only = yes }
    }
  }
  ${everyNews('zin_east.44')}
}`);
  E_('zin_east_make_coalition_peace', `# the make-peace option of zin_east.45: white peace with every enemy in the Magical and Middle Lands
every_country = {
  limit = {
    has_war_with = PREV
    zin_east_has_capital = yes
    capital_scope = {
      OR = {
        zin_is_region_magical_lands = yes
        zin_is_region_middle_lands = yes
      }
    }
  }
  PREV = { white_peace = PREV }
}
remove_ideas = zin_east_coalition_ambition
set_country_flag = zin_east_coalition_peace`);
  E_('zin_east_offer_coalition_peace', `# zin_east.45 to every coalition member at once, whatever the King of the East (the trees' Break the Coalition)
every_country = {
  limit = { has_country_flag = zin_east_coalition_member }
  set_country_flag = zin_east_peace_asked
  country_event = { id = zin_east.45 }
}`);
  E_('zin_east_claim_rift', `# claims on every rift-coast state of the Magical Lands that the coalition holds (the trees' spoils focuses)
if = {
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
  E_('zin_east_serve_stranger', `# the serve option of zin_east.46
set_country_flag = zin_east_companies_with_eindil
army_experience = ${N.stranded_xp}`);
  E_('zin_east_order_home', `# the home option of zin_east.46
add_manpower = ${N.stranded_manpower}`);

  // ------------------------------------------------------------------------------------------------ roads, claims, causes
  E_('zin_east_claim_road', `# claims on the road states the rival and its faction own (zin_arg_road: salt 1, gold 2, rift 3, lake 4, sand 5); only with a peace gate open
if = {
  limit = { zin_east_claims_open = yes }
${ind(1, roadSwitch(r => powers.map(p => {
    const rival = powers.find(x => x !== p).tag;
    return `if = {\n  limit = { original_tag = ${p.tag} }\n  every_state = {\n    limit = {\n      zin_is_site_road_${r.key} = yes\n      owner = {\n        OR = {\n          original_tag = ${rival}\n          is_in_faction_with = ${rival}\n        }\n      }\n    }\n    add_claim_by = PREV\n  }\n}`;
  }).join('\n')))}
}`);
  E_('zin_east_grant_free_cb', `# the cause against the Dominion of the East and every client, while the King of the East reigns
if = {
  limit = { zin_east_free_crown = yes }
  if = {
    limit = {
      country_exists = ${WOR}
      NOT = { has_dynamic_modifier = { modifier = zin_cb_free_east scope = ${WOR} } }
    }
    add_dynamic_modifier = { modifier = zin_cb_free_east scope = ${WOR} days = ${N.free_cb_days} }
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
  E_('zin_east_grant_high_king_cb', `# the unification route's cause (spec section 7): courts leaning to the rival and courts that knelt
if = {
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
          check_variable = { zin_east_lean < 0 }
        }
        AND = {
          PREV = { original_tag = ${STA} }
          check_variable = { zin_east_lean > 0 }
        }
      }
    }
    PREV = { add_dynamic_modifier = { modifier = zin_cb_high_king scope = PREV days = ${N.high_king_days} } }
  }
}`);
  E_('zin_east_declare_united', `# the East united (spec section 7); an outcome of the game, never history. World systems read zin_east_united.
if = {
  limit = {
    ${ge('zin_east_dominance', N.united_dominance)}
    NOT = { has_country_flag = zin_afrit_eastern_client }
    NOT = { has_global_flag = zin_east_united }
  }
  set_global_flag = zin_east_united
  add_ideas = zin_east_united_crown
  ${everyNews('zin_east.80')}
}`);

  // ------------------------------------------------------------------------------------------------ the King of the East (section 6)
  const ideologies = [['democratic', 0], ['fascism', 1], ['communism', 2], ['neutrality', 3]];
  E_('zin_east_prepare_kneel', `# before kneeling (called by the kneel of zin_afrit.51): the ruling ideology and the elections are kept to restore them when the King falls
${ideologies.map(([g, c], i) => `${i === 0 ? 'if' : i === ideologies.length - 1 ? 'else' : 'else_if'} = {\n${i === ideologies.length - 1 ? '' : `  limit = { has_government = ${g} }\n`}  set_variable = { zin_east_old_ideology = ${c} }\n}`).join('\n')}
if = {
  limit = { has_elections = yes }
  set_country_flag = zin_east_had_elections
}
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
  E_('zin_east_restore_ideology', `# the government returns to the ideology it had before kneeling, with the elections it had
if = {
  limit = { has_variable = zin_east_old_ideology }
${ind(1, ideologies.map(([g, c], i) => `${i ? 'else_if' : 'if'} = {
  limit = {
    check_variable = { zin_east_old_ideology = ${c} }
    NOT = { has_government = ${g} }
  }
  if = {
    limit = { has_country_flag = zin_east_had_elections }
    set_politics = { ruling_party = ${g} elections_allowed = yes }
  }
  else = { set_politics = { ruling_party = ${g} elections_allowed = no } }
}`).join('\n'))}
}`);
  E_('zin_east_refuse_king', '# the refuse option of zin_east.50 (and of zin_afrit.51)\nset_country_flag = zin_afrit_refused_east');
  E_('zin_east_gifts_to_king', `# the gifts option of zin_east.50: no subject relation, only the King's goodwill
${WOR} = { add_opinion_modifier = { target = PREV modifier = zin_east_gifts_to_king } }`);
  const refusePool = `zin_east_is_court = yes\nis_ai = yes\nNOT = { has_country_flag = zin_afrit_refused_east }\nNOT = { has_country_flag = zin_afrit_eastern_client }`;
  E_('zin_east_enforce_refusers', `# historical path: at least ${N.refusers_min} East Lands countries refuse (the AI courts with the lowest bias first; ties: most states, then tag)
if = {
  limit = { zin_rules_is_historical = yes }
  set_temp_variable = { zin_e_refusers = 0 }
  every_country = {
    limit = {
      zin_east_in_region = yes
      has_country_flag = zin_afrit_refused_east
    }
    add_to_temp_variable = { zin_e_refusers = 1 }
  }
${Array.from({ length: N.refusers_min }, () => ind(1, `if = {
  limit = { check_variable = { zin_e_refusers < ${num(N.refusers_min - 0.01)} } }
${ind(1, best(refusePool, outranks('zin_east_kneel_bias', { low: true }), 'zin_east_refuse_king = yes'))}
  add_to_temp_variable = { zin_e_refusers = 1 }
}`)).join('\n')}
}`);
  E_('zin_east_name_first_crown', `# the First of the Free Crowns, when no tree's resist focus has named one: the refuser with most states that leads a faction, else the refuser with most states
if = {
  limit = { NOT = { any_country = { has_country_flag = zin_east_free_crowns_leader } } }
  if = {
    limit = {
      any_country = {
        zin_east_free_crown = yes
        is_faction_leader = yes
      }
    }
${ind(2, best('zin_east_free_crown = yes\nis_faction_leader = yes', outranks('num_owned_states', { states: false }), 'set_country_flag = zin_east_free_crowns_leader\ncountry_event = { id = zin_east.51 }'))}
  }
  else = {
${ind(2, best('zin_east_free_crown = yes', outranks('num_owned_states', { states: false }), 'set_country_flag = zin_east_free_crowns_leader\ncountry_event = { id = zin_east.51 }'))}
  }
}`);
  E_('zin_east_king_notice', `# zin_east.50 to every East Lands court that the Deliverer did not ask (the hidden zin_east.5, ${N.king_notice_days} days after the proclamation)
every_country = {
  limit = {
    zin_east_is_court = yes
    NOT = { has_country_flag = zin_afrit_eastern_client }
    NOT = { has_country_flag = zin_afrit_refused_east }
    NOT = { zin_afrit_eastern_candidate = yes }
  }
  country_event = { id = zin_east.50 }
}`);
  E_('zin_east_send_levies', `# the levies option of zin_east.52
add_manpower = -${N.levies_manpower}
set_country_flag = zin_east_sent_levies`);
  E_('zin_east_send_gold', `# the gold option of zin_east.52
add_political_power = -${N.gold_pp}
${WOR} = { add_political_power = ${N.gold_pp} }`);
  E_('zin_east_delay_host', `# the delay option of zin_east.52: the bias falls for a year, and the Dominion remembers
set_country_flag = { flag = zin_east_delayed_host days = ${N.delay_days} }
${WOR} = { add_opinion_modifier = { target = PREV modifier = zin_east_host_delayed } }`);
  E_('zin_east_after_the_king', `# the East after the King (spec section 6), once: clients released and indebted, refusers vindicated, the Free Crowns' cause ends, the old quarrels return
if = {
  limit = { NOT = { has_global_flag = zin_east_after_king_done } }
  set_global_flag = zin_east_after_king_done
  every_country = {
    limit = { has_country_flag = zin_afrit_refused_east }
    remove_dynamic_modifier = { modifier = zin_cb_free_east scope = ${WOR} }
    every_country = {
      limit = { has_country_flag = zin_afrit_eastern_client }
      PREV = { remove_dynamic_modifier = { modifier = zin_cb_free_east scope = PREV } }
    }
    remove_ideas = zin_east_free_crowns
    add_timed_idea = { idea = zin_east_vindicated days = ${N.after_days} }
  }
  every_country = {
    limit = { has_country_flag = zin_afrit_eastern_client }
    if = {
      limit = { is_subject_of = ${WOR} }
      ${WOR} = { end_puppet = PREV }
    }
    add_timed_idea = { idea = zin_east_kings_debt days = ${N.after_days} }
    zin_east_restore_ideology = yes
  }
  if = {
    limit = { check_variable = { global.zin_east_rivalry < ${N.after_rivalry} } }
    set_variable = { global.zin_east_rivalry = ${N.after_rivalry} }
  }
  every_country = {
    limit = { zin_east_in_region = yes }
    country_event = { id = zin_east.60 }
  }
}`);

  // ------------------------------------------------------------------------------------------------ the desert (section 8)
  E_('zin_east_dig_wells_in', `# wells in this state: the flag, wells instead of dry land, and a road
set_state_flag = zin_east_wells
if = {
  limit = { has_dynamic_modifier = zin_east_dry_land }
  remove_dynamic_modifier = { modifier = zin_east_dry_land }
}
add_dynamic_modifier = { modifier = zin_east_wells }
add_building_construction = { type = infrastructure level = ${N.wells_infrastructure} instant_build = yes }`);
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
    ${NOR} = { ${ge(inf(r), N.contested_influence)} }
    ${STA} = { ${ge(inf(r), N.contested_influence)} }
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
# drift toward ${N.rivalry_rest}
if = {
  limit = { ${ge('global.zin_east_rivalry', N.rivalry_rest + N.rivalry_drift)} }
${ind(1, call('zin_east_add_rivalry', { value: -N.rivalry_drift }))}
}
else_if = {
  limit = { check_variable = { global.zin_east_rivalry < ${num(N.rivalry_rest - N.rivalry_drift + 0.01)} } }
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
}`);
  E_('zin_east_free_crowns_month', `# the Free Crowns while the King of the East reigns: the spirit, the cause, kinship among refusers, scorn for clients
if = {
  limit = {
    has_global_flag = zin_afrit_king_of_east
    NOT = { has_global_flag = zin_afrit_dead }
  }
  # new clients first, so that a refuser and a client of the same month are counted once
  every_country = {
    limit = {
      has_country_flag = zin_afrit_eastern_client
      NOT = { has_country_flag = zin_east_client_set }
    }
    set_country_flag = zin_east_client_set
    every_country = {
      limit = { has_country_flag = zin_east_free_crown_set }
      add_opinion_modifier = { target = PREV modifier = zin_east_knelt }
    }
  }
  every_country = {
    limit = { zin_east_free_crown = yes }
    zin_east_grant_free_cb = yes
    if = {
      limit = { NOT = { has_country_flag = zin_east_free_crown_set } }
      set_country_flag = zin_east_free_crown_set
      add_ideas = zin_east_free_crowns
      every_other_country = {
        limit = { has_country_flag = zin_east_free_crown_set }
        add_opinion_modifier = { target = PREV modifier = zin_east_free_crown_kin }
        PREV = { add_opinion_modifier = { target = PREV modifier = zin_east_free_crown_kin } }
      }
      every_country = {
        limit = { has_country_flag = zin_afrit_eastern_client }
        PREV = { add_opinion_modifier = { target = PREV modifier = zin_east_knelt } }
      }
    }
  }
}`);
  E_('zin_east_story_month', `# the story beats of sections 5 and 6, each once, read from the story flags (runner scope)
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
      ${ge('zin_footholds', N.rift_talk_footholds)}
      NOT = { has_country_flag = zin_east_rift_talk }
    }
    set_country_flag = zin_east_rift_talk
    country_event = { id = zin_east.40 }
  }
}
# the coalition gathers ${N.gather_days} days after the war begins; outside the historical path also when the dark has gathered
if = {
  limit = {
    NOT = { has_global_flag = zin_east_gather_sent }
    OR = {
      has_global_flag = zin_war_of_last_crowns
      AND = {
        zin_rules_is_historical = no
        ${ge('global.zin_gathering_dark', N.early_dark)}
        zin_east_after_early_coalition = yes
      }
    }
  }
  set_global_flag = zin_east_gather_sent
  if = {
    limit = { has_global_flag = zin_war_of_last_crowns }
    country_event = { id = zin_east.41 days = ${N.gather_days} }
  }
  else = { country_event = { id = zin_east.41 } }
}
# the host turns west ${N.west_wait_days} days after the crossing if the coalition holds ${N.west_states} Magical Lands states, or at the shifted date on the historical path
if = {
  limit = {
    has_global_flag = zin_eastern_invasion
    NOT = { has_global_flag = zin_east_turns_west }
  }
  set_temp_variable = { zin_e_held = 0 }
  every_state = {
    limit = {
      zin_is_region_magical_lands = yes
      controller = { has_country_flag = zin_east_coalition_member }
    }
    add_to_temp_variable = { zin_e_held = 1 }
  }
  if = {
    limit = {
      OR = {
        AND = {
          NOT = { has_global_flag = zin_east_invasion_young }
          ${ge('zin_e_held', N.west_states)}
        }
        AND = {
          zin_rules_is_historical = yes
          zin_east_after_turn_west = yes
        }
      }
    }
    zin_east_turn_west = yes
  }
}
# the King of the East: the courts not asked hear of him in ${N.king_notice_days} days; the refusers' floor and the First of the Free Crowns in ${N.king_first_days}
if = {
  limit = {
    has_global_flag = zin_afrit_king_of_east
    NOT = { has_global_flag = zin_east_king_seen }
  }
  set_global_flag = zin_east_king_seen
  country_event = { id = zin_east.5 days = ${N.king_notice_days} }
  country_event = { id = zin_east.6 days = ${N.king_first_days} }
}
# the coalition breaks: every member that refused the King chooses peace or war
if = {
  limit = {
    has_global_flag = zin_afrit_king_of_east
    NOT = { has_global_flag = zin_afrit_dead }
  }
  every_country = {
    limit = {
      has_country_flag = zin_east_coalition_member
      has_country_flag = zin_afrit_refused_east
      NOT = { has_country_flag = zin_east_peace_asked }
    }
    set_country_flag = zin_east_peace_asked
    country_event = { id = zin_east.45 }
  }
}
# abandoned companies, when the stranger returns
if = {
  limit = {
    has_global_flag = zin_eindil_returned
    NOT = { has_global_flag = zin_east_stranded_asked }
  }
  set_global_flag = zin_east_stranded_asked
  every_country = {
    limit = {
      zin_east_in_region = yes
      zin_east_at_war_in_the_west = yes
    }
    country_event = { id = zin_east.46 }
  }
}
# the King calls his host
if = {
  limit = {
    has_global_flag = zin_afrit_returned
    NOT = { has_global_flag = zin_east_host_called }
  }
  set_global_flag = zin_east_host_called
  every_country = {
    limit = { has_country_flag = zin_afrit_eastern_client }
    if = {
      limit = { has_country_flag = zin_noris_riders_for_host }
      set_country_flag = zin_east_sent_levies
    }
    country_event = { id = zin_east.52 }
  }
}
# after the King
if = {
  limit = { has_global_flag = zin_afrit_dead }
  zin_east_after_the_king = yes
}`);
  E_('zin_east_monthly', `# the caravan month: roads, rivalry, the courts, the story beats, the trees' own monthly work, then the focus layouts (E4)
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
zin_east_story_month = yes
# the trees' monthly work (declared by the Noris and Stabilo trees)
if = {
  limit = { country_exists = ${NOR} }
  ${NOR} = { zin_noris_monthly = yes }
}
if = {
  limit = { country_exists = ${STA} }
  ${STA} = { zin_stabilo_monthly = yes }
}
every_country = {
  limit = { zin_east_in_region = yes }
  mark_focus_tree_layout_dirty = yes
}`);
  E_('zin_east_pick_runner', `# the runner of the caravan month: Noris; Stabilo if Noris is gone; else the East Lands country with the most states
if = {
  limit = { country_exists = ${NOR} }
  ${NOR} = { save_global_event_target_as = zin_east_runner }
}
else_if = {
  limit = { country_exists = ${STA} }
  ${STA} = { save_global_event_target_as = zin_east_runner }
}
else = {
${ind(1, best('zin_east_in_region = yes', outranks('num_owned_states', { states: false }), 'save_global_event_target_as = zin_east_runner'))}
}`);
  E_('zin_east_schedule_month', `# the chain of zin_east.2: the runner is picked anew and the next month is scheduled there, so the chain survives the runner's end
zin_east_pick_runner = yes
if = {
  limit = { has_event_target = zin_east_runner }
  event_target:zin_east_runner = { country_event = { id = zin_east.2 days = ${N.month_days} } }
}`);
  E_('zin_east_on_declare_war', `# ROOT declares on FROM: a war between Noris and Stabilo ends the Concord and opens the Caravan War
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
  if = {
    limit = { NOT = { has_global_flag = zin_east_caravan_war } }
    set_global_flag = zin_east_caravan_war
    ${NOR} = { add_ideas = zin_east_caravan_war_strain }
    ${STA} = { add_ideas = zin_east_caravan_war_strain }
    every_country = {
      limit = { zin_east_in_region = yes }
      news_event = { id = zin_east.25 }
    }
  }
}`);
  E_('zin_east_on_peace', `if = {
  limit = {
    has_idea = zin_east_coalition_ambition
    NOT = {
      any_enemy_country = { zin_elves_is_magical_realm = yes }
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
  E_('zin_east_sign_concord', `# the Concord of the Roads (spec section 2): charters freeze, every road half held, the rivalry capped for ${N.concord_cap_days} days
set_global_flag = zin_east_roads_concord
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
  E_('zin_east_make_report', `# the numbers of the hub's report (zin_east.31): the weight of every East Lands country, and three counts
set_variable = { global.zin_east_rep_footholds = 0 }
set_variable = { global.zin_east_rep_pledged = 0 }
set_variable = { global.zin_east_rep_ready = 0 }
every_country = {
  limit = { zin_east_in_region = yes }
  zin_east_compute_weight = yes
  if = {
    limit = { ${ge('zin_footholds', N.rift_talk_footholds)} }
    add_to_variable = { global.zin_east_rep_footholds = 1 }
  }
  if = {
    limit = { ${ge('zin_east_coalition_weight', N.weight_ask)} }
    add_to_variable = { global.zin_east_rep_ready = 1 }
  }
  if = {
    limit = { has_country_flag = zin_east_pledged }
    add_to_variable = { global.zin_east_rep_pledged = 1 }
  }
}`);

  // ------------------------------------------------------------------------------------------------ the startup
  const befriend = (list, value) => list.map(n => `    add_ai_strategy = { type = befriend id = "${tag(n)}" value = ${value} }`);
  E_('zin_east_startup', `# the roads open (zin_east.1, one day after the start, so that every startup of the other systems has run)
if = {
  limit = { NOT = { has_global_flag = zin_east_started } }
  set_global_flag = zin_east_started
  set_variable = { global.zin_east_rivalry = ${N.rivalry_start} }
  # the frozen East Lands state count of the dominance (the roster holds ${statesTotal})
  set_variable = { global.zin_east_states_total = 0 }
  every_state = {
    limit = { zin_is_region_east_lands = yes }
    add_to_variable = { global.zin_east_states_total = 1 }
  }
  if = {
    limit = { check_variable = { global.zin_east_states_total < 1 } }
    set_variable = { global.zin_east_states_total = ${statesTotal} }
  }
  set_variable = { global.zin_east_rule_roll = 0 }
  set_variable = { global.zin_east_wells_turn = 1 }
  set_variable = { global.zin_east_last_road = 0 }
  set_variable = { global.zin_east_last_winner = 0 }
  set_variable = { global.zin_east_talks_result = 0 }
  set_variable = { global.zin_east_invite_result = 0 }
  if = {
    limit = { zin_rules_ai_random_east = yes }
    random_list = {
${N.rule_roll.map((w, i) => `      ${w} = { set_variable = { global.zin_east_rule_roll = ${i} } }`).join('\n')}
    }
  }
  # the tag order of the spec's tie-breaks
${ranked.map((t, i) => `  ${t} = { set_variable = { zin_east_rank = ${ranked.length - i} } }`).join('\n')}
${ROADS.map(r => `  set_variable = { global.zin_east_road_${r.key} = ${N.roads[r.key].charter} }
  set_variable = { global.zin_east_roadn_${r.key} = 0 }
  every_state = {
    limit = { zin_is_site_road_${r.key} = yes }
    add_to_variable = { global.zin_east_roadn_${r.key} = 1 }
  }`).join('\n')}
${powers.map((p, i) => `  ${p.tag} = {
    save_global_event_target_as = zin_east_${p.name}
${ROADS.map(r => `    set_variable = { ${inf(r)} = ${N.roads[r.key][p.name]} }`).join('\n')}
    set_variable = { zin_east_caravan_bonus = 0 }
    zin_east_refresh_wealth = yes
    add_dynamic_modifier = { modifier = zin_east_caravan_wealth }
    zin_east_update_dominance = yes
    add_ai_strategy = { type = antagonize id = "${powers[1 - i].tag}" value = ${N.ai_antagonize} }
${[...befriend(i === 0 ? R.befriendNoris : R.befriendStabilo, N.ai_befriend), ...befriend(R.befriendBoth, N.ai_befriend_great)].join('\n')}
  }`).join('\n')}
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
    limit = {
      zin_is_region_south_lands = yes
      NOT = { has_state_flag = zin_east_wells }
    }
    add_dynamic_modifier = { modifier = zin_east_dry_land }
  }
  zin_east_schedule_month = yes
}`);

  const ctxx = { found, others, east, realms, statesTotal, N, R, T, tags, put, defs, E_, ROADS, roadSwitch, inf, tag, powers, ge, report: data.report };
  const content = await buildEastContent({ ...ctxx, countries: ctx.countries });
  put('common/scripted_effects/zin_east.txt', `${HEADER('mech_east', EAST_SPEC)}\n# Integration note: ${EAST_NOTE}.\n# Scripted effects take no parameters in 1.19.3 (decision E1): a call sets zin_arg_<name> temporary variables first.\n# road: salt 1, gold 2, rift 3, lake 4, sand 5.\n\n${eff.join('\n\n')}`);
  const unused = T.unused();
  if (unused.length) throw new Error(`mech_east: the data file holds text nothing uses: ${unused.join(', ')}`);
  const entries = T.entries();
  await assertCleanText('mech_east', entries);
  for (const [rel, text] of files) staged.text(rel, text);
  staged.loc('zin_east', entries);
  return {
    files: [...files.keys(), 'localisation/english/zin_east_l_english.yml'].sort(), text: entries, definitions: defs, dependencies: EAST_DEPENDENCIES, externalEvents: eastExternals('events'),
    counts: { effects: defs.effects.length, triggers: defs.triggers.length, events: defs.events.length, decisions: defs.decisions.length, categories: defs.categories.length, ideas: defs.ideas.length, opinions: defs.opinions.length, dynamicModifiers: defs.dynamicModifiers.length, aiStrategies: defs.aiStrategies.length, scriptedLocs: defs.scriptedLocs.length, textKeys: Object.keys(entries).length },
    tags, content, statesTotal, siteRows,
  };
}
