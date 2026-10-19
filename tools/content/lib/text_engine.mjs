// The glossary and template engine of the vanilla text sweep (docs/specs/07_interface/05_text_sweep.md, sections 2
// and 4). It is pure: glossary + frames + a family file + the vanilla key table go in, ZIN text per key comes out.
// Every module that writes player text reads terms through term(); nothing here stores a vanilla sentence.
//
//   Slots in a template        {id}  {id:mod:mod}  {name:key}  {loc:concept}
//   Modifiers (left to right)  s p lc lcp a the uc1 people
//   Frame slots                {$name}  (a frame body is ZIN text with named holes)
//   Engine structure           $VAR|fmt$  [scope.Call]  §Y…§!  £icon  @TAG are written literally and are checked
//                              against the vanilla key by signature (lib/loc_parse.mjs)
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { signature, sigText, signatureDiff, displayText, isStructural } from './loc_parse.mjs';
import { findBanned } from './banned.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const GLOSSARY_FILE = path.join(here, '../data/glossary.json');
export const FRAMES_FILE = path.join(here, '../data/text/frames.json');

export class TextError extends Error {}

// ------------------------------------------------------------------------------------------------ glossary
export function indexGlossary(glossary) {
  const byId = new Map();
  for (const e of glossary.entries) {
    if (byId.has(e.id)) throw new TextError(`Glossary id ${e.id} is defined twice`);
    byId.set(e.id, e);
  }
  return { glossary, byId, stems: glossary.stems ?? {}, peoples: glossary.peoples ?? [] };
}

export async function loadGlossary(file = GLOSSARY_FILE) {
  return indexGlossary(JSON.parse(await readFile(file, 'utf8')));
}

export async function loadFrames(file = FRAMES_FILE) {
  return JSON.parse(await readFile(file, 'utf8')).frames ?? {};
}

const lowerFirst = s => s ? s[0].toLowerCase() + s.slice(1) : s;
const upperFirst = s => s ? s[0].toUpperCase() + s.slice(1) : s;
// A label in running text: every word lower-case except acronyms (AI).
const lowerLabel = s => String(s).split(' ').map(w => (w.length > 1 && w === w.toUpperCase() && /[A-Z]/.test(w) ? w : w.toLowerCase())).join(' ');
const autoArticle = s => (/^[aeiou]/i.test(s) ? 'an' : 'a');

// The forms of a term: s, p, lc, lcp, optionally for one people (a variant overrides s and p).
export function termForm(entry, form = 's', people = null) {
  if (entry.kind === 'forbidden') throw new TextError(`The forbidden concept ${entry.id} cannot be used as a term`);
  const base = entry.term ?? {};
  const v = people && entry.people?.[people] ? entry.people[people] : null;
  const s = v?.s ?? base.s, p = v?.p ?? base.p ?? s;
  const proper = entry.case === 'proper';
  const lc = v ? (proper ? s : lowerFirst(s)) : (base.lc ?? (proper ? base.s : lowerFirst(base.s)));
  const lcp = v ? (proper ? p : lowerFirst(p)) : (base.lcp ?? (proper ? base.p : lowerFirst(base.p ?? base.s)));
  const out = { s, p, lc, lcp }[form];
  if (out === undefined || out === null) throw new TextError(`Glossary entry ${entry.id} has no ${form} form`);
  return out;
}

// ------------------------------------------------------------------------------------------------ slots
const SLOT = /\{([a-z][a-z0-9_]*)((?::[A-Za-z0-9_]+)*)\}/g;
const MODS = new Set(['s', 'p', 'lc', 'lcp', 'a', 'the', 'uc1', 'people']);

// The engine of one expansion run: the glossary, the family's scope flag, the proper-name table and a log of the
// glossary ids and words it used (the scan reports them).
export function makeEngine({ glossary, frames = {}, names = null }) {
  const idx = glossary.byId ? glossary : indexGlossary(glossary);
  return { idx, frames, names };
}

export function expandSlots(template, engine, opts = {}) {
  const { scope = false, used = null, where = 'text' } = opts;
  return String(template).replace(SLOT, (whole, id, modText) => {
    const mods = modText ? modText.slice(1).split(':') : [];
    if (id === 'name') {
      const key = mods[0];
      const v = engine.names?.[key];
      if (!key || v === undefined) throw new TextError(`${where}: {name:${key}} names no proper name`);
      return v;
    }
    if (id === 'loc') {
      if (!mods[0]) throw new TextError(`${where}: {loc:} needs a concept`);
      return `[zin_loc_${mods[0]}]`;
    }
    const entry = engine.idx.byId.get(id);
    if (!entry) throw new TextError(`${where}: the glossary has no id ${id}`);
    if (entry.kind === 'forbidden') throw new TextError(`${where}: ${id} is a forbidden concept and cannot be a term. ${entry.guidance ?? ''}`.trim());
    for (const m of mods) if (!MODS.has(m)) throw new TextError(`${where}: unknown slot modifier ${m} in {${id}${modText}}`);
    used?.add(id);
    let plural = false, lc = false, article = null, up = false, people = false;
    for (const m of mods) {
      if (m === 's') plural = false;
      else if (m === 'p') plural = true;
      else if (m === 'lc') lc = true;
      else if (m === 'lcp') { lc = true; plural = true; }
      else if (m === 'a') { lc = true; article = 'a'; }
      else if (m === 'the') { lc = true; article = 'the'; }
      else if (m === 'uc1') up = true;
      else if (m === 'people') people = true;
    }
    const formName = lc ? (plural ? 'lcp' : 'lc') : (plural ? 'p' : 's');
    if (people) {
      if (!scope) throw new TextError(`${where}: {${id}:people} is used in a family whose text has no country in scope (check X6)`);
      if (!entry.people || !Object.keys(entry.people).length) throw new TextError(`${where}: ${id} has no people variants, so {${id}:people} is meaningless`);
      if (article || up) throw new TextError(`${where}: {${id}} cannot combine people with a, the or uc1`);
      return `[zin_term_${id}${{ s: '', p: '_p', lc: '_lc', lcp: '_lcp' }[formName]}]`;
    }
    let text = termForm(entry, formName);
    if (article && !plural) {
      const rule = entry.article ?? 'auto';
      const art = rule === 'none' ? '' : article === 'the' || rule === 'the' ? 'the' : rule === 'a' ? 'a' : rule === 'an' ? 'an' : autoArticle(text);
      // A proper noun keeps its capitals even in running text.
      if (entry.case === 'proper') text = termForm(entry, 's');
      text = art ? `${art} ${text}` : text;
    } else if (article === 'the' && plural && entry.article !== 'none') {
      text = `the ${text}`;
    }
    return up ? upperFirst(text) : text;
  });
}

// Glossary ids a template uses (for reports and the forbid check).
export function slotIds(template) {
  const out = new Set();
  for (const m of String(template).matchAll(SLOT)) if (!['name', 'loc'].includes(m[1])) out.add(m[1]);
  return out;
}

// ------------------------------------------------------------------------------------------------ frames
// A frame is ZIN text with named holes: { slots: ["a","b"], body: "{$a} needs {$b}." }. Every hole must be filled and
// nothing else may be passed.
export function applyFrame(frameId, frame, slots, where = 'frame') {
  if (!frame) throw new TextError(`${where}: unknown frame ${frameId}`);
  const declared = frame.slots ?? [];
  const given = Object.keys(slots ?? {});
  for (const s of declared) if (!(s in (slots ?? {}))) throw new TextError(`${where}: frame ${frameId} needs the slot ${s}`);
  for (const s of given) if (!declared.includes(s)) throw new TextError(`${where}: frame ${frameId} has no slot ${s}`);
  return String(frame.body).replace(/\{\$([a-z0-9_]+)\}/g, (w, n) => {
    if (!(n in slots)) throw new TextError(`${where}: frame ${frameId} body uses the undeclared slot ${n}`);
    return String(slots[n]);
  });
}

// ------------------------------------------------------------------------------------------------ stems
const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'vs', 'per', 'with', 'from']);
export function titleCase(text) {
  return String(text).split(/\s+/).filter(Boolean).map((w, i) => {
    if (i > 0 && SMALL.has(w.toLowerCase())) return w.toLowerCase();
    if (w.length > 1 && w === w.toUpperCase() && /[A-Z]/.test(w)) return w;
    return upperFirst(w);
  }).join(' ');
}

// The multi-word concepts of the glossary, by id (political_power, war_support, industrial_capacity ...): an id that
// names several tokens is matched as a phrase before single tokens are mapped.
export function phraseIndex(idx) {
  const out = new Map();
  for (const e of idx.glossary.entries) if (e.id.includes('_') && e.term?.s && !['forbidden', 'keep'].includes(e.kind)) out.set(e.id, e.term.s);
  return out;
}

// Composes a label from the tokens of an id (a modifier is named by its own id): multi-token glossary ids first, then
// the glossary stems token by token (a plural token follows its singular stem). `map` overrides a token, `phrases`
// adds phrases, `drop` removes tokens. A token that maps to "removed" makes the label unresolvable.
export function composeLabel(tokens, idx, { map = {}, drop = [], phrases = {} } = {}) {
  const stems = idx.stems ?? idx, phr = idx.byId ? phraseIndex(idx) : new Map();
  for (const [k, v] of Object.entries(phrases)) phr.set(k, v);
  const lower = tokens.map(t => t.toLowerCase());
  const words = [], unresolved = [];
  for (let i = 0; i < lower.length; i++) {
    let hit = null;
    for (let n = Math.min(4, lower.length - i); n >= 2 && !hit; n--) {
      const id = lower.slice(i, i + n).join('_');
      if (phr.has(id)) hit = { n, text: phr.get(id) };
    }
    if (hit) { words.push(hit.text); i += hit.n - 1; continue; }
    const t = lower[i];
    if (drop.includes(t)) continue;
    let m = map[t] ?? stems[t];
    if (m === undefined && t.endsWith('s') && t.length > 3) {
      const base = map[t.slice(0, -1)] ?? stems[t.slice(0, -1)];
      if (base === 'removed') m = 'removed';
      else if (base) m = base.endsWith('s') ? base : `${base}s`;
    }
    m ??= t;
    if (m === 'removed') { unresolved.push(t); continue; }
    if (m === '') continue;
    words.push(m);
  }
  return { label: titleCase(words.join(' ')), unresolved };
}

// ------------------------------------------------------------------------------------------------ families
// Evaluates a family file against the vanilla table (Map<key, { file, sig, vars }>) and returns the entries, the
// kept keys and the problems found. It never throws for a single bad row: the caller decides (the build refuses).
//   def.lit      { KEY: "text" }
//   def.rows     [{ key|match, frame, slots } | { stem, frame, ... } | { same: [KEY, FROM] }]
//   def.neutral  [{ keys: [...], reason }]      def.engine  [{ keys: [...], reason }]
export function renderFamily(def, vtable, engine, opts = {}) {
  const { scope = false, family = def.family, skip = () => false, banned = null } = opts;
  const entries = new Map(), problems = [], skipped = [], used = new Set(), how = new Map(), tpl = new Map();
  // A key belongs to the family its vanilla file is swept by, or that claims it by pattern (families.json claims).
  const inFamily = k => { const v = vtable.get(k); return !!v && (v.family === undefined || v.family === family); };
  const problem = (key, kind, detail) => problems.push({ family, key, kind, detail });
  const put = (key, text, kind, newKey = false) => {
    if (entries.has(key)) return problem(key, 'duplicate', `defined by two rows (${how.get(key)} and ${kind})`);
    const v = vtable.get(key);
    if (!newKey) {
      if (!v) return problem(key, 'unknown_key', 'the installed game does not define this key');
      if (!inFamily(key)) return problem(key, 'not_in_family', `the key sits in ${v.file}, which belongs to the ${v.family} family (check X14)`);
    }
    let out;
    try { out = expandSlots(text, engine, { scope, used, where: `${family}:${key}` }); } catch (e) { return problem(key, 'template', e.message); }
    if (!newKey && v.sig) {
      const got = signature(out);
      if (sigText(got) !== sigText(v.sig)) return problem(key, 'placeholders', signatureDiff(v.sig, got).join('; '));
    }
    if (banned && !newKey) {
      const hits = findBanned(displayText(out), banned, ['error']);
      if (hits.length) return problem(key, 'banned', `the text holds the banned word ${hits.map(h => `${h.word} (${h.id})`).join(', ')}`);
    }
    entries.set(key, out); how.set(key, kind); tpl.set(key, String(text));
  };
  // 1. literal rows, then explicit frame rows, then same rows, then stems for the keys nothing else claimed.
  for (const [key, text] of Object.entries(def.lit ?? {})) { if (skip(key)) { skipped.push({ key, reason: 'owned_elsewhere' }); continue; } put(key, text, 'lit'); }
  const stems = [];
  for (const row of def.rows ?? []) {
    if (row.stem) { stems.push(row); continue; }
    if (row.same) continue;
    const keys = row.key ? [row.key] : row.keys ?? [...vtable.keys()].filter(k => inFamily(k) && new RegExp(row.match).test(k));
    if (!row.key && !row.keys && !row.match) { problem('', 'row', 'a frame row needs key, keys or match'); continue; }
    for (const key of keys) {
      if (skip(key)) { skipped.push({ key, reason: 'owned_elsewhere' }); continue; }
      let text;
      try { text = applyFrame(row.frame, engine.frames[row.frame], row.slots ?? {}, `${family}:${key}`); } catch (e) { problem(key, 'frame', e.message); continue; }
      put(key, text, `frame:${row.frame}`);
    }
  }
  for (const row of def.rows ?? []) {
    if (!row.same) continue;
    const [key, from] = row.same;
    if (skip(key)) { skipped.push({ key, reason: 'owned_elsewhere' }); continue; }
    if (!entries.has(from)) { problem(key, 'same', `${from} has no ZIN text to copy`); continue; }
    put(key, entries.get(from), `same:${from}`);
  }
  // Keys the family keeps as shipped: a stem never rewrites them.
  const neutralKeys = new Set((def.neutral ?? []).flatMap(i => i.keys ?? []));
  const engineKeys = new Set((def.engine ?? []).flatMap(i => i.keys ?? []));
  for (const row of stems) {
    const re = new RegExp(row.stem);
    for (const [key, v] of vtable) {
      if (!inFamily(key) || entries.has(key) || skip(key) || neutralKeys.has(key) || engineKeys.has(key)) continue;
      const m = re.exec(key);
      if (!m) continue;
      if ((row.sig ?? 'empty') === 'empty' && v.sig && sigText(v.sig) !== sigText(signature(''))) continue;
      const id = m[1] ?? m.groups?.id;
      const tokens = String(id).split('_').filter(Boolean);
      // A stem rewrites a key only where its id names a banned concept (the id is an engine identifier, not vanilla
      // text); a plain id keeps the label the game ships. row.when = "always" rewrites every match.
      if ((row.when ?? 'banned') === 'banned' && banned && !findBanned(tokens.join(' '), banned, ['error']).length) { skipped.push({ key, reason: 'unchanged: no banned concept in the id' }); continue; }
      const { label, unresolved } = composeLabel(tokens, engine.idx, { map: { ...(def.tokenMap ?? {}), ...(row.map ?? {}) }, drop: row.drop ?? def.drop, phrases: { ...(def.phrases ?? {}), ...(row.phrases ?? {}) } });
      if (unresolved.length) { skipped.push({ key, reason: `removed concept: ${unresolved.join(' ')}` }); continue; }
      if (!label) { skipped.push({ key, reason: 'empty label' }); continue; }
      // v.vars holds the vanilla key's variables in order of appearance (structure only, never words).
      const slotValues = { label, label_lc: lowerLabel(label), ...Object.fromEntries((v.vars ?? []).map((x, i) => [`v${i + 1}`, x])) };
      const want = engine.frames[row.frame]?.slots ?? [];
      if (want.some(s => slotValues[s] === undefined)) { skipped.push({ key, reason: 'the frame needs a placeholder the key lacks' }); continue; }
      let text;
      try { text = applyFrame(row.frame, engine.frames[row.frame], Object.fromEntries(want.map(s => [s, slotValues[s]])), `${family}:${key}`); } catch (e) { problem(key, 'frame', e.message); continue; }
      if (banned) { const left = findBanned(displayText(text), banned, ['error']); if (left.length) { skipped.push({ key, reason: `unresolved word: ${left.map(h => h.word).join(' ')}` }); continue; } }
      put(key, text, `stem:${row.frame}`);
    }
  }
  const kept = (list, mode) => {
    const out = new Map();
    for (const item of list ?? []) for (const key of item.keys ?? []) {
      if (!vtable.has(key)) { problem(key, 'unknown_key', `${mode} list names a key the game does not define`); continue; }
      if (entries.has(key)) { problem(key, 'duplicate', `${mode} list names a key the family also writes`); continue; }
      if (!item.reason) problem(key, 'reason', `${mode} entry has no reason`);
      out.set(key, item.reason ?? '');
    }
    return out;
  };
  const neutral = kept(def.neutral, 'neutral'), engineKept = kept(def.engine, 'engine');
  // X6: a forbid word of a used concept must not appear in the finished text of the entry that used it.
  for (const [key, text] of entries) {
    for (const id of slotIds(tpl.get(key) ?? '')) {
      const e = engine.idx.byId.get(id);
      for (const w of e?.forbid ?? []) if (new RegExp(`(?<![\\p{L}\\p{N}])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'iu').test(displayText(text))) problem(key, 'forbid', `the text about ${id} holds the forbidden word ${w}`);
    }
  }
  return { entries, neutral, engineKept, problems, skipped, used };
}

export { signature, sigText, displayText, isStructural };
