# Art pipeline

**Status:** Draft. **Priority:** 5. **Phase:** all (each phase generates the art its content needs; phase 7 finishes it).

## Purpose

ZIN needs about 1,250 pictures and 27 3D models. Every one is new. This spec fixes how they are made, recorded, cut, converted and checked: the image generation route and its prompt rules, provenance, sheet generation and slicing, the HOI4 sizes and formats, the 3D route through Meshy, review, and the inventory of assets by phase with counts.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| All art is image-generated; code only slices, resizes and converts | owner decision, 17 October 2026 | `docs/design/overhaul.md`, CONVENTIONS |
| No assets, text or scripts from other mods, including the Lord of the Rings mods | owner rule | CONVENTIONS |
| 3D unit models come from Meshy through the app-owned launcher route | owner decision | CONVENTIONS, [01_warfare.md](../03_gameplay/01_warfare.md) §14 |
| The owner's original drawings stay private and out of the repository; the three Horos drawings are established reference art | owner decision; established | *Horos Visual References*, `.gitignore` |
| Start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| Established looks: Horos (yellow-green armour, blue eyes, thorn-like helm, large blue sword, green crystal Glo in his breast); Golbran small, purple, humanoid; Sunhot elves over three metres tall | established | vault figures and peoples |
| Every style rule, size choice, count, file name and process step below | **proposed** | this spec |

Art never closes an open question: no picture shows which arm Eindil loses, Zol in any form, Zol's servants, who keeps Furviatlon, Dardan's place, Volgan's spirit after his body breaks, the Gala elves as Sunhot elves, or Ein's sons as elder and younger.

## Design

### 1. Rules

1. **Generated only.** Every 2D picture comes from the owner's gptimage route (ChatGPT plan; tool `generate_image`). Every 3D model comes from Meshy through `.tools/3d_pipeline/`. Nothing is drawn, traced or painted by code. Code may find, crop, mask by colour key, resize, composite generated pixels onto generated pixels (gauge fills), and convert formats.
2. **No foreign assets.** No image, texture, model, sound or text from another mod or from a game (including vanilla HOI4 art) is used as a reference image or as a source. Vanilla files are measured for sizes and formats only. No game screenshot is ever a reference.
3. **Private references stay private.** The owner's drawings (`docs/reference/originals/`, the vault's `Maps/` and Horos drawings) may be passed to the generator as reference images when a spec asks for it (Horos, the Yeldenne hall). They are never copied into the repository or the mod. Provenance records them as `private:<file name>` with their SHA-256.
4. **The story at the start.** No asset used at the start shows Eindil, Afrit's true form, a great war, or a later-state picture. Loading screens, the bookmark and the main menu are spoiler-free for the whole game. The icon catalog's rules apply to all icons and event pictures ([02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md)).
5. **No lettering.** No generated image contains text, letters, numbers or readable runes. Text is always localisation.
6. **One house style.** Prompts open with the shared style line already used by the builder: "Painted dark-fantasy strategy-game art in a consistent style: rich oil-paint texture, dramatic soft lighting, muted earthy palette with gold accents." Region palettes follow the icon catalog.

### 2. Provenance

`art/source/provenance.jsonl` is append-only. One line per generation call, then one line per review decision. Today's fields stay; new fields are added (proposed):

| Field | Meaning | Exists today |
| --- | --- | --- |
| `id` | Job id, for example `icons-crowns-01` | yes |
| `out` | Raw output path, relative to the jobs folder | yes |
| `model`, `size`, `quality` | As reported by the route | yes |
| `references` | Reference image paths; private ones as `private:<name>` | yes |
| `prompt` | Full prompt text | yes |
| `sha256` | Hash of the raw output | yes |
| `seconds`, `at` | Duration, UTC timestamp | yes |
| `accepted`, `note` | Review decision line | yes |
| `kind` | `sheet`, `single`, `meshy_input`, `texture` | new |
| `keys` | Catalog keys or asset ids in cell order | new |
| `grid` | `{ "cols", "rows", "background" }` for sheets | new |
| `reviewer` | `agent` or `owner` | new |
| `supersedes` | The id this generation replaces | new |

Raw generations live outside the mod in the builder's art folder (`zin-art/raw/<kind>/`). Accepted raw sheets are staged into the mod at `art/source/<kind>/<id>.png` and listed in `.zin-content.json`. Every shipped DDS or TGA is listed in `art/source/manifest.json` (new): output path, source id, source sha256, cell index, operations, output sha256. The builder fails if a shipped file has no manifest line or its hash differs.

The repository is public. Provenance must never contain credentials, account data or private file contents.

### 3. Generation

| Item | Rule |
| --- | --- |
| Route | `generate_image`; one image per call; `quality: high` for accepted art, `medium` for trials |
| Sizes | Multiples of 16, longest edge at most 3840, aspect at most 3:1. Defaults: 1536×1024, 1024×1536, 1024×1024, 2048×1536 (loading screens), 3072×1184 (news strips) |
| Sheets | Many small items per call on a flat background in an exact grid (section 4) |
| Singles | One scene per call: event pictures, loading screens, headers, tier A portraits |
| Prompts | Style line, then layout clause, then numbered subjects in reading order; state "no text, no letters, no frames, no labels" every time |
| Retries | At most three attempts per job before a human looks; every attempt is logged |

### 4. Sheets and slicing

**Layouts** (targets):

| Kind | Size | Grid | Background | Cell → output |
| --- | --- | --- | --- | --- |
| Flags | 1536×1024 | 4×4 | black | 492×312 → 82×52 TGA (existing) |
| Portraits, generic | 1024×1536 | 2×2 | black | → 156×210 (existing) |
| Focus and idea icons | 1536×1024 | 4×3 | flat magenta `#FF00FF` (green `#00FF00` when a subject is purple or pink) | icon → 100×88 focus and 64×64 idea |
| Sub-unit icons and counters | 1536×1024 | 4×4 | flat key | → 76×42 per frame, 60×12, 30×12 |
| Equipment and technology pictures | 1536×1024 | 3×4 | flat key | → 146×54 or 64×64 |
| Decision pictures | 1536×1024 | 4×3 | black | → 114×101 |
| Decision icons, map mode icons, bar sigils | 1024×1024 | 6×6 | flat key | → 33×32, 20×18, 24×24 |
| UI theme | 1536×1024 | free layout: frame panel, empty gauge, full gauge, three tab states, two row states | black | → nine-slice 128×128, gauge 240×16, tab 140×30, row 560×30 |

**Slicing steps** (builder, `lib/sheets.mjs`):

1. Find the items with the adaptive region detector against the background (black: brightness threshold; key colour: distance to the key). The sheet must yield exactly the expected count with consistent sizes (±12%), or it is refused. Nothing is guessed.
2. Order cells by row, then column; map them to `keys` from the job.
3. Crop each cell with a small inset (4 px).
4. Keyed sheets: alpha from the colour distance to the key (fully transparent below a low threshold, opaque above a high one, linear between), then remove the key's colour spill on edge pixels.
5. Trim to the alpha bounds, fit into the target canvas with `contain` and the padding of the asset type (icons 3 px), resize with Lanczos 3.
6. Convert: DDS uncompressed A8R8G8B8, top-left origin, no mipmaps (`lib/raster.mjs`, `dds()`); flags TGA 32-bit, bottom-left origin (`tga()`).
7. Record the manifest line.

**Gauge frames.** A gauge sprite has 21 frames. Frame *k* is the generated empty gauge with the left *k*/20 of the generated full gauge pasted over it. This is compositing of generated pixels only (rule 1).

**Determinism.** Slicing is a pure function of the raw file's bytes and the job. The same input gives byte-identical outputs. The builder test re-slices one sheet of each kind and compares hashes.

### 5. HOI4 sizes and formats

Measured from the installed game (majority size per folder).

| Asset | Size | Format | Path (ZIN) | Sprite |
| --- | --- | --- | --- | --- |
| Focus icon | 100×88 | DDS A8R8G8B8, alpha | `gfx/interface/goals/zin/<key>.dds` | `GFX_zin_focus_<key>`, `_shine` |
| Idea icon | 64×64 | DDS A8R8G8B8 | `gfx/interface/ideas/zin/<key>.dds` | `GFX_idea_zin_<key>` |
| Event picture | 210×176 | DDS A8R8G8B8 | `gfx/event_pictures/zin/zin_evt_<key>.dds` | `GFX_zin_evt_<key>` |
| News picture | 397×153 | DDS A8R8G8B8 | `gfx/event_pictures/zin/zin_news_<key>.dds` | `GFX_zin_news_<key>` |
| Leader portrait | 156×210 | DDS A8R8G8B8 | `gfx/leaders/zin/lore/<id>[_<state>].dds` | `GFX_zin_portrait_<id>[_<state>]` |
| Advisor and small portrait | 65×67 | DDS A8R8G8B8 | `gfx/leaders/zin/lore/small/<id>.dds` | `GFX_zin_portrait_<id>_small` |
| Flag | 82×52, 41×26, 10×7 | TGA 32-bit | `gfx/flags/`, `medium/`, `small/` | by tag (existing) |
| Sub-unit icon and counter | as the vanilla sprite each name replaces: `_medium` 152×42 in 2 frames (76×42 each); on-map small 60×12 in 2 frames; white template variant 30×12 | DDS | `gfx/interface/counters/divisions_large/zin_<sprite>_icon.dds`, `divisions_small/`, `division_templates_small/` | `GFX_unit_<sprite>_icon_medium`, `_medium_white`, `_small` ([01_warfare.md](../03_gameplay/01_warfare.md) §14.3) |
| Equipment and technology picture | 146×54 (equipment), 64×64 (others) | DDS | `gfx/interface/technologies/zin/` | `GFX_<equipment>_medium`, `GFX_zin_tech_<key>` |
| Doctrine icon | 64×64 | DDS | `gfx/interface/technologies/zin/doctrines/` | warfare spec |
| Decision category picture | 114×101 | DDS | `gfx/interface/decisions/zin/` | `GFX_decision_cat_picture_zin_<key>` |
| Decision icon | 33×32 | DDS | `gfx/interface/decisions/zin/` | `GFX_decision_zin_<key>` |
| Loading screen | 1920×1440 and 192×144 | DDS A8R8G8B8 (as vanilla) | `gfx/loadingscreens/load_<n>.dds`, `load_<n>_small.dds` | engine |
| Main menu background | 1920×1440 and 192×144 | DDS | `gfx/loadingscreens/zin_menu_parim.dds` | `GFX_zin_menu_parim_small` |
| Bookmark picture | 1920×1440 crop as vanilla bookmark art | DDS | `gfx/interface/bookmarks/zin_fourth_age.dds` | start spec |
| UI frames and widgets | see [07_interface](../07_interface/01_interface.md) | DDS | `gfx/interface/zin/` | interface spec |
| Map mode button | 20×18 | DDS | `gfx/interface/mapmode/zin_*.dds` | interface spec |

If a large background renders wrong in the Linux run, BC3 (DXT5) is the fallback and the manifest records it.

### 6. Review

Each sheet or single gets a contact sheet (the sliced outputs on a grey ground at 100% and 200%) before acceptance. The reviewer writes an `accepted` line.

Checklist:

1. Subject matches the key's description; no text or lettering; no frame painted in.
2. Rules of the icon catalog: no Afrit or Aurevan face, no Zol, no servant, no New God figure; no Eindil in an icon.
3. Established looks respected (Horos, Golbran, Sunhot elves' height, Zol's sigil with no figure).
4. Readable at game size (the 50% view for icons).
5. Style and palette match the theme.
6. No resemblance to a known asset of another game or mod (the reviewer rejects anything that looks traced or familiar).

**Owner approval** is required for: tier A ruler portraits, every portrait of Horos, Eindil, Aurevan, Varner and Golbran; loading screens and the main menu; the eight UI themes; every Meshy input image.

### 7. 3D models

Route: the kit's `hoi4-3d-model-pipeline` through `.tools/3d_pipeline/` (Meshy client, Blender recovery, `io_pdx_mesh` export), as [01_warfare.md](../03_gameplay/01_warfare.md) §14 defines. Summary:

1. One generated, weapon-free `meshy_input.png` per asset, approved by the owner, stored at `docs/assets/hoi4_3d_model_jobs/models_3d/<asset id>/refs/`.
2. Meshy geometry, one rig attempt and one action attempt per role for bipeds; Blender recovery after that; non-bipeds go to Blender.
3. Weapons as separate attachment entities (pending owner approval of weapon references).
4. Scale against vanilla infantry (scale 0.8); size targets from the warfare spec.
5. Actions: `idle`, `move`, `attack`, `defend`, `retreat`, `death`.
6. Export `.mesh` and `.anim`; byte-level reimport proof.
7. Evidence only from the Linux run; never the Windows game.

Meshy is blocked by the HOI4 Mod Setup launcher bug (roadmap). Until it is fixed every sub-unit shows the generic entity; counters and icons do not wait for models.

### 8. Inventory by phase

Counts are design targets. "Unique images" counts shipped pictures; a sheet yields many. "Calls" estimates generation calls including one retry in four.

| Phase | Asset | Unique images | Calls | Source spec | State |
| --- | --- | ---: | ---: | --- | --- |
| 1–2 | Country flags (×3 sizes from one image) | 305 | 20 sheets | countries | done |
| 1–2 | People emblems | 10 | 1 | peoples | done |
| 1–2 | Generic portraits (10 peoples × 4) | 40 | 10 | peoples | done |
| 1–2 | Realm panel frame, button, rule | 3 | 3 | interface | done |
| 2 | Lore portraits: tier A rulers and states, councils, generals, dominion rulers, tier B rulers, story figures | ~135 | ~70 | [02_characters.md](../02_lore/02_characters.md) | to do |
| 2 | Bookmark picture "The Fourth Age" | 1 | 2 | calendar | to do |
| 3 | Cosmetic flags (Aenor breakaways, Free Dominions, Host of Eindil, others) | ~12 | 1 | Aenor, Eindil | to do |
| 3 | Sub-unit icons and counters (53 land, 4 ship, 2 air sub-units) | ~120 | ~10 | warfare | to do |
| 3 | Equipment pictures (33 archetypes) | 33 | 3 | warfare | to do |
| 3 | Technology and doctrine pictures (unique art; many techs reuse equipment art) | ~70 | 6 | warfare | to do |
| 3 | Resource and building icons | ~12 | 1 | [02_economy.md](../03_gameplay/02_economy.md) | to do |
| 3 | Decision category pictures | ~18 | 2 | mechanics | to do |
| 3 | Decision icons | ~24 | 1 | mechanics | to do |
| 3 | Mechanic idea icons (catalog keys used by mechanics) | ~40 | 4 | catalog | to do |
| 3 | Mechanic event pictures (catalog) | ~30 | ~38 | catalog | to do |
| 4 | Remaining focus and idea icons of the catalog | ~135 | 12 | catalog | to do |
| 5 | Story and ending pictures (catalog) | ~22 | ~28 | catalog | to do |
| 6 | Regional icon additions | ~40 | 4 | regional trees | to do |
| 7 | UI themes (8 sheets) and panel headers (8) | 16 sheets → ~60 sprites | ~20 | interface | to do |
| 7 | Erdae bar sigils, Gathering Dark icon, stage plates, map mode buttons | ~16 | 1 | interface | to do |
| 7 | Loading screens and main menu | 10 (+10 small) | ~14 | interface | to do |
| 7 | 3D models (below) | 28 | Meshy | warfare | blocked |
| 8 | More event pictures and portraits | ~100 | ~110 | lore depth | later |
| | **Total 2D** | **~1,250** | **~360** | | |

**3D models** (phase 7 target):

| Group | Asset ids (proposed beyond the pilots) | Count |
| --- | --- | ---: |
| Pilots (references approved 18 Oct 2026) | `zin_men_infantry`, `zin_elves_warden`, `zin_orcs_warrior`, `zin_the_dead_revenant`, `zin_trolls_brute` | 5 |
| Other foot | `zin_sun_elves_spear`, `zin_giants_warrior`, `zin_ents_warden`, `zin_yeti_warrior`, `zin_demons_netherborn`, `zin_zol_deathless` (never reuses the revenant) | 6 |
| Mounted | `zin_men_cavalry`, `zin_men_knights`, `zin_men_camel_riders`, `zin_elves_riders` | 4 |
| Siege | `zin_siege_engine` | 1 |
| Ships | `zin_ship_galley`, `zin_ship_warship`, `zin_ship_great_warship`, `zin_ship_raider` | 4 |
| Beasts | `zin_air_griffin_riders`, `zin_air_dragon_flight` | 2 |
| Men's cultures | infantry variants for `zin_middle_gfx`, `zin_north_gfx`, `zin_west_gfx`, `zin_east_gfx`, `zin_south_gfx` | 5 |
| Weapon attachments (pending approval) | spear, sword, shield, axe, bow, club | 6 attachments, not counted |
| **Total** | | **27 + attachments** |

## Implementation

### Files and tools

| Path | Content |
| --- | --- |
| Builder art modules (today `zin-content/art/*.mjs`, `modules/art.mjs`, `lib/sheets.mjs`, `lib/raster.mjs`) | Job lists, slicing, conversion |
| `docs/design/art/jobs/<kind>.json` (new) | Jobs as data: id, size, grid, background, keys, prompt subjects |
| `docs/design/art/icon_catalog.json` | Catalog data ([02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md)) |
| `art/source/provenance.jsonl` | Provenance (append-only) |
| `art/source/<kind>/` | Accepted raw sheets and singles |
| `art/source/manifest.json` (new) | Shipped file → source mapping and hashes |
| `.tools/3d_pipeline/` | Meshy and Blender route |
| `docs/assets/hoi4_3d_model_jobs/models_3d/<asset id>/` | 3D jobs and evidence |

Builder changes (proposed): key-colour backgrounds in `findRegions`; alpha matte and despill in `cropRegion`; gauge compositing; manifest writing; the art checks below. All outputs are written through the shared rewrite engine with the rest of the build.

### Builder checks

1. Every sprite in a ZIN `.gfx` file points to an existing file of the declared size and format (DDS header read).
2. Every shipped image has a manifest line; hashes match; the source has an `accepted: true` provenance line.
3. No shipped image comes from a path outside `art/source/` or the builder's raw folder.
4. No provenance reference is a public path inside another mod, a game folder or a screenshot folder.
5. Every catalog key used by content has accepted art from phase 7 (earlier: placeholder warning).
6. Icon alpha: transparent corners on focus icons; no magenta or green fringe above a small pixel count.

### Variables, events, game rules, defines

None.

## AI

None.

## Acceptance

1. A fresh build re-slices all accepted sheets and produces byte-identical outputs.
2. Every shipped image traces to an accepted provenance line; the builder checks pass.
3. `hoi4.gui_inspect` reports no missing texture for any ZIN sprite; `hoi4.focus_render` shows real icons for the major trees from phase 7.
4. The art review checklist is recorded for every accepted sheet; owner approvals are recorded for the listed groups.
5. The Linux run shows the loading screens, the bookmark picture and portraits without pink "missing texture" fills, and the error log has no ZIN texture errors.
6. No file under `docs/reference/originals/` or the vault's private drawings is tracked by Git or present in the staged mod.

## Open questions

1. Is gauge compositing (pasting part of a generated full bar onto a generated empty bar) within "code only slices, resizes and converts"?
2. Which groups does the owner want to approve personally beyond those listed?
3. Should the builder move out of the tools repository's `.tmp` folder into the ZIN repository, so the art pipeline is reproducible from ZIN alone?
4. Weapon references for 3D (warfare open question 9).
5. May the Horos drawings be used as generation references, given that the drawings stay private but the generated pictures are published?
