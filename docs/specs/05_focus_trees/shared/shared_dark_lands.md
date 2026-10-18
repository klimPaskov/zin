# Shared Tree: Holds of the Dark Lands

**Status:** Draft. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

The shared focus tree for the **17 tier C holds of the Dark Lands** (tree id `shared_dark_lands`, focus ids `zin_shared_dark_lands_<key>`, data file `docs/design/focus/shared_dark_lands.json`). One tree serves every small orc hold, island chiefdom and border clan that is neither Goldoroth ([../major/goldoroth.md](../major/goldoroth.md)) nor one of the six tier B realms ([../regional/dark_lands.md](../regional/dark_lands.md)). It plays the Dark Lands mechanic ([../../04_mechanics/dark_lands.md](../../04_mechanics/dark_lands.md)) from below: a hold that keeps its own fire, bends to Cocanoor or refuses it, stands in the Dark Sea Accord or the Free Moot, answers the strangers from the south, and watches the Sea of Darkness and the northern shore.

The tree is also the **module library** for the Dark Lands tier B trees. Its modules are labelled D1 to D12; a tier B tree may copy a module into its own file under its own keys ([../01_tiers_and_coverage.md](../01_tiers_and_coverage.md)).

| Item | Value |
| --- | --- |
| Tree id | `shared_dark_lands` |
| Tier | C (shared) |
| Countries (17) | The Darks, Colost, Dunbulinor, Fondor, Bold, Dark Gate, Belonton, Beriath, Britadon, Dun, Gord, Gull Kingdom, Lestern Isles, Sungodor, The Doltu, Wild Lands, Zuriath |
| Focuses | 57 (root and modules D1 to D12) |
| Width | columns 0 to 32, rows 0 to 8 |
| Events | namespace `zin_shared_dark_lands` |
| Spirits | `zin_shared_dark_lands_<key>` |

## Lore basis

**Established** (vault): the Dark Lands lie between Lerendor and the Middle Lands across narrow straits and hold the Sea of Darkness; the independent Dark Lands are not Volgan's by right, and independent men, orcs, goblins, trolls, ogres, giants and demons live under separate rulers; orcs and goblins do not serve one master by nature; the Dark Lands were never one nation; some Dark Lands peoples fought in the Grand Alliance and others for Volgan; the great invasions of orcs and goblins had ceased in the Fourth Age; Zol's dead move through islands and straits and only potent magic ends them; Dondor leads the Dark Sea Accord with Belonton; Goldoroth is the expansionist power (working table).

**Proposed elsewhere and used here:** every mechanic of the Dark Lands spec (sway, the Iron Yoke, tributary holds, the Free Moot, border tension, Accord resolve, the Dark Straits, sea mastery); Volgan's pact levels ([../../04_mechanics/volgan_southern_dominion.md](../../04_mechanics/volgan_southern_dominion.md)); the goblin and ogre people keys ([../../00_foundation/03_peoples.md](../../00_foundation/03_peoples.md)).

**Proposed here:** every focus, spirit, event and number; the site trigger `zin_is_site_ocean_of_zol_coast`.

**Kept open:** which holds are goblin or ogre holds (the people modules stay dormant until the owner assigns peoples in `countries.csv`; no text calls a named hold goblin); the relation of Zol's dead to Volgan's; where Dardan lies; the place of the straits. No text names Afrit, states the size of Volgan's hosts, or says fire ends Zol's dead.

## Design

### The peaceful start

On 1 Thaw 4A 1748 every available focus concerns the hall, the forge-pits, herds, walls, the Accord's beacons, boats and envoys. No focus available at start creates a war goal, a claim or a war. The war module (D12) needs `at_war`; the shore module (D9) needs `zin_zol_rising`; *The Southern Road* needs `zin_volgan_marches`. The tree contains no war goal and no claim at all: holds fight only wars that come to them.

### Who sees what

Branches open with `allow_branch` on the first focus of each module. Each module's first focus also repeats the condition in `available`, so a stale layout never lets a wrong country take it. The Dark Lands pulse (`zin_dark.1`) calls `mark_focus_tree_layout_dirty` for a hold when it becomes or stops being a tributary, joins or leaves the Accord or the Moot, or changes government (dependency on the mechanic spec).

| Opens by | Condition | Module |
| --- | --- | --- |
| Region | every country of the tree | Root, D1, D2, D7, D12 |
| Overlord: free | check `zin_dark_is_free_hold` | D3 No Master but Our Own, D6 The Free Moot |
| Overlord: Goldoroth | check `zin_dark_is_tributary` | D4 Under the Iron Yoke |
| Faction | check `zin_dark_is_accord_member` | D5 The Dark Sea Accord (Belonton at start) |
| Coast (Sea of Darkness) | check `zin_shared_dark_lands_on_dark_sea` | D8 The Sea of Darkness |
| Coast (the north) | check `zin_shared_dark_lands_faces_the_north` | D9 The Dead on the Shore |
| People | `zin_people_includes_goblins` / `_trolls` / `_ogres` | D10 Kin of the Hold (one focus head each) |
| Ideology | ruling ideology Light / Dominion / Shadow | D11 The Hold's Customs (one head each) |

All 17 holds are orcs today, Wild (Tribal Chieftaincy). Belonton is in the Dark Sea Accord at start. Dun, the Gull Kingdom and the Lestern Isles are expected to pass the Sea of Darkness test; the builder computes it from the map.

### Text

Names and descriptions use `[ROOT.GetName]` and `[ROOT.GetAdjective]`: "The Hall of [ROOT.GetName]", "Warbands of [ROOT.GetName] for Cocanoor". Volgan's people are "strangers from the south" or "envoys from Nafeher". Zol's dead are "the dead from the black north". Fire "breaks their shapes"; it never ends them.

### Module map

| Module | Name | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| Root | The Hall of [ROOT.GetName] | 16 | 0 | 1 | start | — |
| D1 | The Hold's Fire | 0–3 | 1–4 | 6 | start | government spirits |
| D2 | Forge-Pits and Herds | 5–7 | 1–4 | 6 | start | industry, trade |
| D3 | No Master but Our Own | 9–11 | 1–4 | 5 | free hold | sway down, `zin_dark_gifts_returned` |
| D4 | Under the Iron Yoke | 13–15 | 1–4 | 6 | tributary | sway, autonomy |
| D5 | The Dark Sea Accord | 16–18 | 1–3 | 4 | Accord member | resolve, `zin_dark_oath_sworn` |
| D6 | The Free Moot | 20–22 | 1–3 | 4 | free hold | `zin_dark_found_free_moot`, `zin_dark_join_free_moot` |
| D7 | Strangers from the South | 23–25 | 1–4 | 6 | start | `zin_volgan_pact` either way |
| D8 | The Sea of Darkness | 27–29 | 1–4 | 5 | Sea of Darkness coast | naval bases (sea mastery), trade |
| D9 | The Dead on the Shore | 31 | 1–3 | 3 | north coast; `zin_zol_rising` | coastal forts, access against the dead |
| D10 | Kin of the Hold | 0–5 | 6–7 | 4 | people | goblin, troll and ogre content |
| D11 | The Hold's Customs | 7–9 | 6 | 3 | ideology | government spirits |
| D12 | The Hold at War | 13–15 | 6–8 | 4 | `at_war` | defence |

### Notation used in the tables

- **Prerequisites:** `a + b` means a and b; `a / b` means a or b.
- **x,y:** grid column and row.
- **Effects** use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md). Spirit keys are short and compile to `zin_shared_dark_lands_<key>`.
- **Shorthands:** **Sway ±n** = `call zin_goldoroth_add_sway(target = ROOT, value = n)`. **Resolve ±n** = `call zin_dark_add_accord_resolve(value = n)`. **Tension ±n** = `call zin_dark_add_border_tension(value = n)`. **Pact ±n** = `call zin_dark_add_volgan_pact(target = ROOT, value = n)` (never raises a country to 3). **Opinion X ±n (k)** = `call zin_shared_dark_lands_opinion(who = X, modifier = k)`, a tree-declared opinion modifier `zin_shared_dark_lands_<k>`.
- **AI** is `ai.base` and its factors. **hist** = `check zin_rules_is_historical`. **south** = Goldoroth has `zin_goldoroth_southern_bargain` (`check zin_goldoroth_seeks_the_south`). **free** = `check zin_rules_is_free`.
- Research categories are the warfare spec's `zin_cat_*` keys.

### Root

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `hall_of_the_hold` | The Hall of [ROOT.GetName] | – | – | 16,0 | 70 | political_power 50; stability 0.02; event `the_holds_fire` | 100 | `war_drums` |

### D1. The Hold's Fire

**Purpose:** who speaks for the hold: the chief alone, or the clan-meet. **Opens:** at start. **Mutual exclusions:** `one_chief_one_fire` / `every_clan_a_voice`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_chiefs_word` | The Chief's Word | hall_of_the_hold | – | 1,1 | 35 | stability 0.03; political_power 25 | 30 | `seal_royal` |
| `the_clan_meet` | The Clan-Meet | hall_of_the_hold | – | 3,1 | 35 | add_spirit clan_meet | 25 | `council_table` |
| `one_chief_one_fire` | One Chief, One Fire | the_chiefs_word / the_clan_meet | every_clan_a_voice | 1,2 | 70 | add_spirit chiefs_fire; remove_spirit clan_meet | 20; hist ×1.5 | `crown_iron` |
| `every_clan_a_voice` | Every Clan a Voice | the_chiefs_word / the_clan_meet | one_chief_one_fire | 3,2 | 70 | swap_spirit clan_meet → every_clan | 20 | `banner_league` |
| `the_great_hall` | The Great Hall of [ROOT.GetName] | one_chief_one_fire / every_clan_a_voice | – | 2,3 | 70 | political_power 50; stability 0.05 | 20 | `throne_gold` |
| `feast_of_the_hold` | Feast of the Hold | the_great_hall | – | 2,4 | 35 | stability 0.03; war_support 0.03 | 15 | `feast_table` |

### D2. Forge-Pits and Herds

**Purpose:** the hold's living: iron from the hills, herds on the slopes, a market for its neighbours. **Opens:** at start.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `forge_pits_of_the_hold` | Forge-Pits of [ROOT.GetName] | hall_of_the_hold | – | 6,1 | 70 | building arms_factory 1 @capital | 35 | `forge_anvil` |
| `herds_of_the_hills` | Herds of the Hills | forge_pits_of_the_hold | – | 5,2 | 35 | add_spirit hill_herds | 20 | `herds` |
| `slag_roads` | Roads of Slag | forge_pits_of_the_hold | – | 7,2 | 35 | building infrastructure 1 @random_owned | 15 | `roads_paved` |
| `black_iron_seams` | Black Iron Seams | herds_of_the_hills | – | 5,3 | 35 | equipment zin_arms_equipment 300; building industrial_complex 1 @random_owned | 15 | `mine_cart` |
| `market_of_the_holds` | A Market for the Holds | slag_roads | – | 7,3 | 35 | add_spirit hold_market | 15 | `market_stalls` |
| `the_hold_provides` | The Hold Provides | black_iron_seams + market_of_the_holds | – | 6,4 | 70 | add_spirit hold_provides; building arms_factory 1 @random_owned | 15 | `foundry_fire` |

### D3. No Master but Our Own

**Purpose:** the mechanic's hold defence against Goldoroth's sway. **Opens:** `allow_branch` and `available` on `no_master_but_our_own`: check `zin_dark_is_free_hold`. **Mechanic:** sway, `zin_dark_gifts_returned`, `zin_dark_refused_yoke`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `no_master_but_our_own` | No Master but Our Own | hall_of_the_hold | – | 10,1 | 35 | Sway −10 | 30; ×0.3 if sway ≥ 50; hist ×1 | `chain_broken` |
| `return_cocanoors_gifts` | Return Cocanoor's Gifts | no_master_but_our_own | – | 9,2 | 35 | Sway −5; flag zin_dark_gifts_returned; Opinion Goldoroth −10 (gifts_returned) | 15; ×0 if sway ≥ 50 | `tribute_chest` |
| `walls_of_the_hold` | Walls of [ROOT.GetName] | no_master_but_our_own | – | 11,2 | 35 | building bunker 2 @capital | 20 | `fort_wall` |
| `the_proud_hall` | The Proud Hall | return_cocanoors_gifts + walls_of_the_hold | – | 10,3 | 70 | add_spirit proud_hall; Sway −10 | 15 | `banner_plain` |
| `the_hall_answers_no_one` | The Hall Answers No One | the_proud_hall | – | 10,4 | 35 | Avail: flag zin_dark_refused_yoke or after 1752.1.1. war_support 0.10; building bunker 1 @capital | 25 | `orc_axe` |

### D4. Under the Iron Yoke

**Purpose:** life as Goldoroth's tributary: pay the tithe, send warbands, get a voice at Cocanoor; then wear the yoke lightly or slip it. **Opens:** `allow_branch` and `available` on `the_iron_tithe`: check `zin_dark_is_tributary`. **Mutual exclusions:** `bear_the_yoke` / `slip_the_yoke`. **Mechanic:** sway (toward One Fire Under Cocanoor), autonomy.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_iron_tithe` | The Iron Tithe | hall_of_the_hold | – | 14,1 | 35 | stability 0.05; political_power 25 | 60 | `tribute_chest` |
| `warbands_for_cocanoor` | Warbands of [ROOT.GetName] for Cocanoor | the_iron_tithe | – | 13,2 | 35 | army_experience 10; Opinion Goldoroth +10 (warbands_sent) | 20 | `orc_axe` |
| `a_chief_at_cocanoor` | A Chief at Cocanoor | the_iron_tithe | – | 15,2 | 35 | add_spirit chief_at_cocanoor | 20 | `council_table` |
| `bear_the_yoke` | Bear the Yoke | warbands_for_cocanoor / a_chief_at_cocanoor | slip_the_yoke | 13,3 | 70 | Sway +10; political_power 50 | 20; hist ×2; ×0 if flag zin_dark_moot_member | `charter_golden` |
| `slip_the_yoke` | Slip the Yoke | warbands_for_cocanoor / a_chief_at_cocanoor | bear_the_yoke | 15,3 | 70 | Avail: Goldoroth at_war with a country other than ROOT, or global_flag zin_volgan_body_destroyed. call zin_shared_dark_lands_gain_autonomy; Sway −15 | 10; hist ×0; free ×2 | `chain_broken` |
| `the_yoke_lies_lighter` | The Yoke Lies Lighter | bear_the_yoke / slip_the_yoke | – | 14,4 | 35 | stability 0.05; political_power 25 | 15 | `scroll_treaty` |

### D5. The Dark Sea Accord

**Purpose:** a hold of the Accord beside Dondor's Brutes (Belonton at start). **Opens:** `allow_branch` and `available` on `oath_of_the_accord`: check `zin_dark_is_accord_member`. **Mechanic:** resolve; `zin_dark_oath_sworn`, which halves the AI chance of "Take the gold" (`zin_goldoroth.8`) and "Leave the Accord" (`zin_goldoroth.19`).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `oath_of_the_accord` | The Oath of the Accord | hall_of_the_hold | – | 17,1 | 35 | flag zin_dark_oath_sworn; Resolve +3; Opinion Dondor +10 (accord_oath) | 40; hist ×2 | `handshake_oath` |
| `hills_with_beacons` | Beacons on Our Hills | oath_of_the_accord | – | 16,2 | 35 | building bunker 1 @capital; Resolve +2 | 20 | `beacon` |
| `axes_for_the_accord` | Axes for the Accord | oath_of_the_accord | – | 18,2 | 35 | army_experience 10; add_spirit accord_kin | 20 | `orc_axe` |
| `brutes_and_axes` | Brutes and Axes | hills_with_beacons + axes_for_the_accord | – | 17,3 | 70 | add_spirit brutes_and_axes; Resolve +5 | 15 | `alliance_rings` |

### D6. The Free Moot

**Purpose:** the free holds' own league. **Opens:** `allow_branch` and `available` on `speak_at_the_moot_stone`: check `zin_dark_is_free_hold`. **Mechanic:** `zin_dark_found_free_moot` (the decision Call the Free Moot without its cost) and `zin_dark_join_free_moot` (the accept option of `zin_dark.70`), both proposed mechanic effects.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `speak_at_the_moot_stone` | Speak at the Moot Stone | hall_of_the_hold | – | 21,1 | 35 | call zin_shared_dark_lands_moot_goodwill | 25 | `rune_stone` |
| `answer_the_moot` | Answer the Moot | speak_at_the_moot_stone | – | 20,2 | 35 | Avail: global_flag zin_dark_free_moot; not flag zin_dark_moot_member. call zin_dark_join_free_moot | 0; 60 when available; ×0.3 if sway ≥ 50 | `banner_league` |
| `call_the_moot` | Call the Moot | speak_at_the_moot_stone | – | 22,2 | 35 | Avail: not global_flag zin_dark_free_moot; check zin_shared_dark_lands_moot_allowed. call zin_dark_found_free_moot | 0; 30 when available; ×0.5 if Dulundur exists and is a free hold | `rune_stone` |
| `the_moot_rides` | The Moot Rides | answer_the_moot / call_the_moot | – | 21,3 | 35 | Avail: flag zin_dark_moot_member; at_war. war_support 0.05; army_experience 10 | 100 when available | `war_drums` |

### D7. Strangers from the South

**Purpose:** Volgan's envoys reach every hold. The hold answers either way. **Opens:** at start; `strangers_from_the_south` needs `zin_volgan_pact` ≥ 1 or 1 Deepwinter 4A 1750. **Mutual exclusions:** `send_them_back_south` / `spoils_from_the_south`. **Mechanic:** `zin_dark_add_volgan_pact`; `zin_dark_took_southern_gifts` (×1.5 to the envoy acceptance chance); pact 2 and 3 come only from Volgan's own focuses.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `strangers_from_the_south` | Strangers from the South | hall_of_the_hold | – | 24,1 | 35 | Avail: variable zin_volgan_pact above 0 or after 1750.1.1. event `strangers_at_the_hall` | 30 | `envoy` |
| `send_them_back_south` | Send Them Back South | strangers_from_the_south | spoils_from_the_south | 23,2 | 35 | Pact −1; Opinion Volgan −15 (south_refused); stability 0.03 | 30; hist ×3; ×0.2 if tributary and south | `chain_broken` |
| `spoils_from_the_south` | Spoils from the South | strangers_from_the_south | send_them_back_south | 25,2 | 35 | Pact +1; equipment zin_arms_equipment 300; flag zin_dark_took_southern_gifts | 10; hist ×0.3; ×5 if tributary and south | `coin_chest` |
| `the_long_memory` | The Long Memory | send_them_back_south | – | 23,3 | 35 | add_spirit long_memory | 20 | `book_lore` |
| `the_southern_road` | The Southern Road | spoils_from_the_south | – | 25,3 | 35 | Avail: global_flag zin_volgan_marches; variable zin_volgan_pact above 1. war_support 0.10; army_experience 10 | 100 when available | `banner_black` |
| `when_the_south_falls_silent` | When the South Falls Silent | the_long_memory / the_southern_road | – | 24,4 | 35 | Avail: global_flag zin_volgan_body_destroyed. stability 0.05; war_support −0.05. Text: the southern camps are quiet; what remains of their master, no one at the hall can say | 100 when available | `silent_throne` |

### D8. The Sea of Darkness

**Purpose:** boats, fish, black-sail watch and a harbour that counts toward the mechanic's sea mastery. Dun, "the swing power of the dark seas" (roster), plays here. **Opens:** `allow_branch` and `available` on `fishers_of_the_dark_sea`: check `zin_shared_dark_lands_on_dark_sea`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `fishers_of_the_dark_sea` | Fishers of the Dark Sea | hall_of_the_hold | – | 28,1 | 70 | building dockyard 1 @random_coastal; add_spirit dark_sea_fishers | 25 | `fishing_boats` |
| `hide_and_reed_boats` | Hide and Reed Boats | fishers_of_the_dark_sea | – | 27,2 | 35 | navy_experience 10; research [zin_cat_galleys] 50% ×1 | 15 | `galley_oars` |
| `watch_for_black_sails` | Watch for Black Sails | fishers_of_the_dark_sea | – | 29,2 | 35 | add_spirit black_sail_watch; building coastal_bunker 1 @random_coastal | 20 | `corsair_raider` |
| `harbour_of_the_hold` | Harbour of [ROOT.GetName] | hide_and_reed_boats + watch_for_black_sails | – | 28,3 | 70 | building naval_base 1 @random_coastal; building naval_base 1 @random_coastal | 15 | `harbour_lake` |
| `swing_of_the_dark_seas` | The Swing of the Dark Seas | harbour_of_the_hold | – | 28,4 | 35 | add_spirit dark_sea_traders; political_power 50 | 15 | `warship_sail` |

### D9. The Dead on the Shore

**Purpose:** the northern shore when Zol's dead rise. **Opens:** `allow_branch` on `dead_on_our_shore`: check `zin_shared_dark_lands_faces_the_north`; `available`: global_flag `zin_zol_rising`. **Mechanic:** the mechanic's `zin_dark.80` "Dead on the Dark Shore" runs regardless; these focuses add forts and the access the living need.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `dead_on_our_shore` | Dead on Our Shore | hall_of_the_hold | – | 31,1 | 35 | Avail: global_flag zin_zol_rising. building coastal_bunker 1 @random_coastal; army_experience 5 | 0; 200 when available | `black_hulls` |
| `fire_on_the_beaches` | Fire on the Beaches | dead_on_our_shore | – | 31,2 | 35 | add_spirit beach_fires. Text: "Fire breaks their shapes. It does not end them." | 100 | `beacon` |
| `the_living_stand_together` | The Living Stand Together | fire_on_the_beaches | – | 31,3 | 35 | Avail: at_war_with Zol. call zin_shared_dark_lands_access_against_dead; Tension −5 | 100 | `handshake_oath` |

### D10. Kin of the Hold

**Purpose:** content for the other peoples of a hold. Goblin, troll and ogre content opens only when the owner assigns those peoples (as primary or minor) in `countries.csv`; until then the module is hidden for every hold except where a troll or ogre minor people exists. **Opens:** each head has its own `allow_branch` and `available` with the people trigger; heads have no prerequisite.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_warrens_below` | The Warrens Below | – | – | 1,6 | 35 | allow_branch and Avail: zin_people_includes_goblins. manpower 2000; add_spirit warrens | 30 | `goblin_raiders` |
| `knife_runners` | Knife-Runners | the_warrens_below | – | 1,7 | 35 | research [zin_cat_bows] 50% ×1; army_experience 5 | 20 | `goblin_raiders` |
| `troll_kin_of_the_hold` | Troll-Kin of [ROOT.GetName] | – | – | 3,6 | 35 | allow_branch and Avail: zin_people_includes_trolls. equipment zin_troll_gear_equipment 200; add_spirit troll_kin | 30 | `troll_club` |
| `ogre_chiefs` | Ogre Chiefs | – | – | 5,6 | 35 | allow_branch and Avail: zin_people_includes_ogres. equipment zin_ogre_gear_equipment 200; add_spirit ogre_chiefs | 30 | `troll_club` |

### D11. The Hold's Customs

**Purpose:** a hold whose government has changed reads differently. **Opens:** each head has its own `allow_branch` and `available` on the ruling ideology; all are hidden for a Wild hold (the start case). A hold becomes Shadow only through the mechanics (Goldoroth kneeling to Nafeher, occupation drift); a Light or Dominion hold comes from play.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `hearth_speakers` | The Hearth Speakers | – | – | 7,6 | 35 | allow_branch and Avail: ideology light. add_spirit hearth_speakers; stability 0.05 | 50 | `beacon` |
| `the_warchiefs_host` | The Warchief's Host | – | – | 8,6 | 35 | allow_branch and Avail: ideology dominion. add_spirit warchiefs_host; political_power 25 | 50 | `war_drums` |
| `heralds_of_the_south` | Heralds of the South | – | – | 9,6 | 35 | allow_branch and Avail: ideology shadow. add_spirit heralds; war_support 0.10 | 50 | `banner_black` |

### D12. The Hold at War

**Purpose:** a short defensive module for any war that reaches the hold. **Opens:** `available` on `the_hold_at_war`: `at_war`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_hold_at_war` | [ROOT.GetName] at War | – | – | 14,6 | 21 | Avail: at_war. war_support 0.10; manpower 1000 | 0; 300 when available | `war_drums` |
| `hold_the_hall` | Hold the Hall | the_hold_at_war | – | 13,7 | 21 | building bunker 1 @capital; timed_spirit hold_the_hall 180 | 100 | `fort_wall` |
| `raiders_of_the_hold` | Raiders of the Hold | the_hold_at_war | – | 15,7 | 21 | army_experience 15; timed_spirit hold_raiders 180 | 100 | `goblin_raiders` |
| `the_holds_peace` | The Hold's Peace | hold_the_hall / raiders_of_the_hold | – | 14,8 | 35 | Avail: not at_war. stability 0.10; war_support −0.05 | 100 | `olive_branch` |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `clan_meet` | The Clan-Meet | `stability_factor` 0.05, `political_power_factor` −0.05 | `the_clan_meet`; replaced in D1 |
| `chiefs_fire` | One Chief, One Fire | `political_power_gain` 0.10, `war_support_factor` 0.03 | `one_chief_one_fire` |
| `every_clan` | Every Clan a Voice | `stability_factor` 0.05, `recruitable_population_factor` 0.05 | `every_clan_a_voice` |
| `hill_herds` | Herds of the Hills | `monthly_population` 0.05, `consumer_goods_factor` −0.02 | `herds_of_the_hills` |
| `hold_market` | A Market for the Holds | `trade_opinion_factor` 0.10 | `market_of_the_holds` |
| `hold_provides` | The Hold Provides | `production_speed_buildings_factor` 0.05 | `the_hold_provides` |
| `proud_hall` | The Proud Hall | `drift_defence_factor` 0.15, `army_core_defence_factor` 0.10 | `the_proud_hall` |
| `chief_at_cocanoor` | A Chief at Cocanoor | `political_power_gain` 0.05, `stability_factor` 0.03 | `a_chief_at_cocanoor`; removed when the hold leaves the yoke |
| `accord_kin` | Axes for the Accord | `army_defence_factor` 0.05 | `axes_for_the_accord`; removed when the hold leaves the Accord |
| `brutes_and_axes` | Brutes and Axes | `army_org_factor` 0.05, `army_core_defence_factor` 0.05 | `brutes_and_axes`; removed when the hold leaves the Accord |
| `long_memory` | The Long Memory | `drift_defence_factor` 0.10, `enemy_operative_detection_chance_factor` 0.10 | `the_long_memory` |
| `dark_sea_fishers` | Fishers of the Dark Sea | `monthly_population` 0.05 | `fishers_of_the_dark_sea` |
| `black_sail_watch` | Watch for Black Sails | `naval_detection` 0.10, `coastal_bunker_effectiveness_factor` 0.10 | `watch_for_black_sails` |
| `dark_sea_traders` | The Swing of the Dark Seas | `trade_opinion_factor` 0.10, `naval_speed_factor` 0.05 | `swing_of_the_dark_seas` |
| `beach_fires` | Fire on the Beaches | `coastal_bunker_effectiveness_factor` 0.15, `army_defence_factor` 0.05 | `fire_on_the_beaches`; removed on `zin_zol_withdrawn` |
| `warrens` | The Warrens Below | `recruitable_population_factor` 0.05, `army_speed_factor` 0.03 | `the_warrens_below` |
| `troll_kin` | Troll-Kin of the Hold | `breakthrough_factor` 0.05 | `troll_kin_of_the_hold` |
| `ogre_chiefs` | Ogre Chiefs | `army_attack_factor` 0.03, `army_org_factor` −0.02 | `ogre_chiefs` |
| `hearth_speakers` | The Hearth Speakers | `stability_factor` 0.05, `drift_defence_factor` 0.10 | `hearth_speakers`; removed if the government changes |
| `warchiefs_host` | The Warchief's Host | `war_support_factor` 0.05, `political_power_gain` 0.05 | `the_warchiefs_host`; removed if the government changes |
| `heralds` | Heralds of the South | `war_support_factor` 0.05, `army_morale_factor` 0.05 | `heralds_of_the_south`; removed if the government changes |
| `hold_the_hall` | Hold the Hall | `army_defence_factor` 0.10 | timed, 180 days |
| `hold_raiders` | Raiders of the Hold | `army_attack_factor` 0.05 | timed, 180 days |

### Events (namespace `zin_shared_dark_lands`)

| # | Key | Title | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- |
| 1 | `the_holds_fire` | The Hall-Fire of [ROOT.GetName] | ROOT | Root focus | "The chief speaks first." (political_power 25; AI 50) / "The clans speak first." (stability 0.02; AI 50) |
| 2 | `strangers_at_the_hall` | Strangers at the Hall | ROOT | Strangers from the South | One option. Text: men from the south, with gifts and good iron, speak of spoils in the north. They say they come from Nafeher. They do not say more |

The mechanic's events reach these holds directly: `zin_dark.12` (raids), `.13` (corsairs), `.20` (Accord invitation), `.50` (the Iron Yoke), `.70`–`.72` (the Moot), `.80` (the dead on the shore), `.82` (the South falls silent); Goldoroth's `zin_goldoroth.8` and `.19` reach Belonton; Volgan's `zin_dominion.8` reaches every hold.

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/focus/shared_dark_lands.json` | Tree data, `"tier": "shared"`, the 17 countries |
| `common/national_focus/zin_shared_dark_lands.txt` | Compiled tree (`shared_focus` not used; one tree with `allow_branch`) |
| `common/ideas/zin_focus_shared_dark_lands.txt` | Spirits |
| `events/zin_shared_dark_lands.txt` | Events 1 and 2 |
| `common/scripted_triggers/zin_shared_dark_lands.txt`, `common/scripted_effects/zin_shared_dark_lands.txt` | Below |
| `common/opinion_modifiers/zin_shared_dark_lands.txt` | `gifts_returned` (−10, decay 1 a month), `warbands_sent` (+10, decay 0.5), `accord_oath` (+10, none), `south_refused` (−15, decay 1), `hold_kin` (+10, decay 0.5) |
| `localisation/english/zin_focus_shared_dark_lands_l_english.yml` | Text with `[ROOT.GetName]` and `[ROOT.GetAdjective]` |

### Tree-declared scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_shared_dark_lands_on_dark_sea` | country | `any_owned_state = { zin_is_site_sea_of_darkness_coast = yes }` |
| `zin_shared_dark_lands_faces_the_north` | country | `any_owned_state = { OR = { zin_is_site_dark_strait_north_shore = yes zin_is_site_ocean_of_zol_coast = yes } }` |
| `zin_shared_dark_lands_moot_allowed` | country | The mechanic's Call the Free Moot conditions: ROOT passes `zin_dark_is_free_hold`, `zin_volgan_pact` ≤ 2, not in the Southern Dominion; and Goldoroth's unity ≥ 30, or Goldoroth holds `zin_cb_hold_defiance` against any hold, or Goldoroth is at war with a hold |

### Tree-declared scripted effects

| Effect | Does |
| --- | --- |
| `zin_shared_dark_lands_opinion` (`who`, `modifier`) | Adds the tree's opinion modifier from `who` toward ROOT |
| `zin_shared_dark_lands_moot_goodwill` | Tree opinion modifier `hold_kin` (+10, decay 0.5 a month) both ways with every free hold (the mechanic's `zin_dark_moot_kin` stays for Moot members only) |
| `zin_shared_dark_lands_gain_autonomy` | `add_autonomy_ratio = { value = 0.2 }` |
| `zin_shared_dark_lands_access_against_dead` | Military access both ways (`give_military_access`) with every Dark Lands country at war with Zol |

### New site trigger

`zin_is_site_ocean_of_zol_coast` (state): the state has a coastal province on a sea region of the Ocean of Zol. Generated in `zin_sites.txt` from the key sites table ([../../01_map/02_key_sites.md](../../01_map/02_key_sites.md)); the same list the Zol spec's rumour rolls and `zin_lore.180` already use.

### Data checks

1. Each of the 17 countries maps to this tree and no other.
2. No focus has an effect that creates a war goal, a claim or a declaration.
3. Every `allow_branch` head repeats its condition in `available`.
4. No text names a hold as goblin; no text names Afrit.

## AI

| Situation | Behaviour |
| --- | --- |
| Free hold, sway < 50 | D1, D2, D3, D7 (*Send Them Back South*, hist ×3), D6 when the Moot exists |
| Free hold, sway ≥ 50 | D1, D2, D7; D3 weights ×0.3 (the hold is bending); *Answer the Moot* ×0.3 |
| Tributary | D4 (*Bear the Yoke*, hist ×2), D2; with Goldoroth on the Southern Bargain, *Spoils from the South* ×5 |
| Accord member (Belonton) | D5 first (*The Oath of the Accord* in 4A 1748), then D2, D7 |
| Sea of Darkness coast | D8 after D2 |
| War | D12 first; D9 on `zin_zol_rising` |

Under PLAUSIBLE every "hist" factor f becomes 1 + (f − 1) ÷ 2; under FREE the base weights apply.

## Acceptance

1. The compiled tree has 57 focuses with unique positions; every focus sits below its prerequisites; the compiler and the HOI4 Agent Tools focus inspector pass.
2. Every one of the 17 countries maps to `shared_dark_lands`.
3. On 1 Thaw 4A 1748, for each country, the focus inspector shows D4 hidden (no tributaries yet), D5 visible only for Belonton, D10 and D11 hidden, and no available focus that declares war or claims.
4. A hold made Goldoroth's tributary sees D4 and loses D3 and D6 after the next pulse; a tributary cannot take *Answer the Moot*.
5. *Send Them Back South* lowers `zin_volgan_pact` by 1; *Spoils from the South* raises it by 1 and never to 3.
6. Belonton with `zin_dark_oath_sworn` takes Goldoroth's gold (`zin_goldoroth.8`) at half the base AI chance in a scripted test.
7. Every modifier in the spirit table exists in the modifier documentation; every called effect and trigger exists in the staged files.
8. The localisation check finds no "Afrit", no hold called goblin, no claim that fire ends Zol's dead.

## Open questions

1. **Goblin and ogre holds.** Which of the 17 holds are goblin or ogre holds, or have them as minor peoples? D10 waits for that decision.
2. **Coasts.** Which holds lie on the Sea of Darkness, on the northern strait or on the Ocean of Zol? The builder computes it from the map; the owner may want named island holds (the Gull Kingdom, the Lestern Isles) to count as sea powers even with small coasts.
3. **Belonton.** The tree treats Belonton, an orc confederacy, as a sworn Accord member beside human Dondor (roster). Confirm.
4. **Dun.** The roster calls Dun "the swing power of the dark seas". Should Dun get its own tier B tree later, or is D8 enough?
