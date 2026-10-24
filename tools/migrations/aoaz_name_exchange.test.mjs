// Tests of the Erdae and Aoaz name exchange (tools/migrations/aoaz_name_exchange.mjs, requirement R-01).
import test from 'node:test';
import assert from 'node:assert/strict';
import { exchange, renamePath } from './aoaz_name_exchange.mjs';

test('The main setting becomes Aoaz in every case form and inside identifiers', () => {
  const { text, count } = exchange('Erdae lies quiet. zin_erdae_bar, lord_of_all_erdae, ERDAE, zin:all-erdae');
  assert.equal(text, 'Aoaz lies quiet. zin_aoaz_bar, lord_of_all_aoaz, AOAZ, zin:all-aoaz');
  assert.equal(count, 5);
});

test('The neighbour formerly called Aoaz becomes Erdae, and nothing is renamed twice', () => {
  const { text } = exchange('The Path to Aoaz leaves the Cold Lands of Erdae.');
  assert.equal(text, 'The Path to Erdae leaves the Cold Lands of Aoaz.');
});

test('The exchange is idempotent on migrated text', () => {
  const once = exchange('Peoples of Erdae and the Path to Aoaz').text;
  assert.equal(exchange(once).text, once);
});

test('Negative: paths of the private originals keep their names', () => {
  const src = 'C:/Users/klimp/Documents/ZIN/World/Erdae/Maps/Colored/Erdae Full Colored Map.png and docs/reference/originals/Erdae.png, Erdae-working.jpg';
  assert.equal(exchange(src).text, src);
});

test('Negative: words that only contain the letters are untouched (Perdae, Dardan)', () => {
  const src = 'Perdae and the Battle of Dardan';
  assert.equal(exchange(src).text, src);
});

test('Paths are renamed component by component', () => {
  assert.equal(renamePath('docs/lore/vault/04 - Peoples/Peoples of Erdae.md'), 'docs/lore/vault/04 - Peoples/Peoples of Aoaz.md');
  assert.equal(renamePath('tools/content/data/geography/erdae.json'), 'tools/content/data/geography/aoaz.json');
  assert.equal(renamePath('docs/specs/PROGRAM.md'), 'docs/specs/PROGRAM.md');
});
