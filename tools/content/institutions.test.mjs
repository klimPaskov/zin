// Tests of the institutions module (docs/specs/03_gameplay/08_institutions.md). They call the builder directly with the
// roster of data/countries.json and assert on the staged files; nothing needs a prior build. The installed game is read
// for the engine's own ids (upgrades, operations, tokens, defines) and documentation (effects, triggers, modifiers).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { GAME } from './lib/paths.mjs';
import { parse, tokenize, scriptText } from './lib/clausewitz.mjs';
import { buildInstitutions, equipmentRights, requiredEnumEntries, defineRows, startValour, loadInstitutions } from './modules/institutions.mjs';
import { Loc, Sprites, loadCatalogKeys, bannedIn, notCp1252, checkMods, tierOf } from './lib/inst_util.mjs';
import { writeAbilities, writeUnitLeaderTraits, hqUnitText } from './lib/inst_war.mjs';
import { writeOperations, writeAgencies } from './lib/inst_intrigue.mjs';
import { writeWorkshops } from './lib/inst_craft.mjs';
import { assertDefinesExist } from './modules/defines.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
const staged = new Staged();
const summary = await buildInstitutions(staged, { countries });
const text = rel => { const b = staged.files.get(rel); assert(b, `missing staged file ${rel}`); return b.toString('utf8'); };
const tree = rel => parse(text(rel));
const D = await loadInstitutions();
const textFiles = [...staged.files.keys()].filter(f => f.endsWith('.txt') || f.endsWith('.gfx'));
const allScript = textFiles.map(f => text(f)).join('\n');
const locAll = [text('localisation/english/zin_inst_l_english.yml'), text('localisation/replace/zin_inst_engine_l_english.yml')].join('\n');
const locKeys = new Set([...locAll.matchAll(/^ ([A-Za-z0-9_.@-]+):0 /gm)].map(m => m[1]));
const child = (entries, k) => entries.find(e => e.k === k)?.v;
const blocks = entries => entries.filter(e => e.k && Array.isArray(e.v));
const gameFile = async rel => parse(scriptText(await readFile(`${GAME}/${rel}`)));

test('Counts: what the module writes matches the spec tables', () => {
  assert.equal(summary.subUnits, 20, 'fifteen camp roles, with three household variants and three kin variants');
  assert.equal(summary.roles, 15);
  assert.equal(summary.abilities, 13);
  assert.equal(summary.customs, 27);
  assert.equal(summary.upgrades, 21);
  assert.equal(summary.operations, 20);
  assert.equal(summary.phases, 60);
  assert.equal(summary.workshops, 9);
  assert.equal(summary.policies, 12);
  assert.equal(summary.spells, 9);
  assert.equal(summary.scars, 4);
  assert.equal(summary.traits, 102, 'commander traits: 14 land, 10 marshal, 28 corps, 30 sea, 12 agent, 8 status');
  assert.equal(summary.workshopTraits, 90);
  assert.equal(summary.rewards, 26);
  assert.equal(summary.chiefs, 12 * 6 + 71 * 2, 'tier A (Zol has none) six each, tier B two each');
});

test('Determinism: a second build yields the same bytes', async () => {
  const again = new Staged();
  await buildInstitutions(again, { countries });
  assert.deepEqual([...again.files.keys()], [...staged.files.keys()]);
  for (const [k, v] of staged.files) assert(v.equals(again.files.get(k)), `${k} differs between builds`);
});

test('Every staged script parses with balanced braces', () => {
  for (const f of textFiles) {
    let depth = 0, min = 0;
    for (const t of tokenize(text(f))) { if (t.t === '{') depth++; if (t.t === '}') { depth--; min = Math.min(min, depth); } }
    assert.equal(depth, 0, `${f} is unbalanced`); assert.equal(min, 0, `${f} closes too early`);
    assert.doesNotThrow(() => parse(text(f)), f);
  }
});

test('The War Camp: every sub-unit is a camp unit, abilities resolve, every people can field a household battalion', () => {
  const units = child(tree('common/units/zin_hq.txt'), 'sub_units'), abilities = new Set(blocks(child(tree('common/abilities/zin_abilities.txt'), 'ability')).map(e => e.k));
  const camp = blocks(units).filter(u => u.k.startsWith('zin_hq_'));
  assert.equal(camp.length, 20);
  for (const u of camp) {
    assert.equal(child(u.v, 'allow_in_army_hq'), 'yes', u.k); assert.equal(child(u.v, 'allow_in_non_army_hq'), 'no', u.k);
    assert(!u.v.some(e => e.k === 'required_dlc'), `${u.k} carries a DLC condition`);
    const ab = child(u.v, 'enable_ability')?.[0]?.v; if (ab) assert(abilities.has(ab), `${u.k} enables unknown ability ${ab}`);
  }
  assert.equal(child(camp.find(u => u.k === 'zin_hq_eyrie_liaison').v, 'active'), 'no', 'the eyrie liaison waits for the sky rule');
  for (const a of D.core.abilities.filter(x => x.hq)) assert(camp.some(u => child(u.v, 'enable_ability')?.[0]?.v === a.id), `${a.id} is enabled by no camp unit`);
  // Which household battalion each people can field (warfare section 3: who can produce what).
  const needs = Object.fromEntries(camp.filter(u => u.k.startsWith('zin_hq_household')).map(u => [u.k, child(u.v, 'need').map(e => e.k)]));
  const producible = { men: ['zin_arms_equipment'], elves: ['zin_arms_equipment'], sun_elves: ['zin_arms_equipment'], orcs: ['zin_arms_equipment'], trolls: ['zin_troll_gear_equipment'], giants: ['zin_giant_gear_equipment'], ents: ['zin_ent_grove_equipment'], yeti: ['zin_yeti_gear_equipment'], the_dead: ['zin_grave_arms_equipment'], demons: ['zin_nether_arms_equipment'] };
  for (const [people, gear] of Object.entries(producible)) assert(Object.values(needs).some(n => n.every(e => gear.includes(e))), `${people} can field no household battalion`);
  assert(text('common/units/zin_hq.txt').includes('fake_intel_unit'), 'the phantom host unit stays defined');
});

test('Abilities: ids, trait enablers and no vanilla condition', () => {
  const ab = blocks(child(tree('common/abilities/zin_abilities.txt'), 'ability'));
  assert.equal(ab.length, 13);
  for (const a of ab) { assert(a.k.startsWith('zin_ab_')); assert(locKeys.has(a.k) && locKeys.has(`${a.k}_desc`), `${a.k} has text`); }
  const traits = text('common/unit_leader/00_traits.txt');
  for (const id of D.core.abilities.filter(x => x.trait).map(x => x.id)) assert(traits.includes(`enable_ability = ${id}`), `no trait enables ${id}`);
  for (const bad of ['has_completed_focus', 'has_dlc', 'original_tag = GER', 'JAP_', 'SWE_']) assert(!text('common/abilities/zin_abilities.txt').includes(bad), `ability file names ${bad}`);
  assert(!text('common/abilities/zin_abilities.txt').includes('glider'), 'no glider ability');
});

test('Council of Captains: 27 customs in nine categories, 14 chief families, rank keys in Erdae words', () => {
  const ideas = child(tree('common/ideas/zin_officer_corps.txt'), 'ideas');
  const per = Object.fromEntries(blocks(ideas).map(c => [c.k, blocks(c.v).length]));
  assert.deepEqual(per, { academy_spirit: 4, army_spirit: 4, division_command_spirit: 4, naval_academy_spirit: 3, navy_spirit: 3, naval_command_spirit: 3, air_force_academy_spirit: 2, air_force_spirit: 2, air_force_command_spirit: 2 });
  const air = blocks(ideas).filter(c => c.k.startsWith('air_')).flatMap(c => blocks(c.v));
  for (const i of air) assert(i.v.some(e => e.k === 'visible' && JSON.stringify(e.v).includes('zin_rules_skies_present')), `${i.k} is hidden when the sky rule is none`);
  assert.equal(D.core.chiefFamilies.filter(f => f.chair !== 'master').length, 14);
  const e = text('localisation/replace/zin_inst_engine_l_english.yml');
  for (const k of ['rank1', 'rank4', 'naval_rank3', 'cc_leader', 'fm_leader', 'navy_leader', 'DIVISION_EXPERIENCE_TITLE_DEFAULT', 'army_chief', 'theorist']) assert(e.includes(` ${k}:0 `), `rank text ${k}`);
  for (const old of ['Maj. General', 'Lt. General', 'Field Marshal', 'Commodore', 'Brigadier']) assert(!e.includes(old), `vanilla title ${old}`);
});

test('Chiefs: unique ids and tokens, Zol has none, traits exist, tier values hold', () => {
  const chars = blocks(child(tree('common/characters/zin_chiefs.txt'), 'characters')), traitIds = new Set(blocks(child(tree('common/country_leader/zin_military_traits.txt'), 'leader_traits')).map(t => t.k));
  assert.equal(chars.length, 214);
  assert.equal(new Set(chars.map(c => c.k)).size, 214);
  const tokens = chars.map(c => child(child(c.v, 'advisor'), 'idea_token'));
  assert.equal(new Set(tokens).size, 214, 'idea tokens are unique');
  const zol = countries.find(c => c.name === 'Zol');
  assert(!chars.some(c => c.k.endsWith('_zol')), 'Zol is led by an emblem and has no named chief (S4)');
  const slots = new Set(['army_chief', 'navy_chief', 'air_chief', 'high_command', 'theorist']);
  for (const c of chars) {
    const adv = child(c.v, 'advisor'); assert(slots.has(child(adv, 'slot')), c.k);
    for (const t of child(adv, 'traits')) assert(traitIds.has(t.v), `${c.k} uses unknown trait ${t.v}`);
    assert(locKeys.has(c.k), `${c.k} has a name`);
  }
  assert.equal(traitIds.size, 43, '15 families with tiers 1 to 3, the old-guard family with one');
  assert(text('common/country_leader/zin_military_traits.txt').includes('army_defence_factor = 0.15'));
  assert(!text('common/country_leader/zin_military_traits.txt').includes('zin_trait_'), 'the ruler traits of 00_zin_leader_traits.txt are not repeated');
  assert(zol, 'the roster holds Zol');
});

test('Commander traits: the characters spec keys stay, no modern trait remains, the ladder resolves', () => {
  const lt = blocks(child(tree('common/unit_leader/00_traits.txt'), 'leader_traits')), ids = new Set(lt.map(t => t.k));
  for (const k of ['ranger', 'ambusher', 'winter_specialist', 'desert_fox', 'cavalry_leader', 'hill_fighter', 'trait_mountaineer', 'organizer', 'inspirational_leader', 'old_guard', 'career_officer', 'trickster', 'defensive_doctrine', 'offensive_doctrine', 'harsh_leader', 'trait_reckless', 'unyielding_defender', 'naval_invader', 'blue_water_expert', 'green_water_expert', 'bold']) assert(ids.has(k), `trait key ${k} stays`);
  for (const k of ['panzer_leader', 'armor_officer', 'seawolf', 'silent_hunter', 'torpedo_expert', 'paratrooper', 'flight_deck_manager', 'dive_bomber', 'carrier_officer', 'submarine_officer', 'substance_abuser', 'jaeger']) assert(!ids.has(k), `${k} has no Erdae counterpart`);
  for (const t of lt) { const parents = (text('common/unit_leader/00_traits.txt').match(new RegExp(`\\t${t.k} = \\{[\\s\\S]*?\\n\\t\\}`)) ?? [''])[0]; for (const m of parents.matchAll(/any_parent = \{ ([^}]*) \}/g)) for (const p of m[1].trim().split(/\s+/)) assert(ids.has(p), `${t.k} names unknown parent ${p}`); }
  for (const f of ['ETH_traits.txt', 'JAP_traits.txt', 'NSB_traits.txt', 'SWE_traits.txt']) assert.equal(blocks(child(tree(`common/unit_leader/${f}`), 'leader_traits')).length, 0, `${f} is comment-only`);
  const names = ['operative_commando', 'operative_seducer', 'operative_infiltrator', 'operative_master_interrogator', 'operative_linguist', 'operative_double_agent', 'operative_tough', 'operative_safe_cracker', 'operative_well_groomed', 'operative_natural_orator', 'operative_escape_artist', 'operative_demolition_expert'];
  for (const k of names) assert(ids.has(k), `operative trait ${k} keeps its engine key`);
  for (const k of ['sick', 'wounded', 'recently_promoted', 'reassigned', 'disgruntled', 'demoted', 'motivated', 'exiled_leader']) assert(ids.has(k), `status trait ${k}`);
  const t = text('common/unit_leader/00_traits.txt');
  for (const bad of ['original_tag', 'has_dlc', 'has_completed_focus', 'best_of_the_best', 'SOV_', 'JAP_', 'GER_']) assert(!t.includes(bad), `trait file names ${bad}`);
});

test('Valour: three decisions with costs in Orders, stores and wear, and the start values', () => {
  const dec = blocks(child(tree('common/decisions/zin_inst.txt'), 'zin_inst_valour'));
  assert.deepEqual(dec.map(d => d.k), ['zin_inst_great_manoeuvres', 'zin_inst_sea_trials', 'zin_inst_wing_trials']);
  for (const d of dec) { assert(child(d.v, 'days_re_enable') >= 180); assert(child(d.v, 'custom_cost_trigger')); assert(JSON.stringify(child(d.v, 'complete_effect')).includes('damage_units')); }
  const v = startValour(D, countries, new Map(countries.map(c => [c.tag, { people: c.name === 'Volgan' || c.name === 'Zol' ? 'the_dead' : 'men' }])));
  const by = n => v.find(x => x.name === n);
  assert.equal(by('Zol').army, 0); assert.equal(by('Yeldenne').army, 0);
  assert.equal(by('Volgan').army, 200); assert.equal(by('Aenor').army, 150); assert.equal(by('Aenor').navy, 100);
  assert.equal(v.find(x => x.name === 'Selen').army, 100);
  assert.equal(v.find(x => x.name === 'Freshon').army, 50);
  assert(v.every(x => x.air === 0), 'no dragon is granted at the start');
});

test('Seals and Codes: the 21 upgrades keep the engine ids and level counts, with no vanilla tag or technology', async () => {
  const mine = tree('common/intelligence_agency_upgrades/intelligence_agency_upgrades.txt'), theirs = await gameFile('common/intelligence_agency_upgrades/intelligence_agency_upgrades.txt');
  const flat = list => Object.fromEntries(blocks(list).flatMap(b => blocks(b.v).map(u => [u.k, { branch: b.k, levels: u.v.filter(e => e.k === 'level').length }])));
  assert.deepEqual(flat(mine), flat(theirs));
  const t = text('common/intelligence_agency_upgrades/intelligence_agency_upgrades.txt');
  for (const bad of ['original_tag', 'has_tech = radio', 'mechanical_computing', 'lar_local_recruitment']) assert(!t.includes(bad), `upgrade file names ${bad}`);
  assert(t.includes('zin_tech_heralds') && t.includes('zin_tech_universities'));
});

test('Courts of Whispers: one record per people, the Worshipdom public face, no agency at the start', () => {
  const t = text('common/intelligence_agencies/zin_agencies.txt'), recs = parse(t).filter(e => e.k === 'intelligence_agency');
  assert.equal(recs.length, 15);
  for (const p of ['men', 'elves', 'sun_elves', 'orcs', 'trolls', 'giants', 'ents', 'yeti', 'demons', 'the_dead']) assert(t.includes(`has_country_flag = zin_people_${p}`), `agency for ${p}`);
  const wd = countries.find(c => c.name === 'Worshipdom');
  assert(t.includes(`original_tag = ${wd.tag}`) && t.includes('The Almoners\' Roll'));
  assert.equal([...t.matchAll(/original_tag = /g)].length, 2, 'only the Worshipdom has a tag test (its record and its default)');
  assert(!/afrit|hidden council|deliverer/i.test(t));
  assert(!text('common/on_actions/zin_inst.txt').includes('create_intelligence_agency'), 'no agency exists at the start');
});

test('Court Intrigue: the 20 engine operation ids, phases and tokens resolve', async () => {
  const ops = blocks(tree('common/operations/zin_operations.txt')), vanillaOps = new Set(blocks(await gameFile('common/operations/00_operations.txt')).map(e => e.k).filter(k => k.startsWith('operation_')));
  assert.equal(ops.length, 20);
  assert.deepEqual(new Set(ops.map(o => o.k)), vanillaOps, 'the same 20 ids as the installed generic file');
  const phaseIds = new Set(blocks(tree('common/operation_phases/zin_operation_phases.txt')).map(p => p.k));
  assert.equal(phaseIds.size, 60);
  const tokens = new Set(blocks(await gameFile('common/operation_tokens/00_OperationTokens.txt')).map(e => e.k));
  const used = new Set();
  for (const o of ops) {
    for (const p of o.v.filter(e => e.k === 'phases')) for (const q of blocks(p.v)) { assert(phaseIds.has(q.k), `${o.k} names unknown phase ${q.k}`); used.add(q.k); }
    for (const k of ['required_tokens', 'awarded_tokens']) for (const t of child(o.v, k) ?? []) assert(tokens.has(t.v ?? t.k), `${o.k} names unknown token`);
    assert(!JSON.stringify(o.v).includes('infantry_equipment'), `${o.k} keeps a modern equipment name`);
  }
  assert.equal(used.size, 60, 'every phase is used');
  for (const k of ['OPERATION_TOKEN_INFILTRATED_ARMY', 'OPERATION_TOKEN_INFILTRATED_RESISTANCE_CONTACTS']) assert(locKeys.has(k));
  assert(ops.find(o => o.k === 'operation_infiltrate_armed_forces_airforce').v.some(e => e.k === 'allowed'), 'the air token operation waits for the sky rule');
  for (const f of ['common/operations/zin_operations.txt', 'common/operation_phases/zin_operation_phases.txt', 'localisation/english/zin_inst_l_english.yml']) assert(!/afrit|hidden council|deliverer/i.test(text(f)), `${f} names the secret`);
});

test('Raids and the coup activity: night raids only, the engine activity key stays', () => {
  const cat = tree('common/raids/categories/zin_raid_categories.txt'), raids = blocks(child(tree('common/raids/zin_raids.txt'), 'types'));
  assert.equal(blocks(child(cat, 'categories')).length, 1);
  assert.deepEqual(raids.map(r => r.k), ['zin_raid_ransom_captain', 'zin_raid_depot_night', 'zin_raid_granary_fire']);
  const r = text('common/raids/zin_raids.txt');
  for (const bad of ['has_dlc', 'nuclear', 'paratrooper', 'air_base', 'motorized_vehicle_entity']) assert(!r.includes(bad), `raid file names ${bad}`);
  assert(text('common/timed_activities/zin_timed_activities.txt').includes('stage_coup') && text('common/timed_activities/zin_timed_activities.txt').includes('zin_arms_equipment'));
});

test('Guilds and Orders: nine workshops, ten traits and an initial trait each, valid parents, one capstone', () => {
  const orgs = blocks(tree('common/military_industrial_organization/organizations/zin_workshops.txt'));
  assert.equal(orgs.length, 9);
  for (const o of orgs) {
    const traits = o.v.filter(e => e.k === 'trait'), tokens = traits.map(t => child(t.v, 'token'));
    assert.deepEqual(tokens.sort(), ['cap', 'm1', 'm2', 'm3', 'p1', 'p2', 'p3', 's1', 's2', 's3']);
    assert(child(o.v, 'initial_trait'), `${o.k} has an initial trait`);
    const pos = traits.map(t => JSON.stringify(child(t.v, 'position').map(e => e.v)));
    assert.equal(new Set(pos).size, 10, `${o.k} reuses a position`);
    for (const t of traits) for (const k of ['any_parent', 'all_parents']) for (const p of (child(t.v, k) ?? []).map(e => e.v)) assert(tokens.includes(p), `${o.k} ${p}`);
    assert.equal(traits.filter(t => child(t.v, 'special_trait_background') === 'yes').length, 1, 'one capstone');
    assert(child(o.v, 'allowed') && child(o.v, 'equipment_type') && child(o.v, 'research_categories'));
    for (const c of child(o.v, 'research_categories')) assert(/^zin_cat_/.test(c.v), c.v);
  }
  // the deathless invariant: ap_attack only in the Wardsmiths' two traits
  for (const o of orgs) { const n = (JSON.stringify(o.v).match(/ap_attack/g) ?? []).length; if (o.k === 'zin_workshop_wardsmiths') assert.equal(n, 2); else assert.equal(n, 0, `${o.k} touches ap_attack`); }
  assert(text('common/military_industrial_organization/organizations/zin_workshops.txt').includes('zin_tech_scholars_conclaves'));
});

test('Policies and AI weights: twelve policies, Royal Warrants, every stat a trait uses has a weight', () => {
  const pol = blocks(tree('common/military_industrial_organization/policies/zin_workshop_policies.txt'));
  assert.equal(pol.length, 12);
  assert(pol.some(p => p.k === 'zin_mio_royal_warrants')); assert(!locAll.includes('Royal Orders'));
  assert.equal(pol.filter(p => p.k.endsWith('_sign')).length, 9);
  const weights = blocks(tree('common/military_industrial_organization/ai_bonus_weights/zin_ai_bonus_weights.txt')), def = new Set(weights.find(w => w.k === 'default').v.map(e => e.k));
  const used = new Set([...text('common/military_industrial_organization/organizations/zin_workshops.txt').matchAll(/^\t{4}(reliability|build_cost_ic|soft_attack|hard_attack|defense|breakthrough|armor_value|maximum_speed|naval_speed|naval_range|max_strength|ap_attack) = /gm)].map(m => m[1]));
  for (const k of used) assert(def.has(k), `no default AI weight for ${k}`);
});

test('Spells: four rites, nine spells, rewards resolve, none is potent magic', () => {
  const spec = blocks(tree('common/special_projects/specialization/zin_spells.txt')).map(s => s.k).sort();
  assert.deepEqual(spec, ['specialization_air', 'specialization_land', 'specialization_naval', 'specialization_nuclear']);
  const projects = blocks(tree('common/special_projects/projects/zin_spells.txt')), rewards = new Set(blocks(tree('common/special_projects/prototype_rewards/zin_spells.txt')).map(r => r.k));
  assert.equal(projects.length, 9);
  for (const p of projects) {
    assert(spec.includes(child(p.v, 'specialization')));
    for (const r of child(p.v, 'generic_prototype_rewards')) assert(rewards.has(r.v ?? r.k), `${p.k} names unknown reward ${r.k}`);
  }
  const s = text('common/special_projects/projects/zin_spells.txt') + text('common/special_projects/prototype_rewards/zin_spells.txt');
  for (const bad of ['zin_has_potent_magic', 'zin_potent_magic', 'zin_war_grant_dragons', 'ap_attack', 'create_unit']) assert(!s.includes(bad), `spells name ${bad}`);
  const good = D.craft.rewards.filter(r => !r.bad).reduce((a, r) => a + r.weight, 0), bad = D.craft.rewards.filter(r => r.bad).reduce((a, r) => a + r.weight, 0);
  assert(Math.abs(good - 5.5) < 0.01 && Math.abs(bad - 1.9) < 0.01, `weights ${good} and ${bad}`);
  const zol = countries.find(c => c.name === 'Zol'), vol = countries.find(c => c.name === 'Volgan');
  assert(JSON.stringify(projects.find(p => p.k === 'zin_sp_wellspring_rite').v).includes(zol.tag), 'Zol has no Wellspring Rite');
  assert(JSON.stringify(projects.find(p => p.k === 'zin_sp_lifting_the_curse').v).includes(vol.tag), 'Volgan cannot lift the curse');
  assert(JSON.stringify(projects.find(p => p.k === 'zin_sp_grave_binding_rite').v).includes(vol.tag), 'only Volgan binds the grave');
  assert.equal(blocks(tree('common/scientist_traits/zin_scholar_traits.txt')).length, 9);
});

test('Scars: four dynamic modifiers of 365 days, one per state, no cause named', () => {
  const dm = text('common/dynamic_modifiers/zin_scars.txt');
  for (const k of ['hollow', 'wrecked', 'scorched', 'blighted']) assert(dm.includes(`zin_inst_scar_${k}`));
  assert(text('common/special_projects/prototype_rewards/zin_spells.txt').includes('days = 365'));
  assert(text('common/scripted_effects/zin_inst.txt').includes('NOT = { OR = {'), 'at most one scar per state');
  assert(/went wrong/.test(locAll) && !/curse of|feeding|the fading/i.test(locAll.replace('Lifting the Curse', '')), 'a scar is only "the working went wrong"');
});

test('Hooks: lend trigger, camp trigger, scholar and scar effects, start effects', () => {
  const trg = text('common/scripted_triggers/zin_inst.txt'), eff = text('common/scripted_effects/zin_inst.txt');
  for (const k of ['zin_inst_lend_ok', 'zin_inst_war_camp_deployed']) assert(trg.includes(`${k} = {`));
  for (const k of ['zin_inst_grant_scholar', 'zin_inst_add_scar']) assert(eff.includes(`${k} = {`));
  const oa = text('common/on_actions/zin_inst.txt');
  for (const k of ['on_startup', 'on_army_leader_daily', 'on_army_leader_won_combat', 'on_army_leader_lost_combat', 'on_army_leader_promoted', 'on_deployed_leader_defeated']) assert(oa.includes(`${k} = {`), k);
  assert.equal([...oa.matchAll(/recruit_character = /g)].length, 214);
  const grants = [...oa.matchAll(/zin_inst_grant_scholar = yes/g)].length;
  assert(grants >= 12 * 3 + 71 && grants <= 12 * 4 + 71, `scholars: tier A three or four, tier B one (${grants})`);
  const volgan = countries.find(c => c.name === 'Volgan'), vb = oa.slice(oa.indexOf(`\t\t\t${volgan.tag} = {`));
  assert.equal([...vb.slice(0, vb.indexOf('\n\t\t\t}')).matchAll(/zin_inst_grant_scholar = yes/g)].length, 4, 'Volgan holds four scholars, three of them Deep');
  assert(!/create_intelligence_agency|start_special_project|add_to_variable = \{ var = zin_inst_camp/.test(oa), 'no agency, spell or camp at the start');
  assert(text('events/zin_inst.txt').includes('zin_inst.1'));
});

test('Licences and lend-lease: granted archetypes cannot be copied or lent', async () => {
  const rights = await equipmentRights();
  for (const id of D.core.licences.no) { assert.equal(rights[id].can_license, false, id); assert.equal(rights[id].can_be_lend_leased, 'never', id); assert.equal(rights[id].lend_lease_cost, 0, id); }
  for (const id of ['zin_arms_equipment', 'zin_bows_equipment', 'zin_trebuchet_equipment']) { assert.equal(rights[id].can_license, true); assert.equal(rights[id].can_be_lend_leased, 'zin_inst_lend_ok'); }
  assert.equal(rights.zin_trebuchet_equipment.lend_lease_cost, 8);
  assert.equal(rights.zin_hull_warship.can_be_lend_leased, 'never', 'a fleet is not a gift');
  assert.equal(new Set([...D.core.licences.yes, ...D.core.licences.no]).size, D.core.licences.yes.length + D.core.licences.no.length, 'no archetype is both');
  const rows = await defineRows();
  assert.equal(rows[0].key, 'LICENSE_IC_COST_YEAR_INCREASE'); assert.equal(rows[0].value, 0);
  assertDefinesExist(rows, await readFile(`${GAME}/common/defines/00_defines.lua`, 'utf8'));
  const enums = await requiredEnumEntries();
  for (const e of ['zin_arms_equipment', 'zin_ward_equipment', 'zin_hull_great_warship', 'zin_trebuchet_equipment']) assert(enums.includes(e), e);
});

test('AI strategies: only types the installed game documents; market never offers hulls', async () => {
  const doc = await readFile(`${GAME}/common/ai_strategy/_documentation.md`, 'utf8'), types = new Set([...doc.matchAll(/type = (\w+)/g), ...doc.matchAll(/^- `(\w+)`/gm)].map(m => m[1]));
  const s = text('common/ai_strategy/zin_institutions.txt'), used = new Set([...s.matchAll(/type = (\w+)/g)].map(m => m[1]));
  for (const t of used) assert(types.has(t) || ['become_head_of_crypto', 'become_head_of_operations'].includes(t), `unknown AI strategy type ${t}`);
  for (const t of ['equipment_market_for_sale_threshold', 'send_lend_lease_desire', 'intelligence_agency_branch_desire_factor', 'operative_operation', 'build_building']) assert(used.has(t), t);
  assert(s.includes('id = zin_hull_warship') && s.includes('value = 1000000'));
  assert.equal([...s.matchAll(/type = send_lend_lease_desire/g)].length, countries.filter(c => c.overlord).length);
});

test('Text: Erdae words only, British spelling, Windows-1252, and no vanilla name', async () => {
  const entries = {};
  for (const m of locAll.matchAll(/^ ([A-Za-z0-9_.@-]+):0 "(.*)"$/gm)) entries[m[1]] = m[2];
  assert(Object.keys(entries).length > 1500);
  assert.deepEqual(await bannedIn(entries), []);
  assert.deepEqual(notCp1252(entries), []);
  const vanillaNames = ['Abwehr', 'NKVD', 'Stasi', 'Wehrmacht', 'Field Marshal', 'Lend-Lease', 'Quartermaster General', 'Intel Network', 'Cryptology', 'Radio', 'Tank', 'Aircraft', 'Submarine', 'Paratrooper', 'Commando', 'Nuclear'];
  for (const n of vanillaNames) assert(!new RegExp(`\\b${n}\\b`, 'i').test(Object.values(entries).join(' ')), `text contains ${n}`);
  assert(!/afrit|hidden council|deliverer|einendil|edvoid/i.test(Object.values(entries).join(' ')), 'text names the secret or a retired name');
  assert.deepEqual([...staged.files.get('localisation/english/zin_inst_l_english.yml').subarray(0, 3)], [0xef, 0xbb, 0xbf], 'UTF-8 with BOM');
});

test('Names the files define have text: ids, tokens, sprites', async () => {
  const need = [];
  for (const a of D.core.abilities) need.push(a.id, `${a.id}_desc`);
  for (const c of D.core.customs) need.push(`zin_oc_${c.id}`, `zin_oc_${c.id}_desc`);
  for (const o of D.intrigue.operations) need.push(`zin_op_${o.short}`, `zin_op_${o.short}_desc`);
  for (const p of D.intrigue.phases) need.push(p.id, `${p.id}_desc`, `${p.id}_outcome`);
  for (const w of D.craft.workshops) need.push(w.id, `${w.id}_cap`, `${w.id}_initial`, ...['m1', 'm2', 'm3', 'p1', 'p2', 'p3', 's1', 's2', 's3'].map(t => `${w.id}_${t}`));
  for (const s of D.craft.spells) need.push(s.id, `${s.id}_desc`);
  for (const u of D.intrigue.upgrades) need.push(u.id, `${u.id}_desc`);
  for (const u of D.core.hq.units) need.push(u.id, `${u.id}_desc`);
  for (const t of D.traits.traits) need.push(t.id, `${t.id}_desc`);
  for (const k of need) assert(locKeys.has(k), `no text for ${k}`);
  const gfx = text('interface/zz_zin_institutions.gfx'), defined = new Set([...gfx.matchAll(/name = "(GFX_[A-Za-z0-9_]+)"/g)].map(m => m[1]));
  const ok = new Set(['GFX_sp_facility_card_bg']);
  const missing = new Set();
  for (const f of textFiles.filter(f => f.endsWith('.txt'))) for (const m of text(f).matchAll(/\bGFX_[A-Za-z0-9_]+/g)) if (!defined.has(m[0]) && !ok.has(m[0]) && !m[0].startsWith('GFX_zin_portrait_')) missing.add(m[0]);
  assert.deepEqual([...missing], [], 'every picture named by a script is a sprite of this module');
  const catalog = new Set(await loadCatalogKeys());
  for (const m of gfx.matchAll(/texturefile = "gfx\/interface\/ideas\/zin\/([a-z_0-9]+)\.dds"/g)) assert(catalog.has(m[1]), `texture ${m[1]} is not an icon of the catalog`);
});

test('Scripts: every effect, trigger and modifier key is documented, a control word, a variable or an id of this module', async () => {
  const names = f => readFile(`${GAME}/documentation/${f}`, 'utf8').then(t => new Set([...t.matchAll(/^## ([A-Za-z0-9_@.]+)\s*$/gm)].map(m => m[1])));
  const vocab = new Set([...await names('effects_documentation.md'), ...await names('triggers_documentation.md'), ...await names('modifiers_documentation.md')]);
  const control = new Set(['if', 'else', 'else_if', 'limit', 'OR', 'AND', 'NOT', 'always', 'FROM', 'ROOT', 'PREV', 'THIS', 'OWNER', 'random_list', 'hidden_effect', 'add', 'factor', 'base', 'modifier', 'value', 'var', 'target', 'tag', 'days', 'amount', 'type', 'id', 'min', 'max', 'name', 'desc', 'tooltip', 'ratio', 'size', 'unit', 'state', 'folder', 'bonus', 'uses', 'dynamic', 'instant', 'ahead_reduction', 'army', 'navy', 'air', 'idea', 'flag', 'array', 'date', 'x', 'y', 'capital_scope', 'else', 'organisation', 'strength', 'recon', 'experience', 'intel', 'weight', 'reference', 'start_weight', 'start_reference', 'enemy_units', 'resistance', 'level', 'specialization', 'category', 'name', 'threshold', 'option', 'token', 'narrative', 'iteration_output', 'country_effects', 'scientist_effects', 'facility_state_effects', 'immediate', 'effect', 'enable', 'abort', 'abort_when_not_enabled', 'ai_strategy', 'mission', 'operation', 'ideology', 'ai_will_do', 'air_ratio', 'army_ratio', 'navy_ratio', 'army_intel', 'navy_intel', 'civilian_intel', 'airforce_intel', 'all', 'captured_by', 'count', 'division', 'owner', 'capital', 'communism', 'democratic', 'fascism', 'neutrality', 'boost_resistance_chance', 'rule', 'str_damage', 'is_fake_intel_division', 'is_locked']);
  const mine = new Set([...allScript.matchAll(/^\t*([A-Za-z0-9_]+) = \{/gm)].map(m => m[1]));
  const unknown = new Set();
  const scopes = new Set(['effect', 'complete_effect', 'outcome_execute', 'outcome_extra_execute', 'outcome_potential', 'immediate', 'limit', 'available', 'requirements', 'country_effects', 'scientist_effects', 'facility_state_effects', 'one_time_effect', 'custom_cost_trigger', 'on_start']);
  const visit = (list, inside) => { for (const e of list) { const here = inside || scopes.has(e.k); if (e.k && here && !vocab.has(e.k) && !control.has(e.k) && !mine.has(e.k) && !/[@:.]|^[A-Z]{1}\d|^zin_|^num_|^civil_war|^coup_|^fake_intel|^temp|^t$|^ids_|^id_to_|^passed|^chance|^trait_chance|^v$/.test(e.k)) unknown.add(e.k); if (Array.isArray(e.v)) visit(e.v, here); } };
  for (const f of textFiles.filter(f => f.endsWith('.txt') && !f.startsWith('common/units') && !f.includes('unit_leader'))) visit(parse(text(f)), false);
  assert.deepEqual([...unknown].sort(), []);
  // the prefix families above are only accepted when the installed docs list the command
  for (const cmd of ['recruit_character', 'activate_advisor', 'generate_scientist_character', 'add_scientist_xp', 'injure_scientist_for_days', 'add_project_progress_ratio', 'add_dynamic_modifier', 'remove_dynamic_modifier', 'add_timed_idea', 'add_tech_bonus', 'damage_units', 'steal_random_tech_bonus', 'add_operation_token', 'start_civil_war', 'release_captured_generals_from', 'capture_by', 'add_timed_unit_leader_trait', 'free_random_operative', 'execute_operation_coordinated_strike', 'declare_war_on', 'add_decryption', 'add_collaboration', 'add_resistance_target', 'army_experience', 'navy_experience', 'air_experience', 'add_command_power', 'add_equipment_to_stockpile', 'delete_unit', 'create_unit', 'division_template']) assert(vocab.has(cmd), `${cmd} is not in the installed documentation`);
});

// ------------------------------------------------------------------------------------------------ negative tests
test('Negative: a modifier the game does not define is refused', async () => {
  await assert.rejects(checkMods('x', { army_attack_factor_of_doom: 0.5 }), /Unknown modifier army_attack_factor_of_doom/);
  await checkMods('x', { army_attack_factor: 0.1, operation_coup_government_risk: -0.1, country_resource_oil: 4 });
});

test('Negative: a picture outside the icon catalog, and one name bound to two pictures, are refused', async () => {
  const s = new Sprites(await loadCatalogKeys());
  assert.throws(() => s.use('GFX_x', 'no_such_picture'), /not in the icon catalog/);
  s.use('GFX_x', 'sword_shield');
  assert.throws(() => s.use('GFX_x', 'granary'), /two pictures/);
});

test('Negative: duplicate text, duplicate ids and a modern word', async () => {
  const l = new Loc(); l.set('a', 'One'); l.set('a', 'One');
  assert.throws(() => l.set('a', 'Two'), /defined twice/);
  assert.throws(() => l.set('b', ''), /Empty/);
  const keys = await loadCatalogKeys(), core = JSON.parse(JSON.stringify(D.core));
  core.abilities.push(core.abilities[0]);
  await assert.rejects(writeAbilities(new Staged(), { data: { core }, loc: new Loc(), sprites: new Sprites(keys) }), /Duplicate ability/);
  const hits = await bannedIn({ k1: 'The Factory Foreman', k2: 'Tank brigade', k3: 'Wehrmacht', k4: 'Planes over the ocean', k5: 'The Smiths\' Guild' });
  assert.deepEqual([...new Set(hits.map(h => h.key))].sort(), ['k1', 'k2', 'k3', 'k4']);
  assert.deepEqual(notCp1252({ k: 'Šodolôro' }), [], 'the game font draws Š and ô');
  assert.equal(notCp1252({ k: 'Šodolôrō' }).length, 1, 'but not ō');
});

test('Negative: a missing prerequisite, an unknown ability and an unknown phase fail the build', async () => {
  const keys = await loadCatalogKeys(), traits = JSON.parse(JSON.stringify(D.traits));
  const env = traits0 => ({ data: { core: D.core, traits: traits0 }, loc: new Loc(), eloc: new Loc(), sprites: new Sprites(keys) });
  traits.traits.find(t => t.id === 'fast_planner').parents = ['no_such_trait'];
  await assert.rejects(writeUnitLeaderTraits(new Staged(), env(traits)), /unknown trait no_such_trait/);
  const t2 = JSON.parse(JSON.stringify(D.traits)); t2.traits.find(t => t.id === 'fortress_buster').ability = 'zin_ab_missing';
  await assert.rejects(writeUnitLeaderTraits(new Staged(), env(t2)), /unknown ability zin_ab_missing/);
  const t3 = JSON.parse(JSON.stringify(D.traits)); t3.traits.find(t => t.id === 'old_guard').mod = { not_a_real_modifier: 1 };
  await assert.rejects(writeUnitLeaderTraits(new Staged(), env(t3)), /Unknown modifier not_a_real_modifier/);
  const intrigue = JSON.parse(JSON.stringify(D.intrigue)); intrigue.phaseGroups.std.push(['zin_ph_missing', 10]);
  assert.throws(() => writeOperations(new Staged(), { data: { intrigue }, loc: new Loc(), eloc: new Loc(), sprites: new Sprites(keys) }), /unknown phase zin_ph_missing/);
  const i2 = JSON.parse(JSON.stringify(D.intrigue)); i2.phases.push({ ...i2.phases[0], id: 'zin_ph_orphan' });
  assert.throws(() => writeOperations(new Staged(), { data: { intrigue: i2 }, loc: new Loc(), eloc: new Loc(), sprites: new Sprites(keys) }), /used by no operation/);
  const i3 = JSON.parse(JSON.stringify(D.intrigue)); i3.agencies.push({ id: 'ghost', country: 'Atlantis', names: ['Ghosts'], art: 'envoy' });
  assert.throws(() => writeAgencies(new Staged(), { data: { intrigue: i3 }, sprites: new Sprites(keys), countries }), /Atlantis/);
});

test('Negative: a camp unit with a vanilla DLC condition or an unknown tier name fails', async () => {
  const unit = hqUnitText(D.core.hq.units[0], D.core.hq.common);
  assert(!unit.includes('required_dlc'));
  assert.throws(() => tierOf({ tiers: { a: ['Atlantis'], b: [] } }, countries), /Atlantis/);
  const keys = await loadCatalogKeys(), craft = JSON.parse(JSON.stringify(D.craft)); craft.workshops[0].cap.eq = { reliability_of_doom: 1 };
  await assert.rejects(writeWorkshops(new Staged(), { data: { craft }, loc: new Loc(), sprites: new Sprites(keys), countries, table: new Map(countries.map(c => [c.tag, { people: 'men' }])) }), /Unknown modifier reliability_of_doom|Unknown modifier/);
});

test('Vanilla names do not appear in any staged script', () => {
  const tags = ['GER', 'ENG', 'SOV', 'USA', 'JAP', 'FRA', 'ITA', 'ETH', 'SWE', 'POL'];
  for (const t of tags) assert(!new RegExp(`\\b${t}_`).test(allScript), `a script names the vanilla tag ${t}`);
  for (const bad of ['has_dlc', 'infantry_equipment', 'light_tank', 'transport_plane_equipment', 'mechanical_computing', 'GFX_agency_', 'GFX_operations_', 'GFX_phase_infiltration']) assert(!allScript.includes(bad), `a script names ${bad}`);
});

test('Sprites: no sprite of the installed interface is redefined, and the suggested art for vanilla names is listed', async () => {
  const { readdir } = await import('node:fs/promises');
  const vanillaNames = new Set();
  const walk = async dir => { for (const e of await readdir(`${GAME}/${dir}`, { withFileTypes: true })) { if (e.isDirectory()) await walk(`${dir}/${e.name}`); else if (e.name.endsWith('.gfx')) for (const m of (await readFile(`${GAME}/${dir}/${e.name}`, 'latin1')).matchAll(/name\s*=\s*"([^"]+)"/g)) vanillaNames.add(m[1]); } };
  await walk('interface');
  const mine = [...text('interface/zz_zin_institutions.gfx').matchAll(/name = "(GFX_[A-Za-z0-9_]+)"/g)].map(m => m[1]);
  assert(mine.length > 300);
  assert.deepEqual(mine.filter(n => vanillaNames.has(n)), [], 'a vanilla sprite name is defined again');
  const manifest = JSON.parse(text('docs/design/institutions_sprites.json'));
  assert.equal(Object.keys(manifest.sprites).length, mine.length);
  assert(Object.keys(manifest.vanillaNames).includes('GFX_trait_old_guard') && Object.keys(manifest.vanillaNames).includes('GFX_infiltrate_army_bg'));
  assert(Object.keys(manifest.vanillaNames).length >= 100);
});

test('Chiefs carry no portrait of their own: the portrait database serves them by sex and country', () => {
  assert(!text('common/characters/zin_chiefs.txt').includes('portraits'));
  assert(!text('common/characters/zin_chiefs.txt').includes('GFX_'));
});
