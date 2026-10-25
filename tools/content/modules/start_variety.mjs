// Start variety (docs/design/alternate_history.md section 7, V1 to V13; docs/specs/04_mechanics/realm_life.md): the rule
// zin_rule_start_variety ("The Shape of the Age") lets the start differ a little within the lore. OFF changes nothing; LIGHT varies the
// Golden King's health and the court's temper (V1), the Council's readiness (V2), the succession field (V3), rulers' tempers (V4), the
// strength of the dark (V5), the Grey Ford truce (V7), the Deliverer's network (V10), Mirolon's watch (V11), Lerendor's grievance (V12)
// and the waking (V13); FULL adds small feuds (V6), disputed lands (V8) and loose bonds (V9). DEFAULT follows the path rule: off under
// HISTORICAL, light under PLAUSIBLE, full under FREE (R1, through the generated wrappers zin_rules_ai_branch_variety_<option>).
//
//   const variety = await buildStartVariety(staged, { countries })      // build.mjs, beside realm life
//
// The invariants no option breaks (the owner's start of 18 October 2026): the Golden King reigns on 1 Lumae 4A 1748; the heir has not
// woken and nobody employs him; the Deliverer is not revealed and no variety text exists for him to be named in; no great power is at
// war and no league changes; no canon figure changes; every drawn value stays inside the design's range. The drawn changes that land on
// one realm (tempers, feuds, lands, bonds) are made between AI realms only.
//
// Data: tools/content/data/start_variety.json. Writes common/on_actions/zin_start_variety.txt (the draws, once, in on_startup),
// common/scripted_effects/zin_start_variety.txt, common/scripted_triggers/zin_start_variety.txt, common/script_constants/zin_variety.txt,
// common/country_leader/zin_temper_traits.txt (the eight tempers), events/zin_variety.txt (the hidden application on day 3 and the end of
// the feuds) and the trait text. The V3 camp shifts are read by zin_aenor_compute_camps (lib/mech_aenor_script.mjs); the V1 tempers by the
// AI of the Golden King's reign events (data/events_crown_reign1.json).
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertModifiers } from '../lib/core.mjs';
import { Loc, hdr, format, list, blk, num, writeEvent, wordProblems, notCp1252, unknownCommands, DATA } from '../lib/mech_court_lib.mjs';

const MOD = 'start_variety';
const SPEC = 'docs/specs/04_mechanics/realm_life.md';
export const DATA_FILE = 'start_variety.json';
export const LOC_NAME = 'zin_start_variety';
export const FILES = {
  onActions: 'common/on_actions/zin_start_variety.txt',
  effects: 'common/scripted_effects/zin_start_variety.txt',
  triggers: 'common/scripted_triggers/zin_start_variety.txt',
  constants: 'common/script_constants/zin_variety.txt',
  traits: 'common/country_leader/zin_temper_traits.txt',
  events: 'events/zin_variety.txt',
};
export const LIGHT = ['V1', 'V2', 'V3', 'V4', 'V5', 'V7', 'V10', 'V11', 'V12', 'V13'];
export const FULL = ['V6', 'V8', 'V9'];
const SCRIPT_KEYS = new Set(['immediate', 'is_triggered_only', 'option', 'hidden', 'change_state_after_war', 'combat_width', 'minimum_duration_in_days', 'attacker', 'defender',
  'state', 'num_provinces', 'dont_fire_events', 'country', 'relation', 'active', 'random', 'rule', 'on_actions', 'on_startup', 'add_namespace']);

export async function loadStartVariety() {
  const D = JSON.parse(await readFile(path.join(DATA, DATA_FILE), 'utf8'));
  if (D.kind !== 'start_variety') throw new Error(`${DATA_FILE}: kind must be start_variety`);
  return D;
}

// A random_list over the documented values, each equally likely, that sets one global.
const drawList = (variable, values) => list('random_list = {', values.map(v => `1 = { set_variable = { ${variable} = ${num(v)} } }`), '}');
export const traitId = k => `zin_trait_temper_${k}`;

// Every drawn value against the design's documented ranges (the invariant "inside the owner's documented range").
export function rangeProblems(D) {
  const out = [];
  const within = (id, values, lo, hi) => { for (const v of values) if (v < lo || v > hi) out.push(`${id}: ${v} is outside ${lo} to ${hi}`); };
  within('V1 clock offset', D.V1.clockOffset, -180, 180);
  within('V2 plot', D.V2.plot, 10, 35); within('V2 veil', D.V2.veil, 70, 90);
  within('V3 camp shift', D.V3.campShift, -10, 10); within('V3 Eronel', D.V3.eronelFavour, 0, 2);
  within('V5 Volgan', D.V5.volgan, 40, 50); within('V5 Zol', D.V5.zol, 30, 40); within('V5 Gathering Dark', D.V5.dark, 8, 12);
  within('V7 truce', D.V7.truce, 30, 50); within('V7 unity', D.V7.unity, 10, 20);
  within('V11 passes', D.V11.passes, -10, 10); within('V11 proof', D.V11.proof, -10, 10);
  within('V12 standing', D.V12.standing, -15, 15);
  within('V13 extra jitter', D.V13.extra, 0, 40);
  if (D.V6.max > 2) out.push('V6: at most two feuds (K34)');
  for (const [k, vals] of Object.entries({ clock: D.V1.clockOffset, camp: D.V3.campShift, volgan: D.V5.volgan.map(v => v - 45), zol: D.V5.zol.map(v => v - 35), dark: D.V5.dark.map(v => v - 10), truce: D.V7.truce.map(v => v - 40), unity: D.V7.unity.map(v => v - 15), passes: D.V11.passes, proof: D.V11.proof, standing: D.V12.standing })) {
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (Math.abs(mean) > 1e-9) out.push(`${k}: the draw's mean is ${mean}, not the owner's start value`);
  }
  return out;
}

export function varietyScripts(D, countries) {
  const byName = new Map(countries.map(c => [c.name, c]));
  const need = n => { const c = byName.get(n); if (!c) throw new Error(`start_variety: ${n} is not in the roster`); return c.tag; };
  const AEN = need('Aenor'), PUV = need('Puvulan'), ZOL = need("Zol's Mistake"), MIR = need('Mirolon'), LER = need('Lerendor');
  const runners = D.runners.map(need);
  const light = 'zin_rules_ai_branch_variety_light = yes', full = 'zin_rules_ai_branch_variety_full = yes';
  const T = {}, E = {};
  T.zin_variety_on = `# The start variety is drawn (LIGHT or FULL, or DEFAULT with the path rule PLAUSIBLE or FREE).\nOR = {\n${light}\n${full}\n}`;
  T.zin_variety_full = `# The full start variety (FULL, or DEFAULT with the path rule FREE).\n${full}`;
  const groups = Object.entries(D.V6.groups).map(([g, names]) => [g, names.map(need)]);
  T.zin_variety_feud_ready = list('# V6: a realm that may open a small feud: an AI realm at peace, of a feud group, free and not already feuding.',
    'exists = yes', 'is_ai = yes', 'has_war = no', 'is_subject = no', 'NOT = { has_country_flag = zin_variety_feuding }',
    'OR = {', groups.map(([g]) => `has_country_flag = zin_variety_feud_${g}`), '}');
  T.zin_variety_same_feud_group = list('# V6, scope: a candidate; PREV: the other realm. Both belong to one feud group.', 'OR = {',
    groups.map(([g]) => `AND = {\nhas_country_flag = zin_variety_feud_${g}\nPREV = { has_country_flag = zin_variety_feud_${g} }\n}`), '}');

  // ---- the draws (on_startup)
  const camps = D.V3.camps;
  const draws = list('# The draws of the start variety, once (on_startup is not run on a country). Applied on day 3 by zin_variety.1.',
    'if = {', 'limit = { zin_variety_on = yes }', 'set_global_flag = zin_start_variety_drawn',
    `if = { limit = { ${full} } set_global_flag = zin_start_variety_full }`,
    '# V1 the Golden King\'s health and his court\'s temper', drawList('global.zin_sv_clock', D.V1.clockOffset),
    'random_list = {', D.V1.tempers.map(t => `1 = { ${AEN} = { set_country_flag = zin_gk_temper_${t} } }`), '}',
    '# V2 the Council\'s readiness', drawList('global.zin_sv_plot', D.V2.plot), drawList('global.zin_sv_veil', D.V2.veil),
    '# V3 the succession field (read by zin_aenor_compute_camps at the King\'s death) and Prince Eronel\'s standing',
    camps.map(k => drawList(`global.zin_sv_camp_${k}`, D.V3.campShift)), drawList('global.zin_sv_eronel', D.V3.eronelFavour),
    '# V5 the strength of the dark', drawList('global.zin_sv_volgan', D.V5.volgan), drawList('global.zin_sv_zol', D.V5.zol), drawList('global.zin_sv_dark', D.V5.dark),
    '# V7 the Grey Ford truce', drawList('global.zin_sv_truce', D.V7.truce), drawList('global.zin_sv_unity', D.V7.unity),
    '# V11 Mirolon\'s watch, V12 Lerendor\'s grievance, V13 the waking', drawList('global.zin_sv_passes', D.V11.passes), drawList('global.zin_sv_proof', D.V11.proof),
    drawList('global.zin_sv_strait', D.V12.standing), drawList('global.zin_sv_wake', D.V13.extra),
    runners.map((t, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { country_exists = ${t} }\n${t} = { country_event = { id = zin_variety.1 days = ${D.applyDays} } }\n}`), '}');

  // ---- the application (day 3)
  const apply = [];
  apply.push('# V1: the death clock moves (never under the historical death rule; the floor date still holds), and the court has a temper.',
    `${AEN} = {`, 'if = {', 'limit = {', 'exists = yes', 'has_variable = zin_aenor_king_clock', 'NOT = { has_game_rule = { rule = zin_rule_golden_king_death option = HISTORICAL } }', '}',
    'add_to_variable = { zin_aenor_king_clock = global.zin_sv_clock }', `clamp_variable = { var = zin_aenor_king_clock min = ${D.V1.clockMin} }`, '}',
    '# V3: Prince Eronel\'s standing', 'set_variable = { zin_aenor_eronel_favour = global.zin_sv_eronel }', '}');
  apply.push('# V2: the Council\'s readiness', 'set_variable = { global.zin_afrit_regicide_plot = global.zin_sv_plot }', 'set_variable = { global.zin_afrit_veil = global.zin_sv_veil }');
  apply.push('# V4: tier A and B rulers who are not canon figures may have a temper (AI realms).',
    'every_country = {', 'limit = {', 'is_ai = yes', 'OR = {', 'zin_realm_tier_a = yes', 'zin_realm_tier_b = yes', '}', 'NOT = { zin_realm_is_story_ruler = yes }', '}',
    'random_list = {', `${100 - D.V4.chance} = { }`, `${D.V4.chance} = { zin_variety_add_temper = yes }`, '}', '}');
  apply.push('# V5: the strength of the dark',
    `${PUV} = { if = { limit = { has_variable = zin_dominion_strength } set_variable = { zin_dominion_strength = global.zin_sv_volgan } } }`,
    `${ZOL} = { if = { limit = { has_variable = zin_mistake_power } set_variable = { zin_mistake_power = global.zin_sv_zol } } }`,
    'set_variable = { global.zin_gathering_dark = global.zin_sv_dark }');
  apply.push('# V7: the Grey Ford truce', 'set_variable = { global.zin_west_truce = global.zin_sv_truce }', 'set_variable = { global.zin_west_unity = global.zin_sv_unity }');
  const eastern = 'has_country_flag = zin_region_east_lands\nhas_variable = zin_footholds\nNOT = { has_country_flag = zin_variety_footholds_moved }';
  apply.push('# V10: the Deliverer\'s network: a foothold more in two eastern courts and one fewer in two others, within the cap (zero caps stay zero).',
    Array.from({ length: D.V10.plus }, () => `random_country = {\nlimit = {\n${eastern}\ncheck_variable = { zin_footholds < ${D.V10.cap} }\ncheck_variable = { zin_footholds > 0 }\n}\nadd_to_variable = { zin_footholds = 1 }\nset_country_flag = zin_variety_footholds_moved\n}`),
    Array.from({ length: D.V10.minus }, () => `random_country = {\nlimit = {\n${eastern}\ncheck_variable = { zin_footholds > 0 }\n}\nadd_to_variable = { zin_footholds = -1 }\nset_country_flag = zin_variety_footholds_moved\n}`));
  apply.push('# V11: Mirolon\'s watch', `${MIR} = {`, 'if = {', 'limit = { has_variable = zin_mirolon_passes }', 'add_to_variable = { zin_mirolon_passes = global.zin_sv_passes }',
    'clamp_variable = { var = zin_mirolon_passes min = 0 max = 100 }', 'add_to_variable = { zin_mirolon_proof = global.zin_sv_proof }', 'clamp_variable = { var = zin_mirolon_proof min = 0 max = 100 }', '}', '}');
  apply.push('# V12: Lerendor\'s grievance', `${LER} = {`, 'if = {', 'limit = { has_variable = zin_strait_standing }', 'add_to_variable = { zin_strait_standing = global.zin_sv_strait }',
    'clamp_variable = { var = zin_strait_standing min = -100 max = 100 }', '}', '}');
  apply.push('# V13: the waking (the historical waking only): the jitter widens.',
    'if = {', 'limit = { has_game_rule = { rule = zin_rule_eindil_waking option = HISTORICAL } }', 'add_to_variable = { global.zin_eindil_wake_age = global.zin_sv_wake }', '}');
  // FULL
  const fullApply = [];
  fullApply.push('# V6: at most two small feuds between minor realms of a feud group (K34), ended within ninety days by zin_variety.2.',
    groups.flatMap(([g, tags]) => tags.map(t => `${t} = { set_country_flag = zin_variety_feud_${g} }`)),
    Array.from({ length: D.V6.max }, (_, i) => `random_list = {\n${100 - D.V6.chance} = { }\n${D.V6.chance} = { zin_variety_start_feud_${i + 1} = yes }\n}`));
  fullApply.push('# V8: disputed lands', D.V8.pairs.map(([a, b]) => {
    const A = need(a), B = need(b), W = D.V8.weights;
    const give = (g, r) => `${g} = {\nif = {\nlimit = {\nexists = yes\nis_ai = yes\nnum_of_controlled_states > 2\n${r} = {\nexists = yes\nis_ai = yes\n}\nany_owned_state = {\nis_capital = no\nany_neighbor_state = { is_owned_by = ${r} }\n}\n}\nrandom_owned_state = {\nlimit = {\nis_capital = no\nany_neighbor_state = { is_owned_by = ${r} }\n}\ntransfer_state_to = ${r}\nadd_claim_by = ${g}\n}\n}\n}`;
    return `# ${a} and ${b}\nrandom_list = {\n${W.none} = { }\n${W.first} = {\n${give(A, B)}\n}\n${W.second} = {\n${give(B, A)}\n}\n}`;
  }));
  const pair = names => names.map(need);
  const [cA, cB] = pair(D.V9.courtship), [gA, gB] = pair(D.V9.guarantee), [pA, pB] = pair(D.V9.pact);
  const bothAi = (a, b) => `limit = {\n${a} = {\nexists = yes\nis_ai = yes\n}\n${b} = {\nexists = yes\nis_ai = yes\n}\n}`;
  fullApply.push('# V9: at most one loose bond: a Leren courtship of Andos Enda (it stays outside the Compact, S5), a Stabilo guarantee of Alerhia, a Coldor pact with Nivaros.',
    'random_list = {', `${D.V9.weights.none} = { }`,
    `${D.V9.weights.courtship} = {\nif = {\n${bothAi(cA, cB)}\n${cA} = { add_opinion_modifier = { target = ${cB} modifier = zin_realm_courtship } }\n${cB} = { add_opinion_modifier = { target = ${cA} modifier = zin_realm_courtship } }\n}\n}`,
    `${D.V9.weights.guarantee} = {\nif = {\n${bothAi(gA, gB)}\n${gA} = { give_guarantee = ${gB} }\n}\n}`,
    `${D.V9.weights.pact} = {\nif = {\n${bothAi(pA, pB)}\n${pA} = { diplomatic_relation = { country = ${pB} relation = non_aggression_pact active = yes } }\n}\n}`, '}');
  E.zin_variety_apply = list('# The start variety applied (zin_variety.1, day 3): LIGHT everything but V6, V8 and V9; FULL all of them.',
    'if = {', 'limit = { has_global_flag = zin_start_variety_drawn }', apply.flat(Infinity), 'if = {', 'limit = { has_global_flag = zin_start_variety_full }', fullApply.flat(Infinity), '}', '}');
  // feuds
  for (let i = 1; i <= D.V6.max; i++) {
    const g = `global.zin_sv_feud_${i}`;
    E[`zin_variety_start_feud_${i}`] = list(`# V6, feud ${i}: two bordering AI realms of a feud group, a border state of each, and a border war with no land to change hands.`,
      'set_temp_variable = { zin_t_found = 0 }',
      'random_country = {', 'limit = {', 'zin_variety_feud_ready = yes', 'any_neighbor_country = {', 'zin_variety_feud_ready = yes', 'zin_variety_same_feud_group = yes', '}', '}',
      'save_event_target_as = zin_variety_feud_a',
      'random_neighbor_country = {', 'limit = {', 'zin_variety_feud_ready = yes', 'zin_variety_same_feud_group = yes', '}', 'save_event_target_as = zin_variety_feud_b', 'set_temp_variable = { zin_t_found = 1 }', '}', '}',
      'if = {', 'limit = { check_variable = { zin_t_found = 1 } }',
      'event_target:zin_variety_feud_b = {', 'random_owned_state = {', 'limit = { any_neighbor_state = { is_owned_by = event_target:zin_variety_feud_a } }',
      `set_state_flag = zin_variety_feud_mark`, `set_variable = { ${g}_b = THIS }`, '}', '}',
      'event_target:zin_variety_feud_a = {', 'random_owned_state = {', 'limit = { any_neighbor_state = { has_state_flag = zin_variety_feud_mark } }', `set_variable = { ${g}_a = THIS }`, '}', '}',
      'every_state = { limit = { has_state_flag = zin_variety_feud_mark } clr_state_flag = zin_variety_feud_mark }',
      'if = {', 'limit = {', `check_variable = { ${g}_a > 0 }`, `check_variable = { ${g}_b > 0 }`, '}',
      'event_target:zin_variety_feud_a = { set_country_flag = zin_variety_feuding }', 'event_target:zin_variety_feud_b = { set_country_flag = zin_variety_feuding }',
      `set_global_flag = zin_variety_feud_${i}`,
      'start_border_war = {', 'change_state_after_war = no', `combat_width = ${D.V6.width}`, `minimum_duration_in_days = ${D.V6.minimumDays}`,
      `attacker = {\nstate = ${g}_a\nnum_provinces = ${D.V6.provinces}\n}`, `defender = {\nstate = ${g}_b\nnum_provinces = ${D.V6.provinces}\n}`, '}',
      `country_event = { id = zin_variety.2 days = ${D.V6.days} }`, '}', '}');
  }
  E.zin_variety_end_feuds = list('# V6: the feuds end within ninety days (zin_variety.2), whoever holds the field.',
    Array.from({ length: D.V6.max }, (_, i) => `if = {\nlimit = { has_global_flag = zin_variety_feud_${i + 1} }\nclr_global_flag = zin_variety_feud_${i + 1}\ncancel_border_war = {\nattacker = global.zin_sv_feud_${i + 1}_a\ndefender = global.zin_sv_feud_${i + 1}_b\ndont_fire_events = yes\n}\n}`),
    'every_country = { limit = { has_country_flag = zin_variety_feuding } clr_country_flag = zin_variety_feuding }');
  // tempers
  const tempers = Object.keys(D.tempers);
  E.zin_variety_add_temper = list('# V4: one temper for the ruler of THIS realm, drawn evenly.', 'random_list = {', tempers.map(k => `1 = { add_country_leader_trait = ${traitId(k)} }`), '}');
  E.zin_variety_temper_new_ruler = list('# Realm life (G1): a new ruler of an AI realm may have a temper, as at the start, when the start variety is not off.',
    'if = {', 'limit = {', 'has_global_flag = zin_start_variety_drawn', 'is_ai = yes', '}', 'random_list = {', `${100 - D.V4.chance} = { }`, `${D.V4.chance} = { zin_variety_add_temper = yes }`, '}', '}');
  return { T, E, draws, runners };
}

export async function buildStartVariety(staged, { countries, data } = {}) {
  const D = data ?? await loadStartVariety();
  const problems = rangeProblems(D);
  const { T, E, draws } = varietyScripts(D, countries);
  const loc = new Loc();
  const sorted = o => Object.entries(o).sort(([a], [b]) => a.localeCompare(b, 'en'));
  staged.text(FILES.triggers, format(`${hdr(MOD, SPEC, 'Triggers of the start variety.')}\n${sorted(T).map(([n, b]) => blk(n, b)).join('\n')}\n`));
  staged.text(FILES.effects, format(`${hdr(MOD, SPEC, 'Effects of the start variety: the application on day 3, the feuds and the tempers.')}\n${sorted(E).map(([n, b]) => blk(n, b)).join('\n')}\n`));
  staged.text(FILES.onActions, format(`${hdr(MOD, SPEC, 'on_startup: the draws, once, after the story pace (zin_rules.txt sorts first).')}\non_actions = {\non_startup = {\neffect = {\n${draws}\n}\n}\n}\n`));
  // The documented ranges as constants: the tests and any reader of a drawn value share one source.
  const consts = [['apply_days', D.applyDays], ['feud_days', D.V6.days], ['feud_max', D.V6.max], ['temper_chance', D.V4.chance], ['foothold_cap', D.V10.cap], ['eronel_favour_camp', D.V3.eronelCampStep], ['clock_min', D.V1.clockMin]];
  staged.text(FILES.constants, format(`${hdr(MOD, SPEC, 'Tuning of the start variety (tools/content/data/start_variety.json). Fixed point.')}\nzin_variety = {\nschema = {\nany_key = yes\ndata = fixed_point\n}\n${consts.map(([k, v]) => `${k} = ${num(v)}`).join('\n')}\n}\n`));
  // the tempers (country leader traits, no icon: ZIN's leader traits carry none, as characters.mjs writes them)
  const traitLines = [];
  for (const [k, t] of Object.entries(D.tempers)) {
    await assertModifiers(traitId(k), t.mods);
    loc.set(traitId(k), t.name); loc.set(`${traitId(k)}_desc`, t.desc);
    traitLines.push(blk(traitId(k), list('random = no', Object.entries(t.mods).map(([m, v]) => `${m} = ${num(v)}`))));
  }
  staged.text(FILES.traits, format(`${hdr(MOD, SPEC, 'The tempers of rulers (V4), drawn at the start and for new rulers when the start variety is not off.')}\nleader_traits = {\n${traitLines.join('\n')}\n}\n`));
  // the hidden events
  const evLoc = new Loc();
  const evs = [writeEvent('zin_variety', { id: 1, kind: 'hidden', immediate: 'zin_variety_apply = yes' }, evLoc, { hiddenOk: 'The age takes its shape.' }),
    writeEvent('zin_variety', { id: 2, kind: 'hidden', immediate: 'zin_variety_end_feuds = yes' }, evLoc, { hiddenOk: 'The feuds are done.' })];
  const eventText = format(`${hdr(MOD, SPEC, 'Namespace zin_variety: the start variety applied on day 3 (1) and the feuds ended (2).')}\nadd_namespace = zin_variety\n${evs.map(e => e.text).join('\n')}\n`);
  staged.text(FILES.events, eventText);
  for (const [k, v] of Object.entries(evLoc.entries())) loc.set(k, v);
  for (const rel of [FILES.effects, FILES.triggers, FILES.onActions, FILES.events]) for (const k of await unknownCommands(staged.files.get(rel).toString('utf8'), SCRIPT_KEYS)) problems.push(`${rel}: ${k} is neither documented nor a ZIN name`);
  const entries = loc.entries();
  problems.push(...await wordProblems(entries), ...notCp1252(entries));
  if (problems.length) throw new Error(`Start variety breaks the rules (${problems.length}):\n  ${problems.slice(0, 40).join('\n  ')}`);
  staged.loc(LOC_NAME, entries);
  const definitions = { triggers: Object.keys(T), effects: Object.keys(E), traits: Object.keys(D.tempers).map(traitId), events: ['zin_variety.1', 'zin_variety.2'] };
  return { counts: { ...Object.fromEntries(Object.entries(definitions).map(([k, v]) => [k, v.length])), light: LIGHT.length, full: FULL.length }, definitions };
}
