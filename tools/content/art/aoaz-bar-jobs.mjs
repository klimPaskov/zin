// Image jobs of UI overhaul lane W1 (the Aoaz bar and the top bar values), in the format of tools/content/imagegen.mjs. This script
// only composes the prompts; the sheets are painted by the image model (gpt-6-luna).
//   node tools/content/art/aoaz-bar-jobs.mjs [jobs.json]   (default: <ZIN_ART>/jobs/ui-aoaz-bar-jobs.json)
//   then: GPTIMAGE_MODEL=gpt-6-luna node tools/content/imagegen.mjs <jobs.json>
// The three Aoaz sheets come from tools/content/data/ui/aoaz_bar.json (Banner Hall appliqué roundels); the top bar values sheet is the
// reskin sheet tools/content/data/ui/sheets/icons-topbar-values.json, painted to match the existing top bar icon sheet.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ART } from '../lib/paths.mjs';
import { SHEET_ASPECTS, layoutCheck, PROMPT_TAIL } from '../lib/ui_sheets.mjs';
import { sheetPrompt } from './ui-reskin-jobs.mjs';

const DATA = fileURLToPath(new URL('../data/ui/aoaz_bar.json', import.meta.url));
const TOPBAR = fileURLToPath(new URL('../data/ui/sheets/icons-topbar-values.json', import.meta.url));
const BADGES = JSON.parse(readFileSync(fileURLToPath(new URL('../data/ui/sheets/icons-topbar-badges.json', import.meta.url)), 'utf8'));
const BAR_REFS =['ui/directions/direction_b_components.png', 'ui/reskin/ui-chrome-banner-hall.png'];

export function aoazPrompt(data, sheet) {
  const [cols, rows] = sheet.grid, n = sheet.cells.length;
  const byRow = [];
  for (let r = 0; r < rows; r++) {
    const items = sheet.cells.slice(r * cols, (r + 1) * cols).map((c, i) => `${r * cols + i + 1}. ${c.subject}`);
    if (items.length) byRow.push(`Row ${r + 1}, left to right: ${items.join('; ')}.`);
  }
  return [
    'An asset sheet of round emblem badges for the top bar of a dark-fantasy strategy game, painted art, crisp edges, high detail.',
    `Exactly ${n} separate roundels arranged in an exact grid of ${cols} columns and ${rows} rows, in reading order, on a solid flat pure black (#000000) background. Each roundel is one isolated object centred in its own cell, with wide black gutters between them; nothing touches anything else, no piece is cut by the image edge, no glow, no shadow and no gradient on the black.`,
    data.style,
    'Match the cloth, the gold cord and the colours of the attached Banner Hall reference sheets (style only; copy none of their pieces or lettering).',
    ...(sheet.note ? [sheet.note] : []),
    ...byRow,
    PROMPT_TAIL,
    'No text, no letters, no numbers, no runes, no faces, no figures, no crowns, no suns anywhere on the sheet.',
  ].join(' ');
}

export function aoazJobs(data = JSON.parse(readFileSync(DATA, 'utf8')), topbar = JSON.parse(readFileSync(TOPBAR, 'utf8')), art = ART) {
  const jobs = data.sheets.map(s => {
    const [w, h] = SHEET_ASPECTS[s.aspect];
    return { id: s.id, size: `${w}x${h}`, quality: 'high', out: `${art}/raw/ui/aoaz/${s.id}.png`, check: layoutCheck(s), prompt: aoazPrompt(data, s), references: BAR_REFS.map(r => `${art}/raw/${r}`) };
  });
  for (const s of [topbar, BADGES]) {
    const [w, h] = SHEET_ASPECTS[s.aspect];
    jobs.push({ id: `reskin-${s.id}`, size: `${w}x${h}`, quality: 'high', out: `${art}/raw/ui/reskin/${s.id}.png`, check: layoutCheck(s), prompt: sheetPrompt(s), references: s.references.map(r => `${art}/raw/${r}`) });
  }
  return jobs;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const file = path.resolve(process.argv[2] ?? `${ART}/jobs/ui-aoaz-bar-jobs.json`);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(aoazJobs(), null, 2) + '\n');
  console.log(file);
}
