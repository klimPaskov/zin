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
| `content/apply.mts` | Compares the staged tree with the mod. `plan` reports the writes and deletes without changing anything. `apply` performs them in one TransactionManager transaction and updates `.zin-content.json` (and `.hoi4-agent-world.json` hashes for shared entry points). |
| `content/imagegen.mjs` | Generates images in batches through the owner's gptimage library (ChatGPT plan). It skips finished jobs and rejects sheets that fail their layout check, trying up to three times. Every generation is recorded in `provenance.jsonl` next to the jobs file. |
| `content/art/asset-jobs.mjs` | Writes the image jobs for people emblems, portraits and interface art (`assets-jobs.json`). |
| `content/art/flag-jobs.mjs` | Writes the image jobs for the flag sheets and their cell map (`flags-jobs.json`, `flags-cells.json`) from the current country table. |
| `content/art/slice-flags.mjs` | Cuts flag sheets into one 492x312 PNG per country. The builder runs it by itself when the flag slices are missing (see below). |
| `content/art/unit-ref-jobs.mjs`, `content/art/stage-unit-jobs.mjs` | Write the image jobs for the 3D unit reference images, then stage the approved references into the 3D job roots under `docs/assets/hoi4_3d_model_jobs/`. |
| `content/preview.mjs` | Builds a contact sheet PNG from staged DDS sprites, for review. |
| `content/lib/paths.mjs` | Holds every path the tools use (see the next section). |
| `content/data/` | Inputs: `countries.json` (countries from the map build), `labels.json` (reviewed drawing labels, used for names), `flags-cells.json` (the cell map the flag sheets were generated and sliced with). |

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
node --test tools/content/build.test.mjs
ZIN_STAGED=D:/staging/zin node --test tools/content/build.test.mjs

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
