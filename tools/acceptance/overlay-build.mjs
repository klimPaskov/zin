// Builds a test overlay for the isolated Linux profile: the files that the politics plan and the staged content tree
// would change in the live mod, plus the two manifests they would leave. Nothing here touches the live mod.
//   node overlay-build.mjs <stagedDir> <politicsPlan.json> <outDir>
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const [stagedDir, planFile, outDir] = process.argv.slice(2);
const ZIN = 'C:/Users/klimp/OneDrive/Documents/Paradox Interactive/Hearts of Iron IV/mod/zin';
const sha = b => createHash('sha256').update(b).digest('hex');
async function walk(d, b = d) { const o = []; for (const e of await readdir(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) o.push(...await walk(f, b)); else o.push(path.relative(b, f).split(path.sep).join('/')); } return o; }
await rm(outDir, { recursive: true, force: true });
const files = new Map();
// Politics plan: its manifest is the new world manifest; its other entries are writes (content) or deletes (null).
// planFile '-' keeps the live world files (content only). ZIN_SKIP_INACTIVE=1 drops the inactive-history writes.
const plan = planFile === '-' ? [{ relativePath: '.hoi4-agent-world.json', content: (await readFile(path.join(ZIN, '.hoi4-agent-world.json'))).toString('base64') }] : JSON.parse(await readFile(planFile, 'utf8'));
let world;
for (const f of plan) {
  if (f.relativePath === '.hoi4-agent-world.json') { world = Buffer.from(f.content, 'base64'); continue; }
  if (f.content) files.set(f.relativePath, Buffer.from(f.content, 'base64'));
}
let worldManifest = JSON.parse(world.toString('utf8'));
// ZIN_BODY replaces the inactive-history body line (bisect of which body the engine accepts); \n in it is a newline.
if (process.env.ZIN_BODY) {
  const body = process.env.ZIN_BODY.replaceAll('\\n', '\n');
  for (const [rel, b] of files) if (/ - inactive world\.txt$/.test(rel) && /set_research_slots = 3/.test(b.toString())) {
    const nb = Buffer.from(b.toString().replace('set_research_slots = 3\n', body + '\n')); files.set(rel, nb);
    const e = worldManifest.files.find(f => f.relativePath === rel); e.sha256 = sha(nb);
  }
  world = Buffer.from(JSON.stringify(worldManifest, null, 2) + '\n');
}
// ZIN_DEFAULT_TAG makes another bookmark country the default (start-as test; the profile copy only).
if (process.env.ZIN_DEFAULT_TAG) {
  const rel = 'common/bookmarks/world.txt';
  const cur = files.get(rel) ?? await readFile(path.join(ZIN, rel));
  const tag = process.env.ZIN_DEFAULT_TAG, ideology = process.env.ZIN_DEFAULT_IDEOLOGY ?? 'neutrality';
  let t = cur.toString().replace(/default_country = "[A-Z0-9]+"/, `default_country = "${tag}"`);
  // As exp-start-as.sh: a country outside the bookmark's featured list gets an entry.
  if (!t.includes(`"${tag}" = {`)) t = t.replace(/\n "Y0L" = \{/, `\n "${tag}" = { history = "${tag}_WORLD_DESC" ideology = ${ideology} }\n "Y0L" = {`);
  const nb = Buffer.from(t);
  files.set(rel, nb); worldManifest.files.find(f => f.relativePath === rel).sha256 = sha(nb);
  world = Buffer.from(JSON.stringify(worldManifest, null, 2) + '\n');
}
// Bisect switches: ZIN_SKIP=deletes|bodies|inactive keeps the live state of the inactive history files.
const skip = process.env.ZIN_SKIP ?? '';
if (skip) {
  const live = JSON.parse(await readFile(path.join(ZIN, '.hoi4-agent-world.json'), 'utf8'));
  const isInactive = p => / - inactive world\.txt$/.test(p);
  const keepLive = p => isInactive(p) && (skip === 'inactive' || (skip === 'deletes' && !worldManifest.files.some(f => f.relativePath === p)) || (skip === 'bodies' && worldManifest.files.some(f => f.relativePath === p)));
  const liveEntries = live.files.filter(f => keepLive(f.relativePath));
  for (const f of liveEntries) files.delete(f.relativePath);
  const rest = worldManifest.files.filter(f => !keepLive(f.relativePath));
  worldManifest = { ...worldManifest, files: [...rest, ...liveEntries].sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'en')) };
  world = Buffer.from(JSON.stringify(worldManifest, null, 2) + '\n');
}
const worldPaths = new Set(worldManifest.files.map(f => f.relativePath));
// Staged content: every file not owned by the world manifest goes into the content manifest (as apply.mts does).
const staged = await walk(stagedDir);
const content = [];
for (const rel of staged.sort((a, b) => a.localeCompare(b, 'en'))) {
  const b = await readFile(path.join(stagedDir, rel));
  files.set(rel, b);
  if (!worldPaths.has(rel)) content.push({ relativePath: rel, sha256: sha(b) });
}
// Only changed files are carried; the rest is read from the live mod by the overlay sync.
let carried = 0;
for (const [rel, b] of files) {
  let cur = null; try { cur = await readFile(path.join(ZIN, rel)); } catch {}
  if (cur && cur.equals(b)) continue;
  const p = path.join(outDir, 'files', rel); await mkdir(path.dirname(p), { recursive: true }); await writeFile(p, b); carried++;
}
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'world.json'), world);
await writeFile(path.join(outDir, 'content.json'), JSON.stringify({ version: 1, files: content }, null, 2) + '\n');
// Every manifest entry must resolve to exactly its hash from the overlay or the live mod.
for (const f of [...worldManifest.files, ...content]) {
  let b; try { b = await readFile(path.join(outDir, 'files', f.relativePath)); } catch { b = await readFile(path.join(ZIN, f.relativePath)); }
  if (sha(b) !== f.sha256) throw new Error(`overlay hash mismatch ${f.relativePath}`);
}
console.log(JSON.stringify({ carried, worldFiles: worldManifest.files.length, contentFiles: content.length }));
