// The text scan (docs/specs/07_interface/05_text_sweep.md, section 6). It reads the staged tree and the installed
// game's localisation (read-only) and proves three things: every vanilla key the game can still display is replaced
// or accounted for; no displayed ZIN text holds a banned word; every colour, icon and placeholder code is intact.
// It never prints a vanilla value: findings quote only ZIN text, cut at 80 characters.
//
//   import { runTextScan, writeScanReport, assertTextScan } from './checks/text_scan.mjs';
//   const scan = await runTextScan(staged);          // build.mjs, after buildFocusTrees
//   writeScanReport(staged, scan);                   // docs/design/validation/text_scan_report.json
//   assertTextScan(scan);                            // throws on an error finding of a family in effect
//   node tools/content/checks/text_scan.mjs [stagedDir] [--report file]
//
// Checks: X1 inventory, X2 missing, X3 vanilla shown, X4 copy, X5 banned words, X6 glossary, X7 colour codes,
// X8 icon codes, X9 placeholder parity, X10 nesting, X11 format, X12 duplicates, X13 languages, X14 ownership,
// X15 people. X16 (label length) needs the interface render pass and is not run here.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GAME } from '../lib/paths.mjs';
import { LANGUAGES, parseLocText, headerOf, signature, sigText, signatureDiff, displayText, isStructural, isLabelKey, expandNested, nonCp1252 } from '../lib/loc_parse.mjs';
import { loadRuleSet, compileBanned, findBanned, allowanceCovers } from '../lib/banned.mjs';
import { loadGlossary } from '../lib/text_engine.mjs';
import { loadFamilyTable, loadFamilyDef, claimsOf, TEXT_DATA } from '../modules/text_sweep.mjs';

export const SCAN_REPORT_PATH = 'docs/design/validation/text_scan_report.json';
export const NEAR_COPY = 0.85;                       // spec question 4: tunable
export const NEAR_COPY_MIN_WORDS = 5;
const COLOUR_CODES = new Set([...'CLWBGRbgYHTO0123456789t!']);
const MAX_NEST = 6;
const clip = s => { const t = String(s).replace(/\n/g, ' '); return t.length > 80 ? t.slice(0, 77) + '...' : t; };

// ------------------------------------------------------------------------------------------------ loading
async function walk(dir, ext, base = dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(f, ext, base));
    else if (!ext || e.name.endsWith(ext)) out.push(path.relative(base, f).split(path.sep).join('/'));
  }
  return out.sort();
}

// A directory of a staged tree (for the command line): { files: Map<rel, Buffer> }.
export async function stagedFromDir(dir) {
  const files = new Map();
  for (const rel of await walk(dir, null)) files.set(rel, await readFile(path.join(dir, rel)));
  return { files };
}

// Every English key of the installed game: Map<key, { value, file }> plus the file list.
async function loadAllVanilla(locDir) {
  const dir = path.join(locDir, 'english');
  const keys = new Map(), files = [];
  if (!existsSync(dir)) return { keys, files, present: false };
  for (const name of (await readdir(dir)).filter(n => n.endsWith('_l_english.yml')).sort()) {
    files.push(name);
    for (const { key, value } of parseLocText(await readFile(path.join(dir, name), 'utf8'))) if (!keys.has(key)) keys.set(key, { value, file: name });
  }
  return { keys, files, present: true };
}

// Facts the reach rules and the code checks need from the game and the staged tree. A test passes its own.
async function loadReachSources(staged, gameDir, ctx) {
  const r = ctx.reach ?? {};
  const out = { alertIds: r.alertIds, modifierIds: r.modifierIds, guiKeys: r.guiKeys, tokens: r.tokens, vanillaTags: r.vanillaTags, liveTags: r.liveTags, sprites: r.sprites };
  if (!out.modifierIds) {
    out.modifierIds = new Set();
    const doc = `${gameDir}/documentation/modifiers_documentation.md`;
    if (existsSync(doc)) for (const m of (await readFile(doc, 'utf8')).matchAll(/^## ([a-z0-9_]+)$/gm)) out.modifierIds.add(m[1]);
  }
  if (!out.alertIds) {
    out.alertIds = new Set();
    const staged_ = staged.files.get('common/alerts.txt')?.toString('utf8');
    const text = staged_ ?? (existsSync(`${gameDir}/common/alerts.txt`) ? await readFile(`${gameDir}/common/alerts.txt`, 'utf8') : '');
    for (const m of text.matchAll(/^\t([A-Za-z0-9_]+)\s*=\s*\{/gm)) out.alertIds.add(m[1]);
  }
  if (!out.vanillaTags) {
    out.vanillaTags = new Set();
    for (const rel of await walk(`${gameDir}/common/country_tags`, '.txt')) for (const m of (await readFile(`${gameDir}/common/country_tags/${rel}`, 'utf8')).matchAll(/^\s*([A-Z][A-Z0-9]{2})\s*=/gm)) out.vanillaTags.add(m[1]);
  }
  if (!out.liveTags) {
    out.liveTags = new Set();
    for (const [rel, b] of staged.files) if (/^common\/country_tags\/.*\.txt$/.test(rel)) for (const m of b.toString('utf8').matchAll(/^\s*([A-Z][A-Z0-9]{2})\s*=/gm)) out.liveTags.add(m[1]);
  }
  if (!out.tokens) {
    out.tokens = new Set();
    for (const [rel, b] of staged.files) if (/^(common|events|interface|history)\/.*\.(txt|gui|gfx)$/.test(rel)) for (const m of b.toString('utf8').matchAll(/[A-Za-z_][A-Za-z0-9_.]*/g)) out.tokens.add(m[0]);
  }
  if (!out.guiKeys) {
    out.guiKeys = new Set();
    const attr = /\b(?:text|buttonText|pdx_tooltip|pdx_tooltip_delayed|tooltip|context_aware_text|context_aware_tooltip|pdx_disabled_tooltip|pdx_disabled_tooltip_delayed)\s*=\s*"?([A-Za-z0-9_.]+)"?/g;
    for (const rel of await walk(`${gameDir}/interface`, '.gui')) if (!staged.files.has(`interface/${rel}`)) for (const m of (await readFile(`${gameDir}/interface/${rel}`, 'utf8')).matchAll(attr)) out.guiKeys.add(m[1]);
    for (const [rel, b] of staged.files) if (/^interface\/.*\.gui$/.test(rel)) for (const m of b.toString('utf8').matchAll(attr)) out.guiKeys.add(m[1]);
  }
  if (!out.sprites) {
    out.sprites = new Set();
    const name = /\bname\s*=\s*"(GFX_[A-Za-z0-9_]+)"/g;
    for (const rel of await walk(`${gameDir}/interface`, '.gfx')) if (!staged.files.has(`interface/${rel}`)) for (const m of (await readFile(`${gameDir}/interface/${rel}`, 'utf8')).matchAll(name)) out.sprites.add(m[1]);
    for (const [rel, b] of staged.files) if (/^interface\/.*\.gfx$/.test(rel)) for (const m of b.toString('utf8').matchAll(name)) out.sprites.add(m[1]);
  }
  return out;
}

function words(text) { return displayText(text).toLowerCase().split(/[^\p{L}\p{N}']+/u).filter(Boolean); }
function overlap(a, b) {
  const wa = words(a), wb = words(b);
  if (wa.length < NEAR_COPY_MIN_WORDS) return 0;
  const bag = new Map();
  for (const w of wb) bag.set(w, (bag.get(w) ?? 0) + 1);
  let common = 0;
  for (const w of wa) { const n = bag.get(w) ?? 0; if (n > 0) { common++; bag.set(w, n - 1); } }
  return common / Math.max(wa.length, wb.length);
}

// ------------------------------------------------------------------------------------------------ the scan
// ctx (all optional): vanillaDir, gameDir, familyTable, familyDefs (neutral and engine lists), dataDir, banned,
// glossary, reach, languages, listAll (list every unreplaced key, not only the banned ones).
export async function runTextScan(staged, ctx = {}) {
  const gameDir = ctx.gameDir ?? GAME;
  const locDir = ctx.vanillaDir ?? `${gameDir}/localisation`;
  const table = ctx.familyTable ?? await loadFamilyTable();
  const idx = ctx.glossary ?? await loadGlossary();
  const compiled = ctx.compiledBanned ?? compileBanned(await loadRuleSet({ banned: ctx.banned, extra: ctx.bannedExtra, glossary: idx }));
  const languages = ctx.languages ?? LANGUAGES;
  const dataDir = ctx.dataDir ?? TEXT_DATA;
  const findings = [];
  const add = (check, severity, family, key, file, detail, rule) => findings.push({ check, severity, family: family ?? 'other', key, file, ...(rule ? { rule } : {}), detail: clip(detail) });

  const fileFamily = new Map();
  for (const [name, def] of Object.entries(table.families)) for (const s of def.files) fileFamily.set(`${s}_l_english.yml`, name);
  const claimed = claimsOf(table.families);
  const famOf = (key, file) => claimed(key, fileFamily.get(file));
  const vanilla = await loadAllVanilla(locDir);
  const reach = await loadReachSources(staged, gameDir, ctx);

  // Family data: neutral and engine lists, and whether a family has data at all.
  const defs = {};
  for (const name of Object.keys(table.families)) {
    if (ctx.familyDefs?.[name]) defs[name] = ctx.familyDefs[name];
    else { const d = await loadFamilyDef(dataDir, name); if (d) defs[name] = d; }
  }
  const kept = new Map();
  for (const [name, d] of Object.entries(defs)) for (const mode of ['neutral', 'engine']) for (const item of d[mode] ?? []) for (const k of item.keys ?? []) kept.set(k, { mode, family: name });

  // ---- ZIN localisation files of the staged tree (X11 format, X12 duplicates) --------------------------------
  const zin = new Map();            // English: key -> { value, file, family }
  const zinFiles = [];              // { rel, lang, entries, family }
  const fileKeys = new Map();       // rel -> Map(key -> value)
  for (const [rel, bytes] of [...staged.files].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    const m = /^localisation\/(?:(replace)\/|([a-z_]+)\/)?([^/]+)_l_([a-z_]+)\.yml$/.exec(rel);
    if (!/^localisation\/.*\.yml$/.test(rel)) continue;
    const name = path.posix.basename(rel);
    if (!m) { add('X11', 'error', null, '', rel, 'a localisation file must be named <name>_l_<language>.yml'); continue; }
    const lang = m[4];
    if (!languages.includes(lang)) { add('X11', 'error', null, '', rel, `unknown language ${lang}`); continue; }
    const text = bytes.toString('utf8');
    if (!(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf)) add('X11', 'error', null, '', rel, 'the file has no UTF-8 byte order mark');
    if (headerOf(text) !== `l_${lang}`) add('X11', 'error', null, '', rel, `the header must be l_${lang}:`);
    const family = /^localisation\/replace\/zin_([a-z_]+)_l_[a-z_]+\.yml$/.exec(rel)?.[1];
    const entries = parseLocText(text);
    const seen = new Map();
    for (const { key, value } of entries) {
      if (!/^[A-Za-z0-9_.\-']+$/.test(key)) add('X11', 'error', family, key, rel, 'the key holds characters the game does not accept');
      if (seen.has(key)) add('X12', 'error', family, key, rel, 'the key is defined twice in this file');
      seen.set(key, value);
      const bad = nonCp1252(value);
      if (bad.length) add('X11', 'error', family, key, rel, `characters outside Windows-1252: ${[...new Set(bad)].join('')} in ${value}`);
      if (value.trim() === '' && !(ctx.emptyOk ?? []).includes(key)) add('X11', 'error', family, key, rel, 'the value is empty');
    }
    fileKeys.set(rel, seen);
    zinFiles.push({ rel, lang, name, family: table.families[family] ? family : null, entries });
    if (lang !== 'english') continue;
    for (const { key, value } of entries) {
      if (zin.has(key) && zin.get(key).file !== rel) add('X12', 'error', family, key, rel, `the key is also defined in ${zin.get(key).file} (check X14)`);
      else if (!zin.has(key)) zin.set(key, { value, file: rel, family: table.families[family] ? family : null, replace: m[1] === 'replace' });
    }
  }

  // ---- the effective English table: vanilla, minus whole files a same-name ZIN file replaces, plus ZIN ----------
  const eff = new Map();
  const replacedWhole = new Set(zinFiles.filter(f => f.lang === 'english' && /^localisation\/english\//.test(f.rel) && vanilla.files.includes(f.name)).map(f => f.name));
  for (const [k, v] of vanilla.keys) if (!replacedWhole.has(v.file)) eff.set(k, v.value);
  for (const [k, v] of zin) eff.set(k, v.value);

  // ---- per ZIN key checks (X4 X5 X7 X8 X9 X10 X6 X14) -------------------------------------------------------
  const allowanceUse = new Map((compiled.allowances ?? []).map(a => [a.id, 0]));
  const zinBanned = { error: 0, review: 0 };
  const bannedByFamily = {};
  for (const [key, z] of zin) {
    const fam = z.family ?? famOf(key, vanilla.keys.get(key)?.file) ?? 'other';
    const v = vanilla.keys.get(key);
    const base = path.posix.basename(z.file);
    // X5
    const rendered = expandNested(z.value, eff, MAX_NEST);
    for (const h of findBanned(displayText(rendered), compiled)) {
      const a = (compiled.allowances ?? []).find(al => allowanceCovers(al, h.id, key, base));
      if (a) { allowanceUse.set(a.id, allowanceUse.get(a.id) + 1); continue; }
      add('X5', h.severity === 'error' ? 'error' : 'warning', fam, key, z.file, `"${h.word}" in ${z.value}`, h.id);
      zinBanned[h.severity === 'error' ? 'error' : 'review']++;
      (bannedByFamily[fam] ??= { error: 0, review: 0 })[h.severity === 'error' ? 'error' : 'review']++;
    }
    // X6: an unexpanded slot, and a people call in a family with no scope
    if (/\{[a-z][a-z0-9_]*(?::[A-Za-z0-9_]+)*\}/.test(z.value) || /\{\$/.test(z.value)) add('X6', 'error', fam, key, z.file, `an unexpanded template slot in ${z.value}`);
    if (/\[zin_term_/.test(z.value) && z.family && table.families[z.family]?.scope !== true) add('X6', 'error', fam, key, z.file, `a people term in a family with no country in scope: ${z.value}`);
    // X7 colour codes
    for (let i = 0; i < z.value.length; i++) {
      if (z.value[i] !== '§') continue;
      const c = z.value[i + 1];
      if (c === undefined) { add('X7', 'error', fam, key, z.file, `a colour sign ends the value: ${z.value}`); break; }
      if (!COLOUR_CODES.has(c)) add('X7', 'error', fam, key, z.file, `unknown colour code §${c} in ${z.value}`);
      i++;
    }
    // X8 icon codes
    if (reach.sprites.size) for (const m of z.value.matchAll(/£([A-Za-z0-9_]+)/g)) { const sprite = m[1].startsWith('GFX_') ? m[1] : `GFX_${m[1]}`; if (!reach.sprites.has(sprite)) add('X8', 'error', fam, key, z.file, `the icon £${m[1]} names no sprite ${sprite}`); }
    // X10 nesting of ZIN keys
    for (const m of z.value.matchAll(/\$([A-Za-z0-9_.\-]+)\$/g)) {
      const ref = m[1];
      if (/^zin_/i.test(ref) && !eff.has(ref)) add('X10', 'error', fam, key, z.file, `$${ref}$ names no key`);
      if (eff.has(ref)) { const depth = nestDepth(ref, eff, [key]); if (depth === -1) add('X10', 'error', fam, key, z.file, `$${ref}$ nests in a cycle`); else if (depth > MAX_NEST) add('X10', 'error', fam, key, z.file, `$${ref}$ nests ${depth} deep (limit ${MAX_NEST})`); }
    }
    if (v) {
      // X9 placeholder parity with the vanilla key
      if (sigText(signature(z.value)) !== sigText(signature(v.value))) add('X9', 'error', fam, key, z.file, `${signatureDiff(signature(v.value), signature(z.value)).join('; ')} in ${z.value}`);
      // X4 copy
      if (!kept.has(key) && !isStructural(v.value)) {
        if (z.value === v.value) add('X4', 'error', fam, key, z.file, `the value is identical to the installed game's: ${z.value}`);
        else if (overlap(z.value, v.value) >= NEAR_COPY) add('X4', 'error', fam, key, z.file, `the value overlaps the installed game's by ${Math.round(overlap(z.value, v.value) * 100)}%: ${z.value}`);
      }
      // X14 a family file writes a key of another family
      const owner = famOf(key, v.file);
      if (z.family && owner && owner !== z.family) add('X14', 'error', z.family, key, z.file, `the key sits in ${v.file}, which the ${owner} family sweeps`);
    }
  }
  // unbalanced colour codes of ZIN-only keys (a vanilla counterpart is checked by X9)
  for (const [key, z] of zin) if (!vanilla.keys.has(key)) {
    let open = 0; for (const m of z.value.matchAll(/§(.)/g)) open += m[1] === '!' ? -1 : 1;
    if (open > 0) add('X7', 'error', z.family ?? 'other', key, z.file, `a colour code is left open: ${z.value}`);
  }

  // ---- X13 languages --------------------------------------------------------------------------------------
  const sweepNames = new Set([...Object.keys(table.families), 'terms', 'calendar']);
  for (const f of zinFiles.filter(f => f.lang === 'english')) {
    const m = /^localisation\/replace\/zin_([a-z_]+)_l_english\.yml$/.exec(f.rel);
    if (!m || !sweepNames.has(m[1])) continue;
    for (const lang of languages.filter(l => l !== 'english')) {
      const copy = fileKeys.get(`localisation/replace/zin_${m[1]}_l_${lang}.yml`);
      if (!copy) { add('X13', 'error', m[1], '', f.rel, `the ${lang} copy is missing`); continue; }
      const eng = fileKeys.get(f.rel);
      for (const [k, v] of eng) if (copy.get(k) !== v) { add('X13', 'error', m[1], k, f.rel, `the ${lang} copy differs or lacks the key`); break; }
      if (copy.size !== eng.size) add('X13', 'error', m[1], '', f.rel, `the ${lang} copy has ${copy.size} keys, English has ${eng.size}`);
    }
  }

  // ---- X15 people ------------------------------------------------------------------------------------------
  const called = new Set();
  for (const [, z] of zin) for (const m of z.value.matchAll(/\[(zin_term_[a-z0-9_]+)\]/g)) called.add(m[1]);
  const script = staged.files.get('common/scripted_localisation/zin_terms.txt')?.toString('utf8') ?? '';
  for (const name of [...called].sort()) if (!new RegExp(`name\\s*=\\s*${name}\\b`).test(script)) add('X15', 'error', 'other', name, 'common/scripted_localisation/zin_terms.txt', `the scripted localisation ${name} is not defined`);
  if (script) for (const e of idx.glossary.entries.filter(e => e.people && Object.keys(e.people).length)) {
    for (const suffix of ['', '_p', '_lc', '_lcp']) {
      const name = `zin_term_${e.id}${suffix}`;
      if (!new RegExp(`name\\s*=\\s*${name}\\b`).test(script)) { add('X15', 'error', 'other', name, 'common/scripted_localisation/zin_terms.txt', 'the glossary variant has no scripted localisation'); continue; }
      for (const k of [`${name}_default`, ...Object.keys(e.people).map(p => `${name}_${p}`)]) if (!zin.has(k)) add('X15', 'error', 'other', k, 'localisation/replace', 'the variant text is missing');
    }
  }

  // ---- X1 inventory ----------------------------------------------------------------------------------------
  const others = table.otherFiles ?? [];
  if (vanilla.present) {
    for (const name of vanilla.files) {
      if (fileFamily.has(name)) continue;
      const stem = name.replace(/_l_english\.yml$/, '');
      if (!others.some(o => new RegExp(o.match).test(stem))) add('X1', 'error', null, '', name, 'the installed file belongs to no family and no other-file row');
    }
    for (const name of fileFamily.keys()) if (!vanilla.files.includes(name)) add('X1', 'error', fileFamily.get(name), '', name, 'a family names a file the installed game lacks');
    const lv = existsSync(`${gameDir}/launcher-settings.json`) ? JSON.parse(await readFile(`${gameDir}/launcher-settings.json`, 'utf8')).rawVersion : null;
    if (lv && table.game && lv !== table.game) add('X1', 'error', null, '', 'launcher-settings.json', `the installed game is ${lv}; the inventory is for ${table.game}`);
  }

  // ---- reach, replaced and still-vanilla keys (X2 X3) ---------------------------------------------------------
  const perFamily = {};
  const fam0 = () => ({ files: 0, keys: 0, exempt: 0, unreached: 0, structural: 0, reachable: 0, zin: 0, neutral: 0, engine: 0, vanillaBanned: 0, vanillaReview: 0, vanillaClean: 0, zinBannedError: 0, zinBannedReview: 0, errors: 0, warnings: 0 });
  for (const [name, def] of Object.entries(table.families)) { perFamily[name] = { ...fam0(), gate: def.gate, data: !!defs[name], files: def.files.length }; }
  const unreplaced = {};
  const exemptRes = (table.exempt ?? []).map(e => ({ re: new RegExp(e.match), reason: e.reason }));
  const engineKeys = new Set(ctx.engineKeys ?? []);
  const effValuesForNest = eff;
  if (vanilla.present) {
    for (const [key, v] of vanilla.keys) {
      const name = famOf(key, v.file);
      if (!name) continue;
      const f = perFamily[name];
      f.keys++;
      const z = zin.get(key);
      const label = isLabelKey(key);
      // out of R: tag-prefixed keys of a tag that no longer exists, listed exemptions, unreferenced object ids
      const tag = /^([A-Z][A-Z0-9]{2})_/.exec(key)?.[1];
      if (z) { f.zin++; f.reachable++; continue; }
      if (tag && reach.vanillaTags.has(tag) && !reach.liveTags.has(tag) && tagPrefixed(key, tag, table.tagWords)) { f.exempt++; continue; }
      if (exemptRes.some(e => e.re.test(key))) { f.exempt++; continue; }
      const stem = v.file.replace(/_l_english\.yml$/, '');
      const labelsByReference = table.families[name].reachLabels?.[stem] === 'referenced';
      if ((!label || labelsByReference) && !reachableObject(key, v.file, table.families[name], reach, engineKeys)) { f.unreached++; continue; }
      f.reachable++;
      const rendered = expandNested(v.value, effValuesForNest, MAX_NEST);
      const k = kept.get(key);
      if (k) { f[k.mode]++; continue; }
      if (isStructural(rendered)) { f.structural++; continue; }
      const hits = findBanned(displayText(rendered), compiled);
      const errorHits = hits.filter(h => h.severity === 'error');
      if (errorHits.length) { f.vanillaBanned++; (unreplaced[name] ??= []).push(key); }
      else if (hits.length) { f.vanillaReview++; if (ctx.listAll) (unreplaced[name] ??= []).push(key); }
      else { f.vanillaClean++; if (ctx.listAll) (unreplaced[name] ??= []).push(key); }
    }
    // X2: a reachable key whose definition a whole-file override removed
    for (const [key, v] of vanilla.keys) if (replacedWhole.has(v.file) && !eff.has(key) && fileFamily.has(v.file)) add('X2', 'error', fileFamily.get(v.file), key, v.file, 'the whole-file override of the family drops this key');
  }
  for (const [name, b] of Object.entries(bannedByFamily)) if (perFamily[name]) { perFamily[name].zinBannedError = b.error; perFamily[name].zinBannedReview = b.review; }

  // ---- gates: X3 for families in effect --------------------------------------------------------------------
  for (const [name, f] of Object.entries(perFamily)) {
    const gate = table.families[name].gate;
    if (gate === 'banned' || gate === 'strict') for (const key of unreplaced[name] ?? []) {
      const v = vanilla.keys.get(key);
      add('X3', 'error', name, key, v.file, 'the key still shows the installed game\'s value, which holds a banned word');
    }
    if (gate === 'strict') {
      f.strictMissing = f.vanillaClean + f.vanillaReview;
      if (f.strictMissing) add('X3', 'error', name, '', '', `${f.strictMissing} reachable keys show the installed game's value`);
    }
  }

  // ---- the allowance list: one that matched nothing fails (spec section 8) -----------------------------------
  const allowances = [...allowanceUse].map(([id, used]) => ({ id, used }));
  if (ctx.checkAllowances) for (const a of allowances) if (!a.used) add('X5', 'error', null, '', '', `the allowance ${a.id} matched nothing`);

  // ---- assemble ----------------------------------------------------------------------------------------------
  for (const f of findings) { const pf = perFamily[f.family]; if (pf) pf[f.severity === 'error' ? 'errors' : 'warnings']++; }
  const order = { error: 0, warning: 1 };
  findings.sort((a, b) => a.check.localeCompare(b.check, 'en', { numeric: true }) || order[a.severity] - order[b.severity] || a.family.localeCompare(b.family, 'en') || a.key.localeCompare(b.key, 'en') || a.file.localeCompare(b.file, 'en') || (a.rule ?? '').localeCompare(b.rule ?? '', 'en'));
  const sum = k => Object.values(perFamily).reduce((n, f) => n + f[k], 0);
  const totals = Object.fromEntries(['keys', 'exempt', 'unreached', 'reachable', 'zin', 'neutral', 'engine', 'structural', 'vanillaBanned', 'vanillaReview', 'vanillaClean', 'zinBannedError', 'zinBannedReview'].map(k => [k, sum(k)]));
  const errors = findings.filter(f => f.severity === 'error');
  const failing = errors.filter(f => {
    if (['X1', 'X11', 'X12', 'X14'].includes(f.check)) return true;
    if (f.family === 'other') return ctx.strictAll === true;
    const gate = table.families[f.family]?.gate ?? 'off';
    return gate !== 'off';
  });
  return {
    schema: 1,
    game: table.game ?? null,
    vanilla: vanilla.present,
    ok: failing.length === 0,
    totals,
    families: perFamily,
    allowances,
    unreplaced: Object.fromEntries(Object.entries(unreplaced).map(([k, v]) => [k, v.sort()])),
    counts: { errors: errors.length, warnings: findings.length - errors.length, failing: failing.length, byCheck: Object.fromEntries([...new Set(findings.map(f => f.check))].sort().map(c => [c, findings.filter(f => f.check === c).length])) },
    findings,
    failing,
  };
}

// A key is tag-prefixed when it starts with the tag of a vanilla country. A few tags are also English words (CAN, MAN):
// their generic keys (CAN_NOT_UNASSIGN_...) are not exempt unless the rest looks like per-country content.
function tagPrefixed(key, tag, tagWords = []) {
  if (!tagWords.includes(tag)) return true;
  return /^[A-Z]{3}_(GATHERING_STORM|BLITZKRIEG|TAOG|[a-z])/.test(key);
}

function nestDepth(ref, eff, trail) {
  if (trail.includes(ref)) return -1;
  const v = eff.get(ref);
  if (v === undefined) return 0;
  let deepest = 0;
  for (const m of v.matchAll(/\$([A-Za-z0-9_.\-]+)\$/g)) {
    if (!eff.has(m[1])) continue;
    const d = nestDepth(m[1], eff, [...trail, ref]);
    if (d === -1) return -1;
    deepest = Math.max(deepest, d);
  }
  return 1 + deepest;
}

// Reach of an object id (a key that is not an upper-case label), spec section 6: modifiers by the documentation,
// engine keys by the data file, anything else only when a staged script or interface file names it.
function reachableObject(key, file, famDef, reach, engineKeys) {
  const stem = file.replace(/_l_english\.yml$/, '');
  const rule = famDef.reachOther?.[stem] ?? famDef.reachOther?.default ?? 'referenced';
  if (rule === 'all') return true;
  if (engineKeys.has(key)) return true;
  if (reach.guiKeys.has(key) || reach.tokens.has(key)) return true;
  if (rule === 'alerts') {
    for (const id of reach.alertIds) if (key === id || key.startsWith(`${id}_`)) return true;
    return false;
  }
  if (rule === 'modifiers') {
    const base = key.replace(/_(tt|desc|NOT)$/, '').replace(/^modifier_/i, '').toLowerCase();
    return reach.modifierIds.has(base);
  }
  return false;
}

// ------------------------------------------------------------------------------------------------ reporting
export function writeScanReport(staged, scan, rel = SCAN_REPORT_PATH) {
  const body = { ...scan, failing: undefined };
  staged.files.set(rel, Buffer.from(JSON.stringify(body, null, 1) + '\n'));
}

export function summariseScan(scan) {
  const lines = [`text scan: ${scan.ok ? 'ok' : 'FAILED'}; ${scan.counts.errors} errors, ${scan.counts.warnings} warnings (${scan.counts.failing} failing)`];
  for (const [name, f] of Object.entries(scan.families)) {
    if (!f.keys && !f.data) continue;
    lines.push(`${name.padEnd(13)} gate ${String(f.gate).padEnd(7)} keys ${String(f.keys).padStart(5)} reach ${String(f.reachable).padStart(5)} zin ${String(f.zin).padStart(5)} structural ${String(f.structural).padStart(4)} vanilla banned ${String(f.vanillaBanned).padStart(5)} review ${String(f.vanillaReview).padStart(4)} clean ${String(f.vanillaClean).padStart(5)} zin banned ${f.zinBannedError}`);
  }
  return lines.join('\n');
}

export function assertTextScan(scan) {
  if (scan.ok) return;
  const lines = scan.failing.slice(0, 20).map(f => `${f.check} ${f.family} ${f.key || '-'} ${f.file}: ${f.detail}${f.rule ? ` (${f.rule})` : ''}`);
  throw new Error(`The text scan found ${scan.failing.length} failing findings:\n${lines.join('\n')}${scan.failing.length > 20 ? `\n... and ${scan.failing.length - 20} more` : ''}`);
}

// ------------------------------------------------------------------------------------------------ command line
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const args = process.argv.slice(2);
  const reportAt = args.includes('--report') ? args[args.indexOf('--report') + 1] : null;
  const dir = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--report');
  if (!dir) { console.error('usage: node text_scan.mjs <stagedDir> [--report file] [--list]'); process.exit(2); }
  const staged = await stagedFromDir(path.resolve(dir));
  const scan = await runTextScan(staged, { listAll: args.includes('--list') });
  console.log(summariseScan(scan));
  if (reportAt) { const { writeFile } = await import('node:fs/promises'); await writeFile(reportAt, JSON.stringify({ ...scan, failing: undefined }, null, 1) + '\n'); }
  process.exit(scan.ok ? 0 : 1);
}
