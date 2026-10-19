// Builds the synthetic trees of assets.test.mjs: a small mod ("good") and a stand-in for the installed game ("game").
// The text files are committed beside this script; the pictures, meshes, the localisation file and the provenance
// are generated here from seeded noise, so nothing binary is committed and nothing comes from the game or a mod.
//   import { makeMod, makeGame } from './fixtures/assets/make.mjs'
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Canvas, dds, tga } from '../../lib/raster.mjs';
import { rng } from '../../lib/core.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const sha256 = b => createHash('sha256').update(b).digest('hex');

// An 8 x 8 grid of seeded colour blocks: distinct seeds give clearly different pictures.
export function noiseCanvas(w, h, seed) {
  const r = rng(seed), c = new Canvas(w, h), colors = [];
  for (let i = 0; i < 64; i++) colors.push([Math.floor(r() * 256), Math.floor(r() * 256), Math.floor(r() * 256), 255]);
  const bx = Math.max(1, Math.floor(w / 8)), by = Math.max(1, Math.floor(h / 8));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) c.px.set(colors[(Math.min(7, Math.floor(y / by))) * 8 + Math.min(7, Math.floor(x / bx))], (y * w + x) * 4);
  return c;
}
export const ddsOf = (w, h, seed) => dds(noiseCanvas(w, h, seed));
export const tgaOf = (w, h, seed) => tga(noiseCanvas(w, h, seed));
export const bytesOf = (n, seed) => { const r = rng(seed), b = Buffer.alloc(n); for (let i = 0; i < n; i++) b[i] = Math.floor(r() * 256); return b; };
const png = async (r, g, b) => sharp({ create: { width: 8, height: 8, channels: 3, background: { r, g, b } } }).png({ compressionLevel: 9 }).toBuffer();
export const yml = entries => Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(`l_english:\n${entries.map(([k, v]) => ` ${k}:0 "${v}"`).join('\n')}\n`)]);

function put(root, rel, bytes) { const full = path.join(root, rel); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, bytes); }

export const TABLES = {
  countries: [{ tag: 'Y01', name: 'Alpha' }, { tag: 'Y02', name: 'Beta' }],
  flagCells: [{ sheet: 'flags-sheet-01', index: 0, row: 0, col: 0, rows: 1, tag: 'Y01', name: 'Alpha' }, { sheet: 'flags-sheet-01', index: 1, row: 0, col: 1, rows: 1, tag: 'Y02', name: 'Beta' }],
};

// The installed-game stand-in: sprites, a font, sound effects, a shader, one localisation key, and two pictures.
export function makeGame(dest) {
  fs.cpSync(path.join(here, 'game'), dest, { recursive: true });
  put(dest, 'gfx/interface/vanilla_icon.dds', ddsOf(64, 64, 900));
  put(dest, 'gfx/interface/goals/shine_overlay.dds', ddsOf(32, 32, 901));
  return dest;
}

// The mod. Every picture has the size of its family rule; provenance covers every source.
export async function makeMod(dest) {
  fs.cpSync(path.join(here, 'good'), dest, { recursive: true });
  const shipped = new Map();
  const ship = (rel, bytes) => { put(dest, rel, bytes); shipped.set(rel, bytes); };
  ship('gfx/interface/goals/zin/test_a.dds', ddsOf(100, 88, 1));
  ship('gfx/interface/goals/zin/test_b.dds', ddsOf(100, 88, 2));
  ship('gfx/interface/goals/zin/test_c.dds', ddsOf(100, 88, 3));
  ship('gfx/interface/ideas/zin/test_a.dds', ddsOf(64, 64, 4));
  ship('gfx/event_pictures/zin/zin_evt_one.dds', ddsOf(210, 176, 5));
  ship('gfx/event_pictures/zin/zin_evt_two.dds', ddsOf(210, 176, 6));
  ship('gfx/leaders/zin/men_male_1.dds', ddsOf(156, 210, 7));
  ship('gfx/leaders/zin/men_male_2.dds', ddsOf(156, 210, 8));
  [['Y01', 11], ['Y02', 12]].forEach(([tag, seed]) => {
    ship(`gfx/flags/${tag}.tga`, tgaOf(82, 52, seed));
    ship(`gfx/flags/medium/${tag}.tga`, tgaOf(41, 26, seed + 100));
    ship(`gfx/flags/small/${tag}.tga`, tgaOf(10, 7, seed + 200));
  });
  const model = 'gfx/models/units/zin/zin_test_unit';
  ship(`${model}/zin_test_unit.mesh`, bytesOf(512, 21));
  ship(`${model}/zin_test_unit_idle.anim`, bytesOf(128, 22));
  ship(`${model}/zin_test_unit_move.anim`, bytesOf(128, 23));
  ship(`${model}/zin_test_unit_diffuse.dds`, ddsOf(1024, 1024, 24));
  ship(`${model}/zin_test_unit_normal.dds`, ddsOf(1024, 1024, 25));
  put(dest, 'localisation/english/zin_test_l_english.yml', yml([['ZIN_TEST_BUTTON', 'Open'], ['ZIN_TEST_TEXT', 'A line of text'], ['zin_test.1.t', 'First'], ['zin_test.1.a', 'Go on'], ['zin_test.2.t', 'Second'], ['zin_test.2.a', 'End']]));

  // Sources, provenance and the module manifest.
  const sources = [['icons/icons-test-01.png', [10, 20, 30]], ['events/one.png', [40, 50, 60]], ['events/two.png', [70, 80, 90]], ['portraits/portraits-men.png', [100, 110, 120]], ['flags/flags-sheet-01.png', [130, 140, 150]]];
  const lines = [], shaOf = new Map();
  for (const [rel, [r, g, b]] of sources) {
    const bytes = await png(r, g, b), sha = sha256(bytes), id = path.basename(rel, '.png');
    put(dest, `art/source/${rel}`, bytes); shaOf.set(rel, sha);
    lines.push({ id, out: `../raw/${rel}`, model: 'test', size: '8x8', quality: 'high', references: [], prompt: 'synthetic test picture', sha256: sha, accepted: true, seconds: 1, at: '2026-10-19T00:00:00.000Z' });
    lines.push({ id, out: `../raw/${rel}`, sha256: sha, accepted: true, reviewer: 'agent', kind: 'sheet', actualSize: '8x8', note: 'fixture review', at: '2026-10-19T00:00:01.000Z' });
  }
  put(dest, 'art/source/provenance.jsonl', `${lines.map(l => JSON.stringify(l)).join('\n')}\n`);
  const line = (out, source) => ({ out, source: `art/source/${source}`, sourceSha256: shaOf.get(source), ops: ['fixture crop', 'dds a8r8g8b8'], sha256: sha256(shipped.get(out)) });
  put(dest, 'art/source/test_manifest.json', JSON.stringify({ generator: 'fixtures/assets/make.mjs', decisions: [], files: [
    line('gfx/interface/goals/zin/test_a.dds', 'icons/icons-test-01.png'), line('gfx/interface/goals/zin/test_b.dds', 'icons/icons-test-01.png'), line('gfx/interface/goals/zin/test_c.dds', 'icons/icons-test-01.png'),
    line('gfx/interface/ideas/zin/test_a.dds', 'icons/icons-test-01.png'),
    line('gfx/event_pictures/zin/zin_evt_one.dds', 'events/one.png'), line('gfx/event_pictures/zin/zin_evt_two.dds', 'events/two.png'),
  ] }, null, 1));
  return { root: dest, shipped, tables: TABLES };
}

export { put };
