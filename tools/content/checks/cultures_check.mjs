// Culture and faith checks (docs/specs/02_lore/08_world_in_game.md section 14, checks 3, 4 and 5; the culture layer of
// docs/specs/02_lore/05_world_bible.md). They run inside buildCultures, so a build with a bad culture fails, and again
// from the tests and the command line:
//
//   node tools/content/checks/cultures_check.mjs [--report <file>]     checks the data against the country table
//
// Findings have a code and a detail; every `error` fails the build, a `warning` is printed.
//   file-duplicate      a key twice in one object of a data file (JSON.parse keeps the last and hides the first)
//   duplicate           a culture, faith, spirit, icon, rule or country twice
//   set                 a culture or faith the bible has and the game data lacks, or the reverse
//   ids                 culture, faith or language numbers that are not 1..n, or repeat
//   country-culture     a country without a culture, or with one that does not exist
//   country-faith       a country without a faith, or with one that does not exist
//   language            a culture or country language that does not exist (Zol's Dead alone has none)
//   modifier            a modifier key the installed game does not have, a value out of bounds, too few or too many
//   similar             two cultures whose modifier keys overlap above the limit
//   unused              a culture no country keeps and no note explains (or a stale note)
//   faith-unkept        a faith no culture keeps
//   mapping             a missing or malformed portrait pool, flag, building, music, unit group, icon or magic key
//   text                a banned word, a character outside Windows-1252, a too long text, a bible tag
//   secret              a name that must not show before the reveals (Afrit, Eindil, the Hidden Council, the birth rolls)
//   festival            a festival without an id or name, or in a month the calendar lacks
//   site                a holy site or state rule feature the geography model lacks
//   state-rule          a state rule that breaks the schema of docs/design/world/state_cultures.json
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertModifiers } from '../lib/core.mjs';
import { loadBanned, compileBanned, findBanned } from '../lib/banned.mjs';
import { nonCp1252 } from '../lib/loc_parse.mjs';
import { MONTHS } from '../lib/calendar.mjs';
import { cultureLocEntries, loadCultureModel, resolveCountryCultures, portraitPoolFor, canonicalJson, DATA } from '../lib/cultures_model.mjs';

// Counts the specs fix: 53 cultures (bible), 24 languages, 51 building kits, 14 music palettes, 21 unit groups
// (08_world_in_game.md sections 7 and 12), 39 faith rows (35 faiths plus the open one and the later additions).
export const SPEC_COUNTS = Object.freeze({ cultures: 53, languages: 24, building_styles: 51, music_moods: 14, unit_groups: 21 });
const SECRET_TERMS = /Afrit|Eindil|Einendil|Hidden Council|Edvoid|birth rolls?|hearth-names?/i;
const BIBLE_TAG = /\[(?:E|P|O|W|secret)[\s,\]]/;

// ---------------------------------------------------------------------------------- duplicate keys in a JSON text
// A small parser that reports an object key written twice in one object. Returns ['path.to.key', ...].
export function findDuplicateJsonKeys(text) {
  let i = 0;
  const dups = [];
  const ws = () => { while (i < text.length && ' \t\r\n'.includes(text[i])) i++; };
  const str = () => { const start = i++; while (text[i] !== '"') { if (text[i] === '\\') i++; i++; } i++; return JSON.parse(text.slice(start, i)); };
  const value = at => {
    ws();
    const c = text[i];
    if (c === '{') {
      i++; const seen = new Set(); ws();
      if (text[i] === '}') { i++; return; }
      for (;;) {
        ws(); const k = str(); ws(); i++; // the colon
        if (seen.has(k)) dups.push(`${at}.${k}`); seen.add(k);
        value(`${at}.${k}`); ws();
        if (text[i] === ',') { i++; continue; }
        i++; return;
      }
    } else if (c === '[') {
      i++; ws();
      if (text[i] === ']') { i++; return; }
      for (let n = 0; ; n++) { value(`${at}[${n}]`); ws(); if (text[i] === ',') { i++; continue; } i++; return; }
    } else if (c === '"') str();
    else while (i < text.length && !',}] \t\r\n'.includes(text[i])) i++;
  };
  value('$');
  return dups;
}

// Every geography feature id (region, forest, pass, site and so on) of tools/content/data/geography/erdae.json.
export async function loadGeographyIds(file = path.join(DATA, 'geography/erdae.json')) {
  const g = JSON.parse(await readFile(file, 'utf8')), ids = new Set();
  for (const v of Object.values(g)) if (Array.isArray(v)) for (const x of v) if (x && typeof x === 'object' && typeof x.id === 'string') ids.add(x.id);
  return ids;
}

const isNum = v => typeof v === 'number' && Number.isFinite(v);
const boundsOf = (game, key) => game.bounds.modifiers[key] ?? game.bounds.default;

// -------------------------------------------------------------------------------------------------- the checks
// opts: { countries: [{ tag, name }], table: Map (owner overrides), geography: Set of ids | null, files: { game: text, state: text } }
export async function runCultureChecks(model, opts = {}) {
  const { countries = [], table = new Map(), geography = null, banned = compileBanned(await loadBanned()), modifierDocs = true } = opts;
  const files = opts.files ?? { 'cultures_game.json': model.gameText ?? '{}', 'state_cultures.json': model.stateText ?? '{}' };
  const { game, world, state } = model, errors = [], warnings = [];
  // The keys both data sets know: a half-planted model still gets its other checks.
  const live = { ...model, cultureKeys: model.cultureKeys.filter(k => game.cultures[k] && world.cultures[k]), faithKeys: model.faithKeys.filter(k => game.faiths[k] && world.faiths[k]) };
  const err = (code, detail) => errors.push({ code, detail }), warn = (code, detail) => warnings.push({ code, detail });

  // ---- duplicate keys in the raw data files
  for (const [name, text] of Object.entries(files)) for (const d of findDuplicateJsonKeys(text)) err('file-duplicate', `${name}: the key ${d} is written twice`);

  // ---- sets: the bible's cultures and faiths against the game data
  for (const k of Object.keys(world.cultures)) if (!game.cultures[k]) err('set', `culture ${k} is in the bible and has no game data`);
  for (const k of Object.keys(game.cultures)) if (!world.cultures[k]) err('set', `culture ${k} has game data and is not in the bible`);
  for (const k of Object.keys(world.faiths)) if (!game.faiths[k]) err('set', `faith ${k} is in the bible and has no game data`);
  for (const k of Object.keys(game.faiths)) if (!world.faiths[k]) err('set', `faith ${k} has game data and is not in the bible`);
  if (model.cultureKeys.length !== SPEC_COUNTS.cultures) err('set', `${model.cultureKeys.length} cultures, the bible has ${SPEC_COUNTS.cultures}`);
  if (Object.keys(model.languages).length !== SPEC_COUNTS.languages) err('set', `${Object.keys(model.languages).length} languages, the bible has ${SPEC_COUNTS.languages}`);

  // ---- ids: 1..n, no repeats
  const idCheck = (what, entries, n) => {
    const ids = entries.map(([, v]) => v);
    for (const [k, v] of entries) if (!Number.isInteger(v) || v < 1 || v > n) err('ids', `${what} ${k} has the number ${v}, outside 1..${n}`);
    const seen = new Map();
    for (const [k, v] of entries) { if (seen.has(v)) err('duplicate', `${what} ${k} and ${seen.get(v)} share the number ${v}`); seen.set(v, k); }
    return ids;
  };
  idCheck('culture', Object.entries(game.cultures).map(([k, c]) => [k, c.id]), Object.keys(game.cultures).length);
  idCheck('faith', Object.entries(game.faiths).map(([k, c]) => [k, c.id]), Object.keys(game.faiths).length);
  idCheck('language', Object.entries(game.language_ids), Object.keys(model.languages).length);
  for (const id of Object.keys(model.languages)) if (!(id in game.language_ids)) err('ids', `language ${id} has no number in language_ids`);
  for (const id of Object.keys(game.language_ids)) if (!model.languages[id]) err('language', `language_ids names ${id}, which languages.json lacks`);

  // ---- duplicates of names and icons
  const dup = (what, pairs) => { const seen = new Map(); for (const [k, v] of pairs) { if (v == null) continue; if (seen.has(v)) err('duplicate', `${what} "${v}" belongs to ${seen.get(v)} and ${k}`); seen.set(v, k); } };
  dup('culture spirit', Object.entries(game.cultures).map(([k, c]) => [k, c.spirit]));
  dup('culture icon', Object.entries(game.cultures).map(([k, c]) => [k, c.icon]));
  dup('faith icon', Object.entries(game.faiths).map(([k, c]) => [k, c.icon]));
  dup('faith name', Object.keys(game.faiths).map(k => [k, game.faiths[k].name ?? world.faiths[k]?.name]));
  const spiritNames = [...Object.entries(game.cultures).map(([k, c]) => [k, c.spirit]), ...Object.keys(game.faiths).filter(k => game.faiths[k].spirit_desc).map(k => [k, game.faiths[k].name ?? world.faiths[k]?.name])];
  dup('spirit name across cultures and faiths', spiritNames);
  const assignedNames = new Map();
  for (const a of model.assignments) { if (assignedNames.has(a.country)) err('duplicate', `country ${a.country} has two culture rows`); assignedNames.set(a.country, a); }

  // ---- countries
  const resolved = resolveCountryCultures(model, countries, table);
  for (const name of resolved.missing) err('country-culture', `${name} has no culture row`);
  for (const p of resolved.problems) err(/faith/.test(p) ? 'country-faith' : /language/.test(p) ? 'language' : 'country-culture', p);
  for (const [tag, row] of resolved.rows) {
    if (!row.faith) err('country-faith', `${row.country} (${tag}) has no faith`);
    const c = world.cultures[row.culture];
    if (c && row.faith && row.faith !== c.faith && row.faith !== c.faith_secondary) warn('country-faith', `${row.country} keeps ${row.faith}, which is neither of its culture's faiths (${c.faith}, ${c.faith_secondary ?? 'none'})`);
    if (c && row.language !== (c.language ?? null)) warn('language', `${row.country} speaks ${row.language}, its culture ${row.culture} speaks ${c.language}`);
  }

  // ---- languages of cultures
  const noLanguage = new Set(game.no_language_cultures ?? []);
  for (const [k, c] of Object.entries(world.cultures)) {
    if (c.language == null) { if (!noLanguage.has(k)) err('language', `culture ${k} has no language and is not in no_language_cultures`); }
    else if (!model.languages[c.language]) err('language', `culture ${k} speaks ${c.language}, which does not exist`);
    else if (noLanguage.has(k)) err('language', `culture ${k} is listed without a language and has ${c.language}`);
  }

  // ---- modifiers
  const [cLo, cHi] = game.limits.culture_modifiers, [fLo, fHi] = game.limits.faith_modifiers;
  const modifierCheck = async (what, mods, lo, hi) => {
    const keys = Object.keys(mods ?? {});
    if (keys.length < lo || keys.length > hi) err('modifier', `${what} has ${keys.length} modifiers, the limit is ${lo} to ${hi}`);
    if (modifierDocs) { try { await assertModifiers(what, mods ?? {}); } catch (e) { err('modifier', e.message); } }
    for (const [k, v] of Object.entries(mods ?? {})) {
      if (!isNum(v) || v === 0) { err('modifier', `${what}: ${k} = ${v} is not a non-zero number`); continue; }
      const [a, b] = boundsOf(game, k);
      if (v < a || v > b) err('modifier', `${what}: ${k} = ${v} is outside its bounds ${a} to ${b}`);
    }
  };
  for (const k of Object.keys(game.cultures)) await modifierCheck(`culture ${k}`, game.cultures[k].modifier, cLo, cHi);
  for (const k of Object.keys(game.faiths)) {
    const f = game.faiths[k];
    if (f.spirit_desc) await modifierCheck(`faith ${k}`, f.modifier, fLo, fHi);
    else if (Object.keys(f.modifier ?? {}).length) err('modifier', `faith ${k} has no spirit text and still has modifiers`);
  }
  const keys = Object.keys(game.cultures), sets = keys.map(k => new Set(Object.keys(game.cultures[k].modifier ?? {})));
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    const inter = [...sets[i]].filter(x => sets[j].has(x)).length, union = new Set([...sets[i], ...sets[j]]).size;
    if (union && inter / union > game.limits.max_pair_similarity) err('similar', `${keys[i]} and ${keys[j]} share ${Math.round(inter / union * 100)}% of their modifier keys, the limit is ${Math.round(game.limits.max_pair_similarity * 100)}%`);
  }
  const signature = new Map();
  for (const k of keys) { const s = JSON.stringify(Object.entries(game.cultures[k].modifier ?? {}).sort()); if (signature.has(s)) err('duplicate', `${k} and ${signature.get(s)} have identical modifiers`); signature.set(s, k); }

  // ---- coverage: every culture has a country or a note
  const dominant = new Map(keys.map(k => [k, []])), second = new Map(keys.map(k => [k, []])), faithCountries = new Map(Object.keys(game.faiths).map(k => [k, []]));
  for (const row of resolved.rows.values()) {
    dominant.get(row.culture)?.push(row.country);
    if (row.culture2) second.get(row.culture2)?.push(row.country);
    faithCountries.get(row.faith)?.push(row.country);
  }
  for (const k of keys) {
    const n = dominant.get(k).length + second.get(k).length, note = game.cultures[k].unused;
    if (countries.length) {
      if (!n && !note) err('unused', `culture ${k} has no country and no \`unused\` note`);
      if (n && note) warn('unused', `culture ${k} has ${n} countries and still carries an \`unused\` note`);
    }
  }
  const keptByCulture = new Set(Object.values(world.cultures).flatMap(c => [c.faith, c.faith_secondary]).filter(Boolean));
  for (const k of Object.keys(game.faiths)) if (!keptByCulture.has(k)) err('faith-unkept', `faith ${k} is kept by no culture`);

  // ---- mappings
  const vocab = { building_styles: new Set(), music_moods: new Set(), unit_groups: new Set() };
  for (const k of keys) {
    const c = game.cultures[k];
    for (const [field, set] of [['building', vocab.building_styles], ['music', vocab.music_moods], ['unit_group', vocab.unit_groups]]) {
      if (typeof c[field] !== 'string' || !/^[a-z][a-z0-9_]*$/.test(c[field])) err('mapping', `culture ${k}: ${field} "${c[field]}" is not a key`); else set.add(c[field]);
    }
    if (typeof c.icon !== 'string' || !/^[a-z][a-z0-9_]*$/.test(c.icon)) err('mapping', `culture ${k}: icon "${c.icon}" is not a key`);
    if (!c.flag?.motif) err('mapping', `culture ${k} has no flag motif`);
    if (!Array.isArray(world.cultures[k]?.palette) || world.cultures[k].palette.length < 2 || world.cultures[k].palette.some(p => !/^#[0-9a-f]{6}$/i.test(p))) err('mapping', `culture ${k} has no valid palette`);
    if (!game.magic_attitudes.includes(c.magic)) err('mapping', `culture ${k}: magic attitude "${c.magic}" is not one of ${game.magic_attitudes.join(', ')}`);
    if (world.cultures[k]) { const p = portraitPoolFor(model, k); if (!(p.per_sex >= 1)) err('mapping', `culture ${k} has no portrait pool size`); }
  }
  for (const [what, set] of Object.entries(vocab)) if (set.size !== SPEC_COUNTS[what]) err('mapping', `${set.size} ${what.replace('_', ' ')}, the spec has ${SPEC_COUNTS[what]}`);
  for (const [k, f] of Object.entries(game.faiths)) if (f.spirit_desc && !/^[a-z][a-z0-9_]*$/.test(f.icon ?? '')) err('mapping', `faith ${k}: icon "${f.icon}" is not a key`);

  // ---- festivals and holy sites
  const months = new Set(MONTHS.map(m => m.name));
  for (const [k, f] of Object.entries(game.faiths)) {
    const seen = new Set();
    for (const fest of f.festivals ?? []) {
      if (!/^[a-z][a-z0-9_]*$/.test(fest.id ?? '')) err('festival', `faith ${k}: a festival id "${fest.id}" is not a key`);
      if (seen.has(fest.id)) err('duplicate', `faith ${k}: the festival ${fest.id} is listed twice`); seen.add(fest.id);
      if (!fest.name) err('festival', `faith ${k}: festival ${fest.id} has no name`);
      if (fest.month !== null && !months.has(fest.month)) err('festival', `faith ${k}: festival ${fest.id} falls in ${fest.month}, which the calendar lacks`);
      if (fest.days !== undefined && !(Number.isInteger(fest.days) && fest.days >= 1 && fest.days <= 30)) err('festival', `faith ${k}: festival ${fest.id} lasts ${fest.days} days`);
    }
    if (geography) for (const s of f.holy_sites ?? []) if (!geography.has(s)) err('site', `faith ${k}: the holy site ${s} is not in the geography model`);
  }

  // ---- text
  const entries = cultureLocEntries(live);
  for (const [key, value] of Object.entries(entries)) {
    for (const ch of new Set(nonCp1252(value))) err('text', `${key}: the character ${ch} is outside Windows-1252`);
    for (const h of findBanned(value, banned)) (h.severity === 'error' ? err : warn)('text', `${key}: the word "${h.word}" is banned (${h.id}) in "${value.slice(0, 60)}"`);
    if (SECRET_TERMS.test(value)) err('secret', `${key} names "${value.match(SECRET_TERMS)[0]}", which must not show before the reveals`);
    if (BIBLE_TAG.test(value)) err('text', `${key} carries a bible label: ${value.slice(0, 60)}`);
    if (!value.trim()) err('text', `${key} is empty`);
  }
  for (const [k, c] of Object.entries(game.cultures)) {
    for (const f of ['spirit_desc', 'text']) if (c[f] && c[f].length > game.limits.text_max_chars) err('text', `culture ${k}: ${f} is ${c[f].length} characters, the limit is ${game.limits.text_max_chars}`);
    if (!c.spirit || !c.spirit_desc || !c.text || !c.adjective) err('text', `culture ${k} lacks a spirit, a description, a text or an adjective`);
  }
  for (const [k, f] of Object.entries(game.faiths)) {
    for (const x of ['spirit_desc', 'text']) if (f[x] && f[x].length > game.limits.text_max_chars) err('text', `faith ${k}: ${x} is ${f[x].length} characters, the limit is ${game.limits.text_max_chars}`);
    if (!f.text) err('text', `faith ${k} has no text`);
  }

  // ---- state rules
  const levels = game.resistance_levels, ruleIds = new Set();
  const cultureKeyOk = (rule, field, c) => { if (!world.cultures[c]) err('state-rule', `${rule.id}: ${field} names ${c}, which is not a culture`); };
  for (const rule of state.rules) {
    if (ruleIds.has(rule.id)) err('duplicate', `the state rule ${rule.id} appears twice`); ruleIds.add(rule.id);
    if (!/^[a-z][a-z0-9_]*$/.test(rule.id ?? '')) err('state-rule', `rule id "${rule.id}" is not a key`);
    if (!rule.feature) err('state-rule', `${rule.id}: no geography feature`);
    else if (geography && !geography.has(rule.feature)) err('site', `${rule.id}: the feature ${rule.feature} is not in the geography model`);
    if (/^\d+$/.test(String(rule.feature))) err('state-rule', `${rule.id}: a rule is keyed by a geography feature, never by a state number`);
    if (!['enclave', 'mixed'].includes(rule.kind)) err('state-rule', `${rule.id}: kind "${rule.kind}" is neither enclave nor mixed`);
    if (rule.kind === 'enclave') { if (!rule.culture) err('state-rule', `${rule.id}: an enclave needs a culture`); else cultureKeyOk(rule, 'culture', rule.culture); }
    if (rule.kind === 'mixed') {
      if (!rule.minorities?.length) err('state-rule', `${rule.id}: a mixed rule needs minorities`);
      let total = 0;
      for (const m of rule.minorities ?? []) {
        cultureKeyOk(rule, 'minority', m.culture);
        if (!(isNum(m.share) && m.share > 0 && m.share <= 1)) err('state-rule', `${rule.id}: the share of ${m.culture} is ${m.share}`);
        total += m.share ?? 0;
      }
      if (total > game.limits.max_minority_total + 1e-9) err('state-rule', `${rule.id}: minorities total ${total.toFixed(2)}, the limit is ${game.limits.max_minority_total}`);
    }
    for (const f of ['when_owner', 'unless_owner']) for (const c of rule[f] ?? []) cultureKeyOk(rule, f, c);
    if (rule.when_owner && rule.unless_owner) err('state-rule', `${rule.id}: when_owner and unless_owner together`);
    for (const [c, level] of Object.entries(rule.owner_resistance ?? {})) {
      if (c !== '*') cultureKeyOk(rule, 'owner_resistance', c);
      if (!(level in levels)) err('state-rule', `${rule.id}: resistance level "${level}" is unknown`);
    }
    if (rule.faith && !world.faiths[rule.faith]) err('state-rule', `${rule.id}: faith ${rule.faith} does not exist`);
  }

  return { errors, warnings, resolved, coverage: buildCoverage(live, resolved.rows, { dominant, second, faithCountries }) };
}

// ------------------------------------------------------------------------------------------------------ coverage
export function buildCoverage(model, rows, tallies = null) {
  const { game, world } = model, cultures = {}, faiths = {}, languages = {};
  const dominant = tallies?.dominant ?? new Map(model.cultureKeys.map(k => [k, []])), second = tallies?.second ?? new Map(model.cultureKeys.map(k => [k, []])), byFaith = tallies?.faithCountries ?? new Map(model.faithKeys.map(k => [k, []]));
  if (!tallies) for (const row of rows.values()) { dominant.get(row.culture)?.push(row.country); if (row.culture2) second.get(row.culture2)?.push(row.country); byFaith.get(row.faith)?.push(row.country); }
  const byLanguage = new Map(model.languageKeys.map(k => [k, { cultures: [], countries: 0 }]));
  for (const k of model.cultureKeys) {
    const c = world.cultures[k], g = game.cultures[k];
    cultures[k] = {
      name: c.name, tier: c.tier, people: c.people, language: c.language ?? null, faith: c.faith, ideas: ['zin_culture_' + k, 'zin_culture2_' + k],
      idea_category: g ? (c.tier === 3 ? game.idea_category.tier3 : game.idea_category[`tier${c.tier}`]) : null,
      modifiers: g ? Object.keys(g.modifier).sort() : [], countries: [...dominant.get(k)].sort(), second_countries: [...second.get(k)].sort(),
      portrait_pool: g ? portraitPoolFor(model, k) : null, building_style: g?.building ?? null, music_mood: g?.music ?? null, unit_group: g?.unit_group ?? null,
      unused: g?.unused ?? null,
    };
    if (c.language && byLanguage.has(c.language)) { const l = byLanguage.get(c.language); l.cultures.push(k); l.countries += dominant.get(k).length; }
  }
  for (const k of model.faithKeys) {
    const keptBy = Object.entries(world.cultures).filter(([, c]) => c.faith === k || c.faith_secondary === k).map(([ck]) => ck);
    faiths[k] = { name: game.faiths[k].name ?? world.faiths[k]?.name ?? k, spirit: game.faiths[k].spirit_desc ? 'zin_faith_' + k : null, kept_by_cultures: keptBy.sort(), countries: [...byFaith.get(k)].sort(), festivals: game.faiths[k].festivals.length, holy_sites: game.faiths[k].holy_sites.length };
  }
  for (const k of model.languageKeys) languages[k] = { name: model.languages[k]?.name ?? k, cultures: byLanguage.get(k).cultures.sort(), countries: byLanguage.get(k).countries };
  const total = { countries: rows.size, cultures: model.cultureKeys.length, faiths: model.faithKeys.length, languages: model.languageKeys.length, culture_ideas: model.cultureKeys.length, secondary_culture_ideas: model.cultureKeys.length, faith_spirits: Object.values(game.faiths).filter(f => f.spirit_desc).length };
  const countrySet = rows.size;
  const gaps = {
    cultures_without_country: model.cultureKeys.filter(k => !dominant.get(k).length && !second.get(k).length),
    cultures_only_second: model.cultureKeys.filter(k => !dominant.get(k).length && second.get(k).length),
    faiths_without_country: model.faithKeys.filter(k => !byFaith.get(k).length),
    countries_with_second_culture: [...rows.values()].filter(r => r.culture2).map(r => r.country).sort(),
    countries_without_language: [...rows.values()].filter(r => !r.language).map(r => r.country).sort(),
  };
  return { schema: 'zin-culture-coverage/1', status: 'Generated by tools/content/modules/cultures.mjs; do not edit', totals: { ...total, countries: countrySet }, gaps, cultures, faiths, languages };
}

export function formatFindings(list) { return list.map(f => `${f.code}: ${f.detail}`).join('\n'); }
export function assertCultureChecks(result) {
  if (result.errors.length) throw new Error(`Culture checks failed (${result.errors.length}):\n${formatFindings(result.errors.slice(0, 40))}${result.errors.length > 40 ? `\n... and ${result.errors.length - 40} more` : ''}`);
}

// ------------------------------------------------------------------------------------------------- command line
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), reportAt = args.includes('--report') ? args[args.indexOf('--report') + 1] : null;
  const model = await loadCultureModel();
  const { countries } = JSON.parse(await readFile(path.join(DATA, 'countries.json'), 'utf8'));
  const result = await runCultureChecks(model, { countries, geography: await loadGeographyIds() });
  console.log(JSON.stringify({ errors: result.errors.length, warnings: result.warnings.length, totals: result.coverage.totals, gaps: { cultures_without_country: result.coverage.gaps.cultures_without_country, faiths_without_country: result.coverage.gaps.faiths_without_country } }, null, 2));
  if (result.warnings.length) console.error(formatFindings(result.warnings));
  if (result.errors.length) { console.error(formatFindings(result.errors)); process.exitCode = 1; }
  if (reportAt) await writeFile(reportAt, canonicalJson(result.coverage));
}
