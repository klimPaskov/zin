// Vanilla removal checks C1-C5 (docs/specs/00_foundation/06_vanilla_removal_and_zero_errors.md, section 4).
// The installed game is read only; nothing here copies vanilla text into the mod.
//   C1 disposition coverage    every vanilla folder and top-level file in scope has a dispositions row
//   C2 descriptor integrity    descriptor.mod and zin.mod agree; every replaced folder ships a ZIN definition;
//                              every replace_path is a replace row in effect
//   C3 loaded references       nothing that stays loaded names a definition that no loaded file defines
//   C4 stub hygiene            interim stubs are invisible and inert; bridges are gone once their stage is due
//   C5 no vanilla text         no ZIN localisation value equals the vanilla value of the same key
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, walk, scriptText } from '../lib/clausewitz.mjs';
import { GAME } from '../lib/paths.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA = path.join(here, '../data/vanilla');
export const loadJson = async name => JSON.parse(await readFile(path.join(DATA, name), 'utf8'));
export const loadDispositions = () => loadJson('dispositions.json');

// ---------------------------------------------------------------------------------------------------------- files
const SCOPE_ROOTS = ['common', 'events', 'history', 'interface', 'localisation', 'portraits', 'country_metadata', 'tutorial', 'gfx/loadingscreens'];
const SCRIPT_ROOTS = ['common', 'events', 'history'];

async function listTree(root, rel) {
  const out = { dirs: [], files: [] }, full = path.join(root, rel);
  if (!existsSync(full)) return out;
  out.dirs.push(rel);
  for (const e of (await readdir(full, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const r = `${rel}/${e.name}`;
    if (e.isDirectory()) { const sub = await listTree(root, r); out.dirs.push(...sub.dirs); out.files.push(...sub.files); } else out.files.push(r);
  }
  return out;
}

let gameTreeCache;
export async function gameTree(game = GAME) {
  if (gameTreeCache?.game === game) return gameTreeCache.tree;
  const tree = { dirs: [], files: [] };
  for (const r of SCOPE_ROOTS) { const t = await listTree(game, r); tree.dirs.push(...t.dirs); tree.files.push(...t.files); }
  gameTreeCache = { game, tree };
  return tree;
}

// ------------------------------------------------------------------------------------------------- dispositions
export const rowsInEffect = (disp, stage = disp.currentStage) => disp.rows.filter(r => r.stage <= stage);
export const replacedFolders = (disp, stage) => rowsInEffect(disp, stage).filter(r => r.action === 'replace' && r.kind === 'folder').map(r => r.path).sort();
export const overriddenFiles = (disp, stage) => rowsInEffect(disp, stage).filter(r => r.action === 'override' && r.kind === 'file').map(r => r.path).sort();

// C1: every vanilla folder (and every file directly under common/, and the single-file roots) has a row.
export async function checkCoverage(disp, game = GAME) {
  const tree = await gameTree(game), rows = new Set(disp.rows.map(r => r.path)), missing = [];
  for (const d of tree.dirs) {
    if (d === 'gfx/loadingscreens' || d.startsWith('gfx/loadingscreens/')) { if (!rows.has(d)) missing.push(d); continue; }
    if (SCOPE_ROOTS.includes(d) && d !== 'events') continue; // the roots themselves hold the folders
    if (!rows.has(d)) missing.push(d);
  }
  for (const f of tree.files) {
    const dir = path.posix.dirname(f);
    if ((dir === 'common' || ['portraits', 'country_metadata', 'tutorial'].includes(dir)) && !rows.has(f)) missing.push(f);
  }
  const actions = new Set(['replace', 'override', 'keep']);
  const bad = disp.rows.filter(r => !actions.has(r.action) || !Number.isInteger(r.stage) || !r.reason).map(r => r.path);
  return { missing, bad };
}

// ------------------------------------------------------------------------------------------------- descriptor
export const replacePathsOf = text => [...String(text).matchAll(/^\s*replace_path\s*=\s*"([^"]+)"/gm)].map(m => m[1]);

// C2. modFiles: Map<rel, Buffer> of the mod as it will be after the build (staged over repository files).
export function checkDescriptor(disp, { descriptor, launcher, modFiles, stage = disp.currentStage }) {
  const problems = [], own = replacePathsOf(descriptor), user = replacePathsOf(launcher ?? descriptor);
  const a = [...new Set(own)].sort(), b = [...new Set(user)].sort();
  if (JSON.stringify(a) !== JSON.stringify(b)) problems.push(`descriptor.mod and zin.mod differ in replace_path: only descriptor ${a.filter(x => !b.includes(x)).join(' ') || '-'}; only zin.mod ${b.filter(x => !a.includes(x)).join(' ') || '-'}`);
  const replaceRows = new Set(replacedFolders(disp, stage));
  for (const p of a) if (!replaceRows.has(p)) problems.push(`replace_path ${p} is not a replace row in effect`);
  for (const p of replaceRows) if (!a.includes(p)) problems.push(`replace row ${p} has no replace_path line`);
  for (const p of a) {
    const files = [...modFiles.keys()].filter(f => path.posix.dirname(f) === p && /\.(txt|lua|yml)$/.test(f));
    const defined = files.some(f => definesSomething(modFiles.get(f)));
    if (!defined) problems.push(`replaced folder ${p} has no ZIN file with a definition`);
  }
  return problems;
}

function definesSomething(bytes) {
  const entries = parse(scriptText(bytes));
  return entries.some(e => e.k && (Array.isArray(e.v) ? e.v.length > 0 : e.v !== '')) ;
}

// ------------------------------------------------------------------------------------------------ loaded set
// The vanilla script files that stay loaded, plus every mod script file. A vanilla file is unloaded when its folder
// is replaced (replace_path does not reach subfolders) or when the mod ships a file with the same relative path.
export async function loadedScripts(disp, modFiles, { stage = disp.currentStage, game = GAME } = {}) {
  const tree = await gameTree(game), replaced = new Set(replacedFolders(disp, stage)), out = [];
  for (const f of tree.files) {
    if (!SCRIPT_ROOTS.includes(f.split('/')[0]) || !f.endsWith('.txt')) continue;
    if (replaced.has(path.posix.dirname(f)) || modFiles.has(f)) continue;
    out.push({ rel: f, source: 'game', text: scriptText(await readFile(path.join(game, f))) });
  }
  for (const [rel, bytes] of [...modFiles].sort(([x], [y]) => x.localeCompare(y, 'en'))) {
    if (!SCRIPT_ROOTS.includes(rel.split('/')[0]) || !rel.endsWith('.txt')) continue;
    out.push({ rel, source: 'mod', text: scriptText(bytes) });
  }
  return out;
}

export async function allGameScripts(game = GAME) {
  const tree = await gameTree(game), out = [];
  for (const f of tree.files) if (SCRIPT_ROOTS.includes(f.split('/')[0]) && f.endsWith('.txt')) out.push({ rel: f, source: 'game', text: scriptText(await readFile(path.join(game, f))) });
  return out;
}

// ----------------------------------------------------------------------------------------------- definitions
const blocksOf = entries => entries.filter(e => e.k && Array.isArray(e.v));
export function definitions(files) {
  const defs = new Map(), add = (cat, name, rel) => { if (!name) return; let m = defs.get(cat); if (!m) defs.set(cat, m = new Map()); (m.get(name) ?? m.set(name, []).get(name)).push(rel); };
  for (const f of files) {
    const dir = path.posix.dirname(f.rel), ents = f.parsed ??= parse(f.text);
    if (dir === 'common/scripted_triggers') for (const e of ents) if (e.k) add('trigger', e.k, f.rel);
    if (dir === 'common/scripted_effects') for (const e of ents) if (e.k) add('effect', e.k, f.rel);
    if (dir === 'common/decisions') for (const c of blocksOf(ents)) for (const e of blocksOf(c.v)) add('decision', e.k, f.rel);
    if (dir === 'common/decisions/categories') for (const e of ents) if (e.k) add('decision_category', e.k, f.rel);
    if (dir === 'common/ideas') for (const top of blocksOf(ents)) for (const s of blocksOf(top.v)) for (const e of blocksOf(s.v)) add('idea', e.k, f.rel);
    if (dir === 'common/national_focus' || dir === 'common/continuous_focus') walk(ents, (e, a) => {
      if (e.k === 'id' && typeof e.v === 'string' && a.length && /^(focus|shared_focus|joint_focus)$/.test(a[a.length - 1].k)) add('focus', e.v, f.rel);
      if (e.k === 'id' && typeof e.v === 'string' && a.length === 1 && /^(focus_tree|continuous_focus_palette)$/.test(a[0].k)) add(a[0].k === 'focus_tree' ? 'focus_tree' : 'focus_palette', e.v, f.rel);
    });
    if (dir === 'common/characters') for (const top of blocksOf(ents)) if (top.k === 'characters') for (const e of blocksOf(top.v)) add('character', e.k, f.rel);
    if (dir === 'common/country_leader' || dir === 'common/unit_leader') for (const top of blocksOf(ents)) if (top.k === 'leader_traits') for (const e of blocksOf(top.v)) add('trait', e.k, f.rel);
    if (dir === 'common/dynamic_modifiers') for (const e of ents) if (e.k) add('dynamic_modifier', e.k, f.rel);
    if (dir === 'common/opinion_modifiers') for (const top of blocksOf(ents)) for (const e of top.v) if (e.k) add('opinion_modifier', e.k, f.rel);
    if (dir === 'common/script_constants') for (const top of blocksOf(ents)) { add('constant_group', top.k, f.rel); for (const e of top.v) if (e.k && e.k !== 'schema') add('constant', `${top.k}.${e.k}`, f.rel); }
    if (dir === 'common/collections') for (const e of ents) if (e.k) add('collection', e.k, f.rel);
    if (dir === 'common/mtth') for (const e of ents) if (e.k) add('mtth', e.k, f.rel);
    if (dir === 'common/ai_faction_theaters') for (const e of ents) if (e.k) add('theater', e.k, f.rel);
    if (dir === 'common/game_rules') for (const e of blocksOf(ents)) { add('game_rule', e.k, f.rel); for (const o of blocksOf(e.v)) if (o.k === 'option' || o.k === 'default') { const n = o.v.find(x => x.k === 'name'); if (n) add('game_rule_option', `${e.k}.${n.v}`, f.rel); } }
    if (dir === 'events') walk(ents, (e, a) => { if (e.k === 'id' && typeof e.v === 'string' && a.length === 1 && /_event$/.test(a[0].k)) add('event', e.v, f.rel); });
  }
  return defs;
}

// ----------------------------------------------------------------------------------------------- references
const DECISION_KEYS = new Set(['has_decision', 'has_active_mission', 'activate_mission', 'activate_mission_tooltip', 'unlock_decision_tooltip', 'activate_decision', 'remove_decision', 'remove_mission', 'cancel_mission', 'has_active_timed_decision', 'add_days_mission_timeout', 'add_days_remove', 'remove_decision_on_cooldown', 'activate_targeted_decision', 'remove_targeted_decision', 'is_decision_on_cooldown']);
const IDEA_SCALAR = new Set(['add_ideas', 'remove_ideas', 'has_idea', 'show_ideas_tooltip', 'has_allowed_idea']);
const IDEA_LIST = new Set(['add_ideas', 'remove_ideas', 'show_ideas_tooltip']);
const IDEA_SUB = new Set(['add_timed_idea', 'modify_timed_idea', 'swap_ideas', 'has_allowed_idea_with_traits', 'remove_ideas_with_trait']);
const TRAIT_SCALAR = new Set(['add_country_leader_trait', 'remove_country_leader_trait', 'has_trait', 'add_unit_leader_trait', 'remove_unit_leader_trait', 'has_country_leader_with_trait']);
const EVENT_KEYS = new Set(['country_event', 'news_event', 'state_event', 'unit_leader_event', 'operative_leader_event']);
const plain = v => typeof v === 'string' && /^[A-Za-z0-9_.\-]+$/.test(v) && !/^-?[0-9.]+$/.test(v);
const isMod = f => f.source === 'mod';

// Returns [{ cat, name, rel, line, source }]. universe: definitions over every vanilla file (unfiltered), used to tell
// a reference from an ordinary token in vanilla files; mod files are held to their key context alone.
export function references(files, universe) {
  const has = (cat, n) => universe.get(cat)?.has(n);
  const out = [];
  for (const f of files) {
    const ents = f.parsed ??= parse(f.text), push = (cat, name, line, via) => out.push({ cat, name, rel: f.rel, line, source: f.source, ...(via ? { via } : {}) });
    const dir = path.posix.dirname(f.rel);
    walk(ents, (e, a) => {
      const parent = a.length ? a[a.length - 1].k : null, v = e.v;
      // A scripted trigger or effect is called as a key below the top level (top-level keys are definitions).
      if (e.k && a.length && (has('trigger', e.k) || has('effect', e.k))) push(has('trigger', e.k) && has('effect', e.k) ? 'scripted' : has('trigger', e.k) ? 'trigger' : 'effect', e.k, e.line);
      if (typeof v !== 'string' || !plain(v)) return;
      if (e.k && DECISION_KEYS.has(e.k) || (e.k === 'decision' || e.k === 'mission') && DECISION_KEYS.has(parent)) { if (isMod(f) || has('decision', v)) push('decision', v, e.line); }
      if (e.k && /decision_category/.test(e.k) && (isMod(f) || has('decision_category', v))) push('decision_category', v, e.line);
      if (e.k && IDEA_SCALAR.has(e.k) || e.k === null && IDEA_LIST.has(parent) || /^(idea|add_idea|remove_idea)$/.test(e.k ?? '') && IDEA_SUB.has(parent)) { if (isMod(f) || has('idea', v)) push('idea', v, e.line); }
      if (e.k && /focus/.test(e.k) && !/focus_tree|palette/.test(e.k) && (has('focus', v) || isMod(f) && /^(has_completed_focus|complete_national_focus|unlock_national_focus)$/.test(e.k))) push('focus', v, e.line);
      if ((e.k === 'has_focus_tree' || e.k === 'load_focus_tree' || e.k === 'tree' && parent === 'load_focus_tree') && (isMod(f) || has('focus_tree', v))) push('focus_tree', v, e.line);
      if (has('character', v) || isMod(f) && /^(recruit_character|has_character|retire_character|character)$/.test(e.k ?? '')) push('character', v, e.line);
      if (e.k && TRAIT_SCALAR.has(e.k) || e.k === null && parent === 'traits' || (e.k === 'add' || e.k === 'remove') && /^swap_.*traits$/.test(parent ?? '')) { if (has('trait', v) || isMod(f)) push('trait', v, e.line); }
      if (e.k === 'modifier' && /dynamic_modifier/.test(parent ?? '') || e.k === 'has_dynamic_modifier') { if (isMod(f) || has('dynamic_modifier', v)) push('dynamic_modifier', v, e.line); }
      if (e.k === 'modifier' && /opinion_modifier/.test(parent ?? '') || e.k === 'has_opinion_modifier') { if (isMod(f) || has('opinion_modifier', v)) push('opinion_modifier', v, e.line); }
      if (has('theater', v)) push('theater', v, e.line);
      if (e.k && EVENT_KEYS.has(e.k) || e.k === 'id' && EVENT_KEYS.has(parent)) { if (isMod(f) || has('event', v)) push('event', v, e.line, EVENT_KEYS.has(e.k) ? e.k : parent); }
      if (e.k === 'collection' && (isMod(f) || has('collection', v))) push('collection', v, e.line);
      if (e.k === 'rule' && parent === 'has_game_rule') { push('game_rule', v, e.line); const o = a[a.length - 1].v.find(x => x.k === 'option'); if (o && typeof o.v === 'string') push('game_rule_option', `${v}.${o.v}`, e.line); }
    });
    // Prefixed database references can sit in any value, including math and quoted strings.
    for (const m of f.text.replace(/#[^\n]*/g, '').matchAll(/\b(constant|collection|mtth):([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)?)/g)) {
      const line = f.text.slice(0, m.index).split('\n').length;
      if (m[1] === 'constant') push('constant', m[2].includes('.') ? m[2] : `${m[2]}`, line);
      else push(m[1], m[2], line);
    }
  }
  return out;
}

// C3. Dangling = referenced, not defined by any loaded file. For vanilla files only names vanilla defines count
// (anything else is an ordinary token); mod files are held to their key context.
export function danglingReferences(loaded, universe) {
  const defs = definitions(loaded), refs = references(loaded, universe);
  const defined = (cat, name) => {
    if (cat === 'constant') { const [g, k] = name.split('.'); return k ? defs.get('constant')?.has(name) : defs.get('constant_group')?.has(g); }
    if (cat === 'scripted') return defs.get('trigger')?.has(name) || defs.get('effect')?.has(name);
    return defs.get(cat)?.has(name);
  };
  const known = (cat, name) => { if (cat === 'constant') { const [g] = name.split('.'); return universe.get('constant_group')?.has(g); } if (cat === 'scripted') return true; return universe.get(cat)?.has(name); };
  return refs.filter(r => !defined(r.cat, r.name) && (r.source === 'mod' || known(r.cat, r.name)));
}

export function groupDangling(dangling) {
  const by = new Map();
  for (const r of dangling) { const k = `${r.cat}:${r.name}`; const g = by.get(k) ?? by.set(k, { cat: r.cat, name: r.name, uses: [], gameFiles: new Set(), modFiles: new Set() }).get(k); g.uses.push(`${r.rel}:${r.line}`); (r.source === 'mod' ? g.modFiles : g.gameFiles).add(r.rel); if (r.via) g.via = r.via; }
  return [...by.values()].sort((a, b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));
}
