// The banned-word matcher (docs/specs/07_interface/05_text_sweep.md, section 8). It compiles the rules of
// data/banned_words.json and matches them against the words a player reads: whole words only (letters and digits
// make a word, a hyphen separates words, an apostrophe stays inside a word except for the possessive 's), case
// insensitive unless the rule says otherwise. Keys, ids and file names are never matched by the caller.
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const BANNED_FILE = path.join(here, '../data/banned_words.json');

export async function loadBanned(file = BANNED_FILE) {
  return JSON.parse(await readFile(file, 'utf8'));
}

const START = String.raw`(?<![\p{L}\p{N}])(?<![\p{L}\p{N}]')`;

// Compiles every rule; a rule that does not compile is a hard error (a build test asserts all 136 compile).
export function compileBanned(banned) {
  const rules = banned.rules.map(r => {
    let re;
    try { re = new RegExp(`${START}(?:${r.pattern})`, r.caseSensitive ? 'gu' : 'giu'); } catch (e) { throw new Error(`Banned rule ${r.id} does not compile: ${e.message}`); }
    return { id: r.id, class: r.class, severity: r.severity, re, replace: r.replace ?? '', why: r.why ?? '' };
  });
  return { rules, allowances: banned.allowances ?? [], classes: banned.classes ?? {} };
}

// True when the character after a match ends the word: not a letter or digit, and an apostrophe only as the
// possessive 's or a plural possessive.
function endsWord(text, end) {
  const c = text[end];
  if (c === undefined) return true;
  if (/[\p{L}\p{N}]/u.test(c)) return false;
  if (c === "'" || c === '’') {
    const n = text[end + 1], n2 = text[end + 2];
    if (n === undefined || !/[\p{L}\p{N}]/u.test(n)) return true;
    if ((n === 's' || n === 'S') && (n2 === undefined || !/[\p{L}\p{N}]/u.test(n2))) return true;
    return false;
  }
  return true;
}

// Returns the hits of every rule (or only those of `severities`) in a displayed text: [{ id, class, severity, word }].
export function findBanned(text, compiled, severities = null) {
  const hits = [];
  const t = String(text);
  for (const r of compiled.rules) {
    if (severities && !severities.includes(r.severity)) continue;
    r.re.lastIndex = 0;
    for (const m of t.matchAll(r.re)) {
      if (m[0] === '' || !endsWord(t, m.index + m[0].length)) continue;
      hits.push({ id: r.id, class: r.class, severity: r.severity, word: m[0] });
    }
  }
  return hits;
}

// Does an allowance entry cover a rule id for a key in a file? A rule reference may end in * (a prefix match).
export function allowanceCovers(allowance, ruleId, key, file) {
  const ruleOk = (allowance.rules ?? []).some(p => p.endsWith('*') ? ruleId.startsWith(p.slice(0, -1)) : p === ruleId);
  if (!ruleOk) return false;
  return (allowance.keys ?? []).includes(key) || (allowance.files ?? []).includes(file);
}

// ------------------------------------------------------------------------------------------------ rule sets
export const EXTRA_BANNED_FILE = path.join(here, '../data/text/banned_extra.json');

// The glossary adds the forbid words of every concept to the floor (spec 05, section 8): one rule per entry.
export function glossaryRules(entries) {
  const esc = w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const out = [];
  for (const e of entries) {
    if (!e.forbid?.length) continue;
    out.push({ id: `gl_${e.id}`, class: 'glossary', severity: 'error', pattern: e.forbid.map(w => (/^[A-Za-z]{3,}$/.test(w) ? `${esc(w)}(?:s|es)?` : esc(w))).join('|'), caseSensitive: false, replace: e.term?.s ?? e.guidance ?? '', why: `Glossary concept ${e.id}` });
  }
  return out;
}

// banned_words.json + the sweep's extra rules (data/text/banned_extra.json, for words the floor missed) + the glossary.
export async function loadRuleSet({ banned, extra, glossary } = {}) {
  const base = banned ?? await loadBanned();
  const more = extra ?? (existsSync(EXTRA_BANNED_FILE) ? JSON.parse(await readFile(EXTRA_BANNED_FILE, 'utf8')) : { rules: [] });
  const rules = [...base.rules, ...(more.rules ?? []), ...(glossary ? glossaryRules(glossary.glossary?.entries ?? glossary.entries ?? glossary) : [])];
  return { ...base, rules };
}
