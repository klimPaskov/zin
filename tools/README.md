# ZIN build tools

ZIN's overhaul content is built by the scripts in this folder (integration decision S10). The builder is
deterministic: the same inputs always produce the same bytes. It writes a staged tree outside the repository. Then
`content/apply.mts` writes that tree into the mod in one transaction through the shared atomic rewrite engine of
hoi4-agent-tools. **Every content write to the mod goes through `apply.mts`.** Do not copy staged files into the mod
by hand, and do not point the builder at the repository.

## Tools

| Path | What it does |
| --- | --- |
| `content/build.mjs` | Builds the staged tree: the country table, peoples, ideologies, names, portraits, rulers, the Realm panel, the 3D land-unit entities, the lore vault copy, and the generated art sources with their provenance. It prints a JSON summary. |
| `content/build.test.mjs` | Tests the staged tree. One test rebuilds it to check determinism. Negative tests cover unknown modifiers, peoples and stances, and a staging directory inside the repository. |
| `content/modules/presentation.mjs` | Presentation art into game files: the 24 loading screens and their thumbnails, the three main-menu backgrounds and `common/frontend/backgrounds`, the loading-screen chrome, the ZIN emblem and the bookmark picture (`GFX_zin_bookmark_fourth_age`), the loading tips, and the catalog focus, idea, event and news pictures. It only crops, keys, resizes and converts accepted generated images (cell map `content/data/presentation-cells.json`). Tested by `content/presentation.test.mjs`. |
| `content/modules/vanilla_removal.mjs`, `content/modules/vanilla_bridges.mjs` | Vanilla removal stage 1 (`docs/specs/00_foundation/06_vanilla_removal_and_zero_errors.md`): the `replace_path` lines of `descriptor.mod` from `content/data/vanilla/dispositions.json`, the ZIN files of every replaced folder, the interim stubs (`zin_interim_*`), the overrides of `00_game_rules.txt`, `tutorial.txt` and `achievements.txt`, the engine hook files, and the bridges check C3 asks for (`# bridge: remove in stage N`). |
| `content/checks/vanilla_refs.mjs`, `content/checks/error_budget.mjs` | Checks C1-C5 (dispositions, descriptors, loaded references, stubs, vanilla text) and C6-C7 (`node content/checks/error_budget.mjs <error.log> [text.log] [stage]` on the Linux run's logs). |
| `content/vanilla.test.mjs` | Tests the checks and the stage-1 content, with negative tests for each check. |
| `content/modules/focus_compiler.mjs` | The focus tree compiler (spec `docs/specs/05_focus_trees/00_format_and_compiler.md`): reads every `docs/design/focus/*.json`, validates it, expands `copy` blocks, runs the build checks and stages each tree's focus tree, spirits, events, scripted effects and triggers, opinion modifiers, AI strategies and localisation, plus the shared layout refresh `common/on_actions/zin_focus_layout.txt`. With no tree file it stages nothing. See "Focus trees" below. |
| `content/lib/focus_schema.mjs`, `content/lib/focus_model.mjs` | The strict schema of a tree file, and the helpers the compiler and its checks share (compiled ids, event numbers, absolute positions, walkers, copy expansion). |
| `content/checks/focus_checks.mjs` | The compiler's build checks and the registry of names other modules write (`content/data/focus_registry.json`, plus a scan of the staged files). |
| `content/focus.test.mjs` | Tests the compiler on the synthetic trees under `content/fixtures/focus/` with exact expected files, determinism, and one negative test per check. `ZIN_UPDATE_FOCUS_FIXTURES=1` rewrites `fixtures/focus/expected/` after a reviewed change. |
| `content/modules/assets.mjs` | The asset manifest (spec `docs/specs/08_art_and_assets/05_asset_manifest.md`): one record per shipped asset (id, family, files with hashes and header facts, sprites, source job and provenance, owner spec, people, uniqueness group, perceptual hashes), written to `art/source/asset_manifest.json` with a compact `asset_manifest_summary.json`. It is the last step of `build.mjs`, which also runs the completeness check and gates it on the baseline. See "Assets" below. |
| `content/checks/assets.mjs`, `content/lib/loaded_assets.mjs`, `content/lib/asset_sources.mjs`, `content/lib/asset_schema.mjs`, `content/lib/dds_info.mjs`, `content/lib/phash.mjs` | The completeness check, and the libraries it and the manifest share: the shipped-file views and the read-only installed-game index, the reference graph, the provenance links, the strict record schema, the DDS/TGA/PNG header readers and the perceptual hashes. `node content/checks/assets.mjs` is also a CLI. |
| `content/assets.test.mjs`, `content/fixtures/assets/` | Tests of the manifest and the check on synthetic project-owned trees (committed text files in `good/` and `game/`; `make.mjs` generates the pictures from seeded noise): positive cases, and a negative test per check. |
| `content/sync/zin_mod_descriptor.mjs` | Copies the `replace_path` lines of `descriptor.mod` into the launcher descriptor `mod/zin.mod` through the shared rewrite engine (`node --import tsx content/sync/zin_mod_descriptor.mjs [descriptor] [plan\|apply]`, from `tools/`). Run it after every apply that changes the descriptor. |
| `content/data/vanilla/` | `dispositions.json` (one row per vanilla folder or file: action, stage, owner, reason), `baseline_errors.json` (B1-B13 patterns, counts and stage budgets), `error_allowlist.json` (empty). The builder publishes them under `docs/design/`. |
| `content/apply.mts` | Compares the staged tree with the mod. `plan` reports the writes and deletes without changing anything. `apply` performs them in one TransactionManager transaction and updates `.zin-content.json` (and `.hoi4-agent-world.json` hashes for shared entry points). |
| `content/imagegen.mjs` | Generates images in batches through the owner's gptimage library (ChatGPT plan). It skips finished jobs and rejects sheets that fail their layout check, trying up to three times. Every generation is recorded in `provenance.jsonl` next to the jobs file. |
| `content/art/asset-jobs.mjs` | Writes the image jobs for people emblems, portraits and interface art (`assets-jobs.json`). |
| `content/art/flag-jobs.mjs` | Writes the image jobs for the flag sheets and their cell map (`flags-jobs.json`, `flags-cells.json`) from the current country table. |
| `content/art/slice-flags.mjs` | Cuts flag sheets into one 492x312 PNG per country. The builder runs it by itself when the flag slices are missing (see below). |
| `content/art/unit-ref-jobs.mjs`, `content/art/stage-unit-jobs.mjs` | Write the image jobs for the 3D unit reference images, then stage the approved references into the 3D job roots under `docs/assets/hoi4_3d_model_jobs/`. |
| `content/preview.mjs` | Builds a contact sheet PNG from staged DDS sprites, for review. |
| `content/lib/paths.mjs` | Holds every path the tools use (see the next section). |
| `content/modules/names.mjs` | Names from the languages of Erdae (spec `docs/specs/02_lore/06_languages.md`). `buildNames` stages `common/names/zin_names.txt` (male, female, surnames and callsigns for every tag and the `default` pool, all from the country's culture and language) and `docs/design/names_report.json`, runs the name checks and fails the build on a violation. `placeNames(target, kind, n)` and `resolveName(request)` are the entry points of the map and politics steps. See "Languages and names" below. |
| `content/lib/language_generator.mjs`, `content/lib/sound_laws.mjs` | The deterministic name generator (patterns, junction rules, banned-name filter, Windows-1252 and length limits, leak markers, the world registry that refuses duplicates and near-duplicates across languages) and the sound-law engine that derives a daughter language from its family's proto lexicon. |
| `content/checks/names_check.mjs` | The name checks: cross-language leaks, near-duplicates, banned words, glyphs, forms, pool floors, the signature of each language, the 250-and-250 reference run, relatedness by sound laws. `node content/checks/names_check.mjs [stagedDir]` is also a CLI. |
| `content/names.test.mjs` | Tests the generator, the pools, `placeNames`, the checks and their negative cases (a banned name, a duplicate, a character outside Windows-1252, a leak, an unknown language, a reserved vault name). It needs no staged tree. |
| `content/data/world/` | The world data the names read: `languages.json` (24 languages), `cultures.json`, `country_cultures.json` (culture and language of each of the 305 countries), `reserved_names.json` (established vault names that no language may produce), `demography.json`. |
| `content/data/assets/` | Data of the asset manifest and check: `families.json` (path rules to family, key, kind, group and source), `formats.json` (sizes, formats and mip counts), `bound.json` (files the engine loads by path), `kept.json` (vanilla files ZIN may point at), `implicit_names.json` (names the engine builds, fallback sprites), `uniqueness.json` (thresholds, caps, aliases). |
| `content/data/` | Inputs: `countries.json` (countries from the map build), `labels.json` (reviewed drawing labels, used for names), `flags-cells.json` (the cell map the flag sheets were generated and sliced with). |

## Focus trees

`modules/focus_compiler.mjs` turns the tree files in `docs/design/focus/` (see the README there) into game files. `build.mjs` calls it last, so its checks see every name the other modules stage. A build with no tree file stages nothing and does not fail. Otherwise it stages, per tree `<id>`:

| File | Content |
| --- | --- |
| `common/national_focus/zin_<id>.txt` | The focus tree, selected by the countries' original tags (`factor = 0`, `add = 10`, so it beats the interim tree) |
| `common/ideas/zin_focus_<id>.txt` | The spirits, ids `zin_<id>_<key>` |
| `events/zin_<id>.txt` | The events: namespace `zin_<id>` or `event_namespace`, number `event_base + n`, every one `is_triggered_only` with `timeout_days = 30` |
| `common/scripted_effects/zin_<id>.txt`, `common/scripted_triggers/zin_<id>.txt` | The tree's declared effects and triggers, and the generated opinion helper `zin_<id>_opinion` |
| `common/opinion_modifiers/zin_<id>.txt`, `common/ai_strategy/zin_<id>.txt` | Opinion modifiers (`zin_<id>_<key>`) and AI strategies (`zin_<id>_ai_<n>`) |
| `localisation/english/zin_focus_<id>_l_english.yml` | All text, UTF-8 with BOM |
| `common/on_actions/zin_focus_layout.txt` | Written once when at least one tree exists: `mark_focus_tree_layout_dirty` in the six on_actions of decision E4 |

The build fails, listing every problem, when any check of the spec fails: schema (unknown fields are errors), duplicate keys and positions, prerequisites at or above their focus, loops, exclusives that name no focus or a prerequisite, days that are not a multiple of 7 or lie outside 7 to 140, icons and pictures missing from the catalog (`content/data/presentation-cells.json`), unresolved spirits, events, flags, scripted effects and triggers, key collisions (F3: a spirit key equal to a focus key, a tree or compiled id equal to an id a module writes, ids shared by two trees), keyword arguments without a code in `content/data/focus_arg_codes.json`, the E4 rule for `allow_branch`, text outside Windows-1252, superseded and retired names (read from the retired table of `docs/specs/04_mechanics/00_contract_additions.md`), Afrit and the Hidden Council named in text that is reachable before `zin_afrit_revealed` (unless the item declares `text_gate` and the compiler can prove the gate), a tier's focus count outside its range counted over the whole tree (F6), and more than ten `raw` blocks in a major tree. The check that every country of the roster has exactly one tree runs in full once every tree of `docs/specs/05_focus_trees/01_tiers_and_coverage.md` has a file; before that, only a country claimed by two trees fails. Unprovable picture gates and `raw` blocks are warnings on stderr.

Names owned by other modules are found in the staged files of the modules that ran before the compiler. `content/data/focus_registry.json` lists the names of modules that do not exist yet, patterns of name families, and the lists of decision E4 (`refreshed_checks`, `refreshed_flags`) that decide which conditions may stand in `allow_branch`. Keyword codes of scripted-effect arguments (E1) live in `content/data/focus_arg_codes.json`; `focus.test.mjs` compares them with the specs they were copied from. Dates in `after` and `before` conditions are shifted per `zin_rule_story_pace` option with `paceDate()` of `lib/story_dates.mjs` when that library exists, and with the same formula otherwise.

## Languages and names

Every personal and place name comes from a language, never from the map labels (spec `docs/specs/02_lore/06_languages.md`; data in `content/data/world/`). The generator draws with the seeded `rng("zin-names:" + kind + ":" + entityId)`, so the same data gives the same bytes. A name is built from a language's dictionary elements and suffixes by its place patterns and junction rules (places) or from stems and endings (persons), then checked: alphabet and Windows-1252, length (places 4 to 18 letters, given names 3 to 12), no letter three times in a row, no run of five consonants, the banned substrings (`BANNED` in `modules/names.mjs`, `languages.json`) and the whole-word rules of `data/banned_words.json`, only letters and no leak marker of another language, and not equal to an established name (countries, capitals, drawn labels, the geography model, the vault names of `reserved_names.json`). One registry holds every claimed name: a place or full name has one holder; a given name or house word is shared inside its language and never across two; no name is within one edit of a name of another language or of an established name (five letters or more).

- **Pools.** Each country gets 60 male, 50 female, 90 surname and 12 callsign entries from its culture's language (a seeded subset of the language's name space, so countries of one language differ). A language without house names (`house.style` none) gives lineage names, a second personal name; an "of" style language gives `of <name>`. The `default` pool (it names the 75 dynamic tags) and Zol's Mistake, which has no language, take a neutral blend of the Middle Lands languages weighted by the square root of their countries. `buildNames` still returns pools by drawn sheet and as `zin:all-erdae`, and now also by tag.
- **Places.** `placeNames(target, kind, n, { size, features, seed, start, layers })` returns `n` names for a country, tag, culture, language or region; `kind` is `city`, `settlement`, `state`, `region`, `river`, `lake`, `mountain`, `sea`, `strait`, `forest` or `site`. Each name picks a toponym layer (current language, regional substrate, Aenoran chart ending, holy form) as in spec section 5 and claims the registry shared with the persons. `resolveName` answers the spec's `NameRequest`.
- **Checks** (`checks/names_check.mjs`, run by `buildNames`): no name is in the pools of two languages; the default pool holds only names of its blend; no banned word, no glyph outside Windows-1252, no name outside its language's letters or with another language's marker; pools at the floors (20, 20, 40); each pool carries the language's signature as far as its name space allows; the reference run (250 places and 250 persons per language, no duplicate, no failure, the signature on at least 55% of the places a language can sign); and the relatedness of each family (a regular word of a daughter language is its proto-form after the ordered sound laws).
- **Where the data and the spec disagree** the build follows the data: the sample names break five rules (Edddun, Beria, Torrrokk, Glooo, Wooo); 177 of 1,440 samples use letters outside their language's declared sound table, so the letters a language really uses are enforced; a few leak markers occur in more languages than the spec lists; the signature of Aenoran rivers and mountains and of Mirolic mountains cannot be made from the dictionary; nine regular words do not follow the declared sound laws. `names_report.json` and the test output list them.

## Assets

`modules/assets.mjs` and `checks/assets.mjs` (spec `docs/specs/08_art_and_assets/05_asset_manifest.md`) prove at every build that the pictures, models and names a player can reach exist, belong to ZIN, and are not copies. The loaded set is the repository with the staged tree laid over it (files that the last apply tracked in `.zin-content.json` and the build no longer stages are dropped). The installed game (`HOI4_GAME`, with `integrated_dlc` and `dlc` mounted at the same paths and the `replace_path` folders of `descriptor.mod` removed) is only read, lazily, and nothing is copied from it.

| Output | Content |
| --- | --- |
| `art/source/asset_manifest.json` | One record per shipped asset, sorted by id, canonical JSON (same inputs, same bytes). Written through the staged tree, so `apply.mts` ships it. |
| `art/source/asset_manifest_summary.json` | Counts per family, state and route, the check's severity counts, and the manifest's own sha256. |
| `docs/design/validation/asset_baseline.json` | The accepted pre-existing findings and counts. The build fails only on an **error that is not listed here**; warnings are printed. |

The check reports, by severity (`error`, `warning`, `info`), findings of these kinds: sprites (`SPRITE_UNDEFINED`, `SPRITE_TEXTURE_MISSING`, `SPRITE_FRAMES`, `SPRITE_DUPLICATE`, `EXT_ALIAS`, `VANILLA_TEXTURE`); implicit names (`IMPLICIT_NAME_MISS` for ideas and decisions, `IMPLICIT_SHINE_MISSING` for focus icons, `FALLBACK_HIT`, `FALLBACK_KEY`); entities (`MESH_FILE_MISSING`, `MESH_TEXTURE_MISSING`, `ANIMATION_UNDEFINED`, `ANIMATION_FILE_MISSING`, `STATE_ANIMATION_MISSING`, `ENTITY_MESH_UNDEFINED`, `ENTITY_CLONE_UNDEFINED`, `CULTURE_ENTITY_MISSING`); sound, fonts, cursors and text (`SOUND_UNDEFINED`, `SONG_UNDEFINED`, `SOUND_FILE_MISSING`, `FONT_UNDEFINED`, `CURSOR_UNKNOWN`, `LOC_KEY_MISSING`, `LOC_EMPTY`, `TEXTICON_MISSING`, `LOC_ENCODING`); flags, portraits and the map (`FLAG_MISSING`, `FLAG_ORPHAN`, `PORTRAIT_SIZE`, `MAP_FILE_MISSING`); orphans (`ORPHAN_ASSET`); headers (`SIZE_MISMATCH` for size, format and mip count, `NPOT`, `IMAGE_INVALID`, `REPLACE_SHAPE`, `EXT_TWIN`, `EXT_TWIN_VANILLA`); provenance (`PROV_NO_GENERATION`, `PROV_UNREVIEWED`, `PROV_NO_MANIFEST_LINE`, `PROV_SOURCE_MISSING`, `PROV_REF_FOREIGN`, `PROV_REF_OUTSIDE`, `PROV_NO_JOB`, `MANIFEST_STALE`, `VANILLA_COPY`); uniqueness (`UNIQ_EXACT_DUP`, `UNIQ_NEAR_DUPLICATE`, `UNIQ_ICON_TREE_CAP`, `UNIQ_ICON_GAME_CAP`, `UNIQ_ICON_PREREQUISITE`, `UNIQ_EVENT_PICTURE_CAP`, `UNIQ_EVENT_CHAIN`, `UNIQ_PORTRAIT_POOL`, `UNIQ_PORTRAIT_COUNTRY`, `UNIQ_PORTRAIT_NAMED`); and `MANIFEST_SCHEMA` when a record breaks the strict schema. A provenance problem of a source picture is reported once, on the source, with the number of shipped files it affects. Findings in interim and bridge files (`stub_files` in `uniqueness.json`) are warnings; the bridge characters of vanilla tags do not count in the portrait pools.

```sh
# Check the repository as it is (read-only). Exit code 1 when an error is not in the baseline.
node tools/content/checks/assets.mjs [--report report.json] [--phase 7]
# Check a staged tree laid over the repository (what the build does)
node tools/content/checks/assets.mjs --staged <stagedDir>
# Accept the current findings as the baseline (review the diff of asset_baseline.json first)
ZIN_ASSETS_UPDATE_BASELINE=1 node tools/content/build.mjs
```

`--phase N` (or `ZIN_ASSET_PHASE`) is the roadmap phase: from phase 7 the catalog fallback keys become errors. Perceptual hashes are cached by sha256 in `$ZIN_ART/cache/assets-check.json` (optional; outside the repository). Not yet checked, and listed in the report's `notChecked`: AC2 (no `inventory.json`), AC15 (gates for portraits and event pictures), AC17 (no `meshy_budget.json`) and AC18 (no `hidden` records); planned, accepted-but-unshipped and `kept` records need `inventory.json` and are not in the manifest yet.

## Paths

The ZIN root is found from the scripts' own location (`tools/content` resolves to the repository root). The current
directory does not matter. Locations outside the repository come from environment variables. Their defaults are the
owner's machine.

| Variable | Default | Used for |
| --- | --- | --- |
| `HOI4_AGENT_TOOLS` | `C:/Users/klimp/Documents/Projects/hoi4-agent-tools` | the shared atomic rewrite engine (`src/hoi4_agent_tools/core/*`), which `apply.mts` imports |
| `ZIN_ART` | `$HOI4_AGENT_TOOLS/.tmp/zin-art` | the art working directory: `raw/` sheets, `flags/` slices, `jobs/` (job files, `provenance.jsonl`, `flags-cells.json`), `models/refs/` |
| `HOI4_GAME` | `C:/Program Files (x86)/Steam/steamapps/common/Hearts of Iron IV` | `documentation/modifiers_documentation.md`, which validates every modifier the builder writes |
| `ZIN_LORE_VAULT` | `C:/Users/klimp/Downloads/ZIN_Lore_Vault` | the owner's lore vault export. If it is absent, the copy already in `docs/lore/vault/` is used. |
| `GPTIMAGE_LIB` | `C:/Users/klimp/tools/gptimage/src` | the gptimage library (`auth.js`, `codex.js`, `images.js`) |
| `GPTIMAGE_MODEL` | `gpt-6-astra` | the image model `imagegen.mjs` asks for |
| `ZIN_STAGED` | `<OS temp>/zin-content-staged` | the staged tree that `build.test.mjs` checks |
| `ZIN_WORKFLOW_CONFIG` | `$HOI4_AGENT_TOOLS/.tmp/zin-workflow/config.json` | the hoi4-agent-tools workspace configuration `apply.mts` uses |
| `ZIN_WORKFLOW_STATE` | `~/.zin-content-workflow` | private transaction state, used only when `ZIN_WORKFLOW_CONFIG` does not exist and `apply.mts` derives a configuration for this repository |

Fallbacks:

- **Art sheets and provenance.** A raw sheet missing from `$ZIN_ART/raw/` is read from the copy tracked in
  `art/source/`. A missing `$ZIN_ART/jobs/provenance.jsonl` is read from `art/source/provenance.jsonl`. A fresh
  clone therefore builds the same art bytes without the working directory.
- **Flag slices.** When `$ZIN_ART/flags/` is missing, the flags are cut again from the sheets. The cuts go into a
  content-addressed folder under `<OS temp>/zin-content-flags/`, never inside the repository. The cell map is
  `$ZIN_ART/jobs/flags-cells.json` or its tracked copy `content/data/flags-cells.json`. It must be the map the sheets
  were generated with, so a test fails if the two differ. `art/flag-jobs.mjs` derives a map from today's table,
  which no longer matches the existing sheets. Use it only when generating new sheets.
- **3D units.** A job root under `docs/assets/hoi4_3d_model_jobs/models_3d/<id>/` whose `export/` and `textures/`
  folders are both absent (they are gitignored) is read from the shipped copies in `gfx/models/units/zin/<id>/`.
  These hold the same bytes under their staged names.
- **Staging.** The staged tree is the first argument. The default is `<OS temp>/zin-content-staged`. A directory
  inside the repository is refused, because the builder empties the staging directory before writing.
- **apply.mts workspace.** The workspace `zin` in the configuration must resolve to this repository, or
  `apply.mts` stops.

## Prerequisites

- Node.js 22.19 or later, or 24 (tested with 24.15.0).
- The dependencies in this folder (`sharp` 0.35.5 and `tsx` 4.23.11, exact versions in `package-lock.json`):
  `cd tools && npm ci`. Byte identity depends on the exact `sharp`/libvips build, so do not upgrade `sharp` without
  rebuilding and reviewing every changed asset.
- A hoi4-agent-tools checkout with its dependencies installed (`npm ci` in that checkout), at `HOI4_AGENT_TOOLS`.
  Only `apply.mts` needs it. It runs that checkout's current source.
- The Hearts of Iron IV install at `HOI4_GAME`, for the modifier documentation (build and tests).
- For image generation only: the gptimage library at `GPTIMAGE_LIB`, signed in to the owner's ChatGPT plan.

## Commands

Run these from the repository root unless a command says `cd tools`.

```sh
# Build the staged tree (default <OS temp>/zin-content-staged, or pass a directory outside the repository)
node tools/content/build.mjs
node tools/content/build.mjs D:/staging/zin

# Test it (set ZIN_STAGED when you built to a non-default directory)
node --test tools/content/build.test.mjs tools/content/vanilla.test.mjs
ZIN_STAGED=D:/staging/zin node --test tools/content/build.test.mjs tools/content/vanilla.test.mjs

# Plan, then apply, through the shared atomic rewrite engine (tsx resolves from tools/node_modules, so run from tools/)
cd tools
node --import tsx content/apply.mts plan                      # default staged tree
node --import tsx content/apply.mts D:/staging/zin plan
node --import tsx content/apply.mts D:/staging/zin apply      # writes the mod; review the plan first

# Image generation: write jobs, generate, slice flags (the jobs default to $ZIN_ART/jobs)
node tools/content/art/asset-jobs.mjs
node tools/content/art/flag-jobs.mjs
GPTIMAGE_MODEL=gpt-6-astra node tools/content/imagegen.mjs "$ZIN_ART/jobs/assets-jobs.json"
node tools/content/art/slice-flags.mjs "$ZIN_ART/jobs/flags-cells.json" "$ZIN_ART/raw/flags" "$ZIN_ART/flags"

# Review staged sprites
node tools/content/preview.mjs <staged>/gfx/leaders/zin preview.png
```

`cd tools && npm run build` and `npm test` run the first two commands with their defaults.

When you generate new flag sheets, copy the new `$ZIN_ART/jobs/flags-cells.json` to `content/data/flags-cells.json`
in the same change. New art reaches `art/source/` only through a build and an apply.

## Limits

- A fresh clone has no `docs/lore/vault/Maps/`, which holds the owner's private drawings and is ignored. Its staged
  tree lacks those four files. Everything else is byte-identical to a build on the owner's machine.
  `.zin-content.json` lists those files, so on a clone without them, `apply` would drop them from the manifest.
  Apply on the owner's machine.
- `apply.mts` needs a hoi4-agent-tools checkout. The engine is not vendored into this repository.
- The politics step (`zin-politics-v4.mts`, which writes country history and flags) still lives in the hoi4-agent-tools
  `.tmp` folder. It imports the old builder copy there.
