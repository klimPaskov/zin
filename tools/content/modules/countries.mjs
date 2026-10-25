// The country table and the country package of the realms of Aoaz.
//
// The table: people, ruling ideology and stance per realm. The realms come from the roster (lib/roster.mjs): each realm's game people
// (the people whose kit the builder ships; see GAME_PEOPLE there) and its stance (tools/content/data/world/characters/<region>.json).
// The owner-editable docs/design/countries.csv, which the builder also writes, may override a realm's people and stance: a row counts
// when its tag and name are those of a realm of the roster, so the rows of the retired debug-tag table (Y01 ...) are ignored.
//
// The package (buildCountryPackage, requirements R-20 to R-29): the tag table, each realm's country file, its history (capital, start
// setup, politics, the court recruited at the start, its subjects and its league), the realm names and the bookmark. The map
// generator's files of the retired debug-tag roster stay in the mod until the politics step retires them (lib/roster.mjs
// SUPERSEDED_WORLD_FILES; docs/plans/roster_integration/transition.md).
import { readFile } from 'node:fs/promises';
import { readFileSync, readdirSync } from 'node:fs';
import { PEOPLES, defaultPeople } from './peoples.mjs';
import { stanceIdeology } from './ideologies.mjs';
import { START_DATE } from '../lib/calendar.mjs';
import { fullKey as techKey } from './technologies.mjs';

// Defaults for a country without a stance of its own (a synthetic test row); every realm of the roster has one.
const BY_NAME = {
  Worshipdom: 'zin_shadow_worship', Yeldenne: 'zin_light_wardens', 'Magical Forest': 'zin_light_kinship',
  Puvulan: 'zin_shadow_dread', Khorvrath: 'zin_shadow_dread', Dolon: 'zin_shadow_dread', Nezer: 'zin_shadow_dread', "Zol's Mistake": 'zin_shadow_grave',
  Aenor: 'zin_dom_court', Goldoroth: 'zin_dom_conquest', Stabilo: 'zin_dom_crown', Noris: 'zin_dom_crown', Lerendor: 'zin_dom_crown', Coldor: 'zin_dom_crown', Dondor: 'zin_dom_warlord', Melkgard: 'zin_dom_warlord', Molot: 'zin_dom_warlord', Nan: 'zin_dom_warlord',
  Selen: 'zin_light_wardens', Hirolon: 'zin_light_wardens', Kilinti: 'zin_light_wardens', Mirolon: 'zin_light_wardens', 'Bloody Forest': 'zin_wild_tribes', 'Cursed Lands': 'zin_wild_seclusion', Nivaros: 'zin_wild_clans',
};
const BY_PEOPLE = { elves: 'zin_light_kinship', sun_elves: 'zin_light_sanctuary', ents: 'zin_light_wardens', giants: 'zin_wild_clans', yeti: 'zin_wild_clans', trolls: 'zin_wild_tribes', orcs: 'zin_wild_tribes', the_dead: 'zin_shadow_grave', demons: 'zin_shadow_dread' };
const defaultStance = (c, people) => c.stance ?? BY_NAME[c.name] ?? BY_PEOPLE[people] ?? (c.ideology === 'democratic' ? 'zin_light_council' : c.scan === 'Cold Lands' || c.scan === 'Tritons Islands' ? 'zin_wild_clans' : 'zin_wild_freeholds');

export async function loadCountryTable(countries, csvPath) {
  let csv = null; try { csv = await readFile(csvPath, 'utf8'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const owner = new Map();
  if (csv) for (const line of csv.trim().split(/\r?\n/).slice(1)) {
    const [tag, name, people, , stance] = line.split(',');
    if (/^Y[0-9A-Z]{2}$/.test(tag)) continue; // a row of the retired debug-tag table
    if (!PEOPLES[people]) throw new Error(`Unknown people ${people} for ${tag} in countries.csv`);
    if (!stanceIdeology[stance]) throw new Error(`Unknown stance ${stance} for ${tag} in countries.csv`);
    owner.set(tag, { people, stance, name });
  }
  return new Map(countries.map(c => {
    const o = owner.get(c.tag), row = o && o.name === c.name.replace(/,/g, ' ') ? o : undefined;
    const people = row?.people ?? defaultPeople(c), stance = row?.stance ?? defaultStance(c, people);
    return [c.tag, { people, stance, ideology: stanceIdeology[stance], rosterPeople: c.people ?? people }];
  }));
}

export function writeCountryTable(staged, countries, table) {
  staged.text('docs/design/countries.csv', 'tag,country,people,ideology,stance\n' + countries.map(c => { const t = table.get(c.tag); return `${c.tag},${c.name.replace(/,/g, ' ')},${t.people},${t.ideology},${t.stance}`; }).join('\n'));
}

// ------------------------------------------------------------------------------------------------ the country package
//   buildCountryPackage(staged, { countries, table, recruits, factions, starts, zin, cultures, variants })
//     recruits  Map tag -> character ids recruited at the start (modules/characters.mjs, the chiefs of modules/institutions.mjs)
//     factions  the start leagues of the diplomacy module ({ id, leaderTag, memberTags })
//     starts    docs/design/technology/start_packages.json (technologies and doctrines by realm name; short technology keys)
//     variants  Map tag -> create_equipment_variant blocks of the starting fleet (modules/forces.mjs)
//     cultures  data/world/cultures.json cultures (the palette of a realm without an old map colour)
export const COUNTRY_TAGS_FILE = 'common/country_tags/01_zin_realms.txt';
const fileName = c => `${c.tag} - ${c.name.replace(/[^A-Za-z0-9' -]/g, '')}.txt`;
export const countryFile = c => `countries/${fileName(c)}`;
export const historyFile = c => `history/countries/${fileName(c)}`;
// The autonomy state of each kind of subject in the roster (diplomacy_subjects.json defines them).
export const AUTONOMY = { 'chartered dominion': 'zin_autonomy_chartered_dominion', 'sworn realm': 'zin_autonomy_sworn_realm', tributary: 'zin_autonomy_tributary_hold', protectorate: 'zin_autonomy_protectorate' };
// Popular support at the start by ruling ideology, as the earlier map build gave it.
const POPULARITY = {
  neutrality: { neutrality: 60, democratic: 20, fascism: 20, communism: 0 },
  democratic: { democratic: 60, neutrality: 25, fascism: 15, communism: 0 },
  fascism: { fascism: 60, neutrality: 25, democratic: 15, communism: 0 },
  communism: { communism: 60, fascism: 25, neutrality: 15, democratic: 0 },
};
// Start setup (the earlier map build: great powers four research slots and war support 0.4, everyone else three and 0.2).
const SETUP = { major: { slots: 4, war: 0.4 }, other: { slots: 3, war: 0.2 }, stability: 0.6, laws: ['limited_conscription', 'civilian_economy', 'export_focus'] };
// The bookmark's realms, by roster key: the great powers the earlier bookmark showed.
const BOOKMARK = [
  ['aenor', 'The Middle Kingdom: the Golden King\'s court at Parim, and the Concord of thirteen chartered dominions that hold its twenty-six seats.'],
  ['lerendor', 'The Leren crown at Sonargur, master of the Narrow Strait and of the northern seas.'],
  ['zols_mistake', 'A black land in the far north, where the dead walk the empty shores and the living do not go.'],
  ['puvulan', 'The oldest power of the Ember Lands, quiet behind its storms, with the demon realms sworn to it.'],
  ['coldor', 'The Winter Crown at Fandanar, first among the clan realms of the Cold Lands.'],
  ['noris', 'The desert crown of the East Lands, rival of Stabilo for the caravan roads.'],
  ['stabilo', 'The caravan princes of the East Lands, rivals of Noris for the gold of the southern roads.'],
];
const rgbOf = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

export function buildCountryPackage(staged, { countries, table, recruits = new Map(), factions = [], starts = null, zin, cultures = {}, variants = new Map() }) {
  const problems = [], byKey = new Map(countries.map(c => [c.key, c])), byTag = new Map(countries.map(c => [c.tag, c]));
  const oldCountries = new Map();
  for (const f of readdirSync(`${zin}/common/countries`)) { const m = /^(Y[0-9A-Z]{2}) - /.exec(f); if (m) oldCountries.set(m[1], readFileSync(`${zin}/common/countries/${f}`, 'utf8')); }
  const tagLines = [], loc = {};
  for (const c of countries) {
    const t = table.get(c.tag), ideology = t.ideology;
    // ---- tag and country file: the map colour of the row the realm continues, or its culture's first colour
    tagLines.push(`${c.tag} = "${countryFile(c)}"`);
    const old = c.mainFormerTag ? oldCountries.get(c.mainFormerTag) : null;
    const oldColor = old && /\bcolor\s*=\s*\{\s*(\d+)\s+(\d+)\s+(\d+)\s*\}/.exec(old);
    const palette = cultures[c.culture]?.palette;
    const color = oldColor ? oldColor.slice(1, 4).map(Number) : palette?.length ? rgbOf(palette[0]) : [128, 128, 128];
    staged.text(`common/${countryFile(c)}`, `# Generated by the ZIN content builder (modules/countries.mjs): ${c.name}.\ngraphical_culture = zin_${t.people}_gfx\ngraphical_culture_2d = western_european_2d\ncolor = { ${color.join(' ')} }\n`);
    // ---- history
    const H = [`# Generated by the ZIN content builder (modules/countries.mjs): ${c.name}, from the roster (data/world/roster.json), the state`, '# assignment, the characters and the start packages. The court is recruited before the politics are set.'];
    if (!c.capitalState) problems.push(`${c.name} has no capital state`);
    H.push(`capital = ${c.capitalState}`, `oob = "${c.tag}_world"`);
    const setup = c.focusTier === 'major' ? SETUP.major : SETUP.other;
    H.push(`add_ideas = { ${SETUP.laws.join(' ')} }`, `set_research_slots = ${setup.slots}`, `set_stability = ${SETUP.stability}`, `set_war_support = ${setup.war}`);
    const pack = starts?.countries?.[c.name];
    if (starts && !pack) problems.push(`${c.name} has no start package`);
    if (pack?.technologies?.length) H.push(`set_technology = {\n${pack.technologies.map(k => `\t${techKey(k)} = 1`).join('\n')}\n}`);
    if (pack?.landGrandDoctrine) H.push(`set_grand_doctrine = ${pack.landGrandDoctrine}`);
    if (pack?.navalGrandDoctrine) H.push(`set_grand_doctrine = ${pack.navalGrandDoctrine}`);
    if (pack?.navalSubDoctrine) H.push(`set_sub_doctrine = ${pack.navalSubDoctrine}`);
    // The starting ship variants the order of battle names (version_name): a modular hull has none until one is created.
    for (const v of variants.get(c.tag) ?? []) H.push(v);
    for (const id of recruits.get(c.tag) ?? []) H.push(`recruit_character = ${id}`);
    H.push(`set_politics = { ruling_party = ${ideology} last_election = "1746.3.1" election_frequency = 48 elections_allowed = no }`);
    H.push(`set_popularities = { ${Object.entries(POPULARITY[ideology]).map(([k, v]) => `${k} = ${v}`).join(' ')} }`);
    for (const s of countries.filter(x => x.overlordKey === c.key)) {
      const state = AUTONOMY[s.subjectType];
      if (!state) { problems.push(`${s.name}: no autonomy state for the subject type ${s.subjectType}`); continue; }
      H.push(`set_autonomy = {\n\ttarget = ${s.tag}\n\tautonomous_state = ${state}\n}`);
    }
    for (const f of factions.filter(x => x.leaderTag === c.tag)) {
      H.push(`create_faction_from_template = ${f.id}`);
      for (const m of f.memberTags) if (m !== c.tag) H.push(`add_to_faction = ${m}`);
    }
    staged.text(historyFile(c), H.join('\n') + '\n');
    // ---- names
    loc[c.tag] = c.name;
    loc[`${c.tag}_DEF`] = /^The /.test(c.name) ? `the ${c.name.slice(4)}` : c.name;
    loc[`${c.tag}_ADJ`] = c.adjective;
  }
  for (const f of factions) for (const m of f.memberTags) if (!byTag.has(m)) problems.push(`league ${f.id} names ${m}, which is not a realm`);
  // ---- the bookmark (a shared entry point of the map generator, which the builder writes)
  const book = BOOKMARK.map(([k, d]) => { const c = byKey.get(k); if (!c) problems.push(`bookmark: ${k} is not a realm`); return [c, d]; }).filter(([c]) => c);
  for (const [c, d] of book) loc[`${c.tag}_WORLD_DESC`] = d;
  loc.ZIN_BOOKMARK_NAME = 'The Fourth Age';
  loc.ZIN_BOOKMARK_DESC = 'Seventeen centuries after the fall of the Great Necromancer, the realms of Aoaz keep an old and uneasy peace. The Golden King feasts at Parim, the Leren crown watches the Narrow Strait, and in the south the Ember Lands are quiet. No war has been declared.';
  loc.ZIN_BOOKMARK_OTHER_DESC = 'One of the realms of Aoaz, with its own court, faith and quarrels.';
  if (problems.length) throw new Error(`The country package is invalid (${problems.length}):\n  ${problems.slice(0, 40).join('\n  ')}`);
  staged.text(COUNTRY_TAGS_FILE, `# Generated by the ZIN content builder (modules/countries.mjs): the realms of the roster (data/world/roster.json).\n${tagLines.join('\n')}\n`);
  const ideologyOf = c => table.get(c.tag).ideology;
  staged.text('common/bookmarks/world.txt', `bookmarks = { bookmark = { name = "ZIN_BOOKMARK_NAME" desc = "ZIN_BOOKMARK_DESC" date = ${START_DATE} picture = "GFX_zin_bookmark_fourth_age" default_country = "${book[0][0].tag}" default = yes\n${book.map(([c]) => ` "${c.tag}" = { history = "${c.tag}_WORLD_DESC" ideology = ${ideologyOf(c)} }`).join('\n')}\n "---" = { history = "ZIN_BOOKMARK_OTHER_DESC" } effect = { randomize_weather = 22345 } } }\n`);
  staged.loc('zin_realms', loc);
  return { realms: countries.length, subjects: countries.filter(c => c.overlordKey).length, leagues: factions.length };
}
