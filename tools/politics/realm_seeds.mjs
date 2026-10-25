// The politics input of the drawn-map import: the 156 realms of the roster as the `realms` of the map tool's workspace
// form of `create_world.countries` (map tool ADR 0069, request ZR-8), in world pixels of the 5,120 x 2,560 frame.
//
//   node tools/politics/realm_seeds.mjs            build, validate and print the summary; writes nothing
//   node tools/politics/realm_seeds.mjs --write    also write tools/politics/data/realm_seeds.json, realm_seeds_report.json
//                                                  and create_world_call.json (the preview call with the countries)
//   node tools/politics/realm_seeds.mjs --check    validate the committed realm_seeds.json against the land and the rules
//   node tools/politics/realm_seeds.mjs --schema   validate create_world_call.json against the tool's published
//                                                  map-operation schema (origin/main, read-only, the tool's own Ajv)
//   --no-drawing                                   build on the model's land alone (the private drawing is absent)
//
// What it does, in order (every step is deterministic; ties break by roster order, then reading order):
//   1 capitals   A realm whose roster capital names a site of the import's geography model takes that site's point. A
//                realm without a site takes the anchor of CAPITAL_ANCHORS: a drawn label read off the owner's drawing in
//                the world frame, a model feature (pass, river end, range, lake, strait end) or a model area (the pole of
//                a forest, plain, ice field or desert the roster names as the realm's land). A realm with neither falls
//                back to its old capital: the old map's capital state centre, moved by the displacement field of the
//                realms whose capitals are sites (old frame to new frame, per roster region). Every point then snaps to
//                the nearest pixel of the land the import reads from the drawing (world_inputs.mjs), PLACE.marginPx
//                inside its coast and PLACE.edgeClearPx inside the frame edge, outside other realms' claims, the unowned
//                area and its own exclusions, and at least PLACE.minSeparationPx from every other realm's points; the
//                snap distance is reported. A site that already stands on that land keeps its exact point.
//   2 seeds      SEED_ANCHORS adds the separate lands the roster or the dossiers name; then every old state of a realm
//                whose projected centre falls on a landmass the realm does not yet stand on, within
//                PLACE.seedMaxFromCapitalPx of its capital, adds one seed there, unless that landmass holds another
//                realm's point (one-owner islands keep one realm) or another realm has more old states on it.
//   3 claims     CLAIMS: lands, model areas or bands along ranges the canon gives to one realm.
//   4 exclusions BARRIERS: the canon lands of one region that the realms of a neighbouring region on the same
//                landmass must not grow into (the far side of the Great Wall belt, the lands north and south of the
//                Zilin marches, the two sides of the Cold Lands neck, the East and South Lands beyond Olen's lowland,
//                the Sun Desert west of the Hardtmuth chain). A contested strip between the two sides stays free.
//   5 unowned    WILD_LANDS: the wild lands the dossiers name, where the model places them and no realm's point lies;
//                where one meets a realm's claim the claim wins (a claim is the roster's or the canon's fixed land, a
//                wild land the dossier's proposal) and the wild land keeps WILD.claimClearancePx from it.
//   6 weights    WEIGHT: target states (the roster's stated extent, else the realm's state count on the old map) over
//                WEIGHT.statesPerUnit, clamped to the tool's 0.05 to 100.
//   7 borders    NATURAL_BORDERS: one-sided exclusion bands along the rivers and ranges the canon names between two
//                realms, where the line lies between their seats.
//   8 subjects   the roster's subject relations go to the report only (the tool's realm object has no overlord).
// Output is in the tool's schema (points as { x, y }, no connectedMainland), validated by countries_validator.mjs
// before anything is written; --schema checks the written create_world call against the tool's published schema.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FRAME, pointInPolygons, circleRing, components, outlines, bandMask, fillRings, erodeBox, dilateBox } from './geometry.mjs';
import { loadWorld, toPx, ZONE_GRID, PATHS, ZIN } from './world_inputs.mjs';
import { validateCountries, validateSubjects, RULES } from './countries_validator.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const OUT = Object.freeze({ seeds: path.join(here, 'data/realm_seeds.json'), report: path.join(here, 'data/realm_seeds_report.json'), call: path.join(here, 'data/create_world_call.json') });
export const PREVIEW_CALL = 'tools/content/data/geography/import/preview_call.json';
export const DEFAULT_TOOL = process.env.HOI4_AGENT_TOOLS_DIR ?? 'C:/Users/klimp/Documents/Projects/hoi4-agent-tools';

// ---------------------------------------------------------------------------------------------------- tuning
export const PLACE = Object.freeze({
  marginPx: 3, // a point stands this far inside the coast of both readings of the land
  minSeparationPx: 20, // points of two realms at least this far apart (about one province of the import)
  snapReachPx: 220, // how far a point may move to reach acceptable land
  seedSnapReachPx: 40, // how far an old state's centre may move to reach a land
  seedMaxFromCapitalPx: 320, // an old state projected farther than this from the realm's capital adds no seed
  seedMinLandPx: 400, // an old state adds a seed only on a model land of at least this many pixels (about one province)
  validatorMinSeparationPx: 12, // below this the validator warns that two realms' points may share a province
  // the import clears land in open-sea bands at the frame edges (205 px east and west, 64 px north and south, ragged up
  // to 1.5 times deeper; convert_for_import.mjs IMPORT.edge): a generated point keeps this far from the frame edge
  edgeClearPx: Object.freeze({ x: 253, y: 88 }),
});
export const FIELD = Object.freeze({
  sigmaPx: 160, // Gaussian reach of one capital-site anchor in the old-to-new displacement field
  priorWeight: 0.15, // weight of the region's mean displacement where no anchor is near
});
export const WEIGHT = Object.freeze({ statesPerUnit: 4, min: 0.05, max: 100, decimals: 2, populationPerState: 250000 });
export const POLYGON = Object.freeze({ tolPx: 2, minAreaPx: 64, bandMinRadiusPx: 12 });
export const WILD = Object.freeze({
  claimClearancePx: 8, // a wild land keeps this far from any realm's claim (the claim wins where they meet)
  landCoverPx: 8, // a wild land that is a whole model island grows this far so its outline covers the drawn coast
});
export const COUNTRIES_OPTIONS = Object.freeze({
  islands: 'one-owner',
  islandsReason: 'Every drawn island in the dossiers belongs to one realm or is a named wild place; the approved layout of 17 October 2026 gives each small island one owner (docs/generation/assumptions.md, "a small island has one owner"). With one-owner a landmass no seed is on goes whole to the first realm that reaches it over the sea (ADR 0060).',
  // not part of the released schema (4.5.0: the countries object is strict); kept here as the intended rule
  connectedMainlandNotSent: 'The tool\'s schema has no connectedMainland key. The intended rule stands: every mainland realm is one connected piece in the approved layout (docs/generation/assumptions.md, "Every mainland country is one connected piece; island possessions are allowed"); the territory service joins a realm\'s seeds on its capital\'s landmass by a corridor (ADR 0060). Check the preview for split realms.',
  subjectsNotSent: 'The tool\'s realm object has no overlord key (ADR 0069 leaves subjects grown inside an overlord out); the 19 subject relations are the mod\'s own (its build writes them into the country histories) and are listed in this report under subjects.',
});

// ---------------------------------------------------------------------------------------------------- canon tables
// Roster region -> the repaired model's region zones that lie in it (used only to report a capital that stands in
// another region's zone; the zones are coarse and never decide a placement).
export const REGION_ZONES = Object.freeze({
  middle_lands: ['middle_lands', 'aenor_isle'], north_lands: ['north_lands'], cold_lands: ['cold_lands', 'windwaith'], west_lands: ['west_lands'],
  dark_lands: ['dark_lands'], ember_lands: ['ember_lands', 'nether'], east_lands: ['east_lands'], south_lands: ['south_lands'],
  islands_of_the_south: ['islands_south'], tritons_islands: ['tritons_islands'], lands_of_the_sun: ['lands_sun'], magical_lands: ['magical_lands'], zols_mistake: ['zols_mistake'],
});

// Capitals of the realms whose roster capital has no site. `at` is a world pixel read off the owner's drawing (the
// registered sheets warped into the world frame, the import's own reading) where the drawing labels the realm or its
// town (or, with `method: 'dossier text'`, a point chosen from the dossier's description where the drawing has no
// label); `feature` names a model feature; `area` a model area whose pole is used; `land` a model land (its pole or
// its western headland); `old: true` the projected old capital.
// Every entry is a proposal (the dossiers mark these seats P) unless `status` says otherwise.
export const CAPITAL_ANCHORS = Object.freeze({
  // Middle Lands (docs/lore/regions/middle_lands.md 2, 10, 11)
  KLU: { feature: 'pass_south_gate', offset: [-36, -4], basis: 'Hungohon, the garrison town at the western foot of the South Pass (middle_lands.md 10, 11).' },
  NOL: { old: true, basis: 'Saelori, the crossing of the south-eastern roads; the old map\'s Noleksun seat (middle_lands.md 10).' },
  FRE: { old: true, basis: 'Hordorton, a spring where the lake road meets the south road; the old map\'s Freshon seat (middle_lands.md 10).' },
  PAZ: { method: 'dossier text', at: [3172, 1652], basis: 'Horlomon, a lake town on a deep bay (middle_lands.md 10): the Great Lake\'s south-east bay between the Hunhun Downs and the Saeton reeds, since Parim, Silesire, Dolepar and Grafas hold the north, east, south and west lobes.' },
  FOT: { feature: 'strait_narrow', end: 0, basis: 'Deoreh, the narrowest crossing of the Leren Sea on the Middle Lands side: the Middle Lands end of the Narrow Strait (middle_lands.md 10).' },
  BRR: { feature: 'range_cursed_mountains', t: 1, basis: 'Glimzig, the throne-cave deep under the Cursed Mountains; the south end of the ridge, as the old carve (middle_lands.md 2.9, 10).' },
  OLO: { feature: 'range_deodolor', t: 0.5, basis: 'Tovodor in the Deodolor Hills north of the Stone Forest (middle_lands.md 2.3, 3.7).' },
  DNL: { area: 'forest_kingdom', basis: 'Thamiel, a hill in the Kingdom Forests (the model\'s Dunelaeth forest) at the foot of Lunhrim (middle_lands.md 10, 11).' },
  ANR: { area: 'forest_crown', basis: 'Baeldran, the oldest stand of the Aenor Forest (middle_lands.md 2.5a, 11).' },
  CUR: { area: 'waste_cursed_lands', basis: 'Morluma, deep in the sour ground of the Cursed Lands (middle_lands.md 10).' },
  BLO: { area: 'forest_bloody', basis: 'Giritren, the oldest stand of red oak in the Bloody Forest (middle_lands.md 10).' },
  TIR: { feature: 'river_hilorn', end: 'source', basis: 'Tirbur, where the Hilorn\'s head-streams meet, furthest from the Hilorn Gap (hirolon.md 10).' },
  // North Lands (north_lands.md 10, 11; labels of the East-Earth sheet)
  MOO: { at: [3040, 752], basis: 'The drawn label Molot at the island\'s northern tip, with Knorvik (drawn Allegro) beside it.' },
  KER: { at: [3068, 818], basis: 'The drawn label Keredor-Hellekton; Nuadoso, the shared inlet of the double crown.' },
  TLV: { at: [2845, 860], basis: 'The drawn labels Sensai and Gil\'dul (Kerhil): the long vale on the island\'s west coast.' },
  TOL: { at: [2770, 945], basis: 'Migur, the island principality\'s harbour: the drawn island west of the long vale (land_island_008).' },
  HEO: { at: [2935, 866], basis: 'The drawn labels Heodwa Lands and Agniy (drawn Agnas): the central hills.' },
  HRA: { at: [2895, 908], basis: 'The drawn High Mountains at the island\'s centre; Ilmahrim, the deep hall.' },
  MIA: { at: [3150, 880], basis: 'The drawn labels Mina, Mine Din, Fargur and Thowson: the Etonia ore hills; Gilvian below them.' },
  DOL: { feature: 'lake_evian', side: 'west', basis: 'Parur, the lake league\'s market on Dolpar (the model\'s lake_evian), with the drawn Cinargo west of it.' },
  MUS: { at: [2893, 990], basis: 'The drawn label Must... under the Solondor Mountains: Krakur, the dwarf goblins\' largest warren.' },
  // Cold Lands (cold_lands.md 10, 11; labels of the Cold Lands sheet)
  FEA: { at: [1610, 458], basis: 'The drawn town Azenoalion on the Naepu.' },
  AUT: { at: [1612, 712], basis: 'The drawn town Vaestia where the east-coast forest meets the coast, beside the drawn Wonderland (Austklev).' },
  WRL: { area: 'forest_worlond', basis: 'Tarvak, a forest town in the Worlond Forest on the neck.' },
  PLT: { feature: 'river_fandan', end: 'mouth', basis: 'Fandhavn at the Fandan mouth, beside the drawn label Poloto.' },
  HLD: { at: [700, 684], basis: 'The drawn town Fentene, the snowline fair-town on the south coast facing the Coldor Channel; the import reads the channel just south of the label, so the seat stands on the coast north of it.' },
  GLI: { feature: 'range_coldor_mountains', t: 0.15, basis: 'Drikzig in the warm-spring valleys of the Coldor Mountains; the drawn glens Agoron and Belor lie beside the range\'s western end.' },
  XIS: { at: [300, 640], basis: 'Akahew, where the upland road meets the coast road: the west coast below the drawn Rion and Yeneldmore (the drawn label itself lies on water as the import reads it).' },
  PRT: { at: [1150, 440], basis: 'The drawn labels Pertogor and Londor (Faaennar): the sheep vale east of Melkgard.' },
  OMR: { at: [1000, 272], basis: 'The drawn label Omar beside Mp\'E: the border moor between Melkgard and Mp\'E.' },
  POT: { at: [740, 195], basis: 'The drawn label Portogalor on the north coast beside the Olsuaon Massif.' },
  KVI: { at: [272, 300], basis: 'The drawn moot-town Esrom by Gaadon in the far north-west.' },
  ORW: { at: [330, 278], basis: 'The drawn labels Orewell and Guerlon: the iron town of the Orewell lowland.' },
  NIV: { at: [400, 178], basis: 'The drawn label Titanos (Nivaros) on the heights of the far north-west.' },
  YEI: { area: 'hills_yeti_lands', basis: 'Ghaumbhu, the high cave of the Yeti Lands shelf south of the Coldor Mountains.' },
  GHH: { area: 'ice_north_yeti_lands', basis: 'Huummal, the hum-cave of the snow plain the drawing calls North Yeti Lands (Ghaahu).' },
  VND: { land: 'land_island_001', side: 'west', basis: 'Porideon, the council port on the westward headland of the Vindael ice arm (the model\'s land_island_001).' },
  // West Lands (west_lands.md 10, 11; labels of the West-Earth sheet)
  WER: { feature: 'range_erg', t: 0.5, basis: 'Caer-Erg, the hill-fort at the Erg spur on the drawn Erg finger.' },
  LAB: { at: [1070, 1175], basis: 'The drawn label Lambin: Faennon, the granary town of the eastern downs.' },
  THN: { at: [860, 1220], basis: 'The drawn label Thenon: Tummin in the olive lowland.' },
  DOB: { at: [800, 1350], basis: 'The drawn basin label (HKY, the Ronbo basin) under the Herlitz Mountains: Luddum.' },
  BRU: { at: [860, 1420], basis: 'The drawn Dusty Mountains: Hrennost, where the West\'s first powder was made from their saltpetre.' },
  GRO: { feature: 'range_bolpor_boldor', t: 0.5, basis: 'Hrunost in the Bolpor and Boldor Mountains on the east flank of the Kulolo valley.' },
  SAO: { feature: 'lake_ilurdor', side: 'north', basis: 'Lochon, the guild town on the Ilurdor lagoon at the Kulolo mouth.' },
  BLD: { at: [920, 1390], basis: 'The drawn town Toples at the crossroads of the southern roads.' },
  CRG: { at: [1320, 1430], basis: 'The drawn label Corogon: Oslodon, the consuls\' port on the bay facing the central sea.' },
  WEN: { at: [1480, 1420], basis: 'The drawn label Argo (Wennarith) on the Varnondor peninsula\'s eastern bend.' },
  // Dark Lands (dark_lands.md 10, 11; labels of the Dark Lands sheet)
  DRK: { feature: 'pass_dark_gate', basis: 'Doldes, the gate hold on the Dark Gate pass.' },
  BUN: { at: [2473, 1150], basis: 'The drawn label South Goldor at the Goldoroth Volcano: the warm deep caves the volcano heats (Burnikzig).' },
  VES: { at: [2529, 1242], basis: 'The drawn Goldoroth Dead Lands, renamed the Goldoroth Ash Fields, facing the Sea of Dolon.' },
  BLK: { at: [2723, 1098], basis: 'The drawn label Blackton on the eastern coast: Dontadur, the largest of the five harbours.' },
  BLN: { at: [2457, 1281], basis: 'The drawn Belonton Border: Notle, the sea-orc harbour on the borderland coast.' },
  TRO: { area: 'forest_troll', basis: 'Holos, Smash\'s great cave in the Troll Forest\'s heart.' },
  HOO: { at: [2651, 1114], basis: 'The drawn Giant Forest by the Giant River: Maruunos, the cairn-hall.' },
  DAK: { area: 'forest_dark', basis: 'Notdertu, the forest hold of the Dark Forests\' band.' },
  SKR: { at: [2540, 1112], basis: 'The drawn Fonoor Forest: Gollonlon at the forest\'s edge.' },
  DUN: { at: [2784, 1181], basis: 'The drawn labels Dun and Dunbulinor: Dobudo on the Dun Sea.' },
  BRT: { at: [2607, 1278], basis: 'The drawn label Britadon: the hill hold of the south-east iron hills.' },
  WIL: { at: [2401, 1181], basis: 'The drawn label Wild Lands: Zudertu, the largest winter camp.' },
  // Ember Lands (ember_lands.md 2, 10, 11)
  KHO: { method: 'dossier text', at: [3040, 2300], basis: 'Khorvazel in the Nether foothills: the island\'s south coast facing the Nether across the Nether Sound (ember_lands.md 11).' },
  HAL: { method: 'dossier text', at: [3540, 1925], basis: 'Halon, the salt pans of the peninsula\'s Veleeda coast: the south shore of the arm of the Mirolon peninsula east of Miherta\'s tongue (the tongue is too narrow for both seats); the model puts the lowland further east on the eastern mainland.' },
  OLE: { at: [3670, 2050], basis: 'The drawn labels Gelbus and Luminor east of the Great Swamp: the shrine-town of the isle of the Holy Breeze.' },
  // East Lands (east_lands.md 10, 11; labels of the mirrored South-Earth sheet)
  ERC: { old: true, basis: 'Atonto on its river in the southern mountains; the old map\'s Erco seat (the drawing\'s Morodor lies beyond the frame).' },
  PLO: { at: [4840, 2230], basis: 'The drawn label Plutondo above the Plutondo Vents: Vobibiz in the southern valley.' },
  DLB: { at: [4130, 1480], basis: 'The drawn Delbiz Grasslands: Furtonlin, the horse-fair town toward the rift coast.' },
  KRS: { at: [4171, 1995], basis: 'The drawn label read as Kersian: Osrale at the junction of the Lake Road and the Gold Road.' },
  MOS: { at: [4343, 1950], basis: 'The drawn label Mostok: Cereosa at the central road junction.' },
  AZA: { at: [4380, 2000], basis: 'The drawn label read as Azano beside Mostok: Ceralon, the house\'s city.' },
  OBM: { at: [4271, 2050], basis: 'The drawn label Obmi at the jungle\'s edge: Kerdoco.' },
  PRN: { at: [4157, 2150], basis: 'The drawn label Pornyior beside the drawn Argon: Nerhuus below the devils\' mountains (the roster says below Mount Ergo; see the owner questions).' },
  WOQ: { at: [4280, 1100], basis: 'The drawn label Woqood on the snow coast: Pehami, the sealers\' moot on the Kusmeel coast.' },
  ORA: { land: 'land_island_004', side: 'centre', basis: 'Nodoqood, the harbour of the drawn isle Orato (the model\'s land_island_004).' },
  // South Lands (south_lands.md 10, 11)
  WAH: { feature: 'site_sun_desert', basis: 'Biir-Raab, the greatest oasis of the dune sea: the model\'s Sun Desert town.' },
  // Magical Lands (magical_lands.md 10, 11)
  LCC: { old: true, basis: 'Hidirim, the best harbour of the northern rift shore; the old map\'s Lccimio seat (the drawing labels Lccimio there).' },
  ELD: { method: 'dossier text', at: [3880, 1640], basis: 'Lenkei, the Archive at the southern end of the rift coast where the old roads stop (roster: the southern rift shore); the old map and the drawn Endelond label put it in the north-east instead (owner question Q-61).' },
  TES: { area: 'plain_herrodon_vale', basis: 'Testebur, where the Teste Brook leaves the Teste Vale.' },
  LUV: { feature: 'strait_rift_narrows', end: 1, basis: 'Hisemrak, the quay town at the Rift Narrows.' },
  // Triton's Islands (tritons_islands.md 10, 11)
  FNG: { land: 'land_island_022', side: 'centre', basis: 'Kapai, the pilots\' harbour of the northern isles: the northernmost Triton island (land_island_022).' },
  BEN: { feature: 'range_benan', t: 0.5, basis: 'Torni, a cove under the Benan Mountains (the model\'s range_benan).' },
  SEI: { land: 'land_island_029', side: 'centre', basis: 'Vesko, the moot isle of the four Seite isles: the long isle under the drawn Seite Islands label (land_island_029).' },
  WND: { at: [445, 1655], basis: 'Audailon, the windward capes\' harbour: the drawn Sondor, Cheko and Amarelo on the south of the eastern arc.' },
  HLN: { land: 'land_island_059', side: 'centre', basis: 'Sonrale, the wreck-right lords\' harbour on the storm isles by the Kilos Sound (former Kim Sound): the isle south-east of the sound (land_island_059).' },
  SNT: { land: 'land_island_014', side: 'centre', basis: 'Straton on the outer western arc facing the Santon Sea (land_island_014).' },
  // Islands of the South (islands_of_the_south.md 2, 10, 11)
  SDE: { land: 'land_island_027', side: 'centre', basis: 'Ponwan at the end of the western arc: its westernmost island (land_island_027).' },
  KEA: { land: 'land_island_034', side: 'centre', basis: 'Tuwang, the terrace town of the rice isles, next along the western arc (land_island_034).' },
  KAM: { land: 'land_island_041', side: 'centre', basis: 'Bukonyo above the tally-caves of the cave island (land_island_041).' },
  YON: { land: 'land_island_026', side: 'centre', basis: 'Yongwa on the Yong lagoon ring: the model\'s ring-shaped island land_island_026.' },
  // Lands of the Sun (lands_of_the_sun.md 2, 10, 11)
  SOY: { land: 'land_island_023', side: 'centre', basis: 'Ileslia, the main harbour of the northern isles: the northernmost island of the Sun group (land_island_023).' },
  GOO: { method: 'dossier text', at: [430, 2300], basis: 'Elgagen, the largest Sunfolk steading of the western grasslands, west of the Sun Mountains.' },
  LIG: { area: 'plain_sun_grasslands', basis: 'Eldoga, the largest valley of the eastern lowland and the Sun Grasslands.' },
  IHU: { feature: 'volcano_great', basis: 'Holang, the harbour of Hol under the Great Volcano.' },
  GOF: { area: 'forest_god', basis: 'The Keepers\' Glade in the God Forest south of Sun Lake.' },
});

// Extra seeds the canon names (separate lands); old-state seeds are added automatically.
export const SEED_ANCHORS = Object.freeze({
  LER: [{ area: 'ice_lerenwaith', basis: 'Lerendor\'s North (former Lerenwaith) is part of Lerendor (decision K49; roster extent).' }],
  PUV: [{ land: 'land_island_033', side: 'centre', basis: 'The isle of Exhoros (drawn Vez) off Volgan\'s coast (roster extent).' }, { land: 'land_island_060', side: 'centre', basis: 'Unlo, an isle of Volgan\'s coast (ember_lands.md 2, 11).' }],
  MIR: [{ area: 'marsh_mirolon', basis: 'The Great Swamp of Mirolon (roster extent).' }],
});

// Claims: land the canon gives to one realm whole.
export const CLAIMS = Object.freeze({
  ZOL: [{ zone: 'zols_mistake', basis: 'Zol\'s Mistake is the whole black north and every black island of the Kusmeel (zols_mistake.md; roster extent).' }],
  NET: [{ land: 'land_nether_island', basis: 'The Nether is the volcanic land south of the Ember Lands island (nether.md; the model\'s land_nether_island).' }],
  VND: [{ land: 'land_island_001', basis: 'The Vindael arm is an island joined to the mainland only by winter ice (cold_lands.md, the Vindael arm: land_island_001).' }],
  ORH: [{ land: 'land_aenor_isle', basis: 'Orohaf holds Aenor Isle with Rish and the Tinta Hills (roster extent; middle_lands.md 2.8).' }],
  KIN: [{ area: 'plain_kingson_vale', basis: 'Kingson is the ringed Kingson Vale (roster extent; middle_lands.md 2.7).' }],
  HIR: [{ band: { range: 'range_hiloff_rim', from: 11, to: 13 }, basis: 'The ring\'s crests: the Hiloff Rim from Hirolon Head to the Hilorn mouth (hirolon.md 2.2, proposed).' }, { band: { range: 'range_grano' }, basis: 'The eastern Grano, the ring\'s eastern crest (hirolon.md 2.2, 11).' }],
});

// Exclusions between the canon lands of regions that share a landmass. Each side lists the regions whose realms are
// kept out of the polygon of the other side; a strip between the two polygons stays open to natural growth.
const GREAT_WALL_WEST = [[3156, 1083], [3188, 1172], [3228, 1261], [3253, 1344], [3284, 1426], [3308, 1499], [3291, 1565], [3243, 1635], [3188, 1725], [3160, 1839]];
const GREAT_WALL_EAST = [[3459, 1057], [3489, 1142], [3530, 1232], [3556, 1318], [3587, 1400], [3615, 1496], [3591, 1599], [3536, 1682], [3489, 1756], [3465, 1857]];
// Natural borders between two realms that the canon names (the repaired model's `naturalBorders` per region, after the
// geography model spec section 6, and the dossiers). Until the tool grows ownership along rivers and ranges, each
// becomes a pair of exclusions: a band NATURAL.bandPx wide along the named line on each realm's side, which the other
// realm may not enter. A border applies only where its line separates the two seats (the straight line between the
// capitals crosses it); bands keep clear of the realm's own claims and seeds. Lines are model ranges (their crest
// paths) and model rivers (the repaired model's river courses).
export const NATURAL = Object.freeze({ bandPx: 96, claimClearancePx: 8 });
export const NATURAL_BORDERS = Object.freeze([
  { realms: ['CLD', 'MLK'], lines: ['range_isengar_mountains', 'river_fandan'], basis: 'Coldor and Melkgard: the Fandan River and the Ormolak (former Isengar) Mountains (repaired model, Cold Lands; cold_lands.md 2).' },
  { realms: ['CLD', 'HOR'], lines: ['river_naepu'], basis: 'Coldor and Horidor: the Naepu ridge and the Naepu River (repaired model, Cold Lands).' },
  { realms: ['GNW', 'GIR'], lines: ['river_grey'], basis: 'Gunwyn and Girdon: the Grey River, crossed at the Grey Ford (west_lands.md 2; repaired model, West Lands).' },
  { realms: ['GIR', 'BLD'], lines: ['range_fog_eye'], basis: 'Girdon and Buldor: the Fog and Eye ridge (repaired model, West Lands; roster: Buldor lies south of the Fog and Eye range).' },
  { realms: ['GIR', 'SAO'], lines: ['river_kulolo'], basis: 'Girdon and Saopon: the Kulolo River (west_lands.md 2; repaired model, West Lands).' },
  { realms: ['AEN', 'SEL'], lines: ['river_selenar'], basis: 'Aenor and Selen: the River Selenar (middle_lands.md 2.5; repaired model, Middle Lands).' },
  { realms: ['AEN', 'HIR'], lines: ['range_grano', 'river_hilorn'], basis: 'Aenor and Hirolon: the Grano hills and the River Hilorn (hirolon.md 2.1; repaired model, Middle Lands).' },
  { realms: ['AEN', 'KIN'], lines: ['range_gigantic', 'river_great'], basis: 'Aenor and Kingson: the Gigantic Mountains and the Great River gorge (middle_lands.md 2.7; repaired model, Middle Lands).' },
  { realms: ['AEN', 'BLO'], lines: ['range_crown_north'], basis: 'Aenor and the Bloody Forest: the northern Crown Mountains (the Konori Heights; repaired model, Middle Lands).' },
  { realms: ['AEN', 'HER'], lines: ['range_grey_hills'], basis: 'Aenor and Herez: the Grey Hills (middle_lands.md 2.9; repaired model, Middle Lands).' },
  { realms: ['AEN', 'CUR'], lines: ['range_grey_hills'], basis: 'Aenor and the Cursed Lands: the Grey Hills (repaired model, Middle Lands).' },
  { realms: ['HRR', 'ANE'], lines: ['river_andos'], basis: 'Herrodon and Andos Enda: the Andos Water (magical_lands.md 2; repaired model, Magical Lands).' },
  { realms: ['MAG', 'MSH'], lines: ['river_elwen'], basis: 'The Magical Forest and the Mushroom Forest: the Elwen River (magical_lands.md 2; repaired model, Magical Lands).' },
  { realms: ['GOL', 'BOR'], lines: ['range_goldoroth'], basis: 'Goldoroth and Bordon: the Goldoroth Mountains (repaired model, Dark Lands).' },
  { realms: ['NRS', 'STA'], lines: ['range_noris_rise'], basis: 'Noris and Stabilo: the Noris Rise and the Flaming Forests (repaired model, East Lands).' },
  { realms: ['NRS', 'NAA'], lines: ['river_fosoco', 'range_woqood_alps'], basis: 'Noris and Naamis (former Gondolin): the Fosoco River and the Woqood Spires (repaired model, East Lands).' },
  { realms: ['STA', 'DRA'], lines: ['range_drak'], basis: 'Stabilo and Drak: the Drak Mountains (repaired model, East Lands).' },
]);
// Natural borders the canon names that are not lines of the model, and why they are not exclusions.
export const NATURAL_NOT_APPLIED = Object.freeze([
  { border: 'Nolorim and the Worshipdom: the Lake of Mirolon (magical_lands.md 2)', reason: 'A lake, not a line; the lake itself already separates the two seats on the land the import reads.' },
  { border: 'Lerendor\'s North and Lerendor: the Loron highland (north_lands.md 2)', reason: 'Both are one realm (decision K49).' },
  { border: 'Dondor and Goldoroth: the Darkness ridge and the inner sea (repaired model, Dark Lands)', reason: 'The Dondor and Goldoroth arms are separate lands; the sea already divides them.' },
  { border: 'The Sun Mountains and the Sukro Mountains split the Lands of the Sun\'s realms (lands_of_the_sun.md 2)', reason: 'The canon does not say which realms each range divides.' },
]);

export const BARRIERS = Object.freeze([
  {
    id: 'great_wall',
    basis: 'The Great Wall of Aenor is the natural range between the Middle Lands and the Magical Lands (decision K2; middle_lands.md 2.9). The belt of the range and its foothills (the repaired model\'s zone_great_wall, about 300 px wide) stays open; the land beyond each foothill edge is the other region\'s.',
    sides: [
      { name: 'Magical Lands beyond the eastern foothills', keepOut: ['middle_lands'], polygon: [...GREAT_WALL_EAST, [4150, 1857], [4150, 850], [3330, 850]] },
      { name: 'Middle Lands beyond the western foothills', keepOut: ['magical_lands'], polygon: [...GREAT_WALL_WEST, [2550, 1839], [2550, 1083]] },
    ],
  },
  {
    id: 'zilin_marches',
    basis: 'Mirolon is the Ember Lands\' peninsula on the southern neck of the central landmass, closed toward the Zilin side by the Mirolon Mountains and their passes (ember_lands.md 2). Its tongue and the arm east of it, south of the Zilin marches, are Mirolon\'s; the Middle and Magical Lands north of the marches are kept from Mirolon\'s realms; the Great Swamp and the Lake of Mirolon between stay open.',
    sides: [
      { name: 'Mirolon south of the Zilin marches', keepOut: ['middle_lands', 'magical_lands'], polygon: [[3150, 1960], [3430, 1960], [3430, 1880], [3700, 1880], [3700, 2100], [3150, 2100]] },
      { name: 'the Middle and Magical Lands north of the Zilin marches', keepOut: ['ember_lands'], polygon: [[2550, 850], [4060, 850], [4060, 1850], [2550, 1850]] },
    ],
  },
  {
    id: 'cold_neck',
    basis: 'The Neridor Mountains and the Worlond Forest belt divide the West Lands from the Cold Lands; the Neck Road is the only road (west_lands.md 2; cold_lands.md 2). The import reads the neck as land (y 880 to 1000, x 750 to 1250), so each region\'s realms keep to their side of it: Holdon\'s coast, the Yeti Lands and the Worlond Forest are the Cold Lands\', the Gunwyn Downs the West\'s, and the neck itself stays open.',
    sides: [
      { name: 'the Cold Lands north of the neck', keepOut: ['west_lands'], polygon: [[560, 880], [1750, 880], [1750, 60], [560, 60]] },
      { name: 'the West Lands south of the neck', keepOut: ['cold_lands'], polygon: [[560, 990], [1750, 990], [1750, 1720], [560, 1720]] },
    ],
  },
  {
    id: 'olen_lowland',
    basis: 'The model puts Mirolon\'s eastern lowland, where the drawing writes Olen\'s Gelbus and Luminor, on the eastern mainland with the East and South Lands (land_eastern_mainland). Olen, an Ember Lands realm, stays on that lowland and out of the Sun Desert and the East Lands beyond it; the Ember Lands island and the Nether are separate lands the import keeps apart (the Ember Narrows and the Nether Sound are water), so they need no barrier.',
    sides: [
      { name: 'the Sun Desert and the East Lands beyond Olen\'s lowland', keepOut: ['ember_lands'], polygon: [[3270, 2150], [3800, 2150], [3800, 1700], [4300, 1700], [4300, 2559], [3270, 2559]] },
    ],
  },
  {
    id: 'hardtmuth',
    basis: 'The South Lands lie between the Sea of the Sun on the west and the Hardtmuth chain on the east (south_lands.md 2); Miaed holds the passes and the south coast. The Sun Desert west of the chain is the South Lands\'; the northern desert, the great river valley and the southern hills east of the Ergo country are the East Lands\'.',
    sides: [
      { name: 'the Sun Desert west of the Hardtmuth chain', keepOut: ['east_lands'], polygon: [[3500, 2110], [3840, 2110], [3880, 2200], [3930, 2300], [3975, 2420], [3975, 2559], [3500, 2559]] },
      { name: 'the East Lands north of the desert and east of the Ergo country', keepOut: ['south_lands'], polygon: [[3700, 1650], [5119, 1650], [5119, 2559], [4300, 2559], [4300, 2000], [3700, 2000]] },
    ],
  },
]);

// Wild lands the dossiers name (all proposed there). Shapes: a circle round a model point, a band along part of a
// range, a model area shrunk by `erodePx`, or a whole model land.
export const WILD_LANDS = Object.freeze([
  { id: 'mount_ergo', name: 'Mount Ergo', circle: { feature: 'volcano_ergo', radiusPx: 34 }, basis: 'The devils\' mountain; a wild land, not a country (east_lands.md 11).' },
  { id: 'mount_argul', name: 'Mount Argul', circle: { feature: 'volcano_argon', radiusPx: 34 }, basis: 'The devils\' second mountain (former Mount Argon, K48); a wild land (east_lands.md 11).' },
  { id: 'reeto_caves', name: 'The Reeto caves', circle: { feature: 'volcano_reeto', radiusPx: 34 }, basis: 'The ogres\' caves under the Reeto Heights; a wild land (east_lands.md 11).' },
  { id: 'melty_glaciers', name: 'The high Melty glaciers', band: { range: 'range_melty', from: 2, to: 3, radiusPx: 16 }, basis: 'The high glaciers of the Melty Mountains; a wild land (east_lands.md 11). Only the crest south of Ostoroth\'s seat.' },
  { id: 'kherith_isles', name: 'The Kherith Isles', land: 'land_island_054', basis: 'The volcanic islets in the Sea of Lava where devils lair (former Death Islands); not a country (ember_lands.md 2, 11).' },
  { id: 'the_abyss', name: 'The Abyss', area: { id: 'chasm_abyss', erodePx: 8 }, basis: 'Roka\'s domain; no country is made for him (ember_lands.md 11). Puvulan holds the rim.' },
  { id: 'lustras_hills', name: 'The Lustras Hills', band: { range: 'range_lustras', radiusPx: 24 }, basis: 'The krors\' hills (the drawn Sacomananos); nobody settles them (magical_lands.md 9, 11).' },
  { id: 'herrodon_crest', name: 'The crest of the Herrodon Mountains', band: { range: 'range_herrodon', from: 1, to: 15, radiusPx: 14 }, basis: 'Nobody lives on the Herrodon crest (magical_lands.md 2, 11); Herrodon holds the south slope.' },
  { id: 'fallen_forest', name: 'The heart of the Fallen Forest', area: { id: 'forest_fallen', erodePx: 24 }, basis: 'The Magical Forest leaves the Fallen Forest wild (roster extent; magical_lands.md 11).' },
  { id: 'magic_mountains', name: 'The high snows of the Magic Mountains', band: { range: 'range_magic_1', radiusPx: 14 }, basis: 'Where Golbran is said to live; a wild land (magical_lands.md 11).' },
]);

// Where a wild land the dossiers name is not placed, and why.
export const WILD_NOT_PLACED = Object.freeze([
  { name: 'The Lost Lands', basis: 'magical_lands.md 11', reason: 'The drawn Lost and Filion labels lie on the strip of north coast where the drawing also puts Andos Enda\'s seat Enliras (the site is within 30 px); a separate wild strip there would cut the realm\'s capital off. Left to Andos Enda and Herrodon.' },
  { name: 'Dragon Mountain\'s summit', basis: 'magical_lands.md 11', reason: 'The roster gives Yavieth "the mountain" (1 state) and its site stands on the mountain; the roster wins.' },
  { name: 'The open dune sea of the Sun Desert and the deep southern sand', basis: 'south_lands.md 11', reason: 'Wahatud is the league of the dune sea\'s oases (about 4 states); the model\'s Sun Desert area is the realm\'s land, so a wild polygon would swallow it.' },
  { name: 'The Plutondo Dunes', basis: 'east_lands.md 11', reason: 'The model\'s dunes area holds Rhachia\'s seat Pordoce (site_avalon).' },
  { name: 'The Cursed Square', basis: 'tritons_islands.md 11; roster (Benan)', reason: 'A reef where islanders live on wrecks, the model\'s coast_cursed_square point; it is a place on the water and Benan is its nominal holder.' },
  { name: 'The Death Islands of the Dark Lands', basis: 'dark_lands.md 9', reason: 'The drawn dots east of the black island have no land of their own in the model.' },
  { name: 'The high snows of Lunhrim and the Organ Mountains; the Forests of Darkhere', basis: 'middle_lands.md 11', reason: 'The dossier itself has them held on the map by Kunhrim, Aenor and Glimik.' },
]);

// Choices made here where the canon is silent or contradicts itself: each is a question for the owner.
export const OWNER_QUESTIONS = Object.freeze([
  { id: 'Q-50', realms: ['YEL'], question: 'Yeldenne\'s roster capital is Simoto, the model\'s site_yeldenne_landing on the Gulf of Minnolomak, about 400 px from the Castle of Yeldenne and the valley of Mp\'E it is meant to serve; a one-state realm cannot hold both. The site stands on water as the import reads the land, so the seat is the nearest land, 63 px south-west of it. Should the landing move below the castle, or the realm\'s seat move to the valley?' },
  { id: 'Q-51', realms: ['LER'], question: 'Lerendor\'s North (decision K49) is seeded in the drawn snow country (Lerenwaith); Sonargur lies on the island\'s south coast with Tolvael, the Heodwa Lands, Hrakbrund and Mustnom between. The map tool joins a realm\'s pieces on one landmass by a corridor, which will cut through those realms. Accept the corridor, or make Lerendor\'s North a separate realm under the same crown?' },
  { id: 'Q-52', realms: ['LER'], question: 'The Low-ness Islands and Ferlinon\'s pine hills (roster extent) have no model feature; the old map\'s Low-ness state projects onto the drawn island of Tolhon. Not placed: where are they?' },
  { id: 'Q-53', realms: ['PRN'], question: 'The drawing labels Pornyior beside Argon (now Mount Argul); the roster says "the slopes below Mount Ergo". The seat follows the drawing. Which mountain?' },
  { id: 'Q-54', realms: ['IHU', 'SOY'], question: 'The model puts Ossi Luni (former Hengyang, Soyano\'s) on the same island as Hol\'s Great Volcano (Ihuy\'s seat). One owner per island gives it to Ihuy; Soyano\'s seat Ileslia is on the northernmost Sun isle (land_island_023). Agree?' },
  { id: 'Q-55', realms: ['OLE', 'HAL', 'MIR'], question: 'The drawing writes Gelbus and Luminor (Olen) on the lowland east of Mirolon, which the model makes part of the eastern mainland (land_eastern_mainland), so Olen, an Ember Lands realm, stands alone on the East and South Lands\' landmass (the olen_lowland barrier keeps it out of the Sun Desert and the East Lands beyond). Halia\'s salt coast stands on the arm of the Mirolon peninsula east of Miherta\'s tongue, on the central mainland with Mirolon. Keep Olen on that lowland, or move it to an isle off Mirolon\'s south coast?' },
  { id: 'Q-56', realms: ['HIR', 'TIR'], question: 'Hirolon claims the crests of its proposed ring (the Hiloff Rim from Hirolon Head to the Hilorn mouth, and the Grano; hirolon.md 2.2) and Tirlan grows inside it from Tirbur at the Hilorn\'s head-streams. Accept the ring as Hirolon\'s fixed land?' },
  { id: 'Q-57', realms: ['KIN'], question: 'Kingson claims the model\'s whole Kingson Vale plain (plain_kingson_vale, about 200 by 300 px including the gorge), larger than its three roster states. Keep the whole vale, or claim only the valley floor?' },
  { id: 'Q-58', realms: ['ZOL', 'HRR', 'ANE'], question: 'Ten wild lands are left unowned (Mount Ergo, Mount Argul, the Reeto caves, the high Melty glaciers, the Kherith Isles, the Abyss, the Lustras Hills, the Herrodon crest, the heart of the Fallen Forest, the high snows of the Magic Mountains); every one is proposed in its dossier, and whether the game accepts ownerless states is still to be verified in the Linux run (ADR 0069). Where a wild land meets a realm\'s claim the claim wins: Zol\'s Mistake\'s claim (the roster\'s "Edvoid\'s Mistake" coast, which the model\'s zone puts on the Magical Lands\' northern tip at about x 3555 to 3645, y 868 to 892) cuts the eastern end of the Herrodon crest. Keep them unowned, or give each to the realm that borders it as the old map did; and is that northern tip Zol\'s?' },
  { id: 'Q-59', realms: [], question: 'Realm sizes follow the roster\'s stated extent where it gives a state count and the old map\'s state count otherwise (WEIGHT); in regions where the roster states fewer states than the land holds (the Magical Lands most of all) the realms grow larger than their extent, or the wild lands must grow. Accept, or state extents for the remaining realms?' },
  { id: 'Q-60', realms: ['MAG', 'YAV', 'ANE'], question: 'Not placed as wild land: the Lost Lands (the drawn Lost and Filion labels lie where Andos Enda\'s seat stands), Dragon Mountain\'s summit (the roster gives Yavieth the mountain), the dune sea (Wahatud\'s oases), the Plutondo Dunes (Rhachia\'s seat stands in them), the Cursed Square (a reef on the water) and the Dark Lands\' Death Islands (no land in the model). Agree?' },
  { id: 'Q-61', realms: ['ELD'], question: 'The roster puts Eldafaen on the southern rift shore and its Archive at the southern end of the rift coast; the old map\'s seat and the drawn Endelond label lie in the north-east of the Magical Lands by the Fallen Forest. The seat follows the roster (south of the Rift Narrows). Which is right, and is Endelond a separate part?' },
  { id: 'Q-62', realms: ['SEI', 'WND', 'SNT', 'HLN', 'LEN', 'FNG'], question: 'The Triton realms without sites sit on the islands the drawing labels or, where it does not, on the islands the old map gave them: the Seite Islands on the long isle under their label, the Windy Lands on the south of Raerby\'s arc, Santon on the outer western arc, Halenor on the isle by the Kilos Sound (land_island_059), the Lens on the narrow isle east of Adel, Fineger on the northernmost isle. Agree?' },
]);
// What the import's reading of the drawing does that the model does not, measured on the land of commit 95324a05
// (annotations force the model's land and sea outside a 6-px coast band); for the map lead, not the owner.
export const IMPORT_OBSERVATIONS = Object.freeze([
  'Every landmass the realms stand on matches the model\'s lands: the West and Cold Lands are one land at the neck, the rift coast belongs to the Central Mainland, and the Ember Lands island, the Nether and the East and South Lands are three separate lands.',
  'The model\'s island land_island_009 reads as two pieces (the drawn passage between Pollos and Benan): Pollos and Benan stand on the northern piece, Nondondor on the southern. Each piece holds a seat, so no realm is cut off.',
  'Mirolon\'s eastern lowland, where the drawing writes Olen, is part of the eastern mainland in the model and the import, not of the Mirolon peninsula (owner question Q-55).',
  'Three capital sites stand on water or within 3 px of the coast as the import reads the land and are moved to the nearest land: Yeldenne\'s landing (63 px), Hunhun (4 px) and Mora (3 px). The model\'s site positions may want the same correction.',
  'The workspace\'s common/country_tags holds only the 19 October world\'s 305 old Y tags (00_zin_countries.txt) and the dynamic tags; the roster\'s 156 tags are written by the mod\'s build to common/country_tags/01_zin_realms.txt (tools/content/modules/countries.mjs). Until the build has written it, the tool refuses every realm (MAP_WORLD_REALM_TAG_UNKNOWN).',
]);

// ---------------------------------------------------------------------------------------------------- helpers
const round = (v, d = 0) => { const f = 10 ** d; return Math.round(v * f) / f; };
const ip = p => [Math.round(p[0]), Math.round(p[1])];

export function featureIndex(world) {
  const g = world.geography, m = world.repaired, idx = new Map();
  for (const s of g.sites) idx.set(s.id, { kind: 'site', point: toPx(s.at), raw: s });
  for (const p of g.places) idx.set(p.id, { kind: 'place', point: toPx(p.at), raw: p });
  for (const v of g.volcanoes) idx.set(v.id, { kind: 'volcano', point: toPx(v.at), raw: v });
  for (const p of g.passes) idx.set(p.id, { kind: 'pass', point: toPx(p.position), raw: p });
  for (const r of g.ranges) idx.set(r.id, { kind: 'range', path: r.path.map(toPx), halfWidthPx: r.halfWidth * FRAME.width, raw: r });
  const riverPaths = new Map((m.rivers ?? []).filter(r => r.geometry?.type === 'LineString').map(r => [r.id, r.geometry.coordinates.map(toPx)]));
  for (const r of g.rivers) idx.set(r.id, { kind: 'river', source: r.source ? toPx(r.source) : null, mouth: r.mouth ? toPx(r.mouth) : null, path: riverPaths.get(r.id) ?? null, raw: r });
  for (const s of g.straits) idx.set(s.id, { kind: 'strait', ends: s.between.map(toPx), raw: s });
  for (const l of g.lakes) idx.set(l.id, { kind: 'lake', rings: l.polygons.map(r => r.map(toPx)), raw: l });
  g.lands.forEach((l, k) => idx.set(l.id, { kind: 'land', index: k, rings: l.polygons.map(r => r.map(toPx)), raw: l }));
  for (const k of ['forests', 'deserts', 'marshes', 'ice', 'plains', 'hills']) for (const f of m[k] ?? []) idx.set(f.id, { kind: 'area', rings: areaRings(f.geometry), raw: f });
  for (const r of m.regions) idx.set(r.id, { kind: r.kind === 'zone' ? 'zone' : 'region', rings: areaRings(r.geometry), raw: r });
  return idx;
}
/** Outer and hole rings of a GeoJSON area in pixels (even-odd fill gives the area). */
function areaRings(geometry) {
  const parts = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
  return parts.flat().map(r => r.map(toPx));
}
function pathPoint(path, t) {
  const lens = [0];
  for (let k = 1; k < path.length; k++) lens.push(lens[k - 1] + Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]));
  const target = Math.max(0, Math.min(1, t)) * lens[lens.length - 1];
  for (let k = 1; k < path.length; k++) if (lens[k] >= target) { const f = lens[k] === lens[k - 1] ? 0 : (target - lens[k - 1]) / (lens[k] - lens[k - 1]); return [path[k - 1][0] + f * (path[k][0] - path[k - 1][0]), path[k - 1][1] + f * (path[k][1] - path[k - 1][1])]; }
  return path[path.length - 1];
}
const ringCentroid = ring => [ring.reduce((s, p) => s + p[0], 0) / ring.length, ring.reduce((s, p) => s + p[1], 0) / ring.length];

/** Mask (zone grid) of rings filled even-odd. */
function gridMaskOfRings(rings) {
  const scaled = rings.map(r => r.map(p => [p[0] / ZONE_GRID.cell, p[1] / ZONE_GRID.cell]));
  return fillRings(scaled, new Uint8Array(ZONE_GRID.w * ZONE_GRID.h), 1, ZONE_GRID.w, ZONE_GRID.h);
}
/** Chamfer distance (in cells) inside a mask to its outside. */
function insideDistance(mask, w, h) {
  const INF = 1e9, d = new Float64Array(w * h);
  for (let i = 0; i < d.length; i++) d[i] = mask[i] ? INF : 0;
  const a = 1, b = Math.SQRT2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; if (!d[i]) continue;
    let v = d[i];
    if (x > 0) v = Math.min(v, d[i - 1] + a); else v = Math.min(v, a);
    if (y > 0) { v = Math.min(v, d[i - w] + a); if (x > 0) v = Math.min(v, d[i - w - 1] + b); if (x + 1 < w) v = Math.min(v, d[i - w + 1] + b); } else v = Math.min(v, a);
    d[i] = v;
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x; if (!d[i]) continue;
    let v = d[i];
    if (x + 1 < w) v = Math.min(v, d[i + 1] + a); else v = Math.min(v, a);
    if (y + 1 < h) { v = Math.min(v, d[i + w] + a); if (x + 1 < w) v = Math.min(v, d[i + w + 1] + b); if (x > 0) v = Math.min(v, d[i + w - 1] + b); } else v = Math.min(v, a);
    d[i] = v;
  }
  return d;
}

// ---------------------------------------------------------------------------------------------------- the build
export async function buildRealmSeeds({ world: given, drawing = true } = {}) {
  const world = given ?? await loadWorld({ drawing, marginPx: PLACE.marginPx });
  const W = FRAME.width, H = FRAME.height;
  const realms = world.roster.realms;
  const byKey = new Map(realms.map(r => [r.key, r]));
  const features = featureIndex(world);
  const feature = id => { const f = features.get(id); if (!f) throw new Error(`unknown model feature ${id}`); return f; };
  const issues = [];
  const zoneAt = (x, y) => world.zones[Math.min(ZONE_GRID.h - 1, Math.floor(y / ZONE_GRID.cell)) * ZONE_GRID.w + Math.min(ZONE_GRID.w - 1, Math.floor(x / ZONE_GRID.cell))];
  const inEdge = (x, y) => x < PLACE.edgeClearPx.x || x >= W - PLACE.edgeClearPx.x || y < PLACE.edgeClearPx.y || y >= H - PLACE.edgeClearPx.y;
  const safeAt = (x, y) => x >= 0 && y >= 0 && x < W && y < H && world.safe[y * W + x] === 1 && !inEdge(x, y);
  // landmasses: 4-connected components of the land the import reads (full resolution); a strait of any width splits
  const comps = components(world.surface, W, H);
  const compAt = p => comps.labels[Math.floor(p[1]) * W + Math.floor(p[0])];
  const landAt = p => { const k = world.landIndex[Math.floor(p[1]) * W + Math.floor(p[0])]; return k >= 0 ? world.geography.lands[k].id : null; };
  const wildLandIds = new Set(WILD_LANDS.filter(w => w.land).map(w => w.land)); // a wild island takes no seed
  const landPixels = new Map();
  for (let i = 0; i < world.landIndex.length; i++) { const k = world.landIndex[i]; if (k >= 0) { const id = world.geography.lands[k].id; landPixels.set(id, (landPixels.get(id) ?? 0) + 1); } }

  // ---- old frame to new frame
  const oldCentre = new Map();
  for (const list of Object.values(world.centres.countries)) for (const s of list) oldCentre.set(s.id, [s.centre[0], H - s.centre[1]]);
  const oldCapitalState = new Map(world.assignment.capitals.map(c => [c.tag, c.state]));
  const sites = new Map(world.geography.sites.map(s => [s.id, s]));
  const anchors = [];
  for (const r of realms) {
    const s = sites.get(r.capital.siteId), o = oldCentre.get(oldCapitalState.get(r.tag));
    if (s && o) { const n = toPx(s.at); anchors.push({ region: r.region, old: o, d: [n[0] - o[0], n[1] - o[1]] }); }
  }
  const field = (p, region) => {
    const list = anchors.filter(a => a.region === region);
    const mean = list.length ? [list.reduce((s, a) => s + a.d[0], 0) / list.length, list.reduce((s, a) => s + a.d[1], 0) / list.length] : [0, 0];
    let sw = FIELD.priorWeight, sx = FIELD.priorWeight * mean[0], sy = FIELD.priorWeight * mean[1];
    for (const a of list) { const w = Math.exp(-((p[0] - a.old[0]) ** 2 + (p[1] - a.old[1]) ** 2) / (2 * FIELD.sigmaPx ** 2)); sw += w; sx += w * a.d[0]; sy += w * a.d[1]; }
    return [sx / sw, sy / sw];
  };
  const project = (o, region) => { const d = field(o, region); return [o[0] + d[0], o[1] + d[1]]; };

  // ---- polygons: claims, exclusions, unowned
  const polygonFromMask = mask => outlines(mask, ZONE_GRID.w, ZONE_GRID.h, ZONE_GRID.cell, { tolPx: POLYGON.tolPx, minAreaPx: POLYGON.minAreaPx });
  const zoneLandMask = zoneName => {
    const m = new Uint8Array(ZONE_GRID.w * ZONE_GRID.h);
    for (let c = 0; c < m.length; c++) if (world.zones[c] === zoneName && world.zoneLand[c]) m[c] = 1;
    return m;
  };
  const bandMaskOf = ({ range, from, to, radiusPx }) => {
    const f = feature(range);
    const p = f.path.slice(from ?? 0, to === undefined ? undefined : to + 1);
    const r = Math.max(POLYGON.bandMinRadiusPx, radiusPx ?? f.halfWidthPx);
    return bandMask(p, r, ZONE_GRID.w, ZONE_GRID.h, ZONE_GRID.cell);
  };
  const bandPolygons = band => polygonFromMask(bandMaskOf(band));
  const areaMaskOf = (id, erodePx = 0) => {
    const m = gridMaskOfRings(feature(id).rings);
    return erodePx > 0 ? erodeBox(m, Math.round(erodePx / ZONE_GRID.cell), ZONE_GRID.w, ZONE_GRID.h) : m;
  };
  const areaPolygons = id => polygonFromMask(areaMaskOf(id));
  const landPolygons = id => polygonFromMask(gridMaskOfRings(feature(id).rings));

  const claims = new Map(), claimNotes = new Map();
  for (const [tag, list] of Object.entries(CLAIMS)) {
    const polys = [], notes = [];
    for (const c of list) {
      let p;
      if (c.zone) p = polygonFromMask(zoneLandMask(c.zone));
      else if (c.land) p = landPolygons(c.land);
      else if (c.area) p = areaPolygons(c.area);
      else if (c.band) p = bandPolygons(c.band);
      polys.push(...p);
      notes.push({ source: c.zone ? `zone ${c.zone}` : c.land ? `land ${c.land}` : c.area ? `area ${c.area}` : `band along ${c.band.range}`, polygons: p.length, basis: c.basis });
    }
    claims.set(tag, polys); claimNotes.set(tag, notes);
  }
  // Wild lands are built as masks on the zone grid; land a realm claims is cut out of them (a claim is the roster's or
  // the canon's fixed land, so it wins over a dossier's proposed wild land), with WILD.claimClearancePx between them.
  const claimMask = gridMaskOfRings([...claims.values()].flat());
  const claimGuard = dilateBox(claimMask, Math.ceil(WILD.claimClearancePx / ZONE_GRID.cell), ZONE_GRID.w, ZONE_GRID.h);
  const wildReport = [];
  for (const wl of WILD_LANDS) {
    let m;
    if (wl.circle) m = gridMaskOfRings([circleRing(feature(wl.circle.feature).point, wl.circle.radiusPx)]);
    else if (wl.band) m = bandMaskOf(wl.band);
    else if (wl.area) m = areaMaskOf(wl.area.id, wl.area.erodePx ?? 0);
    else if (wl.land) m = dilateBox(gridMaskOfRings(feature(wl.land).rings), Math.ceil(WILD.landCoverPx / ZONE_GRID.cell), ZONE_GRID.w, ZONE_GRID.h);
    let cut = 0;
    for (let c = 0; c < m.length; c++) if (m[c] && claimGuard[c]) { m[c] = 0; cut++; }
    const p = polygonFromMask(m);
    wildReport.push({ id: wl.id, name: wl.name, polygons: p, basis: wl.basis, ...(cut ? { cutByClaimsPx: cut * ZONE_GRID.cell ** 2 } : {}), ...(wl.land ? { land: wl.land } : {}) });
  }
  const regionOf = tag => realms.find(r => r.tag === tag).region;
  // natural borders as one-sided bands (built after the capitals, below); the per-realm lists start empty
  const borderExclusions = new Map(), borderReport = [];
  const exclusionsFor = region => BARRIERS.flatMap(b => b.sides.filter(s => s.keepOut.includes(region)).map(s => ({ barrier: b.id, name: s.name, polygon: s.polygon })));

  // ---- capitals
  const placed = []; // { tag, p }
  const forbiddenCache = new Map();
  const forbiddenFor = tag => {
    if (forbiddenCache.has(tag)) return forbiddenCache.get(tag);
    const own = exclusionsFor(regionOf(tag)).map(e => e.polygon);
    const others = [...claims].filter(([t]) => t !== tag).flatMap(([, ps]) => ps);
    const f = { own, others: [...others, ...wildReport.flatMap(w => w.polygons)] };
    forbiddenCache.set(tag, f);
    return f;
  };
  const acceptable = (tag, x, y, { comp = null, extra = null } = {}) => {
    if (!safeAt(x, y)) return false;
    if (comp !== null && comps.labels[y * W + x] !== comp) return false;
    for (const q of placed) if (q.tag !== tag && Math.hypot(q.p[0] - x, q.p[1] - y) < PLACE.minSeparationPx) return false;
    const f = forbiddenFor(tag);
    if (pointInPolygons(x, y, f.own) || pointInPolygons(x, y, f.others)) return false;
    if (extra && !extra(x, y)) return false;
    return true;
  };
  const snap = (tag, start, reach, opts = {}) => {
    const cx = Math.round(start[0]), cy = Math.round(start[1]);
    for (let r = 0; r <= reach; r++) {
      let best = null, bd = Infinity;
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = cx + dx, y = cy + dy;
        if (!acceptable(tag, x, y, opts)) continue;
        const d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = [x, y]; }
      }
      if (best) return { p: best, distPx: round(Math.sqrt(bd), 1) };
    }
    return null;
  };
  const poleOf = (rings, compHint = null) => {
    const m = gridMaskOfRings(rings);
    for (let c = 0; c < m.length; c++) {
      if (!m[c]) continue;
      const x = (c % ZONE_GRID.w) * ZONE_GRID.cell + 2, y = Math.floor(c / ZONE_GRID.w) * ZONE_GRID.cell + 2;
      if (!safeAt(x, y) || (compHint !== null && comps.labels[y * W + x] !== compHint)) m[c] = 0;
    }
    const d = insideDistance(m, ZONE_GRID.w, ZONE_GRID.h);
    let best = -1, bd = 0;
    for (let c = 0; c < d.length; c++) if (m[c] && d[c] > bd) { bd = d[c]; best = c; }
    if (best < 0) return ringCentroid(rings[0]);
    return [(best % ZONE_GRID.w) * ZONE_GRID.cell + 2, Math.floor(best / ZONE_GRID.w) * ZONE_GRID.cell + 2];
  };
  const sidePoint = (rings, side) => {
    const pts = rings.flat();
    if (side === 'west') { const p = pts.reduce((a, b) => (b[0] < a[0] ? b : a)); return [p[0] + 12, p[1]]; }
    if (side === 'north') { const p = pts.reduce((a, b) => (b[1] < a[1] ? b : a)); return [p[0], p[1] - 10]; }
    return ringCentroid(rings[0]);
  };
  const resolveAnchor = (a, r) => {
    if (a.at) return { start: a.at, method: a.method ?? 'drawn label', source: `world (${a.at[0]}, ${a.at[1]})` };
    if (a.old) {
      const o = oldCentre.get(oldCapitalState.get(r.tag));
      return { start: project(o, r.region), method: 'old capital', source: `old state ${oldCapitalState.get(r.tag)} at (${round(o[0])}, ${round(o[1])}) moved by the displacement field` };
    }
    if (a.area) return { start: poleOf(feature(a.area).rings), method: 'model area', source: a.area };
    if (a.land) { const f = feature(a.land); return { start: a.side === 'west' || a.side === 'north' ? sidePoint(f.rings, a.side) : poleOf(f.rings), method: 'model land', source: a.land, comp: null }; }
    const f = feature(a.feature);
    let p;
    if (f.kind === 'range') p = pathPoint(f.path, a.t ?? 0.5);
    else if (f.kind === 'river') p = a.end === 'mouth' ? f.mouth : f.source;
    else if (f.kind === 'strait') p = f.ends[a.end ?? 0];
    else if (f.kind === 'lake') p = sidePoint(f.rings, a.side ?? 'centre');
    else p = f.point;
    if (a.offset) p = [p[0] + a.offset[0], p[1] + a.offset[1]];
    return { start: p, method: 'model feature', source: a.feature };
  };

  const records = new Map();
  for (const r of realms) records.set(r.tag, { tag: r.tag, key: r.key, name: r.name, region: r.region, subRegion: r.subRegion, capitalName: r.capital.name, conflicts: [], proposed: [] });
  // sited capitals first (fixed; snapped only when the site is not on safe land)
  for (const r of realms) {
    const s = sites.get(r.capital.siteId);
    if (!s) continue;
    const rec = records.get(r.tag), start = toPx(s.at), p0 = ip([Math.floor(start[0]), Math.floor(start[1])]);
    let p = p0, dist = 0;
    if (world.safe[p0[1] * W + p0[0]] !== 1) {
      const sn = snap(r.tag, start, PLACE.snapReachPx);
      if (!sn) { issues.push(`${r.tag}: site ${s.id} is not on land and no land is within ${PLACE.snapReachPx} px`); continue; }
      p = sn.p; dist = sn.distPx;
      rec.conflicts.push(`The capital site ${s.id} (${round(start[0])}, ${round(start[1])}) is not on the land the import reads (or within ${PLACE.marginPx} px of its coast); the nearest acceptable land is ${dist} px away.`);
    }
    rec.capital = { point: p, method: 'site', source: s.id, snapPx: dist, status: 'canon' };
    placed.push({ tag: r.tag, p });
  }
  for (const r of realms) {
    if (records.get(r.tag).capital || sites.get(r.capital.siteId)) continue;
    const a = CAPITAL_ANCHORS[r.tag] ?? { old: true, basis: 'No canon anchor; the old map\'s capital state, moved into the new frame.' };
    const res = resolveAnchor(a, r);
    const sn = snap(r.tag, res.start, PLACE.snapReachPx);
    const rec = records.get(r.tag);
    if (!sn) { issues.push(`${r.tag}: no acceptable land within ${PLACE.snapReachPx} px of the anchor (${round(res.start[0])}, ${round(res.start[1])})`); continue; }
    rec.capital = { point: sn.p, method: res.method, source: res.source, anchor: ip(res.start), snapPx: sn.distPx, basis: a.basis, status: 'proposed' };
    rec.proposed.push(`Capital ${r.capital.name ?? '(unnamed)'}: ${a.basis}`);
    if (sn.distPx > 60) rec.conflicts.push(`The anchor (${ip(res.start).join(', ')}) is ${sn.distPx} px from the nearest acceptable land; check the placement.`);
    placed.push({ tag: r.tag, p: sn.p });
  }
  for (const rec of records.values()) {
    if (!rec.capital) continue;
    const z = zoneAt(...rec.capital.point);
    rec.capital.zone = z;
    rec.capital.land = landAt(rec.capital.point);
    // the zones are coarse (straight-edged region boxes grown over the frame), so a mismatch is a note, not a conflict
    if (z && !(REGION_ZONES[rec.region] ?? []).includes(z)) rec.capital.zoneNote = `stands in the repaired model's ${z} zone, not a zone of ${rec.region}; the zones are coarse and the placement follows the drawing and the dossier`;
  }

  // ---- seeds: canon anchors, then old states on other lands
  const seedCandidates = new Map(); // comp -> [{ tag, p, from, count }]
  for (const [tag, list] of Object.entries(SEED_ANCHORS)) {
    const r = realms.find(x => x.tag === tag), rec = records.get(tag);
    rec.seeds ??= [];
    for (const a of list) {
      const res = resolveAnchor(a, r);
      const sn = snap(tag, res.start, PLACE.snapReachPx);
      if (!sn) { rec.conflicts.push(`Seed anchor ${res.source} has no acceptable land nearby; not placed.`); continue; }
      rec.seeds.push({ point: sn.p, method: res.method, source: res.source, snapPx: sn.distPx, basis: a.basis, status: 'proposed' });
      rec.proposed.push(`Seed: ${a.basis}`);
      placed.push({ tag, p: sn.p });
    }
  }
  const realmComps = tag => new Set([records.get(tag).capital?.point, ...(records.get(tag).seeds ?? []).map(s => s.point)].filter(Boolean).map(compAt));
  const compsWithPoints = () => { const m = new Map(); for (const q of placed) { const c = compAt(q.p); if (!m.has(c)) m.set(c, new Set()); m.get(c).add(q.tag); } return m; };
  const oldStatesOf = new Map();
  for (const st of world.assignment.states) { const r = byKey.get(st.realm); if (!r) continue; if (!oldStatesOf.has(r.tag)) oldStatesOf.set(r.tag, []); oldStatesOf.get(r.tag).push(st); }
  const taken = compsWithPoints();
  for (const r of realms) {
    const own = realmComps(r.tag);
    for (const st of oldStatesOf.get(r.tag) ?? []) {
      const o = oldCentre.get(st.id); if (!o) continue;
      const pr = project(o, r.region);
      const sn = snap(r.tag, pr, PLACE.seedSnapReachPx);
      if (!sn) continue;
      const c = compAt(sn.p);
      if (own.has(c)) continue;
      const cap = records.get(r.tag).capital.point;
      // only a separate land of the model: a strip the drawing's reading splits off a mainland (a sheet edge, a pencil
      // line) is not an island of the realm's
      const seedLand = landAt(sn.p);
      if (!seedLand || seedLand === landAt(cap) || (landPixels.get(seedLand) ?? 0) < PLACE.seedMinLandPx || wildLandIds.has(seedLand)) continue;
      if (Math.hypot(sn.p[0] - cap[0], sn.p[1] - cap[1]) > PLACE.seedMaxFromCapitalPx) {
        records.get(r.tag).conflicts.push(`Old state ${st.id} projects to (${sn.p.join(', ')}), ${round(Math.hypot(sn.p[0] - cap[0], sn.p[1] - cap[1]))} px from the capital, beyond ${PLACE.seedMaxFromCapitalPx} px; the old map's land there does not match the drawing, so no seed is added.`);
        continue;
      }
      if (!seedCandidates.has(c)) seedCandidates.set(c, []);
      seedCandidates.get(c).push({ tag: r.tag, p: sn.p, state: st.id, snapPx: sn.distPx });
    }
  }
  for (const [c, list] of [...seedCandidates].sort((a, b) => a[0] - b[0])) {
    const holders = taken.get(c);
    const counts = new Map();
    for (const e of list) counts.set(e.tag, (counts.get(e.tag) ?? 0) + 1);
    const order = [...counts].sort((a, b) => b[1] - a[1] || realms.findIndex(x => x.tag === a[0]) - realms.findIndex(x => x.tag === b[0]));
    if (holders && holders.size) {
      for (const [tag, n] of order) records.get(tag).conflicts.push(`${n} old state(s) of this realm fall on a land that already holds ${[...holders].join(', ')}; no seed added there.`);
      continue;
    }
    const [winner, n] = order[0];
    for (const [tag, m] of order.slice(1)) records.get(tag).conflicts.push(`${m} old state(s) fall on a land where ${winner} has ${n}; the island goes to ${winner} (one owner).`);
    const pick = list.filter(e => e.tag === winner).sort((a, b) => a.snapPx - b.snapPx || a.state - b.state)[0];
    const sn = snap(winner, pick.p, PLACE.seedSnapReachPx);
    if (!sn) continue;
    const rec = records.get(winner);
    rec.seeds ??= [];
    rec.seeds.push({ point: sn.p, method: 'old states', source: `old state ${pick.state} (${n} old state(s) on this land)`, snapPx: round(pick.snapPx + sn.distPx, 1), status: 'proposed', land: landAt(sn.p) });
    placed.push({ tag: winner, p: sn.p });
    taken.set(c, new Set([winner]));
  }

  // ---- natural borders: one-sided bands along the canon's lines
  const cross2 = (a, b, p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  const segCross = (a, b, c, d) => { const d1 = cross2(c, d, a), d2 = cross2(c, d, b), d3 = cross2(a, b, c), d4 = cross2(a, b, d); return d1 * d2 < 0 && d3 * d4 < 0; };
  /** Nearest point of a set of polylines: { d, side (+1/-1), atEnd } where atEnd means past a polyline's free end. */
  const nearestOnLines = (lines, p) => {
    let best = null;
    for (const path of lines) for (let k = 1; k < path.length; k++) {
      const a = path[k - 1], b = path[k], dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
      const tRaw = l2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2 : 0, t = Math.max(0, Math.min(1, tRaw));
      const q = [a[0] + t * dx, a[1] + t * dy], d = Math.hypot(p[0] - q[0], p[1] - q[1]);
      if (!best || d < best.d) best = { d, side: Math.sign(cross2(a, b, p)) || 1, atEnd: (k === 1 && tRaw < 0) || (k === path.length - 1 && tRaw > 1) };
    }
    return best;
  };
  const pointsOf = tag => { const rec = records.get(tag); return [rec.capital.point, ...(rec.seeds ?? []).map(s => s.point)]; };
  const ownClaimGuard = tag => dilateBox(gridMaskOfRings(claims.get(tag) ?? []), Math.ceil(NATURAL.claimClearancePx / ZONE_GRID.cell), ZONE_GRID.w, ZONE_GRID.h);
  for (const nb of NATURAL_BORDERS) {
    const [A, B] = nb.realms;
    const ca = records.get(A).capital.point, cb = records.get(B).capital.point;
    // each named line counts only where the straight line between the two seats crosses it; the seats' sides come
    // from the crossed segment (a line's left and right are consistent along its own direction)
    const crossed = [], missed = [];
    for (const id of nb.lines) {
      const path = feature(id).path;
      const k = path ? path.findIndex((q, i) => i > 0 && segCross(ca, cb, path[i - 1], q)) : -1;
      if (k > 0) crossed.push({ id, path, sideA: Math.sign(cross2(path[k - 1], path[k], ca)), sideB: Math.sign(cross2(path[k - 1], path[k], cb)) });
      else missed.push(id);
    }
    if (!crossed.length) { borderReport.push({ realms: nb.realms, lines: nb.lines, applied: false, reason: 'on this map no named line lies between the two seats (the straight line from capital to capital crosses none of them)', basis: nb.basis }); continue; }
    const r = NATURAL.bandPx;
    const bandOf = (path, side) => {
      const m = new Uint8Array(ZONE_GRID.w * ZONE_GRID.h);
      const xs = path.map(p => p[0]), ys = path.map(p => p[1]);
      const c0 = Math.max(0, Math.floor((Math.min(...xs) - r) / ZONE_GRID.cell)), c1 = Math.min(ZONE_GRID.w - 1, Math.ceil((Math.max(...xs) + r) / ZONE_GRID.cell));
      const r0 = Math.max(0, Math.floor((Math.min(...ys) - r) / ZONE_GRID.cell)), r1 = Math.min(ZONE_GRID.h - 1, Math.ceil((Math.max(...ys) + r) / ZONE_GRID.cell));
      for (let j = r0; j <= r1; j++) for (let i = c0; i <= c1; i++) {
        const n = nearestOnLines([path], [(i + 0.5) * ZONE_GRID.cell, (j + 0.5) * ZONE_GRID.cell]);
        if (n.d <= r && !n.atEnd && n.side === side) m[j * ZONE_GRID.w + i] = 1;
      }
      return m;
    };
    const applied = [];
    for (const [tag, other, otherSideOf] of [[A, B, l => l.sideB], [B, A, l => l.sideA]]) {
      const m = new Uint8Array(ZONE_GRID.w * ZONE_GRID.h), guard = ownClaimGuard(tag);
      for (const l of crossed) { const b = bandOf(l.path, otherSideOf(l)); for (let c = 0; c < m.length; c++) if (b[c] && !guard[c]) m[c] = 1; }
      const polys = polygonFromMask(m);
      const hit = pointsOf(tag).find(p => pointInPolygons(p[0], p[1], polys));
      if (hit) { borderReport.push({ realms: nb.realms, lines: crossed.map(l => l.id), applied: false, for: tag, reason: `the band on ${other}'s side holds ${tag}'s point (${hit.join(', ')})`, basis: nb.basis }); continue; }
      if (!borderExclusions.has(tag)) borderExclusions.set(tag, []);
      borderExclusions.get(tag).push({ border: `${A}|${B}`, name: `${other}'s side of ${crossed.map(l => l.id).join(' and ')}`, polygons: polys });
      applied.push(tag);
    }
    if (applied.length) borderReport.push({ realms: nb.realms, lines: crossed.map(l => l.id), ...(missed.length ? { linesNotBetweenSeats: missed } : {}), applied: true, excludedRealms: applied, basis: nb.basis });
  }

  // ---- weights and overlords
  const oldCounts = new Map(world.assignment.realms.map(x => [x.tag, x]));
  for (const r of realms) {
    const rec = records.get(r.tag), oc = oldCounts.get(r.tag);
    let target, basis;
    if (oc?.extentStates) { target = oc.extentStates; basis = 'roster extent'; }
    else if (oc?.states) { target = oc.states; basis = 'old map state count'; }
    else { target = r.population / WEIGHT.populationPerState; basis = 'population'; }
    const value = round(Math.min(WEIGHT.max, Math.max(WEIGHT.min, target / WEIGHT.statesPerUnit)), WEIGHT.decimals);
    rec.weight = { value, targetStates: target, basis };
    if (r.overlord) {
      const o = byKey.get(r.overlord);
      if (!o) issues.push(`${r.tag}: overlord key ${r.overlord} is not a roster realm`);
      else rec.overlord = { tag: o.tag, subjectType: r.subjectType };
    }
  }

  // ---- assemble, in the tool's schema: points are { x, y } objects of integer world pixels
  const P = p => ({ x: p[0], y: p[1] });
  const poly = ring => ring.map(P);
  const exclusionPolygons = tag => [...exclusionsFor(regionOf(tag)).map(e => e.polygon), ...(borderExclusions.get(tag) ?? []).flatMap(e => e.polygons)];
  const countries = {
    source: 'workspace',
    realms: realms.filter(r => records.get(r.tag).capital).map(r => {
      const rec = records.get(r.tag);
      const out = { tag: r.tag, capital: P(rec.capital.point) };
      if (rec.seeds?.length) out.seeds = rec.seeds.map(s => P(s.point));
      if (claims.get(r.tag)?.length) out.claim = claims.get(r.tag).map(poly);
      const ex = exclusionPolygons(r.tag);
      if (ex.length) out.exclude = ex.map(poly);
      out.weight = rec.weight.value;
      if ((out.seeds?.length ?? 0) > RULES.maxSeeds || (out.claim?.length ?? 0) > RULES.maxClaimPolygons || (out.exclude?.length ?? 0) > RULES.maxExcludePolygons) issues.push(`${r.tag}: more seeds, claim or exclusion polygons than the schema allows`);
      return out;
    }),
    unowned: wildReport.flatMap(w => w.polygons).map(poly),
    islands: COUNTRIES_OPTIONS.islands,
  };
  if (countries.unowned.length > RULES.maxUnownedPolygons) issues.push(`${countries.unowned.length} unowned polygons, more than the schema's ${RULES.maxUnownedPolygons}`);
  for (const r of realms) {
    const rec = records.get(r.tag);
    rec.claim = claimNotes.get(r.tag) ?? [];
    rec.exclude = [...exclusionsFor(r.region).map(e => ({ barrier: e.barrier, name: e.name })), ...(borderExclusions.get(r.tag) ?? []).map(e => ({ border: e.border, name: e.name, polygons: e.polygons.length }))];
  }
  const subjects = realms.filter(r => records.get(r.tag).overlord).map(r => ({ tag: r.tag, overlord: records.get(r.tag).overlord.tag, subjectType: records.get(r.tag).overlord.subjectType }));
  return { countries, records: [...records.values()], wild: wildReport, borders: borderReport, subjects, issues, world };
}

/** Land predicate for the validator: the land the import reads (the surface the generator places points on). */
export const landPredicate = world => (x, y) => x >= 0 && y >= 0 && x < FRAME.width && y < FRAME.height && world.surface[y * FRAME.width + x] === 1;

export function reportOf(build, validation) {
  const { records, wild, borders, subjects, issues, world } = build;
  return {
    schema: 1,
    generatedBy: 'tools/politics/realm_seeds.mjs (deterministic; regenerate with --write, never edit by hand)',
    target: 'hoi4_map_rewrite create_world.countries, workspace form (map tool ADR 0069; schemas/map-operation.schema.json of the tool\'s main branch after PR 44, release 4.5.0; request ZR-8)',
    frame: { width: FRAME.width, height: FRAME.height, origin: 'top-left', unit: 'world pixel' },
    inputs: Object.fromEntries(Object.entries(world.hashes).map(([k, v]) => [k, { path: PATHS[k], sha256: v }])),
    drawing: world.drawn ? { path: PATHS.drawing, sha256: world.drawn.sha256, use: 'read in memory only; points must stand on the land the import reads from it' } : null,
    surface: world.drawn ? 'the drawing as the import reads it (illustrated heuristic with the surface-override annotations of preview_call.json) less the model lakes the import carves; points keep PLACE.marginPx from its coast and generated points PLACE.edgeClearPx from the frame edge' : 'model land only (lands less lakes; the private drawing was absent)',
    tuning: { PLACE, FIELD, WEIGHT, POLYGON, WILD, NATURAL },
    options: COUNTRIES_OPTIONS,
    barriers: BARRIERS.map(b => ({ id: b.id, basis: b.basis, sides: b.sides.map(s => ({ name: s.name, keepOut: s.keepOut })) })),
    wildLands: wild.map(w => ({ id: w.id, name: w.name, polygons: w.polygons.length, basis: w.basis, status: 'proposed' })),
    wildNotPlaced: WILD_NOT_PLACED,
    naturalBorders: borders,
    naturalBordersNotApplied: NATURAL_NOT_APPLIED,
    subjects: { relations: subjects, validation: validateSubjects(subjects, records.map(r => r.tag)), note: COUNTRIES_OPTIONS.subjectsNotSent },
    summary: {
      realms: records.length,
      capitalsByMethod: records.reduce((m, r) => ({ ...m, [r.capital.method]: (m[r.capital.method] ?? 0) + 1 }), {}),
      sitesMovedOntoLand: records.filter(r => r.capital.method === 'site' && r.capital.snapPx > 0).map(r => ({ tag: r.tag, site: r.capital.source, movedPx: r.capital.snapPx })),
      capitalsMovedOver60Px: records.filter(r => r.capital.method !== 'site' && r.capital.snapPx > 60).map(r => ({ tag: r.tag, movedPx: r.capital.snapPx })),
      seeds: records.reduce((s, r) => s + (r.seeds?.length ?? 0), 0),
      realmsWithClaims: records.filter(r => r.claim.length).map(r => r.tag),
      subjects: records.filter(r => r.overlord).length,
      naturalBordersApplied: borders.filter(b => b.applied).map(b => b.realms.join('|')),
    },
    ownerQuestions: OWNER_QUESTIONS,
    importObservations: IMPORT_OBSERVATIONS,
    validation: { ok: validation.ok, errors: validation.errors, warnings: validation.warnings },
    issues,
    realms: records.map(r => ({
      tag: r.tag, key: r.key, name: r.name, region: r.region, subRegion: r.subRegion,
      capital: r.capital ? { name: r.capitalName, ...r.capital } : null,
      seeds: r.seeds ?? [], claim: r.claim, exclude: r.exclude, weight: r.weight, overlord: r.overlord ?? null,
      conflicts: r.conflicts, proposed: r.proposed,
    })),
  };
}

/** The data file with one realm and one unowned polygon per line, so a change reads as a change of that realm. */
export function formatSeeds(doc) {
  const c = doc.countries, list = items => items.map(x => `   ${JSON.stringify(x)}`).join(',\n');
  return `{\n "schema": ${doc.schema},\n "note": ${JSON.stringify(doc.note)},\n "countries": {\n  "source": ${JSON.stringify(c.source)},\n  "realms": [\n${list(c.realms)}\n  ],\n  "unowned": [\n${list(c.unowned)}\n  ],\n  "islands": ${JSON.stringify(c.islands)}\n }\n}\n`;
}

/**
 * The ready `create_world` call: the verified preview call of the import (preview_call.json, the same tool, workspace
 * and operation) with `countries` added. It stays a preview; the lead turns `preview` off for the write.
 */
export function createWorldCall(countries) {
  const base = JSON.parse(readFileSync(path.join(ZIN, PREVIEW_CALL), 'utf8'));
  const [op, ...rest] = base.arguments.operations;
  if (op?.kind !== 'create_world' || rest.length) throw new Error(`${PREVIEW_CALL} is not one create_world operation`);
  return { ...base, arguments: { ...base.arguments, preview: true, operations: [{ ...op, countries }] } };
}
/** Errors of a create_world call's operations against the tool's published map-operation schema (read-only use). */
export async function schemaCheck(call, { tool = DEFAULT_TOOL, ref = 'origin/main' } = {}) {
  const V = await import(pathToFileURL(path.join(ZIN, 'tools/content/geography/validate_import.mjs')).href);
  const schema = V.toolSchema(tool, ref, V.SCHEMAS.operation);
  const ajv = V.toolAjv(tool);
  return call.arguments.operations.flatMap(op => V.schemaErrors(ajv, schema, op));
}

async function main(argv) {
  const args = argv.slice(2);
  if (args.includes('--schema')) {
    const seeds = JSON.parse(readFileSync(OUT.seeds, 'utf8'));
    const errs = await schemaCheck(JSON.parse(readFileSync(OUT.call, 'utf8')));
    const own = await schemaCheck(createWorldCall(seeds.countries));
    console.log(`create_world_call.json against the tool's map-operation schema (origin/main): ${errs.length ? 'INVALID' : 'valid'}; realm_seeds.json in the preview call: ${own.length ? 'INVALID' : 'valid'}`);
    for (const e of [...errs, ...own]) console.log(`  ${e}`);
    if (errs.length || own.length) process.exitCode = 1;
    return;
  }
  if (args.includes('--check')) {
    const world = await loadWorld({ drawing: !args.includes('--no-drawing'), marginPx: 0 });
    const seeds = JSON.parse(readFileSync(OUT.seeds, 'utf8'));
    const v = validateCountries(seeds.countries, { isLand: landPredicate(world), knownTags: new Set(world.roster.realms.map(r => r.tag)), minSeparationPx: PLACE.validatorMinSeparationPx });
    console.log(`realm_seeds.json: ${v.ok ? 'valid' : 'INVALID'}; ${v.errors.length} errors, ${v.warnings.length} warnings`);
    for (const e of [...v.errors, ...v.warnings]) console.log(`  ${e.code}: ${e.message}`);
    if (!v.ok) process.exitCode = 1;
    return;
  }
  const build = await buildRealmSeeds({ drawing: !args.includes('--no-drawing') });
  const v = validateCountries(build.countries, { isLand: landPredicate(build.world), knownTags: new Set(build.world.roster.realms.map(r => r.tag)), minSeparationPx: PLACE.validatorMinSeparationPx });
  const report = reportOf(build, v);
  console.log(`${build.countries.realms.length} realms, ${build.countries.realms.reduce((s, r) => s + (r.seeds?.length ?? 0), 0)} seeds, ${build.countries.realms.filter(r => r.claim).length} realms with claims, ${build.countries.unowned.length} unowned polygons; validation ${v.ok ? 'passes' : 'FAILS'} (${v.errors.length} errors, ${v.warnings.length} warnings); ${build.issues.length} issues`);
  for (const e of [...v.errors, ...v.warnings]) console.log(`  ${e.code}: ${e.message}`);
  for (const i of build.issues) console.log(`  issue: ${i}`);
  if (args.includes('--write')) {
    if (!v.ok || build.issues.length) { console.error('not written: the result does not validate'); process.exitCode = 1; return; }
    mkdirSync(path.dirname(OUT.seeds), { recursive: true });
    const doc = { schema: 1, note: 'The realms of tools/content/data/world/roster.json as the workspace form of create_world.countries (map tool ADR 0069). World pixels of the 5,120 x 2,560 frame, top-left origin. Generated by tools/politics/realm_seeds.mjs; numbers and ids only. Per-realm inputs, canon basis and proposals: realm_seeds_report.json.', countries: build.countries };
    writeFileSync(OUT.seeds, formatSeeds(doc));
    writeFileSync(OUT.report, `${JSON.stringify(report, null, 1)}\n`);
    writeFileSync(OUT.call, `${JSON.stringify(createWorldCall(build.countries))}\n`);
    console.log(`wrote ${[OUT.seeds, OUT.report, OUT.call].map(f => path.relative(process.cwd(), f)).join(', ')}`);
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv).catch(e => { console.error(e); process.exitCode = 1; });
