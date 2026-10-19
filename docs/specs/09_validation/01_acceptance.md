# Validation and acceptance

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** all. **Phase:** all.

## Purpose

This spec says how ZIN is proved to work: the offline checks every build runs (builder tests, compiler checks, HOI4 Agent Tools inspectors, validators and renderers), the isolated Linux acceptance run under the shared WSL lock, the acceptance criteria of each roadmap phase, and the regression tests for the start crashes. A phase is done only when its criteria pass here.

The Windows game is never launched, automated or captured. The HOI4 Agent Tools MCP server only reads and checks source offline. Live evidence comes only from ZIN's private Linux harness, which the ZIN project instructions explicitly permit.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| On 1 Thaw 4A 1748 the Golden King reigns, Eindil has not appeared, Afrit is unrevealed and Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| People know only the Deliverer; the name Afrit is secret | established | *Fourth Age Canon Register* |
| Canonical spellings: Eindil, Zol's Mistake, Aenor, Šodolôrō (game text Šodolôro, S11); never Einendil, Edvoid or Rush for places | owner rule | *Canon Policy*, CONVENTIONS |
| Established facts are fixed; additions are proposed; open questions stay open | owner rule | *Canon Policy* |
| Every check, number, case and tool sequence below | **proposed** | this spec |

Validation enforces the lore rules mechanically where it can (start state, secrecy, spellings, open questions in text) and through review where it cannot.

## Design

### 1. Gates

Every build passes the gates in order. A failure stops the chain.

| Gate | What | Where it runs | Blocks |
| --- | --- | --- | --- |
| G1 Builder tests | Unit, generator and data tests of the ZIN content builder | `npm test` in `tools/` (`content/build.test.mjs`, `content/vanilla.test.mjs`, `content/presentation.test.mjs`, and every mechanic module's `content/mech_*.test.mjs` once that module is built; `tools/package.json` lists them in its `test` script) | everything |
| G2 Compiler | Focus, event, decision, catalog, localisation and art checks during the build | builder (the focus compiler from phase 4) | staging |
| G3 Offline tools | HOI4 Agent Tools inspectors, validators, renderers and test suites on the staged mod | MCP, workspace `zin` | the Linux run |
| G4 Linux run | Isolated game under the shared WSL lock, with the clock running | `.tmp/zin-live.sh` (private, ignored by Git) | phase acceptance |
| G5 Review | Owner review of renders, captures and open questions | owner | phase sign-off |

A commit to `master` needs G1–G3 green. A phase needs G1–G5. Integration decisions S8 and S8a set the live length per phase; section 5 states them as wall-clock and game-time rules.

### 2. G1: builder tests

"Active" says from when the test runs; a test whose input does not exist yet is skipped with a printed reason, never silently.

| Test | Fails when | Active |
| --- | --- | --- |
| Determinism | Two builds of the same inputs differ in any byte (outputs, `.zin-content.json`, `.hoi4-agent-world.json`) | now |
| Data schemas | Any `tools/content/data/**/*.json` or `docs/design/**/*.json` (countries, characters, focus trees, interface, art jobs, catalog, sites, defines, rules) fails its schema | now, per file as it lands |
| Names to tags | A country name in any data file does not resolve to exactly one roster country | now |
| Tag budget | The tag total is 439 or more, or a tag other than the 305 ZIN tags and D01–D75 is defined ([06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md), rule 9) | now |
| Vanilla removal | Checks C1–C5 of the vanilla removal spec, with their negative tests | now |
| Calendar | Any staged history or dated block still uses a 1936 date; the start is not `1748.3.1.12` | phase 2 |
| Start state | Generated history sets any story flag of the contract, recruits `zin_eindil`, or creates a war at the start | now |
| Encoding | A localisation file lacks the UTF-8 BOM or uses a character outside Windows-1252 | now |
| Spellings | Any player-facing text contains "Einendil", "Edvoid" or "Rush" as a place | now |
| Open questions | Any text matches the forbidden-claims list (`forbidden_claims.json`: Zol's keeper named, Volgan's spirit settled, Dardan placed, Gala elves called Sunhot elves, Ein's sons' order stated, the arm Eindil loses) | when the list lands (phase 2) |
| Contract | A flag, variable, scripted trigger or scripted effect name used by two systems is missing from the shared contract or its additions, or has a second name | phase 3 |
| Manifests | A file listed in a manifest is missing or its hash differs; a generated file is missing from its manifest | now |
| Art | Section 4 of the art pipeline: manifest lines, DDS headers, sizes, provenance acceptance, alpha corners | now |
| Slicing | Re-slicing one accepted sheet of each kind changes an output byte | now |
| Start-crash guards | Any check of section 6 fails | now |
| World data | The data check of [04_countries_and_states.md](../00_foundation/04_countries_and_states.md) | as its rules land |

### 3. G2: compiler checks

The focus compiler's seven checks ([00_format_and_compiler.md](../05_focus_trees/00_format_and_compiler.md)) plus:

1. **Coverage:** every roster country has exactly one tree (the interim tree counts until phase 6).
2. **Catalog:** icon and picture keys exist; gated pictures used only after their gate; two-face icons use global flags only ([02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md)).
3. **Secrecy:** no localisation reachable before `zin_afrit_revealed` by a country other than the Worshipdom contains "Afrit", calls the Deliverer a demon, or says "Hidden Council". The scan covers focuses, ideas, decisions, events, opinion and dynamic modifiers, party names, character names and titles, country names, bookmark text, game rule text, interface text and every branch of scripted localisation not gated on `zin_afrit_revealed` or `zin_afrit_is_hub`.
4. **Eindil at the start:** no text or picture reachable at the start names or shows Eindil; text before `zin_eindil_named` uses "the Man from the Ice" or "the stranger".
5. **Events:** every event is fired by something or declares a trigger in a mechanics-owned file; namespaces match the contract; ids are unique; every option has text and an AI chance.
6. **Decisions:** every decision category has a picture; hub-only categories have `zin_afrit_is_hub` in `visible`.
7. **Modifiers:** every modifier name exists in the installed `modifiers_documentation.md`.
8. **Raw blocks:** counted; a major tree has at most ten.

Until the compiler exists (phase 4), checks 3, 4 and 7 run in G1 on the builder's own output.

### 4. G3: offline HOI4 Agent Tools checks

Run against the staged mod in the `zin` workspace. Results are offline source models, not observed game behaviour; unresolved states are not counted as coverage.

| Tool | Run on | Pass |
| --- | --- | --- |
| `hoi4.mod_index` (`overview`, `next_id`) | whole mod | Expected folder and definition counts; no event id collision in any `zin_*` namespace |
| `hoi4.script_validate` (`path`) | every generated `common/`, `events/`, `history/` file | No syntax, command or scope errors; every unresolved finding listed in the phase report with a reason |
| `hoi4.source_lookup` | every ZIN override of a vanilla name | Overrides are intended; no accidental shadowing |
| `hoi4.package_check` | one manifest per system (`tests/packages/<system>.json`: Aenor, Afrit, Eindil, Volgan, Zol, Lerendor, Yeldenne and Glo, world, interface) | `absent` and `shadowed` are 0; `unresolved` reviewed |
| `hoi4.mechanic_test`, `hoi4.scenario_test` | suites `tests/mechanics/<system>.json` | All cases pass; unsupported effects listed. Minimum cases per system: start values, each threshold crossing, each clamp, each reveal or story flag set by its owner only |
| `hoi4.decision_inspect` | start scenario per great power; one non-hub viewer | Hub-only categories invisible to non-hubs; no war decision available at the start |
| `hoi4.event_inspect`, `hoi4.event_render` (`reachability`, `timing`, `unresolved`) | each namespace | Every event reachable; no story event can fire at the start; unresolved edges listed |
| `hoi4.probability_inspect`, `hoi4.probability_analyze` | mean-time events and AI weights of historical options | Under `zin_rule_historical_path = HISTORICAL` the historical option dominates every AI choice the path spec lists |
| `hoi4.focus_inspect`, `hoi4.focus_render` | every compiled tree | No inspector errors; a review render for every tier A and B tree |
| `hoi4.tech_inspect`, `hoi4.tech_render` | technology tree and doctrines | No dangling references; folders render |
| `hoi4.gui_inspect`, `hoi4.gui_render` | every ZIN window, scenarios of [01_interface.md](../07_interface/01_interface.md) | Expectations pass at all five resolutions; overlay collision check clean |
| `hoi4.map_inspect` | map | The five map checks of the map rewrite pass; every key site has its state or victory point ([02_key_sites.md](../01_map/02_key_sites.md)) |
| `hoi4.impact_inspect` | every changed shared name | All consumers updated in the same build |

Renders go into the phase report labelled "offline render, tool-generated".

### 5. G4: the isolated Linux run

**Setup** (exists): WSL `Ubuntu-24.04`, user `klim`; game at `/home/klim/games/hoi4` (record the version, last seen 1.19.3); private profile `/home/klim/.local/share/zin-acceptance-20261015/profile`; display `:96` on Xvfb with llvmpipe; window 1600×900, UI scale 1.0, autosave off, text saves, sound off. Harness: `.tmp/zin-live.sh` in the ZIN folder, run as `wsl -d Ubuntu-24.04 -u klim -- bash '<zin>/.tmp/zin-live.sh' <command>`, with the commands `sync`, `start`, `capture <name>`, `status` and `stop` (`prepare` only once, while no profile exists).

**Lock rules:**

- `start` takes the shared lock `/tmp/hoi4_wsl.lock` with the token `zin_acceptance_20261015` and refuses if it exists or if any Linux game runs.
- `capture` and `stop` require ZIN's own token.
- Never remove another task's lock; never stop another task's game; never run `prepare` again while the profile exists.
- `stop` releases the lock only after the game has exited.

**The clock must run.** Until 19 October 2026 every Linux test started a campaign, looked at the map and stopped without unpausing. Those tests passed while the game crashed for players: the flag-sheet crash ([03_known_issues.md](../01_map/03_known_issues.md) section 1) strikes when flags load during play, so a start-only test cannot see it. The integer divide by zero showed up only after the fix was tested with the clock running (four runs of 10 to 15 minutes at top speed, about four months of game time). Every live case below therefore unpauses and runs.

| Phase | Clock rule for every start case |
| --- | --- |
| 1 and 2 | Unpaused at speed 5 for at least **10 minutes of wall-clock time**, and never fewer than 60 in-game days (S8a) |
| 3 and every later phase | Unpaused until **one full in-game year** has passed (S8a) |

The case passes only if the date the game reports at the end (console `time`, then `savegame`; the text save's `date` field) is at least the start date plus the required game time. A case that ends early by a crash fails, whatever the date.

**Procedure for every run:**

1. G1–G3 green on the commit under test; working tree clean.
2. `sync`: copies only manifest files, verifies source and destination hashes, archives the previous logs into `evidence/logs-<ns>`.
3. `start`, then drive the menus with `xdotool` on display `:96` (hold each key or button about 0.4 s; never chain commands after `xdotool type`). Set the game rule `zin_rule_debug_checks` to `ON` on the rules screen.
4. Pick the case's country, start, unpause (Space), raise the speed to 5 (`+`), and run for the time the clock rule requires.
5. `capture <case>` at each checkpoint; names are `p<phase>_<case>` (lowercase, digits, `_`, `-`).
6. At the end: console `time`, console `savegame`, `status`, `stop`.
7. Run checks C6 and C7: `node tools/content/checks/error_budget.mjs <profile>/logs/error.log <profile>/logs/text.log <stage>` (the logs read through `hoi4.error_log`, scope `mod` and `all`, from a tools workspace whose `gameUserRoot` is the Linux profile). The global flag `zin_start_check_failed` must not be set ([01_start_situation.md](../02_lore/01_start_situation.md), `zin_lore.20`).
8. On a crash, keep `profile/crashes/hoi4_<stamp>/` and record the stack signature.

**Cases:**

| Id | Case | Pass |
| --- | --- | --- |
| L1 | Start as each of Aenor, Volgan, Zol, Lerendor, the Magical Forest, the Worshipdom, Mirolon and a tier C country; run under the clock rule | Map reached; the clock rule's time passes; no crash; no war started |
| L2 | Save at the end of L1 (as Aenor), return to the menu, load, unpause for 30 in-game days | Loads; date and meters unchanged at load; no crash |
| L3 | Start screen and day-1 checks as Aenor (from phase 2) | Date "1 Thaw 1748"; bookmark "The Fourth Age"; no war in the diplomacy view; once the world systems ship, `zin_gathering_dark` is 10 (V1; console) and the Erdae bar shows it with "4A 1748"; no "Afrit" on any screen opened (Realm, Court, decisions, focus tree, politics) |
| L4 | Open every ZIN panel and tab for the case's country, with the clock running | Opens, closes, no crash |
| L5 | Observer run (`observe` from day 1) under `zin_rule_historical_path = HISTORICAL` to 1 Deepwinter 4A 1761 | The historical path's acceptance ([06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)): checkpoints resolve; `zin_ending_lost_cause` set; no stall |
| L6 | Observer runs under `FREE`, three seeds, to 4A 1770 | An ending or `zin_ending_unfinished`; no stall |
| L7 | Three cold launches | No vanilla Second World War loading screen or menu background |
| L8 | Error log of every run | C6 and C7 pass for the current stage of the vanilla removal |
| L9 | Every-country sweep (phase 1, and after any change to tags, flags, countries or states): on the selection screen select each of the 305 countries in turn, so every flag and portrait loads; start, then switch with `tag <TAG>` through every country, holding each for 7 in-game days unpaused at speed 5 (about three hours) | No crash; no new error category |
| L10 | Observer run on defaults to the end date, 4A 1800 | No crash; save and load at 4A 1800 work |

Long observer runs (L5, L6, L10) use the highest speed and may take hours; they run for phases 3, 5 and 8 and on release candidates (foundation question 14 proposal).

**Evidence:** captures, the error log copy, `hoi4.stdout.log`, `renderer.txt`, the end-of-case save and the game version go into `evidence/` in the Linux runtime, and a summary with selected captures goes into the phase report. Captures are Linux acceptance evidence; they are published only with the owner's approval.

### 6. Regression tests for the start crashes

**Cause, found 19 October 2026.** The engine places every tag's flag in a texture sheet by tag index. With 744 tags, ZIN's flags (indices 440–744) reached a sheet page whose column count is 0, and the game divided by zero: `EXCEPTION_INT_DIVIDE_BY_ZERO` at `hoi4.exe+0x1240ab6` on Windows, a segmentation fault with the stack `(+0x266a46c) (+0x13cf698) (+0x13cef6b)` in the Linux copy. Fixed by defining only the 305 ZIN tags and 75 dynamic tags (commit `ca01fa3`). Wrong leads, recorded so they are not retried: the 30,000 manpower floor and the inactive-file bisection ([03_known_issues.md](../01_map/03_known_issues.md)).

**Offline guards (G1, run for every country, failing on Aenor first).** The tag budget is the guard for the cause. The other guards stay as data hygiene for the suspects of the investigation.

| Suspect | Guard |
| --- | --- |
| Tag budget | Fewer than 439 tags; ZIN tags first, then D01–D75; nothing else (also tested in the politics step) |
| Country name, definite name, adjective | Keys `<TAG>`, `<TAG>_DEF`, `<TAG>_ADJ` and each ideology variant exist once, are non-empty, Windows-1252, no unbalanced `§`, `$` or `[`, no stray quotes |
| Ruler character | The ruler id exists once; every portrait sprite it names resolves to a DDS of 156×210 (large) or 65×67 (small) with a valid header; the leader's ideology exists; no trait is missing |
| States and capital | The capital state is owned and controlled by the country, has a victory point in a province of that state, buildings within slots and valid per-province buildings, a supply node or capital supply hub as the engine requires, and no province shared with another state; every state has at least 30,000 manpower |
| History | Every idea, technology, template sub-unit, equipment and OOB file named exists; ruling party is a ZIN ideology; popularities sum to 100; the `set_politics` date is not after the start date |
| Subjects and faction | Every puppet exists and has a capital; the faction leader is in its faction; no subject is its own overlord's overlord |

**Live tests (G4), all under the clock rule:**

| Id | Test | When |
| --- | --- | --- |
| R1 | Start as Aenor and run | Every build touching tags, flags, countries, characters, states, history, localisation of country names, interface or map |
| R2 | Start as Selen and as Kingson (Aenor subjects) and run | Same |
| R3 | Start as Aenor, open the Realm panel and the Golden Court panel on every tab with the clock running | Every interface build |
| R4 | Start as Aenor, run, save, reload, run 30 more days | Phase acceptance |
| R5 | Start as Aenor under each `zin_rule_golden_king_death` option (`DYNAMIC`, `HISTORICAL`, `DELAYED`, `NO_AI_PLOT`; N4, N15) | Phase 3 acceptance |
| R6 | Force the succession by console (`zin_golden_king_dead` route) and take each breakaway realm (tag switch) | Phase 3 acceptance |

**On any new crash:** fix it in the generator; add a negative test that feeds the broken input to the generator and expects a build failure; record the cause in the known issues file; rerun R1–R4, L1 for all great powers and L9. A recurrence of either stack signature in any run fails the build.

### 7. Per-phase acceptance

Each row adds to the previous rows; earlier criteria must keep passing.

| Phase | Roadmap "done when" | Concrete checks |
| --- | --- | --- |
| 1 Map accuracy and stability | Map table rows "matches" or "accepted"; campaign starts as Aenor, Volgan, Zol, Lerendor and the Magical Forest; no new ZIN errors | G1 guards of section 6; `hoi4.map_inspect` five map checks; key-site triggers generated from one table (`zin_sites.txt`); L1 for the five under the 10-minute clock rule; L9; R1–R3; L8 within the stage-1 budget; political render with region names in the report |
| 2 Base lore | Game opens on 1 Thaw 4A 1748; every great power has its lore ruler and court; nothing at start reveals Afrit, shows Eindil or starts a war | Calendar and start-state tests; secrecy and Eindil scans; character data complete for tier A; L3; L1 for the eight start cases under the 10-minute clock rule; portraits pass art review; history path start check (no war, no Eindil, no story flag) |
| 3 Base gameplay and mechanics | Each great power plays differently; the AI uses each mechanic; the historical path runs 4A 1748 to 4A 1760 without a player | Package checks and mechanic suites for every system green; decisions and events inspected; L1 for all eight start cases under the one-year clock rule; L4 for every mechanic panel that exists; L5 once and L6 three seeds; R5, R6; L8 within the stage-2 or stage-3 budget |
| 4 Focus trees for the main countries | Each major tree passes the compiler and the focus inspector, renders cleanly, and its historical route is taken by the AI | Compiler green; `hoi4.focus_inspect` clean and `hoi4.focus_render` review image per tier A tree; L5 shows each tree's historical focuses taken in order (focus log from the save); L1 one-year runs |
| 5 Events and endings | Every ending is reachable in test runs; the historical path reaches Eindil's coronation | Event reachability renders; L5 reaches `zin_eindil_crowned`; one forced test per ending (console flags or rules) reaches its news event; Chronicle event shown |
| 6 Every other country | All 305 countries have an Erdae focus tree | Coverage check; every tier B and C tree inspected; L1 one-year runs for one country of each shared tree (13 runs, may share one session via tag switching); L9 |
| 7 Interface, art and polish | Themed top bar and panels, loading screens, focus and event art, 3D units | Interface acceptance ([01_interface.md](../07_interface/01_interface.md)); art pipeline acceptance; no placeholder art used; L7; L8 at zero lines outside the allowlist (stage 4); 3D units pass the warfare spec's evidence list |
| 8 Depth and history | More events, characters and regional history | All earlier gates green; new content passes the same checks; L5, L6 and L10 rerun |

### 8. The phase report

Each phase ends with `docs/validation/phase-<n>.md` (new): commit hash, game version, gate results, tool versions, unresolved findings with reasons, the C6 classification (baseline, current stage, allowlist hits), the end-of-case dates that prove the clock ran, renders (labelled offline) and captures (labelled Linux run), and open questions for the owner. Reports are public with the repository; Linux captures are linked from the private runtime and published only with the owner's approval (foundation question 15 proposal). The spec statuses a report covers move to "Done" only after the owner accepts it.

### 9. Allowed engine lines

[PROGRAM.md](../PROGRAM.md) allows only engine messages that no mod file can affect, each listed here with its reason. The list is `error_allowlist.json`; the rule for adding an entry is in [06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md) section 6.

| Pattern | Source | Reason | Control run | Added |
| --- | --- | --- | --- | --- |
| `Could not find DLC '<name>' in store backend.` (3 lines) | `dlc.cpp` | The Linux store layer reports three DLCs it cannot find while it registers DLC, before any mod loads | isolated Linux run, no mod, game 1.19.3, main menu, 19 October 2026 | 19 October 2026 |

## Implementation

### Files

| Path | Content | State |
| --- | --- | --- |
| `tools/content/build.test.mjs`, `vanilla.test.mjs`, `presentation.test.mjs` | G1 (`npm test` in `tools/`) | exist; the tests of section 2 marked "now" and not yet present are added there |
| `tools/content/mech_*.test.mjs` | G1 tests of each mechanic module, added to the `test` script of `tools/package.json` in the build that adds the module | per mechanic |
| `tools/content/checks/vanilla_refs.mjs`, `tools/content/checks/error_budget.mjs` | C1–C7 | exist |
| `tools/content/data/validation/forbidden_claims.json` (new; published as `docs/design/validation/forbidden_claims.json`) | Phrases and patterns that would close open questions or break the secret | phase 2 |
| `tools/content/data/vanilla/baseline_errors.json` (published as `docs/design/validation/baseline_errors.json`) | Inherited vanilla and engine lines by category, with patterns, counts, dates and stage budgets | exists |
| `tools/content/data/vanilla/error_allowlist.json` | Section 9 | exists |
| `tests/packages/<system>.json` (new) | `hoi4.package_check` manifests | per system |
| `tests/mechanics/<system>.json` (new) | Mechanic and scenario suites | per system |
| `tests/ui/<scenario>.json` (new) | GUI scenarios | per window |
| `tests/linux/cases.json` (new) | Linux cases, the countries per case, the clock rule per phase, the capture names | phase 1 |
| `docs/validation/phase-<n>.md` (new) | Phase reports | per phase |
| `.tmp/zin-live.sh` | Private harness (ignored by Git) | exists |

Test fixtures are synthetic and ZIN-owned. No vanilla file, other mod's file or game capture is a fixture.

### Variables, flags, events, game rules, defines

None of its own. The Linux runs use the start situation's game rule `zin_rule_debug_checks` and read its flag `zin_start_check_failed`. Live tests set story state only through the console in the isolated run; no test-only content ships in the mod.

## AI

The observer runs (L5, L6, L10) are the AI's acceptance: each great power must use its mechanic (at least one mechanic decision or focus per year where the mechanic spec says the AI acts), and the historical path must resolve. The phase report lists which mechanic decisions the AI took.

## Acceptance

1. G1–G3 run in one command from the builder and stop on the first failure.
2. The secrecy, spelling, open-question, start-state and tag-budget checks each have a negative test: a planted bad string, flag or extra tag makes the build fail.
3. The start-crash guards each have a negative test with a synthetic broken country.
4. One full G4 run (L1–L4, L7, L8, L9) completes on the current build under the clock rule of its phase, and its report exists with the end-of-case dates.
5. A run whose end-of-case date shows less game time than the clock rule requires is reported as failed (negative test: a planted save dated on the start day).
6. No step of this spec launches, automates or captures the Windows game.

## Open questions

All proceed on their proposals; the owner's copies are in [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md), interface art validation 13–16.

1. Is a 60-day run enough for phases 1 and 2? Decided by S8a: at least 10 minutes at top speed and never under 60 game days, because the start-only tests missed the flag-sheet crash.
2. Long observer runs for every release, or only at phase ends? Proceeds on: phases 3, 5 and 8 and release candidates.
3. May phase reports with Linux captures go into the public repository? Proceeds on: reports yes, captures only with the owner's approval.
4. Which inherited warnings may stay permanently? Decided by the allowlist rule: only lines no mod file can affect (section 9).
