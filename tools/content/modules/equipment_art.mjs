// Equipment art: the sprites of interface/zin_equipment.gfx, one picture per equipment archetype (GFX_archetype_<id>_medium) and one per
// equipment type (GFX_<variant>_medium), 151 concepts in all (35 archetypes including the four hulls, 116 types). Every picture is
// image-generated (gpt-6-luna, owner route) in the Banner Hall equipment style of docs/specs/07_interface/07_design_system.md §4.2:
// the object itself, three-quarter view, one light, transparent ground. This module only finds, keys, crops, scales and converts
// what the image model produced; the cell map is the tracked tools/content/data/equipment_art_cells.json. A sprite whose sheet has
// no accepted review line keeps the family unknown icon; once the cell map says "complete", an equipment sprite still on the unknown
// icon fails the build.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { rawFile, provenanceFile } from '../lib/paths.mjs';
import { fromRaw, dds } from '../lib/raster.mjs';
import { keyMatte } from '../lib/fit.mjs';
import { acceptance } from './presentation.mjs';

export const CELLS_FILE = fileURLToPath(new URL('../data/equipment_art_cells.json', import.meta.url));
export const ARCH_DIR = 'gfx/interface/archetypes/zin';
export const EQUIP_DIR = 'gfx/interface/equipment/zin';
export const DESIGNER_DIR = 'gfx/interface/equipmentdesigner/zin';   // the ship designer pictures (kind designer, sizes per key in the cell map)
export const EQUIP_FRAME = 'gfx/interface/zin/unknown/equipment.dds';   // the family unknown icon (UI lane C3): check 11 reports every sprite on it
export const EQUIP_SIZE = { w: 146, h: 54 };                             // the equipment family size (design system §4.2, check 12)
const PAD = 2;                                                           // clear pixels around a picture on its canvas
const KEY_LO = 16, KEY_HI = 56;                                          // black ground keyed to alpha between these distances
const OPAQUE = 96;                                                       // alpha from which a pixel is part of a picture
const JOIN = 0;                                                          // pixels: parts of one picture closer than this are joined (a helm beside its mail, a shaft and its head)
const MIN_PIXELS = 400;                                                  // a piece smaller than this is a speck, not a picture

const sha256 = b => createHash('sha256').update(b).digest('hex');

// The staged texture of a sprite, relative to the game root: an archetype or an equipment type.
export const equipmentTexture = (kind, key) => `${kind === 'archetype' ? ARCH_DIR : kind === 'designer' ? DESIGNER_DIR : EQUIP_DIR}/${key}.dds`;
// The keys shipped by the last buildEquipmentArt run (the designer pictures are read by forces.mjs, which builds after warfare).
export const shippedEquipment = new Set();

// Finds the pictures of one sheet: keys the black ground to alpha, joins parts closer than JOIN pixels, and labels the connected
// pictures across the whole sheet (the model does not draw on an exact grid, so cutting by cell clips pictures that cross a cell line).
// Pictures are then taken in the sheet's listed order: row bands of the sheet (sheet.rows), left to right inside each row, with
// the row counts the grid implies (cols per row, the last row short). Any other count is an error, never a guess.
async function findPictures(file, sheet) {
  const meta = await sharp(file).metadata();
  const W = meta.width, H = meta.height;
  const rgb = await sharp(file).flatten({ background: '#000000' }).removeAlpha().raw().toBuffer();
  const keyed = Buffer.from(keyMatte(rgb, W, H, [0, 0, 0], KEY_LO, KEY_HI));
  const mask = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) mask[i] = keyed[i * 4 + 3] >= OPAQUE ? 1 : 0;
  // integral image for the dilation window
  const I = new Int32Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) { let row = 0; for (let x = 0; x < W; x++) { row += mask[y * W + x]; I[(y + 1) * (W + 1) + x + 1] = I[y * (W + 1) + x + 1] + row; } }
  const near = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    const y0 = Math.max(0, y - JOIN), y1 = Math.min(H - 1, y + JOIN);
    for (let x = 0; x < W; x++) {
      const x0 = Math.max(0, x - JOIN), x1 = Math.min(W - 1, x + JOIN);
      const s = I[(y1 + 1) * (W + 1) + x1 + 1] - I[y0 * (W + 1) + x1 + 1] - I[(y1 + 1) * (W + 1) + x0] + I[y0 * (W + 1) + x0];
      near[y * W + x] = s > 0 ? 1 : 0;
    }
  }
  // connected components of the joined mask (4-connected)
  const label = new Int32Array(W * H).fill(-1), stack = new Int32Array(W * H);
  let n = 0;
  for (let p = 0; p < W * H; p++) {
    if (!near[p] || label[p] >= 0) continue;
    let sp = 0; stack[sp++] = p; label[p] = n;
    while (sp) {
      const q = stack[--sp], qx = q % W, qy = (q - qx) / W;
      const nb = [qx > 0 ? q - 1 : -1, qx < W - 1 ? q + 1 : -1, qy > 0 ? q - W : -1, qy < H - 1 ? q + W : -1];
      for (const r of nb) if (r >= 0 && near[r] && label[r] < 0) { label[r] = n; stack[sp++] = r; }
    }
    n++;
  }
  // per component: opaque pixel count and bounding box of its opaque pixels
  const comp = Array.from({ length: n }, () => ({ count: 0, x0: W, y0: H, x1: -1, y1: -1 }));
  for (let p = 0; p < W * H; p++) {
    if (!mask[p]) continue;
    const c = comp[label[p]], x = p % W, y = (p - x) / W;
    c.count++; if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x; if (y < c.y0) c.y0 = y; if (y > c.y1) c.y1 = y;
  }
  // The parts of one picture may be several components (a gun and its match), so every component is given to the grid cell that holds
  // its centre, and a cell's picture is the union of its components. A picture that crosses a cell line stays whole this way.
  const cw = W / sheet.cols, ch = H / sheet.rows;
  const cellOf = c => Math.min(sheet.rows - 1, Math.floor(((c.y0 + c.y1) / 2) / ch)) * sheet.cols + Math.min(sheet.cols - 1, Math.floor(((c.x0 + c.x1) / 2) / cw));
  const cells = Array.from({ length: sheet.keys.length }, () => ({ count: 0, x0: W, y0: H, x1: -1, y1: -1 }));
  const seen = new Set();
  for (const c of comp) {
    if (c.count < MIN_PIXELS) continue;
    const i = cellOf(c);
    if (i >= cells.length) throw new Error(`${sheet.sheet}: a picture lies outside the ${sheet.cols} x ${sheet.rows} grid`);
    seen.add(i);
    const u = cells[i];
    u.count += c.count; u.x0 = Math.min(u.x0, c.x0); u.x1 = Math.max(u.x1, c.x1); u.y0 = Math.min(u.y0, c.y0); u.y1 = Math.max(u.y1, c.y1);
  }
  const empty = cells.map((_, i) => i).filter(i => !seen.has(i));
  if (empty.length) throw new Error(`${sheet.sheet}: ${empty.length} grid cell(s) hold no picture (cells ${empty.join(', ')}) for ${sheet.keys.length} listed pictures`);
  const pics = cells.map((u, i) => ({ ...u, row: Math.floor(i / sheet.cols), cell: i }));
  return { pics, keyed, W, H };
}

// Cuts every picture of one accepted sheet. Returns pieces { key, buf (RGBA 146 x 54), cell, bbox, scale }.
// Each picture is contained in the 142 x 50 box inside the canvas (the larger the picture's box, the smaller its scale), centred,
// so the family keeps the vanilla look of an object on a wide plate.
export async function cutEquipmentSheet(file, sheet) {
  const { pics, keyed, W, H } = await findPictures(file, sheet);
  const full = sharp(keyed, { raw: { width: W, height: H, channels: 4 } });
  const pieces = [];
  for (const [i, key] of sheet.keys.entries()) {
    const p = pics[i];
    const bw = p.x1 - p.x0 + 1, bh = p.y1 - p.y0 + 1;
    const size = sheet.sizes?.[key] ?? [EQUIP_SIZE.w, EQUIP_SIZE.h], [CW, CH] = size;
    const s = Math.min((CW - 2 * PAD) / bw, (CH - 2 * PAD) / bh);
    const tw = Math.max(1, Math.round(bw * s)), th = Math.max(1, Math.round(bh * s));
    const { data } = await full.clone().extract({ left: p.x0, top: p.y0, width: bw, height: bh })
      .resize(tw, th, { kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const buf = Buffer.alloc(CW * CH * 4);
    const ox = Math.floor((CW - tw) / 2), oy = Math.floor((CH - th) / 2);
    for (let y = 0; y < th; y++) data.copy(buf, ((oy + y) * CW + ox) * 4, y * tw * 4, (y + 1) * tw * 4);
    pieces.push({ key, buf, w: CW, h: CH, cell: i, bbox: [bw, bh], scale: +s.toFixed(3), row: p.row });
  }
  return pieces;
}

// Builds every accepted equipment sprite into the staged tree. Returns the set of keys shipped (the rest keep the frame).
// `warn` receives a line for each sheet whose art is not accepted yet.
export async function buildEquipmentArt(staged, { warn = () => {}, provenance } = {}) {
  const cells = JSON.parse(await readFile(CELLS_FILE, 'utf8'));
  const provLines = provenance ?? (await readFile(provenanceFile(), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l));
  const shipped = shippedEquipment, manifest = [], sources = new Map();
  shipped.clear();
  for (const sheet of cells.sheets) {
    const rel = `equipment/${sheet.sheet}.png`;
    let bytes;
    try { bytes = await readFile(rawFile(rel)); } catch { warn(`${rel}: not generated; ${sheet.keys.length} equipment sprites keep the frame`); continue; }
    const acc = acceptance(provLines, rel, bytes);
    if (!acc.ok) { warn(`${rel}: ${acc.why}; ${sheet.keys.length} equipment sprites keep the frame`); continue; }
    const pieces = await cutEquipmentSheet(rawFile(rel), sheet);
    sources.set(rel, { bytes, sha: acc.sha });
    for (const p of pieces) {
      const out = equipmentTexture(sheet.kind, p.key), data = dds(fromRaw(p.buf, p.w, p.h));
      staged.add(out, data);
      shipped.add(p.key);
      manifest.push({ out, kind: sheet.kind, source: `art/source/${rel}`, sourceSha256: acc.sha, cell: p.cell, bbox: p.bbox, scale: p.scale, ops: ['black ground keyed to alpha', 'join parts within 6 px, one picture per connected region', `lanczos3 scale ${p.scale}`, `centre on ${EQUIP_SIZE.w}x${EQUIP_SIZE.h}`, 'dds a8r8g8b8'], sha256: sha256(data) });
    }
  }
  for (const [rel, s] of [...sources].sort(([a], [b]) => a.localeCompare(b, 'en'))) staged.add(`art/source/${rel}`, s.bytes);
  // Manifest of the shipped DDS files (the asset gate reads art/source/<name>_manifest.json directly under art/source/).
  staged.add('art/source/equipment_art_manifest.json', Buffer.from(JSON.stringify({ generator: 'tools/content/modules/equipment_art.mjs', files: manifest.sort((a, b) => a.out.localeCompare(b.out, 'en')) }, null, 1) + '\n'));
  return shipped;
}

// The build check: once the cell map says the family is complete, no equipment sprite may still point at the unknown icon.
export function assertEquipmentArtComplete(cells, shipped) {
  if (!cells.complete) return;
  const missing = cells.sheets.flatMap(s => s.keys).filter(k => !shipped.has(k));
  if (missing.length) throw new Error(`equipment art is marked complete but ${missing.length} sprite(s) still use the frame: ${missing.slice(0, 8).join(', ')}`);
}

export async function loadEquipmentArtCells() { return JSON.parse(await readFile(CELLS_FILE, 'utf8')); }
