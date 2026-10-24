// Bays, gulfs and strait crossings of the geography model of Aoaz (owner decision K46 of 24 October 2026).
//
// K46: the map has real bays, gulfs and straits, and wherever two lands are separated by only a narrow stretch of water
// there is a strait crossing (a land-to-land sea adjacency) so armies can cross. This step measures them and writes
// tools/content/data/geography/coast_features.json, which convert_for_import.mjs folds into the geography model the
// drawn-map import reads (ADR 0067). Every rule is deterministic; nothing traced from the drawing is written except
// polygons of the model's own water and points on the model's own land.
//
//   1 surface  the land and sea the import builds from the drawing (each cell read from the sheet that the repair names
//              for it, then the surface overrides), on the checker's 4-pixel grid; without the private drawing the
//              model's land stands in for it (recorded in `surface`);
//   2 bays     a morphological closing of that land with a disc of COAST.bay.closePx (gulfs: COAST.gulf.closePx) fills
//              the water that the coast encloses behind a mouth narrower than twice the radius. Each enclosed body of
//              the model's sea that one land mass bounds (COAST.oneLandShare of its shore) and that is large and deep
//              enough becomes a bay (or a gulf). A body that is most of one model sea marks that sea as a gulf instead;
//              bays take precedence over the gulfs that contain them;
//   3 names    a bay or gulf takes the name of the model's coast point of its kind inside it (`coasts`, kind bay or gulf);
//              otherwise a proposed Common Speech name after the nearest named site on its shore, never established;
//   4 straits  every model strait becomes a crossing: along its course, rays across the water find the narrowest
//              shore-to-shore line, whose ends are land points (a crossing whose shores are one land is recorded with
//              `sameLand`, since the geography schema forbids a strait from a land to itself);
//   5 gaps     every place where two different model lands face each other across sea no wider than
//              COAST.narrowGapPx (calibrated on the vanilla game's crossings, vanilla_crossings.mjs) and no model strait
//              covers becomes a new proposed strait crossing (at most COAST.maxPerPair per pair of lands, spaced).
//
//   node tools/content/geography/coast_features.mjs [--model <repaired.json>] [--overrides <surface_overrides.json>]
//        [--drawing <jpg>] [--no-drawing] [--game <vanilla install>] [--out <coast_features.json>]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as G from './geo_core.mjs';
import { distanceToGeometry, pointInGeometry } from './check_model.mjs';
import { landMask, lakeMask, sheetAuthority, DEFAULT_DRAWING_PATH, DEFAULT_SURFACE_OVERRIDES_PATH } from './repair_model.mjs';
import { measureCrossings, summarise, DEFAULT_GAME } from './vanilla_crossings.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_COAST_FEATURES_PATH = path.join(here, '../data/geography/coast_features.json');
export const CG = Object.freeze({ ox: 0, oy: 0, cell: 4, w: 1280, h: 640 });

/**
 * Thresholds, in pixels of the 5,120 x 2,560 frame.
 *   narrowGapPx  vanilla's sea crossings (map/adjacencies.csv `sea` rows, measured shore to shore on provinces.bmp by
 *                vanilla_crossings.mjs): median 4 px, 90th percentile 13.6, widest 29.8 (Truk to the Hall Islands);
 *                Øresund 2.2, Messina 3.0, the Bosporus 2.8, Kerch 3.0, Tsugaru 4.0, Jeju to Korea 14.3. The threshold is
 *                set just above the widest vanilla crossing, and is a multiple of the 4-pixel analysis grid.
 *   scales       a bay is water behind a mouth of at most 2 x 48 px, 3,000 to 40,000 px in area (3,000 px is about one
 *                coastal sea province of a 5,120-pixel map) and at least 40 px deep; a gulf is water behind a mouth of at
 *                most 2 x 96 or 2 x 144 px, 20,000 (25,000) to 200,000 px and at least 96 px deep. Larger enclosed
 *                water is a sea of its own, not a gulf.
 *   shore        a bay or gulf is bounded by one land mass: at least oneLandShare of its shore against land of at least
 *                shoreLandMinPx (smaller islands inside or at the mouth do not count), so water among islands is no bay.
 *   straits      a model strait's crossing joins the shores STRAIT_SHORES names, within courseReachPx of its course,
 *                (else courseReachFallbackPx, marked farFromCourse), narrowest first with courseWeight px added per pixel
 *                of distance from the course, and never within distinctCrossingPx of a crossing another strait took
 *                between the same lands; a crossing between two coasts of one land must save a walk round by
 *                land of at least max(sameLandDetourPx, sameLandDetourFactor x its width) (not the two sides of a cove).
 *                New gaps are spaced pairSpacingPx apart, at most maxPerPair per pair of lands; gaps up to nearMissPx
 *                that get no crossing are listed for review.
 *   named        a model coast point of kind bay or gulf names the smallest enclosed water within namedMatchPx whose
 *                depth is at least half the depth its scale asks of an unnamed bay.
 *   bandPx       the import's sea bands (max(192, 4% of the width) east and west, 64 px north and south) are open sea:
 *                no bay or gulf lies in them, and water there counts as open sea at a mouth.
 */
export const COAST = Object.freeze({
  narrowGapPx: 32,
  maxPerPair: 3,
  pairSpacingPx: 240,
  courseReachPx: 240,
  courseReachFallbackPx: 400,
  distinctCrossingPx: 64,
  courseWeight: 0.5,
  sameLandDetourPx: 240,
  sameLandDetourFactor: 6,
  sameLandTries: 400,
  nearMissPx: 64,
  straitSearchPx: 900,
  straitRayStepPx: 8,
  straitRays: 24,
  scales: Object.freeze([
    Object.freeze({ kind: 'bay', closePx: 48, minAreaPx: 3000, maxAreaPx: 40000, minDepthPx: 40 }),
    Object.freeze({ kind: 'gulf', closePx: 96, minAreaPx: 20000, maxAreaPx: 200000, minDepthPx: 96 }),
    Object.freeze({ kind: 'gulf', closePx: 144, minAreaPx: 25000, maxAreaPx: 200000, minDepthPx: 96 }),
  ]),
  oneLandShare: 0.7,
  shoreLandMinPx: 40000,
  bandPx: Object.freeze({ x: 205, y: 64 }),
  existingSeaShare: 0.6,
  nameSitePx: 260,
  nameSiteKinds: Object.freeze(['capital', 'region_seat', 'port', 'castle', 'victory_point']),
  namedMatchPx: 120,
  pointInsidePx: 24,
});

// ---------------------------------------------------------------------------------------------------- rasters
/** Squared Euclidean distance (in cells) to the nearest set cell of `mask` (Felzenszwalb and Huttenlocher). */
export function edt2(mask, w, h) {
  const INF = 1e20, f = new Float64Array(Math.max(w, h)), d = new Float64Array(Math.max(w, h)), v = new Int32Array(Math.max(w, h)), z = new Float64Array(Math.max(w, h) + 1);
  const out = new Float64Array(w * h);
  const pass = n => {
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < n; q++) {
      let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) { k--; s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]; }
  };
  for (let x = 0; x < w; x++) { for (let y = 0; y < h; y++) f[y] = mask[y * w + x] ? 0 : INF; pass(h); for (let y = 0; y < h; y++) out[y * w + x] = d[y]; }
  for (let y = 0; y < h; y++) { for (let x = 0; x < w; x++) f[x] = out[y * w + x]; pass(w); for (let x = 0; x < w; x++) out[y * w + x] = d[x]; }
  return out;
}
/** Morphological closing of a mask with a disc of radius `r` cells. */
export function closing(mask, w, h, r) {
  const r2 = r * r, d1 = edt2(mask, w, h);
  const outside = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) outside[i] = d1[i] > r2 ? 1 : 0;
  const d2 = edt2(outside, w, h);
  const out = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) out[i] = d2[i] > r2 ? 1 : 0;
  return out;
}
const nb4 = (c, w, h) => { const i = c % w, j = (c - i) / w; return [i > 0 ? c - 1 : -1, i + 1 < w ? c + 1 : -1, j > 0 ? c - w : -1, j + 1 < h ? c + w : -1]; };
const centre = c => G.cellCentre(CG, c % CG.w, Math.floor(c / CG.w));
const r5 = p => [G.round5(p[0]), G.round5(p[1])];

/** Model land labels (index into model.lands, -1 for none) on the grid. */
export function landLabels(model, grid = CG) {
  const out = new Int32Array(grid.w * grid.h).fill(-1);
  model.lands.forEach((l, k) => { const t = G.rasterize(l.geometry, grid); for (let c = 0; c < t.length; c++) if (t[c]) out[c] = k; });
  return out;
}

/**
 * The land the import builds from the drawing: each cell from the sheet the repair names for it (sheetAuthority), sea
 * where no sheet covers it, then the surface overrides in order. Reads the private working drawing into memory only.
 */
export async function importSurface(model, overrides, jpgPath, grid = CG) {
  const dm = await import('./drawing_mask.mjs');
  const bySheet = await dm.drawingLandBySheet(model, jpgPath, grid);
  const index = new Map(bySheet.sheets.map((sh, k) => [sh.id, k]));
  const { auth, sheets } = sheetAuthority(model, grid);
  const forced = new Uint8Array(grid.w * grid.h).fill(255);
  for (const e of overrides?.surface ?? []) G.rasterizeInto({ type: 'Polygon', coordinates: [e.polygon, ...(e.holes ?? [])] }, grid, forced, e.kind === 'land' ? 1 : 0);
  const land = new Uint8Array(grid.w * grid.h);
  for (let c = 0; c < land.length; c++) {
    const k = auth[c] >= 0 ? index.get(sheets[auth[c]].id) : -1;
    const raw = k >= 0 ? bySheet.masks[k][c] === 1 : false;
    land[c] = (forced[c] === 255 ? raw : forced[c] === 1) ? 1 : 0;
  }
  return land;
}

// ---------------------------------------------------------------------------------------------------- bays and gulfs
/** Enclosed water bodies of one closing radius: components of the closed land's extra cells that lie in model sea. */
function enclosedBodies(surfaceLand, sea, labels, rCells, open = sea) {
  const { w, h } = CG;
  const closed = closing(surfaceLand, w, h, rCells);
  const body = new Uint8Array(sea.length);
  // the body is the model's own sea that the closed drawing encloses: its shore is the model's coast, never a coast
  // traced from the drawing, and only the smoothed mouth comes from the closing
  for (let c = 0; c < sea.length; c++) body[c] = closed[c] && sea[c] ? 1 : 0;
  const { labels: comp, sizes } = G.labelComponents(body, CG);
  const out = sizes.map(() => ({ cells: [], shore: new Map(), mouth: [] }));
  for (let c = 0; c < comp.length; c++) {
    const k = comp[c];
    if (k < 0) continue;
    out[k].cells.push(c);
    for (const n of nb4(c, w, h)) {
      if (n < 0) continue;
      if (labels[n] >= 0) out[k].shore.set(labels[n], (out[k].shore.get(labels[n]) ?? 0) + 1);
      else if (open[n] && comp[n] !== k) out[k].mouth.push(c);
    }
  }
  return { comp, bodies: out };
}
/** Depth in pixels: the farthest cell of a body from its mouth, by steps through the body. */
function depthPx(body, comp, k) {
  const { w, h } = CG;
  const dist = new Map(body.mouth.map(c => [c, 0]));
  let frontier = [...new Set(body.mouth)], step = 0, deepest = 0;
  while (frontier.length) {
    step++;
    const next = [];
    for (const c of frontier) for (const n of nb4(c, w, h)) if (n >= 0 && comp[n] === k && !dist.has(n)) { dist.set(n, step); next.push(n); deepest = step; }
    frontier = next;
  }
  return deepest * CG.cell;
}
const mouthWidthPx = body => {
  const pts = [...new Set(body.mouth)].map(c => [c % CG.w, Math.floor(c / CG.w)]);
  let best = 0;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) best = Math.max(best, Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]));
  return Math.round(best * CG.cell);
};

/** The bays and gulfs of a model (see the header). */
export function findBays(model, surfaceLand, opts = COAST) {
  const labels = landLabels(model), lake = lakeMask(model, CG), land = landMask(model, CG);
  const sea = new Uint8Array(land.length);
  for (let c = 0; c < sea.length; c++) sea[c] = !land[c] && !lake[c] ? 1 : 0;
  const seaOf = new Int32Array(land.length).fill(-1);
  model.seas.forEach((s, k) => { const t = G.rasterize(s.geometry, CG); for (let c = 0; c < t.length; c++) if (t[c] && sea[c]) seaOf[c] = k; });
  const seaArea = new Map();
  for (let c = 0; c < seaOf.length; c++) if (seaOf[c] >= 0) seaArea.set(seaOf[c], (seaArea.get(seaOf[c]) ?? 0) + 1);
  // the import's sea bands are open sea: no body there, and band water is open water at a mouth
  const bx = opts.bandPx.x / CG.cell, by = opts.bandPx.y / CG.cell;
  const inner = new Uint8Array(sea.length);
  for (let c = 0; c < sea.length; c++) { const i = c % CG.w, j = (c - i) / CG.w; inner[c] = sea[c] && i >= bx && i < CG.w - bx && j >= by && j < CG.h - by ? 1 : 0; }
  const shoreLand = new Set(model.lands.map((l, k) => [l, k]).filter(([l]) => G.geometryAreaPx(l.geometry) >= opts.shoreLandMinPx).map(([, k]) => k));
  const found = [];
  opts.scales.forEach((o, scale) => {
    const { comp, bodies } = enclosedBodies(surfaceLand, inner, labels, Math.round(o.closePx / CG.cell), sea);
    bodies.forEach((b, k) => {
      const areaPx = b.cells.length * CG.cell * CG.cell;
      if (areaPx < o.minAreaPx || areaPx > o.maxAreaPx || !b.mouth.length) return;
      const shore = [...b.shore].filter(([l]) => shoreLand.has(l)).sort((p, q) => q[1] - p[1] || p[0] - q[0]);
      const total = shore.reduce((s, [, n]) => s + n, 0);
      const depth = depthPx(b, comp, k);
      const bySea = new Map();
      for (const c of b.cells) if (seaOf[c] >= 0) bySea.set(seaOf[c], (bySea.get(seaOf[c]) ?? 0) + 1);
      const seas = [...bySea].sort((p, q) => q[1] - p[1] || p[0] - q[0]);
      // strict: bounded by one land mass and deep enough to be a bay or gulf by shape alone
      const strict = total > 0 && shore[0][1] / total >= opts.oneLandShare && depth >= o.minDepthPx;
      found.push({ kind: o.kind, scale, strict, cells: b.cells, areaPx, depthPx: depth, mouthPx: mouthWidthPx(b), land: total ? model.lands[shore[0][0]].id : null, seas: seas.map(([s, n]) => ({ id: model.seas[s].id, share: n / b.cells.length, ofSea: n / seaArea.get(s) })) });
    });
  });
  return found.sort((p, q) => p.areaPx - q.areaPx || p.scale - q.scale || p.cells[0] - q.cells[0]);
}

const bodyCentre = cells => {
  const mid = cells.reduce((s, c) => { const p = centre(c); return [s[0] + p[0] / cells.length, s[1] + p[1] / cells.length]; }, [0, 0]);
  // the body cell nearest its centroid, so the point lies in its water
  return r5(centre(cells.reduce((best, c) => { const p = centre(c); const d = Math.hypot((p[0] - mid[0]) * G.W, (p[1] - mid[1]) * G.H); return d < best.d ? { c, d } : best; }, { c: cells[0], d: Infinity }).c));
};
const nearestCellPx = (cells, p) => cells.reduce((best, c) => Math.min(best, G.distPx(centre(c), p)), Infinity);
const slugOf = name => name.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/^the /u, '').replace(/[^a-z0-9]+/gu, '_').replace(/^_|_$/gu, '');

/**
 * Choose and name the bays and gulfs among the enclosed bodies:
 *   1 every model coast point of kind bay or gulf names the smallest body within namedMatchPx of it (any body in the
 *     size range of its scale, even one that is not strict: the owner drew and named that bay), taking the point's name,
 *     kind and status; a named point with no body near it stays a named place only (listed in `namedWithoutWater`);
 *   2 a strict body that is most of one model sea marks that sea as a gulf instead;
 *   3 every other strict body becomes a bay or gulf with a proposed name after the nearest named site on its shore
 *     (Common Speech "Bay of" or "Gulf of"), or after its region when no site is near;
 * smaller bodies win the cells of larger ones that contain them; a body that keeps under half its cells is the same
 * water found at another scale and is dropped.
 */
export function selectBays(model, found, opts = COAST) {
  const owner = new Int32Array(CG.w * CG.h).fill(-1);
  const kept = [], seaKinds = [], namedWithoutWater = [];
  const used = new Set([...model.seas, ...model.straits, ...(model.coasts ?? [])].map(f => f.name.toLowerCase()));
  const claim = (f, extra) => {
    if (f.cells.filter(c => owner[c] >= 0).length > f.cells.length / 2) return false;
    const cells = f.cells.filter(c => owner[c] < 0);
    if (cells.length * CG.cell * CG.cell < opts.scales[f.scale].minAreaPx) return false;
    for (const c of cells) owner[c] = kept.length;
    kept.push({ ...f, cells, at: bodyCentre(cells), ...extra });
    return true;
  };
  // 1 named points
  const points = (model.coasts ?? []).filter(c => c.kind === 'bay' || c.kind === 'gulf').sort((p, q) => p.id.localeCompare(q.id));
  for (const p of points) {
    const at = p.geometry.coordinates;
    const near = found.filter(f => f.depthPx >= opts.scales[f.scale].minDepthPx / 2).map(f => ({ f, d: nearestCellPx(f.cells, at) })).filter(x => x.d <= opts.namedMatchPx)
      .sort((x, y) => x.f.areaPx - y.f.areaPx || x.d - y.d || x.f.scale - y.f.scale);
    const ok = near.some(({ f }) => claim(f, { kind: p.kind, id: `sea_${p.id}`, name: p.name, nameStatus: p.established ? 'established' : 'proposed', nameSource: `model coast point ${p.id}${p.established ? '' : ' (proposed in the model)'}` }));
    if (!ok) namedWithoutWater.push({ id: p.id, name: p.name, kind: p.kind, at, reason: near.length ? 'its water is already part of another named bay' : `no enclosed water within ${opts.namedMatchPx} px (the point lies ${p.geometry && labelsAtLand(model, at) ? 'on land' : 'in open water'})` });
  }
  // 2 and 3 strict bodies
  for (const f of found.filter(x => x.strict)) {
    const whole = f.seas.find(s => s.ofSea >= opts.existingSeaShare && s.share >= opts.existingSeaShare);
    if (whole) { if (!seaKinds.some(e => e.sea === whole.id)) seaKinds.push({ sea: whole.id, kind: 'gulf', areaPx: f.areaPx, reason: `${Math.round(100 * whole.ofSea)}% of the sea lies behind a coast mouth of ${f.mouthPx} px` }); continue; }
    const at = bodyCentre(f.cells);
    // a bay is named after a town on its shore (a capital, a seat, a port or a castle), not after a ford or a shrine
    const sites = model.sites.filter(s => !s.onWater && opts.nameSiteKinds.includes(s.kind)).map(s => ({ s, d: G.distPx(s.geometry.coordinates, at) })).sort((x, y) => x.d - y.d || x.s.id.localeCompare(y.s.id));
    const word = f.kind === 'gulf' ? 'Gulf' : 'Bay';
    let name = null, source = null;
    for (const { s, d } of sites) {
      if (d > opts.nameSitePx) break;
      const cand = `${word} of ${s.name.replace(/^The\s+/u, 'the ')}`;
      if (!used.has(cand.toLowerCase())) { name = cand; source = `nearest shore site ${s.id} (${Math.round(d)} px)`; break; }
    }
    if (!name) {
      const region = model.regions.filter(r => r.kind === 'region').find(r => pointInGeometry(at[0], at[1], r.geometry)) ?? model.regions.filter(r => r.kind === 'region').map(r => ({ r, d: distanceToGeometry(at[0], at[1], r.geometry) })).sort((x, y) => x.d - y.d)[0]?.r;
      const base = `the ${(region?.name ?? 'Coast').replace(/^The\s+/u, '')}`;
      for (const suffix of ['', ' East', ' West', ' North', ' South']) { const cand = `${word} of ${base}${suffix}`; if (!used.has(cand.toLowerCase())) { name = cand; source = `its region ${region?.id}`; break; } }
    }
    if (!name || !claim(f, { id: `sea_${f.kind}_${slugOf(name)}`.slice(0, 64), name, nameStatus: 'proposed', nameSource: source })) continue;
    used.add(name.toLowerCase());
  }
  return { bays: kept, seaKinds: seaKinds.sort((p, q) => p.sea.localeCompare(q.sea)), namedWithoutWater, owner };
}
const labelsAtLand = (model, p) => model.lands.some(l => pointInGeometry(p[0], p[1], l.geometry));

// ---------------------------------------------------------------------------------------------------- crossings
/** Nearest land source of every sea cell (multi-source Dijkstra on 8 neighbours with exact distances to the source). */
export function nearestShore(labels, sea, w, h) {
  const src = new Int32Array(w * h).fill(-1), dist = new Float64Array(w * h).fill(Infinity);
  const heap = []; // binary heap of [d, cell]
  const push = (d, c) => { heap.push([d, c]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] < heap[i][0] || (heap[p][0] === heap[i][0] && heap[p][1] <= heap[i][1])) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; const lt = (a, b) => heap[a][0] < heap[b][0] || (heap[a][0] === heap[b][0] && heap[a][1] < heap[b][1]); if (l < heap.length && lt(l, m)) m = l; if (r < heap.length && lt(r, m)) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
  for (let c = 0; c < labels.length; c++) if (labels[c] >= 0) {
    const i = c % w, j = (c - i) / w;
    let coast = false;
    for (let dj = -1; dj <= 1 && !coast; dj++) for (let di = -1; di <= 1; di++) { const x = i + di, y = j + dj; if (x >= 0 && y >= 0 && x < w && y < h && sea[y * w + x]) { coast = true; break; } }
    if (coast) { src[c] = c; dist[c] = 0; push(0, c); }
  }
  while (heap.length) {
    const [d, c] = pop();
    if (d > dist[c]) continue;
    const i = c % w, j = (c - i) / w, s = src[c], si = s % w, sj = (s - si) / w;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue;
      const x = i + di, y = j + dj;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const n = y * w + x;
      if (!sea[n]) continue;
      const nd = Math.hypot(x - si, y - sj);
      if (nd < dist[n] - 1e-9 || (Math.abs(nd - dist[n]) <= 1e-9 && s < src[n])) { dist[n] = nd; src[n] = s; push(nd, n); }
    }
  }
  return { src, dist };
}

/** Candidate crossings between two different lands: adjacent sea cells whose nearest shores belong to different lands. */
export function gapCandidates(labels, sea, maxPx = COAST.straitSearchPx) {
  const { w, h } = CG;
  const { src } = nearestShore(labels, sea, w, h);
  const best = new Map(); // key "a|b|cellA|cellB" -> candidate (unique shore pairs)
  for (let c = 0; c < src.length; c++) {
    if (src[c] < 0 || !sea[c]) continue;
    for (const n of [c + 1, c + w]) {
      if (n >= src.length || (n === c + 1 && (c + 1) % w === 0) || src[n] < 0 || !sea[n]) continue;
      const a = labels[src[c]], b = labels[src[n]];
      if (a === b) continue;
      const [sa, sb] = a < b ? [src[c], src[n]] : [src[n], src[c]];
      const pa = centre(sa), pb = centre(sb);
      const widthPx = Math.hypot((pa[0] - pb[0]) * G.W, (pa[1] - pb[1]) * G.H);
      if (widthPx > maxPx) continue;
      const key = `${Math.min(a, b)}|${Math.max(a, b)}|${sa}|${sb}`;
      if (!best.has(key)) best.set(key, { a: Math.min(a, b), b: Math.max(a, b), sa, sb, pa, pb, widthPx });
    }
  }
  return [...best.values()].sort((p, q) => p.widthPx - q.widthPx || p.a - q.a || p.b - q.b || p.sa - q.sa || p.sb - q.sb);
}

/**
 * The shores each model strait joins, as model land ids (its `joins` names the shores in words, from before the
 * repair moved coasts and merged islands; this table reads them against the repaired lands). Two lists: the strait
 * crosses from any land of the first to any land of the second. One land on both sides is a crossing between two
 * coasts of the same land.
 */
export const STRAIT_SHORES = Object.freeze({
  strait_coldor_channel: { sides: [['land_western_mainland'], ['land_western_mainland']], note: 'the Coldor coast and the Yeti Lands shelf are both the Western Mainland' },
  strait_narrow: { sides: [['land_isle_of_the_north_lands'], ['land_central_mainland']], note: 'R\'en on the North Lands isle; the Organ cape and the Bloody Forest on the Central Mainland' },
  strait_leren_mouth: { sides: [['land_isle_of_the_north_lands'], ['land_central_mainland']], note: 'the North Lands isle and the Middle Lands' },
  strait_dark_north: { sides: [['land_dondor_arm'], ['land_isle_of_the_north_lands']], note: 'Dondor on the Dondor Arm; Lerendor on the North Lands isle' },
  strait_dark_south: { sides: [['land_goldoroth_arm', 'land_dondor_arm'], ['land_central_mainland']], note: 'Goldoroth and the Nothingness on the Dark Lands arms; the Hiloff coast on the Central Mainland' },
  strait_mirolon: { sides: [['land_central_mainland'], ['land_ember_lands_island']], note: 'the Mirolon peninsula on the Central Mainland; the Ember Lands on the Ember Isle' },
  strait_rift_narrows: { sides: [['land_central_mainland'], ['land_eastern_mainland']], note: 'the Mushroom Forest of the Magical Lands; Delbiz of the East Lands' },
  strait_rift_north: { sides: [['land_central_mainland'], ['land_eastern_mainland', 'land_island_004']], note: 'the Magical Lands; the East Lands and their isle Amkerezia' },
  strait_corogon: { sides: [['land_western_mainland'], ['land_island_002']], note: 'Corogon on the Western Mainland; Varnondor' },
  strait_aenor_isle: { sides: [['land_aenor_isle'], ['land_central_mainland']], note: 'Aenor Isle and the Middle Lands' },
  strait_cold_neck_ice: { sides: [['land_island_006'], ['land_island_014', 'land_island_009']], note: 'the drawn Pollos and Benan are one island in the model (Benan); the passage the course follows lies between Adel and the islands south of it' },
  strait_dondor_goldoroth: { sides: [['land_dondor_arm'], ['land_goldoroth_arm']], note: 'the two arms of the Dark Lands' },
  strait_mirolon_neck: { sides: [['land_central_mainland'], ['land_central_mainland']], note: 'Mirolon and the Zilin Hills are both the Central Mainland (the drawn land bridge)' },
  strait_nether_sound: { sides: [['land_ember_lands_island'], ['land_nether_island']], note: 'the Ember Isle and the Nether' },
  strait_ember_narrows: { sides: [['land_nether_island'], ['land_eastern_mainland']], note: 'the Nether and the South Lands of the Eastern Mainland' },
});

/** True when the land path between two cells of land `k` is at least `minPx` long (4-neighbour steps over that land). */
export function landDetourAtLeast(labels, k, from, to, minPx) {
  const limit = Math.ceil(minPx / CG.cell);
  const seen = new Map([[from, 0]]);
  let frontier = [from];
  for (let step = 1; step <= limit && frontier.length; step++) {
    const next = [];
    for (const c of frontier) for (const n of nb4(c, CG.w, CG.h)) {
      if (n < 0 || labels[n] !== k || seen.has(n)) continue;
      if (n === to) return false;
      seen.set(n, step); next.push(n);
    }
    frontier = next;
  }
  return true;
}

/**
 * Crossings between two coasts of one land near a course, narrowest (plus courseWeight times the distance to the course)
 * first: rays across the water from sea points within courseReachPx of the course. A crossing counts only when walking
 * round by land between its ends is at least max(sameLandDetourPx, sameLandDetourFactor x its width): two coasts of one
 * land, not the two sides of a cove.
 */
export function sameLandCrossing(strait, k, labels, sea, opts = COAST) {
  const course = strait.geometry.coordinates;
  const step = CG.cell / G.W;
  const march = (p, dir) => {
    for (let t = step; t * G.W <= opts.straitSearchPx; t += step) {
      const c = G.cellIndexOf(CG, [p[0] + dir[0] * t, p[1] + dir[1] * t * (G.W / G.H)]);
      if (c < 0) return null;
      if (labels[c] >= 0) return { c, t };
      if (!sea[c]) return null;
    }
    return null;
  };
  const starts = new Set();
  const reach = Math.round(opts.courseReachPx / CG.cell);
  for (const p of G.densifyLine(course, opts.straitRayStepPx).map(e => e.p)) {
    const c0 = G.cellIndexOf(CG, p);
    if (c0 < 0) continue;
    const i0 = c0 % CG.w, j0 = (c0 - i0) / CG.w;
    for (let dj = -reach; dj <= reach; dj += 2) for (let di = -reach; di <= reach; di += 2) {
      const i = i0 + di, j = j0 + dj;
      if (i < 0 || j < 0 || i >= CG.w || j >= CG.h || di * di + dj * dj > reach * reach) continue;
      if (sea[j * CG.w + i]) starts.add(j * CG.w + i);
    }
  }
  const found = new Map();
  for (const c of [...starts].sort((p, q) => p - q)) {
    const p = centre(c);
    for (let r = 0; r < opts.straitRays; r++) {
      const ang = (Math.PI * r) / opts.straitRays, dir = [Math.cos(ang), Math.sin(ang)];
      const A = march(p, dir), B = march(p, [-dir[0], -dir[1]]);
      if (!A || !B || labels[A.c] !== k || labels[B.c] !== k) continue;
      const [ca, cb] = A.c < B.c ? [A.c, B.c] : [B.c, A.c];
      const widthPx = Math.max(CG.cell, G.distPx(centre(ca), centre(cb)));
      const key = `${ca}|${cb}`;
      if (!found.has(key)) found.set(key, { widthPx, ca, cb });
    }
  }
  const scored = [...found.values()].map(x => ({ ...x, pa: centre(x.ca), pb: centre(x.cb) }))
    .map(x => ({ ...x, score: x.widthPx + opts.courseWeight * distanceToGeometry((x.pa[0] + x.pb[0]) / 2, (x.pa[1] + x.pb[1]) / 2, strait.geometry) * G.W }))
    .sort((p, q) => p.score - q.score || p.ca - q.ca || p.cb - q.cb);
  for (const x of scored.slice(0, opts.sameLandTries)) {
    if (landDetourAtLeast(labels, k, x.ca, x.cb, Math.max(opts.sameLandDetourPx, opts.sameLandDetourFactor * x.widthPx))) return { widthPx: x.widthPx, a: k, b: k, pa: x.pa, pb: x.pb };
  }
  return null;
}

/** Every model strait's crossing, then the narrow gaps no crossing covers (see the header). */
export function findCrossings(model, opts = COAST, shores = STRAIT_SHORES) {
  const labels = landLabels(model), lake = lakeMask(model, CG);
  const sea = new Uint8Array(labels.length);
  for (let c = 0; c < sea.length; c++) sea[c] = labels[c] < 0 && !lake[c] ? 1 : 0;
  const landId = k => model.lands[k].id;
  const index = new Map(model.lands.map((l, k) => [l.id, k]));
  const all = gapCandidates(labels, sea, opts.straitSearchPx);
  const midOf = c => [(c.between[0][0] + c.between[1][0]) / 2, (c.between[0][1] + c.between[1][1]) / 2];
  const crossings = [];
  for (const s of model.straits) {
    const sh = shores[s.id];
    const base = { id: s.id, name: s.name, strait: s.id, source: 'model strait', ...(sh ? { shores: sh.note } : {}) };
    if (!sh) { crossings.push({ ...base, unresolved: 'its shores are not in STRAIT_SHORES' }); continue; }
    const [A, B] = sh.sides.map(list => new Set(list.map(id => index.get(id)).filter(k => k !== undefined)));
    let x = null;
    if (A.size === 1 && B.size === 1 && [...A][0] === [...B][0]) {
      x = sameLandCrossing(s, [...A][0], labels, sea, opts);
      if (x) x.sameLand = true;
    } else {
      // the narrowest crossing between the two shores near the course, not one another strait already took
      const taken = g => crossings.some(c => c.between && new Set(c.lands).has(landId(g.a)) && new Set(c.lands).has(landId(g.b)) && G.distPx(midOf(c), [(g.pa[0] + g.pb[0]) / 2, (g.pa[1] + g.pb[1]) / 2]) < opts.distinctCrossingPx);
      const pair = all.filter(g => (A.has(g.a) && B.has(g.b)) || (A.has(g.b) && B.has(g.a)))
        .map(g => ({ g, d: distanceToGeometry((g.pa[0] + g.pb[0]) / 2, (g.pa[1] + g.pb[1]) / 2, s.geometry) * G.W }));
      for (const reach of [opts.courseReachPx, opts.courseReachFallbackPx]) {
        x = pair.filter(({ d }) => d <= reach)
          .map(({ g, d }) => ({ g, score: g.widthPx + opts.courseWeight * d }))
          .sort((p, q) => p.score - q.score || p.g.sa - q.g.sa || p.g.sb - q.g.sb)
          .find(({ g }) => !taken(g))?.g ?? null;
        if (x) { if (reach !== opts.courseReachPx) x = { ...x, farFromCourse: true }; break; }
      }
    }
    if (!x) { crossings.push({ ...base, unresolved: `no water between its shores within ${opts.courseReachFallbackPx} px of its course` }); continue; }
    crossings.push({ ...base, lands: [landId(x.a), landId(x.b)], between: [r5(x.pa), r5(x.pb)], widthPx: Math.round(x.widthPx), ...(x.sameLand ? { sameLand: true } : {}), ...(x.farFromCourse ? { farFromCourse: true } : {}) });
  }
  // a narrow gap is covered by a crossing between the same two lands nearby
  const covered = (g, mid) => crossings.some(c => c.between && !c.sameLand && new Set(c.lands).has(landId(g.a)) && new Set(c.lands).has(landId(g.b)) && G.distPx(mid, midOf(c)) <= opts.pairSpacingPx);
  const perPair = new Map();
  const gaps = [], nearMisses = [];
  for (const g of all) {
    if (g.widthPx > opts.nearMissPx) break;
    const mid = [(g.pa[0] + g.pb[0]) / 2, (g.pa[1] + g.pb[1]) / 2];
    if (covered(g, mid)) continue;
    const key = `${g.a}|${g.b}`, list = perPair.get(key) ?? [];
    if (list.length >= opts.maxPerPair || list.some(o => G.distPx(o.mid, mid) < opts.pairSpacingPx)) continue;
    list.push({ ...g, mid }); perPair.set(key, list);
    if (g.widthPx <= opts.narrowGapPx) gaps.push({ ...g, mid });
    else nearMisses.push({ lands: [landId(g.a), landId(g.b)], widthPx: Math.round(g.widthPx), between: [r5(g.pa), r5(g.pb)] });
  }
  // names: "<island> Sound" when one shore is an island, else "<nearest site> Narrows"; proposed, unique
  const used = new Set([...model.straits, ...model.seas].map(f => f.name.toLowerCase()));
  for (const g of gaps.sort((p, q) => p.mid[1] - q.mid[1] || p.mid[0] - q.mid[0])) {
    const la = model.lands[g.a], lb = model.lands[g.b];
    const island = [la, lb].filter(l => l.kind === 'island').sort((p, q) => (p.areaPx ?? 0) - (q.areaPx ?? 0))[0];
    const site = model.sites.filter(s => !s.onWater).map(s => ({ s, d: G.distPx(s.geometry.coordinates, g.mid) })).sort((p, q) => p.d - q.d || p.s.id.localeCompare(q.s.id))[0];
    const stems = [island ? `${island.name.replace(/^The\s+/u, '')} Sound` : null, site ? `${site.s.name.replace(/^The\s+/u, '')} Narrows` : null, `${la.name.replace(/^The\s+/u, '')} Narrows`];
    let name = null;
    for (const stem of stems.filter(Boolean)) for (let n = 1; n <= 4 && !name; n++) { const cand = `The ${stem}${n > 1 ? ` ${['', '', 'North', 'South', 'East'][n]}` : ''}`; if (!used.has(cand.toLowerCase())) name = cand; }
    used.add(name.toLowerCase());
    const slug = name.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/^the /u, '').replace(/[^a-z0-9]+/gu, '_').replace(/^_|_$/gu, '');
    crossings.push({ id: `strait_gap_${slug}`.slice(0, 64), name, strait: null, source: 'narrow gap', nameStatus: 'proposed', lands: [landId(g.a), landId(g.b)], between: [r5(g.pa), r5(g.pb)], widthPx: Math.round(g.widthPx) });
  }
  return { crossings, nearMisses };
}

// ---------------------------------------------------------------------------------------------------- document
export function coastFeaturesDocument(model, { bays, seaKinds, namedWithoutWater = [], crossings, nearMisses = [], surface, vanilla }) {
  const toGeom = b => { const mask = new Uint8Array(CG.w * CG.h); for (const c of b.cells) mask[c] = 1; return G.vectorize(mask, CG, { tolerances: [1.0, 0.6, 0], minPartPx: 16, minHolePx: 64 }); };
  return {
    schemaVersion: 1,
    name: 'Aoaz coast features: bays, gulfs and strait crossings (owner decision K46)',
    generatedBy: 'tools/content/geography/coast_features.mjs (deterministic from the repaired model, the surface overrides and the private working drawing; regenerate, do not edit by hand)',
    appliedBy: 'tools/content/geography/convert_for_import.mjs: bays and gulfs become seas of kind gulf carved out of their seas, with a place of their kind; crossings become the straits of the geography model',
    surface,
    constants: COAST,
    vanilla,
    seaKinds,
    namedWithoutWater,
    bays: bays.map(b => ({ id: b.id, name: b.name, nameStatus: b.nameStatus, nameSource: b.nameSource, kind: b.kind, land: b.land, seas: b.seas.map(s => ({ id: s.id, share: Math.round(s.share * 1000) / 1000 })), areaPx: b.cells.length * CG.cell * CG.cell, mouthPx: b.mouthPx, depthPx: b.depthPx, at: b.at, geometry: toGeom(b) })).filter(b => b.geometry),
    crossings,
    nearMisses,
  };
}

async function main(argv) {
  const args = argv.slice(2);
  const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const model = JSON.parse(readFileSync(opt('--model') ?? path.join(here, '../data/geography/aoaz.repaired.json'), 'utf8'));
  const overrides = JSON.parse(readFileSync(opt('--overrides') ?? DEFAULT_SURFACE_OVERRIDES_PATH, 'utf8'));
  const jpg = opt('--drawing') ?? DEFAULT_DRAWING_PATH;
  let surfaceLand, surface;
  if (!args.includes('--no-drawing') && existsSync(jpg)) { surfaceLand = await importSurface(model, overrides, jpg); surface = 'the drawing as the import builds it (registered sheets, then the surface overrides)'; }
  else { surfaceLand = landMask(model, CG); surface = 'the model\'s land (the private drawing was not read)'; }
  const game = opt('--game') ?? DEFAULT_GAME;
  const vanilla = existsSync(path.join(game, 'map', 'adjacencies.csv')) ? summarise(measureCrossings(game)) : null;
  const { bays: named, seaKinds, namedWithoutWater } = selectBays(model, findBays(model, surfaceLand));
  const { crossings, nearMisses } = findCrossings(model);
  const doc = coastFeaturesDocument(model, { bays: named, seaKinds, namedWithoutWater, crossings, nearMisses, surface, vanilla });
  const out = opt('--out') ?? DEFAULT_COAST_FEATURES_PATH;
  writeFileSync(out, `${JSON.stringify(doc, null, 1)}\n`);
  console.log(`surface: ${surface}`);
  console.log(`bays and gulfs: ${doc.bays.length} (${doc.bays.filter(b => b.nameStatus !== 'proposed').length} with an established name); seas that are gulfs: ${seaKinds.length}`);
  for (const b of doc.bays) console.log(`  ${b.kind.padEnd(4)} ${b.name.padEnd(30)} ${b.nameStatus.padEnd(11)} area ${b.areaPx} px, mouth ${b.mouthPx} px, depth ${b.depthPx} px, at ${b.at.map(v => v.toFixed(3)).join(', ')} (${b.land}; ${b.nameSource})`);
  for (const p of namedWithoutWater) console.log(`  named ${p.kind} ${p.name} has no water of its own: ${p.reason}`);
  for (const s of seaKinds) console.log(`  sea ${s.sea} is a gulf: ${s.reason}`);
  console.log(`crossings: ${crossings.filter(c => c.source === 'model strait').length} model straits, ${crossings.filter(c => c.source === 'narrow gap').length} narrow gaps`);
  for (const c of crossings) console.log(`  ${c.source.padEnd(12)} ${c.name.padEnd(28)} ${c.unresolved ?? `${c.widthPx} px ${c.lands.join(' / ')}${c.sameLand ? ' (ONE LAND)' : ''} at ${c.between.map(p => p.map(v => v.toFixed(3)).join(',')).join(' - ')}`}`);
  console.log(`near misses (${COAST.narrowGapPx} to ${COAST.nearMissPx} px, no crossing): ${nearMisses.length}`);
  for (const g of nearMisses) console.log(`  ${g.widthPx} px ${g.lands.join(' / ')} at ${g.between.map(p => p.map(v => v.toFixed(3)).join(',')).join(' - ')}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv).catch(e => { console.error(e); process.exitCode = 1; });
