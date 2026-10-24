// Registration of the owner's drawn sheets onto the geography model of Aoaz.
//
// Each sheet of the working mosaic (docs/reference/originals/Erdae-working.jpg, private and git-ignored) is placed in
// the game frame by a transform recorded in the model's `sheets`: world = worldAnchor + scale * (drawing - anchor) per
// axis (a negative x scale mirrors). The hand-fitted transforms are good to about 80 pixels; the drawn-map import takes
// the coast from the warped drawing and blocks when model and drawing disagree, so this step refines every sheet whose
// land agrees with the model below REGISTRATION.targetIoU.
//
// Steps, per sheet (all deterministic; the private drawing is read into memory only):
//   1 frame   the pencil frame of each sheet lies along its drawing box and reads as land; each edge of the box is moved
//             inward past a frame line when one is found (a run of mostly-land rows or columns starting at the edge and
//             followed by a drop), giving `clipBox`, the part of the paper the import reads;
//   2 zone    the sheet's zone: the cells of the regions drawn on the sheet (region zones are the nearest-region partition
//             of the frame, as in the agreement measure of repair_model.mjs) where no smaller sheet of those regions
//             covers the cell, less the land and sea the layout generated (repair_model.mjs generatedMask: the top and
//             bottom 128 rows and the Northern Wastes), which no sheet draws;
//   3 search  the transform that maximises land IoU of the model and the warped drawing over the zone: an exhaustive
//             grid of translations and per-axis scales (about the centre of the drawing box) on 16-pixel cells, then a
//             pattern search with halving steps on 4-pixel cells from the best distinct coarse optima; a cell that the
//             candidate no longer covers but the recorded transform did counts as drawn sea, so a fit cannot win by
//             sliding off the land it should draw. A rotation is kept only when it gains REGISTRATION.rotationGain; it is
//             then written in the `affine` form [a, b, c, d, e, f] (world x = a dx + b dy + c, world y = d dx + e dy + f)
//             that the drawn-map import (ADR 0067) accepts in place of anchor, target and scale;
//   4 check   landmarks independent of the fit: the owner's drawn label anchors (docs/name_table.md: full-mosaic
//             coordinates of 711 labels, each with its scan and kind) must fall on the model's land (land labels) or
//             water (sea labels) through the sheet, within the label tolerance; model river mouths and coast points must
//             lie near the drawn coast. A refined transform is accepted only when it gains REGISTRATION.minGain of IoU and
//             loses no more than REGISTRATION.maxLabelLoss of its label agreement, so a fit that wins IoU by sliding onto
//             the wrong coast is refused.
//
// Nothing derived from the drawing's pixels is written except transforms, frame insets and scores. The output,
// tools/content/data/geography/sheet_registration.json, is applied by repair_model.mjs (applyRegistration), which needs
// no drawing, so the repair stays deterministic without the private file.
//
//   node tools/content/geography/sheet_registration.mjs [--model <repaired.json>] [--drawing <jpg>] [--out <json>]
//        [--sheets a,b] [--report]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as G from './geo_core.mjs';
import { isWaterColour } from './drawing_mask.mjs';
import { generatedMask } from './repair_model.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_REGISTRATION_PATH = path.join(here, '../data/geography/sheet_registration.json');
export const DEFAULT_LABELS_PATH = path.join(here, '../../../docs/name_table.md');
export const DEFAULT_DRAWING_PATH = path.join(here, '../../../docs/reference/originals/Erdae-working.jpg');

export const REGISTRATION = Object.freeze({
  targetIoU: 0.85,          // sheets whose zone agrees below this are refined
  translateRange: 0.04,     // coarse search: translation either way (world units; 2.5 times the stated 80-pixel accuracy) ...
  translateStep: 0.004,     // ... and step
  scaleRange: 0.12,         // coarse search: log scale either way ...
  scaleStep: 0.04,          // ... and step
  fineSteps: [0.002, 0.001, 0.0005, 0.00025], // pattern search translation steps (log-scale steps twice these)
  rotationRange: 0.04,      // radians either way
  rotationStep: 0.01,
  rotationGain: 0.02,       // a rotation must raise IoU by this much to be kept
  isotropyTol: 0.03,        // a sheet whose two pixel scales differ by less than this (log) was placed undistorted: its
                            // refinement scales both axes alike (docs/generation/assumptions.md: no rotation or distortion)
  distortionGain: 0.05,     // a distorted sheet keeps a distorted fit only when it beats the undistorted one by this much
  minGain: 0.005,           // a refined transform replaces the recorded one only when it gains this much IoU ...
  maxLabelLoss: 0.02,       // ... and loses no more than this share of its label agreement ...
  maxCoastLoss: 0.2,        // ... and, unless its labels improve by labelOverride, no more than this share of its coast landmarks
  labelOverride: 0.05,
  coastTolPx: 40,           // a river mouth or coast point agrees when it lies this close to the drawn coast
  labelTolPx: 24,           // a land or sea label agrees within this distance of model land or water ...
  islandLabelTolPx: 48,     // ... an island label within this (island names are written beside small islands)
  majority: 2,              // half-width (drawing pixels) of the majority filter that removes lettering
  frameSearchPx: 24,        // the frame line is looked for this far inward from each box edge (drawing pixels) ...
  frameLineShare: 0.6,      // ... as rows or columns at least this share land ...
  frameMarginPx: 3,         // ... and the clip edge is put this far past it
});
/**
 * The scans of docs/name_table.md and the sheets of the model that show them. The table keeps the owner's own scan
 * titles ("Dead Lands", "Ocean of Edvoid"), so those titles map to their sheets beside the current region names.
 */
export const SCAN_SHEETS = Object.freeze({
  'Cold Lands': 'cold', 'West-Earth': 'west', 'Tritons Islands': 'tritons', 'East-Earth': 'north', 'Dark Lands': 'dark',
  'Rush Land': 'rush', 'Rush Islands': 'risle', 'Magical Lands': 'mag', 'Kusmeel': 'edv', 'Ocean of Edvoid': 'edv',
  'South-Earth': 'east', 'Ember Lands': 'dead', 'Dead Lands': 'dead', 'Sunhot': 'sun',
});

// ---------------------------------------------------------------------------------------------------- transforms
/** Drawing pixels of the working mosaic (the drawing frame is normalised to it). */
export const DRAWING_PX = Object.freeze([3200, 2323]);
/** World point of a drawing point through a sheet (anchor form or affine form). */
export function sheetToWorld(s, d) {
  if (s.affine) { const [a, b, c, e, f, g] = s.affine; return [a * d[0] + b * d[1] + c, e * d[0] + f * d[1] + g]; }
  return [s.worldAnchor[0] + (d[0] - s.drawingAnchor[0]) * s.scaleWorldPerDrawing[0], s.worldAnchor[1] + (d[1] - s.drawingAnchor[1]) * s.scaleWorldPerDrawing[1]];
}
/** Drawing point of a world point through a sheet. */
export function sheetToDrawing(s, p) {
  if (s.affine) {
    const [a, b, c, e, f, g] = s.affine, det = a * f - b * e;
    const x = p[0] - c, y = p[1] - g;
    return [(f * x - b * y) / det, (-e * x + a * y) / det];
  }
  return [s.drawingAnchor[0] + (p[0] - s.worldAnchor[0]) / s.scaleWorldPerDrawing[0], s.drawingAnchor[1] + (p[1] - s.worldAnchor[1]) / s.scaleWorldPerDrawing[1]];
}
/** The part of the paper a sheet contributes: its clip box when it has one, else its drawing box. */
export const paperBox = s => s.clipBox ?? s.drawingBox;
/** World pixels per drawing pixel along each axis (equal for an undistorted sheet). */
export const pxScale = s => [Math.abs(s.scaleWorldPerDrawing[0]) * G.W / DRAWING_PX[0], Math.abs(s.scaleWorldPerDrawing[1]) * G.H / DRAWING_PX[1]];
const boxCentre = s => [(s.drawingBox[0] + s.drawingBox[2]) / 2, (s.drawingBox[1] + s.drawingBox[3]) / 2];
/**
 * A candidate transform from parameters relative to a base sheet: translation (tx, ty) in world units, log scales
 * (lx, ly) and rotation r (radians), all about the centre of the drawing box. Without rotation the result keeps the
 * base's anchor form (same drawingAnchor); with rotation it is an affine transform.
 */
export function candidate(base, [tx, ty, lx, ly, r = 0]) {
  const cd = boxCentre(base), cw = sheetToWorld(base, cd);
  const sx = base.scaleWorldPerDrawing[0] * Math.exp(lx), sy = base.scaleWorldPerDrawing[1] * Math.exp(ly);
  const out = { ...base };
  delete out.affine;
  if (!r) {
    out.worldAnchor = [cw[0] + tx + sx * (base.drawingAnchor[0] - cd[0]), cw[1] + ty + sy * (base.drawingAnchor[1] - cd[1])];
    out.scaleWorldPerDrawing = [sx, sy];
    return out;
  }
  // world = cw + t + R (S (d - cd)), the rotation acting on pixel axes (the frame is 2:1)
  const cos = Math.cos(r), sin = Math.sin(r), k = G.W / G.H;
  const a = cos * sx, b = (-sin * sy) / k, e = sin * sx * k, f = cos * sy;
  out.affine = [a, b, cw[0] + tx - a * cd[0] - b * cd[1], e, f, cw[1] + ty - e * cd[0] - f * cd[1]];
  out.worldAnchor = [cw[0] + tx + sx * (base.drawingAnchor[0] - cd[0]), cw[1] + ty + sy * (base.drawingAnchor[1] - cd[1])];
  out.scaleWorldPerDrawing = [sx, sy];
  return out;
}
const round = (v, d = 6) => Math.round(v * 10 ** d) / 10 ** d;
/** The recorded fields of a transform, rounded. */
export function transformRecord(s) {
  const t = { drawingBox: s.drawingBox.slice(), drawingAnchor: s.drawingAnchor.map(v => round(v)), worldAnchor: s.worldAnchor.map(v => round(v)), scaleWorldPerDrawing: s.scaleWorldPerDrawing.map(v => round(v)), mirrorX: s.mirrorX };
  if (s.affine) t.affine = s.affine.map(v => round(v, 7));
  if (s.clipBox) t.clipBox = s.clipBox.map(v => round(v));
  return t;
}

// ---------------------------------------------------------------------------------------------------- the drawing
/** The drawing's land in its own frame (1 land, 0 water), majority-filtered, and the SHA-256 of the file. */
export async function loadDrawingRaster(jpgPath, majority = REGISTRATION.majority) {
  const { default: sharp } = await import('sharp');
  const bytes = readFileSync(jpgPath);
  const { data, info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, n = w * h;
  const water = new Uint8Array(n);
  for (let i = 0; i < n; i++) { const o = i * info.channels; water[i] = isWaterColour(data[o], data[o + 1], data[o + 2]) ? 1 : 0; }
  return { w, h, land: majorityFilter(water, w, h, majority, true), sha256: createHash('sha256').update(bytes).digest('hex') };
}
/** Majority filter through an integral image; `invert` turns a water raster into a land raster. */
export function majorityFilter(src, w, h, r, invert = false) {
  const I = new Int32Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) { let row = 0; for (let x = 0; x < w; x++) { row += src[y * w + x]; I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + row; } }
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const x0 = Math.max(0, x - r), y0 = Math.max(0, y - r), x1 = Math.min(w, x + r + 1), y1 = Math.min(h, y + r + 1);
    const s = I[y1 * (w + 1) + x1] - I[y0 * (w + 1) + x1] - I[y1 * (w + 1) + x0] + I[y0 * (w + 1) + x0];
    const v = s * 2 > (x1 - x0) * (y1 - y0) ? 1 : 0;
    out[y * w + x] = invert ? 1 - v : v;
  }
  return out;
}
/** Drawn land at a drawing point (1 land, 0 water), 255 outside the sheet's paper. */
export function drawnAt(raster, s, d) {
  const b = paperBox(s);
  if (d[0] < b[0] || d[0] > b[2] || d[1] < b[1] || d[1] > b[3]) return 255;
  const x = Math.min(raster.w - 1, Math.max(0, Math.floor(d[0] * raster.w))), y = Math.min(raster.h - 1, Math.max(0, Math.floor(d[1] * raster.h)));
  return raster.land[y * raster.w + x];
}
/**
 * The frame inset of a box: for each edge, the land share of the rows or columns running inward; a frame line is a run
 * of lines of at least `frameLineShare` land that starts within three pixels of the edge and is followed by a drop to
 * under half of its share. Returns [left, top, right, bottom] in drawing pixels.
 */
export function frameInset(raster, box, opts = REGISTRATION) {
  const W = raster.w, H = raster.h;
  const x0 = Math.round(box[0] * W), x1 = Math.round(box[2] * W) - 1, y0 = Math.round(box[1] * H), y1 = Math.round(box[3] * H) - 1;
  const col = x => { let l = 0; for (let y = y0; y <= y1; y++) l += raster.land[y * W + x]; return l / (y1 - y0 + 1); };
  const row = y => { let l = 0; for (let x = x0; x <= x1; x++) l += raster.land[y * W + x]; return l / (x1 - x0 + 1); };
  const edge = (f, start, dir) => {
    const prof = [];
    for (let k = 0; k < opts.frameSearchPx + 6; k++) prof.push(f(start + dir * k));
    let first = -1;
    for (let k = 0; k <= 3; k++) if (prof[k] >= opts.frameLineShare) { first = k; break; }
    if (first < 0) return 0;
    let last = first;
    while (last + 1 < opts.frameSearchPx && prof[last + 1] >= opts.frameLineShare) last++;
    if (last + 1 >= opts.frameSearchPx) return 0; // land runs on: content to the paper edge, not a frame line
    const peak = Math.max(...prof.slice(first, last + 1));
    const after = Math.min(...prof.slice(last + 1, last + 5));
    return after < peak / 2 ? last + 1 + opts.frameMarginPx : 0;
  };
  return [edge(col, x0, 1), edge(row, y0, 1), edge(col, x1, -1), edge(row, y1, -1)];
}
export const insetBox = (box, inset) => [round(box[0] + inset[0] / DRAWING_PX[0]), round(box[1] + inset[1] / DRAWING_PX[1]), round(box[2] - inset[2] / DRAWING_PX[0]), round(box[3] - inset[3] / DRAWING_PX[1])];

// ---------------------------------------------------------------------------------------------------- zones and score
/** Region zones (nearest region for every cell), the model's land and the sheets drawn for each region. */
export function buildContext(model, raster, grid) {
  const land = new Uint8Array(grid.w * grid.h), lake = new Uint8Array(grid.w * grid.h);
  for (const l of model.lands ?? []) G.rasterizeInto(l.geometry, grid, land, 1);
  for (const l of model.lakes ?? []) G.rasterizeInto(l.geometry, grid, lake, 1);
  const regions = model.regions.filter(r => r.kind === 'region');
  const zoneIdx = new Int16Array(grid.w * grid.h).fill(-1);
  regions.forEach((r, k) => { const t = G.rasterize(r.geometry, grid); for (let i = 0; i < t.length; i++) if (t[i] && zoneIdx[i] < 0) zoneIdx[i] = k; });
  G.growLabels(zoneIdx, grid, () => true);
  const generated = generatedMask(model, grid);
  // generated land and sea are not drawn: they take no part in the fit
  const zone = Array.from(zoneIdx, (k, c) => (k >= 0 && !generated[c] ? regions[k].id.replace(/^region_/u, '') : null));
  return { model, raster, grid, land, lake, zone, generated, regionSheets: regionSheets(model) };
}
/** The sheets each region's features are drawn on (feature `drawing.sheet` or `drawingOffSheet`), as the agreement measure reads them. */
export function regionSheets(model) {
  const out = new Map();
  for (const array of ['seas', 'lands', 'ranges', 'volcanoes', 'rivers', 'lakes', 'forests', 'deserts', 'marshes', 'ice', 'plains', 'straits', 'passes', 'sites', 'roads', 'coasts', 'hills'])
    for (const f of model[array] ?? []) { const sh = f.drawing?.sheet ?? f.drawingOffSheet; if (sh && f.region) { if (!out.has(f.region)) out.set(f.region, []); if (!out.get(f.region).includes(sh)) out.get(f.region).push(sh); } }
  return out;
}
const worldArea = s => { const b = s.drawingBox; return Math.abs((b[2] - b[0]) * s.scaleWorldPerDrawing[0] * (b[3] - b[1]) * s.scaleWorldPerDrawing[1]); };
/** The cells (indices into the grid) of a sheet's zone. */
export function sheetZone(ctx, sheetId, sheets = ctx.model.sheets) {
  const { grid, zone, regionSheets: rs } = ctx;
  const regions = [...rs.entries()].filter(([, ids]) => ids.includes(sheetId)).map(([k]) => k);
  const me = sheets[sheetId];
  const rivals = [...new Set(regions.flatMap(k => rs.get(k)))].filter(id => id !== sheetId && sheets[id] && worldArea(sheets[id]) < worldArea(me)).map(id => sheets[id]);
  const cells = [];
  for (let c = 0; c < zone.length; c++) {
    if (!regions.includes(zone[c])) continue;
    const p = G.cellCentre(grid, c % grid.w, Math.floor(c / grid.w));
    if (rivals.some(r => { const d = sheetToDrawing(r, p), b = paperBox(r); return d[0] >= b[0] && d[0] <= b[2] && d[1] >= b[1] && d[1] <= b[3]; })) continue;
    cells.push(c);
  }
  return { regions, cells: Int32Array.from(cells) };
}
/** Land IoU of a candidate sheet over its zone (see step 3 above). */
export function scoreSheet(ctx, s0, s, cells) {
  const { grid, land, raster } = ctx;
  let inter = 0, union = 0;
  for (let k = 0; k < cells.length; k++) {
    const c = cells[k];
    const p = G.cellCentre(grid, c % grid.w, Math.floor(c / grid.w));
    let v = drawnAt(raster, s, sheetToDrawing(s, p));
    if (v === 255) { if (drawnAt(raster, s0, sheetToDrawing(s0, p)) === 255) continue; v = 0; }
    const A = land[c] === 1, D = v === 1;
    if (A && D) inter++;
    if (A || D) union++;
  }
  return union ? inter / union : 1;
}

/** The same sheet scaled alike on both axes to `k` world pixels per drawing pixel, its box centre kept in place. */
export function undistorted(s, k) {
  const cd = boxCentre(s), cw = sheetToWorld(s, cd);
  const sx = Math.sign(s.scaleWorldPerDrawing[0]) * k * DRAWING_PX[0] / G.W, sy = Math.sign(s.scaleWorldPerDrawing[1]) * k * DRAWING_PX[1] / G.H;
  const out = { ...s, scaleWorldPerDrawing: [sx, sy], worldAnchor: [cw[0] + sx * (s.drawingAnchor[0] - cd[0]), cw[1] + sy * (s.drawingAnchor[1] - cd[1])] };
  delete out.affine;
  return out;
}
export const isUndistorted = (s, opts = REGISTRATION) => { const [kx, ky] = pxScale(s); return Math.abs(Math.log(kx / ky)) < opts.isotropyTol; };
/** One coarse-to-fine search from a base transform; `tie` scales both axes alike. Scores always use the recorded coverage s0. */
function searchFrom(ctxFine, ctxCoarse, s0, base, tie, zf, zc, opts) {
  const cand = p => candidate(base, tie ? [p[0], p[1], p[2], p[2], p[4]] : p);
  const evalC = p => scoreSheet(ctxCoarse, s0, cand(p), zc);
  const evalF = p => scoreSheet(ctxFine, s0, cand(p), zf);
  const zero = [0, 0, 0, 0, 0];
  const nt = Math.round(opts.translateRange / opts.translateStep), ns = Math.round(opts.scaleRange / opts.scaleStep);
  const coarse = [];
  for (let a = -ns; a <= ns; a++) for (let b = tie ? 0 : -ns; b <= (tie ? 0 : ns); b++) for (let i = -nt; i <= nt; i++) for (let j = -nt; j <= nt; j++) {
    const p = [i * opts.translateStep, j * opts.translateStep, a * opts.scaleStep, b * opts.scaleStep, 0];
    coarse.push({ p, v: evalC(p) });
  }
  // stable order: best first, then the smaller move
  const size = p => Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]) / 4 + Math.abs(p[3]) / 4;
  coarse.sort((x, y) => y.v - x.v || size(x.p) - size(y.p));
  const starts = [];
  for (const c of coarse) { if (starts.length >= 4) break; if (starts.every(s => Math.hypot(s.p[0] - c.p[0], s.p[1] - c.p[1]) > 0.012 || Math.abs(s.p[2] - c.p[2]) + Math.abs(s.p[3] - c.p[3]) > 0.06)) starts.push({ p: c.p }); }
  starts.push({ p: zero });
  let top = null;
  for (const st of starts) {
    let p = st.p.slice(), v = evalF(p);
    for (const step of opts.fineSteps) {
      const deltas = [step, step, step * 2, step * 2];
      for (let improved = true; improved;) {
        improved = false;
        for (let k = 0; k < (tie ? 3 : 4); k++) for (const sg of [1, -1]) {
          const q = p.slice(); q[k] = round(q[k] + sg * deltas[k], 8);
          if (Math.abs(q[0]) > opts.translateRange * 1.25 || Math.abs(q[1]) > opts.translateRange * 1.25 || Math.abs(q[2]) > opts.scaleRange * 1.25 || Math.abs(q[3]) > opts.scaleRange * 1.25) continue;
          const w = evalF(q);
          if (w > v + 1e-9) { p = q; v = w; improved = true; }
        }
      }
    }
    if (!top || v > top.v + 1e-9) top = { p, v };
  }
  // rotation, only when clearly needed
  let rot = { p: top.p, v: top.v };
  const nr = Math.round(opts.rotationRange / opts.rotationStep);
  for (let k = -nr; k <= nr; k++) {
    if (!k) continue;
    let p = top.p.slice(); p[4] = round(k * opts.rotationStep, 6);
    let v = evalF(p);
    for (const step of opts.fineSteps.slice(0, 2)) for (let n = 0; n < 2; n++) for (let d = 0; d < 2; d++) for (const sg of [1, -1]) {
      const t = p.slice(); t[d] = round(t[d] + sg * step, 8); const w = evalF(t); if (w > v + 1e-9) { p = t; v = w; }
    }
    if (v > rot.v + 1e-9) rot = { p, v };
  }
  const chosen = rot.v > top.v + opts.rotationGain ? { ...rot } : { ...top };
  if (tie) chosen.p = [chosen.p[0], chosen.p[1], chosen.p[2], chosen.p[2], chosen.p[4]];
  return { sheet: cand(chosen.p), params: chosen.p, iou: chosen.v, rotation: { best: rot.p[4], iou: rot.v, kept: chosen.v === rot.v && rot.p[4] !== 0 } };
}
/**
 * Coarse-to-fine search of one sheet. An undistorted sheet (equal pixel scales) is searched with one scale; a
 * distorted sheet is searched both freely and from three undistorted bases (its x scale, its y scale and their mean),
 * and the undistorted result is preferred unless the free one beats it by REGISTRATION.distortionGain, since the
 * layout placed every region without distortion. Returns { sheet, params, iou, iou0, base, rotation }.
 */
export function registerSheet(ctxFine, ctxCoarse, sheetId, opts = REGISTRATION) {
  const s0 = ctxFine.model.sheets[sheetId];
  const zf = sheetZone(ctxFine, sheetId).cells, zc = sheetZone(ctxCoarse, sheetId).cells;
  const iou0 = scoreSheet(ctxFine, s0, s0, zf);
  if (isUndistorted(s0, opts)) return { ...searchFrom(ctxFine, ctxCoarse, s0, s0, true, zf, zc, opts), iou0, base: 'recorded (undistorted)', undistorted: true };
  const free = { ...searchFrom(ctxFine, ctxCoarse, s0, s0, false, zf, zc, opts), base: 'recorded (distorted)', undistorted: false };
  const [kx, ky] = pxScale(s0);
  let iso = null;
  for (const [label, k] of [['x scale', kx], ['y scale', ky], ['mean scale', Math.sqrt(kx * ky)]]) {
    const b = undistorted(s0, k);
    const r = { ...searchFrom(ctxFine, ctxCoarse, b, b, true, zf, zc, opts), base: `undistorted at the ${label} (${k.toFixed(3)} px/px)`, undistorted: true };
    if (!iso || r.iou > iso.iou + 1e-9) iso = r;
  }
  return { ...(free.iou > iso.iou + opts.distortionGain ? free : iso), iou0, alternative: free.iou > iso.iou + opts.distortionGain ? { base: iso.base, iou: iso.iou } : { base: free.base, iou: free.iou } };
}

// ---------------------------------------------------------------------------------------------------- landmarks
/** The drawn label anchors of docs/name_table.md that lie on the mosaic: { name, scan, kind, at: [x, y] }. */
export function parseLabels(text) {
  const out = [];
  for (const line of text.split(/\r?\n/u)) {
    const cells = line.split('|').map(c => c.trim());
    if (cells.length < 7) continue;
    const m = /^(-?\d*\.\d+),\s*(-?\d*\.\d+)$/u.exec(cells[4]);
    if (!m) continue;
    out.push({ name: cells[1], scan: cells[2], kind: cells[3], at: [Number(m[1]), Number(m[2])], reading: cells[5] || null });
  }
  return out;
}
/** What a label expects under it: 'water', 'land', 'island' or null (headings and annotations are not checked). */
export function labelExpectation(kind) {
  if (/heading|title|annotation|route/u.test(kind)) return null;
  if (/^(sea|ocean|lake|bay|gulf|strait|sound|channel)/u.test(kind)) return 'water';
  if (/^island/u.test(kind)) return 'island';
  return 'land';
}
/** Cell distance (BFS steps) to the nearest cell where `mask` holds. */
export function cellDistance(mask, grid, maxSteps = 64) {
  const d = new Int16Array(mask.length).fill(-1);
  let frontier = [];
  for (let i = 0; i < mask.length; i++) if (mask[i]) { d[i] = 0; frontier.push(i); }
  for (let step = 1; step <= maxSteps && frontier.length; step++) {
    const next = [];
    for (const c of frontier) {
      const i = c % grid.w, j = (c - i) / grid.w;
      for (const n of [i > 0 ? c - 1 : -1, i + 1 < grid.w ? c + 1 : -1, j > 0 ? c - grid.w : -1, j + 1 < grid.h ? c + grid.w : -1]) if (n >= 0 && d[n] < 0) { d[n] = step; next.push(n); }
    }
    frontier = next;
  }
  return d;
}
/** Label agreement of one sheet: each label of its scan inside its paper, mapped to the world, against model land or water. */
export function labelLandmarks(ctx, s, sheetId, labels, dist, opts = REGISTRATION) {
  const { grid } = ctx;
  const out = [];
  for (const l of labels) {
    if (SCAN_SHEETS[l.scan] !== sheetId) continue;
    const want = labelExpectation(l.kind);
    if (!want) continue;
    const b = paperBox(s);
    if (l.at[0] < b[0] || l.at[0] > b[2] || l.at[1] < b[1] || l.at[1] > b[3]) continue;
    const p = sheetToWorld(s, l.at);
    const c = G.cellIndexOf(grid, p);
    if (c < 0) { out.push({ name: l.name, kind: l.kind, ok: false, px: null }); continue; }
    const steps = want === 'water' ? dist.water[c] : dist.land[c];
    const px = steps < 0 ? null : steps * grid.cell;
    const tol = want === 'island' ? opts.islandLabelTolPx : opts.labelTolPx;
    out.push({ name: l.name, kind: l.kind, ok: px !== null && px <= tol, px });
  }
  return out;
}
/** Distance in world pixels from a world point to the nearest drawn coast of a sheet, up to `maxPx` (null off the paper). */
export function coastDistancePx(raster, s, p, maxPx = 160) {
  const here0 = drawnAt(raster, s, sheetToDrawing(s, p));
  if (here0 === 255) return null;
  for (let r = 2; r <= maxPx; r += 2) {
    const n = Math.max(8, Math.round(r * 1.5));
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n;
      const v = drawnAt(raster, s, sheetToDrawing(s, [p[0] + (r * Math.cos(a)) / G.W, p[1] + (r * Math.sin(a)) / G.H]));
      if (v !== 255 && v !== here0) return r;
    }
  }
  return maxPx;
}
/** Coast landmarks of a sheet: river mouths that reach the sea and coast points (capes, bays, peninsulas). */
export function coastLandmarks(model, raster, s, sheetId, opts = REGISTRATION) {
  const onSheet = f => (f.drawing?.sheet ?? f.drawingOffSheet) === sheetId;
  const out = [];
  for (const r of model.rivers ?? []) if (onSheet(r) && !r.endorheic) {
    const c = r.geometry.coordinates, d = coastDistancePx(raster, s, c[c.length - 1]);
    if (d !== null) out.push({ id: r.id, kind: 'river mouth', px: d, ok: d <= opts.coastTolPx });
  }
  for (const k of model.coasts ?? []) if (onSheet(k)) {
    const d = coastDistancePx(raster, s, k.geometry.coordinates);
    if (d !== null) out.push({ id: k.id, kind: k.kind ?? 'coast', px: d, ok: d <= opts.coastTolPx });
  }
  return out;
}
const share = list => (list.length ? list.filter(e => e.ok).length / list.length : null);

// ---------------------------------------------------------------------------------------------------- the registration
/**
 * Register every sheet of a model against the drawing. Returns the registration document (see the header); `only`
 * limits the refinement to some sheets (the others keep their recorded transform and get only the frame inset).
 */
export function registerAll(model, raster, labels, { only = null, opts = REGISTRATION, log = () => {} } = {}) {
  const fineGrid = { ox: 0, oy: 0, cell: 4, w: 1280, h: 640 }, coarseGrid = { ox: 0, oy: 0, cell: 16, w: 320, h: 160 };
  // 1. frame insets for every sheet first: zones depend on every sheet's paper
  const framed = clone(model);
  const insets = {};
  for (const [id, s] of Object.entries(framed.sheets)) { insets[id] = frameInset(raster, s.drawingBox, opts); s.clipBox = insetBox(s.drawingBox, insets[id]); }
  const fine = buildContext(framed, raster, fineGrid), coarse = buildContext(framed, raster, coarseGrid);
  const water = new Uint8Array(fine.land.length);
  for (let i = 0; i < water.length; i++) water[i] = !fine.land[i] || fine.lake[i] ? 1 : 0;
  const dist = { land: cellDistance(fine.land, fineGrid), water: cellDistance(water, fineGrid) };
  const sheets = {};
  for (const id of Object.keys(framed.sheets).sort()) {
    const s0 = model.sheets[id], sf = framed.sheets[id];
    const zone = sheetZone(fine, id);
    const iouRecorded = scoreSheet({ ...fine, model }, s0, s0, sheetZone({ ...fine, model }, id, model.sheets).cells);
    const iouFramed = scoreSheet(fine, sf, sf, zone.cells);
    const L0 = labelLandmarks(fine, sf, id, labels, dist, opts), C0 = coastLandmarks(model, raster, sf, id, opts);
    const entry = {
      regions: zone.regions, frameInsetPx: insets[id], before: transformRecord(s0),
      iou: { recorded: round(iouRecorded, 4), framed: round(iouFramed, 4) },
      labels: { n: L0.length, before: share(L0) === null ? null : round(share(L0), 4) },
      coast: { n: C0.length, before: share(C0) === null ? null : round(share(C0), 4) },
    };
    let chosen = sf, decision = iouFramed >= opts.targetIoU ? `kept: the zone agrees at ${iouFramed.toFixed(3)}, at or above ${opts.targetIoU}` : null;
    if (!decision && (!only || only.includes(id))) {
      const r = registerSheet(fine, coarse, id, opts);
      const L1 = labelLandmarks(fine, r.sheet, id, labels, dist, opts), C1 = coastLandmarks(model, raster, r.sheet, id, opts);
      const gain = r.iou - iouFramed, labelLoss = (share(L0) ?? 0) - (share(L1) ?? 0), coastLoss = C0.length >= 3 ? (share(C0) ?? 0) - (share(C1) ?? 0) : 0;
      entry.search = { base: r.base, undistorted: r.undistorted, alternative: r.alternative ?? null, params: { translate: r.params.slice(0, 2).map(v => round(v, 5)), logScale: r.params.slice(2, 4).map(v => round(v, 5)), rotation: r.params[4] }, iou: round(r.iou, 4), rotationBest: { radians: r.rotation.best, iou: round(r.rotation.iou, 4), kept: r.rotation.kept }, labels: share(L1) === null ? null : round(share(L1), 4), coast: share(C1) === null ? null : round(share(C1), 4) };
      if (gain < opts.minGain) decision = `kept: the best fit gains only ${gain.toFixed(4)} IoU`;
      else if (labelLoss > opts.maxLabelLoss) decision = `refused: the fit gains ${gain.toFixed(3)} IoU but its drawn labels agree ${(labelLoss * 100).toFixed(1)} points worse (a wrong coast)`;
      else if (coastLoss > opts.maxCoastLoss && -labelLoss < opts.labelOverride) decision = `refused: the fit gains ${gain.toFixed(3)} IoU but its river mouths and capes agree ${(coastLoss * 100).toFixed(1)} points worse`;
      else { chosen = r.sheet; decision = `refined: IoU ${iouFramed.toFixed(3)} to ${r.iou.toFixed(3)}, labels ${(share(L0) ?? 0).toFixed(3)} to ${(share(L1) ?? 0).toFixed(3)}`; }
      entry.labelsFailing = L1.filter(l => !l.ok).map(l => `${l.name} (${l.kind}${l.px === null ? '' : `, ${l.px} px`})`);
    } else if (!decision) decision = 'not refined in this run';
    if (!entry.labelsFailing) entry.labelsFailing = labelLandmarks(fine, chosen, id, labels, dist, opts).filter(l => !l.ok).map(l => `${l.name} (${l.kind}${l.px === null ? '' : `, ${l.px} px`})`);
    const after = { ...chosen, clipBox: sf.clipBox };
    entry.after = transformRecord(after);
    entry.iou.after = round(chosen === sf ? iouFramed : entry.search.iou, 4);
    entry.labels.after = share(labelLandmarks(fine, after, id, labels, dist, opts)) === null ? null : round(share(labelLandmarks(fine, after, id, labels, dist, opts)), 4);
    entry.coast.after = share(coastLandmarks(model, raster, after, id, opts)) === null ? null : round(share(coastLandmarks(model, raster, after, id, opts)), 4);
    entry.decision = decision;
    sheets[id] = entry;
    log(`${id.padEnd(8)} ${decision}`);
  }
  return sheets;
}
const clone = v => JSON.parse(JSON.stringify(v));

/** The registration document written to sheet_registration.json. */
export function registrationDocument(sheets, raster, opts = REGISTRATION) {
  return {
    schemaVersion: 1,
    name: 'Aoaz sheet registration: refined transforms of the drawn sheets',
    generatedBy: 'tools/content/geography/sheet_registration.mjs (deterministic from the model and the private working drawing; regenerate, do not edit by hand)',
    appliedBy: 'tools/content/geography/repair_model.mjs (applyRegistration)',
    drawing: { file: 'docs/reference/originals/Erdae-working.jpg (private, git-ignored; never copied)', widthPx: raster.w, heightPx: raster.h, sha256: raster.sha256 },
    transform: 'world = worldAnchor + scaleWorldPerDrawing * (drawing - drawingAnchor) per axis; `affine` [a, b, c, d, e, f] (world x = a dx + b dy + c, world y = d dx + e dy + f) replaces it when present. `clipBox` is the part of the drawing box the import reads (the pencil frame is cut off).',
    measure: 'Land intersection over union of the model and the warped drawing over the sheet\'s zone (the nearest-region zones of the regions drawn on the sheet, less the cells a smaller sheet of those regions covers). `recorded` uses the recorded transform and box, `framed` the recorded transform with the clip box, `after` the result.',
    options: { ...opts },
    sheets,
  };
}

// ---------------------------------------------------------------------------------------------------- command line
async function main(argv) {
  const args = argv.slice(2);
  const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const modelPath = opt('--model') ?? path.join(here, '../data/geography/aoaz.repaired.json');
  const jpg = opt('--drawing') ?? DEFAULT_DRAWING_PATH;
  const out = opt('--out');
  const only = opt('--sheets')?.split(',') ?? null;
  const ov = {};
  for (const kv of (opt('--opts') ?? '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); ov[k] = Number(v); }
  if (!existsSync(jpg)) throw new Error(`the working drawing is not at ${jpg}`);
  const model = JSON.parse(readFileSync(modelPath, 'utf8'));
  // the registration refines the transforms recorded in the input model, not ones already refined
  if (model.registration?.before) for (const [id, t] of Object.entries(model.registration.before)) model.sheets[id] = { ...model.sheets[id], ...t };
  for (const s of Object.values(model.sheets)) { delete s.clipBox; delete s.affine; }
  const raster = await loadDrawingRaster(jpg);
  const labels = parseLabels(readFileSync(opt('--labels') ?? DEFAULT_LABELS_PATH, 'utf8'));
  const sheets = registerAll(model, raster, labels, { only, opts: { ...REGISTRATION, ...ov }, log: m => console.log(m) });
  for (const [id, e] of Object.entries(sheets)) console.log(`${id.padEnd(8)} IoU recorded ${e.iou.recorded.toFixed(3)} framed ${e.iou.framed.toFixed(3)} after ${e.iou.after.toFixed(3)}   labels ${e.labels.before ?? '-'} -> ${e.labels.after ?? '-'} (${e.labels.n})   coast ${e.coast.before ?? '-'} -> ${e.coast.after ?? '-'} (${e.coast.n})   inset ${e.frameInsetPx.join(',')}${e.search ? `   search ${JSON.stringify(e.search.params)}` : ''}`);
  if (args.includes('--report')) for (const [id, e] of Object.entries(sheets)) if (e.labelsFailing.length) console.log(`  ${id} labels off: ${e.labelsFailing.join('; ')}`);
  if (out) writeFileSync(out, `${JSON.stringify(registrationDocument(sheets, raster), null, 1)}\n`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv).catch(e => { console.error(e); process.exitCode = 1; });
