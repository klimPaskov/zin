// Header illustrations of ZIN's panels (UI overhaul lane W7, design system section 6.4), from tools/content/data/ui/zin_headers.json.
// This script only composes the prompts and crops the generated pictures; every header is painted by the image model.
//   node tools/content/art/zin-header-jobs.mjs [jobs.json]   writes the jobs (default: <ZIN_ART>/jobs/ui-zin-headers-jobs.json)
//   node tools/content/imagegen.mjs <jobs.json>              paints them (gpt-6-luna only) into <ZIN_ART>/raw/ui/headers/
//   node tools/content/art/zin-header-jobs.mjs --crop        cuts the band of each picture (full width at the header aspect) to art/source/ui/headers/<id>.png
// The build reads only the tracked bands (deterministic on every machine); the full pictures stay in the art store.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ART, ART_SOURCE } from '../lib/paths.mjs';

export const HEADERS_FILE = fileURLToPath(new URL('../data/ui/zin_headers.json', import.meta.url));
export const loadHeaderSpec = (file = HEADERS_FILE) => JSON.parse(readFileSync(file, 'utf8'));
export const rawHeader = id => `${ART}/raw/ui/headers/ui-header-${id}.png`;
export const trackedHeader = id => `${ART_SOURCE}/ui/headers/${id}.png`;

export function headerPrompt(spec, h) {
  return [spec.style, spec.composition, `The scene: ${h.subject}.`, spec.rules].join('\n');
}
export function headerJobs(spec) {
  return spec.headers.map(h => ({ id: `ui-header-${h.id}`, prompt: headerPrompt(spec, h), out: rawHeader(h.id), size: spec.generation.size, quality: spec.generation.quality }));
}
// The band of a header: the full width of the picture at the header aspect, from band.top (a fraction of the height).
export function bandOf(spec, h, width, height) { const bh = Math.round(width * spec.size[1] / spec.size[0]); const top = Math.min(height - bh, Math.round((h.band?.top ?? (height - bh) / 2 / height) * height)); return { left: 0, top, width, height: bh }; }

async function cropAll(spec) {
  for (const h of spec.headers) {
    const src = rawHeader(h.id);
    if (!existsSync(src)) { console.log(`${h.id}: not generated yet`); continue; }
    const meta = await sharp(src).metadata(), box = bandOf(spec, h, meta.width, meta.height);
    mkdirSync(path.dirname(trackedHeader(h.id)), { recursive: true });
    await sharp(src).extract(box).png().toFile(trackedHeader(h.id));
    console.log(`${h.id}: band ${box.width}x${box.height} from row ${box.top} of ${meta.width}x${meta.height}`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const spec = loadHeaderSpec();
  if (process.argv[2] === '--crop') await cropAll(spec);
  else {
    const file = path.resolve(process.argv[2] ?? `${ART}/jobs/ui-zin-headers-jobs.json`);
    mkdirSync(path.dirname(file), { recursive: true });
    mkdirSync(path.dirname(rawHeader('x')), { recursive: true });
    writeFileSync(file, JSON.stringify(headerJobs(spec), null, 2) + '\n');
    console.log(file);
  }
}
