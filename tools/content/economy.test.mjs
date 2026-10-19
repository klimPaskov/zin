// Tests for the economy module (docs/specs/03_gameplay/02_economy.md, vanilla removal stage 2). They use only builder
// output: a Staged set filled by buildEconomy with the roster of data/countries.json.
//   node --test tools/content/economy.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { GAME } from './lib/paths.mjs';
import { parse, walk, scriptText } from './lib/clausewitz.mjs';
import { parseYml, loadJson } from './checks/vanilla_refs.mjs';
import { assertDefinesExist, rowsInEffect } from './modules/defines.mjs';
import * as E from './modules/economy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
const { data } = await E.loadEconomy();
const staged = new Staged();
// The reference text: every key the module writes, before it yields keys to the text sweep.
const summary = await E.buildEconomy(staged, { countries, yieldToTextSweep: false });
const text = rel => { const b = staged.files.get(rel); assert(b, `staged ${rel}`); return b.toString('utf8'); };
const entries = rel => parse(scriptText(staged.files.get(rel)));
const block = (list, key) => list.find(e => e.k === key)?.v ?? [];
const replaceLoc = parseYml(text('localisation/replace/zin_economy_l_english.yml'));
const newLoc = parseYml(text('localisation/english/zin_economy_l_english.yml'));
const allLoc = new Map([...replaceLoc, ...newLoc]);

const vanillaLoc = new Map();
for (const f of (await readdir(`${GAME}/localisation/english`)).filter(f => f.endsWith('.yml'))) for (const [k, v] of parseYml(await readFile(`${GAME}/localisation/english/${f}`, 'utf8'))) if (!vanillaLoc.has(k)) vanillaLoc.set(k, v);
const vanillaDefines = await readFile(`${GAME}/common/defines/00_defines.lua`, 'utf8');
const engineVars = s => [...s.matchAll(/\$([A-Z0-9_]+)(?:\|[^$]*)?\$/g)].map(m => m[1]).sort().join(',');
const braces = s => { let d = 0; for (const c of s.replace(/#[^\n]*/g, '')) { if (c === '{') d++; if (c === '}') d--; if (d < 0) return false; } return d === 0; };
const clone = o => JSON.parse(JSON.stringify(o));

// ------------------------------------------------------------------------------------------------- resources
test('The resource file keeps the seven engine keys and frames of the installed game', async () => {
  const list = block(entries('common/resources/00_resources.txt'), 'resources');
  const keys = list.filter(e => e.k).map(e => e.k);
  assert.deepEqual(keys.sort(), ['aluminium', 'chromium', 'coal', 'oil', 'rubber', 'steel', 'tungsten']);
  const vanilla = block(parse(scriptText(await readFile(`${GAME}/common/resources/00_resources.txt`))), 'resources');
  for (const r of list.filter(e => e.k)) {
    const v = vanilla.find(x => x.k === r.k);
    assert.equal(r.v.find(x => x.k === 'icon_frame').v, v.v.find(x => x.k === 'icon_frame').v, `${r.k} frame`);
    assert.equal(r.v.find(x => x.k === 'cic').v, '0.125');
    assert.equal(r.v.find(x => x.k === 'convoys').v, '0.1');
  }
  assert(braces(text('common/resources/00_resources.txt')));
});

test('Every resource carries its Erdae name in all the key families the engine reads', () => {
  const names = { oil: 'Essence', aluminium: 'Timber', rubber: 'Horses', tungsten: 'Stone', steel: 'Iron', chromium: 'Gold', coal: 'Grain' };
  for (const [k, n] of Object.entries(names)) {
    assert.equal(replaceLoc.get(`PRODUCTION_MATERIALS_${k.toUpperCase()}`), n);
    for (const p of ['state_resource_', 'temporary_state_resource_', 'country_resource_']) assert.equal(replaceLoc.get(p + k), n, p + k);
    assert.match(replaceLoc.get(`sabotage_${k}`), new RegExp(n));
  }
  assert.equal(data.resources.length, 7);
});

test('The scarce resources are scarce: Essence and Gold are each about a third of Iron or less', () => {
  const t = data.worldTotals;
  assert(t.oil / t.steel <= 0.35 && t.chromium / t.steel <= 0.35);
  assert.equal(data.regions.find(r => r.key === 'zols_mistake').spirit, null);
  assert(Object.values(data.regions.find(r => r.key === 'zols_mistake').weights).every(w => w === 0), 'Zol produces nothing');
});

test('Negative: a resource key the game does not define, a wrong frame or a missing resource fails', async () => {
  const bad = clone(data); bad.resources[0].key = 'mithril';
  await assert.rejects(E.assertEngineKeys(bad), /resource mithril/);
  const frame = clone(data); frame.resources[2].frame = 4;
  await assert.rejects(E.assertEngineKeys(frame), /rubber frame 4/);
  const few = clone(data); few.resources.pop();
  await assert.rejects(E.assertEngineKeys(few), /resource list differs/);
});

// ---------------------------------------------------------------------------------------------- buildings
test('The landmark file defines one inert landmark and no vanilla landmark', () => {
  const t = text('common/buildings/01_landmark_buildings.txt');
  const list = block(entries('common/buildings/01_landmark_buildings.txt'), 'buildings');
  assert.deepEqual(list.filter(e => e.k).map(e => e.k), ['zin_interim_landmark']);
  assert(!/landmark_(big_ben|kremlin|eiffel)/.test(t));
  assert(!/country_modifiers|show_on_map|enable_for_controllers/.test(t), 'no modifiers, model or controller');
  assert.match(t, /is_buildable = no/);
  assert(braces(t));
  assert.equal(replaceLoc.has('zin_interim_landmark'), false, 'its text is a new key');
  assert(newLoc.has('zin_interim_landmark') && newLoc.has('zin_interim_landmark_desc'));
});

test('No ZIN state or map file places the landmark or a vanilla landmark', async () => {
  const world = JSON.parse(await readFile(path.join(here, '../../.hoi4-agent-world.json'), 'utf8'));
  for (const f of world.files.filter(f => /^history\/states\//.test(f.relativePath)).slice(0, 400)) {
    assert(!/landmark_/.test(await readFile(path.join(here, '../..', f.relativePath), 'utf8')), f.relativePath);
  }
});

test('Every building key keeps its engine definition and gets an Erdae name, plural and description', async () => {
  const types = new Set(await E.buildingTypes());
  const used = data.buildings.filter(b => b.status === 'used');
  assert.equal(used.length, 17);
  for (const b of data.buildings) {
    assert(types.has(b.key), `${b.key} is an installed building`);
    assert.equal(allLoc.get(b.key), b.name);
    assert(allLoc.get(`${b.key}_desc`).length > 20, `${b.key} description`);
  }
  const names = { industrial_complex: 'Guild Workshop', arms_factory: 'Armoury', dockyard: 'Shipwright', infrastructure: 'Road', rail_way: 'High Road', supply_node: 'Depot', naval_base: 'Harbour', naval_supply_hub: 'Victualling Yard', naval_headquarters: 'Admiralty', air_base: 'Eyrie', bunker: 'Stone Fort', coastal_bunker: 'Sea Fort', stronghold_network: 'Fortress Network', energy_infrastructure: 'Granary', industrial_infrastructure: 'Mine and Quarry Roads' };
  for (const [k, n] of Object.entries(names)) assert.equal(replaceLoc.get(k), n, k);
  assert.equal(replaceLoc.get('industrial_complex_plural'), 'Guild Workshops');
  assert.equal(replaceLoc.get('arms_factory_plural'), 'Armouries');
});

test('The building file of the game stays vanilla: the module does not override it', () => {
  assert.equal(staged.files.has('common/buildings/00_buildings.txt'), false);
  for (const rel of staged.files.keys()) assert(!/^common\/(state_category|terrain)\//.test(rel), `${rel} is kept vanilla`);
});

test('The hidden buildings (refinery, silo, rocket site, reactors, dams, canals) are named but not usable', () => {
  for (const k of ['synthetic_refinery', 'fuel_silo', 'rocket_site', 'nuclear_reactor', 'dam', 'canal_kiel']) {
    const b = data.buildings.find(x => x.key === k);
    assert.equal(b.status, 'hidden', k);
    assert.match(b.desc, /None|No art|none/, `${k} says it is not raised`);
  }
  assert.equal(replaceLoc.get('fuel_silo'), 'Essence Vault');
});

test('The state categories keep their slots and read in Erdae terms in both key families', async () => {
  assert.equal(data.stateCategories.length, 13);
  await E.assertEngineKeys(data);
  for (const c of data.stateCategories) { assert.equal(replaceLoc.get(`STATE_CATEGORY_${c.key}`), c.name); assert.equal(replaceLoc.get(c.key), c.name); }
  assert.equal(new Set(data.stateCategories.map(c => c.name)).size, 13);
  assert.equal(replaceLoc.get('metropolis'), 'Royal City');
  assert.equal(replaceLoc.get('tiny_island'), 'Skerry');
  for (const c of data.stateCategories) assert.notEqual(replaceLoc.get(c.key), vanillaLoc.get(c.key), `${c.key} differs from vanilla`);
});

test('Negative: a state category with the wrong slots, or one the game lacks, fails', async () => {
  const bad = clone(data); bad.stateCategories.find(c => c.key === 'city').slots = 7;
  await assert.rejects(E.assertEngineKeys(bad), /state category city slots 7/);
  const ghost = clone(data); ghost.stateCategories.push({ key: 'citadel', slots: 4, name: 'Citadel' });
  await assert.rejects(E.assertEngineKeys(ghost), /state category citadel/);
  const b = clone(data); b.buildings.push({ key: 'zin_forge_of_dawn', status: 'used', name: 'X', plural: 'X', desc: 'X' });
  await assert.rejects(E.assertEngineKeys(b), /building zin_forge_of_dawn/);
});

// ------------------------------------------------------------------------------------------------- energy
test('The energy system is Provisions fed by Grain, with its alert, bar texts and building names', () => {
  for (const k of ['TOPBAR_ENERGY_DEMAND', 'TOPBAR_ENERGY_GENERATED', 'TOPBAR_COAL_CURRENTLY_USED', 'TOPBAR_TOTAL_COAL', 'ENERGY_DEMAND', 'RECEIVED_ENERGY']) assert.match(replaceLoc.get(k), /Provisions|Grain/, k);
  assert.equal(replaceLoc.get('alert_lack_of_power_instant'), '§HProvisions Run Short§!');
  for (const k of ['alert_lack_of_power_delayed_header', 'alert_lack_of_power_delayed_civ', 'alert_lack_of_power_delayed_mil', 'alert_lack_of_power_delayed_nav']) assert(replaceLoc.has(k), k);
  assert.match(replaceLoc.get('alert_lack_of_power_delayed_mil'), /Armoury/);
  assert.match(replaceLoc.get('alert_lack_of_power_delayed_nav'), /Shipwright/);
  assert.match(replaceLoc.get('alert_lack_of_power_delayed_civ'), /Guild Workshop/);
  assert.equal(replaceLoc.get('energy_infrastructure'), 'Granary');
  assert.equal(replaceLoc.get('FUEL'), 'Stored Essence');
});

test('Energy defines are written for the economy stage and exist in the installed game', async () => {
  const defs = await loadJson('defines.json').catch(async () => JSON.parse(await readFile(path.join(here, 'data/defines.json'), 'utf8')));
  const rows = defs.rows.filter(r => r.owner === '03_gameplay/02_economy.md');
  assert.equal(rows.length, 3);
  assertDefinesExist(rows, vanillaDefines);
  const byKey = Object.fromEntries(rows.map(r => [r.key, r]));
  assert.equal(byKey.BASE_COUNTRY_ENERGY_PRODUCTION.value, 12);
  assert.equal(byKey.NUM_FACTORIES_IN_STATE_TO_WANT_ENERGY_REDUCTION.value, 3);
  assert.equal(byKey.TOTAL_STATE_EXTRACTED_RESOURCES_FOR_BUILDING_RESOURCE_CAP_BUILDING.value, 12);
  assert(rows.every(r => r.fromStage === 2 && r.why.length > 20));
  const inEffect = rowsInEffect(defs.rows, 2).map(r => r.key);
  assert(inEffect.includes('BASE_COUNTRY_ENERGY_PRODUCTION'));
  assert(!rowsInEffect(defs.rows, 1).some(r => r.key === 'BASE_COUNTRY_ENERGY_PRODUCTION'), 'not before stage 2');
  assert(!defs.rows.some(r => r.key === 'ENERGY_RESOURCE' || r.key === 'RESOURCE_TO_ENERGY_COEFFICIENT'), 'Grain stays the energy resource at 9 per unit');
  assert.equal(data.energy.engineResource, 'coal');
  assert.equal(data.energy.fuelResource, 'oil');
});

test('Negative: an energy define the game does not define fails the defines check', () => {
  assert.throws(() => assertDefinesExist([{ category: 'NProduction', key: 'BASE_COUNTRY_PROVISIONS', value: 12 }], vanillaDefines), /no such define/);
  assert.throws(() => assertDefinesExist([{ category: 'NEnergy', key: 'BASE_COUNTRY_ENERGY_PRODUCTION', value: 12 }], vanillaDefines), /no such category/);
});

test('The design model: a realm of ten buildings is fed by the base alone, Aenor needs Grain', () => {
  const m = data.energy.model, cost = n => Math.min(m.cap, m.baseCost + m.scaling * n);
  assert(10 * cost(10) < m.base, 'ten buildings are fed by the base');
  const aenor = data.startIndustry.find(c => c.country === 'Aenor'), n = aenor.workshops + aenor.armouries + aenor.shipwrights;
  assert.equal(n, 52);
  const need = n * cost(n) - m.base;
  assert(need > 0 && need / m.coefficient < 10, `Aenor needs about ${(need / m.coefficient).toFixed(1)} Grain`);
});

// -------------------------------------------------------------------------------------------------- text
test('No error word of the banned list appears in any text the module writes, and no review word either', async () => {
  let n = 0;
  for (const [k, v] of allLoc) { n++; assert.deepEqual(await E.bannedHits(v), [], k); assert.deepEqual(await E.bannedHits(v, 'review'), [], k); }
  assert(n > 900, `${n} keys`);
  for (const w of ['Oil', 'Steel', 'Aluminium', 'Rubber', 'Tungsten', 'Chromium', 'Coal', 'Fuel', 'Civilian Factory', 'Military Factory', 'Synthetic Refinery'])
    for (const [k, v] of allLoc) assert(!new RegExp(`\\b${w}\\b`, 'i').test(E.playerText(v)), `${k} says ${w}`);
});

test('Negative: a modern word in a text value fails the check', async () => {
  await assert.rejects(E.assertPlayerText({ a_key: 'Each Civilian Factory yields less' }), /Banned words in player text[\s\S]*a_key/);
  await assert.rejects(E.assertPlayerText({ b_key: 'We hold Steel and Oil' }), /b_key/);
  await assert.rejects(E.assertPlayerText({ c_key: 'The Nuclear Reactor is ready' }), /c_key/);
  await assert.rejects(E.assertPlayerText({ d_key: 'Energy demand in 1936' }), /d_key/);
  await E.assertPlayerText({ ok: 'Each Guild Workshop yields less Grain' });
});

test('Every replaced key that the game defines keeps the placeholders the engine fills, and differs from the vanilla value', () => {
  let checked = 0;
  for (const [k, v] of replaceLoc) {
    const old = vanillaLoc.get(k);
    if (old === undefined) continue;
    checked++;
    assert.notEqual(v, old, `${k} copies the vanilla value`);
    assert.equal(engineVars(v), engineVars(old), `${k} placeholders`);
  }
  assert(checked > 900, `${checked} replaced keys checked`);
});

test('Colour codes open and close in balance in every value', () => {
  for (const [k, v] of allLoc) {
    const opens = (v.match(/§[^!]/g) ?? []).length, closes = (v.match(/§!/g) ?? []).length;
    assert.equal(closes, opens, `${k} colour codes`);
    assert(!/[^\u0000-ÿ‘’]/.test(v.replace(/[£§]/g, '')), `${k} has a character the game font cannot draw`);
  }
});

test('Text icons used in the values exist in the installed interface or the module sprite list', async () => {
  const known = new Set(data.sprites.texticons.map(s => s.replace(/^GFX_/, '')));
  for (const f of (await readdir(`${GAME}/interface`)).filter(f => f.endsWith('.gfx'))) for (const m of (await readFile(`${GAME}/interface/${f}`, 'utf8')).matchAll(/name\s*=\s*"GFX_([A-Za-z0-9_]+)"/g)) known.add(m[1]);
  for (const [k, v] of allLoc) for (const m of v.matchAll(/£([A-Za-z0-9_]+)£?/g)) assert(known.has(m[1].replace(/^GFX_/, '')), `${k} uses the icon ${m[1]}`);
});

test('A module that writes the same keys can switch a group off, and doing so removes exactly that group', async () => {
  const s2 = new Staged();
  await E.buildEconomy(s2, { countries, skipLoc: ['market', 'facilities'], yieldToTextSweep: false });
  const r2 = parseYml(s2.files.get('localisation/replace/zin_economy_l_english.yml').toString('utf8'));
  assert.equal(r2.has('MARKET_LABEL'), false);
  assert.equal(r2.has('nuclear_facility'), false);
  assert.equal(r2.has('land_facility'), false);
  assert.equal(r2.get('industrial_complex'), 'Guild Workshop');
  assert(replaceLoc.has('MARKET_LABEL') && replaceLoc.get('nuclear_facility') === 'Deep Circle');
});

// ----------------------------------------------------------------------------------------------- modifiers
test('Every modifier of the spirits exists in the installed modifier documentation, templates included', async () => {
  const types = await E.buildingTypes();
  const all = [...data.spirits.regional, ...data.spirits.timed];
  assert.equal(all.length, 17);
  for (const s of all) await E.assertEconomyModifiers(s.key, s.modifier, types);
  await E.assertEconomyModifiers('template', { production_speed_dockyard_factor: 0.1, production_speed_arms_factory_factor: 0.1 }, types);
});

test('Negative: an unknown modifier or an unknown template type fails', async () => {
  await assert.rejects(E.assertEconomyModifiers('x', { zin_fake_factor: 1 }, []), /Unknown modifier zin_fake_factor/);
  await assert.rejects(E.assertEconomyModifiers('x', { production_speed_forge_of_dawn_factor: 1 }, ['dockyard']), /production_speed_forge_of_dawn_factor/);
  await assert.rejects(E.assertEconomyModifiers('x', { production_speed__factor: 1 }, ['']), /Unknown modifier/);
});

// ------------------------------------------------------------------------------------------------- spirits
test('The ideas file holds the eleven regional spirits and six timed ideas with catalog pictures', async () => {
  const list = block(entries('common/ideas/zin_economy.txt'), 'ideas');
  const ideas = block(list, 'country').filter(e => e.k);
  assert.equal(ideas.length, 17);
  const catalog = await readFile(path.join(here, '../../interface/zin_catalog_ideas.gfx'), 'utf8');
  for (const i of ideas) {
    const pic = i.v.find(x => x.k === 'picture').v;
    assert(catalog.includes(`GFX_idea_${pic}"`), `${i.k} picture ${pic} is in the icon catalog`);
    assert(i.k.startsWith('zin_econ_'));
    assert.equal(i.v.find(x => x.k === 'removal_cost').v, '-1');
    assert(allLoc.has(i.k) && allLoc.has(`${i.k}_desc`), `${i.k} text`);
  }
  assert(braces(text('common/ideas/zin_economy.txt')));
});

test('Startup gives every country one region flag and its region spirit, except Zol, which gets the flag only', () => {
  const t = text('common/on_actions/zin_economy.txt');
  const aenor = countries.find(c => c.name === 'Aenor'), zol = countries.find(c => c.name === 'Zol');
  for (const c of countries) {
    const key = data.regionByRoster[c.scan], line = new RegExp(`\\t${c.tag} = \\{ set_country_flag = zin_region_${key}( add_ideas = (zin_econ_\\w+))? \\}`).exec(t);
    assert(line, c.tag);
    assert.equal(line[2] === undefined, key === 'zols_mistake', `${c.tag} spirit`);
  }
  assert.equal(data.regionByRoster[zol.scan], 'zols_mistake');
  assert.equal((t.match(/set_country_flag = zin_region_/g) ?? []).length, countries.length);
  assert.match(t, new RegExp(`${aenor.tag} = \\{\\s*set_country_flag = zin_economy_has_treasury\\s*set_variable = \\{ zin_aenor_gold = 400 \\}`));
  assert(braces(t));
  const keys = new Set(data.regions.map(r => r.key));
  for (const v of Object.values(data.regionByRoster)) assert(keys.has(v), v);
});

test('Negative: a roster region without an economic region, or a roster without Aenor, fails', () => {
  assert.throws(() => E.regionOf({ name: 'Nowhere', scan: 'Moonlands' }, data), /No economic region for roster region "Moonlands"/);
  assert.throws(() => E.onActionsFile(data, countries.filter(c => c.name !== 'Aenor')), /no Aenor/);
});

test('The great powers start with the spec industry: Aenor first, workshops about three to one over armouries', () => {
  const rows = data.startIndustry;
  const aenor = rows.find(r => r.country === 'Aenor');
  for (const r of rows) {
    assert(countries.some(c => c.name === r.country), `${r.country} is in the roster`);
    if (r.country !== 'Aenor') assert(aenor.workshops + aenor.armouries > r.workshops + r.armouries, `${r.country} below Aenor`);
  }
  assert.equal(aenor.workshops, 32);
  assert(rows.find(r => r.country === 'Volgan').armouries > rows.find(r => r.country === 'Volgan').workshops, 'the Dead Lands run forges first');
});

// ------------------------------------------------------------------------------------------------ treasury
test('The treasury is changed only through zin_economy_add_gold, clamped, with Crown Debts on underflow', () => {
  const t = text('common/scripted_effects/zin_economy.txt');
  assert.match(t, /zin_economy_add_gold = \{[\s\S]*has_country_flag = zin_economy_has_treasury/);
  assert.match(t, /clamp_variable = \{ var = zin_aenor_gold min = 0 max = 2000 \}/);
  assert.match(t, /zin_econ_crown_debts days = 180/);
  assert.match(t, /add_to_variable = \{ zin_aenor_gold = zin_arg_value \}/);
  assert(!/set_variable = \{ zin_aenor_gold = [1-9]/.test(t), 'no other writer');
  assert(braces(t));
  const roots = entries('common/scripted_effects/zin_economy.txt').filter(e => e.k).map(e => e.k);
  assert.deepEqual(roots, ['zin_economy_add_gold', 'zin_economy_apply_crown_debts', 'zin_economy_monthly_gold']);
});

test('The monthly runner follows the income and drain tables of the spec', () => {
  const t = text('common/scripted_effects/zin_economy.txt');
  assert.match(t, /zin_econ_income = 20 \}/);
  for (const [amount, income] of [[19, 20], [9, 10], [4, 5]]) assert(t.includes(`amount > ${amount} extracted = yes`) && t.includes(`zin_econ_income = ${income} }`), `gold mines ${amount}`);
  assert.match(t, /num_of_civilian_factories > 29/);
  assert.match(t, /has_global_flag = zin_elves_wall_roads_closed[\s\S]*zin_econ_income = 0[\s\S]*zin_elves_cold_roads[\s\S]*zin_econ_income = 1[\s\S]*zin_wall_accord[\s\S]*zin_econ_income = 3/);
  assert.match(t, /multiply_temp_variable = \{ zin_econ_upkeep = 0\.15 \}/);
  assert.match(t, /multiply_temp_variable = \{ zin_econ_upkeep = 0\.3 \}/);
  assert.match(t, /check_variable = \{ zin_concord_loyalty > 39 \}/);
  assert.match(text('common/on_actions/zin_economy.txt'), /on_monthly = \{[\s\S]*zin_economy_monthly_gold = yes/);
});

test('Everything the economy files call is defined by the economy files or is a contract name', () => {
  const effects = new Set(entries('common/scripted_effects/zin_economy.txt').filter(e => e.k).map(e => e.k));
  const ideas = new Set(block(block(entries('common/ideas/zin_economy.txt'), 'ideas'), 'country').filter(e => e.k).map(e => e.k));
  const scripts = ['common/on_actions/zin_economy.txt', 'common/scripted_effects/zin_economy.txt', 'common/scripted_triggers/zin_economy.txt', 'common/ai_strategy/zin_economy.txt'];
  for (const rel of scripts) walk(entries(rel), e => {
    if (e.k && /^zin_economy_/.test(e.k) && e.v === 'yes') assert(effects.has(e.k), `${rel}: ${e.k}`);
    if ((e.k === 'add_ideas' || e.k === 'idea' || e.k === 'has_idea' || e.k === 'remove_ideas') && typeof e.v === 'string') assert(ideas.has(e.v), `${rel}: idea ${e.v}`);
  });
  assert.equal(entries('common/scripted_triggers/zin_economy.txt').filter(e => e.k).map(e => e.k)[0], 'zin_economy_aenor_in_debt');
});

test('The opinion modifier and the AI strategy use the installed keys and triggers', async () => {
  const om = block(entries('common/opinion_modifiers/zin_economy.txt'), 'opinion_modifiers');
  assert.equal(om[0].k, 'zin_opinion_aenoran_gold');
  assert.equal(om[0].v.find(x => x.k === 'value').v, '25');
  const trig = await readFile(`${GAME}/documentation/triggers_documentation.md`, 'utf8');
  assert.match(trig, /## energy_ratio/);
  const ai = text('common/ai_strategy/zin_economy.txt');
  assert.match(ai, /type = build_building\s+id = energy_infrastructure/);
  assert.match(ai, /energy_ratio < 0\.9/);
  assert(braces(ai));
});

test('The constants file declares the treasury numbers with a schema', () => {
  const t = text('common/script_constants/zin_economy_constants.txt');
  const g = block(entries('common/script_constants/zin_economy_constants.txt'), 'zin_economy');
  assert.equal(g[0].k, 'schema');
  const get = k => g.find(x => x.k === k)?.v;
  assert.equal(get('gold_max'), '2000');
  assert.equal(get('gold_start'), '400');
  assert.equal(get('debt_days'), '180');
  assert.equal(block(entries('common/script_constants/zin_economy_constants.txt'), 'zin_economy_rates').find(x => x.k === 'court_upkeep_alive').v, '0.3');
  assert(braces(t));
});

// ------------------------------------------------------------------------------------- enums and tokens
test('script_enums.txt is the installed file when no ZIN equipment is staged', async () => {
  const vanilla = (await readFile(`${GAME}/common/script_enums.txt`, 'utf8')).replace(/^﻿/, '').replace(/\r\n/g, '\n');
  assert.equal(text('common/script_enums.txt').replace(/\r\n/g, '\n').trimEnd(), vanilla.trimEnd());
});

test('script_enums.txt gains every staged ZIN equipment key inside the bonus type block, once, sorted', async () => {
  const s2 = new Staged();
  s2.text('common/units/equipment/zin_arms.txt', 'equipments = {\n\tzin_arms_equipment = { year = 1748 is_archetype = yes }\n\tzin_arms_equipment_1 = { archetype = zin_arms_equipment }\n\tzin_cog_hull = { }\n}\n');
  await E.buildEconomy(s2, { countries, equipmentKeys: ['zin_arms_equipment', 'zin_wardstone_equipment'], yieldToTextSweep: false });
  const t = s2.files.get('common/script_enums.txt').toString('utf8');
  const [a, b] = E.topLevelBlock(t, 'script_enum_equipment_bonus_type');
  const body = t.slice(a, b);
  for (const k of ['zin_arms_equipment', 'zin_arms_equipment_1', 'zin_cog_hull', 'zin_wardstone_equipment']) assert.equal((body.match(new RegExp(`^\\t${k}$`, 'm')) ?? []).length, 1, k);
  assert(body.indexOf('zin_arms_equipment\n') < body.indexOf('zin_wardstone_equipment'));
  assert(body.includes('infantry_equipment') && body.includes('motorized_equipment_1'), 'vanilla identifiers stay');
  assert(braces(t));
  assert(E.topLevelBlock(t, 'script_enum_equipment_category') && E.topLevelBlock(t, 'script_enum_equipment_stat'), 'other blocks intact');
  assert(s2.files.get('common/synchronized_dynamic_tokens/zin_tokens.txt').toString('utf8').includes('zin_cog_hull'));
});

test('Negative: an enum file without the bonus type block is refused', () => {
  assert.throws(() => E.scriptEnumsFile('script_enum_equipment_stat = {\n\tdefense\n}\n', ['zin_x']), /script_enum_equipment_bonus_type is missing/);
});

test('The tokens file lists the resources, the buildings in use and the alignments, sorted and unique', () => {
  const lines = text('common/synchronized_dynamic_tokens/zin_tokens.txt').split('\n').filter(l => l && !l.startsWith('#'));
  assert.deepEqual(lines, [...new Set(lines)].sort());
  for (const k of ['oil', 'coal', 'steel', 'industrial_complex', 'arms_factory', 'dockyard', 'democratic', 'fascism', 'communism', 'neutrality']) assert(lines.includes(k), k);
  assert(!lines.some(l => /nuclear|rocket|refinery/.test(l)));
});

// ------------------------------------------------------------------------------- build behaviour and sprites
test('The output is deterministic and a second build into the same set is refused', async () => {
  const s2 = new Staged();
  await E.buildEconomy(s2, { countries, yieldToTextSweep: false });
  assert.deepEqual([...s2.files.keys()], [...staged.files.keys()]);
  for (const [rel, bytes] of staged.files) assert(bytes.equals(s2.files.get(rel)), rel);
  await assert.rejects(E.buildEconomy(staged, { countries, yieldToTextSweep: false }), /Duplicate staged file/);
});

test('The builder needs the roster', async () => {
  await assert.rejects(E.buildEconomy(new Staged(), {}), /needs the roster/);
});

test('The summary counts what was generated', () => {
  assert.equal(summary.resources, 7);
  assert.equal(summary.buildings, 33);
  assert.equal(summary.stateCategories, 13);
  assert.equal(summary.spirits, 17);
  assert(summary.replaceKeys > 900 && summary.newKeys >= 36);
});

test('Localisation files are UTF-8 with a byte order mark and the l_english header', () => {
  for (const rel of ['localisation/replace/zin_economy_l_english.yml', 'localisation/english/zin_economy_l_english.yml']) {
    const b = staged.files.get(rel);
    assert.deepEqual([...b.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
    assert(b.subarray(3, 12).toString() === 'l_english');
  }
});

test('The sprite list names the strips and the frame counts the art track draws', () => {
  const strips = Object.fromEntries(data.sprites.strips.map(s => [s.sprite, s]));
  assert.equal(strips.GFX_resources_strip.frames, 7);
  assert.equal(strips.GFX_buildings_strip.frames, 31);
  assert(data.sprites.texticons.includes('GFX_out_of_power_texticon') && data.sprites.texticons.includes('GFX_energy_texticon'));
  assert(data.sprites.alertFrames.some(a => a.alert === 'alert_lack_of_power'));
});

test('The disposition rows this module satisfies are staged, and the kept folders are not touched', async () => {
  const disp = await loadJson('dispositions.json');
  const mine = disp.rows.filter(r => r.owner === 'docs/specs/03_gameplay/02_economy.md' && r.stage === 2 && ['common/resources/00_resources.txt', 'common/buildings/01_landmark_buildings.txt'].includes(r.path));
  assert.equal(mine.length, 2);
  for (const r of mine) for (const z of r.zin) assert(staged.files.has(z), z);
  for (const keep of ['common/state_category', 'common/buildings', 'common/terrain']) assert.equal(disp.rows.find(r => r.path === keep).action, 'keep');
});

test('Keys the text sweep already writes are left to it, so no key is defined twice in localisation/replace', async () => {
  const s2 = new Staged();
  const r = await E.buildEconomy(s2, { countries });
  const sweep = await E.textSweepKeys();
  const mine = parseYml(s2.files.get('localisation/replace/zin_economy_l_english.yml').toString('utf8'));
  for (const k of mine.keys()) assert(!sweep.has(k), `${k} is written by the text sweep too`);
  assert(r.yielded.length > 0 && r.yielded.every(k => replaceLoc.has(k) && sweep.has(k)), 'every yielded key is one the sweep writes');
  assert(r.yielded.includes('alert_lack_of_power_instant'), 'the energy alerts are the text sweep draft');
  assert.equal(mine.size + r.yielded.length, replaceLoc.size, 'nothing else is lost');
  assert(mine.has('industrial_complex') && mine.has('PRODUCTION_MATERIALS_STEEL'), 'building and resource names stay with this module');
});
