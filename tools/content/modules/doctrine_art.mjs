// Doctrine art: the 86 sprites of interface/zin_doctrines.gfx (52 grand, sub and hidden doctrine icons, 11 track backgrounds and
// icons, 4 folder ledgers, 4 folder tabs and 4 folder decor strips). Every picture is image-generated (gpt-6-luna, owner route);
// this module only finds, crops, keys, resizes and converts what the image model produced. The cell map is the tracked
// tools/content/data/doctrine_art_cells.json. A sprite whose sheet has no accepted review line keeps the ZIN frame texture;
// once the cell map says "complete", a sprite still on the frame fails the build.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { rawFile, provenanceFile } from '../lib/paths.mjs';
import { findRegionsAdaptive } from '../lib/sheets.mjs';
import { fromRaw, dds } from '../lib/raster.mjs';
import { acceptance } from './presentation.mjs';

export const CELLS_FILE = fileURLToPath(new URL('../data/doctrine_art_cells.json', import.meta.url));
export const DOCTRINE_DIR = 'gfx/interface/doctrines/zin';
export const FRAME_TEXTURE = 'gfx/interface/zin/unknown/doctrine.dds';   // the family unknown icon (UI lane C3): check 11 reports every sprite on it
// Sizes: the medallion icons are 64x64 as the vanilla doctrine icons (gfx/interface/doctrines/icons, 64x64 RGBA); the track
// backgrounds are 360x660 as vanilla grand_battleplan_bg; the tabs are 182x61 as vanilla techtree_landdoctrine_tab; the decor
// strips are 764x82 as vanilla doctrine_decor_land. The ledger icons share the 64x64 medallion size.
export const SIZE = { medallion: 64, bg: [360, 660], tab: [182, 61], decor: [764, 82] };
const MEDAL_INSET = 4;

const sha256 = b => createHash('sha256').update(b).digest('hex');
const sizeOf = key => {
  if (key.endsWith('_bg')) return { kind: 'opaque', w: SIZE.bg[0], h: SIZE.bg[1] };
  if (key.endsWith('_tab')) return { kind: 'opaque', w: SIZE.tab[0], h: SIZE.tab[1] };
  if (key.startsWith('decor_')) return { kind: 'opaque', w: SIZE.decor[0], h: SIZE.decor[1] };
  return { kind: 'round', w: SIZE.medallion, h: SIZE.medallion };
};
// The staged file of a doctrine sprite, relative to the game root.
export const doctrineTexture = key => `${DOCTRINE_DIR}/${key}.dds`;

// Every sprite the doctrine window needs, in the order the cell map lists them.
export function doctrineArtKeys(cells) { return cells.sheets.flatMap(s => s.keys); }

// Round medallion: the cut square keeps a circle of opaque pixels with a one-pixel antialiased edge; everything outside is clear.
function roundMask(buf, w, h) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = ((x + 0.5) / w) * 2 - 1, dy = ((y + 0.5) / h) * 2 - 1, d = Math.sqrt(dx * dx + dy * dy);
    const a = d <= 0.96 ? 255 : d >= 1 ? 0 : Math.round(255 * (1 - d) / 0.04);
    buf[(y * w + x) * 4 + 3] = Math.min(buf[(y * w + x) * 4 + 3], a);
  }
  return buf;
}

// Cuts every piece of one accepted sheet. Returns [{ key, buf, w, h }] in cell-map order, or throws when the sheet's layout is not met.
export async function cutSheet(file, sheet) {
  const n = sheet.keys.length, pieces = [];
  if (sheet.method === 'medallion') {
    const r = await findRegionsAdaptive(file, n, { cols: sheet.cols, rows: sheet.rows, aspect: [0.75, 1.33], minAreaFraction: 0.25 });
    if (!r.ok) throw new Error(`${sheet.sheet}: found ${r.found ?? '?'} medallions, expected ${n}`);
    for (const [i, key] of sheet.keys.entries()) {
      const { w, h } = sizeOf(key), b = r.regions[i];
      const img = await sharp(file).removeAlpha().extract({ left: b.x0 + MEDAL_INSET, top: b.y0 + MEDAL_INSET, width: b.x1 - b.x0 - 2 * MEDAL_INSET, height: b.y1 - b.y0 - 2 * MEDAL_INSET })
        .resize(w, h, { fit: 'fill', kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer();
      pieces.push({ key, buf: roundMask(img, w, h), w, h, cell: i });
    }
    return pieces;
  }
  // Grid sheets: equal cells in row order; a 3% inset drops the gutter and the anti-aliased edge; the piece is cut to its aspect (cover).
  const { width: W, height: H } = await sharp(file).metadata();
  for (const [i, key] of sheet.keys.entries()) {
    const col = i % sheet.cols, row = Math.floor(i / sheet.cols), cw = W / sheet.cols, ch = H / sheet.rows;
    const inX = Math.round(cw * 0.03), inY = Math.round(ch * 0.03);
    const { w, h } = sizeOf(key);
    const buf = await sharp(file).extract({ left: Math.round(col * cw) + inX, top: Math.round(row * ch) + inY, width: Math.round(cw) - 2 * inX, height: Math.round(ch) - 2 * inY })
      .resize(w, h, { fit: 'cover', position: sheet.position ?? 'centre', kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer();
    pieces.push({ key, buf, w, h, cell: i });
  }
  return pieces;
}

// Builds every accepted doctrine sprite into the staged tree. Returns the set of keys shipped (the rest keep the frame).
// `warn` receives a line for each sheet whose art is not accepted yet.
export async function buildDoctrineArt(staged, { warn = () => {}, provenance } = {}) {
  const cells = JSON.parse(await readFile(CELLS_FILE, 'utf8'));
  const provLines = provenance ?? (await readFile(provenanceFile(), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l));
  const shipped = new Set(), manifest = [], sources = new Map();
  for (const sheet of cells.sheets) {
    const rel = `doctrines/${sheet.sheet}.png`;
    let bytes;
    try { bytes = await readFile(rawFile(rel)); } catch { warn(`${rel}: not generated; ${sheet.keys.length} doctrine sprites keep the frame`); continue; }
    const acc = acceptance(provLines, rel, bytes);
    if (!acc.ok) { warn(`${rel}: ${acc.why}; ${sheet.keys.length} doctrine sprites keep the frame`); continue; }
    const tmp = rawFile(rel);
    const pieces = await cutSheet(tmp, sheet);
    sources.set(`doctrines/${sheet.sheet}.png`, { bytes, sha: acc.sha, id: acc.id });
    for (const p of pieces) {
      const out = doctrineTexture(p.key);
      staged.add(out, dds(fromRaw(p.buf, p.w, p.h)));
      shipped.add(p.key);
      manifest.push({ out, source: `art/source/doctrines/${sheet.sheet}.png`, sourceSha256: acc.sha, cell: p.cell, ops: sheet.method === 'medallion' ? ['detect medallion', `cut ${MEDAL_INSET}px inset`, `lanczos3 ${p.w}x${p.h}`, 'circle alpha'] : ['equal grid cell, 3% inset', `cover ${p.w}x${p.h}`, 'dds a8r8g8b8'], sha256: sha256(dds(fromRaw(p.buf, p.w, p.h))) });
    }
  }
  for (const [rel, s] of [...sources].sort(([a], [b]) => a.localeCompare(b, 'en'))) staged.add(`art/source/${rel}`, s.bytes);
  // One provenance line per shipped DDS (the asset gate reads art/source/<name>_manifest.json directly under art/source/).
  staged.add('art/source/doctrine_art_manifest.json', Buffer.from(JSON.stringify({ generator: 'tools/content/modules/doctrine_art.mjs', files: manifest.sort((a, b) => a.out.localeCompare(b.out, 'en')) }, null, 1) + '\n'));
  return shipped;
}

// The build check: once the cell map says the family is complete, no doctrine sprite may still point at the frame.
export function assertDoctrineArtComplete(cells, shipped) {
  if (!cells.complete) return;
  const missing = doctrineArtKeys(cells).filter(k => !shipped.has(k));
  if (missing.length) throw new Error(`doctrine art is marked complete but ${missing.length} sprite(s) still use the frame: ${missing.slice(0, 8).join(', ')}`);
}

export async function loadDoctrineArtCells() { return JSON.parse(await readFile(CELLS_FILE, 'utf8')); }
