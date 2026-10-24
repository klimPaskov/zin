# Integration note: shared focus trees, batch A

Slice: the six shared trees `shared_cold_lands`, `shared_concord_dominions`, `shared_dark_lands`, `shared_dead_lands`, `shared_east_lands` and `shared_islands_of_the_south` (specs in `docs/specs/05_focus_trees/shared/`). Written 19 October 2026.

## Trees

| Tree file (`docs/design/focus/`) | Countries | Focuses | Spirits | Events | Opinion modifiers | Declared effects | Declared triggers | Modules |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `shared_cold_lands.json` | 23 | 70 | 18 | 5 | 1 | 8 | 10 | none |
| `shared_concord_dominions.json` | 18 | 66 | 22 | 8 | 0 | 7 | 15 | none |
| `shared_dark_lands.json` | 17 | 57 | 23 | 2 | 5 | 3 | 6 | D1 to D12 |
| `shared_dead_lands.json` | 6 | 47 | 15 | 6 | 2 | 5 | 5 | L1 to L10 |
| `shared_east_lands.json` | 24 | 68 | 17 | 4 | 0 | 7 | 18 | E1 to E10 (E6a, E6b) |
| `shared_islands_of_the_south.json` | 15 | 46 | 13 | 2 | 0 | 3 | 1 | I1 to I9 |
| **Total** | **103** | **354** | **108** | **27** | **8** | | | |

Every focus, spirit, event title, description and option has its own text; every focus table row of the specs (key, x, y, days, icon, prerequisites, exclusives) is compared with the JSON by `tools/content/focus_shared_a.test.mjs`.

## Build wiring

No new builder module. The focus compiler (`modules/focus_compiler.mjs`) reads the six files with the other trees. Order: after every module whose names the trees read (mechanics, peoples, politics, rules, key sites, warfare categories). Files written per tree: `common/national_focus/zin_<id>.txt`, `common/ideas/zin_focus_<id>.txt`, `events/zin_<id>.txt`, `common/scripted_effects/zin_<id>.txt`, `common/scripted_triggers/zin_<id>.txt`, `common/opinion_modifiers/zin_<id>.txt` (Cold, Dark, Dead Lands) and `localisation/english/zin_focus_<id>_l_english.yml`.

## Changes to shared compiler files (and why)

1. `checks/focus_checks.mjs`, `loadRegistry` and `loadArgCodes` also read every `focus_registry_<slice>.json` and `focus_arg_codes_<slice>.json` next to the base file. Slices no longer edit one shared JSON at the same time. This slice's files: `data/focus_registry_shared_a.json`, `data/focus_arg_codes_shared_a.json`.
2. `Registry` takes `{ pending: true }` for the hand-kept lists (set by `loadRegistry`). A tree that declares a name which is only on a pending list is that module, so it is no F3 collision; a name found in a staged file still collides. Needed because other slices list `zin_shared_has_coast` and the `zin_concord_*` helpers as pending while the shared trees declare them.
3. `checkReferences`: a tree may call the scripted effects and triggers and fire the events that any tree of the build declares (the tier B trees call the Concord, East and Cold helpers and fire module events by full id).
4. `focus_schema.mjs`: a variable in a condition may be `global.<name>` (another slice made the same change for the `RE.variable` regex; one definition remains).

All 65 tests of `focus.test.mjs` pass unchanged; the new behaviour is tested in `focus_shared_a.test.mjs`.

## Names this slice writes (remove them from other slices' pending registry lists)

Declared in `shared_concord_dominions` (prefixes `zin_concord_` and `zin_shared_` through `name_prefixes`): `zin_concord_add_own_loyalty`, `zin_concord_petition_charter`, `zin_concord_back_camp`, `zin_concord_ask_for_charter`, `zin_concord_join_free_dominions`, `zin_concord_grant_petition`, `zin_concord_admit_dominion` and the triggers `zin_concord_charter_grantable`, `_petition_is_golden`, `_has_golden_charter`, `_parim_takes_charters`, `_can_join_free_dominions`, `_owns_wall_state`, `_dark_rising`, `_overlord_corrupt`, `_overlord_with_host`; and the generic triggers of `zin_shared_trees.txt`: `zin_shared_has_coast`, `zin_shared_is_island_realm`, `zin_shared_borders_dead_lands`, `zin_shared_borders_magical_lands`, `zin_shared_borders_dark_lands`, `zin_shared_bound_away_from_host`. They compile into `common/scripted_triggers/zin_shared_concord_dominions.txt`, not into a file `zin_shared_trees.txt` (the compiler writes one file per tree); the names are what matters. Another slice's registry file that lists any of these as pending is harmless with change 2, and should be cleaned when convenient.

Declared in `shared_east_lands`: `zin_shared_east_lands_road_infra`, `_halve_lean`, `_rift_goodwill` (called by the tier B East trees), `_withdraw`, `_deep_sand`, `_loyal_house`, `_own_laws` and 18 triggers. In `shared_cold_lands`: `zin_shared_cold_lands_lean_neighbours` (called by the regional Cold trees) and seven others. Dark, Dead Lands and Islands declare their own (see the JSON).

## Names this slice reads (registry additions, `data/focus_registry_shared_a.json`)

Scripted effects: `zin_aenor_{add_concord_loyalty, add_court_corruption, event_for_parim, set_charter}`, `zin_afrit_{add_footholds, purge_houses}`, `zin_cold_{add_defiance, add_lean}`, `zin_dark_{add_accord_resolve, add_border_tension, add_volgan_pact, found_free_moot, join_free_moot}`, `zin_east_{add_lean, claim_rift, grant_free_cb, wells_random}`, `zin_eindil_{add_regard, add_renown, aid_host, join_coalition}`, `zin_elves_add_wall_grievance`, `zin_goldoroth_add_sway`, `zin_lost_cause_add_strength`, `zin_mirolon_{add_passes, add_proof}`, `zin_politics_add_drift`, `zin_stabilo_add_debt`, `zin_sun_add_gala_counsel`, `zin_volgan_add_dominion_strength`, `zin_west_add_fleet`. Scripted triggers: the Aenor, Cold, Dark, East, Eindil, people (`zin_people_is_common_folk`, `zin_people_includes_<yeti|giants|ents|trolls|goblins|ogres>`), rule (`zin_rules_is_historical`, `zin_rules_is_free`, `zin_rules_ai_branch_east_*`) and key-site (`zin_is_site_great_wall`, `_ocean_of_zol_coast`, `_rift_east`, `_sea_of_darkness_coast`; `zin_is_site_road_<key>`, `zin_is_site_rift_west`, `zin_is_region_*` are read inside raw scripts) names listed in the file. Country flags, global flags, the idea `zin_concord_charter_golden`, the opinion modifier `zin_cold_accord_kin` and the event `zin_east.35` are listed there too. Raw scripts also read `zin_court_corruption`, `zin_concord_petition_code`, `zin_aenor_ruled_by_court`, `_captains`, `zin_aenor_is_realm`, `zin_east_court_gifts`, `zin_stabilo_ledger_open`, `zin_cb_hold_defiance`, `zin_goldoroth_unity`, `zin_goldoroth_southern_bargain`, `zin_dark_is_hold`, `zin_regional_fearno_steadings_path`, `zin_is_noris`, `zin_is_stabilo`, `global.zin_eindil_host`, `zin_dominion_tributary_friend`, `zin_mirolon_league_friend`.

The branch lists of E4 in the same file: fixed checks (people triggers, `zin_east_is_south_court`, `zin_east_faces_rift`, `zin_shared_east_lands_{north_coast, on_road}`, `zin_shared_islands_of_the_south_large`) and refreshed checks (the Cold, Dark and Dead Lands branch triggers, `zin_aenor_is_concord_dominion`, `zin_dark_is_{free_hold, tributary, accord_member}`), and the refreshed flag `zin_tradition_middle_kingdom`. Each refreshed head repeats its condition in `available`.

Dependencies on mechanic slices (they must write these, with the arguments listed in the specs): the temporary-variable calling convention (E1) for every `call`; the Dark Lands pulse `zin_dark.1`, the Dominion pulse `zin_dominion.1` and the Cold Lands, East, Eindil and Western Crossing refresh calls named in the specs; the scripted localisation `zin_loc_deliverer` (East Lands text); the research categories `zin_cat_{arms, bows, mounts, galleys, kin}`; the equipment types `zin_arms_equipment`, `zin_troll_gear_equipment`, `zin_ogre_gear_equipment`; the autonomy state `zin_autonomy_chartered_dominion`.

## Keyword codes (decision E1)

`focus_arg_codes_shared_a.json` adds the owner `zin_politics_`: `ideology` light 1, dominion 2, shadow 3, wild 4. The politics spec (`02_ideologies_and_politics.md`, section 7) writes `zin_politics_add_drift = { IDEOLOGY = x VALUE = n }` with parameters, which E1 forbids; a tree call compiles to `zin_arg_ideology` (the code) and `zin_arg_value` before `zin_politics_add_drift = yes`. The politics module must read those two variables. It also repeats the `zin_concord_` charter and camp codes of `focus_arg_codes_regional_c.json`.

## Choices where the specs conflict or are silent

1. Spec "No raw blocks": the specs also require scripted triggers and effects (`any_owned_state`, `every_other_country`, scoped tag tests, `add_autonomy_ratio`) that the compiler vocabulary cannot express. Every `raw` sits inside a tree-declared effect or trigger; no focus, event or spirit uses one (tested). Country tags in those bodies come from the roster (tested against `countries.json`).
2. Spirit keys that equal a focus key (F3) were renamed: Concord `fishing_fleets_spirit`, `charter_loyalists_spirit`, `the_dark_comes_spirit`.
3. Texts that the specs' own text rules forbid were reworded: Cold `a_harbour_for_strangers` is named "A Harbour for Wayfarers", `beside_the_heir` "Beside the Gathering Host" (no "stranger" or "Heir" before the journey); Islands `songs_for_strangers` is named "Songs for Visitors". Keys are unchanged.
4. Dead Lands `zin_shared_dead_lands_gain_autonomy (value)` is three effects `_10`, `_30`, `_50` (effects take no parameters; a variable in `add_autonomy_ratio` is not guaranteed). Dark Lands `..._opinion_of_root` is inlined with the compiler's `opinion` effect inside `for_country`, wrapped in `if exists`.
5. Autonomy tooltips use the focus name keys as `localization`; Cold `zin_shared_cold_lands_offer_coast_league` picks the partner with the most states, ties go to a random one of them (`random_other_country`), not to the first tag.
6. Concord events 1, 3 and 6: the non-committal option is listed first (E2), so the order differs from the spec tables.
7. Dead Lands `the_southern_storm` puts only "not subject of Volgan" into `allow_branch`; "Volgan exists" is in `available` (`exists` is not an allowed branch condition).
8. D1, D10 and D11 have several roots, so a tier B tree cannot copy them whole; no spec asks for it. East E1 to E10 and Islands I1 to I9 each have one root and copy cleanly (tested with a synthetic tree). Module focuses fire events by full id for this reason.

## Art

No new art. Every icon and event picture is in the catalog. Requested keys of the specs (not needed to build): `cold_steading_moot` (Cold events 1 to 4), `orc_hall` (Dark Lands event 1), `desert_envoys` (East events 1, 2, 4); the events use `generic_court` and `generic_wilds` until then.

## Not verified

The HOI4 Agent Tools script validator needs a registered workspace, so it was not run. Instead the test parses every compiled file with the repository's Clausewitz parser and checks every key against the installed game documentation (`effects`, `triggers`, `modifiers`), including all raw blocks. Nothing was run in the game.
