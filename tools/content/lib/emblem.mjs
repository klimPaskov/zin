// Shaped emblems for focus, idea and decision icons (docs/design/validation/gfx_standard.md, "Focus icons").
// Vanilla icons are shaped emblems with a transparent ground, not opaque rectangles. A generated emblem sheet paints each
// emblem alone on a ground the code can take away: either the model returns a cut-out PNG (its own alpha is the ground), or it
// paints flat black (decision A2) and the ground is the black that touches the cell edge. Either way the emblem's own outline is
// the alpha and everything inside it, dark areas included, stays opaque. Code here only finds, mattes, trims, resizes and
// converts generated pixels (art pipeline rule 1); it never paints.
//
//   readEmblemSheet(file)             -> Promise<{ rgba, W, H, mode }>      straight-alpha RGBA of the sheet; mode 'alpha' or 'black'
//   emblemRegions(sheet, cols, rows, expected) -> { ok, regions, problems }   one box per grid cell, pieces of a cell united
//   emblemCell(sheet, region, opts)   -> { buf, w, h, x0, y0, coverage }    straight-alpha RGBA of one cell, alpha from the outline
//   alphaBounds(buf, w, h)            -> { left, top, width, height } | null
//   fitEmblem(cell, w, h, pad)        -> Promise<Buffer>                    RGBA w x h: trimmed, contained, centred, transparent margin
//   shapeStats(rgba, w, h)            -> { transparent, cornersTransparent, minAlpha, maxAlpha, softEdge }
import sharp from 'sharp';

export const GROUND_LUMA = 14;      // 'black' mode: a pixel whose brightest channel is at most this is ground when it touches the cell edge
export const SOLID_ALPHA = 128;     // 'alpha' mode: a pixel with at least this alpha belongs to the emblem
// Emblems differ in shape (a sword is tall and thin, a table wide), so the layout check asks for one piece per grid cell only: the pieces of
// a cell are merged (mergeGrid) and the size consistency of the flag and medallion sheets is switched off (sizeTolerance).
export const EMBLEM_CHECK = { aspect: [0.1, 6], minAreaFraction: 0.03, mergeGrid: true, sizeTolerance: 2 };
const CUTOUT_SHARE = 0.15;          // a sheet with this share of pixels under alpha 16 is a cut-out sheet
const SPECK = 0.0006;               // a piece smaller than this share of the cell is dust, not part of the emblem

export async function readEmblemSheet(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height; let clear = 0;
  for (let i = 0; i < n; i++) if (data[i * 4 + 3] < 16) clear++;
  const mode = clear / n >= CUTOUT_SHARE ? 'alpha' : 'black';
  if (mode === 'black') {
    // An opaque sheet: composite onto black first, as every sheet reader does, so model residue under a low alpha never shows.
    const flat = await sharp(file).flatten({ background: '#000000' }).ensureAlpha().raw().toBuffer();
    return { rgba: flat, W: info.width, H: info.height, mode };
  }
  return { rgba: data, W: info.width, H: info.height, mode };
}

// The emblems of a sheet, one box per grid cell. Emblems differ in shape and may be several pieces (a bow and its quiver, a row of
// banners), so pieces are not found one by one: every connected piece above dust size is assigned to the grid cell that holds its
// centre and the boxes of a cell are united. The sheet is accepted only when each of the first `expected` cells holds an emblem and
// no other cell does; otherwise `problems` says which cell is empty or crowded. Nothing is guessed.
export function emblemRegions(sheet, cols, rows, expected, { minShare = SPECK } = {}) {
  const { rgba, W, H, mode } = sheet, n = W * H, fg = new Uint8Array(n);
  for (let p = 0; p < n; p++) fg[p] = (mode === 'alpha' ? rgba[p * 4 + 3] >= SOLID_ALPHA : Math.max(rgba[p * 4], rgba[p * 4 + 1], rgba[p * 4 + 2]) > GROUND_LUMA) ? 1 : 0;
  const cw = W / cols, ch = H / rows, minArea = Math.max(8, Math.round(cw * ch * minShare)), cells = new Map(), seen = new Uint8Array(n), problems = [];
  for (let s = 0; s < n; s++) {
    if (!fg[s] || seen[s]) continue;
    const stack = [s]; seen[s] = 1; let area = 0, x0 = W, y0 = H, x1 = 0, y1 = 0;
    while (stack.length) {
      const p = stack.pop(), x = p % W, y = (p / W) | 0; area++;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      if (x > 0 && fg[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack.push(p - 1); }
      if (x < W - 1 && fg[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack.push(p + 1); }
      if (y > 0 && fg[p - W] && !seen[p - W]) { seen[p - W] = 1; stack.push(p - W); }
      if (y < H - 1 && fg[p + W] && !seen[p + W]) { seen[p + W] = 1; stack.push(p + W); }
    }
    if (area < minArea) continue;
    const c = Math.min(cols - 1, Math.floor((x0 + x1) / 2 / cw)), r = Math.min(rows - 1, Math.floor((y0 + y1) / 2 / ch)), k = r * cols + c, box = cells.get(k);
    if (Math.floor(x0 / cw) !== Math.floor(x1 / cw) && (x1 - x0) > cw * 1.05) problems.push(`a piece at x ${x0}-${x1} spans more than one column`);
    cells.set(k, box ? { x0: Math.min(box.x0, x0), y0: Math.min(box.y0, y0), x1: Math.max(box.x1, x1 + 1), y1: Math.max(box.y1, y1 + 1) } : { x0, y0, x1: x1 + 1, y1: y1 + 1 });
  }
  for (let k = 0; k < cols * rows; k++) {
    if (k < expected && !cells.has(k)) problems.push(`cell ${k + 1} holds no emblem`);
    if (k >= expected && cells.has(k)) problems.push(`cell ${k + 1} holds an emblem but the sheet has ${expected}`);
  }
  const regions = []; for (let k = 0; k < expected; k++) if (cells.has(k)) regions.push(cells.get(k));
  return { ok: problems.length === 0, regions, problems, found: cells.size, W, H };
}

// Alpha of one cell. `region` is a box of the sheet ({ x0, y0, x1, y1 }, from findRegionsAdaptive with mergeGrid).
export function emblemCell(sheet, region, { pad = 6, erode = 1, ground = GROUND_LUMA, solid = SOLID_ALPHA } = {}) {
  const { rgba, W, H, mode } = sheet;
  const x0 = Math.max(0, region.x0 - pad), y0 = Math.max(0, region.y0 - pad), x1 = Math.min(W, region.x1 + pad), y1 = Math.min(H, region.y1 + pad);
  const w = x1 - x0, h = y1 - y0, n = w * h;
  let fg = new Uint8Array(n);
  if (mode === 'alpha') {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) fg[y * w + x] = rgba[((y0 + y) * W + x0 + x) * 4 + 3] >= solid ? 1 : 0;
  } else {
    // Ground = near-black pixels connected (4-neighbourhood) to the cell border; the rest is the emblem, holes included.
    const lum = new Uint8Array(n);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = ((y0 + y) * W + x0 + x) * 4; lum[y * w + x] = Math.max(rgba[i], rgba[i + 1], rgba[i + 2]); }
    const isGround = new Uint8Array(n), stack = [];
    const seed = p => { if (!isGround[p] && lum[p] <= ground) { isGround[p] = 1; stack.push(p); } };
    for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
    for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
    while (stack.length) { const p = stack.pop(), x = p % w, y = (p / w) | 0; if (x > 0) seed(p - 1); if (x < w - 1) seed(p + 1); if (y > 0) seed(p - w); if (y < h - 1) seed(p + w); }
    for (let p = 0; p < n; p++) fg[p] = isGround[p] ? 0 : 1;
  }
  // Dust: drop connected pieces smaller than SPECK of the cell.
  const seen = new Uint8Array(n), minArea = Math.max(4, Math.round(n * SPECK));
  for (let s = 0; s < n; s++) {
    if (!fg[s] || seen[s]) continue;
    const piece = [s]; seen[s] = 1;
    for (let k = 0; k < piece.length; k++) {
      const p = piece[k], x = p % w, y = (p / w) | 0;
      for (const [q, ok] of [[p - 1, x > 0], [p + 1, x < w - 1], [p - w, y > 0], [p + w, y < h - 1]]) if (ok && fg[q] && !seen[q]) { seen[q] = 1; piece.push(q); }
    }
    if (piece.length < minArea) for (const p of piece) fg[p] = 0;
  }
  // A thin erosion drops the black-mixed (or ground-mixed) fringe of the anti-aliased edge.
  for (let e = 0; e < erode; e++) {
    const next = new Uint8Array(fg);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const p = y * w + x; if (!fg[p]) continue;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1 || !fg[p - 1] || !fg[p + 1] || !fg[p - w] || !fg[p + w]) next[p] = 0;
    }
    fg = next;
  }
  const buf = Buffer.alloc(n * 4); let count = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x, i = ((y0 + y) * W + x0 + x) * 4, o = p * 4;
    buf[o] = rgba[i]; buf[o + 1] = rgba[i + 1]; buf[o + 2] = rgba[i + 2]; buf[o + 3] = fg[p] ? 255 : 0; count += fg[p];
  }
  return { buf, w, h, x0, y0, coverage: count / n };
}

export function alphaBounds(buf, w, h) {
  let a = w, b = h, c = -1, d = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (buf[(y * w + x) * 4 + 3]) { if (x < a) a = x; if (x > c) c = x; if (y < b) b = y; if (y > d) d = y; }
  if (c < 0) return null;
  return { left: a, top: b, width: c - a + 1, height: d - b + 1 };
}

// Trim the emblem to its alpha box and contain it in w x h with a transparent margin of `pad` pixels. Resizing premultiplies alpha, so
// the silhouette edge is anti-aliased and carries no halo of the ground colour.
export async function fitEmblem(cell, w, h, pad = 3) {
  const box = alphaBounds(cell.buf, cell.w, cell.h);
  if (!box) throw new Error('the emblem cell has no opaque pixel');
  const scale = Math.min((w - 2 * pad) / box.width, (h - 2 * pad) / box.height);
  const tw = Math.max(1, Math.round(box.width * scale)), th = Math.max(1, Math.round(box.height * scale));
  const small = await sharp(cell.buf, { raw: { width: cell.w, height: cell.h, channels: 4 } }).extract(box).resize(tw, th, { fit: 'fill', kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer();
  const out = Buffer.alloc(w * h * 4), ox = Math.floor((w - tw) / 2), oy = Math.floor((h - th) / 2);
  for (let y = 0; y < th; y++) small.copy(out, ((oy + y) * w + ox) * 4, y * tw * 4, (y + 1) * tw * 4);
  return out;
}

// The facts the standard talks about: how much of the picture is ground, whether the four corners are ground, and whether the edge
// is soft (partial alpha) or a hard cut.
export function shapeStats(rgba, w, h) {
  const n = w * h; let transparent = 0, minAlpha = 255, maxAlpha = 0, partial = 0;
  for (let i = 0; i < n; i++) { const a = rgba[i * 4 + 3]; if (a < 16) transparent++; if (a < minAlpha) minAlpha = a; if (a > maxAlpha) maxAlpha = a; if (a >= 16 && a < 240) partial++; }
  const corners = [0, w - 1, (h - 1) * w, n - 1].filter(p => rgba[p * 4 + 3] < 16).length;
  return { transparent: transparent / n, cornersTransparent: corners, minAlpha, maxAlpha, softEdge: partial / n };
}
