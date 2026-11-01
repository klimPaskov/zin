// Text measurement for fixed-size text boxes (docs/specs/07_interface/04_chronicle_codex.md section 7). It reads the
// glyph advances and kerning of the installed game's bitmap fonts (BMFont text format, gfx/fonts/*.fnt) for
// measurement only; nothing of the font is copied into the mod.
//
//   const f = await loadFont('garamond_16')          -> { lineHeight, width(text), wrap(text, maxWidth) -> lines[] }
//
// Wrapping is greedy by words, as the engine's fixed-size text boxes wrap; a "\n" forces a break and an empty line
// counts as a line. Characters are measured in Windows-1252, the code page of the engine's text.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { GAME } from './paths.mjs';

const cache = new Map();
const CP1252 = { 0x20ac: 128, 0x201a: 130, 0x192: 131, 0x201e: 132, 0x2026: 133, 0x2020: 134, 0x2021: 135, 0x2c6: 136, 0x2030: 137, 0x160: 138, 0x2039: 139, 0x152: 140, 0x17d: 142, 0x2018: 145, 0x2019: 146, 0x201c: 147, 0x201d: 148, 0x2022: 149, 0x2013: 150, 0x2014: 151, 0x2dc: 152, 0x2122: 153, 0x161: 154, 0x203a: 155, 0x153: 156, 0x17e: 158, 0x178: 159 };
export const cp1252 = ch => { const c = ch.codePointAt(0); if (c < 128 || (c >= 160 && c < 256)) return c; return CP1252[c] ?? null; };

export async function loadFont(name, game = GAME) {
  if (cache.has(name)) return cache.get(name);
  const text = await readFile(path.join(game, 'gfx/fonts', `${name}.fnt`), 'latin1');
  const adv = new Map(), kern = new Map();
  let lineHeight = 16;
  for (const line of text.split(/\r?\n/)) {
    const kv = Object.fromEntries([...line.matchAll(/(\w+)=(-?\d+)/g)].map(m => [m[1], Number(m[2])]));
    if (line.startsWith('common ')) lineHeight = kv.lineHeight;
    else if (line.startsWith('char ')) adv.set(kv.id, kv.xadvance);
    else if (line.startsWith('kerning ')) kern.set(`${kv.first},${kv.second}`, kv.amount);
  }
  const fallback = adv.get(63) ?? 8;
  const width = s => {
    let w = 0, prev = null;
    for (const ch of s) {
      const c = cp1252(ch) ?? 63;
      w += adv.get(c) ?? fallback;
      if (prev !== null) w += kern.get(`${prev},${c}`) ?? 0;
      prev = c;
    }
    return w;
  };
  const wrap = (s, max) => {
    const lines = [];
    for (const para of String(s).split('\n')) {
      if (para === '') { lines.push(''); continue; }
      let cur = '';
      for (const word of para.split(' ')) {
        const next = cur ? `${cur} ${word}` : word;
        if (width(next) <= max || !cur) cur = next; else { lines.push(cur); cur = word; }
      }
      lines.push(cur);
    }
    return lines;
  };
  const f = { name, lineHeight, width, wrap };
  cache.set(name, f);
  return f;
}
