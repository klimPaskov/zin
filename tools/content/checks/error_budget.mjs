// Error budget checks C6 and C7 (docs/specs/00_foundation/06_vanilla_removal_and_zero_errors.md, sections 4 and 6).
//   node tools/content/checks/error_budget.mjs <error.log> [text.log] [stage]
// C6 classifies every error.log line with the baseline_errors.json patterns and fails above the stage budget, on a
// category the stage does not allow, or (from stage 3 on) on any line outside the allowlist. C7 fails when text.log
// lists a duplicate localisation key outside a declared localisation/replace file of that stage.
// The Linux acceptance run supplies the logs (hoi4.error_log reads the same files); this script never runs the game.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadJson } from './vanilla_refs.mjs';

const PREFIX = /^\[[^\]]*\]\[[^\]]*\]\[[^\]]*\]: ?/;
export const messageOf = line => line.replace(PREFIX, '');

export function classify(text, baseline, allowlist = { entries: [] }) {
  const cats = baseline.categories.map(c => ({ ...c, re: new RegExp(c.pattern) }));
  const allow = allowlist.entries.map(e => ({ ...e, re: new RegExp(e.pattern) }));
  const counts = Object.fromEntries(cats.map(c => [c.id, 0])), unclassified = [], allowed = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const msg = messageOf(line);
    if (allow.some(a => a.re.test(msg))) { allowed.push(line); continue; }
    const c = cats.find(x => x.re.test(msg));
    if (c) counts[c.id]++; else unclassified.push(line);
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) + unclassified.length;
  return { total, counts, unclassified, allowed };
}

export function checkBudget(result, baseline, stage) {
  const budget = [...baseline.budget].filter(b => b.stage <= stage).sort((a, b) => b.stage - a.stage)[0];
  const problems = [];
  if (result.total > budget.max) problems.push(`${result.total} lines, budget ${budget.max} after stage ${budget.stage}`);
  for (const [id, n] of Object.entries(result.counts)) {
    if (!n) continue;
    if (!budget.allowed.includes(id)) problems.push(`${n} lines of ${id}, not allowed after stage ${budget.stage}`);
    if (budget.limits?.[id] !== undefined && n > budget.limits[id]) problems.push(`${n} lines of ${id}, limit ${budget.limits[id]}`);
  }
  if (result.unclassified.length) problems.push(`${result.unclassified.length} lines in no baseline category (new category), first: ${result.unclassified[0]}`);
  return problems;
}

// C7. replaceFiles: localisation/replace files the stage declares (their keys may collide on purpose).
export function checkTextLog(text, replaceFiles = []) {
  const dupes = new Map();
  for (const m of text.matchAll(/Duplicate localization found, key: ([^,]+), file: ([^,]+),/g)) (dupes.get(m[1]) ?? dupes.set(m[1], new Set()).get(m[1])).add(m[2].trim());
  const problems = [];
  for (const [key, files] of dupes) if (![...files].some(f => replaceFiles.includes(f))) problems.push(`duplicate key ${key} in ${[...files].join(', ')}`);
  return problems;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [errorLog, textLog, stageArg] = process.argv.slice(2);
  if (!errorLog) { console.error('usage: error_budget.mjs <error.log> [text.log] [stage]'); process.exit(64); }
  const baseline = await loadJson('baseline_errors.json'), allowlist = await loadJson('error_allowlist.json'), disp = await loadJson('dispositions.json');
  const stage = stageArg === undefined ? disp.currentStage : Number(stageArg);
  const result = classify(await readFile(errorLog, 'utf8'), baseline, allowlist);
  const problems = checkBudget(result, baseline, stage);
  if (textLog) problems.push(...checkTextLog(await readFile(textLog, 'utf8'), ['localisation/replace/zin_ideologies_l_english.yml', 'localisation/replace/world_l_english.yml']));
  console.log(JSON.stringify({ stage, total: result.total, counts: result.counts, unclassified: result.unclassified.slice(0, 20), problems }, null, 1));
  process.exit(problems.length ? 1 : 0);
}
