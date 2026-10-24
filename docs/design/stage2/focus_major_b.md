# Integration note: major focus trees B (Mirolon, Gunwaith, Lerendor, Magical Forest)

Slice `focus_major_b`, 19 October 2026. The four trees are data only: the focus compiler (`tools/content/modules/focus_compiler.mjs`) already reads every file of `docs/design/focus/`, so **no build.mjs change is needed**. This slice adds no builder module.

## Files

| File | What |
| --- | --- |
| `docs/design/focus/mirolon.json`, `gunwaith.json`, `lerendor.json`, `magical_forest.json` | The trees (source of truth) |
| `tools/content/data/focus_registry_major_b.json` | Registry rows for every name of another owner that these trees reference (merged by `loadRegistry`, which reads `focus_registry_<slice>.json`). Remove a name when its module lands |
| `tools/content/focus_major_b.test.mjs` | 36 tests (well over 40 assertions): counts, ids, prerequisites, exclusives, positions, localisation complete, banned words, secrets, 20 negative cases. Appended to `tools/package.json` `test` |
| `tools/content/lib/focus_schema.mjs` | One change, see "Compiler change" |

No new focus icon, event picture or sprite is needed: every key is in the icon catalog and `presentation-cells.json`. **Art needs: none.** (Mirolon and the others use only existing pictures; the Magical Forest spec's later `elven_moot` and `dragon_roosts` pictures are not used, the events use `generic_court` and `generic_wilds`.)

## Counts

| Tree | Focuses | Spirits | Events | Tree effects | Tree triggers | Opinion modifiers | Raw blocks |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `mirolon` | 83 | 27 | 12 | 2 | 1 | 0 | 6 |
| `gunwaith` | 116 | 28 | 7 | 4 | 2 | 2 | 5 |
| `lerendor` | 127 | 31 | 31 | 7 | 5 | 4 | 10 |
| `magical_forest` | 121 | 30 | 20 | 11 | 3 | 0 | 10 |

Events compile to `zin_<tree>.<n>` with the spec numbers. Lerendor has five events beyond the spec (`.27` to `.31`, the "refused" counterparts of the result events `.21` to `.25`, so a refusal shows its own text).

## Compiler change (one, backwards compatible)

`focus_schema.mjs`: variable names in the `variable` condition and effect may carry a `global.` prefix (`RE.variable`). Several mechanics keep their meters in **global** variables (`zin_west_truce`, `zin_gathering_dark`, `zin_eindil_stage`, `zin_elves_kinship` and the other elves meters), and the compiler wrote `check_variable = { zin_west_truce > 69 }`, which reads a country variable. The prefix compiles unchanged to `check_variable = { global.zin_west_truce > 69 }`. Other trees that read global meters can use it.

## Names from other owners (all in the registry file)

Checked against their owner specs. Effects: `zin_mirolon_add_proof`, `_add_passes`, `_scorch`, `_raise_resistance`, `_restore`; `zin_volgan_add_veil`; `zin_west_add_{truce,unity,fleet,strain,grudge,grudge_all}`, `_set_route`, `_call_pledges`, `_convene_council`, `_launch_crossing`, `_launch_relief`, `_choose_parim`, `_grant_surrenders`; `zin_eindil_add_regard`, `_add_renown`, `_join_coalition`; `zin_lost_cause_add_strength`; `zin_leren_*` (standing, cohesion, lean, toll level, withdraw, supremacy, far shore, clear grievances); `zin_elves_*` (kinship, rivalry, grievance, bond, pass watch, goodwill, pilgrim roads, close wall roads, raise kindred, sync refusal, focus dragon pact); `zin_afrit_add_footholds`, `zin_aenor_event_for_parim`, `zin_diplo_lift_refusal`, `zin_economy_add_gold`, `zin_world_add_gathering_dark`. Triggers and events are listed in the registry file; the key sites are `zin_is_site_{grey_ford,sonargur,strait_north,elven_wall,mirolon_passes}`. The foundation's generated triggers are used for the AI: `zin_rules_is_historical`, `zin_rules_is_free`, `zin_rules_ai_branch_leren_{historical,honour,supremacy}`, `zin_rules_ai_branch_elves_march`, and the Western Crossing's `zin_west_historical`. **The rules module must generate `zin_rules_ai_branch_leren_historical`, `_honour` and `_supremacy`** (the Lerendor rule options are `historical`, `honour`, `supremacy`).

Names used only inside `raw` blocks (not checked by the compiler; the owners must write them): `zin_aenor_is_realm`, `zin_diplo_is_dark_power`, `zin_elves_is_magical_realm`, `zin_elves_is_rift_realm`, `zin_eindil_is_host`, `zin_world_is_dragon_keeper`, `zin_leren_is_dark_shore`, `zin_leren_claim_r_en`, `zin_leren_offer_protection`, `zin_leren_add_lean`, `zin_leren_lean`, `zin_court_corruption`, `zin_is_site_parim`, `zin_is_site_rift_west`, `zin_is_region_{west_lands,middle_lands,magical_lands}`, the opinion modifiers `zin_opinion_grey_ford_truce`, `zin_west_ford_blood`, `zin_west_fought_beside`, the dynamic modifier `zin_elves_wandering_paths`, the flag `zin_east_coalition_leader`, the ship equipment `zin_hull_galley_1`. Also the scripted localisation `zin_loc_eindil`, used in three Magical Forest descriptions.

**Characters** (recruited by `recruit_character` in tree-declared effects or raw; the characters module must define them): `zin_mirolon_hadric`, `zin_mirolon_selda`, `zin_gunwaith_ostra`, `zin_lerendor_maelis`, `zin_lerendor_brannoc`, `zin_lerendor_ostvar`, `zin_lerendor_hesk`, `zin_magical_forest_perlan`, `zin_magical_forest_ithrandel`. The trees add no character.

**Faction template** `zin_faction_warden_league` and its joining rule (diplomacy), idea `zin_west_aenoran_gold`, opinion modifier `zin_dominion_mirolon_friendship` (Volgan dominion module).

## Spec conflicts and choices

- **Registry clash (other slice):** `focus_registry_regional_d.json` lists `zin_gunwaith_war_thanes` under `ideas`, but that spirit is written by the Gunwaith tree (spec: spirits `kings_peace`, `war_thanes`), so the compiler reports `collision_mechanic` for it when all trees are built together. The regional_d owner should remove that row. Not edited here.
- **Flags of the Lerendor tree:** the tree spec names `zin_lerendor_*` flags, the mechanic reads `zin_leren_*` ("set by the Lerendor tree"). Both are set by the same focus (`compact_open`, `envoys`, `tariff`, `marriages`, `open_compact`, `one_banner`, `dark_shore`, `dark_protection`, `full_dues`, `iron_toll`, `seas_closed`).
- **Mirolon, scouts lost:** the tree spec says a 20 % chance of `zin_dominion.6` on "Send more scouts"; the mechanic's decision says 30 %. The event uses 20 %; the proof and veil changes still apply (the spec said "instead").
- **Banned or glossary words in names** (the spec names fail the text scan): Storm Pilots is Storm Helmsmen; Hill Fighters of the North is Hill-Warriors of the North; The Merchant Republics is The Merchant Free Towns; Marines of the Leren Shore is Sea-Soldiers of the Leren Shore; Guard the Convoy Lanes is Guard the Merchant Lanes; The Galley Squadrons is The Galley Fleets; The Joint Squadron is The Joint Fleet; The Chancellor of Lerendor's North is The Warden of the Northern Seal; Pilots of the Narrow Strait is Steersmen of the Narrow Strait; The Dark Shore Protectorate is The Dark Shore Shelter; A Northern Industry is A Northern Craft; Leaf-Steel is Leaf-Iron. Focus keys are unchanged.
- **Raw blocks:** the specs expected none (Gunwaith, Lerendor, Magical Forest) or three (Mirolon). The compiler has no form for `recruit_character`, opinion removal, neighbour loops, `add_to_war`, dynamic modifiers or `is_government_in_exile`, so those are raw: 6, 5, 10 and 10, all within the limit of ten. Each raw sits in a tree-declared effect or trigger where possible.
- **War goals without states:** the compiler's `wargoal` cannot name states, and `take_state_focus` needs them. *Drive Out the Temple* uses `annex_everything` on the Worshipdom (three states); *Carry the War Across the Rift* uses `puppet_wargoal_focus` on the coalition leader (raw). Neither can be taken under the historical rule.
- **Scoped triggers:** `zin_lerendor_dark_shore_war` is evaluated in Goldoroth's scope and `zin_lerendor_r_en_friendly` in R'en's (used through `for_country` and raw), because a tree trigger cannot name a country. The dark-shore tribute opens claims on any Dark Lands coast realm at war with another one (wider than "Goldoroth against Dondor or Blackton").
- **AI weights written as meters** ("100 minus resolve", "2 times average council regard", "50 plus standing") are stepped modifiers on the same variables. "hist x" uses the foundation's historical triggers. PLAUSIBLE halving (Magical Forest) is not modelled separately.
- `zin_lerendor_lay_down_ships` calls `add_equipment_production` for `zin_hull_galley_1` without `creator`; confirm in the Linux run that the engine accepts that, or add a creator.
- Temporary variables are forwarded to other scopes with `ROOT.zin_arg_<name>` in `zin_lerendor_compact_each` and `zin_magical_forest_purge_footholds`; confirm in the Linux run. The dummy argument `target` of the first and of `zin_lerendor_dark_shore_tribute` exists only because the compiler counts a set `zin_arg_target` as a read.
- Gunwaith: the war-king and "Man from the Ice" wording stays inside the two `allow_branch` branches and in events that fire only after their flags; the Magical Forest bearer texts use `[zin_loc_eindil]`. The hermitage and temple texts of branch 6 are neutral until the gated event `.16` (text gate `zin_afrit_revealed`).
- Mirolon text never places Dardan, names Afrit or Eindil, or states Volgan's fate.

## Open items

- No `focus_arg_codes_major_b.json` is needed: all keywords of this slice are declared by the tree effects, and `route`/`choice` come from the Western Crossing's rows in `focus_arg_codes.json`.
- The compiled tree replaces the interim Long Peace tree for the four countries; `vanilla_removal.mjs` needs no change here beyond the integrator's existing treatment.
- The HOI4 Agent Tools validator could not run in this session (no registered workspace); the focus compiler's own checks and the tests above were the validation.
