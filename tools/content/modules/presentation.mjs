// Presentation art → game files: loading screens and their thumbnails, the main-menu backgrounds, the loading-screen
// chrome, the ZIN emblem and bookmark picture, the loading tips, the catalog focus and idea icons and the catalog
// event and news pictures. Every picture is image-generated (owner rule, 2026-10-17); this module only finds, crops,
// keys, resizes and converts what the image model produced. No vanilla pixel is read or shipped: the installed game
// is read only for its loading-tip count.
//
// Specs: docs/specs/08_art_and_assets/02_loading_screens_and_quotes.md, 07_interface/03_main_menu_and_frontend.md,
// 05_focus_trees/02_icon_catalog.md, 08_art_and_assets/01_art_pipeline.md and 03_full_asset_inventory.md (families A,
// E, F), integration decisions A1-A7. Only sources with an accepted review line in provenance.jsonl are used; the one
// exception is load_24, accepted with a crop by integration decision A5 for exactly the reviewed bytes.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ART, GAME, rawFile, provenanceFile } from '../lib/paths.mjs';
import { findRegionsAdaptive } from '../lib/sheets.mjs';
import { fromRaw, dds } from '../lib/raster.mjs';

export const CELLS_COPY = fileURLToPath(new URL('../data/presentation-cells.json', import.meta.url));
export const TIPS_FILE = fileURLToPath(new URL('../data/loading_tips.json', import.meta.url));

// ------------------------------------------------------------------------------------------------ fixed values
export const LOADING_COUNT = 24;
export const MENU_KEYS = ['parim', 'strait', 'wall'];               // A5; the first is the default background
export const LOADING = { w: 1920, h: 1440, thumbW: 192, thumbH: 144 };
export const THUMB_DIR = 'gfx/interface/zin/loadingscreens';          // A5: thumbnails outside the loading folder
export const FOCUS = { w: 100, h: 88, pad: 3 };
export const IDEA = { w: 64, h: 64, field: 0.64 };                    // square inside the enamel field (A3)
export const EVENT = { w: 210, h: 176 };
export const NEWS = { w: 397, h: 153 };
export const BOOKMARK = { w: 180, h: 104, sprite: 'GFX_zin_bookmark_fourth_age', file: 'gfx/interface/bookmarks/zin_fourth_age.dds' };
export const EMBLEM = { w: 448, h: 175, pad: 4, file: 'gfx/interface/logo_game.dds' };
// Loading-screen chrome under the exact vanilla names and case (vanilla interface/load_screen.gfx); sizes measured
// from the installed files.
export const CHROME = [
  { id: 'loading-tipband', raw: 'ui/loading-tipband.png', file: 'gfx/interface/Loadingscreen_loadingtip.dds', w: 1400, h: 148 },
  { id: 'loading-statusband', raw: 'ui/loading-statusband.png', file: 'gfx/interface/Loadingscreen_loadingstatus.dds', w: 1400, h: 92 },
  { id: 'loading-progress-track', raw: 'ui/loading-progress-track.png', file: 'gfx/interface/LoadingScreen_Progress_1.dds', w: 934, h: 40, pair: 'progress' },
  { id: 'loading-progress-fill', raw: 'ui/loading-progress-fill.png', file: 'gfx/interface/LoadingScreen_Progress_2.dds', w: 934, h: 40, pair: 'progress' },
];
export const FALLBACK_ICON = 'generic';                // the compiler's missing-icon fallback key
export const FALLBACK_PICTURE = 'generic_court';       // the fallback picture key
// Integration decision A5: load_24 attempt 3 was reviewed "not accepted; kept in place as the best of three" because of
// a faint mark in the lower-right corner, and A5 accepts it cropped to x 0-1400, y 0-1050 before the resize. The
// decision covers exactly these bytes; a regenerated load_24 needs its own accepted review line.
export const DECISIONS = {
  'loadingscreens/load_24.png': { sha256: 'ab7ae1c4d3207a9d939c9e42087ee349828ecf3efcdf7252fe3954a4da210ec9', crop: { left: 0, top: 0, width: 1400, height: 1050 }, basis: 'docs/specs/INTEGRATION_DECISIONS.md A5' },
};
export const SPRITE = {
  focus: k => `GFX_focus_zin_${k}`, idea: k => `GFX_idea_zin_${k}`, evt: k => `GFX_zin_evt_${k}`, news: k => `GFX_zin_news_${k}`,
};

// ------------------------------------------------------------------------------------------------ text checks
// Windows-1252: ASCII, Latin-1 printable and the 27 characters of 0x80-0x9F.
const CP1252_EXTRA = new Set([...'€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ']);
export const isCp1252 = s => [...s].every(c => { const n = c.codePointAt(0); return n === 9 || n === 10 || (n >= 0x20 && n <= 0x7e) || (n >= 0xa0 && n <= 0xff) || CP1252_EXTRA.has(c); });
// Loading text is shown before any save exists, so no flag can gate it (loading spec §7 check 6, no whitelist), plus
// the superseded names and modern words (check 7, names-and-terms spec).
export const FORBIDDEN = [
  [/\bAfrit/i, 'gated: Afrit'], [/Hidden Council/i, 'gated: Hidden Council'], [/\bEindil/i, 'gated: Eindil'], [/\bEin\b/, 'gated: Ein'],
  [/Man from the Ice/i, 'gated: the Man from the Ice'], [/\bsleep(er|ers)\b/i, 'gated: sleeper'], [/\bNecklace\b/i, 'gated: Necklace'],
  [/\bSevrin\b/i, 'gated: the thief'], [/Ring of Doors|Crown of Witnesses|Bracelet of the First Seal/i, 'gated: lesser artifact'],
  [/\bRoka\b/i, 'gated: Roka'], [/\bGlernaen\b/i, 'gated: Glernaen'], [/King of Demons/i, 'gated: King of Demons'],
  [/^(?=.*\bheart\b)(?=.*\b(Glo|Horos)\b)/is, 'gated: heart with Glo or Horos'], [/^(?=.*\bdemons?\b)(?=.*\bDeliverer\b)/is, 'gated: demon with Deliverer'],
  [/Einendil|Edvoid|\bKlinti\b|\bGorbat\b|Sovereign Spirit/i, 'superseded name'], [/\bRush\b/, 'superseded name: Rush'],
  [/\bfactor(y|ies)\b|\brifles?\b|\bdemocra(cy|tic)\b|\b193\d\b|\bgunpowder\b|\bfirearms?\b|\btanks?\b/i, 'modern word'],
];
export const forbiddenIn = text => FORBIDDEN.filter(([re]) => re.test(text)).map(([, why]) => why);

// Loading spec §7: keys 0..N-1 in order without gaps, quotes 0-149 then tips 150-189, lengths, characters, secrecy.
export function checkTips(rows, vanillaCount = 163) {
  const problems = [];
  if (rows.length < vanillaCount) problems.push(`${rows.length} tips, fewer than the ${vanillaCount} vanilla tips`);
  rows.forEach((r, i) => {
    const where = `tip ${i} (${r.key})`;
    if (r.key !== `LOADING_TIP_${i}`) problems.push(`${where}: key out of order, expected LOADING_TIP_${i}`);
    const kind = i < 150 ? 'quote' : 'tip';
    if (r.kind !== kind) problems.push(`${where}: kind ${r.kind}, expected ${kind}`);
    if (!r.text?.trim()) problems.push(`${where}: empty text`);
    if (kind === 'quote' && !r.attribution?.trim()) problems.push(`${where}: no attribution`);
    const s = tipString(r);
    if (r.text.length >= 220) problems.push(`${where}: text ${r.text.length} characters (limit 219)`);
    if (s.length >= 300) problems.push(`${where}: string ${s.length} characters (limit 299)`);
    for (const part of [r.text, r.attribution ?? '']) {
      if (!isCp1252(part)) problems.push(`${where}: character outside Windows-1252`);
      if (/["$[\]§]/.test(part)) problems.push(`${where}: forbidden character (" $ [ ] or §)`);
      for (const why of forbiddenIn(part)) problems.push(`${where}: ${why}`);
    }
  });
  return problems;
}
export const tipString = r => r.kind === 'quote' ? `${r.text}\\n- ${r.attribution}` : `§YCounsel:§! ${r.text}`;

// Localisation in the replace folder: UTF-8 with BOM, l_english, keys in data order (never re-sorted).
function ymlOrdered(pairs) {
  const body = pairs.map(([k, v]) => ` ${k}:0 "${String(v).replace(/"/g, '\\"')}"`).join('\n');
  return Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(`l_english:\n${body}\n`, 'utf8')]);
}

async function vanillaTipCount() {
  const file = `${GAME}/localisation/english/loading_tips_l_english.yml`;
  if (!existsSync(file)) return 163;
  return new Set([...(await readFile(file, 'utf8')).matchAll(/^\s*(LOADING_TIP_\d+):/gm)].map(m => m[1])).size;
}

// ------------------------------------------------------------------------------------------------ provenance
const sha256 = b => createHash('sha256').update(b).digest('hex');
// The last review line (one with a reviewer) for these exact bytes decides; generation lines do not count.
export function acceptance(lines, rel, bytes) {
  const sha = sha256(bytes), reviews = lines.filter(l => l.sha256 === sha && l.reviewer);
  const last = reviews.at(-1), decision = DECISIONS[rel]?.sha256 === sha ? DECISIONS[rel] : undefined;
  if (last?.accepted === true) return { ok: true, sha, id: last.id };
  if (decision) return { ok: true, sha, id: reviews.at(-1)?.id ?? rel, decision };
  return { ok: false, sha, why: last ? 'review rejected' : 'no review line' };
}

// ------------------------------------------------------------------------------------------------ raster helpers
const RGBA = img => img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
async function rgba(img, w, h) { const { data, info } = await RGBA(img); if (info.width !== w || info.height !== h || info.channels !== 4) throw new Error(`raster ${info.width}x${info.height}x${info.channels}, expected ${w}x${h}x4`); return data; }
const ddsOf = (buf, w, h) => dds(fromRaw(buf, w, h));
const rawImage = (buf, w, h) => sharp(buf, { raw: { width: w, height: h, channels: 4 } });
// Exact integer box downscale (A1 thumbnails): each output pixel is the rounded mean of an f x f block.
export function boxDownscale(buf, w, h, f) {
  const ow = w / f, oh = h / f, out = Buffer.alloc(ow * oh * 4), n = f * f;
  if (!Number.isInteger(ow) || !Number.isInteger(oh)) throw new Error(`box downscale ${w}x${h} by ${f}`);
  for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) for (let c = 0; c < 4; c++) {
    let s = 0; for (let yy = y * f; yy < y * f + f; yy++) for (let xx = x * f; xx < x * f + f; xx++) s += buf[(yy * w + xx) * 4 + c];
    out[(y * ow + x) * 4 + c] = Math.floor((s + n / 2) / n);
  }
  return out;
}
// Colour-key matte (art pipeline §4 step 4): alpha from the distance to the key, transparent below lo and opaque
// above hi, linear between; edge pixels are un-mixed from the key so no magenta spill remains.
export function keyMatte(rgb, w, h, key = [255, 0, 255], lo = 40, hi = 120) {
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const r = rgb[i * 3], g = rgb[i * 3 + 1], b = rgb[i * 3 + 2], d = Math.hypot(r - key[0], g - key[1], b - key[2]);
    const a = d <= lo ? 0 : d >= hi ? 1 : (d - lo) / (hi - lo);
    const o = i * 4;
    if (a > 0) for (const [k, v] of [[0, r], [1, g], [2, b]]) out[o + k] = Math.max(0, Math.min(255, Math.round((v - (1 - a) * key[k]) / a)));
    out[o + 3] = Math.round(a * 255);
  }
  return out;
}
const alphaBox = (buf, w, h) => { let x0 = w, y0 = h, x1 = -1, y1 = -1; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (buf[(y * w + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }; };

// Interface strips on black (A2): the band's rows and columns are where the mean brightness rises above the black
// ground; alpha follows each column's brightness, so the ends that darken to black fade out as vanilla's do.
async function stripProfile(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, v = (x, y) => { const i = (y * W + x) * 3; return Math.max(data[i], data[i + 1], data[i + 2]); };
  const xa = Math.floor(W * 0.2), xb = Math.floor(W * 0.8), rows = [];
  for (let y = 0; y < H; y++) { let s = 0; for (let x = xa; x < xb; x++) s += v(x, y); rows.push(s / (xb - xa)); }
  const edge = Math.max(1, Math.floor(H * 0.05)), bg = [...rows.slice(0, edge), ...rows.slice(-edge)].sort((a, b) => a - b)[edge];
  const on = rows.map(m => m > bg + 4), y0 = on.indexOf(true), y1 = on.lastIndexOf(true);
  if (y0 < 0 || y1 - y0 < 8) throw new Error(`${file}: no strip found`);
  return { data, W, H, y0, y1, v };
}
function stripColumns({ W, v }, y0, y1) {
  const cols = []; for (let x = 0; x < W; x++) { let s = 0; for (let y = y0; y <= y1; y++) s += v(x, y); cols.push(s / (y1 - y0 + 1)); }
  return cols;
}
async function stripRgba(file, win, w, h) {
  const p = await stripProfile(file), cols = stripColumns(p, win.y0, win.y1);
  const mid = cols.slice(Math.floor(p.W * 0.25), Math.floor(p.W * 0.75)).sort((a, b) => a - b), ref = mid[Math.floor(mid.length / 2)];
  const cw = win.x1 - win.x0 + 1, ch = win.y1 - win.y0 + 1, buf = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const i = ((win.y0 + y) * p.W + win.x0 + x) * 3, o = (y * cw + x) * 4;
    buf[o] = p.data[i]; buf[o + 1] = p.data[i + 1]; buf[o + 2] = p.data[i + 2];
    buf[o + 3] = Math.round(255 * Math.max(0, Math.min(1, cols[win.x0 + x] / (0.5 * ref))));
  }
  return rgba(rawImage(buf, cw, ch).resize(w, h, { fit: 'fill', kernel: 'lanczos3' }), w, h);
}
async function stripWindow(file) {
  const p = await stripProfile(file), cols = stripColumns(p, p.y0, p.y1);
  const mid = cols.slice(Math.floor(p.W * 0.25), Math.floor(p.W * 0.75)).sort((a, b) => a - b), ref = mid[Math.floor(mid.length / 2)];
  const on = cols.map(m => m > ref * 0.04);
  return { x0: on.indexOf(true), x1: on.lastIndexOf(true), y0: p.y0, y1: p.y1 };
}

// Focus icons (A3): the medallion's outline is the alpha. Inside the found region, every row and every column is
// filled between its first and last pixel brighter than the black ground, so the dark enamel field stays opaque.
function medallionMask(rgb, W, r, threshold = 12) {
  const pad = 6, x0 = Math.max(0, r.x0 - pad), y0 = Math.max(0, r.y0 - pad), x1 = Math.min(W, r.x1 + pad), w = x1 - x0, h = r.y1 + pad - y0;
  const fg = (x, y) => { const i = ((y0 + y) * W + x0 + x) * 3; return Math.max(rgb[i], rgb[i + 1], rgb[i + 2]) > threshold; };
  const rowSpan = [], colSpan = [];
  for (let y = 0; y < h; y++) { let a = -1, b = -2; for (let x = 0; x < w; x++) if (fg(x, y)) { if (a < 0) a = x; b = x; } rowSpan.push([a, b]); }
  for (let x = 0; x < w; x++) { let a = -1, b = -2; for (let y = 0; y < h; y++) if (fg(x, y)) { if (a < 0) a = y; b = y; } colSpan.push([a, b]); }
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = ((y0 + y) * W + x0 + x) * 3, o = (y * w + x) * 4, inside = x >= rowSpan[y][0] && x <= rowSpan[y][1] && y >= colSpan[x][0] && y <= colSpan[x][1];
    buf[o] = rgb[i]; buf[o + 1] = rgb[i + 1]; buf[o + 2] = rgb[i + 2]; buf[o + 3] = inside ? 255 : 0;
  }
  return { buf, w, h, x0, y0 };
}

// ------------------------------------------------------------------------------------------------ data
async function readJson(file) { return JSON.parse(await readFile(file, 'utf8')); }
// The art working copies of the cell map and event jobs when present, otherwise the tracked copy.
export async function loadCells() {
  const copy = await readJson(CELLS_COPY);
  const cellsFile = `${ART}/jobs/icons-catalog-cells.json`, eventsFile = `${ART}/jobs/events-catalog-jobs.json`;
  const icons = existsSync(cellsFile) ? (await readJson(cellsFile)).map(c => ({ sheet: c.sheet, cols: c.cols, rows: c.rows, keys: c.keys })) : copy.icons;
  const events = existsSync(eventsFile) ? (await readJson(eventsFile)).map(e => ({ id: e.id, key: e.keys[0], crop: e.crop, gate: e.gate })) : copy.events;
  return { icons, events, copy };
}

const spriteBlock = (name, file, extra = '') => `\tspriteType = {\n\t\tname = "${name}"\n\t\ttexturefile = "${file}"${extra}\n\t}`;
const shineBlock = (name, file) => {
  const anim = rot => `\t\tanimation = {\n\t\t\tanimationmaskfile = "${file}"\n\t\t\tanimationtexturefile = "gfx/interface/goals/shine_overlay.dds"\n\t\t\tanimationrotation = ${rot}\n\t\t\tanimationlooping = no\n\t\t\tanimationtime = 0.75\n\t\t\tanimationdelay = 0\n\t\t\tanimationblendmode = "add"\n\t\t\tanimationtype = "scrolling"\n\t\t\tanimationrotationoffset = { x = 0.0 y = 0.0 }\n\t\t\tanimationtexturescale = { x = 1.0 y = 1.0 }\n\t\t}`;
  return `\tSpriteType = {\n\t\tname = "${name}_shine"\n\t\ttexturefile = "${file}"\n\t\teffectFile = "gfx/FX/buttonstate.lua"\n${anim('-90.0')}\n${anim('90.0')}\n\t\tlegacy_lazy_load = no\n\t}`;
};
const gfxFile = (comment, blocks) => `# Generated by the ZIN content builder (modules/presentation.mjs). ${comment}\nspriteTypes = {\n${blocks.join('\n')}\n}\n`;

// ------------------------------------------------------------------------------------------------ build
// Stages every presentation file. Returns what other build steps need (the bookmark picture sprite for
// common/bookmarks/world.txt, written by the politics step) and a summary.
// Options (tests): warn(message) receives each warning; provenance replaces the parsed provenance lines.
export async function buildPresentation(staged, { warn = msg => process.stderr.write(`presentation: ${msg}\n`), provenance } = {}) {
  const provLines = provenance ?? (await readFile(provenanceFile(), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l));
  const manifest = [], warnings = [], sources = new Map();
  const note = msg => { warnings.push(msg); warn(msg); };
  // Read and gate one raw source; accepted sources are staged under art/source/ once.
  const source = async rel => {
    const file = rawFile(rel), bytes = await readFile(file), acc = acceptance(provLines, rel, bytes);
    if (acc.ok && !sources.has(rel)) sources.set(rel, { bytes, ...acc });
    return { file, bytes, ...acc };
  };
  const ship = (out, bytes, src, ops) => { staged.add(out, bytes); manifest.push({ out, source: `art/source/${src.rel}`, sourceSha256: src.sha, ops, sha256: sha256(bytes) }); };

  // Loading screens and main-menu backgrounds: A1 Lanczos 3 to 1920x1440, thumbnails a 10x box downscale.
  const scene = async (rel, out, thumbOut) => {
    const s = await source(rel);
    if (!s.ok) { note(`${rel}: ${s.why}; not shipped`); return false; }
    const meta = await sharp(s.file).metadata(), crop = s.decision?.crop;
    const cw = crop?.width ?? meta.width, ch = crop?.height ?? meta.height;
    if (Math.abs(cw / ch - 4 / 3) > 0.005) throw new Error(`${rel}: ${cw}x${ch} is not 4:3`);
    let img = sharp(s.file); if (crop) img = img.extract(crop);
    const big = await rgba(img.resize(LOADING.w, LOADING.h, { fit: 'fill', kernel: 'lanczos3' }), LOADING.w, LOADING.h);
    const ops = [...(crop ? [`crop x ${crop.left}-${crop.left + crop.width} y ${crop.top}-${crop.top + crop.height} (${s.decision.basis})`] : []), 'lanczos3 1920x1440', 'dds a8r8g8b8'];
    ship(out, ddsOf(big, LOADING.w, LOADING.h), { rel, sha: s.sha }, ops);
    ship(thumbOut, ddsOf(boxDownscale(big, LOADING.w, LOADING.h, 10), LOADING.thumbW, LOADING.thumbH), { rel, sha: s.sha }, [...ops.slice(0, -1), 'box 10x 192x144', 'dds a8r8g8b8']);
    return true;
  };
  const loading = [];
  for (let n = 1; n <= LOADING_COUNT; n++) if (await scene(`loadingscreens/load_${n}.png`, `gfx/loadingscreens/load_${n}.dds`, `${THUMB_DIR}/load_${n}_small.dds`)) loading.push(`load_${n}`);
  const menus = [];
  for (const k of MENU_KEYS) if (await scene(`menu/zin_menu_${k}.png`, `gfx/loadingscreens/zin_menu_${k}.dds`, `${THUMB_DIR}/zin_menu_${k}_small.dds`)) menus.push(`zin_menu_${k}`);
  if (!menus.includes('zin_menu_parim')) throw new Error('the default menu background zin_menu_parim is not accepted');

  // Thumbnail frame for the background picker: keyed on magenta, the whole frame resized to 192x144.
  const border = await source('loadingscreens/loading-thumb-border.png');
  if (!border.ok) throw new Error(`loading-thumb-border: ${border.why}`);
  {
    const { data, info } = await sharp(border.file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const keyed = keyMatte(data, info.width, info.height);
    const buf = await rgba(rawImage(keyed, info.width, info.height).resize(LOADING.thumbW, LOADING.thumbH, { fit: 'fill', kernel: 'lanczos3' }), LOADING.thumbW, LOADING.thumbH);
    ship(`${THUMB_DIR}/zin_thumb_border.dds`, ddsOf(buf, LOADING.thumbW, LOADING.thumbH), { rel: 'loadingscreens/loading-thumb-border.png', sha: border.sha }, ['magenta key matte', 'lanczos3 192x144', 'dds a8r8g8b8']);
  }
  staged.text('interface/small_background.gfx', gfxFile('Overrides the vanilla file: background picker thumbnails; nothing points into the vanilla loading folder.', [
    ...menus.map(k => spriteBlock(`GFX_${k}_small`, `${THUMB_DIR}/${k}_small.dds`)),
    ...loading.map(k => spriteBlock(`GFX_${k}_small`, `${THUMB_DIR}/${k}_small.dds`)),
    spriteBlock('GFX_frontend_loading_screen_border_small', `${THUMB_DIR}/zin_thumb_border.dds`),
  ]));
  const bg = (name, file, w, h) => `\tcorneredTileSpriteType = {\n\t\tname = "${name}"\n\t\ttexturefile = "${file}"\n\t\tborderSize = { x = 0 y = 0 }\n\t\tsize = { x = ${w} y = ${h} }\n\t\ttilingCenter = no\n\t\teffectFile = "gfx/FX/buttonstate.shader"\n\t}`;
  staged.text('interface/frontendmainviewbg.gfx', gfxFile('Overrides the vanilla file: the main-menu background starts on Parim; the background manager swaps the texture.', [bg('GFX_frontend_bg', 'gfx/loadingscreens/zin_menu_parim.dds', 1920, 1440)]));
  staged.text('interface/frontendmainviewbg_basic.gfx', gfxFile('Overrides the vanilla file.', [bg('GFX_frontend_bg_basic', 'gfx/loadingscreens/zin_menu_parim.dds', 1920, 1440), bg('GFX_frontend_bg_basic_small', `${THUMB_DIR}/zin_menu_parim_small.dds`, 192, 144)]));
  staged.text('common/frontend/backgrounds/zin_backgrounds.txt', `# Generated by the ZIN content builder (modules/presentation.mjs). The main-menu backgrounds (integration A5);\n# each picture is gfx/loadingscreens/<name>.dds with the sprite GFX_<name>_small. The first is the default.\n${menus.map(k => `${k} = {\n}`).join('\n')}\n`);

  // Loading-screen chrome: one strip per job on black, cut by its rows; the progress track and fill share one window
  // so the fill lies exactly over the groove.
  const windows = new Map();
  for (const c of CHROME) {
    const s = await source(c.raw); if (!s.ok) throw new Error(`${c.raw}: ${s.why}`);
    windows.set(c.id, await stripWindow(s.file));
  }
  const pairWin = ids => ids.map(id => windows.get(id)).reduce((a, b) => ({ x0: Math.min(a.x0, b.x0), x1: Math.max(a.x1, b.x1), y0: Math.min(a.y0, b.y0), y1: Math.max(a.y1, b.y1) }));
  for (const c of CHROME) {
    const s = sources.get(c.raw), win = c.pair ? pairWin(CHROME.filter(x => x.pair === c.pair).map(x => x.id)) : windows.get(c.id);
    const buf = await stripRgba(rawFile(c.raw), win, c.w, c.h);
    ship(c.file, ddsOf(buf, c.w, c.h), { rel: c.raw, sha: s.sha }, [`crop x ${win.x0}-${win.x1} y ${win.y0}-${win.y1}`, 'column brightness matte', `lanczos3 fill ${c.w}x${c.h}`, 'dds a8r8g8b8']);
  }

  // The ZIN emblem replaces the game logo texture (448x175); keyed, trimmed and fitted with transparent sides.
  const em = await source('menu/frontend-emblem.png'); if (!em.ok) throw new Error(`frontend-emblem: ${em.why}`);
  {
    const { data, info } = await sharp(em.file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const keyed = keyMatte(data, info.width, info.height), box = alphaBox(keyed, info.width, info.height);
    const fitted = await rawImage(keyed, info.width, info.height).extract(box).resize(EMBLEM.w - 2 * EMBLEM.pad, EMBLEM.h - 2 * EMBLEM.pad, { fit: 'contain', kernel: 'lanczos3', background: { r: 0, g: 0, b: 0, alpha: 0 } }).ensureAlpha().raw().toBuffer();
    const buf = await rgba(rawImage(fitted, EMBLEM.w - 2 * EMBLEM.pad, EMBLEM.h - 2 * EMBLEM.pad).extend({ top: EMBLEM.pad, bottom: EMBLEM.pad, left: EMBLEM.pad, right: EMBLEM.pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }), EMBLEM.w, EMBLEM.h);
    ship(EMBLEM.file, ddsOf(buf, EMBLEM.w, EMBLEM.h), { rel: 'menu/frontend-emblem.png', sha: em.sha }, ['magenta key matte', 'trim to alpha', `lanczos3 contain ${EMBLEM.w - 2 * EMBLEM.pad}x${EMBLEM.h - 2 * EMBLEM.pad}`, `pad ${EMBLEM.pad}`, 'dds a8r8g8b8']);
  }

  // Bookmark picture "The Fourth Age" (180x104, cover crop) and the two vanilla default pictures it replaces.
  const bm = await source('menu/frontend-bookmark.png'); if (!bm.ok) throw new Error(`frontend-bookmark: ${bm.why}`);
  {
    const bytes = ddsOf(await rgba(sharp(bm.file).resize(BOOKMARK.w, BOOKMARK.h, { fit: 'cover', position: 'centre', kernel: 'lanczos3' }), BOOKMARK.w, BOOKMARK.h), BOOKMARK.w, BOOKMARK.h);
    for (const out of [BOOKMARK.file, 'gfx/interface/select_date_1936.dds', 'gfx/interface/select_date_1939.dds']) ship(out, bytes, { rel: 'menu/frontend-bookmark.png', sha: bm.sha }, ['lanczos3 cover 180x104', 'dds a8r8g8b8']);
  }
  staged.text('interface/zin_frontend.gfx', gfxFile('Frontend sprites (main menu and frontend spec section 3).', [spriteBlock(BOOKMARK.sprite, BOOKMARK.file)]));

  // Loading tips (loading spec §7): every vanilla tip key replaced, 190 keys in the replace folder.
  const tips = (await readJson(TIPS_FILE)).tips, vanillaTips = await vanillaTipCount(), tipProblems = checkTips(tips, vanillaTips);
  if (tipProblems.length) throw new Error(`loading tips: ${tipProblems.slice(0, 10).join('; ')}`);
  staged.add('localisation/replace/zin_loading_tips_l_english.yml', ymlOrdered(tips.map(r => [r.key, tipString(r)])));

  // Focus and idea icons from the catalog sheets (A3). Keys whose sheet is not accepted point at the fallback.
  const { icons: sheets, events } = await loadCells();
  const iconKeys = sheets.flatMap(s => s.keys), dup = iconKeys.find((k, i) => iconKeys.indexOf(k) !== i);
  if (dup) throw new Error(`icon key ${dup} appears twice in the cell map`);
  if (!iconKeys.includes(FALLBACK_ICON)) throw new Error(`the fallback icon key ${FALLBACK_ICON} is missing from the cell map`);
  const iconFile = new Map();
  for (const sheet of sheets) {
    const rel = `icons/${sheet.sheet}.png`, s = await source(rel);
    if (!s.ok) { note(`${rel}: ${s.why}; ${sheet.keys.length} keys use the ${FALLBACK_ICON} icon`); continue; }
    const r = await findRegionsAdaptive(s.file, sheet.keys.length, { cols: sheet.cols, rows: sheet.rows, aspect: [0.75, 1.33], minAreaFraction: 0.25 });
    if (!r.ok) throw new Error(`${rel}: found ${r.found} medallions, expected ${sheet.keys.length}`);
    const { data, info } = await sharp(s.file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    for (const [i, key] of sheet.keys.entries()) {
      const m = medallionMask(data, info.width, r.regions[i]), box = alphaBox(m.buf, m.w, m.h);
      const fw = FOCUS.w - 2 * FOCUS.pad, fh = FOCUS.h - 2 * FOCUS.pad;
      const inner = await rawImage(m.buf, m.w, m.h).extract(box).resize(fw, fh, { fit: 'contain', kernel: 'lanczos3', background: { r: 0, g: 0, b: 0, alpha: 0 } }).ensureAlpha().raw().toBuffer();
      const focus = await rgba(rawImage(inner, fw, fh).extend({ top: FOCUS.pad, bottom: FOCUS.pad, left: FOCUS.pad, right: FOCUS.pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }), FOCUS.w, FOCUS.h);
      ship(`gfx/interface/goals/zin/${key}.dds`, ddsOf(focus, FOCUS.w, FOCUS.h), { rel, sha: s.sha }, [`cell ${i}`, 'medallion outline alpha', `lanczos3 contain ${fw}x${fh}`, `pad ${FOCUS.pad}`, 'dds a8r8g8b8']);
      const side = Math.round(IDEA.field * Math.min(box.width, box.height)), cx = m.x0 + box.left + box.width / 2, cy = m.y0 + box.top + box.height / 2;
      const sq = { left: Math.round(cx - side / 2), top: Math.round(cy - side / 2), width: side, height: side };
      const idea = await rgba(sharp(s.file).extract(sq).resize(IDEA.w, IDEA.h, { fit: 'fill', kernel: 'lanczos3' }), IDEA.w, IDEA.h);
      ship(`gfx/interface/ideas/zin/${key}.dds`, ddsOf(idea, IDEA.w, IDEA.h), { rel, sha: s.sha }, [`cell ${i}`, `square ${side} in the field`, 'lanczos3 64x64', 'dds a8r8g8b8']);
      iconFile.set(key, key);
    }
  }
  if (!iconFile.has(FALLBACK_ICON)) throw new Error(`the fallback icon ${FALLBACK_ICON} has no accepted art`);
  const iconTex = k => iconFile.get(k) ?? FALLBACK_ICON;
  staged.text('interface/zin_catalog_focus_icons.gfx', gfxFile('Focus icons of the icon catalog.', iconKeys.map(k => spriteBlock(SPRITE.focus(k), `gfx/interface/goals/zin/${iconTex(k)}.dds`))));
  staged.text('interface/zin_catalog_focus_icons_shine.gfx', gfxFile('Shine sprites of the catalog focus icons (vanilla goals_shine.gfx structure).', iconKeys.map(k => shineBlock(SPRITE.focus(k), `gfx/interface/goals/zin/${iconTex(k)}.dds`))));
  staged.text('interface/zin_catalog_ideas.gfx', gfxFile('Idea icons of the icon catalog; an idea writes picture = zin_<key>.', iconKeys.map(k => spriteBlock(SPRITE.idea(k), `gfx/interface/ideas/zin/${iconTex(k)}.dds`))));

  // Event (210x176) and news (397x153) pictures. "both": news from the whole picture, standard from a centred crop.
  const pictureKeys = events.map(e => e.key), evtFile = new Map(), newsFile = new Map();
  if (!pictureKeys.includes(FALLBACK_PICTURE)) throw new Error(`the fallback picture key ${FALLBACK_PICTURE} is missing`);
  for (const e of events) {
    if (!['both', 'standard', 'news'].includes(e.crop)) throw new Error(`event ${e.key}: unknown crop ${e.crop}`);
    const rel = `events/${e.key}.png`, s = await source(rel);
    if (!s.ok) { note(`${rel}: ${s.why}; uses the ${FALLBACK_PICTURE} picture`); continue; }
    const meta = await sharp(s.file).metadata();
    if (e.crop !== 'news') {
      let img = sharp(s.file), ops = [`lanczos3 cover ${EVENT.w}x${EVENT.h}`];
      if (e.crop === 'both') { const w = Math.round(meta.height * EVENT.w / EVENT.h), crop = { left: Math.floor((meta.width - w) / 2), top: 0, width: w, height: meta.height }; img = img.extract(crop); ops = [`centre crop ${w}x${meta.height}`, `lanczos3 ${EVENT.w}x${EVENT.h}`]; }
      ship(`gfx/event_pictures/zin/zin_evt_${e.key}.dds`, ddsOf(await rgba(img.resize(EVENT.w, EVENT.h, { fit: 'cover', position: 'centre', kernel: 'lanczos3' }), EVENT.w, EVENT.h), EVENT.w, EVENT.h), { rel, sha: s.sha }, [...ops, 'dds a8r8g8b8']);
      evtFile.set(e.key, e.key);
    }
    if (e.crop !== 'standard') {
      ship(`gfx/event_pictures/zin/zin_news_${e.key}.dds`, ddsOf(await rgba(sharp(s.file).resize(NEWS.w, NEWS.h, { fit: 'cover', position: 'centre', kernel: 'lanczos3' }), NEWS.w, NEWS.h), NEWS.w, NEWS.h), { rel, sha: s.sha }, [`lanczos3 cover ${NEWS.w}x${NEWS.h}`, 'dds a8r8g8b8']);
      newsFile.set(e.key, e.key);
    }
  }
  if (!evtFile.has(FALLBACK_PICTURE) || !newsFile.has(FALLBACK_PICTURE)) throw new Error(`the fallback picture ${FALLBACK_PICTURE} needs both crops`);
  const evtKeys = events.filter(e => e.crop !== 'news').map(e => e.key), newsKeys = events.filter(e => e.crop !== 'standard').map(e => e.key);
  staged.text('interface/zin_event_pictures.gfx', gfxFile('Event (210x176) and news (397x153) pictures of the icon catalog.', [
    ...evtKeys.map(k => spriteBlock(SPRITE.evt(k), `gfx/event_pictures/zin/zin_evt_${evtFile.has(k) ? k : FALLBACK_PICTURE}.dds`)),
    ...newsKeys.map(k => spriteBlock(SPRITE.news(k), `gfx/event_pictures/zin/zin_news_${newsFile.has(k) ? k : FALLBACK_PICTURE}.dds`)),
  ]));

  // Sources, provenance and the manifest of every shipped file.
  for (const [rel, s] of [...sources].sort(([a], [b]) => a.localeCompare(b, 'en'))) staged.add(`art/source/${rel}`, s.bytes);
  if (!staged.files.has('art/source/provenance.jsonl')) staged.add('art/source/provenance.jsonl', await readFile(provenanceFile()));
  const decisions = [...sources].filter(([, s]) => s.decision).map(([rel, s]) => ({ source: `art/source/${rel}`, sha256: s.sha, basis: s.decision.basis, crop: s.decision.crop }));
  staged.add('art/source/presentation_manifest.json', Buffer.from(JSON.stringify({ generator: 'tools/content/modules/presentation.mjs', decisions, files: manifest.sort((a, b) => a.out.localeCompare(b.out, 'en')) }, null, 1) + '\n'));

  return {
    bookmark: { picture: BOOKMARK.sprite },
    warnings,
    counts: { loadingScreens: loading.length, menuBackgrounds: menus.length, focusIcons: iconFile.size, ideaIcons: iconFile.size, iconKeys: iconKeys.length, eventPictures: evtFile.size, newsPictures: newsFile.size, pictureKeys: pictureKeys.length, tips: tips.length, sources: sources.size, files: manifest.length },
  };
}
