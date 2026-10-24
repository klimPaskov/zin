// Geometry core of the geography repair (tools/content/geography/repair_model.mjs).
//
// Pure, deterministic helpers on the model's dialect (normalised 0..1 coordinates in the 5,120 x 2,560 game frame):
//   - seeded value noise and fractal noise (no Math.random, no clock), and the four natural edge coasts built from it;
//   - an exact cut of a polygon (with holes) along one of those coasts, keeping every drawn vertex on the kept side;
//   - rasters on pixel grids, marching squares back to rings, topology-checked Douglas-Peucker simplification;
//   - geometry validation with the same primitives as the checker (tools/content/geography/check_model.mjs).
// Nothing here reads or writes files.
import { ringsOf, ringArea, pointInRing, ringSelfIntersections, ringsInteract } from './check_model.mjs';

export const W = 5120;
export const H = 2560;
const EPS = 1e-12;

// ---------------------------------------------------------------------------------------------------- noise
/** FNV-1a hash of a string to an unsigned 32-bit seed. */
export function hashString(s) {
  let h = 0x811c9dc5;
  for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
/** A hash of (seed, integer) to [0, 1). */
export function hash01(seed, i) {
  let h = (seed ^ Math.imul(i | 0, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function valueNoise1(seed, t) {
  const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f);
  return hash01(seed, i) * (1 - u) + hash01(seed, i + 1) * u;
}
/** Fractal (fBm) value noise in [0, 1], seeded by a string such as a feature id. */
export function fbm1(seedText, t, octaves = 6) {
  const seed = hashString(seedText);
  let sum = 0, norm = 0, amp = 1, freq = 1;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise1((seed + Math.imul(o + 1, 0x632be5ab)) >>> 0, t * freq + o * 17.31);
    norm += amp; amp *= 0.52; freq *= 2.13;
  }
  // Spread the bell-shaped sum smoothly over [0, 1] without clamping (a clamp would make straight coast).
  const v = sum / norm;
  return 0.5 + 0.5 * Math.tanh((v - 0.5) * 3.2) / Math.tanh(1.6);
}

// ---------------------------------------------------------------------------------------------------- edge coasts
/** The band the checker keeps open (x under 0.04 or over 0.96, y under 0.025 or over 0.975). */
export const BAND = Object.freeze({ x: 0.04, y: 0.025 });
/**
 * The natural coast of each edge: depth into the map = base + amp * fbm(seed, t * freq), t running along the edge.
 * The seeds are the ids of the model's edge features, so the coasts are fixed by the model and never by a run.
 */
export const COASTS = Object.freeze({
  west: Object.freeze({ seed: 'edge_west', base: BAND.x + 0.002, amp: 0.018, freq: 7 }),
  east: Object.freeze({ seed: 'edge_east', base: BAND.x + 0.002, amp: 0.018, freq: 7 }),
  north: Object.freeze({ seed: 'edge_north', base: BAND.y + 0.0015, amp: 0.013, freq: 9 }),
  south: Object.freeze({ seed: 'edge_south', base: BAND.y + 0.0015, amp: 0.013, freq: 9 }),
});
/** Depth of the open sea at position t along one edge (normalised units of the axis across the edge). */
export const coastDepth = (side, t) => { const c = COASTS[side]; return c.base + c.amp * fbm1(c.seed, t * c.freq); };
/** Per side: g(p) > 0 on the kept (map) side; t(p) the position along the edge; point(t) the coast at t; inward normal. */
/** Points this close to a coast (about a sixth of a pixel) count as on the map side, so that rounding of a coast
 * vertex never makes a second run cut again (the repair is idempotent). */
export const COAST_TOLERANCE = 3e-5;
export const SIDES = Object.freeze({
  west: { g: p => p[0] - coastDepth('west', p[1]) + COAST_TOLERANCE, t: p => p[1], point: t => [coastDepth('west', t), t], normal: [1, 0] },
  east: { g: p => 1 - coastDepth('east', p[1]) - p[0] + COAST_TOLERANCE, t: p => p[1], point: t => [1 - coastDepth('east', t), t], normal: [-1, 0] },
  north: { g: p => p[1] - coastDepth('north', p[0]) + COAST_TOLERANCE, t: p => p[0], point: t => [t, coastDepth('north', t)], normal: [0, 1] },
  south: { g: p => 1 - coastDepth('south', p[0]) - p[1] + COAST_TOLERANCE, t: p => p[0], point: t => [t, 1 - coastDepth('south', t)], normal: [0, -1] },
});
export const SIDE_ORDER = Object.freeze(['west', 'east', 'north', 'south']);
/** Smallest margin (in normalised units of each side's axis) by which a point clears all four coasts; negative inside a band. */
export function edgeClearance(p) {
  let m = Infinity;
  for (const side of SIDE_ORDER) m = Math.min(m, SIDES[side].g(p));
  return m;
}
/** True when a point lies strictly inside the checker's band. */
export const inCheckerBand = p => p[0] < BAND.x || p[0] > 1 - BAND.x || p[1] < BAND.y || p[1] > 1 - BAND.y;
/** Push a point straight inward until it clears every coast by `margin`. */
export function pushInside(p, margin = 0.003) {
  let q = [p[0], p[1]];
  for (let iter = 0; iter < 4; iter++) {
    let moved = false;
    for (const side of SIDE_ORDER) {
      const s = SIDES[side], v = s.g(q);
      if (v < margin) { q = [q[0] + s.normal[0] * (margin - v), q[1] + s.normal[1] * (margin - v)]; moved = true; }
    }
    if (!moved) break;
  }
  return q;
}
/** The open-sea polygon of one side: everything between the frame edge and the coast, sampled every `step`. */
export function bandPolygon(side, step = 0.002) {
  const s = SIDES[side];
  const n = Math.ceil(1 / step);
  const coast = [];
  for (let k = 0; k <= n; k++) coast.push(s.point(k / n));
  const r = v => Math.round(v * 1e5) / 1e5;
  const clampPt = p => [r(Math.min(1, Math.max(0, p[0]))), r(Math.min(1, Math.max(0, p[1])))];
  if (side === 'west') return [[0, 0], ...coast.map(clampPt), [0, 1]];
  if (side === 'east') return [[1, 1], ...coast.slice().reverse().map(clampPt), [1, 0]];
  if (side === 'north') return [[1, 0], ...coast.slice().reverse().map(clampPt), [0, 0]];
  return [[0, 1], ...coast.map(clampPt), [1, 1]];
}

// ---------------------------------------------------------------------------------------------------- vector basics
export const toPx = p => [p[0] * W, p[1] * H];
export const fromPx = p => [p[0] / W, p[1] / H];
export const round5 = v => Math.round(v * 1e5) / 1e5;
export const ringAreaPx = ring => ringArea(ring) * W * H;
export const geometryAreaPx = g => ringsOf(g).reduce((s, part) => s + Math.abs(ringAreaPx(part[0])) - part.slice(1).reduce((t, r) => t + Math.abs(ringAreaPx(r)), 0), 0);
export const boundsOf = pts => pts.reduce((b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])], [Infinity, Infinity, -Infinity, -Infinity]);
export const geometryBounds = g => g.type === 'Point' ? boundsOf([g.coordinates]) : g.type === 'LineString' ? boundsOf(g.coordinates) : boundsOf(ringsOf(g).flatMap(part => part[0]));
/** Distance in pixels between two normalised points. */
export const distPx = (a, b) => Math.hypot((a[0] - b[0]) * W, (a[1] - b[1]) * H);
export function makeGeometry(parts) {
  if (!parts.length) return null;
  return parts.length === 1 ? { type: 'Polygon', coordinates: parts[0] } : { type: 'MultiPolygon', coordinates: parts };
}
/** Closest point (normalised) on a polyline or ring to p, measured in pixels. */
export function closestOnPath(p, path, closed = false) {
  const P = toPx(p);
  let best = null, bd = Infinity;
  const n = path.length;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const a = toPx(path[i]), b = toPx(path[(i + 1) % n]);
    const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
    const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((P[0] - a[0]) * dx + (P[1] - a[1]) * dy) / l2));
    const q = [a[0] + t * dx, a[1] + t * dy], d = Math.hypot(P[0] - q[0], P[1] - q[1]);
    if (d < bd) { bd = d; best = { point: fromPx(q), dist: d, index: i, t }; }
  }
  return best;
}
/** Remove consecutive duplicates, the closing copy and zero-width spikes from a ring. */
export function cleanRing(ring, tolPx = 1e-3) {
  let r = ring.slice();
  let changed = true;
  while (changed && r.length > 3) {
    changed = false;
    const out = [];
    for (let i = 0; i < r.length; i++) {
      const p = r[i], q = out.length ? out[out.length - 1] : r[r.length - 1];
      if (distPx(p, q) <= tolPx) { changed = true; continue; }
      out.push(p);
    }
    // spikes: a vertex whose two edges fold back on the same line
    const out2 = [];
    for (let i = 0; i < out.length; i++) {
      const a = out[(i - 1 + out.length) % out.length], b = out[i], c = out[(i + 1) % out.length];
      const A = toPx(a), B = toPx(b), C = toPx(c);
      const cross = (A[0] - B[0]) * (C[1] - B[1]) - (A[1] - B[1]) * (C[0] - B[0]);
      const dot = (A[0] - B[0]) * (C[0] - B[0]) + (A[1] - B[1]) * (C[1] - B[1]);
      const la = Math.hypot(A[0] - B[0], A[1] - B[1]), lc = Math.hypot(C[0] - B[0], C[1] - B[1]);
      if (Math.abs(cross) <= 1e-9 * Math.max(1, la * lc) && dot > 0) { changed = true; continue; }
      out2.push(b);
    }
    r = out2;
  }
  return r;
}

// ---------------------------------------------------------------------------------------------------- validation
/** Every ring defect the checker reports, for one geometry: [] when the geometry is valid. */
export function geometryDefects(g) {
  const out = [];
  if (!g || !['Polygon', 'MultiPolygon'].includes(g.type)) return ['not an area'];
  const parts = ringsOf(g);
  if (!parts.length) return ['empty'];
  const bounds = [];
  parts.forEach((part, pi) => {
    part.forEach((ring, ri) => {
      if (ring.length < 3) { out.push(`part ${pi} ring ${ri} short`); return; }
      if (ring.length > 2000) out.push(`part ${pi} ring ${ri} long`);
      for (let i = 0; i < ring.length; i++) { const p = ring[i], q = ring[(i + 1) % ring.length]; if (Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9) { out.push(`part ${pi} ring ${ri} repeat`); break; } }
      if (Math.abs(ringAreaPx(ring)) < 1) out.push(`part ${pi} ring ${ri} area`);
      const s = ringSelfIntersections(ring);
      if (s.crossings || s.touches || s.spikes) out.push(`part ${pi} ring ${ri} self ${s.crossings}/${s.touches}/${s.spikes}`);
    });
    for (let h = 1; h < part.length; h++) {
      if (!part[h].every(p => pointInRing(p[0], p[1], part[0]))) out.push(`part ${pi} hole ${h} outside`);
      const t = ringsInteract(part[h], part[0]);
      if (t.cross || t.touch) out.push(`part ${pi} hole ${h} touches`);
      for (let k = h + 1; k < part.length; k++) { const u = ringsInteract(part[h], part[k]); if (u.cross || u.touch) out.push(`part ${pi} holes ${h} ${k} touch`); }
    }
    bounds.push(boundsOf(part[0]));
  });
  for (let a = 0; a < parts.length; a++) for (let b = a + 1; b < parts.length; b++) {
    const A = bounds[a], B = bounds[b];
    if (!(A[0] <= B[2] && B[0] <= A[2] && A[1] <= B[3] && B[1] <= A[3])) continue;
    const t = ringsInteract(parts[a][0], parts[b][0]);
    if (t.cross || t.touch) out.push(`parts ${a} ${b} meet`);
    else if (pointInRing(parts[a][0][0][0], parts[a][0][0][1], parts[b][0]) || pointInRing(parts[b][0][0][0], parts[b][0][0][1], parts[a][0])) out.push(`parts ${a} ${b} nest`);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------- the edge cut
/** Point where segment a (kept side) to b (cut side) meets the coast, by bisection on g. */
function crossing(g, a, b) {
  let lo = a, hi = b;
  for (let k = 0; k < 40; k++) {
    const m = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2];
    if (g(m) > 0) lo = m; else hi = m;
  }
  return lo;
}
/** Orient rings: outer positive, holes negative (the checker's signed area). */
export function orientPart(part) {
  return part.map((ring, i) => {
    const a = ringArea(ring);
    return (i === 0 ? a < 0 : a > 0) ? ring.slice().reverse() : ring;
  });
}
const COAST_STEP = 0.0009;
/**
 * Cut one polygon part along the coast of `side`, keeping the map side. Returns a list of parts, or null when the
 * crossings cannot be paired (degenerate input), so that the caller can fall back to a raster cut.
 */
export function cutPart(partIn, side) {
  const s = SIDES[side];
  const part = orientPart(partIn);
  const intact = [], chains = [];
  for (let ri = 0; ri < part.length; ri++) {
    const ring = part[ri], gs = ring.map(s.g), n = ring.length;
    if (gs.every(v => v > 0)) { intact.push({ ring, hole: ri > 0 }); continue; }
    if (gs.every(v => v <= 0)) continue;
    const start = gs.findIndex(v => v <= 0);
    let cur = null;
    for (let k = 0; k < n; k++) {
      const i = (start + k) % n, j = (i + 1) % n;
      if (gs[i] <= 0 && gs[j] > 0) { const p = crossing(s.g, ring[j], ring[i]); cur = { pts: [p, ring[j]], entry: p }; }
      else if (gs[i] > 0 && gs[j] > 0) cur.pts.push(ring[j]);
      else if (gs[i] > 0 && gs[j] <= 0) { const p = crossing(s.g, ring[i], ring[j]); cur.pts.push(p); cur.exit = p; chains.push(cur); cur = null; }
    }
  }
  const outerIntact = intact.find(r => !r.hole);
  if (outerIntact) return [part];
  if (!chains.length) return [];
  const ends = [];
  chains.forEach((c, ci) => { ends.push({ t: s.t(c.entry), ci, type: 'entry' }); ends.push({ t: s.t(c.exit), ci, type: 'exit' }); });
  ends.sort((a, b) => a.t - b.t || (a.type < b.type ? -1 : 1));
  const partnerOfExit = new Map();
  for (let k = 0; k + 1 < ends.length; k += 2) {
    const a = ends[k], b = ends[k + 1];
    if (a.type === b.type) return null;
    const ex = a.type === 'exit' ? a : b, en = a.type === 'exit' ? b : a;
    partnerOfExit.set(ex.ci, en);
  }
  const used = new Set(), rings = [];
  for (let c0 = 0; c0 < chains.length; c0++) {
    if (used.has(c0)) continue;
    const ring = [];
    let c = c0, guard = 0;
    for (;;) {
      if (used.has(c) || guard++ > chains.length) return null;
      used.add(c);
      ring.push(...chains[c].pts);
      const t0 = s.t(chains[c].exit), en = partnerOfExit.get(c);
      if (!en) return null;
      const t1 = en.t, steps = Math.ceil(Math.abs(t1 - t0) / COAST_STEP);
      for (let k = 1; k < steps; k++) ring.push(s.point(t0 + ((t1 - t0) * k) / steps));
      c = en.ci;
      if (c === c0) break;
    }
    const cleaned = cleanRing(ring, 0.02);
    if (cleaned.length >= 3 && Math.abs(ringAreaPx(cleaned)) >= 2) rings.push(cleaned);
  }
  const holes = intact.filter(r => r.hole).map(r => r.ring);
  return rings.map(outer => [outer, ...holes.filter(h => pointInRing(h[0][0], h[0][1], outer))]);
}
/** Cut every part of an area geometry along one coast. Returns { geometry (or null when nothing remains), ok }. */
export function cutGeometry(g, side) {
  const out = [];
  for (const part of ringsOf(g)) {
    const r = cutPart(part, side);
    if (r === null) return { geometry: g, ok: false };
    out.push(...r);
  }
  return { geometry: makeGeometry(out), ok: true };
}
/** True when any vertex of the geometry lies on the cut side of any coast. */
export function geometryReachesCoast(g) {
  const pts = g.type === 'Point' ? [g.coordinates] : g.type === 'LineString' ? g.coordinates : ringsOf(g).flatMap(part => part.flat());
  return pts.some(p => edgeClearance(p) <= 0);
}
/** Clip a polyline to the map side of all four coasts; returns the kept pieces (each at least two vertices). */
export function clipLine(coords) {
  let pieces = [coords];
  for (const side of SIDE_ORDER) {
    const s = SIDES[side], next = [];
    for (const line of pieces) {
      let cur = [];
      for (let i = 0; i < line.length; i++) {
        const p = line[i], inside = s.g(p) > 0;
        if (i > 0) {
          const q = line[i - 1], qin = s.g(q) > 0;
          if (qin && !inside) { cur.push(crossing(s.g, q, p)); if (cur.length >= 2) next.push(cur); cur = []; }
          else if (!qin && inside) cur.push(crossing(s.g, p, q));
        }
        if (inside) cur.push(p);
      }
      if (cur.length >= 2) next.push(cur);
    }
    pieces = next;
  }
  return pieces;
}

// ---------------------------------------------------------------------------------------------------- rasters
/** A pixel grid: cell (i, j) has its centre at (ox + (i + 0.5) * cell, oy + (j + 0.5) * cell) in frame pixels. */
/**
 * Grids of the repair are shifted by a fraction of a pixel so that traced vertices never fall on the scan lines of the
 * checker's grid (cell centres at 4k + 2 pixels), where two neighbouring outlines would both claim a row of cells.
 */
export const GRID_SHIFT = 0.29;
export function makeGrid(boundsNorm, cell, padCells = 3) {
  const x0 = Math.floor(boundsNorm[0] * W / cell) - padCells, y0 = Math.floor(boundsNorm[1] * H / cell) - padCells;
  const x1 = Math.ceil(boundsNorm[2] * W / cell) + padCells, y1 = Math.ceil(boundsNorm[3] * H / cell) + padCells;
  return { ox: x0 * cell + GRID_SHIFT, oy: y0 * cell + GRID_SHIFT, cell, w: x1 - x0, h: y1 - y0 };
}
export const worldGrid = cell => ({ ox: GRID_SHIFT - cell / 2, oy: GRID_SHIFT - cell / 2, cell, w: Math.round(W / cell) + 1, h: Math.round(H / cell) + 1 });
export const cellCentre = (grid, i, j) => [(grid.ox + (i + 0.5) * grid.cell) / W, (grid.oy + (j + 0.5) * grid.cell) / H];
export const cellIndexOf = (grid, p) => {
  const i = Math.floor((p[0] * W - grid.ox) / grid.cell), j = Math.floor((p[1] * H - grid.oy) / grid.cell);
  return i >= 0 && j >= 0 && i < grid.w && j < grid.h ? j * grid.w + i : -1;
};
/** Even-odd fill of an area geometry into a mask (value `value`) on a grid. */
export function rasterizeInto(g, grid, mask, value = 1) {
  if (!g) return mask;
  for (const part of ringsOf(g)) {
    const b = boundsOf(part[0]);
    const j0 = Math.max(0, Math.floor((b[1] * H - grid.oy) / grid.cell) - 1), j1 = Math.min(grid.h - 1, Math.ceil((b[3] * H - grid.oy) / grid.cell) + 1);
    for (let j = j0; j <= j1; j++) {
      const yy = (grid.oy + (j + 0.5) * grid.cell) / H;
      const xs = [];
      for (const r of part) for (let i = 0, k = r.length - 1; i < r.length; k = i++) {
        const a = r[k], c = r[i];
        if ((a[1] > yy) !== (c[1] > yy)) xs.push(a[0] + ((yy - a[1]) * (c[0] - a[0])) / (c[1] - a[1]));
      }
      xs.sort((u, v) => u - v);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const i0 = Math.max(0, Math.ceil((xs[k] * W - grid.ox) / grid.cell - 0.5)), i1 = Math.min(grid.w - 1, Math.floor((xs[k + 1] * W - grid.ox) / grid.cell - 0.5));
        for (let i = i0; i <= i1; i++) mask[j * grid.w + i] = value;
      }
    }
  }
  return mask;
}
export const rasterize = (g, grid) => rasterizeInto(g, grid, new Uint8Array(grid.w * grid.h));
export const countMask = m => { let c = 0; for (let i = 0; i < m.length; i++) if (m[i]) c++; return c; };

/** Grow a mask by `r` cells (4-neighbour steps). */
export function dilate(mask, grid, r = 1) {
  let cur = mask;
  for (let k = 0; k < r; k++) {
    const next = cur.slice();
    for (let j = 0; j < grid.h; j++) for (let i = 0; i < grid.w; i++) {
      const id = j * grid.w + i;
      if (cur[id]) continue;
      if ((i > 0 && cur[id - 1]) || (i + 1 < grid.w && cur[id + 1]) || (j > 0 && cur[id - grid.w]) || (j + 1 < grid.h && cur[id + grid.w])) next[id] = 1;
    }
    cur = next;
  }
  return cur;
}
/** Shrink a mask by `r` cells (4-neighbour steps); cells outside the grid count as empty. */
export function erode(mask, grid, r = 1) {
  let cur = mask;
  for (let k = 0; k < r; k++) {
    const next = cur.slice();
    for (let j = 0; j < grid.h; j++) for (let i = 0; i < grid.w; i++) {
      const id = j * grid.w + i;
      if (!cur[id]) continue;
      if (i === 0 || j === 0 || i + 1 === grid.w || j + 1 === grid.h || !cur[id - 1] || !cur[id + 1] || !cur[id - grid.w] || !cur[id + grid.w]) next[id] = 0;
    }
    cur = next;
  }
  return cur;
}

/**
 * Marching squares on a binary mask: closed rings through the midpoints between cell centres, never touching one
 * another (saddles keep the foreground apart). Returns rings in normalised coordinates.
 */
export function traceRings(mask, grid) {
  const { w, h } = grid;
  const W2 = w + 2, H2 = h + 2;
  const at = (i, j) => (i >= 0 && j >= 0 && i < w && j < h ? mask[j * w + i] : 0);
  const hId = (i, j) => ((j + 1) * W2 + (i + 1)) * 2;
  const vId = (i, j) => ((j + 1) * W2 + (i + 1)) * 2 + 1;
  const size = W2 * H2 * 2;
  const n1 = new Int32Array(size).fill(-1), n2 = new Int32Array(size).fill(-1);
  const link = (a, b) => { if (n1[a] < 0) n1[a] = b; else n2[a] = b; if (n1[b] < 0) n1[b] = a; else n2[b] = a; };
  for (let j = -1; j < h; j++) for (let i = -1; i < w; i++) {
    const code = at(i, j) * 8 + at(i + 1, j) * 4 + at(i + 1, j + 1) * 2 + at(i, j + 1);
    if (code === 0 || code === 15) continue;
    const T = hId(i, j), B = hId(i, j + 1), L = vId(i, j), R = vId(i + 1, j);
    switch (code) {
      case 1: case 14: link(L, B); break;
      case 2: case 13: link(B, R); break;
      case 3: case 12: link(L, R); break;
      case 4: case 11: link(T, R); break;
      case 6: case 9: link(T, B); break;
      case 7: case 8: link(L, T); break;
      case 5: link(T, R); link(L, B); break;
      case 10: link(L, T); link(B, R); break;
      default: break;
    }
  }
  const pos = id => {
    const cellId = id >> 1, i = (cellId % W2) - 1, j = Math.floor(cellId / W2) - 1;
    const px = (id & 1) === 0 ? grid.ox + (i + 1) * grid.cell : grid.ox + (i + 0.5) * grid.cell;
    const py = (id & 1) === 0 ? grid.oy + (j + 0.5) * grid.cell : grid.oy + (j + 1) * grid.cell;
    return [Math.min(1, Math.max(0, px / W)), Math.min(1, Math.max(0, py / H))];
  };
  const seen = new Uint8Array(size), rings = [];
  for (let id = 0; id < size; id++) {
    if (n1[id] < 0 || seen[id]) continue;
    const ring = [];
    let prev = -1, cur = id;
    while (!seen[cur]) {
      seen[cur] = 1; ring.push(pos(cur));
      const nx = n1[cur] !== prev ? n1[cur] : n2[cur];
      prev = cur; cur = nx;
      if (cur < 0) break;
    }
    if (ring.length >= 3) rings.push(ring);
  }
  return rings;
}

/** Douglas-Peucker on a closed ring, tolerance in pixels. */
export function simplifyRing(ring, tolPx) {
  const n = ring.length;
  if (n <= 8 || tolPx <= 0) return ring.slice();
  const P = ring.map(toPx);
  let i0 = 0;
  for (let i = 1; i < n; i++) if (P[i][0] < P[i0][0] || (P[i][0] === P[i0][0] && P[i][1] < P[i0][1])) i0 = i;
  let i1 = i0, bd = -1;
  for (let i = 0; i < n; i++) { const d = Math.hypot(P[i][0] - P[i0][0], P[i][1] - P[i0][1]); if (d > bd) { bd = d; i1 = i; } }
  const keep = new Uint8Array(n);
  keep[i0] = 1; keep[i1] = 1;
  const stack = [[i0, i1], [i1, i0]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const A = P[a], B = P[b];
    const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy);
    let far = -1, fd = -1;
    for (let k = (a + 1) % n; k !== b; k = (k + 1) % n) {
      const d = l === 0 ? Math.hypot(P[k][0] - A[0], P[k][1] - A[1]) : Math.abs(dy * (P[k][0] - A[0]) - dx * (P[k][1] - A[1])) / l;
      if (d > fd) { fd = d; far = k; }
    }
    if (far >= 0 && fd > tolPx) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  const out = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(ring[i]);
  return out;
}

/** Group rings into parts by nesting: even depth outer, odd depth hole of its parent. */
export function nestRings(rings) {
  const info = rings.map((r, k) => ({ r, k, a: Math.abs(ringAreaPx(r)), b: boundsOf(r), parent: -1, depth: 0 }));
  const order = info.slice().sort((x, y) => y.a - x.a || x.k - y.k);
  for (let idx = 0; idx < order.length; idx++) {
    const ri = order[idx];
    const p = ri.r[0];
    for (let jdx = idx - 1; jdx >= 0; jdx--) {
      const rj = order[jdx];
      if (rj.b[0] > ri.b[0] || rj.b[2] < ri.b[2] || rj.b[1] > ri.b[1] || rj.b[3] < ri.b[3]) continue;
      if (pointInRing(p[0], p[1], rj.r)) { ri.parent = rj.k; ri.depth = rj.depth + 1; break; }
    }
  }
  const parts = new Map();
  for (const ri of order) if (ri.depth % 2 === 0) parts.set(ri.k, [ri.r]);
  for (const ri of order) if (ri.depth % 2 === 1 && parts.has(ri.parent)) parts.get(ri.parent).push(ri.r);
  return [...parts.values()];
}

/**
 * Turn a mask back into a valid area geometry. Small parts and holes are dropped (holes are filled); rings are
 * simplified with the largest tolerance of `tolerances` (pixels) that keeps the geometry valid and every ring under
 * `maxVertices`. Returns null when the mask is empty.
 */
export function vectorize(mask, grid, opts = {}) {
  const { tolerances = [1.2, 0.9, 0.6, 0.4, 0], minPartPx = 30, minHolePx = 30, maxVertices = 1900 } = opts;
  let rings = traceRings(mask, grid);
  let parts = nestRings(rings)
    .map(part => [part[0], ...part.slice(1).filter(h => Math.abs(ringAreaPx(h)) >= minHolePx)])
    .filter(part => Math.abs(ringAreaPx(part[0])) - part.slice(1).reduce((s, h) => s + Math.abs(ringAreaPx(h)), 0) >= minPartPx);
  if (!parts.length) return null;
  parts.sort((a, b) => Math.abs(ringAreaPx(b[0])) - Math.abs(ringAreaPx(a[0])) || a[0][0][0] - b[0][0][0] || a[0][0][1] - b[0][0][1]);
  const extra = [2, 3, 4.5, 6];
  for (const tol of [...tolerances, ...extra]) {
    const simplified = parts.map(part => orientPart(part.map(r => cleanRing(simplifyRing(r, tol).map(p => [round5(p[0]), round5(p[1])]), 1e-3))));
    if (simplified.some(part => part.some(r => r.length < 3))) continue;
    if (simplified.some(part => part.some(r => r.length > maxVertices))) continue;
    const g = makeGeometry(simplified);
    if (!geometryDefects(g).length) return g;
  }
  return null;
}

// ---------------------------------------------------------------------------------------------------- components and searches
/** 4-connected components of a mask: { labels (Int32Array, -1 outside), sizes }. */
export function labelComponents(mask, grid) {
  const labels = new Int32Array(grid.w * grid.h).fill(-1), sizes = [];
  const queue = new Int32Array(grid.w * grid.h);
  for (let s = 0; s < mask.length; s++) {
    if (!mask[s] || labels[s] >= 0) continue;
    const id = sizes.length;
    let head = 0, tail = 0;
    queue[tail++] = s; labels[s] = id;
    while (head < tail) {
      const c = queue[head++], i = c % grid.w, j = (c - i) / grid.w;
      const nb = [i > 0 ? c - 1 : -1, i + 1 < grid.w ? c + 1 : -1, j > 0 ? c - grid.w : -1, j + 1 < grid.h ? c + grid.w : -1];
      for (const n of nb) if (n >= 0 && mask[n] && labels[n] < 0) { labels[n] = id; queue[tail++] = n; }
    }
    sizes.push(tail);
  }
  return { labels, sizes };
}
/** The largest 4-connected component of a mask (ties: the one found first in row order). */
export function largestComponent(mask, grid) {
  const { labels, sizes } = labelComponents(mask, grid);
  if (!sizes.length) return new Uint8Array(mask.length);
  let best = 0;
  for (let k = 1; k < sizes.length; k++) if (sizes[k] > sizes[best]) best = k;
  const out = new Uint8Array(mask.length);
  for (let i = 0; i < labels.length; i++) if (labels[i] === best) out[i] = 1;
  return out;
}
/**
 * Multi-source breadth-first growth of labels (Int16Array or Int32Array, -1 unassigned) through cells where
 * `passable(index)` holds, 4-neighbour steps. Cells keep the label of the nearest seed (row order breaks ties).
 */
export function growLabels(labels, grid, passable, maxSteps = Infinity) {
  let frontier = [];
  for (let i = 0; i < labels.length; i++) if (labels[i] >= 0) frontier.push(i);
  let steps = 0;
  while (frontier.length && steps++ < maxSteps) {
    const next = [];
    for (const c of frontier) {
      const i = c % grid.w, j = (c - i) / grid.w;
      const nb = [i > 0 ? c - 1 : -1, i + 1 < grid.w ? c + 1 : -1, j > 0 ? c - grid.w : -1, j + 1 < grid.h ? c + grid.w : -1];
      for (const n of nb) if (n >= 0 && labels[n] < 0 && passable(n)) { labels[n] = labels[c]; next.push(n); }
    }
    frontier = next;
  }
  return labels;
}
/** Nearest cell (by breadth-first steps, then pixel distance) to `start` where `accept(index)` holds, within `maxSteps`. */
export function nearestCell(grid, startIndex, accept, maxSteps = 200) {
  if (accept(startIndex)) return startIndex;
  const seen = new Set([startIndex]);
  let frontier = [startIndex];
  const si = startIndex % grid.w, sj = (startIndex - si) / grid.w;
  for (let step = 0; step < maxSteps && frontier.length; step++) {
    const next = [], hits = [];
    for (const c of frontier) {
      const i = c % grid.w, j = (c - i) / grid.w;
      for (const [di, dj] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const x = i + di, y = j + dj;
        if (x < 0 || y < 0 || x >= grid.w || y >= grid.h) continue;
        const n = y * grid.w + x;
        if (seen.has(n)) continue;
        seen.add(n);
        if (accept(n)) hits.push(n); else next.push(n);
      }
    }
    if (hits.length) {
      hits.sort((a, b) => { const ai = a % grid.w, aj = (a - ai) / grid.w, bi = b % grid.w, bj = (b - bi) / grid.w; return Math.hypot(ai - si, aj - sj) - Math.hypot(bi - si, bj - sj) || a - b; });
      return hits[0];
    }
    frontier = next;
  }
  return -1;
}
/** Chamfer distance (in cells) from every cell to the nearest cell outside the mask. */
export function insideDistance(mask, grid) {
  const d = new Float32Array(mask.length);
  const big = 1e9;
  for (let i = 0; i < mask.length; i++) d[i] = mask[i] ? big : 0;
  const { w, h } = grid;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const c = j * w + i; if (!d[c]) continue;
    let v = d[c];
    v = Math.min(v, i > 0 ? d[c - 1] + 1 : 1, j > 0 ? d[c - w] + 1 : 1, i > 0 && j > 0 ? d[c - w - 1] + 1.414 : 1.414, i + 1 < w && j > 0 ? d[c - w + 1] + 1.414 : 1.414);
    d[c] = v;
  }
  for (let j = h - 1; j >= 0; j--) for (let i = w - 1; i >= 0; i--) {
    const c = j * w + i; if (!d[c]) continue;
    let v = d[c];
    v = Math.min(v, i + 1 < w ? d[c + 1] + 1 : 1, j + 1 < h ? d[c + w] + 1 : 1, i + 1 < w && j + 1 < h ? d[c + w + 1] + 1.414 : 1.414, i > 0 && j + 1 < h ? d[c + w - 1] + 1.414 : 1.414);
    d[c] = v;
  }
  return d;
}
/** Chaikin corner cutting of a closed ring, `iterations` times. */
export function chaikin(ring, iterations = 2) {
  let r = ring;
  for (let k = 0; k < iterations; k++) {
    const out = [];
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    r = out;
  }
  return r;
}
/** Polyline length in pixels. */
export const lineLengthPx = c => { let s = 0; for (let i = 1; i < c.length; i++) s += distPx(c[i - 1], c[i]); return s; };
/** Points along a polyline every `stepPx` pixels (vertices included), each with the index of the original vertex it sits on or -1. */
export function densifyLine(c, stepPx) {
  const out = [{ p: c[0], v: 0 }];
  for (let i = 1; i < c.length; i++) {
    const n = Math.max(1, Math.ceil(distPx(c[i - 1], c[i]) / stepPx));
    for (let k = 1; k <= n; k++) out.push({ p: k === n ? c[i] : [c[i - 1][0] + ((c[i][0] - c[i - 1][0]) * k) / n, c[i - 1][1] + ((c[i][1] - c[i - 1][1]) * k) / n], v: k === n ? i : -1 });
  }
  return out;
}
/** Douglas-Peucker on an open polyline, tolerance in pixels; `locked` indices are always kept. */
export function simplifyLine(c, tolPx, locked = new Set()) {
  const n = c.length;
  if (n <= 2 || tolPx <= 0) return c.slice();
  const P = c.map(toPx), keep = new Uint8Array(n);
  keep[0] = 1; keep[n - 1] = 1;
  for (const k of locked) if (k >= 0 && k < n) keep[k] = 1;
  const anchors = [];
  for (let i = 0; i < n; i++) if (keep[i]) anchors.push(i);
  const stack = [];
  for (let k = 0; k + 1 < anchors.length; k++) stack.push([anchors[k], anchors[k + 1]]);
  while (stack.length) {
    const [a, b] = stack.pop();
    const A = P[a], B = P[b], dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy);
    let far = -1, fd = -1;
    for (let k = a + 1; k < b; k++) {
      const d = l === 0 ? Math.hypot(P[k][0] - A[0], P[k][1] - A[1]) : Math.abs(dy * (P[k][0] - A[0]) - dx * (P[k][1] - A[1])) / l;
      if (d > fd) { fd = d; far = k; }
    }
    if (far >= 0 && fd > tolPx) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return c.filter((_, i) => keep[i]);
}
/** Remove consecutive points closer than `tolPx`. */
export const dedupeLine = (c, tolPx = 0.05) => c.filter((p, i) => i === 0 || distPx(p, c[i - 1]) > tolPx);
/** Intersection point of segments ab and cd (touching counts), or null. */
export function segmentIntersection(a, b, c, d) {
  const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]];
  const den = r[0] * s[1] - r[1] * s[0], q = [c[0] - a[0], c[1] - a[1]];
  if (den === 0) {
    // parallel: only a shared endpoint or an overlap of collinear segments counts, taken at its first shared point
    if (q[0] * r[1] - q[1] * r[0] !== 0) return null;
    for (const p of [c, d]) if (Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1])) return p;
    return null;
  }
  const t = (q[0] * s[1] - q[1] * s[0]) / den, u = (q[0] * r[1] - q[1] * r[0]) / den;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? [a[0] + t * r[0], a[1] + t * r[1]] : null;
}
/** Cut the loops out of an open polyline: where a later segment meets an earlier one, the part between is dropped at the meeting point. */
export function untangleLine(c) {
  let line = c.slice();
  for (let changed = true; changed;) {
    changed = false;
    outer: for (let i = 0; i + 1 < line.length; i++) for (let j = line.length - 2; j > i + 1; j--) {
      const x = segmentIntersection(line[i], line[i + 1], line[j], line[j + 1]);
      if (x) { line = [...line.slice(0, i + 1), x, ...line.slice(j + 1)]; changed = true; break outer; }
    }
  }
  return dedupeLine(line);
}
