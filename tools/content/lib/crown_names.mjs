// The shared-name register as data: every zin_ name that the contract (docs/specs/04_mechanics/00_shared_contract.md) and the
// register (00_contract_additions.md) list, with the register's patterns. The crown events use it to prove that each zin_ name
// they write resolves: it is defined by the crown module itself, listed in the register, or matched by a pattern.
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { ZIN } from './paths.mjs';

const SPEC = `${ZIN}/docs/specs/04_mechanics`;

function rows(md, heading) {
  const start = md.indexOf(`\n## ${heading}`);
  if (start < 0) return [];
  const rest = md.slice(start + 1), end = rest.indexOf('\n## ', 3);
  return (end < 0 ? rest : rest.slice(0, end)).split('\n').filter(l => l.startsWith('|')).map(l => l.split('|').slice(1, -1).map(c => c.trim()));
}
const ticks = cell => [...cell.matchAll(/`([^`]+)`/g)].map(m => m[1]);

// Returns { names: Map name -> { kind, owner }, patterns: [{ re, text }], retired: Set }.
export async function loadRegister() {
  const names = new Map(), patterns = [], retired = new Set();
  const register = `${SPEC}/00_contract_additions.md`, contract = `${SPEC}/00_shared_contract.md`;
  if (existsSync(contract)) {
    const md = await readFile(contract, 'utf8');
    for (const heading of ['Story state (global flags)', 'Shared variables', 'Characters']) for (const r of rows(md, heading)) for (const n of ticks(r[0])) if (/^zin_|<Aenor/.test(n)) names.set(n, { kind: heading, owner: 'contract' });
  }
  if (existsSync(register)) {
    const md = await readFile(register, 'utf8');
    for (const r of rows(md, 'Names')) for (const n of ticks(r[0])) names.set(n.replace(/\s*\(.*$/, ''), { kind: r[1] ?? '', owner: r[4] ?? '' });
    for (const r of rows(md, 'Patterns')) for (const t of ticks(r[0])) if (!/^zin_<|^GFX_|^category_|^RULE/.test(t)) patterns.push({ text: t, re: new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/<[A-Za-z0-9_]+>/g, '[a-z0-9_]+')}$`) });
    for (const r of rows(md, 'Retired names')) for (const n of ticks(r[0])) retired.add(n);
  }
  return { names, patterns, retired };
}

export function isKnownName(register, name, own = new Set()) {
  return own.has(name) || register.names.has(name) || register.patterns.some(p => p.re.test(name));
}

// Every backticked zin_ identifier the mechanic, gameplay, foundation and lore specs write. A name the register forgot (for
// example zin_world_add_gathering_dark, which the world spec defines) still counts as spec vocabulary; a typo does not.
export async function loadSpecNames() {
  const { readdir } = await import('node:fs/promises');
  const out = new Set();
  for (const dir of ['04_mechanics', '03_gameplay', '00_foundation', '02_lore', '06_events', '07_interface', '05_focus_trees']) {
    const full = `${ZIN}/docs/specs/${dir}`;
    if (!existsSync(full)) continue;
    for (const f of (await readdir(full, { withFileTypes: true })).filter(e => e.isFile() && e.name.endsWith('.md'))) {
      const md = await readFile(`${full}/${f.name}`, 'utf8');
      for (const m of md.matchAll(/`([^`\n]+)`/g)) for (const t of m[1].matchAll(/(?<![A-Za-z0-9_.:])(zin_[a-z0-9_]+)/g)) out.add(t[1]);
    }
  }
  return out;
}
