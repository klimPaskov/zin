// Tests for the technology art (modules/technology_art.mjs): the cell map lists every technology sprite once, every sheet's
// grid holds exactly its keys, the completeness check refuses a sprite still on the unknown icon once the family is marked
// complete, and the transparent blank is declared as a derived (tool-computed) file, not as an imagegen picture.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { techArtKeys, assertTechnologyArtComplete, techTexture, BLANK_TEXTURE, CELLS_FILE } from './modules/technology_art.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const cells = JSON.parse(readFileSync(CELLS_FILE, 'utf8'));

test('cell map lists each technology sprite exactly once, on a grid of its own size', () => {
  const keys = techArtKeys(cells);
  assert.equal(new Set(keys).size, keys.length, 'a technology key appears on two cells');
  assert.equal(keys.length, 279, 'the K51 tree has 279 researchable technologies');
  for (const s of cells.sheets) assert.equal(s.cols * s.rows, s.keys.length, `${s.sheet} grid ${s.cols}x${s.rows} does not hold ${s.keys.length} keys`);
  for (const k of keys) assert.match(k, /^zin_tech_[a-z0-9_]+$/, `${k} is not a technology key`);
});

test('the completeness check refuses a sprite still on the unknown icon once the cell map is complete', () => {
  const all = new Set(techArtKeys(cells));
  assert.doesNotThrow(() => assertTechnologyArtComplete({ complete: true, sheets: cells.sheets }, all));
  const short = new Set([...all].slice(1));
  assert.throws(() => assertTechnologyArtComplete({ complete: true, sheets: cells.sheets }, short), /still use the frame/);
  assert.doesNotThrow(() => assertTechnologyArtComplete({ complete: false, sheets: cells.sheets }, short));
});

test('technology textures and the blank sit under the ZIN technology folder', () => {
  assert.equal(techTexture('zin_tech_courier_ciphers'), 'gfx/interface/technologies/zin/zin_tech_courier_ciphers.dds');
  assert.equal(BLANK_TEXTURE, 'gfx/interface/technologies/zin/blank.dds');
});

test('the blank is declared as a derived file in the asset path rules', () => {
  const rule = JSON.parse(readFileSync(path.join(here, 'data/assets/families.json'), 'utf8')).rules.find(r => r.id === 'technology_blank');
  assert.ok(rule, 'no technology_blank rule');
  assert.equal(rule.route, 'derived');
  assert.ok(new RegExp(rule.match).test(BLANK_TEXTURE), 'the rule does not match the blank path');
});
