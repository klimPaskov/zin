// Sync step (spec 06_vanilla_removal_and_zero_errors.md, rule 4): the launcher descriptor mod/zin.mod must carry the
// same replace_path lines as descriptor.mod, or the replace_path lines do nothing. This copies them through the
// shared atomic rewrite engine of hoi4-agent-tools (TransactionManager), as apply.mts does. Run from tools/:
//   node --import tsx content/sync/zin_mod_descriptor.mjs [descriptor] [plan|apply]
// descriptor: the descriptor whose replace_path lines are copied (default: the repository's descriptor.mod, so run
// it after apply.mts; pass <staged>/descriptor.mod to preview). Every other line of zin.mod (name, path, version,
// tags) is kept in place. The launcher file sits beside the repository, outside the "zin" workspace, so this step
// registers the mod folder as its own workspace "zin-launcher" with private state in ZIN_WORKFLOW_STATE/launcher
// (default ~/.zin-content-workflow/launcher) and changes exactly one file, zin.mod.
import { readFile, realpath } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { ZIN, AGENT_TOOLS, GAME } from '../lib/paths.mjs';
import { replacePathsOf } from '../checks/vanilla_refs.mjs';

// Replace the launcher's replace_path lines with the descriptor's, at the place of the first one; keep the rest.
export function syncLauncherText(launcher, descriptor) {
  const nl = launcher.includes('\r\n') ? '\r\n' : '\n';
  const lines = launcher.replace(/\r?\n$/, '').split(/\r?\n/);
  const isReplace = l => /^\s*replace_path\s*=/.test(l);
  const first = lines.findIndex(isReplace);
  const kept = lines.filter(l => !isReplace(l));
  const wanted = replacePathsOf(descriptor).map(p => `replace_path="${p}"`);
  const at = first < 0 ? kept.length : lines.slice(0, first).filter(l => !isReplace(l)).length;
  return [...kept.slice(0, at), ...wanted, ...kept.slice(at)].join(nl) + nl;
}

const MODES = new Set(['plan', 'apply']);
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), [descArg, mode = 'plan'] = MODES.has(args[0] ?? '') ? [undefined, args[0]] : args;
  assert(MODES.has(mode), 'usage: zin_mod_descriptor.mjs [descriptor] [plan|apply]');
  const descriptor = await readFile(descArg ?? path.join(ZIN, 'descriptor.mod'), 'utf8');
  const modRoot = path.dirname(ZIN), launcherRel = `${path.basename(ZIN)}.mod`;
  const before = await readFile(path.join(modRoot, launcherRel));
  const after = Buffer.from(syncLauncherText(before.toString('utf8'), descriptor));
  const summary = { mode, launcher: path.join(modRoot, launcherRel), replacePaths: replacePathsOf(after.toString('utf8')).length, previous: replacePathsOf(before.toString('utf8')).length, changed: !before.equals(after) };
  if (!summary.changed) { console.log(JSON.stringify({ ...summary, applied: false })); process.exit(0); }
  const core = name => import(pathToFileURL(`${AGENT_TOOLS}/src/hoi4_agent_tools/core/${name}.js`).href);
  const { serverConfigurationSchema } = await core('configuration');
  const { WorkspaceResolver } = await core('workspace');
  const { TransactionManager } = await core('transactions');
  const { sha256Bytes } = await core('canonical');
  const state = path.resolve(process.env.ZIN_WORKFLOW_STATE || path.join(os.homedir(), '.zin-content-workflow'), 'launcher');
  const resolver = await WorkspaceResolver.create(serverConfigurationSchema.parse({ version: 1, serverStateRoot: path.join(state, 'server'), workspaceStorageRoot: path.join(state, 'storage'), workspaces: [{ id: 'zin-launcher', name: 'ZIN launcher descriptor', root: modRoot, gameRoot: GAME, includeGameDlc: false }] }));
  const root = resolver.get('zin-launcher').registration.root;
  assert.equal((await realpath(root)).toLowerCase(), (await realpath(modRoot)).toLowerCase(), 'launcher workspace root');
  // Both modes prove the engine accepts the launcher file as a write target; only apply writes.
  await resolver.resolvePath('zin-launcher', launcherRel, 'write', ['mod']);
  if (mode !== 'apply') { console.log(JSON.stringify({ ...summary, writeTargetAccepted: true, applied: false })); process.exit(0); }
  const checks = { diagnostics: [], checks: [{ id: 'zin-launcher-replace-paths', passed: true, message: 'zin.mod carries the replace_path lines of descriptor.mod' }] };
  const manager = new TransactionManager(resolver);
  const plan = await manager.plan({
    workspaceId: 'zin-launcher', operationKind: 'zin-launcher-sync', operations: [{ id: 'zin-launcher-sync', kind: 'zin-launcher-sync', summary: 'Copy replace_path lines into the launcher descriptor', data: { replacePaths: summary.replacePaths } }],
    changes: [{ relativePath: launcherRel, content: after, operationIds: ['zin-launcher-sync'] }],
    validate: async proposed => { assert.equal(sha256Bytes(proposed.get(launcherRel)), sha256Bytes(after)); return checks; },
  });
  await manager.apply('zin-launcher', plan.transactionId, plan.planHash, { postValidate: async () => { assert.equal(sha256Bytes(await readFile(path.join(modRoot, launcherRel))), sha256Bytes(after)); return checks; } });
  console.log(JSON.stringify({ ...summary, applied: true }));
}
