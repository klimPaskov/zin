// Achievement icons (lane I11, modules/achievement_art.mjs): the nine deep-past achievements each have a completed, grey and
// not-eligible 64 × 64 DDS whose hashes match the manifest, and the builder stages exactly those files.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { applyAchievementArt, frameSubject, buildTripletSources, dataAchievementIds, OVERLAY, MANIFEST, SOURCE_DIR, SIZE } from './modules/achievement_art.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const sha = b => createHash('sha256').update(b).digest('hex');
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));

test('the manifest names the nine deep-past achievements in three states each, and no other', () => {
  const ids = [...new Set(manifest.files.map(f => f.id))].sort();
  assert.deepEqual(ids, dataAchievementIds().sort());
  assert.equal(manifest.files.length, 27);
  for (const id of ids) {
    assert.deepEqual(manifest.files.filter(f => f.id === id).map(f => f.state).sort(), ['completed', 'grey', 'not_eligible']);
  }
  for (const f of manifest.files) {
    assert.equal(f.name, f.state === 'completed' ? f.id : f.state === 'grey' ? `${f.id}_grey` : `${f.id}_not_eligible`);
  }
});

test('every manifest DDS is a strict 64 × 64 DDS whose hash matches the file', () => {
  for (const f of manifest.files) {
    const bytes = readFileSync(path.join(SOURCE_DIR, f.file));
    assert.equal(sha(bytes), f.sha256, `${f.file}: hash`);
    assert.equal(bytes.toString('latin1', 0, 4), 'DDS ', `${f.file}: magic`);
    assert.equal(bytes.readUInt32LE(12), SIZE, `${f.file}: height`);
    assert.equal(bytes.readUInt32LE(16), SIZE, `${f.file}: width`);
    assert.equal(bytes.length, 128 + SIZE * SIZE * 4, `${f.file}: uncompressed BGRA body`);
  }
});

test('the builder stages the 27 achievement DDS under their engine names and skips a changed file with a warning', async () => {
  const staged = { files: new Map() };
  const warnings = [];
  const r = await applyAchievementArt(staged, { warn: m => warnings.push(m) });
  assert.equal(r.staged, 27);
  assert.equal(warnings.length, 0);
  for (const f of manifest.files) assert.ok(staged.files.has(`gfx/achievements/${f.name}.dds`), f.name);

  const dir = mkdtempSync(path.join(os.tmpdir(), 'i11-ach-'));
  const copy = path.join(dir, 'src');
  mkdirSync(copy);
  mkdirSync(path.join(copy, 'imagegen'), { recursive: true });
  for (const f of manifest.files) copyFileSync(path.join(SOURCE_DIR, f.file), path.join(copy, f.file));
  const changed = path.join(copy, manifest.files[0].file);
  const bytes = readFileSync(changed);
  bytes[200] ^= 0xff;
  writeFileSync(changed, bytes);
  const staged2 = { files: new Map() };
  const w2 = [];
  const r2 = await applyAchievementArt(staged2, { manifest: MANIFEST, sourceDir: copy, warn: m => w2.push(m) });
  assert.equal(r2.staged, 26);
  assert.equal(w2.length, 1);
  assert.match(w2[0], /changed since the manifest/);
  assert.ok(!staged2.files.has(`gfx/achievements/${manifest.files[0].name}.dds`));
});

test('the colour subject is framed on a transparent 64 × 64 canvas with its centre opaque and corners clear', async () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'i11-frame-'));
  const src = path.join(dir, 'subject.png');
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect x="100" y="20" width="80" height="150" fill="#c9a24a"/></svg>';
  await sharp(Buffer.from(svg)).png().toFile(src);
  const framed = await frameSubject(src);
  const { data, info } = await sharp(framed).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, SIZE);
  assert.equal(info.height, SIZE);
  const at = (x, y) => data[(y * SIZE + x) * 4 + 3];
  assert.equal(at(0, 0), 0);
  assert.equal(at(SIZE - 1, SIZE - 1), 0);
  assert.equal(at(SIZE >> 1, SIZE >> 1), 255);
});

test('the grey layer keeps alpha and the not-eligible layer is the grey layer with the unchanged overlay composited on it', async () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'i11-triplet-'));
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="20" fill="#b5462f"/></svg>';
  const colour = await sharp(Buffer.from(svg)).png().toBuffer();
  const hashes = await buildTripletSources(colour, 'zin_ach_fixture', dir);
  assert.equal(hashes.colour, sha(colour));
  const alphaOf = async f => (await sharp(path.join(dir, f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })).data.filter((_, i) => i % 4 === 3);
  const aColour = await alphaOf('zin_ach_fixture.png'), aGrey = await alphaOf('zin_ach_fixture_grey.png'), aNe = await alphaOf('zin_ach_fixture_not_eligible.png');
  assert.deepEqual(aGrey, aColour, 'grey keeps the colour alpha');
  // The supplied overlay is composited with normal alpha, so the not-eligible coverage is never less than the subject's.
  assert.ok(aNe.every((a, i) => a >= aColour[i]), 'not-eligible never loses subject coverage');
  assert.ok(readFileSync(OVERLAY.file).length > 0);
  assert.equal(sha(readFileSync(OVERLAY.file)).toUpperCase(), OVERLAY.sha256);
});
