// The technology tree window, interface/countrytechtreeview.gui (docs/specs/03_gameplay/07_industry_and_electronics_techs.md section 5.8):
// generated at build time from the installed file. The vanilla folder windows, their tabs and their item containers go; one window per
// ZIN technology folder comes in, with a gridbox for every root of the layout (lib/tech_layout.mjs; every gridbox sits at the folder
// origin), the era and year captions of the rows, the tab and the item containers: the small item for a technology that unlocks no
// equipment and the large equipment item (183 by 84, the installed infantry folder's) for one that does (owner decision K51).
// Everything else of the installed file (the info windows, the line and XOR items, the stat lists) stays.
// Without this file every technology logs "Found no grid box for tech" and no ZIN folder can be opened (Linux run integ_r3b: 213 lines).
//
//   techTreeGui(installed, { folders, layout, tabSprite, blankIcon })   -> the .gui text
//     installed   the installed countrytechtreeview.gui (latin1 text)
//     folders     the technology folders in tab order: [{ key }] (the ZIN folders and the kept industry_folder, electronics_folder)
//     layout      model.layout.folders of the technology module: { <folder>: { tiles, gridboxes, rows, width, height } }
//     tabSprite   folder key -> the sprite of its tab
//     blankIcon   the sprite that replaces the engine fallback GFX_technology_medium in the item templates
//   TECH_TREE_FOLDER_ITEM   the installed small item container every folder's small item is cloned from
//   TECH_TREE_LARGE_ITEM    the installed large equipment item container every ZIN folder's regular item is cloned from
//
// Pure and deterministic. A root without a gridbox, a folder without its window or a vanilla folder left behind throws.
import { SLOT, ORIGIN } from './tech_layout.mjs';

export const TECH_TREE_FOLDER_ITEM = 'techtree_infantry_folder_small_item';
export const TECH_TREE_LARGE_ITEM = 'techtree_infantry_folder_item';
// The kept folders keep their vanilla tab sprites and tutorial highlights.
const KEPT_TABS = { industry_folder: { sprite: 'GFX_industry_folder_tab', highlight: 'highlight_industry_folder', click: 'ui_research_tab_industry' }, electronics_folder: { sprite: 'GFX_techtree_engineering_tab', highlight: 'highlight_engineering_folder', click: 'ui_research_tab_engineering' } };
const TAB_X0 = 22, TAB_STEP = 89;

// The child blocks `key = { ... }` directly inside text[from, to): [{ key, start, end, name }] (end is after the closing brace).
export function childBlocks(text, from, to) {
  const out = [];
  let depth = 0, i = from;
  while (i < to) {
    const c = text[i];
    if (c === '#') { while (i < to && text[i] !== '\n') i++; continue; }
    if (c === '"') { i++; while (i < to && text[i] !== '"') i++; i++; continue; }
    if (c === '{') { depth++; i++; continue; }
    if (c === '}') { depth--; i++; continue; }
    if (depth === 0 && /[A-Za-z_]/.test(c) && (i === from || /[\s{}]/.test(text[i - 1]))) {
      const m = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{/.exec(text.slice(i, Math.min(to, i + 200)));
      if (m) {
        const open = i + m[0].length - 1;
        let d = 0, j = open;
        for (; j < to; j++) {
          const cj = text[j];
          if (cj === '#') { while (j < to && text[j] !== '\n') j++; continue; }
          if (cj === '"') { j++; while (j < to && text[j] !== '"') j++; continue; }
          if (cj === '{') d++;
          else if (cj === '}' && --d === 0) break;
        }
        if (j >= to) throw new Error(`tech tree gui: the block ${m[1]} at ${i} is not closed`);
        const body = text.slice(open + 1, j);
        const name = /^\s*name\s*=\s*"?([A-Za-z0-9_]+)"?/m.exec(childLess(body))?.[1] ?? null;
        out.push({ key: m[1], start: i, end: j + 1, name, open });
        i = j + 1;
        continue;
      }
    }
    i++;
  }
  return out;
}
// The text of a block body without its nested blocks (so `name` is the block's own).
function childLess(body) {
  let out = '', depth = 0;
  for (let i = 0; i < body.length; i++) { const c = body[i]; if (c === '{') depth++; else if (c === '}') depth--; else if (depth === 0) out += c; }
  return out;
}
const find = (blocks, name, what) => blocks.find(b => b.name === name) ?? (() => { throw new Error(`tech tree gui: the installed file has no ${what} ${name}`); })();

const T = n => '\t'.repeat(n);
const folderTitle = (f, d) => [`${T(d)}instantTextBoxType = {`, `${T(d + 1)}name = "${f}_title"`, `${T(d + 1)}position = { x = ${ORIGIN.x} y = 12 }`, `${T(d + 1)}font = "hoi_36header"`, `${T(d + 1)}text = "${f}"`, `${T(d + 1)}maxWidth = 900`, `${T(d + 1)}maxHeight = 40`, `${T(d + 1)}format = left`, `${T(d)}}`];
// A row caption sits in the left gutter beside its row (the band keys of data/technologies.json: zin_techtree_year_<row>): an era name
// for the Third Age and the early Fourth Age, Fourth Age years after that. Two lines fit beside a row; the gutter ends before the left
// wing of a large tile at column 0 (lib/tech_layout.mjs ITEM).
export const CAPTION_WIDTH = ORIGIN.x - 80;
const caption = (f, { y, band }, d) => [`${T(d)}instantTextBoxType = {`, `${T(d + 1)}name = "${f}_year_${band}"`, `${T(d + 1)}position = { x = 12 y = ${ORIGIN.y + y * SLOT + 10} }`, `${T(d + 1)}font = "hoi_20b"`, `${T(d + 1)}text = "zin_techtree_year_${band}"`, `${T(d + 1)}maxWidth = ${CAPTION_WIDTH}`, `${T(d + 1)}maxHeight = 50`, `${T(d + 1)}format = left`, `${T(d)}}`];
// A gridbox per root, every one at the folder origin and as large as the folder: a tile's slot is the same in every gridbox, so the
// connector from a second path parent in another gridbox lands where the slots say.
function gridbox(g, d) {
  return [`${T(d)}gridboxtype = {`, `${T(d + 1)}name = "${g.name}"`, `${T(d + 1)}position = { x = ${g.px} y = ${g.py} }`, `${T(d + 1)}size = { width = ${g.width} height = ${g.height} }`, `${T(d + 1)}slotsize = { width = ${g.slotsize} height = ${g.slotsize} }`, `${T(d + 1)}format = "${g.format}"`, `${T(d)}}`];
}
export function folderWindow(f, l) {
  const d = 2;
  return [`${T(d)}containerWindowType = {`, `${T(d + 1)}name = "${f}"`, `${T(d + 1)}position = { x=0 y=47 }`, `${T(d + 1)}size = { width = 100%% height = 100%% }`, `${T(d + 1)}margin = { top = 13 left = 13 bottom = 24 right = 25 }`,
    `${T(d + 1)}drag_scroll = { left middle }`, `${T(d + 1)}verticalScrollbar = "right_vertical_slider"`, `${T(d + 1)}horizontalScrollbar = "bottom_horizontal_slider"`, `${T(d + 1)}scroll_wheel_factor = 40`, '',
    `${T(d + 1)}background = {`, `${T(d + 2)}name = "Background"`, `${T(d + 2)}quadTextureSprite ="GFX_tiled_window_2b_border"`, `${T(d + 1)}}`, '',
    // The size filler gives the window its scroll extent; the board art of the folder is pending (docs/plans/zin-art/pending_from_integration.md).
    `${T(d + 1)}containerWindowType = {`, `${T(d + 2)}name = "${f}_size_filler"`, `${T(d + 2)}position = { x=0 y=0 }`, `${T(d + 2)}size = { width = ${l.width} height = ${l.height} min = { width = 100%% height = 100%% } }`, `${T(d + 1)}}`, '',
    ...folderTitle(f, d + 1), ...l.rows.flatMap(r => caption(f, r, d + 1)), '', ...l.gridboxes.flatMap(g => gridbox(g, d + 1)), `${T(d)}}`].join('\n');
}
function tabButton(f, i, sprite) {
  const kept = KEPT_TABS[f], x = TAB_X0 + TAB_STEP * i, d = 3;
  const L = [`${T(d)}buttonType = {`, `${T(d + 1)}name = "${f}_tab"`, `${T(d + 1)}position = { x = ${x} y = 0 }`, `${T(d + 1)}quadTextureSprite = "${kept ? kept.sprite : sprite}"`, `${T(d + 1)}frame = 1`];
  // A ZIN tab has no drawn label yet (its tab art is pending): the button says the folder's name.
  if (!kept) L.push(`${T(d + 1)}buttonText = "${f}"`, `${T(d + 1)}buttonFont = "hoi_18mbs"`);
  L.push(`${T(d + 1)}clicksound = ${kept ? kept.click : 'click_default'}`, `${T(d)}}`);
  if (kept) L.push(`${T(d)}iconType = {`, `${T(d + 1)}name = "${kept.highlight}"`, `${T(d + 1)}spriteType = "GFX_tutorial_research_folder_icon_glow"`, `${T(d + 1)}position = { x = ${x} y = 0 }`, `${T(d + 1)}hide = yes`, `${T(d + 1)}alwaystransparent = yes`, `${T(d)}}`);
  return L.join('\n');
}
// An item container of a ZIN folder: the installed small item under the folder's name.
const itemClone = (template, from, name) => template.replace(new RegExp(`name\\s*=\\s*"${from}"`), `name = "${name}"`);

// The parts of the installed file the generator replaces: the vanilla folder windows, the folder tabs and tutorial highlights, and the item
// containers of the vanilla folders (except the regular item of a kept folder). The UI check 8 (checks/ui_checks.mjs) excuses the names
// inside these parts and only these, since the vanilla folders no longer exist.
function vanillaParts(text) {
  const top = childBlocks(text, 0, text.length).find(b => b.key === 'guiTypes') ?? (() => { throw new Error('tech tree gui: no guiTypes block'); })();
  const topBlocks = childBlocks(text, top.open + 1, top.end - 1);
  const view = find(topBlocks, 'countrytechtreeview', 'window');
  const viewChildren = childBlocks(text, view.open + 1, view.end - 1);
  const vanillaFolders = viewChildren.filter(b => b.key === 'containerWindowType' && /folder$/.test(b.name ?? '') && b.name !== 'folder_tabs');
  const tabs = find(viewChildren, 'folder_tabs', 'container');
  const tabChildren = childBlocks(text, tabs.open + 1, tabs.end - 1).filter(b => b.key === 'buttonType' && /_tab$/.test(b.name ?? '') || b.key === 'iconType' && /^highlight_/.test(b.name ?? ''));
  const tb = find(topBlocks, TECH_TREE_FOLDER_ITEM, 'item container'), lb = find(topBlocks, TECH_TREE_LARGE_ITEM, 'item container');
  const vanillaNames = new Set(vanillaFolders.map(b => b.name));
  const itemFolder = n => { const m = /^techtree_(.+?)_(small_)?item$/.exec(n ?? ''); return m ? { folder: m[1], small: !!m[2] } : null; };
  const items = topBlocks.filter(b => { const it = b.key === 'containerWindowType' && itemFolder(b.name); return it && vanillaNames.has(it.folder) && !(KEPT_TABS[it.folder] && !it.small); });
  return { top, topBlocks, vanillaFolders, tabs, tabChildren, template: text.slice(tb.start, tb.end), largeTemplate: text.slice(lb.start, lb.end), items };
}
// The text of every part techTreeGui drops from the installed file.
export function droppedVanillaText(installed) {
  const text = installed.replace(/^﻿/, ''), v = vanillaParts(text);
  return [...v.vanillaFolders, ...v.tabChildren, ...v.items].map(b => text.slice(b.start, b.end)).join('\n');
}

export function techTreeGui(installed, { folders, layout, tabSprite, blankIcon = null }) {
  let text = installed.replace(/^﻿/, '');
  const { top, vanillaFolders, tabs, tabChildren, template, largeTemplate, items } = vanillaParts(text);
  let topBlocks;
  // Cut from the end, so earlier offsets stay valid.
  const cuts = [...vanillaFolders, ...tabChildren, ...items].sort((a, b) => b.start - a.start);
  // New text: the folder windows go where the first vanilla folder window stood, the tabs at the start of folder_tabs, the items at the end.
  const firstFolder = Math.min(...vanillaFolders.map(b => b.start));
  const windows = folders.map(f => { const l = layout[f.key]; if (!l) throw new Error(`tech tree gui: the layout has no folder ${f.key}`); return folderWindow(f.key, l); }).join('\n\n');
  const tabText = folders.map((f, i) => tabButton(f.key, i, tabSprite(f.key))).join('\n\n');
  // Every folder gets a small item (a technology that unlocks no equipment); a ZIN folder also gets the large equipment item, which the
  // engine gives a technology that unlocks equipment. The kept folders keep their installed regular items.
  const itemText = folders.flatMap(f => (KEPT_TABS[f.key] ? [[`${f.key}_small_item`, false]] : [[`${f.key}_item`, true], [`${f.key}_small_item`, false]]))
    .map(([n, large]) => `\t${large ? itemClone(largeTemplate, TECH_TREE_LARGE_ITEM, `techtree_${n}`) : itemClone(template, TECH_TREE_FOLDER_ITEM, `techtree_${n}`)}`).join('\n\n');
  const inserts = [{ at: firstFolder, text: `${windows.replace(/^\t+/, '')}\n\n\t\t` }, { at: tabs.open + 1, text: `\n${tabText}\n` }, { at: top.end - 1, text: `\n${itemText}\n` }];
  // Apply cuts and inserts together from the end of the file.
  const ops = [...cuts.map(c => ({ at: c.start, end: c.end, text: '' })), ...inserts.map(x => ({ at: x.at, end: x.at, text: x.text }))].sort((a, b) => b.at - a.at || (b.end - b.at) - (a.end - a.at));
  for (const o of ops) text = text.slice(0, o.at) + o.text + text.slice(o.end);
  // The installed file's placeholder texts, which the engine overwrites at run time, are not localisation keys: they are emptied. The
  // template icon of the items, which the engine replaces by GFX_<technology>_medium, names the mod's blank technology sprite instead of
  // the engine fallback GFX_technology_medium (the asset check: a fallback never stands where a picture should be).
  text = text.replace(/text\s*=\s*"(BABALKBLLALBLAL|name|Happy-Go-Lucky-Tank)"/g, 'text = ""');
  // The cuts leave runs of blank lines behind: one is kept.
  text = text.replace(/\n(?:[ \t]*\n){2,}/g, '\n\n');
  if (blankIcon) text = text.replace(/"GFX_technology_medium"/g, `"${blankIcon}"`);
  // Every root gridbox is in its folder's window, and no vanilla folder window is left.
  const after = childBlocks(text, 0, text.length).find(b => b.key === 'guiTypes');
  topBlocks = childBlocks(text, after.open + 1, after.end - 1);
  const v2 = find(topBlocks, 'countrytechtreeview', 'window');
  const windowsAfter = childBlocks(text, v2.open + 1, v2.end - 1).filter(b => b.key === 'containerWindowType' && /folder$/.test(b.name ?? '') && b.name !== 'folder_tabs');
  const want = new Set(folders.map(f => f.key));
  for (const w of windowsAfter) if (!want.has(w.name)) throw new Error(`tech tree gui: the vanilla folder window ${w.name} is left`);
  for (const f of folders) {
    const w = windowsAfter.find(x => x.name === f.key) ?? (() => { throw new Error(`tech tree gui: no window for ${f.key}`); })();
    const body = text.slice(w.start, w.end);
    for (const g of layout[f.key].gridboxes) if (!body.includes(`name = "${g.name}"`)) throw new Error(`tech tree gui: ${f.key} has no gridbox ${g.name}`);
  }
  return text;
}

// The gridboxes a .gui text gives each folder window of countrytechtreeview (for checks): Map folder -> Set of gridbox names.
export function folderGridboxes(text) {
  const out = new Map();
  const top = childBlocks(text, 0, text.length).find(b => b.key === 'guiTypes');
  if (!top) return out;
  const view = childBlocks(text, top.open + 1, top.end - 1).find(b => b.name === 'countrytechtreeview');
  if (!view) return out;
  for (const w of childBlocks(text, view.open + 1, view.end - 1)) {
    if (w.key !== 'containerWindowType' || !w.name || w.name === 'folder_tabs') continue;
    const names = new Set([...text.slice(w.start, w.end).matchAll(/gridbox[Tt]ype\s*=\s*\{\s*(?:#[^\n]*\n\s*)*name\s*=\s*"([A-Za-z0-9_]+)"/g)].map(m => m[1]));
    out.set(w.name, names);
  }
  return out;
}
