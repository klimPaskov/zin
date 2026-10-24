// Measures of the owner's full drawing as the drawn-map import will read it (ADR 0067), for the import's palette and
// for the agreement, registration and edge-band figures of the handoff.
//
// The private drawing (docs/reference/originals/Erdae.png, 17,520 x 12,720, git-ignored) is read into memory only and
// nothing derived from its pixels is written except numbers: colours, pixel counts and intersection-over-union scores.
// Steps, all deterministic:
//   1 working copy  the drawing reduced (linear) to the working size the sheets need, as the import does: per sheet the
//                   world distance one picture unit spans along each axis (reference-sheets.ts sheetWorkingSize);
//   2 warp          every world pixel of the 5,120 x 2,560 frame is read from the highest-order sheet whose box and clip
//                   hold it (the clip ring of aoaz.sheets.json mapped into the world and filled even-odd, which is the
//                   import's own test under an affine map), sampled bilinearly; pixels outside every sheet are open sea;
//   3 classes       three readings of the warped picture: the project's pencil classifier (drawing_mask.mjs
//                   isWaterColour), the import's built-in illustrated heuristic (mirrored from the tool's
//                   reference-world.ts classify, for measurement only) and nearest-colour matching against the palette
//                   of step 4;
//   4 palette       per sheet, the median colour of the drawn water (the pencil classifier's sea) and, per terrain class,
//                   the median colour of the drawn land inside the model's terrain areas of that class (forests, deserts,
//                   marshes, snowfields, plains, hills, the crests of the ranges and the volcanoes) and of the remaining
//                   land; colours of one class closer than PALETTE.mergeDistance merge; at most 64 entries;
//   5 agreement     land intersection over union of the model's land (lands less lakes) and each reading, for the whole
//                   frame and per region zone, without and with the surface-override annotations (aoaz.annotations.json);
//                   the same for the hand-fitted sheet transforms of registration.before (no clips), the "before" of the
//                   registration;
//   6 edge bands    drawn land inside the import's open-sea bands (205 px east and west, 64 px north and south, and the
//                   ragged clearing up to 1.5 times as deep), per sheet: land the sea-band edge clears.
//
//   node tools/content/geography/import_measures.mjs [--drawing <png>] [--out <dir>]
// Writes import/aoaz.palette.json and import/drawing_measures.json; run convert_for_import.mjs afterwards so the preview
// call carries the palette.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as G from './geo_core.mjs';
import { isWaterColour } from './drawing_mask.mjs';
import { regionZones } from './repair_model.mjs';
import { ringsOf } from './check_model.mjs';
import { IMPORT } from './convert_for_import.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, '../data/geography');
export const DEFAULT_DRAWING = path.join(here, '../../../docs/reference/originals/Erdae.png');
export const DEFAULT_OUT = path.join(DATA, 'import');
export const PALETTE = Object.freeze({ mergeDistance: 18, maxEntries: 64, minSamples: 400, volcanoRadiusPx: 6, crestShare: 0.5 });
const W = IMPORT.frame.width, H = IMPORT.frame.height;

// ---------------------------------------------------------------------------------------------------- warp
const affineOf = s => (s.affine ? s.affine : [s.scale[0], 0, s.target[0] - s.scale[0] * s.anchor[0], 0, s.scale[1], s.target[1] - s.scale[1] * s.anchor[1]]);
const apply = (a, p) => [a[0] * p[0] + a[1] * p[1] + a[2], a[3] * p[0] + a[4] * p[1] + a[5]];
function invert(a) { const det = a[0] * a[4] - a[1] * a[3]; const ia = a[4] / det, ib = -a[1] / det, id = -a[3] / det, ie = a[0] / det; return [ia, ib, -(ia * a[2] + ib * a[5]), id, ie, -(id * a[2] + ie * a[5])]; }
/** Even-odd scanline fill of rings (world normalised) into a frame-sized mask, pixel centres. */
export function fillRings(rings, mask, value = 1, w = W, h = H) {
  const ys = rings.flat().map(p => p[1] * h);
  const y0 = Math.max(0, Math.floor(Math.min(...ys))), y1 = Math.min(h - 1, Math.ceil(Math.max(...ys)));
  for (let y = y0; y <= y1; y++) {
    const yy = y + 0.5, xs = [];
    for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const ay = r[i][1] * h, by = r[j][1] * h;
      if ((ay > yy) !== (by > yy)) xs.push(r[i][0] * w + ((yy - ay) * (r[j][0] - r[i][0]) * w) / (by - ay));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.max(0, Math.ceil(xs[k] - 0.5)), b = Math.min(w - 1, Math.ceil(xs[k + 1] - 0.5) - 1);
      if (a <= b) mask.fill(value, y * w + a, y * w + b + 1);
    }
  }
  return mask;
}
/** The import's working size for a sheets document. */
export function workingSize(doc) {
  let w = 1, h = 1;
  for (const s of doc.sheets) { const [a, b, , d, e] = affineOf(s); w = Math.max(w, Math.hypot(a * W, d * H)); h = Math.max(h, Math.hypot(b * W, e * H)); }
  return { width: Math.ceil(w), height: Math.ceil(h) };
}
/** World picture (RGB) and owner sheet index per pixel (255 none) of a sheets document over a working picture. */
export function warp(doc, picture) {
  const owner = new Uint8Array(W * H).fill(255);
  const order = doc.sheets.map((s, k) => ({ s, k })).sort((p, q) => q.s.order - p.s.order || p.k - q.k);
  for (const { s, k } of order) {
    const f = affineOf(s);
    const box = [[s.box[0], s.box[1]], [s.box[2], s.box[1]], [s.box[2], s.box[3]], [s.box[0], s.box[3]]].map(p => apply(f, p));
    const m = fillRings([box], new Uint8Array(W * H));
    if (s.clip) { const c = fillRings([s.clip.map(p => apply(f, p))], new Uint8Array(W * H)); for (let i = 0; i < m.length; i++) m[i] &= c[i]; }
    for (let i = 0; i < m.length; i++) if (m[i] && owner[i] === 255) owner[i] = k;
  }
  const rgb = Buffer.alloc(W * H * 3);
  const inv = doc.sheets.map(s => invert(affineOf(s)));
  const { data, width: pw, height: ph } = picture;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, k = owner[i];
    if (k === 255) { rgb[i * 3] = 0x24; rgb[i * 3 + 1] = 0x5b; rgb[i * 3 + 2] = 0x82; continue; }
    const [px, py] = apply(inv[k], [(x + 0.5) / W, (y + 0.5) / H]);
    const sx = px * pw - 0.5, sy = py * ph - 0.5;
    const l = Math.min(pw - 1, Math.max(0, Math.floor(sx))), t = Math.min(ph - 1, Math.max(0, Math.floor(sy)));
    const r = Math.min(pw - 1, l + 1), b = Math.min(ph - 1, t + 1);
    const fx = Math.min(1, Math.max(0, sx - l)), fy = Math.min(1, Math.max(0, sy - t));
    for (let ch = 0; ch < 3; ch++) {
      const p00 = data[(t * pw + l) * 3 + ch], p10 = data[(t * pw + r) * 3 + ch], p01 = data[(b * pw + l) * 3 + ch], p11 = data[(b * pw + r) * 3 + ch];
      const up = p00 + (p10 - p00) * fx, lo = p01 + (p11 - p01) * fx;
      rgb[i * 3 + ch] = Math.round(up + (lo - up) * fy);
    }
  }
  return { rgb, owner };
}

// ---------------------------------------------------------------------------------------------------- classes
/** The import's built-in classifier for an illustrated picture without a palette: 0 sea, 1 land (measurement only). */
export function toolHeuristicLand(r, g, b) {
  if (r > g + 25 && b > g + 25 && r - g > (b - g) * 0.42) return 1;
  if (b > r + 12 && b > g - 28 && b > 70) return 0;
  return 1;
}
export const pencilLand = (r, g, b) => (isWaterColour(r, g, b) ? 0 : 1);
export function paletteLand(palette) {
  const cols = palette.map(e => [e.color.r, e.color.g, e.color.b, e.kind === 'sea' || e.kind === 'lake' ? 0 : 1]);
  return (r, g, b) => { let best = 0, bd = Infinity; for (let k = 0; k < cols.length; k++) { const c = cols[k], d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2; if (d < bd) { bd = d; best = k; } } return cols[best][3]; };
}
export function classifyLand(rgb, owner, fn) {
  const out = new Uint8Array(W * H);
  for (let i = 0; i < out.length; i++) out[i] = owner[i] === 255 ? 0 : fn(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]);
  return out;
}

// ---------------------------------------------------------------------------------------------------- the model
const frameGrid = { ox: 0, oy: 0, cell: 1, w: W, h: H };
export function modelLand(model) {
  const land = new Uint8Array(W * H);
  for (const l of model.lands) G.rasterizeInto(l.geometry, frameGrid, land, 1);
  for (const l of model.lakes) G.rasterizeInto(l.geometry, frameGrid, land, 0);
  return land;
}
export function annotate(land, annotations) {
  const out = land.slice();
  for (const a of annotations) fillRings([a.polygon.map(p => [p.x, p.y])], out, a.kind === 'land' ? 1 : 0);
  return out;
}
const CG = { ox: 0, oy: 0, cell: 4, w: 1280, h: 640 };
/** Land IoU, total and per region zone. */
export function agreement(model, modelMask, drawn, zones) {
  const acc = new Map(), all = [0, 0];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, A = modelMask[i] === 1, D = drawn[i] === 1;
    if (!A && !D) continue;
    const z = zones[Math.min(CG.h - 1, y >> 2) * CG.w + Math.min(CG.w - 1, x >> 2)] ?? 'none';
    if (!acc.has(z)) acc.set(z, [0, 0]);
    const v = acc.get(z);
    if (A && D) { v[0]++; all[0]++; }
    v[1]++; all[1]++;
  }
  const r4 = v => Math.round(v * 10000) / 10000;
  return { total: r4(all[0] / all[1]), regions: Object.fromEntries([...acc].sort((p, q) => String(p[0]).localeCompare(String(q[0]))).map(([z, v]) => [z, r4(v[0] / v[1])])) };
}

// ---------------------------------------------------------------------------------------------------- palette
const median = list => { const s = list.slice().sort((p, q) => p - q); return s[s.length >> 1]; };
const medianColour = px => ({ r: median(px.map(p => p[0])), g: median(px.map(p => p[1])), b: median(px.map(p => p[2])) });
const dist = (a, b) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
/** The palette (see the header) and its provenance per sheet. */
export function buildPalette(model, doc, rgb, owner, pencil) {
  const cls = new Uint8Array(W * H).fill(255); // terrain class index per pixel from the model's areas
  const CLASSES = ['plains', 'forest', 'desert', 'marsh', 'snow', 'hills', 'mountain', 'volcano'];
  const paint = (arr, k) => { for (const f of model[arr] ?? []) G.rasterizeInto(f.geometry, frameGrid, cls, k); };
  paint('plains', 0); paint('forests', 1); paint('deserts', 2); paint('marshes', 3); paint('ice', 4); paint('hills', 5);
  for (const r of model.ranges) for (const e of G.densifyLine(r.geometry.coordinates, 2)) {
    const [cx, cy] = [e.p[0] * W, e.p[1] * H], rad = Math.max(2, (r.halfWidth ?? 0.005) * W * PALETTE.crestShare);
    for (let y = Math.max(0, Math.floor(cy - rad)); y <= Math.min(H - 1, Math.ceil(cy + rad)); y++) for (let x = Math.max(0, Math.floor(cx - rad)); x <= Math.min(W - 1, Math.ceil(cx + rad)); x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= rad * rad) cls[y * W + x] = 6;
  }
  for (const v of model.volcanoes) { const [cx, cy] = [v.geometry.coordinates[0] * W, v.geometry.coordinates[1] * H], rad = PALETTE.volcanoRadiusPx; for (let y = Math.floor(cy - rad); y <= cy + rad; y++) for (let x = Math.floor(cx - rad); x <= cx + rad; x++) if (x >= 0 && y >= 0 && x < W && y < H && (x - cx) ** 2 + (y - cy) ** 2 <= rad * rad) cls[y * W + x] = 7; }
  const samples = doc.sheets.map(() => ({ sea: [], land: [], byClass: CLASSES.map(() => []) }));
  // a deterministic sample: every 7th pixel
  for (let i = 0; i < owner.length; i += 7) {
    const k = owner[i];
    if (k === 255) continue;
    const c = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]];
    if (!pencil[i]) samples[k].sea.push(c);
    else if (cls[i] !== 255) samples[k].byClass[cls[i]].push(c);
    else samples[k].land.push(c);
  }
  const raw = [];
  doc.sheets.forEach((s, k) => {
    const S = samples[k];
    if (S.sea.length >= PALETTE.minSamples) raw.push({ kind: 'sea', sheet: s.id, n: S.sea.length, color: medianColour(S.sea) });
    if (S.land.length >= PALETTE.minSamples) raw.push({ kind: 'land', sheet: s.id, n: S.land.length, color: medianColour(S.land) });
    CLASSES.forEach((name, j) => { if (S.byClass[j].length >= PALETTE.minSamples) raw.push({ kind: name, sheet: s.id, n: S.byClass[j].length, color: medianColour(S.byClass[j]) }); });
  });
  // merge close colours of one class, then within budget; never two classes on one colour
  let merge = PALETTE.mergeDistance, entries;
  for (;;) {
    entries = [];
    for (const e of raw) {
      const same = entries.find(x => x.kind === e.kind && dist(x.color, e.color) < merge);
      if (same) { same.sheets.push(e.sheet); same.n += e.n; continue; }
      entries.push({ kind: e.kind, color: { ...e.color }, sheets: [e.sheet], n: e.n });
    }
    if (entries.length <= PALETTE.maxEntries) break;
    merge += 4;
  }
  const seen = new Set();
  entries = entries.filter(e => { const key = `${e.color.r},${e.color.g},${e.color.b}`; if (seen.has(key)) return false; seen.add(key); return true; });
  return { palette: entries.map(e => ({ kind: e.kind, color: e.color })), provenance: entries.map(e => ({ kind: e.kind, color: e.color, sheets: e.sheets, samples: e.n })), mergeDistance: merge };
}

// ---------------------------------------------------------------------------------------------------- edge bands
export function edgeBandLand(drawn, owner, doc, edge = IMPORT.edge) {
  const strict = { total: 0, bySheet: {} }, ragged = { total: 0, bySheet: {} };
  const bx = edge.bandPx, by = edge.polarPx, rx = Math.round(bx * 1.5), ry = Math.round(by * 1.5);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    if (!drawn[i]) continue;
    const id = doc.sheets[owner[i]]?.id ?? 'none';
    if (x < bx || x >= W - bx || y < by || y >= H - by) { strict.total++; strict.bySheet[id] = (strict.bySheet[id] ?? 0) + 1; }
    if (x < rx || x >= W - rx || y < ry || y >= H - ry) { ragged.total++; ragged.bySheet[id] = (ragged.bySheet[id] ?? 0) + 1; }
  }
  return { strictBandPx: { ...edge, ...strict }, raggedUpTo: { bandPx: rx, polarPx: ry, ...ragged } };
}

// ---------------------------------------------------------------------------------------------------- command line
/** The sheets document of the hand-fitted transforms (registration.before), without clips: the registration's "before". */
export function beforeDocument(model, doc) {
  const before = model.registration?.before ?? {};
  return { ...doc, sheets: doc.sheets.map(s => { const b = before[s.id]; const m = model.sheets[s.id]; if (!b) return s; const t = { ...m, ...b }; return { id: s.id, box: m.drawingBox, anchor: t.drawingAnchor, target: t.worldAnchor, scale: t.scaleWorldPerDrawing, order: s.order }; }) };
}
async function main(argv) {
  const args = argv.slice(2);
  const opt = (name, d) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : d; };
  const drawingPath = opt('--drawing', DEFAULT_DRAWING), out = opt('--out', DEFAULT_OUT);
  if (!existsSync(drawingPath)) throw new Error(`the private drawing is not at ${drawingPath}`);
  const model = JSON.parse(readFileSync(path.join(DATA, 'aoaz.repaired.json'), 'utf8'));
  const doc = JSON.parse(readFileSync(path.join(out, 'aoaz.sheets.json'), 'utf8'));
  const annotations = JSON.parse(readFileSync(path.join(out, 'aoaz.annotations.json'), 'utf8')).annotations;
  const bytes = readFileSync(drawingPath);
  const sha = createHash('sha256').update(bytes).digest('hex');
  const { default: sharp } = await import('sharp');
  const meta = await sharp(bytes, { limitInputPixels: false }).metadata();
  if (meta.width !== doc.source.width || meta.height !== doc.source.height || sha !== doc.source.sha256) throw new Error(`the drawing (${meta.width} x ${meta.height}, ${sha}) is not the one the sheets were registered for`);
  const size = workingSize(doc);
  const { data, info } = await sharp(bytes, { limitInputPixels: false, sequentialRead: true }).resize(size.width, size.height, { fit: 'fill', kernel: 'linear' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const picture = { data, width: info.width, height: info.height };
  const zones = regionZones(model);
  const mLand = modelLand(model);
  const result = { drawing: { file: 'docs/reference/originals/Erdae.png (private, git-ignored; read into memory only)', width: meta.width, height: meta.height, sha256: sha, workingSize: size }, readings: {} };
  const runs = [['after', doc], ['before', beforeDocument(model, doc)]];
  let paletteResult = null;
  for (const [label, d] of runs) {
    const { rgb, owner } = warp(d, picture);
    const pencil = classifyLand(rgb, owner, pencilLand);
    if (label === 'after') paletteResult = buildPalette(model, d, rgb, owner, pencil);
    const readings = { pencil, heuristic: classifyLand(rgb, owner, toolHeuristicLand), ...(paletteResult ? { palette: classifyLand(rgb, owner, paletteLand(paletteResult.palette)) } : {}) };
    result.readings[label] = {};
    for (const [name, drawn] of Object.entries(readings)) {
      result.readings[label][name] = { raw: agreement(model, mLand, drawn, zones), ...(label === 'after' ? { withAnnotations: agreement(model, mLand, annotate(drawn, annotations), zones) } : {}) };
    }
    if (label === 'after') {
      result.edgeBands = Object.fromEntries(Object.entries(readings).map(([name, drawn]) => [name, edgeBandLand(drawn, owner, d)]));
      result.edgeBands.model = edgeBandLand(mLand, owner, d);
      result.edgeBands.withAnnotations = edgeBandLand(annotate(readings.heuristic, annotations), owner, d);
      const cover = {};
      for (let i = 0; i < owner.length; i++) { const id = d.sheets[owner[i]]?.id ?? 'none'; cover[id] = (cover[id] ?? 0) + 1; }
      result.coveragePx = cover;
    }
  }
  const write = (file, v) => writeFileSync(path.join(out, file), `${JSON.stringify(v, null, 1)}\n`);
  write('aoaz.palette.json', { note: 'The reference palette of the import (one list for every sheet, ADR 0067 section 9): per sheet the median colour of its drawn water and of its drawn land per terrain class, measured by tools/content/geography/import_measures.mjs; numbers only.', mergeDistance: paletteResult.mergeDistance, palette: paletteResult.palette, provenance: paletteResult.provenance });
  write('drawing_measures.json', { note: 'Numbers measured on the private drawing by tools/content/geography/import_measures.mjs: land IoU of the model and the drawing as the import reads it (three classifiers; raw and with the surface-override annotations; after = the registered sheets with clips, before = the hand-fitted transforms of registration.before without clips), and the drawn land the open-sea edge bands clear.', ...result });
  const show = (label, name) => { const r = result.readings[label][name]; return `${r.raw.total}${r.withAnnotations ? ` (with annotations ${r.withAnnotations.total})` : ''}`; };
  for (const label of ['before', 'after']) for (const name of Object.keys(result.readings[label])) console.log(`${label.padEnd(6)} ${name.padEnd(9)} land IoU ${show(label, name)}`);
  for (const [name, e] of Object.entries(result.edgeBands)) console.log(`edge bands (${name}): ${e.strictBandPx.total} px of drawn land in the strict band, ${e.raggedUpTo.total} px up to the ragged clearing; ${JSON.stringify(e.strictBandPx.bySheet)}`);
  console.log(`palette: ${paletteResult.palette.length} entries (merge distance ${paletteResult.mergeDistance})`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv).catch(e => { console.error(e); process.exitCode = 1; });
