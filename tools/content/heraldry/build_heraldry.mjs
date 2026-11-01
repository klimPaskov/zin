// Heraldry generator for the roster of 24 October 2026 (docs/specs/08_art_and_assets/06_heraldry.md, R-92, rule F4).
//
// What it does, in order:
//   1. Reads tools/content/data/world/heraldry.json (the shared vocabulary, the grammars written before the roster
//      redesign, the dynamic-tag rules and the build checks), roster.json, cultures_new.json and pantheon.json.
//   2. Applies the grammar changes of this generator: the grammars of the 30 cultures of cultures_new.json, the four
//      renamed culture ids (melkgard_warlords, vindael_seafarers, gunwyn_clans, ember_freeholds), the retirement of
//      wall_folk (split into vale_folk and hilofrim_herders), the people grammars of the Baelim (tree_people) and the
//      mycids, three new lines of partition and the new charges the realm designs need. Every step sets values, so
//      running it twice gives the same file.
//   3. Builds one design record per realm of the roster from the DESIGNS table (field, division, charges, tinctures,
//      meaning) and derives the marks of rank and form, the contrast and fimbriation, the blazon (the image prompt's
//      flag line) and a design hash.
//   4. Runs the checks (coverage, palette, contrast, budget, form marks, distinctness, regional caps, forbidden motifs,
//      canon guards) and fails on any finding.
//   5. With --write, writes heraldry.json atomically (temporary file and rename) and the generated regions of the
//      spec between its <!-- generated:NAME:start --> and <!-- generated:NAME:end --> markers.
//
// It has no randomness: every choice is a table entry or a deterministic rule; the design hash is a sha256 of the
// canonical design key.
//
//   node tools/content/heraldry/build_heraldry.mjs            build and check, print the summary, write nothing
//   node tools/content/heraldry/build_heraldry.mjs --write    build, check, and write heraldry.json and the spec regions
//   node tools/content/heraldry/build_heraldry.mjs --verify   fail if heraldry.json differs from a fresh build

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { K53_STYLE, K53_CHARGES } from './k53_vocabulary.mjs';
import { K65_CHARGES, K65_OVERRIDES, K65_JUSTIFIED } from './k65_designs.mjs';
import { K68_CHARGES, K68_OVERRIDES, K68_REALM_HEM, K68_REALM_HEM_TEXT, K68_MARK_WAIVED, K68_REALM_GROUND, K68_REALM_HAND } from './k68_designs.mjs';

// K68 per-realm hem (the culture's hem text is replaced in the realm's style line) and waived marks (kept in the lore, not drawn).
const realmStyleText = (text, key) => {
  let t = text;
  if (K68_REALM_HAND[key]) t = t.replace(/The culture's hand: .*?; its hem:/, `The culture's hand: ${K68_REALM_HAND[key]}; its hem:`);
  const h = K68_REALM_HEM[key];
  if (h) t = t.replace(/its hem: .*?; its ground:/, `its hem: ${K68_REALM_HEM_TEXT[h]}; its ground:`);
  if (K68_REALM_GROUND[key]) t = t.replace(/its ground: .*$/, `its ground: ${K68_REALM_GROUND[key]}.`);
  return t;
};
// Realms that are not realms of the world (K56: Yeldenne is a town in Pertolor's land). Dropped from the roster the generator reads,
// so the coverage check holds for the 155 realms; the roster file itself is the world owner's and still lists them.
const RETIRED_REALMS = new Set(['yeldenne']);
const markWaived = (key, mark) => Object.hasOwn(K68_MARK_WAIVED[key] ?? {}, mark);
// K65 (lead rulings, 25 October 2026): realm devices come from k65_designs.mjs, which overrides the charge, tincture and meaning of each DESIGNS row.
// K68 (owner ruling K68, 31 October 2026): a K68 row replaces the K65 row of its realm (k68_designs.mjs).
const k65Apply = (des) => { const o = K68_OVERRIDES[des.key] ?? K65_OVERRIDES[des.key]; if (!o) return des; return { ...des, primary: o.primary, secondary: o.secondary, meaning: o.meaning, ...(o.division ? { division: o.division, field: o.field.map((n) => n) } : {}), opts: { ...des.opts, ...(o.form_note ? { formNote: o.form_note } : {}), ...(o.on !== undefined ? { on: o.on } : {}), regionalPrimary: o.regional === true, ...(o.noCrown ? { noCrown: true } : {}) } }; };

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '../../..');
export const PATHS = {
  heraldry: path.join(ROOT, 'tools/content/data/world/heraldry.json'),
  roster: path.join(ROOT, 'tools/content/data/world/roster.json'),
  culturesNew: path.join(ROOT, 'tools/content/data/world/cultures_new.json'),
  pantheon: path.join(ROOT, 'tools/content/data/world/pantheon.json'),
  spec: path.join(ROOT, 'docs/specs/08_art_and_assets/06_heraldry.md'),
};

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
const clone = (x) => JSON.parse(JSON.stringify(x));

// ---------------------------------------------------------------------------------------------------------------
// Colour
// ---------------------------------------------------------------------------------------------------------------

export function luminance(hex) {
  const h = hex.replace('#', '');
  const lin = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
export const contrastRatio = (a, b) => {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
export const tinctureClass = (hex) => (luminance(hex) > 0.3 ? 'metal' : 'colour');

function hexToLab(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
const mixLab = (parts) => {
  const out = [0, 0, 0];
  let w = 0;
  for (const [lab, wt] of parts) { for (let i = 0; i < 3; i++) out[i] += lab[i] * wt; w += wt; }
  return out.map((v) => v / w);
};

// CIEDE2000 colour difference.
export function deltaE2000(lab1, lab2) {
  const [L1, a1, b1] = lab1, [L2, a2, b2] = lab2;
  const rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cb = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const hp = (b, a) => { if (a === 0 && b === 0) return 0; const h = Math.atan2(b, a) / rad; return h >= 0 ? h : h + 360; };
  const h1p = hp(b1, a1p), h2p = hp(b2, a2p);
  const dLp = L2 - L1, dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) { dhp = h2p - h1p; if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360; }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad);
  const Lbp = (L1 + L2) / 2, Cbp = (C1p + C2p) / 2;
  let hbp = h1p + h2p;
  if (C1p * C2p !== 0) {
    if (Math.abs(h1p - h2p) <= 180) hbp = (h1p + h2p) / 2;
    else hbp = h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
  }
  const T = 1 - 0.17 * Math.cos((hbp - 30) * rad) + 0.24 * Math.cos(2 * hbp * rad) + 0.32 * Math.cos((3 * hbp + 6) * rad) - 0.2 * Math.cos((4 * hbp - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hbp - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2);
  const Sc = 1 + 0.045 * Cbp, Sh = 1 + 0.015 * Cbp * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh));
}
export const deltaE = (h1, h2) => deltaE2000(hexToLab(h1), hexToLab(h2));

// ---------------------------------------------------------------------------------------------------------------
// Tuning: every threshold the checks use, in one place.
// ---------------------------------------------------------------------------------------------------------------

export const TUNING = {
  contrastMin: 2.2,          // charge against every field tincture it overlaps, else fimbriated
  contrastFloor: 1.6,        // a charge this close to a single field tincture is a design error even if fimbriated
  elementMax: 4,             // marks plus charges
  primaryPerCulture: 1,
  primaryPerRegion: 2,       // the regional cap on one primary charge
  classShareMax: 0.4,
  classShareMinRegion: 10,
  designDistanceMin: 3.0,    // near-identical designs: any pair below this distance fails
  siblingDistanceMin: 1.0,   // a story flag of the same realm (a declared sibling) against its parent
  smallFlagDeltaEMin: 6.0,   // mean Delta E 2000 of the 3x2 small-flag grid between two flags of one region
  chargeWeightSmall: 0.25,   // share of the centre cells covered by the primary charge at 10x7
  borrowTincturesMax: 1,     // tinctures a realm may take from its second culture
};

// ---------------------------------------------------------------------------------------------------------------
// Vocabulary additions
// ---------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------
// K53 (owner, 25 October 2026): the medieval banner language. A culture is told apart by its hand (how its devices are
// drawn), its hem (its border ornament) and its ground (its field pattern), never by a region's line of partition.
// Every culture of the grammar takes one hand, one hem and one ground by its place in the sorted list of cultures
// (see assignCultureStyles): the three cycles are 10, 8 and 6, so no two of the cultures share a triple.
// ---------------------------------------------------------------------------------------------------------------

export const HANDS = {
  elongated: 'its devices drawn in long, tapering, flowing forms, stretched along the field like the beasts of a standard',
  angular: 'its devices cut in angular, faceted, geometric forms, like carved bone or cut stone, with no curves',
  interlaced: 'its devices built from one band woven over and under itself, like a knotted cord or a basket-work',
  applique: 'its devices made as stitched applique, cut from a second cloth and sewn on with a visible couching stitch',
  stamped: 'its devices stamped as bold, flat, brand-like silhouettes with a plain inner shape and no modelling',
  armorial: 'its devices drawn in the manner of a medieval armorial, with fine inner hatching and the features shown by line',
  radiant: 'its devices set on a sunburst of fine rays that spread behind the charge from its lower edge',
  stippled: 'its devices worked in pricked dots and stitch-marks, as in embroidered work, with the outline in dotted thread',
  jointed: 'its devices segmented and jointed, like a carved totem, each part set one above another',
  scrolled: 'its devices ending in curling volutes and scrolls, like wrought iron or gilded scroll-work',
};
export const HEMS = {
  cord: 'a hem of twisted cord in the field\'s second tincture',
  pearled: 'a hem of small round beads, like pearls sewn in a row',
  vine: 'a border of climbing vine-scroll, leaves and tendrils, in the second tincture',
  scale: 'a border of overlapping scales, like lamellar plate armour',
  dagged: 'a border of small rounded scallops along the lower edge',
  chain: 'a border of linked rings, like mail',
  tasselled: 'a fringe of short tassels along the hem, in the second tincture',
  notched: 'a plain narrow edge stitched in the second tincture, straight and unbroken',
};
export const GROUNDS = {
  plain: 'a plain ground of one tincture, without pattern',
  diapered: 'a ground of one tincture with a few dots of the second tincture set far apart, never a repeated figure',
  strewn: 'a ground of one tincture with a few dots of the second tincture set far apart, never a repeated figure',
  counter: 'a ground counterchanged, its two tinctures swapped in a band across the middle of the field',
  woven: 'a ground of narrow woven bands running with the field, like a textile stripe',
  lozenged: 'a ground of one tincture with a single bar of the second tincture across its middle',
};
export const STYLE_CYCLES = { hand: Object.keys(HANDS), hem: Object.keys(HEMS), ground: Object.keys(GROUNDS) };

// Realms whose records carry a charge from a regional or trade class (REGIONAL_CLASSES). Each entry justifies the charge from the
// realm's own history, with the specific story the owner asked for; a record in REGIONAL_CLASSES without an entry fails the build.
export const REGIONAL_CLASSES = ['landform', 'plant', 'tree', 'water', 'sea_creature', 'bird', 'beast', 'ship', 'garment'];
export const REGIONAL_JUSTIFIED = {
  konori: "The sign is the riders' own rite, not the steppe's: the horse's head marks the custom by which every king of the Hundreds is lifted on the white felt at the Aenar crossing, a crowning the riders keep and no other people of the plain shares.",
  kilinti: "The sign is the ents' own charter, not the forest's: the Eldest is the ent-moot's lawful voice and the Kilinti charter with Parim, a claim the ents make in their own name rather than the forest's.",
  aenor_forest: "The sign is the Baelim's own lineage, not the forest's: the fir with spreading roots is the tree of the Baelim's lineage, the people who have never had a crown and let no man build among them.",
  lerendor: "The sign is the Lerendor crown's own marriage story, not the strait's: the two waves stand for the two straits joined when Ostrik of the Sonarvik wed Runild, and the strait dues that follow are the realm's own record.",
  tolvael: "The sign is the free crown's own household beast, not the North's: the bear wears its own crown as the household sign of the first free crown, the story of a lord proud of his timber and of asking rather than being told.",
  austklev: "The sign is the jarldom's own tithe, not the sea's: the narwhal is the spear-whale whose tusk the jarldom sold south, the whale-tithe of the Vaestia harbour boom that the jarls themselves kept.",
  mirolon: "The sign is the High Warden's own watch, not the lake's: the heron on one leg is the warden's sworn beacon-sign, kept every night since the first warden chose it.",
  magical_forest: "The sign is the elven realm's own founding song, not the forest's: the tree of the Singing Grove is the realm's founding tree, which the houses say was sung before it grew.",
  andos_enda: "The sign is the Weir Compact's own federation, not the lake's: three boats carry the letters of the federation the lake groves swore to share the water by, and the Water-Court judges at the weir.",
  mushroom_forest: "The sign is the mycids' own ring-circle, not the rift shore's: the ring of caps is the mycids' sign of a people whose rule no one outside the forest knows; only the ring is drawn.",
  gala: "The sign is the elven court's own founding relic, not the spring's: the Mirror of First Rain is the court's founding relic, the spring in which the court first saw the rain, the story the court tells of itself.",
  soyano: "The sign is the shipwrights' council's own craft, not the sea's: the white ship is the Tide-Speaker's founding vessel of the Archipelago Council, a craft the shipwrights built and the council keeps.",
  goodin: "The sign is the guest-towns' own self-rule, not the shade's: the shade tree is the tree under which the guest-towns' elders govern themselves in the shade of their Sunhot patrons.",
  verde: "The sign is the hall's own craft, not the coast's: the woven sail is the canoe-makers' sail, woven by the clan hall that sells pilots, the founding craft of the hall.",
  seite_islands: "The sign is the bank-fishers' own oath, not the reef's: the green turtle is the oath-beast of the bank-fishers, the turtle of the banks their fathers fished, and the sign of the isle moot's reef-shrines.",
};
// The prompt frame of every flag sheet (K53): medieval banner cloth, stylised devices, no clip-art. {n}, {cols}, {rows}, {family_style}
// and {rows_text} are filled by tools/content/art/flag-jobs.mjs.
export const PROMPT_FRAME = 'A flat asset sheet of {n} distinct medieval embroidered flags for a medieval-fantasy strategy game, arranged in an exact {cols} columns by {rows} rows grid. The background is solid flat pure black (#000000) everywhere between and around the flags: no glow, no blur, no gradient, no texture. Every flag is a perfectly flat, front-facing rectangle with an aspect ratio of 41 to 26, all the same size, evenly spaced with identical black gutters; no perspective, no waving, no folds, no shadows, no frames, no poles, no swallowtails, no tassels, no fringes, no tabs, no finials, no pennant tails, no hanging ends, and nothing attached to the top edge of any flag: no bar, rail, hook, ring, loop, cord or fringe at the top, and no bar across the upper edge: every flag is a plain rectangle, wider than it is tall, about 1.58 times as wide as it is tall. The look is a medieval embroidered silk banner: a deep, saturated silk field, one appliqued cloth device outlined with couched gold or silver thread, a restrained composition of one device with at most one small accent, and stylised heraldic drawing in the manner of medieval armorials and tapestries. A beast is a flat, elongated, posed heraldic silhouette in profile, with no fur strokes, no shading, no modelled musculature and no natural walking pose. A plain field is one unbroken tincture with no band, stripe or division of any kind, and no field is ever banded in three equal bands. No crenellated, toothed or stepped bar and no stepped or toothed line of division anywhere on the flag: every line of division is straight or simply curved. No castle walls, battlements, towers or gate-towers anywhere; any rayonny edge is drawn as soft, rounded rays, never as flame-shaped tongues. Each flag has one strong central device, stylised and heraldic, never naturalistic and never clip-art: no cartoon, no outline illustration, no pictorial scene, no landscape, no modern vector style, no fine detail smaller than one fortieth of the flag\'s height. Each flag\'s hand (how its devices are drawn), hem (its border ornament) and ground (its field pattern) are given in its style line and must be shown exactly. No lettering, no letters, numbers or runes anywhere; no signature or maker\'s mark; no real-world religious symbol; no real national flag or coat of arms; no crosses of any kind, no stars, crescents or eagles; no masonry or battlements. {family_style}\n{rows_text}';

const LINES_ADD = {
  gnarled: 'a gnarled line of slow, uneven swellings like old bark',
  gilled: 'a gilled line of fine close upright ribs, like the underside of a mushroom cap',
  wattled: 'a wattled line woven over and under like a hurdle of branches',
};

const FAMILIES = {
  ainic_men: {
    name: 'Ainic men', line: 'straight', mark: 'label',
    mark_text: "Aen's label: a narrow bar across the upper field with three short square pendants, in a metal of the culture",
    meaning: 'The label is the medieval mark of a son of the house. Realms of Ainic speech and stock bear it because their first crowns were among the kingdoms Aen joined, and the Reckoning of Lines counts their founding houses among the descendants of his sons (proposed reading). Aenor itself bears none: the crown of Aen\'s own realm needs no difference. A theocracy bears none, because a faith claims no line.',
    members: ['lake_aenoran', 'selen_ranger', 'steppe_rider', 'vale_folk', 'hilofrim_herders', 'march_folk', 'isle_houses', 'strait_folk', 'teste_valley_folk', 'leren_sea_kings', 'free_crowns_north', 'dondor_brutes', 'mirolon_wardens', 'ember_freeholds', 'zilin_pilgrims'],
  },
  boreal_men: {
    name: 'Boreal men', line: 'indented', mark: 'line', mark_text: 'every line of partition is indented: small even teeth',
    meaning: 'The indented line is the toothed north-western shore that the Aenoran charts met already peopled; Gunwyn, Coldic and Tritonic realms all draw it, which is how a Triton chart-house and a Cold Lands clan show they share a stock older than the charts.',
    members: ['gunwyn_clans', 'girdon_wardens', 'western_guilds', 'buldor_companies', 'winter_crown', 'ice_clans', 'reindeer_clans', 'melkgard_warlords', 'vindael_seafarers', 'chart_islanders', 'corsair_lords'],
  },
  eastern_men: {
    name: 'Eastern men', line: 'stepped', mark: 'line', mark_text: 'every line of partition is stepped like a temple stair (grady); never crenellated',
    meaning: 'The stepped line is the stair: the temple stairs above the flood-line, the terraced roads of the caravans and the wells cut in steps. Noric, Stabilic and Alerhic realms all draw it, from the snow coast of Woqood to the passes of Miaed and the wells of Wahatud; the line marks the stock, and each realm keeps its own faith.',
    members: ['noris_riders', 'caravan_princes', 'river_kings', 'lake_road_cities', 'red_lands_tribunes', 'naamis_sea_crown', 'woqood_sealers', 'orato_fishers', 'quay_folk', 'miaed_pass_lords', 'wahatud_oasis_folk'],
  },
  orran_men: {
    name: 'Orran men', line: 'nebuly', mark: 'line', mark_text: 'every line is nebuly, like a cord drawn through loops',
    meaning: 'The nebuly line is the cord of the Old Knots, the oldest custom of men in Aoaz, kept by the speech of the beaten kingdoms.',
    members: ['veiled_folk', 'redbark_tribes'],
  },
  yonic_men: {
    name: 'Southern islanders', line: 'wavy', mark: 'line', mark_text: 'every line is wavy',
    meaning: "The wavy line is the reef's surf, counted wave by wave in the Wave-Tally.",
    members: ['southern_islanders'],
  },
  sun_patronage: {
    name: 'Men under Sunhot patronage', line: 'straight', mark: 'patron_chief', mark_text: 'a chief whose lower edge is rayonny, in sun yellow',
    meaning: "Men who serve the Sunhot sanctuaries carry the patrons' rayonny edge only on a chief: the sanctuary stands over the guest-town, it is not its kin.",
    members: ['goodin_sunfolk'],
  },
  sylvan_elves: {
    name: 'Sylvan elves', line: 'engrailed', mark: 'line', mark_text: 'every line is engrailed, and elven silver appears in every achievement',
    meaning: 'The engrailed line is the edge of a leaf; silver is the Kindred Song. The realms of the Magical Lands and the household of Dunelaeth on the wrong side of the range share both, so a hill hall and a lake court are known as kin at a glance.',
    members: ['forest_council_elves', 'hill_kingdom_elves', 'lake_elves', 'pass_wardens', 'rift_coast_elves', 'kingdom_forest_elves', 'roost_keepers'],
  },
  galic_elves: {
    name: 'Gala elves', line: 'invected', mark: 'line', mark_text: 'every line is invected',
    meaning: 'The invected line is the rim of the Mirror of First Rain. It is deliberately not the Sunhot rayonny line: the kinship of Gala and the Sunhot realms is open, and the arms must not answer it.',
    members: ['gala_court'],
  },
  sunhot_elves: {
    name: 'Sunhot elves', line: 'rayonny', mark: 'line', mark_text: 'every line is rayonny; a sun disc appears in at most one achievement of each culture',
    meaning: 'The rayonny line is noon light on a sanctuary threshold. It carries the Sunhot identity so that the charges are free to show what each sanctuary keeps, instead of a sun on every banner.',
    members: ['sunhot_light', 'sunhot_western', 'sunhot_isles'],
  },
  orcish: {
    name: 'Orcs and ogres', line: 'raguly', mark: 'line', mark_text: 'every line is raguly, like a lopped branch',
    meaning: "The raguly line is the hewn stake of the holds' palisades and the challenge ring; every hold draws it, which says the holds are kin without saying they obey one master. Ogres draw it too, because an ogre is like a giant orc and lives among them.",
    members: ['volcano_clans', 'iron_clans', 'wild_holds', 'sea_orcs', 'ogre_clans', 'plateau_soldiery'],
  },
  goblin: {
    name: 'Goblins', line: 'potenty', mark: 'line', mark_text: 'every line is potenty, like tunnel mouths',
    meaning: 'The potenty line is a warren seen in section: tunnel, chamber, tunnel. The free warrens of Burnikit, the hobgoblin king\'s warrens of Burrikkrit and the warm-spring warrens of Glimkit all draw it.',
    members: ['goblin_warrens', 'king_warrens', 'spring_warrens'],
  },
  dwarven: {
    name: 'Dwarves', line: 'dovetailed', mark: 'line', mark_text: "every line is dovetailed, like a joiner's mortise cut true into rock",
    meaning: 'The dovetailed line is a hall cut true into the mountain. The hold-folks of the Great Wall range, the West Lands and the High Mountains all draw it, and no tincture of theirs is shared with any elven arms.',
    members: ['wall_delvers', 'west_delvers', 'north_delvers'],
  },
  isolate: {
    name: 'Peoples without kin', line: null, mark: null, mark_text: 'each people keeps its own line (see the people grammar)',
    meaning: 'Trolls, giants, yeti, ents, the Baelim, the mycids, the small folk, the gnomes, the dwarf goblins, the God Forest Keepers, the dead and the demons share no line with anyone outside their people: their arms answer only their own people.',
    members: ['troll_tribes', 'hill_giants', 'ice_giants', 'cairn_giants', 'yeti_clans', 'height_yeti', 'kilinti_ents', 'baelim', 'mycid_rings', 'hearth_folk', 'holt_gnomes', 'road_warrens', 'god_forest_keepers', 'grave_hosts', 'zols_dead', 'netherborn', 'nether_houses', 'veshazel_court'],
  },
};

// Culture ids that the roster still writes under their old names (cultures_new.json renames; the culture data's owner
// applies them). Both spellings resolve to the grammar under the new id.
export const CULTURE_RENAMES = {
  isengard_warlords: 'melkgard_warlords',
  windwaith_seafarers: 'vindael_seafarers',
  gunwaith_clans: 'gunwyn_clans',
  ember_lands_freeholds: 'ember_freeholds',
};
const RETIRED_CULTURES = {
  wall_folk: 'split into vale_folk (Kingson, Klungori Guard) and hilofrim_herders (the herders of Hirolon): there is no wall, the Great Wall of Aenor is a natural range',
  isengard_warlords: 'renamed melkgard_warlords: Isengard is a name of other fiction; the realm is Melkgard',
  windwaith_seafarers: 'renamed vindael_seafarers: "-waith" names are retired; the arm is Vindael',
  gunwaith_clans: 'renamed gunwyn_clans: "-waith" names are retired; the kingdom is Gunwyn',
  ember_lands_freeholds: 'renamed ember_freeholds: the region is the Ember Lands (owner, 24 October 2026)',
};
const FAITH_RENAMES = { stone_vigil: 'pass_vigil', river_temples: 'flood_stair' };

// ---------------------------------------------------------------------------------------------------------------
// Grammar helpers
// ---------------------------------------------------------------------------------------------------------------

const pal = (spec) => spec.split(';').map((s) => s.trim()).filter(Boolean).map((s) => {
  const m = s.match(/^(.*\S)\s+(#[0-9a-fA-F]{6})$/);
  if (!m) throw new Error(`bad palette entry ${s}`);
  const hex = m[2].toLowerCase();
  return { name: m[1], hex, class: tinctureClass(hex) };
});
const ch = (id, cls, name, meaning) => ({ id, name, meaning, class: cls });

function grammar(o) {
  return {
    id: o.id, name: o.name, people: o.people, family: o.family, language: o.language, faith: o.faith,
    ...(o.faith_secondary ? { faith_secondary: o.faith_secondary } : {}),
    tier: o.tier, line: o.line, palette: pal(o.palette), divisions: o.divisions, charges: o.charges,
    ornament: o.ornament, crown: o.crown ?? null, forms: o.forms,
    difference: { dissent_tincture: o.dissent, breakaway_mark: o.breakaway, restoration_charge: o.restoration },
    source_flag_note: o.note ?? null,
    ...(o.aliases ? { aliases: o.aliases } : {}),
    ...(o.supersedes ? { supersedes: o.supersedes } : {}),
    ...(o.refused ? { refused_from_source: o.refused } : {}),
  };
}

// ---------------------------------------------------------------------------------------------------------------
// New and renamed culture grammars
// ---------------------------------------------------------------------------------------------------------------

const NEW_GRAMMARS = [
  // --- Men of Ainic stock -----------------------------------------------------------------------------------------
  grammar({
    id: 'vale_folk', name: 'Vale-Folk of Kingson', people: 'men', family: 'ainic_men', language: 'aenoran', faith: 'pass_vigil', tier: 2, line: 'straight',
    palette: 'vale slate #5a5a6a; pass gold #d8c080; charter blue #2f5d8a; snowline white #e8e6de; granite #3e4147; lichen green #5a6b4a',
    divisions: ['per_chevron', 'plain', 'per_fess', 'chief', 'pile_reversed', 'base'],
    charges: [
      ch('pass_key', 'tool', 'a large key', 'the Pass Charter: the key of the only wheel road through the range, held by the Pass-Lord in the crown\'s name'),
      ch('cleft_peaks', 'landform', 'two peaks with a pass between them', 'the passes of the Great Wall of Aenor, a natural range'),
      ch('beacon_peak', 'fire', 'a peak with a fire on its summit', 'the vigil fire of the pass, which is never let out'),
      ch('watch_horn', 'tool', 'a straight watch-horn', 'the watch of the passes, handed from father to son'),
      ch('mountain_ibex', 'beast', 'an ibex standing', 'the high pastures above the snowline'),
      ch('crossbow', 'weapon', 'a crossbow', 'the crossbows of the sworn pass companies'),
      ch('names_stone', 'token', 'an upright stone with notches', 'the stone on which the dead of the passes are named'),
      ch('ringed_vale', 'landform', 'a ring of hills round a green vale', 'the ringed Kingson Vale, held through the whole Third Age under the Order\'s forts'),
    ],
    ornament: 'Peaks, passes, snowlines and the ringed vale: the Great Wall of Aenor is a natural range, so the arms never show masonry, gate-towers, battlements or brick courses.',
    forms: {
      pass_lordship: 'The per chevron field (the range) with the charge beneath the peak; no crown, because the Pass-Lord holds by charter.',
      garrison_company: 'The charge of the watch on a reversed pile, the pass rising.',
      subject: 'The Concord charter border of lamp gold.',
    },
    dissent: 'granite', breakaway: 'a border of granite', restoration: 'beacon_peak',
    note: 'A gate-tower between two peaks on grey; the dominion\'s charter-seal border.',
    refused: 'The source card\'s gate-tower is not drawn: a tower in the pass reads as masonry of the Great Wall, which is a natural range.',
    supersedes: 'wall_folk',
  }),
  grammar({
    id: 'hilofrim_herders', name: 'Hill-Herders of Hilofrim', people: 'men', family: 'ainic_men', language: 'aenoran', faith: 'lamp_furrow', tier: 3, line: 'straight',
    palette: 'Grano green #6a7a4a; fleece cream #e8e0c0; turf brown #5a4a3a; saddle grey #8a8a7c; sky wool #c8d0d0',
    divisions: ['per_fess', 'base', 'plain', 'per_bend'],
    charges: [
      ch('hill_sheep', 'beast', 'a horned hill sheep standing', 'the flocks of the Grano that pay the giants\' grazing due'),
      ch('shepherd_crook', 'tool', "a shepherd's crook", 'the village headmen who answer to the High Chief'),
      ch('shepherd_sling', 'weapon', "a shepherd's sling", 'the herders\' slings, their only arms'),
      ch('grano_saddle', 'landform', 'a low saddle between two hills', 'the Grano Saddle, over which the herders guide armies'),
      ch('stone_fold', 'building', 'a round stone sheepfold', 'the low stone farms of the Grano'),
    ],
    ornament: 'Low, broad charges of the open hill; no peaks of the range and no masonry of any wall.',
    forms: { tenant: 'No realm of its own: the herders are Hirolon\'s tenants, and Hirolon\'s arms borrow the Grano green from them.' },
    dissent: 'turf brown', breakaway: 'a border of turf brown', restoration: 'stone_fold',
    note: 'A sheep and a cairn on green.', supersedes: 'wall_folk',
  }),
  grammar({
    id: 'strait_folk', name: 'Strait-Folk of Fotan', people: 'men', family: 'ainic_men', language: 'aenoran', faith: 'strait_litany', faith_secondary: 'deliverer', tier: 3, line: 'straight',
    palette: 'toll blue #2f4a6a; quay white #e0e0d0; chain red #8a2a2a; toll brass #c4a050; tar black #2a2a2e',
    divisions: ['per_fess', 'per_pale', 'plain', 'base', 'per_bend_sinister'],
    charges: [
      ch('toll_chain', 'token', 'a chain stretched fesswise from edge to edge', "the chain Ostvar's house stretched across the narrowest landing of the strait"),
      ch('toll_boat', 'ship', 'a small toll-boat under oars', 'the toll-boats, the best-handled small craft on the strait'),
      ch('toll_house', 'building', 'a squat toll-house on a quay', 'the toll-house the Order burned twice and never kept them out of'),
      ch('joined_rings', 'token', 'two plain rings linked', 'the Leren captain and the Aenoran ferry-house married into one house'),
      ch('boathook', 'tool', 'a boathook', 'the ferrymen of the narrowest crossing'),
    ],
    ornament: 'Charges of the crossing drawn fesswise, from shore to shore.',
    forms: { lordship: 'A free lordship outside the Charters: Aen\'s label, no charter border and no crown.' },
    dissent: 'tar black', breakaway: 'a border of tar black', restoration: 'toll_house',
    note: 'A toll-chain across blue water.',
  }),
  grammar({
    id: 'teste_valley_folk', name: 'Teste Valley-Folk', people: 'men', family: 'ainic_men', language: 'aenoran', faith: 'lamp_furrow', tier: 3, line: 'straight',
    palette: 'vale green #5a7a3a; straw #e0d0a0; lake slate #3a5a7a; loam brown #6a4a30; linen white #ece6d4',
    divisions: ['chief', 'per_fess', 'plain', 'base'],
    charges: [
      ch('plough_furrow', 'landform', 'a ploughed furrow running across the field', 'the one fertile vale under the Herrodon rim, ploughed by the descendants of the Third Age refugees'),
      ch('reeve_staff', 'tool', "a reeve's staff with a hooked head", 'the Reeve chosen at the harvest moot'),
      ch('oat_sheaf', 'plant', 'a sheaf of oats', 'the grain Teste sends to Herrodon and Andos Enda'),
      ch('ash_leaf', 'plant', 'a single ash leaf', 'the old ranger speech the valley still keeps'),
    ],
    ornament: 'Plain farm charges; nothing elven except the protector\'s border.',
    forms: { commune: 'No crown: a moot of farms; the protector\'s hall-ward border of Herrodon.' },
    dissent: 'loam brown', breakaway: 'a border of loam brown', restoration: 'plough_furrow',
    note: 'A furrow and a leaf on green.',
  }),
  // --- Men of Boreal and Eastern stock -----------------------------------------------------------------------------
  grammar({
    id: 'reindeer_clans', name: 'Reindeer Clans of Kvittumm', people: 'men', family: 'boreal_men', language: 'coldic', faith: 'winter_hearth', tier: 3, line: 'indented',
    palette: 'fell grey #6a7a8a; white hills #f0f0f0; hide red #7a3a2a; turf brown #5c4a36; lichen gold #c8b46a',
    divisions: ['plain', 'per_fess', 'per_bend', 'base'],
    charges: [
      ch('antlered_head', 'body_part', "a reindeer's head with full antlers", "the herd, which is the clan's wealth"),
      ch('hide_tent', 'building', 'a hide tent of the herd-camps', 'the camps that move with the herds between the giants\' foothills and the Orewell lowland'),
      ch('herd_bell', 'tool', 'a herd bell', 'the lead reindeer of a clan\'s herd'),
      ch('moot_fire', 'fire', 'a fire in a ring of turf', 'the winter moot at Esrom each Long Dark'),
      ch('ice_road_cairn', 'landform', 'a cairn on a frozen road', 'the old ice-roads the clans keep'),
    ],
    ornament: 'Herd charges, drawn whole and plain; nothing on the arms speaks of anything but herds, weather and the moot.',
    forms: { confederation: 'The clans\' charge tripled, two above one; no crown.' },
    dissent: 'turf brown', breakaway: 'a border indented of turf brown', restoration: 'moot_fire',
    note: 'An antlered head on white.',
  }),
  grammar({
    id: 'woqood_sealers', name: 'Sealers of Woqood', people: 'men', family: 'eastern_men', language: 'noric', faith: 'well_oath', tier: 3, line: 'stepped',
    palette: 'snow coast #e8f0f0; seal water #3a5a6a; harpoon red #8a2a2a; whalebone #d8ccb4; sled black #2a2a2e',
    divisions: ['chief', 'per_fess', 'plain', 'base'],
    charges: [
      ch('woqood_harpoon', 'weapon', 'a harpoon with its coiled line', 'the Harpoon-Speaker who holds the peace of the moot of Pehami'),
      ch('whalebone_hall', 'building', 'a turf hall framed in whalebone', 'the halls of the snow coast'),
      ch('snow_well', 'water', 'a well-head cut into snow', 'the Well-Oath of the Noric boat clans, kept on the snow coast'),
      ch('seal_head', 'sea_creature', "a seal's head rising from water", 'the seal grounds the clans share without blood'),
      ch('sled', 'tool', 'a sled', 'the sled-men of the coast'),
    ],
    ornament: 'Noric stepped lines on a coast of snow: the riders\' stock under a northern sky, and no camel or desert charge.',
    forms: { league: 'The Harpoon-Speaker\'s charge tripled for the clans of Pehami, Cream and Lorvens; no crown.' },
    dissent: 'sled black', breakaway: 'a border stepped of sled black', restoration: 'snow_well',
    note: 'A harpoon on white over blue.',
  }),
  grammar({
    id: 'naamis_sea_crown', name: 'Sea-Crown Folk of Naamis', people: 'men', family: 'eastern_men', language: 'noric', faith: 'well_oath', tier: 2, line: 'stepped',
    palette: 'naam blue #1f4a7a; harbour gold #e0c070; coast white #f0f0e8; deep naam #142c4a; sail ochre #b08a4a',
    divisions: ['plain', 'per_fess', 'per_pale', 'chief', 'base'],
    charges: [
      ch('twin_harbour', 'building', 'two harbour moles curving round one basin', 'Hacsen and Vigodor, the two harbours one marriage made a crown'),
      ch('coast_hall', 'building', 'a long hall with a stepped roof', 'the coast hall of Duum-Saah built between the two harbours'),
      ch('sea_well', 'water', 'a well-head on a shore', 'the Noris Treaty: the sea crown keeps the Well-Oath of the riders'),
      ch('deep_hull', 'ship', 'a deep-hulled ship', "the ships that carry the Salt Road's goods to the rift"),
    ],
    ornament: 'White harbour charges on the blue of the north coast.',
    crown: 'the sea-crown: a gold circlet of small wave-crest points',
    forms: { kingdom: 'The sea-crown over the charge; the crown passes in one line of captains.' },
    dissent: 'deep naam', breakaway: 'a border stepped of deep naam', restoration: 'sea_well',
    note: 'A crown on waves.',
  }),
  grammar({
    id: 'orato_fishers', name: 'Island Fishers of Orato', people: 'men', family: 'eastern_men', language: 'noric', faith: 'well_oath', tier: 3, line: 'stepped',
    palette: 'isle blue #3a6a8a; net white #e0e0d0; boat brown #5a3a2a; catch silver #b8c0c4; dark water #1e2e3a',
    divisions: ['per_pale', 'per_fess', 'plain', 'base'],
    charges: [
      ch('orato_cod', 'sea_creature', 'a cod swimming', 'the catch the isles sell to the Naamis ship-masters'),
      ch('stone_harbour', 'building', 'a stone harbour mole', 'the harbour at Nodoqood that every boat of the isle can use'),
      ch('fishing_skiff', 'ship', 'a fishing skiff', 'the boats of the fishing families'),
      ch('net_floats', 'tool', 'a net hung with floats', 'the families who chose one lord of the boats'),
    ],
    ornament: 'Plain fishing charges; nothing of what the fishermen say they saw among the northern islands.',
    forms: { lordship: 'One lord of the boats: no crown; the two isles impaled per pale.' },
    dissent: 'dark water', breakaway: 'a border stepped of dark water', restoration: 'stone_harbour',
    note: "A fish and a black ship's sail.",
    refused: 'The source card\'s black sail is not drawn: public arms do not show the black ships of the north.',
  }),
  grammar({
    id: 'quay_folk', name: 'Quay-Folk of Luv-zhise', people: 'men', family: 'eastern_men', language: 'alerhic', faith: 'lake_litany', tier: 3, line: 'stepped',
    palette: 'narrows teal #2a5a6a; quay ochre #d0b070; ferry plum #6a3a5a; foam white #e4e0d4; piling black #262628',
    divisions: ['per_pale', 'per_fess', 'plain', 'base'],
    charges: [
      ch('rift_ferry', 'ship', 'a flat ferry-boat with a square sail', 'the ferries the Alerhic boatmen ran across the Rift Narrows for centuries'),
      ch('ferry_rope', 'tool', 'a ferry-rope drawn between two posts', 'the crossing itself'),
      ch('stilt_quay', 'building', 'a quay-house on stilts', 'the quay-houses whose heads sit as the port\'s council'),
      ch('pilot_pole', 'tool', "a pilot's sounding pole", 'the pilots of the Narrows'),
    ],
    ornament: 'The crossing drawn across a field divided per pale, one shore at the hoist and one at the fly.',
    forms: { city_state: 'A free port: the crossing over the two shores; no crown.' },
    dissent: 'piling black', breakaway: 'a border stepped of piling black', restoration: 'stilt_quay',
    note: 'A ferry-boat between two shores.',
  }),
  grammar({
    id: 'miaed_pass_lords', name: 'Pass-Lords of Miaed', people: 'men', family: 'eastern_men', language: 'alerhic', faith: 'pass_fires', tier: 2, line: 'stepped',
    palette: 'pass ochre #c08a3a; gorge red #6a2a1a; sand white #f0e0c0; fire gold #e0b040; night pass #2a2430',
    divisions: ['per_fess', 'per_chevron', 'plain', 'chief', 'pile_reversed'],
    charges: [
      ch('pass_fire', 'fire', 'a fire burning in a mountain pass', 'the fires the pass-lords keep for the spirits of the high road, who lead caravans through the sand-storms'),
      ch('fire_tower', 'building', 'a slender fire-tower', 'the fire-towers of the Hardtmuth passes'),
      ch('gorge_road', 'landform', 'a road winding through a gorge', 'the gorges where the Sand Road\'s first caravans came through'),
      ch('glass_sand_jar', 'vessel', 'a jar of glass sand', 'the glass sand of the coast'),
      ch('caravan_bell', 'tool', 'a caravan bell', 'the passage the lords sell to whoever pays more'),
    ],
    ornament: 'The pass-lords respect strangers\' gods and show none: their charge is their own fire.',
    forms: { lordship: 'The pass-lords elect the Lord of Erdozan: no crown; the fire stands in the pass.' },
    dissent: 'night pass', breakaway: 'a border stepped of night pass', restoration: 'pass_fire',
    note: 'A fire on a mountain pass, ochre and dark red.',
  }),
  grammar({
    id: 'wahatud_oasis_folk', name: 'Oasis-Folk of Wahatud', people: 'men', family: 'eastern_men', language: 'noric', faith: 'water_share', tier: 3, line: 'stepped',
    palette: 'oasis green #3a8a7a; dune #e8d8a8; mud brick #8a6a3a; well blue #2a5a7a; water silver #c8d4d0',
    divisions: ['plain', 'per_fess', 'base', 'chief'],
    charges: [
      ch('four_wells', 'water', 'four well-heads set in a ring', 'the four strings of wells round Biir-Raab, kept by the Well-Moot'),
      ch('offered_cup', 'vessel', 'a cup held out', 'the water always offered to refugees'),
      ch('well_bucket', 'tool', 'a well-bucket on its rope', 'water sold by the skin to caravans that are not refugees'),
      ch('dune_staff', 'tool', "a guide's staff", 'the guides who cross the dune sea without fear'),
    ],
    ornament: 'Water is drawn as wells, cups and buckets; never a palm tree (banned everywhere) and never a camel (the one camel of the East and South belongs to Noris).',
    forms: { league: 'The Well-Moot: no crown; the wells are the charge.' },
    dissent: 'mud brick', breakaway: 'a border stepped of mud brick', restoration: 'offered_cup',
    note: 'A well with three palms.',
    refused: 'The source card\'s palms are not drawn: palm trees are banned everywhere.',
  }),
  // --- Elves ------------------------------------------------------------------------------------------------------
  grammar({
    id: 'kingdom_forest_elves', name: 'the Kingdom Forest Company', people: 'elves', family: 'sylvan_elves', language: 'sylvan', faith: 'kindred_song', tier: 3, line: 'engrailed',
    palette: 'kingdom green #2a5a3a; old silver #c8c0a0; western bark #5a3a2a; moon white #f0f0e8; dusk #3a4048',
    divisions: ['plain', 'per_fess', 'per_chevron', 'base'],
    charges: [
      ch('kept_beech', 'tree', 'a beech in full leaf over a low grassed mound', 'the household that would not leave the forests where its dead lay'),
      ch('silver_road', 'landform', 'a silver road winding up to a pass between two hills', 'the road to the Kingson Pass that the household guides travellers on'),
      ch('guide_lantern', 'fire', "a guide's lantern on a staff", 'the guides of the Kingdom Forests'),
    ],
    ornament: 'Silver in every achievement; never a crowned tree (another fiction\'s white tree and crown).',
    forms: { household: 'One household under its eldest: no crown and no council border.' },
    dissent: 'dusk', breakaway: 'a border engrailed of dusk', restoration: 'guide_lantern',
    note: 'A crowned tree on green with a silver road beneath.',
    refused: 'The source card\'s crown on the tree is not drawn: a crowned tree is another fiction\'s arms.',
  }),
  grammar({
    id: 'roost_keepers', name: 'Roost-Keepers of Yavieth', people: 'elves', family: 'sylvan_elves', language: 'sylvan', faith: 'kindred_song', tier: 3, line: 'engrailed',
    palette: 'slope green #3a6a2a; dragon red #c0302a; goat cream #e0d0a0; keeper silver #d0d4cc; roost slate #3a3a40',
    divisions: ['plain', 'per_chevron', 'base', 'per_fess'],
    charges: [
      ch('three_spurs', 'landform', 'a mountain with three spurs', 'Dragon Mountain, on whose three spurs the dragons roost'),
      ch('gift_scale', 'body_part', 'a single shed dragon scale', 'the scales the dragons shed, which the keepers trade at Kingson'),
      ch('keeper_goat', 'beast', 'a goat standing', 'the dragon-shy goats the dragons are allowed to take'),
      ch('roost_ledge', 'building', 'a shelter on a mountain ledge', 'the keepers\' shelters on the slopes'),
    ],
    ornament: 'Dragons are shown only by a scale or the mountain, never as a whole beast: a red dragon on green and white and a dragon on a diagonal bicolour are real-world flags.',
    forms: { fellowship: 'A fellowship without a ruler: no crown and no border.' },
    dissent: 'roost slate', breakaway: 'a border engrailed of roost slate', restoration: 'three_spurs',
    note: "A dragon's wing over a green hill.",
  }),
  grammar({
    id: 'god_forest_keepers', name: 'Keepers of the God Forest', people: 'elves', family: 'isolate', language: 'sunhot', faith: 'kindred_song', tier: 3, line: 'wattled',
    palette: 'god-wood green #1f4a3a; glade gold #e8d070; keeper white #f0f0e0; shadow #142a22; bark grey #6a6a5a',
    divisions: ['base', 'plain', 'per_fess'],
    charges: [
      ch('branch_gate', 'building', 'a closed gate of woven branches', 'the wood the Keepers close to everyone'),
      ch('round_glade', 'landform', 'a round glade in a wood', 'the Keepers\' Glade'),
      ch('upright_leaf', 'plant', 'a single long leaf held upright', 'the silence the Sunhot treat as holy'),
    ],
    ornament: 'No sun disc, no rayonny and no invected line: whether the Keepers are Sunhot, Gala or a kin of their own is open, and the arms must not answer it. The wattled line is theirs alone.',
    forms: { household: 'The Keepers\' household: no crown, no border.' },
    dissent: 'shadow', breakaway: 'a border wattled of shadow', restoration: 'round_glade',
    note: 'A closed gate of branches on deep green with a gold sun behind.',
    refused: 'The source card\'s gold sun is not drawn: a sun would answer the open question of the Keepers\' kin.',
  }),
  // --- Dwarves ----------------------------------------------------------------------------------------------------
  grammar({
    id: 'wall_delvers', name: 'Delving-Clans of Kunhrim', people: 'dwarves', family: 'dwarven', language: 'dwarvish', faith: 'deep_reckoning', tier: 2, line: 'dovetailed',
    palette: 'delving brown #4a3b2f; anvil gold #c9973a; stone grey #8f8f8a; black powder #1e1c1c; lamp white #e6e0d2',
    divisions: ['plain', 'bordure', 'chief', 'per_chevron', 'pile_reversed', 'per_fess', 'base'],
    charges: [
      ch('rock_gate', 'building', 'a squared gate cut into a rock face', 'the Western Gate the clans cut into the Lunhrim massif to trade with Aen\'s kingdom'),
      ch('powder_horn', 'tool', 'a powder horn', 'the black powder the hold sells to the crown and nobody else'),
      ch('ore_basket', 'tool', 'a carrying basket heaped with ore', 'the iron that goes west, which the clans can withhold from any ruler in Parim'),
      ch('founders_stone', 'token', 'a squared stone cut with plain notches', 'the founders\' reckoning cut in stone in the deep hall'),
    ],
    ornament: 'Rock-cut gates and squared charges: the Great Wall of Aenor is a natural range, so no masonry, battlements or brick courses. No flaming anvil (the arms of a named god).',
    forms: { subject: 'The Iron Charter is a Concord charter: the border of lamp gold.', hold: 'The Lord of the Deep Hall and the clan-elders: no crown.' },
    dissent: 'black powder', breakaway: 'a border dovetailed of black powder', restoration: 'rock_gate',
    note: 'A gold anvil under a stone arch on dark brown; the Iron Charter adds a narrow blue bordure.',
    refused: 'The source card\'s anvil is not drawn (a gold anvil on a dark field is the arms of Irumas of the twelve) and its stone arch is cut from rock, not built; the Iron Charter is shown by the Concord\'s lamp-gold border like every other charter.',
  }),
  grammar({
    id: 'west_delvers', name: 'Western Hold-Folk', people: 'dwarves', family: 'dwarven', language: 'dwarvish', faith: 'deep_reckoning', tier: 3, line: 'dovetailed',
    palette: 'hold dark #3d3a36; rim gold #c8a048; forge red #a33a2a; ash white #dcd6ca; grey stone #8a8680; iron black #222224',
    divisions: ['plain', 'bordure', 'chief', 'per_fess', 'pile_reversed', 'per_chevron', 'base'],
    charges: [
      ch('forge_flame', 'fire', 'a forge-flame on a hearth-stone', 'Hrennost, the fire-hold, ruled from its deepest hall'),
      ch('outer_gate', 'building', 'a squared outer gate in a rock face, shut', 'the Outer Gate where men trade and beyond which they have never been'),
      ch('bombard', 'weapon', 'a squat bombard on a timber bed', 'the siege bombards cast for sale'),
      ch('powder_keg', 'vessel', 'a bound powder-keg', 'the powder-pieces sold to whoever wins the hold\'s favour'),
      ch('gold_ingot', 'token', 'a gold ingot', 'the gold and gems of the Herlitz and the Dusty Mountains'),
    ],
    ornament: 'Heavy squared charges and a dovetailed chief or base; no tincture shared with elven arms.',
    forms: { hold: 'The lord of the deepest hall: no crown; the masters of the forges advise.' },
    dissent: 'iron black', breakaway: 'a border dovetailed of iron black', restoration: 'outer_gate',
    note: 'A red forge-flame or a grey tower on a dark field, with a gold rim.',
  }),
  grammar({
    id: 'north_delvers', name: 'High Hold-Folk', people: 'dwarves', family: 'dwarven', language: 'dwarvish', faith: 'deep_reckoning', tier: 3, line: 'dovetailed',
    palette: 'high slate #2e3a45; snow white #d8d8d0; bronze #9a7a3a; gate black #1e1e22; ice grey #a8b0b4',
    divisions: ['pile_reversed', 'chief', 'per_chevron', 'per_fess'],
    charges: [
      ch('high_gate', 'building', 'a squared black gate in a snowline rock face', 'the High Gate, the only place where men are received'),
      ch('pact_hammer', 'tool', 'a war-hammer held upright', 'the Hill Pact, by which the hold comes down to any hill crown that is attacked'),
      ch('deck_bombard', 'weapon', 'a bombard on a ship\'s carriage', 'the bombards that ride on Sonargur\'s ships'),
    ],
    ornament: 'A white peak and a black gate: the hall under the snows.',
    forms: { hold: 'The Lord of the White Hall with a council of clans: no crown.' },
    dissent: 'gate black', breakaway: 'a border dovetailed of gate black', restoration: 'high_gate',
    note: 'A white peak over a black gate on grey.',
  }),
  // --- Small folk, gnomes, dwarf goblins ------------------------------------------------------------------------------
  grammar({
    id: 'hearth_folk', name: 'Hearth-Folk of Dobbum', people: 'small_folk', family: 'isolate', language: 'hearthspeech', faith: 'hearth_table', tier: 3, line: 'double_arched',
    palette: 'basin green #4f7a3a; harvest yellow #e3c77a; hearth brown #8a5a33; loaf cream #efe4c8; hedge dark #2f4a2a; berry #9a3a3a',
    divisions: ['base', 'per_fess', 'plain', 'chief', 'flaunches'],
    charges: [
      ch('famine_bread', 'vessel', 'a basket of round loaves', 'the Famine Bread: the grain the small folk carried over the Ronbo passes to starving clansmen, who swore the Ronbo Oath to guard the passes for ever'),
      ch('grain_ship', 'ship', 'a round-bellied grain ship with a patched square sail', 'the Aenoran grain ship that carried the first households of Tirlan south to the Hilorn mouth'),
      ch('harvest_stone', 'token', 'a rounded harvest stone', 'the harvest stone at the moot-hall and the harvest-share paid to the giants'),
      ch('apple_bough', 'plant', 'a young apple bough with fruit', 'the Orchard Gift of cuttings sent over the passes to Thenon'),
      ch('three_valleys', 'landform', 'three low valleys between rounded hills', 'the three valleys of the Hilorn, Tirlan\'s small fields'),
    ],
    ornament: 'Rounded, homely charges with square doors; never a round door (another fiction\'s mark).',
    forms: {
      moot: 'No crowns: the charge on a double-arched base, the hills of home.',
      protectorate: 'Tirlan carries Hirolon\'s ward: a narrow border of cairn brown.',
    },
    dissent: 'hedge dark', breakaway: 'a border double-arched of hedge dark', restoration: 'harvest_stone',
    note: 'A round green door in a yellow field.',
    refused: 'The source card\'s round green door is not drawn: a round door is another fiction\'s mark.',
  }),
  grammar({
    id: 'holt_gnomes', name: 'Holt-Folk of Olodor', people: 'gnomes', family: 'isolate', language: 'gnomish', faith: 'full_pot', tier: 3, line: 'escartelly',
    palette: 'holt green #2f6b3a; bird red #b23a2a; pot gold #d4a93a; root brown #5a3e2a; lamp cream #e8dcb8',
    divisions: ['per_fess', 'base', 'plain', 'flaunches'],
    charges: [
      ch('root_door', 'building', 'a small square door among the roots of a hill', 'the holts hidden under the hills, doors that look like roots'),
      ch('tally_rim', 'token', 'the notched rim of a pot', "the village king's tally of the pots"),
      ch('hidden_oak', 'tree', 'an old oak with a small square door in its trunk', 'houses inside trees'),
    ],
    ornament: 'One hidden detail in each design (the escartelly notch is the door); no pointed red cap, no rainbow, no clover.',
    forms: { enclave: 'An orle of the surrounding realm: holts hidden inside another\'s land; the pot uncrowned, because every village has its own king.' },
    dissent: 'root brown', breakaway: 'a border escartelly of root brown', restoration: 'root_door',
    note: 'A brimming pot of gold on green, a red cap above.',
    refused: 'The source card\'s red cap is not drawn (the gnome grammar forbids pointed red caps).',
  }),
  grammar({
    id: 'road_warrens', name: 'Road-Warrens of Mustnom', people: 'dwarf_goblins', family: 'isolate', language: 'pack_tongue', faith: 'road_due', tier: 3, line: 'bevilled',
    palette: 'pack brown #5a4a3a; road moss #7a8a4a; trade brass #c0a060; salt white #e0dcd0; boss black #262420',
    divisions: ['per_bend', 'per_bend_sinister', 'per_fess', 'chief'],
    charges: [
      ch('laden_pack', 'garment', 'a laden travel pack', 'half of every family always on the road with goods'),
      ch('news_horn', 'tool', "a pedlar's horn", 'news of a landing carried faster than any courier'),
      ch('cave_market', 'building', 'a cave mouth hung with goods', 'the cave-markets of the southern hills'),
      ch('salt_pinch', 'token', 'a pinch of salt on a flat stone', 'the spirits of the road, thanked with a pinch of salt'),
    ],
    ornament: 'Diagonal compositions: everything is on the road.',
    forms: { clan: "The boss's iron ring round the charge; no crown, because no boss is a king." },
    dissent: 'boss black', breakaway: 'a border bevilled of boss black', restoration: 'cave_market',
    note: 'A laden pack on a grey field with a black boss-mark.',
  }),
  // --- Goblins and ogres ------------------------------------------------------------------------------------------
  grammar({
    id: 'king_warrens', name: 'Warrens of the Hobgoblin King', people: 'goblins', family: 'goblin', language: 'goblin', faith: 'warren_luck', tier: 3, line: 'potenty',
    palette: 'deep moss #4a5a2a; pit black #2a2a22; salvage gold #d0b050; wurgh grey #7a7468; fire-pot orange #c86a2a',
    divisions: ['plain', 'bordure', 'base', 'per_fess', 'chief', 'pile_reversed'],
    charges: [
      ch('under_road', 'landform', 'a tunnel mouth under a mountain peak', 'the under-roads, the one hidden way through the range, which the king sells in war'),
      ch('wurgh_head', 'beast', "a wurgh's head", 'the wurgh riders of the southern roads'),
      ch('fire_pot', 'weapon', 'a fire-pot with a burning fuse', 'the crude powder thrown in the tunnel fights'),
      ch('truce_lantern', 'fire', 'a shuttered lantern', 'the Lamp Truce with the dwarves'),
      ch('salvage_heap', 'token', 'a heap of salvage', 'the salvage traded at the edges of the range'),
    ],
    ornament: 'Goblin ornament scaled up for the king\'s warrens: fewer, larger shapes.',
    crown: 'the grown crown: a goblin crown too small for its wearer',
    forms: { kingdom: 'The grown crown over the warren\'s charge: the king is a hobgoblin who grew very big, and he rules these warrens only.' },
    dissent: 'wurgh grey', breakaway: 'a border potenty of wurgh grey', restoration: 'truce_lantern',
    note: "A lamp in a cave mouth under a hobgoblin's crown.",
  }),
  grammar({
    id: 'spring_warrens', name: 'Warrens of the Warm Springs', people: 'goblins', family: 'goblin', language: 'goblin', faith: 'warren_luck', tier: 3, line: 'potenty',
    palette: 'steam green #5a7a5a; warren dark #3a3a2a; lamp-fat yellow #e8d070; spring white #e4e8e0; hound brown #6a5038',
    divisions: ['plain', 'bordure', 'base', 'per_fess', 'chief'],
    charges: [
      ch('steaming_spring', 'water', 'a round spring sending up three plumes of steam', 'Drikzig, the hall of the warm water, dug round the largest spring'),
      ch('fat_lantern', 'fire', 'a lantern burning rendered fat', 'the best lamps of the north, sold at the snowline fair'),
      ch('spring_snare', 'tool', 'a spring snare', 'the best traps of the north'),
      ch('bone_hound', 'beast', 'a shaggy bone-hound', 'the summer riders of the valleys'),
    ],
    ornament: 'Steam and snares; warm valleys under a cold sky.',
    forms: { clan: 'A hobgoblin chief, not the king: no crown.' },
    dissent: 'warren dark', breakaway: 'a border potenty of warren dark', restoration: 'steaming_spring',
    note: 'A lamp over steaming water.',
  }),
  grammar({
    id: 'ogre_clans', name: 'Ogre Clans', people: 'ogres', family: 'orcish', language: 'orcish', faith: 'hold_luck', tier: 3, line: 'raguly',
    palette: 'hall timber #5a4a3a; meat red #8a3a2a; ogre bone #c0b090; smoke grey #6a645a; cave char #2a2622',
    divisions: ['plain', 'per_fess', 'base', 'pile_reversed'],
    charges: [
      ch('offered_haunch', 'body_part', 'a haunch of meat', 'the meat Grimduth carried into the ogres\' caves instead of spears, which made one moot of orcs and ogres'),
      ch('ogre_cauldron', 'vessel', 'a great cauldron', 'the clans who eat only meat'),
      ch('timber_hall', 'building', 'a great timber hall', 'the timber halls of the Dark Forests'),
      ch('knotted_club', 'weapon', 'a great knotted club', 'the clan under the biggest'),
    ],
    ornament: 'Orcish ornament, larger and fewer charges.',
    forms: { moot: 'Among orcs the ogres take the host hold\'s tinctures and show their own charge beside the orcs\'.' },
    dissent: 'cave char', breakaway: 'a border raguly of cave char', restoration: 'ogre_cauldron',
    note: 'A club and a cauldron.',
  }),
  grammar({
    id: 'plateau_soldiery', name: 'Soldiery of the Plateau', people: 'orcs', family: 'orcish', language: 'orcish', faith: 'skull_fire', tier: 3, line: 'raguly',
    palette: 'barrack brown #3a2a2a; muster red #8a1a1a; scar bone #c0a080; powder black #222024',
    divisions: ['plain', 'per_fess'],
    charges: [
      ch('scar_marks', 'body_part', 'three parallel scars', 'the only marks the companies keep of their own'),
      ch('company_pike', 'weapon', 'a pike of the companies', 'the orc companies of the necromantic orders'),
      ch('muster_drum', 'tool', 'a muster drum', 'the Musters the Dominion counts instead of months'),
    ],
    ornament: 'No realm of its own: the companies march under the Dominion\'s arms.',
    forms: { companies: 'Nothing of theirs is added to the Gate of Nafeher; their marks are scars.' },
    dissent: 'powder black', breakaway: 'a border raguly of powder black', restoration: 'muster_drum',
    note: "Under the Dominion's banner; their own marks are scars.",
  }),
  // --- Giants, yeti, tree-peoples, mycids ---------------------------------------------------------------------------
  grammar({
    id: 'cairn_giants', name: 'Cairn-Keepers of the Giant Forest', people: 'giants', family: 'isolate', language: 'gigantic', faith: 'giant_cairn', tier: 3, line: 'arched',
    palette: 'giant-forest green #4a5a3a; cairn grey #a0a090; forest earth #6a4a2a; lichen white #dcdcc8; river dark #2e3a34',
    divisions: ['base', 'per_fess', 'plain'],
    charges: [
      ch('three_stone_cairn', 'token', 'a cairn of three great stones', 'the cairns that name the dead, kept by the oldest giant'),
      ch('cairn_line', 'landform', 'a line of small cairns across a hill', 'the Borderline of Giants, which is not to be crossed'),
      ch('giant_oak', 'tree', 'a vast oak', 'the Giant Forest by the Giant River'),
    ],
    ornament: 'One huge charge; giants do not draw small things.',
    forms: { enclave: 'No king: the oldest giant keeps the line; an orle of the surrounding realm.' },
    dissent: 'river dark', breakaway: 'a border arched of river dark', restoration: 'three_stone_cairn',
    note: 'A cairn of three stones on green.',
  }),
  grammar({
    id: 'height_yeti', name: 'Height Clans of Ghaahu', people: 'yeti', family: 'isolate', language: 'yetic', faith: 'yeti_hum', tier: 3, line: 'dancetty',
    palette: 'height white #e8e8f0; cloud grey #6a7a8a; deep rock #3a3a4a; dusk blue #4a5a7a',
    divisions: ['per_chevron', 'base', 'plain'],
    charges: [
      ch('herd_horns', 'body_part', 'a pair of curved wild-herd horns', 'the wild herds the height clans follow among the Cold Mountains'),
      ch('song_cave_fire', 'fire', 'a fire in a cave mouth', 'the fire at Huummal by which the height Eldest let the first envoy sit'),
      ch('high_peaks', 'landform', 'three high peaks', 'the high snows of Ghaahu'),
    ],
    ornament: 'Three big peaks; sound is drawn as a cave answering, never as radiating arcs.',
    forms: { clan: 'The clan follows the one whose song carries furthest: no crown.' },
    dissent: 'deep rock', breakaway: 'a border dancetty of deep rock', restoration: 'song_cave_fire',
    note: 'A white hum-mark on grey.',
  }),
  grammar({
    id: 'baelim', name: 'the Baelim', people: 'tree_people', family: 'isolate', language: 'lowspeech', faith: 'standing_silence', tier: 3, line: 'gnarled',
    palette: 'stand green #2a4a2a; root brown #6a5a3a; pale leaf #a8b880; dew silver #d4dcc8; deep shade #1a2a1a',
    divisions: ['base', 'plain', 'per_fess'],
    charges: [
      ch('rooted_fir', 'tree', 'a tall fir whose roots spread as wide as its crown', 'a stand of the Baelim, one and many, which has never let a man build among it'),
      ch('fallen_cone', 'plant', 'a fir cone', 'a sapling, which belongs to the stand it roots beside'),
      ch('edge_water_jar', 'vessel', 'a water jar set on the ground', 'the water Selen\'s rangers leave at the forest\'s edge in dry summers'),
      ch('three_firs', 'tree', 'three firs standing close', 'Graulvoa, the oldest stand'),
    ],
    ornament: 'Conifers only, tall and narrow with their roots shown; never a broadleaf tree and never the rooted line, which are the ents\' marks.',
    forms: { forest_domain: 'No crown: the slow moot shows the stand itself.' },
    dissent: 'deep shade', breakaway: 'a border gnarled of deep shade', restoration: 'fallen_cone',
    note: 'A tree with its roots drawn as wide as its crown, on dark green.',
  }),
  grammar({
    id: 'mycid_rings', name: 'Mycids of the Mushroom Forest', people: 'mycids', family: 'isolate', language: null, faith: 'none', tier: 3, line: 'gilled',
    palette: 'spore purple #6a4a6a; cap cream #d0c0a0; loam dark #3a2a2a; pale gill #e0d4c8; fungus brown #7a5a3a',
    divisions: ['plain', 'base', 'per_fess'],
    charges: [
      ch('ring_of_caps', 'plant', 'a ring of pale mushroom caps', 'the fungal belt of the rift shore'),
      ch('giant_cap', 'plant', 'a giant mushroom with a broad cap', 'the giant fungi of the Mushroom Forest'),
    ],
    ornament: 'Proposed until the owner rules on the mycids: only what is known (the forest and its fungi) is drawn; nothing about their rule.',
    forms: { enclave: 'An orle of the surrounding rift coast; nothing about their rule is shown, because nothing is known.' },
    dissent: 'loam dark', breakaway: 'a border gilled of loam dark', restoration: 'ring_of_caps',
    note: 'A ring of white caps on purple (proposed until the owner rules on the mycids).',
  }),
  // --- Demons -------------------------------------------------------------------------------------------------------
  grammar({
    id: 'nether_houses', name: 'Houses of the Nether', people: 'demons', family: 'isolate', language: 'infernal', faith: 'pact_rite', tier: 2, line: 'rent',
    palette: 'hall black #1a0a0a; lava red #c0301a; pact gold #e0a040; sulphur white #e8e0b0; cinder ash #5a5048',
    divisions: ['per_fess', 'per_bend', 'pile', 'plain'],
    charges: [
      ch('kings_seal', 'sigil', 'a five-pointed figure drawn in one unbroken line inside a ring of flame', "the King of Demons' seal over the pacts of every house"),
      ch('pact_fires', 'fire', 'two flames rising side by side', 'the pact-fires of the houses, bound by pacts and not by blood'),
      ch('descending_stair', 'building', 'a stair going down into fire', 'the Halls beneath the burning shore'),
      ch('lava_wave', 'water', 'a wave of lava', 'the Sea of Lava that rings the island'),
    ],
    ornament: 'Original sigils; a pentagram is allowed in a demon sigil (owner, 24 October 2026), never a cross or an inverted cross, and never a trident (a real-world mark).',
    crown: 'the hall-crown: a circlet of flame-points',
    forms: { kingdom: 'The hall-crown over the King\'s seal; the King\'s name is the owner\'s to give and is never shown.' },
    dissent: 'cinder ash', breakaway: 'a border rent of cinder ash', restoration: 'pact_fires',
    note: 'A trident between two flames on black.',
    refused: 'The source card\'s trident is not drawn (a real-world mark); the two flames stay as a charge of the houses.',
  }),
  grammar({
    id: 'veshazel_court', name: 'the Ash Court of Veshazel', people: 'demons', family: 'isolate', language: 'infernal', faith: 'pact_rite', tier: 3, line: 'rent',
    palette: 'ash-hall black #2a1a1a; cinder red #a04020; ash grey #b0b0a0; ember gold #d09040; soot #181414',
    divisions: ['plain', 'per_bend', 'per_fess'],
    charges: [
      ch('ash_flame', 'fire', 'an ash-grey flame', 'the Goldoroth Ash Fields, where ash covers everything and nothing grows'),
      ch('blank_seal', 'token', 'a seal with a blank face', 'the pact-name that only the lord\'s pact knows'),
      ch('ash_hall', 'building', 'a hall of ash', 'the hall raised at Ozmath-Vesh in 4A 1180'),
    ],
    ornament: 'Ash and a blank seal: the court names nobody.',
    forms: { lordship: 'Sworn to no one: no grave base and no crown.' },
    dissent: 'soot', breakaway: 'a border rent of soot', restoration: 'ash_flame',
    note: 'An ash-grey flame on black.',
  }),
  // --- Renamed cultures ---------------------------------------------------------------------------------------------
  grammar({
    id: 'melkgard_warlords', name: 'Melkgard Warlords', people: 'men', family: 'boreal_men', language: 'coldic', faith: 'storm_court', tier: 2, line: 'indented',
    palette: 'forge black #2f2f33; war red #8a2a2a; iron grey #9a9aa0; storm white #dcdcd8; gunmetal #4a4c52',
    divisions: ['plain', 'bordure', 'per_bend', 'per_fess', 'pile', 'per_chevron'],
    charges: [
      ch('spear_sheaf', 'weapon', 'three spears bound in a sheaf', 'the oath-companies that hold the march for the warlord'),
      ch('storm_cloud', 'celestial', 'a storm cloud loosing three bolts', "the Storm Court, whose captains keep their tokens in the Black Gallery"),
      ch('forge_chain', 'token', 'a forged chain', 'the forges in every town'),
      ch('black_gallery', 'landform', 'a dark gallery mouth cut into a cliff', 'the Black Gallery below Minnolomak, cut by Zorak\'s men'),
    ],
    ornament: 'No tower and no hand or gauntlet (another fiction\'s fortress and white hand); storm, iron and black stone only.',
    forms: { warlord: 'The march is held by oath-companies: the charge is a sheaf of their spears; no crown, because the heir is the best sworn man, not the eldest.' },
    dissent: 'gunmetal', breakaway: 'a border indented of gunmetal', restoration: 'storm_cloud',
    note: 'Black or grey, a tower or chain.', aliases: ['isengard_warlords'],
  }),
  grammar({
    id: 'vindael_seafarers', name: 'Vindael Seafarers', people: 'men', family: 'boreal_men', language: 'coldic', faith: 'storm_court', tier: 3, line: 'indented',
    palette: 'sea teal #3f6f74; sail white #d6d2c4; tar brown #6e5238; storm grey #5a6266; gale blue #2c4a5c; amber #c8963a',
    divisions: ['per_bend_sinister', 'plain', 'per_fess', 'base'],
    charges: [
      ch('bellied_sail', 'ship', 'a ship under a bellied sail', "ship-shares and the captains' council"),
      ch('wind_tower', 'building', 'a slender wind-tower hung with cords', 'the wind-towers of the Vindael headlands'),
      ch('storm_petrel', 'bird', 'a storm petrel', 'the bird that rides the storm'),
      ch('wind_knots', 'token', 'a cord tied with three wind-knots', 'the wind-tokens bargained from the Storm Court'),
      ch('fur_bale', 'token', 'a bale of furs bound with cord', 'the furs the Fandan carries down from the interior to the free port at its mouth'),
    ],
    ornament: "Bellied sails and wind-cords; no compass rose (the chart-islanders' charge), no weathercock.",
    forms: {
      council: 'A Council of Captains: no crown; the ship is shown under sail, owned by shares.',
      city_state: 'A free port: the trade charge on a divided field and no crown.',
    },
    dissent: 'storm grey', breakaway: 'a border indented of storm grey', restoration: 'wind_tower',
    note: 'Teal, a ship or wind-rose.', aliases: ['windwaith_seafarers'],
  }),
  grammar({
    id: 'gunwyn_clans', name: 'Gunwyn Clans', people: 'men', family: 'boreal_men', language: 'gunwaithic', faith: 'clan_stones', tier: 1, line: 'indented',
    palette: 'clan madder #6b2f2a; clan green #2f5a4a; torc gold #d4c07a; moor brown #5a4632; slate blue #3a4f66; lime white #e6e2d4',
    divisions: ['per_pale', 'plain', 'per_fess', 'per_bend', 'chief', 'base'],
    charges: [
      ch('stone_ring', 'token', 'a ring of standing stones', 'the Oath-Ring where kings are acclaimed and oaths bind'),
      ch('standing_stone', 'token', 'a single standing stone', 'the Stone of the Grey Ford and the law of the stones'),
      ch('clan_stag', 'beast', 'a stag standing', 'the hunting clans of the hills'),
      ch('wild_boar', 'beast', 'a boar', 'the old feud-clans'),
      ch('torc', 'token', 'an open torc', "the chief's bond to the clan"),
      ch('ring_fort', 'building', 'a round ring-fort seen from above', 'the ring-forts of the hills'),
      ch('clan_hound', 'beast', 'a hound running', 'the war-bands'),
      ch('stone_granary', 'building', 'a round stone granary with a conical roof', "Branorn's granaries below the hills of Faennon, which fed every clan in the famine years"),
      ch('olive_tree', 'tree', 'an olive tree in fruit', "the olives of the West's mildest corner"),
      ch('cape_lantern', 'fire', 'a lantern on a cape', 'the lanterns King Oslin set on the western capes to watch the old approaches'),
    ],
    ornament: 'No tartan, no thistle, no heather and no gyronny of gold and black (all real-world Scottish marks); the clan sett is shown as two clan colours divided per pale.',
    crown: 'the torc-crown: the king\'s crown is an open torc',
    forms: {
      kingdom: 'The torc-crown; the king is acclaimed at a standing stone and bound by the Lawspeaker.',
      clan: "Per pale in the clan pair, the clan's beast across both.",
      lordship: 'A lord of the downs: no crown; the charge of his trust on the clan colours.',
    },
    dissent: 'moor brown', breakaway: 'a border indented of moor brown', restoration: 'standing_stone',
    note: 'Plaid or a stag/stone ring on a clan colour.', aliases: ['gunwaith_clans'],
  }),
  grammar({
    id: 'ember_freeholds', name: 'Ember Coast Freeholders', people: 'men', family: 'ainic_men', language: 'mirolic', faith: 'mourning_dust', tier: 3, line: 'straight',
    palette: 'sand #c9b58a; sea teal #3e6b78; mud brick #8a5a3a; salt white #ece8dc; storm grey #6a6e70; tar black #2b2826',
    divisions: ['plain', 'per_fess', 'per_pale', 'per_bend', 'chief', 'base'],
    charges: [
      ch('gaff_hook', 'weapon', 'a gaff hook', 'the warlord who takes the tolls'),
      ch('flat_boat', 'ship', 'a flat-bottomed boat', 'the coast boats that came back from the north'),
      ch('salt_pan', 'tool', 'a salt-pan with heaped salt', 'the salt trade and the salt laid in every grave'),
      ch('storm_lantern', 'fire', 'a storm lantern', 'a light kept against the storms (canting on Luminor and the lamp-cliffs of Olen)'),
      ch('shore_crab', 'sea_creature', 'a crab', 'the mud shore'),
      ch('sun_hat', 'garment', 'a wide straw hat', 'the salt-pan workers under the sun'),
      ch('storm_house', 'building', 'a low mud-brick house', 'houses built low against the storms'),
      ch('drag_net', 'tool', 'a drag net', 'the inshore fishing'),
    ],
    ornament: 'Low, wide charges hugging the base; nothing names or shows the dead.',
    forms: {
      clan: "A headman's freehold: no crown.",
      warlord: "A warlord's freehold: the charge is a weapon or a hook.",
      league: 'A league of freeholds: the charge tripled, two above one.',
      theocracy: "The lamp-keepers' isle: a metal field and the lamp alone, no label.",
    },
    dissent: 'tar black', breakaway: 'a border of tar black', restoration: 'salt_pan',
    note: 'Sand with a boat or salt-pan.', aliases: ['ember_lands_freeholds'],
  }),
];

// Charges, tinctures, crowns and form texts added to grammars that existed before the roster redesign.
// Lead decision under K68 (31 October 2026, open to the owner's overrule): the goblin and yeti grammars also allow a plain undivided field and a bordure.
const GRAMMAR_ADDITIONS = {
  road_warrens: { divisions: ['plain'] },
  goblin_warrens: { divisions: ['plain', 'bordure'] },
  yeti_clans: { divisions: ['plain', 'bordure'] },
  lake_aenoran: {
    charges: [ch('golden_seal', 'token', 'a hanging gold seal on a cord', 'the Golden Charter a town buys from the court')],
    rename: { change_bell: { name: 'a great bell', meaning: 'the change-bells of the chartered towns and the bell-signalled formations of the Concord of Aen\'s joined kingdoms' } },
  },
  leren_sea_kings: {
    charges: [ch('joined_oars', 'tool', 'two steering oars joined by one ring', 'two coast crowns steered as one'),
      ch('cape_watch', 'building', 'a watch-house on a low cape', 'the forts on the strait cape that the first prince of R\'en built and refused to pay for')],
    patch: { 'charges.two_waves.meaning': 'Lerendor and Lerendor\'s North under one High Crown' },
  },
  winter_crown: { charges: [ch('winter_sheaf', 'plant', 'a sheaf of winter rye bound with a white cord', 'the crown granaries whose bread holds the clans through the long winters')] },
  ice_clans: {
    palette: 'amber #c89a3a',
    charges: [
      ch('gap_cairn', 'landform', 'a cairn in a mountain gap', 'the cairns of the Neridor Gap road, where every western cart pays the cairn-due'),
      ch('road_loaf', 'vessel', 'a round loaf set on a stone', 'the loaf left each Long Dark at the start of the Silent Road'),
      ch('waystation', 'building', 'a turf waystation with a smoking roof', 'the forest stages of the Neck Road kept stocked with fodder and dry wood'),
      ch('fair_pole', 'token', 'a tall fair-pole hung with pelts', 'the snowline fair at Fentene where men, yeti and goblins trade'),
      ch('vale_ewe', 'beast', 'a ewe standing', 'the one valley of the north where sheep do better than reindeer'),
      ch('iron_bloom', 'tool', 'a rough bloom of iron held in tongs', 'the bog-iron and rock-ore of the Orewell lowland'),
      ch('amber_drop', 'token', 'a drop of amber', 'the amber traded on the high road'),
    ],
    crown: 'the tine crown: a circlet of short antler tines',
    forms: {
      kingdom: 'The tine crown over the charge: a king of the clans, judged by his people.',
      lordship: 'A lord of a valley, a coast or a forest: no crown.',
      league: 'The road clans\' charge tripled, two above one.',
      confederation: 'The steadings\' charge tripled, two above one.',
      domain: 'An ordinary valley town: no crown, no mark.',
    },
  },
  free_crowns_north: { forms: { march: 'A margravate: no crown; the beast keeps watch.', principality: 'A prince of a coast: no crown.', confederation: 'The hill crowns\' charge tripled, two above one.', league: 'The lake towns\' charge tripled, two above one.' } },
  girdon_wardens: { divisions: ['base'], charges: [ch('ferry_raft', 'ship', 'a ferry raft on its rope', 'the ferry-wardens who keep every crossing of the peninsula\'s rivers')] },
  western_guilds: { charges: [ch('paired_seals', 'token', 'two wax seals hanging side by side from one cord', 'two consuls chosen each year by the great houses, who seal together')] },
  buldor_companies: { charges: [ch('company_banner', 'token', 'a square company banner on a halberd shaft', 'the Banner-Oath: the banner is the company\'s soul, and a fallen banner ends a company')] },
  iron_clans: {
    charges: [
      ch('fen_reeds', 'plant', 'a bundle of fen reeds', 'the reed-council of the fens'),
      ch('four_fires', 'fire', 'four flames rising from one hearth', 'the Four Fires lit in one hall at Lesderle'),
      ch('charcoal_clamp', 'fire', 'a smoking charcoal clamp', 'the charcoal of the Fonoor Forest'),
    ],
  },
  wild_holds: {
    charges: [ch('swing_gate', 'building', 'a gate hung to swing both ways', 'the toll-king who swings to whichever neighbour pays best')],
    crown: "the toll-king's crown: a circlet hung with small bone charms",
    forms: { kingdom: "The toll-king's crown over the charge.", wild_land: 'No council and no crown: whoever stays through a winter holds the land.' },
  },
  goblin_warrens: {
    people: 'goblins',
    charges: [ch('powder_pouch', 'vessel', 'a bulging powder pouch with a smouldering cord', 'the best powder of the Dark Lands, sold to whoever pays most')],
    crown: null,
    forms: { hold: 'A free warren-hold under a Big Snik: no crown, because the Big Snik is a boss and not the hobgoblin king.' },
  },
  netherborn: {
    charges: [
      ch('brine_cauldron', 'vessel', 'a cauldron of brine over fire', 'salt and sulphur made into black powder'),
      ch('lava_galley', 'ship', 'a galley on a wave of fire', 'the galleys that cross the Sea of Lava, which only demons sail'),
    ],
    ornament: 'Original pact sigils; a pentagram only inside a demon sigil (owner, 24 October 2026, used once, by the Nether), never a cross or an inverted cross, never a goat in a star.',
    forms: { lordship: 'A demon lord shows its pact-charge.', confederation: 'Two crowns of one house: the field divided between them.', sworn: 'Sworn to Nafeher: a narrow base of grave black.' },
  },
  rift_coast_elves: { charges: [ch('archive_scroll', 'tool', 'a rolled scroll tied with a silver cord', 'the Archive: the names, letters and songs of the elves who died in the Alliance\'s wars')] },
  sunhot_western: {
    charges: [
      ch('spindle_skein', 'tool', 'a tall spindle wound with a skein', 'the weavers of the Cape of Elvana'),
      ch('shallows_crane', 'bird', 'a crane wading', 'the shrine of the shallows on Sun Lake and its cranes'),
      ch('seen_wings', 'body_part', 'a pair of wings seen from below', 'the wings seen over the terraces on a still day, kept in the Roll of Wings'),
      ch('uncut_stones', 'token', 'three standing stones of uneven height', 'the standing stones older than any Sunhot record, kept uncut among the quarries'),
    ],
  },
  sunhot_isles: {
    charges: [
      ch('smoking_isle', 'landform', 'an island peak trailing smoke', 'Hol, whose Great Volcano threw ash over every island at once'),
      ch('white_ship', 'ship', 'a tall white ship', 'the white ships of the south and the hulls of Gala\'s court'),
    ],
  },
  caravan_princes: {
    charges: [
      ch('furnace_cone', 'landform', 'a smoking mountain cone', 'the Drak Furnace, under which the forge-houses swore the Furnace Oath'),
      ch('powder_cask', 'vessel', 'a bound powder cask', 'the black powder the East learned at Drak'),
      ch('tapped_trunk', 'tree', 'a tall hardwood trunk with a tapping cup', 'the hardwood and the jungle gum that seals casks and ships\' seams'),
      ch('tithe_bowl', 'vessel', 'a heaped tithe-bowl held up', 'the fire-tithe paid every year without fail'),
      ch('bench_seal', 'token', 'a banker\'s seal hung on a cord', 'the sealed bond of the bench of houses that built the Gold Road from the bronze mines to the sea'),
    ],
  },
  river_kings: {
    faith: 'flood_stair',
    charges: [
      ch('shut_pass', 'landform', 'two mountains with a bar across the pass between them', 'the passes the mine-lords shut against Volgan\'s beaten soldiers in 2A 12'),
      ch('ash_sheaf', 'plant', 'a sheaf of grain grown from black ash', 'the ash-grown grain of the Plutondo Vents'),
      ch('fair_horse', 'beast', 'a horse standing', 'the war-horses and the great horse-fair of Furtonlin'),
    ],
    forms: { principality: 'A river princedom: no crown; the river\'s band.' },
  },
  lake_road_cities: {
    charges: [
      ch('harvest_basket', 'vessel', 'a basket heaped with grain', 'the three years of harvests that bought the towns\' rights, and the granary of the East'),
      ch('market_gate', 'building', 'a market gate', 'the walled market where the Lake Road crosses the Gold Road'),
    ],
    forms: { city_state: 'A free city: no crown.' },
  },
  southern_islanders: {
    charges: [
      ch('wreck_house', 'building', 'a long house on stilts with its door open', 'the house kept for the shipwrecked'),
      ch('rice_terrace', 'landform', 'three stepped rice terraces', 'the rice that grows on every slope that will hold it'),
      ch('storm_drum', 'tool', 'a tall slit drum', 'the drummers who carry the first warning of every storm'),
    ],
    forms: { theocracy: 'Priest-Elders: a metal field and the shrine alone.', moot: 'A moot of heads or elders: no crown.', clan: 'A clan hall: no crown.' },
  },
  chart_islanders: {
    charges: [
      ch('strongroom_key', 'tool', 'a great strong-room key', 'the strong-room where the chart-houses keep their treasury'),
      ch('shore_fire', 'fire', 'a fire on a shore rock', 'the shore-fires the wreck-lord may light or leave dark'),
    ],
    forms: { league: 'The chart-houses\' charge tripled, two above one.', city_state: 'A free isle: no crown.', lordship: 'A wreck-lord: no crown.', moot: 'An isle moot: no crown.', order: 'A sworn order: no crown and no label.' },
  },
  corsair_lords: {
    charges: [
      ch('fishing_kite', 'token', 'a fishing kite on its line', 'the kite-fishers of the windward capes'),
      ch('mountain_cove', 'landform', 'a cove under a mountain', 'the coves no fleet can find without a Benan pilot'),
    ],
    forms: { captaincy: 'A captain\'s haven: no crown.', league: 'The cape-lords\' charge tripled, two above one.' },
  },
  hill_giants: {
    name: 'Hill Giants of Hirolon',
    forms: {
      kingdom: 'A sovereign High Chief: the Eldest Cairn on the arched hill, no crown and no charter border (Hirolon treats with Aenor from outside the Charters under the Cairn Treaty).',
      protector: "Hirolon's ward: a realm under its protection carries a narrow border of cairn brown.",
    },
    dropForms: ['subject'],
  },
  ice_giants: { name: 'Ice Giants of Nivaros', patch: { 'charges.ice_throne.meaning': 'the Ice-Throne of the Frost-King of Nivaros' } },
  hill_kingdom_elves: { forms: { protector: "Herrodon's ward: a realm under its protection carries a narrow border engrailed of night slate." } },
  volcano_clans: { forms: { overlord: 'The Iron Yoke: a tributary hold carries a narrow border raguly of ash grey.', hold: 'A gate-hold: no crown.' } },
  grave_hosts: { forms: { overlord: "Realms sworn to the Dominion carry a narrow base of grave black: they stand on the Dominion's ground." } },
  zols_dead: { forms: { emblem_realm: 'Zol\'s Mistake shows only the sigil of its emblem leader, the Will of Zol, on the void: broken concentric rings, the same sigil as the leader\'s portrait. Nothing states who administers Furviatlon, and nothing of Zol\'s servant appears.' } },
  zilin_pilgrims: { ornamentAppend: ' No lamp with an open flame: a lit lamp with one flame is the arms of Lumae of the twelve.' },
  mirolon_wardens: { forms: { kingdom: 'A High Warden chosen for life over a realm that would never again have kings: no crown.' } },
  troll_tribes: { forms: { kingdom: 'Smash is king of these trolls only: no crown; the boulder is the largest charge.' } },
  kilinti_ents: { forms: { subject: 'The Concord charter border of lamp gold.' } },
  march_folk: { forms: { march: 'A march lordship: the beacon, no crown.' } },
  lake_elves: { forms: { confederation: 'The lake groves\' charge tripled, two above one.' } },
  forest_council_elves: { forms: { forest_domain: 'An elected council of houses over a forest domain: the tree with its roots and the engrailed silver border of elected speakers.' } },
  gala_court: { divisions: ['base'] },
  steppe_rider: { forms: { moot: 'A riders\' moot under a Horse-Lord: the horse-tail standard and the hoof-marks of the host.' } },
};

const PEOPLE_ADD = [
  {
    id: 'tree_people', name: 'Tree-people (the Baelim)', status: 'culture entry exists (baelim): the walking tree-people of the Aenor Forest, separate from the ents (owner, 24 October 2026)', line: 'gnarled',
    palette: [], divisions: ['base', 'plain', 'per_fess'], charges: [],
    ornament: 'Conifers with their roots shown; no broadleaf tree and no rooted line, which are the ents\' marks.',
    rank: 'No crown: the Eldest speaks for the stand.',
    kinship: 'None with the ents: the two tree-peoples never share a forest, and their arms never share a line, a tree or a tincture.',
  },
  {
    id: 'mycids', name: 'Mycids', status: 'culture entry exists (mycid_rings); everything beyond their home in the Mushroom Forest is open in the vault', line: 'gilled',
    palette: [], divisions: ['plain', 'base', 'per_fess'], charges: [],
    ornament: 'Only the forest and its fungi are drawn; nothing about their rule, speech or faith is invented.',
    rank: 'Unknown; an enclave orle of the surrounding rift coast.',
    kinship: 'None declared.',
  },
];
const PEOPLE_PATCH = {
  men: { line: 'by family (Ainic straight with the label, Boreal indented, Eastern stepped, Orran nebuly, Yonic wavy)' },
  dwarves: { status: 'culture entries exist (wall_delvers, west_delvers, north_delvers): the holds of the Great Wall range, the West Lands and the High Mountains (owner, 24 October 2026: dwarves in the great ranges)', kinship: 'Dovetailed lines only; no shared tincture with any elven arms (dwarves dislike elves). Dwarf goblins do not use the dovetail while Q-19 leaves open whether they are dwarves.' },
  small_folk: { status: 'culture entry exists (hearth_folk): Dobbum in the West Lands and its kin in Tirlan under Hirolon\'s ward', kinship: 'Dobbum and Tirlan share the double-arched line and the hearth-folk palette; Tirlan adds Hirolon\'s ward border.' },
  goblins: { status: 'culture entries exist (goblin_warrens of Burnikit, king_warrens of Burrikkrit, spring_warrens of Glimkit)' },
  hobgoblins: { status: 'no culture entry of their own: they guard and haul in every warren, and the king of Burrikkrit is a hobgoblin who rules these warrens only (the grown crown is the king_warrens crown)', rank: 'The grown crown of the king_warrens grammar over the goblin charge; otherwise hobgoblins appear only as a secondary charge in goblin arms.' },
  dwarf_goblins: { status: 'culture entry exists (road_warrens of Mustnom); whether they are dwarves, goblins or their own people is still Q-19' },
  giants: { status: 'culture entries exist (hill_giants of Hirolon, ice_giants of Nivaros, cairn_giants of Hoorunoron)' },
  ogres: { status: 'culture entry exists (ogre_clans), the second people of the moot of The Darks' },
  gnomes: { status: 'culture entry exists (holt_gnomes of Olodor, under the Stendorler quarries near Parim)' },
  yeti: { status: 'culture entries exist (yeti_clans of the shelf, height_yeti of Ghaahu)', kinship: 'Old pacts with the ice clans and Nivaros are shown by sharing a snow-white tincture, not a line.' },
  ents: { kinship: 'The men at the forest edge may add one tincture or charge of their own culture as secondary. The Baelim of the Aenor Forest are not kin and never share a forest with the ents; they draw the gnarled line.' },
  the_dead: { ornament: "No beasts, no plants, no persons. Volgan's realm shows the Gate of Nafeher; Zol's Mistake shows only its emblem leader's sigil, the Will of Zol. Zol's servant never appears." },
  demons: { status: 'culture entries exist (netherborn of the sworn realms, nether_houses of the Nether, veshazel_court of Veshazel); Afrit\'s demons are never shown', ornament: 'Original sigils; a pentagram is allowed in a demon sigil (owner, 24 October 2026), never a cross, an inverted cross or a goat\'s head in a star.' },
};

// ---------------------------------------------------------------------------------------------------------------
// Marks of rank and form
// ---------------------------------------------------------------------------------------------------------------

// The mark a subject carries for its overlord: realm key -> mark.
const OVERLORD_MARKS = {
  aenor: { mark: 'charter_border', culture: 'lake_aenoran', tincture: 'lamp gold', text: 'the charter border: a plain narrow border of lamp gold, the seal-cord of the Charters of Parim', blazon: 'A plain narrow border of lamp gold.' },
  puvulan: { mark: 'grave_base', culture: 'grave_hosts', tincture: 'grave black', text: "a narrow base of grave black: the realm stands on the Dominion's ground", blazon: 'A narrow plain base of grave black.' },
  hirolon: { mark: 'ward_border', culture: 'hill_giants', tincture: 'cairn brown', text: "Hirolon's ward: a narrow border of cairn brown, the giants who guard every way in", blazon: 'A plain narrow border of cairn brown.' },
  goldoroth: { mark: 'yoke_border', culture: 'volcano_clans', tincture: 'ash grey', text: 'the Iron Yoke: a narrow border raguly of ash grey', blazon: 'A narrow border raguly of ash grey.' },
  herrodon: { mark: 'ward_border', culture: 'hill_kingdom_elves', tincture: 'night slate', text: "Herrodon's ward: a narrow border engrailed of night slate", blazon: 'A narrow border engrailed of night slate.' },
};

const CROWN_BLAZON = {
  lake_aenoran: 'Above the charge a circlet of five flame-shaped points in {t}.',
  steppe_rider: 'The charge rests on a spread felt cloth in {t}.',
  isle_houses: 'Above the charge a circlet of five oar-blades in {t}.',
  leren_sea_kings: 'Above the charge a circlet whose points are raised ship prows, in {t}.',
  dondor_brutes: 'Above the charge a plain iron band without points, in {t}.',
  winter_crown: 'Above the charge a circlet of short icicle points in {t}.',
  gunwyn_clans: 'Above the charge an open torc worn as a crown, in {t}.',
  corsair_lords: 'The charge is set within a plain heavy ring of {t}.',
  noris_riders: 'Above the charge a plain circlet in {t}.',
  river_kings: 'Above the charge a low collar-crown in {t}.',
  lake_road_cities: 'Above the charge a circlet of small lantern points in {t}.',
  hill_kingdom_elves: 'Above the charge a circlet of upright leaves in {t}.',
  gala_court: 'Above the charge a plain circlet with no points, in {t}.',
  volcano_clans: 'Above the charge a circlet of upturned tusks in {t}.',
  ice_clans: 'Above the charge a circlet of short antler tines in {t}.',
  wild_holds: 'Above the charge a circlet hung with small bone charms, in {t}.',
  naamis_sea_crown: 'Above the charge a circlet of small wave-crest points in {t}.',
  king_warrens: 'Above the charge a small goblin crown, too small for its wearer, in {t}.',
  nether_houses: 'Above the charge a circlet of flame-points in {t}.',
};

// Forms whose realms show the culture crown (where the culture has one).
const CROWNED_FORMS = new Set(['kingdom']);
// Sylvan council forms that wear the engrailed silver border of elected speakers.
const SYLVAN_SILVER = { forest_council_elves: 'elven silver', hill_kingdom_elves: 'elven silver', lake_elves: 'water silver', pass_wardens: 'dawn silver', rift_coast_elves: 'quay silver', kingdom_forest_elves: 'old silver', roost_keepers: 'keeper silver' };

// ---------------------------------------------------------------------------------------------------------------
// Charge tags used by the cliché and canon checks
// ---------------------------------------------------------------------------------------------------------------

const CHARGE_TAGS = {
  kneeling_camel: ['camel'],
  skull_cairn: ['skull'],
  sun_court: ['sun_disc'],
  noon_door: ['sun_disc'],
  kings_seal: ['pentagram'],
  pentagram_line: ['pentagram'],
  struck_coin: ['disc'],
  reading_lens: ['disc'],
  cut_gem: ['lozenge'],
  broken_rings_sigil: ['zol_emblem'],
  nafeher_gate: ['volgan_gate'],
};

// A god's arms (pantheon.json symbol) reproduced on a national flag would show a named god. These patterns describe
// each god's device in the words a charge would be drawn with.
export const GOD_DEVICES = {
  glernaen: /\beye\b/i,
  sulethe: /\b(bowl|cup|basin)\b[^.]*\bbrimming\b|\bbrimming over\b/i,
  lumae: /\blamp\b(?!-crown)/i,
  maelwen: /\b(waves?|wavy bars?)\b[^.]*\b(beneath|under) a cloud\b/i,
  vaelei: /\bring\b[^.]*\bshoot\b/i,
  rasthel: /\bgate\b[^.]*\bstaff\b|\bstaff\b[^.]*\bgate\b/i,
  kerun: /\b(tower|fort)\b[^.]*\b(on|upon) a (mount|mound|hill|rock|headland|cape)\b/i,
  aurlan: /\bsheaf\b[^.]*\brain\b/i,
  ailtal: /\bstone\b[^.]*\bbound\b|\bbound with a cord\b[^.]*\bstone\b/i,
  irumas: /\banvil\b/i,
  gaelor: /\bfurled\b/i,
  naisa: /\bstar\b/i,
};

// ---------------------------------------------------------------------------------------------------------------
// The forbidden register (spec 1.4 and 1.5). Patterns are matched against blazons, charge names and meanings.
// ---------------------------------------------------------------------------------------------------------------

export const FORBIDDEN = [
  // regional clichés
  { id: 'palm_tree', re: /\bpalms?\b/i, scope: 'all' },
  { id: 'snowflake', re: /\bsnowflakes?\b/i, scope: 'all' },
  { id: 'igloo_scimitar_genie_lamp_pyramid', re: /\b(igloos?|scimitars?|genie|pyramids?)\b/i, scope: 'all' },
  { id: 'wall_motifs', re: /\b(battlements?|crenell\w*|merlons?|ramparts?|brick courses|masonry|walls?)\b/i, scope: 'blazon' },
  // real-world flags and arms
  { id: 'tricolour', re: /\b(tricolou?r|three (equal )?(bands|stripes|bars))\b/i, scope: 'blazon' },
  { id: 'stars_and_stripes', re: /\b(stars?|stripes?|canton)\b/i, scope: 'blazon' },
  { id: 'crescent', re: /\bcrescents?\b/i, scope: 'all' },
  { id: 'cross', re: /\b(cross|crosses|crossed|saltire|cross pattee|maltese)\b/i, scope: 'blazon' },
  { id: 'hammer_sickle_cog', re: /\b(sickle|compasses|cogwheels?|gear ?wheels?)\b/i, scope: 'all' },
  { id: 'national_eagle', re: /\beagles?\b(?! ray)/i, scope: 'all' },
  { id: 'national_beasts', re: /\b(rampant|passant guardant|fleur-de-lis|fleur|maple|cedar|harp|tudor)\b/i, scope: 'all' },
  { id: 'rising_sun', re: /\b(rising sun|sun with a face|rays? to the edges?|red disc)\b/i, scope: 'blazon' },
  { id: 'spoked_wheel', re: /\b(spoked wheel|roof-wheel|eight spokes|twenty-four spokes)\b/i, scope: 'all' },
  { id: 'skull_and_crossbones', re: /\b(crossbones|fouled anchor|compass rose)\b/i, scope: 'all' },
  { id: 'real_patterns', re: /\b(chequy|lozengy|tartan|plaid|thistle|heather|shamrock|clover|rainbow)\b/i, scope: 'blazon' },
  // real religious symbols (the pentagram is allowed in demon sigils only, see checkCanon)
  { id: 'religious', re: /\b(hexagram|star of david|inverted cross|ankh|om\b|dharma|yin|yang|swastika|khanda|torii|lotus|hamsa|triquetra|endless knot|valknut|sun cross|celtic|ichthys|chalice|dove|lamb with|eye of|winged sun)\b/i, scope: 'all' },
  { id: 'pentagram_word', re: /\b(pentagram|pentacle)\b/i, scope: 'all' },
  { id: 'trident', re: /\btridents?\b/i, scope: 'blazon' },
  // other fiction
  { id: 'other_fiction', re: /\b(white tree|lidless|flaming eye|white hand|black tower|white horse|direwolf|kraken|three-headed|round door|golden rose)\b/i, scope: 'all' },
  // K53 additions (25 October 2026): the medieval banner style brings in knotwork, runes and steppe or imperial devices that must stay out
  { id: 'celtic_knotwork', re: /\b(knotwork|triskel\w*|triple spirals?|spiral knots?|celtic)\b/i, scope: 'all' },
  { id: 'norse_runic', re: /\b(futhark|norse|runic|valknut|rune-?stones?)\b/i, scope: 'all' },
  { id: 'tamga', re: /\btamgh?as?\b/i, scope: 'all' },
  { id: 'byzantine_imperial', re: /\b(byzantine|double-headed|double eagle|imperial monograms?|labarum|chi-rho)\b/i, scope: 'all' },
  { id: 'real_heraldry_terms', re: /\b(quartered arms|royal arms|coat of arms of|national arms)\b/i, scope: 'all' },
  // K53 (lead, after the pilots): real-world fields and emblems that look like a national flag or a justice sign
  { id: 'triband_equal_bands', re: /\b(triband|red-white-red|three equal (horizontal |vertical )?bands|three (horizontal |vertical )?bands of equal)\b/i, scope: 'all' },
  { id: 'scales_of_justice', re: /\b(balance|weighing scales?|scales? of justice|honest scales?|justice scales?)\b/i, scope: 'blazon' },
  // lettering
  { id: 'lettering', re: /\b(letters?|lettering|numerals?|runes?|monograms?|mottoe?s?|inscriptions?|inscribed|signature|maker's mark|writing|written on)\b/i, scope: 'blazon' },
  // the owner's emblem
  { id: 'owner_emblem', re: /\b(square frame|crossed diagonals|two diagonals|frame with diagonals)\b/i, scope: 'all' },
  // canon guards
  { id: 'named_person', re: /\b(figure of|portrait of|likeness of)\b/i, scope: 'blazon' },
  { id: 'reserved_glo_sword', re: /\b(glo|blue sword|shards?|green crystal)\b/i, scope: 'blazon' },
  { id: 'wider_world', re: /\b(Erdu|Dunda|Haven|Cerio|Lao)\b/, scope: 'all' },
  { id: 'zol_servant', re: /\b(kusven|kusferl|kourven|kutven|kusven|black oval|sodoloro|šodolôr\S*|the beasts)\b/i, scope: 'all' },
  { id: 'elzon_order', re: /\b(elzon|pale regency)\b/i, scope: 'blazon' },
  { id: 'retired_names', re: /\b(isengard|windwaith|gunwaith(?!ic)|titanos|hiloron|lerendors_north|ember lands|coniferons?|vinocorne)\b/i, scope: 'all' },
];

// The hidden-identity deny-list for the public arms of the Worshipdom and Aenor (spec 1.5).
export const AFRIT_DENY = /\b(eyes?|chains?|ash|ashen|masks?|veils?|serpents?|snakes?|horns?|fire-bird|phoenix|two figures|hidden face|key in a hand|closed door|black flame|afrit|hidden council)\b/i;
// Named persons that never appear as a charge (spec 1.5).
export const NAMED_PERSONS = /\b(zol|volgan|afrit|elzon|horos|eindil|lorien|aen|edran|harion|smash)\b/i;

// ---------------------------------------------------------------------------------------------------------------
// The design table: one row per realm of the roster.
//   d(key, division, [field tinctures], [primary id, tincture, count?], [secondary id, tincture] | null, meaning, options)
// options: on (0 or 1: the field part the primary sits on), borrow ([culture:tincture or culture:charge]),
//          council (true: sylvan engrailed silver border), orle ({realm, tincture}), formNote, canon.
// ---------------------------------------------------------------------------------------------------------------

const d = (key, division, field, primary, secondary, meaning, opts = {}) => ({ key, division, field, primary, secondary, meaning, opts });

export const DESIGNS = [
  // ---- Middle Lands ------------------------------------------------------------------------------------------------
  d('aenor', 'plain', ['lake blue'], ['clasped_hands', 'lamp gold'], null,
    "Aenor bears two hands clasped at the wrist in gold on lake blue, the sign of the Concord of Aen's joined kingdoms, sworn hand to hand, with no label, because the crown of Aen's own realm needs no difference.",
    { canon: 'Public arms of a realm governed in secret by the Hidden Council: the deny-list of 1.5 applies.' }),
  d('safeton', 'base', ['Parim white', 'lake blue'], ['rod_of_office', 'lamp gold'], null,
    'Safeton raises the rod of its Harbour-Master over the lake blue of the Safen mouth: the harbour charter by which its Harbour-Master holds more ships than the crown, sealed into the Concord by the charter border.'),
  d('freshon', 'chief', ['lake blue', 'pale gold'], ['gold_disc', 'lamp gold'], null,
    'Freshon bears the plain gold seal-disc of the Golden Charter it bought in 4A 1731, under a chief of pale gold: a proud spring-town of four states whose loyalty the Golden Court holds by its debts.'),
  d('pazoma', 'per_bend_sinister', ['deep lake', 'pale gold'], ['glass_drops', 'Parim white'], null,
    "Pazoma raises the glass goblet of its glassmakers: the guild-city of the deep bay that has never had a lord and makes the Concord's bells, glass, cloth, paper and books."),
  d('orohaf', 'base', ['foam white', 'sea grey'], ['sea_fire', 'sash red'], null,
    'Orohaf bears three tongues of sea-fire kept lit at the lighthouse-shrine of Borrak, under the low crown the eldest women of the five Isle Houses give their queen for life: the harbour every fleet from the West must pass, where the dead are given to the tide.'),
  d('selen', 'plain', ['wood green'], ['longbow', 'hazel gold'], null,
    'Selen bears a longbow strung upright, the arm of the Quiet Law of the woodland moots that elect a First Warden under their oak: the realm that once hid a king for two winters and still writes its own birth rolls inside the Concord.'),
  d('kingson', 'per_chevron', ['snowline white', 'vale slate'], ['vigil_flame', 'pass gold'], null,
    "Kingson's vigil flame stands between two pale points beneath the snow peaks of the Great Wall of Aenor: the Pass-Lord's charter over the only wheel road through the range, whose tolls are the elves' oldest complaint.",
    { on: 1 }),
  d('klungori_guard', 'pile_reversed', ['lichen green', 'snowline white'], ['pass_spear', 'granite'], null,
    'The Klungori Guard bears a spear upright, its point crowned by a ring, on the rising peak of the South Pass: a garrison company that took land instead of pay to watch the goblin warrens for ever, and whose posts pass from parent to eldest child.'),
  d('hirolon', 'base', ['Grano green', 'deep earth'], ['great_cairn', 'chalk'], null,
    'Hirolon raises the Eldest Cairn on its arched hill over the green of the Grano that its Hilofrim tenants graze: a sovereign giants\' kingdom that treats with Aenor under the Cairn Treaty from outside the Charters and asks only to be left alone.',
    { borrow: ['hilofrim_herders:Grano green'] }),
  d('tirlan', 'base', ['harvest yellow', 'basin green'], ['harvest_stone', 'hearth brown'], null,
    'Tirlan bears the harvest stone its first households raised at the Hilorn mouth, above the double-arched hills of its three valleys, inside the cairn-brown border of the giants who guard every way in.'),
  d('konori', 'plain', ['steppe red'], ['horse_head', 'black felt'], null,
    "Konori's horse's head rests on the white felt on which every king of the Hundreds is lifted at the ford of the Aenar: a riders' kingdom that breeds the Concord's remounts and is paid for them in titles."),
  d('hunhun', 'per_bend', ['felt white', 'steppe red'], ['horsetail_standard', 'black felt'], null,
    'Hunhun bears the horse-tail standard of the midsummer Gathering where its Horse-Lord is chosen, with the hoof-marks of the host beneath it: the first riders to swear to the One Crown, and the largest horse fair in Aoaz.'),
  d('herez', 'per_chevron', ['chalk white', 'palisade brown'], ['beacon', 'beacon red'], null,
    'Herez lights the beacon of the march Edran set across the Grey Hills so that the remnants of Volgan\'s host could never again come up the southern road unseen: the realm that will feel the south first, and the only one that expects to.'),
  d('noleksun', 'base', ['field green', 'march ochre'], ['linked_rings', 'chalk white'], null,
    "Noleksun's three linked rings are the three leagues of free farmers whose eight market towns swore the Oath of Eight Hearths at Saelori: the richest of the frontier dominions, with a Chief Speaker chosen by every hearth.",
    { formNote: 'A confederation of three leagues: the three rings are the members, so the charge is not tripled.' }),
  d('kilinti', 'base', ['deep grove', 'bark umber'], ['eldest_tree', 'moss pale'], null,
    'Kilinti bears the Eldest with its roots spread over a rooted base: a forest whose ent-moot takes years to say a sentence, while the men of its edges keep its accounts and its charter with Parim.'),
  d('fotan', 'per_fess', ['quay white', 'toll blue'], ['toll_ring', 'chain red'], null,
    "Fotan hangs its toll-ring across the strait, as Ostvar's house first did at the narrowest landing: a free toll-lordship that sealed no charter of Parim and can open or shut the shortest crossing between the North Lands and Aenor."),
  d('kunhrim', 'chief', ['delving brown', 'stone grey'], ['rock_arch', 'lamp white'], null,
    "Kunhrim bears the Western Gate cut into the Lunhrim massif under a dovetailed chief of the range's stone: the hold of the Iron Charter, which sells the black powder to the crown and nobody else, and can starve any ruler in Parim of iron."),
  d('burrikkrit', 'base', ['deep moss', 'pit black'], ['truce_fire', 'salvage gold'], ['fire_pot', 'fire-pot orange'],
    'Burrikkrit bears a small truce fire set in a plain circle at its tunnel mouth, with the fire-pot of the tunnel fights: a warren-kingdom held to the Lamp Truce that sells its under-roads in war, under a hobgoblin king who rules only these warrens.'),
  d('olodor', 'per_fess', ['holt green', 'root brown'], ['gold_torc', 'pot gold'], null,
    "Olodor's gold torc stands inside an orle of Aenor's lake blue: hidden holts within a day's walk of Parim, whose village-kings are crowned when their pots are full and whose luck goes to whoever brings them gold freely.",
    { orle: { realm: 'aenor', culture: 'lake_aenoran', tincture: 'lake blue' } }),
  d('dunelaeth', 'plain', ['kingdom green'], ['guide_flame', 'old silver'], null,
    'Dunelaeth bears a single flame on a tall staff in old silver: the guide-lantern its household hangs on the road to the Kingson Pass, the one household that would not leave the forests where its dead lay when its kin went east, and still guides travellers on the wrong side of the mountains.'),
  d('aenor_forest', 'base', ['dew silver', 'stand green'], ['rooted_fir', 'deep shade'], null,
    'The Aenor Forest bears a fir whose roots spread as wide as its crown above a gnarled base: the uncut forest of the Baelim, who have never had a crown, never let a man build among them and never share a forest with the ents.'),
  d('cursed_lands', 'per_fess', ['veil grey', 'char'], ['cord_knot', 'undyed wool'], null,
    'The Cursed Lands bear a cord tied in one knot with its ends hanging free: the Veiled count their years by the ties of the eldest cord and keep every name in its mother\'s line, and no crown since Aen\'s has untied them.'),
  d('bloody_forest', 'per_pale', ['redbark', 'deep bark'], ['stag_attires', 'antler bone'], ['beaded_cord', 'ochre'],
    'The Bloody Forest bears the antlers of the red deer with a beaded cord: the hunting clans of the red-oak forest whose bark bleeds when it is cut, ruled by cord-mothers in peace and by war-chiefs on raids, and never chartered by any king.'),
  // ---- North Lands -------------------------------------------------------------------------------------------------
  d('lerendor', 'plain', ['strait blue'], ['two_waves', 'salt white'], null,
    'Lerendor bears two waves under the ship-crown: the High Crown of Lerendor and Lerendor\'s North, set on one head when Ostrik of the Sonarvik married Runild of Lerendor\'s North, and the strait dues that make it the North\'s counterweight to Parim.'),
  d('eekedor', 'per_fess', ['salt white', 'strait blue'], ['salt_ring', 'deep strait'], null,
    "Eekedor bears a ring of six salt-stones round a bare centre, the salt shared at the table that binds both sides of a quarrel: the council of counting houses that keeps the island's grain and money and holds its Arbitration Court open to any crown that comes to it.",
    { formNote: 'A council of counting houses: the ring of six salt-stones is the one council, so the charge is not tripled.' }),
  d('ren', 'base', ['Leren silver', 'strait blue'], ['cape_watch', 'deep strait'], null,
    "R'en bears the watch-house its first prince built on the strait cape and refused to pay for: a gateway principality that has lived between two masters ever since and leans to Parim."),
  d('keredor_hellekton', 'per_pale', ['strait blue', 'kelp green'], ['joined_oars', 'clasp gold'], null,
    'Keredor-Hellekton impales its two coast crowns and joins their steering oars in one ring, as the Arbitration Court joined Vigda of Keredor and Helmund of Hellekton: a double crown whose court still crowns every heir twice.'),
  d('molot', 'base', ['hearth red', 'peat black'], ['raised_wings', 'fleece white'], null,
    'Molot bears a pair of wings raised high, the crane that stands watch above the marsh: the margraves whose fortress line behind the marsh took the raiders of the Raiding Years, and who still balance Sonargur against Parim so that neither will ever own them.'),
  d('tolvael', 'per_fess', ['fleece white', 'fir green'], ['brown_bear', 'earth brown'], null,
    "Tolvael's bear wears its crown about its neck: the first and proudest of the North's free crowns, its long vale rich in timber, tar and iron, a partner of the High Crown as long as it is asked rather than told."),
  d('tolhon', 'per_bend_sinister', ['fir green', 'straw gold'], ['three_arch_bridge', 'peat black'], null,
    'Tolhon bears a bridge of three round arches, the toll-bridge at Sirtum: an island principality of the Onp coast that lives by its herring ban and its distance from everyone else.'),
  d('heodwa_lands', 'plain', ['fleece white'], ['hill_crown', 'peat black'], ['pact_hammer', 'hearth red'],
    'The Heodwa Lands bear three hill crowns for Heodwa, Nuatax and Agniy, with the dwarves\' hammer of the Hill Pact beneath them: a hill council that every crown of the North knows cannot be fought without fighting Hrakbrund.',
    { borrow: ['north_delvers:pact_hammer'], formNote: 'A confederation of three hill kings: the one crown of the Hill Pact stands for all three, so the charge is not tripled.' }),
  d('hrakbrund', 'pile_reversed', ['high slate', 'snow white'], ['high_gate', 'gate black'], null,
    'Hrakbrund bears its black High Gate on the white peak above Ilmahrim: the dwarves of the High Mountains receive men only at the gate, sell them iron, gold and bombards there, and keep the Hill Pact with the hills below.'),
  d('mina', 'per_chevron', ['earth brown', 'hill grey'], ['notched_crown', 'fleece white'], null,
    'Mina bears the notched crown its king earns by working a season in the Delvings: the sister crown joined to Mine Din by marriage, whose miners and kings are the same people.'),
  d('dolpar', 'base', ['straw gold', 'fir green'], ['lake_fires', 'hearth red'], null,
    "Dolpar bears four fires set in a row above the lake-court's green: a lake league of four walled towns round its deep lake and the market of Parur, which settles its own quarrels and competes with Eekedor for the North's trade.",
    { formNote: 'A league of four walled towns: the four fires are the members, so the charge is not tripled.' }),
  d('mustnom', 'per_bend', ['pack brown', 'road moss'], ['long_staff_ring', 'trade brass'], null,
    "Mustnom bears a long staff with an iron ring at its head, set inside the boss's iron ring: boss-warrens whose people are always half on the road, and whose packmen carry news of a landing faster than any courier."),
  // ---- Cold Lands --------------------------------------------------------------------------------------------------
  d('coldor', 'per_fess', ['frost white', 'winter blue'], ['rye_bundle', 'hearth red'], ['hearth_ring', 'deep night'],
    'Coldor binds a bundle of winter rye with a white cord over the clan fire of the clans that swore to the Winter Queen: the strongest crown of the north and the least warlike, whose power is the bread in the Frost-Hall.'),
  d('melkgard', 'per_bend', ['forge black', 'war red'], ['spear_sheaf', 'storm white'], ['storm_cloud', 'iron grey'],
    "Melkgard bears the bound spears of its oath-companies under the storm cloud of the Storm Court: a warlord's march of black forts that took no crown and left none, and whose men would rather go hungry than eat the queen's bread."),
  d('horidor', 'chief', ['fjord blue', 'snow'], ['gap_stones', 'bone'], ['hearth_ring', 'snow'],
    'Horidor piles three stones in the Neridor Gap road, with Coldor\'s clan fire beneath them: the cairn moot that keeps the Gap open for every traveller who pays the due and has held the Northern Accord faithfully since the White Year.',
    { borrow: ['winter_crown:hearth_ring'] }),
  d('fearno', 'per_chevron', ['ice', 'fjord blue'], ['harpoon_bundle', 'hide brown'], null,
    'Fearno binds three harpoons together with one cord, as the steadings stand together: the Free Steadings that refused both Fandanar and Minnolomak in 4A 1304 and choose a first lord to speak for them for seven winters.',
    { formNote: 'A confederation of three steadings: the three bound harpoons are the members, so the charge is bound together rather than tripled.' }),
  d('austklev', 'plain', ['fjord blue'], ['narwhal', 'snow'], null,
    'Austklev bears the spear-whale whose tusk it sells south and west: a jarldom of whalers that takes a tithe of every whale brought ashore at Vaestia, keeps the harbour boom and stays out of the Cold Rivalry.'),
  d('worlond', 'per_bend_sinister', ['lichen green', 'soot'], ['turf_roof', 'snow'], null,
    'Worlond raises the turf waystation of the Neck Road, its roof smoking with dry wood: the forest lordship the Neck Road Compact made to keep the stages stocked for both crowns.'),
  d('holdon', 'per_pale', ['fjord blue', 'berry red'], ['fair_pole', 'bone'], null,
    'Holdon raises the fair-pole of Fentene hung with three pelts under the tine crown of the king who keeps the snowline fair\'s peace: a coast kingdom whose kings are judged by one thing, whether the fair was good.'),
  d('glimkit', 'base', ['steam green', 'warren dark'], ['three_plumes', 'spring white'], null,
    'Glimkit rises in three plumes of steam from the steaming spring of Drikzig: goblin warrens in the warm valleys of the Coldor Mountains that make the best traps and lamps of the north and pay tax to no crown.'),
  d('xison', 'chief', ['hide brown', 'snow'], ['amber_drop', 'amber', 3], null,
    'Xison bears three drops of amber for the upland clans of Xison, Rion and Yeneldmore, who swore a road league at Akahew to keep the high road stretch by stretch and share its tolls.'),
  d('pertolor', 'per_bend', ['snow', 'berry red'], ['wool_skein', 'soot'], null,
    'Pertolor winds a skein of pale wool on a bar: the one valley of the north where sheep do better than reindeer, a wool-market lordship whose lord is cousin to the Winter Queen and godfather to a Melkgard captain, and means to stay both.'),
  d('omar', 'per_fess', ['ice', 'hide brown'], ['clenched_fist', 'soot'], null,
    'Omar raises a clenched fist: the oath of the one clan on one hill-fort above the border moor that yields to nobody, owing Coldor for the Hill-Fort Winter and Melkgard for the White Year and paying neither.'),
  d('portogalor', 'per_chevron', ['snow', 'soot'], ['ice_axe', 'bone'], null,
    'Portogalor raises an ice-axe upright: sealers descended from the last raider fleet that broke on Melkgard\'s forts, proud of their forebears and careful not to remind Melkgard of them.'),
  d('orewele', 'base', ['snow', 'hide brown'], ['iron_bloom', 'fjord blue'], null,
    "Orewele sets a bloom of raw iron on a ring above the Orewell lowland it digs and sells by the cartload to the western dwarves: a mining clan whose chief came home a lord from the dwarves' gate and keeps both crowns at arm's length."),
  d('kvittumm', 'plain', ['white hills'], ['moot_fire', 'hide red', 3], null,
    'Kvittumm kindles three moot-fires for the reindeer clans of the white hills, who meet each Long Dark at Esrom and keep the toll-peace with the giants together.',
    { canon: 'Nothing on the arms hints at anything but herds, weather and the winter moot.' }),
  d('nivaros', 'base', ['deep ice', 'rime white'], ['ice_sun', 'glacier blue'], null,
    'Nivaros raises a sun with its rays cut in ice over the arched edge of the glacier, the sign of its Frost-King: a few thousand giants who let the clans\' herds pass for the toll and close their heights to any crown that comes in arms.'),
  d('yeti_lands', 'base', ['dusk violet', 'yeti white'], ['cave_arch', 'yeti white'], null,
    "The Yeti Lands raise the dark cave-mouth that answers the Eldest's song: the shelf clans of Haruhu, who sang the hunting truce at Fentene, divide the seal-grounds with the coast and alone can vouch for an envoy to the heights."),
  d('ghaahu', 'per_chevron', ['height white', 'deep rock'], ['song_cave_fire', 'dusk blue'], null,
    'Ghaahu kindles the fire of the song-cave among the Cold Mountains, above the three peaks of the yeti line: a land no crown can reach unless a shelf Eldest vouches for its envoy.'),
  d('vindael', 'per_bend_sinister', ['sea teal', 'sail white'], ['wind_knots', 'tar brown'], null,
    "Vindael ties three sailors' knots in one cord, the shares of its ships, owned by shares and sent south since the captains of Porideon first chose a Speaker to hold the harbour book: a council of whalers and sealers on the ice arm that keeps the coast watch.",
    { formNote: 'A council of shares: the three knots are the three shares, tied in one cord, so the charge is not tripled.' }),
  d('poloto', 'per_fess', ['sail white', 'gale blue'], ['fur_bale', 'amber'], null,
    'Poloto ties a round bale of furs with cord: the fur the Fandan carries down to the free port at its mouth, harbour men who kept Parim\'s old trading post for themselves, wrote their dues into a harbour book and swear to nobody.'),
  // ---- West Lands --------------------------------------------------------------------------------------------------
  d('gunwyn', 'per_pale', ['clan madder', 'clan green'], ['stone_ring', 'torc gold'], null,
    'Gunwyn bears the Oath-Ring of Bulligon under the torc-crown on its two clan colours: a king acclaimed at the stones for life and bound by the Lawspeaker, who signed the Truce of the Grey Ford over the war-thanes\' grumbling.'),
  d('werlendor', 'per_fess', ['lime white', 'moor brown'], ['feud_blade', 'clan madder'], null,
    'Werlendor raises a short broad feud-blade with a ring at its hilt under a torc-crown of its own: the hill kingdom of Caer-Erg, where Emric had himself acclaimed at the Erg stone, whose kings still call themselves the heirs of Bulligon.'),
  d('lambin', 'chief', ['clan green', 'lime white'], ['stone_granary', 'torc gold'], null,
    'Lambin bears the round stone granary Branorn built below the hills to feed every clan in the famine years: the West\'s granary and its neutral ground, where courts that must talk without losing face send their envoys.'),
  d('thenon', 'per_bend', ['slate blue', 'torc gold'], ['peace_cup', 'clan green'], null,
    'Thenon raises a cup of peace held level under the torc-crown: a quiet, rich lowland kingdom that bought its peace with cattle and olives and sends its men to the Ronbo Watch.'),
  d('varnondor', 'plain', ['clan green'], ['sea_watch_flame', 'torc gold'], null,
    'Varnondor raises the watch-flame King Oslin first lit on the western capes to watch the old approaches, under the torc-crown: the sea watch of the West and its natural staging port for any crossing.'),
  d('girdon', 'per_fess', ['river green', 'water blue'], ['ford_stones', 'ford stone'], null,
    'Girdon bears three stepping stones across the ford of Arligon, where the first wardens swore to keep every crossing and judge every quarrel on the river by one law: a commonwealth of wardens, each named for the ford he keeps.'),
  d('wennarith', 'base', ['reed gold', 'water blue'], ['ferry_ring', 'dark pool'], null,
    "Wennarith hangs a ring on its rope above the river: the ferry-wardens of Datidon and Pernogon, who keep every crossing of the peninsula's rivers on the model of Girdon's fords and are in no hurry to join anyone's war."),
  d('saopon', 'quarterly', ['guild green', 'ivory'], ['league_rings', 'guild gold'], null,
    'Saopon ties two rings on one cord, the league the towns of the Kulolo swore on their guild book and kept when they stopped paying Parim, on the quartered colours of a guild city: a league that weighs Aenoran gold against Aenoran tariffs every year.'),
  d('kradlon', 'quarterly', ['guild wine', 'ivory'], ['fuse_flame', 'guild gold'], null,
    'Kradlon kindles a fuse-flame for the workshops that bought the dwarves\' powder secret and make powder-pieces and bombards for anyone who pays: the first guild port of the West, the old settler harbour of Bolbin.'),
  d('corogon', 'quarterly', ['guild blue', 'guild gold'], ['paired_seals', 'vermilion'], null,
    'Corogon bears two seals hanging from one cord for the two consuls its great merchant houses choose each year: the consulate of Oslodon, the first Aenoran settlement of the western coast, which fears the corsairs and resents Parim\'s tariffs.'),
  d('buldor', 'bordure', ['steel blue', 'livery red'], ['halberd', 'buff'], ['seal_ring', 'olive'],
    "Buldor raises a halberd, which is a company's soul, within the livery border of its companies and above a signet ring on the sealed contract-book: a company state at the crossroads of Toples that hires its banners and gunners to the highest bidder."),
  d('dobbum', 'base', ['basin green', 'hedge dark'], ['famine_bread', 'harvest yellow'], null,
    'Dobbum raises a round loaf on a stand above the double-arched hills of its green basin: the small folk who carried grain to starving clansmen and were given the Ronbo Watch in return, so that evil has not entered the basin since.'),
  d('brundahrim', 'chief', ['hold dark', 'rim gold'], ['forge_flame', 'forge red'], null,
    'Brundahrim bears the forge-flame of Hrennost, the fire-hold, under a dovetailed chief of gold: dwarves of the Herlitz and Dusty Mountains who sell gold and powder-pieces at the Outer Gate to whoever wins their favour and keep the small folk\'s high passes shut.'),
  d('gromkerm', 'per_fess', ['grey stone', 'iron black'], ['outer_gate', 'rim gold'], ['bombard', 'ash white'],
    'Gromkerm bears the shut Outer Gate above the Kulolo with a bombard beneath it: the old hold of Hrunost, whose gate-wardens sell iron and siege bombards and let no armed company within a bowshot of the gate.'),
  // ---- Dark Lands --------------------------------------------------------------------------------------------------
  d('goldoroth', 'plain', ['obsidian'], ['undying_fire', 'lava red'], null,
    'Goldoroth raises an undying fire under the tusk crown of the Warking whom the moot of four clan blocs acclaims: the forge-kingdom of Cocanoor that wants the whole Dark Lands, casts bombards with goblin powder and binds its tributaries with the Iron Yoke.'),
  d('dark_gate', 'per_chevron', ['ember orange', 'ash black'], ['cleft_gate', 'sulphur'], null,
    "The Dark Gate raises a gate split down its middle by the one narrow pass from the Goldoroth arm to the south, inside the raguly border of the Iron Yoke: a gate-hold that has tolled every caravan since Zugash built his fort at Doldes and pays its tribute to the Warking."),
  d('dondor', 'plain', ['hold black'], ['iron_fist', 'ash'], ['hearth_iron', 'bone'],
    "Dondor raises a clenched iron fist above the hearth-iron, under the plain iron band: descendants of an Aenoran garrison who took their orc neighbours' insult for a boast and lead the Dark Sea Accord."),
  d('blackton', 'per_fess', ['hold black', 'iron grey'], ['sail_bar', 'bone'], null,
    "Blackton hangs a single square sail from a bar over Dondor's black and the strait's blue: five walled harbour towns of mixed Dondric and Leren blood that sell Dondor's iron to the North, want no king and argue about their charter.",
    { formNote: 'A league of five harbour towns: the five towns are the members, so the single sail is not tripled.' }),
  d('belonton', 'per_fess', ['salt teal', 'tar'], ['salt_cone', 'salt white', 3], null,
    'Belonton bears three cones of the Salt Tithe: the sea-orc confederacy sworn at Notle so that its ships would raid others rather than each other, under a Sea-Chief chosen by the voyages he has won.'),
  d('bordon', 'chief', ['coal', 'steel'], ['toll_gate_bar', 'forge orange'], null,
    "Bordon bears the toll-bar of the Black Road: a hold that turned the barracks of the Buried Wars into caravan inns, takes Volgan's gifts and Goldoroth's threats with the same grin and knows exactly where the Troll Forest begins."),
  d('dreson', 'base', ['slag green', 'coal'], ['reed_crown', 'steel'], null,
    'Dreson binds the reeds of the fens where the orcs who would not fight for the Necromancer built a hall on black piles: a fen-hold under a reed-council that lives on eels, peat and bog-iron and swallows the armies that come after it.'),
  d('dulundur', 'plain', ['rust'], ['four_fires', 'steel'], ['moot_ring', 'coal'],
    'Dulundur bears the four fires lit in one hall at Lesderle, with the ring of the Free Moot it hosts against the Iron Yoke: four valleys that each keep their own chief and their own fire, and burn them together.',
    { formNote: 'A confederation of four: the four fires are the members, so the charge is not tripled.' }),
  d('the_darks', 'per_pale', ['coal', 'iron'], ['moot_ring', 'steel'], null,
    "The Darks raise the moot ring where Grimduth carried the haunch of meat into the ogres' caves instead of spears in the hard winter of 4A 1222: one moot of the forest orc holds and the ogre clans at Notdertu."),
  d('skragdurg', 'pile_reversed', ['slag green', 'steel'], ['smoulder', 'coal'], null,
    'Skragdurg kindles a low smouldering fire in the Fonoor Forest: the forest-hold that sells timber and charcoal to every shipwright on the straits, whatever master they serve.'),
  d('britadon', 'per_bend', ['slag green', 'coal'], ['forge_hammer', 'steel'], null,
    'Britadon raises a war-hammer head above the iron hills that Bredesk of the Brakgul made one hold with the headland of Beriath: a hold that sells its iron by sea, sits at the Free Moot and watches Goldoroth\'s border.'),
  d('dun', 'plain', ['hide brown'], ['swing_gate', 'bone'], null,
    "Dun bears a gate hung to swing both ways under the toll-king's crown of bone charms: the crown of the Dun Sea's mouth that swings to whichever neighbour pays best, which has made it the least trusted in the Dark Lands."),
  d('wild_lands', 'base', ['lucky ochre', 'peat'], ['casting_bones', 'peat'], null,
    'The Wild Lands bear the casting bones that decide whose winter it is: a moor without a council where broken clans go when no hold will have them, held by whoever stays through a winter and contested by everyone else.'),
  d('troll_forest', 'per_fess', ['troll moss', 'bog black'], ['boulder', 'stone grey'], ['troll_club', 'bone'],
    'The Troll Forest bears the great boulder of its king above the club that smashes camps by night: the forest of the troll king of these trolls only, which leaves alone the realms that pay the troll silver.'),
  d('hoorunoron', 'base', ['giant-forest green', 'forest earth'], ['three_stone_cairn', 'lichen white'], null,
    "Hoorunoron bears a cairn of three great stones inside an orle of Dondor's iron grey: a few hundred giants behind the Borderline of Giants who never attack first and carry trespassers back over the cairn-line, one under each arm.",
    { orle: { realm: 'dondor', culture: 'dondor_brutes', tincture: 'iron grey' } }),
  d('burnikit', 'per_fess', ['rust', 'cave black'], ['warren_fuse', 'hoard gold'], null,
    'Burnikit kindles a fuse-flame for the best powder-makers of the Dark Lands: free warrens under a Big Snik, the loudest and cleverest boss, chosen first to lie to the Necromancer\'s recruiters and since to sell to whoever pays most.'),
  d('veshazel', 'plain', ['ash-hall black'], ['ash_flame', 'ash grey'], ['blank_seal', 'ember gold'],
    'Veshazel bears an ash-grey flame above a blank seal for the pact-name only its pact knows: a demon lordship on the Goldoroth Ash Fields, sworn to neither Volgan nor Goldoroth, shunned by its neighbours and courted by the Southern Dominion.'),
  // ---- Ember Lands -------------------------------------------------------------------------------------------------
  d('puvulan', 'plain', ['grave black'], ['nafeher_gate', 'bone'], ['ring_of_names', 'ember red'],
    "Puvulan shows the Gate of Nafeher within the ring of names its necromantic orders keep: the Dominion of the dust fields, whose arms show the gate and never the Great Spirit who raised it.",
    { canon: "Volgan's realm shows the Gate of Nafeher; no figure of Volgan." }),
  d('mirolon', 'plain', ['night blue'], ['watch_heron', 'heron white'], null,
    'Mirolon bears the heron that stands watch on one leg by its lake: a free warden-realm whose High Warden is chosen for life, whose beacon towers are manned every night, and which alone takes the signs from the south seriously.'),
  d('khorvrath', 'pile', ['ash black', 'nether red'], ['pact_horn', 'ember gold'], null,
    'Khorvrath bears the pact-horn of the horn-hold of Khorvazel on the grave-black ground of the Dominion: the horned court of the Southern Dominion, which keeps its oath to Nafeher while Volgan\'s strength stands and still demands the thralls who fled to Olen.'),
  d('dolon', 'per_fess', ['obsidian', 'nether red'], ['maw_fire', 'ember gold'], null,
    'Dolon raises a fire over the sulphur Maw, where the salt of its coast and the sulphur of the Maw make the Dominion\'s black powder: the forge of the Southern Dominion, whose laws are written in salt so that the sea can wash away any oath its queen regrets.'),
  d('nezer', 'per_bend', ['nether red', 'ash black'], ['burning_gate', 'ash white'], null,
    'Nezer raises a broken gate with fire through its arch, on a field divided between its two crowns of one family and standing on the Dominion\'s grave-black ground: the largest of the sworn realms and the keeper of the broken Burning Gate on its coast.',
    { formNote: 'A confederacy of two crowns of one family: the field is divided between them instead of tripling the charge.' }),
  d('nether', 'per_fess', ['hall black', 'lava red'], ['kings_seal', 'pact gold'], null,
    "The Nether bears the King of Demons' seal, a five-pointed figure drawn in one unbroken line inside a ring of fire, under the hall-crown: the court beneath the volcanic island whose pacts bind every house and which sells companies to Nafeher only by bargain.",
    { canon: 'The pentagram is allowed in a demon sigil (owner, 24 October 2026); the King\'s name is never shown.' }),
  d('halia', 'per_fess', ['sand', 'sea teal'], ['salt_stones', 'tar black'], null,
    'Halia sets three white salt-stones in a row for the freeholds of the salt coast that swore at Halon to pay one toll as one league, so that no freehold could be squeezed alone: salt-makers who pay Nafeher for silence and remember the thief only in their taverns.',
    { formNote: 'A league of three salt-pans: the three salt-stones are the three pans, so the charge is one row rather than tripled.' }),
  d('nan', 'per_bend', ['tar black', 'sand'], ['tolling_spear', 'salt white'], null,
    'Nan raises a spear with a hooked head, the mark of the warlord who takes its tolls: the realm of the strongest captain of the Nan Mountains, who lends the Dominion its storm-pilots and sells the same pilots to anyone who pays more.'),
  d('olen', 'chief', ['salt white', 'storm grey'], ['holy_breeze_flame', 'tar black'], null,
    'Olen raises a flame standing alone on a cliff-top, the light the Holy Breeze kept lit for a whole winter: a shrine-realm of lamp-keepers whose lights are the first a ship sees coming out of the storm belt, and who shelter whoever reaches them.'),
  // ---- Zol's Mistake -----------------------------------------------------------------------------------------------
  d('zols_mistake', 'plain', ['void black'], ['broken_rings_sigil', 'cold grey'], null,
    "Zol's Mistake shows only the sigil of its emblem leader, the Will of Zol: broken concentric rings on the void, which say nothing of who administers Furviatlon.",
    { canon: 'Emblem realm: the Will of Zol alone; nothing of Zol, of his servant or of the black isles appears.' }),
  // ---- Magical Lands -----------------------------------------------------------------------------------------------
  d('worshipdom', 'plain', ['hostel white'], ['offered_loaf', 'bread brown'], null,
    'The Worshipdom shows only its public charity: a hand offering a loaf a hand offering a loaf, the hostels of the Deliverer that shelter pilgrims from every land and carry letters for every court.',
    { canon: 'Public arms of a secret realm: nothing may reveal Afrit or the Hidden Council (deny-list of 1.5), and no lamp with an open flame (the arms of Lumae of the twelve).' }),
  d('magical_forest', 'per_fess', ['leaf green', 'deep wood'], ['living_tree', 'elven silver'], ['precedent_book', 'moon white'],
    'The Magical Forest bears the tree of the Singing Grove, which its houses say was sung before it grew, above the ring of seven rings its elected council keeps for its precedents, inside the silver border of elected speakers: the oldest realm of the elves, never conquered and the keeper of the Refusal.',
    { council: true }),
  d('herrodon', 'per_bend', ['hill green', 'night slate'], ['hall_stair', 'elven silver'], ['hill_road', 'scale gold'],
    'Herrodon bears the stair of the hall where each queen is acclaimed by the houses of the hills, under the leaf circlet, with the road west to the lost kin it still remembers: a hill queenship that keeps the Boundary Groves feud with Andos Enda alive by ceremony.',
    { borrow: ['kingdom_forest_elves:silver_road'] }),
  d('andos_enda', 'per_fess', ['lake teal', 'deep blue'], ['glass_boat', 'water silver', 3], null,
    'Andos Enda bears three glass boats for the lake groves that swore the Weir Compact to share the water: a federation whose boats carry the letters between Sonargur and the elven realms and whose Water-Court judges at the weir.'),
  d('nolorim', 'per_chevron', ['snow white', 'pass grey-green'], ['mountain_pass', 'pine'], null,
    'Nolorim bears the pass under the snow that its families have kept for centuries, each counting every pilgrim, merchant and stranger who crosses: the pass-wardenship sworn when Volgan\'s fires burned below the Nolorim East Pass, each family to one post, so that nothing of his would come up through the heights.'),
  d('lccimio', 'per_bend', ['rift teal', 'night sea'], ['lantern_tower', 'quay silver'], null,
    'Lccimio bears the lantern tower of its rift-coast quays inside the silver border of its council of elder houses: the elves who know the eastern courts better than any alive, and who will be the first to meet an eastern landing.',
    { council: true }),
  d('eldafaen', 'plain', ['night sea'], ['silver_circlet', 'quay silver'], null,
    "Eldafaen raises a silver circlet of five points over the night sea: the Archive, where a house of loremasters keeps the names, letters and songs of the elves who died in the Alliance's wars, so that no one will again ask the elves to march without reading them first."),
  d('yavieth', 'plain', ['keeper silver'], ['roost_flame', 'roost slate'], ['gift_scale', 'dragon red'],
    'Yavieth raises three flames in a row over the spurs of Dragon Mountain, with a shed dragon scale beneath them: a fellowship without a ruler whose roost-keepers go up to the roosts to listen rather than to command, and trade the shed scales at Kingson.'),
  d('teste', 'chief', ['vale green', 'straw'], ['plough_furrow', 'linen white'], null,
    'Teste bears the ploughed furrow of the one fertile vale under the Herrodon rim, within the border of the hall that protects it: a commune of men descended from Third Age refugees, who feed Herrodon and Andos Enda and choose their Reeve at the harvest moot.'),
  d('luv_zhise', 'per_pale', ['narrows teal', 'quay silver'], ['rift_ferry', 'ferry plum'], null,
    'Luv-zhise bears the ferry crossing between the two shores of the Rift Narrows, its far shore in the silver of the elves who chartered the quay-houses: a free port that lives on the crossing to the East and sides with whoever holds it.',
    { borrow: ['rift_coast_elves:quay silver'] }),
  d('mushroom_forest', 'plain', ['spore purple'], ['ring_of_caps', 'cap cream'], null,
    'The Mushroom Forest bears a ring of pale mushroom caps inside an orle of the rift coast\'s teal: the land of the mycids along the rift shore, a people that trades through Luv-zhise and whose ways of rule nobody outside the forest knows.',
    { orle: { realm: 'lccimio', culture: 'rift_coast_elves', tincture: 'rift teal' }, canon: 'Proposed until the owner rules on the mycids: nothing about their rule is drawn.' }),
  // ---- Lands of the Sun --------------------------------------------------------------------------------------------
  d('gala', 'base', ['court white', 'shade green'], ['mirror_spring', 'rain blue'], null,
    'Gala bears the Mirror of First Rain under the endless circlet of King Lorien, above the green shore its Sunfolk villages farm: the oldest elven court of Aoaz, courteous to Aenor and distrustful of kings who turn victories into crowns.',
    { borrow: ['goodin_sunfolk:shade green'] }),
  d('lands_of_light', 'per_fess', ['sanctuary white', 'noon gold'], ['noon_door', 'flame orange'], null,
    'The Lands of Light bear the noon-door that only they may bear: the sanctuaries of the eastern lowland that chose one Radiant Speaker to share out the water of Sun Lake in the drought of 1A 840, and that still chair the Noon Council.'),
  d('elvana', 'per_fess', ['sanctuary white', 'shade blue'], ['spindle_skein', 'deep red'], null,
    'Elvana bears the spindle of the weavers of its cape sanctuary: a small, gentle house of weavers and healers that chose its own Speaker rather than answer to Eldoga and keeps its one quarrel in the world with Igara.'),
  d('igara', 'per_pale', ['sanctuary gold', 'sanctuary white'], ['shallows_reeds', 'shade blue'], null,
    'Igara binds three reeds at the head, the sign of its shrine of the shallows on Sun Lake: the smallest sanctuary realm, which chose its own Speaker sixty-two years after Elvana and measures its standing at the Noon Council by how often it can outvote it.'),
  d('yeni_alang', 'pile_reversed', ['sanctuary white', 'shade blue'], ['seen_wings', 'sanctuary white'], null,
    'Yeni Alang bears a pair of wings seen from below on its rising terrace: the house of sky-watchers founded when one of them saw wings over the terraces on a still day, which still adds a line to the Roll of Wings a few times in a good year.'),
  d('tor_luni', 'per_bend', ['sanctuary gold', 'deep red'], ['uncut_stones', 'sanctuary white'], null,
    'Tor Luni bears three standing stones of uneven height, older than any Sunhot record and kept uncut among the quarries: the sanctuary of the Keeper of the Stones, whose white stone builds half the realms of the region.'),
  d('ihuy', 'per_fess', ['isle gold', 'isle teal'], ['smoking_isle', 'deep lagoon'], null,
    'Ihuy bears Hol, the isle whose Great Volcano threw ash over every island at once and made one council of the seven isle Speakers: a council of sailors, pearl-farmers and fishers that watches the smoke of Hol.'),
  d('soyano', 'plain', ['isle teal'], ['white_ship', 'terrace white'], null,
    'Soyano bears the white ship of its shipwrights: the Archipelago Council of the northern isles under a Tide-Speaker chosen at the turn of the tide, which builds the white ships of the south and the hulls of Gala\'s court.'),
  d('goodin', 'plain', ['shade green'], ['shade_tree', 'linen'], null,
    'Goodin bears the shade tree of its guest-towns under the rayonny chief of its Sunhot patrons: Sunfolk steadings that govern themselves under elders, raise levies freely and are the strongest arm of the Noon Council, where they sit as guests.'),
  d('god_forest', 'base', ['god-wood green', 'shadow'], ['branch_gate', 'glade gold'], null,
    'The God Forest bears a closed gate of woven branches: the household of Keepers who were there when the first sanctuary was built, who close their wood to everyone and say nothing at all.',
    { canon: 'No sun and no Sunhot or Gala line: the Keepers\' kin is open.' }),
  // ---- East Lands --------------------------------------------------------------------------------------------------
  d('noris', 'plain', ['indigo'], ['well_head', 'well ochre'], null,
    'Noris raises the well-head of the Seven Wells of Furvior under the well-crown of the king the well-lords choose from one line: the camel-kingship of the northern desert and the Salt Road, whose tribes he leads in war.'),
  d('naamis', 'per_fess', ['coast white', 'naam blue'], ['twin_harbour', 'sail ochre'], null,
    'Naamis bears the two harbour moles of Hacsen and Vigodor that one marriage joined under the sea-crown: a sea crown whose ships carry the Salt Road\'s goods to the rift and whose policy rests on the Noris Treaty.'),
  d('woqood', 'chief', ['seal water', 'snow coast'], ['woqood_harpoon', 'snow coast', 3], null,
    'Woqood bears three harpoons for the boat clans that swore the moot of Pehami to share the seal grounds without blood under a Harpoon-Speaker: sealers of the snow coast who stay out of every eastern coalition unless someone attacks them.'),
  d('orato', 'per_pale', ['isle blue', 'boat brown'], ['net_ring', 'net white'], null,
    'Orato impales its two isles of Orato and Fladev, joined by marriage, with the ring of net-floats its families sell to the Naamis ship-masters: a lordship of the boats facing the Kusmeel under one lord who built the stone harbour at Nodoqood.'),
  d('stabilo', 'plain', ['caravan red'], ['bench_seal', 'linen'], null,
    "Stabilo bears the sealed bond of the bench of houses that built the Gold Road from the bronze mines to the sea, under its Prince of the Scales: the strongest military purse of the East, whose bond every caravan on the road is sealed by and Noris's rival there."),
  d('drak', 'per_fess', ['bronze', 'caravan red'], ['furnace_cone', 'ink'], ['powder_cask', 'linen'],
    'Drak bears the smoking cone of the Drak Furnace under which its forge-houses swore the Furnace Oath, with the powder cask whose recipe its forge-masters guard: the place where the East learned black powder.'),
  d('mostok', 'chief', ['market green', 'bronze'], ['nested_weights', 'linen'], null,
    'Mostok bears the nested weights of the weighers who built the caravanserai of Cereosa to settle the caravans\' quarrels: a junction city of inns and weigh-houses that knows its freedom lasts exactly as long as Noris and Stabilo distrust each other.'),
  d('azano', 'per_bend', ['linen', 'market green'], ['struck_coin', 'bronze'], null,
    'Azano bears the struck coin with which its house bought the charter of Ceralon outright: a city that takes its master\'s name, independent by charter rather than by arms, whose ledgers record loans to half the courts of the East.'),
  d('obmi', 'base', ['colonnade stone', 'market green'], ['tapped_trunk', 'seal wax'], null,
    'Obmi bears the hardwood trunk tapped for the jungle gum that seals casks and ships\' seams: the factors\' city at the edge of the Obmi Jungle, which lives by the Stabilo Pact\'s need for casks and fears the jungle\'s fevers more than any army.'),
  d('pornivior', 'quarterly', ['bronze', 'ink'], ['tithe_bowl', 'linen'], null,
    'Pornivior bears the heaped tithe-bowl of the fire-tithe it pays the mountain every year without fail: the waystation city of Nerhuus below Mount Ergo, whose people say a devil once took a whole caravan and left only the scales.'),
  d('alerhia', 'plain', ['river gold'], ['temple_stair', 'lapis'], null,
    'Alerhia bears the stair-temple raised above the flood-line so that the River and the Kings Below would each have a place, under the river-diadem and over the river\'s band: an old crown in its own right at the end of the Gold Road, rich in grain and scribes.'),
  d('erco', 'per_bend', ['lapis', 'linen white'], ['shut_pass', 'river gold'], null,
    'Erco bears the barred pass between two mountains that its mine-lords shut in 2A 12 against Volgan\'s beaten soldiers, under the river-diadem: a mountain kingdom of rich mines and seven manned forts that pays the fire-tithe to the mountain every spring.'),
  d('plutondo', 'base', ['flood silt', 'river blue'], ['ash_sheaf', 'linen white'], null,
    'Plutondo bears the sheaf of grain grown in the ash of the Plutondo Vents: a princedom of the warm southern valley, rich in ash-grown grain and ore and deep in Stabilo\'s ledgers since the Vent Year.'),
  d('delbiz', 'per_chevron', ['river gold', 'reed green'], ['fair_horse', 'linen white'], null,
    'Delbiz bears a horse of the great fair at Furtonlin under the river-diadem: the grassland kingdom whose horse-lords swore to keep their horses and their grass for themselves when Alerhia could no longer pay them.'),
  d('ostoroth', 'per_fess', ['deep water', 'lake silver-blue'], ['quay_lantern', 'lantern amber'], null,
    'Ostoroth bears the lantern of the shrine on the water at Ohitus under the lantern-crown, because the highland lords made the lord of Ohitus king so that the shrine would always be in a king\'s keeping: the kingdom of the Lake Road that keeps the Lantern Peace with Mora.'),
  d('mora', 'per_fess', ['quay white', 'lake silver-blue'], ['harvest_basket', 'lantern amber'], null,
    'Mora bears the heap of grain in a shallow dish with which the fishers and farmers of Gonnois bought their lord\'s rights: the granary of the East, which has no king and wants none, and whose fish-hall council meets under the heap.'),
  d('kersian', 'plain', ['lake silver-blue'], ['market_gate', 'quay white'], null,
    'Kersian bears the gate of the walled market that Aenoran exiles and Alerhic lake traders built where the Lake Road would cross the Gold Road: a free city, rich, small and anxious, kept free by the rivalry of two powers.'),
  d('rhachia', 'per_chevron', ['kiln ochre', 'red clay'], ['kiln', 'umber'], null,
    'Rhachia raises the kiln of the kiln-mothers who opened the gates of Pordoce in 4A 1719 and elected a tribune instead of a king: a poor, proud commonwealth watched by the deposed king\'s heir.'),
  // ---- South Lands -------------------------------------------------------------------------------------------------
  d('miaed', 'per_chevron', ['sand white', 'gorge red'], ['pass_fire', 'fire gold'], null,
    'Miaed bears the fire the pass-lords keep in the Hardtmuth passes for the spirits of the high road: a lordship of pass-forts that elects the Lord of Erdozan and sells passage to Noris and Stabilo alike.',
    { on: 1 }),
  d('wahatud', 'plain', ['oasis green'], ['four_wells', 'dune'], null,
    'Wahatud bears the four wells of the Well-Moot that the surviving clan-mothers swore at Biir-Raab after the war of the poisoned wells: a league that never joins a war and always offers water to refugees.',
    { formNote: 'A league of four strings of wells: the four wells are the members, so the charge is not tripled.' }),
  // ---- Islands of the South ----------------------------------------------------------------------------------------
  d('enhis_is_rond', 'plain', ['coral sand'], ['reef_shrine', 'deep reef'], null,
    'Enhis Is Rond bears the shrine beneath the tide that the Rising Tide drowned, whose Priest-Elders rule the centre of the Great Isle and repeat in its rites a name they do not understand.'),
  d('howan', 'per_fess', ['coral sand', 'lagoon turquoise'], ['wreck_house', 'coral red'], null,
    'Howan bears the house on stilts kept open for the shipwrecked: a harbour moot of terrace-heads on the River Tich, the only river of note in the islands, whose divers sell pearls for iron.'),
  d('verde', 'base', ['coral sand', 'frond green'], ['woven_sail', 'lava black'], null,
    'Verde bears the woven sail of the canoes cut from its western hills and mangroves: a clan hall of timber-folk and navigators who sell hull-timber to Aenor Isle and pilots to anyone.'),
  d('nara', 'chief', ['deep reef', 'coral sand'], ['fish_trap', 'coral sand'], null,
    'Nara bears the fish trap its villages lift only by day: an elders\' moot of fishers on the long island Ancha who will not cross the Night Reef after dark for anyone.'),
  d('yongyong', 'per_chevron', ['coral sand', 'deep reef'], ['shell_necklace', 'coral red'], null,
    'Yongyong bears a necklace of the shell its villages carve: the ring-council of the villages round the Yong lagoon, which all carry one name and burned three of their own in the Year of the Red Wind before they made peace round one ring.'),
  d('kamu_lamo', 'plain', ['deep reef'], ['wave_tally', 'coral sand'], null,
    'Kamu Lamo bears the spiral conch of the tally-caves: the deep isle of the oldest tally-caves of the south, where the dead have been counted as waves on the cave walls since before any Aenoran sailor saw the arcs.'),
  d('kea', 'pile_reversed', ['lagoon turquoise', 'coral sand'], ['rice_terrace', 'frond green'], null,
    'Kea bears three stepped rice terraces on the rising slope: the terrace council of Kea, Agla and the Rice Islands, which shares its scarce water by council and sends rice to any island in a bad year.'),
  d('sidea', 'per_pale', ['lagoon turquoise', 'deep reef'], ['storm_drum', 'coral sand'], null,
    'Sidea bears the slit drum on which its drummers carry the first warning of every storm to the Great Isle: a cluster of islets that chose one elder in the storm year that cut them off for a whole season.'),
  // ---- Triton's Islands --------------------------------------------------------------------------------------------
  d('adel', 'per_fess', ['chart paper', 'chart teal'], ['rolled_chart', 'ink', 3], null,
    'Adel bears three rolled charts for the chart-houses that agreed in 4A 388 to copy every chart in one house at Sanderz: the chart-house league whose Chart Hall decides which crown gets the newest chart.'),
  d('raerby', 'chief', ['ink', 'chart paper'], ['reef_buoy', 'reef coral'], null,
    'Raerby bears the buoy that marks the banks it mediates: the broker-captains of Ese, who grew rich lending ships and settling others\' quarrels for a fee and who watch Nondondor\'s fleet more closely than anyone.'),
  d('pollos', 'plain', ['chart teal'], ['strongroom_key', 'sand gold'], null,
    'Pollos bears the key of the strong-room where the chart-houses keep their treasury: the market isle of Havnai, whose guild-masters wrote the market law every buyer and seller swears to, and who sell everything to everyone.'),
  d('fineger', 'base', ['chart paper', 'reef coral'], ['pilot_lantern', 'ink'], null,
    "Fineger bears the pilot's lantern of the cold northern isles, whose pilots know waters only they can read: kelp-farmers and shepherds through whom any fleet bound north must pass."),
  d('halenor', 'pile_reversed', ['chart teal', 'sand gold'], ['shore_fire', 'reef coral'], null,
    'Halenor bears the fire on the shore rock that its wreck-lord chooses each gale season to light or leave dark: the storm isles of the outer south, where the chiefs swore in 3A 280 that whatever the storm brings to a shore belongs to its lord.'),
  d('seite_islands', 'per_chevron', ['chart paper', 'chart teal'], ['green_turtle', 'ink'], null,
    'The Seite Islands bear the turtle of the banks their fathers fished: an isle moot that keeps the reef-shrines, refuses the sea-king every year and knows that its fishers alone cannot hold the banks against his fleet.'),
  d('the_lens', 'per_fess', ['ink', 'chart paper'], ['reading_lens', 'sand gold'], null,
    'The Lens bears the great lens of the Lamp-House, the order of glass-blowers sworn after a royal ship was lost on the Cursed Square to keep the northern passages lit for every ship, whatever its flag.'),
  d('nondondor', 'plain', ['corsair black'], ['hanger_sword', 'ransom gold'], null,
    'Nondondor bears the hanger of the captain who beat the corsair captains one by one, within the captain\'s ring of a sea-king: a kingdom of corsairs and fishers that grants writs or hangs corsairs as suits it and presses the banks claim when its fleet is stronger.'),
  d('windy_lands', 'per_bend', ['blood red', 'sea ink'], ['fishing_kite', 'bone', 3], null,
    'The Windy Lands bear three fishing kites for the cape-lords of the windward capes, who fish from kites and take what the storm drives onto their rocks: a league that pays tribute to strong fleets, raids weak ones and never agrees on anything quickly.'),
  d('santon', 'per_fess', ['bone', 'sea ink'], ['black_sail', 'corsair black'], null,
    'Santon bears the black sail of the captain who took the strait-place harbour of Straton: corsairs in the dead harbours of the outer western arc, who remember that Corogon has sworn to burn Straton again.'),
  d('benan', 'per_pale', ['blood red', 'corsair black'], ['mountain_cove', 'ransom gold'], null,
    'Benan bears the cove under the mountain that no fleet can find without a Benan pilot: the corsair haven of Torni, which takes tribute from the Charter, raids when it is late and keeps well away from the Cursed Square.'),
];

// ---------------------------------------------------------------------------------------------------------------
// Story cosmetic tags: the realm parents of the new roster and the charges that replace a god's device.
// ---------------------------------------------------------------------------------------------------------------

const STORY_PARENTS = {
  zin_cosmetic_aenor_golden_court: 'AEN', zin_cosmetic_aenor_faithful: 'AEN', zin_cosmetic_aenor_ashen: 'AEN',
  zin_cosmetic_aenor_strangers_host: 'AEN', zin_host_of_eindil: 'host realm (SEL, Selen, in the historical path)',
  zin_cosmetic_aenor_free_dominions: 'the dominions of the Concord (formed)', zin_cosmetic_aenor_restored: 'AEN',
  zin_cosmetic_worshipdom_east: 'WOR', zin_cosmetic_goldoroth_great: 'GOL',
};
const STORY_PATCH = {
  zin_cosmetic_aenor_golden_court: {
    primary_charge: { id: 'change_bell', tincture: ['lake_aenoran', 'deep lake'] },
    blazon: 'A field divided across, lamp gold above and lake blue below, by a straight line. A great bell in deep lake, outlined in Parim white, large in the centre, under a circlet of five flame-shaped points in deep lake. A plain narrow border of bell bronze.',
    meaning: "The court's gold laid over the realm's blue, with Aenor's bell darkened and a bronze border of difference: the party of the gilded halls that sells offices and still claims the crown.",
  },
  zin_cosmetic_aenor_faithful: {
    primary_charge: { id: 'guest_loaf', tincture: ['lake_aenoran', 'lamp gold'] },
    secondary_charge: { id: 'change_bell', tincture: ['lake_aenoran', 'bell bronze'] },
    blazon: "A field of Parim white with a base of lake blue edged by a straight line. A round loaf in lamp gold, outlined in deep lake, large in the centre; a great bell in bell bronze, small, beneath it. A plain narrow border of slate.",
    meaning: "The loaf of the Houses of the First Light's public charity above Aenor's bell: the camp that puts the faith before the crown. Nothing on it shows who leads the faith.",
    canon_note: 'Public arms before the reveal: the deny-list of the Worshipdom applies (no eye, chain, ash, mask, veil, serpent, horns, fire-bird, hidden face), and no lamp with an open flame appears (the arms of Lumae of the twelve).',
  },
  zin_cosmetic_aenor_ashen: {
    primary_charge: { id: 'change_bell', tincture: ['lake_aenoran', 'Parim white'] },
    blazon: 'A field divided diagonally from the upper hoist corner, slate above and deep lake below, by a straight line. A great bell in Parim white with a crack running down its side, large in the centre, under a circlet of five flame-shaped points in lamp gold.',
    meaning: "After the reveal Aenor's bell is cracked: the Concord of Aen's kingdoms broken under a throne it did not choose. The arms say nothing of the power behind the throne.",
    canon_note: "Afrit's true nature never appears on public arms (owner, 24 October 2026): no ash, no flame, no eye, no sign of the god-king; the record keeps its cosmetic tag and the name the court mechanic uses.",
  },
  zin_cosmetic_aenor_strangers_host: {
    blazon: "A field divided diagonally from the upper hoist corner, Parim white above and lake blue below, by a straight line. A wayfarer's staff bendwise in bell bronze with a small shuttered lantern in lamp gold hung from its head.",
    meaning: 'A traveller\'s staff carrying a lantern: the host gathered by a stranger from the north whose name is not yet known; nothing shows his blood.',
    primary_charge: { id: 'wayfarer_staff', name: "a wayfarer's staff with a small shuttered lantern hung from its head", tincture: ['lake_aenoran', 'bell bronze'] },
  },
  zin_host_of_eindil: {
    blazon: "A plain field of lake blue. Across the upper half a broad label of three square points in Parim white, large. Beneath it a wayfarer's staff in bell bronze with a small shuttered lantern in lamp gold, upright.",
  },
  zin_cosmetic_goldoroth_great: {
    field: { division: 'plain', line: null, tinctures: [['volcano_clans', 'ash black']] },
    primary_charge: { id: 'fire_mountain', tincture: ['volcano_clans', 'ember orange'] },
    blazon: 'A plain field of ash black. A fire-mountain with a plume of flame in ember orange within a ring of upright stakes in ash grey, large in the centre, under a circlet of upturned tusks in bone.',
  },
  zin_cosmetic_aenor_restored: {
    primary_charge: { id: 'change_bell', tincture: ['lake_aenoran', 'lamp gold'] },
    blazon: 'A plain field of lake blue. A great bell in lamp gold, large in the centre, under an ancient plain circlet of pale gold set with one white stone.',
    meaning: "Aenor's own arms under the ancient crown of Aen instead of the lamp-crown: the realm restored to the line it was founded by. Glo and the blue sword are not shown (reserved charges).",
  },
  zin_cosmetic_worshipdom_east: {
    primary_charge: { id: 'offered_loaf', tincture: ['zilin_pilgrims', 'bread brown'] },
    secondary_charge: { id: 'pilgrim_staff', tincture: ['zilin_pilgrims', 'sky blue'] },
    blazon: "A field of hostel white with a chief of pilgrim gold edged by a straight line. A hand from the base offering a round loaf in bread brown, large, under a tall plain crown of bread brown; beside it a pilgrim's staff in sky blue, small.",
    meaning: "The pilgrims' charity crowned: the realm proclaimed a kingdom of the East. The arms still show only the public faith and nothing of what leads it.",
    canon_note: 'No lamp with an open flame (the arms of Lumae of the twelve) and nothing of Afrit; no crown appears before zin_afrit_king_of_east.',
  },
};

// ---------------------------------------------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------------------------------------------

export function loadSources(paths = PATHS) {
  return {
    heraldry: readJson(paths.heraldry),
    roster: (() => { const r = readJson(paths.roster); return { ...r, realms: r.realms.filter((x) => !RETIRED_REALMS.has(x.key)) }; })(),
    culturesNew: readJson(paths.culturesNew),
    pantheon: readJson(paths.pantheon),
  };
}

const cultureOf = (id) => CULTURE_RENAMES[id] ?? id;

// K53 (lead): charge names the register forbids, renamed in every grammar that carries the charge (the seeded grammars keep the old text).
const CHARGE_TEXT = { struck_coin: 'a bronze coin stamped with a city gate' };

function applyGrammarChanges(doc, src) {
  doc.lines = { ...doc.lines, ...LINES_ADD };
  for (const g of Object.values(doc.cultures)) for (const c of g.charges ?? []) if (CHARGE_TEXT[c.id]) c.name = CHARGE_TEXT[c.id];
  doc.families = clone(FAMILIES);
  for (const id of Object.keys(RETIRED_CULTURES)) delete doc.cultures[id];
  const cn = src.culturesNew.cultures;
  for (const g of NEW_GRAMMARS) {
    const rec = clone(g);
    const meta = cn[g.id];
    if (meta) { rec.name = meta.name; rec.tier = meta.tier; rec.source_flag_note = meta.heraldry_and_look?.flag ?? rec.source_flag_note; }
    doc.cultures[g.id] = rec;
  }
  for (const [id, add] of Object.entries(GRAMMAR_ADDITIONS)) {
    const g = doc.cultures[id];
    if (!g) throw new Error(`grammar addition for unknown culture ${id}`);
    if (add.name) g.name = add.name;
    if (add.people) g.people = add.people;
    if (add.faith) g.faith = add.faith;
    if ('crown' in add) g.crown = add.crown;
    if (add.palette) for (const t of pal(add.palette)) if (!g.palette.some((p) => p.name === t.name)) g.palette.push(t);
    if (add.divisions) for (const dv of add.divisions) if (!g.divisions.includes(dv)) g.divisions.push(dv);
    if (add.charges) for (const c of add.charges) {
      const i = g.charges.findIndex((x) => x.id === c.id);
      if (i >= 0) g.charges[i] = clone(c); else g.charges.push(clone(c));
    }
    if (add.rename) for (const [cid, v] of Object.entries(add.rename)) Object.assign(g.charges.find((x) => x.id === cid), v);
    if (add.patch) for (const [p, v] of Object.entries(add.patch)) {
      const [, cid, field] = p.split('.');
      g.charges.find((x) => x.id === cid)[field] = v;
    }
    if (add.forms) g.forms = { ...(g.forms ?? {}), ...add.forms };
    if (add.dropForms) for (const f of add.dropForms) delete g.forms[f];
    if (add.ornament) g.ornament = add.ornament;
    if (add.ornamentAppend && !g.ornament.endsWith(add.ornamentAppend)) g.ornament += add.ornamentAppend;
  }
  // K53 emblem charges: each replaces a charge of the same id or joins the grammar's stock.
  for (const [cid, charges] of Object.entries(K53_CHARGES)) {
    const g = doc.cultures[cid];
    if (!g) throw new Error(`K53 charge for unknown culture ${cid}`);
    for (const c of charges) {
      const i = g.charges.findIndex((x) => x.id === c.id);
      if (i >= 0) g.charges[i] = clone(c); else g.charges.push(clone(c));
    }
  }
  // Faith ids renamed in cultures_new.json.
  for (const g of Object.values(doc.cultures)) if (FAITH_RENAMES[g.faith]) g.faith = FAITH_RENAMES[g.faith];
  // Family, line and class of every grammar follow the family table and the luminance rule.
  const famOf = {};
  for (const [fid, f] of Object.entries(doc.families)) for (const m of f.members) famOf[m] = fid;
  for (const g of Object.values(doc.cultures)) {
    g.family = famOf[g.id] ?? g.family;
    for (const t of g.palette) t.class = tinctureClass(t.hex);
  }
  // Peoples.
  const byId = Object.fromEntries(doc.peoples.map((p) => [p.id, p]));
  for (const p of PEOPLE_ADD) byId[p.id] = { ...clone(p), cultures: [] };
  for (const [id, patch] of Object.entries(PEOPLE_PATCH)) Object.assign(byId[id], patch);
  const order = [...doc.peoples.map((p) => p.id).filter((id) => !PEOPLE_ADD.some((x) => x.id === id)), ...PEOPLE_ADD.map((p) => p.id)];
  for (const p of Object.values(byId)) p.cultures = Object.values(doc.cultures).filter((g) => g.people === p.id).map((g) => g.id);
  doc.peoples = order.map((id) => byId[id]);
  // Retirement and rename register.
  doc.renames = {
    cultures: Object.entries(CULTURE_RENAMES).map(([from, to]) => ({ from, to, reason: RETIRED_CULTURES[from] })),
    retired: [{ id: 'wall_folk', into: ['vale_folk', 'hilofrim_herders'], reason: RETIRED_CULTURES.wall_folk }],
    faiths: Object.entries(FAITH_RENAMES).map(([from, to]) => ({ from, to })),
  };
}

function paletteIndex(doc) {
  const PAL = {}, CH = {};
  for (const [id, g] of Object.entries(doc.cultures)) {
    PAL[id] = Object.fromEntries(g.palette.map((t) => [t.name, t]));
    CH[id] = Object.fromEntries(g.charges.map((c) => [c.id, c]));
  }
  for (const p of doc.peoples) {
    if (p.palette?.length) PAL[`people:${p.id}`] = Object.fromEntries(p.palette.map((t) => [t.name, t]));
    if (p.charges?.length) CH[`people:${p.id}`] = Object.fromEntries(p.charges.map((c) => [c.id, c]));
  }
  return { PAL, CH };
}

function overlap(division, F, on) {
  if (on === 0 || on === 1) return [F[on]];
  if (['plain', 'chief', 'base', 'bordure', 'flaunches'].includes(division)) return [F[0]];
  if (['pile', 'pile_reversed'].includes(division)) return [F[1]];
  return F.slice(0, 2);
}
const topOf = (division, F) => (['chief', 'pile'].includes(division) ? F[1] : division === 'quarterly' ? null : F[0]);
const PLACEMENT = { chief: 'large in the field below the chief', base: 'large, standing on the base', pile: 'on the pile', pile_reversed: 'on the reversed pile', bordure: 'large within the border', flaunches: 'large between the flaunches', quarterly: 'large over all in the centre' };

function bestTincture(PAL, cultureId, against) {
  const list = Object.values(PAL[cultureId]).map((t) => ({ t, r: Math.min(...against.map((a) => contrastRatio(t.hex, a))) }));
  list.sort((a, b) => b.r - a.r || a.t.name.localeCompare(b.t.name));
  return list[0].t;
}
const tref = (t, source, extra = {}) => ({ name: t.name, hex: t.hex, source, ...extra });

// K53: each culture takes a hand, a hem and a ground by its index in the sorted list of culture ids. The cycles have
// lengths 10, 8 and 6, so the triples are all distinct for up to 120 cultures; the style line of each record is written from it.
export function assignCultureStyles(doc) {
  const ids = Object.keys(doc.cultures).sort();
  ids.forEach((cid, i) => {
    // K53 vocabulary: a culture with an explicit triple keeps it; the cycle is only the fallback for a culture not yet styled.
    const [hand, hem, ground] = K53_STYLE[cid] ?? [STYLE_CYCLES.hand[i % STYLE_CYCLES.hand.length], STYLE_CYCLES.hem[i % STYLE_CYCLES.hem.length], STYLE_CYCLES.ground[i % STYLE_CYCLES.ground.length]];
    doc.cultures[cid].style = { hand, hem, ground, text: `The culture's hand: ${HANDS[hand]}; its hem: ${HEMS[hem]}; its ground: ${GROUNDS[ground]}.` };
  });
  return doc;
}

export function buildRecords(doc, roster) {
  const { PAL, CH } = paletteIndex(doc);
  const realms = Object.fromEntries(roster.realms.map((r) => [r.key, r]));
  const errors = [];
  const out = [];
  for (const des of DESIGNS.map(k65Apply)) {
    const realm = realms[des.key];
    if (!realm) { errors.push(`design ${des.key}: no realm of that key in the roster`); continue; }
    const cid = cultureOf(realm.culture);
    const g = doc.cultures[cid];
    if (!g) { errors.push(`${des.key}: no grammar for culture ${realm.culture}`); continue; }
    const secondCulture = realm.cultureSecondary ? cultureOf(realm.cultureSecondary) : null;
    const borrow = des.opts.borrow ?? [];
    const resolveT = (name) => {
      if (PAL[cid][name]) return tref(PAL[cid][name], cid);
      for (const b of borrow) {
        const [bc, bn] = b.split(':');
        if (bn === name && PAL[bc]?.[name]) return tref(PAL[bc][name], bc, { borrowed: true });
      }
      errors.push(`${des.key}: tincture ${name} is not in the ${cid} palette or a declared borrowing`);
      return { name, hex: '#ff00ff', source: '?' };
    };
    const resolveC = (id) => {
      if (CH[cid][id]) return { c: CH[cid][id], source: cid };
      const people = `people:${realm.people}`;
      if (CH[people]?.[id]) return { c: CH[people][id], source: people };
      for (const b of borrow) {
        const [bc, bn] = b.split(':');
        if (bn === id && CH[bc]?.[id]) return { c: CH[bc][id], source: bc, borrowed: true };
      }
      if (K68_CHARGES[id]) return { c: K68_CHARGES[id], source: cid };
      if (K65_CHARGES[id]) return { c: K65_CHARGES[id], source: cid };
      errors.push(`${des.key}: charge ${id} is not in the ${cid} or ${people} stock or a declared borrowing`);
      return { c: { id, name: id, meaning: '', class: 'token' }, source: '?' };
    };
    const F = des.field.map(resolveT);
    const line = des.division === 'plain' ? null : g.line;
    const [pid, ptin, pcount = 1] = des.primary;
    const pc = resolveC(pid);
    const P = { id: pc.c.id, name: pc.c.name, meaning: pc.c.meaning, class: pc.c.class, ...(pc.c.regional || des.opts.regionalPrimary ? { regional: true } : {}), culture: pc.source, ...(pc.borrowed ? { borrowed: true } : {}), tincture: resolveT(ptin), count: pcount };
    let S = null;
    if (des.secondary) {
      const sc = resolveC(des.secondary[0]);
      S = { id: sc.c.id, name: sc.c.name, meaning: sc.c.meaning, class: sc.c.class, ...(sc.c.regional ? { regional: true } : {}), culture: sc.source, ...(sc.borrowed ? { borrowed: true } : {}), tincture: resolveT(des.secondary[1]) };
    }
    // Contrast and fimbriation.
    const ov = overlap(des.division, F, des.opts.on);
    const r = Math.min(...ov.map((t) => contrastRatio(P.tincture.hex, t.hex)));
    P.contrast = Math.round(r * 100) / 100;
    if (r < TUNING.contrastMin) {
      const sorted = Object.values(PAL[cid]).slice().sort((a, b) => luminance(a.hex) - luminance(b.hex) || a.name.localeCompare(b.name));
      const fim = luminance(P.tincture.hex) > 0.3 ? sorted[0] : sorted[sorted.length - 1];
      P.fimbriated = tref(fim, cid);
    }
    if (S) S.contrast = Math.round(Math.min(...ov.map((t) => contrastRatio(S.tincture.hex, t.hex))) * 100) / 100;
    // Marks.
    const marks = [];
    const form = realm.politicalForm;
    const family = g.family;
    // K53: the Ainic label (a chief bar of three square points) is no longer drawn; it read as battlements and made the flags alike.
    if (CROWNED_FORMS.has(form) && g.crown) {
      const top = topOf(des.division, F.map((t) => t.hex)) ?? F[0].hex;
      let ct;
      if (cid === 'steppe_rider') ct = tref(PAL[cid]['felt white'], cid);
      else if (cid === 'free_crowns_north') ct = tref(bestTincture(PAL, cid, [P.tincture.hex]), cid);
      else if (contrastRatio(P.tincture.hex, top) >= TUNING.contrastMin) ct = P.tincture;
      else ct = tref(bestTincture(PAL, cid, [top]), cid);
      if (!des.opts?.noCrown) marks.push({ mark: 'crown', text: g.crown, tincture: ct });
    }
    if (des.opts.council && SYLVAN_SILVER[cid]) marks.push({ mark: 'council_border', text: 'a border engrailed: the elected speakers', tincture: tref(PAL[cid][SYLVAN_SILVER[cid]], cid) });
    if (form === 'council' && SYLVAN_SILVER[cid] && !des.opts.council) marks.push({ mark: 'council_border', text: 'a border engrailed: the elected speakers', tincture: tref(PAL[cid][SYLVAN_SILVER[cid]], cid) });
    if (cid === 'goodin_sunfolk') marks.push({ mark: 'patron_chief', text: 'a chief rayonny: the Sunhot patrons', tincture: tref(PAL[cid]['sun yellow'], cid) });
    if (cid === 'river_kings') marks.push({ mark: 'river_bendlet', text: "a narrow wavy bendlet: the king's river", tincture: tref(bestTincture(PAL, cid, F.map((t) => t.hex)), cid) });
    if (cid === 'steppe_rider' && form === 'moot') marks.push({ mark: 'host_marks', text: 'three small hoof-marks in base: the host', tincture: P.tincture });
    if (cid === 'buldor_companies') marks.push({ mark: 'bordure_compony', text: 'a border compony of livery red and buff: the companies\' livery', tincture: F[1] });
    if (cid === 'road_warrens' && !markWaived(des.key, 'boss_ring')) marks.push({ mark: 'boss_ring', text: "the boss's iron ring round the charge", tincture: tref(PAL[cid]['boss black'], cid) });
    if (des.opts.orle) {
      const o = des.opts.orle;
      marks.push({ mark: 'enclave_orle', text: `an orle of ${o.tincture}: held inside the land of ${realms[o.realm]?.name ?? o.realm}`, tincture: tref(PAL[o.culture][o.tincture], o.culture, { context_mark: o.realm }) });
    }
    if (realm.overlord && OVERLORD_MARKS[realm.overlord] && !markWaived(des.key, OVERLORD_MARKS[realm.overlord].mark)) {
      const om = OVERLORD_MARKS[realm.overlord];
      marks.push({ mark: om.mark, text: om.text, tincture: tref(PAL[om.culture][om.tincture], om.culture, { overlord_mark: true }) });
    }
    const rec = {
      key: realm.key, tag: realm.tag, name: realm.name, region: realm.region, region_name: roster.regions[realm.region],
      culture: cid, culture_secondary: secondCulture, people: realm.people, family, form, subject_of: realm.overlord ?? null,
      subject_type: realm.subjectType ?? null,
      field: { division: des.division, line, tinctures: F },
      primary_charge: P, secondary_charge: S, marks,
      meaning: des.meaning,
      ...(des.opts.formNote ? { form_note: des.opts.formNote } : {}),
      ...(des.opts.canon ? { canon_note: des.opts.canon } : {}),
      ...(K65_JUSTIFIED[des.key] ? { regional_justification: K65_JUSTIFIED[des.key] } : {}),
      style_text: realmStyleText(g.style?.text ?? '', des.key),
      ...(K68_REALM_HEM[des.key] ? { hem_override: K68_REALM_HEM[des.key] } : {}),
      ...(K68_MARK_WAIVED[des.key] ? { marks_waived: K68_MARK_WAIVED[des.key] } : {}),
      ...(des.opts.on !== undefined ? { placement: des.opts.on === 1 ? 'on the lower part of the field' : 'on the upper part of the field' } : {}),
    };
    rec.blazon = blazon(rec, doc);
    rec.design_hash = designHash(rec);
    rec.provisional = true;
    out.push(rec);
  }
  return { records: out, errors };
}

function crownBlazon(rec, mark) {
  const t = mark.tincture.name;
  if (rec.culture === 'free_crowns_north') {
    const cl = rec.primary_charge.class;
    if (cl === 'tree') return `A small plain crown of ${t} hangs in the branches.`;
    if (['building', 'tool', 'token'].includes(cl)) return `A small plain crown of ${t} sits above it.`;
    return `The beast wears a small plain crown of ${t} about its neck.`;
  }
  return (CROWN_BLAZON[rec.culture] ?? 'Above the charge a plain circlet in {t}.').replace('{t}', t);
}

export function blazon(rec, doc) {
  const { division, tinctures: F } = rec.field;
  const lineText = doc.lines[rec.field.line ?? 'straight'] ?? 'a straight line';
  let s = doc.divisions[division].replaceAll('{0}', F[0].name).replaceAll('{1}', F[1]?.name ?? '').replaceAll('{line}', lineText);
  const parts = [s[0].toUpperCase() + s.slice(1) + '.'];
  for (const m of rec.marks) if (m.mark === 'label') parts.push(`In chief a narrow label of three short square points in ${m.tincture.name}.`);
  const P = rec.primary_charge;
  const pn = P.count === 1 ? P.name : `three of ${P.name.replace(/^an? /, '')}, two above one`;
  const place = rec.placement === 'on the lower part of the field' ? 'large on the lower part of the field' : PLACEMENT[division] ?? 'large in the centre';
  const fim = P.fimbriated ? `, outlined in ${P.fimbriated.name}` : '';
  parts.push(`${pn[0].toUpperCase() + pn.slice(1)} in ${P.tincture.name}${fim}, ${place}.`);
  const S = rec.secondary_charge;
  if (S) parts.push(`${S.name[0].toUpperCase() + S.name.slice(1)} in ${S.tincture.name}, ` + (S.id === 'ring_of_names' ? 'encircling it.' : 'small, beneath it.'));
  for (const m of rec.marks) {
    switch (m.mark) {
      case 'crown': parts.push(crownBlazon(rec, m)); break;
      case 'bordure_compony': parts.push('The border is compony: alternating blocks of livery red and buff.'); break;
      case 'council_border': parts.push(`A narrow border engrailed of ${m.tincture.name}.`); break;
      case 'patron_chief': parts.push(`A chief rayonny of ${m.tincture.name}.`); break;
      case 'river_bendlet': parts.push(`Behind the charge a narrow wavy diagonal band of ${m.tincture.name}.`); break;
      case 'host_marks': parts.push(`In base three small hoof-marks in ${m.tincture.name}.`); break;
      case 'boss_ring': parts.push(`Round the charge a plain iron ring of ${m.tincture.name}.`); break;
      case 'enclave_orle': parts.push(`An orle (a narrow inner frame set in from the edges) of ${m.tincture.name}.`); break;
      default: { const om = Object.values(OVERLORD_MARKS).find((o) => o.mark === m.mark && o.tincture === m.tincture.name); if (om) parts.push(om.blazon); }
    }
  }
  return parts.join(' ');
}

export function designKey(rec) {
  return [
    rec.field.division, rec.field.line, rec.field.tinctures.map((t) => t.hex),
    rec.primary_charge.id, rec.primary_charge.tincture.hex, rec.primary_charge.count,
    rec.secondary_charge?.id ?? null, rec.secondary_charge?.tincture.hex ?? null,
    rec.marks.map((m) => `${m.mark}:${m.tincture.hex}`).sort(),
  ];
}
export const designHash = (rec) => crypto.createHash('sha256').update(JSON.stringify(designKey(rec))).digest('hex').slice(0, 16);

// Distance between two designs over field, division, charges and tinctures (0 = identical).
export function designDistance(a, b) {
  let dist = 0;
  if (a.field.division !== b.field.division) dist += 3;
  else if (a.field.line !== b.field.line) dist += 1;
  const fa = a.field.tinctures.map((t) => t.hex), fb = b.field.tinctures.map((t) => t.hex);
  if (fa.length !== fb.length) dist += 1.5;
  for (let i = 0; i < Math.min(fa.length, fb.length); i++) dist += 1.5 * Math.min(deltaE(fa[i], fb[i]) / 25, 1);
  const pa = a.primary_charge, pb = b.primary_charge;
  if (pa.id !== pb.id) dist += pa.class !== pb.class ? 4 : 3;
  dist += Math.min(deltaE(pa.tincture.hex, pb.tincture.hex) / 25, 1);
  if (pa.count !== pb.count) dist += 1;
  const sa = a.secondary_charge?.id ?? null, sb = b.secondary_charge?.id ?? null;
  if (sa !== sb) dist += 2;
  const ma = new Set(a.marks.map((m) => m.mark)), mb = new Set(b.marks.map((m) => m.mark));
  for (const m of new Set([...ma, ...mb])) if (ma.has(m) !== mb.has(m)) dist += 0.5;
  return Math.round(dist * 100) / 100;
}

// Approximate 3x2 colour grid of the 10x7 small flag: the field by division, the primary charge over the centre.
export function smallGrid(rec) {
  const F = rec.field.tinctures.map((t) => hexToLab(t.hex));
  const A = F[0], B = F[1] ?? F[0];
  const mix = (wb) => mixLab([[A, 1 - wb], [B, wb]]);
  const g = {
    plain: [[A, A, A], [A, A, A]],
    per_pale: [[A, mix(0.5), B], [A, mix(0.5), B]],
    per_fess: [[A, A, A], [B, B, B]],
    per_bend: [[mix(0.5), A, A], [B, B, mix(0.5)]],
    per_bend_sinister: [[A, A, mix(0.5)], [mix(0.5), B, B]],
    per_chevron: [[A, mix(0.5), A], [mix(0.5), B, mix(0.5)]],
    chief: [[mix(0.57), mix(0.57), mix(0.57)], [A, A, A]],
    base: [[A, A, A], [mix(0.57), mix(0.57), mix(0.57)]],
    quarterly: [[A, mix(0.5), B], [B, mix(0.5), A]],
    gyronny: [[mix(0.5), mix(0.5), mix(0.5)], [mix(0.5), mix(0.5), mix(0.5)]],
    pile: [[A, B, A], [A, mix(0.5), A]],
    pile_reversed: [[A, mix(0.5), A], [A, B, A]],
    flaunches: [[mix(0.6), A, mix(0.6)], [mix(0.6), A, mix(0.6)]],
    bordure: [[mix(0.35), mix(0.35), mix(0.35)], [mix(0.35), mix(0.35), mix(0.35)]],
  }[rec.field.division];
  const P = hexToLab(rec.primary_charge.tincture.hex);
  const w = TUNING.chargeWeightSmall * (rec.primary_charge.count === 3 ? 1.4 : 1);
  return g.map((row) => row.map((cell, i) => (i === 1 ? mixLab([[cell, 1 - w], [P, w]]) : mixLab([[cell, 1 - w / 3], [P, w / 3]]))));
}
export function smallGridDistance(a, b) {
  const ga = smallGrid(a), gb = smallGrid(b);
  let s = 0;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) s += deltaE2000(ga[r][c], gb[r][c]);
  return s / 6;
}

function updateDynamic(doc, records) {
  const byKey = Object.fromEntries(records.map((r) => [r.key, r]));
  const { PAL } = paletteIndex(doc);
  const story = doc.dynamic.story;
  for (const s of story) {
    s.parent = STORY_PARENTS[s.cosmetic_tag] ?? s.parent;
    const p = STORY_PATCH[s.cosmetic_tag];
    if (!p) continue;
    for (const [k, v] of Object.entries(p)) {
      if (k === 'field') {
        s.field = { division: v.division, line: v.line, tinctures: v.tinctures.map(([c, tn]) => tref(PAL[c][tn], c)) };
      } else if (k === 'primary_charge' || k === 'secondary_charge') {
        const [c, tn] = v.tincture;
        s[k] = { ...(s[k] ?? {}), id: v.id, ...(v.name ? { name: v.name } : {}), tincture: tref(PAL[c][tn], c) };
      } else s[k] = v;
    }
    if (s.cosmetic_tag === 'zin_cosmetic_aenor_ashen') s.name = s.name.replace('Aenor of Afrit (the Ashen Throne)', 'The Ashen Throne');
  }
  doc.dynamic.engine_facts = doc.dynamic.engine_facts.map((f) => f);
  doc.dynamic.kinds.breakaway.steps[3] = "Add the culture's breakaway mark (difference.breakaway_mark): a border in the culture's line, tinctured with difference.dissent_tincture. A Concord dominion instead shows the charter border broken open at the top; a Free Crown shows its crown torn from the beast; a realm sworn to the Dominion keeps the grave base, which it cannot break.";
  doc.dynamic.kinds.released.steps[5] = "If the releaser keeps it as a subject, add the releaser's subject mark (charter border of Aenor, grave base of the Dominion, the Iron Yoke of Goldoroth, the ward border of Hirolon or Herrodon, or for any other releaser its dissent tincture as a narrow border).";
  doc.dynamic.parent_index = Object.fromEntries(records.map((r) => [r.tag, { key: r.key, culture: r.culture, design_hash: r.design_hash }]));
  void byKey;
}

export function build(src = loadSources()) {
  const doc = clone(src.heraldry);
  applyGrammarChanges(doc, src);
  assignCultureStyles(doc);
  const { records, errors } = buildRecords(doc, src.roster);
  doc.countries = records;
  updateDynamic(doc, records);
  doc.schema = 'zin-heraldry/3';
  doc.pipeline.prompt_frame = PROMPT_FRAME;
  doc.pipeline.style = 'K53 (25 October 2026): medieval banner cloth, stylised heraldic devices, no clip-art or outline illustration; each culture has its own hand, hem and ground (cultures[].style); lines are no longer the regional identifier.';
  doc.checks.regional_symbols = `a record whose primary or secondary charge is in REGIONAL_CLASSES (${REGIONAL_CLASSES.join(', ')}) must carry a regional_justification from the realm's own history (generator table REGIONAL_JUSTIFIED); a realm with no entry fails`;
  doc.checks.culture_style = 'every culture has a distinct hand, hem and ground triple (assignCultureStyles, cycles 10, 8 and 6)';
  doc.status = 'Draft: one design per realm of the roster of 24 October 2026 (156 realms, real tags); every design is proposed and provisional until the owner reviews the sheets';
  doc.updated = '2026-10-24';
  doc.generator = 'tools/content/heraldry/build_heraldry.mjs (node tools/content/heraldry/build_heraldry.mjs --write)';
  doc.note = `Grammars per culture and people, family marks, one design record per realm of roster.json (${records.length} realms, keyed by key and tag), the dynamic-tag derivation and fallback designs, the forbidden register and the build checks. Hex values are the design tinctures; the palette-fit check measures generated images against them. The countries section, the new grammars and the renames are written by the generator; edit its tables, not this file.`;
  doc.checks.coverage = `every realm of roster.json (${records.length} tags) and D01-D75 in common/country_tags, and every cosmetic tag in common/countries/cosmetic.txt, has a design record and gfx/flags/<TAG>.tga, medium/<TAG>.tga and small/<TAG>.tga; no flag file without a tag`;
  doc.checks.primary_caps = { per_culture: TUNING.primaryPerCulture, per_region: TUNING.primaryPerRegion };
  doc.checks.design_distance = { min: TUNING.designDistanceMin, rule: 'distance over division (3, or 1 for the line alone), field tinctures (1.5 each, scaled by Delta E 2000 over 25), primary charge (4 for another class, 3 for another charge of the class), primary tincture (1, scaled), count (1), secondary charge (2) and marks (0.5 each); any pair of country or story designs below the minimum fails' };
  doc.checks.small_signature = `(division, field tinctures) unique within a region; the mean Delta E 2000 of the approximate 3x2 small-flag grid between any two flags of a region at least ${TUNING.smallFlagDeltaEMin} on the records, and at least 10 on the generated 10x7 images`;
  doc.checks.god_devices = 'no country or story record reproduces the device of a named god of pantheon.json (an eye, a brimming bowl, a lamp with an open flame, waves under a cloud, a ring with a shoot, a gate with a staff, a tower on a mount, a sheaf under rain, a bound standing stone, an anvil, a furled sail, a star) and no record names a god';
  doc.forbidden.names_and_canon = [
    'no named New God charge and no god\'s device (pantheon.json symbols: Glernaen, Sulethe, Lumae, Maelwen, Vaelei, Rasthel, Kerun, Aurlan, Ailtal, Irumas, Gaelor and Naisa have names and arms; no national flag shows them)',
    'no figure of Zol, Volgan, Afrit, Elzon, Horos or any named person',
    'no Afrit or Hidden Council sign on the Worshipdom or Aenor public arms (deny-list in the Worshipdom record); Afrit\'s true nature never appears on public arms, before or after the reveal',
    "Zol's servant (Kusven, formerly Edvoid) never appears on any flag, nor his dwelling of the black oval; Zol's Mistake shows only its emblem leader's sigil, the Will of Zol",
    'Glo, Horos\'s blue sword and its shards are reserved charges: owner approval and a story gate are required',
    'no device of Elzon\'s Order (the Pale Regency) on any living realm',
    'nothing of the wider world (Erdu, Dunda, Haven, Cerio, Lao and the small neighbouring continent)',
  ];
  doc.forbidden.real_religious_symbols = doc.forbidden.real_religious_symbols.map((s) => (s === 'pentagram and inverted pentagram' ? 'pentagram and inverted pentagram (except a pentagram inside a demon sigil, owner 24 October 2026; never a cross of any arrangement, inverted or upright)' : s));
  if (!doc.forbidden.regional_cliches.some((c) => c.id === 'pentagram')) doc.forbidden.regional_cliches.push({ id: 'pentagram', rule: 'only in a demon sigil, at most one in Aoaz (the Nether)' });
  doc.pipeline.sheets_needed = { roster: Math.ceil(records.length / doc.pipeline.sheet.per_sheet), story: Math.ceil(doc.dynamic.story.length / doc.pipeline.sheet.per_sheet), fallback: Math.ceil(doc.dynamic.fallback.length / doc.pipeline.sheet.per_sheet) };
  // Stable key order at the top level.
  const ordered = {};
  for (const k of ['schema', 'status', 'updated', 'spec', 'requirement', 'generator', 'note', 'flag_sizes', 'lines', 'divisions', 'charge_classes', 'tincture_rule', 'families', 'peoples', 'cultures', 'renames', 'countries', 'dynamic', 'forbidden', 'checks', 'pipeline']) if (k in doc) ordered[k] = doc[k];
  for (const k of Object.keys(doc)) if (!(k in ordered)) ordered[k] = doc[k];
  return { doc: ordered, errors };
}

// ---------------------------------------------------------------------------------------------------------------
// Checks. Each returns a list of findings ({ rule, where, message }). An empty list passes.
// ---------------------------------------------------------------------------------------------------------------

const finding = (rule, where, message) => ({ rule, where, message });

export function checkCoverage(doc, roster) {
  const f = [];
  const byKey = new Map();
  for (const r of doc.countries) {
    if (byKey.has(r.key)) f.push(finding('coverage', r.key, 'more than one design for this realm'));
    byKey.set(r.key, r);
  }
  for (const realm of roster.realms) {
    const r = byKey.get(realm.key);
    if (!r) f.push(finding('coverage', realm.key, 'realm of the roster has no design'));
    else if (r.tag !== realm.tag) f.push(finding('coverage', realm.key, `design tag ${r.tag} differs from roster tag ${realm.tag}`));
  }
  const keys = new Set(roster.realms.map((x) => x.key));
  for (const r of doc.countries) if (!keys.has(r.key)) f.push(finding('coverage', r.key, 'design for a realm that is not in the roster'));
  const tags = new Map();
  for (const r of doc.countries) { if (tags.has(r.tag)) f.push(finding('coverage', r.tag, `tag used by ${tags.get(r.tag)} and ${r.key}`)); tags.set(r.tag, r.key); }
  return f;
}

// Grammars allowed a palette without a metal, with the reason.
const METAL_EXEMPT = { zols_dead: 'the emblem realm: the Will of Zol is cold grey on the void, the same sigil as the portrait of its leader' };

export function checkGrammars(doc, culturesNew) {
  const f = [];
  const ids = new Map();
  const charge = (cid, c) => { if (ids.has(c.id)) f.push(finding('grammar', cid, `charge id ${c.id} also defined in ${ids.get(c.id)}`)); ids.set(c.id, cid); };
  for (const [cid, g] of Object.entries(doc.cultures)) {
    for (const c of g.charges) charge(cid, c);
    if (!g.palette.some((t) => t.class === 'metal') && !METAL_EXEMPT[cid]) f.push(finding('grammar', cid, 'palette has no metal'));
    if (!g.palette.some((t) => t.class === 'colour')) f.push(finding('grammar', cid, 'palette has no colour'));
    for (const t of g.palette) if (t.class !== tinctureClass(t.hex)) f.push(finding('grammar', cid, `tincture ${t.name} class ${t.class} disagrees with its luminance`));
    if (!g.palette.some((t) => t.name === g.difference.dissent_tincture)) f.push(finding('grammar', cid, 'dissent tincture is not in the palette'));
    if (!g.charges.some((c) => c.id === g.difference.restoration_charge)) f.push(finding('grammar', cid, 'restoration charge is not in the stock'));
    for (const dv of g.divisions) if (!doc.divisions[dv]) f.push(finding('grammar', cid, `division ${dv} is not in the vocabulary`));
    if (g.line && !doc.lines[g.line]) f.push(finding('grammar', cid, `line ${g.line} is not in the vocabulary`));
    for (const c of g.charges) if (!doc.charge_classes.includes(c.class)) f.push(finding('grammar', cid, `charge ${c.id} has unknown class ${c.class}`));
    if (!doc.families[g.family]?.members.includes(cid)) f.push(finding('grammar', cid, `not listed in family ${g.family}`));
    if (!doc.peoples.some((p) => p.id === g.people)) f.push(finding('grammar', cid, `people ${g.people} has no people grammar`));
  }
  for (const p of doc.peoples) for (const c of p.charges ?? []) charge(`people:${p.id}`, c);
  // Every culture of cultures_new.json and every renamed id resolves to a grammar.
  for (const id of Object.keys(culturesNew.cultures)) if (!doc.cultures[id]) f.push(finding('grammar', id, 'culture of cultures_new.json has no grammar'));
  for (const rn of culturesNew.renames.filter((x) => x.kind === 'culture' && x.newId)) if (!doc.cultures[rn.newId]) f.push(finding('grammar', rn.newId, 'renamed culture has no grammar under its new id'));
  // Dwarves share no tincture with elven arms.
  const elvenHex = new Set(Object.values(doc.cultures).filter((g) => g.people === 'elves' || g.people === 'sun_elves').flatMap((g) => g.palette.map((t) => t.hex)));
  for (const g of Object.values(doc.cultures).filter((x) => x.people === 'dwarves')) for (const t of g.palette) if (elvenHex.has(t.hex)) f.push(finding('grammar', g.id, `dwarven tincture ${t.name} is also an elven tincture`));
  // Baelim and ents never share a line or a tincture.
  const ents = doc.cultures.kilinti_ents, baelim = doc.cultures.baelim;
  if (ents && baelim) {
    if (ents.line === baelim.line) f.push(finding('grammar', 'baelim', 'the Baelim draw the ents\' line'));
    for (const t of baelim.palette) if (ents.palette.some((e) => e.hex === t.hex)) f.push(finding('grammar', 'baelim', `tincture ${t.name} shared with the ents`));
  }
  return f;
}

export function checkRecordRules(doc) {
  const f = [];
  const { PAL } = paletteIndex(doc);
  for (const r of doc.countries) {
    const g = doc.cultures[r.culture];
    const allowed = new Set([r.culture]);
    // Palette inside the grammar: own palette, at most one borrowed tincture of a declared kin culture, overlord and enclave marks.
    const tinctures = [...r.field.tinctures, r.primary_charge.tincture, ...(r.primary_charge.fimbriated ? [r.primary_charge.fimbriated] : []), ...(r.secondary_charge ? [r.secondary_charge.tincture] : [])];
    const borrowed = new Set();
    for (const t of tinctures) {
      if (!PAL[t.source]?.[t.name] || PAL[t.source][t.name].hex !== t.hex) f.push(finding('palette', r.key, `tincture ${t.name} ${t.hex} is not in the palette of ${t.source}`));
      if (!allowed.has(t.source)) { if (t.borrowed) borrowed.add(`${t.source}:${t.name}`); else f.push(finding('palette', r.key, `tincture ${t.name} comes from ${t.source}, outside the culture`)); }
    }
    if (borrowed.size > TUNING.borrowTincturesMax) f.push(finding('palette', r.key, `${borrowed.size} borrowed tinctures (at most ${TUNING.borrowTincturesMax})`));
    for (const m of r.marks) {
      const ok = m.tincture.source === r.culture || m.tincture.overlord_mark || m.tincture.context_mark;
      if (!ok) f.push(finding('palette', r.key, `mark ${m.mark} tincture ${m.tincture.name} is outside the culture`));
    }
    // Division and line follow the grammar.
    if (!g.divisions.includes(r.field.division)) f.push(finding('grammar_fit', r.key, `division ${r.field.division} is not in the ${r.culture} grammar`));
    if (r.field.division !== 'plain' && r.field.line !== g.line) f.push(finding('grammar_fit', r.key, `line ${r.field.line} is not the ${r.culture} line ${g.line}`));
    if (r.field.division === 'plain' && r.field.tinctures.length !== 1) f.push(finding('grammar_fit', r.key, 'a plain field takes one tincture'));
    if (r.field.division !== 'plain' && r.field.tinctures.length !== 2) f.push(finding('grammar_fit', r.key, 'a divided field takes two tinctures'));
    if (r.field.division !== 'plain' && r.field.tinctures[0].hex === r.field.tinctures[1].hex) f.push(finding('grammar_fit', r.key, 'a divided field of one tincture'));
    // Contrast.
    const P = r.primary_charge;
    if (P.contrast < TUNING.contrastMin && !P.fimbriated) f.push(finding('contrast', r.key, `primary contrast ${P.contrast} without fimbriation`));
    const single = ['plain', 'chief', 'base', 'bordure', 'flaunches', 'pile', 'pile_reversed'].includes(r.field.division) || r.placement;
    if (single && P.contrast < TUNING.contrastFloor) f.push(finding('contrast', r.key, `primary contrast ${P.contrast} on a single field tincture`));
    if (P.fimbriated && contrastRatio(P.fimbriated.hex, P.tincture.hex) < TUNING.contrastMin) f.push(finding('contrast', r.key, 'the fimbriation does not separate the charge from its outline'));
    if (r.secondary_charge && r.secondary_charge.contrast < TUNING.contrastFloor) f.push(finding('contrast', r.key, `secondary contrast ${r.secondary_charge.contrast} below ${TUNING.contrastFloor}`));
    // K53: a regional or trade charge needs a justification from the realm's own history, written out in full.
    const regional = [r.primary_charge, r.secondary_charge].filter((c) => c && c.regional === true);
    if (regional.length && (!r.regional_justification || r.regional_justification.length < 80)) f.push(finding('regional_symbol', r.key, `regional or trade charge ${regional.map((c) => c.name).join(', ')} without a regional_justification of at least 80 characters`));
    if (r.regional_justification && !regional.length) f.push(finding('regional_symbol', r.key, 'a regional_justification without a regional charge; remove the entry'));
    // Element budget.
    const n = r.marks.length + 1 + (r.secondary_charge ? 1 : 0);
    if (n > TUNING.elementMax) f.push(finding('budget', r.key, `${n} elements (at most ${TUNING.elementMax})`));
  }
  return f;
}

export function checkForms(doc, roster) {
  const f = [];
  const realms = Object.fromEntries(roster.realms.map((r) => [r.key, r]));
  for (const r of doc.countries) {
    const realm = realms[r.key];
    const g = doc.cultures[r.culture];
    const has = (m) => r.marks.some((x) => x.mark === m);
    if (realm.overlord === 'aenor' && !has('charter_border')) f.push(finding('form', r.key, 'a dominion of the Concord lacks the charter border'));
    if (realm.overlord !== 'aenor' && has('charter_border')) f.push(finding('form', r.key, 'charter border on a realm that is not a dominion of the Concord'));
    if (realm.overlord === 'puvulan' && !has('grave_base') && !markWaived(r.key, 'grave_base')) f.push(finding('form', r.key, 'a realm sworn to the Dominion lacks the grave base'));
    for (const w of Object.keys(K68_MARK_WAIVED[r.key] ?? {})) if (has(w)) f.push(finding('form', r.key, `waived mark ${w} is drawn on the banner`));
    if (realm.overlord !== 'puvulan' && has('grave_base')) f.push(finding('form', r.key, 'grave base on a realm not sworn to the Dominion'));
    if (realm.overlord && OVERLORD_MARKS[realm.overlord] && !has(OVERLORD_MARKS[realm.overlord].mark) && !markWaived(r.key, OVERLORD_MARKS[realm.overlord].mark)) f.push(finding('form', r.key, `subject of ${realm.overlord} lacks its mark`));
    if (!realm.overlord && r.marks.some((m) => m.tincture.overlord_mark)) f.push(finding('form', r.key, 'an overlord mark on a sovereign realm'));
    if (CROWNED_FORMS.has(realm.politicalForm) && g.crown && !has('crown') && !(K68_OVERRIDES[r.key] ?? K65_OVERRIDES[r.key])?.noCrown) f.push(finding('form', r.key, 'a kingdom of a crowned culture lacks its crown'));
    if (!CROWNED_FORMS.has(realm.politicalForm) && has('crown')) f.push(finding('form', r.key, `crown on a ${realm.politicalForm}`));
    if (realm.politicalForm === 'theocracy') {
      if (has('crown') || has('label')) f.push(finding('form', r.key, 'a theocracy wears a crown or a label'));
      if (!r.field.tinctures.some((t) => t.hex && tinctureClass(t.hex) === 'metal')) f.push(finding('form', r.key, 'a theocracy without a metal in its field'));
      if (r.primary_charge.class === 'beast') f.push(finding('form', r.key, 'a theocracy bears a beast'));
    }
    if (['confederation', 'league'].includes(realm.politicalForm) && r.primary_charge.count !== 3 && !r.form_note && !['quarterly'].includes(r.field.division)) f.push(finding('form', r.key, `a ${realm.politicalForm} neither triples its charge nor states why`));
    if (realm.politicalForm === 'enclave' && !has('enclave_orle') && r.culture !== 'zols_dead') f.push(finding('form', r.key, 'an enclave lacks its orle'));
    if (r.key === 'aenor' && has('label')) f.push(finding('form', r.key, 'Aenor bears a label'));
  }
  // Named form facts of the owner canon.
  const by = Object.fromEntries(doc.countries.map((r) => [r.key, r]));
  if (by.hirolon && by.hirolon.marks.some((m) => m.tincture.overlord_mark)) f.push(finding('form', 'hirolon', 'Hirolon is sovereign and carries no overlord mark'));
  if (by.tirlan && !by.tirlan.marks.some((m) => m.mark === 'ward_border' && m.tincture.source === 'hill_giants')) f.push(finding('form', 'tirlan', "Tirlan lacks Hirolon's ward"));
  return f;
}

export function checkDistinctness(doc) {
  const f = [];
  const all = [...doc.countries];
  const hashes = new Map();
  for (const r of all) { if (hashes.has(r.design_hash)) f.push(finding('distinct', r.key, `design hash equals ${hashes.get(r.design_hash)}`)); hashes.set(r.design_hash, r.key); }
  let minPair = null;
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const dd = designDistance(all[i], all[j]);
    if (!minPair || dd < minPair.d) minPair = { a: all[i].key, b: all[j].key, d: dd };
    if (dd < TUNING.designDistanceMin) f.push(finding('distinct', `${all[i].key}/${all[j].key}`, `near-identical designs (distance ${dd} < ${TUNING.designDistanceMin})`));
  }
  // Story designs must stay apart from every country design.
  for (const s of doc.dynamic.story) {
    const sr = storyAsRecord(s, doc);
    for (const r of all) {
      const dd = designDistance(sr, r);
      const sibling = String(s.parent).includes(r.tag);
      const min = sibling ? TUNING.siblingDistanceMin : TUNING.designDistanceMin;
      if (dd < min) f.push(finding('distinct', `${s.cosmetic_tag}/${r.key}`, `story flag near-identical to ${sibling ? 'its parent' : 'a country'} (distance ${dd} < ${min})`));
    }
  }
  // Small flag: signature and colour grid within each region.
  const byRegion = groupBy(all, (r) => r.region);
  for (const [reg, rs] of Object.entries(byRegion)) {
    const sig = new Map();
    for (const r of rs) {
      const k = `${r.field.division}|${r.field.tinctures.map((t) => t.hex).join(',')}`;
      if (sig.has(k)) f.push(finding('small_flag', `${sig.get(k)}/${r.key}`, `same small-flag signature in ${reg}`));
      sig.set(k, r.key);
    }
    for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
      const de = smallGridDistance(rs[i], rs[j]);
      if (de < TUNING.smallFlagDeltaEMin) f.push(finding('small_flag', `${rs[i].key}/${rs[j].key}`, `small flags too alike in ${reg} (grid Delta E ${de.toFixed(1)} < ${TUNING.smallFlagDeltaEMin})`));
    }
  }
  return { findings: f, minPair };
}

function storyAsRecord(s, doc) {
  const { CH } = paletteIndex(doc);
  const cls = (id) => CH[s.culture]?.[id]?.class ?? 'token';
  return {
    key: s.cosmetic_tag, field: { division: s.field.division, line: s.field.line, tinctures: s.field.tinctures },
    primary_charge: { id: s.primary_charge.id, class: cls(s.primary_charge.id), tincture: s.primary_charge.tincture, count: 1 },
    secondary_charge: s.secondary_charge ? { id: s.secondary_charge.id } : null,
    marks: s.marks ?? [],
  };
}
const groupBy = (xs, fn) => xs.reduce((m, x) => ((m[fn(x)] ??= []).push(x), m), {});

export function checkCaps(doc) {
  const f = [];
  const perCulture = new Map(), perRegion = new Map();
  for (const r of doc.countries) {
    const ck = `${r.culture}|${r.primary_charge.id}`, rk = `${r.region}|${r.primary_charge.id}`;
    perCulture.set(ck, [...(perCulture.get(ck) ?? []), r.key]);
    perRegion.set(rk, [...(perRegion.get(rk) ?? []), r.key]);
  }
  for (const [k, v] of perCulture) if (v.length > TUNING.primaryPerCulture) f.push(finding('caps', v.join('/'), `primary charge ${k.split('|')[1]} repeated in culture ${k.split('|')[0]}`));
  for (const [k, v] of perRegion) if (v.length > TUNING.primaryPerRegion) f.push(finding('caps', v.join('/'), `primary charge ${k.split('|')[1]} used ${v.length} times in ${k.split('|')[0]} (cap ${TUNING.primaryPerRegion})`));
  const byRegion = groupBy(doc.countries, (r) => r.region);
  const shares = {};
  for (const [reg, rs] of Object.entries(byRegion)) {
    const cnt = {};
    for (const r of rs) cnt[r.primary_charge.class] = (cnt[r.primary_charge.class] ?? 0) + 1;
    shares[reg] = { flags: rs.length, classes: Object.entries(cnt).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])) };
    if (rs.length >= TUNING.classShareMinRegion) for (const [c, n] of Object.entries(cnt)) if (n / rs.length > TUNING.classShareMax) f.push(finding('caps', reg, `charge class ${c} covers ${n} of ${rs.length} flags`));
  }
  return { findings: f, shares };
}

const recordText = (r) => [r.blazon, r.primary_charge.name, r.secondary_charge?.name ?? '', r.meaning].join(' \n ');
const blazonText = (r) => [r.blazon, r.primary_charge.name, r.secondary_charge?.name ?? ''].join(' \n ');

export function checkForbidden(doc, pantheon) {
  const f = [];
  const items = [
    ...doc.countries.map((r) => ({ where: r.key, people: r.people, all: recordText(r), blazon: blazonText(r), rec: r })),
    ...doc.dynamic.story.map((s) => ({ where: s.cosmetic_tag, people: null, all: [s.blazon, s.meaning].join(' \n '), blazon: s.blazon, rec: null, names: storyChargeNames(s, doc) })),
  ];
  for (const it of items) {
    for (const rule of FORBIDDEN) {
      const text = rule.scope === 'blazon' ? it.blazon : it.all;
      const m = text.match(rule.re);
      if (!m) continue;
      if (rule.id === 'pentagram_word') continue; // the drawn figure is checked by tag below; the word never appears in blazons
      f.push(finding(`forbidden:${rule.id}`, it.where, `"${m[0]}"`));
    }
  }
  // Grammar text: retired names, the servant, the wider world, lettering in charge drawings.
  for (const [cid, g] of Object.entries(doc.cultures)) {
    const text = [g.name, g.ornament, ...g.charges.map((c) => `${c.name} ${c.meaning}`), ...Object.values(g.forms ?? {})].join(' \n ');
    for (const id of ['zol_servant', 'retired_names', 'wider_world', 'palm_tree', 'snowflake']) {
      const rule = FORBIDDEN.find((x) => x.id === id);
      const m = stripNegations(text).match(rule.re);
      if (m) f.push(finding(`forbidden:${id}`, cidWhere(cid), `"${m[0]}" in the grammar`));
    }
  }
  // Charge tags: camel once in the East, skull once per region and never for corsairs or the dead, a sun disc once per
  // culture, the pentagram only in a demon sigil, the emblem sigil only for Zol's Mistake, the gate only for Volgan's realm.
  const tagsOf = (r) => [r.primary_charge, r.secondary_charge].filter(Boolean).flatMap((c) => CHARGE_TAGS[c.id] ?? []);
  const count = (tag, filter) => doc.countries.filter((r) => filter(r) && tagsOf(r).includes(tag)).map((r) => r.key);
  const eastSouth = (r) => ['east_lands', 'south_lands'].includes(r.region);
  const camels = count('camel', eastSouth);
  if (camels.length > 1) f.push(finding('forbidden:camel', camels.join('/'), 'more than one camel in the East and South'));
  for (const r of doc.countries) if (tagsOf(r).includes('camel') && !eastSouth(r)) f.push(finding('forbidden:camel', r.key, 'a camel outside the East'));
  for (const [reg, rs] of Object.entries(groupBy(doc.countries, (r) => r.region))) {
    const sk = rs.filter((r) => tagsOf(r).includes('skull'));
    if (sk.length > 1) f.push(finding('forbidden:skull', sk.map((r) => r.key).join('/'), `more than one skull in ${reg}`));
  }
  for (const r of doc.countries) if (tagsOf(r).includes('skull') && (r.culture === 'corsair_lords' || r.people === 'the_dead')) f.push(finding('forbidden:skull', r.key, 'a skull for corsairs or the dead'));
  for (const [cul, rs] of Object.entries(groupBy(doc.countries, (r) => r.culture))) {
    const sd = rs.filter((r) => tagsOf(r).includes('sun_disc'));
    if (sd.length > 1) f.push(finding('forbidden:sun_disc', sd.map((r) => r.key).join('/'), `more than one sun disc in ${cul}`));
  }
  for (const r of doc.countries) {
    const tags = tagsOf(r);
    if (tags.includes('pentagram') && r.people !== 'demons') f.push(finding('forbidden:pentagram', r.key, 'a pentagram outside a demon sigil'));
    if (tags.includes('zol_emblem') && r.key !== 'zols_mistake') f.push(finding('canon:zol_emblem', r.key, 'the Will of Zol on another realm'));
    if (tags.includes('volgan_gate') && r.key !== 'puvulan') f.push(finding('canon:volgan_gate', r.key, 'the Gate of Nafeher on another realm'));
    if ((tags.includes('disc') || tags.includes('lozenge')) && r.field.division === 'plain') f.push(finding('forbidden:plain_disc', r.key, 'a large plain disc or lozenge on a plain field'));
    if (r.field.division === 'gyronny' && r.marks.some((m) => ['enclave_orle', 'charter_border'].includes(m.mark))) f.push(finding('forbidden:owner_emblem', r.key, 'a frame over crossed diagonals'));
    if (r.field.division === 'gyronny') {
      const hexes = r.field.tinctures.map((t) => t.hex);
      if (hexes.some((h) => luminance(h) < 0.02) && hexes.some((h) => /gold/i.test(r.field.tinctures.find((t) => t.hex === h)?.name ?? ''))) f.push(finding('forbidden:real_patterns', r.key, 'gyronny gold and black'));
    }
  }
  const pentas = doc.countries.filter((r) => tagsOf(r).includes('pentagram'));
  if (pentas.length > 1) f.push(finding('forbidden:pentagram', pentas.map((r) => r.key).join('/'), 'more than one pentagram in Aoaz'));
  // Zol's Mistake: the emblem alone.
  const zol = doc.countries.find((r) => r.key === 'zols_mistake');
  // Round 6 (lead): the Will of Zol is drawn as a non-circular element of its sign (a broken bar), never a roundel.
  if (zol && (zol.primary_charge.id !== 'broken_bar' || zol.secondary_charge || zol.marks.length)) f.push(finding('canon:zol_emblem', 'zols_mistake', 'the arms show more than the one broken bar of the Will of Zol'));
  // Named gods: no name and no device on any country or story flag.
  const godNames = new RegExp(`\\b(${pantheon.gods.map((g) => g.name).join('|')})\\b`, 'i');
  for (const it of items) {
    const m = it.all.match(godNames);
    if (m) f.push(finding('canon:named_god', it.where, `names ${m[0]}`));
    for (const [god, re] of Object.entries(GOD_DEVICES)) {
      const text = it.rec ? [it.rec.primary_charge.name, it.rec.secondary_charge?.name ?? ''].join(' \n ') : it.names;
      const mm = text.match(re);
      if (mm) f.push(finding('canon:god_device', it.where, `reproduces the device of ${god} ("${mm[0]}")`));
    }
  }
  // Named persons never as charges; the deny-list on the Worshipdom and Aenor public arms.
  for (const it of items.filter((x) => x.rec)) {
    const m = blazonText(it.rec).match(NAMED_PERSONS);
    if (m) f.push(finding('canon:named_person', it.where, `"${m[0]}" in the drawing`));
  }
  for (const key of ['worshipdom', 'aenor']) {
    const r = doc.countries.find((x) => x.key === key);
    if (!r) continue;
    const m = recordText(r).match(AFRIT_DENY);
    if (m) f.push(finding('canon:afrit_deny', key, `"${m[0]}" on the public arms`));
    if (key === 'worshipdom' && r.marks.some((x) => x.mark === 'crown')) f.push(finding('canon:afrit_deny', key, 'a crown before the King of the East'));
  }
  for (const s of doc.dynamic.story.filter((x) => /faithful|ashen|worshipdom_east/.test(x.cosmetic_tag))) {
    const m = [s.blazon].join(' ').match(AFRIT_DENY);
    if (m) f.push(finding('canon:afrit_deny', s.cosmetic_tag, `"${m[0]}" on a public story flag`));
  }
  // The Great Wall of Aenor is a natural range: no masonry on any realm of the range.
  for (const r of doc.countries.filter((x) => ['vale_folk', 'wall_delvers', 'king_warrens', 'hilofrim_herders'].includes(x.culture))) {
    const m = blazonText(r).match(/\b(tower|walls?|battlements?|masonry|bricks?|rampart|built)\b/i);
    if (m) f.push(finding('forbidden:wall_motifs', r.key, `"${m[0]}" on a realm of the Great Wall range`));
  }
  return f;
}
const cidWhere = (cid) => `grammar:${cid}`;
// Grammar prose states its own prohibitions ("never a palm tree"); those clauses are not motifs.
export const stripNegations = (text) => text.replace(/another fiction's[^.]*\./gi, '').replace(/\b(no|never|not|nor|without|refused|banned|is not drawn|are not drawn)\b[^.;:]*/gi, '');
function storyChargeNames(s, doc) {
  const { CH } = paletteIndex(doc);
  const name = (c) => c && (c.name ?? CH[s.culture]?.[c.id]?.name ?? c.id);
  return [name(s.primary_charge), name(s.secondary_charge) ?? ''].join(' \n ');
}

export function checkDynamic(doc, roster) {
  const f = [];
  if (doc.dynamic.story.length !== 9) f.push(finding('dynamic', 'story', `${doc.dynamic.story.length} story flags (9 expected)`));
  if (doc.dynamic.fallback.length !== roster.dynamicTags) f.push(finding('dynamic', 'fallback', `${doc.dynamic.fallback.length} fallback rules for ${roster.dynamicTags} dynamic tags`));
  const tags = new Set(doc.dynamic.fallback.map((x) => x.tag));
  for (let i = 1; i <= roster.dynamicTags; i++) { const t = `D${String(i).padStart(2, '0')}`; if (!tags.has(t)) f.push(finding('dynamic', t, 'no fallback design')); }
  const sigs = new Set();
  for (const x of doc.dynamic.fallback) {
    const k = `${x.field.division}|${x.field.tinctures.map((t) => t.hex).join(',')}|${x.primary_charge.id}|${x.primary_charge.tincture.hex}`;
    if (sigs.has(k)) f.push(finding('dynamic', x.tag, 'fallback design repeats another'));
    sigs.add(k);
  }
  const rosterTags = new Set(roster.realms.map((r) => r.tag));
  for (const s of doc.dynamic.story) {
    const m = String(s.parent).match(/\b([A-Z]{3})\b/);
    if (m && !rosterTags.has(m[1])) f.push(finding('dynamic', s.cosmetic_tag, `parent ${m[1]} is not a roster tag`));
    if (/\bY[0-9A-Z]{2}\b/.test(String(s.parent))) f.push(finding('dynamic', s.cosmetic_tag, 'parent is an old debug tag'));
  }
  return f;
}

export function runChecks(doc, src) {
  const distinct = checkDistinctness(doc);
  const caps = checkCaps(doc);
  const groups = {
    coverage: checkCoverage(doc, src.roster),
    grammars: checkGrammars(doc, src.culturesNew),
    records: checkRecordRules(doc),
    forms: checkForms(doc, src.roster),
    distinctness: distinct.findings,
    caps: caps.findings,
    forbidden: checkForbidden(doc, src.pantheon),
    dynamic: checkDynamic(doc, src.roster),
  };
  const findings = Object.values(groups).flat();
  return { groups, findings, minPair: distinct.minPair, shares: caps.shares };
}

// ---------------------------------------------------------------------------------------------------------------
// The spec's generated regions
// ---------------------------------------------------------------------------------------------------------------

const REGION_ORDER = ['middle_lands', 'north_lands', 'cold_lands', 'west_lands', 'dark_lands', 'ember_lands', 'zols_mistake', 'magical_lands', 'lands_of_the_sun', 'east_lands', 'south_lands', 'islands_of_the_south', 'tritons_islands'];
const humanForm = (s) => s.replace(/_/g, ' ');
const MC = (t) => (t.class === 'metal' ? 'M' : 'C');

export function renderFamilies(doc) {
  const rows = Object.values(doc.families).map((f) => `| ${f.name} | ${f.line ?? 'own'} | ${f.mark_text} | ${f.meaning} | ${f.members.join(', ')} |`);
  return ['| Family | Line | Mark | Meaning | Cultures |', '| --- | --- | --- | --- | --- |', ...rows].join('\n');
}

export function renderCultures(doc, roster) {
  const count = {}, second = {};
  for (const r of roster.realms) {
    count[cultureOf(r.culture)] = (count[cultureOf(r.culture)] ?? 0) + 1;
    if (r.cultureSecondary) second[cultureOf(r.cultureSecondary)] = (second[cultureOf(r.cultureSecondary)] ?? 0) + 1;
  }
  const famName = (id) => doc.families[id]?.name ?? id;
  const out = [];
  const ids = Object.keys(doc.cultures);
  for (const id of ids) {
    const g = doc.cultures[id];
    const realms = roster.realms.filter((r) => cultureOf(r.culture) === id).map((r) => r.name);
    out.push(`### ${g.name} (\`${id}\`)`, '');
    const meta = [`*People:* ${humanForm(g.people)}.`, `*Family:* ${famName(g.family)}.`, `*Language:* ${g.language ?? 'unrecorded'}.`, `*Faith:* ${g.faith}${g.faith_secondary ? ` (with ${g.faith_secondary})` : ''}.`, `*Line:* ${g.line ?? 'none'}.`, `*Realms:* ${count[id] ?? 0}${realms.length ? ` (${realms.join(', ')})` : ''}${second[id] ? `; second culture of ${second[id]}` : ''}.`];
    if (g.aliases) meta.push(`*Formerly:* ${g.aliases.map((a) => `\`${a}\``).join(', ')} (the roster still writes the old id; both resolve here).`);
    if (g.supersedes) meta.push(`*Supersedes:* \`${g.supersedes}\` (retired).`);
    out.push(meta.join(' '), '');
    out.push(`*Palette:* ${g.palette.map((t) => `${t.name} \`${t.hex}\` (${MC(t)})`).join('; ')}.`, '');
    out.push(`*Divisions:* ${g.divisions.join(', ')}.`, '');
    out.push('| Charge | Drawn as | Meaning in this culture |', '| --- | --- | --- |');
    for (const c of g.charges) out.push(`| \`${c.id}\`${c.id === g.difference.restoration_charge ? ' (restoration)' : ''} | ${c.name} | ${c.meaning} |`);
    out.push('', `*Ornament:* ${g.ornament}`, '');
    const forms = Object.entries(g.forms ?? {}).map(([k, v]) => `${humanForm(k)}: ${v.replace(/\.$/, '')}`).join('; ');
    out.push(`*Rank and form:* ${forms || 'none'}.${g.crown ? ` *Crown:* ${g.crown}.` : ''}`, '');
    out.push(`*Breakaway difference:* ${g.difference.breakaway_mark} (dissent tincture ${g.difference.dissent_tincture}).`, '');
    if (g.refused_from_source) out.push(`*Not drawn from the culture card:* ${g.refused_from_source}`, '');
  }
  return out.join('\n').trimEnd();
}

export function renderPeoples(doc) {
  const out = [];
  for (const p of doc.peoples) {
    out.push(`### ${p.name} (\`${p.id}\`)`, '', `*Status:* ${p.status}. *Line:* ${p.line}.`, '');
    if (p.palette?.length) out.push(`*Palette:* ${p.palette.map((t) => `${t.name} \`${t.hex}\` (${MC(t)})`).join('; ')}.`, '');
    if (p.divisions?.length) out.push(`*Divisions:* ${p.divisions.join(', ')}.`, '');
    if (p.charges?.length) { out.push('| Charge | Drawn as | Meaning |', '| --- | --- | --- |'); for (const c of p.charges) out.push(`| \`${c.id}\` | ${c.name} | ${c.meaning} |`); out.push(''); }
    out.push(`*Ornament:* ${p.ornament}`, '', `*Rank and form:* ${p.rank}`, '', `*Kinship:* ${p.kinship}`, '');
    if (p.cultures?.length) out.push(`*Cultures:* ${p.cultures.map((c) => `\`${c}\``).join(', ')}.`, '');
  }
  return out.join('\n').trimEnd();
}

const shortDesign = (r) => {
  const F = r.field.tinctures.map((t) => t.name).join(' and ');
  const P = r.primary_charge;
  const pn = P.count === 3 ? `${P.name.replace(/^an? /, '')} (three)` : P.name;
  const S = r.secondary_charge ? `; ${r.secondary_charge.name} in ${r.secondary_charge.tincture.name}` : '';
  const M = r.marks.length ? ` [${r.marks.map((m) => humanForm(m.mark)).join(', ')}]` : '';
  return `${humanForm(r.field.division)}, ${F}; ${pn} in ${P.tincture.name}${S}${M}`;
};

export function renderCountries(doc, checks) {
  const out = [];
  const byRegion = groupBy(doc.countries, (r) => r.region);
  out.push('| Region | Flags | Largest charge classes |', '| --- | ---: | --- |');
  for (const reg of REGION_ORDER) {
    const s = checks.shares[reg];
    if (!s) continue;
    out.push(`| ${byRegion[reg][0].region_name} | ${s.flags} | ${s.classes.slice(0, 3).map(([c, n]) => `${c} ${n}`).join(', ')} |`);
  }
  out.push(`| All | ${doc.countries.length} | |`, '');
  for (const reg of REGION_ORDER) {
    const rs = byRegion[reg];
    if (!rs) continue;
    out.push(`### ${rs[0].region_name}`, '', '| Tag | Realm | Culture | Design | Meaning |', '| --- | --- | --- | --- | --- |');
    for (const r of rs) out.push(`| ${r.tag} | ${r.name} | ${r.culture} | ${shortDesign(r)} | ${r.meaning} |`);
    out.push('');
  }
  return out.join('\n').trimEnd();
}

export function renderStory(doc) {
  const rows = doc.dynamic.story.map((s) => `| \`${s.cosmetic_tag}\` | ${s.name} | ${s.parent} | ${s.gate} | ${s.blazon} | ${s.meaning} |`);
  return ['| Cosmetic tag | Name | Parent | Gate | Design | Meaning |', '| --- | --- | --- | --- | --- | --- |', ...rows].join('\n');
}

export function renderChecks(doc, checks) {
  const lines = ['| Check group | Findings |', '| --- | ---: |'];
  for (const [k, v] of Object.entries(checks.groups)) lines.push(`| ${k} | ${v.length} |`);
  lines.push('', `The closest pair of designs is ${checks.minPair.a} and ${checks.minPair.b} at a distance of ${checks.minPair.d} (minimum ${TUNING.designDistanceMin}).`);
  return lines.join('\n');
}

export function renderSpec(specText, doc, src, checks) {
  const regions = {
    families: renderFamilies(doc),
    cultures: renderCultures(doc, src.roster),
    peoples: renderPeoples(doc),
    countries: renderCountries(doc, checks),
    story: renderStory(doc),
    checks: renderChecks(doc, checks),
  };
  let text = specText;
  for (const [name, body] of Object.entries(regions)) {
    const re = new RegExp(`(<!-- generated:${name}:start -->)[\\s\\S]*?(<!-- generated:${name}:end -->)`);
    if (!re.test(text)) throw new Error(`spec has no generated:${name} markers`);
    text = text.replace(re, `$1\n${body}\n$2`);
  }
  return text;
}

// ---------------------------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------------------------

function writeAtomic(file, text) {
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, text, 'utf8');
  fs.renameSync(tmp, file);
}
export const serialize = (doc) => JSON.stringify(doc, null, 1) + '\n';

function main() {
  const args = new Set(process.argv.slice(2));
  const src = loadSources();
  const { doc, errors } = build(src);
  const checks = runChecks(doc, src);
  const all = [...errors.map((e) => finding('build', '-', e)), ...checks.findings];
  const cultures = Object.keys(doc.cultures).length;
  console.log(`heraldry: ${doc.countries.length} designs for ${src.roster.realms.length} realms; ${cultures} culture grammars, ${doc.peoples.length} people grammars; ${doc.dynamic.story.length} story flags, ${doc.dynamic.fallback.length} dynamic-tag rules`);
  for (const [k, v] of Object.entries(checks.groups)) console.log(`  ${k.padEnd(13)} ${v.length} finding(s)`);
  console.log(`  closest pair  ${checks.minPair.a} / ${checks.minPair.b} at ${checks.minPair.d}`);
  for (const x of all) console.log(`  ! [${x.rule}] ${x.where}: ${x.message}`);
  if (all.length) { process.exitCode = 1; return; }
  const json = serialize(doc);
  if (args.has('--verify')) {
    const cur = fs.readFileSync(PATHS.heraldry, 'utf8');
    if (cur !== json) { console.log('heraldry.json differs from a fresh build'); process.exitCode = 1; return; }
    console.log('heraldry.json matches a fresh build');
  }
  if (args.has('--write')) {
    writeAtomic(PATHS.heraldry, json);
    const spec = fs.readFileSync(PATHS.spec, 'utf8');
    writeAtomic(PATHS.spec, renderSpec(spec, doc, src, checks));
    console.log('wrote heraldry.json and the generated regions of 06_heraldry.md');
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
