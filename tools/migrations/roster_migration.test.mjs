// Tests of the roster migration (roster_migration.mjs), its text-preserving JSON edits (json_edit.mjs) and the state assignment script.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseJsonPositions, applyEdits, removalRange } from './json_edit.mjs';
import { loadMap } from '../content/lib/map_features.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const run = script => JSON.parse(execFileSync(process.execPath, [path.join(here, script)], { encoding: 'utf8', maxBuffer: 1 << 26 }));

test('json_edit: a string replaced in place keeps every other byte of the file', () => {
  const text = '{\n  "a": ["Y01",  "x"],\n    "b": {"c": "Isengard"}\n}\n';
  const root = parseJsonPositions(text);
  const a = root.members[0].value.items[0], c = root.members[1].value.members[0].value;
  const out = applyEdits(text, [{ start: a.start, end: a.end, text: '"CLD"' }, { start: c.start, end: c.end, text: '"Melkgard"' }]);
  assert.equal(out, '{\n  "a": ["CLD",  "x"],\n    "b": {"c": "Melkgard"}\n}\n');
  assert.deepEqual(JSON.parse(out), { a: ['CLD', 'x'], b: { c: 'Melkgard' } });
});

test('json_edit: removing a list entry takes its separator with it, at the start, the middle and the end', () => {
  const text = '[1, 2, 3]';
  const items = parseJsonPositions(text).items;
  for (const [i, want] of [[0, '[2, 3]'], [1, '[1, 3]'], [2, '[1, 2]']]) {
    const r = removalRange(items, i);
    assert.equal(applyEdits(text, [{ ...r, text: '' }]), want);
  }
});

test('Negative: overlapping edits and broken JSON are refused', () => {
  assert.throws(() => applyEdits('abcdef', [{ start: 0, end: 3, text: '' }, { start: 2, end: 4, text: '' }]), /overlapping/);
  assert.throws(() => parseJsonPositions('{"a": [1, 2}'), /expected/);
});

test('The migration is applied: a dry run over the repository finds nothing left to change', () => {
  const r = run('roster_migration.mjs');
  assert.equal(r.mode, 'dry run');
  assert.equal(r.changes, 0, `the migration would still change ${r.files} files`);
  assert.equal(r.tagsMigrated, 0);
  assert.equal(r.namesMigrated, 0);
});

test('The state assignment is applied: a dry run writes the same file', () => {
  const r = run('roster_state_assignment.mjs');
  assert.equal(r.changed, false);
  assert.equal(r.counts.states, loadMap().states.filter(s => s.owner).length);
  assert.equal(r.counts.landless, 0);
});
