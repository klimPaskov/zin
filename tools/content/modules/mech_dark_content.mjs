// Dark Lands mechanic, content half (docs/specs/04_mechanics/dark_lands.md): the startup and the monthly pulse, spirits, modifiers,
// opinion modifiers, characters and traits, the six decision categories and their decisions, the events of namespace zin_dark,
// the on_actions and the AI strategies. Called by mech_dark.mjs, which owns the scripted triggers and the other effects.
// The pulse runs from on_monthly_<Goldoroth> and on_monthly_<Dondor> through zin_dark_is_runner (the spec's 30-day pulse of
// zin_dark.1; no every-country on_monthly). Variants of a decision whose cooldown or cost a tree flag changes are second decisions
// that share the first one's text and a short cooldown flag, so switching variants never skips a cooldown.
import { fmt, ind, join, call, HEADER, renderEvent, renderDecision, renderCategory, renderIdea, renderDynamicModifier, renderOpinion, knownPictures, knownIcons } from '../lib/mech_kit.mjs';
import { assertModifiers } from '../lib/core.mjs';

const SPEC = 'docs/specs/04_mechanics/dark_lands.md';
// production_speed_<building>_factor is a family the engine builds from common/buildings (the documentation lists none of them).
const modifierCheck = async (where, mods) => assertModifiers(where, Object.fromEntries(Object.entries(mods).filter(([k]) => !/^production_speed_[a-z_]+_factor$/.test(k))));
const indent = (text, n = 1) => String(text).split('\n').map(l => (l.trim() ? '  '.repeat(n) + l : l)).join('\n');

export async function buildDarkContent(c) {
  const { N, T, tags, put, defs, E_, BLOCS, darkAll, swayOf, statesTotal, holdTags, swayTags, ge } = c;
  const { GOL, DON, BLK, LER, AEN, VOL, TRF, DUL } = tags;
  const pictures = await knownPictures(), icons = await knownIcons();
  const darkTags = darkAll.map(x => x.tag);
  // allowed is read once when the game starts, before any on_startup flag: it names the tags.
  const tagsAllowed = list => ['OR = {', ...list.map(t => `  original_tag = ${t}`), '}'].join('\n');
  const ctt = (key, body) => `custom_trigger_tooltip = {\n  tooltip = ${T.use(key)}\n${indent(body)}\n}`;
  const steps = (test, from, step, count, add) => Array.from({ length: count }, (_, i) => ({ add, when: test(from + i * step) }));

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
${['zin_goldoroth_bredo', ...BLOCS.map(b => b.chief)].map(ch => `  recruit_character = ${ch}`).join('\n')}
}
${darkAll.filter(x => x.tag !== GOL).map(x => {
    const bonus = ![DON, BLK].includes(x.tag);
    return `${x.tag} = {\n  set_variable = { zin_goldoroth_sway = ${swayOf(x)} }\n${bonus ? `  if = {\n    limit = { is_neighbor_of = ${GOL} }\n    add_to_variable = { zin_goldoroth_sway = ${N.border_sway} }\n  }\n` : ''}  set_variable = { zin_goldoroth_sway_start = zin_goldoroth_sway }\n  set_variable = { zin_dark_tribute_days = 0 }\n  set_variable = { zin_dark_moot_refusals = 0 }\n}`;
  }).join('\n')}
${TRF} = { add_ideas = zin_dark_forest_nobody_enters }
every_state = {
  limit = { zin_is_site_troll_forest = yes }
  add_dynamic_modifier = { modifier = zin_dark_troll_woods }
}
zin_goldoroth_refresh_unity = yes
zin_dark_refresh_shield = yes
zin_dark_refresh_panel_rows = yes`);

  E_('zin_dark_refresh_panel_rows', `# The rows of the Horde and Accord windows: every sway-bearing Dark Lands country, and the Accord's members.
clear_array = global.zin_dark_sway_rows
clear_array = global.zin_dark_accord_rows
every_country = {
  limit = {
    zin_dark_is_dark = yes
    NOT = { original_tag = ${GOL} }
    NOT = { original_tag = ${DON} }
  }
  add_to_array = { array = global.zin_dark_sway_rows value = THIS }
}
every_country = {
  limit = { zin_dark_is_accord_member = yes }
  add_to_array = { array = global.zin_dark_accord_rows value = THIS }
}`);

  // The Zol hook of section 9: the northern shore and the Kusmeel coast watch for the dead (zin_dark.80 is the events slice's).
  E_('zin_dark_on_zol_rising', `if = {
  limit = { NOT = { has_global_flag = zin_dark_shore_warned } }
  set_global_flag = zin_dark_shore_warned
  every_country = {
    limit = {
      zin_dark_is_dark = yes
      OR = {
        any_owned_state = { zin_is_site_dark_strait_north_shore = yes }
        any_owned_state = { zin_is_site_ocean_of_zol_coast = yes }
      }
    }
    country_event = { id = zin_dark.80 }
  }
}`);
  // Section 10: the countries that were sworn (pact 3) or Volgan's subjects hear the south fall silent (zin_dark.82 is the events slice's).
  E_('zin_dark_on_body_destroyed', `if = {
  limit = { NOT = { has_global_flag = zin_dark_south_silent } }
  set_global_flag = zin_dark_south_silent
  every_country = {
    limit = {
      zin_dark_is_dark = yes
      OR = {
        has_country_flag = zin_dark_was_sworn
        is_subject_of = ${VOL}
        check_variable = { zin_volgan_pact > 2.99 }
      }
    }
    country_event = { id = zin_dark.82 }
  }
}`);

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
    limit = { ${ge('zin_goldoroth_favour_war', N.temper_war_favour)} }
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
# the lowest bloc may challenge the Warking (once a year at most)
${GOL} = {
  set_temp_variable = { zin_dark_lowest = 100 }
  set_temp_variable = { zin_dark_bloc_pick = 0 }
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
# sway drift and the yoke
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
    add_to_variable = { zin_dark_tribute_days = ${N.pulse_days} }
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
        check_variable = { zin_goldoroth_sway > ${N.sway_drift} }
      }
      add_to_variable = { zin_goldoroth_sway = -${N.sway_drift} }
    }
  }
  # remembered for zin_dark.82: who was sworn to the south before its fall
  if = {
    limit = {
      NOT = { has_global_flag = zin_volgan_body_destroyed }
      OR = {
        check_variable = { zin_volgan_pact > 2.99 }
        is_subject_of = ${VOL}
      }
    }
    set_country_flag = zin_dark_was_sworn
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
  limit = { ${ge('global.zin_gathering_dark', N.tension_dark)} }
${ind(1, call('zin_dark_add_border_tension', { value: N.tension_dark_gain }))}
}
set_temp_variable = { zin_dark_resolve_delta = 0 }
if = {
  limit = { ${ge('global.zin_dark_border_tension', N.resolve_tension_high)} }
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
subtract_from_temp_variable = { zin_dark_members = ${N.resolve_members_free} }
clamp_temp_variable = { var = zin_dark_members min = 0 max = ${Math.round(N.resolve_members_cap / N.resolve_members)} }
multiply_temp_variable = { zin_dark_members = ${N.resolve_members} }
add_to_temp_variable = { zin_dark_resolve_delta = zin_dark_members }
set_temp_variable = { zin_arg_value = zin_dark_resolve_delta }
zin_dark_add_accord_resolve = yes
if = {
  limit = { ${ge('global.zin_dark_accord_resolve', N.resolve_holds)} }
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
      is_faction_leader = no
    }
    country_event = { id = zin_dark.22 }
  }
}
if = {
  limit = { check_variable = { global.zin_dark_accord_resolve > ${N.resolve_fray + N.rearm_gap} } }
  clr_global_flag = zin_dark_fray_sent
}
# mastery of the Sea of Darkness: the highest sum of naval bases on its coast, at least ${N.sea_master_min} and ${N.sea_master_ratio} times the next
every_country = {
  limit = {
    OR = {
      has_variable = zin_dark_sea_bases
      any_owned_state = { zin_is_site_sea_of_darkness_coast = yes }
    }
  }
  set_variable = { zin_dark_sea_bases = 0 }
  every_owned_state = {
    limit = { zin_is_site_sea_of_darkness_coast = yes }
    add_to_variable = { PREV.zin_dark_sea_bases = building_level@naval_base }
  }
  set_variable = { zin_dark_sea_bases_scaled = zin_dark_sea_bases }
  multiply_variable = { zin_dark_sea_bases_scaled = ${N.sea_master_ratio} }
}
set_temp_variable = { zin_dark_new_master = 0 }
random_country = {
  limit = {
    has_variable = zin_dark_sea_bases
    ${ge('zin_dark_sea_bases', N.sea_master_min)}
    NOT = {
      any_other_country = {
        has_variable = zin_dark_sea_bases_scaled
        check_variable = { zin_dark_sea_bases_scaled > PREV.zin_dark_sea_bases }
      }
    }
  }
  set_temp_variable = { zin_dark_new_master = THIS }
}
every_country = {
  limit = {
    has_country_flag = zin_dark_sea_master
    NOT = { check_variable = { zin_dark_new_master = THIS } }
  }
  clr_country_flag = zin_dark_sea_master
  remove_ideas = zin_dark_sea_master
}
if = {
  limit = { NOT = { check_variable = { zin_dark_new_master = 0 } } }
  var:zin_dark_new_master = {
    if = {
      limit = { NOT = { has_country_flag = zin_dark_sea_master } }
      set_country_flag = zin_dark_sea_master
      add_ideas = zin_dark_sea_master
    }
  }
}
# the Free Moot
if = {
  limit = { has_global_flag = zin_dark_free_moot }
  set_temp_variable = { zin_dark_moot_count = 0 }
  every_country = {
    limit = { has_country_flag = zin_dark_moot_member }
    add_to_temp_variable = { zin_dark_moot_count = 1 }
  }
  if = {
    limit = { check_variable = { zin_dark_moot_count < ${N.moot_min_members} } }
    every_country = {
      limit = { has_country_flag = zin_dark_moot_member }
      country_event = { id = zin_dark.72 }
    }
    clr_global_flag = zin_dark_free_moot
  }
}
# Volgan's envoys, the dead on the shore, the fall of the south
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
if = {
  limit = { has_global_flag = zin_zol_rising }
  zin_dark_on_zol_rising = yes
}
if = {
  limit = { has_global_flag = zin_volgan_body_destroyed }
  zin_dark_on_body_destroyed = yes
}
zin_dark_refresh_panel_rows = yes
# the Dark Lands trees read these values (E4)
every_country = {
  limit = { zin_dark_is_dark = yes }
  mark_focus_tree_layout_dirty = yes
}`);
  // The tree hooks of section 6: the decision's effect without its cost, and the accept option of zin_dark.70.
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
  every_country = {
    limit = { has_country_flag = zin_dark_moot_member }
    add_opinion_modifier = { target = PREV modifier = zin_dark_moot_kin }
    PREV = { add_opinion_modifier = { target = PREV modifier = zin_dark_moot_kin } }
  }
  set_country_flag = zin_dark_moot_member
  add_ideas = zin_dark_free_moot
}`);
  E_('zin_dark_leave_free_moot', `if = {
  limit = { has_country_flag = zin_dark_moot_member }
  clr_country_flag = zin_dark_moot_member
  set_variable = { zin_dark_moot_refusals = 0 }
  if = {
    limit = { has_idea = zin_dark_free_moot }
    remove_ideas = zin_dark_free_moot
  }
  every_country = {
    limit = { has_country_flag = zin_dark_moot_member }
    remove_opinion_modifier = { target = PREV modifier = zin_dark_moot_kin }
    PREV = { remove_opinion_modifier = { target = PREV modifier = zin_dark_moot_kin } }
  }
}`);
  // on_declare_war: ROOT declares, FROM is the target. The Moot rides for a member attacked by an outsider.
  E_('zin_dark_on_declare_war', `if = {
  limit = {
    FROM = { has_country_flag = zin_dark_moot_member }
    NOT = { has_country_flag = zin_dark_moot_member }
  }
  set_variable = { global.zin_dark_moot_victim = FROM }
  set_variable = { global.zin_dark_moot_attacker = ROOT }
  every_country = {
    limit = {
      has_country_flag = zin_dark_moot_member
      NOT = { tag = FROM }
      NOT = { has_war_with = ROOT }
    }
    country_event = { id = zin_dark.71 }
  }
}
if = {
  limit = {
    OR = {
      zin_dark_is_dark = yes
      FROM = { zin_dark_is_dark = yes }
    }
  }
  zin_dark_refresh_shield = yes
}`);
  E_('zin_dark_on_capitulation', `if = {
  limit = { zin_dark_is_accord_member = yes }
${ind(1, call('zin_dark_add_accord_resolve', { value: -N.resolve_capitulation }))}
}
zin_goldoroth_tribute_on_capitulation = yes`);

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
  await assertModifiers('cause zin_cb_hold_defiance', { generate_wargoal_tension_against: N.cb_tension_value });
  dynTexts.push(`zin_cb_hold_defiance = {\n\tenable = { always = yes }\n\tgenerate_wargoal_tension_against = ${N.cb_tension_value}\n}`);
  defs.dynamicModifiers.push('zin_cb_hold_defiance');
  put('common/dynamic_modifiers/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\n\n${dynTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ opinion modifiers
  const opinions = N.opinions.map(([id, value, decay]) => ({ id, value, decay }));
  put('common/opinion_modifiers/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\nopinion_modifiers = {\n${ind(1, opinions.map(o => renderOpinion(o, T)).join('\n\n'))}\n}`);
  defs.opinions.push(...opinions.map(o => o.id));

  // ------------------------------------------------------------------------------------------------ characters and traits
  const portrait = (sex, n) => `GFX_zin_portrait_orcs_${sex}_${n}`;
  const portraits = (p, kind) => `portraits = {\n\t\t\tcivilian = {\n\t\t\t\tlarge = ${p}\n\t\t\t}${kind ? `\n\t\t\t${kind} = {\n\t\t\t\tlarge = ${p}\n\t\t\t}` : ''}\n\t\t}`;
  const chars = [
    { id: 'zin_goldoroth_bredo', portrait: portrait('male', 1), role: `advisor = {\n\t\tslot = theorist\n\t\tidea_token = zin_goldoroth_bredo\n\t\tallowed = { original_tag = ${GOL} }\n\t\ttraits = { zin_adv_sage }\n\t\tcost = 100\n\t}` },
    { id: 'zin_goldoroth_sungor', portrait: portrait('male', 2), role: `advisor = {\n\t\tslot = political_advisor\n\t\tidea_token = zin_goldoroth_sungor\n\t\tallowed = { original_tag = ${GOL} }\n\t\ttraits = { zin_adv_war_speaker }\n\t\tcost = 100\n\t}` },
    { id: 'zin_goldoroth_britag', portrait: portrait('male', 1), kind: 'army', role: `field_marshal = {\n\t\ttraits = { offensive_doctrine }\n\t\tskill = 4\n\t\tattack_skill = 4\n\t\tdefense_skill = 3\n\t\tplanning_skill = 3\n\t\tlogistics_skill = 3\n\t}` },
    { id: 'zin_goldoroth_bord', portrait: portrait('female', 1), role: `advisor = {\n\t\tslot = political_advisor\n\t\tidea_token = zin_goldoroth_bord\n\t\tallowed = { original_tag = ${GOL} }\n\t\ttraits = { zin_trait_forge_mistress }\n\t\tcost = 100\n\t}` },
    { id: 'zin_goldoroth_snikkit', portrait: portrait('male', 2), kind: 'army', role: `corps_commander = {\n\t\ttraits = { trickster }\n\t\tskill = 2\n\t\tattack_skill = 2\n\t\tdefense_skill = 2\n\t\tplanning_skill = 3\n\t\tlogistics_skill = 2\n\t}` },
    { id: 'zin_goldoroth_rask', portrait: portrait('male', 1), kind: 'navy', role: `navy_leader = {\n\t\ttraits = { }\n\t\tskill = 2\n\t\tattack_skill = 2\n\t\tdefense_skill = 2\n\t\tmaneuvering_skill = 2\n\t\tcoordination_skill = 2\n\t}` },
  ];
  for (const ch of chars) { T.use(ch.id); defs.characters.push(ch.id); }
  put('common/characters/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\n# Rask Black-Sail is not recruited at the start: the Goldoroth tree's "The Black-Sail Corsairs" recruits him.\ncharacters = {\n${chars.map(ch => `\t${ch.id} = {\n\t\tname = ${ch.id}\n\t\t${portraits(ch.portrait, ch.kind)}\n\t\t${ch.role}\n\t}`).join('\n')}\n}`);
  await modifierCheck('trait zin_trait_black_iron_warlord', { army_attack_factor: 0.05, army_morale_factor: 0.05 });
  put('common/unit_leader/zin_dark_traits.txt', `${HEADER('mech_dark', SPEC)}\nleader_traits = {\n\tzin_trait_black_iron_warlord = {\n\t\ttype = field_marshal\n\t\ttrait_type = personality_trait\n\t\tgain_xp = { always = no }\n\t\tfield_marshal_modifier = {\n\t\t\tarmy_attack_factor = 0.05\n\t\t\tarmy_morale_factor = 0.05\n\t\t}\n\t\tai_will_do = { factor = 0 }\n\t}\n}`);
  put('common/country_leader/zin_dark_traits.txt', `${HEADER('mech_dark', SPEC)}\nleader_traits = {\n\tzin_trait_forge_mistress = {\n\t\trandom = no\n\t\tproduction_speed_arms_factory_factor = 0.05\n\t}\n}`);
  for (const k of ['zin_trait_black_iron_warlord', 'zin_trait_forge_mistress', 'zin_trait_black_iron_warlord_desc', 'zin_trait_forge_mistress_desc']) T.use(k);
  defs.traits.push('zin_trait_black_iron_warlord', 'zin_trait_forge_mistress');

  // ------------------------------------------------------------------------------------------------ decisions
  const onlyGol = `original_tag = ${GOL}`, onlyDon = `original_tag = ${DON}`;
  const cats = [
    { id: 'zin_dark_raids', icon: 'GFX_idea_zin_corsair_raider', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_raids_open' },
    { id: 'zin_dark_horde', icon: 'GFX_idea_zin_war_drums', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_moot_open' },
    { id: 'zin_dark_sway', icon: 'GFX_idea_zin_tribute_chest', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_sway_open' },
    { id: 'zin_dark_accord', icon: 'GFX_idea_zin_banner_league', allowed: onlyDon, visible: 'is_faction_leader = yes' },
    { id: 'zin_dark_free_holds', icon: 'GFX_idea_zin_concord_circle', allowed: tagsAllowed(darkTags), visible: 'zin_dark_is_dark = yes' },
    { id: 'zin_dark_straits', icon: 'GFX_idea_zin_strait_chain', allowed: onlyGol, visible: 'OR = {\n  has_country_flag = zin_goldoroth_tolls_open\n  has_country_flag = zin_goldoroth_strait_wardens\n}' },
  ];
  for (const x of cats) { if (!icons.has(x.icon)) throw new Error(`Category ${x.id}: icon ${x.icon} is not in the catalog`); defs.categories.push(x.id); }
  put('common/decisions/categories/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\n\n${cats.map(x => renderCategory(x, T)).join('\n\n')}`);

  const tv = key => `FROM = { check_variable = { ${key} } }`;
  const noPP = n => ({ factor: 0, when: `NOT = { has_political_power > ${n - 1} }` });
  const holdTarget = `FROM = {\n  zin_dark_is_free_hold = yes\n  NOT = { has_war_with = ROOT }\n}`;
  const swayTarget = `FROM = {\n  NOT = { has_war_with = ROOT }\n}`;
  const cooldownFlag = id => `zin_dark_cd_${id.replace(/^zin_dark_/, '')}`;
  // A base decision and its tree-flag variant; both set the shorter cooldown as a flag, so switching variants keeps the wait.
  const variants = (base, flag, over = {}) => {
    const fl = cooldownFlag(base.id), shortest = Math.min(base.days_re_enable ?? Infinity, over.days_re_enable ?? base.days_re_enable ?? Infinity);
    const guard = Number.isFinite(shortest) && over.days_re_enable && over.days_re_enable !== base.days_re_enable;
    const add = d => ({
      ...d,
      available: guard ? join(d.available, ctt('zin_dark_tt_cooldown', `NOT = { has_country_flag = ${fl} }`)) : d.available,
      complete_effect: guard ? join(`set_country_flag = { flag = ${fl} days = ${shortest} }`, d.complete_effect) : d.complete_effect,
    });
    return [
      add({ ...base, visible: join(base.visible, `NOT = { has_country_flag = ${flag} }`) }),
      add({ ...base, ...over, id: `${base.id}_${base.suffix}`, alias: base.id, visible: join(base.visible, `has_country_flag = ${flag}`) }),
    ];
  };
  const raidStart = `set_country_flag = { flag = zin_goldoroth_raid_lately days = ${N.ai_raid_gap} }`;
  const mission = (kind, extra) => `set_temp_variable = { zin_arg_kind = ${kind} }\n${extra}\nzin_dark_resolve_raid = yes`;
  const raidAi = (add, extra = []) => ({ base: 0, mods: [{ add, when: ge('zin_goldoroth_temper', N.ai_raid_temper) }, { factor: 0, when: 'has_country_flag = zin_goldoroth_raid_lately' }, ...extra] });
  const noClash = ctt('zin_dark_tt_no_clash', 'NOT = { has_global_flag = zin_dark_clash_active }');
  const decisionsList = [
    ...variants({ id: 'zin_dark_raid_marches', cat: 'zin_dark_raids', icon: 'GFX_idea_zin_orc_axe', suffix: 'swift', allowed: onlyGol,
      available: `NOT = { has_war_with = ${DON} }\n${noClash}\ncountry_exists = ${DON}`, cost: N.raid_marches_cost, days_re_enable: N.raid_marches_cooldown, days_remove: N.raid_days,
      complete_effect: raidStart, remove_effect: mission(1, `set_temp_variable = { zin_arg_target = ${DON} }`),
      ai: raidAi(12, [{ factor: 0.25, when: ge('global.zin_dark_border_tension', N.ai_raid_dondor_tension) }, noPP(N.raid_marches_cost)]) }, 'zin_goldoroth_swift_raids', { days_re_enable: N.raid_marches_cooldown_swift }),
    { id: 'zin_dark_raid_hold', cat: 'zin_dark_raids', icon: 'GFX_idea_zin_goblin_raiders', allowed: onlyGol, target_root_trigger: onlyGol, targets: holdTags,
      target_trigger: `FROM = {\n  zin_dark_is_free_hold = yes\n  is_neighbor_of = ROOT\n  NOT = { has_war_with = ROOT }\n}`, cost: N.raid_hold_cost, days_re_enable: N.raid_hold_cooldown, days_remove: N.raid_days,
      complete_effect: raidStart, remove_effect: mission(2, 'set_temp_variable = { zin_arg_target = FROM }'),
      ai: raidAi(10, [{ factor: 0.5, when: `check_variable = { global.zin_dark_border_tension < ${N.ai_raid_dondor_tension} }` }, { factor: 0, when: tv(`zin_goldoroth_sway > ${N.yoke_sway - 0.01}`) }, noPP(N.raid_hold_cost)]) },
    { id: 'zin_dark_corsair_raid', cat: 'zin_dark_raids', icon: 'GFX_idea_zin_corsair_raider', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_corsairs', target_root_trigger: onlyGol, targets: darkTags.filter(t => t !== GOL),
      target_trigger: `FROM = {\n  OR = {\n    zin_dark_is_accord_member = yes\n    original_tag = ${BLK}\n    zin_dark_is_free_hold = yes\n  }\n  any_owned_state = { zin_is_site_sea_of_darkness_coast = yes }\n  NOT = { has_war_with = ROOT }\n}`, cost: N.corsair_cost, days_re_enable: N.corsair_cooldown, days_remove: N.raid_days,
      complete_effect: raidStart, remove_effect: mission(3, 'set_temp_variable = { zin_arg_target = FROM }'),
      ai: raidAi(8, [{ factor: 0.25, when: `FROM = {\n  original_tag = ${BLK}\n  has_country_flag = zin_regional_blackton_paid_corsairs\n}` }, noPP(N.corsair_cost)]) },
    { id: 'zin_dark_clash_on_the_march', cat: 'zin_dark_raids', icon: 'GFX_idea_zin_fort_wall', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_clash_open',
      available: join(ctt('zin_dark_tt_tension_clash', ge('global.zin_dark_border_tension', N.clash_tension)), ctt('zin_dark_tt_war_floor', 'zin_dark_date_war_floor = yes'), `NOT = { has_war_with = ${DON} }`, noClash, `command_power > ${N.clash_command - 0.01}`), cost: N.clash_cost, days_re_enable: N.clash_cooldown,
      complete_effect: `add_command_power = -${N.clash_command}\nzin_dark_start_border_clash = yes`,
      ai: { base: 0, mods: [{ add: 10, when: ge('global.zin_dark_border_tension', N.ai_raid_dondor_tension) }, { factor: 0, when: 'zin_rules_is_historical = yes\nNOT = { zin_dark_date_clash_historical = yes }' }] } },
    ...variants({ id: 'zin_dark_great_moot', cat: 'zin_dark_horde', icon: 'GFX_idea_zin_council_table', suffix: 'central', allowed: onlyGol, cost: N.moot_cost, days_re_enable: N.moot_cooldown, complete_effect: 'country_event = { id = zin_dark.40 }',
      ai: { base: 0, mods: [{ add: 10, when: `OR = {\n${BLOCS.map(b => `  check_variable = { ${b.variable} < ${N.ai_moot_bloc + 0.01} }`).join('\n')}\n}` }, noPP(N.moot_cost)] } }, 'zin_goldoroth_centralised', { days_re_enable: N.moot_cooldown_central }),
    { id: 'zin_dark_feast_the_clans', cat: 'zin_dark_horde', icon: 'GFX_idea_zin_feast_table', allowed: onlyGol,
      available: `has_equipment = { zin_arms_equipment > ${N.feast_arms - 1} }`, cost: N.feast_cost, days_re_enable: N.feast_cooldown,
      complete_effect: `add_equipment_to_stockpile = { type = zin_arms_equipment amount = -${N.feast_arms} }\n${BLOCS.map(b => call('zin_goldoroth_add_favour', { bloc: b.code, value: N.feast_favour })).join('\n')}\n${call('zin_goldoroth_add_temper', { value: -N.feast_temper })}`,
      ai: { base: 0, mods: [{ add: 12, when: `OR = {\n${BLOCS.map(b => `  check_variable = { ${b.variable} < ${N.ai_feast_favour + 0.01} }`).join('\n')}\n}` }, noPP(N.feast_cost + N.ai_pp_margin)] } },
    ...variants({ id: 'zin_dark_blood_contest', cat: 'zin_dark_horde', icon: 'GFX_idea_zin_spear_levy', suffix: 'cheap', allowed: onlyGol, cost: N.contest_cost, days_re_enable: N.contest_cooldown,
      complete_effect: `army_experience = ${N.contest_xp}\n${call('zin_goldoroth_add_favour', { bloc: 3, value: N.contest_favour })}\n${call('zin_goldoroth_add_temper', { value: -N.contest_temper })}`,
      ai: { base: 0, mods: [{ add: 12, when: `${ge('zin_goldoroth_temper', N.ai_contest_temper)}\nhas_political_power > ${N.ai_contest_pp - 0.01}` }] } }, 'zin_goldoroth_contests',
    { cost: N.contest_cost_cheap, complete_effect: `army_experience = ${N.contest_xp}\n${call('zin_goldoroth_add_favour', { bloc: 3, value: N.contest_favour })}\n${call('zin_goldoroth_add_temper', { value: -N.contest_temper_cheap })}` }),
    ...variants({ id: 'zin_dark_send_gifts', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_tribute_chest', suffix: 'cheap', allowed: onlyGol, target_root_trigger: onlyGol, targets: swayTags, target_trigger: swayTarget,
      available: `has_equipment = { zin_arms_equipment > ${N.gifts_arms - 1} }`, cost: N.gifts_cost, days_re_enable: N.gifts_cooldown,
      complete_effect: `add_equipment_to_stockpile = { type = zin_arms_equipment amount = -${N.gifts_arms} }\nhidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  set_temp_variable = { zin_arg_value = ${N.gifts_sway} }\n  zin_goldoroth_add_sway = yes\n  FROM = { add_opinion_modifier = { target = ROOT modifier = zin_dark_gifts } }\n}\ncustom_effect_tooltip = zin_dark_tt_sway_up`,
      ai: { base: 3, mods: [{ add: 8, when: `FROM = {\n  ${ge('zin_goldoroth_sway', N.ai_gifts_sway)}\n  check_variable = { zin_goldoroth_sway < ${N.yoke_sway} }\n}` }, noPP(N.gifts_cost + N.ai_pp_margin)] } }, 'zin_goldoroth_tallymen', { cost: N.gifts_cost_cheap }),
    { id: 'zin_dark_bind_by_marriage', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_handshake_oath', allowed: onlyGol, target_root_trigger: onlyGol, targets: holdTags, fire_only_once: true,
      target_trigger: `FROM = {\n  zin_dark_is_free_hold = yes\n  NOT = { has_war_with = ROOT }\n}`, cost: N.marriage_cost,
      complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  set_temp_variable = { zin_arg_value = ${N.marriage_sway} }\n  zin_goldoroth_add_sway = yes\n}\ncustom_effect_tooltip = zin_dark_tt_sway_up`,
      ai: { base: 2, mods: [{ add: 6, when: tv(`zin_goldoroth_sway > ${N.ai_marriage_sway - 0.01}`) }, noPP(N.marriage_cost + N.ai_pp_margin)] } },
    { id: 'zin_dark_show_the_host', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_levy_muster', allowed: onlyGol, target_root_trigger: onlyGol, targets: swayTags, target_trigger: swayTarget,
      available: ctt('zin_dark_tt_outnumber', 'zin_dark_outnumbers_threefold = yes'), cost: N.host_cost, days_re_enable: N.host_cooldown,
      complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  set_temp_variable = { zin_arg_value = ${N.host_sway} }\n  zin_goldoroth_add_sway = yes\n  FROM = { add_opinion_modifier = { target = ROOT modifier = zin_dark_host_shown } }\n  if = {\n    limit = { FROM = { is_neighbor_of = ${DON} } }\n${indent(call('zin_dark_add_border_tension', { value: N.host_tension }), 2)}\n  }\n}\n${call('zin_goldoroth_add_temper', { value: -N.host_temper })}\ncustom_effect_tooltip = zin_dark_tt_sway_up`,
      ai: { base: 0, mods: [{ add: 8, when: ge('zin_goldoroth_temper', N.ai_host_temper) }] } },
    ...variants({ id: 'zin_dark_offer_iron_yoke', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_chain_broken', suffix: 'cheap', allowed: onlyGol, target_root_trigger: onlyGol, targets: holdTags,
      target_trigger: `FROM = {\n  zin_dark_is_free_hold = yes\n  is_in_faction = no\n  NOT = { has_war_with = ROOT }\n}`, cost: N.yoke_cost, days_re_enable: N.yoke_cooldown,
      available: join(ctt('zin_dark_tt_yoke_date', 'zin_dark_date_yoke = yes'), ctt('zin_dark_tt_yoke_sway', tv(`zin_goldoroth_sway > ${N.yoke_sway - 0.01}`))),
      complete_effect: 'FROM = { country_event = { id = zin_dark.50 } }',
      ai: { base: 10, mods: [noPP(N.yoke_cost)] } }, 'zin_goldoroth_yoke_cheap',
    { available: join(ctt('zin_dark_tt_yoke_date', 'zin_dark_date_yoke = yes'), ctt('zin_dark_tt_yoke_sway_cheap', tv(`zin_goldoroth_sway > ${N.yoke_sway_cheap - 0.01}`))) }),
    ...variants({ id: 'zin_dark_one_fire', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_crown_iron', suffix: 'hard', allowed: onlyGol, target_root_trigger: onlyGol, targets: holdTags,
      target_trigger: 'FROM = {\n  zin_dark_is_tributary = yes\n}', cost: N.one_fire_cost,
      available: ctt('zin_dark_tt_one_fire', `FROM = {\n  ${ge('zin_dark_tribute_days', N.one_fire_days)}\n  ${ge('zin_goldoroth_sway', N.one_fire_sway)}\n}`),
      complete_effect: `annex_country = { target = FROM }\nnews_event = { id = zin_dark.52 }`, ai: { base: 15 } }, 'zin_goldoroth_hard_yoke',
    { available: ctt('zin_dark_tt_one_fire_hard', `FROM = {\n  ${ge('zin_dark_tribute_days', N.one_fire_days_hard)}\n  ${ge('zin_goldoroth_sway', N.one_fire_sway_hard)}\n}`) }),
    { id: 'zin_dark_hunt_envoys', cat: 'zin_dark_sway', icon: 'GFX_idea_zin_eye_watchful', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_hunt_open', target_root_trigger: onlyGol, targets: swayTags,
      target_trigger: `FROM = {\n  check_variable = { zin_volgan_pact > 0.99 }\n  OR = {\n    ${ge('zin_goldoroth_sway', N.hunt_sway)}\n    zin_dark_is_tributary = yes\n  }\n}`, cost: N.hunt_cost, days_re_enable: N.hunt_cooldown,
      complete_effect: `hidden_effect = {\n  set_temp_variable = { zin_arg_target = FROM }\n  set_temp_variable = { zin_arg_value = -1 }\n  zin_dark_add_volgan_pact = yes\n${indent(call('zin_volgan_add_veil', { value: -N.hunt_veil }))}\n  ${VOL} = {\n    country_event = { id = zin_dark.85 }\n    add_opinion_modifier = { target = ROOT modifier = zin_dark_envoys_hunted }\n  }\n  FROM = {\n    if = {\n      limit = { zin_dark_is_tributary = no }\n      add_opinion_modifier = { target = ROOT modifier = zin_dark_envoys_hunted }\n    }\n  }\n}\ncustom_effect_tooltip = zin_dark_tt_hunt`,
      ai: { base: 0, mods: [{ add: 15, when: 'zin_dark_rule_independent = yes' }, { add: 10, when: 'has_country_flag = zin_goldoroth_no_masters' }, noPP(N.hunt_cost)] } },
    ...variants({ id: 'zin_dark_light_beacons', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_beacon', suffix: 'chain', allowed: onlyDon, cost: N.beacons_cost, days_re_enable: N.beacons_cooldown,
      complete_effect: call('zin_dark_add_accord_resolve', { value: N.beacons_resolve }),
      ai: { base: 0, mods: [{ add: 12, when: `check_variable = { global.zin_dark_accord_resolve < ${N.ai_beacons_resolve} }` }, noPP(N.beacons_cost + N.ai_pp_margin)] } }, 'zin_regional_dondor_beacon_chain', { days_re_enable: N.beacons_cooldown_chain }),
    { id: 'zin_dark_pay_blood_price', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_coin_chest', allowed: onlyDon, available: join(ctt('zin_dark_tt_tension_blood', ge('global.zin_dark_border_tension', N.blood_tension)), `country_exists = ${GOL}`), cost: N.blood_cost, days_re_enable: N.blood_cooldown,
      complete_effect: `hidden_effect = { zin_dark_blood_price_paid = yes }\ncustom_effect_tooltip = zin_dark_tt_blood`,
      ai: { base: 0, mods: [{ add: 12, when: `${ge('global.zin_dark_border_tension', N.ai_blood_tension)}\nhas_political_power > ${N.ai_blood_pp - 0.01}` }] } },
    { id: 'zin_dark_invite_to_accord', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_envoy', allowed: onlyDon, target_root_trigger: onlyDon, targets: swayTags,
      target_trigger: `FROM = {\n  is_in_faction = no\n  is_subject = no\n  NOT = { has_government = communism }\n  check_variable = { zin_goldoroth_sway < ${N.invite_sway_max} }\n  check_variable = { zin_volgan_pact < ${N.invite_pact_max + 0.01} }\n}`, cost: N.invite_cost, days_re_enable: N.invite_cooldown,
      complete_effect: 'FROM = { country_event = { id = zin_dark.20 } }',
      ai: { base: 0, mods: [{ add: 10, when: `FROM = { check_variable = { zin_goldoroth_sway < ${N.ai_invite_sway} } }` }, noPP(N.invite_cost + N.ai_pp_margin)] } },
    ...variants({ id: 'zin_dark_muster_brutes', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_levy_muster', suffix: 'drill', allowed: onlyDon, cost: N.muster_cost, days_re_enable: N.muster_cooldown,
      available: ctt('zin_dark_tt_muster', `OR = {\n  ${ge('global.zin_dark_border_tension', N.muster_tension)}\n  has_war_with = ${GOL}\n}`),
      complete_effect: `add_timed_idea = { idea = zin_dark_brutes_mustered days = ${N.muster_days} }`,
      ai: { base: 0, mods: [{ add: 12, when: ge('global.zin_dark_border_tension', N.muster_tension) }, { add: 12, when: `has_war_with = ${GOL}` }] } }, 'zin_regional_dondor_muster_drill', { days_re_enable: N.muster_cooldown_drill }),
    { id: 'zin_dark_petition_parim', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_scroll_treaty', allowed: onlyDon, fire_only_once: true, cost: N.petition_cost,
      complete_effect: `random_country = {\n  limit = { any_owned_state = { zin_is_site_parim = yes } }\n  country_event = { id = zin_dark.30 }\n}`,
      ai: { base: 20, mods: [{ factor: 0.2, when: 'zin_dark_date_war_floor = yes' }] } },
    { id: 'zin_dark_call_on_the_north', cat: 'zin_dark_accord', icon: 'GFX_idea_zin_ship_voyage', allowed: onlyDon, available: `country_exists = ${LER}\nNOT = { has_war_with = ${LER} }`, cost: N.north_cost, days_re_enable: N.north_cooldown,
      complete_effect: `${LER} = { country_event = { id = zin_dark.31 } }`,
      ai: { base: 0, mods: [{ add: 10, when: ge('global.zin_dark_border_tension', N.north_tension) }] } },
    { id: 'zin_dark_call_free_moot', cat: 'zin_dark_free_holds', icon: 'GFX_idea_zin_concord_circle', allowed: tagsAllowed(holdTags), visible: 'zin_dark_is_free_hold = yes',
      available: join(ctt('zin_dark_tt_moot_free', 'zin_dark_moot_eligible = yes'), ctt('zin_dark_tt_moot_none', 'NOT = { has_global_flag = zin_dark_free_moot }'), `country_exists = ${GOL}`, ctt('zin_dark_tt_moot_cause', 'zin_dark_moot_may_be_called = yes')), cost: N.call_moot_cost,
      complete_effect: 'zin_dark_found_free_moot = yes',
      ai: { base: 5, mods: [{ factor: 3, when: `original_tag = ${DUL}` }, noPP(N.call_moot_cost + N.ai_pp_margin)] } },
    { id: 'zin_dark_leave_free_moot', cat: 'zin_dark_free_holds', icon: 'GFX_idea_zin_chain_broken', allowed: tagsAllowed(holdTags), visible: 'has_country_flag = zin_dark_moot_member', complete_effect: 'zin_dark_leave_free_moot = yes',
      ai: { base: 0 } },
    { id: 'zin_dark_hire_troll_kin', cat: 'zin_dark_free_holds', icon: 'GFX_idea_zin_troll_club', allowed: tagsAllowed(darkTags.filter(t => t !== TRF)), visible: `NOT = { original_tag = ${TRF} }\ncountry_exists = ${TRF}`,
      available: join(ctt('zin_dark_tt_trolls', `OR = {\n  has_country_flag = zin_dark_trolls_for_pay\n  ${TRF} = { has_opinion = { target = ROOT value > ${N.troll_opinion - 1} } }\n}`), `has_equipment = { zin_arms_equipment > ${N.troll_arms - 1} }`, `NOT = { has_war_with = ${TRF} }`), cost: N.troll_cost, days_re_enable: N.troll_cooldown,
      complete_effect: `add_equipment_to_stockpile = { type = zin_arms_equipment amount = -${N.troll_arms} }\nadd_timed_idea = { idea = zin_dark_troll_hirelings days = ${N.troll_days} }\n${TRF} = { country_event = { id = zin_dark.75 } }`,
      ai: { base: 0, mods: [{ add: 6, when: `has_war = yes\nhas_political_power > ${N.troll_cost + N.ai_pp_margin}` }] } },
    { id: 'zin_dark_levy_shore_tolls', cat: 'zin_dark_straits', icon: 'GFX_idea_zin_toll_house', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_tolls_open',
      available: join(ctt('zin_dark_tt_tolls', `OR = {\n  AND = {\n    set_temp_variable = { zin_arg_strait = 1 }\n    zin_dark_holds_strait_shore = yes\n    NOT = { has_war_with = ${LER} }\n  }\n  AND = {\n    set_temp_variable = { zin_arg_strait = 2 }\n    zin_dark_holds_strait_shore = yes\n    NOT = { has_war_with = ${AEN} }\n  }\n}`), 'is_subject = no'), days_re_enable: N.tolls_cooldown,
      complete_effect: `add_political_power = ${N.tolls_pp}\nhidden_effect = {\n  set_temp_variable = { zin_arg_strait = 1 }\n  if = {\n    limit = {\n      zin_dark_holds_strait_shore = yes\n      NOT = { has_war_with = ${LER} }\n    }\n    ${LER} = { add_opinion_modifier = { target = ROOT modifier = zin_dark_shore_tolls } }\n  }\n  else = {\n    ${AEN} = { add_opinion_modifier = { target = ROOT modifier = zin_dark_shore_tolls } }\n  }\n}\ncustom_effect_tooltip = zin_dark_tt_tolls_paid`,
      ai: { base: 4 } },
    { id: 'zin_dark_close_strait', cat: 'zin_dark_straits', icon: 'GFX_idea_zin_strait_chain', allowed: onlyGol, visible: 'has_country_flag = zin_goldoroth_strait_wardens', target_root_trigger: onlyGol,
      target_trigger: 'FROM = {\n  has_war_with = ROOT\n}',
      available: join('has_war = yes', ctt('zin_dark_tt_close', `OR = {\n  AND = {\n    set_temp_variable = { zin_arg_strait = 1 }\n    zin_dark_holds_strait_shore = yes\n  }\n  AND = {\n    set_temp_variable = { zin_arg_strait = 2 }\n    zin_dark_holds_strait_shore = yes\n  }\n}`)), cost: N.close_cost, days_re_enable: N.close_cooldown,
      complete_effect: `FROM = { add_timed_idea = { idea = zin_dark_strait_closed days = ${N.close_days} } }`,
      ai: { base: 5 } },
  ];
  const byCat = new Map();
  for (const d of decisionsList) {
    if (!icons.has(d.icon)) throw new Error(`Decision ${d.id}: icon ${d.icon} is not in the catalog`);
    if (d.alias) { T.alias(d.id, d.alias); T.alias(`${d.id}_desc`, `${d.alias}_desc`); }
    defs.decisions.push(d.id);
    if (!byCat.has(d.cat)) byCat.set(d.cat, []);
    const extraText = [...new Set([...(d.complete_effect ?? '').matchAll(/custom_effect_tooltip = ([a-z0-9_]+)/g)].map(m => m[1]))];
    byCat.get(d.cat).push(renderDecision({ ...d, extraText }, T));
  }
  put('common/decisions/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\n\n${[...byCat].map(([cat, list]) => `${cat} = {\n${ind(1, list.join('\n\n'))}\n}`).join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ events
  // AI chances follow the spec's formulas in steps of ten points of the variable they read (ai_chance reads no variables).
  const ans = (key, n, ai, extra = '') => ({ key, ai, effect: join(extra, `set_temp_variable = { zin_arg_answer = ${n} }\nzin_dark_answer_raid = yes`) });
  const victimOptions = isDondor => [
    ans('a', 1, 50),
    ans('b', 2, { base: 30, mods: [{ factor: 2, when: ge('global.zin_dark_border_tension', N.ai_victim_blood_tension) }, noPP(N.blood_price)] }),
    ans('c', 3, { base: 20, mods: isDondor ? [{ factor: 2, when: ge('global.zin_dark_border_tension', N.ai_victim_kind_tension) }] : [] }),
  ];
  const gtTension = n => ge('global.zin_dark_border_tension', n);
  const golUnity = n => `${GOL} = { ${ge('zin_goldoroth_unity', n)} }`;
  const sway = n => ge('zin_goldoroth_sway', n);
  const opinionOfDondor = n => `has_opinion = { target = ${DON} value > ${n - 0.01} }`;
  const setFavour = (b, v) => `set_temp_variable = { zin_arg_bloc = ${b.code} }\nset_temp_variable = { zin_arg_value = ${v} }\nzin_goldoroth_add_favour = yes`;
  const golDesc = [{ key: 'gol', trigger: `original_tag = ${GOL}` }, { key: 'other', trigger: `NOT = { original_tag = ${GOL} }` }];
  // Accept 20 + tension/2 + (unity - 25)/2 - sway; x1.5 raided, x0.75 in the Moot, x0 at pact 2+ or Shadow. Decline is the rest.
  const inviteAccept = { base: 20, mods: [...steps(gtTension, 10, 10, 9, 5), ...steps(golUnity, 35, 10, 7, 5), ...steps(sway, 10, 10, 9, -10), { factor: 1.5, when: 'has_country_flag = zin_dark_raided_recently' }, { factor: 0.75, when: 'has_country_flag = zin_dark_moot_member' }, { factor: 0, when: 'check_variable = { zin_volgan_pact > 1.99 }' }, { factor: 0, when: 'has_government = communism' }] };
  const inviteDecline = { base: 80, mods: [...steps(gtTension, 10, 10, 9, -5), ...steps(golUnity, 35, 10, 7, -5), ...steps(sway, 10, 10, 9, 10), { add: 100, when: 'OR = {\n  check_variable = { zin_volgan_pact > 1.99 }\n  has_government = communism\n}' }] };
  // Bend sway - 20 + unity x 0.3; +10 light yoke, -20 in the Moot, x0.5 at pact 2, x0 at pact 3 or in the Accord. Refusal is the rest.
  const yokeBend = { base: -20, mods: [...steps(sway, 10, 10, 10, 10), ...steps(golUnity, 10, 10, 10, 3), { add: N.yoke_light_bonus, when: `${GOL} = { has_country_flag = zin_goldoroth_light_yoke }` }, { add: -N.yoke_moot_malus, when: 'has_country_flag = zin_dark_moot_member' }, { factor: 0.5, when: 'check_variable = { zin_volgan_pact = 2 }' }, { factor: 0, when: 'check_variable = { zin_volgan_pact > 2.99 }' }, { factor: 0, when: 'zin_dark_is_accord_member = yes' }] };
  const yokeRefuse = { base: 120, mods: [...steps(sway, 10, 10, 10, -10), ...steps(golUnity, 10, 10, 10, -3), { add: -N.yoke_light_bonus, when: `${GOL} = { has_country_flag = zin_goldoroth_light_yoke }` }, { add: N.yoke_moot_malus, when: 'has_country_flag = zin_dark_moot_member' }, { add: 100, when: 'OR = {\n  check_variable = { zin_volgan_pact > 2.99 }\n  zin_dark_is_accord_member = yes\n}' }] };
  // Join the Moot 30 + (unity - 30) + 20 if raided - sway/2; x0 for a tributary. Decline is the rest.
  const mootJoin = { base: 0, mods: [...steps(golUnity, 10, 10, 10, 10), { add: 20, when: 'has_country_flag = zin_dark_raided_recently' }, ...steps(sway, 10, 10, 9, -5), { factor: 0, when: 'zin_dark_is_tributary = yes' }] };
  const mootDecline = { base: 100, mods: [...steps(golUnity, 10, 10, 10, -10), { add: -20, when: 'has_country_flag = zin_dark_raided_recently' }, ...steps(sway, 10, 10, 9, 5)] };
  const winChance = `set_temp_variable = { zin_dark_win = zin_goldoroth_favour_war }
divide_temp_variable = { zin_dark_win = ${N.challenge_favour_div} }
add_to_temp_variable = { zin_dark_win = ${N.challenge_base} }
clamp_temp_variable = { var = zin_dark_win min = 0 max = ${N.challenge_cap} }
set_temp_variable_to_random = { var = zin_dark_roll min = 0 max = 100 }`;
  const eventsList = [
    { id: 'zin_dark.1', hidden: true, fire_only_once: true, immediate: 'zin_dark_startup = yes' },
    { id: 'zin_dark.2', hidden: true, immediate: call('zin_dark_end_clash', { result: 1 }) },
    { id: 'zin_dark.3', hidden: true, immediate: call('zin_dark_end_clash', { result: 2 }) },
    { id: 'zin_dark.4', hidden: true, immediate: call('zin_dark_end_clash', { result: 3 }) },
    { id: 'zin_dark.10', picture: 'GFX_zin_evt_generic_war', options: [{ key: 'a' }] },
    { id: 'zin_dark.11', picture: 'GFX_zin_evt_generic_war', options: victimOptions(true) },
    { id: 'zin_dark.12', picture: 'GFX_zin_evt_generic_war', options: victimOptions(false) },
    { id: 'zin_dark.13', picture: 'GFX_zin_evt_generic_sea', options: victimOptions(false) },
    { id: 'zin_dark.15', kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: `OR = {\n  zin_dark_is_dark = yes\n  original_tag = ${LER}\n  original_tag = ${AEN}\n}`, options: [{ key: 'a' }] },
    { id: 'zin_dark.16', picture: 'GFX_zin_evt_generic_war', descVariants: golDesc, options: [{ key: 'a', effect: `if = {\n  limit = { original_tag = ${GOL} }\n  add_political_power = ${N.clash_win_pp}\n${indent(call('zin_goldoroth_add_temper', { value: -N.clash_win_temper }))}\n  ${DON} = { add_stability = -${N.clash_win_stability} }\n${indent(call('zin_dark_add_border_tension', { value: N.clash_win_tension }))}\n}` }] },
    { id: 'zin_dark.17', picture: 'GFX_zin_evt_generic_war', descVariants: golDesc, options: [{ key: 'a', effect: `if = {\n  limit = { original_tag = ${GOL} }\n${indent(call('zin_goldoroth_add_temper', { value: N.clash_lose_temper }))}\n${indent(call('zin_goldoroth_add_favour', { bloc: 3, value: -N.clash_lose_war }))}\n${indent(call('zin_dark_add_accord_resolve', { value: N.clash_lose_resolve }))}\n}` }] },
    { id: 'zin_dark.18', picture: 'GFX_zin_evt_generic_peace', options: [{ key: 'a', effect: `if = {\n  limit = { original_tag = ${GOL} }\n${indent(call('zin_dark_add_border_tension', { value: N.clash_cancel_tension }))}\n}` }] },
    { id: 'zin_dark.20', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: inviteAccept, effect: `FROM = { add_to_faction = ROOT }\nset_variable = { global.zin_dark_invite_result = 1 }\n${call('zin_dark_add_accord_resolve', { value: N.invite_resolve })}\nFROM = { country_event = { id = zin_dark.21 } }` },
      { key: 'b', ai: inviteDecline, effect: 'set_variable = { global.zin_dark_invite_result = 0 }\nFROM = { country_event = { id = zin_dark.21 } }' },
    ] },
    { id: 'zin_dark.21', picture: 'GFX_zin_evt_mirolon_passes', descVariants: [{ key: 'joined', trigger: 'check_variable = { global.zin_dark_invite_result = 1 }' }, { key: 'declined', trigger: 'check_variable = { global.zin_dark_invite_result = 0 }' }], options: [{ key: 'a' }] },
    // Stay: the opinion of Dondor; leave: 100 - the opinion of Dondor.
    { id: 'zin_dark.22', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 0, mods: steps(opinionOfDondor, 10, 10, 10, 10) }, effect: `add_opinion_modifier = { target = ${DON} modifier = zin_dark_stood_with_accord }` },
      { key: 'b', ai: { base: 100, mods: [...steps(opinionOfDondor, 10, 10, 10, -10), ...steps(n => `NOT = { ${opinionOfDondor(n)} }`, -90, 10, 10, 10)] }, effect: 'leave_faction = yes' },
    ] },
    // Blessing 100 x (1 + corruption/50); guarantee 10 + tension/2; the Lost Cause 20 + its strength/2. On the historical path the court blesses.
    { id: 'zin_dark.30', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: { base: 100, mods: steps(n => ge('zin_court_corruption', n), 10, 10, 10, 20) }, effect: `${DON} = { add_political_power = ${N.parim_blessing} }` },
      { key: 'b', ai: { base: 10, mods: [...steps(gtTension, 10, 10, 10, 5), { factor: 0, when: 'zin_rules_is_historical = yes' }] }, effect: `give_guarantee = ${DON}\n${call('zin_dark_add_accord_resolve', { value: N.guarantee_resolve })}` },
      { key: 'c', ai: { base: 20, mods: [...steps(n => ge('zin_aenor_lost_cause', n), 10, 10, 10, 5), { factor: 0, when: 'zin_rules_is_historical = yes' }] }, effect: `${DON} = { country_event = { id = zin_diplo.23 } }` },
    ] },
    // Ships 30 + Dondor's lean/2, x2 with Friends of the Dark Sea Accord, x0 with Bargain with Goldoroth; words 50.
    { id: 'zin_dark.31', picture: 'GFX_zin_evt_leren_envoys', options: [
      { key: 'a', ai: { base: 30, mods: [...steps(n => `${DON} = { ${ge('zin_leren_lean', n)} }`, 10, 10, 10, 5), ...steps(n => `${DON} = { check_variable = { zin_leren_lean < ${-n + 0.01} } }`, 10, 10, 6, -5), { factor: 2, when: 'has_completed_focus = zin_lerendor_friends_of_the_dark_sea_accord' }, { factor: 0, when: 'has_completed_focus = zin_lerendor_bargain_with_goldoroth' }] },
        effect: `give_guarantee = ${DON}\n${DON} = {\n${indent(call('zin_leren_add_lean', { value: N.north_lean }))}\n}\n${call('zin_dark_add_accord_resolve', { value: N.guarantee_resolve })}` },
      { key: 'b', ai: 50, effect: `${DON} = {\n${indent(call('zin_leren_add_lean', { value: -N.north_lean_refused }))}\n}` },
    ] },
    { id: 'zin_dark.40', picture: 'GFX_zin_evt_generic_court', options: BLOCS.map(b => ({ key: b.key, ai: { base: 10, mods: [{ add: 30, when: `check_variable = { ${b.variable} < ${N.ai_moot_bloc + 0.01} }` }, { add: 10, when: `check_variable = { ${b.variable} < ${N.ai_moot_bloc_soft + 0.01} }` }] }, effect: `${BLOCS.map(x => setFavour(x, x === b ? N.moot_pick : -N.moot_others)).join('\n')}\n${call('zin_goldoroth_add_temper', { value: -N.moot_temper })}` })) },
    { id: 'zin_dark.42', picture: 'GFX_zin_evt_generic_war', options: [
      { key: 'a', ai: 50, effect: `if = {\n  limit = { country_exists = ${DON} }\n  set_temp_variable = { zin_arg_kind = 1 }\n  set_temp_variable = { zin_arg_target = ${DON} }\n  zin_dark_resolve_raid = yes\n}\n${call('zin_dark_add_border_tension', { value: N.blood_raid_tension })}` },
      { key: 'b', ai: 40, effect: `add_political_power = -${N.blood_cocanoor_pp}\n${call('zin_goldoroth_add_temper', { value: -N.blood_cocanoor_temper })}` },
      { key: 'c', ai: 10, effect: `add_stability = -${N.warking_no_stability}\n${call('zin_goldoroth_add_favour', { bloc: 3, value: -N.warking_no_war })}` },
    ] },
    { id: 'zin_dark.43', picture: 'GFX_zin_evt_generic_war', options: [{ key: 'a' }] },
    { id: 'zin_dark.44', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: 40, effect: `custom_effect_tooltip = ${T.use('zin_dark_tt_challenge')}\nhidden_effect = {\n${indent(winChance)}\n  if = {\n    limit = { check_variable = { zin_dark_roll < zin_dark_win } }\n    country_event = { id = zin_dark.46 }\n  }\n  else = {\n    zin_goldoroth_crown_heir = yes\n    news_event = { id = zin_dark.45 }\n  }\n}` },
      { key: 'b', ai: { base: 0, mods: [{ add: 60, when: `has_political_power > ${N.peace_pp - 0.01}` }] }, effect: `add_political_power = -${N.peace_pp}\nset_temp_variable = { zin_arg_bloc = global.zin_dark_challenger }\nset_temp_variable = { zin_arg_value = ${N.peace_favour} }\nzin_goldoroth_add_favour = yes\nset_variable = { global.zin_dark_challenger = 0 }` },
    ] },
    { id: 'zin_dark.45', kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: 'zin_dark_is_dark = yes', options: [{ key: 'a' }] },
    { id: 'zin_dark.46', picture: 'GFX_zin_evt_generic_war', options: [{ key: 'a', effect: `add_stability = ${N.stands_stability}\n${BLOCS.map(b => `if = {\n  limit = { check_variable = { global.zin_dark_challenger = ${b.code} } }\n  set_variable = { ${b.variable} = ${N.stands_favour} }\n}`).join('\n')}\nzin_goldoroth_refresh_favours = yes\nset_variable = { global.zin_dark_challenger = 0 }` }] },
    { id: 'zin_dark.50', picture: 'GFX_zin_evt_southern_warning', options: [
      { key: 'a', ai: yokeBend, effect: `set_variable = { global.zin_dark_yoke_result = 1 }\nFROM = {\n  set_temp_variable = { zin_arg_target = ROOT }\n  zin_goldoroth_take_tributary = yes\n}` },
      { key: 'b', ai: yokeRefuse, effect: `set_variable = { global.zin_dark_yoke_result = 0 }\nadd_to_variable = { zin_goldoroth_sway = -${N.yoke_refuse_sway} }\nclamp_variable = { var = zin_goldoroth_sway min = 0 max = 100 }\nset_country_flag = zin_dark_refused_yoke\nFROM = {\n  add_opinion_modifier = { target = ROOT modifier = zin_dark_yoke_refused }\n  if = {\n    limit = { zin_dark_date_defiance_cb = yes }\n    set_temp_variable = { zin_arg_target = ROOT }\n    zin_dark_grant_hold_cb = yes\n  }\n  country_event = { id = zin_dark.51 }\n}` },
    ] },
    { id: 'zin_dark.51', picture: 'GFX_zin_evt_generic_court', descVariants: [{ key: 'bowed', trigger: 'check_variable = { global.zin_dark_yoke_result = 1 }' }, { key: 'refused', trigger: 'check_variable = { global.zin_dark_yoke_result = 0 }' }], options: [{ key: 'a' }] },
    { id: 'zin_dark.52', kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: 'zin_dark_is_dark = yes', options: [{ key: 'a' }] },
    { id: 'zin_dark.60', kind: 'news_event', picture: 'GFX_zin_news_generic_war', show_major: `OR = {\n  zin_dark_is_dark = yes\n  original_tag = ${LER}\n  original_tag = ${AEN}\n}`, options: [{ key: 'a' }] },
    { id: 'zin_dark.61', kind: 'news_event', picture: 'GFX_zin_news_generic_war', options: [{ key: 'a' }] },
    { id: 'zin_dark.62', kind: 'news_event', picture: 'GFX_zin_news_generic_war', options: [{ key: 'a' }] },
    { id: 'zin_dark.70', picture: 'GFX_zin_evt_generic_court', options: [
      { key: 'a', ai: mootJoin, effect: 'zin_dark_join_free_moot = yes' },
      { key: 'b', ai: mootDecline },
    ] },
    // Ride 60 if bordering the attacker, else 30.
    { id: 'zin_dark.71', picture: 'GFX_zin_evt_generic_war', options: [
      { key: 'a', ai: { base: 30, mods: [{ add: 30, when: 'var:global.zin_dark_moot_attacker = { is_neighbor_of = ROOT }' }] }, effect: 'var:global.zin_dark_moot_victim = {\n  var:global.zin_dark_moot_attacker = {\n    ROOT = { add_to_war = { targeted_alliance = PREV.PREV enemy = PREV hostility_reason = asked_to_join } }\n  }\n}' },
      { key: 'b', ai: { base: 70, mods: [{ add: -30, when: 'var:global.zin_dark_moot_attacker = { is_neighbor_of = ROOT }' }] }, effect: `add_to_variable = { zin_dark_moot_refusals = 1 }\nif = {\n  limit = { check_variable = { zin_dark_moot_refusals > ${N.moot_refusals_max - 0.01} } }\n  zin_dark_leave_free_moot = yes\n}` },
    ] },
    { id: 'zin_dark.72', picture: 'GFX_zin_evt_generic_court', options: [{ key: 'a', effect: 'zin_dark_leave_free_moot = yes' }] },
    { id: 'zin_dark.75', picture: 'GFX_zin_evt_generic_wilds', options: [{ key: 'a', effect: `add_political_power = ${N.troll_pp}\nadd_equipment_to_stockpile = { type = zin_arms_equipment amount = ${N.troll_arms} }` }] },
    { id: 'zin_dark.85', picture: 'GFX_zin_evt_southern_warning', options: [{ key: 'a' }] },
  ];
  const eventTexts = [];
  for (const e of eventsList) {
    if (!e.hidden && !pictures.has(e.picture)) throw new Error(`Event ${e.id}: picture ${e.picture} is not in the catalog`);
    eventTexts.push(renderEvent(e, T)); defs.events.push(e.id);
  }
  put('events/zin_dark.txt', `${HEADER('mech_dark', SPEC)}\nadd_namespace = zin_dark\n\n${eventTexts.join('\n\n')}`);

  // ------------------------------------------------------------------------------------------------ on_actions and AI
  const runner = tag => `\ton_monthly_${tag} = {\n\t\teffect = {\n\t\t\tif = {\n\t\t\t\tlimit = { zin_dark_is_runner = yes }\n\t\t\t\tzin_dark_pulse = yes\n\t\t\t}\n\t\t}\n\t}`;
  put('common/on_actions/zin_dark.txt', `${HEADER('mech_dark', SPEC)}
# on_startup is not run on a country, and not on a loaded save: the start values are set once. The pulse runs on Goldoroth's month,
# or on Dondor's while Goldoroth is gone (zin_dark_is_runner).
on_actions = {
	on_startup = {
		effect = {
			${GOL} = { country_event = { id = zin_dark.1 } }
		}
	}
${runner(GOL)}
${runner(DON)}
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
  const strat = (id, enable, lines) => `${id} = {\n\tenable = {\n${ind(2, fmt(enable))}\n\t}\n\tabort_when_not_enabled = yes\n${lines.map(([type, tg, v]) => `\tai_strategy = {\n\t\ttype = ${type}\n\t\tid = "${tg}"\n\t\tvalue = ${v}\n\t}`).join('\n')}\n}`;
  // The three free holds the tree courts first (Dulundur, Bordon, Dreson: the tier B holds with the highest start sway after the border bonus).
  const befriend = N.ai_befriend_holds.map(n => darkAll.find(x => x.name === n)?.tag ?? (() => { throw new Error(`ai_befriend_holds names ${n}, not a Dark Lands country`); })());
  const strategies = [
    strat('zin_dark_goldoroth_stance', `original_tag = ${GOL}`, [['antagonize', DON, N.ai_antagonize_dondor], ...befriend.map(t => ['befriend', t, N.ai_befriend]), ...holdTags.map(t => ['influence', t, N.ai_influence])]),
    strat('zin_dark_dondor_ready', `original_tag = ${DON}\n${ge('global.zin_dark_border_tension', N.ai_prepare_tension)}`, [['prepare_for_war', GOL, N.ai_prepare_value]]),
    // At war, the defiant holds first; on the Black Iron route after Volgan marches, the sworn holds.
    ...holdTags.map(t => strat(`zin_dark_goldoroth_defiant_${t.toLowerCase()}`, `original_tag = ${GOL}\nzin_goldoroth_war_open = yes\n${t} = { has_country_flag = zin_dark_refused_yoke }`, [['conquer', t, N.ai_conquer_defiant]])),
    ...swayTags.map(t => strat(`zin_dark_goldoroth_conquer_${t.toLowerCase()}`, `original_tag = ${GOL}\nhas_country_flag = zin_goldoroth_no_masters\nhas_global_flag = zin_volgan_marches\n${t} = { check_variable = { zin_volgan_pact > 2.99 } }`, [['conquer', t, N.ai_conquer_sworn]])),
  ];
  put('common/ai_strategy/zin_dark.txt', [HEADER('mech_dark', SPEC), ...strategies].join('\n\n'));
  defs.aiStrategies.push('zin_dark_goldoroth_stance', 'zin_dark_dondor_ready', ...holdTags.map(t => `zin_dark_goldoroth_defiant_${t.toLowerCase()}`), ...swayTags.map(t => `zin_dark_goldoroth_conquer_${t.toLowerCase()}`));
  return { eventsList, byCat, decisionsList };
}
