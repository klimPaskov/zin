// Tests for the interface reskin infrastructure (spec docs/specs/07_interface/02_full_ui_reskin.md): the image codec and
// writers, the fits, the vanilla inventory, the disposition plan, the reskin builder and the nine builder checks.
// Everything runs on a synthetic project-owned game folder generated into a temporary directory; no vanilla file,
// pixel or text is used. The real committed tables are validated against each other, and against the installed game
// only when it exists (the freshness test).
//   node --test tools/content/ui_reskin.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

import { Canvas, dds, tga, png, cur, ico, ani, fromRaw } from './lib/raster.mjs';
import { readHeader, decodeRgba, measure, perceptualHash, hashDistance, luminanceClass, LUMA } from './lib/image_codec.mjs';
import { runFit, makeImg, crop, resize, applyAlpha, outlineOf, FitError, boxDownscale as fitBox, keyMatte as fitKey, strip as fitStrip, transformImg } from './lib/fit.mjs';
import { boxDownscale as presBox, keyMatte as presKey } from './modules/presentation.mjs';
import { Staged } from './lib/core.mjs';
import { buildInventory, serializeInventory, verifyInventory, parseGfx, parseGuiRefs, loadInventory, INVENTORY_FILE, readText, gameRoots } from './modules/ui_inventory.mjs';
import { planReskin, validateReskin, buildReskin, readSheetCells, loadReskin, loadSheets, vanillaOutline, summarize, publishUiData, RESKIN_FILE, SHEETS_DIR, MANIFEST_FILE } from './modules/ui_reskin.mjs';
import { windowState, guiState, framesOf, alphaPolicy, DISPOSITIONS, OVERRIDE_FILES } from './lib/ui_plan.mjs';
import { FIXED_SHEETS, validateSheet, layoutCheck, PREAMBLES } from './lib/ui_sheets.mjs';
import { sheetPrompt, sheetJob, reskinJobs } from './art/ui-reskin-jobs.mjs';
import {
  checkInventoryFreshness, checkCoverage, checkShape, checkReachability, checkNoVanillaPixels, checkProvenance, checkLuminance, checkOverrides,
  checkDeterminism, runUiChecks, scriptReferences, elementNames, PHASH_THRESHOLD,
} from './checks/ui_checks.mjs';
import { GAME } from './lib/paths.mjs';

const sha256 = b => createHash('sha256').update(b).digest('hex');
const SIX = [30, 22, 16, 255], MID = [140, 100, 60, 255], LIGHT = [230, 215, 180, 255];
const fill = (w, h, c) => new Canvas(w, h, c);

// ---------------------------------------------------------------------------------------------------- fixtures
let root, game, inventory, plan;
const write = (rel, bytes) => { const f = path.join(game, rel); mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, bytes); };

function gradient(w, h) { const c = new Canvas(w, h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) c.rect(x, y, x + 1, y + 1, [30 + x * 6, 40 + y * 5, 80, 255]); return c; }
function shapedIcon(w, h, color) { const c = new Canvas(w, h); c.ellipse(w / 2, h / 2, w / 2 - 1, h / 2 - 1, color); return c; }

before(async () => {
  root = mkdtempSync(path.join(os.tmpdir(), 'zin-ui-test-'));
  game = path.join(root, 'game').split(path.sep).join('/');
  write('launcher-settings.json', JSON.stringify({ rawVersion: '9.9.9.0', version: 'Test 9.9.9.0 (1)' }));
  write('interface/test.gfx', `spriteTypes = {
	corneredTileSpriteType = { name = "GFX_tiled_test" size = { x = 64 y = 64 } textureFile = "gfx//interface//tiles//tiled_test.dds" borderSize = { x = 8 y = 8 } tilingCenter = yes }
	spriteType = { name = "GFX_button_test" texturefile = "gfx/interface/button_test.dds" noOfFrames = 3 effectFile = "gfx/FX/buttonstate.lua" }
	spriteType = { name = "GFX_icon_test" texturefile = "gfx/interface/icon_test.dds" }
	SpriteType = { name = "GFX_icon_test_shine" texturefile = "gfx/interface/icon_test.dds"
		animation = { animationmaskfile = "gfx/interface/icon_test.dds" animationtexturefile = "gfx/interface/goals/shine_overlay.dds" animationrotation = 90.0 } }
	progressbartype = { name = "GFX_bar_test" textureFile1 = "gfx/interface/bar_fill.dds" textureFile2 = "gfx/interface/bar_bg.dds" size = { x = 40 y = 8 } }
	spriteType = { name = "GFX_focus_test" texturefile = "gfx/interface/goals/focus_test.dds" }
	spriteType = { name = "GFX_goal_unknown" texturefile = "gfx/interface/goals/goal_unknown.dds" }
	spriteType = { name = "GFX_missing_test" texturefile = "gfx/interface/nothing_here.dds" }
	spriteType = { name = "GFX_odd_frames" texturefile = "gfx/interface/odd_frames.dds" noOfFrames = 2 }
	spriteType = { name = "GFX_tga_test" texturefile = "gfx/interface/tga_test.tga" }
	spriteType = { name = "GFX_sub_test" texturefile = "gfx/interface/sub_test.tga" }
	spriteType = { name = "GFX_dup_test" texturefile = "gfx/interface/dup_first.dds" }
	spriteType = { name = "GFX_cafeé" texturefile = "gfx/interface/cafe.dds" }
	spriteType = { name = "GFX_GER_content" texturefile = "gfx/interface/ger_content.dds" }
	spriteType = { name = "GFX_frontend_bg" texturefile = "gfx/loadingscreens/load_5.dds" }
	spriteType = { name = "GFX_flag_overlay_test" texturefile = "gfx/interface/flag_overlay_test.dds" }
	spriteType = { name = "GFX_grad_test" texturefile = "gfx/interface/grad_test.dds" }
	textSpriteType = { name = "GFX_text_test" texturefile = "gfx/interface/button_test.dds" }
	pieChartType = { name = "GFX_pie_test" size = { x = 10 y = 10 } }
}
`);
  write('interface/zz_dup.gfx', 'spriteTypes = {\n\tspriteType = { name = "GFX_dup_test" texturefile = "gfx/interface/dup_second.dds" }\n}\n');
  write('interface/frontendmainviewbg.gfx', 'spriteTypes = {\n\tspriteType = { name = "GFX_frontend_bg_test" texturefile = "gfx/loadingscreens/load_5.dds" }\n}\n');
  write('interface/test.gui', `guiTypes = {
	containerWindowType = { name = "main_window" background = { name = "bg" spriteType = "GFX_tiled_test" }
		buttonType = { name = "ok" quadTextureSprite = "gfx_button_test" text = "GFX_focus_test" }
		iconType = { name = "i" spriteType = "GFX_icon_test" } }
	containerWindowType = { name = "second_window" iconType = { name = "j" spriteType = "GFX_bar_test" } }
}
`);
  write('interface/ger_scripted_gui.gui', 'guiTypes = {\n\tcontainerWindowType = { name = "ger_window" iconType = { name = "g" spriteType = "GFX_GER_content" } iconType = { name = "h" spriteType = "GFX_focus_test" } }\n}\n');
  write('interface/frontendmainview.gui', 'guiTypes = {\n\tcontainerWindowType = { name = "frontend_background" }\n\tcontainerWindowType = { name = "mainmenu_dlc_ownership" iconType = { name = "dlc" } }\n}\n');
  write('gfx/interface/tiles/tiled_test.dds', dds(fill(64, 64, SIX)));
  write('gfx/interface/button_test.dds', dds(fill(90, 30, MID)));
  write('gfx/interface/icon_test.dds', dds(shapedIcon(16, 16, LIGHT)));
  write('gfx/interface/bar_fill.dds', dds(fill(40, 8, MID)));
  write('gfx/interface/bar_bg.dds', dds(fill(40, 8, SIX)));
  write('gfx/interface/goals/focus_test.dds', dds(fill(20, 20, MID)));
  write('gfx/interface/goals/goal_unknown.dds', dds(fill(20, 20, SIX)));
  write('gfx/interface/goals/shine_overlay.dds', dds(fill(8, 8, LIGHT)));
  write('gfx/interface/odd_frames.dds', dds(fill(71, 20, MID)));
  write('gfx/interface/tga_test.tga', tga(fill(12, 12, MID), { origin: 'top' }));
  write('gfx/interface/sub_test.dds', dds(fill(12, 12, SIX)));
  write('gfx/interface/dup_first.dds', dds(fill(8, 8, SIX)));
  write('gfx/interface/dup_second.dds', dds(fill(9, 9, SIX)));
  write('gfx/interface/cafe.dds', dds(fill(10, 10, SIX)));
  write('gfx/interface/ger_content.dds', dds(fill(10, 10, MID)));
  write('gfx/interface/flag_overlay_test.dds', dds(shapedIcon(24, 16, SIX)));
  write('gfx/interface/grad_test.dds', dds(gradient(32, 32)));
  write('gfx/interface/orphan_test.dds', dds(fill(10, 10, SIX)));
  write('gfx/loadingscreens/load_5.dds', dds(fill(32, 24, SIX)));
  write('gfx/cursors/pointer.cur', cur(fill(32, 32, MID), { hotspot: [5, 7] }));
  write('gfx/cursors/pointer.png', png(fill(32, 32, MID)));
  write('gfx/cursors/busy.ani', ani([fill(32, 32, MID), fill(32, 32, SIX)], { hotspot: [16, 16] }));
  write('gfx/minimap/minimap.dds', dds(fill(40, 20, MID)));
  write('dlc/dlc001_test/interface/dlc.gfx', 'spriteTypes = {\n\tspriteType = { name = "GFX_dlc_test" texturefile = "gfx/interface/dlc_pic.dds" }\n}\n');
  write('dlc/dlc001_test/gfx/interface/dlc_pic.dds', dds(fill(6, 6, MID)));
  inventory = JSON.parse(serializeInventory(await buildInventory({ game })));   // through the file format
  plan = planReskin(inventory, { alertFrames: undefined });
});
after(() => { if (root) rmSync(root, { recursive: true, force: true }); });

// ---------------------------------------------------------------------------------------------------- codec and writers
test('the writers produce files the header readers understand, with the right origin and hotspot', () => {
  const c = fill(32, 32, MID);
  assert.deepEqual(readHeader(dds(c), 'dds').format, 'a8r8g8b8');
  assert.equal(readHeader(tga(c), 'tga').topOrigin, false, 'default TGA origin is bottom-left');
  assert.equal(readHeader(tga(c, { origin: 'top' }), 'tga').topOrigin, true);
  assert.throws(() => tga(c, { origin: 'left' }), /origin/);
  const p = readHeader(png(c), 'png'); assert.equal(p.width, 32); assert.equal(p.colorType, 6); assert.equal(p.interlaced, false);
  const k = readHeader(cur(c, { hotspot: [3, 4] }), 'cur'); assert.deepEqual(k.hotspot, [3, 4]); assert.equal(k.payload ?? k.entries[0].payload, 'dib');
  assert.equal(readHeader(ico(c), 'ico').hotspot, null);
  const a = readHeader(ani([c, c, c], { hotspot: [1, 2], jifRate: 4 }), 'ani'); assert.equal(a.frames, 3); assert.equal(a.jifRate, 4); assert.deepEqual(a.hotspot, [1, 2]);
});

test('negative: cursor and animation writers refuse bad input', () => {
  const c = fill(32, 32, MID);
  assert.throws(() => cur(c, { hotspot: [40, 0] }), /outside/);
  assert.throws(() => cur(c, { hotspot: [-1, 0] }), /hotspot/);
  assert.throws(() => ani([]), /at least one/);
  assert.throws(() => ani([c, fill(16, 16, MID)]), /same size/);
  assert.throws(() => ani([c], { sequence: [3] }), /frame that does not exist/);
  assert.throws(() => cur(fill(300, 300, MID)), /256/);
  assert.equal(readHeader(Buffer.from('nope'), 'dds').valid, false);
  assert.equal(readHeader(Buffer.from('nope'), 'png').valid, false);
  assert.equal(readHeader(Buffer.from('nope'), 'ani').valid, false);
});

test('PNG, TGA and DDS round trip through the decoder', async () => {
  const c = shapedIcon(20, 12, [200, 50, 10, 255]);
  const want = c.rgba();
  for (const [ext, bytes] of [['dds', dds(c)], ['tga', tga(c)], ['tga', tga(c, { origin: 'top' })], ['png', png(c)]]) {
    const px = await decodeRgba(bytes, ext);
    assert.equal(px.width, 20, ext); assert.deepEqual([...px.data], [...want], `${ext} pixels survive`);
  }
  assert.equal(await decodeRgba(Buffer.alloc(10), 'dds'), null);
});

test('DXT1, DXT3 and DXT5 blocks decode', async () => {
  const head = (fourcc, size) => { const b = Buffer.from(dds(fill(4, 4, MID)).subarray(0, 128)); b.writeUInt32LE(0x4, 80); b.write(fourcc, 84, 'ascii'); b.writeUInt32LE(0, 88); b.writeUInt32LE(0, 92); b.writeUInt32LE(0, 96); b.writeUInt32LE(0, 100); b.writeUInt32LE(0, 104); b.writeUInt32LE(size, 20); return b; };
  const colour = Buffer.alloc(8); colour.writeUInt16LE(0xf800, 0); colour.writeUInt16LE(0x001f, 2);           // red, blue; indices 0 = red
  const d1 = await decodeRgba(Buffer.concat([head('DXT1', 8), colour]), 'dds');
  assert.deepEqual([...d1.data.subarray(0, 4)], [255, 0, 0, 255], 'DXT1 red');
  const alpha3 = Buffer.alloc(8, 0xff);                                                                    // alpha 15 -> 255
  const d3 = await decodeRgba(Buffer.concat([head('DXT3', 16), alpha3, colour]), 'dds');
  assert.deepEqual([...d3.data.subarray(0, 4)], [255, 0, 0, 255], 'DXT3 opaque red');
  const alpha5 = Buffer.alloc(8); alpha5[0] = 128; alpha5[1] = 128;                                          // both endpoints 128, indices 0
  const d5 = await decodeRgba(Buffer.concat([head('DXT5', 16), alpha5, colour]), 'dds');
  assert.equal(d5.data[3], 128, 'DXT5 alpha 128');
  // DXT1 punch-through: c0 <= c1 makes index 3 transparent.
  const punch = Buffer.alloc(8); punch.writeUInt16LE(0x001f, 0); punch.writeUInt16LE(0xf800, 2); punch.writeUInt32LE(0xffffffff, 4);
  const dp = await decodeRgba(Buffer.concat([head('DXT1', 8), punch]), 'dds');
  assert.equal(dp.data[3], 0, 'DXT1 punch-through is transparent');
});

test('measurements: luminance class, alpha kinds and coverage', () => {
  assert.equal(luminanceClass(10), 'dark'); assert.equal(luminanceClass(LUMA.dark), 'mid'); assert.equal(luminanceClass(LUMA.light), 'light'); assert.equal(luminanceClass(null), 'none');
  const m = c => measure(c.rgba(), c.w, c.h);
  assert.equal(m(fill(8, 8, SIX)).luminance, 'dark'); assert.equal(m(fill(8, 8, MID)).luminance, 'mid'); assert.equal(m(fill(8, 8, LIGHT)).luminance, 'light');
  assert.equal(m(fill(8, 8, SIX)).alpha, 'opaque');
  assert.equal(m(fill(8, 8, [0, 0, 0, 0])).alpha, 'empty');
  assert.equal(m(fill(8, 8, [10, 10, 10, 79])).alpha, 'uniform:79');
  assert.equal(m(shapedIcon(16, 16, MID)).alpha, 'shaped');
  const keyed = new Canvas(8, 8); keyed.rect(0, 0, 4, 8, MID); assert.equal(m(keyed).alpha, 'keyed');
  assert.ok(m(shapedIcon(16, 16, MID)).coverage > 0.6 && m(shapedIcon(16, 16, MID)).coverage < 0.9);
  // The mean is alpha weighted: a transparent margin does not darken a light icon.
  assert.equal(m(shapedIcon(16, 16, LIGHT)).luminance, 'light');
});

test('perceptual hashes: identical pictures match, different ones differ, the distance is symmetric', () => {
  const grad = (w, h, flip) => { const c = new Canvas(w, h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) c.rect(x, y, x + 1, y + 1, [(flip ? w - x : x) * 255 / w, 90, 40, 255]); return c; };
  const a = grad(64, 64, false), b = grad(64, 64, true);
  const ha = perceptualHash(a.rgba(), 64, 64), hb = perceptualHash(b.rgba(), 64, 64);
  assert.equal(hashDistance(ha, ha), 0); assert.ok(hashDistance(ha, hb) > PHASH_THRESHOLD, `distance ${hashDistance(ha, hb)}`);
  assert.equal(hashDistance(ha, hb), hashDistance(hb, ha)); assert.match(ha.dhash, /^[0-9a-f]{16}$/);
});

// ---------------------------------------------------------------------------------------------------- fits
const solid = (w, h, c) => makeImg(w, h, Buffer.from(fill(w, h, c).rgba()));
const px = (img, x, y) => [...img.data.subarray((y * img.w + x) * 4, (y * img.w + x) * 4 + 4)];
const near = (a, b, tol = 6) => a.every((v, i) => Math.abs(v - b[i]) <= tol);

test('moved helpers behave as before: presentation re-exports the fit module versions', () => {
  assert.equal(presKey, fitKey); assert.equal(presBox, fitBox);
  const rgb = Buffer.from([255, 0, 255, 10, 20, 30]); const k = fitKey(rgb, 2, 1);
  assert.equal(k[3], 0, 'magenta key is transparent'); assert.equal(k[7], 255, 'other pixel opaque');
  const big = Buffer.alloc(4 * 4 * 4, 100); assert.equal(fitBox(big, 4, 4, 2).length, 2 * 2 * 4);
  assert.throws(() => fitBox(big, 4, 4, 3), /box downscale/);
});

test('exact resizes; a different aspect falls back to cover as the spec says', async () => {
  const r = await runFit('exact', [solid(40, 20, MID)], { width: 20, height: 10, frames: 1 });
  assert.equal(r.img.w, 20); assert.ok(near(px(r.img, 10, 5), MID));
  const far = await runFit('exact', [solid(40, 40, MID)], { width: 80, height: 10, frames: 1 });
  assert.ok(far.ops.some(o => /aspect off by/.test(o)), 'the fallback is recorded'); assert.equal(far.img.w, 80);
});

test('cover crops the centre; contain pads with transparent margin; repeat tiles', async () => {
  const two = makeImg(40, 20); for (let y = 0; y < 20; y++) for (let x = 0; x < 40; x++) two.data.set(x < 20 ? [200, 0, 0, 255] : [0, 0, 200, 255], (y * 40 + x) * 4);
  const cv = await runFit('cover', [two], { width: 10, height: 10, frames: 1 });
  assert.equal(cv.img.w, 10); assert.ok(near(px(cv.img, 1, 5), [200, 0, 0, 255], 40) || near(px(cv.img, 8, 5), [0, 0, 200, 255], 40), 'centre crop keeps both halves');
  const ct = await runFit('contain', [solid(20, 20, MID)], { width: 40, height: 20, frames: 1 }, { padding: 0.1 });
  assert.equal(px(ct.img, 0, 0)[3], 0, 'corner is transparent'); assert.equal(px(ct.img, 20, 10)[3], 255, 'middle is solid');
  const tile = makeImg(10, 10); for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) tile.data.set(x < 5 ? [200, 0, 0, 255] : [0, 0, 200, 255], (y * 10 + x) * 4);
  const rx = await runFit('repeat_x', [tile], { width: 50, height: 10, frames: 1 });
  assert.ok(near(px(rx.img, 2, 5), [200, 0, 0, 255], 8) && near(px(rx.img, 12, 5), [200, 0, 0, 255], 8) && near(px(rx.img, 7, 5), [0, 0, 200, 255], 8), 'x tiles every 10');
  const ry = await runFit('repeat_y', [tile], { width: 10, height: 35, frames: 1 });
  assert.equal(ry.img.h, 35); assert.ok(near(px(ry.img, 2, 22), [200, 0, 0, 255], 8));
});

test('nine_slice keeps corners at the target border and stretches edges and centre', async () => {
  const cell = makeImg(40, 40);
  const paint = (x0, y0, x1, y1, c) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) cell.data.set(c, (y * 40 + x) * 4); };
  paint(0, 0, 40, 40, [255, 255, 255, 255]); paint(0, 0, 10, 10, [255, 0, 0, 255]); paint(30, 0, 40, 10, [0, 255, 0, 255]); paint(0, 30, 10, 40, [0, 0, 255, 255]); paint(30, 30, 40, 40, [255, 255, 0, 255]);
  const r = await runFit('nine_slice', [cell], { width: 120, height: 80, frames: 1, borderSize: [20, 20] }, { cellBorder: 10 });
  assert.ok(near(px(r.img, 5, 5), [255, 0, 0, 255]) && near(px(r.img, 114, 5), [0, 255, 0, 255]) && near(px(r.img, 5, 74), [0, 0, 255, 255]) && near(px(r.img, 114, 74), [255, 255, 0, 255]), 'corners');
  assert.ok(near(px(r.img, 60, 40), [255, 255, 255, 255]), 'centre');
  assert.ok(near(px(r.img, 60, 5), [255, 255, 255, 255]), 'top edge');
  await assert.rejects(runFit('nine_slice', [cell], { width: 120, height: 80, frames: 1, borderSize: null }, { cellBorder: 10 }), /borderSize/);
  await assert.rejects(runFit('nine_slice', [cell], { width: 120, height: 80, frames: 1, borderSize: [20, 20] }, {}), /painted border/);
  await assert.rejects(runFit('nine_slice', [cell], { width: 120, height: 80, frames: 1, borderSize: [20, 20] }, { cellBorder: 25 }), /no centre/);
});

test('strip places one cell per frame; frames must divide the width and match the cell count', async () => {
  const r = await runFit('strip', [solid(10, 10, [200, 0, 0, 255]), solid(10, 10, [0, 200, 0, 255]), solid(10, 10, [0, 0, 200, 255])], { width: 60, height: 10, frames: 3 }, { frameFit: 'exact' });
  assert.ok(near(px(r.img, 10, 5), [200, 0, 0, 255]) && near(px(r.img, 30, 5), [0, 200, 0, 255]) && near(px(r.img, 50, 5), [0, 0, 200, 255]), 'frame order');
  await assert.rejects(runFit('strip', [solid(10, 10, MID)], { width: 60, height: 10, frames: 3 }, {}), /cells for 3 frames/);
  await assert.rejects(runFit('exact', [solid(10, 10, MID)], { width: 61, height: 10, frames: 3 }), /not divisible/);
  await assert.rejects(runFit('exact', [solid(10, 10, MID)], { width: 60, height: 10, frames: 3 }), /use strip/);
  await assert.rejects(runFit('wobble', [solid(10, 10, MID)], { width: 10, height: 10, frames: 1 }), /unknown fit/);
  await assert.rejects(runFit('strip', [solid(10, 10, MID)], { width: 10, height: 10, frames: 1 }, { frameFit: 'strip' }), /not a frame fit/);
  const c = fitStrip([fill(2, 2, MID), fill(2, 2, SIX)]); assert.equal(c.w, 4);
});

test('alpha policies: opaque, uniform, cell and the vanilla outline; a missing mask is refused', async () => {
  const half = makeImg(4, 4, Buffer.from(fill(4, 4, [10, 20, 30, 77]).rgba()));
  assert.equal(applyAlpha(half, 'opaque').img.data[3], 255);
  assert.equal(applyAlpha(solid(4, 4, MID), 'uniform:90').img.data[3], 90);
  assert.equal(applyAlpha(half, 'cell').img, half);
  const mask = new Uint8Array(16); mask[0] = 1;
  const sh = applyAlpha(solid(4, 4, MID), 'shape', mask).img; assert.equal(sh.data[3], 255); assert.equal(sh.data[7], 0);
  assert.throws(() => applyAlpha(solid(4, 4, MID), 'shape'), FitError);
  assert.throws(() => applyAlpha(solid(4, 4, MID), 'wobble'), /unknown alpha/);
  const o = outlineOf(Buffer.from([0, 0, 0, 200, 0, 0, 0, 20]), 2, 1); assert.deepEqual([...o], [1, 0]);
  const r = await runFit('same_shape', [solid(8, 8, MID)], { width: 8, height: 8, frames: 1 }, { alpha: 'shape', mask: new Uint8Array(64).fill(1) });
  assert.equal(r.img.data[3], 255);
});

test('transforms flip and rotate losslessly', async () => {
  const a = makeImg(2, 1, Buffer.from([255, 0, 0, 255, 0, 0, 255, 255]));
  assert.deepEqual(px(await transformImg(a, 'flipx'), 0, 0), [0, 0, 255, 255]);
  const r = await transformImg(a, 'rot90'); assert.deepEqual([r.w, r.h], [1, 2]);
  await assert.rejects(transformImg(a, 'spin'), /unknown transform/);
  const t = await runFit('exact', [solid(8, 8, MID)], { width: 8, height: 8, frames: 1 }, { transform: 'rot180' });
  assert.ok(t.ops.includes('transform rot180'));
});

// ---------------------------------------------------------------------------------------------------- inventory
test('the parsers read every sprite kind and the references of a .gui file', () => {
  const defs = parseGfx(readText(Buffer.from(readFileSync(path.join(game, 'interface/test.gfx')))), 'interface/test.gfx');
  const kinds = Object.fromEntries(defs.map(d => [d.name, d.kind]));
  assert.equal(kinds.GFX_tiled_test, 'cornered_tile'); assert.equal(kinds.GFX_bar_test, 'progress_bar'); assert.equal(kinds.GFX_text_test, 'text_sprite'); assert.equal(kinds.GFX_pie_test, 'pie_chart');
  const bar = defs.find(d => d.name === 'GFX_bar_test'); assert.equal(bar.declared, 'gfx/interface/bar_fill.dds'); assert.deepEqual(bar.extra, ['gfx/interface/bar_bg.dds']);
  const shine = defs.find(d => d.name === 'GFX_icon_test_shine'); assert.ok(shine.extra.includes('gfx/interface/goals/shine_overlay.dds'));
  assert.deepEqual(defs.find(d => d.name === 'GFX_tiled_test').borderSize, [8, 8]);
  assert.equal(defs.find(d => d.name === 'GFX_button_test').frames, 3);
  const refs = parseGuiRefs(readFileSync(path.join(game, 'interface/test.gui'), 'utf8'), new Map(defs.map(d => [d.name.toLowerCase(), d.name])));
  assert.deepEqual([...refs.get('GFX_button_test')], ['main_window'], 'a reference is found whatever its case');
  assert.ok(!refs.has('GFX_focus_test'), 'text and names are not references');
});

test('inventory: sizes, frames, borders, classes and file resolution come from the files', () => {
  const by = new Map(inventory.sprites.map(s => [s.name, s]));
  assert.equal(inventory.header.game.version, '9.9.9.0');
  const t = by.get('GFX_tiled_test'); assert.deepEqual([t.width, t.height, t.frames, t.borderSize, t.luminance, t.alpha, t.format], [64, 64, 1, [8, 8], 'dark', 'opaque', 'a8r8g8b8']);
  assert.equal(t.texture, 'gfx/interface/tiles/tiled_test.dds', 'double slashes are normalised');
  const b = by.get('GFX_button_test'); assert.deepEqual([b.width, b.frames, b.luminance], [90, 3, 'mid']);
  assert.equal(by.get('GFX_icon_test').alpha, 'shaped'); assert.equal(by.get('GFX_icon_test').luminance, 'light'); assert.ok(by.get('GFX_icon_test').coverage < 1);
  assert.equal(by.get('GFX_missing_test').missing, true); assert.equal(by.get('GFX_missing_test').width, 0);
  assert.equal(by.get('GFX_tga_test').origin, 'top'); assert.equal(by.get('GFX_tga_test').ext, 'tga');
  const sub = by.get('GFX_sub_test'); assert.equal(sub.texture, 'gfx/interface/sub_test.dds'); assert.equal(sub.declared, 'gfx/interface/sub_test.tga', 'a .tga name that ships as .dds resolves');
  assert.equal(by.get('GFX_dup_test').width, 9, 'the later file wins a duplicate name'); assert.ok(inventory.header.duplicates.GFX_dup_test);
  assert.ok(by.has('GFX_cafeé'), 'UTF-8 names survive');
  assert.equal(by.get('GFX_dlc_test').root, 'dlc/dlc001_test', 'DLC folders load at the same relative paths'); assert.equal(by.get('GFX_dlc_test').width, 6);
  assert.equal(by.get('GFX_pie_test').texture, null);
});

test('inventory: references, windows, linked textures and loose files', () => {
  const by = new Map(inventory.sprites.map(s => [s.name, s]));
  assert.deepEqual(by.get('GFX_tiled_test').refs, { 'interface/test.gui': ['main_window'] });
  assert.deepEqual(Object.keys(by.get('GFX_focus_test').refs), ['interface/ger_scripted_gui.gui']);
  const linked = inventory.sprites.filter(s => s.kind === 'linked').map(s => s.name).sort();
  assert.deepEqual(linked, ['gfx/interface/bar_bg.dds', 'gfx/interface/goals/shine_overlay.dds'], 'second textures and overlays are inventoried');
  assert.ok(inventory.sprites.find(s => s.name === 'gfx/interface/bar_bg.dds').via.includes('GFX_bar_test'));
  const loose = inventory.sprites.filter(s => s.kind === 'file').map(s => s.name).sort();
  assert.ok(loose.includes('gfx/cursors/pointer.cur') && loose.includes('gfx/interface/orphan_test.dds') && loose.includes('gfx/minimap/minimap.dds'));
  const cursor = inventory.sprites.find(s => s.name === 'gfx/cursors/pointer.cur'); assert.deepEqual(cursor.hotspot, [5, 7]);
  assert.equal(inventory.sprites.find(s => s.name === 'gfx/cursors/busy.ani').frames, 2);
  assert.ok(!loose.includes('gfx/interface/button_test.dds'), 'a texture some sprite names is not loose');
});

test('inventory is a pure function of the files: byte-identical on a second read, no absolute path inside', async () => {
  const a = serializeInventory(await buildInventory({ game })), b = serializeInventory(await buildInventory({ game }));
  assert.equal(a, b); assert.ok(!a.includes(root.split(path.sep).join('/')), 'no absolute path'); assert.ok(!a.includes('\\\\'));
  const names = inventory.sprites.map(s => s.name); assert.deepEqual(names, [...names].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0)), 'sorted by byte order');
  assert.deepEqual(gameRoots(game).map(r => r.id), ['base', 'dlc/dlc001_test']);
});

// ---------------------------------------------------------------------------------------------------- plan and coverage (checks 2)
const sheetsOf = p => new Map([...p.sheets]);
test('the plan classifies every inventory entry once, with the dispositions the rules give', () => {
  const rows = new Map(plan.reskin.rows.map(r => [r.name, r]));
  assert.equal(plan.reskin.rows.length, inventory.sprites.length);
  assert.ok(plan.reskin.rows.every(r => DISPOSITIONS.includes(r.disposition)));
  assert.equal(rows.get('GFX_tiled_test').disposition, 'R'); assert.equal(rows.get('GFX_tiled_test').fit, 'nine_slice');
  assert.equal(rows.get('GFX_button_test').fit, 'strip'); assert.deepEqual(rows.get('GFX_button_test').frames, ['normal', 'hover', 'pressed']);
  assert.equal(rows.get('GFX_focus_test').disposition, 'U', 'a focus icon only a vanilla country GUI names is unreachable');
  assert.equal(rows.get('GFX_GER_content').disposition, 'U');
  assert.equal(rows.get('GFX_goal_unknown').disposition, 'R', 'an engine default is skinned');
  assert.equal(rows.get('GFX_missing_test').disposition, 'E'); assert.equal(rows.get('GFX_missing_test').reason, 'missing_texture');
  assert.equal(rows.get('GFX_frontend_bg_test').disposition, 'O'); assert.equal(rows.get('GFX_frontend_bg_test').override, 'interface/frontendmainviewbg.gfx');
  assert.equal(rows.get('gfx/interface/orphan_test.dds').disposition, 'U'); assert.equal(rows.get('gfx/interface/orphan_test.dds').reason, 'orphan');
  assert.equal(rows.get('gfx/cursors/pointer.cur').writer, 'cursors'); assert.equal(rows.get('gfx/minimap/minimap.dds').writer, 'minimap');
  assert.equal(rows.get('GFX_odd_frames').disposition, 'R'); assert.equal(rows.get('GFX_odd_frames').fit === 'strip', false, 'uneven frames are one frame');
  assert.ok(Object.keys(plan.reskin.header.reasons).length > 0);
});

test('the plan is deterministic, and shared textures share one treatment', () => {
  const again = planReskin(inventory, {});
  assert.equal(again.text, plan.text);
  const by = new Map(plan.reskin.rows.map(r => [r.name, r]));
  assert.deepEqual(by.get('GFX_button_test').cells, by.get('GFX_text_test').cells, 'two sprites, one texture, one treatment');
  assert.deepEqual(by.get('GFX_icon_test').cells, by.get('GFX_icon_test_shine').cells);
  assert.equal(summarize(plan.reskin).dispositions.R > 0, true);
});

test('check 2: a complete table passes', () => {
  const r = checkCoverage({ inventory, reskin: plan.reskin, sheets: sheetsOf(plan) });
  assert.equal(r.status, 'pass', JSON.stringify(r.problems.slice(0, 3)));
});

test('check 2 negatives: missing row, unknown row, duplicate, missing reason, derived override', () => {
  const sheets = sheetsOf(plan), rows = plan.reskin.rows;
  const run = r => checkCoverage({ inventory, reskin: { ...plan.reskin, rows: r }, sheets });
  assert.ok(run(rows.filter(r => r.name !== 'GFX_icon_test')).problems.some(p => p.code === 'coverage.missing'));
  assert.ok(run([...rows, { name: 'GFX_ghost', disposition: 'U', reason: 'orphan' }]).problems.some(p => p.code === 'coverage.unknown'));
  assert.ok(run([...rows, rows[0]]).problems.some(p => p.code === 'coverage.duplicate'));
  assert.ok(run(rows.map(r => (r.name === 'GFX_focus_test' ? { name: r.name, disposition: 'U' } : r))).problems.some(p => p.code === 'reason.missing'));
  assert.ok(run(rows.map(r => (r.name === 'GFX_focus_test' ? { name: r.name, disposition: 'U', reason: 'tiny' } : r))).problems.some(p => p.code === 'reason.missing'), 'a reason must be a key or a sentence');
  assert.ok(run(rows.map(r => (r.name === 'GFX_focus_test' ? { name: r.name, disposition: 'D' } : r))).problems.some(p => p.code === 'row.derived_override'));
  assert.ok(run(rows.map(r => (r.name === 'GFX_frontend_bg_test' ? { ...r, override: 'interface/core.gfx' } : r))).problems.some(p => p.code === 'row.override'));
});

test('check 2 negatives: R rows need cells, a known fit, sheet and cell, frames from the inventory, and no sizes', () => {
  const sheets = sheetsOf(plan), rows = plan.reskin.rows, tiled = rows.find(r => r.name === 'GFX_tiled_test'), button = rows.find(r => r.name === 'GFX_button_test');
  const bad = patch => checkCoverage({ inventory, reskin: { ...plan.reskin, rows: rows.map(r => (r.name === patch.name ? patch : r)) }, sheets }).problems.map(p => p.code);
  assert.ok(bad({ ...tiled, cells: [] }).includes('row.cells'));
  assert.ok(bad({ ...tiled, fit: 'smear' }).includes('row.fit'));
  assert.ok(bad({ ...tiled, sheet: 'no-such-sheet' }).includes('row.sheet'));
  assert.ok(bad({ ...tiled, cells: ['nonexistent_cell'] }).includes('row.cell'));
  assert.ok(bad({ ...tiled, width: 64 }).includes('row.size_field'), 'sizes are never written into a row');
  assert.ok(bad({ ...tiled, borderSize: [8, 8] }).includes('row.size_field'));
  assert.ok(bad({ ...button, frames: ['normal', 'hover'], cells: button.cells.slice(0, 2) }).includes('row.frames'));
  assert.ok(bad({ ...button, fit: 'cover', frames: undefined }).includes('row.frames'), 'a three-frame texture must be a strip');
  assert.ok(bad({ ...tiled, alpha: 'maybe' }).includes('row.alpha'));
  assert.ok(bad({ ...tiled, family: 'nonsense' }).includes('row.family'));
  assert.ok(bad({ ...tiled, transform: 'spin' }).includes('row.transform'));
  assert.ok(bad({ ...tiled, fit: 'same_shape', alpha: 'opaque' }).includes('row.alpha'));
  const icon = rows.find(r => r.name === 'GFX_icon_test'); assert.ok(bad({ ...icon, fit: 'nine_slice', alpha: 'cell' }).includes('row.border'), 'nine_slice needs a cornered tile');
  const shine = rows.find(r => r.name === 'GFX_icon_test_shine'); assert.ok(bad({ ...shine, cells: ['socket_wide'] }).includes('row.shared_texture'), 'two treatments for one file are refused');
});

test('sheet definitions are valid, and the committed ones agree with their cells', () => {
  for (const sh of FIXED_SHEETS) assert.deepEqual(validateSheet(sh), [], sh.id);
  assert.ok(validateSheet({ ...FIXED_SHEETS[0], cells: [...FIXED_SHEETS[0].cells, FIXED_SHEETS[0].cells[0]] }).some(p => /duplicate cell/.test(p)));
  assert.ok(validateSheet({ ...FIXED_SHEETS[0], grid: [1, 1] }).some(p => /cells in a/.test(p)));
  assert.ok(validateSheet({ ...FIXED_SHEETS[0], aspect: '9:1' }).some(p => /aspect/.test(p)));
  const chk = layoutCheck(FIXED_SHEETS[0]); assert.equal(chk.expected, FIXED_SHEETS[0].cells.length); assert.equal(chk.cols, 3);
  for (const family of ['chrome_panels', 'military', 'cursors']) assert.ok(PREAMBLES[family].includes('#1E1610'), `${family} preamble carries the palette`);
});

// ---------------------------------------------------------------------------------------------------- builder
// A synthetic accepted sheet for every sheet the plan uses: coloured cells on a black ground in the sheet's grid.
const TONE = { dark: [60, 45, 35], mid: [150, 110, 70], light: [220, 205, 170] };
async function fakeSheet(sheet, { dropOne = false } = {}) {
  const [W, H] = [768, 512].map((v, i) => (sheet.aspect === '1:1' ? 512 : sheet.aspect === '3:2' ? [768, 512][i] : sheet.aspect === '4:3' ? [768, 576][i] : sheet.aspect === '2:3' ? [512, 768][i] : sheet.aspect === '2:1' ? [1024, 512][i] : sheet.aspect === '4:1' ? [1536, 384][i] : [1152, 384][i]));
  const data = Buffer.alloc(W * H * 3), [cols, rows] = sheet.grid, cw = W / cols, ch = H / rows;
  sheet.cells.forEach((cell, i) => {
    if (dropOne && i === 0) return;
    const col = i % cols, row = Math.floor(i / cols), x0 = Math.round(col * cw + cw * 0.1), x1 = Math.round((col + 1) * cw - cw * 0.1), y0 = Math.round(row * ch + ch * 0.12), y1 = Math.round((row + 1) * ch - ch * 0.12);
    const t = TONE[cell.lum];
    const round = sheet.matte === 'outline', ccx = (x0 + x1) / 2, ccy = (y0 + y1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { if (round && ((x - ccx) / rx) ** 2 + ((y - ccy) / ry) ** 2 > 1) continue; const o = (y * W + x) * 3, edge = x - x0 < 3 || y - y0 < 3 ? 20 : 0; data[o] = t[0] + edge; data[o + 1] = t[1] + edge; data[o + 2] = t[2] + edge; }
  });
  return sharp(data, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}

let rawDir, provenance, built, stagedFiles, buildResult;
const usedSheets = () => new Set(plan.reskin.rows.filter(r => r.disposition === 'R' && (r.writer ?? 'reskin') === 'reskin').flatMap(r => [].concat(r.sheet)));
const runBuild = async (opts = {}) => {
  const staged = new Staged();
  const res = await buildReskin(staged, { inventory, reskin: plan.reskin, sheets: sheetsOf(plan), provenance, rawPath: rel => path.join(rawDir, rel), shapeFor: row => vanillaOutline(row, game), ...opts });
  return { staged, res };
};

test('build: accepted sheets produce every R file at the vanilla path, extension and size', async () => {
  rawDir = path.join(root, 'raw'); provenance = [];
  for (const id of usedSheets()) {
    const f = path.join(rawDir, 'ui/reskin', `${id}.png`); mkdirSync(path.dirname(f), { recursive: true });
    const bytes = await fakeSheet(sheetsOf(plan).get(id)); writeFileSync(f, bytes);
    provenance.push({ id, out: `ui/reskin/${id}.png`, sha256: sha256(bytes), accepted: true, reviewer: 'agent', kind: 'sheet' });
  }
  const { staged, res } = await runBuild();
  built = res; stagedFiles = staged.files; buildResult = res;
  assert.equal(res.pending.length, 0, JSON.stringify(res.pending.slice(0, 3)));
  const by = new Map(inventory.sprites.map(s => [s.name, s]));
  for (const tex of ['gfx/interface/tiles/tiled_test.dds', 'gfx/interface/button_test.dds', 'gfx/interface/tga_test.tga', 'gfx/interface/icon_test.dds', 'gfx/interface/flag_overlay_test.dds']) assert.ok(stagedFiles.has(tex), tex);
  const b = readHeader(stagedFiles.get('gfx/interface/button_test.dds'), 'dds'); assert.deepEqual([b.width, b.height, b.format], [90, 30, 'a8r8g8b8']);
  const t = readHeader(stagedFiles.get('gfx/interface/tga_test.tga'), 'tga'); assert.equal(t.topOrigin, true, 'the TGA keeps the vanilla file\'s origin');
  assert.ok(stagedFiles.has('gfx/interface/odd_frames.dds') && readHeader(stagedFiles.get('gfx/interface/odd_frames.dds'), 'dds').width === 71, 'uneven frames keep the exact vanilla size');
  assert.ok(stagedFiles.has(MANIFEST_FILE)); assert.ok([...stagedFiles.keys()].some(k => k.startsWith('art/source/ui/reskin/')), 'accepted sources are staged');
  assert.ok(res.delegated.some(d => d.writer === 'cursors') && res.delegated.some(d => d.writer === 'minimap'), 'other writers are reported, not built');
  assert.equal(by.size > 0, true);
});

test('build: shaped rows take the vanilla outline as alpha; a missing game leaves them pending', async () => {
  const flag = readHeader(stagedFiles.get('gfx/interface/flag_overlay_test.dds'), 'dds');
  const px2 = await decodeRgba(stagedFiles.get('gfx/interface/flag_overlay_test.dds'), 'dds');
  assert.equal(px2.data[3], 0, 'the corner is outside the vanilla outline'); assert.equal(px2.data[(8 * 24 + 12) * 4 + 3], 255, 'the middle is inside'); assert.equal(flag.width, 24);
  const none = await runBuild({ shapeFor: async () => null });
  assert.ok(none.res.pending.some(p => p.texture === 'gfx/interface/flag_overlay_test.dds' && /outline/.test(p.why)));
  assert.ok(!none.staged.files.has('gfx/interface/flag_overlay_test.dds'));
});

test('build: no accepted source leaves rows pending and reports them; nothing fails', async () => {
  const { staged, res } = await runBuild({ provenance: [] });
  assert.equal(res.built.length, 0); assert.ok(res.pending.length > 3);
  assert.ok(res.pending.every(p => /no review line/.test(p.why)), 'unreviewed bytes never ship');
  assert.equal(JSON.parse(staged.files.get(MANIFEST_FILE)).files.length, 0);
  const missing = await runBuild({ rawPath: () => path.join(root, 'nowhere.png') });
  assert.ok(missing.res.pending.every(p => /no raw sheet/.test(p.why)));
  const rejected = await runBuild({ provenance: provenance.map(l => ({ ...l, accepted: false })) });
  assert.ok(rejected.res.pending.every(p => /review rejected/.test(p.why)));
});

test('build: a sheet that yields the wrong number of cells is refused as pending, not guessed', async () => {
  const id = 'ui-chrome-panels', sheet = sheetsOf(plan).get(id), f = path.join(rawDir, 'ui/reskin', `${id}.png`), good = readFileSync(f);
  const bad = await fakeSheet(sheet, { dropOne: true }); writeFileSync(f, bad);
  const prov = [...provenance, { id, out: `ui/reskin/${id}.png`, sha256: sha256(bad), accepted: true, reviewer: 'agent' }];
  try {
    const { res } = await runBuild({ provenance: prov });
    assert.ok(res.pending.some(p => /found \d+ cells, expected/.test(p.why)), JSON.stringify(res.pending.slice(0, 2)));
    await assert.rejects(readSheetCells(sheet, f), /found \d+ cells/);
  } finally { writeFileSync(f, good); }
});

test('build: determinism, and a table that fails validation is not built', async () => {
  const a = await runBuild(), b = await runBuild();
  for (const [k, v] of a.staged.files) assert.ok(v.equals(b.staged.files.get(k)), k);
  assert.equal(a.staged.files.size, b.staged.files.size);
  await assert.rejects(runBuild({ reskin: { ...plan.reskin, rows: plan.reskin.rows.slice(1) } }), /problems/);
  const cells = await readSheetCells(sheetsOf(plan).get('ui-sockets'), path.join(rawDir, 'ui/reskin/ui-sockets.png'));
  assert.equal(cells.size, sheetsOf(plan).get('ui-sockets').cells.length); assert.ok([...cells.values()].every(c => c.w > 4));
  assert.ok([...cells.values()].some(c => px(c, 0, 0)[3] === 0), 'outline sheets take their own alpha');
});

// ---------------------------------------------------------------------------------------------------- checks 3 to 9
const reskin = () => plan.reskin;
const filesCopy = () => new Map(stagedFiles);
const swap = (files, tex, bytes) => { const m = new Map(files); m.set(tex, bytes); return m; };

test('check 3: a correct build passes; no art is pending, not a failure', () => {
  const r = checkShape({ inventory, reskin: reskin(), files: stagedFiles });
  assert.equal(r.problems.length, 0, JSON.stringify(r.problems.slice(0, 3))); assert.ok(r.notes.checked > 5);
  const none = checkShape({ inventory, reskin: reskin(), files: new Map() });
  assert.equal(none.status, 'pending'); assert.equal(none.problems.length, 0); assert.ok(none.pending.includes('gfx/interface/button_test.dds'));
});

test('check 3 negatives: wrong size, wrong format, mipmaps, wrong origin, wrong case, bad header, unexpected output', () => {
  const tex = 'gfx/interface/button_test.dds', codes = files => checkShape({ inventory, reskin: reskin(), files }).problems.map(p => p.code);
  assert.ok(codes(swap(stagedFiles, tex, dds(fill(91, 30, MID)))).includes('shape.size'));
  assert.ok(codes(swap(stagedFiles, tex, tga(fill(90, 30, MID)))).some(c => c.startsWith('shape.')), 'a TGA at a .dds path is not a DDS');
  const mips = Buffer.from(dds(fill(90, 30, MID))); mips.writeUInt32LE(mips.readUInt32LE(8) | 0x20000, 8); mips.writeUInt32LE(3, 28);
  assert.ok(codes(swap(stagedFiles, tex, mips)).includes('shape.dds'), 'mipmaps are refused');
  const dxt = Buffer.from(dds(fill(90, 30, MID))); dxt.writeUInt32LE(0x4, 80); dxt.write('DXT5', 84, 'ascii');
  assert.ok(codes(swap(stagedFiles, tex, dxt)).includes('shape.format'));
  assert.ok(codes(swap(stagedFiles, tex, Buffer.from('junk'))).includes('shape.header'));
  assert.ok(codes(swap(stagedFiles, 'gfx/interface/tga_test.tga', tga(fill(12, 12, MID)))).includes('shape.origin'), 'a bottom-left TGA replaces a top-left one');
  const recased = filesCopy(); recased.set('GFX/Interface/Button_Test.dds', recased.get(tex)); recased.delete(tex);
  assert.ok(codes(recased).includes('shape.path'), 'the path case must be the vanilla case');
  const extra = filesCopy(); extra.set('gfx/interface/goals/focus_test.dds', dds(fill(20, 20, MID)));
  assert.ok(codes(extra).includes('shape.unexpected_output'), 'a file at the path of a non-R texture');
  const cursor = filesCopy(); cursor.set('gfx/cursors/pointer.cur', cur(fill(32, 32, MID), { hotspot: [1, 1] }));
  assert.ok(codes(cursor).includes('shape.hotspot'), 'the vanilla hotspot is kept');
  const goodCursor = filesCopy(); goodCursor.set('gfx/cursors/pointer.cur', cur(fill(32, 32, MID), { hotspot: [5, 7] }));
  assert.equal(checkShape({ inventory, reskin: reskin(), files: goodCursor }).problems.length, 0);
});

test('check 4: reachability passes for the table, and fails for a U row that is reached', () => {
  assert.equal(checkReachability({ inventory, reskin: reskin() }).status, 'pass');
  const withU = name => ({ ...reskin(), rows: reskin().rows.map(r => (r.name === name ? { name, disposition: 'U', reason: 'orphan' } : r)) });
  const viaWindow = checkReachability({ inventory, reskin: withU('GFX_icon_test') });
  assert.equal(viaWindow.status, 'fail'); assert.match(viaWindow.problems[0].message, /window main_window/);
  const viaScript = checkReachability({ inventory, reskin: reskin(), scriptRefs: new Set(['GFX_focus_test']) });
  assert.match(viaScript.problems[0].message, /script/);
  assert.equal(checkReachability({ inventory, reskin: withU('GFX_goal_unknown') }).problems[0].code, 'reach.reachable', 'an engine default cannot be U');
  const texts = scriptReferences(['picture = focus_test\nicon = "gfx/interface/orphan_test.dds"', 'text = "£button_test|1"'], inventory);
  assert.ok(texts.has('GFX_focus_test') && texts.has('GFX_button_test') && texts.has('gfx/interface/orphan_test.dds'), [...texts].join());
  assert.equal(checkReachability({ inventory, reskin: reskin(), scriptRefs: texts }).status, 'fail', 'the focus icon is U and a script names it');
  assert.equal(windowState('interface/frontendmainview.gui', 'mainmenu_dlc_ownership').state, 'hidden');
  assert.equal(guiState('interface/GER_inner_circle_scripted_gui.gui').state, 'unreachable');
  assert.equal(guiState('integrated_dlc/dlc023_man_the_guns/interface/mtg_music.gui').state, 'reachable');
});

test('check 5: no vanilla pixels; a byte copy and a re-encoded copy both fail', async () => {
  const ok = await checkNoVanillaPixels({ inventory, reskin: reskin(), files: stagedFiles, game });
  assert.equal(ok.problems.length, 0, JSON.stringify(ok.problems)); assert.equal((await checkNoVanillaPixels({ inventory, reskin: reskin(), files: new Map(), game })).status, 'pending');
  const vanilla = readFileSync(path.join(game, 'gfx/interface/button_test.dds'));
  const copy = await checkNoVanillaPixels({ inventory, reskin: reskin(), files: swap(stagedFiles, 'gfx/interface/button_test.dds', vanilla), game });
  assert.equal(copy.problems[0].code, 'pixels.byte_copy');
  const px = await decodeRgba(readFileSync(path.join(game, 'gfx/interface/grad_test.dds')), 'dds'); const c = fromRaw(px.data, 32, 32); c.px[0] = 1;
  const re = await checkNoVanillaPixels({ inventory, reskin: reskin(), files: swap(stagedFiles, 'gfx/interface/grad_test.dds', dds(c)), game });
  assert.equal(re.problems[0].code, 'pixels.perceptual', JSON.stringify(re.problems));
  const flatFile = swap(stagedFiles, 'gfx/interface/grad_test.dds', dds(fill(32, 32, MID)));
  const flat = await checkNoVanillaPixels({ inventory, reskin: reskin(), files: flatFile, game }); assert.equal(flat.notes.inconclusive > 0, true);
  const nogame = await checkNoVanillaPixels({ inventory, reskin: reskin(), files: stagedFiles, game: path.join(root, 'absent') }); assert.equal(nogame.status, 'pending');
});

test('check 6: provenance needs a manifest line, matching hashes and an accepted source', () => {
  const manifest = JSON.parse(stagedFiles.get(MANIFEST_FILE)), run = (files, m = manifest, prov = provenance) => checkProvenance({ manifest: m, files, provenance: prov, inventory, reskin: reskin() });
  assert.equal(run(stagedFiles).problems.length, 0, JSON.stringify(run(stagedFiles).problems.slice(0, 2)));
  assert.equal(checkProvenance({ manifest: { files: [] }, files: new Map(), provenance, inventory, reskin: reskin() }).status, 'pending');
  const codes = (...a) => run(...a).problems.map(p => p.code);
  assert.ok(codes(stagedFiles, { files: manifest.files.slice(1) }).includes('prov.no_manifest_line'));
  assert.ok(codes(swap(stagedFiles, 'gfx/interface/button_test.dds', dds(fill(90, 30, SIX)))).includes('prov.hash'));
  assert.ok(codes(stagedFiles, manifest, []).includes('prov.not_accepted'), 'no accepted review line');
  assert.ok(codes(stagedFiles, manifest, provenance.map(l => ({ ...l, accepted: false }))).includes('prov.not_accepted'));
  assert.ok(codes(stagedFiles, { files: [...manifest.files, { out: 'gfx/interface/ghost.dds', source: 'x', sourceSha256: '0', sha256: '0' }] }).includes('prov.stale'));
  const noSource = new Map(stagedFiles); for (const k of [...noSource.keys()]) if (k.startsWith('art/source/')) noSource.delete(k);
  noSource.set(MANIFEST_FILE, stagedFiles.get(MANIFEST_FILE));
  assert.ok(codes(noSource).includes('prov.source_missing'));
});

test('check 7: luminance class of every R output equals the vanilla class', async () => {
  const ok = await checkLuminance({ inventory, reskin: reskin(), files: stagedFiles });
  assert.equal(ok.problems.length, 0, JSON.stringify(ok.problems.slice(0, 3)));
  const dark = await checkLuminance({ inventory, reskin: reskin(), files: swap(stagedFiles, 'gfx/interface/button_test.dds', dds(fill(90, 30, LIGHT))) });
  assert.equal(dark.problems[0].code, 'luma.class'); assert.match(dark.problems[0].message, /vanilla class is mid/);
  assert.equal((await checkLuminance({ inventory, reskin: reskin(), files: new Map() })).status, 'pending');
  const junk = await checkLuminance({ inventory, reskin: reskin(), files: swap(stagedFiles, 'gfx/interface/button_test.dds', Buffer.from('junk')) });
  assert.equal(junk.problems[0].code, 'luma.unreadable');
});

test('check 8: only the closed list of files may override vanilla names, and each keeps every bound name', () => {
  const vanillaGui = readFileSync(path.join(game, 'interface/frontendmainview.gui'), 'utf8');
  const ok = new Map([['interface/frontendmainview.gui', Buffer.from(vanillaGui + '\n# ZIN title\n')], ['interface/zin_menu.gui', Buffer.from('guiTypes = { }')]]);
  assert.equal(checkOverrides({ files: ok, game }).status, 'pass'); assert.equal(checkOverrides({ files: ok, game }).notes.checked, 1);
  const dropped = new Map([['interface/frontendmainview.gui', Buffer.from('guiTypes = { containerWindowType = { name = "frontend_background" } }')]]);
  const d = checkOverrides({ files: dropped, game }); assert.equal(d.problems[0].code, 'overrides.dropped'); assert.match(d.problems[0].message, /mainmenu_dlc_ownership/);
  const unlisted = new Map([['interface/test.gui', Buffer.from('guiTypes = { }')]]);
  assert.equal(checkOverrides({ files: unlisted, game }).problems[0].code, 'overrides.unlisted');
  assert.equal(checkOverrides({ files: new Map([['Interface/TEST.gfx', Buffer.from('spriteTypes = { }')]]), game }).problems[0].code, 'overrides.unlisted', 'the file system ignores case');
  assert.equal(checkOverrides({ files: new Map([['interface/test.gui', Buffer.from('x')]]), game, allowed: [...OVERRIDE_FILES, 'interface/test.gui'] }).problems[0].code, 'overrides.dropped', 'allowing a file does not excuse dropped names');
  assert.deepEqual([...elementNames('guiTypes = { containerWindowType = { name = "A" iconType = { name = "b" } } }')].sort(), ['a', 'b']);
  assert.equal(checkOverrides({ files: new Map([['gfx/interface/x.dds', Buffer.alloc(4)]]), game }).status, 'pass', 'textures are not overrides');
});

test('check 9: determinism compares two builds byte for byte', async () => {
  assert.equal((await checkDeterminism({ build: async () => (await runBuild()).staged })).status, 'pass');
  let n = 0;
  const flaky = await checkDeterminism({ build: async () => new Map([['a.txt', Buffer.from(String(n++))]]) });
  assert.equal(flaky.problems[0].code, 'det.differs');
  let m = 0;
  const lopsided = await checkDeterminism({ build: async () => new Map(m++ ? [['a', Buffer.from('1')], ['b', Buffer.from('2')]] : [['a', Buffer.from('1')]]) });
  assert.equal(lopsided.problems[0].code, 'det.missing');
});

test('runUiChecks aggregates and reports pending checks without failing', async () => {
  const full = await runUiChecks({ inventory, reskin: reskin(), sheets: sheetsOf(plan), files: stagedFiles, game, provenance, scriptRefs: new Set() });
  assert.equal(full.ok, true, JSON.stringify(full.checks.filter(c => c.status === 'fail').map(c => [c.id, c.problems.slice(0, 2)])));
  assert.deepEqual(full.checks.map(c => c.id), [1, 2, 3, 4, 5, 6, 7, 8]);
  const empty = await runUiChecks({ inventory, reskin: reskin(), sheets: sheetsOf(plan), files: new Map(), game, provenance });
  assert.equal(empty.ok, true); assert.ok(empty.pending.includes(3) && empty.pending.includes(5) && empty.pending.includes(7));
});

// ---------------------------------------------------------------------------------------------------- check 1
test('check 1: inventory freshness detects a patched game and lists the changed sprites', async () => {
  const fresh = checkInventoryFreshness({ inventory, game }); assert.equal(fresh.status, 'pass', JSON.stringify(fresh.problems));
  assert.equal(checkInventoryFreshness({ inventory, game: path.join(root, 'absent') }).status, 'pending');
  const patched = path.join(root, 'patched').split(path.sep).join('/'); const { cpSync } = await import('node:fs'); cpSync(game, patched, { recursive: true });
  const bump = (rel, fn) => { const f = path.join(patched, rel); writeFileSync(f, fn(readFileSync(f))); };
  bump('launcher-settings.json', b => Buffer.from(b.toString().replace('9.9.9.0', '9.9.10.0')));
  assert.match(checkInventoryFreshness({ inventory, game: patched }).problems[0].message, /game version 9.9.10.0/);
  bump('launcher-settings.json', b => Buffer.from(b.toString().replace('9.9.10.0', '9.9.9.0')));
  bump('interface/test.gfx', b => Buffer.concat([b, Buffer.from('\n# patched\n')]));
  const gfx = checkInventoryFreshness({ inventory, game: patched }); assert.ok(gfx.notes.changedFiles.includes('interface/test.gfx')); assert.ok(gfx.notes.changedSprites.includes('GFX_tiled_test'));
  bump('interface/test.gfx', b => Buffer.from(b.toString().replace('\n# patched\n', '')));
  assert.equal(checkInventoryFreshness({ inventory, game: patched }).status, 'pass', 'restoring the file restores the pass');
  writeFileSync(path.join(patched, 'gfx/interface/button_test.dds'), dds(fill(90, 30, [141, 100, 60, 255])));
  assert.equal(checkInventoryFreshness({ inventory, game: patched }).status, 'pass', 'same size, other pixels: only the deep check sees it');
  const deep = checkInventoryFreshness({ inventory, game: patched, deep: true }); assert.equal(deep.status, 'fail'); assert.ok(deep.notes.changedSprites.includes('GFX_button_test'));
  writeFileSync(path.join(patched, 'gfx/interface/button_test.dds'), dds(fill(91, 30, MID)));
  assert.ok(checkInventoryFreshness({ inventory, game: patched }).notes.changedSprites.includes('GFX_button_test'), 'a size change is seen by the cheap check');
  writeFileSync(path.join(patched, 'interface/brand_new.gui'), 'guiTypes = { }');
  assert.ok(checkInventoryFreshness({ inventory, game: patched }).problems.some(p => /new file/.test(p.message)));
  assert.equal(verifyInventory({ inventory, game }).ok, true);
});

// ---------------------------------------------------------------------------------------------------- jobs
test('jobs: one imagegen job per sheet, with the layout check and the family preamble', () => {
  const sheet = FIXED_SHEETS.find(s => s.id === 'ui-buttons'), job = sheetJob(sheet, '/art/raw');
  assert.equal(job.id, 'reskin-ui-buttons'); assert.equal(job.out, '/art/raw/ui/reskin/ui-buttons.png'); assert.equal(job.size, '3072x768');
  assert.equal(job.check.expected, 12); assert.equal(job.check.cols, 3); assert.equal(job.check.rows, 4);
  assert.ok(job.prompt.includes('exact grid of 3 columns and 4 rows') && job.prompt.includes('Row 4, left to right: 10.'));
  assert.ok(job.prompt.includes('solid flat pure black (#000000)') && job.prompt.includes('no lettering') && job.prompt.includes('#D9B562'));
  const outline = sheetPrompt(FIXED_SHEETS.find(s => s.id === 'ui-sockets')); assert.ok(outline.includes('isolated object'));
  const sheets = new Map(FIXED_SHEETS.map(s => [s.id, s])), all = reskinJobs({ sheets, rawDir: '/art/raw' });
  assert.equal(all.jobs.length, FIXED_SHEETS.length); assert.ok(all.jobs.every((j, i, a) => i === 0 || a[i - 1].tranche <= j.tranche), 'ordered by production step');
  assert.equal(reskinJobs({ sheets, rawDir: '/art/raw', tranche: 5 }).jobs.every(j => j.tranche === 5), true);
  assert.equal(reskinJobs({ sheets, rawDir: '/art/raw', family: 'topbar' }).jobs.map(j => j.sheet).join(), 'ui-topbar');
  const waiting = new Map([['icons-alerts-1', { id: 'icons-alerts-1', family: 'alerts', kind: 'grid', aspect: '1:1', grid: [6, 6], ground: 'black', matte: 'outline', needs: ['alert_frames.json'], tranche: 10, cells: [{ key: 'a', subject: 's', lum: 'dark' }] }]]);
  assert.equal(reskinJobs({ sheets: waiting, dataPresent: () => false }).blocked[0].needs[0], 'alert_frames.json');
  assert.equal(reskinJobs({ sheets: waiting, dataPresent: () => true }).jobs.length, 1);
});

test('the review copy under docs/design/ui holds the table, the sheets and a report', () => {
  const staged = new Staged(); publishUiData(staged, plan);
  assert.ok(staged.files.has('docs/design/ui/reskin.json') && staged.files.has('docs/design/ui/report.json'));
  assert.ok([...plan.sheets.keys()].every(id => staged.files.has(`docs/design/ui/sheets/${id}.json`)));
  const report = JSON.parse(staged.files.get('docs/design/ui/report.json'));
  assert.equal(report.dispositions.R, plan.reskin.rows.filter(r => r.disposition === 'R').length); assert.ok(report.decisions.length > 5);
  assert.equal(JSON.parse(staged.files.get('docs/design/ui/reskin.json')).rows.length, inventory.sprites.length);
});

// ---------------------------------------------------------------------------------------------------- the committed tables
test('the committed reskin table, sheets and inventory agree with each other', () => {
  const inv = loadInventory(INVENTORY_FILE), table = loadReskin(RESKIN_FILE), sheets = loadSheets(SHEETS_DIR);
  const problems = validateReskin({ inventory: inv, reskin: table, sheets });
  assert.equal(problems.length, 0, JSON.stringify(problems.slice(0, 5)));
  assert.equal(table.rows.length, inv.sprites.length); assert.equal(inv.header.counts.sprites, inv.sprites.length);
  assert.equal(inv.header.game.version, '1.19.3.0'); assert.ok(inv.sprites.length > 30000);
  const d = summarize(table).dispositions; assert.ok(d.R > 3000 && d.U > 20000 && d.O === 13 && !d.D && !d.Z);
  for (const [id, s] of sheets) assert.deepEqual(validateSheet(s), [], id);
  const used = new Set(table.rows.filter(r => r.disposition === 'R').flatMap(r => [].concat(r.sheet ?? []))); assert.deepEqual([...used].filter(x => !sheets.has(x)), [], 'every used sheet exists');
  assert.deepEqual([...sheets.keys()].filter(x => !used.has(x)), [], 'no sheet is unused');
  assert.equal(planReskin(inv).text, readFileSync(RESKIN_FILE, 'utf8'), 'reskin.json is exactly what the rules derive from the inventory');
});

test('the committed inventory matches the installed game when it is installed', { skip: !existsSync(`${GAME}/launcher-settings.json`) }, () => {
  const r = checkInventoryFreshness({ inventory: loadInventory(INVENTORY_FILE), game: GAME });
  assert.equal(r.status, 'pass', JSON.stringify(r.problems.slice(0, 5)));
});

test('the committed sheets give a complete job list; only the alert sheets wait for data', () => {
  const sheets = loadSheets(SHEETS_DIR), { jobs, blocked } = reskinJobs({ sheets, rawDir: '/art/raw', dataPresent: () => false });
  assert.ok(jobs.length >= 40 && jobs.length <= 60, `${jobs.length} jobs`);
  assert.deepEqual([...new Set(blocked.map(b => b.sheet.replace(/-\d+$/, '')))].sort(), ['icons-alerts', 'icons-alerts-bare', 'icons-diplorequests']);
  assert.ok(jobs.every(j => j.out.endsWith(`/ui/reskin/${j.sheet}.png`) && j.check.expected > 0 && j.prompt.length > 400));
});

test('alert_frames.json names the meaning of every alert cell; its twin layer without a plate reuses it', () => {
  const frames = { alert_01: 'a bell for a new letter', alert_02: 'a locked gate', request_01: 'a raised hand' };
  const { sheets } = planReskin(loadInventory(INVENTORY_FILE), { alertFrames: frames });
  const cell = (sheet, key) => sheets.get(sheet).cells.find(c => c.key === key).subject;
  assert.match(cell('icons-alerts-1', 'alert_01'), /a bell for a new letter$/);
  assert.match(cell('icons-alerts-bare-1', 'alert_01_bare'), /a bell for a new letter$/);
  assert.match(cell('icons-diplorequests', 'request_01'), /a raised hand$/);
  assert.match(cell('icons-alerts-1', 'alert_03'), /meaning per alert_frames\.json$/, 'frames with no entry keep the pending note');
});

test('alpha policy and frame helpers follow the inventory', () => {
  assert.equal(alphaPolicy({ alpha: 'opaque' }), 'opaque'); assert.equal(alphaPolicy({ alpha: 'uniform:79' }), 'uniform:79');
  assert.equal(alphaPolicy({ alpha: 'shaped', coverage: 0.99 }), 'opaque'); assert.equal(alphaPolicy({ alpha: 'shaped', coverage: 0.5 }), 'shape'); assert.equal(alphaPolicy({ alpha: 'keyed', coverage: 0.4 }), 'shape');
  assert.equal(framesOf({ frames: 3, width: 90 }), 3); assert.equal(framesOf({ frames: 2, width: 71 }), 1); assert.equal(framesOf({ frames: 1, width: 71 }), 1);
});
