// The move from the old 305-country roster (debug tags Y01 ... Y8H) to the 156 realms of tools/content/data/world/roster.json
// (requirements R-20 to R-29, R-27; owner decisions of 24 October 2026, K35 and K36). Table-driven by the roster's `migration` rows:
//
//   1. World data. languages_new.json and cultures_new.json are merged into languages.json and cultures.json (new families, isolates,
//      languages, cultures and faiths; Dwarvish lifted from the reserved languages; the culture, faith and dialect renames of
//      cultures_new.json applied to every builder source); each culture's country lists are taken from the roster.
//   2. Country references. In the builder's data (tools/content/data) and the focus designs (docs/design/focus):
//        - every old tag (Y01) inside a string becomes the tag of the realm that took its role (kept, renamed: the realm it became;
//          merged: the realm it joined; split: the first realm of the split; removed: the realm or wild-land holder that took its land);
//        - every value or object key equal to an old country name becomes that realm's name (prose and person names are left alone);
//        - a list that now names one realm twice keeps it once; an object key that collides with an existing realm keeps the
//          existing entry; a reference to a removed row without a successor is dropped from lists or listed as unresolved;
//        - each focus tree's `countries` list is the roster's realms whose `focusTree` is that tree;
//        - the Concord dominion table of the Aenor mechanic lists the 13 dominion realms and their 26 charter-seats (K36).
//      Edits are made in the text, so every file keeps its own layout.
//   3. Builder code (tools/content/**/*.mjs). Old tags in code and tests and quoted old country names are listed for review; code is
//      edited by hand alongside the move to the roster loader (lib/roster.mjs), because a quoted name in code is sometimes a person.
//   4. Retired files: data/countries.json moves to data/world/legacy_countries.json (the old table, read only by the state assignment
//      and the loader's legacy fields); data/world/country_cultures.json, languages_new.json and cultures_new.json are removed.
//
//   node tools/migrations/roster_migration.mjs [--report <file>]   dry run: prints the summary (and writes the full report to <file>)
//   node tools/migrations/roster_migration.mjs --apply             rewrites the files and writes docs/plans/roster_integration/migration_report.json
//
// Deterministic and idempotent: a second --apply finds nothing to change and leaves the report alone.
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseJsonPositions, applyEdits } from './json_edit.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ZIN = path.resolve(here, '../..');
const APPLY = process.argv.includes('--apply');
const REPORT_ARG = process.argv.includes('--report') ? process.argv[process.argv.indexOf('--report') + 1] : null;
const abs = r => path.join(ZIN, r);
const readJson = r => JSON.parse(readFileSync(abs(r), 'utf8'));
const DATA = 'tools/content/data';
const WORLD = `${DATA}/world`;
const REPORT_FILE = 'docs/plans/roster_integration/migration_report.json';

// ------------------------------------------------------------------------------------------------------------- inputs
const roster = readJson(`${WORLD}/roster.json`);
const realmByKey = new Map(roster.realms.map(r => [r.key, r]));
const realmNames = new Set(roster.realms.map(r => r.name));
const assignment = existsSync(abs(`${WORLD}/state_assignment.json`)) ? readJson(`${WORLD}/state_assignment.json`) : null;
const wildHolder = new Map((assignment?.removed ?? []).filter(r => r.holder).map(r => [r.oldTag, r.holder]));
const OLD_TAGS = new Set(roster.migration.map(m => m.oldTag));
const rowByTag = new Map(roster.migration.map(m => [m.oldTag, m])), rowByName = new Map(roster.migration.map(m => [m.oldName, m]));

// The realm that took an old row's role: the first target, or for a removed row the realm that holds its land.
function primaryOf(m) {
  const key = m.into[0] ?? wildHolder.get(m.oldTag) ?? null;
  return key ? realmByKey.get(key) : null;
}

const report = { schema: 1, written: 'tools/migrations/roster_migration.mjs', world: {}, renames: [], tags: [], names: [], keys: [], deduped: [], dropped: [], unresolved: [], focusCountries: [], special: [], code: { tags: [], names: [], tests: [] }, retired: [] };
const writes = new Map();
const put = (r, text) => { writes.set(r, text); };
const read = r => (writes.has(r) ? writes.get(r) : readFileSync(abs(r), 'utf8'));
// Whole-file serialisation keeps the file's indentation (the merged world files are written by JSON.stringify).
const jsonText = (v, like) => JSON.stringify(v, null, /^\{\r?\n( +)"/.exec(like)?.[1]?.length ?? 1) + (like.endsWith('\n') ? '\n' : '');

function listFiles(dir, re) {
  const out = [];
  const walk = d => { for (const e of readdirSync(abs(d), { withFileTypes: true })) { const p = `${d}/${e.name}`; if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); } else if (re.test(e.name)) out.push(p); } };
  walk(dir);
  return out.sort();
}

// ------------------------------------------------------------------------------------- 1. world data: languages and cultures
function mergeLanguages() {
  const r = `${WORLD}/languages.json`, nr = `${WORLD}/languages_new.json`;
  if (!existsSync(abs(nr))) return;
  const text = read(r), L = JSON.parse(text), N = readJson(nr);
  for (const [k, f] of Object.entries(N.families)) L.families[k] = f;
  L.families.isolates.members = [...L.families.isolates.members, ...N.isolates_added.filter(x => !L.families.isolates.members.includes(x))];
  for (const [k, lang] of Object.entries(N.languages)) L.languages[k] = lang;
  const lifted = new Set(N.reserved_lifted.map(x => x.id));
  L.reserved_languages = L.reserved_languages.filter(x => !lifted.has(x.id));
  for (const a of N.amendments ?? []) {
    const lang = L.languages[a.language];
    if (!lang.elements[a.element]) lang.elements[a.element] = { form: a.form, bound: a.form, tags: a.tags, origin: a.origin };
  }
  put(r, jsonText(L, text));
  report.world.languages = { added: Object.keys(N.languages), families: Object.keys(N.families), isolates: N.isolates_added, lifted: [...lifted], amendments: (N.amendments ?? []).map(a => `${a.language}.${a.element} = ${a.form}`) };
  report.retired.push({ file: nr, why: 'merged into languages.json' });
  // The dwarves' language is no longer kept open (the owner placed the dwarves on 24 October 2026).
  const rr = `${WORLD}/reserved_names.json`, rtext = read(rr), root = parseJsonPositions(rtext);
  const list = root.members.find(m => m.key.value === 'doNotGenerate')?.value;
  const i = list?.items.findIndex(x => /dwarves' homeland and language/i.test(x.value)) ?? -1;
  if (i >= 0) {
    const edits = []; removeRuns(list.items, new Set([i]), edits);
    put(rr, applyEdits(rtext, edits));
    report.world.reservedNames = `doNotGenerate: removed "${list.items[i].value}"`;
  }
}

// Identifier renames of cultures_new.json: applied as substrings to every builder source, since the ids live inside longer names
// (zin_culture_gunwaith_clans, zin_is_faith_stone_vigil).
let ID_RENAMES = [];
function mergeCultures() {
  const r = `${WORLD}/cultures.json`, nr = `${WORLD}/cultures_new.json`;
  if (!existsSync(abs(nr))) return;
  const text = read(r), C = JSON.parse(text), N = readJson(nr);
  ID_RENAMES = N.renames.filter(x => x.newId && x.kind !== 'dialect').map(x => ({ kind: x.kind, from: x.id, to: x.newId, name: x.newName ?? null }));
  const dialects = N.renames.filter(x => x.kind === 'dialect').map(x => { const [lang, from] = x.id.split(':'), [, to] = x.newId.split(':'); return { lang, from, to }; });
  const strip = ({ countries, secondary_countries, ...rest }) => rest;
  for (const x of ID_RENAMES) {
    const bucket = x.kind === 'culture' ? C.cultures : C.faiths;
    if (N[x.kind === 'culture' ? 'cultures' : 'faiths'][x.to]) { delete bucket[x.from]; continue; } // superseded by a new entry
    if (!bucket[x.from]) continue;
    const entries = Object.entries(bucket).map(([k, v]) => (k === x.from ? [x.to, { ...v, ...(x.kind === 'culture' ? { id: x.to } : {}), ...(x.name ? { name: x.name } : {}) }] : [k, v]));
    for (const k of Object.keys(bucket)) delete bucket[k];
    for (const [k, v] of entries) bucket[k] = v;
  }
  for (const x of N.renames.filter(x => x.field)) if (C.cultures[x.id]) C.cultures[x.id][x.field] = x.to;
  for (const [k, c] of Object.entries(N.cultures)) C.cultures[k] = { ...strip(c), countries: [], secondary_countries: [] };
  for (const [k, f] of Object.entries(N.faiths)) C.faiths[k] = f;
  for (const c of Object.values(C.cultures)) for (const d of dialects) if (c.language === d.lang && c.dialect === d.from) c.dialect = d.to;
  // Faith renames inside the culture entries (applyIdRenames leaves cultures.json alone, so `supersedes` keeps the old ids).
  const faithRename = id => ID_RENAMES.find(x => x.kind === 'faith' && x.from === id)?.to ?? id;
  for (const c of Object.values(C.cultures)) { c.faith = faithRename(c.faith); if (c.faith_secondary) c.faith_secondary = faithRename(c.faith_secondary); }
  // Country lists come from the roster, in roster order.
  for (const c of Object.values(C.cultures)) { c.countries = []; c.secondary_countries = []; }
  const rename = id => ID_RENAMES.find(x => x.kind === 'culture' && x.from === id)?.to ?? id;
  for (const realm of roster.realms) {
    C.cultures[rename(realm.culture)]?.countries.push(realm.name);
    if (realm.cultureSecondary) C.cultures[rename(realm.cultureSecondary)]?.secondary_countries.push(realm.name);
  }
  C.written = N.written;
  put(r, jsonText(C, text));
  report.world.cultures = { added: Object.keys(N.cultures), faiths: Object.keys(N.faiths), renames: ID_RENAMES.map(x => `${x.kind} ${x.from} -> ${x.to}`), dialects: dialects.map(d => `${d.lang}:${d.from} -> ${d.to}`), peopleChanges: N.renames.filter(x => x.field).map(x => `${x.id}.${x.field}: ${x.from} -> ${x.to}`) };
  report.retired.push({ file: nr, why: 'merged into cultures.json' });
}

// Culture, faith and dialect id renames in every builder source and design file.
const NOT_MINE = [`${DATA}/presentation-cells.json`, `${DATA}/branding.json`, `${WORLD}/reckonings.json`];
function applyIdRenames() {
  if (!ID_RENAMES.length) return;
  const files = [...listFiles('tools/content', /\.(json|mjs|mts)$/), ...listFiles('docs/design', /\.json$/)]
    .filter(f => ![`${WORLD}/cultures.json`, `${WORLD}/cultures_new.json`, `${WORLD}/legacy_countries.json`, `${WORLD}/country_cultures.json`, `${DATA}/countries.json`, ...NOT_MINE].includes(f) && !f.startsWith(`${DATA}/vanilla/`) && !f.startsWith(`${DATA}/ui/`) && !f.startsWith('tools/content/fixtures/focus/expected/'));
  for (const f of files) {
    const text = read(f);
    let t = text;
    for (const x of ID_RENAMES) {
      const n = t.split(x.from).length - 1;
      if (n) { t = t.split(x.from).join(x.to); report.renames.push({ where: f, from: x.from, to: x.to, count: n }); }
    }
    if (t !== text) put(f, t);
  }
}

// --------------------------------------------------------------------------------------------- 2. country references
const SKIP = [
  `${WORLD}/roster.json`, `${WORLD}/history/`, `${WORLD}/characters/`, `${WORLD}/languages_new.json`, `${WORLD}/cultures_new.json`,
  `${WORLD}/legacy_countries.json`, `${WORLD}/state_assignment.json`, `${WORLD}/country_cultures.json`, `${DATA}/countries.json`,
  `${DATA}/geography/`, `${DATA}/labels.json`, `${DATA}/vanilla/`, `${DATA}/ui/`, `${WORLD}/reserved_names.json`, `${WORLD}/heraldry.json`,
  // The languages' established names are records of drawn and vault names, and stay reserved as they are.
  `${WORLD}/languages.json`,
  ...NOT_MINE,
  // Generated by the write_* scripts from the map and the module code; regenerated after the migration.
  `${DATA}/forces_geography.json`, `${DATA}/mech_journey_geography.json`, `${DATA}/warfare_ids.json`, `${DATA}/flags-cells.json`,
];
// Values under these keys are prose, person names or records of former names, never country references.
const PROSE_KEYS = new Set(['replace', 'adjective', 'desc', 'text', 'title', 'summary', 'note', 'notes', 'reason', 'bio', 'role', 'legend', 'story', 'quote', 'body', 'tooltip', 'tip', 'absorbed', 'formerName', 'formerNames', 'formerLabels']);
const DENY = [
  { file: `${DATA}/banned_words.json`, why: 'banned-word rules (Zol as a replacement word)' },
  { file: `${DATA}/game_rules.json`, why: 'rule option names (Bold is an option, not the old country)' },
  { file: `${DATA}/mech_powers_volgan_text.json`, path: /^\$\.characters\./, why: 'character names (Volgan the person)' },
  { file: `${WORLD}/cultures.json`, path: /\.name$/, why: 'culture names' },
];
const denied = (file, p) => DENY.some(d => d.file === file && (!d.path || d.path.test(p)));

const TAG_RE = /(?<![§A-Za-z0-9_])Y[0-9A-Z]{2}(?![A-Za-z0-9_])/g;
function migrateTagsInString(s, where) {
  return s.replace(TAG_RE, t => {
    if (!OLD_TAGS.has(t)) return t;
    const m = rowByTag.get(t), p = primaryOf(m);
    if (!p) { report.unresolved.push({ where, ref: t, oldName: m.oldName, fate: m.fate, why: 'a removed row with no successor' }); return t; }
    report.tags.push({ where, from: t, to: p.tag, oldName: m.oldName, fate: m.fate, realm: p.key });
    return p.tag;
  });
}
const pathKey = (p, k) => `${p}.${/^[A-Za-z_]\w*$/.test(k) ? k : JSON.stringify(k)}`;

// One string value: old tags inside it, and the whole value when it is an old country name in a reference position.
// Prefixed country tokens of the data languages: capital:Mylunur (east roads), tag:Gunwaith (world events, also with underscores),
// country:Volgan (unit and template peoples), subject_of:Volgan, war:Volgan.
const OLD_NAMES = [...rowByName.keys()].filter(n => !realmNames.has(n)).sort((a, b) => b.length - a.length);
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PREFIXED_RE = new RegExp(`\\b(capital|tag|country|subject_of|war):(${OLD_NAMES.flatMap(n => [n, n.replace(/ /g, '_')]).map(escRe).join('|')})(?![A-Za-z])`, 'g');
function migratePrefixed(s, where) {
  return s.replace(PREFIXED_RE, (m, prefix, raw) => {
    const name = rowByName.has(raw) ? raw : raw.replace(/_/g, ' '), row = rowByName.get(name), r = row && primaryOf(row);
    if (!r) { report.unresolved.push({ where, ref: m, why: 'a removed row with no successor' }); return m; }
    report.names.push({ where, from: m, to: `${prefix}:${r.name}`, fate: row.fate });
    return `${prefix}:${raw.includes('_') ? r.name.replace(/ /g, '_') : r.name}`;
  });
}
function migrateString(v, p, file, parentKey) {
  let s = migratePrefixed(migrateTagsInString(v, `${file} ${p}`), `${file} ${p}`);
  if (rowByName.has(s) && !realmNames.has(s) && !PROSE_KEYS.has(parentKey) && !denied(file, p)) {
    const m = rowByName.get(s), r = primaryOf(m);
    if (!r) return { drop: true, ref: s, m };
    report.names.push({ where: `${file} ${p}`, from: s, to: r.name, fate: m.fate });
    s = r.name;
  }
  return { value: s };
}

// Remove runs of list entries (array items or object members) and leave the kept entries' bytes alone: a run after a kept entry is cut
// from that entry's end, a leading run up to the next kept entry's start.
function removeRuns(list, removed, edits) {
  let i = 0;
  while (i < list.length) {
    if (!removed.has(i)) { i++; continue; }
    let j = i; while (j + 1 < list.length && removed.has(j + 1)) j++;
    if (i > 0) edits.push({ start: list[i - 1].end, end: list[j].end, text: '' });
    else if (j + 1 < list.length) edits.push({ start: list[i].start, end: list[j + 1].start, text: '' });
    else edits.push({ start: list[i].start, end: list[j].end, text: '' });
    i = j + 1;
  }
}
const dropInner = (edits, node) => { for (let e = edits.length - 1; e >= 0; e--) if (edits[e].start >= node.start && edits[e].end <= node.end) edits.splice(e, 1); };

function migrateNode(node, p, file, parentKey, edits) {
  if (node.type === 'string') {
    const r = migrateString(node.value, p, file, parentKey);
    if (r.drop) return r;
    if (r.value !== node.value) edits.push({ start: node.start, end: node.end, text: JSON.stringify(r.value) });
    return null;
  }
  if (node.type === 'array') {
    const removed = new Set(), seen = [];
    node.items.forEach((it, i) => {
      if (it.type === 'string') {
        const r = migrateString(it.value, `${p}[${i}]`, file, parentKey);
        if (r.drop) { removed.add(i); report.dropped.push({ where: `${file} ${p}[${i}]`, ref: r.ref, oldTag: r.m.oldTag, why: `${r.m.oldName} was removed with no successor (${r.m.reason})` }); return; }
        if (r.value !== it.value && seen.includes(r.value)) { removed.add(i); report.deduped.push({ where: `${file} ${p}`, value: r.value, from: it.value }); return; }
        if (r.value !== it.value) edits.push({ start: it.start, end: it.end, text: JSON.stringify(r.value) });
        seen.push(r.value);
      } else migrateNode(it, `${p}[${i}]`, file, parentKey, edits);
    });
    removeRuns(node.items, removed, edits);
    return null;
  }
  if (node.type === 'object') {
    const removed = new Set(), keys = new Set(node.members.map(m => m.key.value)), taken = new Set();
    node.members.forEach((mem, i) => {
      const k = mem.key.value;
      let key = migratePrefixed(migrateTagsInString(k, `${file} ${pathKey(p, k)} (key)`), `${file} ${pathKey(p, k)} (key)`);
      if (rowByName.has(key) && !realmNames.has(key) && !denied(file, p)) {
        const m = rowByName.get(key), r = primaryOf(m);
        if (!r) { removed.add(i); report.dropped.push({ where: `${file} ${pathKey(p, k)}`, ref: key, oldTag: m.oldTag, why: `${m.oldName} was removed with no successor` }); return; }
        if (keys.has(r.name) || taken.has(r.name)) {
          removed.add(i);
          report.dropped.push({ where: `${file} ${pathKey(p, k)}`, ref: key, oldTag: m.oldTag, why: `${m.oldName} ${m.fate === 'merged' ? 'joined' : 'became'} ${r.name}, which already has an entry here; the entry of ${r.name} is kept` });
          return;
        }
        report.keys.push({ where: `${file} ${pathKey(p, k)}`, from: key, to: r.name, fate: m.fate });
        key = r.name;
      }
      taken.add(key);
      if (key !== k) edits.push({ start: mem.key.start, end: mem.key.end, text: JSON.stringify(key) });
      const res = migrateNode(mem.value, pathKey(p, key), file, key, edits);
      if (res?.drop) { removed.add(i); dropInner(edits, mem); report.dropped.push({ where: `${file} ${pathKey(p, key)}`, ref: res.ref, oldTag: res.m.oldTag, why: `${res.m.oldName} was removed with no successor` }); }
    });
    removeRuns(node.members, removed, edits);
    return null;
  }
  return null;
}

function migrateJsonFiles() {
  const files = [...listFiles(DATA, /\.json$/), ...listFiles('docs/design/focus', /\.json$/)].filter(f => !SKIP.some(s => f === s || f.startsWith(s)));
  for (const f of files) {
    const text = read(f);
    let root; try { root = parseJsonPositions(text); } catch { continue; }
    const edits = [];
    migrateNode(root, '$', f, null, edits);
    let next = applyEdits(text, edits);
    if (f.startsWith('docs/design/focus/')) {
      const tree = parseJsonPositions(next), cm = tree.members.find(m => m.key.value === 'countries');
      if (cm) {
        const id = path.basename(f, '.json'), want = roster.realms.filter(r => r.focusTree === id).map(r => r.name), have = JSON.parse(next.slice(cm.value.start, cm.value.end));
        if (want.length && JSON.stringify(want) !== JSON.stringify(have)) {
          report.focusCountries.push({ tree: id, before: have.length, after: want.length, added: want.filter(n => !have.includes(n)), removed: have.filter(n => !want.includes(n)) });
          next = applyEdits(next, [{ start: cm.value.start, end: cm.value.end, text: JSON.stringify(want) }]);
        } else if (!want.length) report.unresolved.push({ where: f, ref: id, why: 'no realm of the roster takes this tree (folded into another tree by the roster)' });
      }
    }
    if (next !== text) put(f, next);
  }
}

// K36: Aenor's Concord keeps its 26 charter-seats, held by the 13 dominion realms of the roster. The dominion table lists each dominion
// once, with the seats the histories give it (middle_lands.json), its own charter and loyalty, and the old rows it absorbed. It runs
// before the generic pass, on the old names.
export const CONCORD_SEATS = { selen: 3, noleksun: 3, konori: 2, hunhun: 2, kingson: 2, herez: 2, kilinti: 2, safeton: 2, freshon: 2, pazoma: 2, orohaf: 1, kunhrim: 2, klungori_guard: 1 };
function concordDominions() {
  const f = `${DATA}/mech_aenor.json`, text = read(f), root = parseJsonPositions(text);
  const node = root.members.find(m => m.key.value === 'dominions').value, rows = JSON.parse(text.slice(node.start, node.end));
  if (rows.every(d => typeof d.seats === 'number')) return;
  const total = Object.values(CONCORD_SEATS).reduce((a, b) => a + b, 0);
  if (total !== 26) throw new Error(`The Concord seats add up to ${total}, not 26`);
  const dominions = roster.realms.filter(r => r.overlord === 'aenor' && r.subjectType === 'chartered dominion');
  const out = dominions.map(r => {
    const own = rows.find(d => d.name === r.name) ?? rows.find(d => rowByName.get(d.name)?.into[0] === r.key);
    if (!own) throw new Error(`mech_aenor: no dominion row for ${r.name}`);
    if (!CONCORD_SEATS[r.key]) throw new Error(`mech_aenor: no seats for ${r.name}`);
    const absorbed = rows.filter(d => d !== own && rowByName.get(d.name)?.into[0] === r.key).map(d => d.name);
    const { states, ...rest } = own;
    return { ...rest, name: r.name, seats: CONCORD_SEATS[r.key], ...(absorbed.length ? { absorbed } : {}) };
  });
  const outside = rows.filter(d => !out.some(o => o.name === d.name || (o.absorbed ?? []).includes(d.name))).map(d => `${d.name} -> ${primaryOf(rowByName.get(d.name) ?? { into: [d.name] })?.name ?? '?'}`);
  const indent = text.slice(text.lastIndexOf('\n', node.items[0].start) + 1, node.items[0].start);
  const close = text.slice(text.lastIndexOf('\n', node.end - 1) + 1, node.end - 1);
  const body = out.map(d => `${indent}{ ${Object.entries(d).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v).replace(/","/g, '", "')}`).join(', ')} }`).join(',\n');
  put(f, applyEdits(text, [{ start: node.start, end: node.end, text: `[\n${body}\n${close}]` }]));
  report.special.push({ file: f, what: 'The Concord dominion table lists the 13 dominion realms of the roster with the 26 charter-seats (K36); merged rows are recorded in `absorbed`.', dominions: out.map(d => `${d.name} ${d.seats}${d.absorbed ? ` (absorbed ${d.absorbed.join(', ')})` : ''}`), leftTheConcord: outside });
}

// The demography's per-country rows (population, states, urban share of the 305 old rows) are superseded by the roster, which gives
// each realm its population; the settlements and minor peoples keep their rows and are migrated with the other references.
function demographyCountries() {
  const f = `${WORLD}/demography.json`, text = read(f), root = parseJsonPositions(text);
  const i = root.members.findIndex(m => m.key.value === 'countries');
  if (i < 0) return;
  const edits = []; removeRuns(root.members, new Set([i]), edits);
  put(f, applyEdits(text, edits));
  report.special.push({ file: f, what: 'The 305 per-country rows are removed: the roster gives each realm its population (lib/roster.mjs).' });
}

// ------------------------------------------------------------------------------------------------------------ 3. code
// Module and library code (not the tests): a quoted old country name is a lookup of that country (every one was reviewed: none is a
// person), so it becomes the successor's name; the pattern leaves "'Zol's Mistake'" alone. Tests are listed, not edited: their
// expectations change with the roster and are rewritten by hand.
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function migrateCode() {
  const names = [...rowByName.keys()].filter(n => !realmNames.has(n)).sort((a, b) => b.length - a.length);
  const nameRe = new RegExp(`(['"])(${names.map(esc).join('|')})\\1(?![A-Za-z])`, 'g');
  const files = listFiles('tools/content', /\.(mjs|mts)$/).filter(f => !f.includes('/fixtures/') && !f.endsWith('.test.mjs') && !f.endsWith('lib/roster.mjs'));
  for (const f of files) {
    const text = read(f);
    const lines = text.split('\n').map((line, i) => line.replace(nameRe, (m, q, n) => {
      const r = primaryOf(rowByName.get(n));
      if (!r) { report.unresolved.push({ where: `${f}:${i + 1}`, ref: n, why: 'a removed row with no successor, named in code' }); return m; }
      report.code.names.push({ where: `${f}:${i + 1}`, from: n, to: r.name, edited: true });
      return `${q}${r.name.split(q).join('\\' + q)}${q}`;
    }));
    for (const [i, line] of lines.entries()) for (const m of line.matchAll(TAG_RE)) if (OLD_TAGS.has(m[0]) && !/debug tag/.test(line)) report.code.tags.push({ where: `${f}:${i + 1}`, tag: m[0] });
    const next = lines.join('\n');
    if (next !== text) put(f, next);
  }
  for (const f of listFiles('tools/content', /\.test\.mjs$/)) read(f).split('\n').forEach((line, i) => {
    for (const m of line.matchAll(TAG_RE)) if (OLD_TAGS.has(m[0])) report.code.tests.push({ where: `${f}:${i + 1}`, tag: m[0] });
    for (const n of names) if (new RegExp(`(['"])${esc(n)}\\1(?![A-Za-z])`).test(line)) report.code.tests.push({ where: `${f}:${i + 1}`, name: n });
  });
}

// --------------------------------------------------------------------------------------------------------------- 4. retire
function retire() {
  if (existsSync(abs(`${DATA}/countries.json`))) report.retired.push({ file: `${DATA}/countries.json`, to: `${WORLD}/legacy_countries.json`, why: 'the old table; the roster is the country table' });
  if (existsSync(abs('docs/design/focus/regional_poyang.json'))) report.retired.push({ file: 'docs/design/focus/regional_poyang.json', why: 'the roster folds Poyang into Soyano, whose tree is regional_hengyang; Poyang\'s focuses are not folded into it yet (listed for the lead)' });
  if (existsSync(abs(`${WORLD}/country_cultures.json`))) report.retired.push({ file: `${WORLD}/country_cultures.json`, why: 'the cultures of the old rows; the roster carries each realm\'s culture, language and faith' });
}

// -------------------------------------------------------------------------------------------------------------------- run
mergeLanguages();
mergeCultures();
applyIdRenames();
concordDominions();
demographyCountries();
migrateJsonFiles();
migrateCode();
retire();

const summary = {
  files: [...writes.keys()].length,
  world: report.world,
  idRenames: report.renames.reduce((a, r) => a + r.count, 0),
  tagsMigrated: report.tags.length, namesMigrated: report.names.length, keysMigrated: report.keys.length, deduped: report.deduped.length,
  dropped: report.dropped.length, unresolved: report.unresolved.length, focusTrees: report.focusCountries.length, special: report.special.length,
  codeTags: report.code.tags.length, codeNames: report.code.names.length, testRefs: report.code.tests.length, retired: report.retired.map(r => r.file),
  byFate: [...report.tags, ...report.names, ...report.keys].reduce((a, r) => ({ ...a, [r.fate]: (a[r.fate] ?? 0) + 1 }), {}),
};
report.summary = summary;
const changes = writes.size + report.retired.length;
console.log(JSON.stringify({ mode: APPLY ? 'apply' : 'dry run', changes, ...summary }, null, 1));
if (REPORT_ARG) writeFileSync(REPORT_ARG, JSON.stringify(report, null, 1) + '\n');
if (APPLY && changes) {
  for (const [r, t] of writes) writeFileSync(abs(r), t);
  if (existsSync(abs(`${DATA}/countries.json`))) renameSync(abs(`${DATA}/countries.json`), abs(`${WORLD}/legacy_countries.json`));
  for (const f of [`${WORLD}/country_cultures.json`, `${WORLD}/languages_new.json`, `${WORLD}/cultures_new.json`, 'docs/design/focus/regional_poyang.json']) if (existsSync(abs(f))) rmSync(abs(f));
  mkdirSync(path.dirname(abs(REPORT_FILE)), { recursive: true });
  writeFileSync(abs(REPORT_FILE), JSON.stringify(report, null, 1) + '\n');
}
