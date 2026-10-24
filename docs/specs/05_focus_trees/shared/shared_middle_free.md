# Shared tree: the free realms of the Middle Lands

**Status:** Proposed. Written 24 October 2026 by the shared-trees subagent while the owner was away; not yet reviewed by the lead or the owner. Every focus, spirit, event, number and name below that is not cited to the vault or the roster is proposed. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

One focus tree for the three small realms of the Middle Lands that never took the Charters of Parim and are not men: the gnome holts of **Olodor**, the elven household of **Dunelaeth** and the Baelim of the **Aenor Forest**. They have little in common except that they are hidden or overlooked, that the crown is near and strong, and that the war will come past their borders. The shared branches deal with exactly that: how the world finds them, what their land gives, how they defend it and what they do when the dead come. Each realm then has a long branch of its own where its lore lives: the hidden holts and their luck, the lost kin who must return east, stay as guides or join the Kindred, and the slow stands that may move.

| Item | Value |
| --- | --- |
| Tree id | `shared_middle_free` (focus ids `zin_shared_middle_free_<key>`) |
| Tier | C, shared (40 to 70 focuses); 58 focuses |
| Countries | Olodor (OLO, gnomes), Dunelaeth (DNL, elves), Aenor Forest (ANR, the Baelim, a tree people separate from the ents) |
| What one realm sees | the 21 shared focuses and its own 12 or 13 |
| Columns, rows | 0 to 21, 0 to 12 (shared rows 0 to 4, realm branches rows 6 to 12) |
| Events | namespace `zin_shared_middle_free`, ids 1 to 5 |
| Spirits | 19 |
| Data | `docs/design/focus/shared_middle_free.json` |

### The realms at the start (roster, histories, characters)

| Realm | Capital | Ruler | Ideology (stance) | Population | Note |
| --- | --- | --- | --- | ---: | --- |
| Olodor | Tovodor | Pebbo, Village-King of Tovodor | Wild (Seclusion) | 12,000 | hidden holts in the Deodolor Hills within a day's walk of Parim; gold freely given brings luck, gold taken brings ill luck |
| Dunelaeth | Thamiel | Velaeth, Eldest of Thamiel | Light (Elder Kinship) | 5,000 | the one household that stayed west of the range in 2A 3; guides of the pass road under the Accord of the Passes |
| Aenor Forest | Baeldran (Graulvoa) | Goarvom, Eldest of Graulvoa | Light (Warden Host) | 1,500 | the largest forest of the Middle Lands; the Baelim never share a forest with ents (K21, K27) |

## Lore basis

- **Established:** Rush is the old name of Aenor, and the Rush Forest is the Aenor Forest, home of a walking tree people separate from the ents; ents and that people never share a forest (K21). The card name Coniferon is replaced (K27); the dossier's name is the Baelim. The gnome card: gnomes hide their villages, mine gold and give luck to those who bring them gold (bestiary card 38). The Magical Lands were never conquered and the elves withdrew behind the range (vault). No exact age of any being (K18).
- **Proposed in the dossiers and histories (used here):** Olodor, Tovodor and the village-kings, the Stendorler door, the chiromaws ([middle_lands.md](../../../lore/regions/middle_lands.md) 3.7, events "A Gnome in the Bridge"); Dunelaeth, the Staying, the Notch guides, the envoys of Herrodon, the Accord of the Passes (3.8, 7; `history/middle_lands.json` divergences `the_lost_kin_return`, `guides_for_an_army`); the Baelim, the tzikor, the Burnt Edge, the woodcutters of the Order, the Baelim Speak (2.5a, 9; divergences `the_forest_wakes`, `the_forest_shelters`); roster focus notes ("hidden holts, gold for luck, a chance to be found"; "return east, stay as guides, or join the Kindred"; "voices in the wood, the felling question, a stand that moves").
- **Proposed here:** every focus, spirit, event, opinion modifier and number; the luck count `zin_olodor_luck`; the free-realm stance choice; the edge markets; the gnome door event as a choice for Parim; Herrodon taking the household as a subject when it returns; the guides' request to Kunhrim; Selen's answer to the Baelim.
- **Kept open:** the Baelim's and the gnomes' own languages beyond the roster's names; whether the Baelim fight beyond their forest (the tree never sends them out).

## Design

### How the tree reads

| Br. | Branch | Columns | Rows | Opens | Focuses | Role |
| --- | --- | --- | --- | --- | ---: | --- |
| — | Outside the Charters | 9 | 0 | start | 1 | opening |
| A | How the world finds us | 1 to 5 | 1 to 4 | all | 8 | politics and diplomacy: unseen, friends in Parim or near neighbours |
| B | What the land gives | 7 to 9 | 1 to 3 | all | 4 | economy |
| C | The old defences | 11 to 13 | 1 to 3 | all | 4 | military |
| D | When the dead come | 15 to 17 | 1 to 3 | at war or `zin_war_of_last_crowns` | 4 | the last war: refuge or the field |
| O | The hidden holts | 0 to 5 | 6 to 12 | Olodor | 13 | the luck mechanic, the door under the bridge, a chance to be found |
| D2 | The lost kin | 8 to 12 | 6 to 11 | Dunelaeth | 12 | return east, stay as guides, or join the Kindred |
| F | The stands | 16 to 21 | 6 to 12 | Aenor Forest | 12 | voices, the felling question, a stand that moves |

### Route plans

**A. How the world finds us.** *How the World Finds Us* opens three mutually exclusive stances, each a staged spirit:

- *Stay Unseen* (historical for Olodor, favoured by the Baelim): `unseen` (+15% drift defence, +5% defence at home), upgraded by *The Hidden Ways* to `unseen_2`.
- *Friends in Parim*: `parim_friends` (+10% authority gain, +10% trade opinion); *An Envoy to Parim* fires event 5 to the Aenor realm holding Parim, which may guarantee the realm.
- *The Near Neighbours* (historical for Dunelaeth): `near_friends`; *Gifts for the Neighbours* gives opinions per realm (Olodor: Aenor and Hirolon; Dunelaeth: Kingson, and letters with Herrodon; Aenor Forest: Selen and Konori).

They converge on *A Free Realm* (75 authority, calm). Tradeoff: safety by hiding against protection by a strong friend against goodwill at home.

**B. What the land gives.** High roads, granary research, two workshops, authority. Every realm's land is different, but each grows richer the same way in game terms; the text names no product.

**C. The old defences.** Forts in the capital's cities, beacon research, 1,000 levies with arms (elven arms for Dunelaeth), then *Nobody Passes Uninvited* (needs both lines: forts in another state, 10 army experience).

**D. When the dead come.** Available only at war or once the War of the Last Crowns has begun. *Shelter the Fleeing* (a one-year refuge spirit and 1,000 levies from the refugees; the AI prefers it after *Stay Unseen*) and *Stand with the Living* (15 army experience; preferred after *Friends in Parim*) lead to *The Free Realms Endure*.

**O. Olodor: the hidden holts.** The luck mechanic: *The Pots of Tovodor* sets `zin_olodor_luck` to 10 and adds `luck_of_the_holts`. Gold given freely raises luck (*The Gold Seams* +10, *Naisa Keeps the Account* +10, *Never Found* +10, Parim's gift +20); the kings' meeting costs 5 and Parim taking the gold costs 20 and turns the spirit into `ill_luck`. The fork *Each Holt Its Own King* (historical; calm) or *The Kings Meet at Tovodor* (75 authority; opens *A Door Under the Bridge*, which fires event 1 to Parim: leave the door shut, leave gold freely (Parim −50 authority, a year of `holts_luck` for Parim, global flag `zin_olodor_gold_brought`) or take the gold (+75 authority, a year of `gold_ill_luck`, global flag `zin_olodor_gold_taken`)). *Luck for the Giver* passes a year of luck to Aenor if Parim gave gold. *The Tunnels Under Deodolor* fortify the holts and set `zin_olodor_tunnels` (the hiding place of the history's `gold_brought_freely` divergence). *A Chance to Be Found* leads to the binding choice *Found at Last* (global flag `zin_olodor_found`; with luck 30 or more: calm +10%, 75 authority and Aenor's friendship; below 30: −5% calm and ill luck) or *Never Found* (historical; luck +10 and forts). The capstone *The King of Tovodor* upgrades the luck spirit to `luck_of_the_holts_2` if the holts kept their luck.

**D2. Dunelaeth: the lost kin.** *The Graves of Thamiel* adds `household_of_thamiel`. *The Herrodon Letters* (opinion with Herrodon) and *Guides of the Pass Road* (authority, opinion with Kingson) open the binding three-way choice of the roster:

- *Home over the Range* (only while Herrodon exists): swap to `kin_of_the_east` and event 2 for Herrodon, which welcomes the household home as its subject (`puppet`, opinion +30 both ways) or lets it keep its graves (flag `zin_dunelaeth_refused_home`). The household stays playable as Herrodon's subject. *Kin of Herrodon* gives ward research and opinion.
- *The Guides Stay* (historical): swap to `guides_spirit` (+15% trade opinion, +10% authority gain), a high road. *The Notch Guides* sets `zin_dunelaeth_notch_guides`.
- *The Kindred Song* (only while the Kindred of the Woods exists, `zin_elves_kindred_exists`): swap to `kindred_verse` and `zin_elves_join_kindred`. *The Western Verse* raises elven kinship by 5.

*A Word with the Dwarves* fires the tree's event 3 to Kunhrim (the delving-holds tree's hold), which refuses the roads (opinion −15) or shares the lower road (opinion +15, grievance −5, `zin_delving_grudge_eased`). *Guides for an Army* (at war) is the history's `guides_for_an_army`: a half-year spirit and 15 army experience. The capstone *The Household Endures* gives authority, calm and bow research.

**F. The Aenor Forest: the stands.** The Baelim are slow, so their focuses are long (70 to 140 days). *The Slow Moot* adds `the_stands`. *Voices in the Wood* fires event 4 to Selen (*The Baelim Speak*: leave water, or send a ranger in; opinion either way, flag `zin_baelim_heard`), and *Water at the Edge* signs non-aggression with Selen. *The Felling Question* opens the binding choice *No Axe in the Wood* (historical; +10% calm, ward research) or *Fallen Wood for the Edge* (a workshop, authority and Konori's friendship). *The Burnt Edge Remembered* (will to war, forts, opinion −20 both ways with the Bloody Forest) and *The Tzikor Clearings* (army experience, forts) lead to *A Stand That Moves* (140 days: swap to `stands_awake`, 500 levies) and the capstone *The Eldest Speaks* (75 authority, opinion with Selen and Konori). The two war focuses after it are the history's divergences: *The Forest Shelters* (a year of `forest_refuge`) and *The Forest Wakes* (half a year of `forest_wakes_spirit`, +15% attack and defence).

### Idea lifecycle and the three-spirit limit

| Slot | Olodor | Dunelaeth | Aenor Forest |
| --- | --- | --- | --- |
| Stance | `unseen` → `unseen_2`, or `parim_friends`, or `near_friends` | same | same |
| Realm | `luck_of_the_holts` → `luck_of_the_holts_2`, or `ill_luck` (failure form) | `household_of_thamiel` → `kin_of_the_east`, `guides_spirit` or `kindred_verse` | `the_stands` → `stands_awake` |
| Temporary | `refuge` (one year) | `refuge`, `hidden_ways_of_the_range` (half a year) | `refuge`, `forest_refuge` (one year), `forest_wakes_spirit` (half a year) |

At most two permanent tree spirits plus temporary war spirits. `holts_luck` and `gold_ill_luck` are timed ideas the tree gives to Aenor, not to Olodor.

### Rules

- **Text.** Shared focuses name the realm with `[ROOT.GetName]`; realm branches name it. Voice as accepted; the text scan reports no finding on this tree's keys.
- **Secrets.** The Houses, Afrit and Eindil are never named; Parim's events speak of "the crown".
- **Peace.** No claim, core or war goal. Herrodon's `puppet` of Dunelaeth happens only by the household's own request and Herrodon's acceptance.

### Decision families (proposed, for the lead)

| Proposed decision | Owner | Visible when | Effect |
| --- | --- | --- | --- |
| Bring Gold to Olodor | any Middle Lands court that knows of the holts (`zin_olodor_found` or `zin_olodor_gold_brought`) | not `zin_olodor_gold_taken` | costs authority; Olodor luck +10; a year of `holts_luck` for the giver (the dossier's "Bring gold to Olodor") |
| Hire Dunelaeth's Guides | any country at war in the Middle Lands | Dunelaeth has `zin_dunelaeth_notch_guides` | a half-year passage bonus over the Lunhrim Notch |
| Leave Water at the Forest's Edge | Selen | `zin_baelim_heard` | opinion with the Aenor Forest |

### AI behaviour

- Olodor: *Stay Unseen*, *Each Holt Its Own King*, *Never Found* historically; *Found at Last* only when luck is 30 or more (weight ×3) and rarely under the historical rule.
- Dunelaeth: *The Near Neighbours* and *The Guides Stay* historically; *The Kindred Song* ×5 at war; *Home over the Range* weight 10 (×0.2 historical).
- Aenor Forest: *Stay Unseen* ×2; *No Axe in the Wood* historically.
- AI strategies: Dunelaeth befriends Herrodon, and Kingson after *The Guides Stay*; the Aenor Forest befriends Selen and antagonises the Bloody Forest after *The Burnt Edge Remembered*; Olodor befriends Aenor once Parim has brought gold.
- The weights are a first proposal; the probability auditor's audit-patch-compare cycle has not run (handoff).

### Icons

All catalog keys. Requested keys (proposed): `gnome_holt_door` (a round door in a hillside under a tree root; for *The Pots of Tovodor*, *A Door Under the Bridge*), `walking_conifer` (a giant conifer stepping through moss; for *A Stand That Moves*, *The Slow Moot*), `elven_guide_horn` (a bone guide's horn on a green cloak; for *Guides of the Pass Road*). Until added, `coin_chest`, `bridge_oaths`, `forest_ancient` and `mountain_pass` stand in.

### Focuses

| Key | Name | Prerequisites | Excl. | x,y | Days | Icon | Opens / available | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| `outside_the_charters` | Outside the Charters | — | — | 9,0 | 35 | `banner_plain` | — | pp 50; stab 0.05 | 100 |
| `how_the_world_finds_us` | How the World Finds Us | outside_the_charters | — | 3,1 | 35 | `compass_rose` | — | pp 25 | 60 |
| `stay_unseen` | Stay Unseen | how_the_world_finds_us | friends_in_parim, the_near_neighbours | 1,2 | 35 | `mask_veiled` | — | spirit `unseen` | 30; ×3 if hist and country Olodor; ×2 if country Aenor Forest |
| `friends_in_parim` | Friends in Parim | how_the_world_finds_us | stay_unseen, the_near_neighbours | 3,2 | 35 | `palace_parim` | — | spirit `parim_friends` | 20; ×0.5 if hist |
| `the_near_neighbours` | The Near Neighbours | how_the_world_finds_us | stay_unseen, friends_in_parim | 5,2 | 35 | `handshake_oath` | — | spirit `near_friends` | 30; ×3 if hist and country Dunelaeth |
| `the_hidden_ways` | The Hidden Ways | stay_unseen | — | 1,3 | 70 | `scout_lantern` | — | swap `unseen`→`unseen_2` | 30 |
| `an_envoy_to_parim` | An Envoy to Parim | friends_in_parim | — | 3,3 | 35 | `envoy` | — | call zin_aenor_event_for_parim(event: free_realm_asks_friendship) | 40 |
| `gifts_for_the_neighbours` | Gifts for the Neighbours | the_near_neighbours | — | 5,3 | 35 | `tribute_chest` | — | if country Olodor: if exists Aenor: opinion Aenor `good_neighbours` both ways; if exists Hirolon: opinion Hirolon `good_neighbours` both ways; if country Dunelaeth: if exists Kingson: opinion Kingson `good_neighbours` both ways; if exists Herrodon: opinion Herrodon `kin_letters` both ways; if country Aenor Forest: if exists Selen: opinion Selen `good_neighbours` both ways; if exists Konori: opinion Konori `good_neighbours` both ways | 40 |
| `a_free_realm` | A Free Realm | the_hidden_ways / an_envoy_to_parim / gifts_for_the_neighbours | — | 3,4 | 70 | `chain_broken` | — | pp 75; stab 0.05 | 30 |
| `what_the_land_gives` | What the Land Gives | outside_the_charters | — | 8,1 | 70 | `farm_sowing` | — | bld infrastructure 1 @capital; res [zin_cat_granaries] 0.5 ×1 | 40 |
| `tend_the_land` | Tend the Land | what_the_land_gives | — | 7,2 | 70 | `granary` | — | bld industrial_complex 1 @capital | 30 |
| `trade_at_the_edge` | Trade at the Edge | what_the_land_gives | — | 9,2 | 70 | `traders_road` | — | pp 50; bld infrastructure 1 @random_owned | 30 |
| `the_edge_markets` | The Edge Markets | tend_the_land / trade_at_the_edge | — | 8,3 | 70 | `market_stalls` | — | bld industrial_complex 1 @random_owned; pp 25 | 25 |
| `the_old_defences` | The Old Defences | outside_the_charters | — | 12,1 | 70 | `fort_wall` | — | bld bunker 1 @capital | 35 |
| `watchers_at_the_edge` | Watchers at the Edge | the_old_defences | — | 11,2 | 70 | `eye_watchful` | — | res [zin_cat_beacons] 0.5 ×1; army_xp 5 | 25 |
| `the_folk_under_arms` | The Folk Under Arms | the_old_defences | — | 13,2 | 70 | `levy_muster` | — | mp 1000; if country Dunelaeth: zin_elven_arms_equipment 200 else: zin_arms_equipment 200 | 25 |
| `nobody_passes_uninvited` | Nobody Passes Uninvited | watchers_at_the_edge + the_folk_under_arms | — | 12,3 | 70 | `pass_fort` | — | bld bunker 1 @random_owned; army_xp 10 | 25 |
| `when_the_dead_come` | When the Dead Come | outside_the_charters | — | 16,1 | 35 | `grave_host` | avail: (at war or global_flag zin_war_of_last_crowns) | ws 0.1 | 60 |
| `shelter_the_fleeing` | Shelter the Fleeing | when_the_dead_come | — | 15,2 | 70 | `alms_bread` | — | timed `refuge` 365d; mp 1000 | 40; ×1.5 if focus_done stay_unseen |
| `stand_with_the_living` | Stand with the Living | when_the_dead_come | — | 17,2 | 70 | `sword_shield` | — | army_xp 15; ws 0.05 | 30; ×1.5 if focus_done friends_in_parim |
| `the_free_realms_endure` | The Free Realms Endure | shelter_the_fleeing / stand_with_the_living | — | 16,3 | 70 | `banner_laid_down` | — | pp 75; stab 0.05 | 30 |
| `the_pots_of_tovodor` | The Pots of Tovodor | — | — | 3,6 | 35 | `coin_chest` | allow: country Olodor | spirit `luck_of_the_holts`; zin_olodor_luck = 10; tooltip | 60 |
| `each_holt_its_own_king` | Each Holt Its Own King | the_pots_of_tovodor | the_kings_meet_at_tovodor | 2,7 | 35 | `crown_gold` | allow: country Olodor | stab 0.05; flag zin_olodor_holts_apart | 40; ×3 if hist |
| `the_kings_meet_at_tovodor` | The Kings Meet at Tovodor | the_pots_of_tovodor | each_holt_its_own_king | 4,7 | 35 | `council_table` | allow: country Olodor | pp 75; flag zin_olodor_kings_met; zin_olodor_luck -5 | 15 |
| `chiromaw_hunts` | Chiromaw Hunts | each_holt_its_own_king | — | 1,8 | 70 | `scout_lantern` | allow: country Olodor | army_xp 10; zin_arms_equipment 100 | 30 |
| `the_gold_seams` | The Gold Seams | each_holt_its_own_king / the_kings_meet_at_tovodor | — | 3,8 | 70 | `mine_cart` | allow: country Olodor | bld industrial_complex 1 @capital; zin_olodor_luck +10; tooltip | 35 |
| `a_door_under_the_bridge` | A Door Under the Bridge | the_kings_meet_at_tovodor | — | 5,8 | 35 | `bridge_oaths` | allow: country Olodor | call zin_aenor_event_for_parim(event: gnome_in_the_bridge) | 30 |
| `naisa_keeps_the_account` | Naisa Keeps the Account | chiromaw_hunts | — | 0,9 | 35 | `ledger_coins` | allow: country Olodor | zin_olodor_luck +10; stab 0.05; tooltip | 25 |
| `luck_for_the_giver` | Luck for the Giver | chiromaw_hunts / the_gold_seams | — | 2,9 | 70 | `miracle_light` | allow: country Olodor | if global_flag zin_olodor_gold_brought: if exists Aenor: Aenor: timed `holts_luck` 365d; zin_olodor_luck +10 else: pp 50 | 30 |
| `the_tunnels_under_deodolor` | The Tunnels Under Deodolor | the_gold_seams / a_door_under_the_bridge | — | 4,9 | 70 | `ice_cavern` | allow: country Olodor | bld bunker 1 @capital; flag zin_olodor_tunnels | 30 |
| `a_chance_to_be_found` | A Chance to Be Found | luck_for_the_giver / the_tunnels_under_deodolor | — | 3,10 | 35 | `footprints_snow` | allow: country Olodor | stab 0.05 | 30 |
| `found_at_last` | Found at Last | a_chance_to_be_found | never_found | 2,11 | 70 | `crown_witnesses` | allow: country Olodor | global flag zin_olodor_found; if zin_olodor_luck > 29: stab 0.1; pp 75; if exists Aenor: opinion Aenor `gold_brought` both ways else: stab -0.05; if spirit luck_of_the_holts: swap `luck_of_the_holts`→`ill_luck`; tooltip | 20; ×3 if zin_olodor_luck > 29; ×0.2 if hist |
| `never_found` | Never Found | a_chance_to_be_found | found_at_last | 4,11 | 70 | `mask_veiled` | allow: country Olodor | zin_olodor_luck +10; bld bunker 1 @random_owned; stab 0.05 | 40; ×3 if hist |
| `the_king_of_tovodor` | The King of Tovodor | found_at_last / never_found | — | 3,12 | 105 | `crown_gold` | allow: country Olodor | if spirit luck_of_the_holts: swap `luck_of_the_holts`→`luck_of_the_holts_2` else: pp 50; pp 75 | 30 |
| `the_graves_of_thamiel` | The Graves of Thamiel | — | — | 10,6 | 35 | `tree_silver` | allow: country Dunelaeth | spirit `household_of_thamiel`; stab 0.05 | 60 |
| `the_herrodon_letters` | The Herrodon Letters | the_graves_of_thamiel | — | 9,7 | 35 | `scroll_sealed` | allow: country Dunelaeth | if exists Herrodon: opinion Herrodon `kin_letters` both ways; pp 25 | 40 |
| `guides_of_the_pass_road` | Guides of the Pass Road | the_graves_of_thamiel | — | 11,7 | 35 | `mountain_pass` | allow: country Dunelaeth | pp 50; if exists Kingson: opinion Kingson `good_neighbours` both ways | 40 |
| `home_over_the_range` | Home over the Range | the_herrodon_letters | the_guides_stay, the_kindred_song | 8,8 | 70 | `elven_council` | allow: country Dunelaeth; avail: exists Herrodon | swap `household_of_thamiel`→`kin_of_the_east`; if exists Herrodon: event `lost_kin_come_home` for Herrodon | 10; ×0.2 if hist |
| `the_guides_stay` | The Guides Stay | the_herrodon_letters / guides_of_the_pass_road | home_over_the_range, the_kindred_song | 10,8 | 70 | `ranger_cloak` | allow: country Dunelaeth | swap `household_of_thamiel`→`guides_spirit`; bld infrastructure 1 @capital | 40; ×3 if hist |
| `the_kindred_song` | The Kindred Song | guides_of_the_pass_road | home_over_the_range, the_guides_stay | 12,8 | 35 | `elven_bow` | allow: country Dunelaeth; avail: check zin_elves_kindred_exists | swap `household_of_thamiel`→`kindred_verse`; call zin_elves_join_kindred | 20; ×5 if (at war or global_flag zin_war_of_last_crowns); ×0.5 if hist |
| `kin_of_herrodon` | Kin of Herrodon | home_over_the_range | — | 8,9 | 70 | `book_lore` | allow: country Dunelaeth | res [zin_cat_wards] 1 ×1; if exists Herrodon: opinion Herrodon `kin_returned` both ways | 30 |
| `the_notch_guides` | The Notch Guides | the_guides_stay | — | 10,9 | 70 | `footprints_snow` | allow: country Dunelaeth | army_xp 10; flag zin_dunelaeth_notch_guides | 30 |
| `the_western_verse` | The Western Verse | the_kindred_song | — | 12,9 | 35 | `hymn_choir` | allow: country Dunelaeth | call zin_elves_add_kinship(value: 5); pp 50 | 30 |
| `a_word_with_the_dwarves` | A Word with the Dwarves | kin_of_herrodon / the_notch_guides | — | 9,10 | 35 | `envoy` | allow: country Dunelaeth | if exists Kunhrim: event `elf_roads_asked` for Kunhrim | 25 |
| `guides_for_an_army` | Guides for an Army | the_notch_guides / the_western_verse | — | 11,10 | 35 | `war_council_map` | allow: country Dunelaeth; avail: (at war or global_flag zin_war_of_last_crowns) | timed `hidden_ways_of_the_range` 180d; army_xp 15 | 40 |
| `the_household_endures` | The Household Endures | a_word_with_the_dwarves / guides_for_an_army | — | 10,11 | 105 | `tree_silver` | allow: country Dunelaeth | pp 75; stab 0.05; res [zin_cat_bows] 1 ×1 | 30 |
| `the_slow_moot` | The Slow Moot | — | — | 18,6 | 70 | `forest_ancient` | allow: country Aenor Forest | spirit `the_stands` | 60 |
| `voices_in_the_wood` | Voices in the Wood | the_slow_moot | — | 16,7 | 70 | `kilinti_grove` | allow: country Aenor Forest | if exists Selen: event `the_baelim_speak` for Selen | 35 |
| `the_felling_question` | The Felling Question | the_slow_moot | — | 20,7 | 70 | `timber_mill` | allow: country Aenor Forest | pp 50 | 35 |
| `water_at_the_edge` | Water at the Edge | voices_in_the_wood | — | 16,8 | 70 | `river_ford` | allow: country Aenor Forest | if exists Selen: non_aggression Selen; opinion Selen `good_neighbours` both ways | 30 |
| `no_axe_in_the_wood` | No Axe in the Wood | the_felling_question | fallen_wood_for_the_edge | 19,8 | 70 | `ent_branch` | allow: country Aenor Forest | stab 0.1; res [zin_cat_wards] 0.5 ×1; flag zin_baelim_no_axe | 30; ×3 if hist |
| `fallen_wood_for_the_edge` | Fallen Wood for the Edge | the_felling_question | no_axe_in_the_wood | 21,8 | 70 | `workshop_tools` | allow: country Aenor Forest | bld industrial_complex 1 @random_owned; pp 50; if exists Konori: opinion Konori `good_neighbours` both ways | 15; ×0.3 if hist |
| `the_burnt_edge_remembered` | The Burnt Edge Remembered | water_at_the_edge / no_axe_in_the_wood | — | 17,9 | 70 | `chain_broken` | allow: country Aenor Forest | ws 0.1; bld bunker 1 @capital; if exists Bloody Forest: opinion Bloody Forest `burnt_edge` both ways | 25 |
| `the_tzikor_clearings` | The Tzikor Clearings | no_axe_in_the_wood / fallen_wood_for_the_edge | — | 20,9 | 70 | `sun_flowers` | allow: country Aenor Forest | army_xp 10; bld bunker 1 @random_owned | 25 |
| `a_stand_that_moves` | A Stand That Moves | the_burnt_edge_remembered / the_tzikor_clearings | — | 18,10 | 140 | `forest_ancient` | allow: country Aenor Forest | swap `the_stands`→`stands_awake`; mp 500 | 25 |
| `the_eldest_speaks` | The Eldest Speaks | a_stand_that_moves | — | 18,11 | 105 | `warden_crown` | allow: country Aenor Forest | pp 75; if exists Selen: opinion Selen `baelim_heard` both ways; if exists Konori: opinion Konori `baelim_heard` both ways | 30 |
| `the_forest_shelters` | The Forest Shelters | the_eldest_speaks | — | 17,12 | 70 | `tree_silver` | allow: country Aenor Forest; avail: (at war or global_flag zin_war_of_last_crowns) | timed `forest_refuge` 365d; if exists Selen: opinion Selen `baelim_heard` both ways | 40 |
| `the_forest_wakes` | The Forest Wakes | the_eldest_speaks | — | 19,12 | 35 | `wild_hunt` | allow: country Aenor Forest; avail: (at war or global_flag zin_war_of_last_crowns) | timed `forest_wakes_spirit` 180d; ws 0.1 | 40 |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `unseen` | Unseen | drift_defence_factor 0.15, army_core_defence_factor 0.05 |
| `unseen_2` | The Hidden Ways | drift_defence_factor 0.2, army_core_defence_factor 0.1, stability_factor 0.05 |
| `parim_friends` | Friends in Parim | political_power_gain 0.1, trade_opinion_factor 0.1 |
| `near_friends` | Good Neighbours | stability_factor 0.05, trade_opinion_factor 0.1 |
| `refuge` | A Refuge in the War | monthly_population 0.1, stability_factor 0.05 |
| `luck_of_the_holts` | The Luck of the Holts | stability_factor 0.05, research_speed_factor 0.05 |
| `luck_of_the_holts_2` | The King of Tovodor's Luck | stability_factor 0.1, research_speed_factor 0.1, political_power_gain 0.1 |
| `ill_luck` | Ill Luck in the Holts | stability_factor -0.05, research_speed_factor -0.05 |
| `holts_luck` | The Luck of the Gnomes | stability_factor 0.05, research_speed_factor 0.05 |
| `gold_ill_luck` | Gold Taken from the Gnomes | stability_factor -0.05, research_speed_factor -0.05 |
| `household_of_thamiel` | The Household of Thamiel | stability_factor 0.05, army_core_defence_factor 0.05 |
| `kin_of_the_east` | Kin of the East | research_speed_factor 0.1, stability_factor 0.05 |
| `guides_spirit` | Guides of the Pass Road | trade_opinion_factor 0.15, political_power_gain 0.1 |
| `kindred_verse` | The Western Verse | army_org_factor 0.05, army_defence_factor 0.1 |
| `hidden_ways_of_the_range` | The Ways over the Notch | army_attack_factor 0.05, army_org_factor 0.1 |
| `the_stands` | The Stands | army_core_defence_factor 0.1, army_defence_factor 0.05 |
| `stands_awake` | The Stands Awake | army_core_defence_factor 0.15, army_defence_factor 0.1, army_attack_factor 0.05 |
| `forest_refuge` | Under the Stands | monthly_population 0.1, stability_factor 0.1 |
| `forest_wakes_spirit` | The Forest Wakes | army_attack_factor 0.15, army_defence_factor 0.15 |

### Events

| n | Key | Title | Picture | Options (effects; AI) |
| ---: | --- | --- | --- | --- |
| 1 | `gnome_in_the_bridge` | A Door Under the Bridge | `generic_court` | **Leave the door shut, as the masons do.** (nothing; AI 40)<br>**Leave gold at the door, freely given.** (pp -50; global flag zin_olodor_gold_brought; timed `holts_luck` 365d; if exists FROM: opinion FROM `gold_brought` both ways; FROM: zin_olodor_luck +20; AI 40)<br>**Open it and take what is behind it.** (pp 75; global flag zin_olodor_gold_taken; timed `gold_ill_luck` 365d; if exists FROM: opinion FROM `gold_taken` both ways; FROM: zin_olodor_luck -20; if spirit luck_of_the_holts: swap `luck_of_the_holts`→`ill_luck`; AI 20; ×2 if zin_court_corruption > 69) |
| 2 | `lost_kin_come_home` | The Lost Kin Ask to Come Home | `generic_wilds` | **Let them keep their graves on the far side.** (FROM: flag zin_dunelaeth_refused_home; AI 20)<br>**Welcome them home.** (puppet FROM; if exists FROM: opinion FROM `kin_returned` both ways; AI 80) |
| 3 | `elf_roads_asked` | [FROM.GetName] Asks Leave to Use the Roads | `generic_wilds` | **No elf walks the hold's roads.** (if exists FROM: opinion FROM `roads_refused` both ways; AI 60; ×2 if hist)<br>**Let the guides use the lower road.** (if exists FROM: opinion FROM `roads_shared` both ways; flag zin_delving_grudge_eased; call zin_elves_add_wall_grievance(value: -5); AI 40) |
| 4 | `the_baelim_speak` | The Baelim Speak | `generic_wilds` | **Leave water at the edge and let the wood be.** (if exists FROM: opinion FROM `good_neighbour_wood` both ways; AI 50)<br>**Send a ranger in with water and a question.** (if exists FROM: opinion FROM `baelim_heard` both ways; stab 0.05; FROM: flag zin_baelim_heard; AI 50) |
| 5 | `free_realm_asks_friendship` | [FROM.GetName] Asks for Parim's Friendship | `concord_council` | **Receive them courteously and promise nothing.** (if exists FROM: opinion FROM `good_neighbours` both ways; AI 40)<br>**Promise them the crown's protection.** (guarantee FROM; if exists FROM: opinion FROM `parim_friendship` both ways; AI 60; ×0.5 if at war) |

### Opinion modifiers

| Key | Name | Value |
| --- | --- | ---: |
| `parim_friendship` | Friendship of Parim | 20 |
| `good_neighbours` | Good Neighbours | 15 |
| `kin_letters` | Letters Between Kin | 15 |
| `kin_returned` | The Lost Kin Returned | 30 |
| `baelim_heard` | The Baelim Heard | 20 |
| `good_neighbour_wood` | Water at the Forest's Edge | 10 |
| `roads_refused` | The Roads Refused | -15 |
| `roads_shared` | The Lower Road Shared | 15 |
| `gold_brought` | Gold Brought Freely | 30 |
| `gold_taken` | Gold Taken | -30 |
| `burnt_edge` | The Burnt Edge Remembered | -20 |

### AI strategies

| Country | Type | Target | Value | When |
| --- | --- | --- | ---: | --- |
| Dunelaeth | befriend | Herrodon | 20 | always |
| Dunelaeth | befriend | Kingson | 20 | focus_done the_guides_stay |
| Aenor Forest | befriend | Selen | 30 | always |
| Aenor Forest | antagonize | Bloody Forest | 15 | focus_done the_burnt_edge_remembered |
| Olodor | befriend | Aenor | 20 | global_flag zin_olodor_gold_brought |

## Implementation notes

- **Luck display.** `zin_olodor_luck` is shown through tooltips on the focuses that change it; the thresholds are written in *Found at Last*'s tooltip. A scripted-localisation readout belongs to the proposed decision category (the focus format writes no scripted localisation).
- **Cross-tree hooks.** Event 3 (to Kunhrim) sets `zin_delving_grudge_eased`, the delving-holds tree's flag. Event 2's `puppet` makes Herrodon Dunelaeth's overlord, which refreshes layouts through E4's `on_puppet`.
- **Mechanic effects called:** `zin_aenor_event_for_parim` (events 1 and 5), `zin_elves_join_kindred`, `zin_elves_add_kinship`, `zin_elves_add_wall_grievance`; trigger `zin_elves_kindred_exists`. Whether the Kindred's joining rule accepts an elven realm outside the Magical Lands is the elves module's call; if it does not, *The Kindred Song* is unavailable and the other two routes remain.
- **Raw blocks:** none.

## Route coverage

| Required route (roster) | Implemented | Status | Notes |
| --- | --- | --- | --- |
| Olodor: hidden holts | O, A (*Stay Unseen*) | implemented | |
| Olodor: gold for luck | O (luck count, events, *Luck for the Giver*) | implemented | decision proposed |
| Olodor: a chance to be found | O (*A Chance to Be Found*, *Found at Last* / *Never Found*) | implemented | |
| Dunelaeth: return east | D2 *Home over the Range* | implemented | as Herrodon's subject, not annexation |
| Dunelaeth: stay as guides | D2 *The Guides Stay* | implemented | |
| Dunelaeth: join the Kindred | D2 *The Kindred Song* | implemented | gated on the Kindred existing |
| Aenor Forest: voices in the wood | F *Voices in the Wood*, event 4 | implemented | |
| Aenor Forest: the felling question | F | implemented | |
| Aenor Forest: a stand that moves | F | implemented | |
| Expansion | none | deliberately omitted | none of the three realms expands in the lore; recorded as a simplification against the skill's large-tree rule |

## Owner questions

1. Should Dunelaeth's return east make it Herrodon's subject (as here), or should the household be annexed and leave the map?
2. May the Baelim leave their forest to fight at all, or only defend it (the tree only defends)?
3. Are the gnomes' holts revealed to all of Parim when found (a global flag, as here), or only to the court that found them?

## Acceptance

1. The scratch compile reports no problem; `hoi4.focus_inspect` on the staged copy reports no error; the render shows no overlap or crossing.
2. In the Linux run, each realm sees the shared branches and its own branch only.
