// ZIN mechanic module: the West Lands and the Western Crossing (docs/specs/04_mechanics/western_crossing.md). The old grudge, the Truce of the
// Grey Ford and its feud, the Ford Council, unity, resolve and the course, the fleet, the Call to Cross and the sailings, Parim, the strain,
// the evacuation and the stranded, Eindil's coalition, and every event of namespace `zin_west`. Integration note: docs/design/stage2/mech_journey.md.
//
//   const result = await buildWesternCrossing(staged, { countries });
//
// ctx.countries    the roster; countries are named in the data and resolved to tags
// ctx.westData     optional replacement of tools/content/data/mech_journey_west.json (negative tests)
// ctx.geography    optional replacement of tools/content/data/mech_journey_geography.json
import { cw, raw } from '../lib/core.mjs';
import { HEADER, L, render, fileText, comment, readJson, makeRoster, Loc, ScriptSet, eventLines, dateAfter, paceOr, shiftDate } from '../lib/mech_journey_lib.mjs';

const EVT = k => `GFX_zin_evt_${k}`;
const NEWS = k => `GFX_zin_news_${k}`;

export async function buildWesternCrossing(staged, ctx = {}) {
  const data = ctx.westData ?? await readJson('mech_journey_west.json');
  const geo = ctx.geography ?? await readJson('mech_journey_geography.json');
  const economy = await readJson('economy.json');
  const roster = makeRoster(ctx.countries);
  const TAG = Object.fromEntries(Object.entries(data.countries).map(([k, name]) => [k, roster.tag(name)]));
  const C = data.constants, ev = data.events;
  const loc = new Loc('zin_west');
  const scripts = new ScriptSet();
  const files = [];
  const put = (rel, text) => { staged.text(rel, text); files.push(rel); };
  const defs = { events: [], effects: [], triggers: [], ideas: [], decisions: [], categories: [], opinions: [], dynamicModifiers: [], rules: [] };
  const dep = (name, kind, owner) => scripts.depend(name, kind, owner);
  const K = k => { if (!(k in C)) throw new Error(`Unknown West constant ${k}`); return `constant:zin_west.${k}`; };
  const gflag = f => `has_global_flag = ${f}`;
  const notFlag = f => `NOT = { has_global_flag = ${f} }`;
  const westCountries = roster.countries.filter(c => economy.regionByRoster[c.scan] === 'west_lands');
  const anchors = [...westCountries].sort((a, b) => (b.name === 'Gunwyn') - (a.name === 'Gunwyn') || b.states - a.states || a.name.localeCompare(b.name)).map(c => c.tag);
  const T_ = TAG;
  const FOE = 'event_target:zin_west_foe';
  const LEADER = 'var:global.zin_west_convener';
  const ml = geo.mainland.concat(geo.isle.map(i => i.id));
  const mlList = ml.join(' ');
  const mainList = geo.mainland.join(' ');
  const tpl = data.template;

  // ---------------------------------------------------------------------------------------------- constants, ideas, modifiers
  put('common/script_constants/zin_west_constants.txt', `${HEADER}\n# Tuning of the Western Crossing (tools/content/data/mech_journey_west.json). Integers; hundredths where a fraction is meant.\nzin_west = {\n\tschema = {\n\t\tany_key = yes\n\t\tdata = int\n\t}\n\n${Object.entries(C).map(([k, v]) => `\t${k} = ${v}`).join('\n')}\n}\n`);
  const ideas = {};
  for (const s of data.spirits) { ideas[s.id] = { picture: `zin_${s.icon}`, allowed: raw('{ always = no }'), allowed_civil_war: raw('{ always = yes }'), removal_cost: -1, modifier: s.modifier }; loc.add(s.id, s.name); loc.add(`${s.id}_desc`, s.desc); defs.ideas.push(s.id); }
  put('common/ideas/zin_west.txt', `${HEADER}\nideas = {\n\tcountry = {\n${cw(ideas, 2)}\t}\n}\n`);
  const dyn = {};
  for (const m of data.dynamicModifiers) { dyn[m.id] = { icon: `GFX_idea_zin_${m.icon}`, ...m.modifier }; loc.add(m.id, m.name); defs.dynamicModifiers.push(m.id); }
  put('common/dynamic_modifiers/zin_west.txt', `${HEADER}\n${cw(dyn)}`);
  const opin = {};
  for (const o of data.opinionModifiers) { opin[o.id] = { value: o.value, ...(o.decay ? { decay: o.decay } : {}) }; loc.add(o.id, o.name); defs.opinions.push(o.id); }
  put('common/opinion_modifiers/zin_west.txt', `${HEADER}\nopinion_modifiers = {\n${cw(opin, 1)}}\n`);

  // ---------------------------------------------------------------------------------------------- triggers
  const triggerDefs = [], effectDefs = [];
  const T = (name, ...body) => { triggerDefs.push({ name, body }); scripts.add(name, 'trigger', body); defs.triggers.push(name); };
  const E = (name, ...body) => { effectDefs.push({ name, body }); scripts.add(name, 'effect', body); defs.effects.push(name); };
  for (const n of ['zin_rules_is_historical']) dep(n, 'scripted trigger', 'foundation rules (rules.mjs)');
  T('zin_west_is_western', 'has_country_flag = zin_region_west_lands');
  dep('zin_region_west_lands', 'country flag', 'economy slice (set on startup)');
  T('zin_west_historical', L('OR', 'has_game_rule = { rule = zin_rule_west_route option = historical }', L('AND', 'has_game_rule = { rule = zin_rule_west_route option = DEFAULT }', 'zin_rules_is_historical = yes')));
  T('zin_west_in_crossing', L('OR', 'has_country_flag = zin_west_pledged', L(LEADER, 'tag = PREV')));
  T('zin_west_is_leader', 'has_variable = global.zin_west_convener', L(LEADER, 'tag = PREV'));
  T('zin_west_council_can_meet', notFlag('zin_west_grey_ford_war'), L('OR', gflag('zin_eindil_war_king'), gflag('zin_west_truce_permanent'), 'date > 1751.3.1'));
  T('zin_west_question_open', gflag('zin_west_council'), `check_variable = { global.zin_west_unity > ${C.question_unity - 1} }`);
  T('zin_west_crossing_ready',
    gflag('zin_west_route_crossing'), `check_variable = { global.zin_west_pledged_count > 2 }`,
    `check_variable = { global.zin_west_fleet > ${C.fleet_cross_at - 1} }`, `check_variable = { global.zin_west_resolve > ${C.resolve_cross_at - 1} }`,
    L('OR', gflag('zin_war_of_last_crowns'), L('AND', 'date > 1754.3.1', `check_variable = { global.zin_west_resolve > ${C.resolve_early_at - 1} }`, L('any_country', 'zin_aenor_is_realm = yes', L('OR', 'has_civil_war = yes', 'has_war = yes')))));
  T('zin_west_controls_parim', L('any_state', 'zin_is_site_parim = yes', L('controller', 'zin_west_in_crossing = yes')));
  T('zin_west_holds_aenor_states', L('any_state', L('owner', 'zin_aenor_is_realm = yes'), L('controller', 'zin_west_in_crossing = yes')));
  T('zin_west_strain_high', `check_variable = { global.zin_west_strain > ${C.strain_shore_calls - 1} }`);
  T('zin_west_has_divisions_in_middle_lands', `num_divisions_in_states = { count > 0 states = { ${mlList} } }`);
  // paced floor dates (R2), each an OR of the three story-pace branches
  for (const [k, d] of [['truce_break', '1750.4.1'], ['keys_of_parim', '1756.5.1'], ['shore_calls', '1756.11.1'], ['shore_calls_late', '1756.12.1']]) T(`zin_west_past_${k}`, dateAfter(d));
  // the anchor: the first existing country of the list
  T('zin_west_is_anchor', L('OR', ...anchors.map((tag, i) => L('AND', `tag = ${tag}`, ...anchors.slice(0, i).map(p => `${p} = { exists = no }`)))));
  for (const [n, k, o] of [['zin_aenor_is_realm', 'scripted trigger', 'aenor_court_and_succession'], ['zin_is_site_parim', 'state trigger', 'key sites (sites.mjs, E7)'], ['zin_controls_sea_central', 'scripted trigger', 'key sites (sites.mjs, E7)'], ['zin_aenor_fallback_seat', 'state trigger', 'key sites (sites.mjs, E7)'], ['zin_afrit_is_hub', 'scripted trigger', 'afrit_hidden_council'], ['zin_afrit_rules_here', 'scripted trigger', 'afrit_hidden_council']]) dep(n, k, o);
  for (const f of ['zin_war_of_last_crowns', 'zin_eindil_war_king', 'zin_eindil_returned', 'zin_eindil_named', 'zin_golden_king_dead', 'zin_aurevan_crowned', 'zin_afrit_dead', 'zin_eindil_crowned', 'zin_afrit_king_of_east', 'zin_afrit_revealed', 'zin_zol_rising', 'zin_volgan_marches', 'zin_eastern_invasion']) dep(f, 'global flag', 'world systems / the owning mechanic');
  for (const f of ['zin_leren_withdrawal', 'zin_leren_treaty_honoured']) dep(f, 'global flag', 'lerendor_narrow_strait');
  dep('zin_leren_treaty_in_force', 'scripted trigger', 'lerendor_narrow_strait');
  // A Western Crown in Parim holds (SL-19, outcome 5 of the endings): a West Lands realm, or a subject of one, controls Parim, and its
  // leader has claimed the throne of men or no Aenor realm is left to dispute it.
  T('zin_west_holds_parim',
    L('any_state', 'zin_is_site_parim = yes', L('controller', L('OR', 'zin_west_is_western = yes', L('AND', 'is_subject = yes', L('OVERLORD', 'zin_west_is_western = yes'))))),
    L('OR', gflag('zin_west_throne_claimed'), L('NOT', L('any_country', 'zin_aenor_is_realm = yes'))));
  // The Wall Accord under K2 (SL-22): the Great Wall is a mountain range, so the accord of 4A 96 is the accord of its passes. It is in force
  // from the start and is broken the first time a pass state of the range is taken by force (its controller changes in a war).
  dep('zin_is_site_great_wall', 'state trigger', 'key sites (sites.mjs, E7)');
  dep('zin_aenor_ruled_by_captains', 'scripted trigger', 'aenor_court_and_succession'); dep('zin_gathering_dark', 'global variable', 'world systems');

  // ---------------------------------------------------------------------------------------------- scripted effects: measures
  const arg = n => `set_temp_variable = { zin_arg_${n.split('=')[0].trim()} = ${n.split('=')[1].trim()} }`;
  void arg;
  const clampG = (name, lo = 0, hi = 100) => `clamp_variable = { var = global.${name} min = ${lo} max = ${hi} }`;
  E('zin_west_add_grudge', 'add_to_variable = { zin_west_grudge = zin_arg_value }', 'clamp_variable = { var = zin_west_grudge min = 0 max = 100 }', 'set_temp_variable = { zin_arg_value = 0 }');
  E('zin_west_add_grudge_all', 'set_temp_variable = { west_v = zin_arg_value }',
    L('every_country', 'limit = { zin_west_is_western = yes }', 'set_temp_variable = { zin_arg_value = west_v }', 'zin_west_add_grudge = yes'), 'set_temp_variable = { zin_arg_value = 0 }');
  E('zin_west_add_unity', 'add_to_variable = { global.zin_west_unity = zin_arg_value }', clampG('zin_west_unity'), 'set_temp_variable = { zin_arg_value = 0 }');
  E('zin_west_add_fleet', 'add_to_variable = { global.zin_west_fleet = zin_arg_value }', clampG('zin_west_fleet'), 'set_temp_variable = { zin_arg_value = 0 }');
  E('zin_west_add_truce',
    L('if', `limit = { ${notFlag('zin_west_truce_broken')} }`, 'add_to_variable = { global.zin_west_truce = zin_arg_value }', clampG('zin_west_truce'),
      L('if', 'limit = { check_variable = { global.zin_west_truce < 1 } date > 1749.3.1 }', 'zin_west_break_truce = yes')),
    'set_temp_variable = { zin_arg_value = 0 }');
  E('zin_west_add_strain', 'add_to_variable = { global.zin_west_strain = zin_arg_value }', clampG('zin_west_strain'), 'set_temp_variable = { zin_arg_value = 0 }');

  // the feud
  const feud = (att, def) => L('start_border_war', 'change_state_after_war = no', 'combat_width = 80', 'minimum_duration_in_days = 60',
    L('attacker', `state = global.${att}`, 'num_provinces = 4', 'on_win = zin_west.23'), L('defender', `state = global.${def}`, 'num_provinces = 4', 'on_win = zin_west.23'));
  const cancelFeud = (att, def) => L('cancel_border_war', `attacker = global.${att}`, `defender = global.${def}`, 'dont_fire_events = yes');
  dep('zin_site_three_oaths', 'global variable', 'key sites (sites.mjs, E7)'); dep('zin_site_winter_ford', 'global variable', 'key sites (sites.mjs, E7)');
  E('zin_west_break_truce',
    '# The truce breaks (truce at 0 after 1749.3.1, the historical date, or an end-the-truce decision): the feud at the ford starts as a border war. Gunwaith attacks unless Girdon broke it by its own choice.',
    L('if', `limit = { ${notFlag('zin_west_truce_broken')} }`,
      'set_global_flag = zin_west_truce_broken', 'set_global_flag = zin_west_grey_ford_war',
      L('if', `limit = { original_tag = ${T_.girdon} NOT = { zin_west_historical = yes } }`, 'set_global_flag = zin_west_feud_girdon_attacked'),
      ...[[T_.gunwaith, T_.girdon], [T_.girdon, T_.gunwaith]].map(([a, b]) => L(a, `remove_opinion_modifier = { target = ${b} modifier = zin_opinion_grey_ford_truce }`,
        `add_opinion_modifier = { target = ${b} modifier = zin_west_ford_blood }`, `add_dynamic_modifier = { modifier = zin_cb_broken_truce days = 730 scope = ${b} }`)),
      L('if', `limit = { ${gflag('zin_west_feud_girdon_attacked')} }`, feud('zin_site_winter_ford', 'zin_site_three_oaths')),
      L('else', feud('zin_site_three_oaths', 'zin_site_winter_ford')),
      L(T_.gunwaith, L('if', 'limit = { exists = yes }', 'country_event = { id = zin_west.22 }')), L(T_.girdon, L('if', 'limit = { exists = yes }', 'country_event = { id = zin_west.22 }')),
      L('every_country', 'limit = { zin_west_is_western = yes }', 'news_event = { id = zin_west.25 }'),
      'set_temp_variable = { zin_arg_value = -10 }', 'zin_west_add_unity = yes'));
  dep('zin_opinion_grey_ford_truce', 'opinion modifier', 'start situation (01_start_situation.md)'); dep('zin_cb_broken_truce', 'dynamic modifier (casus belli)', 'diplomacy slice (03_diplomacy_and_factions.md)');
  E('zin_west_end_ford_war',
    '# The single exit of the feud. zin_arg_how: 0 the war-king\'s peace (default), 1 decided by the border war (scope: the winner), 2 Gunwaith escalates.',
    L('if', `limit = { ${gflag('zin_west_grey_ford_war')} }`,
      'clr_global_flag = zin_west_grey_ford_war',
      L('if', `limit = { ${gflag('zin_west_feud_girdon_attacked')} }`, cancelFeud('zin_site_winter_ford', 'zin_site_three_oaths')),
      L('else', cancelFeud('zin_site_three_oaths', 'zin_site_winter_ford')),
      L('if', 'limit = { check_variable = { zin_arg_how = 1 }  }',
        'add_war_support = 0.05',
        L('every_country', `limit = { OR = { original_tag = ${T_.gunwaith} original_tag = ${T_.girdon} } NOT = { tag = PREV } }`, 'add_stability = -0.05'),
        'set_temp_variable = { zin_arg_value = -5 }', 'zin_west_add_unity = yes',
        L(T_.gunwaith, 'country_event = { id = zin_west.24 }'), L(T_.girdon, 'country_event = { id = zin_west.24 }')),
      L('else_if', 'limit = { check_variable = { zin_arg_how = 2 } }'),
      L('else',
        'set_temp_variable = { zin_arg_value = 25 }', 'zin_west_add_unity = yes',
        L('every_country', 'limit = { has_idea = zin_eindil_war_kings_banner }', 'set_temp_variable = { zin_arg_value = -5 }', 'zin_west_add_grudge = yes', 'if = { limit = { has_idea = zin_west_old_claims } remove_ideas = zin_west_old_claims }'),
        ...[[T_.gunwaith, T_.girdon], [T_.girdon, T_.gunwaith]].map(([a, b]) => L(a, `diplomatic_relation = { country = ${b} relation = non_aggression_pact active = yes }`,
          `remove_opinion_modifier = { target = ${b} modifier = zin_west_ford_blood }`))),
      L('every_country', 'limit = { zin_west_is_western = yes }', 'news_event = { id = zin_west.26 }')),
    'set_temp_variable = { zin_arg_how = 0 }');
  dep('zin_eindil_war_kings_banner', 'idea', 'eindil_journey (mech_eindil.mjs)'); dep('zin_west_old_claims', 'idea', 'start situation (01_start_situation.md)');
  E('zin_west_on_war_king',
    '# The one entry point for the war-kingship. zin_arg_event: 1 named, 2 refused, 3 released, 4 fled.',
    L('if', 'limit = { check_variable = { zin_arg_event = 1 } }', 'set_temp_variable = { zin_arg_value = 5 }', 'zin_west_add_unity = yes'),
    L('else_if', 'limit = { check_variable = { zin_arg_event = 2 } }', 'set_temp_variable = { zin_arg_value = -10 }', 'zin_west_add_unity = yes'),
    L('else_if', 'limit = { check_variable = { zin_arg_event = 3 } }', 'set_temp_variable = { zin_arg_value = 5 }', 'zin_west_add_unity = yes', 'set_global_flag = zin_west_remembers_war_king'),
    L('else_if', 'limit = { check_variable = { zin_arg_event = 4 } }', 'set_temp_variable = { zin_arg_value = -15 }', 'zin_west_add_unity = yes'),
    'set_temp_variable = { zin_arg_event = 0 }');

  // ---------------------------------------------------------------------------------------------- council, route, fleet
  E('zin_west_convene_council',
    '# The scope is the convener.',
    L('if', `limit = { ${notFlag('zin_west_council')} }`,
      'set_global_flag = zin_west_council', 'set_variable = { global.zin_west_convener = THIS }',
      'set_temp_variable = { zin_arg_value = 15 }', 'zin_west_add_unity = yes',
      L('every_country', 'limit = { zin_west_is_western = yes }', 'country_event = { id = zin_west.30 }')));
  E('zin_west_set_route',
    '# zin_arg_route: 1 divided, 2 crossing, 3 relief, 4 hold. Sets the variable and the flag, and refreshes the western layouts (E4).',
    'set_variable = { global.zin_west_route = zin_arg_route }',
    ...['divided', 'crossing', 'relief', 'hold'].map((r, i) => L(i === 0 ? 'if' : 'else_if', `limit = { check_variable = { zin_arg_route = ${i + 1} } }`, `set_global_flag = zin_west_route_${r}`)),
    L('if', 'limit = { check_variable = { zin_arg_route = 1 } }', 'clr_global_flag = zin_west_council', 'clr_global_flag = zin_west_route_crossing', 'clr_global_flag = zin_west_route_relief',
      L('every_country', 'limit = { zin_west_is_western = yes }', 'add_timed_idea = { idea = zin_west_own_shore days = 365 }'),
      L('every_country', 'limit = { is_ai = no }', 'news_event = { id = zin_west.80 }')),
    L('if', 'limit = { check_variable = { zin_arg_route = 2 } }', 'clr_global_flag = zin_west_route_divided'),
    L('every_country', 'limit = { zin_west_is_western = yes }', 'mark_focus_tree_layout_dirty = yes'),
    'set_temp_variable = { zin_arg_route = 0 }');
  E('zin_west_call_pledges',
    '# The scope is the convener: the league is created and every western court is asked for its host.',
    L('if', 'limit = { is_in_faction = no }', 'create_faction_from_template = zin_faction_western_crossing'),
    'set_variable = { global.zin_west_convener = THIS }', 'save_global_event_target_as = zin_west_convener_target',
    'set_variable = { global.zin_west_pledged_count = 0 }',
    L('every_country', 'limit = { zin_west_is_western = yes }', 'country_event = { id = zin_west.31 }'));
  dep('zin_faction_western_crossing', 'faction template', 'diplomacy slice (diplomacy.mjs)');
  E('zin_west_pledge_host',
    '# The scope joins the Crossing: the pledge is 2 + grudge / 20 hosts.',
    'set_country_flag = zin_west_pledged', 'add_to_variable = { global.zin_west_pledged_count = 1 }',
    `set_variable = { zin_west_pledge = zin_west_grudge }`, `divide_variable = { zin_west_pledge = ${K('pledge_grudge_step')} }`, 'round_variable = zin_west_pledge', `add_to_variable = { zin_west_pledge = ${K('pledge_base')} }`,
    L('if', 'limit = { has_variable = global.zin_west_convener NOT = { zin_west_is_leader = yes } }', L(LEADER, 'add_to_faction = PREV')),
    'set_temp_variable = { zin_arg_value = 2 }', 'zin_west_add_unity = yes');
  // The dockyards: lift is fleet / 3 hosts per sailing.
  E('zin_west_count_ashore',
    '# global.zin_west_ashore: the hosts the Crossing has in the Middle Lands mainland (members counted one by one, up to 40).',
    'set_variable = { global.zin_west_ashore = 0 }',
    L('every_country', 'limit = { zin_west_in_crossing = yes }',
      ...Array.from({ length: 40 }, (_, i) => L('if', `limit = { num_divisions_in_states = { count > ${i} states = { ${mainList} } } }`, 'add_to_variable = { global.zin_west_ashore = 1 }'))));

  // The crossing: launch, sailings, landing sites
  const landingProvinces = [...geo.shore.map(s => [s.id, s.port]), ...geo.isle.map(s => [s.id, s.port])];
  E('zin_west_pick_landing',
    '# global.zin_west_landing_state: sailing 1 follows the leader\'s choice (isle or shore); the shore is the candidate with the fewest foe hosts.',
    'set_variable = { global.zin_west_landing_state = 0 }',
    L('if', `limit = { check_variable = { global.zin_west_sailings = 0 } ${gflag('zin_west_landing_isle')} NOT = { ${T_.asgard} = { has_country_flag = zin_asgard_harbours_barred } } }`, `set_variable = { global.zin_west_landing_state = ${geo.isle[0].id} }`),
    ...[0, 1, 2, 3, 5, 8, 12, 20, 999].map(k => L('if', `limit = { check_variable = { global.zin_west_landing_state = 0 } }`,
      ...geo.shore.map(s => L('if', `limit = { check_variable = { global.zin_west_landing_state = 0 } ${FOE} = { NOT = { divisions_in_state = { state = ${s.id} size > ${k} } } } }`, `set_variable = { global.zin_west_landing_state = ${s.id} }`)))),
    L('if', 'limit = { check_variable = { global.zin_west_landing_state = 0 } }', `set_variable = { global.zin_west_landing_state = ${geo.shore[0].id} }`));
  dep('zin_asgard_harbours_barred', 'country flag', 'regional middle_lands tree (Asgard)');
  E('zin_west_create_host',
    '# The scope is a member: it pays and creates up to zin_arg_value hosts in the landing state (place of the starting force: the state\'s port province).',
    `set_temp_variable = { west_pay_men = zin_arg_value }`, `multiply_temp_variable = { west_pay_men = ${K('pledge_men')} }`, 'multiply_temp_variable = { west_pay_men = -1 }',
    `set_temp_variable = { west_pay_eq = zin_arg_value }`, `multiply_temp_variable = { west_pay_eq = ${K('pledge_equipment')} }`, 'multiply_temp_variable = { west_pay_eq = -1 }',
    'add_manpower = west_pay_men',
    `add_equipment_to_stockpile = { type = ${tpl.equipment} amount = west_pay_eq }`,
    ...landingProvinces.map(([id, prov]) => L('if', `limit = { check_variable = { global.zin_west_landing_state = ${id} } }`,
      L('for_loop_effect', 'end = zin_arg_value', `create_unit = { division = "name = \\"Crossing Host\\" division_template = \\"${tpl.name}\\" start_experience_factor = 0.4 start_equipment_factor = 0.8" owner = THIS prioritize_location = ${prov} allow_spawning_on_enemy_provs = yes }`))),
    'set_temp_variable = { zin_arg_value = 0 }');
  dep('zin_war_of_last_crowns', 'global flag', 'world systems');
  E('zin_west_sail',
    '# One sailing (zin_arg_sailing 1 or 2); the scope is the leader.',
    'zin_west_pick_landing = yes',
    // beachhead
    `set_temp_variable = { west_lift = global.zin_west_fleet }`, `divide_temp_variable = { west_lift = ${K('lift_divisor')} }`, 'round_temp_variable = west_lift',
    L('if', 'limit = { zin_controls_sea_central_for_foe = yes }',
      'set_temp_variable = { west_loss = west_lift }', 'divide_temp_variable = { west_loss = 4 }', 'round_temp_variable = west_loss', 'subtract_from_temp_variable = { west_lift = west_loss }',
      `set_temp_variable = { zin_arg_value = -${C.storm_fleet_loss} }`, 'zin_west_add_fleet = yes', 'country_event = { id = zin_west.44 }'),
    ...[...geo.shore.map(s => s.id), ...geo.isle.map(s => s.id)].map(id => L('if', `limit = { check_variable = { global.zin_west_landing_state = ${id} } }`,
      L(`${id}`, L('if', 'limit = { NOT = { controller = { zin_west_in_crossing = yes } } }', 'teleport_armies = { limit = { zin_west_in_crossing = no } }', 'set_state_controller_to = PREV', 'set_state_flag = zin_west_beachhead')))),
    L('every_country', 'limit = { has_country_flag = zin_west_pledged check_variable = { zin_west_pledge > 0 } }',
      'set_temp_variable = { zin_arg_value = zin_west_pledge }',
      L('if', 'limit = { check_variable = { zin_arg_value > west_lift } }', 'set_temp_variable = { zin_arg_value = west_lift }'),
      L('if', 'limit = { check_variable = { zin_arg_value > 0 } }',
        'set_temp_variable = { west_made = zin_arg_value }',
        'zin_west_create_host = yes',
        'subtract_from_temp_variable = { west_lift = west_made }',
        'subtract_from_variable = { zin_west_pledge = west_made }',
        'add_timed_idea = { idea = zin_west_beachhead_host days = 180 }')),
    'add_to_variable = { global.zin_west_sailings = 1 }',
    L(`${FOE}`, 'country_event = { id = zin_west.42 }'),
    'set_temp_variable = { zin_arg_sailing = 0 }');
  T('zin_controls_sea_central_for_foe', L('any_enemy_country', 'zin_controls_sea_central = yes'));
  E('zin_west_launch_crossing',
    '# The scope is the leader: the cause, the war, the pledged members, the first landing question.',
    L('if', `limit = { ${notFlag('zin_western_crossing')} }`,
      'set_global_flag = zin_western_crossing',
      'clear_global_event_target = zin_west_foe',
      L('random_state', 'limit = { zin_is_site_parim = yes controller = { zin_aenor_is_realm = yes } }', L('controller', 'save_global_event_target_as = zin_west_foe')),
      L('if', `limit = { NOT = { has_event_target = zin_west_foe } }`, L(T_.aenor, 'save_global_event_target_as = zin_west_foe')),
      'set_country_flag = { flag = zin_story_war days = 1 }',
      'meta_effect = { text = { create_wargoal = { type = take_state_focus target = event_target:zin_west_foe generator = { [PARIM] } } } PARIM = "[?global.zin_site_parim|0]" }',
      'meta_effect = { text = { declare_war_on = { target = event_target:zin_west_foe type = take_state_focus generator = { [PARIM] } } } PARIM = "[?global.zin_site_parim|0]" }',
      L('every_country', 'limit = { has_country_flag = zin_west_pledged NOT = { zin_west_is_leader = yes } }', 'add_to_war = { targeted_alliance = PREV enemy = event_target:zin_west_foe hostility_reason = asked_to_join }'),
      L('if', `limit = { ${gflag('zin_war_of_last_crowns')} }`, 'set_temp_variable = { zin_arg_value = 5 }'),
      L('else', 'set_temp_variable = { zin_arg_value = 10 }'),
      'zin_world_add_gathering_dark = yes',
      'country_event = { id = zin_west.40 }',
      L('every_country', 'limit = { is_ai = no }', 'news_event = { id = zin_west.41 }')));
  dep('zin_site_parim', 'global variable', 'key sites (sites.mjs, E7)'); dep('zin_world_add_gathering_dark', 'scripted effect', 'world systems');
  E('zin_west_sail_first', '# Event .40 chose the landing; the first sailing leaves.', 'set_temp_variable = { zin_arg_sailing = 1 }', 'zin_west_sail = yes');

  // Parim
  E('zin_west_take_parim',
    '# The first time a member controls Parim: the news, then the leader chooses the throne or the pledge.',
    L('if', `limit = { ${notFlag('zin_west_parim_taken')} }`, 'set_global_flag = zin_west_parim_taken', L('every_country', 'limit = { is_ai = no }', 'news_event = { id = zin_west.56 }'),
      L(LEADER, 'country_event = { id = zin_west.57 }')));
  void 0;
  E('zin_west_choose_parim',
    '# zin_arg_choice: 1 claim the throne of men, 2 hold Parim as a pledge. The scope is the leader.',
    L('if', 'limit = { check_variable = { zin_arg_choice = 1 } }',
      'set_global_flag = zin_west_throne_claimed', 'add_ideas = zin_west_claimant_of_parim',
      L('every_country', 'limit = { zin_aenor_is_realm = yes }', 'add_opinion_modifier = { target = PREV modifier = zin_west_conquerors }'),
      'set_temp_variable = { zin_arg_value = 3 }', 'zin_world_add_gathering_dark = yes'),
    L('else', 'set_global_flag = zin_west_parim_pledge', 'set_temp_variable = { zin_arg_value = -10 }', 'zin_west_add_strain = yes',
      L('every_country', 'limit = { zin_aenor_is_realm = yes }', 'add_opinion_modifier = { target = PREV modifier = zin_west_pledge_holders }')),
    'set_temp_variable = { zin_arg_choice = 0 }');
  E('zin_west_grant_surrenders', L('every_country', 'limit = { zin_west_in_crossing = yes }', 'add_ideas = zin_west_generous_conquerors'));

  // Evacuation
  E('zin_west_begin_evacuation',
    '# zin_arg_lift_factor (default 1; 0.5 after the host breaks): the ports are flagged, the fleet waits sixty days, the boats come in every seven.',
    L('if', `limit = { ${notFlag('zin_west_evacuation')} }`,
      'set_global_flag = zin_west_evacuation',
      L('if', 'limit = { check_variable = { zin_arg_lift_factor = 0 } }', 'set_temp_variable = { zin_arg_lift_factor = 1 }'),
      'set_variable = { global.zin_west_lift_factor = zin_arg_lift_factor }',
      L('every_country', 'limit = { zin_west_in_crossing = yes }', 'country_event = { id = zin_west.61 }'),
      ...geo.ports.map((p, i) => L(`${p.id}`, L('if', `limit = { controller = { zin_west_in_crossing = yes }${i % 2 && false ? '' : ''} }`, ...(i % 2 ? [L('if', 'limit = { check_variable = { global.zin_west_lift_factor > 0.99 } }', 'set_state_flag = zin_west_evacuation_port')] : ['set_state_flag = zin_west_evacuation_port'])))),
      L(LEADER, 'activate_mission = zin_west_fleet_waits', 'country_event = { id = zin_west.65 days = 7 }')),
    'set_temp_variable = { zin_arg_lift_factor = 0 }');
  E('zin_west_evac_state_roll',
    '# The scope is a Middle Lands state: with the lift chance (the fleet, at most 80 percent, times the lift factor) the member armies here are carried home.',
    'set_temp_variable_to_random = { var = west_roll min = 0 max = 100 integer = yes }',
    'set_temp_variable = { west_chance = global.zin_west_fleet }',
    L('if', `limit = { check_variable = { west_chance > ${C.lift_cap} } }`, `set_temp_variable = { west_chance = ${K('lift_cap')} }`),
    L('if', 'limit = { check_variable = { global.zin_west_lift_factor < 1 } }', 'divide_temp_variable = { west_chance = 2 }'),
    L('if', 'limit = { check_variable = { west_roll < west_chance } }', 'teleport_armies = { limit = { has_country_flag = zin_west_pledged } }'));
  E('zin_west_resolve_evacuation',
    '# Sixty days after the call: the armies still ashore are stranded (flag and spirit); the foe is asked for terms.',
    L('if', `limit = { ${gflag('zin_west_evacuation')} ${notFlag('zin_west_evacuated')} }`,
      ...ml.map(id => `${id} = { zin_west_evac_state_roll = yes }`),
      'set_global_flag = zin_west_evacuated',
      L('every_country', 'limit = { has_country_flag = zin_west_pledged zin_west_has_divisions_in_middle_lands = yes }', 'set_country_flag = zin_west_stranded', 'add_ideas = zin_west_stranded_host', 'country_event = { id = zin_west.63 days = 3 }'),
      L('every_country', 'limit = { is_ai = no }', 'news_event = { id = zin_west.66 }'),
      L('if', `limit = { has_event_target = zin_west_foe }`, L(FOE, 'country_event = { id = zin_west.62 }')),
      L('every_country', 'limit = { has_idea = zin_west_claimant_of_parim }', 'remove_ideas = zin_west_claimant_of_parim')));
  E('zin_west_bring_home', L(ml.length ? 'every_country' : 'every_country', 'limit = { OR = { zin_west_in_crossing = yes has_country_flag = zin_west_stranded } }', 'if = { limit = { has_idea = zin_west_stranded_host } remove_ideas = zin_west_stranded_host }', 'if = { limit = { has_idea = zin_west_beside_former_foes } remove_ideas = zin_west_beside_former_foes }'),
    ...ml.map(id => `${id} = { teleport_armies = { limit = { has_country_flag = zin_west_stranded } } }`),
    L('every_country', 'limit = { has_country_flag = zin_west_stranded }', 'add_stability = 0.05', 'clr_country_flag = zin_west_stranded'));
  E('zin_west_bring_home_here', 'zin_west_bring_home = yes');
  E('zin_west_leave_some',
    '# Those who wish stay: the Crossing\'s hosts in every second Middle Lands state are disbanded and their levies and gear return.',
    ...ml.filter((_, i) => i % 2).map(id => `delete_unit = { division_template = "${tpl.name}" state = ${id} disband = yes }`));
  E('zin_west_launch_relief',
    '# The Western Relief: the pledged members join the Aenor realm\'s wars against the dark, as allies and never as conquerors. The scope is the leader.',
    L('if', `limit = { ${gflag('zin_west_relief_granted')} ${notFlag('zin_western_relief_sailed')} }`,
      'set_global_flag = zin_western_relief_sailed',
      L('every_country', 'limit = { has_country_flag = zin_west_pledged }',
        L('if', 'limit = { NOT = { has_government = communism } }', 'set_country_flag = zin_lost_cause_member'),
        'set_temp_variable = { zin_arg_value = 15 }', 'zin_eindil_add_regard = yes'),
      'set_temp_variable = { zin_arg_value = 5 }', 'zin_lost_cause_add_strength = yes',
      'set_temp_variable = { zin_arg_value = -3 }', 'zin_world_add_gathering_dark = yes',
      L('every_country', 'limit = { is_ai = no }', 'news_event = { id = zin_west.51 }')));
  for (const [n, k, o] of [['zin_eindil_add_regard', 'scripted effect', 'eindil_journey (mech_eindil.mjs)'], ['zin_lost_cause_add_strength', 'scripted effect', 'diplomacy slice / aenor_court_and_succession'], ['zin_lost_cause_member', 'country flag', 'aenor_court_and_succession']]) dep(n, k, o);
  E('zin_west_join_coalition_effects',
    '# The scope joined Eindil\'s coalition (after zin_eindil_join_coalition): opinions both ways with the Host and the Aenor realms in it, the spirit, and the old claims are set aside.',
    L('if', 'limit = { has_variable = global.zin_eindil_host }',
      'save_event_target_as = zin_west_joiner',
      // Both directions from the Host's scope: the target field of an opinion modifier takes no var: token.
      L('var:global.zin_eindil_host', 'add_opinion_modifier = { target = event_target:zin_west_joiner modifier = zin_west_fought_beside }',
        'reverse_add_opinion_modifier = { target = event_target:zin_west_joiner modifier = zin_west_fought_beside }')),
    'add_ideas = zin_west_beside_former_foes',
    'if = { limit = { has_idea = zin_west_old_claims } remove_ideas = zin_west_old_claims }');
  dep('zin_eindil_host', 'global variable (country)', 'eindil_journey');

  // ---------------------------------------------------------------------------------------------- pulse and monthly
  E('zin_west_arm_pulse', ...anchors.map((tag, i) => L(i === 0 ? 'if' : 'else_if', `limit = { ${tag} = { exists = yes } }`, L(tag, `country_event = { id = zin_west.2 days = ${C.pulse_days} }`))));
  E('zin_west_pulse',
    '# Weekly: the launch, the feud, the raids and the Parim checks; every fourth pulse the monthly drift.',
    L('if', `limit = { zin_west_crossing_ready = yes ${notFlag('zin_western_crossing')} has_variable = global.zin_west_convener }`,
      L(LEADER, L('if', 'limit = { exists = yes is_ai = yes }', L('if', `limit = { ${gflag('zin_war_of_last_crowns')} }`, 'zin_west_launch_crossing = yes')))),
    L('if', `limit = { ${gflag('zin_aurevan_crowned')} ${notFlag('zin_west_15_fired')} }`, 'set_global_flag = zin_west_15_fired', L('every_country', 'limit = { zin_west_is_western = yes }', 'country_event = { id = zin_west.15 }')),
    L('if', `limit = { ${gflag('zin_western_crossing')} ${notFlag('zin_west_parim_taken')} zin_west_controls_parim = yes }`, 'zin_west_take_parim = yes'),
    L('if', `limit = { ${gflag('zin_western_crossing')} ${notFlag('zin_west_keys_fired')} ${gflag('zin_afrit_king_of_east')} zin_west_past_keys_of_parim = yes check_variable = { global.zin_west_ashore > 7 } }`,
      'zin_west_keys_check = yes'),
    L('if', `limit = { ${gflag('zin_western_crossing')} ${notFlag('zin_west_evacuation')} ${gflag('zin_west_parim_taken')} OR = { zin_west_strain_high = yes AND = { ${gflag('zin_zol_rising')} ${gflag('zin_volgan_marches')} zin_west_past_shore_calls = yes } zin_west_past_shore_calls_late = yes } ${notFlag('zin_west_shore_called')} }`,
      'set_global_flag = zin_west_shore_called', L(LEADER, 'country_event = { id = zin_west.60 }')),
    L('if', `limit = { ${gflag('zin_west_route_hold')} ${notFlag('zin_west_evacuation')} check_variable = { global.zin_west_strain > ${C.strain_break - 1} } }`, 'zin_west_host_breaks = yes'),
    L('if', `limit = { ${gflag('zin_west_route_crossing')} ${notFlag('zin_west_fleet_rumour')} check_variable = { global.zin_west_fleet > ${C.fleet_rumour_at - 1} } }`, 'set_global_flag = zin_west_fleet_rumour', 'zin_west_rumour = yes'),
    L('if', `limit = { ${notFlag('zin_west_truce_broken')} ${notFlag('zin_west_truce_permanent')} check_variable = { global.zin_west_truce < ${C.truce_raid_below} } }`, 'zin_west_raid_roll = yes'),
    L('if', `limit = { ${notFlag('zin_west_truce_broken')} zin_west_historical = yes zin_west_past_truce_break = yes }`, 'zin_west_break_truce = yes'),
    L('if', `limit = { ${gflag('zin_west_council')} ${notFlag('zin_west_route_chosen_notice')} ${gflag('zin_west_route_crossing')} }`, 'set_global_flag = zin_west_route_chosen_notice'),
    'add_to_variable = { global.zin_west_month = 1 }',
    L('if', 'limit = { check_variable = { global.zin_west_month > 3 } }', 'set_variable = { global.zin_west_month = 0 }', 'zin_west_monthly = yes'));
  E('zin_west_keys_check',
    '# The Captains\' Regency holds Parim and the western host is ashore: The Keys of Parim.',
    'set_global_flag = zin_west_keys_fired',
    L('every_state', 'limit = { zin_is_site_parim = yes controller = { zin_aenor_ruled_by_captains = yes } }', L('controller', 'country_event = { id = zin_west.55 }')));
  E('zin_west_host_breaks', '# Strain 100 on the hold route: the host breaks and half the lift remains.',
    L('every_country', 'limit = { zin_west_in_crossing = yes zin_west_has_divisions_in_middle_lands = yes }', ...[1].map(() => `damage_units = { limit = { tag = THIS } org_damage = ${C.break_org / 100} str_damage = ${C.break_str / 100} ratio = yes army = yes }`), 'country_event = { id = zin_west.64 }'),
    'set_temp_variable = { zin_arg_lift_factor = 0.5 }', 'zin_west_begin_evacuation = yes');
  E('zin_west_rumour', L('random_country', 'limit = { zin_aenor_is_realm = yes controls_state = ' + (geo.shore[0]?.id ?? 0) + ' }', 'country_event = { id = zin_west.90 }'));
  E('zin_west_raid_roll',
    '# MTTH 240 days while the truce is thin: with 12 percent a month a raid falls on Gunwaith or Girdon in turn.',
    'set_temp_variable_to_random = { var = west_roll min = 0 max = 100 integer = yes }',
    L('if', `limit = { check_variable = { west_roll < ${C.raid_chance_percent} } }`,
      L('if', `limit = { ${gflag('zin_west_raid_girdon_next')} }`, 'clr_global_flag = zin_west_raid_girdon_next', L(T_.girdon, 'country_event = { id = zin_west.21 }')),
      L('else', 'set_global_flag = zin_west_raid_girdon_next', L(T_.gunwaith, 'country_event = { id = zin_west.21 }'))));
  const addD = (v, cond) => cond ? L('if', `limit = { ${cond} }`, `add_to_temp_variable = { west_d = ${v} }`) : `add_to_temp_variable = { west_d = ${v} }`;
  E('zin_west_monthly',
    '# Drift of grudge, truce and unity; resolve; the strain of the far shore; the fleet\'s return to trade.',
    L('every_country', 'limit = { zin_west_is_western = yes }',
      'set_temp_variable = { west_d = 0 }',
      addD(`${C.grudge_gd_drift / 100}`, `check_variable = { global.zin_gathering_dark > ${C.grudge_gd - 1} }`),
      addD(`-${C.grudge_gold_drift / 100}`, 'has_idea = zin_west_aenoran_gold'),
      addD(`-${C.grudge_heed_drift / 100}`, 'has_country_flag = zin_eindil_heeded'),
      addD(`-${C.grudge_home_drift / 100}`, `check_variable = { zin_west_grudge > ${C.grudge_high} }`),
      addD(`${C.grudge_home_drift / 100}`, `check_variable = { zin_west_grudge < ${C.grudge_low} }`),
      'add_to_variable = { zin_west_grudge = west_d }', 'clamp_variable = { var = zin_west_grudge min = 0 max = 100 }',
      L('if', `limit = { has_country_flag = zin_eindil_heeded NOT = { has_country_flag = zin_west_heed_counted } }`, 'set_country_flag = zin_west_heed_counted', `set_temp_variable = { zin_arg_value = -${C.grudge_heed_once} }`, 'zin_west_add_grudge = yes')),
    // the truce
    L('if', `limit = { ${notFlag('zin_west_truce_broken')} ${notFlag('zin_west_truce_permanent')} }`,
      'set_temp_variable = { west_d = 0 }',
      addD(`-${C.truce_base_drift / 100}`),
      addD(`-${C.truce_thanes_drift / 100}`, `${T_.gunwaith} = { has_idea = zin_gunwaith_war_thanes }`),
      addD(`${C.truce_peace_drift / 100}`, `${T_.gunwaith} = { has_idea = zin_gunwaith_kings_peace }`),
      addD(`${C.truce_commission_drift / 100}`, gflag('zin_west_ford_commission')),
      addD(`-${C.truce_dark_drift / 100}`, `check_variable = { global.zin_gathering_dark > ${C.truce_dark_at - 1} }`),
      'set_temp_variable = { zin_arg_value = west_d }', 'zin_west_add_truce = yes'),
    // unity
    L('if', `limit = { ${gflag('zin_west_council')} }`, `set_temp_variable = { zin_arg_value = ${C.unity_council_drift / 100} }`, 'zin_west_add_unity = yes'),
    'set_temp_variable = { west_pairs = 0 }',
    L('every_country', 'limit = { zin_west_is_western = yes }', L('every_enemy_country', 'limit = { zin_west_is_western = yes }', 'add_to_temp_variable = { west_pairs = 1 }')),
    'divide_temp_variable = { west_pairs = 2 }', 'multiply_temp_variable = { west_pairs = -1 }',
    L('if', `limit = { ${gflag('zin_west_grey_ford_war')} }`, 'add_to_temp_variable = { west_pairs = 1 }'),
    'set_temp_variable = { zin_arg_value = west_pairs }', 'zin_west_add_unity = yes',
    // resolve
    'set_temp_variable = { west_gsum = 0 }', 'set_temp_variable = { west_wsum = 0 }',
    L('every_country', `limit = { zin_west_is_western = yes OR = { has_country_flag = zin_west_council_member NOT = { ${gflag('zin_west_council')} } } }`,
      'set_temp_variable = { west_w = num_owned_states }', 'set_temp_variable = { west_g = zin_west_grudge }', 'multiply_temp_variable = { west_g = west_w }', 'add_to_temp_variable = { west_gsum = west_g }', 'add_to_temp_variable = { west_wsum = west_w }'),
    L('if', 'limit = { check_variable = { west_wsum > 0 } }', 'divide_temp_variable = { west_gsum = west_wsum }'),
    `multiply_temp_variable = { west_gsum = ${K('resolve_grudge_w')} }`, 'divide_temp_variable = { west_gsum = 100 }',
    'set_temp_variable = { west_u = global.zin_west_unity }', `multiply_temp_variable = { west_u = ${K('resolve_unity_w')} }`, 'divide_temp_variable = { west_u = 100 }',
    'set_temp_variable = { west_f = global.zin_west_fleet }', `multiply_temp_variable = { west_f = ${K('resolve_fleet_w')} }`, 'divide_temp_variable = { west_f = 100 }',
    'set_variable = { global.zin_west_resolve = west_gsum }', 'add_to_variable = { global.zin_west_resolve = west_u }', 'add_to_variable = { global.zin_west_resolve = west_f }',
    L('if', `limit = { ${gflag('zin_golden_king_dead')} }`, `add_to_variable = { global.zin_west_resolve = ${K('bonus_king_dead')} }`),
    L('if', 'limit = { any_country = { zin_aenor_is_realm = yes has_civil_war = yes } }', `add_to_variable = { global.zin_west_resolve = ${K('bonus_civil_war')} }`),
    L('if', `limit = { ${gflag('zin_leren_withdrawal')} }`, `add_to_variable = { global.zin_west_resolve = ${K('bonus_leren_left')} }`),
    // Lerendor honoured the treaty (its global flag) and the treaty still stands (Lerendor's scripted trigger), SL-17.
    L('if', `limit = { ${gflag('zin_leren_treaty_honoured')} zin_leren_treaty_in_force = yes }`, `subtract_from_variable = { global.zin_west_resolve = ${K('bonus_honour')} }`),
    L('if', `limit = { ${gflag('zin_war_of_last_crowns')} }`, `add_to_variable = { global.zin_west_resolve = ${K('bonus_last_crowns')} }`),
    L('if', `limit = { NOT = { ${gflag('zin_war_of_last_crowns')} } check_variable = { global.zin_gathering_dark < 25 } any_country = { zin_aenor_is_realm = yes has_government = democratic NOT = { any_enemy_country = { zin_west_is_western = yes } } controls_state = ${geo.shore[0]?.id ?? 0} } }`, `subtract_from_variable = { global.zin_west_resolve = ${K('bonus_calm')} }`),
    clampG('zin_west_resolve'),
    // the fleet returns to trade when no course is chosen and the council is not sitting
    L('if', `limit = { check_variable = { global.zin_west_route = 0 } ${notFlag('zin_west_council')} }`, `set_temp_variable = { zin_arg_value = -${C.fleet_decay / 100} }`, 'zin_west_add_fleet = yes'),
    // the strain of the far shore
    L('if', 'limit = { zin_west_holds_aenor_states = yes }',
      'set_temp_variable = { west_s = 0 }',
      `add_to_temp_variable = { west_s = ${C.strain_base / 100} }`,
      L('if', `limit = { check_variable = { global.zin_west_fleet < ${C.strain_low_fleet} } }`, `add_to_temp_variable = { west_s = ${C.strain_fleet / 100} }`),
      L('if', `limit = { ${gflag('zin_zol_rising')} ${T_.zol} = { zin_west_has_divisions_in_middle_lands = yes } }`, `add_to_temp_variable = { west_s = ${C.strain_zol / 100} }`),
      L('if', `limit = { ${gflag('zin_volgan_marches')} ${T_.volgan} = { zin_west_has_divisions_in_middle_lands = yes } }`, `add_to_temp_variable = { west_s = ${C.strain_volgan / 100} }`),
      L('if', `limit = { ${gflag('zin_eastern_invasion')} any_country = { has_country_flag = zin_region_east_lands zin_west_has_divisions_in_middle_lands = yes has_war_with = ${FOE} } }`, `add_to_temp_variable = { west_s = ${C.strain_east / 100} }`),
      L('if', 'limit = { any_country = { zin_west_in_crossing = yes has_idea = zin_gunwaith_western_garrison } }', `subtract_from_temp_variable = { west_s = ${C.strain_garrison / 100} }`),
      L('if', 'limit = { any_country = { zin_west_in_crossing = yes has_idea = zin_west_hold_fast } }', `subtract_from_temp_variable = { west_s = ${C.strain_hold / 100} }`),
      'set_temp_variable = { zin_arg_value = west_s }', 'zin_west_add_strain = yes',
      L('every_country', 'limit = { zin_west_in_crossing = yes zin_west_has_divisions_in_middle_lands = yes }',
        'set_variable = { zin_west_strain_morale = global.zin_west_strain }', `divide_variable = { zin_west_strain_morale = ${K('modifier_divisor')} }`, 'multiply_variable = { zin_west_strain_morale = -1 }',
        'set_variable = { zin_west_strain_supply = global.zin_west_strain }', `divide_variable = { zin_west_strain_supply = ${K('modifier_divisor')} }`,
        'add_dynamic_modifier = { modifier = zin_west_strain_mod }')),
    L('every_country', 'limit = { zin_west_is_western = yes }', 'mark_focus_tree_layout_dirty = yes'));
  for (const f of ['zin_gunwaith_war_thanes', 'zin_gunwaith_kings_peace', 'zin_gunwaith_western_garrison']) dep(f, 'idea', 'tree gunwaith');
  dep('zin_eindil_heeded', 'country flag', 'eindil_journey'); dep('zin_region_east_lands', 'country flag', 'economy slice (set on startup)');

  // ---------------------------------------------------------------------------------------------- startup
  const grudgeLines = westCountries.map(c => `${c.tag} = { set_variable = { zin_west_grudge = ${data.grudge[c.name] ?? data.grudgeDefault} } country_event = { id = zin_west.1 days = 2 } }`);
  const startup = [
    `set_variable = { global.zin_west_truce = ${K('truce_start')} }`, `set_variable = { global.zin_west_unity = ${K('unity_start')} }`, `set_variable = { global.zin_west_fleet = ${K('fleet_start')} }`,
    'set_variable = { global.zin_west_resolve = 29 }', 'set_variable = { global.zin_west_strain = 0 }', 'set_variable = { global.zin_west_route = 0 }', 'set_variable = { global.zin_west_sailings = 0 }',
    'set_variable = { global.zin_west_ashore = 0 }', 'set_variable = { global.zin_west_pledged_count = 0 }', 'set_variable = { global.zin_west_month = 0 }', 'set_variable = { global.zin_west_lift_factor = 1 }',
    ...grudgeLines, `${anchors[0]} = { country_event = { id = zin_west.2 days = 9 } }`,
    // the Accord of the Passes of 4A 96 (the Wall Accord under K2) is in force at the start (SL-22)
    'set_global_flag = zin_wall_accord'];
  // ROOT is the new controller, FROM the old one, FROM.FROM the state: a pass of the Great Wall range taken in war breaks the accord once.
  const passTaken = L('if', `limit = { ${gflag('zin_wall_accord')} ${notFlag('zin_wall_accord_broken')} has_war_with = FROM FROM.FROM = { zin_is_site_great_wall = yes } }`, 'set_global_flag = zin_wall_accord_broken');

  // ---------------------------------------------------------------------------------------------- events
  const events = [];
  const addEvent = e => { events.push(e); defs.events.push(`zin_west.${e.id}`); };
  const titleOf = id => { loc.add(`zin_west.${id}.t`, ev[id].t); return `zin_west.${id}.t`; };
  const descOf = id => { loc.add(`zin_west.${id}.d`, ev[id].d); return `zin_west.${id}.d`; };
  const opts = (id, spec) => spec.map(([k, effects, ai, trigger]) => { loc.add(`zin_west.${id}.${k}`, ev[id][k]); return { name: `zin_west.${id}.${k}`, effects, ai, ...(trigger ? { trigger } : {}) }; });
  const shown = (id, picture, o) => addEvent({ id, title: titleOf(id), desc: descOf(id), picture, ...o });
  const ack = (id, picture, note, o = {}) => shown(id, picture, { ...o, options: opts(id, [['a', [`# ${note}`], 100]]) });
  const news = (id, picture, note, o = {}) => ack(id, picture, note, { kind: 'news', ...o });
  const hist = 'zin_west_historical = yes';
  const grudgeAi = (hi, mid) => [L('modifier', 'factor = 0', `check_variable = { zin_west_grudge < ${mid} }`), L('modifier', 'factor = 2', `check_variable = { zin_west_grudge > ${hi - 1} }`)];

  addEvent({ id: 1, hidden: true, immediate: [
    "# A western court's start: the host template, and Gunwaith's weary clans.",
    `division_template = { name = "${tpl.name}" regiments = { ${[...tpl.regiments, ...tpl.extra].map((r, i) => `${r} = { x = ${Math.floor(i / 3)} y = ${i % 3} }`).join(' ')} } support = { ${tpl.support.map((s, i) => `${s} = { x = 0 y = ${i} }`).join(' ')} } }`,
    L('if', `limit = { original_tag = ${T_.gunwaith} }`, 'add_ideas = zin_gunwaith_weary_clans')] });
  dep('zin_gunwaith_weary_clans', 'idea', 'tree gunwaith (start situation)');
  addEvent({ id: 2, hidden: true, immediate: ['zin_west_arm_pulse = yes', 'zin_west_pulse = yes'] });
  loc.add('zin_west.3.t', ev['3'].t);
  shown(3, EVT('grey_ford_truce'), { trigger: ['zin_west_question_open = yes', notFlag('zin_west_route_crossing'), notFlag('zin_west_route_divided'), notFlag('zin_west_route_relief')], options: opts(3, [
    ['a', ['set_temp_variable = { zin_arg_route = 2 }', 'zin_west_set_route = yes'], [`base = 40`, L('modifier', 'factor = 0', `check_variable = { global.zin_west_resolve < ${C.route_crossing_resolve} }`)]],
    ['b', ['set_temp_variable = { zin_arg_route = 1 }', 'zin_west_set_route = yes'], [`base = 30`, L('modifier', 'factor = 0', `check_variable = { global.zin_west_resolve > ${C.route_divided_resolve - 1} }`)]],
    ['c', ['set_temp_variable = { zin_arg_route = 3 }', 'zin_west_set_route = yes'], [`base = 30`, L('modifier', 'factor = 0', gflag('zin_afrit_revealed'), 'NOT = { has_country_flag = zin_eindil_heeded }')]]]) });
  shown(10, EVT('generic_court'), { options: opts(10, [
    ['a', ['add_political_power = -50', 'FROM = { set_temp_variable = { zin_arg_value = -10 } zin_west_add_grudge = yes }'], 20],
    ['b', ['FROM = { set_temp_variable = { zin_arg_value = 10 } zin_west_add_grudge = yes }', 'set_temp_variable = { zin_arg_value = 3 }', 'zin_west_add_unity = yes'], 80]]) });
  shown(15, EVT('coronation'), { trigger: ['zin_west_is_western = yes', 'NOT = { has_country_flag = zin_west_15_seen }'], options: opts(15, [['a', ['set_country_flag = zin_west_15_seen', 'set_temp_variable = { zin_arg_value = 5 }', 'zin_west_add_grudge = yes'], 100]]) });
  shown(20, EVT('grey_ford_truce'), { options: opts(20, [
    ['a', ['set_global_flag = zin_west_ford_commission', 'set_temp_variable = { zin_arg_value = 10 }', 'zin_west_add_truce = yes'], [`base = 70`, L('modifier', 'factor = 0.4', `${T_.gunwaith} = { has_idea = zin_gunwaith_war_thanes }`)]],
    ['b', ['set_temp_variable = { zin_arg_value = -5 }', 'zin_west_add_truce = yes'], 30]]) });
  shown(21, EVT('generic_war'), { trigger: [notFlag('zin_west_truce_broken')], options: opts(21, [
    ['a', ['set_temp_variable = { zin_arg_value = -10 }', 'zin_west_add_truce = yes', 'add_war_support = 0.02'], [`base = 40`, L('modifier', 'factor = 3', 'has_idea = zin_gunwaith_war_thanes'), L('modifier', 'factor = 3', hist, `original_tag = ${T_.gunwaith}`)]],
    ['b', ['add_political_power = -25', 'set_temp_variable = { zin_arg_value = 5 }', 'zin_west_add_truce = yes'], 40],
    ['c', ['set_temp_variable = { zin_arg_value = 3 }', 'zin_west_add_truce = yes'], [`base = 60`], gflag('zin_west_ford_commission')]]) });
  ack(22, EVT('generic_war'), 'To the ford!');
  addEvent({ id: 23, hidden: true, immediate: [L('if', `limit = { ${gflag('zin_west_grey_ford_war')} }`, 'set_temp_variable = { zin_arg_how = 1 }', 'zin_west_end_ford_war = yes')] });
  shown(24, EVT('grey_ford_truce'), { options: opts(24, [
    ['a', [`diplomatic_relation = { country = ${T_.gunwaith} relation = non_aggression_pact active = yes }`, 'set_temp_variable = { zin_arg_value = 5 }', 'zin_west_add_unity = yes'], [`base = 60`, L('modifier', 'factor = 1.67', hist)]],
    ['b', ['# The casus belli stays.'], 40]]) });
  news(25, NEWS('generic_war'), 'Bad news for every road in the West.');
  news(26, NEWS('generic_peace'), 'May the peace hold.');
  shown(30, EVT('grey_ford_truce'), { options: opts(30, [
    ['a', ['set_country_flag = zin_west_council_member', 'set_temp_variable = { zin_arg_value = 2 }', 'zin_west_add_unity = yes'], [`base = 60`, L('modifier', 'factor = 0.2', `check_variable = { zin_west_grudge < 35 }`)]],
    ['b', ['# Our delegates stay home.'], 40]]) });
  shown(31, EVT('western_crossing'), { options: opts(31, [
    ['a', ['add_to_variable = { zin_west_grudge = -5 }', 'clamp_variable = { var = zin_west_grudge min = 0 max = 100 }', 'add_opinion_modifier = { target = event_target:zin_west_convener_target modifier = zin_west_refused_the_call }'], [`base = 20`, L('modifier', 'factor = 0', hist, `check_variable = { zin_west_grudge > ${C.pledge_min_grudge - 1} }`)]],
    ['b', ['zin_west_pledge_host = yes'], [`base = 40`, L('modifier', 'factor = 0', `check_variable = { zin_west_grudge < ${C.pledge_min_grudge} }`, hist), L('modifier', 'add = 60', hist, `check_variable = { zin_west_grudge > ${C.pledge_min_grudge - 1} }`), L('modifier', 'factor = 0.75', 'has_idea = zin_west_aenoran_gold')]],
    ['c', ['set_temp_variable = { zin_arg_value = 3 }', 'zin_west_add_fleet = yes', 'set_country_flag = zin_west_ships_only'], [`base = 40`, L('modifier', 'add = 60', hist, `check_variable = { zin_west_grudge > ${C.ships_min_grudge - 1} }`, `check_variable = { zin_west_grudge < ${C.pledge_min_grudge} }`), L('modifier', 'factor = 0', hist, `check_variable = { zin_west_grudge > ${C.pledge_min_grudge - 1} }`)]]]) });
  shown(40, EVT('western_crossing'), { options: opts(40, [
    ['a', ['set_global_flag = zin_west_landing_isle', 'zin_west_sail_first = yes'], [`base = 70`, L('modifier', 'add = 30', hist), L('modifier', 'factor = 0', `${T_.asgard} = { has_country_flag = zin_asgard_harbours_barred }`)], `NOT = { ${T_.asgard} = { has_country_flag = zin_asgard_harbours_barred } }`],
    ['b', ['clr_global_flag = zin_west_landing_isle', 'zin_west_sail_first = yes'], [`base = 30`, L('modifier', 'factor = 0', hist, `NOT = { ${T_.asgard} = { has_country_flag = zin_asgard_harbours_barred } }`)]]]) });
  news(41, NEWS('western_crossing'), 'The West has sailed.');
  ack(42, EVT('generic_sea'), 'Man the shore.');
  ack(44, EVT('generic_sea'), 'Press on with what remains.');
  shown(50, EVT('generic_court'), { options: opts(50, [
    ['a', ['set_global_flag = zin_west_relief_granted', L('every_country', 'limit = { has_country_flag = zin_west_pledged }', L('PREV', 'give_military_access = PREV')), 'zin_west_launch_relief = yes'].flat(), [`base = 20`, L('modifier', 'factor = 5', 'has_war = yes', 'any_enemy_country = { zin_diplo_is_dark_power = yes }')]],
    ['b', ['# Passage is refused.'], 80]]) });
  dep('zin_diplo_is_dark_power', 'scripted trigger', 'diplomacy slice');
  news(51, NEWS('generic_sea'), 'A strange alliance.');
  shown(55, EVT('generic_war'), { options: opts(55, [
    ['a', ['add_timed_idea = { idea = zin_west_parim_defiant days = 180 }'], [`base = 50`, L('modifier', 'factor = 0', hist)]],
    ['b', ['clear_array = global.zin_west_parim_fallback', L('every_state', 'limit = { zin_aenor_fallback_seat = yes controller = { tag = PREV } }', 'add_to_array = { array = global.zin_west_parim_fallback }'), L('every_state', 'limit = { zin_is_site_parim = yes }', 'teleport_armies = { limit = { tag = ROOT } to_state_array = global.zin_west_parim_fallback }'), L('every_state', 'limit = { zin_is_site_parim = yes }', `set_state_controller_to = ${LEADER}`), 'add_stability = -0.1', 'set_temp_variable = { zin_arg_value = -5 }', 'zin_lost_cause_add_strength = yes', 'zin_west_take_parim = yes'].flat(), [`base = 50`, L('modifier', 'add = 50', hist)]]]) });
  news(56, NEWS('generic_war'), 'The city has new masters.');
  shown(57, EVT('golden_court'), { options: opts(57, [
    ['a', ['set_temp_variable = { zin_arg_choice = 1 }', 'zin_west_choose_parim = yes'], [`base = 70`, L('modifier', 'add = 30', hist)]],
    ['b', ['set_temp_variable = { zin_arg_choice = 2 }', 'zin_west_choose_parim = yes'], [`base = 30`, L('modifier', 'factor = 0', hist)]]]) });
  shown(60, EVT('western_crossing'), { options: opts(60, [
    ['a', ['zin_west_begin_evacuation = yes'], [`base = 60`, L('modifier', 'add = 40', hist), L('modifier', 'factor = 0', gflag('zin_west_route_hold'))]],
    ['b', ['set_temp_variable = { zin_arg_route = 4 }', 'zin_west_set_route = yes', L('every_country', 'limit = { zin_west_in_crossing = yes }', 'add_ideas = zin_west_hold_fast')].flat(), [`base = 40`, L('modifier', 'factor = 0', hist), L('modifier', 'factor = 0', `check_variable = { global.zin_west_strain > ${C.strain_sail_dynamic - 1} }`)]]]) });
  ack(61, EVT('generic_sea'), 'March to the ports.');
  shown(62, EVT('generic_peace'), { options: opts(62, [
    ['a', [L('every_country', 'limit = { has_country_flag = zin_west_stranded }', L('PREV', 'give_military_access = PREV')), L('every_country', 'limit = { zin_west_in_crossing = yes }', L('PREV', 'white_peace = PREV'))], [`base = 40`, L('modifier', 'add = 60', hist), L('modifier', 'add = 40', 'any_enemy_country = { zin_diplo_is_dark_power = yes }')]],
    ['b', [L('every_country', 'limit = { zin_west_in_crossing = yes }', L('PREV', 'white_peace = PREV'))], [`base = 40`, L('modifier', 'factor = 0', hist)]],
    ['c', ['# No terms are given.'], 0]]) });
  shown(63, EVT('generic_peace'), { options: opts(63, [
    ['a', ['add_political_power = -25', 'add_stability = 0.03'], 50], ['b', ['add_war_support = 0.05'], 50]]) });
  ack(64, EVT('generic_war'), 'To the ships, if there are ships.');
  addEvent({ id: 65, hidden: true, immediate: [
    '# The boats come in: every seven days the armies standing in an evacuation port sail home.',
    L('if', `limit = { ${gflag('zin_west_evacuation')} ${notFlag('zin_west_evacuated')} }`,
      ...geo.ports.map(p => L(`${p.id}`, L('if', 'limit = { has_state_flag = zin_west_evacuation_port }', 'teleport_armies = { limit = { has_country_flag = zin_west_pledged } }'))),
      `country_event = { id = zin_west.65 days = ${C.pulse_days} }`)] });
  news(66, NEWS('generic_sea'), 'Some did not sail.');
  shown(70, EVT('generic_peace'), { options: opts(70, [
    ['a', ['zin_west_bring_home_here = yes'], 60], ['b', ['zin_west_leave_some = yes', L('every_country', 'limit = { zin_aenor_is_realm = yes }', 'add_opinion_modifier = { target = PREV modifier = zin_west_fought_beside }')].flat(), 40]]) });
  news(71, NEWS('generic_war'), 'A crown across the sea.');
  shown(72, EVT('war_king'), { options: opts(72, [
    ['a', [L('var:global.zin_eindil_host', 'save_event_target_as = zin_west_heir_host'), L('every_state', 'limit = { zin_is_site_parim = yes }', 'set_state_controller_to = event_target:zin_west_heir_host'), 'white_peace = event_target:zin_west_heir_host', 'set_temp_variable = { zin_arg_value = 25 }', 'zin_eindil_add_regard = yes'].flat(), 50], ['b', ['# Parim stays with its holder.'], 50]]) });
  news(80, NEWS('generic_peace'), 'A quiet year.');
  shown(90, EVT('generic_sea'), { options: opts(90, [
    ['a', ['add_political_power = 25'], [`base = 40`, L('modifier', 'add = 60', hist, 'zin_afrit_rules_here = yes')]],
    ['b', [...geo.shore.map(s => L(`${s.id}`, L('if', 'limit = { is_owned_by = ROOT }', `add_building_construction = { type = coastal_bunker province = ${s.port} level = 2 instant_build = yes }`))), 'add_political_power = -75'], 30],
    ['c', ['set_country_flag = { flag = zin_west_subsidy_half days = 365 }'], 30]]) });

  for (const e of events) scripts.add(`zin_west.${e.id}`, 'event', eventLines({ ns: 'zin_west', ...e }));
  put('events/zin_west.txt', fileText('add_namespace = zin_west', ...events.map(e => render(eventLines({ ns: 'zin_west', ...e })))));

  // ---------------------------------------------------------------------------------------------- decisions
  for (const [k, v] of Object.entries(data.tooltips)) loc.add(k, v);
  for (const c of data.categories) { loc.add(c.id, c.name); loc.add(`${c.id}_desc`, c.desc); defs.categories.push(c.id); }
  const decisions = [];
  const D = (id, ...body) => { const t = data.decisions[id]; if (!t) throw new Error(`No text for decision ${id}`); decisions.push({ id, cat: t.cat, body }); defs.decisions.push(id); loc.add(id, t.name); loc.add(`${id}_desc`, t.desc); scripts.add(id, 'decision', L(id, `icon = zin_${t.icon}`, ...body)); };
  const westOnly = ['zin_west_is_western = yes'];
  D('zin_west_convene_council', 'allowed = { always = yes }', L('visible', ...westOnly, 'zin_west_is_anchor = yes', notFlag('zin_west_council')),
    L('available', 'date > 1752.3.1', `custom_trigger_tooltip = { tooltip = zin_west_tt_peace zin_west_council_can_meet = yes }`), 'cost = 50',
    L('complete_effect', 'zin_west_convene_council = yes'), L('ai_will_do', 'base = 100'));
  D('zin_west_end_the_truce', 'allowed = { always = yes }', L('visible', L('OR', `original_tag = ${T_.gunwaith}`, `original_tag = ${T_.girdon}`), notFlag('zin_west_truce_broken')),
    L('available', 'date > 1750.3.1', `custom_trigger_tooltip = { tooltip = zin_west_tt_truce_low check_variable = { global.zin_west_truce < ${C.truce_break_gap + 1} } }`, `custom_trigger_tooltip = { tooltip = zin_west_tt_dark check_variable = { global.zin_gathering_dark > 24 } }`), 'cost = 25',
    L('complete_effect', 'zin_west_break_truce = yes'), L('ai_will_do', 'base = 0', L('modifier', 'add = 20', `has_idea = zin_gunwaith_war_thanes`, 'NOT = { zin_west_historical = yes }')));
  D('zin_west_choose_course', 'allowed = { always = yes }', L('visible', ...westOnly, 'zin_west_is_leader = yes', `NOT = { original_tag = ${T_.gunwaith} }`, 'zin_west_question_open = yes', notFlag('zin_west_route_crossing'), notFlag('zin_west_route_divided'), notFlag('zin_west_route_relief')),
    L('available', 'date > 1753.3.1', `custom_trigger_tooltip = { tooltip = zin_west_tt_question zin_west_question_open = yes }`), 'cost = 50',
    L('complete_effect', 'country_event = { id = zin_west.3 }'), L('ai_will_do', 'base = 100'));
  D('zin_west_build_crossing_ships', 'allowed = { always = yes }', L('visible', ...westOnly, L('OR', gflag('zin_west_council'), gflag('zin_west_route_crossing'), gflag('zin_west_route_relief'))),
    L('available', 'has_country_flag = zin_west_council_member', 'num_of_naval_factories > 0', `custom_trigger_tooltip = { tooltip = zin_west_tt_ships has_resources_in_country = { resource = aluminium amount > 4 } }`),
    'cost = 50', 'days_remove = 120', 'days_re_enable = 180',
    L('remove_effect', 'set_temp_variable = { zin_arg_value = 3 }', L('if', 'limit = { num_of_naval_factories > 2 }', 'set_temp_variable = { zin_arg_value = 5 }'), 'zin_west_add_fleet = yes'),
    L('ai_will_do', 'base = 50', L('modifier', 'factor = 0', 'has_political_power < 100')));
  D('zin_west_send_envoys', 'allowed = { always = yes }', L('visible', ...westOnly, 'zin_west_is_leader = yes', gflag('zin_west_council')), 'target_root_trigger = { zin_west_is_leader = yes }',
    L('target_trigger', L('FROM', 'zin_west_is_western = yes', 'NOT = { has_country_flag = zin_west_council_member }', 'NOT = { zin_west_is_leader = yes }')),
    'cost = 25', 'days_re_enable = 120',
    L('complete_effect', L('FROM', 'set_temp_variable = { zin_arg_value = 5 }', 'zin_west_add_grudge = yes', 'add_opinion_modifier = { target = ROOT modifier = zin_west_envoy_welcome }')),
    L('ai_will_do', 'base = 20'));
  D('zin_west_launch', 'allowed = { always = yes }', L('visible', 'zin_west_is_leader = yes', `NOT = { original_tag = ${T_.gunwaith} }`, notFlag('zin_western_crossing')),
    L('available', `custom_trigger_tooltip = { tooltip = zin_west_tt_ready zin_west_crossing_ready = yes }`),
    L('complete_effect', 'zin_west_launch_crossing = yes'), L('ai_will_do', 'base = 100'));
  D('zin_west_accept_surrenders', 'allowed = { always = yes }', L('visible', 'zin_west_is_leader = yes', `NOT = { original_tag = ${T_.gunwaith} }`, gflag('zin_western_crossing')),
    L('available', `custom_trigger_tooltip = { tooltip = zin_west_tt_surrenders zin_west_holds_aenor_states = yes }`), 'cost = 50', 'fire_only_once = yes',
    L('complete_effect', 'zin_west_grant_surrenders = yes'), L('ai_will_do', 'base = 60'));
  D('zin_west_second_sailing', 'allowed = { always = yes }', L('visible', 'zin_west_is_leader = yes', gflag('zin_western_crossing'), 'check_variable = { global.zin_west_sailings = 1 }'),
    L('available', `custom_trigger_tooltip = { tooltip = zin_west_tt_pledges any_country = { has_country_flag = zin_west_pledged check_variable = { zin_west_pledge > 0 } } }`),
    'days_re_enable = 90',
    L('complete_effect', 'clr_global_flag = zin_west_landing_isle', 'set_temp_variable = { zin_arg_sailing = 2 }', 'zin_west_sail = yes'), L('ai_will_do', 'base = 100'));
  D('zin_west_sound_the_retreat', 'allowed = { always = yes }', L('visible', 'zin_west_is_leader = yes', gflag('zin_western_crossing'), notFlag('zin_west_evacuation')),
    L('available', 'zin_west_holds_aenor_states = yes', `custom_trigger_tooltip = { tooltip = zin_west_tt_strain check_variable = { global.zin_west_strain > ${C.strain_sound - 1} } }`), 'cost = 25',
    L('complete_effect', 'zin_west_begin_evacuation = yes'), L('ai_will_do', 'base = 0'));
  // the mission
  loc.add('zin_west_fleet_waits', data.decisions.zin_west_fleet_waits.name); loc.add('zin_west_fleet_waits_desc', data.decisions.zin_west_fleet_waits.desc); defs.decisions.push('zin_west_fleet_waits');
  const mission = L('zin_west_fleet_waits', `icon = zin_west_${data.decisions.zin_west_fleet_waits.icon}`, 'allowed = { always = yes }', 'days_mission_timeout = 60', 'is_good = no', L('timeout_effect', 'zin_west_resolve_evacuation = yes'));
  scripts.add('zin_west_fleet_waits', 'decision', mission);
  put('common/decisions/categories/zin_west.txt', fileText(...data.categories.map(c => render(L(c.id, 'allowed = { always = yes }', `icon = zin_${c.icon}`, 'priority = 7')))));
  const cats = {};
  for (const d of decisions) (cats[d.cat] ??= []).push(render(L(d.id, `icon = zin_west_${data.decisions[d.id].icon}`, ...d.body)));
  cats.zin_west_crossing.push(render(mission));
  put('common/decisions/zin_west.txt', fileText(...Object.entries(cats).map(([c, ds]) => `${c} = {\n${ds.map(t => t.split('\n').map(l => '\t' + l).join('\n')).join('\n')}\n}`)));

  // ---------------------------------------------------------------------------------------------- triggers and effects files
  put('common/scripted_triggers/zin_west.txt', fileText(comment('Triggers of the Western Crossing.'), ...triggerDefs.map(d => render(L(d.name, ...d.body)))));
  put('common/scripted_effects/zin_west.txt', fileText(comment('Effects of the Western Crossing. Arguments are temporary variables zin_arg_<name> set just before the call (E1): value; how 0 peace 1 decided 2 escalated; route 1 divided 2 crossing 3 relief 4 hold; sailing 1 or 2; choice 1 claim 2 pledge; event 1 named 2 refused 3 released 4 fled; lift_factor.'), ...effectDefs.map(d => render(L(d.name, ...d.body)))));

  // ---------------------------------------------------------------------------------------------- game rule
  const r = data.rules.route, RU = r.id.toUpperCase();
  put('common/game_rules/zin_west.txt', fileText(render(L(r.id, `name = "${RU}"`, 'group = "RULE_GROUP_ZIN"',
    ...r.options.map((o, i) => L(i === 0 ? 'default' : 'option', `name = ${o.id}`, `text = "${RU}_${o.id.toUpperCase()}"`, `desc = "${RU}_${o.id.toUpperCase()}_DESC"`))))));
  loc.add(RU, r.name); loc.add(`${RU}_DESC`, r.desc);
  for (const o of r.options) { loc.add(`${RU}_${o.id.toUpperCase()}`, o.name); loc.add(`${RU}_${o.id.toUpperCase()}_DESC`, o.desc); }
  defs.rules.push(r.id);

  // ---------------------------------------------------------------------------------------------- on actions, AI areas, strategies
  put('common/on_actions/zin_west.txt', fileText(render(L('on_actions',
    L('on_startup', L('effect', ...startup)),
    L('on_annex', L('effect', L('if', 'limit = { zin_west_is_western = yes FROM = { zin_west_is_western = yes } }', 'set_temp_variable = { zin_arg_value = -15 }', 'zin_west_add_unity = yes'))),
    L('on_state_control_changed', L('effect', passTaken))))));
  scripts.add('on_actions', 'on_action', [...startup, 'if = { limit = { zin_west_is_western = yes FROM = { zin_west_is_western = yes } } set_temp_variable = { zin_arg_value = -15 } zin_west_add_unity = yes }', passTaken]);
  put('common/ai_areas/zin_west.txt', fileText(render(L('areas', L('zin_area_middle_lands', L('strategic_regions', ...geo.strategicRegions.map(String)))))));
  const aiBlock = (name, enable, strategies) => render(L(name, 'allowed = { always = yes }', L('enable', ...enable), 'abort_when_not_enabled = yes', ...strategies));
  put('common/ai_strategy/zin_west.txt', fileText(comment('The Western Crossing\'s AI: invade and conquer the foe after the launch; the leader presses the Middle Lands; the fleet puts buffers on the evacuation ports; the stranded befriend their hosts.'),
    aiBlock('zin_west_the_crossing_invades', [gflag('zin_western_crossing'), 'zin_west_in_crossing = yes', notFlag('zin_west_evacuated')], [
      L('ai_strategy', 'type = invade', `id = "${T_.aenor}"`, 'value = 200'), L('ai_strategy', 'type = conquer', `id = "${T_.aenor}"`, 'value = 150')]),
    aiBlock('zin_west_the_leader_presses', [gflag('zin_western_crossing'), 'zin_west_is_leader = yes'], [L('ai_strategy', 'type = area_priority', 'id = zin_area_middle_lands', 'value = 100')]),
    aiBlock('zin_west_the_fleet_calls', [gflag('zin_west_evacuation'), notFlag('zin_west_evacuated'), 'zin_west_in_crossing = yes'], [
      L('ai_strategy', 'type = put_unit_buffers', 'ratio = 1.0', 'order_id = 2', L('states', ...geo.ports.map(p => String(p.id))))]),
    aiBlock('zin_west_the_stranded_hold', [gflag('zin_west_evacuated'), 'has_country_flag = zin_west_stranded'], [
      L('ai_strategy', 'type = befriend', `id = "${T_.aenor}"`, 'value = 100'), L('ai_strategy', 'type = prepare_for_war', `id = "${T_.volgan}"`, 'value = 100'), L('ai_strategy', 'type = conquer', `id = "${T_.volgan}"`, 'value = 100'),
      L('ai_strategy', 'type = prepare_for_war', `id = "${T_.zol}"`, 'value = 100'), L('ai_strategy', 'type = conquer', `id = "${T_.zol}"`, 'value = 100'), L('ai_strategy', 'type = conquer', `id = "${T_.aenor}"`, 'value = -1000')])));

  // ---------------------------------------------------------------------------------------------- interface and text
  const sprites = [], seen = new Set();
  const addSprite = (name, tex) => { if (seen.has(name)) return; seen.add(name); sprites.push(`\tspriteType = {\n\t\tname = "${name}"\n\t\ttexturefile = "gfx/interface/ideas/zin/${tex}.dds"\n\t}`); };
  for (const d of Object.values(data.decisions)) addSprite(`GFX_decision_zin_west_${d.icon}`, d.icon);
  for (const c of data.categories) addSprite(`GFX_decision_category_zin_${c.icon}`, c.icon);
  put('interface/zin_west.gfx', `spriteTypes = {\n${sprites.join('\n')}\n}\n`);
  staged.loc('zin_west', loc.entries);
  files.push('localisation/english/zin_west_l_english.yml');

  return {
    counts: { events: defs.events.length, effects: defs.effects.length, triggers: defs.triggers.length, ideas: defs.ideas.length, decisions: defs.decisions.length, categories: defs.categories.length, opinions: defs.opinions.length, files: files.length, loc: Object.keys(loc.entries).length },
    definitions: defs, scripts: scripts.items, dependencies: [...scripts.depends.values()].sort((a, b) => a.name.localeCompare(b.name)), files: files.sort(), localisation: loc.entries,
    startup, tags: TAG, anchors, geography: { mainland: geo.mainland.length, shore: geo.shore.length, ports: geo.ports.length },
  };
}
