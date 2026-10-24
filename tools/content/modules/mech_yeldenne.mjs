// ZIN mechanic module: Yeldenne and Glo (docs/specs/04_mechanics/yeldenne_and_glo.md). The Castle of Yeldenne's wards and hall rules,
// Glo (where it is, what it costs, what it gives), the seekers and the hall's outcomes, the sealed, dimmed and second-bearer
// gameplay outcomes, Glo's Wave, and every event of the `zin_glo` namespace. Integration note: docs/design/stage2/mech_journey.md.
//
//   const result = await buildYeldenneGlo(staged, { countries });
//
// ctx.countries    the roster (tools/content/data/countries.json, `countries`); countries are named in the data and resolved to tags
// ctx.gloData      optional replacement of tools/content/data/mech_journey_glo.json (the tests use it for negative cases)
// ctx.glo          optional switches: externalCharacters (ids another module defines; skipped here)
//
// Returns { counts, definitions, scripts, dependencies, files, localisation, startup, tags, hallState }. `scripts` lists every
// script text written (for the vocabulary check); `dependencies` lists names this module uses and another module owns.
import { cw, raw } from '../lib/core.mjs';
import { HEADER, L, render, fileText, comment, readJson, makeRoster, Loc, ScriptSet, eventLines, num, dateAfter } from '../lib/mech_journey_lib.mjs';

const EVT = k => `GFX_zin_evt_${k}`;
const NEWS = k => `GFX_zin_news_${k}`;
const IDEA_ICON = k => `GFX_idea_zin_${k}`;

export async function buildYeldenneGlo(staged, ctx = {}) {
  const data = ctx.gloData ?? await readJson('mech_journey_glo.json');
  const opt = ctx.glo ?? {};
  const roster = makeRoster(ctx.countries);
  const TAG = Object.fromEntries(Object.entries(data.countries).map(([k, name]) => [k, roster.tag(name)]));
  const HALL = roster.capitalState(data.countries.yeldenne);
  const C = data.constants, ch = data.characters, ev = data.events;
  const loc = new Loc('zin_glo');
  const scripts = new ScriptSet();
  const files = [];
  const put = (rel, text) => { staged.text(rel, text); files.push(rel); };
  const defs = { events: [], effects: [], triggers: [], ideas: [], decisions: [], categories: [], traits: [], opinions: [], characters: [], dynamicModifiers: [] };
  const dep = (name, kind, owner) => scripts.depend(name, kind, owner);
  const K = k => { if (!(k in C)) throw new Error(`Unknown Glo constant ${k}`); return `constant:zin_glo.${k}`; };
  const hallOwner = (...body) => L(`${HALL}`, L('owner', ...body));
  const toEveryHub = (cond, ...body) => L('every_country', `limit = { zin_afrit_is_hub = yes NOT = { owns_state = ${HALL} } ${cond ?? ''} }`, ...body);
  const zolHost = `OR = { original_tag = ${TAG.zol} is_subject_of = ${TAG.zol} }`;

  // ---------------------------------------------------------------------------------------------- script constants
  put('common/script_constants/zin_glo_constants.txt', `${HEADER}\n# Tuning of the Yeldenne and Glo mechanic (tools/content/data/mech_journey_glo.json). Integers; hundredths where a fraction is meant.\nzin_glo = {\n\tschema = {\n\t\tany_key = yes\n\t\tdata = int\n\t}\n\n${Object.entries(C).map(([k, v]) => `\t${k} = ${v}`).join('\n')}\n}\n`);

  // ---------------------------------------------------------------------------------------------- spirits, traits, modifiers
  const ideas = {};
  for (const s of data.spirits) {
    ideas[s.id] = { picture: `zin_${s.icon}`, allowed: raw('{ always = no }'), allowed_civil_war: raw('{ always = yes }'), removal_cost: -1, modifier: s.modifier };
    loc.add(s.id, s.name); loc.add(`${s.id}_desc`, s.desc); defs.ideas.push(s.id);
  }
  put('common/ideas/zin_glo.txt', `${HEADER}\nideas = {\n\tcountry = {\n${cw(ideas, 2)}\t}\n}\n`);
  const leaderTraits = {};
  for (const t of data.countryLeaderTraits) { leaderTraits[t.id] = { random: false, ...t.modifier }; loc.add(t.id, t.name); loc.add(`${t.id}_desc`, t.desc); defs.traits.push(t.id); }
  put('common/country_leader/zin_yeldenne_glo.txt', `${HEADER}\nleader_traits = {\n${cw(leaderTraits, 1)}}\n`);
  const unitTraits = {};
  for (const t of data.unitLeaderTraits) { unitTraits[t.id] = { type: 'land', trait_type: 'personality_trait', modifier: t.modifier }; loc.add(t.id, t.name); loc.add(`${t.id}_desc`, t.desc); defs.traits.push(t.id); }
  put('common/unit_leader/zin_yeldenne_glo.txt', `${HEADER}\nleader_traits = {\n${cw(unitTraits, 1)}}\n`);
  const dyn = {};
  for (const m of data.dynamicModifiers) { dyn[m.id] = { icon: IDEA_ICON(m.icon), ...m.modifier }; defs.dynamicModifiers.push(m.id); loc.add(m.id, m.name); }
  put('common/dynamic_modifiers/zin_glo.txt', `${HEADER}\n${cw(dyn)}`);
  const opin = {};
  for (const o of data.opinionModifiers) { opin[o.id] = { value: o.value, decay: o.decay }; defs.opinions.push(o.id); loc.add(o.id, o.name); }
  put('common/opinion_modifiers/zin_glo.txt', `${HEADER}\nopinion_modifiers = {\n${cw(opin, 1)}}\n`);
  if (!(opt.externalCharacters ?? []).includes(ch.warden)) {
    put('common/characters/zin_yeldenne_glo.txt', `${HEADER}\ncharacters = {\n${cw({ [ch.warden]: { name: ch.warden, portraits: { civilian: { large: ch.wardenPortrait } } } }, 1)}}\n`);
    defs.characters.push(ch.warden);
  }
  loc.add(ch.warden, "The Warden of Mp'E");

  // ---------------------------------------------------------------------------------------------- scripted triggers
  const triggerDefs = [];
  const T = (name, ...body) => { triggerDefs.push({ name, body }); scripts.add(name, 'trigger', body); defs.triggers.push(name); };
  T('zin_horos_alive', 'NOT = { has_global_flag = zin_horos_dead }');
  T('zin_glo_in_play', L('OR', 'check_variable = { global.zin_glo_state = 1 }', 'check_variable = { global.zin_glo_state = 4 }'));
  T('zin_glo_hall_owner', `owns_state = ${HALL}`);
  T('zin_glo_is_hall_state', `state = ${HALL}`);
  T('zin_glo_is_bearer_host', L('OR',
    L('AND', 'check_variable = { global.zin_glo_state = 1 }', 'has_character = zin_eindil'),
    L('AND', 'check_variable = { global.zin_glo_state = 4 }', L('any_unit_leader', 'has_character_flag = zin_glo_bearer'))));
  T('zin_glo_heir_in_hall', 'has_global_flag = zin_glo_heir_in_hall', 'zin_horos_alive = yes');
  T('zin_glo_worthy_claimant',
    'has_government = democratic',
    'NOT = { has_offensive_war = yes }',
    'NOT = { has_country_flag = zin_glo_conqueror }',
    'NOT = { check_variable = { zin_footholds > 2 } }',
    L('OR', 'check_variable = { zin_eindil_regard > 49 }', 'has_country_flag = zin_lost_cause_member',
      L('AND', 'has_variable = global.zin_eindil_host', L('var:global.zin_eindil_host', 'exists = yes', 'is_in_faction_with = PREV'))));
  T('zin_glo_lost_cause_leader',
    'NOT = { zin_afrit_rules_here = yes }',
    L('OR',
      L('AND', 'has_global_flag = zin_lost_cause_with_eindil', 'zin_eindil_is_host = yes'),
      L('AND', 'NOT = { has_global_flag = zin_lost_cause_with_eindil }', 'has_global_flag = zin_lost_cause_shield', 'is_faction_leader = yes', 'has_country_flag = zin_lost_cause_member'),
      L('AND', 'NOT = { has_global_flag = zin_lost_cause_with_eindil }', 'NOT = { has_global_flag = zin_lost_cause_shield }', `original_tag = ${TAG.aenor}`)));
  T('zin_glo_hunt_possible', `original_tag = ${TAG.volgan}`, 'NOT = { has_war = yes }', 'NOT = { has_country_flag = zin_glo_hunt_sent }',
    L('OR', 'check_variable = { global.zin_glo_state = 0 }', 'check_variable = { global.zin_glo_state = 2 }'), dateAfter('1753.3.1'));
  T('zin_glo_dark_power', L('OR', 'zin_afrit_is_hub = yes', 'zin_afrit_rules_here = yes', `original_tag = ${TAG.volgan}`));
  // a state where the bearer's army stands or is next door: Eindil's HQ, or (second bearer) a state the host that holds the light controls
  T('zin_glo_bearer_near', L('OR',
    L('AND', 'check_variable = { global.zin_glo_state = 1 }', 'zin_eindil_army_near = yes'),
    L('AND', 'check_variable = { global.zin_glo_state = 4 }',
      L('OR', 'controller = { has_idea = zin_glo_glernaens_light }', L('any_neighbor_state', 'controller = { has_idea = zin_glo_glernaens_light }')))));
  T('zin_glo_wave_target', 'zin_glo_bearer_near = yes', `controller = { ${zolHost} }`);
  for (const [n, o] of [['zin_afrit_is_hub', 'afrit_hidden_council'], ['zin_afrit_rules_here', 'afrit_hidden_council'], ['zin_eindil_is_host', 'eindil_journey (mech_eindil.mjs)'], ['zin_eindil_army_near', 'eindil_journey (mech_eindil.mjs)']]) dep(n, 'scripted trigger', o);

  // ---------------------------------------------------------------------------------------------- scripted effects
  const effectDefs = [];
  const E = (name, ...body) => { effectDefs.push({ name, body }); scripts.add(name, 'effect', body); defs.effects.push(name); };
  E('zin_yeldenne_add_wards',
    'add_to_variable = { global.zin_yeldenne_wards = zin_arg_value }',
    `set_temp_variable = { glo_wards_max = ${K('wards_max')} }`,
    'clamp_variable = { var = global.zin_yeldenne_wards min = 0 max = glo_wards_max }',
    'set_temp_variable = { zin_arg_value = 0 }');
  E('zin_glo_add_power',
    'add_to_variable = { global.zin_glo_power = zin_arg_value }',
    'if = { limit = { check_variable = { global.zin_glo_power > global.zin_glo_power_cap } } set_variable = { global.zin_glo_power = global.zin_glo_power_cap } }',
    'clamp_variable = { var = global.zin_glo_power min = 0 max = 100 }',
    'set_temp_variable = { zin_arg_value = 0 }');
  E('zin_glo_on_sword_broken',
    "# Zol crushed the blue sword (zin_mistake.21 sets zin_horos_sword_broken, N1): Glo keeps less of Glernaen's power from here on. Runs once.",
    L('if', 'limit = { NOT = { has_global_flag = zin_glo_sword_handled } }',
      'set_global_flag = zin_glo_sword_handled',
      `set_variable = { global.zin_glo_power_cap = ${K('power_max_broken')} }`,
      `set_variable = { global.zin_glo_power = ${K('power_broken')} }`));
  E('zin_glo_clear_seal_keepers',
    "# Glo has left the hall (or dimmed): the regional tree's seal-keepers spirit has nothing left to keep.",
    L(TAG.yeldenne, 'if = { limit = { has_idea = zin_regional_yeldenne_seal_keepers } remove_ideas = zin_regional_yeldenne_seal_keepers }'));
  dep('zin_regional_yeldenne_seal_keepers', 'idea', 'regional yeldenne tree');
  E('zin_glo_follow_bearer',
    "# Glernaen's Light rests on the host that employs the bearer, and moves with him.",
    'every_country = { limit = { has_idea = zin_glo_glernaens_light } remove_ideas = zin_glo_glernaens_light }',
    L('if', 'limit = { check_variable = { global.zin_glo_state = 1 } has_variable = global.zin_eindil_host }',
      L('var:global.zin_eindil_host', L('if', 'limit = { exists = yes }', 'add_ideas = zin_glo_glernaens_light'))),
    L('if', 'limit = { check_variable = { global.zin_glo_state = 4 } }',
      L('random_country', 'limit = { any_unit_leader = { has_character_flag = zin_glo_bearer } }', 'add_ideas = zin_glo_glernaens_light')));
  E('zin_yeldenne_set_hall_modifier',
    L(`${HALL}`,
      'if = { limit = { has_dynamic_modifier = { modifier = zin_yeldenne_hall_wards } } remove_dynamic_modifier = { modifier = zin_yeldenne_hall_wards } }',
      'if = { limit = { has_dynamic_modifier = { modifier = zin_yeldenne_sealed_hall } } remove_dynamic_modifier = { modifier = zin_yeldenne_sealed_hall } }',
      'if = { limit = { has_dynamic_modifier = { modifier = zin_yeldenne_empty_hall } } remove_dynamic_modifier = { modifier = zin_yeldenne_empty_hall } }',
      L('if', 'limit = { has_global_flag = zin_horos_dead }',
        L('if', 'limit = { check_variable = { global.zin_glo_state = 2 } }', 'add_dynamic_modifier = { modifier = zin_yeldenne_sealed_hall }'),
        L('else', 'add_dynamic_modifier = { modifier = zin_yeldenne_empty_hall }')),
      L('else', 'add_dynamic_modifier = { modifier = zin_yeldenne_hall_wards }')));
  // The second bearer is the highest-skill field marshal of the claimant (ROOT). Skill runs 1 to 9; the ladder tries 9 down to 1.
  E('zin_glo_pick_second_bearer',
    'set_temp_variable = { glo_picked = 0 }',
    ...[8, 7, 6, 5, 4, 3, 2, 1, 0].map(n => L('if', `limit = { check_variable = { glo_picked = 0 } any_unit_leader = { is_field_marshal = yes skill > ${n} } }`,
      'set_temp_variable = { glo_picked = 1 }',
      L('random_unit_leader', `limit = { is_field_marshal = yes skill > ${n} }`, 'set_character_flag = zin_glo_bearer', 'add_unit_leader_trait = zin_glo_second_bearer'))));
  E('zin_glo_transfer',
    '# Glo moves only here. zin_arg_to: 1 Eindil, 2 a second bearer (ROOT is the claimant), 3 sealed in the hall. Nobody unworthy ever holds it (O3).',
    L('if', 'limit = { check_variable = { zin_arg_to = 1 } }',
      'set_variable = { global.zin_glo_state = 1 }', 'set_global_flag = zin_glo_with_eindil', `set_variable = { global.zin_glo_power = ${K('power_max')} }`,
      'zin_glo_clear_seal_keepers = yes', 'zin_glo_follow_bearer = yes'),
    L('else_if', 'limit = { check_variable = { zin_arg_to = 2 } }',
      'set_variable = { global.zin_glo_state = 4 }', `set_variable = { global.zin_glo_power = ${K('power_max')} }`,
      'zin_glo_pick_second_bearer = yes', 'zin_glo_clear_seal_keepers = yes', 'zin_glo_follow_bearer = yes'),
    L('else', 'set_variable = { global.zin_glo_state = 2 }', 'set_global_flag = zin_glo_sealed'),
    'zin_yeldenne_set_hall_modifier = yes',
    'set_temp_variable = { zin_arg_to = 0 }');

  // pulse parts (scope: the owner of Mp'E)
  const damage = n => L('damage_units', 'state = THIS', 'limit = { has_war_with = ROOT }', `org_damage = ${num(C.org_damage / 100)}`, `str_damage = ${num(n / 100)}`, 'ratio = yes', 'army = yes');
  E('zin_glo_hall_wards_tick',
    "# Every pulse the wards harm an enemy army that holds or stands in Mp'E; the band follows the wards.",
    L(`${HALL}`,
      L('if', `limit = { check_variable = { global.zin_yeldenne_wards < ${K('wards_mid')} } }`, damage(C.str_damage_low)),
      L('else_if', `limit = { check_variable = { global.zin_yeldenne_wards < ${K('wards_high')} } }`, damage(C.str_damage_mid)),
      L('else', damage(C.str_damage_high))));
  E('zin_glo_hall_occupation_tick',
    "# After 28 days of enemy control the hall expels the intruders and its owner holds Mp'E again.",
    L(`${HALL}`,
      L('if', 'limit = { NOT = { is_controlled_by = ROOT } }',
        L('if', 'limit = { NOT = { has_variable = zin_glo_occupied_since } }', 'set_variable = { zin_glo_occupied_since = global.num_days }'),
        'set_temp_variable = { glo_held = global.num_days }',
        'subtract_from_temp_variable = { glo_held = zin_glo_occupied_since }',
        L('if', `limit = { check_variable = { glo_held > ${K('expel_days')} } }`,
          L('controller', 'country_event = { id = zin_glo.62 }'),
          'set_state_controller_to = ROOT',
          'clear_variable = zin_glo_occupied_since')),
      L('else', 'if = { limit = { has_variable = zin_glo_occupied_since } clear_variable = zin_glo_occupied_since }')));
  E('zin_glo_regen_tick',
    L('if', 'limit = { zin_glo_in_play = yes }',
      `add_to_variable = { global.zin_glo_regen_days = ${C.pulse_days} }`,
      L('if', `limit = { check_variable = { global.zin_glo_regen_days > ${C.regen_days - 1} } }`,
        'set_variable = { global.zin_glo_regen_days = 0 }',
        `set_temp_variable = { zin_arg_value = ${K('regen_power')} }`,
        'zin_glo_add_power = yes')));
  E('zin_glo_sword_check', L('if', 'limit = { has_global_flag = zin_horos_sword_broken NOT = { has_global_flag = zin_glo_sword_handled } }', 'zin_glo_on_sword_broken = yes'));
  E('zin_glo_watch_check',
    '# The northern watch ends when the guarantee does.',
    L('every_country', 'limit = { has_idea = zin_glo_northern_watch }', L('if', 'limit = { NOT = { is_guaranteed_by = ROOT } }', 'remove_ideas = zin_glo_northern_watch')),
    L('if', 'limit = { NOT = { any_country = { has_idea = zin_glo_northern_watch } } }', 'clr_global_flag = zin_glo_watch_active'));
  E('zin_glo_defile_check',
    '# Defiling ends after a year of black rites (545 days when the seal is warded) and Glo dims for good.',
    L('if', 'limit = { check_variable = { global.zin_glo_defile_end > 0 } check_variable = { global.num_days > global.zin_glo_defile_end } }',
      'clr_global_flag = zin_glo_defiling',
      'set_variable = { global.zin_glo_defile_end = 0 }',
      'set_variable = { global.zin_glo_state = 3 }',
      'set_global_flag = zin_glo_dimmed',
      'zin_glo_clear_seal_keepers = yes',
      'zin_yeldenne_set_hall_modifier = yes',
      `set_temp_variable = { zin_arg_value = ${K('dark_glo_dims')} }`, 'zin_world_add_gathering_dark = yes',
      L('every_country', 'limit = { is_ai = no }', 'news_event = { id = zin_glo.51 }')));
  dep('zin_world_add_gathering_dark', 'scripted effect', 'world systems (05_world_tension_and_endings)');
  E('zin_glo_wave_scan',
    "# Caches, once a pulse, whether the dead of the Mistake stand near the bearer's army (Glo's Wave reads the flag).",
    'clr_global_flag = zin_glo_wave_ready',
    L('random_state', 'limit = { zin_glo_wave_target = yes }', 'set_global_flag = zin_glo_wave_ready'));
  E('zin_glo_story_check',
    "# The Deliverer's party reaches the approach; a party that came to strike at once does so; the watch and the defilement run their courses.",
    L('if', 'limit = { has_global_flag = zin_afrit_at_yeldenne NOT = { has_global_flag = zin_glo_approach_seen } zin_horos_alive = yes }',
      'set_global_flag = zin_glo_approach_seen',
      L('every_country', 'limit = { zin_afrit_is_hub = yes }', 'country_event = { id = zin_glo.11 }'),
      L('if', 'limit = { has_global_flag = zin_afrit_hall_at_once }', 'zin_glo_afrit_strikes = yes')),
    L('if', 'limit = { has_global_flag = zin_glo_watch_active }', 'zin_glo_watch_check = yes'),
    L('if', 'limit = { has_global_flag = zin_glo_defiling }', 'zin_glo_defile_check = yes'),
    L('if', 'limit = { zin_glo_in_play = yes }', 'zin_glo_wave_scan = yes'));
  dep('zin_afrit_at_yeldenne', 'global flag', 'afrit_hidden_council'); dep('zin_afrit_hall_at_once', 'global flag', 'afrit_hidden_council');

  // Glo's Wave, scope: the struck state.
  const wave = (strDamage) => L('damage_units', 'state = THIS', `limit = { ${zolHost} }`, 'org_damage = 1', `str_damage = ${strDamage}`, 'ratio = yes', 'army = yes');
  E('zin_glo_wave',
    "# Scope: the struck state. zin_arg_first: 1 for the first wave (the sword in the earth), else 0. Only Zol's dead are unmade;",
    "# no Zol or warfare effect takes part, so nothing returns through Zol's return of the fallen.",
    L('if', 'limit = { check_variable = { zin_arg_first = 1 } }',
      wave(1),
      L('every_neighbor_state', `limit = { controller = { ${zolHost} } }`, wave(1), 'set_state_flag = { flag = zin_glo_cleansed days = 60 }')),
    L('else', wave(0.5)),
    'set_state_flag = { flag = zin_glo_cleansed days = 60 }',
    'set_temp_variable = { zin_arg_first = 0 }');
  E('zin_glo_wave_battlefield',
    '# The first wave of the return, on the battlefield state the journey stored (any scope).',
    L('if', 'limit = { has_variable = global.zin_eindil_battlefield }',
      'set_temp_variable = { zin_arg_first = 1 }',
      L('var:global.zin_eindil_battlefield', 'zin_glo_wave = yes')));
  E('zin_glo_wave_decided',
    '# The decision: pay the bearer\'s power, strike a state next to the army that holds the dead.',
    `set_temp_variable = { zin_arg_value = -${C.wave_cost} }`,
    'zin_glo_add_power = yes',
    L('random_state', 'limit = { zin_glo_wave_target = yes }', 'set_temp_variable = { zin_arg_first = 0 }', 'zin_glo_wave = yes'));
  E('zin_yeldenne_install_warden',
    "# Horos is dust: the Warden of Mp'E rules for the hall. The wards spirits of the regional tree stay only while the crystal lies sealed.",
    L(TAG.yeldenne, L('if', 'limit = { exists = yes }',
      `recruit_character = ${ch.warden}`,
      `add_country_leader_role = { character = ${ch.warden} promote_leader = yes country_leader = { ideology = ${ch.wardenStance} expire = "2000.1.1.1" traits = { zin_yeldenne_warden_trait } } }`,
      L('if', 'limit = { NOT = { check_variable = { global.zin_glo_state = 2 } } }',
        'if = { limit = { has_idea = zin_regional_yeldenne_glernaens_wards } remove_ideas = zin_regional_yeldenne_glernaens_wards }',
        'if = { limit = { has_idea = zin_regional_yeldenne_glernaens_wards_2 } remove_ideas = zin_regional_yeldenne_glernaens_wards_2 }'))));
  dep('zin_regional_yeldenne_glernaens_wards', 'idea', 'regional yeldenne tree'); dep('zin_regional_yeldenne_glernaens_wards_2', 'idea', 'regional yeldenne tree');
  E('zin_glo_request_northern_watch',
    "# From Yeldenne's focus: the Lost Cause's leader is asked to send a company to the gate.",
    L('every_country', 'limit = { zin_glo_lost_cause_leader = yes }', 'set_variable = { global.zin_glo_watch_sender = THIS }', 'country_event = { id = zin_glo.64 }'));

  // the hall: common effects when Horos dies, the cases and the score test
  E('zin_glo_horos_falls',
    '# Horos is dust. Wardens keep the hall; the guard stands down; the world hears of it.',
    'set_global_flag = zin_horos_dead',
    L('every_country', 'limit = { has_character = zin_horos }', 'retire_character = zin_horos'),
    'zin_yeldenne_install_warden = yes',
    L(TAG.yeldenne, L('if', 'limit = { exists = yes }',
      'if = { limit = { has_idea = zin_yeldenne_guardian_of_glo } remove_ideas = zin_yeldenne_guardian_of_glo }',
      'add_timed_idea = { idea = zin_yeldenne_the_empty_throne days = 365 }')),
    'zin_yeldenne_set_hall_modifier = yes',
    L('every_country', 'limit = { is_ai = no }', 'news_event = { id = zin_glo.30 }'),
    `set_temp_variable = { zin_arg_value = ${K('dark_horos_dies')} }`, 'zin_world_add_gathering_dark = yes');
  dep('zin_horos', 'character', 'characters module (renames the Yeldenne ruler Y8H_zin_ruler to the contract id)');
  E('zin_glo_give_to_heir', 'set_temp_variable = { zin_arg_to = 1 }', 'zin_glo_transfer = yes', 'zin_eindil_fire_bearer_leaves = yes');
  E('zin_glo_hall_holds',
    '# The attacker is repelled: the wards fall by a fifth, the hall is proved, and its owner keeps Horos.',
    `set_temp_variable = { zin_arg_value = -${C.repel_wards_cost} }`, 'zin_yeldenne_add_wards = yes',
    'set_global_flag = zin_horos_endures',
    `set_temp_variable = { zin_arg_value = -${C.dark_hall_holds} }`, 'zin_world_add_gathering_dark = yes');
  E('zin_glo_score',
    '# score = wards + 30 + 10 if forewarned + 10 if unyielding + random(-10..+10) - attacker (zin_arg_case 5: Volgan\'s hunt, else Afrit\'s artifacts); sets global.zin_glo_hall_score.',
    'set_temp_variable = { glo_score = global.zin_yeldenne_wards }',
    `add_to_temp_variable = { glo_score = ${K('hall_base')} }`,
    L('if', 'limit = { has_global_flag = zin_yeldenne_forewarned }', `add_to_temp_variable = { glo_score = ${K('hall_forewarned')} }`),
    L('if', 'limit = { has_global_flag = zin_yeldenne_hall_unyielding }', `add_to_temp_variable = { glo_score = ${K('hall_unyielding')} }`),
    'set_temp_variable_to_random = { var = glo_roll min = -10 max = 11 integer = yes }',
    'add_to_temp_variable = { glo_score = glo_roll }',
    L('if', 'limit = { check_variable = { zin_arg_case = 5 } }', `subtract_from_temp_variable = { glo_score = ${K('volgan_hunt')} }`),
    L('else', 'set_temp_variable = { glo_art = global.zin_afrit_artifacts }', `multiply_temp_variable = { glo_art = ${K('afrit_per_artifact')} }`, 'subtract_from_temp_variable = { glo_score = glo_art }'),
    'set_variable = { global.zin_glo_hall_score = glo_score }');
  dep('zin_afrit_artifacts', 'global variable', 'afrit_hidden_council');
  const outcomeEvents = id => [hallOwner(`country_event = { id = zin_glo.${id} days = 1 }`), toEveryHub(null, `country_event = { id = zin_glo.${id} days = 1 }`)];
  E('zin_glo_show_hall',
    '# The scene in the hall, to its owner and to the party that came (the Worshipdom in cases 1, 2 and 4). The outcome follows a day later.',
    hallOwner('country_event = { id = zin_glo.20 }'),
    toEveryHub('NOT = { check_variable = { global.zin_glo_hall_case = 3 } } NOT = { check_variable = { global.zin_glo_hall_case = 5 } }', 'country_event = { id = zin_glo.20 }'));
  E('zin_glo_resolve_hall',
    "# zin_arg_case: 1 A (Afrit first, then the heir), 2 B1 (two against one), 3 B2 (the willing gift), 4 C (Afrit alone), 5 D (Volgan's hunt).",
    'set_variable = { global.zin_glo_hall_case = zin_arg_case }',
    L('if', 'limit = { check_variable = { zin_arg_case = 1 } }',
      'zin_glo_horos_falls = yes', 'zin_afrit_wound = yes', 'zin_glo_give_to_heir = yes',
      hallOwner('country_event = { id = zin_glo.21 days = 1 }'), 'zin_glo_show_hall = yes'),
    L('else_if', 'limit = { check_variable = { zin_arg_case = 2 } }',
      'zin_glo_horos_falls = yes', 'zin_afrit_wound = yes', 'zin_glo_give_to_heir = yes',
      ...outcomeEvents(23), 'zin_glo_show_hall = yes'),
    L('else_if', 'limit = { check_variable = { zin_arg_case = 3 } }',
      'set_global_flag = zin_glo_heir_in_hall',
      L('if', 'limit = { has_global_flag = zin_yeldenne_awaits_heir }', hallOwner(`country_event = { id = zin_glo.3 days = ${C.test_days_awaits} }`)),
      L('else', hallOwner(`country_event = { id = zin_glo.3 days = ${C.test_days} }`)),
      'zin_glo_show_hall = yes'),
    L('else_if', 'limit = { check_variable = { zin_arg_case = 4 } }',
      'zin_glo_score = yes',
      L('if', `limit = { check_variable = { global.zin_glo_hall_score > ${C.repel_at - 1} } }`,
        'zin_glo_hall_holds = yes', 'zin_afrit_wound = yes', ...outcomeEvents(24)),
      L('else', 'zin_glo_horos_falls = yes', 'set_temp_variable = { zin_arg_to = 3 }', 'zin_glo_transfer = yes', ...outcomeEvents(25)),
      'zin_glo_show_hall = yes'),
    L('else',
      'zin_glo_score = yes',
      L('if', `limit = { check_variable = { global.zin_glo_hall_score > ${C.repel_at - 1} } }`,
        'zin_glo_hall_holds = yes',
        L(TAG.volgan, 'add_timed_idea = { idea = zin_glo_wound_of_yeldenne days = 365 }', 'country_event = { id = zin_glo.24 days = 1 }'),
        hallOwner('country_event = { id = zin_glo.24 days = 1 }')),
      L('else', 'zin_glo_horos_falls = yes', 'set_temp_variable = { zin_arg_to = 3 }', 'zin_glo_transfer = yes',
        L(TAG.volgan, 'country_event = { id = zin_glo.25 days = 1 }'),
        hallOwner('country_event = { id = zin_glo.25 days = 1 }'))),
    'set_temp_variable = { zin_arg_case = 0 }');
  dep('zin_afrit_wound', 'scripted effect', 'afrit_hidden_council');
  dep('zin_eindil_fire_bearer_leaves', 'scripted effect', 'eindil_journey (mech_eindil.mjs)');
  E('zin_glo_hall_historical', '# The journey calls this 14 days after the ambush, when Afrit reached the hall first (case A).', 'set_temp_variable = { zin_arg_case = 1 }', 'zin_glo_resolve_hall = yes');
  E('zin_glo_afrit_strikes',
    "# The Worshipdom's party enters the hall now: alone (case C), or against the heir already inside (case B1).",
    L('if', 'limit = { zin_horos_alive = yes }',
      L('if', 'limit = { has_global_flag = zin_glo_heir_in_hall }', 'set_temp_variable = { zin_arg_case = 2 }', 'clr_global_flag = zin_glo_heir_in_hall'),
      L('else', 'set_temp_variable = { zin_arg_case = 4 }'),
      'zin_glo_resolve_hall = yes'));
  E('zin_glo_heir_arrives',
    '# The journey calls this when Eindil reaches the castle. Sealed Glo opens for him; Horos tests him; dimmed Glo is lost to him.',
    L('if', 'limit = { check_variable = { global.zin_glo_state = 2 } }',
      L('if', 'limit = { has_global_flag = zin_yeldenne_calls_heir }',
        'set_temp_variable = { zin_arg_value = 10 }', 'zin_eindil_add_renown = yes',
        hallOwner('country_event = { id = zin_glo.80 }')),
      L('else', hallOwner(`country_event = { id = zin_glo.80 days = ${C.seal_open_days} }`))),
    L('else_if', 'limit = { check_variable = { global.zin_glo_state = 3 } }', 'set_global_flag = zin_glo_heir_found_dim'),
    L('else_if', 'limit = { zin_horos_alive = yes NOT = { has_global_flag = zin_glo_heir_in_hall } }', 'set_temp_variable = { zin_arg_case = 3 }', 'zin_glo_resolve_hall = yes'));
  dep('zin_eindil_add_renown', 'scripted effect', 'eindil_journey (mech_eindil.mjs)');
  E('zin_glo_second_bearer_claimed',
    "# ROOT is the claimant: the stone judges and the claimant's best marshal carries it.",
    'save_global_event_target_as = zin_glo_claimant',
    'set_temp_variable = { zin_arg_to = 2 }', 'zin_glo_transfer = yes',
    L('every_country', 'limit = { is_ai = no }', 'news_event = { id = zin_glo.70 }'));
  E('zin_glo_dispatch_hunters',
    "# The Worshipdom's hunters sail south; the journey's hunters event reaches the island host in 90 days.",
    L('if', 'limit = { has_variable = global.zin_eindil_wreck_host }', L('var:global.zin_eindil_wreck_host', L('if', 'limit = { exists = yes }', 'country_event = { id = zin_eindil.46 days = 90 }'))));
  dep('zin_eindil.46', 'event', 'events_eindil (06_events/02_eindil_journey.md)');

  // ---------------------------------------------------------------------------------------------- startup
  const startup = [
    'set_variable = { global.zin_glo_state = 0 }',
    'set_variable = { global.zin_glo_power = 0 }',
    `set_variable = { global.zin_glo_power_cap = ${K('power_max')} }`,
    'set_variable = { global.zin_glo_regen_days = 0 }',
    `set_variable = { global.zin_yeldenne_wards = ${K('wards_start')} }`,
    `${TAG.yeldenne} = { country_event = { id = zin_glo.1 days = 2 } }`];

  // ---------------------------------------------------------------------------------------------- events
  const events = [];
  const addEvent = e => { events.push(e); defs.events.push(`zin_glo.${e.id}`); };
  const titleOf = id => { loc.add(`zin_glo.${id}.t`, ev[id].t); return `zin_glo.${id}.t`; };
  const descOf = id => { for (const k of Object.keys(ev[id])) if (k === 'd' || k.startsWith('d_')) loc.add(`zin_glo.${id}.${k}`, ev[id][k]); return `zin_glo.${id}.d`; };
  const opts = (id, spec) => spec.map(([k, effects, ai]) => { loc.add(`zin_glo.${id}.${k}`, ev[id][k]); return { name: `zin_glo.${id}.${k}`, effects, ai }; });
  const shown = (id, picture, extra = {}) => addEvent({ id, title: titleOf(id), desc: extra.desc ?? descOf(id), picture, ...extra });
  const ack = (id, picture, note, extra = {}) => { const { desc, ...rest } = extra; descOf(id); shown(id, picture, { desc, ...rest, options: opts(id, [['a', [`# ${note}`], 100]]) }); };

  addEvent({ id: 1, hidden: true, immediate: [
    '# Yeldenne is a guarded hall: the wards on Mp\'E, the guardian\'s spirit and trait, and the weekly pulse.',
    L(`${HALL}`, 'add_dynamic_modifier = { modifier = zin_yeldenne_hall_wards }'),
    'add_ideas = zin_yeldenne_guardian_of_glo',
    'add_country_leader_trait = zin_horos_guardian',
    hallOwner(`country_event = { id = zin_glo.2 days = ${C.pulse_days} }`)] });
  addEvent({ id: 2, hidden: true, immediate: [
    hallOwner(`country_event = { id = zin_glo.2 days = ${C.pulse_days} }`),
    L('if', 'limit = { zin_horos_alive = yes }', 'zin_glo_hall_wards_tick = yes', 'zin_glo_hall_occupation_tick = yes'),
    'zin_glo_regen_tick = yes', 'zin_glo_sword_check = yes', 'zin_glo_story_check = yes'] });
  addEvent({ id: 3, hidden: true, immediate: [
    '# The test of the willing gift is over: Horos is dust and Glo goes with the heir.',
    L('if', 'limit = { zin_horos_alive = yes has_global_flag = zin_glo_heir_in_hall }',
      'clr_global_flag = zin_glo_heir_in_hall', 'zin_glo_horos_falls = yes', 'zin_glo_give_to_heir = yes',
      hallOwner('country_event = { id = zin_glo.22 }'))] });

  shown(5, EVT('generic_sea'), { trigger: ['zin_afrit_is_hub = yes'], options: opts(5, [
    ['a', ['# The tale is dismissed.'], 70],
    ['b', ['set_global_flag = zin_glo_hunters_sent', 'zin_glo_dispatch_hunters = yes'], ['base = 30', L('modifier', 'factor = 0', 'zin_eindil_historical = yes'), L('modifier', 'factor = 3', 'check_variable = { zin_footholds > 2 }')]]]) });
  dep('zin_eindil_historical', 'scripted trigger', 'eindil_journey (mech_eindil.mjs)');
  shown(11, EVT('cold_shore'), { trigger: ['zin_afrit_is_hub = yes', 'zin_horos_alive = yes'], options: opts(11, [
    ['a', ['# The party lies in wait on the approach.'], ['base = 80', L('modifier', 'factor = 0', 'has_global_flag = zin_afrit_hall_at_once')]],
    ['b', ['zin_glo_afrit_strikes = yes'], ['base = 20', L('modifier', 'factor = 0', 'zin_eindil_historical = yes'), L('modifier', 'factor = 2.5', 'has_global_flag = zin_glo_heir_in_hall')]]]) });
  const hubIf = (c, key) => ({ trigger: ['zin_afrit_is_hub = yes', c], key });
  shown(20, EVT('yeldenne_hall'), { desc: [
    hubIf('check_variable = { global.zin_glo_hall_case = 1 }', 'zin_glo.20.d_hub_a'),
    hubIf('check_variable = { global.zin_glo_hall_case = 2 }', 'zin_glo.20.d_hub_b1'),
    { trigger: ['zin_afrit_is_hub = yes'], key: 'zin_glo.20.d_hub_c' },
    { trigger: ['check_variable = { global.zin_glo_hall_case = 1 }'], key: 'zin_glo.20.d_a' },
    { trigger: ['check_variable = { global.zin_glo_hall_case = 2 }'], key: 'zin_glo.20.d_b1' },
    { trigger: ['check_variable = { global.zin_glo_hall_case = 3 }'], key: 'zin_glo.20.d_b2' },
    { key: 'zin_glo.20.d_c' }], options: opts(20, [['a', ['# The hall answers.'], 100]]) });
  descOf(20);
  ack(21, EVT('glo_given'), 'The hall is empty.');
  ack(22, EVT('glo_given'), 'The hall is empty.');
  shown(23, EVT('glo_given'), { desc: [{ trigger: ['zin_afrit_is_hub = yes'], key: 'zin_glo.23.d_hub' }, { key: 'zin_glo.23.d' }], options: opts(23, [['a', ['# The hall is empty.'], 100]]) }); descOf(23);
  shown(24, EVT('yeldenne_hall'), { desc: [{ trigger: ['zin_afrit_is_hub = yes'], key: 'zin_glo.24.d_hub' }, { trigger: [`original_tag = ${TAG.volgan}`], key: 'zin_glo.24.d_volgan' }, { key: 'zin_glo.24.d' }], options: opts(24, [['a', ['# The north keeps its keeper.'], 100]]) }); descOf(24);
  shown(25, EVT('yeldenne_hall'), { desc: [{ trigger: ['zin_afrit_is_hub = yes'], key: 'zin_glo.25.d_hub' }, { trigger: [`original_tag = ${TAG.volgan}`], key: 'zin_glo.25.d_volgan' }, { key: 'zin_glo.25.d' }], options: opts(25, [['a', ['# The seal holds.'], 100]]) }); descOf(25);
  addNews(30, NEWS('generic_peace'), 'A hard winter for the north.');
  function addNews(id, picture, note) { descOf(id); shown(id, picture, { kind: 'news', options: opts(id, [['a', [`# ${note}`], 100]]) }); }
  ack(40, EVT('ember_lands_storm'), 'Let them ride.');
  shown(41, EVT('ember_lands_storm'), { immediate: ['set_temp_variable = { zin_arg_case = 5 }', 'zin_glo_resolve_hall = yes'], options: opts(41, [['a', ['# Bar the doors.'], 100]]) });
  shown(50, EVT('generic_wilds'), { trigger: ['has_global_flag = zin_glo_defiling'], options: opts(50, [
    ['a', [`country_event = { id = zin_glo.50 days = ${C.defile_roll_days} }`], 85],
    ['b', ['clr_global_flag = zin_glo_defiling', 'set_variable = { global.zin_glo_defile_end = 0 }'], 15]]) });
  addNews(51, NEWS('ember_lands_storm'), 'Let the north mourn.');
  shown(60, EVT('yeldenne_hall'), { trigger: ['zin_horos_alive = yes'], options: opts(60, [
    ['a', ['var:global.zin_glo_watch_sender = { give_guarantee = ROOT add_ideas = zin_glo_northern_watch }', 'set_global_flag = zin_glo_watch_active', `set_temp_variable = { zin_arg_value = ${K('watch_wards')} }`, 'zin_yeldenne_add_wards = yes'], 100],
    ['b', ['# The hall keeps its own doors.'], 0]]) });
  shown(61, EVT('yeldenne_hall'), { desc: [{ trigger: [L('OR', 'has_government = democratic', 'has_government = neutrality', 'has_country_flag = zin_cold_hall_respected')], key: 'zin_glo.61.d' }, { key: 'zin_glo.61.d_rebuked' }],
    options: opts(61, [['a', [
      L('if', 'limit = { OR = { has_government = democratic has_government = neutrality has_country_flag = zin_cold_hall_respected } }', hallOwner('add_opinion_modifier = { target = ROOT modifier = zin_glo_friend_of_the_hall }')),
      L('else', hallOwner('add_opinion_modifier = { target = ROOT modifier = zin_glo_rebuked }'))], 100]]) }); descOf(61);
  dep('zin_cold_hall_respected', 'country flag', 'cold_lands');
  ack(62, EVT('yeldenne_hall'), 'Withdraw.');
  ack(63, EVT('yeldenne_hall'), 'So the north keeps its own king.');
  shown(64, EVT('lost_cause_triumph'), { trigger: ['zin_horos_alive = yes'], options: opts(64, [
    ['a', [`${TAG.yeldenne} = { country_event = { id = zin_glo.60 days = 1 } }`], ['base = 60', L('modifier', 'factor = 0.5', 'has_war = yes'), L('modifier', 'factor = 1.7', 'zin_eindil_historical = yes NOT = { has_war = yes }')]],
    ['b', [`${TAG.yeldenne} = { add_opinion_modifier = { target = ROOT modifier = zin_glo_rebuked } }`], 40]]) });
  addNews(70, NEWS('generic_court'), 'The light is carried.');
  shown(80, EVT('glo_given'), { trigger: ['check_variable = { global.zin_glo_state = 2 }'], options: opts(80, [['a', ['set_temp_variable = { zin_arg_to = 1 }', 'zin_glo_transfer = yes', 'zin_eindil_bearer_effects = yes'], 100]]) });
  dep('zin_eindil_bearer_effects', 'scripted effect', 'eindil_journey (mech_eindil.mjs)');

  for (const e of events) scripts.add(`zin_glo.${e.id}`, 'event', eventLines({ ns: 'zin_glo', ...e }));
  put('events/zin_glo.txt', fileText('add_namespace = zin_glo', ...events.map(e => render(eventLines({ ns: 'zin_glo', ...e })))));

  // ---------------------------------------------------------------------------------------------- decisions
  for (const [k, v] of Object.entries(data.tooltips)) loc.add(k, v);
  const decisions = [];
  const D = (cat, id, ...body) => {
    const d = data.decisions[id];
    if (!d) throw new Error(`No text for decision ${id}`);
    decisions.push({ cat, id, body }); defs.decisions.push(id); loc.add(id, d.name); loc.add(`${id}_desc`, d.desc);
    scripts.add(id, 'decision', L(id, `icon = zin_glo_${d.icon}`, ...body));
  };
  D('zin_glo_seekers', 'zin_glo_petition_horos',
    'allowed = { always = yes }',
    L('visible', 'zin_horos_alive = yes', `NOT = { original_tag = ${TAG.yeldenne} }`, 'NOT = { zin_afrit_is_hub = yes }', 'NOT = { has_country_flag = zin_glo_petitioned }'),
    L('available', 'zin_horos_alive = yes'),
    'cost = 50', 'fire_only_once = yes',
    L('complete_effect', 'set_country_flag = zin_glo_petitioned', `country_event = { id = zin_glo.61 days = ${C.petition_days} }`),
    L('ai_will_do', 'base = 0', L('modifier', 'add = 3', L('OR', `original_tag = ${TAG.coldor}`, `original_tag = ${TAG.isengard}`), 'zin_eindil_historical = no')));
  D('zin_glo_seekers', 'zin_glo_guard_the_hall',
    'allowed = { always = yes }',
    L('visible', 'zin_glo_lost_cause_leader = yes', 'zin_horos_alive = yes', 'NOT = { has_global_flag = zin_glo_watch_active }'),
    L('available', 'zin_horos_alive = yes', 'NOT = { has_war = yes }'),
    'cost = 100', 'days_re_enable = 180',
    L('complete_effect', 'set_variable = { global.zin_glo_watch_sender = THIS }', `${TAG.yeldenne} = { country_event = { id = zin_glo.60 } }`),
    L('ai_will_do', 'base = 0', L('modifier', 'add = 3', 'zin_eindil_historical = no', 'NOT = { has_global_flag = zin_golden_king_dead }', 'NOT = { has_war = yes }')));
  D('zin_glo_seekers', 'zin_glo_grave_hunt',
    'allowed = { always = yes }',
    L('visible', 'zin_glo_hunt_possible = yes'),
    L('available', 'zin_glo_hunt_possible = yes'),
    'cost = 150', 'fire_only_once = yes',
    L('complete_effect', 'set_country_flag = zin_glo_hunt_sent', 'country_event = { id = zin_glo.40 }', hallOwner(`country_event = { id = zin_glo.41 days = ${C.grave_hunt_days} }`)),
    L('ai_will_do', 'base = 0', L('modifier', 'add = 3', 'zin_eindil_historical = no', 'check_variable = { global.zin_eindil_stage > 5 }')));
  D('zin_glo_seekers', 'zin_glo_enter_the_hall',
    'allowed = { always = yes }',
    L('visible', 'zin_afrit_is_hub = yes', 'zin_horos_alive = yes', 'has_global_flag = zin_afrit_at_yeldenne'),
    L('available', 'zin_horos_alive = yes', 'has_global_flag = zin_afrit_at_yeldenne'),
    'days_re_enable = 365',
    L('complete_effect', 'zin_glo_afrit_strikes = yes'),
    L('ai_will_do', 'base = 0', L('modifier', 'add = 4', 'zin_eindil_historical = no', 'has_global_flag = zin_glo_heir_in_hall'), L('modifier', 'add = 2', 'zin_eindil_historical = no', 'check_variable = { global.zin_eindil_stage > 6 }')));
  D('zin_glo_seekers', 'zin_glo_defile_seal',
    'allowed = { always = yes }',
    L('visible', 'zin_glo_dark_power = yes', 'check_variable = { global.zin_glo_state = 2 }'),
    L('available', 'zin_glo_dark_power = yes', 'check_variable = { global.zin_glo_state = 2 }', `controls_state = ${HALL}`, 'NOT = { has_global_flag = zin_glo_defiling }'),
    'cost = 200', 'days_remove = -1',
    L('complete_effect', 'set_global_flag = zin_glo_defiling', 'set_variable = { global.zin_glo_defiler = THIS }',
      'set_variable = { global.zin_glo_defile_end = global.num_days }',
      L('if', 'limit = { has_global_flag = zin_yeldenne_seal_warded }', `add_to_variable = { global.zin_glo_defile_end = ${K('defile_days_warded')} }`),
      L('else', `add_to_variable = { global.zin_glo_defile_end = ${K('defile_days')} }`),
      `country_event = { id = zin_glo.50 days = ${C.defile_roll_days} }`),
    L('cancel_trigger', L('OR', `NOT = { controls_state = ${HALL} }`, 'NOT = { has_global_flag = zin_glo_defiling }')),
    L('cancel_effect', 'clr_global_flag = zin_glo_defiling', 'set_variable = { global.zin_glo_defile_end = 0 }'),
    L('remove_trigger', 'has_global_flag = zin_glo_dimmed'),
    L('ai_will_do', 'base = 0', L('modifier', 'add = 3', 'zin_eindil_historical = no')));
  const bearerAvail = L('available', 'has_global_flag = zin_eindil_lost', 'zin_glo_worthy_claimant = yes', L('OR', 'check_variable = { global.zin_glo_state = 0 }', 'check_variable = { global.zin_glo_state = 2 }'));
  const bearerTail = ['days_remove = 180', L('remove_effect', 'zin_glo_second_bearer_claimed = yes'), L('ai_will_do', 'base = 0', L('modifier', 'add = 3', 'zin_eindil_historical = no'))];
  const bearerVisible = (flag) => L('visible', 'has_global_flag = zin_eindil_lost', flag, L('OR', 'check_variable = { global.zin_glo_state = 0 }', 'check_variable = { global.zin_glo_state = 2 }'));
  D('zin_glo_seekers', 'zin_glo_seek_as_bearer', 'allowed = { always = yes }', bearerVisible('NOT = { has_global_flag = zin_yeldenne_calls_bearer }'), bearerAvail, 'cost = 100', ...bearerTail);
  D('zin_glo_seekers', 'zin_glo_seek_as_bearer_called', 'allowed = { always = yes }', bearerVisible('has_global_flag = zin_yeldenne_calls_bearer'), bearerAvail, 'cost = 0', ...bearerTail);
  D('zin_glo_cat_bearer', 'zin_glo_wave_decision',
    'allowed = { always = yes }',
    L('visible', 'zin_glo_is_bearer_host = yes'),
    L('available', 'zin_glo_is_bearer_host = yes',
      `custom_trigger_tooltip = { tooltip = zin_glo_tt_power check_variable = { global.zin_glo_power > ${C.wave_cost - 1} } }`,
      'custom_trigger_tooltip = { tooltip = zin_glo_tt_bearer_near has_global_flag = zin_glo_wave_ready }'),
    'days_re_enable = 60', 'fixed_random_seed = no',
    L('complete_effect', 'custom_effect_tooltip = zin_glo_tt_cost_power', 'zin_glo_wave_decided = yes'),
    L('ai_will_do', 'base = 100'));
  const cats = {};
  for (const d of decisions) (cats[d.cat] ??= []).push(d);
  for (const c of data.categories) { loc.add(c.id, c.name); loc.add(`${c.id}_desc`, c.desc); defs.categories.push(c.id); }
  put('common/decisions/categories/zin_glo.txt', fileText(...data.categories.map(c => render(L(c.id, 'allowed = { always = yes }', `icon = zin_${c.icon}`, 'priority = 5')))));
  put('common/decisions/zin_glo.txt', fileText(...Object.entries(cats).map(([c, ds]) => render(L(c, ...ds.map(d => L(d.id, `icon = zin_glo_${data.decisions[d.id].icon}`, ...d.body)))))));

  // ---------------------------------------------------------------------------------------------- triggers and effects files
  put('common/scripted_triggers/zin_glo.txt', fileText(comment('Triggers of the Yeldenne and Glo mechanic.'), ...triggerDefs.map(d => render(L(d.name, ...d.body)))));
  put('common/scripted_effects/zin_glo.txt', fileText(comment('Effects of the Yeldenne and Glo mechanic. Arguments are temporary variables zin_arg_<name> set just before the call (E1).'), ...effectDefs.map(d => render(L(d.name, ...d.body)))));

  // ---------------------------------------------------------------------------------------------- on actions and AI
  const notAllowedTargets = `NOT = { OR = { original_tag = ${TAG.zol} original_tag = ${TAG.volgan} is_subject_of = ${TAG.zol} is_subject_of = ${TAG.volgan} AND = { has_global_flag = zin_afrit_revealed OR = { zin_afrit_is_hub = yes zin_afrit_rules_here = yes } } } }`;
  put('common/on_actions/zin_glo.txt', fileText(render(L('on_actions',
    L('on_startup', L('effect', ...startup)),
    L('on_state_control_changed', L('effect',
      L('if', `limit = { FROM.FROM = { state = ${HALL} } }`,
        L('FROM.FROM', 'set_variable = { zin_glo_occupied_since = global.num_days }', L('if', 'limit = { is_controlled_by = OWNER }', 'clear_variable = zin_glo_occupied_since'))))),
    L('on_annex', L('effect', L('if', `limit = { FROM = { original_tag = ${TAG.yeldenne} } zin_horos_alive = yes }`, 'country_event = { id = zin_glo.63 }'))),
    L('on_declare_war', L('effect', L('if', `limit = { NOT = { has_country_flag = zin_glo_conqueror } FROM = { ${notAllowedTargets} } }`, 'set_country_flag = zin_glo_conqueror')))))));
  scripts.add('on_actions', 'on_action', [...startup, `if = { limit = { FROM.FROM = { state = ${HALL} } } FROM.FROM = { set_variable = { zin_glo_occupied_since = global.num_days } } }`, `if = { limit = { NOT = { has_country_flag = zin_glo_conqueror } FROM = { ${notAllowedTargets} } } set_country_flag = zin_glo_conqueror }`]);
  put('common/ai_strategy/zin_glo.txt', fileText(comment('Nobody takes the hall by conquest while Horos lives: every AI realm gives Yeldenne a wide berth until he is dust.'),
    render(L('zin_glo_leave_the_hall_alone', 'allowed = { always = yes }', L('enable', 'is_ai = yes', `NOT = { original_tag = ${TAG.yeldenne} }`, 'zin_horos_alive = yes'), 'abort_when_not_enabled = yes',
      L('ai_strategy', 'type = conquer', `id = "${TAG.yeldenne}"`, 'value = -500')))));

  // ---------------------------------------------------------------------------------------------- interface
  const sprites = [];
  const seen = new Set();
  const addSprite = (name, tex) => { if (seen.has(name)) return; seen.add(name); sprites.push(`\tspriteType = {\n\t\tname = "${name}"\n\t\ttexturefile = "gfx/interface/ideas/zin/${tex}.dds"\n\t}`); };
  for (const d of Object.values(data.decisions)) addSprite(`GFX_decision_zin_glo_${d.icon}`, d.icon);
  for (const c of data.categories) addSprite(`GFX_decision_category_zin_${c.icon}`, c.icon);
  put('interface/zin_glo.gfx', `spriteTypes = {\n${sprites.join('\n')}\n}\n`);
  staged.loc('zin_glo', loc.entries);
  files.push('localisation/english/zin_glo_l_english.yml');

  return {
    counts: { events: defs.events.length, effects: defs.effects.length, triggers: defs.triggers.length, ideas: defs.ideas.length, decisions: defs.decisions.length, categories: defs.categories.length, traits: defs.traits.length, files: files.length, loc: Object.keys(loc.entries).length },
    definitions: defs, scripts: scripts.items, dependencies: [...scripts.depends.values()].sort((a, b) => a.name.localeCompare(b.name)), files: files.sort(), localisation: loc.entries, startup, tags: TAG, hallState: HALL,
  };
}
