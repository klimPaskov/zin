// Writes the image job of the ZIN window cells (UI overhaul lane C3) in the format of tools/content/imagegen.mjs, from
// tools/content/data/ui/zin_chrome.json. This script only composes the prompt; the sheet is painted by the image model.
//   node tools/content/art/zin-chrome-jobs.mjs [jobs.json]   (default: <ZIN_ART>/jobs/ui-zin-chrome-jobs.json)
//   then: node tools/content/imagegen.mjs <jobs.json>         (gpt-6-luna only)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ART, ZIN } from '../lib/paths.mjs';
import { FORBIDDEN_MOTIFS } from '../lib/ui_vocab.mjs';

const SPEC = fileURLToPath(new URL('../data/ui/zin_chrome.json', import.meta.url));

export function chromePrompt(spec) {
  const themes = Object.values(spec.themes).map(t => `- ${t}.`).join('\n');
  const rows = spec.rows.map((r, i) => `Row ${i + 1} (${r.row}), exactly ${r.items.length} separate item${r.items.length > 1 ? 's' : ''} from left to right:\n${r.items.map((it, j) => `  ${j + 1}. ${it.subject}.`).join('\n')}`).join('\n');
  return [
    'A clean game-interface asset sheet for a dark-fantasy strategy game, painted art, crisp edges, high detail, flat even lighting from the upper left, seen straight on with no perspective.',
    `The sheet holds ${spec.rows.reduce((n, r) => n + r.items.length, 0)} separate interface pieces in ${spec.rows.length} horizontal rows on a solid flat pure black (#000000) background. Every piece is fully separate: wide pure black gutters between pieces and between rows, nothing touches anything else, no piece is cut by the image edge, no glow, no shadow and no gradient on the black background.`,
    'Materials by theme, matching the attached reference sheets (style only; copy none of their lettering):',
    themes,
    rows,
    'Long pieces (grooves, fills, dividers, row strips) are thin horizontal bars spanning about a third of the sheet width each; tabs and buttons are short wide plates of one height in their row; marks are small; the three window panels in the top row are the largest pieces.',
    'Every plain surface is calm and even, with texture visible only at close view, so text can sit on it. Each state variant keeps exactly the same shape and size as its normal piece and differs only as described.',
    `No text, no letters, no numbers, no labels, no captions anywhere on the sheet. ${FORBIDDEN_MOTIFS}.`,
  ].join('\n');
}

export function chromeJob(spec, out) {
  return { id: spec.sheet.id, prompt: chromePrompt(spec), out, size: spec.sheet.size, quality: 'high', references: spec.sheet.references.map(r => path.join(ZIN, r).split(path.sep).join('/')) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const spec = JSON.parse(readFileSync(SPEC, 'utf8'));
  const file = path.resolve(process.argv[2] ?? `${ART}/jobs/ui-zin-chrome-jobs.json`);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify([chromeJob(spec, `${ART}/raw/${spec.sheet.raw}`)], null, 2) + '\n');
  console.log(file);
}
