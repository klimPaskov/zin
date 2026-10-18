// Minimal deterministic raster: anti-aliased polygons by 4x4 supersampling, written as 32-bit TGA or DDS.
export class Canvas {
  constructor(w, h, fill = [0, 0, 0, 0]) { this.w = w; this.h = h; this.px = new Float32Array(w * h * 4); for (let i = 0; i < w * h; i++) this.px.set(fill, i * 4); }
  // Blend colour [r,g,b,a(0-255)] at (x,y) with coverage 0..1.
  blend(x, y, c, cov) {
    if (cov <= 0 || x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4, a = (c[3] ?? 255) / 255 * cov, da = this.px[i + 3] / 255, oa = a + da * (1 - a);
    for (let k = 0; k < 3; k++) this.px[i + k] = oa ? (c[k] * a + this.px[i + k] * da * (1 - a)) / oa : 0;
    this.px[i + 3] = oa * 255;
  }
  // Fill with an inside(x,y) test evaluated on a 4x4 grid inside each pixel of the bounding box.
  fillShape(inside, box, c) {
    const [x0, y0, x1, y1] = box.map((v, i) => i < 2 ? Math.max(0, Math.floor(v)) : Math.min(i === 2 ? this.w : this.h, Math.ceil(v)));
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      let hit = 0; for (let sy = 0; sy < 4; sy++) for (let sx = 0; sx < 4; sx++) if (inside(x + (sx + 0.5) / 4, y + (sy + 0.5) / 4)) hit++;
      this.blend(x, y, c, hit / 16);
    }
  }
  rect(x0, y0, x1, y1, c) { this.fillShape((x, y) => x >= x0 && x < x1 && y >= y0 && y < y1, [x0, y0, x1, y1], c); }
  polygon(pts, c) {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    this.fillShape((x, y) => { let inside = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside; } return inside; }, [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], c);
  }
  ellipse(cx, cy, rx, ry, c) { this.fillShape((x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, [cx - rx, cy - ry, cx + rx, cy + ry], c); }
  ring(cx, cy, r0, r1, c) { this.fillShape((x, y) => { const d = Math.hypot(x - cx, y - cy); return d >= r0 && d <= r1; }, [cx - r1, cy - r1, cx + r1, cy + r1], c); }
  star(cx, cy, r, points, c, inner = 0.45, rot = -Math.PI / 2) { const pts = []; for (let i = 0; i < points * 2; i++) { const rr = i % 2 ? r * inner : r, a = rot + i * Math.PI / points; pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); } this.polygon(pts, c); }
  // Vertical gradient overlay used for depth on flags and frames.
  shade(top, bottom) { for (let y = 0; y < this.h; y++) { const t = y / Math.max(1, this.h - 1), f = top + (bottom - top) * t; for (let x = 0; x < this.w; x++) { const i = (y * this.w + x) * 4; for (let k = 0; k < 3; k++) this.px[i + k] = Math.max(0, Math.min(255, this.px[i + k] * f)); } } }
  rgba() { const out = Buffer.alloc(this.w * this.h * 4); for (let i = 0; i < this.px.length; i++) out[i] = Math.round(Math.max(0, Math.min(255, this.px[i]))); return out; }
  // Box-filter downscale by an integer factor or to explicit size (nearest box).
  resize(w, h) { const out = new Canvas(w, h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const sx0 = Math.floor(x * this.w / w), sx1 = Math.max(sx0 + 1, Math.floor((x + 1) * this.w / w)), sy0 = Math.floor(y * this.h / h), sy1 = Math.max(sy0 + 1, Math.floor((y + 1) * this.h / h)); const acc = [0, 0, 0, 0]; let n = 0; for (let yy = sy0; yy < sy1; yy++) for (let xx = sx0; xx < sx1; xx++) { const i = (yy * this.w + xx) * 4; const a = this.px[i + 3]; acc[0] += this.px[i] * a; acc[1] += this.px[i + 1] * a; acc[2] += this.px[i + 2] * a; acc[3] += a; n++; } const o = (y * w + x) * 4; out.px[o + 3] = acc[3] / n; for (let k = 0; k < 3; k++) out.px[o + k] = acc[3] ? acc[k] / acc[3] : 0; } return out; }
}

// Uncompressed 32-bit TGA, bottom-left origin (the orientation HOI4 flags use).
export function tga(canvas) {
  const head = Buffer.alloc(18); head[2] = 2; head.writeUInt16LE(canvas.w, 12); head.writeUInt16LE(canvas.h, 14); head[16] = 32; head[17] = 8;
  const src = canvas.rgba(), body = Buffer.alloc(canvas.w * canvas.h * 4);
  for (let y = 0; y < canvas.h; y++) for (let x = 0; x < canvas.w; x++) { const s = (y * canvas.w + x) * 4, d = ((canvas.h - 1 - y) * canvas.w + x) * 4; body[d] = src[s + 2]; body[d + 1] = src[s + 1]; body[d + 2] = src[s]; body[d + 3] = src[s + 3]; }
  return Buffer.concat([head, body]);
}

// Uncompressed A8R8G8B8 DDS, top-left origin.
export function dds(canvas) {
  const h = Buffer.alloc(128); h.write('DDS ', 0, 'ascii'); h.writeUInt32LE(124, 4); h.writeUInt32LE(0x1 | 0x2 | 0x4 | 0x8 | 0x1000, 8);
  h.writeUInt32LE(canvas.h, 12); h.writeUInt32LE(canvas.w, 16); h.writeUInt32LE(canvas.w * 4, 20);
  h.writeUInt32LE(32, 76); h.writeUInt32LE(0x41, 80); h.writeUInt32LE(32, 88); h.writeUInt32LE(0x00ff0000, 92); h.writeUInt32LE(0x0000ff00, 96); h.writeUInt32LE(0x000000ff, 100); h.writeUInt32LE(0xff000000, 104); h.writeUInt32LE(0x1000, 108);
  const src = canvas.rgba(), body = Buffer.alloc(src.length);
  for (let i = 0; i < src.length; i += 4) { body[i] = src[i + 2]; body[i + 1] = src[i + 1]; body[i + 2] = src[i]; body[i + 3] = src[i + 3]; }
  return Buffer.concat([h, body]);
}

export const hex = s => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16), 255];

// Wrap RGBA bytes (e.g. a resized crop of generated art) so the TGA/DDS writers can encode them.
export function fromRaw(buf, w, h) { const c = new Canvas(w, h); for (let i = 0; i < w * h * 4; i++) c.px[i] = buf[i]; return c; }
