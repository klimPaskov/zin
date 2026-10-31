# UI overhaul: requests to the HOI4 Agent Tools MCP

**From:** phase 0 of the UI overhaul (step D5, the render harness `tools/content/ui_review.mjs`), 31 October 2026. **For:** the lead to forward to the MCP worker session. **Tool version:** hoi4-agent-tools 4.6.1 (`runtime-v461`, the newest installed). **Disposition:** queued for the MCP worker; the harness works today through the workarounds named in each request, so none of them blocks phase 1.

## R1. Render a staged tree without a mod-folder copy

| Field | Content |
| --- | --- |
| Task | Render windows of a freshly built, not yet applied ZIN tree (the builder writes it to `%TEMP%`; the owner's rule is that only the lead applies it to the mod folder). |
| Tool | `hoi4.gui_render`, `hoi4.gui_inspect`, `hoi4.focus_render` |
| Inputs | a directory path holding a mod tree (`interface/`, `gfx/`, `localisation/`, `common/`, `descriptor.mod`) |
| Current behaviour | `workspaceId` resolves only folders under the configured `modRoots` (`%APPDATA%/hoi4-agent-tools/config.json`). The stage 1 audit copied the staged tree into `mod/zin_ui_preview` (inside OneDrive, about 1 GB, deleted afterwards). The harness now writes a private config (`HOI4_AGENT_CONFIG` with `modRoots`, `serverStateRoot` and `workspaceStorageRoot` under `%TEMP%/zin-ui-review/`) and hard-links the staged tree into `%TEMP%/zin-ui-review/mods/zin_ui_preview`, which works but needs a second server configuration per run. |
| Wanted change | An optional `modPath` (or `sourceRoot`) argument on the GUI and focus tools that renders the tree at that path as a temporary, read-only workspace, with its artifacts in a caller-named or temporary store that the call can delete (`ephemeral: true`). |
| Evidence | `tools/content/ui_review.mjs` (`makePreview`, the private config in `main`); the probe render of `zin_realm_window` through the private config gave the same full PNG as the audit (sha256 prefix `19eb94d7a650`). |
| Priority | Medium (workaround in place). |
| Acceptance | `hoi4.gui_render { modPath: "<staged dir>", windowName: "zin_realm_window", ... }` returns the same `-full.png` hash as a render of the same tree under a mod root, writes nothing under `%LOCALAPPDATA%/hoi4-agent-tools/workspaces`, and leaves no files after the call when `ephemeral` is set. |

## R2. Choose which artifacts a render writes

| Field | Content |
| --- | --- |
| Task | Render about 200 window and state combinations per review on a disk with about 8 to 15 GB free. |
| Tool | `hoi4.gui_render` |
| Inputs | the usual render arguments |
| Current behaviour | Every call writes 27 artifacts (full, cropped, annotated, click-region, source-map, hierarchy, scenario-matrix, state-matrix, resolution-scale and comparison images in SVG and PNG, plus layout, fidelity, source-graph and validation JSON), about 5 MB per render; the stage 1 workspace kept 518 MB. The harness reads only `-full.png` and `-layout.json` and deletes each render's artifact folders by hand after reading them. |
| Wanted change | An `artifacts` filter, for example `["full.png", "layout.json"]`, so only the named artifacts are produced and stored. |
| Evidence | stage 1 workspace `mod_zin_86bac5c64231/artifacts` (518 MB); the harness's per-render cleanup in `ui_review.mjs` (`artifactDir`). |
| Priority | Medium. |
| Acceptance | a render with the filter writes exactly the named artifacts; the full PNG is byte-identical to an unfiltered render of the same scenario. |

## R3. Contrast and ground measurement per text element

| Field | Content |
| --- | --- |
| Task | Design system check 19 (`text.render_metrics`): contrast of every visible text against its ground (4.5:1 under 20 px, 3:1 from 20 px) and the luminance deviation of the ground behind it (at most 0.06), with the glyphs masked. |
| Tool | `hoi4.gui_render` (layout JSON and diagnostics) |
| Inputs | the rendered scene |
| Current behaviour | The layout JSON gives each text element's rectangle, colour (with alpha), font size, lines, overflow and unresolved tokens, but no measured ground. The harness measures it itself from the full PNG: it masks pixels near the text colour plus the 30% nearest to it, blends an alpha colour over the measured ground and computes the WCAG ratio. That is an approximation: the renderer knows the exact glyph coverage and what is drawn beneath the text, the harness does not. |
| Wanted change | Per text element in the layout JSON: `ground.mean` (RGB under the glyph box, glyphs excluded, from the composited layers below the text), `ground.lumaStd`, the drawn text colour after alpha and colour codes, and `contrast` (WCAG ratio); optionally a diagnostic `GUI_TEXT_LOW_CONTRAST` with a caller-set threshold. |
| Evidence | `textMetrics` in `tools/content/ui_review.mjs`; on the staged build it finds the doctrine column titles at 2.17:1 to 2.33:1 (`#ffffff44` on walnut), the defect the audit saw by eye (01_audit.md §2.4). |
| Priority | High (it is the main readability check of phase 2). |
| Acceptance | for `countrydoctrineview` at 1920 × 1080 the tool reports the five `*_title` elements below 3:1 and the `*_desc` elements above it; the values agree with the harness within 0.3. |

## R4. Contact sheets of several renders

| Field | Content |
| --- | --- |
| Task | One review sheet per surface group: rows are windows or tabs, columns are resolutions and states, every tile labelled "offline render, tool-generated". |
| Tool | a new `hoi4.gui_contact_sheet`, or a `layout: "sheet"` option of a batch render |
| Inputs | a list of render requests (window, scenario, resolution, states) and a column order |
| Current behaviour | Each call renders one window; the harness runs two server processes in parallel and composes the sheets itself with `sharp`. |
| Wanted change | A batch call that renders a list in one indexed session and returns one sheet image plus the per-render diagnostics and hashes. |
| Evidence | `contactSheet` and the worker loop in `ui_review.mjs`; the nine sheets in `docs/plans/ui_overhaul/renders/review/`. |
| Priority | Low (the harness covers it). |
| Acceptance | the batch reproduces the per-render full-PNG hashes of single calls and returns one sheet per request list. |

## R5. Interaction states as one matrix per element

| Field | Content |
| --- | --- |
| Task | Design system §6.2 and check 17 on renders: normal, hover, pressed, disabled and selected frames of every button and tab of a window, side by side. |
| Tool | `hoi4.gui_render` (`states`) |
| Inputs | a window and a list of states |
| Current behaviour | `states` applies one state to the whole window per render (the audit used `long-text`); a per-element state matrix needs one render per state and a crop per element. |
| Wanted change | A `-control-states.png` artifact: for every clickable element, a strip of its frames in each requested state, with the element name and the sprite frame used. |
| Evidence | builder check 17 finds 708 reskinned buttons whose normal and hover frames are identical (`tools/content/data/ui/check_baseline.json`), which no window render shows. |
| Priority | Medium. |
| Acceptance | for `zin_court_window` the artifact shows the four tab buttons in normal, hover, pressed and selected, and marks a pair of identical frames. |
