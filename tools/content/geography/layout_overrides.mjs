// Layout overrides: where the warped drawing and the geography model disagree, the model wins.
//
// The model encodes the owner-approved layout of 17 and 18 October 2026 (docs/generation/assumptions.md), which
// rearranged and reshaped the drawn sheets: the lands were scaled to 90 percent, the central sea was widened, the bands
// at the top and bottom were generated, the Magical Lands were extended across a rift sea, Triton's Islands and the
// Islands of the South were given added islands. The drawn-map import (ADR 0067) takes the coast from the warped
// drawing, applies the authored surface overrides over it and blocks when the result disagrees with the model. Lead
// decision of 24 October 2026: wherever the two disagree, the model wins.
//
// For every region whose land agreement (the import's surface, that is the warped drawing read through the sheet
// authority with the base overrides over it, against the model's land, intersection over union over the region's zone)
// is under LAYOUT.target, this step forces the model at the disagreeing places: each 4-connected patch where the model
// has land and the surface sea becomes a `land` entry, each patch where the model has sea and the surface land a `sea`
// entry. Patches are taken greedily by their gain in agreement until the region reaches the target plus a margin, so
// the forced area is as small as the greedy order allows; regions at or above the target get none. Each entry names the
// region, the model feature it restores (the land or sea covering most of the patch) and why.
//
// The step reads the private drawing (into memory only) and writes tools/content/data/geography/layout_overrides.json:
// polygons of the model's own land and sea, never anything traced from the drawing. repair_model.mjs appends the
// entries to the surface overrides (tools/content/geography/surface_overrides.json); the repair needs no drawing.
//
//   node tools/content/geography/layout_overrides.mjs [--model <repaired.json>] [--drawing <jpg>] [--out <json>]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as G from './geo_core.mjs';
import { ringsOf } from './check_model.mjs';
import { sheetAuthority, landMask, baseOverrides, DEFAULT_LAYOUT_OVERRIDES_PATH, DEFAULT_DRAWING_PATH } from './repair_model.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const LAYOUT = Object.freeze({ target: 0.85, margin: 0.005, minPatchCells: 1 });
const CG = Object.freeze({ ox: 0, oy: 0, cell: 4, w: 1280, h: 640 }); // the checker's grid, as the agreement measure uses
const r4 = v => Math.round(v * 1e4) / 1e4;
const ringOut = ring => ring.map(p => [r4(p[0]), r4(p[1])]);

/** The forced-value raster of a list of surface entries (255 none, 0 sea, 1 land), later entries winning. */
export function forcedRaster(entries, grid = CG) {
  const forced = new Uint8Array(grid.w * grid.h).fill(255);
  for (const e of entries ?? []) G.rasterizeInto({ type: 'Polygon', coordinates: [e.polygon, ...(e.holes ?? [])] }, grid, forced, e.kind === 'land' ? 1 : 0);
  return forced;
}
/**
 * The surface the import builds: each cell read from the sheet `sheetAuthority` names (sea where none), then the
 * overrides. `bySheet` is drawing_mask.drawingLandBySheet's result for the same model. Returns { surface, zone, land }.
 */
export function importSurface(model, overrides, bySheet, grid = CG) {
  const { auth, sheets, zone } = sheetAuthority(model, grid);
  const index = new Map(bySheet.sheets.map((sh, k) => [sh.id, k]));
  const forced = forcedRaster(overrides?.surface ?? overrides, grid);
  const surface = new Uint8Array(grid.w * grid.h);
  for (let c = 0; c < surface.length; c++) {
    const k = auth[c] >= 0 ? index.get(sheets[auth[c]].id) : -1;
    const raw = k >= 0 && bySheet.masks[k][c] === 1 ? 1 : 0;
    surface[c] = forced[c] === 255 ? raw : forced[c];
  }
  return { surface, zone, land: landMask(model, grid) };
}
/** Land IoU of a surface against the model per region zone: Map(region -> { inter, union, iou }). */
export function regionAgreement({ surface, zone, land }) {
  const out = new Map();
  for (let c = 0; c < surface.length; c++) {
    if (!zone[c]) continue;
    const e = out.get(zone[c]) ?? out.set(zone[c], { inter: 0, union: 0 }).get(zone[c]);
    const A = land[c] === 1, S = surface[c] === 1;
    if (A && S) e.inter++;
    if (A || S) e.union++;
  }
  for (const e of out.values()) e.iou = e.union ? e.inter / e.union : 1;
  return out;
}

/** Which feature of some arrays covers each cell (the last one rasterised wins): { owner, features }. */
function ownerRaster(model, arrays, grid) {
  const features = arrays.flatMap(a => model[a] ?? []);
  const owner = new Int16Array(grid.w * grid.h).fill(-1);
  features.forEach((f, k) => { const t = G.rasterize(f.geometry, grid); for (let c = 0; c < t.length; c++) if (t[c]) owner[c] = k; });
  return { owner, features };
}
/** The feature covering most cells of a patch. */
function coveringFeature(raster, cells) {
  const n = new Map();
  for (const c of cells) { const k = raster.owner[c]; if (k >= 0) n.set(k, (n.get(k) ?? 0) + 1); }
  let best = null;
  for (const [k, v] of [...n].sort((p, q) => q[1] - p[1] || p[0] - q[0])) { best = { id: raster.features[k].id, name: raster.features[k].name, n: v }; break; }
  return best;
}
const REASON = Object.freeze({
  land: (f, region) => `the approved layout of 17 and 18 October 2026 has ${f ? `${f.name} (${f.id})` : 'land'} here where the warped drawing shows sea; the model wins (lead decision of 24 October 2026) in ${region}`,
  sea: (f, region) => `the approved layout of 17 and 18 October 2026 has ${f ? `${f.name} (${f.id})` : 'open water'} here where the warped drawing shows land; the model wins (lead decision of 24 October 2026) in ${region}`,
});

/**
 * The layout entries for a model and its import surface (see the header). Pure: the same model, overrides and drawing
 * masks give the same entries. Returns { entries, regions } with the agreement of each treated region before and after.
 */
export function chooseLayoutOverrides(model, imp, opts = LAYOUT, grid = CG) {
  const { surface, zone, land } = imp;
  const agreement = regionAgreement(imp);
  const regionName = new Map(model.regions.filter(r => r.kind === 'region').map(r => [r.id.replace(/^region_/u, ''), r.name]));
  const entries = [], regions = {};
  const owners = { land: ownerRaster(model, ['lands'], grid), sea: ownerRaster(model, ['seas', 'lakes'], grid) };
  for (const key of [...agreement.keys()].sort()) {
    const a = agreement.get(key);
    if (a.iou >= opts.target) continue;
    // the disagreeing patches of the zone, by kind
    const patches = [];
    for (const kind of ['land', 'sea']) {
      const mask = new Uint8Array(surface.length);
      for (let c = 0; c < mask.length; c++) if (zone[c] === key && (kind === 'land' ? land[c] === 1 && surface[c] === 0 : land[c] === 0 && surface[c] === 1)) mask[c] = 1;
      const { labels, sizes } = G.labelComponents(mask, grid);
      const cells = sizes.map(() => []);
      for (let c = 0; c < mask.length; c++) if (labels[c] >= 0) cells[labels[c]].push(c);
      cells.forEach((list, k) => { if (list.length >= opts.minPatchCells) patches.push({ kind, cells: list, first: list[0], k }); });
    }
    let { inter, union } = a;
    const chosen = [];
    const goal = opts.target + opts.margin;
    while (union && inter / union < goal && patches.length) {
      let bi = -1, bg = -Infinity;
      patches.forEach((p, i) => {
        const n = p.cells.length;
        const g = p.kind === 'land' ? (inter + n) / union - inter / union : inter / (union - n) - inter / union;
        if (g > bg + 1e-15 || (Math.abs(g - bg) <= 1e-15 && p.first < patches[bi].first)) { bg = g; bi = i; }
      });
      const p = patches.splice(bi, 1)[0];
      if (p.kind === 'land') inter += p.cells.length; else union -= p.cells.length;
      chosen.push(p);
    }
    // smaller: each chosen patch, last first, is dropped when the goal holds without it, or replaced by the smallest
    // patch that still reaches the goal in its place
    const apply = (p, sign) => { if (p.kind === 'land') inter += sign * p.cells.length; else union -= sign * p.cells.length; };
    for (let i = chosen.length - 1; i >= 0; i--) {
      const p = chosen[i];
      apply(p, -1);
      if (union && inter / union >= goal) { chosen.splice(i, 1); patches.push(p); continue; }
      const options = [...patches, p].filter(q => { apply(q, 1); const ok = inter / union >= goal; apply(q, -1); return ok; })
        .sort((x, y) => x.cells.length - y.cells.length || x.first - y.first);
      const q = options[0] ?? p;
      apply(q, 1);
      if (q !== p) { chosen[i] = q; patches.splice(patches.indexOf(q), 1); patches.push(p); }
    }
    chosen.sort((p, q) => p.first - q.first);
    chosen.forEach((p, n) => {
      const mask = new Uint8Array(surface.length);
      for (const c of p.cells) mask[c] = 1;
      const g = G.vectorize(mask, grid, { tolerances: [0], minPartPx: 1, minHolePx: 1 });
      if (!g) return;
      const f = coveringFeature(owners[p.kind], p.cells);
      ringsOf(g).forEach((part, k) => entries.push({
        id: `layout_${key}_${p.kind}_${String(n + 1).padStart(3, '0')}${k ? `_${k}` : ''}`, kind: p.kind, region: `region_${key}`, feature: f?.id ?? null,
        areaPx: p.cells.length * grid.cell * grid.cell, reason: REASON[p.kind](f, regionName.get(key) ?? key),
        polygon: ringOut(part[0]), ...(part.length > 1 ? { holes: part.slice(1).map(ringOut) } : {}),
      }));
    });
    regions[`region_${key}`] = { before: r4(a.iou), planned: r4(inter / union), patches: chosen.length, forcedPx: chosen.reduce((s, p) => s + p.cells.length * grid.cell * grid.cell, 0) };
  }
  return { entries, regions };
}

async function main(argv) {
  const args = argv.slice(2);
  const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const model = JSON.parse(readFileSync(opt('--model') ?? path.join(here, '../data/geography/aoaz.repaired.json'), 'utf8'));
  const jpg = opt('--drawing') ?? DEFAULT_DRAWING_PATH;
  if (!existsSync(jpg)) throw new Error(`the working drawing is not at ${jpg}`);
  const dm = await import('./drawing_mask.mjs');
  const bySheet = await dm.drawingLandBySheet(model, jpg, CG);
  const base = baseOverrides(model);
  const { entries, regions } = chooseLayoutOverrides(model, importSurface(model, base, bySheet));
  // the result, measured with the entries rasterised as the import will apply them
  const after = regionAgreement(importSurface(model, [...base.surface, ...entries], bySheet));
  for (const [id, r] of Object.entries(regions)) r.after = r4(after.get(id.replace(/^region_/u, '')).iou);
  const doc = {
    schemaVersion: 1,
    name: 'Aoaz layout overrides: the model wins where the warped drawing disagrees',
    generatedBy: 'tools/content/geography/layout_overrides.mjs (deterministic from the repaired model and the private working drawing; regenerate, do not edit by hand)',
    appliedBy: 'tools/content/geography/repair_model.mjs (buildOverrides appends the entries to surface_overrides.json)',
    decision: 'Lead decision of 24 October 2026: where the warped drawing and the model disagree, the model wins; it encodes the owner-approved layout of 17 and 18 October 2026 (docs/generation/assumptions.md).',
    drawing: { sha256: createHash('sha256').update(readFileSync(jpg)).digest('hex') },
    options: { ...LAYOUT },
    regions,
    entries,
  };
  writeFileSync(opt('--out') ?? DEFAULT_LAYOUT_OVERRIDES_PATH, `${JSON.stringify(doc, null, 1)}\n`);
  for (const [id, r] of Object.entries(regions)) console.log(`${id.padEnd(24)} ${r.before.toFixed(3)} -> ${r.after.toFixed(3)} (${r.patches} patches, ${r.forcedPx} px forced)`);
  console.log(`${entries.length} entries`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv).catch(e => { console.error(e); process.exitCode = 1; });
