// Decision seals (lane I11, modules/decision_art.mjs): one seal per decision sprite, round alpha, 32 × 32 shipped DDS, and the
// texturefile rewrite that leaves every other decision sprite on its reason-listed texture.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  planDecisionSheets, decisionSheetJobs, cutSealSheet, roundCoverage, rewriteSealTextures, applyDecisionArt,
  sealSpriteName, sealTexture, SEAL_W, SEAL_H, SEAL_DIR, PER_SHEET,
} from './modules/decision_art.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const { subjects } = JSON.parse(readFileSync(path.join(here, 'data/decision_art_subjects.json'), 'utf8'));
const cells = JSON.parse(readFileSync(path.join(here, 'data/decision_art_cells.json'), 'utf8'));
const sha256 = b => createHash('sha256').update(b).digest('hex');

test('the subjects name every decision seal once, with a subject and no forbidden content', () => {
  const keys = subjects.map(s => s.key);
  assert.equal(new Set(keys).size, keys.length, 'seal keys are unique');
  assert.equal(new Set(keys.map(sealSpriteName)).size, keys.length, 'sprite names are unique');
  for (const s of subjects) {
    assert.ok(s.subject && s.subject.length > 10, `${s.key}: subject`);
    assert.ok(!/afrit|demon|devil|\bcross(es|ed)?\b|\bfaces?\b|firearm/i.test(s.subject), `${s.key}: forbidden word in subject`);
  }
});

test('the cell map names every seal exactly once, in sheets of at most 12 round seals on 4 columns', () => {
  const planned = planDecisionSheets(subjects);
  assert.equal(planned.length, Math.ceil(subjects.length / PER_SHEET));
  const all = planned.flatMap(s => s.keys);
  assert.equal(all.length, subjects.length);
  assert.equal(new Set(all).size, subjects.length, 'one seal per decision');
  for (const s of planned) {
    assert.ok(s.keys.length <= PER_SHEET && s.cols === 4 && s.rows === Math.ceil(s.keys.length / 4), s.sheet);
    assert.equal(s.method, 'round');
  }
  assert.deepEqual(cells.sheets.map(s => s.keys), planned.map(s => s.keys), 'the shipped cell map matches the plan');
});

test('every planned sheet has a job with the exact seal count and the round-seal grid check', () => {
  const map = new Map(subjects.map(s => [s.key, s.subject]));
  const jobs = decisionSheetJobs(planDecisionSheets(subjects).slice(0, 2), map, 'raw/decision');
  for (const j of jobs) {
    assert.equal(j.size, '1536x1024');
    assert.equal(j.check.expected, Number(j.prompt.match(/An asset sheet of (\d+) round seals/)[1]));
    assert.match(j.prompt, /round seals/);
    assert.match(j.prompt, /No demon/);
  }
  assert.throws(() => decisionSheetJobs([{ sheet: 'x', keys: ['nope'], cols: 4, rows: 1 }], map, 'raw'), /no subject for nope/);
});

test('the round coverage keeps the centre and drops the corners', () => {
  const cov = roundCoverage();
  assert.equal(cov.length, SEAL_W * SEAL_H);
  assert.equal(cov[0], 0, 'corner is transparent');
  assert.equal(cov[(SEAL_H - 1) * SEAL_W + SEAL_W - 1], 0, 'opposite corner is transparent');
  assert.equal(cov[(SEAL_H / 2) * SEAL_W + SEAL_W / 2], 1, 'centre is opaque');
});

test('rewriteSealTextures touches only accepted decision sprites', () => {
  const text = [
    'spriteTypes = {',
    '\tspriteType = {',
    '\t\tname = "GFX_decision_zin_alpha"',
    '\t\ttexturefile = "gfx/interface/ideas/zin/alpha.dds"',
    '\t}',
    '\tspriteType = {',
    '\t\tname = "GFX_decision_zin_beta"',
    '\t\ttexturefile = "gfx/interface/zin/unknown/technology.dds"',
    '\t}',
    '\tspriteType = {',
    '\t\tname = "GFX_decision_category_zin_alpha"',
    '\t\ttexturefile = "gfx/interface/ideas/zin/alpha.dds"',
    '\t}',
    '}',
  ].join('\n');
  const r = rewriteSealTextures(text, new Set(['alpha']));
  assert.deepEqual(r.keys, ['alpha']);
  assert.match(r.text, /name = "GFX_decision_zin_alpha"\n\t\ttexturefile = "gfx\/interface\/decisions\/zin\/alpha\.dds"/);
  assert.match(r.text, /GFX_decision_zin_beta"\n\t\ttexturefile = "gfx\/interface\/zin\/unknown\/technology\.dds"/, 'unaccepted sprite unchanged');
  assert.match(r.text, /GFX_decision_category_zin_alpha"\n\t\ttexturefile = "gfx\/interface\/ideas\/zin\/alpha\.dds"/, 'category untouched');
});

async function roundSheet(dir, n, cols, rows) {
  const W = 1536, H = 1024, cw = W / cols, ch = H / rows, r = Math.min(cw, ch) * 0.42;
  const circles = [];
  for (let i = 0; i < n; i++) {
    const cx = (i % cols + 0.5) * cw, cy = (Math.floor(i / cols) + 0.5) * ch;
    const hue = ['#b08a3e', '#7a1f1f', '#3d5a6b'][i % 3];
    circles.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${hue}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="#e6d7b0"/>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/>${circles.join('')}</svg>`;
  const file = path.join(dir, 'sheet.png');
  await writeFile(file, await sharp(Buffer.from(svg)).png().toBuffer());
  return file;
}

test('cutSealSheet returns one 32 × 32 round seal per region with transparent corners', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'i11-cut-'));
  const file = await roundSheet(dir, 12, 4, 3);
  const sheet = { sheet: 'decision-test', cols: 4, rows: 3, keys: Array.from({ length: 12 }, (_, i) => `k${i}`) };
  const pieces = await cutSealSheet(file, sheet);
  assert.equal(pieces.length, 12);
  for (const p of pieces) {
    assert.equal(p.buf.length, SEAL_W * SEAL_H * 4);
    const at = (x, y) => p.buf[(y * SEAL_W + x) * 4 + 3];
    assert.equal(at(0, 0), 0, `${p.key}: corner transparent`);
    assert.equal(at(SEAL_W - 1, SEAL_H - 1), 0, `${p.key}: far corner transparent`);
    assert.equal(at(SEAL_W >> 1, SEAL_H >> 1), 255, `${p.key}: centre opaque`);
  }
});

test('applyDecisionArt ships each accepted seal as a 32 × 32 DDS and lists every other decision sprite with a reason', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'i11-apply-'));
  const file = await roundSheet(dir, 12, 4, 3);
  const bytes = await readFile(file);
  const keys = Array.from({ length: 12 }, (_, i) => `k${i}`);
  const sheetCells = { sheets: [{ sheet: 'decision-01', method: 'round', cols: 4, rows: 3, keys, status: 'accepted' }] };
  const provenance = [{ id: 'review-decision-01', out: 'art/source/decision/decision-01.png', sha256: sha256(bytes), accepted: true, reviewer: 'agent' }];
  const gfx = [
    'spriteTypes = {',
    ...keys.slice(0, 11).flatMap(k => ['\tspriteType = {', `\t\tname = "GFX_decision_zin_${k}"`, '\t\ttexturefile = "gfx/interface/ideas/zin/x.dds"', '\t}']),
    '\tspriteType = {', '\t\tname = "GFX_decision_zin_unsealed"', '\t\ttexturefile = "gfx/interface/zin/unknown/technology.dds"', '\t}',
    '}',
  ].join('\n');
  const staged = { files: new Map([['interface/zin_test.gfx', Buffer.from(gfx, 'utf8')]]) };
  const warnings = [];
  const r = await applyDecisionArt(staged, { cells: sheetCells, provenance, raw: () => file, warn: m => warnings.push(m) });
  assert.equal(r.seals, 11, 'eleven accepted seals are cut (the twelfth is the unsealed sprite cell)');
  const out = staged.files.get('interface/zin_test.gfx').toString('utf8');
  const declared = [...out.matchAll(/name = "GFX_decision_zin_([A-Za-z0-9_]+)"\n\t\ttexturefile = "([^"]+)"/g)];
  for (const [, key, tex] of declared) {
    if (r.unsealed.includes(key)) { assert.ok(!tex.startsWith(SEAL_DIR), `${key} keeps its listed texture`); continue; }
    assert.equal(tex, sealTexture(key), `${key} points at its own seal`);
    assert.ok(tex.startsWith(`${SEAL_DIR}/`) && !/ideas|technology/.test(tex), `${key}: no idea or technology texture`);
    const dds = staged.files.get(tex);
    assert.ok(dds, `${key}: DDS staged`);
    assert.equal(dds.length, 128 + SEAL_W * SEAL_H * 4, `${key}: 32 × 32 A8R8G8B8 DDS`);
    assert.equal(dds.readUInt32LE(12), SEAL_H);
    assert.equal(dds.readUInt32LE(16), SEAL_W);
  }
  assert.deepEqual(r.unsealed, ['unsealed']);
  assert.ok(staged.files.has('art/source/decision_art_manifest.json'));
  assert.equal(warnings.length, 1, 'the twelfth accepted seal has no declared sprite in this fixture');
  assert.match(warnings[0], /1 accepted seals have no staged decision sprite \(k11\)/);
  assert.equal(sealSpriteName('k0'), 'GFX_decision_zin_k0');
});
