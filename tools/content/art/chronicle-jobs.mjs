// Image jobs of the Chronicle of Aoaz (spec 04 section 8; UI overhaul lane W9), in the format of tools/content/imagegen.mjs. This
// script only composes the prompts and, with --band, cuts the accepted pictures; every picture is painted by gpt-6-luna.
//   node tools/content/art/chronicle-jobs.mjs [jobs.json]     (default <ZIN_ART>/jobs/chronicle-jobs.json)
//   GPTIMAGE_MODEL=gpt-6-luna IMAGEGEN_CONCURRENCY=3 node tools/content/imagegen.mjs <jobs.json>
//   node tools/content/art/chronicle-jobs.mjs --band          cuts each generated plate to its 8:3 band at full width and resizes it to
//                                                           864 x 324 (art/source/chronicle/plates/<plate>.png, the tracked source)
// Plates: one per entry with a plate subject, the after-flag plates, and one per category. The spec's "reuse" plates (crops of catalog
// event pictures) are painted anew: every catalog event picture they name is a gpt-6-astra generation, which the owner forbids (K-rule of
// 24 October 2026), so each takes its own subject below. Owner-approval plates (Horos, Eindil, Varner, Golbran and the figures the owner
// drew, K38) are painted but shown as their category plate until the owner approves them (spec section 8).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ART, ZIN } from '../lib/paths.mjs';
import { chromePrompt } from './zin-chrome-jobs.mjs';
import { loadChronicle } from '../modules/chronicle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const SHEET_FILE = path.join(here, '../data/chronicle/codex_sheet.json');
export const PLATE_SIZE = [864, 324];   // the tracked band (2 x the 432 x 162 plate)
export const PLATE_REQUEST = '3072x1184';   // the model returns about 2022 x 778 for this request
export const trackedPlate = p => path.join(ZIN, 'art/source/chronicle/plates', `${p}.png`);
export const rawPlate = p => `${ART}/raw/chronicle/plates/${p}.png`;

const STYLE = 'Painted dark-fantasy strategy-game illustration in a consistent style: rich oil-paint texture, soft dramatic light, muted earthy palette, fine detail, calm composition.';
const FRAME = 'A wide panoramic painted illustration for a chronicle, a history book of the world, in a very wide landscape image filling the whole picture edge to edge. One clear main subject in the middle of the picture, readable when the picture is shown small; nothing important near the top and bottom edges, which may be trimmed.';
const PEOPLE = 'Any people are small, seen from a distance or from behind, with no face shown in close view.';
const RULES = 'No text, no letters, no numbers, no runes, no frames, no borders, no labels, no signature, no user-interface element, no map, no modern object. No god in human form, no halo.';

// The plates the spec meant to crop from catalog event pictures, each with its own subject.
export const REPAINTED = {
  lorien: 'an ancient white elven court of slender pale towers in hard southern light, a tall elven king far off on its high steps',
  western_wars: 'a wide grey river ford between green western hills, two small hosts with plain banners facing each other across it under a truce',
  toll_quarrel: 'a heavy iron chain stretched across a narrow sea strait between two cliffs, merchant ships waiting at anchor below',
  voices_at_edges: 'fishermen on a dark northern shore at dusk looking out at the dim shapes of black ships far away on a grey sea',
  zols_mistake: 'black islands under a starless sky, faint cold lights on the still dark water between them',
  ember_lands: 'a red desert under a towering wall of storm cloud lit from within by lightning',
  mirolon: 'a fortified mountain pass with stone watchtowers above a red southern plain under a heavy sky',
  man_from_ice: 'a dim shape of a sleeping man deep inside a great block of blue glacier ice, the ice lit by a lantern held by a small distant traveller',
  king_without_house: 'a lone cloaked war-leader seen from behind before the ranks of a western host, plain banners without devices, green hills',
  golden_king_dies: 'an empty gilded throne in a dim hall, a heavy golden crown fallen on the steps, candles burning low',
  deliverer_crowned: 'a coronation in a vast temple hall full of priests and nobles, the crowned figure tiny and distant beneath a great sun-marked banner',
  storm_voyage: 'a small ship wrecked on black rocks off a southern island under a violent storm sky',
  hall_of_horos: 'the dark throne hall of a snowbound castle, a green crystal glowing in the breast of an armoured giant on the throne, yellow-green armour, thorn-like helm, a large blue sword beside him',
  last_crowns: 'the war banners of many realms gathering on a wide plain under a red sky',
  western_crossing: 'a great host crossing a wide river on boats and bridges toward a lake city on the far shore',
  dead_of_mistake: 'a grey host of indistinct risen dead advancing over a frozen northern shore under a black sky',
  name_of_afrit: 'a cracked golden mask fallen on a temple floor, toppled lamps and long shadows',
  king_of_east: 'a domed eastern court hall with many kneeling envoys before an empty raised throne',
  dragon_return: 'a great dragon descending over a battlefield under a storm sky, a tiny rider on its back seen from far below',
  breaking_volgan: 'a vast storm shape shattering into ash and lightning above a battlefield in a red desert',
  black_sky: 'a black sky over a frozen battlefield, a vast cold shadow on the horizon, small hosts holding their ground',
  second_betrayal: 'a high cliff edge above a deep ravine at dusk, a torn banner caught on the rocks',
  palace_battle: 'a great palace hall in ruins, shattered golden ornaments and a fallen dark necklace on the cracked marble floor',
  king_of_men: 'an ancient crown on a cushion before an altar in a great lake city, banners of many realms hanging around it',
  ending_lost_cause: 'plain banners raised over the walls of a lake city at dawn, crowds in the streets below',
  ending_children: 'a lake city under a red storm sky, dark southern banners on its walls',
  ending_ashen: 'a throne room of ash and cold grey light, a black throne covered in frost',
  houses_first_light: 'a modest pilgrim house with one lit round window beside a country road at dusk',
  worshipdom: 'a hermitage temple of white stone on a hill above fields, lamps burning in its windows',
  four_camps: 'four war camps with different plain banners around a lake city at night, campfires and smoke',
};
export const AFTER = {
  mirolon_fallen: 'a fortified mountain pass burning, its stone watchtowers broken, a dark host pouring through toward a red plain',
  castle_yeldenne_empty: 'an empty dark throne hall in a snowbound castle, snow drifting across the stone floor, the throne bare and cold',
};
// Subjects the spec rewords for the owner's rules (K41: Golbran is a small magical creature, never a human).
const REWORD = { golbran: 'a small purple magical creature beside a robed old wizard among standing stones' };
// Owner-approval plates (spec section 8 and K38): painted, shown as the category plate until approved.
export const OWNER_GROUP = new Set(['eindil', 'horos', 'varner', 'golbran', 'elzon', 'roka', 'hall_of_horos', 'unheeded_warnings', 'king_without_house', 'dragon_return', 'man_from_ice']);

export function plateList(data = loadChronicle({ withRealms: false })) {
  const out = [];
  for (const e of data.entries) {
    if (!e.plate) continue;
    const subject = REPAINTED[e.key] ?? REWORD[e.key] ?? e.plate.subject;
    if (!subject) throw new Error(`plate of ${e.key}: no subject`);
    out.push({ plate: e.key, subject, entry: e.id, owner: OWNER_GROUP.has(e.key) });
  }
  for (const [p, subject] of Object.entries(AFTER)) out.push({ plate: p, subject, entry: null, owner: false });
  for (const c of data.categories) out.push({ plate: `cat_${c.key}`, subject: c.plate, entry: null, owner: false });
  return out;
}
export const platePrompt = subject => [STYLE, FRAME, `Subject: ${subject}.`, PEOPLE, RULES].join('\n');

export function chronicleJobs({ art = ART } = {}) {
  const sheet = JSON.parse(readFileSync(SHEET_FILE, 'utf8'));
  const jobs = [{ id: sheet.sheet.id, size: sheet.sheet.size, quality: 'high', out: `${art}/raw/${sheet.sheet.raw}`, prompt: chromePrompt(sheet), references: sheet.sheet.references.map(r => `${art}/raw/${r}`) }];
  for (const p of plateList()) jobs.push({ id: `chronicle-plate-${p.plate}`, size: PLATE_REQUEST, quality: 'high', out: rawPlate(p.plate), prompt: platePrompt(p.subject) });
  return jobs;
}

// The band: the largest centred 8:3 box (the full width when the picture is taller than 8:3, the full height when it is wider), resized
// to 864 x 324 with Lanczos 3.
export const bandBox = (w, h) => (w * 3 / 8 <= h ? { left: 0, top: Math.round((h - Math.round(w * 3 / 8)) / 2), width: w, height: Math.round(w * 3 / 8) } : { left: Math.round((w - Math.round(h * 8 / 3)) / 2), top: 0, width: Math.round(h * 8 / 3), height: h });
export async function bandAll() {
  mkdirSync(path.dirname(trackedPlate('x')), { recursive: true });
  let n = 0;
  for (const p of plateList()) {
    const src = rawPlate(p.plate);
    if (!existsSync(src)) continue;
    const m = await sharp(src).metadata();
    await sharp(src).extract(bandBox(m.width, m.height)).resize(PLATE_SIZE[0], PLATE_SIZE[1], { kernel: 'lanczos3', fit: 'fill' }).png().toFile(trackedPlate(p.plate));
    n++;
  }
  return n;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  if (process.argv[2] === '--band') { console.log(`${await bandAll()} bands`); process.exit(0); }
  const file = path.resolve(process.argv[2] ?? `${ART}/jobs/chronicle-jobs.json`);
  mkdirSync(path.dirname(file), { recursive: true });
  const jobs = chronicleJobs();
  writeFileSync(file, JSON.stringify(jobs, null, 2) + '\n');
  console.log(`${file}: ${jobs.length} jobs`);
}
