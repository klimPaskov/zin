// The characters that an in-game effect brings into play (a focus, an event, a decision or a mechanic's scripted effect): second error
// pass of the integrated build (docs/plans/zin-errors/powder_and_pass2_handoff.md; lead decision of 25 October 2026).
//
// The game recruits a character only in country history: recruit_character anywhere else logs "recruit_character should only happen in
// game/history files", and by the wiki (Character modding: "Recruitment cannot take place outside of country history") such a character
// may never appear. The vanilla pattern recruits in history and moves the character with set_nationality when the story needs it (the
// Belgian focus moves COG_cyrille_adoula; installed effects_documentation.md, set_nationality; wiki Effects, party_leader example).
//
//   applyLateCharacters(staged, { countries })   runs over the finished staged tree (after the focus trees and the regional decisions,
//     before the final reference pass):
//       1. every character that an effect outside history/ recruits and that no history recruits waits, without a role, in the history of
//          its home realm (its court's realm in data/world/characters, or data/late_character_homes.json);
//       2. its roles leave its character definition and come into play with it: the call becomes
//            if = { limit = { NOT = { has_character = X } } X = { set_nationality = PREV } }
//            if = { limit = { NOT = { has_global_flag = zin_in_play_<x> } } set_global_flag = zin_in_play_<x> <add_*_role ...> }
//          (country scope, the scope of every recruit_character; inside X's scope PREV is the realm that brings X in). An advisor role keeps
//          slot, token, cost, traits, allowed and firing; the script blocks an added role cannot carry (visible, available, ai_will_do,
//          on_add, on_remove) are dropped, as vanilla's add_advisor_role examples do;
//       3. every test of presence outside history/ (has_character = X) also asks the flag of entry, so a waiting character is in play
//          nowhere: `AND = { has_character = X has_global_flag = zin_in_play_<x> }` (Eindil's "any_country = { has_character = ... }");
//       4. a recruit_character of a character some history already recruits becomes the move alone.
//     Returns { calls, moved, waiting, ids, homes }.
// The flags are global (a character is in play once, wherever it stands); zin_in_play_<character id without zin_>.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '../lib/clausewitz.mjs';
import { childBlocks } from '../lib/tech_tree_gui.mjs';
import { loadCharacterData } from './characters.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const HOMES_FILE = path.join(here, '../data/late_character_homes.json');
const RECRUIT = /\brecruit_character\s*=\s*([A-Za-z0-9_]+)/g;
const isScript = rel => /^(common|events)\/.*\.txt$/.test(rel);
export const inPlayFlag = id => `zin_in_play_${id.replace(/^zin_/, '')}`;
const ROLE_EFFECT = { corps_commander: 'add_corps_commander_role', field_marshal: 'add_field_marshal_role', navy_leader: 'add_naval_commander_role' };
const ADVISOR_KEEP = new Set(['slot', 'idea_token', 'cost', 'traits', 'allowed', 'can_be_fired', 'ledger', 'removal_cost']);
const SCRIPT_BLOCKS = new Set(['visible', 'available', 'ai_will_do', 'on_add', 'on_remove']);

// A one-line Clausewitz printer for the parsed role bodies.
function print(entries) {
  return entries.map(e => {
    if (e.k === null) return Array.isArray(e.v) ? `{ ${print(e.v)} }` : (e.quoted ? `"${e.v}"` : e.v);
    if (Array.isArray(e.v)) return e.v.length ? `${e.k} ${e.op} { ${print(e.v)} }` : `${e.k} ${e.op} { }`;
    return `${e.k} ${e.op} ${e.quoted ? `"${e.v}"` : e.v}`;
  }).join(' ');
}
// The effect that gives a waiting character one role it had in its definition.
export function roleEffect(id, role) {
  const body = role.v;
  if (role.k === 'advisor') return `add_advisor_role = { character = ${id} advisor = { ${print(body.filter(e => ADVISOR_KEEP.has(e.k)))} } }`;
  if (role.k === 'country_leader') return `add_country_leader_role = { character = ${id} country_leader = { ${print(body.filter(e => e.k !== 'id' && !SCRIPT_BLOCKS.has(e.k)))} } }`;
  if (ROLE_EFFECT[role.k]) return `${ROLE_EFFECT[role.k]} = { character = ${id} ${print(body.filter(e => !SCRIPT_BLOCKS.has(e.k) && e.k !== 'legacy_id'))} }`;
  throw new Error(`late characters: ${id} has a ${role.k} role, which no effect here can add`);
}
export const moveText = id => `if = { limit = { NOT = { has_character = ${id} } } ${id} = { set_nationality = PREV } }`;
export const bringText = (id, roles) => `${moveText(id)} if = { limit = { NOT = { has_global_flag = ${inPlayFlag(id)} } } set_global_flag = ${inPlayFlag(id)}${roles.length ? ` ${roles.join(' ')}` : ''} }`;

// Rewrite the code (not the comments) of each line of a script text.
function eachCode(text, fn) {
  return text.split('\n').map(line => {
    const hash = line.indexOf('#'), code = hash < 0 ? line : line.slice(0, hash), rest = hash < 0 ? '' : line.slice(hash);
    return fn(code) + rest;
  }).join('\n');
}
export function historyRecruits(files) {
  const by = new Map();
  for (const [rel, bytes] of files) {
    const m = /^history\/countries\/([A-Z0-9]{3}) - /.exec(rel);
    if (!m) continue;
    for (const r of bytes.toString('utf8').matchAll(RECRUIT)) (by.get(r[1]) ?? by.set(r[1], new Set()).get(r[1])).add(m[1]);
  }
  return by;
}
const ROLE_KEYS = new Set(['country_leader', 'advisor', 'corps_commander', 'field_marshal', 'navy_leader', 'scientist']);

export async function applyLateCharacters(staged, { countries, homes = JSON.parse(readFileSync(HOMES_FILE, 'utf8')).homes, courts = loadCharacterData() }) {
  const tagOfName = new Map(countries.map(c => [c.name, c.tag]));
  // 1. who is recruited during play, and who waits
  const moved = new Set();
  for (const [rel, bytes] of staged.files) if (isScript(rel)) for (const m of bytes.toString('utf8').matchAll(RECRUIT)) moved.add(m[1]);
  const inHistory = historyRecruits(staged.files);
  const waiting = [...moved].filter(id => !inHistory.has(id)).sort();
  const courtOf = new Map();
  for (const r of courts) for (const c of [r.ruler, r.heir, ...r.advisors, ...r.commanders, ...(r.figures ?? [])].filter(Boolean)) courtOf.set(c.id, r.name);
  const homeOf = new Map(), problems = [];
  for (const id of waiting) {
    const name = courtOf.get(id) ?? homes[id]?.realm;
    const tag = name && tagOfName.get(name);
    if (!tag) problems.push(`${id}: no home realm (add it to data/late_character_homes.json)${name ? `; ${name} is not in the roster` : ''}`);
    else homeOf.set(id, tag);
  }
  for (const id of Object.keys(homes)) if (!waiting.includes(id)) problems.push(`data/late_character_homes.json names ${id}, which no effect brings into play`);
  // 2. the roles of the waiting characters leave their definitions
  const rolesOf = new Map(waiting.map(id => [id, []]));
  for (const [rel, bytes] of [...staged.files]) {
    if (!/^common\/characters\/.*\.txt$/.test(rel)) continue;
    let text = bytes.toString('utf8'), changed = false;
    const top = childBlocks(text, 0, text.length).find(b => b.key === 'characters');
    if (!top) continue;
    const defs = childBlocks(text, top.open + 1, top.end - 1).filter(b => rolesOf.has(b.key)).sort((a, b) => b.start - a.start);
    for (const def of defs) {
      const roles = childBlocks(text, def.open + 1, def.end - 1).filter(b => ROLE_KEYS.has(b.key)).sort((a, b) => b.start - a.start);
      for (const r of roles) {
        rolesOf.get(def.key).unshift(roleEffect(def.key, parse(text.slice(r.start, r.end))[0]));
        text = text.slice(0, r.start) + text.slice(r.end).replace(/^[ \t]*\r?\n/, '');
        changed = true;
      }
      rolesOf.get(def.key).defined = true;
    }
    if (changed) staged.files.set(rel, Buffer.from(text));
  }
  for (const id of waiting) if (!rolesOf.get(id).defined) problems.push(`${id} is brought into play but no character file defines it`);
  if (problems.length) throw new Error(`Late characters (${problems.length}):\n  ${problems.join('\n  ')}`);
  // 3 and 4. the presence tests and the calls
  const waitSet = new Set(waiting), presence = new RegExp(`\\bhas_character\\s*=\\s*(${waiting.join('|') || '(?!)'})\\b`, 'g');
  let calls = 0;
  for (const [rel, bytes] of [...staged.files]) {
    if (!isScript(rel)) continue;
    const before = bytes.toString('utf8');
    if (!before.includes('recruit_character') && !waiting.some(id => before.includes(id))) continue;
    const after = eachCode(eachCode(before, code => code.replace(presence, (m, id) => `AND = { has_character = ${id} has_global_flag = ${inPlayFlag(id)} }`)),
      code => code.replace(RECRUIT, (m, id) => { calls++; return waitSet.has(id) ? bringText(id, rolesOf.get(id)) : moveText(id); }));
    if (after !== before) staged.files.set(rel, Buffer.from(after));
  }
  // 1. the recruits in the home histories, before the politics (the first recruited leader of a party rules; these have no role)
  const byHome = new Map();
  for (const id of waiting) (byHome.get(homeOf.get(id)) ?? byHome.set(homeOf.get(id), []).get(homeOf.get(id))).push(id);
  for (const [tag, ids] of byHome) {
    const rel = [...staged.files.keys()].find(k => k.startsWith(`history/countries/${tag} - `));
    if (!rel) throw new Error(`late characters: no history for ${tag}`);
    const text = staged.files.get(rel).toString('utf8'), at = text.indexOf('set_politics');
    if (at < 0) throw new Error(`late characters: ${rel} sets no politics`);
    const lines = `# Characters a focus, an event or a mechanic brings into play; they have no role until then (modules/late_characters.mjs).\n${ids.map(id => `recruit_character = ${id}`).join('\n')}\n`;
    staged.files.set(rel, Buffer.from(text.slice(0, at) + lines + text.slice(at)));
  }
  return { calls, moved: moved.size, waiting: waiting.length, ids: waiting, homes: Object.fromEntries([...homeOf].sort()) };
}
