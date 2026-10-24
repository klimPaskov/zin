// Afrit and the Hidden Council (docs/specs/04_mechanics/afrit_hidden_council.md).
//   await buildAfrit(staged, { countries, table?, regionByRoster? })
// Writes the scripted triggers and effects (hidden behind mask-safe tooltips), the two-face scripted localisation of the Worshipdom's
// focuses, the Council's decisions and the Houses decision, the dynamic modifiers, mechanic ideas, traits, the Council's people, the
// mechanic's own events (the ids that 06_events does not carry), on_actions, the footholds map mode, the Hidden Council panel and the text.
import { readFile } from 'node:fs/promises';
import { assertModifiers } from '../lib/core.mjs';
import { ZIN } from '../lib/paths.mjs';
import { afritScripts } from '../lib/mech_afrit_script.mjs';
import { afritGui } from '../lib/mech_court_gui.mjs';
import { Loc, Sprites, loadJson, loadCatalogKeys, hdr, format, list, blk, writeEvent, writeDecision, category, call, wordProblems, secrecyLeaks, notCp1252 } from '../lib/mech_court_lib.mjs';
import { stateProvinces } from './mech_aenor.mjs';
import { definedText } from '../lib/mech_court_gui.mjs';

const SPEC = 'docs/specs/04_mechanics/afrit_hidden_council.md';
const MOD = 'mech_afrit';

export async function loadTable(countries) {
  const { loadCountryTable } = await import('./countries.mjs');
  return loadCountryTable(countries, `${ZIN}/docs/design/countries.csv`);
}

// The start footholds of one country: the first row of the table that matches (R4).
export function startFootholds(D, c, people, region) {
  const hit = (m) => {
    const arr = v => (Array.isArray(v) ? v : [v]);
    if (m.any) return true;
    if (m.name && !arr(m.name).includes(c.name)) return false;
    if (m.notName && arr(m.notName).includes(c.name)) return false;
    if (m.overlord && c.overlord !== m.overlord) return false;
    if (m.people && !arr(m.people).includes(people)) return false;
    if (m.notPeople && arr(m.notPeople).includes(people)) return false;
    if (m.region && !arr(m.region).includes(region)) return false;
    return true;
  };
  const cap0 = new Set(D.caps.zero);
  if (cap0.has(c.name) || people === 'the_dead') return 0;
  return D.footholdRows.find(r => hit(r.match)).start;
}

export async function buildAfrit(staged, ctx) {
  const D = await loadJson('mech_afrit.json'), F = await loadJson('mech_afrit_focus_text.json'), roster = ctx.countries;
  // The Worshipdom tree author's table of faces is the source of the two-face texts when it exists (the tree names these scripted localisations);
  // data/mech_afrit_focus_text.json is the module's own table, used when that file is absent.
  let faces = F.focuses, facesSource = 'mech_afrit_focus_text.json';
  try { const t = await loadJson('focus_worshipdom_faces.json'); faces = Object.entries(t.focuses).map(([key, v]) => ({ key, public: v.name_public, true: v.name_true, publicDesc: v.desc_public, trueDesc: v.desc_true })); facesSource = 'focus_worshipdom_faces.json'; } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const table = ctx.table ?? await loadTable(roster);
  const economy = await loadJson('economy.json'), W = await loadJson('warfare_ids.json');
  const byName = new Map(roster.map(c => [c.name, c]));
  const need = n => { const c = byName.get(n); if (!c) throw new Error(`mech_afrit: ${n} is not in the roster`); return c; };
  const T = { hub: need(D.hub).tag, aenor: need(D.realm).tag, selen: need(D.selen).tag, mirolon: need(D.mirolon).tag, volgan: need('Puvulan').tag };
  T.hostGroup = W.hostGroupByCountry[D.hub];
  D.capZeroTags = D.caps.zero.map(n => need(n).tag);
  D.rivalCodes = D.rivals.map(([a, b]) => [need(a).tag, need(b).tag]);
  const loc = new Loc(), sprites = new Sprites(await loadCatalogKeys());
  // The Council's decision sprites carry the module's prefix: the Aenor court picks some of the same catalog icons.
  sprites.decisionPrefix = 'zin_afrit_';
  const HUB = T.hub, AEN = T.aenor;
  const { triggers, effects, tooltips } = afritScripts(D, T);
  const dates = triggers.__dates; delete triggers.__dates;

  // ---------------------------------------------------------------------------------------------- triggers, effects
  staged.text('common/scripted_triggers/zin_afrit.txt', format(`${hdr(MOD, SPEC, 'Triggers of the Council, the Houses and the dates of the story.')}\n${Object.entries(triggers).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([n, b]) => blk(n, b)).join('\n')}\n${dates}\n`));
  for (const [k, v] of Object.entries(tooltips)) loc.set(k, v);
  const ui = afritGui.effects();
  staged.text('common/scripted_effects/zin_afrit.txt', format(`${hdr(MOD, SPEC, 'Effects of the Hidden Council. Each hides its work while the secret holds and shows one mask-safe tooltip (text secrecy rule 3).')}\n${Object.entries(effects).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([n, b]) => blk(n, b)).join('\n')}\n${ui}\n`));

  // ---------------------------------------------------------------------------------------------- scripted localisation
  const sl = [];
  sl.push(definedText('zin_loc_deliverer', [['has_global_flag = zin_afrit_revealed', 'zin_loc_deliverer_true', 'Afrit'], [null, 'zin_loc_deliverer_public', 'Aurevan the Deliverer']], loc));
  loc.set('zin_name_aurevan', 'Aurevan the Deliverer');
  loc.set('zin_name_afrit_revealed', 'Afrit');
  loc.set('zin_name_afrit', 'Afrit');
  loc.set('zin_name_afrit_king_of_east', 'Afrit, King of the East');
  sl.push(definedText('zin_afrit_council_name', [['has_global_flag = zin_afrit_revealed', 'zin_afrit_council_name_true', 'The Hidden Council'], [null, 'zin_afrit_council_name_public', 'The Hermitage Chapter']], loc));
  for (const f of faces) {
    sl.push(definedText(`zin_wsd_${f.key}_name`, [['has_global_flag = zin_afrit_revealed', `zin_wsd_${f.key}_name_true`, f.true], [null, `zin_wsd_${f.key}_name_public`, f.public]], loc));
    sl.push(definedText(`zin_wsd_${f.key}_desc`, [['has_global_flag = zin_afrit_revealed', `zin_wsd_${f.key}_desc_true`, f.trueDesc], [null, `zin_wsd_${f.key}_desc_public`, f.publicDesc]], loc));
  }
  sl.push(afritGui.scriptedLoc(D, loc));
  sl.push(definedText('zin_afrit_confession_word', [
    ['has_war = yes', 'zin_afrit_confess_war_hub', 'is at war and speaks of nothing else'],
    ['has_country_flag = zin_lost_cause_member', 'zin_afrit_confess_cause_hub', 'sits among the Lost Cause\'s friends and watches Parim'],
    ['has_government = democratic', 'zin_afrit_confess_light_hub', 'keeps a Light court that asks careful questions'],
    ['has_government = fascism', 'zin_afrit_confess_dom_hub', 'keeps a proud court that sells its offices'],
    [null, 'zin_afrit_confess_quiet_hub', 'is quiet and keeps its own counsel']], loc));
  staged.text('common/scripted_localisation/zin_afrit.txt', format(`${hdr(MOD, SPEC, 'The Deliverer\'s name, the category name and the two-face texts of the Worshipdom\'s focuses (public while zin_afrit_revealed is unset, true after).')}\n${sl.join('\n')}\n`));

  // ---------------------------------------------------------------------------------------------- dynamic modifiers
  loc.set('zin_afrit_houses', 'Houses of the First Light');
  loc.set('zin_afrit_houses_desc', 'A hospital, a grain store and a school of scribes, kept by priests who serve most of their people sincerely. The better the court knows them, the more it leans on them.');
  loc.set('zin_afrit_graces', 'Graces of the Deliverer');
  loc.set('zin_afrit_graces_desc', 'The old treasures of the hermitage bless the realm that the Deliverer rules. Each is stronger when it is woken, and the Necklace is strongest in the heart of the Middle Kingdom.');
  const dmHouses = { stability_factor: 'zin_afrit_dm_stab', political_power_gain: 'zin_afrit_dm_pp_gain' };
  const dmGraces = Object.fromEntries(Object.entries(D.graceVariables).map(([m, v]) => [m, v]));
  await assertModifiers('zin_afrit_houses', dmHouses);
  await assertModifiers('zin_afrit_graces', dmGraces);
  sprites.use('GFX_modifiers_zin_afrit_houses', 'house_first_light');
  sprites.use('GFX_modifiers_zin_afrit_graces', 'sun_veiled');
  staged.text('common/dynamic_modifiers/zin_afrit.txt', format(`${hdr(MOD, SPEC, 'The Houses of the First Light (by footholds) and the Graces of the Deliverer (on the realm he rules).')}\n${blk('zin_afrit_houses', list('icon = GFX_modifiers_zin_afrit_houses', Object.entries(dmHouses).map(([k, v]) => `${k} = ${v}`)))}\n${blk('zin_afrit_graces', list('icon = GFX_modifiers_zin_afrit_graces', Object.entries(dmGraces).map(([k, v]) => `${k} = ${v}`)))}\n`));

  // ---------------------------------------------------------------------------------------------- ideas
  const ideas = [...D.ideas, { id: 'zin_afrit_aurevan_away', name: 'The Deliverer Is Away', desc: 'The god-king has sailed north and left the kingdom to his seal-keeper. The court manages, and counts the days.', picture: 'ship_voyage', mods: { stability_factor: -0.05 } }];
  for (const i of ideas) { await assertModifiers(i.id, i.mods); loc.set(i.id, i.name); loc.set(`${i.id}_desc`, i.desc); }
  staged.text('common/ideas/zin_afrit.txt', format(`${hdr(MOD, SPEC, 'Mechanic ideas of the Council: the rest, the exposure, the Necklace drawn upon, the Edict of Arms and the absence.')}\nideas = {\n\tcountry = {\n${ideas.map(i => blk(i.id, `picture = zin_${i.picture}\nallowed = { always = no }\nallowed_civil_war = { always = yes }\nremoval_cost = -1\n${blk('modifier', Object.entries(i.mods).map(([k, v]) => `${k} = ${v}`).join('\n'))}`)).join('\n')}\n\t}\n}\n`));

  // ---------------------------------------------------------------------------------------------- traits and the Council's people
  const allTraits = [...D.traits.country, ...D.traits.advisor];
  for (const t of allTraits) { await assertModifiers(t.id, t.mods); loc.set(t.id, t.name); loc.set(`${t.id}_desc`, t.desc); }
  staged.text('common/country_leader/zin_afrit_traits.txt', format(`${hdr(MOD, SPEC, 'Leader traits of the Deliverer and the advisor traits of the Council.')}\nleader_traits = {\n${D.traits.country.map(t => blk(t.id, `random = no\n${Object.entries(t.mods).map(([k, v]) => `${k} = ${v}`).join('\n')}`)).join('\n')}\n${D.traits.advisor.map(t => blk(t.id, `slot = ${t.slot}\nai_will_do = { factor = 1 }\n${Object.entries(t.mods).map(([k, v]) => `${k} = ${v}`).join('\n')}`)).join('\n')}\n}\n`));
  const chars = D.characters.map(c => {
    loc.set(c.id, c.name);
    loc.set(`${c.id}_adv`, c.name);
    return blk(c.id, `name = ${c.id}\nportraits = {\ncivilian = {\nlarge = ${c.portrait}\n}\n}\nadvisor = {\nslot = ${c.slot}\nidea_token = ${c.id}_adv\ncost = ${c.cost}\nallowed = { original_tag = ${HUB} }\n${c.hidden ? 'visible = { has_country_flag = zin_afrit_sevrin_guest }' : 'visible = { always = yes }'}\ntraits = { ${c.trait} }\nai_will_do = { factor = 1 }\n}`);
  });
  staged.text('common/characters/zin_afrit_council.txt', format(`${hdr(MOD, SPEC, 'The Council\'s people (N13): Ilvane, Corvel and Sevrin hold seats; Kessarion and Ossar serve under them. Hireable by the Worshipdom only; Sevrin joins through the focus A Guest of the Reliquary. Portraits reuse the generated men portraits until dedicated ones are drawn.')}\ncharacters = {\n${chars.join('\n')}\n}\n`));

  // ---------------------------------------------------------------------------------------------- decisions
  const cats = {
    zin_afrit_council: { title: '[ROOT.zin_afrit_council_name]', desc: 'The Council\'s work, in the order it is done: footholds, favours, the Reliquary and the court of Aenor.', art: 'house_first_light', allowed: `original_tag = ${HUB}`, visible: 'zin_afrit_is_hub = yes\nNOT = { has_global_flag = zin_afrit_dead }' },
    zin_afrit_cat_houses: { title: 'The Houses of the First Light', desc: 'The hospitals, granaries and scribes that a pilgrim house keeps. A court that doubts them may close their doors.', art: 'house_first_light', allowed: 'always = yes', visible: 'check_variable = { zin_footholds > 0 }\nNOT = { zin_afrit_is_hub = yes }' },
  };
  loc.set('zin_afrit_council_desc', cats.zin_afrit_council.desc);
  staged.text('common/decisions/categories/zin_afrit.txt', format(`${hdr(MOD, SPEC, 'The Council (hub only; its name is the public chapter until the reveal) and the Houses (any country that has one).')}\n${Object.entries(cats).map(([id, c]) => category(id, c, loc, sprites)).join('\n')}\n`));

  const dec = { zin_afrit_council: [], zin_afrit_cat_houses: [] };
  const cmask = 'zin_afrit_is_hub = yes';
  const costBranches = (varName) => `OR = {\n${[0, 1, 2, 3, 4].map(l => `AND = {\nFROM = { check_variable = { zin_footholds = ${l} } }\nhas_political_power > ${D.houseCost.base + D.houseCost.perLevel * l - 1}\n}`).join('\n')}\n}`;
  void costBranches;
  dec.zin_afrit_council.push({ id: 'zin_afrit_open_house', icon: 'house_first_light', art: 'house_first_light', title: 'Open a House in [FROM.GetName]', desc: 'A hospital, a granary and a school of scribes, offered in the name of the First Light. Sixty days of patience, and a court that may or may not be glad of it.', visible: `${cmask}\nhas_country_flag = zin_worshipdom_houses_open`, rootTrigger: 'has_country_flag = zin_worshipdom_houses_open',
    target: 'FROM = { zin_afrit_can_deepen_foothold = yes }', available: `has_country_flag = zin_worshipdom_houses_open\n${[0, 1, 2, 3, 4].map(l => `AND = {\nFROM = { check_variable = { zin_footholds = ${l} } }\nhas_political_power > ${D.houseCost.base + D.houseCost.perLevel * l - 1}\n}`).join('\n').replace(/^/, 'OR = {\n') + '\n}'}`, days: 60,
    effect: `set_temp_variable = { zin_cost = FROM.zin_afrit_open_cost }\nset_temp_variable = { zin_disc = global.zin_afrit_seat_censers }\nmultiply_temp_variable = { zin_disc = ${D.houseCost.censersDiscount} }\nset_temp_variable = { zin_keep = 1 }\nsubtract_from_temp_variable = { zin_keep = zin_disc }\nmultiply_temp_variable = { zin_cost = zin_keep }\nmultiply_temp_variable = { zin_cost = -1 }\nadd_political_power = zin_cost\ncustom_effect_tooltip = zin_afrit_tt_houses`,
    remove: 'save_global_event_target_as = zin_afrit_hub\nFROM = { zin_afrit_open_house_resolve = yes }', ai: 'base = 6\nmodifier = {\n factor = 0\n check_variable = { global.zin_afrit_veil < 40 }\n}\nmodifier = {\n factor = 0\n has_war = yes\n}' });
  dec.zin_afrit_council.push({ id: 'zin_afrit_hear_confession', icon: 'confessional', art: 'confessional', title: 'Hear the Confession of [FROM.GetName]', desc: 'Priests who sit in the confessional of a foreign court hear what its great ones will not say aloud. The report reaches the hermitage within the week.', visible: `${cmask}\nhas_country_flag = zin_worshipdom_confessors`, rootTrigger: 'has_country_flag = zin_worshipdom_confessors', target: 'FROM = { check_variable = { zin_footholds > 2 } }', available: 'has_political_power > 29', cost: 30, cooldown: 30,
    effect: 'add_intel = {\ntarget = FROM\ncivilian_intel = 30\narmy_intel = 20\n}\nFROM = { save_global_event_target_as = zin_afrit_confessed }\ncountry_event = { id = zin_afrit.7 }', ai: 'base = 2\nmodifier = {\n factor = 0\n check_variable = { global.zin_afrit_veil < 50 }\n}' });
  dec.zin_afrit_council.push({ id: 'zin_afrit_call_debt', icon: 'ledger_coins', art: 'ledger_coins', title: 'Call In a Debt at [FROM.GetName]', desc: 'The Houses have been kind to this court for years. A letter reminds it of the kindness, and asks for a small return.', visible: `${cmask}\nhas_country_flag = zin_worshipdom_debts`, rootTrigger: 'has_country_flag = zin_worshipdom_debts', target: 'FROM = {\ncheck_variable = { zin_footholds > 3 }\nNOT = { has_war_with = ROOT }\n}', available: 'has_political_power > 49', cost: 50, cooldown: 90,
    effect: 'FROM = { country_event = { id = zin_afrit.6 } }', ai: 'base = 1\nmodifier = {\n factor = 0\n check_variable = { global.zin_afrit_veil < 60 }\n}' });
  dec.zin_afrit_council.push({ id: 'zin_afrit_silence_dissenter', icon: 'seal_wax', art: 'seal_wax', title: 'Silence a Dissenter', desc: 'A preacher in some far town has begun to ask the wrong questions. The Hands of Mercy go to him, and he is quiet. Usually.', visible: `${cmask}\nhas_country_flag = zin_worshipdom_quiet_hands`, available: 'has_political_power > 39', cost: 40, cooldown: 60,
    effect: `custom_effect_tooltip = zin_afrit_tt_silent\nhidden_effect = {\nrandom_list = {\n75 = {\n${call('zin_afrit_add_veil', { value: 8 })}\n}\n25 = {\n${call('zin_afrit_add_veil', { value: -10 })}\n}\n}\n${call('zin_world_add_gathering_dark', { value: 1 })}\n}`, ai: 'base = 2\nmodifier = {\n factor = 0\n check_variable = { global.zin_afrit_veil > 70 }\n}' });
  loc.set('zin_afrit_tt_silent', 'The Hands of Mercy go quietly.');
  dec.zin_afrit_council.push({ id: 'zin_afrit_steer_the_court', icon: 'seal_chancellor', art: 'seal_chancellor', title: 'Steer the Court', desc: 'A letter to Merovan, in the hand of the Council, tells him how the King should be advised this month.', visible: `${cmask}\nhas_country_flag = zin_worshipdom_merovan`, available: `NOT = { zin_afrit_rules_here = yes }\nhas_political_power > 49`, cost: 50, cooldown: 90,
    effect: `${call('zin_aenor_add_council_influence', { value: 5 })}\ncustom_effect_tooltip = zin_afrit_tt_chapter`, ai: 'base = 3\nmodifier = {\n factor = 0\n zin_rules_is_historical = no\n}' });
  const edict = (key, title, desc, cost, req, extra) => dec.zin_afrit_council.push({ id: `zin_afrit_edict_of_${key}`, icon: 'scroll_sealed', art: 'scroll_sealed', title, desc, visible: `${cmask}\n${req}`, available: `OR = {\nzin_afrit_rules_here = yes\nhas_country_flag = zin_worshipdom_edicts_unc\n}\nany_country = {\nzin_afrit_rules_here = yes\nzin_aenor_is_realm = yes\n}`, cost, cooldown: key === 'the_temple_treasury' ? 180 : 60, effect: extra, ai: key === 'summons' ? 'base = 3\nmodifier = {\n factor = 0\n NOT = { any_country = { zin_aenor_is_realm = yes has_war = yes } }\n}' : key === 'the_temple_treasury' ? 'base = 2\nmodifier = {\n factor = 0\n has_political_power > 49\n}' : 'base = 1' });
  edict('arms', 'The Edict of Arms', 'The King\'s edict puts every muster-roll in the temples\' hands, and every drill-yard under the altar.', 75, 'has_country_flag = zin_worshipdom_edicts_of_arms', `any_country = {\nlimit = { zin_afrit_rules_here = yes zin_aenor_is_realm = yes }\nadd_timed_idea = { idea = zin_afrit_edict_of_arms days = 180 }\n}\ncustom_effect_tooltip = zin_afrit_tt_chapter`);
  edict('the_faithful', 'The Edict of the Faithful', 'Two dominions of the Concord are told that the Houses of the First Light are to be given a place in their halls.', 50, 'always = yes', `any_country = {\nlimit = { zin_afrit_rules_here = yes zin_aenor_is_realm = yes }\nadd_stability = 0.05\n}\n${call('zin_afrit_spread_footholds', { region: 1, value: 1, count: 2, min: 0, below: 6 })}`);
  edict('the_temple_treasury', 'The Edict of the Temple Treasury', 'The treasury of the kingdom and the treasury of the temples are, for a season, one purse. The hermitage is richer for it.', 0, 'always = yes', `any_country = {\nlimit = { zin_afrit_rules_here = yes zin_aenor_is_realm = yes }\nadd_political_power = -100\n}\nadd_political_power = 100\n${call('zin_afrit_add_veil', { value: -3 })}`);
  edict('summons', 'The Edict of Summons', 'The King summons the lords of every dominion to swear again. Most come.', 75, 'always = yes', `any_country = {\nlimit = { zin_afrit_rules_here = yes zin_aenor_is_realm = yes }\n${call('zin_aenor_add_concord_loyalty_all', { value: 5 })}\n}`);
  dec.zin_afrit_council.push({ id: 'zin_afrit_open_famine_stores', icon: 'granary', art: 'granary', title: 'Open the Famine Stores at [FROM.GetName]', desc: 'Where war or hunger has broken a court, the Houses open their stores to all, and ask nothing but gratitude.', visible: `${cmask}\nhas_country_flag = zin_worshipdom_famine_stores`, rootTrigger: 'has_country_flag = zin_worshipdom_famine_stores', target: 'FROM = {\nNOT = { zin_afrit_is_hub = yes }\nOR = {\nhas_war = yes\ncheck_variable = { var = stability value = 0.4 compare = less_than }\n}\n}', available: 'has_political_power > 49', cost: 50, cooldown: 120,
    effect: `FROM = {\nadd_stability = 0.05\nadd_opinion_modifier = { target = ROOT modifier = zin_afrit_opinion_famine_stores }\n${call('zin_afrit_add_footholds', { value: 1 })}\n}`, ai: 'base = 3\nmodifier = {\n factor = 0\n check_variable = { global.zin_afrit_veil < 40 }\n}' });
  dec.zin_afrit_council.push({ id: 'zin_afrit_draw_on_necklace', icon: 'necklace_deep', art: 'necklace_deep', title: 'Draw on the Necklace', desc: 'The Necklace of the Abyss gives what it is asked for, for thirty days. Something in the vault is a little colder afterwards.', visible: `${cmask}\nNOT = { has_global_flag = zin_afrit_lost_necklace }`, available: 'has_political_power > 99', cost: 100,
    cooldown: 180,
    effect: `any_country = {\nlimit = { zin_afrit_rules_here = yes }\nadd_timed_idea = { idea = zin_afrit_necklace_drawn days = 30 }\n}\n${call('zin_afrit_add_veil', { value: -10 })}\n${call('zin_world_add_gathering_dark', { value: 2 })}\ncustom_effect_tooltip = zin_afrit_tt_vaults`, ai: 'base = 0\nmodifier = {\n add = 4\n has_war = yes\n}\nmodifier = {\n factor = 0\n check_variable = { global.zin_afrit_veil < 50 }\n}' });
  dec.zin_afrit_council.push({ id: 'zin_afrit_send_the_thief', icon: 'scout_lantern', art: 'scout_lantern', title: 'Send the Thief to [FROM.GetName]', desc: 'The man who does not age goes to a foreign court with his light hands. What he brings back is worth a season of research. If he is caught, it is worth a great deal less.', visible: `${cmask}\nhas_country_flag = zin_worshipdom_thief`, rootTrigger: 'has_country_flag = zin_worshipdom_thief', target: 'FROM = {\nNOT = { zin_afrit_is_hub = yes }\ncheck_variable = { zin_footholds > 0 }\n}', available: 'has_political_power > 74\nhas_character = zin_sevrin', cost: 75, days: 45, cooldown: 180,
    remove: `hidden_effect = {\nrandom_list = {\n80 = {\nrandom_list = {\n1 = { add_tech_bonus = { name = zin_afrit_thief_bonus bonus = 0.5 uses = 1 category = zin_cat_scholarship } }\n1 = { add_tech_bonus = { name = zin_afrit_thief_bonus bonus = 0.5 uses = 1 category = zin_cat_seals } }\n1 = { add_tech_bonus = { name = zin_afrit_thief_bonus bonus = 0.5 uses = 1 category = zin_cat_wards } }\n}\n${call('zin_afrit_add_veil', { value: -3 })}\n}\n20 = {\n${call('zin_afrit_add_veil', { value: -10 })}\nFROM = { add_opinion_modifier = { target = ROOT modifier = zin_afrit_opinion_thief_caught } }\n}\n}\n}\ncustom_effect_tooltip = zin_afrit_tt_chapter`, ai: 'base = 2\nmodifier = {\n factor = 0\n check_variable = { global.zin_afrit_veil < 50 }\n}' });
  dec.zin_afrit_council.push({ id: 'zin_afrit_raise_the_faithful', icon: 'banner_plain', art: 'banner_plain', title: 'Raise the Faithful in [FROM.GetName]', desc: 'The Houses answer at last as what they are. The Faithful of the land rise at the Deliverer\'s word, and the court has thirty days to decide whose servants it is.', visible: `${cmask}\nhas_country_flag = zin_worshipdom_faithful_rise\nhas_global_flag = zin_afrit_revealed`, rootTrigger: 'has_country_flag = zin_worshipdom_faithful_rise', target: 'FROM = {\ncheck_variable = { zin_footholds > 4 }\nNOT = { zin_afrit_is_hub = yes }\nNOT = { has_war_with = ROOT }\n}', available: 'has_political_power > 149', cost: 150, days: 30, cooldown: 365,
    effect: 'custom_effect_tooltip = zin_afrit_tt_faithful_rise',
    remove: `FROM = {\nset_temp_variable = { zin_arg_value = 20 }\nset_temp_variable = { zin_arg_ideology = 3 }\nzin_politics_add_drift = yes\nif = {\nlimit = { check_variable = { party_popularity_100@communism > 39 } }\nstart_civil_war = {\nideology = communism\nsize = 0.35\n}\n}\n}`, ai: 'base = 1\nmodifier = {\n factor = 0\n NOT = { has_game_rule = { rule = zin_rule_afrit option = ASHEN } }\n}' });
  loc.set('zin_afrit_tt_faithful_rise', 'The Faithful rise in the land.');
  loc.set('zin_afrit_opinion_famine_stores', 'The Famine Stores Were Opened');
  loc.set('zin_afrit_opinion_thief_caught', 'A Thief Was Caught');
  dec.zin_afrit_cat_houses.push({ id: 'zin_afrit_close_houses', icon: 'fort_wall', art: 'fort_wall', title: 'Close the Houses of the First Light', desc: 'The court has weighed the hospitals, the granaries and the scribes against what the pilgrims ask, and has found the price too high. The doors are shut.', visible: 'check_variable = { zin_footholds > 0 }\nNOT = { zin_afrit_is_hub = yes }', available: 'zin_afrit_can_close_houses = yes', cost: 50, cooldown: 365,
    effect: 'zin_afrit_purge_houses = yes', ai: 'base = 10\nmodifier = {\n factor = 6\n has_global_flag = zin_afrit_revealed\n has_government = democratic\n}\nmodifier = {\n factor = 5\n has_country_flag = zin_lost_cause_member\n has_global_flag = zin_afrit_revealed\n}\nmodifier = {\n factor = 3\n has_country_flag = zin_afrit_suspicious\n}\nmodifier = {\n factor = 0\n NOT = { has_global_flag = zin_afrit_revealed }\n NOT = { has_country_flag = zin_afrit_suspicious }\n}' });
  const body = Object.entries(dec).map(([cat, ds]) => blk(cat, ds.map(d => writeDecision({ ...d, allowed: d.allowed ?? (cat === 'zin_afrit_council' ? `original_tag = ${HUB}` : 'always = yes') }, loc, sprites)).join('\n'))).join('\n');
  staged.text('common/decisions/zin_afrit.txt', format(`${hdr(MOD, SPEC, 'The Council\'s decisions (hub only) and the Houses decision of any other court. The eastern spec adds three hub decisions to the category from its own file.')}\n${body}\n`));
  // The opinion modifiers of two Council decisions (section "The Council's decisions"): the target's opinion of the hub after the famine stores
  // are opened (+20) and after the thief is caught (-30). Both fade by one a month.
  const opinions = { zin_afrit_opinion_famine_stores: 20, zin_afrit_opinion_thief_caught: -30 };
  staged.text('common/opinion_modifiers/zin_afrit.txt', format(`${hdr(MOD, SPEC, 'Opinion modifiers of the Council\'s decisions.')}\nopinion_modifiers = {\n${Object.entries(opinions).map(([id, v]) => blk(id, `value = ${v}\ndecay = 1`)).join('\n')}\n}\n`));

  // ---------------------------------------------------------------------------------------------- events (the ids 06_events does not carry)
  const events = [];
  const footholdLines = roster.map(c => {
    const t = table.get(c.tag), region = economy.regionByRoster[c.scan];
    const n = startFootholds(D, c, t.people, region);
    return n > 0 ? `${c.tag} = { set_variable = { zin_footholds = ${n} } zin_afrit_refresh_houses = yes }` : null;
  }).filter(Boolean);
  const hubStates = await stateProvinces(HUB);
  const capitalProv = hubStates.find(s => s.id === need(D.hub).capitalState)?.first ?? hubStates[0]?.first;
  const hubStart = list(
    'zin_afrit_startup_values = yes',
    `${HUB} = {`, 'add_ideas = zin_worshipdom_temple_state',
    ...D.characters.filter(c => !c.hidden).map(c => `recruit_character = ${c.id}`),
    'delete_unit = { division_template = "Valley Wardens" }',
    'if = {', 'limit = { NOT = { has_template = "Hermitage Guard" } }', 'division_template = {', 'name = "Hermitage Guard"', `division_names_group = ${T.hostGroup}`, 'regiments = {',
    'zin_men_temple_wardens = { x = 0 y = 0 }', 'zin_men_temple_wardens = { x = 0 y = 1 }', 'zin_men_temple_wardens = { x = 1 y = 0 }', 'zin_men_temple_wardens = { x = 1 y = 1 }', 'zin_men_archers = { x = 2 y = 0 }', 'zin_men_archers = { x = 2 y = 1 }', '}', 'support = {', 'zin_support_healers = { x = 0 y = 0 }', '}', '}', '}',
    'create_unit = {', 'division = "name = \\"The Hermitage Guard\\" division_template = \\"Hermitage Guard\\" start_experience_factor = 0.3 start_equipment_factor = 1"', `owner = ${HUB}`, `prioritize_location = ${capitalProv}`, 'count = 2', '}', '}');
  events.push({ id: 1, kind: 'hidden', immediate: list(hubStart, ...footholdLines, 'zin_afrit_refresh_graces = yes') });
  events.push({ id: 2, kind: 'hidden', immediate: 'zin_afrit_monthly = yes' });
  events.push({ id: 3, kind: 'country', title: 'A House Opens in [zin_afrit_hub_target.GetName]', picture: 'houses', requires: [],
    desc: 'The masons have finished their work in [zin_afrit_hub_target.GetName]. A hospital, a granary and a school of scribes have opened their doors under the First Light, and the neighbours have already begun to come.',
    options: [{ key: 'a', text: 'Let it grow quietly.' }] });
  events.push({ id: 4, kind: 'country', title: 'Suspicion in [zin_afrit_hub_target.GetName]', picture: 'houses',
    desc: 'The court of [zin_afrit_hub_target.GetName] has asked what the pilgrims want, and has not liked the answers. A watcher stands at every door of the new house.',
    options: [
      { key: 'a', text: 'Withdraw the pilgrims.', ai: 30, effect: `event_target:zin_afrit_hub_target = {\n${call('zin_afrit_add_footholds', { value: -1 })}\n}\n${call('zin_afrit_add_veil', { value: 3 })}` },
      { key: 'b', text: 'Brazen it out.', ai: 50 },
      { key: 'c', text: 'Pay for silence.', ai: 20, effect: `add_political_power = -50\n${call('zin_afrit_add_veil', { value: 2 })}` },
    ] });
  events.push({ id: 5, kind: 'country', title: 'The Houses Are Closed in [zin_afrit_hub_target.GetName]', picture: 'houses',
    desc: 'The doors of the First Light are shut in [zin_afrit_hub_target.GetName]. The priests have gone, and the granary is locked. It will take a long time to open them again.',
    options: [{ key: 'a', text: 'It is written in the ledger.' }] });
  events.push({ id: 6, kind: 'country', title: 'The Faithful Ask a Favour', picture: 'houses',
    desc: 'The hermitage reminds our court of its kindness. Its envoy asks, without raising his voice, for a small return: arms for the pilgrims\' guard, or passage for their column.',
    options: [
      { key: 'a', text: 'Send them the equipment.', ai: 40, effect: `add_equipment_to_stockpile = { type = zin_arms_equipment amount = -500 }\nevent_target:zin_afrit_hub = { add_equipment_to_stockpile = { type = zin_arms_equipment amount = 500 } }` },
      { key: 'b', text: 'Grant them passage.', ai: 40, effect: 'event_target:zin_afrit_hub = { give_military_access = ROOT }' },
      { key: 'c', text: 'Refuse.', ai: 20, effect: `${call('zin_afrit_add_footholds', { value: -1 })}` },
    ] });
  events.push({ id: 7, kind: 'country', title: 'What the Confessors Heard', picture: 'council_chamber',
    desc: 'The confessors of [zin_afrit_confessed.GetName] have written to the hermitage. The court [zin_afrit_confessed.zin_afrit_confession_word].',
    options: [{ key: 'a', text: 'The ledger is filled.' }] });
  events.push({ id: 8, kind: 'hidden', immediate: 'set_global_flag = zin_afrit_at_yeldenne' });
  events.push({ id: 9, kind: 'hidden', immediate: `set_temp_variable = { zin_nk = 0 }\nevery_country = {\n\tlimit = { has_country_flag = zin_afrit_eastern_client }\n\tadd_to_temp_variable = { zin_nk = 1 }\n}\nif = {\n\tlimit = { check_variable = { zin_nk > 1 } }\n\tzin_afrit_proclaim_king_of_east = yes\n\tnews_event = { id = zin_afrit.52 }\n}` });
  events.push({ id: 41, kind: 'country', title: 'The Veil Thins', picture: 'council_chamber',
    desc: 'The Veil is thin. In the Light courts the priests of the Houses are watched, and the pilgrims have begun to be asked who sent them. Another unwise week and the name will be on every tongue.',
    options: [{ key: 'a', text: 'Mend it, or hold your breath.' }] });
  events.push({ id: 42, kind: 'country', title: 'The Name Is Spoken', picture: 'unmasking', requires: ['zin_afrit_revealed'],
    desc: 'The name is spoken in the open: Afrit, in every hall that has ears. The Veil is gone. What was patient work is now a war for belief, and the Houses must choose whose servants they are.',
    options: [{ key: 'a', text: 'Then let it be known.' }] });
  events.push({ id: 44, kind: 'country', title: 'Unmasked Too Soon', picture: 'unmasking', requires: ['zin_afrit_revealed'],
    desc: 'The name came out before the crown was taken. The kingdom has seen the thing that the temples served, and the Houses are watched in every land. This is what the Council\'s work was meant to avoid.',
    options: [{ key: 'a', text: 'We begin again from the ruin.' }] });
  events.push({ id: 54, kind: 'country', title: 'The War Council of the East', picture: 'eastern_court', requires: ['zin_afrit_abandoned_aenor'],
    desc: 'The kings of the East sit in council at the Dawn, and the Deliverer takes the marshal\'s chair himself. The Necklace is on his breast. The kings do not look at it.',
    immediate: 'zin_aurevan = {\n\tadd_field_marshal_role = {\n\t\tcharacter = zin_aurevan\n\t\tskill = 5\n\t}\n}',
    options: [{ key: 'a', text: 'Let the council sit.' }] });
  events.push({ id: 90, kind: 'country', title: 'A Healing in [Root.GetName]', picture: 'houses',
    desc: 'A woman who had been ill for a year rose from her bed in the house of the First Light and walked to the well. The neighbours say it was the god. The physicians say it was the broth.',
    trigger: 'check_variable = { zin_footholds > 1 }\nzin_afrit_secret_kept = yes\nNOT = { zin_afrit_is_hub = yes }', mtth: 'days = 720',
    options: [{ key: 'a', text: 'Let the people believe what they will.', effect: 'add_stability = 0.01' }] });
  events.push({ id: 91, kind: 'country', title: 'The Pilgrims\' Tale', picture: 'hermitage',
    desc: 'A pilgrim returned from the far South tells the hermitage a story that is half a song. A city by a lake, a king who wears a veil, a river that runs the wrong way. The scribes write it down.',
    trigger: `zin_afrit_is_hub = yes\nNOT = { has_global_flag = zin_afrit_dead }`, mtth: 'days = 540',
    options: [{ key: 'a', text: 'Keep it in the ledger.', effect: 'add_political_power = 15' }] });
  events.push({ id: 92, kind: 'country', title: 'The Thief Grows Restless', picture: 'council_chamber',
    desc: 'Sevrin has not been out of the Reliquary in two years. He walks the vault at night and counts the shelves. He says he has been here long enough to know when a thing is hungry.',
    trigger: `zin_afrit_is_hub = yes\nhas_character = zin_sevrin\nhas_country_flag = zin_afrit_sevrin_guest\nNOT = { has_global_flag = zin_afrit_dead }`, mtth: 'days = 730',
    options: [
      { key: 'a', text: 'Send him out.', ai: 50, effect: `add_political_power = -50\n${call('zin_afrit_add_veil', { value: -2 })}` },
      { key: 'b', text: 'Keep him close.', ai: 50 },
    ] });
  // the event targets named in text: events 3 to 5 are fired with the target saved by the resolving effect
  const written = events.map(e => writeEvent('zin_afrit', e, loc, { okText: 'It is written.', hiddenOk: 'The month turns.' }));
  staged.text('events/zin_afrit_mechanic.txt', format(`${hdr(MOD, SPEC, 'Namespace zin_afrit, the mechanic\'s own events. The events of 06_events (10-17, 20-23, 30-34, 40, 43, 45, 50-53, 60-62, 70-76, 80) are written by the events slice.')}\nadd_namespace = zin_afrit\n${written.map(w => w.text).join('\n')}\n`));

  // ---------------------------------------------------------------------------------------------- on_actions
  staged.text('common/on_actions/zin_afrit.txt', format(`${hdr(MOD, SPEC, 'Start; the Council\'s monthly pulse (hub only); Parim changing hands.')}
on_actions = {
	on_startup = {
		effect = {
			${HUB} = { country_event = { id = zin_afrit.1 } }
		}
	}
	on_monthly = {
		effect = {
			if = {
				limit = { zin_afrit_is_hub = yes }
				country_event = { id = zin_afrit.2 }
			}
		}
	}
	on_state_control_changed = {
		effect = {
			if = {
				limit = { zin_is_site_parim = yes }
				zin_afrit_refresh_graces = yes
			}
		}
	}
}
`));

  // ---------------------------------------------------------------------------------------------- the map mode
  loc.set('MAPMODE_ZIN_FOOTHOLDS_MAP_MODE', 'Houses of the First Light');
  loc.set('MAPMODE_ZIN_FOOTHOLDS_MAP_MODE_NAME', 'Houses of the First Light');
  loc.set('MAPMODE_ZIN_FOOTHOLDS_MAP_MODE_DESCRIPTION', 'Shows where a House of the First Light serves.');
  loc.set('zin_footholds_map_mode_tooltip', 'Houses of the First Light');
  loc.set('zin_footholds_map_mode_tooltip_delayed', 'Houses of the First Light');
  sprites.use('GFX_mapmode_buttons_deselected_small_zin_footholds_map_mode', 'house_first_light');
  sprites.use('GFX_mapmode_buttons_selected_small_zin_footholds_map_mode', 'house_first_light');
  const ramp = [[0.80, 0.78, 0.70], [0.86, 0.80, 0.55], [0.88, 0.76, 0.40], [0.86, 0.70, 0.26], [0.80, 0.60, 0.14]];
  staged.text('common/map_modes/zin_footholds.txt', format(`${hdr(MOD, SPEC, 'The hub sees every depth, in a ramp from pale ivory to deep gold (suspicious courts pulse, capped courts are dark grey). Everyone else sees one warm colour where a House serves (footholds 2 or more) and nothing else.')}
scripted_map_modes = {
	zin_footholds_map_mode = {
		top = {
			type = country
			color = {
				if = {
					limit = { zin_afrit_is_hub = yes }
					set_temp_variable = { red = 0.25 }
					set_temp_variable = { green = 0.25 }
					set_temp_variable = { blue = 0.27 }
					set_temp_variable = { alpha = 1 }
					FROM = {
${ramp.map((c, i) => `\t\t\t\t\t\t${i ? 'else_if' : 'if'} = {\n\t\t\t\t\t\t\tlimit = { check_variable = { zin_footholds = ${i + 1} } }\n\t\t\t\t\t\t\tset_temp_variable = { red = ${c[0]} }\n\t\t\t\t\t\t\tset_temp_variable = { green = ${c[1]} }\n\t\t\t\t\t\t\tset_temp_variable = { blue = ${c[2]} }\n\t\t\t\t\t\t}`).join('\n')}
						if = {
							limit = { has_country_flag = zin_afrit_suspicious }
							set_temp_variable = { highlighted = 1 }
						}
					}
				}
				else = {
					set_temp_variable = { red = 0.88 }
					set_temp_variable = { green = 0.74 }
					set_temp_variable = { blue = 0.42 }
					set_temp_variable = { alpha = 1 }
				}
			}
			targets = {
				target_trigger = {
					FROM = { check_variable = { zin_footholds > 0 } }
				}
			}
		}
		bottom = {
			type = none
		}
	}
}
`));

  // ---------------------------------------------------------------------------------------------- the panel and the text
  const gui = afritGui.build(staged, { loc, sprites, file: 'afrit_council' });
  staged.text('interface/zz_zin_afrit.gfx', sprites.text(hdr(MOD, SPEC, 'Sprites of the Council: decision icons, categories, modifiers, the panel and the map mode buttons (catalog icons until the art pass).')));
  const entries = loc.entries();
  const privateKey = k => /(_hub|_true|_revealed|_private)(_long)?$/.test(k) || /^zin_name_afrit/.test(k) || /^zin_afrit\.(7|41|42|44|54|91|92)\./.test(k);
  const problems = [...await wordProblems(entries), ...notCp1252(entries), ...secrecyLeaks(entries, privateKey)];
  if (problems.length) throw new Error(`mech_afrit text breaks the rules (${problems.length}):\n  ${problems.slice(0, 30).join('\n  ')}`);
  staged.add('localisation/english/zin_afrit_l_english.yml', loc.bytes());
  const defs = { triggers: [...Object.keys(triggers), ...(dates.match(/^\w+(?= = \{)/gm) ?? [])], effects: [...Object.keys(effects), ...afritGui.effectNames()], ideas: ideas.map(i => i.id), decisions: Object.values(dec).flat().map(d => d.id), categories: Object.keys(cats), events: events.map(e => `zin_afrit.${e.id}`), opinionModifiers: Object.keys(opinions), dynamicModifiers: ['zin_afrit_houses', 'zin_afrit_graces'], characters: D.characters.map(c => c.id), traits: allTraits.map(t => t.id), scriptedLoc: sl.length, twoFace: faces.length };
  return { counts: Object.fromEntries(Object.entries(defs).map(([k, v]) => [k, Array.isArray(v) ? v.length : v])), definitions: defs, tags: T, loc: entries, gui, eventMeta: written.map(w => w.meta), decisions: dec, footholds: footholdLines.length, twoFace: faces, facesSource };
}
