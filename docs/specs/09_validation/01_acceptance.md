# Validation and acceptance

**Status:** Draft. **Priority:** all. **Phase:** all.

## Purpose

This spec says how ZIN is proved to work: the offline checks every build runs (builder tests, compiler checks, HOI4 Agent Tools inspectors, validators and renderers), the isolated Linux acceptance run under the shared WSL lock, the acceptance criteria of each roadmap phase, and the regression tests for the Aenor start crash. A phase is done only when its criteria pass here.

The Windows game is never launched, automated or captured. The HOI4 Agent Tools MCP server only reads and checks source offline. Live evidence comes only from ZIN's private Linux harness, which the ZIN project instructions explicitly permit.

## Lore basis

| Fact | Status | Source |
| --- | --- | --- |
| On 1 Thaw 4A 1748 the Golden King reigns, Eindil has not appeared, Afrit is unrevealed and Erdae seems at peace | owner-fixed | *The Campaign of 4A 1748* |
| People know only the Deliverer; the name Afrit is secret | established | *Fourth Age Canon Register* |
| Canonical spellings: Eindil, Zol's Mistake, Aenor, Šodolôrō; never Einendil, Edvoid or Rush for places | owner rule | *Canon Policy*, CONVENTIONS |
| Established facts are fixed; additions are proposed; open questions stay open | owner rule | *Canon Policy* |
| Every check, number, case and tool sequence below | **proposed** | this spec |

Validation enforces the lore rules mechanically where it can (start state, secrecy, spellings, open questions in text) and through review where it cannot.

## Design

### 1. Gates

Every build passes the gates in order. A failure stops the chain.

| Gate | What | Where it runs | Blocks |
| --- | --- | --- | --- |
| G1 Builder tests | Unit and generator tests of the ZIN content builder | builder (`npm test`) | everything |
| G2 Compiler | Focus, event, decision, catalog, localisation and art checks during the build | builder | staging |
| G3 Offline tools | HOI4 Agent Tools inspectors, validators, renderers and test suites on the staged mod | MCP, workspace `zin` | the Linux run |
| G4 Linux run | Isolated game under the shared WSL lock | `.tmp/zin-live.sh` | phase acceptance |
| G5 Review | Owner review of renders, captures and open questions | owner | phase sign-off |

A commit to `master` needs G1–G3 green. A phase needs G1–G5.

### 2. G1: builder tests

| Test | Fails when |
| --- | --- |
| Determinism | Two builds of the same inputs differ in any byte (outputs, `.zin-content.json`, `.hoi4-agent-world.json`) |
| Data schemas | Any `docs/design/**/*.json` (countries, characters, focus trees, interface, art jobs, catalog, aenor states, eindil route) fails its schema |
| Names to tags | A country name in any data file does not resolve to exactly one roster country |
| Calendar | Any staged history or dated block still uses a 1936 date; the start is not `1748.3.1.12` |
| Start state | Generated history sets any story flag of the contract, recruits `zin_eindil`, or creates a war at the start |
| Encoding | A localisation file lacks the UTF-8 BOM or uses a character outside Windows-1252 |
| Spellings | Any player-facing text contains "Einendil", "Edvoid" or "Rush" as a place |
| Open questions | Any text matches the forbidden-claims list (`docs/design/validation/forbidden_claims.json`: Zol's keeper named, Volgan's spirit settled, Dardan placed, Gala elves called Sunhot elves, Ein's sons' order stated, the arm Eindil loses) |
| Contract | A flag, variable, scripted trigger or scripted effect name used by two systems is missing from the shared contract, or has a second name |
| Manifests | A file listed in a manifest is missing or its hash differs; a generated file is missing from its manifest |
| Art | Section 4 of the art pipeline: manifest lines, DDS headers, sizes, provenance acceptance, alpha corners |
| Slicing | Re-slicing one accepted sheet of each kind changes an output byte |
| Aenor crash guards | Any check of section 6 fails |

### 3. G2: compiler checks

The focus compiler's seven checks ([00_format_and_compiler.md](../05_focus_trees/00_format_and_compiler.md)) plus:

1. **Coverage:** every roster country has exactly one tree.
2. **Catalog:** icon and picture keys exist; gated pictures used only after their gate; two-face icons use global flags only ([02_icon_catalog.md](../05_focus_trees/02_icon_catalog.md)).
3. **Secrecy:** no localisation reachable before `zin_afrit_revealed` by a country other than the Worshipdom contains "Afrit", calls the Deliverer a demon, or says "Hidden Council". The scan covers focuses, ideas, decisions, events, opinion and dynamic modifiers, party names, character names and titles, country names, bookmark text, interface text and every branch of scripted localisation not gated on `zin_afrit_revealed` or `zin_afrit_is_hub`.
4. **Eindil at the start:** no text or picture reachable at the start names or shows Eindil; text before `zin_eindil_named` uses "the Man from the Ice" or "the stranger".
5. **Events:** every event is fired by something or declares a trigger in a mechanics-owned file; namespaces match the contract; ids are unique; every option has text and an AI chance.
6. **Decisions:** every decision category has a picture; hub-only categories have `zin_afrit_is_hub` in `visible`.
7. **Modifiers:** every modifier name exists in the installed `modifiers_documentation.md`.
8. **Raw blocks:** counted; a major tree has at most ten.

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
| `hoi4.map_inspect` | map | The five map checks of the map rewrite pass; every key site has its state or victory point |
| `hoi4.impact_inspect` | every changed shared name | All consumers updated in the same build |

Renders go into the phase report labelled "offline render, tool-generated".

### 5. G4: the isolated Linux run

**Setup** (exists): WSL `Ubuntu-24.04`, user `klim`; game at `/home/klim/games/hoi4` (record the version, last seen 1.19.3); private profile `/home/klim/.local/share/zin-acceptance-20261015/profile`; display `:96` on Xvfb with llvmpipe; window 1600×900, UI scale 1.0, autosave off, sound off. Harness: `.tmp/zin-live.sh` in the ZIN folder, run as `wsl -d Ubuntu-24.04 -u klim -- bash '<zin>/.tmp/zin-live.sh' <command>`.

**Lock rules:**

- `start` takes the shared lock `/tmp/hoi4_wsl.lock` with the token `zin_acceptance_20261015` and refuses if it exists or if any Linux game runs.
- `capture` and `stop` require ZIN's own token.
- Never remove another task's lock; never stop another task's game; never run `prepare` again while the profile exists.
- `stop` releases the lock only after the game has exited.

**Procedure for every run:**

1. G1–G3 green on the commit under test; working tree clean.
2. `sync`: copies only manifest files, verifies source and destination hashes, archives the previous logs into `evidence/logs-<ns>`.
3. `start`, then drive the menus with `xdotool` on display `:96` (hold each key or button about 0.4 s; never chain commands after `xdotool type`).
4. `capture <case>` at each checkpoint; names are `p<phase>_<case>` (lowercase, digits, `_`, `-`).
5. `status`; `stop`.
6. Read `logs/error.log` with `hoi4.error_log` (scope `mod`) through a tools workspace whose `gameUserRoot` is the Linux profile; compare with the baseline of inherited warnings recorded in the phase report.
7. On a crash, keep `profile/crashes/hoi4_<stamp>/` and record the stack signature.

**Cases:**

| Id | Case | Pass |
| --- | --- | --- |
| L1 | Start as each of Aenor, Volgan, Zol, Lerendor, the Magical Forest, the Worshipdom, Mirolon and a tier C country; unpause; run 60 days at speed 5 | Map reached; 60 days pass; no crash |
| L2 | Save on day 60, return to menu, load | Loads; date and meters unchanged |
| L3 | Start screen and day 1 checks as Aenor | Date "1 Thaw 1748"; bookmark "The Fourth Age"; no war in the diplomacy view; the Erdae bar shows "4A 1748" and the Gathering Dark at 8; no "Afrit" on any screen opened (Realm, Court, decisions, focus tree, politics) |
| L4 | Open every ZIN panel and tab for the case's country | Opens, closes, no crash |
| L5 | Observer run (`observe` from day 1) under `zin_rule_historical_path = HISTORICAL` to 1 Deepwinter 4A 1761 | The historical path's acceptance ([06_historical_path_and_ai.md](../03_gameplay/06_historical_path_and_ai.md)): checkpoints resolve; `zin_ending_lost_cause` set; no stall |
| L6 | Observer runs under `FREE`, three seeds, to 4A 1770 | An ending or `zin_ending_unfinished`; no stall |
| L7 | Three cold launches | No vanilla Second World War loading screen |
| L8 | Error log | No error entry whose source is a ZIN file beyond the baseline |

Long observer runs (L5, L6) use console speed and may take hours; they run only for phases 3, 5 and 8 and on release candidates.

**Evidence:** captures, the error log copy, `hoi4.stdout.log`, `renderer.txt` and the game version go into `evidence/` in the Linux runtime, and a summary with selected captures goes into the phase report. Captures are Linux acceptance evidence; they are published only with the owner's approval.

### 6. Regression tests for the Aenor start crash

The crash ([01_map/03_known_issues.md](../01_map/03_known_issues.md)): starting as Aenor segfaults with the stack signature `(+0x266a46c) (+0x13cf698) (+0x13cef6b)`. Until the cause is found, every remaining suspect gets an offline guard, and every build that touches the suspects runs the live test.

**Offline guards (G1, run for every country, failing on Aenor first):**

| Suspect | Guard |
| --- | --- |
| Country name, definite name, adjective | Keys `<TAG>`, `<TAG>_DEF`, `<TAG>_ADJ` and each ideology variant exist once, are non-empty, Windows-1252, no unbalanced `§`, `$` or `[`, no stray quotes |
| Ruler character | `<TAG>_zin_ruler` exists once; every portrait sprite it names resolves to a DDS of 156×210 (large) or 65×67 (small) with a valid header; the leader's ideology exists; no trait is missing |
| States and capital | The capital state is owned and controlled by the country, has a victory point in a province of that state, buildings within slots and valid per-province buildings, a supply node or capital supply hub as the engine requires, and no province shared with another state |
| History | Every idea, technology, template sub-unit, equipment and OOB file named exists; ruling party is a ZIN ideology; popularities sum to 100; set_politics date is the start date |
| Subjects and faction | Every puppet exists and has a capital; the faction leader is in its faction; no subject is its own overlord's overlord |

**Live tests (G4):**

| Id | Test | When |
| --- | --- | --- |
| R1 | Start as Aenor; run 60 days | Every build touching countries, characters, states, history, localisation of country names, interface or map |
| R2 | Start as Selen and as Kingson (Aenor subjects) | Same |
| R3 | Start as Aenor, open the Realm panel and the Golden Court panel on every tab | Every interface build |
| R4 | Start as Aenor, save, reload | Phase acceptance |
| R5 | Start as Aenor under each `zin_rule_golden_king` option | Phase 3 acceptance |
| R6 | Force the succession by console (`zin_golden_king_dead` route) and take each breakaway realm (tag switch) | Phase 3 acceptance |

**When the cause is found:** fix it in the generator; add a negative test that feeds the broken input to the generator and expects a build failure; record the cause in the known issues file; rerun R1–R4 and L1 for all great powers. A recurrence of the stack signature in any run fails the build.

### 7. Per-phase acceptance

Each row adds to the previous rows; earlier criteria must keep passing.

| Phase | Roadmap "done when" | Concrete checks |
| --- | --- | --- |
| 1 Map accuracy and stability | Map table rows "matches" or "accepted"; campaign starts as Aenor, Volgan, Zol, Lerendor and the Magical Forest; no new ZIN errors | G1 guards of section 6; `hoi4.map_inspect` five map checks; key-site triggers generated from one table; L1 for the five; R1–R3; L8; political render with region names in the report |
| 2 Base lore | Game opens on 1 Thaw 4A 1748; every great power has its lore ruler and court; nothing at start reveals Afrit, shows Eindil or starts a war | Calendar and start-state tests; secrecy and Eindil scans; character data complete for tier A; L3; portraits pass art review; history path start check (no war, no Eindil, no story flag) |
| 3 Base gameplay and mechanics | Each great power plays differently; the AI uses each mechanic; the historical path runs 4A 1748 to 4A 1760 without a player | Package checks and mechanic suites for every system green; decisions and events inspected; L1 for all eight start cases; L4 for every mechanic panel that exists; L5 once and L6 three seeds; R5, R6 |
| 4 Focus trees for the main countries | Each major tree passes the compiler and the focus inspector, renders cleanly, and its historical route is taken by the AI | Compiler green; `hoi4.focus_inspect` clean and `hoi4.focus_render` review image per tier A tree; L5 shows each tree's historical focuses taken in order (focus log from the save) |
| 5 Events and endings | Every ending is reachable in test runs; the historical path reaches Eindil's coronation | Event reachability renders; L5 reaches `zin_eindil_crowned`; one forced test per ending (console flags or rules) reaches its news event; Chronicle event shown |
| 6 Every other country | All 305 countries have an Erdae focus tree | Coverage check; every tier B and C tree inspected; L1 for one country of each shared tree (13 runs, may share one session via tag switching) |
| 7 Interface, art and polish | Themed top bar and panels, loading screens, focus and event art, 3D units | Interface acceptance ([01_interface.md](../07_interface/01_interface.md)); art pipeline acceptance; no placeholder art used; L7; 3D pilots pass the warfare spec's evidence list once Meshy is unblocked |
| 8 Depth and history | More events, characters and regional history | All earlier gates green; new content passes the same checks; L5 and L6 rerun |

### 8. The phase report

Each phase ends with `docs/validation/phase-<n>.md` (new): commit hash, game version, gate results, tool versions, unresolved findings with reasons, baseline and new error counts, renders (labelled offline) and captures (labelled Linux run), open questions for the owner. The spec statuses it implements move to "Done" only after the owner accepts the report.

## Implementation

### Files

| Path | Content |
| --- | --- |
| Builder `build.test.mjs` and test modules | G1 |
| `docs/design/validation/forbidden_claims.json` (new) | Phrases and patterns that would close open questions or break the secret |
| `docs/design/validation/baseline_errors.json` (new) | Inherited vanilla and engine warnings by category and text hash, with the date they were recorded |
| `tests/packages/<system>.json` | `hoi4.package_check` manifests |
| `tests/mechanics/<system>.json` | Mechanic and scenario suites |
| `tests/ui/<scenario>.json` | GUI scenarios |
| `tests/linux/cases.json` | Linux cases, the countries per case, the capture names |
| `docs/validation/phase-<n>.md` | Phase reports |
| `.tmp/zin-live.sh` | Private harness (ignored by Git) |

Test fixtures are synthetic and ZIN-owned. No vanilla file, other mod's file or game capture is a fixture.

### Variables, flags, events, game rules, defines

None. Live tests set story state only through the console in the isolated run; no test-only content ships in the mod.

## AI

The observer runs (L5, L6) are the AI's acceptance: each great power must use its mechanic (at least one mechanic decision or focus per year where the mechanic spec says the AI acts), and the historical path must resolve. The phase report lists which mechanic decisions the AI took.

## Acceptance

1. G1–G3 run in one command from the builder and stop on the first failure.
2. The secrecy, spelling, open-question and start-state checks each have a negative test: a planted bad string or flag makes the build fail.
3. The Aenor guards each have a negative test with a synthetic broken country.
4. One full G4 run (L1–L4, L7, L8) completes on the current build and its report exists.
5. No step of this spec launches, automates or captures the Windows game.

## Open questions

1. Is a 60-day run enough for phase 1 and 2, or does the owner want a full year?
2. Should long observer runs (L5, L6) be required for every release, or only at phase ends?
3. May the phase reports, with Linux captures, be committed to the public repository, or should captures stay in the private runtime?
4. Which inherited warnings may be accepted permanently in the baseline?
