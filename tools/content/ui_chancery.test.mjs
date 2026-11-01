// UI overhaul lane W2: the Chancery sprites and .gui sprite swaps of politics, diplomacy, decisions, the peace conference and the
// diplomatic popup, the realm's roots and sign in the politics view, and the league emblems (modules/ui_chancery.mjs, modules/faction_art.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { GAME } from './lib/paths.mjs';
import { OVERRIDE_FILES } from './lib/ui_plan.mjs';
import { countryTable } from './lib/roster.mjs';
import { topWindows } from './modules/ui_dialogs.mjs';
import { loadChancery, swapSpriteNames, chanceryOverrides, chanceryGfx, realmLore, realmSloc, realmLocalisation, loreKey, currentMonths, REALM_GUI_TEXT, REALM_SCRIPTED_GUI_TEXT } from './modules/ui_chancery.mjs';
import { emblemImages, sheetOf } from './modules/faction_art.mjs';
import { makeImg } from './lib/fit.mjs';

const spec = loadChancery();
const haveGame = existsSync(`${GAME}/interface/countrypoliticsview.gui`);
const names = text => [...text.replace(/#[^\n]*/g, '').matchAll(/\bname\s*=\s*"?([A-Za-z0-9_]+)"?/g)].map(m => m[1]);
const strip = (text, values) => text.replace(/#[^\n]*/g, '').trimStart().replace(new RegExp(`"?(?:${values.join('|')})(?![A-Za-z0-9_])"?`, 'g'), 'SPRITE');

test('a sprite name is swapped only as a whole word', () => {
  const t = 'a = { quadTextureSprite ="GFX_tiled_window" }\nb = { spriteType = "GFX_tiled_window2_1b_border" }\nc = { spriteType = GFX_tiled_windowX }';
  const r = swapSpriteNames(t, { GFX_tiled_window: 'GFX_a', GFX_tiled_window2_1b_border: 'GFX_b' });
  assert.match(r.text, /"GFX_a"/); assert.match(r.text, /"GFX_b"/); assert.match(r.text, /GFX_tiled_windowX/);
  assert.deepEqual(r.counts, { GFX_tiled_window: 1, GFX_tiled_window2_1b_border: 1 });
});

test('every override is in the closed override list and every swap target is a defined Chancery sprite', () => {
  for (const rel of Object.keys(spec.overrides)) assert(OVERRIDE_FILES.includes(rel), rel);
  const defined = new Set(spec.sprites.map(s => s.name));
  const emblems = new Set(JSON.parse(readFileSync(new URL('./data/faction_art_cells.json', import.meta.url), 'utf8')).sheets.flatMap(s => s.keys).map(k => `GFX_zin_faction_${k}`));
  for (const [from, to] of Object.entries(spec.swaps)) { assert(defined.has(to) || emblems.has(to), `${from} -> ${to}`); assert(!defined.has(from)); }
  const gfx = chanceryGfx(spec.sprites.map(s => ({ ...s, texture: `${spec.dir}/${s.texture}` })));
  for (const s of spec.sprites) assert(gfx.includes(`name = "${s.name}"`), s.name);
  assert.match(gfx, /name = "GFX_zin_cha_idea_entry"\n\t\ttexturefile = "[^"]+"\n\t\tnoOfFrames = 2\n\t}/, 'a strip carries its frames without the button effect');
});

test('the overrides keep every vanilla element name and position; only sprite names change', { skip: !haveGame }, () => {
  const { files, counts } = chanceryOverrides(spec);
  const targets = Object.values(spec.swaps), sources = Object.keys(spec.swaps);
  for (const [rel, text] of files) {
    const vanilla = readFileSync(`${GAME}/${rel}`, 'latin1');
    assert.deepEqual(names(text), names(vanilla), `${rel}: element names`);
    const only = spec.overrides[rel].windows;
    const scope = t => (only ? topWindows(t).filter(w => only.includes(w.name)).map(w => t.slice(w.start, w.end)).join('\n') : t);
    assert.equal(strip(scope(text), targets), strip(scope(vanilla), sources), `${rel}: everything but the swapped sprite names is vanilla`);
    assert(Object.keys(counts[rel]).length > 0, rel);
  }
  // The popup file changes inside diplomacy_standard_popup_window only.
  const popup = files.get('interface/popupwindow.gui'), vanilla = readFileSync(`${GAME}/interface/popupwindow.gui`, 'latin1');
  const a = topWindows(popup), b = topWindows(vanilla);
  for (const w of b) if (w.name !== 'diplomacy_standard_popup_window') assert.equal(popup.slice(a.find(x => x.name === w.name).start, a.find(x => x.name === w.name).end), vanilla.slice(w.start, w.end), w.name);
  // No window of the five files still draws a shared texture this lane replaced.
  for (const [rel, text] of files) if (rel !== 'interface/popupwindow.gui') for (const s of sources) assert(!new RegExp(`(?:spriteType|quadTextureSprite)\\s*=\\s*"?${s}(?![A-Za-z0-9_])`).test(text.replace(/#[^\n]*/g, '')), `${rel} still draws ${s}`);
});

test('every realm has its roots and sign, chosen by original tag, with a fallback', () => {
  const realms = realmLore(countryTable());
  assert.equal(realms.length, 155);
  const sloc = realmSloc(realms), loc = realmLocalisation(realms);
  assert.equal((sloc.match(/original_tag = /g) ?? []).length, realms.length);
  assert.match(sloc, /text = \{\n\t\tlocalisation_key = zin_realm_lore_none\n\t\}\n\}/);
  for (const r of realms) { assert(loc[loreKey(r.tag)].startsWith('The Sign\n'), r.tag); assert(loc[loreKey(r.tag)].includes(currentMonths(r.roots)), r.tag); assert(!/[§$£@]/.test(loc[loreKey(r.tag)]), r.tag); }
  // A former month name used as a month shows as its god-month; the season word stays.
  assert.equal(currentMonths('the whale comes in Thaw; when the Thaw comes; 3 Harvest 4A 1750'), 'the whale comes in Lumae; when the Thaw comes; 3 Aurlan 4A 1750');
  assert.equal(loc.zin_politics_realm_text, '[ROOT.GetZinRealmLore]');
  assert(!/[§£]/.test(sloc), 'no format characters in scripted localisation');
});

test('the roots and sign windows match their scripted GUIs and sit on the 4 px grid', () => {
  for (const w of ['zin_politics_realm_window', 'zin_politics_realm_page_window']) { assert(REALM_GUI_TEXT.includes(`name = "${w}"`), w); assert(REALM_SCRIPTED_GUI_TEXT.includes(`window_name = "${w}"`), w); }
  for (const b of ['zin_politics_realm_toggle', 'zin_politics_realm_close']) { assert(REALM_GUI_TEXT.includes(`name = "${b}"`), b); assert(REALM_SCRIPTED_GUI_TEXT.includes(`${b}_click`), b); }
  assert.equal((REALM_SCRIPTED_GUI_TEXT.match(/parent_window_token = politics_tab/g) ?? []).length, 2);
  for (const m of REALM_GUI_TEXT.matchAll(/\b(x|y|width|height) = (-?\d+)\b(?!%)/g)) assert.equal(Number(m[2]) % 4, 0, `${m[1]} = ${m[2]}`);
});

test('league emblems: one per league and spare key, two frames of 100 and a 32 px miniature', async () => {
  const cells = JSON.parse(readFileSync(new URL('./data/faction_art_cells.json', import.meta.url), 'utf8'));
  const diplo = JSON.parse(readFileSync(new URL('./data/diplomacy.json', import.meta.url), 'utf8'));
  const want = [...diplo.factions.map(f => f.key), ...Array.from({ length: diplo.spareIcons ?? 10 }, (_, i) => `spare_${i + 1}`)];
  // a null cell is retired on its sheet (drawn, not shipped); every other cell is one key
  assert.deepEqual(cells.sheets.flatMap(s => s.keys).filter(k => k !== null).sort(), want.sort());
  assert.equal(sheetOf(cells.sheets[0]).matte, 'outline');
  const cell = makeImg(60, 80, Buffer.alloc(60 * 80 * 4, 200));
  const { strip: s, mini } = await emblemImages(cell);
  assert.deepEqual([s.w, s.h, mini.w, mini.h], [200, 100, 32, 32]);
});
