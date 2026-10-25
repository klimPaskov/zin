// Character portraits (docs/plans/zin-art/portraits_handoff.md). Three families of sprites:
//   1. the legacy generic portraits of the people (two of each sex, `GFX_zin_portrait_<people>_<male|female>_<n>`), kept for the
//      portrait database of every realm (portraits/zin_portraits.txt) and for the characters that no pool covers yet;
//   2. the culture pools of the roster (data/world/portrait_pools.json): one pool per culture, people and sex, `GFX_zin_portrait_
//      <people>_<culture>_<sex>_<n>` (or `_<people>_<sex>_<n>` for a portrait reused from the first tranche), never mixing cultures;
//   3. the named portraits of six figures (`GFX_zin_portrait_<id>`), which no other character shares.
// Every portrait is sliced from an accepted sheet under art/source/ (modules/art.mjs), converted here (lib/raster.mjs dds()) and
// staged as gfx/leaders/zin/. The assignment below is deterministic: named figures first, then each pool's characters in roster order,
// each taking the least used member that no other character of the same realm already holds (never twice in one country).
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dds } from '../lib/raster.mjs';
import { ZIN } from '../lib/paths.mjs';
import { PEOPLES } from './peoples.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const PORTRAIT_POOLS_FILE = path.join(here, '../data/world/portrait_pools.json');
// The largest number of characters one portrait may serve (05_asset_manifest.md, generic pools; the asset check enforces the cap per pool).
export const SERVE_CAP = 5;

export const VARIANTS = 2;
export function spriteName(people, female, n) { return `GFX_zin_portrait_${people}_${female ? 'female' : 'male'}_${n}`; }

export const loadPortraitPools = (file = PORTRAIT_POOLS_FILE) => JSON.parse(readFileSync(file, 'utf8'));

// Every pool portrait and named portrait the table names: sprite -> { file, source, cell, id? }. A pool member's source is a sheet
// (cell = its reading-order index); a named portrait's source is a single image (cell = null).
export function tablePortraits(plan) {
  const out = new Map();
  for (const n of plan.named) out.set(n.sprite, { file: n.file, source: n.source, cell: null, named: n.id });
  for (const e of plan.emblems ?? []) out.set(e.sprite, { file: e.file, source: e.source, cell: null, emblem: e.id });
  for (const p of plan.pools) for (const m of p.members) {
    if (out.has(m.sprite)) throw new Error(`portrait_pools.json: ${m.sprite} is named twice`);
    out.set(m.sprite, { file: m.file, source: m.source, cell: m.cell, pool: p.key });
  }
  return out;
}

// The sprite each character wears, by character id: named portraits, then the pools. A character of a pool that has no free member
// in its realm is an error (the builder check repeats this with the staged courts).
export function assignPortraits(plan) {
  const out = new Map();
  for (const n of plan.named) out.set(n.id, n.sprite);
  for (const e of plan.emblems ?? []) for (const id of e.characters) out.set(id, e.sprite);
  for (const p of plan.pools) {
    const load = new Map(p.members.map(m => [m.sprite, 0])), held = new Map();
    for (const c of p.characters) {
      const taken = held.get(c.tag) ?? held.set(c.tag, new Set()).get(c.tag);
      const free = p.members.filter(m => !taken.has(m.sprite)).sort((a, b) => load.get(a.sprite) - load.get(b.sprite) || a.n - b.n);
      if (!free.length) throw new Error(`Portrait pool ${p.key} has no free portrait for ${c.id} in realm ${c.tag} (size ${p.size}).`);
      const pick = free[0].sprite;
      out.set(c.id, pick); load.set(pick, load.get(pick) + 1); taken.add(pick);
    }
  }
  return out;
}

// The builder check of the portrait plan, on the characters as staged: `served` lists { id, tag, sprite } for every staged character.
// A pool portrait serves at most ceil(C / P) + 1 of the pool's characters and never more than SERVE_CAP; a named portrait serves one
// character; no two characters of one realm share a sprite. Returns the problems (an empty list is a pass).
export function portraitProblems(plan, served) {
  const problems = [], tables = tablePortraits(plan);
  const pool = new Map(plan.pools.map(p => [p.key, p]));
  const mine = served.filter(s => tables.has(s.sprite));
  const perSprite = new Map(), perPool = new Map(), perRealm = new Map();
  for (const s of mine) {
    perSprite.set(s.sprite, (perSprite.get(s.sprite) ?? 0) + 1);
    const key = tables.get(s.sprite).pool;
    if (key) perPool.set(key, (perPool.get(key) ?? 0) + 1);
    const realm = perRealm.get(s.tag) ?? perRealm.set(s.tag, new Map()).get(s.tag);
    if (tables.get(s.sprite).emblem) continue;
    if (realm.has(s.sprite)) problems.push(`${s.id} and ${realm.get(s.sprite)} of realm ${s.tag} share the portrait ${s.sprite}`);
    else realm.set(s.sprite, s.id);
  }
  for (const [sprite, uses] of perSprite) {
    const t = tables.get(sprite);
    if (t.emblem) continue;
    if (t.named) { if (uses > 1) problems.push(`named portrait ${sprite} serves ${uses} characters`); continue; }
    const p = pool.get(t.pool), allowance = Math.min(SERVE_CAP, Math.ceil((perPool.get(t.pool) ?? 0) / p.size) + 1);
    if (uses > allowance) problems.push(`portrait ${sprite} serves ${uses} characters; the pool ${t.pool} (${p.size} portraits, ${perPool.get(t.pool)} characters) allows ${allowance}`);
  }
  return problems;
}

export function buildPortraits(staged, countries, assignment, art) {
  const sprites = [];
  for (const people of Object.keys(PEOPLES)) for (const female of [false, true]) for (let n = 1; n <= VARIANTS; n++) {
    const file = `gfx/leaders/zin/${people}_${female ? 'female' : 'male'}_${n}.dds`, picture = art.portraits.get(`${people}_${female ? 'female' : 'male'}_${n}`);
    if (!picture) throw new Error(`Missing generated portrait ${people} ${female ? 'female' : 'male'} ${n}`);
    staged.add(file, dds(picture));
    sprites.push(`\tspriteType = {\n\t\tname = "${spriteName(people, female, n)}"\n\t\ttexturefile = "${file}"\n\t}`);
  }
  // The culture pools and the named portraits: one DDS per table portrait, sliced by modules/art.mjs (art.portraits, keyed by sprite).
  // Each one also gets its provenance line (art/source/portraits_manifest.json): the source picture, its crop and the shipped bytes.
  const manifest = [];
  for (const [sprite, t] of tablePortraits(loadPortraitPools())) {
    const picture = art.portraits.get(sprite);
    if (!picture) throw new Error(`Missing sliced portrait ${sprite} (${t.source})`);
    const bytes = dds(picture);
    staged.add(t.file, bytes);
    sprites.push(`\tspriteType = {\n\t\tname = "${sprite}"\n\t\ttexturefile = "${t.file}"\n\t}`);
    const sha = (buf) => createHash('sha256').update(buf).digest('hex');
    const cell = t.cell === null ? null : t.cell;
    manifest.push({ out: t.file, source: t.source, sourceSha256: sha(readFileSync(path.join(ZIN, t.source))), ...(cell === null ? {} : { cell }), ops: [cell === null ? 'cover 156x210' : `cell ${cell} cover 156x210`, 'dds'], sha256: sha(bytes) });
  }
  staged.add('art/source/portraits_manifest.json', Buffer.from(JSON.stringify({ generator: 'tools/content/modules/portraits.mjs', files: manifest.sort((a, b) => a.out.localeCompare(b.out, 'en')) }, null, 1) + '\n'));
  staged.text('interface/zin_portraits.gfx', `spriteTypes = {\n${sprites.join('\n')}\n}\n`);
  const list = (people, female) => Array.from({ length: VARIANTS }, (_, i) => `"${spriteName(people, female, i + 1)}"`).join(' ');
  // Role blocks for army, navy, operative and scientist; political (civilian) portraits are the block's own
  // male/female lists, as in the game's portrait database (a `political` key is rejected).
  const roles = people => ['army', 'navy', 'operative', 'scientist'].map(role => `\t${role} = {\n\t\tmale = { ${list(people, false)} }\n\t\tfemale = { ${list(people, true)} }\n\t}`).concat(`\tmale = { ${list(people, false)} }\n\tfemale = { ${list(people, true)} }`).join('\n');
  const tagBlocks = countries.map(c => `${c.tag} = {\n${roles(assignment.get(c.tag))}\n}`);
  const continents = ['world_continent_1', 'world_continent_2', 'world_continent_3'].map(n => `continent = {\n\tname = ${n}\n${roles('men')}\n}`);
  staged.text('portraits/zin_portraits.txt', `# Generated by the ZIN content builder: portraits by people (image-generated art).\n${continents.join('\n')}\n${tagBlocks.join('\n')}\n`);
}
