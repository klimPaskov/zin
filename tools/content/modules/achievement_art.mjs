// Achievement icons (UI overhaul lanes I11 and I12; handoffs docs/plans/ui_overhaul/handoffs/I11.md and I12.md; rules
// .claude/skills/hoi4-feature-assets/references/achievement-icons.md). Each of the nine deep-past achievements (data/deep_past.json
// achievements) has a completed, a grey and a not-eligible 64 × 64 DDS: gfx/achievements/<id>.dds, <id>_grey.dds and
// <id>_not_eligible.dds (root-only exception, the engine reads them by id).
//
// Shipped route (lane I12, owner decision K74): hoi4-imagegen 0.2.1 (family achievement, gpt-6-luna through the ChatGPT login). The tool
// generates the colour subject, processes it and writes the grey and not-eligible layers itself, with the supplied template backgrounds.
// The processed PNG triplet of each achievement is copied to art/source/achievement/imagegen/ (<id>.png, <id>_grey.png,
// <id>_not_eligible.png), converted to strict 64 × 64 DDS, and listed in art/source/achievement_art_manifest.json. The builder stages
// those DDS and their source PNG; it checks each file's SHA-256 against the manifest and its DDS header.
//
// Superseded route (lane I11, kept as history, not shipped): gptimage colour subjects under art/source/achievement/<id>*.png with
// frameSubject and the skill processor (buildTripletSources, layers, process below).
//
//   applyAchievementArt(staged, opts)          stages the manifest's DDS into gfx/achievements/ and their source PNG (warns on a changed file)
//   ddsFromPng(bytes)                          a 64 × 64 processed PNG as a strict DDS
//   frameSubject(file)                         the 64 × 64 colour layer of the superseded gptimage route
//   buildTripletSources(colour, id, dir)       writes the triplet sources of the superseded route
//   CLI: node tools/content/modules/achievement_art.mjs import <selection.json>   copies the processed triplets, writes DDS and the manifest
//        node tools/content/modules/achievement_art.mjs layers <selection.json>   superseded route: frames each subject and writes the triplet
//        node tools/content/modules/achievement_art.mjs process <triplets dir> <out dir>   superseded route: runs the skill processor
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { ART } from '../lib/paths.mjs';
import { dds, fromRaw } from '../lib/raster.mjs';

const sha256 = b => createHash('sha256').update(b).digest('hex');
const here = path.dirname(fileURLToPath(import.meta.url));
const ZIN = path.join(here, '..', '..', '..');
export const SIZE = 64, FILL = 56;
export const SKILL_TOOL = path.join(ZIN, '.claude', 'skills', 'hoi4-feature-assets', 'tools', 'process_achievement_icons.py');
export const TEMPLATE_DIR = path.join(ZIN, '.claude', 'skills', 'hoi4-feature-assets', 'assets', 'vanilla_reference', 'icons', 'achievements', 'template');
// The supplied workflow inputs and their SHA-256 values (achievement-icons.md). The overlay is composited unchanged onto the grey source.
export const OVERLAY = { file: path.join(TEMPLATE_DIR, 'overlay.png'), sha256: '89BC80C6AC975BF6F1FF000FF3070B20C337BFB8B8AE966AE35A5540C004D6DD' };
export const MANIFEST = path.join(ZIN, 'art', 'source', 'achievement_art_manifest.json');
export const SOURCE_DIR = path.join(ZIN, 'art', 'source', 'achievement');
export const GFX_DIR = 'gfx/achievements';
export const STATES = [
  { state: 'completed', key: 'colour', suffix: '' },
  { state: 'grey', key: 'grey', suffix: '_grey' },
  { state: 'not_eligible', key: 'not_eligible', suffix: '_not_eligible' },
];
export const IMAGEGEN_DIR = 'imagegen';

export const dataAchievementIds = () => Object.keys(JSON.parse(readFileSync(path.join(here, '..', 'data', 'deep_past.json'), 'utf8')).achievements);

// The colour layer: the alpha bounding box (alpha 32 or more, so the faint edge does not widen it) is cropped with a 2 px margin,
// resized to fit 56 × 56 and centred on a transparent 64 × 64 canvas. No pixel is keyed or drawn.
export async function frameSubject(file) {
  const src = sharp(file);
  const { data, info } = await src.clone().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] >= 32) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) throw new Error(`${file}: no subject pixels`);
  const pad = 2, left = Math.max(0, x0 - pad), top = Math.max(0, y0 - pad);
  const width = Math.min(info.width, x1 + pad + 1) - left, height = Math.min(info.height, y1 + pad + 1) - top;
  const fitted = await sharp(file).extract({ left, top, width, height }).resize(FILL, FILL, { fit: 'inside', kernel: 'lanczos3' }).png().toBuffer({ resolveWithObject: true });
  const w = fitted.info.width, h = fitted.info.height;
  const ox = Math.floor((SIZE - w) / 2), oy = Math.floor((SIZE - h) / 2);
  return sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: fitted.data, left: ox, top: oy }]).png().toBuffer();
}

// The three source layers of one achievement, written beside each other in dir: <id>.png, <id>_grey.png, <id>_not_eligible.png.
export async function buildTripletSources(colourPng, id, dir) {
  const overlay = readFileSync(OVERLAY.file);
  if (sha256(overlay).toUpperCase() !== OVERLAY.sha256) throw new Error(`overlay hash changed: ${OVERLAY.file}`);
  mkdirSync(dir, { recursive: true });
  const { writeFileSync } = await import('node:fs');
  const grey = await sharp(colourPng).greyscale().png().toBuffer();
  const notEligible = await sharp(grey).composite([{ input: overlay, left: 0, top: 0 }]).png().toBuffer();
  writeFileSync(path.join(dir, `${id}.png`), colourPng);
  writeFileSync(path.join(dir, `${id}_grey.png`), grey);
  writeFileSync(path.join(dir, `${id}_not_eligible.png`), notEligible);
  return { colour: sha256(colourPng), grey: sha256(grey), notEligible: sha256(notEligible) };
}

// Stages the manifest's processed DDS and their source PNG (art/source/achievement/imagegen/). Each DDS must exist with its recorded SHA-256
// and be a 64 × 64 DDS; each source PNG must match its recorded SHA-256. Otherwise the file is skipped with a warning.
export async function applyAchievementArt(staged, { manifest = MANIFEST, sourceDir = SOURCE_DIR, root = ZIN, warn = () => {} } = {}) {
  if (!existsSync(manifest)) { warn('achievement art: no manifest'); return { staged: 0 }; }
  const entries = JSON.parse(readFileSync(manifest, 'utf8')).files;
  let count = 0;
  for (const e of entries) {
    const bytes = await readFile(path.join(sourceDir, e.file)).catch(() => null);
    if (!bytes) { warn(`achievement art: ${e.file} missing`); continue; }
    if (sha256(bytes) !== e.sha256) { warn(`achievement art: ${e.file} changed since the manifest`); continue; }
    if (bytes.toString('latin1', 0, 4) !== 'DDS ' || bytes.readUInt32LE(12) !== SIZE || bytes.readUInt32LE(16) !== SIZE) { warn(`achievement art: ${e.file} is not a 64 x 64 DDS`); continue; }
    if (e.source) {
      const png = await readFile(path.join(root, e.source)).catch(() => null);
      if (!png) { warn(`achievement art: source ${e.source} missing`); continue; }
      if (sha256(png) !== e.sourceSha256) { warn(`achievement art: source ${e.source} changed since the manifest`); continue; }
      staged.files.set(e.source, png);
    }
    staged.files.set(`${GFX_DIR}/${e.name}.dds`, bytes);
    count++;
  }
  return { staged: count };
}

// A processed 64 × 64 RGBA PNG (hoi4-imagegen output) as a strict DDS (A8R8G8B8, uncompressed). Decodes only; nothing is keyed or resized.
export async function ddsFromPng(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== SIZE || info.height !== SIZE || info.channels !== 4) throw new Error(`${info.width}x${info.height}x${info.channels}: expected ${SIZE}x${SIZE}x4`);
  return dds(fromRaw(data, SIZE, SIZE));
}

// The nine (or fewer) achievements of a selection file: { "<id>": { colour, grey, not_eligible, candidate, artifact } }, every path a processed
// PNG of hoi4-imagegen. Copies the three PNG layers into art/source/achievement/imagegen/, writes their DDS and the manifest.
export async function importTriplets(selection, { sourceDir = SOURCE_DIR, manifest = MANIFEST } = {}) {
  const dir = path.join(sourceDir, IMAGEGEN_DIR);
  mkdirSync(dir, { recursive: true });
  const files = [];
  for (const [id, sel] of Object.entries(selection)) {
    for (const st of STATES) {
      const name = `${id}${st.suffix}`, png = readFileSync(sel[st.key]);
      const rel = `${IMAGEGEN_DIR}/${name}.png`;
      const ddsBytes = await ddsFromPng(png);
      writeFileSync(path.join(sourceDir, rel), png);
      writeFileSync(path.join(sourceDir, `${IMAGEGEN_DIR}/${name}.dds`), ddsBytes);
      files.push({
        out: `${GFX_DIR}/${name}.dds`, id, state: st.state, name, file: `${IMAGEGEN_DIR}/${name}.dds`, sha256: sha256(ddsBytes),
        source: `art/source/achievement/${rel}`, sourceSha256: sha256(png), candidate: sel.candidate, artifact: sel.artifact,
        ops: ['hoi4-imagegen 0.2.1 achievement recipe (processed by the tool: subject, grey layer, not-eligible layer over the supplied template)', 'dds a8r8g8b8 decoded from the processed PNG, 64 × 64'],
      });
    }
  }
  files.sort((a, b) => a.out.localeCompare(b.out, 'en'));
  writeFileSync(manifest, JSON.stringify({ generator: 'tools/content/modules/achievement_art.mjs (import)', route: 'hoi4-imagegen 0.2.1, family achievement, gpt-6-luna (lane I12)', files }, null, 1) + '\n');
  return { achievements: Object.keys(selection).length, files: files.length };
}

// ------------------------------------------------------------------------------------------------ CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'layers') {
    // selection.json: { "<achievement id>": "<raw colour PNG>" }. Writes the triplet sources to <art>/processed/achievement/triplets.
    const selection = JSON.parse(readFileSync(rest[0], 'utf8'));
    const dir = path.join(ART, 'processed', 'achievement', 'triplets');
    const out = {};
    for (const [id, file] of Object.entries(selection)) {
      const framed = await frameSubject(file);
      out[id] = await buildTripletSources(framed, id, dir);
    }
    console.log(JSON.stringify({ dir, achievements: Object.keys(out).length, hashes: out }));
  } else if (cmd === 'import') {
    // selection.json: { "<id>": { "colour": "<processed PNG>", "grey": "...", "not_eligible": "...", "candidate": "...", "artifact": "..." } }
    const selection = JSON.parse(readFileSync(rest[0], 'utf8'));
    console.log(JSON.stringify(await importTriplets(selection)));
  } else if (cmd === 'process') {
    const [inputDir, outDir] = rest;
    execFileSync('py', ['-3.13', '-B', SKILL_TOOL, '--input', inputDir, '--output-dir', outDir, '--write-png'], { stdio: 'inherit' });
  } else {
    console.log('usage: achievement_art.mjs import <selection.json> | layers <selection.json> | process <triplets dir> <out dir>');
  }
}
