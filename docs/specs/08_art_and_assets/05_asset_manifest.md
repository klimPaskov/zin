# Asset manifest and completeness

**Status:** Draft. Written 19 October 2026 as the gap spec for the asset manifest rows of [00_master_overhaul_plan.md](../00_master_overhaul_plan.md) §7. **Priority:** 5. **Phase:** the manifest and the check land in wave 1 of [the production plan](03_full_asset_inventory.md) §7 and run in every build from then on; the unplanned families (section 7) land in waves 3, 4 and 6; the release gate (placeholders fail) is phase 7.

## Purpose

[03_full_asset_inventory.md](03_full_asset_inventory.md) says what art ZIN needs. [01_art_pipeline.md](01_art_pipeline.md) says how a picture is made. Neither says how the project *knows*, at any build, that every picture, sound, model and name a player can reach exists, belongs to ZIN, and is not a copy of something else in ZIN. This spec does.

It defines:

- **the asset manifest**, one record per shipped asset, which joins the plan (`inventory.json`), the per-module source manifests (decision A8) and the provenance log;
- **the completeness check**, which proves that every reference in a shipped or still-loaded file resolves, that every shipped asset is referenced, and that the engine's silent fallbacks to default sprites cannot hide a miss;
- **the uniqueness rules** per family, with the largest reuse each may have, and the check that enforces them;
- **the budget and the route** of every family, including the families the inventories flagged as unplanned, and decisions for each of those (voices, battle plan names, template icons, tactic pictures, medals, particles, trains and roads, default sprites, fonts, cursors, terrain tiles, border sheets, ambient objects);
- **the formats** (DDS variants, sizes, mip levels, the vanilla sprites whose names disagree with their files);
- **the generation queue**, so the roughly 750 generation calls finish in hours, not days;
- **the builder module and check** that do all this.

The other art specs keep their roles. This spec adds no new art style; it adds the ledger and the gate.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| All art is image-generated; code only finds, crops, resizes, packs and converts; 3D is Meshy; audio is synthesised from ZIN-written scores and recipes; nothing is copied from another mod or from the game | owner decisions | [CONVENTIONS](../CONVENTIONS.md), [01_art_pipeline.md](01_art_pipeline.md) §1, [04_music_and_sound.md](04_music_and_sound.md) §1, decision A9 |
| The start is peaceful: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed | owner-fixed | *The Campaign of 4A 1748* |
| Art never closes an open question: no asset shows Zol or his servants, a New God's face, Afrit's or Aurevan's true face before the reveal, Eindil in an icon, Dardan's place, the arm Eindil loses, Volgan's spirit after his body breaks, or a dwarf, mycid, arcanist or angel | established, from the asset inventory's lore basis | [03_full_asset_inventory.md](03_full_asset_inventory.md) |
| Every family, count, layout, rule, probe and name introduced below | **proposed** | this spec |

The new families add no lore. Template icons show heraldic charges that belong to no country and to no real-world arms; tactic pictures show manoeuvres, never a named figure; no medal, particle or road picture carries a face.

## Decisions applied and one flagged deviation

Applied: A1 to A8 and A9 ([INTEGRATION_DECISIONS.md](../INTEGRATION_DECISIONS.md)), P11 (career profile, ribbons, medals, achievements, wiki button and the officer-corps view are hidden or replaced), P12 and P13 (audio synthesised; the 40 Meshy credits), S10 (builder in the repository), E5 (gated pictures), S12 (tag budget).

**Flagged:** P13 says the 40 credits go to "the Great Wall segment and four building houses". The credit model of the inventory (30 for a static model) lets 40 credits buy one model. This spec spends them on the Great Wall segment and records the four houses as `blocked` (section 8). The integrator should correct P13 or the inventory's credit table.

## Design

### 1. Three ledgers and one graph

| Ledger | File | Says | Written by |
| --- | --- | --- | --- |
| **Plan** | `tools/content/data/art/inventory.json` ([03](03_full_asset_inventory.md) Implementation) | What should exist: one entry per planned asset, with family, gate, priority, wave | `art/inventory.mjs` (new there) and, for the families of section 7, this spec's data |
| **Manifest** | `docs/design/art/asset_manifest.json` (new, published) | What does exist: one record per shipped or kept asset | `modules/assets.mjs` (this spec) |
| **Provenance** | `art/source/provenance.jsonl` (existing) | How each source came to be and who accepted it | `imagegen.mjs`, reviewers |
| **Reference graph** | built in memory, summarised in `docs/design/art/asset_report.json` | What the loaded game files point at | `checks/assets.mjs` (this spec) |

The check compares the graph with the manifest and the manifest with the plan. A mismatch in either direction is a finding.

### 2. The asset manifest

#### 2.1 Record

One JSON object per asset. An asset is one *subject* (one picture, one model, one sound cue, one song) with all its files, sizes and sprite names. Records are sorted by `id`; the file is canonical JSON, so two builds of the same inputs give the same bytes.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | `<inventory id>/<key>` with an optional `/<variant>`: `A1/crown_gold`, `D2/zin_ilvane/state_revealed`, `X1/custom_template_017`. The inventory id is the family (A1 … K, or X1 … X12 below). Unique |
| `family` | string | The inventory id alone (`A1`) |
| `kind` | enum | One of the kinds in 2.2 |
| `subject` | string | The key the content uses (a catalog key, a character id, a tag, a sub-unit key, a tech key, a sound cue name) |
| `files` | array | Per file: `path`, `bytes`, `sha256`, `width`, `height`, `format` (`a8r8g8b8`, `bc3`, `tga32`, `png`, `cur`, `ani`, `mesh`, `anim`, `wav`, `ogg`, `txt`), `mips`, `frames` |
| `sprites` | array | Sprite names that bind these files (`GFX_focus_zin_crown_gold`, `GFX_focus_zin_crown_gold_shine`); empty for convention-bound files |
| `bound_by` | enum | `sprite`, `path_convention`, `entity`, `sound_effect`, `music_asset`, `flag_tag`, `font_asset`, `map_file`, `cursor_name` (section 3) |
| `source` | object | `route` (`imagegen`, `meshy`, `synth`, `derived`, `kept`), `jobs` (job ids), `sheet`, `cell`, `rawSha256`, `review` (the provenance review line's id and sha), `ops` (the module manifest's operation list), `manifest` (the module manifest it came from) |
| `owner_spec` | string | The spec that asks for the asset |
| `people` | array | People keys the asset belongs to (`men`, `elves`, …), or empty |
| `culture` | string | Graphical culture (`zin_<people>_gfx`, or a men tradition), or empty |
| `region` | string | Roster region key, or empty |
| `tier` | enum | `A`, `B`, `C`, or empty (the tier of the country or tree that uses it) |
| `gate` | string | The story flag that gates its use, or empty ([02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md) rule 4) |
| `uniqueness_group` | string | The group in which section 5 compares it (`flag`, `portrait.men.male`, `focus_icon`, `event_picture`, …) |
| `perceptual` | object | `dhash` (64-bit hex), `ahash` (64-bit hex), `luma_mean`; filled by the builder from the shipped pixels; empty for audio and models |
| `state` | enum | `planned`, `generated`, `accepted`, `shipped`, `kept`, `hidden`, `blocked` (2.3) |
| `reach` | enum | `visible`, `conditional` (behind a gate or a rule), `hidden` (the window or feature never opens), `engine` (the engine loads it by itself) |
| `replaces` | string | The vanilla path this file overrides, or empty |
| `inventory_rows` | array | Row ids of `docs/specs/inventory/*.csv` this asset closes (`WE-055`) |

`uses` (how many focuses, events, characters, tags, entities reference the asset) is **not stored**. The check computes it from the graph and writes it to the report, so the manifest never goes stale when content changes.

#### 2.2 Kinds

| Kind | Families | Bound by | Typical path |
| --- | --- | --- | --- |
| `focus_icon`, `idea_icon`, `trait_icon`, `decision_icon`, `decision_category`, `symbol`, `faction_emblem` | A, B | sprite | `gfx/interface/{goals,ideas,traits,decisions,factions}/zin/` |
| `tech_icon`, `tech_folder`, `doctrine_icon`, `equipment_picture`, `unit_icon`, `counter`, `template_icon` | C, X1 | sprite | `gfx/interface/{technologies,doctrines,counters}/` |
| `tactic_picture` | X2 | path convention | `gfx/interface/landcombat/tactics/<picture>.dds` |
| `portrait_large`, `portrait_small` | D | sprite | `gfx/leaders/zin/` |
| `event_picture`, `news_picture` | E | sprite | `gfx/event_pictures/zin/` |
| `loading_screen`, `menu_background`, `frontend` | F | path convention, sprite | `gfx/loadingscreens/`, `gfx/interface/` |
| `ui_chrome`, `ui_panel`, `map_icon`, `stat_icon`, `texticon` | G, H | sprite | `gfx/interface/`, `gfx/texticons/` |
| `flag` | I1, X11 | flag tag | `gfx/flags/{,medium/,small/}<TAG>.tga` |
| `chronicle_plate` | I2 | sprite | `gfx/interface/zin/chronicle/plates/` |
| `cursor` | I3 | cursor name | `gfx/cursors/<name>.{cur,ani,png,ico}` |
| `map_texture` | X5 to X10 | map file, path convention | `map/terrain/`, `gfx/models/supply/`, `gfx/maparrows/`, `gfx/mapitems/` |
| `particle_texture` | X4 | particle asset | `gfx/particles/` |
| `model` | K | entity | `gfx/models/units/zin/<asset id>/` |
| `sound`, `music` | audio | sound effect, music asset | `sound/zin/`, `music/` |
| `font` | engine | font asset | `gfx/fonts/` |

#### 2.3 States

`planned` (in the plan, nothing generated) → `generated` (a raw source exists, not reviewed) → `accepted` (the last review line for its exact bytes says `accepted: true`) → `shipped` (its files are in the staged tree). Three terminal states sit beside the chain:

- `kept`: the file is an engine-generic or still-vanilla asset ZIN refers to and does not replace. Each carries a reason from the `kept` list of the reskin spec ([02_full_ui_reskin.md](../07_interface/02_full_ui_reskin.md) rows `E` and `H`) or from section 7. A `kept` asset with `reach: visible` is a release failure unless it is on the engine-generic list (map shaders, font glyphs, publisher logos).
- `hidden`: the feature is removed or never opens (P11 and the owner specs); the manifest holds a record with no files so the reason is on record.
- `blocked`: the asset needs a resource that is missing (Meshy credits). It names the blocker and the fallback in use.

Only `shipped` and `kept` assets may be referenced by shipped content. A reference to a `planned`, `generated`, `accepted`, or `blocked` asset is a finding.

#### 2.4 Where the data comes from

`modules/assets.mjs` builds the manifest at the end of a build, after every art module has staged its files and written its `art/source/<module>_manifest.json`. It joins, by output path: the staged file, the module manifest line (source, ops, hashes), the provenance review line, the plan entry, and the families' data files. It reads pixels only to fill `width`, `height`, `format`, `mips`, `frames` (DDS and TGA headers) and `perceptual` hashes. It never edits a shipped file.

### 3. The reference graph

The check reads the **loaded set**: every ZIN file in the staged tree, plus every vanilla file that stays loaded (the installed game and its `integrated_dlc/*` and `dlc/*` folders mounted at the same relative paths, minus the folders `replace_path` removes and the files ZIN overrides). It uses the existing `loadedScripts()` of `checks/vanilla_refs.mjs` and extends it to `interface/`, `gfx/`, `sound/`, `music/`, `localisation/` and `portraits/` in a new `lib/loaded_assets.mjs`. The text-sweep scan of [05_text_sweep.md](../07_interface/05_text_sweep.md) reads the same loaded set; whichever spec lands first writes the library and the other imports it.

A reference is a pair (where it is written, what it names). The graph has these edge kinds.

| Edge | Where written | What it names | Resolves when |
| --- | --- | --- | --- |
| Sprite definition | `interface/*.gfx`: `spriteType`, `corneredTileSpriteType`, `frameAnimatedSpriteType`, `progressbartype`, `maskedShieldType`, `textSpriteType` | texture files (`texturefile`, `textureFile1`/`2`, `additionaltexture`, `effectFile`), `noOfFrames` | each file exists in the loaded set; frame count divides the width or height as declared |
| Sprite use in a window | `interface/**/*.gui` (`spriteType`, `quadTextureSprite`, `texture`, `buttonType`, `iconType`, `checkboxType`, `instantTextBoxType` fonts and `clicksound`) | a sprite name, a `bitmapfont` name, a sound effect | a sprite of that name is defined once in the loaded set; the font and sound effect are defined |
| Sprite use in script | `common/**` and `events/**`, `portraits/*.txt`, `history/**` | a `GFX_` name, written out or built by an implicit-name rule (3.1) | as above |
| Entity | `gfx/entities/*.asset`, `*.gfx` mesh blocks | `pdxmesh` → `file` (mesh), `animation` files, `meshsettings` textures, `event = { sound = … }`, `particle` names | each file or name exists; each entity named by a sub-unit's graphical culture exists |
| Sound | `sound/**/*.asset`, `.gui`, entity states, effects `sound_effect`, `scoped_sound_effect`, `play_song` | sound effect → sound → file; song → `music.asset` entry → file | the chain ends in a file |
| Font | `interface/*.gfx` `bitmapfont` → `fontfiles` → `.fnt` → page textures | files | each exists |
| Flag | every tag in `common/country_tags`, every cosmetic tag, every ideology variant | `gfx/flags/<tag>.tga`, `medium/`, `small/` | the base file exists in all three sizes |
| Portrait | `common/characters`, `portraits/*.txt`, `set_portraits` | sprites | resolves as a sprite |
| Cursor | the engine's fixed list of cursor names | `gfx/cursors/<name>.*` | the vanilla list, measured from the install, is fully covered |
| Map file | `map/default.map`, `ambient_object.txt`, `buildings.txt`, terrain tile and border names | files under `map/` and `gfx/models/` | exists; header agrees with its vanilla twin (section 6) |
| Localisation | keys the above name by rule (`<id>`, `<id>_desc`, events' title, desc and option names), `.gui` `text = "KEY"`, `£name` texticons, `[ScriptedLoc]` names | the effective English key set (ZIN files over kept vanilla) | the key has a non-empty value; a `£name` has a `GFX_name` sprite in `texticons.gfx` |

The existence of a texture file is not enough for a vanilla `.gfx` entry: of the top-level `interface/*.gfx` entries in the installed base and DLC, 115 name a texture that exists in no form. Those sprites are dead. The check follows references from loaded windows and script, not definitions, so a dead sprite only fails when something uses it.

#### 3.1 Implicit names

The engine builds many names the files never spell out. The rules live in `tools/content/data/assets/implicit_names.json`, one row per surface:

| Row | Surface | Name built | Silent fallback in the engine |
| --- | --- | --- | --- |
| idea | `common/ideas` `picture = X` | `GFX_idea_X` | the default idea icon (`GFX_idea_unknown`), documented |
| focus | `common/national_focus` `icon = GFX_…`, dynamic `icon` blocks, `<icon>_shine` | the given sprite and `<sprite>_shine` | the default focus icon (`GFX_goal_unknown`), documented |
| decision | `icon`, category `picture` | `GFX_decision_<icon>`, the given `GFX_` name | `GFX_decision_generic_decision` for the icon (measured, defined in `decisions.gfx`); the category picture is optional |
| technology | `common/technologies` id | `GFX_<id>_medium`, `GFX_zin_tech_<key>` | `GFX_technology_medium` (defined as a vanilla vehicle icon; measured) |
| equipment | archetype and variants | `GFX_<id>_medium`, `GFX_archetype_<archetype>_medium` | probe AP1 |
| sub-unit | `common/units` `sprite` | `GFX_unit_<sprite>_icon_medium`, `_medium_white`, `_small` | probe AP1 |
| portrait | `portraits/*.txt`, characters | the given `GFX_` name | `GFX_leader_unknown` |
| event | `picture = GFX_…`, `news` | the given sprite | probe AP1 |
| trait, modifier | unit-leader traits, dynamic modifiers, `GFX_modifiers_<name>` | named sprite | probe AP1 |
| tactic | `common/combat_tactics.txt` `picture = X` | **no sprite**: the file `gfx/interface/landcombat/tactics/X.dds` (measured: of 53 picture names, only three files are named by sprites) | blank picture, probe AP1 |
| division template picture | the designer's picker | `GFX_div_templ_<n>_large`, `_small`, files `custom_template_<nnn>.dds` | none documented |
| unit medal | `common/unit_medals` `icon`, `frame` | the sprite and a frame number | probe AP1 |
| loading screen | engine | `gfx/loadingscreens/load_<n>.dds` | the first screen |
| operation name | `common/names` `prefix`, `operation`, suffix keys | localisation keys | the key text itself |
| flag | tag | `gfx/flags/<TAG>.tga`, `medium/`, `small/`, and `<TAG>_<ideology>.tga` | the base file |

Rows marked "probe AP1" need a Linux fact; the static check does not depend on it, because it flags any reference whose exact name does not resolve, whatever the engine would do next.

#### 3.2 The engine's silent fallbacks

The engine answers a missing idea, focus, portrait or technology picture with a default sprite, and a missing texture with its own placeholder, usually with one log line. The error budget catches the log line only when the run reaches the window. Three safeguards stop a fallback from hiding a miss:

1. **Static.** The check derives the exact name for every use (3.1) and requires it to resolve on its own. A use that would resolve only through a fallback is a finding, `FALLBACK_HIT`. No ZIN file may name a fallback sprite on purpose: the `*_unknown` sprites, `GFX_technology_medium`, `GFX_decision_generic_decision`, and the catalog fallbacks `generic` and `generic_court` after phase 7. A focus never sets `gfx_name_fallback`.
2. **The defaults are Erdae art and are canaries.** The five engine defaults (UI-038: the unknown leader, idea, goal, technology and decision pictures, plus the locked plate) are generated in the reskin spec's G1 family so a fallback never shows vanilla art. With `ZIN_ASSET_CANARY=1` the builder writes loud canary textures (flat saturated colour with a diagonal stripe, no art) at those paths into a staged tree that is **never applied to the mod**; the Linux harness syncs that tree for phase 7 and release runs, and a capture scan counts canary-coloured pixels in every capture. The count must be zero.
3. **The runtime list.** The error log is read for texture, sprite, sound, font and localisation lines (check C6 of the vanilla removal spec); a match on any ZIN path is a failure.

### 4. The completeness check

`tools/content/checks/assets.mjs` runs inside `build.mjs` after the focus compiler (so it sees every staged name) and as a CLI over a staged tree: `node tools/content/checks/assets.mjs <staged> [--phase N] [--report path]`. Findings carry a code, a severity and the path. Severity depends on the phase: before phase 7 a catalog key without art falls back with a warning, as the catalog allows; from phase 7 every row below is an error.

| Code | Rule |
| --- | --- |
| AC1 | The manifest validates against the record schema; ids are unique; `files` paths are unique across records; every `kind` and `state` is in its enum |
| AC2 | Plan and manifest agree: every `inventory.json` entry whose state is `shipped` has a record; every record has an inventory entry or is `kept`; the family totals match [03](03_full_asset_inventory.md) §6 plus section 8 here, or this spec is updated in the same commit |
| AC3 | **Sprites.** Every sprite named by a loaded window or script is defined exactly once and its texture files exist with a matching frame count. A name defined twice in the loaded set is a finding (the engine logs it), except the reviewed overrides of a vanilla name |
| AC4 | **Implicit names and path conventions** (3.1): every derived name or path resolves; tactic pictures, flags, loading screens, cursors and division template pictures resolve by file |
| AC5 | **Entities.** Every `common/units` sub-unit whose graphical culture has no entity of the right name resolves to a ZIN entity or to a recorded fallback; no ZIN sprite or entity points at a vanilla unit entity; every `pdxmesh`, `animation` and `meshsettings` file exists; every state an entity plays has an animation; no entity names a forbidden vanilla sound effect ([04_music_and_sound.md](04_music_and_sound.md) check 6) |
| AC6 | **Sound and music.** Every sound effect used by a window, entity or script is defined; its sounds exist as files; every `play_song` and `music` name is defined; every ZIN sound effect is in a category |
| AC7 | **Localisation.** Every key reached by 3.1's rules and by `.gui` text has a non-empty value in the effective English set; no `£name` lacks its sprite; encoding rules of CONVENTIONS hold. Banned words and wording belong to the text scan |
| AC8 | **Fonts and cursors.** Every `bitmapfont` a loaded window uses is defined once; its `.fnt` and page textures exist; ZIN defines no new font. Every one of the vanilla install's cursor names is covered, and at the release every one is ZIN-authored |
| AC9 | **Flags and portraits.** Every tag, cosmetic tag and dynamic tag in `common/country_tags` and `common/countries/cosmetic.txt` has `TAG.tga` in all three sizes with the sizes of section 6; no flag file exists for an undefined tag; every portrait sprite a character or the portrait database names resolves to a file of 156 × 210 (large) or 65 × 67 (small) |
| AC10 | **Fallback hits** (3.2). None |
| AC11 | **Orphans.** Every file ZIN ships under `gfx/`, `interface/`, `sound/`, `music/` and `map/` is reached by the graph, or is on the **bound list** (`tools/content/data/assets/bound.json`: files the engine loads by path with no script reference, each with the reason: flags by tag, cursors, loading screens, map textures named by `default.map`, glyph pages), or is a reskin of a vanilla path (then `replaces` is set). Any other shipped file fails, and so does a `.gfx` sprite no window or script uses (with an allow list for reviewed spares) |
| AC12 | **Headers.** Every shipped texture's DDS or TGA header matches the format table of section 6 and, for a `replaces` file, the measured vanilla header: size, frames, format class, mip count. For a flag, three sizes |
| AC13 | **Extension twins.** No path stem exists with two image extensions in the loaded set, except the vanilla files the 125-sprite rule of section 6 lists |
| AC14 | **Provenance.** Every `accepted` or `shipped` image has a review line for its exact bytes; no `source.route` is `imagegen` with a reference outside `art/source/`; `private:` references only for allowed subjects; no shipped file equals the installed vanilla file at its path (art pipeline checks 2 to 4 and 7, extended to every module) |
| AC15 | **Gates.** Every `gate` is respected: a gated asset is used only by content that cannot show before the flag (compiler rule 4, extended to portraits and pictures in events fired by mechanics); no start-reachable file names an Eindil portrait or Afrit's third and fourth portraits |
| AC16 | **Uniqueness** (section 5) |
| AC17 | **Budgets.** Meshy spend per asset is recorded with task ids and the total does not exceed `meshy_budget.json`; no `blocked` asset is referenced; a release has no `planned` or `generated` asset in a release-core family |
| AC18 | **Hidden means hidden.** No visible window or reachable script references an asset whose state is `hidden`; hidden-feature windows are listed in the reskin spec's `H` rows and each is confirmed by the Linux click-through |

Output: `docs/design/art/asset_report.json` (canonical JSON): per family and state the counts, per finding code the list, the reuse histogram (section 5), the placeholders, the fallback hits, the orphans, and the `kept` list with reasons. A human summary prints to stdout. The check caches file hashes in `$ZIN_ART/cache/assets-check.json` keyed by sha256, so a rebuild that changes few files re-reads few; the target is a full run in under a minute on about 6,000 files.

**Read-only.** The check never writes a game file. It writes only the report.

### 5. Uniqueness rules

A2 of [PROGRAM.md](../PROGRAM.md) says nothing generic or reused may stand where it should be unique. A rule per family says what *may* be shared and how often. The caps are design targets (proposed); the report prints the real histogram and the spec records the final numbers when the data exists.

**Measurement.** Three measures, all computed from the shipped pixels (or bytes) by `lib/phash.mjs` (new):

- **Exact:** equal sha256 of the decoded pixels or bytes. Two different assets with equal pixels fail, in any family, unless the table below allows an alias.
- **Perceptual:** a 64-bit difference hash (grey, 9 × 8) and a 64-bit average hash. The distance is the larger of the two Hamming distances. Two assets in one group closer than the group's threshold are flagged `NEAR_DUPLICATE`.
- **Usage:** the count of content uses in the graph, per asset, per tree, per country, per namespace.

| Family | Group | May be shared | Maximum reuse | Perceptual threshold |
| --- | --- | --- | --- | ---: |
| Flags (I1, base 305 + 13 cosmetic + 75 dynamic) | `flag` | Never. One flag per tag. Declared **sibling sets** (a Concord charter family; the Free Dominions) may share a charge, not a field | sets of at most 3 | 10 of 64 |
| Portraits, named (D1 to D6) | `portrait.named` | Never. One image per character per state | 1 | 14 |
| Portraits, generic pools (D7, 270) | `portrait.<culture>.<sex>.<role>` | Between countries of the same culture and sex, never across cultures and never with a named character | a portrait may serve at most `ceil(start slots ÷ pool size) + 1` characters at the start; **never twice in one country's start roster** | 12 |
| Focus icons, catalog (A1) | `focus_icon` | Across trees | one key on at most 2 focuses of a tree (3 in a shared tree); at most 40 focuses in the game; **never on a focus and its direct prerequisite**; a two-face focus uses two different keys | 12 |
| Focus icons, signature (A2) | `focus_icon.signature` | Never | 1 | 12 |
| Idea icons (A1, A3) | `idea_icon` | Across countries | two spirits shown together in one country share a picture at most once; people ideas unique | 12 |
| Trait icons (A4) | `trait_icon` | Never | 1 | 10 |
| Decision category pictures (B1) | `decision_category` | Never; `generic` has no users at release | 1 | 12 |
| Decision icons (B2) | `decision_icon` | Across categories | at most 15 decisions; at most 2 in one category | 8 |
| Technology icons (C1), doctrine icons (C3) | `tech_icon`, `doctrine_icon` | Never | 1 | 10 |
| Equipment pictures (C4) | `equipment_picture` | The `_0`/`_1` pair of a look may share art with a tint-free crop; looks differ | 1 per look | 10 |
| Sub-unit icons and counters (C5), template icons (X1), medal strips (X3) | `unit_icon`, `template_icon`, `medal` | Never; the second frame is its own cell | 1 | 8 |
| Event pictures (E1 to E3) | `event_picture` | Across events of different chains | at most 8 events in the game; at most 3 for a tier A story event; **no two events one step apart in a chain share a picture** | 12 |
| Loading, menu, chronicle plates (F1, F2, I2) | `scene` | Chronicle plates may crop an event picture (30 allowed, recorded in `replaces`-free `source`) | 1 | 14 |
| Cursors (I3) | `cursor` | Never; animated frames are distinct cells of one glyph | 1 | 6 |
| Tactic pictures (X2) | `tactic_picture` | Two tactics may name one picture only when the warfare data says so (two do today) | as the data says | 8 |
| People unit looks (K) | `unit_look` | A mesh may serve two peoples **only** if their diffuse textures differ (distance at least 16) and their entity `scale` or attachments differ; the recorded P13 fallback is exactly this | one mesh, at most 2 peoples | 16 on diffuse |
| People building looks (24 optional models, vanilla geometry kept until then) | `building_look` | One house family may serve two graphical cultures with different textures | 2 cultures | 16 on diffuse |
| Sounds and cues (audio) | `sound` | Never; variants of one cue differ by seed | 1 | byte-distinct |
| Music | `music` | Never | 1 | score-distinct |
| Terrain tiles (X6), border strips (X7), tree sets (X10), particle textures (X4), road textures (X5) | `map_tile` | Never; mip levels of one tile share their source | 1 | 10 |

**Per-people looks.** "Per-people building and unit looks" means each of the ten peoples has a distinguishable look at release. The check builds the matrix (people × {foot, mounted, siege, ship, building}) of (mesh hash, diffuse hash) and fails an empty cell and a repeated pair. While a people borrows a model (the five pilots serve ten peoples), its diffuse texture, scale and counters must differ from the model's owner; the matrix is printed.

**Generic pool balancing.** The characters builder assigns generic portraits by a seeded round robin over the pool of the character's culture and sex, so the spread of uses at the start is at most 1. The check recomputes the spread and the same-country rule from `common/characters`.

### 6. Formats and conversion

Measured from the installed game on 19 October 2026, and as shipped. The art pipeline's table (§5) stays the authority for the families it lists; this table adds the map-space and engine-bound files.

| Asset | Size | Format | Mips | Note |
| --- | --- | --- | --- | --- |
| Interface sprites, icons, portraits, pictures | as each family | DDS uncompressed A8R8G8B8 (`dds()`) | 1 level | Matches vanilla defaults (the unknown goal 94 × 76, unknown idea 63 × 63, unknown leader 156 × 210, the template icons 76 × 42 and 30 × 12 are all uncompressed, single level) |
| Flags | 82 × 52, 41 × 26, 10 × 7 | TGA 32-bit (`tga()`) | — | Base file only; no ideology variants are shipped (the engine falls back to the base file; probe AP5 confirms) |
| Tactic pictures | 89 × 47 (measured); overlay 85 × 43 | DDS A8R8G8B8 | 1 | By file name, no sprite |
| Terrain atlas, diffuse and normal | `atlas0` 2048², `atlas1` 1024², `atlas2` 512²; `atlas_normal0..2` the same | BC3 (DXT5) | `atlas0` and `atlas_normal0`: full chain (10 levels); levels 1 and 2 are separate files with one level each | 4 × 4 tiles of 512, 256, 128 px. The tile index bound by `common/terrain` and the terrain palette ([map plan](../01_map/04_map_overhaul_plan.md)) is unchanged |
| Border lines | `_0` 256 × 128 (country), 128 × 64 (state); `_1` half; `_2` quarter | uncompressed 32-bit for country, BC3 for state; each style as measured | `_0` file carries the chain (9 and 8 levels); `_1`, `_2` one level | 18 files: 6 styles × 3 |
| Road texture | `railroad.dds`, `railroad_damaged.dds` 64 × 320 | uncompressed 32-bit | full chain (9) | The shader file `railroad.shader` is never touched (a wrong shader crashes the main menu) |
| Map arrow patterns and masks | per file | as measured (often uncompressed, single level) | as measured | Masks are kept (the alpha shape drives the line) |
| Particle textures | 128² to 512² | BC3 | full chain | Reskin by path, same size |
| Colour map, water colour, fog-of-war specular | map-sized | BC3 | full chain | Tool-computed by the map pipeline; this check only reads the header |
| Cursors | 32 × 32 | `.cur` (hotspot from the vanilla header), `.png`, `.ico`, `.ani` for the animated ones | — | [02_full_ui_reskin.md](../07_interface/02_full_ui_reskin.md) §4.10 |
| Meshes and animations | — | `.mesh`, `.anim` from the Meshy route | — | art pipeline §7 |
| Sound and music | — | per [04_music_and_sound.md](04_music_and_sound.md) §5 | — | — |

**Conversion rules.**

1. **Same shape as the vanilla twin.** A file that replaces a vanilla path has the same width, height, frame count, format class and mip count. The vanilla header is read at build time (never copied); the measured values live in `tools/content/data/assets/formats.json`.
2. **Mip chains** are cut by code with a box filter from the shipped level 0; this is a conversion, not new art.
3. **BC3 encoding** uses a pure-JavaScript encoder, `lib/bc3.mjs` (new): range-fit endpoints on 4 × 4 blocks, alpha block by min/max interpolation, no random choice, so a rebuild is byte-identical. If the encoder is not ready for a wave, the file ships uncompressed with the same mip chain and the manifest records `format: a8r8g8b8` and the size cost; the atlas and its normals then cost about 60 MB, which is why the encoder is in wave 3 (proposed).
4. **Seamless tiling** (terrain tiles, border strips, road, tree textures, particle clouds): the model's output is cross-faded at its opposite edges (an overlap of one eighth of the width) before the resize. This composites generated pixels onto generated pixels; it is read as a conversion on the same footing as gauge compositing (art pipeline §4; OPEN_QUESTIONS, interface 7).
5. **Normals** for terrain tiles and trees are derived from the tile's luminance with a Sobel filter and a fixed strength; the specular or gloss channel follows the measured vanilla convention recorded in `formats.json`. Derived files are `source.route: derived`.
6. **The 125 sprites.** The interface inventory counts 125 vanilla sprites that name a `.tga` or `.png` file which exists only as `.dds`. A rescan of the base and DLC `interface/*.gfx` finds 122 entries over 113 distinct paths (61 `.png` and 61 `.tga`); `formats.json` stores the list the build measures, and the count here is a floor. The engine resolves such a name by another extension. ZIN follows three rules: (a) a ZIN sprite always names the exact extension of a file that exists; (b) a ZIN file that replaces one of those textures is shipped as the real file (`.dds`), never under the name the sprite spells; (c) no stem exists under two extensions anywhere in the loaded set (AC13). Which extension wins when both exist is probe AP3. The spec-03 mention of `country_selection_bg` as TGA is wrong: the installed file is DDS, and the shipped file is DDS.

### 7. The unplanned families

Every item the inventories flagged as unplanned gets a decision, a count, a route and a family id. New family ids are `X1` to `X12`; new layouts continue the inventory's L1 to L17 as L18 to L20 (table in 8.1). The integrator merges them into [03_full_asset_inventory.md](03_full_asset_inventory.md) as a family X.

| Id | Item (inventory rows) | Decision | Count | Route | Calls |
| --- | --- | --- | ---: | --- | ---: |
| **V** | Unit voice lines (WE-083, MA-113): 2,268 wav in 26 country folders | **Silence.** ZIN ships no voice file and no voice sound effect. Voices are bound by the engine to country-coded effect names (`<TAG>_infantry_idle`, `_move_out`, `_neutral_combat`, `_positive_combat`, `_retreat`); no ZIN tag has a set, so nothing plays. Wordless shouts already live in the unit sound states (music spec §4.2, `attack`). Synthesised barks are not made: a bark per tag would need 305 × 5 effect names, and a spoken-style bark would imply an invented tongue (music spec question 4) | 0 | — | 0 |
| X1 | Template icons (WE-055): `custom_template_000…` | Reskin by path, 101 pairs from the base game and 21 pairs mounted by DLC (122 pairs, 244 files; sprites `GFX_div_templ_<n>_large` 76 × 42 and `_small` 30 × 12 keep their names). Heraldic charges (beasts, tools, weapons, plants, stars, ships, towers), none tied to a country, people or real-world arms; each charge reads at 30 × 12. The small file is a centred crop of the same cell. All 122 are distinct (section 5) | 122 pairs | imagegen, L5 cells; `derived` small | 11 |
| X2 | Tactic pictures (WE-067): 57 files, 55 tactics, 53 picture names | The picture of every tactic that remains after the warfare override (55 − 3 = 52 tactics), at 89 × 47, by file name `gfx/interface/landcombat/tactics/<picture>.dds`; plus `no_tactic` and `countered_tactic_overlay` (85 × 43, a chrome overlay, generated with X1's style). The build computes the exact picture set from the staged `combat_tactics.txt`; the budget below is the upper bound. Manoeuvres are drawn as banners, spear lines and shield walls, never as a named figure. The two vanilla files no tactic names (`flank`, `hold_bridge`) are not reskinned and are never reachable | up to 55 | imagegen, L5 | 5 |
| X3 | Medals and ribbons (WE-145, PS-113, PS-114, PS-115) | By P11, the career profile, its 33 medals (`common/medals`) and 36 ribbons are **hidden**: no art, state `hidden`, owner [06_career_honours.md](../07_interface/06_career_honours.md). **Unit medals** (103 in `common/unit_medals`) are different: they show in unit and leader tooltips. This spec reserves art for the honours that spec writes: 4 icon strips (`GFX_medal_icon_zin_light`, `_dominion`, `_shadow`, `_wild`) of 6 frames. If the honours spec drops unit medals, the reservation is released | 24 frames | imagegen, L6 | 1 |
| X4 | Particles (WE-080, MA-086, MA-098, MA-099) | Nature effects stay engine-generic (fire, smoke, dust, snow, rain, mist, water foam, ship wake, waterfall). Modern effects are **reskinned by path**, never redefined: the texture file keeps its name, size, format and mips, so every particle definition and entity keeps working, and no vanilla `.asset` is copied or overridden. Textures to reskin (proposed, final list measured by reachability over `particle_repository.txt` into `data/assets/particles.json`): `muzzle_flash`, `cartridge`, `tracer_round`, `bomb`, `tyre_tracks`, `blood_splat1`, `blood_splat2`, `propeller`, `shoe_hoi`, `skull_hoi`, `helm_white`, `target`. They become spark burst, splinter, arrow streak, thrown stone, hoof marks, dust smear, wing beat, ember, glint, spell glow. Effects ZIN content never triggers (air drop, paradrop, leaflets, nuclear, raids, search lights, air raids) stay unreferenced and are listed `kept`, `reach: engine`, with the reason; probe AP4 confirms none plays | 12 | imagegen, L6; BC3 with mips | 1 |
| X5 | Railway and roads (WE-132, MA-017, MA-092) | `railroad.dds` and `railroad_damaged.dds` become a road with ruts, stones and wheel marks (intact; broken). The six railway pattern files in `gfx/maparrows/` are the same two pictures rotated and resized. Trains: the database `gfx/train_gfx_database/generic.txt` stays; ZIN adds `zin_trains.txt` with wagon data for a **wagon train**. The model is the Meshy asset `zin_wagon_train` (K, 30 credits, blocked). Until then, the zero-credit fallback chain is tried in order and recorded: (1) a column of the pilot infantry entity walking in file, scaled, as `zin_pack_train_entity`; (2) the engine's invisible `gfx/models/empty.mesh`. Which one works is probe AP6. The shader is not touched | 2 pictures | imagegen, L8 single | 2 |
| X6 | Terrain atlas tiles (MA-029) | 16 seamless tiles, 4 sheets of 4 (layout L18, 627 px cells, resized to 512, 256, 128); normals derived. The tile set follows the geography model's ground types: plain, farmland, steppe, forest floor, hill, mountain rock, snow, ice, marsh, desert sand, red desert, ash, volcanic rock, salt flat, river silt, rubble (proposed; the map plan owns the final list and the index map). Existing tile indices keep their slots | 16 | imagegen, L18; derived normals | 4 |
| X7 | Border sheets (MA-030) | Six line styles (country, state, province, sea, sea region, impassable) as ink and brass lines: country a heavy double ink line with a brass tick, state a single ink line, province a thin dotted line, sea a wave-crest line, sea region a long dash, impassable a hatched rampart line. Layout L19, one strip per cell, cross-faded for tiling, three files each | 6 strips, 18 files | imagegen, L19 | 1 |
| X8 | Map arrow patterns (MA-051) | 44 non-mask files in `gfx/maparrows/`, 6 of them railway (X5). The other 38 come from 18 generated patterns (banner thread for army-group lines, spear line for offence, shield line for defence, ford marks, courier trail, supply pack line, trade caravan line, intelligence trail, fleet area ribbon, and so on; thin/thick variants are resizes). The 44 masks are **kept** as engine-generic shapes. Layout L20, four strips per sheet | 18 patterns | imagegen, L20 | 5 |
| X9 | Map items (MA-052): `capital.tga`, `flag_frame.tga`, 11 move arrows, `arrow.dds` | A gilt tower, a flag frame, and arrows in bronze (move), cinnabar (attack) and verdigris (support), same sizes and alpha shape as the vanilla twins | 14 | imagegen, L6 | 1 |
| X10 | Tree textures (MA-095): `gfx/models/mapitems/trees/` 48 files | Meshes are engine-generic shapes and stay; textures are reskinned by name in 6 sets (silver ash, black pine, grove oak, savanna acacia, palm grove, dead wood), same sizes, normals derived. Real Earth species names are never shown (no text names a tree file) | 6 sets | imagegen, single 1:1 | 6 |
| X11 | Dynamic-tag flags (I1 extension) | The 75 dynamic tags D01 to D75 have no flag in the installed game either; what the engine shows for a flag-less dynamic tag is probe AP5. The proposal ships 75 flags (three sizes) so a civil war never shows a blank | 75 | imagegen, L1 | 5 |
| X12 | Modifier icons (UI-145, PS-085): 22 dynamic-modifier sprites and 50 textures | One icon per modifier ZIN can show in an idea, tooltip or modifier list, measured by the check as the set of `GFX_modifiers_*` and dynamic modifier icons the staged mod and the kept vanilla files reach. About 50; icons that no ZIN script can reach stay unreferenced | about 50 | imagegen, L6 | 2 |
| — | Default sprites (UI-038), engine defaults | Art is the reskin spec's G1 (5 cells). Safeguard: section 3.2 | 5 | G1 | in G1 |
| — | Fonts (MA-057, UI-041, UI-042) | Engine-generic: vanilla glyph pages and faces, no new font. The typewriter alias of the reskin spec §3.7 is its call. The check requires every used `bitmapfont` name to resolve once | 0 | — | 0 |
| — | Cursors (MA-071, UI-046) | Art and module belong to the reskin spec (`ui_cursors.mjs`, 60 names, 126 files). Check AC8 | 60 | G1-level, I3 | in I3 |
| — | Ambient objects (MA-022) | `map/ambient_object.txt` holds ambient water and wind entities again (their sound effects `ambient_ocean` and `amb_neutral_wind` stay vanilla, music spec §2.3) and the ZIN frame without the game logo; the Great Wall landmark is the Meshy asset `zin_landmark_great_wall_section` (30 credits, the 40 held credits); the vanilla `chinese_wall` and `landmark_great_wall_section` never ship or load. Until the model exists the entry is `blocked`, the file places no wall entity, and the Wall is carried by terrain and forts | 1 model | Meshy | 0 |
| — | Weather, combat ambience, destruction sounds (MA-110, MA-111, MA-112) | Weather stays vanilla (engine-generic) until a synthesised set passes review. Combat ambience: 8 layered loops (shield wall, horns, hooves, bow volleys, siege engines, ship timber, night camp, rout). Destruction: 10 effects (timber crash, stone fall, siege impact, fire roar, tower collapse, gate burst, wall breach, burning thatch, ship breaking, ram blow). Both are recipes in `sounds.json`, route S | 18 | synth | 0 |
| — | Aces, scientists (MA-064, MA-066) | Scholars and artificers use the generic portrait pools (D7; PS-037). Aces are tag-bound: `common/aces` entries are allowed only for vanilla tags and ZIN tags have none, so none appears. A build check asserts no ace entry is allowed for a ZIN tag. No art | 0 | — | 0 |
| — | Famous ship illustrations (WE-081) | Removed: tag-keyed real warships; the pride-of-the-fleet slot shows the unit sprite. Probe AP7 confirms none shows | 0 | — | 0 |
| — | Battle plan names (WE-066): 432 keys in `battleplan_codenames_l_english.yml` | Operation names are engine-built from `common/names`: each block has a `prefix`, `operation = { <strategic region id> = { keys } }` and suffix keys, with `use_geographical_default_operation_names = yes`. ZIN generates **312 keys**: 60 shared stems (key 0 of every block), 24 stems for each of the 10 peoples, and 12 prefix and suffix keys, in Erdae terms (banners, hosts, roads, rivers, hills, weather, beasts; the Erdae prefix replaces the engine word for an operation). Region names come from the strategic region names the map pipeline writes. `modules/names.mjs` writes the blocks; the same-name localisation file is overridden with ZIN keys only. Data: `tools/content/data/assets/battleplan_names.json`. Check AC7 covers every key | 312 keys | text | 0 |

**Hidden-feature art ledger.** These rows get no art because their owner specs hide the feature. Each becomes a `hidden` record, and AC18 confirms nothing visible reaches them.

| Rows | Feature | Owner |
| --- | --- | --- |
| MA-077, PS-057, PS-056, MA-125, PS-178, UI-022, UI-133 | Career profile pictures and backgrounds, playthrough statistics (P11) | [06_career_honours.md](../07_interface/06_career_honours.md) |
| WE-143, PS-025 | Officer Corps and academy spirits | [08_institutions.md](../03_gameplay/08_institutions.md) |
| UI-106, UI-108, WE-152, WE-179 | Military-industrial organisations and raids windows, except as the economy and warfare specs keep them | economy, warfare |
| WE-106, WE-108 | Licences and the international market, except as the economy spec keeps them | economy |
| MA-114, MA-115, MA-116 | Award, pistol, placeholder and DLC sound packs | music and sound |

### 8. Budget and routes

#### 8.1 Layouts added

| Id | Canvas | Grid | Cells per call | Cell | Ground | Used for |
| --- | --- | --- | ---: | --- | --- | --- |
| L18 | 1254 × 1254 (1:1) | 2 × 2 | 4 | 627 × 627 | black | terrain tiles |
| L19 | 1536 × 1024 | 2 × 3 | 6 | 768 × 341 | black | border strips |
| L20 | 1536 × 1024 | 1 × 4 | 4 | 1536 × 256 | black | map arrow patterns |

#### 8.2 Generation budget

Counts of the inventory families are taken from [03_full_asset_inventory.md](03_full_asset_inventory.md) §6 and §7; this spec adds only the X rows.

| Group | Subjects | Base calls | Route | Wave |
| --- | ---: | ---: | --- | --- |
| A Icons | 774 | 65 | imagegen | 2 and 6 |
| B Decisions and symbols | 168 | 9 | imagegen | 2 |
| C Warfare | 524 (+20 conditional) | 59 | imagegen | 3 |
| D Portraits | 518 | 123 | imagegen | 2 and 6 |
| E Events | 178 | 178 | imagegen | 4 and 6 |
| F Frontend | 44 | 40 | imagegen | 1 |
| G Interface | about 479 | 70 | imagegen | 1 and 4 |
| H Map and stats | about 117 | 5 | imagegen | 1 and 3 |
| I Flags, Chronicle, cursors | 211 | 114 | imagegen | 3 and 6 |
| J Meshy inputs | 46 (+24) | 46 (+24) | imagegen | 5 |
| **Inventory total** | about 3,000 + 46 inputs | **709** | | |
| X1 to X12 (section 7, sums) | about 400 | **44** | imagegen | 3, 4, 6 |
| **All** | about 3,400 + 46 inputs | **753** | | |

With the pipeline's retry allowance (one extra call in four) the total is about **940 calls**. Shipped files rise from about 5,000 to about 5,700.

| X row | Calls | | X row | Calls |
| --- | ---: | --- | --- | ---: |
| X1 template icons | 11 | | X7 border sheets | 1 |
| X2 tactic pictures | 5 | | X8 map arrow patterns | 5 |
| X3 medal strips | 1 | | X9 map items | 1 |
| X4 particle textures | 1 | | X10 tree textures | 6 |
| X5 road pictures | 2 | | X11 dynamic flags | 5 |
| X6 terrain tiles | 4 | | X12 modifier icons | 2 |

#### 8.3 Other routes

- **3D (Meshy).** 34 unit assets and 6 attachments as the inventory lists; the minimum set (assets 1 to 9) needs 433 credits and the balance is 40 (OPEN_QUESTIONS 16: hold). New 3D rows from this spec: `zin_landmark_great_wall_section` (30), `zin_wagon_train` (30), and the four house models (4 × 30, `blocked`, vanilla house geometry stays as the one recorded exception until they exist). The 40 credits go to the Great Wall segment.
- **Audio (synthesis).** Per [04_music_and_sound.md](04_music_and_sound.md): 38 tracks (12 first release), about 202 interface effects (25 core first), the unit state sets, 8 story cues; plus section 7's 8 combat loops and 10 destruction effects. All are recipes and scores in `tools/content/data/audio/`, rendered by `modules/music.mjs` and `modules/sound.mjs`. The manifest lists them with `route: synth` and a `recipe` pointer in `source.jobs`.
- **Tool-computed (no model).** Colour map, water colour, fog-of-war specular, normals, LUTs, tree season and tint ramps: the map pipeline ([04_map_overhaul_plan.md](../01_map/04_map_overhaul_plan.md)) writes them; the manifest records them as `derived`.

### 9. The generation queue

Measured on 19 October 2026 from `art/source/provenance.jsonl`: 181 generation lines with timings, mean 45 s per call (median 47, range 21 to 74), 8 layout rejections among 177 checked (4.5%). Sequential, 940 calls take about 11.8 hours. The queue cuts that to a few hours by overlapping calls, by filling every sheet, and by regenerating only what failed.

1. **Queue file.** `art/queue.mjs` (new) reads the plan, takes every `planned` entry, groups entries by layout and ground, and writes ordered jobs into `$ZIN_ART/jobs/queue-jobs.json`. Order: wave, then family order of the inventory, then tier (A, B, C), then key. A key no built content uses is skipped.
2. **Fill sheets across families.** Entries of different families that share a layout, a ground and a style (for example the A2 signature icons, the A3 idea icons and the B3 symbols) fill one sheet together. The cell map records the family per cell. The last sheet of a family takes the next family's first cells instead of leaving blanks. Single-subject kinds (scenes, tier A portraits) stay one per call.
3. **Concurrency.** `imagegen.mjs` gains `--concurrency N` (default 3). A shared token bucket spaces call starts; the existing backoff on 429 and 5xx stays (30 s doubling to eight attempts). Provenance lines are appended through one writer so lines do not interleave. Concurrency 3 is a proposal; the first wave measures the real limit and raises or lowers it. At 4 in parallel the 940 calls take about 3 hours.
4. **Idempotence and resume.** A job id is a hash of (layout, ground, keys in cell order, prompt text). A finished job whose layout check passes is skipped. A killed run resumes without repeating.
5. **Repair sheets.** A cell the review rejects goes into a **repair sheet**: rejected cells of one layout from any family are regenerated together in one call, with their own prompts, and re-sliced into the same output slots. A bad cell costs a quarter of a call on average, not a whole sheet. The review line names `supersedes`.
6. **Review in parallel.** Contact sheets (`preview.mjs`) are built per four sheets as they land; the agent review runs while later calls generate; owner-approval groups are collected into one contact set per group at the end of a wave.
7. **Fail fast.** Three failed layout checks stop that job only; the queue continues and prints the stuck list at the end.
8. **Build after generation.** `build.mjs` re-slices only changed sources (content hash), so a wave's art enters the next build without a full re-slice.

## Implementation

### Builder module and check

| Path | State | Content |
| --- | --- | --- |
| `tools/content/modules/assets.mjs` | new | Builds the manifest; stages the files of the X families (the art itself is cut from accepted sources, with the same method as `modules/presentation.mjs`); writes `art/source/assets_manifest.json` (its own module manifest, A8), `docs/design/art/asset_manifest.json`, the train database and ambient object files, and the reservation records of section 7; runs after the art modules and before the vanilla-removal bridge scan |
| `tools/content/checks/assets.mjs` | new | AC1 to AC18; also a CLI; negative tests in `assets.test.mjs` |
| `tools/content/lib/loaded_assets.mjs` | new | The loaded set for `gfx`, `interface`, `sound`, `music`, `localisation`, `portraits` (extends `loadedScripts()`) |
| `tools/content/lib/asset_schema.mjs` | new | Strict record schema (unknown fields are errors), like `focus_schema.mjs` |
| `tools/content/lib/phash.mjs` | new | dHash, aHash, luma mean from decoded pixels with `sharp` (pinned) |
| `tools/content/lib/bc3.mjs` | new | Deterministic BC3 encoder, mip chain, header writer |
| `tools/content/lib/dds_info.mjs` | new | DDS and TGA header reader used by the check and the tests |
| `tools/content/art/queue.mjs` | new | Section 9 |
| `tools/content/art/x-jobs.mjs` | new | Job writer for the X families (prompts follow the A4 clause and the family style lines) |
| `tools/content/imagegen.mjs` | extended | `--concurrency`, one provenance writer, repair-sheet jobs |
| `tools/content/modules/names.mjs` | extended | Operation name blocks from `battleplan_names.json` |
| `tools/content/modules/units3d.mjs` | extended | Entity sound events point at the audio module's names; the pack-train entity (AP6) |
| `tools/content/assets.test.mjs` | new | Tests of the check and the manifest |

### Data files

| Path | Content |
| --- | --- |
| `tools/content/data/art/inventory.json` | The plan (owned by the inventory spec) |
| `tools/content/data/assets/implicit_names.json` | 3.1 |
| `tools/content/data/assets/bound.json` | Files the engine loads by path, with reasons |
| `tools/content/data/assets/formats.json` | Measured vanilla headers for every replaced path; the 125-sprite list |
| `tools/content/data/assets/uniqueness.json` | The table of section 5: groups, thresholds, caps, sibling sets |
| `tools/content/data/assets/particles.json` | Particle textures: path, class (`nature`, `reskin`, `unreachable`), reason |
| `tools/content/data/assets/kept.json` | Every `kept` asset with reason and `reach` |
| `tools/content/data/assets/battleplan_names.json` | 3.1's operation stems per people |
| `tools/content/data/assets/x_cells.json` | Cell maps of the X sheets (like `presentation-cells.json`) |
| `tools/content/data/art/meshy_budget.json` | Credits per 3D asset (owned by the inventory spec) |

### Files written to the game

`gfx/interface/counters/division_templates_large/custom_template_<nnn>.dds` and `division_templates_small/` (X1); `gfx/interface/landcombat/tactics/<picture>.dds`, `no_tactic.dds`, `countered_tactic_overlay.dds` (X2); `interface/zin_medals.gfx` and `gfx/interface/medals/zin_*.dds` (X3); `gfx/particles/<name>.dds` at vanilla paths (X4); `gfx/models/supply/railroad.dds`, `railroad_damaged.dds`, `gfx/maparrows/railway_pattern*.dds`, `gfx/train_gfx_database/zin_trains.txt`, `gfx/entities/zin_trains.asset` (X5); `map/terrain/atlas*.dds`, `atlas_normal*.dds` (X6); `map/terrain/border_*_<0..2>.dds` (X7); `gfx/maparrows/*_pattern.dds` and the other pattern files (X8); `gfx/mapitems/*` (X9); `gfx/models/mapitems/trees/*.dds` (X10); `gfx/flags/D<nn>.tga` and `medium/`, `small/` (X11); the modifier icon files and `interface/zin_modifiers.gfx` (X12); `map/ambient_object.txt`; `common/names/zin_names.txt` operation blocks and `localisation/english/battleplan_codenames_l_english.yml` (override, ZIN keys only).

### Identifiers

Listed in "Names this spec registers". Crash and error risks, from the inventory notes and the wiki:

- `railroad.shader` is never shipped or edited; a wrong shader crashes the main menu.
- A replaced `.gfx` or texture keeps its path, size and frame count; a changed frame count breaks `buttonstate` shaders.
- A particle texture is replaced by path only; no vanilla `.asset` is overridden, because an override that drops entities breaks every effect.
- `map/buildings.txt` must define every naval base and floating harbour; the map pipeline owns it. This spec's check only asserts the file is non-empty.
- Never `replace_path` `gfx/interface` or `interface`; the 115 dead vanilla sprites would stay harmless only while nothing uses them.
- Duplicate `bitmapfont` names and a missing `_shine` sprite log or fail (interface inventory). AC3 and AC8 catch both.

### Variables, events, game rules, defines

None.

## AI

None.

## Acceptance

Checks a build test or the isolated Linux run can decide.

1. **Manifest.** `asset_manifest.json` exists, validates, is byte-identical across two builds (determinism test), and every `shipped` record's files match their header facts (AC1, AC12).
2. **Completeness, offline.** On the full staged mod the check reports zero AC3 to AC13 errors from phase 7. Before phase 7 the only warnings are catalog keys without art that fall back. Each rule has a negative test: an undefined sprite; a sprite whose texture is missing; a wrong frame count; an implicit-name miss (an idea whose picture has no `GFX_idea_` sprite); a tactic picture with no file; a sub-unit with no entity; a `pdxmesh` with no mesh file; a sound effect with no sound file; a localisation key with no value; a flag missing in one size; a portrait of the wrong size; a `FALLBACK_HIT` (a focus naming an `_unknown` sprite); an orphan texture; a `.tga` and `.dds` twin; a vanilla copy.
3. **Uniqueness.** AC16 passes at the release with the caps of section 5. Negative tests: two equal flags, two near-duplicate portraits, a generic portrait used twice in one country, an icon used past its cap in one tree, an icon on a focus and its prerequisite, two peoples sharing a mesh and a diffuse texture, two events one step apart sharing a picture.
4. **Placeholders.** A release build (phase 7) fails on any `planned`, `generated` or `blocked` asset referenced by shipped content in a release-core family (A1, A3, A4, B, C, D1 to D5, E1, F, G, H, I1, X1, X2) and on any `kept` asset with `reach: visible` that is not engine-generic. Negative test: a placeholder in a release build.
5. **Budget.** The queue reproduces the totals of 8.2, or this spec is updated in the same commit. A planted overspent Meshy budget fails (AC17).
6. **Linux run, canary.** In the phase 7 acceptance run (1600 × 900, as Aenor and the Magical Forest, clock unpaused per S8a), staged with `ZIN_ASSET_CANARY=1`: the main menu, three loading screens, bookmark, country selection, top bar, event window, focus view, decision view, technology view, doctrine view, the division designer's template picker, the land combat view with a tactic selected, a map with roads, borders, trees and terrain, and a unit selection show zero canary pixels in the captures, and `error.log` has no texture, sprite, font, sound or localisation line caused by ZIN files.
7. **Probes.** AP1 to AP8 are run, their results recorded in this spec, and any assumption they disprove changes the affected row before the family ships.
8. **Voices.** Selecting a unit of any ZIN country in the Linux run plays no voice (AP2). The build contains no file under a voice folder and no `<TAG>_infantry_*` sound effect.
9. **Clean room.** No shipped image equals an installed vanilla file at its path; no provenance reference points inside another mod or a game folder (AC14, art pipeline checks).
10. **Inventory rows closed**, by decision in this spec (art side; the owner module ships them): WE-083, MA-113, WE-066, WE-055, WE-067, WE-145, PS-113, PS-114, PS-115, WE-080, MA-086, MA-098, MA-099, WE-194, WE-132, MA-017, MA-092, MA-029, MA-030, MA-051, MA-052, MA-095, MA-096, MA-022, MA-110, MA-111, MA-064, MA-066, WE-081, UI-145, PS-085, MA-114, MA-115, MA-116, MA-112, MA-057 (36 rows). Closed on the art side as hidden: MA-077, PS-057, PS-056, MA-125, PS-178, UI-022, UI-133, WE-143, PS-025, UI-106, UI-108, WE-152, WE-179, WE-106, WE-108 (15 rows). The check side of UI-038, UI-041, UI-042, UI-046, MA-071, UI-045 and UI-058 is covered (AC3, AC8, 3.2).

## Open questions

Each proceeds on the proposal. Questions only the owner can answer are listed in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) with the same proposal (marked *owner*).

1. **Dynamic-tag flags.** What does the engine draw for a dynamic tag with no flag file (the installed game ships none)? Proceeds on: ship 75 (X11); drop X11 if probe AP5 shows the engine builds a flag itself.
2. **Seamless tiling by cross-fade** counts as a conversion (like gauge compositing). Proceeds on: yes (*owner*, joins OPEN_QUESTIONS interface 7).
3. **BC3 encoder** written in the repository versus uncompressed map textures. Proceeds on: encoder in wave 3, uncompressed until then.
4. **Particle reskin by path** versus new particle definitions. Proceeds on: by path, no vanilla `.asset` touched; probe AP4.
5. **Trains.** Proceeds on the fallback chain of X5; the Meshy wagon train when credits exist.
6. **Vanilla house and city geometry** stays on the map until the eight building models exist (4 clusters and 4 houses, 240 credits). Proceeds on: yes, recorded as the one engine-generic geometry exception with an owner and an expiry (*owner*: confirm the exception).
7. **Unit medal strips** depend on the honours spec keeping unit medals. Proceeds on: 24 frames reserved, released if dropped.
8. **Concurrency.** Proceeds on 3, raised after the first wave if the rate limit allows.
9. **Owner approval** for the X families: none of them is in the owner-approval groups of the art pipeline §6, except if the owner adds the heraldic charges. Proceeds on: agent review only.
10. **P13 and the credit arithmetic** (flagged above). Proceeds on: the 40 credits buy the Great Wall segment.

## Probes (Linux run, recorded here after they run)

| Id | Question | Fallback if it fails |
| --- | --- | --- |
| AP1 | What does the engine show for a missing equipment, sub-unit, event, trait, modifier or unit-medal picture, and does it log? | None needed; the static check already forbids the case |
| AP2 | Does a ZIN unit selection play any voice? | Define empty `<TAG>_infantry_*` effects for every tag |
| AP3 | When a `.tga` name has both a `.tga` and a `.dds` on disk, which loads? | Never ship twins (rule c) |
| AP4 | Does any modern particle entity play during a ZIN battle, overrun, shattering or city fire? | Reskin more textures; if one cannot be isolated, override that one `.asset` file as an identifier-only copy (rule 5 of the removal spec) |
| AP5 | What flag does a dynamic tag with no file show? | Ship X11 |
| AP6 | Does `zin_pack_train_entity` (pilot infantry in file) display and animate on the train database? | `empty.mesh`; then the Meshy wagon |
| AP7 | Does any famous-ship picture or ace picture show for a ZIN tag? | Add ZIN stand-ins |
| AP8 | Does a cursor `.ani` render without artefacts? | Interface spec question 4: engine-generic cursors |

## Names this spec registers

| Name | Kind | Meaning |
| --- | --- | --- |
| `docs/design/art/asset_manifest.json` | published data | The asset manifest |
| `docs/design/art/asset_report.json` | published data | The check's report |
| `art/source/assets_manifest.json` | module manifest | Files written by `modules/assets.mjs` (A8) |
| `tools/content/modules/assets.mjs`, `checks/assets.mjs`, `assets.test.mjs` | builder | Module, check, tests |
| `lib/loaded_assets.mjs`, `asset_schema.mjs`, `phash.mjs`, `bc3.mjs`, `dds_info.mjs`, `art/queue.mjs`, `art/x-jobs.mjs` | builder libraries | Section Implementation |
| `tools/content/data/assets/{implicit_names,bound,formats,uniqueness,particles,kept,battleplan_names,x_cells}.json` | builder data | Section Implementation |
| `<inventory id>/<key>[/<variant>]` | asset id | Manifest record id (`A1/crown_gold`) |
| `X1` to `X12` | asset families | Template icons, tactic pictures, medal strips, particle textures, road pictures, terrain tiles, border sheets, arrow patterns, map items, tree textures, dynamic flags, modifier icons |
| `L18`, `L19`, `L20` | sheet layouts | Section 8.1 |
| `AC1` to `AC18` | check codes | Section 4 |
| `AP1` to `AP8` | Linux probes | Probes table |
| `FALLBACK_HIT`, `NEAR_DUPLICATE` | finding codes | Sections 3.2 and 5 |
| `ZIN_ASSET_CANARY` | environment variable | Writes canary fallback textures into a staged tree that is never applied |
| `GFX_medal_icon_zin_light`, `_dominion`, `_shadow`, `_wild` | sprites | Unit medal strips (X3, conditional) |
| `zin_pack_train_entity`, `zin_wagon_train`, `zin_wagon_train_entity` | entity, Meshy asset | Trains (X5) |
| `zin_landmark_great_wall_section` | Meshy asset | The Great Wall landmark (blocked) |
| `gfx/train_gfx_database/zin_trains.txt`, `gfx/entities/zin_trains.asset`, `interface/zin_medals.gfx`, `interface/zin_modifiers.gfx` | game files | Section Implementation |
