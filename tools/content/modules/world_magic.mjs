// Magic and world systems (docs/specs/03_gameplay/04_magic_and_world_systems.md; the wizard hook of docs/lore/references/magic_and_wizards.md 5.2).
//   await buildWorldMagic(staged, { countries })   after the mechanic slices whose names it reads (Glo, the journey, the elves, Afrit) and the
//                                                   war events; before the world tension module, whose zin_world_add_gathering_dark it calls.
// Writes the world layer of magic, which every other system obeys:
//   common/script_constants/zin_world_magic.txt        tuning (data/world_magic.json)
//   common/scripted_triggers/zin_world_magic.txt       zin_has_potent_magic, zin_world_is_dragon_keeper, the roosts, the wall, the storms
//   common/scripted_effects/zin_world_magic.txt        zin_world_raise_varners_wards, zin_world_grant_new_gods_gift, zin_world_give_dragon (arg to),
//                                                      the weekly magic tick and its pulses (storms, the mountain, the wall)
//   common/ideas/zin_world_magic.txt                   the wards, the shelter, the Gods' Gift, Storm-Girt Coasts, the Wall's repairs, Bastian's counsel
//   common/dynamic_modifiers/zin_world_magic.txt       the heat of the Ember Lands and the deep heat of the Nether and the Abyss
//   common/decisions/zin_world_magic.txt (+ category)  the Dragon Pact, Bound by Corruption, the Wall Watch, A Letter to Bastian
//   common/on_actions/zin_world_magic.txt              on_startup (the pool, the coasts, the heat, the first tick), on_annex (the tick's runner)
//   common/ai_strategy/zin_world_magic.txt             every realm outside the Ember Lands avoids the storm seas (data/storm_seas.json)
//   events/zin_world_magic.txt                         namespace zin_world, ids 30 to 69 (the world tension module's file holds 1 to 29)
//   interface/zz_zin_world_magic.gfx                   decision and category pictures from the icon catalog
//   localisation/english/zin_world_magic_l_english.yml
// The weekly tick is one self-scheduling hidden event (zin_world.30) on one runner country, never an every-country on_weekly: the runner is
// picked from data/world_magic.json "runners", and an annexed runner hands the chain to its annexer (on_annex, zin_world.31). Every fourth
// week it runs the monthly steps (the mountain, the wall, Eindil's reserved dragon, the storm warning and the story AI's monthly rules).
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { assertModifiers } from '../lib/core.mjs';
import { ZIN } from '../lib/paths.mjs';
import { Loc, hdr, format, blk, list, num, writeEvent, writeDecision, category, Sprites, loadCatalogKeys, secrecyLeaks, wordProblems, notCp1252 } from '../lib/mech_court_lib.mjs';
import { focusId } from '../lib/focus_model.mjs';

const SPEC = 'docs/specs/03_gameplay/04_magic_and_world_systems.md';
const MOD = 'world_magic';
export const MAGIC_DATA = new URL('../data/world_magic.json', import.meta.url);
export const STORM_DATA = new URL('../data/storm_seas.json', import.meta.url);
export const loadMagicData = async () => JSON.parse(await readFile(MAGIC_DATA, 'utf8'));
export const loadStormSeas = async () => JSON.parse(await readFile(STORM_DATA, 'utf8'));

const gte = (v, n) => `check_variable = { var = ${v} value = ${num(n)} compare = greater_than_or_equals }`;
const tip = (key, trigger) => `custom_trigger_tooltip = {\ntooltip = ${key}\n${trigger}\n}`;
// production_speed_<Building>_factor is one documented template (modifiers_documentation.md); the other keys are checked one by one.
async function checkModifiers(where, mods) {
  const plain = Object.fromEntries(Object.entries(mods).filter(([k]) => !/^production_speed_[a-z_]+_factor$/.test(k) || k === 'production_speed_buildings_factor'));
  await assertModifiers(where, plain);
}

// The ids of the files whose names mark the Abyss (the key-sites spec: "the state whose name contains Abyss").
async function abyssStates(zin) {
  const out = [];
  for (const f of (await readdir(path.join(zin, 'history/states'))).filter(n => n.endsWith('.txt'))) if (/\bAbyss\b/.test(f)) out.push(Number(f.split('-')[0]));
  return out.filter(Number.isInteger).sort((a, b) => a - b);
}

export function magicScripts(D, T) {
  const triggers = new Map(), effects = new Map();
  const M = 'zin_world_magic';
  // ------------------------------------------------------------------------------------------- triggers
  triggers.set('zin_has_potent_magic', `# Potent magic (rule 1 of the six rules of magic): only Glo carried by the worthy, Lorien's ride (the flag zin_potent_magic, set by
# zin_mistake.22 alone) and Varner's wards on Eindil's host. No technology, unit, focus, spell or decision outside this list counts.
OR = {
zin_glo_is_bearer_host = yes
has_country_flag = zin_potent_magic
has_idea = zin_world_varners_wards
}`);
  triggers.set('zin_world_dragon_mountain_state', `# State scope: Dragon Mountain, the capital state of ${D.dragonMountainRealm} in the roster (the map gives it to the nearest elven realm, K2).\nstate = ${T.mountain}`);
  triggers.set('zin_world_is_dragon_keeper', `# The Keeper: the realm that owns the Dragon Mountain state.\nowns_state = ${T.mountain}`);
  triggers.set('zin_world_roosts_free', `# The pool is open only while an elven realm owns Dragon Mountain; under anyone else it freezes ("The Mountain Wakes").\n${T.mountain} = {\nowner = { has_country_flag = zin_people_elves }\n}`);
  triggers.set('zin_world_is_elven_magical', '# An elven realm of the Magical Lands: who may ask the roosts for a Pact.\nzin_elves_is_magical_realm = yes\nhas_country_flag = zin_people_elves');
  triggers.set('zin_world_pact_cheap', `# The Keeper pays less when the roosts trust it: the bond at ${D.pact.keeperBond} or more, or the Magical Forest's old pact.
zin_world_is_dragon_keeper = yes
OR = {
${gte('global.zin_elves_roost_bond', D.pact.keeperBond)}
has_country_flag = zin_magical_forest_old_pact
}`);
  triggers.set('zin_world_pact_trusted', `# The Keeper, or a realm the Keeper likes (opinion ${D.pact.opinion} or more) while the roost bond is ${D.pact.bond} or more ("the dragons will not come for strangers").
OR = {
zin_world_is_dragon_keeper = yes
AND = {
${gte('global.zin_elves_roost_bond', D.pact.bond)}
any_country = {
zin_world_is_dragon_keeper = yes
ROOT = { has_opinion = { target = PREV value > ${D.pact.opinion - 1} } }
}
}
}`);
  triggers.set('zin_world_corruption_open', `# A Keeper the false god's friends can reach: ${D.corrupt.footholds} footholds or more there, or ${D.corrupt.footholdsRestless} while the bond is below ${D.corrupt.restlessBond} ("The Roosts Are Restless"), and the roosts unguarded.
any_country = {
zin_world_is_dragon_keeper = yes
NOT = { has_country_flag = zin_elves_roosts_guarded }
OR = {
${gte('zin_footholds', D.corrupt.footholds)}
AND = {
${gte('zin_footholds', D.corrupt.footholdsRestless)}
check_variable = { global.zin_elves_roost_bond < ${D.corrupt.restlessBond} }
}
}
}`);
  triggers.set('zin_world_storm_spared', '# Ember Lands realms know the waters of the storm belt and are spared its pulse.\nhas_country_flag = zin_region_ember_lands');
  triggers.set('zin_world_wall_threatened', '# The holder of the Great Wall is at war with a realm that borders a wall state.\nany_enemy_country = {\nany_owned_state = {\nany_neighbor_state = { zin_is_site_great_wall = yes }\n}\n}');

  // ------------------------------------------------------------------------------------------- effects
  const host = body => `if = {\nlimit = { has_variable = global.zin_eindil_host }\nvar:global.zin_eindil_host = {\n${body}\n}\n}\nelse = {\n${body}\n}`;
  effects.set('zin_world_raise_varners_wards', `# Varner's wards rise once (zin_varner_wards_raised blocks a second call; rule 5). Eindil's host (global.zin_eindil_host, else this scope)
# takes the wards for ${D.spirits.zin_world_varners_wards.days} days and counts as having potent magic; every other realm at war with Zol's Mistake on the host's side takes the
# shelter (not potent) and the report zin_world.40. zin_eindil.97 tells the host itself.
if = {
limit = { NOT = { has_global_flag = zin_varner_wards_raised } }
set_global_flag = zin_varner_wards_raised
${host(`add_timed_idea = { idea = zin_world_varners_wards days = ${D.spirits.zin_world_varners_wards.days} }
set_country_flag = zin_world_ward_host
every_country = {
limit = {
NOT = { has_country_flag = zin_world_ward_host }
has_war_together_with = PREV
any_enemy_country = { zin_is_zol = yes }
}
add_timed_idea = { idea = zin_world_varners_shelter days = ${D.spirits.zin_world_varners_shelter.days} }
country_event = { id = zin_world.40 }
}
clr_country_flag = zin_world_ward_host`)}
}`);
  effects.set('zin_world_grant_new_gods_gift', `# The New Gods restore Eindil once (rule 5): only while he bears Glo himself (zin_glo_state 1), never a second bearer, never twice. The journey
# sets zin_eindil_restored before the call, so the gift keeps its own once-flag. The host (global.zin_eindil_host, else this scope) takes The
# Gods' Gift for ${D.spirits.zin_world_new_gods_gift.days} days and the report zin_world.45 comes from the journey's zin_eindil.98.
if = {
limit = {
NOT = { has_global_flag = zin_world_gods_gift_given }
check_variable = { global.zin_glo_state = 1 }
}
set_global_flag = zin_world_gods_gift_given
${host(`add_timed_idea = { idea = zin_world_new_gods_gift days = ${D.spirits.zin_world_new_gods_gift.days} }`)}
}`);
  effects.set('zin_world_give_dragon', `# Argument zin_arg_to (a country). Takes one dragon from the pool of Dragon Mountain (global.zin_dragons_free, never refilled in the
# Fourth Age) and hands it to warfare's zin_war_grant_dragons in that country. Does nothing when the pool is empty. The callers count their
# own Pacts and bindings.
set_temp_variable = { zin_to = zin_arg_to }
clear_variable = zin_arg_to
if = {
limit = { check_variable = { global.zin_dragons_free > 0 } }
add_to_variable = { global.zin_dragons_free = -1 }
var:zin_to = {
set_temp_variable = { zin_arg_amount = 1 }
zin_war_grant_dragons = yes
}
}`);
  const pulse = (share, extra) => T.seas.map(id => `damage_units = {\nregion = ${id}\nnavy = yes\nstr_damage = ${num(D.storms.str * share)}\norg_damage = ${num(D.storms.org * share)}\nratio = yes\nlimit = {\nNOT = { zin_world_storm_spared = yes }\n${extra}\n}\n}`).join('\n');
  effects.set('zin_world_storm_pulse', `# The storm belt (data/storm_seas.json, sea regions ${T.seas.join(', ')}): every week a fleet of a realm outside the Ember Lands loses strength
# and organisation there; storm rigging halves the loss.
${pulse(1, `NOT = { has_tech = ${D.storms.tech} }`)}
${pulse(D.storms.riggingShare, `has_tech = ${D.storms.tech}`)}`);
  effects.set('zin_world_mountain_pulse', `# The Mountain Wakes: while a realm that is not elven owns Dragon Mountain, the pool is frozen and the companies of non-elven realms on the
# mountain lose strength every month; the owner hears of it once (zin_world.56).
if = {
limit = { NOT = { zin_world_roosts_free = yes } }
damage_units = {
state = ${T.mountain}
army = yes
str_damage = ${num(D.mountain.str)}
ratio = yes
limit = { NOT = { has_country_flag = zin_people_elves } }
}
${T.mountain} = {
owner = {
if = {
limit = { NOT = { has_country_flag = zin_world_mountain_woke } }
set_country_flag = zin_world_mountain_woke
country_event = { id = zin_world.56 }
}
}
}
}`);
  const cap = D.wall.perStateCap;
  const count = Array.from({ length: cap }, (_, i) => `if = {\nlimit = {\nPREV = {\nmeta_trigger = {\ntext = { divisions_in_state = { state = [S] size > ${i} } }\nS = "[?zin_w_id]"\n}\n}\n}\nadd_to_temp_variable = { zin_w_men = 1 }\n}`).join('\n');
  effects.set('zin_world_wall_month', `# The Great Wall (zin_is_site_great_wall states). The holder is the realm that owns most wall states (country flag zin_world_wall_holder,
# global event target zin_world_wall_holder). The Wall Unmanned (zin_world.59, at most every ${D.wall.unmannedRepeatDays} days): the holder is at war with a realm that
# borders a wall state and keeps fewer companies in wall states than half their number (each state counts up to ${cap}). The Wall Is
# Breached (zin_world.60, once per war): the holder's enemies control ${D.wall.breachStates} or more of its wall states; the Gathering Dark rises by
# ${D.wall.breachGd} and the holder takes The Wall Has Fallen for ${D.wall.breachStabilityDays} days.
if = {
limit = { has_event_target = zin_world_wall_holder }
event_target:zin_world_wall_holder = { clr_country_flag = zin_world_wall_holder }
}
clear_global_event_target = zin_world_wall_holder
set_temp_variable = { zin_w_best = 0 }
every_country = {
limit = { any_owned_state = { zin_is_site_great_wall = yes } }
set_temp_variable = { zin_w_n = 0 }
every_owned_state = {
limit = { zin_is_site_great_wall = yes }
add_to_temp_variable = { zin_w_n = 1 }
}
if = {
limit = { check_variable = { zin_w_n > zin_w_best } }
set_temp_variable = { zin_w_best = zin_w_n }
save_global_event_target_as = zin_world_wall_holder
}
}
if = {
limit = { has_event_target = zin_world_wall_holder }
event_target:zin_world_wall_holder = {
set_country_flag = zin_world_wall_holder
if = {
limit = { has_war = no }
clr_country_flag = zin_world_wall_breached
}
if = {
limit = {
zin_world_wall_threatened = yes
NOT = { has_country_flag = zin_world_wall_unmanned_told }
}
set_temp_variable = { zin_w_total = 0 }
set_temp_variable = { zin_w_men = 0 }
every_owned_state = {
limit = { zin_is_site_great_wall = yes }
add_to_temp_variable = { zin_w_total = 1 }
set_temp_variable = { zin_w_id = THIS }
${count}
}
multiply_temp_variable = { zin_w_total = 0.5 }
if = {
limit = { check_variable = { zin_w_men < zin_w_total } }
set_country_flag = { flag = zin_world_wall_unmanned_told value = 1 days = ${D.wall.unmannedRepeatDays} }
country_event = { id = zin_world.59 }
}
}
if = {
limit = { NOT = { has_country_flag = zin_world_wall_breached } }
set_temp_variable = { zin_w_lost = 0 }
every_owned_state = {
limit = {
zin_is_site_great_wall = yes
NOT = { is_controlled_by = PREV }
}
add_to_temp_variable = { zin_w_lost = 1 }
}
if = {
limit = { ${gte('zin_w_lost', D.wall.breachStates)} }
set_country_flag = zin_world_wall_breached
add_timed_idea = { idea = zin_world_wall_fallen days = ${D.wall.breachStabilityDays} }
set_temp_variable = { zin_arg_value = ${D.wall.breachGd} }
zin_world_add_gathering_dark = yes
country_event = { id = zin_world.60 }
}
}
}
}`);
  effects.set('zin_world_magic_month', `# The monthly steps of the magic tick: the mountain, the wall, Eindil's reserved dragon (the Keeper's Pact with the journey takes one dragon
# from the pool when zin_eindil_dragon_pact is set), the storm warning, then the story AI's monthly rules (modules/story_ai.mjs).
zin_world_mountain_pulse = yes
zin_world_wall_month = yes
if = {
limit = {
has_global_flag = zin_eindil_dragon_pact
NOT = { has_global_flag = zin_world_eindil_dragon_reserved }
}
set_global_flag = zin_world_eindil_dragon_reserved
if = {
limit = { check_variable = { global.zin_dragons_free > 0 } }
add_to_variable = { global.zin_dragons_free = -1 }
}
}
every_country = {
limit = {
NOT = { zin_world_storm_spared = yes }
NOT = { has_country_flag = zin_world_storms_told }
has_navy_size = { size > 0 }
any_enemy_country = {
zin_world_storm_spared = yes
any_owned_state = { is_coastal = yes }
}
}
set_country_flag = zin_world_storms_told
country_event = { id = zin_world.65 }
}
zin_story_ai_month = yes`);
  effects.set('zin_world_magic_tick', `# The magic tick (spec, "The world tick": the weekly pulses): once a week on the runner; the timed flag zin_world_tick_week keeps a second chain
# from running twice. Every ${D.monthWeeks}th week it runs zin_world_magic_month.
if = {
limit = { NOT = { has_global_flag = zin_world_tick_week } }
set_global_flag = { flag = zin_world_tick_week value = 1 days = ${D.tickGuardDays} }
zin_world_storm_pulse = yes
add_to_variable = { global.zin_world_magic_week = 1 }
if = {
limit = { ${gte('global.zin_world_magic_week', D.monthWeeks)} }
set_variable = { global.zin_world_magic_week = 0 }
zin_world_magic_month = yes
}
zin_world_schedule_magic_tick = yes
}`);
  effects.set('zin_world_schedule_magic_tick', `# Picks the runner of the next week (the first country of data/world_magic.json "runners" that exists, else the realm with the most states)
# and schedules zin_world.30 there in ${D.tickDays} days. The runner carries the country flag zin_world_magic_runner, which on_annex reads.
if = {
limit = { has_event_target = zin_world_magic_runner }
event_target:zin_world_magic_runner = { clr_country_flag = zin_world_magic_runner }
}
clear_global_event_target = zin_world_magic_runner
${T.runners.map((tag, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { country_exists = ${tag} }\n${tag} = { save_global_event_target_as = zin_world_magic_runner }\n}`).join('\n')}
else = {
set_temp_variable = { zin_w_best = 0 }
every_country = {
if = {
limit = { check_variable = { num_of_controlled_states > zin_w_best } }
set_temp_variable = { zin_w_best = num_of_controlled_states }
save_global_event_target_as = zin_world_magic_runner
}
}
}
if = {
limit = { has_event_target = zin_world_magic_runner }
event_target:zin_world_magic_runner = {
set_country_flag = zin_world_magic_runner
country_event = { id = zin_world.30 days = ${D.tickDays} }
}
}`);
  return { triggers, effects };
}

function magicDecisions(D, T, loc, sprites) {
  const AI = magicAi(D, T);
  const pact = D.decisions.zin_world_dragon_pact, corrupt = D.decisions.zin_world_corrupt_dragon, watch = D.decisions.zin_world_wall_watch, letter = D.decisions.zin_world_send_for_bastian;
  const tt = (key, text) => { loc.set(key, text); return key; };
  const out = [];
  out.push(writeDecision({
    id: 'zin_world_dragon_pact', title: pact.title, desc: pact.desc, icon: pact.icon,
    visible: 'zin_world_is_elven_magical = yes',
    available: list(
      tip(tt('zin_world_tt_pool', 'Dragon Mountain still has a dragon to give'), 'check_variable = { global.zin_dragons_free > 0 }'),
      tip(tt('zin_world_tt_roosts_free', 'An elven realm holds Dragon Mountain'), 'zin_world_roosts_free = yes'),
      tip(tt('zin_world_tt_pact_limit', `We have made fewer than ${D.pact.max} Dragon Pacts`), `check_variable = { zin_world_dragon_pacts < ${D.pact.max} }`),
      tip(tt('zin_world_tt_pact_trusted', `We hold the roosts, or their keeper likes us (opinion ${D.pact.opinion} or more) and the roosts trust the elves (bond ${D.pact.bond} or more)`), 'zin_world_pact_trusted = yes'),
      tip(tt('zin_world_tt_pact_need', `We fight a dark power or the eastern threat, or the Gathering Dark is at ${D.pact.dark} or more`), `OR = {\nzin_elves_dragon_need = yes\n${gte('global.zin_gathering_dark', D.pact.dark)}\n}`),
    ),
    costTrigger: `OR = {\nAND = {\nzin_world_pact_cheap = yes\nhas_political_power > ${D.pact.costKeeper - 1}\n}\nhas_political_power > ${D.pact.cost - 1}\n}`, costText: pact.costText,
    effect: list(
      `if = {\nlimit = { zin_world_pact_cheap = yes }\nadd_political_power = -${D.pact.costKeeper}\n}\nelse = {\nadd_political_power = -${D.pact.cost}\n}`,
      'set_temp_variable = { zin_arg_to = ROOT }', 'zin_world_give_dragon = yes', 'add_to_variable = { zin_world_dragon_pacts = 1 }', 'set_country_flag = zin_war_dragon_pact',
    ),
    ai: AI.zin_world_ai_dragon_pact,
  }, loc, sprites));
  out.push(writeDecision({
    id: 'zin_world_corrupt_dragon', title: corrupt.title, desc: corrupt.desc, icon: corrupt.icon,
    visible: 'OR = {\nzin_afrit_rules_here = yes\nzin_afrit_is_hub = yes\n}\nhas_global_flag = zin_afrit_revealed',
    available: list(
      tip('zin_world_tt_pool', 'check_variable = { global.zin_dragons_free > 0 }'),
      tip('zin_world_tt_roosts_free', 'zin_world_roosts_free = yes'),
      tip(tt('zin_world_tt_corrupt_limit', `We have bound fewer than ${D.corrupt.max} dragons`), `check_variable = { zin_world_corrupted_dragons < ${D.corrupt.max} }`),
      tip(tt('zin_world_tt_corrupt_open', `Our friends hold ${D.corrupt.footholds} footholds in the keeper's realm (${D.corrupt.footholdsRestless} while the roosts are restless), and the roosts are unguarded`), 'zin_world_corruption_open = yes'),
    ),
    cost: D.corrupt.cost,
    effect: list(
      `random_country = {\nlimit = { zin_world_is_dragon_keeper = yes }\nset_temp_variable = { zin_arg_value = -${D.corrupt.footholdCost} }\nzin_afrit_add_footholds = yes\n}`,
      'set_temp_variable = { zin_arg_to = ROOT }', 'zin_world_give_dragon = yes', 'add_to_variable = { zin_world_corrupted_dragons = 1 }',
      '# The elves spec\'s hook, once for this dragon; it counts the binding as seen, so the elves runner does not call it again.', 'zin_elves_on_dragon_corrupted = yes',
      `set_temp_variable = { zin_arg_value = ${D.corrupt.gd} }`, 'zin_world_add_gathering_dark = yes', 'news_event = { id = zin_world.50 }',
    ),
    ai: AI.zin_world_ai_corrupt_dragon,
  }, loc, sprites));
  out.push(writeDecision({
    id: 'zin_world_wall_watch', title: watch.title, desc: watch.desc, icon: watch.icon,
    visible: 'has_country_flag = zin_world_wall_holder',
    cost: D.wall.watchCost, cooldown: D.wall.watchCooldown,
    effect: `add_timed_idea = { idea = zin_world_wall_repairs days = ${D.wall.watchDays} }`,
    ai: AI.zin_world_ai_wall_watch,
  }, loc, sprites));
  out.push(writeDecision({
    id: 'zin_world_send_for_bastian', title: letter.title, desc: letter.desc, icon: letter.icon,
    visible: 'has_country_flag = zin_region_middle_lands\nNOT = { has_global_flag = zin_world_bastian_called }',
    available: tip(tt('zin_world_tt_bastian_free', 'Bastian has answered no other realm\'s call'), 'NOT = { has_global_flag = zin_world_bastian_called }'),
    effect: 'set_global_flag = zin_world_bastian_called\ncountry_event = { id = zin_world.35 days = 30 }',
    ai: AI.zin_world_ai_bastian,
  }, loc, sprites));
  return out;
}

// The AI weights of the four decisions (the spec's AI section), as ai_will_do bodies keyed by name. They are written inline in each decision,
// not read through mtth:, so the probability tools evaluate the real weights.
function magicAi(D, T) {
  const A = D.ai;
  const entries = [
    `# The Dragon Pact (spec, AI): an elven realm asks when a dark power holds one of its states, or when the Gathering Dark is at ${D.pact.aiDark}.
# Under the historical path the Magical Forest's Pact of 4A 1755 is its focus Wings Over the Woods: it never takes the decision before that
# focus, nor in the ${A.pactFocusWait} days after the focus's Pact.
zin_world_ai_dragon_pact = {
base = ${A.pactBase}
modifier = {
add = ${A.pactWar}
any_enemy_country = {
zin_diplo_is_dark_power = yes
any_controlled_state = { is_owned_by = ROOT }
}
}
modifier = {
add = ${A.pactDark}
${gte('global.zin_gathering_dark', D.pact.aiDark)}
}
modifier = {
factor = 0
zin_rules_is_historical = yes
original_tag = ${T.forest}
OR = {
NOT = { has_completed_focus = ${T.wingsFocus} }
NOT = { has_country_flag = { flag = zin_war_dragon_pact days > ${A.pactFocusWait} } }
}
}
}`,
    `# Bound by Corruption (spec, AI): the false god's realm binds one dragon after the reveal and a second once he is King of the East.
zin_world_ai_corrupt_dragon = {
base = 0
modifier = {
add = ${A.corruptBase}
check_variable = { zin_world_corrupted_dragons < 1 }
}
modifier = {
add = ${A.corruptBase}
has_global_flag = zin_afrit_king_of_east
check_variable = { zin_world_corrupted_dragons < 2 }
}
}`,
    `# The Wall Watch (spec, AI): the holder of the Wall takes it whenever it is at war with a realm that borders a wall state.
zin_world_ai_wall_watch = {
base = ${A.watchBase}
modifier = {
add = ${A.watchWar}
zin_world_wall_threatened = yes
}
}`,
    `# A Letter to Bastian (magic_and_wizards.md 5.1: AI weights stay low): a Middle Lands court sends for him only once the Gathering Dark
# is at ${D.bastian.aiDark} or more, so no AI spends the one call in the quiet years.
zin_world_ai_bastian = {
base = 0
modifier = {
add = ${D.bastian.aiBase}
${gte('global.zin_gathering_dark', D.bastian.aiDark)}
}
}`,
  ];
  // "# comment ... \nname = {\n<body>\n}" becomes { name: "# comment ...\n<body>" }.
  return Object.fromEntries(entries.map(e => {
    const m = /^((?:#.*\n)*)([a-z_]+) = \{\n([\s\S]*)\n\}$/.exec(e);
    if (!m) throw new Error(`world_magic: malformed AI entry ${e.slice(0, 60)}`);
    return [m[2], `${m[1]}${m[3]}`];
  }));
}

export async function buildWorldMagic(staged, ctx) {
  const D = ctx.data ?? await loadMagicData();
  const storm = ctx.storm ?? await loadStormSeas();
  const roster = ctx.countries;
  const byName = new Map(roster.map(c => [c.name, c]));
  const need = n => { const c = byName.get(n); if (!c) throw new Error(`world_magic: ${n} is not in the roster`); return c; };
  const forestTree = JSON.parse(await readFile(path.join(ZIN, 'docs/design/focus/magical_forest.json'), 'utf8'));
  if (!forestTree.focuses.some(f => f.key === 'wings_over_woods')) throw new Error('world_magic: the Magical Forest tree has no focus wings_over_woods');
  const T = {
    mountain: need(D.dragonMountainRealm).capitalState, volgan: need(D.volgan).tag, forest: need('Magical Forest').tag,
    wingsFocus: focusId(forestTree, 'wings_over_woods'), runners: D.runners.map(n => need(n).tag), seas: storm.seas,
    ember: roster.filter(c => c.region === 'ember_lands'), nether: need(D.netherRealm),
  };
  if (!Number.isInteger(T.mountain)) throw new Error('world_magic: Dragon Mountain has no state');
  if (!T.seas.length) throw new Error('world_magic: data/storm_seas.json has no storm sea');
  const { triggers, effects } = magicScripts(D, T);
  const loc = new Loc();

  // Constants: the pool and the numbers the scripts compare at run time.
  const consts = [['pool_start', D.pool.start], ['pact_max', D.pact.max], ['corrupt_max', D.corrupt.max], ['month_weeks', D.monthWeeks]];
  staged.text('common/script_constants/zin_world_magic.txt', format(`${hdr(MOD, SPEC, 'Tuning of the world layer of magic (tools/content/data/world_magic.json). Fixed point.')}\nzin_world_magic = {\nschema = {\nany_key = yes\ndata = fixed_point\n}\n${consts.map(([k, v]) => `${k} = ${num(v)}`).join('\n')}\n}\n`));
  staged.text('common/scripted_triggers/zin_world_magic.txt', format(`${hdr(MOD, SPEC, 'Triggers of the world layer of magic. Country scope unless a comment says otherwise.')}\n${[...triggers].map(([n, b]) => blk(n, b)).join('\n')}\n`));
  staged.text('common/scripted_effects/zin_world_magic.txt', format(`${hdr(MOD, SPEC, 'Effects of the world layer of magic and its weekly tick. Arguments are temporary variables zin_arg_<name> (E1).')}\n${[...effects].map(([n, b]) => blk(n, b)).join('\n')}\n`));

  // Ideas.
  const ideaBlocks = [];
  for (const [id, s] of Object.entries(D.spirits)) {
    await checkModifiers(id, s.modifier);
    loc.set(id, s.name); loc.set(`${id}_desc`, s.desc);
    const targeted = s.targeted ? (await assertModifiers(`${id} (targeted)`, s.targeted.modifier), blk('targeted_modifier', list(`tag = ${need(s.targeted.realm).tag}`, Object.entries(s.targeted.modifier).map(([k, v]) => `${k} = ${num(v)}`)))) : '';
    ideaBlocks.push(blk(id, list(`picture = zin_${s.picture}`, 'allowed = { always = no }', 'allowed_civil_war = { always = yes }', 'removal_cost = -1', blk('modifier', Object.entries(s.modifier).map(([k, v]) => `${k} = ${num(v)}`).join('\n')), targeted)));
  }
  staged.text('common/ideas/zin_world_magic.txt', format(`${hdr(MOD, SPEC, 'The spirits of the world layer of magic: given by its effects, decisions and startup, never by a focus.')}\nideas = {\ncountry = {\n${ideaBlocks.join('\n')}\n}\n}\n`));

  // Dynamic modifiers: the heat.
  const dyn = [];
  for (const [id, h] of Object.entries(D.heat)) {
    await assertModifiers(id, h.modifier);
    loc.set(id, h.name);
    dyn.push(blk(id, list(`icon = GFX_idea_zin_${h.picture}`, 'enable = { always = yes }', Object.entries(h.modifier).map(([k, v]) => `${k} = ${num(v)}`))));
  }
  staged.text('common/dynamic_modifiers/zin_world_magic.txt', format(`${hdr(MOD, SPEC, 'The heat of the Ember Lands (state modifiers given on startup).')}\n${dyn.join('\n')}\n`));

  // Decisions, their category and pictures.
  const sprites = new Sprites(await loadCatalogKeys());
  sprites.decisionPrefix = 'zin_world_';
  const decisions = magicDecisions(D, T, loc, sprites);
  staged.text('common/decisions/zin_world_magic.txt', format(`${hdr(MOD, SPEC, 'The old powers: the Dragon Pact, Bound by Corruption, the Wall Watch and A Letter to Bastian.')}\nzin_world_magic = {\n${decisions.join('\n')}\n}\n`));
  const cat = category('zin_world_magic', { title: D.category.title, desc: D.category.desc, art: D.category.art, priority: 25,
    visible: 'OR = {\nzin_world_is_elven_magical = yes\nzin_afrit_rules_here = yes\nzin_afrit_is_hub = yes\nhas_country_flag = zin_world_wall_holder\nhas_country_flag = zin_region_middle_lands\n}' }, loc, sprites);
  staged.text('common/decisions/categories/zin_world_magic.txt', format(`${hdr(MOD, SPEC, 'The category of the old powers.')}\n${cat}\n`));
  staged.text('interface/zz_zin_world_magic.gfx', sprites.text(hdr(MOD, SPEC, 'Decision and category pictures of the old powers: icon catalog pictures until the art pass draws their own. Loaded after the vanilla files (zz_).')));


  // on_actions: the pool, the coasts, the heat and the first tick; the runner's hand-off on annexation.
  const abyss = await abyssStates(ctx.zin ?? ZIN);
  const deep = new Set([...T.nether.stateIds, ...abyss]);
  const emberStates = [...new Set(T.ember.flatMap(c => c.stateIds))].filter(id => !deep.has(id)).sort((a, b) => a - b);
  staged.text('common/on_actions/zin_world_magic.txt', format(`${hdr(MOD, SPEC, 'on_startup: the dragon pool, Storm-Girt Coasts on the Ember Lands realms, the heat on their states (the Nether and the Abyss carry the deep heat) and the first magic tick. on_annex: an annexed runner hands the tick to its annexer.')}
on_actions = {
on_startup = {
effect = {
set_variable = { global.zin_dragons_free = constant:zin_world_magic.pool_start }
set_variable = { global.zin_world_magic_week = 0 }
${T.ember.map(c => `if = {\nlimit = { country_exists = ${c.tag} }\n${c.tag} = { add_ideas = zin_world_storm_coasts }\n}`).join('\n')}
${emberStates.map(id => `${id} = { add_dynamic_modifier = { modifier = zin_world_ember_lands_heat } }`).join('\n')}
${[...deep].sort((a, b) => a - b).map(id => `${id} = { add_dynamic_modifier = { modifier = zin_world_deep_heat } }`).join('\n')}
zin_world_schedule_magic_tick = yes
}
}
on_annex = {
effect = {
if = {
limit = { FROM = { has_country_flag = zin_world_magic_runner } }
FROM = { clr_country_flag = zin_world_magic_runner }
ROOT = {
set_country_flag = zin_world_magic_runner
save_global_event_target_as = zin_world_magic_runner
country_event = { id = zin_world.31 days = 1 }
}
}
}
}
}
`));

  // AI: the storm seas.
  staged.text('common/ai_strategy/zin_world_magic.txt', format(`${hdr(MOD, SPEC, 'Every realm outside the Ember Lands keeps its fleets out of the storm belt (data/storm_seas.json).')}
zin_world_storm_seas = {
allowed = { always = yes }
enable = { NOT = { zin_world_storm_spared = yes } }
abort = { always = no }
${T.seas.map(id => `ai_strategy = {\ntype = naval_avoid_region\nid = ${id}\nvalue = ${D.storms.avoidValue}\n}`).join('\n')}
}
`));

  // Events.
  const evLoc = new Loc();
  const out = [];
  out.push(writeEvent('zin_world', { id: 30, kind: 'hidden', immediate: 'zin_world_magic_tick = yes' }, evLoc, { hiddenOk: 'The week turns.' }).text);
  out.push(writeEvent('zin_world', { id: 31, kind: 'hidden', immediate: `# The runner was annexed: the chain moves to its annexer. If this week's tick has run, the next comes when its guard has lapsed.\nif = {\nlimit = { has_global_flag = zin_world_tick_week }\ncountry_event = { id = zin_world.30 days = ${D.tickGuardDays + 1} }\n}\nelse = {\nzin_world_magic_tick = yes\n}` }, evLoc, { hiddenOk: 'The week turns.' }).text);
  const effectsOf = {
    35: { a: `add_political_power = -${D.bastian.cost}\nadd_timed_idea = { idea = zin_world_bastian_counsel days = ${D.bastian.days} }`, b: '' },
  };
  const aiOf = { 35: { a: 70, b: 30 } };
  for (const [n, e] of Object.entries(D.events).sort(([a], [b]) => Number(a) - Number(b))) {
    const id = Number(n);
    if (id < 30 || id > 69) throw new Error(`world_magic: event ${id} is outside the magic module's range 30 to 69`);
    const options = e.options.map(o => ({ ...o, effect: effectsOf[id]?.[o.key] || undefined, ai: aiOf[id]?.[o.key] ?? (e.options.length === 1 ? 100 : undefined) }));
    if (id === 35) options[0].trigger = `has_political_power > ${D.bastian.cost - 1}`;
    out.push(writeEvent('zin_world', { id, kind: e.kind, title: e.title, desc: e.desc, picture: e.picture, options }, evLoc).text);
  }
  staged.text('events/zin_world_magic.txt', format(`${hdr(MOD, SPEC, 'Namespace zin_world, ids 30 to 69: the magic tick, the wards, the Gods\' Gift, the dragons, the Wall, the storms and Bastian. Ids 1 to 29 are the world tension module\'s events/zin_world.txt (convention C6: one namespace, one module per file).')}\nadd_namespace = zin_world\n\n${out.join('\n\n')}\n`));

  const all = { ...Object.fromEntries(loc.map), ...Object.fromEntries(evLoc.map) };
  const problems = [...secrecyLeaks(all), ...(await wordProblems(all)), ...notCp1252(all)];
  if (problems.length) throw new Error(`world_magic text:\n  ${problems.join('\n  ')}`);
  staged.loc('zin_world_magic', all);
  const events = [30, 31, ...Object.keys(D.events).map(Number)].sort((a, b) => a - b).map(n => `zin_world.${n}`);
  return {
    counts: { triggers: triggers.size, effects: effects.size, ideas: ideaBlocks.length, decisions: decisions.length, events: events.length, seas: T.seas.length, emberStates: emberStates.length, deepStates: deep.size, keys: Object.keys(all).length },
    definitions: { triggers: [...triggers.keys()], effects: [...effects.keys()], ideas: Object.keys(D.spirits), events },
  };
}
