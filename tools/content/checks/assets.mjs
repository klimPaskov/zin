// Asset completeness check (docs/specs/08_art_and_assets/05_asset_manifest.md section 4, codes AC1-AC18).
//
//   node tools/content/checks/assets.mjs [--root dir] [--staged dir] [--game dir] [--phase N] [--report file]
//                                        [--baseline file] [--write-baseline]
//
// Reads the shipped files (the repository, optionally with a staged tree laid over it) and the installed game
// (read-only, lazy), builds the reference graph, and reports findings by severity:
//   error    a reference that does not resolve, a wrong header, a missing provenance record, a copy of a vanilla
//            file, an exact duplicate, an orphan. The build fails on an error that is not in the baseline.
//   warning  near duplicates, vanilla textures that are not on the kept list, a dynamic tag without a flag yet.
//   info     counts that matter but never fail (unused sprite definitions, files without a format rule).
// The check never writes a game file. It writes only the report and, on request, the baseline.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZIN, GAME, ART } from '../lib/paths.mjs';
import { imageInfo, extOf, IMAGE_EXTS, isPowerOfTwo, decodeRgba } from '../lib/dds_info.mjs';
import { perceptualHashes, phashDistance } from '../lib/phash.mjs';
import {
  diskView, overlayView, createVanilla, replacePathsOf, scanShipped, resolveFile, basenameIndex, isAssetFile, sha256,
} from '../lib/loaded_assets.mjs';
import { loadProvenance, loadModuleManifests, compileRules, classify, createSourceResolver } from '../lib/asset_sources.mjs';
import { validateManifest } from '../lib/asset_schema.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(here, '../data');
export const BASELINE_FILE = `${ZIN}/docs/design/validation/asset_baseline.json`;
export const REPORT_VERSION = 1;
const SEVERITIES = ['error', 'warning', 'info'];
const maxPairs = 200;

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

// ------------------------------------------------------------------------------------------------- context
export function loadAssetData(dataDir = DATA_DIR) {
  const d = `${dataDir}/assets`;
  return {
    cfg: readJson(`${d}/implicit_names.json`), families: readJson(`${d}/families.json`), formats: readJson(`${d}/formats.json`),
    bound: readJson(`${d}/bound.json`), kept: readJson(`${d}/kept.json`), uniq: readJson(`${d}/uniqueness.json`),
  };
}

function perceptualCache(file) {
  let store = {}, dirty = false;
  if (file) { try { store = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { store = {}; } }
  return {
    get: sha => store[sha],
    set(sha, value) { store[sha] = value; dirty = true; },
    save() { if (!file || !dirty) return; try { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(`${file}.tmp`, JSON.stringify(store)); fs.renameSync(`${file}.tmp`, file); } catch { /* the cache is optional */ } },
  };
}

// Build everything the check reads. `staged` is a Map rel -> Buffer laid over `root` (the builder's tree).
export function loadAssetContext({ root = ZIN, staged = null, game = GAME, dataDir = DATA_DIR, phase = 1, cachePath = `${ART}/cache/assets-check.json`, tables = null, descriptor = null } = {}) {
  let view;
  if (staged) {
    let drop = new Set();
    try { drop = new Set(readJson(`${root}/.zin-content.json`).files.map(f => f.relativePath)); } catch { /* none tracked yet */ }
    view = overlayView(root, staged, { drop });
  } else view = diskView(root);
  let descriptorText = descriptor;
  if (descriptorText === null) {
    const s = staged?.get('descriptor.mod');
    try { descriptorText = s ? s.toString('utf8') : fs.readFileSync(`${root}/descriptor.mod`, 'utf8'); } catch { descriptorText = ''; }
  }
  const vanilla = createVanilla(game, { replacePaths: replacePathsOf(descriptorText) });
  const data = loadAssetData(dataDir);
  let t = tables;
  if (!t) {
    t = { countries: [], flagCells: [] };
    try { t.countries = readJson(`${dataDir}/countries.json`).countries; } catch { /* optional */ }
    try { t.flagCells = readJson(`${dataDir}/flags-cells.json`); } catch { /* optional */ }
  }
  return { root, view, vanilla, ...data, tables: t, phase, cache: perceptualCache(cachePath), descriptor: descriptorText };
}

// --------------------------------------------------------------------------------------------- findings
class Findings {
  constructor() { this.list = []; this.seen = new Set(); }
  // `subject` is the stable part of the key: the name or value the finding is about (never a line number).
  add(code, severity, file, message, subject = '') {
    const key = `${code}|${file}|${subject || message}`;
    if (this.seen.has(key)) return;
    this.seen.add(key);
    this.list.push({ code, severity, path: file, message, key });
  }
}

class RefCounter {
  constructor() { this.kinds = new Map(); }
  ref(kind, ok = true) { const k = this.kinds.get(kind) ?? this.kinds.set(kind, { total: 0, unresolved: 0 }).get(kind); k.total++; if (!ok) k.unresolved++; }
  toJSON() {
    const byKind = Object.fromEntries([...this.kinds].sort(([a], [b]) => (a < b ? -1 : 1)));
    let total = 0, unresolved = 0; for (const v of this.kinds.values()) { total += v.total; unresolved += v.unresolved; }
    return { total, unresolved, byKind };
  }
}

const groupRule = (groups, name) => groups[name] ?? (name.startsWith('portrait.') ? groups['portrait.generic'] : undefined) ?? {};
const compileList = (rows, field = 'match') => rows.map(r => ({ ...r, re: new RegExp(r[field]) }));
const firstMatch = (list, rel) => list.find(r => r.re.test(rel));

// --------------------------------------------------------------------------------------------- analysis
// Everything the checks and the manifest builder share. Pure with respect to the files (reads only).
export function analyze(ctx) {
  const { view, vanilla } = ctx;
  const g = scanShipped(view, ctx.cfg);
  const rules = compileRules(ctx.families);
  const assetPaths = view.paths.filter(isAssetFile);
  const files = new Map();
  for (const rel of assetPaths) {
    const ext = extOf(rel), bytes = view.read(rel);
    const info = imageInfo(bytes, ext);
    files.set(rel, { rel, ext, bytes: bytes.length, sha256: sha256(bytes), info, cls: classify(rules, rel) });
  }
  // Which shipped file does each name or path point at, and which files does anything reach?
  const byName = basenameIndex(view);
  const referenced = new Map(); // shipped path -> reasons
  const mark = (p, why) => { (referenced.get(p) ?? referenced.set(p, []).get(p)).push(why); };
  const spriteByFile = new Map();
  const unresolved = []; // { kind, file, line, name, path }
  const resolveTexture = (p, dir) => resolveFile(view, vanilla, p, { dir });
  for (const [name, defs] of g.sprites) for (const d of defs) for (const t of d.textures) {
    const r = resolveTexture(t.path, '');
    if (r?.where === 'zin') { mark(r.path, `sprite ${name}`); (spriteByFile.get(r.path) ?? spriteByFile.set(r.path, []).get(r.path)).push(name); }
  }
  for (const [p, refs] of g.fileRefs) { const r = resolveFile(view, vanilla, p, { byName }); if (r?.where === 'zin') for (const x of refs) mark(r.path, x.by); }
  for (const [name, m] of g.meshes) {
    if (m.mesh) { const r = resolveFile(view, vanilla, m.mesh, { dir: m.dir, byName }); if (r?.where === 'zin') mark(r.path, `pdxmesh ${name}`); }
    for (const t of m.textures) { const r = resolveFile(view, vanilla, t.path, { dir: m.dir, byName }); if (r?.where === 'zin') mark(r.path, `pdxmesh ${name} ${t.key}`); }
  }
  for (const [name, a] of g.animations) if (a.anim) { const r = resolveFile(view, vanilla, a.anim, { dir: a.dir, byName }); if (r?.where === 'zin') mark(r.path, `animation ${name}`); }
  for (const m of g.mapRefs) { const r = resolveFile(view, vanilla, m.path, {}); if (r?.where === 'zin') mark(r.path, `${m.file} ${m.key}`); }
  // Provenance links.
  const prov = loadProvenance(view);
  const manifests = loadModuleManifests(view);
  const sources = createSourceResolver({ view, provenance: prov, manifests, rules, tables: ctx.tables });
  const links = new Map();
  for (const [rel, f] of files) if (IMAGE_EXTS.has(f.ext) || f.cls?.rule?.route === 'meshy') links.set(rel, sources.resolve(rel, f.cls));
  return { g, rules, files, byName, referenced, spriteByFile, unresolved, prov, manifests, sources, links, perceptual: new Map() };
}

// Perceptual hashes of the shipped pictures that need them (cached by sha256).
export function perceptualOf(ctx, A, rel) {
  if (A.perceptual.has(rel)) return A.perceptual.get(rel);
  const f = A.files.get(rel); let value = null;
  if (f && IMAGE_EXTS.has(f.ext) && f.info.valid) {
    const cached = ctx.cache.get(f.sha256);
    if (cached) value = cached;
    else {
      const px = decodeRgba(ctx.view.read(rel), f.ext, f.info);
      value = px ? perceptualHashes(px, f.info.width, f.info.height) : null;
      if (value) ctx.cache.set(f.sha256, value);
    }
  }
  A.perceptual.set(rel, value);
  return value;
}

// ----------------------------------------------------------------------------------------------- checks
export function runChecks(ctx, A, manifest = null) {
  const { view, vanilla } = ctx, { g } = A;
  const F = new Findings(), R = new RefCounter(), C = new RefCounter();
  const phase = ctx.phase, late = phase >= 7;
  const shippedSet = new Set(view.paths);
  const notChecked = [];
  const vanillaOk = vanilla.present;
  if (!vanillaOk) F.add('VANILLA_ABSENT', 'warning', '(game)', 'The installed game was not found, so references to vanilla names and files cannot be resolved and are skipped.', 'absent');

  const vSprites = vanillaOk ? vanilla.names('sprites', shippedSet) : new Set();
  const vFonts = vanillaOk ? vanilla.names('fonts', shippedSet) : new Set();
  const vEntities = vanillaOk ? vanilla.names('entities', shippedSet) : new Set();
  const vMeshes = vanillaOk ? vanilla.names('meshes', shippedSet) : new Set();
  const vAnims = vanillaOk ? vanilla.names('animations', shippedSet) : new Set();
  const spriteKnown = name => g.sprites.has(name) || vSprites.has(name);
  const keptRows = compileList(ctx.kept.kept);
  const boundRows = compileList(ctx.bound.bound);
  const sparesRe = compileList(ctx.bound.spares ?? []);
  const kept = new Map(); // vanilla path or sprite -> { reason, uses }
  const keep = (what, reason) => { const k = kept.get(what) ?? kept.set(what, { reason, uses: 0 }).get(what); k.uses++; };

  // ---- AC3 sprites: definitions
  for (const [name, defs] of g.sprites) {
    if (defs.length > 1) F.add('SPRITE_DUPLICATE', 'error', defs[1].file, `Sprite ${name} is defined ${defs.length} times in the shipped files (${defs.map(d => `${d.file}:${d.line}`).join(', ')}).`, name);
    if (vSprites.has(name)) F.add('SPRITE_SHADOWS_VANILLA', 'warning', defs[0].file, `Sprite ${name} also exists in a vanilla file that stays loaded; the engine logs a duplicate.`, name);
    for (const d of defs) {
      for (const t of d.textures) {
        const r = resolveFile(view, vanilla, t.path, {});
        R.ref('sprite_texture', !!r);
        if (!r) {
          const twin = t.path.replace(/\.(tga|png)$/i, '.dds');
          if (twin !== t.path && (view.has(twin) || vanilla.has(twin))) F.add('EXT_ALIAS', 'error', d.file, `Sprite ${name} names ${t.path} but only ${twin} exists. A ZIN sprite names the exact extension of a file that exists.`, `${name}:${t.path}`);
          else if (vanillaOk || shippedSet.has(t.path) === false) F.add('SPRITE_TEXTURE_MISSING', 'error', d.file, `Sprite ${name} (line ${d.line}) names ${t.path}, which is neither shipped nor in the installed game.`, `${name}:${t.path}`);
          continue;
        }
        if (r.caseOnly) F.add('CASE_MISMATCH', 'warning', d.file, `Sprite ${name} names ${t.path} but the shipped file is ${r.path}.`, `${name}:${t.path}`);
        if (r.where === 'vanilla') {
          const row = firstMatch(keptRows, r.path);
          if (row) keep(r.path, row.reason); else F.add('VANILLA_TEXTURE', 'warning', d.file, `Sprite ${name} points at the vanilla texture ${r.path}, which is not on the kept list.`, `${name}:${r.path}`);
        }
        if (d.frames > 1 && r.where === 'zin') {
          const f = A.files.get(r.path);
          if (f?.info.valid && f.info.width % d.frames !== 0 && f.info.height % d.frames !== 0) F.add('SPRITE_FRAMES', 'error', d.file, `Sprite ${name} declares ${d.frames} frames but ${r.path} is ${f.info.width}x${f.info.height}, which they do not divide.`, name);
        }
      }
      if (d.effect) { const r = resolveFile(view, vanilla, d.effect, {}) ?? resolveFile(view, vanilla, d.effect.replace(/\.lua$/i, '.shader'), {}); R.ref('sprite_effect', !!r); if (!r && vanillaOk) F.add('SPRITE_EFFECT_MISSING', 'warning', d.file, `Sprite ${name} names the effect file ${d.effect}, which is not shipped or in the installed game.`, `${name}:${d.effect}`); }
    }
  }
  // ---- AC3/AC4/AC10 sprite uses
  const fallbacks = new Set(ctx.cfg.fallback_sprites);
  const fbPatterns = ctx.cfg.fallback_patterns.map(p => new RegExp(p));
  const catalogFallback = ctx.cfg.catalog_fallback_keys;
  const usedNames = new Set();
  for (const u of g.spriteUses) {
    usedNames.add(u.name);
    const known = spriteKnown(u.name);
    R.ref(u.implicit ? 'sprite_use_implicit' : 'sprite_use', known || !vanillaOk);
    if (!known && vanillaOk) {
      F.add(u.implicit ? 'IMPLICIT_NAME_MISS' : 'SPRITE_UNDEFINED', 'error', u.file, `${u.ctx} at line ${u.line} names ${u.name}, which no shipped or kept vanilla .gfx file defines.`, u.name);
    } else if (known && !g.sprites.has(u.name)) keep(`sprite:${u.name}`, 'vanilla sprite kept loaded');
    if (fallbacks.has(u.name) || fbPatterns.some(re => re.test(u.name))) F.add('FALLBACK_HIT', 'error', u.file, `${u.ctx} at line ${u.line} names the engine fallback sprite ${u.name}; a fallback must never stand where a real picture should be.`, u.name);
    const catKey = catalogFallback.find(k => u.name === `GFX_focus_zin_${k}` || u.name === `GFX_idea_zin_${k}` || u.name === `GFX_zin_evt_${k}` || u.name === `GFX_zin_news_${k}`);
    if (catKey) F.add('FALLBACK_KEY', late ? 'error' : 'warning', u.file, `${u.ctx} at line ${u.line} uses the catalog fallback key ${catKey} (${u.name}). Allowed before phase 7 with a warning.`, u.name);
    if (u.shine) {
      const shine = `${u.name}_shine`, ok = spriteKnown(shine);
      R.ref('focus_shine', ok || !vanillaOk);
      if (!ok && vanillaOk) F.add('IMPLICIT_SHINE_MISSING', 'error', u.file, `Focus icon ${u.name} (line ${u.line}) has no ${shine} sprite; the focus view needs the shine sprite.`, shine);
    }
  }
  for (const f of view.paths.filter(p => p.startsWith('common/national_focus/'))) if (/\bgfx_name_fallback\b/.test(view.text(f))) F.add('FALLBACK_HIT', 'error', f, 'A focus sets gfx_name_fallback; ZIN focuses never rely on a fallback picture.', 'gfx_name_fallback');
  // Defined but never used (information): shipped sprites no shipped file names and no vanilla file overrides.
  const shineOf = new Set([...usedNames].map(n => `${n}_shine`));
  let unusedSprites = 0;
  for (const [name] of g.sprites) if (!usedNames.has(name) && !shineOf.has(name) && !vSprites.has(name)) unusedSprites++;

  // ---- AC7 localisation
  const locDefined = new Set(g.locDefs.keys());
  let vLoc = null;
  const locKnown = key => { if (locDefined.has(key)) return true; vLoc ??= vanillaOk ? vanilla.names('loc') : new Set(); return vLoc.has(key); };
  for (const u of g.locUses) {
    const ok = locKnown(u.key); R.ref('localisation', ok || !vanillaOk);
    if (!ok && vanillaOk) F.add('LOC_KEY_MISSING', 'error', u.file, `Window text at line ${u.line} names the key ${u.key}, which has no value in the English set.`, u.key);
    else if (locDefined.has(u.key) && g.locDefs.get(u.key).value === '') F.add('LOC_EMPTY', 'error', u.file, `The key ${u.key} (line ${u.line}) has an empty value.`, u.key);
  }
  for (const t of g.texticons) {
    // The installed text writes both forms: £name and £GFX_name (the engine finds the sprite GFX_name either way).
    const ok = spriteKnown(`GFX_${t.name}`) || (t.name.startsWith('GFX_') && spriteKnown(t.name)); R.ref('texticon', ok || !vanillaOk);
    if (!ok && vanillaOk) F.add('TEXTICON_MISSING', 'error', t.file, `The text icon £${t.name} (key ${t.key}) has no GFX_${t.name} sprite.`, t.name);
  }
  for (const lf of g.locFiles) {
    if (!lf.bom) F.add('LOC_ENCODING', 'error', lf.file, 'Localisation files are UTF-8 with a byte order mark.', 'bom');
    if (!/^l_[a-z_]+:$/.test(lf.header)) F.add('LOC_ENCODING', 'error', lf.file, `The first line must be an l_<language>: header, not "${lf.header.slice(0, 30)}".`, 'header');
  }

  // ---- AC8 fonts and cursors
  for (const u of g.fonts.uses) { const ok = g.fonts.defs.has(u.name) || vFonts.has(u.name); R.ref('font', ok || !vanillaOk); if (!ok && vanillaOk) F.add('FONT_UNDEFINED', 'error', u.file, `Window font ${u.name} (line ${u.line}) is not defined by a bitmapfont entry.`, u.name); }
  for (const [name, d] of g.fonts.defs) { F.add('FONT_NEW', 'warning', d.file, `ZIN defines the bitmapfont ${name}; the spec keeps vanilla fonts.`, name); if (vFonts.has(name)) F.add('FONT_DUPLICATE', 'error', d.file, `Font ${name} is also defined by a vanilla file that stays loaded.`, name); }
  const vanillaCursors = vanillaOk ? vanilla.cursors() : [];
  const zinCursors = new Set(view.paths.filter(p => p.startsWith('gfx/cursors/')).map(p => path.posix.basename(p).replace(/\.[A-Za-z0-9]+$/, '')));
  for (const c of zinCursors) { R.ref('cursor', !vanillaOk || vanillaCursors.includes(c)); if (vanillaOk && !vanillaCursors.includes(c)) F.add('CURSOR_UNKNOWN', 'warning', `gfx/cursors/${c}`, `ZIN ships the cursor ${c}, which is not one of the installed game's cursor names.`, c); }

  // ---- AC5 entities, meshes, animations
  for (const [name, e] of g.entities) {
    if (e.pdxmesh) {
      const ok = g.meshes.has(e.pdxmesh) || vMeshes.has(e.pdxmesh); R.ref('entity_mesh', ok || !vanillaOk);
      if (!ok && vanillaOk) F.add('ENTITY_MESH_UNDEFINED', 'error', e.file, `Entity ${name} names the pdxmesh ${e.pdxmesh}, which no file defines.`, `${name}:${e.pdxmesh}`);
      const mesh = g.meshes.get(e.pdxmesh);
      if (mesh) for (const s of e.states) if (s.animation) { const ok2 = mesh.animations.has(s.animation); R.ref('entity_state_animation', ok2); if (!ok2) F.add('STATE_ANIMATION_MISSING', 'error', e.file, `Entity ${name} state ${s.name} plays the animation ${s.animation}, which pdxmesh ${e.pdxmesh} does not define.`, `${name}:${s.name}:${s.animation}`); }
    }
    if (e.clone) { const ok = g.entities.has(e.clone) || vEntities.has(e.clone); R.ref('entity_clone', ok || !vanillaOk); if (!ok && vanillaOk) F.add('ENTITY_CLONE_UNDEFINED', 'error', e.file, `Entity ${name} clones ${e.clone}, which no file defines.`, `${name}:${e.clone}`); }
    if (!e.pdxmesh && !e.clone) F.add('ENTITY_EMPTY', 'warning', e.file, `Entity ${name} has neither a pdxmesh nor a clone.`, name);
  }
  for (const [name, m] of g.meshes) {
    if (m.mesh) { const r = resolveFile(view, vanilla, m.mesh, { dir: m.dir, byName: A.byName }); R.ref('mesh_file', !!r); if (!r) F.add('MESH_FILE_MISSING', 'error', m.file, `The pdxmesh ${name} names the mesh ${m.mesh}, which is not shipped or in the installed game.`, `${name}:${m.mesh}`); }
    for (const t of m.textures) { const r = resolveFile(view, vanilla, t.path, { dir: m.dir, byName: A.byName }); R.ref('mesh_texture', !!r); if (!r) F.add('MESH_TEXTURE_MISSING', 'error', m.file, `The pdxmesh ${name} names the ${t.key} ${t.path}, which is not shipped or in the installed game.`, `${name}:${t.path}`); }
    for (const [id, type] of m.animations) { const ok = g.animations.has(type) || vAnims.has(type); R.ref('animation', ok || !vanillaOk); if (!ok && vanillaOk) F.add('ANIMATION_UNDEFINED', 'error', m.file, `The pdxmesh ${name} plays ${id} = ${type}, which no animation entry defines.`, `${name}:${type}`); }
  }
  for (const [name, a] of g.animations) if (a.anim) { const r = resolveFile(view, vanilla, a.anim, { dir: a.dir, byName: A.byName }); R.ref('animation_file', !!r); if (!r) F.add('ANIMATION_FILE_MISSING', 'error', a.file, `Animation ${name} names the file ${a.anim}, which is not shipped or in the installed game.`, `${name}:${a.anim}`); }
  for (const culture of g.cultures.filter(c => /^zin_.+_gfx$/.test(c))) { const e = `${culture}_infantry_entity`, ok = g.entities.has(e); R.ref('culture_entity', ok); if (!ok) F.add('CULTURE_ENTITY_MISSING', 'warning', 'common/graphicalculturetype.txt', `The graphical culture ${culture} has no ${e} entity.`, culture); }

  // ---- AC6 sound and music
  let vSounds = null, vSongs = null;
  const soundKnown = name => g.soundDefs.has(name) || (vSounds ??= vanillaOk ? vanilla.names('soundeffects', shippedSet) : new Set()).has(name);
  const songKnown = name => g.songDefs.has(name) || (vSongs ??= vanillaOk ? vanilla.names('songs', shippedSet) : new Set()).has(name);
  for (const u of g.soundUses) {
    const isSong = /song/i.test(u.ctx ?? ''), ok = isSong ? songKnown(u.name) : soundKnown(u.name);
    R.ref(isSong ? 'song' : 'sound', ok || !vanillaOk);
    if (!ok && vanillaOk) F.add(isSong ? 'SONG_UNDEFINED' : 'SOUND_UNDEFINED', 'error', u.file, `${u.ctx} at line ${u.line} names ${isSong ? 'the song' : 'the sound effect'} ${u.name}, which no asset file defines.`, u.name);
  }
  for (const [name, d] of g.soundDefs) if (d.path) { const r = resolveFile(view, vanilla, `sound/${d.path}`, {}); R.ref('sound_file', !!r); if (!r) F.add('SOUND_FILE_MISSING', 'error', d.file, `Sound ${name.replace(/^sound:/, '')} names ${d.path}, which is not shipped or in the installed game.`, name); else if (r.where === 'zin') { /* referenced */ } }
  for (const [name, d] of g.songDefs) if (d.path) { const r = resolveFile(view, vanilla, `music/${d.path}`, {}); R.ref('music_file', !!r); if (!r) F.add('SOUND_FILE_MISSING', 'error', d.file, `Song ${name} names ${d.path}, which is not shipped or in the installed game.`, name); }

  // ---- map files named by default.map
  for (const m of g.mapRefs) { const r = resolveFile(view, vanilla, m.path, {}); R.ref('map_file', !!r || !vanillaOk); if (!r && vanillaOk) F.add('MAP_FILE_MISSING', 'error', m.file, `default.map ${m.key} names ${m.path}, which is neither shipped nor in the installed game.`, m.path); }

  // ---- AC9 flags and portraits
  const tags = [...new Map(g.tags.map(t => [t.tag, t])).values()];
  const tagSet = new Set(tags.map(t => t.tag));
  for (const t of tags) for (const dir of ['gfx/flags', 'gfx/flags/medium', 'gfx/flags/small']) {
    const p = `${dir}/${t.tag}.tga`, ok = view.has(p); R.ref('flag', ok);
    if (!ok) F.add('FLAG_MISSING', t.dynamic ? 'warning' : 'error', p, `${t.dynamic ? 'Dynamic tag' : 'Tag'} ${t.tag} has no ${p}${t.dynamic ? ' (family X11 is planned; probe AP5)' : ''}.`, p);
  }
  for (const p of view.paths.filter(x => /^gfx\/flags\/(medium\/|small\/)?[A-Za-z0-9]{3}\.tga$/.test(x))) { const tag = path.posix.basename(p, '.tga'); if (tags.length && !tagSet.has(tag)) F.add('FLAG_ORPHAN', 'error', p, `${p} belongs to the tag ${tag}, which no country tag file defines.`, p); }
  const portraitSize = { large: [156, 210], small: [65, 67] };
  for (const c of g.characters) for (const p of c.portraits) {
    const def = g.sprites.get(p.sprite)?.[0]; if (!def) continue;
    const tex = def.textures.find(t => t.key === 'texturefile'); if (!tex) continue;
    const f = A.files.get(tex.path); if (!f?.info.valid) continue;
    const want = portraitSize[p.slot === 'small' ? 'small' : 'large'];
    C.ref('portrait_size', f.info.width === want[0] && f.info.height === want[1]);
    if (f.info.width !== want[0] || f.info.height !== want[1]) F.add('PORTRAIT_SIZE', 'error', c.file, `Portrait ${p.sprite} of ${c.id} is ${f.info.width}x${f.info.height}; ${p.slot} portraits are ${want[0]}x${want[1]}.`, `${p.sprite}`);
  }

  // ---- AC11 orphans
  let orphans = 0, bound = 0, replaces = 0;
  for (const [rel] of A.files) {
    if (A.referenced.has(rel)) continue;
    if (firstMatch(boundRows, rel)) { bound++; continue; }
    if (vanilla.hasInstalled(rel)) { replaces++; continue; }
    if (firstMatch(sparesRe, rel)) continue;
    orphans++;
    F.add('ORPHAN_ASSET', 'error', rel, `${rel} is shipped but no sprite, entity, font, map file or other reference reaches it, and it is not on the bound list.`, rel);
  }

  // ---- AC12 headers, AC13 twins
  const formatRules = compileList(ctx.formats.rules);
  const npot = ctx.formats.power_of_two.map(p => new RegExp(p));
  const stems = new Map();
  const shapeExempt = (ctx.formats.shape_exempt ?? []).map(r => new RegExp(r.match));
  let noRule = 0;
  for (const [rel, f] of A.files) {
    if (!IMAGE_EXTS.has(f.ext)) continue;
    const stem = rel.replace(/\.[^./]+$/, '');
    (stems.get(stem) ?? stems.set(stem, []).get(stem)).push(rel);
    if (!f.info.valid) { F.add('IMAGE_INVALID', 'error', rel, `${rel} is not a readable ${f.ext.toUpperCase()} (${f.info.problem}).`, 'invalid'); continue; }
    const rule = firstMatch(formatRules, rel);
    if (rule) {
      const want = rule.size, bad = [];
      if (f.info.width !== want[0] || f.info.height !== want[1]) bad.push(`size ${f.info.width}x${f.info.height}, expected ${want[0]}x${want[1]}`);
      if (rule.format && f.info.format !== rule.format) bad.push(`format ${f.info.format}, expected ${rule.format}`);
      if (rule.mips !== undefined && f.info.mips !== rule.mips) bad.push(`${f.info.mips} mip levels, expected ${rule.mips}`);
      C.ref('header', bad.length === 0);
      if (bad.length) F.add('SIZE_MISMATCH', 'error', rel, `${rel} breaks the ${rule.id} rule: ${bad.join('; ')}.`, rule.id);
    } else {
      noRule++;
      const inInterface = ctx.formats.defaults.interface_roots.some(r => rel.startsWith(r));
      if (f.ext === 'dds' && inInterface) {
        if (!ctx.formats.defaults.dds_formats.includes(f.info.format)) F.add('FORMAT_UNEXPECTED', 'warning', rel, `${rel} is ${f.info.format}; interface pictures are A8R8G8B8 (or BC3 where the spec says so).`, f.info.format);
        else if (f.info.format === 'a8r8g8b8' && f.info.mips !== ctx.formats.defaults.mips) F.add('FORMAT_UNEXPECTED', 'warning', rel, `${rel} has ${f.info.mips} mip levels; uncompressed interface pictures have one.`, `mips${f.info.mips}`);
      }
    }
    if (npot.some(re => re.test(rel)) && (!isPowerOfTwo(f.info.width) || !isPowerOfTwo(f.info.height))) F.add('NPOT', 'error', rel, `${rel} is ${f.info.width}x${f.info.height}; the engine needs power-of-two sizes here.`, 'npot');
    if (vanilla.present && vanilla.hasInstalled(rel) && !vanilla.isReplaced(rel) && !shapeExempt.some(re => re.test(rel))) {
      const head = vanilla.header(rel), vi = head ? imageInfo(head, f.ext) : null;
      if (vi?.valid) {
        const diff = [];
        if (vi.width !== f.info.width || vi.height !== f.info.height) diff.push(`size ${f.info.width}x${f.info.height} vs ${vi.width}x${vi.height}`);
        if (vi.format !== f.info.format) diff.push(`format ${f.info.format} vs ${vi.format}`);
        if (vi.mips !== f.info.mips) diff.push(`${f.info.mips} mips vs ${vi.mips}`);
        C.ref('replace_shape', diff.length === 0);
        if (diff.length) F.add('REPLACE_SHAPE', 'error', rel, `${rel} replaces a vanilla file but differs from it: ${diff.join('; ')}.`, 'shape');
      }
    }
  }
  for (const [stem, list] of stems) if (list.length > 1) F.add('EXT_TWIN', 'error', list[0], `The stem ${stem} ships as ${list.map(p => extOf(p)).join(' and ')}; a stem must exist under one image extension.`, stem);
  if (vanillaOk) {
    const vstems = new Map();
    for (const r of vanilla.files().keys()) if (IMAGE_EXTS.has(extOf(r))) { const s = r.replace(/\.[^./]+$/, ''); (vstems.get(s) ?? vstems.set(s, []).get(s)).push(extOf(r)); }
    for (const [stem, list] of stems) { const vx = vstems.get(stem); if (vx && !vanilla.isReplaced(list[0]) && !list.some(p => vx.includes(extOf(p)))) F.add('EXT_TWIN_VANILLA', 'warning', list[0], `${stem} ships as ${extOf(list[0])} but the loaded vanilla file is ${vx.join('/')}; both would be loaded.`, stem); }
  }

  // ---- AC14 provenance and clean room
  let linked = 0;
  const provProblems = new Map();
  for (const [rel, l] of A.links) {
    if (l.exempt) continue;
    linked++;
    C.ref('provenance', l.problems.length === 0);
    for (const p of l.problems) {
      // A problem of a source picture is reported once, on the source, with the number of files it affects.
      const where = p.sourcePath ?? rel, k = `${p.code}|${where}|${p.message}`;
      (provProblems.get(k) ?? provProblems.set(k, { p, where, files: [] }).get(k)).files.push(rel);
    }
  }
  for (const { p, where, files } of provProblems.values()) {
    const affects = files.length > 1 || where !== files[0] ? ` (affects ${files.length} shipped file${files.length === 1 ? '' : 's'}, for example ${files[0]})` : '';
    F.add(p.code, 'error', where, `${p.message}${affects}.`, p.message.replace(/\s+/g, ' ').slice(0, 120));
  }
  for (const p of A.manifests.problems) F.add('MANIFEST_PROBLEM', 'error', p.file, p.message, p.message);
  for (const e of A.prov.errors) F.add('PROV_LINE_UNREADABLE', 'error', 'art/source/provenance.jsonl', `Line ${e.line} is not valid JSON (${e.message}).`, String(e.line));
  if (A.prov.missing) F.add('PROV_MISSING', 'error', 'art/source/provenance.jsonl', 'The provenance log is missing.', 'missing');
  if (vanillaOk) {
    const prefixes = [...new Set([...A.files.keys()].map(p => { const parts = p.split('/'); return parts.length > 2 ? `${parts.slice(0, 2).join('/')}/` : `${parts[0]}/`; }))].sort();
    const idx = vanilla.bySize(prefixes), vhash = new Map();
    for (const [rel, f] of A.files) {
      let hit = null;
      if (vanilla.hasInstalled(rel) && vanilla.size(rel) === f.bytes && vanilla.sha(rel) === f.sha256) hit = rel;
      else for (const cand of idx.get(f.bytes) ?? []) { if (extOf(cand) !== f.ext) continue; if (!vhash.has(cand)) vhash.set(cand, vanilla.sha(cand)); if (vhash.get(cand) === f.sha256) { hit = cand; break; } }
      C.ref('vanilla_copy', !hit);
      if (hit) F.add('VANILLA_COPY', 'error', rel, `${rel} is byte-identical to the installed game's ${hit}. Nothing may be copied from the game.`, hit);
    }
  }

  // ---- AC16 uniqueness
  const uniq = uniqueness(ctx, A, F);

  // ---- AC1 manifest
  if (manifest) for (const p of validateManifest(manifest)) F.add('MANIFEST_SCHEMA', 'error', 'art/source/asset_manifest.json', p, p.slice(0, 160));
  else notChecked.push('AC1: no manifest was passed to the check');
  notChecked.push('AC2: tools/content/data/art/inventory.json does not exist yet, so plan and manifest are not compared');
  notChecked.push('AC15: gate flags are owned by the focus compiler and are not yet checked for portraits and event pictures');
  notChecked.push('AC17: tools/content/data/art/meshy_budget.json does not exist yet');
  notChecked.push('AC18: no asset has the state hidden yet');

  const findings = F.list.sort((a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) || (a.code < b.code ? -1 : a.code > b.code ? 1 : 0) || (a.path < b.path ? -1 : a.path > b.path ? 1 : 0) || (a.key < b.key ? -1 : 1));
  const bySeverity = Object.fromEntries(SEVERITIES.map(s => [s, findings.filter(f => f.severity === s).length]));
  const byCode = {}; for (const f of findings) byCode[f.code] = (byCode[f.code] ?? 0) + 1;
  const refs = R.toJSON();
  const familyCounts = {}; for (const [, f] of A.files) { const fam = f.cls?.rule.family ?? '?'; familyCounts[fam] = (familyCounts[fam] ?? 0) + 1; }
  return {
    version: REPORT_VERSION, generator: 'tools/content/checks/assets.mjs', phase,
    counts: {
      shippedFiles: view.paths.filter(p => !p.startsWith('art/') && !p.startsWith('docs/')).length, assetFiles: A.files.size, byFamily: Object.fromEntries(Object.entries(familyCounts).sort(([a], [b]) => (a < b ? -1 : 1))),
      sprites: g.sprites.size, spriteUses: g.spriteUses.length, spritesUnused: unusedSprites, entities: g.entities.size, meshes: g.meshes.size, animations: g.animations.size,
      references: refs.total, unresolved: refs.unresolved, orphans, boundUnreferenced: bound, replacesVanilla: replaces, filesWithoutFormatRule: noRule, provenanceLinked: linked,
      tags: tags.length, locKeys: g.locDefs.size, parseErrors: g.parseErrors.length,
    },
    references: refs, checks: C.toJSON().byKind, bySeverity, byCode,
    uniqueness: uniq,
    kept: { vanillaFilesAndSprites: [...kept].sort(([a], [b]) => (a < b ? -1 : 1)).map(([what, v]) => ({ what, reason: v.reason, uses: v.uses })).slice(0, 200), total: kept.size },
    cursors: { vanilla: vanillaCursors.length, shipped: zinCursors.size },
    vanilla: { present: vanillaOk, mounts: vanilla.mounts.length },
    notChecked,
    findings,
  };
}

// ----------------------------------------------------------------------------------------------- uniqueness
function uniqueness(ctx, A, F) {
  const { g } = A, groups = ctx.uniq.groups;
  const out = { exactGroups: 0, nearPairs: 0, focusIcons: {}, eventPictures: {}, portraits: {} };
  const files = [...A.files.values()].filter(f => IMAGE_EXTS.has(f.ext) && f.info.valid && f.cls);
  // Exact: equal bytes in two different records.
  const bySha = new Map();
  for (const f of files) (bySha.get(f.sha256) ?? bySha.set(f.sha256, []).get(f.sha256)).push(f);
  for (const [sha, list] of [...bySha].sort(([a], [b]) => (a < b ? -1 : 1))) {
    const records = new Set(list.map(f => `${f.cls.rule.family}/${f.cls.m ? substitute(f.cls.rule.key, f.cls.m) : ''}`));
    if (records.size < 2) continue;
    if ((ctx.uniq.aliases ?? []).some(a => list.every(f => a.paths.includes(f.rel)))) continue;
    out.exactGroups++;
    const groupName = list[0].cls.rule.group, rule = groupRule(groups, groupName);
    const severity = rule.exactSeverity ?? 'error';
    const paths = list.map(f => f.rel).sort();
    F.add('UNIQ_EXACT_DUP', severity, paths[0], `${paths.length} different assets share the same bytes (${sha.slice(0, 12)}): ${paths.slice(0, 6).join(', ')}${paths.length > 6 ? ', ...' : ''}.`, sha);
  }
  // Near duplicates per group.
  const byGroup = new Map();
  for (const f of files) { const gname = f.cls.rule.group; if ((groupRule(groups, gname).threshold ?? 0) > 0) (byGroup.get(gname) ?? byGroup.set(gname, []).get(gname)).push(f); }
  for (const [gname, list] of [...byGroup].sort(([a], [b]) => (a < b ? -1 : 1))) {
    const th = groupRule(groups, gname).threshold, sev = ctx.uniq.near_duplicate_severity ?? 'warning';
    const hashes = list.map(f => ({ f, p: perceptualOf(ctx, A, f.rel) })).filter(x => x.p).sort((a, b) => (a.f.rel < b.f.rel ? -1 : 1));
    let pairs = 0;
    for (let i = 0; i < hashes.length; i++) for (let j = i + 1; j < hashes.length; j++) {
      if (hashes[i].f.sha256 === hashes[j].f.sha256) continue; // reported as exact
      const d = phashDistance(hashes[i].p, hashes[j].p);
      if (d < th) { pairs++; if (pairs <= maxPairs) F.add('UNIQ_NEAR_DUPLICATE', sev, hashes[i].f.rel, `${hashes[i].f.rel} and ${hashes[j].f.rel} are ${d} of 64 bits apart (group ${gname}, threshold ${th}).`, `${hashes[j].f.rel}`); }
    }
    out.nearPairs += pairs;
  }
  // Stub files (interim trees and bridges to vanilla names) are placeholders by design: their findings are warnings,
  // and bridge characters of vanilla tags do not take part in the portrait pools.
  const stubWords = (ctx.uniq.stub_files ?? []).map(w => w.toLowerCase()), isStub = file => stubWords.some(w => file.toLowerCase().includes(w)), sev = file => (isStub(file) ? 'warning' : 'error');
  // Focus icons: per tree, per game, and never on a focus and its direct prerequisite.
  const fg = groups.focus_icon ?? {};
  const perGame = new Map(), byId = new Map(g.focuses.map(f => [`${f.tree}/${f.id}`, f]));
  for (const f of g.focuses) {
    const treeCap = f.shared ? (fg.sharedTreeMax ?? 3) : (fg.perTreeMax ?? 2);
    for (const ic of new Set(f.icons)) (perGame.get(ic) ?? perGame.set(ic, []).get(ic)).push(f);
    for (const pre of f.prerequisites) {
      const p = byId.get(`${f.tree}/${pre}`);
      if (p && p.icons.some(i => f.icons.includes(i))) F.add('UNIQ_ICON_PREREQUISITE', sev(f.file), f.file, `Focus ${f.id} shares an icon with its prerequisite ${pre}.`, `${f.tree}/${f.id}`);
    }
    void treeCap;
  }
  const perTree = new Map();
  for (const f of g.focuses) for (const ic of new Set(f.icons)) { const k = `${f.tree}|${ic}`; (perTree.get(k) ?? perTree.set(k, []).get(k)).push(f); }
  for (const [k, list] of [...perTree].sort(([a], [b]) => (a < b ? -1 : 1))) {
    const cap = list[0].shared ? (fg.sharedTreeMax ?? 3) : (fg.perTreeMax ?? 2);
    if (list.length > cap) { const [tree, icon] = k.split('|'); F.add('UNIQ_ICON_TREE_CAP', sev(list[0].file), list[0].file, `Icon ${icon} is used by ${list.length} focuses of tree ${tree}; the cap is ${cap}.`, k); }
  }
  for (const [ic, list] of [...perGame].sort(([a], [b]) => (a < b ? -1 : 1))) {
    out.focusIcons[ic] = list.length;
    if (list.length > (fg.gameMax ?? 40)) F.add('UNIQ_ICON_GAME_CAP', list.every(x => isStub(x.file)) ? 'warning' : 'error', list[0].file, `Icon ${ic} is used by ${list.length} focuses in the game; the cap is ${fg.gameMax ?? 40}.`, ic);
  }
  // Event pictures: the game cap and "no two events one step apart share a picture".
  const eg = groups.event_picture ?? {};
  const evPics = new Map(), evById = new Map(g.events.map(e => [e.id, e]));
  for (const e of g.events) for (const p of new Set(e.pictures)) (evPics.get(p) ?? evPics.set(p, []).get(p)).push(e);
  for (const [p, list] of [...evPics].sort(([a], [b]) => (a < b ? -1 : 1))) { out.eventPictures[p] = list.length; if (list.length > (eg.gameMax ?? 8)) F.add('UNIQ_EVENT_PICTURE_CAP', list.every(x => isStub(x.file)) ? 'warning' : 'error', list[0].file, `Picture ${p} is used by ${list.length} events; the cap is ${eg.gameMax ?? 8}.`, p); }
  for (const l of g.eventLinks) {
    const a = evById.get(l.from), b = evById.get(l.to);
    if (a && b && a.pictures.some(p => b.pictures.includes(p))) F.add('UNIQ_EVENT_CHAIN', sev(l.file), l.file, `Events ${l.from} and ${l.to} are one step apart and share a picture.`, `${l.from}>${l.to}`);
  }
  // Portraits: named portraits once; generic pools by the balancing cap; never twice in one country.
  const uses = new Map(), byCountry = new Map();
  for (const c of g.characters.filter(ch => !isStub(ch.file))) for (const p of c.portraits.filter(x => x.slot === 'large')) {
    (uses.get(p.sprite) ?? uses.set(p.sprite, []).get(p.sprite)).push(c);
    const k = `${c.country}|${p.sprite}`; (byCountry.get(k) ?? byCountry.set(k, []).get(k)).push(c);
  }
  const poolOf = s => /^GFX_zin_portrait_(.+)_(male|female)_\d+$/.exec(s)?.slice(1, 3).join('.');
  const pools = new Map();
  for (const name of g.sprites.keys()) { const p = poolOf(name); if (p) (pools.get(p) ?? pools.set(p, []).get(p)).push(name); }
  const slots = new Map();
  for (const [s, list] of uses) { const p = poolOf(s); if (p) slots.set(p, (slots.get(p) ?? 0) + list.length); }
  for (const [s, list] of [...uses].sort(([a], [b]) => (a < b ? -1 : 1))) {
    out.portraits[s] = list.length;
    const p = poolOf(s);
    if (!p) { if (list.length > 1) F.add('UNIQ_PORTRAIT_NAMED', 'error', list[0].file, `Portrait ${s} is used by ${list.length} characters; a named portrait belongs to one character.`, s); continue; }
    const cap = Math.ceil((slots.get(p) ?? 0) / (pools.get(p)?.length || 1)) + 1;
    if (list.length > cap) F.add('UNIQ_PORTRAIT_POOL', 'error', list[0].file, `Generic portrait ${s} serves ${list.length} characters; the pool ${p} (${pools.get(p)?.length} portraits, ${slots.get(p)} characters) allows ${cap}.`, s);
  }
  for (const [k, list] of byCountry) if (list.length > 1) F.add('UNIQ_PORTRAIT_COUNTRY', 'error', list[0].file, `Characters ${list.map(c => c.id).join(', ')} of one country share the portrait ${k.split('|')[1]}.`, k);
  return out;
}

const substitute = (tpl, m) => tpl.replace(/\$(\d)/g, (_, n) => m[Number(n)] ?? '');

// ---------------------------------------------------------------------------------------------- baseline
export function readBaseline(file = BASELINE_FILE) {
  try { return readJson(file); } catch { return null; }
}
export function baselineOf(report) {
  const keep = report.findings.filter(f => f.severity !== 'info').map(({ code, severity, path: p, message, key }) => ({ code, severity, path: p, message, key }));
  return { version: REPORT_VERSION, note: 'Findings accepted as pre-existing (tools/content/checks/assets.mjs). The build fails only on an error that is not listed here. Regenerate with: node tools/content/checks/assets.mjs --write-baseline.', phase: report.phase, counts: report.counts, references: report.references, bySeverity: report.bySeverity, byCode: report.byCode, uniqueness: report.uniqueness, notChecked: report.notChecked, findings: keep };
}
// Errors in the report that the baseline does not list.
export function newFindings(report, baseline) {
  const known = new Set((baseline?.findings ?? []).map(f => f.key));
  return report.findings.filter(f => f.severity === 'error' && !known.has(f.key));
}
export function fixedFindings(report, baseline) {
  const now = new Set(report.findings.map(f => f.key));
  return (baseline?.findings ?? []).filter(f => !now.has(f.key));
}

export function summaryText(report, { top = 8 } = {}) {
  const c = report.counts, s = report.bySeverity;
  const lines = [`assets: ${c.assetFiles} shipped asset files, ${c.references} references (${c.unresolved} unresolved), ${c.orphans} unreferenced, ${s.error} errors, ${s.warning} warnings, ${s.info} notes`];
  const codes = Object.entries(report.byCode).sort(([a, x], [b, y]) => y - x || (a < b ? -1 : 1)).slice(0, top);
  if (codes.length) lines.push(`  by code: ${codes.map(([k, v]) => `${k} ${v}`).join(', ')}`);
  return lines.join('\n');
}

export function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 1)}\n`);
  fs.renameSync(tmp, file);
}

// ------------------------------------------------------------------------------------------------------ CLI
export function checkAssets(opts = {}, manifest = null) {
  const ctx = loadAssetContext(opts);
  const A = analyze(ctx);
  const report = runChecks(ctx, A, manifest);
  ctx.cache.save();
  return { ctx, A, report };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), opt = name => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
  const root = opt('root') ?? ZIN;
  let staged = null;
  if (opt('staged')) {
    staged = new Map();
    const walkStaged = (dir, base) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const full = `${dir}/${e.name}`; if (e.isDirectory()) walkStaged(full, `${base}${e.name}/`); else staged.set(`${base}${e.name}`, fs.readFileSync(full)); } };
    walkStaged(opt('staged').replace(/\\/g, '/'), '');
  }
  const { report } = checkAssets({ root, staged, game: opt('game') ?? GAME, phase: Number(opt('phase') ?? 1) });
  console.log(summaryText(report, { top: 12 }));
  const baseline = readBaseline(opt('baseline') ?? BASELINE_FILE), fresh = newFindings(report, baseline);
  if (opt('report')) writeJsonAtomic(opt('report'), report);
  if (args.includes('--write-baseline')) { writeJsonAtomic(opt('baseline') ?? BASELINE_FILE, baselineOf(report)); console.log(`baseline written: ${(opt('baseline') ?? BASELINE_FILE)}`); }
  else {
    console.log(baseline ? `${fresh.length} new errors against the baseline (${fixedFindings(report, baseline).length} baseline findings fixed)` : 'no baseline file; every error is new');
    for (const f of fresh.slice(0, 30)) console.log(`  ${f.code} ${f.path}: ${f.message}`);
    if (fresh.length) process.exitCode = 1;
  }
}

