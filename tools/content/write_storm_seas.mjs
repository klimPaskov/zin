// Regenerates tools/content/data/storm_seas.json from the mod's own map files, never by hand (docs/specs/03_gameplay/04_magic_and_world_systems.md,
// "The Ember Lands: storms and heat"):
//   node tools/content/write_storm_seas.mjs           writes the snapshot
//   node tools/content/write_storm_seas.mjs --check   exits 1 when the map's storm belt differs from the snapshot
// The storm belt is every sea strategic region that holds a sea province touching (on map/provinces.bmp) a land province of a state the
// roster gives to an Ember Lands realm (data/world/state_assignment.json). The world magic module (modules/world_magic.mjs) reads only the
// snapshot, so a build never depends on the map; the test world_magic.test.mjs recomputes the belt and fails when the map has moved it, so
// a map change is reviewed before the storms follow it.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZIN } from './lib/paths.mjs';
import { stateOwners, countryTable } from './lib/roster.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const STORM_SEAS = path.join(here, 'data/storm_seas.json');
const OWNER = 'tools/content/write_storm_seas.mjs; regenerate with node tools/content/write_storm_seas.mjs, never by hand';

function bmpInfo(buf) {
  if (buf.toString('ascii', 0, 2) !== 'BM') throw new Error('provinces.bmp is not a BMP');
  const offset = buf.readUInt32LE(10), width = buf.readInt32LE(18), height = buf.readInt32LE(22), bpp = buf.readUInt16LE(28), compression = buf.readUInt32LE(30);
  if (bpp !== 24 || compression !== 0 || height <= 0) throw new Error(`Unsupported provinces.bmp (bpp ${bpp}, compression ${compression}, height ${height})`);
  return { offset, width, height, stride: Math.ceil(width * 3 / 4) * 4 };
}

async function stateProvinces(zin) {
  const out = new Map();
  for (const f of (await readdir(path.join(zin, 'history/states'))).filter(n => n.endsWith('.txt'))) {
    const t = await readFile(path.join(zin, 'history/states', f), 'utf8');
    const id = Number(/\bid\s*=\s*(\d+)/.exec(t)?.[1]);
    const provinces = (/\bprovinces\s*=\s*\{([^}]*)\}/.exec(t)?.[1] ?? '').trim().split(/\s+/).filter(Boolean).map(Number);
    if (Number.isInteger(id)) out.set(id, provinces);
  }
  return out;
}

async function seaRegions(zin) {
  const out = new Map();
  for (const f of (await readdir(path.join(zin, 'map/strategicregions'))).filter(n => n.endsWith('.txt'))) {
    const t = await readFile(path.join(zin, 'map/strategicregions', f), 'utf8');
    const id = Number(/\bid\s*=\s*(\d+)/.exec(t)?.[1]);
    for (const p of (/\bprovinces\s*=\s*\{([^}]*)\}/.exec(t)?.[1] ?? '').trim().split(/\s+/).filter(Boolean)) out.set(Number(p), id);
  }
  return out;
}

export async function computeStormSeas(zin = ZIN) {
  const realms = new Map(countryTable().map(c => [c.tag, c]));
  const owners = stateOwners();
  const emberStates = [...owners].filter(([, tag]) => realms.get(tag)?.region === 'ember_lands').map(([id]) => id).sort((a, b) => a - b);
  const provincesOf = await stateProvinces(zin);
  const ember = new Set(emberStates.flatMap(id => provincesOf.get(id) ?? []));
  const byColour = new Map(), type = new Map();
  for (const line of (await readFile(path.join(zin, 'map/definition.csv'), 'utf8')).split(/\r?\n/)) {
    const f = line.split(';');
    if (f.length < 5 || !/^\d+$/.test(f[0])) continue;
    byColour.set((Number(f[1]) << 16) | (Number(f[2]) << 8) | Number(f[3]), Number(f[0]));
    type.set(Number(f[0]), f[4]);
  }
  const buf = await readFile(path.join(zin, 'map/provinces.bmp'));
  const { offset, width, height, stride } = bmpInfo(buf);
  const idAt = (x, r) => { const o = offset + r * stride + x * 3; return byColour.get((buf[o + 2] << 16) | (buf[o + 1] << 8) | buf[o]); };
  const touched = new Set();
  const pair = (a, b) => {
    if (a === b || a === undefined || b === undefined) return;
    if (ember.has(a) && type.get(b) === 'sea') touched.add(b);
    else if (ember.has(b) && type.get(a) === 'sea') touched.add(a);
  };
  let below = new Array(width);
  for (let x = 0; x < width; x++) below[x] = idAt(x, 0);
  for (let r = 0; r < height; r++) {
    const row = new Array(width);
    for (let x = 0; x < width; x++) row[x] = idAt(x, r);
    for (let x = 0; x < width; x++) { if (x + 1 < width) pair(row[x], row[x + 1]); if (r > 0) pair(row[x], below[x]); }
    below = row;
  }
  const regionOf = await seaRegions(zin);
  const seas = [...new Set([...touched].map(p => regionOf.get(p)).filter(Number.isInteger))].sort((a, b) => a - b);
  return {
    schema: 1, owner: OWNER,
    note: 'The storm belt of the Ember Lands: the sea strategic regions that hold a sea province touching a land province of an Ember Lands realm\'s state (data/world/state_assignment.json). Source: history/states, map/definition.csv, map/provinces.bmp, map/strategicregions. A map change that moves the belt fails world_magic.test.mjs until this file is regenerated and reviewed.',
    seas, coastSeaProvinces: touched.size, emberStates,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const fresh = await computeStormSeas();
  if (process.argv.includes('--check')) {
    const old = JSON.parse(await readFile(STORM_SEAS, 'utf8'));
    const same = JSON.stringify(old.seas) === JSON.stringify(fresh.seas);
    console.log(JSON.stringify({ same, snapshot: old.seas, map: fresh.seas }));
    process.exit(same ? 0 : 1);
  }
  await writeFile(STORM_SEAS, JSON.stringify(fresh, null, 1) + '\n');
  console.log(JSON.stringify({ seas: fresh.seas.length, coastSeaProvinces: fresh.coastSeaProvinces, emberStates: fresh.emberStates.length }));
}
