// Name exchange of 24 October 2026 (owner decision; docs/zin-handoff/01-CONTEXT-AND-CANON.md section 2.1, requirement R-01).
//
// The main setting, formerly Erdae, is named Aoaz; the small neighbouring continent, formerly Aoaz, is named Erdae. Only names
// change: no land, people or history moves. The exchange runs in three phases so no name is renamed twice:
//   1. every main-setting Erdae (in any case form) becomes a unique temporary token;
//   2. every neighbour Aoaz becomes Erdae;
//   3. the token becomes Aoaz.
// Tracked source files under docs/, tools/, the instruction files and the README are rewritten; tracked paths that carry the
// name are renamed with git mv. Game files (common/, localisation/, gfx/ ...) are build output: the next build and apply
// regenerate them from the migrated sources, so this script leaves them alone. Records of what was said or generated keep
// their wording: the handoff package, the vault's source snapshots and the art provenance log. Paths of the owner's private
// files keep their names (the originals are never renamed).
//
// Usage (from the repository root): node tools/migrations/aoaz_name_exchange.mjs [--apply]
// Without --apply it is a dry run that prints the report. The script is idempotent: a second run finds nothing to change.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');
const TOKEN = '\u0001ZINSETTING\u0001';

// Files and folders the exchange never edits, each with its reason (also written to the traceability table).
export const EXCLUDED = [
  ['docs/zin-handoff/', 'the handoff package records the exchange itself and uses both names on purpose'],
  ['docs/lore/vault/Sources/', 'source snapshots keep the wording they were taken with'],
  ['docs/lore/sources/', 'transcriptions keep the source wording, with notes'],
  ['art/source/provenance.jsonl', 'the provenance log records the exact prompts that were sent'],
  ['hoi4_wiki/', 'the offline game wiki is not ZIN text'],
  ['tools/migrations/', 'the migration scripts name both forms on purpose'],
  ['docs/generation/', 'records of the 11 to 18 October map generation (requests, request keys, handoffs) keep their wording'],
];
const SOURCE_ROOTS = ['docs/', 'tools/', 'AGENTS.md', 'CLAUDE.md', 'README.md', '.agents/', '.codex/', '.claude/'];

// Substrings that name the owner's private files, which keep their names. They are protected before phase 1.
export const PROTECTED = [
  'World/Erdae', 'World\\Erdae', 'World\\\\Erdae', 'Erdae Full Colored Map', 'originals/Erdae', 'originals\\Erdae',
  'Erdae-working', 'Fourth Age - Erdae (reference)',
];

// Phase 2: the neighbour's former name, wherever it stands for the neighbour (all known occurrences are drawing labels).
export const NEIGHBOUR = [['The Path to Aoaz', 'The Path to Erdae'], ['Path to Aoaz', 'Path to Erdae']];

const MAIN = /(?<![A-Za-z])(Erdae|erdae|ERDAE)/g;
const CASE = { Erdae: 'Aoaz', erdae: 'aoaz', ERDAE: 'AOAZ' };

export function exchange(text) {
  const shields = [];
  let t = text;
  // The neighbour's new name in its migrated phrases is shielded too, so migrated text passes through unchanged.
  [...PROTECTED, ...NEIGHBOUR.map(([, to]) => to)].forEach((p, i) => { t = t.split(p).join(`\u0002${i}\u0002`); shields.push(p); });
  const found = [];
  t = t.replace(MAIN, m => { found.push(m); return TOKEN + m; });
  for (const [from, to] of NEIGHBOUR) t = t.split(from).join(to);
  t = t.replace(new RegExp(`${TOKEN}(Erdae|erdae|ERDAE)`, 'g'), (_, m) => CASE[m]);
  shields.forEach((p, i) => { t = t.split(`\u0002${i}\u0002`).join(p); });
  return { text: t, count: found.length };
}

export function renamePath(path) {
  return path.split('/').map(part => part.replace(MAIN, m => CASE[m])).join('/');
}

const isExcluded = p => EXCLUDED.some(([e]) => p === e || p.startsWith(e));
const isSource = p => SOURCE_ROOTS.some(r => p === r || p.startsWith(r));

// Written by --apply. A later run reports "already applied" and changes nothing: after the exchange, new text may name the
// neighbour Erdae in ways no phrase list can recognise, and the build check (text scan) guards the main setting from then on.
const MARKER = 'tools/migrations/aoaz_name_exchange.applied.json';

function main() {
  if (existsSync(MARKER)) { console.log(JSON.stringify({ mode: 'already applied', marker: JSON.parse(readFileSync(MARKER, 'utf8')) }, null, 1)); return; }
  const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\0').filter(Boolean);
  const edits = [];
  const renames = [];
  const identifiers = new Map();
  let neighbour = 0;
  for (const f of files) {
    if (isExcluded(f) || !isSource(f)) continue;
    const to = renamePath(f);
    if (to !== f) renames.push([f, to]);
    const buf = readFileSync(f);
    if (buf.includes(0) || /\.(png|jpe?g|dds|tga|webp|gif)$/i.test(f)) continue; // binary
    const before = buf.toString('utf8');
    const { text, count } = exchange(before);
    for (const m of before.matchAll(/[A-Za-z0-9_.-]*(?<![A-Za-z])(?:erdae|Erdae|ERDAE)[A-Za-z0-9_.-]*/g)) {
      const word = m[0];
      if (/[_.]/.test(word) || /^[a-z]/.test(word)) identifiers.set(word, (identifiers.get(word) ?? 0) + 1);
    }
    for (const [from] of NEIGHBOUR) neighbour += before.split(from).length - 1;
    if (text !== before) edits.push({ f, count, text });
  }
  const report = {
    mode: APPLY ? 'apply' : 'dry-run',
    filesEdited: edits.length,
    occurrences: edits.reduce((s, e) => s + e.count, 0),
    neighbourOccurrences: neighbour,
    renames,
    identifiers: Object.fromEntries([...identifiers].sort()),
  };
  if (APPLY) {
    for (const e of edits) writeFileSync(e.f, e.text);
    for (const [from, to] of renames) execFileSync('git', ['mv', from, to]);
    writeFileSync(MARKER, JSON.stringify({ applied: '2026-10-24', filesEdited: report.filesEdited, occurrences: report.occurrences, neighbourOccurrences: neighbour, renames }, null, 1) + '\n');
  }
  console.log(JSON.stringify(report, null, 1));
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('aoaz_name_exchange.mjs')) main();
