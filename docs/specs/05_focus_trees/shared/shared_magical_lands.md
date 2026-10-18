# Shared Tree: Kin Realms of the Magical Lands

**Status:** Draft. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

The shared focus tree for the **15 tier C elven realms of the Magical Lands** (tree id `shared_magical_lands`, focus ids `zin_shared_magical_lands_<key>`, data file `docs/design/focus/shared_magical_lands.json`). One tree serves every small elven realm that is neither the Magical Forest ([../major/magical_forest.md](../major/magical_forest.md)) nor one of the five tier B realms ([../regional/magical_lands.md](../regional/magical_lands.md)). It plays the elves mechanic ([../../04_mechanics/elves_wall_and_dragons.md](../../04_mechanics/elves_wall_and_dragons.md)) from a kin realm's seat: a council of houses, elder groves, the Kinship and the Kindred, the Refusal and the Wanderers, and, where the map puts the realm, the Wall, the pilgrim roads, the rift shore, the black north or Dragon Mountain.

The tree is the **module library** for the Magical Lands tier B trees: modules M1 to M13 may be copied under new keys ([../01_tiers_and_coverage.md](../01_tiers_and_coverage.md)).

| Item | Value |
| --- | --- |
| Tree id | `shared_magical_lands` |
| Tier | C (shared) |
| Countries (15) | Luv-zhise, Lengoli, Filion, Kingdom, Ossa, Heron, Nolivorak, Perloia, Endelond, Greenland, Teste, Dulo-Dulo, Sacomananos, Velakton, Lusteli |
| Focuses | 55 (root and modules M1 to M13) |
| Width | columns 0 to 31, rows 0 to 9 |
| Events | namespace `zin_shared_magical_lands` |
| Spirits | `zin_shared_magical_lands_<key>` |

## Lore basis

**Established** (vault): the elves of the Magical Lands were never conquered, not even by Elzon; after Edran's folly the elven kingdoms sent no armies to help men, and this must not become a new alliance in the final invasion; individuals, healers and independent figures may cooperate across peoples; elves defended their own lands through the Third Age. The Magical Lands lie east of the Middle Lands; a long rift sea separates them from the East Lands. Dragons come from Dragon Mountain and form no country; elven powers command them. The Great Wall separates the Middle Lands from the Magical Lands (owner). An eastern coalition crosses seas and mountain approaches to threaten the Magical Lands in the final war. Varner is a Lesser Spirit of the Magical Lands.

**Proposed elsewhere and used here:** the Wall Accord (vault chronology); the pilgrim roads and the Worshipdom's hermitage; every mechanic of the elves spec (kinship, the Kindred, the Wall grievance, the Wanderers, pilgrim-road policy, the roost bond, the eastern invasion response); `zin_elves_the_old_refusal`.

**Proposed here:** every focus, spirit, event and number; the trigger `zin_shared_magical_lands_faces_the_mistake`.

**Kept open:** where Varner is; whether the black areas of the Magical Lands sheet belong to Zol's Mistake; who keeps Dragon Mountain; the mycids' polity (no mycid content until the owner places the Mushroom Forest); how the elves fare against the eastern invasion. No text says the elves will march. Before `zin_afrit_revealed` the Deliverer is `[zin_loc_deliverer]` and his hermitage is a hermitage.

## Design

### The peaceful start

On 1 Thaw 4A 1748 every available focus concerns councils, groves, the kin, healers, customs, pilgrims, sails and wardens. No focus creates a war goal, a claim or a war, joins a human faction, or sets `zin_refusal_lifted`. The war module (M12) opens only when a non-elven enemy holds the realm's state or the eastern invasion strikes it. The tree has no war goal at all.

### Who sees what

| Opens by | Condition | Module |
| --- | --- | --- |
| Region | every country of the tree | Root, M1, M2, M3, M4, M13 |
| Map: the Wall | check `zin_elves_is_wall_realm` | M5 Customs at the Wall |
| Map: pilgrim roads | check `zin_elves_is_pilgrim_road_realm` | M6 Pilgrims on Our Roads |
| Coast: the rift | check `zin_elves_is_rift_realm` (Luv-zhise, Lengoli, Lusteli per the elves spec) | M7 The Rift Shore |
| Coast or border: the black north | check `zin_shared_magical_lands_faces_the_mistake` | M8 The Black North |
| Map: Dragon Mountain | check `zin_world_is_dragon_keeper` | M9 Keepers of the Roosts |
| Overlord | `is_subject: true` | M10 Under a Foreign Banner |
| Ideology | Dominion / Wild / Shadow (Light is the start) | M11 The Old Customs |
| People | `people: elves` on the root's children M3 and M4 | A released non-elven country in this tree sees neither the Kinship nor the Wanderers |
| War | `at_war` with a non-elf holding the realm's state, or the eastern invasion | M12 The Woods Defended |

Every `allow_branch` head repeats its condition in `available`. The elves' monthly runner (`zin_elves_monthly`) calls `mark_focus_tree_layout_dirty` for realms whose subject status or government changed (dependency on the mechanic spec).

### Text

Names use `[ROOT.GetName]` and `[ROOT.GetAdjective]`: "The Council of [ROOT.GetName]", "[ROOT.GetAdjective] Longbows". Pilgrim texts call the Deliverer `[zin_loc_deliverer]` and the Worshipdom "the hermitage in the Zilin Hills". Wanderer texts speak of healers and wardens, never of armies.

### Module map

| Module | Name | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| Root | The Council of [ROOT.GetName] | 17 | 0 | 1 | start | — |
| M1 | Council of Houses | 0–3 | 1–3 | 5 | start | government spirits |
| M2 | Elder Groves | 5–7 | 1–4 | 6 | start | industry, essence |
| M3 | The Kinship | 9–11 | 1–4 | 5 | start (elves) | `zin_elves_kinship`, the Kindred, Nolorim's watch |
| M4 | Healers, Not Hosts | 12–14 | 1–3 | 4 | start (elves) | `zin_elves_wanderers_extra`, the Refusal |
| M5 | Customs at the Wall | 15–17 | 1–3 | 4 | wall realm | `zin_elves_wall_grievance` |
| M6 | Pilgrims on Our Roads | 19–21 | 1–3 | 4 | pilgrim-road realm | `zin_elves_set_pilgrim_roads`, footholds |
| M7 | The Rift Shore | 22–24 | 1–4 | 5 | rift realm | coastal forts, forewarning |
| M8 | The Black North | 25 | 1–3 | 3 | faces the Mistake | `zin_zol_forewarned` |
| M9 | Keepers of the Roosts | 27 | 1–3 | 3 | the Keeper | `zin_elves_roost_bond`, guarded roosts |
| M10 | Under a Foreign Banner | 0–2 | 6–7 | 3 | subject | autonomy |
| M11 | The Old Customs | 4–6 | 6 | 3 | ideology | government spirits |
| M12 | The Woods Defended | 9–11 | 6–9 | 5 | war | defence, kinship |
| M13 | House Wardens | 29–31 | 1–3 | 4 | start | army |

### Notation used in the tables

- **Prerequisites:** `a + b` means a and b; `a / b` means a or b.
- **Shorthands:** **Kinship ±n** = `call zin_elves_add_kinship(value = n)`; **Grievance ±n** = `call zin_elves_add_wall_grievance(value = n)`; **Bond ±n** = `call zin_elves_add_roost_bond(value = n)`; **Pass watch ±n** = `call zin_elves_add_pass_watch(value = n)`; **Goodwill X** = `call zin_elves_goodwill(target = X)`; **Roads n** = `call zin_elves_set_pilgrim_roads(value = n)`; **Footholds ±n** = `call zin_afrit_add_footholds(value = n)` on ROOT; **Join the Kindred** = `call zin_elves_join_kindred` (proposed elves effect).
- **AI** is `ai.base` and its factors; **hist** = `check zin_rules_is_historical`; **free** = `check zin_rules_is_free`.
- Spirit keys compile to `zin_shared_magical_lands_<key>`. Research categories are the warfare spec's `zin_cat_*`.

### Root

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `council_of_the_grove` | The Council of [ROOT.GetName] | – | – | 17,0 | 70 | political_power 50; stability 0.02; event `council_meets` | 100 | `elven_council` |

### M1. Council of Houses

**Purpose:** the realm's council, old houses or open. **Opens:** at start. **Mutual exclusions:** `the_old_houses` / `the_open_houses`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `elders_speak` | The Elders Speak | council_of_the_grove | – | 1,1 | 35 | stability 0.03; political_power 25 | 30 | `book_lore` |
| `the_young_houses` | The Young Houses | council_of_the_grove | – | 3,1 | 35 | research [zin_cat_wards] 50% ×1 | 20 | `tree_silver` |
| `the_old_houses` | The Old Houses | elders_speak / the_young_houses | the_open_houses | 1,2 | 70 | add_spirit old_houses | 20; hist ×2 | `forest_ancient` |
| `the_open_houses` | The Open Houses | elders_speak / the_young_houses | the_old_houses | 3,2 | 70 | add_spirit open_houses | 15 | `elven_council` |
| `a_council_in_harmony` | A Council in Harmony | the_old_houses / the_open_houses | – | 2,3 | 70 | political_power 75; stability 0.03 | 15 | `council_table` |

### M2. Elder Groves

**Purpose:** the realm's wealth: groves, wellsprings, timber. **Opens:** at start.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `elder_groves` | Elder Groves of [ROOT.GetName] | council_of_the_grove | – | 6,1 | 70 | building industrial_complex 1 @random_owned | 35 | `forest_ancient` |
| `wellspring_keepers` | Wellspring Keepers | elder_groves | – | 5,2 | 35 | add_spirit wellspring_keepers | 20 | `tree_silver` |
| `grove_roads` | Grove Roads | elder_groves | – | 7,2 | 35 | building infrastructure 1 @random_owned | 15 | `roads_paved` |
| `essence_workshops` | Essence Workshops | wellspring_keepers | – | 5,3 | 35 | building industrial_complex 1 @random_owned | 15 | `workshop_tools` |
| `timber_of_the_old_woods` | Timber of the Old Woods | grove_roads | – | 7,3 | 35 | add_spirit old_woods_timber | 15 | `timber_mill` |
| `the_groves_provide` | The Groves Provide | essence_workshops + timber_of_the_old_woods | – | 6,4 | 70 | add_spirit groves_provide; building industrial_complex 1 @random_owned | 15 | `market_stalls` |

### M3. The Kinship

**Purpose:** the realm among its kin. **Opens:** `allow_branch` on `kin_envoys`: people elves. **Mechanic:** kinship, the Elder Moot's weight, Nolorim's pass watch, the Kindred of the Woods (elves helping elves; the Refusal untouched).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `kin_envoys` | Envoys to the Kin | council_of_the_grove | – | 10,1 | 35 | allow_branch: people elves. Kinship +3; Goodwill Magical Forest (if it exists) | 30 | `envoy` |
| `answer_the_elder_moot` | Answer the Elder Moot | kin_envoys | – | 9,2 | 35 | Avail: global variable zin_elves_kinship above 39. Kinship +5; political_power 25 | 20 | `elven_council` |
| `wardens_to_nolorim` | Wardens to Nolorim | kin_envoys | – | 11,2 | 35 | Avail: exists Nolorim. Pass watch +5; Kinship +2; manpower −500 | 15; ×3 if global_flag zin_eastern_invasion | `mountain_pass` |
| `shared_songs_of_the_kin` | Shared Songs of the Kin | answer_the_elder_moot / wardens_to_nolorim | – | 10,3 | 35 | research [zin_cat_wards] 50% ×1; Kinship +2 | 15 | `hymn_choir` |
| `stand_with_the_kindred` | Stand with the Kindred | shared_songs_of_the_kin | – | 10,4 | 35 | Avail: check zin_elves_kindred_exists; ROOT not in the Kindred. Join the Kindred | 0; 300 when available | `banner_league` |

### M4. Healers, Not Hosts

**Purpose:** the Refusal as the elves keep it: individuals help, armies stay home. **Opens:** `allow_branch` on `healers_of_the_house`: people elves. **Mechanic:** the Wanderer decisions (Send Healers and Loremasters; Send Wardens to a Friend in Need).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `healers_of_the_house` | Healers of [ROOT.GetName] | council_of_the_grove | – | 13,1 | 35 | allow_branch: people elves. flag zin_elves_wanderers_extra; political_power 25 | 20 | `healer_herbs` |
| `loremasters_abroad` | Loremasters Abroad | healers_of_the_house | – | 12,2 | 35 | research [zin_cat_wards] 50% ×1; political_power 25 | 15 | `book_lore` |
| `the_refusal_kept` | The Refusal Kept | healers_of_the_house | – | 14,2 | 35 | Avail: check zin_elves_refusal_question_open. stability 0.05; Kinship +3 | 10; hist ×5 | `banner_plain` |
| `wardens_for_friends` | Wardens for Friends | loremasters_abroad / the_refusal_kept | – | 13,3 | 35 | Avail: global_flag zin_war_of_last_crowns. political_power 50; army_experience 5 | 30 | `ranger_cloak` |

### M5. Customs at the Wall

**Purpose:** the Wall's daily quarrel with Aenor's customs men. **Opens:** `allow_branch` on `customs_at_the_wall`: check `zin_elves_is_wall_realm`. **Mechanic:** `zin_elves_wall_grievance`; the realm may call a Wall Moot through the mechanic's decision.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `customs_at_the_wall` | Customs at the Wall | council_of_the_grove | – | 16,1 | 35 | Grievance −3; political_power 25 | 25 | `charter_wall` |
| `traders_at_kingson` | Traders at Kingson | customs_at_the_wall | – | 15,2 | 35 | Avail: exists Kingson; not at_war_with Kingson. call zin_shared_magical_lands_opinion(who = Kingson, modifier = gate_traders) both ways; add_spirit wall_traders | 15 | `market_stalls` |
| `a_word_at_the_gate` | A Word at the Gate | customs_at_the_wall | – | 17,2 | 35 | Avail: global variable zin_elves_wall_grievance above 29. Grievance −5 | 15 | `scroll_treaty` |
| `wall_roads_open` | The Wall Roads Open | traders_at_kingson / a_word_at_the_gate | – | 16,3 | 35 | Avail: not global_flag zin_elves_wall_roads_closed. add_spirit wall_roads; Grievance −3 | 15 | `traders_road` |

### M6. Pilgrims on Our Roads

**Purpose:** the pilgrim roads to the Zilin Hills. **Opens:** `allow_branch` on `pilgrims_on_our_roads`: check `zin_elves_is_pilgrim_road_realm`. **Mutual exclusions:** `keep_the_roads_open` / `toll_the_pilgrims`. **Mechanic:** policy 2 (open; a foothold every 12 months within the elven cap of 2), 1 (tolled), 0 (closed; footholds −1).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `pilgrims_on_our_roads` | Pilgrims on Our Roads | council_of_the_grove | – | 20,1 | 35 | event `pilgrims_pass` | 20 | `courier_pilgrim` |
| `keep_the_roads_open` | Keep the Roads Open | pilgrims_on_our_roads | toll_the_pilgrims | 19,2 | 35 | Roads 2; stability 0.02 | 20; hist ×2 | `traders_road` |
| `toll_the_pilgrims` | Toll the Pilgrims | pilgrims_on_our_roads | keep_the_roads_open | 21,2 | 35 | Roads 1; political_power 25 | 10; ×2 if political power below 50 | `toll_house` |
| `the_temple_in_the_hills` | The Temple in the Hills | keep_the_roads_open / toll_the_pilgrims | – | 20,3 | 35 | Avail: global_flag zin_afrit_revealed. Roads 0; Footholds −1; stability 0.05 | 0; 100 when available | `hermitage_hills` |

### M7. The Rift Shore

**Purpose:** the rift coast that faces the East Lands. **Opens:** `allow_branch` on `watch_the_rift`: check `zin_elves_is_rift_realm`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `watch_the_rift` | Watch the Rift | council_of_the_grove | – | 23,1 | 70 | add_spirit rift_watch; navy_experience 5 | 30 | `lighthouse` |
| `shore_beacons` | Shore Beacons | watch_the_rift | – | 22,2 | 35 | building coastal_bunker 1 @random_coastal | 15 | `beacon` |
| `elven_sails` | [ROOT.GetAdjective] Sails | watch_the_rift | – | 24,2 | 35 | research [zin_cat_galleys] 50% ×1; building dockyard 1 @random_coastal | 10 | `warship_sail` |
| `rumours_across_the_rift` | Rumours Across the Rift | shore_beacons / elven_sails | – | 23,3 | 35 | Avail: after 1752.3.1 or global variable zin_gathering_dark above 29. event `rift_rumours` | 20 | `envoy` |
| `shore_levies` | Shore Levies | rumours_across_the_rift | – | 23,4 | 35 | manpower 2000; building coastal_bunker 1 @random_coastal | 10; ×5 with flag zin_shared_magical_lands_forewarned | `levy_muster` |

### M8. The Black North

**Purpose:** for realms whose coast or border faces Zol's Mistake (map question). **Opens:** `allow_branch` on `eyes_on_the_black_north`: check `zin_shared_magical_lands_faces_the_mistake`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `eyes_on_the_black_north` | Eyes on the Black North | council_of_the_grove | – | 25,1 | 35 | event `black_ships_seen` | 30 | `black_isles` |
| `black_shore_wardens` | Wardens of the Black Shore | eyes_on_the_black_north | – | 25,2 | 35 | building coastal_bunker 1 @random_coastal; building bunker 1 @random_owned | 15 | `fort_wall` |
| `the_edge_of_the_woods` | The Edge of the Woods | black_shore_wardens | – | 25,3 | 35 | Avail: global_flag zin_zol_rising. add_spirit edge_of_the_woods | 0; 200 when available | `dead_ranks_far` |

### M9. Keepers of the Roosts

**Purpose:** only if the map makes this realm the Keeper of Dragon Mountain (open question; the elves spec proposes the Magical Forest). **Opens:** `allow_branch` on `roost_keepers`: check `zin_world_is_dragon_keeper`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `roost_keepers` | Keepers of the Roosts | council_of_the_grove | – | 27,1 | 35 | Bond +5; political_power 25 | 40 | `dragon_mountain` |
| `songs_for_the_wyrms` | Songs for the Wyrms | roost_keepers | – | 27,2 | 35 | Bond +5; add_spirit wyrm_songs | 20 | `dragon_wing` |
| `guard_the_roosts` | Guard the Roosts | songs_for_the_wyrms | – | 27,3 | 35 | Avail: global_flag zin_elves_roost_sickness or global_flag zin_afrit_revealed. call zin_shared_magical_lands_guard_roosts | 0; 100 when available | `fort_wall` |

### M10. Under a Foreign Banner

**Purpose:** a realm that has become someone's subject (an eastern peace, Herrodon's *One Crown of the Woods*, a conquest). **Opens:** `allow_branch` on `a_banner_not_our_own`: `is_subject: true`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `a_banner_not_our_own` | A Banner Not Our Own | – | – | 1,6 | 35 | stability 0.05 | 50 | `banner_plain` |
| `the_kin_remember_us` | The Kin Remember Us | a_banner_not_our_own | – | 0,7 | 35 | Kinship +5; Goodwill Magical Forest (if it exists) | 30 | `alliance_rings` |
| `the_old_freedom` | The Old Freedom | a_banner_not_our_own | – | 2,7 | 70 | call zin_shared_magical_lands_gain_autonomy | 30; ×0.2 if the overlord is an elven realm | `chain_broken` |

### M11. The Old Customs

**Purpose:** a realm whose government has changed from the Light kinship of the start. **Opens:** each head has its own `allow_branch` and `available` on the ruling ideology.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `lords_of_the_high_seat` | Lords of the High Seat | – | – | 4,6 | 35 | allow_branch and Avail: ideology dominion. add_spirit high_seat; political_power 25 | 50 | `throne_gold` |
| `the_secluded` | The Secluded | – | – | 5,6 | 35 | allow_branch and Avail: ideology wild. add_spirit secluded | 50 | `forest_ancient` |
| `the_fallen_among_us` | The Fallen Among Us | – | – | 6,6 | 35 | allow_branch and Avail: ideology shadow. add_spirit fallen; war_support 0.05. Text: some houses have turned from the old songs; it never says to whom before `zin_afrit_revealed` | 50 | `banner_black` |

### M12. The Woods Defended

**Purpose:** elves defend their own lands (established). **Opens:** `available` on `the_woods_defended`: `at_war` and (a non-elven country at war with ROOT controls one of ROOT's states, or check `zin_elves_eastern_threat`).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_woods_defended` | The Woods Defended | – | – | 10,6 | 21 | war_support 0.10; army_experience 10 | 0; 500 when available | `forest_ancient` |
| `every_tree_a_wall` | Every Tree a Wall | the_woods_defended | – | 9,7 | 21 | building bunker 1 @random_owned; manpower 2000 | 100 | `fort_wall` |
| `the_kin_answer` | The Kin Answer | the_woods_defended | – | 11,7 | 21 | Kinship +10 | 100 | `banner_league` |
| `throw_them_out` | Throw Them Out of the Woods | every_tree_a_wall / the_kin_answer | – | 10,8 | 70 | timed_spirit woods_hold 365 | 100 | `elven_bow` |
| `the_woods_quiet` | The Woods Are Quiet | throw_them_out | – | 10,9 | 35 | Avail: not at_war. stability 0.10; remove_spirit woods_hold | 100 | `olive_branch` |

### M13. House Wardens

**Purpose:** a small, skilled army. **Opens:** at start.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `house_wardens` | House Wardens of [ROOT.GetName] | council_of_the_grove | – | 30,1 | 70 | research [zin_cat_bows] 50% ×1; army_experience 5 | 25 | `ranger_cloak` |
| `longbows_of_the_house` | [ROOT.GetAdjective] Longbows | house_wardens | – | 29,2 | 35 | equipment zin_elven_arms_equipment 200 | 15 | `elven_bow` |
| `grove_riders` | Grove Riders | house_wardens | – | 31,2 | 35 | research [zin_cat_mounts] 50% ×1 | 10 | `white_deer` |
| `wardens_of_the_house` | Wardens of the House | longbows_of_the_house + grove_riders | – | 30,3 | 70 | add_spirit house_wardens | 15 | `elven_bow` |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `old_houses` | The Old Houses | `drift_defence_factor` 0.15, `stability_factor` 0.05 | `the_old_houses` |
| `open_houses` | The Open Houses | `research_speed_factor` 0.05, `opinion_gain_monthly_factor` 0.10 | `the_open_houses` |
| `wellspring_keepers` | Wellspring Keepers | `production_factory_efficiency_gain_factor` 0.05 | `wellspring_keepers` |
| `old_woods_timber` | Timber of the Old Woods | `trade_opinion_factor` 0.10 | `timber_of_the_old_woods` |
| `groves_provide` | The Groves Provide | `production_speed_buildings_factor` 0.05, `consumer_goods_factor` −0.02 | `the_groves_provide` |
| `wall_traders` | Traders at Kingson | `trade_opinion_factor` 0.05 | `traders_at_kingson`; removed while `zin_elves_wall_roads_closed` |
| `wall_roads` | The Wall Roads Open | `consumer_goods_factor` −0.02, `trade_opinion_factor` 0.05 | `wall_roads_open`; removed while `zin_elves_wall_roads_closed` |
| `rift_watch` | Watch on the Rift | `naval_detection` 0.10, `army_intel_factor` 0.05 | `watch_the_rift` |
| `edge_of_the_woods` | The Edge of the Woods | `army_core_defence_factor` 0.10, `coastal_bunker_effectiveness_factor` 0.10 | `the_edge_of_the_woods`; removed on `zin_zol_withdrawn` |
| `wyrm_songs` | Songs for the Wyrms | `stability_factor` 0.02 | `songs_for_the_wyrms`; while held, the roost bond gains +0.5 a month (the elves runner reads this spirit like the Magical Forest's *Songs for the Wyrms*) |
| `high_seat` | Lords of the High Seat | `political_power_gain` 0.10, `stability_factor` −0.02 | `lords_of_the_high_seat`; removed if the government changes |
| `secluded` | The Secluded | `drift_defence_factor` 0.20, `trade_opinion_factor` −0.10 | `the_secluded`; removed if the government changes |
| `fallen` | The Fallen Among Us | `war_support_factor` 0.05, `stability_factor` −0.05 | `the_fallen_among_us`; removed if the government changes |
| `woods_hold` | The Woods Hold | `army_defence_factor` 0.10, `army_core_defence_factor` 0.10 | timed, 365 days |
| `house_wardens` | Wardens of the House | `army_org_factor` 0.05, `army_defence_factor` 0.05 | `wardens_of_the_house` |

### Events (namespace `zin_shared_magical_lands`)

| # | Key | Title | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- |
| 1 | `council_meets` | The Council of [ROOT.GetName] Meets | ROOT | Root | "The elders speak." (stability 0.02; AI 60) / "The young houses speak." (research bonus [zin_cat_wards] 25% ×1; AI 40) |
| 2 | `pilgrims_pass` | Pilgrims on Our Roads | ROOT | Pilgrims on Our Roads | One option. Text: pilgrims of `[zin_loc_deliverer]` pass through toward the hermitage in the Zilin Hills, courteous and footsore |
| 3 | `rift_rumours` | Rumours Across the Rift | ROOT | Rumours Across the Rift | "Warn the kin." (Kinship +3; flag zin_shared_magical_lands_forewarned; for_country Magical Forest: flag `zin_magical_forest_forewarned_east`; AI 70) / "Trade is trade." (political_power 50; AI 30). Text: eastern courts are building ships; it never says who pays for them |
| 4 | `black_ships_seen` | Black Ships Off Our Shore | ROOT | Eyes on the Black North | "Send a boat." (country flag `zin_zol_forewarned`; political_power −25; the boat does not return; AI 50) / "Fishers' tales." (AI 50) |

The mechanic's events also reach these realms: `zin_elves.9` (The New King's Customs, wall realms), `.31` (the Kindred), `.41` (the passes lost), `.51` (the wizard is gone), `.60` (the temple in the hills, after the reveal), `.70` and `.73` (the eastern invasion and its end).

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/focus/shared_magical_lands.json` | Tree data, `"tier": "shared"`, the 15 countries |
| `common/national_focus/zin_shared_magical_lands.txt` | Compiled tree |
| `common/ideas/zin_focus_shared_magical_lands.txt` | Spirits |
| `events/zin_shared_magical_lands.txt` | Events 1 to 4 |
| `common/scripted_triggers/zin_shared_magical_lands.txt`, `common/scripted_effects/zin_shared_magical_lands.txt` | Below |
| `common/opinion_modifiers/zin_shared_magical_lands.txt` | `gate_traders` (+10, decay 0.25) |
| `localisation/english/zin_focus_shared_magical_lands_l_english.yml` | Text |

### Tree-declared scripted triggers and effects

| Name | Kind | Does / true when |
| --- | --- | --- |
| `zin_shared_magical_lands_faces_the_mistake` | trigger (country) | `any_owned_state` with `zin_is_site_ocean_of_zol_coast`, or with a neighbour state that has `zin_is_region_zols_mistake` |
| `zin_shared_magical_lands_opinion` (`who`, `modifier`) | effect | Tree opinion modifier helper |
| `zin_shared_magical_lands_gain_autonomy` | effect | `add_autonomy_ratio = { value = 0.2 }` |
| `zin_shared_magical_lands_guard_roosts` | effect | `set_country_flag = { flag = zin_elves_roosts_guarded days = 365 }`; Footholds −1; Bond +5 (the same as the mechanic's "Guard the roosts" option, without its cost) |

### Names this tree needs from other specs

`zin_elves_join_kindred` and `zin_elves_wanderers_extra` (proposed in the elves mechanic; see the regional spec), `zin_is_site_ocean_of_zol_coast` (proposed key site), and the mechanic names `zin_elves_add_kinship`, `zin_elves_add_wall_grievance`, `zin_elves_add_roost_bond`, `zin_elves_add_pass_watch`, `zin_elves_goodwill`, `zin_elves_set_pilgrim_roads`, `zin_elves_kindred_exists`, `zin_elves_refusal_question_open`, `zin_elves_is_wall_realm`, `zin_elves_is_pilgrim_road_realm`, `zin_elves_is_rift_realm`, `zin_elves_eastern_threat`, `zin_world_is_dragon_keeper`, `zin_afrit_add_footholds`.

### Data checks

1. Each of the 15 countries maps to this tree and no other.
2. No focus creates a war goal, a claim, a faction membership with a human country, or sets `zin_refusal_lifted`.
3. Every `allow_branch` head repeats its condition in `available`.

## AI

| Situation | Behaviour |
| --- | --- |
| Every realm, 4A 1748–1750 | Root, M1 (*The Old Houses*, hist ×2), M2, M3 heads, M4 heads, M13 head |
| Wall realm | M5 after M2's first two focuses |
| Pilgrim-road realm | M6 (*Keep the Roads Open*, hist ×2); *The Temple in the Hills* within 60 days of the reveal |
| Rift realm | M7 from 4A 1749; *Shore Levies* ×5 once forewarned |
| Faces the Mistake | M8 head in 4A 1748–1749 (send a boat at 50%) |
| Kindred raised | *Stand with the Kindred* at weight 300 |
| War | M12 head at weight 500 |

Under PLAUSIBLE each "hist" factor f becomes 1 + (f − 1) ÷ 2; under FREE base weights apply.

## Acceptance

1. The compiled tree has 55 focuses with unique positions; every focus sits below its prerequisites; the compiler and the HOI4 Agent Tools focus inspector pass.
2. Every one of the 15 countries maps to `shared_magical_lands`.
3. On 1 Thaw 4A 1748: M7 is visible for Luv-zhise, Lengoli and Lusteli and hidden for the others; M10 and M11 are hidden for all; no available focus declares war, claims, joins a human faction or sets `zin_refusal_lifted`.
4. *Keep the Roads Open* sets the pilgrim policy to 2; *The Temple in the Hills* is unavailable before `zin_afrit_revealed` and lowers footholds by 1 after it.
5. Event 4 "Send a boat" sets `zin_zol_forewarned`.
6. Every modifier in the spirit table exists in the modifier documentation; every called effect and trigger exists in the staged files.
7. The localisation check finds no "Afrit" before the reveal, no place for Varner, and no text that says the elves will march.

## Open questions

1. **Which realms face the Mistake?** M8 waits for the map answer on the black areas (Dlomntod, Medek, Lost Lands).
2. **The Keeper.** If the map gives Dragon Mountain to a tier C realm, M9 makes it the Keeper's tree. Is a small module enough, or should that realm become tier B?
3. **Mycids.** Should a mycid module be added once the Mushroom Forest is placed and its people decided?
4. **Sacomananos and Velakton.** The Herrodon tree treats them as its "lost kin". They keep this shared tree, with M10 for the case where they take Herrodon's crown. Confirm.
