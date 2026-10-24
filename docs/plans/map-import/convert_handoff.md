# Drawn-map import: the converter, the sheets and decision K46 (handoff)

Lead's half of ADR 0067 section 7 of the HOI4 Agent Tools repository (request ZR-2), and owner decision K46 (bays, gulfs, straits and strait crossings). Date: 24 October 2026. Branch `zin/integration-r3`.

**Status.** The converted geography model and the reference-sheets document are valid against the tool's published schemas and pass the tool's own geography resolver with the import's options. The import itself has **not** been run: it ships with release 4.4.0, which is pending. Nothing here claims the import works.

## 1. What was built

All scripts are deterministic, read the private drawing into memory only, and write numbers, transforms or polygons of the model's own land and sea, never an image.

| File | Role |
| --- | --- |
| `tools/content/geography/convert_for_import.mjs` | The converter: repaired model, coast features, roster, surface overrides and palette in; geography model v1, reference-sheets v1, annotations, names, held-back content, report and the prepared calls out. Needs no private file. |
| `tools/content/geography/coast_features.mjs` | Decision K46: bays and gulfs (closing of the drawing's import surface, kept to the model's own sea), a crossing for every model strait, and new straits for narrow gaps. Writes `tools/content/data/geography/coast_features.json`. Reads the working drawing when present. |
| `tools/content/geography/vanilla_crossings.mjs` | Measures the vanilla game's sea crossings (read only) to calibrate the narrow-gap threshold. |
| `tools/content/geography/import_measures.mjs` | Warps the full drawing exactly as the import's sheet registration does and measures land agreement, the edge bands and the palette. Writes `import/aoaz.palette.json` and `import/drawing_measures.json`. |
| `tools/content/geography/validate_import.mjs` | Validates the outputs with the tool's own Ajv and schemas (read with `git show origin/main:schemas/...`) and runs the tool's `resolveGeography` through tsx, read only. |
| `tools/content/geography/convert_for_import.test.mjs`, `coast_features.test.mjs` | `node:test` suites (17 and 9 tests). |
| `tools/content/data/geography/import/` | `aoaz.geography.json`, `aoaz.sheets.json`, `aoaz.annotations.json`, `aoaz.names.json`, `aoaz.held_back.json`, `aoaz.palette.json`, `drawing_measures.json`, `conversion_report.json`, `preview_call.json`, `preview_call_palette.json`. |

Changes to existing files, all inside `tools/content/geography/` and `tools/content/data/geography/`:

- `name_table.mjs`: the reconciled roster names every capital site after its capital city (`rosterCapitalEntries`), ahead of a curated entry that named the site after its realm; renamed islands keep their drawn label as `drawnLabel`; `--roster` option. `name_table.json` regenerated (206 entries, 161 before).
- `repair_model.mjs`: (1) a feature an earlier table renamed is renamed again from its former label; (2) every sheet's `clip` keeps only the cells within `CLIP_COAST_MARGIN_PX` (48) of the model's land, so pencil frame lines, a neighbouring sheet's paper and lettering in open water are never read. `aoaz.repaired.json` regenerated: only site names (54), one forest name and the twelve clips changed.
- `sheet_registration.mjs`: `SCAN_SHEETS` maps the owner's own scan titles of `docs/name_table.md` ("Ember Lands", "Kusmeel") again. The canon text migration of `2b5f1de` had renamed the keys but not the label table, so the Ember Lands and Kusmeel labels were silently ignored by the rename table and the registration checks. With the aliases the registration and the name table are again fixed points.
- `check_model.mjs`: `NETHER_SITE` accepts the seat `site_nether` by id (it is now named Zarath-Nazur after its roster capital).
- `geography_steps.test.mjs`: four new tests (roster capitals, re-rename, scan aliases, the clip coast margin).

### Pipeline order

From the repository root:

```
node tools/content/geography/name_table.mjs
node tools/content/geography/repair_model.mjs <scratch>/repaired.json --in tools/content/data/geography/aoaz.repaired.json --overrides <scratch>/overrides.json
  (copy <scratch>/repaired.json over tools/content/data/geography/aoaz.repaired.json; the overrides came out byte-identical)
node tools/content/geography/coast_features.mjs
node tools/content/geography/convert_for_import.mjs
node tools/content/geography/import_measures.mjs
node tools/content/geography/convert_for_import.mjs
node tools/content/geography/validate_import.mjs
```

The repair is run on the repaired model because `aoaz.json` no longer reproduces it (section 9). The registration, the name table, the layout overrides, the repair and the overrides were each checked to be fixed points of this state.

## 2. Conversion (geography model version 1)

Counts: 58 seas (44 model seas and 14 bays and gulfs), 89 lands, 16 regions, 63 ranges, 21 passes, 16 volcanoes, 30 rivers, 12 lakes, 33 straits, 86 sites, 5 roads, 30 places.

- Seas: kind `sea` (the model's nine "ocean" seas and the storm belt are seas; no Ocean anywhere, K29) or `gulf` (the K46 bays and gulfs, carved out of the seas they lie in). No depth and no ice.
- Lands: kind continent or island, `region` when the land lies in one region. No biome or fertility.
- Regions: the 16 regions with polygons and density; no terrain shares. The four zones (Wall Marches, Kingson Vale, Narrow Strait, Rift Sea) overlap the regions and are held back.
- Ranges: path, half-width, peak from the peak class, `closed` for rings. The Great Wall of Aenor is a natural range (K2): profile `massif` with `barrier: "impassable"`, crossed only at its passes. Passes name the range they cross when one lies within 102 px.
- Rivers: source, mouth, via, size 1, 3 or 5 from the width class. Seventeen mouths drawn on the shore were moved into the water (0 to 16 px); rivers ending in a lake name the lake. The two endorheic rivers (River Mora and Noris Wadi, into the Noris desert basin) are held back: the schema needs a mouth in water.
- Sites: kind and importance from the converter's table; the 63 roster capitals are kind `capital` with their tag and importance 5 (major) or 4.
- Places: the 30 coast points.
- Held back in `aoaz.held_back.json` until the tool's climate and biome stage lands (they block with `MAP_GEOGRAPHY_SYNTHESIS_UNAVAILABLE`): 88 terrain areas (forests, deserts, marshes, snowfields, plains, hills, the future `biomes`), the regions' terrain shares, the four zones, the edge records, two crossings within one land and the two endorheic rivers.

### Validation

`node tools/content/geography/validate_import.mjs`, tool repository `C:/Users/klimp/Documents/Projects/hoi4-agent-tools`, schemas read from `origin/main` (`7e154a1`, PR 40 merged; the main checkout is still on `3733d4a`, which lacks the reference-sheets schema):

| Check | Result |
| --- | --- |
| `schemas/geography-model.schema.json` (Ajv 2020, the tool's own) | valid |
| `schemas/reference-sheets.schema.json` | valid |
| `schemas/map-operation.schema.json` for the `create_world` of both prepared calls | valid |
| `resolveGeography` (frame 5,120 x 2,560, reference given, `edge.mode: "sea-band"`) | valid: 0 errors, 7 warnings |

The seven warnings: `MAP_GEOGRAPHY_PATH_SELF_INTERSECTION` for `range_adel` and `range_corogon_hills` (model spines that cross themselves), and `MAP_GEOGRAPHY_RIVER_VIA_NOT_LAND` for five via points of `river_leren` (its course crosses water). No `MAP_GEOGRAPHY_FEATURE_IN_EDGE_BAND`.

## 3. The reference-sheets document

Twelve sheets, each with `box` (the clip box, pencil frame cut off), `clip` (one ring of at most 291 vertices; parts and holes are joined by zero-width bridges, which the import's even-odd test reads exactly), `anchor`, `target`, `scale` (the mirrored `east` sheet has x scale -0.9726), the affine form for `sun`, and explicit distinct `order` values 1 to 12 (smaller sheets higher, so no sheet is hidden). `source` names the full drawing: 17,520 x 12,720, SHA-256 `37ef5939...c2ecf`; `fill: "sea"`.

**Palette.** The schema has no per-sheet palette (ADR 0067 section 9: one `reference.palette` for every sheet). `aoaz.palette.json` holds 50 measured colours: per sheet the median colour of its drawn water and of its drawn land per terrain class. Measured on the warped drawing, nearest-colour matching against it agrees with the model **worse** than the import's own illustrated reading (land IoU 0.8942 against 0.9105 with the annotations, 0.6898 against 0.7005 without). The main call therefore carries no palette; `preview_call_palette.json` is the same call with it, for the comparison in the real preview.

**Annotations.** Until the override file (`world-overrides`, step 3) is released, the surface overrides of the repair (open-sea bands, undrawn land, moved lands, the Nether and the approved-layout patches) go into `reference.annotations`: 70 polygons, 2,782 points, sea first, then land. Painted back on the 4-pixel grid they reproduce the overrides except 11 cells (two 64-pixel areas could not be traced into a valid polygon).

## 4. Registration (Aenor Isle, the Ember Lands, the West Lands)

Two measures. The zone IoU is the registration's own (`sheet_registration.json`: land IoU of model and warped working drawing over the sheet's zone). The import IoU is measured by `import_measures.mjs` on the full drawing warped exactly as the import's sheet code does, read with the import's built-in illustrated classifier, against the model's land, per region; "before" uses the hand-fitted transforms of `registration.before` without clips.

| Region | Zone IoU recorded | Zone IoU registered | Import IoU before | Import IoU now, raw | Import IoU now, with annotations |
| --- | --- | --- | --- | --- | --- |
| Aenor Isle (`risle`) | 0.522 | 0.926 | 0.472 | 0.903 | 0.903 |
| Ember Lands (`dead`) | 0.644 | 0.659 | 0.411 | 0.481 | 0.858 |
| West Lands (`west`) | 0.497 | 0.896 | 0.481 | 0.869 | 0.869 |
| Whole frame | | | 0.589 | 0.7005 | 0.9105 |

The earlier figures of the status file (0.24, 0.36, 0.50) are the repair's region agreement of `aoaz.json` against the hand-fitted transforms; the registration of `1a587c3` already refined Aenor Isle and the West Lands. In this round:

- I re-ran the registration route for the three sheets; it reproduces the recorded refinement exactly. For the Ember Lands sheet a widened search (translation ±0.10, log scale ±0.30, rotation ±0.10 rad) finds no transform better than the recorded 0.659: the remaining disagreement is not a placement error but the Nether (model land generated south of the sheet), a thin coastal rim and layout reshaping, which the overrides restore (0.858 with the annotations).
- The clip coast margin raised the import agreement of all three: whole frame 0.666 to 0.7005 raw and 0.9029 to 0.9105 with the annotations; Aenor Isle 0.858 to 0.903, the Ember Lands 0.447 to 0.481 (0.821 to 0.858 with the annotations), the West Lands 0.861 to 0.869.
- Without the annotations the import would block (`MAP_IMPORT_SOURCES_DISAGREE`, 0.70 under the default 0.85): Zol's Mistake (0.05), the Lands of the Sun (0.22), the Nether (0.24) and the Islands of the South (0.00) are land the drawing does not draw. With them the measured 0.9105 is above the 0.85 block and below the 0.95 warning. These are my offline measures, not the tool's.

## 5. Names

The rename table now has 206 entries (161 before). New: every roster capital site takes its capital city's name (46 sites newly renamed, and 8 sites whose curated name was their realm's name: Asgard to Borrak rather than Orohaf, Isengard to Minnolomak, Gondolin to Duum-Saah, Avalon to Pordoce, Heaven to Sudoni, Godland to Wefolen, Hiloron to Torunalos, Gunwaith to Bulligon), and Hiloron Woods becomes Hirolon Woods (K13). No name contains "Ocean" or "waith" (checked by the tests). `aoaz.names.json` lists 242 names with their world point: the 208 renamed features (the 206 table entries and the Kusmeel and its Black Islands, which the migration had already renamed) with `formerLabel` (131 drawn or design labels; 77 islands had only a generated placeholder, recorded as `placeholder`), plus the 34 names of the K46 bays, gulfs and straits (no former label). Where the canon text migration had overwritten a former label with the new name (Kusmeel, the Ember Lands, the Dead Lands Island), the design model's label is used again: Ocean of Zol, Dead Lands, Dead Lands Island.

**Names not resolved from canon (owner question candidates):**

1. `site_yeldenne_landing`: the roster's capital of Yeldenne is "Simoto", a working name; the roster itself says the drawn town reads "Hul..." under a seam and its name is the owner's to give.
2. The Ormolak Mountains and the Ormolak Pass: the Cold Lands dossier keeps "Ormolak", which echoes Isengard (K14 replaces names from other fiction); Melkgard replaced Isengard for the realm only.
3. "Kingson Wall" (`range_magic_wall`, the east side of the Kingson ring): K2 says there is no wall and the dossiers renamed the "Wall-Folk"; the range name stayed.
4. Real-world words the vault or dossiers keep: Nara (a Japanese city), Verde, the Light Forests of Yang, the Woqood Spires (proposed name), Mount Argul, and "Hellfire" in the Smoking Teeth and the Gulf of the Teeth (the Nether dossier retired "The Hell" as a real-world word).
5. Every K46 name is a proposal: the 10 new bay and gulf names (after a shore town: Bay of Varlibo, Bay of Bulligon, Bay of Borrak, Bay of Arligon, Bay of Sonargur, Bay of Enliras, Gulf of Googavis; after the region where no town is near: Bay of the West Lands, Bay of the Cold Lands, Gulf of the West Lands) and the 20 narrow-gap straits ("The <island> Sound").
6. The model's coast points Novez Bay, Bay of Safeton (open water), Delbiz Bay and Gulf of the Teeth (on land) have no enclosed water within 120 px; they stay named places, not bays. Their placement or the bay they name needs the owner's eye.
7. Pollos Passage: its `joins` (Pollos, Benan) are one island in the model; its crossing follows its course between Adel and Kitodolwai.

## 6. Edge bands

The import's sea band is max(192, 4% of 5,120) = 205 px east and west and 64 px north and south; land there is an error in the model and cleared from the drawing, raggedly up to 1.5 times as deep (308 and 96 px).

- The converted model has **no land in the bands** (`conversion_report.json` `edgeBandLand` is empty; the resolver with `sea-band` reports no edge diagnostic).
- What the bands removed from the design model (`edgeRemoval`, area inside the bands of each design land): Eastern Mainland 328,000 px (1,884,864 to 1,460,592 px after the repair's natural coasts), Western Mainland 119,936 px (to 1,283,200), Northern Wastes 88,128 px (to 436,416), Vindael 37,920 px (80,976 to 36,944 px: 54% of the arm, the accepted 55% loss), the Lands of the Sun 34,304 px (moved inward as one piece with its islands, not cut), and eleven small islands (Kitodolwai, Nailia, Benan, Sterrotumai, Austoklevo, Lochvait, Vestfaaenn, Sang Tilu, Adel, Sudowaitos, Kim; most moved inward whole). In all 618,560 px of design land lay in the bands.
- The drawing still draws 6,247 px of land in the strict bands (cold sheet 1,132, east sheet 5,115); the import clears it (`MAP_EDGE_LAND_CLEARED`, a warning). Its ragged clearing reaches up to 165,548 px of drawn land and 146,528 px of the model's land between the strict band and 1.5 times its depth, because the repair's natural edge coasts (0.042 to 0.060 of the width) lie inside that zone; how much is cleared depends on the tool's noise and will be in the preview's report.

## 7. Decision K46: bays, gulfs, straits and crossings

### Narrow-gap threshold

`vanilla_crossings.mjs` measured the 151 `sea` rows of vanilla `map/adjacencies.csv` shore to shore on `provinces.bmp` (5,632 x 2,048; 148 without the canals): median 4 px, 90th percentile 13.6, 95th 16.6, widest 29.8 (Truk to the Hall Islands). Øresund (Skåne to Sjælland) 2.2 px, Messina (Calabria to Sicily) 3.0, the Bosporus 2.8, Kerch 3.0, Tsugaru 4.0, Jeju to Korea 14.3. Vanilla has no Dover crossing. `COAST.narrowGapPx` is 32, just above the widest vanilla crossing and a multiple of the 4-pixel grid. Gaps of 32 to 64 px are listed, not crossed.

### Model straits: every one is a crossing

| Strait | Shores | Width | Crossing midpoint (x, y) |
| --- | --- | --- | --- |
| The Narrow Strait | Central Mainland / Isle of the North Lands | 48 px | 0.599, 0.427 |
| Leren Mouth | Central Mainland / Isle of the North Lands | 121 | 0.575, 0.434 |
| Northern Dark Strait | Isle of the North Lands / Dondor Arm | 70 | 0.555, 0.406 |
| Southern Dark Strait | Central Mainland / Dondor Arm | 91 | 0.536, 0.507 |
| Mirolon Sound | Central Mainland / The Ember Isle | 335 | 0.595, 0.744 (284 px from its course: islands lie between) |
| The Rift Narrows | Eastern Mainland / Central Mainland | 66 | 0.785, 0.589 |
| North Mouth of the Rift | Central Mainland / Amkerezia | 154 | 0.799, 0.456 |
| Corogon Narrows | Western Mainland / Varnondor | 29 | 0.263, 0.598 |
| The Inner Sea | Central Mainland / Aenor Isle | 23 | 0.536, 0.563 |
| Pollos Passage | Adel / Kitodolwai | 90 | 0.072, 0.621 |
| Dark Channel | Dondor Arm / Goldoroth Arm | 20 | 0.480, 0.415 |
| Nether Sound | The Ember Isle / The Nether | 11 | 0.600, 0.912 |
| Ember Narrows | Eastern Mainland / The Nether | 9 | 0.630, 0.948 |
| Coldor Channel | Western Mainland, two coasts | 34 | 0.137, 0.287 (held back) |
| Mirolon Neck | Central Mainland, two coasts | 9 | 0.652, 0.732 (held back) |

The model's own notes call ten of them "sea only"; K46 supersedes that, and every converted strait has `rule: "open"`. The shores of each strait are curated in `STRAIT_SHORES` (its `joins` text predates the repair's coasts). The two straits whose shores are one land are held back: the schema refuses a strait from a land to itself (`MAP_GEOGRAPHY_STRAIT_SAME_LAND`).

### New straits for narrow gaps (20, all proposed names)

| Strait | Shores | Width | Midpoint |
| --- | --- | --- | --- |
| The Deelor Sound | Isle of the North Lands / Deelor | 27 | 0.551, 0.353 |
| The Deelor Sound North | Dondor Arm / Deelor | 20 | 0.532, 0.388 |
| The Dolgdoal Sound | Dondor Arm / Dolgdoal | 23 | 0.506, 0.459 |
| The Dolgdoal Sound North | Goldoroth Arm / Dolgdoal | 17 | 0.491, 0.470 |
| The Sudowaitos Sound | Lighodolwai / Sudowaitos | 12 | 0.064, 0.480 |
| The Goldoroth Arm Sound | Dondor Arm / Goldoroth Arm | 20 | 0.513, 0.503 |
| The Dumgil Sound | Goldoroth Arm / Dumgil | 24 | 0.502, 0.516 |
| The Austoklevo Sound | Adel / Austoklevo | 17 | 0.079, 0.572 |
| The Margolohu Sound | Raerby / Margolohu | 24 | 0.094, 0.580 |
| The Sterrotumai Sound | Adel / Sterrotumai | 14 | 0.083, 0.591 |
| The Benan Sound | Raerby / Benan | 20 | 0.104, 0.596 |
| The Sterrotumai Sound North | Raerby / Sterrotumai | 18 | 0.088, 0.601 |
| The Kim Sound | Kitodolwai / Kim | 16 | 0.068, 0.660 |
| The Kim Sound North | Sang Tilu / Kim | 16 | 0.069, 0.668 |
| The Sang Tilu Sound | Kitodolwai / Sang Tilu | 20 | 0.067, 0.671 |
| The Uelo Yavi Sound | Saloyia / Uelo Yavi | 9 | 0.131, 0.723 |
| The Uelo Yavi Sound North | Yen Ila / Uelo Yavi | 9 | 0.139, 0.730 |
| The Mialia Sound | Central Mainland / Mialia | 22 | 0.676, 0.755 |
| The Dolgarunon Sound | Central Mainland / Dolgarunon | 26 | 0.665, 0.772 |
| The Fornia Sound | Fornia / The Nether | 13 | 0.588, 0.925 |

The 41 gaps of 33 to 64 px without a crossing are in `coast_features.json` `nearMisses` (for example Eastern Mainland to Amkerezia 36 px, Dolgarunon to Mialia 36, the Ember Isle to Fornia 40, Central Mainland to Eissol 39); raising `narrowGapPx` to 64 would add them.

### Bays and gulfs (14)

A closing of the drawing's import surface with discs of 48, 96 and 144 px finds water behind a mouth; the bay is the model's own sea inside it, bounded by one land mass for at least 70% of its shore. Thresholds (`COAST.scales`): bays 3,000 to 40,000 px and 40 px deep; gulfs 20,000 (25,000) to 200,000 px and 96 px deep; never in the sea bands.

| Name | Kind | Status | Area | Mouth | Point |
| --- | --- | --- | --- | --- | --- |
| Isemkei Bay | bay | established (model coast point) | 9,696 | 247 | 0.688, 0.329 |
| Bay of Kradlon | bay | proposed (model coast point) | 4,224 | 300 | 0.173, 0.584 |
| Gulf of Darkness | gulf | proposed (model coast point) | 24,112 | 341 | 0.506, 0.468 |
| Gulf of Minnolomak | gulf | proposed (model coast point) | 77,808 | 710 | 0.318, 0.074 |
| Bay of Varlibo | bay | proposed | 3,488 | 88 | 0.233, 0.527 |
| Bay of Bulligon | bay | proposed | 4,576 | 45 | 0.155, 0.424 |
| Bay of Borrak | bay | proposed | 5,824 | 199 | 0.533, 0.554 |
| Bay of Arligon | bay | proposed | 7,520 | 148 | 0.237, 0.470 |
| Bay of the West Lands | bay | proposed | 9,200 | 289 | 0.264, 0.562 |
| Bay of the Cold Lands | bay | proposed | 11,760 | 126 | 0.125, 0.282 |
| Bay of Sonargur | bay | proposed | 15,584 | 251 | 0.543, 0.352 |
| Bay of Enliras | bay | proposed | 29,472 | 272 | 0.730, 0.387 |
| Gulf of the West Lands | gulf | proposed | 55,312 | 621 | 0.264, 0.490 |
| Gulf of Googavis | gulf | proposed | 96,816 | 664 | 0.123, 0.849 |

**Schema gap.** Geography schema v1 has sea `kind` `ocean`, `sea`, `gulf` and `fjord`, but no `bay`; `places` have `bay` and `gulf` but only as points. Bays are therefore seas of kind `gulf` tagged `bay` (and `coast-feature`). A worker request could add `bay` to the sea kinds.

### Worker request draft: crossings from model straits (for the lead to file)

- ZIN task: K46, R-10 (A-10): every strait of the map must be a land-to-land sea crossing so armies can cross.
- Tool or workflow: `hoi4_map_rewrite` `create_world` with `geography`/`geographyPath`; `map/adjacencies.csv`.
- Inputs: `tools/content/data/geography/import/aoaz.geography.json` (33 straits, each `between` two land points on different lands, `rule: "open"`).
- Current behaviour (read on `origin/main` `7e154a1`): straits are resolved and validated (`src/hoi4_agent_tools/map/geography/resolve.ts`, "Straits", from line 1424: `MAP_GEOGRAPHY_STRAIT_*`) and drawn by the preview (`geography/preview.ts` line 384), but no step turns them into adjacencies: `world.ts` (about line 1489) writes `map/adjacencies.csv` with only the rim rows of `edge.mode: "rim"` and the terminator, and `adjacency_rules.txt` says "No straits or canals in this world yet". `ResolvedStrait` has no consumer in the partition or the outputs (`git grep "\.straits\b"` finds only `model.ts` and `preview.ts`). `partition-provinces.ts` splits narrow straits into two sea provinces (`narrowStraitPx`, default 24) but writes no crossing.
- Wanted: for every resolved strait, after partition, one `sea` row `From;To;sea;Through;start_x;start_y;stop_x;stop_y;;<name>` with From and To the land provinces at the two `between` ends and Through the sea province the straight crossing passes through (the widest share of it), start and stop at the two shore points, `-1` where the engine accepts it; `rule: "army-closed"` and `"navy-closed"` mapped to an adjacency rule or the impassable type; a diagnostic naming the strait when its ends fall in one province, on water, or the crossing passes through more than one sea province; the rows kept stable across re-imports with stable ids. Also: (a) a strait between two coasts of one land (`between` two points on the same land) is today the error `MAP_GEOGRAPHY_STRAIT_SAME_LAND`; ZIN needs it as a crossing (Coldor Channel, Mirolon Neck); (b) `bay` as a sea kind.
- Evidence: the reads above; vanilla precedent `map/adjacencies.csv` (151 `sea` rows, e.g. `9990;4159;sea;5681;-1;-1;-1;-1;;Calabria-Sicily`).
- Workaround until then: after a write, `add_adjacency` operations (`from`, `to`, `type: "sea"`, `through`, start and stop) per strait, with the province ids read at the `between` points by `hoi4_map_inspect`.

## 8. The prepared preview call (not run)

`tools/content/data/geography/import/preview_call.json` (and `preview_call_palette.json`). Shape, with the 70 annotation polygons inlined from `aoaz.annotations.json`:

```json
{
  "workspaceId": "zin",
  "preview": true,
  "operations": [{
    "id": "world",
    "kind": "create_world",
    "width": 5120,
    "height": 2560,
    "edge": { "mode": "sea-band" },
    "reference": {
      "imagePath": "docs/reference/originals/Erdae.png",
      "sheetsPath": "tools/content/data/geography/import/aoaz.sheets.json",
      "mode": "illustrated",
      "agreement": { "minLandIou": 0.85, "warnLandIou": 0.95 },
      "annotations": ["... 70 polygons from aoaz.annotations.json ..."]
    },
    "geographyPath": "tools/content/data/geography/import/aoaz.geography.json"
  }]
}
```

Run it with release 4.4.0 installed, as `hoi4_map_rewrite` with the arguments of `preview_call.json`; then the same with `preview_call_palette.json`, and compare `data.import.landIou` and `map-import-report.json` with `drawing_measures.json` (my offline estimate 0.9105 and 0.8942). Keep `map-import-registration.png`, `map-import-alignment.png` and `map-import-classes.png` private: they are derived from the drawing. The ZIN workspace short id `zin` resolves to `mod_zin_86bac5c64231` (ZR-1).

## 9. Known issues and limits

- `aoaz.json` is stale against the migrated repair code: it still has `ember_lands` identifiers and the names "Kusmeel" and "Black Islands of the Kusmeel", so `repair_model.mjs` run from it reports `NETHER_EMBER_LANDS_MISSING` and seven unresolved renames, and the full-model test (`ZIN_GEO_FULL=1 node --test tools/content/geography/repair_model.test.mjs`) fails at `HEAD` already. The canon migration (`tools/migrations/canon_renames.mjs`, the lead's item) should rewrite `aoaz.json`; until then rebuild from the repaired model as in section 1.
- `docs/specs/01_map/05_geography_model.md` section 11.1 does not yet describe the coast-margin clips, the roster capitals, K46 or the converter; it is outside my paths.
- The tool's geography preview does not plan a map, so it will not show adjacencies, and it will not test the straits as crossings.
- `import_measures.mjs` mirrors the import's warp and classifier for measurement only; the tool's text masking, water cleaning and component cleaning are not simulated, so its numbers are estimates.
- Diagnostic overlays of the drawing were made only in the session's temp folder and are not in the repository.

## 10. Tests to register in `tools/package.json`

```
content/geography/repair_model.test.mjs content/geography/geography_steps.test.mjs content/geography/convert_for_import.test.mjs content/geography/coast_features.test.mjs
```

All 66 tests of the four files pass (65 pass, 1 skipped: the full-model test, section 9). The converter suite compares a fresh conversion with the tracked outputs byte for byte, and validates them against the tool's schemas when the tool repository is present.
