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
import { readEmblemSheet, emblemCell, fitEmblem } from '../lib/emblem.mjs';
import { PEOPLES } from './peoples.mjs';
import { loadPortraitPools, tablePortraits } from './portraits.mjs';

export { ART };

async function regions(file, expected, opts) {
  const r = await findRegions(file, expected, opts);
  if (!r.ok) throw new Error(`${path.basename(file)}: found ${r.found} items, expected ${expected}`);
  return r.regions;
}

export async function loadArt(countries) {
  const art = { emblems: new Map(), focusEmblems: new Map(), portraits: new Map(), sources: [] };
  const source = rel => { art.sources.push(rel); return rawFile(rel); };
  // People emblems: 5 x 2 round medallions, in PEOPLES order. The medallion's outline is the alpha (docs/design/validation/gfx_standard.md): the idea
  // picture is 64 x 64 and the focus icon 100 x 88, both with a transparent ground, never an opaque square.
  const keys = Object.keys(PEOPLES), emblemSheet = source('emblems/emblems-peoples.png');
  const er = await regions(emblemSheet, keys.length, { cols: 5, rows: 2, aspect: [0.75, 1.33], minAreaFraction: 0.25 });
  const emblemPixels = await readEmblemSheet(emblemSheet);
  for (const [i, k] of keys.entries()) {
    const cell = emblemCell(emblemPixels, er[i]);
    art.emblems.set(k, fromRaw(await fitEmblem(cell, 64, 64, 1), 64, 64));
    art.focusEmblems.set(k, fromRaw(await fitEmblem(cell, 100, 88, 3), 100, 88));
  }
  // Portraits: per people, 2 x 2 — top row male 1 / female 1, bottom row male 2 / female 2.
  for (const k of keys) {
    const sheet = source(`portraits/portraits-${k}.png`), pr = await regions(sheet, 4, { cols: 2, rows: 2, aspect: [0.45, 1.0], minAreaFraction: 0.3 });
    const order = [['male', 1], ['female', 1], ['male', 2], ['female', 2]];
    for (const [i, [sex, n]] of order.entries()) art.portraits.set(`${k}_${sex}_${n}`, fromRaw(await cropRegion(sheet, pr[i], 156, 210, { fit: 'cover' }), 156, 210));
  }
  // Culture pools and named portraits (data/world/portrait_pools.json, modules/portraits.mjs): sliced from their accepted sheets.
  await slicePoolPortraits(art, source, loadPortraitPools());
  // Interface: frame panel (whole image), three button states, divider rule.
  const frameFile = source('ui/ui-frame.png');
  art.frame = fromRaw(await (await import('sharp')).default(frameFile).resize(128, 128, { kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer(), 128, 128);
  const buttonFile = source('ui/ui-button.png'), br = await regions(buttonFile, 3, { cols: 1, rows: 3, aspect: [2.5, 8], minAreaFraction: 0.15 });
  art.buttons = await Promise.all(br.map(async r => fromRaw(await cropRegion(buttonFile, r, 132, 30, { inset: 2 }), 132, 30)));
  const ruleFile = source('ui/ui-rule.png'), rr = await regions(ruleFile, 1, { cols: 1, rows: 1, aspect: [8, 400], minAreaFraction: 0 });
  art.rule = fromRaw(await cropRegion(ruleFile, rr[0], 520, 12, { inset: 0, fit: 'fill' }), 520, 12);
  return art;
}

// Each pool sheet is a 2 x 2 grid read in reading order (the cell index of the table); each named portrait is one image, cropped to the
// whole picture. Every sheet is read once, so the staged source list names it once.
async function slicePoolPortraits(art, source, plan) {
  const sheets = new Map(), singles = new Map();
  const sheetOf = async rel => {
    if (!sheets.has(rel)) {
      const file = source(rel), r = await regions(file, 4, { cols: 2, rows: 2, aspect: [0.45, 1.0], minAreaFraction: 0.3 });
      sheets.set(rel, { file, cells: [...r].sort((a, b) => (Math.abs(a.y0 - b.y0) > 40 ? a.y0 - b.y0 : a.x0 - b.x0)) });
    }
    return sheets.get(rel);
  };
  for (const [sprite, t] of tablePortraits(plan)) {
    const rel = t.source.replace(/^art\/source\//, '');
    if (t.cell === null) {
      if (!singles.has(rel)) singles.set(rel, source(rel));
      const file = singles.get(rel), meta = await (await import('sharp')).default(file).metadata();
      // A named portrait is the whole picture unless the table declares a crop (portrait_pools.json, crop: the box and the fit).
      const box = t.crop ? { x0: t.crop.x0, y0: t.crop.y0, x1: t.crop.x1, y1: t.crop.y1 } : { x0: 0, y0: 0, x1: meta.width, y1: meta.height };
      const fit = t.crop?.fit ?? 'cover', background = t.crop?.fit === 'contain' ? { r: 14, g: 11, b: 10, alpha: 1 } : undefined;
      art.portraits.set(sprite, fromRaw(await cropRegion(file, box, 156, 210, { inset: 0, fit, ...(background ? { background } : {}) }), 156, 210));
    } else {
      const s = await sheetOf(rel);
      if (!s.cells[t.cell]) throw new Error(`${sprite}: ${rel} has no cell ${t.cell}`);
      art.portraits.set(sprite, fromRaw(await cropRegion(s.file, s.cells[t.cell], 156, 210, { fit: 'cover' }), 156, 210));
    }
  }
}

// The per-country flag slices: <ZIN_ART>/flags/ when present. Otherwise they are cut again from the flag sheets by
// art/slice-flags.mjs into a content-addressed folder under the OS temp directory (never inside the repository),
// using the cell map recorded when the sheets were generated: <ZIN_ART>/jobs/flags-cells.json, or its tracked copy
// data/flags-cells.json, the map of the retired roster's sheets (art/flag-jobs.mjs writes the jobs of the realms' new sheets).
export const FLAG_CELLS = fileURLToPath(new URL('../data/flags-cells.json', import.meta.url));
// The realms' own flags: the heraldry sheets of art/flag-jobs.mjs. The tracked cell map (data/realm-flags-cells.json, no images) lists
// every realm flag with its sheet and index; a cell serves its flag only once its sheet is accepted (accepted: true).
export const REALM_FLAG_CELLS = fileURLToPath(new URL('../data/realm-flags-cells.json', import.meta.url));
let flagsReady, realmFlagsReady;
export function flagsDir() { return flagsReady ??= sliceFlagsIfMissing(); }
export function realmFlagsDir() { return realmFlagsReady ??= sliceRealmFlags(); }
export async function acceptedRealmCells() {
  return JSON.parse(await readFile(REALM_FLAG_CELLS, 'utf8')).filter(c => c.accepted === true);
}
async function sliceFlagsIfMissing() {
  if (existsSync(`${ART}/flags`)) return `${ART}/flags`;
  const cellsFile = existsSync(`${ART}/jobs/flags-cells.json`) ? `${ART}/jobs/flags-cells.json` : FLAG_CELLS;
  return sliceSheetsCached(JSON.parse(await readFile(cellsFile, 'utf8')));
}
async function sliceRealmFlags() { return sliceSheetsCached(await acceptedRealmCells()); }
// Cuts the sheets named by the cells into a content-addressed folder (the hash covers the cells and the sheet bytes).
async function sliceSheetsCached(cells) {
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

// A flag slice at the three HOI4 sizes (492x312 in, 82x52, 41x26 and 10x7 out).
async function tgasOf(file) {
  const sharp = (await import('sharp')).default;
  const [large, medium, small] = await Promise.all([[82, 52], [41, 26], [10, 7]].map(async ([w, h]) => tga(fromRaw(await sharp(file).resize(w, h, { fit: 'fill', kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer(), w, h))));
  return { large, medium, small };
}

// A country's flag at the three HOI4 sizes, from its generated sheet slice flags/<name key>.png (492x312).
export async function flagTgas(name) {
  const { flagKey } = await import('../art/slice-flags.mjs');
  return tgasOf(`${await flagsDir()}/${flagKey(name)}.png`);
}

// The realms' flags at the three sizes. A realm flies its own heraldry flag once its sheet is accepted (acceptedRealmCells). Until then it
// flies the old flag of its main former row (flagFrom, lib/roster.mjs), and a realm with neither has no flag yet (a pending art row in
// docs/plans/zin-art/pending_from_integration.md). Returns { kept: [{ tag, name, from }], none: [{ tag, name }] }, where from is the sheet
// cell (sheet#index) or the old row's name.
export async function stageRealmFlags(staged, countries) {
  const kept = [], none = [], own = new Map((await acceptedRealmCells()).map(c => [c.tag, c]));
  const { flagKey } = await import('../art/slice-flags.mjs');
  for (const c of countries) {
    const cell = own.get(c.tag);
    let t, from;
    if (cell) { t = await tgasOf(`${await realmFlagsDir()}/${flagKey(cell.name)}.png`); from = `${cell.sheet}#${cell.index}`; }
    else if (c.flagFrom) { t = await flagTgas(c.flagFrom); from = c.flagFrom; }
    else { none.push({ tag: c.tag, name: c.name }); continue; }
    staged.add(`gfx/flags/${c.tag}.tga`, t.large);
    staged.add(`gfx/flags/medium/${c.tag}.tga`, t.medium);
    staged.add(`gfx/flags/small/${c.tag}.tga`, t.small);
    kept.push({ tag: c.tag, name: c.name, from });
  }
  return { kept, none };
}

// The generated sources and their provenance travel with the mod so every asset can be traced to its prompt.
export async function stageArtSources(staged, art) {
  for (const rel of art.sources) staged.add(`art/source/${rel}`, await readFile(rawFile(rel)));
  const flagSheets = existsSync(`${ART}/raw/flags`) ? `${ART}/raw/flags` : `${ART_SOURCE}/flags`;
  for (const f of (await readdir(flagSheets)).filter(f => /^((realm-)?flags-sheet-\d+|realm-flags-one-[A-Z]{3})\.png$/.test(f)).sort()) staged.add(`art/source/flags/${f}`, await readFile(`${flagSheets}/${f}`));
  staged.add('art/source/provenance.jsonl', await readFile(provenanceFile()));
}
export { dds };
