# Shared Tree: The Southern Isles

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

The shared focus tree for the **15 tier C island realms of the Islands of the South** (tree id `shared_islands_of_the_south`, focus ids `zin_shared_islands_of_the_south_<key>`, data file `docs/design/focus/shared_islands_of_the_south.json`). The Islands of the South are small, poor and hospitable (proposed characterisation). They have no great-power mechanic of their own. Their place in the age is the guest-right: in 4A 1751 a storm carries a stranger to their shores, they shelter him, and they send him on to Gala (established). This tree gives each island a life before and after that: fishing and salt, feasts and castaways, old tales, the priests who come to the quays, the island's own rule, ships and navigators, and the storm years when the world's war is far away.

The tree is also the **module library** for the four tier B island trees ([../regional/islands_of_the_south.md](../regional/islands_of_the_south.md)). Its branches are labelled I1 to I9; the tier B trees copy I1, I2, I3, I4, I7 and I9 whole, with the same keys, effects, spirits and inner positions.

| Item | Value |
| --- | --- |
| Tree id | `shared_islands_of_the_south` |
| Tier | C (shared; size 40 to 70 focuses) |
| Countries (15) | Agla, Kea, Yumbo, Angsutz, Dunn, Finn, Jingar, Lua, Meng, Pon, Sidea Islands, Torsor, Yongrost, Yongyong, Yowi-yoor |
| Focuses | 46 in ten parts (root and modules I1 to I9) |
| Width | columns 0 to 24, rows 0 to 8 |
| Events | namespace `zin_shared_islands_of_the_south` (two events) |
| Spirits | `zin_shared_islands_of_the_south_<key>` (13) |
| Raw blocks | none |
| Builder | `tools/content/modules/focus_compiler.mjs` ([../00_format_and_compiler.md](../00_format_and_compiler.md)) |

## Lore basis

**Established** (vault): the Islands of the South form two arcs south of the West Lands (*Erdae and Its Regions*; Howan, Nara, Verde and Enhis Is Rond named); Eindil sails for Aenor, storms carry him to the Islands of the South, he lives among the islanders, helps them settle disputes and survive dangers, and hears of the long-lived elves farther south-west; Lorien's crew includes island navigators; the islanders' saying sends tales too old for any man to explain to Gala (*The Fourth Age of Erdae* IV; the saying is in the established chronicle text).

**Proposed in the vault:** the reef of drowned voices and the shrine beneath the tide that repeats Aen's name (proposed island legends); the characterisation "small, poor and hospitable" (*The Campaign of 4A 1748*); the Houses of the First Light as the public face of the Deliverer's network.

**Proposed in other specs and used here:** the journey's stage 4 and ports of call ([../../04_mechanics/eindil_journey.md](../../04_mechanics/eindil_journey.md)); Lorien's counsel ([../../04_mechanics/lands_of_the_sun.md](../../04_mechanics/lands_of_the_sun.md)); the Western Crossing's fleet ([../../04_mechanics/western_crossing.md](../../04_mechanics/western_crossing.md)); footholds 1 at start and cap 3 ([../../04_mechanics/afrit_hidden_council.md](../../04_mechanics/afrit_hidden_council.md)); the regional spirit Hospitable Isles (economy spec).

**Proposed here:** every focus, spirit, event and number.

**Kept open:** which island holds the reef and the shrine (the journey spec proposes Nara or Verde and Enhis Is Rond; this tree does not place them).

## Design

### The peaceful start

On 1 Thaw 4A 1748 every island is at peace. No focus in this tree declares war, creates a war goal or claims land, at any date. War content (I9) answers wars other people start.

### Who sees what

`allow_branch` is evaluated when the tree is set up, so it is used only for conditions fixed at the start (coast, people, size, start ideology). Subject status and the story use `available`.

| Opens by | Condition | Module |
| --- | --- | --- |
| Region | every country of the tree | Root, I2, I3, I4 |
| Coast | `allow_branch`: `check zin_shared_has_coast` on the module head | I1 The Sea Provides |
| Coast and people | `allow_branch`: `check zin_shared_has_coast` and `people: men` (the island navigators of Lorien's crew are men of the islands, established) | I7 Ships and Navigators |
| Ideology | `allow_branch`: Light or Wild / Wild / Dominion or Wild | the three heads of I5 |
| Size | `allow_branch`: `check zin_shared_islands_of_the_south_large` (owns a state besides its capital; today Agla, Kea and Yumbo) | I6 Two Shores |
| Overlord | `available`: `is_subject` | I8 Under a Protector |
| Story | `available`: `global_flag zin_war_of_last_crowns` | I9 The Storm Years |

Every realm of the tree is an island realm of men, Wild (the game's `neutrality`) and coastal today. The people condition only matters if a country of another people comes to rule an island.

### Text

Names and descriptions use `[ROOT.GetName]` and `[ROOT.GetAdjective]`. **The stranger.** Before `zin_eindil_awake` no text speaks of him at all. Text reachable only after that (tooltips inside effects whose limit needs journey stage 4 or later) calls him "the stranger". Island text never uses his name, and never uses `[zin_loc_eindil]` either, because that key shows his name from `zin_eindil_named` (stage 5) while the naming is not public news until the journey's stage 8. The journey effects' own tooltips are the journey spec's. Focus names and descriptions, which every player can read at any date, never mention him: the I9 focus that aids his host is "Ships for the Gathering Host". **The Deliverer.** Before `zin_afrit_revealed` his people are "priests from the north", "healers of the Deliverer" and the kindly Houses of the First Light; no text names Afrit.

### Module map

| Module | Name | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| Root | [ROOT.GetName] Keeps Its Shores | 12 | 0 | 1 | start | — |
| I1 | The Sea Provides | 0–2 | 1–4 | 6 | coast | economy |
| I2 | The Guest-Right | 4–6 | 1–4 | 6 | start | hospitality; the journey's regard; Lorien's counsel |
| I3 | Old Tales of the Isles | 8–10 | 1–3 | 4 | start | research, flavour |
| I4 | Priests at the Quays | 11–13 | 1–3 | 4 | start | `zin_footholds`, purge |
| I5 | The Island's Rule | 14–18 | 1–3 | 7 | start; heads by ideology | drift, government spirits |
| I6 | Two Shores | 19–21 | 1–3 | 4 | 2+ states | inland development |
| I7 | Ships and Navigators | 22–24 | 1–4 | 6 | coast and people | navy; the Western Crossing's fleet; Gala's counsel |
| I8 | Under a Protector | 0–2 | 6–7 | 3 | subject | autonomy |
| I9 | The Storm Years | 11–15 | 6–8 | 5 | `zin_war_of_last_crowns` | neutrality, island pacts, aid to the gathering host |

### Notation

`a + b` and `a / b` for prerequisites; `allow_branch:` and `Avail:` list the focus's conditions. **Footholds ±n** = `call zin_afrit_add_footholds(value = n)`; **Drift X +n** = `call zin_politics_add_drift(IDEOLOGY = X, VALUE = n)`; **Counsel +n** = `call zin_sun_add_gala_counsel(value = n)`; **Regard +n** = `call zin_eindil_add_regard(value = n)` on ROOT. **stage** = the global variable `zin_eindil_stage`; "stage 4 to 6" compiles to `{ "variable": { "name": "global.zin_eindil_stage", "above": 3 } }` and the `not` form of `above: 6`; "stage 4" is "stage 4 to 4". **footholds** = `zin_footholds` on ROOT; **regard** = `zin_eindil_regard` on ROOT. **AI** is `ai.base`, then factor modifiers; **hist** = `check zin_rules_is_historical`. Research categories are the warfare spec's `zin_cat_*` keys (a build before warfare stage 2 maps `zin_cat_galleys` to `naval_equipment`).

### Root

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `keepers_of_the_shore` | [ROOT.GetName] Keeps Its Shores | – | – | 12,0 | 70 | political_power 50; stability 0.02 | 100 | `fishing_boats` |

### I1. The Sea Provides

**Purpose:** fish, salt, pearls and boats: the island's living. **Opens:** `allow_branch` on `nets_and_boats`: `check zin_shared_has_coast`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `nets_and_boats` | Nets and Boats | keepers_of_the_shore | – | 1,1 | 70 | allow_branch: check zin_shared_has_coast. building dockyard 1 @random_coastal; political_power 25 | 40 | `fishing_boats` |
| `salt_pans` | The Salt Pans | nets_and_boats | – | 0,2 | 35 | political_power 50 | 30 | `granary` |
| `pearl_divers` | The Pearl Divers | nets_and_boats | – | 2,2 | 35 | political_power 25; stability 0.02 | 25 | `coin_chest` |
| `boatwrights_of_the_isles` | Boatwrights of the Isles | salt_pans | – | 0,3 | 70 | building industrial_complex 1 @capital | 25 | `shipwright_yard` |
| `island_markets` | Island Markets | salt_pans / pearl_divers | – | 2,3 | 70 | add_spirit island_markets_spirit | 25 | `market_stalls` |
| `the_fishing_fleets` | The Fishing Fleets | boatwrights_of_the_isles / island_markets | – | 1,4 | 70 | add_spirit fishing_fleets | 20 | `anchor_rope` |

### I2. The Guest-Right

**Purpose:** the islands' custom of shelter: feasts, rescue boats, lamps on the reefs, and the saying that sends old tales to Gala. When the stranger comes (journey stage 4), these focuses give the journey's regard. **Opens:** at start. **Mechanic:** `zin_eindil_add_regard` (only inside an `if` whose limit needs the stranger among the islands or calling at their ports; the engine shows that tooltip only while the limit holds), `zin_sun_add_gala_counsel`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_guest_right` | The Guest-Right | keepers_of_the_shore | – | 5,1 | 70 | add_spirit guest_right | 40; hist ×1.5 | `feast_table` |
| `island_feasts` | Island Feasts | the_guest_right | – | 4,2 | 35 | event .1 | 25 | `feast_table` |
| `shelter_for_the_wrecked` | Shelter for the Wrecked | the_guest_right | – | 6,2 | 70 | building naval_base 1 @random_coastal; if stage 4 and check zin_eindil_is_host: Regard +10 | 30 | `shipwreck` |
| `lamps_on_the_reefs` | Lamps on the Reefs | island_feasts / shelter_for_the_wrecked | – | 4,3 | 70 | add_spirit reef_lamps | 20 | `lighthouse` |
| `carry_it_to_gala` | Carry It to Gala | shelter_for_the_wrecked | – | 6,3 | 35 | Avail: exists Gala Elves. Counsel +3; political_power 25; tooltip "When the tales of men grow too old for any man to explain, carry them to Gala." | 20 | `book_lore` |
| `a_welcome_on_every_shore` | A Welcome on Every Shore | lamps_on_the_reefs / carry_it_to_gala | – | 5,4 | 70 | stability 0.03; political_power 25; if stage 4 to 6: Regard +10 | 20 | `olive_branch` |

### I3. Old Tales of the Isles

**Purpose:** the islands' memory: reef songs, old names, tales told to strangers. **Opens:** at start.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `old_tales_of_the_isles` | Old Tales of the Isles | keepers_of_the_shore | – | 9,1 | 35 | political_power 25 | 25 | `book_lore` |
| `the_reef_singers` | The Reef Singers | old_tales_of_the_isles | – | 8,2 | 35 | event .2 | 20 | `storm_sea` |
| `keepers_of_old_names` | Keepers of Old Names | old_tales_of_the_isles | – | 10,2 | 70 | research [industry] 50% ×1 | 15 | `scroll_sealed` |
| `songs_for_strangers` | Songs for Strangers | the_reef_singers / keepers_of_old_names | – | 9,3 | 70 | add_spirit old_tales | 15 | `hymn_choir` |

### I4. Priests at the Quays

**Purpose:** the Deliverer's healers and their Houses of the First Light reach even the southern isles (footholds 1 at start, cap 3). An island may welcome their house of healing or send them on courteously; after the reveal, or when suspicious, it may close the Houses. **Mutual exclusions:** `welcome_the_healers` / `send_them_on_their_way`. **Mechanic:** `zin_afrit_add_footholds`, `zin_afrit_purge_houses`.

The journey's option "Sell news of him to the Deliverer's priests" needs priests at the quays to buy it: an island at footholds 0 has no one to sell to (proposed dependency for the journey spec: that option is unavailable at footholds 0).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `priests_at_the_quays` | Priests at the Quays | keepers_of_the_shore | – | 12,1 | 35 | stability 0.02 | 30 | `courier_pilgrim` |
| `welcome_the_healers` | Welcome the Healers | priests_at_the_quays | send_them_on_their_way | 11,2 | 70 | Footholds +1; add_spirit healers_at_the_quays | 25; hist ×1.5 | `house_first_light` |
| `send_them_on_their_way` | Send Them on Their Way | priests_at_the_quays | welcome_the_healers | 13,2 | 35 | Footholds −1; political_power 25 | 15; ×2 ideology light | `anchor_rope` |
| `close_the_houses_of_the_isle` | Close the Houses of the Isle | welcome_the_healers / send_them_on_their_way | – | 12,3 | 35 | Avail: global_flag zin_afrit_revealed, or flag zin_afrit_suspicious; footholds ≥ 1. call zin_afrit_purge_houses; remove_spirit healers_at_the_quays | 40; ×0 not global_flag zin_afrit_revealed | `chain_broken` |

### I5. The Island's Rule

**Purpose:** how the island is ruled: a council of speakers, a chief's hall, or a sea-king. **Opens:** `the_islands_rule` at start; each head has its own `allow_branch` on the start ideology. **Mutual exclusions:** the three heads.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_islands_rule` | The Rule of [ROOT.GetName] | keepers_of_the_shore | – | 16,1 | 35 | political_power 25 | 30 | `charter_old` |
| `the_speakers_council` | The Speakers' Council | the_islands_rule | the_chiefs_hall, a_sea_king | 14,2 | 70 | allow_branch: ideology light or wild. Drift light +5; stability 0.03 | 10; ×3 ideology light | `council_table` |
| `the_chiefs_hall` | The Chief's Hall | the_islands_rule | the_speakers_council, a_sea_king | 16,2 | 70 | allow_branch: ideology wild. Drift wild +3; army_experience 5; stability 0.03 | 20; ×2 ideology wild | `banner_plain` |
| `a_sea_king` | A Sea-King | the_islands_rule | the_speakers_council, the_chiefs_hall | 18,2 | 70 | allow_branch: ideology dominion or wild. Drift dominion +5; political_power 50 | 5 | `crown_iron` |
| `council_of_the_isle` | Council of the Isle | the_speakers_council | – | 14,3 | 70 | add_spirit speakers_council | 20 | `concord_circle` |
| `the_chiefs_moot` | The Chiefs' Moot | the_chiefs_hall | – | 16,3 | 70 | add_spirit chiefs_moot | 20 | `war_drums` |
| `the_sea_kings_law` | The Sea-King's Law | a_sea_king | – | 18,3 | 70 | add_spirit sea_kings_law | 20 | `sceptre` |

### I6. Two Shores

**Purpose:** the larger islands have an inland as well as a shore. **Opens:** `allow_branch` on `two_shores`: `check zin_shared_islands_of_the_south_large`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `two_shores` | Two Shores | keepers_of_the_shore | – | 20,1 | 35 | allow_branch: check zin_shared_islands_of_the_south_large. building infrastructure 1 @capital; political_power 25 | 30 | `map_unrolled` |
| `roads_across_the_isle` | Roads Across the Isle | two_shores | – | 19,2 | 70 | building infrastructure 1 @random_owned | 20 | `roads_paved` |
| `the_inland_fields` | The Inland Fields | two_shores | – | 21,2 | 70 | building industrial_complex 1 @random_owned | 20 | `farm_sowing` |
| `one_isle_one_law` | One Isle, One Law | roads_across_the_isle / the_inland_fields | – | 20,3 | 70 | stability 0.05; political_power 25 | 20 | `seal_wax` |

### I7. Ships and Navigators

**Purpose:** the island navigators. They can hire out hulls to the West when its kings decide to cross the sea, and they can sign on with the King of Gala's ships (established: island navigators sailed in Lorien's crew). **Opens:** `allow_branch` on `island_navigators`: `check zin_shared_has_coast` and `people: men`. **Mechanic:** `zin_west_add_fleet` (Western Crossing; island hulls in the crossing are a proposed gameplay link, owner question in [../../OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md), "regions: east, south isles, sun" 12), `zin_sun_add_gala_counsel`, `zin_eindil_add_regard`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `island_navigators` | Island Navigators | keepers_of_the_shore | – | 23,1 | 70 | allow_branch: check zin_shared_has_coast; people men. navy_experience 10; add_spirit island_navigators_spirit | 30 | `compass_rose` |
| `charts_of_the_southern_seas` | Charts of the Southern Seas | island_navigators | – | 22,2 | 70 | research [zin_cat_galleys] 50% ×1 | 20 | `sea_charts` |
| `galleys_of_the_isles` | Galleys of the Isles | island_navigators | – | 24,2 | 70 | building dockyard 1 @random_coastal | 20 | `galley_oars` |
| `hulls_for_hire` | Hulls for Hire | charts_of_the_southern_seas / galleys_of_the_isles | – | 22,3 | 35 | Avail: global_flag zin_west_route_crossing; not global_flag zin_western_crossing. call zin_west_add_fleet(value = 3); political_power 50 | 30 | `ship_voyage` |
| `navigators_for_gala` | Navigators for Gala | charts_of_the_southern_seas / galleys_of_the_isles | – | 24,3 | 35 | Avail: exists Gala Elves. Counsel +3; navy_experience 5; if stage 5: Regard +5 | 20; ×3 stage 5 | `ship_voyage` |
| `masters_of_the_southern_seas` | Masters of the Southern Seas | hulls_for_hire / navigators_for_gala | – | 23,4 | 70 | add_spirit southern_seas | 20 | `warship_sail` |

### I8. Under a Protector

**Opens:** `available` on `oath_to_the_protector` and both of its children: `is_subject` (no `allow_branch`, because subject status changes in play). **Mutual exclusions:** `loyal_isle` / `our_own_shores`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `oath_to_the_protector` | The Oath to the Protector | keepers_of_the_shore | – | 1,6 | 35 | Avail: is_subject. political_power 50 | 40 | `handshake_oath` |
| `loyal_isle` | A Loyal Isle | oath_to_the_protector | our_own_shores | 0,7 | 70 | Avail: is_subject. timed_spirit protectors_favour 1095; call zin_shared_islands_of_the_south_loyal_isle | 30 | `tribute_chest` |
| `our_own_shores` | Our Own Shores | oath_to_the_protector | loyal_isle | 2,7 | 70 | Avail: is_subject. call zin_shared_islands_of_the_south_own_shores; stability 0.03 | 20 | `charter_free` |

### I9. The Storm Years

**Purpose:** when the War of the Last Crowns begins, the southern isles are far from it. They can keep out of the kings' wars, bind the islands together in pacts of peace, and, when the stranger returns at the head of a host, send it ships and men. **Opens:** `the_storm_years` needs `zin_war_of_last_crowns`. **Mechanic:** `zin_eindil_aid_host`, `zin_eindil_has_host` (journey system: the Host of Eindil, Selen's armies under decision S2 or a dynamic country, exists).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_storm_years` | The Storm Years | keepers_of_the_shore | – | 13,6 | 35 | Avail: global_flag zin_war_of_last_crowns. political_power 50; war_support 0.05 | 200 when available | `storm_sea` |
| `far_from_the_kings_wars` | Far From the Kings' Wars | the_storm_years | – | 11,7 | 70 | timed_spirit far_from_the_war 730 | 40 | `olive_branch` |
| `the_isles_stand_together` | The Isles Stand Together | the_storm_years | – | 13,7 | 70 | call zin_shared_islands_of_the_south_island_pacts; stability 0.03 | 30 | `alliance_rings` |
| `ships_for_the_strangers_host` | Ships for the Gathering Host | the_storm_years | – | 15,7 | 35 | Avail: global_flag zin_eindil_returned; check zin_eindil_has_host. call zin_eindil_aid_host(equipment = 100, manpower = 300) (infantry equipment, as the journey spec's effect sends); Regard +10 | 30; ×2 regard ≥ 25 | `ship_voyage` |
| `watch_the_southern_waves` | Watch the Southern Waves | far_from_the_kings_wars / the_isles_stand_together / ships_for_the_strangers_host | – | 13,8 | 70 | building coastal_bunker 1 @random_coastal; navy_experience 5 | 20 | `beacon` |

`ships_for_the_strangers_host` keeps its key, which the tier B trees copy; only its name and description are neutral ("When a host gathers against the dead, the isles can send it boats and men.").

### Spirits

Ids `zin_shared_islands_of_the_south_<key>`. No spirit key equals a focus key (their localisation keys would collide). Every modifier key is in the 1.19.3 modifier documentation. Each spirit uses the icon of the focus that adds it.

| Key | Name | Icon | Modifiers | Added / removed |
| --- | --- | --- | --- | --- |
| `island_markets_spirit` | Island Markets | `market_stalls` | trade_opinion_factor 0.10, consumer_goods_factor −0.02 | `island_markets`; permanent |
| `fishing_fleets` | The Fishing Fleets | `anchor_rope` | monthly_population 0.05, consumer_goods_factor −0.02 | `the_fishing_fleets`; permanent |
| `guest_right` | The Guest-Right | `feast_table` | stability_factor 0.03, opinion_gain_monthly_factor 0.10 | `the_guest_right`; permanent |
| `reef_lamps` | Lamps on the Reefs | `lighthouse` | naval_detection 0.10, naval_speed_factor 0.03 | `lamps_on_the_reefs`; permanent |
| `old_tales` | Old Tales of the Isles | `hymn_choir` | research_speed_factor 0.02, stability_factor 0.02 | `songs_for_strangers`; permanent |
| `healers_at_the_quays` | Healers at the Quays | `house_first_light` | recruitable_population_factor 0.03, stability_factor 0.02 | `welcome_the_healers`; removed by `close_the_houses_of_the_isle` |
| `speakers_council` | Council of the Isle | `concord_circle` | stability_factor 0.05, political_power_gain 0.05 | `council_of_the_isle`; permanent |
| `chiefs_moot` | The Chiefs' Moot | `war_drums` | army_morale_factor 0.05, conscription_factor 0.03 | `the_chiefs_moot`; permanent |
| `sea_kings_law` | The Sea-King's Law | `sceptre` | political_power_factor 0.10, navy_org_factor 0.05 | `the_sea_kings_law`; permanent |
| `island_navigators_spirit` | Island Navigators | `compass_rose` | naval_speed_factor 0.05, navy_max_range_factor 0.10 | `island_navigators`; permanent |
| `southern_seas` | Masters of the Southern Seas | `warship_sail` | naval_damage_factor 0.05, convoy_escort_efficiency 0.10 | `masters_of_the_southern_seas`; permanent |
| `protectors_favour` | The Protector's Favour | `tribute_chest` | stability_factor 0.03, political_power_gain 0.05 | `loyal_isle`; timed, 1,095 days |
| `far_from_the_war` | Far From the Kings' Wars | `olive_branch` | stability_factor 0.05, war_support_factor −0.05 | `far_from_the_kings_wars`; timed, 730 days |

### Events (namespace `zin_shared_islands_of_the_south`)

Both are fired by focus effects; neither has its own trigger.

| Id | Title | For | Fired by | Options (AI) |
| --- | --- | --- | --- | --- |
| .1 | An Island Feast | ROOT | `island_feasts` | Boats from three islands come for the feast. "Feed them all" (stability 0.03; political_power −10) / "A modest feast" (political_power 15). AI 60/40 |
| .2 | The Reef Singers | ROOT | `the_reef_singers` | Old fishers sing of a reef where drowned voices call ships onto the rocks. "Honour the old custom: no boat at night" (stability 0.02) / "Tales for children" (navy_experience 3). AI 60/40. The text places no reef on this island: it is a song every island knows (the journey spec places the reef) |

Pictures (event catalog, both ungated): .1 `court_feast`; .2 `generic_sea`.

## Implementation

### Files

| Path | Written by | Content |
| --- | --- | --- |
| `docs/design/focus/shared_islands_of_the_south.json` | authored data (source of truth) | Tree data, `"tier": "shared"`, the 15 countries |
| `common/national_focus/zin_shared_islands_of_the_south.txt` | `tools/content/modules/focus_compiler.mjs` (new) | Compiled tree; `country = { factor = 0 modifier = { add = 10 original_tag = <tag> } … }`, tags resolved from the names at build time |
| `common/ideas/zin_focus_shared_islands_of_the_south.txt` | focus compiler | The 13 spirits |
| `events/zin_shared_islands_of_the_south.txt` | focus compiler | Namespace `zin_shared_islands_of_the_south`, two events |
| `common/scripted_effects/zin_shared_islands_of_the_south.txt`, `common/scripted_triggers/zin_shared_islands_of_the_south.txt` | focus compiler | Tree scripts below |
| `localisation/english/zin_focus_shared_islands_of_the_south_l_english.yml` | focus compiler | All text (UTF-8 with BOM; Windows-1252 characters only) |

All are written in the builder's one transaction through the shared atomic rewrite engine (`tools/content/apply.mts`). The compiled tree replaces the interim "Long Peace" tree (`zin_long_peace_*`, written today by `tools/content/modules/vanilla_removal.mjs`) for the 15 islands.

### Tree-declared scripts

| Name | Kind | Does |
| --- | --- | --- |
| `zin_shared_islands_of_the_south_large` | trigger, country | `any_owned_state = { is_capital = no }` (owns a state besides its capital) |
| `zin_shared_islands_of_the_south_island_pacts` | effect, country | `every_other_country` with `has_country_flag = zin_region_islands_of_the_south`, not `has_war_with` ROOT: `diplomatic_relation = { country = ROOT relation = non_aggression_pact active = yes }` (applied directly; no acceptance step, proposed) |
| `zin_shared_islands_of_the_south_loyal_isle` | effect, subject | `add_autonomy_ratio = { value = -0.10 localization = zin_shared_islands_of_the_south_loyal_isle }` |
| `zin_shared_islands_of_the_south_own_shores` | effect, subject | `add_autonomy_ratio = { value = 0.15 localization = zin_shared_islands_of_the_south_own_shores }` |

Calls into other systems: `zin_afrit_add_footholds`, `zin_afrit_purge_houses` (Afrit); `zin_eindil_add_regard`, `zin_eindil_aid_host`, `zin_eindil_is_host`, `zin_eindil_has_host` (journey; arguments in the journey spec's form `equipment`, `manpower`); `zin_sun_add_gala_counsel` (Lands of the Sun); `zin_west_add_fleet` (Western Crossing); `zin_politics_add_drift` (politics); `zin_shared_has_coast` (generic shared-tree trigger in `common/scripted_triggers/zin_shared_trees.txt`, defined by [shared_concord_dominions.md](shared_concord_dominions.md)); `zin_rules_is_historical` (defines and rules). Flags and variables read: `zin_eindil_stage`, `zin_eindil_regard`, `zin_footholds`, `zin_afrit_suspicious`, `zin_region_islands_of_the_south`, and the contract's global flags `zin_afrit_revealed`, `zin_war_of_last_crowns`, `zin_western_crossing`, `zin_eindil_returned`, with the Western Crossing's `zin_west_route_crossing`.

### Engine names

Effects: `add_building_construction` (through `building`), `add_autonomy_ratio`, `diplomatic_relation` (relation `non_aggression_pact`), `every_other_country`, `add_tech_bonus` (through `research`). Triggers: `any_owned_state`, `is_capital`, `has_war_with`, `has_country_flag`, `has_global_flag`, `is_subject`. Buildings: `industrial_complex`, `infrastructure`, `dockyard`, `naval_base`, `coastal_bunker`. All exist in 1.19.3. No on_action and no define.

### Data checks

- 46 focuses; unique positions; every focus below its prerequisites; `days` multiples of 7; no `raw` block; no spirit key equals a focus key.
- No `wargoal`, `claims_on`, `cores_on` or war declaration anywhere in the tree.
- No focus name or description mentions the stranger; no text anywhere contains "Eindil"; no text before `zin_afrit_revealed` names Afrit.

## AI

- The islands take the root, then I1, I2, I5 and I3. On the historical path the guest-right is favoured (×1.5), and welcoming the healers is favoured where footholds are 1 (the network stays thin but present, so an island can sell news if a player chooses to).
- Hulls for Hire is taken whenever available. Navigators for Gala is favoured while the stranger is at Gala (stage 5).
- In the storm years the islands keep out of the war, bind each other with pacts and send ships to the gathering host if its leader remembers them kindly (regard 25 or more).

## Acceptance

1. Every one of the 15 islands maps to this tree and to no other (compiler coverage check).
2. The tree compiles with 46 focuses; the compiler, the HOI4 Agent Tools focus inspector and script validator pass; `npm test` in `tools/` passes.
3. No focus of the tree can declare war or create a war goal or claim (scan).
4. `allow_branch` shows I6 only to Agla, Kea and Yumbo; I8 can be taken only by subjects (scenario test over all 15).
5. `shelter_for_the_wrecked` gives regard only when the island hosts the stranger in stage 4; `a_welcome_on_every_shore` only in stages 4 to 6 (scripted test with forced variables).
6. `hulls_for_hire` raises `zin_west_fleet` by 3 and is unavailable before the Ford Council chooses the crossing and after the West has crossed.
7. Text checks: no "Eindil" anywhere; no "stranger" in a focus name or description; no Afrit before the reveal (compiler secret scan).
8. Every modifier in the spirits table exists in the modifier documentation.
9. The isolated Linux run (one in-game year) logs no error line from a `zin_shared_islands_of_the_south` file.

## Open questions

Resolved here on labelled proposals; the owner question is in [../../OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md).

1. *"Sell news to the Deliverer's priests" at footholds 0.* Resolved as a proposed dependency for the journey spec: the option needs footholds 1 or more on the island. Until the journey spec adopts it, the option works as written there.
2. *Island hulls in the Western Crossing.* Owner question ("regions: east, south isles, sun" 12). Proceeds on the proposal: `hulls_for_hire` adds 3 to `zin_west_fleet`.
3. *Sailings to Gala.* Resolved: the links stay rare (two focuses, `carry_it_to_gala` and `navigators_for_gala`), matching the established saying and Lorien's island navigators (proposed).
