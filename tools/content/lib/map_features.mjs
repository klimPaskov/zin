// The named features of the map (capital sites, castle sites, regions) resolved to the states of the map that is in the mod now.
//
// The state table is keyed by geography features, not by state ids: a state id renumbers whenever the map is written, so every
// builder reference to a state names the feature it stands for (a site of tools/content/data/geography/import/aoaz.geography.json, a
// realm's capital point of tools/politics/data/create_world_call.json) and resolves it here, on the current history/states and
// map/provinces.bmp.
//
//   loadMap()                 -> { states, byId, provinceState, pixelAt, stateAtPoint, landStateNear, siteState, stateName }
//   siteState(siteId)         -> the state id under a geography site (its point, or the nearest land state of the map)
//   pointState(x, y)          -> the state id under a world pixel (5,120 x 2,560 frame, top-left origin), or null on water
//
// A feature point that lies on a lake or the sea takes the nearest land state within LAND_SEARCH_PIXELS. Only owned states are
// considered by `nearestOwnedState`; unowned land stays unowned.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { ZIN } from './paths.mjs';

export const FRAME = { width: 5120, height: 2560 };
// Radius (world pixels) searched around a feature point that lies on water. A few provinces wide: enough for a harbour site on a
// coast or a lake shore, too small to reach another realm's land.
export const LAND_SEARCH_PIXELS = 96;
export const GEOGRAPHY_FILE = path.join(ZIN, 'tools/content/data/geography/import/aoaz.geography.json');

let cache = null;

// The 24-bit uncompressed provinces bitmap: the file stores its rows from the bottom, so the top-left origin row is height - 1 - y.
function bitmap(buf) {
  if (buf.toString('ascii', 0, 2) !== 'BM') throw new Error('provinces.bmp is not a BMP');
  const offset = buf.readUInt32LE(10), width = buf.readInt32LE(18), height = buf.readInt32LE(22), bpp = buf.readUInt16LE(28), compression = buf.readUInt32LE(30);
  if (bpp !== 24 || compression !== 0 || height <= 0) throw new Error(`Unsupported provinces.bmp (bpp ${bpp}, compression ${compression}, height ${height})`);
  const stride = Math.ceil(width * 3 / 4) * 4;
  return {
    width, height,
    at: (x, y) => {
      const o = offset + (height - 1 - y) * stride + x * 3;
      return (buf[o + 2] << 16) | (buf[o + 1] << 8) | buf[o];
    },
  };
}

function stateNames(zin) {
  const names = new Map();
  for (const l of readFileSync(path.join(zin, 'localisation/replace/world_l_english.yml'), 'utf8').split(/\r?\n/)) {
    const m = /^\s*STATE_(\d+):\d?\s*"(.*)"/.exec(l);
    if (m) names.set(Number(m[1]), m[2]);
  }
  return names;
}

// Every state file of the map: id, owner (absent for unowned land), provinces, and the name the localisation gives it.
export function loadMap(zin = ZIN) {
  if (cache && cache.zin === zin) return cache.value;
  const dir = path.join(zin, 'history/states'), names = stateNames(zin);
  const states = [], byId = new Map(), provinceState = new Map();
  for (const f of readdirSync(dir).filter(n => n.endsWith('.txt')).sort()) {
    const t = readFileSync(path.join(dir, f), 'utf8');
    const id = Number(/\bid\s*=\s*(\d+)/.exec(t)?.[1]);
    const owner = /\bowner\s*=\s*([A-Za-z0-9]+)/.exec(t)?.[1] ?? null;
    const provinces = (/\bprovinces\s*=\s*\{([^}]*)\}/.exec(t)?.[1] ?? '').trim().split(/\s+/).filter(Boolean).map(Number);
    if (!Number.isInteger(id) || !provinces.length) throw new Error(`State file ${f} has no id or provinces`);
    const s = { id, name: names.get(id) ?? null, owner, provinces };
    states.push(s);
    byId.set(id, s);
    for (const p of provinces) provinceState.set(p, id);
  }
  states.sort((a, b) => a.id - b.id);

  const byColour = new Map(), typeOf = new Map();
  for (const line of readFileSync(path.join(zin, 'map/definition.csv'), 'utf8').split(/\r?\n/)) {
    const f = line.split(';');
    if (f.length < 5 || !/^\d+$/.test(f[0])) continue;
    byColour.set((Number(f[1]) << 16) | (Number(f[2]) << 8) | Number(f[3]), Number(f[0]));
    typeOf.set(Number(f[0]), f[4]);
  }
  const bmp = bitmap(readFileSync(path.join(zin, 'map/provinces.bmp')));
  const provinceAt = (x, y) => {
    if (x < 0 || y < 0 || x >= bmp.width || y >= bmp.height) return null;
    return byColour.get(bmp.at(x, y)) ?? null;
  };

  const pointState = (x, y) => provinceState.get(provinceAt(x, y)) ?? null;

  // The nearest state of the map to a point on water: the first land province found in square rings of growing radius, ties broken by
  // row then column so the answer is the same on every run.
  const landStateNear = (x, y, radius = LAND_SEARCH_PIXELS, accept = () => true) => {
    const direct = pointState(x, y);
    if (direct !== null && accept(direct)) return direct;
    for (let r = 1; r <= radius; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const id = pointState(x + dx, y + dy);
          if (id !== null && accept(id)) return id;
        }
      }
    }
    return null;
  };

  const geo = JSON.parse(readFileSync(GEOGRAPHY_FILE, 'utf8'));
  const siteById = new Map((geo.sites ?? []).map(s => [s.id, s]));
  const pixelOfSite = siteId => {
    const site = siteById.get(siteId);
    if (!site) throw new Error(`map features: the geography has no site ${siteId}`);
    const [nx, ny] = site.at ?? site.geometry.coordinates;
    return [Math.floor(nx * FRAME.width), Math.floor(ny * FRAME.height)];
  };
  const siteState = (siteId, accept) => {
    const [x, y] = pixelOfSite(siteId);
    return landStateNear(x, y, LAND_SEARCH_PIXELS, accept);
  };

  cache = {
    zin,
    value: { states, byId, provinceState, provinceAt, pointState, landStateNear, siteState, pixelOfSite, typeOf, stateName: id => names.get(id) ?? null, siteName: siteId => siteById.get(siteId)?.name ?? null },
  };
  return cache.value;
}

export function siteState(siteId, accept) { return loadMap().siteState(siteId, accept); }
export function pointState(x, y) { return loadMap().pointState(x, y); }
