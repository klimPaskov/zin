// Regenerates tools/content/data/forces_geography.json from the mod's own map files, never by hand:
//   node tools/content/write_forces_geography.mjs        (run again when the map or the states change)
// For every state: its owner, the province that carries its victory point (where a garrison stands), the port province
// (the land province that holds one of the state's naval_base_spawn points in map/buildings.txt, found by reading
// map/provinces.bmp at that point) and the centre of its building points. The forces module (modules/forces.mjs) reads only
// this file, so a build never depends on the map being present.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZIN } from './lib/paths.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, 'data/forces_geography.json');

// 24-bit uncompressed BMP, bottom-up rows padded to four bytes: the pixel at map point (x, z) sits in row z from the bottom.
function pixelReader(buf) {
  if (buf.toString('ascii', 0, 2) !== 'BM') throw new Error('provinces.bmp is not a BMP');
  const offset = buf.readUInt32LE(10), width = buf.readInt32LE(18), height = buf.readInt32LE(22), bpp = buf.readUInt16LE(28), compression = buf.readUInt32LE(30);
  if (bpp !== 24 || compression !== 0 || height <= 0) throw new Error(`Unsupported provinces.bmp (bpp ${bpp}, compression ${compression}, height ${height})`);
  const stride = Math.ceil(width * 3 / 4) * 4;
  return { width, height, at: (x, z) => { const xi = Math.min(width - 1, Math.max(0, Math.floor(x))), r = Math.min(height - 1, Math.max(0, Math.floor(z))), o = offset + r * stride + xi * 3; return (buf[o + 2] << 16) | (buf[o + 1] << 8) | buf[o]; } };
}

export async function readStates(dir = path.join(ZIN, 'history/states')) {
  const states = [];
  for (const f of (await readdir(dir)).filter(n => n.endsWith('.txt')).sort((a, b) => a.localeCompare(b, 'en'))) {
    const t = await readFile(path.join(dir, f), 'utf8');
    const id = Number(/\bid\s*=\s*(\d+)/.exec(t)?.[1]), owner = /\bowner\s*=\s*([A-Za-z0-9]+)/.exec(t)?.[1];
    const provinces = (/\bprovinces\s*=\s*\{([^}]*)\}/.exec(t)?.[1] ?? '').trim().split(/\s+/).filter(Boolean).map(Number);
    const vps = [...t.matchAll(/victory_points\s*=\s*\{\s*(\d+)\s+(\d+)\s*\}/g)].map(m => ({ province: Number(m[1]), value: Number(m[2]) }));
    if (!Number.isInteger(id) || !owner || !provinces.length) throw new Error(`State file ${f} has no id, owner or provinces`);
    states.push({ id, owner, provinces, vps });
  }
  return states.sort((a, b) => a.id - b.id);
}

export async function buildGeography() {
  const states = await readStates();
  const def = new Map();
  for (const line of (await readFile(path.join(ZIN, 'map/definition.csv'), 'utf8')).split(/\r?\n/)) {
    const f = line.split(';');
    if (f.length < 5 || !/^\d+$/.test(f[0])) continue;
    def.set((Number(f[1]) << 16) | (Number(f[2]) << 8) | Number(f[3]), { id: Number(f[0]), type: f[4] });
  }
  const bmp = pixelReader(await readFile(path.join(ZIN, 'map/provinces.bmp')));
  const spawns = new Map(), points = new Map();
  for (const line of (await readFile(path.join(ZIN, 'map/buildings.txt'), 'utf8')).split(/\r?\n/)) {
    const f = line.split(';');
    if (f.length < 7 || !/^\d+$/.test(f[0])) continue;
    const sid = Number(f[0]), x = Number(f[2]), z = Number(f[4]);
    (points.get(sid) ?? points.set(sid, []).get(sid)).push([x, z]);
    if (f[1] === 'naval_base_spawn') (spawns.get(sid) ?? spawns.set(sid, []).get(sid)).push({ x, z, sea: Number(f[6]) });
  }
  const out = {}, anomalies = [];
  let ports = 0;
  for (const s of states) {
    const own = new Set(s.provinces);
    const best = [...s.vps].sort((a, b) => b.value - a.value || a.province - b.province)[0];
    const pts = points.get(s.id) ?? [];
    const centre = pts.length ? [Math.round(pts.reduce((a, p) => a + p[0], 0) / pts.length), Math.round(pts.reduce((a, p) => a + p[1], 0) / pts.length)] : null;
    let port = null;
    for (const sp of spawns.get(s.id) ?? []) {
      const hit = def.get(bmp.at(sp.x, sp.z));
      if (hit && hit.type === 'land' && own.has(hit.id)) { port = hit.id; break; }
    }
    if ((spawns.get(s.id) ?? []).length && port === null) anomalies.push(s.id);
    if (port !== null) ports++;
    (out[s.owner] ??= []).push({ id: s.id, province: best ? best.province : s.provinces[0], vp: best ? best.value : 0, port, centre });
  }
  return { geography: { schema: 1, owner: 'tools/content/write_forces_geography.mjs; regenerate with node tools/content/write_forces_geography.mjs, never by hand', note: 'Per country tag: its states with the province that carries the victory point (province), that point\'s value (vp), the port province when a naval base point of the state lies in one of its land provinces (port), and the centre of the state\'s building points on the map (centre). Source: history/states, map/buildings.txt, map/provinces.bmp, map/definition.csv.', anomalies, countries: Object.fromEntries(Object.keys(out).sort((a, b) => a.localeCompare(b, 'en')).map(k => [k, out[k]])) }, ports, states: states.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { geography, ports, states } = await buildGeography();
  await writeFile(OUT, JSON.stringify(geography, null, 1) + '\n');
  console.log(JSON.stringify({ states, countries: Object.keys(geography.countries).length, portStates: ports, statesWithBaseButNoPortFound: geography.anomalies.length }));
}
