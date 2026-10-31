// The nine builder checks of the interface reskin (spec docs/specs/07_interface/02_full_ui_reskin.md, "Builder checks"), and the
// design-system checks 10 to 18 of the UI overhaul (docs/specs/07_interface/07_design_system.md §9), reported in every build and
// enforced only in a release build (runDesignChecks, enforced, GATED_FROM).
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
import { droppedVanillaText } from '../lib/tech_tree_gui.mjs';
import { createHash } from 'node:crypto';
import { GAME } from '../lib/paths.mjs';
import { parse } from '../lib/clausewitz.mjs';
import { readHeader, decodeRgba, measure, perceptualHash, hashDistance, hashSupport, contentDifference, extOf } from '../lib/image_codec.mjs';
import { acceptance } from '../modules/presentation.mjs';
import { verifyInventory, readText, interfaceFiles } from '../modules/ui_inventory.mjs';
import { validateReskin, textureIndex, vanillaFileOf } from '../modules/ui_reskin.mjs';
import { windowState, framesOf, ENGINE_DEFAULTS, OVERRIDE_FILES } from '../lib/ui_plan.mjs';
import { fileURLToPath } from 'node:url';
import { iconRegistry, loadShares, loadDesign, validateShares, SHARE_KINDS } from '../modules/icon_registry.mjs';

// Check 5 thresholds, tuned on the first 48 accepted sheets (1,914 compared textures) and recorded in the spec and in
// docs/design/stage2/ui_infrastructure.md, item 9. A picture is a suspected copy of its vanilla file only when all three hold:
//   its difference hash lies within PHASH_THRESHOLD bits of the vanilla hash (of 64; the larger of dhash and ahash),
//   the vanilla picture says enough to the hash (at least PHASH_MIN_SUPPORT of 64 decisive comparisons; a flat bar, a plain
//     panel or a thin line has none and hashes alike for any two unrelated pictures, so the pair is inconclusive), and
//   the two pictures are alike where they have content (mean colour difference at most CONTENT_LIMIT of 255; a re-encoded copy
//     stays near 0, a frame or bar that merely shares the vanilla layout differs by 14 or more in every measured case).
// Byte-identical files are always rejected, whatever the picture.
export const PHASH_THRESHOLD = 6;
export const PHASH_MIN_SUPPORT = 20;
export const CONTENT_LIMIT = 12;
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
export async function checkNoVanillaPixels({ inventory, reskin, files, game = GAME, threshold = PHASH_THRESHOLD, minSupport = PHASH_MIN_SUPPORT, contentLimit = CONTENT_LIMIT }) {
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
    if (flat(a) || flat(b) || hashSupport(a.data, a.width, a.height) < minSupport) { notes.inconclusive++; continue; }
    const d = hashDistance(perceptualHash(a.data, a.width, a.height), perceptualHash(b.data, b.width, b.height));
    if (d > threshold) { notes.compared++; continue; }
    const diff = contentDifference(a.data, b.data, a.width, a.height);
    if (diff === null) { notes.inconclusive++; continue; }
    notes.compared++;
    if (diff <= contentLimit) problems.push({ code: 'pixels.perceptual', name: s.texture, message: `${s.texture} is within ${d} bits of the vanilla picture (threshold ${threshold}) and ${Math.round(diff * 10) / 10} levels from it in colour (limit ${contentLimit}); a copy may have slipped in` });
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
  let free = 0;
  const problems = [], pending = [], idx = lowerIndex(files), byName = new Map(inventory.sprites.map(s => [s.name, s])), seen = new Set();
  for (const row of reskin.rows) {
    if (row.disposition !== 'R') continue;
    const s = byName.get(row.name);
    if (!s?.texture || seen.has(s.texture.toLowerCase())) continue;
    seen.add(s.texture.toLowerCase());
    const hit = idx.get(s.texture.toLowerCase());
    if (!hit) { if ((row.writer ?? 'reskin') === 'reskin') pending.push(s.texture); continue; }
    if (!['dark', 'mid', 'light'].includes(s.luminance)) continue;
    if (row.luma === 'free') { free++; continue; }   // an emblem: no text is drawn over it, so no text colour is bound to it
    const ext = extOf(s.texture);
    if (!['dds', 'tga', 'png'].includes(ext)) continue;
    const px = await decodeRgba(hit.bytes, ext);
    if (!px) { problems.push({ code: 'luma.unreadable', name: s.texture, message: `${s.texture} cannot be decoded` }); continue; }
    const m = measure(px.data, px.width, px.height);
    if (m.luminance !== s.luminance) problems.push({ code: 'luma.class', name: s.texture, message: `${s.texture} is ${m.luminance} (mean ${m.luma}), the vanilla class is ${s.luminance}; engine text colours are bound to it` });
  }
  return result(7, 'luminance', problems, pending.sort(ord), { free });
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
    // The technology tree window drops the vanilla folders' windows, tabs and items on purpose (lib/tech_tree_gui.mjs): their names, and
    // only theirs, are excused.
    const excused = low === 'interface/countrytechtreeview.gui' ? elementNames(droppedVanillaText(readText(vbytes))) : new Set();
    const lost = [...want].filter(n => !have.has(n) && !excused.has(n)).sort(ord);
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

// ==================================================================================================== 10 to 18
// The design-system checks of the UI overhaul (docs/plans/ui_overhaul/02_plan.md, "Checks to add"; rules in
// docs/specs/07_interface/07_design_system.md §9). They report in every build and are enforced only in a release build
// (ZIN_RELEASE=1, see GATED_FROM) until the phases that satisfy them land. Their inputs: the icon registry (modules/icon_registry.mjs),
// the share list (data/ui/icon_shares.json), the design data (data/ui/design_system.json) and the staged files.
export const GATED_FROM = 10;
export const NOISE_LIMIT = 0.05, SEAM_LIMIT = 0.02, SCALE_LIMIT = 1.0, STATE_DIFF_MIN = 0.03, DISABLED_SAT_MAX = 0.15;
const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
async function decodedStaged(idx, rel) {
  const hit = idx.get(String(rel).toLowerCase());
  if (!hit) return null;
  try { return await decodeRgba(hit.bytes, extOf(rel)); } catch { return null; }
}

// ---------------------------------------------------------------------------------------------------- 10
// Every texture that serves two or more concepts (inside a family or across families) must be covered by one share entry of an allowed
// kind that names all of them. The share list itself must be valid and must not name concepts that do not exist.
export function checkIconRegistry({ registry, shares }) {
  const problems = [], notes = { textures: registry.textures.size, sharedTextures: 0, unexplainedTextures: 0, conceptsOnUnexplained: 0, explainedTextures: 0 };
  for (const p of validateShares(shares)) problems.push({ code: 'shares.invalid', name: 'icon_shares.json', message: p });
  const known = new Set(registry.concepts.map(c => `${c.family}:${c.id}`)), entryOf = new Map();
  for (const s of shares.shares ?? []) for (const c of s.concepts ?? []) { if (!known.has(c)) problems.push({ code: 'shares.stale', name: s.id, message: `${s.id} names ${c}, which is not a concept of this build` }); entryOf.set(c, s); }
  for (const [tex, list] of [...registry.textures].sort(([a], [b]) => ord(a, b))) {
    if (list.length < 2) continue;
    notes.sharedTextures++;
    const entries = new Set(list.map(c => entryOf.get(c)));
    const covered = entries.size === 1 && !entries.has(undefined) && SHARE_KINDS.includes([...entries][0].kind);
    if (covered) { notes.explainedTextures++; continue; }
    notes.unexplainedTextures++; notes.conceptsOnUnexplained += list.length;
    const fams = [...new Set(list.map(c => c.split(':')[0]))].sort(ord);
    problems.push({ code: 'icon.unexplained_share', name: tex, message: `${tex} serves ${list.length} concepts (${fams.join(', ')}: ${list.slice(0, 4).join(', ')}${list.length > 4 ? ', ...' : ''}) without one deliberate share entry` });
  }
  return result(10, 'icon.registry', problems, [], notes);
}

// ---------------------------------------------------------------------------------------------------- 11
// No sprite ZIN defines may draw a listed placeholder texture (the shared frame); the frame's own sprite is exempt.
export function checkIconPlaceholder({ sprites, design }) {
  const problems = [], placeholders = new Set((design.placeholderTextures ?? []).map(t => t.toLowerCase())), owners = new Set((design.placeholderOwners ?? []).map(n => n.toLowerCase())), byTexture = {};
  for (const s of [...sprites.values()].sort((a, b) => ord(a.name, b.name))) {
    if (s.origin !== 'mod' || !placeholders.has(s.texture) || owners.has(s.name.toLowerCase())) continue;
    byTexture[s.texture] = (byTexture[s.texture] ?? 0) + 1;
    problems.push({ code: 'icon.placeholder', name: s.name, message: `${s.name} (${s.file}) draws the placeholder ${s.texture}` });
  }
  return result(11, 'icon.placeholder', problems, [], { placeholders: [...placeholders], byTexture });
}

// ---------------------------------------------------------------------------------------------------- 12
// Each family's textures have the family's size and frame count (data/ui/design_system.json iconFamilies); a texture the family needs
// exists; a texture is used by one family only unless a share entry covers it (that part is also seen by check 10, from the family side).
export function checkIconFamilySize({ registry, shares, design, files, game = GAME }) {
  const problems = [], idx = lowerIndex(files), fams = design.iconFamilies ?? {}, notes = { checked: 0, vanilla: 0 };
  const seen = new Set();
  for (const c of registry.concepts) {
    if (!c.texture || c.frame !== undefined) continue;
    const key = `${c.family}|${c.texture}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const spec = fams[c.family], hit = idx.get(c.texture);
    if (!hit) {
      if (existsSync(`${game}/${c.texture}`)) { notes.vanilla++; continue; }
      problems.push({ code: 'family.missing', name: c.texture, message: `${c.family} ${c.id}: ${c.sprite} names ${c.texture}, which neither ZIN nor the game ships` });
      continue;
    }
    if (!spec) continue;
    notes.checked++;
    const h = readHeader(hit.bytes, extOf(c.texture)), frames = registry.sprites.get(String(c.sprite).toLowerCase())?.frames ?? 1;
    const want = { w: spec.size[0] * spec.frames, h: spec.size[1] };
    if (!h.valid || h.width !== want.w || h.height !== want.h || frames !== spec.frames) problems.push({ code: 'family.size', name: c.texture, message: `${c.family} ${c.id}: ${c.texture} is ${h.width}x${h.height} with ${frames} frame(s); the family is ${spec.size[0]}x${spec.size[1]} with ${spec.frames}` });
  }
  const covered = new Set((shares.shares ?? []).filter(s => SHARE_KINDS.includes(s.kind)).map(s => s.concepts ?? []).filter(cs => new Set(cs.map(x => x.split(':')[0])).size > 1).flat());
  for (const x of registry.crossFamily) {
    const members = registry.textures.get(x.texture) ?? [];
    if (members.length && members.every(m => covered.has(m))) continue;
    problems.push({ code: 'family.cross', name: x.texture, message: `${x.texture} is used by ${x.families.join(', ')} without a share entry` });
  }
  return result(12, 'icon.family_size', problems, [], notes);
}

// ---------------------------------------------------------------------------------------------------- 13
// Every level-0 window texture (a reskin R row drawn as a cornered tile, or a chrome panel nine-slice; and ZIN's own window frames)
// comes from an accepted chrome sheet of the design system.
export function checkChromeFamily({ inventory, reskin, design, sprites }) {
  const problems = [], byName = new Map(inventory.sprites.map(s => [s.name, s]));
  const accepted = new Set(Object.entries(design.acceptedChromeSheets ?? {}).filter(([k]) => k !== 'note').flatMap(([, v]) => v));
  const zinFrames = design.zinFrameSheets ?? {}, seen = new Set();
  for (const row of reskin.rows) {
    if (row.disposition !== 'R') continue;
    const s = byName.get(row.name);
    if (!s || !(s.kind === 'cornered_tile' || (row.family === 'chrome_panels' && row.fit === 'nine_slice'))) continue;
    if (seen.has(s.texture.toLowerCase())) continue;
    seen.add(s.texture.toLowerCase());
    const sheets = [].concat(row.sheet ?? []);
    if (!sheets.length || sheets.some(id => !accepted.has(id))) problems.push({ code: 'chrome.sheet', name: s.texture, message: `${row.name} (${s.texture}) is cut from ${sheets.join(', ') || 'no sheet'}, not an accepted chrome sheet` });
  }
  for (const s of [...(sprites?.values() ?? [])].sort((a, b) => ord(a.name, b.name))) {
    if (s.origin !== 'mod' || !/^GFX_zin_frame/i.test(s.name)) continue;
    if (!accepted.has(zinFrames[s.name])) problems.push({ code: 'chrome.zin_frame', name: s.name, message: `${s.name} (${s.texture}) is not drawn from an accepted chrome sheet` });
  }
  return result(13, 'chrome.family', problems, [], { accepted: accepted.size, level0: seen.size });
}

// ---------------------------------------------------------------------------------------------------- 14 and 15
// The body of a panel: inside the declared border (a cornered tile) or inside a 15% margin.
function bodyBox(px, border) {
  const bx = border ? Math.min(border[0], Math.floor(px.width / 3)) : Math.round(px.width * 0.15), by = border ? Math.min(border[1], Math.floor(px.height / 3)) : Math.round(px.height * 0.15);
  return { x0: bx, y0: by, x1: px.width - bx, y1: px.height - by };
}
export function lumaStd(px, box) {
  let n = 0, sum = 0, sq = 0;
  for (let y = box.y0; y < box.y1; y++) for (let x = box.x0; x < box.x1; x++) { const o = (y * px.width + x) * 4; if (px.data[o + 3] < 128) continue; const l = lum(px.data[o], px.data[o + 1], px.data[o + 2]); n++; sum += l; sq += l * l; }
  return n ? Math.sqrt(Math.max(0, sq / n - (sum / n) ** 2)) : 0;
}
// Mean absolute luminance step across a tile boundary: between column `a` and column `b` (axis x) or row a and row b (axis y).
export function seamStep(px, box, axis, a, b) {
  let n = 0, s = 0;
  const L = (x, y) => { const o = (y * px.width + x) * 4; return lum(px.data[o], px.data[o + 1], px.data[o + 2]); };
  if (axis === 'x') for (let y = box.y0; y < box.y1; y++) { s += Math.abs(L(a, y) - L(b, y)); n++; }
  else for (let x = box.x0; x < box.x1; x++) { s += Math.abs(L(x, a) - L(x, b)); n++; }
  return n ? s / n : 0;
}
function panelRows({ inventory, reskin }) {
  const byName = new Map(inventory.sprites.map(s => [s.name, s])), out = [], seen = new Set();
  for (const row of reskin.rows) {
    if (row.disposition !== 'R') continue;
    const s = byName.get(row.name);
    if (!s?.texture || seen.has(s.texture.toLowerCase())) continue;
    seen.add(s.texture.toLowerCase());
    out.push({ row, s });
  }
  return out;
}
export async function checkTextureNoise({ inventory, reskin, files, sprites, limit = NOISE_LIMIT }) {
  const problems = [], pending = [], idx = lowerIndex(files);
  const targets = panelRows({ inventory, reskin }).filter(({ row, s }) => row.family === 'chrome_panels' && (s.kind === 'cornered_tile' || row.fit === 'nine_slice')).map(({ s }) => ({ texture: s.texture, border: s.borderSize }));
  for (const s of [...(sprites?.values() ?? [])]) if (s.origin === 'mod' && /^GFX_zin_frame/i.test(s.name)) targets.push({ texture: s.texture, border: null });
  let checked = 0;
  for (const t of targets) {
    const px = await decodedStaged(idx, t.texture);
    if (!px) { pending.push(t.texture); continue; }
    checked++;
    const sd = lumaStd(px, bodyBox(px, t.border));
    if (sd > limit) problems.push({ code: 'texture.noise', name: t.texture, message: `${t.texture}: body luminance deviation ${sd.toFixed(3)} (limit ${limit})` });
  }
  return result(14, 'texture.noise', problems, [...new Set(pending)].sort(ord), { checked });
}
export async function checkTextureSeam({ inventory, reskin, files, manifest, limit = SEAM_LIMIT }) {
  const problems = [], pending = [], idx = lowerIndex(files), ops = new Map((manifest?.files ?? []).map(m => [m.out.toLowerCase(), m.ops ?? []]));
  let checked = 0;
  for (const { row, s } of panelRows({ inventory, reskin })) {
    const repeat = row.fit === 'repeat_x' || row.fit === 'repeat_y', tiled = s.kind === 'cornered_tile';
    if (!repeat && !tiled) continue;
    const px = await decodedStaged(idx, s.texture);
    if (!px) { if ((row.writer ?? 'reskin') === 'reskin') pending.push(s.texture); continue; }
    checked++;
    let step = 0;
    if (repeat) {
      const m = /repeat_([xy]) tile (\d+)x(\d+)/.exec((ops.get(s.texture.toLowerCase()) ?? []).join(' '));
      const axis = row.fit === 'repeat_x' ? 'x' : 'y', tile = m ? Number(axis === 'x' ? m[2] : m[3]) : 0, full = { x0: 0, y0: 0, x1: px.width, y1: px.height };
      for (let k = tile; tile && k < (axis === 'x' ? px.width : px.height); k += tile) step = Math.max(step, seamStep(px, full, axis, k - 1, k));
    } else {
      const b = bodyBox(px, s.borderSize);
      if (b.x1 - b.x0 < 2 || b.y1 - b.y0 < 2) continue;
      step = Math.max(seamStep(px, b, 'x', b.x1 - 1, b.x0), seamStep(px, b, 'y', b.y1 - 1, b.y0));
    }
    if (step > limit) problems.push({ code: 'texture.seam', name: s.texture, message: `${s.texture}: seam step ${step.toFixed(3)} where the ${repeat ? 'repeat' : 'engine tiling'} joins (limit ${limit})` });
  }
  return result(15, 'texture.seam', problems, [...new Set(pending)].sort(ord), { checked });
}

// ---------------------------------------------------------------------------------------------------- 16
// No fit enlarges its cell: the "scale <n>" op that lib/fit.mjs writes into the reskin manifest stays at or below 1.
export function checkFitScale({ manifest, limit = SCALE_LIMIT }) {
  const problems = [], pending = [];
  for (const m of manifest?.files ?? []) {
    const s = (m.ops ?? []).map(o => /^scale ([\d.]+)$/.exec(o)).find(Boolean);
    if (!s) { pending.push(m.out); continue; }
    if (Number(s[1]) > limit) problems.push({ code: 'fit.scale', name: m.out, message: `${m.out}: its cell is enlarged ${s[1]} times (limit ${limit})` });
  }
  return result(16, 'fit.scale', problems, pending.sort(ord), { entries: manifest?.files?.length ?? 0 });
}

// ---------------------------------------------------------------------------------------------------- 17
// Multi-frame buttons: normal, hover and pressed differ visibly (mean channel difference at least STATE_DIFF_MIN), and a disabled frame
// is desaturated (mean saturation at most DISABLED_SAT_MAX). Reskin rows name their frames; ZIN button and tab sprites follow the
// design-system order normal, hover, pressed[, disabled].
function frameOf(px, i, n) { const w = Math.floor(px.width / n); return { w, h: px.height, at: (x, y) => ((y * px.width) + i * w + x) * 4 }; }
export function frameDifference(px, i, j, n) {
  const a = frameOf(px, i, n), b = frameOf(px, j, n);
  let s = 0, c = 0;
  for (let y = 0; y < a.h; y++) for (let x = 0; x < a.w; x++) { const p = a.at(x, y), q = b.at(x, y); if (px.data[p + 3] < 128 && px.data[q + 3] < 128) continue; s += (Math.abs(px.data[p] - px.data[q]) + Math.abs(px.data[p + 1] - px.data[q + 1]) + Math.abs(px.data[p + 2] - px.data[q + 2])) / 3; c++; }
  return c ? s / c / 255 : 0;
}
export function frameSaturation(px, i, n) {
  const f = frameOf(px, i, n);
  let s = 0, c = 0;
  for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) { const o = f.at(x, y); if (px.data[o + 3] < 128) continue; const r = px.data[o], g = px.data[o + 1], b = px.data[o + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b); s += mx ? (mx - mn) / mx : 0; c++; }
  return c ? s / c : 0;
}
export async function checkButtonStates({ inventory, reskin, files, sprites, minDiff = STATE_DIFF_MIN, maxSat = DISABLED_SAT_MAX }) {
  const problems = [], pending = [], idx = lowerIndex(files), targets = [];
  for (const { row, s } of panelRows({ inventory, reskin })) if (Array.isArray(row.frames) && row.frames.includes('normal') && row.frames.includes('hover')) targets.push({ texture: s.texture, labels: row.frames, reskin: (row.writer ?? 'reskin') === 'reskin' });
  for (const s of [...(sprites?.values() ?? [])].sort((a, b) => ord(a.name, b.name))) if (s.origin === 'mod' && s.frames > 1 && /^GFX_zin_.*(button|tab)/i.test(s.name)) targets.push({ texture: s.texture, labels: ['normal', 'hover', 'pressed', 'disabled'].slice(0, s.frames), reskin: false, name: s.name });
  let checked = 0;
  for (const t of targets) {
    const px = await decodedStaged(idx, t.texture);
    if (!px) { if (t.reskin) pending.push(t.texture); continue; }
    checked++;
    const n = t.labels.length, at = l => t.labels.indexOf(l);
    for (const [a, b] of [['normal', 'hover'], ['normal', 'pressed'], ['hover', 'pressed']]) {
      if (at(a) < 0 || at(b) < 0) continue;
      const d = frameDifference(px, at(a), at(b), n);
      if (d < minDiff) problems.push({ code: 'button.same_frames', name: t.name ?? t.texture, message: `${t.name ?? t.texture}: ${a} and ${b} differ by ${(d * 100).toFixed(1)}% (at least ${minDiff * 100}%)` });
    }
    if (at('disabled') >= 0) { const sat = frameSaturation(px, at('disabled'), n); if (sat > maxSat) problems.push({ code: 'button.disabled_colour', name: t.name ?? t.texture, message: `${t.name ?? t.texture}: the disabled frame has saturation ${(sat * 100).toFixed(0)}% (at most ${maxSat * 100}%)` }); }
  }
  return result(17, 'button.states', problems, [...new Set(pending)].sort(ord), { checked });
}

// ---------------------------------------------------------------------------------------------------- 18
// ZIN-owned .gui files: every position and size on the 4 px grid (percentages and engine anchors are free), and every font from the
// role table of the design system.
export const ZIN_GUI = rel => /^interface\/(zin_|zz_zin)[^/]*\.gui$/i.test(rel) || /^interface\/countrytechtreeview\.gui$/i.test(rel);
export function checkLayoutGrid({ files, design }) {
  const problems = [], grid = design.grid ?? 4, roles = design.fontRoles ?? {};
  const fonts = new Set(Object.values(roles).filter(Array.isArray).flat().map(f => f.toLowerCase()));
  let checked = 0;
  for (const [rel, bytes] of [...toMap(files)].sort(([a], [b]) => ord(a, b))) {
    if (!ZIN_GUI(rel)) continue;
    checked++;
    let tree;
    try { tree = parse(readText(bytes)); } catch (e) { problems.push({ code: 'layout.parse', name: rel, message: `${rel}: ${e.message}` }); continue; }
    const element = [];
    const walk = entries => {
      for (const e of entries) {
        const k = String(e.k).toLowerCase();
        if (Array.isArray(e.v)) {
          const nm = e.v.find(c => String(c.k).toLowerCase() === 'name')?.v;
          if (nm) element.push(nm);
          if (k === 'position' || k === 'size') for (const c of e.v) {
            if (typeof c.v !== 'string' || !/^(x|y|width|height)$/i.test(c.k) || /%/.test(c.v) || !/^-?\d+$/.test(c.v)) continue;
            if (Number(c.v) % grid) problems.push({ code: 'layout.grid', name: `${rel}:${element.at(-1) ?? '?'}`, message: `${rel} ${element.at(-1) ?? '?'}: ${k}.${c.k} = ${c.v} is off the ${grid} px grid (line ${c.line})` });
          }
          walk(e.v);
          if (nm) element.pop();
        } else if (k === 'font' && typeof e.v === 'string' && fonts.size && !fonts.has(e.v.toLowerCase())) problems.push({ code: 'layout.font', name: `${rel}:${element.at(-1) ?? '?'}`, message: `${rel} ${element.at(-1) ?? '?'}: font ${e.v} has no role in the design system (line ${e.line})` });
      }
    };
    walk(tree);
  }
  const byFile = {}; for (const p of problems) { const f = p.name.split(':')[0]; byFile[f] = (byFile[f] ?? 0) + 1; }
  return result(18, 'layout.grid', problems, [], { files: checked, byFile });
}

// Run 10 to 18. ctx needs files; registry, shares and design are built or loaded when absent.
export async function runDesignChecks(ctx) {
  const design = ctx.design ?? loadDesign(), shares = ctx.shares ?? loadShares();
  const registry = ctx.registry ?? iconRegistry(ctx.files, { game: ctx.game ?? GAME, design });
  const c = { ...ctx, design, shares, registry, sprites: registry.sprites, manifest: ctx.manifest ?? safeManifest(ctx.files) };
  const out = [checkIconRegistry(c), checkIconPlaceholder(c), checkIconFamilySize(c)];
  if (ctx.inventory && ctx.reskin) out.push(checkChromeFamily(c), await checkTextureNoise(c), await checkTextureSeam(c));
  out.push(checkFitScale(c));
  if (ctx.inventory && ctx.reskin) out.push(await checkButtonStates(c));
  out.push(checkLayoutGrid(c));
  return { registry, checks: out };
}
// Baseline comparison: counts per check id against data/ui/check_baseline.json.
export const BASELINE_FILE = fileURLToPath(new URL('../data/ui/check_baseline.json', import.meta.url));
export function loadBaseline(file = BASELINE_FILE) { return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { checks: {} }; }
export const baselineDelta = (checks, baseline) => checks.filter(c => c.id >= GATED_FROM).map(c => { const b = baseline.checks?.[c.id]?.problems; return { id: c.id, name: c.name, problems: c.problems.length, baseline: b ?? null, delta: b === undefined ? null : c.problems.length - b }; });
// Which failing checks stop the build: 1 to 9 except reachability (4) always; in a release build every failing check.
export const enforced = (checks, release = false) => checks.filter(c => c.status === 'fail' && (release || (c.id !== 4 && c.id < GATED_FROM)));

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
