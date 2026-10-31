// UI overhaul lanes C2 and C3: the text-colour file and the ZIN window cells.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { textColoursGfx, tokenRgb } from './modules/ui.mjs';
import { cutSheet, loadChromeSpec, loadZinChrome, outlineAlpha } from './lib/zin_chrome.mjs';
import { makeImg } from './lib/fit.mjs';
import { rawFile, GAME } from './lib/paths.mjs';

const design = JSON.parse(readFileSync(new URL('./data/ui/design_system.json', import.meta.url), 'utf8'));
const tc = JSON.parse(readFileSync(new URL('./data/ui/textcolors.json', import.meta.url), 'utf8'));

test('Text colours: every code resolves to a design-system token or a recorded vanilla value', () => {
  assert.deepEqual(tokenRgb('semantic.state.good', design), [0x76, 0xb2, 0x62]);
  assert.deepEqual(tokenRgb('banner_hall.text.title', design), [0xf5, 0xea, 0xd1]);
  assert.throws(() => tokenRgb('semantic.no_such_token', design), /names no colour token/);
  const gfx = textColoursGfx(tc, design);
  assert.match(gfx, /^bitmapfonts = \{$/m);
  assert.match(gfx, /\n\ttextcolors = \{\n[\s\S]*?\t\tG = \{ 118 178 98 \}/);
  for (const code of ['C', 'L', 'W', 'B', 'G', 'R', 'b', 'g', 'Y', 'H', 'T', 'O', 't', '0', '9']) assert.ok(code in tc.global.codes, `global code ${code} is written`);
  // every light-on-dark face carries the same G as the global block; the aliases draw Garamond
  for (const f of tc.fontColours.fonts) assert.match(gfx, new RegExp(`name = "${f.name}"[\\s\\S]*?G = \\{ 118 178 98 \\}`));
  assert.match(gfx, /name = "hoi_18mbs"[\s\S]*?color = 0xfff4ecdc/, 'a white face draws in text.primary');
  assert.match(gfx, /name = "hoi4_typewriter16"[\s\S]*?color = 0xff000000/, 'a dark face keeps its colour');
  assert.match(gfx, /name = "hoi4_typewriter16"\n\t\tfontfiles = \{\n\t\t\t"gfx\/fonts\/garamond_16"/);
  assert.match(gfx, /name = "hoi4_typewriter22_inverted"\n\t\tfontfiles = \{\n\t\t\t"gfx\/fonts\/garamond_24"/);
  assert.equal((gfx.match(/\{/g) ?? []).length, (gfx.match(/\}/g) ?? []).length, 'balanced braces');
});

test('Text colours: the redefined faces keep their installed files, colour and cursor offset', { skip: !existsSync(`${GAME}/interface/core.gfx`) && 'no installed game' }, () => {
  const core = readFileSync(`${GAME}/interface/core.gfx`, 'latin1');
  for (const f of tc.fontColours.fonts) {
    const m = new RegExp(`bitmapfont = \\{\\s*name = "${f.name}"([\\s\\S]*?)\\n\\t\\}`).exec(core);
    assert.ok(m, `${f.name} is defined in core.gfx`);
    const files = f.path ? [f.path] : f.fontfiles;
    for (const p of files) assert.ok(m[1].includes(`"${p}"`), `${f.name} reads ${p}`);
    assert.ok(m[1].includes(`color = ${f.color}`), `${f.name} colour ${f.color}`);
    if (f.cursor_offset) assert.ok(m[1].includes(`cursor_offset = { ${f.cursor_offset.join(' ')} }`));
  }
  for (const p of ['garamond_16', 'garamond_24']) assert.ok(existsSync(`${GAME}/gfx/fonts/${p}.fnt`), `${p}.fnt is installed`);
});

test('ZIN chrome: a row whose item count drifts stops the cut', () => {
  const img = makeImg(40, 20);
  const paint = (x0, y0, x1, y1) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const o = (y * 40 + x) * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = 200; img.data[o + 3] = 255; } };
  paint(2, 2, 12, 8); paint(20, 2, 30, 8); paint(2, 12, 38, 18);
  const spec = { sheet: { id: 't', threshold: 14, minGutter: 4 }, rows: [{ row: 'a', items: [{ key: 'a1' }, { key: 'a2' }] }, { row: 'b', items: [{ key: 'b1' }] }] };
  const rows = cutSheet(img, spec);
  assert.deepEqual(rows[0].items.map(i => i.box), [{ x0: 2, y0: 2, x1: 12, y1: 8 }, { x0: 20, y0: 2, x1: 30, y1: 8 }]);
  assert.throws(() => cutSheet(img, { ...spec, rows: [{ row: 'a', items: [{ key: 'a1' }] }, spec.rows[1]] }), /row 1 \(a\) has 2 items/);
  assert.equal(outlineAlpha(img, 48).data[3], 0);
  assert.equal(outlineAlpha(img, 48).data[(2 * 40 + 2) * 4 + 3], 255);
});

test('ZIN chrome: the accepted sheet yields every sprite at its size, frame order and scale', async () => {
  const spec = loadChromeSpec(), chrome = await loadZinChrome(rawFile, spec);
  const byName = new Map(chrome.sprites.map(s => [s.name, s]));
  for (const n of ['GFX_zin_frame', 'GFX_zin_frame_banner_hall', 'GFX_zin_frame_chronicle', 'GFX_zin_button', 'GFX_zin_rule', 'GFX_zin_row', 'GFX_zin_tab_chancery', 'GFX_zin_meter_groove_chancery', 'GFX_zin_meter_fill_chancery', 'GFX_zin_meter_mark_chancery', 'GFX_zin_accent_court', 'GFX_zin_unknown_technology']) assert.ok(byName.has(n), n);
  for (const s of chrome.sprites) {
    const w = s.kind === 'frame' ? s.size[0] : s.size[0] * s.frames;
    assert.equal(s.img.w, w, `${s.name} width`); assert.equal(s.img.h, s.size[1], `${s.name} height`);
  }
  assert.equal(byName.get('GFX_zin_tab_chancery').frames, 3);
  assert.equal(byName.get('GFX_zin_row').frames, 2);
  // every multi-frame button and tab differs between its frames (check 17 rule)
  const diff = (s, i, j) => { const fw = s.img.w / s.frames; let d = 0, n = 0; for (let y = 0; y < s.img.h; y++) for (let x = 0; x < fw; x++) { const a = (y * s.img.w + i * fw + x) * 4, b = (y * s.img.w + j * fw + x) * 4; d += Math.abs(s.img.data[a] - s.img.data[b]); n++; } return d / n / 255; };
  for (const s of chrome.sprites.filter(x => x.frames > 1)) for (let i = 1; i < s.frames; i++) assert.ok(diff(s, 0, i) >= 0.03, `${s.name} frame ${i + 1} differs from frame 1`);
});
