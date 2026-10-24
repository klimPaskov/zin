// Debug and placeholder text rules (check X17 of the text scan). A line the player reads must never be a leftover of
// the build: a raw identifier, a TODO, a template slot, a name with a slash, a stub ellipsis, a doubled space.
// The rules are pure: they read one { key, value, file } entry at a time and know nothing about the staged tree, so
// the scan (checks/text_scan.mjs), the command line below and the tests (text_audit.test.mjs) share them.
//
//   import { debugTextFindings, DEBUG_RULES, visibleText } from './checks/text_debug_rules.mjs';
//   const findings = debugTextFindings(entries, { baseline });   // entries: [{ key, value, file }]
//   node tools/content/checks/text_debug_rules.mjs <dir|file.yml>...   // scans every *_l_english.yml below the paths
//
// Severity: 'error' fails the build; 'warning' is listed in the report. A finding whose rule and key appear in
// data/text/debug_baseline.json is a known leftover of another slice: it is reported as a warning, never hidden,
// and the audit (docs/design/text_audit.md) names its owner. The baseline may only shrink.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BASELINE_FILE = fileURLToPath(new URL('../data/text/debug_baseline.json', import.meta.url));

// What the player reads, with the engine's markup taken out: colour codes, $variables$, [scripted text], £icons and
// the \n escape. Every removed piece leaves a "~" so that two words never join and a variable next to a slash
// ("$A$/$B$") never looks like a name with a slash.
export function visibleText(value) {
  return String(value)
    .replace(/§[A-Za-z0-9!]/g, '')
    .replace(/\$[^$\s][^$]*\$/g, '~')
    .replace(/\[[^\]]*\]/g, '~')
    .replace(/£[A-Za-z0-9_|]+/g, '~')
    .replace(/\\n/g, '\n');
}

const words = s => (s.match(/[A-Za-zÀ-ɏ']+/g) ?? []);

// The placeholder words a finished line never holds. "debug" and "stub" are whole words, so "stubborn" passes.
const PLACEHOLDER = /\b(TODO|FIXME|TBD|TBA|WIP|XXX+|lorem|ipsum|placeholder|dummy|debug|stub|NOT USED|asdf+|qwerty)\b/i;
// A leftover field label: "Name of ...", "Description for ..." at the start of a value.
const FIELD_LABEL = /^\s*(Name|Desc|Description|Title|Text|Tooltip|Label|Header)\s+(of|for)\b|^\s*(Name|Description|Title|Tooltip)\s*[:=]/i;
const SNAKE = /\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/;
const UPPER_SNAKE = /\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b/;
const TEMPLATE = /\{[^{}]*\}|%[sd]\b|\bundefined\b|\bNaN\b|\[object |\bnull\b/;

// id, severity, test(entry, visible) -> detail text or null.
export const DEBUG_RULES = [
  { id: 'D1', name: 'placeholder word', severity: 'error',
    test: (e, v) => { const m = PLACEHOLDER.exec(v); return m ? `the placeholder word "${m[0]}"` : null; } },
  { id: 'D2', name: 'field label left in', severity: 'error',
    test: (e, v) => { const m = FIELD_LABEL.exec(v); return m ? `a field label "${m[0].trim()}" starts the text` : null; } },
  { id: 'D3', name: 'raw identifier', severity: 'error',
    test: (e, v) => { const m = SNAKE.exec(v) ?? UPPER_SNAKE.exec(v); return m ? `the identifier ${m[0]} is shown as text` : null; } },
  { id: 'D4', name: 'key echoed', severity: 'error',
    test: (e, v) => {
      // An exact echo ("zin_foo_bar" shown as "zin_foo_bar", or as "zin foo bar"); a display name that merely matches the
      // words of its key ("At War" for at_war) is a name, not an echo.
      const raw = String(e.value).trim().toLowerCase(), key = String(e.key).toLowerCase();
      if (raw && (raw === key || raw === key.replace(/_/g, ' ')) && /[_.]/.test(key)) return 'the text is the key itself';
      if (key.length >= 8 && /_/.test(key) && raw.includes(key)) return 'the text holds its own key';
      return null;
    } },
  { id: 'D5', name: 'slash or bar in text', severity: 'error',
    test: (e, v) => {
      if (/[A-Za-zÀ-ɏ')]\s?\/\s?[A-Za-zÀ-ɏ(]/.test(v)) return 'a slash joins two words';
      if (/\\(?!n)/.test(v)) return 'a backslash';
      if (/\|/.test(v)) return 'a vertical bar';
      return null;
    } },
  { id: 'D6', name: 'doubled space', severity: 'error',
    test: (e, v) => /[A-Za-z0-9.,;:!?'’)] {2,}[A-Za-z(]/.test(v) ? 'two spaces between words' : null },
  { id: 'D7', name: 'space before punctuation', severity: 'error',
    test: (e, v) => /[A-Za-z] [,;:](?=\s|$)/.test(v) ? 'a space before a comma, colon or semicolon' : null },
  { id: 'D8', name: 'stub ellipsis', severity: 'error',
    test: (e, v) => {
      const t = v.trim();
      if (/^[\s.…]+$/.test(t) && t) return 'the text is only dots';
      if (/(^|\s|,)(\.{3}|…)\s*$/.test(t) && t.length > 3) return 'the text trails off after a space or comma';
      if (/(\.{3}|…)\s*$/.test(t) && words(t).length <= 1) return 'a one-word text ends in an ellipsis';
      return null;
    } },
  { id: 'D9', name: 'empty or symbol-only value', severity: 'error',
    test: (e, v) => {
      const t = v.replace(/~/g, '').trim();
      if (String(e.value).trim() === '') return 'the text is empty';
      if (!/[A-Za-z0-9À-ɏ]/.test(t) && !/[~]/.test(v)) return 'the text holds no letters';
      return null;
    } },
  { id: 'D10', name: 'template slot or script value left in', severity: 'error',
    test: (e, v) => { const m = TEMPLATE.exec(v); return m ? `a template slot or script value "${m[0]}"` : null; } },
  { id: 'D11', name: 'state numbered as a name', severity: 'warning',
    test: (e, v) => /^[^~]*\bDistrict \d+$/.test(v.trim()) ? 'the name is a region and a state number' : null },
  { id: 'D12', name: 'repeated word', severity: 'warning',
    test: (e, v) => {
      const m = /\b([A-Za-z']{3,}) \1\b/i.exec(v);
      return m && !/^(had|that|very|so|bye|no|ha|ho)$/i.test(m[1]) ? `the word "${m[1]}" is repeated` : null;
    } },
];

// Two unrelated keys with the same long text look pasted. Keys that differ only in a country or region segment are the
// shared templates of the regional trees and pass: the stem is the last two words of the key, without numbers and the word spirit.
export const DUPLICATE_MIN = 60;
function stemOf(key) { return key.toLowerCase().replace(/^zin_/, '').split(/[_.]/).filter(t => t && !/^\d+$/.test(t) && t !== 'spirit').slice(-2).join('_'); }
export function duplicateFindings(entries) {
  const out = [], byText = new Map();
  for (const e of entries) {
    const v = visibleText(e.value).replace(/\s+/g, ' ').trim();
    if (v.length < DUPLICATE_MIN) continue;
    (byText.get(v) ?? byText.set(v, []).get(v)).push(e);
  }
  for (const group of byText.values()) {
    const stems = new Set(group.map(e => stemOf(e.key)));
    if (stems.size < 2) continue;
    const keys = group.map(e => e.key).sort((a, b) => a.localeCompare(b, 'en'));
    const first = group.find(e => e.key === keys[0]);
    out.push({ rule: 'D13', name: 'same text under unrelated keys', severity: 'warning', key: first.key, file: first.file, detail: `${group.length} keys share one text (${keys.slice(0, 3).join(', ')}${keys.length > 3 ? ', ...' : ''})` });
  }
  return out;
}

export function loadBaseline(file = BASELINE_FILE) {
  if (!existsSync(file)) return new Set();
  const data = JSON.parse(readFileSync(file, 'utf8'));
  return new Set((data.entries ?? []).map(x => `${x.rule}|${x.key}`));
}

const clip = s => { const t = String(s).replace(/\n/g, ' '); return t.length > 70 ? `${t.slice(0, 67)}...` : t; };

// entries: [{ key, value, file }]. options.baseline: Set of "rule|key" (default: the baseline file), options.rules: subset.
export function debugTextFindings(entries, options = {}) {
  const baseline = options.baseline ?? loadBaseline();
  const rules = options.rules ?? DEBUG_RULES;
  const out = [];
  for (const e of entries) {
    const v = visibleText(e.value);
    for (const r of rules) {
      const detail = r.test(e, v);
      if (!detail) continue;
      const known = baseline.has(`${r.id}|${e.key}`);
      out.push({ rule: r.id, name: r.name, severity: known ? 'warning' : r.severity, baseline: known || undefined, key: e.key, file: e.file, detail: `${detail}: ${clip(e.value)}` });
    }
  }
  if (!options.rules) for (const f of duplicateFindings(entries)) out.push(f);
  return out.sort((a, b) => a.rule.localeCompare(b.rule, 'en', { numeric: true }) || a.file.localeCompare(b.file, 'en') || a.key.localeCompare(b.key, 'en'));
}

// ---------------------------------------------------------------------------------------------- command line
async function walk(p, out = []) {
  const st = await import('node:fs/promises').then(m => m.stat(p));
  if (st.isDirectory()) for (const n of (await readdir(p)).sort()) await walk(path.join(p, n), out);
  else if (/_l_english\.yml$/.test(p)) out.push(p);
  return out;
}
export function parseEntries(text, file) {
  const out = [];
  text.replace(/^﻿/, '').split(/\r?\n/).forEach(line => {
    const m = /^\s*([^\s:#]+):\d*\s+"(.*)"\s*(#.*)?$/.exec(line);
    if (m) out.push({ key: m[1], value: m[2].replace(/\\"/g, '"'), file });
  });
  return out;
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const paths = process.argv.slice(2).filter(a => !a.startsWith('--'));
  if (!paths.length) { console.error('usage: node text_debug_rules.mjs <dir|file>... [--json]'); process.exit(2); }
  const entries = [];
  for (const p of paths) for (const f of await walk(path.resolve(p))) entries.push(...parseEntries(await readFile(f, 'utf8'), path.relative(path.resolve(p), f).split(path.sep).join('/') || path.basename(f)));
  const findings = debugTextFindings(entries);
  if (process.argv.includes('--json')) console.log(JSON.stringify(findings, null, 1));
  else {
    for (const f of findings) console.log(`${f.severity.padEnd(7)} ${f.rule} ${f.file} ${f.key}: ${f.detail}${f.baseline ? ' (baseline)' : ''}`);
    const errs = findings.filter(f => f.severity === 'error').length;
    console.error(`${entries.length} lines, ${errs} errors, ${findings.length - errs} warnings`);
  }
  process.exit(findings.some(f => f.severity === 'error') ? 1 : 0);
}
