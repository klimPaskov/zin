# Major focus trees, batch A: Aenor, Coldor, Gala, Goldoroth

Stage 2 integration note. Four tier A trees written as data for the focus compiler (`tools/content/modules/focus_compiler.mjs`). No module file: the compiler writes every game file. Specs: `docs/specs/05_focus_trees/major/{aenor,coldor,gala,goldoroth}.md`.

## Files

| File | What |
| --- | --- |
| `docs/design/focus/aenor.json`, `coldor.json`, `gala.json`, `goldoroth.json` | The tree data (source of truth) |
| `tools/content/data/focus_registry_major_a.json` | Outside names the trees use (see "Registry"); read by the test, **not** by the compiler |
| `tools/content/focus_major_a.test.mjs` | 22 tests, several hundred assertions; appended to `tools/package.json` `test` |

Nothing else was edited. `build.mjs`, `focus_registry.json`, `focus_arg_codes.json` and the compiler are untouched.

## Counts

| Tree | Focuses | Spirits | Events | Tree-declared effects / triggers | Opinion modifiers | `raw` blocks | Text keys |
| --- | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| `aenor` (namespace `zin_aenor`, ids 500-519) | 140 | 53 | 20 | 5 / 0 | 6 | 5 | 471 |
| `coldor` | 102 | 26 | 3 | 1 / 2 | 1 | 4 | 270 |
| `gala` | 82 | 15 | 13 | 6 / 6 | 0 | 9 | 239 |
| `goldoroth` | 110 | 41 | 24 | 4 / 7 | 3 | 9 | 396 |
| **All** | **434** | **135** | **60** | | | **27** | **1,376** |

Every focus, position, day count, prerequisite and exclusive pair equals its spec table (the test reads the spec tables and compares). All compiler checks pass with the registry rows below: icons and event pictures from the catalog, modifiers from the game documentation, secret scan, retired names, allow_branch rule, call codes, gated pictures provable (no gate warning). The text passes the banned-word rules (errors and reviews, glossary forbid words included).

## Build wiring

No `build.mjs` change. Two data facts:

1. **Argument codes (done).** `tools/content/data/focus_arg_codes.json`, owner `dark_lands`, gained the prefix `zin_goldoroth_` (one token): `zin_goldoroth_add_favour` and `zin_goldoroth_add_sway` take the Dark Lands keywords `bloc` 1-4 and `target` -1/-2, and without the prefix every Goldoroth favour and sway call fails with `call_keyword_nocode`. That edit and the appended `package.json` test entry are the only changes outside my own files; the stand-alone test removes the prefix again to prove it is needed.
2. **Registry (not needed in the full build today).** With the present mechanic modules staged before the compiler, `node tools/content/build.mjs` resolves all outside names of the four trees (checked: the only remaining focus-compiler problem of the full build is `gunwaith`'s F3 collision, another slice). `focus_registry_major_a.json` is the stand-alone list the test merges into the registry; the compiler does not read it. Fold it into `focus_registry.json` only if a module is dropped from the build and its names go unresolved. `zin_horos_dead` must be in `branch.refreshed_flags` of the shared registry or staged by a module (the full build passes, so it is).

## Registry rows (outside names the trees use)

58 scripted effects, 27 scripted triggers (including the key-site triggers `zin_is_site_great_lake_ports`, `zin_is_site_great_wall`, `zin_is_site_isengard_march`, `zin_is_site_goldoroth_march`, `zin_is_site_dark_strait_shore`, and `zin_shared_has_coast`), 7 events (`zin_cold.30/.33/.51/.52/.61/.71`, `zin_diplo.31`), 4 ideas (`zin_aenor_interregnum`, `zin_aenor_kings_tasters`, `zin_aenor_lost_cause_court`, `zin_sun_king_fallen`), 3 opinion modifiers (`zin_dark_gifts`, `zin_dark_refused_nafeher`, `zin_dark_bargain_struck`), 5 country flags, 23 global flags, 6 characters. The file lists them all; each was checked against the mechanic specs and the contract additions (all exist there; the two tension-band triggers by their `zin_dark_tension_band_<band>` pattern).

## What the mechanics slices must write (names are the contract's)

- **Aenor** (`zin_aenor_*`): `add_court_corruption`, `add_council_influence`, `add_concord_loyalty(_all)`, `add_lost_cause`, `add_camp_support`, `set_charter(_all)`, `convene_concord_council`, `delay_death_clock`, `raise_frontier_company`, `raise_golden_guard`, `raise_lost_cause_shield`, `invite_free_dominions`, `wargoal_on_parim_holder`, `people_choose`; triggers `king_alive`, `council_dominant`, `ruled_by_{court,faithful,dominions,host,captains}`, `free_dominions_exist`, `parim_lost`, `eindil_rules`; flag `zin_aenor_hailed_king`; ideas `zin_aenor_interregnum`, `zin_aenor_kings_tasters`, `zin_aenor_lost_cause_court`. Events 500-519 are the tree's; the mechanic keeps 1-499.
- **Cold Lands** (`zin_cold_*`): `add_lean`, `add_lean_all`, `add_defiance`, `add_yeti_pact`, `add_giant_pact`, `chart_far_ice`, `reward_ice_host`, `sell_timber`, `join_crossing`, `sail_white_companies`, `start_march_war`; triggers `historical`, `march_war_allowed`, `isengard_settled`; events `zin_cold.30/.33/.51/.52/.61/.71`; flag `zin_cold_march_war_fought`, global `zin_cold_isengard_sworn`. Journey: `zin_eindil_add_regard`, `zin_eindil_add_renown`. Diplomacy: `zin_lost_cause_add_strength`.
- **Lands of the Sun** (`zin_sun_*`): `add_gala_counsel`, `add_concord`, `add_clarity`, `add_old_lords`, `mirror_vision` (codes north 1 ... any 0, already in the table), `form_noon_league`; trigger `zin_sun_league_needed`; global flag `zin_sun_noon_council`; idea `zin_sun_king_fallen`. Elves: `zin_elves_goodwill`. Afrit: `zin_afrit_add_footholds`. Diplomacy: event `zin_diplo.31` and flag `zin_refusal_lifted`. Shared trees: trigger `zin_shared_has_coast`.
- **Dark Lands** (`zin_dark_*`, `zin_goldoroth_*`): `add_temper`, `add_favour`, `add_sway`, `yoke_check`, `wargoal_defiant`, `wargoal_sworn`, `wargoal_strait_south`, `warking_takes_field`, `kneel`, `proclaim_one_kingdom`, `core_dark_lands`, `claim_strait_shores`, `rally_free_dark`, `offer_access_against_dead`; `zin_dark_add_border_tension`, `add_accord_resolve`, `add_volgan_pact`; triggers `zin_goldoroth_war_open`, `may_war_dondor`, `zin_dark_is_sea_master`, `zin_dark_tension_band_bloody/brink`, `zin_rules_ai_branch_goldoroth_{independent,sworn_to_volgan}`; flags `zin_goldoroth_envoy_heard`, `zin_dark_oath_sworn`. Also `zin_world_add_gathering_dark`, `zin_leren_add_lean`, `zin_volgan_add_dominion_strength`, `zin_politics_set_stance` (the break effect calls it as `zin_politics_set_stance = { STANCE = zin_dom_conquest }`, the syntax of the politics spec).
- The mechanic must **fire** these tree events: `zin_goldoroth.12` (the south is moving) from its pulse.
- The mechanic's setup events add the start spirits `zin_coldor_ports_against_interior` and `zin_goldoroth_quarrelsome_clans`; the Dark Lands mechanic adds `zin_goldoroth_sworn_to_nafeher` through `zin_goldoroth_kneel`.
- **Characters** (characters spec, recruited by focuses): `zin_coldor_harl`, `zin_coldor_ysolde`, `zin_gala_caleon`, `zin_gala_sulestien`, `zin_gala_tangsiel`, `zin_goldoroth_rask`. A missing character makes `recruit_character` fail, so the characters module must write them.
- **Key sites:** the five site triggers above (one focus each builds there).

## Tree-declared helpers

Aenor: `zin_aenor_call_free_peoples`, `_offer_common_cause`, `_offer_treaties`, `_announce_fourth_age` (as the spec) and `zin_aenor_event_diplomacy` (keyword `act`: white_peace 1, access_both 2, join_or_access 3, send_arms 4, access_to_aenor 5; it holds the diplomacy `raw` of the events once). Coldor: `zin_coldor_recruit` (`character` harl 1, ysolde 2); triggers `zin_coldor_dark_rising`, `zin_coldor_before_stage_3`. Gala: `zin_gala_recruit` (heveneya 1, sulestien 2, tangsiel 3), `_islands_goodwill`, `_neighbour_goodwill` (+ `_goodwill_with_gala`), `_sunhot_goodwill`, `_lay_down_ships(count)`; triggers `zin_gala_stage_5`, `_stage_6`, `_dark_40`, `_dark_50`, `_clarity_30`, `_concord_60`. Goldoroth: `zin_goldoroth_break_from_nafeher`, `_honour_tributaries`, `_call_free_dark`, `_diplomacy` (`act` white_peace 1, belonton_leaves 2); triggers as the spec except where noted below.

## Choices and spec conflicts

1. **Global variables.** The condition `variable` tests ROOT's variables, but `zin_gathering_dark`, `zin_eindil_stage`, `zin_mirror_clarity`, `zin_sun_concord` and `zin_dark_border_tension` are global. The trees test them through tiny tree triggers with one `raw` `check_variable = { var = global.x ... }` each. Suggested compiler extension: let `variable.name` take a `global.` prefix, which would free 8 raw blocks.
2. **`raw` use.** Aenor says "no raw block", Coldor and Goldoroth "one": the spec effects that loop over countries (`every_country`), recruit characters, add resources, remove a faction member or test another country's state cannot be said in the vocabulary. Every tree stays within the limit of ten (5, 4, 9, 9). Loops that name a known country set (Goldoroth's tributaries, Gala's island goodwill, `at_war_with_hold`) are written as explicit `for_country` / `or` lists instead, and Aenor's event diplomacy is one keyword helper.
3. **Banned words beat spec names.** `chancellor` (error rule) and `squadrons`, `Allies`, `Government`, `president` (rules) are not allowed in player text, so: *Arrest the Chancellor* is **Arrest the Keeper of Seals** (Merovan's trait is `zin_trait_keeper_of_seals`), *The Chancellor's Seals* **The Keeper's Seals**, Coldor's *The Chancellor's Ledgers* **The Steward's Ledgers**, *The Northern Squadrons* **The Northern Fleet**, *Friends, Not Allies* **Friends Without Oaths**, *The Seals of Government* **The Seals of State**. Keys and ids are unchanged. If the owner wants the old names, the sweep needs allowances.
4. **Two-face name (D7).** The compiler has no two-face focus name or scripted-localisation text, so Aenor's *Son of Ein, Son of Aen* (`son_of_ein`) carries the always-safe name **The Hailed King's Claim** and a description that never names him. A later scripted-localisation pass can add the post-naming face.
5. **Alleria** is not named in any Aenor text (open question aenor 1, proposal followed). Gala's *The Name in the Water* description avoids the name; only event `zin_gala.11`, which the focus fires behind `zin_eindil_named`, says it.
6. **Thresholds simplified without raw:** Gala's AI "x3 if `zin_mistake_power` / `zin_dominion_strength` >= 30/50" uses `zin_gala_dark_40` (Gathering Dark >= 40) as the stand-in; the Noon Council event's AI "concord >= 50" uses concord >= 60; Goldoroth's *The Dead on the Dark Shore* AI uses "at war with Zol" for "Zol is at war with a Dark Lands country"; `zin_goldoroth_dondor_bowed` is "Dondor does not exist or the Dark Sea is won"; Lerendor's "x0 if Lerendor completed The Shield of Dondor" (event 16 AI) is dropped because the Lerendor tree's focus id is not in this tree (add it in the Lerendor tree as a condition on that event's option if wanted); Aenor's honorary-crown AI "accepts at opinion >= 0" is the ideology test only.
7. **Goldoroth's `zin_goldoroth_opinion` effect** is not written: the compiler's `opinion` effect with the full mechanic id does the same thing in every place the spec uses it. Opinion modifiers the spec does not list (`+10 Belonton toward Dondor`, `+15 Troll Forest`, `+20 free hold`) are tree-declared: `opinion_oath_kept`, `opinion_troll_silver`, `opinion_free_dark`.
8. **Gala ship order:** `zin_gala_lay_down_ships` queues the bare hull `zin_hull_galley_1` (forces slice: ships are bare hulls, no named variants), progress 0.5.
9. Coldor event 3 and Gala's single-option events use one option; the Coldor event applies the `zin_glo_sealed` branch as an `if` inside the option because an option cannot be hidden by a condition.
10. AI: "hist" is `zin_rule_historical_path = HISTORICAL` (Coldor: the mechanic's `zin_cold_historical`); Gala's hist factors also carry the PLAUSIBLE half-way factor of its spec; Goldoroth's "rule" factors use `zin_rules_ai_branch_goldoroth_*`.

## Art

No new art. Every focus icon and event picture is a catalog key (checked by the compiler); spirits take the icon of the focus that adds them, the two start spirits name theirs (`harbour_lake`, `orc_axe`) and `zin_goldoroth_sworn_to_nafeher` uses `dead_crown`. Gated pictures `thirty_days`, `crown_of_aen`, `volgan_broken`, `zol_rising` are used only behind their gate flag (the compiler proves it).

## Open items

- Character definitions and the key-site triggers wait for their modules.
- The HOI4 Agent Tools validator could not run (no registered workspace in this session); the engine syntax of the `raw` blocks (`add_equipment_production`, `send_equipment`, `remove_from_faction`, `white_peace`, `recruit_character`, `add_resource`) was checked against `documentation/effects_documentation.md` and vanilla usage by hand.
- Focus renders (`hoi4_focus_render`) are not produced here.
