// Apply a staged ZIN content tree to the ZIN workspace in one TransactionManager transaction (the shared atomic
// rewrite engine of the hoi4-agent-tools checkout named by HOI4_AGENT_TOOLS). Every content write to the mod goes
// through this script. From tools/ (tsx is a tools/ dependency):
//   node --import tsx content/apply.mts [stagedDir] [plan|apply]      (default: <OS temp>/zin-content-staged, plan)
// The workspace configuration is ZIN_WORKFLOW_CONFIG (default <HOI4_AGENT_TOOLS>/.tmp/zin-workflow/config.json); without
// that file a configuration is derived for this repository with its private transaction state in ZIN_WORKFLOW_STATE
// (default ~/.zin-content-workflow). Either way the workspace root must be this repository.
// Overhaul content is tracked in .zin-content.json, separate from the map generator's .hoi4-agent-world.json, so a
// map rebuild never treats content as its own obsolete output. A staged file that the world manifest already owns
// is allowed only for the shared entry points below; its world-manifest hash is updated in the same transaction.
// Files listed in the previous content manifest but absent from the staged tree are deleted.
import { readFile, readdir, realpath } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { ZIN, AGENT_TOOLS, GAME, stagingDir } from './lib/paths.mjs';

const core = (name: string) => import(pathToFileURL(`${AGENT_TOOLS}/src/hoi4_agent_tools/core/${name}.js`).href);
const { serverConfigurationSchema } = await core('configuration');
const { WorkspaceResolver } = await core('workspace');
const { TransactionManager } = await core('transactions');
const { sha256Bytes } = await core('canonical') as { sha256Bytes: (bytes: Uint8Array) => string };

const SHARED_WORLD_FILES = new Set(['descriptor.mod', 'common/bookmarks/world.txt', 'common/on_actions/world.txt']);
const CONTENT_MANIFEST = '.zin-content.json', WORLD_MANIFEST = '.hoi4-agent-world.json';
const MODES = new Set(['plan', 'apply']);
const args = process.argv.slice(2), [dirArg, mode = 'plan'] = MODES.has(args[0] ?? '') ? [undefined, args[0]] : args;
assert(MODES.has(mode) && args.length <= 2, 'usage: apply.mts [stagedDir] [plan|apply]');
const staged = stagingDir(dirArg);
assert(existsSync(staged), `Staged tree not found: ${staged} (run build.mjs first)`);

async function walk(dir: string, base = dir): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isSymbolicLink()) throw new Error(`Symlink in staged tree: ${full}`);
    if (e.isDirectory()) out.push(...await walk(full, base)); else out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out.sort((a, b) => a.localeCompare(b, 'en'));
}

const configFile = path.resolve(process.env.ZIN_WORKFLOW_CONFIG || `${AGENT_TOOLS}/.tmp/zin-workflow/config.json`);
const state = path.resolve(process.env.ZIN_WORKFLOW_STATE || path.join(os.homedir(), '.zin-content-workflow'));
const config = existsSync(configFile) ? JSON.parse(await readFile(configFile, 'utf8')) : {
  version: 1, serverStateRoot: path.join(state, 'server'), workspaceStorageRoot: path.join(state, 'storage'),
  workspaces: [{ id: 'zin', name: 'ZIN', root: ZIN, gameRoot: GAME, includeGameDlc: false }],
};
const resolver = await WorkspaceResolver.create(serverConfigurationSchema.parse(config));
const root: string = resolver.get('zin').registration.root;
const same = async (a: string, b: string) => { const [x, y] = [await realpath(a), await realpath(b)]; return process.platform === 'win32' ? x.toLowerCase() === y.toLowerCase() : x === y; };
assert(await same(root, ZIN), `Workspace "zin" in ${existsSync(configFile) ? configFile : 'the derived configuration'} is ${root}, not this repository ${ZIN}`);
const readOptional = async (p: string) => { try { return await readFile(path.join(root, p)); } catch (e: any) { if (e.code === 'ENOENT') return null; throw e; } };

const world = JSON.parse((await readFile(path.join(root, WORLD_MANIFEST))).toString('utf8'));
const worldPaths = new Set<string>(world.files.map((f: any) => f.relativePath));
const oldContentBytes = await readOptional(CONTENT_MANIFEST);
const oldContent: string[] = oldContentBytes ? JSON.parse(oldContentBytes.toString('utf8')).files.map((f: any) => f.relativePath) : [];

const stagedFiles = new Map<string, Buffer>();
for (const rel of await walk(staged)) {
  assert(!rel.startsWith('../') && !rel.includes('/../') && !path.isAbsolute(rel), `Unsafe path ${rel}`);
  assert(rel !== CONTENT_MANIFEST && rel !== WORLD_MANIFEST, `Manifests are written by this tool: ${rel}`);
  assert(!rel.startsWith('.git/') && !rel.startsWith('.tmp/') && !rel.startsWith('docs/reference/originals/'), `Protected path ${rel}`);
  if (worldPaths.has(rel)) assert(SHARED_WORLD_FILES.has(rel), `Staged file belongs to the map generator: ${rel}`);
  stagedFiles.set(rel, await readFile(path.join(staged, rel)));
}

const changes = new Map<string, Buffer | null>();
for (const [rel, bytes] of stagedFiles) { const current = await readOptional(rel); if (!current || !current.equals(bytes)) changes.set(rel, bytes); }
const contentPaths = [...stagedFiles.keys()].filter(p => !worldPaths.has(p));
for (const rel of oldContent) if (!stagedFiles.has(rel) && !worldPaths.has(rel) && await readOptional(rel)) changes.set(rel, null);

// Manifests from the exact final bytes.
const contentManifest = { version: 1, files: contentPaths.map(relativePath => ({ relativePath, sha256: sha256Bytes(stagedFiles.get(relativePath)!) })) };
const contentManifestBytes = Buffer.from(JSON.stringify(contentManifest, null, 2) + '\n');
const newWorld = { ...world, files: world.files.map((f: any) => stagedFiles.has(f.relativePath) ? { ...f, sha256: sha256Bytes(stagedFiles.get(f.relativePath)!) } : f) };
const worldBytes = Buffer.from(JSON.stringify(newWorld, null, 2) + '\n');
const currentWorld = await readFile(path.join(root, WORLD_MANIFEST));
if (!currentWorld.equals(worldBytes) && newWorld.files.some((f: any, i: number) => f.sha256 !== world.files[i].sha256)) changes.set(WORLD_MANIFEST, worldBytes);
if (!oldContentBytes || !oldContentBytes.equals(contentManifestBytes)) changes.set(CONTENT_MANIFEST, contentManifestBytes);

const summary = { mode, staged: stagedFiles.size, contentFiles: contentPaths.length, sharedWorldFiles: [...stagedFiles.keys()].filter(p => worldPaths.has(p)), written: [...changes].filter(([, b]) => b).length, deleted: [...changes].filter(([, b]) => !b).map(([p]) => p) };
if (mode !== 'apply' || changes.size === 0) { console.log(JSON.stringify({ ...summary, applied: false })); process.exit(0); }

const checks = { diagnostics: [], checks: [{ id: 'zin-content-hashes', passed: true, message: 'Staged content, content manifest and world manifest hashes match' }] };
const manager = new TransactionManager(resolver);
const plan = await manager.plan({
  workspaceId: 'zin', operationKind: 'zin-content', operations: [{ id: 'zin-content', kind: 'zin-content', summary: 'Apply staged ZIN overhaul content', data: { files: changes.size } }],
  changes: [...changes].map(([relativePath, content]) => ({ relativePath, content, operationIds: ['zin-content'] })),
  validate: async proposed => { for (const [rel, bytes] of changes) { const got = proposed.has(rel) ? proposed.get(rel) : undefined; assert.equal(got === null || got === undefined ? null : sha256Bytes(got), bytes ? sha256Bytes(bytes) : null, rel); } return checks; },
});
await manager.apply('zin', plan.transactionId, plan.planHash, {
  postValidate: async () => {
    for (const f of contentManifest.files) assert.equal(sha256Bytes((await readOptional(f.relativePath))!), f.sha256, f.relativePath);
    for (const [rel, bytes] of changes) { const now = await readOptional(rel); assert.equal(now ? sha256Bytes(now) : null, bytes ? sha256Bytes(bytes) : null, rel); }
    return checks;
  },
});
console.log(JSON.stringify({ ...summary, applied: true }));
