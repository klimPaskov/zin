// Eastern kings mechanic, content half: ideas, dynamic modifiers, opinion modifiers, the decision categories and decisions, the
// events of namespace zin_east that belong to the mechanic, the scripted localisation, the on_actions and the AI strategies.
// Called by mech_east.mjs, which owns the scripted triggers and the effects. The events of the war events spec (zin_east.41 to
// .46, .50 to .52, .60) are only fired and served by effects, never defined here (docs/design/stage2/mech_east.md).
import { fmt, ind, call, num, HEADER, renderEvent, renderDecision, renderCategory, renderIdea, renderDynamicModifier, renderOpinion, knownPictures, knownIcons } from '../lib/mech_kit.mjs';

const SPEC = 'docs/specs/04_mechanics/eastern_kings.md';

export async function buildEastContent(c) {
  const { N, R, T, tags, put, defs, ROADS, inf, tag, ge, east, realms } = c;
  const { NOR, STA, WOR, AEN } = tags;
  const A = N.ai;
  const pictures = await knownPictures(), icons = await knownIcons();
  const isNor = `original_tag = ${NOR}`, isSta = `original_tag = ${STA}`;
  const powerOnly = 'zin_east_is_power = yes';
  const side = (forNor, forSta) => `if = {\n  limit = { ${isNor} }\n${ind(1, fmt(forNor))}\n}\nelse = {\n${ind(1, fmt(forSta))}\n}`;
  const rivalTag = `OR = {\n  AND = {\n    ${isNor}\n    country_exists = ${STA}\n  }\n  AND = {\n    ${isSta}\n    country_exists = ${NOR}\n  }\n}`;
  const notWarWithRival = `OR = {\n  AND = {\n    ${isNor}\n    NOT = { has_war_with = ${STA} }\n  }\n  AND = {\n    ${isSta}\n    NOT = { has_war_with = ${NOR} }\n  }\n}`;
  const toRival = body => side(`${STA} = {\n${ind(1, fmt(body))}\n}`, `${NOR} = {\n${ind(1, fmt(body))}\n}`);
  const leanToward = v => side(`FROM = {\n${ind(1, call('zin_east_add_lean', { value: v }))}\n}`, `FROM = {\n${ind(1, call('zin_east_add_lean', { value: -v }))}\n}`);
  const ownCode = key => `OR = {\n  AND = {\n    ${isNor}\n    check_variable = { global.zin_east_road_${key} = 1 }\n  }\n  AND = {\n    ${isSta}\n    check_variable = { global.zin_east_road_${key} = 2 }\n  }\n}`;
  const flagOf = (forNor, forSta) => `OR = {\n  AND = {\n    ${isNor}\n    ${forNor}\n  }\n  AND = {\n    ${isSta}\n    ${forSta}\n  }\n}`;

  // ------------------------------------------------------------------------------------------------ ideas (spec, Ideas)
  const ideaList = [
    { id: 'zin_east_temple_loan', picture: 'zin_house_first_light', modifier: { political_power_gain: 0.15, stability_factor: 0.03 } },
    { id: 'zin_east_coalition_ambition', picture: 'zin_ship_voyage', modifier: { war_support_factor: 0.05, army_attack_factor: 0.05 } },
    { id: 'zin_east_free_crowns', picture: 'zin_banner_league', modifier: { army_defence_factor: 0.05, stability_factor: 0.03, war_support_factor: 0.05 }, cancel: 'has_global_flag = zin_afrit_dead' },
    { id: 'zin_east_shared_roads', picture: 'zin_handshake_oath', modifier: { consumer_goods_factor: -0.03, trade_opinion_factor: 0.1, political_power_gain: 0.05 } },
    { id: 'zin_east_caravan_war_strain', picture: 'zin_caravan', modifier: { consumer_goods_factor: 0.03, war_support_factor: 0.05 } },
    { id: 'zin_east_kings_debt', picture: 'zin_tribute_chest', modifier: { stability_factor: -0.05, political_power_gain: -0.1 } },
    { id: 'zin_east_vindicated', picture: 'zin_banner_plain', modifier: { stability_factor: 0.05, war_support_factor: 0.03 } },
    { id: 'zin_east_united_crown', picture: 'zin_crown_hailed', modifier: { political_power_gain: 0.25, stability_factor: 0.05, trade_opinion_factor: 0.1 } },
    // Ration the water (zin_east.36): stability -3% for 90 days.
    { id: 'zin_east_rationed_water', picture: 'zin_granary', modifier: { stability_factor: -N.ration_stability } },
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
  // The two causes of this spec, in the diplomacy spec's form (a targeted generate_wargoal_tension_against); their names and
  // descriptions are written by the diplomacy module (diplomacy_text_subjects.json).
  dynTexts.push(`zin_cb_free_east = {\n\tenable = { always = yes }\n\tremove_trigger = { has_global_flag = zin_afrit_dead }\n\tgenerate_wargoal_tension_against = ${N.cb_tension_value}\n}`);
  dynTexts.push(`zin_cb_high_king = {\n\tenable = { always = yes }\n\tgenerate_wargoal_tension_against = ${N.cb_tension_value}\n}`);
  defs.dynamicModifiers.push('zin_cb_free_east', 'zin_cb_high_king');
  put('common/dynamic_modifiers/zin_east.txt', `${HEADER('mech_east', SPEC)}\n\n${dynTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ opinion modifiers
  const opinions = N.opinions.map(([id, value, decay]) => ({ id, value, decay }));
  put('common/opinion_modifiers/zin_east.txt', `${HEADER('mech_east', SPEC)}\nopinion_modifiers = {\n${ind(1, opinions.map(o => renderOpinion(o, T)).join('\n\n'))}\n}`);
  defs.opinions.push(...opinions.map(o => o.id));

  // ------------------------------------------------------------------------------------------------ categories
  const cats = [
    { id: 'zin_east_roads', icon: 'GFX_idea_zin_caravan', allowed: powerOnly, visible: powerOnly },
    // The wells of the desert: every East Lands country whose tree opened them (spec section 8; see the note for the category).
    { id: 'zin_east_desert', icon: 'GFX_idea_zin_granary', allowed: 'zin_east_in_region = yes', visible: 'has_country_flag = zin_east_wells_unlocked' },
    { id: 'zin_east_courts', icon: 'GFX_idea_zin_envoy', allowed: 'zin_east_in_region = yes', visible: `OR = {\n${ind(1, fmt(flagOf('has_country_flag = zin_east_courts_noris', 'has_country_flag = zin_east_courts_stabilo')))}\n  has_country_flag = zin_east_free_crowns_leader\n}` },
    { id: 'zin_east_ledger', icon: 'GFX_idea_zin_ledger_coins', allowed: isSta, visible: `${isSta}\nhas_country_flag = zin_stabilo_ledger_open` },
  ];
  for (const x of cats) { if (!icons.has(x.icon)) throw new Error(`Category ${x.id}: icon ${x.icon} is not in the catalog`); defs.categories.push(x.id); }
  put('common/decisions/categories/zin_east.txt', `${HEADER('mech_east', SPEC)}\n\n${cats.map(x => renderCategory(x, T)).join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ decisions
  const prices = N.costs;
  const rivalryBelow = v => `check_variable = { global.zin_east_rivalry < ${v} }`;
  const hasPP = v => `has_political_power > ${num(v - 0.01)}`;
  const reserve = v => ({ factor: 0, when: `NOT = { ${hasPP(v + N.ai_reserve)} }` });
  const courtTarget = 'FROM = {\n  zin_east_is_court = yes\n  NOT = { has_war_with = ROOT }\n}';
  const onRoad = key => `any_owned_state = { zin_is_site_road_${key} = yes }`;
  const anyRoad = `OR = {\n${ROADS.map(r => `  ${onRoad(r.key)}`).join('\n')}\n}`;
  const lean = (cmpNor, cmpSta) => flagOf(`FROM = { check_variable = { zin_east_lean ${cmpNor} } }`, `FROM = { check_variable = { zin_east_lean ${cmpSta} } }`);
  const greatFour = `OR = {\n${R.great.map(n => `  original_tag = ${tag(n)}`).join('\n')}\n}`;
  const protectTarget = `FROM = {
  zin_east_is_court = yes
  is_subject = no
  NOT = { has_war_with = ROOT }
}
OR = {
  AND = {
    ${isNor}
    FROM = { ${ge('zin_east_lean', N.protect_lean)} }
  }
  AND = {
    ${isSta}
    FROM = { check_variable = { zin_east_lean < -${num(N.protect_lean - 0.01)} } }
  }
  AND = {
    ${isNor}
    has_country_flag = zin_noris_route_high_king
    FROM = { ${ge('zin_east_lean', N.protect_unite_lean)} }
  }
  AND = {
    ${isSta}
    has_country_flag = zin_stabilo_route_empire
    FROM = { check_variable = { zin_east_lean < -${num(N.protect_unite_lean - 0.01)} } }
  }
}`;
  const rivalGuarantees = flagOf(`FROM = { is_guaranteed_by = ${STA} }`, `FROM = { is_guaranteed_by = ${NOR} }`);
  const decisionsList = [];
  for (const r of ROADS) {
    decisionsList.push({
      id: `zin_east_send_caravan_${r.key}`, cat: 'zin_east_roads', icon: 'GFX_idea_zin_caravan', allowed: powerOnly,
      available: `NOT = {\n${ind(1, fmt(ownCode(r.key)))}\n}`, cost: prices.send_caravan, days_re_enable: N.send_caravan_cooldown,
      complete_effect: call('zin_east_add_road_influence', { road: r.code, value: N.send_caravan_influence }),
      ai: { base: 0, mods: [{ add: A.caravan_road, when: `${ge(inf(r), N.ai_caravan_low)}\ncheck_variable = { ${inf(r)} < ${num(N.ai_caravan_high + 0.01)} }` }, reserve(prices.send_caravan)] },
    });
  }
  decisionsList.push(
    { id: 'zin_east_buy_road_lords', cat: 'zin_east_roads', icon: 'GFX_idea_zin_caravan', allowed: powerOnly, target_root_trigger: powerOnly,
      target_trigger: `FROM = {\n  zin_east_is_court = yes\n  NOT = { has_war_with = ROOT }\n${ind(1, fmt(anyRoad))}\n}`, cost: prices.buy_road_lords, days_re_enable: N.buy_cooldown,
      complete_effect: `${leanToward(N.buy_lean)}\n${ROADS.map(r => `if = {\n  limit = { FROM = { ${onRoad(r.key)} } }\n${ind(1, call('zin_east_add_road_influence', { road: r.code, value: N.buy_influence }))}\n}`).join('\n')}`,
      ai: { base: 0, mods: [...ROADS.map(r => ({ add: A.buy_free_road, when: `check_variable = { global.zin_east_road_${r.key} = 0 }\nFROM = { ${onRoad(r.key)} }` })), reserve(prices.buy_road_lords)] } },
    { id: 'zin_east_undercut_rival', cat: 'zin_east_roads', icon: 'GFX_idea_zin_caravan', allowed: powerOnly,
      available: `${rivalryBelow(N.undercut_cap)}\n${rivalTag}`, cost: prices.undercut, days_re_enable: N.undercut_cooldown,
      complete_effect: 'zin_east_undercut = yes',
      ai: { base: 0, mods: [{ add: A.undercut, when: rivalryBelow(N.ai_undercut_below) }, { add: A.undercut, when: 'zin_rules_is_free = yes' }, reserve(prices.undercut)] } },
    { id: 'zin_east_talks_at_the_wells', cat: 'zin_east_roads', icon: 'GFX_idea_zin_caravan', allowed: powerOnly,
      available: `${ge('global.zin_east_rivalry', N.talks_floor)}\n${notWarWithRival}`, cost: prices.talks, days_re_enable: N.talks_cooldown,
      complete_effect: toRival('country_event = { id = zin_east.20 }'),
      ai: { base: 0, mods: [{ add: A.talks, when: ge('global.zin_east_rivalry', N.ai_talks_rivalry) }, { factor: 0, when: 'zin_rules_is_historical = yes\nzin_east_after_rift_talk = yes' }, reserve(prices.talks)] } },
    { id: 'zin_east_concord_of_the_roads', cat: 'zin_east_roads', icon: 'GFX_idea_zin_caravan', allowed: powerOnly,
      available: `check_variable = { global.zin_east_rivalry < ${num(N.concord_floor + 0.01)} }\nNOT = { has_global_flag = zin_east_roads_concord }\n${notWarWithRival}`, cost: prices.concord,
      complete_effect: toRival('country_event = { id = zin_east.23 }'),
      ai: { base: A.concord } },
    { id: 'zin_east_dig_wells', cat: 'zin_east_desert', icon: 'GFX_idea_zin_granary', allowed: 'zin_east_in_region = yes', visible: 'has_country_flag = zin_east_wells_unlocked', state_target: 'any_owned_state',
      target_root_trigger: 'has_country_flag = zin_east_wells_unlocked',
      target_trigger: 'FROM = {\n  zin_is_region_south_lands = yes\n  NOT = { has_state_flag = zin_east_wells }\n}', cost: prices.dig_wells, days_re_enable: N.dig_cooldown,
      complete_effect: 'FROM = { zin_east_dig_wells_in = yes }',
      ai: { base: A.dig_base, mods: [{ add: A.dig_road, when: `FROM = {\n  OR = {\n${ROADS.map(r => `    zin_is_site_road_${r.key} = yes`).join('\n')}\n  }\n}` }, reserve(prices.dig_wells)] } },

    // courts
    { id: 'zin_east_court_envoys', cat: 'zin_east_courts', icon: 'GFX_idea_zin_envoy', allowed: 'zin_east_in_region = yes',
      visible: flagOf('has_country_flag = zin_east_courts_noris', 'has_country_flag = zin_east_courts_stabilo'), target_root_trigger: powerOnly,
      target_trigger: courtTarget, cost: prices.envoys, days_re_enable: N.envoys_cooldown, complete_effect: leanToward(N.envoys_lean),
      ai: { base: A.envoys_base, mods: [{ add: A.envoys_lean, when: lean(`> ${num(N.ai_envoys_lean - 0.01)}`, `< -${num(N.ai_envoys_lean - 0.01)}`) }, reserve(prices.envoys)] } },
    // The spec names this decision zin_east_court_gifts, the key of the opinion modifier the shared tree adds too; one name would
    // give both one text, so the decision carries the verb.
    { id: 'zin_east_send_court_gifts', cat: 'zin_east_courts', icon: 'GFX_idea_zin_envoy', allowed: 'zin_east_in_region = yes',
      visible: flagOf('has_country_flag = zin_noris_envoys', 'has_country_flag = zin_stabilo_envoys'), target_root_trigger: powerOnly,
      target_trigger: courtTarget, cost: prices.gifts, days_re_enable: N.gifts_cooldown,
      complete_effect: `${leanToward(N.gifts_lean)}\nFROM = { add_opinion_modifier = { target = ROOT modifier = zin_east_court_gifts } }`,
      ai: { base: 0, mods: [{ add: A.gifts, when: lean(`> ${num(N.ai_gifts_lean - 0.01)}`, `< -${num(N.ai_gifts_lean - 0.01)}`) }, reserve(prices.gifts)] } },
    { id: 'zin_east_invite_to_league', cat: 'zin_east_courts', icon: 'GFX_idea_zin_envoy', allowed: 'zin_east_in_region = yes',
      visible: flagOf('has_country_flag = zin_noris_open_treaty', 'has_country_flag = zin_stabilo_open_pact'), target_root_trigger: powerOnly,
      target_trigger: `FROM = {\n  zin_east_is_court = yes\n  is_in_faction = no\n  NOT = { has_war_with = ROOT }\n}\n${lean(`> ${num(N.invite_lean - 0.01)}`, `< -${num(N.invite_lean - 0.01)}`)}`, cost: prices.invite, days_re_enable: N.invite_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_east.70 } }',
      ai: { base: A.invite, mods: [{ factor: 0, when: rivalGuarantees }, reserve(prices.invite)] } },
    { id: 'zin_east_offer_protection', cat: 'zin_east_courts', icon: 'GFX_idea_zin_envoy', allowed: 'zin_east_in_region = yes',
      visible: flagOf('OR = {\n      has_country_flag = zin_noris_banner\n      has_country_flag = zin_noris_route_high_king\n    }', 'OR = {\n      has_country_flag = zin_stabilo_pact_under_prince\n      has_country_flag = zin_stabilo_route_empire\n    }'), target_root_trigger: powerOnly,
      target_trigger: protectTarget, cost: prices.protection, days_re_enable: N.protect_cooldown, complete_effect: 'FROM = { country_event = { id = zin_east.71 } }',
      ai: { base: A.protect_base, mods: [{ add: A.protect_war, when: 'FROM = { has_war = yes }' }, reserve(prices.protection)] } },
    { id: 'zin_east_rally_free_crowns', cat: 'zin_east_courts', icon: 'GFX_idea_zin_banner_league', allowed: 'zin_east_in_region = yes', visible: 'has_country_flag = zin_east_free_crowns_leader',
      target_root_trigger: 'has_country_flag = zin_east_free_crowns_leader',
      target_trigger: 'FROM = {\n  zin_east_free_crown = yes\n  is_in_faction = no\n  NOT = { has_war_with = ROOT }\n}', cost: prices.rally, days_re_enable: N.rally_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_east.70 } }',
      ai: { base: A.rally } },

    // the Ledger (specified in the Stabilo tree spec)
    { id: 'zin_stabilo_lend', cat: 'zin_east_ledger', icon: 'GFX_idea_zin_ledger_coins', allowed: isSta, target_root_trigger: 'has_country_flag = zin_stabilo_ledger_open',
      target_trigger: `${courtTarget}\nFROM = { check_variable = { zin_stabilo_debt < ${N.lend_debt_cap} } }`, cost: prices.lend, days_re_enable: N.lend_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_stabilo.30 } }',
      ai: { base: 0, mods: [{ add: A.lend_band, when: `FROM = {\n  ${ge('zin_east_lean', N.ai_lend_low)}\n  check_variable = { zin_east_lean < ${num(N.ai_lend_high + 0.01)} }\n}` }, { add: A.lend_crisis, when: 'FROM = { has_country_flag = zin_east_in_crisis }' }, reserve(prices.lend)] } },
    { id: 'zin_stabilo_great_loan', cat: 'zin_east_ledger', icon: 'GFX_idea_zin_ledger_coins', allowed: isSta, visible: 'has_country_flag = zin_stabilo_loans_to_kings', target_root_trigger: 'has_country_flag = zin_stabilo_loans_to_kings',
      target_trigger: `${courtTarget}\nFROM = {\n  ${ge('num_owned_states', N.great_loan_states)}\n  check_variable = { zin_stabilo_debt < ${N.great_loan_debt_cap} }\n}`, cost: prices.great_loan, days_re_enable: N.great_loan_cooldown,
      complete_effect: 'FROM = {\n  set_country_flag = zin_stabilo_great_loan\n  country_event = { id = zin_stabilo.30 }\n}',
      ai: { base: 0, mods: [{ add: A.great_loan, when: `FROM = {\n${ind(1, fmt(greatFour))}\n}` }, reserve(prices.great_loan)] } },
    { id: 'zin_stabilo_call_in_debt', cat: 'zin_east_ledger', icon: 'GFX_idea_zin_ledger_coins', allowed: isSta, visible: 'has_country_flag = zin_stabilo_collect', target_root_trigger: 'has_country_flag = zin_stabilo_collect',
      target_trigger: `${courtTarget}\nFROM = { ${ge('zin_stabilo_debt', N.call_debt_floor)} }`, cost: prices.call_debt, days_re_enable: N.call_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_stabilo.31 } }',
      ai: { base: 0, mods: [{ add: A.call_in, when: `NOT = { ${hasPP(N.ai_call_pp)} }` }] } },
    { id: 'zin_stabilo_forgive_debt', cat: 'zin_east_ledger', icon: 'GFX_idea_zin_ledger_coins', allowed: isSta, target_root_trigger: 'has_country_flag = zin_stabilo_ledger_open',
      target_trigger: `${courtTarget}\nFROM = { ${ge('zin_stabilo_debt', N.forgive_floor)} }`, cost: prices.forgive, days_re_enable: N.forgive_cooldown,
      complete_effect: `FROM = {\n${ind(1, call('zin_stabilo_add_debt', { value: -N.forgive_debt }))}\n${ind(1, call('zin_east_add_lean', { value: -N.forgive_lean }))}\n  add_opinion_modifier = { target = ROOT modifier = zin_east_debt_forgiven }\n}`,
      ai: { base: A.forgive_base, mods: [{ add: A.forgive_lean, when: `FROM = { check_variable = { zin_east_lean < -${num(N.ai_forgive_lean - 0.01)} } }` }, reserve(prices.forgive)] } },

    // the hub's own decisions, in the Afrit spec's category
    { id: 'zin_east_feed_the_quarrel', cat: 'zin_afrit_council', icon: 'GFX_idea_zin_eye_watchful', allowed: 'zin_afrit_is_hub = yes', visible: 'zin_afrit_is_hub = yes',
      available: `${NOR} = { ${ge('zin_footholds', N.feed_footholds)} }\n${STA} = { ${ge('zin_footholds', N.feed_footholds)} }\n${rivalryBelow(N.feed_cap)}`, cost: prices.feed, days_re_enable: N.feed_cooldown,
      complete_effect: `${call('zin_east_add_rivalry', { value: N.feed_rivalry })}\n${call('zin_afrit_add_veil', { value: -N.feed_veil })}`,
      ai: { base: A.feed, mods: [reserve(prices.feed)] } },
    { id: 'zin_east_whisper_of_the_rift', cat: 'zin_afrit_council', icon: 'GFX_idea_zin_eye_watchful', allowed: 'zin_afrit_is_hub = yes', visible: 'zin_afrit_is_hub = yes',
      available: 'has_global_flag = zin_golden_king_dead\nNOT = { has_global_flag = zin_eastern_invasion }', cost: prices.whisper, fire_only_once: true,
      complete_effect: `every_country = {\n  limit = {\n    zin_east_in_region = yes\n    ${ge('zin_footholds', N.feed_footholds)}\n  }\n  set_country_flag = { flag = zin_east_rift_whispered days = ${N.whisper_days} }\n}\n${call('zin_afrit_add_veil', { value: -N.whisper_veil })}`,
      ai: { base: A.whisper } },
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
    byCat.get(d.cat).push(renderDecision(d, T));
  }
  put('common/decisions/zin_east.txt', `${HEADER('mech_east', SPEC)}\n\n${[...byCat].map(([cat, list]) => `${cat} = {\n${ind(1, list.join('\n\n'))}\n}`).join('\n\n')}`);

  // the effect the undercut decision calls: the rival loses influence on every road where both are strong
  c.E_('zin_east_undercut', `${ROADS.map(r => `if = {
  limit = { ${ge(inf(r), N.undercut_both)} }
${ind(1, fmt(toRival(`if = {\n  limit = { ${ge(inf(r), N.undercut_both)} }\n${ind(1, call('zin_east_add_road_influence', { road: r.code, value: -N.undercut_influence }))}\n}`)))}
}`).join('\n')}
${call('zin_east_add_rivalry', { value: N.undercut_rivalry })}`);

  // ------------------------------------------------------------------------------------------------ events
  const ev = (id, o) => ({ id, ...o });
  const fromIs = t => `FROM = { original_tag = ${t} }`;
  const newsEast = 'zin_east_in_region = yes';
  const audits = 'OR = {\n  has_country_flag = zin_east_court_audit\n  has_country_flag = zin_noris_audit\n  has_country_flag = zin_stabilo_audit\n}';
  // AI weight bands of the spec's "AI = |lean| - offset": +step for every step of lean above the offset (accept), and the same taken
  // from 100 (decline), so the two options read as the spec's percentage.
  const bands = (offset, who) => Array.from({ length: Math.floor((100 - offset) / A.band) }, (_, i) => offset + A.band * (i + 1) - 0.01)
    .map(cut => ({ who, cut }));
  const bandMods = (offset, sign, inviterTest) => bands(offset).flatMap(({ cut }) => [
    { add: sign * A.band, when: `${inviterTest(NOR)}\ncheck_variable = { zin_east_lean > ${num(cut)} }` },
    { add: sign * A.band, when: `${inviterTest(STA)}\ncheck_variable = { zin_east_lean < -${num(cut)} }` },
  ]);
  const byPower = t => `FROM = { original_tag = ${t} }`;
  const freeInviter = `FROM = {\n  NOT = { original_tag = ${NOR} }\n  NOT = { original_tag = ${STA} }\n}`;
  const bordersRival = `OR = {\n  AND = {\n    ${fromIs(NOR)}\n    any_neighbor_country = { original_tag = ${STA} }\n  }\n  AND = {\n    ${fromIs(STA)}\n    any_neighbor_country = { original_tag = ${NOR} }\n  }\n}`;
  const inviteMods = sign => [
    { add: sign * A.free_crowns_accept, when: freeInviter },
    ...bandMods(N.accept_offset, sign, byPower),
    { add: sign * A.border_inviter, when: 'is_neighbor_of = FROM' },
    { add: -sign * A.border_rival, when: bordersRival },
  ];
  const strongerFoe = 'any_enemy_country = {\n  is_neighbor_of = ROOT\n  strength_ratio = { tag = ROOT ratio > 1 }\n}';
  const eventsList = [
    ev('zin_east.1', { hidden: true, fire_only_once: true, immediate: 'zin_east_startup = yes' }),
    ev('zin_east.2', { hidden: true, immediate: 'zin_east_monthly = yes\nzin_east_schedule_month = yes' }),
    // hidden helpers of the story beats (exact delays instead of the month's granularity)
    ev('zin_east.3', { hidden: true, immediate: 'zin_east_cross_rift = yes' }),
    ev('zin_east.5', { hidden: true, immediate: 'zin_east_king_notice = yes' }),
    ev('zin_east.6', { hidden: true, immediate: 'zin_east_enforce_refusers = yes\nzin_east_name_first_crown = yes' }),
    ev('zin_east.10', { picture: 'GFX_zin_evt_generic_peace',
      descVariants: [
        { key: 'winner', trigger: flagOf('check_variable = { global.zin_east_last_winner = 1 }', 'check_variable = { global.zin_east_last_winner = 2 }') },
        { key: 'loser', trigger: flagOf('check_variable = { global.zin_east_last_winner = 2 }', 'check_variable = { global.zin_east_last_winner = 1 }') },
        { key: 'court', trigger: 'zin_east_is_court = yes' }],
      options: [
        { key: 'a', trigger: flagOf('check_variable = { global.zin_east_last_winner = 1 }', 'check_variable = { global.zin_east_last_winner = 2 }') },
        { key: 'b', trigger: flagOf('check_variable = { global.zin_east_last_winner = 2 }', 'check_variable = { global.zin_east_last_winner = 1 }') },
        { key: 'c', trigger: 'zin_east_is_court = yes' }] }),
    ev('zin_east.15', { picture: 'GFX_zin_evt_generic_war', mtth: `days = ${N.wells_mtth}`,
      trigger: `${powerOnly}\n${ge('global.zin_east_rivalry', N.wells_rivalry)}\n${rivalTag}\n${flagOf('check_variable = { global.zin_east_wells_turn = 1 }', 'check_variable = { global.zin_east_wells_turn = 2 }')}`,
      immediate: side('set_variable = { global.zin_east_wells_turn = 2 }', 'set_variable = { global.zin_east_wells_turn = 1 }'),
      options: [
        { key: 'a', ai: A.wells_blood, effect: `add_political_power = -${N.wells_blood_price}\n${call('zin_east_add_rivalry', { value: -N.wells_blood_rivalry })}` },
        { key: 'b', ai: A.wells_punish, effect: `add_war_support = ${N.wells_punish_ws}\n${call('zin_east_add_rivalry', { value: N.wells_punish_rivalry })}` },
        { key: 'c', ai: A.wells_inquiry, effect: toRival('country_event = { id = zin_east.16 }') }] }),
    ev('zin_east.16', { picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: A.inquiry_refuse, effect: `${call('zin_east_add_rivalry', { value: N.inquiry_refuse_rivalry })}\nFROM = { add_opinion_modifier = { target = ROOT modifier = zin_east_wells_quarrel } }\nadd_opinion_modifier = { target = FROM modifier = zin_east_wells_quarrel }` },
      { key: 'b', ai: { base: A.inquiry_agree, mods: [{ factor: A.inquiry_hot_factor, when: ge('global.zin_east_rivalry', N.inquiry_hot) }] }, effect: call('zin_east_add_rivalry', { value: -N.inquiry_rivalry }) }] }),
    ev('zin_east.20', { picture: 'GFX_zin_evt_generic_peace', options: [
      { key: 'a', ai: A.talks_refuse, effect: `${call('zin_east_add_rivalry', { value: N.talks_refused_rivalry })}\nset_variable = { global.zin_east_talks_result = 0 }\nFROM = { country_event = { id = zin_east.21 } }` },
      { key: 'b', ai: { base: A.talks_accept, mods: [{ factor: A.talks_behind_factor, when: 'check_variable = { zin_east_charters < FROM.zin_east_charters }' }] }, effect: `${call('zin_east_add_rivalry', { value: -N.talks_rivalry })}\nset_variable = { global.zin_east_talks_result = 1 }\nadd_opinion_modifier = { target = FROM modifier = zin_east_talks_held }\nFROM = {\n  add_opinion_modifier = { target = ROOT modifier = zin_east_talks_held }\n  country_event = { id = zin_east.21 }\n}` }] }),
    ev('zin_east.21', { picture: 'GFX_zin_evt_grey_ford_truce', descVariants: [{ key: 'yes', trigger: 'check_variable = { global.zin_east_talks_result = 1 }' }, { key: 'no', trigger: 'check_variable = { global.zin_east_talks_result = 0 }' }], options: [{ key: 'a' }] }),
    ev('zin_east.23', { picture: 'GFX_zin_evt_generic_peace', options: [
      { key: 'a', ai: A.concord_not_yet, effect: call('zin_east_add_rivalry', { value: N.concord_refused_rivalry }) },
      { key: 'b', ai: A.concord_sign, effect: 'zin_east_sign_concord = yes' }] }),
    ev('zin_east.24', { kind: 'news_event', picture: 'GFX_zin_news_generic_peace', show_major: newsEast, options: [{ key: 'a' }] }),
    ev('zin_east.25', { kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: newsEast, options: [{ key: 'a' }] }),
    // Terms at the Wells: the immediate block counts the core states the loser still controls, for the AI of the yield option.
    ev('zin_east.26', { picture: 'GFX_zin_evt_generic_court',
      immediate: 'set_variable = { zin_east_cores = 0 }\nset_variable = { zin_east_cores_held = 0 }\nevery_core_state = {\n  add_to_variable = { PREV.zin_east_cores = 1 }\n  if = {\n    limit = { is_controlled_by = PREV }\n    add_to_variable = { PREV.zin_east_cores_held = 2 }\n  }\n}',
      options: [
        { key: 'a', ai: A.terms_fight },
        { key: 'b', ai: { base: 0, mods: [{ add: A.terms_yield, when: 'check_variable = { zin_east_cores_held < zin_east_cores }' }] }, effect: `every_owned_state = {\n  limit = {\n    is_claimed_by = FROM\n    OR = {\n${ROADS.map(r => `      zin_is_site_road_${r.key} = yes`).join('\n')}\n    }\n  }\n  FROM = { transfer_state = PREV }\n}\nFROM = { white_peace = ROOT }\nevery_country = {\n  limit = { zin_east_in_region = yes }\n  news_event = { id = zin_east.27 }\n}` }] }),
    ev('zin_east.27', { kind: 'news_event', picture: 'GFX_zin_news_generic_peace', show_major: newsEast, options: [{ key: 'a' }] }),
    ev('zin_east.30', { picture: 'GFX_zin_evt_houses',
      trigger: `zin_east_is_court = yes\n${ge('zin_footholds', N.loan_footholds)}\nOR = {\n  has_country_flag = zin_east_in_crisis\n  has_stability < ${N.loan_stability}\n}\nNOT = { has_country_flag = zin_east_loan_recent }\nNOT = { has_global_flag = zin_afrit_dead }`,
      mtth: `days = ${N.loan_mtth}`,
      immediate: `set_country_flag = { flag = zin_east_loan_recent days = ${N.loan_gap_days} }`,
      options: [
        { key: 'a', ai: A.loan_decline },
        { key: 'b', ai: { base: A.loan_accept, mods: [{ add: A.loan_crisis, when: 'has_country_flag = zin_east_in_crisis' }, { factor: 0, when: audits }] }, effect: `add_timed_idea = { idea = zin_east_temple_loan days = ${N.loan_idea_days} }\n${call('zin_afrit_add_footholds', { value: N.loan_footholds_gain })}\nset_country_flag = { flag = zin_east_owes_temples days = ${N.owes_days} }` },
        { key: 'c', trigger: `country_exists = ${STA}\nNOT = { has_war_with = ${STA} }\n${STA} = { has_country_flag = zin_stabilo_ledger_open }`, ai: { base: 0, mods: [{ add: A.loan_borrow, when: 'check_variable = { zin_east_lean < 0.01 }' }] },
          effect: `${call('zin_stabilo_add_debt', { value: N.loan_debt })}\nadd_political_power = ${N.loan_pp}\n${STA} = { country_event = { id = zin_east.32 } }` }] }),
    ev('zin_east.31', { picture: 'GFX_zin_evt_council_chamber', options: [{ key: 'a' }] }),
    ev('zin_east.32', { picture: 'GFX_zin_evt_generic_peace', options: [{ key: 'a' }] }),
    ev('zin_east.35', { picture: 'GFX_zin_evt_generic_wilds', options: [
      { key: 'a', ai: A.sand_mark, effect: 'zin_east_wells_random = yes' },
      { key: 'b', ai: A.sand_sell, effect: `add_political_power = ${N.sand_stories_pp}` }] }),
    ev('zin_east.36', { picture: 'GFX_zin_evt_generic_wilds', mtth: `days = ${N.dry_mtth}`, trigger: 'zin_east_is_south_court = yes',
      options: [
        { key: 'a', ai: A.dry_ration, effect: `add_timed_idea = { idea = zin_east_rationed_water days = ${N.ration_days} }` },
        { key: 'b', ai: A.dry_dig, trigger: hasPP(N.dig_deeper_pp), effect: `add_political_power = -${N.dig_deeper_pp}\nzin_east_wells_random = yes` }] }),
    ev('zin_east.40', { picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: A.rift_old, effect: `add_political_power = ${N.old_tales_pp}` },
      { key: 'b', ai: A.rift_rich, effect: 'set_country_flag = zin_east_rift_ambition' }] }),
    ev('zin_east.70', { picture: 'GFX_zin_evt_generic_court',
      descVariants: [{ key: 'noris', trigger: fromIs(NOR) }, { key: 'stabilo', trigger: fromIs(STA) }, { key: 'free', trigger: freeInviter }],
      options: [
        { key: 'a', ai: { base: 100, mods: inviteMods(-1) }, effect: `set_variable = { global.zin_east_invite_result = 0 }\nif = {\n  limit = { ${fromIs(NOR)} }\n${ind(1, call('zin_east_add_lean', { value: -N.decline_lean }))}\n}\nelse_if = {\n  limit = { ${fromIs(STA)} }\n${ind(1, call('zin_east_add_lean', { value: N.decline_lean }))}\n}\nFROM = { country_event = { id = zin_east.72 } }` },
        { key: 'b', ai: { base: 0, mods: inviteMods(1) },
          effect: `set_variable = { global.zin_east_invite_result = 1 }\nFROM = {\n  if = {\n    limit = {\n      is_in_faction = no\n      has_country_flag = zin_east_free_crowns_leader\n    }\n    create_faction_from_template = zin_faction_free_crowns\n  }\n  add_to_faction = ROOT\n  country_event = { id = zin_east.72 }\n}` }] }),
    ev('zin_east.71', { picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 100, mods: [...bandMods(N.protect_ai_offset, -1, byPower)] },
        effect: `set_variable = { global.zin_east_invite_result = 0 }\nif = {\n  limit = { ${fromIs(NOR)} }\n${ind(1, call('zin_east_add_lean', { value: -N.protect_refuse_lean }))}\n}\nelse = {\n${ind(1, call('zin_east_add_lean', { value: N.protect_refuse_lean }))}\n}\nFROM = { country_event = { id = zin_east.72 } }` },
      { key: 'b', ai: { base: 0, mods: [...bandMods(N.protect_ai_offset, 1, byPower), { factor: A.protect_stronger_factor, when: strongerFoe }] },
        effect: `set_variable = { global.zin_east_invite_result = 1 }\nFROM = {\n  puppet = ROOT\n  country_event = { id = zin_east.72 }\n}` }] }),
    ev('zin_east.72', { picture: 'GFX_zin_evt_concord_council', descVariants: [{ key: 'yes', trigger: 'check_variable = { global.zin_east_invite_result = 1 }' }, { key: 'no', trigger: 'check_variable = { global.zin_east_invite_result = 0 }' }], options: [{ key: 'a' }] }),
    ev('zin_east.73', { picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 100, mods: bandMods(N.homage_offset, -1, byPower) }, effect: `set_variable = { global.zin_east_invite_result = 0 }\nif = {\n  limit = { zin_east_claims_open = yes }\n  every_owned_state = {\n    limit = {\n      OR = {\n${ROADS.map(r => `        zin_is_site_road_${r.key} = yes`).join('\n')}\n      }\n    }\n    add_claim_by = FROM\n  }\n}\nFROM = { country_event = { id = zin_east.72 } }` },
      { key: 'b', ai: { base: 0, mods: bandMods(N.homage_offset, 1, byPower) },
        effect: `set_variable = { global.zin_east_invite_result = 1 }\nFROM = {\n  puppet = ROOT\n  country_event = { id = zin_east.72 }\n}` }] }),
    ev('zin_east.80', { kind: 'news_event', picture: 'GFX_zin_news_generic_court', show_major: 'always = yes', options: [{ key: 'a' }] }),
  ];
  // The hub's report lists every East Lands country of the roster by tag: one line per court, from the data's line template.
  const P = c.report;
  if (!P?.head || !P.line?.includes('{TAG}') || !P.tail) throw new Error('mech_east: the data file\'s report needs a head, a line with {TAG} and a tail');
  if (T.has('zin_east.31.d')) throw new Error('mech_east: zin_east.31.d is built from the report rows; the text map must not hold it');
  T.map.set('zin_east.31.d', `${P.head}${[...east].sort((a, b) => a.tag.localeCompare(b.tag)).map(x => `\n${P.line.replace(/\{TAG\}/g, x.tag)}`).join('')}\n${P.tail}`);
  const eventTexts = [];
  for (const e of eventsList) {
    if (!e.hidden && !pictures.has(e.picture)) throw new Error(`Event ${e.id}: picture ${e.picture} is not in the catalog`);
    eventTexts.push(renderEvent(e, T)); defs.events.push(e.id);
  }
  put('events/zin_east.txt', `${HEADER('mech_east', SPEC)}\nadd_namespace = zin_east\n\n${eventTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ scripted localisation
  const holder = k => ['noris', 'stabilo', 'free'].map((w, i) => `\ttext = {\n\t\ttrigger = { check_variable = { global.zin_east_road_${k} = ${i === 2 ? 0 : i + 1} } }\n\t\tlocalization_key = ${T.use(`zin_east_road_${k}_${w}`)}\n\t}`).join('\n');
  const lastRoad = ROADS.map(r => `\ttext = {\n\t\ttrigger = { check_variable = { global.zin_east_last_road = ${r.code} } }\n\t\tlocalization_key = ${T.use(`zin_east_name_${r.key}`)}\n\t}`).join('\n');
  put('common/scripted_localisation/zin_east.txt', `${HEADER('mech_east', SPEC)}\n${ROADS.map(r => `defined_text = {\n\tname = zin_east_road_${r.key}_line\n${holder(r.key)}\n}`).join('\n')}\ndefined_text = {\n\tname = zin_east_last_road_name\n${lastRoad}\n}`);
  defs.scriptedLocs.push(...ROADS.map(r => `zin_east_road_${r.key}_line`), 'zin_east_last_road_name');

  // ------------------------------------------------------------------------------------------------ on_actions
  // No every-country periodic hook: the caravan month is the self-scheduling hidden event zin_east.2 (spec, "The monthly update").
  put('common/on_actions/zin_east.txt', `${HEADER('mech_east', SPEC)}
on_actions = {
	on_startup = {
		effect = {
			${NOR} = { country_event = { id = zin_east.1 days = ${N.start_delay_days} } }
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

  // ------------------------------------------------------------------------------------------------ AI strategies (spec, AI)
  const strat = (id, enable, lines) => `${id} = {\n\tenable = {\n${ind(2, fmt(enable))}\n\t}\n\tabort_when_not_enabled = yes\n${lines.map(([type, key, tg, v]) => `\tai_strategy = {\n\t\ttype = ${type}\n\t\t${key} = ${key === 'id' ? `"${tg}"` : tg}\n\t\tvalue = ${v}\n\t}`).join('\n')}\n}`;
  const blocks = [
    HEADER('mech_east', SPEC),
    strat('zin_east_free_crowns_prepare', `zin_east_free_crown = yes\nOR = {\n  is_neighbor_of = ${WOR}\n  any_neighbor_country = { has_country_flag = zin_afrit_eastern_client }\n}`, [['prepare_for_war', 'id', WOR, N.ai_free_prepare]]),
    strat('zin_east_coalition_toward_aenor', 'has_country_flag = zin_east_coalition_member\nhas_global_flag = zin_east_turns_west', [['conquer', 'id', AEN, N.ai_conquer_aenor]]),
    ...realms.map(m => strat(`zin_east_coalition_toward_${m.tag.toLowerCase()}`, `has_country_flag = zin_east_coalition_member\n${m.tag} = { has_country_flag = zin_east_rift_target }`, [['conquer', 'id', m.tag, N.ai_conquer]])),
    ...realms.map(m => strat(`zin_east_leader_front_${m.tag.toLowerCase()}`, `has_country_flag = zin_east_coalition_leader\nNOT = { has_global_flag = zin_east_turns_west }\n${m.tag} = { has_country_flag = zin_east_rift_target }`, [['front_unit_request', 'tag', m.tag, N.ai_leader_front]])),
  ];
  put('common/ai_strategy/zin_east.txt', blocks.join('\n\n'));
  defs.aiStrategies.push('zin_east_free_crowns_prepare', 'zin_east_coalition_toward_aenor', ...realms.map(m => `zin_east_coalition_toward_${m.tag.toLowerCase()}`), ...realms.map(m => `zin_east_leader_front_${m.tag.toLowerCase()}`));
  return { eventsList, byCat };
}
