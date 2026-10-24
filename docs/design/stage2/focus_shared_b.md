# Integration note: shared focus trees, batch B

**Slice:** the shared (tier C) trees of the Lands of the Sun, the Magical Lands, the North Lands, Triton's Islands and the West Lands. **Date:** 19 October 2026. **Specs:** `docs/specs/05_focus_trees/shared/shared_lands_of_the_sun.md`, `shared_magical_lands.md`, `shared_north_lands.md`, `shared_tritons_islands.md`, `shared_west_lands.md`.

## What is delivered

| Tree id | File | Countries | Focuses | Spirits | Events | Opinion modifiers | Tree scripted effects / triggers |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `shared_lands_of_the_sun` | `docs/design/focus/shared_lands_of_the_sun.json` | 39 | 44 | 13 | 1 | 0 | 5 / 3 |
| `shared_magical_lands` | `docs/design/focus/shared_magical_lands.json` | 15 | 55 | 15 | 4 | 1 | 3 / 8 |
| `shared_north_lands` | `docs/design/focus/shared_north_lands.json` | 22 | 55 | 18 | 6 | 2 | 6 / 8 |
| `shared_tritons_islands` | `docs/design/focus/shared_tritons_islands.json` | 28 | 52 | 16 | 3 | 0 (see companion) | 15 / 11 |
| `shared_west_lands` | `docs/design/focus/shared_west_lands.json` | 14 | 65 | 11 | 3 | 1 | 9 / 11 |
| **Total** | | **118** | **271** | **73** | **17** | | |

The trees are data; the focus compiler writes `common/national_focus`, `common/ideas`, `events`, `common/scripted_effects`, `common/scripted_triggers`, `common/opinion_modifiers` and the localisation for each. Every focus has a name and a description of one to three sentences, a catalog icon and the spec's AI; all text was scanned with the banned-word rules and the glossary (zero hits). No new art is needed: every icon and event picture is an existing, ungated catalog key. The art the specs "requested" (`elven_moot`, `tritons_pirate_trial`, `west_freehold_hall`) is not used; the events keep their existing keys.

Other files:

| Path | What |
| --- | --- |
| `tools/content/data/focus_registry_shared_b.json` | Registry additions (same shape as `focus_registry.json`) |
| `tools/content/modules/focus_shared_b.mjs` | Companion module `buildSharedBCompanion(staged)`: writes `common/opinion_modifiers/zin_tritons_pupor.txt` (`zin_tritons_banks_quarrel`, `zin_tritons_mediation_refused`) and `localisation/english/zin_tritons_pupor_l_english.yml` |
| `tools/content/focus_shared_b.test.mjs` | 32 tests, over 200 assertions; appended to `tools/package.json` `test` |

## Wiring for the integrator

1. In `tools/content/build.mjs`, call `buildSharedBCompanion(staged)` anywhere before `buildFocusTrees` (the compiler then finds the two Triton's opinion modifiers in the staged files).
2. The compiler's `loadRegistry` reads one file, so merge `focus_registry_shared_b.json` into `focus_registry.json` (union of every list; `branch.fixed_checks`, `branch.refreshed_checks` and `branch.refreshed_flags` too). Every entry is removed again when the owning module stages the name; the test merges the two files itself, so it passes either way. Without the additions the five trees fail with `effect_unresolved`, `trigger_unresolved` and `flag_unresolved` (a test asserts this).
3. No other call and no order beyond that. The trees need the roster (`countries.json`) and the icon catalog, both present.

## Spec conflicts and choices

1. **Banned words in spec names.** `Honour the President` is `Honour the Chair` (key `honour_the_president` unchanged; `president` is banned); `Island Pilots` is `Island Steersmen` (glossary forbids pilot); `The Isle Squadron` is `The Isle Fleet`; `Fishers, Not Fighters` is `Fishers, Not Warriors`; `The Great War at Sea` is `The War at Sea`. Keys are the spec's. Tier B trees that copy these must use the new names.
2. **Names that would leak the secret.** `Beside the Heir` (Triton's, key `beside_the_heir`) is `Beside the Coalition`: its text is visible from the first day and D4 forbids "the Heir" before Lorien names him.
3. **Spirit keys that equal focus keys** (F3): North `grain_and_fish`, `market_fairs`, `forest_trails`, `island_crown` became `<key>_spirit`.
4. **Opinion-modifier ids.** The compiler names a tree's modifiers `zin_<tree>_<key>`, so the North spec's `zin_opinion_parims_shield` and `zin_opinion_northern_faith` compile to `zin_shared_north_lands_parims_shield` and `_northern_faith`; the Magical `gate_traders` and the West `council_league` are as specified. The Triton's spec fixes `zin_tritons_banks_quarrel` and `zin_tritons_mediation_refused`, which the tier B trees `regional_nondondor` and `regional_seite_islands` already use, so the companion module writes them under those exact ids.
5. **Politics drift.** `Drift X +n` is written `add_to_variable zin_drift_<x> n` plus a tooltip, which is the documented body of `zin_politics_add_drift`; `focus_arg_codes.json` has no politics owner, so the keyword call cannot compile. Swap to the call when the code table lists it.
6. **Global variables.** The schema allows no dotted variable name, so reads of `global.zin_gathering_dark`, `global.zin_elves_kinship`, `global.zin_elves_wall_grievance`, `global.zin_eindil_stage` and `global.zin_tritons_piracy` live in small tree triggers with one `raw` condition (`zin_<tree>_dark_gathering`, `_kinship_high`, `_wall_grievance_high`, `_dark_stirring`, `zin_tritons_ship_has_sailed`, `zin_tritons_piracy_40`, `_60`). A schema change allowing `global.` names would remove them.
7. **`raw`.** The spec says "no raw blocks"; the engine effects the tree-declared scripts need (`clamp_variable`, `leave_faction`, `add_to_war`, `every_country` loops, `add_autonomy_score`, event targets) are outside the compiler vocabulary, so the scripted effects and triggers use `raw` (Sun 9, Magical 10, North 10, Triton's 21, West 14, all inside tree scripts or rare conditions; shared trees have no cap). No focus reward is `raw`.
8. **Autonomy reasons.** `add_autonomy_ratio` / `add_autonomy_score` need a localisation key; each such effect first runs a `tooltip` effect and uses its generated key (`<effect>_tip_1`) as `localization`.
9. **Countries in raw script** are named only through tree triggers built from `{ country }` (`..._is_gunwaith`, `..._is_girdon`, `zin_tritons_is_nondondor`, `..._is_seite_islands`), so the compiler resolves tags; `zin_is_lerendor` and `zin_aenor_is_realm` (generated checks named by the North spec) are used as written.
10. **Copy modules.** Sun focuses are tagged `S1`-`S10`; `S6` is split into `S6` (envoys, heed) and `S6m` (mourning) because the copy block needs one root per module. Magical focuses are `M1`-`M13` with `M11` split into `M11a`, `M11b`, `M11c`; `M1` has two heads (the elders and the young houses), so the copy block cannot take it whole. Spirits are tagged with the module of the focus that adds them. Scripted effects and triggers stay untagged (tier B trees call the shared ones, as the Sun spec says). North, Triton's and West focuses carry no module tag (their specs define none).
11. **`for_country` and goodwill.** Each `for_country` that names a country is wrapped in `if exists`. The Sun's `Goodwill X` is `zin_elves_goodwill {target: X}` in ROOT's scope; the Magical `Goodwill X` is `for_country X: zin_elves_goodwill {target: ROOT}` as written.
12. **AI.** `hist` uses `zin_rules_is_historical` (Sun, North, Triton's), `zin_west_historical` (West), and in the Magical tree the two-modifier PLAUSIBLE form of its AI section. Under `hist` a factor of 0 is written as a real `factor = 0` modifier.
13. **Event option order.** Option order follows the specs. The first option is the one an unanswered event takes after 30 days, so e.g. Lerendor's reply to a seat request would welcome the asker; the specs list it that way and the tree events are not story checkpoints (E2).

## Names this slice defines

Tree scripts (prefixes `zin_shared_<region>_`, plus `name_prefixes` `zin_north_`, `zin_shared_north_` and `zin_tritons_`):

- North: `zin_north_ask_compact_seat`, `zin_north_ask_parim_shield`, `zin_north_keep_faith`, `zin_north_welcome_to_compact`, `zin_north_grant_parim_shield`, `zin_north_accept_northern_faith`; triggers `zin_shared_north_in_compact`, `zin_north_can_ask_compact`, `zin_north_free_crowns_open`, `zin_north_with_lerendor`, `zin_north_from_lean_60`, `zin_north_from_shielded_by_parim`, `zin_north_lerendor_supremacy`, `zin_north_parim_gilded`.
- Triton's (the Pupor Ocean system): effects `zin_tritons_add_piracy`, `_refresh_seas`, `_set_side` (+ `_set_side_chart`, `_haven`, `_none`), `_found_charter`, `_join_charter`, `_offer_banks_mediation`, `_accept_mediation`, `_refuse_mediation`, `_make_banks_accord`, `_join_crossing`, `zin_shared_tritons_islands_pay_tribute`, `_seek_voice`; triggers `zin_tritons_is_island_realm`, `_ship_has_sailed`, `_charter_exists`, `_from_is_haven`, `_banks_pressed`, `_likes_convener`, plus helpers `_is_nondondor`, `_is_seite_islands`, `_both_accepted`, `_piracy_40`, `_piracy_60`. Keywords of `zin_tritons_set_side`: `chart` 1, `haven` 2, `none` 3 (declared in the tree; no entry needed in `focus_arg_codes.json`). The four sea-band ideas are `zin_shared_tritons_islands_open_lanes`, `_harried_lanes`, `_corsair_season`, `_lean_season`.
- Sun: effects `zin_shared_lands_of_the_sun_join_league`, `_islands_goodwill`, `_loyal_realm`, `_own_sun`, `_goodwill_with_root`; triggers `_can_join_league`, `_lost_ground`, `_dark_gathering`.
- Magical: `zin_shared_magical_lands_opinion_both_ways` (keyword `modifier`: `gate_traders` 1), `_gain_autonomy`, `_guard_roosts`; triggers `_faces_the_mistake`, `_may_join_kindred`, `_woods_invaded`, `_elven_overlord`, `_short_of_power`, `_kinship_high`, `_wall_grievance_high`, `_dark_stirring`.
- West: effects `zin_shared_west_lands_neighbour_pacts`, `_pact_one`, `_ask_parim`, `_seek_guarantee`, `_offer_council_league`, `_pay_tribute`, `_seek_voice`, `_guarantee_from`, `_sign_council_league`; triggers `_is_coastal`, `_by_the_ford`, `_holds_three_oaths`, `_claimed_by_gunwaith`, `_from_claimed_by_gunwaith`, `_at_war_with_from`, `_short_of_pp`, `_light_partner_of_root`, `_has_light_partner`, `_is_gunwaith`, `_is_girdon`.
- Flags set: `zin_zol_forewarned`, `zin_magical_forest_forewarned_east`, `zin_north_heard_whispers`, `zin_elves_wanderers_extra`, `zin_elves_roosts_guarded`, `zin_eindil_safe_harbour`, `zin_eindil_heeded`, `zin_lost_cause_member`, `zin_tritons_*` (side, charter, mediation), `zin_shared_magical_lands_forewarned`.

## Names this slice expects from others

All are listed in `focus_registry_shared_b.json`; the compiler resolves them from the staged files once their module runs.

- **Elves:** effects `zin_elves_goodwill`, `_add_kinship`, `_add_pass_watch`, `_add_roost_bond`, `_add_wall_grievance`, `_join_kindred`, `_set_pilgrim_roads`; triggers `zin_elves_eastern_threat`, `_is_pilgrim_road_realm`, `_is_rift_realm`, `_is_wall_realm`, `_kindred_exists`, `_refusal_question_open`; `zin_world_is_dragon_keeper`; variables `zin_elves_kinship`, `zin_elves_wall_grievance`; flags `zin_elves_wall_roads_closed`, `zin_elves_roost_sickness`.
- **Lands of the Sun:** `zin_sun_add_concord`, `zin_sun_add_gala_counsel`, `zin_sun_league_needed`, flags `zin_sun_noon_council`, `zin_sun_noon_league`, `zin_sun_council_president`, `zin_region_lands_of_the_sun`; `zin_faction_rule_join_sun_realms` is only implied by `_can_join_league`.
- **Lerendor and Aenor:** `zin_leren_add_lean`, `zin_leren_treaty_in_force`, `zin_is_lerendor`, `zin_aenor_event_for_parim`, `zin_aenor_is_realm`, `zin_aenor_king_alive`, `zin_aenor_parim_lost`, variable `zin_court_corruption`, `zin_leren_lean`, flags `zin_leren_withdrawal`, `zin_leren_route_supremacy`, opinion modifier `zin_leren_compact_kin`, `zin_tolvael_free_crowns`.
- **Western Crossing:** `zin_west_add_grudge`, `_add_unity`, `_add_fleet`, `zin_west_historical`, variable `zin_west_grudge`, `zin_west_convener`, flags `zin_west_council`, `_grey_ford_war`, `_route_crossing`, `_route_divided`, `_route_relief`, `_pledged`, `_ships_only`, `_stranded`, `_evacuation`, `_evacuated`, `zin_western_crossing`, idea `zin_west_aenoran_gold`; `zin_aurevan_crowned`.
- **Eindil and Afrit:** `zin_eindil_add_regard`, `_add_renown`, `_join_coalition`, `_aid_host`, triggers `zin_eindil_friend`, `_resents`, flags `zin_eindil_awake`, `_named`, `_war_king`, `_returned`, `_crowned`, `zin_afrit_add_footholds`, `zin_afrit_purge_houses`, flags `zin_afrit_revealed`, `_suspicious`, `_dead`, `_houses_purged`, variable `zin_footholds`.
- **World and rules:** `zin_war_of_last_crowns`, `zin_zol_rising`, `zin_zol_withdrawn`, `zin_gathering_dark`, `zin_lorien_dead`, `zin_eastern_invasion`; `zin_rules_is_historical`, `zin_rules_is_free`; `zin_people_is_common_folk`; site triggers `zin_is_site_parim`, `zin_is_site_three_oaths`, `zin_is_site_ocean_of_zol_coast`, `zin_is_region_zols_mistake`; `zin_lost_cause_add_strength`; faction template `zin_faction_pupor_charter` (diplomacy already writes it); scripted localisation `zin_loc_deliverer`; region flags `zin_region_*`.
- **Generic shared triggers** from the Concord tree (`shared_concord_dominions`, other slice): `zin_shared_has_coast`, `zin_shared_is_island_realm`, `zin_shared_borders_dark_lands`, `zin_shared_bound_away_from_host`. This slice declares none of them; the build fails on a second definition.

## Layout refresh (E4)

Branch heads that use refreshed conditions repeat them in `available`. Added to `branch` in the registry file: refreshed checks `zin_elves_is_wall_realm`, `_is_pilgrim_road_realm`, `_is_rift_realm`, `zin_world_is_dragon_keeper`, `zin_shared_magical_lands_faces_the_mistake`, `zin_shared_west_lands_by_the_ford`, `zin_shared_west_lands_is_coastal`; fixed check `zin_people_is_common_folk`; refreshed flags `zin_west_route_crossing`, `_divided`, `_relief`. Dependencies noted by the specs: `zin_west_set_route` and the elves runner must call `mark_focus_tree_layout_dirty` for their regions.

## Open items

- Scripted-effect bodies that use engine syntax the compiler cannot check (`every_country` loops with `PREV`, `random_state` plus `save_event_target_as`, `add_to_war` with `enemy = PREV`, `set_temp_variable = { x = THIS }`, `diplomatic_relation = { country = var:... }`) follow the game's documentation and vanilla patterns but were not run in the game; the Agent Tools validator was not reachable from this session (no registered workspace).
- The faction name key `zin_faction_pupor_charter` is the diplomacy module's (it already writes the template and name).
- The Sun, West and Triton's specs promise review images; the renderer was not run here.
