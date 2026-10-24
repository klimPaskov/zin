# 04. Execution, verification and acceptance

## 1. Dependencies

```
Owner answers (Q-01..Q-10) ──┐
                             ├─> pantheon + calendar (R-30, R-31)
Transcribed bestiary ────────┤─> creatures, devils, Zol's servant (R-03, R-23, R-40)
                             │
Name exchange Erdae/Aoaz (R-01) and renames (R-04) ── run early, before new text is written
                             │
Geography model fixes, seas, Nether, Great Wall (R-02, R-11..R-15)
        │ + MCP worker: C8, C11, C12/C13, drawing import (03)
        v
Map import (R-10) ──> states, regions, names (R-12, R-16) ──> roster, tags, peoples, cultures (R-20..R-29)
        │                                                        │
        v                                                        v
Politics step on the new map (histories, owners, cores, population) ──> forces, AI, focus-tree country lists
        │
        v
Systems, mechanics, events, trees revised (R-60..R-68) ──> interface, assets, flags, audio (R-80..R-96)
        │
        v
Proof: builder checks, validators, Linux runs, observer runs, every-country sweep, save/load (R-98, R-99)
```

Work that does not depend on an open answer proceeds in parallel. The lore process (R-47) runs throughout.

## 2. First actions of the implementation session

1. **Reconcile the package with the workspace.** Re-run the checks of 01, section 1 (git status and heads of both repositories, PR 36, the worktrees, `cd tools && npm test`, the paths in the README). Record every material difference in `docs/zin-handoff/STATE-DELTA.md` before changing anything.
2. **Secure the interrupted work.** Review the uncommitted mod changes slice by slice (01, 1.4); keep what passes review, finish or discard with a reason, commit in coherent pieces. Do not lose the 95 focus trees, the finished mechanics and the events.
3. **Start the Opus MCP worker** (03) and create the request record; hand it the backlog of 03, 4.1 and the first requests (workspace discovery for validators; the drawing import design for Q-04).
4. **Ask the owner** the open questions of 01, section 7 in one message, with the proposals, and continue with independent work.
5. **Update the sources of truth:** re-point `PROGRAM.md` criteria to the A-ids below; mark the master plan's P4 and P13 void; add the corrections to `INTEGRATION_DECISIONS.md`; write the vault retcon rows (R-04).
6. **Run the name migrations** (R-01, R-04) with a dry run, then apply, then add the checks, before writing large amounts of new text.
7. **Transcribe the bestiary cards** (R-40) and start the lore references (R-48).

## 3. Internal tranches (all part of one delivery)

| Tranche | Content | Exit check |
| --- | --- | --- |
| T0 Reconcile | the first actions of section 2 | state delta written; worker running; questions sent; tree green or failures listed |
| T1 Canon foundation | migrations, retcons, bestiary transcription, pantheon and calendar (after Q-01, Q-02), wizards, devils and spirits, wider-world knowledge layers, regional histories (R-45), alternate-history design (R-46) | A-01..A-04, A-30, A-33, A-34, A-40 (transcription part), A-45 draft |
| T2 World and map | geography model repaired, seas, the Nether, the Great Wall range, Hirolon, elven realms reduced, Middle Lands variety; the worker's map capabilities; the drawing import; states, regions, names, resources | A-10..A-19 |
| T3 Peoples and politics | roster and tags, country and faction names, cultures and languages, population, politics step on the new map, starting forces | A-20..A-29, A-50 |
| T4 Systems | stage 2 completion and revision, inherited systems review, rules | A-60 |
| T5 Content | mechanics, events, endings, Chronicle, decisions, focus trees, characters, AI, alternate history engine | A-61..A-66, A-46 |
| T6 Presentation | interface reskin completion, branding, gfx standard, flags, icons, pictures, portraits, units and 3D, audio | A-80..A-96 |
| T7 Proof | full verification and the final report | A-98, section 7 |

Tranches overlap; each ends with the builder suite, validators, a Linux run with screenshots (clock unpaused; at least 10 minutes in T2 and T3, one in-game year from T5), the error budget, a pushed commit and a `PROGRAM.md` update.

## 4. Verification strategy

| Level | Tool | Used for |
| --- | --- | --- |
| Unit and data tests | `cd tools && npm test` (node test runner) | every builder module; 40+ assertions with negative cases per slice |
| Builder checks | vanilla checks C1 to C5, asset manifest and uniqueness, UI checks 1 to 9, text scan, focus compiler checks, history schema, tag check, gfx standard check, geography model checker | run inside `node content/build.mjs`; the build fails on any error |
| MCP validators | `hoi4_map_inspect` (with `quality: true`), `hoi4_script_validate`, `hoi4_focus_inspect`, `hoi4_event_inspect`, `hoi4_gui_inspect`, `hoi4_tech_inspect`, `hoi4_probability_*`, `hoi4_package_check` | the real ZIN workspace after apply |
| Live runs | the Linux harness `tools/acceptance/` under `/tmp/hoi4_wsl.lock` | start as the great powers and a sample of minors with the clock running; screenshots of the Great Lake, the Great Wall range, Kingson, the East Lands ranges, the Nether, both world edges, the interface surfaces of A-80; `error.log` |
| Observer runs | the Linux harness | 4A 1748 to 1760 and to 1800, the main historical direction and at least two divergent seeds; performance measured |
| Every-country sweep | the Linux harness | each tag starts and runs one in-game month without errors |
| Save and load | the Linux harness | save mid-war, reload, continue |
| Owner review packs | `docs/images/comparisons/` (MCP renders and approved screenshots only) | map and interface before and after |

The Windows game is never launched, automated or captured.

## 5. Coverage matrix

| Acceptance | Requirement | Check and evidence |
| --- | --- | --- |
| A-01 | R-01 | migration report; check fails on "Erdae" meaning the main setting and on "Arda"; `names_traceability.md` complete; spot check of localisation, map labels, events, menus, vault |
| A-02 | R-02 | vault and specs say "natural range"; P4/P13 void; the map shows a continuous range with named passes; no "wall" structure in art or text; supply and attrition behave in a test war |
| A-03 | R-03 | after Q-03: no text, event, picture or flag shows Zol in person in the war; the servant's events fire in an observer run |
| A-04 | R-04 | retcon rows for every correction; Vez'nan and Edvoid migrations done |
| A-10 | R-10 | the chosen map imported through MCP; all layers aligned (renders compared with the drawing); `hoi4_map_inspect` and validators pass; the game loads it; a second import with no source change produces identical files; an authored override survives a re-import; a deliberately broken input gives an accurate diagnostic; the tool repository's tests for the other map workflows (reference and procedural worlds, legacy partition hashes, inspect, rewrite, renders) still pass |
| A-19 | R-19 | a dossier for every region with all required headings filled; spot checks that map, roster, content and art agree with it |
| A-11 | R-11, R-18 | geography model checker passes (rings, rivers monotone to sea or lake, lakes inside land, no land at the seam); terrain shares per region within 10 points of the model; screenshots of water, ranges, both edges |
| A-12 | R-12, R-15 | border-quality metric at or above the thresholds; no placeholder names (build check); regions coherent in map modes |
| A-13 | R-13 | no duplicate or contradictory sea names (checker); former labels listed |
| A-14 | R-14 | the Nether present below the Dead Lands with its realm and routes; screenshot |
| A-16 | R-16, R-17 | every state and victory point named from its language; capitals justified in the histories; resources and buildings follow terrain (checker statistics) |
| A-20 | R-20, R-21, R-26 | peoples, cultures and states distinct in data and game; each listed people present on the map with realms or enclaves, units, laws and names |
| A-22 | R-22 | Hirolon on the map inside its mountains, with history and relations |
| A-24 | R-24, R-25 | fewer and smaller elven realms (before and after counts and areas); Middle Lands include non-human realms |
| A-27 | R-27 | tag check: every tag `^[A-Z]{3}$`, unique, not vanilla, total below 439; no old tag remains; flags and histories renamed |
| A-28 | R-28 | names audit: no leader-named countries, no bureaucratic names; owner-review list |
| A-29 | R-29 | demography check against fertility, rivers and coasts; manpower applied |
| A-30 | R-30..R-32 | twelve gods documented (identity, domain, worship, relations); calendar shows god-month names in game; faith content wired |
| A-33 | R-33 | text check finds no Erdu, Dunda or creator facts in public text; knowledge labels in data |
| A-34 | R-34, R-35 | wizards documented and present (characters, events or decisions); magic limits recorded |
| A-40 | R-23, R-40, R-41 | all cards transcribed and checked; bestiary expanded per region; ecology effects in play |
| A-45 | R-45 | history files for every region pass the schema; prose specs written; content consumers use them |
| A-46 | R-46 | divergence table and soft-lock audit complete; observer runs on divergent seeds reach coherent states and an ending or the sandbox without errors |
| A-47 | R-47, R-48 | lore change log per tranche; references current; questions recorded |
| A-50 | R-50, R-51 | names generator report: per-culture syllable separation; shared roots documented |
| A-52 | R-52 | text scan rules (debug text, separators, banned words, god-versus-man quotes) pass on all staged localisation |
| A-60 | R-60, R-67, R-68 | stage 2 notes' gaps closed; inherited systems list with a disposition each; vanilla checks C1 to C5 pass |
| A-61 | R-61 | every country has a tree of its tier; compiler zero problems; focus renders reviewed |
| A-62 | R-62 | every mechanic spec implemented and wired; its GUIs open and work in a live run |
| A-63 | R-63, R-64 | every event and decision wired and reachable (event and decision inspectors); endings reached in observer runs |
| A-65 | R-65 | every ruler, heir and named figure has a portrait and biography |
| A-66 | R-66 | probability audits for key choices; observer runs show sensible behaviour |
| A-80 | R-80, R-81 | interface inventory with zero pending rows; screenshots of every surface in the list of R-80 |
| A-82 | R-82, R-83 | each surface checked in its states, with long names and at the listed resolutions and scales; tooltip audit against behaviour |
| A-90 | R-90 | the owner's logo files adapted and in game (menu, loading); originals unchanged (hash recorded) |
| A-91 | R-91 | gfx standard check passes for every family |
| A-92 | R-92 | flag design check (coverage, no repeated cliché, palette per culture); accepted sheets; in-game flags |
| A-93 | R-93, R-94 | asset manifest: zero unresolved, zero near-duplicates beyond accepted families, provenance for every file; unit entities for every unit type |
| A-96 | R-96 | per Q-08: soundtrack and effects in game, sources or provenance recorded |
| A-98 | R-98, R-99 | zero ZIN error-log lines; all checks and validators green; every-country sweep; observer to 4A 1800; save/load; performance numbers |

## 6. Blockers and risks known at handoff

| Blocker | Effect | Handling |
| --- | --- | --- |
| Open owner questions Q-01 to Q-10 | pantheon, calendar, Zol's servant, map import source, Hirolon, hobbits, devils, audio, Bastian, Edvoid's name | ask in T0; continue independent work; never decide alone |
| Usage limits (session and weekly) stopped all agents on 19 October | lost work, half-edited files | at most about six concurrent subagents; persist work early; keep resumable notes; resume rather than restart |
| Meshy credits (40 on 19 October, unverified) | few new 3D models | reuse models with new textures; record each fallback |
| The image route (gptimage, ChatGPT plan) | art throughput | batch sheets; one generator process at a time |
| Validators without a workspace in agent sessions | weaker checks | worker request in T0 |
| The Linux harness | the only runtime proof | keep the lock discipline; record each run |

A blocker is reported with what was tried and the evidence; it never becomes "done".

## 7. Definition of done

The overhaul is complete only when every A-check above passes on the final build, every owner question is answered and applied (or the owner has explicitly deferred it), `PROGRAM.md` shows every criterion met with evidence, both repositories are committed and pushed (the tool through merged PRs and a release that the clients run), and the final report (in `PROGRAM.md` and the mod README) lists what was built, the verification evidence, the remaining known issues and any owner decisions still pending. Planning documents, demonstrations or partial conversions do not count.
