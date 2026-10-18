// Tests for the ZIN content builder: run after `node tools/content/build.mjs [stagedDir]`, with ZIN_STAGED set to the
// same directory when it is not the default (<OS temp>/zin-content-staged).
//   node --test tools/content/build.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PEOPLES } from './modules/peoples.mjs';
import { stanceIdeology, IDEOLOGIES } from './modules/ideologies.mjs';
import { flagKey } from './art/slice-flags.mjs';
import { flagsDir, FLAG_CELLS } from './modules/art.mjs';
import { stagingDir, ART, ZIN } from './lib/paths.mjs';
import { Canvas, tga, dds } from './lib/raster.mjs';
import { cw, yml, assertModifiers } from './lib/core.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const STAGED = stagingDir(process.env.ZIN_STAGED);
const read = p => readFile(path.join(STAGED, p), 'utf8');
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
const tags = countries.map(c => c.tag);
async function hashTree(dir) { const h = createHash('sha256'); const walk = async d => { for (const e of (await readdir(d, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) { const f = path.join(d, e.name); if (e.isDirectory()) await walk(f); else { h.update(path.relative(dir, f)); h.update(await readFile(f)); } } }; await walk(dir); return h.digest('hex'); }

test('The build is deterministic', async () => {
  const before = await hashTree(STAGED);
  execFileSync(process.execPath, [path.join(here, 'build.mjs'), STAGED], { stdio: 'ignore' });
  assert.equal(await hashTree(STAGED), before);
});

test('Every country has exactly one table row with a known people and stance', async () => {
  const rows = (await read('docs/design/countries.csv')).trim().split('\n').slice(1).map(l => l.split(','));
  assert.deepEqual(rows.map(r => r[0]), tags);
  for (const [tag, , people, ideology, stance] of rows) { assert(PEOPLES[people], tag); assert.equal(stanceIdeology[stance], ideology, tag); }
});

test('Startup applies a defined people spirit to every country', async () => {
  const startup = await read('common/on_actions/zin_startup.txt'), ideas = await read('common/ideas/zin_peoples.txt');
  for (const tag of tags) assert.match(startup, new RegExp(`\\t${tag} = \\{ add_ideas = zin_people_(\\w+) set_country_flag = zin_people_\\1 \\}`), tag);
  for (const key of Object.keys(PEOPLES)) assert.match(ideas, new RegExp(`zin_people_${key} = \\{`));
});

test('Every country has names, a portrait pool and a ruler (the game crashed generating characters without them)', async () => {
  const names = await read('common/names/zin_names.txt'), portraits = await read('portraits/zin_portraits.txt'), rulers = await read('common/characters/zin_rulers.txt');
  for (const tag of tags) {
    const block = names.match(new RegExp(`^${tag} = \\{([\\s\\S]*?)\\n\\}`, 'm'))?.[1]; assert(block, `names ${tag}`);
    for (const part of ['male', 'female']) assert(block.match(new RegExp(`${part} = \\{\\s*names = \\{ ([^}]+) \\}`))[1].trim().split(' ').length >= 20, `${part} names ${tag}`);
    assert(block.match(/surnames = \{ ([^}]+) \}/)[1].trim().split(' ').length >= 40, `surnames ${tag}`);
    assert.match(portraits, new RegExp(`^${tag} = \\{\\n\\tarmy = `, 'm'), `portraits ${tag}`);
    assert.match(rulers, new RegExp(`\\t${tag}_zin_ruler = \\{`), `ruler ${tag}`);
  }
  for (const n of [1, 2, 3]) assert.match(portraits, new RegExp(`name = world_continent_${n}\\n\\tarmy`));
});

test('Every referenced sprite is defined and every defined sprite file is staged', async () => {
  const gfx = (await read('interface/zin_portraits.gfx')) + (await read('interface/zin_peoples.gfx'));
  const defined = new Map([...gfx.matchAll(/name = "([^"]+)"\s*texturefile = "([^"]+)"/g)].map(m => [m[1], m[2]]));
  for (const file of defined.values()) await readFile(path.join(STAGED, file));
  const used = [...(await read('portraits/zin_portraits.txt')).matchAll(/"(GFX_[^"]+)"/g), ...(await read('common/characters/zin_rulers.txt')).matchAll(/large = (GFX_\w+)/g)].map(m => m[1]);
  for (const s of used) assert(defined.has(s), s);
});

test('Ideologies keep the four engine keys and every vanilla stance', async () => {
  const text = await read('common/ideologies/00_ideologies.txt');
  for (const id of ['democratic', 'fascism', 'communism', 'neutrality']) assert.match(text, new RegExp(`^\\t${id} = \\{`, 'm'));
  for (const v of ['conservatism', 'despotism', 'fascism_ideology', 'leninism', 'emperor_fascism', 'japan_militarism_ideology']) assert.match(text, new RegExp(`\\t${v} = \\{\\n\\t+can_be_randomly_selected = no`));
  for (const d of Object.values(IDEOLOGIES)) for (const s of Object.keys(d.stances)) assert.match(text, new RegExp(`\\t${s} = \\{`));
});

test('Writers: TGA is 32-bit bottom-left, DDS is uncompressed BGRA, localisation has a BOM', () => {
  const c = new Canvas(2, 2); c.rect(0, 0, 1, 1, [255, 0, 0, 255]);
  const t = tga(c); assert.equal(t[2], 2); assert.equal(t[16], 32); assert.equal(t[17], 8); assert.deepEqual([...t.subarray(18 + 8, 18 + 12)], [0, 0, 255, 255], 'top-left pixel stored in the last row');
  const d = dds(c); assert.equal(d.toString('ascii', 0, 4), 'DDS '); assert.equal(d.readUInt32LE(88), 32); assert.deepEqual([...d.subarray(128, 132)], [0, 0, 255, 255]);
  const y = yml({ a: 'say "hi"' }); assert.deepEqual([...y.subarray(0, 3)], [0xef, 0xbb, 0xbf]); assert.match(y.toString('utf8', 3), /^l_english:\n a:0 "say \\"hi\\""\n$/);
});

test('Negative: unknown modifiers, peoples and stances are rejected', async () => {
  await assert.rejects(assertModifiers('test', { not_a_real_modifier: 1 }), /Unknown modifier/);
  const { loadCountryTable } = await import('./modules/countries.mjs');
  const { writeFile, mkdtemp } = await import('node:fs/promises'); const os = await import('node:os');
  const dir = await mkdtemp(path.join(os.tmpdir(), 'zin-')), bad = path.join(dir, 'countries.csv');
  await writeFile(bad, 'tag,country,people,ideology,stance\nY01,Coldor,dragons,neutrality,zin_wild_clans\n');
  await assert.rejects(loadCountryTable(countries, bad), /Unknown people dragons/);
  await writeFile(bad, 'tag,country,people,ideology,stance\nY01,Coldor,men,neutrality,anarchy\n');
  await assert.rejects(loadCountryTable(countries, bad), /Unknown stance anarchy/);
});

test('Negative: the staged tree is never placed inside the repository', () => {
  for (const dir of [ZIN, path.join(ZIN, 'tools/staged'), path.join(ZIN, 'common')]) assert.throws(() => stagingDir(dir), /outside the ZIN repository/, dir);
  assert.equal(path.resolve(stagingDir(path.join(ZIN, '..', 'zin-staged'))), path.resolve(ZIN, '..', 'zin-staged'));
});

test('Every country has a generated flag; every staged art source traces to a recorded generation', async () => {
  const flags = await flagsDir();
  for (const c of countries) await readFile(path.join(flags, `${flagKey(c.name)}.png`));
  // The tracked cell map must stay the one the sheets were generated and sliced with.
  const workingCells = path.join(ART, 'jobs/flags-cells.json');
  if (await readFile(workingCells).then(() => true, () => false)) assert.deepEqual(JSON.parse(await readFile(FLAG_CELLS, 'utf8')), JSON.parse(await readFile(workingCells, 'utf8')), 'data/flags-cells.json is out of date');
  const provenance = (await read('art/source/provenance.jsonl')).trim().split('\n').map(l => JSON.parse(l));
  const recorded = new Set(provenance.filter(p => p.accepted !== false).map(p => p.sha256));
  const sources = []; const walk = async d => { for (const e of await readdir(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) await walk(f); else if (f.endsWith('.png')) sources.push(f); } };
  await walk(path.join(STAGED, 'art/source'));
  assert(sources.length >= 34, `only ${sources.length} art sources staged`);
  for (const f of sources) assert(recorded.has(createHash('sha256').update(await readFile(f)).digest('hex')), `untracked art source ${f}`);
  assert.equal(cw({ x: { y: true, z: [1, 2] } }), 'x = {\n\ty = yes\n\tz = { 1 2 }\n}\n');
});

test('Every people has a 3D culture and an infantry entity whose model files are staged', async () => {
  const { PEOPLES } = await import('./modules/peoples.mjs');
  const { MODEL_FOR_PEOPLE, cultureOf } = await import('./modules/units3d.mjs');
  const assets = await readFile(`${STAGED}/gfx/entities/zin_units.asset`, 'utf8');
  const cultures = await readFile(`${STAGED}/common/graphicalculturetype.txt`, 'utf8');
  for (const people of Object.keys(PEOPLES)) {
    const id = MODEL_FOR_PEOPLE[people];
    assert.match(cultures, new RegExp(`^${cultureOf(people)}$`, 'm'), people);
    assert.match(assets, new RegExp(`name = "${cultureOf(people)}_infantry_entity"\\s+pdxmesh = "${id}_mesh"`), people);
    for (const f of [`${id}.mesh`, `${id}.asset`, `${id}_diffuse.dds`, `${id}_specular.dds`, `${id}_normal.dds`, `${id}_idle.anim`, `${id}_death.anim`]) await readFile(`${STAGED}/gfx/models/units/zin/${id}/${f}`);
  }
  assert.match(cultures, /^western_european_gfx$/m, 'vanilla cultures kept');
  // Meshes sit in a .gfx objectTypes block, never in the entity .asset file (the game rejects pdxmesh there).
  const gfx = await readFile(`${STAGED}/gfx/entities/zin_units.gfx`, 'utf8');
  assert.match(gfx, /^objectTypes = \{/m);
  assert.doesNotMatch(assets, /pdxmesh = \{/);
  // HOI4 resolves textures by file name across the mod, so every staged texture name must be unique.
  const names = (await readdir(`${STAGED}/gfx/models/units/zin`, { recursive: true })).filter(n => n.endsWith('.dds')).map(n => n.split(/[\\/]/).pop());
  assert.equal(new Set(names).size, names.length, 'texture file names are unique');
  for (const id of new Set(Object.values(MODEL_FOR_PEOPLE))) assert.match(gfx, new RegExp(`texture_diffuse = "${id}_diffuse.dds"`), id);
});
