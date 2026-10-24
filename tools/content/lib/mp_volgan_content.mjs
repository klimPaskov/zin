// Ideas, characters, modifiers, decisions, events and rules of the Volgan and Mirolon mechanic
// (docs/specs/04_mechanics/volgan_southern_dominion.md, "Implementation").
import { num, ge, gt, lt, eq, call, ai } from './mp_kit.mjs';
import { spriteName } from '../modules/portraits.mjs';

export function writeContent(V) {
  const { K, T, N, VOL, MIR, HEREZ, ZOL, AEN, DON, GOLD, members, art, exists, gd, ST, VL, NP, PF, PS } = V;

  // ============================================================================================ spirits, modifiers, opinions
  const ideas = [
    ['zin_dominion_out_of_the_storms', 'storm_veil', { army_attack_factor: 0.15, breakthrough_factor: 0.1 }],
    ['zin_dominion_caught_unready', 'pass_fort', { army_org_factor: -0.1, army_defence_factor: -0.05 }],
    ['zin_dominion_forewarned', 'scout_lantern', { army_defence_factor: 0.1, max_dig_in: 3 }],
    ['zin_dominion_hold_the_passes', 'pass_fort', { army_defence_factor: 0.15, army_core_defence_factor: 0.05 }],
    ['zin_dominion_heeded_warning', 'beacon', { war_support_factor: 0.05, army_defence_factor: 0.03 }],
    ['zin_dominion_march_stalls', 'mountain_pass', { army_attack_factor: -0.1, war_support_factor: -0.1 }],
    ['zin_dominion_champion_falls', 'dead_crown', { army_morale_factor: 0.1, war_support_factor: 0.1 }],
    ['zin_dominion_broken_host', 'chain_broken', { army_org_factor: -0.3, army_morale_factor: -0.3, stability_factor: -0.2, recruitable_population_factor: -0.3 }],
    ['zin_dominion_silent_throne', 'silent_throne', { political_power_gain: -0.2, army_org_factor: -0.1 }],
    ['zin_dominion_seeking_own_road', 'chain_broken', { autonomy_gain: 0.5 }],
  ];
  K.add('common/ideas/zin_dominion.txt', `ideas = {\n\tcountry = {\n${ideas.map(([id, pic, mods]) => K.idea({ id, picture: `zin_${art(pic)}`, mods })).join('\n')}\n\t}\n}`);
  const dyn = (id, icon, mods) => { K.def('dynamic', id); K.loc.set(id, T.dynamic[id]); return `${id} = {\n\tenable = { always = yes }\n\ticon = GFX_idea_zin_${art(icon)}\n${Object.entries(mods).map(([k, v]) => `\t${k} = ${typeof v === 'number' ? num(v) : v}`).join('\n')}\n}`; };
  K.add('common/dynamic_modifiers/zin_dominion.txt', [
    dyn('zin_dominion_hosts', 'grave_host', { army_org_factor: 'zin_dominion_org', army_morale_factor: 'zin_dominion_morale', recruitable_population_factor: 'zin_dominion_recruit', training_time_army_factor: 'zin_dominion_training' }),
    dyn('zin_dominion_gate_scars', 'nether_gate', { local_manpower: N('nether.scar_manpower'), state_production_speed_buildings_factor: N('nether.scar_build') }),
  ].join('\n\n'));
  const op = [['zin_volgan_envoys_received', 20, { decay: 1 }], ['zin_volgan_envoys_refused', -20, { decay: 1 }], ['zin_mirolon_parim_laughed_opinion', -15, { decay: 1 }], ['zin_dominion_mirolon_friendship', 25, {}], ['zin_dominion_watch_with_mirolon', 10, { decay: 0.5 }]];
  K.add('common/opinion_modifiers/zin_dominion.txt', `opinion_modifiers = {\n${op.map(([id, v, o]) => { if (!T.opinions[id]) throw new Error(`no text for opinion ${id}`); K.loc.set(id, T.opinions[id]); return K.opinion(id, v, o).replace(/^/gm, '\t'); }).join('\n')}\n}`);

  // ============================================================================================ characters and the trait
  const chars = T.characters;
  const portrait = (c, role) => `portraits = {\n\t\t\t${role} = {\n\t\t\t\tlarge = ${spriteName(c.people, c.female, c.n)}\n\t\t\t}\n\t\t}`;
  const general = (id, c) => { K.def('character', id); K.loc.set(id, c.name); return `\t${id} = {\n\t\tname = ${id}\n\t\t${portrait(c, 'army')}\n\t\tcorps_commander = {\n\t\t\ttraits = { ${c.traits.join(' ')} }\n\t\t\tskill = ${c.skill}\n\t\t\tattack_skill = ${c.attack}\n\t\t\tdefense_skill = ${c.defence}\n\t\t\tplanning_skill = ${c.planning}\n\t\t\tlogistics_skill = ${c.logistics}\n\t\t}\n\t}`; };
  const leader = (id, c) => { K.def('character', id); K.loc.set(id, c.name); return `\t${id} = {\n\t\tname = ${id}\n\t\t${portrait(c, 'civilian')}\n\t}`; };
  const advisor = (id, c) => { K.def('character', id); K.loc.set(id, c.name); K.loc.set(`${id}_desc`, c.desc); return `\t${id} = {\n\t\tname = ${id}\n\t\t${portrait(c, 'civilian')}\n\t\tadvisor = {\n\t\t\tslot = political_advisor\n\t\t\tidea_token = ${id}\n\t\t\tcost = 100\n\t\t\ttraits = { zin_adv_whisper_master }\n\t\t}\n\t}`; };
  const list = [
    general('zin_volgan_ember_herald', chars.zin_volgan_ember_herald), general('zin_volgan_grave_warden', chars.zin_volgan_grave_warden), general('zin_volgan_ghorvak', chars.zin_volgan_ghorvak),
    leader('zin_mirolon_maeric', chars.zin_mirolon_maeric), general('zin_mirolon_selda', chars.zin_mirolon_selda), advisor('zin_mirolon_hadric', chars.zin_mirolon_hadric),
  ];
  if (V.defineVolgan) list.push(leader('zin_volgan', chars.zin_volgan));
  K.add('common/characters/zin_dominion.txt', `characters = {\n${list.join('\n')}\n}`);
  K.def('trait', 'zin_trait_great_spirit_in_arms'); K.loc.set('zin_trait_great_spirit_in_arms', T.trait.n); K.loc.set('zin_trait_great_spirit_in_arms_desc', T.trait.d);
  K.add('common/unit_leader/zin_dominion_traits.txt', `leader_traits = {\n\tzin_trait_great_spirit_in_arms = {\n\t\ttype = land\n\t\ttrait_type = status_trait\n\t\tattack_skill = 1\n\t\tdefense_skill = 1\n\t\tmodifier = {\n\t\t\tarmy_attack_factor = 0.1\n\t\t\tarmy_org_factor = 0.1\n\t\t}\n\t}\n}`);

  // ============================================================================================ decisions
  const onlyVol = `original_tag = ${VOL}`, onlyMir = `original_tag = ${MIR}`;
  const recent = flag => `NOT = { has_country_flag = ${flag} }`;
  // A decision that costs Authority and Orders: the native cost row cannot hold both, so a custom cost row does.
  const orders = (pp, cpv) => ({ trigger: `has_political_power > ${pp - 1}\ncommand_power > ${cpv - 1}`, text: `zin_dominion_cost_${pp}_${cpv}` });
  K.add('common/decisions/categories/zin_dominion.txt', [
    K.category('zin_dominion_grave_musters', art('grave_host'), { visible: 'zin_is_volgan = yes\nhas_country_flag = zin_volgan_musters_open' }),
    K.category('zin_dominion_court', art('banner_black'), { visible: 'zin_is_volgan = yes' }),
    K.category('zin_dominion_mirolon_watch', art('scout_lantern'), { visible: 'zin_is_mirolon = yes\nhas_country_flag = zin_mirolon_watch_open' }),
  ].join('\n'));
  const musters = [], court = [], watch = [];
  const schedule = `check_variable = { var = ${ST} value = zin_volgan_muster_schedule compare = less_than }`;
  const musterAi = ai(0, [{ add: 60, when: `has_political_power > ${N('ai.muster_pp') - 1}\n${schedule}` }]);
  musters.push(K.decision({ id: 'zin_dominion_wake_old_barrows', icon: art('grave_field'), allowed: onlyVol, available: recent('zin_dominion_barrows_wait'), cost: N('muster.barrows_cost'), cooldown: N('muster.barrows_cd'),
    complete: `${call('zin_volgan_add_dominion_strength', { value: N('muster.barrows_strength') })}\nadd_manpower = ${N('muster.barrows_levies')}\n${call('zin_volgan_add_veil', { value: N('muster.barrows_veil') })}\nzin_volgan_muster_done = yes`, ai: musterAi }));
  musters.push(K.decision({ id: 'zin_dominion_muster_beneath_the_storms', icon: art('storm_veil'), allowed: onlyVol, available: `${ge(ST, N('muster.storms_at'))}\n${ge(VL, N('muster.storms_veil_floor'))}`, cost: N('muster.storms_cost'), cooldown: N('muster.storms_cd'),
    complete: `${call('zin_volgan_add_dominion_strength', { value: N('muster.storms_strength') })}\nzin_volgan_muster_done = yes`, ai: musterAi }));
  musters.push(K.decision({ id: 'zin_dominion_raise_a_grave_host', icon: art('grave_host'), allowed: onlyVol, available: ge(ST, N('muster.host_at')), custom_cost: orders(N('muster.host_cost'), N('muster.host_orders')), ai_hint_pp_cost: N('muster.host_cost'), cooldown: N('muster.host_cd'),
    complete: `add_political_power = -${N('muster.host_cost')}\nadd_command_power = -${N('muster.host_orders')}\n${call('zin_volgan_spawn_grave_host', { count: N('muster.host_divisions'), where: 0 })}\n${call('zin_volgan_add_veil', { value: N('muster.host_veil') })}\nzin_volgan_muster_done = yes`,
    ai: ai(0, [{ add: 40, when: `${ge(ST, N('ai.host_at'))}\nNOT = { num_divisions > ${N('ai.host_max_divisions') - 1} }` }]) }));
  musters.push(K.decision({ id: 'zin_dominion_bind_the_restless', icon: art('bones_risen'), allowed: onlyVol, visible: 'has_country_flag = zin_volgan_bind_open', available: 'has_war = yes', cost: N('muster.bind_cost'), cooldown: N('muster.bind_cd'),
    complete: `${call('zin_volgan_add_dominion_strength', { value: N('muster.bind_strength') })}\nzin_volgan_muster_done = yes`, ai: ai(0, [{ add: 40, when: 'has_war = yes' }]) }));
  musters.push(K.decision({ id: 'zin_dominion_wake_old_battlefields', icon: art('dead_ranks_far'), allowed: onlyVol, visible: 'has_country_flag = zin_volgan_battlefields_open', available: `has_global_flag = zin_volgan_marches\n${ge('zin_dominion_middle_held', N('muster.battle_states'))}`, custom_cost: orders(N('muster.battle_cost'), N('muster.battle_orders')), ai_hint_pp_cost: N('muster.battle_cost'), cooldown: N('muster.battle_cd'),
    complete: `add_political_power = -${N('muster.battle_cost')}\nadd_command_power = -${N('muster.battle_orders')}\nrandom_controlled_state = {\nlimit = { zin_dominion_is_middle_lands_state = yes }\nset_temp_variable = { zin_arg_where = THIS }\n}\n${call('zin_volgan_spawn_grave_host', { count: N('muster.battle_divisions'), where: 'zin_arg_where' })}\n${call('zin_volgan_add_dominion_strength', { value: N('muster.battle_strength') })}\nzin_volgan_muster_done = yes`,
    ai: ai(0, [{ add: 40, when: 'has_war = yes' }]) }));
  court.push(K.decision({ id: 'zin_dominion_summon_the_dominion', icon: art('banner_black'), allowed: onlyVol, available: recent('zin_dominion_summoned'), cost: N('court.summon_cost'), cooldown: N('court.summon_cd'),
    complete: `${call('zin_volgan_add_oath', { target: -1, value: N('court.summon') })}\nset_country_flag = { flag = zin_dominion_summoned days = 180 }`,
    ai: ai(0, [{ add: 70, when: `OR = {\n${members.map(m => `${m} = { ${lt('zin_dominion_oath', N('ai.oath_below'))} }`).join('\n')}\n}` }]) }));
  const memberTarget = 'FROM = {\nzin_dominion_is_member = yes\nis_subject_of = ROOT\n}';
  court.push(K.decision({ id: 'zin_dominion_demand_tribute', icon: art('tribute_chest'), allowed: onlyVol, targeted: { root: 'has_country_flag = zin_volgan_court_open', trigger: memberTarget }, visible: 'has_country_flag = zin_volgan_court_open', cooldown: N('court.tribute_cd'),
    complete: `${call('zin_volgan_add_dominion_strength', { value: N('court.tribute_strength') })}\nFROM = {\nset_temp_variable = { zin_arg_target = THIS }\n${call('zin_volgan_add_oath', { target: 'zin_arg_target', value: N('court.tribute_oath') })}\n}`,
    ai: ai(0, [{ add: 25, when: `FROM = { ${ge('zin_dominion_oath', 55)} }` }]) }));
  const giveSpoils = members.map(m => `if = {\nlimit = { FROM = { original_tag = ${m} } }\nrandom_owned_state = {\nlimit = { NOT = { is_core_of = ROOT } }\ntransfer_state_to = ${m}\n}\n}`).join('\n');
  court.push(K.decision({ id: 'zin_dominion_grant_spoils', icon: art('tribute_chest'), allowed: onlyVol, targeted: { root: 'has_country_flag = zin_volgan_court_open', trigger: memberTarget }, visible: 'has_country_flag = zin_volgan_court_open',
    available: 'any_owned_state = { NOT = { is_core_of = ROOT } }\nFROM = { NOT = { has_country_flag = zin_dominion_spoils_wait } }', cooldown: N('court.spoils_cd_flag'),
    complete: `${giveSpoils}\nFROM = {\nset_temp_variable = { zin_arg_target = THIS }\n${call('zin_volgan_add_oath', { target: 'zin_arg_target', value: N('court.spoils_oath') })}\nif = {\nlimit = { NOT = { ${VOL} = { has_country_flag = zin_volgan_spoils_promised } } }\nset_country_flag = { flag = zin_dominion_spoils_wait days = ${N('court.spoils_cd') - N('court.spoils_cd_flag')} }\n}\n}`,
    ai: ai(0, [{ add: 15, when: `FROM = { ${lt('zin_dominion_oath', 45)} }` }]) }));
  court.push(K.decision({ id: 'zin_dominion_nether_gate', icon: art('nether_gate'), allowed: onlyVol, state_trigger: 'any',
    targeted: { root: 'has_war = yes\nhas_country_flag = zin_volgan_gate_pact', trigger: `FROM = {\nNOT = { is_controlled_by = ROOT }\ncontroller = { has_war_with = ROOT }\nany_neighbor_state = { controller = { OR = { original_tag = ${VOL} is_subject_of = ${VOL} } } }\n}` },
    visible: 'has_country_flag = zin_volgan_gate_pact', available: `${ge(NP, N('nether.gate_pact'))}\nhas_war = yes`, cost: 'zin_dominion_gate_cost', cooldown: N('nether.gate_cd'),
    complete: `FROM = {
damage_building = { type = infrastructure damage = ${N('nether.infra_damage')} }
if = {
limit = { NOT = { is_controlled_by = OWNER } }
add_resistance = ${N('nether.resistance')}
}
add_dynamic_modifier = { modifier = zin_dominion_gate_scars days = ${N('nether.scars_days')} }
}
${call('zin_volgan_add_nether_pact', { value: -N('nether.gate_pact') })}
if = {
limit = { ${gt('zin_volgan_free_gates', 0)} }
add_to_variable = { zin_volgan_free_gates = -1 }
}
country_event = { id = zin_dominion.21 }`, ai: ai(0, [{ add: 60, when: 'has_war = yes' }]) }));
  court.push(K.decision({ id: 'zin_dominion_descend_again', icon: art('abyss_stair'), allowed: onlyVol,
    visible: 'has_completed_focus = zin_volgan_descend_into_the_abyss\nNOT = { has_country_flag = zin_volgan_abyss_answered }', available: recent('zin_volgan_abyss_wait'), cost: N('abyss.again_cost'),
    complete: 'zin_volgan_abyss_wait = yes\ncountry_event = { id = zin_volgan.8 }', ai: ai(30) }));
  court.push(K.decision({ id: 'zin_dominion_silence_the_watchers', icon: art('eye_watchful'), allowed: onlyVol, visible: 'has_country_flag = zin_volgan_silence_open', available: exists(MIR), cost: N('mirolon.silence_cost'), cooldown: N('mirolon.silence_cd'),
    complete: `${call('zin_mirolon_add_proof', { value: N('mirolon.silence_proof') })}\n${call('zin_volgan_add_veil', { value: N('veil.silence') })}\n${MIR} = { country_event = { id = zin_dominion.7 } }`,
    ai: ai(0, [{ add: 60, when: `${exists(MIR)}\n${MIR} = { ${ge(PF, N('ai.silence_proof'))} }` }]) }));
  court.push(K.decision({ id: 'zin_dominion_make_a_client_crown', icon: art('crown_broken'), allowed: onlyVol, visible: 'has_country_flag = zin_volgan_client_crowns',
    targeted: { root: 'has_country_flag = zin_volgan_client_crowns', trigger: `FROM = {
OR = {
zin_dominion_is_ember_lands_country = yes
${V.middle.map(c => `original_tag = ${c.tag}`).join('\n')}
}
OR = {
AND = {
exists = yes
has_capitulated = yes
capital_scope = { controller = { original_tag = ${VOL} } }
}
AND = {
exists = no
any_state = {
is_core_of = PREV
controller = { original_tag = ${VOL} }
}
}
}
}` },
    cost: N('court.client_cost'), cooldown: N('court.client_cd'),
    complete: `set_temp_variable = { zin_arg_target = FROM }\nzin_volgan_make_client = yes\n${call('zin_volgan_add_oath', { target: -1, value: N('war.client_oath') })}`, ai: ai(0, [{ add: 40, when: 'always = yes' }]) }));
  court.push(K.decision({ id: 'zin_dominion_send_envoys', icon: art('envoy'), allowed: onlyVol,
    targeted: { root: 'has_country_flag = zin_volgan_envoys_open', trigger: 'FROM = {\nzin_dominion_is_dark_lands_country = yes\nNOT = { is_subject_of = ROOT }\nNOT = { has_war_with = ROOT }\n}' },
    visible: 'has_country_flag = zin_volgan_envoys_open', cost: 'zin_volgan_envoy_cost', cooldown: N('dark.envoy_cd'), days_remove: N('dark.envoy_days'),
    remove: 'FROM = {\nset_variable = { zin_volgan_offer_level = 1 }\ncountry_event = { id = zin_dominion.8 }\n}',
    ai: ai(15, [{ add: 50, when: 'FROM = { zin_dominion_is_bound_by_the_dead = yes }' }, { factor: 0, when: 'has_global_flag = zin_volgan_body_destroyed' }]) }));
  watch.push(K.decision({ id: 'zin_dominion_send_scouts_south', icon: art('scout_lantern'), allowed: onlyMir, cost: N('mirolon.scout_pp'), cooldown: N('mirolon.scout_cd'),
    complete: `set_country_flag = { flag = zin_dominion_cd_scout days = ${N('mirolon.scout_cd')} }\nzin_mirolon_scout = yes`, ai: ai(0, [{ add: 60, when: `has_political_power > ${N('ai.mirolon_scout_pp') - 1}\n${lt(PF, N('mirolon.ai_proof_scout'))}` }]) }));
  watch.push(K.decision({ id: 'zin_dominion_send_word_to_parim', icon: art('envoy'), allowed: onlyMir, available: ge(PF, N('mirolon.word_proof')), cost: N('mirolon.word_cost'), cooldown: N('mirolon.word_cd'),
    complete: `set_country_flag = { flag = zin_dominion_cd_word days = ${N('mirolon.word_cd')} }\nzin_aenor_event_for_parim = yes\nevent_target:zin_aenor_parim_realm = { country_event = { id = zin_dominion.5 } }`,
    ai: ai(0, [{ add: 50, when: ge(PF, 25) }, { add: 30, when: ge(PF, 50) }]) }));
  watch.push(K.decision({ id: 'zin_dominion_raise_the_pass_forts', icon: art('pass_fort'), allowed: onlyMir, available: lt(PS, 100), cost: N('mirolon.forts_cost'), cooldown: N('mirolon.forts_cd'),
    complete: `set_country_flag = { flag = zin_dominion_cd_forts days = ${N('mirolon.forts_cd')} }\n${call('zin_mirolon_add_passes', { value: N('mirolon.forts_passes') })}`, ai: ai(0, [{ add: 50, when: lt(PS, N('mirolon.hold_passes')) }]) }));
  K.add('common/decisions/zin_dominion.txt', Object.entries({ zin_dominion_grave_musters: musters, zin_dominion_court: court, zin_dominion_mirolon_watch: watch }).map(([c, l]) => `${c} = {\n${l.join('\n')}\n}`).join('\n'));

  // ============================================================================================ events
  const evs = [];
  const EV = spec => evs.push(K.event(spec));
  const offer = 'zin_volgan_offer_level';
  const acceptFactors = [
    { factor: 0, when: 'has_government = democratic' },
    { factor: 2, when: 'OR = {\nhas_government = communism\nhas_government = fascism\n}' },
    { factor: 2, when: 'zin_dominion_is_bound_by_the_dead = yes' },
    { factor: 2, when: `any_enemy_country = { ${VOL} = { has_war_with = PREV } }` },
    { factor: 0, when: 'zin_goldoroth_refuses_masters = yes' },
    { factor: 4, when: 'zin_goldoroth_seeks_the_south = yes' },
    { factor: 0.1, when: `original_tag = ${DON}` },
    { factor: 0, when: `zin_dark_hold_under_cocanoor = yes\n${GOLD} = { zin_goldoroth_refuses_masters = yes }` },
    { factor: 2, when: `zin_dark_hold_under_cocanoor = yes\n${GOLD} = { zin_goldoroth_seeks_the_south = yes }` },
    { factor: 0.5, when: 'zin_dark_hold_in_moot = yes' },
    { factor: 1.5, when: 'zin_dark_hold_fears_cocanoor = yes' },
    { factor: 1.5, when: 'zin_dark_took_southern_gifts = yes' },
    { factor: 2, when: 'zin_dark_hold_at_war_with_goldoroth = yes' },
    { factor: 0, when: 'has_global_flag = zin_volgan_body_destroyed' },
  ];
  EV({ id: 'zin_dominion.1', kind: 'hidden', immediate: 'zin_dominion_startup = yes' });
  EV({ id: 'zin_dominion.2', kind: 'country', pic: 'ember_lands_storm', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_dominion.3', kind: 'country', pic: 'southern_warning', options: [
    { effect: `add_opinion_modifier = { target = ${MIR} modifier = zin_dominion_watch_with_mirolon }`, ai: ai(50, [{ add: 30, when: `original_tag = ${HEREZ}` }]) },
    { ai: ai(50) }] });
  EV({ id: 'zin_dominion.4', kind: 'news', pic: 'ember_lands_storm', options: [{ ai: ai(100) }] });
  const pr = N('mirolon');
  const heed = n => ({ add: 10, when: `${MIR} = { ${ge(PF, n)} }` });
  const suspected = { factor: 1.25, when: ge('global.zin_volgan_veil_band', 2) };
  const hist = 'zin_rules_is_historical = yes', notHist = 'NOT = { zin_rules_is_historical = yes }';
  EV({ id: 'zin_dominion.5', kind: 'country', pic: 'southern_warning', options: [
    { effect: `add_political_power = ${pr.laugh_pp}\n${MIR} = {\nadd_opinion_modifier = { target = ${AEN} modifier = zin_mirolon_parim_laughed_opinion }\nset_country_flag = zin_mirolon_parim_laughed\n}`,
      ai: ai(100, [...[20, 40, 60, 80, 100].map(n => ({ add: 40, when: `${notHist}\n${ge('zin_court_corruption', n)}` })), { add: 50, when: `${notHist}\n${VOL} = { has_country_flag = zin_volgan_whispers_parim }` }]) },
    { effect: `send_equipment = { equipment = zin_arms_equipment amount = ${pr.heard_equipment} target = ${MIR} }\n${MIR} = { add_timed_idea = { idea = zin_dominion_heeded_warning days = ${pr.heard_days} } }\nadd_political_power = -${pr.heeded_pp}`,
      ai: ai(20, [...[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(heed), { factor: 0, when: hist }, suspected]) },
    { effect: `give_guarantee = ${MIR}\n${gd(pr.guarantee_gd)}`,
      ai: ai(0, [...[50, 60, 70, 80, 90, 100].map(heed), { factor: 3, when: `${MIR} = { has_country_flag = zin_mirolon_north_listens }` }, { factor: 0, when: hist }, suspected]) },
  ] });
  EV({ id: 'zin_dominion.6', kind: 'country', pic: 'mirolon_passes', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_dominion.7', kind: 'country', pic: 'mirolon_passes', options: [
    { effect: call('zin_mirolon_add_passes', { value: 3 }), ai: ai(60) },
    { effect: 'add_stability = 0.02', ai: ai(40) }] });
  EV({ id: 'zin_dominion.8', kind: 'country', pic: 'ember_lands_storm', options: [
    { effect: `if = {
limit = { check_variable = { var = zin_volgan_pact value = ${offer} compare = less_than } }
if = {
limit = { ${eq(offer, 3)} }
set_temp_variable = { zin_dominion_t_sworn = 0 }
every_country = {
limit = {
zin_dominion_is_dark_lands_country = yes
${eq('zin_volgan_pact', 3)}
}
add_to_temp_variable = { zin_dominion_t_sworn = 1 }
}
if = {
limit = { ${lt('zin_dominion_t_sworn', N('dark.sworn_max'))} }
set_variable = { zin_volgan_pact = ${offer} }
}
}
else = {
set_variable = { zin_volgan_pact = ${offer} }
}
}
add_opinion_modifier = { target = ${VOL} modifier = zin_volgan_envoys_received }
${VOL} = {
set_country_flag = zin_dominion_envoy_accepted
country_event = { id = zin_dominion.9 }
}`, ai: ai(N('dark.ai_base'), acceptFactors) },
    { effect: `if = {
limit = { ${eq('zin_volgan_pact', 0)} }
add_opinion_modifier = { target = ${VOL} modifier = zin_volgan_envoys_refused }
}
${VOL} = {
clr_country_flag = zin_dominion_envoy_accepted
country_event = { id = zin_dominion.9 }
}`, ai: ai(80) },
  ] });
  EV({ id: 'zin_dominion.9', kind: 'country', pic: 'generic_court', descs: [{ key: 'accepted', trigger: 'has_country_flag = zin_dominion_envoy_accepted' }], options: [{ effect: 'clr_country_flag = zin_dominion_envoy_accepted', ai: ai(100) }] });
  EV({ id: 'zin_dominion.20', kind: 'country', pic: 'mirolon_passes', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_dominion.21', kind: 'country', pic: 'ember_lands_storm', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_dominion.22', kind: 'country', pic: 'generic_court', options: [
    { effect: `set_temp_variable = { zin_arg_target = THIS }\n${call('zin_volgan_add_oath', { target: 'zin_arg_target', value: N('court.renew') })}\nadd_political_power = -${N('court.falter_cost')}`, ai: ai(40, [{ add: 40, when: ge('zin_dominion_oath', 15) }]) },
    { effect: `set_country_flag = zin_dominion_own_road\nadd_timed_idea = { idea = zin_dominion_seeking_own_road days = ${N('court.own_road_days')} }\n${VOL} = { add_stability = ${num(N('court.own_road_stability'))} }`, ai: ai(30, [{ add: 30, when: lt('zin_dominion_oath', 15) }]) }] });
  EV({ id: 'zin_dominion.25', kind: 'country', pic: 'ember_lands_storm',
    trigger: 'has_game_rule = { rule = zin_rule_volgan_spirit option = STIRRING }\nzin_is_volgan = yes',
    immediate: `set_global_flag = zin_dominion_stirred\nset_variable = { ${ST} = 30 }\nzin_volgan_refresh_strength = yes\nif = {\nlimit = { NOT = { has_character = zin_volgan } }\nrecruit_character = zin_volgan\n}\nadd_country_leader_role = {\ncharacter = zin_volgan\npromote_leader = yes\ncountry_leader = { ideology = zin_shadow_dread expire = "1965.1.1.1" traits = { zin_trait_dread_lord } }\n}`,
    options: [{ ai: ai(100) }] });
  EV({ id: 'zin_dominion.26', kind: 'country', pic: 'volgan_broken', trigger: `has_war_with = ${VOL}\nhas_global_flag = zin_volgan_body_destroyed`, options: [
    { effect: `white_peace = ${VOL}`, ai: ai(80, [{ add: 20, when: hist }]) },
    { ai: ai(20, [{ factor: 0, when: hist }]) }] });
  EV({ id: 'zin_dominion.27', kind: 'news', pic: 'ember_lands_storm', options: [{ ai: ai(100) }] });
  EV({ id: 'zin_dominion.28', kind: 'country', pic: 'generic_court', options: [
    { effect: 'set_temp_variable = { zin_arg_target = THIS }\nzin_volgan_make_client = yes', ai: ai(60) },
    { effect: 'clr_country_flag = zin_dominion_tributary_friend', ai: ai(40) }] });
  K.add('events/zin_dominion.txt', `add_namespace = zin_dominion\n\n${evs.join('\n\n')}`);

  // ============================================================================================ game rules
  const rules = [['zin_rule_volgan_spirit', ['UNRESOLVED', 'STIRRING']], ['zin_rule_volgan_early_war', ['DEFAULT', 'AI_HISTORICAL', 'AI_FREE']]];
  K.add('common/game_rules/zin_dominion.txt', rules.map(([id, opts]) => {
    K.def('rule', id);
    const t = T.rules[id], key = id.toUpperCase();
    K.loc.set(`ZIN_${key}`, t.name); K.loc.set(`ZIN_${key}_DESC`, t.desc);
    return `${id} = {\n\tname = ZIN_${key}\n\tdesc = ZIN_${key}_DESC\n\tgroup = RULE_GROUP_ZIN\n${opts.map((o, i) => { const k = `ZIN_${key}_${o}`; K.loc.set(k, t.options[o].n); K.loc.set(`${k}_DESC`, t.options[o].d); return `\t${i === 0 ? 'default' : 'option'} = {\n\t\tname = ${o}\n\t\ttext = ${k}\n\t\tdesc = ${k}_DESC\n\t}`; }).join('\n')}\n}`;
  }).join('\n'));
}
