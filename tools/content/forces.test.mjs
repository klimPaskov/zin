// Tests for the forces module (docs/design/stage2/forces.md): the starting orders of battle, the AI templates, ship designs, fleets,
// strategies and plans, and the designer pieces. They use only builder output: the warfare module is built first (the forces module
// reads its name lists), then forces, on a Staged set made from the roster of data/countries.json. Negative tests plant a bad row
// in a copy of the data and expect the module to refuse it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { parse, scriptText } from './lib/clausewitz.mjs';
import { GAME, ZIN } from './lib/paths.mjs';
import { compileBanned, findBanned } from './lib/banned.mjs';
import { buildNames } from './modules/names.mjs';
import { buildWarfare } from './modules/warfare.mjs';
import { loadCountryTable } from './modules/countries.mjs';
import { buildForces, loadRaw, prepareModel, layoutRegiments, apportion, divisionCount, planCountry, FILES } from './modules/forces.mjs';
import { readStates } from './write_forces_geography.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
const { labels } = JSON.parse(await readFile(path.join(here, 'data/labels.json'), 'utf8'));
const banned = compileBanned(JSON.parse(await readFile(path.join(here, 'data/banned_words.json'), 'utf8')));
const raw0 = await loadRaw();
const clone = () => structuredClone(raw0);
const table = await loadCountryTable(countries, `${ZIN}/docs/design/countries.csv`);
const assignment = new Map([...table].map(([t, v]) => [t, v.people]));
const byName = new Map(countries.map(c => [c.name, c]));
const tag = n => byName.get(n).tag;

// One warfare build, one forces build; a second forces build on a copy of the warfare files checks determinism.
const warfareStaged = new Staged();
await buildWarfare(warfareStaged, { countries, pools: buildNames(new Staged(), countries, labels) });
const copyOf = s => { const c = new Staged(); for (const [k, v] of s.files) c.add(k, v); return c; };
const snapshot = copyOf(warfareStaged);
const staged = warfareStaged;
const ctx = { countries, assignment, table };
const summary = await buildForces(staged, ctx);
const model = ctx.model;
const text = rel => { const b = staged.files.get(rel); assert(b, `staged file ${rel}`); return b.toString('utf8'); };
const braces = s => { let d = 0, inStr = false; for (const ch of s.replace(/#[^\n]*/g, '')) { if (ch === '"') inStr = !inStr; else if (!inStr) { if (ch === '{') d++; else if (ch === '}') d--; if (d < 0) return -1; } } return d; };
const field = (entries, key) => entries.find(x => x.k === key)?.v;
const all = (entries, key) => entries.filter(x => x.k === key);
const oobFile = t => `history/units/${t}_world.txt`;
const oob = new Map();
for (const c of countries) oob.set(c.tag, parse(text(oobFile(c.tag))));
const ids = raw0.ids, landIds = new Set(ids.landSubUnits), shipIds = new Set(['zin_ship_galley', 'zin_ship_warship', 'zin_ship_great_warship', 'zin_ship_raider']);
const groupOfUnit = new Map(raw0.units.land.map(u => [u.id, u.grp]));
const geo = raw0.geography.countries;
const stateOwner = new Map(), provinceOwner = new Map();
for (const [t, states] of Object.entries(geo)) for (const s of states) { stateOwner.set(s.id, t); provinceOwner.set(s.province, t); }
const portsOf = t => new Set(geo[t].filter(s => s.port).map(s => s.port));
const parseOob = t => {
  const e = oob.get(t), templates = new Map();
  for (const d of all(e, 'division_template')) templates.set(field(d.v, 'name'), d.v);
  const units = field(e, 'units') ?? [];
  const divisions = all(units, 'division').map(d => ({ template: field(d.v, 'division_template'), location: Number(field(d.v, 'location')), xp: Number(field(d.v, 'start_experience_factor')), equip: Number(field(d.v, 'start_equipment_factor')), name: field(d.v, 'name'), ordered: field(d.v, 'division_name') }));
  const ships = [];
  for (const f of all(units, 'fleet')) for (const tf of all(f.v, 'task_force')) for (const sh of all(tf.v, 'ship')) { const eq = field(sh.v, 'equipment'); ships.push({ name: field(sh.v, 'name'), definition: field(sh.v, 'definition'), hull: eq[0].k, owner: field(eq[0].v, 'owner'), location: Number(field(tf.v, 'location')), base: Number(field(f.v, 'naval_base')), fleet: field(f.v, 'name'), taskForce: field(tf.v, 'name') }); }
  const effects = field(e, 'instant_effect') ?? [];
  const stock = all(effects, 'add_equipment_to_stockpile').map(x => ({ type: field(x.v, 'type'), amount: Number(field(x.v, 'amount')), producer: field(x.v, 'producer') }));
  const production = all(effects, 'add_equipment_production').map(x => ({ type: field(field(x.v, 'equipment'), 'type'), creator: field(field(x.v, 'equipment'), 'creator'), factories: Number(field(x.v, 'requested_factories')), efficiency: Number(field(x.v, 'efficiency')) }));
  return { templates, divisions, ships, stock, production, hasAirWings: field(e, 'air_wings') !== undefined };
};
const parsed = new Map(countries.map(c => [c.tag, parseOob(c.tag)]));
const reserveName = new Set(Object.values(raw0.templates.templates).filter(t => t.reserve).map(t => t.name));
const regimentsOf = tm => (field(tm, 'regiments') ?? []).map(r => ({ sub: r.k, x: Number(field(r.v, 'x')), y: Number(field(r.v, 'y')) }));
const supportOf = tm => (field(tm, 'support') ?? []).map(r => ({ sub: r.k, x: Number(field(r.v, 'x')), y: Number(field(r.v, 'y')) }));
const rejects = async (mutate, pattern) => { const raw = clone(); mutate(raw); await assert.rejects(prepareModel({ countries, assignment, table }, raw), pattern); };

// ------------------------------------------------------------------------------------------------ files and counts
test('The build stages every file of the integration note and counts what it generates', () => {
  assert.equal(summary.countries, 305);
  for (const f of Object.values(FILES)) assert(staged.files.has(f), `staged ${f}`);
  assert.equal([...staged.files.keys()].filter(k => /^history\/units\/Y[0-9A-Z]{2}_world\.txt$/.test(k)).length, 305, 'one order of battle per roster tag');
  const total = [...parsed.values()].reduce((a, p) => a + p.divisions.length, 0);
  assert.equal(summary.divisions, total, 'the summary counts the divisions of the files');
  assert.equal(summary.ships, [...parsed.values()].reduce((a, p) => a + p.ships.length, 0));
  assert(summary.divisions > 500 && summary.divisions < 2000, `${summary.divisions} divisions in the world`);
  assert.equal(summary.taskforces, 6); assert.equal(summary.fleets, 5); assert.equal(summary.goals, 8); assert.equal(summary.designGroups, 4);
});
test('Two builds give identical bytes', async () => {
  const again = copyOf(snapshot);
  await buildForces(again, { countries, assignment, table });
  for (const f of [...Object.values(FILES), ...countries.map(c => oobFile(c.tag))]) assert(again.files.get(f).equals(staged.files.get(f)), `${f} differs between two builds`);
});
test('Every staged script file has balanced braces and a header', () => {
  for (const f of [...Object.values(FILES).filter(f => !f.endsWith('.json')), ...countries.map(c => oobFile(c.tag))]) {
    const t = text(f);
    assert.equal(braces(t), 0, `${f} is balanced`);
    assert(t.startsWith('# Generated by the ZIN content builder'), `${f} has the generated header`);
    assert(!/[^\x09\x0a\x0d\x20-\x7e]/.test(t), `${f} is plain ASCII`);
  }
});

// ------------------------------------------------------------------------------------------------ orders of battle
test('Templates stand in valid columns of one group, supports in the one support column', () => {
  let checked = 0;
  for (const c of countries) for (const [name, tm] of parsed.get(c.tag).templates) {
    const regs = regimentsOf(tm), sup = supportOf(tm), seen = new Set(), cols = new Map();
    assert(regs.length >= 1 && regs.length <= 25, `${c.name} ${name}: ${regs.length} battalions`);
    for (const r of regs) {
      assert(r.x >= 0 && r.x <= 4 && r.y >= 0 && r.y <= 4, `${c.name} ${name}: ${r.sub} at ${r.x},${r.y}`);
      assert(!seen.has(`${r.x},${r.y}`), `${c.name} ${name}: two battalions at ${r.x},${r.y}`); seen.add(`${r.x},${r.y}`);
      assert(landIds.has(r.sub), `${r.sub} is a warfare land sub-unit`);
      assert.notEqual(groupOfUnit.get(r.sub), 'support', `${r.sub} is not a support company`);
      const g = cols.get(r.x); if (g) assert.equal(g, groupOfUnit.get(r.sub), `${c.name} ${name}: column ${r.x} mixes groups`); else cols.set(r.x, groupOfUnit.get(r.sub));
    }
    assert(sup.length <= 5);
    sup.forEach((s, i) => { assert.equal(s.x, 0); assert.equal(s.y, i); assert.equal(groupOfUnit.get(s.sub), 'support', `${s.sub} is a support company`); });
    checked++;
  }
  assert(checked > 400, `${checked} templates checked`);
});
test('Template names are unique inside a country and every division names a template of its file', () => {
  for (const c of countries) {
    const p = parsed.get(c.tag), names = all(oob.get(c.tag), 'division_template').map(d => field(d.v, 'name'));
    assert.equal(new Set(names).size, names.length, `${c.name}: duplicate template names`);
    for (const d of p.divisions) assert(p.templates.has(d.template), `${c.name}: division of unknown template ${d.template}`);
    assert.equal(names.length, new Set(p.divisions.map(d => d.template)).size, `${c.name}: a template with no division`);
  }
});
test('Every sub-unit of every template is one the country has unlocked by its start technologies', () => {
  for (const c of countries) {
    const un = model.unlockedOf.get(c.tag);
    for (const [name, tm] of parsed.get(c.tag).templates) for (const r of [...regimentsOf(tm), ...supportOf(tm)]) assert(un.subs.has(r.sub), `${c.name} ${name}: ${r.sub} is not unlocked`);
  }
});
test('No order of battle names a granted unit, the Abyss-folk, an air wing or granted equipment', () => {
  const granted = new Set(ids.grantedEquipment);
  for (const c of countries) {
    const p = parsed.get(c.tag);
    assert.equal(p.hasAirWings, false, `${c.name} has an air wing`);
    for (const [, tm] of p.templates) for (const r of [...regimentsOf(tm), ...supportOf(tm)]) assert(!['zin_abyss_folk', 'zin_demons_shachihata', 'zin_demons_bound', 'zin_glo_bearer', 'zin_great_spirit', 'zin_volgan_presence', 'zin_zol_manifestation', 'zin_air_dragon_flight', 'zin_air_griffin_riders'].includes(r.sub), `${c.name}: ${r.sub}`);
    for (const s of [...p.stock, ...p.production.map(x => ({ type: x.type }))]) assert(!(s.type && [...granted].some(g => s.type.startsWith(g))), `${c.name} stocks ${s.type}`);
  }
});
test('Every division and ship stands inside its owner, and ships in its ports', () => {
  for (const c of countries) {
    const p = parsed.get(c.tag), ports = portsOf(c.tag), own = new Set(geo[c.tag].map(s => s.province));
    for (const d of p.divisions) assert(own.has(d.location), `${c.name}: division at province ${d.location} outside its states`);
    for (const s of p.ships) { assert(ports.has(s.location), `${c.name}: ${s.name} is not in a port`); assert(ports.has(s.base)); assert.equal(s.owner, c.tag); }
    for (const e of p.stock) assert.equal(e.producer, c.tag);
    for (const e of p.production) assert.equal(e.creator, c.tag);
  }
});
test('Every equipment type and ship definition is in the warfare id list', () => {
  const types = new Set(ids.equipmentTypes), sub = new Set(ids.subUnits);
  for (const c of countries) {
    const p = parsed.get(c.tag);
    for (const e of [...p.stock, ...p.production]) assert(types.has(e.type), `${c.name}: equipment ${e.type} is not defined by the warfare module`);
    for (const s of p.ships) { assert(shipIds.has(s.definition) && sub.has(s.definition), `${c.name}: ship ${s.definition}`); assert(types.has(s.hull), `${c.name}: hull ${s.hull}`); assert(s.hull.startsWith(`zin_hull_${s.definition.replace('zin_ship_', '')}`), `${c.name}: hull ${s.hull} for ${s.definition}`); }
  }
});
test('The start is at peace: no army outside its realm, Zol has three black ships and no division, Yeldenne nothing', () => {
  const zol = parsed.get(tag('Zol')), yel = parsed.get(tag('Yeldenne'));
  assert.equal(zol.divisions.length, 0); assert.equal(zol.ships.length, 3);
  assert(zol.ships.every(s => s.definition === 'zin_ship_raider' && s.hull === 'zin_hull_raider_0'), 'three corsairs');
  assert.equal(new Set(zol.ships.map(s => s.name)).size, 3);
  assert.equal(yel.divisions.length, 0); assert.equal(yel.ships.length, 0); assert.equal(yel.stock.length, 0);
  assert(text(oobFile(tag('Yeldenne'))).includes('units = {'), 'Yeldenne still has an order of battle file (a country without one has broken buildings)');
  assert.equal(parsed.get(tag('Worshipdom')).divisions.length, 1);
  assert.deepEqual([...parsed.get(tag('Worshipdom')).templates.keys()], ['Valley Wardens']);
});
test('The named realms of the start table have their divisions, templates and fleets', () => {
  const want = { Aenor: 36, Lerendor: 16, Coldor: 16, Isengard: 10, Noris: 14, Stabilo: 12, Gunwaith: 8, Girdon: 8, Goldoroth: 14, Dondor: 10, Mirolon: 10, Volgan: 40, Demon: 4, Dolon: 4, Nezer: 4, 'Magical Forest': 12, 'Gala Elves': 4, Worshipdom: 1, Selen: 3, Kingson: 4, Hiloron: 3, Kilinti: 3, Hunhun: 4 };
  for (const [n, d] of Object.entries(want)) assert.equal(parsed.get(tag(n)).divisions.length, d, `${n} divisions`);
  const count = (n, tmpl) => parsed.get(tag(n)).divisions.filter(x => x.template === tmpl).length;
  assert.equal(count('Aenor', 'Wall Garrison'), 6);
  assert.equal(count('Volgan', 'Grave Host'), 20); assert.equal(count('Volgan', 'Dominion Vanguard'), 10); assert.equal(count('Volgan', 'Monster Clan'), 10);
  assert.equal(count('Kingson', 'Wall Garrison'), 4);
  assert.equal(count('Selen', 'Ranger Companies'), 2);
  const ships = (n, def) => parsed.get(tag(n)).ships.filter(s => s.definition === def).length;
  assert.equal(ships('Aenor', 'zin_ship_galley'), 8); assert.equal(ships('Aenor', 'zin_ship_warship'), 4);
  assert.equal(ships('Lerendor', 'zin_ship_galley'), 12); assert.equal(ships('Lerendor', 'zin_ship_warship'), 8);
  // a realm without a port in map/buildings.txt (Coldor, Gunwaith, Girdon, Noris, Stabilo today) gets its spec fleet when the map has one
  const portly = (n, k) => portsOf(tag(n)).size ? k : 0;
  for (const [n, k] of [['Coldor', 6], ['Gunwaith', 4], ['Girdon', 4], ['Noris', 4], ['Stabilo', 4], ['Isengard', 2], ['Dondor', 3], ['Mirolon', 3], ['Gala Elves', 3]]) assert.equal(ships(n, 'zin_ship_galley'), portly(n, k), `${n} galleys`);
  assert.equal(ships('Coldor', 'zin_ship_warship'), portly('Coldor', 3));
  assert(ships('Aenor', 'zin_ship_galley') > 0 && ships('Lerendor', 'zin_ship_galley') > 0 && ships('Gala Elves', 'zin_ship_galley') === 3);
  assert(text(oobFile(tag('Aenor'))).includes('pride_of_the_fleet = yes'), 'a pride of the fleet');
});
test('The Great Wall garrisons stand in the states next to the wall forts', () => {
  const W = raw0.templates.wall, [w, h] = W.frame, forts = W.forts.map(f => [f.x * w, (1 - f.y) * h]);
  const centre = new Map(Object.values(geo).flat().map(s => [s.province, s.centre]));
  for (const [n, k] of [['Aenor', 6], ['Kingson', 4]]) {
    const p = parsed.get(tag(n)), wall = p.divisions.filter(d => d.template === 'Wall Garrison');
    assert.equal(wall.length, k);
    for (const d of wall) assert(Math.min(...forts.map(f => Math.hypot(f[0] - centre.get(d.location)[0], f[1] - centre.get(d.location)[1]))) <= W.maxDistance, `${n}: wall division at ${d.location} is far from the wall`);
  }
});
test('Villages keep one garrison, realms of three states or more field hosts, and no landlocked realm has a ship', () => {
  for (const c of countries) {
    const p = parsed.get(c.tag), states = geo[c.tag].length, pop = model.popOf.get(c.tag);
    if (raw0.templates.named[c.name]) continue;
    if (states <= 1 && pop < raw0.templates.formula.villagePeople) { assert.equal(p.divisions.length, 1, `${c.name} is a village`); assert(p.divisions.every(d => reserveName.has(d.template)), `${c.name}: a village fields only garrisons`); }
    if (states < 3) assert(p.divisions.every(d => reserveName.has(d.template)), `${c.name}: fewer than three states, garrisons only`);
    if (!portsOf(c.tag).size) assert.equal(p.ships.length, 0, `${c.name} has no port`);
    assert(p.divisions.length >= 1 && p.divisions.length <= 24, `${c.name}: ${p.divisions.length} divisions`);
  }
  const withField = countries.filter(c => parsed.get(c.tag).divisions.some(d => !reserveName.has(d.template)));
  assert(withField.length > 60, `${withField.length} realms field an army`);
});
test('Garrison templates are reserves and ships of generic realms are galleys named from their culture', () => {
  for (const c of countries) for (const [name, tm] of parsed.get(c.tag).templates) if (reserveName.has(name)) assert.equal(field(tm, 'priority'), '0', `${c.name} ${name}`); else assert.equal(field(tm, 'priority'), undefined);
  const generic = countries.filter(c => !raw0.templates.named[c.name] && parsed.get(c.tag).ships.length);
  assert(generic.length > 30);
  for (const c of generic) { const s = parsed.get(c.tag).ships; assert(s.every(x => x.definition === 'zin_ship_galley'), c.name); assert(s.length <= raw0.templates.formula.galleysMax); assert.equal(new Set(s.map(x => x.name)).size, s.length, `${c.name}: duplicate ship names`); }
});
test('Experience is low, the same at every run, and equipment is full', () => {
  for (const c of countries) for (const d of parsed.get(c.tag).divisions) { assert(d.xp >= 0 && d.xp <= 0.45, `${c.name}: experience ${d.xp}`); assert.equal(d.equip, 1); }
  assert.equal(parsed.get(tag('Volgan')).divisions[0].xp, 0.4);
  assert.equal(parsed.get(tag('Aenor')).divisions.find(d => d.template === 'Line Host').xp, 0.05);
});
test('Division names use a name group of the warfare module that fits the template, in order', () => {
  const groups = new Map();
  for (const e of parse(text('common/units/names_divisions/zin_names_divisions.txt'))) if (Array.isArray(e.v)) groups.set(e.k, new Set(field(e.v, 'division_types').map(x => x.v)));
  let named = 0, plain = 0;
  for (const c of countries) {
    const p = parsed.get(c.tag); let order = 0;
    for (const [name, tm] of p.templates) { const g = field(tm, 'division_names_group'); if (g) { assert(groups.has(g), `${c.name}: unknown group ${g}`); assert.equal(g, ids.hostGroupByCountry[c.name], `${c.name}: group of its culture`); const main = regimentsOf(tm)[0].sub; assert(groups.get(g).has(main) || regimentsOf(tm).some(r => groups.get(g).has(r.sub)), `${c.name} ${name}: ${g} does not list its battalions`); } }
    for (const d of p.divisions) {
      const g = field(p.templates.get(d.template), 'division_names_group');
      if (g) { assert(d.ordered, `${c.name}: ordered name`); assert.equal(Number(field(d.ordered, 'name_order')), ++order); assert.equal(field(d.ordered, 'is_name_ordered'), 'yes'); named++; } else { assert(d.name, `${c.name}: a literal name`); order++; plain++; }
    }
  }
  assert(named > 800, `${named} divisions use their culture's host names`);
  assert(plain < named, 'most divisions are named from the culture');
});
test('The equipment stock is 1.2 times the need of the divisions (Volgan 1.5) and the first line makes the people\'s own arms', () => {
  const need = (t, p) => {
    const sum = new Map();
    for (const d of p.divisions) for (const r of [...regimentsOf(p.templates.get(d.template)), ...supportOf(p.templates.get(d.template))]) for (const [a, v] of Object.entries(model.needOf.get(r.sub))) sum.set(a, (sum.get(a) ?? 0) + v);
    return sum;
  };
  for (const c of countries) {
    const p = parsed.get(c.tag), n = need(c.tag, p), f = c.name === 'Volgan' ? 1.5 : 1.2;
    for (const [a, v] of n) { const type = p.stock.filter(s => s.type.startsWith(`${a}_`) && /_\d+$/.test(s.type)); assert.equal(type.length, 1, `${c.name}: one stock line for ${a}`); assert.equal(type[0].amount, Math.ceil(v * f / 10) * 10, `${c.name}: ${a}`); }
    if (p.divisions.length && model.raw.templates.profiles[model.profileKey(c)].arms) { assert.equal(p.production.length, 1); assert(p.production[0].type.startsWith(model.raw.templates.profiles[model.profileKey(c)].arms), `${c.name} line`); assert.equal(p.production[0].efficiency, 50); assert.equal(p.production[0].factories, 1); }
    else assert.equal(p.production.length, 0);
  }
});
test('Pack trains are stocked for every realm with divisions and cogs for coastal realms with galleys', () => {
  for (const c of countries) { const p = parsed.get(c.tag); if (p.divisions.length) assert(p.stock.some(s => /^train_equipment_\d$/.test(s.type)), `${c.name}: trains`); if (p.ships.length && model.unlockedOf.get(c.tag).eq.has('convoy_0')) assert(p.stock.some(s => /^convoy_\d$/.test(s.type)), `${c.name}: cogs`); else if (p.ships.length) assert(!p.stock.some(s => /^convoy_/.test(s.type)), `${c.name}: no cogs unlocked`); }
});

// ------------------------------------------------------------------------------------------------ text
test('Every name a player reads (templates, fleets, task forces, ships) is clean of modern words', () => {
  const names = new Set();
  for (const c of countries) { const p = parsed.get(c.tag); for (const n of p.templates.keys()) names.add(n); for (const s of p.ships) { names.add(s.name); names.add(s.fleet); names.add(s.taskForce); } for (const d of p.divisions) if (d.name) names.add(d.name); }
  assert(names.size > 400);
  for (const n of names) assert.deepEqual(findBanned(n, banned), [], `banned word in "${n}"`);
});
test('No vanilla sub-unit, equipment, hull or ship definition appears in a staged file, except the kept engine keys', () => {
  const vanilla = new Set();
  const scan = async dir => { for (const f of await readdir(`${GAME}/${dir}`)) if (f.endsWith('.txt')) for (const e of parse(scriptText(readFileSync(`${GAME}/${dir}/${f}`)))) if (Array.isArray(e.v) && (e.k === 'sub_units' || e.k === 'equipments')) for (const x of e.v) if (x.k) vanilla.add(x.k); };
  return scan('common/units').then(() => scan('common/units/equipment')).then(() => {
    for (const k of ['convoy', 'convoy_1', 'train_equipment', 'train_equipment_1', 'motorized_equipment', 'motorized_equipment_1', 'motorized_equipment_2']) vanilla.delete(k);
    assert(vanilla.size > 300 && vanilla.has('infantry') && vanilla.has('destroyer'));
    for (const f of [...Object.values(FILES).filter(f => !f.endsWith('.json')), ...countries.map(c => oobFile(c.tag))]) for (const w of text(f).replace(/#[^\n]*/g, '').replace(/\b(role|type|id|category) = [A-Za-z_0-9]+/g, '').split(/[^A-Za-z0-9_]+/)) assert(!vanilla.has(w), `${f} names the vanilla key ${w}`);
  });
});

// ------------------------------------------------------------------------------------------------ AI templates
const tagsOfList = (entries, key) => new Set((field(entries, key) ?? []).map(x => x.v));
const aiEntries = parse(text(FILES.aiTemplates)).filter(e => Array.isArray(e.v));
const entryApplies = (e, t) => { const a = field(e.v, 'available_for'), b = field(e.v, 'blocked_for'); return a ? a.some(x => x.v === t) : !b.some(x => x.v === t); };
test('Each AI template entry has exactly one of available_for and blocked_for and one role', () => {
  assert.equal(aiEntries.length, raw0.ai.entries.length);
  const roles = new Set(raw0.templates.roles);
  for (const e of aiEntries) {
    assert.equal((field(e.v, 'available_for') !== undefined) + (field(e.v, 'blocked_for') !== undefined), 1, `${e.k}: exactly one list`);
    assert(roles.has(field(e.v, 'role')), `${e.k}: role`);
    assert(all(e.v, 'role').length === 1);
    assert(e.v.some(x => x.k && Array.isArray(x.v) && field(x.v, 'target_template')), `${e.k}: a target template`);
  }
});
test('Every country (and a dynamic tag) has exactly one entry for each role its people uses, and infantry and garrison always', () => {
  const dyn = ['D01', 'D40', 'D75'];
  for (const c of countries) {
    const key = model.profileKey(c), ratios = raw0.ai.ratios[key];
    for (const role of raw0.ai.roles) {
      const n = aiEntries.filter(e => field(e.v, 'role') === role && entryApplies(e, c.tag)).length;
      assert(n <= 1, `${c.name}: ${n} entries for ${role}`);
      if (ratios[role] > 0 || role === 'infantry' || role === 'garrison') assert.equal(n, 1, `${c.name}: no entry for ${role}`);
    }
  }
  for (const d of dyn) for (const role of ['infantry', 'garrison', 'mobile', 'armor', 'siege_role', 'marines', 'rangers_role']) assert.equal(aiEntries.filter(e => field(e.v, 'role') === role && entryApplies(e, d)).length, 1, `${d}: ${role} falls to the men's entry`);
});
test('Every history template of every country matches a role entry that applies to it', () => {
  for (const c of countries) {
    const roleOfName = new Map(Object.values(raw0.templates.templates).map(t => [t.name, t.role]));
    for (const name of parsed.get(c.tag).templates.keys()) { const role = roleOfName.get(name); assert(role, `${name} has a role`); assert(aiEntries.some(e => field(e.v, 'role') === role && entryApplies(e, c.tag)), `${c.name}: template ${name} (role ${role}) matches no entry`); }
  }
});
test('Every AI target names ZIN land sub-units that the entry\'s people recruits, and its replace chain stays in the entry', () => {
  for (const e of aiEntries) {
    const targets = e.v.filter(x => x.k && Array.isArray(x.v) && field(x.v, 'target_template'));
    const names = new Set(targets.map(t => t.k));
    const people = e.k.replace(/^zin_ai_/, '').replace(/_[a-z_]+$/, '');
    for (const t of targets) {
      const tt = field(t.v, 'target_template');
      for (const r of [...(field(tt, 'regiments') ?? []), ...(field(tt, 'support') ?? [])]) {
        assert(landIds.has(r.k), `${t.k}: ${r.k} is a ZIN land sub-unit`);
        const who = ids.unitPeople[r.k]; assert(who, `${r.k} has recruiters`);
      }
      const rw = field(t.v, 'replace_with'); if (rw) assert(names.has(rw), `${t.k}: replace_with ${rw}`);
      assert(Number(field(field(t.v, 'upgrade_prio'), 'factor')) >= 0);
    }
  }
  const menEntries = aiEntries.filter(e => e.k.startsWith('zin_ai_men_'));
  assert.equal(menEntries.length, 7);
  for (const e of menEntries) assert(field(e.v, 'blocked_for'), 'men are written with blocked_for');
});
test('A target template of a people only uses sub-units that people can recruit (the warfare recruit table)', () => {
  const peopleOfEntry = new Map(raw0.ai.entries.map(e => [`zin_ai_${e.people.replace('country:', '').toLowerCase()}_${e.role}`, e.people]));
  for (const e of aiEntries) {
    const people = peopleOfEntry.get(e.k), name = people.startsWith('country:') ? people : people;
    for (const t of e.v.filter(x => x.k && Array.isArray(x.v) && field(x.v, 'target_template'))) {
      const tt = field(t.v, 'target_template');
      for (const r of field(tt, 'regiments')) { const who = ids.unitPeople[r.k]; assert(who.includes(name) || who.includes(`country:${people.replace('country:', '')}`), `${t.k}: ${r.k} is not recruited by ${name} (${who.join(',')})`); }
    }
  }
});
test('Heavier targets wait for their technology or flag and for tiers A and B', () => {
  const men = aiEntries.find(e => e.k === 'zin_ai_men_infantry'), heavy = men.v.find(x => x.k === 'zin_ai_men_heavy_host'), warded = men.v.find(x => x.k === 'zin_ai_men_warded_host');
  const en = field(heavy.v, 'enable');
  assert(en.some(x => x.k === 'has_tech' && /^zin_tech_/.test(x.v)), 'heavy host waits for the mail technology');
  assert(JSON.stringify(field(warded.v, 'enable')).includes('zin_zol_rising'));
  assert(JSON.stringify(en).includes('zin_ai_is_tier_c'));
  const tech = en.find(x => x.k === 'has_tech').v;
  assert(raw0.techs.technologies.some(t => `zin_tech_${t.key}` === tech && t.unlocks.subunits.includes('zin_men_heavy_infantry')));
  const zol = aiEntries.find(e => e.k === 'zin_ai_zol_infantry');
  assert.equal(field(field(zol.v, 'upgrade_prio'), 'factor'), '0', 'the Mistake spends no experience on templates');
});

// ------------------------------------------------------------------------------------------------ AI ship designs and navy
const hullSlots = new Map(), moduleIds = new Set(), categories = new Set();
for (const e of parse(text('common/units/equipment/zin_equipment_naval.txt')).find(x => x.k === 'equipments').v) if (field(e.v, 'is_archetype') === 'yes' && field(e.v, 'module_slots')) hullSlots.set(e.k, field(e.v, 'module_slots').map(s => s.k));
for (const e of parse(text('common/units/equipment/modules/zin_ship_modules.txt')).find(x => x.k === 'equipment_modules').v) if (e.k) { moduleIds.add(e.k); categories.add(field(e.v, 'category')); }
const designGroups = parse(text(FILES.aiEquipment)).filter(e => Array.isArray(e.v));
const designApplies = (g, t) => { const a = field(g.v, 'available_for'), b = field(g.v, 'blocked_for'); return a ? a.some(x => x.v === t) : !b.some(x => x.v === t); };
test('Ship designs name hulls, slots and modules that the warfare module defines, with the three ZIN roles', () => {
  assert.equal(designGroups.length, 4 * 4 - 1, 'four groups of four hull classes, the Mistake without a great warship');
  assert.deepEqual([...hullSlots.keys()].sort(), ids.hulls.slice().sort());
  const roles = new Set(['naval_screen', 'naval_capital', 'naval_raider']);
  let designs = 0;
  for (const g of designGroups) {
    assert.equal(field(g.v, 'category'), 'naval');
    assert.equal((field(g.v, 'available_for') !== undefined) + (field(g.v, 'blocked_for') !== undefined), 1);
    const rs = field(g.v, 'roles').map(x => x.v); assert.equal(rs.length, 1); assert(roles.has(rs[0]), `role ${rs[0]}`);
    for (const d of g.v.filter(x => x.k && Array.isArray(x.v) && field(x.v, 'target_variant'))) {
      designs++;
      const tv = field(d.v, 'target_variant'), type = field(tv, 'type'), hull = type.replace(/_\d+$/, '');
      assert(ids.equipmentTypes.includes(type), `${d.k}: ${type} is an equipment type`);
      for (const s of field(tv, 'modules')) { assert(hullSlots.get(hull).includes(s.k), `${d.k}: ${s.k} is a slot of ${hull}`); assert(moduleIds.has(s.v) || categories.has(s.v), `${d.k}: ${s.v} is a module or a category`); }
      for (const m of field(d.v, 'allowed_modules')) assert(moduleIds.has(m.v) || categories.has(m.v), `${d.k}: allowed ${m.v}`);
      assert.equal(field(d.v, 'history'), 'yes');
    }
  }
  assert.equal(designs, 38, 'ten designs for each of three groups, eight for the Mistake');
});
test('Every country that can build a hull has a design group for its role, once; Black Sails are the Mistake\'s alone', () => {
  const roleOf = { galley: 'naval_screen', warship: 'naval_capital', great: 'naval_capital', raider: 'naval_raider' };
  for (const c of countries) {
    const un = model.unlockedOf.get(c.tag);
    for (const [ship, cls] of [['zin_ship_galley', 'galley'], ['zin_ship_warship', 'warship'], ['zin_ship_great_warship', 'great'], ['zin_ship_raider', 'raider']]) {
      if (!un.subs.has(ship)) continue;
      const hit = designGroups.filter(g => field(g.v, 'roles')[0].v === roleOf[cls] && g.k.endsWith(`_${cls}`) && designApplies(g, c.tag));
      assert.equal(hit.length, 1, `${c.name}: ${hit.length} design groups for ${cls}`);
    }
  }
  const black = designGroups.filter(g => JSON.stringify(g.v).includes('zin_mod_black_sails')).map(g => g.k);
  assert(black.length >= 1 && black.every(k => k.includes('mistake')), `Black Sails only in the Mistake's groups: ${black}`);
  const forced = g => g.v.filter(d => d.k && Array.isArray(d.v) && field(d.v, 'target_variant')).flatMap(d => field(field(d.v, 'target_variant'), 'modules').map(m => m.v));
  for (const g of designGroups) {
    if (g.k.includes('elves')) assert(forced(g).includes('zin_mod_elven_sails') || g.k.endsWith('_galley') || g.k.endsWith('_raider'), `${g.k}: elven sails on the elven warships`);
    else assert(!forced(g).includes('zin_mod_elven_sails'), `${g.k}: elven sails are the elves' alone`);
    if (!g.k.includes('mistake')) assert(!forced(g).includes('zin_mod_black_sails'), `${g.k}: black sails are the Mistake's alone`);
  }
  assert(designGroups.filter(g => g.k.includes('elves')).every(g => JSON.stringify(g.v).includes('zin_mod_elven_sails')));
  assert(forced(designGroups.find(g => g.k === 'zin_ai_ships_mistake_raider')).includes('zin_mod_black_sails'), 'the black ships sail on black sails');
  assert(forced(designGroups.find(g => g.k === 'zin_ai_ships_dominion_warship')).includes('zin_mod_fire_pots'), 'orc and Dominion warships carry fire-pots');
});
test('Task forces, fleets and goals use only ZIN ships and the engine\'s mission and objective keys', () => {
  const tf = parse(text(FILES.taskforce)).filter(e => Array.isArray(e.v)), fleets = parse(text(FILES.fleet)).filter(e => Array.isArray(e.v)), goals = parse(text(FILES.goals)).filter(e => Array.isArray(e.v));
  assert.equal(tf.length, 6); assert.equal(fleets.length, 5);
  const missions = new Set(['naval_strike', 'naval_patrol', 'convoy_escort', 'convoy_raiding', 'naval_invasion_support']);
  for (const t of tf) {
    assert(missions.has(field(t.v, 'mission')[0].v), `${t.k}: mission`);
    assert.equal(field(field(t.v, 'allowed'), 'always'), 'yes'); assert(Number(field(field(t.v, 'ai_will_do'), 'factor')) > 0);
    for (const c of [...field(t.v, 'min_composition'), ...field(t.v, 'optimal_composition')]) assert(shipIds.has(c.k), `${t.k}: ${c.k} is a ZIN ship`);
  }
  const tfNames = new Set(tf.map(t => t.k));
  for (const f of fleets) for (const k of ['required_taskforces', 'optional_taskforces']) for (const r of field(f.v, k)) assert(tfNames.has(r.k), `${f.k}: ${r.k}`);
  const types = new Set(['naval_invasion_support', 'naval_invasion_defense', 'coast_defense', 'convoy_protection', 'convoy_raiding', 'naval_dominance', 'training', 'naval_blockade']);
  for (const g of goals) { assert(types.has(field(g.v, 'objective_type'))); assert.equal(field(g.v, 'available_for'), undefined); assert.equal(field(g.v, 'blocked_for'), undefined); assert(Number(field(g.v, 'min_priority')) <= Number(field(g.v, 'max_priority'))); }
  for (const need of ['naval_invasion_support', 'naval_invasion_defense', 'coast_defense', 'convoy_protection', 'convoy_raiding']) assert(goals.some(g => field(g.v, 'objective_type') === need), `a goal of type ${need}`);
  assert(!/\b(destroyer|battleship|cruiser|carrier|submarine)\b/.test(text(FILES.taskforce).replace(/#[^\n]*/g, '')), 'no vanilla ship type in a task force');
  assert.equal(tf.find(t => t.k === 'zin_strike_force').v.some(x => x.k === 'keep_updated'), true);
});

// ------------------------------------------------------------------------------------------------ strategies, plans, triggers
const docTokens = (() => {
  const set = new Set(), d = readFileSync(`${GAME}/common/ai_strategy/_documentation.md`, 'utf8'), head = d.slice(0, d.indexOf('## UNIT RATIOS'));
  for (const m of head.matchAll(/^- `([a-z_]+)`/gm)) set.add(m[1]);
  return set;
})();
const vanillaTypes = (() => {
  const set = new Set();
  const dir = `${GAME}/common/ai_strategy`;
  for (const f of readdirSync(dir)) if (f.endsWith('.txt')) for (const m of readFileSync(`${dir}/${f}`, 'latin1').matchAll(/\btype\s*=\s*([a-z_]+)/g)) set.add(m[1]);
  return set;
})();
const strategyFiles = [FILES.land, FILES.production, FILES.navy, FILES.doctrines];
const blocksOf = f => parse(text(f)).filter(e => Array.isArray(e.v));
const roleSet = new Set(raw0.templates.roles), archetypeSet = new Set(ids.archetypes);
test('Every strategy block is complete: allowed, enable and an abort rule; tokens and ids resolve', () => {
  let blocks = 0, strategies = 0;
  const unitRatios = new Set(['screen_ship', 'capital_ship', 'submarine', 'convoy', 'cas', 'fighter']);
  const doctrineKeys = new Set([...raw0.doctrines.grand.map(g => g.key), ...raw0.doctrines.tracks.map(t => t.key)]);
  for (const f of strategyFiles) for (const b of blocksOf(f)) {
    blocks++;
    assert(field(b.v, 'allowed') && field(b.v, 'enable'), `${b.k}: allowed and enable`);
    assert(field(b.v, 'abort_when_not_enabled') === 'yes' || field(b.v, 'abort'), `${b.k}: an abort rule`);
    const txt = JSON.stringify(b.v);
    assert(!/has_dlc/.test(txt), `${b.k}: no has_dlc`);
    for (const s of all(b.v, 'ai_strategy')) {
      strategies++;
      const type = field(s.v, 'type'), id = field(s.v, 'id'), value = Number(field(s.v, 'value'));
      assert(docTokens.has(type) || vanillaTypes.has(type), `${b.k}: strategy type ${type}`);
      assert(Number.isFinite(value) && Math.abs(value) <= 300, `${b.k}: value ${value} within the stacking cap`);
      if (type === 'role_ratio') assert(roleSet.has(id) || ['naval_screen', 'naval_capital', 'naval_raider'].includes(id), `${b.k}: role ${id}`);
      if (type === 'unit_ratio') assert(unitRatios.has(id), `${b.k}: unit ${id}`);
      if (type.startsWith('equipment_') && id) assert(archetypeSet.has(id) || ['infantry', 'support', 'artillery', 'anti_tank', 'anti_air'].includes(id), `${b.k}: equipment ${id}`);
      assert(!['conquer', 'befriend', 'antagonize', 'alliance', 'declare_war', 'prepare_for_war', 'consider_weak', 'invade'].includes(type), `${b.k}: no war or diplomacy value in the L1 military files`);
    }
    for (const m of txt.matchAll(/"has_doctrine","op":"=","v":"([a-z_]+)"/g)) assert(doctrineKeys.has(m[1]));
  }
  assert(blocks > 55 && strategies > 200, `${blocks} blocks, ${strategies} strategies`);
});
test('Strategies name no date before the start, no vanilla tag, and every doctrine and track they read exists', () => {
  const tags = new Set([...readFileSync(`${GAME}/common/country_tags/00_countries.txt`, 'latin1').matchAll(/^([A-Z][A-Z0-9]{2})\s*=/gm)].map(m => m[1]));
  const zinTags = new Set(countries.map(c => c.tag));
  for (const f of [...strategyFiles, FILES.plans, FILES.tiers, FILES.eras]) {
    const t = text(f).replace(/#[^\n]*/g, '');
    assert(!/\bdate\s*[<>=]/.test(t), `${f}: no date test`);
    for (const m of t.matchAll(/original_tag\s*=\s*([A-Za-z0-9]+)/g)) { assert(zinTags.has(m[1]), `${f}: tag ${m[1]}`); assert(!tags.has(m[1]) || zinTags.has(m[1])); }
  }
  const dts = text(FILES.doctrines);
  for (const k of raw0.doctrines.grand.map(g => g.key)) assert(dts.includes(`has_doctrine = ${k}`), `a block reads the doctrine ${k}`);
  assert.equal(blocksOf(FILES.doctrines).filter(b => b.k.startsWith('zin_default_doctrine_')).length, 15, 'one block per grand doctrine');
  assert.equal(blocksOf(FILES.doctrines).filter(b => b.k.startsWith('zin_default_track_')).length, 4, 'four tracks');
});
test('Role ratios are the spec table, with the tier shifts of the garrison share and the peace-first brake', () => {
  const land = new Map(blocksOf(FILES.land).map(b => [b.k, b]));
  const ratio = (b, id) => Number(field(all(b.v, 'ai_strategy').find(s => field(s.v, 'id') === id && field(s.v, 'type') === 'role_ratio').v, 'value'));
  const men = land.get('zin_default_land_men');
  assert.equal(ratio(men, 'infantry'), 55); assert.equal(ratio(men, 'garrison'), 10); assert.equal(ratio(men, 'mobile'), 15); assert.equal(ratio(men, 'armor'), 10); assert.equal(ratio(men, 'siege_role'), 10); assert.equal(ratio(men, 'rangers_role'), 5);
  assert.equal(ratio(land.get('zin_default_land_men_coast'), 'marines'), 5);
  assert.equal(ratio(land.get('zin_default_land_trolls'), 'armor'), 70); assert.equal(ratio(land.get('zin_default_land_sun_elves'), 'infantry'), 100);
  assert.equal(ratio(land.get('zin_default_land_tier_b'), 'garrison'), 5); assert.equal(ratio(land.get('zin_default_land_tier_c'), 'garrison'), 10); assert.equal(ratio(land.get('zin_default_land_tier_c'), 'infantry'), -10);
  const peace = land.get('zin_default_peace_first');
  assert(JSON.stringify(field(peace.v, 'enable')).includes('zin_ai_era_peace'));
  assert.equal(Number(field(all(peace.v, 'ai_strategy')[0].v, 'value')), -50);
  for (const k of Object.keys(raw0.ai.ratios)) assert(land.has(`zin_default_land_${k.replace('country:', '').toLowerCase()}`), `a land block for ${k}`);
});
test('Production never builds granted equipment, builds nothing for the Mistake\'s arms, and every id is a warfare archetype', () => {
  const prod = new Map(blocksOf(FILES.production).map(b => [b.k, b]));
  const never = prod.get('zin_default_production_never');
  const ids2 = all(never.v, 'ai_strategy').map(s => field(s.v, 'id'));
  for (const g of ids.grantedEquipment) assert(ids2.includes(g), `${g} is never produced`);
  for (const s of all(never.v, 'ai_strategy')) assert.equal(Number(field(s.v, 'value')), -100);
  for (const b of prod.values()) for (const s of all(b.v, 'ai_strategy')) { const id = field(s.v, 'id'); if (id && field(s.v, 'type') === 'equipment_variant_production_factor') assert(archetypeSet.has(id), `${b.k}: ${id}`); }
  const orcs = prod.get('zin_default_production_orcs');
  assert.equal(Number(field(all(orcs.v, 'ai_strategy')[0].v, 'value')), 150, 'orcs build armouries first');
  assert(JSON.stringify(prod.get('zin_default_production_no_skies').v).includes('zin_rules_skies_present'));
});
test('Dragons are never produced and Zol builds no ships', () => {
  const navy = new Map(blocksOf(FILES.navy).map(b => [b.k, b]));
  const air = navy.get('zin_default_air_dragons');
  assert(all(air.v, 'ai_strategy').every(s => Number(field(s.v, 'value')) === 0 && ['cas', 'fighter'].includes(field(s.v, 'id'))));
  const zolBlock = navy.get('zin_default_navy_zol');
  assert(JSON.stringify(zolBlock.v).includes(tag('Zol')));
  assert(all(zolBlock.v, 'ai_strategy').every(s => Number(field(s.v, 'value')) === -100), 'base 100 minus 100 is none');
  assert(JSON.stringify(navy.get('zin_default_navy_sea_power').v).includes(tag('Lerendor')));
  assert(JSON.stringify(navy.get('zin_default_air_griffins').v).includes('zin_rules_skies_beasts'));
});
test('Plans: one per people and tier present, with research categories that exist', () => {
  const plans = parse(text(FILES.plans)).filter(e => Array.isArray(e.v));
  const cats = new Set(raw0.civil.categories.map(c => c.key));
  const pairs = new Set(countries.map(c => `${model.profileKey(c)}|${model.tierOf(c.tag)}`));
  assert.equal(plans.length, pairs.size);
  for (const p of plans) {
    assert.equal(field(field(p.v, 'abort'), 'always'), 'no'); assert(field(p.v, 'enable') && field(p.v, 'allowed')); assert.equal(field(p.v, 'desc'), '');
    for (const r of field(p.v, 'research')) assert(cats.has(r.k), `${p.k}: category ${r.k}`);
    assert.equal(all(p.v, 'ai_national_focuses').length, 0, 'no focus order');
  }
});
test('Every trigger, token and effect the files use is in the installed documentation or is a ZIN scripted trigger', () => {
  const docT = new Set([...readFileSync(`${GAME}/documentation/triggers_documentation.md`, 'utf8').matchAll(/^## ([a-z_0-9]+)\s*$/gm)].map(m => m[1]));
  const docE = new Set([...readFileSync(`${GAME}/documentation/effects_documentation.md`, 'utf8').matchAll(/^## ([a-z_0-9]+)\s*$/gm)].map(m => m[1]));
  const own = new Set(['zin_ai_is_tier_a', 'zin_ai_is_tier_b', 'zin_ai_is_tier_c', 'zin_ai_era_peace', 'zin_ai_era_stirring', 'zin_ai_era_war', 'zin_ai_era_after', 'zin_rules_skies_present', 'zin_rules_skies_beasts']);
  const ok = new Set(['allowed', 'enable', 'abort', 'abort_when_not_enabled', 'ai_strategy', 'type', 'id', 'value', 'name', 'desc', 'research', 'ideas', 'weight', 'factor', 'always', 'NOT', 'OR', 'AND', 'modifier', 'ai_will_do', 'priority', 'roles', 'category', 'blocked_for', 'available_for', 'role', 'upgrade_prio', 'reinforce_prio', 'target_template', 'support', 'regiments', 'replace_at_match', 'replace_with', 'target_min_match', 'enable']);
  const triggersUsed = new Set();
  const walkEntries = (es, inTrigger) => { for (const e of es) { if (e.k && !ok.has(e.k) && inTrigger) triggersUsed.add(e.k); if (Array.isArray(e.v)) walkEntries(e.v, inTrigger || ['allowed', 'enable', 'abort'].includes(e.k)); } };
  for (const f of [...strategyFiles, FILES.plans, FILES.tiers, FILES.eras]) walkEntries(parse(text(f)), false);
  for (const t of triggersUsed) assert(docT.has(t) || own.has(t) || /^(zin_[a-z_]+)$/.test(t) && own.has(t), `trigger ${t} is documented`);
  assert(triggersUsed.has('is_coastal') && triggersUsed.has('has_doctrine') && triggersUsed.has('has_completed_track'));
  for (const e of ['add_equipment_to_stockpile', 'add_equipment_production']) assert(docE.has(e), `${e} is a documented effect`);
});
test('Tier triggers cover the roster once (13 + 71 named, the rest by negation) and the four eras read only global state', () => {
  const tiers = parse(text(FILES.tiers)), tagsIn = k => new Set(field(field(tiers, k), 'OR').map(x => x.v));
  const a = tagsIn('zin_ai_is_tier_a'), b = tagsIn('zin_ai_is_tier_b');
  assert.equal(a.size, 13); assert.equal(b.size, 71); for (const t of a) assert(!b.has(t));
  assert(a.has(tag('Zol')) && a.has(tag('Aenor')) && b.has(tag('Yeldenne')));
  assert(JSON.stringify(field(field(tiers, 'zin_ai_is_tier_c'), 'NOT')).includes('zin_ai_is_tier_a'));
  const eras = text(FILES.eras);
  for (const e of ['zin_ai_era_peace', 'zin_ai_era_stirring', 'zin_ai_era_war', 'zin_ai_era_after']) assert(eras.includes(`${e} = {`));
  assert(!/original_tag|has_country_flag|owns_state/.test(eras), 'eras are global');
  assert.equal(raw0.institutions.tiers.a.length, 13);
});

// ------------------------------------------------------------------------------------------------ the designer pieces
test('The graphic database, window file and sprite file agree and name no vanilla entity or sprite', () => {
  const sprites = new Set([...text('interface/zin_equipment.gfx').matchAll(/name = "([^"]+)"/g)].map(m => m[1]));
  const db = parse(text(FILES.graphicDb));
  for (const pool of db.find(x => x.k === 'default').v) {
    assert(archetypeSet.has(pool.k), `${pool.k} is an archetype`);
    const p = field(pool.v, 'pool'); assert.equal(field(p, 'models'), undefined, 'no 3D entity: none exists for ships yet');
    for (const i of field(p, 'icons')) assert(sprites.has(i.v), `${i.v} is defined by the warfare sprites`);
  }
  const keys = db.find(x => x.k === 'default').v.map(x => x.k);
  for (const h of ids.hulls) assert(keys.includes(h));
  const gfx = text(FILES.designerGfx), gui = text(FILES.designerGui);
  const defined = new Set([...gfx.matchAll(/name = "([^"]+)"/g)].map(m => m[1]));
  for (const m of gui.matchAll(/spriteType = "([^"]+)"/g)) assert(defined.has(m[1]), `${m[1]} is defined in the designer sprite file`);
  for (const n of defined) assert(n.startsWith('GFX_zin_'), `${n} is a ZIN sprite name`);
  for (const h of ids.hulls) {
    assert(gui.includes(`name = "equipment_designer_${h}"`), `a window for ${h}`);
    const win = gui.split('name = "equipment_designer_').slice(1).find(w => w.startsWith(h + '"'));
    for (const slot of hullSlots.get(h)) assert(win.includes(`name = "${slot}"`), `${h}: window for ${slot}`);
  }
  assert(!/GFX_(?!zin_)/.test(gui), 'no vanilla sprite in the windows');
  for (const f of ['gfx/interface/zin/frame.dds']) assert(existsSync(`${ZIN}/${f}`), 'the fallback picture exists');
});
test('The geography file is current with the states of the mod', async () => {
  const states = await readStates();
  const fromFile = new Map(Object.entries(geo).flatMap(([t, l]) => l.map(s => [s.id, { owner: t, province: s.province }])));
  assert.equal(states.length, fromFile.size);
  for (const s of states) { const f = fromFile.get(s.id); assert(f, `state ${s.id}`); assert.equal(f.owner, s.owner); assert(s.provinces.includes(f.province)); }
  assert.deepEqual(raw0.geography.anomalies, []);
  assert.equal(Object.keys(geo).length, 305);
  for (const c of countries) assert(geo[c.tag], `${c.name} has states`);
  assert(countries.every(c => geo[c.tag].some(s => s.id === c.capitalState)), 'every capital state is among the states of its owner');
});

// ------------------------------------------------------------------------------------------------ pieces and negative cases
test('layoutRegiments puts one group in a column and refuses what does not fit; apportion is exact and stable', () => {
  const g = s => ({ a: 'infantry', b: 'mobile', c: 'armor' })[s];
  const p = layoutRegiments([['a', 4], ['b', 2], ['c', 1]], g);
  assert.deepEqual(p.map(x => [x.sub, x.x, x.y]), [['a', 0, 0], ['a', 0, 1], ['a', 0, 2], ['a', 1, 0], ['b', 2, 0], ['b', 2, 1], ['c', 3, 0]]);
  assert.throws(() => layoutRegiments([['a', 30]], g), /does not fit/);
  const two = layoutRegiments([['a', 1], ['b', 1], ['a', 1]], g);
  assert.deepEqual(two.map(x => x.x), [0, 0, 1], 'a group never splits across a foreign column');
  const ap = apportion(7, [['x', 55], ['y', 15], ['z', 10], ['w', 0]]);
  assert.equal([...ap.values()].reduce((a, b) => a + b, 0), 7); assert.equal(ap.get('w'), 0); assert(ap.get('x') >= ap.get('y'));
  assert.deepEqual([...apportion(3, [['a', 1], ['b', 1]])], [['a', 2], ['b', 1]], 'ties go to the earlier key');
  assert.equal([...apportion(0, [['a', 1]])][0][1], 0);
});
test('divisionCount follows the spec formula, the tier B bonus and the population cap', () => {
  const m = model, f = m.raw.templates.formula;
  const big = countries.find(c => geo[c.tag].length >= 12 && !m.raw.templates.named[c.name] && m.tierOf(c.tag) === 'c' && m.popOf.get(c.tag) > 500000);
  if (big) assert(divisionCount(m, big) <= f.max * 1.25 + 1);
  assert.equal(divisionCount(m, byName.get('Aenor')), 36); assert.equal(divisionCount(m, byName.get('Yeldenne')), 0);
  const tiny = countries.find(c => geo[c.tag].length === 1 && m.popOf.get(c.tag) < f.villagePeople && !m.raw.templates.named[c.name]);
  assert.equal(divisionCount(m, tiny), 1);
});
test('planCountry is deterministic and keeps to unlocked units: a country without galleys gets no fleet', () => {
  const a = planCountry(model, byName.get('Lerendor')), b = planCountry(model, byName.get('Lerendor'));
  assert.deepEqual(a.divisions.map(d => [d.template, d.province, d.xp]), b.divisions.map(d => [d.template, d.province, d.xp]));
  const c = byName.get('Lerendor');
  const un = model.unlockedOf.get(c.tag);
  const saved = new Set(un.subs);
  un.subs.delete('zin_ship_galley'); un.subs.delete('zin_ship_warship');
  const without = planCountry(model, c);
  un.subs.clear(); for (const s of saved) un.subs.add(s);
  assert.equal(without.ships.length, 0, 'no ship without the sub-unit');
  assert(planCountry(model, c).ships.length > 0);
});
test('A template whose sub-unit the country has not unlocked falls back to the people\'s first usable template', () => {
  const c = byName.get('Stabilo'), un = model.unlockedOf.get(c.tag), saved = new Set(un.subs);
  un.subs.delete('zin_men_knights'); un.subs.delete('zin_men_cavalry'); un.subs.delete('zin_men_horse_archers');
  const p = planCountry(model, c);
  un.subs.clear(); for (const s of saved) un.subs.add(s);
  assert(p.divisions.every(d => !['men_riders', 'men_knights'].includes(d.template)), 'no cavalry template without cavalry');
  assert(p.notes.some(n => /not unlocked/.test(n)));
  assert.equal(p.divisions.length, 12);
});
test('Negative: a template with a sub-unit the warfare module does not define is refused', async () => {
  await rejects(r => { r.templates.templates.men_line_host.options[0].regiments[0][0] = 'zin_men_pikemen'; }, /unknown sub-unit zin_men_pikemen/);
  await rejects(r => { r.templates.templates.men_line_host.options[0].regiments[0][0] = 'infantry'; }, /unknown sub-unit infantry/);
});
test('Negative: an equipment archetype that warfare does not define is refused', async () => {
  await rejects(r => { r.templates.profiles.men.arms = 'infantry_equipment'; }, /unknown archetype infantry_equipment/);
  await rejects(r => { r.ai.production.variants.men.zin_pike_equipment = 80; }, /unknown archetype zin_pike_equipment/);
  await rejects(r => { r.ai.production.never.push('zin_rifle_equipment'); }, /unknown archetype zin_rifle_equipment/);
});
test('Negative: a missing template, a missing role entry or a bad chain is refused', async () => {
  await rejects(r => { r.templates.profiles.men.mix.push({ t: 'men_pikemen', w: 5 }); }, /unknown template men_pikemen/);
  await rejects(r => { r.templates.profiles.men.garrison = 'men_no_garrison'; }, /unknown garrison template/);
  await rejects(r => { r.templates.named.Aenor.mix.men_ghost_host = 1; }, /unknown template men_ghost_host/);
  await rejects(r => { r.ai.entries = r.ai.entries.filter(e => !(e.people === 'men' && e.role === 'garrison')); }, /no garrison entry|AIC1/);
  await rejects(r => { r.ai.entries = r.ai.entries.filter(e => !(e.people === 'elves' && e.role === 'mobile')); }, /AIC1/);
  await rejects(r => { r.ai.entries[0].targets[0].replace = 'nowhere'; }, /replace_with nowhere/);
  await rejects(r => { r.ai.entries.push(structuredClone(r.ai.entries[0])); }, /declared twice/);
  await rejects(r => { r.ai.entries[0].targets[0].regiments.zin_ghost = 2; }, /unknown sub-unit zin_ghost/);
  await rejects(r => { r.ai.entries[0].targets[0].support.zin_men_infantry = 1; }, /not a support company/);
  await rejects(r => { r.ai.entries[0].targets[0].enable = ['tech:zin_ship_great_warship_x']; }, /no technology unlocks/);
});
test('Negative: support companies among the regiments, a granted unit, too many battalions and a bad name are refused', async () => {
  await rejects(r => { r.templates.templates.men_line_host.options[0].regiments.push(['zin_support_scouts', 1]); }, /support company zin_support_scouts listed among the regiments/);
  await rejects(r => { r.templates.templates.men_line_host.options[0].regiments.push(['zin_demons_shachihata', 1]); }, /not recruited at the start/);
  await rejects(r => { r.templates.templates.men_line_host.options[0].regiments = [['zin_men_infantry', 26]]; }, /more than 25 battalions|does not fit/);
  await rejects(r => { r.templates.templates.men_line_host.options[0].support.push('zin_men_archers'); }, /not a support company/);
  await rejects(r => { r.templates.templates.men_line_host.name = 'Line "Host'; }, /bad name/);
  await rejects(r => { r.templates.templates.men_line_host.role = 'tanks'; }, /unknown role tanks/);
});
test('Negative: a named realm outside the roster, a mix that does not add up and a template of another people are refused', async () => {
  await rejects(r => { r.templates.named.Atlantis = { divisions: 1, xp: 0.1, mix: { men_line_host: 1 } }; }, /Atlantis is not in the roster/);
  await rejects(r => { r.templates.named.Aenor.divisions = 37; }, /the mix names 36 divisions, not 37/);
  await rejects(r => { r.templates.named.Volgan.mix = { men_line_host: 40 }; }, /template men_line_host is not for country:Volgan/);
  await rejects(r => { r.templates.named.Zol.navy = { destroyer: 3 }; }, /unknown ship destroyer/);
});
test('Negative: a vanilla ship in a task force, a fleet with no task force, an unknown goal and a bad doctrine are refused', async () => {
  await rejects(r => { r.ai.navy.taskforces[0].min = { destroyer: 2 }; }, /destroyer is not a ZIN ship sub-unit/);
  await rejects(r => { r.ai.navy.fleets[0].required = { zin_phantom_force: 1 }; }, /unknown task force zin_phantom_force/);
  await rejects(r => { r.ai.navy.goals[0].type = 'mines_planting'; }, /unknown objective type mines_planting/);
  await rejects(r => { r.ai.navy.goals[0].min = 30; }, /min above max/);
  await rejects(r => { r.ai.doctrines.land.zin_gd_blitzkrieg = { infantry: 1 }; }, /unknown doctrine or track zin_gd_blitzkrieg/);
  await rejects(r => { r.ai.research.base.men.zin_cat_tanks = 1; }, /unknown research category zin_cat_tanks/);
  await rejects(r => { r.ai.designs.armament.men.galley = ['zin_mod_cannon']; }, /unknown module zin_mod_cannon/);
});
test('Negative: a country without states in the geography file, or without a start package, is refused', async () => {
  await rejects(r => { delete r.geography.countries[tag('Kingson')]; }, /no state in the geography file/);
  const raw = clone();
  await assert.rejects(prepareModel({ countries, assignment, table, startPackages: { packages: {}, countries: {} } }, raw), /no start package/);
});
test('Negative: a modern word in a template name stops the build', async () => {
  const raw = clone(); raw.templates.templates.men_line_host.name = 'Rifle Battalion';
  const s = copyOf(snapshot);
  await assert.rejects(buildForces(s, { countries, assignment, table, raw }), /banned word/);
});
test('Negative: building before the warfare module is refused with a clear message', async () => {
  await assert.rejects(buildForces(new Staged(), { countries, assignment, table }), /run buildWarfare first/);
});
test('Negative: a vanilla sub-unit id sneaked into the AI files would be caught by the vanilla scan', () => {
  const sneaky = text(FILES.aiTemplates).replace('zin_men_infantry = 6', 'infantry = 6');
  assert(/\binfantry = 6\b/.test(sneaky) && !/\binfantry = 6\b/.test(text(FILES.aiTemplates)), 'the planted line is the only one');
  const t = parse(sneaky).filter(e => Array.isArray(e.v)); let bad = 0;
  for (const e of t) for (const x of e.v.filter(y => y.k && Array.isArray(y.v) && field(y.v, 'target_template'))) for (const r of field(field(x.v, 'target_template'), 'regiments') ?? []) if (!landIds.has(r.k)) bad++;
  assert.equal(bad, 1);
});
test('With splitNaval the fleets move to <TAG>_world_naval.txt and the land file keeps no fleet', async () => {
  const s = copyOf(snapshot);
  const n = await buildForces(s, { countries, assignment, table, splitNaval: true });
  assert.equal(n.ships, summary.ships);
  const withShips = countries.filter(c => parsed.get(c.tag).ships.length);
  assert(withShips.length > 100);
  for (const c of withShips) {
    const naval = s.files.get(`history/units/${c.tag}_world_naval.txt`);
    assert(naval, `${c.name}: a naval file`);
    assert(naval.toString('utf8').includes('fleet = {') && !s.files.get(oobFile(c.tag)).toString('utf8').includes('fleet = {'));
  }
  for (const c of countries.filter(x => !parsed.get(x.tag).ships.length)) assert(!s.files.has(`history/units/${c.tag}_world_naval.txt`), `${c.name}: no empty naval file`);
  assert(!staged.files.has(`history/units/${tag('Aenor')}_world_naval.txt`), 'the default build keeps the fleet in the one file');
});
test('A realm that has no start technology for a unit never fields it: the planted package has no galleys', async () => {
  const packs = structuredClone(model.packs);
  const row = packs.countries.Lerendor;
  row.technologies = row.technologies.filter(k => !['oared_galleys', 'war_galleys', 'sailing_warships', 'high_castled_warships'].includes(k));
  const s = copyOf(snapshot);
  const cx = { countries, assignment, table, startPackages: packs };
  await buildForces(s, cx);
  const p = parseOobFrom(s.files.get(oobFile(tag('Lerendor'))).toString('utf8'));
  assert.equal(p.ships, 0, 'no ship without the galley technology');
  assert(cx.model.unlockedOf.get(tag('Lerendor')).subs.size < model.unlockedOf.get(tag('Lerendor')).subs.size);
});
function parseOobFrom(t) {
  const e = parse(t), units = field(e, 'units') ?? [];
  return { divisions: all(units, 'division').length, ships: all(units, 'fleet').flatMap(f => all(f.v, 'task_force')).flatMap(tf => all(tf.v, 'ship')).length };
}
test('The report lists every country with its divisions, ships and stock, and the AI coverage', () => {
  const r = JSON.parse(text(FILES.report));
  assert.equal(Object.keys(r.countries).length, 305);
  assert.equal(r.divisions, summary.divisions);
  for (const c of countries) { const row = r.countries[c.tag]; assert.equal(row.divisions, parsed.get(c.tag).divisions.length); assert.equal(Object.values(row.ships).reduce((a, b) => a + b, 0), parsed.get(c.tag).ships.length); }
  assert.equal(r.aiTemplateCoverage.men.infantry, 'zin_ai_men_infantry');
  assert.equal(Object.keys(r.aiTemplateCoverage).length, 11);
  assert.deepEqual(r.designGroups, raw0.ai.designs.groups.map(g => g.id));
});
test('A role a country keeps in its ratio always has a target it may use: gated roles are cancelled for tier C', () => {
  const land = new Map(blocksOf(FILES.land).map(b => [b.k, b]));
  let gated = 0;
  for (const e of raw0.ai.entries) {
    const ratio = raw0.ai.ratios[e.people][e.role];
    const allGated = e.targets.every(t => (t.enable ?? []).includes('not_tier_c'));
    if (ratio > 0 && !allGated) assert(e.targets.some(t => !(t.enable ?? []).length), `${e.people}/${e.role}: a target without a condition`);
    if (ratio > 0 && allGated) {
      gated++;
      const b = land.get(`zin_default_land_${e.people.replace('country:', '').toLowerCase()}_tier_c`);
      assert(b, `${e.people}: a tier C block`);
      assert(all(b.v, 'ai_strategy').some(s => field(s.v, 'id') === e.role && Number(field(s.v, 'value')) === -ratio), `${e.people}/${e.role} is cancelled for tier C`);
      assert(JSON.stringify(field(b.v, 'enable')).includes('zin_ai_is_tier_c'));
    }
  }
  assert(gated >= 4, `${gated} gated roles`);
  assert(raw0.ai.entries.find(e => e.people === 'orcs' && e.role === 'armor').targets[0].enable === undefined, 'orc brutes have no technology gate');
});
