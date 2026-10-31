# UI overhaul: inventory and audit

**Date:** 31 October 2026. **Stage:** 1 of the owner's complete UI overhaul (brief of 31 October 2026). **Disposition:** findings feed [07_design_system.md](../../specs/07_interface/07_design_system.md) (proposed) and [02_plan.md](02_plan.md) (queued until the owner picks a direction). **Branch and sources:** `zin/integration-r3` at `c34eecc7`, the installed mod folder (last applied build `df221bbb`, 25 October) and a fresh staged build of the current sources (`tools/content/build.mjs`, 31 October). **Tool:** HOI4 Agent Tools 4.6.1 (`hoi4.gui_render`, `hoi4.focus_render`), offline source renders only.

## 0. Summary

The interface is not finished and has never been reviewed as a player sees it. What exists is a large mechanical reskin that puts generated textures into vanilla layouts, eleven ZIN windows built from one early frame, and content icons drawn from very small catalogues. Concretely:

- **The reskin works as a pipeline but not as a design.** 3,476 vanilla textures are planned for replacement and 3,139 are built (202 pending, 135 delegated). The renders show the same window wearing three or four materials at once (walnut, brass plate, slate, parchment), a visible checkerboard of tiled walnut in every large panel body, blocky pixel-doubled frame borders where small sheet cells were enlarged, empty resource and building sockets, and vanilla wording inside reskinned frames ("Military Factories", "Dockyards", "Create Agency", "Experimental Facilities"). Builder checks 3, 5, 6 and 7 are pending and check 4 (reachability) fails with 280 vanilla content sprites still reachable.
- **ZIN's own windows are functional prototypes.** The Realm panel and the nine mechanic panels share one frame and one divider; meters are the divider sprite with a wax-seal knob; there is no header art, no selected-tab state and no shared meter, row or tab sprite; conditional texts overlap where both branches are unresolved; long text overflows titles and tabs. The **Aoaz bar** (spec 01 §2) and the **Chronicle** (spec 04) were never built, although the tracker listed the bar as built. Only the super-event window had iterative MCP previews (six passes in its framework handoff).
- **Icons are heavily and accidentally reused.** 4,817 focuses use 178 pictures (155 focuses share the most used one; only 7 pictures serve a single focus); 1,614 national spirits use 175 pictures; 1,213 visible events use 42 pictures (239 share the most used one); 249 decisions use 105 idea pictures; and 648 sprites (285 technologies, 113 equipment types, 32 archetypes, 64 sub-units and more) show `gfx/interface/zin/frame.dds`, the Realm panel's window frame, as their icon. 741 sprite names across ten families point at the 175 idea pictures. Laws, faction logos and 100 leader traits still show vanilla pictures.
- **History.** The interface specs 01 to 06 were marked Ready on 19 October; spec 02's acceptance renders, review sheets, overflow and contrast checks and Linux captures were never run; no surface has had a design review. This audit is the first matched render pass across the interface.

Image generation for the three visual directions is **blocked**: the owner's ChatGPT token used by `tools/content/imagegen.mjs` is revoked (`401 token_revoked`, 31 October, two attempts). The job file is ready at `directions/jobs.json`; the owner must log in again (`npm run login` in `C:/Users/klimp/tools/gptimage`) before the mock-ups and component sheets can be generated. Section 6.

## 1. Method and evidence

| Item | Value |
| --- | --- |
| Vanilla windows | rendered from the installed mod (workspace `mod_zin_86bac5c64231`, `current`), which holds the reskin textures of the last applied build; 42 root windows (spec 02 acceptance 2 list plus the frontend, popups, alerts, army, leader and ledger views) |
| ZIN windows | rendered from a temporary preview folder `mod/zin_ui_preview` (workspace `mod_zin_ui_preview_e247efd8b068`, no launcher entry, deleted after this stage) holding the window-relevant part of a fresh staged build (`interface`, `gfx`, `localisation`, `common`, `events`, `portraits`, `descriptor.mod`), because the installed mod lacks the super-event window and later panel changes |
| Scenarios | `date 1936.1.1` (engine date; the ZIN calendar is localisation), viewer Aenor (`AEN`) unless the panel belongs to another realm; panel open flags and `zin_ui_tab` set per tab; `generatedScenarios` disabled so every render is the stated fixture |
| Resolutions | 1920×1080 (UI scale 1) and 1280×720 (UI scale 1) for every window; 2560×1440 at UI scale 1 for the Realm panel and its button, all four Golden Court tabs and its button, Hidden Council tab 1, the Presence tab 1 and the super event; `long-text` state at 1920×1080 for every window except the second and later tabs of tabbed panels |
| Outputs | full PNG, annotated PNG and state-matrix PNG per render, copied from the artifact store by SHA-256; contact sheets in [renders/](renders/) labelled "offline render, tool-generated"; per-render diagnostic counts and PNG hashes in appendix A |
| Icon counts | a scan of the staged build's `common/`, `events/` and `interface/*.gfx` (vanilla `.gfx` as fallback) resolving every concept to its sprite and texture file; method and numbers in section 3 |
| Builder state | the staged build's report (`ui`: r 3,476, built 3,139, pending 202, delegated 135; checks `1 pass, 2 pass, 3 pending, 4 fail, 5 pending, 6 pending, 7 pending, 8 pass`) and `docs/design/ui/check_report.json` |

**Fidelity limits.** The renderer is an offline source model. It does not run the engine, so engine-populated content is absent or shown as a token: lists of ideas, decisions, focuses, divisions and states are empty; engine titles show their key (`NATIONAL_FOCUS_TITLE`, `STATE_NAME_TEST`, `leader_name`); dynamic scripted localisation shows `[dynamic_loc]` unless a value is supplied; the date shows a vanilla Gregorian format. Those are recorded as renderer limits, not ZIN defects. Everything about chrome, layout, materials, sprites, fonts, static text, clipping and click regions is source evidence. No Linux capture was taken in this stage (the brief limits this stage to offline evidence); the Linux pass is a plan step.

## 2. Surface inventory and findings

History codes: **R** built and reviewed; **B** built, never reviewed (no matched render or in-game review); **P** provisional (mechanical output, never designed); **M** missing (specified, not built); **V** vanilla leftover (vanilla art or layout still visible).

### 2.1 Frontend, loading and menus

| Surface | Window(s) | History | What the player sees | Problems |
| --- | --- | --- | --- | --- |
| Loading screen | `load_screen` | P | 24 generated loading pictures, a generated tip band and progress bar (presentation.mjs) | frame and pictures never reviewed together; tips are text-only |
| Main menu | `frontend_background`, `mainmenu_panel_bottom`, `mainmenu_single_player` | P + V | a generated harbour-city background (Parim at dusk) and the ZIN emblem in the vanilla menu layout | spec 03 layout, DLC and tutorial hiding, credits never built; "Tutorial" (vanilla, Germany) still offered; vanilla social and DLC buttons remain |
| Bookmark, country selection | `frontendgamesetupview`, `gamesetup_country_details` | P + V | one bookmark with an interim war-like text; reskinned vanilla country list | spec 03 §3 and §4 (great realms row, portraits, flags, realm lore) never built |
| Game rules, difficulty | `game_rule_window` | P | ZIN rules with generated rule icons in vanilla rows | never reviewed |
| Pause menu, settings | `ingamemenu`, `menu_settings` | P + V | reskinned vanilla, small-caps typewriter buttons | "Hearts of Iron Wiki" and "Playthrough Overview" remain; never reviewed |

### 2.2 Always on screen

| Surface | Window(s) | History | What the player sees | Problems |
| --- | --- | --- | --- | --- |
| Top bar | `topbar` | P | wood-and-brass band, generated toolbar emblems (scales, hammer, anvil, banner, book, map) | value texts overlap the badge sockets on the second row ("999" over the seal and lamp badges); the first-row resource icons are faint silhouettes with low contrast; the date value is cut ("2/12/1:"); 12 overlapping click regions (the speed and pause stack, engine-owned) and the music buttons overlap by 9% |
| Aoaz bar | `zin_aoaz_bar_window` | **M** | nothing: only the old "Realm" button under the flag | specified in spec 01 §2 and listed as built in the tracker; no `.gui`, scripted GUI or sprite exists in the build |
| Clock, minimap, map modes, music | `clock_window`, `mini_map_interface`, `MapmodesInterface_Ingame`, `musicplayer_window` | P | reskinned vanilla | ZIN map mode buttons (footholds) use an idea picture for both selected and deselected frames |
| Alerts and notifications | `global_alerticon_window`, popups | P | generated alert emblems | 19 alert textures of 95 planned built; never reviewed |

### 2.3 Country, politics, diplomacy, decisions

| Surface | Window(s) | History | What the player sees | Problems |
| --- | --- | --- | --- | --- |
| Politics | `countrypoliticsview` | P + V | brass title band, walnut body, slate goal plate, parchment-free | four materials in one window; the ideology emblem is a plain gold disc; the lower panel body shows a strong tiled walnut checkerboard and a blocky, pixel-doubled bronze border; realm lore and sign (K67) not shown anywhere; laws show vanilla pictures (18 economy, trade and mobilisation laws use `idea_war_economy.dds` and the rest, not shipped by ZIN) |
| Diplomacy | `countrydiplomacyview` | P + V | same materials; tiled body | faction logos are vanilla generic logos (34 textures, 19 factions); tiled body |
| Decisions | `countrydecisionview` | P | tiled body, brass frame | decision and category icons are idea pictures (section 3) |
| Peace conference, diplomatic popups | `peaceconference_full_window`, `diplomacy_standard_popup_window` | P | reskinned vanilla | never reviewed |

### 2.4 Focus, research, doctrine

| Surface | Window(s) | History | What the player sees | Problems |
| --- | --- | --- | --- | --- |
| Focus tree | `nationalfocusview` | P | tiled walnut board, typewriter header "Continuous Focuses" in low-contrast grey, a black empty search box | focus icons: 4,817 focuses on 178 pictures; tiled background visible behind the tree |
| Research | `countrytechnologyview` | P + V | walnut band and body with empty slot boxes | "Experimental Facilities" vanilla wording; tiled body |
| Technology tree (ZIN-owned `.gui`) | `countrytechtreeview` | B | eight folder tabs, era rows labelled by age | folder tab labels truncate ("Arms and Arr…", "Engines and W…", "Lore and Wa…", "Galleys ar…"); two empty folder tabs at the right; the era label "Before 1650" collides with the tab row; every technology and equipment tile shows the shared frame (section 3); tiled board |
| Doctrines | `countrydoctrineview` | P + V | four doctrine columns | column titles dark on dark (not legible); static vanilla text of the special forces doctrine ("Marine Corps", "paratroopers", "Airborne assault") in the layout; tabs "Land Doctrine, Naval Doctrine, Air Doctrine, Special Forces" in vanilla words |

### 2.5 Economy and military

| Surface | Window(s) | History | What the player sees | Problems |
| --- | --- | --- | --- | --- |
| Production | `countryproductionlineview` | P + V | brass sides, walnut body, slate tab | resource sockets render empty; "Military Factories", "Dockyards" vanilla words; three materials |
| Construction, trade, logistics, deployment | `countryconstructionsview`, `countrytradeview`, `countrylogisticsview`, `countrydeploymentview` | P + V | same family | empty sockets; tiled bodies; 7 click-region conflicts in construction |
| Intelligence | `countryintelligenceagencyview`, `countryintelledger` | P + V | walnut and a parchment column | vanilla words ("Create Agency", "Cryptology", "Operatives can't be recruited"); agency logos are idea pictures |
| Army, navy, air, theatres | `countryarmyview`, `naviesview_window`, `strategicairview`, `theatre_selection_window` | P | reskinned vanilla | 64 sub-unit icons are the shared frame |
| Combat | `landcombatview`, `navalcombatview` | P | slate body, a generated terrain strip | slate here and walnut elsewhere; never reviewed |
| State view | `countrystateview` | P | walnut, generated terrain picture | building and modifier sockets empty in the static render |
| Leaders | `unitleaderwindow` | P + V | reskinned vanilla | 100 vanilla trait pictures reachable; 306 ZIN traits without a ZIN icon |

### 2.6 Events and super events

| Surface | Window(s) | History | What the player sees | Problems |
| --- | --- | --- | --- | --- |
| Event | `EventWindow` | P + V | parchment clipboard with a bulldog clip and a paperclip, typewriter faces | 1,213 visible events on 42 pictures; five "generic" pictures carry 684 events |
| News | `EventWindow_News` | P | reskinned broadsheet | 84 news events on 26 pictures |
| Super event | `zin_super_event_window` | B (six MCP passes in its framework handoff) | full-screen ZIN window | 32 moments; art and licensed audio still pending |
| World tension popup | `world_tension_popup` | P + V | vanilla popup; title "World Tension history" | the Gathering Dark relabel does not reach this popup; never designed |

### 2.7 ZIN windows

| Surface | Window(s) | History | What the player sees | Problems |
| --- | --- | --- | --- | --- |
| Realm panel and button | `zin_realm_window`, `zin_realm_button_window` | B | 600 × 460 framed window, people emblem, three dividers, text lines | dynamic lines need values; the content is mostly text; the people emblem is the only image; the title is small-caps header face; fits all resolutions |
| Golden Court (Aenor) | `zin_court_window` (4 tabs), `zin_court_button_window` | B | framed window, four equal tab buttons, divider-rule meters with a red wax knob | two text elements drawn on top of each other on "The Hidden Hand" line; the divider under the tabs starts at the second tab and runs past the right frame edge; the selected tab looks like the others; the fixed rows of tab 2 render as empty bands; "Turn the wheel to read on." refers to a mouse wheel; in `long-text` the title repeats across the band and tab labels wrap to two lines |
| Hidden Council (Worshipdom) | `zin_council_window` (3 tabs) | B | same frame and tabs | see section 2.8 |
| Horde, Accord (Dark Lands) | `zin_horde_window`, `zin_accord_window` | B | same frame | see section 2.8 |
| Southern Dominion, Watch, Narrow Strait | `zin_dominion_window`, `zin_watch_window`, `zin_strait_window` | B | same frame | markers are idea pictures (`grave_host`, `scout_lantern`, `strait_chain`) |
| The Presence (Zol) | `zin_mistake_window` | B | same frame | markers and orders are idea pictures |
| Focus inlay | `zin_interim_inlay_window` | P | nothing (1 × 1 empty window) | see section 2.8 |
| Chronicle of Aoaz | (spec 04) | **M** | nothing | never built |
| Road of the Stranger, footholds map mode | spec 01 §10 and §11 | **M** / P | footholds map mode exists with an idea picture as its button | tracker and spec disagree |

### 2.8 Further findings by window

- **Event window** (`EventWindow`): the reskin redrew the vanilla clipboard: a metal bulldog clip at the top and a paperclip holding the picture card, on parchment, with typewriter faces. Both are twentieth-century office objects that spec 02 §3.6 forbids in chrome; the shape-faithful reskin carried the vanilla metaphor over. The news window (`EventWindow_News`) is a parchment broadsheet in the same typewriter faces.
- **Main and pause menus**: the main menu still offers "Tutorial" (the vanilla tutorial is Germany's); the pause menu still shows "Hearts of Iron Wiki" and "Playthrough Overview"; both menus set their buttons in small-caps typewriter type on dark iron plates that read differently from every other button family.
- **World tension popup**: the title and column read "World Tension history" and "World Tension": the "The Gathering Dark" relabel of spec 01 reaches the top-bar name but not this popup's keys.
- **ZIN mechanic panels** (all nine): the same text-first composition (title, optional tabs, label lines, a meter made of the divider sprite with a knob or a small idea picture as marker, a caption line). Specific defects: in the Southern Dominion, the Watch and the Narrow Strait the meter's marker picture overlaps the caption text under it; the Presence draws two conditional opening lines on top of each other and uses idea pictures as its order pips; the Watch and the Presence show a single tab button for a single page; the Horde lists "The heir's bloc" four times in a right column and leaves half the window empty (the sway list); the divider under the tabs starts at the second tab and runs past the right frame edge in every tabbed panel; the Hidden Council's seat levels are five repeated red seal pictures. At 1920×1080 the court, council, dominion, watch, strait, presence and super-event renders report `GUI_ACCIDENTAL_CLIPPING`.
- **Super event**: the full-screen backdrop is the ZIN panel frame stretched to the screen, which shows a strong horizontal banding; the picture frame is empty because the 32 pictures are not generated (`GUI_MISSING_TEXTURE` for `zin_se_golden_king_dead.dds` and the others).
- **Focus inlay** (`zin_interim_inlay_window`): a 1 × 1 empty window with an unknown scripted context (`country_context`); it draws nothing.
- **Renderer-limited windows**: `countryintelledger` and `unitleaderwindow` report `GUI_WINDOW_MISSING` for a nested window in the static model; the politics, diplomacy, country-details and air views report the engine chart sprites (`GFX_political_chart*`, `GFX_strategicair_linechart`) as missing, which the engine draws itself.

## 3. Icon reuse (counted)

Method: every concept a player can see by name was resolved from the staged build to its sprite (`icon`, `picture`, or the engine naming convention `GFX_<name>_medium`, `GFX_idea_<name>`, `GFX_unit_<name>_icon_medium`), and every sprite to its texture file through the `.gfx` files of the build (vanilla `.gfx` as fallback). "Shared" means the texture file serves more than one concept of that family. Hidden ideas (136) and hidden events are excluded.

### 3.1 By family

| Family | Concepts | Distinct texture files | Concepts on a shared file | Files serving exactly one concept | Most concepts on one file | Median concepts per file |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Focuses | 4,817 (20 without icon) | 178 | 4,790 | 7 | 155 (`goals/zin/fort_wall.dds`) | 16 |
| National spirits (country ideas) | 1,614 | 175 | 1,598 | 16 | 53 (`ideas/zin_people_men.dds`) | 5 |
| Laws (economy, trade, mobilisation) | 18 | 18 | 0 | 18 | 1 | 1 (all vanilla pictures) |
| Officer-corps spirits (academy, army, navy, air) | 27 | 27 | 0 | 27 | 1 | 1 (idea catalogue pictures, shared with spirits) |
| Decisions | 249 | 105 | 203 | 46 | 12 (`ideas/zin/envoy.dds`) | 2 |
| Decision categories (icon) | 50 | 39 | 19 | 31 | 3 | 1 |
| Decision category pictures | 15 | 15 | 0 | 15 | 1 | 1 (one is `zin/frame.dds`) |
| Events (country, state, leader) | 1,213 | 42 | 1,213 | 0 | 239 (`zin_evt_generic_court.dds`) | 11 |
| News events | 84 | 26 | 70 | 14 | 28 (`zin_news_generic_war.dds`) | 1 |
| Technologies | 292 | 2 | 292 | 0 | 285 (`zin/frame.dds`); the 7 gates share vanilla `tank_icon.dds` | — |
| Equipment types | 116 | 4 | 113 | 3 | 113 (`zin/frame.dds`); 3 vanilla (motorised 0 and 1, train) | — |
| Equipment archetypes | 35 | 4 | 32 | 3 | 32 (`zin/frame.dds`); 3 vanilla (motorised, train, convoy) | — |
| Sub-unit icons | 85 (20 without icon) | 2 | 64 | 1 | 64 (`zin/frame.dds`) | — |
| Leader traits (unit and country leaders) | 306 | 0 ZIN icons | — | — | — | vanilla trait pictures reach the screen (100 sprites, builder check 4) |
| Special projects | 43 sprites | 13 | — | — | 8 (`ideas/zin/ward_circle.dds`) | all idea pictures |
| Operations | 40 sprites | 19 | — | — | 4 (`ideas/zin/scroll_sealed.dds`) | all idea pictures |
| Agency upgrades | 21 | 20 | — | — | 2 | all idea pictures |
| Agency logos | 15 | 15 | 0 | 15 | 1 | all idea pictures (for example `war_drums`, `troll_club`) |
| MIO (organisations and traits) | 26 sprites, 111 references | 22 | — | — | 18 references to `GFX_zin_mio_speed` | idea pictures |
| Scholar traits | 9 | 9 | 0 | 9 | 1 | idea pictures |
| Doctrines (tracks, grand doctrines, sub-doctrines) | 63 references | 63 | 0 | 63 | 1 | own generated doctrine art (86 icons, K51/K58) |
| Factions | 19 (54 sprites with miniatures) | 34 | — | — | 2 | all vanilla `faction_logo_generic_*` |

### 3.2 Across families

- **The shared frame.** 648 sprite definitions point at `gfx/interface/zin/frame.dds`: 285 `GFX_zin_tech_*`, 192 `GFX_unit_zin_*`, 32 `GFX_archetype_zin_*`, 14 hull, 8 designer, and the arms, mounts, handgun, bows and bombard equipment sprites. The writers are the `FALLBACK_TEXTURE` constants in `modules/technologies.mjs`, `warfare.mjs`, `forces.mjs`, `lib/tech_development.mjs` and `doctrine_art.mjs`. That texture is the Realm panel's window frame, so every one of these icons shows a piece of a window border.
- **The idea catalogue as a universal stand-in.** 741 sprite names in ten families (spirits, decisions, decision categories, category pictures, dynamic modifiers, special projects, operations, agency upgrades and logos, MIO, scholar traits, mechanic panel markers, map-mode buttons) point at the 175 idea pictures. 110 texture files are used by more than one family (for example `banner_league.dds` is a spirit, a decision, a category icon and a category picture).
- **Focus and spirit catalogues mirror each other.** The 175 focus pictures (`goals/zin/<key>.dds`) and the 175 idea pictures (`ideas/zin/<key>.dds`) share their keys, so a focus "fortify" and a spirit "realm beset" show the same subject in two frames.
- **Vanilla content still reached** (builder check 4, 280 findings): 100 leader traits, 58 idea pictures (laws and rules), 34 faction logos, 18 modifier icons of unreachable windows, 16 technology pictures, 12 text icons, 10 decision pictures, 8 designer icons, 5 focus filters, 5 special-project specialisations, 4 vanilla focus icons (including `GFX_focus_usa_honor_the_confederacy` and `GFX_focus_CHL_avenge_the_pacification_of_araucania`), 3 landmarks, 2 abilities, 2 archetypes, 1 each of carrier, crypto and organisation.

### 3.3 What was deliberate and what was not

- Deliberate and documented: the focus and idea catalogues (175 keys, presentation.mjs; "2,950 vanilla focus icons are unreachable" design of spec 02 §7) were a recorded interim to give every focus and spirit some generated picture; the catalogue is reused by key on purpose. It was never reviewed against the rule "one concept, one icon" because that rule did not exist.
- Interim, recorded as pending: the shared frame for technologies, equipment and units ("601 sprites drew from the shared frame on 25 October"; 648 today).
- Not recorded anywhere as a decision: idea pictures as agency logos, special projects, operations, MIO, map-mode buttons and panel markers; vanilla laws, traits and faction logos.

## 4. Builder state of the reskin

| Check (spec 02) | State | Notes |
| --- | --- | --- |
| 1 inventory freshness | pass | game 1.19.3.0, 31,561 sprites |
| 2 coverage | pass | dispositions E 336, H 1,208, O 13, R 3,845, U 26,159 |
| 3 shape | pending | 202 R rows without art |
| 4 reachability | **fail** | 280 U sprites reached (section 3.2) |
| 5 no vanilla pixels | pending | 2,549 compared, 596 inconclusive, 203 pending |
| 6 provenance | pending | 202 |
| 7 luminance | pending | 202; 564 emblem rows exempt |
| 8 overrides | pass | 4 override files |
| 9 determinism | not in the build report | |

Spec 02 acceptance 3 to 6 (renders at four resolutions, review sheets, no overflow, contrast) and 9 (Linux) were never run before this stage. The additive text-colour and font file (`interface/zz_zin_textcolors.gfx`, spec 02 §3.4 and §3.7) was never built, so vanilla text colours and typewriter faces remain.

## 5. Cross-cutting problems

1. **No design system.** Spec 02 §3 defines materials and palette tokens for prompts, but nothing enforces them; the sheets were accepted one by one, so walnut, brass, gilded iron, slate and parchment appear side by side without a hierarchy.
2. **Texture noise and tiling.** Large panel bodies tile a small walnut cell, giving a visible checkerboard in politics, diplomacy, decisions, production, research, the focus board and the technology tree.
3. **Enlarged cells.** Some frame borders are visibly pixel-doubled (the lower politics panel, the technology tree frame), because a small sheet cell was resized up to a large target.
4. **Vanilla words in reskinned windows.** The text sweep (2,121 entries) has not reached the window labels of production, research, intelligence and doctrines.
5. **One ZIN frame for everything.** The ZIN frame texture is also the icon placeholder; ZIN panels have no tab, row, meter or header sprites of their own.
6. **Readability.** Low-contrast typewriter headings, dark-on-dark doctrine titles, faint first-row top-bar icons, and values overlapping badges.
7. **States.** The renders show no selected tab in the ZIN panels; vanilla button states depend on the reskin strips and were never compared.
8. **Never reviewed as a whole.** No contact sheet, matched review or Linux capture existed before this audit.

## 6. Visual directions (stage deliverable 3)

Three directions are written into [07_design_system.md](../../specs/07_interface/07_design_system.md) as token columns and into the generation jobs:

| Direction | Idea | Lore anchor |
| --- | --- | --- |
| A Chancery | quiet walnut, one bronze moulding, cream vellum reading surfaces, painted miniature icons in round bronze bezels; the current reskin language made consistent and calm | the old, peaceful court of seventeen centuries (spec 02 §3) |
| B Banner Hall | the chrome as hand-made cloth: dyed wool panels, embroidered hems, couched gold cord, stitched cloth buttons, appliqué emblems in stitched roundels | the realm banners of K63 to K65 and the signs of K67, so flags, emblems and chrome become one craft |
| C Chronicle | carved slate frames, vellum reading panels with rubricated initials, ink-seal line icons of one weight with one touch of red or gold | the Chronicle of Aoaz (spec 04) as the record of the age |

**Blocked:** each direction needs one mock-up (top bar with the Aoaz bar, an open focus tree and an event window at 1920 × 1088, the nearest size the image route accepts to 1920 × 1080) and one component sheet (panel, buttons in five states, tooltip, icon frame, divider, tabs, meter). The jobs are in [directions/jobs.json](directions/jobs.json) (gpt-6-luna through `tools/content/imagegen.mjs`; references: the Konori pilot banner and the Aenor ruler portrait from the art store). Both attempts on 31 October failed with `401 token_revoked`; no image was generated and no provenance row was written. Run, after the owner logs in: `node tools/content/imagegen.mjs docs/plans/ui_overhaul/directions/jobs.json` from the repository root, then append the rows that the tool writes to `docs/plans/ui_overhaul/directions/provenance.jsonl` to `art/source/provenance.jsonl`.

## 7. Contact sheets

In [renders/](renders/), one sheet per surface group; each tile is a full-window offline render at the stated resolution, labelled "offline render, tool-generated (hoi4.gui_render 4.6.1)".

| Sheet | Windows |
| --- | --- |
| `vanilla_frontend_menus.png` | main menu background, bottom panel, single-player panel, game setup, country details, game rules, loading screen, pause menu, settings |
| `vanilla_topbar_map.png` | top bar, clock, minimap, map modes, music player, alerts |
| `vanilla_politics_diplomacy_decisions.png` | politics, diplomacy, decisions, diplomatic popup, peace conference, world tension popup |
| `vanilla_focus_research.png` | focus tree, research, technology tree (ZIN `.gui`), doctrines |
| `vanilla_economy.png` | production, construction, trade, logistics, deployment, state view |
| `vanilla_military_intel.png` | army, navy, air, theatres, land and naval combat, unit leader, intelligence agency, intelligence ledger |
| `vanilla_events.png` | event and news windows |
| `zin_panels_a.png` | Realm panel and button, Golden Court (four tabs) and button, Hidden Council (three tabs) |
| `zin_panels_b.png` | Horde, Accord, Southern Dominion, Watch, Narrow Strait, Presence (two tabs each where they exist), super event (ids 1 and 5), focus inlay, technology tree from the staged build |
| `focus_tree_aenor_focus_render.png`, `focus_tree_konori_focus_render.png` | `hoi4.focus_render` schematic of two trees from the staged build (tool-generated), showing the repeated catalogue icons |

Columns: 1920×1080, 1280×720, the `long-text` state matrix, and 2560×1440 where rendered. A "no render" tile marks a combination not rendered in this stage (second and later tabs of tabbed panels at 1280 and long-text, most panels at 2560).

## Appendix A. Render log

Per render: the diagnostic counts reported by `hoi4.gui_render` (loc = unresolved localisation, sprite = missing sprite, clip = accidental clipping, overflow = text overflow, click = conflicting click regions, size = invalid size, dyn = unresolved dynamic value, trig = button trigger missing) and the SHA-256 prefix of the full PNG artifact. Engine-filled keys count as unresolved localisation (section 1, fidelity limits).

| Render | Window | Size | loc | sprite | sprite2 | clip | overflow | click | size | dyn | trig | overlap | other | full PNG sha256 (first 12) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v_EventWindow_1280 | `EventWindow` | 1280x720 | 2 |  |  |  |  |  |  |  |  |  | NEAR_CENTRE_OFFSET 1, VISIBLE_OVERLAP 1 | d12114dbba6b |
| v_EventWindow_1920 | `EventWindow` | 1920x1080 | 2 |  |  |  |  |  |  |  |  |  | NEAR_CENTRE_OFFSET 1, VISIBLE_OVERLAP 1 | 203ee59d0486 |
| v_EventWindow_News_1280 | `EventWindow_News` | 1280x720 | 2 |  |  | 1 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | f3d62bb4749e |
| v_EventWindow_News_1920 | `EventWindow_News` | 1920x1080 | 2 |  |  | 1 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | d0b1bc21d8a1 |
| v_EventWindow_News_long | `EventWindow_News` | 1920x1080 | 2 |  |  | 1 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1, VISIBLE_OVERLAP 1 | d0b1bc21d8a1 |
| v_EventWindow_long | `EventWindow` | 1920x1080 | 2 |  |  |  |  |  |  |  |  |  | NEAR_CENTRE_OFFSET 1, VISIBLE_OVERLAP 1, CONTENT_CROSSES_BACKGROUND_EDGE 1 | 203ee59d0486 |
| v_MapmodesInterface_Ingame_1280 | `MapmodesInterface_Ingame` | 1280x720 |  |  |  |  |  | 18 |  |  |  |  |  | ffc5fc2047ec |
| v_MapmodesInterface_Ingame_1920 | `MapmodesInterface_Ingame` | 1920x1080 |  |  |  |  |  | 18 |  |  |  |  |  | 7de8bc1df870 |
| v_MapmodesInterface_Ingame_long | `MapmodesInterface_Ingame` | 1920x1080 |  |  |  |  |  | 18 |  |  |  |  |  | 7de8bc1df870 |
| v_clock_window_1280 | `clock_window` | 1280x720 | 1 |  |  | 2 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | 087e48713988 |
| v_clock_window_1920 | `clock_window` | 1920x1080 | 1 |  |  | 2 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | d8fe31d6a02a |
| v_clock_window_long | `clock_window` | 1920x1080 | 1 |  |  | 3 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | d8fe31d6a02a |
| v_countryarmyview_1280 | `countryarmyview` | 1280x720 | 1 |  |  |  |  | 5 |  |  |  |  |  | 41023b74627a |
| v_countryarmyview_1920 | `countryarmyview` | 1920x1080 | 1 |  |  |  |  | 5 |  |  |  |  |  | a1312e113f60 |
| v_countryarmyview_long | `countryarmyview` | 1920x1080 | 1 |  |  |  |  | 5 |  |  |  |  |  | a1312e113f60 |
| v_countryconstructionsview_1280 | `countryconstructionsview` | 1280x720 | 1 |  |  |  |  | 7 |  |  |  |  |  | 60ad74df3cb6 |
| v_countryconstructionsview_1920 | `countryconstructionsview` | 1920x1080 | 1 |  |  |  |  | 7 |  |  |  |  |  | 6554ca7a3944 |
| v_countryconstructionsview_long | `countryconstructionsview` | 1920x1080 | 1 |  |  |  |  | 7 |  |  |  |  |  | 6554ca7a3944 |
| v_countrydecisionview_1280 | `countrydecisionview` | 1280x720 |  |  |  | 3 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | c29442158b6e |
| v_countrydecisionview_1920 | `countrydecisionview` | 1920x1080 |  |  |  | 3 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | cc2f3b0bfef9 |
| v_countrydecisionview_long | `countrydecisionview` | 1920x1080 |  |  |  | 3 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 2 | cc2f3b0bfef9 |
| v_countrydeploymentview_1280 | `countrydeploymentview` | 1280x720 |  |  |  | 2 |  |  |  |  |  |  | VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | a208a86c4342 |
| v_countrydeploymentview_1920 | `countrydeploymentview` | 1920x1080 |  |  |  | 2 |  |  |  |  |  |  | VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 434cecce1797 |
| v_countrydeploymentview_long | `countrydeploymentview` | 1920x1080 |  |  |  | 3 |  |  |  |  |  |  | VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 434cecce1797 |
| v_countrydiplomacyview_1280 | `countrydiplomacyview` | 1280x720 | 9 | 1 | 1 |  |  | 7 |  |  |  |  |  | cbe75de52c86 |
| v_countrydiplomacyview_1920 | `countrydiplomacyview` | 1920x1080 | 13 | 1 | 1 |  |  | 3 |  |  |  |  |  | 74e0552ccb52 |
| v_countrydiplomacyview_long | `countrydiplomacyview` | 1920x1080 | 13 | 1 | 1 |  |  | 3 |  |  |  |  |  | 74e0552ccb52 |
| v_countrydoctrineview_1280 | `countrydoctrineview` | 1280x720 |  |  |  |  |  | 1 |  |  |  |  | VISIBLE_OVERLAP 2, Z_ORDER_RISK 1 | edfd5ede0542 |
| v_countrydoctrineview_1920 | `countrydoctrineview` | 1920x1080 |  |  |  |  |  | 1 |  |  |  |  | VISIBLE_OVERLAP 2, Z_ORDER_RISK 1 | b63591b47405 |
| v_countrydoctrineview_long | `countrydoctrineview` | 1920x1080 |  |  |  |  |  | 1 |  |  |  |  | VISIBLE_OVERLAP 3, Z_ORDER_RISK 1 | b63591b47405 |
| v_countryintelledger_1280 | `countryintelledger` | 1280x720 |  |  |  |  |  |  |  |  |  |  | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 8366fbcb5c0a |
| v_countryintelledger_1920 | `countryintelledger` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_countryintelledger_long | `countryintelledger` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_countryintelligenceagencyview_1280 | `countryintelligenceagencyview` | 1280x720 | 7 |  |  |  |  | 2 |  |  |  |  | SPRITE_SHEET_DIMENSION_INVALID 1 | 62fa2c2e5156 |
| v_countryintelligenceagencyview_1920 | `countryintelligenceagencyview` | 1920x1080 | 7 |  |  |  |  | 2 |  |  |  |  | SPRITE_SHEET_DIMENSION_INVALID 1 | b4d35e0c367a |
| v_countryintelligenceagencyview_long | `countryintelligenceagencyview` | 1920x1080 | 7 |  |  |  |  | 2 |  |  |  |  | SPRITE_SHEET_DIMENSION_INVALID 1 | b4d35e0c367a |
| v_countrylogisticsview_1280 | `countrylogisticsview` | 1280x720 |  |  |  |  |  | 1 |  |  |  |  | VISIBLE_OVERLAP 3 | f61f20e49d9f |
| v_countrylogisticsview_1920 | `countrylogisticsview` | 1920x1080 |  |  |  |  |  | 1 |  |  |  |  | VISIBLE_OVERLAP 3 | 0e5b3b1e4cf7 |
| v_countrylogisticsview_long | `countrylogisticsview` | 1920x1080 |  |  |  |  |  | 1 |  |  |  |  | VISIBLE_OVERLAP 4 | 0e5b3b1e4cf7 |
| v_countrypoliticsview_1280 | `countrypoliticsview` | 1280x720 | 6 | 1 | 1 |  |  | 4 |  |  |  |  |  | a96eb5b27a96 |
| v_countrypoliticsview_1920 | `countrypoliticsview` | 1920x1080 | 6 | 1 | 1 |  |  | 4 |  |  |  |  |  | b69df50c3d99 |
| v_countrypoliticsview_long | `countrypoliticsview` | 1920x1080 | 6 | 1 | 1 |  |  | 4 |  |  |  |  |  | b69df50c3d99 |
| v_countryproductionlineview_1280 | `countryproductionlineview` | 1280x720 | 3 |  |  |  |  | 1 |  |  |  |  |  | dea668fabd39 |
| v_countryproductionlineview_1920 | `countryproductionlineview` | 1920x1080 | 3 |  |  |  |  | 1 |  |  |  |  |  | 7a0b38acbc01 |
| v_countryproductionlineview_long | `countryproductionlineview` | 1920x1080 | 3 |  |  |  |  | 1 |  |  |  |  | VISIBLE_OVERLAP 1 | 7a0b38acbc01 |
| v_countrystateview_1280 | `countrystateview` | 1280x720 | 2 |  |  | 2 |  |  |  |  |  |  |  | eff5c216ae5d |
| v_countrystateview_1920 | `countrystateview` | 1920x1080 | 2 |  |  | 2 |  |  |  |  |  |  |  | 5b24d59c3b2a |
| v_countrystateview_long | `countrystateview` | 1920x1080 | 2 |  |  | 3 |  |  |  |  |  |  |  | 5b24d59c3b2a |
| v_countrytechnologyview_1280 | `countrytechnologyview` | 1280x720 |  |  |  | 2 |  | 1 |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | 9856eed13865 |
| v_countrytechnologyview_1920 | `countrytechnologyview` | 1920x1080 |  |  |  | 2 |  | 1 |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | e561cb9a8139 |
| v_countrytechnologyview_long | `countrytechnologyview` | 1920x1080 |  |  |  | 3 |  | 1 |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | e561cb9a8139 |
| v_countrytechtreeview_1280 | `countrytechtreeview` | 1280x720 |  |  |  |  |  | 18 |  |  |  |  |  | 98c3e134e179 |
| v_countrytechtreeview_1920 | `countrytechtreeview` | 1920x1080 |  |  |  |  |  | 18 |  |  |  |  |  | 1866b5678b1d |
| v_countrytechtreeview_long | `countrytechtreeview` | 1920x1080 |  |  |  |  |  | 18 |  |  |  |  |  | 1866b5678b1d |
| v_countrytradeview_1280 | `countrytradeview` | 1280x720 |  |  |  | 2 |  |  |  |  |  |  | VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | bb43c67eb254 |
| v_countrytradeview_1920 | `countrytradeview` | 1920x1080 |  |  |  | 2 |  |  |  |  |  |  | VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | efe7dfbb3933 |
| v_countrytradeview_long | `countrytradeview` | 1920x1080 |  |  |  | 3 |  |  |  |  |  |  | VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | efe7dfbb3933 |
| v_diplomacy_standard_popup_window_1280 | `diplomacy_standard_popup_window` | 1280x720 | 2 |  |  |  |  |  |  |  |  |  | VISIBLE_OVERLAP 1, SPRITE_RENDER_PARTIAL 1 | bf59c21c6e01 |
| v_diplomacy_standard_popup_window_1920 | `diplomacy_standard_popup_window` | 1920x1080 | 2 |  |  |  |  |  |  |  |  |  | VISIBLE_OVERLAP 1, SPRITE_RENDER_PARTIAL 1 | 7b1e2c3af73d |
| v_diplomacy_standard_popup_window_long | `diplomacy_standard_popup_window` | 1920x1080 | 2 |  |  |  |  |  |  |  |  |  | VISIBLE_OVERLAP 2, SPRITE_RENDER_PARTIAL 1 | 7b1e2c3af73d |
| v_frontend_background_1280 | `frontend_background` | 1280x720 |  |  |  | 2 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | 56a8936a5c09 |
| v_frontend_background_1920 | `frontend_background` | 1920x1080 |  |  |  | 2 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | 0422ca973f80 |
| v_frontend_background_long | `frontend_background` | 1920x1080 |  |  |  | 2 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | 0422ca973f80 |
| v_frontendgamesetupview_1280 | `frontendgamesetupview` | 1280x720 | 2 |  |  |  |  | 2 |  |  |  |  |  | 2f7c84aac984 |
| v_frontendgamesetupview_1920 | `frontendgamesetupview` | 1920x1080 | 2 |  |  |  |  | 2 |  |  |  |  |  | 96e8aeca2693 |
| v_frontendgamesetupview_long | `frontendgamesetupview` | 1920x1080 | 2 |  |  | 1 |  | 2 |  |  |  |  |  | 96e8aeca2693 |
| v_game_rule_window_1280 | `game_rule_window` | 1280x720 |  |  |  | 4 |  |  |  |  |  |  |  | 9f027b7451b8 |
| v_game_rule_window_1920 | `game_rule_window` | 1920x1080 |  |  |  | 4 |  |  |  |  |  |  |  | 9d563d36fe88 |
| v_game_rule_window_long | `game_rule_window` | 1920x1080 |  |  |  | 5 |  |  |  |  |  |  |  | 9d563d36fe88 |
| v_gamesetup_country_details_1280 | `gamesetup_country_details` | 1280x720 |  | 1 | 1 | 2 |  |  |  |  |  |  |  | c375ecaf9c2d |
| v_gamesetup_country_details_1920 | `gamesetup_country_details` | 1920x1080 |  | 1 | 1 | 2 |  |  |  |  |  |  |  | 657e6236f358 |
| v_gamesetup_country_details_long | `gamesetup_country_details` | 1920x1080 |  | 1 | 1 | 2 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | 657e6236f358 |
| v_global_alerticon_window_1280 | `global_alerticon_window` | 1280x720 |  |  |  |  |  |  |  |  |  |  | ANIMATION_STATIC_FALLBACK_MISSING 2, SPRITE_RENDER_PARTIAL 2, VISIBLE_OVERLAP 1 | 57e1b9931429 |
| v_global_alerticon_window_1920 | `global_alerticon_window` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | ANIMATION_STATIC_FALLBACK_MISSING 2, SPRITE_RENDER_PARTIAL 2, VISIBLE_OVERLAP 1 | 8915f6c7e581 |
| v_global_alerticon_window_long | `global_alerticon_window` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | ANIMATION_STATIC_FALLBACK_MISSING 2, SPRITE_RENDER_PARTIAL 2, VISIBLE_OVERLAP 2 | 8915f6c7e581 |
| v_ingamemenu_1280 | `ingamemenu` | 1280x720 |  |  |  |  |  | 15 |  |  |  |  |  | 2fbbd2ea4f78 |
| v_ingamemenu_1920 | `ingamemenu` | 1920x1080 |  |  |  |  |  | 15 |  |  |  |  |  | 0d89e3e719f2 |
| v_ingamemenu_long | `ingamemenu` | 1920x1080 |  |  |  |  |  | 15 |  |  |  |  |  | 0d89e3e719f2 |
| v_landcombatview_1280 | `landcombatview` | 1280x720 | 8 |  |  |  |  |  |  |  |  |  |  | 72ccf4070a91 |
| v_landcombatview_1920 | `landcombatview` | 1920x1080 | 8 |  |  |  |  |  |  |  |  |  |  | b6f5733d876d |
| v_landcombatview_long | `landcombatview` | 1920x1080 | 8 |  |  |  |  |  |  |  |  |  |  | b6f5733d876d |
| v_load_screen_1280 | `load_screen` | 1280x720 |  |  |  | 2 |  |  |  |  |  |  | SPRITE_DECLARED_SIZE_MISMATCH 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 211ab952ec9b |
| v_load_screen_1920 | `load_screen` | 1920x1080 |  |  |  | 1 |  |  |  |  |  |  | SPRITE_DECLARED_SIZE_MISMATCH 1, VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 00c9a9b386be |
| v_load_screen_long | `load_screen` | 1920x1080 |  |  |  | 2 |  |  |  |  |  |  | SPRITE_DECLARED_SIZE_MISMATCH 1, VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 00c9a9b386be |
| v_mainmenu_panel_bottom_1280 | `mainmenu_panel_bottom` | 1280x720 | 2 |  |  |  |  | 1 |  |  |  |  | ANIMATION_STATIC_FALLBACK_MISSING 1 | c4cfa0ab0958 |
| v_mainmenu_panel_bottom_1920 | `mainmenu_panel_bottom` | 1920x1080 | 2 |  |  |  |  | 1 |  |  |  |  | ANIMATION_STATIC_FALLBACK_MISSING 1 | fb98389fdcf2 |
| v_mainmenu_panel_bottom_long | `mainmenu_panel_bottom` | 1920x1080 | 2 |  |  | 1 |  | 1 |  |  |  |  | ANIMATION_STATIC_FALLBACK_MISSING 1 | fb98389fdcf2 |
| v_mainmenu_single_player_1280 | `mainmenu_single_player` | 1280x720 |  |  |  |  |  |  |  |  |  |  | SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 4 | 8560ef76392d |
| v_mainmenu_single_player_1920 | `mainmenu_single_player` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 4 | e14d993f25a2 |
| v_mainmenu_single_player_long | `mainmenu_single_player` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | SPRITE_RENDER_PARTIAL 1, VISIBLE_OVERLAP 5 | e14d993f25a2 |
| v_menu_settings_1280 | `menu_settings` | 1280x720 |  |  |  |  |  | 18 |  |  |  |  |  | d2ba313cd2dc |
| v_menu_settings_1920 | `menu_settings` | 1920x1080 |  |  |  |  |  | 18 |  |  |  |  |  | 6354eec4dda0 |
| v_menu_settings_long | `menu_settings` | 1920x1080 |  |  |  |  |  | 18 |  |  |  |  |  | 6354eec4dda0 |
| v_mini_map_interface_1280 | `mini_map_interface` | 1280x720 |  |  |  | 2 |  | 1 | 1 |  |  |  |  | 310421759d86 |
| v_mini_map_interface_1920 | `mini_map_interface` | 1920x1080 |  |  |  | 2 |  | 1 | 1 |  |  |  |  | 20aaf9121a87 |
| v_mini_map_interface_long | `mini_map_interface` | 1920x1080 |  |  |  | 2 |  | 1 | 2 |  |  |  |  | 20aaf9121a87 |
| v_musicplayer_window_1280 | `musicplayer_window` | 1280x720 |  |  |  | 2 |  |  |  |  |  |  | VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | bcd9b9fb5167 |
| v_musicplayer_window_1920 | `musicplayer_window` | 1920x1080 |  |  |  | 2 |  |  |  |  |  |  | VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 1f0b90fbc07e |
| v_musicplayer_window_long | `musicplayer_window` | 1920x1080 |  |  |  | 2 |  |  |  |  |  |  | VISIBLE_OVERLAP 1, CHILD_OUTSIDE_CLIPPED_PARENT 2 | 1f0b90fbc07e |
| v_nationalfocusview_1280 | `nationalfocusview` | 1280x720 | 2 |  |  |  |  | 2 |  |  |  |  |  | 878ffe6df7d9 |
| v_nationalfocusview_1920 | `nationalfocusview` | 1920x1080 | 2 |  |  |  |  | 2 |  |  |  |  |  | 4f8e7173c82e |
| v_nationalfocusview_long | `nationalfocusview` | 1920x1080 | 2 |  |  | 1 |  | 2 |  |  |  |  |  | 4f8e7173c82e |
| v_navalcombatview_1280 | `navalcombatview` | 1280x720 | 7 |  |  |  |  |  |  |  |  |  |  | d6caa7296872 |
| v_navalcombatview_1920 | `navalcombatview` | 1920x1080 | 7 |  |  |  |  |  |  |  |  |  |  | 5158a5069ab6 |
| v_navalcombatview_long | `navalcombatview` | 1920x1080 | 7 |  |  |  |  |  |  |  |  |  |  | 5158a5069ab6 |
| v_naviesview_window_1280 | `naviesview_window` | 1280x720 |  |  |  |  |  | 13 |  |  |  |  |  | 47c1865510be |
| v_naviesview_window_1920 | `naviesview_window` | 1920x1080 |  |  |  |  |  | 13 |  |  |  |  |  | 1423d7aa129c |
| v_naviesview_window_long | `naviesview_window` | 1920x1080 |  |  |  |  |  | 13 |  |  |  |  |  | 1423d7aa129c |
| v_peaceconference_full_window_1280 | `peaceconference_full_window` | 1280x720 | 4 |  |  |  |  |  |  |  |  |  |  | f717ae1e72ec |
| v_peaceconference_full_window_1920 | `peaceconference_full_window` | 1920x1080 | 4 |  |  |  |  |  |  |  |  |  |  | 011cfc63e4fd |
| v_peaceconference_full_window_long | `peaceconference_full_window` | 1920x1080 | 4 |  |  | 1 |  |  |  |  |  |  |  | 011cfc63e4fd |
| v_strategicairview_1280 | `strategicairview` | 1280x720 | 2 | 1 | 1 |  |  | 14 |  |  |  |  |  | a326a0fc0b2b |
| v_strategicairview_1920 | `strategicairview` | 1920x1080 | 2 | 1 | 1 |  |  | 14 |  |  |  |  |  | 9ac22db2f28d |
| v_strategicairview_long | `strategicairview` | 1920x1080 | 2 | 1 | 1 |  |  | 14 |  |  |  |  |  | 9ac22db2f28d |
| v_theatre_selection_window_1280 | `theatre_selection_window` | 1280x720 |  |  |  | 1 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | 8366fbcb5c0a |
| v_theatre_selection_window_1920 | `theatre_selection_window` | 1920x1080 |  |  |  | 1 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | 397d44367a8a |
| v_theatre_selection_window_long | `theatre_selection_window` | 1920x1080 |  |  |  | 1 |  |  |  |  |  |  | CHILD_OUTSIDE_CLIPPED_PARENT 1 | 397d44367a8a |
| v_topbar_1280 | `topbar` | 1280x720 | 6 |  |  |  |  | 12 |  |  |  |  |  | 20ce0e7999ac |
| v_topbar_1920 | `topbar` | 1920x1080 | 6 |  |  |  |  | 12 |  |  |  |  |  | a4be09102117 |
| v_topbar_long | `topbar` | 1920x1080 | 6 |  |  |  |  | 12 |  |  |  |  |  | a4be09102117 |
| v_unitleaderwindow_1280 | `unitleaderwindow` | 1280x720 |  |  |  |  |  |  |  |  |  |  | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 8366fbcb5c0a |
| v_unitleaderwindow_1920 | `unitleaderwindow` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_unitleaderwindow_long | `unitleaderwindow` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | PARENT_WINDOW_INVALID 2, REFERENCE_UNRESOLVED 15, UNRESOLVED_REFERENCE 1, WINDOW_MISSING 1 | 397d44367a8a |
| v_world_tension_popup_1280 | `world_tension_popup` | 1280x720 |  |  |  | 1 |  |  |  |  |  |  | NEAR_CENTRE_OFFSET 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 8a8d5fd7b790 |
| v_world_tension_popup_1920 | `world_tension_popup` | 1920x1080 |  |  |  | 1 |  |  |  |  |  |  | NEAR_CENTRE_OFFSET 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 1681d539f527 |
| v_world_tension_popup_long | `world_tension_popup` | 1920x1080 |  |  |  | 2 |  |  |  |  |  |  | NEAR_CENTRE_OFFSET 2, CHILD_OUTSIDE_CLIPPED_PARENT 1 | 1681d539f527 |
| z_accord_1280 | `zin_accord_window` | 1280x720 |  |  |  |  |  |  |  | 3 | 1 |  | INCONSISTENT_SPACING 1 | 7e968e025e67 |
| z_accord_1920 | `zin_accord_window` | 1920x1080 |  |  |  |  |  |  |  | 3 | 1 |  | INCONSISTENT_SPACING 1 | db4cc5bc9273 |
| z_accord_long | `zin_accord_window` | 1920x1080 |  |  |  |  |  |  |  | 3 | 1 |  | INCONSISTENT_SPACING 1 | db4cc5bc9273 |
| z_council1_1280 | `zin_council_window` | 1280x720 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | b6c06184e769 |
| z_council1_1920 | `zin_council_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 7d7505603389 |
| z_council1_2560 | `zin_council_window` | 2560x1440 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | b58f1586cb68 |
| z_council1_long | `zin_council_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 4 |  |  | 7d7505603389 |
| z_council2_1920 | `zin_council_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | f5b154fa1190 |
| z_council3_1920 | `zin_council_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 994a36ebed3e |
| z_court1_1280 | `zin_court_window` | 1280x720 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | be4df1e64597 |
| z_court1_1920 | `zin_court_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 54a8b020f6eb |
| z_court1_2560 | `zin_court_window` | 2560x1440 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 3fc76b435988 |
| z_court1_long | `zin_court_window` | 1920x1080 |  |  |  | 2 |  |  | 1 |  | 3 |  |  | 54a8b020f6eb |
| z_court2_1280 | `zin_court_window` | 1280x720 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 79798f80aebf |
| z_court2_1920 | `zin_court_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 169562cc1300 |
| z_court2_2560 | `zin_court_window` | 2560x1440 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | c350aed8eca1 |
| z_court2_long | `zin_court_window` | 1920x1080 |  |  |  | 2 |  |  | 1 |  | 3 |  |  | 169562cc1300 |
| z_court3_1280 | `zin_court_window` | 1280x720 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 2fe639617dcb |
| z_court3_1920 | `zin_court_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 897a77bbdc53 |
| z_court3_2560 | `zin_court_window` | 2560x1440 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | ddb39960cc5d |
| z_court3_long | `zin_court_window` | 1920x1080 |  |  |  | 2 |  |  | 1 |  | 3 |  |  | 897a77bbdc53 |
| z_court4_1280 | `zin_court_window` | 1280x720 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 1186208fe93c |
| z_court4_1920 | `zin_court_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | dfe00425a540 |
| z_court4_2560 | `zin_court_window` | 2560x1440 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | e04df1ff91a5 |
| z_court4_long | `zin_court_window` | 1920x1080 |  |  |  | 2 |  |  | 1 |  | 3 |  |  | dfe00425a540 |
| z_court_btn_1280 | `zin_court_button_window` | 1280x720 |  |  |  |  |  |  |  |  |  |  | REFERENCE_UNRESOLVED 7 | 305d15e66f38 |
| z_court_btn_1920 | `zin_court_button_window` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | REFERENCE_UNRESOLVED 7 | 9be237b94d79 |
| z_court_btn_2560 | `zin_court_button_window` | 2560x1440 |  |  |  |  |  |  |  |  |  |  | REFERENCE_UNRESOLVED 7 | 65881b939602 |
| z_court_btn_long | `zin_court_button_window` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | REFERENCE_UNRESOLVED 7 | 9be237b94d79 |
| z_dominion1_1280 | `zin_dominion_window` | 1280x720 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 16089b7afb7c |
| z_dominion1_1920 | `zin_dominion_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 8952c8675791 |
| z_dominion1_long | `zin_dominion_window` | 1920x1080 |  |  |  | 1 |  |  | 1 | 1 | 3 |  |  | 8952c8675791 |
| z_dominion2_1920 | `zin_dominion_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 610666a77134 |
| z_horde_1280 | `zin_horde_window` | 1280x720 |  |  |  |  |  |  |  | 4 | 1 |  |  | 838212fdfd3c |
| z_horde_1920 | `zin_horde_window` | 1920x1080 |  |  |  |  |  |  |  | 4 | 1 |  |  | b1f1e6e34a46 |
| z_horde_long | `zin_horde_window` | 1920x1080 |  |  |  |  |  |  |  | 5 | 1 |  |  | b1f1e6e34a46 |
| z_inlay_1280 | `zin_interim_inlay_window` | 1280x720 |  |  |  |  |  |  |  |  |  |  | SCRIPTED_CONTEXT_UNKNOWN 1 | 8366fbcb5c0a |
| z_inlay_1920 | `zin_interim_inlay_window` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | SCRIPTED_CONTEXT_UNKNOWN 1 | 397d44367a8a |
| z_inlay_long | `zin_interim_inlay_window` | 1920x1080 |  |  |  |  |  |  |  |  |  |  | SCRIPTED_CONTEXT_UNKNOWN 1 | 397d44367a8a |
| z_mistake1_1280 | `zin_mistake_window` | 1280x720 |  |  |  |  |  |  |  | 1 | 2 |  | UNRESOLVED_VISIBILITY_OVERLAP 2 | b9da0adb4884 |
| z_mistake1_1920 | `zin_mistake_window` | 1920x1080 |  |  |  |  |  |  |  | 1 | 2 |  | UNRESOLVED_VISIBILITY_OVERLAP 2 | f3ad5a13a6fe |
| z_mistake1_2560 | `zin_mistake_window` | 2560x1440 |  |  |  |  |  |  |  | 1 | 2 |  | UNRESOLVED_VISIBILITY_OVERLAP 2 | 28c645ac55ea |
| z_mistake1_long | `zin_mistake_window` | 1920x1080 |  |  |  | 1 |  |  |  | 1 | 2 |  | UNRESOLVED_VISIBILITY_OVERLAP 2 | f3ad5a13a6fe |
| z_mistake2_1920 | `zin_mistake_window` | 1920x1080 |  |  |  | 2 |  |  | 1 |  | 2 |  |  | ea361377dc4a |
| z_realm_1280 | `zin_realm_window` | 1280x720 |  |  |  |  |  |  |  | 3 | 1 |  |  | 7baeb9f49795 |
| z_realm_1920 | `zin_realm_window` | 1920x1080 |  |  |  |  |  |  |  | 3 | 1 |  |  | 19eb94d7a650 |
| z_realm_2560 | `zin_realm_window` | 2560x1440 |  |  |  |  |  |  |  | 3 | 1 |  |  | 819a61337864 |
| z_realm_btn_1280 | `zin_realm_button_window` | 1280x720 |  |  |  |  |  |  |  |  | 1 |  |  | f414f7a8ed36 |
| z_realm_btn_1920 | `zin_realm_button_window` | 1920x1080 |  |  |  |  |  |  |  |  | 1 |  |  | 6416eefd21e7 |
| z_realm_btn_2560 | `zin_realm_button_window` | 2560x1440 |  |  |  |  |  |  |  |  | 1 |  |  | 6dc0fb15acba |
| z_realm_btn_long | `zin_realm_button_window` | 1920x1080 |  |  |  |  |  |  |  |  | 1 |  |  | 6416eefd21e7 |
| z_realm_long | `zin_realm_window` | 1920x1080 |  |  |  |  |  |  |  | 4 | 1 |  |  | 19eb94d7a650 |
| z_se1_1280 | `zin_super_event_window` | 1280x720 |  |  |  | 1 |  |  | 1 | 1 |  |  | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 1 | 878301470078 |
| z_se1_1920 | `zin_super_event_window` | 1920x1080 |  |  |  | 1 |  |  | 1 | 1 |  |  | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 1 | 4e67102d9f7a |
| z_se1_2560 | `zin_super_event_window` | 2560x1440 |  |  |  | 1 |  |  | 1 | 1 |  |  | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 1 | 160ecc2adcb1 |
| z_se1_long | `zin_super_event_window` | 1920x1080 |  |  |  | 1 |  |  | 1 | 1 |  |  | MISSING_TEXTURE 1, TEXTURE_UNSUPPORTED 2 | 4e67102d9f7a |
| z_se5_1280 | `zin_super_event_window` | 1280x720 |  |  |  | 3 |  |  | 1 |  |  |  | TEXTURE_UNSUPPORTED 1 | d3db17e28e04 |
| z_se5_1920 | `zin_super_event_window` | 1920x1080 |  |  |  | 3 |  |  | 1 |  |  |  | TEXTURE_UNSUPPORTED 1 | 5de228a46977 |
| z_se5_long | `zin_super_event_window` | 1920x1080 |  |  |  | 3 |  |  | 2 |  |  |  | TEXTURE_UNSUPPORTED 1 | 5de228a46977 |
| z_strait1_1280 | `zin_strait_window` | 1280x720 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 142181066d23 |
| z_strait1_1920 | `zin_strait_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 0e5300024c03 |
| z_strait1_long | `zin_strait_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 4 |  |  | 0e5300024c03 |
| z_strait2_1920 | `zin_strait_window` | 1920x1080 |  |  |  | 1 |  |  | 1 |  | 3 |  |  | 13c313b66dd6 |
| z_techtree_1280 | `countrytechtreeview` | 1280x720 |  |  |  |  |  | 18 |  |  |  |  |  | 9db5a96ad57d |
| z_techtree_1920 | `countrytechtreeview` | 1920x1080 |  |  |  |  |  | 18 |  |  |  |  |  | 7f466a051125 |
| z_techtree_long | `countrytechtreeview` | 1920x1080 |  |  |  |  |  | 18 |  |  |  |  |  | 7f466a051125 |
| z_watch1_1280 | `zin_watch_window` | 1280x720 |  |  |  | 1 |  |  |  | 1 | 2 |  | VISIBLE_OVERLAP 1 | ab7266726cb6 |
| z_watch1_1920 | `zin_watch_window` | 1920x1080 |  |  |  | 1 |  |  |  | 1 | 2 |  | VISIBLE_OVERLAP 1 | 4c9e9c764380 |
| z_watch1_long | `zin_watch_window` | 1920x1080 |  |  |  | 1 |  |  |  | 1 | 2 |  | VISIBLE_OVERLAP 2 | 4c9e9c764380 |
| z_watch2_1920 | `zin_watch_window` | 1920x1080 |  |  |  | 2 |  |  | 1 |  | 2 |  |  | 41dff02c26b5 |
