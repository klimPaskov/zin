# Story framework: the Gathering Dark, the endings, the world tick and the historical path

**Date:** 25 October 2026. **Agent:** the story framework agent (subagent of the ZIN lead). **Branch:** `zin/integration-r3`.
**Design:** `docs/design/alternate_history.md` and its twin `alternate_history.json` (plan rows Module `historical_path.mjs`, Data `path_checkpoints.json`, Library `story_dates.mjs`, Module `world_tension.mjs`, Check `story_wiring.mjs`, Test `alternate_history.test.mjs`); `docs/specs/03_gameplay/05_world_tension_and_endings.md`; `docs/specs/03_gameplay/06_historical_path_and_ai.md`; the contract files of `docs/specs/04_mechanics/`.
**Canon:** K1 to K50 of `docs/specs/INTEGRATION_DECISIONS.md` (K4, K11 and K29: Kusven, never Zol in person; K28: the god-months; K34: the owner's answers to Q1 to Q3 of the design). No text here states an age, names Afrit before the reveal, or makes Zol appear.

Everything this pass writes that the canon does not state is **proposed**: the tier names and news texts, the source labels, the ending spirits' texts and values (from the spec), the checkpoint names, the role news texts, the way codes, the runner list, the judgement deferral rule's reading of "in reach", the predecessor table and the relative windows of the checkpoints.

## 1. What was built

| Path | What it is |
| --- | --- |
| `tools/content/lib/story_dates.mjs` | `paceDate(date, pace)` in the engine calendar (365 days, no 29 Sulethe), `addDays`, `dayBefore`, `compareDates`, `paceTest`, `afterDate`, `dateTrigger`. `lib/mp_kit.mjs` and `modules/focus_compiler.mjs` already switch to it when it exists; their Gregorian fallback differed by a day at the slow and fast paces after 4A 1752, and could produce 29 Sulethe. |
| `tools/content/modules/world_tension.mjs`, `data/world_tension.json` | The Gathering Dark (start 10, sources, one-time values, damping, rate rule), the engine sync, the War of the Last Crowns (`zin_world.20`), the endings (`zin_world_check_endings`, `zin_world_reach_ending`), the ending spirits, the dated triggers, the tier news (`zin_world.10` to `.12`) and the one world tick. |
| `tools/content/modules/historical_path.mjs`, `data/path_checkpoints.json` | CP01 to CP26 (generated from the design twin by `checkpointsFromDesign`; `node tools/content/modules/historical_path.mjs --write` regenerates the data), the ordered rules of each checkpoint, the tick, the watchdog, the measure, the start check `zin_path.1`, the roles R01 to R17 and A Duty Passes. |
| `tools/content/checks/story_wiring.mjs`, `data/story_wiring.json` | The wiring check over the finished staged tree, with its owners, its allowance list and the enforcement switch. |
| `tools/content/alternate_history.test.mjs` | 19 tests (section 3). |
| `tools/content/data/game_rules.json` | `zin_rule_gathering_dark` (NORMAL, SLOW, FAST); the source note says who reads it. |
| `tools/content/data/pending_names.json` | The world group keeps only `zin_world.45`, which belongs to the magic module's range (30 to 69); the three effects, seven spirits and two dates the world module now defines are gone. |
| `tools/content/build.mjs` | The crown events run with `scheduler: false` (no every-country `on_monthly`), the two story modules run after the crown events, the wiring check runs after the final pending pass and stages `docs/design/validation/story_wiring_report.json`, and the summary line carries `story`. |

### The world tick (one scope, never per country)

`zin_world.1` is a hidden event on one runner country that schedules itself 30 days on. `zin_world_schedule_tick` picks the runner anew each month: the first existing country of `data/world_tension.json` `runners` (Aenor, Lerendor, Coldor and on), else the realm with the most states. The runner carries the country flag `zin_world_runner`; `on_annex` hands the chain to the annexer through `zin_world.2` when the runner is annexed. The timed global flag `zin_world_tick_month` (25 days) stops a second chain from running twice, and a duplicate chain dies because only the guarded branch reschedules. Order of the month: (1) world casualties into `zin_world_dead_k`; (2) the one-time values (`zin_gd_done_<flag>`); (3) the monthly sources into `zin_gd_src_<key>` (one `every_country` and one `every_state` pass from the runner); (4) the engine sync (named threat `zin_world_threat_gathering_dark` on the country behind the largest source, in up to three steps of 10, 5 or 2; half an engine rise above 0.02 into the meter as Wars of the Living unless the meter fell this month); (5) the War of the Last Crowns; (6) tier news on first entry (inside `zin_world_add_gathering_dark`); (7) `zin_world_check_endings`; (8) `zin_path_tick`; (9) `zin_story_tick`; (10) `zin_ui_refresh` and `zin_chr_count_unread` for human players, written only once a module stages them (none does yet). The crown events' every-country `on_monthly` scheduler (`common/on_actions/zin_crown_story.txt`) is no longer written: the world tick calls `zin_story_tick`.

### The measure (section 6)

`zin_path_resolve` (arguments `cp`, `state`, `way`, `m`) writes `zin_path_cpNN`, `_way`, `_m` and the flag `zin_path_cpNN_done` once, then `zin_path_measure` adds weight x magnitude to `zin_path_points`, the weight to `zin_path_resolved_weight`, and sets `zin_path_divergence` (100 x points / max(resolved weight, 30), clamped), `zin_path_departure` (100 x points / 93) and `zin_path_band` (0, 1, 2, 3 from 10, 30, 60). Weights and magnitudes are `constant:zin_path_weight.cpNN` and `constant:zin_path_magnitude.<class>` in `common/script_constants/zin_path.txt`. A way code is beat x 100 + divergence (`B07.D3` = 703); 0 when historical or when no divergence of the beats applies.

### The checkpoints

Each checkpoint takes the earliest target and the last latest date of its beats. A checkpoint waits only for its predecessors to be resolved (any state). Relative windows follow the 06 spec: CP06 also waits 90 days after CP05, CP12 180 days after CP11, CP13 and CP14 365 days after CP11 (paced, read from the days of `zin_path_cpNN_done`). The test proves that no predecessor without a window can be resolved after its successor's watchdog. CP04 does not wait for CP02 (a late waking would otherwise stall it). The full rule table, with the design divergence each rule records, is `rules()` in `modules/historical_path.mjs`. After an ending, `zin_path_close` resolves every pending checkpoint skipped without counting and the tick stops.

### The roles (section 8)

`zin_path_role_<key>` keeps a holder (global event target `zin_role_<key>`, country flag `zin_role_holder_<key>`) while it qualifies and otherwise walks the successor order; nobody qualifying sets `zin_role_<key>_vacant`. Where an owner already picks the holder (`global.zin_eindil_host`, `_gala_host`, `_stage8_host`, `_ice_host`, `_wreck_host`, `zin_aenor_find_parim_realm`), the role follows the owner's pick first. R13 is a count (`global.zin_role_eastern_candidates`). R05 is two roles (`grey_ford_a`, `grey_ford_b`); the second crown is the first crown's West Lands neighbour with the lowest opinion band (below -25, below 0, any). A pass of R01, R03 (after `zin_eindil_host_raised`), R06 (after `zin_west_council`) or R07 is told to the human players (`zin_path.11`, `.13`, `.16`, `.17`); the Deliverer's seat (R02) and the other roles pass in silence. The owners still use their own pickers; switching them to the registry targets is theirs (SL-23 section 5).

## 2. The soft-locks, as they stand

| Soft-lock | What the code does now |
| --- | --- |
| SL-01 The War of the Last Crowns never begins | `zin_world_check_last_crowns` sets `zin_war_of_last_crowns` and sends the news `zin_world.20`: HISTORICAL on `zin_world_date_last_crowns` (1 Maelwen 4A 1755, paced); PLAUSIBLE on the first of the meter at 65 after 1 Lumae 4A 1754, a dark power at war with a non-dark major (`zin_world_dark_war`), or 1 Lumae 4A 1756; FREE on the first two; outside HISTORICAL the first front flag (Lerendor's withdrawal, the Crossing, the eastern invasion, Mirolon's fall, Volgan's march, Zol's rising) sets it piecemeal with `zin_war_piecemeal` (B18 D3). MCP state flow: the flag has 4 writes, all through `zin_world_start_last_crowns`, reached from `zin_world_tick`, and 280 reads. |
| SL-02 No checkpoint ever resolves | `zin_path_tick` resolves all 26 checkpoints by their rules or their latest date, with the watchdog (`zin_path_stalled`, a `ZIN path: checkpoint NN stalled` log line) 30 days after; the start check `zin_path.1` runs on day 1. `zin_ai_era_stirring` (forces) now becomes true once CP05 resolves. |
| SL-03 No ending can be reached | `zin_world_reach_ending` and `zin_world_check_endings` exist; the canon endings are checked every month in order; the proposed outcomes once on the judgement; the Age Unfinished on 1 Glernaen 4A 1770 (paced). One ending per game (`zin_ending_reached`); the Ashen Throne reveals Afrit first; the ending's major news goes out once and the epilogue (`zin_ending_start_epilogue`) follows. MCP state flow: `zin_ending_reached` is written only in `zin_world_reach_ending`, reached from the world tick and the coronation (`zin_aenor_crown_eindil`); the Worshipdom's Ashen Throne focus also calls `zin_world_reach_ending` (source; the MCP artifact kept only part of the flow). |
| SL-23 Story roles fixed to tags | The registry exists and runs monthly; CP03 and CP12 skip on a vacant role. Owners have not switched their own pickers to `event_target:zin_role_<key>`; that switch is theirs. |
| SL-25 (world side) A conquered Golden King | The Golden Court Endures needs an Aenor realm controlling Parim and either the King alive or `zin_aenor_regency_endures`, and never holds after `zin_golden_king_exiled`; CP05 resolves skipped (B07 D6) when the King is exiled or no Aenor realm is left. With the King exiled the other outcomes and the Age Unfinished stay open. The Aenor side (the exile itself) is the Afrit, Aenor and Eindil pass. |
| SL-26 The crown withheld for ever | The judgement on 1 Glernaen 4A 1762 (paced) ends the age when `zin_path_departure` is 15 or more or no canon ending is in reach; while the heir is at stage 9 to 12 and the palace is pending it waits once, to 1 Glernaen 4A 1764 (`zin_world_judgement_deferred`, then `zin_world_judged`); the Age Unfinished follows in 1770 whatever happens. Whether The Crown Withheld (`zin_eindil.132`) stops retrying after an ending is the journey's code (not checked here). |
| SL-19 (world side) A Western Crown in Parim | Outcome 5 reads the West's trigger `zin_west_holds_parim = yes`, with the fallback on Aenor's capital state while `zin_is_site_parim` is a stand-in. The crown events' endings localisation still tests it as a flag (theirs). |
| SL-28 Sixty-one fired events undefined | Check in place: the final build reports 22 fired ids with no real definition (the pending stand-ins do not count as definitions), per owner (section 4). |
| SL-29 No build check for story wiring | `checks/story_wiring.mjs` runs on the finished tree in every build. |
| SL-30 Per-power rules bypass their wrappers | The wrappers are the generated `zin_rules_ai_branch_<power>_<option>` of `modules/rules.mjs` (every per-power and owner rule has them); the check reports every direct test outside `zin_rules.txt`: four remain (section 4). |

The world tick also fixes what the spec asks of the world side elsewhere: the world's one-time values (the King's death +8, the crowning +4, the denunciation +2, the war +6, the eastern invasion +2, Kusven's withdrawal -12, each death of Varner, Lorien or Golbran +1, Afrit's death -15, the heir lost +10, the coronation -15).

## 3. Tests and the build

- `tools/content/alternate_history.test.mjs`, 19 tests, all pass: the twin's schema and counts (45 beats, 151 divergences, 37 soft-locks by severity, R01 to R17, endings 1 to 8); CP01 to CP26 each once with their beats; weights sum 93; every repository path a soft-lock names exists; `path_checkpoints.json` equals the generated table; every beat has a latest date (start and endings excepted) and every divergence a successor; `paceDate` (start fixed, no leap day, the slow pace takes 4A 1756 to 4A 1760); every checkpoint's rules record divergences of its own beats; the rule against deadlock; the tick has 26 blocks and 25 watchdogs; the measure's constants; the roles and their news; the world tick's order and its single scope; `events/zin_world.txt` holds only ids 1 to 29 and no raw date outside `zin_world_dates.txt`; the war's three rules; the endings; the meter; every generated script parses with balanced braces and no `<=`/`>=`, every yml has its BOM; the wiring check's six findings and its enforcement switch.
- Full build (`node tools/content/build.mjs`, private TEMP, `ZIN_ART` snapshot): see section 6 for the run of this pass.
- Two soft-lock paths were stale (SL-24, SL-36 named `tools/content/data/countries.json`); they now name `tools/content/data/world/roster.json`, the country table.

## 4. What the wiring check reports for the other owners

From the final build of this pass (`docs/design/validation/story_wiring_report.json` in the staged tree). Enforced owners (world systems, historical path): 0 findings.

| Owner | Findings |
| --- | --- |
| Afrit, Aenor, Eindil | event `zin_world.45` (fired from the journey, the magic module's range); flags read never set `zin_aenor_council_recent`, `zin_afrit_sevrin_guest`, `zin_gala_word_from_the_north`, `zin_worshipdom_second_embassy`; `zin_rule_eindil_journey` tested directly (DEFAULT, HISTORICAL); allowed and still unset: `zin_aenor_regency_endures` |
| Kusven, Volgan, Leren and the West | flags read never set `zin_dominion_barrows_wait`, `zin_elven_refusal`, `zin_refusal_lifted`, `zin_zol_cost_of_form`, `zin_zol_wake_cd`; `zin_rule_west_route` tested directly (DEFAULT, historical) |
| error-log causes (East) | events `zin_east.41` to `.46`, `.50` to `.52`, `.60` (pending stand-ins only); `zin_east.51` is also fired from the Noris and Stabilo files |
| crown and ending events | `zin_west_holds_parim` is a scripted trigger now (SL-19) and the endings' scripted localisation still tests it as a global flag |
| elves | events `zin_elves.9`, `.51`, `.70`, `.71`; flags `zin_magical_forest_carry_war`, `zin_refusal_lifted` |
| dark | events `zin_dark.80`, `.82`, `zin_diplo.23`; flag `zin_people_minor_goblins`; `zin_dark_took_southern_gifts` is a trigger tested as a flag |
| Glo | `zin_glo_heir_in_hall` is a trigger tested as a flag |
| focus trees, magical forest | event `zin_diplo.31`; flags `zin_refusal_lifted`, `zin_tradition_middle_kingdom` |
| peoples | `zin_people_minor_<people>` read for ten peoples that no country has as a minor people (a family read through a pattern; probably harmless) |
| diplomacy, factions, sun | `zin_refusal_lifted` read and never set |

**The switch.** `tools/content/data/story_wiring.json`: `enforce` lists the owners whose findings fail the build (today world systems and historical path); set `enforceAll` to `true` when the other slices have landed. Remove an allowance row when the check reports it stale (nine were removed in this pass when their owners landed).

## 5. MCP evidence

The server ran from a scripts-only copy of the staged tree (`common`, `events`, `localisation`, `history`, the descriptor) in a private stage root, with the session's own MCP configuration.

- `hoi4.script_validate` (installed documentation, checks: syntax, command kind, declared scope, event popups) on every generated script file: `zin_world_tension.txt` effects 596 commands, `zin_path.txt` effects 2,607, `zin_path.txt` triggers 1,414, `zin_world_tension.txt` triggers 66, `zin_world_dates.txt` 112, `on_actions/zin_world.txt` 19, `events/zin_world.txt` 6 (valid), `events/zin_path.txt` 35 (valid): 0 unresolved commands and 0 findings once the other modules' helpers were present. `valid` stays `null` for the files with variable arguments because argument blocks are not checked by the tool (221, 1,032, 427, 13, 42 and 8 blocks); parameter semantics remain unverified by it. An earlier run found the tier, war and ending news fired once per country although they are major news events (`SCRIPT_EVENT_POPUP_REPEATED`); they are now fired once (`random_country`), so every player gets one window.
- `hoi4.event_inspect` state flow on `zin_war_of_last_crowns` (4 writes, 280 reads) and `zin_ending_reached` (8 writes, 54 reads), with the helper chains in section 2. The artifacts were cut at 1 MB by the resource reader, so the counts cover the retained part. A focused trace of `zin_world.1` defers the workspace helper projections (`EVENT_FOCUSED_ANALYSIS_DEFERRED`) and reports the helpers as unresolved; the trace therefore proves only the event, its option and the call of `zin_world_tick`. The first state-flow call on the war flag returned `INTERNAL_ERROR`; the retry succeeded.
- `hoi4.probability_inspect`: not run. The framework has no weighted surface: no MTTH, no `ai_chance` other than single options, no `random_list`, no decision. The weighted choices that read the measure (`zin_story_rules_plausible_diverged`, the crown and world events' 75/25 and 60/40) belong to their owners.

## 6. Build and test runs of this pass

- Code commit `794e1fd9` (on `a9f08d94`); this handoff, the soft-lock statuses and the contract rows follow in a second commit.
- Build with the story modules (private TEMP, `ZIN_ART` snapshot): passed, 6,293 staged files; `story` counts: world 20 triggers, 12 effects, 7 ideas, 6 events, 40 constants; path 26 checkpoints, 94 rules, 17 roles, 158 triggers, 22 effects, 5 events; wiring 0 failures for the enforced owners.
- Rebuild after the last edit (outcome 5 reads `zin_west_holds_parim`): the wiring check passed with 0 failures; the build then stopped at the asset manifest step on 520 new asset errors (`PROV_NO_MANIFEST_LINE` for portraits under `gfx/leaders/zin/lore/`), from the portrait work running at the same time; no asset finding names a story file.
- `cd tools && npm test` (during the concurrent work): 1,615 tests, 1,610 pass, 4 fail, 1 skipped. The failures are not this pass's: `build.test.mjs` "The build is deterministic" (its child build stopped on the same portrait asset errors), `cultures.test.mjs` (the seeded `culture_coverage.json` versus the portrait pools), `events_crown.test.mjs` "Kinds" (`zin_west_holds_parim` became a trigger in the West slice while the crown register names it a flag) and `migrations/roster_migration.test.mjs` (one file left to migrate). After the last edits, `alternate_history`, `rules`, `pending_names` and `events_crown` tests: 82 of 82 pass.
- The private TEMP was deleted after the runs.

## 7. What only a Linux run can confirm

- That the self-scheduling tick survives a long game: a runner annexed by peace conference fires `on_annex` with the runner as FROM; events queued on an annexed country are dropped (the chain then lives on through `zin_world.2`).
- That `threat` as a temporary-variable source and `add_named_threat` move engine tension as the spec expects, and the calibration table (meter 18 before the King's death, 30 after the crowning, 82 in late 1755, 10 to 15 in 1767): the sources are untuned until an observer run.
- That `casualties_k`, `num_of_controlled_states` and `has_opinion = { target = event_target:... }` read as written in every scope used.
- The acceptance seeds A1 to A12 of the design (section 12), in particular A1 (every checkpoint historical, the Lost Cause by 4A 1761, divergence below 10), A2 and A3 (every checkpoint by latest + 30 days, no `zin_path_stalled`), A11 (RESTRAINED: CP16, CP20 and CP23 skipped) and A12 (the slow and fast paces).
- That one major news event fired from one country reaches every player once (vanilla behaviour, not observed here).

## 8. Simplifications, omissions and blockers

- Not written (05 and 06 specs, outside this pass's plan rows): the AI strategy plans `zin_<tree>_historical.txt` and `_plausible.txt`, `common/ai_strategy/zin_path.txt`, the paced `common/mtth/zin_mtth.txt`, the tier 1 `prepare_for_war -50` rule and the tier 3 fort weights, the relabelled world tension widget (`WORLD_TENSION_NAME` and its tooltip) and the weekly tick for the magic module.
- Owner modules other than `mp_kit.mjs` and `focus_compiler.mjs` keep their own pace helpers (the plan allows it); they use the 365-day calendar already except `lib/mech_journey_lib.mjs`, whose Gregorian arithmetic can differ by a day at the slow and fast paces.
- `zin_world_peace_holds` is written by the world module as the world spec's file table says, but the contract register names the diplomacy spec as its owner; a pending request asks the integrator to settle it.
- Outcome 5 reads the West's `zin_west_holds_parim` or, while the key-sites table is pending (its `zin_is_site_parim` is an inert stand-in), Aenor's capital state; every Parim test of this pass carries the same fallback. Remove the fallback when `modules/sites.mjs` lands.
- CP10 has no rule for "the Aenor realm heeds him" (no owner sets a flag for it); it resolves at its latest date with B16 D1.
- The role news covers four public roles; the others change silently (a deliberate choice to keep the secret and avoid noise; owner question 4).
- Step 10 of the tick is not written: neither `zin_ui_refresh` nor `zin_chr_count_unread` exists.

## 9. Owner questions

1. The four tier names (Seeming Peace, Unease, The Gathering Dark, The Last Crowns) and the three tier news texts: right for players? (Spec open question 1, proposed and in use.)
2. The judgement deferral (E-01): "a canon ending is in reach" is read as the heir at stage 9 to 12, not lost, not crowned, with Afrit alive or the palace pending. Is that the reading you want, and is one deferral of two years enough?
3. The rule `zin_rule_gathering_dark` options: As the Age Unfolds, A Slow Dread (half), A Swift Dread (half as much again). Names and values right?
4. A Duty Passes tells the players when the crown of Aenor, the Host, the leader of the Western Crossing or the Leren crown changes hands. Should other roles be told (the keeper of Parim, the hall of Horos), or none?
5. Under PLAUSIBLE and FREE the war may begin piecemeal from its first front. Should this also apply under HISTORICAL when a player's own front comes first (today the date alone decides there)?
