# UI overhaul: implementation plan

**Status:** Proposed (31 October 2026, stage 1). It starts when the owner has picked a visual direction (`directions/`) and answered the open questions of [07_design_system.md](../../specs/07_interface/07_design_system.md). **Inputs:** [01_audit.md](01_audit.md) (what is wrong, with counts), [07_design_system.md](../../specs/07_interface/07_design_system.md) (the rules and their checks). **Disposition:** queued until the owner's choice; each step below is closed with evidence in [TRACKER.md](../zin-lead/TRACKER.md) §1.

## How the work is cut

Work is grouped in **phases**; inside a phase the **lanes** touch disjoint files and can run in parallel. Every lane owns the builder modules, data files and generated outputs named in its row and nothing else; a lane that needs another lane's file sends a request to the lead instead of editing it. All content still goes through the builder (`tools/content/build.mjs`) and is applied only by the lead through `tools/content/apply.mts`; lanes never write the mod folder.

Every lane that changes something visible runs the same review loop (the `hoi4-scripted-gui` skill): render before, change, render after with the same scenario at 1280×720, 1920×1080 and 2560×1440 (UI scale 1) and 1920×1080 at UI scale 1.25, plus `long-text`, `hover`, `disabled` and `selected` states where the window has them; inspect the images; fix; rerender. Renders of staged builds use a temporary sibling preview folder under `mod/` with no launcher entry (as `zin_ui_preview` in this stage), deleted afterwards.

Art is generated with `tools/content/imagegen.mjs` (gpt-6-luna only) and recorded in `art/source/provenance.jsonl`; image generation is currently blocked by a revoked ChatGPT token (see the audit's blockers) and needs the owner to log in again before phase 1 art can start.

Sizes are counts of generated pictures (sheets are cut into cells, so calls are fewer: about 12 to 36 cells per sheet for icons).

## Phase 0: decisions and foundations (lead, then one worker)

**State (31 October 2026):** D1 decided (K69, K70). D2 to D5 implemented: [handoffs/phase0.md](handoffs/phase0.md) (design system accepted with area themes; icon registry; checks 10 to 18 with baseline; review harness `tools/content/ui_review.mjs` with check 19; MCP requests in [mcp_requests.md](mcp_requests.md)).

| Step | Work | Owner | Files | Done when |
| --- | --- | --- | --- | --- |
| D1 | Owner picks a direction (A, B or C) and answers the open questions of the design system (layout overrides allowed; one shared frame instead of eight themes; focus icon granularity) | owner via lead | — | answers recorded in `INTEGRATION_DECISIONS.md` as a K-decision |
| D2 | Promote the design system to Accepted with the chosen token column; delete the other two columns; update spec 02 §3 and spec 01 §12 to point at it | lead | `docs/specs/07_interface/01`, `02`, `07` | spec accepted |
| D3 | Icon registry and concept extractor: a builder module that lists every concept (focus, spirit, law, decision, category, mission, technology, doctrine, equipment, sub-unit, trait, building, resource, special project, operation, agency upgrade, MIO trait, faction, map mode, event moment) with its sprite and texture, and writes `tools/content/data/ui/icon_registry.json` (generated part) plus `icon_shares.json` (hand-kept deliberate reuse with reasons) | worker "icons-core" | new `tools/content/modules/icon_registry.mjs`, `tools/content/data/ui/icon_registry.json`, `tools/content/data/ui/icon_shares.json`, its test | the registry reproduces the audit counts (section 3 of the audit) and runs in the build |
| D4 | New checks in `tools/content/checks/ui_checks.mjs` (see "Checks to add"); they report in the build and fail only in a release build until the phases that satisfy them land | worker "checks" | `tools/content/checks/ui_checks.mjs`, `tools/content/ui_reskin.test.mjs` (negative tests) | each check has a negative test; current counts recorded as baseline |
| D5 | Render harness: a script that builds, copies the staged tree to a preview folder, runs `hoi4.gui_render` over the window list of the audit (section 2) and the ZIN scenarios, writes contact sheets and the metric checks (contrast, ground noise, raw keys) from the layout JSON, then deletes the preview | worker "checks" | new `tools/content/ui_review.mjs` (outside the build), `docs/plans/ui_overhaul/renders/` | reproduces this stage's contact sheets in one command |

## Phase 1: chrome and type (the system everyone sees)

Depends on D1 to D2. Three lanes in parallel.

| Lane | Work | Files owned | Art | Checks |
| --- | --- | --- | --- | --- |
| C1 chrome sheets | Regenerate the `chrome_panels`, `chrome_controls`, `chrome_bars` and tooltip sheets in the chosen direction with low-noise, seamless cells at full target size (no enlargement); re-plan cells; rebuild every `R` row of those families (339 rows today: `chrome_panels` 170, `chrome_controls` 169, plus the bar and tooltip cells); remove the visible walnut tiling, pixel-doubled borders and mixed materials found in the audit | `tools/content/data/ui/sheets/ui-chrome-*.json`, `ui-buttons*.json`, `ui-bars*.json`, `ui-controls-small.json`, `data/ui/cell_luma.json`, `data/ui/reskin.json` rows of those families | about 8 sheets (about 20 calls with retries) | `texture.noise`, `texture.seam`, `fit.scale`, `button.states`, builder checks 3, 5, 6, 7 |
| C2 type and colour | Build `interface/zz_zin_textcolors.gfx` (text colours to tokens, typewriter faces aliased to Garamond) as spec 02 §3.4 and §3.7 proposed; Linux check that the engine accepts the additive block | new writer in `modules/ui.mjs` (only this file part), `tools/content/data/ui/textcolors.json` | none | `text.contrast` and `text.size` baselines on the reference windows |
| C3 ZIN frame unification | Replace `GFX_zin_frame`, `GFX_zin_button`, `GFX_zin_rule` with the C1 cells (same names); add the shared meter family (groove, fill, mark), tab sprite (3 frames), row sprite (2 frames), header accent strip; stop using `gfx/interface/zin/frame.dds` as an icon fallback anywhere (move every `FALLBACK_TEXTURE` to a family "unknown" icon that fails the release build) | `modules/ui.mjs` (sprites), `interface/zin_ui.gfx` output; the `FALLBACK_TEXTURE` lines in `modules/technologies.mjs`, `warfare.mjs`, `forces.mjs`, `lib/tech_development.mjs`, `doctrine_art.mjs` (one-line edits coordinated by the lead) | 1 sheet | `icon.placeholder` |

## Phase 2: windows (layouts) — six lanes in parallel

Depends on phase 1 (chrome) being built. Each lane owns a set of windows; a vanilla `.gui` override is made only for the defects the audit lists and only after D1 allows overrides. The window lists come from the audit, section 2.

| Lane | Windows | Main fixes from the audit | Files owned |
| --- | --- | --- | --- |
| W1 top bar and map | `topbar`, `clock_window`, `mini_map_interface`, `MapmodesInterface_Ingame`, `musicplayer_window`, alerts | overlapping value texts in the top bar; date plate shows a vanilla Gregorian date; empty resource sockets; map-mode buttons using an idea picture; build the **Aoaz bar** (spec 01 §2, never built) | `modules/ui.mjs` Aoaz-bar part (new `interface/zin_aoaz_bar.gui`, `common/scripted_guis/zin_aoaz_bar.txt`), reskin rows of `topbar` and `map_interface` |
| W2 politics, diplomacy, decisions | `countrypoliticsview`, `countrydiplomacyview`, `countrydecisionview`, `diplomacy_standard_popup_window`, `peaceconference_full_window` | vanilla placeholders (`leader_name`, `ideology`) and empty ideology disc; realm lore and sign shown in the politics view (tracker requirement); faction logos still vanilla | reskin rows of `politics_diplomacy`; a politics-view override if D1 allows; `modules/diplomacy.mjs` faction logo sprites |
| W3 focus, research, doctrine | `nationalfocusview`, `countrytechtreeview` (ZIN-owned), `countrydoctrineview`, `countrytechnologyview` | folder tabs truncate their names ("Arms and Arr…") and empty tabs remain; era labels collide with the tab row; tiled background; focus plaque and filters | `modules/technologies.mjs` (the `countrytechtreeview.gui` writer only), reskin rows of `focus` and `research_production` |
| W4 economy and military | `countryproductionlineview`, `countryconstructionsview`, `countrytradeview`, `countrylogisticsview`, `countrydeploymentview`, `countryarmyview`, `naviesview_window`, `strategicairview`, `theatre_selection_window`, `landcombatview`, `navalcombatview`, `unitleaderwindow`, `countryintelligenceagencyview`, `countryintelledger` | vanilla words in labels ("Military Factories", "Dockyards"); empty resource and building sockets; three materials in one window | reskin rows of `research_production`, `military`; wording through the text sweep owner |
| W5 events and dialogs | `EventWindow`, `EventWindow_News`, `world_tension_popup`, `ingamemenu`, `menu_settings`, tooltips | event body on parchment, option buttons, picture frame; tooltip panel; dialog standard | reskin rows of `events`, the tooltip cells |
| W6 frontend | `frontend_background`, `mainmenu_panel_bottom`, `mainmenu_single_player`, `frontendgamesetupview`, `gamesetup_country_details`, `game_rule_window`, `load_screen` | spec 03 never finished: bookmark, country selection with portraits, flags and realm lore, rules screens | `modules/presentation.mjs` frontend part, spec 03 templates |

ZIN windows (one lane, W7, because they share `lib/mech_court_gui.mjs`):

| Lane | Windows | Main fixes | Files owned |
| --- | --- | --- | --- |
| W7 ZIN panels | `zin_realm_window` and button, `zin_court_window` (4 tabs), `zin_council_window` (3 tabs), `zin_horde_window`, `zin_accord_window`, `zin_dominion_window`, `zin_watch_window`, `zin_strait_window`, `zin_mistake_window`, `zin_interim_inlay_window` | overlapping conditional texts (court tab 1, "The Hidden Hand" line); divider rule reused as a meter groove; no header art; selected tab not shown; fixed rows; one primary value per tab; remove the realm button when the Aoaz bar lands | `lib/mech_court_gui.mjs`, `modules/mech_dark_panels.mjs`, `modules/mech_powers_ui.mjs`, `modules/ui.mjs` realm part, `common/scripted_guis/zin_*.txt` outputs |
| W8 super event | `zin_super_event_window` | art and licensed audio still pending (32 moments); apply the chosen frame; check queue and mute states | `modules/super_events.mjs` |
| W9 Chronicle | the Chronicle window of spec 04 (not built) | build to the design system | new module per spec 04 |

## Phase 3: icon production by family (runs beside phase 2)

Depends on D3 (registry) and D1 (direction: the icon frames and style follow it). Each family is one lane; lanes write only their family's sheets, cell maps and gfx writer. Counts come from the audit (section 3); "new pictures" is the number of distinct concepts that need their own picture after the deliberate-reuse rules.

| Lane | Family | Concepts | Have own picture today | New pictures (target) | Writer files owned |
| --- | --- | ---: | ---: | ---: | --- |
| I1 | Technologies | 285 | 0 (all on the shared frame) | 285 | `modules/technologies.mjs` icon part, `interface/zin_technologies.gfx` |
| I2 | Equipment (archetypes and types) and equipment designer | 151 | 3 (vanilla motorised and train leftovers) | about 151 (tiers by the tier rule) | `modules/warfare.mjs` icon part, `modules/forces.mjs` designer part, `interface/zin_equipment.gfx`, `zin_equipment_designer.gfx` |
| I3 | Sub-units and counters | 65 sub-units; counters per custom unit | 0 | 65 unit icons; counters by the 3D pipeline's counter handoff | `modules/warfare.mjs` unit part, `interface/zin_units.gfx` |
| I4 | Focus icons | 4,817 focuses on 178 textures | 7 textures serve one focus | per D1 answer: one per distinct concept (estimate 2,500 to 3,000 after merging identical generic focuses across regional trees) | `modules/presentation.mjs` focus catalogue part, `modules/focus_compiler.mjs` icon assignment |
| I5 | National spirits, laws, advisors | 1,614 country ideas on 175 textures | 16 textures serve one idea | estimate 1,100 to 1,300 (spirits granted by a same-named focus reuse its art by the "same concept" rule) | `modules/presentation.mjs` idea catalogue part |
| I6 | Decisions and categories | 249 decisions on 105 textures; 50 categories on 39 | 46 / 31 | about 200 decision icons in the decision family style (small round seals), 50 category icons, 15 category pictures | the mechanic modules' gfx writers (`mech_*.mjs`, `institutions.mjs`); coordinated by the lead because they span several modules |
| I7 | Institutions | special projects 43 sprites on 13 textures, operations 40 on 19, agency upgrades 21 on 20, agency logos 15 (all idea pictures), MIO 26 on 22, scholar traits 9 | few | about 150 in their own families | `modules/institutions.mjs` |
| I8 | Traits | 306 unit and country leader traits with no ZIN icon (100 vanilla trait pictures reach the screen) | 0 | about 300 trait emblems (trait banner family) | the character modules' trait writers (`characters.mjs`, `institutions.mjs` chiefs) |
| I9 | Factions | 19 factions on 34 vanilla generic logos | 0 | 19 × 2 sizes | `modules/diplomacy.mjs` |
| I10 | Event and news pictures | 1,213 visible events on 42 pictures; 84 news on 26 | 0 events have a picture of their own | one picture per chain beat (estimate 300 to 400 events pictures, 60 news) | `modules/presentation.mjs` event part and the event modules' picture assignment |
| I11 | Map modes, top bar, alerts, text icons, resources, buildings | reskin icon families and ZIN map modes | partly | map-mode icons for ZIN modes (footholds and the others), resource and building icons where the render shows empty sockets | reskin sheets of those families, `mech_afrit.mjs` map-mode sprites |

Icon lanes I1 to I3 are the first priority: they remove the 648 placeholder sprites, the most visible fault after the chrome.

## Checks to add to `tools/content/checks/ui_checks.mjs`

| Id | Name | What it measures | Pass |
| ---: | --- | --- | --- |
| 10 | `icon.registry` | concept to texture map; textures with more than one concept must have an allowed `icon_shares.json` entry | 0 unexplained shares |
| 11 | `icon.placeholder` | sprites resolving to `gfx/interface/zin/frame.dds` or any listed placeholder | 0 |
| 12 | `icon.family_size` | each family's sprites have the family size and frame count; no texture used across families without a share entry | 0 |
| 13 | `chrome.family` | every level-0 window texture (reskin and ZIN) comes from the accepted chrome sheets | 0 |
| 14 | `texture.noise` | luminance standard deviation of panel cells | ≤ 0.05 |
| 15 | `texture.seam` | seam score of repeat-fit outputs | ≤ 0.02 |
| 16 | `fit.scale` | scale factor from cell to target in the fit log | ≤ 1.0 |
| 17 | `button.states` | distinct frames per state; disabled desaturated | 0 findings |
| 18 | `layout.grid` | ZIN `.gui` positions and sizes on the 4 px grid; font roles from the table | 0 findings |
| 19 | `text.render_metrics` (in the render harness D5, not the build) | contrast, ground noise, raw keys, overflow from render images and layout JSON | thresholds of the design system §9 |

Builder check 4 (reachability) must reach zero; its 280 findings are closed by I6 to I9 (vanilla trait, idea, technology, decision, faction and focus pictures still reached).

## Review and Linux steps

1. After each lane: matched before and after renders at the four resolutions and the states above, a contact sheet in `docs/plans/ui_overhaul/renders/<lane>/`, the metric report of D5, and a handoff in `docs/plans/ui_overhaul/handoffs/<lane>.md`.
2. After phase 1 and again after phase 2: the lead applies the build and runs the isolated Linux live run under the shared WSL lock (spec 02 acceptance 9) at 1600×900 as Aenor and as the Magical Forest; captures of the main menu, the top bar with the Aoaz bar, an event, the focus tree, research, production, construction, diplomacy, decisions, the pause menu, the options, a tooltip and each ZIN panel; `error.log` has no texture, sprite or font line caused by ZIN.
3. Owner review of the capture sheet after phase 2; the UI rows of the tracker turn Done only after that review and the checks of the design system pass.

## Order and size

| Phase | Lanes in parallel | Size (rough) |
| --- | --- | --- |
| 0 | D3 + D4 + D5 (after D1 and D2) | small |
| 1 | C1, C2, C3 | about 10 sheets; about 350 rebuilt textures |
| 2 | W1 to W9 | 9 lanes; the Aoaz bar and the Chronicle are new windows |
| 3 | I1 to I11 (beside phase 2; I1 to I3 first) | roughly 5,000 to 6,000 new icons and pictures in about 250 to 350 sheets; the largest part of the overhaul |

Lanes that never share files: C1/C2/C3 inside phase 1; W1 to W9 (W3 owns only the tech-tree `.gui` writer of `technologies.mjs`, I1 owns only its icon writer: these two must be done in sequence or with the lead splitting the module first); I1 to I11 (I4, I5 and I10 share `presentation.mjs`: split it into `presentation_focus.mjs`, `presentation_ideas.mjs`, `presentation_events.mjs` before they start, as a lead step).
