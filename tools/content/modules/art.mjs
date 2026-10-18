// Generated art → game assets. Every picture in ZIN is painted by the image model (owner rule, 2026-10-17); this
// module only finds the painted items on each generated sheet, crops, resizes and converts them. A missing sheet
// or a sheet that does not yield exactly the expected items stops the build — there is no code-drawn fallback.
// Sheets come from the art working directory (ZIN_ART) and fall back to the copies tracked under art/source/, so a
// fresh clone builds the same bytes (lib/paths.mjs).
import { existsSync } from 'node:fs';
import { readFile, readdir, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ART, ART_SOURCE, rawFile, provenanceFile } from '../lib/paths.mjs';
import { findRegionsAdaptive as findRegions, cropRegion } from '../lib/sheets.mjs';
import { fromRaw, tga, dds } from '../lib/raster.mjs';
import { PEOPLES } from './peoples.mjs';

export { ART };

async function regions(file, expected, opts) {
  const r = await findRegions(file, expected, opts);
  if (!r.ok) throw new Error(`${path.basename(file)}: found ${r.found} items, expected ${expected}`);
  return r.regions;
}

export async function loadArt(countries) {
  const art = { emblems: new Map(), portraits: new Map(), sources: [] };
  const source = rel => { art.sources.push(rel); return rawFile(rel); };
  // People emblems: 5 x 2 round medallions, in PEOPLES order.
  const keys = Object.keys(PEOPLES), emblemSheet = source('emblems/emblems-peoples.png');
  const er = await regions(emblemSheet, keys.length, { cols: 5, rows: 2, aspect: [0.75, 1.33], minAreaFraction: 0.25 });
  for (const [i, k] of keys.entries()) art.emblems.set(k, fromRaw(await cropRegion(emblemSheet, er[i], 64, 64, { inset: 0, fit: 'contain' }), 64, 64));
  // Portraits: per people, 2 x 2 — top row male 1 / female 1, bottom row male 2 / female 2.
  for (const k of keys) {
    const sheet = source(`portraits/portraits-${k}.png`), pr = await regions(sheet, 4, { cols: 2, rows: 2, aspect: [0.45, 1.0], minAreaFraction: 0.3 });
    const order = [['male', 1], ['female', 1], ['male', 2], ['female', 2]];
    for (const [i, [sex, n]] of order.entries()) art.portraits.set(`${k}_${sex}_${n}`, fromRaw(await cropRegion(sheet, pr[i], 156, 210, { fit: 'cover' }), 156, 210));
  }
  // Interface: frame panel (whole image), three button states, divider rule.
  const frameFile = source('ui/ui-frame.png');
  art.frame = fromRaw(await (await import('sharp')).default(frameFile).resize(128, 128, { kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer(), 128, 128);
  const buttonFile = source('ui/ui-button.png'), br = await regions(buttonFile, 3, { cols: 1, rows: 3, aspect: [2.5, 8], minAreaFraction: 0.15 });
  art.buttons = await Promise.all(br.map(async r => fromRaw(await cropRegion(buttonFile, r, 132, 30, { inset: 2 }), 132, 30)));
  const ruleFile = source('ui/ui-rule.png'), rr = await regions(ruleFile, 1, { cols: 1, rows: 1, aspect: [8, 400], minAreaFraction: 0 });
  art.rule = fromRaw(await cropRegion(ruleFile, rr[0], 520, 12, { inset: 0, fit: 'fill' }), 520, 12);
  return art;
}

// The per-country flag slices: <ZIN_ART>/flags/ when present. Otherwise they are cut again from the flag sheets by
// art/slice-flags.mjs into a content-addressed folder under the OS temp directory (never inside the repository),
// using the cell map recorded when the sheets were generated: <ZIN_ART>/jobs/flags-cells.json, or its tracked copy
// data/flags-cells.json. (art/flag-jobs.mjs derives cells from today's table, which no longer matches the sheets.)
export const FLAG_CELLS = fileURLToPath(new URL('../data/flags-cells.json', import.meta.url));
let flagsReady;
export function flagsDir() { return flagsReady ??= sliceFlagsIfMissing(); }
async function sliceFlagsIfMissing() {
  if (existsSync(`${ART}/flags`)) return `${ART}/flags`;
  const cellsFile = existsSync(`${ART}/jobs/flags-cells.json`) ? `${ART}/jobs/flags-cells.json` : FLAG_CELLS;
  const cells = JSON.parse(await readFile(cellsFile, 'utf8'));
  const bySheet = new Map(); for (const c of cells) (bySheet.get(c.sheet) ?? bySheet.set(c.sheet, []).get(c.sheet)).push(c);
  const h = createHash('sha256').update(JSON.stringify(cells));
  for (const sheet of [...bySheet.keys()].sort()) h.update(sheet).update(await readFile(rawFile(`flags/${sheet}.png`)));
  const dir = path.join(os.tmpdir(), 'zin-content-flags', h.digest('hex').slice(0, 16));
  if (existsSync(`${dir}/.complete`)) return dir;
  const { sliceSheet } = await import('../art/slice-flags.mjs'), work = `${dir}.partial-${process.pid}`;
  await rm(work, { recursive: true, force: true });
  try { for (const [sheet, group] of bySheet) await sliceSheet(rawFile(`flags/${sheet}.png`), group, work); } catch (e) { await rm(work, { recursive: true, force: true }); throw e; }
  await writeFile(`${work}/.complete`, '');
  await mkdir(path.dirname(dir), { recursive: true });
  try { await rename(work, dir); } catch (e) { if (!existsSync(`${dir}/.complete`)) throw e; await rm(work, { recursive: true, force: true }); }
  return dir;
}

// A country's flag at the three HOI4 sizes, from its generated sheet slice flags/<name key>.png (492x312).
export async function flagTgas(name) {
  const { flagKey } = await import('../art/slice-flags.mjs');
  const sharp = (await import('sharp')).default, file = `${await flagsDir()}/${flagKey(name)}.png`;
  const [large, medium, small] = await Promise.all([[82, 52], [41, 26], [10, 7]].map(async ([w, h]) => tga(fromRaw(await sharp(file).resize(w, h, { fit: 'fill', kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer(), w, h))));
  return { large, medium, small };
}

// The generated sources and their provenance travel with the mod so every asset can be traced to its prompt.
export async function stageArtSources(staged, art) {
  for (const rel of art.sources) staged.add(`art/source/${rel}`, await readFile(rawFile(rel)));
  const flagSheets = existsSync(`${ART}/raw/flags`) ? `${ART}/raw/flags` : `${ART_SOURCE}/flags`;
  for (const f of (await readdir(flagSheets)).filter(f => /^flags-sheet-\d+\.png$/.test(f)).sort()) staged.add(`art/source/flags/${f}`, await readFile(`${flagSheets}/${f}`));
  staged.add('art/source/provenance.jsonl', await readFile(provenanceFile()));
}
export { dds };
