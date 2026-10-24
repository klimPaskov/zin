// Image-generation jobs for the flags of the realms of the roster (R-92, rule F4), from the designs of
// tools/content/data/world/heraldry.json (one design per realm, keyed by tag; generator tools/content/heraldry/build_heraldry.mjs).
// The sheets follow the heraldry pipeline (heraldry.json `pipeline`): 12 flags per 1536x1024 sheet in a 4 by 3 grid, filled in the
// order family, culture, region, tag, and never mixing the dead or demons with the living. Deterministic: the same designs give the same
// prompts and cell map. It writes the jobs only; imagegen.mjs generates them and slice-flags.mjs cuts the accepted sheets.
//   node tools/content/art/flag-jobs.mjs [outDir]   -> <outDir>/realm-flags-jobs.json and realm-flags-cells.json (default: <ZIN_ART>/jobs)
// The sheets are new files (raw/flags/realm-flags-sheet-NN.png), so the sheets of the retired roster and their cell map
// (data/flags-cells.json, from which the realms fly their old flags until these are generated) stay as they are.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countryTable } from '../lib/roster.mjs';
import { ART } from '../lib/paths.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(here, 'flag-jobs.mjs');
const outDir = path.resolve(isMain && process.argv[2] ? process.argv[2] : `${ART}/jobs`);
export const HERALDRY_FILE = path.join(here, '../data/world/heraldry.json');
const DARK = new Set(['the_dead', 'demons']);
export const REALM_CELLS_FILE = path.join(here, '../data/realm-flags-cells.json');

// The layout reference of every sheet: the first ACCEPTED sheet of data/realm-flags-cells.json (never a rejected file), so the grid is
// copied from a sheet that passed review and the designs are not. Returns null while no sheet is accepted.
export async function acceptedLayoutRef(dir) {
  const cells = JSON.parse(await readFile(REALM_CELLS_FILE, 'utf8'));
  const sheet = cells.filter(c => c.accepted === true).map(c => c.sheet).sort()[0];
  return sheet ? path.join(dir, `${sheet}.png`).split(path.sep).join('/') : null;
}

// A field whose tincture is near-black (every channel below 64) merges with the black ground of the sheet, so the slicer cannot
// separate its flag. Such flags get a thin light-grey keyline just inside their edge (the slicer trims the keyline with its inset).
export const isNearBlackField = d => (d.field?.tinctures ?? []).some(t => /^#/.test(t.hex ?? '') && Math.max(...[1, 3, 5].map(i => parseInt(t.hex.slice(i, i + 2), 16))) < 64);

// The tincture names a design uses (field, charges, marks), in order of appearance.
function tinctureNames(d) {
  const out = [];
  const add = t => { if (t?.name && !out.includes(t.name)) out.push(t.name); };
  for (const t of d.field?.tinctures ?? []) add(t);
  add(d.primary_charge?.tincture); add(d.secondary_charge?.tincture);
  for (const m of d.marks ?? []) add(m.tincture);
  return out;
}

export async function flagJobs({ heraldry = null, countries = countryTable() } = {}) {
  const H = heraldry ?? JSON.parse(await readFile(HERALDRY_FILE, 'utf8'));
  const P = H.pipeline, S = P.sheet;
  const designs = new Map(H.countries.map(d => [d.tag, d]));
  const problems = [];
  for (const c of countries) if (!designs.has(c.tag)) problems.push(`${c.name} (${c.tag}) has no design in heraldry.json`);
  for (const d of H.countries) if (!countries.some(c => c.tag === d.tag)) problems.push(`heraldry.json designs ${d.tag}, which is not a realm of the roster`);
  for (const d of H.countries) if (!d.blazon) problems.push(`${d.tag} has no blazon`);
  if (problems.length) throw new Error(`Flag jobs: ${problems.join('; ')}`);
  const order = (a, b) => (a.family < b.family ? -1 : a.family > b.family ? 1 : a.culture < b.culture ? -1 : a.culture > b.culture ? 1 : a.region < b.region ? -1 : a.region > b.region ? 1 : a.tag < b.tag ? -1 : 1);
  const all = countries.map(c => designs.get(c.tag));
  const streams = [all.filter(d => !DARK.has(d.people)).sort(order), all.filter(d => DARK.has(d.people)).sort(order)];
  const groups = streams.flatMap(list => Array.from({ length: Math.ceil(list.length / S.per_sheet) }, (_, i) => list.slice(i * S.per_sheet, (i + 1) * S.per_sheet)));
  const jobs = [], cells = [];
  const layoutRef = await acceptedLayoutRef(path.join(outDir, '../raw/flags'));
  groups.forEach((group, s) => {
    const id = `realm-flags-sheet-${String(s + 1).padStart(2, '0')}`;
    const rows = Math.ceil(group.length / S.columns);
    const families = [...new Set(group.map(d => d.family))];
    const palette = [...new Set(group.flatMap(tinctureNames))];
    const dark = group.map((d, i) => (isNearBlackField(d) ? i + 1 : 0)).filter(Boolean);
    const keyline = dark.length ? ` Keyline: flags ${dark.join(', ')} have a near-black field; each of them is edged all round by a thin light-grey keyline (#a6a6a6), about two percent of the flag's width, drawn just inside the flag's own edge so it stands clear of the black ground. The keyline is the only addition; every tincture stays exactly as named.` : '';
    const familyStyle = `${families.map(f => `Family style: ${H.families[f]?.mark_text ?? 'no family mark'}.`).join(' ')} Shared palette of this sheet: ${palette.join(', ')}.${keyline}`;
    const rowsText = Array.from({ length: rows }, (_, r) => `Row ${r + 1}, left to right: ${group.slice(r * S.columns, (r + 1) * S.columns).map((d, i) => `${r * S.columns + i + 1}. ${d.blazon}`).join(' ')}`).join('\n');
    const prompt = P.prompt_frame.replace('{n}', String(group.length)).replace('{cols}', String(S.columns)).replace('{rows}', String(rows)).replace('{family_style}', familyStyle).replace('{rows_text}', rowsText);
    jobs.push({
      id, prompt: layoutRef ? `Image 1 is ONLY a layout reference: copy its solid pure black background, its ${S.columns}-column grid, its flag size and its spacing exactly, but paint completely new flags as described below and copy none of its designs.\n${prompt}` : prompt,
      references: layoutRef ? [layoutRef] : [], out: path.join(outDir, '../raw/flags', `${id}.png`).split(path.sep).join('/'), size: S.canvas, quality: 'high',
      check: { expected: group.length, cols: S.columns, rows, aspect: [1.4, 1.75], minAreaFraction: 1 / 3 },
      designs: group.map(d => ({ tag: d.tag, hash: d.design_hash })),
    });
    group.forEach((d, i) => cells.push({ sheet: id, index: i, row: Math.floor(i / S.columns), col: i % S.columns, rows, tag: d.tag, name: d.name, design: d.design_hash }));
  });
  return { jobs, cells };
}

if (isMain) {
  const { jobs, cells } = await flagJobs();
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'realm-flags-jobs.json'), JSON.stringify(jobs, null, 1));
  await writeFile(path.join(outDir, 'realm-flags-cells.json'), JSON.stringify(cells, null, 1));
  console.log(JSON.stringify({ sheets: jobs.length, flags: cells.length, out: outDir }));
}
