// Regenerates tools/content/data/warfare_ids.json (every id the warfare module defines; other slices read it).
//   node tools/content/write_warfare_ids.mjs
// The warfare test compares the file with the build and fails when they differ.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Staged } from './lib/core.mjs';
import { buildNames } from './modules/names.mjs';
import { buildWarfare } from './modules/warfare.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const { countries } = JSON.parse(await readFile(path.join(here, 'data/countries.json'), 'utf8'));
const { labels } = JSON.parse(await readFile(path.join(here, 'data/labels.json'), 'utf8'));
const pools = buildNames(new Staged(), countries, labels);
const ctx = { countries, pools };
await buildWarfare(new Staged(), ctx);
await writeFile(path.join(here, 'data/warfare_ids.json'), `${JSON.stringify(ctx.model.ids, null, 1)}\n`);
console.log(`wrote data/warfare_ids.json (${Object.keys(ctx.model.ids).length} sections)`);
