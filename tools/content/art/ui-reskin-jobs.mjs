// Image-generation jobs for the interface reskin (spec docs/specs/07_interface/02_full_ui_reskin.md, section 5):
// one job per theme sheet of tools/content/data/ui/sheets/, in the format of tools/content/imagegen.mjs. This script only
// writes the jobs; it never calls the image generator.
//   node tools/content/art/ui-reskin-jobs.mjs [outDir] [--tranche N] [--family F]
// outDir defaults to <ZIN_ART>/jobs. Writes ui-reskin-jobs.json (ready jobs, ordered by production step), and
// ui-reskin-blocked.json (sheets that wait for data: the alert frame meanings) and ui-reskin-plan.json (step -> sheets).
import { existsSync } from 'node:fs';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ART } from '../lib/paths.mjs';
import { PREAMBLES, PROMPT_TAIL, SHEET_ASPECTS, FAMILY_TRANCHE, layoutCheck, GROUND } from '../lib/ui_sheets.mjs';
import { loadSheets, loadReskin, SHEET_RAW_DIR, ALERT_FRAMES_FILE } from '../modules/ui_reskin.mjs';

// What a sheet needs before its subjects are meaningful: the file under data/ui/, or a provisional list from the spec.
const DATA_NEEDS = { 'alert_frames.json': () => existsSync(ALERT_FRAMES_FILE) };
const PROVISIONAL = new Set(['warfare_folders', 'economy_buildings']);


export function sheetPrompt(sheet) {
  const [cols, rows] = sheet.grid, n = sheet.cells.length;
  const preamble = PREAMBLES[sheet.family] ?? PREAMBLES.chrome_panels, ground = GROUND[sheet.ground ?? 'black'];
  const isolated = sheet.matte === 'outline';
  const layout = cols * rows === 1
    ? `A single item ${ground}.`
    : `An asset sheet of ${n} items for a fantasy strategy-game interface, arranged in an exact grid of ${cols} column${cols > 1 ? 's' : ''} and ${rows} row${rows > 1 ? 's' : ''}, in reading order, ${ground}. ` +
      (isolated ? 'Each item is one isolated object of about the same size, centred in its own cell, with wide black gutters between items, flat front view.'
        : 'Each cell is one full-bleed piece that fills its own cell edge to edge, the same size as the others, separated by a narrow black gutter, flat front view, seamless where it is described as a tile.');
  const bySet = [];
  for (let r = 0; r < rows; r++) {
    const items = sheet.cells.slice(r * cols, (r + 1) * cols).map((c, i) => `${r * cols + i + 1}. ${c.subject}`);
    if (items.length) bySet.push(`Row ${r + 1}, left to right: ${items.join('; ')}.`);
  }
  return [preamble, layout, ...bySet, PROMPT_TAIL].join(' ');
}

export function sheetJob(sheet, rawDir = `${ART}/raw`) {
  const [w, h] = SHEET_ASPECTS[sheet.aspect];
  return { id: `reskin-${sheet.id}`, size: `${w}x${h}`, quality: 'high', out: path.posix.join(rawDir.split(path.sep).join('/'), SHEET_RAW_DIR, `${sheet.id}.png`), check: layoutCheck(sheet), prompt: sheetPrompt(sheet), sheet: sheet.id, family: sheet.family, tranche: sheet.tranche ?? FAMILY_TRANCHE[sheet.family], ...(sheet.needs?.some(x => PROVISIONAL.has(x)) ? { provisional: sheet.needs.filter(x => PROVISIONAL.has(x)) } : {}) };
}

// Split the sheets into ready jobs and blocked sheets; `only` is a Set of sheet ids still used by some R row.
export function reskinJobs({ sheets, used, rawDir, dataPresent = need => (DATA_NEEDS[need] ?? (() => true))(), tranche, family }) {
  const jobs = [], blocked = [];
  for (const sheet of [...sheets.values()].sort((a, b) => ((a.tranche ?? FAMILY_TRANCHE[a.family]) - (b.tranche ?? FAMILY_TRANCHE[b.family])) || (a.id < b.id ? -1 : 1))) {
    if (used && !used.has(sheet.id)) continue;
    const t = sheet.tranche ?? FAMILY_TRANCHE[sheet.family];
    if (tranche !== undefined && t !== tranche) continue;
    if (family && sheet.family !== family) continue;
    const missing = (sheet.needs ?? []).filter(x => !PROVISIONAL.has(x) && !dataPresent(x));
    if (missing.length) { blocked.push({ sheet: sheet.id, tranche: t, needs: missing }); continue; }
    jobs.push(sheetJob(sheet, rawDir));
  }
  return { jobs, blocked };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), flag = n => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
  const tranche = flag('--tranche'), family = flag('--family');
  const outDir = path.resolve(args[0] ?? `${ART}/jobs`);
  const sheets = loadSheets(), reskin = loadReskin();
  const used = new Set(reskin.rows.filter(r => r.disposition === 'R').flatMap(r => [].concat(r.sheet ?? [])));
  const { jobs, blocked } = reskinJobs({ sheets, used, rawDir: path.join(outDir, '../raw'), tranche: tranche === undefined ? undefined : Number(tranche), family });
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'ui-reskin-jobs.json'), JSON.stringify(jobs, null, 1));
  await writeFile(path.join(outDir, 'ui-reskin-blocked.json'), JSON.stringify(blocked, null, 1));
  const plan = {}; for (const j of jobs) (plan[j.tranche] ??= []).push(j.sheet);
  await writeFile(path.join(outDir, 'ui-reskin-plan.json'), JSON.stringify(plan, null, 1));
  console.log(JSON.stringify({ jobs: jobs.length, blocked: blocked.length, byTranche: Object.fromEntries(Object.entries(plan).map(([k, v]) => [k, v.length])), out: path.join(outDir, 'ui-reskin-jobs.json') }));
}
