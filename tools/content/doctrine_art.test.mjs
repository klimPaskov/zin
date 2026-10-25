// Tests for the doctrine art (modules/doctrine_art.mjs): the cell map covers exactly the doctrine sprites of the doctrine data,
// the cut of a sheet produces the vanilla sizes with round alpha, and the completeness check refuses a frame sprite once the
// family is marked complete. The synthetic sheet is painted here, not shipped.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { cutSheet, doctrineArtKeys, assertDoctrineArtComplete, SIZE, loadDoctrineArtCells } from './modules/doctrine_art.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const doctrines = JSON.parse(readFileSync(path.join(here, 'data/technologies_doctrines.json'), 'utf8'));

// The sprite set the doctrine writer uses (technologies.mjs): medium icons, track bg and icon, folder ledger, tab and decor.
function expectedKeys(d) {
  const keys = [...d.grand.map(g => g.key), ...d.subs.map(s => s.key), d.hidden.key];
  for (const t of d.tracks) keys.push(`${t.key}_bg`, `${t.key}_icon`);
  for (const f of d.folders) keys.push(`${f.key}_ledger`, `${f.key}_tab`, `decor_${f.key}`);
  return keys;
}

test('the cell map names every doctrine sprite exactly once', async () => {
  const cells = await loadDoctrineArtCells();
  const keys = doctrineArtKeys(cells);
  assert.equal(new Set(keys).size, keys.length, 'a key appears twice in the cell map');
  assert.deepEqual([...keys].sort(), [...expectedKeys(doctrines)].sort());
  assert.equal(keys.length, 86);
});

test('the cell map sheet counts match their key lists', async () => {
  const cells = await loadDoctrineArtCells();
  for (const s of cells.sheets) assert.equal(s.keys.length <= s.cols * s.rows, true, `${s.sheet} has more keys than cells`);
});

test('a complete family refuses a sprite that still uses the frame; an incomplete one does not', () => {
  const keys = expectedKeys(doctrines);
  const all = new Set(keys), missing = new Set(keys.slice(1));
  const sheets = [{ sheet: 'all', method: 'grid', cols: 1, rows: keys.length, keys }];
  assert.doesNotThrow(() => assertDoctrineArtComplete({ complete: false, sheets }, missing));
  assert.doesNotThrow(() => assertDoctrineArtComplete({ complete: true, sheets }, all));
  assert.throws(() => assertDoctrineArtComplete({ complete: true, sheets }, missing), /still use the frame/);
});

test('a medallion sheet is cut to the vanilla icon size with a round alpha', async () => {
  // A black sheet with three bright discs on a 3x1 grid; detection finds them and the cut keeps round alpha.
  const W = 1536, H = 512, cw = W / 3;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/>` +
    [0, 1, 2].map(i => `<circle cx="${cw * i + cw / 2}" cy="${H / 2}" r="${cw * 0.36}" fill="#c08040"/>`).join('') + '</svg>';
  const dir = await mkdtemp(path.join(os.tmpdir(), 'doctrine-art-'));
  const file = path.join(dir, 'sheet.png');
  await writeFile(file, await sharp(Buffer.from(svg)).png().toBuffer());
  const sheet = { sheet: 'test', method: 'medallion', cols: 3, rows: 1, keys: ['zin_gd_shield_wall', 'zin_sub_dread', 'zin_track_foot_icon'] };
  const pieces = await cutSheet(file, sheet);
  assert.equal(pieces.length, 3);
  for (const p of pieces) {
    assert.equal(p.w, SIZE.medallion);
    assert.equal(p.h, SIZE.medallion);
    assert.equal(p.buf[3], 0, 'corner pixel is clear');
    const centre = ((SIZE.medallion / 2) * SIZE.medallion + SIZE.medallion / 2) * 4 + 3;
    assert.equal(p.buf[centre], 255, 'centre pixel is opaque');
  }
});

test('a tab sheet is cut to the vanilla tab size', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'doctrine-art-'));
  const file = path.join(dir, 'tabs.png');
  await writeFile(file, await sharp({ create: { width: 1536, height: 1024, channels: 3, background: { r: 40, g: 30, b: 20 } } }).png().toBuffer());
  const sheet = { sheet: 'tabs', method: 'grid', cols: 1, rows: 4, keys: ['land_tab', 'naval_tab', 'air_tab', 'special_forces_tab'] };
  const pieces = await cutSheet(file, sheet);
  assert.equal(pieces.length, 4);
  for (const p of pieces) { assert.equal(p.w, SIZE.tab[0]); assert.equal(p.h, SIZE.tab[1]); }
});
