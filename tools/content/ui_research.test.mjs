// Lane W3 (UI overhaul): the Chronicle sprites and overrides of the focus tree, research and technology tree windows
// (modules/ui_research.mjs) and the technology tree window's tab row and titles (lib/tech_tree_gui.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GAME } from './lib/paths.mjs';
import { loadResearchUi, buildResearchSprites, overrideText, researchGfx, tabSprite, gateSprite } from './modules/ui_research.mjs';
import { techTreeGui, TAB_X0, TAB_STEP, TITLE_Y } from './lib/tech_tree_gui.mjs';
import { FOLDER_FILES } from './modules/technologies.mjs';
import { OVERRIDE_FILES } from './lib/ui_plan.mjs';

const spec = loadResearchUi();
const FOLDERS = Object.keys(FOLDER_FILES);
const GATES = ['rocket_site', 'mega_gun', 'nuclear_reactor', 'nuclear_reactor_heavy_water', 'commercial_reactor', 'fuel_silo', 'synthetic_refinery'].map(k => ({ key: `zin_tech_gate_${k}`, short: `gate_${k}` }));
const names = text => new Set([...text.matchAll(/name\s*=\s*"?([A-Za-z0-9_]+)"?/g)].map(m => m[1]));
const design = JSON.parse(readFileSync(new URL('./data/ui/design_system.json', import.meta.url), 'utf8'));

let built;
const sprites = async () => (built ??= await buildResearchSprites({ folders: FOLDERS, gates: GATES }));

test('Every folder of the technology tree and every Sealed Work has an emblem cell, and the cell subjects are recorded', () => {
  for (const f of FOLDERS) assert(spec.emblems.keys.includes(f), f);
  for (const g of GATES) assert(spec.emblems.keys.includes(g.short), g.short);
  for (const k of spec.emblems.keys) assert(spec.emblems.subjects[k], `${k} has a subject`);
  assert.equal(spec.emblems.keys.length, spec.emblems.cols * spec.emblems.rows);
});

test('The tabs are two-frame 182 x 61 pictures, the Sealed Works 64 x 64 medallions, and nothing is enlarged', async () => {
  const { sprites: list } = await sprites();
  for (const f of FOLDERS) {
    const s = list.find(x => x.name === tabSprite(f));
    assert(s, f);
    assert.deepEqual([s.img.w, s.img.h, s.frames], [182, 61, 2], f);
  }
  for (const g of GATES) {
    const s = list.find(x => x.name === gateSprite(g.key));
    assert.deepEqual([s.img.w, s.img.h], [64, 64], g.key);
    assert.equal(s.img.data[3], 0, `${g.key} corner is clear (round matte)`);
  }
  for (const s of list) for (const op of s.ops) { const m = /reduce ([\d.]+)/.exec(op); if (m) assert(Number(m[1]) <= 1, `${s.name}: ${op}`); }
  const gfx = researchGfx(list);
  for (const f of FOLDERS) assert(new RegExp(`name = "${tabSprite(f)}"\\n\\t\\ttexturefile = "[^"]+"\\n\\t\\tnoOfFrames = 2`).test(gfx), f);
});

test('The overrides keep every vanilla element name, swap only the listed sprites, and are on the closed list', () => {
  for (const [file, o] of Object.entries(spec.overrides)) {
    assert(OVERRIDE_FILES.includes(file), `${file} is on the closed list`);
    const installed = readFileSync(`${GAME}/${file}`, 'latin1'), out = overrideText(installed, o, file);
    assert.deepEqual([...names(out)].sort(), [...names(installed)].sort(), `${file} keeps its names`);
    for (const from of Object.keys(o.sprites)) {
      const [a, b] = [new RegExp(`"${from}"`, 'g'), new RegExp(`"${from}"`, 'g')];
      assert((installed.match(a) ?? []).length > (out.match(b) ?? []).length, `${file}: ${from} is swapped inside the window`);
    }
    for (const v of Object.values(o.fonts ?? {})) assert(design.fontRoles.window_title.includes(v.font), `${file}: ${v.font} is the window title face`);
  }
  // A missing element or sprite fails loudly.
  assert.throws(() => overrideText(readFileSync(`${GAME}/interface/nationalfocusview.gui`, 'latin1'), { windows: ['nationalfocusview'], sprites: { GFX_no_such_sprite: 'GFX_x' } }, 'x'));
  assert.throws(() => overrideText(readFileSync(`${GAME}/interface/nationalfocusview.gui`, 'latin1'), { windows: ['no_such_window'], sprites: {} }, 'x'));
});

test('The technology tree tab row: picture tabs on the 4 px grid, no two overlapping, every one with its tooltip, the title below the tabs', () => {
  const installed = readFileSync(`${GAME}/interface/countrytechtreeview.gui`, 'latin1');
  const layout = Object.fromEntries(FOLDERS.map(f => [f, { gridboxes: [], rows: [{ y: 0, band: 'start' }], width: 100, height: 100 }]));
  const gui = techTreeGui(installed, { folders: FOLDERS.map(key => ({ key })), layout, tabSprite, blankIcon: 'GFX_zin_technology_blank', board: 'GFX_zin_techtree_board' });
  const tabs = [...gui.matchAll(/buttonType = \{\s*name = "([a-z_]+)_tab"\s*position = \{ x = (\d+) y = 0 \}\s*quadTextureSprite = "([A-Za-z_]+)"\s*frame = 1\s*pdx_tooltip = "([a-z_]+)"/g)];
  assert.equal(tabs.length, FOLDERS.length);
  const [fw] = spec.tabs.frameSize;
  tabs.forEach((m, i) => {
    assert.equal(m[3], tabSprite(m[1]));
    assert.equal(m[4], m[1], 'the tooltip is the folder name key');
    assert.equal(Number(m[2]) % 4, 0, `${m[1]} on the grid`);
    if (i) assert(Number(m[2]) - Number(tabs[i - 1][2]) >= fw, `${m[1]} does not overlap its neighbour`);
  });
  assert.equal(TAB_X0 + TAB_STEP * (FOLDERS.length - 1) + fw <= 1280, true, 'the row fits 1280 px');
  assert(!/buttonText = "zin_/.test(gui), 'no tab carries a squeezed text label');
  assert(!/GFX_tiled_window_2b_border/.test(gui.match(/name = "zin_arms_folder"[^]*?gridbox|name = "zin_arms_folder"[^]*?\n\t\t\}/)[0]), 'the folder board is the generated plate');
  assert(47 + TITLE_Y >= 7 + spec.tabs.frameSize[1], 'the folder title starts below the tab row');
  for (const f of FOLDERS) {
    const face = name => gui.match(new RegExp(`name = "${name}"[\\s\\S]*?font = "([a-z0-9_]+)"`))[1];
    assert(design.fontRoles.window_title.includes(face(`${f}_title`)), `${f} title face`);
    assert(design.fontRoles.body.includes(face(`${f}_year_start`)), `${f} caption face`);
  }
});
