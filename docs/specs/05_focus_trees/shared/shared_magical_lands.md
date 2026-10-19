# Shared Tree: Kin Realms of the Magical Lands

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier C).

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

**Proposed here:** every focus, spirit, event and number; the tree's own triggers and effects (Implementation).

**Kept open:** where Varner is; whether the black areas of the Magical Lands sheet belong to Zol's Mistake (owner short-list question 4); who keeps Dragon Mountain (elves question 2); the mycids' polity (owner short-list question 12; no mycid content until the owner places the Mushroom Forest); how the elves fare against the eastern invasion. No text says the elves will march. Before `zin_afrit_revealed` the Deliverer is `[zin_loc_deliverer]` ("Aurevan the Deliverer") and his hermitage is a hermitage; no text names Afrit. No text names Eindil.

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
| Coast or border: the black north | check `zin_shared_magical_lands_faces_the_mistake` (computed from the map) | M8 The Black North |
| Map: Dragon Mountain | check `zin_world_is_dragon_keeper` | M9 Keepers of the Roosts |
| Overlord | `is_subject: true` | M10 Under a Foreign Banner (hidden at start: no realm is a subject) |
| Ideology | Dominion / Wild / Shadow (Light is the start) | M11 The Old Customs |
| People | `people: elves` on the heads of M3 and M4 | A released non-elven country in this tree sees neither the Kinship nor the Wanderers |
| War | check `zin_shared_magical_lands_woods_invaded` or check `zin_elves_eastern_threat` (`available` only; the module is always shown) | M12 The Woods Defended |

Every `allow_branch` head repeats its condition in `available`. The engine evaluates `allow_branch` at game start and again when `mark_focus_tree_layout_dirty` runs. The elves' monthly runner (`zin_elves_monthly`) runs `mark_focus_tree_layout_dirty = yes` for every country with `zin_region_magical_lands` (economy spec's region flag), so a realm whose subject status or government changed sees the right branches within a month (dependency on the elves mechanic; requested there).

All 15 realms are elves, Light (`zin_light_kinship`) in `docs/design/countries.csv`, and none is a subject at the start.

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
- **Shorthands:** **Kinship ±n** = `call zin_elves_add_kinship(value = n)`; **Grievance ±n** = `call zin_elves_add_wall_grievance(value = n)`; **Bond ±n** = `call zin_elves_add_roost_bond(value = n)`; **Pass watch ±n** = `call zin_elves_add_pass_watch(value = n)`; **Goodwill X** = `for_country X: call zin_elves_goodwill(target = ROOT)` (the mechanic's `zin_opinion_elven_goodwill`, both ways); **Roads n** = `call zin_elves_set_pilgrim_roads(value = n)` on ROOT; **Footholds ±n** = `call zin_afrit_add_footholds(value = n)` on ROOT; **Join the Kindred** = `call zin_elves_join_kindred` on ROOT (proposed elves effect, contract additions). **Opinion X (k) both ways** = `for_country X: call zin_shared_magical_lands_opinion_both_ways(modifier = k)`. The compiler wraps every `for_country` effect in `if exists X`.
- **Avail:** the focus's `available` list. **Text:** what the focus description says. Country names in conditions and effects are resolved to tags by the compiler. **global variable v** reads the global variable (`global.v` in script).
- **AI** is `ai.base` and its factors. "0; N when available" means `ai.base` N: the focus is gated by `available`, so it carries no weight before. **hist** = factor applied with `check zin_rules_is_historical`; **free** = `check zin_rules_is_free`.
- Spirit keys compile to `zin_shared_magical_lands_<key>`. Research categories and equipment are the warfare spec's `zin_cat_*` and `zin_*_equipment` keys ([../../03_gameplay/01_warfare.md](../../03_gameplay/01_warfare.md)).
- No focus uses a `raw` block.

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
| `wellspring_keepers` | Wellspring Keepers | elder_groves | – | 5,2 | 35 | add_spirit wellspring_keepers_spirit | 20 | `tree_silver` |
| `grove_roads` | Grove Roads | elder_groves | – | 7,2 | 35 | building infrastructure 1 @random_owned | 15 | `roads_paved` |
| `essence_workshops` | Essence Workshops | wellspring_keepers | – | 5,3 | 35 | building industrial_complex 1 @random_owned | 15 | `workshop_tools` |
| `timber_of_the_old_woods` | Timber of the Old Woods | grove_roads | – | 7,3 | 35 | add_spirit old_woods_timber | 15 | `timber_mill` |
| `the_groves_provide` | The Groves Provide | essence_workshops + timber_of_the_old_woods | – | 6,4 | 70 | add_spirit groves_provide; building industrial_complex 1 @random_owned | 15 | `market_stalls` |

### M3. The Kinship

**Purpose:** the realm among its kin. **Opens:** `allow_branch` on `kin_envoys`: people elves. **Mechanic:** kinship, the Elder Moot's weight, Nolorim's pass watch, the Kindred of the Woods (elves helping elves; the Refusal untouched).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `kin_envoys` | Envoys to the Kin | council_of_the_grove | – | 10,1 | 35 | allow_branch and Avail: people elves. Kinship +3; Goodwill Magical Forest | 30 | `envoy` |
| `answer_the_elder_moot` | Answer the Elder Moot | kin_envoys | – | 9,2 | 35 | Avail: global variable zin_elves_kinship above 39. Kinship +5; political_power 25 | 20 | `elven_council` |
| `wardens_to_nolorim` | Wardens to Nolorim | kin_envoys | – | 11,2 | 35 | Avail: exists Nolorim. Pass watch +5; Kinship +2; manpower −500 | 15; ×3 if global_flag zin_eastern_invasion | `mountain_pass` |
| `shared_songs_of_the_kin` | Shared Songs of the Kin | answer_the_elder_moot / wardens_to_nolorim | – | 10,3 | 35 | research [zin_cat_wards] 50% ×1; Kinship +2 | 15 | `hymn_choir` |
| `stand_with_the_kindred` | Stand with the Kindred | shared_songs_of_the_kin | – | 10,4 | 35 | Avail: check zin_shared_magical_lands_may_join_kindred (the Kindred exists; ROOT is in no faction). Join the Kindred | 0; 300 when available | `banner_league` |

### M4. Healers, Not Hosts

**Purpose:** the Refusal as the elves keep it: individuals help, armies stay home. **Opens:** `allow_branch` on `healers_of_the_house`: people elves. **Mechanic:** the Wanderer decisions (Send Healers and Loremasters; Send Wardens to a Friend in Need).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `healers_of_the_house` | Healers of [ROOT.GetName] | council_of_the_grove | – | 13,1 | 35 | allow_branch and Avail: people elves. flag zin_elves_wanderers_extra; political_power 25 | 20 | `healer_herbs` |
| `loremasters_abroad` | Loremasters Abroad | healers_of_the_house | – | 12,2 | 35 | research [zin_cat_wards] 50% ×1; political_power 25 | 15 | `book_lore` |
| `the_refusal_kept` | The Refusal Kept | healers_of_the_house | – | 14,2 | 35 | Avail: check zin_elves_refusal_question_open. stability 0.05; Kinship +3 | 10; hist ×5 | `banner_plain` |
| `wardens_for_friends` | Wardens for Friends | loremasters_abroad / the_refusal_kept | – | 13,3 | 35 | Avail: global_flag zin_war_of_last_crowns. political_power 50; army_experience 5 | 30 | `ranger_cloak` |

### M5. Customs at the Wall

**Purpose:** the Wall's daily quarrel with Aenor's customs men. **Opens:** `allow_branch` and `available` on `customs_at_the_wall`: check `zin_elves_is_wall_realm`. **Mechanic:** `zin_elves_wall_grievance`; the realm may call a Wall Moot through the mechanic's decision.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `customs_at_the_wall` | Customs at the Wall | council_of_the_grove | – | 16,1 | 35 | Grievance −3; political_power 25 | 25 | `charter_wall` |
| `traders_at_kingson` | Traders at Kingson | customs_at_the_wall | – | 15,2 | 35 | Avail: exists Kingson; not at_war_with Kingson. Opinion Kingson (gate_traders) both ways; add_spirit wall_traders | 15 | `market_stalls` |
| `a_word_at_the_gate` | A Word at the Gate | customs_at_the_wall | – | 17,2 | 35 | Avail: global variable zin_elves_wall_grievance above 29. Grievance −5 | 15 | `scroll_treaty` |
| `wall_roads_open` | The Wall Roads Open | traders_at_kingson / a_word_at_the_gate | – | 16,3 | 35 | Avail: not global_flag zin_elves_wall_roads_closed. add_spirit wall_roads; Grievance −3 | 15 | `traders_road` |

### M6. Pilgrims on Our Roads

**Purpose:** the pilgrim roads to the Zilin Hills. **Opens:** `allow_branch` and `available` on `pilgrims_on_our_roads`: check `zin_elves_is_pilgrim_road_realm`. **Mutual exclusions:** `keep_the_roads_open` / `toll_the_pilgrims`. **Mechanic:** policy 2 (open; a foothold every 12 months within the elven cap of 2), 1 (tolled), 0 (closed; footholds −1).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `pilgrims_on_our_roads` | Pilgrims on Our Roads | council_of_the_grove | – | 20,1 | 35 | event `pilgrims_pass` | 20 | `courier_pilgrim` |
| `keep_the_roads_open` | Keep the Roads Open | pilgrims_on_our_roads | toll_the_pilgrims | 19,2 | 35 | Roads 2; stability 0.02 | 20; hist ×2 | `traders_road` |
| `toll_the_pilgrims` | Toll the Pilgrims | pilgrims_on_our_roads | keep_the_roads_open | 21,2 | 35 | Roads 1; political_power 25 | 10; ×2 with check zin_shared_magical_lands_short_of_power | `toll_house` |
| `the_temple_in_the_hills` | The Temple in the Hills | keep_the_roads_open / toll_the_pilgrims | – | 20,3 | 35 | Avail: global_flag zin_afrit_revealed. Roads 0 (closing the roads costs the realm's network 1 foothold through the mechanic's policy effect); stability 0.05 | 0; 100 when available | `hermitage_hills` |

### M7. The Rift Shore

**Purpose:** the rift coast that faces the East Lands. **Opens:** `allow_branch` and `available` on `watch_the_rift`: check `zin_elves_is_rift_realm`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `watch_the_rift` | Watch the Rift | council_of_the_grove | – | 23,1 | 70 | add_spirit rift_watch; navy_experience 5 | 30 | `lighthouse` |
| `shore_beacons` | Shore Beacons | watch_the_rift | – | 22,2 | 35 | building coastal_bunker 1 @random_coastal | 15 | `beacon` |
| `elven_sails` | [ROOT.GetAdjective] Sails | watch_the_rift | – | 24,2 | 35 | research [zin_cat_galleys] 50% ×1; building dockyard 1 @random_coastal | 10 | `warship_sail` |
| `rumours_across_the_rift` | Rumours Across the Rift | shore_beacons / elven_sails | – | 23,3 | 35 | Avail: after 1752.3.1 or global variable zin_gathering_dark above 29. event `rift_rumours` | 20 | `envoy` |
| `shore_levies` | Shore Levies | rumours_across_the_rift | – | 23,4 | 35 | manpower 2000; building coastal_bunker 1 @random_coastal | 10; ×5 with flag zin_shared_magical_lands_forewarned | `levy_muster` |

### M8. The Black North

**Purpose:** for realms whose coast or border faces Zol's Mistake (owner short-list question 4; the work proceeds on the map today, where the black areas belong to the Mistake). **Opens:** `allow_branch` and `available` on `eyes_on_the_black_north`: check `zin_shared_magical_lands_faces_the_mistake`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `eyes_on_the_black_north` | Eyes on the Black North | council_of_the_grove | – | 25,1 | 35 | event `black_ships_seen` | 30 | `black_isles` |
| `black_shore_wardens` | Wardens of the Black Shore | eyes_on_the_black_north | – | 25,2 | 35 | building coastal_bunker 1 @random_coastal; building bunker 1 @random_owned | 15 | `fort_wall` |
| `the_edge_of_the_woods` | The Edge of the Woods | black_shore_wardens | – | 25,3 | 35 | Avail: global_flag zin_zol_rising. add_spirit edge_of_the_woods | 0; 200 when available | `dead_ranks_far` |

### M9. Keepers of the Roosts

**Purpose:** only if the map makes this realm the Keeper of Dragon Mountain (elves question 2; the work proceeds on the elves spec's proposal that the Magical Forest keeps it, so this module is hidden for all 15 today). **Opens:** `allow_branch` and `available` on `roost_keepers`: check `zin_world_is_dragon_keeper` (magic spec).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `roost_keepers` | Keepers of the Roosts | council_of_the_grove | – | 27,1 | 35 | Bond +5; political_power 25 | 40 | `dragon_mountain` |
| `songs_for_the_wyrms` | Songs for the Wyrms | roost_keepers | – | 27,2 | 35 | Bond +5; add_spirit wyrm_songs | 20 | `dragon_wing` |
| `guard_the_roosts` | Guard the Roosts | songs_for_the_wyrms | – | 27,3 | 35 | Avail: global_flag zin_elves_roost_sickness or global_flag zin_afrit_revealed. call zin_shared_magical_lands_guard_roosts | 0; 100 when available | `fort_wall` |

### M10. Under a Foreign Banner

**Purpose:** a realm that has become someone's subject (an eastern peace, Herrodon's *One Crown of the Woods*, a conquest). **Opens:** `allow_branch` and `available` on `a_banner_not_our_own`: `is_subject: true`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `a_banner_not_our_own` | A Banner Not Our Own | – | – | 1,6 | 35 | stability 0.05 | 50 | `banner_plain` |
| `the_kin_remember_us` | The Kin Remember Us | a_banner_not_our_own | – | 0,7 | 35 | Kinship +5; Goodwill Magical Forest | 30 | `alliance_rings` |
| `the_old_freedom` | The Old Freedom | a_banner_not_our_own | – | 2,7 | 70 | call zin_shared_magical_lands_gain_autonomy | 30; ×0.2 with check zin_shared_magical_lands_elven_overlord | `chain_broken` |

### M11. The Old Customs

**Purpose:** a realm whose government has changed from the Light kinship of the start. **Opens:** each head has its own `allow_branch` and `available` on the ruling ideology.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `lords_of_the_high_seat` | Lords of the High Seat | – | – | 4,6 | 35 | allow_branch and Avail: ideology dominion. add_spirit high_seat; political_power 25 | 50 | `throne_gold` |
| `the_secluded` | The Secluded | – | – | 5,6 | 35 | allow_branch and Avail: ideology wild. add_spirit secluded | 50 | `forest_ancient` |
| `the_fallen_among_us` | The Fallen Among Us | – | – | 6,6 | 35 | allow_branch and Avail: ideology shadow. add_spirit fallen; war_support 0.05. Text: some houses have turned from the old songs; it never says to whom before `zin_afrit_revealed` | 50 | `banner_black` |

### M12. The Woods Defended

**Purpose:** elves defend their own lands (established). **Opens:** `available` on `the_woods_defended`: check `zin_shared_magical_lands_woods_invaded` (a non-elven country at war with ROOT controls one of ROOT's states) or check `zin_elves_eastern_threat`. The module is always shown and greyed out in peace.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_woods_defended` | The Woods Defended | – | – | 10,6 | 21 | Avail: check zin_shared_magical_lands_woods_invaded or check zin_elves_eastern_threat. war_support 0.10; army_experience 10 | 0; 500 when available | `forest_ancient` |
| `every_tree_a_wall` | Every Grove a Fort | the_woods_defended | – | 9,7 | 21 | building bunker 1 @random_owned; manpower 2000 | 100 | `fort_wall` |
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
| `wardens_of_the_house` | Wardens of the House | longbows_of_the_house + grove_riders | – | 30,3 | 70 | add_spirit house_wardens_spirit | 15 | `elven_bow` |

### Spirits

The "Removed" column is the spirit's `cancel` list: conditions under which the engine removes the idea (vanilla ideas support a `cancel` trigger). The focus compiler's spirit object gains an optional `"cancel"` list of conditions for this (decision F1, [../00_format_and_compiler.md](../00_format_and_compiler.md)).

| Key | Name | Modifiers | Added by | Removed (`cancel`) |
| --- | --- | --- | --- | --- |
| `old_houses` | The Old Houses | `drift_defence_factor` 0.15, `stability_factor` 0.05 | `the_old_houses` | – |
| `open_houses` | The Open Houses | `research_speed_factor` 0.05, `opinion_gain_monthly_factor` 0.10 | `the_open_houses` | – |
| `wellspring_keepers_spirit` | Wellspring Keepers | `production_factory_efficiency_gain_factor` 0.05 | `wellspring_keepers` | – |
| `old_woods_timber` | Timber of the Old Woods | `trade_opinion_factor` 0.10 | `timber_of_the_old_woods` | – |
| `groves_provide` | The Groves Provide | `production_speed_buildings_factor` 0.05, `consumer_goods_factor` −0.02 | `the_groves_provide` | – |
| `wall_traders` | Traders at Kingson | `trade_opinion_factor` 0.05 | `traders_at_kingson` | global_flag `zin_elves_wall_roads_closed` |
| `wall_roads` | The Wall Roads Open | `consumer_goods_factor` −0.02, `trade_opinion_factor` 0.05 | `wall_roads_open` | global_flag `zin_elves_wall_roads_closed` |
| `rift_watch` | Watch on the Rift | `naval_detection` 0.10, `army_intel_factor` 0.05 | `watch_the_rift` | – |
| `edge_of_the_woods` | The Edge of the Woods | `army_core_defence_factor` 0.10, `coastal_bunker_effectiveness_factor` 0.10 | `the_edge_of_the_woods` | global_flag `zin_zol_withdrawn` |
| `wyrm_songs` | Songs for the Wyrms | `stability_factor` 0.02 | `songs_for_the_wyrms` | – (while held, the roost bond gains +0.5 a month: the elves runner reads this spirit as it reads the Magical Forest's `zin_magical_forest_wyrm_songs`; requested there) |
| `high_seat` | Lords of the High Seat | `political_power_gain` 0.10, `stability_factor` −0.02 | `lords_of_the_high_seat` | not ideology dominion |
| `secluded` | The Secluded | `drift_defence_factor` 0.20, `trade_opinion_factor` −0.10 | `the_secluded` | not ideology wild |
| `fallen` | The Fallen Among Us | `war_support_factor` 0.05, `stability_factor` −0.05 | `the_fallen_among_us` | not ideology shadow |
| `woods_hold` | The Woods Hold | `army_defence_factor` 0.10, `army_core_defence_factor` 0.10 | `throw_them_out` | timed, 365 days; *The Woods Are Quiet* removes it early |
| `house_wardens_spirit` | Wardens of the House | `army_org_factor` 0.05, `army_defence_factor` 0.05 | `wardens_of_the_house` | – |

Every modifier above exists in the 1.19.3 modifier documentation (checked 19 October 2026). Each spirit's icon is the icon key of the focus that adds it (`GFX_idea_zin_<key>`).

### Events (namespace `zin_shared_magical_lands`)

| # | Key | Title | To | Trigger | Picture | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `council_meets` | The Council of [ROOT.GetName] Meets | ROOT | Root | `generic_wilds` (requested `elven_moot`, already in the catalog's requested list) | "The elders speak." (stability 0.02; AI 60) / "The young houses speak." (research [zin_cat_wards] 25% ×1; AI 40) |
| 2 | `pilgrims_pass` | Pilgrims on Our Roads | ROOT | Pilgrims on Our Roads | `hermitage` | One option. Text: pilgrims of `[zin_loc_deliverer]` pass through toward the hermitage in the Zilin Hills, courteous and footsore |
| 3 | `rift_rumours` | Rumours Across the Rift | ROOT | Rumours Across the Rift | `generic_sea` | "Warn the kin." (Kinship +3; flag zin_shared_magical_lands_forewarned; for_country Magical Forest: flag `zin_magical_forest_forewarned_east`; AI 70) / "Trade is trade." (political_power 50; AI 30). Text: eastern courts are building ships; it never says who pays for them |
| 4 | `black_ships_seen` | Black Ships Off Our Shore | ROOT | Eyes on the Black North | `black_isles_lights` | "Send a boat." (country flag `zin_zol_forewarned`; political_power −25; the boat does not return; AI 50) / "Fishers' tales." (AI 50) |

Event 3 cannot use the requested `rift_sails` picture: it is gated on `zin_eastern_invasion`, and the event can fire before it. No new picture is requested.

The mechanic's events also reach these realms: `zin_elves.9` (The New King's Customs, wall realms), `.31` (the Kindred), `.41` (the passes lost), `.51` (the wizard is gone), `.60` (the temple in the hills, after the reveal), `.70` and `.73` (the eastern invasion and its end).

## Implementation

### Builder

The tree is data, compiled by the focus compiler module `tools/content/modules/focus_compiler.mjs` ([../00_format_and_compiler.md](../00_format_and_compiler.md)) inside `tools/content/build.mjs`, and written in the builder's one transaction through `tools/content/apply.mts` (shared atomic rewrite engine). Nothing is hand-edited. The compiled tree replaces the interim "Long Peace" tree (`zin_long_peace_*`, the `default = yes` tree in `common/national_focus/zin_interim_default.txt`, written today by `tools/content/modules/vanilla_removal.mjs`) for these 15 countries: the compiled tree's `country` block gives each of their tags a positive factor.

### Files

| Path | Written by | Content |
| --- | --- | --- |
| `docs/design/focus/shared_magical_lands.json` | data (source of truth) | Tree data: `"id": "shared_magical_lands"`, `"tier": "shared"`, the 15 countries, the opinion modifier below |
| `common/national_focus/zin_shared_magical_lands.txt` | `focus_compiler.mjs` | Compiled tree |
| `common/ideas/zin_focus_shared_magical_lands.txt` | `focus_compiler.mjs` | Spirits |
| `events/zin_shared_magical_lands.txt` | `focus_compiler.mjs` | Events 1 to 4 |
| `common/scripted_triggers/zin_shared_magical_lands.txt`, `common/scripted_effects/zin_shared_magical_lands.txt` | `focus_compiler.mjs` | Tree triggers and effects below |
| `common/opinion_modifiers/zin_shared_magical_lands.txt` | `focus_compiler.mjs` (`opinion_modifiers` block, F1) | `zin_shared_magical_lands_gate_traders` (+10, decay 0.25 a month): Kingson and a wall realm, both ways |
| `localisation/english/zin_focus_shared_magical_lands_l_english.yml` | `focus_compiler.mjs` | Text, UTF-8 with BOM; pilgrim texts use the scripted localisation `[zin_loc_deliverer]` |

**Format.** The tree uses two compiler blocks of decision F1: the optional `"cancel"` list on a spirit (compiled to the idea's `cancel` trigger) and the tree-level `"opinion_modifiers"` block (compiled to `common/opinion_modifiers/zin_<tree>.txt`, ids `zin_<tree>_<key>`).

`raw` blocks: none.

### Tree-declared scripted triggers and effects

| Name | Kind | Scope | Does / true when |
| --- | --- | --- | --- |
| `zin_shared_magical_lands_faces_the_mistake` | trigger | country | `any_owned_state = { OR = { zin_is_site_ocean_of_zol_coast = yes any_neighbor_state = { zin_is_region_zols_mistake = yes } } }` (`zin_is_region_zols_mistake` is the economy spec's generated state trigger for the region key `zols_mistake`) |
| `zin_shared_magical_lands_may_join_kindred` | trigger | country | `zin_elves_kindred_exists = yes`, `is_in_faction = no` |
| `zin_shared_magical_lands_woods_invaded` | trigger | country | `any_owned_state = { controller = { has_war_with = ROOT NOT = { has_country_flag = zin_people_elves } } }` |
| `zin_shared_magical_lands_elven_overlord` | trigger | country | `is_subject = yes`, `overlord = { has_country_flag = zin_people_elves }` |
| `zin_shared_magical_lands_short_of_power` | trigger | country | `NOT = { has_political_power > 49 }` |
| `zin_shared_magical_lands_opinion_both_ways` (`modifier`) | effect | the other country | `add_opinion_modifier = { target = ROOT modifier = zin_shared_magical_lands_$modifier$ } ROOT = { add_opinion_modifier = { target = PREV modifier = zin_shared_magical_lands_$modifier$ } }` |
| `zin_shared_magical_lands_gain_autonomy` | effect | ROOT | `if = { limit = { is_subject = yes } add_autonomy_ratio = { value = 0.2 } }` |
| `zin_shared_magical_lands_guard_roosts` | effect | ROOT (the Keeper) | `set_country_flag = { flag = zin_elves_roosts_guarded days = 365 }`; Footholds −1; Bond +5 (the mechanic's "Guard the roosts" option of `zin_elves.45`, without its cost) |

Every engine effect and trigger named here (`any_owned_state`, `any_neighbor_state`, `is_in_faction`, `has_war_with`, `has_country_flag`, `is_subject`, `has_political_power`, `add_opinion_modifier`, `add_autonomy_ratio`, `set_country_flag`, `mark_focus_tree_layout_dirty`) exists in the 1.19.3 documentation.

### Names this tree uses from other specs

| Name | Kind | Owner |
| --- | --- | --- |
| `zin_elves_add_kinship`, `zin_elves_add_wall_grievance`, `zin_elves_add_roost_bond`, `zin_elves_add_pass_watch`, `zin_elves_goodwill`, `zin_elves_set_pilgrim_roads`, `zin_elves_kindred_exists`, `zin_elves_refusal_question_open`, `zin_elves_is_wall_realm`, `zin_elves_is_pilgrim_road_realm`, `zin_elves_is_rift_realm`, `zin_elves_eastern_threat`; variables `zin_elves_kinship`, `zin_elves_wall_grievance`; flags `zin_elves_wall_roads_closed`, `zin_elves_roost_sickness`, `zin_elves_roosts_guarded`; runner `zin_elves_monthly` | mechanic names | elves mechanic |
| `zin_elves_join_kindred`, `zin_elves_wanderers_extra` | proposed mechanic names (contract additions, regions spec) | elves mechanic implements them |
| `zin_world_is_dragon_keeper` | trigger | magic and world systems spec |
| `zin_afrit_add_footholds` (elven cap 2) | effect | Afrit mechanic |
| `zin_zol_forewarned` | country flag (option B of the Zol spec's black-ships event; the forewarned idea follows on `zin_zol_rising`) | Zol's Mistake |
| `zin_magical_forest_forewarned_east` | country flag | Magical Forest tree |
| `zin_eastern_invasion` | global flag | eastern kings and world systems |
| `zin_is_site_ocean_of_zol_coast` | key site (contract additions; needs a key-sites row) | key sites table, generated in `common/scripted_triggers/zin_sites.txt` |
| `zin_is_region_zols_mistake`, `zin_region_magical_lands` | state trigger, country flag | economy spec |
| `zin_loc_deliverer` | scripted localisation | lore digest |
| `zin_rules_is_historical`, `zin_rules_is_free` | rule wrappers | defines and rules spec |

### Data checks (compiler and build test)

1. Each of the 15 countries maps to this tree and no other.
2. No focus creates a war goal, a claim, a faction membership with a human country, or sets `zin_refusal_lifted`.
3. Every `allow_branch` head repeats its condition in `available`.
4. No text reachable before `zin_afrit_revealed` names Afrit; no text names Eindil, places Varner, or says the elves will march.

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

Under PLAUSIBLE each "hist" factor f becomes 1 + (f − 1) ÷ 2; under FREE base weights apply. The compiler writes each hist factor as two AI modifiers: factor f with `check zin_rules_is_historical`, and factor 1 + (f − 1) ÷ 2 with `not check zin_rules_is_historical` and `not check zin_rules_is_free`.

## Acceptance

1. The compiler accepts `shared_magical_lands.json`: 55 focuses, unique keys and positions, every prerequisite above its focus, exclusives symmetric, days multiples of 7 within 1 to 20 weeks, every icon and event picture a catalog key, zero `raw` blocks. The HOI4 Agent Tools focus inspector and script validator report no errors in the staged files.
2. The coverage check maps each of the 15 countries to `shared_magical_lands` and to no other tree; none of them still shows the interim `zin_long_peace_*` tree.
3. On 1 Thaw 4A 1748: M7 is visible for Luv-zhise, Lengoli and Lusteli and hidden for the others; M9, M10 and M11 are hidden for all; no available focus declares war, claims, joins a human faction or sets `zin_refusal_lifted`.
4. *Keep the Roads Open* sets `zin_elves_pilgrim_roads` to 2; *The Temple in the Hills* is unavailable before `zin_afrit_revealed` and, after it, sets the policy to 0 and lowers the realm's `zin_footholds` by 1 (scripted test).
5. Event 4 "Send a boat" sets `zin_zol_forewarned`; when `zin_zol_rising` is then set, the realm gets the Zol spec's forewarned idea.
6. Every modifier in the spirit table exists in the modifier documentation; every called effect and checked trigger exists in the staged files.
7. The localisation check finds no "Afrit" in text reachable before the reveal, no "Eindil", no place for Varner, and no text that says the elves will march.
8. The isolated Linux run (one in-game year from phase 3 on) logs no error line that names a `zin_shared_magical_lands` file, focus, idea or event.

## Open questions

Each question proceeds on the labelled proposal. Owner-only questions are listed in [../../OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md).

1. **Which realms face the Mistake?** (owner: short-list question 4; regions: dark, magical, dead, question 7). *Proceeding on:* the black areas (Dlomntod, Medek, Lost Lands) belong to the Mistake, as on the map today; the trigger computes which realms border them or hold an Ocean of Zol coast.
2. **The Keeper** (owner: elves question 2). *Proceeding on:* the Magical Forest keeps Dragon Mountain, so M9 is dormant for all 15. *Resolved (proposed):* if the map gives the mountain to a tier C realm, the small module is enough; no tier B tree is added.
3. **Mycids** (owner: short-list question 12). *Proceeding on:* the Mushroom Forest lies inside an elven realm and is not a country; no mycid module now. If the owner makes mycids a people, a mycid head is added like the Dark Lands tree's kin heads.
4. **Sacomananos and Velakton** (owner: regions: dark, magical, dead, question 6). *Proceeding on:* Herrodon may be a crowned elven realm with them as its "lost kin"; they keep this shared tree, and M10 covers the case where they take Herrodon's crown.
