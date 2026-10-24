// Image-generation jobs for the shaped focus and idea emblems (docs/design/validation/gfx_standard.md, "Focus icons").
// One sheet per twelve catalog keys, in the order of data/presentation-cells.json; each emblem is a die-cut painted object on flat
// black, so its own outline becomes the alpha (lib/emblem.mjs). This script only writes the jobs; it never calls the generator.
//   node tools/content/art/emblem-jobs.mjs [outDir] [--sheet NN ...]       (default outDir: <ZIN_ART>/jobs)
//   node tools/content/imagegen.mjs <outDir>/emblem-jobs.json
// Raw sheets land in <ZIN_ART>/raw/icons/icons-emblem-NN.png. The builder (modules/presentation.mjs) uses a sheet only when the
// cell map names it with "matte": "emblem" and its last review line in provenance.jsonl is accepted.
import { readFileSync } from 'node:fs';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ART } from '../lib/paths.mjs';
import { STYLE_LINE } from '../lib/ui_vocab.mjs';
import { EMBLEM_CHECK } from '../lib/emblem.mjs';

const dataFile = name => fileURLToPath(new URL(`../data/${name}`, import.meta.url));
export const EMBLEM_SHEET = n => `icons-emblem-${String(n).padStart(2, '0')}`;
export const COLS = 4, ROWS = 3, PER_SHEET = COLS * ROWS;
export { EMBLEM_CHECK };

// The shared clauses. The shape clause is the point of the sheet: no backdrop of any kind, so the outline is the object itself.
const GROUND = 'on a solid flat pure black (#000000) background with wide black gutters between the emblems and a black margin at every edge: no glow, no blur, no vignette, no gradient, no texture, no shadow on the ground';
const SHAPE = 'Every emblem is a die-cut painted object: the subject itself, cut out cleanly along its own outline and floating alone on the black ground, so that its silhouette is a bold, clear, readable shape like a game icon. There is no backdrop behind it: no disc, no medallion, no round or square plate, no frame, no border, no rim and no panel of any kind. Paint it in rich colour with soft inner shading and warm key light from the upper left. Each emblem is centred in its grid cell and fills about 75% of the cell height, and no two emblems touch. The subject never contains pure black: its darkest shadows stay dark brown, deep blue or dark grey. Where the subject is a scene or a place, paint it as one compact vignette cut out along a natural irregular outline (a small floating island of ground, a drifting cloud, a torn edge), never as a rectangle or a circle';
const NO_MARKS = 'No text, no letters, no numbers, no runes, no readable writing or inscriptions, no labels, no logos, no watermark. No signature, no initials and no maker mark anywhere, especially not in the corners.';
const ORIGINAL = 'An original world: no character, costume, creature, emblem or place from any existing film, book or game; nothing that resembles the Lord of the Rings (no elven spires or tracery arches, no leaf-shaped banners or brooches, no white tree emblem, no flaming eye, no glowing ring inscription). No symbol of any real-world religion (no cross, no crescent, no star of David). No modern objects: no firearms, no gunpowder, no gears, no engines, no uniforms.';

export function loadSubjects() {
  const subjects = JSON.parse(readFileSync(dataFile('emblem-subjects.json'), 'utf8'));
  const cells = JSON.parse(readFileSync(dataFile('presentation-cells.json'), 'utf8')).icons;
  const order = cells.flatMap(s => s.keys);
  if (JSON.stringify(subjects.map(s => s.key)) !== JSON.stringify(order)) throw new Error('data/emblem-subjects.json does not list the catalog keys in the order of data/presentation-cells.json');
  return subjects;
}

export function sheetPrompt(items) {
  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    const part = items.slice(r * COLS, (r + 1) * COLS);
    if (part.length) rows.push(`Row ${r + 1}, left to right: ${part.map((it, i) => `${r * COLS + i + 1}. ${it.subject} (${it.palette})`).join('; ')}.`);
  }
  return `${STYLE_LINE} An asset sheet of ${items.length} focus-icon emblems for a fantasy grand-strategy game, in a wide 3:2 landscape image, arranged in an exact grid of ${COLS} columns and ${ROWS} rows, ${GROUND}. ${SHAPE}. ${rows.join(' ')} No figure shows a face. ${NO_MARKS} ${ORIGINAL}`;
}

export function emblemJobs({ rawDir = `${ART}/raw`, only } = {}) {
  const subjects = loadSubjects(), jobs = [];
  for (let s = 0; s * PER_SHEET < subjects.length; s++) {
    const n = s + 1, items = subjects.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
    if (only && !only.includes(n)) continue;
    jobs.push({
      id: EMBLEM_SHEET(n), kind: 'sheet', keys: items.map(i => i.key), grid: { cols: COLS, rows: ROWS, background: 'black' }, size: '1536x1024', quality: 'high',
      out: `${rawDir.split(path.sep).join('/')}/icons/${EMBLEM_SHEET(n)}.png`,
      check: { ...EMBLEM_CHECK, cols: COLS, rows: ROWS, expected: items.length },
      prompt: sheetPrompt(items),
    });
  }
  return jobs;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), only = [];
  for (let i = 0; i < args.length; i++) if (args[i] === '--sheet') only.push(Number(args.splice(i, 2)[1])), i--;
  const outDir = path.resolve(args[0] ?? `${ART}/jobs`);
  await mkdir(outDir, { recursive: true });
  const jobs = emblemJobs({ rawDir: path.join(outDir, '../raw'), ...(only.length ? { only } : {}) });
  await writeFile(path.join(outDir, 'emblem-jobs.json'), JSON.stringify(jobs, null, 1));
  console.log(JSON.stringify({ jobs: jobs.length, out: path.join(outDir, 'emblem-jobs.json') }));
}
