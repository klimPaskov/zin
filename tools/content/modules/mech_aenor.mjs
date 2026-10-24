// Aenor: the Golden Court and the succession (docs/specs/04_mechanics/aenor_court_and_succession.md).
//   await buildAenor(staged, { countries })
// Writes the scripted triggers and effects, dynamic modifiers, ideas, decisions, the mechanic's own events (the ids that 06_events
// does not carry), on_actions, the collective leaders, scripted localisation, the Golden Court panel and the text.
// Returns { counts, files, dependencies, references, tags } for the tests and the integration note.
import { readFile, readdir } from 'node:fs/promises';
import { assertModifiers } from '../lib/core.mjs';
import { ZIN } from '../lib/paths.mjs';
import { stateOwners } from '../lib/roster.mjs';
import { parse } from '../lib/clausewitz.mjs';
import { aenorScripts } from '../lib/mech_aenor_script.mjs';
import { aenorGui } from '../lib/mech_court_gui.mjs';
import { Loc, Sprites, loadJson, loadCatalogKeys, hdr, dedent, format, list, blk, writeEvent, writeDecision, category, call, wordProblems, secrecyLeaks, notCp1252, tipper } from '../lib/mech_court_lib.mjs';
import { aenorStory } from '../lib/mech_aenor_story.mjs';

const SPEC = 'docs/specs/04_mechanics/aenor_court_and_succession.md';
const MOD = 'mech_aenor';

// First province of every state a country owns at the start (history/states, the politics step's output), and the capital's victory-point province.
let statesCache;
// Every state of the map: id, start owner (the realm of data/world/state_assignment.json), first province (the victory-point province when there is one) and provinces.
export async function allStates() {
  if (statesCache) return statesCache;
  const dir = `${ZIN}/history/states`, out = [], owners = stateOwners();
  for (const f of (await readdir(dir)).filter(n => n.endsWith('.txt'))) {
    const text = await readFile(`${dir}/${f}`, 'utf8');
    const id = Number(text.match(/\bid = (\d+)/)?.[1]), owner = owners.get(id);
    const provinces = String(text.match(/provinces = \{([^}]*)\}/)?.[1] ?? '').trim().split(/\s+/).filter(Boolean).map(Number);
    const vp = Number(text.match(/victory_points = \{\s*(\d+)/)?.[1] ?? 0);
    out.push({ id, owner, first: vp || provinces[0], provinces });
  }
  return (statesCache = out.sort((x, y) => x.id - y.id));
}
export async function stateProvinces(tag) { return (await allStates()).filter(s => s.owner === tag); }

export function resolveTags(D, roster, wantRoster = true) {
  const byName = new Map(roster.map(c => [c.name, c]));
  const need = n => { const c = byName.get(n); if (!c) throw new Error(`mech_aenor: ${n} is not in the roster`); return c; };
  const T = { aenor: need(D.realm).tag, hub: need(D.hub).tag, selen: need(D.selen).tag };
  T.rulerId = `${T.aenor}_zin_ruler`;
  T.dominions = D.dominions.map(d => {
    const c = need(d.name);
    if (c.overlord !== D.realm) throw new Error(`mech_aenor: ${d.name} is not a subject of ${D.realm} in the roster`);
    return { ...d, tag: c.tag, states: c.states };
  });
  return T;
}

export async function buildAenor(staged, ctx) {
  const D = await loadJson('mech_aenor.json'), roster = ctx.countries;
  const T = resolveTags(D, roster);
  const W = JSON.parse(await readFile(new URL('../data/warfare_ids.json', import.meta.url), 'utf8'));
  T.hostGroup = W.hostGroupByCountry[D.realm];
  const loc = new Loc(), sprites = new Sprites(await loadCatalogKeys());
  const AEN = T.aenor, R = D.rates;
  const { triggers, effects } = aenorScripts(D, T);
  const dates = triggers.__dates; delete triggers.__dates;

  // ---------------------------------------------------------------------------------------------- triggers and effects
  const trigText = Object.entries(triggers).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([n, b]) => blk(n, b)).join('\n');
  staged.text('common/scripted_triggers/zin_aenor_court.txt', format(`${hdr(MOD, SPEC, 'Triggers of the Golden Court and the succession. Every Aenor script tests zin_aenor_is_realm (original tag), never a tag.')}\n${trigText}\n${dates}\n`));
  const effText = Object.entries(effects).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([n, b]) => blk(n, b)).join('\n');
  const uiEffects = aenorGui.effects();
  staged.text('common/scripted_effects/zin_aenor_court.txt', format(`${hdr(MOD, SPEC, 'Effects of the Golden Court and the succession. Arguments are the temporary variables zin_arg_<name> (decision E1).')}\n${effText}\n${uiEffects}\n`));

  // ---------------------------------------------------------------------------------------------- scripted localisation
  staged.text('common/scripted_localisation/zin_aenor_court.txt', format(`${hdr(MOD, SPEC, 'Band words, charter names and ticks for the Golden Court panel.')}
${aenorGui.scriptedLoc(D, loc)}
`));

  // ---------------------------------------------------------------------------------------------- dynamic modifiers
  loc.set('zin_aenor_golden_court', 'The Golden Court');
  loc.set('zin_aenor_golden_court_desc', 'Offices, titles and charters are bought in the palace district of Parim. The more is sold, the more the court pays the crown in favours and the less the kingdom works.');
  loc.set('zin_aenor_temple_favour', 'Temple Favour');
  loc.set('zin_aenor_temple_favour_desc', 'How many offices are held by friends of the temples. The temples truly help: the granaries are full and the sick are tended. That is why nobody asks what they ask in return.');
  loc.set('zin_aenor_hidden_hand', 'The Hidden Hand');
  loc.set('zin_aenor_hidden_hand_desc', 'The offices held by friends of the temples are the reach of a will that hides behind them. It still tends the sick and fills the granaries.');
  const dmArt = { zin_aenor_golden_court: 'ledger_coins', zin_aenor_temple_favour: 'house_first_light', zin_aenor_hidden_hand: 'mask_veiled' };
  const dmMods = {
    zin_aenor_golden_court: { political_power_gain: 'zin_aenor_dm_court_pp', consumer_goods_factor: 'zin_aenor_dm_court_cg', stability_factor: 'zin_aenor_dm_court_stab', production_factory_max_efficiency_factor: 'zin_aenor_dm_court_eff' },
    zin_aenor_temple_favour: { stability_factor: 'zin_aenor_dm_temple_stab', drift_defence_factor: 'zin_aenor_dm_temple_drift', monthly_population: 'zin_aenor_dm_temple_pop' },
    zin_aenor_hidden_hand: { stability_factor: 'zin_aenor_dm_temple_stab', drift_defence_factor: 'zin_aenor_dm_temple_drift', monthly_population: 'zin_aenor_dm_temple_pop' },
  };
  for (const [id, mods] of Object.entries(dmMods)) await assertModifiers(id, mods);
  staged.text('common/dynamic_modifiers/zin_aenor_court.txt', format(`${hdr(MOD, SPEC, 'The Golden Court (corruption) and Temple Favour (Council influence); the values are variables recomputed by zin_aenor_refresh_modifiers.')}\n${Object.entries(dmMods).map(([id, mods]) => blk(id, list(`icon = GFX_modifiers_${id}`, Object.entries(mods).map(([k, v]) => `${k} = ${v}`)))).join('\n')}\n`));
  for (const id of Object.keys(dmMods)) sprites.use(`GFX_modifiers_${id}`, dmArt[id]);

  // ---------------------------------------------------------------------------------------------- ideas
  const ideaList = [];
  const addIdea = (id, o) => {
    ideaList.push({ id, ...o });
    loc.set(id, o.name);
    loc.set(`${id}_desc`, o.desc);
  };
  addIdea('zin_aenor_seventeen_centuries', { name: 'Seventeen Centuries of the Crown', desc: 'Whatever the King does, the courts sit, the roads are kept and the tithe is counted. Seventeen centuries of habit keep a bad king\'s kingdom running.', picture: 'palace_parim', mods: { stability_factor: 0.1, production_speed_buildings_factor: 0.1 } });
  addIdea('zin_aenor_lost_cause_court', { name: 'The Lost Cause', desc: 'The Golden King\'s league against the powers of the dark. Its parades are for the court; its frontier companies and its scholars are real.', picture: 'banner_league', mods: { political_power_gain: 0.15, war_support_factor: 0.03, consumer_goods_factor: 0.02 } });
  addIdea('zin_aenor_kings_tasters', { name: 'The King\'s Tasters', desc: 'Nothing reaches the King\'s lips that three servants have not tasted first. It slows whatever hand reaches for him, and tells it that someone watches.', picture: 'healer_herbs', mods: { stability_factor: 0.02 } });
  addIdea('zin_aenor_interregnum', { name: 'The Empty Throne', desc: 'The seals lie on an empty chair. Every office waits to learn whom it serves, and no one will give an order he cannot prove is his to give.', picture: 'empty_throne', mods: { political_power_factor: -0.25, stability_weekly: -0.002, drift_defence_factor: -0.3 } });
  addIdea('zin_aenor_free_dominion', { name: 'A Free Dominion', desc: 'The lords have broken their Charter and answer to no crown in Parim. They are proud of it, and a little afraid.', picture: 'chain_broken', mods: { stability_factor: 0.05, war_support_factor: 0.05 } });
  addIdea('zin_aenor_throne_abandoned', { name: 'The Throne Abandoned', desc: 'The god-king has left the palace and not said when he will return. Parim holds its breath, and the Captains keep the gates.', picture: 'crown_broken', mods: { stability_factor: -0.1, war_support_factor: -0.05 } });
  addIdea('zin_aenor_hailed_king', { name: 'The Hailed King', desc: 'The realm has hailed a king who has not yet been crowned. Men fight better for a name they have shouted in the street.', picture: 'crown_hailed', mods: { war_support_factor: 0.1, army_morale_factor: 0.05 } });
  addIdea('zin_aenor_rightful_king', { name: 'The Rightful King', desc: 'The Crown of Aen sits on a head that the people chose. Whatever it costs, the kingdom has a king it wanted.', picture: 'crown_aen', mods: { stability_factor: 0.15, war_support_factor: 0.1, political_power_gain: 0.5 } });
  for (const c of D.charters) addIdea(`zin_concord_charter_${c.key}`, { name: c.name, desc: c.text, picture: c.picture, mods: c.modifiers });
  for (const i of ideaList) await assertModifiers(i.id, i.mods);
  staged.text('common/ideas/zin_aenor_court.txt', format(`${hdr(MOD, SPEC, 'Mechanic spirits of Aenor and the five Concord charters. They are added and removed by script only.')}
ideas = {
	country = {
${ideaList.map(i => blk(i.id, list(`picture = ${i.picture ? `zin_${i.picture}` : ''}`, 'allowed = { always = no }', 'allowed_civil_war = { always = yes }', 'removal_cost = -1', Object.keys(i.mods).length ? blk('modifier', Object.entries(i.mods).map(([k, v]) => `${k} = ${v}`).join('\n')) : ''))).join('\n')}
	}
}
`));

  // ---------------------------------------------------------------------------------------------- decisions
  const dominionTags = T.dominions.map(d => d.tag);
  const cats = {
    zin_aenor_cat_court: { title: 'The Golden Court', desc: 'The palace district of Parim, where offices, titles and charters are bought, and where the kingdom\'s gold goes.', art: 'ledger_coins', picture: 'palace_parim', visible: 'zin_aenor_is_realm = yes' },
    zin_aenor_cat_concord: { title: 'The Middle Kingdom Concord', desc: 'Twenty-six dominions sworn to Parim by the Charters. Each has its own lords, its own charter and its own patience.', art: 'concord_circle', picture: 'charter_old', visible: 'zin_aenor_is_realm = yes' },
    zin_aenor_cat_lost_cause: { title: 'The Lost Cause', desc: 'The King\'s league against the dark. Its strength is the frontier companies and the scholars, not the parade.', art: 'banner_league', picture: 'lost_cause_triumph' === 'x' ? '' : 'banner_league', visible: 'zin_aenor_is_realm = yes' },
    zin_aenor_cat_kings_health: { title: 'The King\'s Health', desc: 'Questions that a careful court asks about a king who sleeps too well after feasts. They are asked quietly, and answered more quietly still.', art: 'healer_herbs', visible: 'zin_aenor_is_realm = yes\nzin_aenor_king_alive = yes\nhas_completed_focus = zin_aenor_the_kings_tasters\nNOT = { has_game_rule = { rule = zin_rule_golden_king_death option = HISTORICAL } }' },
    zin_aenor_cat_empty_throne: { title: 'The Thirty Days', desc: 'The King is dead and the seals lie on an empty chair. Whoever is chosen to hold them has thirty days to make the choice stick.', art: 'empty_throne', picture: 'throne_gold', visible: 'zin_aenor_is_realm = yes\nhas_country_flag = zin_aenor_thirty_days' },
  };
  staged.text('common/decisions/categories/zin_aenor_court.txt', format(`${hdr(MOD, SPEC, 'Decision categories of the Golden Court.')}\n${Object.entries(cats).map(([id, c]) => category(id, { ...c, allowed: `original_tag = ${AEN}` }, loc, sprites)).join('\n')}\n`));
  // Pictures of a category are decision-view pictures; the spec's categories carry one each.

  const dec = {};
  const add = (cat, d) => { (dec[cat] ??= []).push(d); };
  const arg = (k, v) => `set_temp_variable = { zin_arg_${k} = ${v} }`;
  const aiHist = '	modifier = {\n		factor = 0\n		zin_rules_is_historical = yes\n	}';
  // Court
  add('zin_aenor_cat_court', { id: 'zin_aenor_court_audit', icon: 'ledger_coins', title: 'Open the Ledgers of the Court', desc: 'Send the Chamber of Accounts into the Golden Court under the King\'s seal. Some offices will be emptied and many friends lost, and for a season the rot recedes.', visible: 'zin_aenor_is_realm = yes\ncheck_variable = { zin_court_corruption > 31 }', available: 'zin_aenor_is_realm = yes', cost: 75, days: 30, cooldown: 270,
    effect: `${call('zin_aenor_add_court_corruption', { value: -6 })}\ncustom_effect_tooltip = zin_aenor_court_audit_tt\nadd_stability = -0.01`, ai: `base = 3\nmodifier = {\n factor = 0\n check_variable = { zin_court_corruption < 80 }\n}\n${aiHist}` });
  loc.set('zin_aenor_court_audit_tt', 'Offices are emptied and the court grumbles.');
  add('zin_aenor_cat_court', { id: 'zin_aenor_court_feast_of_offices', icon: 'feast_table', title: 'Hold the Feast of Offices', desc: 'A feast in the gilded halls at which every seat has a price. The treasury sings and the kingdom\'s judges are not what they were.', visible: 'zin_aenor_is_realm = yes\nzin_aenor_king_alive = yes', available: 'zin_aenor_is_realm = yes', cost: 0, cooldown: 150,
    effect: `add_political_power = 60\n${call('zin_aenor_add_court_corruption', { value: 3 })}`, ai: `base = 1\nmodifier = {\n factor = 0\n check_variable = { zin_court_corruption > 79 }\n}\n${aiHist}` });
  add('zin_aenor_cat_court', { id: 'zin_aenor_court_dismiss_favourites', icon: 'seal_royal', title: 'Dismiss the Favourites', desc: 'With the old King gone, the new rule may strip the office-buyers of what they bought. They will not forget it, and neither will their friends.', visible: 'zin_aenor_is_realm = yes\nzin_aenor_king_alive = no', available: 'check_variable = { zin_court_corruption > 25 }', cost: 100, days: 14, cooldown: 365,
    effect: `${call('zin_aenor_add_court_corruption', { value: -10 })}\n${call('zin_aenor_add_camp_support', { camp: 1, value: -8 })}\nadd_stability = 0.02`, ai: 'base = 2\nmodifier = {\n factor = 0\n zin_aenor_ruled_by_court = yes\n}' });
  // Concord: charters
  const reissue = [
    { key: 'old', title: 'Restore the Old Charter of [FROM.GetName]', desc: 'The Charters of Parim as they were first sworn: the dominion keeps its liberties, no more and no less.', cost: 25, needs: 'always = yes', fromNeeds: '', effectExtra: '' },
    { key: 'golden', title: 'Sell a Golden Charter to [FROM.GetName]', desc: 'The lords of the dominion pay in coin and trade for privileges the Golden Court is glad to write. Parim draws more from them, and the lords grumble at the price.', cost: 0, needs: 'OR = {\n has_country_flag = zin_aenor_golden_charters_open\n zin_aenor_ruled_by_court = yes\n}\ncheck_variable = { zin_court_corruption > 39 }\nOR = {\n zin_aenor_king_alive = yes\n zin_aenor_ruled_by_court = yes\n}', effectExtra: `${call('zin_aenor_add_court_corruption', { value: 3 })}\nadd_political_power = 50` },
    { key: 'shield', title: 'Grant a Shield Charter to [FROM.GetName]', desc: 'The dominion keeps a standing company for the Lost Cause, trains it hard, and has the means to do so.', cost: 50, needs: 'has_global_flag = zin_lost_cause_shield', effectExtra: '' },
    { key: 'free', title: 'Grant a Free Charter to [FROM.GetName]', desc: 'The dominion rules itself in all but the crown\'s defence, and gives its tithe freely.', cost: 50, needs: 'OR = {\n has_country_flag = zin_aenor_free_charters_open\n zin_aenor_ruled_by_dominions = yes\n zin_aenor_ruled_by_host = yes\n}', effectExtra: '' },
    { key: 'wall', title: 'Grant a Wall Charter to [FROM.GetName]', desc: 'The dominion keeps a stretch of the Great Wall, and the crown leaves it the means.', cost: 25, needs: 'always = yes', fromNeeds: 'any_owned_state = { zin_is_site_great_wall = yes }', effectExtra: '' },
  ];
  const codeOf = Object.fromEntries(D.charters.map(c => [c.key, c.code]));
  for (const r of reissue) {
    add('zin_aenor_cat_concord', {
      id: `zin_aenor_reissue_charter_${r.key}`, icon: `charter_${r.key}`, art: `charter_${r.key}`, title: r.title, desc: r.desc, targets: dominionTags,
      visible: `zin_aenor_is_realm = yes\nhas_country_flag = zin_aenor_charters_open`,
      rootTrigger: 'has_country_flag = zin_aenor_charters_open',
      target: `FROM = {\nzin_aenor_is_concord_dominion = yes\nNOT = { has_idea = zin_concord_charter_${r.key} }\n${r.fromNeeds ?? ''}\n}`,
      available: `${r.needs}\nNOT = { has_country_flag = zin_aenor_charter_cd }\nFROM = { NOT = { has_country_flag = zin_concord_charter_recent } }`,
      cost: r.cost,
      effect: `FROM = {\n${call('zin_aenor_set_charter', { charter: codeOf[r.key] })}\ncountry_event = { id = zin_aenor.102 }\n}\nset_country_flag = { flag = zin_aenor_charter_cd days = 60 }\n${r.effectExtra}`,
      ai: `base = ${r.key === 'golden' ? 6 : r.key === 'free' ? 4 : r.key === 'wall' ? 2 : r.key === 'shield' ? 3 : 0}\nmodifier = {\n factor = 0\n FROM = { NOT = { zin_aenor_dominion_restless = yes } }\n ${r.key === 'golden' ? 'always = no' : 'always = yes'}\n}`,
    });
  }
  // The AI's rule for charters: Golden while the King lives and corruption >= 40 (historical); Free for Restless dominions otherwise.
  dec.zin_aenor_cat_concord.forEach(d => {
    const key = d.id.replace('zin_aenor_reissue_charter_', '');
    if (key === 'golden') d.ai = 'base = 6\nmodifier = {\n factor = 0\n zin_aenor_king_alive = no\n}\nmodifier = {\n factor = 0\n check_variable = { zin_court_corruption < 40 }\n}';
    else if (key === 'free') d.ai = 'base = 5\nmodifier = {\n factor = 0\n FROM = { zin_aenor_dominion_restless = no }\n FROM = { zin_aenor_dominion_defiant = no }\n}\nmodifier = {\n factor = 0\n zin_aenor_king_alive = yes\n zin_rules_is_historical = yes\n}';
    else d.ai = 'base = 0';
  });
  add('zin_aenor_cat_concord', { id: 'zin_aenor_concord_council', icon: 'concord_circle', art: 'concord_circle', title: 'Convene the Concord Council', desc: 'Summon the lords of every dominion to Parim. They may be told what the crown needs, or they may be told what they are owed.', visible: 'zin_aenor_is_realm = yes', available: 'zin_aenor_is_realm = yes', cost: 50, cooldown: 365,
    effect: 'zin_aenor_convene_concord_council = yes', ai: 'base = 2\nmodifier = {\n factor = 0\n has_country_flag = zin_aenor_council_recent\n}' });
  add('zin_aenor_cat_concord', { id: 'zin_aenor_concord_levy', icon: 'levy_muster', art: 'levy_muster', title: 'Call the Concord Levy', desc: 'Every dominion whose lords are steadfast sends men to Parim\'s banner, and loses a little of its patience doing it. Those who are restless find reasons to send no one.', visible: 'zin_aenor_is_realm = yes', available: 'any_subject_country = {\nzin_aenor_is_concord_dominion = yes\nzin_aenor_dominion_steadfast = yes\n}', cost: 25, cooldown: 180,
    effect: `set_temp_variable = { zin_levy = 0 }
every_subject_country = {
	limit = { zin_aenor_is_concord_dominion = yes }
	if = {
		limit = { zin_aenor_dominion_steadfast = yes }
		add_manpower = -2000
		add_to_temp_variable = { zin_levy = 2000 }
		${call('zin_aenor_add_concord_loyalty', { value: -2 })}
	}
	else_if = {
		limit = { zin_aenor_dominion_restless = yes }
		save_global_event_target_as = zin_aenor_levy_refuser
		OVERLORD = { country_event = { id = zin_aenor.103 } }
	}
}
add_manpower = zin_levy`, ai: `base = 0\nmodifier = {\n add = 4\n has_war = yes\n}` });
  add('zin_aenor_cat_concord', { id: 'zin_aenor_restore_charter', icon: 'chain_broken', art: 'chain_broken', title: 'Restore the Charter of [FROM.GetName]', desc: 'A dominion that tore up its Charter is told that the Charter was never the dominion\'s to tear. The crown will say it again with the host behind it.', targets: dominionTags, visible: 'zin_aenor_is_realm = yes\nhas_country_flag = zin_aenor_restore_by_force', rootTrigger: 'has_country_flag = zin_aenor_restore_by_force',
    target: 'FROM = {\nhas_country_flag = zin_aenor_free_dominion\nNOT = { has_war_with = ROOT }\n}', available: 'has_capitulated = no', cost: 75,
    effect: 'create_wargoal = {\n type = puppet_wargoal_focus\n target = FROM\n}', ai: 'base = 2\nmodifier = {\n factor = 0\n has_country_flag = zin_aenor_no_crown_by_force\n}\nmodifier = {\n factor = 0\n zin_rules_is_historical = yes\n}' });
  // Lost Cause
  add('zin_aenor_cat_lost_cause', { id: 'zin_aenor_frontier_company', icon: 'ranger_cloak', art: 'ranger_cloak', title: 'Raise a Frontier Company', desc: 'The rangers and archers of the Lost Cause are the one part of the league that fights. A frontier company is raised from the marches and posted where the dark presses nearest.', visible: 'zin_aenor_is_realm = yes', available: 'check_variable = { zin_aenor_lost_cause > 29 }\nhas_manpower = 1', cost: 50, cooldown: 60,
    effect: 'add_manpower = -1000\nzin_aenor_raise_frontier_company = yes', ai: 'base = 3\nmodifier = {\n factor = 0\n NOT = {\n OR = {\n has_global_flag = zin_war_of_last_crowns\n any_neighbor_country = {\n OR = {\n has_war_with = ROOT\n zin_is_volgan = yes\n zin_is_zol = yes\n }\n }\n }\n }\n}' });
  add('zin_aenor_cat_lost_cause', { id: 'zin_aenor_invite_to_shield', icon: 'handshake_oath', art: 'handshake_oath', title: 'Call [FROM.GetName] to the Shield', desc: 'Offer a foreign crown a seat in the Lost Cause. It would owe no oath and fight no wars it does not choose, but its banner would fly beside the Concord\'s against the dark.', visible: 'zin_aenor_is_realm = yes\nhas_country_flag = zin_aenor_shield_open', rootTrigger: 'has_country_flag = zin_aenor_shield_open',
    target: 'FROM = {\nexists = yes\nis_subject = no\nNOT = { zin_aenor_is_realm = yes }\nNOT = { has_country_flag = zin_lost_cause_member }\nNOT = { zin_is_volgan = yes }\nNOT = { zin_is_zol = yes }\n}', available: 'FROM = { NOT = { has_war_with = ROOT } }\nhas_country_flag = zin_aenor_shield_open', cost: 25,
    effect: 'FROM = {\nset_country_flag = zin_lost_cause_member\nadd_opinion_modifier = { target = ROOT modifier = zin_aenor_opinion_honorary_crown }\n}\nset_temp_variable = { zin_arg_value = 3 }\nzin_aenor_add_lost_cause = yes', ai: 'base = 2\nmodifier = {\n factor = 0\n FROM = { NOT = { has_opinion = { target = ROOT value > 10 } } }\n}' });
  // King's health
  add('zin_aenor_cat_kings_health', { id: 'zin_aenor_question_physicians', icon: 'healer_herbs', art: 'healer_herbs', title: 'Question the Royal Physicians', desc: 'Ask the King\'s own physicians, one by one and out of each other\'s hearing, how he sleeps and what he eats. The answers will say little. The way they are given may say more.', visible: 'zin_aenor_is_realm = yes', available: 'check_variable = { zin_aenor_lost_cause > 39 }\nNOT = { has_country_flag = zin_aenor_royal_physicians }', cost: 50, days: 30, once: true,
    remove: 'set_country_flag = zin_aenor_royal_physicians\nset_variable = { zin_aenor_king_health = -1 }\nzin_aenor_check_royal_health = yes', ai: 'base = 10\nmodifier = {\n factor = 0\n zin_rules_is_historical = yes\n}\nmodifier = {\n factor = 0\n check_variable = { zin_council_influence > 50 }\n}' });
  add('zin_aenor_cat_kings_health', { id: 'zin_aenor_follow_the_coin', icon: 'ledger_coins', art: 'ledger_coins', title: 'Follow the Coin', desc: 'A purse changed hands near the King\'s kitchens. Set scribes to follow it through the ledgers of the Houses until it stops.', visible: 'zin_aenor_is_realm = yes\nhas_country_flag = zin_aenor_royal_physicians', available: 'has_country_flag = zin_aenor_royal_physicians\ncheck_variable = { zin_council_influence < 50.01 }\nNOT = { has_country_flag = zin_aenor_coin_followed }', cost: 75, days: 45, once: true,
    remove: 'set_country_flag = zin_aenor_coin_followed\nzin_aenor_follow_coin_roll = yes\ncountry_event = { id = zin_aenor.241 }', ai: 'base = 10\nmodifier = {\n factor = 0\n zin_rules_is_historical = yes\n}' });
  add('zin_aenor_cat_kings_health', { id: 'zin_aenor_lay_proof', icon: 'seal_royal', art: 'seal_royal', title: 'Lay the Proof Before the King', desc: 'Bring what the scribes found to the King himself, with the seal of the Lost Cause upon it. A king who believes may act. A king who does not will remember who brought it.', visible: 'zin_aenor_is_realm = yes\nhas_country_flag = zin_aenor_royal_physicians', available: 'has_country_flag = zin_aenor_poisoner_found\nNOT = { has_country_flag = zin_aenor_proof_laid }', cost: 100, once: true,
    effect: 'set_country_flag = zin_aenor_proof_laid\ncountry_event = { id = zin_aenor.242 }', ai: 'base = 10\nmodifier = {\n factor = 0\n zin_rules_is_historical = yes\n}' });
  // The Thirty Days
  const camp = (key, code) => `zin_aenor_ruled_by_${key} = yes`;
  [['zin_aenor_open_treasury', 'Open the Treasury', 'court', 1, 'coin_chest', 50, 'The treasury is opened to every hand that will hold a banner for the Golden Court. It will not close again quickly.', `${call('zin_aenor_add_camp_support', { camp: 1, value: 10 })}\n${call('zin_aenor_add_court_corruption', { value: 5 })}`],
    ['zin_aenor_temples_speak', 'The Temples Speak', 'faithful', 2, 'hymn_choir', 25, 'Every temple in the kingdom is asked to name the god\'s choice from its altar, on the same morning.', `${call('zin_aenor_add_camp_support', { camp: 2, value: 10 })}\n${call('zin_aenor_add_council_influence', { value: 5 })}`],
    ['zin_aenor_charters_for_loyal', 'Charters for the Loyal', 'dominions', 3, 'charter_free', 50, 'Every dominion that stays with the Concord is promised a Free Charter. The ones that leave get nothing.', `${call('zin_aenor_add_camp_support', { camp: 3, value: 10 })}\n${call('zin_aenor_add_concord_loyalty_all', { value: 5 })}`],
    ['zin_aenor_strangers_word', 'The Stranger\'s Word', 'host', 4, 'banner_plain', 50, 'The frontier captains and the scholars carry word of the stranger from hall to hall, and the commoners shout it back.', `${call('zin_aenor_add_camp_support', { camp: 4, value: 10 })}`]]
    .forEach(([id, title, k, code, icon, cost, desc, effect]) => add('zin_aenor_cat_empty_throne', { id, icon, art: icon, title, desc, visible: `zin_aenor_is_realm = yes\nzin_aenor_ruled_by_${k} = yes\nhas_country_flag = zin_aenor_thirty_days`, available: `zin_aenor_ruled_by_${k} = yes`, cost, cooldown: 10, effect, ai: `base = 10\nmodifier = {\n factor = 2\n zin_aenor_ruled_by_${k} = yes\n}` }));
  add('zin_aenor_cat_empty_throne', { id: 'zin_aenor_silence_dissenters', icon: 'seal_wax', art: 'seal_wax', title: 'Silence the Dissenters', desc: 'Every voice that names another claimant is told to be quiet, and some are made quiet. It works only once; a kingdom does not forgive it twice.', visible: 'zin_aenor_is_realm = yes\nhas_country_flag = zin_aenor_thirty_days', available: 'NOT = { has_country_flag = zin_aenor_dissenters_silenced }', cost: 75, once: true,
    effect: `set_country_flag = zin_aenor_dissenters_silenced
${[1, 2, 3, 4].map(c => `if = {\n\tlimit = { NOT = { check_variable = { zin_aenor_ruling_camp = ${c} } } }\n\t${call('zin_aenor_add_camp_support', { camp: c, value: -15 })}\n}`).join('\n')}
add_stability = -0.03`, ai: 'base = 8' });

  const decisionFileBody = Object.entries(dec).map(([cat, ds]) => blk(cat, ds.map(d => writeDecision({ ...d, ai: d.ai && !/\bbase\b|factor\b/.test(d.ai.split('\n')[0]) ? d.ai : d.ai }, loc, sprites)).join('\n'))).join('\n');
  // The Faithful's Silence the Dissenters costs less at council >= 70 (spec); the cost trigger form keeps one id.
  staged.text('common/decisions/zin_aenor_court.txt', format(`${hdr(MOD, SPEC, 'Decisions of the Golden Court: the Court, the Concord, the Lost Cause, the King\'s Health and the Thirty Days.')}\n${decisionFileBody}\n`));

  // ---------------------------------------------------------------------------------------------- events (the ids 06_events does not carry)
  const events = [];
  const startup = list(
    ...Object.entries({ zin_court_corruption: D.start.corruption, zin_council_influence: D.start.council, zin_aenor_lost_cause: D.start.lostCause, zin_aenor_ruling_camp: 0, zin_aenor_concord_avg: 0, zin_aenor_camp_court: 0, zin_aenor_camp_faithful: 0, zin_aenor_camp_dominions: 0, zin_aenor_camp_host: 0, zin_aenor_king_health: 0 }).map(([k, v]) => `set_variable = { ${k} = ${v} }`),
    'zin_aenor_start_clock = yes',
    'add_ideas = { zin_aenor_seventeen_centuries zin_aenor_lost_cause_court }',
    'add_dynamic_modifier = { modifier = zin_aenor_golden_court }',
    'add_dynamic_modifier = { modifier = zin_aenor_temple_favour }',
    'every_owned_state = {', 'if = {', 'limit = { zin_is_site_aenor_court_lands = yes }', 'set_state_flag = zin_aenor_lean_court', '}',
    'if = {', 'limit = { zin_is_site_aenor_temple_cities = yes }', 'set_state_flag = zin_aenor_lean_temple', '}',
    'if = {', 'limit = { zin_is_site_aenor_marches = yes }', 'set_state_flag = zin_aenor_lean_march', '}', '}');
  const provs = (await stateProvinces(AEN));
  const provLines = provs.map(s => `${s.id} = { set_variable = { zin_aenor_first_province = ${s.first} } }`);
  const dominionLines = T.dominions.map(d => list(
    `${d.tag} = {`, `set_variable = { zin_concord_loyalty = ${d.loyalty} }`, `add_ideas = zin_concord_charter_${d.charter}`, '}',
    `if = {`, `limit = { ${d.tag} = { is_subject_of = ${AEN} } }`, `${AEN} = { set_autonomy = { target = ${d.tag} autonomy_state = zin_autonomy_chartered_dominion } }`, '}'));
  events.push({ id: 1, kind: 'hidden', immediate: list(startup, 'zin_aenor_refresh_modifiers = yes', ...provLines, ...dominionLines) });
  events.push({ id: 2, kind: 'hidden', immediate: 'zin_aenor_monthly_pulse = yes' });
  events.push({ id: 101, kind: 'country', title: 'A Charter Grievance', picture: 'concord_council',
    desc: 'The lords of [zin_aenor_petitioner.GetName] send a petition to Parim. They say the tithe has outrun the Charter, and that the Charter was written to be kept by both sides.',
    trigger: `zin_aenor_is_realm = yes\nzin_aenor_king_alive = yes\nany_subject_country = {\nzin_aenor_is_concord_dominion = yes\nzin_aenor_dominion_defiant = yes\n}`, mtth: 'days = 120',
    immediate: 'random_subject_country = {\nlimit = {\nzin_aenor_is_concord_dominion = yes\nzin_aenor_dominion_defiant = yes\n}\nsave_global_event_target_as = zin_aenor_petitioner\n}',
    options: [
      { key: 'a', text: 'Hear them, and ease the tithe.', ai: 60, effect: `add_political_power = -50\nevent_target:zin_aenor_petitioner = {\n${call('zin_aenor_add_concord_loyalty', { value: 10 })}\n}` },
      { key: 'b', text: 'The Charter says what the crown says it says.', ai: 40, effect: `event_target:zin_aenor_petitioner = {\n${call('zin_aenor_add_concord_loyalty', { value: -5 })}\n}` },
    ] });
  events.push({ id: 102, kind: 'country', title: 'A New Charter', picture: 'concord_council',
    desc: 'Riders from Parim bring a new Charter under the crown\'s seal. The lords of our land read it aloud in the hall and weigh what it gives against what it costs.',
    options: [{ key: 'a', text: 'We have read it. We will keep it.' }] });
  events.push({ id: 103, kind: 'country', title: 'The Levy Refused', picture: 'generic_court',
    desc: '[zin_aenor_levy_refuser.GetName] sends no men to the levy. Its lords write that the Concord was sworn to defend the kingdom, not to follow the crown\'s quarrels, and that their harvest will not bring itself in.',
    options: [{ key: 'a', text: 'Note it in the rolls.', effect: 'event_target:zin_aenor_levy_refuser = {\n' + call('zin_aenor_add_concord_loyalty', { value: -2 }) + '\n}' }] });
  events.push({ id: 110, kind: 'country', title: 'Letters to the Free Dominions', picture: 'concord_council',
    desc: 'Letters under the seal of [zin_aenor_rejoin_realm.GetName] reach our free hall. They offer a Free Charter: rule of our own lands in all but defence, and no tithe but what our lords grant.',
    options: [
      { key: 'a', text: 'Take the Free Charter.', ai: 'base = 0\nmodifier = {\n add = 100\n check_variable = { zin_concord_loyalty > 39 }\n}\nmodifier = {\n add = 100\n any_neighbor_country = { zin_diplo_is_dark_power = yes }\n}', effect: 'zin_aenor_rejoin_dominion = yes' },
      { key: 'b', text: 'We stay free.', ai: 'base = 40\nmodifier = {\n factor = 0\n check_variable = { zin_concord_loyalty > 39 }\n}' },
    ] });
  events.push({ id: 150, kind: 'country', title: 'The League\'s Triumph', picture: 'lost_cause_triumph',
    desc: 'The banners of the Lost Cause are carried through Parim in the sun. The court cheers the parade. The frontier captains in the crowd count the swords behind the banners, and say nothing.',
    options: [
      { key: 'a', text: 'Let the banners fly.', ai: 60, effect: 'add_political_power = 25' },
      { key: 'b', text: 'Spend the day on the wall instead.', ai: 40, effect: call('zin_aenor_add_lost_cause', { value: 3 }) },
    ] });
  events.push({ id: 230, kind: 'hidden', immediate: `# ROOT is the winner of the civil war. Former dominions that kept their faith return to it as chartered subjects.
save_global_event_target_as = zin_aenor_rejoin_realm
every_country = {
	limit = {
		has_country_flag = zin_aenor_free_dominion
		check_variable = { zin_concord_loyalty > 49 }
	}
	zin_aenor_rejoin_dominion = yes
}
if = {
	limit = {
		has_global_flag = zin_reign_councils_war
		NOT = { has_global_flag = zin_golden_king_survives }
		NOT = { has_country_flag = zin_aenor_breakaway }
		zin_aenor_king_alive = yes
	}
	country_event = { id = zin_aenor.261 }
}
if = {
	limit = { has_country_flag = zin_aenor_breakaway }
	clr_country_flag = zin_aenor_breakaway
}` });
  events.push({ id: 330, kind: 'country', title: 'The King Is Lost', picture: 'cliff', requires: ['zin_eindil_cast_down'],
    desc: 'Word comes down the palace road: the Hailed King fell, and no one has found him. The Captains take the seals and swear to keep them for him, and for no one else.',
    options: [{ key: 'a', text: 'The Captains hold.' }] });
  events.push({ id: 331, kind: 'country', title: 'The King Returns', picture: 'dragon_return', requires: ['zin_eindil_returned'],
    desc: 'He walks into the camp on his own feet, thin and silent, and the Captains give back the seals one by one. Nobody asks how far he fell.',
    options: [{ key: 'a', text: 'Long live the King.' }] });
  const written = events.map(e => writeEvent('zin_aenor', e, loc, { okText: 'So it stands.', hiddenOk: 'The month turns.' }));
  staged.text('events/zin_aenor_mechanic.txt', format(`${hdr(MOD, SPEC, 'Namespace zin_aenor, the mechanic\'s hidden pulses and its quiet events. The story events are in zin_aenor_story.txt.')}\nadd_namespace = zin_aenor\n${written.map(w => w.text).join('\n')}\n`));
  // The story events (06_events lists their ids and gists under the Aenor mechanic, and no events module writes them).
  const storyEvents = ctx.story === false ? [] : aenorStory(D, T, tipper('zin_aenor', loc));
  const storyWritten = storyEvents.map(e => writeEvent('zin_aenor', e, loc, { okText: 'So it stands.' }));
  if (storyWritten.length) staged.text('events/zin_aenor_story.txt', format(`${hdr(MOD, SPEC, 'Namespace zin_aenor, the story events of the court, the plot, the Thirty Days, the risings, the abandoned throne and the Crown of Aen (ids from 06_events).')}\n${storyWritten.map(w => w.text).join('\n')}\n`));

  // ---------------------------------------------------------------------------------------------- on_actions
  staged.text('common/on_actions/zin_aenor_court.txt', format(`${hdr(MOD, SPEC, 'Start, the monthly pulse of every Aenor realm, and the end of a civil war.')}
on_actions = {
	on_startup = {
		effect = {
			${AEN} = { country_event = { id = zin_aenor.1 } }
		}
	}
	on_monthly = {
		effect = {
			if = {
				limit = { zin_aenor_is_realm = yes }
				country_event = { id = zin_aenor.2 }
			}
		}
	}
	on_civil_war_end = {
		effect = {
			if = {
				limit = {
					zin_aenor_is_realm = yes
					FROM = { zin_aenor_is_realm = yes }
				}
				country_event = { id = zin_aenor.230 }
			}
		}
	}
}
`));

  // ---------------------------------------------------------------------------------------------- the collective leaders
  const leaders = { zin_aenor_golden_regency: ['The Regency of the Golden Court', 'The Golden Court rules for the crown, in the name of a king it has not yet chosen.', 'zin_dom_court', 'council'],
    zin_aenor_concord_speaker: ['The Speaker of the Concord', 'The dominions speak with one voice for the first time since the Charters were sworn.', 'zin_wild_freeholds', 'council'],
    zin_aenor_captains_regency: ['The Captains\' Regency', 'The frontier commanders of the Lost Cause hold Parim for a king who is not yet on the throne.', 'zin_light_wardens', 'council'] };
  staged.text('common/characters/zin_aenor_court.txt', format(`${hdr(MOD, SPEC, 'Collective leaders of the succession; they invent no relatives of the Golden King. Portraits are council scenes (art request).')}
characters = {
${Object.entries(leaders).map(([id, [name, , stance]]) => { loc.set(id, name); return blk(id, `name = ${id}\nportraits = {\n civilian = {\n large = GFX_zin_portrait_men_male_1\n }\n}\ncountry_leader = {\n ideology = ${stance}\n expire = "2000.1.1.1"\n id = -1\n}`); }).join('\n')}
}
`));

  // ---------------------------------------------------------------------------------------------- the panel and the text
  const gui = aenorGui.build(staged, { D, T, loc, sprites, file: 'aenor_court' });
  staged.text('interface/zz_zin_aenor_court.gfx', sprites.text(hdr(MOD, SPEC, 'Sprites of the Golden Court: decision icons, categories, modifiers and the panel. Every texture is an icon of the catalog.')));

  // party names and the remaining text
  const parties = { court: ['The Golden Court', 'The Golden Court of Aenor'], dominions: ['The Free Dominions', 'The Free Dominions of the Concord'], faithful: ['The Deliverer\'s Faithful', 'The Faithful of the Deliverer'], faithful_revealed: ['Afrit\'s Supporters', 'The Supporters of Afrit'], host: ['The Stranger\'s Host', 'The Host of the Stranger'], host_named: ['Eindil\'s Host', 'The Host of Eindil'] };
  for (const [k, [n, l]] of Object.entries(parties)) { loc.set(`zin_aenor_party_${k}`, n); loc.set(`zin_aenor_party_${k}_long`, l); }
  const cosmetic = { zin_cosmetic_aenor_court: 'The Golden Court', zin_cosmetic_aenor_faithful: 'Aenor of the Faithful', zin_cosmetic_aenor_host: 'The Stranger\'s Host' };
  void cosmetic;

  // ---------------------------------------------------------------------------------------------- checks and output
  const entries = loc.entries();
  const problems = [...await wordProblems(entries), ...notCp1252(entries), ...secrecyLeaks(entries, k => /_(revealed|hub|true|private)(_long)?$/.test(k))];
  if (problems.length) throw new Error(`mech_aenor text breaks the rules (${problems.length}):\n  ${problems.slice(0, 30).join('\n  ')}`);
  staged.add('localisation/english/zin_aenor_court_l_english.yml', loc.bytes());
  const defs = { triggers: [...Object.keys(triggers), ...(dates.match(/^\w+(?= = \{)/gm) ?? [])], effects: [...Object.keys(effects), ...aenorGui.effectNames()], ideas: ideaList.map(i => i.id), decisions: Object.values(dec).flat().map(d => d.id), categories: Object.keys(cats), events: [...events, ...storyEvents].map(e => `zin_aenor.${e.id}`), storyEvents: storyEvents.map(e => `zin_aenor.${e.id}`), dynamicModifiers: Object.keys(dmMods), characters: Object.keys(leaders) };
  return { counts: Object.fromEntries(Object.entries(defs).map(([k, v]) => [k, v.length])), definitions: defs, tags: T, loc: entries, gui, eventMeta: [...written, ...storyWritten].map(w => w.meta), decisions: dec, ideas: ideaList, sprites: sprites.map, provinces: provs.length };
}
