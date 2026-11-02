// Event picture beats (UI overhaul lane I10). One generated picture per chain beat; every event of a beat reuses it.
// The beat table is tools/content/data/event_beats.json (a beat's `chain` defaults to the file's `chain`). This module:
//   - writes the image jobs for the runner (tools/content/imagegen.mjs) into the art store (jobs-i10/jobs-<prefix>.json),
//   - accepts reviewed generations into art/source/events (news-only beats are converted to black and white),
//   - appends the generation and review lines to the provenance logs,
//   - assigns each beat's picture key to its events in the event data (`picture`), once, with `assign`,
//   - lists the beat pictures as picture rows (id, key, crop, gate) for presentation.mjs, which ships only accepted art.
// Run from the mod root:
//   node tools/content/modules/event_art.mjs jobs [prefix] | accept [prefix] | log [prefix] | assign | cells
import { readFile, writeFile, mkdir, copyFile, appendFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import { ART } from '../lib/paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BEATS_FILE = path.join(HERE, '..', 'data', 'event_beats.json');
const DATA_DIR = path.join(HERE, '..', 'data');
const REPO_EVENTS_ART = path.join(HERE, '..', '..', '..', 'art', 'source', 'events');
const REPO_PROVENANCE = path.join(HERE, '..', '..', '..', 'art', 'source', 'provenance.jsonl');
export const IMAGE_SIZE = '1536x1024';           // landscape source; the builder covers the 210 x 176 event window from it
export const JOBS_DIR = path.join(ART, 'jobs-i10');
const STORE_PROVENANCE = path.join(ART, 'jobs', 'provenance.jsonl');

// The subject sentence each chain's prompts carry. The Eindil sentence is the one the first 50 beats were generated with.
const CHAIN_SUBJECT = {
  eindil: 'Eindil is a tall, pale-skinned man of the old First Men with dark hair and a weathered face; do not show a demon or a crown unless the scene says so.',
  afrit: 'No name, label or demon form appears unless the scene says so; no crosses and no real-world religious symbols.',
  crowns: 'No name, label or demon form appears unless the scene says so; no crosses and no real-world religious symbols.',
};

export async function loadBeats() {
  const beats = JSON.parse(await readFile(BEATS_FILE, 'utf8'));
  const seen = new Set();
  for (const b of beats.beats) {
    if (!/^[a-z][a-z0-9_]*$/.test(b.key)) throw new Error(`beat key ${b.key} is not snake_case`);
    if (seen.has(b.key)) throw new Error(`beat key ${b.key} appears twice`);
    seen.add(b.key);
    b.chain = b.chain ?? beats.chain;
    if (!CHAIN_SUBJECT[b.chain]) throw new Error(`beat ${b.key} has no chain subject for chain ${b.chain}`);
  }
  return beats;
}

// Picture rows for presentation.mjs: { id, key, crop, gate }. crop 'standard' (event), 'news' (news only) or 'both'.
export async function beatPictureRows() {
  const { beats } = await loadBeats();
  return beats.map(b => ({ id: `event-${b.key}`, key: b.key, crop: b.crop ?? 'standard', gate: b.gate ?? null }));
}

const rawPath = b => path.join(ART, 'raw', 'event', `${b.raw ?? b.key}.png`).replace(/\\/g, '/');
const selected = (beats, prefix) => (prefix ? beats.filter(b => b.key.startsWith(prefix)) : beats);

// Generation jobs: one per beat, prompt = house style + the beat's scene. Output under the art store raw folder.
export async function beatJobs(prefix = '') {
  const { beats, style } = await loadBeats();
  return selected(beats, prefix).map(b => {
    const news = b.crop === 'news';
    const look = b.look ?? style;
    const composition = news
      ? 'Composition: the subject across the central horizontal band, a wide frame, readable at 397 by 153 pixels.'
      : 'Composition: one clear subject, readable at 210 by 176 pixels.';
    return {
      id: `i10-${b.key}`,
      prompt: `${look} Scene: ${b.scene} ${CHAIN_SUBJECT[b.chain]} ${composition}`,
      out: rawPath(b),
      size: IMAGE_SIZE,
      quality: 'high',
      references: [],
    };
  });
}

// Write the beat picture rows into the tracked cell map (tools/content/data/presentation-cells.json, events list), once per beat key.
export async function writeCellRows() {
  const cellsFile = path.join(DATA_DIR, 'presentation-cells.json');
  const cells = JSON.parse(await readFile(cellsFile, 'utf8'));
  const rows = await beatPictureRows();
  // Replace earlier rows of these beats: the shipped key or the first (raw) name they had before the rename.
  const keys = new Set(rows.flatMap(r => [r.key, r.raw].filter(Boolean)));
  // Rows of the earlier digit-suffixed sub-beats (beat_<name>_2) are dropped too: their pictures are the letter-suffixed keys now.
  // Every beat row is written from the beat table, so rows of beats renamed or removed since the last write go too (catalogue keys never start with beat_).
  const stale = e => keys.has(e.key) || String(e.key).startsWith('beat_');
  cells.events = [...cells.events.filter(e => !stale(e)), ...rows];
  await writeFile(cellsFile, JSON.stringify(cells, null, 1), 'utf8');
  return rows.length;
}

// Event data files and the chain whose beats they carry. Event ids repeat across chains, so each file uses only its chain's beats.
export const ASSIGN_FILES = [
  ['events_world_eindil_1.json', 'eindil'], ['events_world_eindil_2.json', 'eindil'], ['events_world_eindil_3.json', 'eindil'],
  ['events_mech_afrit.json', 'afrit'], ['events_world_lastwar.json', 'crowns'],
];

// Assign beat keys to the events in the event data files. Only events listed in a beat change; the rest keep their picture.
export async function assignBeatPictures(files = ASSIGN_FILES) {
  const { beats } = await loadBeats();
  const changed = [];
  for (const [f, chain] of files) {
    const keyOf = new Map();
    for (const b of beats) if (b.chain === chain) for (const id of b.events) keyOf.set(id, b.key);
    const file = path.join(DATA_DIR, f);
    const data = JSON.parse(await readFile(file, 'utf8'));
    // Story files keep their events under sets[].events (events_mech_afrit.json); the Eindil files keep them at the top level.
    const lists = [data.events ?? [], ...(data.sets ?? []).map(s => s.events ?? [])];
    for (const e of lists.flat()) {
      const key = keyOf.get(e.id);
      if (key && e.picture !== key) { changed.push(`${f}:${e.id} ${e.picture} -> ${key}`); e.picture = key; }
    }
    await writeFile(file, JSON.stringify(data, null, 1) + '\n', 'utf8');
  }
  return changed;
}

const sha = buf => createHash('sha256').update(buf).digest('hex');

// Accept reviewed generations: a copy under art/source/events for standard beats, a black-and-white conversion for news beats.
export async function acceptBeats(prefix) {
  const { beats } = await loadBeats();
  await mkdir(REPO_EVENTS_ART, { recursive: true });
  const reviews = [], derived = [];
  for (const b of selected(beats, prefix)) {
    const raw = rawPath(b);
    if (!existsSync(raw)) throw new Error(`no reviewed generation for ${b.key} at ${raw}`);
    const dst = path.join(REPO_EVENTS_ART, `${b.key}.png`);
    const news = b.crop === 'news';
    if (news) await sharp(raw).greyscale().png().toFile(dst);
    else await copyFile(raw, dst);
    const rawSha = sha(readFileSync(raw)), dstSha = sha(readFileSync(dst));
    const op = news ? 'black-and-white conversion (sharp greyscale) of the reviewed generation, the news crop source' : 'byte copy of the reviewed generation under the shipped beat key';
    // A black-and-white conversion is a derived picture: its record carries the generation prompt and names the raw generation it came from.
    if (news) derived.push(JSON.stringify({ id: `derive-i10-${b.key}`, out: `events/${b.key}.png`, model: 'gpt-6-luna', size: IMAGE_SIZE, quality: 'high', references: [], prompt: (await beatJobs(b.key)).find(j => j.id === `i10-${b.key}`).prompt, sha256: dstSha, accepted: true, derivedFrom: { id: `i10-${b.key}`, raw: `raw/event/${b.raw ?? b.key}.png`, sha256: rawSha, op: 'greyscale (sharp) of the reviewed generation' }, at: new Date().toISOString() }));
    reviews.push(JSON.stringify({
      id: `review-i10-${b.key}`, out: `art/source/events/${b.key}.png`, sha256: dstSha, accepted: true, reviewer: 'agent', kind: 'single',
      derivedFrom: { raw: `raw/event/${b.raw ?? b.key}.png`, sha256: rawSha, op },
      note: `UI overhaul lane I10: ${news ? 'news picture (397 x 153 crop, black and white)' : 'event picture (210 x 176 crop)'} for ${b.key}; contact-sheet review by the agent before acceptance.`,
    }));
  }
  await appendUnique(REPO_PROVENANCE, [...derived, ...reviews]);
  await appendUnique(STORE_PROVENANCE, [...derived, ...reviews]);
  return reviews.length;
}

// Generation lines the runner wrote for these beats (the jobs provenance is shared by every i10 job file).
export async function logGenerations(prefix) {
  const { beats } = await loadBeats();
  const ids = new Set(selected(beats, prefix).map(b => `i10-${b.raw ?? b.key}`));
  const jobsLog = path.join(JOBS_DIR, 'provenance.jsonl');
  if (!existsSync(jobsLog)) throw new Error(`no generation log at ${jobsLog}`);
  const lines = (await readFile(jobsLog, 'utf8')).split('\n').filter(Boolean).filter(l => ids.has(JSON.parse(l).id));
  await appendUnique(REPO_PROVENANCE, lines);
  await appendUnique(STORE_PROVENANCE, lines);
  return lines.length;
}

// Append only lines whose id is not logged yet (the logs are append-only; a line with the same id is never rewritten).
async function appendUnique(file, lines) {
  await mkdir(path.dirname(file), { recursive: true });
  const have = new Set(existsSync(file) ? (await readFile(file, 'utf8')).split('\n').filter(Boolean).map(l => { try { return `${JSON.parse(l).id}|${JSON.parse(l).sha256 ?? ''}`; } catch { return ''; } }) : []);
  const fresh = lines.filter(l => { const o = JSON.parse(l); return !have.has(`${o.id}|${o.sha256 ?? ''}`); });
  if (fresh.length) await appendFile(file, fresh.join('\n') + '\n', 'utf8');
  return fresh.length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2], prefix = process.argv[3] ?? '';
  if (cmd === 'jobs') {
    const jobs = await beatJobs(prefix);
    await mkdir(JOBS_DIR, { recursive: true });
    const file = path.join(JOBS_DIR, prefix ? `jobs-${prefix.replace(/[^a-z0-9_]/g, '')}.json` : 'jobs.json');
    await writeFile(file, JSON.stringify(jobs, null, 1), 'utf8');
    console.log(`wrote ${jobs.length} jobs to ${file}`);
  } else if (cmd === 'accept') {
    console.log(`accepted ${await acceptBeats(prefix)} pictures`);
  } else if (cmd === 'log') {
    console.log(`logged ${await logGenerations(prefix)} generation lines`);
  } else if (cmd === 'cells') {
    console.log(`wrote ${await writeCellRows()} beat rows to presentation-cells.json`);
  } else if (cmd === 'assign') {
    const changed = await assignBeatPictures();
    console.log(`changed ${changed.length} event picture keys`);
    for (const c of changed) console.log(c);
  } else {
    console.log('usage: node tools/content/modules/event_art.mjs jobs [prefix] | accept [prefix] | log [prefix] | assign | cells');
    process.exit(1);
  }
}
