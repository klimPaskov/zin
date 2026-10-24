// The one loader of the country table (requirements R-20 to R-29, R-27). Every module reads the realms of Aoaz through it.
//
//   loadRoster()             -> { realms, migration, countries, byTag, byKey, byName, regions, calendars, dynamicTags }
//   countryTable()           -> the country table: one row per realm, in roster order (see `row` below)
//   successor(ref)           -> what became of an old country (its Y-tag or its old name): { fate, keys, primary, reason }
//   cultureRows()            -> the culture, second culture, language, dialect and faith of every realm (the shape of the
//                               retired country_cultures.json rows)
//   stateAssignment()        -> data/world/state_assignment.json (the old map's states given to the new realms)
//
// Sources, all under tools/content/data/world/: roster.json (realms and the migration of the 305 old rows), state_assignment.json
// (written by tools/migrations/roster_state_assignment.mjs), characters/<region>.json (the stance of each realm), cultures.json
// (the dialect of each culture). The table is a pure function of these files, so the same data gives the same bytes.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stanceIdeology } from '../modules/ideologies.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const WORLD = path.join(here, '../data/world');
export const ROSTER_FILE = path.join(WORLD, 'roster.json');
export const STATE_ASSIGNMENT_FILE = path.join(WORLD, 'state_assignment.json');
// The old 305-row table of the earlier map build, kept as a record: the state assignment reads its capitals, the loader its scan labels.
export const LEGACY_FILE = path.join(WORLD, 'legacy_countries.json');
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));

// The region label the earlier map build gave each region (the drawn sheet it was scanned from). Modules that still group
// countries by sheet (economy regions, flag motifs, journey geography) read it as `scan`; a realm whose main former row was
// scanned from another sheet keeps that row's label (Orohaf on Aenor Isle, Dunelaeth from the Magical Lands sheet).
export const LEGACY_SCAN = {
  middle_lands: 'Rush Land', north_lands: 'East-Earth', cold_lands: 'Cold Lands', west_lands: 'West-Earth', dark_lands: 'Dark Lands',
  ember_lands: 'Ember Lands', east_lands: 'South-Earth', south_lands: 'South-Earth', islands_of_the_south: 'Islands of The South',
  tritons_islands: 'Tritons Islands', lands_of_the_sun: 'Sunhot', magical_lands: 'Magical Lands', zols_mistake: 'Kusmeel',
};

// The game people of a realm: the people whose idea, emblem, portraits, troops and technologies the builder ships. The roster
// names peoples the game has no kit for yet (no emblem, portraits, sub-units or modifiers); until the peoples spec adds them
// (docs/specs/00_foundation/03_peoples.md, phase 3) each borrows the kit named here, and the realm keeps its own `people`.
// Listed in docs/plans/zin-art/pending_from_integration.md.
export const GAME_PEOPLE = {
  dwarves: 'men',          // Common Folk like men (03_peoples.md); the dwarf kit is reserved
  gnomes: 'men',
  small_folk: 'men',
  goblins: 'orcs',         // the builder's people "Orcs and Goblins"
  hobgoblins: 'orcs',
  dwarf_goblins: 'orcs',
  ogres: 'orcs',
  tree_people: 'ents',     // the Baelim are tree people, kin in kind to the ents
  mycids: 'elves',         // the peoples spec's proposal: mycids live inside an elven realm's kit
};
export const KIT_PEOPLE = ['men', 'elves', 'sun_elves', 'giants', 'ents', 'yeti', 'trolls', 'orcs', 'the_dead', 'demons'];
export const gamePeopleOf = people => (KIT_PEOPLE.includes(people) ? people : GAME_PEOPLE[people] ?? (() => { throw new Error(`No game people for the roster people ${people}`); })());

let cache = null;
// Forget the cached table (a test that plants a file reloads).
export function resetRoster() { cache = null; }

function loadStances() {
  const dir = path.join(WORLD, 'characters'), out = new Map();
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).filter(n => n.endsWith('.json')).sort()) for (const r of readJson(path.join(dir, f))) out.set(r.key, r.stance);
  return out;
}

// The owner of every state of the map at the start: the realm the state assignment gives it (the map files still name the old tags).
export function stateOwners() {
  const a = loadRoster().assignment;
  if (!a) throw new Error('roster: data/world/state_assignment.json is missing (run node tools/migrations/roster_state_assignment.mjs --apply)');
  return new Map(a.states.map(s => [s.id, s.owner]));
}

export function stateAssignment() {
  return existsSync(STATE_ASSIGNMENT_FILE) ? readJson(STATE_ASSIGNMENT_FILE) : null;
}

export function loadRoster() {
  if (cache) return cache;
  const roster = readJson(ROSTER_FILE);
  const cultures = readJson(path.join(WORLD, 'cultures.json')).cultures;
  const stances = loadStances();
  const assignment = stateAssignment();
  const byKeyRealm = new Map(roster.realms.map(r => [r.key, r]));
  const formerOf = new Map(roster.realms.map(r => [r.key, roster.migration.filter(m => m.into.includes(r.key))]));
  const statesOf = new Map(), capitalOf = new Map();
  if (assignment) {
    for (const s of assignment.states) (statesOf.get(s.owner) ?? statesOf.set(s.owner, []).get(s.owner)).push(s.id);
    for (const c of assignment.capitals) capitalOf.set(c.tag, c.state);
  }
  // The old rows a realm continues (kept or renamed) come first, then those merged into it, then splits and removed rows.
  const FATE_ORDER = { kept: 0, renamed: 0, merged: 1, split: 2, removed: 3 };
  const countries = roster.realms.map(r => {
    const former = [...formerOf.get(r.key)].sort((a, b) => FATE_ORDER[a.fate] - FATE_ORDER[b.fate]);
    const main = former.find(m => m.fate === 'kept' || m.fate === 'renamed') ?? null;
    const overlord = r.overlord ? byKeyRealm.get(r.overlord) : null;
    if (r.overlord && !overlord) throw new Error(`roster: ${r.key} names an unknown overlord ${r.overlord}`);
    const stance = stances.get(r.key) ?? null;
    const states = statesOf.get(r.tag) ?? [];
    return {
      tag: r.tag, key: r.key, name: r.name, adjective: r.adjective, endonym: r.endonym ?? null,
      region: r.region, regionName: roster.regions[r.region], subRegion: r.subRegion,
      scan: null, // filled below from the main former row
      regions: [],
      capital: r.capital?.name ?? null, capitalSite: r.capital?.siteId ?? null, capitalState: capitalOf.get(r.tag) ?? null,
      states: states.length, stateIds: states.sort((a, b) => a - b),
      overlord: overlord?.name ?? null, overlordKey: overlord?.key ?? null, overlordTag: overlord?.tag ?? null, subjectType: r.subjectType ?? null,
      people: r.people, gamePeople: gamePeopleOf(r.people), peoples: r.peoples,
      culture: r.culture, cultureSecondary: r.cultureSecondary ?? null, language: r.language ?? null, dialect: cultures[r.culture]?.dialect ?? null,
      faith: r.faith?.id ?? null, faithName: r.faith?.name ?? null, pantheon: r.faith?.pantheon ?? null, calendar: r.calendar,
      politicalForm: r.politicalForm, governmentNote: r.governmentNote ?? null, population: r.population,
      focusTier: r.focusTier, focusTree: r.focusTree, mechanics: r.mechanics ?? [], storyRole: r.storyRole ?? null,
      gunpowder: !!r.gunpowder, heraldry: r.heraldry ?? null,
      stance, ideology: stance ? stanceIdeology[stance] : null,
      formerTags: former.map(m => m.oldTag), formerNames: former.map(m => m.oldName), mainFormerTag: main?.oldTag ?? null, formerFates: former.map(m => m.fate),
    };
  });
  // The legacy scan label and the old region names (the names generator keeps them reserved) come from the old table.
  const legacy = new Map(readJson(LEGACY_FILE).countries.map(c => [c.tag, c]));
  for (const c of countries) {
    const main = legacy.get(c.mainFormerTag) ?? legacy.get(c.formerTags[0]);
    c.scan = main?.scan ?? LEGACY_SCAN[c.region];
    c.regions = [...new Set(c.formerTags.flatMap(t => legacy.get(t)?.regions ?? []))];
  }
  const byTag = new Map(countries.map(c => [c.tag, c])), byKey = new Map(countries.map(c => [c.key, c])), byName = new Map(countries.map(c => [c.name, c]));
  if (byTag.size !== countries.length) throw new Error('roster: two realms share a tag');
  if (byName.size !== countries.length) throw new Error('roster: two realms share a name');
  const byOldTag = new Map(roster.migration.map(m => [m.oldTag, m])), byOldName = new Map(roster.migration.map(m => [m.oldName, m]));
  cache = { realms: roster.realms, migration: roster.migration, countries, byTag, byKey, byName, byOldTag, byOldName, regions: roster.regions, calendars: roster.calendars, dynamicTags: roster.dynamicTags, assignment };
  return cache;
}

export const countryTable = () => loadRoster().countries;

// What became of an old country, named by its debug tag (Y01) or its old name (Isengard). `primary` is the realm that took its land
// and its role (the first target of the migration row: the realm it continues, the realm it joined, the first realm of a split, or
// the realm or wild land a removed row's land went to); null when nothing took its role.
export function successor(ref) {
  const R = loadRoster();
  const m = R.byOldTag.get(ref) ?? R.byOldName.get(ref);
  if (!m) return null;
  const keys = [...m.into];
  if (!keys.length && R.assignment) {
    const holder = R.assignment.removed?.find(x => x.oldTag === m.oldTag)?.holder;
    if (holder) keys.push(holder);
  }
  return { oldTag: m.oldTag, oldName: m.oldName, fate: m.fate, keys, primary: keys[0] ?? null, tags: keys.map(k => R.byKey.get(k).tag), reason: m.reason };
}

// The culture rows of every realm, in the shape of the retired data/world/country_cultures.json (country, tag, region, people,
// culture, culture_secondary, language, dialect, faith).
export function cultureRows() {
  return countryTable().map(c => ({ country: c.name, tag: c.tag, region: c.regionName, people: c.people, culture: c.culture, culture_secondary: c.cultureSecondary, language: c.language, dialect: c.dialect, faith: c.faith }));
}
