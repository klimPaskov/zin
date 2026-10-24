# Focus trees: regional C (Magical Lands and Middle Lands tier B)

**Slice:** the five Magical Lands tier B trees ([regional/magical_lands.md](../../specs/05_focus_trees/regional/magical_lands.md)) and the eleven Middle Lands and Aenor Isle tier B trees ([regional/middle_lands.md](../../specs/05_focus_trees/regional/middle_lands.md)). Data only: no builder module and no `build.mjs` change. `modules/focus_compiler.mjs` reads the sixteen files from `docs/design/focus/` and writes the game files.

## Files

| Path | What |
| --- | --- |
| `docs/design/focus/regional_<name>.json` | The 16 trees: `lccimio`, `the_end`, `herrodon`, `andos_enda`, `nolorim`, `selen`, `noleksun`, `herez`, `konori`, `kilinti`, `kingson`, `hunhun`, `hiloron`, `bloody_forest`, `cursed_lands`, `asgard` |
| `tools/content/data/focus_registry_regional_c.json` | Outside names the trees use that no staged file defines yet (same shape as `focus_registry.json`; `loadRegistry` reads it next to the shared file). Remove an entry when its module lands |
| `tools/content/data/focus_arg_codes_regional_c.json` | Keyword codes of the Concord helpers (`charter` old 0, golden 1, shield 2, free 3, wall 4; `camp` court 1, faithful 2, dominions 3, host 4) under the prefix `zin_concord_`. The shared file lists these codes only under `zin_aenor_`, so `zin_concord_petition_charter` and `zin_concord_back_camp` had no codes. Drop this file when `focus_arg_codes.json` carries the prefix |
| `tools/content/focus_regional_c.test.mjs` | 45 tests (hundreds of assertions, 12 of them negative), appended to `tools/package.json` `test` |

Compiled per tree by the focus compiler: `common/national_focus/zin_regional_<name>.txt`, `common/ideas/zin_focus_regional_<name>.txt`, `events/zin_regional_<name>.txt` (namespace `zin_regional_<name>`, ids numbered as in the specs' tables), `common/scripted_effects` and `common/scripted_triggers` where the tree declares any, `common/opinion_modifiers` for Andos Enda, Noleksun, Herez, Konori, Kingson, Hiloron, Bloody Forest, Cursed Lands, `common/ai_strategy` for the five Magical Lands trees, and `localisation/english/zin_focus_regional_<name>_l_english.yml`.

## Counts

| Tree | Country | Focuses | Spirits | Events |
| --- | --- | ---: | ---: | ---: |
| `regional_lccimio` | Lccimio | 40 | 8 | 3 |
| `regional_the_end` | The End | 39 | 10 | 3 |
| `regional_herrodon` | Herrodon | 34 | 6 | 6 |
| `regional_andos_enda` | Andos Enda | 36 | 11 | 4 |
| `regional_nolorim` | Nolorim | 32 | 8 | 4 |
| `regional_selen` | Selen | 47 | 17 (16 + timed `ranger_watch`) | 4 |
| `regional_noleksun` | Noleksun | 32 | 9 | 4 |
| `regional_herez` | Herez | 32 | 8 | 5 |
| `regional_konori` | Konori | 31 | 10 | 4 |
| `regional_kilinti` | Kilinti | 32 | 12 | 4 |
| `regional_kingson` | Kingson | 33 | 11 (10 + timed `fair_dealing`) | 5 |
| `regional_hunhun` | Hunhun | 31 | 11 | 3 |
| `regional_hiloron` | Hiloron | 32 | 9 | 2 |
| `regional_bloody_forest` | Bloody Forest | 32 | 10 | 4 |
| `regional_cursed_lands` | Cursed Lands | 30 | 9 | 5 |
| `regional_asgard` | Asgard | 33 | 11 | 2 |
| **Total** | | **546** | **160** | **62** |

Every focus has a name, a one-to-three-sentence description, an icon of the catalog, effects, `ai` and search filters (derived from the effects); every spirit has modifiers that exist in the game's modifier documentation; every event picture is a catalog key. Each tree carries a historical route as `add 30` AI modifiers under `check zin_rules_is_historical` from the period the AI section names, `factor 0` on the choices the historical AI never takes, 100 or 500 on gated story focuses, and the FREE/PLAUSIBLE factors of the specs.

## Tree-declared scripts

Effects: `zin_regional_herrodon_court_keeper`, `zin_regional_nolorim_ask_kin` (three bands of opinion, best-liked first: more than 39, more than 19, any), `zin_regional_selen_raise_rangers` (creates the template "The Greenwood Company" and one division), `zin_regional_selen_suspect_houses`, `zin_regional_noleksun_call_the_free`, and the generated opinion helpers `zin_<tree>_opinion` of the eight trees with opinion modifiers.
Triggers: `zin_regional_lccimio_east_quiet`, `zin_regional_the_end_faces_the_mistake`, `zin_regional_herrodon_keeper_friend`, `zin_regional_herez_mirolon_friend`, `_league_exists`, `_cores_occupied`, `zin_regional_selen_employs_alleria`, `zin_regional_noleksun_free_faction_led`, and per tree `_may_join_kindred`, `_woods_invaded`, `_war_gate`, `_rival_in_kindred` and similar helpers of the Magical Lands trees.
Raw blocks: only where the vocabulary cannot say it (division template, `random_country` picks, military access, opinion removal, `is_in_faction` tests, `any_enemy_country`, `zin_politics_add_drift`, a few AI conditions). Regional trees have no raw limit.

## Needed from other slices

All are in `focus_registry_regional_c.json`. The mechanic owner defines them for real; the registry entry goes when it does.

| Owner | Names |
| --- | --- |
| Elves ([elves_wall_and_dragons](../../specs/04_mechanics/elves_wall_and_dragons.md)) | effects `zin_elves_add_kinship`, `_add_rivalry`, `_add_wall_grievance`, `_add_roost_bond`, `_add_pass_watch`, `_goodwill`, `_set_pilgrim_roads`, `_focus_dragon_pact`, `_join_kindred`, `_begin_feud` (arg `attacker`); triggers `zin_elves_kindred_exists`, `_refusal_question_open`, `_is_rift_realm`, `_is_wall_realm`, `_is_pilgrim_road_realm`, `_eastern_threat`, `_dragon_need`, `_is_magical_realm` (raw only); global variables `zin_elves_kinship`, `_rivalry`, `_wall_grievance`; flags `zin_elves_wall_roads_closed`, `zin_elves_wanderers_extra` (set by the trees); site `zin_is_site_boundary_groves`; opinion `zin_opinion_old_rivalry` |
| Aenor and Concord ([aenor_court_and_succession](../../specs/04_mechanics/aenor_court_and_succession.md), shared_concord_dominions) | effects `zin_concord_add_own_loyalty`, `_petition_charter`, `_back_camp`, `zin_aenor_secede_dominion`, `zin_aenor_event_for_parim`, `zin_lost_cause_add_strength`; triggers `zin_aenor_is_concord_dominion`, `_dominion_restless`, `_dominion_defiant`, `_host_available`, `zin_shared_bound_away_from_host`; flags `zin_aenor_free_dominion`, `zin_lost_cause_member`, `zin_lost_cause_shield`; faction template `zin_faction_free_dominions`; economy `zin_economy_add_gold` |
| Eindil ([eindil_journey](../../specs/04_mechanics/eindil_journey.md)) | effects `zin_eindil_add_regard`, `_add_renown`, `_add_delay`, `_aid_host`, `_join_coalition`; triggers `zin_eindil_is_host`, `_friend`; idea `zin_eindil_warning_heeded`; flags `zin_eindil_named`, `_returned`, `_cast_down`, `_crowned`; variables `zin_eindil_stage`, `zin_eindil_renown` (global), `zin_eindil_regard` (country) |
| Afrit, Volgan, Mirolon | `zin_afrit_add_footholds`, `zin_afrit_add_veil`, `zin_volgan_add_veil`, `zin_mirolon_add_proof`, `zin_mirolon_add_passes`, flag `zin_mirolon_herez_friend` (Mirolon spec; not in the contract today), `zin_volgan_body_destroyed` |
| World, rules, diplomacy | `zin_rules_is_historical`, `zin_rules_is_free`, `zin_world_is_dragon_keeper`, `zin_dragons_free`, `zin_world_dragon_pacts`, `zin_gathering_dark`, `zin_west_fleet` (read as global), game rule `zin_rule_dark_powers`, flags `zin_region_east_lands`, `zin_wall_accord`, `zin_wall_accord_broken`, `zin_west_evacuated`, story flags |
| Map | `zin_is_site_great_wall`, `zin_is_site_ocean_of_zol_coast`, `zin_is_region_zols_mistake` |
| Politics | `zin_politics_add_drift = { IDEOLOGY = shadow VALUE = 5 }` is written raw (contract: params `IDEOLOGY`, `VALUE`); change one focus (`gifts_from_the_south`) if the politics module takes temporary variables |

**Branch registry.** `focus_registry_regional_c.json` adds `zin_elves_is_rift_realm`, `_is_wall_realm`, `_is_pilgrim_road_realm` and `zin_regional_the_end_faces_the_mistake` to `branch.refreshed_checks`: they are the allow_branch heads of the specs and the elves runner refreshes the layout monthly. Each head repeats its check in `available`.

## Spec conflicts and my choices

1. **Spirit keys equal to focus keys (F3).** The specs list spirits named like the focus that adds them. Renamed with the `_spirit` suffix: Selen `warden_host`, `university_of_selen`, `selen_under_arms`; Noleksun `frontier_law`, `frontier_levies`, `prosperous_valleys`; Kingson `keepers_of_the_accord`; Hunhun `escort_companies`, `riding_drills`, `ride_captains`, `the_long_ride`; Hiloron `memory_of_the_crossings`, `shield_of_giants`, `war_chiefs`, `lake_boats`; Bloody Forest `hired_axes`, `forest_ambush`; Cursed Lands `the_veil`; Konori `outriders`. Names and effects are unchanged.
2. **Vanilla names.** Herez's "The Southern Front" is a vanilla focus name; renamed "The Front of the Marches" (key `the_southern_front` kept). Kilinti's option "We remember." renamed "The ents remember."
3. **Global variables.** The specs read `global variable x above n`. The compiler's `variable` condition takes `global.<name>` (added by the major B slice); the trees use it. Country variables (`zin_footholds`, `zin_concord_loyalty`, `zin_eindil_regard`) are plain.
4. **Event option order (E2).** A timed-out event takes its first option, so I put the non-committal option first where the spec's first option commits (a puppeting, a seizure, a hanging, a boat that is lost). Weights are the specs'.
5. **Herrodon event 6** has one option and the text names the answering realm (`[FROM.GetName]`) but not the answer: one option cannot carry three answers. **Herrodon event 5** AI "10 + opinion ÷ 4, ×2 at war with an eastern invader" is stepped: +5 above 19, +5 above 39, ×2 at war with an East Lands country.
6. **Nolorim's "three realms with the highest opinion"** is three bands (opinion above 39, above 19, any), each picking one realm; exact ranking needs array scripting the compiler cannot say.
7. **AI strategies.** The specs say "toward the East Lands coalition leader". The leader is a runtime flag and a strategy needs a fixed tag, so Lccimio and The End `prepare_for_war` toward Noris (40) and Stabilo (30) once `zin_eastern_invasion` is set.
8. **The Greenwood Company** is created without a named commander: no effect is documented that assigns a character to a new division. The AI or the player seats `zin_alleria`. "Already in his war as Aenor's dominion" (coalition focuses) is `zin_shared_bound_away_from_host` (shared Concord trigger).
9. **`zin_west_fleet`** is read as a global variable (the contract lists it as "country / global"; the Asgard AI threshold is the global grudge).
10. **Selen** has 47 focuses, inside the tier B range; no tree exceeds 50.

## Art

None to add: every focus icon, spirit icon and event picture is a catalog key. Three spirits that no focus adds name an icon: `forest_truce` (`olive_branch`), `ranger_watch` (`scout_lantern`), `fair_dealing` (`toll_house`). Pictures `hermitage`, `houses`, `black_isles_lights` are gated in the catalog; the compiler warns where it cannot prove the gate.

## Open items

- Characters of the court tables (rulers, advisors, generals, `zin_trait_*` new traits) belong to the characters slice, not this one.
- Country histories must name `zin_regional_<name>` in `load_focus_tree` (replacing the Long Peace tree) in the history slice.
- `focus_registry.json` is unchanged; the extra registry and arg-code files stand in until the mechanics land.
- The MCP focus inspector and script validator could not run in this session (no registered workspace); the compiler's checks, the keyword scan and the vanilla-text scan stand in. Compiled script constructs were checked against `documentation/effects_documentation.md` and `triggers_documentation.md`.
