// Land and sea of the owner's working drawing, seen in the game frame through the model's sheet transforms.
//
// The working mosaic (docs/reference/originals/Erdae-working.jpg, private and git-ignored) is read into memory only:
// nothing derived from its pixels is written by this module. For each cell of a grid in the game frame the module
// finds the registered sheet that covers it (the sheet with the smallest world box wins where sheets overlap, so the
// specific sheets of the Ember Lands or Aenor Isle beat the wide East Lands sheet), maps the cell centre back into the
// drawing (drawing = drawingAnchor + (world - worldAnchor) / scaleWorldPerDrawing) and classifies the pencil colour:
// blue water (hue 180 to 258 degrees, saturation 0.15 or more) is sea, everything else (snow, paper, greens, browns,
// greys, lava reds) is land. A 3 x 3 majority filter removes lettering and pencil lines. A sheet reads only its paper:
// its `clipBox` (the drawing box less the pencil frame, from sheet_registration.mjs) when it has one. A sheet with an
// `affine` transform ([a, b, c, d, e, f]: world x = a dx + b dy + c, world y = d dx + e dy + f) uses it instead of the
// anchor form.
//
//   sheetCover(model, grid)            -> Int16Array of sheet indices (-1 where no sheet covers the cell)
//   drawingLandBySheet(model, jpg, grid) -> Promise<{ sheets, masks }> (one mask per sheet: 1 land, 0 sea, 255 outside)
//   combineSheets(bySheet, ids)         -> one mask, each cell from the first covering sheet among `ids`
//   drawingLand(model, jpgPath, grid)  -> Promise<{ land, sheets }> (all sheets combined)
//   iou(a, b, zone)                    -> intersection over union of two 0/1 masks inside a zone mask
import { cellCentre } from './geo_core.mjs';

/** The sheets of a model with their world boxes, smallest box first (the priority order where sheets overlap). */
export function sheetList(model) {
  return Object.entries(model.sheets ?? {}).map(([id, s]) => {
    const b0 = s.drawingBox;
    const corners = [[b0[0], b0[1]], [b0[2], b0[1]], [b0[2], b0[3]], [b0[0], b0[3]]].map(d => toWorld(s, d));
    const box = [Math.min(...corners.map(c => c[0])), Math.min(...corners.map(c => c[1])), Math.max(...corners.map(c => c[0])), Math.max(...corners.map(c => c[1]))];
    return { id, s, box, area: (box[2] - box[0]) * (box[3] - box[1]) };
  }).sort((p, q) => p.area - q.area || p.id.localeCompare(q.id));
}
/** World point to drawing point through one sheet. */
export function toDrawing(s, p) {
  if (s.affine) {
    const [a, b, c, e, f, g] = s.affine, det = a * f - b * e, x = p[0] - c, y = p[1] - g;
    return [(f * x - b * y) / det, (-e * x + a * y) / det];
  }
  return [s.drawingAnchor[0] + (p[0] - s.worldAnchor[0]) / s.scaleWorldPerDrawing[0], s.drawingAnchor[1] + (p[1] - s.worldAnchor[1]) / s.scaleWorldPerDrawing[1]];
}
/** Drawing point to world point through one sheet. */
export function toWorld(s, d) {
  if (s.affine) { const [a, b, c, e, f, g] = s.affine; return [a * d[0] + b * d[1] + c, e * d[0] + f * d[1] + g]; }
  return [s.worldAnchor[0] + (d[0] - s.drawingAnchor[0]) * s.scaleWorldPerDrawing[0], s.worldAnchor[1] + (d[1] - s.drawingAnchor[1]) * s.scaleWorldPerDrawing[1]];
}
export const insideBox = (box, d) => d[0] >= box[0] && d[0] <= box[2] && d[1] >= box[1] && d[1] <= box[3];
/** The part of a sheet's drawing the import reads: its clip box, else its drawing box. */
export const paperOf = s => s.clipBox ?? s.drawingBox;

export function sheetCover(model, grid) {
  const sheets = sheetList(model);
  const out = new Int16Array(grid.w * grid.h).fill(-1);
  for (let j = 0; j < grid.h; j++) for (let i = 0; i < grid.w; i++) {
    const p = cellCentre(grid, i, j);
    for (let k = 0; k < sheets.length; k++) if (insideBox(paperOf(sheets[k].s), toDrawing(sheets[k].s, p))) { out[j * grid.w + i] = k; break; }
  }
  return { cover: out, sheets };
}

/** True when an RGB pixel is drawn water. */
export function isWaterColour(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (mx < 25) return false;
  const sat = mx ? (mx - mn) / mx : 0;
  if (sat < 0.15) return false;
  let h;
  if (mx === r) h = ((g - b) / (mx - mn) + 6) % 6; else if (mx === g) h = (b - r) / (mx - mn) + 2; else h = (r - g) / (mx - mn) + 4;
  h *= 60;
  return h >= 180 && h <= 258;
}

/** Classify the drawing per sheet: one mask per sheet (1 land, 0 sea, 255 outside the sheet), majority-filtered. */
export async function drawingLandBySheet(model, jpgPath, grid) {
  const { default: sharp } = await import('sharp');
  const { data, info } = await sharp(jpgPath).raw().toBuffer({ resolveWithObject: true });
  const sheets = sheetList(model);
  const sub = [-0.33, 0, 0.33];
  const masks = sheets.map(({ s }) => {
    const raw = new Uint8Array(grid.w * grid.h).fill(255);
    for (let j = 0; j < grid.h; j++) for (let i = 0; i < grid.w; i++) {
      if (!insideBox(paperOf(s), toDrawing(s, cellCentre(grid, i, j)))) continue;
      let water = 0, n = 0;
      for (const dy of sub) for (const dx of sub) {
        const d = toDrawing(s, cellCentre(grid, i + dx, j + dy));
        const x = Math.min(info.width - 1, Math.max(0, Math.round(d[0] * info.width - 0.5))), y = Math.min(info.height - 1, Math.max(0, Math.round(d[1] * info.height - 0.5)));
        const o = (y * info.width + x) * info.channels;
        if (isWaterColour(data[o], data[o + 1], data[o + 2])) water++;
        n++;
      }
      raw[j * grid.w + i] = water * 2 >= n ? 0 : 1;
    }
    const land = raw.slice();
    for (let j = 0; j < grid.h; j++) for (let i = 0; i < grid.w; i++) {
      const id = j * grid.w + i;
      if (raw[id] === 255) continue;
      let l = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const x = i + dx, y = j + dy;
        if (x < 0 || y < 0 || x >= grid.w || y >= grid.h) continue;
        const v = raw[y * grid.w + x];
        if (v === 255) continue;
        l += v; n++;
      }
      land[id] = l * 2 > n ? 1 : 0;
    }
    return land;
  });
  return { sheets, masks };
}
/** Combine per-sheet masks: each cell takes the first listed sheet (smallest world box) that covers it, among `ids` when given. */
export function combineSheets(bySheet, ids = null) {
  const n = bySheet.masks[0]?.length ?? 0;
  const out = new Uint8Array(n).fill(255);
  const order = bySheet.sheets.map((sh, k) => ({ sh, k })).filter(({ sh }) => !ids || ids.includes(sh.id));
  for (let i = 0; i < n; i++) for (const { k } of order) { const v = bySheet.masks[k][i]; if (v !== 255) { out[i] = v; break; } }
  return out;
}
export async function drawingLand(model, jpgPath, grid, ids = null) {
  const bySheet = await drawingLandBySheet(model, jpgPath, grid);
  return { land: combineSheets(bySheet, ids), sheets: bySheet.sheets };
}

/** Intersection over union of two 0/1 masks, counted where `zone` is set (and `valid` is not 255 when given). */
export function iou(a, b, zone, valid = null) {
  let inter = 0, uni = 0;
  for (let i = 0; i < a.length; i++) {
    if (!zone[i] || (valid && valid[i] === 255)) continue;
    const x = a[i] === 1, y = b[i] === 1;
    if (x && y) inter++;
    if (x || y) uni++;
  }
  return { inter, union: uni, iou: uni ? inter / uni : 1 };
}
