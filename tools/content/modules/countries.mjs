// The country table: people, ruling ideology and stance per realm. The realms come from the roster (lib/roster.mjs): each realm's game
// people (the people whose kit the builder ships; see GAME_PEOPLE there) and its stance (tools/content/data/world/characters/<region>.json).
// The owner-editable docs/design/countries.csv, which the builder also writes, may override a realm's people and stance: a row counts
// when its tag and name are those of a realm of the roster, so the rows of the retired debug-tag table (Y01 ...) are ignored.
// The politics step reads the same table for ruling parties and leaders.
import { readFile } from 'node:fs/promises';
import { PEOPLES, defaultPeople } from './peoples.mjs';
import { stanceIdeology } from './ideologies.mjs';

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
