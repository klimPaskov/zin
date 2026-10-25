// Applies the declared portrait operations (data/world/portrait_reassign.json) to the base pool table
// (data/world/portrait_pools.base.json) and writes data/world/portrait_pools.json. Deterministic: rerunning it on the
// same inputs writes the same table. Operations:
//   move   { from, source, cell, to }      a sheet cell leaves one culture pool for another of the same culture and people
//   remove { pool, source, cell }          a sheet cell leaves its pool (the cell shows the wrong person, or the pool is replaced)
//   add    { pool, source, cell, origin }  a sheet cell joins a pool as a new portrait
//   remap  { source, to }                  every member read from a sheet is read from the regenerated sheet `to` (same cells)
//   crop   { id, crop }                    a named portrait is cut from the declared box { x0, y0, x1, y1, fit } (fit: cover or contain)
// A moved or added portrait takes the next free number of its pool (GFX_zin_portrait_<people>_<culture>_<sex>_<n>).
// The result must pass the same rules the builder checks (modules/portraits.mjs): never twice in one realm and at most
// min(SERVE_CAP, ceil(C / P) + 1) characters per portrait. The script fails otherwise.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assignPortraits, SERVE_CAP } from '../modules/portraits.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, '../data/world');
const base = JSON.parse(readFileSync(path.join(DATA, 'portrait_pools.base.json'), 'utf8'));
const ops = JSON.parse(readFileSync(path.join(DATA, 'portrait_reassign.json'), 'utf8'));
const plan = structuredClone(base);
const pools = new Map(plan.pools.map(p => [p.key, p]));
const pool = key => { const p = pools.get(key); if (!p) throw new Error(`no pool ${key}`); return p; };
const take = (p, source, cell) => {
  const i = p.members.findIndex(m => m.source === source && m.cell === cell);
  if (i < 0) throw new Error(`${p.key} has no member ${source} cell ${cell}`);
  return p.members.splice(i, 1)[0];
};
const nextN = p => Math.max(0, ...p.members.map(m => m.n)) + 1;
const name = (p, n) => ({ sprite: `GFX_zin_portrait_${p.people}_${p.culture}_${p.sex}_${n}`, file: `gfx/leaders/zin/pools/${p.people}_${p.culture}_${p.sex}_${n}.dds` });
const place = (p, member, origin) => {
  const n = nextN(p), { sprite, file } = name(p, n);
  p.members.push({ n, sprite, file, source: member.source, cell: member.cell, origin });
};

for (const op of ops) {
  if (op.op === 'move') { const m = take(pool(op.from), op.source, op.cell); place(pool(op.to), m, m.origin ?? 'moved'); }
  else if (op.op === 'remove') take(pool(op.pool), op.source, op.cell);
  else if (op.op === 'add') place(pool(op.pool), { source: op.source, cell: op.cell }, op.origin);
  else if (op.op === 'crop') {
    const n = plan.named.find(x => x.id === op.id); if (!n) throw new Error(`no named portrait ${op.id}`);
    n.crop = op.crop;
  } else if (op.op === 'remap') {
    for (const p of plan.pools) for (const m of p.members) if (m.source === op.source) m.source = op.to;
  } else throw new Error(`unknown op ${op.op}`);
}

// Recount and check every pool.
const problems = [];
for (const p of plan.pools) {
  p.size = p.members.length;
  const seen = new Set(p.members.map(m => m.sprite));
  if (seen.size !== p.members.length) problems.push(`${p.key}: duplicate sprite`);
  let assign = null;
  try { assign = assignPortraits({ ...plan, pools: [p] }); } catch (e) { problems.push(`${p.key}: ${e.message.slice(0, 140)}`); continue; }
  const uses = new Map(); for (const c of p.characters) uses.set(assign.get(c.id), (uses.get(assign.get(c.id)) ?? 0) + 1);
  const allowance = Math.min(SERVE_CAP, Math.ceil(p.characters.length / p.size) + 1);
  const worst = Math.max(0, ...uses.values());
  if (worst > allowance) problems.push(`${p.key}: a portrait serves ${worst}, allowance ${allowance}`);
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
writeFileSync(path.join(DATA, 'portrait_pools.json'), JSON.stringify(plan, null, 1) + '\n');
console.log(`portrait_pools.json written: ${ops.length} operations, ${plan.pools.length} pools, ${plan.pools.reduce((n, p) => n + p.members.length, 0)} members`);
