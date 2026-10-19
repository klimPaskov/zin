// Localisation reading helpers shared by the text sweep (modules/text_sweep.mjs) and the text scan
// (checks/text_scan.mjs). They read .yml files into key tables, split a value into its engine structure (variables,
// scope calls, colour codes, icon codes) and its displayed words, and compare two values by structure only.
// Nothing here prints or stores a vanilla sentence beyond the table the caller asks for.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export const LANGUAGES = ['english', 'braz_por', 'french', 'german', 'japanese', 'korean', 'polish', 'russian', 'simp_chinese', 'spanish'];

const ENTRY = /^[ \t]*([^\s:#]+):(\d*)[ \t]+"(.*)"[ \t]*(?:#.*)?$/;

// Parses localisation text into [{ key, value, line }]. `\"` becomes a quote and the two characters `\n` become a
// newline, so yml() in lib/core.mjs writes the same bytes back.
export function parseLocText(text) {
  const out = [];
  const lines = String(text).replace(/^﻿/, '').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = ENTRY.exec(lines[i]);
    if (!m) continue;
    out.push({ key: m[1], value: m[3].replace(/\\"/g, '"').replace(/\\n/g, '\n'), line: i + 1 });
  }
  return out;
}

// The header language of a localisation text ("l_english"), or null.
export function headerOf(text) {
  const m = /^﻿?[ \t]*(l_[a-z_]+):/m.exec(String(text));
  return m ? m[1] : null;
}

export async function readLocFile(file) {
  return parseLocText(await readFile(file, 'utf8'));
}

// All localisation/<language>/ files of a game or mod directory as Map<fileName, entries[]>.
export async function readLocDir(dir) {
  const out = new Map();
  if (!existsSync(dir)) return out;
  for (const name of (await readdir(dir)).filter(n => n.endsWith('.yml')).sort()) out.set(name, await readLocFile(path.join(dir, name)));
  return out;
}

// ------------------------------------------------------------------------------------------------ structure
const VAR = /\$[^$\n]*\$/g;
const CALL = /\[[^\]\n]*\]/g;
const COLOUR = /§./g;
const ICON = /£([A-Za-z0-9_]+)(?:\|([0-9A-Za-z]+))?£?/g;
const TAG = /@[A-Z][A-Z0-9]{2}\b/g;

// The structure of a value that a replacement must keep: engine variables (with their formatters), scope calls,
// colour codes and icon codes. Order inside a kind does not matter; the lists are sorted.
export function signature(value) {
  const v = String(value);
  const vars = (v.match(VAR) ?? []).slice().sort();
  const calls = (v.replace(VAR, ' ').match(CALL) ?? []).slice().sort();
  const colours = (v.match(COLOUR) ?? []).slice().sort();
  const icons = [...v.matchAll(ICON)].map(m => m[1] + (m[2] ? `|${m[2]}` : '')).sort();
  const tags = (v.replace(VAR, ' ').match(TAG) ?? []).slice().sort();
  return { vars, calls, colours, icons, tags };
}

// The variables of a value in order of appearance (structure only: the frames fill them in as $v1, $v2).
export const orderedVarsOf = value => String(value).match(VAR) ?? [];

export const sigText = sig => JSON.stringify([sig.vars, sig.calls, sig.colours, sig.icons, sig.tags]);
export function sameSignature(a, b) { return sigText(typeof a === 'string' ? signature(a) : a) === sigText(typeof b === 'string' ? signature(b) : b); }

// A human-readable difference between two signatures (placeholders only; never any words of a value).
export function signatureDiff(want, got) {
  const out = [];
  for (const kind of ['vars', 'calls', 'colours', 'icons', 'tags']) {
    const w = [...want[kind]], g = [...got[kind]], miss = [], extra = [];
    for (const x of w) { const i = g.indexOf(x); if (i >= 0) g.splice(i, 1); else miss.push(x); }
    for (const x of g) extra.push(x);
    if (miss.length) out.push(`${kind} lost: ${miss.join(' ')}`);
    if (extra.length) out.push(`${kind} added: ${extra.join(' ')}`);
  }
  return out;
}

// The text a player reads: colour codes, icon codes, variables, calls and newlines removed (spec 05, section 8).
export function displayText(value) {
  return String(value).normalize('NFKC')
    .replace(VAR, ' ').replace(CALL, ' ').replace(COLOUR, '').replace(ICON, ' ').replace(TAG, ' ')
    .replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

// A value with no word in it (only variables, punctuation, icons): it has nothing to author.
export function isStructural(value) { return !/\p{L}/u.test(displayText(value)); }

// Expands `$KEY$` references that name a key of the table (never an engine variable with a formatter), up to depth.
export function expandNested(value, table, depth = 6, trail = []) {
  const v = String(value);
  if (depth <= 0) return v;
  return v.replace(/\$([A-Za-z0-9_.\-]+)\$/g, (whole, name) => {
    if (!table.has(name) || trail.includes(name)) return whole;
    return expandNested(table.get(name), table, depth - 1, [...trail, name]);
  });
}

// Windows-1252: characters outside ASCII that the game font can draw (the 0x80-0x9f block maps to these code points).
const CP1252_HIGH = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
export function isCp1252(ch) {
  const c = ch.codePointAt(0);
  if (c < 0x80) return true;
  if (c >= 0xa0 && c <= 0xff) return true;
  return CP1252_HIGH.includes(ch);
}
export function nonCp1252(value) { return [...String(value)].filter(ch => !isCp1252(ch) && ch !== '\n'); }

// Key classes (spec 05, section 1): an upper-case key is a label, anything else is an object id.
export const isLabelKey = key => /^[A-Z0-9_]+$/.test(key);
