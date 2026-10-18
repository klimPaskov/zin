// The owner-editable country table docs/design/countries.csv: people, ruling ideology and stance per country.
// When the table is absent or a row is missing, defaults come from the drawings, the canon and each country's
// role. The politics step reads the same table for ruling parties and leaders.
import { readFile } from 'node:fs/promises';
import { PEOPLES, defaultPeople } from './peoples.mjs';
import { stanceIdeology } from './ideologies.mjs';

const BY_NAME = {
  Worshipdom: 'zin_shadow_worship', Yeldenne: 'zin_light_wardens', 'Magical Forest': 'zin_light_kinship',
  Volgan: 'zin_shadow_dread', Demon: 'zin_shadow_dread', Dolon: 'zin_shadow_dread', Nezer: 'zin_shadow_dread', Zol: 'zin_shadow_grave',
  Aenor: 'zin_dom_court', Goldoroth: 'zin_dom_conquest', Stabilo: 'zin_dom_crown', Noris: 'zin_dom_crown', Lerendor: 'zin_dom_crown', Coldor: 'zin_dom_crown', Dondor: 'zin_dom_warlord', Isengard: 'zin_dom_warlord', Molot: 'zin_dom_warlord', Nan: 'zin_dom_warlord',
  Selen: 'zin_light_wardens', Hiloron: 'zin_light_wardens', Kilinti: 'zin_light_wardens', Mirolon: 'zin_light_wardens', 'Bloody Forest': 'zin_wild_tribes', 'Cursed Lands': 'zin_wild_seclusion', Titanos: 'zin_wild_clans',
};
const BY_PEOPLE = { elves: 'zin_light_kinship', sun_elves: 'zin_light_sanctuary', ents: 'zin_light_wardens', giants: 'zin_wild_clans', yeti: 'zin_wild_clans', trolls: 'zin_wild_tribes', orcs: 'zin_wild_tribes', the_dead: 'zin_shadow_grave', demons: 'zin_shadow_dread' };
// Countries the earlier map build marked democratic stay councils of the Light.
const defaultStance = (c, people) => BY_NAME[c.name] ?? BY_PEOPLE[people] ?? (c.ideology === 'democratic' ? 'zin_light_council' : c.scan === 'Cold Lands' || c.scan === 'Tritons Islands' ? 'zin_wild_clans' : 'zin_wild_freeholds');

export async function loadCountryTable(countries, csvPath) {
  let csv = null; try { csv = await readFile(csvPath, 'utf8'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const owner = new Map();
  if (csv) for (const line of csv.trim().split(/\r?\n/).slice(1)) {
    const [tag, name, people, , stance] = line.split(',');
    if (!PEOPLES[people]) throw new Error(`Unknown people ${people} for ${tag} in countries.csv`);
    if (!stanceIdeology[stance]) throw new Error(`Unknown stance ${stance} for ${tag} in countries.csv`);
    // Rows match by country name first: tags follow the politics order and shift when countries are added.
    owner.set(`name:${name}`, { people, stance }); owner.set(tag, { people, stance, name });
  }
  return new Map(countries.map(c => {
    const row = owner.get(`name:${c.name.replace(/,/g, ' ')}`) ?? (owner.get(c.tag)?.name === c.name.replace(/,/g, ' ') ? owner.get(c.tag) : undefined);
    const people = row?.people ?? defaultPeople(c), stance = row?.stance ?? defaultStance(c, people);
    return [c.tag, { people, stance, ideology: stanceIdeology[stance] }];
  }));
}

export function writeCountryTable(staged, countries, table) {
  staged.text('docs/design/countries.csv', 'tag,country,people,ideology,stance\n' + countries.map(c => { const t = table.get(c.tag); return `${c.tag},${c.name.replace(/,/g, ' ')},${t.people},${t.ideology},${t.stance}`; }).join('\n'));
}
