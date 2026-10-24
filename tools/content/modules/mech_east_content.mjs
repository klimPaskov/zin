// Eastern kings mechanic, content half: ideas, dynamic modifiers, opinion modifiers, the decision categories and decisions, the
// events of namespace zin_east that belong to the mechanic, the scripted localisation, the on_actions and the AI strategies.
// Called by mech_east.mjs, which owns the scripted triggers and the effects. The events of the events engineers (zin_east.41 to
// .46, .50 to .52, .60) are only fired and served by effects, never defined here.
import { fmt, ind, join, call, num, HEADER, renderEvent, renderDecision, renderCategory, renderIdea, renderDynamicModifier, renderOpinion, knownPictures, knownIcons } from '../lib/mech_kit.mjs';

const SPEC = 'docs/specs/04_mechanics/eastern_kings.md';

export async function buildEastContent(c) {
  const { N, R, T, tags, put, defs, E_, ROADS, roadSwitch, inf, tag, powers } = c;
  const { NOR, STA, WOR, AEN } = tags;
  const pictures = await knownPictures(), icons = await knownIcons();
  const isNor = `original_tag = ${NOR}`, isSta = `original_tag = ${STA}`;
  const powerOnly = 'zin_east_is_power = yes';
  const side = (forNor, forSta) => `if = {\n  limit = { ${isNor} }\n${ind(1, forNor)}\n}\nelse = {\n${ind(1, forSta)}\n}`;
  const rivalTag = `OR = {\n  AND = {\n    ${isNor}\n    country_exists = ${STA}\n  }\n  AND = {\n    ${isSta}\n    country_exists = ${NOR}\n  }\n}`;
  const notWarWithRival = `OR = {\n  AND = {\n    ${isNor}\n    NOT = { has_war_with = ${STA} }\n  }\n  AND = {\n    ${isSta}\n    NOT = { has_war_with = ${NOR} }\n  }\n}`;
  const toRival = body => side(`${STA} = {\n${ind(1, body)}\n}`, `${NOR} = {\n${ind(1, body)}\n}`);
  const leanToward = (v, who = 'FROM') => side(`${who} = {\n${ind(1, call('zin_east_add_lean', { value: v }))}\n}`, `${who} = {\n${ind(1, call('zin_east_add_lean', { value: -v }))}\n}`);
  const ownCode = `OR = {\n  AND = {\n    ${isNor}\n    check_variable = { global.zin_east_road_@ = 1 }\n  }\n  AND = {\n    ${isSta}\n    check_variable = { global.zin_east_road_@ = 2 }\n  }\n}`;

  // ------------------------------------------------------------------------------------------------ ideas
  const spirit = (id, picture, modifier, extra = {}) => ({ id, picture, modifier, ...extra });
  const ideaList = [
    spirit('zin_east_temple_loan', 'zin_house_first_light', { political_power_gain: 0.15, stability_factor: 0.03 }),
    spirit('zin_east_coalition_ambition', 'zin_ship_voyage', { war_support_factor: 0.05, army_attack_factor: 0.05 }),
    spirit('zin_east_free_crowns', 'zin_banner_league', { army_defence_factor: 0.05, stability_factor: 0.03, war_support_factor: 0.05 }, { cancel: 'has_global_flag = zin_afrit_dead' }),
    spirit('zin_east_shared_roads', 'zin_handshake_oath', { consumer_goods_factor: -0.03, trade_opinion_factor: 0.1, political_power_gain: 0.05 }),
    spirit('zin_east_caravan_war_strain', 'zin_caravan', { consumer_goods_factor: 0.03, war_support_factor: 0.05 }),
    spirit('zin_east_kings_debt', 'zin_tribute_chest', { stability_factor: -0.05, political_power_gain: -0.1 }),
    spirit('zin_east_vindicated', 'zin_banner_plain', { stability_factor: 0.05, war_support_factor: 0.03 }),
    spirit('zin_east_united_crown', 'zin_crown_hailed', { political_power_gain: 0.25, stability_factor: 0.05, trade_opinion_factor: 0.1 }),
    spirit('zin_east_rationed_water', 'zin_granary', { stability_factor: -0.03 }),
  ];
  const ideaTexts = [];
  for (const i of ideaList) {
    if (!icons.has(`GFX_idea_${i.picture}`)) throw new Error(`Idea ${i.id}: picture ${i.picture} is not in the icon catalog`);
    ideaTexts.push(await renderIdea(i, T)); defs.ideas.push(i.id);
  }
  put('common/ideas/zin_east.txt', `${HEADER('mech_east', SPEC)}\nideas = {\n\tcountry = {\n${ind(2, ideaTexts.join('\n\n'))}\n\t}\n}`);

  // ------------------------------------------------------------------------------------------------ dynamic modifiers
  const dyn = [
    { id: 'zin_east_caravan_wealth', modifier: { political_power_gain: 'zin_east_cw_pp', trade_opinion_factor: 'zin_east_cw_trade', consumer_goods_factor: 'zin_east_cw_cg' } },
    { id: 'zin_east_dry_land', modifier: { supply_factor: -0.25, truck_attrition_factor: 0.25 } },
    { id: 'zin_east_wells', modifier: { supply_factor: 0.1, local_resources_factor: 0.1 } },
  ];
  const dynTexts = [];
  for (const m of dyn) { dynTexts.push(await renderDynamicModifier(m, T)); defs.dynamicModifiers.push(m.id); }
  // The two causes. Their names and descriptions are written by the diplomacy module (zin_cb_free_east, zin_cb_high_king).
  dynTexts.push(`zin_cb_free_east = {\n\tenable = { always = yes }\n\tremove_trigger = { has_global_flag = zin_afrit_dead }\n\tgenerate_wargoal_tension_against = ${N.cb_tension_value}\n}`);
  dynTexts.push(`zin_cb_high_king = {\n\tenable = { always = yes }\n\tgenerate_wargoal_tension_against = ${N.cb_tension_value}\n}`);
  defs.dynamicModifiers.push('zin_cb_free_east', 'zin_cb_high_king');
  put('common/dynamic_modifiers/zin_east.txt', `${HEADER('mech_east', SPEC)}\n\n${dynTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ opinion modifiers
  const opinions = [['zin_east_charter_lost', -15, 1], ['zin_east_court_gifts', 15, 0.5], ['zin_east_wells_quarrel', -10, 1], ['zin_east_concord', 30], ['zin_east_free_crown_kin', 20], ['zin_east_knelt', -25], ['zin_east_talks_held', 10, 0.5], ['zin_east_debt_forgiven', 20, 0.5], ['zin_east_gifts_to_king', 20, 0.5], ['zin_east_host_delayed', -25, 1]].map(([id, value, decay]) => ({ id, value, decay }));
  put('common/opinion_modifiers/zin_east.txt', `${HEADER('mech_east', SPEC)}\nopinion_modifiers = {\n${ind(1, opinions.map(o => renderOpinion(o, T)).join('\n\n'))}\n}`);
  defs.opinions.push(...opinions.map(o => o.id));

  // ------------------------------------------------------------------------------------------------ categories
  const ownFlag = `OR = {\n  AND = {\n    ${isNor}\n    has_country_flag = zin_east_courts_noris\n  }\n  AND = {\n    ${isSta}\n    has_country_flag = zin_east_courts_stabilo\n  }\n}`;
  const cats = [
    { id: 'zin_east_roads', icon: 'GFX_idea_zin_caravan', allowed: powerOnly, visible: powerOnly },
    { id: 'zin_east_wells', icon: 'GFX_idea_zin_granary', allowed: 'zin_east_in_region = yes', visible: 'has_country_flag = zin_east_wells_unlocked' },
    { id: 'zin_east_courts', icon: 'GFX_idea_zin_envoy', allowed: 'zin_east_in_region = yes', visible: `OR = {\n  AND = {\n    ${isNor}\n    has_country_flag = zin_east_courts_noris\n  }\n  AND = {\n    ${isSta}\n    has_country_flag = zin_east_courts_stabilo\n  }\n  has_country_flag = zin_east_free_crowns_leader\n}` },
    { id: 'zin_east_ledger', icon: 'GFX_idea_zin_ledger_coins', allowed: isSta, visible: `${isSta}\nhas_country_flag = zin_stabilo_ledger_open` },
  ];
  for (const x of cats) { if (!icons.has(x.icon)) throw new Error(`Category ${x.id}: icon ${x.icon} is not in the catalog`); defs.categories.push(x.id); }
  put('common/decisions/categories/zin_east.txt', `${HEADER('mech_east', SPEC)}\n\n${cats.map(x => renderCategory(x, T)).join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ decisions
  const prices = N.costs;
  const rivalryBelow = v => `check_variable = { global.zin_east_rivalry < ${v - 0.01} }`;
  const hasPP = v => `has_political_power > ${v}`;
  const courtTarget = 'FROM = {\n  zin_east_is_court = yes\n  NOT = { has_war_with = ROOT }\n}';
  const onRoad = key => `any_owned_state = { zin_is_site_road_${key} = yes }`;
  const anyRoad = `OR = {\n${ROADS.map(r => `  ${onRoad(r.key)}`).join('\n')}\n}`;
  const lean = (cmpNor, cmpSta) => `OR = {\n  AND = {\n    ${isNor}\n    FROM = { check_variable = { zin_east_lean ${cmpNor} } }\n  }\n  AND = {\n    ${isSta}\n    FROM = { check_variable = { zin_east_lean ${cmpSta} } }\n  }\n}`;
  const greatFour = `OR = {\n${R.great.map(n => `  original_tag = ${tag(n)}`).join('\n')}\n}`;
  const protectTarget = `FROM = {
  zin_east_is_court = yes
  is_subject = no
  NOT = { has_war_with = ROOT }
}
OR = {
  AND = {
    ${isNor}
    FROM = { check_variable = { zin_east_lean > ${N.protect_lean - 0.01} } }
  }
  AND = {
    ${isSta}
    FROM = { check_variable = { zin_east_lean < -${N.protect_lean - 0.01} } }
  }
  AND = {
    ${isNor}
    has_country_flag = zin_noris_route_high_king
    FROM = { check_variable = { zin_east_lean > ${N.protect_unite_lean - 0.01} } }
  }
  AND = {
    ${isSta}
    has_country_flag = zin_stabilo_route_empire
    FROM = { check_variable = { zin_east_lean < -${N.protect_unite_lean - 0.01} } }
  }
}`;
  const decisionsList = [];
  for (const r of ROADS) {
    decisionsList.push({
      id: `zin_east_send_caravan_${r.key}`, cat: 'zin_east_roads', icon: 'GFX_idea_zin_caravan', allowed: powerOnly,
      available: `NOT = {\n${ind(1, ownCode.replace(/@/g, r.key))}\n}`, cost: prices.send_caravan, days_re_enable: N.send_caravan_cooldown,
      complete_effect: `${call('zin_east_add_road_influence', { road: r.code, value: N.send_caravan_influence })}`,
      ai: { base: 0, mods: [{ add: 14, when: `check_variable = { ${inf(r)} > ${N.ai_caravan_low - 0.01} }\ncheck_variable = { ${inf(r)} < ${N.ai_caravan_high + 0.01} }` }, { factor: 0, when: `NOT = { ${hasPP(prices.send_caravan + N.ai_reserve)} }` }] },
    });
  }
  decisionsList.push(
    { id: 'zin_east_buy_road_lords', cat: 'zin_east_roads', icon: 'GFX_idea_zin_coin_chest', allowed: powerOnly,
      target_trigger: `FROM = {\n  zin_east_is_court = yes\n  NOT = { has_war_with = ROOT }\n  ${anyRoad}\n}`, cost: prices.buy_road_lords, days_re_enable: N.buy_cooldown,
      complete_effect: `${leanToward(N.buy_lean)}\n${ROADS.map(r => `if = {\n  limit = { FROM = { ${onRoad(r.key)} } }\n${ind(1, call('zin_east_add_road_influence', { road: r.code, value: N.buy_influence }))}\n}`).join('\n')}`,
      ai: { base: 0, mods: [...ROADS.map(r => ({ add: 5, when: `check_variable = { global.zin_east_road_${r.key} = 0 }\nFROM = { ${onRoad(r.key)} }` })), { factor: 0, when: `NOT = { ${hasPP(prices.buy_road_lords + N.ai_reserve)} }` }] } },
    { id: 'zin_east_undercut_rival', cat: 'zin_east_roads', icon: 'GFX_idea_zin_coin_chest', allowed: powerOnly,
      available: `${rivalryBelow(N.undercut_cap)}\n${rivalTag}`, cost: prices.undercut, days_re_enable: N.undercut_cooldown,
      complete_effect: `zin_east_undercut = yes`,
      ai: { base: 0, mods: [{ add: 8, when: rivalryBelow(N.ai_undercut_below) }, { add: 8, when: 'zin_rules_is_free = yes' }, { factor: 0, when: `NOT = { ${hasPP(prices.undercut + N.ai_reserve)} }` }] } },
    { id: 'zin_east_talks_at_the_wells', cat: 'zin_east_roads', icon: 'GFX_idea_zin_handshake_oath', allowed: powerOnly,
      available: `check_variable = { global.zin_east_rivalry > ${N.talks_floor - 0.01} }\n${notWarWithRival}`, cost: prices.talks, days_re_enable: N.talks_cooldown,
      complete_effect: toRival('country_event = { id = zin_east.20 }'),
      ai: { base: 0, mods: [{ add: 20, when: `check_variable = { global.zin_east_rivalry > ${N.ai_talks_rivalry - 0.01} }` }, { factor: 0, when: 'zin_rules_is_historical = yes\nzin_east_after_rift_talk = yes' }, { factor: 0, when: `NOT = { ${hasPP(prices.talks + N.ai_reserve)} }` }] } },
    { id: 'zin_east_concord_of_the_roads', cat: 'zin_east_roads', icon: 'GFX_idea_zin_handshake_oath', allowed: powerOnly,
      available: `check_variable = { global.zin_east_rivalry < ${N.concord_floor + 0.01} }\nNOT = { has_global_flag = zin_east_roads_concord }\n${notWarWithRival}`, cost: prices.concord,
      complete_effect: toRival('country_event = { id = zin_east.23 }'),
      ai: { base: 100 } },
    { id: 'zin_east_dig_wells', cat: 'zin_east_wells', icon: 'GFX_idea_zin_granary', allowed: 'zin_east_in_region = yes', state_target: 'any_owned_state',
      target_trigger: 'FROM = {\n  zin_is_region_south_lands = yes\n  NOT = { has_state_flag = zin_east_wells }\n}', cost: prices.dig_wells, days_re_enable: N.dig_cooldown,
      complete_effect: 'FROM = { zin_east_dig_wells_in = yes }',
      ai: { base: 3, mods: [{ add: 4, when: `FROM = {\n  OR = {\n${ROADS.map(r => `    zin_is_site_road_${r.key} = yes`).join('\n')}\n  }\n}` }, { factor: 0, when: `NOT = { ${hasPP(prices.dig_wells + N.ai_reserve)} }` }] } },

    // courts
    { id: 'zin_east_court_envoys', cat: 'zin_east_courts', icon: 'GFX_idea_zin_envoy', allowed: 'zin_east_in_region = yes', visible: `${ownFlag}`,
      target_trigger: courtTarget, cost: prices.envoys, days_re_enable: N.envoys_cooldown, complete_effect: leanToward(N.envoys_lean),
      ai: { base: 1, mods: [{ add: 6, when: lean('> 29.99', '< -29.99') }, { factor: 0, when: `NOT = { ${hasPP(prices.envoys + N.ai_reserve)} }` }] } },
    { id: 'zin_east_court_gifts', cat: 'zin_east_courts', icon: 'GFX_idea_zin_tribute_chest', allowed: 'zin_east_in_region = yes',
      visible: `OR = {\n  AND = {\n    ${isNor}\n    has_country_flag = zin_noris_envoys\n  }\n  AND = {\n    ${isSta}\n    has_country_flag = zin_stabilo_envoys\n  }\n}`,
      target_trigger: courtTarget, cost: prices.gifts, days_re_enable: N.gifts_cooldown,
      complete_effect: `${leanToward(N.gifts_lean)}\nFROM = { add_opinion_modifier = { target = ROOT modifier = zin_east_court_gifts } }`,
      ai: { base: 0, mods: [{ add: 4, when: lean('> 14.99', '< -14.99') }, { factor: 0, when: `NOT = { ${hasPP(prices.gifts + N.ai_reserve)} }` }] } },
    { id: 'zin_east_invite_to_league', cat: 'zin_east_courts', icon: 'GFX_idea_zin_banner_league', allowed: 'zin_east_in_region = yes',
      visible: `OR = {\n  AND = {\n    ${isNor}\n    has_country_flag = zin_noris_open_treaty\n  }\n  AND = {\n    ${isSta}\n    has_country_flag = zin_stabilo_open_pact\n  }\n}`,
      target_trigger: `FROM = {\n  zin_east_is_court = yes\n  is_in_faction = no\n  NOT = { has_war_with = ROOT }\n}\n${lean(`> ${N.invite_lean - 0.01}`, `< -${N.invite_lean - 0.01}`)}`, cost: prices.invite, days_re_enable: N.invite_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_east.70 } }',
      ai: { base: 5, mods: [{ factor: 0, when: `NOT = { ${hasPP(prices.invite + N.ai_reserve)} }` }] } },
    { id: 'zin_east_offer_protection', cat: 'zin_east_courts', icon: 'GFX_idea_zin_banner_plain', allowed: 'zin_east_in_region = yes',
      visible: `OR = {\n  AND = {\n    ${isNor}\n    OR = {\n      has_country_flag = zin_noris_banner\n      has_country_flag = zin_noris_route_high_king\n    }\n  }\n  AND = {\n    ${isSta}\n    OR = {\n      has_country_flag = zin_stabilo_pact_under_prince\n      has_country_flag = zin_stabilo_route_empire\n    }\n  }\n}`,
      target_trigger: protectTarget,       cost: prices.protection, days_re_enable: N.protect_cooldown, complete_effect: 'FROM = { country_event = { id = zin_east.71 } }',
      ai: { base: 3, mods: [{ add: 4, when: 'FROM = { has_war = yes }' }, { factor: 0, when: `NOT = { ${hasPP(prices.protection + N.ai_reserve)} }` }] } },
    { id: 'zin_east_rally_free_crowns', cat: 'zin_east_courts', icon: 'GFX_idea_zin_banner_league', allowed: 'zin_east_in_region = yes', visible: 'has_country_flag = zin_east_free_crowns_leader',
      target_trigger: 'FROM = {\n  zin_east_free_crown = yes\n  is_in_faction = no\n  NOT = { has_war_with = ROOT }\n}', cost: prices.rally, days_re_enable: N.rally_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_east.70 } }',
      ai: { base: 8 } },

    // the Ledger
    { id: 'zin_stabilo_lend', cat: 'zin_east_ledger', icon: 'GFX_idea_zin_ledger_coins', allowed: isSta,
      target_trigger: `${courtTarget}\nFROM = { check_variable = { zin_stabilo_debt < ${N.lend_debt_cap - 0.01} } }`, cost: prices.lend, days_re_enable: N.lend_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_stabilo.30 } }',
      ai: { base: 0, mods: [{ add: 6, when: 'FROM = {\n  check_variable = { zin_east_lean > -40.01 }\n  check_variable = { zin_east_lean < 20.01 }\n}' }, { add: 8, when: 'FROM = { has_country_flag = zin_east_in_crisis }' }, { factor: 0, when: `NOT = { ${hasPP(prices.lend + N.ai_reserve)} }` }] } },
    { id: 'zin_stabilo_great_loan', cat: 'zin_east_ledger', icon: 'GFX_idea_zin_coin_chest', allowed: isSta, visible: 'has_country_flag = zin_stabilo_loans_to_kings',
      target_trigger: `${courtTarget}\nFROM = {\n  check_variable = { num_owned_states > ${N.great_loan_states - 0.01} }\n  check_variable = { zin_stabilo_debt < ${N.great_loan_debt_cap - 0.01} }\n}`, cost: prices.great_loan, days_re_enable: N.great_loan_cooldown,
      complete_effect: 'FROM = {\n  set_country_flag = zin_stabilo_great_loan\n  country_event = { id = zin_stabilo.30 }\n}',
      ai: { base: 0, mods: [{ add: 8, when: `FROM = {\n${ind(1, greatFour)}\n}` }, { factor: 0, when: `NOT = { ${hasPP(prices.great_loan + N.ai_reserve)} }` }] } },
    { id: 'zin_stabilo_call_in_debt', cat: 'zin_east_ledger', icon: 'GFX_idea_zin_ledger_coins', allowed: isSta, visible: 'has_country_flag = zin_stabilo_collect',
      target_trigger: `${courtTarget}\nFROM = { check_variable = { zin_stabilo_debt > ${N.call_debt_floor - 0.01} } }`, cost: prices.call_debt, days_re_enable: N.call_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_stabilo.31 } }',
      ai: { base: 0, mods: [{ add: 8, when: `NOT = { ${hasPP(N.ai_call_pp)} }` }] } },
    { id: 'zin_stabilo_forgive_debt', cat: 'zin_east_ledger', icon: 'GFX_idea_zin_handshake_oath', allowed: isSta,
      target_trigger: `${courtTarget}\nFROM = { check_variable = { zin_stabilo_debt > ${N.forgive_floor - 0.01} } }`, cost: prices.forgive, days_re_enable: N.forgive_cooldown,
      complete_effect: `FROM = {\n${ind(1, call('zin_stabilo_add_debt', { value: -N.forgive_debt }))}\n${ind(1, call('zin_east_add_lean', { value: -N.forgive_lean }))}\n  add_opinion_modifier = { target = ROOT modifier = zin_east_debt_forgiven }\n}`,
      ai: { base: 1, mods: [{ add: 4, when: `FROM = { check_variable = { zin_east_lean < -${N.invite_lean - 20 - 0.01} } }` }, { factor: 0, when: `NOT = { ${hasPP(prices.forgive + N.ai_reserve)} }` }] } },

    // the hub's own decisions, in the Afrit spec's category
    { id: 'zin_east_feed_the_quarrel', cat: 'zin_afrit_council', icon: 'GFX_idea_zin_eye_watchful', allowed: 'zin_afrit_is_hub = yes', visible: 'zin_afrit_is_hub = yes',
      available: `${NOR} = { check_variable = { zin_footholds > 2.99 } }\n${STA} = { check_variable = { zin_footholds > 2.99 } }\n${rivalryBelow(N.feed_cap)}`, cost: prices.feed, days_re_enable: N.feed_cooldown,
      complete_effect: `${call('zin_east_add_rivalry', { value: N.feed_rivalry })}\n${call('zin_afrit_add_veil', { value: -1 })}`,
      ai: { base: 2, mods: [{ factor: 0, when: `NOT = { ${hasPP(prices.feed + N.ai_reserve)} }` }] } },
    { id: 'zin_east_whisper_of_the_rift', cat: 'zin_afrit_council', icon: 'GFX_idea_zin_eye_watchful', allowed: 'zin_afrit_is_hub = yes', visible: 'zin_afrit_is_hub = yes',
      available: 'has_global_flag = zin_golden_king_dead\nNOT = { has_global_flag = zin_eastern_invasion }', cost: prices.whisper, fire_only_once: true,
      complete_effect: `every_country = {\n  limit = {\n    zin_east_in_region = yes\n    check_variable = { zin_footholds > 2.99 }\n  }\n  set_country_flag = { flag = zin_east_rift_whispered days = ${N.whisper_days} }\n}\n${call('zin_afrit_add_veil', { value: -2 })}`,
      ai: { base: 3 } },
    { id: 'zin_east_report', cat: 'zin_afrit_council', icon: 'GFX_idea_zin_eye_watchful', allowed: 'zin_afrit_is_hub = yes', visible: 'zin_afrit_is_hub = yes',
      available: 'always = yes', cost: 0,
      complete_effect: 'zin_east_make_report = yes\ncountry_event = { id = zin_east.31 }',
      ai: { base: 0 } },
  );
  const byCat = new Map();
  for (const d of decisionsList) {
    if (!icons.has(d.icon)) throw new Error(`Decision ${d.id}: icon ${d.icon} is not in the catalog`);
    defs.decisions.push(d.id);
    if (!byCat.has(d.cat)) byCat.set(d.cat, []);
    byCat.get(d.cat).push(renderDecision({ ...d, fire_only_once: d.fire_only_once }, T));
  }
  put('common/decisions/zin_east.txt', `${HEADER('mech_east', SPEC)}\n\n${[...byCat].map(([cat, list]) => `${cat} = {\n${ind(1, list.join('\n\n'))}\n}`).join('\n\n')}`);

  // the effect the undercut decision calls (the rival's influence falls on every road both are on)
  E_('zin_east_undercut', `${ROADS.map(r => `if = {
  limit = { check_variable = { ${inf(r)} > ${N.undercut_both - 0.01} } }
${ind(1, toRival(`if = {\n  limit = { check_variable = { ${inf(r)} > ${N.undercut_both - 0.01} } }\n${ind(1, call('zin_east_add_road_influence', { road: r.code, value: -N.undercut_influence }))}\n}`))}
}`).join('\n')}
${call('zin_east_add_rivalry', { value: N.undercut_rivalry })}`);

  // ------------------------------------------------------------------------------------------------ events
  const ev = (id, o) => ({ id, ...o });
  const fromIs = t => `FROM = { original_tag = ${t} }`;
  const newsEast = 'zin_east_in_region = yes';
  const crisisLoan = { base: 60, mods: [{ add: 30, when: 'has_country_flag = zin_east_in_crisis' }, { factor: 0, when: 'OR = {\n  has_country_flag = zin_east_court_audit\n  has_country_flag = zin_noris_audit\n  has_country_flag = zin_stabilo_audit\n}' }] };
  const eventsList = [
    ev('zin_east.1', { hidden: true, fire_only_once: true, immediate: 'zin_east_startup = yes' }),
    ev('zin_east.2', { hidden: true, immediate: 'zin_east_monthly = yes' }),
    ev('zin_east.10', { picture: 'GFX_zin_evt_generic_peace',
      descVariants: [
        { key: 'winner', trigger: `OR = {\n  AND = {\n    ${isNor}\n    check_variable = { global.zin_east_last_winner = 1 }\n  }\n  AND = {\n    ${isSta}\n    check_variable = { global.zin_east_last_winner = 2 }\n  }\n}` },
        { key: 'loser', trigger: `OR = {\n  AND = {\n    ${isNor}\n    check_variable = { global.zin_east_last_winner = 2 }\n  }\n  AND = {\n    ${isSta}\n    check_variable = { global.zin_east_last_winner = 1 }\n  }\n}` },
        { key: 'court', trigger: 'zin_east_is_court = yes' }],
      options: [
        { key: 'a', trigger: `OR = {\n  AND = {\n    ${isNor}\n    check_variable = { global.zin_east_last_winner = 1 }\n  }\n  AND = {\n    ${isSta}\n    check_variable = { global.zin_east_last_winner = 2 }\n  }\n}` },
        { key: 'b', trigger: `OR = {\n  AND = {\n    ${isNor}\n    check_variable = { global.zin_east_last_winner = 2 }\n  }\n  AND = {\n    ${isSta}\n    check_variable = { global.zin_east_last_winner = 1 }\n  }\n}` },
        { key: 'c', trigger: 'zin_east_is_court = yes' }] }),
    ev('zin_east.15', { picture: 'GFX_zin_evt_generic_court', mtth: `days = ${N.wells_mtth}`,
      trigger: `${powerOnly}\ncheck_variable = { global.zin_east_rivalry > ${N.wells_rivalry - 0.01} }\n${rivalTag}\nOR = {\n  AND = {\n    ${isNor}\n    check_variable = { global.zin_east_wells_turn = 1 }\n  }\n  AND = {\n    ${isSta}\n    check_variable = { global.zin_east_wells_turn = 2 }\n  }\n}`,
      immediate: side('set_variable = { global.zin_east_wells_turn = 2 }', 'set_variable = { global.zin_east_wells_turn = 1 }'),
      options: [
        { key: 'a', ai: 40, effect: `add_political_power = -${N.wells_blood_price}\n${call('zin_east_add_rivalry', { value: -N.wells_blood_rivalry })}` },
        { key: 'b', ai: 40, effect: `add_war_support = ${N.wells_punish_ws}\n${call('zin_east_add_rivalry', { value: N.wells_punish_rivalry })}` },
        { key: 'c', ai: 20, effect: toRival('country_event = { id = zin_east.16 }') }] }),
    ev('zin_east.16', { picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: 50, effect: `${call('zin_east_add_rivalry', { value: N.inquiry_refuse_rivalry })}\nFROM = { add_opinion_modifier = { target = ROOT modifier = zin_east_wells_quarrel } }\nadd_opinion_modifier = { target = FROM modifier = zin_east_wells_quarrel }` },
      { key: 'b', ai: { base: 50, mods: [{ factor: 0.5, when: `check_variable = { global.zin_east_rivalry > ${N.inquiry_hot - 0.01} }` }] }, effect: call('zin_east_add_rivalry', { value: -N.inquiry_rivalry }) }] }),
    ev('zin_east.20', { picture: 'GFX_zin_evt_generic_peace', options: [
      { key: 'a', ai: 40, effect: `${call('zin_east_add_rivalry', { value: N.talks_refused_rivalry })}\nset_variable = { global.zin_east_talks_result = 0 }\nFROM = { country_event = { id = zin_east.21 } }` },
      { key: 'b', ai: { base: 60, mods: [{ factor: 0.3, when: 'check_variable = { zin_east_charters < FROM.zin_east_charters }' }] }, effect: `${call('zin_east_add_rivalry', { value: -N.talks_rivalry })}\nset_variable = { global.zin_east_talks_result = 1 }\nadd_opinion_modifier = { target = FROM modifier = zin_east_talks_held }\nFROM = {\n  add_opinion_modifier = { target = ROOT modifier = zin_east_talks_held }\n  country_event = { id = zin_east.21 }\n}` }] }),
    ev('zin_east.21', { picture: 'GFX_zin_evt_generic_peace', descVariants: [{ key: 'yes', trigger: 'check_variable = { global.zin_east_talks_result = 1 }' }, { key: 'no', trigger: 'check_variable = { global.zin_east_talks_result = 0 }' }], options: [{ key: 'a' }] }),
    ev('zin_east.23', { picture: 'GFX_zin_evt_generic_peace', options: [
      { key: 'a', ai: 20, effect: call('zin_east_add_rivalry', { value: N.concord_refused_rivalry }) },
      { key: 'b', ai: 80, effect: 'zin_east_sign_concord = yes' }] }),
    ev('zin_east.24', { kind: 'news_event', picture: 'GFX_zin_news_generic_peace', show_major: newsEast, options: [{ key: 'a' }] }),
    ev('zin_east.25', { kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: newsEast, options: [{ key: 'a' }] }),
    ev('zin_east.26', { picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 70, mods: [{ factor: 0.4, when: `surrender_progress > ${N.yield_surrender}` }] } },
      { key: 'b', ai: { base: 30, mods: [{ add: 40, when: `surrender_progress > ${N.yield_surrender}` }] }, effect: `every_owned_state = {\n  limit = {\n    is_claimed_by = FROM\n    OR = {\n${ROADS.map(r => `      zin_is_site_road_${r.key} = yes`).join('\n')}\n    }\n  }\n  set_state_owner = FROM\n  set_state_controller = FROM\n}\nwhite_peace = FROM\nFROM = { country_event = { id = zin_east.27 } }` }] }),
    ev('zin_east.27', { kind: 'news_event', picture: 'GFX_zin_news_generic_peace', show_major: newsEast, options: [{ key: 'a' }] }),
    ev('zin_east.30', { picture: 'GFX_zin_evt_houses',
      mtth: `days = ${N.loan_mtth}\nmodifier = {\n  factor = 0\n  NOT = { zin_east_is_court = yes }\n}\nmodifier = {\n  factor = 0\n  NOT = { check_variable = { zin_footholds > 1.99 } }\n}\nmodifier = {\n  factor = 0\n  NOT = {\n    OR = {\n      has_country_flag = zin_east_in_crisis\n      has_stability < ${N.loan_stability}\n    }\n  }\n}\nmodifier = {\n  factor = 0\n  has_country_flag = zin_east_loan_recent\n}`,
      trigger: 'NOT = { has_global_flag = zin_afrit_dead }',
      immediate: `set_country_flag = { flag = zin_east_loan_recent days = ${N.loan_gap_days} }`,
      options: [
        { key: 'a', ai: 40 },
        { key: 'b', ai: crisisLoan, effect: `add_timed_idea = { idea = zin_east_temple_loan days = ${N.loan_idea_days} }\n${call('zin_afrit_add_footholds', { value: 1 })}\nset_country_flag = { flag = zin_east_owes_temples days = ${N.owes_days} }` },
        { key: 'c', trigger: `NOT = { ${isSta} }\ncountry_exists = ${STA}\nNOT = { has_war_with = ${STA} }\n${STA} = { has_country_flag = zin_stabilo_ledger_open }`, ai: { base: 0, mods: [{ add: 50, when: 'check_variable = { zin_east_lean < 0.01 }' }] },
          effect: `${call('zin_stabilo_add_debt', { value: N.loan_debt })}\nadd_political_power = ${N.loan_pp}\n${STA} = { country_event = { id = zin_east.32 } }` }] }),
    ev('zin_east.31', { picture: 'GFX_zin_evt_council_chamber', options: [{ key: 'a' }] }),
    ev('zin_east.32', { picture: 'GFX_zin_evt_generic_peace', options: [{ key: 'a' }] }),
    ev('zin_east.35', { picture: 'GFX_zin_evt_generic_wilds', options: [
      { key: 'a', ai: 60, effect: 'zin_east_wells_random = yes' },
      { key: 'b', ai: 40, effect: `add_political_power = ${N.sand_stories_pp}` }] }),
    ev('zin_east.36', { picture: 'GFX_zin_evt_generic_wilds', mtth: `days = ${N.dry_mtth}`, trigger: 'zin_east_is_south_court = yes',
      options: [
        { key: 'a', ai: 40, effect: `add_timed_idea = { idea = zin_east_rationed_water days = ${N.ration_days} }` },
        { key: 'b', ai: 60, trigger: hasPP(N.dig_deeper_pp - 0.01), effect: `add_political_power = -${N.dig_deeper_pp}\nzin_east_wells_random = yes` }] }),
    ev('zin_east.40', { picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: 50, effect: `add_political_power = ${N.old_tales_pp}` },
      { key: 'b', ai: 50, effect: 'set_country_flag = zin_east_rift_ambition' }] }),
    ev('zin_east.70', { picture: 'GFX_zin_evt_generic_court',
      descVariants: [{ key: 'noris', trigger: fromIs(NOR) }, { key: 'stabilo', trigger: fromIs(STA) }, { key: 'free', trigger: `FROM = {\n  NOT = { original_tag = ${NOR} }\n  NOT = { original_tag = ${STA} }\n}` }],
      options: [
        { key: 'a', ai: 30, effect: `set_variable = { global.zin_east_invite_result = 0 }\nif = {\n  limit = { ${fromIs(NOR)} }\n${ind(1, call('zin_east_add_lean', { value: -N.decline_lean }))}\n}\nelse_if = {\n  limit = { ${fromIs(STA)} }\n${ind(1, call('zin_east_add_lean', { value: N.decline_lean }))}\n}\nFROM = { country_event = { id = zin_east.72 } }` },
        { key: 'b', ai: { base: 0, mods: [
          { add: 70, when: `FROM = {\n  NOT = { original_tag = ${NOR} }\n  NOT = { original_tag = ${STA} }\n}` },
          ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ add: 10, when: `FROM = { original_tag = ${NOR} }\ncheck_variable = { zin_east_lean > ${N.accept_offset + i * 10 + 9.99} }` })),
          ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ add: 10, when: `FROM = { original_tag = ${STA} }\ncheck_variable = { zin_east_lean < -${N.accept_offset + i * 10 + 9.99} }` })),
          { add: 20, when: 'is_neighbor_of = FROM' },
          { add: -30, when: `OR = {\n  AND = {\n    ${fromIs(NOR)}\n    any_neighbor_country = { original_tag = ${STA} }\n  }\n  AND = {\n    ${fromIs(STA)}\n    any_neighbor_country = { original_tag = ${NOR} }\n  }\n}` }] },
          effect: `set_variable = { global.zin_east_invite_result = 1 }\nFROM = {\n  if = {\n    limit = {\n      is_in_faction = no\n      has_country_flag = zin_east_free_crowns_leader\n    }\n    create_faction_from_template = zin_faction_free_crowns\n  }\n  add_to_faction = ROOT\n  country_event = { id = zin_east.72 }\n}` }] }),
    ev('zin_east.71', { picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 40, mods: [{ factor: 0, when: `check_variable = { zin_east_lean < ${N.protect_unite_lean - 0.01} }\ncheck_variable = { zin_east_lean > -${N.protect_unite_lean - 0.01} }` }] },
        effect: `set_variable = { global.zin_east_invite_result = 0 }\nif = {\n  limit = { ${fromIs(NOR)} }\n${ind(1, call('zin_east_add_lean', { value: -N.protect_refuse_lean }))}\n}\nelse = {\n${ind(1, call('zin_east_add_lean', { value: N.protect_refuse_lean }))}\n}\nFROM = { country_event = { id = zin_east.72 } }` },
      { key: 'b', ai: { base: 0, mods: [...[0, 1, 2, 3, 4, 5].map(i => ({ add: 10, when: `FROM = { original_tag = ${NOR} }\ncheck_variable = { zin_east_lean > ${N.protect_ai_offset + i * 10 + 9.99} }` })), ...[0, 1, 2, 3, 4, 5].map(i => ({ add: 10, when: `FROM = { original_tag = ${STA} }\ncheck_variable = { zin_east_lean < -${N.protect_ai_offset + i * 10 + 9.99} }` })), { factor: 2, when: 'has_war = yes' }] },
        effect: `set_variable = { global.zin_east_invite_result = 1 }\nFROM = {\n  puppet = ROOT\n  country_event = { id = zin_east.72 }\n}` }] }),
    ev('zin_east.72', { picture: 'GFX_zin_evt_generic_court', descVariants: [{ key: 'yes', trigger: 'check_variable = { global.zin_east_invite_result = 1 }' }, { key: 'no', trigger: 'check_variable = { global.zin_east_invite_result = 0 }' }], options: [{ key: 'a' }] }),
    ev('zin_east.73', { picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: 40, effect: `if = {\n  limit = { zin_east_question_open = yes }\n  every_owned_state = {\n    limit = {\n      OR = {\n${ROADS.map(r => `        zin_is_site_road_${r.key} = yes`).join('\n')}\n      }\n    }\n    add_claim_by = FROM\n  }\n}` },
      { key: 'b', ai: { base: 0, mods: [0, 1, 2, 3, 4, 5, 6].map(i => ({ add: 10, when: `OR = {\n  AND = {\n    ${fromIs(NOR)}\n    check_variable = { zin_east_lean > ${N.homage_offset + i * 10 + 9.99} }\n  }\n  AND = {\n    ${fromIs(STA)}\n    check_variable = { zin_east_lean < -${N.homage_offset + i * 10 + 9.99} }\n  }\n}` })) },
        effect: `set_variable = { global.zin_east_invite_result = 1 }\nFROM = {\n  puppet = ROOT\n  country_event = { id = zin_east.72 }\n}` }] }),
    ev('zin_east.80', { kind: 'news_event', picture: 'GFX_zin_news_generic_court', show_major: 'always = yes', options: [{ key: 'a' }] }),
  ];
  const eventTexts = [];
  for (const e of eventsList) {
    if (!e.hidden && !pictures.has(e.picture)) throw new Error(`Event ${e.id}: picture ${e.picture} is not in the catalog`);
    eventTexts.push(renderEvent(e, T)); defs.events.push(e.id);
  }
  put('events/zin_east.txt', `${HEADER('mech_east', SPEC)}\nadd_namespace = zin_east\n\n${eventTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ scripted localisation
  const holder = k => ['noris', 'stabilo', 'free'].map((w, i) => `\ttext = {\n\t\ttrigger = { ${i === 2 ? `check_variable = { global.zin_east_road_${k} = 0 }` : `check_variable = { global.zin_east_road_${k} = ${i + 1} }`} }\n\t\tlocalization_key = ${T.use(`zin_east_road_${k}_${w}`)}\n\t}`).join('\n');
  const lastRoad = ROADS.map(r => `\ttext = {\n\t\ttrigger = { check_variable = { global.zin_east_last_road = ${r.code} } }\n\t\tlocalization_key = ${T.use(`zin_east_name_${r.key}`)}\n\t}`).join('\n');
  put('common/scripted_localisation/zin_east.txt', `${HEADER('mech_east', SPEC)}\n${ROADS.map(r => `defined_text = {\n\tname = zin_east_road_${r.key}_line\n${holder(r.key)}\n}`).join('\n')}\ndefined_text = {\n\tname = zin_east_last_road_name\n${lastRoad}\n}`);
  defs.scriptedLocs.push(...ROADS.map(r => `zin_east_road_${r.key}_line`), 'zin_east_last_road_name');

  // ------------------------------------------------------------------------------------------------ on_actions and AI
  put('common/on_actions/zin_east.txt', `${HEADER('mech_east', SPEC)}
on_actions = {
	on_startup = {
		effect = {
			${NOR} = { country_event = { id = zin_east.1 } }
		}
	}
	on_monthly = {
		effect = {
			if = {
				limit = {
					has_global_flag = zin_east_started
					zin_east_is_runner = yes
				}
				country_event = { id = zin_east.2 }
			}
		}
	}
	on_declare_war = {
		effect = {
			zin_east_on_declare_war = yes
		}
	}
	on_peace = {
		effect = {
			zin_east_on_peace = yes
		}
	}
	on_capitulation = {
		effect = {
			zin_east_on_capitulation = yes
		}
	}
}`);
  const strat = (id, enable, lines) => `${id} = {\n\tenable = { ${enable} }\n\tabort_when_not_enabled = yes\n${lines.map(([type, tg, v]) => `\tai_strategy = {\n\t\ttype = ${type}\n\t\tid = "${tg}"\n\t\tvalue = ${v}\n\t}`).join('\n')}\n}`;
  const magical = c.countries.filter(x => x.scan === 'Magical Lands');
  const blocks = [
    HEADER('mech_east', SPEC),
    strat('zin_east_free_crowns_prepare', `zin_east_free_crown = yes\n\t\tOR = {\n\t\t\tis_neighbor_of = ${WOR}\n\t\t\tany_neighbor_country = { has_country_flag = zin_afrit_eastern_client }\n\t\t}`, [['prepare_for_war', WOR, N.ai_free_prepare]]),
    strat('zin_east_coalition_toward_aenor', `has_country_flag = zin_east_coalition_member\n\t\thas_global_flag = zin_east_turns_west`, [['conquer', AEN, N.ai_conquer_aenor]]),
    ...magical.map(m => strat(`zin_east_coalition_toward_${m.tag.toLowerCase()}`, `has_country_flag = zin_east_coalition_member\n\t\t${m.tag} = { has_country_flag = zin_east_rift_target }`, [['conquer', m.tag, N.ai_conquer]])),
  ];
  put('common/ai_strategy/zin_east.txt', blocks.join('\n\n'));
  defs.aiStrategies.push('zin_east_free_crowns_prepare', 'zin_east_coalition_toward_aenor', ...magical.map(m => `zin_east_coalition_toward_${m.tag.toLowerCase()}`));
  return { eventsList, byCat };
}
