# Stage 2 integration note: regional B focus trees

Slice `regional_b`: the 20 tier B trees of the East Lands (9), the Islands of the South (4) and the Lands of the Sun (7). Specs: `docs/specs/05_focus_trees/regional/east_lands.md`, `islands_of_the_south.md`, `lands_of_the_sun.md`. Format and compiler: `docs/specs/05_focus_trees/00_format_and_compiler.md`.

## What was written

| Path | What |
| --- | --- |
| `docs/design/focus/regional_<name>.json` (20 files) | Tree data: `alerhia`, `miaed`, `erco`, `plutondo`, `drak`, `ostoroth`, `gondolin`, `mora`, `avalon`, `howan`, `nara`, `verde`, `enhis_is_rond`, `the_lands_of_light`, `poyang`, `godland`, `hengyang`, `elvana`, `goodin`, `heaven` |
| `tools/content/data/focus_registry_regional_b.json` | Registry additions (merged by `loadRegistry`, which reads every `focus_registry_<slice>.json`): outside effects, triggers, flags and global flags the trees use, plus the `fixed_checks` and `refreshed_checks` of decision E4 |
| `tools/content/fixtures/focus_regional_b/shared_*.json` | Three synthetic stand-ins of the shared trees (module structure only), so the test does not depend on the shared trees |
| `tools/content/focus_regional_b.test.mjs` | 50 tests; appended to the `test` script of `tools/package.json` |
| This note | |

## Build call

None. `buildFocusTrees` already reads every `docs/design/focus/*.json`; the 20 files compile to the files of the format spec (`common/national_focus/zin_regional_<name>.txt`, `common/ideas/zin_focus_regional_<name>.txt`, `events/zin_regional_<name>.txt`, tree scripted effects and triggers, opinion modifiers, `common/ai_strategy`, localisation `zin_focus_regional_<name>_l_english.yml`). No change to `build.mjs`, the shared `focus_registry.json` or `focus_arg_codes.json`; no new arg codes are needed.

## Counts

406 own focuses, 103 spirits (own, copies excluded), 32 events, 8 tree-declared effects, 3 tree-declared triggers, 12 opinion modifiers, 6 AI strategies. With copied modules the trees hold 49, 41, 41, 41, 40, 40, 41, 40, 40 (East), 34, 35, 32, 33 (Islands) and 40, 32, 32, 33, 33, 32, 32 (Sun) focuses, the counts of the specs' acceptance lists. Every tree is inside the tier B range (30 to 50).

Tree-declared names (all start with `zin_regional_<name>_`): `alerhia_holds_far_shore`, `alerhia_guard_rift`, `drak_fortify_march`, `drak_yield_seat`, `drak_holds_old_seat` (new; needed for the Old Seat `allow_branch`), `enhis_is_rond_holds_shrine`, `the_lands_of_light_settle_quarrels`, `_fortify_east`, `_goodwill_with_party` (helper), `poyang_seed_gifts`, `poyang_goodwill_with_root` (helper). Opinion modifiers (each tree with one also gets the generated `zin_<tree>_opinion` helper): `bargain_resented`, `word_from_the_passes`, `royal_match`, `stones_settled`, `neighbours_pact`, `a_match_in_furvior`, `a_voice_at_the_table`, `the_embassy_at_furvior`, `lessons_of_the_red_wells`, `welcomed_as_guests`, `refused_a_seat`.

## Names expected from other slices

Written by mechanics modules (listed in `focus_registry_regional_b.json`; remove an entry when its module lands): eastern kings `zin_east_add_lean`, `zin_east_add_road_influence`, `zin_east_claim_rift`, `zin_east_is_south_court`, `zin_east_question_open`, `zin_east_rule_refuse`, `zin_east_rule_unite`, flags `zin_east_coalition_member`, `zin_east_rift_talk`, global `zin_east_caravan_war`, state triggers `zin_is_site_rift_east`, `_rift_west`, `_ocean_of_zol_coast`, `_postondoroth`, `zin_is_region_east_lands`; Stabilo tree `zin_stabilo_add_debt`; Afrit `zin_afrit_add_footholds`, `_add_veil`, `_purge_houses`, flags `zin_afrit_eastern_client`, `_refused_east`, `_suspicious`, `_houses_purged`; elves `zin_elves_goodwill`; journey `zin_eindil_add_regard`, `_add_renown`, `zin_eindil_is_host`, `zin_is_site_south_shrine`, flag `zin_eindil_reef_island`, global `zin_eindil_lost`; Western Crossing `zin_west_add_fleet`, globals `zin_west_route_crossing`, `zin_western_crossing`; Lands of the Sun `zin_sun_add_concord`, `_add_gala_counsel`, `_add_clarity`, `_form_noon_league`, `zin_sun_league_needed`, flag `zin_sun_heeded_south`, globals `zin_sun_noon_council`, `zin_sun_noon_league`, `zin_mirror_stilled`; story globals `zin_war_of_last_crowns`, `zin_eastern_invasion`, `zin_volgan_marches`, `zin_zol_rising`, `zin_afrit_king_of_east`, `zin_afrit_revealed`; politics variables `zin_drift_<ideology>` (see below); `zin_shared_has_coast`, `zin_rules_is_historical`. The shared trees' own effects, triggers and events (`zin_shared_east_lands_*`, `zin_shared_lands_of_the_sun_*`, `zin_shared_east_lands.2`) resolve across trees in the same build. The tier B trees need the shared trees' module tags: E2, E4, E5, E9; I1, I2, I3, I4, I7, I9; S1, S2, S5, S6, S6m, S7, S10 (all present in the three shared files; the test also compiles against them).

`allow_branch` lists (E4): `zin_east_is_south_court` is registered as a fixed check; `zin_regional_drak_holds_old_seat`, `zin_regional_enhis_is_rond_holds_shrine` and `zin_shared_has_coast` as refreshed checks, and each branch head repeats the check in `available`.

## Choices and spec conflicts

1. **Copies.** The Lands of the Sun spec says the copied modules are "written out in full"; the East and Islands specs and the compiler use the `copy` block. All 20 trees use `copy`, so the shared tree stays the one source. Poyang copies S6 and S6m (the shared tree splits Mourning for Lorien into its own module). Poyang's and Elvana's event `pilgrims_on_the_sea_of_gods` re-declares the shared event with the same text, options and AI under the key the shared S5 focus fires, as the Sun spec asks.
2. **Drift.** `zin_politics_add_drift` takes uppercase parameters in the politics spec and has no code table under decision E1. As the shared_b trees do, the trees add to `zin_drift_<ideology>` directly, which is what the effect does (politics spec section 7). Replace with the call when the politics module defines its codes.
3. **Banned words.** Reviewed and error words in the spec's focus names became: Republic to Commonwealth (Mora, Howan, Avalon), President to Chair (Lands of Light: *The Chair of Noon*, Poyang: *Support the Chair*), pilots to steersmen or guides, citizens to townsmen. Focus keys keep the spec's names.
4. **Event order.** The first option is the timeout default (E2), so events list the non-committal option first even where the spec lists it later; AI chances follow the options. Events that need two texts are split: Miaed `.2` (before `zin_volgan_marches`) and `.3` (after), Gondolin `.1` (before `zin_zol_rising`) and `.3` (after). The firing focus picks one with `if`.
5. **Option conditions.** An event option has no condition in the schema, so "only if Gala exists / the Mirror is not stilled" became a conditional effect inside the option.
6. **AI terms such as "lean ÷ 2"** became stepped factor modifiers on lean thresholds. "Hist 60" on Lord of the Crossing is `add 30` under `zin_rules_is_historical` on top of base 30. "Refuse rule" is `zin_east_rule_refuse` or `zin_east_rule_unite`.
7. **Spirit removals.** Spirits the spec removes "at peace", "if Plutondo leaves the faction" and so on use the idea `cancel` trigger (`rift_ambition`, `lord_of_far_shore`, `pacts_right_hand`, `shield_of_postondoroth`, `caravan_war_drak`). Alerhia's `pilgrim_tolls`, which the spec has E4's Close the Houses remove, cancels on `zin_afrit_houses_purged` because the copied module cannot be edited.
8. **Guard the Rift** (`zin_regional_alerhia_guard_rift`) guarantees a random Magical Lands realm that owns a rift_west state and is at war with a coalition member, not "the one with the most states" (the script language has no cheap ordering by a state-site count).
9. **Raw.** 21 raw blocks in all (Alerhia 2, Plutondo 3, Drak 5, Gondolin 1, Mora 2, Enhis Is Rond 1, Lands of Light 6, Poyang 1): state and country iteration (`fortify_*`, `settle_quarrels`, `seed_gifts`, `guard_rift`, `yield_seat`), the collection count of `holds_far_shore`, and single conditions on another country's war or faction status or on a state-site trigger. The Sun spec's "no raw block" cannot hold for the helpers that iterate. The collection syntax (`any_collection_element` with `count`) follows `documentation/triggers_documentation.md`.
10. **Copied `allow_branch`.** The compiler's copy keeps the module's `allow_branch` (the spec says "dropped unless stated"), so E2 shows only to South Lands courts, S2 only to Sunhot realms, and I1, I7, S5 only with a coast.
11. **Plutondo's pact seat** asks lean at most -30 as its spec says; the shared tree's `can_ask_pact` asks -40. Kept as specified.
12. **Peace.** No own focus or event creates a war goal, claim or core; the only claim is `zin_east_claim_rift` behind `zin_east_coalition_member` (test).

## Art

No new art. All icons are catalog keys; all event pictures are ungated standard-crop keys (`generic_court`, `generic_peace`, `generic_sea`, `generic_wilds`, `court_feast`, `black_isles_lights`, `houses`, `gala_court`).

## Open items

- The mechanics names above must exist before the full build is judged against the in-game name check; until then the registry file stands in.
- The politics module may add a code table for `zin_politics_add_drift`.
- Gondolin's coast, Drak's Old Seat and Enhis Is Rond's shrine branches hide until the map and key-sites tables satisfy their triggers (spec open questions 3, 4 and the shrine question).
- The full `npm test` currently fails in `ui_reskin.test.mjs` and `build.test.mjs` ("The build is deterministic") because of concurrent work: the build stops on `goldoroth` and `gunwaith` focus problems that are not from these trees (checked: the 20 trees give no problem in the all-tree analysis).
