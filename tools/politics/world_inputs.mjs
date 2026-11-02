// Inputs of the politics step, read-only: the roster, the import's geography model, the repaired model's region
// zones, the old map's state assignment and state centres, and (when present) the owner's private drawing as the
// drawn-map import reads it.
//
// The drawing (docs/reference/originals/Erdae.png, git-ignored) is read into memory only, through the project's own
// import measures (tools/content/geography/import_measures.mjs: the registered sheets warped into the world frame,
// the import's illustrated heuristic, the surface-override annotations). Nothing derived from its pixels is written
// except point coordinates that pass the land test.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FRAME, fillRings, erodeBox, components } from './geometry.mjs';
import { regionZones } from '../content/geography/repair_model.mjs';
import * as M from '../content/geography/import_measures.mjs';
import { IMPORT } from '../content/geography/convert_for_import.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ZIN = path.resolve(here, '../..');
export const PATHS = Object.freeze({
  roster: 'tools/content/data/world/roster.json',
  geography: 'tools/content/data/geography/import/aoaz.geography.json',
  repaired: 'tools/content/data/geography/aoaz.repaired.json',
  // The seeds' map-derived inputs (realm state counts, capital states, state centres) are a frozen basis: the assignment and state
  // centres of the first map written from the drawing (d9a0e9fc), which the committed seeds were built from. The live files follow
  // every map write, and reading them would feed each map back into the next set of seeds.
  assignment: 'tools/politics/data/seed_basis/state_assignment.json',
  stateCentres: 'tools/politics/data/seed_basis/forces_geography.json',
  sheets: 'tools/content/data/geography/import/aoaz.sheets.json',
  annotations: 'tools/content/data/geography/import/aoaz.annotations.json',
  drawing: 'docs/reference/originals/Erdae.png',
  countryTags: 'common/country_tags',
});
const abs = rel => path.join(ZIN, rel);
const readJson = rel => JSON.parse(readFileSync(abs(rel), 'utf8'));
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const fileHash = rel => sha256(readFileSync(abs(rel)));

/** The grid of the repaired model's region zones (the geography checker's grid: 4-pixel cells). */
export const ZONE_GRID = Object.freeze({ cell: 4, w: FRAME.width / 4, h: FRAME.height / 4 });

/** Normalised model point to world pixels. */
export const toPx = p => [p[0] * FRAME.width, p[1] * FRAME.height];

/** The model's land in world pixels: every land polygon (even-odd per land), lakes cut out. */
export function modelLandMask(geography) {
  const land = new Uint8Array(FRAME.width * FRAME.height);
  for (const l of geography.lands) fillRings(l.polygons.map(r => r.map(toPx)), land, 1);
  for (const l of geography.lakes) fillRings(l.polygons.map(r => r.map(toPx)), land, 0);
  return land;
}
/** Which model land holds each pixel (index into geography.lands, -1 none), lakes included in their land. */
export function landIndexMask(geography) {
  const idx = new Int16Array(FRAME.width * FRAME.height).fill(-1);
  geography.lands.forEach((l, k) => {
    const m = fillRings(l.polygons.map(r => r.map(toPx)), new Uint8Array(FRAME.width * FRAME.height), 1);
    for (let i = 0; i < m.length; i++) if (m[i]) idx[i] = k;
  });
  return idx;
}

/** The drawing's land as the import reads it (1 land, 0 sea), or null when the private drawing is absent. */
export async function drawnLandMask(drawingPath = abs(PATHS.drawing)) {
  if (!existsSync(drawingPath)) return null;
  const doc = readJson(PATHS.sheets);
  const annotations = readJson(PATHS.annotations).annotations;
  const bytes = readFileSync(drawingPath);
  const sha = sha256(bytes);
  if (sha !== doc.source.sha256) throw new Error(`the drawing at ${drawingPath} (${sha}) is not the one the sheets were registered for (${doc.source.sha256})`);
  const sharp = createRequire(path.join(ZIN, 'tools/package.json'))('sharp');
  const size = M.workingSize(doc);
  const { data, info } = await sharp(bytes, { limitInputPixels: false, sequentialRead: true }).resize(size.width, size.height, { fit: 'fill', kernel: 'linear' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { rgb, owner } = M.warp(doc, { data, width: info.width, height: info.height });
  return { mask: M.annotate(M.classifyLand(rgb, owner, M.toolHeuristicLand), annotations), sha256: sha };
}

/**
 * Everything the generator reads. `surface` is the land a point may stand on: the drawing's land as the import reads
 * it (the illustrated heuristic with the surface-override annotations, preview_call.json) less the model's lakes, which
 * the import carves; the model's land (lands less lakes) when the drawing is absent. `safe` is that surface eroded by
 * `marginPx`, so a point stays on land however the import's own working copy rounds the coast.
 */
export async function loadWorld({ drawing = true, marginPx = 3 } = {}) {
  const roster = readJson(PATHS.roster);
  const geography = readJson(PATHS.geography);
  const repaired = readJson(PATHS.repaired);
  const assignment = readJson(PATHS.assignment);
  const centres = readJson(PATHS.stateCentres);
  const modelLand = modelLandMask(geography);
  const drawn = drawing ? await drawnLandMask() : null;
  // the import's land is the drawing as it reads it, with the model's lakes carved out; without the drawing, the model
  const lakes = new Uint8Array(modelLand.length);
  for (const l of geography.lakes) fillRings(l.polygons.map(r => r.map(toPx)), lakes, 1);
  const surface = new Uint8Array(modelLand.length);
  for (let i = 0; i < surface.length; i++) surface[i] = (drawn ? drawn.mask[i] : modelLand[i]) && !lakes[i] ? 1 : 0;
  // the import's sea-band edge clears the strict bands at the frame edges (its ragged clearing reaches up to half again
  // as deep; generated points keep their own distance, PLACE.edgeClearPx in realm_seeds.mjs)
  const { bandPx, polarPx } = IMPORT.edge;
  for (let y = 0; y < FRAME.height; y++) for (let x = 0; x < FRAME.width; x++) if (x < bandPx || x >= FRAME.width - bandPx || y < polarPx || y >= FRAME.height - polarPx) surface[y * FRAME.width + x] = 0;
  const safe = erodeBox(surface, marginPx);
  const landIndex = landIndexMask(geography);
  const zones = regionZones(repaired, { ox: 0, oy: 0, cell: ZONE_GRID.cell, w: ZONE_GRID.w, h: ZONE_GRID.h });
  // land components of the surface on the zone grid (a cell is land when its centre pixel is)
  const zoneLand = new Uint8Array(ZONE_GRID.w * ZONE_GRID.h);
  for (let j = 0; j < ZONE_GRID.h; j++) for (let i = 0; i < ZONE_GRID.w; i++) zoneLand[j * ZONE_GRID.w + i] = surface[(j * 4 + 2) * FRAME.width + i * 4 + 2];
  const zoneComponents = components(zoneLand, ZONE_GRID.w, ZONE_GRID.h);
  const hashes = Object.fromEntries(['roster', 'geography', 'repaired', 'assignment', 'stateCentres', 'sheets', 'annotations'].map(k => [k, fileHash(PATHS[k])]));
  return { roster, geography, repaired, assignment, centres, modelLand, drawn: drawn ? { sha256: drawn.sha256 } : null, surface, safe, landIndex, zones, zoneLand, zoneComponents, hashes, marginPx };
}

/** Tags declared by the workspace's static country tag files (dynamic-tag files excluded). */
export function workspaceTags() {
  const dir = abs(PATHS.countryTags), out = new Set();
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).filter(n => n.endsWith('.txt')).sort()) {
    const t = readFileSync(path.join(dir, f), 'utf8');
    if (/^\s*dynamic_tags\s*=\s*yes/mu.test(t)) continue;
    for (const m of t.matchAll(/^\s*([A-Z0-9]{3})\s*=/gmu)) out.add(m[1]);
  }
  return out;
}
