# Handoff: realm seeds for the drawn-map import (politics input, ZR-8)

Status: implemented and validated offline; not yet passed to `create_world` (the tool's workspace form is still being implemented on `claude/zr8-workspace-countries`). Every placement of a realm without a capital site is a proposal; the owner questions are listed below.

## What exists

| Path | What |
| --- | --- |
| `tools/politics/realm_seeds.mjs` | The deterministic generator: canon tables (capital anchors, seeds, claims, barriers, wild lands, owner questions, import observations), the build, the report and the command line. |
| `tools/politics/countries_validator.mjs` | Validator of the workspace form of `create_world.countries` (ADR 0069 rules). |
| `tools/politics/world_inputs.mjs` | Read-only inputs: roster, import geography, repaired model zones, old state assignment and centres, the drawing as the import reads it. |
| `tools/politics/geometry.mjs` | Point, polygon and raster helpers (world pixels, top-left origin). |
| `tools/politics/realm_seeds.test.mjs` | `node:test` file: validator rules on synthetic cases and the real output. |
| `tools/politics/data/realm_seeds.json` | The output: `{ schema, note, countries }`, one realm per line, numbers and ids only. |
| `tools/politics/data/realm_seeds_report.json` | Per realm: inputs used, method, anchor and snap distance, canon basis, seeds, claims, exclusions, weight basis, overlord, conflicts and proposals; plus the barriers, wild lands, summary, owner questions, import observations and the validation result. |

Commands (from the mod root):

- `node tools/politics/realm_seeds.mjs` builds, validates and prints a summary without writing.
- `node tools/politics/realm_seeds.mjs --write` writes both data files (refuses when validation fails).
- `node tools/politics/realm_seeds.mjs --check` validates the committed `realm_seeds.json` against the land and the rules.
- `node --test tools/politics/*.test.mjs` runs the tests (14 pass; about 16 s, most of it reading the drawing twice).

**Test registration (for the lead):** add `politics/realm_seeds.test.mjs` to the `test` script of `tools/package.json` (paths there are relative to `tools/`). I did not edit `tools/package.json`.

The build reads the private drawing (`docs/reference/originals/Erdae.png`) in memory only, through `tools/content/geography/import_measures.mjs`, exactly as `feature_surface.json` was measured; nothing derived from its pixels is written except point coordinates. Without the drawing, `--no-drawing` builds on the model's land, and the two tests that need the drawing (land check and byte-for-byte rebuild) skip with a reason.

## The schema and the validator

The tool's published schema does not carry the realm definitions yet: `schemas/map-operation.schema.json` on `claude/zr8-workspace-countries` (and in its worktree, clean) has no `workspace`, `realms` or realm definitions; only ADR 0069 exists (commit `867807d`). So `countries_validator.mjs` implements the ADR's rules itself:

- form: `source: "workspace"`, 1 to 512 realms, no unknown fields, tags of three capital letters or digits and unique, points and polygon vertices inside the 5,120 x 2,560 frame, polygons of at least three finite points with an area, `weight` 0.05 to 100, `islands` one of `nearest`, `one-owner`, `unowned`, `connectedMainland` boolean;
- every capital and seed on land (`MAP_WORLD_REALM_POINT_WATER`, the tool's code); the land is the drawing as the import reads it, with the model's lakes carved and the strict sea bands of the frame edge cleared;
- no capital or seed inside another realm's claim, its own exclusion or the unowned area;
- no two realms' claims overlap (claims that only share a border pass);
- every overlord is a listed realm, not the realm itself, and the relation has no cycle;
- every tag is known (`MAP_WORLD_REALM_TAG_UNKNOWN`, the tool's code; the generator passes the roster's tags);
- added for safety: a claim must not overlap its own exclusion or the unowned area (a province cannot be forced and blocked), and points of two realms closer than 12 px are a warning.

The other codes are this validator's own (`REALM_*`, `COUNTRIES_FORM_INVALID`). When the tool's schema lands, validate `realm_seeds.json` against it with the tool's Ajv as `tools/content/geography/validate_import.mjs` does for the geography, and reconcile any difference.

## The `countries` block to pass

Pass the `countries` object of `tools/politics/data/realm_seeds.json` verbatim as `create_world.countries`, beside the operation fields of the verified preview (`tools/content/data/geography/import/preview_call.json`):

```json
{
  "id": "world",
  "kind": "create_world",
  "width": 5120,
  "height": 2560,
  "edge": { "mode": "sea-band" },
  "reference": "(as in preview_call.json: imagePath, sheetsPath, mode illustrated, agreement, annotations)",
  "geographyPath": "tools/content/data/geography/import/aoaz.geography.json",
  "countries": "(the countries object of tools/politics/data/realm_seeds.json)"
}
```

Its shape (abridged; the file holds all 156 realms):

```json
{
  "source": "workspace",
  "realms": [
    { "tag": "AEN", "capital": [3061, 1464], "exclude": [[[3459, 1057], "..."], [[3150, 1960], "..."]], "weight": 5.5 },
    { "tag": "LER", "capital": [2975, 1023], "seeds": [[2754, 786]], "weight": 2 },
    { "tag": "KIN", "capital": [3348, 1497], "claim": [[[3278, 1312], "..."]], "exclude": ["..."], "weight": 0.75, "overlord": "AEN" },
    "..."
  ],
  "unowned": [[[4719, 2381], "..."], "..."],
  "islands": "one-owner",
  "connectedMainland": true
}
```

For the override file of ADR 0067 step 3 (once its schema exists), each realm becomes one `countries` entry of the same schema with an `id`; use the roster key (`aenor`, `lerendor`, ...) as the id. Do not also pass the inline `realms` (a tag in both is refused).

Before the write: the roster's tags must be declared by `common/country_tags/01_zin_realms.txt`, which the mod's build writes (`tools/content/modules/countries.mjs`); the file is not in the tree now, so the tool would refuse every realm. The old world's `00_zin_countries.txt` (305 Y tags) is a managed output the write retires.

## How each field was made

**Capitals.** 63 realms have a capital site in the import geography; each keeps its exact point, except three sites the import's reading puts on water or within 3 px of a coast, moved to the nearest land: Yeldenne (`site_yeldenne_landing`, 28 px), Hunhun (`site_hunhun`, 4 px) and Mora (`site_mora`, 3 px). The other 93 realms have no site (`capital.siteId` null in the roster). Their seats come from `CAPITAL_ANCHORS`: 44 at a drawn label read off the owner's drawing in the world frame, 16 at a model feature (pass, river end, range point, lake shore, strait end), 12 at the pole of a model area the roster names as the realm's land (a forest, plain, ice field or waste), 10 on a named model island, 5 at a point chosen from the dossier's description, and 6 at the old map's capital moved into the new frame (the old state centres, y flipped, displaced by a field fitted on the 63 sited capitals per roster region). Every point then snaps to the nearest pixel at least 3 px inside the import's coast, 253 px from the east and west frame edges and 88 px from the north and south ones, outside every other realm's claim, the unowned area and its own exclusions, and at least 20 px from any other realm's point. One seat moved more than 60 px (Xison, 64 px: the drawn Akahew label lies on water as the import reads it). Two canon sites stand 18 px apart (Bordon and Dreson); they are kept.

**Seeds (7).** Lerendor's North (decision K49) as a seed in the drawn snow country; Exhoros and Unlo for Puvulan; the Great Swamp for Mirolon; and old-map islands on separate model lands of at least 400 px within 450 px of the realm's seat: Goldoroth (an isle of the Sea of Darkness), the Bloody Forest (the isle off the Organ cape) and Orato (the Fladev isle). Old states that project onto another realm's landmass, the realm's own model land, a tiny islet or a place far from the seat add no seed; each case is listed in the report's conflicts.

**Claims (6).** Zol's Mistake: the whole black north and the black isles of the Kusmeel (the repaired model's zone, on land). The Nether: `land_nether_island`. Vindael: `land_island_001`, the ice arm (cold_lands.md). Orohaf: `land_aenor_isle`. Kingson: the model's Kingson Vale plain (proposed size, P-08). Hirolon: bands along the Hiloff Rim from Hirolon Head to the Hilorn mouth and along the Grano (the dossier's proposed ring, P-07). No claims overlap; no other realm's point lies in one.

**Exclusions (5 barriers).** Each barrier keeps the realms of one region out of the canon land of a neighbouring region on the same landmass and leaves a strip between the two sides to natural growth:

- `great_wall`: Middle Lands realms stay west of the eastern foothill edge of the repaired model's `zone_great_wall`, Magical Lands realms east of its western edge (K2; middle_lands.md 2.9);
- `zilin_marches`: Middle and Magical realms stay north of the Zilin marches and Mirolon's mountains; Ember, East and South realms stay out of the Middle and Magical Lands (ember_lands.md 2);
- `cold_neck`: Cold and West Lands realms each stay on their side of the neck (west_lands.md 2);
- `ember_isles`: East and South realms stay off the Ember Lands island and the Nether; Ember realms stay out of the Sun Desert and the East Lands south of Mirolon;
- `hardtmuth`: East realms stay out of the Sun Desert west of the Hardtmuth chain; South realms stay out of the East Lands north of the desert and east of the Ergo country (south_lands.md 2).

**Unowned (10 polygons, all proposed in their dossiers).** Mount Ergo, Mount Argul and the Reeto caves (circles of 34 px round the model's volcanoes), the high Melty glaciers (the crest south of Ostoroth's seat), the Kherith Isles (`land_island_054`), the Abyss (the model's chasm, shrunk 8 px so Nezer's seat stays outside), the Lustras Hills, the Herrodon crest, the heart of the Fallen Forest and the high snows of the Magic Mountains. Not placed, with reasons in the report: the Lost Lands, Dragon Mountain's summit, the dune sea and the deep southern sand, the Plutondo Dunes, the Cursed Square, the Dark Lands' Death Islands, and the Middle Lands' high snows and Darkhere (held on the map by their dossier).

**Weights.** `weight = clamp(targetStates / 4, 0.05, 100)`, two decimals (`WEIGHT.statesPerUnit = 4`). `targetStates` is the roster's stated extent where it gives a state count (`state_assignment.json` `extentStates`, 47 realms), else the realm's state count on the old map (an area proxy, 109 realms); population is only the fallback when neither exists (no realm). Realm sizes therefore follow the roster where it states a size; P-10 asks about the rest.

**Overlords (19).** From the roster's `overlord` keys: 12 chartered dominions of Aenor, Dark Gate under Goldoroth, Khorvrath, Dolon and Nezer sworn to Puvulan, Teste under Herrodon, Tirlan under Hirolon. No cycles.

**`islands: "one-owner"`.** Every drawn island in the dossiers belongs to one realm or is a named wild place, and the approved layout of 17 October gives each small island one owner (docs/generation/assumptions.md); with one-owner a landmass no seed is on goes whole to the first realm that reaches it over the sea (ADR 0060). **`connectedMainland: true`.** Every mainland realm is one connected piece in the approved layout; the tool joins a realm's seeds on its capital's landmass by a corridor (which matters for Lerendor, P-02).

## Canon and proposal

Derived from canon: the 63 capital sites, the 19 overlord relations, the Nether, Vindael, Orohaf and Zol claims, the Great Wall as the Middle and Magical Lands' border (K2), Lerendor's North (K49), the Hirolon and Tirlan relation (K35), the stated extents behind the weights, and the list of wild lands (named in the dossiers, themselves marked proposed). Proposed here: all 93 siteless seats, every seed, the Kingson and Hirolon claims' exact shapes, every barrier's exact line, every wild land's shape and size, and the weight formula.

## Owner questions (proposed choices; numbered P- so the lead can assign Q- numbers)

- **P-01 (Yeldenne).** The roster's capital Simoto is the model's landing on the Gulf of Minnolomak, about 400 px from the Castle of Yeldenne and the valley of Mp'E; a one-state realm cannot hold both. Kept at the site. Move the landing below the castle, or the seat to the valley?
- **P-02 (Lerendor).** Lerendor's North is seeded in the drawn snow country; the tool will join it to Sonargur by a corridor through Tolvael, the Heodwa Lands, Hrakbrund or Mustnom. Accept, or make Lerendor's North a separate realm under the same crown?
- **P-03 (Lerendor).** The Low-ness Islands and Ferlinon's pine hills have no model feature; the old Low-ness state projects onto Tolhon's island. Not placed: where are they?
- **P-04 (Pornivior).** The drawing labels Pornyior beside Argon (Mount Argul); the roster says below Mount Ergo. The seat follows the drawing. Which mountain?
- **P-05 (Ihuy, Soyano).** The model puts Ossi Luni (Soyano's) on Hol's island with the Great Volcano (Ihuy's seat); the island goes to Ihuy, and Soyano's seat is on the northernmost Sun isle. Agree?
- **P-06 (Olen, Halia, Mirolon).** The drawing writes Gelbus and Luminor on Mirolon's eastern lowland, which the import joins to the East Lands; Halia's seat is placed on the same lowland's south shore because the peninsula's western tongue is too narrow for two seats. Keep Olen on the mainland, or move it to an isle?
- **P-07 (Hirolon, Tirlan).** Hirolon claims the crests of its proposed ring (Hiloff Rim south stretch and Grano) and Tirlan grows inside from Tirbur. Accept the ring as Hirolon's fixed land?
- **P-08 (Kingson).** Kingson claims the model's whole Kingson Vale plain (about 200 by 300 px with the gorge), larger than three states. Keep, or the valley floor only?
- **P-09 (wild lands).** Ten wild lands are unowned; whether the game accepts ownerless states is still to be verified in the Linux run. Keep them unowned, or give each to its neighbour as the old map did?
- **P-10 (sizes).** Weights follow stated extents where the roster gives them and old-map counts otherwise; where the stated extents are smaller than the land (the Magical Lands most of all), realms grow larger than stated or the wild lands must grow. Accept, or state the missing extents?
- **P-11 (wild lands not placed).** The Lost Lands, Dragon Mountain's summit, the dune sea, the Plutondo Dunes, the Cursed Square and the Dark Lands' Death Islands are not placed (reasons above). Agree?
- **P-12 (Eldafaen).** The roster puts Eldafaen on the southern rift shore; the old seat and the drawn Endelond label lie in the north-east. The seat follows the roster. Which is right?
- **P-13 (Triton realms).** The siteless Triton realms sit on the islands their drawn labels or the old map give them (Seite on the long isle under its label, the Windy Lands on the south of Raerby's arc, Santon on the outer western arc, Halenor south of Kilos, the Lens east of Adel, Fineger on the northernmost isle). Agree?

## Import observations (for the map lead, not the owner)

Measured on the land the import reads (heuristic and annotations, as `preview_call.json`):

- The West Lands and the Cold Lands do not touch: there is no land at y 940 between x 500 and 1400, though the model joins them by the neck (`land_western_mainland`); the Coldor Channel is also read as water. The `cold_neck` barrier is harmless if the import later closes the neck.
- The Magical Lands sheet ends near x 3830: sea (x 3815 to 3830), a pencil-line strip read as land (x 3831 to 3843, y 1100 to 1700) and sea again split the rift coast (the Mushroom Forest and the Rift Narrows) from the rest of `land_central_mainland`.
- The central and eastern mainlands touch through Mirolon's eastern lowland (about x 3450 to 3700, y 1880 to 2000), and the Nether's eastern tip touches the Sun Desert near (3240, 2400), so the Ember Lands island, the Nether and the East and South Lands read as one landmass; the `zilin_marches` and `ember_isles` barriers and the Nether's claim keep the regions apart.
- Lettering in the sea is read as land, for example the drawn "Ocean of Edvoid" at x 3260 to 3640, y 660 to 700.
- The roster's tags are not yet declared in the workspace (see above).

## Limits

- The import's own working copy of the drawing and its ragged edge clearing are not reproduced exactly; points keep 3 px from the coast and generated points keep clear of the ragged band, but the tool's land test is the authority. Sites near the east edge (Drak, Stabilo, Ostoroth) are in the band where the clearing is ragged; the 25 October preview found every site on its surface.
- The barriers are drawn in world pixels against the current registration; a re-registration of the sheets that moves a coast by more than a few dozen pixels needs a rebuild and a look at the barrier lines.
- Growth itself (`growTerritory` inside `create_world`) is not run here; the realm sizes, borders and corridors it produces are the tool's to report (`data.realms`, `map-world-realms.json`) and need review after the first preview with this block.
- No MCP map route was used: this is offline input generation; the `create_world` preview with this block is the MCP step.

## Per realm

Capital in world pixels; "From" is the site, or the anchor method and its source (with the snap distance where it exceeds 10 px); seeds and claims as above; weight with its target states and basis. Full detail, conflicts and the canon basis of every proposed seat are in `realm_seeds_report.json`.

| Tag | Realm | Region | Capital (x, y) | From | Seeds | Claim | Weight (target, basis) | Overlord |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AEN | Aenor | Middle | (3061, 1464) | site_parim |  |  | 5.5 (22, extent) |  |
| LER | Lerendor | North | (2975, 1023) | site_sonargur | (2754, 786) |  | 2 (8, old map) |  |
| CLD | Coldor | Cold | (793, 355) | site_fandanar |  |  | 11 (44, old map) |  |
| NRS | Noris | East | (4285, 1960) | site_noris |  |  | 9.75 (39, old map) |  |
| STA | Stabilo | East | (4849, 2040) | site_postondoroth |  |  | 9.5 (38, old map) |  |
| GOL | Goldoroth | Dark | (2467, 1182) | site_cocanoor | (2570, 1200) |  | 1.5 (6, old map) |  |
| DND | Dondor | Dark | (2544, 1079) | site_notbuton |  |  | 0.25 (1, old map) |  |
| PUV | Puvulan | Ember | (3041, 2189) | site_nafeher | (3150, 2118) (2954, 2302) |  | 1.75 (7, old map) |  |
| ZOL | Zol's Mistake | Zol | (3921, 430) | site_furviatlon |  | zone zols_mistake | 26 (104, old map) |  |
| MIR | Mirolon | Ember | (3397, 1961) | site_mirolon | (3382, 1870) |  | 1.5 (6, old map) |  |
| WOR | Worshipdom | Magical | (3530, 1807) | site_worshipdom_valleys |  |  | 0.75 (3, old map) |  |
| MAG | Magical Forest | Magical | (3660, 1484) | site_magical_forest |  |  | 2 (8, extent) |  |
| GAA | Gala | Sun | (754, 2319) | site_gala |  |  | 0.5 (2, extent) |  |
| GNW | Gunwyn | West | (926, 1044) | site_gunwaith |  |  | 3 (12, old map) |  |
| SEL | Selen | Middle | (3010, 1233) | site_selen |  |  | 2.25 (9, extent) | AEN |
| KIN | Kingson | Middle | (3348, 1497) | site_kingson |  | area plain_kingson_vale | 0.75 (3, extent) | AEN |
| HIR | Hirolon | Middle | (2867, 1556) | site_hiloron |  | band along range_hiloff_rim; band along range_grano | 0.75 (3, extent) |  |
| MLK | Melkgard | Cold | (1111, 184) | site_isengard |  |  | 3 (12, old map) |  |
| HOR | Horidor | Cold | (1397, 552) | site_horidor |  |  | 5.5 (22, old map) |  |
| YEL | Yeldenne | Cold | (1356, 144) | site_yeldenne_landing (moved 28.3 px) |  |  | 0.25 (1, extent) |  |
| GIR | Girdon | West | (977, 1164) | site_girdon |  |  | 1.5 (6, old map) |  |
| KON | Konori | Middle | (3189, 1241) | site_konori |  |  | 1.25 (5, extent) | AEN |
| HNH | Hunhun | Middle | (3141, 1588) | site_hunhun (moved 3.6 px) |  |  | 1.25 (5, extent) | AEN |
| KLU | Klungori Guard | Middle | (3307, 1762) | feature pass_south_gate |  |  | 0.5 (2, extent) | AEN |
| HER | Herez | Middle | (3279, 1807) | site_herez |  |  | 1.5 (6, extent) | AEN |
| NOL | Noleksun | Middle | (3247, 1757) | old capital |  |  | 2 (8, extent) | AEN |
| KIL | Kilinti | Middle | (3112, 1402) | site_kilinti |  |  | 1 (4, extent) | AEN |
| SFT | Safeton | Middle | (3126, 1752) | site_safeton |  |  | 0.75 (3, extent) | AEN |
| FRE | Freshon | Middle | (3155, 1730) | old capital |  |  | 1 (4, extent) | AEN |
| PAZ | Pazoma | Middle | (3172, 1652) | dossier text |  |  | 1 (4, extent) | AEN |
| ORH | Orohaf | Middle | (2631, 1456) | site_asgard |  | land land_aenor_isle | 0.5 (2, extent) | AEN |
| FOT | Fotan | Middle | (3065, 1122) | feature strait_narrow |  |  | 0.5 (2, extent) |  |
| KUN | Kunhrim | Middle | (3389, 1323) | site_great_wall_lunhrim_fort |  |  | 0.5 (2, extent) | AEN |
| BRR | Burrikkrit | Middle | (3379, 1651) | feature range_cursed_mountains |  |  | 0.5 (2, extent) |  |
| OLO | Olodor | Middle | (2988, 1399) | feature range_deodolor |  |  | 0.25 (1, extent) |  |
| DNL | Dunelaeth | Middle | (3302, 1314) | area forest_kingdom |  |  | 0.25 (1, extent) |  |
| ANR | Aenor Forest | Middle | (3058, 1158) | area forest_crown |  |  | 0.75 (3, extent) |  |
| CUR | Cursed Lands | Middle | (3292, 1776) | area waste_cursed_lands |  |  | 0.25 (1, extent) |  |
| BLO | Bloody Forest | Middle | (3234, 1134) | area forest_bloody | (3276, 1003) |  | 0.75 (3, extent) |  |
| EEK | Eekedor | North | (3107, 924) | site_eekedor |  |  | 1.5 (6, old map) |  |
| REN | R'en | North | (3133, 1052) | site_ren |  |  | 0.75 (3, old map) |  |
| MOO | Molot | North | (3040, 752) | drawn label |  |  | 1 (4, old map) |  |
| KER | Keredor-Hellekton | North | (3068, 818) | drawn label |  |  | 1 (4, old map) |  |
| TLV | Tolvael | North | (2845, 860) | drawn label |  |  | 2.75 (11, old map) |  |
| TOL | Tolhon | North | (2770, 945) | drawn label |  |  | 0.75 (3, old map) |  |
| HEO | Heodwa Lands | North | (2935, 866) | drawn label |  |  | 1.25 (5, old map) |  |
| HRA | Hrakbrund | North | (2895, 908) | drawn label |  |  | 0.5 (2, old map) |  |
| MIA | Mina | North | (3150, 880) | drawn label |  |  | 1.75 (7, old map) |  |
| DOL | Dolpar | North | (2973, 908) | feature lake_evian (moved 14.2 px) |  |  | 1.5 (6, old map) |  |
| MUS | Mustnom | North | (2893, 990) | drawn label |  |  | 0.25 (1, old map) |  |
| FEA | Fearno | Cold | (1610, 458) | drawn label |  |  | 8.25 (33, old map) |  |
| AUT | Austklev | Cold | (1641, 681) | drawn label (moved 42.4 px) |  |  | 2 (8, old map) |  |
| WRL | Worlond | Cold | (1106, 778) | area forest_worlond |  |  | 5.25 (21, old map) |  |
| PLT | Poloto | Cold | (1390, 718) | feature river_fandan (moved 17.8 px) |  |  | 2 (8, old map) |  |
| HLD | Holdon | Cold | (700, 684) | drawn label |  |  | 1.25 (5, old map) |  |
| GLI | Glimkit | Cold | (564, 677) | feature range_coldor_mountains |  |  | 1 (4, old map) |  |
| XIS | Xison | Cold | (345, 594) | drawn label (moved 64.4 px) |  |  | 4.25 (17, old map) |  |
| PRT | Pertolor | Cold | (1150, 440) | drawn label |  |  | 4.25 (17, old map) |  |
| OMR | Omar | Cold | (1000, 272) | drawn label |  |  | 3.25 (13, old map) |  |
| POT | Portogalor | Cold | (740, 195) | drawn label |  |  | 2.25 (9, old map) |  |
| KVI | Kvittumm | Cold | (272, 300) | drawn label |  |  | 4.75 (19, old map) |  |
| ORW | Orewele | Cold | (330, 278) | drawn label |  |  | 2.5 (10, old map) |  |
| NIV | Nivaros | Cold | (400, 178) | drawn label |  |  | 2 (8, old map) |  |
| YEI | Yeti Lands | Cold | (842, 822) | area hills_yeti_lands |  |  | 3.5 (14, old map) |  |
| GHH | Ghaahu | Cold | (1518, 354) | area ice_north_yeti_lands |  |  | 2 (8, old map) |  |
| VND | Vindael | Cold | (254, 1029) | land land_island_001 |  | land land_island_001 | 3 (12, old map) |  |
| WER | Werlendor | West | (666, 1129) | feature range_erg |  |  | 1.75 (7, old map) |  |
| LAB | Lambin | West | (1070, 1175) | drawn label |  |  | 2.25 (9, old map) |  |
| THN | Thenon | West | (860, 1220) | drawn label |  |  | 1.25 (5, old map) |  |
| DOB | Dobbum | West | (810, 1358) | drawn label (moved 12.8 px) |  |  | 1.25 (5, old map) |  |
| BRU | Brundahrim | West | (860, 1420) | drawn label |  |  | 0.5 (2, old map) |  |
| GRO | Gromkerm | West | (1162, 1216) | feature range_bolpor_boldor |  |  | 0.25 (1, old map) |  |
| SAO | Saopon | West | (1008, 1353) | feature lake_ilurdor |  |  | 1.25 (5, old map) |  |
| BLD | Buldor | West | (920, 1390) | drawn label |  |  | 2 (8, old map) |  |
| KRA | Kradlon | West | (765, 1508) | site_kradlon |  |  | 1 (4, old map) |  |
| CRG | Corogon | West | (1315, 1435) | drawn label |  |  | 2.25 (9, old map) |  |
| VRN | Varnondor | West | (1364, 1536) | site_varnondor_staging |  |  | 1.75 (7, old map) |  |
| WEN | Wennarith | West | (1480, 1421) | drawn label |  |  | 1.5 (6, old map) |  |
| DRK | Dark Gate | Dark | (2534, 1279) | feature pass_dark_gate |  |  | 1 (4, old map) | GOL |
| BUN | Burnikit | Dark | (2473, 1150) | drawn label |  |  | 0.25 (1, old map) |  |
| VES | Veshazel | Dark | (2529, 1242) | drawn label |  |  | 0.5 (2, old map) |  |
| BLK | Blackton | Dark | (2723, 1098) | drawn label |  |  | 1 (4, old map) |  |
| BLN | Belonton | Dark | (2457, 1281) | drawn label |  |  | 0.75 (3, old map) |  |
| BOR | Bordon | Dark | (2416, 1060) | site_bordon |  |  | 0.25 (1, old map) |  |
| DRE | Dreson | Dark | (2406, 1075) | site_dreson |  |  | 0.25 (1, old map) |  |
| DUL | Dulundur | Dark | (2498, 1085) | site_dulundur |  |  | 1 (4, old map) |  |
| TRO | Troll Forest | Dark | (2590, 1102) | area forest_troll |  |  | 0.25 (1, old map) |  |
| HOO | Hoorunoron | Dark | (2653, 1107) | drawn label |  |  | 0.5 (2, old map) |  |
| DAK | The Darks | Dark | (2662, 1089) | area forest_dark |  |  | 0.75 (3, old map) |  |
| SKR | Skragdurg | Dark | (2544, 1106) | drawn label |  |  | 1.5 (6, old map) |  |
| DUN | Dun | Dark | (2784, 1181) | drawn label |  |  | 1 (4, old map) |  |
| BRT | Britadon | Dark | (2607, 1278) | drawn label |  |  | 0.5 (2, old map) |  |
| WIL | Wild Lands | Dark | (2401, 1181) | drawn label |  |  | 0.5 (2, old map) |  |
| KHO | Khorvrath | Ember | (3040, 2285) | dossier text (moved 15 px) |  |  | 0.25 (1, extent) | PUV |
| DLN | Dolon | Ember | (3027, 2176) | site_demon_dolon |  |  | 0.25 (1, extent) | PUV |
| NEZ | Nezer | Ember | (3153, 2278) | site_nezer |  |  | 0.5 (2, extent) | PUV |
| NET | Nether | Ember | (3072, 2393) | site_nether |  | land land_nether_island | 0.5 (2, extent) |  |
| HAL | Halia | Ember | (3583, 2005) | dossier text (moved 30.5 px) |  |  | 0.75 (3, extent) |  |
| NAN | Nan | Ember | (3419, 2042) | site_nan |  |  | 0.5 (2, extent) |  |
| OLE | Olen | Ember | (3670, 2050) | drawn label |  |  | 0.75 (3, extent) |  |
| ALR | Alerhia | East | (3993, 2048) | site_alerhia |  |  | 6.5 (26, old map) |  |
| NAA | Naamis | East | (4413, 1264) | site_gondolin |  |  | 5 (20, old map) |  |
| DRA | Drak | East | (4862, 1922) | site_drak |  |  | 2.75 (11, old map) |  |
| RHA | Rhachia | East | (4654, 2316) | site_avalon |  |  | 0.75 (3, old map) |  |
| ERC | Erco | East | (4736, 2419) | old capital |  |  | 4 (16, old map) |  |
| PLO | Plutondo | East | (4840, 2230) | drawn label |  |  | 4 (16, old map) |  |
| OST | Ostoroth | East | (4835, 1438) | site_ostoroth |  |  | 8 (32, old map) |  |
| MOA | Mora | East | (4717, 1658) | site_mora (moved 3 px) |  |  | 3.5 (14, old map) |  |
| DLB | Delbiz | East | (4130, 1480) | drawn label |  |  | 6.75 (27, old map) |  |
| KRS | Kersian | East | (4171, 1995) | drawn label |  |  | 2.5 (10, old map) |  |
| MOS | Mostok | East | (4343, 1950) | drawn label |  |  | 3 (12, old map) |  |
| AZA | Azano | East | (4380, 2000) | drawn label |  |  | 2.75 (11, old map) |  |
| OBM | Obmi | East | (4271, 2050) | drawn label |  |  | 1.75 (7, old map) |  |
| PRN | Pornivior | East | (4157, 2150) | drawn label |  |  | 2.25 (9, old map) |  |
| WOQ | Woqood | East | (4280, 1100) | drawn label |  |  | 5.25 (21, old map) |  |
| ORA | Orato | East | (4206, 1070) | land land_island_004 | (4354, 901) |  | 1.5 (6, old map) |  |
| MIE | Miaed | South | (3993, 2465) | site_miaed |  |  | 2 (8, extent) |  |
| WAH | Wahatud | South | (3584, 2278) | feature site_sun_desert |  |  | 1 (4, extent) |  |
| ENH | Enhis Is Rond | Isl. South | (1305, 2053) | site_enhis_is_rond |  |  | 0.75 (3, old map) |  |
| HWN | Howan | Isl. South | (1658, 1868) | site_howan |  |  | 0.5 (2, old map) |  |
| VER | Verde | Isl. South | (757, 2060) | site_verde |  |  | 0.25 (1, old map) |  |
| NAR | Nara | Isl. South | (1800, 1824) | site_nara |  |  | 0.25 (1, old map) |  |
| YON | Yongyong | Isl. South | (1202, 2090) | land land_island_026 |  |  | 1.25 (5, old map) |  |
| KAM | Kamu Lamo | Isl. South | (1090, 2062) | land land_island_041 |  |  | 0.5 (2, old map) |  |
| KEA | Kea | Isl. South | (962, 2238) | land land_island_034 |  |  | 1.5 (6, old map) |  |
| SDE | Sidea | Isl. South | (874, 2282) | land land_island_027 |  |  | 1 (4, old map) |  |
| ADE | Adel | Triton | (301, 1412) | site_adel |  |  | 2 (8, old map) |  |
| RAE | Raerby | Triton | (491, 1564) | site_raerby |  |  | 0.75 (3, old map) |  |
| PLL | Pollos | Triton | (568, 1487) | site_pollos |  |  | 0.75 (3, old map) |  |
| NND | Nondondor | Triton | (601, 1649) | site_nondondor |  |  | 0.5 (2, old map) |  |
| FNG | Fineger | Triton | (366, 1206) | land land_island_022 |  |  | 1.25 (5, old map) |  |
| HLN | Halenor | Triton | (470, 1786) | old capital (moved 50.6 px) |  |  | 1.75 (7, old map) |  |
| WND | Windy Lands | Triton | (450, 1660) | drawn label |  |  | 1.25 (5, old map) |  |
| SEI | Seite Islands | Triton | (434, 1506) | land land_island_029 |  |  | 1.25 (5, old map) |  |
| SNT | Santon | Triton | (318, 1622) | land land_island_014 |  |  | 0.75 (3, old map) |  |
| BEN | Benan | Triton | (550, 1520) | feature range_benan |  |  | 0.75 (3, old map) |  |
| LEN | The Lens | Triton | (411, 1413) | old capital (moved 17.2 px) |  |  | 0.25 (1, old map) |  |
| LIG | The Lands of Light | Sun | (550, 2362) | area plain_sun_grasslands |  |  | 1.5 (6, extent) |  |
| ELV | Elvana | Sun | (651, 2244) | site_elvana |  |  | 0.5 (2, extent) |  |
| IGA | Igara | Sun | (713, 2379) | site_igara |  |  | 0.25 (1, extent) |  |
| YEN | Yeni Alang | Sun | (410, 2419) | site_heaven |  |  | 0.5 (2, extent) |  |
| TOR | Tor Luni | Sun | (682, 2419) | site_godland |  |  | 0.5 (2, extent) |  |
| IHU | Ihuy | Sun | (621, 1833) | feature volcano_great |  |  | 0.75 (3, extent) |  |
| SOY | Soyano | Sun | (794, 1762) | land land_island_023 |  |  | 0.75 (3, extent) |  |
| GOO | Goodin | Sun | (434, 2304) | dossier text |  |  | 0.5 (2, extent) |  |
| GOF | God Forest | Sun | (630, 2366) | area forest_god |  |  | 0.25 (1, extent) |  |
| HRR | Herrodon | Magical | (3412, 962) | site_herrodon |  |  | 0.75 (3, extent) |  |
| ANE | Andos Enda | Magical | (3742, 965) | site_andos_enda |  |  | 0.75 (3, extent) |  |
| NLR | Nolorim | Magical | (3353, 1812) | site_nolorim |  |  | 0.5 (2, extent) |  |
| LCC | Lccimio | Magical | (3750, 1351) | old capital |  |  | 0.75 (3, extent) |  |
| ELD | Eldafaen | Magical | (3869, 1629) | dossier text (moved 15.6 px) |  |  | 0.25 (1, extent) |  |
| YAV | Yavieth | Magical | (3358, 1676) | site_dragon_mountain |  |  | 0.25 (1, extent) |  |
| TES | Teste | Magical | (3679, 1055) | area plain_herrodon_vale (moved 24 px) |  |  | 0.25 (1, extent) | HRR |
| LUV | Luv-zhise | Magical | (3988, 1491) | feature strait_rift_narrows |  |  | 0.25 (1, extent) |  |
| MSH | Mushroom Forest | Magical | (3932, 1331) | site_mushroom_forest |  |  | 0.75 (3, extent) |  |
| TIR | Tirlan | Middle | (2885, 1529) | feature river_hilorn |  |  | 0.25 (1, extent) | HIR |
