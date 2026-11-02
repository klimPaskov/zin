// Validation of the drawn-map import inputs against the HOI4 Agent Tools, read only.
//
// The converted documents of tools/content/data/geography/import/ are checked:
//   1 against the tool's published JSON schemas (geography-model version 1, reference-sheets version 1 and, for the
//     create_world operation of the prepared preview calls, map-operation), read from
//     the tool repository at a git ref (default origin/main, where reference-sheets is published) and compiled with the
//     tool's own Ajv (draft 2020-12);
//   2 by the tool's own geography resolver (src/hoi4_agent_tools/map/geography/resolve.ts, resolveGeography), run from
//     the tool's checkout through tsx with the import's options: the 5,120 x 2,560 frame, a reference picture and
//     edge mode sea-band. Its diagnostics are the MAP_GEOGRAPHY_* findings a preview would report for the model.
// Nothing is written to the tool repository; tsx keeps its cache in the system temp folder.
//
//   node tools/content/geography/validate_import.mjs [--tool <tool repo>] [--ref <git ref>] [--dir <import dir>] [--json]
// Exit code 1 when a schema check fails or the resolver reports an error.
import { readFileSync, existsSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { RELEASED_TOOL } from '../lib/paths.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_TOOL = process.env.HOI4_AGENT_TOOLS_DIR ?? 'C:/Users/klimp/Documents/Projects/hoi4-agent-tools';
export const DEFAULT_DIR = path.join(here, '../data/geography/import');
export const SCHEMAS = Object.freeze({ geography: 'schemas/geography-model.schema.json', sheets: 'schemas/reference-sheets.schema.json', operation: 'schemas/map-operation.schema.json', operationWithPalette: 'schemas/map-operation.schema.json' });

/** A schema file of the tool at a git ref, or from its working tree when the ref lacks it. */
export function toolSchema(tool, ref, file) {
  try { return JSON.parse(execFileSync('git', ['-C', tool, 'show', `${ref}:${file}`], { encoding: 'utf8', maxBuffer: 1 << 26 })); } catch { /* fall back */ }
  const p = path.join(tool, file);
  if (!existsSync(p)) throw new Error(`${file} is in neither ${ref} nor the working tree of ${tool}`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

// The installed release of the tool (lib/paths.mjs: the newest runtime the worker installed); its Ajv stands in while the checkout
// has no node_modules.
export { RELEASED_TOOL };

/** Ajv (draft 2020-12) from the tool checkout's node_modules, else from the installed release's. */
export function toolAjv(tool) {
  for (const base of [tool, RELEASED_TOOL]) {
    try {
      const Ajv2020 = createRequire(path.join(base, 'package.json'))('ajv/dist/2020').default;
      return new Ajv2020({ allErrors: true, strict: false });
    } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
  }
  throw new Error(`Ajv is in neither ${tool} nor ${RELEASED_TOOL}`);
}

/** Schema errors of a document (empty when valid), at most `limit`. */
export function schemaErrors(ajv, schema, doc, limit = 20) {
  const validate = (schema.$id && ajv.getSchema(schema.$id)) || ajv.compile(schema);
  return validate(doc) ? [] : validate.errors.slice(0, limit).map(e => `${e.instancePath || '/'} ${e.message}${e.params ? ` ${JSON.stringify(e.params)}` : ''}`);
}

/** The tool's resolver on a geography document: { valid, diagnostics, edgeBand }. */
/**
 * The resolver of the installed release (compiled, the code the preview itself runs), else the checkout's source
 * through tsx: { valid, diagnostics, edgeBand, source }.
 */
export async function resolveGeographyWithTool(tool, geographyPath, options = {}) {
  const released = path.join(RELEASED_TOOL, 'dist/hoi4_agent_tools/map/geography/resolve.js');
  if (existsSync(released)) {
    const { width = 5120, height = 2560, edge = 'sea-band' } = options;
    const { resolveGeography } = await import(pathToFileURL(released).href);
    const r = resolveGeography(JSON.parse(readFileSync(geographyPath, 'utf8')), { frame: { width, height }, hasReference: true, edge: { mode: edge }, operationId: 'world' });
    return { valid: r.valid, edgeBand: r.edgeBand, diagnostics: r.diagnostics, source: released };
  }
  return { ...resolveWithTool(tool, geographyPath, options), source: path.join(tool, 'src') };
}
export function resolveWithTool(tool, geographyPath, { width = 5120, height = 2560, edge = 'sea-band' } = {}) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'zin-geo-resolve-'));
  try {
    const script = path.join(dir, 'resolve.mts');
    const resolveUrl = pathToFileURL(path.join(tool, 'src/hoi4_agent_tools/map/geography/resolve.ts')).href;
    writeFileSync(script, [
      `import { readFileSync } from 'node:fs';`,
      `import { resolveGeography } from ${JSON.stringify(resolveUrl)};`,
      `const model = JSON.parse(readFileSync(${JSON.stringify(geographyPath)}, 'utf8'));`,
      `const r = resolveGeography(model, { frame: { width: ${width}, height: ${height} }, hasReference: true, edge: { mode: ${JSON.stringify(edge)} }, operationId: 'world' });`,
      `process.stdout.write(JSON.stringify({ valid: r.valid, edgeBand: r.edgeBand, diagnostics: r.diagnostics }));`,
    ].join('\n'));
    const tsx = pathToFileURL(createRequire(path.join(here, '../../package.json')).resolve('tsx')).href;
    const out = execFileSync(process.execPath, ['--import', tsx, script], { encoding: 'utf8', maxBuffer: 1 << 28, cwd: dir });
    return JSON.parse(out);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

async function main(argv) {
  const args = argv.slice(2);
  const opt = (name, d) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : d; };
  const tool = opt('--tool', DEFAULT_TOOL), ref = opt('--ref', 'origin/main'), dir = opt('--dir', DEFAULT_DIR);
  const ajv = toolAjv(tool);
  const geographyPath = path.join(dir, 'aoaz.geography.json');
  const call = file => (existsSync(path.join(dir, file)) ? JSON.parse(readFileSync(path.join(dir, file), 'utf8')).arguments.operations[0] : null);
  const docs = { geography: JSON.parse(readFileSync(geographyPath, 'utf8')), sheets: JSON.parse(readFileSync(path.join(dir, 'aoaz.sheets.json'), 'utf8')), operation: call('preview_call.json'), operationWithPalette: call('preview_call_palette.json') };
  const result = { tool, ref, schema: {}, resolver: null };
  let failed = false;
  for (const [k, file] of Object.entries(SCHEMAS)) {
    if (!docs[k]) continue;
    const schema = toolSchema(tool, ref, file);
    const errors = schemaErrors(ajv, schema, docs[k]);
    result.schema[k] = { schema: `${file} (${schema.$id ?? 'no $id'})`, valid: errors.length === 0, errors };
    if (errors.length) failed = true;
  }
  const r = await resolveGeographyWithTool(tool, geographyPath);
  const bySeverity = {};
  for (const d of r.diagnostics) bySeverity[d.severity] = (bySeverity[d.severity] ?? 0) + 1;
  const byCode = {};
  for (const d of r.diagnostics) byCode[`${d.severity} ${d.code}`] = (byCode[`${d.severity} ${d.code}`] ?? 0) + 1;
  result.resolver = { valid: r.valid, edgeBand: r.edgeBand, bySeverity, byCode, diagnostics: r.diagnostics.map(d => ({ severity: d.severity, code: d.code, message: d.message })) };
  if (!r.valid) failed = true;
  if (args.includes('--json')) console.log(JSON.stringify(result, null, 1));
  else {
    for (const [k, v] of Object.entries(result.schema)) console.log(`schema ${k}: ${v.valid ? 'valid' : 'INVALID'} against ${v.schema}${v.errors.length ? `\n  ${v.errors.join('\n  ')}` : ''}`);
    console.log(`resolver (${r.source}): ${r.valid ? 'valid' : 'INVALID'}; edge band ${JSON.stringify(r.edgeBand)}; ${Object.entries(bySeverity).map(([k, v]) => `${k} ${v}`).join(', ') || 'no diagnostics'}`);
    for (const [k, v] of Object.entries(byCode).sort()) console.log(`  ${k} x${v}`);
    for (const d of r.diagnostics.filter(x => x.severity === 'error' || x.severity === 'blocker').slice(0, 40)) console.log(`  ${d.code}: ${d.message}`);
  }
  if (failed) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv).catch(e => { console.error(e); process.exitCode = 1; });
