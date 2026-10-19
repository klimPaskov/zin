// Image headers, decoders and measurements for the interface reskin. It reads DDS, TGA, PNG, BMP, CUR, ICO and ANI,
// and measures the things the reskin spec calls the luminance class and the alpha kind. It never writes images (the
// writers are in raster.mjs) and it never draws: every function is a pure function of the bytes it is given.
//
//   readHeader(bytes, ext)   -> { ext, valid, format, width, height, bpp, ... }  (header only)
//   decodeRgba(bytes, ext)   -> Promise<{ width, height, data } | null>          (RGBA, top-left origin; null if unsupported)
//   measure(rgba, w, h)      -> { luma, luminance, alpha }                       (spec 02, principle 2 and the alpha kinds)
//   perceptualHash(rgba,w,h) -> { dhash, ahash }, hashDistance(p, q)             (builder check 5)
//
// DDS formats named like the spec: a8r8g8b8, x8r8g8b8, r8g8b8, r5g6b5, a1r5g5b5, a4r4g4b4, dxt1, dxt3, dxt5, ati1,
// ati2, rxgb and dx10:<dxgi format>. Decoders cover the uncompressed layouts, DXT1, DXT3, DXT5 and the 8-bit
// DX10 layouts; anything else decodes to null and is reported as unknown by the callers.
import sharp from 'sharp';

export const extOf = rel => { const m = /\.([A-Za-z0-9]+)$/.exec(rel); return m ? m[1].toLowerCase() : ''; };

// ---------------------------------------------------------------------------------------------------- headers
const FOURCC = { DXT1: 'dxt1', DXT2: 'dxt2', DXT3: 'dxt3', DXT4: 'dxt4', DXT5: 'dxt5', ATI1: 'ati1', BC4U: 'ati1', ATI2: 'ati2', BC5U: 'ati2', RXGB: 'rxgb', 'DX10': 'dx10' };
const bad = (ext, problem) => ({ ext, valid: false, format: 'invalid', width: 0, height: 0, bpp: 0, problem });

export function ddsHeader(b) {
  if (b.length < 128 || b.toString('ascii', 0, 4) !== 'DDS ' || b.readUInt32LE(4) !== 124) return bad('dds', 'not a DDS header');
  const flags = b.readUInt32LE(8), height = b.readUInt32LE(12), width = b.readUInt32LE(16), mipsRaw = b.readUInt32LE(28);
  const pf = b.readUInt32LE(80), fourcc = b.toString('ascii', 84, 88), bpp = b.readUInt32LE(88);
  const masks = [92, 96, 100, 104].map(o => b.readUInt32LE(o));
  const mips = flags & 0x20000 ? Math.max(1, mipsRaw) : 1;
  let format = 'other', dataOffset = 128, dxgi;
  if (pf & 0x4) {
    format = FOURCC[fourcc] ?? `other:${fourcc}`;
    if (format === 'dx10') { dxgi = b.length >= 148 ? b.readUInt32LE(128) : 0; dataOffset = 148; format = `dx10:${dxgi}`; }
  } else if (pf & 0x40) {
    const [r, g, bl, a] = masks;
    if (bpp === 32 && r === 0x00ff0000 && g === 0x0000ff00 && bl === 0x000000ff) format = (pf & 0x1) && a === 0xff000000 ? 'a8r8g8b8' : 'x8r8g8b8';
    else if (bpp === 24 && r === 0x00ff0000 && g === 0x0000ff00 && bl === 0x000000ff) format = 'r8g8b8';
    else if (bpp === 16 && r === 0xf800 && g === 0x07e0 && bl === 0x001f) format = 'r5g6b5';
    else if (bpp === 16 && r === 0x7c00 && g === 0x03e0 && bl === 0x001f) format = (pf & 0x1) ? 'a1r5g5b5' : 'x1r5g5b5';
    else if (bpp === 16 && r === 0x0f00 && g === 0x00f0 && bl === 0x000f) format = 'a4r4g4b4';
    else format = `other:rgb${bpp}`;
  } else if ((pf & 0x20000) && bpp === 8) format = 'l8';
  else if ((pf & 0x2) && bpp === 8) format = 'a8';
  return { ext: 'dds', valid: true, format, width, height, bpp, mips, masks, dataOffset, dxgi };
}

export function tgaHeader(b) {
  if (b.length < 18) return bad('tga', 'TGA shorter than its header');
  const type = b[2], width = b.readUInt16LE(12), height = b.readUInt16LE(14), bpp = b[16], desc = b[17];
  const known = { 1: 'tga_indexed', 2: 'tga', 3: 'tga_grey', 9: 'tga_indexed_rle', 10: 'tga_rle', 11: 'tga_grey_rle' };
  const base = known[type] ?? 'tga_other';
  const format = type === 2 ? `tga${bpp}` : type === 10 ? `tga${bpp}_rle` : `${base}${bpp}`;
  return { ext: 'tga', valid: true, format, width, height, bpp, imageType: type, idLength: b[0], colorMapType: b[1], colorMapStart: b.readUInt16LE(3), colorMapLength: b.readUInt16LE(5), colorMapDepth: b[7], topOrigin: !!(desc & 0x20), rightOrigin: !!(desc & 0x10), alphaBits: desc & 0x0f };
}

export function pngHeader(b) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (b.length < 29 || !b.subarray(0, 8).equals(sig)) return bad('png', 'not a PNG');
  const depth = b[24], color = b[25], channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[color] ?? 0;
  return { ext: 'png', valid: true, format: `png${depth * channels || depth}`, width: b.readUInt32BE(16), height: b.readUInt32BE(20), bpp: depth * channels, colorType: color, interlaced: b[28] === 1 };
}

export function bmpHeader(b) {
  if (b.length < 30 || b.toString('ascii', 0, 2) !== 'BM') return bad('bmp', 'not a BMP');
  const bpp = b.readUInt16LE(28);
  return { ext: 'bmp', valid: true, format: `bmp${bpp}`, width: b.readInt32LE(18), height: Math.abs(b.readInt32LE(22)), bpp };
}

// ICO and CUR: the directory of images. For a cursor the planes and bit-count fields hold the hotspot.
export function curHeader(b, ext = 'cur') {
  if (b.length < 22 || b.readUInt16LE(0) !== 0 || ![1, 2].includes(b.readUInt16LE(2)) || b.readUInt16LE(4) < 1) return bad(ext, `not a ${ext.toUpperCase()}`);
  const type = b.readUInt16LE(2), count = b.readUInt16LE(4);
  const entries = [];
  for (let i = 0; i < count && 6 + i * 16 + 16 <= b.length; i++) {
    const o = 6 + i * 16, size = b.readUInt32LE(o + 8), offset = b.readUInt32LE(o + 12);
    const png = offset + 8 <= b.length && b.subarray(offset, offset + 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    entries.push({ width: b[o] || 256, height: b[o + 1] || 256, hotspot: type === 2 ? [b.readUInt16LE(o + 4), b.readUInt16LE(o + 6)] : null, bpp: type === 2 ? null : b.readUInt16LE(o + 6), size, offset, payload: png ? 'png' : 'dib' });
  }
  const e = entries[0];
  return { ext, valid: !!e, format: type === 2 ? `cur_${e?.payload}` : `ico_${e?.payload}`, width: e?.width ?? 0, height: e?.height ?? 0, bpp: 32, entries, hotspot: e?.hotspot ?? null, count };
}

// ANI: a RIFF 'ACON' file. Reads the animation header (frames, steps, jiffies per step) and the first frame's directory.
export function aniHeader(b) {
  if (b.length < 12 || b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'ACON') return bad('ani', 'not an ANI');
  let frames = 0, steps = 0, jif = 0, flags = 0, cx = 0, cy = 0, first = null, hasSeq = false, hasRate = false;
  const scan = (from, to) => {
    let o = from;
    while (o + 8 <= to) {
      const id = b.toString('ascii', o, o + 4), size = b.readUInt32LE(o + 4), body = o + 8;
      if (id === 'anih' && body + 36 <= b.length) { frames = b.readUInt32LE(body + 4); steps = b.readUInt32LE(body + 8); cx = b.readUInt32LE(body + 12); cy = b.readUInt32LE(body + 16); jif = b.readUInt32LE(body + 28); flags = b.readUInt32LE(body + 32); }
      else if (id === 'seq ') hasSeq = true;
      else if (id === 'rate') hasRate = true;
      else if (id === 'icon' && !first) first = curHeader(b.subarray(body, Math.min(b.length, body + size)), 'cur');
      else if (id === 'LIST' && body + 4 <= b.length) scan(body + 4, Math.min(b.length, body + size));
      o = body + size + (size & 1);
    }
  };
  scan(12, b.length);
  return { ext: 'ani', valid: true, format: 'ani', width: first?.width ?? cx, height: first?.height ?? cy, bpp: 32, frames, steps, jifRate: jif, flags, hasSeq, hasRate, hotspot: first?.hotspot ?? null };
}

export function readHeader(bytes, ext) {
  switch (ext) {
    case 'dds': return ddsHeader(bytes);
    case 'tga': return tgaHeader(bytes);
    case 'png': return pngHeader(bytes);
    case 'bmp': return bmpHeader(bytes);
    case 'cur': case 'ico': return curHeader(bytes, ext);
    case 'ani': return aniHeader(bytes);
    default: return { ext, valid: true, format: ext || 'bin', width: 0, height: 0, bpp: 0 };
  }
}

// ---------------------------------------------------------------------------------------------------- decoders
const c565 = v => [((v >> 11) & 31) * 255 / 31 + 0.5 | 0, ((v >> 5) & 63) * 255 / 63 + 0.5 | 0, (v & 31) * 255 / 31 + 0.5 | 0];

function dxtColours(b, o, punch) {
  const c0 = b.readUInt16LE(o), c1 = b.readUInt16LE(o + 2), p0 = c565(c0), p1 = c565(c1), pal = [p0, p1];
  if (c0 > c1 || !punch) { pal.push([(2 * p0[0] + p1[0]) / 3 | 0, (2 * p0[1] + p1[1]) / 3 | 0, (2 * p0[2] + p1[2]) / 3 | 0], [(p0[0] + 2 * p1[0]) / 3 | 0, (p0[1] + 2 * p1[1]) / 3 | 0, (p0[2] + 2 * p1[2]) / 3 | 0]); }
  else pal.push([(p0[0] + p1[0]) / 2 | 0, (p0[1] + p1[1]) / 2 | 0, (p0[2] + p1[2]) / 2 | 0], null);
  return pal;
}
// A BC4-style alpha block (the alpha half of DXT5): returns 16 alpha values.
function alphaBlock(b, o) {
  const a0 = b[o], a1 = b[o + 1], lut = [a0, a1];
  if (a0 > a1) for (let i = 1; i <= 6; i++) lut.push(((7 - i) * a0 + i * a1) / 7 + 0.5 | 0);
  else { for (let i = 1; i <= 4; i++) lut.push(((5 - i) * a0 + i * a1) / 5 + 0.5 | 0); lut.push(0, 255); }
  let bits = 0n; for (let i = 5; i >= 0; i--) bits = (bits << 8n) | BigInt(b[o + 2 + i]);
  const out = new Array(16); for (let i = 0; i < 16; i++) out[i] = lut[Number((bits >> BigInt(3 * i)) & 7n)];
  return out;
}

function decodeDxt(b, h, kind) {
  const { width: w, height: ht, dataOffset } = h, bw = Math.ceil(w / 4), bh = Math.ceil(ht / 4), size = kind === 'dxt1' ? 8 : 16;
  if (b.length < dataOffset + bw * bh * size) return null;
  const out = Buffer.alloc(w * ht * 4);
  let o = dataOffset;
  for (let by = 0; by < bh; by++) for (let bx = 0; bx < bw; bx++, o += size) {
    let alpha = null;
    if (kind === 'dxt3') { alpha = new Array(16); for (let i = 0; i < 16; i++) { const v = (b[o + (i >> 1)] >> ((i & 1) * 4)) & 15; alpha[i] = v * 17; } }
    else if (kind === 'dxt5') alpha = alphaBlock(b, o);
    const co = kind === 'dxt1' ? o : o + 8, pal = dxtColours(b, co, kind === 'dxt1'), idx = b.readUInt32LE(co + 4);
    for (let i = 0; i < 16; i++) {
      const x = bx * 4 + (i & 3), y = by * 4 + (i >> 2);
      if (x >= w || y >= ht) continue;
      const c = pal[(idx >> (2 * i)) & 3], d = (y * w + x) * 4;
      if (c) { out[d] = c[0]; out[d + 1] = c[1]; out[d + 2] = c[2]; out[d + 3] = alpha ? alpha[i] : 255; } else { out[d] = out[d + 1] = out[d + 2] = 0; out[d + 3] = 0; }
    }
  }
  return out;
}

function decodeDds(b, h) {
  const { width: w, height: ht, dataOffset: off, format } = h;
  if (!w || !ht) return null;
  const out = Buffer.alloc(w * ht * 4), n = w * ht;
  switch (format) {
    case 'a8r8g8b8': case 'x8r8g8b8': {
      if (b.length < off + n * 4) return null;
      for (let i = 0; i < n; i++) { const s = off + i * 4; out[i * 4] = b[s + 2]; out[i * 4 + 1] = b[s + 1]; out[i * 4 + 2] = b[s]; out[i * 4 + 3] = format === 'a8r8g8b8' ? b[s + 3] : 255; }
      return out;
    }
    case 'r8g8b8': {
      if (b.length < off + n * 3) return null;
      for (let i = 0; i < n; i++) { const s = off + i * 3; out[i * 4] = b[s + 2]; out[i * 4 + 1] = b[s + 1]; out[i * 4 + 2] = b[s]; out[i * 4 + 3] = 255; }
      return out;
    }
    case 'r5g6b5': case 'a1r5g5b5': case 'x1r5g5b5': case 'a4r4g4b4': {
      if (b.length < off + n * 2) return null;
      for (let i = 0; i < n; i++) {
        const v = b.readUInt16LE(off + i * 2), d = i * 4;
        if (format === 'r5g6b5') { const c = c565(v); out[d] = c[0]; out[d + 1] = c[1]; out[d + 2] = c[2]; out[d + 3] = 255; }
        else if (format === 'a4r4g4b4') { out[d] = ((v >> 8) & 15) * 17; out[d + 1] = ((v >> 4) & 15) * 17; out[d + 2] = (v & 15) * 17; out[d + 3] = ((v >> 12) & 15) * 17; }
        else { out[d] = ((v >> 10) & 31) * 255 / 31 + 0.5 | 0; out[d + 1] = ((v >> 5) & 31) * 255 / 31 + 0.5 | 0; out[d + 2] = (v & 31) * 255 / 31 + 0.5 | 0; out[d + 3] = format === 'a1r5g5b5' && !(v & 0x8000) ? 0 : 255; }
      }
      return out;
    }
    case 'l8': { if (b.length < off + n) return null; for (let i = 0; i < n; i++) { const v = b[off + i]; out[i * 4] = out[i * 4 + 1] = out[i * 4 + 2] = v; out[i * 4 + 3] = 255; } return out; }
    case 'a8': { if (b.length < off + n) return null; for (let i = 0; i < n; i++) { out[i * 4 + 3] = b[off + i]; } return out; }
    case 'dxt1': case 'dxt3': case 'dxt5': return decodeDxt(b, h, format);
    case 'dx10:28': case 'dx10:29': case 'dx10:87': case 'dx10:91': {
      if (b.length < off + n * 4) return null;
      const bgra = format === 'dx10:87' || format === 'dx10:91';
      for (let i = 0; i < n; i++) { const s = off + i * 4; out[i * 4] = b[s + (bgra ? 2 : 0)]; out[i * 4 + 1] = b[s + 1]; out[i * 4 + 2] = b[s + (bgra ? 0 : 2)]; out[i * 4 + 3] = b[s + 3]; }
      return out;
    }
    case 'dx10:71': case 'dx10:72': return decodeDxt(b, h, 'dxt1');
    case 'dx10:74': case 'dx10:75': return decodeDxt(b, h, 'dxt3');
    case 'dx10:77': case 'dx10:78': return decodeDxt(b, h, 'dxt5');
    default: return null;
  }
}

function decodeTga(b, h) {
  const { width: w, height: ht, bpp, imageType: type, idLength } = h;
  if (!w || !ht || ![2, 3, 10, 11, 1, 9].includes(type)) return null;
  const indexed = type === 1 || type === 9, rle = type >= 9, px = Math.ceil(bpp / 8);
  if (![8, 16, 24, 32].includes(bpp)) return null;
  let o = 18 + idLength, palette = null;
  if (h.colorMapType === 1) {
    const ps = Math.ceil(h.colorMapDepth / 8); palette = [];
    for (let i = 0; i < h.colorMapLength; i++, o += ps) palette.push(ps >= 3 ? [b[o + 2], b[o + 1], b[o], ps === 4 ? b[o + 3] : 255] : [0, 0, 0, 255]);
  }
  const raw = Buffer.alloc(w * ht * px);
  if (!rle) { if (b.length < o + raw.length) return null; b.copy(raw, 0, o, o + raw.length); }
  else {
    let d = 0;
    while (d < raw.length && o < b.length) {
      const head = b[o++], count = (head & 0x7f) + 1;
      if (head & 0x80) { for (let k = 0; k < count && d < raw.length; k++) { for (let c = 0; c < px; c++) raw[d + c] = b[o + c]; d += px; } o += px; }
      else { const len = Math.min(count * px, raw.length - d); b.copy(raw, d, o, o + len); d += len; o += count * px; }
    }
    if (d < raw.length) return null;
  }
  const out = Buffer.alloc(w * ht * 4);
  for (let y = 0; y < ht; y++) {
    const sy = h.topOrigin ? y : ht - 1 - y;
    for (let x = 0; x < w; x++) {
      const sx = h.rightOrigin ? w - 1 - x : x, s = (sy * w + sx) * px, d = (y * w + x) * 4;
      if (indexed) { const c = palette?.[raw[s] - h.colorMapStart] ?? [0, 0, 0, 255]; out[d] = c[0]; out[d + 1] = c[1]; out[d + 2] = c[2]; out[d + 3] = c[3]; }
      else if (type === 3 || type === 11) { out[d] = out[d + 1] = out[d + 2] = raw[s]; out[d + 3] = px === 2 ? raw[s + 1] : 255; }
      else if (px === 2) { const v = raw[s] | (raw[s + 1] << 8); out[d] = ((v >> 10) & 31) * 255 / 31 + 0.5 | 0; out[d + 1] = ((v >> 5) & 31) * 255 / 31 + 0.5 | 0; out[d + 2] = (v & 31) * 255 / 31 + 0.5 | 0; out[d + 3] = h.alphaBits ? (v & 0x8000 ? 255 : 0) : 255; }
      else { out[d] = raw[s + 2]; out[d + 1] = raw[s + 1]; out[d + 2] = raw[s]; out[d + 3] = px === 4 ? raw[s + 3] : 255; }
    }
  }
  return out;
}

export async function decodeRgba(bytes, ext, header = readHeader(bytes, ext)) {
  if (!header.valid || !header.width || !header.height) return null;
  let data = null;
  try {
    if (ext === 'dds') data = decodeDds(bytes, header);
    else if (ext === 'tga') data = decodeTga(bytes, header);
    else if (ext === 'png' || ext === 'bmp') { const r = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); return { width: r.info.width, height: r.info.height, data: r.data }; }
  } catch { data = null; }
  return data ? { width: header.width, height: header.height, data } : null;
}

// ---------------------------------------------------------------------------------------------------- measurements
// Luminance class thresholds on the 0-255 scale (proposed; recorded in the inventory header). The mean is alpha
// weighted, so a transparent margin does not change the class.
export const LUMA = { dark: 96, light: 160 };
export const luminanceClass = mean => mean === null ? 'none' : mean < LUMA.dark ? 'dark' : mean < LUMA.light ? 'mid' : 'light';

// { luma, luminance, alpha, coverage }: alpha is 'opaque', 'empty', 'keyed' (only 0 and 255), 'uniform:<a>' or 'shaped';
// coverage is the fraction of pixels with alpha of 128 or more (a shaped texture that is nearly all solid is a panel).
export function measure(rgba, w, h) {
  const n = w * h;
  let sum = 0, weight = 0, min = 255, max = 0, binary = true, solid = 0;
  for (let i = 0; i < n; i++) {
    const o = i * 4, a = rgba[o + 3];
    if (a < min) min = a; if (a > max) max = a; if (a !== 0 && a !== 255) binary = false; if (a >= 128) solid++;
    if (a) { sum += (0.299 * rgba[o] + 0.587 * rgba[o + 1] + 0.114 * rgba[o + 2]) * a; weight += a; }
  }
  const luma = weight ? Math.round(sum / weight * 100) / 100 : null;
  const alpha = n === 0 ? 'empty' : max === 0 ? 'empty' : min === 255 ? 'opaque' : min === max ? `uniform:${min}` : binary ? 'keyed' : 'shaped';
  return { luma, luminance: luminanceClass(luma), alpha, coverage: n ? Math.round(solid / n * 1000) / 1000 : 0 };
}

// ---------------------------------------------------------------------------------------------------- perceptual hash
// A 64-bit difference hash (9x8 grey) and average hash (8x8 grey), box filtered, transparent pixels composited over
// mid grey. The same pixels give the same hash on every machine. Check 5 compares an R output with its vanilla file.
function greyPlane(rgba, w, h) {
  const g = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const a = rgba[i * 4 + 3] / 255;
    g[i] = 0.299 * (rgba[i * 4] * a + 128 * (1 - a)) + 0.587 * (rgba[i * 4 + 1] * a + 128 * (1 - a)) + 0.114 * (rgba[i * 4 + 2] * a + 128 * (1 - a));
  }
  return g;
}
function reduce(grey, w, h, tw, th) {
  const out = new Float64Array(tw * th);
  for (let ty = 0; ty < th; ty++) {
    const y0 = Math.floor(ty * h / th), y1 = Math.max(y0 + 1, Math.floor((ty + 1) * h / th));
    for (let tx = 0; tx < tw; tx++) {
      const x0 = Math.floor(tx * w / tw), x1 = Math.max(x0 + 1, Math.floor((tx + 1) * w / tw));
      let s = 0, c = 0;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { s += grey[y * w + x]; c++; }
      out[ty * tw + tx] = s / c;
    }
  }
  return out;
}
const bitsHex = bits => { let v = 0n; for (const b of bits) v = (v << 1n) | (b ? 1n : 0n); return v.toString(16).padStart(16, '0'); };
export function perceptualHash(rgba, w, h) {
  const grey = greyPlane(rgba, w, h), d = reduce(grey, w, h, 9, 8), a = reduce(grey, w, h, 8, 8), mean = a.reduce((s, v) => s + v, 0) / a.length, db = [];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) db.push(d[y * 9 + x] > d[y * 9 + x + 1]);
  return { dhash: bitsHex(db), ahash: bitsHex(Array.from(a, v => v > mean)) };
}
export function hamming(x, y) { let v = BigInt(`0x${x}`) ^ BigInt(`0x${y}`), n = 0; while (v) { n += Number(v & 1n); v >>= 1n; } return n; }
export const hashDistance = (p, q) => Math.max(hamming(p.dhash, q.dhash), hamming(p.ahash, q.ahash));
