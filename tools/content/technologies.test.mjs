// Tests for the technology, doctrine and research-sharing module (docs/specs/03_gameplay/07_industry_and_electronics_techs.md,
// 01_warfare.md sections 11 to 13, 09_naval_air_doctrines.md, 03_diplomacy_and_factions.md). They use only builder output: a
// Staged set built from the roster (lib/roster.mjs). Negative tests plant a bad row in a copy of the data and expect the
// module to refuse it.
import test from 'node:test';
import { countryTable, successor } from './lib/roster.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { parse, scriptText } from './lib/clausewitz.mjs';
import { ZIN } from './lib/paths.mjs';
import { buildTechnologies, prepareModel, loadRaw, technologyPackages, startFor, parseWho, vanillaNames, gameDocs, FOLDER_FILES, DOCTRINE_FILES, technologyIconKeys, doctrineIconKeys, UNIT_STATS, mandatory, FOURTH_AGE_FROM } from './modules/technologies.mjs';
import { bandY, ruleCost, layoutFolders, folderGeometry, tileRect, ORIGIN, ITEM } from './lib/tech_layout.mjs';
import { folderGridboxes } from './lib/tech_tree_gui.mjs';
import { allowanceCovers } from './lib/banned.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const countries = countryTable();
// The realm that took a retired row's role (the spec tables were written for the old roster: Volgan is Puvulan, Zol is Zol's Mistake).
const heir = name => countries.find(c => c.key === successor(name).primary).name;
const ZOL = heir('Zol'), VOLGAN = heir('Volgan');
const banned = JSON.parse(await readFile(path.join(here, 'data/banned_words.json'), 'utf8'));
const bannedRules = banned.rules.map(r => ({ ...r, re: new RegExp(`(?<![\\p{L}\\p{N}'])(?:${r.pattern})(?![\\p{L}\\p{N}'])`, r.caseSensitive ? 'u' : 'iu') }));
const staged = new Staged();
const summary = await buildTechnologies(staged, { countries });
const raw0 = await loadRaw();
const clone = () => structuredClone(raw0);
const model = await prepareModel({ countries }, clone());
const file = rel => { const b = staged.files.get(rel); assert(b, `staged file ${rel}`); return b.toString('utf8'); };
const rejects = async (mutate, pattern) => { const raw = clone(); mutate(raw); await assert.rejects(prepareModel({ countries }, raw), pattern); };
const civil = t => raw0.civil.technologies.find(x => x.key === t);
const techFiles = Object.values(FOLDER_FILES).map(f => `common/technologies/${f}`);
const allTechText = () => [...techFiles, 'common/technologies/zin_gates.txt'].map(file).join('\n');
const doctrineText = () => Object.values(DOCTRINE_FILES).map(file).join('\n');
const bannedHits = text => bannedRules.filter(r => r.severity === 'error' && r.re.test(text.normalize('NFKC'))).map(r => r.id);
const locEntries = rel => { const out = new Map(); for (const line of file(rel).split('\n')) { const m = line.match(/^ ([A-Za-z0-9_.\-]+):\d+ "(.*)"$/); if (m) out.set(m[1], m[2]); } return out; };
const allLoc = () => new Map([...locEntries('localisation/english/zin_technologies_l_english.yml'), ...locEntries('localisation/replace/zin_technologies_l_english.yml')]);

// ---------- counts and files ----------
test('The build stages every file the spec names and counts what it generates', () => {
  assert.equal(summary.technologies, 82 + 197, 'the 82 civilian rows and warfare\'s 197 (nine of them black powder, K19; K51 added 54 rows, K58 the 47 way technologies and Hold Engineers)');
  assert.equal(summary.gates, 7);
  assert.equal(summary.folders, 13);
  assert.equal(summary.categories, 27);
  assert.equal(summary.grandDoctrines, 15);
  assert.equal(summary.subdoctrines, 37, '36 plus the hidden special-forces subdoctrine');
  assert.equal(summary.tracks, 11, '4 land, 4 naval, 2 air and the hidden track');
  for (const rel of [...techFiles, 'common/technologies/zin_gates.txt', 'common/technology_tags/zin_technology_tags.txt', 'common/ai_focuses/zin_ai_focuses.txt', 'common/technology_sharing/zin_tech_sharing.txt', 'common/scripted_triggers/zin_technologies.txt', 'common/scripted_effects/zin_naval_air.txt', ...Object.values(DOCTRINE_FILES), 'localisation/english/zin_technologies_l_english.yml', 'docs/design/technology/layout.json', 'docs/design/technology/start_packages.json']) assert(staged.files.has(rel), rel);
});

test('Folder files hold the counts of the spec: 59 craft, 23 letters, 55 arms, 31 mounts, 27 engines, 22 lore, 25 camp, 30 naval, 7 skies', () => {
  const count = f => (file(`common/technologies/${f}`).match(/^\tzin_tech_[a-z0-9_]+ = \{$/gm) ?? []).length;
  assert.deepEqual(Object.fromEntries(Object.entries(FOLDER_FILES).map(([k, f]) => [k, count(f)])), { zin_arms_folder: 55, zin_mounts_folder: 31, zin_engines_folder: 27, zin_lore_folder: 22, zin_camp_folder: 25, zin_naval_folder: 30, zin_skies_folder: 7, industry_folder: 59, electronics_folder: 23 });
  assert.equal(count('zin_gates.txt'), 7);
});

test('Every technology key is a zin_tech_ key and no vanilla technology, folder or doctrine key is reused', async () => {
  const vanilla = await vanillaNames();
  const keys = [...allTechText().matchAll(/^\t(zin_tech_[a-z0-9_]+) = \{$/gm)].map(m => m[1]);
  assert.equal(keys.length, 279 + 7);
  assert.equal(new Set(keys).size, keys.length, 'unique');
  for (const k of keys) assert(!vanilla.techs.has(k), k);
  const tags = file('common/technology_tags/zin_technology_tags.txt');
  const folderKeys = [...tags.slice(tags.indexOf('technology_folders')).matchAll(/^\t([a-z_]+) = \{$/gm)].map(m => m[1]);
  assert.equal(folderKeys.length, 13);
  for (const k of folderKeys) assert(!vanilla.folders.has(k) || ['industry_folder', 'electronics_folder', 'land_doctrine_folder', 'naval_doctrine_folder', 'air_doctrine_folder', 'special_forces_doctrine_folder'].includes(k), k);
  for (const k of [...doctrineText().matchAll(/^(zin_[a-z_]+) = \{$/gm)].map(m => m[1])) assert(!vanilla.doctrines.has(k), k);
});

// ---------- the spec tables are the data ----------
const SPEC = path.join(ZIN, 'docs/specs/03_gameplay/07_industry_and_electronics_techs.md');
const WARSPEC = path.join(ZIN, 'docs/specs/03_gameplay/01_warfare.md');
const tableRows = (md, startHeading, endHeading) => {
  const start = md.indexOf(startHeading), end = md.indexOf(endHeading, start + 1);
  assert(start >= 0 && end > start, `${startHeading} in the spec`);
  return md.slice(start, end).split('\n').filter(l => l.startsWith('| `')).map(l => l.split('|').slice(1, -1).map(c => c.trim()));
};
const LINE_KEYS = { 'The Lake Crowns': 'way_lake_crowns', 'River and Road Cities': 'way_merchants', 'Hearth and Holt': 'way_hearth', 'The Warrens': 'way_warrens', Masonry: 'masonry', Mining: 'mining', 'Guild Methods': 'guild_methods', 'Granaries and Fields': 'granaries', 'Great Halls': 'great_halls', 'Village Forges': 'village_forges', Shipwrights: 'shipwrights', 'Essence-Craft': 'essence_craft', "Peoples' Crafts": 'peoples_crafts', Scholarship: 'scholarship', Seals: 'seals', Codes: 'codes', 'Beacon Craft': 'beacon_craft' };
const RENAMED = { lime_mortar: 'Slaked Lime', division_of_labour: 'Many Hands' };
const strip = s => s.replace(/`/g, '');
const keyList = s => (s === '-' ? [] : s.split(',').map(x => strip(x).trim()));

test('Spec 4.2 and 4.3: the tables equal the data field by field (name, line, slot, year, cost, parents, exclusion, effects, unlocks, who, kind)', async () => {
  const md = await readFile(SPEC, 'utf8');
  const rows = [...tableRows(md, '#### 4.2 Craft and Works', '#### 4.3'), ...tableRows(md, '#### 4.3 Letters and Beacons', '### 5. Layout rules')];
  assert.equal(rows.length, 82);
  const tiles = new Map(Object.values(model.layout.folders).flatMap(f => f.tiles.map(t => [t.key, t])));
  const DWARF_HOLDS = ['Kunhrim', 'Hrakbrund', 'Brundahrim', 'Gromkerm'].map(country => ({ country }));
  for (const [key, name, line, pos, year, cost, pth, needs, xor, effects, unlocks, who, kind] of rows) {
    const k = strip(key), t = model.byKey.get(`zin_tech_${k}`);
    assert(t, `${k} is in the data`);
    assert.equal(t.name, RENAMED[k] ?? name, `${k} name`);
    assert.equal(t.line, LINE_KEYS[line], `${k} line`);
    const [x, y] = pos.split(',').map(Number), tile = tiles.get(t.key);
    assert.deepEqual([tile.x, tile.y], [x, y], `${k} slot`);
    assert.equal(t.year, Number(year), `${k} year`);
    assert.equal(t.cost, Number(cost), `${k} cost`);
    assert.equal(t.all, / \(all\)$/.test(pth), `${k} AND or OR`);
    assert.equal(t.lost, kind === 'lost', `${k} lost knowledge`);
    assert.deepEqual(t.requires.map(r => r.slice(9)), keyList(pth.replace(/ \(all\)$/, '')), `${k} path`);
    assert.deepEqual(t.needs.map(r => r.slice(9)), keyList(needs), `${k} needs`);
    assert.deepEqual(t.xor.map(r => r.slice(9)), keyList(xor), `${k} xor`);
    const mods = effects === '-' ? {} : Object.fromEntries(effects.split(';').map(e => e.trim().split(' ')).map(([m, v]) => [m, Number(v)]));
    assert.deepEqual(t.modifiers, mods, `${k} effects`);
    const buildings = unlocks.startsWith('radar_station') ? [{ building: 'radar_station', level: Number(unlocks.match(/L(\d+)/)[1]) }] : [];
    assert.deepEqual(t.unlocks.buildings ?? [], buildings, `${k} unlocks`);
    const whoWant = who === 'all' ? [] : who.split(',').map(w => w.trim()).flatMap(w => (w === 'Volgan' ? [{ country: VOLGAN }] : w === 'dwarf holds' ? DWARF_HOLDS : w.startsWith('way:') ? [{ way: w.slice(4) }] : [{ people: w }]));
    assert.deepEqual(t.whoOwn, whoWant, `${k} who`);
  }
});

test('Warfare spec section 11: every row has its technology with the same name and year', async () => {
  const md = await readFile(WARSPEC, 'utf8');
  const rows = tableRows(md, '#### 11.1 Arms and Armour', '### 12. Doctrines').filter(r => !r[0].includes(' to '));
  assert.equal(rows.length, 197 - 3, '197 technologies (nine black powder, 11.8; 41 added by owner decision K51, 33 way technologies by K58); the three deathless tide rows are one spec row');
  const NAME_FIX = { zin_tech_forged_steel: 'Forged Iron', zin_tech_tempered_steel: 'Tempered Iron', zin_tech_mountain_steel: 'Mountain Iron', zin_tech_leaf_steel: 'Leaf-Forging', zin_tech_veteran_sergeants: 'Veteran File-Leaders', zin_tech_camel_corps: 'Camel Host', zin_tech_engine_corps: 'Engine Crews' };
  for (const r of rows) {
    const k = strip(r[0]), t = model.byKey.get(k), year = Number(r[2]);
    assert(t, `${k} is in the data`);
    if (k !== 'zin_tech_bound_demons') assert.equal(t.name, NAME_FIX[k] ?? r[1], `${k} name`);
    if (Number.isFinite(year)) assert.equal(t.year, year, `${k} year`);
    // The Requires column names the path parents (with "(all)" for an AND) and then the needs, comma-separated.
    const want = r[3].startsWith('-') ? [] : r[3].replace(/ \(all\)/, '').split(',').map(x => strip(x).trim().replace(/;.*$/, ''));
    assert.deepEqual([...t.requires, ...t.needs].map(x => x.slice(9)).sort(), want.map(x => x.replace(/^zin_tech_/, '')).sort(), `${k} requires`);
  }
  for (const n of [1, 2, 3]) assert(model.byKey.get(`zin_tech_deathless_tide_${n}`), `tide ${n}`);
});

// ---------- rules every technology obeys ----------
test('Years, costs and rows follow the bands and the cost rule; no two tiles share a slot and every root has a gridbox', () => {
  assert.equal(bandY(10, model.bands), 0, 'the Third Age');
  assert.equal(bandY(99, model.bands), 2, 'the late Third Age');
  assert.equal(bandY(300, model.bands), 4, 'the early Fourth Age');
  assert.equal(bandY(1748, model.bands), 14);
  assert.equal(bandY(1745, model.bands), 12);
  assert.equal(bandY(1790, model.bands), 30);
  assert.equal(ruleCost(1745, model.costRule), 1.5);
  assert.equal(ruleCost(1746, model.costRule), 2);
  assert.equal(ruleCost(1761, model.costRule), 2.5);
  assert.equal(ruleCost(1776, model.costRule), 3);
  assert.equal(ruleCost(40, model.costRule, true), 2, 'lost knowledge');
  const seen = new Set();
  for (const [folder, f] of Object.entries(model.layout.folders)) {
    for (const tile of f.tiles) { const id = `${folder}:${tile.x},${tile.y}`; assert(!seen.has(id), `slot ${id}`); seen.add(id); }
    const roots = f.tiles.filter(t => t.root === t.key).map(t => `${t.key}_tree`).sort();
    assert.deepEqual(f.gridboxes.map(g => g.name).sort(), roots, `${folder} gridboxes`);
    assert(f.gridboxes.every(g => g.px === ORIGIN.x && g.py === ORIGIN.y), `${folder}: every gridbox sits at the folder origin`);
  }
  for (const t of model.techs) {
    assert(t.year >= 1 && t.year <= 1800, t.key);
    if (!t.costExplicit) assert.equal(t.cost, ruleCost(t.year, model.costRule, t.lost), t.key);
    if (t.costExplicit && t.source === 'warfare') assert.fail(`${t.key} overrides the cost rule`);
    for (const p of t.requires) assert(bandY(model.byKey.get(p).year, model.bands) < bandY(t.year, model.bands), `${t.key} sits below its path parent`);
  }
});

const XOR_PAIRS = [['great_halls', 'village_forges'], ['pattern_books', 'masters_benches'], ['heavy_harness', 'light_harness'], ['pike_squares', 'sword_and_buckler'], ['blackened_iron', 'goblin_swarms'], ['couched_lance', 'light_horse'], ['engine_corps', 'field_engine_trains'], ['old_songs', 'hunt_songs'], ['winter_quarters', 'water_caravans'], ['fire_ships', 'bronze_rams'], ['sky_lances', 'far_eyries']];
test('Exclusive pairs are written on both sides, and the exclusive roots are never starting knowledge', () => {
  const text = allTechText();
  assert.equal(model.techs.filter(t => t.xor.length).length, XOR_PAIRS.length * 2, 'every exclusive technology is in the list');
  for (const [a, b] of XOR_PAIRS) {
    assert(new RegExp(`zin_tech_${a} = \\{[^]*?XOR = \\{ zin_tech_${b} \\}`).test(text), `${a} excludes ${b}`);
    assert(new RegExp(`zin_tech_${b} = \\{[^]*?XOR = \\{ zin_tech_${a} \\}`).test(text), `${b} excludes ${a}`);
  }
  const packages = technologyPackages(model);
  for (const [key, p] of Object.entries(packages)) for (const k of p.technologies) assert.equal(model.byKey.get(`zin_tech_${k}`).xor.length, 0, `${key} grants the exclusive root ${k}`);
});

test('The Great Library adds a research slot only below five, and only a realm below five can research it', () => {
  const block = allTechText().match(/zin_tech_great_library = \{[^]*?\n\t\}/)[0];
  assert(/on_research_complete_limit = \{\s+amount_research_slots < 5\s+\}/.test(block));
  assert(/on_research_complete = \{\s+add_research_slot = 1\s+\}/.test(block));
  assert(/allow = \{\s+amount_research_slots < 5\s+\}/.test(block));
  assert.equal([...allTechText().matchAll(/add_research_slot/g)].length, 1, 'no other technology adds a slot');
});

test('The seven gate technologies are grant-only, list their building at level 1, and no other technology lists a locked building', () => {
  const gates = file('common/technologies/zin_gates.txt');
  const blocks = [...gates.matchAll(/\t(zin_tech_gate_[a-z_]+) = \{([^]*?)\n\t\}/g)];
  assert.equal(blocks.length, 7);
  const want = new Set(['rocket_site', 'mega_gun_emplacement', 'nuclear_reactor', 'nuclear_reactor_heavy_water', 'commercial_nuclear_reactor', 'fuel_silo', 'synthetic_refinery']);
  for (const [, key, body] of blocks) {
    assert(/allow = \{\s+always = no\s+\}/.test(body), `${key} allow`);
    assert(!/folder = /.test(body), `${key} has no folder`);
    assert(/level = 1/.test(body));
    want.delete(body.match(/building = ([a-z_]+)/)[1]);
  }
  assert.equal(want.size, 0, 'each locked building has one gate');
  for (const f of techFiles) for (const b of ['rocket_site', 'mega_gun_emplacement', 'nuclear_reactor', 'fuel_silo', 'synthetic_refinery', 'commercial_nuclear_reactor']) assert(!file(f).includes(`building = ${b}`), `${f} lists ${b}`);
  const tied = allTechText().match(/building = (radar_station|anti_air_building|stronghold_network|air_base)/g);
  assert(tied.length >= 9, 'beacon craft, scorpions, curtain walls and the eyries unlock the others');
});

test('People-restricted rows carry allow_branch with the people wrappers; Zol sees none of the craft rows but its own tide', () => {
  const text = allTechText();
  assert(/zin_tech_leaf_craft = \{[^]*?allow_branch = \{\s+zin_tech_not_zol = yes\s+OR = \{\s+zin_tech_people_elves = yes\s+zin_tech_people_sun_elves = yes/.test(text));
  assert(new RegExp(`zin_tech_vent_forges = \\{[^]*?original_tag = ${model.tags.get(VOLGAN)}`).test(text), 'Puvulan (the Volgan row) is matched by tag, never by people');
  const zol = model.tags.get(ZOL);
  assert(new RegExp(`zin_tech_deathless_tide_1 = \\{[^]*?allow_branch = \\{\\s+original_tag = ${zol}\\s+\\}`).test(text));
  for (const t of model.techs.filter(x => !x.requires.length && x.key !== 'zin_tech_deathless_tide_1')) {
    const block = text.match(new RegExp(`\\t${t.key} = \\{[^]*?\\n\\t\\}`))[0];
    assert(/zin_tech_not_zol = yes/.test(block), `${t.key} hides itself from Zol`);
  }
  assert(/zin_tech_bound_demons = \{[^]*?allow = \{\s+always = no\s+\}[^]*?has_global_flag = zin_afrit_revealed/.test(text), 'bound demons stay hidden until the reveal');
  assert(/zin_tech_hallowed_arms = \{[^]*?has_global_flag = zin_zol_rising/.test(text));
});

test('The Eyries folder and the griffin rows are gated by the sky rule, and scorpions are hidden when the sky is off', () => {
  const tags = file('common/technology_tags/zin_technology_tags.txt');
  assert(/zin_skies_folder = \{\s+ledger = air\s+available = \{\s+zin_rules_skies_present = yes/.test(tags));
  assert(/air_doctrine_folder = \{[^]*?zin_rules_skies_present = yes/.test(tags));
  assert(/special_forces_doctrine_folder = \{\s+ledger = hidden\s+doctrine = yes\s+available = \{\s+always = no/.test(tags));
  const sky = file('common/technologies/zin_skies.txt');
  assert(/zin_tech_eyries = \{[^]*?zin_rules_skies_beasts = yes/.test(sky));
  assert(/zin_tech_dragon_lore = \{[^]*?zin_rules_skies_present = yes/.test(sky));
  assert(/zin_tech_scorpions = \{[^]*?zin_rules_skies_present = yes/.test(file('common/technologies/zin_engines.txt')));
  const trig = file('common/scripted_triggers/zin_technologies.txt');
  for (const t of ['zin_rules_skies_present', 'zin_rules_skies_beasts', 'zin_tech_not_zol', 'zin_tech_people_men', 'zin_tech_people_the_dead']) assert(trig.includes(`${t} = {`), t);
});

test('The tag file defines all categories, every category a technology names, and every category appears in an AI focus', () => {
  const tags = file('common/technology_tags/zin_technology_tags.txt');
  const cats = new Set(tags.slice(0, tags.indexOf('technology_folders')).split('\n').filter(l => /^\t[a-z_]+$/.test(l)).map(l => l.trim()));
  assert.equal(cats.size, 27, '26 and the advanced-learning category of K58');
  for (const c of ['zin_cat_arms', 'zin_cat_granaries', 'zin_cat_yards', 'zin_cat_essence_craft', 'zin_cat_scholarship', 'zin_cat_seals', 'zin_cat_beacons', 'industry', 'construction_tech', 'excavation_tech', 'land_doctrine', 'naval_doctrine', 'air_doctrine', 'special_forces_doctrine']) assert(cats.has(c), c);
  for (const m of allTechText().matchAll(/categories = \{ ([a-z_ ]+) \}/g)) for (const c of m[1].split(' ')) assert(cats.has(c), `category ${c}`);
  const ai = file('common/ai_focuses/zin_ai_focuses.txt');
  for (const c of cats) assert(new RegExp(`\\t\\t${c} = `).test(ai), `${c} is in an AI focus`);
  assert.equal([...ai.matchAll(/^ai_focus_[a-z_]+ = \{$/gm)].length, 9, 'the nine engine focuses');
  for (const vanillaCat of ['infantry_weapons', 'armor', 'nuclear', 'radar_tech', 'electronics', 'encryption_tech', 'mio_cat_artillery', 'rocketry', 'cat_fortification']) assert(!cats.has(vanillaCat), vanillaCat);
});

// ---------- modifiers, unit blocks and the deathless invariant ----------
test('Every modifier and trigger the files use exists in the installed documentation', async () => {
  const docs = await gameDocs();
  for (const t of model.techs) for (const m of Object.keys(t.modifiers)) assert(docs.modifiers.has(m), `${t.key}: ${m}`);
  for (const k of ['local_resources_steel_factor', 'local_resources_oil_factor', 'country_resource_oil', 'production_speed_dockyard_factor', 'bunker_max_level_terrain_limit', 'repair_speed_naval_base_factor']) assert(docs.modifiers.has(k), `family member ${k}`);
  for (const d of [...model.doctrines.grand.flatMap(g => [g.act, ...g.milestones]), ...model.doctrines.subs.flatMap(s => [s.act, ...s.rewards])]) for (const m of Object.keys(d.modifiers ?? {})) assert(docs.modifiers.has(m), m);
});

test('Deathless invariant: no technology or doctrine writes piercing (ap_attack), and every unit stat is a known stat', () => {
  assert(!/ap_attack/.test(allTechText()));
  assert(!/ap_attack/.test(doctrineText()));
  assert(!UNIT_STATS.has('ap_attack'));
  for (const text of [allTechText(), doctrineText()]) for (const e of parse(text)) { const walk = (es, depth) => { for (const x of es) if (Array.isArray(x.v)) { if (depth >= 2 && x.k && /^(category_|zin_)/.test(x.k)) for (const s of x.v) if (s.k && !Array.isArray(s.v)) assert(UNIT_STATS.has(s.k), `${x.k}: ${s.k}`); walk(x.v, depth + 1); } }; walk([e], 0); }
});

// ---------- start packages ----------
test('Every roster country has a closed start package; none grants an exclusive root, a wrong-people row, or anything to Zol beyond its own', () => {
  const packages = technologyPackages(model);
  assert.equal(Object.keys(packages).length, 15);
  for (const [key, p] of Object.entries(packages)) {
    const set = new Set(p.technologies);
    for (const k of p.technologies) {
      const t = model.byKey.get(`zin_tech_${k}`);
      assert(t, `${key}: ${k} exists`);
      for (const pre of [...t.needs, ...(t.all ? t.requires : [])]) assert(set.has(pre.slice(9)), `${key}: ${k} lacks its prerequisite ${pre}`);
      if (!t.all && t.requires.length) assert(t.requires.some(pre => set.has(pre.slice(9))), `${key}: ${k} holds none of its path parents`);
      assert(!t.lost, `${key}: grants the lost knowledge ${k}`);
      assert(!t.locked || key === 'mistake', `${key}: grants a locked row ${k}`);
    }
  }
  assert.deepEqual(packages.mistake.technologies, ['corsair_craft', 'deathless_tide_1', 'oared_galleys', 'war_galleys']);
  const starts = JSON.parse(file('docs/design/technology/start_packages.json')).countries;
  assert.equal(Object.keys(starts).length, countries.length);
  for (const c of countries) { const s = starts[c.name]; assert(s && s.package && s.technologies.length > 0, `${c.name} has a package`); assert(s.landGrandDoctrine, `${c.name} has a land grand doctrine`); }
  assert.equal(starts.Aenor.landGrandDoctrine, 'zin_gd_shield_wall');
  assert.equal(starts.Aenor.navalGrandDoctrine, 'zin_gd_command_of_the_sea');
  assert.equal(starts.Aenor.navalSubDoctrine, 'zin_sub_line_of_battle');
  assert.equal(starts[ZOL].navalGrandDoctrine, 'zin_gd_corsair_fleets');
  assert.equal(starts[VOLGAN].landGrandDoctrine, 'zin_gd_grave_muster');
  assert.equal(starts.Goldoroth.landGrandDoctrine, 'zin_gd_warband');
  assert(starts.Goldoroth.technologies.includes('ogre_pacts'));
  for (const c of countries) { const s = starts[c.name]; if (c.name !== ZOL) assert(!s.technologies.includes('deathless_tide_1'), `${c.name} must not hold the deathless tide`); if (s.people !== 'elves' && s.people !== 'sun_elves') assert(!s.technologies.includes('dragon_lore'), `${c.name} must not start with dragon lore`); }
  assert(!JSON.stringify(starts).includes('great_halls') && !JSON.stringify(starts).includes('village_forges'));
});

test('The people of a package never reach a row restricted to another people', () => {
  const packages = technologyPackages(model);
  const rowPeople = k => model.byKey.get(`zin_tech_${k}`).who;
  for (const [key, p] of Object.entries(packages)) for (const k of p.technologies) {
    const who = rowPeople(k);
    if (!who.length) continue;
    assert(who.some(c => (!c.people || c.people === p.profile.people) && (!c.country || c.country === p.profile.country) && !c.region), `${key}: ${k} is not open to ${JSON.stringify(p.profile)}`);
  }
  assert(!packages.concord.technologies.includes('leaf_steel'));
  assert(!packages.elves.technologies.includes('forge_pits'));
  assert(packages.dominion.technologies.includes('grave_binding') && !packages.concord.technologies.includes('grave_binding'));
});

// ---------- doctrines ----------
test('Doctrine counts: 10 land, 3 naval and 2 air grand doctrines, 4 land and 4 naval and 2 air tracks, 20 + 12 + 4 subdoctrines with three rewards', () => {
  const d = model.doctrines;
  const byFolder = f => d.grand.filter(g => g.folder === f).length;
  assert.deepEqual([byFolder('land'), byFolder('naval'), byFolder('air')], [10, 3, 2]);
  const tracks = f => d.tracks.filter(t => t.folder === f).length;
  assert.deepEqual([tracks('land'), tracks('naval'), tracks('air'), tracks('special_forces')], [4, 4, 2, 1]);
  const subs = f => d.subs.filter(s => s.folder === f).length;
  assert.deepEqual([subs('land'), subs('naval'), subs('air')], [20, 12, 4]);
  for (const s of [...d.subs, d.hidden]) assert.equal(s.rewards.length, 3, s.key);
  for (const g of d.grand) assert.equal(g.milestones.length, g.tracks.length, `${g.key} milestones`);
  const text = file(DOCTRINE_FILES.grand);
  assert.equal([...text.matchAll(/^zin_gd_[a-z_]+ = \{$/gm)].length, 15);
  for (const f of ['land', 'naval', 'air', 'special_forces']) assert(parse(scriptText(staged.files.get(DOCTRINE_FILES[f]))).length > 0, `${f} subdoctrine file has a definition`);
});

test('Doctrine objects resolve: tracks, folders, subdoctrine tracks, XOR pairs, and the third reward needs 150 mastery', () => {
  const d = model.doctrines, tracks = new Set(d.tracks.map(t => t.key));
  for (const g of d.grand) for (const t of g.tracks) assert(tracks.has(t), `${g.key}: ${t}`);
  for (const s of d.subs) assert(d.grand.some(g => g.tracks.includes(s.track)), `${s.key}: ${s.track} is in a grand doctrine`);
  assert(tracks.has(d.hidden.track));
  const corsair = d.subs.find(s => s.key === 'zin_sub_corsair_packs'), cog = d.subs.find(s => s.key === 'zin_sub_cog_escorts');
  assert.deepEqual([corsair.xor, cog.xor], [['zin_sub_cog_escorts'], ['zin_sub_corsair_packs']]);
  const text = doctrineText();
  assert.equal([...text.matchAll(/\n\t\t\tmastery = 150/g)].length, 37, 'one third reward per subdoctrine');
  assert(/zin_track_hidden_special = \{[^]*?active = \{\s+always = no/.test(file(DOCTRINE_FILES.tracks)));
  assert(/zin_sub_hidden_special_forces = \{[^]*?visible = \{\s+always = no/.test(file(DOCTRINE_FILES.special_forces)));
  assert(/special_forces = \{\s+allowed = \{\s+always = no/.test(file(DOCTRINE_FILES.folders)));
  assert(/air = \{\s+allowed = \{\s+zin_rules_skies_present = yes/.test(file(DOCTRINE_FILES.folders)));
  assert(/zin_track_sea_lanes = \{[^]*?sub_units = \{ zin_ship_galley zin_ship_raider \}/.test(file(DOCTRINE_FILES.tracks)), 'sea lanes draw on galleys and raiders, not convoys');
});

test('Each people sees a land grand doctrine, only Zol sees the Deathless Tide, only Volgan the Grave Muster, and Zol sees only the Corsair Fleets at sea', () => {
  const d = model.doctrines.grand;
  const sees = (g, profile) => {
    const who = g.whoClauses;
    const ok = !who.length || who.some(c => (!c.people || c.people === profile.people) && (!c.country || c.country === profile.country));
    return ok && !g.hideForClauses.some(c => c.country === profile.country);
  };
  for (const people of ['men', 'elves', 'sun_elves', 'orcs', 'trolls', 'giants', 'ents', 'yeti', 'demons']) assert(d.some(g => g.folder === 'land' && sees(g, { people })), `${people} sees a land doctrine`);
  assert.deepEqual(d.filter(g => g.folder === 'land' && sees(g, { people: 'the_dead', country: ZOL })).map(g => g.key), ['zin_gd_deathless_tide']);
  assert.deepEqual(d.filter(g => g.folder === 'land' && sees(g, { people: 'the_dead', country: VOLGAN })).map(g => g.key), ['zin_gd_grave_muster']);
  assert.deepEqual(d.filter(g => g.folder === 'naval' && sees(g, { people: 'the_dead', country: ZOL })).map(g => g.key), ['zin_gd_corsair_fleets']);
  assert.equal(d.filter(g => g.folder === 'naval' && sees(g, { people: 'men', country: 'Aenor' })).length, 3);
  const text = file(DOCTRINE_FILES.grand);
  assert(/zin_gd_griffin_eyries = \{[^]*?zin_rules_skies_beasts = yes/.test(text), 'griffin doctrine only under beasts');
  assert(new RegExp(`zin_gd_deathless_tide = \\{[^]*?original_tag = ${model.tags.get(ZOL)}`).test(text));
});

test('zin_inst_air_start sets the first air doctrine only when the receiver has none and costs no experience', () => {
  const fx = file('common/scripted_effects/zin_naval_air.txt');
  assert(/NOT = \{ has_any_grand_doctrine = air \}/.test(fx));
  assert(/set_grand_doctrine = zin_gd_wings_of_the_mountain/.test(fx) && /set_sub_doctrine = zin_sub_fire_from_above/.test(fx));
  assert(/set_grand_doctrine = zin_gd_griffin_eyries/.test(fx) && /air_experience = 50/.test(fx));
});

// ---------- sharing ----------
test('Research sharing: one group per faction at 0.10 per member, tied to the faction leader tags, plus a faction group for the rest', () => {
  const text = file('common/technology_sharing/zin_tech_sharing.txt');
  assert.equal([...text.matchAll(/^technology_sharing_group = \{$/gm)].length, 8);
  for (const [name, id] of [['Aenor', 'zin_research_concord'], ['Lerendor', 'zin_research_leren_compact'], ['Coldor', 'zin_research_northern_accord'], ['Noris', 'zin_research_noris_treaty'], ['Stabilo', 'zin_research_stabilo_pact'], ['Dondor', 'zin_research_dark_sea_accord'], [VOLGAN, 'zin_research_southern_dominion']])
    assert(new RegExp(`id = ${id}\\n[^]*?research_sharing_per_country_bonus = 0\\.1\\n\\tavailable = \\{\\s+is_in_faction_with = ${model.tags.get(name)}`).test(text), id);
  assert(/id = zin_research_leagues[^]*?is_faction_sharing = yes/.test(text));
  const fx = file('common/scripted_effects/zin_technologies.txt');
  assert.equal([...fx.matchAll(/add_to_tech_sharing_group = /g)].length, 8);
  assert(/on_monthly = \{\s+effect = \{\s+zin_tech_sharing_sync = yes/.test(file('common/on_actions/zin_technologies.txt')));
});

test('With externalSharing the diplomacy groups own the group file and text; the sync effect only adds members by league template', async () => {
  const s2 = new Staged();
  const external = [{ id: 'zin_research_concord', template: 'zin_faction_concord' }, { id: 'zin_research_free_crowns', template: 'zin_faction_free_crowns' }];
  const r = await buildTechnologies(s2, { countries, externalSharing: external });
  assert.equal(r.sharingGroups, 2);
  assert(!s2.files.has('common/technology_sharing/zin_tech_sharing.txt'), 'no group file');
  const fx = s2.files.get('common/scripted_effects/zin_technologies.txt').toString('utf8');
  for (const g of external) assert(fx.includes(`has_faction_template = ${g.template}`) && fx.includes(`add_to_tech_sharing_group = ${g.id}`), g.id);
  assert.equal([...fx.matchAll(/add_to_tech_sharing_group = /g)].length, 2);
  assert(!/zin_research_/.test(s2.files.get('localisation/english/zin_technologies_l_english.yml').toString('utf8')), 'no group text');
  assert(/zin_tech_sharing_sync = \{/.test(fx));
});

// ---------- text ----------
test('Every key has text: technologies, gates, folders, categories, doctrines, rewards, tracks, sharing groups; the file is UTF-8 with BOM', () => {
  const loc = allLoc();
  for (const t of model.techs) { assert(loc.get(t.key), t.key); assert(loc.get(`${t.key}_desc`), `${t.key}_desc`); }
  for (const g of model.gates) assert(loc.get(g.key) && loc.get(`${g.key}_desc`), g.key);
  for (const f of model.folders.keys()) assert(loc.get(f) && loc.get(`${f}_desc`), f);
  for (const c of model.categories.keys()) assert(loc.get(c) && loc.get(`${c}_research`), c);
  const d = model.doctrines;
  for (const g of d.grand) assert(loc.get(g.key) && loc.get(`${g.key}_desc`), g.key);
  for (const s of [...d.subs, d.hidden]) { assert(loc.get(s.key) && loc.get(`${s.key}_desc`), s.key); for (const r of s.rewards) assert(loc.get(`${s.key}_${r.key}`) && loc.get(`${s.key}_${r.key}_desc`), `${s.key}_${r.key}`); }
  for (const t of d.tracks) assert(loc.get(t.key), t.key);
  for (const y of Object.keys(model.bandCaptions)) assert(loc.get(`zin_techtree_year_${y}`), `year caption ${y}`);
  for (const rel of ['localisation/english/zin_technologies_l_english.yml', 'localisation/replace/zin_technologies_l_english.yml']) { const b = staged.files.get(rel); assert.deepEqual([...b.subarray(0, 3)], [0xef, 0xbb, 0xbf], `${rel} BOM`); assert(b.toString('utf8').startsWith('﻿l_english:')); }
  const own = locEntries('localisation/english/zin_technologies_l_english.yml'), repl = locEntries('localisation/replace/zin_technologies_l_english.yml');
  for (const k of own.keys()) assert(!repl.has(k), `${k} is in both files`);
  assert(repl.has('industry') && repl.has('land_doctrine_folder'), 'kept engine keys go to localisation/replace');
});

test('No player text uses a banned word, a real-world name, an American spelling or the secret', () => {
  for (const [k, v] of allLoc()) {
    // The allowances of the banned-word data hold here too: the black-powder keys may name hand-guns (owner decision K19).
    assert.deepEqual(bannedHits(v).filter(id => !(banned.allowances ?? []).some(a => allowanceCovers(a, id, k, 'zin_technologies_l_english.yml'))), [], `${k}: ${v}`);
    assert(!/Afrit|Deliverer|Hidden Council|Einendil|Kusven/.test(v), `${k} names the secret or a retired name`);
    assert(/^[\x20-\x7E -ÿ]*$/.test(v), `${k} has characters the game font does not draw`);
  }
});

test('The tide and bound-demon rows are the only ones that name the dark powers, and they hold no text before the reveal', () => {
  const loc = allLoc();
  assert(!/Afrit/.test(loc.get('zin_tech_bound_demons_desc')));
  assert(!allTechText().includes('Afrit'));
});

// ---------- sprites ----------
test('Every sprite a technology or doctrine names is defined, and an interim sprite uses a ZIN texture (never a vanilla one)', () => {
  const sprites = file('interface/zin_technologies.gfx') + file('interface/zin_doctrines.gfx');
  const defined = new Set([...sprites.matchAll(/name = "(GFX_[A-Za-z0-9_]+)"/g)].map(m => m[1]));
  for (const k of [...technologyIconKeys(model), ...doctrineIconKeys(model)]) assert(defined.has(k), k);
  for (const m of (allTechText() + doctrineText()).matchAll(/(GFX_[A-Za-z0-9_]+)/g)) if (!m[1].startsWith('GFX_technology_')) assert(defined.has(m[1]), `${m[1]} is used and defined`);
  for (const m of sprites.matchAll(/texturefile = "([^"]+)"/g)) assert(/^gfx\/interface\/(zin\/|technologies\/zin\/|doctrines\/zin\/)/.test(m[1]), m[1]);
  assert.equal(technologyIconKeys(model).length, 279);
});

test('The layout file gives the folder windows a gridbox for every root and a tile for every researchable technology', () => {
  const layout = JSON.parse(file('docs/design/technology/layout.json'));
  assert.equal(layout.slot, 70);
  const tiles = Object.values(layout.folders).flatMap(f => f.tiles);
  assert.equal(tiles.length, 279);
  const boxes = Object.values(layout.folders).flatMap(f => f.gridboxes.map(g => g.name));
  assert.equal(new Set(boxes).size, boxes.length);
  assert(layout.folders.industry_folder.gridboxes.every(g => g.format === 'UP' && g.slotsize === 70));
  assert(!('zin_gates' in layout.folders));
  for (const [f, v] of Object.entries(layout.folders)) {
    assert(v.rows.every((r, i) => r.y === i * 2), `${f} rows are compact and even`);
    assert(v.rows.every((r, i) => i === 0 || r.band > v.rows[i - 1].band), `${f} rows follow the years`);
  }
});

// ---------- owner decision K51: span, large equipment tiles, branching ----------
test('K51 layout: no two tiles overlap, no connector runs through a tile, and no two unrelated connectors cross or merge', () => {
  for (const [f, l] of Object.entries(model.layout.folders)) {
    assert.deepEqual(folderGeometry(l.tiles, l.edges, l.xor), [], f);
    // the rule itself: a planted overlap and a planted crossing are both reported
  }
  const a = { key: 'a', x: 0, y: 0, large: true }, b = { key: 'b', x: 2, y: 0, large: true };
  assert(folderGeometry([a, b], []).some(p => /overlap/.test(p)), 'two large tiles two slots apart overlap');
  const p1 = { key: 'p1', x: 0, y: 0 }, c1 = { key: 'c1', x: 4, y: 4 }, p2 = { key: 'p2', x: 2, y: 0 }, c2 = { key: 'c2', x: 2, y: 4 };
  assert(folderGeometry([p1, c1, p2, c2], [{ from: 'p1', to: 'c1' }, { from: 'p2', to: 'c2' }]).some(p => /cross/.test(p)), 'a connector across another is reported');
  const blocker = { key: 'x', x: 0, y: 2 };
  assert(folderGeometry([p1, blocker, { key: 'c', x: 0, y: 4 }], [{ from: 'p1', to: 'c' }]).some(p => /runs through x/.test(p)), 'a connector through a tile is reported');
});

test('K51 large equipment technologies: every technology that unlocks equipment takes the large item, every other one the small item', () => {
  const text = allTechText();
  const large = model.techs.filter(t => t.unlocks.equipment?.length);
  assert.equal(large.length, 92);
  for (const t of model.techs) {
    const block = text.match(new RegExp(`\\t${t.key} = \\{[^]*?\\n\\t\\}`))[0];
    assert.equal(/force_use_small_tech_layout = yes/.test(block), !t.unlocks.equipment?.length, `${t.key} item`);
    assert.equal(t.large, !!t.unlocks.equipment?.length, `${t.key} is laid out as ${t.large ? 'large' : 'small'}`);
  }
  // The regular item of every ZIN folder is the installed large item (183 by 84 at -56, -7), the small item 72 by 72.
  const gui = file('interface/countrytechtreeview.gui');
  for (const f of Object.keys(FOLDER_FILES).filter(k => k.startsWith('zin_'))) {
    const item = gui.match(new RegExp(`name = "techtree_${f}_item"[^]*?size = \\{ width = (\\d+) height = (\\d+) \\}`));
    assert(item, `${f} has its regular item`);
    assert.deepEqual([Number(item[1]), Number(item[2])], [ITEM.large.w, ITEM.large.h], `${f} regular item is the large equipment item`);
    const small = gui.match(new RegExp(`name = "techtree_${f}_small_item"[^]*?size = \\{ width = (\\d+) height = (\\d+) \\}`));
    assert.deepEqual([Number(small[1]), Number(small[2])], [ITEM.small.w, ITEM.small.h], `${f} small item`);
  }
  assert(!/Happy-Go-Lucky-Tank/.test(gui), 'the template name text is emptied');
  // Every gridbox of a folder sits at the folder origin and every root has one.
  const boxes = folderGridboxes(gui);
  for (const [f, l] of Object.entries(model.layout.folders)) for (const g of l.gridboxes) assert(boxes.get(f)?.has(g.name), `${f}: ${g.name}`);
});

test('K51 branching: every exclusive pair sits side by side, every several-parent technology draws its connectors and can be reached', () => {
  const text = allTechText();
  const multi = model.techs.filter(t => t.requires.length > 1);
  assert.equal(multi.length, 15);
  assert.equal(multi.filter(t => t.all).length, 7, 'seven technologies need all their parents (AND)');
  for (const t of multi) {
    const folder = model.layout.folders[t.folder];
    for (const [i, p] of t.requires.entries()) {
      const parent = text.match(new RegExp(`\\t${p} = \\{[^]*?\\n\\t\\}`))[0];
      const path = parent.match(new RegExp(`path = \\{\\s+leads_to_tech = ${t.key}\\s+research_cost_coeff = 1(\\s+ignore_for_layout = yes)?\\s+\\}`));
      assert(path, `${p} draws a path to ${t.key}`);
      assert.equal(!!path[1], i > 0, `${p} > ${t.key}: only a second parent ignores the layout`);
      assert(folder.edges.some(e => e.from === p && e.to === t.key), `${p} > ${t.key} is a drawn edge`);
    }
    const block = text.match(new RegExp(`\\t${t.key} = \\{[^]*?\\n\\t\\}`))[0];
    for (const p of t.requires) assert.equal(new RegExp(`dependencies = \\{[^}]*${p} = 1`).test(block), t.all, `${t.key}: ${p} is a hard dependency only under all`);
  }
  for (const t of model.techs) {
    const must = mandatory(t, model.byKey);
    for (const k of must) for (const x of model.byKey.get(k).xor) assert(!must.has(x), `${t.key} needs both ${k} and ${x}`);
    if (!t.all && t.requires.length > 1) assert(t.requires.some(p => !model.byKey.get(p).locked), `${t.key} has an open parent`);
  }
  for (const [a, b] of XOR_PAIRS) {
    const ta = model.layout.folders[model.byKey.get(`zin_tech_${a}`).folder].tiles.find(x => x.key === `zin_tech_${a}`);
    const tb = model.layout.folders[model.byKey.get(`zin_tech_${b}`).folder].tiles.find(x => x.key === `zin_tech_${b}`);
    assert(ta.y === tb.y && Math.abs(ta.x - tb.x) === 2, `${a} and ${b} side by side`);
    for (const k of [a, b]) assert(model.byKey.get(`zin_tech_${k}`).ai.modifiers?.length || ['great_halls', 'village_forges', 'pattern_books', 'masters_benches'].includes(k), `${k} has an AI weight that reads the realm`);
  }
  // Lines are not straight columns: every folder but the small Eyries and Lore folders has a connector that turns.
  for (const [f, l] of Object.entries(model.layout.folders)) {
    const tile = k => l.tiles.find(t => t.key === k);
    if (!['zin_skies_folder'].includes(f)) assert(l.edges.some(e => tile(e.from).x !== tile(e.to).x), `${f} has a branch that turns`);
  }
});

test('K51 span: the tree runs from the Third Age to the end of the sandbox, the Third Age rows carry era names, and no text dates an old age', () => {
  const years = model.techs.map(t => t.year);
  assert(Math.min(...years) < FOURTH_AGE_FROM && Math.max(...years) >= 1785);
  for (const f of Object.keys(FOLDER_FILES)) {
    const ys = model.techs.filter(t => t.folder === f).map(t => t.year);
    assert(Math.min(...ys) < FOURTH_AGE_FROM, `${f} reaches into the Third Age`);
    assert(Math.max(...ys) >= 1768, `${f} has research for the sandbox`);
  }
  const loc = allLoc();
  for (const b of model.bands) {
    const caption = loc.get(`zin_techtree_year_${b.y}`);
    if (b.to < FOURTH_AGE_FROM) assert(/Third Age/.test(caption) && !/\d/.test(caption), `row ${b.y} is named by its era: ${caption}`);
    else if (b.to < 1500) assert(/Fourth Age/.test(caption) && !/\d/.test(caption), `row ${b.y} is named by its era: ${caption}`);
    else assert(/^4A \d{4} to \d{4}$/.test(caption), `row ${b.y} gives Fourth Age years: ${caption}`);
  }
  for (const [k, v] of loc) {
    if (!/^zin_tech|^zin_techtree|_folder/.test(k)) continue;
    assert(!/\b[123]A\s*\d/.test(v), `${k} dates an old age: ${v}`);
    assert(!/\b(First|Second|Third) Age\b[^.]*\d/.test(v), `${k} numbers an old age: ${v}`);
    assert(!/\b(\d[\d,]* (years|centuries)|(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty) (centuries|hundred years|thousand years)|a (hundred|thousand) years)\b/i.test(v), `${k} counts the years of an age: ${v}`);
  }
});

test('K51 Third Age knowledge is starting knowledge by people, and lost knowledge is recovered, never granted', () => {
  const packages = technologyPackages(model);
  const ta = k => model.byKey.get(`zin_tech_${k}`).year < FOURTH_AGE_FROM;
  assert(packages.elves.technologies.includes('elven_arms') && packages.elves.technologies.includes('long_watch'));
  assert(packages.concord.technologies.includes('hedge_fighting') && packages.concord.technologies.includes('hidden_refuges'));
  assert(!packages.concord.technologies.some(k => ['elven_arms', 'grave_binding', 'troll_brood'].includes(k)), 'men keep only their own Third Age knowledge');
  assert(packages.dominion.technologies.includes('grave_binding') && packages.kin_trolls.technologies.includes('troll_brood'));
  for (const [key, p] of Object.entries(packages)) if (key !== 'mistake') assert(p.technologies.some(ta), `${key} starts with Third Age knowledge`);
  const lost = model.techs.filter(t => t.lost);
  assert.equal(lost.length, 8);
  for (const t of lost) {
    assert(t.year < FOURTH_AGE_FROM && t.needs.length, `${t.key}: Third Age with later learning`);
    assert(t.needs.some(n => model.byKey.get(n).year >= FOURTH_AGE_FROM), `${t.key} is recovered through Fourth Age learning`);
    for (const p of Object.values(packages)) assert(!p.technologies.includes(t.short), `${t.short} is never starting knowledge`);
  }
  const starts = JSON.parse(file('docs/design/technology/start_packages.json')).countries;
  for (const name of ['Kunhrim', 'Hrakbrund', 'Brundahrim', 'Gromkerm']) assert(starts[name].technologies.includes('hall_delving') && starts[name].technologies.includes('deep_forges'), `${name} keeps the hold-craft`);
  for (const s of Object.values(starts)) for (const k of s.technologies) assert(!model.byKey.get(`zin_tech_${k}`).lost, `${k} is lost knowledge`);
});

// ---------- owner decision K58: ways of life and development tiers ----------
const signature = t => [...Object.keys(t.modifiers).map(k => `m:${k}`), ...t.blocks.flatMap(b => [...Object.keys(b.stats ?? {}).map(k => `b:${b.target}:${k}`), ...Object.entries(b.terrain ?? {}).flatMap(([ter, st]) => Object.keys(st).map(k => `t:${b.target}:${ter}:${k}`))]), ...Object.values(t.unlocks).flat().map(u => `u:${typeof u === 'string' ? u : u.building}`)].sort().join('|');
test('K58 ways of life: every way has its own line, seen only by its cultures, with distinct effects and its start knowledge', () => {
  const ways = model.ways.list;
  assert.equal(ways.length, 13);
  const trig = file('common/scripted_triggers/zin_technologies.txt'), text = allTechText();
  const starts = JSON.parse(file('docs/design/technology/start_packages.json')).countries;
  const sigs = new Map();
  for (const w of ways) {
    const block = trig.match(new RegExp(`zin_way_${w.key} = \\{[^]*?\\n\\}`))?.[0];
    assert(block, `trigger zin_way_${w.key}`);
    for (const c of w.cultures) assert(block.includes(`zin_is_culture_${c} = yes`), `${w.key}: ${c}`);
    const techs = model.techs.filter(t => t.way === w.key);
    assert(techs.length >= 3, `${w.key} has its own line`);
    for (const t of techs.filter(x => !x.requires.length)) assert(new RegExp(`\\t${t.key} = \\{[^]*?allow_branch = \\{[^}]*zin_way_${w.key} = yes`).test(text), `${t.key} is hidden from other ways`);
    for (const t of techs) { assert(model.lines.get(t.line).ai.base >= 50, `${t.key} weighs strongly for its own realms`); assert(!t.categories.includes('cat_zin_advanced'), `${t.key} is the realm's own craft`); }
    const realms = countries.filter(c => w.cultures.includes(c.culture));
    assert(realms.length > 0, `${w.key} has realms`);
    for (const c of realms) for (const t of techs.filter(x => x.year < model.development.advancedFrom)) assert(starts[c.name].technologies.includes(t.short), `${c.name} keeps ${t.short}`);
    // no regional line copies another: no two way technologies of different ways share their effects
    for (const t of techs) { const s = signature(t); assert(!sigs.has(s) || sigs.get(s) === w.key, `${t.short} repeats ${sigs.get(s)}`); sigs.set(s, w.key); }
  }
  assert(!starts.Aenor.technologies.includes('great_herds') && starts.Aenor.way === 'lake_crowns');
  assert(starts.Noris.technologies.includes('war_elephants') && starts.Hunhun.technologies.includes('steppe_breeds'));
  for (const k of ['steppe_breeds', 'war_elephants', 'towered_elephants', 'longships', 'outrigger_galleys', 'reindeer_sledges']) assert(model.byKey.get(`zin_tech_${k}`).large, `${k} is a large equipment technology`);
  assert(model.byKey.get('zin_tech_war_elephants').unlocks.subunits.includes('zin_men_war_elephants'));
});

test('K58 development: tiers by package, a cost penalty on advanced learning, real effort to rise, and a careful AI', () => {
  const dev = model.development;
  assert.deepEqual(dev.tiers.map(t => [t.key, t.value]), [['learned', 1], ['settled', 2], ['customary', 3]]);
  const constants = file('common/script_constants/zin_development.txt');
  for (const t of dev.tiers) assert(new RegExp(`\\t${t.key}_cost = ${t.cost}\\n`).test(constants), `${t.key} cost constant`);
  assert(/\tstep = 3\n/.test(constants) && /data = fixed_point/.test(constants));
  assert(/cat_zin_advanced_cost_factor = zin_dev_advanced_cost/.test(file('common/dynamic_modifiers/zin_development.txt')));
  const fx = file('common/scripted_effects/zin_development.txt');
  for (const t of dev.tiers) assert(fx.includes(`set_variable = { zin_dev_advanced_cost = constant:zin_development.${t.key}_cost }`), t.key);
  for (const e of ['zin_development_init', 'zin_development_apply', 'zin_development_learn']) assert(fx.includes(`${e} = {`), e);
  assert(/zin_development_init = yes/.test(file('common/on_actions/zin_technologies.txt')), 'every country takes its tier at the start');
  const starts = JSON.parse(file('docs/design/technology/start_packages.json')).countries;
  for (const c of countries) assert(['learned', 'settled', 'customary', 'none'].includes(starts[c.name].development), c.name);
  assert.equal(starts.Aenor.development, 'learned');
  assert.equal(starts[ZOL].development, 'none');
  assert.equal(starts.Goldoroth.development, 'customary');
  assert(fx.includes(`original_tag = ${model.tags.get('Goldoroth')}`), 'the customary realms are listed by tag');
  // effort: four scholarship technologies and two decisions add learning; nothing grants it for free
  for (const k of dev.learnFrom) assert(new RegExp(`\\tzin_tech_${k} = \\{[^]*?on_research_complete_limit = \\{[^]*?on_research_complete = \\{\\s+zin_development_learn = yes`).test(allTechText()), k);
  const dec = file('common/decisions/zin_development.txt');
  assert(new RegExp(`zin_dev_send_scholars = \\{[^]*?any_neighbor_country = \\{ zin_development_learned = yes \\}[^]*?cost = ${dev.decisions.scholars.cost}\\n[^]*?days_re_enable = ${dev.decisions.scholars.days}`).test(dec));
  assert(new RegExp(`zin_dev_endow_learning = \\{[^]*?has_tech = zin_tech_libraries[^]*?cost = ${dev.decisions.endow.cost}\\n`).test(dec));
  assert.equal([...dec.matchAll(/zin_development_learn = yes/g)].length, 2);
  // the advanced category: common technologies of the campaign era and later, never a people's own craft
  const adv = model.techs.filter(t => t.advanced);
  assert(adv.length > 80);
  for (const t of model.techs) assert.equal(t.categories.includes('cat_zin_advanced'), t.advanced, t.key);
  for (const k of ['tempered_steel', 'universities', 'great_warships', 'masons_lodges']) assert.equal(model.byKey.get(`zin_tech_${k}`).advanced, k !== 'universities', k);
  for (const k of ['blackened_iron', 'leaf_steel', 'grave_legions', 'kin_harness', 'war_elephants', 'hold_engineers']) assert(!model.byKey.get(`zin_tech_${k}`).advanced, `${k} is a people's own craft`);
  const text = allTechText();
  for (const t of adv.slice(0, 20)) assert(new RegExp(`\\t${t.key} = \\{[^]*?ai_will_do = \\{[^]*?factor = 0\\.25\\s+zin_development_customary = yes`).test(text), `${t.key}: the customary AI holds back`);
  const loc = locEntries('localisation/english/zin_development_l_english.yml');
  for (const k of ['zin_development', 'cat_zin_advanced_cost_factor', 'zin_dev_learning', 'zin_dev_send_scholars', 'zin_dev_endow_learning', 'zin_development_learn_tt', 'zin_development_rise_tt']) assert(loc.get(k), k);
});

// ---------- determinism ----------
test('The build is deterministic: a second build yields the same bytes', async () => {
  const again = new Staged();
  await buildTechnologies(again, { countries });
  assert.deepEqual([...again.files.keys()], [...staged.files.keys()]);
  for (const [k, v] of staged.files) assert(v.equals(again.files.get(k)), k);
});

// ---------- negative tests ----------
test('Negative: a modifier the game does not define fails the build', async () => {
  await rejects(r => { r.civil.technologies.find(t => t.key === 'water_wheels').modifiers = { zin_not_a_modifier: 0.1 }; }, /unknown modifier zin_not_a_modifier/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'water_wheels').modifiers = { fuel_gain_factor: 0.1 }; }, /fuel_gain_factor belongs to a system Aoaz does not have/);
  await rejects(r => { r.doctrines.grand[0].act.modifiers = { army_fuel_consumption_factor: -0.1 }; }, /army_fuel_consumption_factor belongs to a system Aoaz does not have/);
});
test('Negative: a duplicate technology key fails the build', async () => {
  await rejects(r => { r.civil.technologies.push({ ...r.civil.technologies[0] }); }, /duplicate technology zin_tech_dressed_stone/);
});
test('Negative: a missing prerequisite fails the build', async () => {
  await rejects(r => { r.civil.technologies.find(t => t.key === 'lime_mortar').requires = ['no_such_stone']; }, /path parent no_such_stone does not exist/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'pit_props').needs = ['no_such_stone']; }, /needs no_such_stone, which does not exist/);
});
test('Negative: a modern word in text is caught by the banned list', () => {
  assert.deepEqual(bannedHits('Workers in the new factory build a tank.'), bannedRules.filter(r => r.severity === 'error' && r.re.test('Workers in the new factory build a tank.')).map(r => r.id));
  assert(bannedHits('A steel mill makes rifles for the democracy').length >= 3);
  assert(bannedHits('Smiths hammer iron at the forge').length === 0);
});
test('Negative: a vanilla name used as a folder, category or doctrine is refused', async () => {
  await rejects(r => { r.civil.folders[0].key = 'armour_folder'; }, /folder armour_folder is a vanilla folder key/);
  await rejects(r => { r.civil.categories[0].key = 'armor'; r.civil.lines[0].categories = ['armor']; }, /category armor is a vanilla category/);
  await rejects(r => { r.doctrines.grand[0].key = 'new_mobile_warfare'; }, /vanilla key/);
  await rejects(r => { r.packages.sharing.groups[0].id = 'commonwealth_research'; }, /vanilla group/);
});
test('Negative: a path parent in another folder, a lone AND parent, a later parent, a cycle and an AND over an exclusive pair fail', async () => {
  await rejects(r => { r.civil.technologies.find(t => t.key === 'arch_and_vault').requires = ['lime_mortar', 'lime_mortar']; }, /listed twice/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'pit_props').requires = ['scriptoria']; }, /is in another folder/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'masons_lodges').all = true; }, /all needs two or more path parents/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'dressed_stone').needs = ['great_scaffolds']; }, /later than the technology/);
  await rejects(r => { const t = r.civil.technologies; t.find(x => x.key === 'lime_mortar').needs = ['arch_and_vault']; }, /later than the technology|cycle/);
  await rejects(r => { const t = r.civil.technologies.find(x => x.key === 'guild_charters'); t.all = true; }, /can never be researched/);
  await rejects(r => { delete r.civil.technologies.find(t => t.key === 'refuge_granaries').needs; }, /lost knowledge needs the later learning/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'refuge_granaries').year = 1700; }, /lost knowledge belongs to the Third Age/);
});
test('Negative: an exclusive pair written on one side only fails', async () => {
  await rejects(r => { r.civil.technologies.find(t => t.key === 'masters_benches').xor = []; }, /XOR with masters_benches is written on one side only|written on one side only/);
});
test('Negative: a year outside 1 to 1800, two tiles on one slot, a child beside its parent and a tile on a connector fail', async () => {
  await rejects(r => { r.civil.technologies.find(t => t.key === 'scriptoria').year = 1936; }, /outside 1 to 1800/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'libraries').year = 300; }, /share the slot|not in a later row/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'libraries').year = 250; }, /not in a later row|share the slot/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'royal_works').x = 2; }, /share the slot|runs through|overlap/);
  await rejects(r => { r.warfare.technologies.find(t => t.key === 'light_harness').x = 6; }, /side by side|overlap/);
});
test('Negative: a locked building listed by an ordinary technology, and a grant-only row outside the gates, fail', async () => {
  await rejects(r => { r.civil.technologies.find(t => t.key === 'water_wheels').unlocks = { buildings: [{ building: 'rocket_site', level: 1 }] }; }, /rocket_site must stay locked/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'water_wheels').grantOnly = true; }, /grantOnly belongs to the gate technologies/);
});
test('Negative: a category no AI focus names, and an unknown category on a line, fail', async () => {
  await rejects(r => { for (const f of Object.values(r.civil.aiFocuses)) delete f.zin_cat_beacons; }, /zin_cat_beacons appears in no AI focus/);
  await rejects(r => { r.civil.lines.find(l => l.key === 'masonry').categories = ['industry', 'cat_fortification']; }, /unknown category cat_fortification/);
});
test('Negative: an unknown sub-unit, equipment, module, people or country fails', async () => {
  await rejects(r => { r.warfare.technologies.find(t => t.key === 'iron_arms').unlocks.subunits = ['infantry']; }, /sub-unit infantry is not in the id list/);
  await rejects(r => { r.warfare.technologies.find(t => t.key === 'iron_arms').unlocks.equipment = ['infantry_equipment_0']; }, /not a variant of a known archetype/);
  await rejects(r => { r.warfare.technologies.find(t => t.key === 'oared_galleys').unlocks.modules = ['ship_extra_fuel_tank']; }, /ship module ship_extra_fuel_tank is not in the id list/);
  await rejects(r => { r.warfare.technologies.find(t => t.key === 'iron_arms').who = ['hobbits']; }, /unknown people hobbits/);
  await rejects(r => { r.warfare.technologies.find(t => t.key === 'valley_wardens').who = ['country:Gondor']; }, /country Gondor is not in the roster/);
});
test('Negative: a technology visible to someone who cannot see its parent fails', async () => {
  await rejects(r => { r.warfare.technologies.find(t => t.key === 'leaf_steel').who = ['men']; }, /visible to someone who cannot see its path parent elven_arms/);
});
test('Negative: piercing in a technology or doctrine, and a stat the game does not read, fail', async () => {
  await rejects(r => { r.warfare.technologies.find(t => t.key === 'hallowed_arms').blocks = [{ target: 'zin_men_infantry', stats: { ap_attack: 2 } }]; }, /ap_attack is not a unit stat the game reads here .*deathless invariant/);
  await rejects(r => { r.doctrines.subs[0].rewards[0].blocks = [{ target: 'category_all_infantry', stats: { ap_attack: 1 } }]; }, /ap_attack is not a unit stat/);
  await rejects(r => { r.doctrines.subs[0].rewards[0].modifiers = { ap_attack: 1 }; }, /piercing is closed to doctrines/);
  await rejects(r => { r.warfare.technologies.find(t => t.key === 'iron_arms').blocks = [{ target: 'zin_men_infantry', stats: { shield_weight: 1 } }]; }, /shield_weight is not a unit stat/);
});
test('Negative: a unit block aimed at a vanilla sub-unit fails', async () => {
  await rejects(r => { r.warfare.technologies.find(t => t.key === 'iron_arms').blocks = [{ target: 'infantry', stats: { defense: 0.1 } }]; }, /unit block target infantry is neither a sub-unit nor a unit category/);
});
test('Negative: a doctrine with a missing track, a short milestone list, a sub with no track, or three-reward rule broken fails', async () => {
  await rejects(r => { r.doctrines.grand[0].tracks[0] = 'infantry'; }, /unknown track infantry/);
  await rejects(r => { r.doctrines.grand[0].milestones.pop(); }, /milestones for 4 tracks/);
  await rejects(r => { r.doctrines.subs[0].track = 'zin_track_nothing'; }, /unknown track zin_track_nothing/);
  await rejects(r => { r.doctrines.subs[0].rewards.pop(); }, /two rewards|2 rewards, three are required/);
  await rejects(r => { r.doctrines.subs.find(s => s.key === 'zin_sub_cog_escorts').xor = []; }, /XOR with zin_sub_cog_escorts is written on one side only|written on one side only/);
  await rejects(r => { r.doctrines.tracks.find(t => t.key === 'zin_track_dragons').mastery = { multiplier: 1 }; }, /no mastery source/);
  await rejects(r => { r.doctrines.tracks.find(t => t.key === 'zin_track_galleys').mastery = { multiplier: 1, equipment: ['carrier'] }; }, /mastery equipment type carrier is not known/);
});
test('Negative: an AI focus the engine does not have, a sharing leader outside the roster and a trigger the game lacks fail', async () => {
  await rejects(r => { r.civil.aiFocuses.ai_focus_invented = { industry: 1 }; }, /ai_focus_invented is not an engine AI focus/);
  await rejects(r => { r.packages.sharing.groups[0].leader = 'Gondor'; }, /leader Gondor is not in the roster/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'water_wheels').allowRaw = 'has_factory_count > 3'; }, /unknown trigger has_factory_count/);
  await rejects(r => { r.civil.technologies.find(t => t.key === 'water_wheels').allowRaw = 'has_global_flag = zin_invented_flag'; }, /global flag zin_invented_flag is not in the id list/);
});
test('Negative: text the game font cannot draw and a missing description fail', async () => {
  await rejects(r => { r.civil.technologies.find(t => t.key === 'water_wheels').desc = 'The Wheel of Šodolôrō'; }, /characters the game font does not draw/);
  await rejects(r => { delete r.civil.technologies.find(t => t.key === 'water_wheels').desc; }, /name and desc are required/);
});
test('Negative: a start package that would grant an exclusive root, or lacks a prerequisite closure, is refused', () => {
  const bad = structuredClone(model.raw);
  bad.packages.packages.find(p => p.key === 'concord').rules.push({ keys: ['great_halls'] });
  assert.throws(() => technologyPackages({ ...model, raw: bad }), /grants the exclusive root great_halls/);
  const bad2 = structuredClone(model.raw);
  bad2.packages.packages.find(p => p.key === 'concord').rules.push({ keys: ['leaf_steel'] });
  assert.throws(() => technologyPackages({ ...model, raw: bad2 }), /leaf_steel is not open to/);
  const bad3 = structuredClone(model.raw);
  bad3.packages.packages.find(p => p.key === 'orcs').rules.push({ keys: ['no_such_tech'] });
  assert.throws(() => technologyPackages({ ...model, raw: bad3 }), /no_such_tech does not exist/);
});
test('Negative: parseWho refuses a people, a region and a group it does not know', () => {
  const problems = [];
  parseWho(['hobbits', 'region:nowhere', 'group:nobody', 'country:Aenor+men'], { groups: {}, tags: model.tags, ids: model.ids }, problems, 'x');
  assert.equal(problems.length, 3);
  assert.deepEqual(parseWho(['men+region:east_lands'], { groups: {}, tags: model.tags, ids: model.ids }, [], 'x'), [{ people: 'men', region: 'east_lands' }]);
});
test('Layout: the folder layout reports a shared slot instead of hiding it', () => {
  const lines = new Map([['a', { folder: 'f', column: 0 }]]);
  const techs = [{ key: 'one', line: 'a', year: 1600, requires: [] }, { key: 'two', line: 'a', year: 1620, requires: [] }];
  const { problems } = layoutFolders(techs, lines, model.bands);
  assert(problems.some(p => /share the slot 0,0/.test(p)), 'the shared slot');
  assert(problems.some(p => /overlap/.test(p)), 'and the overlapping tiles');
});
