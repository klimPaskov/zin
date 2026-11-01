// The frontend text and the bookmark (docs/specs/07_interface/03_main_menu_and_frontend.md sections 2.2, 3, 4 and 5; UI overhaul lane W6).
//
//   buildFrontendText(staged)                         -> { keys }       early: the menu title lines, the filter labels, the difficulty names
//   buildBookmark(staged, { countries, table })       -> { great, minors, labels }   after the focus trees and every startup idea are staged
//
// The bookmark "The Fourth Age" (common/bookmarks/world.txt) lists the great realms in one row and every realm with a regional focus tree
// (plus the great realms that do not fit the row) in the scrollable list, each with three of its starting spirits, three of its focuses and
// its description: its situation in 4A 1748, its founding and its banner (K68), from tools/content/data/world/history/<region>.json. The
// filter buttons are the lands of Aoaz (data/frontend.json labels). Every name the bookmark uses is checked against the staged tree: an idea
// must be defined and added at the start for that realm, a focus must be compiled and its default name must be plain public text (no
// scripted face). Every frontend text passes the secrecy and modern-word scan of the loading text (presentation.mjs FORBIDDEN): the frontend
// is shown before any game starts.
//
// Data: tools/content/data/frontend.json. Writes common/bookmarks/world.txt, localisation/english/zin_frontend_l_english.yml,
// localisation/english/zin_bookmark_l_english.yml and localisation/replace/zin_frontend_replace_l_english.yml.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { START_DATE } from '../lib/calendar.mjs';
import { yml } from '../lib/core.mjs';
import { forbiddenIn, isCp1252 } from './presentation.mjs';

export const FRONTEND_FILE = fileURLToPath(new URL('../data/frontend.json', import.meta.url));
const HISTORY_DIR = fileURLToPath(new URL('../data/world/history/', import.meta.url));
const FOCUS_DIR = fileURLToPath(new URL('../../../docs/design/focus/', import.meta.url));
const DESCRIPTOR = fileURLToPath(new URL('../../../descriptor.mod', import.meta.url));
export const BOOKMARK_FILE = 'common/bookmarks/world.txt';
export const BOOKMARK_PICTURE = 'GFX_zin_bookmark_fourth_age';
export const loadFrontend = (file = FRONTEND_FILE) => JSON.parse(readFileSync(file, 'utf8'));
export const descKey = key => `ZIN_FOURTH_AGE_DESC_${key.toUpperCase()}`;
export const labelKey = id => `ZIN_REGION_LABEL_${id.toUpperCase()}`;

// ---------------------------------------------------------------------------------------------------- lore
// Realm lore by name: the situation in 4A 1748, the founding date, the banner.
export function loadRealmLore(dir = HISTORY_DIR) {
  const out = new Map();
  for (const f of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) for (const c of JSON.parse(readFileSync(path.join(dir, f), 'utf8')).countries ?? []) out.set(c.name, { today: c.today, founded: c.founding?.date ?? null, banner: c.sign?.device ?? null });
  return out;
}
// Sentences of a text, kept whole while the total stays within `max` characters (at least the first sentence).
export function sentencesWithin(text, max) {
  const parts = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) ?? [text];
  let out = '';
  for (const p of parts) { if (out && (out + p).trim().length > max) break; out += p; }
  return out.trim();
}
// The description of one realm: its situation (trimmed by sentence), its founding and its banner.
export function describe(lore, { override, maxChars, foundedLabel, bannerLabel }) {
  const tail = [lore.founded ? `${foundedLabel} ${lore.founded}.` : null, lore.banner ? `${bannerLabel}: ${lore.banner}` : null].filter(Boolean).join(' ');
  const room = maxChars - tail.length - 2;
  return `${sentencesWithin(override ?? lore.today, room)}\n\n${tail}`;
}
// Problems of one frontend text: the secrecy, superseded-name and modern-word scan, the code page and the characters a .yml string cannot hold.
export function textProblems(where, text) {
  const out = forbiddenIn(text).map(w => `${where}: ${w}`);
  if (!isCp1252(text)) out.push(`${where}: a character outside Windows-1252`);
  if (/[$[\]]/.test(text)) out.push(`${where}: a $, [ or ] (the frontend never evaluates scripted text)`);
  return out;
}

// ---------------------------------------------------------------------------------------------------- staged tree readers
const textOf = (staged, re) => [...staged.files].filter(([k]) => re.test(k)).map(([, v]) => v.toString('utf8'));
// Ideas defined in common/ideas: the names at depth 2 (`ideas = { <category> = { <name> = {`).
export function definedIdeas(texts) {
  const out = new Set();
  for (const t of texts) {
    let depth = 0;
    for (const raw of t.split('\n')) {
      const line = raw.replace(/#.*/, '');
      const m = /^\s*([A-Za-z0-9_]+)\s*=\s*\{/.exec(line);
      if (m && depth === 2) out.add(m[1]);
      depth += (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
    }
  }
  return out;
}
// The ideas each tag receives in a one-line startup block of the on_actions (`TAG = { add_ideas = x ... }` or
// `TAG = { add_ideas = { x y } ... }`), in order of appearance.
export function startIdeas(texts) {
  const out = new Map();
  for (const t of texts) for (const m of t.matchAll(/^[ \t]*([A-Z][A-Z0-9]{2}) = \{(.*)\}[ \t\r]*$/gm)) for (const a of m[2].matchAll(/add_ideas = (?:\{([^}]*)\}|([a-z0-9_]+))/g)) {
    const l = out.get(m[1]) ?? [];
    for (const id of (a[1] ?? a[2]).trim().split(/\s+/)) if (id && !l.includes(id)) l.push(id);
    out.set(m[1], l);
  }
  return out;
}
// Which starting spirits the entry shows first: the realm's own culture and faith, then its world and land spirits, then its people.
const IDEA_ORDER = [/^zin_culture_/, /^zin_faith_/, /^zin_culture2_/, /^zin_world_/, /^zin_econ_/, /^zin_people_/];
const ideaRank = id => { const i = IDEA_ORDER.findIndex(re => re.test(id)); return i < 0 ? IDEA_ORDER.length : i; };
// The focus ids of the compiled trees.
export function compiledFocuses(texts) {
  const out = new Set();
  for (const t of texts) for (const m of t.matchAll(/^\t\tid = ([a-z0-9_]+)/gm)) out.add(m[1]);
  return out;
}
// Localisation values of the staged english files (the default names).
export function locValues(texts) {
  const out = new Map();
  for (const t of texts) for (const m of t.matchAll(/^\s*([A-Za-z0-9_.]+):\d*\s*"(.*)"\s*$/gm)) out.set(m[1], m[2]);
  return out;
}

// ---------------------------------------------------------------------------------------------------- focus trees
// The design trees by realm name: { id, focuses (sorted by row, then column) }.
export function loadTrees(dir = FOCUS_DIR) {
  const out = new Map();
  for (const f of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
    const d = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
    const focuses = [...(d.focuses ?? [])].sort((a, b) => a.y - b.y || a.x - b.x);
    for (const n of d.countries ?? []) out.set(n, { id: d.id, tier: d.tier, focuses });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------- text
export function frontendVersion(descriptor = DESCRIPTOR) {
  return /^version\s*=\s*"([^"]+)"/m.exec(readFileSync(descriptor, 'utf8'))?.[1] ?? null;
}
export function frontendText(data = loadFrontend(), version = frontendVersion()) {
  const loc = {
    ZIN_MENU_TITLE: data.menu.title,
    ZIN_MENU_SUBTITLE: data.menu.subtitle,
    ZIN_MENU_VERSION: version ? `${data.menu.versionPrefix} ${version}` : data.menu.subtitle,
  };
  for (const l of data.labels) loc[l.id] = l.name;
  return { loc, replace: { ...data.difficulty } };
}
export async function buildFrontendText(staged, { data = loadFrontend() } = {}) {
  const { loc, replace } = frontendText(data);
  const problems = Object.entries({ ...loc, ...replace }).flatMap(([k, v]) => textProblems(k, v));
  if (problems.length) throw new Error(`frontend text: ${problems.join('; ')}`);
  staged.loc('zin_frontend', loc);
  staged.add('localisation/replace/zin_frontend_replace_l_english.yml', yml(replace));
  return { keys: Object.keys(loc).length + Object.keys(replace).length };
}

// ---------------------------------------------------------------------------------------------------- bookmark
// The bookmark model: the great row, the list, the labels; every entry resolved and checked against the staged tree.
export function bookmarkModel({ data = loadFrontend(), countries, table, lore = loadRealmLore(), trees = loadTrees(), ideas, startIdeasByTag, focusIds, focusNames }) {
  const problems = [];
  const byKey = new Map(countries.map(c => [c.key, c]));
  const labelOf = new Map(data.labels.flatMap(l => l.regions.map(r => [r, l.id])));
  const d = data.description;
  const entry = (key, focusKeys, override) => {
    const c = byKey.get(key);
    if (!c) { problems.push(`${key}: not a realm of the roster`); return null; }
    const where = c.name;
    const l = lore.get(c.name);
    if (!l?.today) problems.push(`${where}: no situation text in the realm histories`);
    const tree = trees.get(c.name);
    if (!tree) { problems.push(`${where}: no focus tree`); return null; }
    let picks = focusKeys;
    if (!picks) picks = tree.focuses.filter(f => !/[[\]$]/.test(f.name) && !forbiddenIn(f.name).length).slice(0, 3).map(f => f.key);
    const focuses = picks.map(k => `zin_${tree.id}_${k}`);
    for (const f of focuses) {
      if (!focusIds.has(f)) problems.push(`${where}: focus ${f} is not compiled`);
      const name = focusNames.get(f);
      if (name === undefined) problems.push(`${where}: focus ${f} has no default name`);
      else problems.push(...textProblems(`${where}: focus ${f} name`, name));
    }
    if (focuses.length !== 3) problems.push(`${where}: ${focuses.length} focuses, expected 3`);
    const realmIdeas = [...(startIdeasByTag.get(c.tag) ?? [])].sort((a, b) => ideaRank(a) - ideaRank(b)).slice(0, 3);
    for (const i of realmIdeas) if (!ideas.has(i)) problems.push(`${where}: idea ${i} is not defined`);
    // A realm shows up to three; Zol's Mistake starts with two (its people and its culture).
    if (realmIdeas.length < 2) problems.push(`${where}: ${realmIdeas.length} starting spirits, expected 2 or 3`);
    const text = l?.today ? describe(l, { override: override ?? data.descriptionOverrides?.[key], maxChars: d.maxChars, foundedLabel: d.foundedLabel, bannerLabel: d.bannerLabel }) : '';
    problems.push(...textProblems(`${where}: description`, text));
    if (text.length > d.maxChars) problems.push(`${where}: description ${text.length} characters (limit ${d.maxChars})`);
    const label = labelOf.get(c.region);
    if (!label) problems.push(`${where}: region ${c.region} has no filter label`);
    const ideology = table.get(c.tag)?.ideology;
    if (!ideology) problems.push(`${where}: no ruling ideology`);
    return { key, tag: c.tag, name: c.name, region: c.region, label, ideology, ideas: realmIdeas, focuses, desc: text, descKey: descKey(key) };
  };
  const great = data.great.map(g => entry(g.key, g.focuses, g.descriptionOverride)).filter(Boolean);
  if (great.length > 8) problems.push(`${great.length} great realms; the row holds 8`);
  const listed = new Set(great.map(g => g.key));
  const majors = data.majorsInList.map(g => entry(g.key, g.focuses, g.descriptionOverride)).filter(Boolean);
  for (const m of majors) listed.add(m.key);
  const regional = countries.filter(c => !listed.has(c.key) && trees.get(c.name)?.tier === 'regional').map(c => entry(c.key, null)).filter(Boolean);
  const order = new Map(data.labels.map((l, i) => [l.id, i]));
  const minors = [...majors, ...regional].sort((a, b) => order.get(a.label) - order.get(b.label) || a.name.localeCompare(b.name, 'en'));
  const def = byKey.get(data.bookmark.defaultCountry);
  if (!def || !great.some(g => g.key === def.key)) problems.push(`the default country ${data.bookmark.defaultCountry} is not in the great row`);
  for (const [k, v] of [['bookmark name', data.bookmark.name], ['bookmark description', data.bookmark.desc], ['other entry', data.bookmark.other]]) problems.push(...textProblems(k, v));
  const used = new Set(minors.map(m => m.label));
  const labels = data.labels.filter(l => used.has(l.id));
  return { great, minors, labels, defaultTag: def?.tag, problems };
}

export function bookmarkText(model, data = loadFrontend()) {
  const b = data.bookmark;
  const ent = (e, minor) => [
    `\t\t"${e.tag}" = {`,
    `\t\t\thistory = "${e.descKey}"`,
    `\t\t\tideology = ${e.ideology}`,
    ...(minor ? ['\t\t\tminor = yes', `\t\t\tlabel = { ${e.label} }`] : []),
    `\t\t\tideas = { ${e.ideas.join(' ')} }`,
    `\t\t\tfocuses = { ${e.focuses.join(' ')} }`,
    '\t\t}',
  ].join('\n');
  return `# Generated by the ZIN content builder (modules/frontend.mjs) from tools/content/data/frontend.json and the realm histories
# (docs/specs/07_interface/03_main_menu_and_frontend.md sections 3 and 4). One bookmark: the great realms, then the realms of the list
# by land, then the "---" entry for every other realm of the map.
bookmarks = {
\tbookmark = {
\t\tname = "ZIN_BOOKMARK_FOURTH_AGE_NAME"
\t\tdesc = "ZIN_BOOKMARK_FOURTH_AGE_DESC"
\t\tdate = ${START_DATE}
\t\tpicture = "${BOOKMARK_PICTURE}"
\t\tdefault_country = "${model.defaultTag}"
\t\tdefault = yes
\t\tfilters = { label }
\t\tlabel_order = { ${model.labels.map(l => l.id).join(' ')} }
\t\tinclude_majors_in_minor_list = no
\t\tscrollable_country_list = yes
${model.great.map(e => ent(e, false)).join('\n')}
${model.minors.map(e => ent(e, true)).join('\n')}
\t\t"---" = {
\t\t\thistory = "ZIN_OTHER_FOURTH_AGE_DESC"
\t\t}
\t\teffect = {
\t\t\trandomize_weather = ${b.weatherSeed}
\t\t}
\t}
}
`;
}

export async function buildBookmark(staged, { countries, table, data = loadFrontend() }) {
  const model = bookmarkModel({
    data, countries, table,
    ideas: definedIdeas(textOf(staged, /^common\/ideas\/.+\.txt$/)),
    startIdeasByTag: startIdeas(textOf(staged, /^common\/on_actions\/.+\.txt$/)),
    focusIds: compiledFocuses(textOf(staged, /^common\/national_focus\/.+\.txt$/)),
    focusNames: locValues(textOf(staged, /^localisation\/english\/.+\.yml$/)),
  });
  if (model.problems.length) throw new Error(`The bookmark is invalid (${model.problems.length}):\n  ${model.problems.slice(0, 40).join('\n  ')}`);
  staged.text(BOOKMARK_FILE, bookmarkText(model, data));
  const loc = { ZIN_BOOKMARK_FOURTH_AGE_NAME: data.bookmark.name, ZIN_BOOKMARK_FOURTH_AGE_DESC: data.bookmark.desc, ZIN_OTHER_FOURTH_AGE_DESC: data.bookmark.other };
  for (const e of [...model.great, ...model.minors]) loc[e.descKey] = e.desc;
  staged.loc('zin_bookmark', loc);
  return { great: model.great.length, minors: model.minors.length, labels: model.labels.length };
}
