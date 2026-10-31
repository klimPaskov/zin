// The cells of ZIN's own windows (UI overhaul lane C3): one generated sheet on a flat black ground, described by
// tools/content/data/ui/zin_chrome.json, cut by rows and items and fitted to the sprites modules/ui.mjs writes.
//
//   loadZinChrome(source)  -> { spec, cells: Map<key, Img>, sprites: [{ name, texture, img, frames, ... }] }
//
// Cutting: the rows are the horizontal bands of the sheet separated by black lines, and the items of a row the runs of
// columns separated by black gutters inside the band; each row must hold exactly the items the data lists, so a sheet
// whose layout drifted stops the build instead of shipping a wrong cell. Code only crops, nine-slices, resizes, takes the
// alpha of an isolated object from its outline on black (marks and dividers) and places frames side by side (spec 02 §2.2).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadImage, crop, makeImg, runFit } from './fit.mjs';

export const ZIN_CHROME_FILE = fileURLToPath(new URL('../data/ui/zin_chrome.json', import.meta.url));
export const loadChromeSpec = (file = ZIN_CHROME_FILE) => JSON.parse(readFileSync(file, 'utf8'));

const lit = (img, x, y, t) => { const o = (y * img.w + x) * 4; return Math.max(img.data[o], img.data[o + 1], img.data[o + 2]) > t; };
// Runs of indices whose `on` is true, joined across gaps shorter than minGap.
function runs(n, on, minGap) {
  const out = [];
  let start = -1, lastOn = -1;
  for (let i = 0; i < n; i++) {
    if (!on(i)) continue;
    if (start < 0) start = i; else if (i - lastOn > minGap) { out.push([start, lastOn + 1]); start = i; }
    lastOn = i;
  }
  if (start >= 0) out.push([start, lastOn + 1]);
  return out;
}
// Cuts the sheet: [{ row, items: [{ key, box }] }]. Throws when a row or an item count differs from the data.
export function cutSheet(img, spec) {
  const t = spec.sheet.threshold ?? 14, gap = spec.sheet.minGutter ?? 4;
  // a pixel row counts when a few of its pixels are lit (specks of noise do not make a band)
  const rowOn = y => { let n = 0; for (let x = 0; x < img.w; x++) if (lit(img, x, y, t) && ++n > 3) return true; return false; };
  const bands = runs(img.h, rowOn, gap).filter(([a, b]) => b - a > 3);
  if (bands.length !== spec.rows.length) throw new Error(`${spec.sheet.id}: ${bands.length} rows found, the data lists ${spec.rows.length}`);
  return spec.rows.map((r, i) => {
    const [y0, y1] = bands[i];
    const colOn = x => { for (let y = y0; y < y1; y++) if (lit(img, x, y, t)) return true; return false; };
    const items = runs(img.w, colOn, gap).filter(([a, b]) => b - a > 3);
    if (items.length !== r.items.length) throw new Error(`${spec.sheet.id}: row ${i + 1} (${r.row}) has ${items.length} items, the data lists ${r.items.length}`);
    return { row: r.row, items: r.items.map((it, j) => {
      const [x0, x1] = items[j];
      // tighten the box vertically to this item alone
      const on = y => { for (let x = x0; x < x1; x++) if (lit(img, x, y, t)) return true; return false; };
      let a = y0, b = y1; while (a < b && !on(a)) a++; while (b > a && !on(b - 1)) b--;
      return { key: it.key, box: { x0, y0: a, x1, y1: b } };
    }) };
  });
}
// Alpha of an isolated object on black: opaque where the object is, falling off over the anti-aliased edge.
export function outlineAlpha(img, soft = 48) {
  const out = makeImg(img.w, img.h, Buffer.from(img.data));
  for (let i = 0; i < img.w * img.h; i++) { const o = i * 4, m = Math.max(img.data[o], img.data[o + 1], img.data[o + 2]); out.data[o + 3] = Math.min(255, Math.round(m * 255 / soft)); }
  return out;
}

export async function loadZinChrome(source, spec = loadChromeSpec()) {
  const file = source(spec.sheet.raw), sheet = await loadImage(file);
  const inset = 2, cells = new Map(), boxes = new Map(), outlined = spec.sheet.alphaFromOutline ?? {};
  for (const r of cutSheet(sheet, spec)) for (const { key, box } of r.items) {
    const soft = outlined[key];
    const pad = soft ? 0 : inset;   // an outlined object keeps its anti-aliased edge for its alpha
    let img = crop(sheet, box.x0 + pad, box.y0 + pad, box.x1 - box.x0 - 2 * pad, box.y1 - box.y0 - 2 * pad);
    if (soft) img = outlineAlpha(img, soft);
    cells.set(key, img); boxes.set(key, box);
  }
  const cell = k => { const c = cells.get(k); if (!c) throw new Error(`${spec.sheet.id}: no cell ${k}`); return c; };
  const sprites = [];
  const f = spec.sprites.frames, built = new Map();
  for (const s of f.list) {
    if (!built.has(s.texture)) {
      const c = cell(s.cell), border = Math.round(c.w * spec.sprites.frames.cellBorder[s.cell]);
      built.set(s.texture, await runFit('nine_slice', [c], { width: f.size[0], height: f.size[1], borderSize: [f.border, f.border] }, { cellBorder: border }));
    }
    const r = built.get(s.texture);
    sprites.push({ name: s.name, texture: s.texture, img: r.img, ops: r.ops, kind: 'frame', size: f.size, border: f.border, theme: s.theme, cells: [s.cell] });
  }
  // nine_slice: cellBorder is the painted border as a fraction of the cell height ([x, y] or one number), border the target border in px.
  const pair = v => (Array.isArray(v) ? v : [v, v]);
  for (const s of spec.sprites.list) {
    const frames = s.cells.length, target = { width: s.size[0] * frames, height: s.size[1], frames };
    const opts = { frameFit: s.fit, padding: s.padding };
    if (s.fit === 'nine_slice') {
      target.borderSize = pair(s.border);
      const [fx, fy] = pair(s.cellBorder);
      opts.cellBorder = c => ({ x: Math.round(c.h * fx), y: Math.round(c.h * fy) });
    }
    const r = frames > 1 ? await runFit('strip', s.cells.map(cell), target, opts) : await runFit(s.fit, [cell(s.cells[0])], target, opts);
    sprites.push({ ...s, img: r.img, ops: r.ops, frames });
  }
  return { spec, file, cells, boxes, sprites };
}
