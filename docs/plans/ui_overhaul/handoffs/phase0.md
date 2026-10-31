# UI overhaul phase 0: handoff (steps D2 to D5)

**Date:** 31 October 2026. **Branch:** `zin/integration-r3` (base `56f78e71`), uncommitted. **Owner decisions:** K69, K70. **Disposition:** D2 to D5 implemented with evidence below; nothing committed (the lead commits through `hoi4-shared-git-commit`; the flag agent's files in the same working tree are not part of this change). **Skills used:** `hoi4-scripted-gui` (render workflow, matched renders), `hoi4-feature-assets` (icon families, sizes, provenance rules).

## What changed

| Step | Files | What |
| --- | --- | --- |
| D2 | `docs/specs/07_interface/07_design_system.md` (rewritten, Accepted), `tools/content/data/ui/design_system.json` (new), `docs/specs/07_interface/01_interface.md` §12, `docs/specs/07_interface/02_full_ui_reskin.md` §3 | Shared rules kept (grid, type, states, icon rules, checks); the three alternative token columns replaced by three area themes (Banner Hall, Chancery, Chronicle) and the neutral family, each with named tokens sampled from the direction images (region and method recorded per token in the JSON), material, frame, header, meter, tab and icon specs; a theme for every audited window (§7, also `windowThemes` in the JSON); icon family sizes; K69 targets; the vanilla kept register (§10, 15 rows: 9 confirmed, 6 to verify on Linux); specs 01 §12 and 02 §3 marked superseded with pointers |
| D3 | `tools/content/modules/icon_registry.mjs` (new), `tools/content/data/ui/icon_registry.json` (generated, 9,214 concepts), `tools/content/data/ui/icon_shares.json` (hand-kept: K69 target rules per family and 226 proposed `general_focus` groups), `tools/content/icon_registry.test.mjs` (new, 7 tests), `tools/package.json` (test list) | Concept extractor over 26 families (the audit's 14 plus special projects, operations, agency upgrades and logos, MIO and MIO traits, scholar traits, doctrines, factions, map modes, resources, super events), sprite resolution mod over vanilla, sharing statistics, the K69 general-focus rule, share validation, targets, audit drift; runs in every build |
| D4 | `tools/content/checks/ui_checks.mjs` (checks 10 to 18, `runDesignChecks`, `enforced`, `baselineDelta`), `tools/content/ui_reskin.test.mjs` (10 tests: one per check with negatives, and the gating test), `tools/content/data/ui/check_baseline.json` (new), `tools/content/build.mjs` (wiring, `ZIN_RELEASE=1`), `tools/content/lib/fit.mjs` (`scaleOf`: every fit writes `scale <n>` into the reskin manifest ops, the fit log check 16 reads) | Checks report in every build with their delta to the baseline; a normal build fails only on checks 1 to 9 as before; `ZIN_RELEASE=1` enforces every failing UI check (4 and 10 to 18 included) |
| D5 | `tools/content/ui_review.mjs` (new, outside the build), `tools/content/data/ui/review_windows.json` (new), `docs/plans/ui_overhaul/renders/review/` (sheets and metrics), `docs/plans/ui_overhaul/mcp_requests.md` (new) | One command: build, hard-link the staged tree into a preview mod, render the audit's window set and ZIN scenarios plus two focus trees, write the nine contact sheets and the check 19 metrics, delete the preview, the tool's workspace storage and state, and the staged tree |

## Evidence

- **Audit counts reproduced.** The build prints `icon registry: the 31 October audit counts reproduce` (every field of 01_audit.md §3.1 for the 14 audited families, 110 cross-family textures, 648 frame sprites). Two counting details are now explicit in the module: laws and officer-corps spirits are compared per idea category as the audit summed them (as one family, `spear_levy.dds` serves two officer spirits, so 26 textures rather than 27), and the frame's own sprite `GFX_zin_frame` is not a placeholder use (`placeholderOwners`).
- **Renders reproduce the audit.** Through the harness, `zin_realm_window` and `zin_court_window` tab 1 at 1920 × 1080 give the same full-PNG hashes as the audit (`19eb94d7a650`, `54a8b020f6eb`); the harness also confirms by measurement the audit's eye finding on the doctrine view (column titles `#ffffff44` at 2.17:1 to 2.33:1 against walnut).
- **Tests.** `ui_reskin.test.mjs` and `icon_registry.test.mjs`: 71 of 71 pass. Verify (`verify.sh ui0`, build and full suite): build exit 0; 1,735 tests, 1,732 pass, 1 skipped, 2 fail, both flag tests of `build.test.mjs` that the flag agent's working files affect ("Flag jobs copy the layout of an accepted sheet only...", "The realm flag cell map covers every realm once...").

## Baseline counts (phase 0 build, `tools/content/data/ui/check_baseline.json`)

| Check | Problems | Breakdown | Pending |
| ---: | ---: | --- | ---: |
| 10 `icon.registry` | 400 textures | 8,698 concepts on textures with no deliberate share | 0 |
| 11 `icon.placeholder` | 648 | sprites on `gfx/interface/zin/frame.dds` | 0 |
| 12 `icon.family_size` | 428 | 260 wrong size, 31 missing textures (the super-event pictures), 137 cross-family textures | 0 |
| 13 `chrome.family` | 115 | 114 level-0 reskin textures from not-yet-accepted sheets, 1 ZIN frame | 0 |
| 14 `texture.noise` | 3 | panel bodies above 0.05 | 10 |
| 15 `texture.seam` | 91 | tiled bodies with a visible join (the audit's walnut checkerboard) | 12 |
| 16 `fit.scale` | 292 | reskin outputs whose cell is enlarged | 0 |
| 17 `button.states` | 766 | 708 buttons with identical normal and hover (or pressed) frames, 58 coloured disabled frames | 89 |
| 18 `layout.grid` | 1,060 | 1,024 off the 4 px grid (815 in the generated `countrytechtreeview.gui`), 36 fonts without a role | 0 |
| 19 `text.render_metrics` | see below | harness | — |

Icon targets (K69, `icon_registry.json` `targets`): focus 4,313 pictures for 4,817 focuses (226 general groups of 730 focuses, proposed), spirits 1,614, decisions and missions 249, events up to 1,213, news 84, technologies 292, equipment 116 and archetypes 35, sub-units 85, traits 306, and one per concept in every other family (design system §4.5).

## Review harness run

One command, `node tools/content/ui_review.mjs` from the repository root, 31 October 2026: build, 196 renders (the audit's exact set, appendix A) plus two focus-tree renders, 0 errors, 966 s with two server processes; the nine contact sheets in `docs/plans/ui_overhaul/renders/review/` have the audit sheets' layout and pixel sizes (for example `zin_panels_a.png` 2280 × 3490); the ten ZIN render hashes compared (realm, court tabs 1 and 2, council, horde, watch, presence, super event, inlay, technology tree at 1920 × 1080) all equal the audit's. Afterwards the preview, the private workspace storage and state and the staged tree were gone (free disk back to 9.7 GB). The two focus-tree renders of this run are at full scale (5232 × 2672); the harness now asks for `reviewScale: 0.5`, the audit's size, from the next run.

Check 19 (`metrics.md`, `metrics.json`): 1,995 visible text elements; contrast below threshold 20 (14 in Chronicle windows, among them the five doctrine column titles; 6 in Chancery windows); busy ground 224 (144 in Banner Hall windows, the tiled walnut bodies); raw keys 246 (234 in Chancery windows, almost all `[dynamic_loc]` and engine keys the offline model cannot fill, audit §1 fidelity limits); overflow 36 (30 in Banner Hall windows, mostly top-bar values and dates).

## Deviations from the brief, with reasons

1. **Preview location.** The brief names a preview folder under `mod/`. The harness instead runs the tool with a private server configuration (`HOI4_AGENT_CONFIG` pointing at `%TEMP%/zin-ui-review/config.json`, whose only mod root, state and workspace storage are in `%TEMP%`) and hard-links the staged tree there: nothing is copied into the OneDrive mod folder (no upload, no disk cost), the owner's tool configuration is untouched, and the workspace storage is deleted with the preview. `--under-mod` keeps the brief's route (a hard-linked `mod/zin_ui_preview` with no launcher entry, deleted afterwards).
2. **Vanilla windows from the staged build.** The audit rendered vanilla windows from the installed mod (last applied build `df221bbb`); the harness renders them from the fresh staged build, which is what each phase changes. Hashes of vanilla windows therefore differ where the build differs from the installed mod.
3. **`lib/fit.mjs` touched.** Check 16 needs a fit log; the smallest honest source was one op string per fit (`scale <n>`) in the reskin manifest. No texture changes; the manifest's `ops` lists gain one entry each.
4. **Committed registry test.** The registry test checks that reuse is never worse than the audit rather than equal to it, so icon lanes can regenerate `icon_registry.json` as they ship pictures; exact reproduction is shown by the build line above.

## Open items for the lead

- Owner review: the lead mapping rows of design system §7 and the 226 proposed general focus groups (§4.5).
- Phase 1 lanes must add their accepted sheet ids to `acceptedChromeSheets` (and `zinFrameSheets` for `GFX_zin_frame*`) in `design_system.json`; check 13 reads only that list.
- Family sizes for technology, special projects and map modes are marked "confirms" for lanes I1, I7 and I11.
- MCP requests R1 to R5 in `mcp_requests.md` (R3, measured contrast in the layout JSON, is the high one); none blocks phase 1.
- Disk: the stage 1 workspace `%LOCALAPPDATA%/hoi4-agent-tools/workspaces/mod_zin_86bac5c64231` still holds 518 MB of audit artifacts; not deleted here (it is the user's tool cache of the installed mod).
