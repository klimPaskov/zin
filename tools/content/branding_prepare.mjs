// Branding preparation (R-90): copies the accepted branding generations into art/source/branding/, derives the
// transparent emblem from the owner's ZinLogoCut.png and writes art/source/branding/branding_manifest.json.
// Run once per change of a source; the content builder reads only the tracked outputs of this step.
// Owner originals are read here, never tracked. Inputs (env, with the owner's defaults):
//   ZIN_OWNER_LOGOS    the owner's Themed folder (ZinLogoCut.png)
//   ZIN_ART            art working copy holding raw/branding/ (the three accepted generations)
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { ART, ZIN } from './lib/paths.mjs';

const OWNER = (process.env.ZIN_OWNER_LOGOS || 'C:/Users/klimp/Documents/ZIN/Themed');
const OUT = `${ZIN}/art/source/branding`;
const sha256 = b => createHash('sha256').update(b).digest('hex');

// The owner's five files and their recorded hashes; a mismatch stops the step (originals must be untouched).
export const OWNER_FILES = {
  'Logos/ZinLogoCut.png': 'ffd770443cdb1b69e9249876d4facede53c64843b6186c195a2bed786fca4194',
  'Logos/ColorfulZinLogo.PNG': '6ea5e0041a2abb3015a34a615c8fe0dfdb1c142c0b38457db4ae38c03f4d7360',
  'Logos/ZinLogo.png': 'a290f7da0077ea2db0bd858cbb0f954b756c62030f3388d7c935073b794f6ecc',
  'Backgrounds/ZIN.LOGO.BACKGROUND.png': 'bebd9c9711f76988314554bcf454641537c736a85e820122387f2ca6e75d4042',
  'Backgrounds/ZIN.png': '281ea09f0bbc59ce020fde3f054b9b4fd7a12ae2d7c5fbdb4eac91dc578b22d0',
};
// The accepted generations (ids as recorded in the art working provenance).
export const GENERATED = {
  'branding_emblem_v1.png': { id: 'branding_emblem_v1', sha256: 'f1c97db590ce3614e41bb92a07a066ef4f8e5d2dc7b374c84af732d72a05e5c5' },
  'branding_menu_backdrop_v1.png': { id: 'branding_menu_backdrop_v1', sha256: '7d1f94fa9f8f297e754ea31ed05b1397eb3366340009d9c3dcccce0ca6dc18f9' },
  'branding_banner_v1.png': { id: 'branding_banner_v1', sha256: 'ebcccdbd363a0a224d2a41aa5541ba69678777444b399625073430d11ccba5a8' },
};

// Matte: the owner's drawing is dark ink on white paper. Ink strength = darkness times the source alpha, stretched
// between 0.10 and 0.55 so the paper is fully transparent and the strokes keep their weight; the colour is a fixed pale silver.
export function matteOwnerEmblem(data, w, h) {
  const out = Buffer.alloc(w * h * 4), lo = 0.10, hi = 0.55, SILVER = [214, 220, 228];
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3] / 255;
    const ink = ((255 - (0.299 * r + 0.587 * g + 0.114 * b)) / 255) * a;
    const t = Math.min(1, Math.max(0, (ink - lo) / (hi - lo)));
    out[i * 4] = SILVER[0]; out[i * 4 + 1] = SILVER[1]; out[i * 4 + 2] = SILVER[2]; out[i * 4 + 3] = Math.round(255 * t);
  }
  return out;
}

async function main() {
  await import('node:fs').then(fs => fs.mkdirSync(OUT, { recursive: true }));
  const manifest = { generator: 'tools/content/branding_prepare.mjs', owner: [], generated: [], derived: [] };
  for (const [rel, want] of Object.entries(OWNER_FILES)) {
    const bytes = await readFile(`${OWNER}/${rel}`), got = sha256(bytes);
    if (got !== want) throw new Error(`owner file ${rel} changed: ${got} (expected ${want})`);
    manifest.owner.push({ path: `${OWNER}/${rel}`, sha256: got, note: 'read only; not tracked' });
  }
  const owner = `${OWNER}/Logos/ZinLogoCut.png`;
  const { data, info } = await sharp(owner).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const matte = matteOwnerEmblem(data, info.width, info.height);
  const matteBytes = await sharp(matte, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  await writeFile(`${OUT}/owner_emblem_matte.png`, matteBytes);
  manifest.derived.push({ out: 'art/source/branding/owner_emblem_matte.png', from: 'Logos/ZinLogoCut.png', sha256: sha256(matteBytes), size: `${info.width}x${info.height}`,
    ops: ['read RGBA', 'ink = (255 - luma) / 255 * alpha', 'stretch ink 0.10-0.55 to alpha', 'fixed silver rgb 214,220,228', 'png'] });
  for (const [name, g] of Object.entries(GENERATED)) {
    const src = `${ART}/raw/branding/${name}`, bytes = await readFile(src), got = sha256(bytes);
    if (got !== g.sha256) throw new Error(`generation ${name} changed: ${got}`);
    await copyFile(src, `${OUT}/${name}`);
    manifest.generated.push({ out: `art/source/branding/${name}`, id: g.id, sha256: got, provenance: 'art/source/provenance.jsonl' });
  }
  await writeFile(`${OUT}/branding_manifest.json`, JSON.stringify(manifest, null, 1) + '\n');
  process.stdout.write(JSON.stringify(manifest.derived, null, 1) + '\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
