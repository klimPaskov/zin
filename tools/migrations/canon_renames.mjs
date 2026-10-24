// Canonical renames decided by the owner after the Erdae and Aoaz exchange (docs/specs/INTEGRATION_DECISIONS.md K29, K31;
// traceability: docs/lore/names_traceability.md). Table-driven so later renames reuse it.
//
//   node tools/migrations/canon_renames.mjs [--apply] [--scope docs|content|all]
//
// docs     the living documents (docs/lore, docs/specs, docs/design) and the README
// content  the builder's sources and data (tools/content), run once integration has merged
// Records keep their wording: the handoff package, transcriptions and source snapshots, the vault's retcon register, change
// log and open questions, the decisions file, the traceability table and the proposal that chose the name. A line that
// mentions a former label, placeholder or superseded name is left as it is, because it records the old name on purpose.
// Without --apply it is a dry run. Applying twice changes nothing (no rename's output contains its own input).

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

export const RENAMES = [
  // K29: Edvoid is Kusven; the sea north of Zol's Mistake is Kusmeel.
  { from: /Ocean of Edvoid|Ocean of Zol/g, to: 'Kusmeel' },
  { from: /Edvoid(?:'s)? \(name to be replaced[^)]*\)/g, to: m => (m.startsWith("Edvoid's") ? "Kusven's" : 'Kusven') },
  { from: /\bEdvoid\b/g, to: 'Kusven' },
  { from: /\bedvoid\b/g, to: 'kusven' },
  // K31: the Dead Lands are the Ember Lands.
  { from: /\bDead Lands\b/g, to: 'Ember Lands' },
  { from: /\bdead lands\b/g, to: 'ember lands' },
  // Identifiers carry the region inside longer names (zin_is_region_dead_lands, shared_dead_lands), so no word boundary.
  { from: /dead_lands/g, to: 'ember_lands' },
  { from: /DEAD_LANDS/g, to: 'EMBER_LANDS' },
  // K48: map names after the import conversion, in text only: the geography model's feature ids (range_isengar_mountains,
  // range_hellfire, volcano_argon) are stable keys and keep their spelling. Isengard, the former realm label, stays a record.
  { from: /Isengar(?!d)/g, to: 'Ormolak' },
  { from: /\b([Tt])he Hellfire Range\b/g, to: (m, t) => `${t}he Smoking Teeth` },
  { from: /\bHellfire Range\b/g, to: 'Smoking Teeth' },
  { from: /\b([Tt])he Hellfire Gulf\b/g, to: (m, t) => `${t}he Gulf of the Teeth` },
  { from: /\bHellfire Gulf\b/g, to: 'Gulf of the Teeth' },
  { from: /\bthe Hellfire\b/g, to: 'the Smoking Teeth' },
  { from: /Woqood Alps/g, to: 'Woqood Spires' },
  { from: /\bArgon\b/g, to: 'Argul' },
];

export const PATH_RENAMES = [
  [/Edvoid/g, 'Kusven'],
  [/Dead Lands/g, 'Ember Lands'],
  [/dead_lands/g, 'ember_lands'],
];

const RECORDS = [
  'docs/zin-handoff/', 'docs/lore/sources/', 'docs/lore/vault/Sources/', 'docs/generation/',
  'docs/lore/vault/09 - Development/Names and Retcons.md', 'docs/lore/vault/09 - Development/Change Log.md',
  'docs/lore/vault/09 - Development/Open Questions.md', 'docs/specs/INTEGRATION_DECISIONS.md',
  'docs/lore/names_traceability.md', 'docs/lore/references/edvoid_name.md', 'tools/migrations/',
  // Transcriptions of the labels written on the owner's drawing, and the lead's own working notes.
  'docs/name_table.csv', 'docs/name_table.md', 'docs/name_alignment.json', 'docs/plans/zin-lead/',
];
// The focus tree designs are builder input, so they belong to the content scope.
// The geography model is renamed by its own rename table (tools/content/geography/name_table.mjs, applied by
// repair_model.mjs), and its code names the drawn labels on purpose, so neither is edited here.
const GEOGRAPHY = ['tools/content/geography/', 'tools/content/data/geography/'];
const SCOPES = { docs: ['docs/', 'README.md'], content: ['tools/content/', 'docs/design/focus/'], all: ['docs/', 'README.md', 'tools/content/'] };
const EXCLUDE = { docs: ['docs/design/focus/'], content: GEOGRAPHY, all: GEOGRAPHY };
const KEEP_LINE = /\bdrawn\b|\bformer\b|\bformerly\b|placeholder|superseded|\bold name\b|\bold label\b/i;

export function renameText(text) {
  let count = 0;
  const out = text.split('\n').map(line => {
    if (KEEP_LINE.test(line)) return line;
    let l = line;
    for (const r of RENAMES) l = l.replace(r.from, (...m) => { count++; return typeof r.to === 'function' ? r.to(...m) : r.to; });
    return l;
  }).join('\n');
  return { text: out, count };
}

export const renamePath = p => PATH_RENAMES.reduce((s, [a, b]) => s.replace(a, b), p);

function main() {
  const apply = process.argv.includes('--apply');
  const scope = process.argv[process.argv.indexOf('--scope') + 1] ?? 'docs';
  const roots = SCOPES[scope];
  if (!roots) throw new Error(`Unknown scope ${scope}`);
  const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\0').filter(Boolean)
    .filter(f => roots.some(r => f === r || f.startsWith(r)) && ![...RECORDS, ...EXCLUDE[scope]].some(r => f === r || f.startsWith(r)));
  let total = 0, edited = 0, kept = 0;
  const renames = [];
  for (const f of files) {
    if (/\.(png|jpe?g|dds|tga|webp|gif|bmp)$/i.test(f)) continue;
    const before = readFileSync(f, 'utf8');
    kept += before.split('\n').filter(l => KEEP_LINE.test(l) && RENAMES.some(r => new RegExp(r.from.source).test(l))).length;
    const { text, count } = renameText(before);
    if (count) { total += count; edited++; if (apply) writeFileSync(f, text); }
    const to = renamePath(f);
    if (to !== f) { renames.push([f, to]); if (apply) execFileSync('git', ['mv', f, to]); }
  }
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', scope, filesEdited: edited, occurrences: total, linesKeptAsRecords: kept, renames }, null, 1));
}

if (process.argv[1]?.endsWith('canon_renames.mjs')) main();
