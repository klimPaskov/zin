// Image jobs of UI overhaul lane W4 (the icon sprites of the production, construction, trade, logistics, military and intelligence windows
// whose sockets were empty), in the format of tools/content/imagegen.mjs. This script only composes the prompts; the sheets are painted by
// the image model (gpt-6-luna).
//   node tools/content/art/w4-icons-jobs.mjs [jobs.json]   (default: <ZIN_ART>/jobs/ui-w4-icons-jobs.json)
//   then: GPTIMAGE_MODEL=gpt-6-luna node tools/content/imagegen.mjs <jobs.json>
// The sheets are tools/content/data/ui/sheets/icons-w4-*.json (cells and subjects); the texture map is tools/content/data/ui/w4_icons.json.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ART } from '../lib/paths.mjs';
import { SHEET_ASPECTS, layoutCheck } from '../lib/ui_sheets.mjs';
import { sheetPrompt } from './ui-reskin-jobs.mjs';

export const W4_SHEET_IDS = ['icons-w4-pips', 'icons-w4-craft', 'icons-w4-host', 'icons-w4-war'];
const sheetFile = id => fileURLToPath(new URL(`../data/ui/sheets/${id}.json`, import.meta.url));

export function w4Jobs(art = ART) {
  return W4_SHEET_IDS.map(id => {
    const s = JSON.parse(readFileSync(sheetFile(id), 'utf8')), [w, h] = SHEET_ASPECTS[s.aspect];
    const prompt = `${sheetPrompt(s)} No text, no letters, no numbers, no runes, no faces, no human figures except where an item names a rider, no crowns, no suns anywhere on the sheet.`;
    return { id: `reskin-${s.id}`, size: `${w}x${h}`, quality: 'high', out: `${art}/raw/ui/reskin/${s.id}.png`, check: layoutCheck(s), prompt, references: s.references.map(r => `${art}/raw/${r}`) };
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const file = path.resolve(process.argv[2] ?? `${ART}/jobs/ui-w4-icons-jobs.json`);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(w4Jobs(), null, 2) + '\n');
  console.log(file);
}
