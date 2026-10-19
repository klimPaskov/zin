// Locate the painted items on a generated asset sheet (black background) so they can be cut out exactly.
// Code here never paints: it only finds, crops, resizes and converts what the image model produced.
import sharp from 'sharp';

// Connected regions brighter than the background, filtered by size and aspect, ordered by row then column.
// Returns { ok, regions, found } — ok only when exactly `expected` regions qualify.
export async function findRegions(file, expected, { minAreaFraction = 1 / 3, aspect = [0.3, 3.5], threshold = 34, cols = 4, rows } = {}) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info, step = 2, w = Math.ceil(W / step), h = Math.ceil(H / step);
  const fg = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = ((y * step) * W + x * step) * 3; fg[y * w + x] = Math.max(data[i], data[i + 1], data[i + 2]) > threshold ? 1 : 0; }
  const seen = new Uint8Array(w * h), boxes = [];
  for (let s = 0; s < w * h; s++) {
    if (!fg[s] || seen[s]) continue;
    const stack = [s]; seen[s] = 1; let x0 = w, y0 = h, x1 = 0, y1 = 0;
    while (stack.length) { const p = stack.pop(), x = p % w, y = (p / w) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (const q of [p - 1, p + 1, p - w, p + w]) if (q >= 0 && q < w * h && fg[q] && !seen[q] && Math.abs((q % w) - x) <= 1) { seen[q] = 1; stack.push(q); } }
    boxes.push({ x0: x0 * step, y0: y0 * step, x1: Math.min(W, (x1 + 1) * step), y1: Math.min(H, (y1 + 1) * step) });
  }
  const cellArea = (W / cols) * (H / (rows ?? Math.ceil(expected / cols)));
  const regions = boxes.filter(b => { const bw = b.x1 - b.x0, bh = b.y1 - b.y0; return bw * bh > cellArea * minAreaFraction && bw / bh >= aspect[0] && bw / bh <= aspect[1]; });
  if (regions.length !== expected) return { ok: false, found: regions.length, W, H };
  regions.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
  const grouped = []; for (const r of regions) { const cy = (r.y0 + r.y1) / 2, row = grouped.find(g => Math.abs(g.cy - cy) < (r.y1 - r.y0) / 2); if (row) row.items.push(r); else grouped.push({ cy, items: [r] }); }
  return { ok: true, regions: grouped.flatMap(g => g.items.sort((a, b) => a.x0 - b.x0)), W, H };
}

// Dark paintings (black Shadow flags) merge into a black background at the default threshold. Try decreasing
// thresholds and accept the first that yields exactly the expected items with consistent sizes (each within 12%
// of the median width and height), so a dark item can never be split or merged silently.
export async function findRegionsAdaptive(file, expected, opts = {}) {
  const { sizeTolerance = 0.12, ...regionOpts } = opts;
  let last;
  for (const threshold of [34, 20, 12, 6]) {
    const r = await findRegions(file, expected, { ...regionOpts, threshold });
    last = r;
    if (!r.ok) continue;
    if (expected > 1) {
      const med = a => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)], ws = r.regions.map(b => b.x1 - b.x0), hs = r.regions.map(b => b.y1 - b.y0), mw = med(ws), mh = med(hs);
      if (!ws.every(w => Math.abs(w - mw) <= mw * sizeTolerance) || !hs.every(h => Math.abs(h - mh) <= mh * sizeTolerance)) { last = { ok: false, found: r.regions.length, inconsistent: true }; continue; }
    }
    return { ...r, threshold };
  }
  return last;
}

// Grid sheets whose background is not flat black (the model sometimes paints a blurred glow): for each cell of a
// cols x rows grid, find each item edge as the sharpest intensity step between the cell centre and the cell
// border. Works on black backgrounds too. Returns { ok, regions } with every region checked against `aspect`.
export async function findGridRegions(file, cols, rows, count, { aspect = [1.3, 1.8], band = 0.3 } = {}) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info, I = (x, y) => data[y * W + x];
  const regions = [];
  for (let k = 0; k < count; k++) {
    const col = k % cols, row = Math.floor(k / cols), cw = W / cols, ch = H / rows;
    const cx = Math.round((col + 0.5) * cw), cy = Math.round((row + 0.5) * ch);
    const ys = [Math.round(cy - ch * band), Math.round(cy + ch * band)], xs = [Math.round(cx - cw * band), Math.round(cx + cw * band)];
    const colScore = x => { let s = 0; for (let y = ys[0]; y <= ys[1]; y++) s += Math.abs(I(x, y) - I(x - 1, y)); return s; };
    const rowScore = y => { let s = 0; for (let x = xs[0]; x <= xs[1]; x++) s += Math.abs(I(x, y) - I(x, y - 1)); return s; };
    const best = (from, to, score) => { let bi = from, bs = -1; for (let v = from; v <= to; v++) { const s = score(v); if (s > bs) { bs = s; bi = v; } } return bi; };
    const x0 = best(Math.max(1, Math.round(col * cw - cw * 0.05)), Math.round(cx - cw * 0.3), colScore);
    const x1 = best(Math.round(cx + cw * 0.3), Math.min(W - 1, Math.round((col + 1) * cw + cw * 0.05)), colScore);
    const y0 = best(Math.max(1, Math.round(row * ch - ch * 0.05)), Math.round(cy - ch * 0.3), rowScore);
    const y1 = best(Math.round(cy + ch * 0.3), Math.min(H - 1, Math.round((row + 1) * ch + ch * 0.05)), rowScore);
    regions.push({ x0, y0, x1, y1 });
  }
  const bad = regions.filter(r => { const a = (r.x1 - r.x0) / (r.y1 - r.y0); return a < aspect[0] || a > aspect[1]; });
  return { ok: bad.length === 0, regions, bad: bad.length, W, H };
}

// Same goal using the whole sheet: item borders line up along each grid column and row, while lines inside the
// paintings vary from item to item, so edge strength summed over the full height (or width) peaks at the borders.
export async function findGridLines(file, cols, rows, count, { aspect = [1.3, 1.8], reach = 0.2 } = {}) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const px = new Float64Array(W), py = new Float64Array(H);
  for (let y = 1; y < H; y++) for (let x = 1; x < W; x++) { const v = data[y * W + x]; px[x] += Math.abs(v - data[y * W + x - 1]); py[y] += Math.abs(v - data[(y - 1) * W + x]); }
  const peak = (p, from, to) => { let bi = from, bs = -1; for (let v = Math.max(1, from); v <= Math.min(p.length - 1, to); v++) if (p[v] > bs) { bs = p[v]; bi = v; } return bi; };
  const cw = W / cols, ch = H / rows;
  const xs = Array.from({ length: cols }, (_, c) => [peak(px, Math.round(c * cw - cw * 0.03), Math.round(c * cw + cw * reach)), peak(px, Math.round((c + 1) * cw - cw * reach), Math.round((c + 1) * cw + cw * 0.03))]);
  const ys = Array.from({ length: rows }, (_, r) => [peak(py, Math.round(r * ch - ch * 0.03), Math.round(r * ch + ch * reach)), peak(py, Math.round((r + 1) * ch - ch * reach), Math.round((r + 1) * ch + ch * 0.03))]);
  const regions = Array.from({ length: count }, (_, k) => ({ x0: xs[k % cols][0], x1: xs[k % cols][1], y0: ys[Math.floor(k / cols)][0], y1: ys[Math.floor(k / cols)][1] }));
  const bad = regions.filter(r => { const a = (r.x1 - r.x0) / (r.y1 - r.y0); return a < aspect[0] || a > aspect[1]; });
  return { ok: bad.length === 0, regions, bad: bad.length, W, H };
}

// Crop a found region (inset to drop anti-aliased edge pixels) and resize to an exact size; returns RGBA raw.
export async function cropRegion(file, r, width, height, { inset = 4, fit = 'fill' } = {}) {
  return sharp(file).extract({ left: r.x0 + inset, top: r.y0 + inset, width: r.x1 - r.x0 - inset * 2, height: r.y1 - r.y0 - inset * 2 })
    .resize(width, height, { fit, kernel: 'lanczos3', background: { r: 0, g: 0, b: 0, alpha: 0 } }).ensureAlpha().raw().toBuffer();
}
