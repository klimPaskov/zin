// Realm life (docs/design/alternate_history.md section 8, G1 to G10; docs/specs/04_mechanics/realm_life.md): the generic systems every
// realm of Aoaz lives by while the story keeps its own moments. Rulers age and die (G1), heirs take the crown or rule through a regency
// (G2), a crown without an heir falls into a crisis (G3), captains reach for the crown (G4), subjects stir and occupied lands rise (G5),
// long wars end in terms (G6), royal houses marry and call on their kin (G7), raiders ride (G8), fallen courts live in exile and come
// home (G9). G10 (the story roles and their news) is the historical path's: modules/historical_path.mjs writes the role registry and
// its news, zin_path.11 to .17, so zin_realm.80 is not written (a second announcement of the same change).
//
//   const realm = await buildRealmLife(staged, { countries, skipped })   // build.mjs, after the courts and before the country package
//     returns { heirRecruits: Map(tag -> [heir ids recruited in the country history]), counts, definitions, eventMeta }
//
// The pulse runs inside the world tick (K34: the owner allows the generic realm systems to visit every country once a month in four
// weekly batches): zin_story_tick, step 9 of zin_world_tick, calls zin_story_tick_realm on the world runner, which runs batch 0 at once
// and schedules zin_realm.1 for batches 1 to 3 seven, fourteen and twenty-one days on. Each batch visits the countries whose
// zin_realm_slot matches (a country without a slot, such as a dynamic tag, runs in batch 0). Nothing here is an every-country on_monthly.
// The pulse runs in the world runner's chain, so ROOT is the runner there: every effect of this file uses THIS and PREV, never ROOT, and
// passes the other party of an event by event target.
//
// Data: tools/content/data/realm_life.json (tuning, lists, ideas, opinions, decisions and the events in the events_mech shape).
// Heirs: the named heirs of data/world/characters (the characters module defines them and recruits none) are recruited in the country
// histories by the country package (build.mjs hands it heirRecruits), never by recruit_character during play
// (docs/plans/zin-errors/r3b_fixes.md, group 5). A realm without a named heir gets the successor the engine names when its ruler dies.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { rng, assertModifiers } from '../lib/core.mjs';
import { Loc, Sprites, loadCatalogKeys, hdr, format, list, blk, num, writeEvent, writeDecision, category, wordProblems, notCp1252, unknownCommands, DATA } from '../lib/mech_court_lib.mjs';
import { renderMechEvents, structureProblems, textProblems } from './events_mech.mjs';
import { loadPictures } from './events_world.mjs';
import { loadCharacterData } from './characters.mjs';
import { stanceIdeology } from './ideologies.mjs';

const MOD = 'realm_life';
const SPEC = 'docs/specs/04_mechanics/realm_life.md';
export const DATA_FILE = 'realm_life.json';
export const LOC_NAME = 'zin_realm_life';
export const FILES = {
  constants: 'common/script_constants/zin_realm.txt',
  triggers: 'common/scripted_triggers/zin_realm_life.txt',
  effects: 'common/scripted_effects/zin_realm_life.txt',
  mtth: 'common/mtth/zin_realm.txt',
  ideas: 'common/ideas/zin_realm_life.txt',
  opinions: 'common/opinion_modifiers/zin_realm_life.txt',
  dynamic: 'common/dynamic_modifiers/zin_realm_life.txt',
  categories: 'common/decisions/categories/zin_realm_court.txt',
  decisions: 'common/decisions/zin_realm_court.txt',
  onActions: 'common/on_actions/zin_realm_life.txt',
  events: 'events/zin_realm.txt',
  gfx: 'interface/zz_zin_realm_life.gfx',
};
// The keys of an event block and the arguments of the engine effects this module writes, besides the documented commands.
const SCRIPT_KEYS = new Set(['immediate', 'is_triggered_only', 'option', 'timeout_days', 'hidden', 'ruling_only', 'promote_leader', 'country_leader', 'expire',
  'hostility_reason', 'targeted_alliance', 'enemy', 'localization', 'size', 'ruling_party', 'ideology', 'scope', 'modifier', 'value', 'decay',
  'attacker', 'defender', 'state', 'random_list', 'TAG', 'integer', 'add_namespace',
  // the keys of a decision block
  'allowed', 'available', 'visible', 'complete_effect', 'cost', 'days_re_enable', 'target_root_trigger', 'target_trigger', 'ai_will_do']);

export async function loadRealmLife() {
  const D = JSON.parse(await readFile(path.join(DATA, DATA_FILE), 'utf8'));
  if (D.kind !== 'realm_life') throw new Error(`${DATA_FILE}: kind must be realm_life`);
  return D;
}

// The customs of succession (Q-87): blood (an ordered line, by blood, age or pact), elective (a moot, a council or a guild chooses; the
// heir is its favoured candidate), contested (the crown is taken in the ring or by the biggest), open (the custom is not told to men).
export const CUSTOMS = ['blood', 'elective', 'contested', 'open'];

// ------------------------------------------------------------------------------------------------ the plan (pure)
// Everything the scripts need about each realm, from the roster and the courts: tier, people rate, the start vigour of its ruler, its
// batch slot, its succession custom, its named heir, its kin class, its land and whether it raids.
export function realmPlan(countries, D, courts = loadCharacterData()) {
  const C = D.constants;
  const byName = new Map(countries.map(c => [c.name, c]));
  const need = n => { const c = byName.get(n); if (!c) throw new Error(`realm_life: ${n} is not in the roster`); return c; };
  const courtOf = new Map(courts.map(r => [r.key, r]));
  const contested = new RegExp(D.succession.contested, 'i'), open = new RegExp(D.succession.open, 'i');
  const storyRealms = new Set(D.storyRulers.realms.map(n => need(n).tag));
  const rows = countries.map((c, i) => {
    const court = courtOf.get(c.key);
    const ruler = court?.ruler ?? {};
    const people = ruler.people && D.people.rate[ruler.people] !== undefined ? ruler.people : c.people;
    const rate = D.people.rate[people];
    // K55, Q-85: the vigour counts the years left in a man's life (men-years); the years left to the people's span times the rate.
    let vigour;
    const life = D.people.lifespanYears[people];
    if (rate !== undefined && ruler.born && life) {
      const years = Math.max(life - (C.start_count - ruler.born), C.start_years_left_min);
      vigour = Math.min(C.vigour_max, Math.round(years * rate * 10) / 10);
    } else {
      const r = rng(`realm_life:vigour:${c.tag}`)();
      vigour = Math.round(C.start_vigour_default_min + r * (C.start_vigour_default_max - C.start_vigour_default_min));
    }
    const heir = court?.heir?.id ? court.heir : null;
    const note = `${court?.heir?.note ?? ''} ${court?.heir?.succession ?? ''}`.trim();
    // The custom of succession (Q-87): an ordered line (blood), a choice (elective), a crown taken (contested) or one men are not told
    // (open). A pre-built heir carries his realm's custom; a court's own named heir means blood unless heirs.json says otherwise.
    const custom = heir?.custom ?? (heir ? 'blood' : contested.test(note) ? 'contested' : open.test(note) ? 'open' : 'elective');
    if (!CUSTOMS.includes(custom)) throw new Error(`realm_life: ${c.name}: unknown custom of succession ${custom}`);
    const heirLife = heir ? D.people.lifespanYears[heir.people ?? people] ?? null : null;
    return {
      tag: c.tag, name: c.name, key: c.key, tier: c.focusTier === 'major' ? 'A' : c.focusTier === 'regional' ? 'B' : 'C', people, rate: rate ?? null,
      vigour, slot: i % C.slot_count, region: c.region, kin: D.people.kinClass[c.people] ?? null, custom, culture: c.culture, heirLife,
      monarchy: D.succession.monarchyForms.includes(c.politicalForm), heir, story: storyRealms.has(c.tag),
    };
  });
  const tags = names => names.map(n => need(n).tag);
  return {
    rows,
    tierA: rows.filter(r => r.tier === 'A').map(r => r.tag), tierB: rows.filter(r => r.tier === 'B').map(r => r.tag),
    raiders: tags(D.raiders.realms), corsairs: tags(D.raiders.styles.corsair), steppe: tags(D.raiders.styles.steppe),
    historicalCourts: tags(D.historicalCourts), storyRealms: [...storyRealms],
    shelterGoldenKing: tags(D.goldenKingShelter),
    aenor: need('Aenor'), worshipdom: need('Worshipdom').tag, volgan: need('Puvulan').tag, zol: need("Zol's Mistake").tag,
    gala: need('Gala').tag, mirolon: need('Mirolon').tag, selen: need('Selen').tag, gunwyn: need('Gunwyn').tag, girdon: need('Girdon').tag, lerendor: need('Lerendor').tag,
    crisisPending: D.crisisPending.map(p => ({ ...p, tag: need(p.realm).tag })),
  };
}

// The named heirs the country histories recruit: heirs the characters module defines itself (not another module's character, not a
// mechanic's figure) in realms whose rulers are not story rulers.
export function heirsToRecruit(plan, skipped = []) {
  const mirrored = new Set(skipped.map(s => s.id ?? s));
  const out = new Map();
  for (const r of plan.rows) if (r.heir && !r.heir.definedBy && !r.heir.recruit && !mirrored.has(r.heir.id) && !r.story) out.set(r.tag, [r.heir.id]);
  return out;
}

// ------------------------------------------------------------------------------------------------ script helpers
const tagOr = (tags, extra = []) => {
  const lines = [...tags.map(t => `original_tag = ${t}`), ...extra];
  if (!lines.length) return 'always = no';
  return lines.length === 1 ? lines[0] : `OR = {\n${lines.join('\n')}\n}`;
};
const rnd = (v, lo, hi) => `set_temp_variable_to_random = { var = ${v} min = ${num(lo)} max = ${num(hi)} integer = yes }`;
const c = k => `constant:zin_realm.${k}`;

export function realmScripts(D, plan, heirs) {
  const C = D.constants;
  const T = {}, E = {};
  const AEN = plan.aenor.tag, PUV = plan.volgan, ZOL = plan.zol, WOR = plan.worshipdom;
  const heirRows = plan.rows.filter(r => heirs.has(r.tag));
  const stances = Object.keys(stanceIdeology);
  const groups = ['democratic', 'fascism', 'communism', 'neutrality'];

  // ---- triggers
  T.zin_realm_tier_a = `# Tier A (the thirteen great powers and lore powers of the tiers spec).\n${tagOr(plan.tierA)}`;
  T.zin_realm_tier_b = `# Tier B (the regional realms).\n${tagOr(plan.tierB)}`;
  T.zin_realm_is_raider = `# G8: the raiding realms of data/realm_life.json.\n${tagOr(plan.raiders)}`;
  T.zin_realm_inherits = `# G2, Q-87: realms whose crown passes in an ordered line (by blood, age or pact; custom blood of data/world/heirs.json and the courts).\n${tagOr(plan.rows.filter(r => r.custom === 'blood').map(r => r.tag))}`;
  T.zin_realm_contested_custom = `# G3: realms whose custom settles the crown by combat (custom contested).\n${tagOr(plan.rows.filter(r => r.custom === 'contested').map(r => r.tag))}`;
  T.zin_realm_open_custom = `# Realms whose custom of succession men are not told (custom open): the heir takes it quietly, or the engine names a successor.\n${tagOr(plan.rows.filter(r => r.custom === 'open').map(r => r.tag))}`;
  T.zin_realm_elective_custom = '# Q-87: realms that choose their ruler (a moot, a council, a guild); the heir is the favoured candidate.\nNOT = { zin_realm_inherits = yes }\nNOT = { zin_realm_contested_custom = yes }\nNOT = { zin_realm_open_custom = yes }';
  T.zin_realm_is_corsair = `# G8, Q-89: the corsair realms, who raid by sea (data/realm_life.json raiders.styles.corsair).\n${tagOr(plan.corsairs)}`;
  T.zin_realm_is_steppe_rider = `# G8, Q-89: the steppe-rider realms, who raid by land and often (raiders.styles.steppe).\n${tagOr(plan.steppe)}`;
  T.zin_realm_is_monarchy = `# G7: the royal houses that make matches (the forms of rule of data/realm_life.json).\n${tagOr(plan.rows.filter(r => r.monarchy).map(r => r.tag))}`;
  T.zin_realm_story_court = `# Courts the chronicle names (their rulers do not die of age on the historical path).\n${tagOr(plan.historicalCourts)}`;
  T.zin_realm_is_story_ruler = list('# G1 to G4 exemption: a canon figure or a story ruler leads, or the realm\'s rulers are a story mechanic\'s (the Aenor court, the Worshipdom,',
    '# Volgan, Zol).', 'OR = {',
    D.storyRulers.characters.map(id => `has_country_leader = { character = ${id} ruling_only = yes }`),
    D.storyRulers.traits.map(t => `has_country_leader_with_trait = ${t}`),
    'zin_aenor_is_realm = yes', [WOR, PUV, ZOL].map(t => `original_tag = ${t}`), '}');
  T.zin_realm_story_pending = list('# Story realms whose beat is pending (data/realm_life.json crisisPending, those with an end): Mirolon\'s watch and Gala\'s court, among others.',
    tagOr([], plan.crisisPending.filter(p => p.until).map(p => `AND = {\n${p.trigger ?? `original_tag = ${p.tag}`}\nNOT = { has_global_flag = ${p.until} }\n}`)));
  T.zin_realm_mortal = list('# G1: the ruler ages. On the historical path tier A rulers and the courts the chronicle names never die of age; a story realm\'s ruler',
    '# never dies of age while its beat is pending.',
    'NOT = { zin_realm_is_story_ruler = yes }', 'NOT = { zin_realm_story_pending = yes }',
    '# NOT is a NOR (wiki, Triggers), so the pair is held in an AND.',
    'NOT = {', 'AND = {', 'zin_rules_is_historical = yes', 'OR = {', 'zin_realm_tier_a = yes', 'zin_realm_story_court = yes', '}', '}', '}');
  T.zin_realm_crisis_allowed = list('# G3, G4: the crown may fall into crisis. Story realms are exempt while their beat is pending; tier A never on the historical path.',
    'NOT = { zin_realm_is_story_ruler = yes }', 'NOT = { has_character = zin_eindil }',
    plan.crisisPending.map(p => {
      const who = p.trigger ?? `original_tag = ${p.tag}`;
      return p.until ? `NOT = {\nAND = {\n${who}\nNOT = { has_global_flag = ${p.until} }\n}\n}` : `NOT = { ${who} }`;
    }),
    'NOT = {', 'AND = {', 'zin_rules_is_historical = yes', 'zin_realm_tier_a = yes', '}', '}');
  T.zin_realm_crisis_may_turn = '# G3 on the historical path: tier B realms settle by election only.\nOR = {\nNOT = { zin_rules_is_historical = yes }\nNOT = { zin_realm_tier_b = yes }\n}';
  T.zin_realm_crown_may_be_contested = list('# G3: a contested crown splits the realm only when it is large enough and a dynamic tag is likely free (the S12 budget, counted here).',
    `num_of_controlled_states > ${C.crisis_min_states - 1}`, 'has_capitulated = no', 'has_civil_war = no',
    `check_variable = { global.zin_realm_contested_crowns < ${num(C.contested_max)} }`);
  T.zin_realm_match_may_reign = '# G3: the house we married into can offer a prince.\nhas_variable = zin_realm_match\nvar:zin_realm_match = {\nexists = yes\nhas_capitulated = no\nNOT = { has_war_with = PREV }\n}';
  T.zin_realm_has_captain = '# G3, G4: the realm has a captain-general to take the crown.\nany_army_leader = { skill > 0 }';
  T.zin_realm_has_named_heir = list('# G2: a named heir of data/world/characters is recruited and does not rule yet.', heirRows.length ? 'OR = {' : 'always = no',
    heirRows.map(r => `AND = {\noriginal_tag = ${r.tag}\nhas_character = ${r.heir.id}\nNOT = { has_country_leader = { character = ${r.heir.id} ruling_only = no } }\n}`), heirRows.length ? '}' : '');
  T.zin_realm_has_heir = '# G2: an heir waits (a named heir, or a kinsman named by the decision Name an Heir).\nOR = {\nzin_realm_has_named_heir = yes\nhas_country_flag = zin_realm_heir_named\n}';
  T.zin_realm_alliance_owned = list('# G6, G7: realms whose bonds a story mechanic owns: the Aenor court and its Concord, Volgan and his sworn realms, the clients of the',
    '# King of the East, the Kindred of the elves, the Worshipdom and Zol.', 'OR = {', 'zin_aenor_is_realm = yes', 'zin_aenor_is_concord_dominion = yes',
    `original_tag = ${PUV}`, `is_subject_of = ${PUV}`, `original_tag = ${ZOL}`, `is_subject_of = ${ZOL}`, `original_tag = ${WOR}`, 'has_country_flag = zin_afrit_eastern_client', 'zin_elves_in_kindred = yes', '}');
  T.zin_realm_bond_owned = list('# G5: subjects whose bond a story mechanic owns (the Concord, the Dominion of Volgan, Zol, and the clients of the East before the false',
    '# god is dead, whose autonomy rule decides).', 'OR = {', 'zin_aenor_is_concord_dominion = yes', `is_subject_of = ${PUV}`, `is_subject_of = ${ZOL}`,
    'OVERLORD = { zin_aenor_is_realm = yes }', 'AND = {', 'has_country_flag = zin_afrit_eastern_client', 'NOT = { has_global_flag = zin_afrit_dead }', '}', '}');
  T.zin_realm_story_war_side = list('# G6: a party whose wars a story owner ends (the court of Aenor, the Deliverer\'s seat, the dark powers and their sworn realms, Mirolon,',
    '# Gala, Selen, the Grey Ford pair, Lerendor, the heir\'s host, and the clients of the East while the false god lives).', 'OR = {', 'zin_aenor_is_realm = yes',
    [WOR, PUV, ZOL, plan.mirolon, plan.gala, plan.selen, plan.gunwyn, plan.girdon, plan.lerendor].map(t => `original_tag = ${t}`),
    `is_subject_of = ${PUV}`, `is_subject_of = ${ZOL}`, 'has_character = zin_eindil', 'AND = {', 'has_country_flag = zin_afrit_eastern_client', 'NOT = { has_global_flag = zin_afrit_dead }', '}', '}');
  T.zin_realm_may_pledge = '# G7: the match may be sealed with a guarantee (not where a story mechanic owns the bonds of either house).\nNOT = { zin_realm_alliance_owned = yes }\nevent_target:zin_realm_match_answer = {\nexists = yes\nNOT = { zin_realm_alliance_owned = yes }\n}\nNOT = { has_guaranteed = event_target:zin_realm_match_answer }';
  T.zin_realm_may_answer_kin = '# G7: we can go to war beside our kin.\nhas_capitulated = no\nevent_target:zin_realm_kin_foe = { exists = yes }\nNOT = { has_war_with = event_target:zin_realm_kin_foe }\nNOT = { is_in_faction_with = event_target:zin_realm_kin_foe }';
  T.zin_realm_court_may_flee = list('# G9: the court of THIS realm can go into exile: not on the historical path (story courts only there), not the Aenor court (its own exile',
    '# is the Golden King\'s), not the Deliverer\'s seat, not the dark powers or their sworn realms, and only once.', 'NOT = { zin_rules_is_historical = yes }',
    'NOT = { zin_aenor_is_realm = yes }', `NOT = { original_tag = ${WOR} }`, `NOT = { original_tag = ${PUV} }`, `NOT = { original_tag = ${ZOL} }`,
    `NOT = { is_subject_of = ${PUV} }`, `NOT = { is_subject_of = ${ZOL} }`, 'NOT = { has_country_flag = zin_realm_court_in_exile }', 'NOT = { has_country_flag = zin_realm_court_dispersed }');
  T.zin_realm_may_marry = `# G7: a people that makes royal matches.\nOR = {\n${[...new Set(Object.values(D.people.kinClass))].map(k => `has_country_flag = zin_realm_kin_${k}`).join('\n')}\n}`;

  // ---- the pulse
  const days = D.batch.days;
  E.zin_story_tick_realm = list('# Step 9 of the world tick (zin_story_tick, convention C6) on the world runner: batch 0 now, batches 1 to 3 seven, fourteen and twenty-one',
    '# days on (K34). The runner may change next month; a batch queued on a runner that is annexed meanwhile is lost for that month.',
    'set_variable = { global.zin_realm_batch = 0 }', 'zin_realm_run_batch = yes', days.map(d => `country_event = { id = zin_realm.1 days = ${d} }`));
  E.zin_realm_run_batch = list('# One weekly batch: the Golden King\'s court is housed if it waits, then every country of this batch\'s slot has its pulse.',
    'if = {', 'limit = {', 'has_global_flag = zin_golden_king_exiled', 'NOT = { has_global_flag = zin_realm_gk_court }', '}', 'zin_realm_house_golden_king = yes', '}',
    'every_country = {', 'limit = { check_variable = { zin_realm_slot = global.zin_realm_batch } }', 'zin_realm_pulse = yes', '}');
  E.zin_realm_pulse = list('# The monthly pulse of one realm (THIS; ROOT is the world runner).',
    'zin_realm_note_ruler = yes',
    'if = { limit = { zin_realm_mortal = yes } zin_realm_age_ruler = yes }',
    'if = {', 'limit = {', 'zin_realm_mortal = yes', 'zin_realm_has_named_heir = yes', '}', 'zin_realm_check_heir = yes', '}',
    'zin_realm_tick_regency = yes',
    'if = {', 'limit = {', 'NOT = { zin_rules_is_historical = yes }', 'zin_realm_crisis_allowed = yes', '}', 'zin_realm_check_ambition = yes', '}',
    'if = {', 'limit = {', 'is_subject = yes', 'NOT = { zin_rules_is_historical = yes }', '}', 'zin_realm_check_subject = yes', '}',
    'zin_realm_check_risings = yes',
    'if = { limit = { has_war = yes } zin_realm_check_war = yes }', 'else = { set_variable = { zin_realm_war_months = 0 } }',
    'if = { limit = { has_variable = zin_realm_match } zin_realm_check_kinship = yes }',
    'if = { limit = { zin_realm_is_raider = yes } zin_realm_check_raid = yes }',
    'if = { limit = { has_variable = zin_realm_exile_court } zin_realm_check_exiles = yes }');

  // ---- G1 rulers' years
  E.zin_realm_note_ruler = list('# G1: a ruler the pulse has not seen (a successor of any kind, a usurper, a ruler a focus or a story owner raised) gets a fresh vigour',
    '# in years (K55, Q-85), unless the crowned heir\'s own years gave it (zin_realm_vigour_given), and, when the start variety is not off, a temper',
    '# (zin_variety_temper_new_ruler).',
    'set_temp_variable = { zin_t_new = 0 }',
    'random_character = {', 'limit = {', 'is_country_leader = yes', 'NOT = { has_character_flag = zin_realm_known }', '}', 'set_character_flag = zin_realm_known', 'set_temp_variable = { zin_t_new = 1 }', '}',
    'if = {', 'limit = {', 'OR = {', 'check_variable = { zin_t_new = 1 }', 'NOT = { has_variable = zin_ruler_vigour }', '}', '}',
    'if = {', 'limit = { has_country_flag = zin_realm_vigour_given }', 'clr_country_flag = zin_realm_vigour_given', '}',
    'else = {', rnd('zin_t_v', C.new_ruler_min, C.new_ruler_max), 'set_variable = { zin_ruler_vigour = zin_t_v }', '}',
    'if = { limit = { NOT = { has_variable = zin_ruler_rate } } set_variable = { zin_ruler_rate = constant:zin_realm.rate_default } }',
    'if = {', 'limit = {', 'check_variable = { zin_t_new = 1 }', 'NOT = { zin_realm_is_story_ruler = yes }', '}', 'zin_variety_temper_new_ruler = yes', '}', '}');
  E.zin_realm_age_ruler = list('# G1, K55 (Q-85): rulers age by the year. The vigour counts years of a man\'s life and falls each month by the people rate over the',
    '# months of a year, half as much again at war and again when the war goes badly; at the floor the ruler dies, and below the frail line',
    '# the ruler may die any month (mtth zin_realm_frail_death, in hundredths, times the people rate, so the long-lived linger).',
    'set_temp_variable = { zin_t_wear = 1 }',
    'if = {', 'limit = { has_war = yes }', `add_to_temp_variable = { zin_t_wear = ${c('war_wear')} }`,
    `if = { limit = { surrender_progress > ${num(C.losing_surrender)} } add_to_temp_variable = { zin_t_wear = ${c('losing_wear')} } }`, '}',
    'multiply_temp_variable = { zin_t_wear = zin_ruler_rate }', `divide_temp_variable = { zin_t_wear = ${c('months_per_year')} }`,
    'subtract_from_variable = { zin_ruler_vigour = zin_t_wear }',
    `clamp_variable = { var = zin_ruler_vigour min = 0 max = ${c('vigour_max')} }`,
    `set_temp_variable = { zin_t_floor = ${c('vigour_floor')} }`, `set_temp_variable = { zin_t_frail = ${c('vigour_frail')} }`,
    'if = {', 'limit = { check_variable = { zin_ruler_vigour < zin_t_floor } }', 'zin_realm_succeed = yes', '}',
    'else_if = {', 'limit = { check_variable = { zin_ruler_vigour < zin_t_frail } }',
    'set_temp_variable = { zin_t_chance = mtth:zin_realm_frail_death }', 'multiply_temp_variable = { zin_t_chance = zin_ruler_rate }',
    `set_temp_variable_to_random = { var = zin_t_roll min = 0 max = ${num(C.random_scale)} }`,
    'if = { limit = { check_variable = { zin_t_roll < zin_t_chance } } zin_realm_succeed = yes }', '}');

  // ---- G2 heirs and regencies, G3 crises
  E.zin_realm_succeed = list('# G1 to G3, Q-87: the ruler of THIS realm has died, and the succession is dynamic. A waiting named heir may be disputed',
    '# (mtth zin_realm_succession_dispute, in hundredths, when the crown may fall into crisis): zin_realm.16 asks who rules. Otherwise he',
    '# is seated (zin_realm_seat_heir: a child reigns through a regency of two to five years). A kinsman named by Name an Heir takes the',
    '# crown quietly; a crown that passes in a line or by combat with no heir falls into crisis when it may; a realm that chooses may',
    '# fail to agree (mtth zin_realm_election_dispute) and fall into crisis, or chooses (the engine names the successor); a realm whose',
    '# custom men are not told takes the engine\'s successor.',
    'set_variable = { zin_realm_succession_way = 0 }',
    'if = {', 'limit = { zin_realm_has_named_heir = yes }',
    'set_temp_variable = { zin_t_chance = mtth:zin_realm_succession_dispute }', `set_temp_variable_to_random = { var = zin_t_roll min = 0 max = ${num(C.random_scale)} }`,
    'kill_country_leader = yes',
    'if = {', 'limit = {', 'check_variable = { zin_t_roll < zin_t_chance }', 'zin_realm_crisis_allowed = yes', '}',
    'set_country_flag = zin_realm_heir_disputed', 'country_event = { id = zin_realm.16 }', '}',
    'else = {', 'zin_realm_seat_heir = yes', 'zin_realm_announce_heir = yes', '}', '}',
    'else_if = {', 'limit = { has_country_flag = zin_realm_heir_named }', 'clr_country_flag = zin_realm_heir_named', 'kill_country_leader = yes',
    'set_variable = { zin_realm_succession_way = 3 }', 'country_event = { id = zin_realm.10 }', '}',
    'else_if = {', 'limit = {', 'OR = {', 'zin_realm_inherits = yes', 'zin_realm_contested_custom = yes', '}', 'zin_realm_crisis_allowed = yes', '}',
    'kill_country_leader = yes', 'zin_realm_open_crisis = yes', '}',
    'else_if = {', 'limit = { zin_realm_elective_custom = yes }',
    'set_temp_variable = { zin_t_chance = mtth:zin_realm_election_dispute }', `set_temp_variable_to_random = { var = zin_t_roll min = 0 max = ${num(C.random_scale)} }`,
    'kill_country_leader = yes',
    'if = {', 'limit = {', 'check_variable = { zin_t_roll < zin_t_chance }', 'zin_realm_crisis_allowed = yes', '}', 'zin_realm_open_crisis = yes', '}',
    'else = {', 'set_variable = { zin_realm_succession_way = 4 }', 'country_event = { id = zin_realm.10 }', '}', '}',
    'else = {', 'kill_country_leader = yes', 'set_variable = { zin_realm_succession_way = 5 }', 'country_event = { id = zin_realm.10 }', '}');
  E.zin_realm_seat_heir = list('# G2, Q-87: the waiting named heir of THIS realm takes the crown (the old ruler is already gone). A child (younger than the adult',
    '# age by zin_realm_heir_born against global.year) reigns through zin_realm_regency until grown, two to five years (way 2); a grown heir',
    '# rules at once (way 1). An heir whose year of birth and span are known gets his vigour from his own years (zin_realm_vigour_given).',
    'set_temp_variable = { zin_t_age = global.year }', `add_to_temp_variable = { zin_t_age = ${c('count_offset')} }`, 'subtract_from_temp_variable = { zin_t_age = zin_realm_heir_born }',
    `set_temp_variable = { zin_t_adult = ${c('adult_age')} }`,
    'zin_realm_crown_heir = yes', 'clr_country_flag = zin_realm_heir_disputed',
    'if = {', 'limit = {', 'has_variable = zin_realm_heir_born', 'has_variable = zin_realm_heir_life', '}',
    'set_temp_variable = { zin_t_left = zin_realm_heir_life }', 'subtract_from_temp_variable = { zin_t_left = zin_t_age }', 'multiply_temp_variable = { zin_t_left = zin_ruler_rate }',
    `clamp_temp_variable = { var = zin_t_left min = ${c('start_years_left_min')} max = ${c('vigour_max')} }`,
    'set_variable = { zin_ruler_vigour = zin_t_left }', 'set_country_flag = zin_realm_vigour_given', '}',
    'if = {', 'limit = {', 'has_variable = zin_realm_heir_born', 'check_variable = { zin_t_age < zin_t_adult }', '}',
    'set_temp_variable = { zin_t_days = zin_t_adult }', 'subtract_from_temp_variable = { zin_t_days = zin_t_age }', `multiply_temp_variable = { zin_t_days = ${c('days_per_year')} }`,
    `clamp_temp_variable = { var = zin_t_days min = ${c('regency_min_days')} max = ${c('regency_max_days')} }`,
    'add_timed_idea = { idea = zin_realm_regency days = zin_t_days }', 'set_country_flag = zin_realm_in_regency', 'set_variable = { zin_realm_succession_way = 2 }', '}',
    'else = { set_variable = { zin_realm_succession_way = 1 } }',
    'clear_variable = zin_realm_heir_born');
  E.zin_realm_announce_heir = '# G2: the court hears how the heir took the crown (zin_realm.11 for a child, zin_realm.10 otherwise).\nif = {\nlimit = { check_variable = { zin_realm_succession_way = 2 } }\ncountry_event = { id = zin_realm.11 }\n}\nelse = { country_event = { id = zin_realm.10 } }';
  E.zin_realm_crown_heir = list('# G2: the named heir of THIS realm is promoted to lead (generated from data/world/characters and data/world/heirs.json).',
    heirRows.length ? heirRows.map((r, i) => `${i ? 'else_if' : 'if'} = {\nlimit = {\noriginal_tag = ${r.tag}\nhas_character = ${r.heir.id}\n}\npromote_character = ${r.heir.id}\n}`) : 'log = "ZIN realm: no named heirs"');
  E.zin_realm_remove_heir = list('# Q-87: the named heir of THIS realm leaves the succession (passed over, or dead before the ruler): he is retired.',
    heirRows.length ? heirRows.map((r, i) => `${i ? 'else_if' : 'if'} = {\nlimit = {\noriginal_tag = ${r.tag}\nhas_character = ${r.heir.id}\n}\nretire_character = ${r.heir.id}\n}`) : 'log = "ZIN realm: no named heirs"',
    'clear_variable = zin_realm_heir_born', 'clr_country_flag = zin_realm_heir_disputed');
  E.zin_realm_pass_over_heir = '# Q-87 (zin_realm.16 b): the court passes the heir over; the custom chooses another and zin_realm.10 tells it (way 6).\nzin_realm_remove_heir = yes\nadd_stability = -0.03\nset_variable = { zin_realm_succession_way = 6 }\ncountry_event = { id = zin_realm.10 }';
  E.zin_realm_hold_disputed_crown = `# Q-87 (zin_realm.16 a): the court crowns the heir over the rival's protests; the crown sits uneasily for a year (zin_realm_disputed_crown).\nzin_realm_seat_heir = yes\nadd_timed_idea = { idea = zin_realm_disputed_crown days = ${C.disputed_days} }\nif = {\nlimit = { check_variable = { zin_realm_succession_way = 2 } }\ncountry_event = { id = zin_realm.11 }\n}`;
  E.zin_realm_fight_for_heir = '# Q-87 (zin_realm.16 c): the heir is crowned and the rival raises a banner: a contested crown (zin_realm_settle_crisis, way 2).\nzin_realm_seat_heir = yes\nset_temp_variable = { zin_arg_way = 2 }\nzin_realm_settle_crisis = yes';
  E.zin_realm_captain_takes_crown = '# Q-87 (zin_realm.16 d): while the court quarrels the captain-general takes the crown (way 4) and the heir is set aside.\nclr_country_flag = zin_realm_heir_disputed\nset_temp_variable = { zin_arg_way = 4 }\nzin_realm_settle_crisis = yes';
  E.zin_realm_check_heir = list('# Q-87: the waiting heir may die before the ruler (mtth zin_realm_heir_death, in hundredths a month, times the people rate);',
    '# then no heir can be determined until another is named (zin_realm.17).',
    'set_temp_variable = { zin_t_chance = mtth:zin_realm_heir_death }', 'multiply_temp_variable = { zin_t_chance = zin_ruler_rate }',
    `set_temp_variable_to_random = { var = zin_t_roll min = 0 max = ${num(C.random_scale)} }`,
    'if = {', 'limit = { check_variable = { zin_t_roll < zin_t_chance } }', 'zin_realm_remove_heir = yes', 'set_country_flag = zin_realm_heir_lost', 'country_event = { id = zin_realm.17 }', '}');
  E.zin_realm_tick_regency = list('# G2: the regency idea has run out, so the heir is grown and rules.',
    'if = {', 'limit = {', 'has_country_flag = zin_realm_in_regency', 'NOT = { has_idea = zin_realm_regency }', '}', 'clr_country_flag = zin_realm_in_regency', 'country_event = { id = zin_realm.14 }', '}',
    'if = {', 'limit = {', 'has_country_flag = zin_realm_in_crisis', 'NOT = { has_idea = zin_realm_crisis }', '}', 'clr_country_flag = zin_realm_in_crisis', '}');
  E.zin_realm_open_crisis = list('# G3: No Heir of the Body. The crisis idea lasts until the claimants are settled (a year at most).',
    'set_country_flag = zin_realm_in_crisis', `add_timed_idea = { idea = zin_realm_crisis days = ${C.crisis_days} }`, 'country_event = { id = zin_realm.12 }');
  E.zin_realm_settle_crisis = list('# G3: the crisis ends. Argument zin_arg_way: 1 the council elects, 2 the claimants fight for it (a contested crown), 3 a prince of the house',
    '# we married into takes it (a sworn realm of that house when the course of the age is free, its guarantee otherwise), 4 the captain-general',
    '# takes it, 5 the nearest kinsman is proclaimed. Fires zin_realm.15.',
    'set_variable = { zin_realm_crisis_way = zin_arg_way }', 'clear_variable = zin_arg_way',
    'if = { limit = { has_idea = zin_realm_crisis } remove_ideas = zin_realm_crisis }', 'clr_country_flag = zin_realm_in_crisis',
    'if = { limit = { check_variable = { zin_realm_crisis_way = 1 } } add_stability = -0.05 }',
    'else_if = { limit = { check_variable = { zin_realm_crisis_way = 2 } } zin_realm_contest_crown = yes }',
    'else_if = { limit = { check_variable = { zin_realm_crisis_way = 3 } } zin_realm_take_foreign_prince = yes }',
    'else_if = { limit = { check_variable = { zin_realm_crisis_way = 4 } } zin_realm_mark_captain = yes zin_realm_crown_captain = yes }',
    'country_event = { id = zin_realm.15 }');
  E.zin_realm_contest_crown = list('# G3: the claimant the council would not have raises a banner: a civil war of the same allegiance (ruling_party keeps the crown\'s own party).',
    'add_to_variable = { global.zin_realm_contested_crowns = 1 }', 'set_country_flag = zin_realm_crown_contested',
    groups.map((g, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { has_government = ${g} }\nstart_civil_war = {\nideology = ${g}\nruling_party = ${g}\nsize = ${num(D.civilWarSize)}\n}\n}`));
  E.zin_realm_take_foreign_prince = list('# G3, way 3: a prince of the house we married into takes the crown.',
    'if = {', 'limit = { zin_rules_is_free = yes }', 'var:zin_realm_match = { puppet = PREV }', '}',
    'else = {', 'var:zin_realm_match = {', 'give_guarantee = PREV', 'add_opinion_modifier = { target = PREV modifier = zin_realm_kin_answered }', '}', '}');

  // ---- G4 usurpation
  E.zin_realm_mark_captain = list('# G3, G4: the ablest captain-general of THIS realm becomes the ambitious one (character flag zin_char_ambitious).',
    'if = {', 'limit = { NOT = { any_army_leader = { has_character_flag = zin_char_ambitious } } }',
    'if = {', 'limit = { any_army_leader = { skill > 2 } }', 'random_army_leader = { limit = { skill > 2 } set_character_flag = zin_char_ambitious }', '}',
    'else = { random_army_leader = { set_character_flag = zin_char_ambitious } }', '}');
  E.zin_realm_crown_captain = list('# G3, G4: the ambitious captain-general takes the crown of THIS realm in the ruling allegiance (one branch per stance of ideologies.mjs).',
    'if = {', 'limit = { any_army_leader = { has_character_flag = zin_char_ambitious } }',
    stances.map((s, i) => `${i ? 'else_if' : 'if'} = {\nlimit = { has_country_leader_ideology = ${s} }\nkill_country_leader = yes\nrandom_army_leader = {\nlimit = { has_character_flag = zin_char_ambitious }\nclr_character_flag = zin_char_ambitious\nadd_country_leader_role = {\npromote_leader = yes\ncountry_leader = {\nideology = ${s}\nexpire = "2000.1.1.1"\n}\n}\n}\n}`),
    `add_timed_idea = { idea = zin_realm_usurper_rule days = ${D.usurperDays} }`, '}');
  E.zin_realm_check_ambition = list('# G4: an unsettled realm (calm below the line) may breed an ambitious captain (mtth zin_realm_ambition_chance, in hundredths).',
    'if = {', 'limit = {', 'NOT = { has_country_flag = zin_realm_ambition_cd }', 'NOT = { has_country_flag = zin_realm_in_crisis }',
    `NOT = { has_stability > ${num(C.ambition_stability)} }`, 'zin_realm_has_captain = yes', '}',
    'set_temp_variable = { zin_t_chance = mtth:zin_realm_ambition_chance }', `set_temp_variable_to_random = { var = zin_t_roll min = 0 max = ${num(C.random_scale)} }`,
    'if = {', 'limit = { check_variable = { zin_t_roll < zin_t_chance } }', `set_country_flag = { flag = zin_realm_ambition_cd days = ${C.ambition_cooldown_days} }`,
    'zin_realm_mark_captain = yes', 'country_event = { id = zin_realm.20 }', '}', '}');
  E.zin_realm_calm_captain = '# G4: the captain is bought off.\nevery_army_leader = {\nlimit = { has_character_flag = zin_char_ambitious }\nclr_character_flag = zin_char_ambitious\n}';
  E.zin_realm_arrest_captain = list('# G4: the arrest. The captain goes quietly (zin_realm.22) or the host follows its captain (zin_realm.21).',
    'random_list = {', `${D.arrest.fails} = { country_event = { id = zin_realm.22 days = 3 } }`, `${D.arrest.rises} = { country_event = { id = zin_realm.21 days = 3 } }`, '}');
  E.zin_realm_dismiss_captain = '# G4: the failed usurper leaves the realm\'s service for good.\nrandom_army_leader = {\nlimit = { has_character_flag = zin_char_ambitious }\nretire = yes\n}';

  // ---- G5 subjects and risings
  E.zin_realm_check_subject = list('# G5: a subject that thinks little of its overlord stirs while the overlord is at war.',
    'if = {', 'limit = {', 'NOT = { has_country_flag = zin_realm_subject_cd }', 'NOT = { zin_realm_bond_owned = yes }', 'OVERLORD = {', 'has_war = yes',
    `PREV = { NOT = { has_opinion = { target = PREV value > ${C.subject_opinion} } } }`, '}', '}',
    `set_country_flag = { flag = zin_realm_subject_cd days = ${C.subject_cooldown_days} }`, 'country_event = { id = zin_realm.30 }', '}');
  E.zin_realm_break_bond = '# G5: the subject breaks free while its overlord is away.\nOVERLORD = {\nadd_opinion_modifier = { target = PREV modifier = zin_realm_broke_the_bond }\nend_puppet = PREV\n}\nadd_stability = -0.03';
  E.zin_realm_loosen_bond = '# G5: the subject wins a looser bond.\nadd_autonomy_ratio = { value = 0.2 localization = zin_realm_autonomy_tt }\nOVERLORD = { add_opinion_modifier = { target = PREV modifier = zin_realm_demanded_autonomy } }';
  E.zin_realm_keep_bond = '# G5: the subject keeps faith.\nOVERLORD = { add_opinion_modifier = { target = PREV modifier = zin_realm_kept_faith } }';
  E.zin_realm_check_risings = list('# G5: a rising in a controlled land that is not our core, then its end (quiet again, or the land is no longer ours).',
    'if = {', 'limit = { has_variable = zin_realm_rising_state }', 'var:zin_realm_rising_state = { save_event_target_as = zin_realm_rising_place }',
    'if = {', 'limit = { var:zin_realm_rising_state = { NOT = { is_controlled_by = PREV } } }', 'set_variable = { zin_realm_rising_way = 2 }', 'clear_variable = zin_realm_rising_state', 'country_event = { id = zin_realm.32 }', '}',
    'else_if = {', `limit = { var:zin_realm_rising_state = { resistance < ${C.rising_end_resistance} } }`, 'set_variable = { zin_realm_rising_way = 1 }', 'clear_variable = zin_realm_rising_state', 'country_event = { id = zin_realm.32 }', '}', '}',
    'else_if = {', 'limit = {', 'NOT = { has_country_flag = zin_realm_rising_cd }', `any_controlled_state = {\nresistance > ${C.rising_resistance}\nNOT = { is_core_of = PREV }\n}`, '}',
    `random_controlled_state = {\nlimit = {\nresistance > ${C.rising_resistance}\nNOT = { is_core_of = PREV }\n}\nsave_event_target_as = zin_realm_rising_place\nPREV = { set_variable = { zin_realm_rising_state = PREV } }\n}`,
    `set_country_flag = { flag = zin_realm_rising_cd days = ${C.rising_cooldown_days} }`, 'country_event = { id = zin_realm.31 }', '}');

  // ---- G6 peace
  E.zin_realm_check_war = list('# G6: a war month. An AI realm offers terms a year into a war that no story owner ends; an AI realm makes peace in a war it cannot',
    '# fight (no border with the foe for a year and a half), and with any court of the East once the false god is dead.',
    'add_to_variable = { zin_realm_war_months = 1 }',
    `set_temp_variable = { zin_t_terms = ${c('terms_war_months')} }`, `set_temp_variable = { zin_t_purpose = ${c('purpose_war_months')} }`,
    'if = {', 'limit = {', 'is_ai = yes', 'NOT = { zin_realm_story_war_side = yes }', 'NOT = { has_country_flag = zin_realm_terms_cd }',
    'NOT = { check_variable = { zin_realm_war_months < zin_t_terms } }', 'any_enemy_country = { NOT = { zin_realm_story_war_side = yes } }', '}',
    'random_enemy_country = {', 'limit = { NOT = { zin_realm_story_war_side = yes } }', 'save_event_target_as = zin_realm_terms_to', '}',
    `set_country_flag = { flag = zin_realm_terms_cd days = ${C.terms_cooldown_days} }`, 'zin_realm_offer_terms = yes', '}',
    'if = {', 'limit = {', 'is_ai = yes', 'NOT = { has_country_flag = zin_realm_purpose_cd }', 'any_enemy_country = { zin_realm_pointless_war = yes }', '}',
    'random_enemy_country = {', 'limit = { zin_realm_pointless_war = yes }', 'save_event_target_as = zin_realm_pointless_foe', '}',
    `set_country_flag = { flag = zin_realm_purpose_cd days = ${C.purpose_cooldown_days} }`, 'country_event = { id = zin_realm.42 }', '}');
  T.zin_realm_pointless_war = list('# G6, scope: an enemy country, PREV the realm at war. The war is pointless after the false god\'s death against a court of the East, or',
    '# after a year and a half against a foe neither side can reach, when no story owner ends it. Reads the temporary zin_t_purpose.',
    'OR = {', 'AND = {', 'has_global_flag = zin_afrit_dead', 'has_country_flag = zin_afrit_eastern_client', '}',
    'AND = {', 'NOT = { zin_realm_story_war_side = yes }', 'PREV = { NOT = { zin_realm_story_war_side = yes } }', 'NOT = { is_neighbor_of = PREV }',
    'PREV = { NOT = { check_variable = { zin_realm_war_months < zin_t_purpose } } }', '}', '}');
  E.zin_realm_offer_terms = list('# G6: THIS realm offers terms to event_target:zin_realm_terms_to. Kind 1 peace on the old borders; kind 2 the land our hosts hold of theirs',
    '# that we claim (when they are losing and we are not); kind 3 silver for peace (when we are losing). Fires zin_realm.40.',
    'save_event_target_as = zin_realm_terms_from', 'set_temp_variable = { zin_t_kind = 1 }',
    'if = {', 'limit = {', `event_target:zin_realm_terms_to = { surrender_progress > ${num(C.terms_winning_surrender)} }`, `NOT = { surrender_progress > ${num(C.terms_even_surrender)} }`,
    'any_controlled_state = {', 'is_owned_by = event_target:zin_realm_terms_to', 'OR = {', 'is_core_of = PREV', 'is_claimed_by = PREV', '}', '}', '}',
    'set_temp_variable = { zin_t_kind = 2 }',
    'random_controlled_state = {', 'limit = {', 'is_owned_by = event_target:zin_realm_terms_to', 'OR = {', 'is_core_of = PREV', 'is_claimed_by = PREV', '}', '}', 'save_event_target_as = zin_realm_terms_land', '}', '}',
    'else_if = {', 'limit = {', `surrender_progress > ${num(C.terms_losing_surrender)}`, `has_political_power > ${C.tribute - 1}`, '}', 'set_temp_variable = { zin_t_kind = 3 }', '}',
    'event_target:zin_realm_terms_to = {', 'set_variable = { zin_realm_terms_kind = zin_t_kind }', 'country_event = { id = zin_realm.40 }', '}');
  E.zin_realm_accept_terms = list('# G6, scope: the realm that accepts (zin_realm.40). The war ends between the two; the land or the silver changes hands; zin_realm.41 tells the offerer.',
    'hidden_effect = {',
    'if = {', 'limit = {', 'check_variable = { zin_realm_terms_kind = 2 }', 'has_event_target = zin_realm_terms_land', '}',
    'event_target:zin_realm_terms_from = { event_target:zin_realm_terms_land = { transfer_state_to = PREV } }', '}',
    'if = {', 'limit = { check_variable = { zin_realm_terms_kind = 3 } }', `event_target:zin_realm_terms_from = { add_political_power = -${C.tribute} }`, `add_political_power = ${C.tribute}`, '}',
    'event_target:zin_realm_terms_from = {', 'white_peace = { tag = PREV }', 'set_variable = { zin_realm_terms_answer = 1 }', '}', '}',
    'save_event_target_as = zin_realm_terms_to', 'event_target:zin_realm_terms_from = { country_event = { id = zin_realm.41 } }');
  E.zin_realm_refuse_terms = list('# G6, scope: the realm that refuses (zin_realm.40).',
    'hidden_effect = {', 'event_target:zin_realm_terms_from = {', 'set_variable = { zin_realm_terms_answer = 2 }', 'add_opinion_modifier = { target = PREV modifier = zin_realm_terms_refused }', '}', '}',
    'save_event_target_as = zin_realm_terms_to', 'event_target:zin_realm_terms_from = { country_event = { id = zin_realm.41 } }');
  E.zin_realm_end_pointless_war = '# G6 (zin_realm.42): peace on the old borders with the foe we cannot reach.\nevent_target:zin_realm_pointless_foe = { white_peace = { tag = PREV } }';

  // ---- G7 marriages
  E.zin_realm_accept_match = list('# G7, scope: the house that accepts (zin_realm.60). The two houses become kin (zin_realm_match on each, opinion +25 both ways).',
    'hidden_effect = {', 'event_target:zin_realm_suitor = {', 'set_variable = { zin_realm_match = PREV }', 'add_opinion_modifier = { target = PREV modifier = zin_realm_royal_match }',
    'PREV = { set_variable = { zin_realm_match = PREV } }', '}', 'add_opinion_modifier = { target = event_target:zin_realm_suitor modifier = zin_realm_royal_match }', '}',
    'save_event_target_as = zin_realm_match_answer', 'event_target:zin_realm_suitor = { country_event = { id = zin_realm.61 } }');
  E.zin_realm_refuse_match = list('# G7, scope: the house that refuses (zin_realm.60); the suitor takes it ill (opinion -15).',
    'hidden_effect = { event_target:zin_realm_suitor = { add_opinion_modifier = { target = PREV modifier = zin_realm_match_refused } } }',
    'save_event_target_as = zin_realm_match_answer', 'event_target:zin_realm_suitor = { country_event = { id = zin_realm.62 } }');
  E.zin_realm_pledge_to_kin = '# G7 (zin_realm.61): a guarantee of the new kin.\nevent_target:zin_realm_match_answer = { PREV = { give_guarantee = PREV } }';
  E.zin_realm_break_match = list('# G7: the marriage bond of THIS realm ends on both sides.',
    'if = {', 'limit = { has_variable = zin_realm_match }', 'var:zin_realm_match = {', 'clear_variable = zin_realm_match',
    'remove_opinion_modifier = { target = PREV modifier = zin_realm_royal_match }', 'PREV = { remove_opinion_modifier = { target = PREV modifier = zin_realm_royal_match } }', '}',
    'clear_variable = zin_realm_match', '}');
  E.zin_realm_check_kinship = list('# G7: our kin is gone (the bond ends), at war with us (the bond ends), or fighting a defensive war that we have no part in (zin_realm.63).',
    'if = {', 'limit = { var:zin_realm_match = { exists = no } }', 'clear_variable = zin_realm_match', '}',
    'else_if = {', 'limit = { has_war_with = var:zin_realm_match }', 'zin_realm_break_match = yes', '}',
    'else_if = {', 'limit = {', 'NOT = { has_country_flag = zin_realm_kin_cd }', 'var:zin_realm_match = {', 'has_defensive_war = yes',
    'any_enemy_country = {', 'NOT = { tag = PREV.PREV }', 'NOT = { has_war_with = PREV.PREV }', 'NOT = { is_in_faction_with = PREV.PREV }', '}', '}', '}',
    'var:zin_realm_match = {', 'save_event_target_as = zin_realm_kin',
    'random_enemy_country = {', 'limit = {', 'NOT = { tag = PREV.PREV }', 'NOT = { has_war_with = PREV.PREV }', 'NOT = { is_in_faction_with = PREV.PREV }', '}', 'save_event_target_as = zin_realm_kin_foe', '}', '}',
    `set_country_flag = { flag = zin_realm_kin_cd days = ${C.kin_cooldown_days} }`, 'country_event = { id = zin_realm.63 }', '}');
  E.zin_realm_join_kin = '# G7 (zin_realm.63): we join the war of our kin.\nevent_target:zin_realm_kin = {\nadd_opinion_modifier = { target = PREV modifier = zin_realm_kin_answered }\nPREV = { add_to_war = { targeted_alliance = PREV enemy = event_target:zin_realm_kin_foe hostility_reason = asked_to_join } }\n}';
  E.zin_realm_aid_kin = `# G7 (zin_realm.63): silver instead of swords.\nadd_political_power = -${C.tribute}\nevent_target:zin_realm_kin = {\nadd_political_power = ${C.tribute}\nadd_opinion_modifier = { target = PREV modifier = zin_realm_kin_answered }\n}`;
  E.zin_realm_fail_kin = '# G7 (zin_realm.63): we do not answer; the kin take it ill and the bond ends.\nevent_target:zin_realm_kin = { add_opinion_modifier = { target = PREV modifier = zin_realm_kin_failed } }\nzin_realm_break_match = yes';

  // ---- G8 raids
  // A chartered dominion of the Concord (the steppe riders of Konori and Hunhun) never raids the crown or a fellow dominion (Q-89).
  const raidTarget = list('NOT = { tag = PREV }', 'exists = yes', 'has_capitulated = no', 'NOT = { is_in_faction_with = PREV }', 'NOT = { is_subject_of = PREV }', 'NOT = { PREV = { is_subject_of = PREV } }',
    'NOT = { has_country_flag = zin_realm_raided_recently }', `NOT = { original_tag = ${PUV} }`, `NOT = { original_tag = ${ZOL} }`,
    'OR = {', 'has_global_flag = zin_war_of_last_crowns', 'NOT = { zin_realm_tier_a = yes }', '}',
    'NOT = {', 'AND = {', 'PREV = { zin_aenor_is_concord_dominion = yes }', 'OR = {', 'zin_aenor_is_realm = yes', 'zin_aenor_is_concord_dominion = yes', '}', '}', '}');
  const seaTarget = list(raidTarget, 'any_owned_state = { is_coastal = yes }');
  const raidRegions = [...new Set(plan.rows.filter(r => plan.raiders.includes(r.tag)).map(r => r.region))].sort();
  const pick = (scope, limit) => `random_${scope} = {\nlimit = {\n${limit}\n}\nsave_event_target_as = zin_realm_raid_victim\nset_temp_variable = { zin_t_found = 1 }\n}`;
  const ownLand = raidRegions.map(region => list('else_if = {', 'limit = {', `has_country_flag = zin_realm_land_${region}`,
    `any_country = {\nhas_country_flag = zin_realm_land_${region}\n${seaTarget}\n}`, '}', pick('country', `has_country_flag = zin_realm_land_${region}\n${seaTarget}`), '}'));
  E.zin_realm_check_raid = list('# G8, Q-89: a raiding realm at peace rides now and then (mtth zin_realm_raid_chance, in hundredths) into a neighbour, or, when it has',
    '# no land neighbour to raid, into a coastal realm of its own land; never into a great power before the War of the Last Crowns. The corsairs',
    '# raid by sea: a coastal neighbour first, else a coastal realm of their own land. The steppe riders raid by land only, into a neighbour.',
    'if = {', 'limit = {', 'NOT = { has_country_flag = zin_realm_raid_cd }', 'has_war = no', 'has_capitulated = no', '}',
    'set_temp_variable = { zin_t_chance = mtth:zin_realm_raid_chance }', `set_temp_variable_to_random = { var = zin_t_roll min = 0 max = ${num(C.random_scale)} }`,
    'if = {', 'limit = { check_variable = { zin_t_roll < zin_t_chance } }', 'set_temp_variable = { zin_t_found = 0 }',
    'if = {', 'limit = { zin_realm_is_corsair = yes }',
    'if = {', `limit = { any_neighbor_country = {\n${seaTarget}\n} }`, pick('neighbor_country', seaTarget), '}', ownLand, '}',
    'else_if = {', 'limit = { zin_realm_is_steppe_rider = yes }',
    'if = {', `limit = { any_neighbor_country = {\n${raidTarget}\n} }`, pick('neighbor_country', raidTarget), '}', '}',
    'else = {',
    'if = {', `limit = { any_neighbor_country = {\n${raidTarget}\n} }`, pick('neighbor_country', raidTarget), '}', ownLand, '}',
    'if = {', 'limit = { check_variable = { zin_t_found = 1 } }', 'zin_realm_raid = yes', '}', '}', '}');
  E.zin_realm_raid = list('# G8: THIS realm raids event_target:zin_realm_raid_victim (zin_realm.70 to the victim). Corsairs come home with sea craft, steppe',
    '# riders with the craft of the saddle (Q-89).',
    `set_country_flag = { flag = zin_realm_raid_cd days = ${C.raid_cooldown_days} }`, 'save_event_target_as = zin_realm_raider',
    `if = { limit = { zin_realm_is_corsair = yes } navy_experience = ${num(C.raid_sea_xp)} }`,
    `if = { limit = { zin_realm_is_steppe_rider = yes } army_experience = ${num(C.raid_steppe_xp)} }`,
    'event_target:zin_realm_raid_victim = {', `set_country_flag = { flag = zin_realm_raided_recently days = ${C.raided_memory_days} }`, 'set_variable = { zin_realm_last_raider = PREV }',
    'add_opinion_modifier = { target = PREV modifier = zin_realm_raided_us }', 'country_event = { id = zin_realm.70 }', '}');
  E.zin_realm_answer_raid = list('# G8, scope: the raided realm (zin_realm.70). Argument zin_arg_way: 1 ride out after them (a cause of war for a year), 2 pay them,',
    '# 3 bar the gates (the raided idea for half a year). zin_realm.71 tells the raiders.',
    'event_target:zin_realm_raider = { set_variable = { zin_realm_raid_answer = zin_arg_way } }',
    'if = {', 'limit = { check_variable = { zin_arg_way = 1 } }', `event_target:zin_realm_raider = { PREV = { add_dynamic_modifier = { modifier = zin_realm_cb_raiders scope = PREV days = ${C.cause_days} } } }`, '}',
    'else_if = {', 'limit = { check_variable = { zin_arg_way = 2 } }', `add_political_power = -${C.raid_tribute}`, `event_target:zin_realm_raider = { add_political_power = ${C.raid_tribute} }`, '}',
    `else = { add_timed_idea = { idea = zin_realm_raided days = ${C.raided_days} } }`,
    'clear_variable = zin_arg_way', 'save_event_target_as = zin_realm_raid_victim', 'event_target:zin_realm_raider = { country_event = { id = zin_realm.71 } }');

  // ---- G9 courts in exile
  const shelterOk = list('exists = yes', 'NOT = { tag = PREV }', 'NOT = { tag = event_target:zin_realm_conqueror }', 'has_capitulated = no', 'NOT = { has_war_with = PREV }',
    'NOT = { has_variable = zin_realm_exile_court }', 'NOT = { is_subject_of = event_target:zin_realm_conqueror }', 'NOT = { zin_realm_alliance_owned = yes }');
  E.zin_realm_found_exile_court = list('# G9: the court of THIS fallen realm (its ruler lives) looks for a shelter: an ally still in the field, the house it married into, a',
    '# neighbour, or any realm that thinks well of it, never the conqueror (event_target:zin_realm_conqueror, saved by the caller). zin_realm.50 to the shelter.',
    'if = {', 'limit = { zin_realm_court_may_flee = yes }', 'save_event_target_as = zin_realm_fallen', 'set_country_flag = zin_realm_court_in_exile',
    'if = {', `limit = { any_country = {\n${shelterOk}\nis_in_faction_with = PREV\n} }`, `random_country = {\nlimit = {\n${shelterOk}\nis_in_faction_with = PREV\n}\nzin_realm_take_in_court = yes\n}`, '}',
    'else_if = {', `limit = {\nhas_variable = zin_realm_match\nvar:zin_realm_match = {\n${shelterOk}\n}\n}`, 'var:zin_realm_match = { zin_realm_take_in_court = yes }', '}',
    'else_if = {', `limit = { any_neighbor_country = {\n${shelterOk}\n} }`, `random_neighbor_country = {\nlimit = {\n${shelterOk}\n}\nzin_realm_take_in_court = yes\n}`, '}',
    'else_if = {', `limit = { any_country = {\n${shelterOk}\nhas_opinion = { target = PREV value > 49 }\n} }`, `random_country = {\nlimit = {\n${shelterOk}\nhas_opinion = { target = PREV value > 49 }\n}\nzin_realm_take_in_court = yes\n}`, '}',
    'else = { set_country_flag = zin_realm_court_dispersed }', '}');
  E.zin_realm_take_in_court = '# G9, scope: the shelter (PREV is the fallen realm).\nset_variable = { zin_realm_exile_court = PREV }\nPREV = { set_variable = { zin_realm_sheltered_by = PREV } }\ncountry_event = { id = zin_realm.50 }';
  E.zin_realm_keep_exile_court = list('# G9, scope: the shelter keeps the court of event_target:zin_realm_fallen: the court idea, the fallen court\'s thanks, and claims on the lands',
    '# of the fallen realm that others hold.', 'add_ideas = zin_realm_exiled_court',
    'hidden_effect = {', 'event_target:zin_realm_fallen = {', 'add_opinion_modifier = { target = PREV modifier = zin_realm_sheltered_us }',
    'every_core_state = {', 'limit = {', 'NOT = { is_owned_by = PREV }', 'NOT = { is_owned_by = PREV.PREV }', '}', 'add_claim_by = PREV.PREV', '}', '}', '}');
  E.zin_realm_refuse_exile_court = list('# G9, scope: the shelter sends the court away; it disperses.',
    'hidden_effect = {', 'clear_variable = zin_realm_exile_court',
    'if = {', 'limit = { has_country_flag = zin_realm_shelters_golden_court }', 'clr_country_flag = zin_realm_shelters_golden_court', 'set_global_flag = zin_realm_gk_court_dispersed', '}',
    'event_target:zin_realm_fallen = {', 'add_opinion_modifier = { target = PREV modifier = zin_realm_turned_us_away }', 'clr_country_flag = zin_realm_court_in_exile',
    'set_country_flag = zin_realm_court_dispersed', 'clear_variable = zin_realm_sheltered_by', '}', '}');
  E.zin_realm_check_exiles = list('# G9, scope: the shelter. Way 1: the fallen realm is gone and we own one of its cores (zin_realm.51 offers the restoration); way 2: the',
    '# fallen realm stands and its war is over (the court goes home).',
    'var:zin_realm_exile_court = { save_event_target_as = zin_realm_fallen }',
    'if = {', 'limit = { NOT = { has_country_flag = zin_realm_exile_asked } }',
    'if = {', 'limit = { event_target:zin_realm_fallen = {\nexists = no\nany_core_state = { is_owned_by = PREV.PREV }\n} }',
    'set_variable = { zin_realm_exile_way = 1 }', `set_country_flag = { flag = zin_realm_exile_asked days = ${D.exileAskDays} }`, 'country_event = { id = zin_realm.51 }', '}',
    'else_if = {', 'limit = { event_target:zin_realm_fallen = {\nexists = yes\nhas_capitulated = no\nhas_war = no\n} }',
    'set_variable = { zin_realm_exile_way = 2 }', `set_country_flag = { flag = zin_realm_exile_asked days = ${D.exileAskDays} }`, 'country_event = { id = zin_realm.51 }', '}', '}');
  E.zin_realm_restore_exiles = list('# G9, scope: the shelter (zin_realm.51). Argument zin_arg_way: 1 release the fallen realm and set it free, 2 release it as our sworn realm,',
    '# 3 keep the land (the court disperses), 4 the court goes home to a realm that still stands. The Golden King\'s restoration sets zin_golden_king_restored.',
    'if = {', 'limit = {', 'OR = {', 'check_variable = { zin_arg_way = 1 }', 'check_variable = { zin_arg_way = 2 }', '}', '}',
    'meta_effect = {', 'text = {', 'release = [TAG]', '}', 'TAG = "[zin_realm_fallen.GetTag]"', '}',
    'if = {', 'limit = { check_variable = { zin_arg_way = 1 } }', 'meta_effect = {', 'text = {', 'end_puppet = [TAG]', '}', 'TAG = "[zin_realm_fallen.GetTag]"', '}', '}',
    'event_target:zin_realm_fallen = { add_opinion_modifier = { target = PREV modifier = zin_realm_restored_us } }', '}',
    'hidden_effect = {',
    'if = {', 'limit = {', 'has_country_flag = zin_realm_shelters_golden_court', 'NOT = { check_variable = { zin_arg_way = 3 } }', '}', 'set_global_flag = zin_golden_king_restored', '}',
    'if = {', 'limit = { check_variable = { zin_arg_way = 3 } }', 'event_target:zin_realm_fallen = { set_country_flag = zin_realm_court_dispersed }', '}',
    'if = { limit = { has_idea = zin_realm_exiled_court } remove_ideas = zin_realm_exiled_court }', 'clear_variable = zin_realm_exile_court', 'clr_country_flag = zin_realm_shelters_golden_court',
    'event_target:zin_realm_fallen = {', 'clr_country_flag = zin_realm_court_in_exile', 'clear_variable = zin_realm_sheltered_by', '}', '}', 'clear_variable = zin_arg_way');
  const gkShelter = list('exists = yes', 'has_capitulated = no', `NOT = { owns_state = ${plan.aenor.capitalState} }`, `NOT = { original_tag = ${WOR} }`,
    'NOT = { has_variable = zin_realm_exile_court }', `NOT = { has_war_with = ${AEN} }`);
  E.zin_realm_house_golden_king = list('# G9 for the Golden King (SL-25, owner question Q-65 default: he keeps a court in exile that can return): once zin_golden_king_exiled is',
    '# set, his court goes to the first shelter of data/realm_life.json that still stands, has not capitulated, does not hold Parim and is not',
    '# the Deliverer\'s seat. zin_realm.50 to the shelter.', 'set_global_flag = zin_realm_gk_court',
    `${AEN} = {`, 'save_event_target_as = zin_realm_fallen', 'set_country_flag = zin_realm_court_in_exile',
    plan.shelterGoldenKing.map((t, i) => `${i ? 'else_if' : 'if'} = {\nlimit = {\n${t} = {\n${gkShelter}\n}\n}\n${t} = {\nset_country_flag = zin_realm_shelters_golden_court\nzin_realm_take_in_court = yes\n}\n}`),
    'else = { set_global_flag = zin_realm_gk_court_dispersed }', '}');
  return { T, E, heirRows };
}

// ------------------------------------------------------------------------------------------------ build
export async function buildRealmLife(staged, { countries, skipped = [], data } = {}) {
  const D = data ?? await loadRealmLife();
  const C = D.constants;
  const plan = realmPlan(countries, D);
  const heirs = heirsToRecruit(plan, skipped);
  const { T, E } = realmScripts(D, plan, heirs);
  const loc = new Loc(), sprites = new Sprites(await loadCatalogKeys());
  sprites.decisionPrefix = 'zin_realm_';
  const problems = [];

  // constants
  staged.text(FILES.constants, format(`${hdr(MOD, SPEC, 'Tuning of realm life (tools/content/data/realm_life.json). Fixed point.')}\nzin_realm = {\nschema = {\nany_key = yes\ndata = fixed_point\n}\n${Object.entries(C).map(([k, v]) => `${k} = ${num(v)}`).join('\n')}\n}\n`));
  // triggers and effects
  const sorted = o => Object.entries(o).sort(([a], [b]) => a.localeCompare(b, 'en'));
  staged.text(FILES.triggers, format(`${hdr(MOD, SPEC, 'Triggers of realm life: tiers, customs of succession, story exemptions and the conditions of each system.')}\n${sorted(T).map(([n, b]) => blk(n, b)).join('\n')}\n`));
  staged.text(FILES.effects, format(`${hdr(MOD, SPEC, 'Effects of realm life. THIS is the realm; ROOT may be the world runner. Arguments: temporary zin_arg_<name> (decision E1) and event targets.')}\n${sorted(E).map(([n, b]) => blk(n, b)).join('\n')}\n`));

  // mtth (hoi4-mtth): chances in hundredths and the AI's will to seek a match
  const M = D.mtth;
  staged.text(FILES.mtth, format(`${hdr(MOD, SPEC, 'Weighted values of realm life (hoi4-mtth): set_temp_variable = { x = mtth:<name> }.')}\n${Object.entries(M).map(([n, m]) => blk(n, list(`base = ${num(m.base)}`, m.modifiers.map(x => `modifier = {\n${'add' in x ? `add = ${num(x.add)}` : `factor = ${num(x.factor)}`}\n${x.if}\n}`)))).join('\n')}\n`));

  // ideas
  for (const [id, i] of Object.entries(D.ideas)) { await assertModifiers(id, i.mods); loc.set(id, i.name); loc.set(`${id}_desc`, i.desc); if (!sprites.keys.has(i.picture)) problems.push(`idea ${id}: picture ${i.picture} is not in the icon catalog`); }
  staged.text(FILES.ideas, format(`${hdr(MOD, SPEC, 'The spirits of realm life: regency, crisis, a captain\'s crown, a court in exile, raids and their answer.')}\nideas = {\ncountry = {\n${Object.entries(D.ideas).map(([id, i]) => blk(id, `picture = zin_${i.picture}\nallowed = { always = no }\nallowed_civil_war = { always = yes }\nremoval_cost = -1\n${blk('modifier', Object.entries(i.mods).map(([k, v]) => `${k} = ${num(v)}`).join('\n'))}`)).join('\n')}\n}\n}\n`));
  // opinion modifiers
  staged.text(FILES.opinions, format(`${hdr(MOD, SPEC, 'Opinion modifiers of realm life.')}\nopinion_modifiers = {\n${Object.entries(D.opinions).map(([id, o]) => { loc.set(id, o.name); return blk(id, list(`value = ${num(o.value)}`, o.decay !== undefined ? `decay = ${num(o.decay)}` : '')); }).join('\n')}\n}\n`));
  // the raiders' cause (the diplomacy spec's form: a dynamic modifier on the holder, added with the target as its scope)
  const cb = D.cause;
  await assertModifiers(cb.id, { generate_wargoal_tension_against: cb.tension });
  loc.set(cb.id, cb.name); loc.set(`${cb.id}_desc`, cb.desc);
  staged.text(FILES.dynamic, format(`${hdr(MOD, SPEC, 'The cause of war against raiders (G8). Added with scope = <raider>; the holder may justify against that raider.')}\n${blk(cb.id, `enable = { always = yes }\ngenerate_wargoal_tension_against = ${num(cb.tension)}`)}\n`));

  // decisions
  const cat = D.category;
  staged.text(FILES.categories, format(`${hdr(MOD, SPEC, 'The Court: the decisions of realm life (every realm).')}\n${category(cat.id, { title: cat.title, desc: cat.desc, art: cat.art, priority: cat.priority }, loc, sprites)}\n`));
  for (const [k, v] of Object.entries(D.tooltips)) loc.set(k, v);
  const dec = D.decisions, tt = id => { loc.set(`${id}_tt`, dec[id].tip); return `custom_effect_tooltip = ${id}_tt`; };
  const kinPairs = [...new Set(Object.values(D.people.kinClass))].map(k => `AND = {\nROOT = { has_country_flag = zin_realm_kin_${k} }\nhas_country_flag = zin_realm_kin_${k}\n}`);
  const decisions = [
    { id: 'zin_realm_name_heir', visible: 'OR = {\nzin_realm_inherits = yes\nzin_realm_contested_custom = yes\n}\nNOT = { zin_realm_is_story_ruler = yes }\nNOT = { zin_realm_has_heir = yes }',
      available: 'NOT = { has_country_flag = zin_realm_in_crisis }', effect: `${tt('zin_realm_name_heir')}\nadd_stability = 0.02\nhidden_effect = {\nset_country_flag = zin_realm_heir_named\nclr_country_flag = zin_realm_heir_lost\n}`,
      ai: `base = 0\nmodifier = {\nadd = 10\ncheck_variable = { zin_ruler_vigour < ${num(C.heir_worry_vigour)} }\n}\nmodifier = {\nadd = 20\ncheck_variable = { zin_ruler_vigour < ${num(C.heir_urgent_vigour)} }\n}\nmodifier = {\nadd = 10\nhas_country_flag = zin_realm_heir_lost\n}\nmodifier = {\nfactor = 0\nNOT = { has_political_power > 100 }\n}` },
    { id: 'zin_realm_seek_match', rootTrigger: 'zin_realm_is_monarchy = yes\nzin_realm_may_marry = yes\nNOT = { zin_realm_alliance_owned = yes }\nNOT = { has_variable = zin_realm_match }',
      target: `FROM = {\nexists = yes\nNOT = { tag = ROOT }\nzin_realm_is_monarchy = yes\nNOT = { zin_realm_alliance_owned = yes }\nNOT = { has_variable = zin_realm_match }\nNOT = { has_war_with = ROOT }\nhas_opinion = { target = ROOT value > -25 }\nOR = {\n${kinPairs.join('\n')}\n}\n}`,
      effect: `${tt('zin_realm_seek_match')}\nhidden_effect = {\nsave_event_target_as = zin_realm_suitor\nFROM = { country_event = { id = zin_realm.60 } }\n}`,
      ai: 'base = 0\nmodifier = {\nset_temp_variable = { zin_t_w = mtth:zin_realm_match_will }\nadd = zin_t_w\n}\nmodifier = {\nadd = 3\nFROM = { is_neighbor_of = ROOT }\n}\nmodifier = {\nadd = 3\nFROM = { is_major = yes }\n}\nmodifier = {\nfactor = 0\nNOT = { has_political_power > 100 }\n}' },
    { id: 'zin_realm_offer_terms', rootTrigger: 'has_war = yes\nNOT = { zin_realm_story_war_side = yes }',
      target: `FROM = {\nhas_war_with = ROOT\nNOT = { zin_realm_story_war_side = yes }\n}`,
      available: `NOT = { check_variable = { zin_realm_war_months < ${C.terms_decision_months} } }`,
      effect: `${tt('zin_realm_offer_terms')}\nhidden_effect = {\nFROM = { save_event_target_as = zin_realm_terms_to }\nzin_realm_offer_terms = yes\n}`,
      ai: 'base = 0' },
    { id: 'zin_realm_shelter_exiles', rootTrigger: 'has_capitulated = no\nNOT = { has_variable = zin_realm_exile_court }\nNOT = { zin_rules_is_historical = yes }',
      target: 'FROM = {\nhas_capitulated = yes\nzin_realm_court_may_flee = yes\nNOT = { has_war_with = ROOT }\nNOT = { is_subject_of = ROOT }\n}',
      effect: `${tt('zin_realm_shelter_exiles')}\nhidden_effect = {\nFROM = {\nsave_event_target_as = zin_realm_fallen\nset_country_flag = zin_realm_court_in_exile\nset_variable = { zin_realm_sheltered_by = ROOT }\n}\nset_variable = { zin_realm_exile_court = FROM }\n}\nzin_realm_keep_exile_court = yes`,
      ai: 'base = 0\nmodifier = {\nadd = 5\nhas_opinion = { target = FROM value > 50 }\n}\nmodifier = {\nadd = 10\nis_in_faction_with = FROM\n}\nmodifier = {\nadd = 5\nhas_country_leader_with_trait = zin_trait_temper_generous\n}\nmodifier = {\nfactor = 0\nNOT = { has_political_power > 100 }\n}' },
    { id: 'zin_realm_punish_raiders', visible: 'has_country_flag = zin_realm_raided_recently\nhas_variable = zin_realm_last_raider',
      available: 'var:zin_realm_last_raider = { exists = yes }\nNOT = { has_war_with = var:zin_realm_last_raider }',
      effect: `${tt('zin_realm_punish_raiders')}\nhidden_effect = {\nvar:zin_realm_last_raider = { PREV = { add_dynamic_modifier = { modifier = zin_realm_cb_raiders scope = PREV days = ${C.cause_days} } } }\nclr_country_flag = zin_realm_raided_recently\n}\nadd_timed_idea = { idea = zin_realm_punitive_host days = ${C.punitive_days} }`,
      ai: 'base = 2\nmodifier = {\nadd = 10\nhas_country_leader_with_trait = zin_trait_temper_vengeful\n}\nmodifier = {\nadd = 5\nhas_country_leader_with_trait = zin_trait_temper_bold\n}\nmodifier = {\nfactor = 0\nhas_war = yes\n}' },
  ].map(d => ({ ...d, icon: dec[d.id].icon, art: dec[d.id].icon, title: dec[d.id].title, desc: dec[d.id].desc, cost: dec[d.id].cost, cooldown: dec[d.id].cooldown }));
  staged.text(FILES.decisions, format(`${hdr(MOD, SPEC, 'The Court: Name an Heir, Seek a Match, Offer Terms, Shelter the Exiles, Punish the Raiders. The AI offers terms through the pulse.')}\n${cat.id} = {\n${decisions.map(d => writeDecision(d, loc, sprites)).join('\n')}\n}\n`));
  loc.set('zin_realm_autonomy_tt', 'A looser bond');

  // events: the hidden batch event, then the written events (the events_mech writer and checks)
  const evLoc = new Loc();
  const batch = writeEvent(D.namespace, { id: 1, kind: 'hidden', immediate: 'add_to_variable = { global.zin_realm_batch = 1 }\nzin_realm_run_batch = yes' }, evLoc, { hiddenOk: 'The week turns.' });
  const sets = [{ namespace: D.namespace, file: FILES.events, declaresNamespace: false, note: 'realm life (G1 to G9)', events: D.events }];
  const pictures = await loadPictures();
  const taken = new Set();
  for (const [rel, buf] of staged.files) if (rel.startsWith('events/')) for (const m of buf.toString('utf8').matchAll(/^(?:country|news)_event\s*=\s*\{\s*id\s*=\s*(zin_realm\.\d+)/gm)) taken.add(m[1]);
  problems.push(...structureProblems(sets, pictures, taken), ...await textProblems(sets));
  const out = await renderMechEvents(sets);
  // The shared writer opens its file with its own header; this file carries realm life's header instead.
  const written = out.files.get(FILES.events).replace(/^# Generated by the ZIN content builder \(modules\/events_mech\.mjs[^\n]*\n# [^\n]*\n/, '');
  const eventText = `${hdr(MOD, SPEC, 'Namespace zin_realm: the hidden weekly batch (1) and the events of realm life (10 to 71).')}\nadd_namespace = ${D.namespace}\n${format(batch.text)}\n${written}`;
  for (const [k, v] of Object.entries(evLoc.entries())) loc.set(k, v);
  for (const k of await unknownCommands(eventText, SCRIPT_KEYS)) problems.push(`${FILES.events}: ${k} is neither documented nor a ZIN name`);
  for (const rel of [FILES.effects, FILES.triggers, FILES.decisions]) for (const k of await unknownCommands(staged.files.get(rel).toString('utf8'), SCRIPT_KEYS)) problems.push(`${rel}: ${k} is neither documented nor a ZIN name`);
  for (const id of out.fired) if (id.startsWith('zin_realm.') && !D.events.some(e => `zin_realm.${e.id}` === id) && id !== 'zin_realm.1') problems.push(`${id} is fired and not written`);
  staged.text(FILES.events, eventText);

  // on_actions: the start values of every realm, and the courts in exile
  const startLines = plan.rows.map(r => {
    const lines = [`set_variable = { zin_realm_slot = ${r.slot} }`, `set_country_flag = zin_realm_land_${r.region}`];
    if (r.rate !== null) lines.push(`set_variable = { zin_ruler_rate = ${num(r.rate)} }`, `set_variable = { zin_ruler_vigour = ${r.vigour} }`);
    if (r.kin) lines.push(`set_country_flag = zin_realm_kin_${r.kin}`);
    if (heirs.has(r.tag) && r.heir.born) lines.push(`set_variable = { zin_realm_heir_born = ${r.heir.born} }`);
    if (heirs.has(r.tag) && r.heir.born && r.heirLife) lines.push(`set_variable = { zin_realm_heir_life = ${r.heirLife} }`);    return `${r.tag} = {\n${lines.join('\n')}\n}`;
  });
  staged.text(FILES.onActions, format(`${hdr(MOD, SPEC, 'on_startup: the slot, land, kin class, people rate and start vigour of every realm and its heir\'s year of birth, and every sitting ruler\nmarked as known. on_capitulation and on_annex: a fallen court goes into exile (G9). on_civil_war_end: a contested crown is settled.')}
on_actions = {
on_startup = {
effect = {
set_variable = { global.zin_realm_batch = 0 }
set_variable = { global.zin_realm_contested_crowns = 0 }
${startLines.join('\n')}
every_country = {
random_character = {
limit = { is_country_leader = yes }
set_character_flag = zin_realm_known
}
}
}
}
on_capitulation = {
effect = {
FROM = { save_event_target_as = zin_realm_conqueror }
zin_realm_found_exile_court = yes
if = {
limit = {
has_global_flag = zin_golden_king_exiled
NOT = { has_global_flag = zin_realm_gk_court }
}
zin_realm_house_golden_king = yes
}
}
}
on_annex = {
effect = {
save_event_target_as = zin_realm_conqueror
FROM = { zin_realm_found_exile_court = yes }
if = {
limit = {
has_global_flag = zin_golden_king_exiled
NOT = { has_global_flag = zin_realm_gk_court }
}
zin_realm_house_golden_king = yes
}
}
}
on_civil_war_end = {
effect = {
if = {
limit = { has_country_flag = zin_realm_crown_contested }
clr_country_flag = zin_realm_crown_contested
}
}
}
}
`));

  // sprites and text
  staged.text(FILES.gfx, sprites.text(hdr(MOD, SPEC, 'Sprites of the Court: the decision icons and the category (catalog icons until the art pass).')));
  for (const [k, v] of Object.entries(out.loc.entries())) loc.set(k, v);
  const entries = loc.entries();
  problems.push(...await wordProblems(entries), ...notCp1252(entries));
  if (problems.length) throw new Error(`Realm life breaks the rules (${problems.length}):\n  ${problems.slice(0, 40).join('\n  ')}`);
  staged.loc(LOC_NAME, entries);

  const definitions = { triggers: Object.keys(T), effects: Object.keys(E), ideas: Object.keys(D.ideas), opinions: Object.keys(D.opinions), decisions: decisions.map(d => d.id),
    categories: [cat.id], events: ['zin_realm.1', ...D.events.map(e => `zin_realm.${e.id}`)], mtth: Object.keys(M), constants: Object.keys(C) };
  return { heirRecruits: heirs, plan, counts: { ...Object.fromEntries(Object.entries(definitions).map(([k, v]) => [k, v.length])), heirs: heirs.size, raiders: plan.raiders.length, keys: Object.keys(entries).length },
    definitions, eventMeta: out.metas, fired: [...out.fired].sort() };
}
