// Regenerates tools/content/data/mech_journey_geography.json from the mod's own map files, never by hand:
//   node tools/content/write_journey_geography.mjs        (run again when the map or the states change)
// The Middle Lands and Aenor Isle state lists, their ports (the port province the starting force of a landing is placed in), the
// five westernmost mainland ports (the shore the Western Crossing lands on), and the strategic regions that hold Middle Lands states
// (the AI area of the crossing). The Western Crossing module reads only this file, so a build never depends on the map being present.
// When the key-sites module (sites.mjs, E7) ships docs/design/map/sites_resolved.json the module reads the lists from it instead.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZIN } from './lib/paths.mjs';
import { readStates } from './write_forces_geography.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, 'data/mech_journey_geography.json');
const readJson = async rel => JSON.parse(await readFile(path.join(here, rel), 'utf8'));

export async function buildJourneyGeography() {
  const { countries } = await readJson('data/countries.json');
  const economy = await readJson('data/economy.json');
  const geo = (await readJson('data/forces_geography.json')).countries;
  const states = await readStates();
  const regionOf = tag => { const c = countries.find(x => x.tag === tag); return c ? economy.regionByRoster[c.scan] : null; };
  const isleTags = new Set(countries.filter(c => c.scan === 'Rush Islands').map(c => c.tag));
  const rows = [];
  for (const [tag, list] of Object.entries(geo)) if (regionOf(tag) === 'middle_lands') for (const s of list) rows.push({ id: s.id, tag, port: s.port, x: s.centre ? s.centre[0] : null, isle: isleTags.has(tag) });
  rows.sort((a, b) => a.id - b.id);
  const mainland = rows.filter(r => !r.isle), isle = rows.filter(r => r.isle);
  const ports = mainland.filter(r => r.port !== null).sort((a, b) => a.x - b.x || a.id - b.id);
  const shore = ports.slice(0, 5).map(({ id, tag, port }) => ({ id, tag, port }));
  const provinceOf = new Map();
  for (const s of states) for (const p of s.provinces) provinceOf.set(p, s.id);
  const middle = new Set(rows.map(r => r.id));
  const regions = new Set();
  const dir = path.join(ZIN, 'map/strategicregions');
  for (const f of (await readdir(dir)).filter(n => n.endsWith('.txt')).sort()) {
    const t = await readFile(path.join(dir, f), 'utf8');
    const id = Number(/\bid\s*=\s*(\d+)/.exec(t)?.[1]);
    const provs = (/provinces\s*=\s*\{([^}]*)\}/.exec(t)?.[1] ?? '').trim().split(/\s+/).filter(Boolean).map(Number);
    if (provs.some(p => middle.has(provinceOf.get(p)))) regions.add(id);
  }
  return {
    schema: 1,
    owner: 'tools/content/write_journey_geography.mjs; regenerate with node tools/content/write_journey_geography.mjs, never by hand',
    note: 'Middle Lands states (economy region middle_lands): mainland and Aenor Isle, their port provinces, the five westernmost mainland ports (the Western Crossing\'s shore, proposed rule of the key-sites table), and the strategic regions that hold them. Source: history/states, map/strategicregions, forces_geography.json, countries.json.',
    mainland: mainland.map(r => r.id),
    isle: isle.map(({ id, tag, port }) => ({ id, tag, port })),
    ports: ports.map(({ id, tag, port }) => ({ id, tag, port })),
    shore,
    strategicRegions: [...regions].sort((a, b) => a - b),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const g = await buildJourneyGeography();
  await writeFile(OUT, JSON.stringify(g, null, 1) + '\n');
  console.log(JSON.stringify({ mainland: g.mainland.length, isle: g.isle.length, ports: g.ports.length, shore: g.shore.length, strategicRegions: g.strategicRegions.length }));
}
