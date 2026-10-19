# Stage 2 integration note: interface reskin infrastructure

Modules `tools/content/modules/ui_inventory.mjs` and `ui_reskin.mjs`, libraries `lib/image_codec.mjs`, `lib/fit.mjs`, `lib/ui_plan.mjs`, `lib/ui_sheets.mjs`, `lib/ui_vocab.mjs`, checks `checks/ui_checks.mjs`, job writer `art/ui-reskin-jobs.mjs`, data `tools/content/data/ui/` (`vanilla_inventory.json`, `reskin.json`, `sheets/*.json`), test `tools/content/ui_reskin.test.mjs` (45 tests, added to `tools/package.json`). Spec: [02_full_ui_reskin.md](../../specs/07_interface/02_full_ui_reskin.md). Owners of the other pieces: `ui_overrides.mjs`, `ui_cursors.mjs` and `ui_minimap.mjs` are not part of this tranche.

This tranche builds the infrastructure and the work plan. It generates no art: with no accepted sheet every `R` row stays pending and the build does not fail.

## 1. Calls to add to `build.mjs`

```js
import { GAME } from './lib/paths.mjs';
import { loadInventory } from './modules/ui_inventory.mjs';
import { loadReskin, loadSheets, buildReskin, publishUiData } from './modules/ui_reskin.mjs';
import { runUiChecks, scriptReferences } from './checks/ui_checks.mjs';

const inventory = loadInventory(), reskin = loadReskin(), sheets = loadSheets();
// After buildPresentation (it owns the loading chrome, logo_game.dds and the bookmark defaults) and before the final checks.
const ui = await buildReskin(staged, { inventory, reskin, sheets /*, provenance: parsed review lines, warn */ });
publishUiData(staged, { reskin, sheets });                     // docs/design/ui/{reskin.json,sheets/,report.json}
// After every module has staged its files (the checks read staged.files):
const texts = [...staged.files].filter(([k]) => /^(common|events|history|interface|localisation)\//.test(k)).map(([, v]) => v.toString('utf8'));
const report = await runUiChecks({ inventory, reskin, sheets, files: staged.files, game: GAME, provenance, scriptRefs: scriptReferences(texts, inventory) });
if (!report.ok) throw new Error(report.checks.filter(c => c.status === 'fail').map(c => `ui check ${c.id} ${c.name}: ${c.problems.slice(0, 5).map(p => p.message).join('; ')}`).join('\n'));
```

`buildReskin` returns `{ built, pending, delegated, sources, manifest, counts }`. It stages, per built `R` texture, the file at the vanilla path (exact case, exact extension, exact size), the accepted raw sheets under `art/source/ui/reskin/<sheet id>.png`, and `art/source/reskin_manifest.json` (always, even when empty). It never stages `art/source/provenance.jsonl` (presentation does). `pending` lists `{ texture, names, why }` for rows with no raw sheet, no accepted review line, a refused layout, a refused fit or no readable vanilla outline; `delegated` lists the rows another writer owns. Print `ui.counts` in the build summary.

Order and conflicts: `buildReskin` skips every row whose `writer` is `presentation` (7 textures: the four loading chrome files, `logo_game.dds`, `select_date_1936.dds`, `select_date_1939.dds`), `cursors` (126 files) and `minimap` (2 files), so no staged path is added twice. `ui_cursors.mjs` and `ui_minimap.mjs`, when written, read their rows from `reskin.json` (`writer` field, `cells`, `sheet`). The `O` files of section 2.3 are written by `ui_overrides.mjs` and `presentation.mjs`; check 8 verifies them.

## 2. The files

| Path | Content | Written by |
| --- | --- | --- |
| `data/ui/vanilla_inventory.json` | 31,561 entries (29,171 `spriteType` and shine sprites, 153 cornered tiles, 159 frame-animated, 110 progress bars, 70 text sprites, 13 masked shields, 12 charts, 94 linked textures, 1,779 loose files) with game version 1.19.3.0, file hashes of the 674 `.gfx` and `.gui` files and a texture digest. One entry per line. Metadata only | `node content/modules/ui_inventory.mjs` (about 12 s; reads the base game and every `dlc/` and `integrated_dlc/` folder) |
| `data/ui/reskin.json` | One row per inventory entry, a header with the reasons table, the unreachable and hidden windows, the engine defaults and the decisions below | `node content/modules/ui_reskin.mjs plan`, from the inventory and the rules in `lib/ui_plan.mjs` |
| `data/ui/sheets/<id>.json` | 53 sheet maps: family, grid, aspect, ground, matte, painted border, and per cell the key, the design luminance class and the prompt subject | same command |
| `$ZIN_ART/jobs/ui-reskin-jobs.json` (and `-blocked.json`, `-plan.json`) | 48 ready jobs for `imagegen.mjs`, ordered by production step; 5 alert sheets wait for `alert_frames.json` | `node content/art/ui-reskin-jobs.mjs [outDir] [--tranche N] [--family F]` |
| `art/source/reskin_manifest.json` | Per built file: output, source, source hash, cells, sheets, operations, output hash | `buildReskin` |
| `docs/design/ui/` | Review copy: `reskin.json`, `sheets/`, `report.json` (the inventory is not copied; it is 12 MB and tracked) | `publishUiData` |

A game patch changes the inventory: rerun `ui_inventory.mjs`, then `ui_reskin.mjs plan`, and review the diff of `reskin.json` (the rules never touch a row they were not asked to). Hand edits to `reskin.json` do not survive `plan`; change the rule in `lib/ui_plan.mjs`.

Raw sheets live at `$ZIN_ART/raw/ui/reskin/<sheet id>.png` (`rawFile('ui/reskin/<id>.png')`, which falls back to `art/source/`). A sheet is used only when the last review line for its exact bytes says `accepted: true` (`acceptance()` of `presentation.mjs`). `alert_frames.json` (`data/ui/`) maps `alert_NN` and `request_NN` to the meaning of each frame; it is written by an agent reading the alert tooltip keys, and the alert sheets are blocked until it exists.

## 3. The table

| Disposition | Rows | Notes |
| --- | ---: | --- |
| `R` replace | 3,851 | 3,347 distinct files for `ui_reskin`, 126 cursor files (`ui_cursors`), 2 minimap files (`ui_minimap`), 7 files already in game (`presentation`) |
| `U` unreachable | 26,153 | Vanilla content (6,237 focus icons, 5,952 idea pictures, 3,906 technology pictures, 2,865 designer files, 2,413 portraits, 878 event pictures, 613 decision pictures and so on) and unreachable windows |
| `H` hidden | 1,208 | Achievements (886), the career profile (246), DLC banners, social links |
| `E` engine-generic | 336 | Missing textures, map shader masks, key glyphs, logos, debug art |
| `O` override | 13 | Sprites defined in `frontendmainviewbg*.gfx` and `small_background.gfx` |
| `Z`, `D` | 0 | See decisions 1 and 2 |

`R` rows by production step (spec section 6): step 2: 28, step 3: 2,974, step 5: 84, step 6: 12, step 7: 161, step 8: 20, step 9: 342, step 10: 104, step 11: 126. Step 3 is large because every window frame, plate and neutral icon socket hangs on the shared chrome sheets; those 2,974 rows are cut from the 7 chrome sheets.

## 4. Decisions recorded where the spec was ambiguous

The list is in the header of `reskin.json` (`decisions`) and in `lib/ui_plan.mjs` (`DECISIONS`). The main ones:

1. **`Z` and `D`.** The spec defines `Z` as a ZIN-owned sprite and `D` as a reserved derived override. ZIN's own `GFX_zin_*` sprites are not inventory rows, so no vanilla row is `Z`; vanilla content slots whose art a content spec owns are `U` with the owning spec in the reason. `D` is rejected by the validator unless the owner approves it. (The request wording "Z zero, D default" was not followed; the spec's definitions were.)
2. **Reachability decides.** A vanilla sprite that a window ZIN can show names in its `.gui` cannot be `U` or `H` (check 4 would fail), so it is `R` with a neutral treatment even when it is content (defaults, placeholders, template entries). That is why 1,504 small icons use the neutral sockets of `ui-sockets`: they are chrome-complete, not emblem-complete. Windows are classified per file (`GUI_STATES`) and, for the main menu, per window (`HIDDEN_WINDOWS`); the inventory attributes a reference to its top-level window only.
3. **MIO, raids, international market.** The economy, warfare and institutions specs keep the Erdae workshops, night raids and the Great Fairs, so those windows are reachable and skinned (their per-organisation icons are `U`). This overrides the "unreachable" rows of spec 02 section 4.9. Special projects, equipment designers, carriers and vanilla country scripted GUIs are unreachable.
4. **Alpha.** Each `R` row has an alpha policy: `opaque` (vanilla opaque, or shaped with 97% or more solid pixels), `uniform:<a>`, `shape` (the vanilla outline as a binary mask, read from the installed game at build time; only the outline is kept) or `cell` (emblems and sockets take their own outline from the black ground, decision A3). Rows that need an outline stay pending when the game is not installed.
5. **Frames.** A texture whose width the frame count does not divide (84 such sprites) is treated as one frame, because check 3 needs a divisible width; the engine would cut it into uneven frames. A row with several frames is always `strip`, with one cell and one label per frame. Sprites that share a texture share one treatment (`row.shared_texture` rejects two).
6. **Measured luminance beats the spec's wording.** The spec calls the bookmark and country entry plates light; the measured class is dark, so those rows pick dark cells. Each row picks a cell of its sprite's class; 8% of rows use a cell of another design class (listed by `luminance` in the sheets), and check 7 decides on the real output.
7. **Sheet changes against the spec.** `ui-chrome-panels` is 3 x 3 (adds bronze, iron and enamel plates for the mid and dark classes), `ui-chrome-small` 4 x 4, `ui-topbar` 1 x 8 (the speed steps are three cells), `ui-bars-2` carries the mid and light bar variants, `ui-sockets` is new, and the 81 army badges use three sheets. Totals: 53 sheets, 48 jobs now and 5 blocked.
8. **`exact`** falls back to `cover` when the aspect differs by more than 15%, and records it in the manifest operations.
9. **Check 5 threshold.** `PHASH_THRESHOLD = 6` bits of 64 is a proposal; tune it on the first accepted sheet and record the value in the spec. A flat vanilla or output picture is reported as inconclusive, not as a copy.

## 5. The checks

`checks/ui_checks.mjs` returns `{ id, name, status, problems, pending, notes }` per check (`pass`, `fail`, `pending`). `runUiChecks(ctx)` runs those whose inputs exist and returns `{ ok, pending, checks }`.

| # | Function | Inputs | Fails on | Pending when |
| ---: | --- | --- | --- | --- |
| 1 | `checkInventoryFreshness` | inventory, game, `deep` | game version or the hash of any `.gfx` or `.gui` differs; a texture changed size (or hash with `deep`); lists the changed sprites | the game is not installed |
| 2 | `checkCoverage` | inventory, reskin, sheets | a missing, unknown or duplicate row; a missing reason; `D`; an `O` row off the closed list; sizes written into a row; a bad fit, sheet, cell, frame list, border or alpha; two treatments for one file | never |
| 3 | `checkShape` | inventory, reskin, `files` | wrong path case or size, a width the frames do not divide, a DDS that is not A8R8G8B8 without mipmaps, a TGA of another origin, a PNG that is not 32-bit, a cursor of another hotspot, a file shipped at the path of a non-`R` texture | an `R` file is not staged |
| 4 | `checkReachability` | inventory, reskin, `scriptRefs` | a `U` or `H` row named by a reachable window, a script, a `£icon` or the engine default list | never |
| 5 | `checkNoVanillaPixels` | files, game | an output equal to the vanilla bytes, or within the threshold of its vanilla picture | an `R` file is not staged or the vanilla file is absent |
| 6 | `checkProvenance` | manifest, files, provenance | a shipped file with no manifest line, a hash mismatch, a source not staged or without an accepted review line, a stale manifest line | an `R` file is not staged |
| 7 | `checkLuminance` | files | an output whose class differs from the vanilla class | an `R` file is not staged |
| 8 | `checkOverrides` | files, game | a staged `interface/*.gui` or `*.gfx` that shadows a vanilla name and is not on the closed list (case-insensitive); an allowed file that drops a vanilla `name` | no vanilla file to compare |
| 9 | `checkDeterminism` | `build()` | two builds differ in any byte | never |

`scriptReferences(texts, inventory)` resolves identifiers and `£names` in script and localisation text to sprite names (the name, `GFX_` + name, and the idea, decision, focus and trait prefixes). Checks 2, 4 and 8 are exact; 3, 5, 6 and 7 judge whatever is staged and report the rest as pending, so the build is green before any art exists and turns strict as sheets are accepted.

## 6. Libraries

- `lib/image_codec.mjs`: header readers for DDS, TGA, PNG, BMP, CUR, ICO and ANI; decoders for A8R8G8B8, X8R8G8B8, R8G8B8, 16-bit RGB, L8, A8, DXT1, DXT3, DXT5, TGA (types 1, 2, 3, 9, 10, 11) and PNG; `measure()` (luminance class thresholds `LUMA` = 96 and 160, alpha kind, coverage); perceptual hashes.
- `lib/raster.mjs`: adds `tga(canvas, { origin })`, `png`, `cur`, `ico` and `ani`; `tga(canvas)` and `dds` are unchanged.
- `lib/fit.mjs`: `runFit(name, cells, target, opts)` with `nine_slice`, `exact`, `cover`, `contain`, `repeat_x`, `repeat_y`, `strip` and `same_shape`, alpha policies, flips and rotations, and the mattes moved out of `presentation.mjs` (`keyMatte`, `boxDownscale`, the strip matte, `medallionMask`) and `strip()` moved out of `ui.mjs`. `presentation.mjs` re-exports `keyMatte` and `boxDownscale`; the presentation build is byte-identical before and after the move (checked by hashing all 597 staged files).

## 7. Open items for the art tranches

- The folder order (spec 4.7) and the building order (economy) are provisional in `icons-folders` and `icons-buildings`; the jobs carry `provisional`.
- The alert and request frame meanings (`alert_frames.json`) block 5 sheets.
- The 1,500 neutral sockets and the content-like windows that stay visible (officer corps spirits, abilities, terrain strips, landmarks) are the first candidates for bespoke emblem sheets; they are `R` only because a reachable `.gui` names them.
- `ui_overrides.mjs`, `ui_cursors.mjs` and `ui_minimap.mjs` still need writing; their rows are already in `reskin.json` with the `writer` field.
