// Idea art (UI overhaul lane I5; plan in docs/plans/ui_overhaul/handoffs/I5_plan.md). Every national spirit has its own picture
// (K69, design system §4.2: Chancery square idea frame, 64 × 64, painted emblem or object). A picture is drawn on a gpt-6-luna
// sheet of up to 12 square plates (4 columns × up to 3 rows, black ground), cut by detection, resized to 64 × 64 and shipped
// as DDS. The cell map tools/content/data/idea_art_cells.json lists every sheet with its status; only an "accepted" sheet is cut,
// and only when its generation has a review line in the provenance logs. The subjects tools/content/data/idea_art_subjects.json
// give the subject of each picture, keyed by picture key.
//
// Picture key: the idea id without its zin_ prefix (zin_aenor_seventeen_centuries -> aenor_seventeen_centuries). The idea writers
// keep their own `picture = zin_<x>` lines; applyIdeaArt rewrites the picture line of each idea whose picture is accepted to
// `picture = zin_<key>` (the sprite GFX_idea_zin_<key> in interface/zin_idea_art.gfx), once every idea file is staged.
//
//   ideaKey(id)                          the picture key of an idea id
//   planIdeaSheets(ideas, trees)         sheets in production order: major realms, other families, regional, shared (balanced 10-12 per sheet)
//   applyIdeaArt(staged, opts)           rewrites the picture lines of accepted ideas, cuts their plates, writes the sprite file
//   CLI: node tools/content/modules/idea_art.mjs plan                       rewrites the cell map (existing sheet status is kept)
//        node tools/content/modules/idea_art.mjs jobs <sheet>... <jobs.json>  imagegen jobs for the named planned sheets
//        node tools/content/modules/idea_art.mjs preview <sheet>             cuts one raw sheet and writes its contact sheets
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
export const CELLS_FILE = path.join(here, '..', 'data', 'idea_art_cells.json');
export const SUBJECTS_FILE = path.join(here, '..', 'data', 'idea_art_subjects.json');
export const CATALOG_FILE = path.join(here, '..', 'data', 'presentation-cells.json');
export const IDEA_DIR = 'gfx/interface/ideas/zin/picture';
export const IDEA_W = 64, IDEA_H = 64, INSET = 2, PER_SHEET = 12, COLS = 4;
export const GFX_FILE = 'interface/zin_idea_art.gfx';
// Major realms first (the same order as the focus lane), then the other families, the regional trees and the shared trees.
export const MAJOR_ORDER = ['aenor', 'lerendor', 'magical_forest', 'worshipdom', 'mirolon', 'goldoroth', 'gala', 'gunwaith', 'noris', 'coldor', 'volgan', 'stabilo', 'zol'];

// ------------------------------------------------------------------------------------------------ keys
export const ideaKey = id => id.replace(/^zin_/, '');
export const ideaSpriteName = key => `GFX_idea_zin_${key}`;
export const ideaPictureToken = key => `zin_${key}`;

// The family of an idea id: the longest focus tree id that its key starts with, else its first word ("other_<word>").
export function familyOf(id, trees = []) {
  const key = ideaKey(id);
  const tree = trees.filter(t => key === t || key.startsWith(t + '_')).sort((a, b) => b.length - a.length)[0];
  return tree ?? `other_${key.split('_')[0]}`;
}

// Production order over the families: MAJOR_ORDER, other families alphabetically, regional_* then shared_* alphabetically.
export function productionOrder(families) {
  const all = [...new Set(families)];
  const major = MAJOR_ORDER.filter(f => all.includes(f));
  const rest = all.filter(f => !major.includes(f));
  return [...major, ...rest.filter(f => !f.startsWith('regional_') && !f.startsWith('shared_')).sort(),
    ...rest.filter(f => f.startsWith('regional_')).sort(), ...rest.filter(f => f.startsWith('shared_')).sort()];
}

// Balanced chunks: n pictures in ceil(n / 12) sheets of near-equal size (61 -> 11, 10, 10, 10, 10, 10).
export function chunkSizes(n) {
  const k = Math.ceil(n / PER_SHEET), base = Math.floor(n / k), extra = n % k;
  return Array.from({ length: k }, (_, i) => base + (i < extra ? 1 : 0));
}

// ideas: [{ id }] (one per picture, in file order). Returns the sheets; a sheet lists its idea ids and picture keys in order.
export function planIdeaSheets(ideas, trees = []) {
  const byFamily = new Map();
  for (const x of ideas) {
    const f = familyOf(x.id, trees);
    if (!byFamily.has(f)) byFamily.set(f, []);
    byFamily.get(f).push(x.id);
  }
  const sheets = [];
  for (const f of productionOrder(byFamily.keys())) {
    const ids = byFamily.get(f);
    let at = 0;
    for (const [nn, size] of chunkSizes(ids.length).entries()) {
      const chunk = ids.slice(at, at += size);
      sheets.push({ sheet: `idea-${f}-${String(nn + 1).padStart(2, '0')}`, family: f, method: 'square', cols: COLS, rows: Math.ceil(chunk.length / COLS), ids: chunk, keys: chunk.map(ideaKey), status: 'planned' });
    }
  }
  return sheets;
}

// ------------------------------------------------------------------------------------------------ cell map
const CELLS = existsSync(CELLS_FILE) ? JSON.parse(readFileSync(CELLS_FILE, 'utf8')) : { sheets: [] };
const ACCEPTED_SHEETS = CELLS.sheets.filter(s => s.status === 'accepted');
// Rewrites the cell map. A sheet that keeps its name and keys keeps its status and review.
export function writeCellMap(sheets, file = CELLS_FILE) {
  const old = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { sheets: [] };
  const prior = new Map(old.sheets.map(s => [s.sheet, s]));
  const merged = sheets.map(s => {
    const p = prior.get(s.sheet);
    return p && JSON.stringify(p.keys) === JSON.stringify(s.keys) ? { ...s, status: p.status, ...(p.review ? { review: p.review } : {}) } : s;
  });
  const cells = {
    source: 'Layouts of the national spirit icon sheets (art store raw/idea/<sheet>.png, generated with gpt-6-luna). Ids and keys only; the builder reads this file and the accepted sheets (tools/content/modules/idea_art.mjs). An idea keeps its catalogue picture until its sheet is accepted.',
    complete: merged.every(s => s.status === 'accepted'),
    sheets: merged,
  };
  writeFileSync(file, JSON.stringify(cells, null, 1) + '\n');
  return cells;
}

// ------------------------------------------------------------------------------------------------ imagegen jobs
const STYLE = 'Painted miniature icons for a fantasy grand-strategy game\'s national spirit panel, one consistent hand-painted style: flat-lit gouache with clear dark outlines and simple painted shading, warm muted colours (walnut browns, vellum cream, madder red, dull gold, slate blue-grey, forest green), each picture one bold object or emblem with a strong silhouette, readable at 64 pixels. No photographic texture, no glow, no lens effects. ';
const LAYOUT = (n, cols, rows) => `An asset sheet of ${n} square icons, in a wide 3:2 landscape image, arranged in an exact grid of ${cols} columns and ${rows} rows, on a solid flat pure black (#000000) background with wide black gutters between the icons and a black margin at every edge: no glow, no vignette, no gradient, no texture in the background, no lettering, no numerals, no border around the whole sheet. Every icon is the same square plate of identical size, about 80% of its grid cell, with square corners, a walnut-brown ground and a thin muted bronze rim, and the subject painted in the centre of the plate as one bold object or emblem, seen from the front or in three-quarter view. The icons are, read left to right and top to bottom, and the grid is filled in that order with no empty cell: `;
const CLOSE = 'No figure shows a face; no human figure fills a plate. No text, letters, numbers, runes, inscriptions, labels, logos, watermark, signature or maker\'s mark anywhere. No crosses, no crossed objects that read as a cross, and no real-world religious, national or political symbols. No modern objects: no firearms, gears, engines or machines. An original fantasy world: nothing from any existing film, book or game; nothing that resembles the Lord of the Rings (no elven spires, no white tree, no flaming eye, no ring inscriptions).';

// Imagegen jobs for planned sheets. subjects: Map picture key -> subject text (from idea_art_subjects.json).
export function ideaSheetJobs(sheets, subjects, rawDir) {
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

// ------------------------------------------------------------------------------------------------ cutting
// One square plate: detection of the region, a 2 px inset, resized to 64 × 64 (opaque; the plate fills its frame).
async function cutIdeaSheet(file, sheet) {
  const n = sheet.keys.length;
  const r = await findRegionsAdaptive(file, n, { cols: sheet.cols, rows: sheet.rows, aspect: [0.75, 1.33], minAreaFraction: 0.25 });
  if (!r.ok) throw new Error(`${sheet.sheet}: found ${r.found ?? '?'} plates, expected ${n}`);
  const pieces = [];
  for (const [i, key] of sheet.keys.entries()) {
    const b = r.regions[i];
    const buf = await sharp(file).removeAlpha()
      .extract({ left: b.x0 + INSET, top: b.y0 + INSET, width: b.x1 - b.x0 - 2 * INSET, height: b.y1 - b.y0 - 2 * INSET })
      .resize(IDEA_W, IDEA_H, { fit: 'fill', kernel: 'lanczos3' })
      .ensureAlpha().raw().toBuffer();
    pieces.push({ key, buf, cell: i });
  }
  return pieces;
}

// ------------------------------------------------------------------------------------------------ wiring
// Finds the picture line of one idea block in a staged ideas file: the block is the brace-balanced body after `<id> = {`.
// Returns the rewritten text and whether the block was found.
export function rewriteIdeaPicture(text, id, key) {
  const head = new RegExp(`(^|[^A-Za-z0-9_])${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*=\\s*\\{`, 'm').exec(text);
  if (!head) return { text, found: false };
  const open = head.index + head[0].length - 1;
  let depth = 0, end = text.length;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && --depth === 0) { end = i; break; }
  }
  const body = text.slice(open, end), pic = /picture\s*=\s*[A-Za-z0-9_.]+/.exec(body);
  if (!pic) return { text, found: true, picture: false };
  const nb = body.slice(0, pic.index) + `picture = ${ideaPictureToken(key)}` + body.slice(pic.index + pic[0].length);
  return { text: text.slice(0, open) + nb + text.slice(end), found: true, picture: true };
}

// Accepted sheets: their idea id -> picture key map, plus the raw bytes checked against the provenance (same rule as focus_art).
async function acceptedPlates(cells, provenance) {
  const plates = new Map(), shipped = new Map();
  for (const sheet of cells.sheets) {
    if (sheet.status !== 'accepted') continue;
    const rel = `idea/${sheet.sheet}.png`;
    let bytes;
    try { bytes = await readFile(rawFile(rel)); } catch { throw new Error(`accepted idea sheet ${sheet.sheet} has no raw picture (${rel})`); }
    const acc = acceptance(provenance, rel, bytes);
    if (!acc.ok) throw new Error(`accepted idea sheet ${sheet.sheet}: ${acc.why}`);
    shipped.set(sheet.sheet, { rel, bytes, sha: acc.sha, sheet });
    sheet.ids.forEach((id, i) => plates.set(id, { key: sheet.keys[i], sheet: sheet.sheet, cell: i }));
  }
  return { plates, shipped };
}

// Rewrites the accepted ideas' picture lines in the staged ideas files, cuts the plates they use, writes the sprite file and the
// sources and manifest. Returns { rewritten, plates }. Uses staged.files directly (Staged.add refuses to replace a file).
export async function applyIdeaArt(staged, { cells = CELLS, provenance, warn = () => {} } = {}) {
  const prov = provenance ?? (existsSync(provenanceFile()) ? (await readFile(provenanceFile(), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l)) : []);
  const { plates, shipped } = await acceptedPlates(cells, prov);
  if (!plates.size) return { rewritten: 0, plates: 0 };
  const catalog = existsSync(CATALOG_FILE) ? new Set(JSON.parse(readFileSync(CATALOG_FILE, 'utf8')).icons.flatMap(s => s.keys)) : new Set();
  for (const [, p] of plates) if (catalog.has(p.key)) throw new Error(`idea picture key ${p.key} collides with the icon catalogue`);
  const used = new Map(), missing = new Set(plates.keys());
  for (const rel of [...staged.files.keys()].filter(k => /^common\/ideas\/.*\.txt$/.test(k)).sort()) {
    let text = staged.files.get(rel).toString('utf8'), changed = false;
    for (const [id, p] of plates) {
      const r = rewriteIdeaPicture(text, id, p.key);
      if (!r.found) continue;
      missing.delete(id);
      if (r.picture) { text = r.text; changed = true; used.set(id, p); }
    }
    if (changed) staged.files.set(rel, Buffer.from(text, 'utf8'));
  }
  // Plates of accepted ideas that no staged block names are not shipped; their ideas keep the catalogue picture.
  if (missing.size) warn(`idea art: ${missing.size} accepted ideas are not in the staged ideas files`);
  const bySheet = new Map();
  for (const [, p] of used) { if (!bySheet.has(p.sheet)) bySheet.set(p.sheet, []); bySheet.get(p.sheet).push(p); }
  const shippedKeys = [], manifest = [], sources = new Map();
  for (const [sheetName, list] of bySheet) {
    const s = shipped.get(sheetName), pieces = await cutIdeaSheet(rawFile(s.rel), s.sheet);
    sources.set(s.rel, s);
    for (const piece of pieces.filter(q => list.some(p => p.key === q.key))) {
      const out = `${IDEA_DIR}/${piece.key}.dds`, data = dds(fromRaw(piece.buf, IDEA_W, IDEA_H));
      staged.files.set(out, data);
      shippedKeys.push(piece.key);
      manifest.push({ out, source: `art/source/idea/${sheetName}.png`, sourceSha256: s.sha, cell: piece.cell, ops: ['detect plate', `cut ${INSET}px inset`, `fill ${IDEA_W}x${IDEA_H}`, 'dds a8r8g8b8'], sha256: sha256(data) });
    }
  }
  for (const [, s] of sources) staged.files.set(`art/source/${s.rel}`, s.bytes);
  shippedKeys.sort();
  if (shippedKeys.length) {
    const block = k => `\tspriteType = {\n\t\tname = "${ideaSpriteName(k)}"\n\t\ttexturefile = "${IDEA_DIR}/${k}.dds"\n\t}`;
    staged.files.set(`interface/${GFX_FILE}`, Buffer.from(`# Generated by the ZIN content builder (modules/idea_art.mjs). Idea pictures of the national spirits (lane I5, one per idea).\nspriteTypes = {\n${shippedKeys.map(block).join('\n')}\n}\n`, 'utf8'));
  }
  if (manifest.length) staged.files.set('art/source/idea_art_manifest.json', Buffer.from(JSON.stringify({ generator: 'tools/content/modules/idea_art.mjs', files: manifest.sort((a, b) => a.out.localeCompare(b.out, 'en')) }, null, 1) + '\n'));
  return { rewritten: used.size, plates: shippedKeys.length };
}

// ------------------------------------------------------------------------------------------------ CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...rest] = process.argv.slice(2);
  const focusTrees = () => readdirSync(path.join(here, '..', '..', '..', 'docs', 'design', 'focus')).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''));
  if (cmd === 'plan') {
    // National spirits and officer-corps spirits from the icon registry (laws are vanilla concepts and keep their vanilla pictures).
    const registry = JSON.parse(readFileSync(path.join(here, '..', 'data', 'ui', 'icon_registry.json'), 'utf8'));
    const ideas = registry.concepts.filter(c => c[0] === 'spirit' || c[0] === 'officer_spirit').map(c => ({ id: c[1] }));
    const cells = writeCellMap(planIdeaSheets(ideas, focusTrees()));
    console.log(JSON.stringify({ sheets: cells.sheets.length, accepted: cells.sheets.filter(s => s.status === 'accepted').length, pictures: cells.sheets.reduce((a, s) => a + s.keys.length, 0) }));
  } else if (cmd === 'preview') {
    const sheetName = rest[0];
    const cells = JSON.parse(readFileSync(CELLS_FILE, 'utf8'));
    const sheet = cells.sheets.find(s => s.sheet === sheetName);
    if (!sheet) throw new Error(`no sheet ${sheetName} in the cell map`);
    const pieces = await cutIdeaSheet(rawFile(`idea/${sheetName}.png`), sheet);
    const dir = `${ART}/processed/idea`;
    mkdirSync(dir, { recursive: true });
    const gap = 6, W = COLS * (IDEA_W + gap) + gap, H = sheet.rows * (IDEA_H + gap) + gap;
    for (const scale of [1, 3]) {
      const comp = [];
      for (const p of pieces) {
        const img = await sharp(p.buf, { raw: { width: IDEA_W, height: IDEA_H, channels: 4 } }).resize(IDEA_W * scale, IDEA_H * scale, { kernel: 'lanczos3' }).png().toBuffer();
        comp.push({ input: img, left: (gap + (p.cell % COLS) * (IDEA_W + gap)) * scale, top: (gap + Math.floor(p.cell / COLS) * (IDEA_H + gap)) * scale });
      }
      await sharp({ create: { width: W * scale, height: H * scale, channels: 3, background: { r: 60, g: 62, b: 66 } } }).composite(comp).png().toFile(`${dir}/${sheetName}.contact-${scale}x.png`);
    }
    console.log(JSON.stringify({ sheet: sheetName, plates: pieces.length, dir }));
  } else if (cmd === 'jobs') {
    const out = rest.pop(), names = rest;
    const cells = JSON.parse(readFileSync(CELLS_FILE, 'utf8'));
    const subjects = new Map(JSON.parse(readFileSync(SUBJECTS_FILE, 'utf8')).subjects.map(x => [x.key, x.subject]));
    const sheets = names.map(n => cells.sheets.find(s => s.sheet === n));
    if (sheets.some(s => !s || s.status === 'accepted')) throw new Error(`every named sheet must exist and be unaccepted: ${names.join(', ')}`);
    const jobs = ideaSheetJobs(sheets, subjects, `${ART}/raw/idea`);
    writeFileSync(out, JSON.stringify(jobs, null, 1) + '\n');
    console.log(JSON.stringify({ jobs: jobs.map(j => j.id) }));
  } else {
    console.log('usage: idea_art.mjs plan | preview <sheet> | jobs <sheet>... <jobs.json>');
  }
}
