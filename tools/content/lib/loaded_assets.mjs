// The loaded set of the asset check (05_asset_manifest.md section 3): the files ZIN ships (a "view" over a staged
// tree, a directory, or a staged tree over the repository) and the installed game they may point into (read-only,
// lazy). It also scans the shipped files into a reference graph: sprite definitions and uses, texture references,
// entities, meshes, animations, sounds, fonts, localisation keys, tags, focuses, events and characters.
// Nothing here writes a file, and nothing is copied from the game.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parse, walk, scriptText } from './clausewitz.mjs';
import { extOf } from './dds_info.mjs';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const slash = p => p.split(path.sep).join('/');

// ---------------------------------------------------------------------------------------------------- constants
// Folders that can hold a file an asset check cares about. 'art' is read for the manifests and the provenance log.
export const VIEW_ROOTS = ['common', 'events', 'gfx', 'interface', 'localisation', 'map', 'portraits', 'sound', 'music', 'tutorial', 'art', 'docs/assets/hoi4_3d_model_jobs'];
export const ASSET_ROOTS = ['gfx', 'interface', 'map', 'sound', 'music'];
export const ASSET_EXTS = new Set(['dds', 'tga', 'png', 'bmp', 'mesh', 'anim', 'cur', 'ani', 'ico', 'wav', 'ogg', 'mp3', 'fnt']);
export const IMAGE_EXTS_SET = new Set(['dds', 'tga', 'png', 'bmp']);
// Folders of the installed game that are searched for existence (everything else falls back to existsSync).
const VANILLA_ROOTS = ['gfx', 'interface', 'sound', 'music', 'map', 'portraits', 'localisation'];

export const isAssetFile = rel => ASSET_EXTS.has(extOf(rel)) && ASSET_ROOTS.includes(rel.split('/')[0]);

// ------------------------------------------------------------------------------------------------------ views
// A view is a read-only set of files: paths (sorted), has, read (Buffer), size, text (latin1 script text), sha.
export function makeView(entries, label = 'view') {
  const loaders = new Map(entries), paths = [...loaders.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const bytes = new Map(), texts = new Map(), shas = new Map(), sizes = new Map();
  const view = {
    label, paths,
    has: rel => loaders.has(rel),
    read(rel) {
      if (!loaders.has(rel)) throw new Error(`${label}: no such file ${rel}`);
      if (bytes.has(rel)) return bytes.get(rel);
      const l = loaders.get(rel), b = typeof l === 'function' ? l() : (Buffer.isBuffer(l) ? l : Buffer.from(l));
      if (b.length <= 2_000_000) bytes.set(rel, b);
      return b;
    },
    size(rel) {
      if (sizes.has(rel)) return sizes.get(rel);
      const l = loaders.get(rel); let n;
      if (typeof l === 'function' && l.size) n = l.size(); else n = view.read(rel).length;
      sizes.set(rel, n); return n;
    },
    text(rel) { if (!texts.has(rel)) texts.set(rel, scriptText(view.read(rel))); return texts.get(rel); },
    utf8(rel) { return view.read(rel).toString('utf8').replace(/^﻿/, ''); },
    sha(rel) { if (!shas.has(rel)) shas.set(rel, sha256(view.read(rel))); return shas.get(rel); },
    under: prefix => paths.filter(p => p.startsWith(prefix)),
  };
  return view;
}

function walkDir(dir, base, out) {
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    const full = `${dir}/${e.name}`;
    if (e.isDirectory()) walkDir(full, `${base}${e.name}/`, out);
    else if (e.name !== '.gitkeep') out.push([`${base}${e.name}`, full]);
  }
}

// Files of a mod directory in the roots an asset check reads, as lazy loaders.
export function diskEntries(root, roots = VIEW_ROOTS) {
  const out = [];
  for (const r of roots) walkDir(`${root}/${r}`, `${r}/`, out);
  const entries = new Map();
  for (const [rel, full] of out) { const l = () => fs.readFileSync(full); l.size = () => fs.statSync(full).size; entries.set(rel, l); }
  return entries;
}

export function diskView(root, roots = VIEW_ROOTS) { return makeView(diskEntries(root, roots), `disk:${root}`); }

// A staged tree (Map rel -> Buffer) laid over a mod directory: staged files win; `drop` lists the files that the
// next apply deletes (tracked by the builder, no longer staged), so they are not part of the loaded set.
export function overlayView(root, staged, { roots = VIEW_ROOTS, drop = new Set() } = {}) {
  const entries = diskEntries(root, roots);
  for (const rel of drop) if (!staged.has(rel)) entries.delete(rel);
  for (const [rel, b] of staged) if (roots.includes(rel.split('/')[0])) entries.set(rel, Buffer.isBuffer(b) ? b : Buffer.from(b));
  return makeView(entries, `staged-over:${root}`);
}

export function mapView(files, label = 'memory') {
  return makeView([...files].map(([rel, b]) => [rel, Buffer.isBuffer(b) ? b : Buffer.from(b)]), label);
}

// ------------------------------------------------------------------------------------------------- the game
// The installed game, mounted with its integrated_dlc and dlc folders at the same relative paths. Everything is lazy
// and cached per process; the game is only ever read. `replacePaths` removes folders the way descriptor.mod does.
export function replacePathsOf(descriptorText) {
  return [...descriptorText.matchAll(/^\s*replace_path\s*=\s*"([^"]+)"/gm)].map(m => m[1].replace(/\/$/, ''));
}

const vanillaCaches = new Map();
export function createVanilla(game, { replacePaths = [] } = {}) {
  const cacheKey = `${game}|${replacePaths.join(',')}`;
  if (vanillaCaches.has(cacheKey)) return vanillaCaches.get(cacheKey);
  const present = !!game && fs.existsSync(game);
  const mounts = [];
  if (present) {
    mounts.push(game);
    for (const sub of ['integrated_dlc', 'dlc']) {
      let names = []; try { names = fs.readdirSync(`${game}/${sub}`, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name).sort(); } catch { /* none */ }
      for (const n of names) mounts.push(`${game}/${sub}/${n}`);
    }
  }
  const replaced = rel => replacePaths.some(p => rel === p || rel.startsWith(`${p}/`));
  let fileMap; // rel -> mount index of the first mount holding it
  const files = () => {
    if (fileMap) return fileMap;
    fileMap = new Map();
    mounts.forEach((mount, i) => {
      const out = [];
      for (const r of VANILLA_ROOTS) walkDir(`${mount}/${r}`, `${r}/`, out);
      for (const [rel] of out) if (!fileMap.has(rel)) fileMap.set(rel, i);
    });
    return fileMap;
  };
  const abs = rel => {
    const i = files().get(rel);
    if (i !== undefined) return `${mounts[i]}/${rel}`;
    for (const m of mounts) if (fs.existsSync(`${m}/${rel}`)) return `${m}/${rel}`;
    return null;
  };
  const known = new Map(); // cache of existsSync for paths outside the walked roots
  const existsAnywhere = rel => {
    if (!present) return false;
    if (VANILLA_ROOTS.includes(rel.split('/')[0])) return files().has(rel);
    if (!known.has(rel)) known.set(rel, mounts.some(m => fs.existsSync(`${m}/${rel}`)));
    return known.get(rel);
  };
  const shaCache = new Map(), nameCache = new Map(), sizeCache = new Map();
  const v = {
    game, present, mounts, replacePaths,
    // Exists in the loaded vanilla set (not in a folder the descriptor replaces).
    has: rel => existsAnywhere(rel) && !replaced(rel),
    // Exists on disk in the install whether or not ZIN replaces its folder (for the `replaces` field and copy checks).
    hasInstalled: rel => existsAnywhere(rel),
    isReplaced: replaced,
    abs,
    files,
    size(rel) { if (!sizeCache.has(rel)) { const a = abs(rel); sizeCache.set(rel, a ? fs.statSync(a).size : -1); } return sizeCache.get(rel); },
    header(rel, n = 148) { const a = abs(rel); if (!a) return null; const fd = fs.openSync(a, 'r'); try { const b = Buffer.alloc(n); const got = fs.readSync(fd, b, 0, n, 0); return b.subarray(0, got); } finally { fs.closeSync(fd); } },
    sha(rel) { if (!shaCache.has(rel)) { const a = abs(rel); shaCache.set(rel, a ? sha256(fs.readFileSync(a)) : null); } return shaCache.get(rel); },
    // Files whose byte size is `size`, among the installed files under the given path prefixes (lazy stat of those folders).
    bySize(prefixes) {
      const key = prefixes.join('|');
      if (!v._sizeIndex) v._sizeIndex = new Map();
      if (!v._sizeIndex.has(key)) {
        const idx = new Map();
        for (const rel of files().keys()) {
          if (!prefixes.some(p => rel.startsWith(p))) continue;
          if (!ASSET_EXTS.has(extOf(rel))) continue;
          const s = v.size(rel); if (s < 0) continue;
          (idx.get(s) ?? idx.set(s, []).get(s)).push(rel);
        }
        v._sizeIndex.set(key, idx);
      }
      return v._sizeIndex.get(key);
    },
    // Names defined by files matching `filter`, per file: [{ rel, names: Set }]. kind selects the scanner.
    defs(kind) {
      if (nameCache.has(kind)) return nameCache.get(kind);
      const scan = DEF_SCANNERS[kind]; const out = [];
      if (scan && present) {
        for (const rel of [...files().keys()].sort()) {
          if (!scan.filter(rel) || replaced(rel)) continue;
          const text = fs.readFileSync(abs(rel), 'latin1');
          out.push({ rel, names: scan.names(text) });
        }
      }
      nameCache.set(kind, out);
      return out;
    },
    // The union of `defs(kind)` names, minus files the mod overrides at the same path.
    names(kind, overridden = new Set()) {
      const set = new Set();
      for (const { rel, names } of v.defs(kind)) { if (overridden.has(rel)) continue; for (const n of names) set.add(n); }
      return set;
    },
    cursors() { return [...new Set([...files().keys()].filter(r => r.startsWith('gfx/cursors/')).map(r => path.posix.basename(r).replace(/\.[A-Za-z0-9]+$/, '')))].sort(); },
  };
  vanillaCaches.set(cacheKey, v);
  return v;
}

const grab = (re, text, group = 1) => { const s = new Set(); for (const m of text.matchAll(re)) s.add(m[group]); return s; };
const DEF_SCANNERS = {
  sprites: { filter: r => r.startsWith('interface/') && r.endsWith('.gfx'), names: t => grab(/\bname\s*=\s*"?(GFX_[A-Za-z0-9_]+)"?/g, t) },
  fonts: { filter: r => r.startsWith('interface/') && r.endsWith('.gfx'), names: t => grab(/\bbitmapfont\s*=\s*\{\s*(?:#[^\n]*\n\s*)*name\s*=\s*"?([^"\s]+)"?/gi, t) },
  entities: { filter: r => r.startsWith('gfx/') && (r.endsWith('.asset') || r.endsWith('.gfx')), names: t => grab(/\bentity\s*=\s*\{\s*(?:#[^\n]*\n\s*)*name\s*=\s*"?([^"\s]+)"?/g, t) },
  meshes: { filter: r => r.startsWith('gfx/') && (r.endsWith('.asset') || r.endsWith('.gfx')), names: t => grab(/\bpdxmesh\s*=\s*\{\s*(?:#[^\n]*\n\s*)*name\s*=\s*"?([^"\s]+)"?/g, t) },
  animations: { filter: r => r.startsWith('gfx/') && (r.endsWith('.asset') || r.endsWith('.gfx')), names: t => grab(/\banimation\s*=\s*\{\s*(?:#[^\n]*\n\s*)*name\s*=\s*"?([^"\s]+)"?/g, t) },
  soundeffects: { filter: r => r.startsWith('sound/') && r.endsWith('.asset'), names: t => grab(/\bsoundeffect\s*=\s*\{\s*(?:#[^\n]*\n\s*)*name\s*=\s*"?([^"\s]+)"?/g, t) },
  songs: { filter: r => r.startsWith('music/') && r.endsWith('.asset'), names: t => grab(/\bmusic\s*=\s*\{\s*(?:#[^\n]*\n\s*)*name\s*=\s*"?([^"\s]+)"?/g, t) },
  loc: { filter: r => r.startsWith('localisation/english/') && r.endsWith('.yml'), names: t => grab(/^ ([A-Za-z0-9_.\-]+):\d*\s+"/gm, t) },
};

// ----------------------------------------------------------------------------------------------- the graph
const SPRITE_TYPE_KEYS = new Set(['spritetype', 'corneredtilespritetype', 'frameanimatedspritetype', 'progressbartype', 'maskedshieldtype', 'textspritetype', 'tilespritetype', 'flagspritetype']);
const TEXTURE_KEYS = new Set(['texturefile', 'texturefile1', 'texturefile2', 'texturefile3', 'additionaltexture', 'animationmaskfile', 'animationtexturefile', 'maskfile', 'texturefilemask']);
const GFX_VALUE = /^GFX_[A-Za-z0-9_]+$/;
const PATH_VALUE = /^(gfx|map|sound|music|interface)\/[^\s"]+\.(dds|tga|png|mesh|anim|wav|ogg|mp3)$/i;
const LOC_KEYISH = /^[A-Za-z][A-Za-z0-9_.\-]*$/;
const EVENT_KEYS = new Set(['country_event', 'news_event', 'state_event', 'unit_leader_event', 'operative_leader_event']);
const lc = s => (s ?? '').toLowerCase();
const str = v => (typeof v === 'string' ? v : null);
const child = (entries, key) => entries.find(e => lc(e.k) === key);
const children = (entries, key) => entries.filter(e => lc(e.k) === key);
const valueOf = (entries, key) => { const e = child(entries, key); return e && typeof e.v === 'string' ? e.v : null; };

export function emptyGraph() {
  return {
    sprites: new Map(),          // name -> [{ file, line, type, textures: [{ key, path }], frames, effect }]
    spriteUses: [],              // { name, file, line, ctx, implicit }
    fileRefs: new Map(),         // referenced path -> [{ by, file, line }]
    fonts: { defs: new Map(), uses: [] },
    entities: new Map(),         // name -> { file, line, pdxmesh, clone, states: [{ name, animation, line }] }
    meshes: new Map(),           // name -> { file, line, mesh, dir, textures: [{ key, path }], animations: Map(id -> type) }
    animations: new Map(),       // name -> { file, line, anim, dir }
    soundUses: [], soundDefs: new Map(), songDefs: new Map(),
    locDefs: new Map(),          // key -> { file, value }
    locUses: [], locFiles: [],   // { key, file, line } ; { file, bom, header, lang }
    texticons: [],               // { name, file }
    mapRefs: [],                 // { key, path, file, line }
    focuses: [], events: [], eventLinks: [], characters: [], ideas: [], tags: [], cultures: [], parseErrors: [],
  };
}

function addRef(g, p, by, file, line) { (g.fileRefs.get(p) ?? g.fileRefs.set(p, []).get(p)).push({ by, file, line }); }
function tryParse(g, rel, text) { try { return parse(text); } catch (e) { g.parseErrors.push({ file: rel, message: String(e.message).slice(0, 120) }); return []; } }

function scanSpriteBlock(g, rel, e, type) {
  const name = valueOf(e.v, 'name'); if (!name) return;
  const textures = [];
  const collect = entries => { for (const t of entries) { if (TEXTURE_KEYS.has(lc(t.k)) && typeof t.v === 'string' && t.v) textures.push({ key: lc(t.k), path: t.v, line: t.line }); else if (Array.isArray(t.v) && lc(t.k) === 'animation') collect(t.v); } };
  collect(e.v);
  const frames = Number(valueOf(e.v, 'noofframes') ?? 0) || 0, effect = valueOf(e.v, 'effectfile');
  const def = { file: rel, line: e.line, type: lc(type), textures, frames, effect };
  (g.sprites.get(name) ?? g.sprites.set(name, []).get(name)).push(def);
  for (const t of textures) addRef(g, t.path, `sprite:${name}`, rel, t.line);
  if (effect) addRef(g, effect, `sprite:${name}`, rel, e.line);
}

function scanEntity(g, rel, e) {
  const name = valueOf(e.v, 'name'); if (!name) return;
  const states = children(e.v, 'state').filter(s => Array.isArray(s.v)).map(s => ({ name: valueOf(s.v, 'name'), animation: valueOf(s.v, 'animation'), line: s.line }));
  g.entities.set(name, { file: rel, line: e.line, pdxmesh: valueOf(e.v, 'pdxmesh'), clone: valueOf(e.v, 'clone'), states });
  walk(e.v, x => { if (lc(x.k) === 'soundeffect' && typeof x.v === 'string') g.soundUses.push({ name: x.v, file: rel, line: x.line, ctx: 'entity' }); });
}

function scanMesh(g, rel, e) {
  const name = valueOf(e.v, 'name'); if (!name) return;
  const file = valueOf(e.v, 'file'), textures = [], animations = new Map();
  for (const ms of children(e.v, 'meshsettings')) if (Array.isArray(ms.v)) for (const t of ms.v) if (/^texture_/i.test(t.k ?? '') && typeof t.v === 'string') textures.push({ key: lc(t.k), path: t.v, line: t.line });
  for (const a of children(e.v, 'animation')) if (Array.isArray(a.v)) { const id = valueOf(a.v, 'id'), type = valueOf(a.v, 'type'); if (id && type) animations.set(id, type); }
  g.meshes.set(name, { file: rel, line: e.line, mesh: file, dir: path.posix.dirname(rel), textures, animations });
}

function scanObjects(g, rel, entries) {
  for (const e of entries) {
    const k = lc(e.k);
    if (!Array.isArray(e.v)) continue;
    if (k === 'spritetypes' || k === 'objecttypes' || k === 'bitmapfonts' || k === 'fonts') { scanObjects(g, rel, e.v); continue; }
    if (SPRITE_TYPE_KEYS.has(k)) scanSpriteBlock(g, rel, e, e.k);
    else if (k === 'bitmapfont') { const n = valueOf(e.v, 'name'); if (n) g.fonts.defs.set(n, { file: rel, line: e.line }); for (const fp of e.v) { if (lc(fp.k) === 'path' && typeof fp.v === 'string') addRef(g, `${fp.v}.fnt`, `font:${n}`, rel, fp.line); if (lc(fp.k) === 'fontfiles' && Array.isArray(fp.v)) for (const x of fp.v) if (typeof x.v === 'string') addRef(g, `${x.v}.fnt`, `font:${n}`, rel, x.line); } }
    else if (k === 'entity') scanEntity(g, rel, e);
    else if (k === 'pdxmesh') scanMesh(g, rel, e);
    else if (k === 'animation') { const name = valueOf(e.v, 'name'), file = valueOf(e.v, 'file'); if (name) g.animations.set(name, { file: rel, line: e.line, anim: file, dir: path.posix.dirname(rel) }); }
    else if (k === 'soundeffect') { const n = valueOf(e.v, 'name'); if (n) g.soundDefs.set(n, { file: rel, line: e.line, sounds: children(e.v.find(x => lc(x.k) === 'sounds')?.v ?? [], 'sound').map(s => s.v).filter(v => typeof v === 'string') }); }
    else if (k === 'sound') { const n = valueOf(e.v, 'name'), f = valueOf(e.v, 'file'); if (n) g.soundDefs.set(`sound:${n}`, { file: rel, line: e.line, path: f }); }
    else if (k === 'music') { const n = valueOf(e.v, 'name'), f = valueOf(e.v, 'file'); if (n) g.songDefs.set(n, { file: rel, line: e.line, path: f }); }
  }
}

// Generic walk: every value spelled GFX_<name> is a sprite use; keys decide the text, font and sound surfaces.
function scanValues(g, rel, entries, cfg, mode) {
  walk(entries, (e, anc) => {
    const k = lc(e.k);
    if (typeof e.v !== 'string') return;
    if (GFX_VALUE.test(e.v)) { g.spriteUses.push({ name: e.v, file: rel, line: e.line, ctx: e.k ?? '(list)', implicit: false }); return; }
    if (PATH_VALUE.test(e.v)) { addRef(g, e.v, `${rel}:${e.k ?? 'list'}`, rel, e.line); return; }
    if (mode === 'gui') {
      if (cfg.text_keys.map(lc).includes(k) && LOC_KEYISH.test(e.v)) g.locUses.push({ key: e.v, file: rel, line: e.line, ctx: e.k });
      else if (cfg.font_keys.map(lc).includes(k)) g.fonts.uses.push({ name: e.v, file: rel, line: e.line });
      else if (cfg.sound_keys.map(lc).includes(k)) g.soundUses.push({ name: e.v, file: rel, line: e.line, ctx: e.k });
      else if (k === 'texture' && /\.(dds|tga|png)$/i.test(e.v)) addRef(g, e.v, 'gui:texture', rel, e.line);
    } else if (mode === 'script') {
      if (cfg.sound_keys.map(lc).includes(k) && k !== 'soundeffect' && LOC_KEYISH.test(e.v) && /sound|song/.test(k)) g.soundUses.push({ name: e.v, file: rel, line: e.line, ctx: e.k });
    }
  });
}

function scanGui(g, rel, text, cfg) {
  const entries = tryParse(g, rel, text);
  scanValues(g, rel, entries, cfg, 'gui');
}

function scanScript(g, rel, text, cfg) {
  const entries = tryParse(g, rel, text);
  scanValues(g, rel, entries, cfg, 'script');
  if (rel.startsWith(cfg.idea.dirs[0])) {
    walk(entries, (e, anc) => {
      if (lc(e.k) === 'picture' && typeof e.v === 'string') {
        const owner = [...anc].reverse().find(a => Array.isArray(a.v));
        const name = GFX_VALUE.test(e.v) ? e.v : `${cfg.idea.prefix}${e.v}`;
        g.spriteUses.push({ name, file: rel, line: e.line, ctx: 'idea picture', implicit: true, owner: owner?.k });
        g.ideas.push({ id: owner?.k ?? '', picture: e.v, sprite: name, file: rel, line: e.line });
      }
    });
  }
  if (rel.startsWith(cfg.decision.dirs[0]) && !cfg.decision.excludeDirs.some(d => rel.startsWith(d))) {
    walk(entries, (e, anc) => {
      if (lc(e.k) === 'icon' && typeof e.v === 'string' && anc.length >= 2) {
        const name = GFX_VALUE.test(e.v) ? e.v : `${cfg.decision.prefix}${e.v}`;
        g.spriteUses.push({ name, file: rel, line: e.line, ctx: 'decision icon', implicit: true });
      }
    });
  }
  if (rel.startsWith('common/frontend/backgrounds/')) {
    // The engine builds gfx/loadingscreens/<name>.dds and the sprite GFX_<name>_small from each background name.
    for (const e of entries) if (e.k && Array.isArray(e.v)) { addRef(g, `gfx/loadingscreens/${e.k}.dds`, 'frontend background', rel, e.line); g.spriteUses.push({ name: `GFX_${e.k}_small`, file: rel, line: e.line, ctx: 'frontend background', implicit: true }); }
  }
  if (rel.startsWith('common/national_focus/')) scanFocus(g, rel, entries);
  if (rel.startsWith('events/')) scanEvents(g, rel, entries);
  if (rel.startsWith('common/characters/')) scanCharacters(g, rel, entries);
  if (rel.startsWith('common/country_tags/')) { let dynamic = false; for (const e of entries) { if (lc(e.k) === 'dynamic_tags') { dynamic = e.v === 'yes'; continue; } if (e.k && /^[A-Za-z0-9]{3}$/.test(e.k)) g.tags.push({ tag: e.k, dynamic, file: rel, line: e.line }); } }
  if (rel === 'common/countries/cosmetic.txt') for (const e of entries) if (e.k && Array.isArray(e.v)) g.tags.push({ tag: e.k, dynamic: false, cosmetic: true, file: rel, line: e.line });
  if (rel === 'common/graphicalculturetype.txt') for (const e of entries) if (e.k === null && typeof e.v === 'string') g.cultures.push(e.v);
}

function iconsOf(entry) {
  const out = [];
  if (typeof entry.v === 'string') { if (GFX_VALUE.test(entry.v)) out.push(entry.v); return out; }
  walk(entry.v, x => { if (typeof x.v === 'string' && GFX_VALUE.test(x.v)) out.push(x.v); });
  return out;
}

function scanFocus(g, rel, entries) {
  const visit = (list, tree, shared) => {
    for (const e of list) {
      if (!Array.isArray(e.v)) continue;
      const k = lc(e.k);
      if (k === 'focus_tree' || k === 'shared_focus_tree') { visit(e.v, valueOf(e.v, 'id') ?? '(tree)', k === 'shared_focus_tree'); continue; }
      if (k === 'focus' || k === 'shared_focus') {
        const id = valueOf(e.v, 'id'); if (!id) continue;
        const iconEntries = children(e.v, 'icon'), icons = iconEntries.flatMap(iconsOf);
        const prereq = children(e.v, 'prerequisite').flatMap(p => (Array.isArray(p.v) ? children(p.v, 'focus').map(f => f.v).filter(v => typeof v === 'string') : []));
        g.focuses.push({ id, tree: tree ?? '(shared)', shared: shared || k === 'shared_focus', icons, prerequisites: prereq, file: rel, line: e.line });
        for (const ic of icons) g.spriteUses.push({ name: ic, file: rel, line: e.line, ctx: 'focus icon', implicit: false, focus: id, shine: true });
      }
    }
  };
  visit(entries, null, false);
}

function scanEvents(g, rel, entries) {
  for (const e of entries) {
    if (!EVENT_KEYS.has(lc(e.k)) || !Array.isArray(e.v)) continue;
    const id = valueOf(e.v, 'id'); if (!id) continue;
    const pictures = [];
    for (const p of children(e.v, 'picture')) { if (typeof p.v === 'string') pictures.push(p.v); else if (Array.isArray(p.v)) walk(p.v, x => { if (typeof x.v === 'string' && GFX_VALUE.test(x.v)) pictures.push(x.v); }); }
    g.events.push({ id, kind: lc(e.k), pictures, hidden: valueOf(e.v, 'hidden') === 'yes', file: rel, line: e.line });
    walk(e.v, x => {
      if (!EVENT_KEYS.has(lc(x.k))) return;
      const target = typeof x.v === 'string' ? x.v : valueOf(x.v, 'id');
      if (target) g.eventLinks.push({ from: id, to: target, file: rel, line: x.line });
    });
  }
}

function scanCharacters(g, rel, entries) {
  for (const root of entries) {
    if (lc(root.k) !== 'characters' || !Array.isArray(root.v)) continue;
    for (const c of root.v) {
      if (!Array.isArray(c.v)) continue;
      const portraits = [];
      walk(c.v, (x, anc) => { if (typeof x.v === 'string' && GFX_VALUE.test(x.v) && ['large', 'small', 'character'].includes(lc(x.k))) portraits.push({ sprite: x.v, slot: lc(x.k), kind: anc.at(-1)?.k ?? '' }); });
      const tagEntry = child(c.v, 'country_tag');
      g.characters.push({ id: c.k, country: typeof tagEntry?.v === 'string' ? tagEntry.v : (/^([A-Za-z0-9]{3})_/.exec(c.k ?? '')?.[1] ?? ''), portraits, file: rel, line: c.line });
    }
  }
}

function scanLoc(g, rel, bytes) {
  const bom = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  const text = bytes.toString('utf8').replace(/^﻿/, '');
  const lines = text.split(/\r?\n/);
  const headerIdx = lines.findIndex(l => l.trim() && !l.trim().startsWith('#'));
  const header = headerIdx >= 0 ? lines[headerIdx].trim() : '';
  const lang = /^l_([a-z_]+):/.exec(header)?.[1] ?? '';
  g.locFiles.push({ file: rel, bom, header, lang });
  lines.forEach((l, i) => {
    const m = /^ ([A-Za-z0-9_.\-]+):\d*\s+"(.*)"\s*(?:#.*)?$/.exec(l);
    if (!m) return;
    if (lang === 'english') g.locDefs.set(m[1], { file: rel, value: m[2] });
    for (const t of m[2].matchAll(/£([A-Za-z0-9_]+)/g)) g.texticons.push({ name: t[1], file: rel, line: i + 1, key: m[1] });
  });
}

function scanMap(g, rel, text) {
  if (rel !== 'map/default.map') return;
  for (const e of tryParse(g, rel, text)) if (typeof e.v === 'string' && /\.(bmp|csv|txt|dds|png|tga)$/i.test(e.v)) g.mapRefs.push({ key: e.k, path: `map/${e.v}`, file: rel, line: e.line });
}

// Scan every shipped file of the view into a graph. `cfg` is data/assets/implicit_names.json.
export function scanShipped(view, cfg) {
  const g = emptyGraph();
  for (const rel of view.paths) {
    const ext = extOf(rel);
    if (rel.startsWith('art/') || rel.startsWith('docs/')) continue;
    if (ext === 'gfx' || (ext === 'asset' && !rel.startsWith('sound/') && !rel.startsWith('music/'))) scanObjects(g, rel, tryParse(g, rel, view.text(rel)));
    else if (ext === 'gui') scanGui(g, rel, view.text(rel), cfg);
    else if (ext === 'yml' && rel.startsWith('localisation/')) scanLoc(g, rel, view.read(rel));
    else if (ext === 'map' && rel.startsWith('map/')) scanMap(g, rel, view.text(rel));
    else if (ext === 'txt') {
      if (rel.startsWith('map/')) { scanMap(g, rel, view.text(rel)); continue; }
      if (rel.startsWith('common/countries/') && rel !== 'common/countries/cosmetic.txt') continue;
      if (rel.startsWith('common/units/names') || rel.startsWith('common/peace_conference/') || rel.startsWith('common/ai_')) continue;
      const text = view.text(rel);
      const needsParse = text.includes('GFX_') || cfg.idea.dirs.concat(cfg.decision.dirs, cfg.focus.dirs, ['events/', 'common/characters/', 'common/country_tags/', 'common/graphicalculturetype', 'common/frontend/backgrounds/']).some(d => rel.startsWith(d)) || rel === 'common/countries/cosmetic.txt';
      if (needsParse) scanScript(g, rel, text, cfg);
    }
  }
  // Every texture-like value a shipped sprite or entity names counts as a use of that file.
  return g;
}

// Resolve a path named in a .gfx/.asset file. The engine looks a texture up by path from the game root; model
// files and animations may also be named relative to the .asset file or by bare file name anywhere in the mod.
export function resolveFile(view, vanilla, p, { dir = '', byName } = {}) {
  const clean = p.replace(/\\/g, '/').replace(/^\.?\//, '');
  if (view.has(clean)) return { where: 'zin', path: clean };
  if (dir && view.has(`${dir}/${clean}`)) return { where: 'zin', path: `${dir}/${clean}` };
  if (byName && !clean.includes('/')) { const hit = byName.get(clean.toLowerCase()); if (hit) return { where: 'zin', path: hit }; }
  const lower = clean.toLowerCase();
  if (lower !== clean && view.has(lower)) return { where: 'zin', path: lower, caseOnly: true };
  if (vanilla?.has(clean)) return { where: 'vanilla', path: clean };
  if (dir && vanilla?.has(`${dir}/${clean}`)) return { where: 'vanilla', path: `${dir}/${clean}` };
  return null;
}

export function basenameIndex(view) {
  const m = new Map();
  for (const rel of view.paths) { const b = path.posix.basename(rel).toLowerCase(); if (!m.has(b)) m.set(b, rel); }
  return m;
}

export { slash };
