// Interface reskin builder (spec docs/specs/07_interface/02_full_ui_reskin.md, Implementation).
//
//   validateReskin({ inventory, reskin, sheets })   -> problems (builder check 2 and the row rules)
//   buildReskin(staged, { inventory, reskin, sheets, ... }) -> { built, pending, delegated, sources, counts }
//   planReskin(inventory)                           -> { reskin, sheets } derived by rules (lib/ui_plan.mjs)
//
// The disposition table (data/ui/reskin.json) classifies every inventory entry. For each `R` row the builder cuts the
// listed cells out of an accepted generated sheet, runs the fit on a target whose size, frames and border come only
// from the inventory, and writes the result at the vanilla path with the vanilla extension. A row with no accepted
// source stays pending and is reported; nothing fails for want of art. Rows owned by another writer (the loading
// chrome by presentation.mjs, cursors by ui_cursors, the minimap by ui_minimap) are reported as delegated.
//
// CLI (from tools/):  node content/modules/ui_reskin.mjs plan | validate | report
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { GAME, rawFile, provenanceFile } from '../lib/paths.mjs';
import { findRegionsAdaptive } from '../lib/sheets.mjs';
import { runFit, FITS, FRAME_FITS, TRANSFORMS, FitError, makeImg, toCanvas, medallionMask, alphaBox, outlineOf, crop } from '../lib/fit.mjs';
import { dds, tga, png } from '../lib/raster.mjs';
import { decodeRgba, readHeader, extOf } from '../lib/image_codec.mjs';
import { acceptance } from './presentation.mjs';
import { layoutCheck, validateSheet } from '../lib/ui_sheets.mjs';
import { buildPlan, serializeReskin, sheetJson, framesOf, DISPOSITIONS, REASON_REQUIRED, OVERRIDE_FILES, WRITERS } from '../lib/ui_plan.mjs';
import { loadInventory, INVENTORY_FILE } from './ui_inventory.mjs';

export const RESKIN_FILE = fileURLToPath(new URL('../data/ui/reskin.json', import.meta.url));
export const SHEETS_DIR = fileURLToPath(new URL('../data/ui/sheets/', import.meta.url));
export const ALERT_FRAMES_FILE = fileURLToPath(new URL('../data/ui/alert_frames.json', import.meta.url));
export const SHEET_RAW_DIR = 'ui/reskin';                      // raw sheets live in $ZIN_ART/raw/ui/reskin/<sheet id>.png
export const MANIFEST_FILE = 'art/source/reskin_manifest.json';
export const FAMILIES = ['chrome_panels', 'chrome_controls', 'chrome_bars', 'topbar', 'map_interface', 'alerts', 'events', 'politics_diplomacy', 'focus', 'research_production', 'military', 'frontend', 'loading_frame', 'cursors', 'texticons'];
const ALPHA = /^(opaque|cell|shape|uniform:\d{1,3})$/;
const SIZE_FIELDS = ['width', 'height', 'size', 'borderSize', 'format', 'ext', 'texture'];
const sha256 = b => createHash('sha256').update(b).digest('hex');
const ord = (a, b) => a < b ? -1 : a > b ? 1 : 0;

// ---------------------------------------------------------------------------------------------------- data files
export function loadReskin(file = RESKIN_FILE) {
  const r = JSON.parse(readFileSync(file, 'utf8'));
  if (r.format !== 1 || !Array.isArray(r.rows)) throw new Error(`${file}: not a reskin table (format ${r.format})`);
  return r;
}
export function loadSheets(dir = SHEETS_DIR) {
  const sheets = new Map();
  for (const f of readdirSync(dir).filter(n => n.endsWith('.json')).sort(ord)) { const s = JSON.parse(readFileSync(path.join(dir, f), 'utf8')); sheets.set(s.id, s); }
  return sheets;
}
export function loadAlertFrames(file = ALERT_FRAMES_FILE) { return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : undefined; }

// Derive the table and the sheet maps from the inventory and write them (node content/modules/ui_reskin.mjs plan).
export function planReskin(inventory, { alertFrames = loadAlertFrames() } = {}) {
  const plan = buildPlan(inventory, { alertFrames });
  return { reskin: { format: 1, header: plan.header, rows: plan.rows }, sheets: new Map(plan.sheets.map(s => [s.id, s])), text: serializeReskin(plan) };
}
export function writePlan(inventory, { file = RESKIN_FILE, dir = SHEETS_DIR } = {}) {
  const { reskin, sheets, text } = planReskin(inventory);
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir).filter(n => n.endsWith('.json'))) rmSync(path.join(dir, f));
  for (const [id, s] of sheets) writeFileSync(path.join(dir, `${id}.json`), sheetJson(s));
  writeFileSync(file, text);
  return { reskin, sheets };
}

// ---------------------------------------------------------------------------------------------------- validation
// The texture-level facts a row is judged against: sprites that share a texture share one file.
export function textureIndex(inventory) {
  const byTexture = new Map();
  for (const s of inventory.sprites) {
    if (!s.texture || s.missing) continue;
    const k = s.texture.toLowerCase();
    if (!byTexture.has(k)) byTexture.set(k, { texture: s.texture, sprites: [], frames: 1, borderSize: null });
    const t = byTexture.get(k);
    t.sprites.push(s.name);
    if (framesOf(s) > t.frames) t.frames = framesOf(s);
    if (s.borderSize && !t.borderSize) t.borderSize = s.borderSize;
  }
  return byTexture;
}

// Problems as { code, name, message }. Codes: coverage.*, reason.*, row.* and sheet.*.
export function validateReskin({ inventory, reskin, sheets }) {
  const problems = [], add = (code, name, message) => problems.push({ code, name, message });
  const byName = new Map(inventory.sprites.map(s => [s.name, s])), seen = new Map();
  for (const sh of sheets.values()) for (const p of validateSheet(sh)) add('sheet.invalid', sh.id, p);
  const cellOwner = new Map(); // cell key -> sheet ids
  for (const sh of sheets.values()) for (const c of sh.cells) { if (!cellOwner.has(c.key)) cellOwner.set(c.key, []); cellOwner.get(c.key).push(sh.id); }
  const tex = textureIndex(inventory), treatments = new Map();
  const reasons = reskin.header?.reasons ?? {};
  const reasonText = r => (typeof r === 'string' && (reasons[r] ?? (r.length >= 20 && /\s/.test(r) ? r : null))) || null;

  for (const row of reskin.rows) {
    const where = row.name;
    if (seen.has(row.name)) { add('coverage.duplicate', where, `${where} has more than one row`); continue; }
    seen.set(row.name, row);
    const s = byName.get(row.name);
    if (!s) { add('coverage.unknown', where, `${where} is not in the inventory`); continue; }
    if (!DISPOSITIONS.includes(row.disposition)) { add('row.disposition', where, `unknown disposition ${row.disposition}`); continue; }
    if (row.disposition === 'D') add('row.derived_override', where, 'D (derived override) is reserved and needs the owner\'s approval');
    if (REASON_REQUIRED.includes(row.disposition) && !reasonText(row.reason)) add('reason.missing', where, `${row.disposition} row without a reason (a key of header.reasons or a sentence)`);
    if (row.disposition === 'O' && !OVERRIDE_FILES.includes(row.override)) add('row.override', where, `O row names ${row.override ?? 'no file'}, which is not on the closed list of overrides`);
    for (const f of SIZE_FIELDS) if (row[f] !== undefined) add('row.size_field', where, `row carries ${f}; sizes, frames and borders come only from the inventory`);
    if (row.disposition !== 'R') continue;

    // R rows.
    if (!FAMILIES.includes(row.family)) add('row.family', where, `unknown family ${row.family}`);
    const writer = row.writer ?? 'reskin';
    if (!WRITERS.includes(writer)) { add('row.writer', where, `unknown writer ${writer}`); continue; }
    if (s.missing || !s.texture) { add('row.no_texture', where, 'an R row needs a texture that exists in the install'); continue; }
    if (writer === 'presentation' || writer === 'minimap') continue;
    const t = tex.get(s.texture.toLowerCase());
    if (!Array.isArray(row.cells) || !row.cells.length) { add('row.cells', where, 'R row without cells'); continue; }
    if (!FITS.includes(row.fit)) { add('row.fit', where, `unknown fit ${row.fit}`); continue; }
    if (row.transform !== undefined && !TRANSFORMS.includes(row.transform)) add('row.transform', where, `unknown transform ${row.transform}`);
    if (!ALPHA.test(row.alpha ?? '')) add('row.alpha', where, `unknown alpha policy ${row.alpha}`);
    if (row.fit === 'same_shape' && row.alpha !== 'shape') add('row.alpha', where, 'same_shape needs alpha shape');
    const sheetIds = [].concat(row.sheet ?? []);
    if (!sheetIds.length || sheetIds.some(id => !sheets.has(id))) add('row.sheet', where, `unknown sheet ${sheetIds.join(',') || '(none)'}`);
    else for (const key of row.cells) if (!sheetIds.some(id => sheets.get(id).cells.some(c => c.key === key))) add('row.cell', where, `cell ${key} is in none of ${sheetIds.join(', ')}`);
    // A file another module writes is judged by its writer; only the cells are checked here.
    if (writer !== 'reskin') continue;
    // Frames come from the inventory: the most the sprites of this texture cut it into.
    const frames = t.frames;
    if (frames > 1) {
      if (row.fit !== 'strip') add('row.frames', where, `the texture has ${frames} frames, so the fit must be strip`);
      if (!Array.isArray(row.frames) || row.frames.length !== frames) add('row.frames', where, `frames lists ${row.frames?.length ?? 0} labels, the inventory has ${frames}`);
      if (row.cells.length !== frames) add('row.frames', where, `${row.cells.length} cells for ${frames} frames`);
    } else {
      if (row.fit === 'strip') add('row.frames', where, 'strip on a one-frame texture');
      if (row.cells.length !== 1) add('row.frames', where, `${row.cells.length} cells for one frame`);
      if (row.frames !== undefined) add('row.frames', where, 'a one-frame texture lists no frames');
    }
    const inner = row.fit === 'strip' ? row.frameFit : row.fit;
    if (row.fit === 'strip' && !FRAME_FITS.includes(row.frameFit)) add('row.fit', where, `strip needs a frameFit of ${FRAME_FITS.join(', ')}`);
    if (inner === 'nine_slice' && !t.borderSize) add('row.border', where, 'nine_slice needs a borderSize in the inventory (a corneredTileSpriteType)');
    // One file, one treatment.
    const key = JSON.stringify([row.sheet, row.cells, row.fit, row.frames, row.frameFit, row.alpha, row.transform, writer]);
    const prior = treatments.get(s.texture.toLowerCase());
    if (prior && prior.key !== key) add('row.shared_texture', where, `${s.texture} is also the texture of ${prior.name}, which has another treatment`);
    else if (!prior) treatments.set(s.texture.toLowerCase(), { key, name: where });
  }
  for (const s of inventory.sprites) if (!seen.has(s.name)) add('coverage.missing', s.name, `${s.name} has no row`);
  return problems;
}

// ---------------------------------------------------------------------------------------------------- sheets
// The cell images of one raw sheet: Map(key -> Img). Grid sheets are found on their black ground (a sheet that does
// not yield exactly the expected cells is refused); outline sheets take each cell's own outline as alpha (A3).
export async function readSheetCells(sheet, file) {
  const check = layoutCheck(sheet);
  const r = await findRegionsAdaptive(file, check.expected, { cols: check.cols, rows: check.rows, aspect: check.aspect, minAreaFraction: check.minAreaFraction });
  if (!r.ok) throw new FitError('layout', `${sheet.id}: found ${r.found ?? 0} cells, expected ${check.expected}`);
  const cells = new Map(), inset = 4;
  if (sheet.matte === 'outline') {
    const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    sheet.cells.forEach((c, i) => {
      const m = medallionMask(data, info.width, r.regions[i]), box = alphaBox(m.buf, m.w, m.h);
      if (box.width < 2 || box.height < 2) throw new FitError('layout', `${sheet.id}.${c.key}: empty cell`);
      cells.set(c.key, crop(makeImg(m.w, m.h, m.buf), box.left, box.top, box.width, box.height));
    });
    return cells;
  }
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const full = makeImg(info.width, info.height, data);
  sheet.cells.forEach((c, i) => {
    const g = r.regions[i], left = g.x0 + inset, top = g.y0 + inset, w = g.x1 - g.x0 - 2 * inset, h = g.y1 - g.y0 - 2 * inset;
    const cell = crop(full, left, top, w, h);
    for (let k = 3; k < cell.data.length; k += 4) cell.data[k] = 255;   // a black-ground cell is opaque
    cells.set(c.key, cell);
  });
  return cells;
}

const encode = (ext, img, row) => {
  const canvas = toCanvas(img);
  if (ext === 'dds') return dds(canvas);
  if (ext === 'tga') return tga(canvas, { origin: row.origin ?? 'bottom' });
  if (ext === 'png') return png(canvas);
  throw new Error(`cannot write a .${ext} texture`);
};

// The binary outline of the vanilla texture (read-only evidence; only the outline is kept, never a colour).
export function vanillaFileOf(row, game = GAME) {
  const rootDir = !row.root || row.root === 'base' ? game : `${game}/${row.root}`;
  return `${rootDir}/${row.texture}`;
}
export async function vanillaOutline(row, game = GAME) {
  const file = vanillaFileOf(row, game);
  if (!existsSync(file)) return null;
  const bytes = readFileSync(file), ext = extOf(row.texture), px = await decodeRgba(bytes, ext);
  return px && px.width === row.width && px.height === row.height ? outlineOf(px.data, px.width, px.height) : null;
}

// ---------------------------------------------------------------------------------------------------- build
// options: provenance (parsed review lines; default the tracked log), rawPath(rel) (default rawFile), shapeFor(invRow)
// (default the installed game), warn(msg). Nothing here fails for want of art.
export async function buildReskin(staged, { inventory, reskin, sheets, provenance, rawPath = rawFile, shapeFor = row => vanillaOutline(row), warn = () => {}, validate = true } = {}) {
  if (validate) {
    const problems = validateReskin({ inventory, reskin, sheets });
    if (problems.length) throw new Error(`reskin.json: ${problems.length} problems, first: ${problems.slice(0, 5).map(p => `${p.code} ${p.name}: ${p.message}`).join('; ')}`);
  }
  const lines = provenance ?? (existsSync(provenanceFile()) ? readFileSync(provenanceFile(), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : []);
  const invByName = new Map(inventory.sprites.map(s => [s.name, s])), tex = textureIndex(inventory);
  const sheetState = new Map(), sources = new Map(), cache = new Map();
  const state = async id => {
    if (sheetState.has(id)) return sheetState.get(id);
    const sheet = sheets.get(id), rel = `${SHEET_RAW_DIR}/${id}.png`, file = rawPath(rel);
    let st;
    if (!file || !existsSync(file)) st = { ok: false, why: `no raw sheet ${rel}` };
    else {
      const bytes = readFileSync(file), acc = acceptance(lines, rel, bytes);
      if (!acc.ok) st = { ok: false, why: `${rel}: ${acc.why}` };
      else {
        try { st = { ok: true, rel, sha: acc.sha, bytes, cells: await readSheetCells(sheet, file) }; sources.set(rel, { bytes, sha: acc.sha }); }
        catch (e) { st = { ok: false, why: e.message }; }
      }
    }
    sheetState.set(id, st);
    return st;
  };

  // One build per texture: the first R row of each texture (by sprite name) speaks for all sprites that share it.
  const built = [], pending = [], delegated = [], manifest = [];
  const groups = new Map();
  for (const row of reskin.rows) {
    if (row.disposition !== 'R') continue;
    const s = invByName.get(row.name), k = s.texture.toLowerCase();
    if (!groups.has(k)) groups.set(k, { s, row, names: [] });
    groups.get(k).names.push(row.name);
  }
  for (const [, g] of [...groups].sort(([a], [b]) => ord(a, b))) {
    const { s, row } = g, writer = row.writer ?? 'reskin';
    if (writer !== 'reskin') { delegated.push({ texture: s.texture, writer, names: g.names }); continue; }
    const t = tex.get(s.texture.toLowerCase()), sheetIds = [].concat(row.sheet);
    const states = await Promise.all(sheetIds.map(state)), bad = states.find(x => !x.ok);
    if (bad) { pending.push({ texture: s.texture, names: g.names, why: bad.why }); continue; }
    const pool = new Map();
    sheetIds.forEach((id, i) => { for (const [key, img] of states[i].cells) if (!pool.has(key)) pool.set(key, { img, sheet: id, rel: states[i].rel, sha: states[i].sha }); });
    const picked = row.cells.map(key => pool.get(key));
    if (picked.some(x => !x)) { pending.push({ texture: s.texture, names: g.names, why: `cell ${row.cells[picked.findIndex(x => !x)]} is not in an accepted sheet` }); continue; }
    let mask;
    if (row.alpha === 'shape') {
      mask = await shapeFor({ ...s, root: s.root });
      if (!mask) { pending.push({ texture: s.texture, names: g.names, why: 'the vanilla outline is not readable (installed game missing)' }); continue; }
    }
    const sheetOf = key => sheets.get(pool.get(key).sheet);
    const cellBorder = cell => {
      const key = row.cells[picked.findIndex(p => p.img === cell)], sh = sheetOf(key), def = sh.cells.find(c => c.key === key);
      return Math.max(1, Math.round((def?.border ?? sh.cellBorder ?? 0.15) * Math.min(cell.w, cell.h)));
    };
    const target = { width: s.width, height: s.height, frames: t.frames, borderSize: t.borderSize };
    let result;
    try { result = await runFit(row.fit, picked.map(p => p.img), target, { frameFit: row.frameFit, alpha: row.alpha === 'cell' ? 'cell' : row.alpha, mask, transform: row.transform, cellBorder, padding: 0.06 }); }
    catch (e) { if (e instanceof FitError) { pending.push({ texture: s.texture, names: g.names, why: `fit refused: ${e.message}` }); continue; } throw e; }
    const bytes = encode(s.ext, result.img, s);
    staged.add(s.texture, bytes);
    const first = picked[0];
    built.push({ out: s.texture, names: g.names });
    manifest.push({ out: s.texture, source: `art/source/${first.rel}`, sourceSha256: first.sha, cells: [...new Set(row.cells)].sort(ord), sheets: [...new Set(picked.map(p => p.sheet))].sort(ord), ops: [...result.ops, `${s.ext} ${s.ext === 'dds' ? 'a8r8g8b8' : s.ext === 'tga' ? `32-bit ${s.origin ?? 'bottom'}-left` : '32-bit'}`], sha256: sha256(bytes) });
    void cache;
  }
  for (const [rel, src] of [...sources].sort(([a], [b]) => ord(a, b))) staged.add(`art/source/${rel}`, src.bytes);
  staged.add(MANIFEST_FILE, Buffer.from(JSON.stringify({ generator: 'tools/content/modules/ui_reskin.mjs', files: manifest.sort((a, b) => ord(a.out, b.out)) }, null, 1) + '\n'));
  for (const p of pending) warn(`pending ${p.texture}: ${p.why}`);
  const counts = { r: [...groups.values()].length, built: built.length, pending: pending.length, delegated: delegated.length };
  return { built, pending, delegated, sources, manifest, counts };
}

// A readable summary of the table and the build: dispositions, families and tranches.
export function summarize(reskin, result) {
  const by = (rows, f) => Object.fromEntries(Object.entries(rows.reduce((m, r) => { const k = f(r); m[k] = (m[k] ?? 0) + 1; return m; }, {})).sort(([a], [b]) => ord(a, b)));
  const R = reskin.rows.filter(r => r.disposition === 'R');
  return { dispositions: by(reskin.rows, r => r.disposition), rByFamily: by(R, r => r.family), rByTranche: by(R, r => String(r.tranche ?? '?')), ...(result ? { build: result.counts } : {}) };
}

// ---------------------------------------------------------------------------------------------------- CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2] ?? 'validate';
  const inventory = loadInventory(INVENTORY_FILE);
  if (cmd === 'plan') {
    const { reskin, sheets } = writePlan(inventory);
    console.log(JSON.stringify({ wrote: RESKIN_FILE, sheets: sheets.size, ...summarize(reskin) }));
  } else if (cmd === 'validate') {
    const reskin = loadReskin(), sheets = loadSheets(), problems = validateReskin({ inventory, reskin, sheets });
    console.log(JSON.stringify({ problems: problems.length, first: problems.slice(0, 10) }));
    process.exitCode = problems.length ? 1 : 0;
  } else if (cmd === 'report') {
    console.log(JSON.stringify(summarize(loadReskin()), null, 1));
  } else throw new Error(`unknown command ${cmd}; use plan, validate or report`);
}
