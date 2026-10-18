// Where the ZIN content builder reads and writes. The ZIN root comes from this file's location (tools/content/lib ->
// repository root); everything outside the repository is an environment variable whose default is the owner's
// machine, so a plain `node tools/content/build.mjs` keeps working there and another machine sets the variables.
//   HOI4_AGENT_TOOLS  hoi4-agent-tools checkout (shared atomic rewrite engine used by apply.mts)
//   ZIN_ART           art working directory: raw/ sheets, flags/ slices, jobs/ (provenance.jsonl), models/
//   HOI4_GAME         Hearts of Iron IV install (modifier documentation)
//   ZIN_LORE_VAULT    the owner's lore vault export; when absent the copy already in docs/lore/vault/ is used
//   GPTIMAGE_LIB      gptimage library src/ directory (imagegen.mjs)
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const slash = p => p.split(path.sep).join('/');
const env = (name, fallback) => slash(path.resolve(process.env[name] || fallback));

export const ZIN = slash(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'));
export const AGENT_TOOLS = env('HOI4_AGENT_TOOLS', 'C:/Users/klimp/Documents/Projects/hoi4-agent-tools');
export const ART = env('ZIN_ART', `${AGENT_TOOLS}/.tmp/zin-art`);
export const GAME = env('HOI4_GAME', 'C:/Program Files (x86)/Steam/steamapps/common/Hearts of Iron IV');
export const LORE_VAULT = env('ZIN_LORE_VAULT', 'C:/Users/klimp/Downloads/ZIN_Lore_Vault');
export const GPTIMAGE_LIB = env('GPTIMAGE_LIB', 'C:/Users/klimp/tools/gptimage/src');
// Generated sources already tracked in the mod: the fallback for any raw sheet or provenance missing from ART.
export const ART_SOURCE = `${ZIN}/art/source`;
// The staged tree never lives inside the repository.
export const DEFAULT_STAGING = slash(path.join(os.tmpdir(), 'zin-content-staged'));

// A raw generated sheet: the art working copy when present, otherwise the copy tracked under art/source/.
export const rawFile = rel => existsSync(`${ART}/raw/${rel}`) ? `${ART}/raw/${rel}` : `${ART_SOURCE}/${rel}`;
export const provenanceFile = () => existsSync(`${ART}/jobs/provenance.jsonl`) ? `${ART}/jobs/provenance.jsonl` : `${ART_SOURCE}/provenance.jsonl`;

// Refuse a staging directory inside the repository: Staged.write() empties it first.
export function stagingDir(arg) {
  const dir = path.resolve(arg || DEFAULT_STAGING), rel = path.relative(ZIN, dir);
  if (rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))) throw new Error(`Staging directory must be outside the ZIN repository: ${dir}`);
  return dir;
}
