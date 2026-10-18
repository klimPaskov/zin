// Erdae ideologies. The four engine ideology keys stay (so the AI, defines and remaining vanilla systems keep
// working) but are re-themed: democratic = Light, fascism = Dominion, communism = Shadow, neutrality = Wild.
// Each gains Erdae stances; vanilla stances stay defined but never selected, so old references still resolve.
import { cw, yml } from '../lib/core.mjs';

export const IDEOLOGIES = {
  democratic: { name: 'Light', noun: 'the Light', desc: 'Council of the Light', colour: [214, 196, 120], stances: {
    zin_light_council: ['Free Council', 'Rule by an elected council of free folk.'],
    zin_light_kinship: ['Elder Kinship', 'Rule by the eldest and wisest of an immortal kin.'],
    zin_light_wardens: ['Warden Host', 'Rule by those sworn to guard the land and its people.'],
    zin_light_sanctuary: ['Sanctuary', 'A peaceful realm that fights only to shelter others.'] } },
  fascism: { name: 'Dominion', noun: 'Dominion', desc: 'Crowned Dominion', colour: [178, 132, 46], stances: {
    zin_dom_crown: ['High Crown', 'A hereditary crown rules by right and by arms.'],
    zin_dom_court: ['Golden Court', 'A court of gold, favour and sold offices.'],
    zin_dom_warlord: ['Warlordship', 'The strongest captain rules while he stays strongest.'],
    zin_dom_conquest: ['Conquering Host', 'A realm organised for endless expansion.'] } },
  communism: { name: 'Shadow', noun: 'the Shadow', desc: 'Dominion of Shadow', colour: [92, 40, 96], stances: {
    zin_shadow_dread: ['Dread Lordship', 'An ancient dark lord rules by terror and sorcery.'],
    zin_shadow_worship: ['Worship-Cult', 'Power flows from worship, bargains and corruption.'],
    zin_shadow_grave: ['Grave Dominion', 'The dead rule the dead.'],
    zin_shadow_horde: ['Devouring Horde', 'A host that lives only to consume.'] } },
  neutrality: { name: 'Wild', noun: 'the Wild', desc: 'Unaligned Realm', colour: [112, 128, 104], stances: {
    zin_wild_clans: ['Clan Moot', 'Clans meet to settle feuds and choose a war-leader.'],
    zin_wild_seclusion: ['Seclusion', 'A hidden folk that wants only to be left alone.'],
    zin_wild_freeholds: ['Freeholds', 'Independent lords and towns bound by custom.'],
    zin_wild_tribes: ['Tribal Chieftaincy', 'A chieftain rules a warband and its kin.'] } },
};
const VANILLA_STANCES = { democratic: ['conservatism', 'liberalism', 'socialism', 'populism'], communism: ['marxism', 'leninism', 'stalinism', 'anti_revisionism', 'anarchist_communism', 'buddhist_socialism'], fascism: ['nazism', 'gen_nazism', 'fascism_ideology', 'falangism', 'rexism', 'emperor_fascism'], neutrality: ['despotism', 'oligarchism', 'anarchism', 'moderatism', 'centrism', 'japan_militarism_ideology'] };
export const stanceIdeology = Object.fromEntries(Object.entries(IDEOLOGIES).flatMap(([id, d]) => Object.keys(d.stances).map(s => [s, id])));

// Engine rules per ideology, re-tuned for Erdae.
const RULES = {
  democratic: { rules: { can_create_collaboration_government: false, can_declare_war_on_same_ideology: false, can_force_government: true, can_send_volunteers: true, can_puppet: false, can_lower_tension: true, can_only_justify_war_on_threat_country: true, can_guarantee_other_ideologies: true }, can_host_government_in_exile: true, war_impact_on_world_tension: 0.25, faction_impact_on_world_tension: 0.1, modifiers: { generate_wargoal_tension: 1, join_faction_tension: 0.6, guarantee_tension: 0.25 }, faction_modifiers: { faction_trade_opinion_factor: 0.5 }, ai_democratic: true, ai_ideology_wanted_units_factor: 1.1, ai_give_core_state_control_threshold: 0 },
  fascism: { rules: { can_force_government: true, can_send_volunteers: true, can_puppet: true }, can_collaborate: true, war_impact_on_world_tension: 0.75, faction_impact_on_world_tension: 0.6, modifiers: { justify_war_goal_when_in_major_war_time: -0.5 }, ai_fascist: true, ai_ideology_wanted_units_factor: 1.5, ai_give_core_state_control_threshold: 10000 },
  communism: { rules: { can_force_government: true, can_send_volunteers: true, can_puppet: true, can_declare_war_on_same_ideology: true }, can_collaborate: true, war_impact_on_world_tension: 1.0, faction_impact_on_world_tension: 1.0, modifiers: { justify_war_goal_when_in_major_war_time: -0.8 }, ai_communist: true, ai_ideology_wanted_units_factor: 1.7, ai_give_core_state_control_threshold: 10000 },
  neutrality: { rules: { can_force_government: true, can_puppet: true, can_send_volunteers: false }, war_impact_on_world_tension: 0.25, faction_impact_on_world_tension: 0.1, modifiers: { generate_wargoal_tension: 0.5, join_faction_tension: 0.4, guarantee_tension: 0.4, drift_defence_factor: -0.3 }, ai_neutral: true, ai_ideology_wanted_units_factor: 1.15, ai_give_core_state_control_threshold: 10000 },
};

export function buildIdeologies(staged) {
  const blocks = {}, loc = {};
  for (const [id, d] of Object.entries(IDEOLOGIES)) {
    const types = {};
    for (const s of Object.keys(d.stances)) types[s] = {};
    for (const v of VANILLA_STANCES[id]) types[v] = { can_be_randomly_selected: false };
    blocks[id] = { types, dynamic_faction_names: [1, 2, 3, 4].map(n => `ZIN_FACTION_${id.toUpperCase()}_${n}`), color: d.colour, ...RULES[id] };
    loc[id] = d.name; loc[`${id}_noun`] = d.noun; loc[`${id}_desc`] = d.desc;
    for (const [s, [n, desc]] of Object.entries(d.stances)) { loc[s] = n; loc[`${s}_desc`] = desc; }
  }
  const factionNames = { democratic: ['Concord of the Light', 'League of Free Realms', 'Alliance of the Dawn', 'Covenant of Wardens'], fascism: ['Crown Alliance', 'Pact of Sceptres', 'Concord of Crowns', 'Iron Accord'], communism: ['Pact of Shadow', 'Black Covenant', 'Host of Night', 'Circle of Ash'], neutrality: ['Wild Moot', 'League of Clans', 'Freehold Compact', 'Pact of the Wilds'] };
  for (const [id, names] of Object.entries(factionNames)) names.forEach((n, i) => { loc[`ZIN_FACTION_${id.toUpperCase()}_${i + 1}`] = n; });
  staged.text('common/ideologies/00_ideologies.txt', `# Generated by the ZIN content builder: Erdae ideologies (engine keys re-themed).\nideologies = {\n${cw(blocks, 1)}}\n`);
  staged.add('localisation/replace/zin_ideologies_l_english.yml', yml(loc));
}
