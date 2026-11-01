// League emblems (UI lane W2 with icon lane I9; design system docs/specs/07_interface/07_design_system.md §4.2: faction, 200 x 100 with
// 2 frames, a Chancery faction shield bearing the league's own sign). Every shield is image-generated (gpt-6-luna, owner route); this
// module only finds, cuts on the shield's own outline, reduces and places what the image model produced. The cell map is the tracked
// tools/content/data/faction_art_cells.json; modules/diplomacy.mjs points GFX_zin_faction_<key> and its miniature at the textures this
// module ships, and keeps the interim vanilla logo for a key whose sheet is not accepted.
//   frame 1: the shield contained in 100 x 100 with an 8% margin; frame 2 (the engine's selected state): the same shield filling the
//   frame, one step larger; miniature: 32 x 32.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { rawFile, provenanceFile } from '../lib/paths.mjs';
import { fromRaw, dds } from '../lib/raster.mjs';
import { contain, makeImg, blit } from '../lib/fit.mjs';
import { acceptance } from './presentation.mjs';
import { readSheetCells } from './ui_reskin.mjs';

export const CELLS_FILE = fileURLToPath(new URL('../data/faction_art_cells.json', import.meta.url));
export const FACTION_DIR = 'gfx/interface/factions/zin';
export const SIZE = { frame: 100, miniature: 32 };
export const PAD = { normal: 0.08, selected: 0, miniature: 0.02 };
export const factionTexture = key => `${FACTION_DIR}/${key}.dds`;
export const miniatureTexture = key => `${FACTION_DIR}/${key}_miniature.dds`;
const sha256 = b => createHash('sha256').update(b).digest('hex');

// The sheet as the reskin cutter reads it: a 3 x 3 grid of items on black, each cut on its own outline.
export const sheetOf = s => ({ id: s.sheet, kind: 'grid', aspect: '1:1', grid: [s.cols, s.rows], ground: 'black', matte: 'outline', cells: s.keys.map(key => ({ key })) });

// The two frames side by side (200 x 100) and the miniature of one cut shield.
export async function emblemImages(cell) {
  const f = SIZE.frame, strip = makeImg(2 * f, f);
  const normal = await contain(cell, f, f, PAD.normal), selected = await contain(cell, f, f, PAD.selected);
  blit(strip, normal.img, 0, 0); blit(strip, selected.img, f, 0);
  const mini = await contain(cell, SIZE.miniature, SIZE.miniature, PAD.miniature);
  return { strip, mini: mini.img, ops: { strip: [`frame 1 ${normal.ops.join(', ')}`, `frame 2 ${selected.ops.join(', ')}`], mini: mini.ops } };
}

// Builds every accepted league emblem into the staged tree. Returns the set of keys shipped.
export async function buildFactionArt(staged, { warn = () => {}, provenance } = {}) {
  const cells = JSON.parse(await readFile(CELLS_FILE, 'utf8'));
  const lines = provenance ?? (await readFile(provenanceFile(), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l));
  const shipped = new Set(), manifest = [];
  for (const s of cells.sheets) {
    const rel = `factions/${s.sheet}.png`;
    let bytes;
    try { bytes = await readFile(rawFile(rel)); } catch { warn(`${rel}: not generated; ${s.keys.length} leagues keep the interim logo`); continue; }
    const acc = acceptance(lines, rel, bytes);
    if (!acc.ok) { warn(`${rel}: ${acc.why}; ${s.keys.length} leagues keep the interim logo`); continue; }
    const cut = await readSheetCells(sheetOf(s), rawFile(rel));
    for (const [i, key] of s.keys.entries()) {
      if (key === null) continue; // a retired cell: drawn on the sheet but not shipped
      const { strip, mini, ops } = await emblemImages(cut.get(key));
      const a = dds(fromRaw(strip.data, strip.w, strip.h)), b = dds(fromRaw(mini.data, mini.w, mini.h));
      staged.add(factionTexture(key), a); staged.add(miniatureTexture(key), b);
      const base = { source: `art/source/${rel}`, sourceSha256: acc.sha, cell: i };
      manifest.push({ out: factionTexture(key), ...base, ops: ['cut on the shield outline', ...ops.strip, 'dds a8r8g8b8'], sha256: sha256(a) });
      manifest.push({ out: miniatureTexture(key), ...base, ops: ['cut on the shield outline', ...ops.mini, 'dds a8r8g8b8'], sha256: sha256(b) });
      shipped.add(key);
    }
    staged.add(`art/source/${rel}`, bytes);
  }
  if (cells.complete) {
    const missing = cells.sheets.flatMap(s => s.keys).filter(k => k !== null && !shipped.has(k));
    if (missing.length) throw new Error(`faction art is marked complete but ${missing.length} league(s) have no accepted emblem: ${missing.slice(0, 8).join(', ')}`);
  }
  staged.add('art/source/faction_art_manifest.json', Buffer.from(JSON.stringify({ generator: 'tools/content/modules/faction_art.mjs', files: manifest.sort((x, y) => x.out.localeCompare(y.out, 'en')) }, null, 1) + '\n'));
  return shipped;
}
