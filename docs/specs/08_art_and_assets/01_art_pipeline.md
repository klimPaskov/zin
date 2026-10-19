# Art pipeline

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 5. **Phase:** all (each phase generates the art its content needs; phase 7 finishes it).

## Purpose

ZIN needs about 3,000 shipped pictures and 34 more 3D models ([03_full_asset_inventory.md](03_full_asset_inventory.md)). Every one is new. This spec fixes how they are made, recorded, cut, converted and checked: the image generation route and its prompt rules, provenance, sheet generation and slicing, the HOI4 sizes and formats, the 3D route through Meshy, and review. The inventory spec says *what* is made; this spec says *how*.

## Current state (19 October 2026, commit ca01fa3)

The pipeline runs today. These parts exist:

| Part | Path | What it does |
| --- | --- | --- |
| Generator | `tools/content/imagegen.mjs` | Runs a jobs file through the owner's gptimage library (`GPTIMAGE_LIB`, default `C:/Users/klimp/tools/gptimage/src`: `auth.js`, `codex.js`, `images.js`) with the model `gpt-6-astra` (`GPTIMAGE_MODEL`). Skips finished jobs, rejects sheets that fail their layout check (up to three attempts; failures move to `raw/rejected/`), backs off on rate limits, and appends one provenance line per generation |
| Job writers | `tools/content/art/asset-jobs.mjs`, `flag-jobs.mjs`, `unit-ref-jobs.mjs`, `stage-unit-jobs.mjs` | Write jobs files into `$ZIN_ART/jobs/` (`ZIN_ART` defaults to `$HOI4_AGENT_TOOLS/.tmp/zin-art`) |
| Slicers and converters | `tools/content/lib/sheets.mjs` (`findRegionsAdaptive`, `findGridRegions`, `cropRegion`), `tools/content/lib/raster.mjs` (`dds()`, `tga()`), `tools/content/art/slice-flags.mjs` | Find items, crop, resize, write DDS A8R8G8B8 and TGA |
| Builder modules | `tools/content/modules/art.mjs` (people emblems, generic portraits, Realm frame, button, rule), `modules/presentation.mjs` (loading screens, menu backgrounds, loading chrome, thumbnail frame, emblem, bookmark picture, loading tips, catalog focus and idea icons, catalog event and news pictures), `modules/units3d.mjs` (3D units) | Stage game files from accepted sources only |
| Provenance | `art/source/provenance.jsonl` (309 lines) | Generation lines and review lines (section 2) |
| Accepted sources | `art/source/<kind>/` (`emblems`, `events`, `flags`, `icons`, `loadingscreens`, `menu`, `portraits`, `ui`) | Raw PNGs the build used; the fallback when `$ZIN_ART/raw/` is absent, so a fresh clone builds the same bytes |
| Manifest | `art/source/presentation_manifest.json` (today); one `art/source/<module>_manifest.json` per art module (A8) | One line per shipped file: output, source, source hash, operations, output hash; plus the decisions applied |
| Tests | `tools/content/build.test.mjs`, `tools/content/presentation.test.mjs` | Sizes and formats, folder purity, thumbnails, chrome case, sprite coverage, provenance gating, no vanilla pixels, determinism, negative tests |

Shipped art: 305 flags in three sizes, 10 people emblems, 40 generic portraits, the Realm frame, button and rule, 24 loading screens and 3 menu backgrounds with thumbnails, the 4 loading chrome textures and the thumbnail frame, the ZIN emblem, the bookmark picture, 175 focus icons (`GFX_focus_zin_<key>`) and 175 idea icons (`GFX_idea_zin_<key>`), 43 event pictures (`GFX_zin_evt_<key>`) and 28 news pictures (`GFX_zin_news_<key>`). 3D: five Meshy infantry units (`zin_men_infantry`, `zin_elves_warden`, `zin_orcs_warrior`, `zin_the_dead_revenant`, `zin_trolls_brute`) mapped to the peoples' graphical cultures `zin_<people>_gfx`. Every presentation source has an agent review line; no owner review line is recorded yet.

## Decisions recorded (integration decisions A1–A7, 19 October 2026)

| # | Decision | Where it applies |
| --- | --- | --- |
| A1 | The model returns about 1.57 megapixels in the prompt's aspect and ignores the requested size (4:3 comes back as 1448 × 1086). Loading screens and menu backgrounds are upscaled with Lanczos 3 to 1920 × 1440; thumbnails are an exact 10× box downscale | §3, §5 |
| A2 | Sheet backgrounds are flat black, not magenta. Interface strips are generated one per job on a black canvas with ends darkening to black, and cut by rows | §4 |
| A3 | Focus and idea icons are round bronze-rimmed medallions with a dark enamel field. Focus icons use the medallion outline as alpha; idea icons take a square crop of the field | §4 |
| A4 | Every prompt includes "no signature or maker's mark; corners and bottom edge hold only plain ground", "no lettering" and "no real-world religious symbol"; review brightens the corners to look for marks | §3, §6 |
| A5 | Three main-menu backgrounds (Parim, the strait, the Wall); thumbnails live in `gfx/interface/zin/loadingscreens/`; the bookmark picture is 180 × 104; `load_24` is cropped to x 0–1400, y 0–1050 before the resize | §5; `DECISIONS` in `presentation.mjs` |
| A6 | Horos pictures (yeldenne_hall, glo_given and every later Horos picture) are drawn from the established text only, not from the owner's private drawings, until the owner says otherwise | §1 rule 3 |
| A7 | Loading tips live in `tools/content/data/loading_tips.json` (builder data) | [02_loading_screens_and_quotes.md](02_loading_screens_and_quotes.md) |

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| All art is image-generated; code only slices, resizes and converts | owner decision, 17 October 2026 | `docs/design/overhaul.md`, CONVENTIONS |
| No assets, text or scripts from other mods, including the Lord of the Rings mods | owner rule | CONVENTIONS |
| 3D unit models come from Meshy through the app-owned launcher route | owner decision | CONVENTIONS, [01_warfare.md](../03_gameplay/01_warfare.md) §14 |
| The owner's original drawings stay private and out of the repository | owner decision | *Horos Visual References*, `.gitignore` |
| Start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| Established looks: Horos (yellow-green armour, blue eyes, thorn-like helm, large blue sword, green crystal Glo in his breast); Golbran small, purple, humanoid; Sunhot elves over three metres tall | established | vault figures and peoples |
| Every style rule, size choice, count, file name and process step below not covered by a decision | **proposed** | this spec |

Art never closes an open question: no picture shows which arm Eindil loses, Zol in any form, Zol's servants, who keeps Furviatlon, Dardan's place, Volgan's spirit after his body breaks, the Gala elves as Sunhot elves, or Ein's sons as elder and younger.

## Design

### 1. Rules

1. **Generated only.** Every 2D picture comes from `tools/content/imagegen.mjs` through the owner's gptimage library (ChatGPT plan, model `gpt-6-astra`). Every 3D model comes from Meshy through the HOI4 Mod Setup launcher route (`.tools/3d_pipeline/`). Nothing is drawn, traced or painted by code. Code may find, crop, mask (by colour key, by brightness or by outline), resize, place generated cells side by side (sprite frames), composite generated pixels onto generated pixels (gauge fills), and convert formats.
2. **No foreign assets.** No image, texture, model, sound or text from another mod or from a game (including vanilla HOI4 art) is used as a reference image or as a source. Vanilla files are measured for sizes and formats only. No game screenshot is ever a reference.
3. **Private references stay private.** The owner's drawings (`docs/reference/originals/`, the vault's `Maps/` and the Horos drawings) are not passed to the generator today (A6). If the owner allows it for a named subject, provenance records each reference as `private:<file name>` with its SHA-256, and the drawing is never copied into the repository or the mod.
4. **The story at the start.** No asset used at the start shows Eindil, Afrit's true form, a great war, or a later-state picture. Loading screens, the bookmark and the main menu are spoiler-free for the whole game. The icon catalog's rules apply to all icons and event pictures ([02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md)).
5. **No lettering.** No generated image contains text, letters, numbers or readable runes. Text is always localisation.
6. **One house style.** Prompts open with the shared style line of `tools/content/art/asset-jobs.mjs`: "Painted dark-fantasy strategy-game art in a consistent style: rich oil-paint texture, dramatic soft lighting, muted earthy palette with gold accents." Region palettes follow the icon catalog.

### 2. Provenance

`art/source/provenance.jsonl` is append-only and public. It holds two kinds of line.

| Line | Written by | Fields |
| --- | --- | --- |
| Generation | `imagegen.mjs`, one per call | `id` (job id), `out` (raw path relative to the jobs folder), `model`, `size` (as requested), `quality`, `references`, `prompt`, `sha256`, `accepted` (the layout check only), `seconds`, `at` |
| Review | the reviewer, one per decision | `id`, `out`, `sha256`, `accepted`, `reviewer` (`agent` or `owner`), `kind` (`sheet`, `single`, `meshy_input`, `texture`), `actualSize`, `note`, `at` |

**Gate.** A source is usable only when the **last review line for its exact bytes** says `accepted: true` (`acceptance()` in `modules/presentation.mjs`). Generation lines never count as review. The one exception is a named integration decision for exact bytes (A5 for `load_24`), recorded in the module's `DECISIONS` table.

Proposed additional fields for new lines: `keys` (catalog keys in cell order) and `grid` (`{ cols, rows, ground }`) on sheet generations, and `supersedes` on a review line that replaces an accepted source.

Raw generations live in `$ZIN_ART/raw/<kind>/`. The build stages every accepted source it uses into `art/source/<kind>/` and every shipped file into a manifest `art/source/<module>_manifest.json` (decision A8; today `presentation_manifest.json`; each new art module writes its own beside the shared provenance log, in the same format: `out`, `source`, `sourceSha256`, `ops`, `sha256`). The repository is public: provenance never contains credentials, account data or private file contents.

### 3. Generation

| Item | Rule |
| --- | --- |
| Route | `node tools/content/imagegen.mjs <jobs.json>`; one image per call; `quality: high` for art meant to ship, `medium` or `low` for trials |
| Size | A job states its aspect through `size`; the model returns about 1.57 megapixels in that aspect (A1). Measured: 3:2 → 1536 × 1024; 1:1 → 1254 × 1254; 4:3 → 1448 × 1086; 2:1 → 1774 × 887. Slicers never assume the requested size; they read the file |
| Sheets | Many small items per call on flat black in an exact grid (section 4), with a `check` block (`expected`, `cols`, `rows`, `aspect`, `minAreaFraction`) that `imagegen.mjs` runs before accepting the layout |
| Singles | One scene or object per call: event pictures, loading screens, headers, tier A portraits, Meshy inputs, keyed objects |
| Prompts | Style line, then layout clause, then numbered subjects in reading order; always the A4 clause and "no text, no letters, no frames, no labels" |
| Retries | At most three attempts per job on a failed layout check, then a person looks; every attempt is logged |

### 4. Sheets and slicing

**Layouts** (targets):

| Kind | Aspect | Grid | Ground | Cell → output | Method |
| --- | --- | --- | --- | --- | --- |
| Flags | 3:2 | 4 × 4 | black | 492 × 312 → 82 × 52, 41 × 26, 10 × 7 TGA (in game) | `slice-flags.mjs` with the recorded cell map `data/flags-cells.json` |
| Generic portraits | 2:3 | 2 × 2 | black | → 156 × 210 (in game) | `art.mjs` |
| People emblems | 3:2 | 5 × 2 | black | → 64 × 64 (in game) | `art.mjs` |
| Focus and idea icons | 3:2 | 4 × 3 | black | medallion → 100 × 88 focus (outline alpha, 3 px pad) and 64 × 64 idea (square of 64% of the medallion's smaller side, centred) (in game, A3) | `presentation.mjs` (`medallionMask`) |
| Sub-unit icons and counters | 3:2 | 4 × 4 | black | → 76 × 42 per frame, 60 × 12, 30 × 12 | outline alpha |
| Equipment and technology pictures | 3:2 | 3 × 4 | black | → 146 × 54 or 64 × 64 | outline alpha |
| Decision pictures | 3:2 | 4 × 3 | black | → 114 × 101 | opaque crop |
| Decision icons, map mode icons, bar sigils | 1:1 | 6 × 6 | black | → 33 × 32, 20 × 18, 24 × 24 | outline alpha |
| UI theme | 3:2 | free layout: frame panel, empty gauge, full gauge, three tab states, two row states | black | → nine-slice 128 × 128, gauge 240 × 16, tab 140 × 30, row 560 × 30 | opaque crop; strips by rows |
| Interface strips and bands | by target | one strip per job | black, ends darkening to black (A2) | cut by rows; alpha follows each column's brightness, so the ends fade | `presentation.mjs` (`stripRgba`), in game for the loading chrome |
| Keyed objects with transparent parts | by target | single | flat magenta `#FF00FF` | key matte with despill (`keyMatte`), trim, `contain` | in game for the emblem and the thumbnail frame |

**Slicing steps** (builder):

1. Find the items with the adaptive region detector (`findRegionsAdaptive`) against the black ground. The sheet must yield exactly the expected count with consistent sizes, or it is refused. Nothing is guessed.
2. Order cells by row, then column; map them to the job's keys (the cell map, for example `data/presentation-cells.json`).
3. Crop each cell with a small inset.
4. Alpha: the outline fill for shaped items on black (every row and column filled between its first and last pixel above the ground), the column-brightness matte for strips, the magenta key matte for keyed singles. Opaque cells get none.
5. Trim to the alpha bounds, fit into the target canvas (`contain` with the asset type's padding, `cover`, or `fill`), resize with Lanczos 3.
6. Convert: DDS uncompressed A8R8G8B8, top-left origin, no mipmaps (`dds()`); flags TGA 32-bit, bottom-left origin (`tga()`).
7. Record the manifest line.

**Gauge frames.** A gauge sprite has 21 frames. Frame *k* is the generated empty gauge with the left *k*/20 of the generated full gauge pasted over it. This composites generated pixels only (rule 1); it proceeds on that reading until the owner answers (OPEN_QUESTIONS, interface 7).

**Determinism.** Slicing is a pure function of the raw file's bytes and the job. The same input gives byte-identical outputs with the pinned `sharp` 0.35.5 (`tools/package-lock.json`). The build test rebuilds and compares hashes.

### 5. HOI4 sizes and formats

Measured from the installed game (majority size per folder), and as shipped.

| Asset | Size | Format | Path (ZIN) | Sprite |
| --- | --- | --- | --- | --- |
| Focus icon | 100 × 88 | DDS A8R8G8B8, alpha | `gfx/interface/goals/zin/<key>.dds` | `GFX_focus_zin_<key>`, `GFX_focus_zin_<key>_shine` (`interface/zin_catalog_focus_icons.gfx`, `_shine.gfx`) |
| Idea icon | 64 × 64 | DDS A8R8G8B8 | `gfx/interface/ideas/zin/<key>.dds` | `GFX_idea_zin_<key>` (`interface/zin_catalog_ideas.gfx`; an idea writes `picture = zin_<key>`) |
| Event picture | 210 × 176 | DDS A8R8G8B8 | `gfx/event_pictures/zin/zin_evt_<key>.dds` | `GFX_zin_evt_<key>` (`interface/zin_event_pictures.gfx`) |
| News picture | 397 × 153 | DDS A8R8G8B8 | `gfx/event_pictures/zin/zin_news_<key>.dds` | `GFX_zin_news_<key>` |
| Leader portrait | 156 × 210 | DDS A8R8G8B8 | `gfx/leaders/zin/lore/<id>[_<state>].dds` | `GFX_zin_portrait_<id>[_<state>]` |
| Advisor and small portrait | 65 × 67 | DDS A8R8G8B8 | `gfx/leaders/zin/lore/small/<id>.dds` | `GFX_zin_portrait_<id>_small` |
| Generic portrait | 156 × 210 | DDS A8R8G8B8 | `gfx/leaders/zin/<people>_<sex>_<n>.dds` | `GFX_zin_portrait_<people>_<sex>_<n>` (in game) |
| Flag | 82 × 52, 41 × 26, 10 × 7 | TGA 32-bit | `gfx/flags/`, `medium/`, `small/` | by tag (in game) |
| Sub-unit icon and counter | as the vanilla sprite each name replaces: `_medium` 152 × 42 in 2 frames (76 × 42 each); on-map small 60 × 12 in 2 frames; white template variant 30 × 12 | DDS | `gfx/interface/counters/divisions_large/zin_<sprite>_icon.dds`, `divisions_small/`, `division_templates_small/` | `GFX_unit_<sprite>_icon_medium`, `_medium_white`, `_small` ([01_warfare.md](../03_gameplay/01_warfare.md) §14.3) |
| Equipment and technology picture | 146 × 54 (equipment), 64 × 64 (others) | DDS | `gfx/interface/technologies/zin/` | `GFX_<equipment>_medium`, `GFX_zin_tech_<key>` |
| Doctrine icon | 64 × 64 | DDS | `gfx/interface/technologies/zin/doctrines/` | warfare spec |
| Decision category picture | 114 × 101 | DDS | `gfx/interface/decisions/zin/` | `GFX_decision_cat_picture_zin_<key>` |
| Decision icon | 33 × 32 | DDS | `gfx/interface/decisions/zin/` | `GFX_decision_zin_<key>` |
| Loading screen | 1920 × 1440; thumbnail 192 × 144 | DDS A8R8G8B8 | `gfx/loadingscreens/load_<n>.dds`; `gfx/interface/zin/loadingscreens/load_<n>_small.dds` (A5) | engine; `GFX_load_<n>_small` (in game) |
| Main menu background | 1920 × 1440; thumbnail 192 × 144 | DDS A8R8G8B8 | `gfx/loadingscreens/zin_menu_<key>.dds`; `gfx/interface/zin/loadingscreens/zin_menu_<key>_small.dds` | `GFX_zin_menu_<key>_small` (in game) |
| Bookmark picture | 180 × 104 (A5) | DDS A8R8G8B8 | `gfx/interface/bookmarks/zin_fourth_age.dds` | `GFX_zin_bookmark_fourth_age` (in game) |
| UI frames and widgets | see [07_interface](../07_interface/01_interface.md) | DDS | `gfx/interface/zin/` | interface spec |
| Map mode button | 20 × 18 | DDS | `gfx/interface/mapmode/zin_*.dds` | interface spec |

Focus sprites are `GFX_focus_zin_<key>` (and `_shine`), as in the game, the icon catalog and the contract additions register; a focus sprite with any other prefix fails the build's name check. If a large background renders wrong in the Linux run, BC3 (DXT5) is the fallback and the manifest records it.

### 6. Review

Each sheet or single gets a contact sheet (the sliced outputs on a grey ground at 100% and 200%, `node tools/content/preview.mjs`) before acceptance. The reviewer appends a review line.

Checklist:

1. Subject matches the key's description; no text or lettering; no frame painted in; corners and bottom edge brightened and checked for a signature or mark (A4).
2. Rules of the icon catalog: no Afrit or Aurevan face, no Zol, no servant, no New God figure; no Eindil in an icon; no real-world religious symbol.
3. Established looks respected (Horos from the text, Golbran, Sunhot elves' height, Zol's sigil with no figure).
4. Readable at game size (the 50% view for icons).
5. Style and palette match the theme.
6. No resemblance to a known asset of another game or mod (the reviewer rejects anything that looks traced or familiar).

**Owner approval** is required for: tier A ruler portraits; every portrait of Horos, Eindil, Aurevan, Varner and Golbran; loading screens and the main menu; the eight UI themes; every Meshy input image (proposed groups; OPEN_QUESTIONS, interface 10). Agent-accepted art ships during development. Before the phase 7 release, every source in these groups needs a review line with `reviewer: "owner"`; the release check lists the ones still pending.

### 7. 3D models

Route: the kit's `hoi4-3d-model-pipeline` through `.tools/3d_pipeline/` (Meshy client through the HOI4 Mod Setup launcher, Blender recovery, `io_pdx_mesh` export), as [01_warfare.md](../03_gameplay/01_warfare.md) §14 defines. The five pilots ran this route (`docs/plans/units_pilot/3d_status.md`) and are in game.

1. One generated, weapon-free `meshy_input.png` per asset, approved by the owner, stored at `docs/assets/hoi4_3d_model_jobs/models_3d/<asset id>/refs/` (job writers `art/unit-ref-jobs.mjs`, `art/stage-unit-jobs.mjs`).
2. Meshy geometry, one rig attempt and one action attempt per role for bipeds; Blender recovery after that; non-bipeds go to Blender.
3. Weapons as separate attachment entities, only after the owner approves weapon references (warfare open question 9).
4. Scale against vanilla infantry (scale 0.8); size targets from the warfare spec.
5. Actions: `idle`, `move`, `attack`, `defend`, `retreat`, `death` (`modules/units3d.mjs` plays `attack` for a missing `defend` and `move` for a missing `retreat`).
6. Export `.mesh` and `.anim`; byte-level reimport proof.
7. Evidence only from the Linux run; never the Windows game.
8. `modules/units3d.mjs` copies each job root's runtime files into `gfx/models/units/zin/<id>/` and maps peoples without a model to the nearest one; each new model replaces a borrowed mapping.

Meshy credits limit the pace, not the route ([03_full_asset_inventory.md](03_full_asset_inventory.md) §4.K). Until a people has its own model, it borrows one; counters and icons never wait for models.

### 8. Inventory

[03_full_asset_inventory.md](03_full_asset_inventory.md) is the list of every asset family with counts, layouts, phases, waves and what is done. This spec keeps no separate count.

## Implementation

### Files and tools

| Path | Content | State |
| --- | --- | --- |
| `tools/content/imagegen.mjs` | Generation | existing |
| `tools/content/art/*.mjs` | Job writers; one per family (`asset-jobs`, `flag-jobs`, `unit-ref-jobs`, `stage-unit-jobs` today; `ui-jobs`, `ui-reskin-jobs`, `frontend-jobs`, `chronicle-jobs`, `loading-jobs`, `icon-jobs`, `war-jobs`, `portrait-jobs`, `event-jobs` as the families start) | existing; extended |
| `tools/content/lib/sheets.mjs`, `tools/content/lib/raster.mjs` | Region finding, cropping, DDS and TGA | existing |
| `tools/content/lib/fit.mjs` | The fits and mattes shared by every art module (`keyMatte`, `boxDownscale`, `medallionMask`, the strip matte, `strip()`, nine-slice), moved out of `presentation.mjs` and `ui.mjs` | new |
| `tools/content/modules/*.mjs` | One builder module per family stages its art from accepted sources and writes its manifest (inventory spec lists them) | existing; extended |
| `tools/content/data/*-cells.json` | Cell maps the sheets were generated with (`flags-cells.json`, `presentation-cells.json` today) | existing; extended |
| `$ZIN_ART/jobs/<family>-jobs.json`, `$ZIN_ART/raw/<kind>/` | Working jobs and raw images (outside the repository) | existing |
| `art/source/provenance.jsonl` | Provenance (append-only) | existing |
| `art/source/<kind>/` | Accepted raw sources | existing |
| `art/source/<module>_manifest.json` | Shipped file → source mapping and hashes | existing for presentation; one per new module |
| `tools/content/art.test.mjs` | The cross-module art checks below | new |
| `.tools/3d_pipeline/`, `docs/assets/hoi4_3d_model_jobs/models_3d/<asset id>/` | Meshy and Blender route; 3D jobs and evidence | existing |

### Builder checks

1. Every sprite in a ZIN `.gfx` file points to an existing file of the declared size and format (DDS header read). (In `presentation.test.mjs` for its files; `art.test.mjs` extends it to every ZIN `.gfx`.)
2. Every shipped image has a manifest line; hashes match; the source has an accepted review line for its exact bytes or a named decision.
3. No shipped image comes from a path outside `art/source/` or `$ZIN_ART/raw/`.
4. No provenance reference is a public path inside another mod, a game folder or a screenshot folder; a `private:` reference appears only for a subject the owner has allowed.
5. Every catalog key used by content has accepted art from phase 7; earlier, a key without art points at the fallback icon `generic` or picture `generic_court` and the build warns.
6. Icon alpha: transparent corners on focus icons; no magenta fringe above a small pixel count on keyed outputs.
7. No shipped file equals the installed vanilla file at the same path (in `presentation.test.mjs` today).

### Variables, events, game rules, defines

None.

## AI

None.

## Acceptance

1. A fresh build re-slices all accepted sources and produces byte-identical outputs (`npm test` in `tools/`).
2. Every shipped image traces to an accepted review line; builder checks 1–7 pass, each with a negative test (an unreviewed source, a wrong size, a vanilla copy, a magenta fringe, a missing manifest line).
3. `hoi4.gui_inspect` reports no missing texture for any ZIN sprite; `hoi4.focus_render` shows real icons for the major trees from phase 7.
4. The art review checklist is recorded for every accepted source; before the phase 7 release, owner review lines exist for the listed groups.
5. The Linux run shows the loading screens, the bookmark picture and portraits without pink "missing texture" fills, and `error.log` has no ZIN texture line.
6. No file under `docs/reference/originals/` or the vault's private drawings is tracked by Git or present in the staged mod.

## Open questions

Each proceeds on the proposal; the owner may overrule.

1. Gauge compositing and frame packing count as "slices, resizes and converts" (proposed; OPEN_QUESTIONS, interface 7).
2. The owner-approval groups are those of §6 (proposed; OPEN_QUESTIONS, interface 10).
3. Moving the builder into ZIN: done (S10).
4. Weapon references for 3D: none until the owner approves them (warfare open question 9).
5. The private Horos drawings: not used (A6) until the owner allows them (OPEN_QUESTIONS, short list 14).
