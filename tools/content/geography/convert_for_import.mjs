// Conversion of the geography model of Aoaz into the inputs of the HOI4 Agent Tools drawn-map import (ADR 0067
// section 7 of the tool repository: "converting aoaz.json into those two documents is ZIN data work").
//
// Inputs (all tracked, no private file is read):
//   tools/content/data/geography/aoaz.repaired.json   the repaired model (repair_model.mjs), sheets with clips and orders
//   tools/content/data/geography/coast_features.json  bays, gulfs and strait crossings (coast_features.mjs, decision K46)
//   tools/content/data/geography/import/aoaz.palette.json  the per-sheet colours measured by import_measures.mjs
//   tools/content/geography/surface_overrides.json    the land and sea the model forces over the drawing
//   tools/content/data/geography/aoaz.json            the design model, for the drawn labels behind renamed names
//   tools/content/data/world/roster.json              realm capitals and tags
// Outputs, in tools/content/data/geography/import/ (data only, no image):
//   aoaz.geography.json     geography model version 1 (schemas/geography-model.schema.json of the tool)
//   aoaz.sheets.json        reference-sheets version 1 (schemas/reference-sheets.schema.json of the tool)
//   aoaz.annotations.json   the surface overrides as `reference.annotations` (world coordinates, at most 128 polygons)
//   aoaz.names.json         every renamed or proposed name with the drawn label it replaces (`formerLabel`), for the
//                           `names` of the future override file (world-overrides, not yet released)
//   aoaz.held_back.json     model content the schema or the tool's current version cannot take, kept for later
//   conversion_report.json  counts, exclusions, the edge-band check and the inputs' SHA-256
//   preview_call.json       the exact hoi4_map_rewrite preview request (not run: the import ships with 4.4.0), with the
//                           annotations and the import's own illustrated reading; preview_call_palette.json the same
//                           with the measured palette, for comparison
//
// Mapping (model -> schema v1). Coordinates stay normalised to the 5,120 x 2,560 frame; rings lose their closing
// vertex and consecutive duplicates, are rounded to 5 decimals and are simplified (in pixels) only when over the
// schema's 2,000 vertices; a MultiPolygon keeps its largest 64 parts and every hole goes to `holes`.
//   seas      polygons and holes; kind sea (the model's "ocean" and the storm belt are seas: no water is called an
//             Ocean, K29), gulf for the seas coast_features.json marks and for its bays and gulfs, which are carved out
//             of the seas they lie in on the 4-pixel grid; no depth or ice (sea ice is synthesis the tool lacks)
//   lands     polygons, holes, kind continent or island, `region` when the land lies in one region; no biome or
//             fertility (blocked by MAP_GEOGRAPHY_SYNTHESIS_UNAVAILABLE until the climate stage lands)
//   regions   the 16 regions (not the four zones, which overlap them) with their polygons and density; no terrain shares
//   ranges    the spine as `path`, halfWidth, peak from the peak class, `closed` for a ring; the Great Wall of Aenor
//             (`wall`) is a natural massif (K2) whose crest is impassable except at its passes
//   passes    a point (the middle of a road pass) with the range it crosses when one lies within IMPORT.passReachPx
//   volcanoes a point, peak from the elevation, active when the model says active
//   rivers    source (first vertex), mouth (last vertex, moved onto the nearest water within IMPORT.mouthReachPx when
//             it lies on the shore), via, size from the width class; rivers that end in a desert
//             basin are held back (the schema needs a mouth in water)
//   lakes     polygons, holes, gameplay lake
//   straits   one per crossing of coast_features.json between two different lands: `between` the two shore points
//             (no path: a straight path across a narrow gap clips the shores), rule open (K46); crossings between two coasts of one land are held back (the
//             schema refuses a strait from a land to itself)
//   sites     a point, kind and importance from IMPORT, `country` and kind capital for the roster's capitals, the lake
//             of a lake port
//   roads     the path, importance IMPORT.roadImportance
//   places    the model's coast points (capes, bays, gulfs, peninsulas, reefs)
// Held back: forests, deserts, marshes, ice, plains and hills (terrain areas: the schema's `biomes`, blocked until the
// climate stage), regions' terrain shares, climate, the four zones, the edge records, crossings within one land and
// endorheic rivers.
//
//   node tools/content/geography/convert_for_import.mjs [--out <dir>]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as G from './geo_core.mjs';
import { ringsOf, pointInGeometry, distanceToGeometry } from './check_model.mjs';
import { edt2 } from './coast_features.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, '../data/geography');
export const DEFAULT_OUT = path.join(DATA, 'import');
export const PATHS = Object.freeze({
  model: path.join(DATA, 'aoaz.repaired.json'),
  design: path.join(DATA, 'aoaz.json'),
  coast: path.join(DATA, 'coast_features.json'),
  names: path.join(DATA, 'name_table.json'),
  palette: path.join(DATA, 'import', 'aoaz.palette.json'),
  surface: path.join(DATA, 'import', 'feature_surface.json'),
  fixes: path.join(DATA, 'import', 'surface_fixes.json'),
  overrides: path.join(here, 'surface_overrides.json'),
  roster: path.join(here, '../data/world/roster.json'),
});
/** Workspace-relative paths the import call names (the mod folder is the workspace). */
export const WORKSPACE = Object.freeze({
  drawing: 'docs/reference/originals/Erdae.png',
  geography: 'tools/content/data/geography/import/aoaz.geography.json',
  sheets: 'tools/content/data/geography/import/aoaz.sheets.json',
});

export const IMPORT = Object.freeze({
  frame: Object.freeze({ width: 5120, height: 2560 }),
  /** The full drawing the sheets were registered for (private, git-ignored): its size and SHA-256. */
  source: Object.freeze({ width: 17520, height: 12720, sha256: '37ef59399903bc8217dbc527e26158c06a133eace0340a5b95e233c1cadc2ecf' }),
  edge: Object.freeze({ mode: 'sea-band', bandPx: 205, polarPx: 64 }), // the tool's defaults: max(192, 4% of the width), 64
  maxRingVertices: 2000,
  maxPolygons: 64,
  maxPathVertices: 2000,
  maxVia: 512,
  maxClipVertices: 512,
  annotationMaxPolygons: 128,
  annotationMaxPoints: 1000,
  coastBandPx: 6,
  coastNarrowPx: 24,
  peakByClass: Object.freeze({ 1: 0.3, 2: 0.4, 3: 0.55, 4: 0.75, 5: 0.9 }),
  volcanoPeakByElevation: Object.freeze({ 3: 0.6, 4: 0.75, 5: 0.9 }),
  riverSizeByWidth: Object.freeze({ 1: 1, 2: 3, 3: 5 }),
  siteKind: Object.freeze({ capital: 'capital', region_seat: 'city', port: 'port', fort: 'fortress', castle: 'fortress', story: 'landmark', peak: 'landmark', victory_point: 'city', chasm: 'landmark' }),
  siteImportance: Object.freeze({ capital: 4, region_seat: 3, port: 3, fort: 3, castle: 3, story: 2, peak: 2, victory_point: 3, chasm: 2 }),
  capitalImportance: Object.freeze({ major: 5, default: 4 }),
  placeKind: Object.freeze({ cape: 'cape', bay: 'bay', gulf: 'gulf', peninsula: 'peninsula', reef: 'reef' }),
  roadImportance: 2,
  passReachPx: 102,
  mouthReachPx: 64,
  maxStraitWidth: 0.1,
  noteMax: 2000,
  agreement: Object.freeze({ minLandIou: 0.85, warnLandIou: 0.95 }),
});
const CG = Object.freeze({ ox: 0, oy: 0, cell: 4, w: 1280, h: 640 });

// ---------------------------------------------------------------------------------------------------- geometry
const clamp01 = v => Math.min(1, Math.max(0, v));
const pt = p => [G.round5(clamp01(p[0])), G.round5(clamp01(p[1]))];
const samePt = (a, b) => a[0] === b[0] && a[1] === b[1];
/** A ring for the schema: rounded, without the closing vertex or repeated vertices, simplified when too long. */
export function schemaRing(ring, max = IMPORT.maxRingVertices) {
  let r = ring.map(pt).filter((p, i, a) => i === 0 || !samePt(p, a[i - 1]));
  while (r.length > 1 && samePt(r[0], r[r.length - 1])) r.pop();
  for (let tol = 0.5; r.length > max; tol *= 1.5) r = G.simplifyRing(r, tol).filter((p, i, a) => i === 0 || !samePt(p, a[i - 1]));
  return r.length >= 3 ? r : null;
}
/** `polygons` and `holes` of an area geometry (largest parts first, at most IMPORT.maxPolygons). */
export function areaFields(g, report = null, id = null) {
  const parts = ringsOf(g).map(part => ({ part, area: Math.abs(G.ringAreaPx(part[0])) })).sort((p, q) => q.area - p.area);
  if (parts.length > IMPORT.maxPolygons && report) report.push({ id, issue: `${parts.length - IMPORT.maxPolygons} smallest parts dropped (the schema allows ${IMPORT.maxPolygons})` });
  const kept = parts.slice(0, IMPORT.maxPolygons);
  const polygons = kept.map(({ part }) => schemaRing(part[0])).filter(Boolean);
  const holes = kept.flatMap(({ part }) => part.slice(1).map(r => schemaRing(r)).filter(Boolean)).slice(0, IMPORT.maxPolygons);
  return { polygons, ...(holes.length ? { holes } : {}) };
}
/** A path for the schema: rounded, without repeated vertices, simplified when too long. */
export function schemaPath(coords, max = IMPORT.maxPathVertices) {
  let c = coords.map(pt).filter((p, i, a) => i === 0 || !samePt(p, a[i - 1]));
  for (let tol = 0.5; c.length > max; tol *= 1.5) c = G.simplifyLine(c, tol);
  return c;
}
/** A point inside an area geometry: the cell of its largest part farthest from the outline. */
export function interiorPoint(g) {
  const part = ringsOf(g).map(p => ({ p, a: Math.abs(G.ringAreaPx(p[0])) })).sort((x, y) => y.a - x.a)[0].p;
  const geom = { type: 'Polygon', coordinates: part };
  const grid = G.makeGrid(G.boundsOf(part[0]), 2, 2);
  const mask = G.rasterize(geom, grid);
  const d = G.insideDistance(mask, grid);
  let best = -1;
  for (let i = 0; i < d.length; i++) if (mask[i] && (best < 0 || d[i] > d[best])) best = i;
  return best < 0 ? pt(part[0][0]) : pt(G.cellCentre(grid, best % grid.w, Math.floor(best / grid.w)));
}
const pointOf = g => (g.type === 'Point' ? pt(g.coordinates) : g.type === 'LineString' ? middleOfLine(g.coordinates) : interiorPoint(g));
const middleOfLine = c => { const d = G.densifyLine(c, 2).map(e => e.p); return pt(d[Math.floor(d.length / 2)]); };
const note = f => (f.notes ? String(f.notes).slice(0, IMPORT.noteMax) : undefined);
const tagsOf = f => [f.established ? 'established' : 'proposed'];
const opt = (k, v) => (v === undefined || v === null ? {} : { [k]: v });
const sha256 = text => createHash('sha256').update(text).digest('hex');

// ---------------------------------------------------------------------------------------------------- sheets
/** One ring holding every ring of a clip (outer rings and holes), joined by zero-width bridges from its first vertex:
 *  the import's even-odd test reads it exactly as the parts and holes. */
export function bridgeRings(rings) {
  if (rings.length === 1) return rings[0].slice();
  const anchor = rings[0][0];
  const out = rings[0].slice();
  out.push(anchor);
  for (const r of rings.slice(1)) { out.push(...r, r[0], anchor); }
  return out;
}
/**
 * A sheet's clip for the reference-sheets document: the model's clip (a Polygon or MultiPolygon in drawing coordinates)
 * as one bridged ring of at most IMPORT.maxClipVertices vertices, simplified in world pixels through the sheet's
 * transform (a clip stays within the model's coast margin, so the simplification never reaches a coast).
 */
export function clipRing(sheet, max = IMPORT.maxClipVertices) {
  if (!sheet.clip) return null;
  const toWorld = d => (sheet.affine ? [sheet.affine[0] * d[0] + sheet.affine[1] * d[1] + sheet.affine[2], sheet.affine[3] * d[0] + sheet.affine[4] * d[1] + sheet.affine[5]] : [sheet.worldAnchor[0] + (d[0] - sheet.drawingAnchor[0]) * sheet.scaleWorldPerDrawing[0], sheet.worldAnchor[1] + (d[1] - sheet.drawingAnchor[1]) * sheet.scaleWorldPerDrawing[1]]);
  const rings = ringsOf(sheet.clip).flat().map(r => { const c = r.slice(); while (c.length > 1 && samePt(c[0], c[c.length - 1])) c.pop(); return c; });
  for (let tol = 0; ; tol = tol ? tol * 1.5 : 0.5) {
    const simplified = rings.map(r => {
      if (!tol) return r;
      const keep = new Set(G.simplifyRing(r.map(toWorld), tol).map(p => `${p[0]},${p[1]}`));
      return r.filter(d => keep.has(`${toWorld(d)[0]},${toWorld(d)[1]}`));
    }).filter(r => r.length >= 3);
    const ring = bridgeRings(simplified).map(d => [G.round5(clamp01(d[0])), G.round5(clamp01(d[1]))]);
    if (ring.length <= max) return ring;
    if (tol > 64) throw new Error(`the clip of sheet ${sheet.id} cannot be brought under ${max} vertices`);
  }
}
const r6 = v => Math.round(v * 1e6) / 1e6;
/** The reference-sheets document (version 1) of the model's sheets. */
export function sheetsDocument(model, source = IMPORT.source) {
  const sheets = Object.entries(model.sheets).map(([id, s]) => {
    const box = (s.clipBox ?? s.drawingBox).map(v => r6(clamp01(v)));
    const clip = clipRing({ ...s, id });
    const map = s.affine
      ? { affine: s.affine.map(r6) }
      : { anchor: s.drawingAnchor.map(r6), target: s.worldAnchor.map(r6), scale: s.scaleWorldPerDrawing.map(r6) };
    return { id, box, ...(clip ? { clip } : {}), ...map, order: s.order };
  }).sort((p, q) => q.order - p.order || p.id.localeCompare(q.id));
  return { version: 1, source: { ...source }, fill: 'sea', sheets };
}

// ---------------------------------------------------------------------------------------------------- annotations
/** Morphological opening of a mask with a disc of `r` cells (Euclidean): the parts at least 2r wide. */
export function opening(mask, w, h, r) {
  const r2 = r * r, outside = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) outside[i] = mask[i] ? 0 : 1;
  const dOut = edt2(outside, w, h);
  const core = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) core[i] = mask[i] && dOut[i] > r2 ? 1 : 0;
  const dCore = edt2(core, w, h);
  const out = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) out[i] = mask[i] && dCore[i] <= r2 ? 1 : 0;
  return out;
}

/**
 * The model's frame around the drawn coast (the land the import reads follows the model's land where the model is
 * right): on the 4-pixel grid, 1 where the model's land is forced, 0 where its sea is forced, 2 its lakes, 255 where the drawing
 * decides. The drawing decides only within `bandPx` of the model's coast, and only where both the land and the water
 * there are at least twice `bandPx` wide:
 *   - land farther than bandPx from the model's sea is land (lettering, pencil lines and sheet seams inland, a neck the
 *     drawing leaves open), and land narrower than 2 x bandPx (necks, spits, small islands) is land throughout;
 *   - sea farther than bandPx from the model's land is sea (lettering and pencil strips in the water, a neighbouring
 *     sheet's paper), and water narrower than 2 x bandPx (straits, which decision K46 keeps as crossings, not land
 *     bridges; narrow inlets) is sea throughout;
 *   - the model's lakes are lake (2): the import measures the model's lakes as water, and an inland water body the
 *     drawing leaves unread would otherwise count as land.
 */
export function coastBandForcing(model, bandPx = IMPORT.coastBandPx, narrowPx = IMPORT.coastNarrowPx) {
  const { w, h } = CG, r = bandPx / CG.cell, r2 = r * r, rn = narrowPx / 2 / CG.cell;
  const land = new Uint8Array(w * h), lake = new Uint8Array(w * h);
  for (const l of model.lands) G.rasterizeInto(l.geometry, CG, land, 1);
  for (const l of model.lakes ?? []) G.rasterizeInto(l.geometry, CG, lake, 1);
  const sea = new Uint8Array(w * h);
  for (let i = 0; i < sea.length; i++) sea[i] = land[i] ? 0 : 1;
  const toSea = edt2(sea, w, h), toLand = edt2(land, w, h);
  const wideLand = opening(land, w, h, rn), wideSea = opening(sea, w, h, rn);
  const forced = new Uint8Array(w * h).fill(255);
  for (let i = 0; i < forced.length; i++) {
    if (lake[i]) forced[i] = 2;
    else if (land[i]) { if (toSea[i] > r2 || !wideLand[i]) forced[i] = 1; }
    else if (toLand[i] > r2 || !wideSea[i]) forced[i] = 0;
  }
  return forced;
}

/** Polygons (bridged rings of at most `maxPoints`) of one mask; an area too complex for one ring is halved until it fits. */
export function maskPolygons(mask, maxPoints = IMPORT.annotationMaxPoints, minPx = 16) {
  const out = [], failed = [];
  const { labels, sizes } = G.labelComponents(mask, CG);
  const boxes = sizes.map(() => [Infinity, Infinity, -1, -1]);
  for (let c = 0; c < labels.length; c++) {
    const k = labels[c];
    if (k < 0) continue;
    const i = c % CG.w, j = (c - i) / CG.w, b = boxes[k];
    if (i < b[0]) b[0] = i; if (j < b[1]) b[1] = j; if (i > b[2]) b[2] = i; if (j > b[3]) b[3] = j;
  }
  // each area is traced on its own 2-pixel grid (every 4-pixel cell becomes 2 x 2), so a neck or a strait one cell
  // wide is two cells wide to the tracer; an area too complex for one ring is halved across its longer side
  const trace = (k, box, depth) => {
    const [x0, y0, x1, y1] = box, w = (x1 - x0 + 1) * 2 + 2, h = (y1 - y0 + 1) * 2 + 2;
    const grid = { ox: x0 * CG.cell - 2, oy: y0 * CG.cell - 2, cell: 2, w, h };
    const local = new Uint8Array(w * h);
    let n = 0;
    for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) {
      if (labels[j * CG.w + i] !== k) continue;
      n++;
      const li = (i - x0) * 2 + 1, lj = (j - y0) * 2 + 1;
      local[lj * w + li] = 1; local[lj * w + li + 1] = 1; local[(lj + 1) * w + li] = 1; local[(lj + 1) * w + li + 1] = 1;
    }
    if (!n || n * CG.cell * CG.cell < minPx) return;
    const g = G.vectorize(local, grid, { tolerances: [2, 1.5, 1.0, 0.5, 0, 3], minPartPx: Math.min(minPx, 4), minHolePx: minPx, maxVertices: maxPoints });
    const rings = g ? ringsOf(g).map(part => bridgeRings(part.map(r => { const c = r.slice(); while (c.length > 1 && samePt(c[0], c[c.length - 1])) c.pop(); return c; }))) : null;
    if (rings && rings.every(r => r.length <= maxPoints)) { for (const r of rings) out.push({ ring: r, areaPx: n * CG.cell * CG.cell }); return; }
    if (depth >= 12 || (x1 - x0 < 4 && y1 - y0 < 4)) { failed.push({ areaPx: n * CG.cell * CG.cell }); return; }
    const vertical = x1 - x0 >= y1 - y0, cut = vertical ? Math.floor((x0 + x1) / 2) : Math.floor((y0 + y1) / 2);
    trace(k, vertical ? [x0, y0, cut, y1] : [x0, y0, x1, cut], depth + 1);
    trace(k, vertical ? [cut + 1, y0, x1, y1] : [x0, cut + 1, x1, y1], depth + 1);
  };
  sizes.forEach((n, k) => trace(k, boxes[k], 0));
  return { polygons: out, failed };
}

/**
 * The surface the annotations force, on the 4-pixel grid (0 sea, 1 land, 2 lake, 255 the drawing decides): the surface
 * overrides painted in order (open-sea bands, undrawn land, moved lands, the Nether, the approved layout), then the
 * model's frame around the drawn coast (coastBandForcing) over them.
 *
 * Land is painted only where the drawing needs it: a land annotation replaces the drawing's terrain class (forest,
 * desert, snow, mountain) with plain land, so land the import already reads as land stays the drawing's. `landFilter`
 * says where land is painted: a mask on the 4-pixel grid (surfaceFixesMask of surface_fixes.json: the forced land the
 * drawing reads as water, measured by import_measures.mjs), 'all' for every forced land cell (the measuring step's own
 * starting point), or null when no measure exists (then only the overrides' own land, as before the frame existed).
 */
export function forcedSurface(overrides, model = null, { bandPx = IMPORT.coastBandPx, narrowPx = IMPORT.coastNarrowPx, landFilter = null } = {}) {
  const forced = new Uint8Array(CG.w * CG.h).fill(255);
  for (const e of overrides?.surface ?? []) G.rasterizeInto({ type: 'Polygon', coordinates: [e.polygon, ...(e.holes ?? [])] }, CG, forced, e.kind === 'land' ? 1 : 0);
  const fromOverrides = forced.slice();
  if (model && bandPx > 0) { const band = coastBandForcing(model, bandPx, narrowPx); for (let c = 0; c < forced.length; c++) if (band[c] !== 255) forced[c] = band[c]; }
  if (landFilter !== 'all') for (let c = 0; c < forced.length; c++) {
    if (forced[c] !== 1) continue;
    const keep = landFilter ? landFilter[c] === 1 : fromOverrides[c] === 1;
    if (!keep) forced[c] = 255;
  }
  return forced;
}

/** The 8-pixel blocks of surface_fixes.json (rows of [y, x0, x1] in blocks) as a mask on the 4-pixel grid. */
export function surfaceFixesMask(fixes) {
  const mask = new Uint8Array(CG.w * CG.h), b = fixes?.blockCells ?? 2;
  for (const [y, x0, x1] of fixes?.rows ?? []) for (let x = x0; x <= x1; x++) for (let dj = 0; dj < b; dj++) for (let di = 0; di < b; di++) {
    const i = x * b + di, j = y * b + dj;
    if (i < CG.w && j < CG.h) mask[j * CG.w + i] = 1;
  }
  return mask;
}

/**
 * `reference.annotations`: the forced surface (forcedSurface) traced into polygons of at most
 * IMPORT.annotationMaxPoints points, at most IMPORT.annotationMaxPolygons in all. Sea first, then land, then lakes.
 */
export function annotationsFrom(overrides, model = null, options = {}) {
  const forced = forcedSurface(overrides, model, options);
  const out = [], failed = [];
  for (const [kind, value] of [['sea', 0], ['land', 1], ['lake', 2]]) {
    const mask = new Uint8Array(forced.length);
    for (let c = 0; c < mask.length; c++) mask[c] = forced[c] === value ? 1 : 0;
    const { polygons, failed: f } = maskPolygons(mask);
    // pack the areas of one kind into as few rings as the point limit allows: rings joined by zero-width bridges fill
    // even-odd exactly as they do apart, wherever the bridges run
    const packed = [];
    for (const p of polygons.sort((x, y) => y.areaPx - x.areaPx || x.ring[0][0] - y.ring[0][0] || x.ring[0][1] - y.ring[0][1])) {
      const last = packed[packed.length - 1];
      if (last && last.points + p.ring.length + 2 <= IMPORT.annotationMaxPoints) { last.rings.push(p.ring); last.points += p.ring.length + 2; last.areaPx += p.areaPx; }
      else packed.push({ rings: [p.ring], points: p.ring.length + 1, areaPx: p.areaPx }); // the first ring closes back to its anchor once a second joins
    }
    for (const p of packed) out.push({ kind, polygon: bridgeRings(p.rings).map(q => ({ x: G.round5(clamp01(q[0])), y: G.round5(clamp01(q[1])) })), areaPx: p.areaPx });
    for (const x of f) failed.push({ kind, ...x });
  }
  const rank = { sea: 0, land: 1, lake: 2 };
  out.sort((p, q) => rank[p.kind] - rank[q.kind] || q.areaPx - p.areaPx);
  const dropped = out.slice(IMPORT.annotationMaxPolygons);
  return { annotations: out.slice(0, IMPORT.annotationMaxPolygons).map(({ kind, polygon }) => ({ kind, polygon })), forced, dropped: [...dropped.map(d => ({ kind: d.kind, areaPx: Math.round(d.areaPx), reason: 'over the polygon limit' })), ...failed.map(d => ({ ...d, reason: 'could not be traced into a valid polygon' }))] };
}

// ---------------------------------------------------------------------------------------------------- the model
/** Carve bays and gulfs out of the seas on the 4-pixel grid; returns the new sea geometries and the bay features. */
export function carveSeas(seas, bays) {
  if (!bays.length) return { geometry: new Map(), bayGeometry: new Map() };
  const owner = new Int32Array(CG.w * CG.h).fill(-1);
  seas.forEach((s, k) => { const t = G.rasterize(s.geometry, CG); for (let c = 0; c < t.length; c++) if (t[c] && owner[c] < 0) owner[c] = k; });
  const touched = new Set(), bayGeometry = new Map();
  bays.forEach((b, j) => {
    const t = G.rasterize(b.geometry, CG);
    const mine = new Uint8Array(t.length);
    for (let c = 0; c < t.length; c++) if (t[c] && owner[c] >= 0) { if (owner[c] < seas.length) touched.add(owner[c]); owner[c] = seas.length + j; mine[c] = 1; }
    bayGeometry.set(b.id, G.vectorize(mine, CG, { tolerances: [1.0, 0.6, 0], minPartPx: 16, minHolePx: 64 }));
  });
  const geometry = new Map();
  for (const k of [...touched].sort((p, q) => p - q)) {
    const mask = new Uint8Array(owner.length);
    for (let c = 0; c < owner.length; c++) if (owner[c] === k) mask[c] = 1;
    geometry.set(seas[k].id, G.vectorize(mask, CG, { tolerances: [1.0, 0.6, 0], minPartPx: 16, minHolePx: 64 }));
  }
  return { geometry, bayGeometry };
}

/**
 * The canon text migration of 24 October 2026 (K29, K31) rewrote these words in the repaired model, former labels
 * included; a former label equal to a design label so rewritten is that design label.
 */
export const MIGRATION_TERMS = Object.freeze([['Ocean of Zol', 'Kusmeel'], ['Ocean of Edvoid', 'Kusmeel'], ['Dead Lands', 'Ember Lands'], ['dead_lands', 'ember_lands'], ['Edvoid', 'Kusven']]);
const migrated = text => MIGRATION_TERMS.reduce((t, [from, to]) => t.replaceAll(from, to), text);

/** The geography model version 1 and the side documents (see the header). */
export function convertModel(model, { coast = null, roster = null, design = null, nameTable = null, surface = null } = {}) {
  // feature_surface.json (import_measures.mjs): points moved onto the drawing's surface, by feature id and end
  const moved = new Map((surface?.features ?? []).map(m => [`${m.id}|${m.end}`, m.to]));
  const placed = (id, end, p) => moved.get(`${id}|${end}`) ?? p;
  const issues = [], held = { terrainAreas: [], zones: [], rivers: [], straits: [], seaIce: [], regionTerrain: [], climate: null, edges: [] };
  const regionIds = new Set(model.regions.filter(r => r.kind === 'region').map(r => r.id));
  const regionOf = key => (regionIds.has(`region_${key}`) ? `region_${key}` : null);
  // seas, with the bays and gulfs of coast_features.json carved out
  const seaKinds = new Map((coast?.seaKinds ?? []).map(e => [e.sea, e.kind]));
  const bays = coast?.bays ?? [];
  const { geometry: carved, bayGeometry } = carveSeas(model.seas, bays);
  const seas = [];
  for (const s of model.seas) {
    const g = carved.get(s.id) ?? s.geometry;
    if (!g) { issues.push({ id: s.id, issue: 'the bays carved out all of its water' }); continue; }
    const tags = [...tagsOf(s), ...(s.kind === 'storm_belt' ? ['storm-belt'] : []), ...(s.kind === 'ocean' ? ['open-sea'] : [])];
    seas.push({ id: s.id, name: s.name, tags, ...opt('note', note(s)), ...areaFields(g, issues, s.id), kind: seaKinds.get(s.id) ?? 'sea' });
    if (s.ice) held.seaIce.push({ id: s.id, ice: s.ice });
  }
  for (const b of bays) {
    const g = bayGeometry.get(b.id);
    if (!g) { issues.push({ id: b.id, issue: 'no water left for the bay' }); continue; }
    seas.push({ id: b.id, name: b.name, tags: [b.nameStatus === 'established' ? 'established' : 'proposed', b.kind === 'bay' ? 'bay' : 'gulf', 'coast-feature'], note: `A ${b.kind} (owner decision K46): ${b.areaPx} px of water behind a mouth of ${b.mouthPx} px, ${b.depthPx} px deep; name from ${b.nameSource}.`, ...areaFields(g, issues, b.id), kind: 'gulf' });
  }
  // lands
  const lands = model.lands.map(l => {
    const regs = (l.regions ?? []).map(regionOf).filter(Boolean);
    return { id: l.id, name: l.name, tags: tagsOf(l), ...opt('note', note(l)), ...areaFields(l.geometry, issues, l.id), kind: l.kind === 'continent' ? 'continent' : 'island', ...(regs.length === 1 ? { region: regs[0] } : {}) };
  });
  // regions (not the zones, which overlap them)
  const regions = [];
  for (const r of model.regions) {
    if (r.kind !== 'region') { held.zones.push({ id: r.id, name: r.name, kind: r.kind }); continue; }
    if (r.terrain) held.regionTerrain.push({ id: r.id, terrain: r.terrain });
    const d = r.density;
    regions.push({ id: r.id, name: r.name, tags: tagsOf(r), ...opt('note', note(r)), ...areaFields(r.geometry, issues, r.id), ...(d ? { density: { provincesPerState: d.provincesPerState, provinceAreaPx: Math.round(Math.min(50000, Math.max(20, d.provinceAreaPx))) } } : {}) });
  }
  // relief
  const ranges = model.ranges.map(r => {
    let c = r.geometry.coordinates.map(pt);
    const closed = c.length > 3 && samePt(c[0], c[c.length - 1]);
    if (closed) c = c.slice(0, -1);
    // a spine joined from drawn pieces can double back over itself; the resolver warns on a crossing path
    else { const u = G.untangleLine(c); if (u.length !== c.length) issues.push({ id: r.id, issue: `spine untangled: ${c.length - u.length} vertices of a loop dropped` }); c = u; }
    return { id: r.id, name: r.name, tags: tagsOf(r), ...opt('note', note(r)), path: schemaPath(c), ...(closed ? { closed: true } : {}), halfWidth: Math.min(0.25, r.halfWidth ?? 0.005), peak: IMPORT.peakByClass[r.peakClass ?? r.elevation] ?? 0.75, ...(r.wall ? { profile: 'massif', barrier: 'impassable' } : {}) };
  });
  const passes = model.passes.map(p => {
    let at = p.geometry.type === 'Point' ? pt(p.geometry.coordinates) : middleOfLine(p.geometry.coordinates);
    const near = model.ranges.map(r => ({ r, d: distanceToGeometry(at[0], at[1], r.geometry) * G.W })).sort((x, y) => x.d - y.d || x.r.id.localeCompare(y.r.id))[0];
    // a pass drawn as a road over a range sits where the road crosses the range's crest, not at the road's middle
    // (map import of 25 October 2026: the Cinder Gate's middle lay on the flank, MAP_PASS_NOT_LOWER)
    if (p.geometry.type === 'LineString' && near && near.d <= IMPORT.passReachPx) {
      const crest = G.densifyLine(p.geometry.coordinates, 2).map(d => d.p).map(q => ({ q, d: distanceToGeometry(q[0], q[1], near.r.geometry) })).sort((x, y) => x.d - y.d)[0];
      if (crest) at = pt(crest.q);
    }
    const range = p.gorge?.range ?? (near && near.d <= IMPORT.passReachPx ? near.r.id : null);
    return { id: p.id, name: p.name, tags: tagsOf(p), ...opt('note', note(p)), ...(range ? { range } : {}), position: at };
  });
  const volcanoes = model.volcanoes.map(v => ({ id: v.id, name: v.name, tags: tagsOf(v), ...opt('note', note(v)), at: pt(placed(v.id, 'at', v.geometry.coordinates)), peak: IMPORT.volcanoPeakByElevation[v.elevation] ?? 0.85, active: v.status === 'active' }));
  // water
  const lakes = model.lakes.map(l => ({ id: l.id, name: l.name, tags: tagsOf(l), ...opt('note', note(l)), ...areaFields(l.geometry, issues, l.id), gameplay: 'lake' }));
  const rivers = [];
  const land = new Uint8Array(CG.w * CG.h), water = new Uint8Array(CG.w * CG.h);
  for (const l of model.lands) G.rasterizeInto(l.geometry, CG, land, 1);
  for (const l of model.lakes) G.rasterizeInto(l.geometry, CG, water, 1);
  for (let c = 0; c < land.length; c++) if (!land[c]) water[c] = 1;
  for (const r of model.rivers) {
    let c = schemaPath(r.geometry.coordinates);
    if (moved.has(`${r.id}|source`)) c = [pt(moved.get(`${r.id}|source`)), ...c.slice(1)];
    if (moved.has(`${r.id}|mouth`)) c = [...c.slice(0, -1), pt(moved.get(`${r.id}|mouth`))];
    if (r.endorheic) { held.rivers.push({ id: r.id, name: r.name, reason: `ends in the ${r.basin ?? 'desert'} basin; the schema needs a mouth in water`, path: c }); continue; }
    // a mouth drawn on the shore of its sea or lake moves onto the nearest water cell (the resolver asks a mouth in water)
    const end = G.cellIndexOf(CG, c[c.length - 1]);
    const onLand = p => model.lands.some(l => pointInGeometry(p[0], p[1], l.geometry)) && !model.lakes.some(l => pointInGeometry(p[0], p[1], l.geometry));
    // a mouth the drawing measure already placed in the drawn water stays there (the import reads the drawing's coast)
    if (end >= 0 && !moved.has(`${r.id}|mouth`) && onLand(c[c.length - 1])) {
      const w = G.nearestCell(CG, end, k => water[k] === 1 && !onLand(G.cellCentre(CG, k % CG.w, Math.floor(k / CG.w))), Math.ceil(IMPORT.mouthReachPx / CG.cell));
      if (w >= 0) { const p = pt(G.cellCentre(CG, w % CG.w, Math.floor(w / CG.w))); issues.push({ id: r.id, issue: `mouth moved ${Math.round(G.distPx(c[c.length - 1], p))} px from the shore into the water` }); c = [...c, p]; }
    }
    // a river that flows through a lake crosses it: its via points inside the lake are not land to the resolver
    const inLake = p => model.lakes.some(l => pointInGeometry(p[0], p[1], l.geometry));
    const through = c.slice(1, -1).filter(inLake).length;
    if (through) { c = [c[0], ...c.slice(1, -1).filter(p => !inLake(p)), c[c.length - 1]]; issues.push({ id: r.id, issue: `${through} via points inside a lake dropped (the river crosses it)` }); }
    let via = c.slice(1, -1);
    for (let tol = 0.5; via.length > IMPORT.maxVia; tol *= 1.5) via = G.simplifyLine(c, tol).slice(1, -1);
    // a river that ends in a lake names the lake as its mouth (a point inside a lake is not water to the resolver)
    const last = c[c.length - 1];
    const lake = model.lakes.find(l => pointInGeometry(last[0], last[1], l.geometry));
    const mouth = lake ? { lake: lake.id } : last;
    rivers.push({ id: r.id, name: r.name, tags: tagsOf(r), ...opt('note', note(r)), source: c[0], mouth, ...(via.length ? { via } : {}), size: IMPORT.riverSizeByWidth[r.width] ?? 3 });
  }
  // straits: the crossings of coast_features.json (decision K46)
  const straits = [];
  for (const x of coast?.crossings ?? []) {
    const s = x.strait ? model.straits.find(f => f.id === x.strait) : null;
    if (x.unresolved || x.sameLand) { held.straits.push({ id: x.id, name: x.name, reason: x.unresolved ?? 'both shores are one land; the schema refuses a strait from a land to itself', ...(x.between ? { between: x.between, lands: x.lands, widthPx: x.widthPx } : {}) }); continue; }
    const [a, b] = x.between;
    const status = s ? (s.established ? 'established' : 'proposed') : 'proposed';
    straits.push({ id: x.id, name: x.name, tags: [status, 'crossing', x.source === 'narrow gap' ? 'narrow-gap' : 'model-strait'], note: `${x.source === 'narrow gap' ? 'A narrow gap found by coast_features.mjs' : 'The crossing of the model strait'} (owner decision K46): ${x.widthPx} px of water between ${x.lands.join(' and ')}.${s?.notes ? ` ${s.notes}` : ''}`.slice(0, IMPORT.noteMax), between: [a, b], rule: 'open', width: Math.min(IMPORT.maxStraitWidth, Math.max(1, x.widthPx) / G.W) });
  }
  // sites, with the roster's capitals
  const capitals = new Map();
  for (const x of roster?.realms ?? []) if (x.capital?.siteId) capitals.set(x.capital.siteId, x);
  const lakeIds = new Set(model.lakes.map(l => l.id));
  const sites = model.sites.map(s => {
    const realm = capitals.get(s.id);
    const kind = realm ? 'capital' : IMPORT.siteKind[s.kind] ?? 'landmark';
    const importance = realm ? (IMPORT.capitalImportance[realm.focusTier] ?? IMPORT.capitalImportance.default) : IMPORT.siteImportance[s.kind] ?? 2;
    return { id: s.id, name: s.name, tags: tagsOf(s), ...opt('note', note(s)), kind, at: pt(placed(s.id, 'at', s.geometry.coordinates)), importance, ...(realm && /^[A-Z][A-Z0-9]{2}$/u.test(realm.tag) ? { country: realm.tag } : {}), ...(s.onWater ? { onWater: true } : {}), ...(s.lake && lakeIds.has(s.lake) ? { lake: s.lake } : {}) };
  });
  const roads = model.roads.map(r => ({ id: r.id, name: r.name, tags: tagsOf(r), ...opt('note', note(r)), path: schemaPath(r.geometry.coordinates), importance: IMPORT.roadImportance }));
  const places = (model.coasts ?? []).map(c => ({ id: c.id, name: c.name, tags: tagsOf(c), ...opt('note', note(c)), kind: IMPORT.placeKind[c.kind] ?? 'other', at: pt(c.geometry.coordinates) }));
  // held back: terrain areas (biomes), climate, edges
  for (const a of ['forests', 'deserts', 'marshes', 'ice', 'plains', 'hills']) for (const f of model[a] ?? []) held.terrainAreas.push({ id: f.id, name: f.name, array: a, kind: f.kind, ...areaFields(f.geometry) });
  held.edges = (model.edges ?? []).map(e => ({ id: e.id, name: e.name, side: e.side, policy: e.policy }));
  const geography = {
    version: 1,
    name: 'Aoaz',
    description: 'The geography of Aoaz for the drawn-map import (ADR 0067): converted by tools/content/geography/convert_for_import.mjs from the repaired model aoaz.repaired.json, with the bays, gulfs and strait crossings of coast_features.json (owner decision K46). Names follow the owner decisions and the realm roster; renamed drawn labels are listed in aoaz.names.json.',
    seas, lands, regions, ranges, passes, volcanoes, rivers, lakes, straits, sites, roads, places,
  };
  // names: every renamed feature with the drawn label it replaces, and every proposed name of the coast features
  // the design model keeps the drawn labels under the identifiers of before the canon text migration (dead_lands)
  const designNames = new Map();
  for (const a of Object.keys(design ?? {})) if (Array.isArray(design[a])) for (const f of design[a]) if (f?.id && f.name) designNames.set(f.id.replaceAll('dead_lands', 'ember_lands'), f.name);
  const tableById = new Map((nameTable?.entries ?? []).map(e => [e.id, e]));
  const names = [];
  for (const a of ['seas', 'lands', 'ranges', 'volcanoes', 'rivers', 'lakes', 'forests', 'deserts', 'marshes', 'ice', 'plains', 'straits', 'passes', 'sites', 'regions', 'roads', 'coasts', 'hills']) for (const f of model[a] ?? []) {
    if (f.renamedBy !== 'name_table') continue;
    const e = tableById.get(f.id);
    const drawn = designNames.get(f.id);
    // the label before the rename; where a later text migration overwrote it with the new name, the design model's
    // label; a generated placeholder ("Island 12 (west_lands)") is no drawn label
    let former = e?.drawnLabel ?? e?.oldName ?? (f.formerLabel !== f.name ? f.formerLabel : drawn ?? null);
    if (drawn && former && former !== drawn && migrated(drawn) === former) former = drawn;
    const placeholder = /^Island \d+ \(/u.test(former ?? '') ? former : null;
    if (placeholder) former = null;
    names.push({ id: f.id, array: a, at: pointOf(f.geometry), name: f.name, formerLabel: former, ...(placeholder ? { placeholder } : {}), ...(drawn && drawn !== former && drawn !== f.name && !/^Island \d+ \(/u.test(drawn) ? { designLabel: drawn } : {}), nameStatus: f.nameStatus ?? 'proposed', ...opt('language', f.nameLanguage), ...opt('meaning', f.nameMeaning), ...opt('reason', e?.reason), ...opt('source', e?.source) });
  }
  for (const b of bays) names.push({ id: b.id, array: 'seas', at: b.at, name: b.name, formerLabel: null, nameStatus: b.nameStatus, reason: `a ${b.kind} of decision K46`, source: b.nameSource });
  for (const x of coast?.crossings ?? []) if (x.source === 'narrow gap' && !x.unresolved) names.push({ id: x.id, array: 'straits', at: pt([(x.between[0][0] + x.between[1][0]) / 2, (x.between[0][1] + x.between[1][1]) / 2]), name: x.name, formerLabel: null, nameStatus: 'proposed', reason: 'a narrow gap of decision K46', source: 'coast_features.mjs' });
  names.sort((p, q) => p.array.localeCompare(q.array) || p.id.localeCompare(q.id));
  return { geography, names, held, issues };
}

/** Land of the converted model inside the import's sea bands (pixels on the 4-pixel grid), per land. */
export function edgeBandLand(geography, edge = IMPORT.edge) {
  const out = [];
  const bx = edge.bandPx / CG.cell, by = edge.polarPx / CG.cell;
  for (const l of geography.lands) {
    const g = { type: 'MultiPolygon', coordinates: l.polygons.map(r => [r]) };
    const t = G.rasterize(g, CG);
    let n = 0;
    for (let c = 0; c < t.length; c++) if (t[c]) { const i = c % CG.w, j = (c - i) / CG.w; if (i < bx || i >= CG.w - bx || j < by || j >= CG.h - by) n++; }
    if (n) out.push({ id: l.id, name: l.name, cells: n, px: n * CG.cell * CG.cell });
  }
  return out;
}

/**
 * What the open-sea bands took from the design model: per design land with land in the bands (the import's 205 px east
 * and west, 64 px north and south), its area in the bands, its whole area, its area in the repaired model and whether
 * the repair moved it out of the band instead of cutting it (repair.moved).
 */
export function edgeRemoval(design, repaired, edge = IMPORT.edge) {
  const bx = edge.bandPx / CG.cell, by = edge.polarPx / CG.cell;
  const inBand = c => { const i = c % CG.w, j = (c - i) / CG.w; return i < bx || i >= CG.w - bx || j < by || j >= CG.h - by; };
  const area = g => { const t = G.rasterize(g, CG); let all = 0, band = 0; for (let c = 0; c < t.length; c++) if (t[c]) { all++; if (inBand(c)) band++; } return { all: all * 16, band: band * 16 }; };
  const moved = new Map((repaired.repair?.moved ?? []).map(m => [m.id, m]));
  const now = new Map(repaired.lands.map(l => [l.id, l]));
  const out = [];
  for (const l of design?.lands ?? []) {
    const a = area(l.geometry);
    if (!a.band) continue;
    const r = now.get(l.id);
    out.push({ id: l.id, designName: l.name, name: r?.name ?? null, designPx: a.all, inBandsPx: a.band, repairedPx: r ? area(r.geometry).all : null, ...(moved.has(l.id) ? { movedBy: moved.get(l.id).vector } : {}) });
  }
  return out.sort((p, q) => q.inBandsPx - p.inBandsPx || p.id.localeCompare(q.id));
}

/** The preview request for hoi4_map_rewrite (create_world with the registered drawing; not run before 4.4.0). */
export function previewCall({ palette = null, annotations = null } = {}) {
  return {
    tool: 'hoi4_map_rewrite',
    arguments: {
      workspaceId: 'zin',
      preview: true,
      operations: [{
        id: 'world',
        kind: 'create_world',
        width: IMPORT.frame.width,
        height: IMPORT.frame.height,
        edge: { mode: IMPORT.edge.mode },
        reference: {
          imagePath: WORKSPACE.drawing,
          sheetsPath: WORKSPACE.sheets,
          mode: 'illustrated',
          ...(palette ? { palette } : {}),
          agreement: { ...IMPORT.agreement },
          ...(annotations ? { annotations } : {}),
        },
        geographyPath: WORKSPACE.geography,
      }],
    },
  };
}

// ---------------------------------------------------------------------------------------------------- command line
const readJson = (p, fallback = null) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : fallback);
const write = (file, value) => { const text = `${JSON.stringify(value, null, 1)}\n`; writeFileSync(file, text); return sha256(text); };
async function main(argv) {
  const args = argv.slice(2);
  const i = args.indexOf('--out');
  const out = i >= 0 ? args[i + 1] : DEFAULT_OUT;
  mkdirSync(out, { recursive: true });
  const inputs = Object.fromEntries(Object.entries(PATHS).filter(([, p]) => existsSync(p)).map(([k, p]) => [k, { path: path.relative(path.join(here, '../../..'), p).replaceAll('\\', '/'), sha256: sha256(readFileSync(p)) }]));
  const model = readJson(PATHS.model);
  const { geography, names, held, issues } = convertModel(model, { coast: readJson(PATHS.coast), roster: readJson(PATHS.roster), design: readJson(PATHS.design), nameTable: readJson(PATHS.names), surface: readJson(PATHS.surface) });
  const sheets = sheetsDocument(model);
  const fixes = readJson(PATHS.fixes);
  const { annotations, dropped } = annotationsFrom(readJson(PATHS.overrides), model, { landFilter: fixes ? surfaceFixesMask(fixes) : null });
  const palette = readJson(PATHS.palette)?.palette ?? null;
  const hashes = {
    'aoaz.geography.json': write(path.join(out, 'aoaz.geography.json'), geography),
    'aoaz.sheets.json': write(path.join(out, 'aoaz.sheets.json'), sheets),
    'aoaz.annotations.json': write(path.join(out, 'aoaz.annotations.json'), { note: 'reference.annotations for the import (world coordinates): the surface overrides of tools/content/geography/surface_overrides.json (open-sea bands, undrawn land, moved lands, the Nether and the approved layout), sea first, then land; inline them in the call until the override file (world-overrides) is released.', annotations }),
    'aoaz.names.json': write(path.join(out, 'aoaz.names.json'), { note: 'Every renamed or proposed name of the converted model with the label it replaces, keyed by a world point, for the `names` of the future override file (world-overrides, step 3 of ADR 0067). formerLabel is the label before the rename table; designLabel the design model\'s name when it differs.', names }),
    'aoaz.held_back.json': write(path.join(out, 'aoaz.held_back.json'), { note: 'Model content the geography schema version 1 or the tool\'s current version cannot take. Terrain areas become `biomes` and region terrain shares and climate return when the climate and biome stage (C8) lands; crossings within one land and endorheic rivers need schema support.', ...held }),
  };
  // the import's own illustrated reading agrees with the model better than nearest-colour matching against the measured
  // palette (drawing_measures.json), so the main call carries no palette and a second call carries it for comparison
  hashes['preview_call.json'] = write(path.join(out, 'preview_call.json'), previewCall({ annotations }));
  if (palette) hashes['preview_call_palette.json'] = write(path.join(out, 'preview_call_palette.json'), previewCall({ palette, annotations }));
  const counts = Object.fromEntries(Object.entries(geography).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, v.length]));
  const report = {
    generatedBy: 'tools/content/geography/convert_for_import.mjs (deterministic; regenerate, do not edit by hand)',
    inputs,
    outputs: hashes,
    counts,
    heldBack: { terrainAreas: held.terrainAreas.length, zones: held.zones.map(z => z.id), rivers: held.rivers.map(r => r.id), straits: held.straits.map(s => `${s.id}: ${s.reason}`), seaIce: held.seaIce.length, regionTerrain: held.regionTerrain.length, edges: held.edges.map(e => e.id) },
    edgeBandLand: edgeBandLand(geography),
    edgeRemoval: edgeRemoval(readJson(PATHS.design), model),
    sheets: sheets.sheets.map(s => ({ id: s.id, order: s.order, clipVertices: s.clip?.length ?? 0 })),
    annotations: { polygons: annotations.length, points: annotations.reduce((n, a) => n + a.polygon.length, 0), dropped },
    palette: palette ? palette.length : 'missing: run import_measures.mjs, then this step again',
    issues,
  };
  write(path.join(out, 'conversion_report.json'), report);
  console.log(`geography v1: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  console.log(`held back: ${held.terrainAreas.length} terrain areas, ${held.zones.length} zones, ${held.rivers.length} rivers, ${held.straits.length} straits`);
  console.log(`sheets: ${sheets.sheets.length}; annotations: ${annotations.length} polygons, ${report.annotations.points} points (${dropped.length} dropped); palette: ${report.palette}`);
  console.log(`land in the edge bands: ${report.edgeBandLand.length ? report.edgeBandLand.map(e => `${e.id} ${e.px} px`).join(', ') : 'none'}`);
  for (const e of issues) console.log(`  issue ${e.id}: ${e.issue}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv).catch(e => { console.error(e); process.exitCode = 1; });
