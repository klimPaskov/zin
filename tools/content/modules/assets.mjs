// Asset manifest (docs/specs/08_art_and_assets/05_asset_manifest.md section 2): one record per shipped asset with its
// files, sprites, source job, provenance, owner spec, people, uniqueness group, format and size. It joins the staged
// tree (laid over the repository), the module manifests, the provenance log and the reference graph of the check.
// It runs last in the build, so it sees every file the other modules stage, and it never edits a shipped file.
//
//   art/source/asset_manifest.json          canonical JSON, records sorted by id (the same inputs give the same bytes)
//   art/source/asset_manifest_summary.json  compact counts and the manifest's own sha256
//
// buildAssets() also runs the completeness check (checks/assets.mjs) and gates it on the baseline file
// docs/design/validation/asset_baseline.json: only errors that are not in the baseline fail the build.
import { ZIN, GAME } from '../lib/paths.mjs';
import { sha256 } from '../lib/loaded_assets.mjs';
import { perceptualOf, loadAssetContext, analyze, runChecks, readBaseline, newFindings, fixedFindings, baselineOf, writeJsonAtomic, summaryText, BASELINE_FILE } from '../checks/assets.mjs';
import { PEOPLES } from './peoples.mjs';
import { MODEL_FOR_PEOPLE } from './units3d.mjs';

export const MANIFEST_FILE = 'art/source/asset_manifest.json';
export const SUMMARY_FILE = 'art/source/asset_manifest_summary.json';
export const MANIFEST_VERSION = 1;

// Canonical JSON: object keys sorted at every level, one-space indent, trailing newline.
export function canonicalJson(value) {
  const sort = v => Array.isArray(v) ? v.map(sort) : (v && typeof v === 'object') ? Object.fromEntries(Object.keys(v).sort().map(k => [k, sort(v[k])])) : v;
  return `${JSON.stringify(sort(value), null, 1)}\n`;
}

const fill = (tpl, m) => (tpl == null ? '' : String(tpl).replace(/\$(\d)/g, (_, n) => m?.[Number(n)] ?? ''));
const uniqSorted = a => [...new Set(a)].sort();
const peopleKeys = Object.keys(PEOPLES).sort((a, b) => b.length - a.length);

// The people an entry of the unit models belongs to: every people that borrows the model, owner first.
function modelPeople(id) {
  const owner = peopleKeys.find(p => id.startsWith(`zin_${p}_`)) ?? '';
  const users = Object.entries(MODEL_FOR_PEOPLE).filter(([, m]) => m === id).map(([p]) => p);
  return { owner, people: uniqSorted([...(owner ? [owner] : []), ...users]) };
}

const FORMAT_BY_EXT = { mesh: 'mesh', anim: 'anim', cur: 'cur', ani: 'ani', ico: 'ico', wav: 'wav', ogg: 'ogg', mp3: 'mp3', fnt: 'fnt' };

function fallbackClass(rel, ext) {
  const stem = rel.replace(/\.[^./]+$/, '');
  const kind = ['wav', 'ogg', 'mp3'].includes(ext) ? (rel.startsWith('music/') ? 'music' : 'sound') : ['mesh', 'anim'].includes(ext) ? 'model' : 'ui_chrome';
  return { family: 'U', key: stem, kind, group: 'misc', bound_by: 'sprite', route: 'imagegen', priority: 1e6 };
}

// Build the manifest object from the check context and its analysis.
export function buildManifest(ctx, A) {
  const { view, vanilla, families } = ctx;
  const order = new Map(ctx.families.rules.map((r, i) => [r.id, i]));
  const byId = new Map();
  for (const rel of [...A.files.keys()].sort()) {
    const f = A.files.get(rel), rule = f.cls?.rule, m = f.cls?.m;
    const base = rule ? { family: rule.family, key: fill(rule.key, m), kind: rule.kind, group: fill(rule.group, m), bound_by: rule.bound_by, route: rule.route, priority: order.get(rule.id), people: rule.people ? fill(rule.people, m) : '', reach: rule.reach ?? 'visible', variant: rule.variant ? fill(rule.variant, m) : '' } : fallbackClass(rel, f.ext);
    const id = `${base.family}/${base.key}${base.variant ? `/${base.variant}` : ''}`;
    const entry = byId.get(id) ?? byId.set(id, { id, base, files: [] }).get(id);
    entry.files.push({ rel, f, base });
  }
  const records = [];
  for (const [id, entry] of byId) {
    const files = entry.files.sort((a, b) => (a.base.priority ?? 1e6) - (b.base.priority ?? 1e6) || (a.rel < b.rel ? -1 : 1));
    const primary = files[0], b0 = primary.base;
    const sprites = uniqSorted(files.flatMap(x => A.spriteByFile.get(x.rel) ?? []));
    const links = files.map(x => A.links.get(x.rel)).filter(Boolean);
    const lead = links.find(l => l.source) ?? links[0];
    const jobs = uniqSorted(links.flatMap(l => l.source?.jobs ?? []));
    const ops = uniqSorted(links.flatMap(l => l.ops ?? []));
    const source = { route: lead?.route ?? b0.route, jobs, ops };
    if (lead?.source?.path) source.path = lead.source.path;
    if (lead?.source?.sheet) { source.sheet = lead.source.sheet; source.cell = lead.source.cell; }
    if (lead?.source?.rawSha256) source.rawSha256 = lead.source.rawSha256;
    if (lead?.source?.review) source.review = lead.source.review;
    if (lead?.manifest) source.manifest = lead.manifest;
    const fileRows = files.map(({ rel, f }) => {
      const fr = A.spriteByFile.get(rel) ?? [];
      let frames = IMAGE_FRAMES(A, rel, fr);
      return { path: rel, bytes: f.bytes, sha256: f.sha256, width: f.info.width, height: f.info.height, format: IMAGE_EXTS_HAVE(f.ext) ? f.info.format : (FORMAT_BY_EXT[f.ext] ?? 'other'), mips: IMAGE_EXTS_HAVE(f.ext) ? f.info.mips : 0, frames };
    });
    const primaryImage = files.find(x => IMAGE_EXTS_HAVE(x.f.ext) && x.f.info.valid);
    const perceptual = primaryImage && b0.group !== 'misc' && !primaryImage.rel.startsWith('map/') ? (perceptualOf(ctx, A, primaryImage.rel) ?? {}) : {};
    let people = [], culture = '';
    if (b0.family === 'K') { const mp = modelPeople(b0.key); people = mp.people; culture = mp.owner ? `zin_${mp.owner}_gfx` : ''; }
    else if (b0.people) people = [b0.people];
    const replacedFile = files.find(x => vanilla.hasInstalled(x.rel));
    records.push({
      id, family: b0.family, kind: b0.kind, subject: b0.key, files: fileRows, sprites, bound_by: b0.bound_by, source,
      owner_spec: families.specs[b0.family] ?? '', people, culture, region: '', tier: '', gate: '', uniqueness_group: b0.group,
      perceptual, state: 'shipped', reach: b0.reach ?? 'visible', replaces: replacedFile ? replacedFile.rel : '', inventory_rows: [],
    });
  }
  records.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { version: MANIFEST_VERSION, generator: 'tools/content/modules/assets.mjs', note: 'One record per shipped asset (05_asset_manifest.md section 2). Planned, generated and accepted-but-unshipped assets, kept vanilla assets and hidden features are not recorded yet: they need inventory.json.', records };
}

const IMAGE_EXTS_HAVE = ext => ext === 'dds' || ext === 'tga' || ext === 'png' || ext === 'bmp';
function IMAGE_FRAMES(A, rel, spriteNames) {
  if (!IMAGE_EXTS_HAVE(rel.slice(rel.lastIndexOf('.') + 1))) return 0;
  let frames = 1;
  for (const n of spriteNames) for (const d of A.g.sprites.get(n) ?? []) if (d.frames > frames) frames = d.frames;
  return frames;
}

export function summarize(manifest, text) {
  const byFamily = {}, byState = {}, byRoute = {};
  let files = 0, bytes = 0;
  for (const r of manifest.records) {
    const fam = byFamily[r.family] ?? (byFamily[r.family] = { records: 0, files: 0, bytes: 0 });
    fam.records++; byState[r.state] = (byState[r.state] ?? 0) + 1; byRoute[r.source.route] = (byRoute[r.source.route] ?? 0) + 1;
    for (const f of r.files) { fam.files++; fam.bytes += f.bytes; files++; bytes += f.bytes; }
  }
  return { version: MANIFEST_VERSION, records: manifest.records.length, files, bytes, byFamily, byState, byRoute, manifestSha256: sha256(Buffer.from(text)) };
}

// The build step: manifest, check, baseline gate. `staged` is the builder's Staged; the two manifest files are added to it.
export async function buildAssets(staged, { root = ZIN, game = GAME, phase = Number(process.env.ZIN_ASSET_PHASE ?? 1), baselineFile = BASELINE_FILE, log = msg => process.stderr.write(`${msg}\n`), cachePath, tables, update = process.env.ZIN_ASSETS_UPDATE_BASELINE === '1' } = {}) {
  const ctx = loadAssetContext({ root, staged: staged.files, game, phase, ...(cachePath !== undefined ? { cachePath } : {}), ...(tables ? { tables } : {}) });
  const A = analyze(ctx);
  const manifest = buildManifest(ctx, A);
  const report = runChecks(ctx, A, manifest);
  ctx.cache.save();
  const text = canonicalJson(manifest);
  staged.add(MANIFEST_FILE, Buffer.from(text));
  const summary = { ...summarize(manifest, text), check: { bySeverity: report.bySeverity, references: report.counts.references, unresolved: report.counts.unresolved, orphans: report.counts.orphans } };
  staged.add(SUMMARY_FILE, Buffer.from(canonicalJson(summary)));
  log(summaryText(report));
  const baseline = readBaseline(baselineFile);
  if (update) { writeJsonAtomic(baselineFile, baselineOf(report)); log(`assets: baseline rewritten (${baselineFile})`); return { summary, report, fresh: [], fixed: [], updated: true }; }
  const fresh = newFindings(report, baseline), fixed = fixedFindings(report, baseline);
  const warnings = report.findings.filter(f => f.severity === 'warning' && !(baseline?.findings ?? []).some(b => b.key === f.key));
  for (const w of warnings.slice(0, 10)) log(`assets warning ${w.code} ${w.path}: ${w.message}`);
  if (warnings.length > 10) log(`assets: ${warnings.length - 10} more new warnings (see the report)`);
  if (fixed.length) log(`assets: ${fixed.length} baseline findings are fixed; regenerate the baseline to drop them`);
  if (fresh.length) {
    for (const f of fresh.slice(0, 40)) log(`assets ERROR ${f.code} ${f.path}: ${f.message}`);
    throw new Error(`assets: ${fresh.length} new errors not in the baseline (docs/design/validation/asset_baseline.json). Fix them, or accept them with ZIN_ASSETS_UPDATE_BASELINE=1 node tools/content/build.mjs.`);
  }
  return { summary, report, fresh, fixed, updated: false };
}
