// UI review harness (UI overhaul step D5, docs/plans/ui_overhaul/02_plan.md; outside the build). One command builds the content, links
// the staged tree into a temporary preview mod, renders the audit's window set and the ZIN scenarios with hoi4.gui_render (and two focus
// trees with hoi4.focus_render), writes the contact sheets and the render metrics (check 19 text.render_metrics: contrast, ground noise,
// raw keys, overflow) from each render's layout JSON and full image, and deletes the preview and the tool's workspace storage again.
//
//   node tools/content/ui_review.mjs [options]
//     --staged <dir>        use an existing staged tree instead of building (default: build into <OS temp>/zin-ui-review/staged)
//     --keep-staged         keep the staged tree the harness built (default: deleted at the end; disk is tight)
//     --out <dir>           where sheets and metrics go (default docs/plans/ui_overhaul/renders/review)
//     --only <regex>        render only the labels that match (for example "^z_court" or "_1920$")
//     --sheets <a,b>        render only the rows of these contact sheets
//     --no-focus            skip the focus-tree renders
//     --keep-png            also copy every full render PNG and its layout JSON into <out>/png/ (default: sheets and metrics only)
//     --clients <n>         parallel MCP server processes (default 2)
//     --under-mod           put the preview under the HOI4 mod folder (as the audit did) instead of the private temp mod root
//     --runtime <dir>       hoi4-agent-tools runtime (default: the newest runtime-v* under %LOCALAPPDATA%/hoi4-agent-tools)
//
// The preview never gets a launcher entry: it is a bare folder with the staged descriptor.mod. By default the tool runs with a private
// server configuration (HOI4_AGENT_CONFIG) whose only mod root, state and workspace storage live in the OS temp folder, so nothing is
// copied into the OneDrive mod folder and the user's tool configuration is not touched; files are hard links into the staged tree, so the
// preview costs no disk. Each render's artifacts are deleted from the private workspace as soon as the PNG and layout are read.
// The vanilla windows are rendered from the staged tree, so they show the current build (the audit rendered them from the installed mod).
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, rmSync, linkSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { ZIN, GAME } from './lib/paths.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const slash = p => p.split(path.sep).join('/');
const WINDOWS_FILE = path.join(here, 'data/ui/review_windows.json');
const DESIGN_FILE = path.join(here, 'data/ui/design_system.json');
export const PREVIEW_NAME = 'zin_ui_preview';
// Thresholds of design system §2.2 (rules 2 and 4).
export const MIN_TEXT_PX = 16;
export const CONTRAST_SMALL = 4.5, CONTRAST_LARGE = 3, LARGE_PX = 20, GROUND_LIMIT = 0.06;

// ---------------------------------------------------------------------------------------------------- tasks
export function reviewTasks(spec = JSON.parse(readFileSync(WINDOWS_FILE, 'utf8')), { only, sheets } = {}) {
  const skip = spec.skip.map(s => new RegExp(s)), keep = only ? new RegExp(only) : null;
  const rows = sheets ? new Set(sheets.flatMap(id => spec.sheets[id]?.rows ?? [])) : null;
  const tasks = [];
  const push = (label, window, scenario, cols) => {
    for (const col of cols) {
      const l = `${label}_${col}`, v = spec.variants[col];
      if (skip.some(r => r.test(l)) || (keep && !keep.test(l))) continue;
      tasks.push({ label: l, row: label, col, window, states: v.states ?? [], resolution: { width: v.width, height: v.height, uiScale: v.uiScale }, scenario: { id: l, resolution: { width: v.width, height: v.height }, uiScale: v.uiScale, ...spec.base, ...scenario } });
    }
  };
  for (const w of spec.vanilla) if (!rows || rows.has(w)) push(`v_${w}`, w, {}, spec.columns.vanilla);
  for (const z of spec.zin) if (!rows || rows.has(z.label)) push(z.label, z.window, z.scenario, spec.columns.zin);
  return tasks;
}

// ---------------------------------------------------------------------------------------------------- metrics (check 19)
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
export const relLum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export const contrastRatio = (a, b) => { const x = relLum(...a), y = relLum(...b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const alphaOf = h => { const m = /^#?[0-9a-f]{6}([0-9a-f]{2})$/i.exec(h ?? ''); return m ? parseInt(m[1], 16) : null; };
const hexRgb = h => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(h ?? ''); return m ? [1, 2, 3].map(i => parseInt(m[i], 16)) : null; };
// A visible line that is a localisation key, an engine key or an unresolved token.
export const RAW_KEY = /^\s*(?:[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)+|[A-Z][A-Z0-9]{3,}(?:_[A-Z0-9]+)*)\s*$/;
export function rawKey(text) { return RAW_KEY.test(text) || /\[dynamic_loc\]|\$[A-Za-z_]+\$|\[[A-Za-z_]+\.[A-Za-z_]+\]/.test(text); }
// image: { data (RGB or RGBA), width, height, channels }. layout: the parsed -layout.json. Returns findings per text element.
export function textMetrics(layout, image) {
  const out = { texts: 0, contrast: [], ground: [], rawKeys: [], overflow: [], small: [] }, ch = image.channels;
  for (const e of layout.scene?.elements ?? []) {
    const t = e.text;
    if (!t || !e.visible || !String(t.text ?? '').trim()) continue;
    const r = e.rect, x0 = Math.max(0, Math.floor(r.x)), y0 = Math.max(0, Math.floor(r.y)), x1 = Math.min(image.width, Math.ceil(r.x + r.width)), y1 = Math.min(image.height, Math.ceil(r.y + r.height));
    if (x1 - x0 < 2 || y1 - y0 < 2) continue;
    out.texts++;
    const name = e.name ?? e.id, where = `${e.location?.path ?? e.sourcePath}:${e.location?.start?.line ?? '?'}`;
    if ((t.lines ?? [t.text]).some(rawKey) || (t.unresolvedTokens ?? []).length) out.rawKeys.push({ name, where, text: String(t.text).slice(0, 80) });
    // text.size (design system §2.2 rule 1): nothing under 16 px at UI scale 1 (lane C2).
    if ((t.fontSize ?? 16) < MIN_TEXT_PX) out.small.push({ name, where, text: String(t.text).slice(0, 60), px: t.fontSize });
    if (t.overflowX || t.overflowY) out.overflow.push({ name, where, text: String(t.text).slice(0, 80), x: !!t.overflowX, y: !!t.overflowY });
    const fg = hexRgb(t.colour);
    if (!fg) continue;
    // Background: the box with the text masked, as design system §2.2 rule 4 asks. Glyph pixels and their anti-aliased edges lie between
    // the text colour and the ground, so the mask drops every pixel within 60 levels of the text colour and then the 30% of the remaining
    // pixels nearest to it; what is left is the ground the text sits on.
    const px = [];
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const o = (y * image.width + x) * ch, p = [image.data[o], image.data[o + 1], image.data[o + 2]], d = Math.abs(p[0] - fg[0]) + Math.abs(p[1] - fg[1]) + Math.abs(p[2] - fg[2]);
      if (d >= 60) px.push([d, p]);
    }
    px.sort((a, b) => b[0] - a[0]);
    const ground = px.slice(0, Math.max(1, Math.ceil(px.length * 0.7)));
    let n = 0, sr = 0, sg = 0, sb = 0, sl = 0, sq = 0;
    for (const [, p] of px.length ? ground : []) { const l = (0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255; n++; sr += p[0]; sg += p[1]; sb += p[2]; sl += l; sq += l * l; }
    if (!n) continue;
    // A text colour with alpha (#rrggbbaa) is drawn blended over its ground: the contrast is that of the blend.
    const bg = [sr / n, sg / n, sb / n], alpha = (alphaOf(t.colour) ?? 255) / 255, seen = fg.map((c, i) => c * alpha + bg[i] * (1 - alpha)), ratio = contrastRatio(seen, bg), need = (t.fontSize ?? 16) >= LARGE_PX ? CONTRAST_LARGE : CONTRAST_SMALL, sd = Math.sqrt(Math.max(0, sq / n - (sl / n) ** 2));
    if (ratio < need) out.contrast.push({ name, where, text: String(t.text).slice(0, 60), ratio: Math.round(ratio * 100) / 100, need, fg: t.colour, bg: '#' + bg.map(v => Math.round(v).toString(16).padStart(2, '0')).join('') });
    if (sd > GROUND_LIMIT) out.ground.push({ name, where, text: String(t.text).slice(0, 60), std: Math.round(sd * 1000) / 1000 });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------- contact sheets
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
export async function contactSheet(pngOf, { title, rows, cols, file, tool }) {
  const TW = 560, TH = 315, LH = 22, PAD = 8, W = PAD + cols.length * (TW + PAD), H = 40 + rows.length * (TH + LH + PAD);
  const comps = [{ input: Buffer.from(`<svg width="${W}" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#101418"/><text x="10" y="26" font-family="Arial" font-size="18" fill="#e8e0d0">${esc(title)} - offline render, tool-generated (${esc(tool)})</text></svg>`), left: 0, top: 0 }];
  let y = 40;
  for (const row of rows) {
    for (let i = 0; i < cols.length; i++) {
      const x = PAD + i * (TW + PAD), label = `${row}_${cols[i]}`, png = pngOf(label);
      comps.push({ input: Buffer.from(`<svg width="${TW}" height="${LH}" xmlns="http://www.w3.org/2000/svg"><text x="2" y="16" font-family="Arial" font-size="13" fill="#c8c0b0">${esc(label)}</text></svg>`), left: x, top: y });
      comps.push(png ? { input: await sharp(png).resize(TW, TH, { fit: 'contain', background: '#000' }).png().toBuffer(), left: x, top: y + LH }
        : { input: Buffer.from(`<svg width="${TW}" height="${TH}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#2a1a1a"/><text x="10" y="30" font-family="Arial" font-size="14" fill="#e08070">no render</text></svg>`), left: x, top: y + LH });
    }
    y += TH + LH + PAD;
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: '#181c20' } }).composite(comps).png({ compressionLevel: 9 }).toFile(file);
  return { file, width: W, height: H };
}

// ---------------------------------------------------------------------------------------------------- preview and server
const link = (src, dst) => {
  if (statSync(src).isDirectory()) { mkdirSync(dst, { recursive: true }); for (const n of readdirSync(src)) link(path.join(src, n), path.join(dst, n)); return; }
  try { linkSync(src, dst); } catch { copyFileSync(src, dst); }
};
// The parts of the staged tree the window renders read (the audit's selection).
export const PREVIEW_PARTS = ['interface', 'gfx', 'localisation', 'common', 'events', 'portraits', 'descriptor.mod'];
export function makePreview(staged, modRoot) {
  const dir = path.join(modRoot, PREVIEW_NAME);
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const p of PREVIEW_PARTS) if (existsSync(path.join(staged, p))) link(path.join(staged, p), path.join(dir, p));
  return dir;
}
export function newestRuntime(base = path.join(process.env.LOCALAPPDATA ?? path.join(os.homedir(), 'AppData/Local'), 'hoi4-agent-tools')) {
  const v = n => (/^runtime-v(\d+)$/.exec(n)?.[1] ?? '').padStart(6, '0');
  const all = existsSync(base) ? readdirSync(base).filter(n => /^runtime-v\d+$/.test(n)).sort((a, b) => (v(a) < v(b) ? -1 : 1)) : [];
  if (!all.length) throw new Error(`no hoi4-agent-tools runtime under ${base}`);
  return path.join(base, all.at(-1), 'node_modules/hoi4-agent-tools');
}
async function connect(rt, env, cwd) {
  const sdk = path.join(rt, 'node_modules/@modelcontextprotocol/sdk/dist/esm');
  const { Client } = await import(pathToFileURL(path.join(sdk, 'client/index.js')).href);
  const { StdioClientTransport } = await import(pathToFileURL(path.join(sdk, 'client/stdio.js')).href);
  const client = new Client({ name: 'zin-ui-review', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(rt, 'dist/bin/stdio.js')], env: { ...process.env, ...env }, cwd, stderr: 'ignore' }));
  return client;
}
const call = (client, name, args) => client.callTool({ name, arguments: args }, undefined, { timeout: 1_800_000, resetTimeoutOnProgress: true });
// An artifact URI is hoi4-agent://workspace/<ws>/artifact/<sha>/<sha2>/<file>; the file lives under <storage>/<ws>/artifacts/<sha[0..2]>/<sha>/.
const artifactDir = (storage, a) => { const m = /workspace\/([^/]+)\/artifact\/([0-9a-f]+)\//.exec(a.uri ?? ''); return m ? path.join(storage, m[1], 'artifacts', m[2].slice(0, 2), m[2]) : null; };
const artifactFile = (storage, a) => {
  const d = artifactDir(storage, a);
  if (!d || !existsSync(d)) return null;
  const names = readdirSync(d), f = names.find(n => n === a.name) ?? names.find(n => !n.includes('.manifest.'));
  return f ? path.join(d, f) : null;
};

// ---------------------------------------------------------------------------------------------------- main
function args(argv) {
  const o = { clients: 2, focus: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], next = () => argv[++i];
    if (a === '--staged') o.staged = next(); else if (a === '--keep-staged') o.keepStaged = true; else if (a === '--out') o.out = next();
    else if (a === '--only') o.only = next(); else if (a === '--sheets') o.sheets = next().split(','); else if (a === '--no-focus') o.focus = false;
    else if (a === '--keep-png') o.keepPng = true; else if (a === '--clients') o.clients = Math.max(1, Number(next())); else if (a === '--under-mod') o.underMod = true;
    else if (a === '--runtime') o.runtime = next(); else throw new Error(`unknown option ${a}`);
  }
  return o;
}

async function main() {
  const o = args(process.argv.slice(2)), t0 = Date.now(), log = s => console.log(`[${Math.round((Date.now() - t0) / 1000)}s] ${s}`);
  const work = path.join(os.tmpdir(), 'zin-ui-review'), out = path.resolve(o.out ?? path.join(ZIN, 'docs/plans/ui_overhaul/renders/review'));
  mkdirSync(work, { recursive: true }); mkdirSync(out, { recursive: true });
  let staged = o.staged ? path.resolve(o.staged) : path.join(work, 'staged'), built = false;
  const cleanup = [];
  try {
    if (!o.staged) { log(`building into ${staged}`); execFileSync(process.execPath, [path.join(here, 'build.mjs'), staged], { stdio: ['ignore', 'ignore', 'inherit'] }); built = true; }
    if (!existsSync(path.join(staged, 'interface'))) throw new Error(`${staged} is not a staged tree`);
    const rt = o.runtime ? path.resolve(o.runtime) : newestRuntime(), version = JSON.parse(readFileSync(path.join(rt, 'package.json'), 'utf8')).version, tool = `hoi4.gui_render ${version}`;
    // Mod root, server state and workspace storage: private under the temp folder unless --under-mod.
    const modRoot = o.underMod ? path.resolve(ZIN, '..') : path.join(work, 'mods'), storage = path.join(work, 'workspaces'), state = path.join(work, 'state');
    const preview = makePreview(staged, modRoot); cleanup.push(preview);
    if (!o.underMod) cleanup.push(modRoot);
    cleanup.push(storage, state);
    const cfgFile = path.join(work, 'config.json');
    writeFileSync(cfgFile, JSON.stringify({ version: 1, serverStateRoot: state, modRoots: [modRoot], gameRoot: GAME.replace(/\//g, '\\'), workspaceStorageRoot: storage }));
    cleanup.push(cfgFile);
    log(`preview ${slash(preview)} (hard links), runtime ${version}`);

    const spec = JSON.parse(readFileSync(WINDOWS_FILE, 'utf8')), design = JSON.parse(readFileSync(DESIGN_FILE, 'utf8'));
    const tasks = reviewTasks(spec, o), pngDir = path.join(work, 'png'); mkdirSync(pngDir, { recursive: true }); cleanup.push(pngDir);
    const results = [];
    const worker = async () => {
      const client = await connect(rt, { HOI4_AGENT_CONFIG: cfgFile }, preview);
      try {
        for (let t = tasks.shift(); t; t = tasks.shift()) {
          const s0 = Date.now(), res = { label: t.label, window: t.window, width: t.resolution.width, height: t.resolution.height, states: t.states, theme: design.windowThemes?.[t.window] ?? null };
          try {
            const r = await call(client, 'hoi4.gui_render', { workspaceId: PREVIEW_NAME, windowName: t.window, scenario: t.scenario, states: t.states, resolutions: [t.resolution], generatedScenarios: { enabled: false } });
            const sc = r.structuredContent ?? {}, arts = sc.artifacts ?? [];
            res.status = sc.status; res.code = sc.code; res.isError = !!r.isError;
            res.diagnostics = {}; for (const d of sc.diagnostics ?? []) res.diagnostics[d.code] = (res.diagnostics[d.code] ?? 0) + 1;
            const full = arts.find(a => a.name.endsWith('-full.png')), lay = arts.find(a => a.name.endsWith('-layout.json'));
            const fullFile = full && artifactFile(storage, full), layFile = lay && artifactFile(storage, lay);
            if (fullFile) { res.sha256 = full.sha256; copyFileSync(fullFile, path.join(pngDir, `${t.label}-full.png`)); }
            if (fullFile && layFile) {
              const layout = JSON.parse(readFileSync(layFile, 'utf8')), img = await sharp(readFileSync(fullFile)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
              res.metrics = textMetrics(layout, { data: img.data, width: img.info.width, height: img.info.height, channels: img.info.channels });
              if (o.keepPng) { mkdirSync(path.join(out, 'png'), { recursive: true }); copyFileSync(fullFile, path.join(out, 'png', `${t.label}-full.png`)); copyFileSync(layFile, path.join(out, 'png', `${t.label}-layout.json`)); }
            }
            for (const a of arts) { const d = artifactDir(storage, a); if (d && existsSync(d)) rmSync(d, { recursive: true, force: true }); }
          } catch (e) { res.isError = true; res.error = String(e.message ?? e).slice(0, 400); }
          res.seconds = Math.round((Date.now() - s0) / 1000);
          results.push(res);
          log(`${t.label} ${res.status ?? 'error'} ${res.seconds}s (${tasks.length} left)`);
        }
      } finally { await client.close(); }
    };
    await Promise.all(Array.from({ length: Math.min(o.clients, tasks.length || 1) }, worker));

    // Focus trees (hoi4.focus_render schematics of two trees, as in the audit).
    const focus = [];
    if (o.focus && !o.only) {
      const client = await connect(rt, { HOI4_AGENT_CONFIG: cfgFile }, preview);
      try {
        for (const f of spec.focusTrees) {
          try {
            const r = await call(client, 'hoi4.focus_render', { workspaceId: PREVIEW_NAME, relativePath: f.relativePath, treeId: f.treeId, reviewScale: 0.5 });
            const a = (r.structuredContent?.artifacts ?? []).find(x => x.name.endsWith('.png')), file = a && artifactFile(storage, a);
            if (file) { copyFileSync(file, path.join(out, `${f.label}_focus_render.png`)); focus.push({ label: f.label, sha256: a.sha256 }); } else focus.push({ label: f.label, error: 'no PNG artifact' });
          } catch (e) { focus.push({ label: f.label, error: String(e.message ?? e).slice(0, 200) }); }
        }
      } finally { await client.close(); }
    }

    // Contact sheets.
    const pngOf = label => { const p = path.join(pngDir, `${label}-full.png`); return existsSync(p) ? p : null; };
    const sheets = [];
    for (const [id, sh] of Object.entries(spec.sheets)) {
      if (o.sheets && !o.sheets.includes(id)) continue;
      const rows = sh.kind === 'vanilla' ? sh.rows.map(w => `v_${w}`) : sh.rows;
      if (!rows.some(r => results.some(x => x.label.startsWith(`${r}_`)))) continue;
      sheets.push(await contactSheet(pngOf, { title: id, rows, cols: spec.columns[sh.kind], file: path.join(out, `${id}.png`), tool }));
    }
    // Metrics: the per-render report and a summary in Markdown.
    results.sort((a, b) => (a.label < b.label ? -1 : 1));
    const total = k => results.reduce((n, r) => n + (r.metrics?.[k]?.length ?? 0), 0);
    const summary = { tool, runtime: slash(rt), staged: slash(staged), renders: results.length, errors: results.filter(r => r.isError).length, thresholds: { contrastSmall: CONTRAST_SMALL, contrastLarge: CONTRAST_LARGE, largePx: LARGE_PX, ground: GROUND_LIMIT }, totals: { texts: results.reduce((n, r) => n + (r.metrics?.texts ?? 0), 0), contrast: total('contrast'), ground: total('ground'), rawKeys: total('rawKeys'), overflow: total('overflow'), small: total('small') }, sheets: sheets.map(s => path.basename(s.file)), focus };
    writeFileSync(path.join(out, 'metrics.json'), JSON.stringify({ ...summary, results }, null, 1) + '\n');
    const md = ['# UI review metrics', '', `Offline renders, tool-generated (${tool}); check 19 text.render_metrics of the design system (§2.2, §9). ${results.length} renders, ${summary.errors} errors. Thresholds: contrast ${CONTRAST_SMALL}:1 under ${LARGE_PX} px and ${CONTRAST_LARGE}:1 from ${LARGE_PX} px; ground deviation ${GROUND_LIMIT}. Engine-filled keys appear as raw keys in the offline model (audit §1, fidelity limits).`, '',
      `Totals: ${summary.totals.texts} text elements; contrast ${summary.totals.contrast}, ground ${summary.totals.ground}, raw keys ${summary.totals.rawKeys}, overflow ${summary.totals.overflow}, under 16 px ${summary.totals.small}.`, '',
      '| Render | Window | Theme | Size | Texts | Contrast | Ground | Raw keys | Overflow | Under 16 px | Diagnostics | PNG sha256 (first 12) |', '| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |',
      ...results.map(r => `| ${r.label} | \`${r.window}\` | ${r.theme ?? ''} | ${r.width}x${r.height} | ${r.metrics?.texts ?? ''} | ${r.metrics?.contrast.length ?? ''} | ${r.metrics?.ground.length ?? ''} | ${r.metrics?.rawKeys.length ?? ''} | ${r.metrics?.overflow.length ?? ''} | ${r.metrics?.small?.length ?? ''} | ${r.error ? `error: ${r.error.slice(0, 60)}` : Object.entries(r.diagnostics ?? {}).filter(([k]) => !/INLINE|STATE_COVERAGE/.test(k)).map(([k, v]) => `${k.replace(/^GUI_/, '')} ${v}`).join(', ')} | ${(r.sha256 ?? '').slice(0, 12)} |`)];
    writeFileSync(path.join(out, 'metrics.md'), md.join('\n') + '\n');
    log(`done: ${results.length} renders, ${sheets.length} sheets, metrics in ${slash(out)}`);
  } finally {
    for (const p of cleanup) if (existsSync(p)) rmSync(p, { recursive: true, force: true });
    if (built && !o.keepStaged) rmSync(staged, { recursive: true, force: true });
    log('preview, workspace storage and server state deleted');
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main().catch(e => { console.error(e.stack ?? e); process.exit(1); });
