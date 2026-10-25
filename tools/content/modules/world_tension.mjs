// World tension and endings (docs/specs/03_gameplay/05_world_tension_and_endings.md; docs/design/alternate_history.md sections 5 and 10).
//   await buildWorldTension(staged, { countries })   after the mechanic slices, the rules, the world and crown events (whose names it calls)
//                                                    and before the historical path module, whose zin_path_tick it calls by name.
// Writes the Gathering Dark (zin_gathering_dark), the War of the Last Crowns (zin_world.20 sets zin_war_of_last_crowns), the endings
// (zin_world_check_endings, zin_world_reach_ending, the ending spirits) and the one world tick of ZIN:
//   common/script_constants/zin_world.txt            every tuning value (data/world_tension.json)
//   common/scripted_triggers/zin_world_tension.txt   tiers, the peace, the great war, the dark war, the ending conditions
//   common/scripted_triggers/zin_world_dates.txt     the dated triggers, one branch per story pace (lib/story_dates.mjs)
//   common/scripted_effects/zin_world_tension.txt    zin_world_add_gathering_dark, the tick and its steps, the war, the endings
//   common/ideas/zin_world_endings.txt               the ending spirits (given by the ending news events of the crown events module)
//   common/on_actions/zin_world.txt                  on_startup (meter, rate, the first tick, the start check) and on_annex (the tick's runner)
//   common/scripted_localisation/zin_world_tension.txt  the tier name and the secret-aware source labels
//   events/zin_world.txt                             namespace zin_world, ids 1 to 29 (30 to 69 belong to the magic module, 100 to 119 to the
//                                                    crown events module's events/zin_world_endings.txt)
//   localisation/english/zin_world_tension_l_english.yml
// The world tick is one self-scheduling hidden event (zin_world.1) on one runner country, never an every-country on_monthly: the runner is
// picked anew each month from data/world_tension.json "runners", and an annexed runner hands the chain to its annexer (on_annex).
// Monthly order (spec, "The world tick"): (1) world casualties, (2) one-time values, (3) monthly sources, (4) the engine sync, (5) the War of
// the Last Crowns, (6) tier news (inside zin_world_add_gathering_dark), (7) the endings, (8) zin_path_tick, (9) zin_story_tick, (10) the
// interface refresh for human players, written only for the effects another module has staged (zin_ui_refresh, zin_chr_count_unread).
import { readFile } from 'node:fs/promises';
import { assertModifiers } from '../lib/core.mjs';
import { parse, scriptText } from '../lib/clausewitz.mjs';
import { Loc, hdr, format, blk, list, num, writeEvent, secrecyLeaks, wordProblems, notCp1252 } from '../lib/mech_court_lib.mjs';
import { dateTrigger } from '../lib/story_dates.mjs';

const SPEC = 'docs/specs/03_gameplay/05_world_tension_and_endings.md';
const MOD = 'world_tension';
export const WORLD_DATA = new URL('../data/world_tension.json', import.meta.url);
export const loadWorldData = async () => JSON.parse(await readFile(WORLD_DATA, 'utf8'));

const gte = (v, n) => `check_variable = { var = ${v} value = ${num(n)} compare = greater_than_or_equals }`;
const gflag = f => `has_global_flag = ${f}`;
const notGflag = f => `NOT = { has_global_flag = ${f} }`;
// A major news event reaches every country from one firing (MCP script_validate: SCRIPT_EVENT_POPUP_REPEATED), so it is fired once, from any country.
const add = value => `set_temp_variable = { zin_arg_value = ${value} }\nzin_world_add_gathering_dark = yes`;
const evNum = id => Number(id.split('.')[1]);

// Names this module calls that other modules define (checked against the staged tree before writing).
export const CALLS = {
  effects: ['zin_afrit_reveal', 'zin_ending_start_epilogue', 'zin_story_tick', 'zin_path_tick'],
  triggers: ['zin_aenor_is_realm', 'zin_afrit_ashen_throne_ready', 'zin_volgan_children_ready', 'zin_diplo_is_dark_power', 'zin_is_volgan', 'zin_is_zol', 'zin_is_lerendor',
    'zin_leren_holds_strait', 'zin_rules_is_historical', 'zin_rules_is_free', 'zin_is_site_parim', 'zin_west_is_leader'],
};
// Step 10 of the tick: called for human players only when a module has staged the effect.
const UI_STEP = ['zin_ui_refresh', 'zin_chr_count_unread'];

function stagedDefinitions(staged) {
  const out = { effects: new Set(), triggers: new Set() };
  for (const [rel, bytes] of staged.files) {
    const kind = rel.startsWith('common/scripted_effects/') ? 'effects' : rel.startsWith('common/scripted_triggers/') ? 'triggers' : null;
    if (!kind || !rel.endsWith('.txt')) continue;
    for (const e of parse(scriptText(bytes))) if (e.k && Array.isArray(e.v)) out[kind].add(e.k);
  }
  return out;
}

export function worldScripts(D, T) {
  const S = D.sources, E = D.engine;
  const triggers = new Map(), effects = new Map();
  const parim = `OR = {\nzin_is_site_parim = yes\nstate = ${T.parimState}\n}`;

  // ------------------------------------------------------------------------------------------- triggers
  D.tiers.forEach((t, i) => {
    const next = D.tiers[i + 1];
    triggers.set(`zin_world_gd_tier_${t.n}`, list(`# ${t.name}: the Gathering Dark from ${t.from}${next ? ` to below ${next.from}` : ''}.`,
      t.from > 0 ? gte('global.zin_gathering_dark', t.from) : '', next ? `check_variable = { global.zin_gathering_dark < ${next.from} }` : ''));
  });
  triggers.set('zin_world_great_war_exists', '# A war with a major on each side.\nany_country = {\nis_major = yes\nhas_war = yes\nany_enemy_country = { is_major = yes }\n}');
  triggers.set('zin_world_peace_holds', `# The Long Peace: the meter below ${D.tiers[1].from} and no war with a major on each side.\ncheck_variable = { global.zin_gathering_dark < ${D.tiers[1].from} }\nNOT = { zin_world_great_war_exists = yes }`);
  // Q-80 (K59): a front of the great war that a player's realm opened: the front's flag is set and its owner is a human realm.
  triggers.set('zin_world_player_front_open', `# Q-80: under HISTORICAL a player's own front opens the War of the Last Crowns early (the owners of data/world_tension.json war.playerFronts).\nOR = {\n${D.war.playerFronts.map(p => `AND = {\n${gflag(p.flag)}\nany_country = {\nis_ai = no\n${p.opener}\n}\n}`).join('\n')}\n}`);
  triggers.set('zin_world_dark_war', '# A dark power at war with a major that is not a dark power (the PLAUSIBLE and FREE start of the War of the Last Crowns).\nany_country = {\nzin_diplo_is_dark_power = yes\nany_enemy_country = {\nis_major = yes\nNOT = { zin_diplo_is_dark_power = yes }\n}\n}');
  const [lo, hi] = D.judgement.reachStages;
  triggers.set('zin_world_canon_in_reach', `# E-01: a canon ending is in reach while the heir is at stage ${lo} to ${hi}, not lost and not yet crowned, and Afrit lives or the palace is pending.\n${gte('global.zin_eindil_stage', lo)}\ncheck_variable = { global.zin_eindil_stage < ${hi + 1} }\n${notGflag('zin_eindil_lost')}\n${notGflag('zin_eindil_crowned')}\nOR = {\n${notGflag('zin_afrit_dead')}\ncheck_variable = { global.zin_path_cp25 = 0 }\n}`);
  triggers.set('zin_world_judgement_open', `# The proposed outcomes are judged on the judgement date when the age has left history enough (zin_path_departure ${D.judgement.departure} or more) or no canon ending\n# is in reach; otherwise once, on the deferred date (E-01, SL-26).\nOR = {\nAND = {\nzin_world_date_judgement = yes\nOR = {\n${gte('global.zin_path_departure', D.judgement.departure)}\nNOT = { zin_world_canon_in_reach = yes }\n}\n}\nzin_world_date_judgement_deferred = yes\n}`);
  // The four proposed outcomes (spec, "Proposed outcomes"; alternate_history.md section 10 and E-04).
  triggers.set('zin_world_golden_court_holds', `# Outcome 4 (SL-25, E-04): an Aenor realm controls Parim, and the Golden King rules it or the Regency of Gold does. A King who went into exile\n# when his realm fell (zin_golden_king_exiled) rules no court. A King who died of old age after surviving the Council\n# (zin_golden_king_old_age, K59, Q-86) is dead like any other: the outcome then holds only through the Regency of Gold (owner, 25 October 2026).\n${notGflag('zin_golden_king_exiled')}\nany_state = {\n${parim}\ncontroller = { zin_aenor_is_realm = yes }\n}\nOR = {\n${notGflag('zin_golden_king_dead')}\n${gflag('zin_aenor_regency_endures')}\n}`);
  triggers.set('zin_world_western_crown_holds', `# Outcome 5 (SL-19): the Western Crossing's zin_west_holds_parim; or, while the key-sites table is pending (its zin_is_site_parim is an inert\n# stand-in), a West Lands realm controls Aenor's capital state and has claimed its throne, or no Aenor realm is left to claim it back.\nOR = {\nzin_west_holds_parim = yes\nAND = {\nany_state = {\n${parim}\ncontroller = { has_country_flag = zin_region_west_lands }\n}\nOR = {\n${gflag('zin_west_throne_claimed')}\nNOT = { any_country = { zin_aenor_is_realm = yes } }\n}\n}\n}`);
  triggers.set('zin_world_strait_master_holds', `# Outcome 6: Lerendor sought the strait for itself and holds both its shores.\n${gflag('zin_leren_strait_supremacy')}\nany_country = {\nzin_is_lerendor = yes\nzin_leren_holds_strait = yes\n}`);
  triggers.set('zin_world_eastern_king_holds', `# Outcome 7: the East is united, and the false god is dead or was never its king.\n${gflag('zin_east_united')}\nOR = {\n${gflag('zin_afrit_dead')}\n${notGflag('zin_afrit_king_of_east')}\n}`);

  // ------------------------------------------------------------------------------------------- effects
  const damp = D.damping.slice().sort((a, b) => b.from - a.from);
  effects.set('zin_world_add_gathering_dark', `# Argument zin_arg_value (E1): the change. Gains are scaled by zin_gathering_dark_rate and damped from ${damp.map(d => d.from).join(' and ')}; losses are not.
# Clamps to 0 to 100, stores the change in zin_gd_last_change and adds it to the month's total, and fires each tier's news on first entry.
set_temp_variable = { zin_gd_v = zin_arg_value }
clear_variable = zin_arg_value
if = {
limit = { check_variable = { zin_gd_v > 0 } }
if = {
limit = { check_variable = { global.zin_gathering_dark_rate > 0 } }
multiply_temp_variable = { zin_gd_v = global.zin_gathering_dark_rate }
}
${damp.map((d, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { ${gte('global.zin_gathering_dark', d.from)} }\nmultiply_temp_variable = { zin_gd_v = constant:zin_world.damp_${d.from} }\n}`).join('\n')}
}
set_variable = { global.zin_gd_last_change = zin_gd_v }
add_to_variable = { global.zin_gd_month_change = zin_gd_v }
add_to_variable = { global.zin_gathering_dark = zin_gd_v }
clamp_variable = { var = global.zin_gathering_dark min = 0 max = 100 }
${D.tiers.filter(t => t.news).map(t => `if = {\nlimit = {\n${gte('global.zin_gathering_dark', t.from)}\n${notGflag(`zin_gd_tier_${t.n}_seen`)}\n}\nset_global_flag = zin_gd_tier_${t.n}_seen\nrandom_country = { news_event = { id = ${t.news} } }\n}`).join('\n')}`);

  // Step 1 to 6 of the month.
  const steps = (key, v, src) => src.steps.slice().sort((a, b) => b[0] - a[0]).map(([at, val], i) => `${i ? 'else_if' : 'if'} = {\nlimit = { ${gte(v, at)} }\nset_variable = { global.zin_gd_src_${key} = constant:zin_world.src_${key}_${at} }\n}`).join('\n');
  const keys = Object.keys(S);
  effects.set('zin_world_monthly_sources', `# Step 3: the monthly sources of the Gathering Dark (spec, "Monthly sources"). Each source's value is kept in global.zin_gd_src_<key> for the tooltip;
# the gains go through zin_world_add_gathering_dark together (scaled), then the losses (not scaled), each loss stopping at its floor.
${keys.map(k => `set_variable = { global.zin_gd_src_${k} = 0 }`).join('\n')}
if = {
limit = { country_exists = ${T.aenor} }
${T.aenor} = {
${steps('court', 'zin_court_corruption', S.court)}
if = {
limit = { ${gte('zin_council_influence', S.council.at)} }
if = {
limit = { ${gflag('zin_aurevan_crowned')} }
set_variable = { global.zin_gd_src_council = constant:zin_world.src_council_crowned }
}
else = {
set_variable = { global.zin_gd_src_council = constant:zin_world.src_council }
}
}
if = {
limit = { ${gte('zin_aenor_lost_cause', S.league.at)} }
set_variable = { global.zin_gd_src_league = constant:zin_world.src_league }
}
}
}
if = {
limit = { country_exists = ${T.volgan} }
${T.volgan} = {
${steps('south', 'zin_dominion_strength', S.south)}
}
}
if = {
limit = { country_exists = ${T.zol} }
${T.zol} = {
${steps('north', 'zin_mistake_power', S.north)}
}
}
set_temp_variable = { zin_gd_footholds = 0 }
set_temp_variable = { zin_gd_wars = 0 }
every_country = {
add_to_temp_variable = { zin_gd_footholds = zin_footholds }
if = {
limit = {
is_major = yes
has_war = yes
}
add_to_temp_variable = { zin_gd_wars = constant:zin_world.src_wars_each }
}
}
${steps('envoys', 'zin_gd_footholds', S.envoys)}
set_variable = { global.zin_gd_src_wars = zin_gd_wars }
set_temp_variable = { zin_gd_dead = 0 }
set_temp_variable = { zin_gd_dominion = 0 }
every_state = {
limit = {
OR = {
AND = {
controller = { zin_is_zol = yes }
NOT = { is_core_of = ${T.zol} }
}
AND = {
controller = {
OR = {
zin_is_volgan = yes
is_subject_of = ${T.volgan}
}
}
NOT = { is_core_of = ${T.volgan} }
}
}
}
if = {
limit = { controller = { zin_is_zol = yes } }
add_to_temp_variable = { zin_gd_dead = constant:zin_world.src_dead_march_each }
}
else = {
add_to_temp_variable = { zin_gd_dominion = constant:zin_world.src_dominion_march_each }
}
}
set_variable = { global.zin_gd_src_dead_march = zin_gd_dead }
set_variable = { global.zin_gd_src_dominion_march = zin_gd_dominion }
clamp_variable = { var = global.zin_gd_src_wars max = constant:zin_world.src_wars_max }
clamp_variable = { var = global.zin_gd_src_dead_march max = constant:zin_world.src_dead_march_max }
clamp_variable = { var = global.zin_gd_src_dominion_march max = constant:zin_world.src_dominion_march_max }
if = {
limit = {
OR = {
${S.glo.states.map(s => `check_variable = { global.zin_glo_state = ${s} }`).join('\n')}
}
}
set_variable = { global.zin_gd_src_glo = constant:zin_world.src_glo }
}
if = {
limit = {
zin_world_peace_holds = yes
check_variable = { global.zin_gathering_dark > ${S.peace.floor} }
}
set_variable = { global.zin_gd_src_peace = constant:zin_world.src_peace }
}
if = {
limit = {
${gflag('zin_ending_reached')}
check_variable = { global.zin_gathering_dark > ${S.age_turns.floor} }
}
set_variable = { global.zin_gd_src_age_turns = constant:zin_world.src_age_turns }
}
set_temp_variable = { zin_gd_gain = 0 }
set_temp_variable = { zin_gd_loss = 0 }
${keys.map(k => `if = {\nlimit = { check_variable = { global.zin_gd_src_${k} > 0 } }\nadd_to_temp_variable = { zin_gd_gain = global.zin_gd_src_${k} }\n}\nelse = {\nadd_to_temp_variable = { zin_gd_loss = global.zin_gd_src_${k} }\n}`).join('\n')}
if = {
limit = { check_variable = { zin_gd_gain > 0 } }
${add('zin_gd_gain')}
}
if = {
limit = { check_variable = { zin_gd_loss < 0 } }
set_temp_variable = { zin_gd_before = global.zin_gathering_dark }
${add('zin_gd_loss')}
if = {
limit = {
check_variable = { global.zin_gd_src_age_turns < 0 }
check_variable = { global.zin_gathering_dark < ${S.age_turns.floor} }
}
set_variable = { global.zin_gathering_dark = ${S.age_turns.floor} }
}
else_if = {
limit = {
check_variable = { global.zin_gd_src_peace < 0 }
check_variable = { global.zin_gathering_dark < ${S.peace.floor} }
check_variable = { zin_gd_before > ${S.peace.floor - 0.001} }
}
set_variable = { global.zin_gathering_dark = ${S.peace.floor} }
}
}`);

  effects.set('zin_world_one_time_values', `# Step 2: the one-time "world" values, applied once per flag the first month the tick sees it (zin_gd_done_<flag>).
${D.oneTime.map(o => `if = {\nlimit = {\n${gflag(o.flag)}\n${notGflag(`zin_gd_done_${o.flag}`)}\n}\nset_global_flag = zin_gd_done_${o.flag}\n${add(`constant:zin_world.once_${o.flag.replace(/^zin_/, '')}`)}\n}`).join('\n')}`);

  // Step 4: the engine sync. Runs in the runner's scope (threat is read anywhere; add_named_threat needs a country).
  const threatStep = E.steps.map(([gap, threat], i) => `${i ? 'else_if' : 'if'} = {\nlimit = { check_variable = { zin_gd_gap > ${gap} } }\nevent_target:zin_world_threat_country = { add_named_threat = { threat = ${threat} name = zin_world_threat_gathering_dark } }\n}`).join('\n');
  effects.set('zin_world_pick_threat_country', `# The country behind the largest active source: Volgan for the south, Zol for the north, Aenor for the court, council and envoys; else the runner.
clear_global_event_target = zin_world_threat_country
set_temp_variable = { zin_gd_court = global.zin_gd_src_court }
add_to_temp_variable = { zin_gd_court = global.zin_gd_src_council }
add_to_temp_variable = { zin_gd_court = global.zin_gd_src_envoys }
if = {
limit = {
country_exists = ${T.volgan}
check_variable = { global.zin_gd_src_south > 0 }
NOT = { check_variable = { global.zin_gd_src_south < global.zin_gd_src_north } }
NOT = { check_variable = { global.zin_gd_src_south < zin_gd_court } }
}
${T.volgan} = { save_global_event_target_as = zin_world_threat_country }
}
else_if = {
limit = {
country_exists = ${T.zol}
check_variable = { global.zin_gd_src_north > 0 }
NOT = { check_variable = { global.zin_gd_src_north < zin_gd_court } }
}
${T.zol} = { save_global_event_target_as = zin_world_threat_country }
}
else_if = {
limit = { country_exists = ${T.aenor} }
${T.aenor} = { save_global_event_target_as = zin_world_threat_country }
}
else = {
save_global_event_target_as = zin_world_threat_country
}`);
  effects.set('zin_world_sync_engine_tension', `# Step 4 (spec, "Engine tension follows the meter"): the engine's world tension follows (zin_gathering_dark - ${E.offset}) / 100.
# A rise of engine tension of more than ${E.gap} since last month (engine wars, annexations) adds ${E.riseShare * 100} percent of it to the meter as Wars of the Living,
# unless the meter fell this month; then named threat closes the gap below the target in up to ${E.repeat} steps. Run in a country scope.
set_temp_variable = { zin_gd_threat = threat }
if = {
limit = { has_variable = global.zin_world_last_threat }
set_temp_variable = { zin_gd_rise = zin_gd_threat }
subtract_from_temp_variable = { zin_gd_rise = global.zin_world_last_threat }
if = {
limit = {
check_variable = { zin_gd_rise > ${E.gap} }
NOT = { check_variable = { global.zin_gd_month_change < 0 } }
}
multiply_temp_variable = { zin_gd_rise = constant:zin_world.engine_rise_points }
${add('zin_gd_rise')}
}
}
zin_world_pick_threat_country = yes
${Array.from({ length: E.repeat }, () => `set_temp_variable = { zin_gd_gap = global.zin_gathering_dark }
subtract_from_temp_variable = { zin_gd_gap = constant:zin_world.engine_offset }
divide_temp_variable = { zin_gd_gap = 100 }
subtract_from_temp_variable = { zin_gd_gap = threat }
if = {
limit = { has_event_target = zin_world_threat_country }
${threatStep}
}`).join('\n')}
set_variable = { global.zin_world_last_threat = threat }`);

  // Step 5: the War of the Last Crowns.
  effects.set('zin_world_start_last_crowns', `# Sets zin_war_of_last_crowns once and tells every country (zin_world.20). It forces no war: every front is its owner's.
if = {
limit = { ${notGflag('zin_war_of_last_crowns')} }
set_global_flag = zin_war_of_last_crowns
log = "ZIN world: the War of the Last Crowns begins"
random_country = { news_event = { id = zin_world.20 } }
}`);
  effects.set('zin_world_check_last_crowns', `# Spec, "The War of the Last Crowns": HISTORICAL on its date; PLAUSIBLE on the first of the meter at ${D.war.plausibleMeter} after its date, a dark war, or
# the latest date; FREE on the first two. Outside HISTORICAL the first front of the war that comes on its own sets the flag piecemeal (B18 D3).
# Under HISTORICAL the AI's fronts keep the date, but a front a player's realm opens starts the war early, piecemeal (owner answer Q-80,
# K59): zin_world_player_front_open.
if = {
limit = { ${notGflag('zin_war_of_last_crowns')} }
if = {
limit = { zin_rules_is_historical = yes }
if = {
limit = { zin_world_date_last_crowns = yes }
zin_world_start_last_crowns = yes
}
else_if = {
limit = { zin_world_player_front_open = yes }
set_global_flag = zin_war_piecemeal
set_global_flag = zin_war_opened_by_player
zin_world_start_last_crowns = yes
}
}
else_if = {
limit = {
OR = {
AND = {
zin_world_date_plausible_meter = yes
${gte('global.zin_gathering_dark', D.war.plausibleMeter)}
}
zin_world_dark_war = yes
AND = {
zin_rules_is_free = no
zin_world_date_plausible_latest = yes
}
}
}
zin_world_start_last_crowns = yes
}
else_if = {
limit = {
OR = {
${D.war.fronts.map(gflag).join('\n')}
}
}
set_global_flag = zin_war_piecemeal
zin_world_start_last_crowns = yes
}
}`);

  effects.set('zin_world_tension_tick', `# Steps 1 to 6 of the month.
set_variable = { global.zin_gd_month_change = 0 }
set_variable = { global.zin_world_dead_k = 0 }
every_country = { add_to_variable = { global.zin_world_dead_k = casualties_k } }
zin_world_one_time_values = yes
zin_world_monthly_sources = yes
zin_world_sync_engine_tension = yes
zin_world_check_last_crowns = yes`);

  // Step 7: the endings.
  const reachBranches = D.endings.map((e, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { check_variable = { zin_end = ${e.n} } }\nset_global_flag = ${e.flag}\n${e.key === 'lost_cause' ? `if = {\nlimit = { ${notGflag('zin_lost_cause_with_eindil')} }\nset_global_flag = zin_lost_cause_with_eindil\n}\n` : ''}random_country = { news_event = { id = ${e.news} days = 1 } }\n}`).join('\n');
  effects.set('zin_world_reach_ending', `# Argument zin_arg_ending (E1): 1 lost_cause, 2 children_of_volgan, 3 ashen_throne, 4 golden_court, 5 western_crown, 6 strait_master, 7 eastern_king, 8 unfinished.
# Exactly one ending per game: the first call sets zin_ending_reached, global.zin_world_ending and the ending's flag, reveals Afrit first when the
# Ashen Throne comes while the secret is kept, sends the ending's news to every country (its option gives the spirit to the holder) and starts
# the epilogue (zin_ending_start_epilogue, which fires the Chronicle). Every later call does nothing.
set_temp_variable = { zin_end = zin_arg_ending }
clear_variable = zin_arg_ending
if = {
limit = {
${notGflag('zin_ending_reached')}
check_variable = { zin_end > 0 }
check_variable = { zin_end < ${D.endings.length + 1} }
}
if = {
limit = {
check_variable = { zin_end = 3 }
${notGflag('zin_afrit_revealed')}
}
set_temp_variable = { zin_arg_voluntary = 0 }
zin_afrit_reveal = yes
}
set_global_flag = zin_ending_reached
set_variable = { global.zin_world_ending = zin_end }
${reachBranches}
log = "ZIN world: ending [?global.zin_world_ending|0] reached"
set_temp_variable = { zin_arg_ending = zin_end }
zin_ending_start_epilogue = yes
}`);
  const reach = n => `set_temp_variable = { zin_arg_ending = ${n} }\nzin_world_reach_ending = yes`;
  effects.set('zin_world_check_endings', `# Step 7, and the Aenor spec's call at the coronation. Canon endings any month, in order (spec: the order decides a tie); the proposed outcomes
# once, when the judgement opens (zin_world_judgement_open); the Age Unfinished on its date.
if = {
limit = { ${notGflag('zin_ending_reached')} }
if = {
limit = { ${gflag('zin_eindil_crowned')} }
${reach(1)}
}
else_if = {
limit = {
zin_world_date_children = yes
zin_volgan_children_ready = yes
}
${reach(2)}
}
else_if = {
limit = { zin_afrit_ashen_throne_ready = yes }
${reach(3)}
}
else_if = {
limit = {
${notGflag('zin_world_judged')}
zin_world_judgement_open = yes
}
set_global_flag = zin_world_judged
log = "ZIN world: the proposed outcomes are judged"
if = {
limit = { zin_world_golden_court_holds = yes }
${reach(4)}
}
else_if = {
limit = { zin_world_western_crown_holds = yes }
${reach(5)}
}
else_if = {
limit = { zin_world_strait_master_holds = yes }
${reach(6)}
}
else_if = {
limit = { zin_world_eastern_king_holds = yes }
${reach(7)}
}
}
else_if = {
limit = {
zin_world_date_judgement = yes
${notGflag('zin_world_judgement_deferred')}
${notGflag('zin_world_judged')}
}
set_global_flag = zin_world_judgement_deferred
log = "ZIN world: the judgement of the age waits, for the heir is still on his road"
}
if = {
limit = {
${notGflag('zin_ending_reached')}
zin_world_date_unfinished = yes
}
${reach(8)}
}
}`);

  // The tick and its runner.
  effects.set('zin_world_schedule_tick', `# Picks the runner of the next month (the first country of data/world_tension.json "runners" that exists, else the realm with the most
# states, else any) and schedules zin_world.1 there in ${D.tickDays} days. The runner carries the country flag zin_world_runner, which on_annex reads.
if = {
limit = { has_event_target = zin_world_runner }
event_target:zin_world_runner = { clr_country_flag = zin_world_runner }
}
clear_global_event_target = zin_world_runner
${T.runners.map((tag, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { country_exists = ${tag} }\n${tag} = { save_global_event_target_as = zin_world_runner }\n}`).join('\n')}
else = {
set_temp_variable = { zin_gd_best = 0 }
every_country = {
if = {
limit = { check_variable = { num_of_controlled_states > zin_gd_best } }
set_temp_variable = { zin_gd_best = num_of_controlled_states }
save_global_event_target_as = zin_world_runner
}
}
}
if = {
limit = { has_event_target = zin_world_runner }
event_target:zin_world_runner = {
set_country_flag = zin_world_runner
country_event = { id = zin_world.1 days = ${D.tickDays} }
}
}`);
  return { triggers, effects };
}

export async function buildWorldTension(staged, ctx) {
  const D = ctx.data ?? await loadWorldData();
  const roster = ctx.countries;
  const byName = new Map(roster.map(c => [c.name, c]));
  const need = n => { const c = byName.get(n); if (!c) throw new Error(`world_tension: ${n} is not in the roster`); return c; };
  const T = { aenor: need('Aenor').tag, volgan: need('Puvulan').tag, zol: need("Zol's Mistake").tag, parimState: need('Aenor').capitalState, runners: D.runners.map(n => need(n).tag) };
  const { triggers, effects } = worldScripts(D, T);

  // Constants: every tuning value in one place.
  const consts = [['start', D.start], ...D.damping.map(d => [`damp_${d.from}`, d.factor]), ['engine_offset', D.engine.offset], ['engine_rise_points', D.engine.riseShare * 100],
    ...Object.entries(D.rule.rates).map(([k, v]) => [`rate_${k.toLowerCase()}`, v])];
  for (const [k, s] of Object.entries(D.sources)) {
    if (s.steps) for (const [at, v] of s.steps) consts.push([`src_${k}_${at}`, v]);
    if (s.value !== undefined) consts.push([`src_${k}`, s.value]);
    if (s.crowned !== undefined) consts.push([`src_${k}_crowned`, s.crowned]);
    if (s.each !== undefined) consts.push([`src_${k}_each`, s.each], [`src_${k}_max`, s.max]);
  }
  for (const o of D.oneTime) consts.push([`once_${o.flag.replace(/^zin_/, '')}`, o.value]);
  staged.text('common/script_constants/zin_world.txt', format(`${hdr(MOD, SPEC, 'Tuning of the Gathering Dark (tools/content/data/world_tension.json). Fixed point.')}\nzin_world = {\nschema = {\nany_key = yes\ndata = fixed_point\n}\n${consts.map(([k, v]) => `${k} = ${num(v)}`).join('\n')}\n}\n`));

  staged.text('common/scripted_triggers/zin_world_tension.txt', format(`${hdr(MOD, SPEC, 'Triggers of the Gathering Dark and the endings. Global; any scope.')}\n${[...triggers].map(([n, b]) => blk(n, b)).join('\n')}\n`));
  const dateNames = Object.keys(D.dates).map(k => `zin_world_date_${k}`);
  staged.text('common/scripted_triggers/zin_world_dates.txt', `${hdr(MOD, SPEC, 'The dated triggers of the world systems (lib/story_dates.mjs): each is true from its date, moved by zin_story_pace (R2). No zin_world script compares a raw date outside this file.')}\n${Object.entries(D.dates).map(([k, d]) => dateTrigger(`zin_world_date_${k}`, d)).join('\n')}\n`);

  // Step 10: only effects another module has staged.
  const defs = stagedDefinitions(staged);
  const uiCalls = UI_STEP.filter(n => defs.effects.has(n));
  const tick = `# The world tick (spec, "The world tick"): once a month on the runner; the timed flag zin_world_tick_month keeps a second chain from running twice.
if = {
limit = { ${notGflag('zin_world_tick_month')} }
set_global_flag = { flag = zin_world_tick_month value = 1 days = ${D.tickGuardDays} }
zin_world_tension_tick = yes
zin_world_check_endings = yes
zin_path_tick = yes
zin_story_tick = yes
${uiCalls.length ? `every_country = {\nlimit = { is_ai = no }\n${uiCalls.map(n => `${n} = yes`).join('\n')}\n}` : '# Step 10 (zin_ui_refresh, zin_chr_count_unread) waits for the interface and Chronicle modules: neither effect is staged yet.'}
zin_world_schedule_tick = yes
}`;
  effects.set('zin_world_tick', tick);
  staged.text('common/scripted_effects/zin_world_tension.txt', format(`${hdr(MOD, SPEC, 'Effects of the Gathering Dark, the War of the Last Crowns, the endings and the world tick. Arguments are temporary variables zin_arg_<name> (E1).')}\n${[...effects].map(([n, b]) => blk(n, b)).join('\n')}\n`));

  // Ideas: the ending spirits.
  const loc = new Loc();
  const ideas = Object.entries(D.spirits);
  for (const [id, s] of ideas) { await assertModifiers(id, s.modifier); loc.set(id, s.name); loc.set(`${id}_desc`, s.desc); }
  staged.text('common/ideas/zin_world_endings.txt', format(`${hdr(MOD, SPEC, 'The lasting marks of the endings (spec, "How an ending is shown" 4). The ending news events of events/zin_world_endings.txt give them to the holder.')}\nideas = {\ncountry = {\n${ideas.map(([id, s]) => blk(id, `picture = zin_${s.picture}\nallowed = { always = no }\nallowed_civil_war = { always = yes }\nremoval_cost = -1\n${blk('modifier', Object.entries(s.modifier).map(([k, v]) => `${k} = ${num(v)}`).join('\n'))}`)).join('\n')}\n}\n}\n`));

  // on_actions.
  const rates = Object.entries(D.rule.rates);
  staged.text('common/on_actions/zin_world.txt', format(`${hdr(MOD, SPEC, 'on_startup: the Gathering Dark, its rate, the first world tick and the path\'s start check. on_annex: an annexed runner hands the tick to its annexer.')}
on_actions = {
on_startup = {
effect = {
set_variable = { global.zin_gathering_dark = constant:zin_world.start }
${rates.slice(1).map(([k], i) => `${i ? 'else_if' : 'if'} = {\nlimit = { has_game_rule = { rule = ${D.rule.id} option = ${k} } }\nset_variable = { global.${D.rule.variable} = constant:zin_world.rate_${k.toLowerCase()} }\n}`).join('\n')}
else = {
set_variable = { global.${D.rule.variable} = constant:zin_world.rate_${rates[0][0].toLowerCase()} }
}
zin_world_schedule_tick = yes
if = {
limit = { has_event_target = zin_world_runner }
event_target:zin_world_runner = { country_event = { id = zin_path.1 days = 1 } }
}
}
}
on_annex = {
effect = {
if = {
limit = { FROM = { has_country_flag = zin_world_runner } }
FROM = { clr_country_flag = zin_world_runner }
ROOT = {
set_country_flag = zin_world_runner
save_global_event_target_as = zin_world_runner
country_event = { id = zin_world.2 days = 1 }
}
}
}
}
}
`));

  // Events.
  const evLoc = new Loc();
  const out = [];
  out.push(writeEvent('zin_world', { id: 1, kind: 'hidden', immediate: 'zin_world_tick = yes' }, evLoc, { hiddenOk: 'The month turns.' }).text);
  out.push(writeEvent('zin_world', { id: 2, kind: 'hidden', immediate: `# The runner was annexed: the chain moves to its annexer. If this month's tick has run, the next comes when its guard has lapsed.\nif = {\nlimit = { ${gflag('zin_world_tick_month')} }\ncountry_event = { id = zin_world.1 days = ${D.tickGuardDays + 1} }\n}\nelse = {\nzin_world_tick = yes\n}` }, evLoc, { hiddenOk: 'The month turns.' }).text);
  for (const [id, e] of Object.entries(D.events)) {
    const n = evNum(id);
    const desc = e.descPiecemeal ? [{ text: e.descPiecemeal, trigger: gflag('zin_war_piecemeal') }, { text: e.desc, trigger: notGflag('zin_war_piecemeal') }] : e.desc;
    out.push(writeEvent('zin_world', { id: n, kind: 'news', title: e.title, desc, picture: e.picture, options: [{ key: 'a', text: e.ok }] }, evLoc).text);
  }
  staged.text('events/zin_world.txt', format(`${hdr(MOD, SPEC, 'Namespace zin_world, ids 1 to 29: the world tick, the tier news and the War of the Last Crowns. Ids 30 to 69 belong to the magic module, 100 to 119 to events/zin_world_endings.txt.')}\nadd_namespace = zin_world\n\n${out.join('\n\n')}\n`));

  // Scripted localisation and text.
  for (const t of D.tiers) loc.set(`zin_world_gd_tier_${t.n}_name`, t.name);
  loc.set('zin_world_gd_turned', D.turned);
  loc.set('zin_world_threat_gathering_dark', 'The Gathering Dark');
  for (const [k, s] of Object.entries(D.sources)) { loc.set(`zin_world_gd_src_${k}`, s.label); if (s.labelRevealed) loc.set(`zin_world_gd_src_${k}_revealed`, s.labelRevealed); }
  const dt = (name, entries) => blk('defined_text', list(`name = ${name}`, entries.map(([cond, key]) => blk('text', list(cond ? blk('trigger', cond) : '', `localization_key = ${key}`)))));
  const sl = [
    dt('zin_world_gd_tier_name', [[gflag('zin_ending_reached'), 'zin_world_gd_turned'], ...D.tiers.slice().reverse().map(t => [t.from > 0 ? gte('global.zin_gathering_dark', t.from) : '', `zin_world_gd_tier_${t.n}_name`])]),
    ...Object.entries(D.sources).filter(([, s]) => s.labelRevealed).map(([k]) => dt(`zin_world_gd_src_${k}_label`, [[gflag('zin_afrit_revealed'), `zin_world_gd_src_${k}_revealed`], ['', `zin_world_gd_src_${k}`]])),
  ];
  staged.text('common/scripted_localisation/zin_world_tension.txt', format(`${hdr(MOD, SPEC, 'The tier name of the Gathering Dark and the source labels that keep the secret until zin_afrit_revealed.')}\n${sl.join('\n')}\n`));

  const all = { ...Object.fromEntries(loc.map), ...Object.fromEntries(evLoc.map) };
  const problems = [...secrecyLeaks(all), ...(await wordProblems(all)), ...notCp1252(all)];
  if (problems.length) throw new Error(`world_tension text:\n  ${problems.join('\n  ')}`);
  staged.loc('zin_world_tension', all);

  return { counts: { triggers: triggers.size + dateNames.length, effects: effects.size, ideas: ideas.length, events: out.length, constants: consts.length, keys: Object.keys(all).length, uiStep: uiCalls.length }, definitions: { triggers: [...triggers.keys(), ...dateNames], effects: [...effects.keys()], ideas: ideas.map(([id]) => id), events: [1, 2, ...Object.keys(D.events).map(evNum)].map(n => `zin_world.${n}`) } };
}
