// UI overhaul lane W5: the event, news, pause-menu, options and Gathering Dark windows (modules/ui_dialogs.mjs).
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { GAME } from './lib/paths.mjs';
import { OVERRIDE_FILES } from './lib/ui_plan.mjs';
import { checkOverrides, checkLayoutGrid } from './checks/ui_checks.mjs';
import { loadDialogs, hollow, topWindows, replaceWindows, swapSprites, dialogsGfx, dialogOverrides, buildDialogs,
  EVENT_WINDOW, EVENT_WINDOW_LEADER, EVENT_WINDOW_NEWS, EVENT_OPTION_ENTRY, INGAME_MENU, TENSION_POPUP } from './modules/ui_dialogs.mjs';
import { makeImg } from './lib/fit.mjs';

const design = JSON.parse(readFileSync(new URL('./data/ui/design_system.json', import.meta.url), 'utf8'));
const game = existsSync(`${GAME}/interface/eventwindow.gui`);
const spec = loadDialogs();
const ZIN_BLOCKS = { EVENT_WINDOW, EVENT_WINDOW_LEADER, EVENT_WINDOW_NEWS, EVENT_OPTION_ENTRY, INGAME_MENU, TENSION_POPUP };

test('Dialogs: top-level windows are found by brace depth, comments and strings skipped, and replaced in place', () => {
  const text = 'guiTypes = {\n\t# a { comment\n\tcontainerWindowType = {\n\t\tname = "a"\n\t\ttext = "{"\n\t}\n\tcontainerWindowType = {\n\t\tname = "b"\n\t\tx = { y = 1 }\n\t}\n}\n';
  assert.deepEqual(topWindows(text).map(w => w.name), ['a', 'b']);
  const out = replaceWindows(text, { b: '\tcontainerWindowType = {\n\t\tname = "b"\n\t\tnew = yes\n\t}', a: '\tcontainerWindowType = {\n\t\tname = "a"\n\t}' });
  assert.deepEqual(topWindows(out).map(w => w.name), ['a', 'b']);
  assert.match(out, /new = yes/);
  assert.doesNotMatch(out, /text = "\{"/);
  assert.throws(() => replaceWindows(text, { c: 'x' }), /0 top-level windows named c/);
  const sw = swapSprites('guiTypes = {\n\tw = {\n\t\tname = "w"\n\t\tspriteType = "GFX_a"\n\t}\n\tv = {\n\t\tname = "v"\n\t\tquadTextureSprite ="GFX_a"\n\t}\n}\n', { GFX_a: 'GFX_b' }, ['v']);
  assert.equal(sw.n, 1);
  assert.match(sw.text, /spriteType = "GFX_a"[\s\S]*quadTextureSprite ="GFX_b"/);
});

test('Dialogs: a frame is hollowed inside its rim and nowhere else', () => {
  const img = makeImg(10, 8); img.data.fill(255);
  const h = hollow(img, 2);
  const a = (x, y) => h.data[(y * 10 + x) * 4 + 3];
  assert.equal(a(0, 0), 255); assert.equal(a(1, 4), 255); assert.equal(a(8, 7), 255);
  assert.equal(a(2, 2), 0); assert.equal(a(7, 5), 0);
  assert.equal(img.data[(2 * 10 + 2) * 4 + 3], 255, 'the input is not changed');
});

test('Dialogs: the ZIN layouts sit on the 4 px grid and use only role fonts', () => {
  const text = `guiTypes = {\n${Object.values(ZIN_BLOCKS).join('\n')}\n}\n`;
  const r = checkLayoutGrid({ files: new Map([['interface/zin_w5_layouts.gui', Buffer.from(text)]]), design });
  // the reading and event-title faces are the lane C2 Garamond aliases (1.19.4.1 has no bitmap font named garamond_16)
  const alias = /font hoi4_typewriter(16|22_inverted) has no role/;
  assert.deepEqual(r.problems.filter(p => !alias.test(p.message)).map(p => p.message), []);
  // design system §2.1: titles in the window-title face, reading text in Garamond with ink, options in the label face
  for (const w of [EVENT_WINDOW, EVENT_WINDOW_LEADER, EVENT_WINDOW_NEWS]) {
    assert.match(w, /name = "Title"[\s\S]*?font = "hoi4_typewriter22_inverted"/);
    assert.match(w, /name = "Description"[\s\S]*?font = "hoi4_typewriter16"\n\t+text_color_code = "b"/);
  }
  assert.match(TENSION_POPUP, /name = "window_name"[\s\S]*?font = "hoi_24header"/);
  assert.match(EVENT_OPTION_ENTRY, /font = "hoi_16mbs"/);
  for (const [k, w] of Object.entries(ZIN_BLOCKS)) assert.equal((w.match(/\{/g) ?? []).length, (w.match(/\}/g) ?? []).length, `${k} braces`);
});

test('Dialogs: every sprite a ZIN layout names is defined in zin_dialogs.gfx or by vanilla', () => {
  const ours = new Set(spec.sprites.map(s => s.name));
  const named = new Set(Object.values(ZIN_BLOCKS).join('\n').match(/GFX_zin_[a-z_]+/g));
  for (const n of named) assert.ok(ours.has(n), `${n} is in data/ui/dialogs.json`);
  // no clipboard piece, paper clip or vanilla window tile is drawn by the rebuilt windows
  for (const w of [EVENT_WINDOW, EVENT_WINDOW_LEADER, EVENT_WINDOW_NEWS, EVENT_OPTION_ENTRY, INGAME_MENU, TENSION_POPUP]) {
    assert.doesNotMatch(w, /GFX_event_report_|GFX_event_pic_clip|GFX_paper_clip_event|GFX_event_news_bg|GFX_event_option_entry|GFX_tiled_window|GFX_tiled_plain_bg|GFX_main_lobby_button|GFX_world_tension_bg/);
  }
  const gfx = dialogsGfx(spec.sprites.map(s => ({ ...s, texture: `${spec.dir}/${s.texture}`, frames: s.kind === 'button' ? s.cells.length : 1 })));
  assert.match(gfx, /corneredTileSpriteType = \{\n\t\tname = "GFX_zin_event_window"\n\t\tsize = \{ x = 192 y = 192 \}\n\t\ttexturefile = "gfx\/interface\/zin\/dialogs\/event_window.dds"\n\t\tborderSize = \{ x = 32 y = 32 \}/);
  assert.match(gfx, /name = "GFX_zin_menu_button"\n\t\ttexturefile = "[^"]+"\n\t\tnoOfFrames = 3/);
  assert.equal((gfx.match(/\{/g) ?? []).length, (gfx.match(/\}/g) ?? []).length);
});

test('Dialogs: the pause menu shows six buttons and two links; the rest stay named but hidden below the window', () => {
  const visible = [...INGAME_MENU.matchAll(/name = "(menu_[a-z_]+_button)"\n\t\t\tposition = \{ x = 16 y = (\d+) \}/g)].filter(m => Number(m[2]) < 332).map(m => m[1]);
  assert.deepEqual(visible, ['menu_load_button', 'menu_save_button', 'menu_gamesettings_button', 'menu_resign_button', 'menu_quit_button', 'menu_close_button']);
  for (const n of ['menu_playthrough_stats_button', 'menu_playthrough_stats_button_star', 'menu_wiki_button', 'achievements_button', 'forum_button', 'discord_button', 'second_row']) {
    assert.match(INGAME_MENU, new RegExp(`name = "${n}"[^}]*?y = 2000 \\}[\\s\\S]*?hide = yes`), `${n} is hidden`);
  }
  assert.doesNotMatch(INGAME_MENU.slice(INGAME_MENU.indexOf('"homepage_button"'), INGAME_MENU.indexOf('"forum_button"')), /hide = yes/, 'homepage and privacy stay');
  assert.match(INGAME_MENU, /name = "menu_close_button"[\s\S]*?shortcut = "ESCAPE"/);
});

test('Dialogs: the overrides keep every vanilla element name and are on the closed list', { skip: !game && 'no installed game' }, () => {
  const files = dialogOverrides();
  assert.deepEqual([...files.keys()].sort(), ['interface/eventwindow.gui', 'interface/ingamemenu.gui', 'interface/settings.gui', 'interface/worldtensionwindowpopup.gui']);
  for (const f of files.keys()) assert.ok(OVERRIDE_FILES.includes(f), `${f} is on the closed list`);
  const r = checkOverrides({ files: new Map([...files].map(([k, v]) => [k, Buffer.from(v, 'latin1')])) });
  assert.deepEqual(r.problems.map(p => p.message), []);
  assert.equal(r.notes.checked, 4);
  const ev = files.get('interface/eventwindow.gui');
  assert.deepEqual(topWindows(ev).map(w => w.name), ['EventWindow', 'EventWindow_Operative', 'EventWindow_leader', 'EventWindow_News', 'event_option_entry']);
  const menu = files.get('interface/ingamemenu.gui');
  assert.doesNotMatch(menu, /GFX_load_save_top_screen|GFX_load_save_bottom|GFX_no_frame_special_bg/, 'load and save draw neutral pieces');
  const st = files.get('interface/settings.gui');
  assert.doesNotMatch(st, /GFX_settings_tabs_bottom|GFX_generic_bg_417/);
  const vst = readFileSync(`${GAME}/interface/settings.gui`, 'latin1');
  assert.equal(st.match(/GFX_zin_settings_row/g).length, vst.match(/"GFX_generic_bg_417"/g).length, 'every options row draws the neutral row');
});

test('Dialogs: every texture is cut from an accepted sheet, at its declared size, never enlarged', { skip: !game && 'no installed game' }, async () => {
  const files = new Map(), staged = { add: (r, b) => files.set(r, b) };
  const r = await buildDialogs(staged);
  assert.equal(r.counts.textures, spec.sprites.length);
  const manifest = JSON.parse(files.get('art/source/dialogs_manifest.json').toString());
  for (const s of r.sprites) {
    const frames = s.kind === 'button' ? s.cells.length : 1, [w, h] = s.kind === 'slice' ? [s.crop[2], s.crop[3]] : [s.size[0] * frames, s.size[1]];
    assert.deepEqual([s.img.w, s.img.h], [w, h], `${s.name} size`);
    const line = manifest.files.find(f => f.out === s.texture);
    assert.ok(line && /^art\/source\/ui\/reskin\/ui-[a-z-]+\.png$/.test(line.source) && line.sourceSha256.length === 64, `${s.name} lineage`);
    for (const op of line.ops) { const m = /^scale ([\d.]+)$/.exec(op); if (m) assert.ok(Number(m[1]) <= 1, `${s.name}: ${op}`); }
    assert.ok(files.has(s.texture), `${s.texture} is staged`);
  }
  // a hollow frame is transparent inside its rim and opaque on it
  const pf = r.sprites.find(s => s.name === 'GFX_zin_event_picture_frame').img, a = (x, y) => pf.data[(y * pf.w + x) * 4 + 3];
  assert.equal(a(2, 2), 255); assert.equal(a(113, 96), 0);
  assert.equal(a(8 + 210 - 1, 8 + 176 - 1), 0, 'the 210 x 176 picture shows whole');
});
