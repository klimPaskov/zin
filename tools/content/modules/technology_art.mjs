// Technology art: the sprites GFX_<technology>_medium of interface/zin_technologies.gfx (one per researchable technology, 279 in
// the K51 tree) and the ZIN folder tabs. Every picture is image-generated (gpt-6-luna, owner route) in the Chronicle technology style
// of docs/specs/07_interface/07_design_system.md §4.2 (ink-engraved picture on a vellum roundel in a slate bezel); this module only
// finds, crops, masks, resizes and converts what the image model produced. The cell map is the tracked
// tools/content/data/tech_art_cells.json. A sprite whose sheet has no accepted review line keeps the family unknown icon; once the
// cell map says "complete", a technology sprite still on the unknown icon fails the build.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { rawFile, provenanceFile } from '../lib/paths.mjs';
import { fromRaw, dds } from '../lib/raster.mjs';
import { createHash } from 'node:crypto';
import { acceptance } from './presentation.mjs';
import { cutSheet } from './doctrine_art.mjs';

export const CELLS_FILE = fileURLToPath(new URL('../data/tech_art_cells.json', import.meta.url));
export const TECH_DIR = 'gfx/interface/technologies/zin';
export const FRAME_TEXTURE = 'gfx/interface/zin/unknown/technology.dds';   // the family unknown icon (UI lane C3): check 11 reports every sprite on it

const sha256 = b => createHash('sha256').update(b).digest('hex');

// The staged file of a technology sprite, relative to the game root.
export const techTexture = key => `${TECH_DIR}/${key}.dds`;
// The empty slot of the tree window's item templates (GFX_zin_technology_blank): a transparent 64 x 64 picture, not a picture of anything.
export const BLANK_TEXTURE = `${TECH_DIR}/blank.dds`;

// Every technology sprite key the cell map lists, in sheet order.
export function techArtKeys(cells) { return cells.sheets.flatMap(s => s.keys); }

// Builds every accepted technology sprite into the staged tree. Returns the set of keys shipped (the rest keep the frame).
// `warn` receives a line for each sheet whose art is not accepted yet.
export async function buildTechnologyArt(staged, { warn = () => {}, provenance } = {}) {
  const cells = JSON.parse(await readFile(CELLS_FILE, 'utf8'));
  const provLines = provenance ?? (await readFile(provenanceFile(), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l));
  const shipped = new Set(), manifest = [], sources = new Map();
  staged.add(BLANK_TEXTURE, dds(fromRaw(Buffer.alloc(64 * 64 * 4), 64, 64)));
  for (const sheet of cells.sheets) {
    const rel = `technologies/${sheet.sheet}.png`;
    let bytes;
    try { bytes = await readFile(rawFile(rel)); } catch { warn(`${rel}: not generated; ${sheet.keys.length} technology sprites keep the frame`); continue; }
    const acc = acceptance(provLines, rel, bytes);
    if (!acc.ok) { warn(`${rel}: ${acc.why}; ${sheet.keys.length} technology sprites keep the frame`); continue; }
    const pieces = await cutSheet(rawFile(rel), sheet);
    sources.set(rel, { bytes, sha: acc.sha });
    for (const p of pieces) {
      const out = techTexture(p.key), data = dds(fromRaw(p.buf, p.w, p.h));
      staged.add(out, data);
      shipped.add(p.key);
      manifest.push({ out, source: `art/source/${rel}`, sourceSha256: acc.sha, cell: p.cell, ops: ['detect medallion', 'cut 4px inset', `lanczos3 ${p.w}x${p.h}`, 'circle alpha'], sha256: sha256(data) });
    }
  }
  for (const [rel, s] of [...sources].sort(([a], [b]) => a.localeCompare(b, 'en'))) staged.add(`art/source/${rel}`, s.bytes);
  // Manifest of the shipped DDS files (the asset gate reads art/source/<name>_manifest.json directly under art/source/).
  staged.add('art/source/technology_art_manifest.json', Buffer.from(JSON.stringify({ generator: 'tools/content/modules/technology_art.mjs', files: manifest.sort((a, b) => a.out.localeCompare(b.out, 'en')) }, null, 1) + '\n'));
  return shipped;
}

// The build check: once the cell map says the family is complete, no technology sprite may still point at the unknown icon.
export function assertTechnologyArtComplete(cells, shipped) {
  if (!cells.complete) return;
  const missing = techArtKeys(cells).filter(k => !shipped.has(k));
  if (missing.length) throw new Error(`technology art is marked complete but ${missing.length} sprite(s) still use the frame: ${missing.slice(0, 8).join(', ')}`);
}

export async function loadTechnologyArtCells() { return JSON.parse(await readFile(CELLS_FILE, 'utf8')); }
