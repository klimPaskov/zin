// Event picture beats (UI overhaul lane I10). One generated picture per chain beat; every event of a beat reuses it.
// The beat table is tools/content/data/event_beats.json. This module:
//   - writes the image jobs for the runner (tools/content/imagegen.mjs) into the art store (jobs-i10/jobs.json),
//   - assigns each beat's picture key to its events in the event data (`picture`), once, with `assign`,
//   - lists the beat pictures as picture rows (id, key, crop) for presentation.mjs, which ships only accepted art.
// Run from the mod root:  node tools/content/modules/event_art.mjs jobs | assign
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ART } from '../lib/paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BEATS_FILE = path.join(HERE, '..', 'data', 'event_beats.json');
const DATA_DIR = path.join(HERE, '..', 'data');
export const IMAGE_SIZE = '1536x1024';           // landscape source; the builder covers the 210 x 176 event window from it
export const JOBS_DIR = path.join(ART, 'jobs-i10');

export async function loadBeats() {
  const beats = JSON.parse(await readFile(BEATS_FILE, 'utf8'));
  const seen = new Set();
  for (const b of beats.beats) {
    if (!/^[a-z][a-z0-9_]*$/.test(b.key)) throw new Error(`beat key ${b.key} is not snake_case`);
    if (seen.has(b.key)) throw new Error(`beat key ${b.key} appears twice`);
    seen.add(b.key);
  }
  return beats;
}

// Picture rows for presentation.mjs: { id, key, crop } with crop 'standard' (no news picture is built here).
export async function beatPictureRows() {
  const { beats } = await loadBeats();
  return beats.map(b => ({ id: `event-${b.key}`, key: b.key, crop: b.crop ?? 'standard', gate: b.gate ?? null }));
}

// Generation jobs: one per beat, prompt = house style + the beat's scene. Output under the art store raw folder.
export async function beatJobs() {
  const data = await loadBeats();
  return data.beats.map(b => ({
    id: `i10-${b.key}`,
    prompt: `${data.style} Scene: ${b.scene} Eindil is a tall, pale-skinned man of the old First Men with dark hair and a weathered face; do not show a demon or a crown unless the scene says so. Composition: one clear subject, readable at 210 by 176 pixels.`,
    out: path.join(ART, 'raw', 'event', `${b.raw ?? b.key}.png`).replace(/\\/g, '/'),
    size: IMAGE_SIZE,
    quality: 'high',
    references: [],
  }));
}

// Write the beat picture rows into the tracked cell map (tools/content/data/presentation-cells.json, events list), once per beat key.
export async function writeCellRows() {
  const cellsFile = path.join(DATA_DIR, 'presentation-cells.json');
  const cells = JSON.parse(await readFile(cellsFile, 'utf8'));
  const rows = await beatPictureRows();
  // Replace earlier rows of these beats: the shipped key or the first (raw) name they had before the rename.
  const keys = new Set(rows.flatMap(r => [r.key, r.raw].filter(Boolean)));
  // Rows of the earlier digit-suffixed sub-beats (beat_<name>_2) are dropped too: their pictures are the letter-suffixed keys now.
  const stale = e => keys.has(e.key) || /^beat_.+_\d+$/.test(e.key);
  cells.events = [...cells.events.filter(e => !stale(e)), ...rows];
  await writeFile(cellsFile, JSON.stringify(cells, null, 1), 'utf8');
  return rows.length;
}

// Assign beat keys to the events in the event data files. Only events listed in a beat change; the rest keep their picture.
export async function assignBeatPictures(files = ['events_world_eindil_1.json', 'events_world_eindil_2.json', 'events_world_eindil_3.json']) {
  const { beats } = await loadBeats();
  const keyOf = new Map();
  for (const b of beats) for (const id of b.events) keyOf.set(id, b.key);
  const changed = [];
  for (const f of files) {
    const file = path.join(DATA_DIR, f);
    const data = JSON.parse(await readFile(file, 'utf8'));
    for (const e of data.events ?? []) {
      const key = keyOf.get(e.id);
      if (key && e.picture !== key) { changed.push(`${f}:${e.id} ${e.picture} -> ${key}`); e.picture = key; }
    }
    await writeFile(file, JSON.stringify(data, null, 1) + '\n', 'utf8');
  }
  return changed;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  if (cmd === 'jobs') {
    const jobs = await beatJobs();
    await mkdir(JOBS_DIR, { recursive: true });
    await writeFile(path.join(JOBS_DIR, 'jobs.json'), JSON.stringify(jobs, null, 1), 'utf8');
    console.log(`wrote ${jobs.length} jobs to ${path.join(JOBS_DIR, 'jobs.json')}`);
  } else if (cmd === 'cells') {
    console.log(`wrote ${await writeCellRows()} beat rows to presentation-cells.json`);
  } else if (cmd === 'assign') {
    const changed = await assignBeatPictures();
    console.log(`changed ${changed.length} event picture keys`);
    for (const c of changed) console.log(c);
  } else {
    console.log('usage: node tools/content/modules/event_art.mjs jobs | assign');
    process.exit(1);
  }
}
