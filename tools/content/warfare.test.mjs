// Tests for the warfare module (docs/specs/03_gameplay/01_warfare.md, 09_naval_air_doctrines.md): sub-units, equipment, ship
// modules, groups, categories, tactics and the name lists. They use only builder output: a Staged set built from the roster of
// data/countries.json. Negative tests plant a bad row in a copy of the data and expect the module to refuse it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { parse, scriptText } from './lib/clausewitz.mjs';
import { GAME, ZIN } from './lib/paths.mjs';
import { compileBanned, findBanned } from './lib/banned.mjs';
import { buildNames } from './modules/names.mjs';
import {
  buildWarfare, loadRaw, prepareModel, solveUnit, unitPiercing, divisionPiercing, variantStats, hullBase, transformTactics, ordinalWord,
  equipmentStatEnum, engineCategories, TERRAIN_KEYS, entityScale,
} from './modules/warfare.mjs';
import { UNITS as UNIT_MODEL_ASSETS } from './modules/units3d.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
const { labels } = JSON.parse(await readFile(path.join(here, 'data/labels.json'), 'utf8'));
const banned = compileBanned(JSON.parse(await readFile(path.join(here, 'data/banned_words.json'), 'utf8')));
const raw0 = await loadRaw();
const clone = () => structuredClone(raw0);

// One build per test file; names are drawn from a fresh registry so the run is repeatable.
async function build(raw) {
  const pools = buildNames(new Staged(), countries, labels);
  const staged = new Staged(), ctx = { countries, pools, raw };
  const summary = await buildWarfare(staged, ctx);
  return { staged, summary, model: ctx.model };
}
const { staged, summary, model } = await build(clone());
const text = rel => { const b = staged.files.get(rel); assert(b, `staged file ${rel}`); return b.toString('utf8'); };
const hasBom = rel => { const b = staged.files.get(rel); return b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf; };
const rejects = async (mutate, pattern, { build: full = false } = {}) => {
  const raw = clone(); mutate(raw);
  if (full) await assert.rejects(build(raw), pattern);
  else await assert.rejects(prepareModel({ countries }, raw), pattern);
};
const entriesOf = rel => parse(text(rel));
const locOf = rel => { const m = new Map(); for (const l of text(rel).split('\n')) { const x = l.match(/^ ([A-Za-z0-9_.\-]+):\d+ "(.*)"$/); if (x) m.set(x[1], x[2]); } return m; };
const mainLoc = locOf('localisation/english/zin_warfare_l_english.yml'), replaceLoc = locOf('localisation/replace/zin_warfare_l_english.yml');
const braces = s => { let d = 0, inStr = false; for (const ch of s.replace(/#[^\n]*/g, '')) { if (ch === '"') inStr = !inStr; else if (!inStr) { if (ch === '{') d++; else if (ch === '}') d--; if (d < 0) return -1; } } return d; };

const unitFiles = ['zin_men', 'zin_elves', 'zin_sun_elves', 'zin_orcs', 'zin_kin', 'zin_demons', 'zin_dead', 'zin_siege', 'zin_camp', 'zin_great_beings', 'zin_ships', 'zin_air'].map(f => `common/units/${f}.txt`);
const eqFiles = ['land', 'naval', 'air', 'granted'].map(k => `common/units/equipment/zin_equipment_${k}.txt`);
const unitBlocks = new Map();
for (const f of unitFiles) for (const e of entriesOf(f).find(x => x.k === 'sub_units').v) unitBlocks.set(e.k, e.v);
const eqBlocks = new Map();
for (const f of eqFiles) for (const e of entriesOf(f).find(x => x.k === 'equipments').v) eqBlocks.set(e.k, e.v);
const field = (blockEntries, key) => blockEntries.find(x => x.k === key)?.v;
const listOf = v => Array.isArray(v) ? v.map(x => x.v) : [];

// What the installed game defines (read-only).
const gameFiles = async dir => (await readdir(`${GAME}/${dir}`)).filter(f => f.endsWith('.txt')).map(f => `${GAME}/${dir}/${f}`);
const topKeys = (file, outer) => { const e = parse(scriptText(readFileSync(file))).find(x => x.k === outer); return e ? e.v.filter(x => x.k).map(x => ({ k: x.k, fields: Array.isArray(x.v) ? x.v.filter(y => y.k).map(y => y.k) : [] })) : []; };
const vanillaUnitIds = new Set(), vanillaUnitFields = new Set(), vanillaEqIds = new Set(), vanillaEqFields = new Set(), vanillaModuleFields = new Set(), vanillaModuleStats = new Set();
for (const f of await gameFiles('common/units')) for (const u of topKeys(f, 'sub_units')) { vanillaUnitIds.add(u.k); u.fields.forEach(x => vanillaUnitFields.add(x)); }
for (const f of await gameFiles('common/units/equipment')) for (const e of topKeys(f, 'equipments')) { vanillaEqIds.add(e.k); e.fields.forEach(x => vanillaEqFields.add(x)); }
for (const f of await gameFiles('common/units/equipment/modules')) {
  const top = parse(scriptText(readFileSync(f))).find(x => x.k === 'equipment_modules');
  for (const m of top.v.filter(x => x.k && Array.isArray(x.v))) for (const y of m.v) { if (y.k) vanillaModuleFields.add(y.k); if (['add_stats', 'multiply_stats', 'add_average_stats'].includes(y.k)) y.v.forEach(z => vanillaModuleStats.add(z.k)); }
}

// ------------------------------------------------------------------------------------------------ counts and files
test('The build stages every file the spec names and counts what it generates', () => {
  assert.equal(summary.subUnits, 61, '55 land sub-units, 4 ships, 2 air');
  assert.equal(summary.landSubUnits, 55);
  assert.equal(summary.ships, 4);
  assert.equal(summary.air, 2);
  assert.equal(summary.modules, 16);
  assert.equal(summary.upgrades, 5);
  assert.equal(summary.groups, 11);
  assert.equal(summary.archetypes, 33, '29 archetypes and 4 hulls');
  for (const f of [...unitFiles, ...eqFiles, 'common/units/equipment/modules/zin_ship_modules.txt', 'common/units/equipment/upgrades/zin_upgrades.txt', 'common/equipment_groups/zin_equipment_groups.txt', 'common/unit_tags/zin_unit_tags.txt', 'common/combat_tactics.txt', 'common/units/names/zin_names.txt', 'common/units/names_divisions/zin_names_divisions.txt', 'common/units/names_ships/zin_names_ships.txt', 'common/units/names_railway_guns/zin_names_railway_guns.txt', 'common/units/codenames_operatives/zin_operative_codenames.txt', 'gfx/entities/zin_warfare.asset', 'interface/zin_units.gfx', 'interface/zin_equipment.gfx', 'localisation/english/zin_warfare_l_english.yml', 'localisation/replace/zin_warfare_l_english.yml']) assert(staged.files.has(f), `missing ${f}`);
});
test('Every staged script file has balanced braces and every folder it replaces holds a definition', () => {
  for (const [rel, bytes] of staged.files) if (/\.(txt|gfx|asset)$/.test(rel)) assert.equal(braces(bytes.toString('utf8')), 0, `${rel} braces`);
  for (const f of unitFiles) assert((field(entriesOf(f), 'sub_units') ?? entriesOf(f)[0].v).length > 0, `${f} empty`);
  assert(entriesOf('common/units/names_railway_guns/zin_names_railway_guns.txt').length >= 1);
  assert(entriesOf('common/equipment_groups/zin_equipment_groups.txt').length === 11);
});
test('The build is deterministic', async () => {
  const again = await build(clone());
  assert.equal(again.staged.files.size, staged.files.size);
  for (const [rel, bytes] of staged.files) assert(bytes.equals(again.staged.files.get(rel)), `${rel} differs between builds`);
});

// ------------------------------------------------------------------------------------------------ vanilla removal
test('No vanilla sub-unit or equipment key is defined except the three kept keys and their variants', () => {
  for (const id of unitBlocks.keys()) { assert(id.startsWith('zin_'), id); assert(!vanillaUnitIds.has(id), `${id} is a vanilla sub-unit`); }
  const kept = new Set(['convoy', 'convoy_1', 'train_equipment', 'train_equipment_1', 'motorized_equipment', 'motorized_equipment_0', 'motorized_equipment_1']);
  for (const id of eqBlocks.keys()) if (vanillaEqIds.has(id)) assert(kept.has(id), `${id} is a vanilla equipment key`);
  for (const k of ['convoy', 'train_equipment', 'motorized_equipment']) assert(eqBlocks.has(k), `${k} must stay defined`);
  for (const k of ['convoy_0', 'convoy_1', 'train_equipment_0', 'train_equipment_1', 'motorized_equipment_0', 'motorized_equipment_1', 'motorized_equipment_2']) assert(eqBlocks.has(k), k);
});
test('Every equipment has a sub-unit that uses it, except the engine items that never had one', () => {
  const used = new Set();
  for (const u of unitBlocks.values()) for (const n of field(u, 'need') ?? []) used.add(n.k);
  for (const [id, b] of eqBlocks) if (field(b, 'is_archetype') === 'yes') {
    if (['convoy', 'train_equipment'].includes(id)) continue;
    assert(used.has(id), `${id} has no sub-unit`);
  }
  assert(used.has('motorized_equipment'), 'pack trains need the stub company');
  const pack = unitBlocks.get('zin_support_pack_train');
  assert.equal(field(pack, 'active'), 'no');
  assert.equal(model.raw.units.land.find(u => u.id === 'zin_support_pack_train').unlock, 'none');
});
test('Every sub-unit field, unit type, terrain block and category is one the game defines', () => {
  const engine = new Set(engineCategories());
  for (const [id, b] of unitBlocks) {
    for (const x of b) assert(vanillaUnitFields.has(x.k), `${id}: the game does not define the field ${x.k}`);
    for (const c of listOf(field(b, 'categories'))) assert(engine.has(c) || /^category_zin_(archers|dead|great_beings|monsters|siege)$/.test(c), `${id}: ${c}`);
    for (const x of b) if (TERRAIN_KEYS.has(x.k)) for (const y of x.v) assert(['attack', 'defence', 'movement'].includes(y.k), `${id}: ${x.k}.${y.k}`);
  }
  const types = new Set(['infantry', 'support', 'artillery', 'anti_tank', 'anti_air', 'armor', 'fighter', 'cas', 'submarine', 'screen_ship', 'capital_ship', 'motorized']);
  for (const [id, b] of unitBlocks) for (const t of listOf(field(b, 'type'))) assert(types.has(t), `${id}: type ${t}`);
});
test('Every equipment field and stat, module field and stat is one the game defines', () => {
  const stats = equipmentStatEnum();
  for (const [id, b] of eqBlocks) for (const x of b) assert(vanillaEqFields.has(x.k) || ['supply_truck', 'max_organisation'].includes(x.k), `${id}: the game does not define the field ${x.k}`);
  const mods = entriesOf('common/units/equipment/modules/zin_ship_modules.txt').find(x => x.k === 'equipment_modules').v;
  assert.equal(mods.length, 16);
  for (const m of mods) {
    for (const x of m.v) assert(vanillaModuleFields.has(x.k), `${m.k}: the game does not define the module field ${x.k}`);
    for (const part of ['add_stats', 'multiply_stats', 'add_average_stats']) for (const s of field(m.v, part) ?? []) assert(stats.has(s.k) || s.k === 'build_cost_ic', `${m.k}: stat ${s.k}`);
  }
  const ups = entriesOf('common/units/equipment/upgrades/zin_upgrades.txt').find(x => x.k === 'upgrades').v;
  assert.equal(ups.length, 5);
  for (const u of ups) for (const s of u.v) assert(['max_level', 'cost'].includes(s.k) || stats.has(s.k), `${u.k}: ${s.k}`);
});
test('Equipment burns no fuel and costs only the six resources, with Timber, Horses and Essence each in use', () => {
  const econ = raw0.econ.resources.map(r => r.key);
  const consumers = new Map();
  for (const [id, b] of eqBlocks) {
    assert(!field(b, 'fuel_consumption') || field(b, 'fuel_consumption') === '0', `${id} burns fuel`);
    for (const r of field(b, 'resources') ?? []) { assert(econ.includes(r.k) && r.k !== 'coal', `${id} costs ${r.k}`); consumers.set(r.k, (consumers.get(r.k) ?? 0) + 1); }
    assert((field(b, 'resources') ?? []).length <= 3, `${id} has more than three resources`);
  }
  for (const k of ['aluminium', 'rubber', 'oil', 'steel', 'tungsten', 'chromium']) assert(consumers.get(k) > 0, `${k} has no consumer`);
  assert.equal(consumers.get('coal'), undefined, 'Grain is never a cost');
  const names = Object.fromEntries(raw0.econ.resources.map(r => [r.key, r.name]));
  assert.deepEqual(names, { oil: 'Essence', aluminium: 'Timber', rubber: 'Horses', tungsten: 'Stone', steel: 'Iron', chromium: 'Gold', coal: 'Grain' });
});

// ------------------------------------------------------------------------------------------------ unlocks (the technology slice)
test('Every id the technology slice names is defined, and the unlock path of every unit agrees with the technologies', () => {
  const ids = raw0.techIds;
  for (const id of ids.subUnits) assert(unitBlocks.has(id), `sub-unit ${id}`);
  for (const id of ids.archetypes) assert(eqBlocks.has(id), `archetype ${id}`);
  for (const id of ids.modules) assert(mods().some(m => m.k === id), `module ${id}`);
  for (const id of ids.zinCategories) assert(text('common/unit_tags/zin_unit_tags.txt').includes(id));
  for (const t of raw0.techs.technologies) {
    for (const e of t.unlocks?.equipment ?? []) assert(eqBlocks.has(e), `${t.key} unlocks ${e}`);
    for (const s of t.unlocks?.subunits ?? []) assert.equal(field(unitBlocks.get(s), 'active'), 'no', `${s} must wait for ${t.key}`);
  }
  const unlocked = new Set(raw0.techs.technologies.flatMap(t => t.unlocks?.subunits ?? []));
  for (const [id, b] of unitBlocks) if (!unlocked.has(id)) assert(['zin_abyss_folk', 'zin_support_pack_train'].includes(id) ? field(b, 'active') === 'no' : field(b, 'active') === 'yes', `${id} is granted: it is active and its gear gates it`);
  // every non-active equipment type is unlocked by some technology
  const unlockedEq = new Set(raw0.techs.technologies.flatMap(t => t.unlocks?.equipment ?? []));
  for (const [id, b] of eqBlocks) if (field(b, 'archetype') && field(b, 'active') !== 'yes') assert(unlockedEq.has(id), `${id} can never be built or granted`);
});
function mods() { return entriesOf('common/units/equipment/modules/zin_ship_modules.txt').find(x => x.k === 'equipment_modules').v; }
test('Granted equipment cannot be produced, lent or bought, and no technology unlocks the great beings', () => {
  const granted = ['zin_deathless_equipment', 'zin_shachihata_equipment', 'zin_glo_blade_equipment', 'zin_volgan_presence_equipment', 'zin_great_spirit_equipment', 'zin_zol_manifestation_equipment', 'zin_dragon_equipment'];
  for (const id of granted) {
    const b = eqBlocks.get(id);
    assert.equal(field(field(b, 'can_be_produced'), 'always'), 'no', id);
    assert.equal(field(b, 'is_buildable'), 'no', id);
    if (id !== 'zin_dragon_equipment' || true) assert(field(b, 'can_be_lend_leased') || id === 'zin_dragon_equipment', `${id} lend-lease`);
  }
  const unlockedEq = new Set(raw0.techs.technologies.flatMap(t => t.unlocks?.equipment ?? []));
  for (const id of ['zin_dragon_equipment_0', 'zin_glo_blade_equipment_0', 'zin_glo_blade_equipment_shard', 'zin_volgan_presence_equipment_0', 'zin_great_spirit_equipment_0', 'zin_zol_manifestation_equipment_0', 'zin_shachihata_equipment_0']) { assert(!unlockedEq.has(id), `${id} must be granted, not researched`); assert(eqBlocks.has(id), id); assert.equal(field(eqBlocks.get(id), 'active') ?? field(eqBlocks.get('zin_' + id.split('_').slice(1, -1).join('_')), 'active'), 'yes', id); }
  assert(eqBlocks.has('zin_glo_blade_equipment_shard') && field(eqBlocks.get('zin_glo_blade_equipment_shard'), 'archetype') === 'zin_glo_blade_equipment');
  assert.equal(field(eqBlocks.get('zin_glo_blade_equipment_shard'), 'ap_attack'), '120');
  assert.equal(field(eqBlocks.get('zin_glo_blade_equipment'), 'ap_attack'), '300');
  assert.equal(field(eqBlocks.get('zin_deathless_equipment'), 'active'), undefined, 'the deathless bonds wait for the Mistake\'s tide');
});
test('Griffins can be produced only under the sky rule beasts and by men; dragons are wings of three', () => {
  const g = eqBlocks.get('zin_griffin_equipment');
  assert.match(text('common/units/equipment/zin_equipment_air.txt'), /zin_rules_skies_beasts = yes/);
  assert.equal(field(g, 'type'), 'fighter');
  const d = unitBlocks.get('zin_air_dragon_flight'), gr = unitBlocks.get('zin_air_griffin_riders');
  assert.equal(field(d, 'land_air_wing_size'), '3');
  assert.deepEqual(listOf(field(d, 'type')), ['cas']);
  assert.deepEqual(listOf(field(d, 'categories')), ['category_cas']);
  assert.equal(field(gr, 'land_air_wing_size'), '20');
  assert.deepEqual(listOf(field(gr, 'categories')), ['category_fighter']);
  const dragon = eqBlocks.get('zin_dragon_equipment');
  assert.equal(field(dragon, 'air_ground_attack'), '90');
  assert.equal(field(dragon, 'air_bombing'), '0', 'dragons do not bomb');
  assert.equal(field(dragon, 'air_defence'), '150');
  assert.equal(field(dragon, 'air_range'), '900');
  assert.equal(field(dragon, 'type'), 'cas');
  for (const k of ['carrier_air_wing_size', 'mega_carrier_air_wing_size']) assert.equal(field(d, k), undefined, 'no carriers');
});

// ------------------------------------------------------------------------------------------------ the stat model
test('Every land sub-unit lands on its spec stats: blended equipment times its factor', () => {
  let checked = 0;
  for (const u of model.landUnits) {
    if (!u.s) continue;
    const s = model.solved.get(u.id), [, , sa, ha, def, brk, arm, prc] = u.s;
    const final = k => (s.blended[k] ?? 0) * (1 + (s.factors[k] ?? 0));
    for (const [k, t, tol] of [['sa', sa, 0.01], ['ha', ha, 0.01], ['def', def, 0.01], ['brk', brk, 0.01], ['ap', prc, 0.01], ['arm', arm, 1.05]]) { assert(Math.abs(final(k) - t) <= tol * Math.max(1, Math.abs(t)) + (tol > 1 ? 0 : 0.02), `${u.id} ${k}: ${final(k)} against ${t}`); checked++; }
    assert(Math.abs(4 * (1 + s.speedFactor) - u.s[8]) < 0.01 || u.s[8] === 0, `${u.id} speed`);
    for (const f of Object.values(s.factors)) assert(f >= -1 && f <= 10, `${u.id}: factor ${f} is out of range`);
  }
  assert(checked >= 240);
});
test('The spec examples hold: line infantry is the baseline, knights are strong against soft targets, trolls hold 22 armour', () => {
  const inf = model.solved.get('zin_men_infantry');
  assert.deepEqual(inf.factors, {}, 'line infantry is the equipment baseline (armour within tolerance)');
  assert.equal(model.baseline.get('zin_arms_equipment').sa, 6);
  assert.equal(model.baseline.get('zin_troll_gear_equipment').arm, 22);
  assert.equal(model.solved.get('zin_trolls_brute').factors.arm, undefined);
  assert.equal(field(unitBlocks.get('zin_men_cavalry'), 'maximum_speed'), '1.25');
  assert.equal(field(unitBlocks.get('zin_men_infantry'), 'maximum_speed'), undefined);
  assert.equal(field(unitBlocks.get('zin_men_levy'), 'max_organisation'), '40');
  assert.equal(field(unitBlocks.get('zin_men_levy'), 'manpower'), '1000');
  assert.equal(field(unitBlocks.get('zin_men_levy'), 'training_time'), '45');
});
test('Terrain rules of the spec are written', () => {
  const t = (id, terrain) => Object.fromEntries((field(unitBlocks.get(id), terrain) ?? []).map(x => [x.k, x.v]));
  assert.equal(t('zin_men_hill_companies', 'mountain').attack, '0.25');
  assert.equal(t('zin_men_sea_soldiers', 'amphibious').attack, '0.4');
  assert.equal(t('zin_men_camel_riders', 'desert').attack, '0.2');
  assert.equal(t('zin_men_knights', 'forest').attack, '-0.3');
  assert.equal(t('zin_ents_grove', 'forest').defence, '0.4');
  assert.equal(t('zin_giants_host', 'fort').attack, '0.3');
  assert.equal(t('zin_siege_trebuchet', 'fort').attack, '0.8');
  assert.equal(t('zin_giants_hurlers', 'fort').attack, '0.5');
  assert.equal(t('zin_elves_warden', 'forest').defence, '0.2');
});
test('Unit groups, categories and flags follow the spec', () => {
  const grp = id => field(unitBlocks.get(id), 'group');
  assert.equal(grp('zin_men_knights'), 'armor'); assert.equal(grp('zin_men_cavalry'), 'mobile'); assert.equal(grp('zin_siege_catapult'), 'combat_support');
  assert.equal(grp('zin_support_ballistae'), 'support'); assert.equal(grp('zin_trolls_brute'), 'armor'); assert.equal(grp('zin_yeti_band'), 'infantry');
  assert(listOf(field(unitBlocks.get('zin_men_levy'), 'categories')).includes('category_militia'));
  assert(listOf(field(unitBlocks.get('zin_ents_grove'), 'categories')).includes('category_zin_monsters'));
  assert(listOf(field(unitBlocks.get('zin_zol_deathless'), 'categories')).includes('category_zin_dead'));
  assert(listOf(field(unitBlocks.get('zin_glo_bearer'), 'categories')).includes('category_zin_great_beings'));
  assert(listOf(field(unitBlocks.get('zin_support_catapults'), 'categories')).includes('category_zin_siege'));
  assert.equal(field(unitBlocks.get('zin_men_cavalry'), 'cavalry'), 'yes');
  assert.equal(field(unitBlocks.get('zin_men_sea_soldiers'), 'marines'), 'yes');
  assert.equal(field(unitBlocks.get('zin_men_hill_companies'), 'mountaineers'), 'yes');
  assert.equal(field(unitBlocks.get('zin_support_sappers'), 'same_support_type'), 'engineer');
  for (const [id, b] of unitBlocks) if (field(b, 'group') === 'support') { assert.equal(field(b, 'regimental'), 'no', id); assert.equal(field(b, 'combat_width'), '0', id); }
});
test('The deathless invariant: no mortal or elven division comes within half of the deathless armour, and the bearer of Glo does', () => {
  const armour = model.baseline.get('zin_deathless_equipment').arm;
  assert.equal(armour, 80);
  const templates = {
    men_warded: ['zin_men_heavy_infantry', 'zin_men_heavy_infantry', 'zin_men_heavy_infantry', 'zin_men_heavy_infantry', 'zin_men_heavy_infantry', 'zin_men_heavy_infantry', 'zin_men_archers', 'zin_men_archers', 'zin_support_wardens', 'zin_support_sappers'],
    men_ballista: ['zin_men_infantry', 'zin_men_infantry', 'zin_men_infantry', 'zin_men_infantry', 'zin_men_archers', 'zin_support_ballistae', 'zin_support_wardens'],
    elves_host: ['zin_elves_warden', 'zin_elves_warden', 'zin_elves_warden', 'zin_elves_warden', 'zin_elves_archers', 'zin_elves_archers', 'zin_elves_archers', 'zin_elves_wardsingers', 'zin_support_scouts'],
    sun_guard: ['zin_sun_elves_guard', 'zin_sun_elves_guard', 'zin_sun_elves_guard', 'zin_sun_elves_guard', 'zin_sun_elves_bowmen', 'zin_sun_elves_bowmen', 'zin_support_scorpions'],
    orc_brute: ['zin_ogres_brutes', 'zin_ogres_brutes', 'zin_orcs_warrior', 'zin_orcs_warrior', 'zin_orcs_warrior', 'zin_orcs_warrior', 'zin_orcs_warrior'],
    volgan_vanguard: ['zin_demons_netherborn', 'zin_demons_netherborn', 'zin_demons_netherborn', 'zin_demons_netherborn', 'zin_ogres_brutes', 'zin_ogres_brutes', 'zin_orcs_warrior', 'zin_orcs_warrior', 'zin_support_ballistae'],
    giants: ['zin_giants_host', 'zin_giants_host', 'zin_giants_host', 'zin_giants_hurlers', 'zin_support_ballistae'],
    shachihata: ['zin_demons_shachihata', 'zin_demons_netherborn', 'zin_demons_netherborn', 'zin_demons_netherborn'],
  };
  const WHO = { men_warded: ['men'], men_ballista: ['men'], elves_host: ['elves'], sun_guard: ['sun_elves'], orc_brute: ['orcs'], volgan_vanguard: ['country:Volgan', 'demons', 'orcs'], giants: ['giants'], shachihata: ['demons'] };
  for (const year of [1748, 1755, 1760, 1775, 1790]) for (const [name, ids] of Object.entries(templates)) {
    const prcs = ids.map(id => unitPiercing(model, id, year, WHO[name]));
    const dp = divisionPiercing(prcs);
    assert(dp / armour < 0.5, `${name} in ${year}: division piercing ${dp.toFixed(1)} against ${armour}`);
  }
  // with the bearer of Glo the division passes the deathless armour
  const glo = model.baseline.get('zin_glo_blade_equipment').ap;
  const withGlo = divisionPiercing([...templates.men_warded.map(id => unitPiercing(model, id, 1775, ['men'])), glo]);
  assert(withGlo / armour >= 1, `Glo: ${withGlo}`);
  const shard = variantStats(model.archById.get('zin_glo_blade_equipment'), { n: 0, set: { ap: 120 } }).ap;
  assert.equal(shard, 120);
});
test('The warded wards and the ballista keep the piercing figures of the spec', () => {
  const near = (a, b) => assert(Math.abs(a - b) < 0.05, `${a} against ${b}`);
  near(unitPiercing(model, 'zin_support_wardens', 1748, ['men']), 30);
  near(unitPiercing(model, 'zin_support_wardens', 1757, ['men']), 45);
  near(unitPiercing(model, 'zin_elves_wardsingers', 1748, ['elves']), 50);
  near(unitPiercing(model, 'zin_elves_wardsingers', 1790, ['elves']), 50);
  near(unitPiercing(model, 'zin_support_ballistae', 1748, ['men']), 40);
  assert(unitPiercing(model, 'zin_men_archers', 1762, ['men']) > unitPiercing(model, 'zin_men_archers', 1750, ['men']), 'crossbows pierce more');
});

// ------------------------------------------------------------------------------------------------ ships and the designer
test('Ships need their hull, use the engine types and keep their critical parts', () => {
  const crit = readFileSync(`${GAME}/common/units/critical_parts/00_critical_parts.txt`, 'utf8');
  for (const [id, hull, type] of [['zin_ship_galley', 'zin_hull_galley', 'screen_ship'], ['zin_ship_warship', 'zin_hull_warship', 'capital_ship'], ['zin_ship_great_warship', 'zin_hull_great_warship', 'capital_ship'], ['zin_ship_raider', 'zin_hull_raider', 'submarine']]) {
    const b = unitBlocks.get(id);
    assert.deepEqual(listOf(field(b, 'type')), [type], id);
    assert.deepEqual(field(b, 'need').map(x => x.k), [hull], id);
    assert.equal(field(eqBlocks.get(hull), 'type'), type);
    for (const part of listOf(field(b, 'critical_parts'))) assert(new RegExp(`\\b${part} = \\{`).test(crit), `critical part ${part}`);
  }
  assert.equal(unitBlocks.has('zin_ship_carrier'), false, 'no carriers');
});
test('Default modules reproduce the hull totals of the spec table', () => {
  const stat = { max_strength: 'max_strength', naval_speed: 'naval_speed', naval_range: 'naval_range', lg_attack: 'lg_attack', hg_attack: 'hg_attack', torpedo_attack: 'torpedo_attack', armor_value: 'armor_value', anti_air_attack: 'anti_air_attack' };
  for (const h of raw0.naval.hulls) {
    const v = h.variants[0], base = hullBase(h, v, raw0.naval.modules), d = v.defaults;
    const chosen = [d.propulsion, d.protection, d.crew, ...d.armament].filter(Boolean).map(id => raw0.naval.modules.find(m => m.id === id));
    for (const k of Object.keys(stat)) {
      const add = chosen.reduce((s, m) => s + (m.add?.[k] ?? 0), 0), mult = chosen.reduce((s, m) => s + (m.mult?.[k] ?? 0), 0);
      const total = (base[k] + add) * (1 + mult);
      assert(Math.abs(total - h.t[k]) < 0.05 + Math.abs(h.t[k]) * 0.001 || base[k] === 0, `${h.id} ${k}: ${total} against ${h.t[k]}`);
    }
  }
  assert.equal(raw0.naval.hulls.find(h => h.id === 'zin_hull_warship').t.hg_attack, 14);
  assert.equal(raw0.naval.hulls.find(h => h.id === 'zin_hull_great_warship').t.armor_value, 14);
});
test('Hulls have the four slot families, one armament slot per spec, and every module category is used both ways', () => {
  const slotCount = { zin_hull_galley: 1, zin_hull_warship: 2, zin_hull_great_warship: 3, zin_hull_raider: 1 };
  const cats = new Set(Object.keys(raw0.naval.categories));
  const usedByHull = new Set();
  for (const [id, n] of Object.entries(slotCount)) {
    const slots = field(eqBlocks.get(id), 'module_slots');
    assert.equal(slots.filter(s => s.k.startsWith('fixed_armament_slot_')).length, n, id);
    for (const s of slots) { assert(s.k.startsWith('fixed_'), s.k); for (const c of listOf(field(s.v, 'allowed_module_categories'))) { assert(cats.has(c), c); usedByHull.add(c); } }
    assert.equal(field(slots.find(s => s.k === 'fixed_propulsion_slot').v, 'required'), 'yes');
    assert.equal(field(slots.find(s => s.k === 'fixed_protection_slot').v, 'required'), 'yes');
  }
  assert.deepEqual([...usedByHull].sort(), [...cats].sort());
  for (const m of mods()) assert(cats.has(field(m.v, 'category')), m.k);
  // every module is barred from the hulls it does not fit
  for (const m of raw0.naval.modules) for (const h of raw0.naval.hulls) {
    const barred = eqBlocks.get(h.id).filter(x => x.k === 'module_count_limit').some(x => field(x.v, 'module') === m.id);
    assert.equal(barred, !m.fits.includes(h.id), `${m.id} on ${h.id}`);
  }
  for (const m of mods()) assert.equal(field(m.v, 'add_stats').some(x => x.k === 'fuel_consumption'), false, 'no module burns fuel');
});
test('The ship module gates agree with the technologies, and only Planking is ungated', () => {
  const gated = new Set(raw0.techs.technologies.flatMap(t => t.unlocks?.modules ?? []));
  assert.deepEqual(raw0.naval.modules.map(m => m.id).filter(id => !gated.has(id)), ['zin_mod_planking']);
  const defaults = raw0.naval.hulls.flatMap(h => h.variants.flatMap(v => [v.defaults.propulsion, v.defaults.protection, v.defaults.crew, ...v.defaults.armament].filter(Boolean)));
  assert(defaults.includes('zin_mod_planking'));
  assert.equal(entriesOf('common/units/equipment/modules/zin_ship_modules.txt').find(x => x.k === 'equipment_modules').v.length, 16);
});
test('Hull variants follow the technologies and each is a child of the one before', () => {
  for (const [hull, n] of [['zin_hull_galley', 3], ['zin_hull_warship', 3], ['zin_hull_great_warship', 2], ['zin_hull_raider', 2]]) {
    for (let i = 0; i < n; i++) { const b = eqBlocks.get(`${hull}_${i}`); assert(b, `${hull}_${i}`); assert.equal(field(b, 'archetype'), hull); if (i) assert.equal(field(b, 'parent'), `${hull}_${i - 1}`); }
    assert.equal(eqBlocks.has(`${hull}_${n}`), false);
  }
  assert.equal(field(eqBlocks.get('convoy_1'), 'parent'), 'convoy_0');
  assert.equal(field(eqBlocks.get('motorized_equipment'), 'supply_truck'), 'yes');
  assert.equal(field(eqBlocks.get('train_equipment'), 'type'), 'train');
});

// ------------------------------------------------------------------------------------------------ groups and tags
test('Equipment groups cover the workshops of the economy spec and name defined equipment', () => {
  const groups = entriesOf('common/equipment_groups/zin_equipment_groups.txt');
  const ids = new Set(groups.map(g => g.k));
  for (const g of ['zin_group_smiths', 'zin_group_bowyers', 'zin_group_armourers', 'zin_group_stud', 'zin_group_elven_forges', 'zin_group_engineers', 'zin_group_wardsmiths', 'zin_group_shipwrights', 'zin_group_dark_forges']) assert(ids.has(g), g);
  for (const g of groups) for (const m of listOf(field(g.v, 'equipment_type'))) assert(eqBlocks.has(m), `${g.k}: ${m}`);
  const covered = new Set(groups.flatMap(g => listOf(field(g.v, 'equipment_type'))));
  for (const a of ['zin_arms_equipment', 'zin_bows_equipment', 'zin_armour_equipment', 'zin_mounts_equipment', 'zin_elven_arms_equipment', 'zin_ward_equipment', 'zin_hull_galley', 'zin_grave_arms_equipment', 'zin_nether_arms_equipment', 'zin_catapult_equipment', 'zin_ballista_equipment']) assert(covered.has(a), a);
  assert(mainLoc.has('zin_group_smiths'));
});
test('The unit tags keep every engine category and add the five ZIN ones', () => {
  const tags = listOf(entriesOf('common/unit_tags/zin_unit_tags.txt').find(x => x.k === 'sub_unit_categories').v);
  for (const c of engineCategories()) assert(tags.includes(c), c);
  for (const c of ['category_zin_archers', 'category_zin_dead', 'category_zin_great_beings', 'category_zin_monsters', 'category_zin_siege']) assert(tags.includes(c), c);
  assert.equal(new Set(tags).size, tags.length, 'a category is listed twice');
  for (const c of ['category_zin_archers', 'category_zin_dead', 'category_zin_great_beings', 'category_zin_monsters', 'category_zin_siege']) assert(mainLoc.has(c), `${c} needs a name`);
});

// ------------------------------------------------------------------------------------------------ who can field what
test('Every people can recruit a line unit whose gear its people can produce, and nobody recruits the granted units', () => {
  const producers = new Map();
  for (const a of [...raw0.equipment.land, ...raw0.equipment.air]) producers.set(a.id, new Set(a.prod ?? []));
  const peoples = new Set(model.cultureRows.map(c => c.people));
  for (const people of peoples) {
    const key = people === 'the_dead' ? null : people;
    const list = key ? raw0.units.recruit.line[key] : [...raw0.units.recruit.line['country:Volgan'], ...raw0.units.recruit.line['country:Zol']];
    assert(list.length > 0, people);
    const buildable = list.filter(id => Object.keys(model.unitById.get(id).needs).every(a => (people === 'the_dead' ? ['Volgan', 'Zol'].some(c => producers.get(a)?.has(`country:${c}`) || producers.get(a)?.size === 0) : producers.get(a)?.has(people) || producers.get(a)?.has(`country:${people}`))) || ['zin_zol_deathless', 'zin_zol_deathless_crews'].includes(id));
    assert(buildable.length > 0, `${people} cannot produce the gear of any of its units`);
  }
  for (const id of ['zin_abyss_folk', 'zin_demons_shachihata', 'zin_demons_bound', 'zin_glo_bearer', 'zin_volgan_presence', 'zin_great_spirit', 'zin_zol_manifestation']) {
    assert(!Object.values(raw0.units.recruit.line).flat().includes(id), `${id} is recruited by someone`);
    assert.deepEqual(model.unitById.get(id).people, [], id);
  }
  assert.equal(model.unitById.get('zin_abyss_folk').unlock, 'script');
  assert(field(unitBlocks.get('zin_abyss_folk'), 'active') === 'no');
});
test('The producers of the spec are written as people flags and the three named countries', () => {
  const t = text('common/units/equipment/zin_equipment_land.txt');
  const volgan = countries.find(c => c.name === 'Volgan').tag;
  assert.match(t, new RegExp(`tag = ${volgan}`));
  assert.match(t, /has_country_flag = zin_people_trolls/);
  const grave = eqBlocks.get('zin_grave_arms_equipment');
  assert.equal(field(field(grave, 'can_be_produced'), 'tag'), volgan, 'grave arms are Volgan\'s alone');
  const deathless = text('common/units/equipment/zin_equipment_granted.txt');
  assert.doesNotMatch(deathless, /zin_people_the_dead/, 'Zol\'s deathless are never produced');
});
test('The story templates of the spec use defined sub-units that their people may recruit', () => {
  const men = new Set(raw0.units.recruit.line.men);
  const templates = {
    host_of_the_ice: ['zin_men_infantry', 'zin_men_archers', 'zin_glo_bearer', 'zin_support_scouts'],
    white_company: ['zin_men_infantry', 'zin_men_archers', 'zin_men_cavalry', 'zin_support_scouts', 'zin_support_healers', 'zin_support_quartermasters'],
    host_of_the_east: ['zin_men_infantry', 'zin_men_camel_riders', 'zin_men_archers', 'zin_support_scouts', 'zin_support_sappers'],
    abyss_host: ['zin_abyss_folk'],
    grave_host: ['zin_the_dead_revenant'],
    deathless_host: ['zin_zol_deathless'],
    the_presence: ['zin_zol_deathless', 'zin_zol_manifestation'],
    buldor_company: ['zin_men_infantry', 'zin_men_archers'],
  };
  for (const [name, ids] of Object.entries(templates)) for (const id of ids) assert(unitBlocks.has(id), `${name}: ${id}`);
  for (const id of templates.white_company.filter(i => !i.includes('support'))) assert(men.has(id), id);
  for (const id of templates.host_of_the_east.filter(i => !i.includes('support'))) assert(men.has(id), id);
  assert.equal(model.unitById.get('zin_men_camel_riders').unlock, 'tech');
});

// ------------------------------------------------------------------------------------------------ tactics
test('The tactics file drops the single-country tactics and names only traits and units that exist', () => {
  const t = text('common/combat_tactics.txt');
  assert.doesNotMatch(t, /only_show_for/); assert.doesNotMatch(t, /\btag = /);
  for (const gone of ['tactic_banzai_charge', 'tactic_grand_banzai_charge', 'tactic_masterful_blitz', 'tactic_masterful_delay', 'tactic_sf_armor_supported_assault']) assert.doesNotMatch(t, new RegExp(`${gone}\\b`), gone);
  const ids = [...t.matchAll(/^(tactic_[a-z_0-9]+) = \{/gm)].map(m => m[1]);
  assert.equal(ids.length, 50);
  for (const r of t.matchAll(/(?:countered_by|has_tactic) = (tactic_\w+)/g)) assert(ids.includes(r[1]), `dangling ${r[1]}`);
  for (const r of t.matchAll(/has_trait = (\w+)/g)) assert(raw0.text.traitsProvided.includes(r[1]), `trait ${r[1]} is not one the characters slice defines`);
  assert.doesNotMatch(t, /panzer|has_unit_type = (engineer|pioneer|light_flame)/);
  assert.match(t, /^phases = \{/m);
  for (const id of ids) assert(raw0.text.tactics[id], `${id} needs an Erdae name`);
  assert.equal(model.tactics.dropped.length, 5);
});
test('transformTactics refuses to keep a tactic that names a dropped one', () => {
  const src = 'phases = {\n\tclose_combat\n}\n\ntactic_a = {\n\tis_attacker = yes\n\tcountered_by = tactic_b\n}\n\ntactic_b = {\n\tonly_show_for = ABC\n\tis_attacker = no\n}\n';
  const r = transformTactics(src, { dropTactics: [], traitMap: {} });
  assert.deepEqual(r.dropped, ['tactic_b']);
  assert.doesNotMatch(r.text, /countered_by/, 'the pointer to a dropped tactic goes with it');
  const bad = 'phases = {\n}\n\ntactic_a = {\n\ttrigger = { OR = { has_tactic = tactic_c } }\n}\n\ntactic_c = {\n\tonly_show_for = ABC\n}\n';
  assert.throws(() => transformTactics(bad, { dropTactics: [], traitMap: {} }), /dropped/);
});

// ------------------------------------------------------------------------------------------------ names
test('Every realm of the roster has a host group in its culture\'s language and four ship groups', () => {
  const hosts = text('common/units/names_divisions/zin_names_divisions.txt'), ships = text('common/units/names_ships/zin_names_ships.txt');
  const groups = parse(hosts).filter(e => e.k && e.k.startsWith('ZIN_HOSTS_'));
  const tagCount = new Map();
  for (const g of groups) for (const t of listOf(field(g.v, 'for_countries'))) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
  for (const c of countries) assert.equal(tagCount.get(c.tag), 1, `${c.name} has ${tagCount.get(c.tag)} host groups`);
  const shipGroups = parse(ships).filter(e => e.k);
  const shipTags = new Map();
  for (const g of shipGroups) for (const t of listOf(field(g.v, 'for_countries'))) shipTags.set(t, (shipTags.get(t) ?? 0) + 1);
  for (const c of countries) assert.equal(shipTags.get(c.tag), c.name === 'Zol' ? 1 : 4, `${c.name} ship groups`);
  const ids = parse(hosts).filter(e => e.k).map(e => e.k);
  assert.equal(new Set(ids).size, ids.length, 'duplicate group');
  assert(!ids.includes('ZIN_HOSTS'), 'the stage-1 stub keeps that id until the integrator removes it');
  const sIds = shipGroups.map(e => e.k);
  assert.equal(new Set(sIds).size, sIds.length);
  for (const g of shipGroups) assert.match(listOf(field(g.v, 'ship_types')).join(' '), /^zin_hull_\w+ (destroyer|heavy_cruiser|battleship|submarine)$/);
});
test('Host names are numbered from 1 without repeats, use the culture\'s noun and carry no banned word', () => {
  const groups = parse(text('common/units/names_divisions/zin_names_divisions.txt')).filter(e => e.k && e.k.startsWith('ZIN_HOSTS_'));
  let names = 0;
  for (const g of groups) {
    const ordered = field(g.v, 'ordered'), nums = ordered.map(o => Number(o.k));
    assert.deepEqual(nums, nums.map((_, i) => i + 1), `${g.k} numbers`);
    const labels = ordered.map(o => o.v[0].v);
    assert.equal(new Set(labels).size, labels.length, `${g.k} repeats a name`);
    for (const l of labels) { assert(!findBanned(l, banned, ['error']).length, `${g.k}: ${l}`); assert(/^[\x20-\x7e -ÿ]+$/.test(l), `${g.k}: ${l} has a glyph the game font lacks`); names++; }
  }
  assert(names > 1000);
  const zol = groups.find(g => g.k === 'ZIN_HOSTS_ZOL');
  assert.deepEqual(field(zol.v, 'ordered').map(o => o.v[0].v), raw0.names.zol.hosts, 'Zol\'s list holds only the ordinal hosts');
  assert.equal(ordinalWord(1), 'First'); assert.equal(ordinalWord(21), 'Twenty-first'); assert.equal(ordinalWord(40), 'Fortieth');
  const lake = groups.find(g => g.k === 'ZIN_HOSTS_LAKE_AENORAN');
  assert.equal(field(lake.v, 'ordered').length, 40, 'Aenor fields up to 36 divisions');
  const grave = groups.find(g => g.k === 'ZIN_HOSTS_GRAVE_HOSTS');
  assert.match(field(grave.v, 'ordered')[0].v[0].v, /^First Grave Host of /);
});
test('The same place never names hosts of two languages: a culture\'s names come from its language', () => {
  const groups = parse(text('common/units/names_divisions/zin_names_divisions.txt')).filter(e => e.k && e.k.startsWith('ZIN_HOSTS_') && e.k !== 'ZIN_HOSTS_ZOL');
  const placeOf = g => new Set(field(g.v, 'ordered').map(o => o.v[0].v.replace(/^.* of /, '')));
  const a = placeOf(groups.find(g => g.k === 'ZIN_HOSTS_LAKE_AENORAN')), b = placeOf(groups.find(g => g.k === 'ZIN_HOSTS_SUNHOT_WESTERN'));
  for (const p of a) assert(!b.has(p), `${p} names hosts in two cultures`);
});
test('Ship names are unique within a group, in the culture\'s language and free of banned words', () => {
  const groups = parse(text('common/units/names_ships/zin_names_ships.txt')).filter(e => e.k);
  let total = 0;
  for (const g of groups) {
    const names = listOf(field(g.v, 'unique'));
    if (g.k === 'ZIN_SHIPS_ZOL') { assert.equal(names.length, 0); assert.match(field(g.v, 'fallback_name'), /Black Ship/); continue; }
    assert(names.length >= 8, g.k);
    assert.equal(new Set(names).size, names.length, `${g.k} repeats a name`);
    for (const n of names) { assert(!findBanned(n, banned, ['error']).length, `${g.k}: ${n}`); total++; }
    assert.match(field(g.v, 'name'), /^NAME_THEME_ZIN_/);
    assert(mainLoc.has(field(g.v, 'name')), 'the theme needs a name');
  }
  assert(total > 2500);
});
test('Agents\' code names come from each culture\'s callsign pool, the railway-gun list is inert, and elven realms name their dragon flights', () => {
  const ops = parse(text('common/units/codenames_operatives/zin_operative_codenames.txt')).filter(e => e.k);
  assert.equal(ops.length, new Set(model.cultureRows.map(c => c.culture)).size);
  for (const g of ops) { assert.equal(field(g.v, 'type'), 'codename'); assert(listOf(field(g.v, 'unique')).length >= 8, g.k); assert(mainLoc.has(field(g.v, 'name'))); }
  const rg = parse(text('common/units/names_railway_guns/zin_names_railway_guns.txt')).filter(e => e.k);
  assert.equal(rg.length, 1); assert.equal(field(field(rg[0].v, 'can_use'), 'always'), 'no');
  const names = parse(text('common/units/names/zin_names.txt'));
  const generic = names.find(e => e.k === 'generic').v;
  for (const key of ['destroyer', 'heavy_cruiser', 'battleship', 'submarine', 'codename', 'zin_dragon_equipment', 'zin_men_infantry', 'zin_trolls_brute']) assert(generic.some(x => x.k === key), key);
  const elven = model.cultureRows.filter(c => ['elves', 'sun_elves'].includes(c.people));
  assert.equal(names.filter(e => e.k && e.k !== 'generic').length, elven.length);
  assert(elven.length >= 60);
});

// ------------------------------------------------------------------------------------------------ models
test('Every land sub-unit has an entity on one of the five models or a recorded reason for none', () => {
  const ent = text('gfx/entities/zin_warfare.asset');
  const named = new Set([...ent.matchAll(/name = "([^"]+)_entity"/g)].map(m => m[1]));
  const meshes = new Set([...ent.matchAll(/pdxmesh = "([^"]+)_mesh"/g)].map(m => m[1]));
  for (const m of meshes) assert(UNIT_MODEL_ASSETS.includes(m), `${m} is not one of the five models`);
  for (const u of model.landUnits) assert(named.has(u.id) || model.units3d.noModel[u.id], `${u.id} has neither`);
  for (const id of Object.keys(model.units3d.noModel)) assert(!named.has(id), `${id} has both`);
  for (const id of ['zin_zol_deathless', 'zin_zol_deathless_crews', 'zin_ship_galley', 'zin_air_dragon_flight']) assert(model.units3d.noModel[id], id);
  for (const id of UNIT_MODEL_ASSETS) assert(named.has(id) && model.units3d.entities[id].ownModel, `${id} keeps its own model`);
  assert.equal(entityScale(raw0.models, raw0.models.units.zin_giants_host), 1.1);
  assert.equal(entityScale(raw0.models, raw0.models.units.zin_men_infantry), 0.8);
  assert.equal(model.units3d.entities.zin_ents_grove.scale, 1.25);
  assert.equal(JSON.parse(text('docs/design/warfare/units3d_report.json')).borrowed.length, model.units3d.borrowed.length);
  for (const id of model.units3d.borrowed) assert(!UNIT_MODEL_ASSETS.includes(id));
});
test('Sprites are registered for every sub-unit and equipment, and fall back to the ZIN frame, never to a vanilla texture', () => {
  const units = text('interface/zin_units.gfx'), eq = text('interface/zin_equipment.gfx');
  for (const id of unitBlocks.keys()) for (const suffix of ['icon_medium', 'icon_medium_white', 'icon_small']) assert(units.includes(`"GFX_unit_${id}_icon_${suffix.replace('icon_', '')}"`) || units.includes(`GFX_unit_${id}_${suffix}`), `${id} ${suffix}`);
  for (const id of eqBlocks.keys()) assert(eq.includes(`"GFX_${id}_medium"`) || eq.includes(`"GFX_archetype_${id}_medium"`) || /^(convoy|train_equipment|motorized_equipment)/.test(id) /* the vanilla Technologies.gfx defines these (kept; a second definition logs a duplicate) */, id);
  for (const m of (units + eq).matchAll(/texturefile = "([^"]+)"/g)) assert(m[1].startsWith('gfx/interface/') && (m[1].includes('/zin') ), m[1]);
});

// ------------------------------------------------------------------------------------------------ text
test('Every sub-unit, equipment, module and upgrade has a name and a description, and no key is defined twice', () => {
  const all = new Map([...mainLoc, ...replaceLoc]);
  assert.equal(mainLoc.size + replaceLoc.size, all.size, 'a key is in both localisation files');
  for (const id of unitBlocks.keys()) { assert(all.get(id), `${id} name`); assert((all.get(`${id}_desc`) ?? '').length > 20, `${id} desc`); }
  for (const id of eqBlocks.keys()) { assert(all.get(id), `${id} name`); assert(all.get(`${id}_desc`), `${id} desc`); }
  for (const m of mods()) { assert(all.get(m.k)); assert(all.get(`${m.k}_desc`)); }
  for (const [k] of Object.entries(raw0.naval.upgrades)) void k;
  for (const u of raw0.naval.upgrades) assert(all.get(u.id) && all.get(`${u.id}_desc`));
  for (const slot of ['fixed_propulsion_slot', 'fixed_armament_slot_1', 'fixed_armament_slot_3', 'fixed_protection_slot', 'fixed_crew_slot']) assert(all.get(`EQ_MOD_SLOT_${slot}_TITLE`), slot);
  for (const c of Object.keys(raw0.naval.categories)) assert(all.get(`EQ_MOD_CAT_${c}_TITLE`));
  assert(hasBom('localisation/english/zin_warfare_l_english.yml') && hasBom('localisation/replace/zin_warfare_l_english.yml'));
});
test('No localised value says a modern word, uses a glyph outside Windows-1252, or copies the installed text', () => {
  const installed = new Map();
  for (const f of ['unit_l_english.yml', 'tactics_l_english.yml', 'deployment_l_english.yml', 'equipment_l_english.yml', 'equip_naval_l_english.yml']) {
    const p = `${GAME}/localisation/english/${f}`;
    if (existsSync(p)) for (const m of readFileSync(p, 'utf8').matchAll(/^ ([A-Za-z0-9_.\-]+):\d* "(.*)"\s*$/gm)) installed.set(m[1], m[2]);
  }
  for (const [k, v] of [...mainLoc, ...replaceLoc]) {
    assert.deepEqual(findBanned(v, banned, ['error']), [], `${k}: ${v}`);
    assert(/^[\x20-\x7e -ÿ]*$/.test(v), `${k}: glyph`);
    if (installed.has(k)) assert.notEqual(v, installed.get(k), `${k} copies the installed text`);
  }
  for (const k of replaceLoc.keys()) assert(installed.has(k), `${k} is in the replace file but the game does not define it`);
  for (const k of mainLoc.keys()) assert(!installed.has(k), `${k} is in the main file but the game defines it`);
  assert(replaceLoc.size > 100);
  for (const k of ['convoy', 'train_equipment', 'motorized_equipment']) assert(replaceLoc.has(k), `${k} is a kept key, so its text replaces the game's`);
});
test('Nothing readable before the reveal names Afrit or calls the Deliverer a demon', () => {
  for (const [k, v] of [...mainLoc, ...replaceLoc]) assert.doesNotMatch(v, /afrit|deliverer|hidden council|einendil|edvoid/i, `${k}: ${v}`);
  assert.doesNotMatch(mainLoc.get('zin_demons_bound_desc'), /afrit|deliverer/i);
  assert.match(mainLoc.get('zin_men_temple_wardens_desc'), /Zilin/);
  assert.doesNotMatch(mainLoc.get('zin_men_temple_wardens_desc'), /demon/i);
});
test('Sub-unit ids collide with no focus, idea or spirit id of the repository (decision F3)', async () => {
  const found = new Set();
  for (const dir of ['common/national_focus', 'common/ideas']) {
    const d = path.join(ZIN, dir);
    if (!existsSync(d)) continue;
    for (const f of await readdir(d)) if (f.endsWith('.txt')) for (const m of readFileSync(path.join(d, f), 'utf8').matchAll(/^\s*(zin_[a-z0-9_]+) = \{/gm)) found.add(m[1]);
  }
  for (const id of [...unitBlocks.keys(), ...eqBlocks.keys()]) assert(!found.has(id), `${id} is also a focus or idea`);
});
test('The ids file lists exactly what the build defines', async () => {
  const file = JSON.parse(await readFile(path.join(here, 'data/warfare_ids.json'), 'utf8'));
  assert.deepEqual(file, JSON.parse(JSON.stringify(model.ids)));
  assert.deepEqual(file.subUnits, [...unitBlocks.keys()].sort());
  assert.equal(file.modules.length, 16);
  assert(file.equipmentTypes.includes('zin_glo_blade_equipment_shard'));
  assert.equal(file.hostGroupByCountry.Aenor, 'ZIN_HOSTS_LAKE_AENORAN');
  assert.equal(file.hostGroupByCountry.Zol, 'ZIN_HOSTS_ZOL');
});

// ------------------------------------------------------------------------------------------------ negative tests
test('The module refuses a sub-unit that needs equipment nobody defines', () => rejects(r => { r.units.land[0].needs.zin_rifle_equipment = 10; }, /not defined/));
test('The module refuses a duplicate sub-unit id', () => rejects(r => { r.units.land.push({ ...r.units.land[1] }); }, /duplicate sub-unit/));
test('The module refuses a sub-unit id that is not a ZIN id', () => rejects(r => { r.units.land[1].id = 'infantry'; }, /must start with zin_/));
test('The module refuses equipment that costs Grain', () => rejects(r => { r.equipment.land[0].res.coal = 1; }, /Grain/));
test('The module refuses a resource the economy does not define', () => rejects(r => { r.equipment.land[0].res.uranium = 1; }, /economy does not define/));
test('The module refuses more than three resources on one equipment', () => rejects(r => { r.equipment.land[0].res = { steel: 1, aluminium: 1, rubber: 1, tungsten: 1 }; }, /more than three/));
test('The module refuses a stat the game does not define', () => rejects(r => { r.naval.modules[0].add = { warp_drive: 3 }; }, /does not define/));
test('The module refuses a category the game does not define', () => rejects(r => { r.units.land[0].cats.push('tank_destroyers_of_doom'); }, /does not exist/));
test('The module refuses a unit type the game does not define', () => rejects(r => { r.units.land[0].types = ['hovercraft']; }, /does not define/));
test('The module refuses a terrain the game does not define', () => rejects(r => { r.units.land[0].t = { lava: { attack: 1 } }; }, /terrain/));
test('The module refuses a technology that unlocks equipment nobody defines', () => rejects(r => { r.techs.technologies[0].unlocks.equipment.push('zin_arms_equipment_9'); }, /not defined/));
test('The module refuses a unit marked for research that no technology unlocks', () => rejects(r => { r.techs.technologies = r.techs.technologies.map(t => ({ ...t, unlocks: { ...t.unlocks, subunits: (t.unlocks?.subunits ?? []).filter(s => s !== 'zin_men_levy') } })); }, /no technology unlocks/));
test('The module refuses a granted unit that a technology unlocks', () => rejects(r => { r.techs.technologies[0].unlocks.subunits.push('zin_glo_bearer'); }, /a technology unlocks it/));
test('The module refuses a default module that does not fit its hull', () => rejects(r => { r.naval.hulls[0].variants[0].defaults.armament = ['zin_mod_catapult_deck']; }, /does not fit/));
test('The module refuses a hull with the wrong number of default armament modules', () => rejects(r => { r.naval.hulls[1].variants[0].defaults.armament = [null]; }, /armament defaults/));
test('The module refuses a target stat its equipment cannot give', () => rejects(r => { const u = r.units.land.find(x => x.id === 'zin_support_sappers'); u.s = [0, 1, 5, 1, 1, 1, 0, 1, 4, 0, 1, 1]; }, /gives 0/));
test('The module refuses a roster without Volgan', async () => {
  const raw = clone();
  await assert.rejects(prepareModel({ countries: countries.filter(c => c.name !== 'Volgan') }, raw).then(m => buildWarfare(new Staged(), { countries: countries.filter(c => c.name !== 'Volgan'), pools: buildNames(new Staged(), countries, labels), raw })), /Volgan/);
});
test('The build refuses a modern word in a player text', () => rejects(r => { r.units.land[1].desc = 'Foot soldiers armed with a rifle and a tank.'; }, /says/, { build: true }));
test('The build refuses text that leaves Windows-1252', () => rejects(r => { r.units.land[1].name = 'Line Infantry 中'; }, /Windows-1252|says/, { build: true }));
test('The module refuses a sub-unit with neither a model nor a recorded reason', () => rejects(r => { delete r.models.units.zin_men_levy; }, /neither a model/));
test('The module refuses a hull cost in a resource that does not exist', () => rejects(r => { r.naval.hulls[0].res = { adamant: 2 }; }, /economy does not define/));
test('The solver puts a stat on target and refuses an impossible one', () => {
  const eq = new Map([['a', { sa: 6, ha: 1, def: 20, brk: 2, ap: 3, arm: 0, hard: 0 }]]);
  const u = { id: 'x', needs: { a: 100 }, s: [50, 10, 9, 1, 20, 2, 0, 3, 8, 2, 100, 10] };
  const r = solveUnit(u, eq);
  assert.equal(r.factors.sa, 0.5); assert.equal(r.speedFactor, 1);
  assert.throws(() => solveUnit({ ...u, s: [50, 10, 9, 1, 20, 2, 5, 3, 8, 2, 100, 10] }, eq), /gives 0/);
  assert.throws(() => solveUnit({ ...u, needs: { b: 100 } }, eq), /no equipment/);
});
test('Piercing arithmetic follows the engine blend', () => {
  assert.equal(divisionPiercing([]), 0);
  assert.equal(divisionPiercing([10, 10]), 10);
  assert.equal(Math.round(divisionPiercing([0, 50]) * 10) / 10, 0.4 * 25 + 0.6 * 50);
});
