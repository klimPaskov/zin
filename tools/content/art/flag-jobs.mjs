// Image-generation jobs for every country flag: 16 heraldic flags per sheet, each described from the country's
// alignment, people, stance and region. Deterministic: the same table yields the same prompts and cell map.
//   node tools/content/art/flag-jobs.mjs [outDir]   -> <outDir>/flags-jobs.json and flags-cells.json (default: <ZIN_ART>/jobs)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rng } from '../lib/core.mjs';
import { loadCountryTable } from '../modules/countries.mjs';
import { ZIN, ART } from '../lib/paths.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(here, 'flag-jobs.mjs');
const outDir = path.resolve(isMain && process.argv[2] ? process.argv[2] : `${ART}/jobs`);

const TINCTURES = {
  democratic: ['white', 'sky blue', 'royal blue', 'forest green', 'gold', 'silver', 'cream'],
  fascism: ['crimson', 'gold', 'black', 'deep purple', 'white', 'burgundy', 'bronze'],
  communism: ['black', 'blood red', 'ash grey', 'deep violet', 'bone white', 'charcoal'],
  neutrality: ['ochre', 'brown', 'moss green', 'slate blue', 'tan', 'rust red', 'grey'],
};
const DIVISIONS = ['a plain field', 'a field per pale', 'a field per fess', 'a field per bend', 'a quarterly field', 'a field with a chevron', 'a field with a Nordic cross', 'a field with a broad central band', 'a field per saltire', 'a field with a bordure'];
const REGION = {
  'Cold Lands': ['snowy peaks', 'a white wolf', 'a brown bear', 'an ice crystal', 'a pine tree', 'a ram head', 'an elk', 'a war hammer', 'a frost star', 'a mammoth'],
  'West-Earth': ['a boar', 'a stag', 'a wheat sheaf', 'a horse', 'a stone bridge', 'an oak tree', 'a plough', 'a hunting horn', 'a falcon', 'a millwheel'],
  'Tritons Islands': ['a sailing ship', 'a gull', 'an anchor', 'a trident', 'a whale', 'a scallop shell', 'a lighthouse', 'a sea serpent', 'a pearl', 'a dolphin'],
  'East-Earth': ['a tower', 'a key', 'a griffin', 'a rose', 'a lion', 'a mountain pass gate', 'a lantern', 'crossed swords', 'a bell', 'an eagle'],
  'Dark Lands': ['a wolf skull', 'a black tree', 'a serpent', 'a war axe', 'a spider', 'a raven', 'a broken sword', 'a horned helm', 'a bat', 'a fanged maw'],
  'Rush Land': ['a lion', 'a golden sun', 'a wheat sheaf', 'a tower', 'a giant hammer', 'a running horse', 'an oak', 'a ranger bow', 'a lake with a crown', 'a portcullis'],
  'Rush Islands': ['a ship', 'a crowned tower', 'a gull', 'an anchor'],
  'Magical Lands': ['a crescent moon', 'a silver leaf', 'a unicorn', 'a mushroom', 'a dragon', 'a many-pointed star', 'an open eye', 'a phoenix feather', 'a crystal', 'a hawk'],
  'South-Earth': ['a camel', 'a palm tree', 'a scorpion', 'a desert sun', 'a falcon', 'a scimitar', 'a caravan lamp', 'an oasis', 'a lion', 'a jackal'],
  'Islands of The South': ['a sea turtle', 'a conch shell', 'a palm', 'a flying fish', 'a rising sun', 'a coral branch', 'an outrigger canoe', 'a parrot'],
  Sunhot: ['a radiant sun disc', 'a phoenix', 'a lotus', 'a flame', 'a golden bird', 'a sun-crowned spear', 'a temple dome', 'a golden tree'],
  'Dead Lands': ['a skull', 'crossed bones', 'a black flame', 'a bat', 'a raven', 'a horned skull', 'a broken crown', 'a coffin nail'],
  'Ocean of Edvoid': ['a black skull on a starless void'],
};
const PEOPLE = { elves: 'a slender silver leaf or star', sun_elves: 'a radiant golden sun', giants: 'a giant mountain or great hammer', ents: 'an ancient tree with spreading roots', yeti: 'a white clawed paw on snow', trolls: 'a spiked club', orcs: 'tusks or a crude axe', the_dead: 'a skull', demons: 'horns and a burning eye' };
const ALIGN = { democratic: 'a bright, noble realm of the Light', fascism: 'a proud crowned dominion', communism: 'a sinister realm of Shadow', neutrality: 'an unaligned wild realm' };

export async function flagJobs() {
  const { countries } = JSON.parse(await readFile(path.join(here, '../data/countries.json'), 'utf8'));
  const table = await loadCountryTable(countries, `${ZIN}/docs/design/countries.csv`);
  const describe = (c, used) => {
    const t = table.get(c.tag), r = rng(`flagdesc:${c.tag}`), pal = TINCTURES[t.ideology];
    const a = pal[Math.floor(r() * pal.length)]; let b = pal[Math.floor(r() * pal.length)]; if (b === a) b = pal[(pal.indexOf(a) + 3) % pal.length];
    const div = c.name === 'Zol' ? 'a pure black field' : DIVISIONS[Math.floor(r() * DIVISIONS.length)];
    const motifs = REGION[c.scan] ?? REGION['Rush Land'];
    const charge = c.name === 'Aenor' ? 'a radiant golden crown above a golden sun, ringed by small stars' : c.name === 'Volgan' ? 'a horned black skull wreathed in red flame' : c.name === 'Worshipdom' ? 'an ashen eye inside a ring of chains' : c.name === 'Yeldenne' ? 'a castle keep holding a glowing green gem' : t.people !== 'men' && r() < 0.6 && !used.has(PEOPLE[t.people]) ? PEOPLE[t.people] : (() => { const start = Math.floor(r() * motifs.length); for (let k = 0; k < motifs.length; k++) { const m = motifs[(start + k) % motifs.length]; if (!used.has(m)) return m; } return motifs[start]; })();
    used.add(charge);
    return `${ALIGN[t.ideology]}: ${div} in ${a} and ${b} with ${charge}`;
  };
  const jobs = [], cells = [];
  for (let s = 0; s * 16 < countries.length; s++) {
    const group = countries.slice(s * 16, s * 16 + 16), id = `flags-sheet-${String(s + 1).padStart(2, '0')}`;
    const rows = [0, 1, 2, 3].map(row => group.slice(row * 4, row * 4 + 4)).filter(g => g.length);
    const used = new Set(); // no two flags on one sheet share a charge
    const lines = rows.map((g, row) => `Row ${row + 1}, left to right: ${g.map((c, i) => `${row * 4 + i + 1}. ${describe(c, used)}.`).join(' ')}`).join('\n');
    const prompt = `A flat asset sheet of ${group.length} distinct fantasy heraldic national flags for a medieval-fantasy strategy game, arranged in an exact 4 columns by ${rows.length} rows grid. The background is solid flat pure black (#000000) everywhere between and around the flags: no glow, no blur, no gradient, no texture in the background. Every flag is a perfectly flat, front-facing rectangle with a 3:2 aspect ratio, all flags exactly the same size and evenly spaced with identical black gutters, no perspective, no waving, no shadows, no frames, no text, no letters, no numbers, no labels anywhere. Painted heraldic style with crisp bold shapes, a subtle woven-cloth texture inside each flag, rich medieval tinctures; every flag clearly different from the others.\n${lines}`;
    // A sheet that kept the black layout guides the others; the layout check rejects any sheet that does not.
    const layoutRef = path.join(outDir, '../raw/flags/flags-sheet-01.png').split(path.sep).join('/');
    jobs.push({ id, prompt: s === 0 ? prompt : `Image 1 is ONLY a layout reference: copy its solid pure black background, its 4-column grid, its flag size and its spacing exactly, but paint completely new flags as described below and copy none of its designs.
${prompt}`, references: s === 0 ? [] : [layoutRef], out: path.join(outDir, '../raw/flags', `${id}.png`).split(path.sep).join('/'), size: '1536x1024', quality: 'high', check: { expected: group.length, cols: 4, rows: rows.length, aspect: [1.1, 2.2], minAreaFraction: 1 / 3 } });
    group.forEach((c, i) => cells.push({ sheet: id, index: i, row: Math.floor(i / 4), col: i % 4, rows: rows.length, tag: c.tag, name: c.name }));
  }
  return { jobs, cells };
}

if (isMain) {
  const { jobs, cells } = await flagJobs();
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'flags-jobs.json'), JSON.stringify(jobs, null, 1));
  await writeFile(path.join(outDir, 'flags-cells.json'), JSON.stringify(cells, null, 1));
  console.log(JSON.stringify({ sheets: jobs.length, flags: cells.length }));
}
