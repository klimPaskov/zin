// Fits from a generated cell to a vanilla-shaped target (spec docs/specs/07_interface/02_full_ui_reskin.md, section 5),
// and the mattes the art modules share. Code here only finds, crops, mattes, resizes, tiles and places generated pixels
// (art pipeline rule 1): it never paints, tints, draws a line or writes text.
//
//   Img = { w, h, data }     straight-alpha RGBA bytes, top-left origin
//   Target = { width, height, frames, borderSize }     measured from the inventory, never invented
//
//   runFit(name, cells, target, opts) -> Promise<{ img, ops }>
//   FITS: nine_slice exact cover contain repeat_x repeat_y strip same_shape
//
// A fit makes the whole texture. For a target with several frames the fit is `strip`: one cell per frame, each fitted
// into the frame by `opts.frameFit`. Every function is deterministic for the pinned sharp build (tools/package-lock.json).
import sharp from 'sharp';
import { Canvas, fromRaw } from './raster.mjs';

export const FITS = ['nine_slice', 'exact', 'cover', 'contain', 'repeat_x', 'repeat_y', 'strip', 'same_shape'];
export const FRAME_FITS = ['nine_slice', 'exact', 'cover', 'contain', 'repeat_x', 'repeat_y', 'same_shape'];
export const ASPECT_TOLERANCE = 0.15;
export class FitError extends Error { constructor(code, message) { super(message); this.code = code; } }

// ---------------------------------------------------------------------------------------------------- images
export const makeImg = (w, h, data = Buffer.alloc(w * h * 4)) => ({ w, h, data });
const sharpOf = img => sharp(img.data, { raw: { width: img.w, height: img.h, channels: 4 } });
const fromSharp = async s => { const { data, info } = await s.ensureAlpha().raw().toBuffer({ resolveWithObject: true }); return makeImg(info.width, info.height, data); };
export async function loadImage(source) { return fromSharp(sharp(source)); }
export const toCanvas = img => fromRaw(img.data, img.w, img.h);
export const fromCanvas = canvas => makeImg(canvas.w, canvas.h, canvas.rgba());

export async function resize(img, w, h) {
  if (img.w === w && img.h === h) return img;
  return fromSharp(sharpOf(img).resize(w, h, { fit: 'fill', kernel: 'lanczos3' }));
}
export function crop(img, left, top, width, height) {
  if (left < 0 || top < 0 || width < 1 || height < 1 || left + width > img.w || top + height > img.h) throw new FitError('crop', `crop ${left},${top} ${width}x${height} lies outside ${img.w}x${img.h}`);
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) img.data.copy(out, y * width * 4, ((top + y) * img.w + left) * 4, ((top + y) * img.w + left + width) * 4);
  return makeImg(width, height, out);
}
// Copy src into dst at (x, y); pixels replace (no blending), clipped to dst.
export function blit(dst, src, x, y) {
  for (let r = 0; r < src.h; r++) {
    const dy = y + r; if (dy < 0 || dy >= dst.h) continue;
    const sx0 = Math.max(0, -x), sx1 = Math.min(src.w, dst.w - x);
    if (sx1 > sx0) src.data.copy(dst.data, (dy * dst.w + x + sx0) * 4, (r * src.w + sx0) * 4, (r * src.w + sx1) * 4);
  }
}

// Flip or rotate by a multiple of 90 degrees (allowed operations; lossless).
export const TRANSFORMS = ['none', 'flipx', 'flipy', 'rot90', 'rot180', 'rot270'];
export async function transformImg(img, t) {
  if (!t || t === 'none') return img;
  if (!TRANSFORMS.includes(t)) throw new FitError('transform', `unknown transform ${t}`);
  const s = sharpOf(img);
  return fromSharp(t === 'flipx' ? s.flop() : t === 'flipy' ? s.flip() : s.rotate(Number(t.slice(3))));
}

// ---------------------------------------------------------------------------------------------------- fits
// Crop the centre to the target aspect, then resize.
export async function cover(cell, w, h) {
  const ta = w / h, ca = cell.w / cell.h;
  let cw = cell.w, ch = cell.h;
  if (ca > ta) cw = Math.max(1, Math.round(cell.h * ta)); else ch = Math.max(1, Math.round(cell.w / ta));
  const left = Math.floor((cell.w - cw) / 2), top = Math.floor((cell.h - ch) / 2);
  return { img: await resize(crop(cell, left, top, cw, ch), w, h), ops: [`cover crop ${cw}x${ch}`, `lanczos3 ${w}x${h}`] };
}

// Resize to the exact target. When the aspect differs by more than 15% the cell would distort, so the fit falls back to cover.
export async function exact(cell, w, h) {
  const diff = Math.abs((cell.w / cell.h) / (w / h) - 1);
  if (diff > ASPECT_TOLERANCE) { const r = await cover(cell, w, h); return { img: r.img, ops: [`exact aspect off by ${Math.round(diff * 100)}%`, ...r.ops] }; }
  return { img: await resize(cell, w, h), ops: [`lanczos3 ${w}x${h}`] };
}

// Fit inside the target with a transparent margin of `padding` (a fraction of the shorter side).
export async function contain(cell, w, h, padding = 0.04) {
  const pad = Math.round(Math.min(w, h) * padding), iw = Math.max(1, w - 2 * pad), ih = Math.max(1, h - 2 * pad);
  const scale = Math.min(iw / cell.w, ih / cell.h), cw = Math.max(1, Math.round(cell.w * scale)), ch = Math.max(1, Math.round(cell.h * scale));
  const out = makeImg(w, h);
  blit(out, await resize(cell, cw, ch), Math.floor((w - cw) / 2), Math.floor((h - ch) / 2));
  return { img: out, ops: [`contain ${cw}x${ch}`, `pad ${pad}`] };
}

// Resize the seamless cell to the target's short side, repeat along the long side and crop.
export async function repeat(cell, w, h, axis) {
  const out = makeImg(w, h);
  if (axis === 'x') {
    const cw = Math.max(1, Math.round(cell.w * h / cell.h)), tile = await resize(cell, cw, h);
    for (let x = 0; x < w; x += cw) blit(out, tile, x, 0);
    return { img: out, ops: [`repeat_x tile ${cw}x${h}`] };
  }
  const ch = Math.max(1, Math.round(cell.h * w / cell.w)), tile = await resize(cell, w, ch);
  for (let y = 0; y < h; y += ch) blit(out, tile, 0, y);
  return { img: out, ops: [`repeat_y tile ${w}x${ch}`] };
}

// Cut a generated panel at its painted border, resize the corners to the target's borderSize and the edges and the
// centre to fill. `cellBorder` is the painted border in cell pixels (a number, or { x, y }); borderSize is [x, y].
export async function nineSlice(cell, w, h, borderSize, cellBorder) {
  if (!borderSize) throw new FitError('border', 'nine_slice needs the target borderSize from the inventory');
  const sb = typeof cellBorder === 'number' ? { x: cellBorder, y: cellBorder } : cellBorder;
  if (!sb || !(sb.x >= 1) || !(sb.y >= 1)) throw new FitError('border', 'nine_slice needs the painted border of the cell (cellBorder)');
  const sx = Math.round(sb.x), sy = Math.round(sb.y);
  if (sx * 2 >= cell.w || sy * 2 >= cell.h) throw new FitError('border', `painted border ${sx}x${sy} leaves no centre in a ${cell.w}x${cell.h} cell`);
  const bx = Math.min(borderSize[0], Math.floor((w - 1) / 2)), by = Math.min(borderSize[1], Math.floor((h - 1) / 2));
  const out = makeImg(w, h), cx = cell.w - 2 * sx, cy = cell.h - 2 * sy, mw = w - 2 * bx, mh = h - 2 * by;
  const piece = async (sl, st, sw, sh, dw, dh, dx, dy) => { if (dw < 1 || dh < 1 || sw < 1 || sh < 1) return; blit(out, await resize(crop(cell, sl, st, sw, sh), dw, dh), dx, dy); };
  await piece(0, 0, sx, sy, bx, by, 0, 0); await piece(cell.w - sx, 0, sx, sy, bx, by, w - bx, 0);
  await piece(0, cell.h - sy, sx, sy, bx, by, 0, h - by); await piece(cell.w - sx, cell.h - sy, sx, sy, bx, by, w - bx, h - by);
  await piece(sx, 0, cx, sy, mw, by, bx, 0); await piece(sx, cell.h - sy, cx, sy, mw, by, bx, h - by);
  await piece(0, sy, sx, cy, bx, mh, 0, by); await piece(cell.w - sx, sy, sx, cy, bx, mh, w - bx, by);
  await piece(sx, sy, cx, cy, mw, mh, bx, by);
  return { img: out, ops: [`nine_slice cell border ${sx}x${sy} -> ${bx}x${by}`] };
}

// ---------------------------------------------------------------------------------------------------- alpha
// Alpha policies (reskin.json `alpha`): opaque, uniform:<a>, cell (keep the cell's own matte), shape (the vanilla outline).
export function applyAlpha(img, policy, mask) {
  if (policy === 'cell') return { img, ops: [] };
  const data = Buffer.from(img.data), n = img.w * img.h;
  if (policy === 'opaque') { for (let i = 0; i < n; i++) data[i * 4 + 3] = 255; return { img: makeImg(img.w, img.h, data), ops: ['alpha opaque'] }; }
  const m = /^uniform:(\d+)$/.exec(policy);
  if (m) { const a = Number(m[1]); for (let i = 0; i < n; i++) data[i * 4 + 3] = a; return { img: makeImg(img.w, img.h, data), ops: [`constant alpha ${a}`] }; }
  if (policy === 'shape') {
    if (!mask || mask.length !== n) throw new FitError('mask', `the shape mask has ${mask?.length ?? 0} pixels, expected ${n}`);
    for (let i = 0; i < n; i++) data[i * 4 + 3] = mask[i] ? 255 : 0;
    return { img: makeImg(img.w, img.h, data), ops: ['alpha from the vanilla outline (binary)'] };
  }
  throw new FitError('alpha', `unknown alpha policy ${policy}`);
}
// A binary outline (1 where alpha >= 128) of decoded RGBA bytes: all that is kept of a vanilla file for `shape`.
export function outlineOf(rgba, w, h) { const m = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) m[i] = rgba[i * 4 + 3] >= 128 ? 1 : 0; return m; }

// ---------------------------------------------------------------------------------------------------- strip
// Frames placed side by side. This copies generated pixels and paints nothing. (Canvas form: used by modules/ui.mjs.)
export function strip(canvases) { const w = canvases[0].w, h = canvases[0].h, s = new Canvas(w * canvases.length, h); canvases.forEach((cv, i) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const a = (y * w + x) * 4, b = (y * s.w + i * w + x) * 4; for (let k = 0; k < 4; k++) s.px[b + k] = cv.px[a + k]; } }); return s; }

// ---------------------------------------------------------------------------------------------------- dispatcher
async function frameFit(name, cell, w, h, target, opts) {
  switch (name) {
    case 'exact': return exact(cell, w, h);
    case 'cover': return cover(cell, w, h);
    case 'same_shape': return cover(cell, w, h);
    case 'contain': return contain(cell, w, h, opts.padding);
    case 'repeat_x': return repeat(cell, w, h, 'x');
    case 'repeat_y': return repeat(cell, w, h, 'y');
    case 'nine_slice': return nineSlice(cell, w, h, target.borderSize, typeof opts.cellBorder === 'function' ? opts.cellBorder(cell) : opts.cellBorder);
    default: throw new FitError('fit', `unknown fit ${name}`);
  }
}

// cells: one Img per frame for `strip`, otherwise exactly one. opts: { frameFit, padding, cellBorder, alpha, mask, transform }.
export async function runFit(name, cells, target, opts = {}) {
  if (!FITS.includes(name)) throw new FitError('fit', `unknown fit ${name}`);
  const frames = target.frames ?? 1, { width, height } = target;
  if (!Number.isInteger(width / frames)) throw new FitError('frames', `width ${width} is not divisible by ${frames} frames`);
  const fw = width / frames;
  if (opts.transform && opts.transform !== 'none') { cells = await Promise.all(cells.map(cell => transformImg(cell, opts.transform))); }
  const pre = opts.transform && opts.transform !== 'none' ? [`transform ${opts.transform}`] : [];
  let img, ops = [];
  if (name === 'strip') {
    if (cells.length !== frames) throw new FitError('frames', `${cells.length} cells for ${frames} frames`);
    const inner = opts.frameFit ?? 'exact';
    if (!FRAME_FITS.includes(inner)) throw new FitError('fit', `strip frameFit ${inner} is not a frame fit`);
    img = makeImg(width, height);
    const inner0 = [];
    for (let i = 0; i < frames; i++) { const r = await frameFit(inner, cells[i], fw, height, target, opts); blit(img, r.img, i * fw, 0); if (i === 0) inner0.push(...r.ops); }
    ops = [`strip ${frames} frames of ${fw}x${height}`, ...inner0];
  } else {
    if (frames !== 1) throw new FitError('frames', `${name} makes one frame; use strip for ${frames} frames`);
    if (cells.length !== 1) throw new FitError('cells', `${name} takes one cell, got ${cells.length}`);
    const r = await frameFit(name, cells[0], width, height, target, opts);
    img = r.img; ops = r.ops;
  }
  ops = [...pre, ...ops];
  if (img.w !== width || img.h !== height) throw new FitError('size', `fit produced ${img.w}x${img.h}, expected ${width}x${height}`);
  if (opts.alpha) { const a = applyAlpha(img, opts.alpha, opts.mask); img = a.img; ops.push(...a.ops); }
  return { img, ops };
}

// ---------------------------------------------------------------------------------------------------- mattes
// Moved here from modules/presentation.mjs (behaviour unchanged); that module re-exports them.

// Exact integer box downscale (A1 thumbnails): each output pixel is the rounded mean of an f x f block.
export function boxDownscale(buf, w, h, f) {
  const ow = w / f, oh = h / f, out = Buffer.alloc(ow * oh * 4), n = f * f;
  if (!Number.isInteger(ow) || !Number.isInteger(oh)) throw new Error(`box downscale ${w}x${h} by ${f}`);
  for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) for (let c = 0; c < 4; c++) {
    let s = 0; for (let yy = y * f; yy < y * f + f; yy++) for (let xx = x * f; xx < x * f + f; xx++) s += buf[(yy * w + xx) * 4 + c];
    out[(y * ow + x) * 4 + c] = Math.floor((s + n / 2) / n);
  }
  return out;
}

// Colour-key matte (art pipeline §4 step 4): alpha from the distance to the key, transparent below lo and opaque
// above hi, linear between; edge pixels are un-mixed from the key so no magenta spill remains.
export function keyMatte(rgb, w, h, key = [255, 0, 255], lo = 40, hi = 120) {
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const r = rgb[i * 3], g = rgb[i * 3 + 1], b = rgb[i * 3 + 2], d = Math.hypot(r - key[0], g - key[1], b - key[2]);
    const a = d <= lo ? 0 : d >= hi ? 1 : (d - lo) / (hi - lo);
    const o = i * 4;
    if (a > 0) for (const [k, v] of [[0, r], [1, g], [2, b]]) out[o + k] = Math.max(0, Math.min(255, Math.round((v - (1 - a) * key[k]) / a)));
    out[o + 3] = Math.round(a * 255);
  }
  return out;
}

export const alphaBox = (buf, w, h) => { let x0 = w, y0 = h, x1 = -1, y1 = -1; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (buf[(y * w + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }; };

// Interface strips on black (A2): the band's rows and columns are where the mean brightness rises above the black
// ground; alpha follows each column's brightness, so the ends that darken to black fade out as vanilla's do.
export async function stripProfile(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, v = (x, y) => { const i = (y * W + x) * 3; return Math.max(data[i], data[i + 1], data[i + 2]); };
  const xa = Math.floor(W * 0.2), xb = Math.floor(W * 0.8), rows = [];
  for (let y = 0; y < H; y++) { let s = 0; for (let x = xa; x < xb; x++) s += v(x, y); rows.push(s / (xb - xa)); }
  const edge = Math.max(1, Math.floor(H * 0.05)), bg = [...rows.slice(0, edge), ...rows.slice(-edge)].sort((a, b) => a - b)[edge];
  const on = rows.map(m => m > bg + 4), y0 = on.indexOf(true), y1 = on.lastIndexOf(true);
  if (y0 < 0 || y1 - y0 < 8) throw new Error(`${file}: no strip found`);
  return { data, W, H, y0, y1, v };
}
export function stripColumns({ W, v }, y0, y1) {
  const cols = []; for (let x = 0; x < W; x++) { let s = 0; for (let y = y0; y <= y1; y++) s += v(x, y); cols.push(s / (y1 - y0 + 1)); }
  return cols;
}
export async function stripWindow(file) {
  const p = await stripProfile(file), cols = stripColumns(p, p.y0, p.y1);
  const mid = cols.slice(Math.floor(p.W * 0.25), Math.floor(p.W * 0.75)).sort((a, b) => a - b), ref = mid[Math.floor(mid.length / 2)];
  const on = cols.map(m => m > ref * 0.04);
  return { x0: on.indexOf(true), x1: on.lastIndexOf(true), y0: p.y0, y1: p.y1 };
}
// The strip inside `win` with the column-brightness alpha, as an unresized Img.
export async function stripCell(file, win) {
  const p = await stripProfile(file), cols = stripColumns(p, win.y0, win.y1);
  const mid = cols.slice(Math.floor(p.W * 0.25), Math.floor(p.W * 0.75)).sort((a, b) => a - b), ref = mid[Math.floor(mid.length / 2)];
  const cw = win.x1 - win.x0 + 1, ch = win.y1 - win.y0 + 1, buf = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const i = ((win.y0 + y) * p.W + win.x0 + x) * 3, o = (y * cw + x) * 4;
    buf[o] = p.data[i]; buf[o + 1] = p.data[i + 1]; buf[o + 2] = p.data[i + 2];
    buf[o + 3] = Math.round(255 * Math.max(0, Math.min(1, cols[win.x0 + x] / (0.5 * ref))));
  }
  return makeImg(cw, ch, buf);
}
// The presentation module's form: the strip resized to w x h, returned as raw RGBA.
export async function stripRgba(file, win, w, h) {
  const cell = await stripCell(file, win), out = await resize(cell, w, h);
  return out.data;
}

// Focus icons (A3): the medallion's outline is the alpha. Inside the found region, every row and every column is
// filled between its first and last pixel brighter than the black ground, so the dark enamel field stays opaque.
export function medallionMask(rgb, W, r, threshold = 12) {
  const pad = 6, x0 = Math.max(0, r.x0 - pad), y0 = Math.max(0, r.y0 - pad), x1 = Math.min(W, r.x1 + pad), w = x1 - x0, h = r.y1 + pad - y0;
  const fg = (x, y) => { const i = ((y0 + y) * W + x0 + x) * 3; return Math.max(rgb[i], rgb[i + 1], rgb[i + 2]) > threshold; };
  const rowSpan = [], colSpan = [];
  for (let y = 0; y < h; y++) { let a = -1, b = -2; for (let x = 0; x < w; x++) if (fg(x, y)) { if (a < 0) a = x; b = x; } rowSpan.push([a, b]); }
  for (let x = 0; x < w; x++) { let a = -1, b = -2; for (let y = 0; y < h; y++) if (fg(x, y)) { if (a < 0) a = y; b = y; } colSpan.push([a, b]); }
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = ((y0 + y) * W + x0 + x) * 3, o = (y * w + x) * 4, inside = x >= rowSpan[y][0] && x <= rowSpan[y][1] && y >= colSpan[x][0] && y <= colSpan[x][1];
    buf[o] = rgb[i]; buf[o + 1] = rgb[i + 1]; buf[o + 2] = rgb[i + 2]; buf[o + 3] = inside ? 255 : 0;
  }
  return { buf, w, h, x0, y0 };
}
