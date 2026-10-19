// Tests for modules/presentation.mjs. The test builds its own staged tree in memory (twice, for determinism), so it
// needs only the accepted art (ZIN_ART or art/source/) and, for a few checks, the installed game.
//   node --test tools/content/presentation.test.mjs
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Staged } from './lib/core.mjs';
import { ART, GAME, ZIN, rawFile, provenanceFile } from './lib/paths.mjs';
import {
  buildPresentation, checkTips, tipString, acceptance, keyMatte, boxDownscale, isCp1252, forbiddenIn, loadCells,
  CELLS_COPY, TIPS_FILE, DECISIONS, MENU_KEYS, LOADING_COUNT, THUMB_DIR, CHROME, BOOKMARK, EMBLEM, SPRITE, FALLBACK_ICON, FALLBACK_PICTURE,
} from './modules/presentation.mjs';

let staged, result;
const quiet = { warn: () => {} };
before(async () => { staged = new Staged(); result = await buildPresentation(staged, quiet); });

const sha = b => createHash('sha256').update(b).digest('hex');
const ddsHead = b => ({ magic: b.toString('ascii', 0, 4), h: b.readUInt32LE(12), w: b.readUInt32LE(16), flags: b.readUInt32LE(8), mips: b.readUInt32LE(28), pf: b.readUInt32LE(80), bits: b.readUInt32LE(88), masks: [92, 96, 100, 104].map(o => b.readUInt32LE(o)) });
const files = () => [...staged.files.keys()];
const text = rel => staged.files.get(rel).toString('utf8');
const gfxFiles = () => files().filter(f => f.endsWith('.gfx'));
const sprites = rel => [...text(rel).matchAll(/\bname\s*=\s*"([^"]+)"/g)].map(m => m[1]);
const textures = rel => [...text(rel).matchAll(/\b(?:texturefile|animationmaskfile)\s*=\s*"([^"]+)"/gi)].map(m => m[1]);
const ymlValues = rel => { const s = staged.files.get(rel).toString('utf8').replace(/^﻿/, ''); return new Map([...s.matchAll(/^ ([A-Za-z0-9_.]+):0 "(.*)"$/gm)].map(m => [m[1], m[2]])); };

// Expected size of every DDS this module writes, by path.
function expectedSize(rel) {
  if (/^gfx\/loadingscreens\/(load_\d+|zin_menu_\w+)\.dds$/.test(rel)) return [1920, 1440];
  if (rel.startsWith(`${THUMB_DIR}/`)) return [192, 144];
  const chrome = CHROME.find(c => c.file === rel); if (chrome) return [chrome.w, chrome.h];
  if (rel === EMBLEM.file) return [448, 175];
  if (rel === BOOKMARK.file || /^gfx\/interface\/select_date_19(36|39)\.dds$/.test(rel)) return [180, 104];
  if (rel.startsWith('gfx/interface/goals/zin/')) return [100, 88];
  if (rel.startsWith('gfx/interface/ideas/zin/')) return [64, 64];
  if (/^gfx\/event_pictures\/zin\/zin_evt_/.test(rel)) return [210, 176];
  if (/^gfx\/event_pictures\/zin\/zin_news_/.test(rel)) return [397, 153];
  return null;
}

test('every DDS is uncompressed A8R8G8B8, top-left, no mipmaps, at its exact size', () => {
  const dds = files().filter(f => f.endsWith('.dds'));
  assert(dds.length > 400, `${dds.length} DDS files`);
  for (const rel of dds) {
    const size = expectedSize(rel); assert(size, `${rel}: unexpected DDS`);
    const b = staged.files.get(rel), h = ddsHead(b);
    assert.equal(h.magic, 'DDS ', rel);
    assert.deepEqual([h.w, h.h], size, rel);
    assert.equal(h.pf, 0x41, `${rel}: pixel format flags (RGB with alpha)`);
    assert.equal(h.bits, 32, rel);
    assert.deepEqual(h.masks, [0xff0000, 0xff00, 0xff, 0xff000000], `${rel}: A8R8G8B8 masks`);
    assert.equal(h.mips, 0, `${rel}: no mipmaps`);
    assert.equal(b.length, 128 + size[0] * size[1] * 4, rel);
  }
});

test('the loading folder holds exactly the 24 screens and the 3 menu backgrounds; thumbnails live outside it', () => {
  const inFolder = files().filter(f => f.startsWith('gfx/loadingscreens/')).sort();
  const want = [...Array.from({ length: LOADING_COUNT }, (_, i) => `gfx/loadingscreens/load_${i + 1}.dds`), ...MENU_KEYS.map(k => `gfx/loadingscreens/zin_menu_${k}.dds`)].sort();
  assert.deepEqual(inFolder, want);
  for (const name of [...Array.from({ length: LOADING_COUNT }, (_, i) => `load_${i + 1}`), ...MENU_KEYS.map(k => `zin_menu_${k}`)]) assert(staged.files.has(`${THUMB_DIR}/${name}_small.dds`), `${name} thumbnail`);
  assert(staged.files.has(`${THUMB_DIR}/zin_thumb_border.dds`));
  assert.equal(result.counts.loadingScreens, 24); assert.equal(result.counts.menuBackgrounds, 3);
});

test('thumbnails are the exact 10x box downscale of the shipped pictures', () => {
  for (const name of ['load_1', 'load_24', 'zin_menu_parim']) {
    const big = staged.files.get(`gfx/loadingscreens/${name}.dds`).subarray(128), small = staged.files.get(`${THUMB_DIR}/${name}_small.dds`).subarray(128);
    assert(boxDownscale(Buffer.from(big), 1920, 1440, 10).equals(small), name);
  }
});

test('the chrome uses the exact vanilla file names and case and has transparent faded ends', () => {
  for (const c of CHROME) assert(staged.files.has(c.file), c.file);
  assert(!files().some(f => f !== f.toLowerCase() && !CHROME.some(c => c.file === f)), 'only the chrome files have upper case');
  for (const c of CHROME) {
    const px = staged.files.get(c.file).subarray(128), a = (x, y) => px[(y * c.w + x) * 4 + 3], mid = c.h >> 1;
    assert(a(c.w >> 1, mid) > 200, `${c.file}: opaque centre`);
    assert(a(0, mid) < 40 && a(c.w - 1, mid) < 40, `${c.file}: transparent ends`);
  }
});

test('the frontend files point at ZIN pictures only', () => {
  const backgrounds = [...text('common/frontend/backgrounds/zin_backgrounds.txt').matchAll(/^(\w+) = \{/gm)].map(m => m[1]);
  assert.deepEqual(backgrounds, MENU_KEYS.map(k => `zin_menu_${k}`));
  const small = new Set(sprites('interface/small_background.gfx'));
  for (const k of backgrounds) { assert(staged.files.has(`gfx/loadingscreens/${k}.dds`), k); assert(small.has(`GFX_${k}_small`), `GFX_${k}_small`); }
  for (let n = 1; n <= LOADING_COUNT; n++) assert(small.has(`GFX_load_${n}_small`));
  assert(small.has('GFX_frontend_loading_screen_border_small'));
  for (const rel of ['interface/small_background.gfx', 'interface/frontendmainviewbg.gfx', 'interface/frontendmainviewbg_basic.gfx']) for (const t of textures(rel)) assert(/(zin_menu_|zin\/loadingscreens\/)/.test(t), `${rel}: ${t}`);
  assert.deepEqual(sprites('interface/frontendmainviewbg.gfx'), ['GFX_frontend_bg']);
  assert.deepEqual(sprites('interface/frontendmainviewbg_basic.gfx'), ['GFX_frontend_bg_basic', 'GFX_frontend_bg_basic_small']);
  assert(!files().some(f => f.endsWith('.gui')), 'no .gui override');
  assert.equal(result.bookmark.picture, BOOKMARK.sprite);
  assert(sprites('interface/zin_frontend.gfx').includes(BOOKMARK.sprite));
  for (const f of [BOOKMARK.file, 'gfx/interface/select_date_1936.dds', 'gfx/interface/select_date_1939.dds']) assert(staged.files.get(f).equals(staged.files.get(BOOKMARK.file)), f);
  assert(staged.files.has(EMBLEM.file));
});

test('every sprite texture exists, and sprite names are unique across this module and the repository', () => {
  const names = new Map();
  for (const rel of gfxFiles()) {
    for (const t of textures(rel)) {
      if (t === 'gfx/interface/goals/shine_overlay.dds') { if (existsSync(GAME)) assert(existsSync(`${GAME}/${t}`), t); continue; }
      assert(staged.files.has(t), `${rel}: ${t} is not staged`);
    }
    for (const n of sprites(rel)) { assert(!names.has(n), `${n} defined in ${names.get(n)} and ${rel}`); names.set(n, rel); }
  }
  // Sprites already in the mod's other .gfx files (people emblems, portraits, the Realm panel) must not collide.
  const dir = `${ZIN}/interface`;
  if (existsSync(dir)) for (const f of readdirSync(dir).filter(f => f.endsWith('.gfx') && !staged.files.has(`interface/${f}`))) {
    for (const m of readFileSync(`${dir}/${f}`, 'latin1').matchAll(/\bname\s*=\s*"?([A-Za-z0-9_]+)"?/g)) assert(!names.has(m[1]), `${m[1]} also in interface/${f}`);
  }
});

test('all 175 catalog keys have focus, shine and idea sprites, the fallback generic included', async () => {
  const { icons } = await loadCells(), keys = icons.flatMap(s => s.keys);
  assert.equal(keys.length, 175); assert.equal(new Set(keys).size, 175);
  assert(keys.includes(FALLBACK_ICON));
  const focus = new Set(sprites('interface/zin_catalog_focus_icons.gfx')), shine = new Set(sprites('interface/zin_catalog_focus_icons_shine.gfx')), idea = new Set(sprites('interface/zin_catalog_ideas.gfx'));
  for (const k of keys) {
    assert(focus.has(SPRITE.focus(k)), k); assert(shine.has(`${SPRITE.focus(k)}_shine`), k); assert(idea.has(SPRITE.idea(k)), k);
    assert(staged.files.has(`gfx/interface/goals/zin/${k}.dds`), k); assert(staged.files.has(`gfx/interface/ideas/zin/${k}.dds`), k);
  }
  assert.equal(focus.size, 175); assert.equal(result.counts.focusIcons, 175);
  // Focus icons: transparent corners, opaque medallion centre; idea icons opaque.
  for (const k of keys) {
    const f = staged.files.get(`gfx/interface/goals/zin/${k}.dds`).subarray(128), a = (x, y) => f[(y * 100 + x) * 4 + 3];
    assert(a(0, 0) === 0 && a(99, 87) === 0 && a(50, 44) === 255, `${k}: focus alpha`);
    const i = staged.files.get(`gfx/interface/ideas/zin/${k}.dds`).subarray(128);
    for (let p = 3; p < i.length; p += 4) assert.equal(i[p], 255, `${k}: idea alpha`);
  }
});

test('the 52 picture keys have event and news sprites per their crop', async () => {
  const { events } = await loadCells();
  assert.equal(events.length, 52); assert.equal(new Set(events.map(e => e.key)).size, 52);
  const s = new Set(sprites('interface/zin_event_pictures.gfx'));
  for (const e of events) {
    assert.equal(s.has(SPRITE.evt(e.key)), e.crop !== 'news', e.key);
    assert.equal(s.has(SPRITE.news(e.key)), e.crop !== 'standard', e.key);
  }
  assert(s.has(SPRITE.evt(FALLBACK_PICTURE)) && s.has(SPRITE.news(FALLBACK_PICTURE)));
  assert.equal(result.counts.eventPictures, 43); assert.equal(result.counts.newsPictures, 28);
});

test('the tracked cell copy matches the art working copies', async () => {
  const copy = JSON.parse(readFileSync(CELLS_COPY, 'utf8'));
  if (existsSync(`${ART}/jobs/icons-catalog-cells.json`)) assert.deepEqual(JSON.parse(readFileSync(`${ART}/jobs/icons-catalog-cells.json`, 'utf8')).map(c => ({ sheet: c.sheet, cols: c.cols, rows: c.rows, keys: c.keys })), copy.icons);
  if (existsSync(`${ART}/jobs/events-catalog-jobs.json`)) assert.deepEqual(JSON.parse(readFileSync(`${ART}/jobs/events-catalog-jobs.json`, 'utf8')).map(e => ({ key: e.keys[0], crop: e.crop })), copy.events.map(e => ({ key: e.key, crop: e.crop })));
});

test('loading tips: every key, in order, Windows-1252, no gated or modern words', () => {
  const rel = 'localisation/replace/zin_loading_tips_l_english.yml', b = staged.files.get(rel);
  assert.deepEqual([...b.subarray(0, 3)], [0xef, 0xbb, 0xbf], 'UTF-8 BOM');
  assert(b.toString('utf8').startsWith('﻿l_english:\n'));
  const v = ymlValues(rel), tips = JSON.parse(readFileSync(TIPS_FILE, 'utf8')).tips;
  assert.equal(v.size, 190);
  const vanillaFile = `${GAME}/localisation/english/loading_tips_l_english.yml`;
  if (existsSync(vanillaFile)) for (const m of readFileSync(vanillaFile, 'utf8').matchAll(/^\s*(LOADING_TIP_\d+):/gm)) assert(v.has(m[1]), `${m[1]} not replaced`);
  for (let i = 0; i < 190; i++) {
    const key = `LOADING_TIP_${i}`, value = v.get(key);
    assert.equal(value, tipString(tips[i]), key);
    assert(isCp1252(value), `${key}: Windows-1252`);
    assert.deepEqual(forbiddenIn(value.replace(/§[A-Z!]/g, '')), [], key);
    assert(i < 150 ? /\\n- \S/.test(value) : value.startsWith('§YCounsel:§! '), key);
  }
});

test('no gated name in any sprite, file name or text this module ships', () => {
  const gated = /afrit|eindil|hidden_?council|einendil|edvoid|man_from_the_ice/i;
  for (const rel of files()) assert(!gated.test(rel), rel);
  for (const rel of gfxFiles()) for (const n of sprites(rel)) assert(!gated.test(n), n);
  for (const rel of files().filter(f => /\.(gfx|txt|yml)$/.test(f))) { const t = text(rel); assert(isCp1252(t.replace(/^﻿/, '')), rel); if (!rel.endsWith('.yml')) assert(/^[\x09\x0a\x20-\x7e]*$/.test(t), `${rel}: ASCII`); }
});

test('every shipped image is in the manifest with an accepted, staged source', () => {
  const m = JSON.parse(text('art/source/presentation_manifest.json'));
  const byOut = new Map(m.files.map(f => [f.out, f]));
  const prov = text('art/source/provenance.jsonl').split('\n').filter(Boolean).map(l => JSON.parse(l));
  for (const rel of files().filter(f => f.endsWith('.dds'))) {
    const e = byOut.get(rel); assert(e, `${rel}: no manifest line`);
    assert.equal(e.sha256, sha(staged.files.get(rel)), rel);
    const src = staged.files.get(e.source); assert(src, `${rel}: source ${e.source} not staged`);
    assert.equal(sha(src), e.sourceSha256);
    assert(acceptance(prov, e.source.replace('art/source/', ''), src).ok, `${e.source}: not accepted`);
  }
  assert.deepEqual(m.decisions.map(d => d.source), ['art/source/loadingscreens/load_24.png']);
});

test('no vanilla pixels: no shipped file equals the installed file at the same path', { skip: !existsSync(GAME) && 'game not installed' }, () => {
  for (const rel of files().filter(f => f.endsWith('.dds'))) {
    const v = `${GAME}/${rel}`;
    if (existsSync(v)) assert(!readFileSync(v).equals(staged.files.get(rel)), rel);
  }
});

test('determinism: a second build gives identical bytes', async () => {
  const again = new Staged(); await buildPresentation(again, quiet);
  assert.deepEqual([...again.files.keys()].sort(), files().sort());
  for (const [rel, bytes] of staged.files) assert(again.files.get(rel).equals(bytes), rel);
});

// ---------------------------------------------------------------------------------------------- negative tests
test('negative: the tip check rejects gated names, gaps, bad characters and short lists', () => {
  const tips = JSON.parse(readFileSync(TIPS_FILE, 'utf8')).tips;
  assert.deepEqual(checkTips(tips), []);
  const planted = structuredClone(tips); planted[3].text = 'The Deliverer is Afrit in disguise.';
  assert(checkTips(planted).some(p => /Afrit/.test(p)));
  const eindil = structuredClone(tips); eindil[160].text = 'Eindil wakes in the ice.';
  assert(checkTips(eindil).some(p => /Eindil/.test(p)));
  const gap = structuredClone(tips); gap.splice(10, 1);
  assert(checkTips(gap).some(p => /out of order/.test(p)));
  const chars = structuredClone(tips); chars[0].text = 'Šodolôrō knows.';
  assert(checkTips(chars).some(p => /Windows-1252/.test(p)));
  const dollar = structuredClone(tips); dollar[1].text = 'Pay $NAME$ in gold.';
  assert(checkTips(dollar).some(p => /forbidden character/.test(p)));
  const modern = structuredClone(tips); modern[2].text = 'Every factory needs a rifle.';
  assert(checkTips(modern).some(p => /modern word/.test(p)));
  assert(checkTips(tips.slice(0, 100)).some(p => /fewer than/.test(p)));
  const kind = structuredClone(tips); kind[150].kind = 'quote';
  assert(checkTips(kind).some(p => /kind/.test(p)));
});

test('negative: acceptance needs a review line for the exact bytes; A5 covers only the reviewed load_24', () => {
  const bytes = Buffer.from('some image'), h = sha(bytes);
  assert.equal(acceptance([], 'x.png', bytes).ok, false);
  assert.equal(acceptance([{ id: 'x', sha256: h, accepted: true }], 'x.png', bytes).ok, false, 'a generation line is not a review');
  assert.equal(acceptance([{ id: 'x', sha256: h, accepted: true, reviewer: 'agent' }], 'x.png', bytes).ok, true);
  assert.equal(acceptance([{ id: 'x', sha256: h, accepted: true, reviewer: 'agent' }, { id: 'x', sha256: h, accepted: false, reviewer: 'owner' }], 'x.png', bytes).ok, false, 'the last review decides');
  assert.equal(acceptance([], 'loadingscreens/load_24.png', bytes).ok, false, 'A5 does not cover other bytes');
  assert.equal(DECISIONS['loadingscreens/load_24.png'].crop.width, 1400);
});

test('negative: an unaccepted source is not shipped and its keys fall back; an unaccepted fallback stops the build', async () => {
  const lines = readFileSync(provenanceFile(), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const shaOf = rel => sha(readFileSync(rawFile(rel)));
  const unreview = rels => { const s = new Set(rels.map(shaOf)); return lines.filter(l => !(l.reviewer && s.has(l.sha256))); };
  const s = new Staged(), warnings = [];
  const r = await buildPresentation(s, { warn: m => warnings.push(m), provenance: unreview(['loadingscreens/load_3.png', 'icons/icons-catalog-01.png', 'events/court_feast.png']) });
  assert.equal(r.counts.loadingScreens, 23);
  assert(!s.files.has('gfx/loadingscreens/load_3.dds') && !s.files.has(`${THUMB_DIR}/load_3_small.dds`) && !s.files.has('art/source/loadingscreens/load_3.png'));
  assert(!/GFX_load_3_small/.test(s.files.get('interface/small_background.gfx').toString()));
  assert(!s.files.has('gfx/interface/goals/zin/crown_gold.dds'));
  assert.match(s.files.get('interface/zin_catalog_focus_icons.gfx').toString(), /name = "GFX_focus_zin_crown_gold"\n\t\ttexturefile = "gfx\/interface\/goals\/zin\/generic\.dds"/);
  assert.match(s.files.get('interface/zin_event_pictures.gfx').toString(), /name = "GFX_zin_evt_court_feast"\n\t\ttexturefile = "gfx\/event_pictures\/zin\/zin_evt_generic_court\.dds"/);
  assert.equal(warnings.length, 3);
  await assert.rejects(buildPresentation(new Staged(), { warn: () => {}, provenance: unreview(['icons/icons-catalog-15.png']) }), /fallback icon generic has no accepted art/);
});

test('raster helpers: key matte and box downscale are exact', () => {
  const rgb = Buffer.from([255, 0, 255, 10, 200, 30, 250, 5, 250]);
  const k = keyMatte(rgb, 3, 1);
  assert.deepEqual([...k.subarray(0, 4)], [0, 0, 0, 0], 'key is transparent');
  assert.deepEqual([...k.subarray(4, 8)], [10, 200, 30, 255], 'far colour is opaque and unchanged');
  assert.equal(k[11], 0, 'near-key is transparent');
  const block = Buffer.alloc(2 * 2 * 4); block.set([0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255]);
  assert.deepEqual([...boxDownscale(block, 2, 2, 2)], [128, 128, 128, 255]);
  assert.throws(() => boxDownscale(block, 2, 2, 3));
});
