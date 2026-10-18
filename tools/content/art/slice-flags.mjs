// Cut generated flag sheets into one PNG per country. Flags are found on the sheet's black background by the
// shared adaptive detector (lib/sheets.mjs), ordered by row then column, and checked against the expected count;
// a sheet that does not yield exactly its flags is refused rather than guessed.
//   node tools/content/art/slice-flags.mjs <cells.json> <rawDir> <outDir>
// (the builder also slices on demand when <ZIN_ART>/flags/ is missing: modules/art.mjs flagsDir)
import sharp from 'sharp';
import { readFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { findRegionsAdaptive } from '../lib/sheets.mjs';

const FLAG_W = 492, FLAG_H = 312; // 6x the HOI4 large flag (82x52), downscaled at build time.
// Flags are keyed by country name, not tag: tags follow the politics order and may shift when the map changes.
export const flagKey = name => name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').toLowerCase();

export async function sliceSheet(file, cells, outDir) {
  const found = await findRegionsAdaptive(file, cells.length, { cols: 4, rows: Math.max(...cells.map(c => c.rows)), aspect: [1.1, 2.2], minAreaFraction: 1 / 3 });
  if (!found.ok) throw new Error(`${path.basename(file)}: found ${found.found} flags, expected ${cells.length}`);
  await mkdir(outDir, { recursive: true });
  const inset = 4;
  for (const c of cells) {
    const b = found.regions[c.index];
    await sharp(file).extract({ left: b.x0 + inset, top: b.y0 + inset, width: b.x1 - b.x0 - inset * 2, height: b.y1 - b.y0 - inset * 2 }).resize(FLAG_W, FLAG_H, { fit: 'fill', kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toFile(path.join(outDir, `${flagKey(c.name)}.png`));
  }
  return found.regions.length;
}

if (process.argv[1]?.endsWith('slice-flags.mjs')) {
  const [cellsPath, rawDir, outDir] = process.argv.slice(2);
  const cells = JSON.parse(await readFile(cellsPath, 'utf8')), bySheet = new Map();
  for (const c of cells) (bySheet.get(c.sheet) ?? bySheet.set(c.sheet, []).get(c.sheet)).push(c);
  const report = [];
  for (const [sheet, group] of bySheet) {
    const file = path.join(rawDir, `${sheet}.png`);
    try { await access(file); } catch { report.push({ sheet, error: 'not generated yet' }); continue; }
    try { report.push({ sheet, sliced: await sliceSheet(file, group, outDir) }); } catch (e) { report.push({ sheet, error: e.message }); }
  }
  console.log(JSON.stringify(report));
}
