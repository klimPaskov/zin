// The scripts of Eindil's journey (triggers, effects, decisions, startup, AI strategies), kept apart from the module that stages them.
// Spec: docs/specs/04_mechanics/eindil_journey.md. Every number comes from tools/content/data/mech_journey_eindil.json (constants, stages).
// Scope convention: an effect acts on the scope it is called in (THIS); where the spec says ROOT it means the country the caller scoped into.
import { L, dateAfter, paceOr, paceChoose, shiftedDays } from '../lib/mech_journey_lib.mjs';

export function eindilScripts({ data, TAG, C, floors, roster, dep }) {
  const ch = data.characters;
  const K = k => { if (!(k in C)) throw new Error(`Unknown journey constant ${k}`); return `constant:zin_eindil.${k}`; };
  const triggers = [], effects = [], decisions = [], firedEvents = new Set();
  const T = (name, ...body) => { triggers.push({ name, body }); };
  const E = (name, ...body) => { effects.push({ name, body }); };
  const stage = n => `check_variable = { global.zin_eindil_stage = ${n} }`;
  const stageGe = n => `check_variable = { global.zin_eindil_stage > ${n - 1} }`;
  const stageLt = n => `check_variable = { global.zin_eindil_stage < ${n} }`;
  const stageAge = (cmp, n) => `check_variable = { global.zin_eindil_stage_age ${cmp} ${n} }`;
  const gflag = f => `has_global_flag = ${f}`;
  const notFlag = f => `NOT = { has_global_flag = ${f} }`;
  // A focus sets a country flag on its own tree's country; the journey reads it wherever it is (SL-20).
  const countryFlagAnywhere = f => `any_country = { has_country_flag = ${f} }`;
  const ev = id => { firedEvents.add(`zin_eindil.${id}`); return `zin_eindil.${id}`; };
  // fire an event to the country stored in a global variable, if it still exists
  const fireVar = (varName, id, days) => L('if', `limit = { has_variable = global.${varName} }`, L(`var:global.${varName}`, L('if', 'limit = { exists = yes }', `country_event = { id = ${ev(id)}${days ? ` days = ${days}` : ''} }`)));
  const fireHost = (id, days) => fireVar('zin_eindil_host', id, days);
  const newsAll = id => L('every_country', 'limit = { is_ai = no }', `news_event = { id = ${ev(id)} }`);
  const T_ = TAG;
  const westFlag = 'has_country_flag = zin_region_west_lands';
  const portraitOf = state => data.portraits?.[state] ?? ch.portrait;
  const setVar = (name, value) => `set_variable = { ${name} = ${value} }`;

  // ============================================================================================ date triggers
  // Floor dates the pulse reads besides the stage floors, each through the story pace (R2): zin_eindil_date_<yyyy>_<mm>.
  const dates = ['1750.9.1', '1755.3.1', '1757.6.1', '1757.7.1', '1757.8.1', '1757.12.1', '1758.3.1', '1758.9.1', '1759.3.1'];
  for (const d of dates) { const [y, m] = d.split('.'); T(`zin_eindil_date_${y}_${String(m).padStart(2, '0')}`, dateAfter(d)); }
  const dateT = d => { const [y, m] = d.split('.'); return `zin_eindil_date_${y}_${String(m).padStart(2, '0')} = yes`; };

  // ============================================================================================ triggers
  T('zin_eindil_has_host', 'has_variable = global.zin_eindil_host', L('var:global.zin_eindil_host', 'exists = yes'));
  T('zin_eindil_is_host', 'has_variable = global.zin_eindil_host', L('var:global.zin_eindil_host', 'tag = PREV'));
  T('zin_eindil_friend', `check_variable = { zin_eindil_regard > ${C.friend_regard - 1} }`);
  T('zin_eindil_resents', `check_variable = { zin_eindil_regard < -${C.friend_regard - 1} }`);
  for (const n of ['zin_rules_is_historical', 'zin_rules_is_free']) dep(n, 'scripted trigger', 'foundation rules (05_defines_and_rules.md, rules.mjs)');
  // The journey rule through its generated wrapper (SL-30): HISTORICAL, or DEFAULT under the historical path.
  dep('zin_rules_ai_branch_eindil_historical', 'scripted trigger', 'foundation rules (rules.mjs)');
  T('zin_eindil_historical', 'zin_rules_ai_branch_eindil_historical = yes');
  T('zin_eindil_can_lead', 'has_character = zin_eindil', L('zin_eindil', 'NOT = { has_trait = zin_eindil_struck_down }', 'NOT = { has_trait = zin_eindil_grievously_wounded }'),
    L('OR', notFlag('zin_eindil_cast_down'), gflag('zin_eindil_recovered')));
  // State scope: Eindil's headquarters stand in this state or in one next to it.
  T('zin_eindil_army_near', L('OR', 'zin_eindil = { is_in_state = PREV }', L('any_neighbor_state', 'zin_eindil = { is_in_state = PREV }')));
  T('zin_eindil_coalition_ally', L('OR', 'zin_eindil_is_host = yes', 'has_country_flag = zin_eindil_coalition_member'));
  T('zin_eindil_zol_in_field', gflag('zin_zol_rising'), L(T_.zol, 'exists = yes', L('any_enemy_country', 'zin_eindil_coalition_ally = yes')));
  T('zin_eindil_war_with_host', 'zin_eindil_has_host = yes', L('var:global.zin_eindil_host', 'has_war_with = PREV'));
  // A host that starts an offensive war loses the guest, unless the foe is one of the dark powers (a border war is no war).
  T('zin_eindil_host_offends', 'has_offensive_war = yes',
    L('any_enemy_country', L('NOT', L('OR', `original_tag = ${T_.zol}`, `original_tag = ${T_.volgan}`, `is_subject_of = ${T_.zol}`, `is_subject_of = ${T_.volgan}`,
      L('AND', gflag('zin_afrit_revealed'), L('OR', 'zin_afrit_is_hub = yes', 'zin_afrit_rules_here = yes'))))));
  for (const n of ['zin_afrit_is_hub', 'zin_afrit_rules_here']) dep(n, 'scripted trigger', 'afrit_hidden_council');
  T('zin_eindil_afrit_foes_exist', L('any_country', L('OR', 'zin_afrit_is_hub = yes', 'zin_afrit_rules_here = yes'), 'exists = yes'));
  T('zin_eindil_hold_over', 'check_variable = { global.zin_eindil_clock > global.zin_eindil_hold_until }');

  // The floor of the stage about to start: three story-pace date sets (day offsets from the start date; the delay is already in the age).
  const floorTest = f => paceOr(p => `check_variable = { global.zin_eindil_age > ${shiftedDays(f.date, p.value)} }`);
  T('zin_eindil_floor_reached', L('OR',
    L('AND', stage(0), 'check_variable = { global.zin_eindil_age > global.zin_eindil_wake_age }'),
    ...floors.filter(f => f.n > 1).map(f => L('AND', f.n === 12 ? L('OR', stage(9), stage(10), stage(11)) : f.n === 11 ? L('OR', stage(9), stage(10)) : stage(f.n - 1), floorTest(f)))));
  const palaceReady = [notFlag('zin_afrit_dead'), L('OR', gflag('zin_afrit_claims_aoaz'), gflag('zin_afrit_stand_in_parim'))];
  // ready_n: stage n may start now.
  const ready = {
    1: [stage(0), 'zin_eindil_floor_reached = yes'],
    2: [stage(1), 'zin_eindil_floor_reached = yes', stageAge('>', C.stage2_after - 1), 'zin_eindil_hold_over = yes'],
    3: [stage(2), 'zin_eindil_floor_reached = yes', stageAge('>', C.stage3_after - 1), 'zin_eindil_hold_over = yes'],
    4: [stage(3), 'zin_eindil_floor_reached = yes', L('OR', gflag('zin_eindil_stage_3_done'), gflag('zin_eindil_war_king'), stageAge('>', C.stage4_fallback - 1)), 'zin_eindil_hold_over = yes'],
    5: [stage(4), 'zin_eindil_floor_reached = yes', stageAge('>', C.stage5_after - 1), 'zin_eindil_hold_over = yes'],
    6: [stage(5), 'zin_eindil_floor_reached = yes', gflag('zin_eindil_named'), 'check_variable = { global.zin_eindil_named_since > 0 }', `check_variable = { global.zin_eindil_named_age > ${C.stage6_after_named - 1} }`, 'zin_eindil_hold_over = yes'],
    7: [stage(6), 'zin_eindil_floor_reached = yes', L('OR', stageAge('>', C.voyage_days - 1), L('AND', countryFlagAnywhere('zin_gala_great_ship'), stageAge('>', C.voyage_days_great_ship - 1))), 'zin_eindil_hold_over = yes'],
    8: [stage(7), 'zin_eindil_floor_reached = yes', L('OR', L('AND', 'check_variable = { global.zin_eindil_hall_done_since > 0 }', `check_variable = { global.zin_eindil_hall_age > ${C.hall_travel_days - 1} }`), stageAge('>', C.stage8_fallback - 1)), 'zin_eindil_hold_over = yes'],
    9: [stage(8), 'zin_eindil_floor_reached = yes', L('OR', L('AND', gflag('zin_war_of_last_crowns'), gflag('zin_eindil_dragon_pact')), 'zin_eindil_date_1758_03 = yes'), 'zin_eindil_hold_over = yes'],
    10: [stage(9), gflag('zin_eindil_cast_down')],
    11: [L('OR', stage(10), L('AND', stage(9), gflag('zin_eindil_stage_9_done'), notFlag('zin_eindil_cast_down'), notFlag('zin_afrit_returned'))), 'zin_eindil_floor_reached = yes', gflag('zin_eindil_recovered'), L('OR', 'zin_afrit_holds_parim = yes', gflag('zin_afrit_stand_in_parim')), ...palaceReady],
    12: [L('OR', stage(9), stage(10), stage(11)), 'zin_eindil_floor_reached = yes', L('OR', gflag('zin_eindil_stage_9_done'), stage(10), stage(11)), L('OR', gflag('zin_afrit_dead'), 'NOT = { zin_eindil_afrit_foes_exist = yes }', 'zin_afrit_reduced = yes')],
  };
  for (const n of Object.keys(ready)) T(`zin_eindil_ready_${n}`, ...ready[n]);
  T('zin_eindil_next_stage_ready', L('OR', ...Object.keys(ready).map(n => `zin_eindil_ready_${n} = yes`)));

  // ============================================================================================ measures
  E('zin_eindil_add_renown',
    'add_to_variable = { global.zin_eindil_renown = zin_arg_value }',
    'clamp_variable = { var = global.zin_eindil_renown min = 0 max = 100 }',
    'set_temp_variable = { zin_arg_value = 0 }');
  E('zin_eindil_add_delay',
    'add_to_variable = { global.zin_eindil_delay = zin_arg_value }',
    `set_temp_variable = { eind_delay_max = ${K('delay_max')} }`,
    'clamp_variable = { var = global.zin_eindil_delay min = 0 max = eind_delay_max }',
    'set_temp_variable = { zin_arg_value = 0 }');
  // Unguarded: has_opinion_modifier takes only a modifier name (no target block), and removing a modifier the country lacks does nothing.
  const dropOpinion = m => `remove_opinion_modifier = { target = event_target:zin_eindil_host_target modifier = ${m} }`;
  E('zin_eindil_regard_opinion',
    "# This country's opinion of the Host (once it exists) follows its regard: remembered at 25 and above, wronged at -25 and below.",
    L('if', `limit = { ${stageGe(9)} zin_eindil_has_host = yes }`,
      L('var:global.zin_eindil_host', 'save_event_target_as = zin_eindil_host_target'),
      L('if', 'limit = { zin_eindil_friend = yes }', 'add_opinion_modifier = { target = event_target:zin_eindil_host_target modifier = zin_eindil_remembered }', dropOpinion('zin_eindil_wronged')),
      L('else_if', 'limit = { zin_eindil_resents = yes }', 'add_opinion_modifier = { target = event_target:zin_eindil_host_target modifier = zin_eindil_wronged }', dropOpinion('zin_eindil_remembered')),
      L('else', dropOpinion('zin_eindil_remembered'), dropOpinion('zin_eindil_wronged'))));
  E('zin_eindil_add_regard',
    "# Adds zin_arg_value to Eindil's regard for this country, clamps -100 to 100, and settles the opinion modifiers once the Host exists.",
    'add_to_variable = { zin_eindil_regard = zin_arg_value }',
    'clamp_variable = { var = zin_eindil_regard min = -100 max = 100 }',
    'set_temp_variable = { zin_arg_value = 0 }',
    'zin_eindil_regard_opinion = yes');
  E('zin_eindil_apply_opinions',
    '# The Host exists or the crown is offered: every friend and every resentful realm takes its opinion modifier toward the Host or the crowned realm.',
    L('every_country', 'limit = { OR = { zin_eindil_friend = yes zin_eindil_resents = yes } }', 'zin_eindil_regard_opinion = yes'));

  // ============================================================================================ setup, clock, pulse
  const wakeSets = rule => paceChoose(p => setVar('global.zin_eindil_wake_age', shiftedDays(rule, p.value)));
  E('zin_eindil_setup',
    '# Journey setup: the start values, the waking floor by rule and story pace, and the 0 to 20 day jitter of stage 1.',
    setVar('global.zin_eindil_stage', 0), setVar('global.zin_eindil_renown', 0), setVar('global.zin_eindil_delay', 0), setVar('global.zin_eindil_since', 0), setVar('global.zin_eindil_hold_until', 0),
    L('if', 'limit = { has_game_rule = { rule = zin_rule_eindil_waking option = EARLY } }', ...wakeSets('1748.6.1')),
    L('else_if', 'limit = { has_game_rule = { rule = zin_rule_eindil_waking option = LATE } }', ...wakeSets('1751.2.1')),
    L('else', ...wakeSets('1749.2.1')),
    `set_temp_variable_to_random = { var = eind_jitter min = 0 max = ${C.wake_jitter} integer = yes }`,
    'add_to_variable = { global.zin_eindil_wake_age = eind_jitter }');
  dep('zin_rule_eindil_waking', 'game rule', 'foundation rules (rules.mjs)');
  E('zin_eindil_update_clock',
    'set_variable = { global.zin_eindil_clock = global.num_days }',
    'subtract_from_variable = { global.zin_eindil_clock = global.zin_eindil_day0 }',
    'set_variable = { global.zin_eindil_age = global.zin_eindil_clock }',
    'subtract_from_variable = { global.zin_eindil_age = global.zin_eindil_delay }',
    'set_variable = { global.zin_eindil_stage_age = global.zin_eindil_clock }',
    'subtract_from_variable = { global.zin_eindil_stage_age = global.zin_eindil_since }',
    L('if', 'limit = { check_variable = { global.zin_eindil_named_since > 0 } }', 'set_variable = { global.zin_eindil_named_age = global.zin_eindil_clock }', 'subtract_from_variable = { global.zin_eindil_named_age = global.zin_eindil_named_since }'),
    L('if', 'limit = { check_variable = { global.zin_eindil_hall_done_since > 0 } }', 'set_variable = { global.zin_eindil_hall_age = global.zin_eindil_clock }', 'subtract_from_variable = { global.zin_eindil_hall_age = global.zin_eindil_hall_done_since }'));
  // The anchor country carries the pulse: the host, else the Gala Elves, else the Magical Forest, Selen, Aenor.
  const pulseTo = tag => L(tag, `country_event = { id = ${ev(2)} days = ${C.pulse_days} }`);
  E('zin_eindil_arm_pulse',
    L('if', 'limit = { zin_eindil_has_host = yes }', L('var:global.zin_eindil_host', `country_event = { id = ${ev(2)} days = ${C.pulse_days} }`)),
    L('else_if', `limit = { ${T_.galaElves} = { exists = yes } }`, pulseTo(T_.galaElves)),
    L('else_if', `limit = { ${T_.magicalForest} = { exists = yes } }`, pulseTo(T_.magicalForest)),
    L('else_if', `limit = { ${T_.selen} = { exists = yes } }`, pulseTo(T_.selen)),
    L('else', pulseTo(T_.aenor)));
  E('zin_eindil_pulse',
    'zin_eindil_update_clock = yes', 'zin_eindil_flag_watch = yes', 'zin_eindil_guest_rules = yes', 'zin_eindil_stage_runner = yes', 'zin_eindil_check_advance = yes');
  E('zin_eindil_flag_watch',
    '# Flags that events set and this system must notice: the war-king (layouts, stage 3), the naming (the stage-6 clock), the hall (the travel clock), the restoration (portrait).',
    L('if', `limit = { ${gflag('zin_eindil_war_king')} ${notFlag('zin_eindil_war_king_seen')} }`, 'set_global_flag = zin_eindil_war_king_seen', 'set_global_flag = zin_eindil_stage_3_done', 'zin_eindil_refresh_layouts = yes', 'zin_eindil_refresh_portrait = yes'),
    L('if', `limit = { ${gflag('zin_eindil_named')} check_variable = { global.zin_eindil_named_since = 0 } }`, 'set_variable = { global.zin_eindil_named_since = global.zin_eindil_clock }', 'zin_eindil_refresh_portrait = yes'),
    L('if', `limit = { ${stage(7)} check_variable = { global.zin_eindil_hall_done_since = 0 } OR = { ${gflag('zin_glo_with_eindil')} ${gflag('zin_glo_dimmed')} } }`, 'set_variable = { global.zin_eindil_hall_done_since = global.zin_eindil_clock }'),
    L('if', `limit = { ${gflag('zin_eindil_restored')} ${notFlag('zin_eindil_restored_seen')} }`, 'set_global_flag = zin_eindil_restored_seen', 'zin_eindil_refresh_portrait = yes'));
  E('zin_eindil_guest_rules',
    "# A host that starts an offensive war loses its guest within a pulse: he leaves, the delay grows by 30 days and the host's regard falls.",
    L('if', `limit = { ${stageGe(1)} ${stageLt(9)} zin_eindil_has_host = yes }`,
      L('var:global.zin_eindil_host', L('if', 'limit = { zin_eindil_host_offends = yes }', 'zin_eindil_guest_offence = yes'))));
  E('zin_eindil_guest_offence',
    '# The scope is the host that took up an offensive war.',
    `set_temp_variable = { zin_arg_value = ${C.guest_offence_delay} }`, 'zin_eindil_add_delay = yes',
    `set_temp_variable = { zin_arg_value = ${C.guest_offence_regard} }`, 'zin_eindil_add_regard = yes',
    'zin_eindil_clear_host = yes');
  E('zin_eindil_hold_guest',
    '# zin_arg_days: the host keeps the guest this long (a bound or detained guest); the stages cannot start before the hold is over.',
    'set_variable = { global.zin_eindil_hold_until = global.zin_eindil_clock }', 'add_to_variable = { global.zin_eindil_hold_until = zin_arg_days }', 'set_temp_variable = { zin_arg_days = 0 }');
  E('zin_eindil_check_advance',
    '# The highest stage that is ready starts (skips jump over a stage whose antagonist is gone).',
    ...[12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n, i) => L(i === 0 ? 'if' : 'else_if', `limit = { zin_eindil_ready_${n} = yes }`, `set_temp_variable = { zin_arg_to = ${n} }`, 'zin_eindil_advance_stage = yes')));

  // ============================================================================================ hosts and the character
  E('zin_eindil_release_character',
    '# The scope is a host that lets the guest go.',
    'retire_character = zin_eindil',
    L('if', 'limit = { check_variable = { global.zin_glo_state = 1 } }', 'clr_country_flag = zin_potent_magic'),
    'if = { limit = { has_idea = zin_eindil_stranger_among_us } remove_ideas = zin_eindil_stranger_among_us }',
    'if = { limit = { has_idea = zin_eindil_restless_guest } remove_ideas = zin_eindil_restless_guest }');
  E('zin_eindil_clear_host',
    '# He is at sea, or between hosts: the host (if any) lets him go and the host variable is cleared.',
    L('if', 'limit = { zin_eindil_has_host = yes }', L('var:global.zin_eindil_host', 'zin_eindil_release_character = yes')),
    'clear_variable = global.zin_eindil_host');
  E('zin_eindil_set_host',
    '# The scope becomes his host. zin_arg_role: 0 or 1 corps commander, 2 field marshal, 3 advisor "Guest of Lorien", 4 no role.',
    L('if', 'limit = { zin_eindil_has_host = yes }',
      L('var:global.zin_eindil_host',
        L('if', 'limit = { NOT = { tag = PREV } }', 'zin_eindil_release_character = yes'),
        L('else', 'retire_character = zin_eindil'))),
    'set_variable = { global.zin_eindil_host = THIS }',
    'recruit_character = zin_eindil',
    L('if', 'limit = { check_variable = { zin_arg_role = 2 } }',
      'add_field_marshal_role = { character = zin_eindil skill = 5 attack_skill = 5 defense_skill = 4 planning_skill = 4 logistics_skill = 3 traits = { zin_eindil_man_from_the_ice } }'),
    L('else_if', 'limit = { check_variable = { zin_arg_role = 3 } }',
      'add_advisor_role = { character = zin_eindil advisor = { slot = political_advisor cost = 0 idea_token = zin_eindil_guest_of_lorien traits = { zin_eindil_guest_trait } } activate = yes }'),
    L('else_if', 'limit = { check_variable = { zin_arg_role = 4 } }'),
    L('else', 'add_corps_commander_role = { character = zin_eindil skill = 4 attack_skill = 4 defense_skill = 4 planning_skill = 3 logistics_skill = 3 traits = { zin_eindil_man_from_the_ice } }'),
    L('if', 'limit = { NOT = { check_variable = { zin_arg_role = 3 } } NOT = { check_variable = { zin_arg_role = 4 } } }',
      L('zin_eindil',
        L('if', `limit = { ${gflag('zin_eindil_war_king')} }`, 'add_unit_leader_trait = zin_eindil_war_king'),
        L('if', `limit = { ${gflag('zin_eindil_named')} }`, 'add_unit_leader_trait = zin_eindil_heir_of_aen'),
        L('if', 'limit = { check_variable = { global.zin_glo_state = 1 } }', 'add_unit_leader_trait = zin_eindil_bearer_of_glo'),
        L('if', `limit = { ${gflag('zin_eindil_restored')} }`, 'add_unit_leader_trait = zin_eindil_blessed_of_the_new_gods'),
        L('if', `limit = { ${gflag('zin_eindil_recovered')} ${gflag('zin_eindil_cast_down')} }`, 'add_unit_leader_trait = zin_eindil_maimed_unbroken'))),
    L('if', 'limit = { check_variable = { global.zin_glo_state = 1 } }', 'set_country_flag = zin_potent_magic'),
    'zin_glo_follow_bearer = yes',
    'zin_eindil_refresh_portrait = yes',
    'set_temp_variable = { zin_arg_role = 0 }');
  dep('zin_potent_magic', 'country flag', 'magic and world systems (04_magic_and_world_systems.md)');
  dep('zin_glo_follow_bearer', 'scripted effect', 'yeldenne_and_glo (mech_yeldenne.mjs)');
  const portrait = state => `set_portraits = { character = zin_eindil civilian = { large = ${portraitOf(state)} } army = { large = ${portraitOf(state)} } }`;
  E('zin_eindil_refresh_portrait',
    '# The seven portrait states E1 to E7 follow the story flags; until the art pipeline draws them each is the generic man (data: portraits).',
    L('if', `limit = { ${gflag('zin_eindil_crowned')} }`, portrait('E7')),
    L('else_if', `limit = { ${gflag('zin_eindil_recovered')} ${gflag('zin_eindil_cast_down')} }`, portrait('E6')),
    L('else_if', `limit = { ${gflag('zin_eindil_restored')} }`, portrait('E5')),
    L('else_if', 'limit = { check_variable = { global.zin_glo_state = 1 } }', portrait('E4')),
    L('else_if', `limit = { ${gflag('zin_eindil_named')} }`, portrait('E3')),
    L('else_if', `limit = { ${gflag('zin_eindil_war_king')} }`, portrait('E2')),
    L('else', portrait('E1')));
  E('zin_eindil_name_him',
    "# Lorien's naming (journey event .52 calls this; the pulse calls it when the Gala court has stalled for 400 days).",
    L('if', `limit = { ${notFlag('zin_eindil_named')} }`,
      'set_global_flag = zin_eindil_named', 'set_character_name = { character = zin_eindil name = zin_eindil_name_named }',
      L('zin_eindil', 'add_unit_leader_trait = zin_eindil_heir_of_aen'), 'zin_eindil_refresh_portrait = yes'));
  E('zin_eindil_refresh_layouts',
    '# E4: story setters that change what the trees show refresh the layouts of the countries whose trees read them.',
    L('every_country', 'limit = { OR = { has_country_flag = zin_region_cold_lands has_country_flag = zin_region_west_lands has_country_flag = zin_region_islands_of_the_south has_country_flag = zin_region_tritons_islands } }', 'mark_focus_tree_layout_dirty = yes'));
  E('zin_eindil_bearer_effects',
    '# Glo is with him (journey event .73, or the seal opens: zin_glo.80): the trait, the renown, the portrait, and word to Gala.',
    L('zin_eindil', 'add_unit_leader_trait = zin_eindil_bearer_of_glo'),
    'set_temp_variable = { zin_arg_value = 10 }', 'zin_eindil_add_renown = yes',
    'zin_eindil_refresh_portrait = yes',
    fireVar('zin_eindil_gala_host', 163, 90));
  E('zin_eindil_fire_bearer_leaves',
    'Glo passes to Eindil in the hall: The Bearer Leaves Yeldenne goes to his host, or at sea to Gala as witness (journey event .73).'.replace(/^/, '# '),
    L('if', 'limit = { zin_eindil_has_host = yes }', fireHost(73, 3)),
    L('else', fireVar('zin_eindil_gala_host', 73, 3)));
  E('zin_eindil_lose_heir',
    "# The heir is out of the story (divergence only): the flag and the news (journey event .140, which fires the endings' league event).",
    L('if', `limit = { ${notFlag('zin_eindil_lost')} }`, 'set_global_flag = zin_eindil_lost', newsAll(140), 'zin_ending_heir_lost = yes'));
  E('zin_eindil_wound',
    '# zin_arg_days (default 120): the grievously wounded trait for that many days.',
    L('if', 'limit = { check_variable = { zin_arg_days = 0 } }', 'set_temp_variable = { zin_arg_days = 120 }'),
    L('zin_eindil', 'add_timed_unit_leader_trait = { trait = zin_eindil_grievously_wounded days = zin_arg_days }'),
    'set_temp_variable = { zin_arg_days = 0 }');

  // ============================================================================================ stage entries
  const pickByOwner = (siteTrigger, varName, fallback) => [
    `clear_variable = global.${varName}`,
    L('random_state', `limit = { ${siteTrigger} = yes }`, L('owner', `set_variable = { global.${varName} = THIS }`)),
    ...(fallback ? [L('if', `limit = { NOT = { has_variable = global.${varName} } }`, fallback)] : [])];
  const setIfExists = (tag, varName) => L('if', `limit = { ${tag} = { exists = yes } }`, L(tag, `set_variable = { global.${varName} = THIS }`));
  for (const s of ['zin_is_site_eindil_ice', 'zin_is_site_three_oaths', 'zin_is_site_winter_ford', 'zin_is_site_south_shrine', 'zin_is_site_yeldenne_landing', 'zin_is_site_parim']) dep(s, 'state trigger', 'key sites (sites.mjs, E7)');
  E('zin_eindil_enter_1',
    'set_global_flag = zin_eindil_awake',
    ...pickByOwner('zin_is_site_eindil_ice', 'zin_eindil_ice_host',
      L('random_country', `limit = { has_country_flag = zin_region_cold_lands exists = yes NOT = { original_tag = ${T_.coldor} } NOT = { original_tag = ${T_.isengard} } NOT = { zin_glo_hall_owner = yes } }`, 'set_variable = { global.zin_eindil_ice_host = THIS }')),
    'zin_eindil_refresh_layouts = yes',
    fireVar('zin_eindil_ice_host', 10));
  E('zin_eindil_enter_2',
    '# The ice host lets him go; the three episodes of the road south start at the bridge.',
    'zin_eindil_clear_host = yes',
    ...pickByOwner('zin_is_site_three_oaths', 'zin_eindil_bridge_host', setIfExists(T_.gunwaith, 'zin_eindil_bridge_host')),
    ...pickByOwner('zin_is_site_winter_ford', 'zin_eindil_ford_host', setIfExists(T_.girdon, 'zin_eindil_ford_host')),
    'clear_variable = global.zin_eindil_trial_host',
    L(`${roster.capitalState('Gunwyn')}`, L('owner', 'set_variable = { global.zin_eindil_trial_host = THIS }')),
    fireVar('zin_eindil_bridge_host', 20));
  E('zin_eindil_form_confederation',
    '# The Grey Ford Confederation (proposed): the western country other than Gunwaith and Girdon with the highest regard (ties to the most states) leads; members have regard 0 or more.',
    L('every_country', 'limit = { has_country_flag = zin_eindil_confed_member }', 'clr_country_flag = zin_eindil_confed_member'),
    'clear_variable = global.zin_eindil_confed_leader',
    'set_temp_variable = { eind_best = -999999 }',
    ...[1, 2].map(pass => L('every_country', `limit = { ${westFlag} exists = yes NOT = { original_tag = ${T_.gunwaith} } NOT = { original_tag = ${T_.girdon} } has_capitulated = no }`,
      'set_temp_variable = { eind_score = zin_eindil_regard }', 'multiply_temp_variable = { eind_score = 1000 }', 'add_to_temp_variable = { eind_score = num_owned_states }',
      pass === 1 ? L('if', 'limit = { check_variable = { eind_score > eind_best } }', 'set_temp_variable = { eind_best = eind_score }')
        : L('if', 'limit = { check_variable = { eind_score = eind_best } NOT = { has_variable = global.zin_eindil_confed_leader } }', 'set_variable = { global.zin_eindil_confed_leader = THIS }', 'set_country_flag = zin_eindil_confed_member'))),
    L('every_country', `limit = { ${westFlag} exists = yes NOT = { original_tag = ${T_.gunwaith} } NOT = { original_tag = ${T_.girdon} } has_capitulated = no check_variable = { zin_eindil_regard > -1 } }`, 'set_country_flag = zin_eindil_confed_member'));
  dep('zin_region_west_lands', 'country flag', 'economy slice (set on startup)');
  E('zin_eindil_enter_3',
    "# The war-king's road: the confederation forms; its leader gets the offer through the pulse when the feud breaks (or on the fallback date).",
    'zin_eindil_clear_host = yes', 'zin_eindil_form_confederation = yes', 'clr_global_flag = zin_eindil_s3_fired');
  E('zin_eindil_enter_4',
    "# The storm: he sails from the leader's coast and is at sea; the wreck, reef and shrine hosts are chosen.",
    'zin_eindil_clear_host = yes',
    L('every_country', 'limit = { has_idea = zin_eindil_war_kings_banner }', 'remove_ideas = zin_eindil_war_kings_banner'),
    L('every_country', 'limit = { has_country_flag = zin_eindil_confed_member }', 'clr_country_flag = zin_eindil_confed_member'),
    'clear_variable = global.zin_eindil_departure_host',
    L('if', 'limit = { has_variable = global.zin_eindil_confed_leader }', L('var:global.zin_eindil_confed_leader', L('if', 'limit = { exists = yes }', 'set_variable = { global.zin_eindil_departure_host = THIS }'))),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_departure_host } }',
      L('random_country', `limit = { ${westFlag} exists = yes any_owned_state = { is_coastal = yes } }`, 'set_variable = { global.zin_eindil_departure_host = THIS }')),
    'clear_variable = global.zin_eindil_wreck_host',
    setIfExists(T_.howan, 'zin_eindil_wreck_host'),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_wreck_host } }', L('random_country', 'limit = { has_country_flag = zin_region_islands_of_the_south exists = yes }', 'set_variable = { global.zin_eindil_wreck_host = THIS }')),
    'clear_variable = global.zin_eindil_reef_host',
    L('random_country', `limit = { exists = yes OR = { original_tag = ${T_.nara} original_tag = ${T_.verde} } }`, 'set_variable = { global.zin_eindil_reef_host = THIS }'),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_reef_host } has_variable = global.zin_eindil_wreck_host }', L('var:global.zin_eindil_wreck_host', 'set_variable = { global.zin_eindil_reef_host = THIS }')),
    ...pickByOwner('zin_is_site_south_shrine', 'zin_eindil_shrine_host', setIfExists(T_.enhis, 'zin_eindil_shrine_host')),
    fireVar('zin_eindil_departure_host', 40));
  E('zin_eindil_pick_gala_host',
    "# The Gala Elves; else the country that employs Lorien; else the owner of Gala's capital.",
    'clear_variable = global.zin_eindil_gala_host',
    setIfExists(T_.galaElves, 'zin_eindil_gala_host'),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_gala_host } }', L('random_country', `limit = { has_character = ${ch.lorien} exists = yes }`, 'set_variable = { global.zin_eindil_gala_host = THIS }')),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_gala_host } }', L(`${roster.capitalState('Gala')}`, L('owner', 'set_variable = { global.zin_eindil_gala_host = THIS }'))));
  E('zin_eindil_enter_5', 'zin_eindil_clear_host = yes', 'zin_eindil_pick_gala_host = yes', fireVar('zin_eindil_gala_host', 50));
  E('zin_eindil_enter_6',
    '# The voyage north: he is at sea; four regions refresh their layouts; the first port of call.',
    'zin_eindil_clear_host = yes', 'zin_eindil_refresh_layouts = yes',
    fireVar('zin_eindil_gala_host', 60),
    'clear_variable = global.zin_eindil_port_1', 'clear_variable = global.zin_eindil_port_2', 'clear_variable = global.zin_eindil_port_3',
    L('random_country', 'limit = { has_country_flag = zin_region_islands_of_the_south exists = yes any_owned_state = { is_coastal = yes } }', 'set_variable = { global.zin_eindil_port_1 = THIS }'),
    L('random_country', 'limit = { OR = { has_country_flag = zin_region_tritons_islands has_country_flag = zin_region_west_lands } exists = yes any_owned_state = { is_coastal = yes } }', 'set_variable = { global.zin_eindil_port_2 = THIS }'),
    L('random_country', 'limit = { has_country_flag = zin_region_cold_lands exists = yes any_owned_state = { is_coastal = yes } NOT = { zin_glo_hall_owner = yes } }', 'set_variable = { global.zin_eindil_port_3 = THIS }'),
    fireVar('zin_eindil_port_1', 61));
  E('zin_eindil_enter_7',
    '# Landfall: the owner of the landing site is told; the hall follows the ambush.',
    'zin_eindil_clear_host = yes',
    ...pickByOwner('zin_is_site_yeldenne_landing', 'zin_eindil_landing_host', null),
    setVar('global.zin_eindil_hall_a_at', 0), setVar('global.zin_eindil_hall_b_at', 0),
    fireVar('zin_eindil_landing_host', 70));
  E('zin_eindil_pick_stage8_host',
    '# Selen (Alleria); if Selen is gone, capitulated or ruled by the Deliverer, the Middle Lands country with the highest regard that is not an Aenor realm; then the Magical Forest.',
    'clear_variable = global.zin_eindil_stage8_host',
    L('if', `limit = { ${T_.selen} = { exists = yes has_capitulated = no NOT = { zin_afrit_rules_here = yes } } }`, L(T_.selen, 'set_variable = { global.zin_eindil_stage8_host = THIS }')),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_stage8_host } }',
      'set_temp_variable = { eind_best = -999999 }',
      L('every_country', 'limit = { has_country_flag = zin_region_middle_lands exists = yes has_capitulated = no NOT = { zin_aenor_is_realm = yes } NOT = { zin_afrit_rules_here = yes } }',
        'set_temp_variable = { eind_score = zin_eindil_regard }', L('if', 'limit = { check_variable = { eind_score > eind_best } }', 'set_temp_variable = { eind_best = eind_score }')),
      L('random_country', 'limit = { has_country_flag = zin_region_middle_lands exists = yes has_capitulated = no NOT = { zin_aenor_is_realm = yes } NOT = { zin_afrit_rules_here = yes } check_variable = { zin_eindil_regard = eind_best } }', 'set_variable = { global.zin_eindil_stage8_host = THIS }')),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_stage8_host } }', setIfExists(T_.magicalForest, 'zin_eindil_stage8_host')));
  dep('zin_aenor_is_realm', 'scripted trigger', 'aenor_court_and_succession'); dep('zin_region_middle_lands', 'country flag', 'economy slice (set on startup)');
  E('zin_eindil_enter_8', '# The warnings: Selen shelters him; the courts learn the name in the events that follow.', 'zin_eindil_clear_host = yes', 'zin_eindil_pick_stage8_host = yes', fireVar('zin_eindil_stage8_host', 80));
  E('zin_eindil_pick_battlefield',
    '# The battlefield of the return: an Aenor-cored state held by Zol, else by Volgan, else any Aenor-cored state held by an enemy (stored as a state variable for the first wave of Glo).',
    'clear_variable = global.zin_eindil_battlefield',
    L('random_state', `limit = { is_core_of = ${T_.aenor} controller = { OR = { original_tag = ${T_.zol} is_subject_of = ${T_.zol} } } }`, 'set_variable = { global.zin_eindil_battlefield = THIS }'),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_battlefield } }', L('random_state', `limit = { is_core_of = ${T_.aenor} controller = { OR = { original_tag = ${T_.volgan} is_subject_of = ${T_.volgan} } } }`, 'set_variable = { global.zin_eindil_battlefield = THIS }')),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_battlefield } }', L('random_state', `limit = { is_core_of = ${T_.aenor} NOT = { is_controlled_by = OWNER } }`, 'set_variable = { global.zin_eindil_battlefield = THIS }')));
  E('zin_eindil_enter_9',
    '# The return: the flag, the battlefield, the world is told. The Host is raised by journey event .92 (or by the pulse after 14 days).',
    'set_global_flag = zin_eindil_returned',
    L('if', `limit = { ${notFlag('zin_war_of_last_crowns')} }`, 'set_global_flag = zin_eindil_quiet_return'),
    setVar('global.zin_eindil_battle', 0), setVar('global.zin_eindil_battle_next', 0),
    'zin_eindil_pick_battlefield = yes', 'zin_eindil_refresh_layouts = yes',
    newsAll(90));
  E('zin_eindil_cliff_effects',
    "# Idempotent: Eindil's role is suspended and the Host carries the rumour spirit until he recovers (journey event .110 may call it first).",
    L('if', `limit = { ${notFlag('zin_eindil_cliff_done')} }`,
      'set_global_flag = zin_eindil_cliff_done',
      L('if', 'limit = { zin_eindil_has_host = yes }',
        L('var:global.zin_eindil_host', 'add_ideas = zin_eindil_king_is_dead', 'if = { limit = { has_character = zin_eindil } retire_character = zin_eindil }'))));
  E('zin_eindil_enter_10', '# The cliff (zin_eindil.110 set zin_eindil_cast_down).', 'zin_eindil_cliff_effects = yes');
  E('zin_eindil_recover',
    "# Alleria's scouts bring him out of the ravine (journey event .113, or the pulse after 400 days): the flag, the role and the maimed trait.",
    L('if', `limit = { ${notFlag('zin_eindil_recovered')} }`,
      'set_global_flag = zin_eindil_recovered',
      L('if', 'limit = { zin_eindil_has_host = yes }',
        L('var:global.zin_eindil_host', 'if = { limit = { has_idea = zin_eindil_king_is_dead } remove_ideas = zin_eindil_king_is_dead }', 'set_temp_variable = { zin_arg_role = 2 }', 'zin_eindil_set_host = yes')),
      'zin_eindil_refresh_portrait = yes'));
  E('zin_eindil_enter_11', '# The palace: the decisions of the palace category open for the Host.', 'set_global_flag = zin_eindil_palace_open', 'zin_eindil_refresh_layouts = yes');
  E('zin_eindil_enter_12', '# Crowned: the realm that will crown him is found.', setVar('global.zin_eindil_crown_next', 'global.zin_eindil_clock'), 'zin_eindil_go_to_parim = yes');
  E('zin_eindil_advance_stage',
    "# Starts the stage in zin_arg_to (default: the next one): the stage counter, its clock, and the stage's own entry.",
    L('if', 'limit = { check_variable = { zin_arg_to = 0 } }', 'add_to_variable = { global.zin_eindil_stage = 1 }'),
    L('else', 'set_variable = { global.zin_eindil_stage = zin_arg_to }'),
    'set_temp_variable = { zin_arg_to = 0 }',
    'set_variable = { global.zin_eindil_since = global.zin_eindil_clock }', 'set_variable = { global.zin_eindil_stage_age = 0 }', 'set_variable = { global.zin_eindil_hold_until = 0 }',
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n, i) => L(i === 0 ? 'if' : 'else_if', `limit = { ${stage(n)} }`, `zin_eindil_enter_${n} = yes`)));

  // ============================================================================================ stage runner
  E('zin_eindil_king_without_a_house',
    '# End of stage 2: the news reaches every western court once his deeds are known (renown 20), else only the hosts of the road.',
    L('if', 'limit = { check_variable = { global.zin_eindil_renown > 19 } }', L('every_country', `limit = { ${westFlag} exists = yes }`, `country_event = { id = ${ev(23)} }`)),
    L('else', fireVar('zin_eindil_bridge_host', 23), fireVar('zin_eindil_ford_host', 23), fireVar('zin_eindil_trial_host', 23)));
  E('zin_eindil_stage3_runner',
    '# Stage 3: A Crown Offered reaches the leader when the feud breaks, or on the fallback date; the stage is done when the war-king lays the crown down.',
    L('if', `limit = { ${notFlag('zin_eindil_s3_fired')} has_variable = global.zin_eindil_confed_leader }`,
      L('if', `limit = { ${gflag('zin_west_grey_ford_war')} }`, 'set_global_flag = zin_eindil_s3_fired', fireVar('zin_eindil_confed_leader', 30)),
      L('else_if', `limit = { OR = { ${gflag('zin_west_truce_permanent')} ${dateT('1750.9.1')} } }`, 'set_global_flag = zin_eindil_s3_fired', fireVar('zin_eindil_confed_leader', 31))),
    L('if', `limit = { ${stageAge('>', C.stage4_fallback)} ${notFlag('zin_eindil_stage_3_done')} }`, 'set_global_flag = zin_eindil_stage_3_done'));
  dep('zin_west_grey_ford_war', 'global flag', 'western_crossing (mech_crossing.mjs)'); dep('zin_west_truce_permanent', 'global flag', 'western_crossing (mech_crossing.mjs)');
  E('zin_eindil_compute_ambush',
    "# N9: 5 + ports betrayed + 1 if hunted + 1 each for the Worshipdom's ships, hunters and Whispers 4 - 1 if elven crew - 1 per guide flag - 1 if the Deliverer sent others. Stored in global.zin_eindil_ambush_strength.",
    `set_temp_variable = { eind_str = ${K('ambush_base')} }`,
    'add_to_temp_variable = { eind_str = global.zin_eindil_ports_betrayed }',
    ...['zin_eindil_hunted'].map(f => L('if', `limit = { ${gflag(f)} }`, 'add_to_temp_variable = { eind_str = 1 }')),
    ...['zin_worshipdom_ships_ready', 'zin_worshipdom_hunters'].map(f => L('if', `limit = { ${countryFlagAnywhere(f)} }`, 'add_to_temp_variable = { eind_str = 1 }')),
    L('if', 'limit = { check_variable = { global.zin_afrit_seat_whispers > 3 } }', 'add_to_temp_variable = { eind_str = 1 }'),
    ...['zin_eindil_elven_crew', 'zin_eindil_landing_guides', 'zin_yeldenne_beacon', 'zin_yeldenne_coast_watch', 'zin_yeldenne_guides', 'zin_afrit_sent_others'].map(f => L('if', `limit = { ${gflag(f)} }`, 'subtract_from_temp_variable = { eind_str = 1 }')),
    'set_variable = { global.zin_eindil_ambush_strength = eind_str }',
    'log = "ZIN journey: ambush strength [?global.zin_eindil_ambush_strength]"');
  for (const f of ['zin_worshipdom_ships_ready', 'zin_worshipdom_hunters']) dep(f, 'country flag', 'tree worshipdom (read on any country, SL-20)');
  dep('zin_afrit_sent_others', 'global flag', 'afrit_hidden_council');
  dep('zin_afrit_seat_whispers', 'global variable', 'afrit_hidden_council');
  for (const f of ['zin_yeldenne_beacon', 'zin_yeldenne_coast_watch', 'zin_yeldenne_guides']) dep(f, 'global flag', 'regional yeldenne tree');
  E('zin_eindil_ambush_resolved',
    '# Called by journey event .71 with zin_arg_value = the strength it computed (or by the pulse with its own computation): Afrit reached the hall first (strength 2 or more) or the heir did.',
    L('if', `limit = { ${notFlag('zin_eindil_ambush_done')} }`,
      'set_global_flag = zin_eindil_ambush_done',
      'set_variable = { global.zin_eindil_ambush_strength = zin_arg_value }',
      L('if', `limit = { check_variable = { global.zin_eindil_ambush_strength > 1 } ${gflag('zin_afrit_at_yeldenne')} ${notFlag('zin_afrit_sent_others')} ${notFlag('zin_eindil_let_land')} zin_horos_alive = yes }`,
        'set_variable = { global.zin_eindil_hall_a_at = global.zin_eindil_clock }', `add_to_variable = { global.zin_eindil_hall_a_at = ${C.hall_a_delay_days} }`),
      L('else', 'set_variable = { global.zin_eindil_hall_b_at = global.zin_eindil_clock }', `add_to_variable = { global.zin_eindil_hall_b_at = ${C.hall_b_delay_days} }`)),
    'set_temp_variable = { zin_arg_value = 0 }');
  E('zin_eindil_stage7_runner',
    '# 21 days after landfall the ambush is settled (journey event .71 calls zin_eindil_ambush_resolved; at 28 days the pulse settles it by the same formula); then the hall.',
    L('if', `limit = { ${stageAge('>', C.ambush_fallback_days - 1)} ${notFlag('zin_eindil_ambush_done')} }`,
      'zin_eindil_compute_ambush = yes', 'set_temp_variable = { zin_arg_value = global.zin_eindil_ambush_strength }', 'zin_eindil_ambush_resolved = yes'),
    L('if', 'limit = { check_variable = { global.zin_eindil_hall_a_at > 0 } check_variable = { global.zin_eindil_clock > global.zin_eindil_hall_a_at } }', setVar('global.zin_eindil_hall_a_at', 0), 'zin_glo_hall_historical = yes'),
    L('if', 'limit = { check_variable = { global.zin_eindil_hall_b_at > 0 } check_variable = { global.zin_eindil_clock > global.zin_eindil_hall_b_at } }', setVar('global.zin_eindil_hall_b_at', 0), 'zin_glo_heir_arrives = yes'));
  dep('zin_glo_hall_historical', 'scripted effect', 'yeldenne_and_glo (mech_yeldenne.mjs)'); dep('zin_glo_heir_arrives', 'scripted effect', 'yeldenne_and_glo (mech_yeldenne.mjs)');
  dep('zin_afrit_at_yeldenne', 'global flag', 'afrit_hidden_council');

  E('zin_eindil_start_hunt',
    "# Denounce and hunt (journey event .82) and the Worshipdom's Hunt him (zin_afrit.40) call this: one hunt, the rolls do not stack.",
    L('if', `limit = { ${notFlag('zin_eindil_hunt_active')} }`, 'set_global_flag = zin_eindil_hunt_active', 'set_variable = { global.zin_eindil_hunt_clock = global.zin_eindil_clock }'));
  E('zin_eindil_to_the_forest',
    '# Eindil goes to the elven woods (once): The Bearer in the Forest reaches the Magical Forest.',
    L('if', `limit = { ${notFlag('zin_eindil_s8_forest_fired')} }`, 'set_global_flag = zin_eindil_s8_forest_fired', L(T_.magicalForest, L('if', 'limit = { exists = yes }', `country_event = { id = ${ev(86)} }`))));
  E('zin_eindil_make_dragon_pact',
    "# The dragon is entrusted to the bearer (journey event .88 A, or Varner's forced pact on 1757.7.1): the flag, the roost bond, and The Dragon Chooses for the Keeper.",
    L('if', `limit = { ${notFlag('zin_eindil_dragon_pact')} }`,
      'set_global_flag = zin_eindil_dragon_pact',
      'set_temp_variable = { zin_arg_value = -5 }', 'zin_elves_add_roost_bond = yes',
      L('every_country', 'limit = { zin_world_is_dragon_keeper = yes }', `country_event = { id = ${ev(169)} days = 7 }`)));
  dep('zin_elves_add_roost_bond', 'scripted effect', 'elves_wall_and_dragons'); dep('zin_world_is_dragon_keeper', 'scripted trigger', 'magic and world systems (04_magic_and_world_systems.md)');
  E('zin_eindil_stage8_runner',
    L('if', `limit = { ${gflag('zin_war_of_last_crowns')} ${notFlag('zin_eindil_s8_forest_fired')} }`, 'zin_eindil_to_the_forest = yes'),
    L('if', `limit = { ${gflag('zin_eindil_hunt_active')} check_variable = { global.zin_eindil_hunt_clock > 0 } }`,
      'set_temp_variable = { eind_hunt_next = global.zin_eindil_hunt_clock }', `add_to_temp_variable = { eind_hunt_next = ${C.hunt_roll_days} }`,
      L('if', 'limit = { check_variable = { global.zin_eindil_clock > eind_hunt_next } }',
        'set_variable = { global.zin_eindil_hunt_clock = global.zin_eindil_clock }',
        L('if', 'limit = { NOT = { any_country = { has_country_flag = zin_eindil_crown_shelters } } }', fireHost(84)))),
    L('if', `limit = { ${dateT('1757.7.1')} ${notFlag('zin_eindil_dragon_pact')} }`, 'zin_eindil_make_dragon_pact = yes'));

  // ---- stage 9: the Host and the battles
  E('zin_eindil_pick_host_candidate',
    '# The sworn country that exists (Selen first); unset when there is none.',
    'clear_variable = global.zin_eindil_host_candidate',
    L('if', `limit = { ${T_.selen} = { exists = yes has_country_flag = zin_eindil_sworn has_capitulated = no } }`, L(T_.selen, 'set_variable = { global.zin_eindil_host_candidate = THIS }')),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_host_candidate } }', L('random_country', 'limit = { exists = yes has_country_flag = zin_eindil_sworn has_capitulated = no }', 'set_variable = { global.zin_eindil_host_candidate = THIS }')));
  E('zin_eindil_found_coalition',
    '# The scope is the Host: it leads the Lost Cause league (founded here unless the Lost Cause was given to it), and every country that said yes before is added.',
    L('if', 'limit = { is_in_faction = no }', 'create_faction_from_template = { template = zin_faction_lost_cause name = ZIN_FACTION_LOST_CAUSE }'),
    L('else_if', 'limit = { is_faction_leader = no }', 'set_faction_leader = yes'),
    'set_global_flag = zin_eindil_coalition_founded',
    L('every_country', 'limit = { has_country_flag = zin_eindil_coalition_member is_in_faction = no }', L('PREV', 'add_to_faction = PREV')));
  dep('zin_faction_lost_cause', 'faction template', 'diplomacy slice (diplomacy.mjs)');
  E('zin_eindil_grant_dragon', L('if', `limit = { ${gflag('zin_eindil_dragon_pact')} }`, 'set_temp_variable = { zin_arg_amount = 1 }', 'zin_war_grant_dragons = yes'));
  dep('zin_war_grant_dragons', 'scripted effect', 'warfare (01_warfare.md) / magic and world systems');
  E('zin_eindil_raise_host',
    '# zin_arg_choice: 1 raise the Host (cosmetic name, claims), 2 stand beside him (own name), 0 automatic. The scope is the sworn country; with none, a dynamic Host is made.',
    L('if', `limit = { ${notFlag('zin_eindil_host_raised')} }`,
      'set_global_flag = zin_eindil_host_raised',
      'set_variable = { global.zin_eindil_host_raised_at = global.zin_eindil_clock }',
      L('if', 'limit = { check_variable = { zin_arg_choice = 0 } NOT = { has_country_flag = zin_eindil_sworn } }', 'zin_eindil_create_dynamic_host = yes'),
      L('else',
        L('if', 'limit = { check_variable = { zin_arg_choice = 0 } }', 'set_temp_variable = { zin_arg_choice = 1 }'),
        L('if', 'limit = { is_subject = yes }', L('overlord', 'end_puppet = PREV')),
        'set_temp_variable = { zin_arg_role = 2 }', 'zin_eindil_set_host = yes',
        'add_ideas = zin_eindil_host_of_the_heir',
        L('if', 'limit = { check_variable = { zin_arg_choice = 1 } }',
          'set_cosmetic_tag = zin_host_of_eindil',
          L('every_state', `limit = { is_core_of = ${T_.aenor} NOT = { is_owned_by = PREV } owner = { OR = { original_tag = ${T_.volgan} original_tag = ${T_.zol} is_subject_of = ${T_.volgan} is_subject_of = ${T_.zol} zin_afrit_rules_here = yes } } }`, 'add_claim_by = PREV')),
        'set_country_flag = zin_eindil_coalition_member',
        'zin_eindil_grant_dragon = yes',
        'zin_eindil_apply_opinions = yes')),
    'set_temp_variable = { zin_arg_choice = 0 }');
  E('zin_eindil_create_dynamic_host',
    "# No sworn country: a dynamic country of Aenor's original tag is raised as the Host (renown / 10 hosts of survivors, at least 3), or a court in exile in the Magical Forest.",
    'create_dynamic_country = { original_tag = ' + T_.aenor + ' set_global_flag = zin_eindil_host_dynamic set_variable = { global.zin_eindil_dynamic_host = THIS } zin_eindil_stock_dynamic_host = yes }');
  E('zin_eindil_stock_dynamic_host',
    "# The scope is the new Host: a state, a leader, survivors, a coalition. Without a state it is a court in exile in the Magical Forest.",
    'set_cosmetic_tag = zin_host_of_eindil',
    'set_politics = { ruling_party = democratic last_election = "1746.3.1" election_frequency = 48 elections_allowed = no }',
    'set_popularities = { democratic = 80 neutrality = 15 fascism = 5 communism = 0 }',
    L('random_state', `limit = { is_core_of = ${T_.aenor} owner = { zin_aenor_is_realm = yes NOT = { zin_afrit_rules_here = yes } OR = { has_war_with = ${T_.volgan} has_war_with = ${T_.zol} } } }`, 'transfer_state_to = PREV'),
    L('if', 'limit = { check_variable = { num_owned_states = 0 } }', `become_exiled_in = { target = ${T_.magicalForest} legitimacy = 100 }`),
    'add_ideas = zin_eindil_host_of_the_heir',
    'set_temp_variable = { zin_arg_role = 2 }', 'zin_eindil_set_host = yes',
    `add_country_leader_role = { character = zin_eindil promote_leader = yes country_leader = { ideology = ${ch.hostStance} expire = "2000.1.1.1" traits = { zin_eindil_king_without_a_house } } }`,
    `division_template = { name = "Host of the Heir" regiments = { zin_men_infantry = { x = 0 y = 0 } zin_men_infantry = { x = 0 y = 1 } zin_men_infantry = { x = 0 y = 2 } zin_men_infantry = { x = 1 y = 0 } zin_men_infantry = { x = 1 y = 1 } zin_men_archers = { x = 1 y = 2 } } }`,
    'set_temp_variable = { eind_divs = global.zin_eindil_renown }', `divide_temp_variable = { eind_divs = ${K('renown_per_division')} }`,
    L('if', `limit = { check_variable = { eind_divs < ${C.host_min_divisions} } }`, `set_temp_variable = { eind_divs = ${C.host_min_divisions} }`),
    'round_temp_variable = eind_divs',
    L('for_loop_effect', 'end = eind_divs', 'create_unit = { division = "name = \\"Survivors of the Heir\\" division_template = \\"Host of the Heir\\" start_experience_factor = 0.3" owner = THIS }'),
    'set_country_flag = zin_eindil_coalition_member', 'zin_eindil_grant_dragon = yes', 'zin_eindil_apply_opinions = yes');
  E('zin_eindil_join_coalition',
    "# The scope joins the Host's league and rides with it; the Host's AI befriends it.",
    'set_country_flag = zin_eindil_coalition_member',
    L('if', 'limit = { zin_eindil_has_host = yes }',
      L('var:global.zin_eindil_host',
        L('if', 'limit = { is_faction_leader = yes }', 'add_to_faction = PREV'),
        'meta_effect = { text = { add_ai_strategy = { type = befriend id = "[eind_tag]" value = 100 } } eind_tag = "[PREV.GetTag]" }')));
  const sendEquipment = (eq, code, first) => L(first ? 'if' : 'else_if', `limit = { check_variable = { zin_arg_type = ${code} } }`, `send_equipment = { equipment = ${eq} amount = zin_arg_equipment target = var:global.zin_eindil_host }`);
  E('zin_eindil_aid_host',
    '# The scope sends equipment and levies to the Host. zin_arg_type: 0 zin_arms_equipment (default), 1 giant gear, 2 yeti gear, 3 troll gear, 4 elven arms; zin_arg_equipment, zin_arg_manpower.',
    L('if', 'limit = { zin_eindil_has_host = yes }',
      sendEquipment('zin_arms_equipment', 0, true),
      ...[['zin_giant_gear_equipment', 1], ['zin_yeti_gear_equipment', 2], ['zin_troll_gear_equipment', 3], ['zin_elven_arms_equipment', 4]].map(([eq, code]) => sendEquipment(eq, code, false)),
      L('if', 'limit = { check_variable = { zin_arg_manpower > 0 } }', 'set_temp_variable = { eind_levies = zin_arg_manpower }', 'add_manpower = zin_arg_manpower', L('var:global.zin_eindil_host', 'add_manpower = eind_levies'))),
    'set_temp_variable = { zin_arg_equipment = 0 }', 'set_temp_variable = { zin_arg_manpower = 0 }', 'set_temp_variable = { zin_arg_type = 0 }');
  E('zin_eindil_hail_the_king',
    '# Battle 5, Hailed as King (journey event .102): the Host and every coalition member.',
    fireHost(102),
    L('every_country', 'limit = { has_country_flag = zin_eindil_coalition_member NOT = { zin_eindil_is_host = yes } }', `country_event = { id = ${ev(102)} }`));
  const volganGone = `OR = { NOT = { ${T_.volgan} = { exists = yes } } ${gflag('zin_volgan_body_destroyed')} }`;
  const volganGround = `any_state = { zin_eindil_army_near = yes controller = { OR = { original_tag = ${T_.volgan} is_subject_of = ${T_.volgan} } } }`;
  const battleGap = 'set_variable = { global.zin_eindil_battle_next = global.zin_eindil_clock }';
  E('zin_eindil_battles',
    '# The battles of the return, each on its condition under the free rule and on its date under the historical rule (journey spec, stage 9).',
    L('if', `limit = { ${gflag('zin_eindil_quiet_return')} ${stageAge('>', C.quiet_return_days)} }`, 'set_global_flag = zin_eindil_stage_9_done'),
    L('else_if', `limit = { ${gflag('zin_eindil_lost')} }`, 'set_global_flag = zin_eindil_stage_9_done'),
    L('else',
      // nobody to fight in the south: battles 1 to 3 are skipped
      L('if', `limit = { check_variable = { global.zin_eindil_battle < 3 } ${volganGone} }`, setVar('global.zin_eindil_battle', 3)),
      // SL-33: the southern battles wait no longer than CP21's latest date (1 Glernaen 4A 1758) or a year after the return
      L('if', `limit = { check_variable = { global.zin_eindil_battle < 3 } OR = { ${dateT('1758.3.1')} ${stageAge('>', C.battle_deadline_days)} } }`, setVar('global.zin_eindil_battle', 3), 'set_global_flag = zin_eindil_south_unfought'),
      // battle 1: Volgan at the southern front (and Varner's last wards, which journey event .96 starts when Zol's dead are in the field)
      L('if', `limit = { check_variable = { global.zin_eindil_battle = 0 } zin_eindil_has_host = yes OR = { AND = { zin_eindil_historical = yes ${dateT('1757.6.1')} } AND = { zin_eindil_historical = no ${volganGround} } } }`,
        setVar('global.zin_eindil_battle', 1), battleGap, `add_to_variable = { global.zin_eindil_battle_next = ${C.battle_gap_days} }`, fireHost(96)),
      // battle 2: the New Gods restore him through Glo; without Glo the heir does not rise
      L('if', `limit = { check_variable = { global.zin_eindil_battle = 1 } check_variable = { global.zin_eindil_clock > global.zin_eindil_battle_next } OR = { zin_eindil_historical = no ${dateT('1757.7.1')} } }`,
        setVar('global.zin_eindil_battle', 2), battleGap, `add_to_variable = { global.zin_eindil_battle_next = ${C.battle_gap_days} }`,
        L('if', 'limit = { check_variable = { global.zin_glo_state = 1 } }', fireHost(98)),
        L('else', newsAll(99), 'set_global_flag = zin_eindil_stage_9_done')),
      // battle 3: the blue sword through Volgan
      L('if', `limit = { check_variable = { global.zin_eindil_battle = 2 } check_variable = { global.zin_eindil_clock > global.zin_eindil_battle_next } OR = { AND = { zin_eindil_historical = yes ${dateT('1757.8.1')} } AND = { zin_eindil_historical = no ${volganGround} } } }`,
        setVar('global.zin_eindil_battle', 3), fireHost(100)),
      // battle 4 is Zol's: noticed when he manifests
      L('if', `limit = { check_variable = { global.zin_eindil_battle = 3 } OR = { ${gflag('zin_kusven_forth')} ${gflag('zin_horos_sword_broken')} } }`, setVar('global.zin_eindil_battle', 4)),
      // battle 5: hailed as king, after Zol withdraws or on 1757.12.1 if Zol never came
      L('if', `limit = { OR = { check_variable = { global.zin_eindil_battle = 3 } check_variable = { global.zin_eindil_battle = 4 } } OR = { ${gflag('zin_kusven_withdrawn')} AND = { ${dateT('1757.12.1')} NOT = { ${gflag('zin_kusven_forth')} } } ${dateT('1758.9.1')} } }`,
        setVar('global.zin_eindil_battle', 5), 'set_global_flag = zin_eindil_stage_9_done', 'zin_eindil_hail_the_king = yes')));
  dep('zin_horos_sword_broken', 'global flag', 'zols_mistake (zin_mistake.21)');
  T('zin_eindil_battle_ground', 'zin_eindil_has_host = yes', L('any_state', 'zin_eindil_army_near = yes', L('controller', `OR = { original_tag = ${T_.volgan} is_subject_of = ${T_.volgan} }`)));
  E('zin_eindil_stage9_runner',
    L('if', `limit = { ${notFlag('zin_eindil_host_raised')} ${stage(9)} ${stageAge('>', 13)} }`, 'zin_eindil_pick_host_candidate = yes',
      L('if', 'limit = { has_variable = global.zin_eindil_host_candidate }', L('var:global.zin_eindil_host_candidate', 'set_temp_variable = { zin_arg_choice = 1 }', 'zin_eindil_raise_host = yes')),
      L('else', 'zin_eindil_create_dynamic_host = yes')),
    L('if', `limit = { ${gflag('zin_eindil_host_raised')} ${notFlag('zin_eindil_coalition_founded')} check_variable = { global.zin_eindil_host_raised_at > 0 } }`,
      'set_temp_variable = { eind_coalition_at = global.zin_eindil_host_raised_at }', 'add_to_temp_variable = { eind_coalition_at = 7 }',
      L('if', 'limit = { check_variable = { global.zin_eindil_clock > eind_coalition_at } zin_eindil_has_host = yes }', L('var:global.zin_eindil_host', 'zin_eindil_found_coalition = yes'))),
    L('if', `limit = { ${stage(9)} ${notFlag('zin_eindil_stage_9_done')} }`, 'zin_eindil_battles = yes'),
    L('if', `limit = { ${stage(9)} ${gflag('zin_eindil_stage_9_done')} ${notFlag('zin_eindil_cast_down')} ${notFlag('zin_afrit_returned')} ${notFlag('zin_eindil_recovered')} zin_eindil_floor_reached = yes }`, 'set_global_flag = zin_eindil_recovered'));

  // ============================================================================================ palace and coronation
  E('zin_eindil_palace_reset', '# After a failed attempt the flags of the chain are cleared (journey event .127).', 'clr_global_flag = zin_palace_passages', 'clr_global_flag = zin_palace_rebels');
  E('zin_eindil_found_parim_realm',
    '# No Aenor realm exists but the Host or a coalition member owns Parim: a new Aenor realm is created there and takes every Aenor-cored state the coalition owns.',
    L('if', `limit = { any_state = { zin_is_site_parim = yes owner = { zin_eindil_coalition_ally = yes } } }`,
      `create_dynamic_country = { original_tag = ${T_.aenor} set_variable = { global.zin_eindil_crowning_realm = THIS } set_politics = { ruling_party = democratic last_election = "1746.3.1" election_frequency = 48 elections_allowed = no } }`,
      L('var:global.zin_eindil_crowning_realm',
        L('every_state', 'limit = { zin_is_site_parim = yes }', 'transfer_state_to = PREV'),
        L('every_state', `limit = { is_core_of = ${T_.aenor} owner = { zin_eindil_coalition_ally = yes } }`, 'transfer_state_to = PREV'))));
  E('zin_eindil_go_to_parim',
    '# Stage 12: find the crowning realm (never moves Eindil) and fire The Crown Is Offered; if Parim is held by an enemy, The Crown Withheld (the pulse retries every 30 days).',
    'clear_variable = global.zin_eindil_crowning_realm',
    L('if', 'limit = { zin_eindil_has_host = yes }', L('var:global.zin_eindil_host', L('if', 'limit = { zin_aenor_is_realm = yes }', 'set_variable = { global.zin_eindil_crowning_realm = THIS }'))),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_crowning_realm } }',
      L('random_country', 'limit = { zin_aenor_is_realm = yes exists = yes NOT = { zin_afrit_rules_here = yes } NOT = { zin_eindil_war_with_host = yes } NOT = { zin_eindil_is_host = yes } }', 'set_variable = { global.zin_eindil_crowning_realm = THIS }')),
    L('if', 'limit = { NOT = { has_variable = global.zin_eindil_crowning_realm } NOT = { any_country = { zin_aenor_is_realm = yes exists = yes } } }', 'zin_eindil_found_parim_realm = yes'),
    L('if', 'limit = { has_variable = global.zin_eindil_crowning_realm }',
      'set_global_flag = zin_eindil_crown_offered',
      L('var:global.zin_eindil_crowning_realm', L('if', 'limit = { exists = yes }', `country_event = { id = ${ev(130)} }`)),
      L('if', 'limit = { zin_eindil_has_host = yes }', L('var:global.zin_eindil_host', L('if', 'limit = { NOT = { zin_aenor_is_realm = yes } }', `country_event = { id = ${ev(130)} }`)))),
    L('else', fireHost(132)));
  dep('zin_aenor_people_choose', 'scripted effect', 'aenor_court_and_succession (called by journey event .130)');
  E('zin_eindil_after_coronation',
    "# The end state once zin_eindil_crowned is set (Aenor's zin_aenor.400): the leader trait, the dynamic Host comes home, Selen drops the cosmetic name, the first friends.",
    L('zin_eindil', 'add_country_leader_trait = zin_eindil_rightful_king'),
    'zin_eindil_refresh_portrait = yes',
    L('if', `limit = { ${gflag('zin_eindil_host_dynamic')} has_variable = global.zin_eindil_dynamic_host }`,
      L('var:global.zin_eindil_dynamic_host', L('if', 'limit = { exists = yes }', `country_event = { id = ${ev(131)} }`)),
      'set_variable = { global.zin_eindil_annex_at = global.zin_eindil_clock }', 'add_to_variable = { global.zin_eindil_annex_at = 14 }'),
    L('every_country', 'limit = { has_idea = zin_eindil_host_of_the_heir NOT = { has_variable = global.zin_eindil_dynamic_host } }', 'remove_ideas = zin_eindil_host_of_the_heir', 'if = { limit = { has_cosmetic_tag = zin_host_of_eindil } drop_cosmetic_tag = yes }'),
    L('every_country', `limit = { check_variable = { zin_eindil_regard > ${C.first_friend_regard - 1} } }`, 'add_timed_idea = { idea = zin_eindil_first_friends days = 1825 }'),
    'zin_eindil_apply_opinions = yes');
  E('zin_eindil_annex_dynamic_host',
    "# 14 days after the coronation the dynamic Host is annexed by the crowned realm (its player has been offered the switch by event .131).",
    L('if', 'limit = { has_variable = global.zin_eindil_dynamic_host has_variable = global.zin_eindil_crowning_realm }',
      L('var:global.zin_eindil_crowning_realm', L('if', 'limit = { exists = yes }', 'annex_country = { target = var:global.zin_eindil_dynamic_host }')),
      'clear_variable = global.zin_eindil_dynamic_host'),
    setVar('global.zin_eindil_annex_at', 0));
  E('zin_eindil_stage_runner',
    '# What a stage does with its days: reminders, the ports of call, the hall, the hunt, the battles, the coronation.',
    L('if', `limit = { ${stage(1)} ${stageAge('>', C.stage2_after - 1)} ${notFlag('zin_eindil_s1_road_fired')} }`, 'set_global_flag = zin_eindil_s1_road_fired', fireVar('zin_eindil_ice_host', 12)),
    L('if', `limit = { ${stage(2)} ${stageAge('>', 109)} ${notFlag('zin_eindil_s2_end_fired')} }`, 'set_global_flag = zin_eindil_s2_end_fired', 'zin_eindil_king_without_a_house = yes'),
    L('if', `limit = { ${stage(3)} }`, 'zin_eindil_stage3_runner = yes'),
    L('if', `limit = { ${stage(4)} ${stageAge('>', 250)} ${notFlag('zin_eindil_s4_end_fired')} }`, 'set_global_flag = zin_eindil_s4_end_fired', fireVar('zin_eindil_wreck_host', 45)),
    L('if', `limit = { ${stage(5)} ${stageAge('>', C.naming_fallback)} ${notFlag('zin_eindil_named')} }`, 'zin_eindil_name_him = yes', newsAll(170)),
    L('if', `limit = { ${stage(6)} ${stageAge('>', C.port_gap_days - 1)} ${notFlag('zin_eindil_s6_port2')} }`, 'set_global_flag = zin_eindil_s6_port2', fireVar('zin_eindil_port_2', 61)),
    L('if', `limit = { ${stage(6)} ${stageAge('>', C.port_gap_days * 2 - 1)} ${notFlag('zin_eindil_s6_port3')} }`, 'set_global_flag = zin_eindil_s6_port3', fireVar('zin_eindil_port_3', 61)),
    L('if', `limit = { ${stage(7)} }`, 'zin_eindil_stage7_runner = yes'),
    L('if', `limit = { ${stage(8)} }`, 'zin_eindil_stage8_runner = yes'),
    L('if', `limit = { ${stageGe(9)} ${stageLt(10)} }`, 'zin_eindil_stage9_runner = yes'),
    L('if', `limit = { ${stage(10)} ${stageAge('>', C.recovery_fallback)} ${notFlag('zin_eindil_recovered')} }`, 'zin_eindil_recover = yes'),
    L('if', `limit = { ${stage(12)} ${notFlag('zin_eindil_crowned')} check_variable = { global.zin_eindil_clock > global.zin_eindil_crown_next } ${notFlag('zin_eindil_crown_offered')} }`,
      'set_variable = { global.zin_eindil_crown_next = global.zin_eindil_clock }', `add_to_variable = { global.zin_eindil_crown_next = ${C.coronation_retry_days} }`, 'zin_eindil_go_to_parim = yes'),
    L('if', `limit = { ${gflag('zin_eindil_crowned')} ${notFlag('zin_eindil_aftermath_done')} }`, 'set_global_flag = zin_eindil_aftermath_done', 'zin_eindil_after_coronation = yes'),
    L('if', 'limit = { check_variable = { global.zin_eindil_annex_at > 0 } check_variable = { global.zin_eindil_clock > global.zin_eindil_annex_at } }', 'zin_eindil_annex_dynamic_host = yes'));

  // ============================================================================================ host safeguards (on_annex, on_capitulation: ROOT / FROM as the on action sets them)
  E('zin_eindil_host_lost',
    '# The host was annexed or capitulated: Eindil moves to the best friend of the lost host, never to the annexer; +30 days of delay.',
    'set_temp_variable = { zin_arg_value = 30 }', 'zin_eindil_add_delay = yes',
    'set_temp_variable = { eind_best = -999999 }',
    L('every_country', 'limit = { exists = yes has_capitulated = no NOT = { zin_eindil_is_host = yes } NOT = { tag = ROOT } NOT = { tag = FROM } }', 'set_temp_variable = { eind_score = zin_eindil_regard }',
      L('if', 'limit = { check_variable = { eind_score > eind_best } }', 'set_temp_variable = { eind_best = eind_score }')),
    'zin_eindil_clear_host = yes',
    L('random_country', 'limit = { exists = yes has_capitulated = no NOT = { tag = ROOT } NOT = { tag = FROM } check_variable = { zin_eindil_regard = eind_best } }',
      L('if', `limit = { ${stageGe(9)} }`, 'set_temp_variable = { zin_arg_role = 2 }'), 'zin_eindil_set_host = yes'));

  // ============================================================================================ decisions
  const D = (id, ...body) => decisions.push({ id, body });
  const guestVisible = (lo, hi) => ['zin_eindil_is_host = yes', stageGe(lo), stageLt(hi + 1)];
  D('zin_eindil_ask_counsel', 'allowed = { always = yes }', L('visible', ...guestVisible(1, 8)), L('available', 'zin_eindil_is_host = yes'),
    'cost = 25', 'days_re_enable = 90',
    L('complete_effect', 'add_stability = 0.02', 'add_war_support = 0.02'),
    L('ai_will_do', 'base = 1', L('modifier', 'add = 2', 'has_political_power > 120')));
  D('zin_eindil_speed_him_on', 'allowed = { always = yes }', L('visible', ...guestVisible(1, 8)), L('available', 'zin_eindil_is_host = yes'),
    'cost = 50', 'days_re_enable = 60',
    L('complete_effect', 'custom_effect_tooltip = zin_eindil_tt_delay_less', 'set_temp_variable = { zin_arg_value = -30 }', 'zin_eindil_add_delay = yes', 'set_temp_variable = { zin_arg_value = 10 }', 'zin_eindil_add_regard = yes', 'set_variable = { global.zin_eindil_hold_until = 0 }'),
    L('ai_will_do', 'base = 2', L('modifier', 'factor = 0', 'zin_eindil_historical = yes'), L('modifier', 'factor = 2', 'zin_eindil_friend = yes')));
  D('zin_eindil_detain_him', 'allowed = { always = yes }', L('visible', ...guestVisible(1, 8)),
    L('available', 'zin_eindil_is_host = yes', `custom_trigger_tooltip = { tooltip = zin_eindil_tt_not_gala NOT = { original_tag = ${T_.galaElves} } NOT = { zin_glo_hall_owner = yes } }`),
    'days_re_enable = 365',
    L('complete_effect', 'custom_effect_tooltip = zin_eindil_tt_delay_more', 'set_temp_variable = { zin_arg_days = 180 }', 'zin_eindil_hold_guest = yes', 'set_temp_variable = { zin_arg_value = 90 }', 'zin_eindil_add_delay = yes',
      'set_temp_variable = { zin_arg_value = -30 }', 'zin_eindil_add_regard = yes', 'add_ideas = zin_eindil_restless_guest'),
    L('ai_will_do', 'base = 0', L('modifier', 'add = 2', 'zin_eindil_historical = no', 'check_variable = { zin_footholds > 2 }')));
  D('zin_eindil_swear_to_heir', 'allowed = { always = yes }', L('visible', 'zin_eindil_is_host = yes', stage(8), 'NOT = { has_country_flag = zin_eindil_sworn }'),
    L('available', 'zin_eindil_is_host = yes',
      `custom_trigger_tooltip = { tooltip = zin_eindil_tt_swear check_variable = { zin_eindil_regard > ${C.swear_regard - 1} } check_variable = { global.zin_eindil_renown > ${C.swear_renown - 1} } }`,
      `custom_trigger_tooltip = { tooltip = zin_eindil_tt_late ${dateT('1755.3.1')} }`),
    'cost = 100', 'fire_only_once = yes',
    L('complete_effect', 'set_country_flag = zin_eindil_sworn'),
    L('ai_will_do', 'base = 0', L('modifier', 'add = 100', 'zin_eindil_historical = yes', `original_tag = ${T_.selen}`), L('modifier', 'add = 25', 'zin_eindil_historical = no', 'has_government = democratic')));
  D('zin_eindil_enforce_peace', 'allowed = { always = yes }', L('visible', 'has_variable = global.zin_eindil_confed_leader', L('var:global.zin_eindil_confed_leader', 'tag = PREV'), stage(3)),
    L('available', `custom_trigger_tooltip = { tooltip = zin_eindil_tt_war ${gflag('zin_west_grey_ford_war')} }`),
    'cost = 50', 'days_re_enable = 90',
    L('complete_effect', L('every_country', `limit = { OR = { original_tag = ${T_.gunwaith} original_tag = ${T_.girdon} } exists = yes }`, 'add_timed_idea = { idea = zin_eindil_ford_shunned days = 90 }', `country_event = { id = ${ev(33)} }`)),
    L('ai_will_do', 'base = 0'));
  D('zin_eindil_call_stranded', 'allowed = { always = yes }', L('visible', 'zin_eindil_is_host = yes', stageGe(9)),
    L('available', 'zin_eindil_is_host = yes', `custom_trigger_tooltip = { tooltip = zin_eindil_tt_stranded any_country = { OR = { has_country_flag = zin_west_stranded has_country_flag = zin_east_companies_with_eindil } NOT = { has_country_flag = zin_eindil_coalition_member } } }`),
    'cost = 50', 'days_re_enable = 90',
    L('complete_effect', L('every_country', 'limit = { OR = { has_country_flag = zin_west_stranded has_country_flag = zin_east_companies_with_eindil } NOT = { has_country_flag = zin_eindil_coalition_member } }', `country_event = { id = ${ev(94)} }`)),
    L('ai_will_do', 'base = 5'));
  dep('zin_east_companies_with_eindil', 'country flag', 'eastern_kings'); dep('zin_west_stranded', 'country flag', 'western_crossing (mech_crossing.mjs)');
  const palaceVisible = ['zin_eindil_is_host = yes', stage(11)];
  const palaceAvail = (...extra) => L('available', 'zin_eindil_is_host = yes', `custom_trigger_tooltip = { tooltip = zin_eindil_tt_recovered ${gflag('zin_eindil_recovered')} }`,
    `custom_trigger_tooltip = { tooltip = zin_eindil_tt_parim OR = { ${gflag('zin_afrit_claims_aoaz')} ${gflag('zin_afrit_stand_in_parim')} } NOT = { ${gflag('zin_afrit_dead')} } }`, ...extra);
  const allyAlleria = `any_country = { zin_eindil_coalition_ally = yes has_character = ${ch.alleria} }`;
  D('zin_eindil_find_passages', 'allowed = { always = yes }', L('visible', ...palaceVisible, notFlag('zin_palace_passages')), palaceAvail(),
    'cost = 50', 'days_remove = 30', L('remove_effect', 'set_global_flag = zin_palace_passages'), L('ai_will_do', 'base = 100'));
  D('zin_eindil_rally_rebels', 'allowed = { always = yes }', L('visible', ...palaceVisible, notFlag('zin_palace_rebels'), allyAlleria),
    palaceAvail(`custom_trigger_tooltip = { tooltip = zin_eindil_tt_passages ${gflag('zin_palace_passages')} }`),
    'cost = 75', 'days_remove = 45', L('remove_effect', 'set_global_flag = zin_palace_rebels'), L('ai_will_do', 'base = 100'));
  D('zin_eindil_rally_rebels_unaided', 'allowed = { always = yes }', L('visible', ...palaceVisible, notFlag('zin_palace_rebels'), L('NOT', allyAlleria)),
    palaceAvail(`custom_trigger_tooltip = { tooltip = zin_eindil_tt_passages ${gflag('zin_palace_passages')} }`),
    'cost = 150', 'days_remove = 45', L('remove_effect', 'set_global_flag = zin_palace_rebels'), L('ai_will_do', 'base = 100'));
  D('zin_eindil_enter_palace', 'allowed = { always = yes }', L('visible', ...palaceVisible),
    palaceAvail(`custom_trigger_tooltip = { tooltip = zin_eindil_tt_passages ${gflag('zin_palace_passages')} }`, `custom_trigger_tooltip = { tooltip = zin_eindil_tt_rebels ${gflag('zin_palace_rebels')} }`, `custom_trigger_tooltip = { tooltip = zin_eindil_tt_floor ${dateT('1759.3.1')} }`),
    'days_remove = 7', L('remove_effect', 'zin_afrit_begin_palace_battle = yes'), L('ai_will_do', 'base = 100'));
  dep('zin_afrit_begin_palace_battle', 'scripted effect', 'afrit_hidden_council');
  dep('zin_afrit_holds_parim', 'scripted trigger', 'afrit_hidden_council');
  dep('zin_afrit_reduced', 'scripted trigger', 'afrit_hidden_council (SL-09)');
  dep('zin_ending_heir_lost', 'scripted effect', 'events_crown (zin_ending.txt)');
  for (const f of ['zin_afrit_claims_aoaz', 'zin_afrit_stand_in_parim', 'zin_afrit_dead', 'zin_afrit_returned', 'zin_afrit_revealed']) dep(f, 'global flag', 'afrit_hidden_council');
  dep('zin_gala_great_ship', 'country flag', 'tree gala (read on any country, SL-20)');
  for (const f of ['zin_war_of_last_crowns', 'zin_zol_rising', 'zin_kusven_forth', 'zin_kusven_withdrawn']) dep(f, 'global flag', 'world systems / zols_mistake');
  dep('zin_volgan_body_destroyed', 'global flag', 'volgan_southern_dominion');
  dep('zin_world_is_dragon_keeper', 'scripted trigger', 'magic and world systems (04_magic_and_world_systems.md)');
  for (const f of ['zin_eindil_dragon_pact', 'zin_eindil_war_king', 'zin_eindil_named', 'zin_eindil_returned']) void f;

  // ============================================================================================ AI strategies
  const aiStrategies = [
    L('zin_eindil_host_fights_the_dead', 'allowed = { always = yes }', L('enable', 'zin_eindil_is_host = yes', stageGe(9), stageLt(12)), 'abort_when_not_enabled = yes',
      L('ai_strategy', 'type = front_unit_request', `tag = ${T_.zol}`, 'value = 100'),
      L('ai_strategy', 'type = front_unit_request', `tag = ${T_.volgan}`, 'value = 60'),
      L('ai_strategy', 'type = protect', `id = "${T_.aenor}"`, 'value = 50'),
      L('ai_strategy', 'type = conquer', `id = "${T_.zol}"`, 'value = 50'),
      L('ai_strategy', 'type = conquer', `id = "${T_.volgan}"`, 'value = 30')),
    L('zin_eindil_host_fights_the_false_god', 'allowed = { always = yes }', L('enable', 'zin_eindil_is_host = yes', gflag('zin_afrit_claims_aoaz')), 'abort_when_not_enabled = yes',
      L('ai_strategy', 'type = front_unit_request', `tag = ${T_.worshipdom}`, 'value = 100'),
      L('ai_strategy', 'type = invade', `id = "${T_.worshipdom}"`, 'value = 40')),
  ];

  // ============================================================================================ startup
  const startup = [
    'set_variable = { global.zin_eindil_day0 = global.num_days }',
    'set_variable = { global.zin_eindil_stage = 0 }', 'set_variable = { global.zin_eindil_renown = 0 }', 'set_variable = { global.zin_eindil_delay = 0 }',
    'set_variable = { global.zin_eindil_ports_betrayed = 0 }', 'set_variable = { global.zin_eindil_named_since = 0 }', 'set_variable = { global.zin_eindil_hall_done_since = 0 }',
    'set_variable = { global.zin_eindil_battle = 0 }', 'set_variable = { global.zin_eindil_battle_next = 0 }', 'set_variable = { global.zin_eindil_hold_until = 0 }',
    'set_variable = { global.zin_eindil_annex_at = 0 }', 'set_variable = { global.zin_eindil_wake_age = 400 }',
    `${T_.galaElves} = { country_event = { id = ${ev(1)} days = 2 } }`];
  return { triggers, effects, decisions, startup, aiStrategies, firedEvents: [...firedEvents].sort() };
}
