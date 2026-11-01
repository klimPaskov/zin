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
// Flags of the dark stream per sheet: its seven realms are cut into a sheet of 4 and a sheet of 3 (one row each), so no sheet has an empty cell.
const DARK_PER_SHEET = 4;
export const REALM_CELLS_FILE = path.join(here, '../data/realm-flags-cells.json');

// The layout reference of every sheet: the first ACCEPTED sheet of data/realm-flags-cells.json (never a rejected file), so the grid is
// copied from a sheet that passed review and the designs are not. Returns null while no sheet is accepted.
export async function acceptedLayoutRef(dir) {
  const cells = JSON.parse(await readFile(REALM_CELLS_FILE, 'utf8'));
  // A multi-flag sheet is preferred: a one-flag picture (realm-flags-one-TAG) has no grid to copy.
  const accepted = cells.filter(c => c.accepted === true).map(c => c.sheet);
  const sheet = accepted.filter(s => /-sheet-\d+$/.test(s)).sort()[0] ?? accepted.sort()[0];
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

export async function flagJobs({ heraldry = null, countries = countryTable(), sheetPrefix = 'realm-flags-sheet', styleRef = null } = {}) {
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
  // The dark stream is cut into sheets of DARK_PER_SHEET flags (seven dark realms: a sheet of 4 and a sheet of 3), each sheet one row.
  const chunk = (list, size) => Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));
  const groups = [...chunk(streams[0], S.per_sheet), ...chunk(streams[1], DARK_PER_SHEET)];
  const jobs = [], cells = [];
  // K53 (lead): the Tor Luni picture is the style reference of every v2 sheet; without it the layout reference of the accepted sheets is used.
  const layoutRef = styleRef ?? await acceptedLayoutRef(path.join(outDir, '../raw/flags'));
  groups.forEach((group, s) => {
    const id = `${sheetPrefix}-${String(s + 1).padStart(2, '0')}`;
    // A dark sheet is one row with as many columns as flags (no empty cell); the living sheets keep the reference grid.
    const darkSheet = DARK.has(group[0].people), cols = darkSheet ? (group.length % 2 === 0 ? group.length / 2 : group.length) : S.columns;
    const rows = Math.ceil(group.length / cols);
    const families = [...new Set(group.map(d => d.family))];
    const palette = [...new Set(group.flatMap(tinctureNames))];
    const dark = group.map((d, i) => (isNearBlackField(d) ? i + 1 : 0)).filter(Boolean);
    const keyline = dark.length ? ` Keyline: flags ${dark.join(', ')} have a near-black field; each of them is edged all round by a thin light-grey keyline (#a6a6a6), about two percent of the flag's width, drawn just inside the flag's own edge so it stands clear of the black ground. The keyline is the only addition; every tincture stays exactly as named.` : '';
    const flagW = Math.round((1536 - 2 * 48 - (cols - 1) * 60) / cols), flagH = Math.round(flagW * 26 / 41);
    const shape = ` Shape: every flag is a wide horizontal rectangle in the exact 41:26 proportion, about 1.58 times as wide as it is tall, never square and never taller than wide. Each flag measures about ${flagW} by ${flagH} pixels on the 1536 by 1024 canvas, so the flags are wide and short. Layout: ${rows} row${rows > 1 ? 's' : ''} of ${cols} flags, all the same size, evenly spaced with identical black gutters, left to right, each flag fully inside the frame; nothing hangs from the top edge of any flag.`;
    const familyStyle = `${families.map(f => `Family style: ${H.families[f]?.mark_text ?? 'no family mark'}.`).join(' ')} Shared palette of this sheet: ${palette.join(', ')}.${shape}${keyline}`;
    const rowsText = Array.from({ length: rows }, (_, r) => `Row ${r + 1}, left to right: ${group.slice(r * cols, (r + 1) * cols).map((d, i) => `${r * cols + i + 1}. ${d.blazon} ${d.style_text ?? ''}`).join(' ')}`).join('\n');
    const prompt = P.prompt_frame.replace('{n}', String(group.length)).replace('{cols}', String(cols)).replace('{rows}', String(rows)).replace('{family_style}', familyStyle).replace('{rows_text}', rowsText);
    jobs.push({
      id, prompt: styleRef ? `Image 1 is a STYLE reference only: copy its embroidered silk finish, its deep saturated field, its couched thread outline and its solid black ground, but copy none of its device. Paint ${group.length} new flags in a ${cols} by ${rows} grid as described below, on solid black.\n${prompt}` : layoutRef ? `Image 1 is ONLY a layout reference: copy its solid pure black background, ${darkSheet ? `its ${cols}-column grid of ${group.length} flags` : `its ${cols}-column grid`}, its flag size and its spacing exactly, but paint completely new flags as described below and copy none of its designs.\n${prompt}` : prompt,
      references: layoutRef ? [layoutRef] : [], out: path.join(outDir, '../raw/flags', `${id}.png`).split(path.sep).join('/'), size: S.canvas, quality: 'high',
      check: { expected: group.length, cols: cols, rows, aspect: [1.4, 1.75], minAreaFraction: 1 / 3 },
      designs: group.map(d => ({ tag: d.tag, hash: d.design_hash })),
    });
    group.forEach((d, i) => cells.push({ sheet: id, index: i, row: Math.floor(i / cols), col: i % cols, rows, tag: d.tag, name: d.name, design: d.design_hash }));
  });
  return { jobs, cells };
}

// One flag per image (the dark realms whose sheet was rejected): each flag is one picture on a 1536x1024 canvas, the flag centred on
// solid black as a 41:26 rectangle filling about 78 percent of the width. The accepted sheet is a style reference only. The cell map
// gives each flag a one-cell sheet, id realm-flags-one-<TAG>, index 0; slice-flags.mjs cuts it like any sheet.
export const singleFlagId = tag => `realm-flags-one-${tag}`;
export async function singleFlagJobs({ heraldry = null, tags, outRaw, fullBleed = false, idPrefix = null }) {
  const H = heraldry ?? JSON.parse(await readFile(HERALDRY_FILE, 'utf8'));
  const designs = new Map(H.countries.map(d => [d.tag, d]));
  // K53 pilot: no reference from the retired style; the flags are painted from the new prompt alone.
  // K63 (owner, lead): the full-bleed flags use the accepted Konori flag as the style reference (its finish, field, outline and hem; never its device).
  const style = fullBleed ? KONORI_STYLE_REF : null;
  const jobs = [], cells = [];
  for (const tag of tags) {
    const d = designs.get(tag);
    if (!d) throw new Error(`single flag: ${tag} has no design`);
    const id = idPrefix ? `${idPrefix}-${tag}` : singleFlagId(tag), palette = [...new Set(tinctureNames(d))];
    const keyline = isNearBlackField(d) ? ' Keyline: the field is near-black, so the flag is edged all round by a thin light-grey keyline (#a6a6a6), about two percent of the flag\'s width, drawn just inside its edge. The keyline is the only addition; every tincture stays exactly as named.' : '';
    const prompt = fullBleed ? `A flat asset image of ONE medieval banner cloth for a medieval-fantasy strategy game, on a canvas 1536 by 1024 pixels. The cloth of the flag fills the WHOLE canvas edge to edge: a flat front-facing textile with no background, no black ground, no border or frame outside the cloth, no pole, no fold, no waving, no shadow, no vignette, no glow and no gradient outside the cloth. Keep every device and every border at least six percent inside each edge of the canvas, so that nothing is cut at the top or bottom. The look is a medieval embroidered silk banner: a deep, saturated silk field, one appliqued cloth device outlined with couched gold or silver thread, a restrained composition of one device with at most one small accent, and stylised heraldic drawing. A beast is a flat, elongated, posed heraldic silhouette in profile. No fleur-de-lis, no repeated motif, no diaper or powdering anywhere on the ground; a plain field is one unbroken tincture. No hands, no torches, no braziers, no chalices, no keys and no burning objects of any kind as devices. Every device is a flat, symmetrical heraldic emblem, never a botanical, zoological or naturalistic drawing, and never a literal everyday object (no well, no cup, no tool, no reeds, no plant with leaves and roots); every hem, fringe, tassel or dagging ends at least six percent above the bottom edge, inside the canvas. Field (lead ruling under K68, 31 October 2026): the cloth is one undivided piece of single-colour dyed wool, with no stripes, no bands, no divisions and no hem teeth. Hard negatives (absolute, lead spot check of 31 October 2026): no crenellated, stepped, toothed or battlemented band or edge anywhere on the cloth, including on a crown, a base or a hem; no fleur-de-lis and no lily-like points on any crown (crown points are plain, rounded or leaf-less); no device placed across horizontal stripes, no field divided into three equal horizontal bands, and no device sitting on a plain white-over-blue or red-over-white bicolour; no letter-like shape (no ring with a bar, no hook shaped like a question mark or the letter S, no O-shaped outline); no triangle or pointed frame behind any device, and no helm, shield or emblem that looks like a game logo; no bell, column, stake, log or hook other than the sign named in the blazon; no fire except a flat flame. Forbidden in any device, field or hem (lead, 25 October 2026): crenellated or battlemented bands, hems and fields; a red ring with a bar across it (a roundel); a plain disc on a plain or banded field; a bundle of rods or spears bound together; a raised clenched fist, and clasped or shaking hands; an interlaced knot or knotwork of any kind; equal horizontal bands carrying the device. Handmade rule (owner K65): the banner must be makeable by hand. At most four flat colours plus gold or silver thread; every device is a bold cut-cloth (appliqué) shape with a stitched outline; no painted shading, no gradients, no fine illustration, no scenes, no tiny details, no photographic texture. Draw a design a weaver or embroiderer could sew and that reads from a distance when carried in battle. Culture, not region: the device is the realm's own culture's sign, never the region's landscape, animal, plant, or goods, unless the realm's own founding story makes it so. No lettering, letters, numbers or runes; no real-world religious symbol or real national flag or coat of arms; no crosses of any kind, no stars, crescents or eagles; no masonry or battlements.
Blazon: ${d.blazon} Shared palette of this flag: ${palette.join(', ')}. Style: ${d.style_text ?? ''}` : `A flat asset image of ONE medieval banner for a medieval-fantasy strategy game, on a canvas 1536 by 1024 pixels. The background is solid flat pure black (#000000) everywhere outside the flag: no glow, no blur, no gradient, no texture. The flag is a single perfectly flat, front-facing rectangle with an aspect ratio of 41 to 26 (about 1.58 times as wide as tall), centred on the canvas, about 78 percent of the canvas width, with black ground all around it; never square. No perspective, no waving, no folds, no shadows, no frame, no pole, no swallowtail. The look is a medieval embroidered silk banner: a deep, saturated silk field, one appliqued cloth device outlined with couched gold or silver thread, a restrained composition of one device with at most one small accent, and stylised heraldic drawing in the manner of medieval armorials and tapestries. A beast is a flat, elongated, posed heraldic silhouette in profile, with no fur strokes, no shading, no modelled musculature and no natural walking pose. A plain field is one unbroken tincture with no band, stripe or division of any kind, and no field is ever banded in three equal bands. No crenellated, toothed or stepped bar anywhere on the flag; any rayonny edge is drawn as soft, rounded rays, never as flame-shaped tongues. Never clip-art: no cartoon, no outline illustration, no pictorial scene, no landscape, no modern vector style, no naturalistic rendering. No lettering, letters, numbers or runes anywhere; no signature or maker's mark; no real-world religious symbol; no real national flag or coat of arms; no crosses of any kind, no stars, crescents or eagles; no masonry or battlements.\nBlazon: ${d.blazon} Shared palette of this flag: ${palette.join(', ')}. Style: ${d.style_text ?? ''}${keyline}`;
    jobs.push({ id, prompt: style ? `Image 1 is a STYLE reference only: copy its embroidered silk finish, its deep saturated field, its couched gold outline, its cloth filling the whole canvas and its cultural hem style, but copy none of its device. Paint one new bold stylised emblem as described below.
${prompt}` : prompt, references: style ? [style] : [], out: path.join(outRaw, `${id}.png`).split(path.sep).join('/'), size: S_CANVAS, quality: 'high', designs: [{ tag: d.tag, hash: d.design_hash }] });
    cells.push({ sheet: id, index: 0, row: 0, col: 0, rows: 1, tag: d.tag, name: d.name, design: d.design_hash });
  }
  return { jobs, cells };
}
const KONORI_STYLE_REF = 'C:/Users/klimp/Documents/Projects/hoi4-agent-tools/.tmp/zin-art/raw/flags/fb/realm-flags-fb-KON.png';
const S_CANVAS = '1536x1024';

if (isMain) {
  const { jobs, cells } = await flagJobs({ sheetPrefix: process.argv[3] || 'realm-flags-sheet' });
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'realm-flags-jobs.json'), JSON.stringify(jobs, null, 1));
  await writeFile(path.join(outDir, 'realm-flags-cells.json'), JSON.stringify(cells, null, 1));
  console.log(JSON.stringify({ sheets: jobs.length, flags: cells.length, out: outDir }));
}
