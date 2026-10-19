# Shared Tree: Freeholds of the Dead Lands

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

The shared focus tree for the **6 tier C freeholds of the Dead Lands** (tree id `shared_dead_lands`, focus ids `zin_shared_dead_lands_<key>`, data file `docs/design/focus/shared_dead_lands.json`): small realms of men on the coasts and hills between Mirolon and Volgan's Nafeher. It plays [Volgan and the Southern Dominion](../../04_mechanics/volgan_southern_dominion.md) from a freehold's walls: keep the old quiet with Nafeher, stand with Mirolon's wardens, or wall in; live by the furnace lands' iron and essence; watch the storm coasts; and, if the storm takes them, survive as Volgan's client crown or Mirolon's ward until the storm lifts.

The tree is the **module library** for the Dead Lands tier B trees ([../regional/dead_lands.md](../regional/dead_lands.md)); modules L1 to L10 may be copied under new keys.

| Item | Value |
| --- | --- |
| Tree id | `shared_dead_lands` |
| Tier | C (shared) |
| Countries (6) | Mencnon, Bennen, Dra, Gelon, Luminor, Mirodor |
| Focuses | 47 (root and modules L1 to L10) |
| Width | columns 0 to 29, rows 0 to 8 |
| Events | namespace `zin_shared_dead_lands` |
| Spirits | `zin_shared_dead_lands_<key>` |

## Lore basis

**Established** (vault): the Dead Lands lie south of the Middle Lands; Volgan's authority does not extend automatically to independent realms; the region is storm-girt at sea and hot farther south; Volgan retakes Mirolon in the Fourth Age and marches north; his manifested body is destroyed and whether his spirit survives is open; Mirolon is his rival (working table). The start: Erdae seems at peace; nobody outside Mirolon watches Volgan.

**Proposed elsewhere and used here:** Volgan's strength, veil, client crowns and the Steward; Mirolon's proof, passes, the Warden League and `zin_mirolon_league_friend` (Mirolon tree event `zin_mirolon.4` already invites all six of these realms); the storm pulse and heat of the magic spec ([../../03_gameplay/04_magic_and_world_systems.md](../../03_gameplay/04_magic_and_world_systems.md)); the Houses of the First Light and footholds ([../../04_mechanics/afrit_hidden_council.md](../../04_mechanics/afrit_hidden_council.md): cap 3 for these realms of men; the Afrit start table does not name them yet, and this tree proposes a start of 1); the roster note that Luminor and Gelon stayed independent when Mirolon united with the Mirolon Forests.

**Proposed here:** every focus, spirit, event and number; the tree's own triggers and effects (Implementation). `zin_dominion_tributary_friend` is the regions spec's proposed flag (contract additions), shared with the Dead Lands tier B trees.

**Kept open:** what remains of Volgan; the King of Demons; Dardan's place; the relation of Zol's dead to Volgan's. Texts say only that "the throne in Nafeher does not answer" after the body breaks. No text names Afrit or Eindil; the Houses are healers and bread.

## Design

### The peaceful start

On 1 Thaw 4A 1748 every available focus is about the hall, the furnace lands, walls, harbours, envoys and healers. Nothing creates a war goal, a claim or a war. The war module (L9) needs `at_war`; the aftermath module (L10) needs `zin_volgan_body_destroyed`; the client and ward modules need the realm to be someone's subject.

### Who sees what

| Opens by | Condition | Module |
| --- | --- | --- |
| Region | every country of the tree | Root, L1, L2, L7, L9 |
| Overlord: free | Volgan exists and ROOT is not Volgan's subject | L3 Nafeher's Shadow |
| Coast | check `zin_shared_dead_lands_is_coastal` | L4 Storm Coasts |
| Overlord: Volgan | `subject_of: Volgan` | L5 A Client Crown |
| Overlord: Mirolon | `subject_of: Mirolon` | L6 Under the Wardens |
| Ideology | Shadow / Light / Dominion (Wild is the start) | L8 The Old Customs |
| Story | `zin_volgan_body_destroyed` | L10 When the Storm Lifts |

Every `allow_branch` head repeats its condition in `available`. The engine evaluates `allow_branch` at game start and again when `mark_focus_tree_layout_dirty` runs. The Dominion pulse (`zin_dominion.1`, every 30 days) runs `mark_focus_tree_layout_dirty = yes` for every country with `zin_region_dead_lands` (economy spec's region flag), so a freehold whose overlord or government changed sees the right branches within a month (dependency on the Volgan mechanic; requested there). The same pulse shows L10 within a month of the body breaking.

All six realms are men, Wild (`zin_wild_freeholds`, Freeholds) in `docs/design/countries.csv`. People branches are not needed today; if a released realm of another people takes this tree, it sees every module (no module assumes men).

### Text

Names use `[ROOT.GetName]` and `[ROOT.GetAdjective]`: "The Freehold of [ROOT.GetName]", "[ROOT.GetAdjective] Walls". Volgan's realm is "Nafeher"; his people "riders from Nafeher". Before `zin_volgan_marches` no text says Volgan is arming, only that "the storms over Nafeher have not lifted".

### Module map

| Module | Name | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| Root | The Freehold of [ROOT.GetName] | 14 | 0 | 1 | start | — |
| L1 | The Freehold | 0–3 | 1–3 | 5 | start | government spirits |
| L2 | Furnace Lands | 5–7 | 1–4 | 6 | start | industry |
| L3 | Nafeher's Shadow | 9–13 | 1–3 | 7 | free of Volgan | tribute (`zin_dominion_tributary_friend`), the Warden League, walls |
| L4 | Storm Coasts | 15–17 | 1–3 | 4 | coastal | navy, coastal forts |
| L5 | A Client Crown | 19–21 | 1–4 | 6 | Volgan's subject | autonomy, Volgan's strength |
| L6 | Under the Wardens | 23–25 | 1–3 | 4 | Mirolon's subject | Mirolon's passes |
| L7 | The Houses Come South | 27–29 | 1–2 | 3 | start | footholds |
| L8 | The Old Customs | 0–4 | 6 | 3 | ideology | government spirits |
| L9 | The Freehold at War | 9–11 | 6–8 | 4 | war | defence, resistance |
| L10 | When the Storm Lifts | 14–16 | 6–8 | 4 | body destroyed | autonomy, recovery |

### Notation used in the tables

- **Prerequisites:** `a + b` means a and b; `a / b` means a or b.
- **Shorthands:** **Strength ±n** = `for_country Volgan: call zin_volgan_add_dominion_strength(value = n)`. **Proof ±n** = `for_country Mirolon: call zin_mirolon_add_proof(value = n)`. **Passes ±n** = `for_country Mirolon: call zin_mirolon_add_passes(value = n)`. **Footholds ±n** = `call zin_afrit_add_footholds(value = n)` on ROOT. **Autonomy +r** = `call zin_shared_dead_lands_gain_autonomy(value = r)`. **Opinion X ±n (k) both ways** = `for_country X: call zin_shared_dead_lands_opinion_both_ways(modifier = k)`: X and ROOT both gain the tree's opinion modifier `zin_shared_dead_lands_<k>` toward each other. The compiler wraps every `for_country` effect in `if exists X`.
- **Avail:** the focus's `available` list. **Text:** what the focus description says. Country names in conditions and effects are resolved to tags by the compiler.
- **AI** is `ai.base` and its factors. "0; N when available" or "N when available" means `ai.base` N: the focus is gated by `available`, so it carries no weight before. **hist** = factor applied with `check zin_rules_is_historical`; **free** = `check zin_rules_is_free`.
- Spirit keys compile to `zin_shared_dead_lands_<key>`. Research categories are the warfare spec's `zin_cat_*` ([../../03_gameplay/01_warfare.md](../../03_gameplay/01_warfare.md)).
- No focus uses a `raw` block.

### Root

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_freehold` | The Freehold of [ROOT.GetName] | – | – | 14,0 | 70 | political_power 50; stability 0.02; event `freehold_hall` | 100 | `banner_plain` |

### L1. The Freehold

**Purpose:** who rules: the lord of the hall or the freeholders' moot. **Opens:** at start. **Mutual exclusions:** `the_lords_writ` / `the_freeholders_moot`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_lords_hall` | The Lord's Hall | the_freehold | – | 1,1 | 35 | political_power 25; stability 0.02 | 30 | `throne_gold` |
| `the_free_folk` | The Free Folk | the_freehold | – | 3,1 | 35 | stability 0.03; manpower 500 | 25 | `banner_plain` |
| `the_lords_writ` | The Lord's Writ | the_lords_hall / the_free_folk | the_freeholders_moot | 1,2 | 70 | add_spirit lords_writ | 20; hist ×1.5 | `seal_royal` |
| `the_freeholders_moot` | The Freeholders' Moot | the_lords_hall / the_free_folk | the_lords_writ | 3,2 | 70 | add_spirit freeholders_moot | 20 | `council_table` |
| `the_freehold_endures` | The Freehold Endures | the_lords_writ / the_freeholders_moot | – | 2,3 | 70 | political_power 75; stability 0.03 | 15 | `fort_wall` |

### L2. Furnace Lands

**Purpose:** a living from iron, stone and the essence vents of a hot land. **Opens:** at start.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `furnace_lands` | Furnace Lands | the_freehold | – | 6,1 | 70 | building industrial_complex 1 @capital | 35 | `ember_desert` |
| `essence_vents` | The Essence Vents | furnace_lands | – | 5,2 | 35 | add_spirit essence_vents_spirit | 20 | `ward_circle` |
| `cistern_roads` | Cistern Roads | furnace_lands | – | 7,2 | 35 | building infrastructure 1 @random_owned | 15 | `roads_paved` |
| `ash_forges` | Ash Forges | essence_vents | – | 5,3 | 35 | building arms_factory 1 @capital | 15 | `forge_anvil` |
| `stone_of_the_south` | Stone of the South | cistern_roads | – | 7,3 | 35 | add_spirit southern_stone | 15 | `quarry_stone` |
| `the_furnace_provides` | The Furnace Provides | ash_forges + stone_of_the_south | – | 6,4 | 70 | building industrial_complex 1 @random_owned; political_power 25 | 15 | `foundry_fire` |

### L3. Nafeher's Shadow

**Purpose:** the freehold's answer to the storm in the south. **Opens:** `allow_branch` and `available` on `the_southern_storm`: exists Volgan and not `subject_of: Volgan`. **Mutual exclusions:** `keep_the_old_quiet` / `the_wardens_friend` / `behind_our_walls`. **Mechanic:** the tribute event sets `zin_dominion_tributary_friend` (Volgan's AI leaves such realms alone before `zin_volgan_marches` and offers client terms after); the friendship event sets `zin_mirolon_league_friend` (Mirolon's *The Warden League* invites the realm).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_southern_storm` | The Storm over Nafeher | the_freehold | – | 11,1 | 35 | allow_branch and Avail: exists Volgan; not subject_of Volgan. event `rumours_from_nafeher` | 30 | `storm_veil` |
| `keep_the_old_quiet` | Keep the Old Quiet | the_southern_storm | the_wardens_friend, behind_our_walls | 9,2 | 35 | event_for Volgan `freehold_offers_tribute` | 15; ×2 with check zin_shared_dead_lands_borders_volgan | `tribute_chest` |
| `the_wardens_friend` | The Wardens' Friend | the_southern_storm | keep_the_old_quiet, behind_our_walls | 11,2 | 35 | Avail: exists Mirolon. event_for Mirolon `freehold_offers_friendship`; Proof +2 | 15; ×2 with check zin_shared_dead_lands_borders_mirolon; hist ×1.5 | `warden_crown` |
| `behind_our_walls` | Behind Our Walls | the_southern_storm | keep_the_old_quiet, the_wardens_friend | 13,2 | 35 | building bunker 2 @capital | 15 | `fort_wall` |
| `the_quiet_kept` | The Quiet Kept | keep_the_old_quiet | – | 9,3 | 35 | Avail: flag zin_dominion_tributary_friend. stability 0.05; political_power 50 | 20 | `olive_branch` |
| `join_the_warden_league` | Join the Warden League | the_wardens_friend | – | 11,3 | 35 | Avail: check zin_shared_dead_lands_league_open (flag zin_mirolon_league_friend; Mirolon leads a faction; ROOT in no faction). join_faction_of Mirolon | 30; hist ×2 | `banner_league` |
| `the_walls_hold` | The Walls Hold | behind_our_walls | – | 13,3 | 35 | add_spirit walls_hold | 15 | `pass_fort` |

### L4. Storm Coasts

**Purpose:** harbours on a coast that wrecks foreign fleets (the magic spec's storm pulse spares Dead Lands realms). **Opens:** `allow_branch` and `available` on `storm_coast_harbour`: check `zin_shared_dead_lands_is_coastal`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `storm_coast_harbour` | A Harbour on the Storm Coast | the_freehold | – | 16,1 | 35 | Avail: check zin_shared_dead_lands_is_coastal. building dockyard 1 @random_coastal | 25 | `harbour_lake` |
| `storm_wise_sailors` | Storm-Wise Sailors | storm_coast_harbour | – | 15,2 | 35 | navy_experience 10; research [zin_cat_galleys] 50% ×1 | 15 | `storm_sea` |
| `cliff_beacons` | Cliff Beacons | storm_coast_harbour | – | 17,2 | 35 | building coastal_bunker 1 @random_coastal | 15 | `beacon` |
| `the_storm_shelters_us` | The Storm Shelters Us | storm_wise_sailors + cliff_beacons | – | 16,3 | 70 | add_spirit storm_shelter | 15 | `storm_sea` |

### L5. A Client Crown

**Purpose:** life as Volgan's client crown (the Volgan spec's `zin_volgan_make_client`) after a lost war. **Opens:** `allow_branch` and `available` on `a_client_crown`: `subject_of: Volgan`. **Mutual exclusions:** `serve_the_dark_crown` / `wait_for_the_storm_to_pass`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `a_client_crown` | A Client Crown | the_freehold | – | 20,1 | 35 | allow_branch and Avail: subject_of Volgan. stability 0.05 | 100 | `dead_crown` |
| `tribute_to_nafeher` | Tribute to Nafeher | a_client_crown | – | 19,2 | 35 | political_power −25; Strength +1 | 20 | `tribute_chest` |
| `quiet_hearts` | Quiet Hearts | a_client_crown | – | 21,2 | 35 | add_spirit quiet_hearts_spirit | 20 | `confessional` |
| `serve_the_dark_crown` | Serve the Dark Crown | tribute_to_nafeher / quiet_hearts | wait_for_the_storm_to_pass | 19,3 | 70 | call zin_politics_add_drift(IDEOLOGY = shadow, VALUE = 3); Strength +1; political_power 50 | 10; free ×2 | `banner_black` |
| `wait_for_the_storm_to_pass` | Wait for the Storm to Pass | tribute_to_nafeher / quiet_hearts | serve_the_dark_crown | 21,3 | 70 | Autonomy +0.10; call zin_politics_add_drift(IDEOLOGY = light, VALUE = 2) | 20; hist ×2 | `storm_veil` |
| `the_crown_remembers` | The Crown Remembers | serve_the_dark_crown / wait_for_the_storm_to_pass | – | 20,4 | 35 | Avail: global_flag zin_volgan_body_destroyed. Autonomy +0.30; stability 0.05 | 100 when available | `crown_broken` |

### L6. Under the Wardens

**Purpose:** a freehold that has become Mirolon's ward (by Mirolon's victories or by choice). **Opens:** `allow_branch` and `available` on `the_wardens_banner`: `subject_of: Mirolon`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_wardens_banner` | Under the Wardens' Banner | the_freehold | – | 24,1 | 35 | allow_branch and Avail: subject_of Mirolon. stability 0.05; political_power 25 | 100 | `warden_crown` |
| `pass_levies` | Levies for the Passes | the_wardens_banner | – | 23,2 | 35 | Passes +3; manpower −500 | 30 | `pass_fort` |
| `lake_trade` | Trade with the Lake Towns | the_wardens_banner | – | 25,2 | 35 | add_spirit lake_trade_spirit | 20 | `lake_town` |
| `one_watch` | One Watch | pass_levies + lake_trade | – | 24,3 | 35 | Proof +2; add_spirit one_watch_spirit | 20 | `eye_watchful` |

### L7. The Houses Come South

**Purpose:** the Houses of the First Light reach even the furnace lands. **Opens:** at start; the choice opens from 4A 1749. **Mutual exclusions:** `houses_of_healing` / `our_own_healers`. **Mechanic:** footholds (start 1, cap 3).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_houses_come_south` | The Houses Come South | the_freehold | – | 28,1 | 35 | Avail: after 1749.1.1. event `houses_come_south` | 20 | `house_first_light` |
| `houses_of_healing` | Houses of Healing | the_houses_come_south | our_own_healers | 27,2 | 35 | Footholds +1; add_spirit houses_of_healing_spirit. Text: the Houses bring healers, bread and scribes | 20; hist ×1.5 | `alms_bread` |
| `our_own_healers` | Our Own Healers | the_houses_come_south | houses_of_healing | 29,2 | 35 | Footholds −1; add_spirit own_healers | 15 | `healer_herbs` |

### L8. The Old Customs

**Purpose:** a freehold whose government changed (a client crown drifting dark, a ward drifting light, a lord turned warlord). **Opens:** each head has its own `allow_branch` and `available` on the ruling ideology.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_night_cults` | The Night Cults | – | – | 0,6 | 35 | allow_branch and Avail: ideology shadow. add_spirit night_cults; war_support 0.05 | 50 | `banner_black` |
| `the_wardens_way` | The Wardens' Way | – | – | 2,6 | 35 | allow_branch and Avail: ideology light. add_spirit wardens_way | 50 | `warden_crown` |
| `a_warlords_rule` | A Warlord's Rule | – | – | 4,6 | 35 | allow_branch and Avail: ideology dominion. add_spirit warlords_rule; political_power 25 | 50 | `crown_iron` |

### L9. The Freehold at War

**Purpose:** a freehold caught in the storm. **Opens:** `available` on `the_freehold_at_war`: `at_war`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_freehold_at_war` | [ROOT.GetName] at War | – | – | 10,6 | 21 | Avail: at_war. war_support 0.10; manpower 1000 | 0; 300 when available | `sword_shield` |
| `hold_the_walls` | Hold the Walls | the_freehold_at_war | – | 9,7 | 21 | building bunker 1 @capital; timed_spirit hold_the_walls_spirit 180 | 100 | `fort_wall` |
| `the_freeholders_rise` | The Freeholders Rise | the_freehold_at_war | – | 11,7 | 21 | Avail: check zin_shared_dead_lands_core_occupied (an enemy controls a core state of ROOT). call zin_shared_dead_lands_raise_resistance | 100 when available | `banner_plain` |
| `the_freehold_returns` | The Freehold Returns | hold_the_walls / the_freeholders_rise | – | 10,8 | 35 | Avail: not at_war. stability 0.10 | 100 | `olive_branch` |

### L10. When the Storm Lifts

**Purpose:** the Dead Lands after Volgan's body breaks. **Opens:** `allow_branch` and `available` on `the_storm_lifts`: global_flag `zin_volgan_body_destroyed`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_storm_lifts` | The Storm Lifts | – | – | 15,6 | 35 | allow_branch and Avail: global_flag zin_volgan_body_destroyed. stability 0.05; event `the_storm_lifts`. Text: the storms over Nafeher thin; what remains of its master, no one living can say | 0; 300 when available | `silent_throne` |
| `return_of_the_exiles` | The Exiles Return | the_storm_lifts | – | 14,7 | 35 | Avail: exists Mirolon. Opinion Mirolon +15 (exiles_return) both ways; manpower 1000 | 50 | `exile_court` |
| `free_of_nafeher` | Free of Nafeher | the_storm_lifts | – | 16,7 | 35 | Avail: `subject_of: Volgan`. Autonomy +0.50 | 100 when available | `chain_broken` |
| `the_south_breathes` | The South Breathes | return_of_the_exiles / free_of_nafeher | – | 15,8 | 70 | political_power 75; stability 0.05 | 50 | `olive_branch` |

### Spirits

The "Removed" column is the spirit's `cancel` list: conditions under which the engine removes the idea (vanilla ideas support a `cancel` trigger). The focus compiler's spirit object gains an optional `"cancel"` list of conditions for this (decision F1, [../00_format_and_compiler.md](../00_format_and_compiler.md)).

| Key | Name | Modifiers | Added by | Removed (`cancel`) |
| --- | --- | --- | --- | --- |
| `lords_writ` | The Lord's Writ | `political_power_gain` 0.10, `stability_factor` 0.02 | `the_lords_writ` | – |
| `freeholders_moot` | The Freeholders' Moot | `stability_factor` 0.05, `production_speed_buildings_factor` 0.05 | `the_freeholders_moot` | – |
| `essence_vents_spirit` | The Essence Vents | `production_factory_efficiency_gain_factor` 0.05 | `essence_vents` | – |
| `southern_stone` | Stone of the South | `production_speed_buildings_factor` 0.05 | `stone_of_the_south` | – |
| `walls_hold` | The Walls Hold | `army_core_defence_factor` 0.10, `max_dig_in` 2 | `the_walls_hold` | – |
| `storm_shelter` | The Storm Shelters Us | `amphibious_invasion_defence` 0.25, `naval_detection` 0.10 | `the_storm_shelters_us` | – |
| `quiet_hearts_spirit` | Quiet Hearts | `resistance_target` −0.10, `stability_factor` 0.03 | `quiet_hearts` | not subject_of Volgan |
| `lake_trade_spirit` | Trade with the Lake Towns | `trade_opinion_factor` 0.10 | `lake_trade` | not subject_of Mirolon |
| `one_watch_spirit` | One Watch | `army_intel_factor` 0.10, `army_core_defence_factor` 0.05 | `one_watch` | not subject_of Mirolon |
| `houses_of_healing_spirit` | Houses of Healing | `monthly_population` 0.05, `stability_factor` 0.02 | `houses_of_healing` | – |
| `own_healers` | Our Own Healers | `drift_defence_factor` 0.10, `army_org_factor` 0.02 | `our_own_healers` | – |
| `night_cults` | The Night Cults | `war_support_factor` 0.05, `stability_factor` −0.03 | `the_night_cults` | not ideology shadow |
| `wardens_way` | The Wardens' Way | `army_core_defence_factor` 0.05, `stability_factor` 0.03 | `the_wardens_way` | not ideology light |
| `warlords_rule` | A Warlord's Rule | `war_support_factor` 0.05, `political_power_gain` 0.05 | `a_warlords_rule` | not ideology dominion |
| `hold_the_walls_spirit` | Hold the Walls | `army_defence_factor` 0.10 | `hold_the_walls` | timed, 180 days |

Every modifier above exists in the 1.19.3 modifier documentation (checked 19 October 2026). Each spirit's icon is the icon key of the focus that adds it (`GFX_idea_zin_<key>`).

### Events (namespace `zin_shared_dead_lands`)

| # | Key | Title | To | Trigger | Picture | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `freehold_hall` | The Hall of [ROOT.GetName] | ROOT | Root | `generic_court` | "The lord speaks." (political_power 25; AI 50) / "The freeholders speak." (stability 0.02; AI 50) |
| 2 | `rumours_from_nafeher` | The Storm over Nafeher | ROOT | The Storm over Nafeher | `dead_lands_storm` | One option. Text: the storms over Nafeher have not lifted in a year; riders from the south buy iron and ask no prices |
| 3 | `freehold_offers_tribute` | Tribute from [FROM.GetName] | Volgan | Keep the Old Quiet | `dead_lands_storm` | "The quiet holds." (call `zin_shared_dead_lands_accept_tribute`: non-aggression pact with FROM; Volgan +25 political power; FROM −50 political power; FROM country flag `zin_dominion_tributary_friend`; AI 80) / "Nafeher takes no gifts." (AI 20) |
| 4 | `freehold_offers_friendship` | Friendship from [FROM.GetName] | Mirolon | The Wardens' Friend | `mirolon_passes` | "Stand together." (for_country FROM: flag `zin_mirolon_league_friend`; Opinion FROM +15 (wardens_friends) both ways; AI 80) / "We keep our own counsel." (AI 20) |
| 5 | `houses_come_south` | The Houses Come South | ROOT | The Houses Come South | `houses` | One option. Text: healers and scribes of the Houses of the First Light ask to open a house of healing; they bring bread and ask little |
| 6 | `the_storm_lifts` | The Storm Lifts | ROOT | The Storm Lifts | `volgan_broken` (gate `zin_volgan_body_destroyed`; the focus needs the flag) | One option. The text keeps Volgan's fate open: "The storms over Nafeher thin. What remains of its master, no one living can say." |

Every picture is an existing catalog key; no new picture is requested.

## Implementation

### Builder

The tree is data, compiled by the focus compiler module `tools/content/modules/focus_compiler.mjs` ([../00_format_and_compiler.md](../00_format_and_compiler.md)) inside `tools/content/build.mjs`, and written in the builder's one transaction through `tools/content/apply.mts` (shared atomic rewrite engine). Nothing is hand-edited. The compiled tree replaces the interim "Long Peace" tree (`zin_long_peace_*`, the `default = yes` tree in `common/national_focus/zin_interim_default.txt`, written today by `tools/content/modules/vanilla_removal.mjs`) for these six countries: the compiled tree's `country` block gives each of their tags a positive factor.

### Files

| Path | Written by | Content |
| --- | --- | --- |
| `docs/design/focus/shared_dead_lands.json` | data (source of truth) | Tree data: `"id": "shared_dead_lands"`, `"tier": "shared"`, the 6 countries, the opinion modifiers below |
| `common/national_focus/zin_shared_dead_lands.txt` | `focus_compiler.mjs` | Compiled tree |
| `common/ideas/zin_focus_shared_dead_lands.txt` | `focus_compiler.mjs` | Spirits |
| `events/zin_shared_dead_lands.txt` | `focus_compiler.mjs` | Events 1 to 6 |
| `common/scripted_triggers/zin_shared_dead_lands.txt`, `common/scripted_effects/zin_shared_dead_lands.txt` | `focus_compiler.mjs` | Tree triggers and effects below |
| `common/opinion_modifiers/zin_shared_dead_lands.txt` | `focus_compiler.mjs` (`opinion_modifiers` block, F1) | Tree opinion modifiers below |
| `localisation/english/zin_focus_shared_dead_lands_l_english.yml` | `focus_compiler.mjs` | Text, UTF-8 with BOM |

**Format.** The tree uses two compiler blocks of decision F1: the optional `"cancel"` list on a spirit (compiled to the idea's `cancel` trigger) and the tree-level `"opinion_modifiers"` block (compiled to `common/opinion_modifiers/zin_<tree>.txt`, ids `zin_<tree>_<key>`).

`raw` blocks: none.

### Opinion modifiers

| Id | Value | Decay | Use |
| --- | ---: | --- | --- |
| `zin_shared_dead_lands_wardens_friends` | +15 | 0.25 a month | Mirolon and a freehold, both ways (event 4) |
| `zin_shared_dead_lands_exiles_return` | +15 | 0.5 a month | Mirolon and a freehold, both ways (*The Exiles Return*) |

### Tree-declared scripted triggers and effects

The compiler writes Volgan's and Mirolon's tags into these bodies from the roster.

| Name | Kind | Scope | Does / true when |
| --- | --- | --- | --- |
| `zin_shared_dead_lands_is_coastal` | trigger | country | `any_owned_state = { is_coastal = yes }` |
| `zin_shared_dead_lands_borders_volgan` | trigger | country | `any_neighbor_country = { tag = <Volgan> }` |
| `zin_shared_dead_lands_borders_mirolon` | trigger | country | `any_neighbor_country = { tag = <Mirolon> }` |
| `zin_shared_dead_lands_league_open` | trigger | country | `has_country_flag = zin_mirolon_league_friend`, `<Mirolon>` exists, `<Mirolon> = { is_faction_leader = yes }`, `is_in_faction = no` |
| `zin_shared_dead_lands_core_occupied` | trigger | country | `any_core_state = { controller = { has_war_with = ROOT } }` |
| `zin_shared_dead_lands_gain_autonomy` (`value`) | effect | ROOT | `if = { limit = { is_subject = yes } add_autonomy_ratio = { value = $value$ } }` |
| `zin_shared_dead_lands_raise_resistance` | effect | ROOT | `every_core_state = { limit = { controller = { has_war_with = ROOT } } add_resistance = 15 }` |
| `zin_shared_dead_lands_opinion_both_ways` (`modifier`) | effect | the other country | `add_opinion_modifier = { target = ROOT modifier = zin_shared_dead_lands_$modifier$ } ROOT = { add_opinion_modifier = { target = PREV modifier = zin_shared_dead_lands_$modifier$ } }` |
| `zin_shared_dead_lands_accept_tribute` | effect | Volgan (event 3) | `diplomatic_relation = { country = FROM relation = non_aggression_pact active = yes }`; `add_political_power = 25`; `FROM = { add_political_power = -50 set_country_flag = zin_dominion_tributary_friend }` |

Every engine effect and trigger named here (`is_coastal`, `any_neighbor_country`, `is_faction_leader`, `is_in_faction`, `any_core_state`, `every_core_state`, `has_war_with`, `add_autonomy_ratio`, `add_resistance`, `add_opinion_modifier`, `diplomatic_relation`, `mark_focus_tree_layout_dirty`) exists in the 1.19.3 documentation.

### Names this tree uses from other specs

| Name | Kind | Owner |
| --- | --- | --- |
| `zin_volgan_add_dominion_strength`, `zin_mirolon_add_proof`, `zin_mirolon_add_passes`, `zin_volgan_make_client` (how a realm becomes a client crown), event `zin_dominion.1` | mechanic names | Volgan mechanic |
| `zin_dominion_tributary_friend` | country flag (contract additions, regions spec) | Volgan's AI reads it (requested in the Volgan mechanic) |
| `zin_mirolon_league_friend`, faction "The Warden League" (template `zin_faction_warden_league`, E3) | country flag, faction | Mirolon tree (its `zin_mirolon.4` already invites these six realms) |
| `zin_afrit_add_footholds` | effect | Afrit mechanic |
| `zin_politics_add_drift` | effect | ideologies and politics spec |
| `zin_volgan_marches`, `zin_volgan_body_destroyed` | story flags | Volgan |
| `zin_region_dead_lands` | country flag | economy spec |
| `zin_rules_is_historical`, `zin_rules_is_free` | rule wrappers | defines and rules spec |

### Data checks (compiler and build test)

1. Each of the 6 countries maps to this tree and no other.
2. No focus creates a war goal, a claim or a declaration of war.
3. Every `allow_branch` head repeats its condition in `available`.
4. The localisation check finds no "Afrit", no "Eindil", no statement of Volgan's fate, no King of Demons by name.

## AI

| Situation | Behaviour |
| --- | --- |
| Free realm, 4A 1748–1750 | Root, L1 (*The Lord's Writ*, hist ×1.5), L2, L3 head; then *The Wardens' Friend* (hist ×1.5) or *Keep the Old Quiet* for realms bordering Volgan |
| Coastal | L4 after L2's first two focuses |
| From 4A 1749 | L7, *Houses of Healing* (hist ×1.5) |
| Mirolon forms the Warden League | *Join the Warden League* (hist ×2) |
| Volgan's client | L5 (*Wait for the Storm to Pass*, hist ×2) |
| War | L9 first |
| Body destroyed | L10 at weight 300 |

Under PLAUSIBLE each "hist" factor f becomes 1 + (f − 1) ÷ 2; under FREE base weights apply. The compiler writes each hist factor as two AI modifiers: factor f with `check zin_rules_is_historical`, and factor 1 + (f − 1) ÷ 2 with `not check zin_rules_is_historical` and `not check zin_rules_is_free`.

## Acceptance

1. The compiler accepts `shared_dead_lands.json`: 47 focuses, unique keys and positions, every prerequisite above its focus, exclusives symmetric, days multiples of 7 within 1 to 20 weeks, every icon and event picture a catalog key, zero `raw` blocks. The HOI4 Agent Tools focus inspector and script validator report no errors in the staged files.
2. The coverage check maps each of the 6 countries to `shared_dead_lands` and to no other tree; none of them still shows the interim `zin_long_peace_*` tree.
3. On 1 Thaw 4A 1748: L5, L6, L8 and L10 are hidden for all six; L3 is visible for all six; no available focus declares war or claims.
4. In a scripted test, *Keep the Old Quiet* accepted by Volgan sets `zin_dominion_tributary_friend` on the realm and creates a non-aggression pact between them.
5. In a scripted test, a realm made Volgan's client crown (`zin_volgan_make_client`) sees L5 and loses L3 within 30 days (the next `zin_dominion.1` pulse).
6. After `zin_volgan_body_destroyed`, *Free of Nafeher* raises a client's autonomy by 50%, and no text states Volgan's fate.
7. Every modifier in the spirit table exists in the modifier documentation; every called effect and checked trigger exists in the staged files.
8. The isolated Linux run (one in-game year from phase 3 on) logs no error line that names a `zin_shared_dead_lands` file, focus, idea or event.

## Open questions

Each question proceeds on the labelled proposal. Owner-only questions are listed in [../../OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md).

1. **Luminor and Gelon.** *Resolved (proposed):* no extra lean to Mirolon. They stayed out of the union with the Mirolon Forests, so they weigh the wardens like any other freehold; Mirolon's own invitation (`zin_mirolon.4`) and the border factor above decide.
2. **Tribute to Nafeher** (owner: regions: dark, magical, dead, question 12). *Proceeding on:* free Dead Lands realms may buy Volgan's quiet before the march. The tribute is a private exchange; it costs Volgan no veil and says nothing of his arming.
3. **Mencnon** (owner: regions: dark, magical, dead, question 13). *Proceeding on:* no link between Mencnon and Hessa Mencnor, and no rename; no text of this tree joins the two names.
