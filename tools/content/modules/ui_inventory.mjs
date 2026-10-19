// Vanilla interface inventory (spec docs/specs/07_interface/02_full_ui_reskin.md, "Files" and builder check 1).
// It reads the installed game read-only (HOI4_GAME in lib/paths.mjs, plus every dlc/ and integrated_dlc/ folder, which
// load at the same relative paths): the sprite blocks of interface/**/*.gfx, the sprite references of
// interface/**/*.gui, and the headers and pixels of the textures they name. It writes metadata only, never a vanilla
// pixel or a vanilla line of text, and the result is a pure function of the installed files: the same install gives
// the same bytes (sorted, no clock, no absolute path).
//
//   buildInventory({ game })            -> { format, header, sprites }
//   serializeInventory(inventory)       -> string (the file data/ui/vanilla_inventory.json)
//   verifyInventory({ inventory, game, deep }) -> { ok, problems, changedFiles, changedSprites }   (builder check 1)
//   writeInventory(file, game)          -> writes the file (node tools/content/modules/ui_inventory.mjs [out] [game])
import { readdirSync, readFileSync, statSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GAME } from '../lib/paths.mjs';
import { parse } from '../lib/clausewitz.mjs';
import { extOf, readHeader, decodeRgba, measure, LUMA } from '../lib/image_codec.mjs';

export const INVENTORY_FILE = fileURLToPath(new URL('../data/ui/vanilla_inventory.json', import.meta.url));
export const INVENTORY_FORMAT = 1;

// Sprite block keys (case-insensitive) and the kind name written to the inventory.
export const SPRITE_KINDS = {
  spritetype: 'sprite', corneredtilespritetype: 'cornered_tile', frameanimatedspritetype: 'frame_animated', textspritetype: 'text_sprite',
  progressbartype: 'progress_bar', maskedshieldtype: 'masked_shield', arrowtype: 'arrow', piecharttype: 'pie_chart',
  circularprogressbartype: 'circular_progress_bar', linecharttype: 'line_chart',
};
// Keys whose value is a texture. The first of `primary` present is the sprite's texture; the rest are listed as `extra`.
const PRIMARY_KEYS = ['texturefile', 'texturefile1'];
const EXTRA_KEYS = ['texturefile2', 'masking_texture', 'animationmaskfile', 'animationtexturefile'];
// Loose texture folders: image files in them that no sprite names are inventoried as kind `file` (the engine loads
// them by path: cursors, the minimap and move arrows, key icons and so on).
export const LOOSE_DIRS = ['gfx/cursors', 'gfx/minimap', 'gfx/mapitems', 'gfx/maparrows', 'gfx/keyicons', 'gfx/aces', 'gfx/army_icons', 'gfx/achievements', 'gfx/game_rules', 'gfx/texticons', 'gfx/interface'];
const IMAGE_EXTS = new Set(['dds', 'tga', 'png', 'bmp', 'cur', 'ani', 'ico']);
// .gui keys whose string value is never a sprite name.
const GUI_NON_SPRITE_KEYS = new Set(['name', 'text', 'pdx_tooltip', 'pdx_tooltip_delayed', 'tooltip', 'font', 'buttonfont', 'buttontext', 'shortcut', 'format', 'orientation', 'origo']);

// Vanilla files are UTF-8 (a few identifiers carry accents) or Windows-1252; a leading byte order mark is dropped.
const utf8 = new TextDecoder('utf-8', { fatal: true });
export function readText(bytes) {
  const b = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? bytes.subarray(3) : bytes;
  try { return utf8.decode(b); } catch { return b.toString('latin1'); }
}
const sha16 = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 16);
const ord = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const slash = p => p.split(path.sep).join('/');
export const normalizeTexturePath = p => String(p).replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/^\.\//, '').replace(/^\//, '');

// Every file below dir (relative, forward slashes), sorted by byte order so the walk is the same on every machine.
function walk(dir, rel = '', out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => ord(a.name, b.name))) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(`${dir}/${e.name}`, r, out); else out.push(r);
  }
  return out;
}

// The game roots: the base game, then every dlc/ and integrated_dlc/ folder by name.
export function gameRoots(game = GAME) {
  const roots = [{ id: 'base', dir: game, prefix: '' }];
  for (const group of ['dlc', 'integrated_dlc']) {
    if (!existsSync(`${game}/${group}`)) continue;
    for (const e of readdirSync(`${game}/${group}`, { withFileTypes: true }).sort((a, b) => ord(a.name, b.name))) if (e.isDirectory()) roots.push({ id: `${group}/${e.name}`, dir: `${game}/${group}/${e.name}`, prefix: `${group}/${e.name}/` });
  }
  return roots;
}

export function gameVersion(game = GAME) {
  const file = `${game}/launcher-settings.json`;
  if (!existsSync(file)) return { version: 'unknown', build: 'unknown' };
  const j = JSON.parse(readFileSync(file, 'utf8'));
  return { version: j.rawVersion ?? 'unknown', build: j.version ?? 'unknown' };
}

// The .gfx and .gui files of every root with their hashes: key = path with the root prefix.
export function interfaceFiles(game = GAME) {
  const files = [];
  for (const root of gameRoots(game)) for (const rel of walk(`${root.dir}/interface`, 'interface')) {
    const ext = extOf(rel);
    if (ext === 'gfx' || ext === 'gui') files.push({ root, rel, key: root.prefix + rel, ext, abs: `${root.dir}/${rel}` });
  }
  return files;
}

// Case-insensitive index of every image file under gfx/ of every root. The base game wins over a DLC folder.
function textureIndex(roots) {
  const index = new Map();
  for (const root of [...roots].reverse()) for (const top of ['gfx', 'pdx_online_assets']) for (const rel of walk(`${root.dir}/${top}`, top)) {
    if (!IMAGE_EXTS.has(extOf(rel))) continue;
    index.set(rel.toLowerCase(), { rel, abs: `${root.dir}/${rel}`, root: root.id });
  }
  return index;
}
// The file the engine reads for a declared texture path: the same path, or the same stem in another image format.
function resolveTexture(index, declared) {
  const p = normalizeTexturePath(declared).toLowerCase();
  const hit = index.get(p);
  if (hit) return hit;
  const stem = p.replace(/\.[^./]+$/, '');
  for (const ext of ['dds', 'tga', 'png']) { const alt = index.get(`${stem}.${ext}`); if (alt) return { ...alt, substituted: true }; }
  return null;
}

// ---------------------------------------------------------------------------------------------------- sprites
const keyOf = e => e.k?.toLowerCase();
const prop = (block, key) => block.find(p => keyOf(p) === key);
const num = (block, key) => { const p = prop(block, key); return p && typeof p.v === 'string' && /^-?\d+(\.\d+)?$/.test(p.v) ? Number(p.v) : null; };
const pair = (block, key) => {
  const p = prop(block, key);
  if (!p || !Array.isArray(p.v)) return null;
  const x = p.v.find(e => ['x', 'width'].includes(keyOf(e))), y = p.v.find(e => ['y', 'height'].includes(keyOf(e)));
  return x && y ? [Number(x.v), Number(y.v)] : null;
};

// Parse one .gfx file into raw sprite definitions (no image data yet).
export function parseGfx(text, file) {
  const out = [];
  for (const top of parse(text)) {
    if (keyOf(top) !== 'spritetypes' || !Array.isArray(top.v)) continue;
    for (const e of top.v) {
      const kind = SPRITE_KINDS[keyOf(e)];
      if (!kind || !Array.isArray(e.v)) continue;
      const nameProp = prop(e.v, 'name');
      if (!nameProp || typeof nameProp.v !== 'string' || !nameProp.v) continue;
      const textures = [];
      const collect = (block, depth) => {
        for (const p of block) {
          const k = keyOf(p);
          if (typeof p.v === 'string' && (PRIMARY_KEYS.includes(k) || EXTRA_KEYS.includes(k)) && p.v) textures.push({ key: k, path: p.v, depth });
          if (Array.isArray(p.v) && depth < 3 && k === 'animation') collect(p.v, depth + 1);
        }
      };
      collect(e.v, 0);
      const primary = PRIMARY_KEYS.map(k => textures.find(t => t.key === k && t.depth === 0)).find(Boolean);
      out.push({
        name: nameProp.v, kind, file, line: e.line,
        declared: primary?.path ?? null,
        extra: [...new Set(textures.filter(t => t !== primary).map(t => normalizeTexturePath(t.path)))].sort(ord),
        frames: num(e.v, 'noofframes') ?? 1,
        borderSize: pair(e.v, 'bordersize'),
        size: pair(e.v, 'size'),
      });
    }
  }
  return out;
}

// Window names and sprite references of one .gui file: Map(lowercase sprite name -> Set(top-level window)).
export function parseGuiRefs(text, names) {
  const refs = new Map();
  const visit = (entries, window) => {
    for (const e of entries) {
      if (Array.isArray(e.v)) { visit(e.v, window); continue; }
      if (typeof e.v !== 'string' || !e.k || GUI_NON_SPRITE_KEYS.has(e.k.toLowerCase())) continue;
      const hit = names.get(e.v.toLowerCase());
      if (!hit) continue;
      if (!refs.has(hit)) refs.set(hit, new Set());
      refs.get(hit).add(window);
    }
  };
  for (const top of parse(text)) {
    if (keyOf(top) !== 'guitypes' || !Array.isArray(top.v)) continue;
    for (const e of top.v) {
      if (!Array.isArray(e.v)) continue;
      const nameProp = prop(e.v, 'name');
      visit(e.v, typeof nameProp?.v === 'string' && nameProp.v ? nameProp.v : `(${keyOf(e)})`);
    }
  }
  return refs;
}

// ---------------------------------------------------------------------------------------------------- textures
// Header, pixels and measurements of one texture file; cached by absolute path.
async function readTexture(abs, rel) {
  const bytes = readFileSync(abs), ext = extOf(rel), head = readHeader(bytes, ext);
  const out = { ext, bytes: bytes.length, hash: sha16(bytes), width: head.width, height: head.height, format: head.format };
  if (!head.valid) out.problem = head.problem;
  if (ext === 'tga' && head.valid) out.origin = head.topOrigin ? 'top' : 'bottom';
  if (ext === 'cur' || ext === 'ico') { out.hotspot = head.hotspot ?? undefined; }
  if (ext === 'ani') { out.hotspot = head.hotspot ?? undefined; out.animFrames = head.frames; out.jifRate = head.jifRate; }
  if (['dds', 'tga', 'png', 'bmp'].includes(ext)) {
    const px = head.valid ? await decodeRgba(bytes, ext, head) : null;
    if (px) { const m = measure(px.data, px.width, px.height); out.luma = m.luma; out.luminance = m.luminance; out.alpha = m.alpha; out.coverage = m.coverage; }
    else { out.luminance = 'unknown'; out.alpha = 'unknown'; }
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------- build
export async function buildInventory({ game = GAME } = {}) {
  const roots = gameRoots(game), files = interfaceFiles(game), index = textureIndex(roots);
  const fileHashes = {}, defs = new Map(), shadowed = {};
  const texts = new Map();
  for (const f of files) {
    const bytes = readFileSync(f.abs);
    fileHashes[f.key] = sha16(bytes);
    texts.set(f.key, readText(bytes));
  }
  // Later files win a duplicate name (sorted by path; the base game first).
  for (const f of files.filter(x => x.ext === 'gfx')) for (const d of parseGfx(texts.get(f.key), f.key)) {
    if (defs.has(d.name)) (shadowed[d.name] ??= [defs.get(d.name).file]).push(f.key);
    defs.set(d.name, { ...d, root: f.root.id, gfx: f.rel });
  }
  const names = new Map();
  for (const n of defs.keys()) names.set(n.toLowerCase(), n);
  const refs = new Map();
  for (const f of files.filter(x => x.ext === 'gui')) for (const [name, windows] of parseGuiRefs(texts.get(f.key), names)) {
    if (!refs.has(name)) refs.set(name, {});
    refs.get(name)[f.key] = [...windows].sort(ord);
  }

  const cache = new Map();
  const texture = async hit => {
    if (!cache.has(hit.abs)) cache.set(hit.abs, await readTexture(hit.abs, hit.rel));
    return cache.get(hit.abs);
  };
  const sprites = [], named = new Set(), linked = new Map();
  for (const d of [...defs.values()].sort((a, b) => ord(a.name, b.name))) {
    const row = { name: d.name, kind: d.kind };
    const hit = d.declared ? resolveTexture(index, d.declared) : null;
    if (hit) {
      const t = await texture(hit);
      named.add(hit.rel.toLowerCase());
      Object.assign(row, { texture: hit.rel, ext: t.ext, width: t.width, height: t.height });
      if (hit.substituted) row.declared = normalizeTexturePath(d.declared);
    } else {
      row.texture = d.declared ? normalizeTexturePath(d.declared) : null; row.missing = true; row.width = 0; row.height = 0;
    }
    row.frames = d.frames;
    row.borderSize = d.borderSize;
    if (d.size) row.size = d.size;
    if (hit) { const t = cache.get(hit.abs); Object.assign(row, { format: t.format, luminance: t.luminance ?? 'unknown', alpha: t.alpha ?? 'unknown' }); if (t.coverage !== undefined && t.alpha !== 'opaque') row.coverage = t.coverage; if (t.origin) row.origin = t.origin; Object.assign(row, { bytes: t.bytes, hash: t.hash }); if (t.problem) row.problem = t.problem; }
    if (d.extra.length) row.extra = d.extra;
    for (const x of d.extra) { const h = resolveTexture(index, x); if (h) { if (!linked.has(h.rel.toLowerCase())) linked.set(h.rel.toLowerCase(), { hit: h, via: [] }); linked.get(h.rel.toLowerCase()).via.push(d.name); } }
    row.gfx = d.gfx; if (d.root !== 'base') row.root = d.root;
    if (refs.has(d.name)) row.refs = refs.get(d.name);
    sprites.push(row);
  }
  // Linked textures: files a sprite names besides its own texture (the second texture of a progress bar, a mask, a
  // shine overlay) that no sprite uses as its own texture. They are shipped files, so they need a disposition too.
  for (const [low, { hit, via }] of [...linked].sort(([a], [b]) => ord(a, b))) {
    if (named.has(low)) continue;
    named.add(low);
    const t = await texture(hit);
    const row = { name: hit.rel, kind: 'linked', texture: hit.rel, ext: t.ext, width: t.width, height: t.height, frames: 1, borderSize: null, format: t.format, luminance: t.luminance ?? 'unknown', alpha: t.alpha ?? 'unknown' };
    if (t.coverage !== undefined && t.alpha !== 'opaque') row.coverage = t.coverage;
    if (t.origin) row.origin = t.origin;
    Object.assign(row, { bytes: t.bytes, hash: t.hash, via: [...new Set(via)].sort(ord).slice(0, 8), uses: new Set(via).size });
    if (hit.root !== 'base') row.root = hit.root;
    sprites.push(row);
  }
  // Loose files: images in the engine-loaded folders that no sprite names.
  for (const [low, hit] of [...index].sort(([a], [b]) => ord(a, b))) {
    if (named.has(low) || !LOOSE_DIRS.some(dir => low.startsWith(`${dir.toLowerCase()}/`))) continue;
    const t = await texture(hit);
    const row = { name: hit.rel, kind: 'file', texture: hit.rel, ext: t.ext, width: t.width, height: t.height, frames: t.animFrames ?? 1, borderSize: null, format: t.format, luminance: t.luminance ?? 'none', alpha: t.alpha ?? 'none' };
    if (t.coverage !== undefined && t.alpha !== 'opaque') row.coverage = t.coverage;
    if (t.origin) row.origin = t.origin;
    Object.assign(row, { bytes: t.bytes, hash: t.hash });
    if (t.hotspot) row.hotspot = t.hotspot;
    if (t.jifRate !== undefined) row.jifRate = t.jifRate;
    if (hit.root !== 'base') row.root = hit.root;
    sprites.push(row);
  }
  sprites.sort((a, b) => ord(a.name, b.name));
  const textureLines = [...cache.values()].map(t => `${t.hash}:${t.bytes}`);
  const byKind = {}; for (const s of sprites) byKind[s.kind] = (byKind[s.kind] ?? 0) + 1;
  const header = {
    game: gameVersion(game),
    roots: roots.map(r => r.id),
    luminanceThresholds: { dark: `mean < ${LUMA.dark}`, mid: `${LUMA.dark} <= mean < ${LUMA.light}`, light: `mean >= ${LUMA.light}` },
    counts: { sprites: sprites.length, byKind: Object.fromEntries(Object.entries(byKind).sort(([a], [b]) => ord(a, b))), textures: cache.size, missingTextures: sprites.filter(s => s.missing).length, files: Object.keys(fileHashes).length, duplicateNames: Object.keys(shadowed).length },
    textureDigest: sha16(textureLines.sort(ord).join('\n')),
    duplicates: Object.fromEntries(Object.entries(shadowed).sort(([a], [b]) => ord(a, b))),
    files: Object.fromEntries(Object.entries(fileHashes).sort(([a], [b]) => ord(a, b))),
  };
  return { format: INVENTORY_FORMAT, header, sprites };
}

// One sprite per line so a game patch gives a readable diff.
export function serializeInventory(inv) {
  return `{\n "format": ${inv.format},\n "header": ${JSON.stringify(inv.header, null, 1).replace(/\n/g, '\n ')},\n "sprites": [\n${inv.sprites.map(s => JSON.stringify(s)).join(',\n')}\n ]\n}\n`;
}

export function loadInventory(file = INVENTORY_FILE) {
  const inv = JSON.parse(readFileSync(file, 'utf8'));
  if (inv.format !== INVENTORY_FORMAT) throw new Error(`${file}: inventory format ${inv.format}, expected ${INVENTORY_FORMAT}`);
  return inv;
}

// Builder check 1. Compares the game version and the hashes of the inventoried .gfx and .gui files with the install;
// `deep` also re-hashes every texture. Cheap mode compares file sizes of the textures. The result lists the sprites
// defined in or referencing a changed file, and the sprites whose texture changed.
export function verifyInventory({ inventory, game = GAME, deep = false }) {
  const problems = [], changedFiles = [], changedSprites = new Set();
  const now = gameVersion(game);
  if (now.version !== inventory.header.game.version) problems.push(`game version ${now.version}, inventory ${inventory.header.game.version}`);
  const current = {};
  for (const f of interfaceFiles(game)) current[f.key] = sha16(readFileSync(f.abs));
  for (const key of Object.keys({ ...inventory.header.files, ...current }).sort(ord)) {
    if (inventory.header.files[key] === current[key]) continue;
    changedFiles.push(key);
    problems.push(`${key}: ${inventory.header.files[key] === undefined ? 'new file' : current[key] === undefined ? 'file removed' : 'content changed'}`);
  }
  const touched = new Set(changedFiles);
  const index = textureIndex(gameRoots(game));
  for (const s of inventory.sprites) {
    if ((s.gfx && touched.has((s.root && s.root !== 'base' ? `${s.root}/` : '') + s.gfx)) || (s.refs && Object.keys(s.refs).some(f => touched.has(f)))) changedSprites.add(s.name);
    if (!s.texture || s.missing) continue;
    const hit = index.get(s.texture.toLowerCase());
    if (!hit) { changedSprites.add(s.name); problems.push(`${s.name}: texture ${s.texture} is gone`); continue; }
    const size = statSync(hit.abs).size;
    if (size !== s.bytes || (deep && sha16(readFileSync(hit.abs)) !== s.hash)) { changedSprites.add(s.name); problems.push(`${s.name}: texture ${s.texture} changed`); }
  }
  return { ok: problems.length === 0, problems, changedFiles, changedSprites: [...changedSprites].sort(ord) };
}

export async function writeInventory(file = INVENTORY_FILE, game = GAME) {
  const inv = await buildInventory({ game });
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, serializeInventory(inv));
  return inv;
}

if (process.argv[1] && slash(path.resolve(process.argv[1])) === slash(fileURLToPath(import.meta.url))) {
  const out = path.resolve(process.argv[2] ?? INVENTORY_FILE), game = process.argv[3] ? slash(path.resolve(process.argv[3])) : GAME;
  const inv = await writeInventory(out, game);
  console.log(JSON.stringify({ out, ...inv.header.counts, game: inv.header.game.version }));
}
