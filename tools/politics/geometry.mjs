// Plane geometry and raster helpers of the politics step (tools/politics/realm_seeds.mjs).
//
// World frame: pixels of the 5,120 x 2,560 map, top-left origin, x to the east and y to the south (the convention of
// the map tool's `landPolygons` and of `create_world.countries` in its workspace form). A polygon is one ring of
// [x, y] points, not closed (the first point is not repeated); a realm's `claim` or `exclude` is a list of such rings
// and a point is inside the list when it is inside one of the rings (even-odd per ring). Nothing here reads or writes
// files, and nothing depends on a clock or on Math.random.

export const FRAME = Object.freeze({ width: 5120, height: 2560 });

/** Even-odd point-in-ring test (pixel coordinates). */
export function pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[j], b = ring[i];
    if ((a[1] > y) !== (b[1] > y) && x < a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1])) inside = !inside;
  }
  return inside;
}
/** True when the point is inside one of the rings. */
export const pointInPolygons = (x, y, polygons) => (polygons ?? []).some(r => pointInRing(x, y, r));

export const ringBounds = ring => ring.reduce((b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])], [Infinity, Infinity, -Infinity, -Infinity]);
const boundsMeet = (a, b) => a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3];
const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
/** Proper crossing of two segments (touching at an end or along a shared line does not count). */
export function segmentsCross(a, b, c, d) {
  const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}
/** Signed area of a ring (pixels squared; positive when clockwise on screen, y down). */
export function ringArea(ring) {
  let s = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) s += (ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]);
  return s / 2;
}
/**
 * Whether two rings share interior area: an edge of one properly crosses an edge of the other, or a vertex (or, for
 * rings that only touch along their outlines, the centroid of a small interior sample) of one lies strictly inside the
 * other. Rings that only share a border do not overlap.
 */
export function ringsOverlap(r1, r2) {
  const b1 = ringBounds(r1), b2 = ringBounds(r2);
  if (!boundsMeet(b1, b2)) return false;
  for (let i = 0, j = r1.length - 1; i < r1.length; j = i++) {
    const a = r1[j], b = r1[i];
    if (!boundsMeet(ringBounds([a, b]), b2)) continue;
    for (let k = 0, l = r2.length - 1; k < r2.length; l = k++) if (segmentsCross(a, b, r2[l], r2[k])) return true;
  }
  const strictlyInside = (p, ring) => pointInRing(p[0], p[1], ring) && !onOutline(p, ring);
  if (r1.some(p => strictlyInside(p, r2)) || r2.some(p => strictlyInside(p, r1))) return true;
  // identical or nested outlines that share every vertex: compare an interior point
  const inner = interiorPoint(r1);
  return inner !== null && strictlyInside(inner, r2);
}
function onOutline(p, ring) {
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[j], b = ring[i];
    if (Math.abs(cross(a, b, p)) > 1e-9) continue;
    if (p[0] >= Math.min(a[0], b[0]) - 1e-9 && p[0] <= Math.max(a[0], b[0]) + 1e-9 && p[1] >= Math.min(a[1], b[1]) - 1e-9 && p[1] <= Math.max(a[1], b[1]) + 1e-9) return true;
  }
  return false;
}
/** A point strictly inside a ring (scanline through the middle of its bounds), or null for a degenerate ring. */
export function interiorPoint(ring) {
  const b = ringBounds(ring);
  for (const f of [0.5, 0.37, 0.63, 0.21, 0.79]) {
    const y = b[1] + (b[3] - b[1]) * f;
    const xs = [];
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[j], c = ring[i];
      if ((a[1] > y) !== (c[1] > y)) xs.push(a[0] + ((y - a[1]) * (c[0] - a[0])) / (c[1] - a[1]));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) if (xs[k + 1] - xs[k] > 1e-6) return [(xs[k] + xs[k + 1]) / 2, y];
  }
  return null;
}
/** A ring is valid when it has at least three finite points and a non-zero area. */
export const ringValid = ring => Array.isArray(ring) && ring.length >= 3 && ring.every(p => Array.isArray(p) && p.length === 2 && Number.isFinite(p[0]) && Number.isFinite(p[1])) && Math.abs(ringArea(ring)) > 0;

/** Regular polygon approximating a circle (pixel coordinates, integer vertices). */
export function circleRing(centre, radius, sides = 24) {
  const out = [];
  for (let k = 0; k < sides; k++) { const t = (2 * Math.PI * k) / sides; out.push([Math.round(centre[0] + radius * Math.cos(t)), Math.round(centre[1] + radius * Math.sin(t))]); }
  return out;
}

// ---------------------------------------------------------------------------------------------------- rasters
/** Even-odd scanline fill of rings (pixel coordinates) into a W x H mask, sampled at pixel centres. */
export function fillRings(rings, mask, value = 1, w = FRAME.width, h = FRAME.height) {
  if (!rings.length) return mask;
  let y0 = Infinity, y1 = -Infinity;
  for (const r of rings) for (const p of r) { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
  y0 = Math.max(0, Math.floor(y0)); y1 = Math.min(h - 1, Math.ceil(y1));
  for (let y = y0; y <= y1; y++) {
    const yy = y + 0.5, xs = [];
    for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const ay = r[i][1], by = r[j][1];
      if ((ay > yy) !== (by > yy)) xs.push(r[i][0] + ((yy - ay) * (r[j][0] - r[i][0])) / (by - ay));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.max(0, Math.ceil(xs[k] - 0.5)), b = Math.min(w - 1, Math.ceil(xs[k + 1] - 0.5) - 1);
      if (a <= b) mask.fill(value, y * w + a, y * w + b + 1);
    }
  }
  return mask;
}
/** Square erosion of a 0/1 mask by `r` pixels (a pixel survives when its whole (2r+1)^2 box is set). */
export function erodeBox(mask, r, w = FRAME.width, h = FRAME.height) {
  if (r <= 0) return mask.slice();
  const tmp = new Uint8Array(w * h), out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    let run = 0;
    const row = y * w;
    // run length of set pixels ending at x; a pixel is kept when the window [x - r, x + r] is all set
    const runs = new Int32Array(w);
    for (let x = 0; x < w; x++) { run = mask[row + x] ? run + 1 : 0; runs[x] = run; }
    for (let x = r; x < w - r; x++) if (runs[x + r] >= 2 * r + 1) tmp[row + x] = 1;
  }
  for (let x = 0; x < w; x++) {
    let run = 0;
    const runs = new Int32Array(h);
    for (let y = 0; y < h; y++) { run = tmp[y * w + x] ? run + 1 : 0; runs[y] = run; }
    for (let y = r; y < h - r; y++) if (runs[y + r] >= 2 * r + 1) out[y * w + x] = 1;
  }
  return out;
}
/** 4-connected components of a mask on a grid of `w` columns: labels (Int32Array, -1 outside) and sizes. */
export function components(mask, w, h) {
  const labels = new Int32Array(w * h).fill(-1), sizes = [];
  const queue = new Int32Array(w * h);
  for (let s = 0; s < mask.length; s++) {
    if (!mask[s] || labels[s] >= 0) continue;
    const id = sizes.length;
    let head = 0, tail = 0;
    queue[tail++] = s; labels[s] = id;
    while (head < tail) {
      const c = queue[head++], x = c % w, y = (c - x) / w;
      if (x > 0 && mask[c - 1] && labels[c - 1] < 0) { labels[c - 1] = id; queue[tail++] = c - 1; }
      if (x + 1 < w && mask[c + 1] && labels[c + 1] < 0) { labels[c + 1] = id; queue[tail++] = c + 1; }
      if (y > 0 && mask[c - w] && labels[c - w] < 0) { labels[c - w] = id; queue[tail++] = c - w; }
      if (y + 1 < h && mask[c + w] && labels[c + w] < 0) { labels[c + w] = id; queue[tail++] = c + w; }
    }
    sizes.push(tail);
  }
  return { labels, sizes };
}
/** Square dilation of a 0/1 mask by `r` cells. */
export function dilateBox(mask, r, w, h) {
  if (r <= 0) return mask.slice();
  const tmp = new Uint8Array(w * h), out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    let last = -Infinity;
    for (let x = 0; x < w; x++) { if (mask[y * w + x]) last = x; if (x - last <= r) tmp[y * w + x] = 1; }
    last = Infinity;
    for (let x = w - 1; x >= 0; x--) { if (mask[y * w + x]) last = x; if (last - x <= r) tmp[y * w + x] = 1; }
  }
  for (let x = 0; x < w; x++) {
    let last = -Infinity;
    for (let y = 0; y < h; y++) { if (tmp[y * w + x]) last = y; if (y - last <= r) out[y * w + x] = 1; }
    last = Infinity;
    for (let y = h - 1; y >= 0; y--) { if (tmp[y * w + x]) last = y; if (last - y <= r) out[y * w + x] = 1; }
  }
  return out;
}

/**
 * Outer outlines of a mask on a cell grid (cell size `cell` pixels, origin at the frame's top-left), as rings in
 * pixel coordinates simplified by Douglas-Peucker with `tolPx` and rounded to whole pixels. Holes are filled (only
 * outer rings are returned) and parts smaller than `minAreaPx` are dropped. Marching squares through cell-edge
 * midpoints, so neighbouring parts never touch.
 */
export function outlines(mask, w, h, cell, { tolPx = 2, minAreaPx = 0 } = {}) {
  const at = (i, j) => (i >= 0 && j >= 0 && i < w && j < h ? mask[j * w + i] : 0);
  const W2 = w + 2, H2 = h + 2, size = W2 * H2 * 2;
  const n1 = new Int32Array(size).fill(-1), n2 = new Int32Array(size).fill(-1);
  const link = (a, b) => { if (n1[a] < 0) n1[a] = b; else n2[a] = b; if (n1[b] < 0) n1[b] = a; else n2[b] = a; };
  const hId = (i, j) => ((j + 1) * W2 + (i + 1)) * 2, vId = (i, j) => ((j + 1) * W2 + (i + 1)) * 2 + 1;
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
    const c = id >> 1, i = (c % W2) - 1, j = Math.floor(c / W2) - 1;
    return (id & 1) === 0 ? [(i + 1) * cell, (j + 0.5) * cell] : [(i + 0.5) * cell, (j + 1) * cell];
  };
  const seen = new Uint8Array(size), rings = [];
  for (let id = 0; id < size; id++) {
    if (n1[id] < 0 || seen[id]) continue;
    const ring = [];
    let prev = -1, cur = id;
    while (cur >= 0 && !seen[cur]) {
      seen[cur] = 1; ring.push(pos(cur));
      const nx = n1[cur] !== prev ? n1[cur] : n2[cur];
      prev = cur; cur = nx;
    }
    if (ring.length >= 3) rings.push(ring);
  }
  // keep outer rings: a ring is outer when it is inside an even number of the other rings
  const info = rings.map(r => ({ r, a: Math.abs(ringArea(r)), b: ringBounds(r) })).sort((p, q) => q.a - p.a || p.b[0] - q.b[0] || p.b[1] - q.b[1]);
  const out = [];
  info.forEach((ri, k) => {
    let depth = 0;
    for (let m = 0; m < k; m++) { const rj = info[m]; if (rj.b[0] <= ri.b[0] && rj.b[2] >= ri.b[2] && rj.b[1] <= ri.b[1] && rj.b[3] >= ri.b[3] && pointInRing(ri.r[0][0], ri.r[0][1], rj.r)) depth++; }
    if (depth % 2 === 0 && ri.a >= minAreaPx) out.push(simplifyRing(ri.r, tolPx).map(p => [Math.round(p[0]), Math.round(p[1])]));
  });
  return out.filter(ringValid);
}
/** Douglas-Peucker on a closed ring (pixel coordinates). */
export function simplifyRing(ring, tol) {
  const n = ring.length;
  if (n <= 8 || tol <= 0) return ring.slice();
  let i0 = 0;
  for (let i = 1; i < n; i++) if (ring[i][0] < ring[i0][0] || (ring[i][0] === ring[i0][0] && ring[i][1] < ring[i0][1])) i0 = i;
  let i1 = i0, bd = -1;
  for (let i = 0; i < n; i++) { const d = Math.hypot(ring[i][0] - ring[i0][0], ring[i][1] - ring[i0][1]); if (d > bd) { bd = d; i1 = i; } }
  const keep = new Uint8Array(n);
  keep[i0] = 1; keep[i1] = 1;
  const stack = [[i0, i1], [i1, i0]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const A = ring[a], B = ring[b], dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy);
    let far = -1, fd = -1;
    for (let k = (a + 1) % n; k !== b; k = (k + 1) % n) {
      const d = l === 0 ? Math.hypot(ring[k][0] - A[0], ring[k][1] - A[1]) : Math.abs(dy * (ring[k][0] - A[0]) - dx * (ring[k][1] - A[1])) / l;
      if (d > fd) { fd = d; far = k; }
    }
    if (far >= 0 && fd > tol) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return ring.filter((_, i) => keep[i]);
}
/** A band polygon around a polyline (pixel coordinates): the outline of the union of discs of `radius` along it. */
export function bandMask(path, radius, w, h, cell) {
  const mask = new Uint8Array(w * h);
  const step = Math.max(1, cell / 2);
  for (let k = 1; k < path.length; k++) {
    const a = path[k - 1], b = path[k], len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(len / step));
    for (let s = 0; s <= n; s++) {
      const x = a[0] + ((b[0] - a[0]) * s) / n, y = a[1] + ((b[1] - a[1]) * s) / n;
      const r = Math.ceil(radius / cell);
      const ci = Math.floor(x / cell), cj = Math.floor(y / cell);
      for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) {
        if (i < 0 || j < 0 || i >= w || j >= h) continue;
        if (Math.hypot((i + 0.5) * cell - x, (j + 0.5) * cell - y) <= radius) mask[j * w + i] = 1;
      }
    }
  }
  return mask;
}
