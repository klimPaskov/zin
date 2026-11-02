// Decision seals (lane I11, modules/decision_art.mjs): one seal per decision sprite, round alpha, 32 × 32 shipped DDS, and the
// texturefile rewrite that leaves every other decision sprite on its reason-listed texture. Lane I12 adds the idea-art decisions: each
// decision icon that names a ZIN idea picture points at that picture's own seal (the tests at the end of this file).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  planDecisionSheets, decisionSheetJobs, cutSealSheet, roundCoverage, rewriteSealTextures, applyDecisionArt,
  sealSpriteName, sealTexture, SEAL_W, SEAL_H, SEAL_DIR, PER_SHEET,
  spriteTextures, ideaIconKey, rewriteIdeaIcons, applyIdeaSeals, readIdeaSeals, IDEA_GFX_FILE, ZIN_ROOT,
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
  const r = await applyDecisionArt(staged, { cells: sheetCells, provenance, raw: () => file, warn: m => warnings.push(m), ideaRows: [] });
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

// ------------------------------------------------------------------------------------------------ idea-art decisions (lane I12)
const TEX = new Map([
  ['GFX_idea_zin_envoy', 'gfx/interface/ideas/zin/envoy.dds'],
  ['GFX_decision_ledger_coins', 'gfx/interface/ideas/zin/ledger_coins.dds'],
  ['GFX_idea_zin_other', 'gfx/interface/ideas/zin/other.dds'],
  ['GFX_decision_zin_chain_broken', 'gfx/interface/decisions/zin/chain_broken.dds'],
]);

test('spriteTextures pairs each name with its own texturefile and ignores animation files', () => {
  const gfx = [
    'spriteTypes = {',
    '\tspriteType = {', '\t\tname = "GFX_a"', '\t\ttexturefile = "t1.dds"', '\t\tanimation = {', '\t\t\tanimationmaskfile = "m.dds"', '\t\t\tanimationtexturefile = "x.dds"', '\t\t}', '\t}',
    '\tspriteType = {', '\t\tname = "GFX_b"', '\t\ttexturefile = "t2.dds"', '\t}',
    '}',
  ].join('\n');
  const m = spriteTextures([gfx]);
  assert.equal(m.get('GFX_a'), 't1.dds');
  assert.equal(m.get('GFX_b'), 't2.dds');
  assert.equal(m.size, 2);
});

test('ideaIconKey takes a direct idea icon or a bare icon whose sprite is the ZIN idea picture, for keys in the table only', () => {
  const keys = new Set(['envoy', 'ledger_coins']);
  assert.equal(ideaIconKey('GFX_idea_zin_envoy', keys, TEX), 'envoy');
  assert.equal(ideaIconKey('ledger_coins', keys, TEX), 'ledger_coins');
  assert.equal(ideaIconKey('GFX_idea_zin_other', keys, TEX), null, 'not in the table');
  assert.equal(ideaIconKey('GFX_decision_zin_chain_broken', keys, TEX), null, 'a decision seal is not an idea icon');
  assert.equal(ideaIconKey('zin_afrit_granary', keys, TEX), null, 'a bare name with no ZIN idea sprite');
  const tex2 = new Map([...TEX, ['GFX_decision_wing_trials', 'gfx/interface/ideas/zin/envoy.dds']]);
  assert.equal(ideaIconKey('wing_trials', keys, tex2), 'envoy', 'a bare icon takes the key of the picture its sprite names');
});

test('rewriteIdeaIcons rewrites decision icon lines only, and leaves category icons and other pictures alone', () => {
  const text = [
    'zin_test = {',
    '\tzin_test_one = {',
    '\t\ticon = GFX_idea_zin_envoy',
    '\t\tallowed = {}',
    '\t}',
    '\tzin_test_two = {',
    '\t\ticon = ledger_coins',
    '\t}',
    '\tzin_test_three = {',
    '\t\ticon = GFX_idea_zin_other',
    '\t}',
    '}',
    '\ticon = GFX_idea_zin_envoy',
    '',
  ].join('\n');
  const r = rewriteIdeaIcons(text, new Set(['envoy', 'ledger_coins']), TEX);
  assert.deepEqual(r.keys, ['envoy', 'ledger_coins']);
  assert.ok(r.text.includes('\t\ticon = GFX_decision_zin_envoy\n'));
  assert.ok(r.text.includes('\t\ticon = GFX_decision_zin_ledger_coins\n'));
  assert.ok(r.text.includes('\t\ticon = GFX_idea_zin_other\n'), 'a picture outside the table keeps its icon');
  assert.ok(r.text.endsWith('\ticon = GFX_idea_zin_envoy\n'), 'a one-tab icon is a category icon and stays');
});

test('the seal table has one row per key, 56 keys, and every accepted row is a 32 × 32 processed picture with an accepting review line', () => {
  const rows = readIdeaSeals();
  const keys = rows.map(r => r.key);
  assert.equal(new Set(keys).size, keys.length, 'keys are unique');
  assert.equal(rows.length, 56, 'the 56 idea pictures used as decision icons');
  const prov = readFileSync(path.join(ZIN_ROOT, 'art', 'source', 'provenance.jsonl'), 'utf8').split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l));
  for (const r of rows) {
    assert.ok(r.subject && r.subject.length > 10, `${r.key}: subject`);
    assert.ok(['accepted', 'reused'].includes(r.status), `${r.key}: status`);
    if (r.status === 'reused') { assert.equal(r.sprite, sealSpriteName(r.key)); continue; }
    const bytes = readFileSync(path.join(ZIN_ROOT, r.source));
    assert.equal(sha256(bytes), r.sha256, `${r.key}: source bytes`);
    assert.ok(prov.some(l => l.sha256 === r.sha256 && l.reviewer && l.accepted === true), `${r.key}: accepting review line`);
    assert.ok(prov.some(l => l.sha256 === r.sha256 && typeof l.prompt === 'string'), `${r.key}: generation line`);
  }
});

test('applyIdeaSeals points each idea-art decision at its seal, ships the accepted DDS and declares only the seals in use', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'i12-idea-'));
  const png = await sharp({ create: { width: SEAL_W, height: SEAL_H, channels: 4, background: { r: 150, g: 40, b: 40, alpha: 255 } } }).png().toBuffer();
  await mkdir(path.join(root, 'art', 'source', 'decision', 'idea'), { recursive: true });
  await writeFile(path.join(root, 'art', 'source', 'decision', 'idea', 'envoy.png'), png);
  const rows = [
    { key: 'envoy', status: 'accepted', subject: 'a sealed letter with a ribbon and a small pouch of salt', source: 'art/source/decision/idea/envoy.png', sha256: sha256(png) },
    { key: 'chain_broken', status: 'reused', subject: 'a broken chain', sprite: 'GFX_decision_zin_chain_broken' },
    { key: 'other', status: 'accepted', subject: 'not used by any decision', source: 'art/source/decision/idea/other.png', sha256: 'x' },
  ];
  const provenance = [
    { id: 'gen-envoy', out: 'docs/assets/zin_decision_seals/processed_png/zin_envoy-v1-p1.png', sha256: sha256(png), prompt: 'fixture', accepted: true, reviewer: 'agent' },
    { id: 'review-envoy', out: 'art/source/decision/idea/envoy.png', sha256: sha256(png), accepted: true, reviewer: 'agent' },
  ];
  const gfxIdeas = 'spriteTypes = {\n\tspriteType = {\n\t\tname = "GFX_idea_zin_envoy"\n\t\ttexturefile = "gfx/interface/ideas/zin/envoy.dds"\n\t}\n\tspriteType = {\n\t\tname = "GFX_idea_zin_chain_broken"\n\t\ttexturefile = "gfx/interface/ideas/zin/chain_broken.dds"\n\t}\n\tspriteType = {\n\t\tname = "GFX_decision_zin_chain_broken"\n\t\ttexturefile = "gfx/interface/decisions/zin/chain_broken.dds"\n\t}\n}\n';
  const decisions = 'zin_test = {\n\tzin_test_send = {\n\t\ticon = GFX_idea_zin_envoy\n\t}\n\tzin_test_send_cheap = {\n\t\ticon = GFX_idea_zin_envoy\n\t}\n\tzin_test_break = {\n\t\ticon = GFX_idea_zin_chain_broken\n\t}\n}\n';
  const staged = { files: new Map([['interface/zin_ideas_test.gfx', Buffer.from(gfxIdeas)], ['common/decisions/zin_test.txt', Buffer.from(decisions)]]) };
  const warnings = [];
  const r = await applyIdeaSeals(staged, { rows, provenance, root, warn: m => warnings.push(m) });
  assert.equal(r.icons, 3);
  assert.equal(r.seals, 1);
  assert.equal(r.reused, 1);
  const text = staged.files.get('common/decisions/zin_test.txt').toString('utf8');
  assert.equal((text.match(/icon = GFX_decision_zin_envoy\n/g) ?? []).length, 2);
  assert.ok(text.includes('icon = GFX_decision_zin_chain_broken\n'));
  assert.ok(!text.includes('GFX_idea_zin'), 'no idea icon is left on a seal-table decision');
  const dds = staged.files.get(sealTexture('envoy'));
  assert.ok(dds, 'DDS staged');
  assert.equal(dds.length, 128 + SEAL_W * SEAL_H * 4);
  assert.equal(dds.readUInt32LE(12), SEAL_H);
  assert.equal(dds.readUInt32LE(16), SEAL_W);
  assert.ok(!staged.files.has(sealTexture('other')), 'an unused accepted row ships nothing');
  const gfx = staged.files.get(IDEA_GFX_FILE).toString('utf8');
  assert.match(gfx, /name = "GFX_decision_zin_envoy"\n\t\ttexturefile = "gfx\/interface\/decisions\/zin\/envoy\.dds"/);
  assert.ok(!gfx.includes('chain_broken'), 'a reused seal is declared by its I11 file, not here');
  assert.ok(staged.files.has('art/source/decision/idea/envoy.png'));
  assert.deepEqual(warnings, []);
});

test('applyIdeaSeals fails closed on an accepted picture without an accepting review line', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'i12-idea-bad-'));
  const png = await sharp({ create: { width: SEAL_W, height: SEAL_H, channels: 4, background: { r: 10, g: 90, b: 10, alpha: 255 } } }).png().toBuffer();
  await mkdir(path.join(root, 'art', 'source', 'decision', 'idea'), { recursive: true });
  await writeFile(path.join(root, 'art', 'source', 'decision', 'idea', 'envoy.png'), png);
  const rows = [{ key: 'envoy', status: 'accepted', subject: 'a sealed letter', source: 'art/source/decision/idea/envoy.png', sha256: sha256(png) }];
  const gfx = 'spriteTypes = {\n\tspriteType = {\n\t\tname = "GFX_idea_zin_envoy"\n\t\ttexturefile = "gfx/interface/ideas/zin/envoy.dds"\n\t}\n}\n';
  const decisions = 'zin_test = {\n\tzin_test_send = {\n\t\ticon = GFX_idea_zin_envoy\n\t}\n}\n';
  const staged = { files: new Map([['interface/zin_ideas_test.gfx', Buffer.from(gfx)], ['common/decisions/zin_test.txt', Buffer.from(decisions)]]) };
  await assert.rejects(applyIdeaSeals(staged, { rows, provenance: [], root }), /idea seal envoy: no review line/);
});
