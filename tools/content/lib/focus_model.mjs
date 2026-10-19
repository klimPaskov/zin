// Shared helpers of the focus compiler and its checks: tree files, compiled ids, event numbers, absolute focus
// positions, effect and condition walkers, and the expansion of `copy` blocks (decision F1). Nothing here writes.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export const prefixOf = tree => `zin_${tree.id}_`;
export const prefixesOf = tree => [prefixOf(tree), ...(tree.name_prefixes ?? [])];
export const namespaceOf = tree => tree.event_namespace ?? `zin_${tree.id}`;
export const isFull = ref => ref.startsWith('zin_');

export const focusId = (tree, key) => `${prefixOf(tree)}${key}`;
export const spiritId = (tree, ref) => isFull(ref) ? ref : `${prefixOf(tree)}${ref}`;
export const opinionId = (tree, ref) => isFull(ref) ? ref : `${prefixOf(tree)}${ref}`;
export const helperId = tree => `${prefixOf(tree)}opinion`;
// The text of an opinion modifier that names none: its key in title case.
export const titleCase = key => key.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

// Event numbers: explicit `n` on every event, or 1..k in file order when none carries it. An id is namespace.(base + n).
export function eventNumbers(tree) {
  const out = new Map(), keys = Object.keys(tree.events ?? {});
  keys.forEach((k, i) => out.set(k, 'n' in tree.events[k] ? tree.events[k].n : i + 1));
  return out;
}
export function eventId(tree, ref, numbers = eventNumbers(tree)) {
  if (ref.includes('.')) return ref;
  if (!numbers.has(ref)) return `${namespaceOf(tree)}.?${ref}`;
  return `${namespaceOf(tree)}.${(tree.event_base ?? 0) + numbers.get(ref)}`;
}
export const ownEventIds = tree => { const n = eventNumbers(tree); return new Map(Object.keys(tree.events ?? {}).map(k => [k, eventId(tree, k, n)])); };

// ------------------------------------------------------------------------------------------------ files
export async function readTreeFiles(dir) {
  let names;
  try { names = (await readdir(dir)).filter(n => n.endsWith('.json')).sort(); } catch (e) { if (e.code === 'ENOENT') return []; throw e; }
  const out = [];
  for (const name of names) {
    const file = path.join(dir, name), entry = { file, name: name.slice(0, -5) };
    try { entry.data = JSON.parse(await readFile(file, 'utf8')); } catch (e) { entry.error = `invalid JSON: ${e.message}`; }
    out.push(entry);
  }
  return out;
}

// ------------------------------------------------------------------------------------------------ positions
// Absolute grid position of every focus; a focus with relative_to is placed relative to that focus (engine
// relative_position_id). Returns { pos: Map key -> {x, y}, problems: [message] }.
export function absolutePositions(tree) {
  const byKey = new Map();
  for (const f of tree.focuses) if (!byKey.has(f.key)) byKey.set(f.key, f);
  const pos = new Map(), problems = [], state = new Map();
  const resolve = key => {
    if (pos.has(key)) return pos.get(key);
    const f = byKey.get(key);
    if (state.get(key) === 'busy') { problems.push(`relative_to forms a loop at ${key}`); return { x: f.x, y: f.y }; }
    state.set(key, 'busy');
    let p = { x: f.x, y: f.y };
    if (f.relative_to !== undefined) {
      if (!byKey.has(f.relative_to)) problems.push(`${key}: relative_to ${f.relative_to} is not a focus of the tree`);
      else if (f.relative_to === key) problems.push(`${key}: relative_to names the focus itself`);
      else { const base = resolve(f.relative_to); p = { x: base.x + f.x, y: base.y + f.y }; }
    }
    state.set(key, 'done'); pos.set(key, p);
    return p;
  };
  for (const key of byKey.keys()) resolve(key);
  return { pos, problems };
}

// ------------------------------------------------------------------------------------------------ walkers
// Calls cb(effect, info) for every effect object, in order. info.known is the set of global flags certain to be set
// when the effect runs: flags tested by the enclosing `if` limits, by `base` (the focus's available and allow_branch),
// and flags set by earlier effects of the same list (decision E5). info.path is a JSON-style path.
export function walkEffects(effects, cb, { known = new Set(), path = '' } = {}) {
  const seen = new Set(known);
  (effects ?? []).forEach((e, i) => {
    const here = `${path}[${i}]`;
    cb(e, { known: new Set(seen), path: here });
    if (e.if) {
      const inner = new Set(seen); for (const f of requiredGlobalFlags(e.if.limit)) inner.add(f);
      walkEffects(e.if.then, cb, { known: inner, path: `${here}.if.then` });
      walkEffects(e.if.else, cb, { known: new Set(seen), path: `${here}.if.else` });
    }
    if (e.for_country) walkEffects(e.for_country.effects, cb, { known: new Set(seen), path: `${here}.for_country.effects` });
    if (e.global_flag) seen.add(e.global_flag);
  });
}
// Global flags that every passing check must have: top-level (and `and`-nested) global_flag conditions.
export function requiredGlobalFlags(conds) {
  const out = new Set();
  const visit = list => { for (const c of list ?? []) { if (c.global_flag) out.add(c.global_flag); if (c.and) visit(c.and); } };
  visit(conds);
  return out;
}
// Calls cb(condition) for every condition object, descending into not, or and and.
export function walkConditions(conds, cb) {
  for (const c of conds ?? []) {
    cb(c);
    for (const k of ['not', 'or', 'and']) if (c[k]) walkConditions(c[k], cb);
  }
}
// Every condition list of an effect list (the limits of if blocks), for reference checks.
export function walkEffectConditions(effects, cb) {
  walkEffects(effects, e => { if (e.if) walkConditions(e.if.limit, cb); });
}
// Calls cb(condition) for every condition anywhere in a tree.
export function allConditions(tree, cb) {
  for (const f of tree.focuses) {
    for (const k of ['available', 'bypass', 'allow_branch']) walkConditions(f[k], cb);
    for (const m of f.ai?.modifiers ?? []) walkConditions(m.if, cb);
    walkEffectConditions(f.effects, cb);
  }
  for (const s of Object.values(tree.spirits ?? {})) walkConditions(s.cancel, cb);
  for (const e of Object.values(tree.events ?? {})) for (const o of e.options) {
    walkEffectConditions(o.effects, cb);
    for (const m of o.ai_chance?.modifiers ?? []) walkConditions(m.if, cb);
  }
  for (const e of Object.values(tree.scripted_effects ?? {})) walkEffectConditions(e.effects, cb);
  for (const t of Object.values(tree.scripted_triggers ?? {})) walkConditions(t.conditions, cb);
  for (const s of tree.ai_strategies ?? []) walkConditions(s.if, cb);
}
// Calls cb(effect, owner) for every effect anywhere in a tree; owner is { kind, key } (focus, event or effect).
export function allEffects(tree, cb) {
  for (const f of tree.focuses) walkEffects(f.effects, (e, info) => cb(e, { kind: 'focus', key: f.key, ...info }), { known: focusKnown(f) });
  for (const [k, ev] of Object.entries(tree.events ?? {})) ev.options.forEach((o, i) => walkEffects(o.effects, (e, info) => cb(e, { kind: 'event', key: k, option: i, ...info })));
  for (const [id, se] of Object.entries(tree.scripted_effects ?? {})) walkEffects(se.effects, (e, info) => cb(e, { kind: 'effect', key: id, ...info }));
}
// Global flags a focus's effects may rely on: its available and allow_branch conditions.
export const focusKnown = f => new Set([...requiredGlobalFlags(f.available), ...requiredGlobalFlags(f.allow_branch)]);

// ------------------------------------------------------------------------------------------------ copies
function rewrite(node, fn) {
  if (Array.isArray(node)) return node.map(x => rewrite(x, fn));
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = fn(k, v) ?? rewrite(v, fn);
    return out;
  }
  return node;
}

// Expands every tree's `copy` entries (F1). Returns { trees: Map id -> effective tree, problems: [{ tree, message }] }.
// A copy takes each focus of the shared tree tagged with the module, gives it this tree's ids (ids are computed from
// the tree, so only keys are carried), moves it by the offset between the module's root and root_at, replaces the
// root's prerequisite, and re-declares the module's spirits, opinion modifiers and scripted effects and triggers
// under this tree's prefix.
export function expandCopies(trees) {
  const problems = [], byId = new Map(trees.map(t => [t.id, t])), out = new Map();
  for (const tree of trees) {
    const eff = structuredClone(tree);
    for (const [index, cp] of (tree.copy ?? []).entries()) {
      const where = `copy[${index}]`, fail = message => problems.push({ tree: tree.id, message: `${where}: ${message}` });
      const src = byId.get(cp.from);
      if (!src) { fail(`${cp.from} is not a tree`); continue; }
      if (src.tier !== 'shared') { fail(`${cp.from} is not a shared tree`); continue; }
      const mod = src.focuses.filter(f => f.module === cp.module);
      if (!mod.length) { fail(`${cp.from} has no focus tagged module ${cp.module}`); continue; }
      const keys = new Set(mod.map(f => f.key));
      const roots = mod.filter(f => !(f.prerequisite ?? []).flat().some(k => keys.has(k)));
      if (roots.length !== 1) { fail(`module ${cp.module} of ${cp.from} needs exactly one root (a focus with no prerequisite inside the module), found ${roots.length}`); continue; }
      const root = roots[0];
      if (root.relative_to !== undefined) { fail(`the root ${root.key} must have an absolute position`); continue; }
      const dx = cp.root_at[0] - root.x, dy = cp.root_at[1] - root.y;
      // Names of the module's effects and triggers move to this tree's prefix.
      const renames = new Map();
      const prefixes = prefixesOf(src);
      for (const group of ['scripted_effects', 'scripted_triggers']) for (const [id, def] of Object.entries(src[group] ?? {})) {
        if (def.module !== cp.module) continue;
        const p = prefixes.find(x => id.startsWith(x));
        renames.set(id, p ? `${prefixOf(tree)}${id.slice(p.length)}` : id);
      }
      const moduleSpirits = new Map(Object.entries(src.spirits ?? {}).filter(([, s]) => s.module === cp.module).map(([k]) => [`${prefixOf(src)}${k}`, k]));
      const moduleOpinions = new Map(Object.entries(src.opinion_modifiers ?? {}).filter(([, s]) => s.module === cp.module).map(([k]) => [`${prefixOf(src)}${k}`, k]));
      const fix = (k, v) => {
        if ((k === 'call' || k === 'check') && renames.has(v)) return renames.get(v);
        if ((k === 'add_spirit' || k === 'remove_spirit') && moduleSpirits.has(v)) return moduleSpirits.get(v);
        if (k === 'key' && moduleSpirits.has(v)) return moduleSpirits.get(v);
        if (k === 'swap_spirit' && Array.isArray(v)) return v.map(x => moduleSpirits.get(x) ?? x);
        if (k === 'modifier' && typeof v === 'string' && moduleOpinions.has(v)) return moduleOpinions.get(v);
        return undefined;
      };
      for (const f of mod) {
        const c = rewrite(structuredClone(f), fix);
        delete c.module; c.copied_from = `${cp.from}:${cp.module}`;
        if (c.relative_to === undefined) { c.x += dx; c.y += dy; }
        else if (!keys.has(c.relative_to)) fail(`${c.key}: relative_to ${c.relative_to} is outside the module`);
        if (f === root) { if (cp.root_prerequisite) c.prerequisite = structuredClone(cp.root_prerequisite); else delete c.prerequisite; }
        else if ((f.prerequisite ?? []).flat().some(k => !keys.has(k))) fail(`${c.key}: a prerequisite lies outside module ${cp.module}`);
        if ((f.mutually_exclusive ?? []).some(k => !keys.has(k))) fail(`${c.key}: an exclusive lies outside module ${cp.module}`);
        eff.focuses.push(c);
      }
      const take = (group, newKey = k => k) => {
        for (const [k, def] of Object.entries(src[group] ?? {})) {
          if (def.module !== cp.module) continue;
          const c = rewrite(structuredClone(def), fix); delete c.module;
          eff[group] ??= {};
          const nk = newKey(k);
          if (nk in eff[group]) fail(`${group} ${nk} already exists in this tree`); else eff[group][nk] = c;
        }
      };
      take('spirits'); take('opinion_modifiers'); take('scripted_effects', k => renames.get(k) ?? k); take('scripted_triggers', k => renames.get(k) ?? k);
    }
    out.set(tree.id, eff);
  }
  return { trees: out, problems };
}
