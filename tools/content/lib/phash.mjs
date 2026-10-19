// Perceptual hashes of shipped pictures (asset manifest spec, section 5): a 64-bit difference hash (grey, 9 x 8),
// a 64-bit average hash (grey, 8 x 8) and the mean luma. They are computed from decoded RGBA pixels with a box
// filter, so the same pixels always give the same hash on every machine (no sharp, no floating-point libraries).
// Transparent pixels are composited over mid grey first, so a transparent corner does not change the hash.

const toGrey = (rgba, w, h) => {
  const g = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const a = rgba[i * 4 + 3] / 255;
    const r = rgba[i * 4] * a + 128 * (1 - a), gr = rgba[i * 4 + 1] * a + 128 * (1 - a), b = rgba[i * 4 + 2] * a + 128 * (1 - a);
    g[i] = 0.299 * r + 0.587 * gr + 0.114 * b;
  }
  return g;
};

// Box-filter reduction of a grey plane to tw x th.
function reduce(grey, w, h, tw, th) {
  const out = new Float64Array(tw * th);
  for (let ty = 0; ty < th; ty++) {
    const y0 = Math.floor(ty * h / th), y1 = Math.max(y0 + 1, Math.floor((ty + 1) * h / th));
    for (let tx = 0; tx < tw; tx++) {
      const x0 = Math.floor(tx * w / tw), x1 = Math.max(x0 + 1, Math.floor((tx + 1) * w / tw));
      let sum = 0, n = 0;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { sum += grey[y * w + x]; n++; }
      out[ty * tw + tx] = sum / n;
    }
  }
  return out;
}

const bitsToHex = bits => {
  let v = 0n;
  for (const b of bits) v = (v << 1n) | (b ? 1n : 0n);
  return v.toString(16).padStart(16, '0');
};

export function perceptualHashes(rgba, w, h) {
  if (!w || !h || rgba.length < w * h * 4) return null;
  const grey = toGrey(rgba, w, h);
  const d = reduce(grey, w, h, 9, 8), dbits = [];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) dbits.push(d[y * 9 + x] > d[y * 9 + x + 1]);
  const a = reduce(grey, w, h, 8, 8), mean = a.reduce((s, v) => s + v, 0) / a.length;
  const abits = Array.from(a, v => v > mean);
  let luma = 0; for (let i = 0; i < grey.length; i++) luma += grey[i];
  return { dhash: bitsToHex(dbits), ahash: bitsToHex(abits), luma_mean: Math.round(luma / grey.length * 100) / 100 };
}

export function hamming(hexA, hexB) {
  let v = BigInt(`0x${hexA}`) ^ BigInt(`0x${hexB}`), n = 0;
  while (v) { n += Number(v & 1n); v >>= 1n; }
  return n;
}

// The distance of the spec: the larger of the two Hamming distances.
export const phashDistance = (p, q) => Math.max(hamming(p.dhash, q.dhash), hamming(p.ahash, q.ahash));
