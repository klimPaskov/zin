// Focus tree, research, technology tree and doctrine windows (UI overhaul lane W3, docs/plans/ui_overhaul/02_plan.md phase 2; design
// system docs/specs/07_interface/07_design_system.md §1.4, §2.1, §4.2, §5.2, §7; K69, K70: these windows are Chronicle).
//
//   buildResearchUi(staged, { folders, gates, provenance, rawPath, game })  -> { sprites, tabs, gates, overrides }
//     folders   the technology folders in tab order ([key]); each gets a two-frame tab sprite tabSprite(key)
//     gates     the grant-only gate technologies of the technology module ([{ key, short }]); each gets GFX_<key>_medium
//
// Sprites (interface/zin_research_ui.gfx, textures under data/ui/research_ui.json `dir`), all from generated art:
//   GFX_zin_research_*        Chronicle chrome cut from the accepted lane C1 sheet ui-chrome-chronicle (lib/fit.mjs frame_tile)
//   GFX_zin_techtree_tab_<f>  a folder tab, 182 x 61, two frames: the folder's engraved emblem (research-emblems-02) placed on the C1
//                             selected and plain tab plates (frame 1 selected, frame 2 the others, as the vanilla files order them)
//   GFX_<gate>_medium         a Sealed Work medallion, 64 x 64 round (the technology family size)
//   GFX_zin_techtree_board    the technology tree board, the generated plate research-board-techtree (design system §5.2 rule 5)
//   GFX_zin_focus_board       the focus tree board, the accepted plate ui-focus-board, tiled (the vanilla corners stretch into streaks)
// Overrides (closed list of lib/ui_plan.mjs OVERRIDE_FILES): the installed vanilla file with sprite names swapped inside the named
// windows and the window titles set to the window title face. Every element name and position is vanilla (builder check 8).
// The lineage of every texture (sheet, sha256, cell, ops) is art/source/research_ui_manifest.json.
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { GAME, rawFile, provenanceFile } from '../lib/paths.mjs';
import { runFit, loadImage, makeImg } from '../lib/fit.mjs';
import { dds, fromRaw } from '../lib/raster.mjs';
import { findRegionsAdaptive } from '../lib/sheets.mjs';
import { acceptance } from './presentation.mjs';
import { readSheetCells, loadSheets, SHEET_RAW_DIR } from './ui_reskin.mjs';

export const RESEARCH_UI_FILE = fileURLToPath(new URL('../data/ui/research_ui.json', import.meta.url));
export const RESEARCH_UI_GFX = 'interface/zin_research_ui.gfx';
export const RESEARCH_UI_MANIFEST = 'art/source/research_ui_manifest.json';
export const ART_DIR = 'research_ui';
export const loadResearchUi = (file = RESEARCH_UI_FILE) => JSON.parse(readFileSync(file, 'utf8'));
export const tabSprite = folder => `GFX_zin_techtree_tab_${folder}`;
export const gateSprite = gate => `GFX_${gate}_medium`;
const sha256 = b => createHash('sha256').update(b).digest('hex');
const pair = v => (Array.isArray(v) ? v : [v, v]);
const MEDAL_INSET = 4;

// The round matte of a medallion: a circle of opaque pixels with a one-pixel antialiased edge (as the technology and doctrine art).
export function roundMask(img) {
  const { w, h } = img, out = makeImg(w, h, Buffer.from(img.data));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = ((x + 0.5) / w) * 2 - 1, dy = ((y + 0.5) / h) * 2 - 1, d = Math.sqrt(dx * dx + dy * dy);
    const a = d <= 0.96 ? 255 : d >= 1 ? 0 : Math.round((255 * (1 - d)) / 0.04);
    out.data[(y * w + x) * 4 + 3] = Math.min(out.data[(y * w + x) * 4 + 3], a);
  }
  return out;
}
const sharpOf = img => sharp(img.data, { raw: { width: img.w, height: img.h, channels: 4 } });
async function imgOf(s) { const { data, info } = await s.ensureAlpha().raw().toBuffer({ resolveWithObject: true }); return makeImg(info.width, info.height, data); }
// One medallion of an accepted emblem sheet at `size`, cut 4 px inside its detected disc and masked round.
async function medallion(file, region, size) {
  const b = region;
  const img = await imgOf(sharp(file).removeAlpha().extract({ left: b.x0 + MEDAL_INSET, top: b.y0 + MEDAL_INSET, width: b.x1 - b.x0 - 2 * MEDAL_INSET, height: b.y1 - b.y0 - 2 * MEDAL_INSET }).resize(size, size, { fit: 'fill', kernel: 'lanczos3' }));
  return roundMask(img);
}
// Places a straight-alpha picture over a plate (source-over); the result keeps the plate's alpha.
async function placeOver(plate, pic, x, y) {
  const png = await sharpOf(pic).png().toBuffer();
  return imgOf(sharpOf(plate).composite([{ input: png, left: x, top: y }]));
}
// Frames side by side.
function strip(frames) {
  const w = frames[0].w, h = frames[0].h, out = makeImg(w * frames.length, h);
  frames.forEach((f, i) => { for (let y = 0; y < h; y++) f.data.copy(out.data, (y * out.w + i * w) * 4, y * w * 4, (y + 1) * w * 4); });
  return out;
}

function accepted(lines, rel, rawPath) {
  const file = rawPath(rel);
  if (!file || !existsSync(file)) throw new Error(`research ui: no raw ${rel}`);
  const bytes = readFileSync(file), acc = acceptance(lines, rel, bytes);
  if (!acc.ok) throw new Error(`research ui: ${rel} is not accepted (${acc.why})`);
  return { file, rel, sha: acc.sha, bytes };
}

export async function buildResearchSprites({ spec = loadResearchUi(), folders, gates, provenance, rawPath = rawFile, sheets = loadSheets() }) {
  const lines = provenance ?? (existsSync(provenanceFile()) ? readFileSync(provenanceFile(), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : []);
  const out = [], sources = new Map();
  const src = (s, rel) => { sources.set(rel, s); return { source: `art/source/${rel}`, sourceSha256: s.sha }; };
  // Chronicle chrome from the C1 sheet.
  const chromeRel = `${SHEET_RAW_DIR}/${spec.chromeSheet}.png`, chrome = accepted(lines, chromeRel, rawPath);
  const sheet = sheets.get(spec.chromeSheet), cells = await readSheetCells(sheet, chrome.file);
  const cellOf = k => cells.get(k) ?? (() => { throw new Error(`research ui: no cell ${spec.chromeSheet}.${k}`); })();
  const borderOf = (k, c) => Math.max(1, Math.round((sheet.cells.find(x => x.key === k)?.border ?? sheet.cellBorder ?? 0.06) * Math.min(c.w, c.h)));
  for (const s of spec.chrome) {
    if (s.kind === 'button') {
      // One plate per frame, side by side (frame 1 selected).
      const frames = [];
      for (const k of s.cells) { const cc = cellOf(k); frames.push(await runFit('frame_tile', [cc], { width: s.size[0], height: s.size[1] }, { frame: s.frame, cellBorder: borderOf(k, cc), seed: `${s.texture}_${k}` })); }
      out.push({ ...s, frames: frames.length, texture: `${spec.dir}/${s.texture}`, img: strip(frames.map(f => f.img)), ops: frames.flatMap((f, i) => [`frame ${i + 1} ${s.cells[i]}: ${f.ops.join('; ')}`]), ...src(chrome, chromeRel), cellKeys: s.cells });
      continue;
    }
    const [w, h] = s.size, c = cellOf(s.cells[0]);
    const r = await runFit('frame_tile', [c], { width: w, height: h, ...(s.kind === 'cornered' ? { borderSize: pair(s.border) } : {}) }, { frame: s.frame, cellBorder: borderOf(s.cells[0], c), seed: s.texture });
    out.push({ ...s, texture: `${spec.dir}/${s.texture}`, img: r.img, ops: r.ops, ...src(chrome, chromeRel), cellKeys: s.cells });
  }
  // Emblems: folder tabs and Sealed Works.
  const emRel = `${ART_DIR}/${spec.emblems.sheet}.png`, em = accepted(lines, emRel, rawPath);
  const found = await findRegionsAdaptive(em.file, spec.emblems.keys.length, { cols: spec.emblems.cols, rows: spec.emblems.rows, aspect: [0.75, 1.33], minAreaFraction: 0.25 });
  if (!found.ok) throw new Error(`research ui: ${emRel}: found ${found.found ?? '?'} medallions, expected ${spec.emblems.keys.length}`);
  const regionOf = key => { const i = spec.emblems.keys.indexOf(key); if (i < 0) throw new Error(`research ui: no emblem for ${key}`); return { region: found.regions[i], cell: i }; };
  const [tw, th] = spec.tabs.frameSize, plates = [];
  for (const k of spec.tabs.plates) { const c = cellOf(k); plates.push(await runFit('frame_tile', [c], { width: tw, height: th }, { frame: spec.tabs.frame, cellBorder: borderOf(k, c), seed: `tab_${k}` })); }
  for (const f of folders) {
    const { region, cell } = regionOf(f), pic = await medallion(em.file, region, spec.tabs.emblem);
    const x = Math.round((tw - pic.w) / 2), y = Math.round((th - pic.h) / 2);
    const frames = await Promise.all(plates.map(p => placeOver(p.img, pic, x, y)));
    out.push({ name: tabSprite(f), kind: 'button', frames: frames.length, texture: `${spec.dir}/tab_${f}.dds`, img: strip(frames), ops: [...plates.flatMap((p, i) => [`frame ${i + 1} ${spec.tabs.plates[i]}: ${p.ops.join('; ')}`]), `emblem cell ${cell} cut ${MEDAL_INSET}px inside, lanczos3 ${pic.w}x${pic.h}, round matte, placed at ${x},${y}`], ...src(chrome, chromeRel), emblemSource: `art/source/${emRel}`, emblemSha256: em.sha, cellKeys: spec.tabs.plates, emblemCell: cell });
  }
  sources.set(emRel, em);
  for (const g of gates) {
    const { region, cell } = regionOf(g.short), pic = await medallion(em.file, region, spec.gate.size);
    out.push({ name: gateSprite(g.key), kind: 'sprite', texture: `${spec.dir}/${g.short}.dds`, img: pic, ops: [`cell ${cell} cut ${MEDAL_INSET}px inside`, `lanczos3 ${pic.w}x${pic.h}`, 'round matte'], source: `art/source/${emRel}`, sourceSha256: em.sha, cellKeys: [String(cell)] });
  }
  // The boards of the technology tree and the focus tree: generated plates (design system §5.2 rule 5), tiled by the engine.
  for (const b of spec.boards) {
    const board = accepted(lines, b.source, rawPath);
    const r = await runFit('frame_tile', [await loadImage(board.file)], { width: b.size[0], height: b.size[1], borderSize: pair(b.border) }, { frame: b.frame, cellBorder: b.cellBorder, seed: b.texture });
    out.push({ name: b.name, kind: 'cornered', size: b.size, border: b.border, texture: `${spec.dir}/${b.texture}`, img: r.img, ops: r.ops, ...src(board, b.source), cellKeys: ['plate'] });
  }
  return { sprites: out, sources };
}

export function researchGfx(sprites) {
  const blocks = sprites.map(s => {
    if (s.kind === 'cornered') { const [bx, by] = pair(s.border); return `\tcorneredTileSpriteType = {\n\t\tname = "${s.name}"\n\t\tsize = { x = ${s.size[0]} y = ${s.size[1]} }\n\t\ttexturefile = "${s.texture}"\n\t\tborderSize = { x = ${bx} y = ${by} }\n\t\ttilingCenter = yes\n\t}`; }
    const extra = s.kind === 'button' ? `\n\t\tnoOfFrames = ${s.frames}` : '';
    return `\tspriteType = {\n\t\tname = "${s.name}"\n\t\ttexturefile = "${s.texture}"${extra}\n\t}`;
  });
  return `# Generated by the ZIN content builder (modules/ui_research.mjs, UI overhaul lane W3): Chronicle sprites of the focus tree, research and\n# technology tree windows, the technology folder tabs and the Sealed Works (data/ui/research_ui.json).\nspriteTypes = {\n${blocks.join('\n')}\n}\n`;
}

// ==================================================================================================== overrides
// The text span of the top-level window `name` of a .gui file (inside guiTypes); throws unless exactly one exists.
function windowSpan(text, name) {
  const hits = [];
  const re = new RegExp(`\\n\\t[A-Za-z]+Type\\s*=\\s*\\{\\s*\\n\\t\\tname\\s*=\\s*"${name}"`, 'g');
  for (const m of text.matchAll(re)) hits.push(m.index);
  if (hits.length !== 1) throw new Error(`research ui: ${hits.length} top-level windows named ${name}`);
  const start = hits[0] + 1;
  let depth = 0, i = text.indexOf('{', start);
  for (; i < text.length; i++) { const c = text[i]; if (c === '#') { while (i < text.length && text[i] !== '\n') i++; continue; } if (c === '{') depth++; else if (c === '}' && --depth === 0) break; }
  return [start, i + 1];
}
// Sets `key = value` lines of the element named `name` (its own lines, before its first child block).
function setOwn(text, name, values) {
  const at = text.search(new RegExp(`name\\s*=\\s*"${name}"`));
  if (at < 0 || text.slice(at + 1).search(new RegExp(`name\\s*=\\s*"${name}"`)) >= 0) throw new Error(`research ui: element ${name} is not unique`);
  // The element's own lines: from its name to its closing brace, the lines that start at the element's depth (not inside a child or
  // an inline block such as position = { ... }).
  const lines = [];
  let depth = 0, i = at, lineStart = at, lineDepth = 0;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === '\n') { lines.push([lineStart, i, lineDepth]); lineStart = i + 1; lineDepth = depth; continue; }
    if (c === '{') depth++;
    else if (c === '}') { if (depth === 0) break; depth--; }
  }
  const done = new Set();
  let out = text;
  for (const [a, b, d] of lines.reverse()) {
    if (d !== 0) continue;
    for (const [k, v] of Object.entries(values)) {
      const re = new RegExp(`^([ \\t]*${k}\\s*=\\s*)("[^"]*"|[^\\s}]+)`), line = out.slice(a, b);
      if (re.test(line)) { out = out.slice(0, a) + line.replace(re, `$1${typeof v === 'number' ? v : `"${v}"`}`) + out.slice(b); done.add(k); }
    }
  }
  for (const k of Object.keys(values)) if (!done.has(k)) throw new Error(`research ui: ${name} has no ${k}`);
  return out;
}
export function overrideText(installed, o, file) {
  let text = installed.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  for (const w of o.windows) {
    const [a, b] = windowSpan(text, w);
    let part = text.slice(a, b);
    for (const [from, to] of Object.entries(o.sprites)) {
      const re = new RegExp(`"${from}"`, 'g');
      if (!re.test(part)) throw new Error(`research ui: ${file} ${w} draws no ${from}`);
      part = part.replace(re, `"${to}"`);
    }
    text = text.slice(0, a) + part + text.slice(b);
  }
  for (const [name, values] of Object.entries(o.fonts ?? {})) text = setOwn(text, name, values);
  // Placeholder texts the engine overwrites at run time are not localisation keys: emptied (as the technology tree writer does).
  for (const t of o.placeholderTexts ?? []) {
    const re = new RegExp(`(\\btext\\s*=\\s*)"${t}"`, 'g');
    if (!re.test(text)) throw new Error(`research ui: ${file} has no placeholder text ${t}`);
    text = text.replace(re, '$1""');
  }
  // Template sprites the engine replaces (the focus icon of an item): the mod's blank, never the engine fallback (asset check FALLBACK_HIT).
  for (const [from, to] of Object.entries(o.templateSprites ?? {})) {
    const re = new RegExp(`"${from}"`, 'g');
    if (!re.test(text)) throw new Error(`research ui: ${file} names no ${from}`);
    text = text.replace(re, `"${to}"`);
  }
  return `# ${file}: generated by the ZIN content builder (modules/ui_research.mjs, UI overhaul lane W3) from the installed vanilla file.\n# The windows draw their own Chronicle sprites; every vanilla element name and position is kept so the engine binds each control.\n${text}`;
}

export async function buildResearchUi(staged, { folders, gates, provenance, rawPath, game = GAME, spec = loadResearchUi() } = {}) {
  const { sprites, sources } = await buildResearchSprites({ spec, folders, gates, provenance, rawPath });
  const manifest = [];
  for (const s of sprites) {
    const data = dds(fromRaw(s.img.data, s.img.w, s.img.h));
    staged.add(s.texture, data);
    manifest.push({ out: s.texture, sprite: s.name, source: s.source, sourceSha256: s.sourceSha256, cells: s.cellKeys, ...(s.emblemSource ? { emblemSource: s.emblemSource, emblemSha256: s.emblemSha256, emblemCell: s.emblemCell } : {}), ops: s.ops, size: [s.img.w, s.img.h], sha256: sha256(data) });
  }
  // This lane's own sources; the C1 chrome sheet is staged by the reskin step.
  for (const [rel, s] of [...sources].sort(([a], [b]) => a.localeCompare(b, 'en'))) if (rel.startsWith(`${ART_DIR}/`) && !staged.files?.has(`art/source/${rel}`)) staged.add(`art/source/${rel}`, s.bytes);
  staged.add(RESEARCH_UI_MANIFEST, Buffer.from(JSON.stringify({ generator: 'tools/content/modules/ui_research.mjs', files: manifest.sort((a, b) => a.out.localeCompare(b.out, 'en')) }, null, 1) + '\n'));
  staged.text(RESEARCH_UI_GFX, researchGfx(sprites));
  const overrides = [];
  for (const [file, o] of Object.entries(spec.overrides)) {
    staged.add(file, Buffer.from(overrideText(readFileSync(`${game}/${file}`, 'latin1'), o, file), 'latin1'));
    overrides.push(file);
  }
  return { sprites: sprites.length, tabs: folders.length, gates: gates.length, overrides };
}
