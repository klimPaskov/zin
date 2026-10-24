// Widths of the vanilla game's sea crossings, the calibration of the narrow-gap threshold of coast_features.mjs.
//
// Vanilla Hearts of Iron IV lets armies cross water only where map/adjacencies.csv lists a `sea` row: two land provinces
// and the sea province between them. This step measures, for every such row of the installed game (read only), the
// shore-to-shore width: the shortest distance in pixels of map/provinces.bmp between a pixel of the `From` province and
// a pixel of the `To` province. The vanilla province map is 5,632 x 2,048 pixels, the ZIN frame 5,120 x 2,560, and a
// crossing is a gameplay link between two provinces, so widths are compared in pixels of the province map.
//
//   node tools/content/geography/vanilla_crossings.mjs [--game <install folder>] [--json]
// Pure reader: nothing is written. coast_features.mjs records the figures it is calibrated on.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_GAME = 'C:/Program Files (x86)/Steam/steamapps/common/Hearts of Iron IV';
/** Crossings named in the calibration (vanilla comment column). */
export const NAMED = Object.freeze(['Skåne-Sjaelland', 'Calabria-Sicily', 'Bosphorus', 'Kerch Strait', 'Tsugaru Strait', 'Java-Bali', 'Jeju-Korea', 'North-South NZ Islands']);

/** A 24-bit bottom-up BMP as { width, height, rgb } (rows top first). */
export function readBmp(bytes) {
  const offset = bytes.readUInt32LE(10), width = bytes.readInt32LE(18), rawHeight = bytes.readInt32LE(22), bpp = bytes.readUInt16LE(28);
  if (bpp !== 24) throw new Error(`expected a 24-bit BMP, found ${bpp} bits`);
  const height = Math.abs(rawHeight), stride = Math.ceil((width * 3) / 4) * 4;
  const rgb = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    const src = offset + (rawHeight > 0 ? height - 1 - y : y) * stride;
    for (let x = 0; x < width; x++) { const s = src + x * 3, d = (y * width + x) * 3; rgb[d] = bytes[s + 2]; rgb[d + 1] = bytes[s + 1]; rgb[d + 2] = bytes[s]; }
  }
  return { width, height, rgb };
}

/** Province id per pixel from definition.csv colours. */
export function provinceIds(bmp, definitionText) {
  const byColour = new Map();
  for (const line of definitionText.split(/\r?\n/u)) {
    const c = line.split(';');
    if (c.length < 4 || !/^\d+$/u.test(c[0])) continue;
    byColour.set((Number(c[1]) << 16) | (Number(c[2]) << 8) | Number(c[3]), Number(c[0]));
  }
  const ids = new Int32Array(bmp.width * bmp.height);
  for (let i = 0; i < ids.length; i++) ids[i] = byColour.get((bmp.rgb[i * 3] << 16) | (bmp.rgb[i * 3 + 1] << 8) | bmp.rgb[i * 3 + 2]) ?? -1;
  return ids;
}

/** Boundary pixels of each requested province (a pixel with a 4-neighbour of another province). */
function boundaries(ids, w, h, wanted) {
  const out = new Map([...wanted].map(id => [id, []]));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const id = ids[y * w + x];
    const list = out.get(id);
    if (!list) continue;
    const i = y * w + x;
    if ((x > 0 && ids[i - 1] !== id) || (x + 1 < w && ids[i + 1] !== id) || (y > 0 && ids[i - w] !== id) || (y + 1 < h && ids[i + w] !== id)) list.push(x, y);
  }
  return out;
}

/** Every vanilla sea crossing with its shore-to-shore width in province-map pixels (ties: file order). */
export function measureCrossings(game = DEFAULT_GAME) {
  const map = path.join(game, 'map');
  const rows = readFileSync(path.join(map, 'adjacencies.csv'), 'utf8').split(/\r?\n/u).slice(1)
    .map(l => l.split(';')).filter(c => c.length >= 10 && c[2] === 'sea' && Number(c[0]) > 0)
    .map(c => ({ from: Number(c[0]), to: Number(c[1]), through: Number(c[3]), rule: c[8] || null, comment: c[9].trim() }));
  const bmp = readBmp(readFileSync(path.join(map, 'provinces.bmp')));
  const ids = provinceIds(bmp, readFileSync(path.join(map, 'definition.csv'), 'latin1'));
  const edge = boundaries(ids, bmp.width, bmp.height, new Set(rows.flatMap(r => [r.from, r.to])));
  for (const r of rows) {
    const a = edge.get(r.from), b = edge.get(r.to);
    let best = Infinity;
    for (let i = 0; i < a.length; i += 2) for (let j = 0; j < b.length; j += 2) {
      let dx = Math.abs(a[i] - b[j]); dx = Math.min(dx, bmp.width - dx); // the vanilla map wraps east to west
      const d = Math.hypot(dx, a[i + 1] - b[j + 1]);
      if (d < best) best = d;
    }
    r.widthPx = Math.round(best * 10) / 10;
  }
  return { width: bmp.width, height: bmp.height, rows };
}

/** Summary figures of the widths: quantiles and the named crossings. */
export function summarise(result) {
  const canals = new Set(['PANAMA_CANAL', 'KIEL_CANAL', 'SUEZ_CANAL']);
  const w = result.rows.filter(r => !canals.has(r.rule)).map(r => r.widthPx).sort((p, q) => p - q);
  const q = f => w[Math.min(w.length - 1, Math.floor(f * (w.length - 1)))];
  return {
    provinceMap: [result.width, result.height], crossings: w.length,
    quantilesPx: { p50: q(0.5), p75: q(0.75), p90: q(0.9), p95: q(0.95), max: w[w.length - 1] },
    named: Object.fromEntries(NAMED.map(n => [n, result.rows.find(r => r.comment === n)?.widthPx ?? null])),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const i = args.indexOf('--game');
  const result = measureCrossings(i >= 0 ? args[i + 1] : DEFAULT_GAME);
  if (args.includes('--json')) console.log(JSON.stringify(result.rows, null, 1));
  console.log(JSON.stringify(summarise(result), null, 1));
}
