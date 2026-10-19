// Build checks of the focus compiler (docs/specs/05_focus_trees/00_format_and_compiler.md, "Compiler checks").
// Each check takes an effective tree (copy blocks already expanded, see lib/focus_model.mjs) and a context and returns
// a list of problems { code, tree, message }. The build fails when any list is non-empty; the tests call the same
// functions. Warnings are returned by their own functions and never fail a build.
//
//   ctx = { roster, catalog, registry, trees (Map id -> effective tree), codes, retired, tierRanges }
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse, scriptText } from '../lib/clausewitz.mjs';
import { ZIN, GAME } from '../lib/paths.mjs';
import { assertModifiers } from '../lib/core.mjs';
import {
  absolutePositions, allConditions, allEffects, eventNumbers, eventId, focusId, helperId, opinionId,
  ownEventIds, prefixesOf, spiritId, titleCase, walkConditions, walkEffects,
} from '../lib/focus_model.mjs';
import { COUNTRY_TOKENS } from '../lib/focus_schema.mjs';

const DATA = new URL('../data/', import.meta.url);
export const CELLS_FILE = fileURLToPath(new URL('presentation-cells.json', DATA));
export const REGISTRY_FILE = fileURLToPath(new URL('focus_registry.json', DATA));
export const ARG_CODES_FILE = fileURLToPath(new URL('focus_arg_codes.json', DATA));
export const CONTRACT_FILE = `${ZIN}/docs/specs/04_mechanics/00_contract_additions.md`;

// Tier focus-count ranges of 01_tiers_and_coverage.md; a tier counts the whole tree (decision F6).
export const TIER_RANGES = { major: [80, 140], regional: [30, 50], shared: [40, 70] };
export const RAW_LIMIT_MAJOR = 10;
export const GATE_FLAG = 'zin_afrit_revealed';
export const LAYOUT_ACTIONS = ['on_ruling_party_change', 'on_puppet', 'on_release_as_puppet', 'on_subject_free', 'on_annex', 'on_peaceconference_ended'];

export const problem = (code, tree, message) => ({ code, tree, message: `${code}: ${tree ? `${tree}: ` : ''}${message}` });
export const formatProblems = list => list.map(p => p.message).join('\n');
export function assertClean(list, heading = 'The focus compiler found problems') {
  if (list.length) throw new Error(`${heading} (${list.length}):\n${formatProblems(list.slice(0, 60))}${list.length > 60 ? `\n... and ${list.length - 60} more` : ''}`);
}

// ------------------------------------------------------------------------------------------------ data files
// The icon catalog's keys and the event picture keys with crop and gate (tracked copy of the art working files).
export async function loadCatalog(file = CELLS_FILE) {
  const cells = JSON.parse(await readFile(file, 'utf8'));
  return {
    icons: new Set(cells.icons.flatMap(s => s.keys)),
    events: new Map(cells.events.map(e => [e.key, { crop: e.crop, gate: e.gate }])),
  };
}

export async function loadArgCodes(file = ARG_CODES_FILE) { return JSON.parse(await readFile(file, 'utf8')); }
// The keyword table of argument `arg` of effect `effectId`: the owner with the longest matching prefix that lists it.
export function codesFor(codes, effectId, arg) {
  let best;
  for (const owner of codes.owners ?? []) {
    if (!(arg in owner.args)) continue;
    const prefix = owner.prefixes.filter(p => effectId.startsWith(p)).sort((a, b) => b.length - a.length)[0];
    if (prefix && (!best || prefix.length > best.len)) best = { len: prefix.length, table: owner.args[arg] };
  }
  return best?.table;
}

const FALLBACK_RETIRED = {
  ids: ['zin_blue_sword_broken', 'zin_zol_volgan_accord', 'zin_afrit_cast_down_eindil', 'zin_rule_golden_king', 'zin_opinion_caravan_rivals', 'zin_opinion_edrans_folly', 'zin_glo.10', 'zin_hierarch', 'zin_afrit_regicide_exposed', 'zin_afrit_is_secret', 'zin_afrit_name', 'zin_afrit.35', 'zin_glo_with_afrit', 'zin_autonomy_client_crown', 'zin_aenor.310', 'zin_lore.191', 'zin_is_sea_central'],
  patterns: ['zin_regional_<tree>_event_for_parim', 'zin_shared_<tree>_event_for_parim', 'GFX_zin_focus_<key>'],
  texts: ['Hierarch', 'the Hierarch', 'The Eastern Throne', 'Aldis Veleran'],
};
const patternRe = p => new RegExp(`^${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/<[a-z_]+>/g, '[a-z0-9_]+')}$`);
// Reads the retired table of the contract-additions register (N16). Rows qualified by a kind, such as `zin_zol`
// (character), retire the name for that kind only and are skipped here: a tree may use the name for another kind.
export function parseRetired(markdown) {
  const section = markdown.split(/^## Retired names\s*$/m)[1]?.split(/^## /m)[0] ?? '';
  const ids = new Set(), patterns = [], texts = new Set();
  for (const line of section.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cell = line.split('|')[1]?.trim();
    if (!cell || cell === 'Retired' || /^-+$/.test(cell)) continue;
    for (const [, t] of cell.matchAll(/"([^"]+)"/g)) texts.add(t);
    if (/`[^`]+`\s*\([a-z ]+\)/.test(cell)) continue;
    for (const [, name] of cell.matchAll(/`([^`]+)`/g)) { if (name.includes('<')) patterns.push(patternRe(name)); else ids.add(name); }
  }
  return { ids, patterns, texts: [...texts] };
}
export async function loadRetired(file = CONTRACT_FILE) {
  if (existsSync(file)) {
    const parsed = parseRetired(await readFile(file, 'utf8'));
    if (parsed.ids.size || parsed.texts.length) return parsed;
  }
  return { ids: new Set(FALLBACK_RETIRED.ids), patterns: FALLBACK_RETIRED.patterns.map(patternRe), texts: FALLBACK_RETIRED.texts };
}

// ------------------------------------------------------------------------------------------------ registry
// The names other modules write. Sources: the staged files of the builder modules that ran before the compiler, the
// hand-kept data/focus_registry.json (names of pending modules, patterns, and the allow_branch lists of E4), and
// the options of a test. `<key>` in a pattern matches [a-z0-9_]+.
const KINDS = ['scripted_effects', 'scripted_triggers', 'events', 'namespaces', 'ideas', 'decisions', 'opinion_modifiers', 'sub_units', 'characters', 'flags', 'global_flags', 'faction_templates'];
export class Registry {
  constructor(data = {}) {
    this.sets = Object.fromEntries(KINDS.map(k => [k, new Set(data[k] ?? [])]));
    this.patterns = Object.fromEntries(KINDS.map(k => [k, (data.patterns?.[k] ?? []).map(patternRe)]));
    this.branch = {
      fixed_checks: new Set(data.branch?.fixed_checks ?? []), refreshed_checks: new Set(data.branch?.refreshed_checks ?? []),
      refreshed_flags: new Set(data.branch?.refreshed_flags ?? []),
      patterns: (data.branch?.patterns ?? []).map(patternRe),
    };
  }
  has(kind, name) { return this.sets[kind].has(name) || this.patterns[kind].some(re => re.test(name)); }
  add(kind, name) { this.sets[kind].add(name); }
  merge(other) { for (const k of KINDS) for (const n of other.sets[k]) this.sets[k].add(n); return this; }
  // Every id that shares a localisation or definition space with a tree's focus, spirit and opinion-modifier ids.
  hasMechanicId(id) { return ['ideas', 'decisions', 'opinion_modifiers', 'sub_units', 'characters'].some(k => this.sets[k].has(id)); }
}
export async function loadRegistry(file = REGISTRY_FILE) {
  return new Registry(existsSync(file) ? JSON.parse(await readFile(file, 'utf8')) : {});
}

// Reads the names the staged files of other modules define.
export function scanStaged(staged) {
  const reg = new Registry();
  const topKeys = (entries, fn) => { for (const e of entries) if (Array.isArray(e.v) && e.k) fn(e); };
  for (const [rel, bytes] of staged.files) {
    if (!rel.endsWith('.txt')) continue;
    const text = scriptText(bytes);
    for (const m of text.matchAll(/set_country_flag\s*=\s*(?:\{[^}]*?\bflag\s*=\s*)?([A-Za-z0-9_]+)/g)) reg.add('flags', m[1]);
    for (const m of text.matchAll(/set_global_flag\s*=\s*(?:\{[^}]*?\bflag\s*=\s*)?([A-Za-z0-9_]+)/g)) reg.add('global_flags', m[1]);
    const area = rel.startsWith('events/') ? 'events' : rel.split('/').slice(0, 2).join('/');
    if (!['common/scripted_effects', 'common/scripted_triggers', 'events', 'common/ideas', 'common/decisions', 'common/opinion_modifiers', 'common/units', 'common/characters', 'common/factions'].includes(area)) continue;
    const top = parse(text);
    if (area === 'common/scripted_effects') topKeys(top, e => reg.add('scripted_effects', e.k));
    else if (area === 'common/scripted_triggers') topKeys(top, e => reg.add('scripted_triggers', e.k));
    else if (area === 'common/factions') topKeys(top, e => reg.add('faction_templates', e.k));
    else if (area === 'events') {
      for (const e of top) {
        if (e.k === 'add_namespace' && typeof e.v === 'string') reg.add('namespaces', e.v);
        if (/_event$/.test(e.k ?? '') && Array.isArray(e.v)) { const id = e.v.find(x => x.k === 'id'); if (id) reg.add('events', id.v); }
      }
    } else if (area === 'common/ideas') {
      for (const top1 of top) if (top1.k === 'ideas' && Array.isArray(top1.v)) topKeys(top1.v, cat => topKeys(cat.v, idea => reg.add('ideas', idea.k)));
    } else if (area === 'common/decisions') {
      if (rel.includes('/categories/')) continue;
      topKeys(top, cat => topKeys(cat.v, d => reg.add('decisions', d.k)));
    } else if (area === 'common/opinion_modifiers') {
      for (const top1 of top) if (top1.k === 'opinion_modifiers' && Array.isArray(top1.v)) topKeys(top1.v, e => reg.add('opinion_modifiers', e.k));
    } else if (area === 'common/units') {
      for (const top1 of top) if (top1.k === 'sub_units' && Array.isArray(top1.v)) topKeys(top1.v, e => reg.add('sub_units', e.k));
    } else if (area === 'common/characters') {
      for (const top1 of top) if (top1.k === 'characters' && Array.isArray(top1.v)) topKeys(top1.v, e => reg.add('characters', e.k));
    }
  }
  return reg;
}

// ------------------------------------------------------------------------------------------------ modifiers
let buildingCache;
// The game's building types, read from common/buildings (for the templated modifier families).
async function gameBuildings(game = GAME) {
  if (buildingCache?.game === game) return buildingCache.buildings;
  const buildings = new Set();
  const top = parse(scriptText(await readFile(`${game}/common/buildings/00_buildings.txt`)));
  for (const t of top) if (t.k === 'buildings' && Array.isArray(t.v)) for (const b of t.v) if (b.k && Array.isArray(b.v)) buildings.add(b.k);
  buildingCache = { game, buildings };
  return buildings;
}
// A modifier of the game: listed in its modifier documentation (assertModifiers of lib/core.mjs) or one of the
// templated families production_speed_<building>_factor and state_production_speed_<building>_factor.
export async function isValidModifier(name, game) {
  const m = /^(?:state_)?production_speed_([a-z0-9_]+)_factor$/.exec(name);
  if (m && (await gameBuildings(game)).has(m[1])) return true;
  return assertModifiers('focus tree', { [name]: 1 }).then(() => true, () => false);
}
export async function checkModifiers(tree, ctx = {}) {
  const out = [], valid = ctx.isValidModifier ?? (n => isValidModifier(n, ctx.game));
  for (const [key, s] of Object.entries(tree.spirits ?? {})) {
    for (const name of Object.keys(s.modifier ?? {})) if (!(await valid(name))) out.push(problem('modifier_unknown', tree.id, `spirit ${key}: ${name} is not a modifier of the game`));
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ small helpers
const SET_FLAG = /set_(country|global)_flag\s*=\s*(?:\{[^}]*?\bflag\s*=\s*)?([A-Za-z0-9_]+)/g;
const flagNameOf = e => typeof e.flag === 'string' ? e.flag : e.flag.name;
const refKey = (e, k) => typeof e[k] === 'string' ? e[k] : e[k].key;

// The icon key a spirit shows: its own, else the icon of the first focus (in file order) that adds, swaps in or times it.
export function spiritIcon(tree, key) {
  const s = tree.spirits[key];
  if (s.icon) return s.icon;
  const id = spiritId(tree, key);
  for (const f of tree.focuses) {
    let hit = false;
    walkEffects(f.effects, e => {
      if (e.add_spirit && spiritId(tree, e.add_spirit) === id) hit = true;
      if (e.swap_spirit && spiritId(tree, e.swap_spirit[1]) === id) hit = true;
      if (e.timed_spirit && spiritId(tree, e.timed_spirit.key) === id) hit = true;
    });
    if (hit) return typeof f.icon === 'string' ? f.icon : f.icon.default;
  }
  return undefined;
}

export function countRaw(tree) {
  let n = 0;
  const effs = list => walkEffects(list, e => { if (e.raw !== undefined) n++; });
  for (const f of tree.focuses) effs(f.effects);
  for (const ev of Object.values(tree.events ?? {})) for (const o of ev.options) effs(o.effects);
  for (const se of Object.values(tree.scripted_effects ?? {})) effs(se.effects);
  allConditions(tree, c => { if (c.raw !== undefined) n++; });
  return n;
}

// Flags set anywhere in the given trees (country and global), including set_*_flag lines inside raw script.
export function flagsSetBy(trees) {
  const country = new Set(), global = new Set();
  for (const t of trees) {
    allEffects(t, e => {
      if (e.flag !== undefined) country.add(flagNameOf(e));
      if (e.global_flag !== undefined) global.add(e.global_flag);
      if (e.raw !== undefined) for (const m of e.raw.matchAll(SET_FLAG)) (m[1] === 'country' ? country : global).add(m[2]);
    });
  }
  return { country, global };
}

// ------------------------------------------------------------------------------------------------ structure
export function checkStructure(tree) {
  const out = [], t = tree.id, add = (code, msg) => out.push(problem(code, t, msg));
  const keys = new Map();
  for (const f of tree.focuses) { if (keys.has(f.key)) add('duplicate_key', `focus key ${f.key} is declared twice`); keys.set(f.key, f); }
  for (const key of Object.keys(tree.spirits ?? {})) if (keys.has(key)) add('key_collision', `F3: spirit key ${key} equals a focus key of the same tree; the localisation key ${focusId(tree, key)} would be shared`);
  const { pos, problems } = absolutePositions(tree);
  for (const m of problems) add('relative_position', m);
  const at = new Map();
  for (const f of tree.focuses) {
    const p = pos.get(f.key); if (!p) continue;
    const k = `${p.x},${p.y}`;
    if (at.has(k) && at.get(k) !== f.key) add('duplicate_position', `${f.key} and ${at.get(k)} share the position ${p.x},${p.y}${f.copied_from ? ` (copied from ${f.copied_from})` : ''}`);
    else at.set(k, f.key);
  }
  for (const f of tree.focuses) {
    for (const group of f.prerequisite ?? []) for (const pre of group) {
      if (!keys.has(pre)) { add('prerequisite_missing', `${f.key} needs ${pre}, which is not a focus of the tree`); continue; }
      if (pre === f.key) { add('prerequisite_self', `${f.key} needs itself`); continue; }
      const a = pos.get(f.key), b = pos.get(pre);
      if (a && b && a.y <= b.y) add('prerequisite_above', `${f.key} (row ${a.y}) must sit below its prerequisite ${pre} (row ${b.y})`);
    }
    for (const ex of f.mutually_exclusive ?? []) {
      if (!keys.has(ex)) add('exclusive_missing', `${f.key} is exclusive with ${ex}, which is not a focus of the tree`);
      else if (ex === f.key) add('exclusive_self', `${f.key} is exclusive with itself`);
      else if ((f.prerequisite ?? []).flat().includes(ex) || (keys.get(ex).prerequisite ?? []).flat().includes(f.key)) add('exclusive_prerequisite', `${f.key} and ${ex} are exclusive but one needs the other`);
    }
    if (f.days % 7 !== 0) add('days_multiple', `${f.key}: days ${f.days} is not a multiple of 7`);
    else if (f.days < 7 || f.days > 140) add('days_range', `${f.key}: ${f.days} days is outside 1 to 20 weeks (7 to 140 days)`);
  }
  // Cycles in the prerequisite graph (three-colour depth-first search).
  const colour = new Map();
  const visit = (k, stack) => {
    if (colour.get(k) === 2) return;
    if (colour.get(k) === 1) { add('prerequisite_cycle', `prerequisites form a loop: ${[...stack, k].join(' -> ')}`); return; }
    colour.set(k, 1);
    for (const pre of (keys.get(k)?.prerequisite ?? []).flat()) if (keys.has(pre)) visit(pre, [...stack, k]);
    colour.set(k, 2);
  };
  for (const k of keys.keys()) visit(k, []);
  return out;
}

// Mutually exclusive focuses made symmetric (the compiler writes the reverse side too): key -> Set of keys.
export function exclusiveClosure(tree) {
  const map = new Map(tree.focuses.map(f => [f.key, new Set()]));
  for (const f of tree.focuses) for (const ex of f.mutually_exclusive ?? []) if (map.has(ex) && ex !== f.key) { map.get(f.key).add(ex); map.get(ex).add(f.key); }
  return map;
}

// ------------------------------------------------------------------------------------------------ art
export function checkIcons(tree, ctx) {
  const out = [], t = tree.id, icons = ctx.catalog.icons;
  const need = (what, key) => { if (!icons.has(key)) out.push(problem('icon_unknown', t, `${what}: ${key} is not a key of the icon catalog`)); };
  for (const f of tree.focuses) {
    if (typeof f.icon === 'string') need(`focus ${f.key}`, f.icon);
    else { need(`focus ${f.key}`, f.icon.default); for (const a of f.icon.after ?? []) need(`focus ${f.key} (after ${a.global_flag})`, a.icon); }
  }
  for (const [key, s] of Object.entries(tree.spirits ?? {})) {
    if (s.icon) { need(`spirit ${key}`, s.icon); continue; }
    const icon = spiritIcon(tree, key);
    if (!icon) out.push(problem('spirit_icon_missing', t, `spirit ${key} names no icon and no focus adds it (catalog rule 2)`));
    else need(`spirit ${key}`, icon);
  }
  return out;
}

export function checkEventPictures(tree, ctx) {
  const out = [], t = tree.id;
  for (const [key, ev] of Object.entries(tree.events ?? {})) {
    if (ev.hidden) continue;
    const pic = ctx.catalog.events.get(ev.picture);
    if (!pic) { out.push(problem('picture_unknown', t, `event ${key}: ${ev.picture} is not a picture key of the catalog`)); continue; }
    if (ev.news && pic.crop === 'standard') out.push(problem('picture_crop', t, `event ${key}: news events use news or both pictures, ${ev.picture} is standard only`));
    if (!ev.news && pic.crop === 'news') out.push(problem('picture_crop', t, `event ${key}: country events use standard or both pictures, ${ev.picture} is news only`));
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ gates
// Can every way the tree fires `target` be shown to run only after global flag `flag`? (catalog rule 4, decision E5)
export function gateProver(tree) {
  const sites = new Map();   // "kind:key" -> [{ owner, known }]
  const note = (target, owner, known) => { const k = `${target.kind}:${target.key}`; if (!sites.has(k)) sites.set(k, []); sites.get(k).push({ owner, known }); };
  const local = new Set(Object.keys(tree.events ?? {}));
  allEffects(tree, (e, info) => {
    const owner = { kind: info.kind, key: info.key }, known = info.known;
    const ev = k => { if (local.has(k)) note({ kind: 'event', key: k }, owner, known); };
    if (e.event !== undefined) ev(refKey(e, 'event'));
    if (e.event_for !== undefined) ev(e.event_for.key);
    if (e.call === 'zin_aenor_event_for_parim' && typeof e.args?.event === 'string') ev(e.args.event);
    else if (e.call !== undefined) note({ kind: 'effect', key: e.call }, owner, known);
    if (e.add_spirit !== undefined) note({ kind: 'spirit', key: spiritId(tree, e.add_spirit) }, owner, known);
    if (e.timed_spirit !== undefined) note({ kind: 'spirit', key: spiritId(tree, e.timed_spirit.key) }, owner, known);
    if (e.swap_spirit !== undefined) note({ kind: 'spirit', key: spiritId(tree, e.swap_spirit[1]) }, owner, known);
  });
  const proven = (target, flag, seen = new Set()) => {
    const id = `${target.kind}:${target.key}`;
    if (seen.has(id)) return false;
    const list = sites.get(id);
    if (!list?.length) return false;
    seen.add(id);
    const ok = list.every(s => s.known.has(flag) || ((s.owner.kind === 'event' || s.owner.kind === 'effect') && proven(s.owner, flag, new Set(seen))));
    return ok;
  };
  return { proven, sites };
}

// Warnings: a gated picture whose event the compiler cannot prove to fire only after the gate flag (a reviewed warning).
export function gateWarnings(tree, ctx) {
  const out = [], prover = gateProver(tree);
  for (const [key, ev] of Object.entries(tree.events ?? {})) {
    if (ev.hidden) continue;
    const gate = ctx.catalog.events.get(ev.picture)?.gate;
    if (!gate) continue;
    if (!/^zin_[a-z0-9_]+$/.test(gate)) { out.push(`${tree.id}: event ${key} uses picture ${ev.picture} gated "${gate}"; the compiler cannot prove that gate`); continue; }
    if (!prover.proven({ kind: 'event', key }, gate)) out.push(`${tree.id}: event ${key} uses picture ${ev.picture} gated by ${gate}; no firing site is provably behind the flag`);
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ references
export function checkReferences(tree, ctx) {
  const out = [], t = tree.id, add = (code, msg) => out.push(problem(code, t, msg));
  const reg = ctx.registry, trees = [...ctx.trees.values()];
  const flags = (ctx.flagCache ??= flagsSetBy(trees));
  const localEffects = new Set([...Object.keys(tree.scripted_effects ?? {}), ...(tree.opinion_modifiers && Object.keys(tree.opinion_modifiers).length ? [helperId(tree)] : [])]);
  const localTriggers = new Set(Object.keys(tree.scripted_triggers ?? {}));
  const numbers = eventNumbers(tree), ownIds = new Set([...ownEventIds(tree).values()]);
  const sp = (where, ref) => {
    if (ref.startsWith('zin_')) { if (!ownFullSpirits.has(ref) && !reg.has('ideas', ref)) add('spirit_unresolved', `${where}: idea ${ref} is not written by this tree or by a module`); }
    else if (!(tree.spirits ?? {})[ref]) add('spirit_unknown', `${where}: ${ref} is not a spirit of the tree`);
  };
  const ownFullSpirits = new Set(Object.keys(tree.spirits ?? {}).map(k => spiritId(tree, k)));
  const ev = (where, ref) => {
    if (ref.includes('.')) { if (!ownIds.has(ref) && !reg.has('events', ref)) add('event_unresolved', `${where}: event ${ref} is not written by any module (F2)`); }
    else if (!numbers.has(ref)) add('event_unknown', `${where}: ${ref} is not an event of the tree`);
  };
  const flag = (where, name, global) => {
    const known = global ? flags.global : flags.country;
    if (!known.has(name) && !reg.has(global ? 'global_flags' : 'flags', name)) add('flag_unresolved', `${where}: ${global ? 'global ' : 'country '}flag ${name} is never set`);
  };
  const cond = where => c => {
    if (c.flag !== undefined) flag(where, c.flag, false);
    if (c.not_flag !== undefined) flag(where, c.not_flag, false);
    if (c.global_flag !== undefined) flag(where, c.global_flag, true);
    if (c.spirit !== undefined) sp(where, c.spirit);
    if (c.focus_done !== undefined && !tree.focuses.some(f => f.key === c.focus_done)) add('focus_done_unknown', `${where}: focus_done ${c.focus_done} is not a focus of the tree`);
    if (c.check !== undefined && !localTriggers.has(c.check) && !reg.has('scripted_triggers', c.check)) add('trigger_unresolved', `${where}: scripted trigger ${c.check} is defined neither by the tree nor by a module`);
  };
  const eff = where => (e, info) => {
    const w = `${where} ${info.path}`;
    if (e.add_spirit !== undefined) sp(w, e.add_spirit);
    if (e.remove_spirit !== undefined) sp(w, e.remove_spirit);
    if (e.swap_spirit !== undefined) e.swap_spirit.forEach(r => sp(w, r));
    if (e.timed_spirit !== undefined) sp(w, e.timed_spirit.key);
    if (e.event !== undefined) ev(w, refKey(e, 'event'));
    if (e.event_for !== undefined) ev(w, e.event_for.key);
    if (e.clear_flag !== undefined) flag(w, e.clear_flag, false);
    if (e.opinion !== undefined) {
      const m = e.opinion.modifier;
      if (m.startsWith('zin_')) { if (!reg.has('opinion_modifiers', m) && !Object.keys(tree.opinion_modifiers ?? {}).some(k => opinionId(tree, k) === m)) add('opinion_unresolved', `${w}: opinion modifier ${m} is not written by this tree or a module`); }
      else if (!(tree.opinion_modifiers ?? {})[m]) add('opinion_unknown', `${w}: ${m} is not an opinion modifier of the tree`);
    }
    if (e.faction !== undefined && !reg.has('faction_templates', `zin_faction_${e.faction}`)) add('faction_unresolved', `${w}: faction template zin_faction_${e.faction} is not written by any module (E3)`);
    if (e.building !== undefined) {
      const where2 = e.building.where;
      if (!['capital', 'random_owned', 'random_coastal'].includes(where2)) {
        const trigger = where2.startsWith('region:') ? `zin_is_region_${where2.slice(7)}` : `zin_is_site_${where2}`;
        if (!reg.has('scripted_triggers', trigger)) add('site_unresolved', `${w}: ${trigger} is not in the key-sites table (F5, E7)`);
      }
    }
    if (e.call !== undefined) {
      if (!localEffects.has(e.call) && !reg.has('scripted_effects', e.call)) add('effect_unresolved', `${w}: scripted effect ${e.call} is defined neither by the tree nor by a module`);
      if (e.call === 'zin_aenor_event_for_parim') {
        if (typeof e.args?.event !== 'string') add('call_arg_missing', `${w}: ${e.call} needs the argument event (an event key)`); else ev(w, e.args.event);
      }
    }
  };
  for (const f of tree.focuses) {
    const w = `focus ${f.key}`;
    for (const k of ['available', 'bypass', 'allow_branch']) walkConditions(f[k], cond(`${w}.${k}`));
    for (const m of f.ai?.modifiers ?? []) walkConditions(m.if, cond(`${w}.ai`));
    walkEffects(f.effects, eff(w)); walkEffects(f.effects, (e, info) => { if (e.if) walkConditions(e.if.limit, cond(`${w} ${info.path}`)); });
  }
  for (const [k, s] of Object.entries(tree.spirits ?? {})) walkConditions(s.cancel, cond(`spirit ${k}.cancel`));
  for (const [k, e] of Object.entries(tree.events ?? {})) e.options.forEach((o, i) => {
    walkEffects(o.effects, eff(`event ${k} option ${i + 1}`));
    walkEffects(o.effects, (x, info) => { if (x.if) walkConditions(x.if.limit, cond(`event ${k} option ${i + 1} ${info.path}`)); });
    for (const m of o.ai_chance?.modifiers ?? []) walkConditions(m.if, cond(`event ${k} option ${i + 1}.ai_chance`));
  });
  for (const [id, se] of Object.entries(tree.scripted_effects ?? {})) {
    walkEffects(se.effects, eff(`effect ${id}`));
    walkEffects(se.effects, (x, info) => { if (x.if) walkConditions(x.if.limit, cond(`effect ${id} ${info.path}`)); });
  }
  for (const [id, tr] of Object.entries(tree.scripted_triggers ?? {})) walkConditions(tr.conditions, cond(`trigger ${id}`));
  tree.ai_strategies?.forEach((s, i) => walkConditions(s.if, cond(`ai_strategies[${i}]`)));
  // Declared names carry their tree's prefix (or a declared name_prefix).
  const prefixes = prefixesOf(tree);
  for (const group of ['scripted_effects', 'scripted_triggers']) for (const id of Object.keys(tree[group] ?? {})) {
    if (!prefixes.some(p => id.startsWith(p))) add('name_prefix', `${group} ${id} must start with ${prefixes.join(' or ')}`);
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ events
export function checkEventIds(tree, ctx) {
  const out = [], t = tree.id, ids = new Map();
  const numbers = eventNumbers(tree);
  for (const key of Object.keys(tree.events ?? {})) {
    const id = eventId(tree, key, numbers);
    if (ids.has(id)) out.push(problem('event_duplicate', t, `events ${ids.get(id)} and ${key} compile to the same id ${id}`));
    ids.set(id, key);
    if (ctx.registry.has('events', id)) out.push(problem('collision_event', t, `F3: event ${id} is also written by another module`));
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ calls (E1)
export function checkCalls(tree, ctx) {
  const out = [], t = tree.id, add = (code, msg) => out.push(problem(code, t, msg));
  const roster = new Set(ctx.roster.map(c => c.name));
  const isCountry = v => COUNTRY_TOKENS.includes(v) || roster.has(v);
  allEffects(tree, (e, info) => {
    if (e.call === undefined) return;
    const where = `${info.kind} ${info.key} ${info.path}`, args = e.args ?? {};
    const decl = tree.scripted_effects?.[e.call]?.args;
    if (decl) {
      for (const name of Object.keys(decl)) if (!(name in args)) add('call_arg_missing', `${where}: call ${e.call} does not pass ${name}, which the effect reads (E1)`);
      for (const [name, val] of Object.entries(args)) {
        const kind = decl[name];
        if (!kind) { add('call_arg_unknown', `${where}: call ${e.call} passes ${name}, which the effect does not declare`); continue; }
        if (typeof val === 'object') continue;   // { variable } passes through whatever the variable holds
        if (kind === 'number') { if (typeof val !== 'number') add('call_arg_kind', `${where}: ${e.call} argument ${name} is a number`); }
        else if (kind === 'country') { if (typeof val !== 'string' || !isCountry(val)) add('call_arg_kind', `${where}: ${e.call} argument ${name} is a country`); }
        else if (typeof val !== 'string' || !(val in kind.keyword)) add('call_keyword_nocode', `${where}: ${e.call} argument ${name}: ${JSON.stringify(val)} has no code (codes: ${Object.keys(kind.keyword).join(', ')})`);
      }
      return;
    }
    if (e.call === 'zin_aenor_event_for_parim') return;
    for (const [name, val] of Object.entries(args)) {
      if (typeof val !== 'string') continue;
      const table = codesFor(ctx.codes, e.call, name);
      if (table && val in table) continue;
      if (isCountry(val)) continue;
      add('call_keyword_nocode', `${where}: call ${e.call} argument ${name}: keyword ${JSON.stringify(val)} has no code in focus_arg_codes.json (E1)`);
    }
  });
  // Arguments a tree-declared effect reads must be declared.
  for (const [id, se] of Object.entries(tree.scripted_effects ?? {})) {
    const reads = new Set();
    const scan = s => { for (const m of String(s).matchAll(/zin_arg_([a-z0-9_]+)/g)) reads.add(m[1]); };
    walkEffects(se.effects, e => { if (e.raw !== undefined) scan(e.raw); if (e.call) for (const v of Object.values(e.args ?? {})) if (v?.variable) scan(v.variable); });
    for (const name of reads) if (!(name in (se.args ?? {}))) add('effect_arg_undeclared', `effect ${id} reads zin_arg_${name} but does not declare the argument`);
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ allow_branch (E4)
const FIXED = new Set(['people', 'country', 'rule', 'region']);
const REFRESHED = new Set(['ideology', 'is_subject', 'subject_of']);
// 'fixed' | 'refreshed' | 'bad' for one condition of an allow_branch list (decision E4, decision S9).
export function classifyBranchCondition(c, tree, ctx, seen = new Set()) {
  const [k] = Object.keys(c), v = c[k], reg = ctx.registry;
  if (FIXED.has(k)) return 'fixed';
  if (REFRESHED.has(k)) return 'refreshed';
  if (k === 'flag' || k === 'global_flag' || k === 'not_flag') return reg.branch.refreshed_flags.has(v) ? 'refreshed' : 'bad';
  if (k === 'check') {
    if (reg.branch.fixed_checks.has(v)) return 'fixed';
    if (reg.branch.refreshed_checks.has(v) || reg.branch.patterns.some(re => re.test(v))) return 'refreshed';
    const body = tree.scripted_triggers?.[v];
    if (body && !seen.has(v)) {
      seen.add(v);
      const kinds = body.conditions.map(x => classifyBranchCondition(x, tree, ctx, seen));
      return kinds.includes('bad') ? 'bad' : kinds.includes('refreshed') ? 'refreshed' : 'fixed';
    }
    return 'bad';
  }
  if (k === 'not' || k === 'or' || k === 'and') {
    const kinds = v.map(x => classifyBranchCondition(x, tree, ctx, seen));
    return kinds.includes('bad') ? 'bad' : kinds.includes('refreshed') ? 'refreshed' : 'fixed';
  }
  return 'bad';
}
const sameCondition = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export function checkAllowBranch(tree, ctx) {
  const out = [], t = tree.id;
  for (const f of tree.focuses) {
    for (const c of f.allow_branch ?? []) {
      const kind = classifyBranchCondition(c, tree, ctx);
      const name = JSON.stringify(c);
      if (kind === 'bad') out.push(problem('allow_branch_changing', t, `focus ${f.key}: allow_branch holds ${name}, which changes in play and has no layout refresh; put it in available (E4)`));
      else if (kind === 'refreshed') {
        const flat = [...(f.available ?? []), ...(f.available ?? []).flatMap(x => x.and ?? [])];
        if (!flat.some(x => sameCondition(x, c))) out.push(problem('allow_branch_not_repeated', t, `focus ${f.key}: allow_branch holds ${name}, which changes at a refresh point; the same condition must stand in available (E4)`));
      }
    }
  }
  return out;
}
export const usesRefreshedBranch = (tree, ctx) => tree.focuses.some(f => (f.allow_branch ?? []).some(c => classifyBranchCondition(c, tree, ctx) === 'refreshed'));

// The shared layout file must exist whenever a tree exists and name the six on_actions of E4.
export function checkLayoutRefresh(trees, layoutText) {
  if (!trees.length) return [];
  const missing = LAYOUT_ACTIONS.filter(a => !new RegExp(`\\b${a}\\s*=`).test(layoutText ?? ''));
  const dirty = /mark_focus_tree_layout_dirty/.test(layoutText ?? '');
  return missing.length || !dirty ? [problem('layout_refresh_missing', null, `common/on_actions/zin_focus_layout.txt must run mark_focus_tree_layout_dirty in ${LAYOUT_ACTIONS.join(', ')}; missing ${missing.join(', ') || 'the effect'} (E4)`)] : [];
}

// ------------------------------------------------------------------------------------------------ text
const CP1252_EXTRA = new Set([...'€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ']);
export const isCp1252 = s => [...s].every(c => { const n = c.codePointAt(0); return n === 9 || n === 10 || (n >= 0x20 && n <= 0x7e) || (n >= 0xa0 && n <= 0xff) || CP1252_EXTRA.has(c); });
const SUPERSEDED = [[/Einendil|Edvoid/i, 'Einendil or Edvoid'], [/\bRush\b/, 'Rush'], [/\bKlinti\b|\bGorbat\b|Sovereign Spirit/i, 'a superseded name']];
const SECRET = [[/Afrit/i, 'Afrit'], [/Hidden Council/i, 'Hidden Council']];

// Every player-visible text of a tree with its owner: { text, where, owner: { kind, key }, gate }.
export function collectTexts(tree) {
  const out = [], push = (text, where, owner, gate) => { if (typeof text === 'string') out.push({ text, where, owner, gate }); };
  for (const f of tree.focuses) { push(f.name, `focus ${f.key} name`, { kind: 'focus', key: f.key }, f.text_gate); push(f.desc, `focus ${f.key} desc`, { kind: 'focus', key: f.key }, f.text_gate); }
  for (const [k, s] of Object.entries(tree.spirits ?? {})) { push(s.name, `spirit ${k} name`, { kind: 'spirit', key: k }, s.text_gate); push(s.desc, `spirit ${k} desc`, { kind: 'spirit', key: k }, s.text_gate); }
  for (const [k, e] of Object.entries(tree.events ?? {})) {
    push(e.title, `event ${k} title`, { kind: 'event', key: k }, e.text_gate); push(e.desc, `event ${k} desc`, { kind: 'event', key: k }, e.text_gate);
    e.options.forEach((o, i) => push(o.name, `event ${k} option ${i + 1}`, { kind: 'event', key: k }, e.text_gate));
  }
  for (const [k, m] of Object.entries(tree.opinion_modifiers ?? {})) push(m.name ?? titleCase(k), `opinion ${k} name`, { kind: 'opinion', key: k });
  allEffects(tree, (e, info) => {
    if (e.tooltip === undefined) return;
    const gate = info.kind === 'focus' ? tree.focuses.find(f => f.key === info.key)?.text_gate : info.kind === 'event' ? tree.events[info.key].text_gate : undefined;
    push(e.tooltip, `${info.kind} ${info.key} tooltip`, { kind: info.kind, key: info.key }, gate);
  });
  return out;
}

function* strings(node) {
  if (typeof node === 'string') yield node;
  else if (Array.isArray(node)) for (const x of node) yield* strings(x);
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) { yield k; yield* strings(v); }
}

export function checkText(tree, ctx) {
  const out = [], t = tree.id;
  for (const x of collectTexts(tree)) {
    if (!x.text.trim()) out.push(problem('text_empty', t, `${x.where} is empty`));
    else if (!isCp1252(x.text)) out.push(problem('text_charset', t, `${x.where} holds a character outside Windows-1252: ${JSON.stringify([...x.text].find(c => !isCp1252(c)))}`));
    for (const [re, label] of SUPERSEDED) if (re.test(x.text)) out.push(problem('text_superseded', t, `${x.where} uses the superseded name ${label}`));
    for (const retired of ctx.retired.texts) if (new RegExp(`\\b${retired.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(x.text)) out.push(problem('retired_name', t, `${x.where} uses the retired text "${retired}"`));
  }
  const seen = new Set();
  for (const s of strings(tree)) {
    for (const [tok] of s.matchAll(/[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*/g)) {
      if (seen.has(tok)) continue; seen.add(tok);
      if (ctx.retired.ids.has(tok) || ctx.retired.patterns.some(re => re.test(tok))) out.push(problem('retired_name', t, `${tok} is a retired name of the contract register (N16)`));
    }
  }
  return out;
}

// The secret scan (D1, D3, check 9): no text reachable before the reveal names Afrit or the Hidden Council unless the
// item declares text_gate zin_afrit_revealed and the gate is provable.
export function checkSecrets(tree) {
  const out = [], t = tree.id, prover = gateProver(tree);
  const proves = owner => {
    if (owner.kind === 'focus') return (tree.focuses.find(f => f.key === owner.key).allow_branch ?? []).some(c => c.global_flag === GATE_FLAG);
    if (owner.kind === 'event') return prover.proven({ kind: 'event', key: owner.key }, GATE_FLAG);
    if (owner.kind === 'spirit') return prover.proven({ kind: 'spirit', key: spiritId(tree, owner.key) }, GATE_FLAG);
    return false;
  };
  for (const x of collectTexts(tree)) {
    const hit = SECRET.find(([re]) => re.test(x.text));
    if (!hit) continue;
    if (x.gate === undefined) out.push(problem('secret_leak', t, `${x.where} names ${hit[1]} and is reachable before ${GATE_FLAG}; declare text_gate or reword`));
    else if (x.gate !== GATE_FLAG) out.push(problem('secret_gate_flag', t, `${x.where} names ${hit[1]} with text_gate ${x.gate}; only ${GATE_FLAG} reveals the name`));
    else if (!proves(x.owner)) out.push(problem('secret_gate_unproven', t, `${x.where} names ${hit[1]} but its ${x.owner.kind} is not provably behind ${GATE_FLAG}`));
  }
  return out;
}

// Research bonuses name their focus or event option in the tooltip (add_tech_bonus name), so a scripted effect, which
// has no localisation key of its own, cannot grant one.
export function checkContexts(tree) {
  const out = [];
  allEffects(tree, (e, info) => {
    if (e.research !== undefined && info.kind === 'effect') out.push(problem('research_context', tree.id, `effect ${info.key}: a research bonus needs a focus or event to name it; grant it from the focus or event`));
  });
  return out;
}

// ------------------------------------------------------------------------------------------------ tiers, raw, coverage, collisions
export function checkTierRange(tree, ranges = TIER_RANGES) {
  const r = ranges?.[tree.tier];
  if (!r) return [];
  const n = tree.focuses.length;
  return n < r[0] || n > r[1] ? [problem('tier_range', tree.id, `${tree.tier} trees hold ${r[0]} to ${r[1]} focuses counted over the whole tree (F6); this one holds ${n}`)] : [];
}
export function checkRaw(tree) {
  const n = countRaw(tree);
  return tree.tier === 'major' && n > RAW_LIMIT_MAJOR ? [problem('raw_limit', tree.id, `a major tree may use at most ${RAW_LIMIT_MAJOR} raw blocks; this one uses ${n}`)] : [];
}
// Every country of the roster has exactly one tree; only meaningful when all trees are present.
export function checkCoverage(trees, roster, { requireAll = true } = {}) {
  const out = [], owners = new Map();
  for (const tree of trees) for (const name of tree.countries) { if (!owners.has(name)) owners.set(name, []); owners.get(name).push(tree.id); }
  for (const c of roster) {
    const o = owners.get(c.name) ?? [];
    if (o.length === 0) { if (requireAll) out.push(problem('coverage_none', null, `${c.name} (${c.tag}) has no focus tree`)); }
    else if (o.length > 1) out.push(problem('coverage_many', null, `${c.name} (${c.tag}) has ${o.length} trees: ${o.join(', ')}`));
  }
  return out;
}

export function checkCollisions(trees, ctx) {
  const out = [], reg = ctx.registry, seenId = new Map();
  const claim = (space, id, tree, what) => {
    const k = `${space}:${id}`;
    if (seenId.has(k)) out.push(problem('collision_tree', tree.id, `F3: ${what} ${id} is also written by ${seenId.get(k)}`));
    else seenId.set(k, `tree ${tree.id}`);
  };
  const ids = new Set();
  for (const tree of trees) {
    if (ids.has(tree.id)) out.push(problem('collision_tree', tree.id, `F3: tree id ${tree.id} is used twice`));
    ids.add(tree.id);
    for (const id of [tree.id, `zin_${tree.id}`]) if (reg.hasMechanicId(id)) out.push(problem('collision_mechanic', tree.id, `F3: tree id ${tree.id} equals the id ${id} written by a module`));
    const loc = [];
    for (const f of tree.focuses) loc.push([focusId(tree, f.key), 'focus']);
    for (const k of Object.keys(tree.spirits ?? {})) loc.push([spiritId(tree, k), 'spirit']);
    for (const k of Object.keys(tree.opinion_modifiers ?? {})) loc.push([opinionId(tree, k), 'opinion modifier']);
    const seenHere = new Map();
    for (const [id, what] of loc) {
      if (seenHere.has(id) && seenHere.get(id) !== what && !(new Set([what, seenHere.get(id)]).has('spirit') && new Set([what, seenHere.get(id)]).has('focus'))) out.push(problem('key_collision', tree.id, `F3: ${what} ${id} equals the ${seenHere.get(id)} of the same id; they would share a localisation key`));
      seenHere.set(id, what);
      claim('loc', id, tree, what);
      if (reg.hasMechanicId(id)) out.push(problem('collision_mechanic', tree.id, `F3: ${what} ${id} equals an id written by a mechanic module (idea, decision, opinion modifier, sub-unit or character)`));
    }
    for (const id of Object.keys(tree.scripted_effects ?? {})) { claim('effect', id, tree, 'scripted effect'); if (reg.sets.scripted_effects.has(id)) out.push(problem('collision_mechanic', tree.id, `F3: scripted effect ${id} is also written by a module`)); }
    for (const id of Object.keys(tree.scripted_triggers ?? {})) { claim('trigger', id, tree, 'scripted trigger'); if (reg.sets.scripted_triggers.has(id)) out.push(problem('collision_mechanic', tree.id, `F3: scripted trigger ${id} is also written by a module`)); }
    if (Object.keys(tree.opinion_modifiers ?? {}).length) {
      claim('effect', helperId(tree), tree, 'scripted effect');
      if (tree.scripted_effects?.[helperId(tree)]) out.push(problem('collision_tree', tree.id, `F3: ${helperId(tree)} is generated for the opinion modifiers; the tree must not declare it`));
    }
    for (const [key, id] of ownEventIds(tree)) claim('event', id, tree, `event ${key}`);
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ aggregates
// Everything that looks at one effective tree and needs no async work.
export function checkTree(tree, ctx) {
  return [
    ...checkStructure(tree), ...checkIcons(tree, ctx), ...checkEventPictures(tree, ctx), ...checkEventIds(tree, ctx),
    ...checkReferences(tree, ctx), ...checkContexts(tree), ...checkCalls(tree, ctx), ...checkAllowBranch(tree, ctx),
    ...checkText(tree, ctx), ...checkSecrets(tree, ctx), ...(ctx.tierRanges === null ? [] : checkTierRange(tree, ctx.tierRanges ?? TIER_RANGES)), ...checkRaw(tree),
  ];
}
export async function checkTrees(trees, ctx) {
  const out = [...checkCollisions(trees, ctx)];
  for (const tree of trees) { out.push(...checkTree(tree, ctx)); out.push(...await checkModifiers(tree, ctx)); }
  return out;
}
