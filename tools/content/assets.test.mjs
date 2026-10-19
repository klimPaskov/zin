// Tests of the asset manifest and the completeness check (docs/specs/08_art_and_assets/05_asset_manifest.md).
// They run on synthetic, project-owned trees (fixtures/assets/: committed text files, pictures generated from seeded
// noise by make.mjs) and on a stand-in for the installed game; nothing here reads the real game or the real mod.
//   node --test tools/content/assets.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Staged } from './lib/core.mjs';
import { makeMod, makeGame, put, TABLES, ddsOf, tgaOf, bytesOf, noiseCanvas, sha256, yml } from './fixtures/assets/make.mjs';
import { checkAssets, loadAssetContext, analyze, runChecks, baselineOf, newFindings, fixedFindings, summaryText } from './checks/assets.mjs';
import { buildManifest, canonicalJson, summarize, buildAssets, MANIFEST_FILE, SUMMARY_FILE } from './modules/assets.mjs';
import { ddsInfo, tgaInfo, pngInfo, imageInfo, isPowerOfTwo, decodeRgba } from './lib/dds_info.mjs';
import { perceptualHashes, hamming, phashDistance } from './lib/phash.mjs';
import { validateManifest, validateRecord } from './lib/asset_schema.mjs';
import { compileRules, classify, parseJsonl } from './lib/asset_sources.mjs';
import { mapView, makeView, scanShipped } from './lib/loaded_assets.mjs';
import { dds } from './lib/raster.mjs';
import { loadAssetData } from './checks/assets.mjs';

let template; const dirs = [];
before(async () => {
  template = fs.mkdtempSync(path.join(os.tmpdir(), 'zin-assets-template-'));
  await makeMod(path.join(template, 'mod'));
  makeGame(path.join(template, 'game'));
});
after(() => { for (const d of [template, ...dirs]) fs.rmSync(d, { recursive: true, force: true }); });

// A copy of the good tree and the game stand-in, mutated by `change`, then checked.
function run(change = () => {}, opts = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zin-assets-'));
  dirs.push(dir);
  const mod = path.join(dir, 'mod'), game = path.join(dir, 'game');
  fs.cpSync(path.join(template, 'mod'), mod, { recursive: true });
  fs.cpSync(path.join(template, 'game'), game, { recursive: true });
  const api = {
    mod, game,
    put: (rel, bytes) => put(mod, rel, bytes), putGame: (rel, bytes) => put(game, rel, bytes),
    rm: rel => fs.rmSync(path.join(mod, rel), { force: true }),
    edit: (rel, fn) => { const full = path.join(mod, rel); fs.writeFileSync(full, fn(fs.readFileSync(full, 'utf8'))); },
    read: rel => fs.readFileSync(path.join(mod, rel)),
  };
  change(api);
  const res = checkAssets({ root: mod, game: opts.noGame ? path.join(dir, 'missing-game') : game, tables: TABLES, cachePath: null, phase: opts.phase ?? 1 });
  return { ...res, ...api, dir };
}
const find = (r, code, pathPart = '') => r.report.findings.filter(f => f.code === code && f.path.includes(pathPart));
const errors = r => r.report.findings.filter(f => f.severity === 'error');

// ---------------------------------------------------------------------------------------------- positives
test('The good tree resolves every reference with no error', () => {
  const r = run();
  assert.deepEqual(errors(r).map(f => `${f.code} ${f.path}`), []);
  assert.equal(r.report.bySeverity.error, 0);
  assert(r.report.counts.references > 60, `references ${r.report.counts.references}`);
  assert.equal(r.report.counts.unresolved, 3, 'only the three flags of the dynamic tag are missing');
  assert.equal(r.report.counts.orphans, 0);
  assert.equal(r.report.counts.tags, 3);
  assert.equal(r.report.counts.sprites, 11);
});

test('A dynamic tag without a flag is a warning, not an error', () => {
  const r = run();
  const d = find(r, 'FLAG_MISSING', 'D01');
  assert.equal(d.length, 3);
  assert(d.every(f => f.severity === 'warning'));
});

test('The vanilla names, kept textures and the .lua effect alias resolve against the game', () => {
  const r = run();
  assert.equal(find(r, 'SPRITE_UNDEFINED').length, 0);
  assert.equal(find(r, 'SPRITE_EFFECT_MISSING').length, 0);
  assert.equal(find(r, 'VANILLA_TEXTURE').length, 0);
  assert(r.report.kept.vanillaFilesAndSprites.some(k => k.what === 'gfx/interface/goals/shine_overlay.dds'));
  assert(r.report.kept.vanillaFilesAndSprites.some(k => k.what === 'sprite:GFX_vanilla_icon'));
});

test('The manifest of the good tree validates, links provenance and is canonical', () => {
  const ctx = loadAssetContext({ root: path.join(template, 'mod'), game: path.join(template, 'game'), tables: TABLES, cachePath: null });
  const A = analyze(ctx), manifest = buildManifest(ctx, A);
  assert.deepEqual(validateManifest(manifest), []);
  const ids = manifest.records.map(r => r.id);
  assert.deepEqual(ids, [...ids].sort());
  for (const id of ['A1/test_a', 'E1/one', 'D7/men_male_1', 'I1/Y01', 'K/zin_test_unit']) assert(ids.includes(id), id);
  const flag = manifest.records.find(r => r.id === 'I1/Y01');
  assert.equal(flag.files.length, 3);
  assert.equal(flag.source.sheet, 'flags-sheet-01');
  assert.equal(flag.source.review.reviewer, 'agent');
  assert.equal(flag.kind, 'flag');
  assert.equal(flag.uniqueness_group, 'flag.large');
  const icon = manifest.records.find(r => r.id === 'A1/test_a');
  assert.deepEqual(icon.files.map(f => f.format), ['a8r8g8b8', 'a8r8g8b8']);
  assert.deepEqual(icon.sprites, ['GFX_focus_zin_test_a', 'GFX_focus_zin_test_a_shine', 'GFX_idea_zin_test_a']);
  assert.match(icon.perceptual.dhash, /^[0-9a-f]{16}$/);
  assert.equal(icon.source.manifest, 'art/source/test_manifest.json');
  assert.deepEqual(icon.source.ops, ['dds a8r8g8b8', 'fixture crop']);
  const unit = manifest.records.find(r => r.id === 'K/zin_test_unit');
  assert.equal(unit.source.route, 'meshy');
  assert.equal(unit.bound_by, 'entity');
  assert.equal(unit.files.length, 5);
  const text = canonicalJson(manifest);
  assert(text.endsWith('\n'));
  assert.equal(JSON.stringify(JSON.parse(text)), JSON.stringify(JSON.parse(canonicalJson(JSON.parse(text)))));
  const summary = summarize(manifest, text);
  assert.equal(summary.records, manifest.records.length);
  assert.equal(summary.manifestSha256, sha256(Buffer.from(text)));
  assert.equal(summary.byFamily.I1.files, 6);
});

test('Two builds of the same inputs give the same manifest bytes', () => {
  const make = () => { const ctx = loadAssetContext({ root: path.join(template, 'mod'), game: path.join(template, 'game'), tables: TABLES, cachePath: null }); return canonicalJson(buildManifest(ctx, analyze(ctx))); };
  assert.equal(make(), make());
});

test('buildAssets stages the manifest and its summary, and gates on the baseline', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zin-assets-build-'));
  dirs.push(dir);
  const mod = path.join(dir, 'mod');
  fs.cpSync(path.join(template, 'mod'), mod, { recursive: true });
  const common = { root: mod, game: path.join(template, 'game'), tables: TABLES, cachePath: null, baselineFile: path.join(dir, 'baseline.json'), log: () => {} };
  const staged = new Staged();
  const res = await buildAssets(staged, common);
  assert(staged.files.has(MANIFEST_FILE) && staged.files.has(SUMMARY_FILE));
  assert.deepEqual(res.fresh, []);
  assert.equal(JSON.parse(staged.files.get(SUMMARY_FILE)).records, JSON.parse(staged.files.get(MANIFEST_FILE)).records.length);
  // A staged file laid over the mod is part of the loaded set: an undefined sprite is a new error, so the build fails.
  const bad = new Staged();
  bad.text('interface/zin_bad.gui', 'guiTypes = { containerWindowType = { name = "w" iconType = { name = "i" spriteType = "GFX_nowhere" } } }');
  await assert.rejects(() => buildAssets(bad, common), /new errors not in the baseline/);
  // The same finding in the baseline is accepted, and a baseline rewrite records it.
  const again = new Staged();
  again.text('interface/zin_bad.gui', 'guiTypes = { containerWindowType = { name = "w" iconType = { name = "i" spriteType = "GFX_nowhere" } } }');
  const updated = await buildAssets(again, { ...common, update: true });
  assert(updated.updated);
  const accepted = new Staged();
  accepted.text('interface/zin_bad.gui', 'guiTypes = { containerWindowType = { name = "w" iconType = { name = "i" spriteType = "GFX_nowhere" } } }');
  const ok = await buildAssets(accepted, common);
  assert.deepEqual(ok.fresh, []);
  assert(ok.report.findings.some(f => f.code === 'SPRITE_UNDEFINED'));
});

test('Path rules classify shipped files into families', () => {
  const rules = compileRules(loadAssetData().families);
  const cls = rel => { const c = classify(rules, rel); return c && `${c.rule.family}/${c.rule.key.replace(/\$(\d)/g, (_, n) => c.m[Number(n)])}`; };
  assert.equal(cls('gfx/flags/medium/Y0A.tga'), 'I1/Y0A');
  assert.equal(cls('gfx/interface/goals/zin/crown_gold.dds'), 'A1/crown_gold');
  assert.equal(cls('gfx/interface/ideas/zin_people_sun_elves.dds'), 'A3/people_sun_elves');
  assert.equal(cls('gfx/event_pictures/zin/zin_news_war_king.dds'), 'E1/war_king');
  assert.equal(cls('gfx/leaders/zin/the_dead_female_2.dds'), 'D7/the_dead_female_2');
  assert.equal(cls('gfx/loadingscreens/load_7.dds'), 'F1/load_7');
  assert.equal(cls('gfx/models/units/zin/zin_men_infantry/zin_men_infantry.mesh'), 'K/zin_men_infantry');
  assert.equal(cls('gfx/cursors/brush.cur'), 'I3/brush');
  assert.equal(classify(rules, 'common/ideas/x.txt'), null);
});

// ------------------------------------------------------------------------------------------ libraries
test('DDS, TGA and PNG headers are read', () => {
  const d = ddsInfo(ddsOf(100, 88, 1));
  assert.deepEqual([d.format, d.width, d.height, d.mips], ['a8r8g8b8', 100, 88, 1]);
  const t = tgaInfo(tgaOf(82, 52, 2));
  assert.deepEqual([t.format, t.width, t.height], ['tga32', 82, 52]);
  const bc3 = Buffer.from(ddsOf(8, 8, 3));
  bc3.writeUInt32LE(0x4, 80); bc3.write('DXT5', 84, 'ascii');
  assert.equal(ddsInfo(bc3).format, 'bc3');
  assert.equal(ddsInfo(Buffer.from('not a dds')).valid, false);
  assert.equal(imageInfo(Buffer.alloc(40), 'png').valid, false);
  assert.equal(pngInfo(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 8, 0, 0, 0, 4, 8, 6])).height, 4);
  assert(isPowerOfTwo(1024) && !isPowerOfTwo(1000) && !isPowerOfTwo(0));
  const px = decodeRgba(ddsOf(8, 8, 3), 'dds');
  assert.equal(px.length, 8 * 8 * 4);
  assert.equal(decodeRgba(bc3, 'dds'), null);
});

test('Perceptual hashes: equal pictures match, different pictures differ, one changed pixel stays close', () => {
  const c1 = noiseCanvas(82, 52, 11), a = perceptualHashes(c1.rgba(), 82, 52);
  assert.deepEqual(perceptualHashes(noiseCanvas(82, 52, 11).rgba(), 82, 52), a);
  const b = perceptualHashes(noiseCanvas(82, 52, 12).rgba(), 82, 52);
  assert(phashDistance(a, b) >= 10, `distance ${phashDistance(a, b)}`);
  const near = noiseCanvas(82, 52, 11); near.px[0] = 0;
  assert(phashDistance(a, perceptualHashes(near.rgba(), 82, 52)) < 10);
  assert.equal(hamming('0000000000000000', 'ffffffffffffffff'), 64);
  assert.equal(hamming('00000000000000f0', '0000000000000000'), 4);
  assert.equal(perceptualHashes(Buffer.alloc(0), 0, 0), null);
});

test('The manifest schema rejects unknown fields, bad enums, duplicate ids and unsorted records', () => {
  const ctx = loadAssetContext({ root: path.join(template, 'mod'), game: path.join(template, 'game'), tables: TABLES, cachePath: null });
  const manifest = buildManifest(ctx, analyze(ctx)), rec = manifest.records[0];
  assert.deepEqual(validateRecord(rec), []);
  assert(validateRecord({ ...rec, extra: 1 }).some(p => p.includes('unknown field extra')));
  assert(validateRecord({ ...rec, kind: 'sticker' }).some(p => p.includes('kind sticker')));
  assert(validateRecord({ ...rec, state: 'finished' }).some(p => p.includes('state finished')));
  assert(validateRecord({ ...rec, files: [] }).some(p => p.includes('at least one file')));
  assert(validateRecord({ ...rec, files: [{ ...rec.files[0], sha256: 'abc' }] }).some(p => p.includes('64 hex')));
  assert(validateManifest({ records: [rec, rec] }).some(p => p.includes('duplicate id')));
  assert(validateManifest({ records: [manifest.records[1], manifest.records[0]] }).some(p => p.includes('not sorted')));
  assert(validateManifest({ records: [rec, { ...manifest.records[1], files: rec.files }] }).some(p => p.includes('listed by two records')));
  assert(validateManifest({}).length > 0);
});

test('The Clausewitz scan finds sprites, uses, entities and focuses', () => {
  const ctx = loadAssetContext({ root: path.join(template, 'mod'), game: path.join(template, 'game'), tables: TABLES, cachePath: null });
  const g = scanShipped(ctx.view, ctx.cfg);
  assert(g.sprites.has('GFX_focus_zin_test_a_shine'));
  assert.equal(g.sprites.get('GFX_focus_zin_test_a_shine')[0].textures.length, 3);
  assert.deepEqual(g.focuses.map(f => f.id), ['zin_test_one', 'zin_test_two', 'zin_test_three']);
  assert.deepEqual(g.focuses[1].prerequisites, ['zin_test_one']);
  assert.deepEqual(g.events.map(e => e.id), ['zin_test.1', 'zin_test.2']);
  assert.deepEqual(g.eventLinks.map(l => `${l.from}>${l.to}`), ['zin_test.1>zin_test.2']);
  assert(g.entities.has('zin_test_gfx_infantry_entity'));
  assert(g.spriteUses.some(u => u.name === 'GFX_idea_zin_test_a' && u.implicit));
  assert.equal(parseJsonl('{"a":1}\nnot json\n').errors.length, 1);
  const v = mapView(new Map([['a/b.txt', 'x']]));
  assert(v.has('a/b.txt') && !v.has('a/c.txt'));
  assert.throws(() => makeView([]).read('nope'));
});

// ----------------------------------------------------------------------------------------- negatives
test('Negative: a sprite no file defines is SPRITE_UNDEFINED', () => {
  const r = run(t => t.edit('interface/test.gui', s => s.replace('GFX_idea_zin_test_a', 'GFX_nowhere_at_all')));
  const f = find(r, 'SPRITE_UNDEFINED', 'interface/test.gui');
  assert.equal(f.length, 1); assert.equal(f[0].severity, 'error'); assert.match(f[0].message, /GFX_nowhere_at_all/);
});

test('Negative: a sprite whose texture file is missing is SPRITE_TEXTURE_MISSING', () => {
  const r = run(t => t.rm('gfx/event_pictures/zin/zin_evt_two.dds'));
  assert.equal(find(r, 'SPRITE_TEXTURE_MISSING', 'interface/test.gfx').length, 1);
  assert(r.report.counts.unresolved >= 1);
});

test('Negative: a frame count that does not divide the texture is SPRITE_FRAMES', () => {
  const r = run(t => t.edit('interface/test.gfx', s => s.replace('name = "GFX_focus_zin_test_a"\n\t\ttexturefile', 'name = "GFX_focus_zin_test_a"\n\t\tnoOfFrames = 3\n\t\ttexturefile')));
  assert.equal(find(r, 'SPRITE_FRAMES').length, 1);
});

test('Negative: an idea whose picture has no GFX_idea_ sprite is IMPLICIT_NAME_MISS', () => {
  const r = run(t => t.edit('common/ideas/test_ideas.txt', s => s.replace('zin_test_a', 'zin_test_missing')));
  const f = find(r, 'IMPLICIT_NAME_MISS');
  assert.equal(f.length, 1); assert.match(f[0].message, /GFX_idea_zin_test_missing/);
});

test('Negative: a focus icon without a _shine sprite is IMPLICIT_SHINE_MISSING', () => {
  const r = run(t => t.edit('interface/test.gfx', s => s.replace('"GFX_focus_zin_test_b_shine"', '"GFX_focus_zin_test_b_shiny"')));
  assert.equal(find(r, 'IMPLICIT_SHINE_MISSING').length, 1);
  assert.equal(find(r, 'IMPLICIT_SHINE_MISSING')[0].path, 'common/national_focus/test_tree.txt');
});

test('Negative: a focus that names a fallback sprite is FALLBACK_HIT', () => {
  const r = run(t => t.edit('common/national_focus/test_tree.txt', s => s.replace('GFX_focus_zin_test_c', 'GFX_goal_unknown')));
  assert.equal(find(r, 'FALLBACK_HIT').length, 1);
  const g = run(t => t.edit('common/national_focus/test_tree.txt', s => s.replace('cost = 5\n\t}\n\tfocus = {\n\t\tid = zin_test_two', 'cost = 5\n\t\tgfx_name_fallback = GFX_x\n\t}\n\tfocus = {\n\t\tid = zin_test_two')));
  assert(find(g, 'FALLBACK_HIT', 'test_tree.txt').some(f => f.message.includes('gfx_name_fallback')));
});

test('Negative: a catalog fallback key is a warning before phase 7 and an error from phase 7', () => {
  const change = t => t.edit('common/national_focus/test_tree.txt', s => s.replace('GFX_focus_zin_test_c', 'GFX_focus_zin_generic'));
  assert.equal(find(run(change), 'FALLBACK_KEY')[0].severity, 'warning');
  assert.equal(find(run(change, { phase: 7 }), 'FALLBACK_KEY')[0].severity, 'error');
});

test('Negative: a sprite defined twice is SPRITE_DUPLICATE', () => {
  const r = run(t => t.edit('interface/test.gfx', s => s.replace(/\}\s*$/, '\tspriteType = {\n\t\tname = "GFX_zin_evt_one"\n\t\ttexturefile = "gfx/event_pictures/zin/zin_evt_two.dds"\n\t}\n}\n')));
  assert.equal(find(r, 'SPRITE_DUPLICATE').length, 1);
});

test('Negative: a ZIN sprite that points at a vanilla texture off the kept list is VANILLA_TEXTURE', () => {
  const r = run(t => t.edit('interface/test.gfx', s => s.replace(/\}\s*$/, '\tspriteType = {\n\t\tname = "GFX_zin_borrowed"\n\t\ttexturefile = "gfx/interface/vanilla_icon.dds"\n\t}\n}\n')));
  assert.equal(find(r, 'VANILLA_TEXTURE')[0].severity, 'warning');
});

test('Negative: a shipped file nothing references is ORPHAN_ASSET', () => {
  const r = run(t => t.put('gfx/interface/ideas/zin/test_orphan.dds', ddsOf(64, 64, 50)));
  const f = find(r, 'ORPHAN_ASSET');
  assert.deepEqual(f.map(x => x.path), ['gfx/interface/ideas/zin/test_orphan.dds']);
  assert.equal(r.report.counts.orphans, 1);
});

test('Negative: a DDS of the wrong size is SIZE_MISMATCH', () => {
  const r = run(t => t.put('gfx/interface/goals/zin/test_c.dds', ddsOf(90, 88, 3)));
  const f = find(r, 'SIZE_MISMATCH', 'goals/zin/test_c.dds');
  assert.equal(f.length, 1); assert.match(f[0].message, /size 90x88, expected 100x88/);
  assert.equal(find(r, 'MANIFEST_STALE').length, 1);
});

test('Negative: a DDS in the wrong format or with extra mip levels is SIZE_MISMATCH', () => {
  const bc3 = Buffer.from(ddsOf(210, 176, 5));
  bc3.writeUInt32LE(0x4, 80); bc3.write('DXT5', 84, 'ascii');
  const r = run(t => t.put('gfx/event_pictures/zin/zin_evt_one.dds', bc3));
  assert.match(find(r, 'SIZE_MISMATCH', 'zin_evt_one')[0].message, /format bc3, expected a8r8g8b8/);
  const mips = Buffer.from(ddsOf(64, 64, 4));
  mips.writeUInt32LE(mips.readUInt32LE(8) | 0x20000, 8); mips.writeUInt32LE(7, 28);
  const m = run(t => t.put('gfx/interface/ideas/zin/test_a.dds', mips));
  assert.match(find(m, 'SIZE_MISMATCH', 'ideas/zin/test_a.dds')[0].message, /7 mip levels, expected 1/);
});

test('Negative: a texture the engine needs power-of-two is NPOT', () => {
  const r = run(t => t.put('gfx/models/units/zin/zin_test_unit/zin_test_unit_normal.dds', ddsOf(1000, 1024, 25)));
  assert.equal(find(r, 'NPOT', 'zin_test_unit_normal').length, 1);
});

test('Negative: an unreadable image is IMAGE_INVALID', () => {
  const r = run(t => t.put('gfx/interface/goals/zin/test_b.dds', bytesOf(300, 5)));
  assert.equal(find(r, 'IMAGE_INVALID', 'test_b.dds').length, 1);
});

test('Negative: one stem under two image extensions is EXT_TWIN', () => {
  const r = run(t => t.put('gfx/leaders/zin/men_male_1.tga', tgaOf(156, 210, 7)));
  assert.equal(find(r, 'EXT_TWIN').length, 1);
});

test('Negative: a sprite that names a .tga that exists only as .dds is EXT_ALIAS', () => {
  const r = run(t => t.edit('interface/test.gfx', s => s.replace('gfx/leaders/zin/men_male_2.dds', 'gfx/leaders/zin/men_male_2.tga')));
  assert.equal(find(r, 'EXT_ALIAS').length, 1);
});

test('Negative: a tag with a flag missing in one size is FLAG_MISSING (error for a real tag)', () => {
  const r = run(t => t.rm('gfx/flags/medium/Y02.tga'));
  const f = find(r, 'FLAG_MISSING', 'medium/Y02');
  assert.equal(f.length, 1); assert.equal(f[0].severity, 'error');
});

test('Negative: a flag for an undefined tag is FLAG_ORPHAN', () => {
  const r = run(t => t.put('gfx/flags/Y09.tga', tgaOf(82, 52, 77)));
  assert.equal(find(r, 'FLAG_ORPHAN', 'Y09').length, 1);
});

test('Negative: a flag of the wrong size is SIZE_MISMATCH', () => {
  const r = run(t => t.put('gfx/flags/small/Y01.tga', tgaOf(11, 7, 5)));
  assert.equal(find(r, 'SIZE_MISMATCH', 'small/Y01').length, 1);
});

test('Negative: two flags with the same bytes are UNIQ_EXACT_DUP', () => {
  const r = run(t => t.put('gfx/flags/Y02.tga', t.read('gfx/flags/Y01.tga')));
  const f = find(r, 'UNIQ_EXACT_DUP');
  assert.equal(f.length, 1); assert.equal(f[0].severity, 'error'); assert.match(f[0].message, /Y01\.tga/);
});

test('Negative: a duplicate small flag is only a warning (10x7 flags can coincide)', () => {
  const r = run(t => t.put('gfx/flags/small/Y02.tga', t.read('gfx/flags/small/Y01.tga')));
  assert.equal(find(r, 'UNIQ_EXACT_DUP')[0].severity, 'warning');
});

test('Negative: two flags that differ by one pixel are UNIQ_NEAR_DUPLICATE', () => {
  const near = Buffer.from(tgaOf(82, 52, 11)); near[18] ^= 0xff;
  const r = run(t => t.put('gfx/flags/Y02.tga', near));
  const f = find(r, 'UNIQ_NEAR_DUPLICATE');
  assert.equal(f.length, 1); assert.equal(f[0].severity, 'warning'); assert.equal(find(r, 'UNIQ_EXACT_DUP').length, 0);
});

test('Negative: the alias of the bookmark picture is not a duplicate, a stray copy is', () => {
  const same = ddsOf(180, 104, 61);
  const alias = run(t => { t.put('gfx/interface/bookmarks/zin_fourth_age.dds', same); t.put('gfx/interface/select_date_1936.dds', same); t.put('gfx/interface/select_date_1939.dds', same); });
  assert.equal(find(alias, 'UNIQ_EXACT_DUP').length, 0);
  const stray = run(t => { t.put('gfx/interface/bookmarks/zin_fourth_age.dds', same); t.put('gfx/interface/select_date_1936.dds', same); t.put('gfx/interface/bookmarks/zin_other.dds', same); });
  assert.equal(find(stray, 'UNIQ_EXACT_DUP').length, 1);
});

test('Negative: a source with no generation record is PROV_NO_GENERATION', () => {
  const r = run(t => t.edit('art/source/provenance.jsonl', s => s.split('\n').filter(l => !(l.includes('"one"') && l.includes('prompt'))).join('\n')));
  const f = find(r, 'PROV_NO_GENERATION');
  assert.equal(f.length, 1); assert.equal(f[0].path, 'art/source/events/one.png'); assert.match(f[0].message, /affects 1 shipped file/);
});

test('Negative: a source with no review line, or a rejecting last review, is PROV_UNREVIEWED', () => {
  const none = run(t => t.edit('art/source/provenance.jsonl', s => s.split('\n').filter(l => !(l.includes('"two"') && l.includes('reviewer'))).join('\n')));
  assert.equal(find(none, 'PROV_UNREVIEWED', 'events/two.png').length, 1);
  const rejected = run(t => t.edit('art/source/provenance.jsonl', s => `${s.trimEnd()}\n${JSON.stringify({ id: 'two', out: '../raw/events/two.png', sha256: sha256(fs.readFileSync(path.join(t.mod, 'art/source/events/two.png'))), accepted: false, reviewer: 'agent', kind: 'single', note: 'rejected later' })}\n`));
  assert.match(find(rejected, 'PROV_UNREVIEWED', 'events/two.png')[0].message, /rejects/);
});

test('Negative: a shipped picture that changed after its manifest line is MANIFEST_STALE', () => {
  const r = run(t => t.put('gfx/event_pictures/zin/zin_evt_one.dds', ddsOf(210, 176, 99)));
  assert.equal(find(r, 'MANIFEST_STALE', 'zin_evt_one').length, 1);
});

test('Negative: a picture with neither a manifest line nor a source rule is PROV_NO_MANIFEST_LINE', () => {
  const r = run(t => t.put('gfx/interface/ideas/zin/test_extra.dds', ddsOf(64, 64, 51)));
  assert.equal(find(r, 'PROV_NO_MANIFEST_LINE', 'test_extra').length, 1);
});

test('Negative: a generation that references a game or mod folder is PROV_REF_FOREIGN', () => {
  const r = run(t => t.edit('art/source/provenance.jsonl', s => s.replace('"references":[],"prompt":"synthetic test picture","sha256":"' + sha256(t.read('art/source/events/one.png')), '"references":["C:/Program Files (x86)/Steam/steamapps/common/Hearts of Iron IV/gfx/x.png"],"prompt":"synthetic test picture","sha256":"' + sha256(t.read('art/source/events/one.png')))));
  assert.equal(find(r, 'PROV_REF_FOREIGN').length, 1);
});

test('Negative: a generation that references a path outside art/source is PROV_REF_OUTSIDE; the art working directory is allowed', () => {
  const sha = t => sha256(t.read('art/source/events/one.png'));
  const swap = ref => t => t.edit('art/source/provenance.jsonl', s => s.replace(`"references":[],"prompt":"synthetic test picture","sha256":"${sha(t)}`, `"references":[${JSON.stringify(ref)}],"prompt":"synthetic test picture","sha256":"${sha(t)}`));
  assert.equal(find(run(swap('D:/somewhere/else.png')), 'PROV_REF_OUTSIDE').length, 1);
  assert.equal(find(run(swap('C:/work/.tmp/zin-art/raw/flags/x.png')), 'PROV_REF_OUTSIDE').length, 0);
});

test('Negative: a shipped file equal to an installed game file is VANILLA_COPY, under any name', () => {
  const stolen = run(t => t.put('gfx/interface/ideas/zin/stolen.dds', fs.readFileSync(path.join(t.game, 'gfx/interface/vanilla_icon.dds'))));
  const f = find(stolen, 'VANILLA_COPY', 'stolen.dds');
  assert.equal(f.length, 1); assert.match(f[0].message, /gfx\/interface\/vanilla_icon\.dds/);
  const samePath = run(t => t.put('gfx/interface/vanilla_icon.dds', fs.readFileSync(path.join(t.game, 'gfx/interface/vanilla_icon.dds'))));
  assert.equal(find(samePath, 'VANILLA_COPY', 'gfx/interface/vanilla_icon.dds').length, 1);
});

test('Negative: a file that replaces a vanilla path with another shape is REPLACE_SHAPE', () => {
  const r = run(t => t.put('gfx/interface/vanilla_icon.dds', ddsOf(32, 32, 62)));
  const f = find(r, 'REPLACE_SHAPE', 'vanilla_icon.dds');
  assert.equal(f.length, 1); assert.match(f[0].message, /size 32x32 vs 64x64/);
  assert.equal(find(r, 'VANILLA_COPY').length, 0);
});

test('Negative: a missing mesh, texture or animation file breaks the entity chain', () => {
  const model = 'gfx/models/units/zin/zin_test_unit';
  assert.equal(find(run(t => t.rm(`${model}/zin_test_unit.mesh`)), 'MESH_FILE_MISSING').length, 1);
  assert.equal(find(run(t => t.rm(`${model}/zin_test_unit_normal.dds`)), 'MESH_TEXTURE_MISSING').length, 1);
  assert.equal(find(run(t => t.rm(`${model}/zin_test_unit_move.anim`)), 'ANIMATION_FILE_MISSING').length, 1);
});

test('Negative: an animation type no entry defines is ANIMATION_UNDEFINED', () => {
  const r = run(t => t.edit('gfx/entities/zin_test_units.gfx', s => s.replace('zin_test_unit_move_animation', 'zin_test_unit_run_animation')));
  assert.equal(find(r, 'ANIMATION_UNDEFINED').length, 1);
});

test('Negative: an entity state that plays an animation its mesh lacks is STATE_ANIMATION_MISSING', () => {
  const r = run(t => t.edit('gfx/entities/zin_test_units.asset', s => s.replace('animation = "move"', 'animation = "run"')));
  assert.equal(find(r, 'STATE_ANIMATION_MISSING').length, 1);
});

test('Negative: an entity that names an unknown mesh or clone is flagged', () => {
  assert.equal(find(run(t => t.edit('gfx/entities/zin_test_units.asset', s => s.replace('pdxmesh = "zin_test_unit_mesh"', 'pdxmesh = "nothing_mesh"'))), 'ENTITY_MESH_UNDEFINED').length, 1);
  const clone = run(t => t.edit('gfx/entities/zin_test_units.asset', s => `${s}entity = { name = "zin_test_clone" clone = "NOPE_entity" }\n`));
  assert.equal(find(clone, 'ENTITY_CLONE_UNDEFINED').length, 1);
});

test('Negative: a graphical culture without its infantry entity is CULTURE_ENTITY_MISSING', () => {
  const r = run(t => t.edit('common/graphicalculturetype.txt', s => `${s}zin_lost_gfx\n`));
  assert.equal(find(r, 'CULTURE_ENTITY_MISSING').length, 1);
});

test('Negative: a sound effect no asset defines is SOUND_UNDEFINED', () => {
  const r = run(t => t.edit('gfx/entities/zin_test_units.asset', s => s.replace('infantry_move_animation', 'horn_that_does_not_exist')));
  assert.equal(find(r, 'SOUND_UNDEFINED').length, 1);
  assert.equal(find(run(t => t.edit('interface/test.gui', s => s.replace('click_default', 'click_missing'))), 'SOUND_UNDEFINED').length, 1);
});

test('Negative: a window font no bitmapfont defines is FONT_UNDEFINED', () => {
  const r = run(t => t.edit('interface/test.gui', s => s.replace('font = "hoi_18mbs"', 'font = "hoi_99"')));
  assert.equal(find(r, 'FONT_UNDEFINED').length, 1);
});

test('Negative: a window text key with no value is LOC_KEY_MISSING; a text icon with no sprite is TEXTICON_MISSING', () => {
  assert.equal(find(run(t => t.edit('interface/test.gui', s => s.replace('ZIN_TEST_TEXT', 'ZIN_NO_SUCH_KEY'))), 'LOC_KEY_MISSING').length, 1);
  const icon = run(t => t.put('localisation/english/zin_test_l_english.yml', yml([['ZIN_TEST_BUTTON', 'Open £zin_ghost_icon'], ['ZIN_TEST_TEXT', 'Text']])));
  assert.equal(find(icon, 'TEXTICON_MISSING').length, 1);
  assert.equal(find(run(t => t.put('localisation/english/zin_test_l_english.yml', yml([['ZIN_TEST_BUTTON', 'Open'], ['ZIN_TEST_TEXT', '']]))), 'LOC_EMPTY').length, 1);
});

test('Negative: a localisation file without a byte order mark is LOC_ENCODING', () => {
  const r = run(t => t.put('localisation/english/zin_test_l_english.yml', 'l_english:\n ZIN_TEST_BUTTON:0 "Open"\n ZIN_TEST_TEXT:0 "Text"\n'));
  assert.equal(find(r, 'LOC_ENCODING').length, 1);
});

test('Negative: a portrait of the wrong size is PORTRAIT_SIZE', () => {
  const r = run(t => t.put('gfx/leaders/zin/men_male_2.dds', ddsOf(100, 100, 8)));
  assert.equal(find(r, 'PORTRAIT_SIZE').length, 1);
});

test('Negative: a focus sharing an icon with its prerequisite, or one icon past the tree cap', () => {
  const pre = run(t => t.edit('common/national_focus/test_tree.txt', s => s.replace('GFX_focus_zin_test_b', 'GFX_focus_zin_test_a')));
  assert.equal(find(pre, 'UNIQ_ICON_PREREQUISITE').length, 1);
  const cap = run(t => t.edit('common/national_focus/test_tree.txt', s => s.replaceAll('GFX_focus_zin_test_b', 'GFX_focus_zin_test_a').replaceAll('GFX_focus_zin_test_c', 'GFX_focus_zin_test_a')));
  assert.equal(find(cap, 'UNIQ_ICON_TREE_CAP').length, 1);
  assert.equal(find(cap, 'UNIQ_ICON_TREE_CAP')[0].severity, 'error');
});

test('Negative: findings in interim and bridge files are warnings', () => {
  const r = run(t => { t.rm('common/national_focus/test_tree.txt'); t.put('common/national_focus/zz_zin_interim_tree.txt', 'focus_tree = { id = zin_interim focus = { id = a icon = GFX_focus_zin_test_a } focus = { id = b icon = GFX_focus_zin_test_a prerequisite = { focus = a } } focus = { id = c icon = GFX_focus_zin_test_a } }\n'); });
  const f = find(r, 'UNIQ_ICON_TREE_CAP');
  assert.equal(f.length, 1); assert.equal(f[0].severity, 'warning');
});

test('Negative: two events one step apart that share a picture are UNIQ_EVENT_CHAIN', () => {
  const r = run(t => t.edit('events/test_events.txt', s => s.replace('GFX_zin_evt_two', 'GFX_zin_evt_one')));
  assert.equal(find(r, 'UNIQ_EVENT_CHAIN').length, 1);
});

test('Negative: one generic portrait twice in a country, or past the pool cap', () => {
  const twice = run(t => t.edit('common/characters/test_chars.txt', s => s.replace(/\}\s*$/, '\tY01_second = {\n\t\tname = Y01_second\n\t\tportraits = { civilian = { large = GFX_zin_portrait_men_male_1 } }\n\t}\n}\n')));
  assert.equal(find(twice, 'UNIQ_PORTRAIT_COUNTRY').length, 1);
  const extra = [3, 4, 5, 6, 7].map(n => `\tY0${n}_x = {\n\t\tname = Y0${n}_x\n\t\tportraits = { civilian = { large = GFX_zin_portrait_men_male_1 } }\n\t}\n`).join('');
  const pool = run(t => t.edit('common/characters/test_chars.txt', s => s.replace(/\}\s*$/, `${extra}}\n`)));
  const f = find(pool, 'UNIQ_PORTRAIT_POOL');
  assert.equal(f.length, 1); assert.match(f[0].message, /GFX_zin_portrait_men_male_1 serves 6 characters/);
});

test('Negative: a default.map that names a missing file is MAP_FILE_MISSING', () => {
  const r = run(t => t.put('map/default.map', 'provinces = "provinces_that_do_not_exist.bmp"\n'));
  assert.equal(find(r, 'MAP_FILE_MISSING').length, 1);
});

test('Without the installed game, vanilla references are skipped and a warning says so', () => {
  const r = run(() => {}, { noGame: true });
  assert.equal(find(r, 'VANILLA_ABSENT').length, 1);
  assert.equal(find(r, 'SPRITE_UNDEFINED').length, 0);
  assert.equal(find(r, 'VANILLA_COPY').length, 0);
});

// ------------------------------------------------------------------------------------------ baseline
test('The baseline accepts known errors and fails only new ones', () => {
  const clean = run();
  assert.deepEqual(newFindings(clean.report, baselineOf(clean.report)), []);
  const broken = run(t => t.edit('interface/test.gui', s => s.replace('GFX_idea_zin_test_a', 'GFX_nowhere_at_all')));
  const fresh = newFindings(broken.report, baselineOf(clean.report));
  assert.deepEqual(fresh.map(f => f.code), ['SPRITE_UNDEFINED']);
  assert.deepEqual(newFindings(broken.report, baselineOf(broken.report)), []);
  assert.deepEqual(fixedFindings(clean.report, baselineOf(broken.report)).map(f => f.code), ['SPRITE_UNDEFINED']);
  assert.equal(newFindings(broken.report, null).length, 1);
  const base = baselineOf(broken.report);
  assert(base.findings.every(f => f.severity !== 'info'));
  assert.match(summaryText(broken.report), /1 errors/);
});

test('The report is deterministic and sorted by severity, code and path', () => {
  const a = run(t => t.edit('interface/test.gui', s => s.replace('GFX_idea_zin_test_a', 'GFX_nowhere_at_all'))), b = run(t => t.edit('interface/test.gui', s => s.replace('GFX_idea_zin_test_a', 'GFX_nowhere_at_all')));
  assert.equal(JSON.stringify(a.report), JSON.stringify(b.report));
  const order = ['error', 'warning', 'info'];
  const keys = a.report.findings.map(f => order.indexOf(f.severity));
  assert.deepEqual(keys, [...keys].sort((x, y) => x - y));
});
