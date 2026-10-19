// The language-driven name generator of docs/specs/02_lore/06_languages.md (section 4, "The generator contract").
// Given a language of tools/content/data/world/languages.json, a kind of name and a seed it produces a name by the
// language's own rules: elements and suffixes of the dictionary, place patterns by weight, the junction rules of its
// morphology, stems and endings for persons. Every name is checked (alphabet, Windows-1252, length, repeats, banned
// words, the language's own letters, leak markers of other languages) and claimed in one world registry that refuses
// exact duplicates and near-duplicates across languages. All draws use the builder's seeded rng, so the same data gives
// the same names byte for byte.
//
// Public surface:
//   loadNamingData(), createNameGenerator(data)   the generator (see the methods on the returned object)
//   NameRegistry                                    the uniqueness registry (usable on its own)
//   checkName(), isWindows1252(), nonWindows1252()  rule checks that do not need a generator
//   signaturePredicates(), carriesSignature()       the own-signature measure of spec section 6
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rng } from './core.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(here, '../data');

export const CORE_ELEMENT_COUNT = 27;
export const PLACE_KINDS = Object.freeze(['settlement', 'city', 'state', 'region', 'river', 'lake', 'sea', 'strait', 'mountain', 'forest', 'site']);
export const PERSON_KINDS = Object.freeze(['given_m', 'given_f', 'house', 'epithet', 'ruler_title', 'title']);
export const NAME_KINDS = Object.freeze([...PLACE_KINDS, ...PERSON_KINDS]);
// The place kinds and the pattern table of languages.json that each draws from.
const PLACE_SPEC = {
  settlement: { pattern: 'settlement', layers: 'settlement' }, city: { pattern: 'settlement', layers: 'settlement' },
  state: { pattern: ['settlement', 'region'], layers: 'settlement' }, region: { pattern: 'region', layers: 'settlement' },
  river: { pattern: 'river', layers: 'natural' }, lake: { pattern: 'lake', layers: 'natural' }, sea: { pattern: 'sea', layers: 'natural' },
  strait: { pattern: 'sea', layers: 'natural' }, mountain: { pattern: 'mountain', layers: 'natural' }, forest: { pattern: 'region', layers: 'natural', head: 'forest' },
  site: { pattern: 'site', layers: 'settlement' },
};

// The substrings of tools/content/modules/names.mjs (kept) plus the spec's additions; languages.json repeats them and
// the loader merges all three.
export const BANNED_SUBSTRINGS = Object.freeze(['rush', 'klinti', 'sunhot', 'edvoid', 'zol', 'volgan', 'afrit', 'hell', 'dead', 'death', 'devil', 'demon', 'god', 'sex', 'ass', 'tit', 'cum', 'dick', 'cock', 'kill', 'rape', 'slut', 'piss', 'shit', 'fuck', 'nazi']);

// Real-world names that the data's blocklists do not hold, kept out as whole words (Rite-Tongue marx + stem x made "Marx").
export const REAL_WORLD_WORDS = Object.freeze(['marx', 'engels', 'freud', 'plato', 'caesar', 'nero', 'attila', 'genghis', 'darwin', 'newton', 'einstein']);

// The leak markers of spec section 6 (letters that mark one language and no other). The data is wider than the table
// (the generator lists every language that really contains a marker in its own words), so `markerOwners` is computed.
export const LEAK_MARKERS = Object.freeze({
  tz: ['orran'], zg: ['orcish'], mh: ['yetic'], azel: ['infernal'], vath: ['infernal'], q: ['noric', 'grave_rite'], x: ['grave_rite', 'goblin'],
  iel: ['sylvan', 'galic'], ien: ['galic'], wyn: ['gunwaithic'], vik: ['leren'], gard: ['coldic'], eya: ['galic'],
});

// ------------------------------------------------------------------------------------------------ Windows-1252
const CP1252_HIGH = new Set('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ');
export function isWindows1252(ch) {
  const c = ch.codePointAt(0);
  return (c >= 0x20 && c <= 0x7e) || (c >= 0xa0 && c <= 0xff) || CP1252_HIGH.has(ch);
}
export const nonWindows1252 = text => [...String(text)].filter(ch => !isWindows1252(ch));

// -------------------------------------------------------------------------------------------------- helpers
// Letters only, lower case, accents folded: "Šodolôro" and "Sodoloro" share the key sodoloro.
export const keyOf = text => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
export const titleCase = text => String(text).replace(/(^|[ -])([a-z])/g, (m, sep, ch) => sep + ch.toUpperCase());
const WORD = /^[A-Za-z]+(?:['-][A-Za-z]+)*$/;

function wpick(items, weightOf, r) {
  let total = 0;
  const weights = items.map(item => { const w = weightOf(item); total += w; return w; });
  let t = r() * total;
  for (let i = 0; i < items.length; i++) { t -= weights[i]; if (t < 0) return items[i]; }
  return items.at(-1);
}
const shuffle = (list, r) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const uniqueSorted = list => [...new Set(list)].sort();

// Levenshtein distance with an early exit above `max`.
export function editDistance(a, b, max = Infinity) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let best = i;
    for (let j = 1; j <= b.length; j++) { cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); best = Math.min(best, cur[j]); }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

// ------------------------------------------------------------------------------------------------- registry
// One registry for the whole world. A key is the lowercase letters of a name. An entry belongs to one language (or is
// reserved: established names, which no language may produce). A unique entry (a place, a full person) refuses a second
// holder of its key; a shared entry (a given name or a house stem, which a whole people uses) may be re-used inside its
// own language but never by another. Near-duplicates (edit distance <= nearDistance, both keys at least minNearLength
// letters) are refused across languages, against reserved names, and between two unique entries of one language.
export class NameRegistry {
  constructor({ nearDistance = 1, minNearLength = 5 } = {}) {
    this.nearDistance = nearDistance; this.minNearLength = minNearLength;
    this.entries = new Map(); this.index = new Map();
  }
  get size() { return this.entries.size; }
  has(text) { return this.entries.has(keyOf(text)); }
  owner(text) { return this.entries.get(keyOf(text)); }
  reserve(text, source = 'reserved') {
    const key = keyOf(text);
    if (key && !this.entries.has(key)) this.#add(key, { language: null, reserved: true, unique: true, source });
    return key;
  }
  // Decide without claiming. Returns { ok: true } or { ok: false, reason, other }.
  probe(text, { language, unique = true } = {}) {
    const key = keyOf(text), found = this.entries.get(key);
    if (!key) return { ok: false, reason: 'empty' };
    if (found) {
      if (found.reserved) return { ok: false, reason: 'reserved', other: key };
      if (found.language !== language) return { ok: false, reason: 'duplicate-language', other: key, owner: found.language };
      if (unique || found.unique) return { ok: false, reason: 'duplicate', other: key };
      return { ok: true, existing: true };
    }
    if (this.nearDistance > 0 && key.length >= this.minNearLength) {
      for (const variant of this.#variants(key)) {
        for (const otherKey of this.index.get(variant) ?? []) {
          if (otherKey === key || otherKey.length < this.minNearLength || editDistance(key, otherKey, this.nearDistance) > this.nearDistance) continue;
          const other = this.entries.get(otherKey);
          if (other.reserved) return { ok: false, reason: 'near-reserved', other: otherKey };
          if (other.language !== language) return { ok: false, reason: 'near-language', other: otherKey, owner: other.language };
          if (unique && other.unique) return { ok: false, reason: 'near', other: otherKey };
        }
      }
    }
    return { ok: true };
  }
  claim(text, { language, unique = true, kind = '' } = {}) {
    const verdict = this.probe(text, { language, unique });
    if (verdict.ok && !verdict.existing) this.#add(keyOf(text), { language, reserved: false, unique, kind });
    return verdict;
  }
  #variants(key) { const out = [key]; for (let i = 0; i < key.length; i++) out.push(key.slice(0, i) + key.slice(i + 1)); return out; }
  #add(key, entry) {
    this.entries.set(key, entry);
    if (key.length < this.minNearLength) return;
    for (const variant of this.#variants(key)) { const set = this.index.get(variant); if (set) set.add(key); else this.index.set(variant, new Set([key])); }
  }
}

// ----------------------------------------------------------------------------------------------- data loading
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
// Everything the generator, the builder module and the checks read, loaded once from tools/content/data.
export function loadNamingData(dataDir = DATA_DIR) {
  const world = name => readJson(path.join(dataDir, 'world', name));
  const languages = world('languages.json'), cultures = world('cultures.json'), countryCultures = world('country_cultures.json'), reserved = world('reserved_names.json');
  const { countries } = readJson(path.join(dataDir, 'countries.json'));
  const { labels } = readJson(path.join(dataDir, 'labels.json'));
  let geography = [];
  try { const g = readJson(path.join(dataDir, 'geography', 'erdae.json')); geography = [...(g.namedEstablished ?? []), ...(g.namedProposed ?? [])]; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  let bannedRules = [];
  try { bannedRules = readJson(path.join(dataDir, 'banned_words.json')).rules ?? []; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  return { languages, cultures, countryCultures, reserved, countries, labels, geography, bannedRules };
}

// All established names the generator must never produce: the 305 country names, their capitals and region names, the
// drawn map labels, the geography model's named features, the languages' own established names and the vault names.
export function collectReservedNames(data) {
  const out = new Map();
  const add = (name, source) => { if (name && keyOf(name) && !out.has(keyOf(name))) out.set(keyOf(name), { name: String(name), source }); };
  for (const c of data.countries) { add(c.name, 'country'); add(c.capital, 'capital'); for (const r of c.regions ?? []) add(r, 'region'); }
  for (const l of data.labels) add(l.name, 'label');
  for (const n of data.geography) add(typeof n === 'string' ? n : n.name, 'geography');
  for (const lang of Object.values(data.languages.languages)) for (const e of lang.established_names ?? []) add(e.name, 'established');
  for (const e of data.reserved.established ?? []) add(e.name, 'vault');
  for (const e of data.reserved.superseded ?? []) add(e.name, 'superseded');
  return out;
}

// ----------------------------------------------------------------------------------------------- signatures
// Spec section 6: "at least 55% of the names of a language carry one of its signature features". The signature lines
// of the data are plain words; this maps each to a test. "no th" style lines are rules, not features, and are skipped.
export function signaturePredicates(lang) {
  const preds = [], unparsed = [];
  for (const sig of lang.sound.signature ?? []) {
    const s = sig.trim().toLowerCase(); let m;
    if (/^no /.test(s)) continue;
    if (s === 'ends in e after a consonant') preds.push({ sig, test: k => /[^aeiou]e$/.test(k) });
    else if ((m = s.match(/^(\w+) for (\w+) between vowels$/))) preds.push({ sig, test: k => new RegExp(`[aeiou]${m[1]}[aeiou]`).test(k) });
    else if ((m = s.match(/^(\w+) between vowels$/))) preds.push({ sig, test: k => new RegExp(`[aeiou]${m[1]}[aeiou]`).test(k) });
    else if ((m = s.match(/^initial ([a-z ]+)$/))) preds.push({ sig, test: k => new RegExp(`^(?:${m[1].split(' ').join('|')})`).test(k) });
    else if ((m = s.match(/^ends(?: in)? (.+)$/))) {
      if (m[1] === 'a consonant') preds.push({ sig, test: k => /[^aeiouy]$/.test(k) });
      else { const tails = m[1].split(/\s+/).map(x => x.replace(/^-/, '')); preds.push({ sig, test: k => tails.some(t => k.endsWith(t)) }); }
    } else if (s === 'hyphen compounds') preds.push({ sig, test: (k, text) => text.includes('-') });
    else if (s === 'long vowels') preds.push({ sig, test: k => /aa|ee|ii|oo|uu/.test(k) });
    else if (/^[a-z]+-$/.test(s)) preds.push({ sig, test: k => k.startsWith(s.slice(0, -1)) });
    else if (/^[a-z]+$/.test(s)) preds.push({ sig, test: k => k.includes(s) });
    else unparsed.push(sig);
  }
  return { preds, unparsed };
}
export function carriesSignature(preds, text) {
  const key = keyOf(text), lower = String(text).toLowerCase();
  return preds.some(p => p.test(key, lower));
}

// ------------------------------------------------------------------------------------------------- the rule checks
// The rules a name must obey whatever language drew it. `ctx` carries the data-derived tables (see buildContext).
//   code        meaning
//   alphabet    a word is not letters with optional ' or - between letter groups
//   font        a character outside Windows-1252
//   length      letters outside the range of the kind
//   repeat      the same letter more than max_run_same_letter times in a row
//   consonants  a consonant run longer than max_consonant_run
//   banned      a banned substring, a modern word or a rule of banned_words.json
//   reserved    equals an established name
//   inventory   a letter the language never uses
//   leak        a marker that belongs to another language
const LENGTH_FOR = { place: 'place_letters', given: 'person_given_letters' };
export function checkName(ctx, languageId, text, { kind = 'place', exempt = false } = {}) {
  const problems = [], info = languageId ? ctx.languages.get(languageId) : null, raw = String(text);
  if (languageId && !info) return [{ code: 'language', detail: languageId }];
  const words = raw.split(' ').filter(Boolean);
  for (const w of words) if (!WORD.test(w) && w !== 'of') problems.push({ code: 'alphabet', detail: w });
  for (const ch of nonWindows1252(raw)) problems.push({ code: 'font', detail: ch });
  const key = keyOf(raw), letters = key.length, limits = ctx.length;
  const range = kind === 'full' ? [3, limits.person_full_letters_max] : kind === 'house' ? [3, limits.person_full_letters_max - limits.person_given_letters[1]] : limits[LENGTH_FOR[kind] ?? 'place_letters'];
  if (letters < range[0] || letters > range[1]) problems.push({ code: 'length', detail: `${letters} letters, allowed ${range[0]}-${range[1]}` });
  const runs = new RegExp(`(.)\\1{${limits.max_run_same_letter},}`);
  if (runs.test(key)) problems.push({ code: 'repeat', detail: key.match(runs)[0] });
  for (const w of raw.split(/[ -]/).filter(Boolean)) {
    const run = keyOf(w).split('').reduce((a, ch) => { const n = VOWEL_LETTERS.has(ch) ? 0 : a.cur + 1; return { cur: n, max: Math.max(a.max, n) }; }, { cur: 0, max: 0 }).max;
    if (run > limits.max_consonant_run) problems.push({ code: 'consonants', detail: `${run} in ${w}` });
  }
  if (!exempt) for (const reason of ctx.banned.check(raw)) problems.push({ code: 'banned', detail: reason });
  if (ctx.reserved.has(key) && !exempt) problems.push({ code: 'reserved', detail: key });
  if (info) {
    for (const ch of new Set(key)) if (!info.letters.has(ch)) problems.push({ code: 'inventory', detail: ch });
    for (const [marker, owners] of ctx.markerOwners) if (key.includes(marker) && !owners.has(languageId)) problems.push({ code: 'leak', detail: marker });
  }
  return problems;
}

// The banned-name filter: substrings on the letter key, whole words (the modern blocklist and banned_words.json) on
// each word. Established names are exempt (Titanos holds "tit"), so callers pass `exempt` for them.
export function buildBannedFilter({ substrings = [], modern = [], rules = [] } = {}) {
  const subs = uniqueSorted([...BANNED_SUBSTRINGS, ...substrings].map(s => s.toLowerCase()));
  const words = new Set([...modern, ...REAL_WORLD_WORDS].map(w => w.toLowerCase()));
  const compiled = [];
  for (const rule of rules) {
    try { compiled.push({ id: rule.id, re: new RegExp(`(?<![\\p{L}\\p{N}'])(?:${rule.pattern})(?![\\p{L}\\p{N}'])`, rule.caseSensitive ? 'u' : 'iu') }); } catch { /* an invalid rule is the owner's to fix; the text scan reports it */ }
  }
  return {
    substrings: subs, words, rules: compiled,
    check(text) {
      const reasons = [], key = keyOf(text);
      for (const s of subs) if (key.includes(s)) reasons.push(`substring ${s}`);
      for (const w of String(text).toLowerCase().split(/[^a-z']+/).filter(Boolean)) if (words.has(w)) reasons.push(`modern word ${w}`);
      for (const rule of compiled) if (rule.re.test(String(text))) reasons.push(`rule ${rule.id}`);
      return reasons;
    },
  };
}

// ------------------------------------------------------------------------------------- language runtime tables
function buildLanguageInfo(lang) {
  const letters = new Set(`${lang.sound.consonants} ${lang.sound.vowels} ${lang.sound.diphthongs ?? ''}`.replace(/[^a-z]/g, ''));
  const declared = new Set(letters);
  const pieces = [];
  const elements = Object.entries(lang.elements).map(([key, e], i) => ({ key, form: e.form, bound: e.bound ?? e.form, tags: new Set(e.tags), origin: e.origin, core: i < CORE_ELEMENT_COUNT }));
  for (const e of elements) pieces.push(e.form, e.bound);
  for (const sex of ['male', 'female']) pieces.push(...lang.person[sex].stems, ...lang.person[sex].endings);
  pieces.push(...(lang.person.house?.stems ?? []), ...(lang.person.house?.suffixes ?? []), ...(lang.person.patronymic?.forms ?? []));
  for (const [form] of lang.person.epithets ?? []) pieces.push(form);
  for (const list of Object.values(lang.suffixes ?? {})) for (const s of list) pieces.push(s.form);
  for (const p of pieces) for (const ch of keyOf(p)) letters.add(ch);
  const byTag = new Map();
  for (const e of elements) for (const t of e.tags) (byTag.get(t) ?? byTag.set(t, []).get(t)).push(e);
  const { preds, unparsed } = signaturePredicates(lang);
  // Elements and suffixes whose own form carries a signature feature are drawn more often.
  const boost = new Set(preds.length ? elements.filter(e => carriesSignature(preds, e.form)).map(e => e.key) : []);
  const boostSuffix = new Set(preds.length ? Object.values(lang.suffixes ?? {}).flat().filter(x => carriesSignature(preds, x.form)).map(x => x.form) : []);
  return { id: lang.id, data: lang, letters, declaredLetters: declared, elements, byKey: new Map(elements.map(e => [e.key, e])), byTag, signature: preds, signatureUnparsed: unparsed, morph: lang.morphology, boost, boostSuffix };
}

// Data-derived owners of each leak marker: the table of the spec plus every language that really contains the marker.
function deriveMarkerOwners(languages) {
  const owners = new Map(Object.entries(LEAK_MARKERS).map(([m, ids]) => [m, new Set(ids)]));
  for (const lang of Object.values(languages)) {
    const words = [];
    for (const e of Object.values(lang.elements)) words.push(e.form, e.bound);
    for (const sex of ['male', 'female']) words.push(...lang.person[sex].stems, ...lang.person[sex].endings);
    words.push(...(lang.person.house?.stems ?? []), ...(lang.person.house?.suffixes ?? []));
    for (const list of Object.values(lang.suffixes ?? {})) for (const s of list) words.push(s.form);
    for (const e of lang.established_names ?? []) words.push(e.name);
    for (const s of [...lang.samples.places, ...lang.samples.persons]) words.push(s.name);
    const joined = words.map(w => keyOf(w)).join(' ');
    for (const [marker, set] of owners) if (joined.includes(marker)) set.add(lang.id);
  }
  return owners;
}

export function buildContext(data, { extraBanned = [] } = {}) {
  const gen = data.languages.generator;
  const languages = new Map(Object.values(data.languages.languages).map(l => [l.id, buildLanguageInfo(l)]));
  const reserved = collectReservedNames(data);
  return {
    languages, length: gen.length, markerOwners: deriveMarkerOwners(data.languages.languages), reserved,
    banned: buildBannedFilter({ substrings: [...gen.banned_substrings, ...extraBanned], modern: gen.modern_blocklist, rules: data.bannedRules }),
    generator: gen,
  };
}

// ---------------------------------------------------------------------------------------------------- composing
// The data's composer reads a, e, i, o, u and y as vowels in every language (Orcish has no e of its own, yet "Zuresh" elides
// the final a of zura before it; Yonic and Sunhot elide before y). Junctions and consonant runs use that same view.
const VOWEL_LETTERS = new Set('aeiouy');
const isVowel = (info, ch) => VOWEL_LETTERS.has(ch);
const trailingConsonants = (info, s) => { let n = 0; for (let i = s.length - 1; i >= 0 && !isVowel(info, s[i]); i--) n++; return n; };
const leadingConsonants = (info, s) => { let n = 0; for (let i = 0; i < s.length && !isVowel(info, s[i]); i++) n++; return n; };

// Join two morphs by the language's junction rules (spec: vowel-vowel, consonant-consonant, link vowel, maximum run).
export function junction(info, left, right, person = false) {
  if (!left) return right;
  if (!right) return left;
  const rule = (person ? info.morph.junction_person : info.morph.junction) ?? info.morph.junction ?? { vv: 'keep', cc: 'keep', maxC: 3 };
  const lv = isVowel(info, left.at(-1)), rv = isVowel(info, right[0]);
  if (lv && rv) {
    if (rule.vv === 'elide-left') return left.slice(0, -1) + right;
    const glide = /^glide:(.+)$/.exec(rule.vv);
    return glide ? left + glide[1] + right : left + right;
  }
  if (!lv && !rv) {
    const link = /^link-if:(.+)$/.exec(rule.cc);
    if (link && trailingConsonants(info, left) + leadingConsonants(info, right) > rule.maxC) return left + link[1] + right;
  }
  return left + right;
}

// Compose tokens into a name. Tokens: { t: 'el', key, form, bound }, { t: 'suf', form }, { t: 'stem', text }.
// A pattern is written in reading order (modifier first); a head-first language puts the head noun (the last element
// and its suffix) first. A closed join concatenates with the junction rules; space and hyphen joins write words.
export function composeTokens(info, tokens) {
  const list = [...tokens], suffix = list.at(-1)?.t === 'suf' ? list.pop() : null;
  if (!list.length) return { text: '', parts: [] };
  const head = list.at(-1), mods = list.slice(0, -1);
  const groups = info.morph.order === 'head-mod' ? [{ el: head, suffix }, ...mods.map(el => ({ el, suffix: null }))] : [...mods.map(el => ({ el, suffix: null })), { el: head, suffix }];
  const piece = (token, bound) => (token.t === 'el' ? (bound ? token.bound : token.form) : token.text);
  let text;
  if (info.morph.join === 'closed') {
    const pieces = [];
    groups.forEach((g, i) => { pieces.push(piece(g.el, i < groups.length - 1 || g.suffix)); if (g.suffix) pieces.push(g.suffix.form); });
    text = pieces.reduce((acc, p) => junction(info, acc, p), '');
  } else {
    // A head-first word is followed by its modifier, so it too takes its bound stem ("Yen Alang", not "Yeni Alang").
    const words = groups.map((g, i) => (g.suffix ? junction(info, piece(g.el, true), g.suffix.form) : piece(g.el, i < groups.length - 1)));
    text = words.join(info.morph.join === 'hyphen' ? '-' : ' ');
  }
  return { text: titleCase(text), parts: tokens.map(t => (t.t === 'el' ? t.key : t.t === 'suf' ? `+${t.form}` : `stem:${t.text}`)) };
}

// stem + ending -> a personal name, by the person junction rules.
export const composePerson = (info, stem, ending) => titleCase(junction(info, stem, ending ?? '', true));

// ----------------------------------------------------------------------------------------------- neutral blend
// The default pool (it names the 75 dynamic tags) and Zol's pool (Zol's Mistake has no language) come from a neutral
// blend of the languages of the Middle Lands, weighted by the square root of the countries that speak each one, so that
// the Common Speech leads without drowning the other tongues. Returned in language-id order.
export function neutralBlend(data, region = 'Middle Lands') {
  const counts = new Map();
  for (const c of data.countryCultures.countries) if (c.region === region && c.language) counts.set(c.language, (counts.get(c.language) ?? 0) + 1);
  return [...counts].sort(([a], [b]) => (a < b ? -1 : 1)).map(([language, n]) => ({ language, weight: Math.sqrt(n) }));
}
// Split n names over the blend by largest remainder (so the parts always add up to n).
export function blendShares(blend, n) {
  const total = blend.reduce((a, b) => a + b.weight, 0);
  const raw = blend.map(b => ({ language: b.language, exact: (b.weight / total) * n }));
  const parts = raw.map(x => ({ language: x.language, n: Math.floor(x.exact), rest: x.exact - Math.floor(x.exact) }));
  let left = n - parts.reduce((a, b) => a + b.n, 0);
  for (const p of [...parts].sort((a, b) => b.rest - a.rest || (a.language < b.language ? -1 : 1))) { if (left <= 0) break; p.n++; left--; }
  return parts.map(({ language, n: count }) => ({ language, n: count }));
}

// ------------------------------------------------------------------------------------------------- sample recipes
// The sample names of languages.json carry the recipe that built them: "wolf hill +im" (element keys and a suffix) for a
// place, "G cor+wen | H horn+an" (G male, F female, H house: stem + ending) for a person. composeRecipe() builds the text
// again with the generator's own rules; checks and tests compare it with the sample.
export function composeRecipe(info, recipe, kind) {
  if (kind === 'person') {
    const words = [];
    for (const part of recipe.split('|').map(x => x.trim())) {
      const m = /^([GFH])\s+([a-z']+)(?:\+([a-z']*))?$/.exec(part);
      if (!m) return { text: null, reason: `unreadable part "${part}"` };
      words.push(composePerson(info, m[2], m[3] ?? ''));
    }
    return { text: info.data.person.house?.style === 'of' && words.length === 2 ? `${words[0]} of ${words[1]}` : words.join(' ') };
  }
  const tokens = [];
  for (const word of recipe.trim().split(/\s+/)) {
    if (word.startsWith('+')) { tokens.push({ t: 'suf', form: word.slice(1) }); continue; }
    const e = info.byKey.get(word);
    if (!e) return { text: null, reason: `unknown element "${word}"` };
    tokens.push({ t: 'el', key: e.key, form: e.form, bound: e.bound });
  }
  return { text: composeTokens(info, tokens).text };
}

// ------------------------------------------------------------------------------------------------ toponym layers
// Spec section 5: an old place is named in an older layer. The weights are for settlements; rivers, mountains, forests
// and the other natural features lean on the substrate. `people` limits the chart and holy layers to the peoples Aenor's
// charts and the First Light reached (men and elves); the others keep their own tongue and a regional substrate.
const LAYER_WEIGHTS = { settlement: { current: 70, substrate: 5, chart: 15, holy: 10 }, natural: { current: 40, substrate: 40, chart: 10, holy: 10 } };
const CHART_PEOPLES = new Set(['men', 'elves', 'sun_elves']);
// region -> list of { kinds, language } substrate rules. 'archaic' regions (the language's own older forms) are not
// recorded in the data and fall back to the current language.
const SUBSTRATE = {
  'Middle Lands': [{ kinds: ['river', 'forest', 'lake'], language: 'orran' }],
  'North Lands': [{ kinds: '*', language: 'ainic' }],
  'Cold Lands': [{ kinds: ['mountain'], language: ['gigantic', 'yetic'] }],
  'Dark Lands': [{ kinds: ['mountain'], language: 'orcish' }, { kinds: ['forest'], language: 'dondric' }],
  'Magical Lands': [{ kinds: '*', language: 'sylvan' }],
  'East Lands': [{ kinds: ['river'], language: 'alerhic' }, { kinds: ['lake', 'settlement', 'site'], language: 'noric' }],
  'Dead Lands': [{ kinds: ['river', 'sea', 'strait', 'lake'], language: 'mirolic' }, { kinds: ['mountain'], language: 'infernal' }, { kinds: ['site'], language: 'grave_rite' }],
};
const HOLY = { 'Lands of the Sun': 'galic' };

// The weighted layers for one place: [{ layer, language, weight, pattern?, suffix? }]. 'Zol's Mistake' has no language.
export function layerPlan({ region, language, kind, people = 'men', r }) {
  if (typeof r !== 'function') throw new Error('layerPlan needs the seeded rng of the place');
  const spec = PLACE_SPEC[kind];
  const w = LAYER_WEIGHTS[spec.layers];
  const plan = [{ layer: 'current', language, weight: w.current }];
  const sub = (SUBSTRATE[region] ?? []).find(x => x.kinds === '*' || x.kinds.includes(kind) || (spec.layers === 'settlement' && x.kinds.includes('settlement')));
  const subLanguage = sub ? (Array.isArray(sub.language) ? sub.language[Math.floor(r() * sub.language.length)] : sub.language) : null;
  if (subLanguage && subLanguage !== language) plan.push({ layer: 'substrate', language: subLanguage, weight: w.substrate }); else plan[0].weight += w.substrate;
  if (CHART_PEOPLES.has(people) && language !== 'aenoran' && region !== "Zol's Mistake") {
    const coastal = ['river', 'lake', 'sea', 'strait'].includes(kind);
    plan.push({ layer: 'chart', language: 'aenoran', weight: w.chart, pattern: 'F S', suffix: coastal ? 'waith' : 'dor' });
  } else plan[0].weight += w.chart;
  const holy = HOLY[region] ?? 'ainic';
  // Gala and the Sunhot realms never share a name stem (spec section 8): Sunhot places take no Galic holy form.
  if (CHART_PEOPLES.has(people) && holy !== language && !(language === 'sunhot' && holy === 'galic') && region !== "Zol's Mistake") plan.push({ layer: 'holy', language: holy, weight: w.holy }); else plan[0].weight += w.holy;
  return plan;
}

// ------------------------------------------------------------------------------------------------- the generator
export function createNameGenerator(data, options = {}) {
  const ctx = options.context ?? buildContext(data, options);
  const registry = options.registry ?? new NameRegistry({ nearDistance: ctx.generator.uniqueness?.near_duplicate?.within_language_edit_distance ?? 1, minNearLength: ctx.generator.uniqueness?.near_duplicate?.min_length ?? 5 });
  for (const [, entry] of ctx.reserved) registry.reserve(entry.name, entry.source);
  const order = [...ctx.languages.keys()].sort();
  const spaces = new Map();

  const infoOf = id => { const info = ctx.languages.get(id); if (!info) throw new Error(`Unknown language "${id}"`); return info; };
  const weightOf = (info, e) => (e.core ? ctx.generator.element_weights.core27 : ctx.generator.element_weights.others) * (info.boost.has(e.key) ? 3 : 1);

  // -- places ---------------------------------------------------------------------------------------------------
  const patternTable = (info, spec, r, req) => {
    // A capital uses the language's `site` pattern (spec section 8); a state is named for a settlement or for a land.
    const kind = req.size === 'capital' && spec.layers === 'settlement' ? 'site' : Array.isArray(spec.pattern) ? wpick(spec.pattern, p => (p === 'settlement' ? 55 : 45), r) : spec.pattern;
    return { kind, list: info.data.place_patterns[kind] ?? ctx.generator.default_patterns[kind] };
  };
  const adjustForSize = (list, size) => {
    const slots = p => p.pattern.split(' ');
    if (size === 'hamlet') return list.filter(p => slots(p).length <= 2);
    if (size === 'great_city') return list.filter(p => slots(p).includes('H'));
    if (size === 'city') return list.map(p => (slots(p).includes('H') ? { ...p, weight: p.weight * 2 } : p));
    return list;
  };
  const preferred = { ford: 'ford', bridge: 'bridge', pass: 'pass', river: 'river', coast: 'coast', island: 'island', forest: 'forest', hill: 'hill', mountain: 'mountain', marsh: 'marsh', lake: 'lake', mine: 'iron' };

  function fillSlot(info, slot, r, st) {
    const used = st.used;
    const choose = (tag, extra = {}) => {
      let pool = (info.byTag.get(tag) ?? []).filter(e => !used.has(e.key) && !(st.forbid && st.forbid.has(e.key)));
      if (extra.only) { const only = pool.filter(e => extra.only.includes(e.key)); if (only.length) pool = only; }
      if (!pool.length) return null;
      const wanted = st.features.map(f => preferred[f]).filter(Boolean);
      const pick = wpick(pool, e => weightOf(info, e) * (wanted.includes(e.key) ? 4 : 1), r);
      used.add(pick.key);
      return { t: 'el', key: pick.key, form: pick.form, bound: pick.bound };
    };
    switch (slot) {
      case 'Q': return choose('q'); case 'H': return choose('h'); case 'F': return choose('f'); case 'A': return choose('a');
      case 'M': return choose('m'); case 'N': return choose('n'); case 'R': return choose('r');
      case 'L': return choose('l', st.head ? { only: [st.head] } : {});
      case 'W': return choose('w');
      case 'E': { const sex = r() < 0.7 ? 'male' : 'female', stems = info.data.person[sex].stems; return { t: 'stem', text: stems[Math.floor(r() * stems.length)] }; }
      case 'S': {
        const kinds = st.suffixKinds, list = kinds.map(k => info.data.suffixes[k]).find(l => l?.length);
        if (!list) return null;
        if (st.forceSuffix) return { t: 'suf', form: st.forceSuffix, gloss: 'chart ending' };
        const s = wpick(list, x => (x.weight ?? 1) * (info.boostSuffix.has(x.form) ? 3 : 1), r); return { t: 'suf', form: s.form, gloss: s.gloss };
      }
      default: throw new Error(`Unknown pattern slot ${slot}`);
    }
  }

  function placeCandidate(info, req, r, phase) {
    const spec = PLACE_SPEC[req.kind];
    const { kind: patternKind, list } = patternTable(info, spec, r, req);
    const sized = adjustForSize(list, req.size === 'capital' ? 'x' : req.size);
    const usable = sized.length ? sized : list;
    const pattern = (req.pattern ?? wpick(usable, p => p.weight, r).pattern).split(' ');
    if (phase === 1 && pattern[0] !== 'Q') pattern.unshift('Q');
    if (phase === 2 && pattern[0] !== 'E') pattern.unshift('E');
    const suffixKinds = [info.data.suffix_kind_for?.[patternKind] ?? patternKind, 'settlement'];
    const st = { used: new Set(), features: req.features ?? [], head: spec.head, suffixKinds, forceSuffix: req.suffix ?? null, forbid: new Set(['river', 'lake', 'sea', 'mountain', 'forest'].filter(k => k === req.kind || (req.kind === 'strait' && k === 'sea'))) };
    st.forbid.delete(spec.head);
    const tokens = [];
    for (const slot of pattern) { const t = fillSlot(info, slot, r, st); if (!t) return null; tokens.push(t); }
    const composed = composeTokens(info, tokens);
    const gloss = tokens.map(t => (t.t === 'el' ? t.key : t.t === 'suf' ? `-${t.gloss ?? t.form}` : `named for ${titleCase(t.text)}`)).join(' ').replace(/ -/g, ' -');
    return { text: composed.text, parts: composed.parts, gloss, pattern: pattern.join(' ') };
  }

  // Spec section 6: at least 55% of a language's names carry its own signature. The dictionary boosts the elements and
  // suffixes that carry it (weight x3, "a language may boost its signature elements"), and a quota per (language, kind)
  // asks for a signature-bearing candidate whenever fewer than 62% of the names accepted so far have one. Some signatures
  // cannot be made from the dictionary (Aenoran regions never end in e after a consonant): after 150 candidates without
  // one the name is taken as it is, and after 8 such searches in a row the kind is marked infeasible and no longer pursued.
  const QUOTA = 0.62, SEARCH = 150, GIVE_UP = 8;
  const quotas = new Map();
  const quotaOf = (id, kind) => { const key = `${id}:${kind}`; return quotas.get(key) ?? quotas.set(key, { accepted: 0, sig: 0, fails: 0 }).get(key); };

  // A place name, deterministic from (kind, entityId); redraws with #n, then more elements, then an eponym.
  function place(req) {
    const info = infoOf(req.language);
    if (!PLACE_SPEC[req.kind]) throw new Error(`Unknown place kind "${req.kind}"`);
    // The personal-name spaces of all languages claim their words first, in language order, whatever the call order.
    nameSpaceOf(order[0]);
    const entityId = String(req.entityId), quota = quotaOf(info.id, req.kind);
    let pursue = info.signature.length > 0 && quota.fails < GIVE_UP && (quota.accepted === 0 || quota.sig / quota.accepted < QUOTA);
    let skips = 0;
    for (let attempt = 0; attempt < 24 * 3 + SEARCH + 8; attempt++) {
      const r = rng(`zin-names:${req.kind}:${entityId}${attempt ? `#${attempt}` : ''}`);
      const cand = placeCandidate(info, req, r, Math.min(2, Math.floor((attempt - skips) / 24)));
      if (!cand) continue;
      if (checkName(ctx, info.id, cand.text, { kind: 'place' }).length) continue;
      const carries = info.signature.length > 0 && carriesSignature(info.signature, cand.text);
      if (pursue && !carries) { if (++skips >= SEARCH) { pursue = false; quota.fails++; } continue; }
      const verdict = registry.claim(cand.text, { language: info.id, unique: true, kind: req.kind });
      if (!verdict.ok) continue;
      quota.accepted++; if (carries) { quota.sig++; quota.fails = 0; }
      return { text: cand.text, key: keyOf(cand.text), language: info.id, dialect: req.dialect ?? null, kind: req.kind, parts: cand.parts, gloss: cand.gloss, attempts: attempt + 1, layer: req.layer ?? 'current', parent: req.parent ?? null };
    }
    throw new Error(`Cannot name ${req.kind} "${entityId}" in ${req.language}: the dictionary and the registry are exhausted`);
  }

  // -- persons --------------------------------------------------------------------------------------------------
  const personRules = info => info.data.person;
  const nameSpaceOf = id => {
    if (!spaces.size) {
      for (const lid of order) spaces.set(lid, buildSpace(infoOf(lid)));
    }
    const space = spaces.get(id);
    if (!space) throw new Error(`Unknown language "${id}"`);
    return space;
  };

  function claimToken(info, text, kind) {
    if (checkName(ctx, info.id, text, { kind }).length) return false;
    return registry.claim(text, { language: info.id, unique: false, kind }).ok;
  }

  function buildSpace(info) {
    const p = personRules(info);
    const take = (candidates, kind) => {
      const out = [], seen = new Set();
      for (const c of candidates) {
        if (seen.has(c.text)) continue;
        seen.add(c.text);
        if (claimToken(info, c.text, kind === 'house' ? 'house' : 'given')) out.push(c.text);
      }
      return out;
    };
    const combos = (stems, endings, bare) => {
      const out = [];
      for (const s of stems) for (const e of endings) out.push({ text: composePerson(info, s, e) });
      if (bare) for (const s of stems) out.push({ text: composePerson(info, s, '') });
      return out;
    };
    const male = { tier1: take(combos(p.male.stems, p.male.endings, true), 'given'), tier2: take(combos(p.female.stems, p.male.endings, false), 'given') };
    const female = { tier1: take(combos(p.female.stems, p.female.endings, true), 'given'), tier2: take(combos(p.male.stems, p.female.endings, false), 'given') };
    let house, houseStyle = p.house?.style ?? 'none';
    if (houseStyle === 'none' || !p.house?.stems?.length) {
      // No surnames in this language: the byname pool is a second personal name (lineage), kept apart from given names.
      houseStyle = 'none';
      house = { tier1: take(combos(p.male.stems, p.male.endings, false).map(c => ({ text: c.text })), 'house'), tier2: take(combos(p.female.stems, p.male.endings, false), 'house') };
    } else {
      // Tier 2: the bare stems and the stems of the dictionary's animals, materials and features ("surnames are place-names").
      const elementStems = uniqueSorted([...(info.byTag.get('a') ?? []), ...(info.byTag.get('m') ?? []), ...(info.byTag.get('f') ?? [])].map(e => e.bound));
      house = { tier1: take(combos(p.house.stems, p.house.suffixes, false), 'house'), tier2: take([...combos(p.house.stems, [''], false), ...combos(elementStems, p.house.suffixes, false)], 'house') };
    }
    const animals = (info.byTag.get('a') ?? []).concat(info.byTag.get('m') ?? []), feats = info.byTag.get('f') ?? [];
    const calls = [];
    for (const a of animals) for (const f of feats) if (a.key !== f.key) calls.push({ text: composeTokens(info, [{ t: 'el', ...a }, { t: 'el', ...f }]).text });
    const callsign = take(calls, 'given');
    return { male, female, house, houseStyle, callsign, sortedAll: null };
  }

  // The names of a person: a seeded draw from the language's name space.
  function drawFrom(list, r) { return list[Math.floor(r() * list.length)]; }
  // A full person: given name, then a house name (surname, clan, tribe, "of X") or, in a language without houses, a lineage
  // name drawn like a second personal name. Full names are unique in the world; the words themselves are shared by a people.
  const fullNames = new Set();
  function person({ language, sex, entityId, epithet = false }) {
    const info = infoOf(language), space = nameSpaceOf(language), p = personRules(info);
    for (let attempt = 0; attempt < 72; attempt++) {
      const r = rng(`zin-names:person:${entityId}${attempt ? `#${attempt}` : ''}`);
      const pool = sex === 'f' ? space.female : space.male, wide = attempt >= 24;
      const given = drawFrom(wide ? [...pool.tier1, ...pool.tier2] : pool.tier1.length ? pool.tier1 : pool.tier2, r);
      const token = drawFrom(wide ? [...space.house.tier1, ...space.house.tier2] : space.house.tier1.length ? space.house.tier1 : space.house.tier2, r);
      const of = p.house?.style === 'of' && space.houseStyle !== 'none';
      const house = of ? `of ${token}` : token, full = `${given} ${house}`;
      let epi = null;
      if (epithet && p.epithets?.length) { const [form, gloss] = p.epithets[Math.floor(r() * p.epithets.length)]; epi = { text: titleCase(form), gloss }; }
      if (checkName(ctx, info.id, full, { kind: 'full' }).length || fullNames.has(keyOf(full))) continue;
      fullNames.add(keyOf(full));
      return { text: full, key: keyOf(full), language: info.id, kind: sex === 'f' ? 'given_f' : 'given_m', given, house, epithet: epi, attempts: attempt + 1 };
    }
    throw new Error(`Cannot name person "${entityId}" in ${language}`);
  }

  function title(language, role = 'ruler_m') {
    const t = infoOf(language).data.person.titles ?? {};
    return t[role] ?? null;
  }
  const epithets = language => (infoOf(language).data.person.epithets ?? []).map(([form, gloss]) => ({ text: titleCase(form), gloss }));

  // One entry point for every kind of name (spec section 4). A place claims the registry; a given name, a house word, an
  // epithet and a title are drawn from the language's own lists (the words are shared by a whole people, so they only
  // have to be free of other languages). `seed` salts the entity id when a caller wants another draw of the same entity.
  function generate(req) {
    const info = infoOf(req.language), entityId = req.seed ? `${req.seed}:${req.entityId}` : String(req.entityId);
    if (PLACE_KINDS.includes(req.kind)) return place({ ...req, entityId });
    if (!PERSON_KINDS.includes(req.kind)) throw new Error(`Unknown name kind "${req.kind}"`);
    const space = nameSpaceOf(info.id), r = rng(`zin-names:${req.kind}:${entityId}`), draw = list => list[Math.floor(r() * list.length)];
    const named = (text, parts, gloss = null) => ({ text, key: keyOf(text), language: info.id, dialect: req.dialect ?? null, kind: req.kind, parts, gloss, attempts: 1, layer: null, parent: req.parent ?? null });
    if (req.kind === 'given_m') return named(draw(space.male.tier1), ['male']);
    if (req.kind === 'given_f') return named(draw(space.female.tier1), ['female']);
    if (req.kind === 'house') {
      const token = draw(space.house.tier1.length ? space.house.tier1 : space.house.tier2);
      return named(info.data.person.house?.style === 'of' && space.houseStyle !== 'none' ? `of ${token}` : token, ['house', space.houseStyle]);
    }
    if (req.kind === 'epithet') { const e = draw(epithets(info.id)); return named(e.text, ['epithet'], e.gloss); }
    const role = req.role ?? 'ruler_m', text = title(info.id, role);
    if (!text) throw new Error(`${info.id} has no title ${role}`);
    return named(text, ['title', role]);
  }

  // Pool for a country: n names of a kind drawn from the language's space, tier 1 first, with the signature pulled in.
  function pool(language, kind, n, seed, floor = 0) {
    const space = nameSpaceOf(language), info = infoOf(language);
    const part = kind === 'male' ? space.male : kind === 'female' ? space.female : kind === 'house' ? space.house : { tier1: space.callsign, tier2: [] };
    const r = rng(`zin-names:pool:${kind}:${seed}`);
    const take = list => {
      const all = shuffle(list, r);
      if (!info.signature.length) return all;
      const sig = all.filter(x => carriesSignature(info.signature, x.replace(/^of /, ''))), rest = all.filter(x => !carriesSignature(info.signature, x.replace(/^of /, '')));
      const wantSig = Math.min(sig.length, Math.ceil(n * 0.62));
      return [...sig.slice(0, wantSig), ...rest, ...sig.slice(wantSig)];
    };
    const chosen = take(part.tier1).slice(0, n);
    if (chosen.length < n) for (const x of take(part.tier2)) { if (chosen.length >= n) break; if (!chosen.includes(x)) chosen.push(x); }
    if (chosen.length < floor) throw new Error(`The name space of ${language} holds only ${chosen.length} ${kind} names (need ${floor})`);
    const prefixed = kind === 'house' && space.houseStyle !== 'none' && info.data.person.house.style === 'of' ? chosen.map(x => `of ${x}`) : chosen;
    return prefixed.sort();
  }

  return {
    ctx, registry, order, infoOf, nameSpace: nameSpaceOf, generate, place, person, title, epithets, pool, signatureQuota: (id, kind) => ({ ...quotaOf(id, kind), infeasible: quotaOf(id, kind).fails >= GIVE_UP }), validate: (language, text, opts) => checkName(ctx, language, text, opts),
    languages: () => order.slice(),
  };
}
