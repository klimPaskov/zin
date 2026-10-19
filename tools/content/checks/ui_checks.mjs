// The nine builder checks of the interface reskin (spec docs/specs/07_interface/02_full_ui_reskin.md, "Builder checks").
// Each check is a function that returns { id, name, status, problems, pending, notes } where status is
//   pass     the check ran and found nothing
//   fail     problems is not empty (the build stops)
//   pending  nothing could be decided yet, because art or the installed game is missing; pending lists what waits
// A check never throws for a bad input file: it reports it. `files` is a Map of staged path -> Buffer (staged.files).
//
//   1 checkInventoryFreshness   2 checkCoverage   3 checkShape        4 checkReachability  5 checkNoVanillaPixels
//   6 checkProvenance           7 checkLuminance  8 checkOverrides     9 checkDeterminism
//   runUiChecks(ctx)            runs every check its inputs allow
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { GAME } from '../lib/paths.mjs';
import { parse } from '../lib/clausewitz.mjs';
import { readHeader, decodeRgba, measure, perceptualHash, hashDistance, extOf } from '../lib/image_codec.mjs';
import { acceptance } from '../modules/presentation.mjs';
import { verifyInventory, readText, interfaceFiles } from '../modules/ui_inventory.mjs';
import { validateReskin, textureIndex, vanillaFileOf } from '../modules/ui_reskin.mjs';
import { windowState, framesOf, ENGINE_DEFAULTS, OVERRIDE_FILES } from '../lib/ui_plan.mjs';

export const PHASH_THRESHOLD = 6;      // proposed; tune on the first accepted sheet and record the value in the spec
const sha16 = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 16);
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const ord = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const result = (id, name, problems, pending = [], notes = {}) => ({ id, name, status: problems.length ? 'fail' : pending.length ? 'pending' : 'pass', problems, pending, notes });
const toMap = files => files instanceof Map ? files : files?.files instanceof Map ? files.files : new Map(Object.entries(files ?? {}));
// Staged paths compare case-insensitively with the inventory: the engine's file system does.
const lowerIndex = files => { const m = new Map(); for (const [k, v] of toMap(files)) m.set(k.toLowerCase(), { path: k, bytes: v }); return m; };

// ---------------------------------------------------------------------------------------------------- 1
export function checkInventoryFreshness({ inventory, game = GAME, deep = false } = {}) {
  if (!game || !existsSync(`${game}/launcher-settings.json`)) return result(1, 'inventory freshness', [], [`installed game not found at ${game}`]);
  const v = verifyInventory({ inventory, game, deep });
  return result(1, 'inventory freshness', v.problems.map(m => ({ code: 'fresh.changed', message: m })), [], { changedFiles: v.changedFiles, changedSprites: v.changedSprites });
}

// ---------------------------------------------------------------------------------------------------- 2
export function checkCoverage({ inventory, reskin, sheets }) {
  const problems = validateReskin({ inventory, reskin, sheets });
  return result(2, 'coverage', problems, [], { rows: reskin.rows.length, sprites: inventory.sprites.length });
}

// ---------------------------------------------------------------------------------------------------- 3
// Expected size of a DDS A8R8G8B8 file with no mipmaps.
const ddsLength = (w, h) => 128 + w * h * 4;
export function checkShape({ inventory, reskin, files }) {
  const problems = [], pending = [], add = (code, name, message) => problems.push({ code, name, message });
  const idx = lowerIndex(files), byName = new Map(inventory.sprites.map(s => [s.name, s])), tex = textureIndex(inventory);
  const seen = new Set(), rTextures = new Set();
  for (const row of reskin.rows) {
    if (row.disposition !== 'R') continue;
    const s = byName.get(row.name);
    if (!s?.texture) continue;
    const key = s.texture.toLowerCase();
    rTextures.add(key);
    if (seen.has(key)) continue;
    seen.add(key);
    const hit = idx.get(key);
    if (!hit) { if ((row.writer ?? 'reskin') === 'reskin') pending.push(s.texture); continue; }
    const where = s.texture, ext = extOf(s.texture), h = readHeader(hit.bytes, ext);
    if (hit.path !== s.texture) add('shape.path', where, `shipped as ${hit.path}; the vanilla path and case are ${s.texture}`);
    if (!h.valid) { add('shape.header', where, h.problem ?? 'invalid header'); continue; }
    if (h.width !== s.width || h.height !== s.height) add('shape.size', where, `${h.width}x${h.height}, the vanilla file is ${s.width}x${s.height}`);
    const frames = tex.get(key)?.frames ?? 1;
    if (frames > 1 && h.width % frames) add('shape.frames', where, `width ${h.width} is not divisible by ${frames} frames`);
    if (ext === 'dds') {
      if (h.format !== 'a8r8g8b8') add('shape.format', where, `DDS format ${h.format}, expected a8r8g8b8`);
      else if (hit.bytes.length !== ddsLength(h.width, h.height) || (h.mips ?? 1) > 1) add('shape.dds', where, `DDS length ${hit.bytes.length} (expected ${ddsLength(h.width, h.height)}, no mipmaps)`);
    } else if (ext === 'tga') {
      if (h.bpp !== 32) add('shape.format', where, `TGA ${h.bpp}-bit, expected 32`);
      const want = s.origin === 'top';
      if (h.topOrigin !== want) add('shape.origin', where, `TGA origin ${h.topOrigin ? 'top' : 'bottom'}-left, the vanilla file is ${s.origin ?? 'bottom'}-left`);
      if (hit.bytes.length !== 18 + h.width * h.height * 4) add('shape.tga', where, `TGA length ${hit.bytes.length}`);
    } else if (ext === 'png') {
      if (h.colorType !== 6 || h.interlaced) add('shape.format', where, 'PNG must be 32-bit RGBA, not interlaced');
    } else if (ext === 'cur' || ext === 'ico') {
      if (s.hotspot && JSON.stringify(h.hotspot) !== JSON.stringify(s.hotspot)) add('shape.hotspot', where, `hotspot ${JSON.stringify(h.hotspot)}, the vanilla file has ${JSON.stringify(s.hotspot)}`);
    } else if (ext === 'ani') {
      if (s.hotspot && JSON.stringify(h.hotspot) !== JSON.stringify(s.hotspot)) add('shape.hotspot', where, `hotspot ${JSON.stringify(h.hotspot)}, the vanilla file has ${JSON.stringify(s.hotspot)}`);
    }
  }
  // A shipped file at the vanilla path of a texture that is not R would hide a missing or wrong row.
  const nonR = new Map();
  for (const row of reskin.rows) { const s = byName.get(row.name); if (s?.texture && row.disposition !== 'R') nonR.set(s.texture.toLowerCase(), row); }
  // gfx/loadingscreens/ is a replaced folder that modules/presentation.mjs fills (the 24 ZIN screens and every file that kept sprites name there), so
  // the main-menu `O` sprites that point at load_N.dds legitimately find a shipped file at that path.
  for (const [key, row] of [...nonR].sort(([a], [b]) => ord(a, b))) if (!rTextures.has(key) && idx.has(key) && !key.startsWith('gfx/loadingscreens/')) add('shape.unexpected_output', idx.get(key).path, `a file ships at the vanilla path of ${row.name}, which is ${row.disposition}`);
  return result(3, 'shape', problems, pending.sort(ord), { checked: seen.size });
}

// ---------------------------------------------------------------------------------------------------- 4
// Which sprite names a script token can mean: itself and the prefixes the engine adds for pictures and icons.
export function candidateNames(token) {
  return [token, `GFX_${token}`, `GFX_idea_${token}`, `GFX_decision_${token}`, `GFX_decision_category_${token}`, `GFX_${token}_medium`, `GFX_focus_${token}`, `GFX_trait_${token}`, `GFX_${token}_icon`];
}
// The sprites a set of script or localisation texts can name: identifiers, and £icon names in text.
export function scriptReferences(texts, inventory) {
  const lower = new Map(); for (const s of inventory.sprites) lower.set(s.name.toLowerCase(), s.name);
  const byTexture = new Map(); for (const s of inventory.sprites) if (s.texture) byTexture.set(s.texture.toLowerCase(), s.name);
  const hit = new Set();
  for (const text of texts) {
    for (const m of text.matchAll(/[A-Za-z][A-Za-z0-9_.\-/]{2,}/g)) {
      const t = m[0];
      for (const c of candidateNames(t)) { const n = lower.get(c.toLowerCase()); if (n) hit.add(n); }
      if (t.includes('/')) { const n = byTexture.get(t.toLowerCase()); if (n) hit.add(n); }
    }
    for (const m of text.matchAll(/£([A-Za-z0-9_]+)/g)) { const n = lower.get(`gfx_${m[1]}`.toLowerCase()); if (n) hit.add(n); }
  }
  return hit;
}
export function checkReachability({ inventory, reskin, scriptRefs = new Set(), extraRefs = new Set() }) {
  const problems = [], byName = new Map(inventory.sprites.map(s => [s.name, s]));
  const fromScripts = new Set([...scriptRefs].map(n => n.toLowerCase())), fromEngine = new Set([...ENGINE_DEFAULTS, ...(reskin.header?.engineDefaults ?? []), ...extraRefs].map(n => n.toLowerCase()));
  for (const row of reskin.rows) {
    if (row.disposition !== 'U' && row.disposition !== 'H') continue;
    const s = byName.get(row.name);
    if (!s) continue;
    const via = [];
    for (const [file, windows] of Object.entries(s.refs ?? {})) for (const w of windows) if (windowState(file, w).state === 'reachable') via.push(`window ${w} (${file})`);
    if (fromScripts.has(row.name.toLowerCase()) || (s.texture && fromScripts.has(s.texture.toLowerCase()))) via.push('a loaded script or text icon');
    if (fromEngine.has(row.name.toLowerCase())) via.push('the engine default list');
    if (via.length) problems.push({ code: 'reach.reachable', name: row.name, message: `${row.name} is ${row.disposition} (${row.reason}) but is reached from ${via.slice(0, 3).join(', ')}` });
  }
  return result(4, 'reachability', problems);
}

// ---------------------------------------------------------------------------------------------------- 5
function greyStd(rgba) {
  let n = 0, sum = 0, sq = 0;
  for (let i = 0; i < rgba.length; i += 4) if (rgba[i + 3] >= 128) { const g = 0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]; n++; sum += g; sq += g * g; }
  return n ? Math.sqrt(Math.max(0, sq / n - (sum / n) ** 2)) : 0;
}
export async function checkNoVanillaPixels({ inventory, reskin, files, game = GAME, threshold = PHASH_THRESHOLD }) {
  const problems = [], pending = [], notes = { compared: 0, inconclusive: 0 };
  const idx = lowerIndex(files), byName = new Map(inventory.sprites.map(s => [s.name, s])), done = new Set();
  for (const row of reskin.rows) {
    if (row.disposition !== 'R') continue;
    const s = byName.get(row.name);
    if (!s?.texture || done.has(s.texture.toLowerCase())) continue;
    done.add(s.texture.toLowerCase());
    const hit = idx.get(s.texture.toLowerCase());
    if (!hit) { if ((row.writer ?? 'reskin') === 'reskin') pending.push(s.texture); continue; }
    if (s.hash && sha16(hit.bytes) === s.hash) { problems.push({ code: 'pixels.byte_copy', name: s.texture, message: `${s.texture} equals the vanilla file byte for byte` }); continue; }
    const ext = extOf(s.texture);
    if (!['dds', 'tga', 'png'].includes(ext)) continue;
    const vfile = vanillaFileOf(s, game);
    if (!existsSync(vfile)) { pending.push(`${s.texture} (no vanilla file to compare)`); continue; }
    const a = await decodeRgba(readFileSync(vfile), ext), b = await decodeRgba(hit.bytes, ext);
    if (!a || !b || a.width !== b.width || a.height !== b.height) { notes.inconclusive++; continue; }
    // A flat or empty picture hashes to nothing: its distance proves nothing either way.
    const flat = px => { const m = measure(px.data, px.width, px.height); return m.alpha === 'empty' || greyStd(px.data) < 3; };
    if (flat(a) || flat(b)) { notes.inconclusive++; continue; }
    const d = hashDistance(perceptualHash(a.data, a.width, a.height), perceptualHash(b.data, b.width, b.height));
    notes.compared++;
    if (d <= threshold) problems.push({ code: 'pixels.perceptual', name: s.texture, message: `${s.texture} is within ${d} bits of the vanilla picture (threshold ${threshold}); a copy may have slipped in` });
  }
  return result(5, 'no vanilla pixels', problems, pending.sort(ord), notes);
}

// ---------------------------------------------------------------------------------------------------- 6
export function checkProvenance({ manifest, files, provenance, inventory, reskin }) {
  const problems = [], pending = [], idx = lowerIndex(files), lines = provenance ?? [];
  const byOut = new Map((manifest?.files ?? []).map(m => [m.out.toLowerCase(), m]));
  const byName = new Map(inventory.sprites.map(s => [s.name, s])), seen = new Set();
  for (const row of reskin.rows) {
    if (row.disposition !== 'R' || (row.writer ?? 'reskin') !== 'reskin') continue;
    const s = byName.get(row.name);
    if (!s?.texture || seen.has(s.texture.toLowerCase())) continue;
    seen.add(s.texture.toLowerCase());
    const shipped = idx.get(s.texture.toLowerCase());
    if (!shipped) { pending.push(s.texture); continue; }
    const m = byOut.get(s.texture.toLowerCase());
    if (!m) { problems.push({ code: 'prov.no_manifest_line', name: s.texture, message: `${s.texture} ships without a manifest line` }); continue; }
    if (m.sha256 !== sha256(shipped.bytes)) problems.push({ code: 'prov.hash', name: s.texture, message: `${s.texture}: manifest hash does not match the shipped bytes` });
    const src = idx.get(String(m.source).toLowerCase());
    if (!src) { problems.push({ code: 'prov.source_missing', name: s.texture, message: `${s.texture}: source ${m.source} is not staged` }); continue; }
    if (sha256(src.bytes) !== m.sourceSha256) { problems.push({ code: 'prov.source_hash', name: s.texture, message: `${s.texture}: source bytes differ from the manifest hash` }); continue; }
    const rel = String(m.source).replace(/^art\/source\//, '');
    const acc = acceptance(lines, rel, src.bytes);
    if (!acc.ok) problems.push({ code: 'prov.not_accepted', name: s.texture, message: `${s.texture}: source ${m.source} has no accepted review line (${acc.why})` });
  }
  // A manifest line for a file that does not ship is a stale record.
  for (const m of byOut.values()) if (!idx.has(m.out.toLowerCase())) problems.push({ code: 'prov.stale', name: m.out, message: `manifest line for ${m.out}, which is not shipped` });
  return result(6, 'provenance', problems, pending.sort(ord));
}

// ---------------------------------------------------------------------------------------------------- 7
export async function checkLuminance({ inventory, reskin, files }) {
  const problems = [], pending = [], idx = lowerIndex(files), byName = new Map(inventory.sprites.map(s => [s.name, s])), seen = new Set();
  for (const row of reskin.rows) {
    if (row.disposition !== 'R') continue;
    const s = byName.get(row.name);
    if (!s?.texture || seen.has(s.texture.toLowerCase())) continue;
    seen.add(s.texture.toLowerCase());
    const hit = idx.get(s.texture.toLowerCase());
    if (!hit) { if ((row.writer ?? 'reskin') === 'reskin') pending.push(s.texture); continue; }
    if (!['dark', 'mid', 'light'].includes(s.luminance)) continue;
    const ext = extOf(s.texture);
    if (!['dds', 'tga', 'png'].includes(ext)) continue;
    const px = await decodeRgba(hit.bytes, ext);
    if (!px) { problems.push({ code: 'luma.unreadable', name: s.texture, message: `${s.texture} cannot be decoded` }); continue; }
    const m = measure(px.data, px.width, px.height);
    if (m.luminance !== s.luminance) problems.push({ code: 'luma.class', name: s.texture, message: `${s.texture} is ${m.luminance} (mean ${m.luma}), the vanilla class is ${s.luminance}; engine text colours are bound to it` });
  }
  return result(7, 'luminance', problems, pending.sort(ord));
}

// ---------------------------------------------------------------------------------------------------- 8
// Every name = "..." value of a .gui or .gfx file: windows, elements and sprites.
export function elementNames(text) {
  const names = new Set();
  const walk = entries => { for (const e of entries) { if (Array.isArray(e.v)) walk(e.v); else if (typeof e.v === 'string' && e.k && e.k.toLowerCase() === 'name' && e.v) names.add(e.v.toLowerCase()); } };
  walk(parse(text));
  return names;
}
export function checkOverrides({ files, game = GAME, allowed = OVERRIDE_FILES, vanillaFiles }) {
  const problems = [], pending = [], idx = toMap(files);
  const vanilla = vanillaFiles ?? new Map(interfaceFiles(game).filter(f => f.root.id === 'base').map(f => [f.rel.toLowerCase(), f.abs]));
  const allow = new Set(allowed.map(a => a.toLowerCase()));
  let checked = 0;
  for (const [path, bytes] of [...idx].sort(([a], [b]) => ord(a, b))) {
    const low = path.toLowerCase();
    if (!/^interface\/.*\.(gui|gfx)$/.test(low) || !vanilla.has(low)) continue;
    if (!allow.has(low)) { problems.push({ code: 'overrides.unlisted', name: path, message: `${path} shadows a vanilla file that is not on the closed list of overrides (spec 02 section 2.3)` }); continue; }
    checked++;
    const src = vanilla.get(low), vbytes = typeof src === 'string' ? (existsSync(src) ? readFileSync(src) : null) : src;
    if (!vbytes) { pending.push(`${path}: no vanilla file to compare element names`); continue; }
    const want = elementNames(readText(vbytes)), have = elementNames(readText(bytes));
    const lost = [...want].filter(n => !have.has(n)).sort(ord);
    if (lost.length) problems.push({ code: 'overrides.dropped', name: path, message: `${path} drops ${lost.length} bound name(s) of the vanilla file: ${lost.slice(0, 8).join(', ')}` });
  }
  return result(8, 'overrides', problems, pending, { checked });
}

// ---------------------------------------------------------------------------------------------------- 9
// `build` is an async function that returns a Staged (or a Map of path -> bytes); it runs twice.
export async function checkDeterminism({ build }) {
  const a = toMap(await build()), b = toMap(await build()), problems = [];
  for (const k of [...new Set([...a.keys(), ...b.keys()])].sort(ord)) {
    const x = a.get(k), y = b.get(k);
    if (!x || !y) problems.push({ code: 'det.missing', name: k, message: `${k} exists in only one of two builds` });
    else if (!x.equals(y)) problems.push({ code: 'det.differs', name: k, message: `${k} differs between two builds` });
  }
  return result(9, 'determinism', problems, [], { files: a.size });
}

// ---------------------------------------------------------------------------------------------------- all
// ctx: { inventory, reskin, sheets, files, game, manifest, provenance, scriptRefs, build, deep }. A check whose inputs are
// missing is left out of the report.
export async function runUiChecks(ctx) {
  const out = [];
  if (ctx.inventory) out.push(checkInventoryFreshness(ctx));
  if (ctx.inventory && ctx.reskin && ctx.sheets) out.push(checkCoverage(ctx));
  if (ctx.inventory && ctx.reskin && ctx.files) out.push(checkShape(ctx));
  if (ctx.inventory && ctx.reskin) out.push(checkReachability(ctx));
  if (ctx.inventory && ctx.reskin && ctx.files) out.push(await checkNoVanillaPixels(ctx));
  if (ctx.inventory && ctx.reskin && ctx.files) out.push(checkProvenance({ ...ctx, manifest: ctx.manifest ?? safeManifest(ctx.files) }));
  if (ctx.inventory && ctx.reskin && ctx.files) out.push(await checkLuminance(ctx));
  if (ctx.files) out.push(checkOverrides(ctx));
  if (ctx.build) out.push(await checkDeterminism(ctx));
  return { ok: out.every(c => c.status !== 'fail'), pending: out.filter(c => c.status === 'pending').map(c => c.id), checks: out.sort((a, b) => a.id - b.id) };
}
function safeManifest(files) {
  const f = lowerIndex(files).get('art/source/reskin_manifest.json');
  return f ? JSON.parse(f.bytes.toString('utf8')) : { files: [] };
}
