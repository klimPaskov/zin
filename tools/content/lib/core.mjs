// ZIN content builder core: deterministic randomness, Clausewitz and localisation writers, and a staged file set.
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import path from 'node:path';

import { GAME } from './paths.mjs';
export { GAME };

// FNV-1a seeded xorshift; the same seed text always yields the same sequence.
export function rng(seedText) {
  let h = 2166136261;
  for (const ch of String(seedText)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
}
export const pick = (arr, r) => arr[Math.floor(r() * arr.length)];
export const ascii = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const keyOf = s => ascii(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// Clausewitz serializer. Objects become blocks; arrays of primitives become space lists; arrays of objects
// repeat the key (for `key = { } key = { }`). A value wrapped by raw() is written as-is.
const RAW = Symbol('raw');
export const raw = text => ({ [RAW]: text });
const scalar = v => typeof v === 'boolean' ? (v ? 'yes' : 'no') : typeof v === 'number' ? (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3)))) : /^[A-Za-z0-9_.:@\-]+$/.test(v) ? v : JSON.stringify(v);
export function cw(obj, depth = 0) {
  const pad = '\t'.repeat(depth), lines = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length && typeof v[0] === 'object' && !v[0][RAW]) { for (const item of v) lines.push(`${pad}${k} = {\n${cw(item, depth + 1)}${pad}}`); continue; }
    if (Array.isArray(v)) { lines.push(`${pad}${k} = { ${v.map(x => x?.[RAW] ?? scalar(x)).join(' ')} }`); continue; }
    if (typeof v === 'object' && v[RAW] !== undefined) { lines.push(`${pad}${k} = ${v[RAW]}`); continue; }
    if (typeof v === 'object') { lines.push(`${pad}${k} = {\n${cw(v, depth + 1)}${pad}}`); continue; }
    lines.push(`${pad}${k} = ${scalar(v)}`);
  }
  return lines.map(l => l + '\n').join('');
}

// Localisation: UTF-8 with BOM, l_english header, quotes escaped.
export function yml(entries, language = 'english') {
  const body = Object.entries(entries).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([k, v]) => ` ${k}:0 "${String(v).replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`).join('\n');
  return Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(`l_${language}:\n${body}\n`)]);
}

export class Staged {
  constructor() { this.files = new Map(); }
  text(rel, content) { this.add(rel, Buffer.from(content.endsWith('\n') ? content : content + '\n')); }
  add(rel, bytes) { if (this.files.has(rel)) throw new Error(`Duplicate staged file ${rel}`); this.files.set(rel, Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes)); }
  loc(name, entries) { this.add(`localisation/english/${name}_l_english.yml`, yml(entries)); }
  async write(dir) {
    await rm(dir, { recursive: true, force: true });
    for (const [rel, bytes] of [...this.files].sort(([a], [b]) => a.localeCompare(b, 'en'))) { const full = path.join(dir, rel); await mkdir(path.dirname(full), { recursive: true }); await writeFile(full, bytes); }
  }
}

// Every modifier key the builder writes must exist in the installed game's modifier documentation.
let validModifiers;
export async function assertModifiers(where, modifiers) {
  validModifiers ??= new Set([...(await readFile(`${GAME}/documentation/modifiers_documentation.md`, 'utf8')).matchAll(/^## ([a-z0-9_]+)$/gm)].map(m => m[1]));
  for (const k of Object.keys(modifiers)) if (!validModifiers.has(k)) throw new Error(`Unknown modifier ${k} in ${where}`);
}
