// Decision seals (UI overhaul lane I11; plan and handoff in docs/plans/ui_overhaul/handoffs/I11.md). Every decision has its own
// seal (design system §4.2: Chancery small round seal, 32 × 32, flat emblem in two to three colours, iconFamilies.decision). A seal is
// drawn on a gpt-6-luna sheet of up to 12 round seals (4 columns × up to 3 rows, black ground), cut by detection, masked to a round
// alpha from the seal's own outline, resized to 32 × 32 and shipped as DDS. The cell map tools/content/data/decision_art_cells.json
// lists every sheet with its status; only an "accepted" sheet is cut, and only when its raw bytes have a review line in the provenance
// logs. The subjects tools/content/data/decision_art_subjects.json give the subject of each seal, keyed by seal key.
//
// Seal key: the sprite name without the GFX_decision_zin_ prefix (GFX_decision_zin_dev_send_scholars -> dev_send_scholars). Two
// decisions never share a seal: the key is the sprite, and each sprite has one subject. applyDecisionArt rewrites the texturefile of
// every GFX_decision_zin_<key> spriteType in the staged interface files whose seal is accepted (to gfx/interface/decisions/zin/<key>.dds);
// every other decision sprite keeps its current texture and is listed in the result.
//
//   sealSpriteName(key) / sealTexture(key)   the sprite name and the shipped DDS path of a seal key
//   planDecisionSheets(subjects)             sheets in production order (subjects are grouped by family, then chunked 12 per sheet)
//   decisionSheetJobs(sheets, subjects, dir) imagegen jobs for planned sheets
//   cutSealSheet(file, sheet, opts)          detects the seals and returns their 32 × 32 RGBA pieces (round alpha)
//   rewriteSealTextures(text, accepted)      rewrites the texturefile lines of the decision sprites named in `accepted`
//   applyDecisionArt(staged, opts)           rewrites the accepted sprites, cuts the seals they use, writes sources and manifest
//   applyIdeaSeals(staged, opts)             lane I12: decisions whose icon names an idea picture get that picture's own seal (below)
//   CLI: node tools/content/modules/decision_art.mjs plan                          rewrites the cell map (existing sheet status is kept)
//        node tools/content/modules/decision_art.mjs jobs <sheet>... <jobs.json>    imagegen jobs for the named planned sheets
//        node tools/content/modules/decision_art.mjs preview <sheet>                cuts one raw sheet and writes its contact sheets
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
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
export const CELLS_FILE = path.join(here, '..', 'data', 'decision_art_cells.json');
export const SUBJECTS_FILE = path.join(here, '..', 'data', 'decision_art_subjects.json');
export const SEAL_DIR = 'gfx/interface/decisions/zin';
export const SEAL_W = 32, SEAL_H = 32, INSET = 2, PER_SHEET = 12, COLS = 4, SUPERSAMPLE = 4;
export const SPRITE_PREFIX = 'GFX_decision_zin_';
export const MANIFEST_FILE = 'art/source/decision_art_manifest.json';

// ------------------------------------------------------------------------------------------------ keys
export const sealSpriteName = key => `${SPRITE_PREFIX}${key}`;
export const sealTexture = key => `${SEAL_DIR}/${key}.dds`;

// Balanced chunks: n seals in ceil(n / 12) sheets of near-equal size (119 -> 12 × 9, 11).
export function chunkSizes(n) {
  const k = Math.ceil(n / PER_SHEET), base = Math.floor(n / k), extra = n % k;
  return Array.from({ length: k }, (_, i) => base + (i < extra ? 1 : 0));
}

// subjects: [{ key, family, subject }] in the order of the subjects file. Sheets follow that order family by family, so a sheet
// mostly holds one family's decisions. Returns the planned sheets; a sheet lists its seal keys in order.
export function planDecisionSheets(subjects) {
  const ordered = [...subjects].sort((a, b) => a.family.localeCompare(b.family, 'en') || a.key.localeCompare(b.key, 'en'));
  const sheets = [];
  let at = 0;
  for (const [nn, size] of chunkSizes(ordered.length).entries()) {
    const chunk = ordered.slice(at, at += size);
    sheets.push({ sheet: `decision-${String(nn + 1).padStart(2, '0')}`, method: 'round', cols: COLS, rows: Math.ceil(chunk.length / COLS), keys: chunk.map(x => x.key), status: 'planned' });
  }
  return sheets;
}

// ------------------------------------------------------------------------------------------------ cell map
export function writeCellMap(sheets, file = CELLS_FILE) {
  const old = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { sheets: [] };
  const prior = new Map(old.sheets.map(s => [s.sheet, s]));
  const merged = sheets.map(s => {
    const p = prior.get(s.sheet);
    return p && JSON.stringify(p.keys) === JSON.stringify(s.keys) ? { ...s, status: p.status, ...(p.review ? { review: p.review } : {}) } : s;
  });
  const cells = {
    source: 'Layouts of the decision seal sheets (art store raw/decision/<sheet>.png, generated with gpt-6-luna). Keys only; the builder reads this file and the accepted sheets (tools/content/modules/decision_art.mjs). A decision keeps its current texture until its sheet is accepted.',
    complete: merged.every(s => s.status === 'accepted'),
    sheets: merged,
  };
  writeFileSync(file, JSON.stringify(cells, null, 1) + '\n');
  return cells;
}

// ------------------------------------------------------------------------------------------------ imagegen jobs
const STYLE = 'Flat round seals for a fantasy grand-strategy game\'s decision list, one consistent style: each seal is a flat round medallion of two or three colours only (for example dull gold, madder red and slate blue-grey, or vellum cream and forest green), with a plain thick round rim and one bold flat emblem in its centre. Simple flat shapes, crisp edges, no gradients, no shading, no gloss, no bevel, no photographic texture, no glow, no lens effects. No part of a seal is pure black. ';
const LAYOUT = (n, cols, rows) => `An asset sheet of ${n} round seals, in a wide 3:2 landscape image, arranged in an exact grid of ${cols} columns and ${rows} rows, on a solid flat pure black (#000000) background with wide black gutters between the seals and a black margin at every edge: no glow, no vignette, no gradient, no texture in the background, no lettering, no numerals, no border around the whole sheet. Every seal is a perfect circle of identical size, about 85% of its grid cell, with its rim fully inside its cell, the emblem centred and seen from the front. The seals are, read left to right and top to bottom, and the grid is filled in that order with no empty cell: `;
const CLOSE = 'No figure shows a face; no human figure fills a seal. No text, letters, numbers, runes, inscriptions, labels, logos, watermark, signature or maker\'s mark anywhere. No crosses, no crossed objects that read as a cross, and no real-world religious, national or political symbols. No modern objects: no firearms, gears, engines or machines. No demon, no devil, no horned or fanged monster. An original fantasy world: nothing from any existing film, book or game; nothing that resembles the Lord of the Rings.';

// Imagegen jobs for planned sheets. subjects: Map seal key -> subject text (from decision_art_subjects.json).
export function decisionSheetJobs(sheets, subjects, rawDir) {
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
// Coverage of each output pixel by the round seal: SUPERSAMPLE × SUPERSAMPLE sub-samples inside a circle of radius W/2 - 0.5 about
// the centre of the 32 × 32 canvas. Outside the circle the pixel is fully transparent and its colour is zeroed.
export function roundCoverage(w = SEAL_W, h = SEAL_H, ss = SUPERSAMPLE) {
  const cov = new Float32Array(w * h), r = Math.min(w, h) / 2 - 0.5, cx = w / 2, cy = h / 2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let hit = 0;
    for (let j = 0; j < ss; j++) for (let i = 0; i < ss; i++) {
      const px = x + (i + 0.5) / ss, py = y + (j + 0.5) / ss;
      if ((px - cx) ** 2 + (py - cy) ** 2 <= r * r) hit++;
    }
    cov[y * w + x] = hit / (ss * ss);
  }
  return cov;
}
const COVERAGE = roundCoverage();

// One round seal per detected region: the square inside the region (less the inset) is resized to 32 × 32 and masked by the round
// coverage. Returns [{ key, buf (32 × 32 RGBA), cell }]. Only generated pixels are used; nothing is drawn or painted.
export async function cutSealSheet(file, sheet) {
  const n = sheet.keys.length;
  const r = await findRegionsAdaptive(file, n, { cols: sheet.cols, rows: sheet.rows, aspect: [0.75, 1.33], minAreaFraction: 0.25 });
  if (!r.ok) throw new Error(`${sheet.sheet}: found ${r.found ?? '?'} seals, expected ${n}`);
  const pieces = [];
  for (const [i, key] of sheet.keys.entries()) {
    const b = r.regions[i];
    const side = Math.min(b.x1 - b.x0, b.y1 - b.y0) - 2 * INSET;
    const left = Math.round((b.x0 + b.x1) / 2 - side / 2), top = Math.round((b.y0 + b.y1) / 2 - side / 2);
    const rgb = await sharp(file).removeAlpha()
      .extract({ left, top, width: side, height: side })
      .resize(SEAL_W, SEAL_H, { fit: 'fill', kernel: 'lanczos3' })
      .raw().toBuffer();
    const buf = Buffer.alloc(SEAL_W * SEAL_H * 4);
    for (let p = 0; p < SEAL_W * SEAL_H; p++) {
      const a = Math.round(COVERAGE[p] * 255);
      buf[p * 4] = a ? rgb[p * 3] : 0; buf[p * 4 + 1] = a ? rgb[p * 3 + 1] : 0; buf[p * 4 + 2] = a ? rgb[p * 3 + 2] : 0; buf[p * 4 + 3] = a;
    }
    pieces.push({ key, buf, cell: i });
  }
  return pieces;
}

// ------------------------------------------------------------------------------------------------ wiring
// Rewrites the texturefile of every GFX_decision_zin_<key> sprite whose key is in `accepted` (a Set). Returns the text and the keys.
export function rewriteSealTextures(text, accepted) {
  const used = [];
  const out = text.replace(/(name\s*=\s*"GFX_decision_zin_([A-Za-z0-9_]+)"\s*texturefile\s*=\s*")([^"]*)(")/g, (m, pre, key, _old, post) => {
    if (!accepted.has(key)) return m;
    used.push(key);
    return `${pre}${sealTexture(key)}${post}`;
  });
  return { text: out, keys: used };
}

// Accepted sheets: their seal key -> sheet and cell, plus the raw bytes checked against the provenance (same rule as idea_art).
async function acceptedSeals(cells, provenance, raw) {
  const seals = new Map(), shipped = new Map();
  for (const sheet of cells.sheets) {
    if (sheet.status !== 'accepted') continue;
    const rel = `decision/${sheet.sheet}.png`;
    let bytes;
    try { bytes = await readFile(raw(rel)); } catch { throw new Error(`accepted decision sheet ${sheet.sheet} has no raw picture (${rel})`); }
    const acc = acceptance(provenance, rel, bytes);
    if (!acc.ok) throw new Error(`accepted decision sheet ${sheet.sheet}: ${acc.why}`);
    shipped.set(sheet.sheet, { rel, bytes, sha: acc.sha, sheet });
    sheet.keys.forEach((key, i) => seals.set(key, { sheet: sheet.sheet, cell: i }));
  }
  return { seals, shipped };
}

// Rewrites the decision sprites with accepted seals in the staged interface files, cuts the seals they use, writes the DDS files,
// the sources and the manifest. Returns { rewritten, seals, unsealed } where unsealed lists the decision sprites that keep their texture.
// Uses staged.files directly (Staged.add refuses to replace a file). `raw` maps a raw-relative path to a file (tests pass their own).
export async function applyDecisionArt(staged, { cells = readCells(), provenance, raw = rawFile, warn = () => {}, ideaRows, ideaProvenance } = {}) {
  const prov = provenance ?? (existsSync(provenanceFile()) ? (await readFile(provenanceFile(), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l)) : []);
  const { seals, shipped } = await acceptedSeals(cells, prov, raw);
  const declared = new Set();
  const accepted = new Set(seals.keys());
  const used = new Map();
  for (const rel of [...staged.files.keys()].filter(k => /^interface\/.*\.gfx$/.test(k)).sort()) {
    const text = staged.files.get(rel).toString('utf8');
    for (const m of text.matchAll(/name\s*=\s*"GFX_decision_zin_([A-Za-z0-9_]+)"/g)) declared.add(m[1]);
    const r = rewriteSealTextures(text, accepted);
    if (!r.keys.length) continue;
    staged.files.set(rel, Buffer.from(r.text, 'utf8'));
    for (const key of r.keys) used.set(key, seals.get(key));
  }
  const missing = [...accepted].filter(k => !declared.has(k));
  if (missing.length) warn(`decision art: ${missing.length} accepted seals have no staged decision sprite (${missing.slice(0, 5).join(', ')})`);
  const bySheet = new Map();
  for (const [key, p] of used) { if (!bySheet.has(p.sheet)) bySheet.set(p.sheet, []); bySheet.get(p.sheet).push({ key, ...p }); }
  const manifest = [], sources = new Map(), shippedKeys = [];
  for (const [sheetName, list] of bySheet) {
    const s = shipped.get(sheetName), pieces = await cutSealSheet(raw(s.rel), s.sheet);
    sources.set(s.rel, s);
    for (const piece of pieces.filter(q => list.some(p => p.key === q.key))) {
      const out = sealTexture(piece.key), data = dds(fromRaw(piece.buf, SEAL_W, SEAL_H));
      staged.files.set(out, data);
      shippedKeys.push(piece.key);
      manifest.push({ out, sprite: sealSpriteName(piece.key), source: `art/source/${s.rel}`, sourceSha256: s.sha, cell: piece.cell, ops: ['detect seal', `square inset ${INSET}px`, `round alpha (${SUPERSAMPLE}x${SUPERSAMPLE} coverage)`, `fill ${SEAL_W}x${SEAL_H}`, 'dds a8r8g8b8'], sha256: sha256(data) });
    }
  }
  for (const [, s] of sources) staged.files.set(`art/source/${s.rel}`, s.bytes);
  const idea = await applyIdeaSeals(staged, { rows: ideaRows ?? readIdeaSeals(), provenance: ideaProvenance ?? repoProvenance(), warn });
  manifest.push(...idea.manifest);
  if (manifest.length) staged.files.set(MANIFEST_FILE, Buffer.from(JSON.stringify({ generator: 'tools/content/modules/decision_art.mjs', files: manifest.sort((a, b) => a.out.localeCompare(b.out, 'en')) }, null, 1) + '\n'));
  const unsealed = [...declared].filter(k => !used.has(k)).sort();
  return { rewritten: used.size, seals: shippedKeys.length, unsealed, idea: { icons: idea.icons, seals: idea.seals, reused: idea.reused } };
}

// ------------------------------------------------------------------------------------------------ idea-art decisions (lane I12)
// Decisions whose icon names a ZIN idea picture get that picture's own seal. A decision icon is either `icon = GFX_idea_zin_<key>` or a
// bare `icon = <key>` whose GFX_decision_<key> sprite is the ZIN idea picture gfx/interface/ideas/zin/<key>.dds. data/decision_idea_seals.json
// lists one row per key: "accepted" (a 32 × 32 processed picture from hoi4-imagegen, copied to art/source/decision/idea/<key>.png; its
// exact bytes need an accepting review line in the provenance log) or "reused" (the key already has its I11 seal GFX_decision_zin_<key>).
// The icon line is rewritten to GFX_decision_zin_<key>; the accepted seals used by a decision are declared in interface/zin_decision_idea_seals.gfx.
// Category icons (common/decisions/categories/) are not decision icons and are never rewritten.
export const IDEA_SEALS_FILE = path.join(here, '..', 'data', 'decision_idea_seals.json');
export const IDEA_GFX_FILE = 'interface/zin_decision_idea_seals.gfx';
export const ZIN_ROOT = path.join(here, '..', '..', '..');

export const readIdeaSeals = (file = IDEA_SEALS_FILE) => JSON.parse(readFileSync(file, 'utf8')).seals;

function repoProvenance() {
  const file = path.join(ZIN_ROOT, 'art', 'source', 'provenance.jsonl');
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split(/\r?\n/).filter(l => l.trim()).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

// Sprite name -> texturefile of every spriteType in the given .gfx texts. A texturefile belongs to the closest name before it; the \b keeps
// animationtexturefile and animationmaskfile out of the pairing.
export function spriteTextures(texts) {
  const map = new Map();
  for (const text of texts) {
    let cur = null;
    for (const m of text.matchAll(/\bname\s*=\s*"([^"]+)"|\btexturefile\s*=\s*"([^"]+)"/g)) {
      if (m[1] !== undefined) cur = m[1];
      else if (cur !== null) { map.set(cur, m[2]); cur = null; }
    }
  }
  return map;
}

// The seal key of a decision icon that names a ZIN idea picture (and the key is in sealKeys), else null.
// The key is the picture's own file name (gfx/interface/ideas/zin/<key>.dds), so a bare icon such as wing_trials can name the dragon_wing picture.
export function ideaIconKey(icon, sealKeys, textures) {
  const direct = /^GFX_idea_zin_[a-z0-9_]+$/.test(icon);
  const bare = /^[a-z0-9_]+$/.test(icon);
  const picture = direct ? textures.get(icon) : bare ? textures.get(`GFX_decision_${icon}`) : null;
  const m = /^gfx\/interface\/ideas\/zin\/([a-z0-9_]+)\.dds$/.exec(picture ?? '');
  const key = m ? m[1] : null;
  return key && sealKeys.has(key) ? key : null;
}

// Rewrites the decision icon lines (two tabs: inside a decision block) of one decision file. Returns { text, keys } with the keys rewritten.
export function rewriteIdeaIcons(text, sealKeys, textures) {
  const keys = [];
  const out = text.replace(/^(\t\ticon\s*=\s*)([A-Za-z0-9_]+)(\s*)$/gm, (m, pre, icon, post) => {
    const key = ideaIconKey(icon, sealKeys, textures);
    if (!key) return m;
    keys.push(key);
    return `${pre}${sealSpriteName(key)}${post}`;
  });
  return { text: out, keys };
}

// rows: the seal table. provenance: the log lines the accepted pictures are checked against. Returns the rewritten icon count, the seals shipped,
// the reused seals used, and the manifest lines of the shipped DDS. Fails closed on an accepted row whose bytes or review line do not match.
export async function applyIdeaSeals(staged, { rows = readIdeaSeals(), provenance = repoProvenance(), root = ZIN_ROOT, warn = () => {} } = {}) {
  const textures = spriteTextures([...staged.files].filter(([k]) => /^interface\/.*\.gfx$/.test(k)).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([, v]) => v.toString('utf8')));
  const usable = new Map();
  for (const r of rows) {
    if (r.status === 'reused') {
      if (textures.has(sealSpriteName(r.key))) usable.set(r.key, r);
      else warn(`idea seals: ${sealSpriteName(r.key)} is not declared, so the ${r.key} decisions keep their idea picture`);
    } else if (r.status === 'accepted') {
      if (textures.has(sealSpriteName(r.key))) throw new Error(`idea seal ${r.key}: ${sealSpriteName(r.key)} is already declared`);
      usable.set(r.key, r);
    } else if (r.status !== 'planned') throw new Error(`idea seal ${r.key}: unknown status ${r.status}`);
  }
  // The decision icon lines first, so only the seals that decisions use are shipped.
  const used = new Map();
  for (const [rel, buf] of [...staged.files].filter(([k]) => /^common\/decisions\/zin_[^/]+\.txt$/.test(k)).sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    const r = rewriteIdeaIcons(buf.toString('utf8'), new Set(usable.keys()), textures);
    if (!r.keys.length) continue;
    staged.files.set(rel, Buffer.from(r.text, 'utf8'));
    for (const k of r.keys) used.set(k, (used.get(k) ?? 0) + 1);
  }
  const manifest = [], declared = [];
  let seals = 0, reused = 0;
  for (const key of [...used.keys()].sort()) {
    const r = usable.get(key);
    if (r.status === 'reused') { reused++; continue; }
    const bytes = await readFile(path.join(root, r.source)).catch(() => null);
    if (!bytes) throw new Error(`idea seal ${key}: ${r.source} is missing`);
    if (sha256(bytes) !== r.sha256) throw new Error(`idea seal ${key}: ${r.source} changed since its row`);
    const acc = acceptance(provenance, r.source, bytes);
    if (!acc.ok) throw new Error(`idea seal ${key}: ${acc.why}`);
    const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (info.width !== SEAL_W || info.height !== SEAL_H || info.channels !== 4) throw new Error(`idea seal ${key}: ${info.width}x${info.height}x${info.channels}, expected ${SEAL_W}x${SEAL_H}x4`);
    const out = sealTexture(key), data2 = dds(fromRaw(data, SEAL_W, SEAL_H));
    staged.files.set(out, data2);
    staged.files.set(r.source, bytes);
    declared.push(key);
    seals++;
    manifest.push({ out, sprite: sealSpriteName(key), source: r.source, sourceSha256: r.sha256, decisions: used.get(key), ops: ['hoi4-imagegen 0.2.1 decision recipe: fit_subject to 32 x 32, margin 1', 'dds a8r8g8b8 from the processed picture'], sha256: sha256(data2) });
  }
  if (declared.length) {
    const body = declared.map(k => `\tspriteType = {\n\t\tname = "${sealSpriteName(k)}"\n\t\ttexturefile = "${sealTexture(k)}"\n\t}`).join('\n');
    staged.files.set(IDEA_GFX_FILE, Buffer.from(`# Generated by the ZIN content builder (modules/decision_art.mjs, lane I12): the seals of the decisions whose icon names an idea picture. Do not edit by hand.\nspriteTypes = {\n${body}\n}\n`, 'utf8'));
  }
  const icons = [...used.values()].reduce((a, b) => a + b, 0);
  return { icons, seals, reused, manifest };
}

function readCells() {
  return existsSync(CELLS_FILE) ? JSON.parse(readFileSync(CELLS_FILE, 'utf8')) : { sheets: [] };
}

// ------------------------------------------------------------------------------------------------ CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...rest] = process.argv.slice(2);
  const subjectRows = () => JSON.parse(readFileSync(SUBJECTS_FILE, 'utf8')).subjects;
  if (cmd === 'plan') {
    const cells = writeCellMap(planDecisionSheets(subjectRows()));
    console.log(JSON.stringify({ sheets: cells.sheets.length, accepted: cells.sheets.filter(s => s.status === 'accepted').length, seals: cells.sheets.reduce((a, s) => a + s.keys.length, 0) }));
  } else if (cmd === 'preview') {
    const sheetName = rest[0];
    const cells = readCells();
    const sheet = cells.sheets.find(s => s.sheet === sheetName);
    if (!sheet) throw new Error(`no sheet ${sheetName} in the cell map`);
    const pieces = await cutSealSheet(rawFile(`decision/${sheetName}.png`), sheet);
    const dir = `${ART}/processed/decision`;
    mkdirSync(dir, { recursive: true });
    const gap = 6, W = COLS * (SEAL_W + gap) + gap, H = Math.ceil(sheet.keys.length / COLS) * (SEAL_H + gap) + gap;
    for (const scale of [1, 3]) {
      const comp = [];
      for (const p of pieces) {
        const img = await sharp(p.buf, { raw: { width: SEAL_W, height: SEAL_H, channels: 4 } }).resize(SEAL_W * scale, SEAL_H * scale, { kernel: 'lanczos3' }).png().toBuffer();
        comp.push({ input: img, left: (gap + (p.cell % COLS) * (SEAL_W + gap)) * scale, top: (gap + Math.floor(p.cell / COLS) * (SEAL_H + gap)) * scale });
      }
      await sharp({ create: { width: W * scale, height: H * scale, channels: 3, background: { r: 60, g: 62, b: 66 } } }).composite(comp).png().toFile(`${dir}/${sheetName}.contact-${scale}x.png`);
    }
    console.log(JSON.stringify({ sheet: sheetName, seals: pieces.length, dir }));
  } else if (cmd === 'jobs') {
    const out = rest.pop(), names = rest;
    const cells = readCells();
    const subjects = new Map(subjectRows().map(x => [x.key, x.subject]));
    const sheets = names.map(n => cells.sheets.find(s => s.sheet === n));
    if (sheets.some(s => !s || s.status === 'accepted')) throw new Error(`every named sheet must exist and be unaccepted: ${names.join(', ')}`);
    const jobs = decisionSheetJobs(sheets, subjects, `${ART}/raw/decision`);
    writeFileSync(out, JSON.stringify(jobs, null, 1) + '\n');
    console.log(JSON.stringify({ jobs: jobs.map(j => j.id) }));
  } else {
    console.log('usage: decision_art.mjs plan | preview <sheet> | jobs <sheet>... <jobs.json>');
  }
}
