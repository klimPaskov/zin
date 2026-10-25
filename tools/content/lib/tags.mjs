// Real three-letter country tags derived from country names (requirement R-27, owner rule F2: NOR for Noris, AEN for Aenor).
//
//   deriveTag(name, taken)        -> the best free tag for one name, or null when every candidate is taken
//   assignTags(rows, options)     -> Map(key -> tag) for rows in priority order (earlier rows get the better tags)
//   checkTags(tags, options)      -> { errors, stats }   the A-27 check: shape, uniqueness, vanilla, reserved, total
//
// Candidates follow the base game's habit: the first three letters of the name, then the first letter with the name's
// consonant skeleton, then every ordered triple of the name's letters, earlier letters first. A tag is refused when it is a
// vanilla tag or script word (data/vanilla/country_tags.json: it would bring back vanilla data or be ambiguous in a scope),
// a dynamic tag (D followed by digits is the engine's convention for civil wars and releases), already taken, a letter
// tripled, or on the small list of tags that read as words a player should not see. The module is pure and deterministic.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const VANILLA = JSON.parse(readFileSync(path.join(here, '../data/vanilla/country_tags.json'), 'utf8'));
export const VANILLA_TAGS = new Set(VANILLA.tags);
export const RESERVED_WORDS = new Set(VANILLA.reserved);
/** The engine crashes placing flags above 439 country tags (minidumps of 19 October 2026, fix ca01fa3). */
export const TAG_LIMIT = 439;
const UNSEEMLY = new Set(['ASS', 'CUM', 'FAG', 'FUK', 'GAY', 'KKK', 'NAZ', 'NIG', 'POO', 'SEX', 'SSS', 'TIT', 'WTF', 'XXX', 'DIE', 'GOD', 'HEL']);
const LEADING = /^(the|kingdom|realm|holds?|lands?|isles?|islands?|free|city|of)$/i;

const ascii = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z' -]/g, ' ');
const words = name => ascii(name).split(/[\s-]+/).map(w => w.replace(/'s$/i, '').replace(/'/g, '')).filter(Boolean);
const isVowel = c => 'AEIOUY'.includes(c);

/** The candidate tags of a name in priority order (duplicates removed). */
export function candidates(name) {
  const ws = words(name).map(w => w.toUpperCase());
  const core = ws.filter(w => !LEADING.test(w));
  const main = (core.length ? core : ws)[0] ?? '';
  const letters = (core.length ? core : ws).join('');
  const out = [];
  const push = t => { if (/^[A-Z]{3}$/.test(t) && !out.includes(t)) out.push(t); };
  push(main.slice(0, 3));
  const skeleton = main[0] + [...main.slice(1)].filter(c => !isVowel(c)).join('');
  push(skeleton.slice(0, 3));
  if (core.length > 1) {
    push(main.slice(0, 2) + core[1][0]);
    push(main[0] + core[1].slice(0, 2));
    if (core.length > 2) push(core[0][0] + core[1][0] + core[2][0]);
  }
  for (let i = 1; i < letters.length; i++) for (let j = i + 1; j < letters.length; j++) push(letters[0] + letters[i] + letters[j]);
  return out;
}

export function refused(tag, taken = new Set()) {
  if (!/^[A-Z]{3}$/.test(tag)) return 'shape';
  if (VANILLA_TAGS.has(tag)) return 'vanilla tag';
  if (RESERVED_WORDS.has(tag)) return 'script word';
  if (/^D\d\d$/.test(tag)) return 'dynamic tag';
  // A tag names files (gfx/flags/<TAG>.tga); Windows refuses the device names as file names.
  if (/^(CON|PRN|AUX|NUL)$/.test(tag)) return 'windows device name';
  if (/^(.)\1\1$/.test(tag)) return 'tripled letter';
  if (UNSEEMLY.has(tag)) return 'unseemly';
  if (taken.has(tag)) return 'taken';
  return null;
}

export function deriveTag(name, taken = new Set()) {
  return candidates(name).find(t => !refused(t, taken)) ?? null;
}

/**
 * rows: [{ key, name, fixed? }] in priority order. A row with `fixed` keeps that tag (checked like any other). Returns a Map
 * from key to tag; throws, naming the row, when no candidate is free.
 */
export function assignTags(rows, { reserved = [] } = {}) {
  const taken = new Set(reserved);
  const out = new Map();
  for (const r of rows.filter(r => r.fixed)) {
    const why = refused(r.fixed, taken);
    if (why) throw new Error(`Fixed tag ${r.fixed} of ${r.name} is refused: ${why}`);
    taken.add(r.fixed); out.set(r.key, r.fixed);
  }
  for (const r of rows.filter(r => !r.fixed)) {
    const tag = deriveTag(r.name, taken);
    if (!tag) throw new Error(`No free tag can be derived from "${r.name}" (${r.key})`);
    taken.add(tag); out.set(r.key, tag);
  }
  return out;
}

/** The A-27 check. tags: [{ tag, name }]; dynamic: the number of dynamic tags declared after them. */
export function checkTags(tags, { dynamic = 0 } = {}) {
  const errors = [];
  const seen = new Map();
  for (const { tag, name } of tags) {
    if (seen.has(tag)) errors.push({ code: 'TAG_DUPLICATE', tag, message: `${tag} is used by ${seen.get(tag)} and ${name}` });
    seen.set(tag, name);
    const why = refused(tag);
    if (why) errors.push({ code: 'TAG_REFUSED', tag, message: `${tag} (${name}): ${why}` });
    else if (name && !ascii(name).toUpperCase().replace(/[^A-Z]/g, '').includes(tag[0])) errors.push({ code: 'TAG_NOT_FROM_NAME', tag, message: `${tag} shares no first letter with ${name}` });
  }
  const total = tags.length + dynamic;
  if (total >= TAG_LIMIT) errors.push({ code: 'TAG_TOTAL', tag: null, message: `${tags.length} country tags and ${dynamic} dynamic tags make ${total}; the game crashes from ${TAG_LIMIT}` });
  return { errors, stats: { tags: tags.length, dynamic, total, limit: TAG_LIMIT } };
}
