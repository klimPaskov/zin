# Realm life and the start variety

**Date:** 25 October 2026. **Branch:** `zin/integration-r3`. **Design:** [alternate_history.md](../../design/alternate_history.md) sections 7 and 8 and the twin `alternate_history.json` (systems G1 to G10, variety V1 to V13, the plan rows of `realm_life.mjs`, `start_variety.mjs` and the rule). **Spec:** [realm_life.md](../../specs/04_mechanics/realm_life.md). **Owner decisions:** K34 (the monthly batches, at most two feuds, the great powers at peace). **Disposition:** implemented with evidence; the items under "Simplifications, omissions and blockers" stay open.

Everything the canon does not state is **proposed**: every rate beyond the design's five, the chances, the lists of raiders, feud groups and shelters, the temper traits and every event, decision and tooltip text. The voice follows [09_voice_and_style.md](../../specs/02_lore/09_voice_and_style.md); no text states an age, names Afrit, the Council or the plot, names the heir, or uses a sealed name (the events pass the events_mech text checks).

## 1. What each system does

| System | What the code does |
| --- | --- |
| Pulse (K34) | `zin_story_tick` (step 9 of the world tick) calls `zin_story_tick_realm` on the world runner: batch 0 at once, `zin_realm.1` for batches 1 to 3 at 7, 14 and 21 days. Each batch runs `zin_realm_pulse` on the countries whose `zin_realm_slot` matches (roster order mod 4; 39 countries each; a dynamic tag runs in batch 0). No every-country on_monthly, on_weekly or on_daily. |
| G1 Rulers' years | Start vigour from the ruler's year of birth (else a seeded 50 to 100), the people rate, a monthly fall (more at war and in defeat), death at the floor or by `mtth:zin_realm_frail_death` below 20; new rulers get a fresh vigour. Exempt: the story rulers, the pending story realms, and on the historical path tier A and Selen, Girdon and Yeldenne. |
| G2 Heirs | 36 named heirs recruited in the histories after the courts and promoted at the ruler's death; a child heir through `zin_realm_regency` until grown (two to five years); Name an Heir for the others. |
| G3 Crises | No Heir of the Body, The Claimants (election, the captain-general, a contested crown, the house we married into), The Crisis Settled; tier B elects only on the historical path. |
| G4 Usurpation | A captain marked `zin_char_ambitious` when calm is below a quarter; buy, arrest (seven in ten fail) or yield; off on the historical path. |
| G5 Subjects and risings | The Subject Stirs (break free, a looser bond, keep faith); A Rising in Occupied Lands and its end. |
| G6 Peace | AI terms a year into a war no story owner ends (peace, the claimed land, silver); War Without Purpose; peace with the courts of the East after `zin_afrit_dead`; Offer Terms for players. |
| G7 Marriages | Seek a Match, the answer, the guarantee, The Kinship Called; the house is a crisis candidate. |
| G8 Raids | Nineteen raiders; Raiders on the March (ride out for a cause, pay, bar the gates), The Raid Answered; Punish the Raiders. |
| G9 Exile | A court in exile for fallen realms (free course), restoration by release; the Golden King's court from `zin_golden_king_exiled` (Lerendor, then Selen, then the old Concord dominions). |
| G10 Roles | Superseded: the historical path's role news (`zin_path.11` to `.17`) already tell the change; `zin_realm.80` is not written. |
| Start variety | `zin_rule_start_variety`; draws once in on_startup, applied on day 3 by `zin_variety.1`; LIGHT V1 to V5, V7, V10 to V13; FULL also V6 (two feuds at most, AI minor realms, ended in ninety days by `zin_variety.2`), V8, V9. Single-realm changes only between AI realms. |

Shared-file edits (surgical): `tools/content/build.mjs` (the two modules after the courts, the heirs into the history recruits, the story block `realm`), `tools/content/data/game_rules.json` (the rule), `tools/content/lib/mech_aenor_script.mjs` (`zin_aenor_compute_camps` adds the V3 shifts and Eronel's standing), `tools/content/data/events_crown_reign1.json` (V1's tempers weight `zin_reign.10`, `.14`, `.16`), `tools/package.json` (the test), the contract register (four patterns, six names), and the statuses in the design twin and its Markdown (systems, variety, rule, plan rows, SL-25, SL-31). New: `docs/zin_dynamic_effects.md`, which `CLAUDE.md` names and which did not exist.

## 2. Tests and the build

- `tools/content/realm_life.test.mjs`, 15 tests, all pass: parsing, operators, braces and BOM; the event ids of the plan row and every fired `zin_realm` id defined; no two linked events share a picture; the four weekly batches and no per-country tick, and no ROOT in the pulse's effects; the G1 rates, story rulers and the historical exemption; the heirs (recruited in history, never in play; Eronel and Maeric left to their owners; the regency); G3's exemptions and budget; G4 to G9's checks and exemptions; SL-25 and Q-65; the decisions' costs, AI and tooltips; the story wiring check over these files; the rule, its branches and wrappers, the draws once and the design's ranges (each centred on the owner's start value where the design gives one); the invariants (AI only, two feuds, no heir, war, league or reveal); the owners' readers (camps, tempers); the design twin's statuses.
- `node tools/content/build.mjs` (private TEMP, the `ZIN_ART` snapshot): every step passes, including the C3 reference pass, the story wiring check (enforced for all owners: 0 failures), the text scan, the UI and engine-form checks, and stops at the asset gate on 165 errors that are all the portrait work's (157 `PROV_UNREVIEWED`, 6 `PROV_REF_FOREIGN`, 2 `PROV_NO_GENERATION`, all under `art/source/portraits/`; the snapshot's provenance file is the same as the job file named in the brief). One error was mine (`court_feast` over its cap of eight events); two events now use already accepted pictures.
- `cd tools && npm test` against a staged tree written by a scratch copy of the build that skips only the asset gate (deleted afterwards): 1,615 tests, 1,610 pass, 4 fail, 1 skipped. None is this pass's: "The build is deterministic" (its child build stops at the portrait asset errors), "Every country has a generated flag; every staged art source traces to a recorded generation" (an untracked portrait source), "Startup applies a defined people spirit to every country" (a tradition flag another slice added to the people startup line) and the roster migration dry run (`tools/content/data/world/portrait_pools.json`). My own data tripped the migration once (a temper named "Bold" is an old country name); it is "Bold-Hearted" now. In that run the script line joined `realm_life.test.mjs` and `tags.test.mjs` without a space; after the fix the two files pass on their own (21 of 21 tests).
- The private TEMP and the staged tree were deleted after each run.

## 3. MCP evidence

- `hoi4_script_validate` (installed documentation, checks syntax, command kind and declared scope; argument blocks are not checked by the tool): a country-scope trigger set from `zin_realm_life.txt` (64 commands: every native command supported; 16 unresolved, all ZIN helpers, `var:`/`event_target:` scope entries and 6 unchecked argument blocks); a country-scope effect set covering the note, ageing, succession, regency, crisis, civil war, foreign prince, captain, arrest, bond, rising, terms, white peace, match, guarantee, kin war, raid, cause, exile, claims and the release `meta_effect` (82 commands, with the event targets and variables bound to their scopes: no unsupported command; 46 unresolved, all argument blocks); the start variety (44 commands: the draws, the clock, the tempers, the footholds, the feud's states, `start_border_war`, `cancel_border_war`, `transfer_state_to`, the courtship, guarantee and pact: no unsupported command; 13 unresolved, 12 argument blocks and one ZIN helper). `valid` stays `null` because argument blocks are not checked; parameter semantics remain unverified by the tool. The path mode refuses the staged tree (`SOURCE_FILE_NOT_INDEXED`), so the bodies were checked as snippets.
- `hoi4_probability_inspect` on the decisions' `ai_will_do`: refused, `PROBABILITY_GAME_VERSION_UNSUPPORTED` (game 1.19.3), as the brief expected; not worked around. The four MTTH entries (`zin_realm_frail_death`, `zin_realm_ambition_chance`, `zin_realm_raid_chance`, `zin_realm_match_will`) and the event and decision weights are therefore audited by reading only (`docs/specs/04_mechanics/realm_life.md` lists every chance).
- `hoi4_event_inspect` and `hoi4_event_render` were not run: the server indexes only the applied repository files, which do not contain these events until the staged tree is applied.

## 4. What only a Linux run can confirm

- The batch cost: 39 countries a week, each pulse a dozen checks and one `random_character` over the court; and that `zin_realm.1` queued on the runner fires (a runner annexed mid-month loses that month's later batches).
- Heirs at start: the 36 recruited heirs wait behind their rulers (the first recruited leader of an ideology rules), appear as candidates, and `promote_character` makes them rule after `kill_country_leader`; a realm without a named heir gets an engine-named successor after `kill_country_leader` (the wiki says the next in line takes over; with nobody recruited, the engine must generate one).
- `is_country_leader` in `random_character` picks the sitting ruler only, and `add_country_leader_role` with `promote_leader` crowns a recruited captain-general.
- `global.year` reads the engine year in scripts (the child heir's age), and `constant:` values are accepted in `clamp_temp_variable`, `add_to_temp_variable` and `set_variable`.
- The day-3 application lands after every owner's start values (Aenor's clock, the Council's plot, Volgan and Lerendor on day 1, the waking on day 2, the West and the Gathering Dark from later on_startup files).
- `set_variable = { global.x = THIS }` in a state scope stores the state for `start_border_war = { attacker = { state = global.x } }` (the Crossing uses the same form with its sites), and two bordering AI holds are found at the start.
- `release` through `meta_effect` with `[zin_realm_fallen.GetTag]`, and `TAG = { ... }` effects on an annexed Aenor (the Golden King's court is housed through `AEN = { ... }` scoping; if the engine skips scopes of a dead tag, the court is not housed after an annexation and only a capitulation houses it).
- That NOT is a NOR in every generated block (the wiki says so; the two NAND conditions are written as `NOT = { AND = { ... } }`).
- The acceptance seed A3 of the design (FREE, start variety FULL): at least one succession, one marriage or crisis.

## 5. Simplifications, omissions and blockers

- **Tier C heirs:** no `generate_character` template (the brief and the error profile advise against runtime recruits; a template needs a history file the country package owns). Realms without a named heir take the engine's successor. Named regents are not made either: the regency is the idea alone.
- **Native raids:** the raids are events, not `common/raids` (the native raid system needs its own interface and DLC; the hoi4-native-raids workflow would be a separate pass).
- **G10:** `zin_realm.80` is not written (superseded by `zin_path.11` to `.17`).
- **The surviving Golden King** (SL-31): he stays a story ruler, so realm life never ends him; the Golden Court Endures depends on him living to its judgement.
- **G6 "a war goal not moving":** read as twelve months of war (no trigger reads war-goal progress); the pointless war is read as no border between the two.
- **G3 tag budget:** counted by realm life itself (`global.zin_realm_contested_crowns` below twelve), not by the engine's count of dynamic tags.
- **V4 tempers have no icons:** ZIN's country leader traits carry none; `GFX_trait_zin_temper_<key>` is not registered.
- **V1 tempers** weight the reign events only where the crown events' free weights apply (the free course); under PLAUSIBLE the crown framework forces its historical options.
- **The Golden King's restoration** sets `zin_golden_king_restored`, which no owner reads yet; `zin_golden_king_exiled` stays set, so the Golden Court Endures stays closed after a return (owner question 4).
- **Localisation** is English only, as every mechanic module writes it.
- **Probability audit** blocked by the server's game-version gate (section 3).

## 6. Owner questions

1. Rulers' years: at the design's rate (men 1 a month from 100) a man's reign lasts at most about eight years. Is that the pace you want, or should the rate be per season or per year? Proposed: as designed, tuned after the Linux runs.
2. Should a surviving Golden King (he exposed the plot) die of age in the end, which would close the Golden Court Endures before its judgement? Proposed: no.
3. Tier C successors: are engine-named successors enough for realms without a named heir, or should every realm that inherits get a pre-built heir in the courts data? Proposed: engine-named for now.
4. When the Golden King's court returns, may the Golden Court Endures hold again (the world module would read `zin_golden_king_restored`)? Proposed: yes.
5. The raiders: are the nineteen realms right (the holds of the Dark Lands outside Goldoroth, Halenor, Santon and Benan, Halia, and the Cold Lands clans of Horidor, Glimkit, Omar and Orewele)? Proposed: yes.
6. The Golden King's shelters: Lerendor first (the Treaty of the Narrow Strait), then Selen, then the old dominions. Right order? Proposed: yes.
7. The eight tempers (Bold-Hearted, Cautious, Pious, Grasping, Scholarly, Vengeful, Generous, Weary) and their effects: right for the rulers of Aoaz? Proposed: yes.
8. Should the drawn changes that land on one realm (tempers, feuds, lands, bonds) also reach a player's realm under FULL? Proposed: no, as every ZIN rule spares the player's realm.

## 7. Skills

Used: `hoi4-events` (structure, pictures, AI chances, text), `hoi4-decisions-missions` (category, costs, targeted decisions, AI), `hoi4-mtth` (the four `common/mtth/zin_realm.txt` entries read with `mtth:`), `hoi4-characters-leaders` (recruitment in history, `promote_character`, `kill_country_leader`, `add_country_leader_role`, character flags). No skill was created or updated; the reusable lesson (NOT is a NOR in HOI4, so a NAND needs `NOT = { AND = { } }`) is general and belongs in a skill update by the skill maintainer.
