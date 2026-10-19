// Header readers for the image files ZIN ships: DDS, TGA, PNG, BMP. They read the header only (and, for the
// perceptual hashes in phash.mjs, the pixels of the uncompressed formats). They never write.
//
//   imageInfo(bytes, ext) -> { format, width, height, mips, bpp, valid, problem? }
//
// `format` is a short class used by the format rules of the asset check:
//   dds: a8r8g8b8 | x8r8g8b8 | r8g8b8 | bc1 | bc2 | bc3 | bc4 | bc5 | bc7 | dx10 | other
//   tga: tga32 | tga24 | tga8 | tga_rle | tga_other
//   png: png      bmp: bmp8 | bmp24 | bmp32 | bmp_other
// Anything else (cur, ani, mesh, anim, wav, ogg, txt) is classified by its extension only.

const u32 = (b, o) => b.readUInt32LE(o);
const FOURCC = { DXT1: 'bc1', DXT3: 'bc2', DXT5: 'bc3', ATI1: 'bc4', BC4U: 'bc4', ATI2: 'bc5', BC5U: 'bc5', 'DX10': 'dx10' };

export function ddsInfo(b) {
  if (b.length < 128 || b.toString('ascii', 0, 4) !== 'DDS ' || u32(b, 4) !== 124) return { format: 'invalid', width: 0, height: 0, mips: 0, bpp: 0, valid: false, problem: 'not a DDS header' };
  const flags = u32(b, 8), height = u32(b, 12), width = u32(b, 16), mipsRaw = u32(b, 28);
  const pfFlags = u32(b, 80), fourcc = b.toString('ascii', 84, 88), bpp = u32(b, 88);
  const masks = [92, 96, 100, 104].map(o => u32(b, o));
  const mips = flags & 0x20000 ? Math.max(1, mipsRaw) : 1;
  let format = 'other';
  if (pfFlags & 0x4) format = FOURCC[fourcc] ?? 'other';
  else if ((pfFlags & 0x40) && bpp === 32) format = (pfFlags & 0x1) && masks[3] === 0xff000000 && masks[0] === 0x00ff0000 && masks[1] === 0x0000ff00 && masks[2] === 0x000000ff ? 'a8r8g8b8' : (masks[0] === 0x00ff0000 && masks[1] === 0x0000ff00 && masks[2] === 0x000000ff ? 'x8r8g8b8' : 'other');
  else if ((pfFlags & 0x40) && bpp === 24) format = 'r8g8b8';
  return { format, width, height, mips, bpp, valid: true, masks, fourcc: pfFlags & 0x4 ? fourcc : '', dataOffset: fourcc === 'DX10' ? 148 : 128 };
}

export function tgaInfo(b) {
  if (b.length < 18) return { format: 'invalid', width: 0, height: 0, mips: 1, bpp: 0, valid: false, problem: 'TGA shorter than its header' };
  const type = b[2], width = b.readUInt16LE(12), height = b.readUInt16LE(14), bpp = b[16], descriptor = b[17];
  let format = 'tga_other';
  if (type === 2) format = bpp === 32 ? 'tga32' : bpp === 24 ? 'tga24' : 'tga_other';
  else if (type === 3 && bpp === 8) format = 'tga8';
  else if (type === 10) format = 'tga_rle';
  return { format, width, height, mips: 1, bpp, valid: true, topOrigin: !!(descriptor & 0x20), idLength: b[0], colorMapType: b[1], imageType: type, dataOffset: 18 + b[0] };
}

export function pngInfo(b) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (b.length < 24 || !b.subarray(0, 8).equals(sig)) return { format: 'invalid', width: 0, height: 0, mips: 1, bpp: 0, valid: false, problem: 'not a PNG' };
  return { format: 'png', width: b.readUInt32BE(16), height: b.readUInt32BE(20), mips: 1, bpp: b[24] * (b[25] === 6 ? 4 : b[25] === 2 ? 3 : 1), valid: true };
}

export function bmpInfo(b) {
  if (b.length < 30 || b.toString('ascii', 0, 2) !== 'BM') return { format: 'invalid', width: 0, height: 0, mips: 1, bpp: 0, valid: false, problem: 'not a BMP' };
  const width = b.readInt32LE(18), height = Math.abs(b.readInt32LE(22)), bpp = b.readUInt16LE(28);
  return { format: bpp === 8 ? 'bmp8' : bpp === 24 ? 'bmp24' : bpp === 32 ? 'bmp32' : 'bmp_other', width, height, mips: 1, bpp, valid: true };
}

export const IMAGE_EXTS = new Set(['dds', 'tga', 'png', 'bmp']);
export const extOf = rel => { const m = /\.([A-Za-z0-9]+)$/.exec(rel); return m ? m[1].toLowerCase() : ''; };

export function imageInfo(bytes, ext) {
  switch (ext) {
    case 'dds': return ddsInfo(bytes);
    case 'tga': return tgaInfo(bytes);
    case 'png': return pngInfo(bytes);
    case 'bmp': return bmpInfo(bytes);
    default: return { format: ext || 'bin', width: 0, height: 0, mips: 1, bpp: 0, valid: true };
  }
}

export const isPowerOfTwo = n => Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0;

// Decode an uncompressed image to RGBA (top-left origin); null for compressed or unknown layouts.
export function decodeRgba(bytes, ext, info = imageInfo(bytes, ext)) {
  if (!info.valid || !info.width || !info.height) return null;
  const { width: w, height: h } = info;
  if (ext === 'dds' && (info.format === 'a8r8g8b8' || info.format === 'x8r8g8b8')) {
    if (bytes.length < 128 + w * h * 4) return null;
    const out = Buffer.alloc(w * h * 4);
    for (let i = 0; i < w * h; i++) { const s = 128 + i * 4; out[i * 4] = bytes[s + 2]; out[i * 4 + 1] = bytes[s + 1]; out[i * 4 + 2] = bytes[s]; out[i * 4 + 3] = info.format === 'a8r8g8b8' ? bytes[s + 3] : 255; }
    return out;
  }
  if (ext === 'tga' && (info.format === 'tga32' || info.format === 'tga24')) {
    const px = info.bpp / 8, off = info.dataOffset;
    if (bytes.length < off + w * h * px) return null;
    const out = Buffer.alloc(w * h * 4);
    for (let y = 0; y < h; y++) {
      const sy = info.topOrigin ? y : h - 1 - y;
      for (let x = 0; x < w; x++) { const s = off + (sy * w + x) * px, d = (y * w + x) * 4; out[d] = bytes[s + 2]; out[d + 1] = bytes[s + 1]; out[d + 2] = bytes[s]; out[d + 3] = px === 4 ? bytes[s + 3] : 255; }
    }
    return out;
  }
  return null;
}
