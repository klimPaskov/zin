// Dark Lands mechanic, content half: the monthly pulse and the startup effect, spirits, modifiers, opinion modifiers,
// characters and traits, the six decision categories and 24 decisions, the events of namespace zin_dark, the on_actions and the
// AI strategies. Called by mech_dark.mjs, which owns the scripted triggers and the other effects.
import { fmt, ind, join, call, num, HEADER, renderEvent, renderDecision, renderCategory, renderIdea, renderDynamicModifier, renderOpinion, knownPictures, knownIcons } from '../lib/mech_kit.mjs';
import { assertModifiers } from '../lib/core.mjs';
import { defaultPeople } from './peoples.mjs';

const SPEC = 'docs/specs/04_mechanics/dark_lands.md';
// production_speed_<building>_factor is a family the engine builds from common/buildings (the documentation lists none of them).
const modifierCheck = async (where, mods) => assertModifiers(where, Object.fromEntries(Object.entries(mods).filter(([k]) => !/^production_speed_[a-z_]+_factor$/.test(k))));

export async function buildDarkContent(c) {
  const { N, R, T, tags, put, defs, E_, BLOCS, darkAll, swayOf, statesTotal } = c;
  const { GOL, DON, BLK, LER, AEN, VOL, ZOL, TRF, BEL } = tags;
  const pictures = await knownPictures(), icons = await knownIcons();
  const people = ct => c.assignment?.get(ct.tag) ?? defaultPeople(ct);
  const holdTags = darkAll.filter(x => ![GOL, DON, BLK].includes(x.tag)).map(x => x.tag);

  // ------------------------------------------------------------------------------------------------ startup and pulse
  E_('zin_dark_startup', `set_variable = { global.zin_dark_border_tension = ${N.tension_start} }
set_variable = { global.zin_dark_accord_resolve = ${N.resolve_start} }
set_variable = { global.zin_dark_raid_dark_added = 0 }
set_variable = { global.zin_dark_raid_quiet_until = 0 }
set_variable = { global.zin_dark_challenger = 0 }
set_variable = { global.zin_dark_states_total = ${statesTotal} }
set_variable = { global.zin_dark_rule_roll = 0 }
if = {
  limit = { zin_rules_ai_random_goldoroth = yes }
  random_list = {
    50 = { set_variable = { global.zin_dark_rule_roll = 1 } }
    50 = { set_variable = { global.zin_dark_rule_roll = 2 } }
  }
}
${GOL} = {
  set_variable = { zin_goldoroth_temper = ${N.temper_start} }
${BLOCS.map(b => `  set_variable = { ${b.variable} = ${N.favour_start[b.key]} }`).join('\n')}
  set_variable = { zin_goldoroth_unity = 0 }
  add_ideas = zin_goldoroth_quarrelsome_clans
  recruit_character = zin_goldoroth_bredo
  recruit_character = zin_goldoroth_sungor
  recruit_character = zin_goldoroth_britag
  recruit_character = zin_goldoroth_ulgra
  recruit_character = zin_goldoroth_snikkit
}
${darkAll.filter(x => x.tag !== GOL).map(x => {
    const bonus = ![DON, BLK].includes(x.tag);
    return `${x.tag} = {\n  set_variable = { zin_goldoroth_sway = ${swayOf(x)} }\n${bonus ? `  if = {\n    limit = { is_neighbor_of = ${GOL} }\n    add_to_variable = { zin_goldoroth_sway = ${N.border_sway} }\n  }\n` : ''}  set_variable = { zin_goldoroth_sway_start = zin_goldoroth_sway }\n  set_variable = { zin_dark_tribute_days = 0 }\n  set_variable = { zin_dark_moot_refusals = 0 }\n}`;
  }).join('\n')}
${TRF} = {
  add_ideas = zin_dark_forest_nobody_enters
  capital_scope = { add_dynamic_modifier = { modifier = zin_dark_troll_woods } }
}
zin_goldoroth_refresh_unity = yes
zin_dark_refresh_shield = yes`);

  const challengers = BLOCS.map(b => `if = {
  limit = {
    ${GOL} = {
      check_variable = { ${b.variable} < ${N.challenge_favour + 0.01} }
      NOT = { check_variable = { ${b.variable} > zin_dark_lowest } }
    }
  }
  ${GOL} = { set_temp_variable = { zin_dark_bloc_pick = ${b.code} } }
}`).join('\n');
  E_('zin_dark_pulse', `# temper
set_temp_variable = { zin_dark_temper_delta = 0 }
${GOL} = {
  if = {
    limit = {
      has_war = no
      NOT = { has_country_flag = zin_goldoroth_fed }
    }
    add_to_temp_variable = { zin_dark_temper_delta = ${N.temper_peace} }
  }
  if = {
    limit = { check_variable = { zin_goldoroth_favour_war > ${N.temper_war_favour - 0.01} } }
    add_to_temp_variable = { zin_dark_temper_delta = ${N.temper_war_favour_gain} }
  }
  if = {
    limit = { has_country_flag = zin_goldoroth_ash_rites }
    add_to_temp_variable = { zin_dark_temper_delta = -${N.temper_ash} }
  }
  if = {
    limit = { has_war = yes }
    add_to_temp_variable = { zin_dark_temper_delta = -${N.temper_war} }
  }
  if = {
    limit = { NOT = { has_idea = zin_goldoroth_warrens_heard } }
    add_to_variable = { zin_goldoroth_favour_warrens = -${N.warrens_decay} }
    clamp_variable = { var = zin_goldoroth_favour_warrens min = 0 max = 100 }
  }
  zin_goldoroth_refresh_favours = yes
}
set_temp_variable = { zin_arg_value = zin_dark_temper_delta }
zin_goldoroth_add_temper = yes
# a bloc may challenge the Warking
${GOL} = {
  set_temp_variable = { zin_dark_lowest = 100 }
${BLOCS.map(b => `  if = {\n    limit = { check_variable = { ${b.variable} < zin_dark_lowest } }\n    set_temp_variable = { zin_dark_lowest = ${b.variable} }\n    set_temp_variable = { zin_dark_bloc_pick = ${b.code} }\n  }`).join('\n')}
  if = {
    limit = {
      check_variable = { zin_dark_lowest < ${N.challenge_favour + 0.01} }
      zin_dark_date_war_floor = yes
      has_war = no
      NOT = { has_country_flag = zin_goldoroth_master_of_clans }
      NOT = { has_country_flag = zin_goldoroth_challenged }
    }
    set_country_flag = { flag = zin_goldoroth_challenged days = ${N.challenge_cooldown} }
    set_variable = { global.zin_dark_challenger = zin_dark_bloc_pick }
    country_event = { id = zin_dark.44 }
  }
}
# sway drift, the yoke
every_country = {
  limit = {
    zin_dark_is_dark = yes
    NOT = { original_tag = ${GOL} }
    has_variable = zin_goldoroth_sway
  }
  if = {
    limit = { zin_dark_is_tributary = yes }
    if = {
      limit = { ${GOL} = { has_country_flag = zin_goldoroth_light_yoke } }
      add_to_variable = { zin_goldoroth_sway = ${N.sway_tribute_light} }
    }
    else = { add_to_variable = { zin_goldoroth_sway = ${N.sway_tribute} } }
    add_to_variable = { zin_dark_tribute_days = 30 }
    clamp_variable = { var = zin_goldoroth_sway min = 0 max = 100 }
  }
  else = {
    if = {
      limit = { has_idea = zin_dark_tributary_hold }
      remove_ideas = zin_dark_tributary_hold
      set_temp_variable = { zin_arg_value = -${N.free_sway_loss} }
      zin_goldoroth_apply_sway = yes
    }
    set_temp_variable = { zin_dark_floor = zin_goldoroth_sway_start }
    subtract_from_temp_variable = { zin_dark_floor = ${N.sway_drift_floor} }
    if = {
      limit = {
        is_subject = no
        check_variable = { zin_goldoroth_sway > zin_dark_floor }
        check_variable = { zin_goldoroth_sway > 0.25 }
      }
      add_to_variable = { zin_goldoroth_sway = -${N.sway_drift} }
    }
  }
}
zin_goldoroth_refresh_unity = yes
# tension and the Accord's resolve
if = {
  limit = {
    check_variable = { global.zin_dark_border_tension > ${N.tension_calm_above} }
    check_variable = { global.num_days > global.zin_dark_raid_quiet_until }
  }
${ind(1, call('zin_dark_add_border_tension', { value: -N.tension_calm }))}
}
if = {
  limit = { check_variable = { global.zin_gathering_dark > ${N.tension_dark - 0.01} } }
${ind(1, call('zin_dark_add_border_tension', { value: N.tension_dark_gain }))}
}
set_temp_variable = { zin_dark_resolve_delta = 0 }
if = {
  limit = { check_variable = { global.zin_dark_border_tension > ${N.resolve_tension_high - 0.01} } }
  add_to_temp_variable = { zin_dark_resolve_delta = ${N.resolve_high_gain} }
}
if = {
  limit = { check_variable = { global.zin_dark_border_tension < ${N.resolve_tension_low} } }
  add_to_temp_variable = { zin_dark_resolve_delta = -${N.resolve_low_loss} }
}
if = {
  limit = {
    any_country = {
      zin_dark_is_accord_member = yes
      has_war_with = ${GOL}
    }
  }
  add_to_temp_variable = { zin_dark_resolve_delta = ${N.resolve_war} }
}
set_temp_variable = { zin_dark_members = 0 }
every_country = {
  limit = { zin_dark_is_accord_member = yes }
  add_to_temp_variable = { zin_dark_members = 1 }
}
set_variable = { global.zin_dark_member_count = zin_dark_members }
subtract_from_temp_variable = { zin_dark_members = 2 }
clamp_temp_variable = { var = zin_dark_members min = 0 max = ${N.resolve_members_cap / N.resolve_members} }
multiply_temp_variable = { zin_dark_members = ${N.resolve_members} }
add_to_temp_variable = { zin_dark_resolve_delta = zin_dark_members }
set_temp_variable = { zin_arg_value = zin_dark_resolve_delta }
zin_dark_add_accord_resolve = yes
if = {
  limit = { check_variable = { global.zin_dark_accord_resolve > ${N.resolve_holds - 0.01} } }
  set_global_flag = zin_dark_accord_holds
}
else = { clr_global_flag = zin_dark_accord_holds }
if = {
  limit = {
    check_variable = { global.zin_dark_accord_resolve < ${N.resolve_fray} }
    NOT = { has_global_flag = zin_dark_fray_sent }
  }
  set_global_flag = zin_dark_fray_sent
  every_country = {
    limit = {
      zin_dark_is_accord_member = yes
      NOT = { original_tag = ${DON} }
    }
    country_event = { id = zin_dark.22 }
  }
}
if = {
  limit = { check_variable = { global.zin_dark_accord_resolve > ${N.resolve_fray + 10} } }
  clr_global_flag = zin_dark_fray_sent
}
# mastery of the Sea of Darkness
every_country = {
  limit = { zin_dark_is_dark = yes }
  set_variable = { zin_dark_sea_bases = 0 }
  every_owned_state = {
    limit = { zin_is_site_sea_of_darkness_coast = yes }
    add_to_variable = { PREV.zin_dark_sea_bases = building_level@naval_base }
  }
  set_variable = { zin_dark_sea_bases_x15 = zin_dark_sea_bases }
  multiply_variable = { zin_dark_sea_bases_x15 = 1.5 }
  if = {
    limit = { has_country_flag = zin_dark_sea_master }
    clr_country_flag = zin_dark_sea_master
    remove_ideas = zin_dark_sea_master
  }
}
random_country = {
  limit = {
    zin_dark_is_dark = yes
    check_variable = { zin_dark_sea_bases > ${N.sea_master_min - 0.01} }
    NOT = {
      any_other_country = {
        zin_dark_is_dark = yes
        check_variable = { zin_dark_sea_bases_x15 > PREV.zin_dark_sea_bases }
      }
    }
  }
  set_country_flag = zin_dark_sea_master
  add_ideas = zin_dark_sea_master
}
# the Free Moot, Volgan's envoys
if = {
  limit = { has_global_flag = zin_dark_free_moot }
  set_temp_variable = { zin_dark_moot_count = 0 }
  every_country = {
    limit = { has_country_flag = zin_dark_moot_member }
    add_to_temp_variable = { zin_dark_moot_count = 1 }
  }
  if = {
    limit = { check_variable = { zin_dark_moot_count < 1.99 } }
    every_country = {
      limit = { has_country_flag = zin_dark_moot_member }
      country_event = { id = zin_dark.72 }
    }
    clr_global_flag = zin_dark_free_moot
  }
}
${GOL} = {
  if = {
    limit = {
      OR = {
        check_variable = { zin_volgan_pact > 0.99 }
        ${VOL} = { has_completed_focus = zin_volgan_goldoroth_question }
      }
    }
    set_country_flag = zin_goldoroth_envoy_heard
  }
}
every_country = {
  limit = { zin_dark_is_dark = yes }
  mark_focus_tree_layout_dirty = yes
}`);
  E_('zin_dark_found_free_moot', `if = {
  limit = {
    NOT = { has_global_flag = zin_dark_free_moot }
    zin_dark_moot_eligible = yes
  }
  set_global_flag = zin_dark_free_moot
  set_country_flag = zin_dark_moot_member
  add_ideas = zin_dark_free_moot
  every_country = {
    limit = {
      zin_dark_moot_eligible = yes
      NOT = { has_country_flag = zin_dark_moot_member }
    }
    country_event = { id = zin_dark.70 }
  }
}`);
  E_('zin_dark_join_free_moot', `if = {
  limit = {
    has_global_flag = zin_dark_free_moot
    zin_dark_moot_eligible = yes
    NOT = { has_country_flag = zin_dark_moot_member }
  }
  set_country_flag = zin_dark_moot_member
  add_ideas = zin_dark_free_moot
  every_country = {
    limit = { has_country_flag = zin_dark_moot_member }
    add_opinion_modifier = { target = PREV modifier = zin_dark_moot_kin }
    PREV = { add_opinion_modifier = { target = PREV modifier = zin_dark_moot_kin } }
  }
}`);
  E_('zin_dark_leave_free_moot', `if = {
  limit = { has_country_flag = zin_dark_moot_member }
  clr_country_flag = zin_dark_moot_member
  set_variable = { zin_dark_moot_refusals = 0 }
  if = {
    limit = { has_idea = zin_dark_free_moot }
    remove_ideas = zin_dark_free_moot
  }
}`);
  E_('zin_dark_on_declare_war', `if = {
  limit = {
    FROM = { has_country_flag = zin_dark_moot_member }
    NOT = { has_country_flag = zin_dark_moot_member }
  }
  set_variable = { global.zin_dark_moot_victim = FROM }
  set_variable = { global.zin_dark_moot_attacker = ROOT }
  FROM = {
    every_country = {
      limit = {
        has_country_flag = zin_dark_moot_member
        NOT = { has_war_with = FROM }
      }
      country_event = { id = zin_dark.71 }
    }
  }
}`);
  E_('zin_dark_on_capitulation', `if = {
  limit = { zin_dark_is_accord_member = yes }
${ind(1, call('zin_dark_add_accord_resolve', { value: -N.resolve_capitulation }))}
}
zin_goldoroth_tribute_on_capitulation = yes`);
  E_('zin_dark_on_zol_rising', `# Hook for the Zol system: the northern shore watches for the dead (event zin_dark.80 belongs to the events engineers).
every_country = {
  limit = {
    zin_dark_is_dark = yes
    OR = {
      any_owned_state = { zin_is_site_dark_strait_north_shore = yes }
      any_owned_state = { zin_is_site_ocean_of_zol_coast = yes }
    }
  }
  country_event = { id = zin_dark.80 }
}`);

  // ------------------------------------------------------------------------------------------------ ideas
  const spirit = (id, picture, modifier) => ({ id, picture, modifier });
  const ideaList = [
    spirit('zin_dark_restless_clans', 'zin_war_drums', { stability_factor: -0.05, political_power_gain: -0.1, war_support_factor: 0.05 }),
    spirit('zin_dark_settled_hearths', 'zin_farm_sowing', { stability_factor: 0.05, war_support_factor: -0.1 }),
    spirit('zin_dark_boon_volcano', 'zin_ember_desert', { stability_factor: 0.05 }),
    spirit('zin_dark_boon_iron', 'zin_forge_anvil', { production_speed_arms_factory_factor: 0.1 }),
    spirit('zin_dark_boon_war', 'zin_orc_axe', { army_attack_factor: 0.05, army_morale_factor: 0.05 }),
    spirit('zin_dark_boon_warrens', 'zin_goblin_raiders', { recruitable_population_factor: 0.1 }),
    spirit('zin_dark_sulk_volcano', 'zin_ashen_waste', { stability_factor: -0.05 }),
    spirit('zin_dark_sulk_iron', 'zin_mine_cart', { production_speed_buildings_factor: -0.1 }),
    spirit('zin_dark_sulk_war', 'zin_war_drums', { army_org_factor: -0.05 }),
    spirit('zin_dark_sulk_warrens', 'zin_goblin_raiders', { recruitable_population_factor: -0.05 }),
    spirit('zin_dark_tributary_hold', 'zin_chain_broken', { political_power_gain: -0.1, army_defence_factor: 0.05 }),
    spirit('zin_dark_free_moot', 'zin_banner_league', { army_core_defence_factor: 0.05, war_support_factor: 0.03 }),
    spirit('zin_dark_forest_nobody_enters', 'zin_mushroom_grove', { army_core_defence_factor: 0.15, attrition: -0.1 }),
    spirit('zin_dark_troll_hirelings', 'zin_troll_club', { army_armor_attack_factor: 0.05, breakthrough_factor: 0.05 }),
    spirit('zin_dark_brutes_mustered', 'zin_levy_muster', { army_org_factor: 0.05, army_defence_factor: 0.05 }),
    spirit('zin_dark_sea_master', 'zin_great_warship', { trade_opinion_factor: 0.1, naval_detection: 0.1 }),
    spirit('zin_dark_strait_closed', 'zin_strait_chain', { naval_speed_factor: -0.1, naval_invasion_prep_speed: -0.25 }),
    spirit('zin_dark_watch_the_shore', 'zin_lighthouse', { army_core_defence_factor: 0.05, coastal_bunker_effectiveness_factor: 0.1 }),
  ];
  const ideaTexts = [];
  for (const i of ideaList) { if (!icons.has(`GFX_idea_${i.picture}`)) throw new Error(`Idea ${i.id}: picture ${i.picture} is not in the icon catalog`); ideaTexts.push(await renderIdea(i, T, modifierCheck)); defs.ideas.push(i.id); }
  put('common/ideas/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\nideas = {\n\tcountry = {\n${ind(2, ideaTexts.join('\n\n'))}\n\t}\n}`);

  // ------------------------------------------------------------------------------------------------ dynamic modifiers
  const dyn = [
    { id: 'zin_dark_accord_shield', modifier: { army_defence_factor: 'zin_dark_shield_def', army_core_defence_factor: 'zin_dark_shield_core', war_support_factor: 'zin_dark_shield_ws' } },
    { id: 'zin_dark_troll_woods', modifier: { local_supplies: -2 } },
  ];
  const dynTexts = [];
  for (const m of dyn) { dynTexts.push(await renderDynamicModifier(m, T)); defs.dynamicModifiers.push(m.id); }
  // The cause: its name and description are written by the diplomacy module (zin_leagues_l_english.yml), so no text is used here.
  dynTexts.push(`zin_cb_hold_defiance = {\n\tenable = { always = yes }\n\tgenerate_wargoal_tension_against = ${N.cb_tension_value}\n}`);
  defs.dynamicModifiers.push('zin_cb_hold_defiance');
  put('common/dynamic_modifiers/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\n\n${dynTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ opinion modifiers
  const opinions = [['zin_dark_raided', -15, 1], ['zin_dark_gifts', 10, 0.5], ['zin_dark_blood_price_paid', 10, 1], ['zin_dark_yoke_refused', -20], ['zin_dark_moot_kin', 15], ['zin_dark_refused_nafeher', -25], ['zin_dark_bargain_struck', 20], ['zin_dark_envoys_hunted', -10, 1], ['zin_dark_shore_tolls', -10, 1], ['zin_dark_against_the_dead', 25], ['zin_dark_beacons_lit', 5, 1], ['zin_dark_corsair_outrage', -10, 1]].map(([id, value, decay]) => ({ id, value, decay }));
  put('common/opinion_modifiers/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\nopinion_modifiers = {\n${ind(1, opinions.map(o => renderOpinion(o, T)).join('\n\n'))}\n}`);
  defs.opinions.push(...opinions.map(o => o.id));

  // ------------------------------------------------------------------------------------------------ characters and traits
  const portrait = (sex, n) => `GFX_zin_portrait_orcs_${sex}_${n}`;
  const skills = (s, extra = '') => `skill = ${s}\n\t\t\tattack_skill = ${s}\n\t\t\tdefense_skill = ${s}\n\t\t\tplanning_skill = ${s}\n\t\t\tlogistics_skill = ${s}${extra}`;
  const chars = [
    { id: 'zin_goldoroth_bredo', portrait: portrait('male', 1), role: `advisor = {\n\t\tslot = theorist\n\t\tidea_token = zin_goldoroth_bredo\n\t\tallowed = { original_tag = ${GOL} }\n\t\ttraits = { zin_adv_sage }\n\t\tcost = 100\n\t}` },
    { id: 'zin_goldoroth_sungor', portrait: portrait('male', 2), role: `advisor = {\n\t\tslot = political_advisor\n\t\tidea_token = zin_goldoroth_sungor\n\t\tallowed = { original_tag = ${GOL} }\n\t\ttraits = { zin_adv_war_speaker }\n\t\tcost = 100\n\t}` },
    { id: 'zin_goldoroth_britag', portrait: portrait('male', 1), role: `field_marshal = {\n\t\ttraits = { offensive_doctrine }\n\t\tskill = 4\n\t\tattack_skill = 4\n\t\tdefense_skill = 3\n\t\tplanning_skill = 3\n\t\tlogistics_skill = 3\n\t}` },
    { id: 'zin_goldoroth_ulgra', portrait: portrait('female', 1), role: `advisor = {\n\t\tslot = political_advisor\n\t\tidea_token = zin_goldoroth_ulgra\n\t\tallowed = { original_tag = ${GOL} }\n\t\ttraits = { zin_trait_forge_mistress }\n\t\tcost = 100\n\t}` },
    { id: 'zin_goldoroth_snikkit', portrait: portrait('male', 2), role: `corps_commander = {\n\t\ttraits = { trickster }\n\t\tskill = 2\n\t\tattack_skill = 2\n\t\tdefense_skill = 2\n\t\tplanning_skill = 3\n\t\tlogistics_skill = 2\n\t}` },
    { id: 'zin_goldoroth_rask', portrait: portrait('male', 1), role: `navy_leader = {\n\t\ttraits = { }\n\t\tskill = 2\n\t\tattack_skill = 2\n\t\tdefense_skill = 2\n\t\tmaneuvering_skill = 2\n\t\tcoordination_skill = 2\n\t}` },
  ];
  for (const ch of chars) { T.use(ch.id); defs.characters.push(ch.id); }
  put('common/characters/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\ncharacters = {\n${chars.map(ch => `\t${ch.id} = {\n\t\tname = ${ch.id}\n\t\tportraits = {\n\t\t\tcivilian = {\n\t\t\t\tlarge = ${ch.portrait}\n\t\t\t}\n\t\t}\n\t\t${ch.role}\n\t}`).join('\n')}\n}`);
  await modifierCheck('trait zin_trait_black_iron_warlord', { army_attack_factor: 0.05, army_morale_factor: 0.05 });
  put('common/unit_leader/zin_dark_traits.txt', `${HEADER('mech_dark', SPEC)}\nleader_traits = {\n\tzin_trait_black_iron_warlord = {\n\t\ttype = field_marshal\n\t\ttrait_type = personality_trait\n\t\tgain_xp = { always = no }\n\t\tfield_marshal_modifier = {\n\t\t\tarmy_attack_factor = 0.05\n\t\t\tarmy_morale_factor = 0.05\n\t\t}\n\t\tai_will_do = { factor = 0 }\n\t}\n}`);
  put('common/country_leader/zin_dark_traits.txt', `${HEADER('mech_dark', SPEC)}\nleader_traits = {\n\tzin_trait_forge_mistress = {\n\t\trandom = no\n\t\tproduction_speed_arms_factory_factor = 0.05\n\t}\n}`);
  T.use('zin_trait_black_iron_warlord'); T.use('zin_trait_forge_mistress'); T.use('zin_trait_black_iron_warlord_desc'); T.use('zin_trait_forge_mistress_desc');
  defs.traits.push('zin_trait_black_iron_warlord', 'zin_trait_forge_mistress');

  // ------------------------------------------------------------------------------------------------ decisions
  const onlyGol = `original_tag = ${GOL}`;
  const cats = [
    { id: 'zin_dark_raids', icon: 'GFX_idea_zin_corsair_raider', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_raids_open' },
    { id: 'zin_dark_horde', icon: 'GFX_idea_zin_war_drums', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_moot_open' },
    { id: 'zin_dark_sway', icon: 'GFX_idea_zin_tribute_chest', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_sway_open' },
    { id: 'zin_dark_accord', icon: 'GFX_idea_zin_banner_league', allowed: `original_tag = ${DON}`, visible: 'is_faction_leader = yes' },
    { id: 'zin_dark_free_holds', icon: 'GFX_idea_zin_concord_circle', allowed: 'always = yes', visible: 'zin_dark_is_dark = yes' },
    { id: 'zin_dark_straits', icon: 'GFX_idea_zin_strait_chain', allowed: onlyGol },
  ];
  for (const x of cats) { if (!icons.has(x.icon)) throw new Error(`Category ${x.id}: icon ${x.icon} is not in the catalog`); defs.categories.push(x.id); }
  put('common/decisions/categories/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\n\n${cats.map(x => renderCategory(x, T)).join('\n\n')}`);

  const tv = key => `FROM = { check_variable = { ${key} } }`;
  const notWar = 'FROM = {\n  NOT = { has_war_with = ROOT }\n}';
  const holdTarget = `FROM = {\n  zin_dark_is_free_hold = yes\n  NOT = { has_war_with = ROOT }\n}`;
  const twoVariants = (base, flag, costBase, costFlag) => [
    { ...base, id: base.id, visible: join(base.visibleExtra, `NOT = { has_country_flag = ${flag} }`), cost: costBase },
    { ...base, id: `${base.id}_${base.suffix ?? 'cheap'}`, visible: join(base.visibleExtra, `has_country_flag = ${flag}`), cost: costFlag, alias: base.id },
  ];
  const mission = (kind, extra) => `set_temp_variable = { zin_arg_kind = ${kind} }\n${extra}\nzin_dark_resolve_raid = yes`;
  const raidDecision = d => ({ ...d, cat: 'zin_dark_raids', allowed: onlyGol, days_remove: N.raid_days, icon: d.icon });
  const decisionsList = [
    ...twoVariants({ id: 'zin_dark_raid_marches', cat: 'zin_dark_raids', icon: 'GFX_idea_zin_orc_axe', suffix: 'swift', allowed: onlyGol,
      available: `NOT = { has_war_with = ${DON} }\nNOT = { has_global_flag = zin_dark_clash_active }\ncountry_exists = ${DON}`, days_re_enable: N.raid_marches_cooldown, days_remove: N.raid_days,
      remove_effect: mission(1, `set_temp_variable = { zin_arg_target = ${DON} }`),
      ai: { base: 0, mods: [{ add: 12, when: `check_variable = { zin_goldoroth_temper > ${N.ai_raid_temper - 0.01} }\ncheck_variable = { global.zin_dark_border_tension < 69.99 }` }, { factor: 0, when: 'NOT = { has_political_power > 25 }' }] } }, 'zin_goldoroth_swift_raids', N.raid_marches_cost, N.raid_marches_cost).map(d => d.alias ? { ...d, days_re_enable: N.raid_marches_cooldown_swift } : d),
    { id: 'zin_dark_raid_hold', cat: 'zin_dark_raids', icon: 'GFX_idea_zin_goblin_raiders', allowed: onlyGol,
      target_trigger: `FROM = {\n  zin_dark_is_free_hold = yes\n  is_neighbor_of = ROOT\n  NOT = { has_war_with = ROOT }\n}`, cost: N.raid_hold_cost, days_re_enable: N.raid_hold_cooldown, days_remove: N.raid_days,
      remove_effect: mission(2, 'set_temp_variable = { zin_arg_target = FROM }'),
      ai: { base: 0, mods: [{ add: 10, when: `check_variable = { zin_goldoroth_temper > ${N.ai_raid_temper - 0.01} }\nFROM = { check_variable = { zin_goldoroth_sway < 49.99 } }` }, { factor: 0, when: 'NOT = { has_political_power > 20 }' }] } },
    { id: 'zin_dark_corsair_raid', cat: 'zin_dark_raids', icon: 'GFX_idea_zin_corsair_raider', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_corsairs',
      target_trigger: `FROM = {\n  OR = {\n    zin_dark_is_accord_member = yes\n    original_tag = ${BLK}\n    zin_dark_is_free_hold = yes\n  }\n  any_owned_state = { zin_is_site_sea_of_darkness_coast = yes }\n  NOT = { has_war_with = ROOT }\n}`, cost: N.corsair_cost, days_re_enable: N.corsair_cooldown, days_remove: N.raid_days,
      remove_effect: mission(3, 'set_temp_variable = { zin_arg_target = FROM }'),
      ai: { base: 0, mods: [{ add: 8, when: `check_variable = { zin_goldoroth_temper > ${N.ai_raid_temper - 0.01} }` }, { factor: 0.25, when: `FROM = { original_tag = ${BLK} has_country_flag = zin_regional_blackton_paid_corsairs }` }] } },
    { id: 'zin_dark_clash_on_the_march', cat: 'zin_dark_raids', icon: 'GFX_idea_zin_fort_wall', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_clash_open',
      available: `check_variable = { global.zin_dark_border_tension > ${N.clash_tension - 0.01} }\nzin_dark_date_war_floor = yes\nNOT = { has_war_with = ${DON} }\nNOT = { has_global_flag = zin_dark_clash_active }\ncheck_variable = { command_power > ${N.clash_command - 0.01} }`, cost: N.clash_cost, days_re_enable: N.clash_cooldown,
      complete_effect: `add_command_power = -${N.clash_command}\nzin_dark_start_border_clash = yes`,
      ai: { base: 0, mods: [{ add: 10, when: `check_variable = { global.zin_dark_border_tension > 69.99 }` }, { factor: 0, when: `has_game_rule = { rule = zin_rule_historical_path option = HISTORICAL }\nNOT = { zin_dark_date_clash_historical = yes }` }] } },
    { id: 'zin_dark_great_moot', cat: 'zin_dark_horde', icon: 'GFX_idea_zin_council_table', allowed: onlyGol, visible: 'NOT = { has_country_flag = zin_goldoroth_centralised }', cost: N.moot_cost, days_re_enable: N.moot_cooldown, complete_effect: 'country_event = { id = zin_dark.40 }',
      ai: { base: 0, mods: [{ add: 10, when: BLOCS.map(b => `check_variable = { ${b.variable} < 25.01 }`).join('\n').replace(/^/, 'OR = {\n').replace(/\n/g, '\n  ').concat('\n}') }] } },
    { id: 'zin_dark_great_moot_central', cat: 'zin_dark_horde', icon: 'GFX_idea_zin_council_table', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_centralised', cost: N.moot_cost, days_re_enable: N.moot_cooldown_central, complete_effect: 'country_event = { id = zin_dark.40 }', alias: 'zin_dark_great_moot',
      ai: { base: 0, mods: [{ add: 10, when: 'OR = {\n' + BLOCS.map(b => `  check_variable = { ${b.variable} < 25.01 }`).join('\n') + '\n}' }] } },
    { id: 'zin_dark_feast_the_clans', cat: 'zin_dark_horde', icon: 'GFX_idea_zin_feast_table', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_moot_open',
      available: `has_equipment = { zin_arms_equipment > ${N.feast_arms - 1} }`, cost: N.feast_cost, days_re_enable: N.feast_cooldown,
      complete_effect: `add_equipment_to_stockpile = { type = zin_arms_equipment amount = -${N.feast_arms} }\n${BLOCS.map(b => call('zin_goldoroth_add_favour', { bloc: b.code, value: N.feast_favour })).join('\n')}\n${call('zin_goldoroth_add_temper', { value: -N.feast_temper })}`,
      ai: { base: 0, mods: [{ add: 12, when: 'OR = {\n' + BLOCS.map(b => `  check_variable = { ${b.variable} < 30.01 }`).join('\n') + '\n}' }, { factor: 0, when: 'NOT = { has_political_power > 55 }' }] } },
    ...twoVariants({ id: 'zin_dark_blood_contest', cat: 'zin_dark_horde', icon: 'GFX_idea_zin_spear_levy', allowed: onlyGol, visibleExtra: 'has_country_flag = zin_goldoroth_moot_open', days_re_enable: N.contest_cooldown,
      complete_effect: `army_experience = ${N.contest_xp}\n${call('zin_goldoroth_add_favour', { bloc: 3, value: N.contest_favour })}\n${call('zin_goldoroth_add_temper', { value: -N.contest_temper })}`,
      ai: { base: 0, mods: [{ add: 12, when: `check_variable = { zin_goldoroth_temper > ${N.ai_contest_temper - 0.01} }\nhas_political_power > 50` }] } }, 'zin_goldoroth_contests', N.contest_cost, N.contest_cost_cheap).map(d => d.alias ? { ...d, complete_effect: `army_experience = ${N.contest_xp}\n${call('zin_goldoroth_add_favour', { bloc: 3, value: N.contest_favour })}\n${call('zin_goldoroth_add_temper', { value: -N.contest_temper_cheap })}` } : d),
    ...twoVariants({ id: 'zin_dark_send_gifts', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_tribute_chest', allowed: onlyGol, visibleExtra: 'has_country_flag = zin_goldoroth_sway_open', target_trigger: holdTarget,
      available: `has_equipment = { zin_arms_equipment > ${N.gifts_arms - 1} }`, days_re_enable: N.gifts_cooldown,
      complete_effect: `add_equipment_to_stockpile = { type = zin_arms_equipment amount = -${N.gifts_arms} }\nhidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  set_temp_variable = { zin_arg_value = ${N.gifts_sway} }\n  zin_goldoroth_add_sway = yes\n  FROM = { add_opinion_modifier = { target = ROOT modifier = zin_dark_gifts } }\n}\ncustom_effect_tooltip = zin_dark_tt_sway_up`,
      ai: { base: 3, mods: [{ add: 8, when: `FROM = { check_variable = { zin_goldoroth_sway > 29.99 } check_variable = { zin_goldoroth_sway < ${N.yoke_sway} } }` }, { factor: 0, when: 'NOT = { has_political_power > 40 }' }] } }, 'zin_goldoroth_tallymen', N.gifts_cost, N.gifts_cost_cheap),
    { id: 'zin_dark_bind_by_marriage', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_handshake_oath', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_sway_open', fire_only_once: true,
      target_trigger: `FROM = {\n  zin_dark_is_free_hold = yes\n  OR = {\n    has_country_flag = zin_people_orcs\n    has_country_flag = zin_people_trolls\n    has_country_flag = zin_people_minor_goblins\n  }\n  NOT = { has_war_with = ROOT }\n}`, cost: N.marriage_cost,
      complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  set_temp_variable = { zin_arg_value = ${N.marriage_sway} }\n  zin_goldoroth_add_sway = yes\n}\ncustom_effect_tooltip = zin_dark_tt_sway_up`,
      ai: { base: 2, mods: [{ add: 6, when: tv('zin_goldoroth_sway > 34.99') }, { factor: 0, when: 'NOT = { has_political_power > 80 }' }] } },
    { id: 'zin_dark_show_the_host', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_levy_muster', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_sway_open', target_trigger: holdTarget,
      available: 'zin_dark_outnumbers_threefold = yes', cost: N.host_cost, days_re_enable: N.host_cooldown,
      complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  set_temp_variable = { zin_arg_value = ${N.host_sway} }\n  zin_goldoroth_add_sway = yes\n  FROM = { add_opinion_modifier = { target = ROOT modifier = zin_dark_raided } }\n  if = {\n    limit = { FROM = { is_neighbor_of = ${DON} } }\n${ind(2, call('zin_dark_add_border_tension', { value: N.host_tension }))}\n  }\n}\n${call('zin_goldoroth_add_temper', { value: -N.host_temper })}\ncustom_effect_tooltip = zin_dark_tt_sway_up`,
      ai: { base: 0, mods: [{ add: 8, when: `check_variable = { zin_goldoroth_temper > ${N.ai_host_temper - 0.01} }` }] } },
    ...twoVariants({ id: 'zin_dark_offer_iron_yoke', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_chain_broken', allowed: onlyGol, visibleExtra: 'has_country_flag = zin_goldoroth_sway_open', suffix: 'cheap',
      target_trigger: `FROM = {\n  zin_dark_is_free_hold = yes\n  is_in_faction = no\n  NOT = { has_war_with = ROOT }\n}`, days_re_enable: N.yoke_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_dark.50 } }',
      ai: { base: 10, mods: [{ factor: 0, when: 'NOT = { has_political_power > 50 }' }] } }, 'zin_goldoroth_yoke_cheap', N.yoke_cost, N.yoke_cost).map(d => ({ ...d, available: join('zin_dark_date_yoke = yes', `FROM = { check_variable = { zin_goldoroth_sway > ${d.alias ? N.yoke_sway_cheap - 0.01 : N.yoke_sway - 0.01} } }`) })),
    ...twoVariants({ id: 'zin_dark_one_fire', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_crown_iron', allowed: onlyGol, visibleExtra: 'has_country_flag = zin_goldoroth_sway_open', suffix: 'hard',
      target_trigger: 'FROM = {\n  zin_dark_is_tributary = yes\n}', cost: N.one_fire_cost,
      complete_effect: `annex_country = { target = FROM }\nnews_event = { id = zin_dark.52 }` }, 'zin_goldoroth_hard_yoke', N.one_fire_cost, N.one_fire_cost).map(d => ({ ...d,
      available: `FROM = {\n  check_variable = { zin_dark_tribute_days > ${(d.alias ? N.one_fire_days_hard : N.one_fire_days) - 0.01} }\n  check_variable = { zin_goldoroth_sway > ${(d.alias ? N.one_fire_sway_hard : N.one_fire_sway) - 0.01} }\n}`,
      ai: { base: 0, mods: [{ add: 15, when: 'always = yes' }] } })),
    { id: 'zin_dark_hunt_envoys', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_eye_watchful', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_hunt_open',
      target_trigger: `FROM = {\n  zin_dark_is_dark = yes\n  NOT = { original_tag = ${GOL} }\n  check_variable = { zin_volgan_pact > 0.99 }\n  OR = {\n    check_variable = { zin_goldoroth_sway > 29.99 }\n    zin_dark_is_tributary = yes\n  }\n}`, cost: N.hunt_cost, days_re_enable: N.hunt_cooldown,
      complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  set_temp_variable = { zin_arg_value = -1 }\n  zin_dark_add_volgan_pact = yes\n${ind(1, call('zin_volgan_add_veil', { value: -1 }))}\n  ${VOL} = { country_event = { id = zin_dark.85 } }\n  ${VOL} = { add_opinion_modifier = { target = ROOT modifier = zin_dark_envoys_hunted } }\n  FROM = {\n    if = {\n      limit = { zin_dark_is_tributary = no }\n      add_opinion_modifier = { target = ROOT modifier = zin_dark_envoys_hunted }\n    }\n  }\n}\ncustom_effect_tooltip = zin_dark_tt_hunt`,
      ai: { base: 0, mods: [{ add: 15, when: 'zin_dark_rule_independent = yes' }] } },
    ...twoVariants({ id: 'zin_dark_light_beacons', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_beacon', allowed: `original_tag = ${DON}`, visibleExtra: 'is_faction_leader = yes', suffix: 'chain',
      complete_effect: `${call('zin_dark_add_accord_resolve', { value: N.beacons_resolve })}`,
      ai: { base: 0, mods: [{ add: 12, when: `check_variable = { global.zin_dark_accord_resolve < 49.99 }` }, { factor: 0, when: 'NOT = { has_political_power > 40 }' }] } }, 'zin_regional_dondor_beacon_chain', N.beacons_cost, N.beacons_cost).map(d => ({ ...d, days_re_enable: d.alias ? N.beacons_cooldown_chain : N.beacons_cooldown })),
    { id: 'zin_dark_pay_blood_price', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_coin_chest', allowed: `original_tag = ${DON}`, visible: 'is_faction_leader = yes', available: `check_variable = { global.zin_dark_border_tension > ${N.blood_tension - 0.01} }\nhas_political_power > ${N.blood_price - 1}\ncountry_exists = ${GOL}`, cost: N.blood_cost, days_re_enable: N.blood_cooldown,
      complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_answer = 2 }\n  zin_dark_answer_raid = yes\n}\ncustom_effect_tooltip = zin_dark_tt_blood`,
      ai: { base: 0, mods: [{ add: 12, when: `check_variable = { global.zin_dark_border_tension > 69.99 }\nhas_political_power > 99` }] } },
    { id: 'zin_dark_invite_to_accord', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_envoy', allowed: `original_tag = ${DON}`, visible: 'is_faction_leader = yes',
      target_trigger: `FROM = {\n  zin_dark_is_dark = yes\n  NOT = { original_tag = ${DON} }\n  NOT = { original_tag = ${GOL} }\n  is_in_faction = no\n  is_subject = no\n  check_variable = { zin_goldoroth_sway < 39.99 }\n  check_variable = { zin_volgan_pact < 1.01 }\n}`, cost: N.invite_cost, days_re_enable: N.invite_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_dark.20 } }',
      ai: { base: 0, mods: [{ add: 10, when: 'FROM = { check_variable = { zin_goldoroth_sway < 29.99 } }' }, { factor: 0, when: 'NOT = { has_political_power > 40 }' }] } },
    ...twoVariants({ id: 'zin_dark_muster_brutes', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_levy_muster', allowed: `original_tag = ${DON}`, visibleExtra: 'is_faction_leader = yes', suffix: 'drill',
      available: `OR = {\n  check_variable = { global.zin_dark_border_tension > ${N.muster_tension - 0.01} }\n  has_war_with = ${GOL}\n}`,
      complete_effect: `add_timed_idea = { idea = zin_dark_brutes_mustered days = ${N.muster_days} }`,
      ai: { base: 0, mods: [{ add: 12, when: `check_variable = { global.zin_dark_border_tension > ${N.muster_tension - 0.01} }` }] } }, 'zin_regional_dondor_muster_drill', N.muster_cost, N.muster_cost).map(d => ({ ...d, days_re_enable: d.alias ? N.muster_cooldown_drill : N.muster_cooldown })),
    { id: 'zin_dark_petition_parim', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_scroll_treaty', allowed: `original_tag = ${DON}`, visible: 'is_faction_leader = yes', fire_only_once: true, cost: N.petition_cost,
      complete_effect: `random_country = {\n  limit = { any_owned_state = { zin_is_site_parim = yes } }\n  country_event = { id = zin_dark.30 }\n}`,
      ai: { base: 20 } },
    { id: 'zin_dark_call_on_the_north', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_ship_voyage', allowed: `original_tag = ${DON}`, visible: 'is_faction_leader = yes', available: `country_exists = ${LER}\nNOT = { has_war_with = ${LER} }`, cost: N.north_cost, days_re_enable: N.north_cooldown,
      complete_effect: `${LER} = { country_event = { id = zin_dark.31 } }`,
      ai: { base: 0, mods: [{ add: 10, when: `check_variable = { global.zin_dark_border_tension > ${N.north_tension - 0.01} }` }] } },
    { id: 'zin_dark_call_free_moot', cat: 'zin_dark_free_holds', icon: 'GFX_idea_zin_concord_circle', allowed: 'always = yes', visible: 'zin_dark_is_free_hold = yes',
      available: `zin_dark_moot_eligible = yes\nNOT = { has_global_flag = zin_dark_free_moot }\ncountry_exists = ${GOL}\nOR = {\n  ${GOL} = { check_variable = { zin_goldoroth_unity > ${N.moot_unity - 0.01} } }\n  ${GOL} = { has_dynamic_modifier = { modifier = zin_cb_hold_defiance scope = ROOT } }\n  has_war_with = ${GOL}\n}`, cost: N.call_moot_cost,
      complete_effect: 'zin_dark_found_free_moot = yes',
      ai: { base: 5, mods: [{ factor: 3, when: `original_tag = ${darkAll.find(x => x.name === R.dulundur).tag}` }, { factor: 0, when: 'NOT = { has_political_power > 80 }' }] } },
    { id: 'zin_dark_leave_free_moot', cat: 'zin_dark_free_holds', icon: 'GFX_idea_zin_chain_broken', allowed: 'always = yes', visible: 'has_country_flag = zin_dark_moot_member', complete_effect: 'zin_dark_leave_free_moot = yes' },
    { id: 'zin_dark_hire_troll_kin', cat: 'zin_dark_free_holds', icon: 'GFX_idea_zin_troll_club', allowed: 'always = yes', visible: `zin_dark_is_dark = yes\nNOT = { original_tag = ${TRF} }\ncountry_exists = ${TRF}`,
      available: `OR = {\n  has_country_flag = zin_dark_trolls_for_pay\n  ${TRF} = { has_opinion = { target = ROOT value > ${N.troll_opinion - 1} } }\n}\nhas_equipment = { zin_arms_equipment > ${N.troll_arms - 1} }`, cost: N.troll_cost, days_re_enable: N.troll_cooldown,
      complete_effect: `add_equipment_to_stockpile = { type = zin_arms_equipment amount = -${N.troll_arms} }\nadd_timed_idea = { idea = zin_dark_troll_hirelings days = ${N.troll_days} }\n${TRF} = { country_event = { id = zin_dark.75 } }`,
      ai: { base: 0, mods: [{ add: 6, when: 'has_war = yes\nhas_political_power > 120' }] } },
    { id: 'zin_dark_levy_shore_tolls', cat: 'zin_dark_straits', icon: 'GFX_idea_zin_toll_house', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_tolls_open',
      available: `OR = {\n  AND = {\n    set_temp_variable = { zin_arg_strait = 1 }\n    zin_dark_holds_strait_shore = yes\n    NOT = { ${LER} = { has_war_with = ROOT } }\n  }\n  AND = {\n    set_temp_variable = { zin_arg_strait = 2 }\n    zin_dark_holds_strait_shore = yes\n    NOT = { ${AEN} = { has_war_with = ROOT } }\n  }\n}\nis_subject = no`, days_re_enable: N.tolls_cooldown,
      complete_effect: `add_political_power = ${N.tolls_pp}\nif = {\n  limit = { set_temp_variable = { zin_arg_strait = 1 } zin_dark_holds_strait_shore = yes }\n  ${LER} = { add_opinion_modifier = { target = ROOT modifier = zin_dark_shore_tolls } }\n}\nelse = {\n  ${AEN} = { add_opinion_modifier = { target = ROOT modifier = zin_dark_shore_tolls } }\n}`,
      ai: { base: 4 } },
    { id: 'zin_dark_close_strait', cat: 'zin_dark_straits', icon: 'GFX_idea_zin_strait_chain', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_strait_wardens',
      target_trigger: 'FROM = {\n  has_war_with = ROOT\n}',
      available: `has_war = yes\nOR = {\n  AND = {\n    set_temp_variable = { zin_arg_strait = 1 }\n    zin_dark_holds_strait_shore = yes\n  }\n  AND = {\n    set_temp_variable = { zin_arg_strait = 2 }\n    zin_dark_holds_strait_shore = yes\n  }\n}`, cost: N.close_cost, days_re_enable: N.close_cooldown,
      complete_effect: `FROM = { add_timed_idea = { idea = zin_dark_strait_closed days = ${N.close_days} } }`,
      ai: { base: 5 } },
  ];
  const byCat = new Map();
  const gold = (d) => d;
  for (const d of decisionsList) {
    if (!icons.has(d.icon)) throw new Error(`Decision ${d.id}: icon ${d.icon} is not in the catalog`);
    if (d.alias) { T.alias(d.id, d.alias); T.alias(`${d.id}_desc`, `${d.alias}_desc`); }
    defs.decisions.push(d.id);
    if (!byCat.has(d.cat)) byCat.set(d.cat, []);
    const extraText = [];
    if (d.complete_effect?.includes('zin_dark_tt_sway_up')) extraText.push('zin_dark_tt_sway_up');
    if (d.complete_effect?.includes('zin_dark_tt_hunt')) extraText.push('zin_dark_tt_hunt');
    if (d.complete_effect?.includes('zin_dark_tt_blood')) extraText.push('zin_dark_tt_blood');
    byCat.get(d.cat).push(renderDecision({ ...d, extraText }, T));
  }
  put('common/decisions/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\n\n${[...byCat].map(([cat, list]) => `${cat} = {\n${ind(1, list.join('\n\n'))}\n}`).join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ events
  const ans = (key, n, ai) => ({ key, ai, effect: `set_temp_variable = { zin_arg_answer = ${n} }\nzin_dark_answer_raid = yes` });
  const victimOptions = isDondor => [
    ans('a', 1, 50),
    ans('b', 2, { base: 30, mods: [{ factor: 2, when: 'check_variable = { global.zin_dark_border_tension > 49.99 }' }, { factor: 0, when: 'NOT = { has_political_power > 40 }' }] }),
    ans('c', 3, { base: 20, mods: isDondor ? [{ factor: 2, when: 'check_variable = { global.zin_dark_border_tension > 69.99 }' }] : [] }),
  ];
  const tensionAt = n => `check_variable = { global.zin_dark_border_tension > ${n - 0.01} }`;
  const unitySteps = from => [0, 1, 2, 3, 4].map(i => ({ add: 5, when: `${GOL} = { check_variable = { zin_goldoroth_unity > ${from + i * 10} } }` }));
  const swaySteps = (add, from) => [0, 1, 2, 3, 4, 5, 6].map(i => ({ add, when: `check_variable = { zin_goldoroth_sway > ${from + i * 10} }` }));
  const blocOptions = (fn) => BLOCS.map(b => ({ key: b.key, ...fn(b) }));
  const setFavour = (b, v) => `set_temp_variable = { zin_arg_bloc = ${b.code} }\nset_temp_variable = { zin_arg_value = ${v} }\nzin_goldoroth_add_favour = yes`;
  const favourSetTo = (b, v) => `${GOL} = { set_variable = { ${b.variable} = ${v} } zin_goldoroth_refresh_favours = yes }`;
  const eventsList = [
    { id: 'zin_dark.1', hidden: true, fire_only_once: true, immediate: 'zin_dark_startup = yes' },
    { id: 'zin_dark.2', hidden: true, immediate: call('zin_dark_end_clash', { result: 1 }) },
    { id: 'zin_dark.3', hidden: true, immediate: call('zin_dark_end_clash', { result: 2 }) },
    { id: 'zin_dark.4', hidden: true, immediate: call('zin_dark_end_clash', { result: 3 }) },
    { id: 'zin_dark.10', picture: 'GFX_zin_evt_generic_war', options: [{ key: 'a', effect: call('zin_goldoroth_add_favour', { bloc: 3, value: 2 }) }] },
    { id: 'zin_dark.11', picture: 'GFX_zin_evt_generic_war', options: victimOptions(true) },
    { id: 'zin_dark.12', picture: 'GFX_zin_evt_generic_war', options: victimOptions(false) },
    { id: 'zin_dark.13', picture: 'GFX_zin_evt_generic_sea', options: victimOptions(false) },
    { id: 'zin_dark.15', kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: `OR = {\n  zin_dark_is_dark = yes\n  original_tag = ${LER}\n  original_tag = ${AEN}\n}`, options: [{ key: 'a' }] },
    { id: 'zin_dark.16', picture: 'GFX_zin_evt_generic_war', descVariants: [{ key: 'gol', trigger: `original_tag = ${GOL}` }, { key: 'other', trigger: `NOT = { original_tag = ${GOL} }` }], options: [{ key: 'a', effect: `if = {\n  limit = { original_tag = ${GOL} }\n  add_political_power = ${N.clash_win_pp}\n${ind(2, call('zin_goldoroth_add_temper', { value: -N.clash_win_temper }))}\n  ${DON} = { add_stability = -${N.clash_win_stability} }\n${ind(2, call('zin_dark_add_border_tension', { value: N.clash_win_tension }))}\n}` }] },
    { id: 'zin_dark.17', picture: 'GFX_zin_evt_generic_war', descVariants: [{ key: 'gol', trigger: `original_tag = ${GOL}` }, { key: 'other', trigger: `NOT = { original_tag = ${GOL} }` }], options: [{ key: 'a', effect: `if = {\n  limit = { original_tag = ${GOL} }\n${ind(2, call('zin_goldoroth_add_temper', { value: N.clash_lose_temper }))}\n${ind(2, call('zin_goldoroth_add_favour', { bloc: 3, value: -N.clash_lose_war }))}\n${ind(2, call('zin_dark_add_accord_resolve', { value: N.clash_lose_resolve }))}\n}` }] },
    { id: 'zin_dark.18', picture: 'GFX_zin_evt_generic_peace', options: [{ key: 'a', effect: `if = {\n  limit = { original_tag = ${GOL} }\n${ind(2, call('zin_dark_add_border_tension', { value: N.clash_cancel_tension }))}\n}` }] },
    { id: 'zin_dark.20', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: 40, effect: `set_variable = { global.zin_dark_invite_result = 0 }\nFROM = { country_event = { id = zin_dark.21 } }` },
      { key: 'b', ai: { base: 20, mods: [...[0, 1, 2, 3, 4].map(i => ({ add: 10, when: tensionAt(i * 20 + 10) })), ...unitySteps(25), ...[0, 1, 2, 3, 4, 5].map(i => ({ add: -8, when: `check_variable = { zin_goldoroth_sway > ${i * 10 + 4.99} }` })), { factor: 1.5, when: 'has_country_flag = zin_dark_raided_recently' }, { factor: 0.75, when: 'has_country_flag = zin_dark_moot_member' }, { factor: 0, when: 'check_variable = { zin_volgan_pact > 1.99 }' }] },
        effect: `FROM = { add_to_faction = ROOT }\nset_variable = { global.zin_dark_invite_result = 1 }\n${call('zin_dark_add_accord_resolve', { value: N.invite_resolve })}\nFROM = { country_event = { id = zin_dark.21 } }` },
    ] },
    { id: 'zin_dark.21', picture: 'GFX_zin_evt_generic_court', descVariants: [{ key: 'joined', trigger: 'check_variable = { global.zin_dark_invite_result = 1 }' }, { key: 'declined', trigger: 'check_variable = { global.zin_dark_invite_result = 0 }' }], options: [{ key: 'a' }] },
    { id: 'zin_dark.22', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: 50, effect: `add_opinion_modifier = { target = ${DON} modifier = zin_dark_beacons_lit }` },
      { key: 'b', ai: { base: 20, mods: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => ({ add: 5, when: `NOT = { has_opinion = { target = ${DON} value > ${i * 10 - 100} } }` })) }, effect: 'leave_faction = yes' },
    ] },
    { id: 'zin_dark.30', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 100, mods: [{ add: 100, when: 'check_variable = { zin_court_corruption > 49.99 }' }] }, effect: `${DON} = { add_political_power = ${N.parim_blessing} }` },
      { key: 'b', ai: { base: 10, mods: [{ add: 15, when: tensionAt(40) }, { add: 15, when: tensionAt(80) }] }, effect: `give_guarantee = ${DON}\n${call('zin_dark_add_accord_resolve', { value: N.guarantee_resolve })}` },
      { key: 'c', ai: { base: 20, mods: [{ add: 10, when: 'check_variable = { zin_aenor_lost_cause > 29.99 }' }, { add: 10, when: 'check_variable = { zin_aenor_lost_cause > 59.99 }' }] }, effect: `${DON} = { country_event = { id = zin_diplo.23 } }` },
    ] },
    { id: 'zin_dark.31', picture: 'GFX_zin_evt_leren_envoys', options: [
      { key: 'a', ai: { base: 30, mods: [{ factor: 1.5, when: `${DON} = { check_variable = { zin_leren_lean > 29.99 } }` }] }, effect: `give_guarantee = ${DON}\n${DON} = {\n${ind(1, call('zin_leren_add_lean', { value: N.north_lean }))}\n}\n${call('zin_dark_add_accord_resolve', { value: N.guarantee_resolve })}` },
      { key: 'b', ai: 50, effect: `${DON} = {\n${ind(1, call('zin_leren_add_lean', { value: -N.north_lean_refused }))}\n}` },
    ] },
    { id: 'zin_dark.40', picture: 'GFX_zin_evt_generic_court', options: BLOCS.map(b => ({ key: b.key, ai: { base: 10, mods: [{ add: 30, when: `check_variable = { ${b.variable} < 25.01 }` }, { add: 10, when: `check_variable = { ${b.variable} < 40.01 }` }] }, effect: `${BLOCS.map(x => setFavour(x, x === b ? N.moot_pick : -N.moot_others)).join('\n')}\n${call('zin_goldoroth_add_temper', { value: -N.moot_temper })}` })) },
    { id: 'zin_dark.42', picture: 'GFX_zin_evt_generic_war', options: [
      { key: 'a', ai: 50, effect: `set_temp_variable = { zin_arg_kind = 1 }\nset_temp_variable = { zin_arg_target = ${DON} }\nzin_dark_resolve_raid = yes\n${call('zin_dark_add_border_tension', { value: N.blood_raid_tension })}` },
      { key: 'b', ai: 40, effect: `add_political_power = -${N.blood_cocanoor_pp}\n${call('zin_goldoroth_add_temper', { value: -N.blood_cocanoor_temper })}` },
      { key: 'c', ai: 10, effect: `add_stability = -${N.warking_no_stability}\n${call('zin_goldoroth_add_favour', { bloc: 3, value: -N.warking_no_war })}` },
    ] },
    { id: 'zin_dark.43', picture: 'GFX_zin_evt_generic_war', options: [{ key: 'a' }] },
    { id: 'zin_dark.44', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: 40, effect: [[0, 19.99, 52], [19.99, 39.99, 57], [39.99, 59.99, 62], [59.99, 79.99, 67], [79.99, 101, 72]].map(([lo, hi, win]) => `if = {\n  limit = {\n    check_variable = { zin_goldoroth_favour_war > ${lo} }\n    check_variable = { zin_goldoroth_favour_war < ${hi} }\n  }\n  random_list = {\n    ${win} = { country_event = { id = zin_dark.46 } }\n    ${100 - win} = { country_event = { id = zin_dark.45 } }\n  }\n}`).join('\n').replace('> 0\n', '> -1\n') },
      { key: 'b', ai: { base: 0, mods: [{ add: 60, when: 'has_political_power > 99.99' }] }, effect: `add_political_power = -${N.peace_pp}\nset_temp_variable = { zin_arg_bloc = global.zin_dark_challenger }\nset_temp_variable = { zin_arg_value = ${N.peace_favour} }\nzin_goldoroth_add_favour = yes` },
    ] },
    { id: 'zin_dark.45', picture: 'GFX_zin_evt_generic_court', options: [{ key: 'a', effect: 'zin_goldoroth_crown_heir = yes' }] },
    { id: 'zin_dark.46', picture: 'GFX_zin_evt_generic_court', options: [{ key: 'a', effect: `add_stability = ${N.stands_stability}\n${BLOCS.map(b => `if = {\n  limit = { check_variable = { global.zin_dark_challenger = ${b.code} } }\n  set_variable = { ${b.variable} = ${N.stands_favour} }\n}`).join('\n')}\nzin_goldoroth_refresh_favours = yes` }] },
    { id: 'zin_dark.50', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 40 }, effect: `set_variable = { global.zin_dark_yoke_result = 0 }\n${ind(0, `add_to_variable = { zin_goldoroth_sway = -${N.yoke_refuse_sway} }`)}\nclamp_variable = { var = zin_goldoroth_sway min = 0 max = 100 }\nset_country_flag = zin_dark_refused_yoke\nFROM = {\n  add_opinion_modifier = { target = ROOT modifier = zin_dark_yoke_refused }\n  if = {\n    limit = { zin_dark_date_defiance_cb = yes }\n    set_temp_variable = { zin_arg_target = ROOT }\n    zin_dark_grant_hold_cb = yes\n  }\n  country_event = { id = zin_dark.51 }\n}` },
      { key: 'b', ai: { base: 0, mods: [...swaySteps(5, 20), ...unitySteps(25).map(m => ({ ...m, add: 3 })), { add: 10, when: `${GOL} = { has_country_flag = zin_goldoroth_light_yoke }` }, { add: -20, when: 'has_country_flag = zin_dark_moot_member' }, { factor: 0.5, when: 'check_variable = { zin_volgan_pact = 2 }' }, { factor: 0, when: 'check_variable = { zin_volgan_pact > 2.99 }' }, { factor: 0, when: 'zin_dark_is_accord_member = yes' }] },
        effect: `set_variable = { global.zin_dark_yoke_result = 1 }\nFROM = {\n  set_temp_variable = { zin_arg_target = ROOT }\n  zin_goldoroth_take_tributary = yes\n}` },
    ] },
    { id: 'zin_dark.51', picture: 'GFX_zin_evt_generic_court', descVariants: [{ key: 'bowed', trigger: 'check_variable = { global.zin_dark_yoke_result = 1 }' }, { key: 'refused', trigger: 'check_variable = { global.zin_dark_yoke_result = 0 }' }], options: [{ key: 'a' }] },
    { id: 'zin_dark.52', kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: 'zin_dark_is_dark = yes', options: [{ key: 'a' }] },
    { id: 'zin_dark.60', kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: `OR = {\n  zin_dark_is_dark = yes\n  original_tag = ${LER}\n  original_tag = ${AEN}\n}`, options: [{ key: 'a' }] },
    { id: 'zin_dark.61', kind: 'news_event', picture: 'GFX_zin_news_generic_war', options: [{ key: 'a' }] },
    { id: 'zin_dark.62', kind: 'news_event', picture: 'GFX_zin_news_generic_war', options: [{ key: 'a' }] },
    { id: 'zin_dark.70', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: 40 },
      { key: 'b', ai: { base: 30, mods: [...[0, 1, 2, 3, 4].map(i => ({ add: 10, when: `${GOL} = { check_variable = { zin_goldoroth_unity > ${30 + i * 10} } }` })), { add: 20, when: 'has_country_flag = zin_dark_raided_recently' }, ...swaySteps(-5, 9.99), { factor: 0, when: 'zin_dark_is_tributary = yes' }] }, effect: 'zin_dark_join_free_moot = yes' },
    ] },
    { id: 'zin_dark.71', picture: 'GFX_zin_evt_generic_war', options: [
      { key: 'a', ai: { base: 30, mods: [{ add: 30, when: 'var:global.zin_dark_moot_attacker = { is_neighbor_of = ROOT }' }] }, effect: `add_to_variable = { zin_dark_moot_refusals = 1 }\nif = {\n  limit = { check_variable = { zin_dark_moot_refusals > 1.99 } }\n  zin_dark_leave_free_moot = yes\n}` },
      { key: 'b', ai: 60, effect: `var:global.zin_dark_moot_victim = {\n  var:global.zin_dark_moot_attacker = {\n    ROOT = { add_to_war = { targeted_alliance = PREV.PREV enemy = PREV hostility_reason = asked_to_join } }\n  }\n}` },
    ] },
    { id: 'zin_dark.72', picture: 'GFX_zin_evt_generic_court', options: [{ key: 'a', effect: 'zin_dark_leave_free_moot = yes' }] },
    { id: 'zin_dark.75', picture: 'GFX_zin_evt_generic_wilds', options: [{ key: 'a', effect: `add_political_power = ${N.troll_pp}\nadd_equipment_to_stockpile = { type = zin_arms_equipment amount = ${N.troll_arms} }` }] },
    { id: 'zin_dark.85', picture: 'GFX_zin_evt_southern_warning', options: [{ key: 'a', effect: `add_opinion_modifier = { target = ${GOL} modifier = zin_dark_refused_nafeher }` }] },
  ];
  const eventTexts = [];
  for (const e of eventsList) {
    if (!e.hidden && !pictures.has(e.picture)) throw new Error(`Event ${e.id}: picture ${e.picture} is not in the catalog`);
    eventTexts.push(renderEvent(e, T)); defs.events.push(e.id);
  }
  put('events/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\nadd_namespace = zin_dark\n\n${eventTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ on_actions and AI
  put('common/on_actions/zin_dark.txt', `${HEADER('mech_dark', SPEC)}
on_actions = {
	on_startup = {
		effect = {
			${GOL} = { country_event = { id = zin_dark.1 } }
		}
	}
	on_monthly = {
		effect = {
			if = {
				limit = { zin_dark_is_runner = yes }
				zin_dark_pulse = yes
			}
		}
	}
	on_declare_war = {
		effect = {
			zin_dark_on_declare_war = yes
		}
	}
	on_capitulation = {
		effect = {
			zin_dark_on_capitulation = yes
		}
	}
}`);
  const hubs = ['Dulundur', 'Bordon', 'Dreson'].map(n => darkAll.find(x => x.name === n).tag);
  const strat = (id, enable, lines) => `${id} = {\n\tenable = { ${enable} }\n\tabort_when_not_enabled = yes\n${lines.map(([type, tg, v]) => `\tai_strategy = {\n\t\ttype = ${type}\n\t\tid = "${tg}"\n\t\tvalue = ${v}\n\t}`).join('\n')}\n}`;
  put('common/ai_strategy/zin_dark.txt', [
    HEADER('mech_dark', SPEC),
    strat('zin_dark_goldoroth_stance', `original_tag = ${GOL}`, [['antagonize', DON, N.ai_antagonize_dondor], ...hubs.map(t => ['befriend', t, N.ai_befriend]), ...holdTags.map(t => ['influence', t, N.ai_influence])]),
    strat('zin_dark_dondor_ready', `original_tag = ${DON}\n\t\tcheck_variable = { global.zin_dark_border_tension > ${N.ai_prepare_tension - 0.01} }`, [['prepare_for_war', GOL, N.ai_prepare_value]]),
  ].join('\n\n'));
  defs.aiStrategies.push('zin_dark_goldoroth_stance', 'zin_dark_dondor_ready');
  return { eventsList, byCat };
}
