# ZIN progress tracker

The persistent inventory of every major subsystem and interface surface of ZIN, with its real state, the work it needs, its dependencies, who has it, how it was tested and what is still wrong. It is updated after every meaningful change. A row is **Done** only when its requirements are met and its tests have run; "built" or "loads" is not done. `STATUS.md` says what is running now; this file says where everything stands.

States: **Not started**, **Provisional** (exists, never reviewed to standard), **In progress**, **Built, untested** (complete in source, no live or visual proof), **Blocked** (named blocker), **Done** (requirements met, tests recorded).

Last full review: 31 October 2026 (owner's overhaul brief: complete UI redesign, full overhaul, continuous MCP improvement).

## 1. Interface

The honest history (31 October 2026). The interface specs (`docs/specs/07_interface/01` to `06`) were written and marked Ready on 19 October 2026. What was built from them is mostly mechanical: `modules/ui_reskin.mjs` replaces 3,139 vanilla textures with cells sliced from generated theme sheets (202 still pending), fitted to the vanilla outlines and luminance classes. The reskin's builder checks run (inventory, coverage and overrides pass; reachability fails; shape, no-vanilla-pixels, provenance and luminance are pending), but its acceptance renders, review sheets, overflow and contrast checks (spec acceptance 3 to 6) and its Linux captures (acceptance 9) were never done. No surface of the reskinned vanilla interface has had a design review as a player sees it. A few ZIN windows were previewed with `hoi4.gui_render` while they were built (the super-event window in six render passes; the world-tension popup; some mechanic panels); none has had a matched in-game review. The owner does not approve the current interface (31 October 2026).

UI overhaul stage 1 (31 October 2026): the first matched render pass of the whole interface (`hoi4.gui_render` 4.6.1, 42 vanilla windows from the installed mod and 11 ZIN windows from a staged build, at 1920×1080 and 1280×720 plus `long-text`, contact sheets in `docs/plans/ui_overhaul/renders/`), an icon-reuse count, a proposed design system (`docs/specs/07_interface/07_design_system.md`) and a parallel work plan (`docs/plans/ui_overhaul/02_plan.md`). Findings in `docs/plans/ui_overhaul/01_audit.md`: mixed materials and tiled, enlarged textures in every reskinned window; 648 icon sprites show the Realm panel's window frame; 4,817 focuses on 178 pictures, 1,614 spirits on 175, 1,213 events on 42; laws, traits and faction logos still vanilla; the Aoaz bar and the Chronicle were never built. The three visual direction images are blocked: the image route's ChatGPT token is revoked (401); jobs ready in `docs/plans/ui_overhaul/directions/jobs.json`. (Later the same day the direction images were generated and the owner decided K69 and K70.)

UI overhaul phase 0 (31 October 2026, handoff `docs/plans/ui_overhaul/handoffs/phase0.md`): the design system is accepted with three area themes and a neutral family (D2); the icon registry reproduces the audit counts in every build (D3); design checks 10 to 18 report in every build against a recorded baseline and fail only a release build (D4); the review harness renders the audit window set from a staged build in one command, without copying into the mod folder (D5).

| Surface | State | Required | Depends on | Owner | Tests | Open issues |
| --- | --- | --- | --- | --- | --- | --- |
| Design system (palette, type, iconography, panels, spacing, states) | Accepted (31 October, K69 and K70; phase 0 D2): `docs/specs/07_interface/07_design_system.md` with three area themes (Banner Hall, Chancery, Chronicle) and one neutral family, tokens sampled from the direction images, a theme for every audited window (§7), icon family sizes and K69 targets (§4), the vanilla kept register (§10); machine-readable part `tools/content/data/ui/design_system.json`; spec 01 §12 and spec 02 §3 point at it | Phase 1 chrome sheets per theme (C1), text colours (C2), ZIN frame family (C3); owner may overrule the lead mapping of §7 and cut general focus groups | owner review of §7 and §4.5 | UI lead | builder checks 10 to 18 with negative tests (`ui_reskin.test.mjs`); baseline in `data/ui/check_baseline.json` | 7 register rows "to verify" on the Linux run |
| Icon registry, UI checks, review harness (phase 0 D3 to D5) | Built, tested: `modules/icon_registry.mjs` (26 families, 9,214 concepts; reproduces every audit count in the build), `data/ui/icon_registry.json`, `data/ui/icon_shares.json` (226 proposed general-focus groups, K69 targets: 4,313 focus icons); checks 10 to 18 report in every build and fail only with `ZIN_RELEASE=1`; `tools/content/ui_review.mjs` renders the audit set in one command into `docs/plans/ui_overhaul/renders/review/` with check 19 metrics | Each phase lowers its check counts; release enforcement once phases 1 to 3 land | phases 1 to 3 | UI lead / checks worker | `icon_registry.test.mjs`; `ui_reskin.test.mjs` checks 10 to 18; harness run of 31 October | MCP requests R1 to R5 (`docs/plans/ui_overhaul/mcp_requests.md`), none blocking |
| Main menu, frontend, loading screens | Provisional: loading frame, emblem, menu backgrounds built; menu layout, bookmark, country selection, rules screens not done (spec 03); vanilla social and DLC buttons remain | Full design and build; country selection with portraits, flags, descriptions, realm lore (plan lane W6) | design system; flags; portraits (done) | UI | stage-1 renders 1920/1280/long | never reviewed |
| Top bar, Aoaz bar, clock, minimap, map interface | Provisional (reskinned textures). **The Aoaz bar is not built** (no `.gui`, scripted GUI or sprite in the build; only the old Realm button) | Build the Aoaz bar; fix overlapping top-bar values and faint resource icons (plan lane W1) | design system | UI | stage-1 renders | values overlap badge sockets; date value cut; map-mode buttons use an idea picture |
| Politics, diplomacy, country overview | Provisional (reskinned textures, four materials in one window, tiled bodies, enlarged borders) | Design pass; realm lore and sign shown (lane W2) | design system | UI | stage-1 renders | laws show vanilla pictures (18); faction logos vanilla (34 textures, 19 factions) |
| Focus tree window and focus icons | Provisional: 4,817 focuses on 178 pictures (most used 155 times; 7 pictures serve one focus); window reskinned, tiled board; Chronicle theme | 4,313 focus icons (one per focus; 226 general groups of 730 focuses share one each, proposed in `icon_shares.json`) (lane I4); board and plaque (lane W3) | design system (accepted); icon registry (built) | UI + icon art | stage-1 renders; focus renders; check 10 baseline 400 unexplained textures | accidental icon reuse |
| National spirits and ideas | Provisional: 1,614 country ideas on 175 pictures (most used 53 times); the same 175 pictures also serve decisions, categories, special projects, operations, agency logos and upgrades, MIO and panel markers (741 sprite names) | Distinct icons per concept (lanes I5, I7) | design system; icon registry | icon art | icon count (stage 1) | accidental icon reuse |
| Research, technology tree, doctrines | Built, untested: K51/K58 tree (285 technologies); **all 285 technology sprites and the 7 gates have no picture of their own** (frame placeholder and vanilla `tank_icon`); tab labels truncate; era label collides with tabs; doctrine titles dark on dark, vanilla special-forces text | Technology and equipment icons (lanes I1, I2); tree and doctrine layout (lane W3) | design system; icon production | technology + icon art | MCP tech_inspect/render; stage-1 renders | |
| Production, construction, logistics, trade, recruitment | Provisional (reskinned textures); vanilla words ("Military Factories", "Dockyards"); empty resource sockets; 113 equipment types, 32 archetypes and 64 sub-units on the shared frame (648 frame sprites in all) | Equipment pictures, unit icons and vanilla-green counters (lanes I2, I3); layout review (lane W4) | design system; warfare | UI + icon art | stage-1 renders | |
| Military (army, navy, air, combat views) | Provisional; slate in combat, walnut elsewhere; 306 leader traits without ZIN icons (100 vanilla trait pictures reachable) | Design pass; unit counters; trait icons (lanes W4, I8) | design system | UI | stage-1 renders | |
| Decisions and missions | Provisional: 249 decisions on 105 idea pictures; 50 categories on 39 | Decision-family icons, category pictures, layout review (lanes I6, W2) | design system | UI | stage-1 renders | |
| Events, news, super events | Built, untested: event window reskinned; 1,213 visible events on 42 pictures (239 on the most used), 84 news on 26; super-event window built with 32 moments, art and audio pending (SE/SA rows) | Event pictures per chain beat (lane I10); super-event art and licensed audio | design system | events + art | super-event renders (six passes); stage-1 renders | catalog picture reuse; super-event art and audio missing |
| ZIN mechanic windows (Aenor court, Hidden Council, Zol presence, Dark Lands panels, powers, realm panel, world tension) | Built, untested; stage-1 renders show overlapping conditional texts (court), meters made from the divider sprite, no header art, no selected-tab state, long-text overflow of titles and tabs; `zin_interim_inlay_window` is an empty 1 × 1 window | Shared meter, tab, row and header sprites; fixes in lane W7; matched review and Linux captures | design system | UI | stage-1 renders (1920, 1280, 2560 for four, long) | |
| Map modes and overlays | Provisional | Review after the new map; ZIN map-mode button icons | map | UI + map | none | footholds button uses an idea picture for both states |
| Tooltips, buttons, dialogs, notifications | Provisional (reskinned textures); the text-colour and font file of spec 02 §3.4 and §3.7 never built; the neutral family of the design system (§1.5, §6) is their target | Component standards, states, long-text and contrast checks (lanes C1, C2, W5) | design system (accepted) | UI | check 17 baseline: 708 buttons with identical normal and hover frames, 58 coloured disabled frames; check 19 contrast in the review harness | |
| Chronicle of Aoaz (codex) | Not started in game (spec 04 Ready) | Build the window and entries (lane W9) | design system; lore | UI + lore | none | |
| Career, honours, meta surfaces | Provisional (spec 06 Draft) | Decide and build | design system | UI | none | |
| Text sweep (vanilla words) | In progress: 2,121 entries written; text scan at its baseline | Finish the families | glossary | text | text scan | |

## 2. World and map

| Subsystem | State | Required | Depends on | Owner | Tests | Open issues |
| --- | --- | --- | --- | --- | --- | --- |
| Geography model and import | In progress: model repaired (rivers off crests, Aenar, Andos, Darkness ridge, passes on crests); import preview READY, land agreement 0.957 | Write the map with `create_world` on HOI4 Agent Tools 4.6.1 | MCP 4.6.1 (installed) | lead | synthesisCheck preview | the write was blocked by pass saddles until 4.6.1 |
| Provinces, states, regions, borders, resources, starting positions | Blocked on the write: the old map's 305 Y-tag files are still in the mod | Write, then review borders (territory service), states, resources, supply | map write | lead + MCP worker | none on the new map | realms grow by weight, not yet along rivers and ranges (territory service released in 4.6.0, not yet used) |
| The Mothers' Mound islet (K64) | Not started | Geography request to the map | map write | lead | none | written request in `docs/plans/deep_history/map_islet_request.md` |
| Key sites and storm seas | Not started on the new map | Key-sites module; storm seas regenerated | map write | lead | none | stand-in site triggers |

## 3. Lore and worldbuilding

| Subsystem | State | Required | Depends on | Owner | Tests | Open issues |
| --- | --- | --- | --- | --- | --- | --- |
| Canon and vault | Maintained: owner decisions K1 to K67 recorded | Keep consistent | | lead | migration dry run, text scan | |
| Deep history (six fallen realms) | Built, untested (K64) | Live proof | Linux run | | deep_past tests | |
| Realm roots and signs (K67) | Built in data for 155 realms, proposed; about 55 open questions in the vault | Owner rulings; switch `REQUIRE_ROOTS` on | owner | lead | schema check | |

## 4. Countries and national content

| Subsystem | State | Required | Depends on | Owner | Tests | Open issues |
| --- | --- | --- | --- | --- | --- | --- |
| Roster and tags | Done in source: 156 realms (Yeldenne retired, K56, content still present), 231 of 439 tags | Remove Yeldenne's content | | lead | tag check | |
| Focus trees | Built, untested: 99 trees, 4,799 focuses; 52 deep-past focuses | Realm-roots branches (≈580 proposed), bespoke trees for realms on shared trees, history-rooted formables (≈68 proposed) | realm roots | content | focus MCP inspect/render, focus tests | many realms share regional trees |
| Characters, rulers, heirs, advisors | Built: 1,142 characters, 8 women (K54/Q-104), 109 heirs | Live proof | | | portrait plan tests | |
| Portraits | Built: 634 pool members, 181 pools, named crops | Owner review | | portraits | portrait tests | chart-islander look not fully met |
| Flags | In progress: K65 pipeline built, flags to be drawn from the K67 signs | Draw, review, wire | realm signs; owner review | flags | heraldry tests; three flag tests fail until wired | |
| National spirits, decisions, events, mechanics per realm | Built, untested for the story mechanics; realm-roots proposals queued | Implement the proposals | realm roots | content | story wiring check | |

## 5. Technologies and mechanics

| Subsystem | State | Required | Depends on | Owner | Tests | Open issues |
| --- | --- | --- | --- | --- | --- | --- |
| Technology tree | Built, untested: 285 technologies, regional ways of life, development tiers, elder technologies | Icons; balance in play | | technology | MCP tech routes | |
| Story mechanics, world tension, realm life, succession, news reach, super events | Built, untested | Linux runs | map write | | story check, tests | |
| Magic, religion, economy, warfare, diplomacy | Built, untested | Review, balance | | | tests | |
| Beasts of the black north (custom unit, K55/Q-71) | Not started | Meshy model (110 credits on 25 October), counters, sourced sound | warfare files free | 3D pipeline | none | Meshy MCP failing to connect in this session |

## 6. Art and audio

| Subsystem | State | Required | Depends on | Owner | Tests | Open issues |
| --- | --- | --- | --- | --- | --- | --- |
| Pending art list | 921 rows in `docs/plans/zin-art/pending_from_integration.md` | Produce with gpt-6-luna | design system for interface art | art | asset gate | |
| Licensed audio (super events, units, menu) | Not started | Sourced, licensed recordings | | audio research | none | |

## 7. Validation

| Check | State | Notes |
| --- | --- | --- |
| Builder and suite | Green except the three flag tests (until the flags are wired) | `scratchpad/verify.sh` |
| Linux harness: start, sweep, observer runs to 4A 1760 and 4A 1800, save and load, zero ZIN error lines | Not run on the current content; last run 24 October on the old map (loads and runs ten minutes) | needs the map write and an apply |
| UI acceptance renders and Linux captures | Offline renders run for the first time on 31 October (UI overhaul stage 1: baseline only, no design accepted); Linux captures never run | Linux captures after plan phases 1 and 2 |

## 8. Tools and workflow

| Item | State | Notes |
| --- | --- | --- |
| MCP worker | Running as its own session; released 4.5.0, 4.6.0 and 4.6.1 for ZIN on 25 October (workspace countries, territory service, straits, river carving, pass saddles) | standing improvement loop; requests filed with evidence |
| Skills | `hoi4-character-art-direction` added; portrait lessons recorded | update on every recurring mistake |
| CLAUDE.md and AGENTS.md | Current; the guidance size check fails (about 68 KB against 60 KB) | trim by moving rarely used detail into skills or docs |
