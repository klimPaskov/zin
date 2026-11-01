// Focus art (UI overhaul lane I4; plan in docs/plans/ui_overhaul/handoffs/I4_plan.md). Every focus has its own picture (K69):
// one Chronicle plate per focus, and one plate per genuinely general group (icon_shares.json, general_focus; design system §4.5).
// The plate is ink-engraved on vellum in a slate ring (design system §4.2, Chronicle focus plaque, 100 × 88), cut from a
// gpt-6-luna sheet of 12 (4 × 3) medallions on black. The cell map tools/content/data/focus_art_cells.json lists every sheet in
// production order with its status. Only an "accepted" sheet is cut and shipped, and only when its generation has a review line
// in the provenance log; the compiler then names the per-focus sprite for the focuses on that sheet. Every other focus keeps its
// catalogue icon, so the build stays whole while the trees are replaced one by one (an accepted sheet with no art fails the build).
//
//   focusIconKey(treeId, focusKey)      the sprite key of a focus: general groups share general_<slug>, else <tree>_<focus key>
//   focusArtAccepted(treeId, focusKey)  true when the focus's sheet is accepted (the compiler uses the per-focus sprite)
//   planFocusSheets(trees, order)       the sheets in production order (12 per sheet, one tree per run of sheets)
//   buildFocusArt(staged, opts)         cuts the accepted sheets into DDS plates and writes the two sprite files
//   CLI: node tools/content/modules/focus_art.mjs plan                  rewrites the cell map (existing sheet status is kept)
//        node tools/content/modules/focus_art.mjs jobs <tree> <jobs.json>  imagegen jobs for a tree's planned sheets
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ART, rawFile, provenanceFile } from '../lib/paths.mjs';
import { findRegionsAdaptive } from '../lib/sheets.mjs';
import { fromRaw, dds } from '../lib/raster.mjs';
import { acceptance } from './presentation.mjs';

const sha256 = b => createHash('sha256').update(b).digest('hex');
const here = path.dirname(fileURLToPath(import.meta.url));
export const CELLS_FILE = path.join(here, '..', 'data', 'focus_art_cells.json');
export const SUBJECTS_FILE = path.join(here, '..', 'data', 'focus_art_subjects.json');
export const SHARES_FILE = path.join(here, '..', 'data', 'ui', 'icon_shares.json');
export const FOCUS_DIR = 'gfx/interface/goals/zin/focus';
export const FOCUS_W = 100, FOCUS_H = 88, PAD_X = 6, INSET = 2, PER_SHEET = 12, COLS = 4;
export const MAJOR_ORDER = ['aenor', 'lerendor', 'magical_forest', 'worshipdom', 'mirolon', 'goldoroth', 'gala', 'gunwaith', 'noris', 'coldor', 'volgan', 'stabilo', 'zol'];

// ------------------------------------------------------------------------------------------------ keys and acceptance
// Focus id of a focus (the name the engine and the share list use): zin_<tree>_<focus key>.
export const focusId = (treeId, focusKey) => `zin_${treeId}_${focusKey}`;

// Focus id -> general group key (general_<slug>), from the general_focus entries of icon_shares.json.
export function generalGroups(shares) {
  const out = new Map();
  for (const s of shares.shares ?? []) {
    if (s.kind !== 'general_focus') continue;
    const key = s.id.replace(/^general_focus:/, 'general_');
    for (const c of s.concepts) out.set(c.replace(/^focus:/, ''), key);
  }
  return out;
}
const SHARES = existsSync(SHARES_FILE) ? generalGroups(JSON.parse(readFileSync(SHARES_FILE, 'utf8'))) : new Map();

// The tree id and the focus key are joined by a double underscore, so no key can read as a culture or tag id (the roster migration
// renames single-underscore culture ids; a focus key must not carry one).
export function focusIconKey(treeId, focusKey, groups = SHARES) {
  return groups.get(focusId(treeId, focusKey)) ?? `${treeId}__${focusKey}`;
}

const CELLS = existsSync(CELLS_FILE) ? JSON.parse(readFileSync(CELLS_FILE, 'utf8')) : { sheets: [] };
const ACCEPTED = new Set(CELLS.sheets.filter(s => s.status === 'accepted').flatMap(s => s.keys));
// True when the focus's picture is accepted: the compiler then names the per-focus sprite instead of the catalogue key.
export const focusArtAccepted = (treeId, focusKey) => ACCEPTED.has(focusIconKey(treeId, focusKey));
export const focusSpriteName = key => `GFX_focus_zin_${key}`;
// Every accepted picture key (the sprites a per-focus icon line may name).
export const focusArtAcceptedKeys = () => new Set(ACCEPTED);
// The picture keys the compiler named in this build: only these plates are cut and shipped (a plate nothing names is not shipped).
const USED = new Set();
export const resetFocusPlates = () => USED.clear();
export const noteFocusPlate = key => USED.add(key);

// ------------------------------------------------------------------------------------------------ plan
// Production order: the major trees first (the lead's list plus volgan, stabilo and zol), then regional, then shared, each alphabetical.
export function productionOrder(treeIds) {
  const ids = [...treeIds];
  const major = MAJOR_ORDER.filter(t => ids.includes(t));
  const rest = ids.filter(t => !major.includes(t));
  return [...major, ...rest.filter(t => t.startsWith('regional_')).sort(), ...rest.filter(t => !t.startsWith('regional_')).sort()];
}

// trees: [{ id, focuses: [{ key }] }] in file order. Returns the sheets: one picture per focus, a general group once (at its first member
// in production order), 12 pictures per sheet and per tree, sheet names focus-<tree>-<nn>.
export function planFocusSheets(trees, groups = SHARES) {
  const byId = new Map(trees.map(t => [t.id, t]));
  const seen = new Set(), sheets = [];
  for (const id of productionOrder(byId.keys())) {
    const t = byId.get(id), keys = [];
    for (const f of t.focuses) {
      const key = focusIconKey(t.id, f.key, groups);
      if (key.startsWith('general_')) { if (seen.has(key)) continue; seen.add(key); }
      keys.push(key);
    }
    for (let i = 0, nn = 1; i < keys.length; i += PER_SHEET, nn++) {
      const chunk = keys.slice(i, i + PER_SHEET);
      sheets.push({ sheet: `focus-${t.id}-${String(nn).padStart(2, '0')}`, tree: t.id, method: 'medallion', cols: COLS, rows: Math.ceil(chunk.length / COLS), keys: chunk, status: 'planned' });
    }
  }
  return sheets;
}

// The focus trees of docs/design/focus (file order), for the planner and the CLI.
export function readFocusTrees(dir = path.join(here, '..', '..', '..', 'docs', 'design', 'focus')) {
  return readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => {
    const d = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
    return { id: d.id, focuses: d.focuses.map(x => ({ key: x.key, name: x.name })) };
  });
}

// Rewrites the cell map. A sheet that keeps its name and keys keeps its status (accepted sheets stay accepted).
export function writeCellMap(sheets, file = CELLS_FILE) {
  const old = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { sheets: [] };
  const prior = new Map(old.sheets.map(s => [s.sheet, s]));
  const merged = sheets.map(s => {
    const p = prior.get(s.sheet);
    return p && JSON.stringify(p.keys) === JSON.stringify(s.keys) ? { ...s, status: p.status, ...(p.review ? { review: p.review } : {}) } : s;
  });
  const cells = {
    source: 'Layouts of the focus icon sheets (art store raw/focus/<sheet>.png, generated with gpt-6-luna). Numbers and ids only; the builder reads this file and the accepted sheets (tools/content/modules/focus_art.mjs). A focus keeps its catalogue icon until its sheet is accepted.',
    complete: merged.every(s => s.status === 'accepted'),
    sheets: merged,
  };
  writeFileSync(file, JSON.stringify(cells, null, 1) + '\n');
  return cells;
}

// ------------------------------------------------------------------------------------------------ imagegen jobs
const STYLE = 'Monochrome hand-engraved medieval ink line illustration in one consistent style for a fantasy grand-strategy game\'s national focus icons: only dark sepia-black ink lines (fine parallel hatching and cross-hatching) on a flat cream vellum disc, one even line weight. No painting, no colour fills, no gold, no red, no blue, no photographic texture, no colour gradients, no shading by colour. Keep the engraved lines bold enough to read at 88 pixels tall. ';
const LAYOUT = (n, cols, rows) => `An asset sheet of ${n} focus icons, in a wide 3:2 landscape image, arranged in an exact grid of ${cols} columns and ${rows} rows, on a solid flat pure black (#000000) background with wide black gutters between the icons and a black margin at every edge: no glow, no blur, no vignette, no gradient, no texture in the background, no lettering, no numerals, no border around the whole sheet. Every icon is the same round medallion of identical size, about 80% of its grid cell height: a narrow ring of dull blue-grey slate with a thin bronze inlay line, around a cream vellum disc that fills the ring edge to edge, with the subject engraved in dark ink inside the disc as one bold, simple object or scene with a strong silhouette, centred, drawn from one side or one clear view. The icons are, read left to right and top to bottom, and the grid is filled in that order with no empty cell: `;
const CLOSE = 'No figure shows a face. No text, letters, numbers, runes, inscriptions, labels, logos, watermark, signature or maker\'s mark anywhere. No crosses and no real-world religious, national or political symbols. No modern objects: no firearms, gears, engines or machines. An original fantasy world: nothing from any existing film, book or game; nothing that resembles the Lord of the Rings (no elven spires, no white tree, no flaming eye, no ring inscriptions, no leaf-shaped banners).';

// Imagegen jobs for one tree's planned sheets. The subject of every picture comes from focus_art_subjects.json (keyed by icon key).
export function focusSheetJobs(sheets, subjects, rawDir) {
  return sheets.map(s => {
    const missing = s.keys.filter(k => !subjects.has(k));
    if (missing.length) throw new Error(`${s.sheet}: no subject for ${missing.join(', ')}`);
    const n = s.keys.length, listing = s.keys.map((k, i) => `${i + 1}) ${subjects.get(k)};`).join(' ');
    return {
      id: s.sheet, out: `${rawDir}/${s.sheet}.png`.replace(/\\/g, '/'), size: '1536x1024', quality: 'high', references: [],
      prompt: STYLE + LAYOUT(n, s.cols, s.rows) + listing + ' ' + CLOSE,
      check: { expected: n, cols: s.cols, rows: s.rows, aspect: [0.75, 1.33], minAreaFraction: 0.25 },
    };
  });
}

// ------------------------------------------------------------------------------------------------ cutting and shipping
// A round alpha mask: the circle of the medallion, antialiased at its rim (same form as the technology plates).
function roundMask(buf, w, h) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = ((x + 0.5) / w) * 2 - 1, dy = ((y + 0.5) / h) * 2 - 1, d = Math.sqrt(dx * dx + dy * dy);
    const a = d <= 0.97 ? 255 : d >= 1 ? 0 : Math.round(255 * (1 - d) / 0.03);
    buf[(y * w + x) * 4 + 3] = Math.min(buf[(y * w + x) * 4 + 3], a);
  }
  return buf;
}

// Cuts one accepted sheet into its focus plates: detection of the 12 (or fewer) medallions, the medallion fitted to the height,
// the circle alpha, and transparent margins to the 100 × 88 frame.
async function cutFocusSheet(file, sheet) {
  const n = sheet.keys.length;
  const r = await findRegionsAdaptive(file, n, { cols: sheet.cols, rows: sheet.rows, aspect: [0.75, 1.33], minAreaFraction: 0.25 });
  if (!r.ok) throw new Error(`${sheet.sheet}: found ${r.found ?? '?'} medallions, expected ${n}`);
  const pieces = [];
  for (const [i, key] of sheet.keys.entries()) {
    const b = r.regions[i];
    const m = await sharp(file).removeAlpha()
      .extract({ left: b.x0 + INSET, top: b.y0 + INSET, width: b.x1 - b.x0 - 2 * INSET, height: b.y1 - b.y0 - 2 * INSET })
      .resize(FOCUS_H, FOCUS_H, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 }, kernel: 'lanczos3' })
      .ensureAlpha().raw().toBuffer();
    const disc = roundMask(m, FOCUS_H, FOCUS_H);
    const framed = await sharp(disc, { raw: { width: FOCUS_H, height: FOCUS_H, channels: 4 } })
      .extend({ top: 0, bottom: 0, left: PAD_X, right: PAD_X, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha().raw().toBuffer();
    pieces.push({ key, buf: framed, cell: i });
  }
  return pieces;
}

const spriteBlock = (name, file) => `\tspriteType = {\n\t\tname = "${name}"\n\t\ttexturefile = "${file}"\n\t}`;
const shineBlock = (name, file) => {
  const anim = rot => `\t\tanimation = {\n\t\t\tanimationmaskfile = "${file}"\n\t\t\tanimationtexturefile = "gfx/interface/goals/shine_overlay.dds"\n\t\t\tanimationrotation = ${rot}\n\t\t\tanimationlooping = no\n\t\t\tanimationtime = 0.75\n\t\t\tanimationdelay = 0\n\t\t\tanimationblendmode = "add"\n\t\t\tanimationtype = "scrolling"\n\t\t\tanimationrotationoffset = { x = 0.0 y = 0.0 }\n\t\t\tanimationtexturescale = { x = 1.0 y = 1.0 }\n\t\t}`;
  return `\tSpriteType = {\n\t\tname = "${name}_shine"\n\t\ttexturefile = "${file}"\n\t\teffectFile = "gfx/FX/buttonstate.lua"\n${anim('-90.0')}\n${anim('90.0')}\n\t\tlegacy_lazy_load = no\n\t}`;
};
const gfxFile = (comment, blocks) => `# Generated by the ZIN content builder (modules/focus_art.mjs). ${comment}\nspriteTypes = {\n${blocks.join('\n')}\n}\n`;

// Writes the accepted focus plates (DDS, a8r8g8b8 like every ZIN picture) and their two sprite files into the staged tree.
// Returns the keys shipped. Throws when an accepted sheet has no raw picture or no accepted review line.
export async function buildFocusArt(staged, { cells = CELLS, provenance, warn = () => {} } = {}) {
  const prov = provenance ?? (existsSync(provenanceFile()) ? (await readFile(provenanceFile(), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l)) : []);
  const shipped = [], manifest = [], sources = new Map();
  for (const sheet of cells.sheets) {
    if (sheet.status !== 'accepted') continue;
    const rel = `focus/${sheet.sheet}.png`;
    let bytes;
    try { bytes = await readFile(rawFile(rel)); } catch { throw new Error(`accepted focus sheet ${sheet.sheet} has no raw picture (${rel})`); }
    const acc = acceptance(prov, rel, bytes);
    if (!acc.ok) throw new Error(`accepted focus sheet ${sheet.sheet}: ${acc.why}`);
    const pieces = (await cutFocusSheet(rawFile(rel), sheet)).filter(p => USED.has(p.key));
    if (!pieces.length) continue;
    // The accepted source sheet travels with the build (art/source/focus, like the technology sheets), so every plate traces to its generation.
    sources.set(`focus/${sheet.sheet}.png`, { bytes, sha: acc.sha });
    for (const p of pieces) {
      const out = `${FOCUS_DIR}/${p.key}.dds`, data = dds(fromRaw(p.buf, FOCUS_W, FOCUS_H));
      staged.add(out, data);
      shipped.push(p.key);
      manifest.push({ out, source: `art/source/focus/${sheet.sheet}.png`, sourceSha256: acc.sha, cell: p.cell, ops: ['detect medallion', `cut ${INSET}px inset`, `contain ${FOCUS_H}x${FOCUS_H}`, 'circle alpha', `pad ${PAD_X}px each side`], sha256: sha256(data) });
    }
  }
  for (const [rel, s] of [...sources].sort(([a], [b]) => a.localeCompare(b, 'en'))) staged.add(`art/source/${rel}`, s.bytes);
  if (shipped.length) {
    staged.text('interface/zin_focus_art.gfx', gfxFile('Focus plates of the Chronicle (one per focus, one per general group; lane I4).', shipped.map(k => spriteBlock(focusSpriteName(k), `${FOCUS_DIR}/${k}.dds`))));
    staged.text('interface/zin_focus_art_shine.gfx', gfxFile('Shine sprites of the focus plates (vanilla goals_shine.gfx structure).', shipped.map(k => shineBlock(focusSpriteName(k), `${FOCUS_DIR}/${k}.dds`))));
  }
  if (manifest.length) staged.add('art/source/focus_art_manifest.json', Buffer.from(JSON.stringify({ generator: 'tools/content/modules/focus_art.mjs', files: manifest.sort((a, b) => a.out.localeCompare(b.out, 'en')) }, null, 1) + '\n'));
  if (!cells.complete) warn(`focus art: ${shipped.length} plates shipped; the other focuses keep their catalogue icon`);
  return new Set(shipped);
}

// ------------------------------------------------------------------------------------------------ CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, tree, out] = process.argv.slice(2);
  if (cmd === 'plan') {
    const cells = writeCellMap(planFocusSheets(readFocusTrees()));
    console.log(JSON.stringify({ sheets: cells.sheets.length, accepted: cells.sheets.filter(s => s.status === 'accepted').length, pictures: cells.sheets.reduce((a, s) => a + s.keys.length, 0) }));
  } else if (cmd === 'preview') {
    // Review aid: cuts one raw sheet into its final-size plates and writes a contact sheet at 1x (the real size) and 3x.
    const sheetName = tree;
    const cells = JSON.parse(readFileSync(CELLS_FILE, 'utf8'));
    const sheet = cells.sheets.find(s => s.sheet === sheetName);
    if (!sheet) throw new Error(`no sheet ${sheetName} in the cell map`);
    const raw = rawFile(`focus/${sheetName}.png`);
    const pieces = await cutFocusSheet(raw, sheet);
    const dir = `${ART}/processed/focus`;
    mkdirSync(dir, { recursive: true });
    const gap = 8, cols = sheet.cols, rows = sheet.rows, W = cols * (FOCUS_W + gap) + gap, H = rows * (FOCUS_H + gap) + gap;
    for (const scale of [1, 3]) {
      const base = Buffer.alloc(W * H * 4);
      for (let i = 0; i < base.length; i += 4) { base[i] = 60; base[i + 1] = 62; base[i + 2] = 66; base[i + 3] = 255; }
      const comp = [];
      for (const p of pieces) {
        const c = p.cell % cols, r = Math.floor(p.cell / cols);
        const img = await sharp(p.buf, { raw: { width: FOCUS_W, height: FOCUS_H, channels: 4 } }).resize(FOCUS_W * scale, FOCUS_H * scale, { kernel: 'lanczos3' }).png().toBuffer();
        comp.push({ input: img, left: (gap + c * (FOCUS_W + gap)) * scale, top: (gap + r * (FOCUS_H + gap)) * scale });
      }
      await sharp(base, { raw: { width: W, height: H, channels: 4 } }).resize(W * scale, H * scale, { kernel: 'nearest' }).composite(comp).png().toFile(`${dir}/${sheetName}.contact-${scale}x.png`);
    }
    for (const p of pieces) await sharp(p.buf, { raw: { width: FOCUS_W, height: FOCUS_H, channels: 4 } }).png().toFile(`${dir}/${p.key}.png`);
    console.log(JSON.stringify({ sheet: sheetName, plates: pieces.length, dir }));
  } else if (cmd === 'jobs') {
    const { readFileSync: rf } = await import('node:fs');
    const cells = JSON.parse(rf(CELLS_FILE, 'utf8'));
    const subjects = new Map(JSON.parse(rf(SUBJECTS_FILE, 'utf8')).subjects.map(x => [x.key, x.subject]));
    const sheets = cells.sheets.filter(s => s.tree === tree && s.status !== 'accepted');
    if (!sheets.length) throw new Error(`no planned sheets for tree ${tree}`);
    const jobs = focusSheetJobs(sheets, subjects, `${ART}/raw/focus`);
    writeFileSync(out, JSON.stringify(jobs, null, 1) + '\n');
    console.log(JSON.stringify({ tree, jobs: jobs.map(j => j.id) }));
  } else {
    console.log('usage: focus_art.mjs plan | jobs <tree> <jobs.json>');
  }
}
