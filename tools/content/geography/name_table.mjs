// The rename table of the geography model of Aoaz: every name the checker refuses, every water called an "Ocean",
// every "-waith" name and every name borrowed from other fiction or real myth gets one new name, with its old label kept.
//
// Sources, in order of authority:
//   1 owner decisions of 24 October 2026 (OWNER below): the main setting is Aoaz; the Dead Lands region is the Ember
//     Lands; the sea of Zol's black islands is the Kusmeel; no body of water is called an Ocean; no names from other
//     fiction or real myth; no "-waith" names; the owner's labels may be renamed where they do not fit or repeat;
//   2 the reconciled roster (tools/content/data/world/roster.json, its realms' names and formerLabels) and the regional
//     dossiers (docs/lore/regions/*.md: their water lists, which give each sea, strait, gulf and lake one name, and
//     their renamed-label tables), cited per entry in CURATED;
//   3 the owner's drawn island labels (docs/name_table.md, confirmed readings only), which name a placeholder island
//     when a label lies beside it through its registered sheet;
//   4 the language generator (tools/content/modules/names.mjs placeNames, in the language of the island's region,
//     current layer only) for every placeholder island no label names, and for the few features CURATED marks
//     `generate`.
// Every sea, strait and lake keeps one name that fits its place and peoples; no two sea names share a meaning or
// differ only by a plural (R-13; the checker's SEA_* rules).
//
// The table is data: tools/content/data/geography/name_table.json. repair_model.mjs (applyNameTable) applies it,
// keeping each old label as `formerLabel`; the repair itself never calls the generator.
//
//   node tools/content/geography/name_table.mjs [--model <repaired.json>] [--out <name_table.json>]
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BANNED_NAME_PATTERNS, nameKey, distanceToGeometry, FEATURE_ARRAYS } from './check_model.mjs';
import { toWorld, paperOf } from './drawing_mask.mjs';
import { parseLabels, SCAN_SHEETS, DEFAULT_LABELS_PATH } from './sheet_registration.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_NAME_TABLE_PATH = path.join(here, '../data/geography/name_table.json');

const OD = 'owner decision of 24 October 2026';
/** Owner decisions applied directly. */
export const OWNER = Object.freeze([
  { id: 'region_dead_lands', name: 'The Ember Lands', reason: `${OD}: the Dead Lands region is the Ember Lands`, source: 'owner' },
  { id: 'sea_zol_ocean', name: 'Kusmeel', reason: `${OD}: the sea of Zol's black islands is the Kusmeel; no water is an Ocean`, source: 'owner; east_lands.md water table' },
  { id: 'waste_black_islands', name: 'Black Islands of the Kusmeel', reason: `${OD}: the sea is the Kusmeel`, source: 'owner; zols_mistake.md section 2' },
]);

// [id, new name, language or null, meaning or null, reason, source]
const C = (id, name, language, meaning, reason, source, generate = null) => ({ id, name, language, meaning, reason, source, ...(generate ? { generate } : {}) });
/** Renames from the roster and the dossiers, and the few decided here (source "geography"), each with its reason. */
export const CURATED = Object.freeze([
  // ------------------------------------------------------------------ seas: one name each, no Ocean, no shared meaning
  C('sea_frozen_ocean', 'The Frozen Sea', null, null, 'no water is an Ocean (owner); the drawn name otherwise kept', 'cold_lands.md seas'),
  C('sea_pandar_frozen_seas', 'Pandar', null, null, '"Frozen Seas" beside the Frozen Sea names one water twice', 'cold_lands.md seas (single name Pandar)'),
  C('sea_tritons_ocean', 'Norrai Sea', 'tritonic', null, 'the Tritonic name of the dossiers; no water is an Ocean (owner)', 'cold_lands.md, tritons_islands.md, west_lands.md (Norrai)'),
  C('sea_cold_ocean', 'Suddmarg', 'coldic', 'south sea (sudd + marg)', 'no water is an Ocean (owner); "Cold Ocean" shared its meaning with the Frozen Sea (R-13); the Coldic name of the coast folk of Poloto', 'geography; languages.json coldic elements'),
  C('sea_pupor_ocean', 'Pupor Sea', null, null, 'no water is an Ocean (owner); the vault name Pupor kept', 'tritons_islands.md seas; vault Aoaz and Its Regions'),
  C('sea_santon_ocean', 'Santon Sea', null, null, 'no water is an Ocean (owner)', 'tritons_islands.md'),
  C('sea_kradlon_ocean', 'Kradlon Sea', null, null, 'no water is an Ocean (owner)', 'west_lands.md seas'),
  C('sea_crown_ocean', 'Crown Sea', null, null, 'no water is an Ocean (owner); the proposed name Crown kept', 'middle_lands.md water table'),
  C('sea_leviathan_sea', 'Londolo', null, null, 'the Leviathan is a name of real myth; the drawn Londolo kept', 'north_lands.md seas [OD]; cold_lands.md'),
  C('sea_onp_ocean', 'Onp', null, null, 'no water is an Ocean (owner)', 'north_lands.md seas'),
  C('sea_leren_ocean', 'Leren Sea', null, null, 'no water is an Ocean (owner)', 'middle_lands.md, north_lands.md'),
  C('sea_rim_ocean', 'Rim Sea', null, null, 'no water is an Ocean (owner)', 'middle_lands.md water table'),
  C('sea_peace_ocean', 'Nesmael', 'aenoran', 'south sea (nes + mael)', 'no water is an Ocean (owner); "Ocean of Peace" contradicted the storm belt and the Ember waters beside it (R-13); the Aenoran name of the pilgrim road south', 'geography; languages.json aenoran elements'),
  C('sea_magical_ocean', 'The Rift Sea', null, null, 'no water is an Ocean (owner); the dossiers name the rift water', 'east_lands.md, magical_lands.md water tables'),
  C('sea_mushroom_seas', 'The Reeto Sea', null, null, 'the East sheet\'s drawn name of the southern rift; "Mushroom Seas" repeated the forest', 'east_lands.md, magical_lands.md water tables'),
  C('sea_dark_sea', 'Dulundur Sea', null, null, '"The Dark Sea" beside the Sea of Darkness names one idea twice; the drawing\'s own first line Dulundur', 'dark_lands.md seas'),
  C('sea_dun_sea', 'Sea of Dobudo', null, null, '"Dun" means dark: it shared its meaning with the Sea of Darkness (R-13); named after Dobudo, the Dun port on its shore', 'geography; dark_lands.md settlements (Dobudo, on the Dun Sea)'),
  C('sea_death_sea', 'Gaelmael', 'aenoran', 'grey water', 'the Aenoran name of the dossiers; "Sea of Death" collided with the Ember waters', 'dark_lands.md, middle_lands.md'),
  C('sea_gold_wides', 'The Goldoroth Wides', null, null, '"Gold" is a name of light beside the dark waters and the Ember Lands; the drawn "Wides" kept, named for the Goldoroth shore it lies off', 'geography; dark_lands.md seas'),
  C('sea_dolon_left_sea', 'Sea of Dolon', null, null, 'the dossier\'s single name', 'dark_lands.md seas'),
  C('sea_dark_west_sea', 'Belonton Water', null, null, 'a sea called a strait beside two real straits', 'dark_lands.md seas'),
  C('sea_deaths_sea', 'Vehmial', 'mirolic', 'the west water', 'collided with the Sea of Death and the Dead\'s Sea', 'ember_lands.md water table'),
  C('sea_demonic_sea', 'Veshir', 'infernal', 'ash water', 'repetitive with the realm names', 'ember_lands.md water table'),
  C('sea_dead_sea', 'Veleeda', null, null, 'the owner\'s own drawn name; the English half dropped', 'ember_lands.md water table'),
  C('sea_tempest_reach', 'Zavrekir', 'infernal', 'storm water (zavrek + ir)', '"Tempest" shared its meaning with the drawn Windy Seas (R-13); the Infernal name beside Veshir', 'geography; languages.json infernal elements'),
  C('sea_sun_ocean', 'Naam-Maqr', 'noric', 'west sea (naam + maqr)', 'no water is an Ocean (owner); "of the Sun" shared its meaning with the Sea of Gods (R-13); the Noric name of the desert coast', 'geography; languages.json noric elements'),
  C('sea_ihuy_seas', 'The Ihuy Sea', null, null, 'one water, one singular name', 'lands_of_the_sun.md water'),
  C('sea_light_seas', 'Sala Aila', 'sunhot', 'the bright sea', 'the dossier\'s Sunhot form; its Common Speech "Bright Sea" shares the meaning of the vault\'s Sea of Gods (R-13)', 'lands_of_the_sun.md water'),
  // ------------------------------------------------------------------ straits and lakes
  C('strait_leren_mouth', 'Leren Mouth', null, null, 'no water is an Ocean (owner)', 'north_lands.md straits'),
  C('strait_aenor_isle', 'The Inner Sea', null, null, 'Asgard is a name of Norse myth; the drawn "Inner Seas" of the Rush Islands sheet', 'middle_lands.md water table'),
  C('lake_evian', 'Dolpar', 'leren', null, 'Evian is a real place; the lake-realm\'s name', 'north_lands.md; roster Dolpar'),
  // ------------------------------------------------------------------ regions and zones
  C('region_windwaith', 'Vindael', 'coldic', null, 'no "-waith" names (owner)', 'cold_lands.md; roster Vindael (former label Windwaith)'),
  C('region_tritons_islands', 'The Pupor Isles', 'tritonic', null, 'the dossiers\' name of the archipelago around the Pupor Sea', 'tritons_islands.md, cold_lands.md, west_lands.md'),
  C('zone_great_wall', 'The Wall Marches', null, null, 'a zone is no name; the march along the Great Wall of Aenor', 'geography'),
  C('zone_narrow_strait', 'The Narrow Strait', null, null, 'a zone is no name; the zone is the strait\'s water', 'geography'),
  // ------------------------------------------------------------------ lands
  C('land_nether_island', 'The Nether', null, null, 'no brackets in a name', 'nether.md'),
  C('land_dead_lands_island', 'The Ember Isle', null, null, 'the island of the Ember Lands (owner: the Dead Lands are the Ember Lands)', 'owner; ember_lands.md'),
  C('land_island_001', 'Vindael', 'coldic', null, 'the Vindael arm\'s island', 'cold_lands.md renamed labels'),
  C('land_island_002', 'Varnondor', null, null, 'the curled Varnondor land, separate from the mainland', 'west_lands.md section 2'),
  C('land_island_003', 'Isle of Šodolôrō', null, null, 'the great black oval isle', 'zols_mistake.md section 2'),
  C('land_island_005', 'Raerby', null, null, 'the eastern arc', 'tritons_islands.md section 2'),
  C('land_island_006', 'Adel', null, null, 'the northern island', 'tritons_islands.md section 2'),
  C('land_island_007', 'Great Isle', null, null, 'the ring island that the drawing makes one main island', 'islands_of_the_south.md section 2'),
  C('land_island_009', 'Benan', null, null, 'the long western island of Pollos, Benan and Nondondor, named for the drawn Benan in its middle', 'tritons_islands.md section 2'),
  C('land_island_012', 'Verde', null, null, 'the island that carries Verde', 'islands_of_the_south.md section 2'),
  C('land_island_020', 'Howan', null, null, 'the island that carries Howan', 'islands_of_the_south.md section 2'),
  C('land_island_044', 'Ancha', null, null, 'Nara on its drawn island Ancha', 'islands_of_the_south.md section 2'),
  // ------------------------------------------------------------------ relief
  C('range_magic_1', 'Magic Mountains', null, null, 'no brackets; the drawn label "Magic Mountains" names the great central ridges', 'magical_lands.md relief; drawn label'),
  C('range_magic_2', null, 'sylvan', null, 'no brackets; the middle ridge takes a name of its own', 'geography', { kind: 'mountain' }),
  C('range_magic_3', 'Lozo Heights', null, null, 'no brackets; the southern ridge beside Lake Lozo', 'geography; magical_lands.md'),
  C('range_magic_wall', 'Kingson Wall', null, null, 'no brackets; the ridge that is the east side of the Kingson ring', 'geography; middle_lands.md section 2.7'),
  C('range_rush_south', 'Crown Mountains', null, null, 'no brackets; the drawn Rush Mountains on Kingson\'s south edge, renamed Crown', 'middle_lands.md relief table'),
  C('range_crown_north', 'Konori Heights', null, null, 'no brackets; the northern foothills on the Konori side', 'geography; middle_lands.md relief table'),
  C('range_titanos_heights', 'Nivaros Heights', 'gigantic', null, 'the Titans are a name of real myth', 'cold_lands.md section 2'),
  C('volcano_good_2', null, 'sunhot', null, 'no brackets; the second of the two Good Volcanoes takes a name of its own', 'geography', { kind: 'mountain' }),
  C('volcano_avalon', 'The Rhachia Fires', 'alerhic', null, 'Avalon is a name of real myth', 'east_lands.md renamed labels; roster Rhachia'),
  // ------------------------------------------------------------------ areas, rivers, coasts and passes
  C('ice_windwaith', 'Vindael', 'coldic', null, 'no "-waith" names (owner)', 'cold_lands.md, tritons_islands.md'),
  C('ice_lerenwaith', 'Veskel', 'leren', null, 'no "-waith" names (owner)', 'north_lands.md section 2'),
  C('ice_north_yeti_lands', 'Ghaahu', 'yetic', null, 'the yeti realm\'s own name', 'cold_lands.md renamed labels; roster Ghaahu'),
  C('plain_gunwaith', 'Gunwyn Downs', 'gunwaithic', null, 'no "-waith" names (owner)', 'west_lands.md section 2'),
  C('plain_greenland', 'Yavieth', 'sylvan', null, 'Greenland is a real place', 'magical_lands.md renamed labels; roster Yavieth'),
  C('plain_gondolin_coast', 'Naamis Coast', 'noric', null, 'Gondolin is a name from other fiction', 'east_lands.md renamed labels'),
  C('forest_gondolin', 'Naamis Wood', 'noric', null, 'Gondolin is a name from other fiction', 'east_lands.md renamed labels'),
  C('forest_crown', 'Aenor Forest', null, null, 'the realm\'s name', 'middle_lands.md renamed labels; roster Aenor Forest'),
  C('forest_kingdom', 'Dunelaeth', 'sylvan', null, 'the elves\' name of the forest at the foot of Lunhrim', 'middle_lands.md renamed labels'),
  C('forest_death', 'Vokh-Gul', 'infernal', 'forest of graves', 'repetitive death-names', 'ember_lands.md renamed labels'),
  C('forest_hell', 'Vokh-Ashkar', 'infernal', 'fire forest', 'repetitive death-names', 'ember_lands.md renamed labels'),
  C('forest_taith', 'Tath Forests', null, null, '"Taith" echoes the retired "-waith" names; the other reading of the drawing', 'tritons_islands.md section 2 [OD]'),
  C('river_gondolin', 'Shaar-Sheek', 'noric', null, 'Gondolin is a name from other fiction', 'east_lands.md water table'),
  C('river_gil', 'Kerhil Water', 'leren', null, 'Gil\'dul echoes a name from other fiction', 'north_lands.md section 2'),
  C('river_melt', 'The Meltwater', null, null, 'the dossier\'s name', 'east_lands.md water table'),
  C('cape_gondolin', 'Naamis Cape', 'noric', null, 'Gondolin is a name from other fiction', 'east_lands.md water table'),
  C('cape_wonderland', 'Austklev Point', 'coldic', 'east cliff', 'Wonderland is a name from other fiction', 'cold_lands.md renamed labels'),
  C('cape_hiloron', 'Hirolon Head', null, null, 'the giants\' realm is Hirolon (R-22)', 'hirolon.md, middle_lands.md'),
  C('pass_kingson_gate', 'The Kingson Pass', null, null, 'the geography name of the one pass east out of the vale', 'middle_lands.md section 2.7'),
  C('pass_south_gate', 'The South Pass', null, null, 'the geography name of the southern gate road', 'middle_lands.md relief table'),
  // ------------------------------------------------------------------ sites
  C('site_isengard', 'Melkgard', 'coldic', 'black stronghold', 'Isengard is a name from other fiction', 'cold_lands.md realms; roster Melkgard'),
  C('site_asgard', 'Orohaf', 'aenoran', 'island harbour', 'Asgard is a name of Norse myth', 'middle_lands.md section 2.8; roster Orohaf'),
  C('site_gondolin', 'Naamis', 'noric', null, 'Gondolin is a name from other fiction', 'east_lands.md renamed labels; roster Naamis'),
  C('site_avalon', 'Rhachia', 'alerhic', null, 'Avalon is a name of real myth', 'east_lands.md renamed labels; roster Rhachia'),
  C('site_heaven', 'Yeni Alang', 'sunhot', null, 'a name of real religion', 'lands_of_the_sun.md renamed labels; roster Yeni Alang'),
  C('site_godland', 'Tor Luni', 'sunhot', null, 'a name of real religion', 'lands_of_the_sun.md renamed labels; roster Tor Luni'),
  C('site_hengyang', 'Ossi Luni', 'sunhot', null, 'Hengyang is a real city', 'lands_of_the_sun.md renamed labels'),
  C('site_hiloron', 'Hirolon', null, null, 'the giants\' realm is Hirolon (R-22)', 'hirolon.md; roster Hirolon'),
  C('site_gunwaith', 'Gunwyn', 'gunwaithic', null, 'no "-waith" names (owner)', 'west_lands.md realms; roster Gunwyn'),
  C('site_great_lake_port_1', 'Grafas', 'aenoran', 'grey ford', 'a port needs a name, not a description', 'middle_lands.md settlements'),
  C('site_great_lake_port_2', 'Borepar', 'aenoran', 'north lake (bore + par)', 'a port needs a name; the dossier\'s "Parim" is the capital beside it', 'geography; middle_lands.md settlements'),
  C('site_great_lake_port_3', 'Silesire', 'aenoran', null, 'a port needs a name, not a description', 'middle_lands.md settlements'),
  C('site_great_lake_port_4', 'Dolepar', 'aenoran', null, 'a port needs a name, not a description', 'middle_lands.md settlements'),
  C('site_great_wall_north_fort', 'Organ Wall Fortress', null, null, 'no brackets; the fortress at the Organ end of the Great Wall', 'geography'),
]);

/** The language that names a placeholder island, by its region. */
export const REGION_LANGUAGE = Object.freeze({
  tritons_islands: 'tritonic', islands_south: 'yonic', lands_sun: 'sunhot', dead_lands: 'mirolic', nether: 'infernal', east_lands: 'alerhic',
  south_lands: 'noric', north_lands: 'leren', dark_lands: 'dondric', cold_lands: 'coldic', windwaith: 'coldic', west_lands: 'gunwaithic',
  magical_lands: 'sylvan', middle_lands: 'aenoran', aenor_isle: 'aenoran', zols_mistake: 'leren',
});
// Zol's Mistake has no language of its own (languages spec section 8): its black islands are named by the North
// Lands' fishermen who have seen them, in Leren, unless the owner drew a name.

/** Patterns no new name may contain beyond the checker's: Ocean, "-waith" and its Leren cousin "-vaith". */
export const EXTRA_BANNED = Object.freeze([['ocean', /\bocean\b/iu], ['waith', /waith|vaith/iu]]);
/** Drawn labels that are not used as names: names from other fiction or real myth, and superseded readings. */
export const REJECTED_LABELS = Object.freeze(new Set(['heaven', 'hel', 'helen', 'eden', 'olympus', 'avalon', 'asgard']));
/** Drawn labels the dossiers rename: the label names its island under the new name. */
export const LABEL_RENAMES = Object.freeze({
  Vez: { name: 'Exhoros', language: 'mirolic', meaning: 'ash isle', reason: 'Vez is the old name of Volgan and no land carries the name of its lord; the isle of Vez', source: 'ember_lands.md renamed labels' },
});
/** Names of other fiction and real myth that a generated or drawn name may not equal or nearly equal (one letter apart). */
export const FICTION = Object.freeze(['mordor', 'gondor', 'rohan', 'isengard', 'gondolin', 'lorien', 'rivendell', 'moria', 'erebor', 'valinor', 'numenor', 'angmar', 'mirkwood', 'fangorn', 'anduin', 'arnor', 'eriador', 'harad', 'umbar', 'narnia', 'hodor', 'asgard', 'midgard', 'valhalla', 'avalon', 'camelot', 'atlantis', 'olympus', 'hades', 'elysium', 'eden', 'leviathan', 'kraken', 'wonderland', 'neverland', 'azeroth', 'hyrule', 'tamriel', 'westeros', 'eldorado', 'babylon', 'odin', 'thor', 'zeus', 'osiris', 'anubis', 'hengyang', 'helen', 'heaven']);
const nearly = (a, b) => {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) { if (a[i] === b[j]) { i++; j++; continue; } if (++edits > 1) return false; if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; } }
  return edits + (a.length - i) + (b.length - j) <= 1;
};
export const fictionLike = name => { const k = nameKey(name); return FICTION.some(f => k === f || nearly(k, f)); };
export const ISLAND_LABEL_TOL_PX = 48;
const banned = name => BANNED_NAME_PATTERNS.some(([, re]) => re.test(name)) || EXTRA_BANNED.some(([, re]) => re.test(name)) || fictionLike(name);
const placeholder = f => /^Island \d+ \(/u.test(f.name ?? '');
const arrayOf = (m, id) => FEATURE_ARRAYS.find(a => (m[a] ?? []).some(f => f.id === id));
const featureOf = (m, id) => { const a = arrayOf(m, id); return a ? m[a].find(f => f.id === id) : null; };

/** Drawn island labels beside the placeholder islands, through the registered sheets (greedy by distance, one to one). */
export function islandLabels(m, labels, taken) {
  const moved = new Map((m.repair?.moved ?? []).map(mv => [mv.id, mv.vector]));
  const islands = m.lands.filter(placeholder);
  const pairs = [];
  for (const l of labels) {
    if (l.kind !== 'island' || l.reading !== 'confirmed' || /\.\.\.|…/u.test(l.name)) continue;
    const name = l.name.replace(/^The\s+/u, '');
    if (REJECTED_LABELS.has(name.toLowerCase()) || (banned(name) && !LABEL_RENAMES[name])) continue;
    const s = m.sheets?.[SCAN_SHEETS[l.scan]];
    if (!s) continue;
    const b = paperOf(s);
    if (l.at[0] < b[0] || l.at[0] > b[2] || l.at[1] < b[1] || l.at[1] > b[3]) continue;
    const p = toWorld(s, l.at);
    for (const isl of islands) {
      const v = moved.get(isl.id) ?? [0, 0];
      const q = [p[0] + v[0], p[1] + v[1]]; // a moved island carries its drawn label with it
      const d = distanceToGeometry(q[0], q[1], isl.geometry) * 5120;
      if (d <= ISLAND_LABEL_TOL_PX) pairs.push({ island: isl, label: l, name, d });
    }
  }
  pairs.sort((a, b) => a.d - b.d || a.island.id.localeCompare(b.island.id) || a.name.localeCompare(b.name));
  const out = new Map(), used = new Set();
  for (const pr of pairs) {
    const key = nameKey(pr.name);
    if (out.has(pr.island.id) || used.has(key) || taken.has(key)) continue;
    out.set(pr.island.id, pr); used.add(key);
  }
  return out;
}

/** Build the rename table for a model. `generate(language, kind, seed)` returns candidate names ({ text, gloss }). */
export function buildNameTable(m, labels, generate) {
  const entries = [];
  const decided = new Map();
  for (const e of [...OWNER, ...CURATED]) if (!decided.has(e.id)) decided.set(e.id, e);
  // names that stay: every current name not being replaced, by array, so that new names do not repeat them
  const keep = new Map();
  for (const a of FEATURE_ARRAYS) for (const f of m[a] ?? []) if (!decided.has(f.id) && !placeholder(f) && f.name) { if (!keep.has(a)) keep.set(a, new Set()); keep.get(a).add(nameKey(f.name)); }
  const takenIn = a => keep.get(a) ?? keep.set(a, new Set()).get(a);
  const allTaken = new Set([...keep.values()].flatMap(s => [...s]));
  const pick = (a, language, kind, seed) => {
    for (let k = 0; k < 40; k++) {
      for (const c of generate(language, kind, `${seed}#${k}`)) {
        const key = nameKey(c.text);
        if (banned(c.text) || takenIn(a).has(key) || allTaken.has(key)) continue;
        return c;
      }
    }
    throw new Error(`no ${language} ${kind} name for ${seed}`);
  };
  for (const [id, e] of decided) {
    const a = arrayOf(m, id);
    const f = a ? m[a].find(x => x.id === id) : null;
    if (!f) continue;
    let name = e.name, meaning = e.meaning ?? null;
    if (!name) { const c = pick(a, e.language, e.generate?.kind ?? 'region', id); name = c.text; meaning = c.gloss ?? null; }
    const old = f.name;
    if (old === name) continue;
    takenIn(a).add(nameKey(name)); allTaken.add(nameKey(name));
    entries.push({ id, array: a, oldName: old, newName: name, language: e.language ?? null, meaning, reason: e.reason, source: e.source ?? 'geography', ...(e.name ? {} : { generated: 'tools/content/modules/names.mjs placeNames, current layer' }) });
  }
  // placeholder islands: a drawn label beside the island, else a generated name in its region's language
  const labelled = islandLabels(m, labels, allTaken);
  const nearestRegion = isl => (isl.regions ?? [])[0] ?? null;
  for (const isl of m.lands.filter(placeholder).sort((p, q) => p.id.localeCompare(q.id))) {
    if (decided.has(isl.id)) continue;
    const lab = labelled.get(isl.id);
    let name, language = null, meaning = null, reason, source;
    if (lab && LABEL_RENAMES[lab.name]) {
      const r = LABEL_RENAMES[lab.name];
      name = r.name; language = r.language; meaning = r.meaning; reason = `${r.reason}; the owner's drawn label "${lab.name}" lies ${Math.round(lab.d)} px from the island`; source = `${r.source}; docs/name_table.md (${lab.label.scan}, ${lab.label.at.join(', ')})`;
    } else if (lab) {
      name = lab.name; reason = `the owner's drawn island label, ${Math.round(lab.d)} px from the island through the registered ${SCAN_SHEETS[lab.label.scan]} sheet`;
      source = `docs/name_table.md (${lab.label.scan}, ${lab.label.at.join(', ')})`;
    } else {
      language = REGION_LANGUAGE[nearestRegion(isl)] ?? 'aenoran';
      const c = pick('lands', language, 'region', isl.id);
      name = c.text; meaning = c.gloss ?? null; reason = 'a placeholder name; no drawn label lies beside the island'; source = 'tools/content/modules/names.mjs placeNames, current layer';
    }
    takenIn('lands').add(nameKey(name)); allTaken.add(nameKey(name));
    entries.push({ id: isl.id, array: 'lands', oldName: isl.name, newName: name, language, meaning, reason, source });
  }
  entries.sort((p, q) => p.array.localeCompare(q.array) || p.id.localeCompare(q.id));
  return {
    schemaVersion: 1,
    name: 'Aoaz geography rename table',
    generatedBy: 'tools/content/geography/name_table.mjs (deterministic; regenerate, do not edit by hand)',
    appliedBy: 'tools/content/geography/repair_model.mjs (applyNameTable): the feature takes newName and keeps oldName as formerLabel',
    decisions: OWNER.map(e => e.reason),
    counts: Object.fromEntries([...new Set(entries.map(e => e.array))].map(a => [a, entries.filter(e => e.array === a).length])),
    entries,
  };
}

/** The language generator as `generate`: candidates in the current layer of one language. */
export async function generatorFromNames() {
  const N = await import('../modules/names.mjs');
  return (language, kind, seed) => N.placeNames({ language }, kind, 3, { seed: `geo:${seed}:`, layers: false });
}

/** A model with the table's names taken back (each renamed feature gets its former label again), to rebuild the table. */
export function unapplyNames(m) {
  for (const a of FEATURE_ARRAYS) for (const f of m[a] ?? []) if (f.renamedBy === 'name_table' && f.formerLabel) { f.name = f.formerLabel; delete f.formerLabel; delete f.renamedBy; delete f.nameLanguage; delete f.nameMeaning; }
  return m;
}
async function main(argv) {
  const args = argv.slice(2);
  const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const model = unapplyNames(JSON.parse(readFileSync(opt('--model') ?? path.join(here, '../data/geography/aoaz.repaired.json'), 'utf8')));
  const labels = parseLabels(readFileSync(DEFAULT_LABELS_PATH, 'utf8'));
  const table = buildNameTable(model, labels, await generatorFromNames());
  const out = opt('--out') ?? DEFAULT_NAME_TABLE_PATH;
  writeFileSync(out, `${JSON.stringify(table, null, 1)}\n`);
  console.log(`${table.entries.length} renames: ${Object.entries(table.counts).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  const bySource = { label: 0, generated: 0, curated: 0 };
  for (const e of table.entries) { if (/name_table\.md/u.test(e.source)) bySource.label++; else if (/names\.mjs/u.test(e.source) || e.generated) bySource.generated++; else bySource.curated++; }
  console.log(`curated ${bySource.curated}, drawn labels ${bySource.label}, generated ${bySource.generated}`);
}
export { featureOf };
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv).catch(e => { console.error(e); process.exitCode = 1; });
