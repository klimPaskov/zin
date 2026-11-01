// Sub-unit art: the sprites of interface/zin_units.gfx (lane I3). Each sub-unit has up to three sprites, each cut from accepted sheets:
//   GFX_unit_<id>_icon_medium        divisions_large/zin/<id>.dds   152 x 42, two frames (the bare symbol, then the plate)
//   GFX_unit_<id>_icon_medium_white  the map counter, in the vanilla form of its family:
//                                    land and great beings: divisions_small/zin/<id>.dds   60 x 12, two frames
//                                    aircraft: air_small/zin/<id>.dds                       60 x 12, two frames
//                                    naval: ships_small/zin/<id>.dds                        30 x 12, one frame
//   GFX_unit_<id>_icon_small         the inline text icon: the same DDS as the map counter (one file per counter, no second copy)
// Every picture is image-generated (gpt-6-luna, owner route) in the vanilla-green counter family sampled from the installed game
// (sage green on a grey plate). This module only keys the black ground, crops, contains and converts what the image model produced.
// The cell map is tools/content/data/unit_art_cells.json. A sprite whose sheet has no accepted review line keeps the unknown icon;
// once the cell map says "complete", a unit sprite still on the unknown icon fails the build.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { rawFile, provenanceFile } from '../lib/paths.mjs';
import { fromRaw, dds } from '../lib/raster.mjs';
import { keyMatte } from '../lib/fit.mjs';
import { acceptance } from './presentation.mjs';

export const CELLS_FILE = fileURLToPath(new URL('../data/unit_art_cells.json', import.meta.url));
export const LARGE_DIR = 'gfx/interface/counters/divisions_large/zin';
export const UNIT_FRAME = 'gfx/interface/zin/unknown/unit.dds';   // the family unknown icon (UI lane C3): check 11 reports every sprite on it
export const LARGE_FRAME = { w: 76, h: 42 }, MAP_FRAME = { w: 30, h: 12 };   // one frame each (the map frame is also the naval counter)
// The map counter's folder and frame count by sheet kind and aircraft or land (vanilla: divisions_small and air_small are 60 x 12 with
// two frames; ships_small is 30 x 12 with one).
const MAP_DIRS = { land: 'gfx/interface/counters/divisions_small/zin', air: 'gfx/interface/counters/air_small/zin', ship: 'gfx/interface/counters/ships_small/zin' };
const PAD = 1;            // clear pixels around a picture inside its frame
const KEY_LO = 16, KEY_HI = 56;   // black ground keyed to alpha between these distances
const OPAQUE = 96;        // alpha from which a pixel belongs to the picture
const MIN_PIXELS = 200;   // a region smaller than this is a speck, not part of a picture

const sha256 = b => createHash('sha256').update(b).digest('hex');

export const largeTexture = id => `${LARGE_DIR}/${id}.dds`;

// Contains one picture (an RGBA box of its own) in a frame with a clear margin.
async function containFrame(pic, fw, fh) {
  const inner = { w: fw - 2 * PAD, h: fh - 2 * PAD };
  const out = await sharp(pic.buf, { raw: { width: pic.w, height: pic.h, channels: 4 } })
    .resize(inner.w, inner.h, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (out.info.width !== fw || out.info.height !== fh || out.info.channels !== 4) throw new Error(`unit art: frame ${out.info.width}x${out.info.height}, expected ${fw}x${fh}`);
  return out.data;
}

// Pair two frames into one texture (frame 0 left, frame 1 right, as noOfFrames = 2 reads them).
async function pairFrames(a, b, fw, fh) {
  const { data } = await sharp({ create: { width: fw * 2, height: fh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: a, raw: { width: fw, height: fh, channels: 4 }, left: 0, top: 0 }, { input: b, raw: { width: fw, height: fh, channels: 4 }, left: fw, top: 0 }])
    .raw().toBuffer({ resolveWithObject: true });
  return data;
}

// Large sheets: connected opaque regions are labelled, and each region is given to the grid cell that holds its centre (a plate may
// cross a cell line). A cell's picture is the union of its regions.
function picturesOf(keyed, W, H, sheet) {
  const n = W * H, mask = new Uint8Array(n);
  for (let i = 0; i < n; i++) mask[i] = keyed[i * 4 + 3] >= OPAQUE ? 1 : 0;
  const label = new Int32Array(n).fill(-1), stack = new Int32Array(n), regions = [];
  for (let p = 0; p < n; p++) {
    if (!mask[p] || label[p] >= 0) continue;
    const id = regions.length; let sp = 0, count = 0, sx = 0, sy = 0;
    stack[sp++] = p; label[p] = id;
    while (sp) {
      const q = stack[--sp], x = q % W, y = (q - x) / W;
      count++; sx += x; sy += y;
      if (x > 0 && mask[q - 1] && label[q - 1] < 0) { label[q - 1] = id; stack[sp++] = q - 1; }
      if (x < W - 1 && mask[q + 1] && label[q + 1] < 0) { label[q + 1] = id; stack[sp++] = q + 1; }
      if (y > 0 && mask[q - W] && label[q - W] < 0) { label[q - W] = id; stack[sp++] = q - W; }
      if (y < H - 1 && mask[q + W] && label[q + W] < 0) { label[q + W] = id; stack[sp++] = q + W; }
    }
    regions.push({ count, cx: sx / count, cy: sy / count });
  }
  const cellOf = new Int32Array(regions.length).fill(-1);
  regions.forEach((r, id) => {
    if (r.count < MIN_PIXELS) return;
    const col = Math.min(sheet.cols - 1, Math.floor(r.cx / (W / sheet.cols)));
    const row = Math.min(sheet.rows - 1, Math.floor(r.cy / (H / sheet.rows)));
    cellOf[id] = row * sheet.cols + col;
  });
  const pics = Array.from({ length: sheet.cols * sheet.rows }, () => ({ x0: W, y0: H, x1: -1, y1: -1 }));
  for (let p = 0; p < n; p++) {
    if (!mask[p]) continue;
    const c = cellOf[label[p]];
    if (c < 0) continue;
    const x = p % W, y = (p - x) / W, b = pics[c];
    if (x < b.x0) b.x0 = x; if (x > b.x1) b.x1 = x; if (y < b.y0) b.y0 = y; if (y > b.y1) b.y1 = y;
  }
  return pics.map((b, c) => {
    if (b.x1 < 0) throw new Error(`${sheet.sheet}: grid cell ${c} holds no picture`);
    const w = b.x1 - b.x0 + 1, h = b.y1 - b.y0 + 1, buf = Buffer.alloc(w * h * 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const p = (b.y0 + y) * W + b.x0 + x;
      if (!mask[p] || cellOf[label[p]] !== c) continue;
      keyed.copy(buf, (y * w + x) * 4, p * 4, p * 4 + 4);
    }
    return { buf, w, h };
  });
}

// Map sheets are drawn as small plates packed close together, so their pictures are cut by the grid cell that holds them: each cell's
// picture is the opaque box of that cell's own pixels (a neighbour's pixels never enter a cell).
function gridPicturesOf(keyed, W, H, sheet) {
  const cw = W / sheet.cols, ch = H / sheet.rows;
  return Array.from({ length: sheet.cols * sheet.rows }, (_, c) => {
    const x0c = Math.round((c % sheet.cols) * cw), x1c = Math.round((c % sheet.cols + 1) * cw);
    const y0c = Math.round(Math.floor(c / sheet.cols) * ch), y1c = Math.round((Math.floor(c / sheet.cols) + 1) * ch);
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = y0c; y < y1c; y++) for (let x = x0c; x < x1c; x++) {
      if (keyed[(y * W + x) * 4 + 3] < OPAQUE) continue;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    if (x1 < 0) throw new Error(`${sheet.sheet}: grid cell ${c} holds no picture`);
    const w = x1 - x0 + 1, h = y1 - y0 + 1, buf = Buffer.alloc(w * h * 4);
    for (let y = y0c; y < y1c; y++) for (let x = x0c; x < x1c; x++) {
      const p = (y * W + x) * 4;
      if (keyed[p + 3] < OPAQUE || x < x0 || x > x1 || y < y0 || y > y1) continue;
      keyed.copy(buf, ((y - y0) * w + (x - x0)) * 4, p, p + 4);
    }
    return { buf, w, h };
  });
}

// Cuts every unit of one accepted sheet. Returns [{ id, kind, data, cell }]: large pictures are 152 x 42, map pictures 60 x 12 (land and
// aircraft, two frames) or 30 x 12 (naval, one frame).
export async function cutUnitSheet(file, sheet) {
  const meta = await sharp(file).metadata();
  const W = meta.width, H = meta.height;
  const rgb = await sharp(file).flatten({ background: '#000000' }).removeAlpha().raw().toBuffer();
  const keyed = Buffer.from(keyMatte(rgb, W, H, [0, 0, 0], KEY_LO, KEY_HI));
  const pieces = [];
  if (sheet.kind === 'ship') {
    const pics = gridPicturesOf(keyed, W, H, sheet);
    for (const [u, id] of sheet.units.entries()) pieces.push({ id, kind: 'ship', data: await containFrame(pics[u], MAP_FRAME.w, MAP_FRAME.h), cell: u });
    return pieces;
  }
  const pics = sheet.kind === 'map' ? gridPicturesOf(keyed, W, H, sheet) : picturesOf(keyed, W, H, sheet);
  const F = sheet.kind === 'large' ? LARGE_FRAME : MAP_FRAME;
  for (const [u, id] of sheet.units.entries()) {
    const symbol = pics[2 * u], plate = pics[2 * u + 1];
    const data = await pairFrames(await containFrame(symbol, F.w, F.h), await containFrame(plate, F.w, F.h), F.w, F.h);
    pieces.push({ id, kind: sheet.kind, data, cell: u });
  }
  return pieces;
}

// Builds every accepted unit sprite into the staged tree. Returns { large: Set, map: Map(id -> {file, frames}), text: Map(id -> {file, frames}) }.
// `warn` receives a line for each sheet whose art is not accepted yet.
export async function buildUnitArt(staged, { warn = () => {}, provenance } = {}) {
  const cells = JSON.parse(await readFile(CELLS_FILE, 'utf8'));
  const provLines = provenance ?? (await readFile(provenanceFile(), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l));
  const large = new Set(), map = new Map(), text = new Map(), manifest = [], sources = new Map();
  const ops = frame => ['key black ground', 'crop to the picture', `contain ${frame.w}x${frame.h} per frame`, 'frames side by side'];
  for (const sheet of cells.sheets) {
    const rel = `units/${sheet.sheet}.png`;
    let bytes;
    try { bytes = await readFile(rawFile(rel)); } catch { warn(`${rel}: not generated; ${sheet.units.length} unit sprites keep the frame`); continue; }
    const acc = acceptance(provLines, rel, bytes);
    if (!acc.ok) { warn(`${rel}: ${acc.why}; ${sheet.units.length} unit sprites keep the frame`); continue; }
    const pieces = await cutUnitSheet(rawFile(rel), sheet);
    sources.set(rel, { bytes, sha: acc.sha });
    for (const p of pieces) {
      if (p.kind === 'large') {
        const out = largeTexture(p.id), data = dds(fromRaw(p.data, LARGE_FRAME.w * 2, LARGE_FRAME.h));
        staged.add(out, data); large.add(p.id);
        manifest.push({ out, source: `art/source/${rel}`, sourceSha256: acc.sha, cell: p.cell, ops: ops(LARGE_FRAME), sha256: sha256(data) });
        continue;
      }
      if (p.kind === 'ship') {
        const out = `${MAP_DIRS.ship}/${p.id}.dds`, data = dds(fromRaw(p.data, MAP_FRAME.w, MAP_FRAME.h));
        staged.add(out, data); map.set(p.id, { file: out, frames: 1 }); text.set(p.id, { file: out, frames: 1 });
        manifest.push({ out, source: `art/source/${rel}`, sourceSha256: acc.sha, cell: p.cell, ops: ['key black ground', 'crop to the picture', `contain ${MAP_FRAME.w}x${MAP_FRAME.h}`], sha256: sha256(data) });
        continue;
      }
      // map pictures: aircraft in air_small, land and great beings in divisions_small (their text icon is the land map art)
      const air = sheet.dir === 'air_small', out = `${air ? MAP_DIRS.air : MAP_DIRS.land}/${p.id}.dds`;
      const data = dds(fromRaw(p.data, MAP_FRAME.w * 2, MAP_FRAME.h));
      // One file per counter: the text icon sprite points at the same DDS as the map counter (no second copy is shipped).
      staged.add(out, data); map.set(p.id, { file: out, frames: 2 }); text.set(p.id, { file: out, frames: 2 });
      manifest.push({ out, source: `art/source/${rel}`, sourceSha256: acc.sha, cell: p.cell, ops: ops(MAP_FRAME), sha256: sha256(data) });
    }
  }
  for (const [rel, s] of [...sources].sort(([a], [b]) => a.localeCompare(b, 'en'))) staged.add(`art/source/${rel}`, s.bytes);
  staged.add('art/source/unit_art_manifest.json', Buffer.from(JSON.stringify({ generator: 'tools/content/modules/unit_art.mjs', files: manifest.sort((a, b) => a.out.localeCompare(b.out, 'en')) }, null, 1) + '\n'));
  return { large, map, text };
}

// The build check: once the cell map says the family is complete, no unit sprite may still point at the unknown icon.
export function assertUnitArtComplete(cells, shipped) {
  if (!cells.complete) return;
  const missing = cells.sheets.flatMap(s => s.units).filter(id => !shipped.large.has(id) || !shipped.map.has(id));
  if (missing.length) throw new Error(`unit art: ${missing.length} sub-unit sprites are not shipped (${missing.slice(0, 8).join(', ')})`);
}
