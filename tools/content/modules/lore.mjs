// The owner's lore vault travels with the mod, unchanged, under docs/lore/vault/. It is read from the owner's
// export when present, otherwise from the copy already in ZIN, so a rebuild never loses it.
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { LORE_VAULT } from '../lib/paths.mjs';

const SOURCES = [LORE_VAULT];

async function walk(dir, base = dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue; // editor state (.obsidian) is not lore
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(full, base)); else out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out.sort((a, b) => a.localeCompare(b, 'en'));
}

export async function stageLore(staged, zinRoot) {
  const candidates = [...SOURCES, `${zinRoot}/docs/lore/vault`];
  for (const src of candidates) {
    try { if (!(await stat(src)).isDirectory()) continue; } catch { continue; }
    const files = await walk(src);
    for (const rel of files) staged.add(`docs/lore/vault/${rel}`, await readFile(path.join(src, rel)));
    return { source: src, files: files.length };
  }
  throw new Error('Lore vault not found');
}
