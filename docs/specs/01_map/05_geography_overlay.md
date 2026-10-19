# Geography overlay note

**Status:** Draft. **Date:** 19 October 2026. **Priority:** 1. **Phase:** 1 (map rebuild).

## Purpose

This note says how the placements in [05_geography_model.md](05_geography_model.md) were checked, what is still uncertain, and what the rasteriser must do about the flaws in the owner's drawings. The drawings are private. They are never embedded or linked here; positions are given in words and numbers only.

## 1. Which frame the checks used

The plan was to measure every feature against the working drawing (3,200 by 2,323 pixels). That drawing is the owner's mosaic of the thirteen sheets before the layout was changed in October 2026. In it:

- the East Lands (the South-Earth sheet) lie in the south-west, not the east;
- the Dead Lands sit under the Magical Lands, not south of the Middle Lands;
- the central sea is a narrow gap;
- the sheets have different scales.

The model therefore uses the **game layout** (the cleaned 5,120 by 2,560 reference of 18 October) as its primary frame, and adds `drawing` coordinates for every feature on a registered sheet. This is a deliberate change from the first plan. The JSON `sheets` object holds the transforms.

## 2. What was looked at

All checks were by eye on crops of 1,500 pixels or smaller, with a coordinate grid, plus numeric tests.

| What | Crops and tests |
| --- | --- |
| Whole working drawing | One full view, then crops of every sheet with a 0.01 or 0.02 grid |
| Cold Lands sheets | Four crops: west half, east half, and the two top strips (x 0 to 0.20 and 0.18 to 0.40, y 0 to 0.06) |
| West-Earth and Triton's sheets | Two crops (x 0.19 to 0.41, y 0.24 to 0.52, and x 0 to 0.21, same y) |
| East-Earth (North Lands) | Two crops (x 0.52 to 0.70 and 0.66 to 0.84, y 0 to 0.28) |
| Rush Land | Four crops: north half, south half, the Kingson area (x 0.77 to 0.86, y 0.44 to 0.54 and y 0.52 to 0.67), the west rim (x 0.605 to 0.70) |
| Rush Islands | One crop |
| Magical Lands | Two crops (north: y 0.28 to 0.51; south: y 0.50 to 0.73) |
| Ocean of Edvoid | One crop |
| Dark Lands | One crop |
| Dead Lands | One crop |
| South-Earth (East Lands) | Five crops: north, middle, south, rift side, south-east |
| Islands of the South, Sunhot | One crop each |
| Vault map and cleaned reference | The vault reference map and the cleaned 5,120 by 2,560 reference, in full and as terrain-class crops of the whole world at 1,300 to 1,700 pixels |
| Name table | The 711-label table, plotted over the reference through each sheet transform (nine overlay crops) to verify the transforms |
| Model | Synthetic rasters of the finished JSON (world view and regional crops) and an on-land test of every feature |

The very large original mosaic was never opened whole. One full-size copy was cut into tiles in the scratch directory only.

## 3. How the sheets were registered

Each sheet was fitted to the game layout in two steps: a shape fit (the sheet's land silhouette against the layout silhouette), then a check with the name-table labels drawn over the layout. A transform maps a drawing point to a world point by a scale and an anchor (the East Lands are mirrored).

| Sheet | Fit | Notes |
| --- | --- | --- |
| Rush Land (Middle Lands) | good | Great Lake, Hiloron, Selen and the Organ coast all line up within 0.01 |
| Rush Islands | fair | The isle is a small separate sheet; positioned by its coast |
| East-Earth (North Lands) | good | The Evian lake lines up |
| Dark Lands | good | The Darkness ridge, the Dark Forests and Goldoroth line up |
| Triton's Islands | good | The Adel and Raerby arcs line up |
| Ocean of Edvoid | good for the big island (Šodolôrō), poor for the small black islands | The small islands were redrawn when the layout was made |
| Cold Lands | good | Tinton, the Naepu ridge and the Neridor mountains line up |
| West-Earth | good | Gunwaith, Girdon, Buldor and the peninsulas line up |
| Magical Lands | fair | The sheet is stretched about 1.6 times wider than it is tall in the layout; features are good to 0.02 |
| South-Earth (East Lands) | good | Mirrored; the Hot Lake, Woqood snow and Hellfire mass line up |
| Dead Lands | good for the main island, none for the Mirolon block | Mirolon was moved onto the Magical Lands' south end; it uses the Magical transform |
| Sunhot | fair | Only the south-west corner of the sheet's south coast is on the layout |
| Islands of the South | **not registered** | The layout scattered and rescaled the islands; names are assigned to islands by proposal |

Accuracy: about 0.015 units (80 pixels) for the good fits, 0.02 to 0.03 for the fair ones.

## 4. What I am not sure about

| Item | Doubt | What the model does |
| --- | --- | --- |
| Great Wall course | The vault gives only three anchors: the Organ Mountains, Lunhrim and Kingson. The drawing has an Organ Mountains band on the north-east coast of the Rush sheet and a Gigantic Mountains belt round Kingson | The Wall runs on the west foot of the Magic Mountains, from the Organ cape to the south coast; Lunhrim stands mid-wall; Kingson lies in a ring of mountains |
| Lunhrim | The drawn label reads Kunhrim | Treated as the owner's Lunhrim; reading uncertain |
| Meridor or Neridor | The name table reads Neridor; the crop reads Meridor | The model keeps the table spelling and notes the other |
| Gorlab or Cololab Sea | Reading uncertain | Gorlab Sea, with the table reading in the notes |
| Great River | A label "The Great River" is faint near Reshon | Kept as drawn, reading uncertain |
| Mirolon's place | The reference puts Mirolon on the south tip of the central landmass and the Dead Lands island 400 pixels away | Mirolon is a peninsula; Mirolon Sound separates it |
| The Nether | The drawing has a large red island named Nether south of the Dead Lands; the reference has no land there | The model adds an island |
| Sea of Darkness | A grey land named Sea of Darkness lies inside a sea | The sea is an inner sea; the grey land is a separate island |
| Magical Forest | The reference makes it much larger than the Middle Lands | Kept |
| Islands of the South names | The layout scattered the islands | Howan, Verde, Nara and Enhis Is Rond are assigned by proposal |
| East edge and bottom edge | The layout cuts the East and Sun sheets | Closed by edge cliffs |

## 5. Where the drawings and the vault disagree

The vault wins. Each difference is handled as follows.

| Drawing | Vault | Model |
| --- | --- | --- |
| Gunwaith is drawn white | Snow only near the Cold Lands neck | Plains and forest; snow only at the neck |
| The Rush interior is drawn khaki and was read as desert | Aenor is very fertile | Vale of Aenor, 85 percent plains |
| A "Wall of Rush" is drawn on the north-west coast | The Great Wall is in the east, between the Middle Lands and the Magical Lands | The north-west rim is only a coastal ridge (Hiloff Rim) |
| No storm belt is drawn | Fierce storms at sea around the Dead Lands | The Tempest Reach is added |
| The Rush Ocean | Rush is superseded | Crown Ocean, proposed |
| Edvoid names | Zol names | Ocean of Zol, Zol's Mistake |
| The Sunhot place labels | Owner renamed on 19 October | Sun Desert, Sun Gate, Sun Grasslands |
| South Earth sheet title | The East Lands | East Lands (the sheet is mirrored in the layout) |

## 6. What the rasteriser must do about the drawings

The rasteriser should use the model, not the drawings. If it reads the cleaned reference for coast shapes it must treat the following as noise.

### Handwriting and labels

- Every label is ink on the land and on the sea. Do not read terrain from pixels under a label. The name table lists 711 positions; mask a disc of 0.006 units round each.
- Some labels run across seams or the edge of a sheet and are cut. Thirty-two label positions lie outside the mosaic. Never clamp them in.
- Route notes (for example the Path to Aoaz) are not places.
- Pencil sketch lines (the faint grey outlines of the Cold Lands regions) are not coasts.

### Sheet joins and frames

Positions are in the drawing frame (0 to 1 of 3,200 by 2,323) and good to about 0.005.

| Artefact | Where |
| --- | --- |
| Horizontal grey join across the Cold Lands | v about 0.048 to 0.052, u 0 to 0.395 |
| Second horizontal join under the Cold Lands | v about 0.245, u 0 to 0.395 |
| Vertical join in the Cold Lands | u about 0.193, v 0 to 0.245 |
| Vertical white join in the West-Earth sheet | u about 0.292 to 0.296, v 0.245 to 0.52 |
| White frame of the West-Earth sheet | top v about 0.250, left u about 0.200 |
| Pasted purple-blue label squares | Triton's Ocean on the West-Earth sheet (u 0.205 to 0.252, v 0.270 to 0.290) and on the Cold Lands sheet (u 0.103 to 0.146, v 0.210 to 0.235); The Blue Sea (u 0.363 to 0.390, v 0.349 to 0.378) |
| Vertical black and grey line in the Rush sheet | u about 0.645, v 0.30 to 0.66 |
| Horizontal black line in the Rush sheet | v about 0.46, u 0.65 to 0.84 |
| White left edge of the Rush sheet | u about 0.607 |
| Magical Lands sheet frame | left u about 0.848 to 0.853; top v about 0.29; right u about 0.992; a black bar near u 0.84 to 0.85, v 0.659 |
| Dark Lands sheet frame | top v about 0.667, right u about 0.714, bottom v about 0.862 |
| Dead Lands sheet frame | left u about 0.801, top v about 0.727 |
| Edvoid sheet frame | top v about 0.018, left u about 0.803 |
| South-Earth joins | horizontal v about 0.60 and 0.80, vertical u about 0.215 |
| Sunhot sheet joins | vertical u about 0.376, horizontal v about 0.797 |

### Other flaws

- **Sea shading.** Streaks of blue and violet crayon change colour at the joins. Any sea is one colour; do not trace the shades.
- **White margins** of sheets and the grey rulings on the Cold Lands sheet read as land or snow in a colour test. They are not.
- **Overlap.** The lower Cold Lands sheet and the West-Earth sheet overlap in the layout between y 0.24 and 0.41. The model's region outlines already resolve this: the Yeti Lands shelf and the Worlond Forest belong to the Cold Lands, and the West Lands begin south of y 0.375.
- **Colour reads.** The terrain classes of the reference (snow, plains, forest, mountain, hills, desert, black waste, lake, jungle, marsh) are the generator's guess from crayon colour. Khaki read as desert, aqua forests as plains and grey ridges as nothing. Do not copy a class from the reference where the model has a feature; the model's feature always wins.
- **Lost lakes.** The drawn Evian, R'en, Ergo and Ilurdor "seas" are inland waters. The reference shows them as thin or sea-coloured; the model names them as lakes.
- **Missing land.** The model adds one island (the Nether) that the reference lacks. Every other land of the model is the reference silhouette.

## 7. Checks run on the model

- Every feature has `id`, `name`, `established`, `kind`, `elevation` and `geometry`; ids are unique.
- Every point, line vertex and polygon of land features is on land of the layout (within 3 pixels), after the final adjustment. Automatic snaps moved about 60 features by less than 0.03 units.
- The Great Lake and the Hot Lake lie wholly inland.
- A synthetic raster of the JSON (ocean, plains, deserts, marshes, forests, hills, mountains with foothills, lakes, rivers, volcanoes) shows the Great Wall as a continuous barrier, Kingson ringed, the Vale of Aenor green, and the East Lands carrying the Hellfire Range with its volcanoes.
- No feature is named Dardan.

## 8. Open questions

The model's open questions are in section 13 of the geography model. Two matter most for the rasteriser: the owner's choice of frame (section 1 here) and the size of the Dead Lands.
