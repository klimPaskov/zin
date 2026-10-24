# Shared tree: the small folk

**Status:** Proposed. Written 24 October 2026 by the shared-trees subagent while the owner was away; not yet reviewed by the lead or the owner. Every focus, spirit, event, number and name below that is not cited to the vault, the roster or an owner decision is proposed. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

One focus tree for the two communities of the small folk (decision K35): **Dobbum**, their homeland in the Ronbo basin of the West Lands, guarded by the men of the Ronbo Watch and the dwarves of the high passes, and **Tirlan**, the three Hilorn valleys inside Hirolon's ring, a protectorate guarded by the giants under the Old Promise. The small folk farm, brew, smoke and almost never leave home. The tree is about keeping it that way, or choosing not to: the moot, the harvest and its stores, the hearth-leaf, staying out of the world or answering a friend, and what a people that will not fight does when the war comes anyway. Each community then has its own branch for its guards: the Ronbo Watch and the Old Promise.

| Item | Value |
| --- | --- |
| Tree id | `shared_small_folk` (focus ids `zin_shared_small_folk_<key>`) |
| Tier | C, shared (40 to 70 focuses); 42 focuses |
| Countries | Dobbum (DOB, West Lands), Tirlan (TIR, Middle Lands, subject of Hirolon) |
| What one community sees | the 24 shared focuses and its own 9: 33 |
| Columns, rows | 1 to 19, 0 to 10 (shared rows 0 to 4, community branches rows 6 to 10) |
| Events | namespace `zin_shared_small_folk`, ids 1 to 3 |
| Spirits | 12 |
| Data | `docs/design/focus/shared_small_folk.json` |

### Why a new shared tree, not a module

The roster gives Dobbum to `shared_west_lands` with a note for a "small folk module" and gives Tirlan the tree "new" with the note "shares the small folk module with Dobbum" ([roster.json](../../../../tools/content/data/world/roster.json)). The format offers two ways to share focuses ([../00_format_and_compiler.md](../00_format_and_compiler.md)): a module tagged in a shared tree that a **tier B** tree copies, or one shared tree that lists both countries. Tirlan is tier C (shared), and a shared tree may not copy; a module inside `shared_west_lands` could not reach a Middle Lands country at all, and would put a Middle Lands protectorate in a West Lands tree. A new shared tree `shared_small_folk` listing both countries is therefore the only form that covers both under the tier spec. Its 42 focuses sit inside the shared range of 40 to 70 counted over the whole tree (F6). Consequences for the lead: Dobbum leaves `shared_west_lands`' country list (it then has four countries), the roster's `focusTree` for Dobbum and Tirlan becomes `shared_small_folk`, and the tiers spec's table is regenerated (handoff).

### The communities at the start

| Community | Capital | Warden of the Fields | Overlord | Ideology | Population | Guards |
| --- | --- | --- | --- | --- | ---: | --- |
| Dobbum | Luddum | Hemmia Stubbel | none | Wild (Freeholds) | 120,000 | the Ronbo Watch (men of Thenon and Kradlon, sworn 3A 904) and the dwarves of Brundahrim at the high passes |
| Tirlan | Tirbur | Loddard Heggelum | Hirolon (protectorate) | Wild (Freeholds) | 45,000 | the giants of Hirolon under the Old Promise |

## Lore basis

- **Established:** the small folk live in two communities, each in a place evil and raiders find hard to reach, surrounded by strong realms: Dobbum in the West Lands and Tirlan inside Hirolon's ring under the giants' protection (K35); they get original names (K14); Hirolon is a sovereign giant kingdom (K13). The card: a small people who farm in peace, drink and smoke a great deal, rarely wear boots and almost never leave their land, which evil cannot enter because it is guarded (bestiary card 32, transcribed in `docs/lore/references/bestiary.md`).
- **Proposed in the dossiers and histories (used here):** the Ronbo Watch and the Ronbo Oath of 3A 904, the famine bread of 3A 899, the Orchard Gift of 4A 1540, hearth-leaf and cheese for the dwarves ([west_lands.md](../../../lore/regions/west_lands.md); `history/west_lands.json`); the Old Promise, the harvest-share, the cairn-halls, the Warden's walk to Parim, the stranger at the Saddle, the small folk going out in the war ([hirolon.md](../../../lore/regions/hirolon.md); `history/middle_lands.json`).
- **Proposed here:** every focus, spirit, event, opinion modifier and number; the stores count `zin_small_folk_stores`; the moot choice; the leaf choice; the stay-home choice; the Watch of their own; Thenon's guarantee; the bread the small folk send to their overlord or to Thenon in the war.

## Design

| Br. | Branch | Columns | Rows | Opens | Focuses | Role |
| --- | --- | --- | --- | --- | ---: | --- |
| — | The Warden of the Fields | 10 | 0 | start | 1 | opening; stores set to 20 |
| A | The moot | 1 to 3 | 1 to 3 | all | 4 | politics: the old households or every hearth |
| B | The harvest | 5 to 7 | 1 to 4 | all | 5 | economy and the stores mechanic |
| C | The hearth-leaf | 9 to 11 | 1 to 3 | all | 4 | trade: through the guards or to the markets |
| D | The world beyond the hills | 13 to 15 | 1 to 4 | all | 6 | diplomacy: stay home or answer a friend |
| E | When the war comes | 17 to 19 | 1 to 3 | at war or `zin_war_of_last_crowns` | 4 | hide the children, feed the hungry, go out |
| F | The Ronbo Watch | 4 to 8 | 6 to 10 | Dobbum | 9 | the guards of the basin |
| G | The Old Promise | 12 to 16 | 6 to 10 | Tirlan | 9 | the giants, the share, the Saddle |

### The stores

`zin_small_folk_stores` (country variable, set to 20 by the root) counts the full granaries. The harvest branch fills it (+10, +10, +10, +15), the war focus *When the War Comes* adds 10, the Three Valleys add 15. It is spent by the guards and the giants (*The Watch Paid in Grain* −10, *The Harvest Share* −10, leaf and cheese −5), by the crown's purchase in event 3 (−10), by the feast (−10) and by *Bread for the Hungry* (−20, available only with 20 or more). *The Harvest Feast* gives a year-long feast spirit with 40 or more, otherwise a little calm. The stores make the harvest the community's real wealth and give its generosity a cost.

### Route plans

**A. The moot.** *The Old Households* (historical; `old_households`, +10% calm) or *Every Hearth a Voice* (`every_hearth`, +10% authority gain, +5% calm, Light popularity +10%), converging on *The Moot Hall Mended*.

**B. The harvest.** Granary research, mills (a workshop), orchards (a high road), *The Full Granaries* (needs both lines) and *The Harvest Feast*.

**C. The hearth-leaf.** *The Hearth-Leaf* (a workshop) opens *Leaf for the Guards* (historical: opinions with Thenon and Brundahrim for Dobbum, with Hirolon for Tirlan) or *Leaf for the Markets* (75 authority, −5% calm, flag `zin_small_folk_open_markets`: the strangers the old households grumble about); *Pipes at Every Door* builds a workshop.

**D. The world beyond the hills.** *Stay Home* (historical; `gates_shut`, +20% drift defence) or *A Friend Who Asks* (`travellers`, +5% research, +10% trade opinion), then *The Gates Kept Shut* (forts) or *The First Travellers* (scholarship research), converging on *Come Home Safe*. This is the roster's "staying out of the world" and the history's `dob_go_out` divergence.

**E. When the war comes.** *Hide the Children* (a year of `children_hidden`; in Tirlan the text names the giants' cairn-halls), *Bread for the Hungry* (stores −20, calm, will to war) and *The Small Folk Go Out* (flag `zin_small_folk_went_out`): the small folk carry food rather than fight, so the reward is half a year of `small_folk_bread` (−10% supply use, +5% calm) for the overlord (Tirlan: Hirolon) or, for a free Dobbum, for Thenon, the Watch's homeland. This is the histories' "a company of small folk goes out over the Saddle to help" and "they carry food and hide children rather than fight".

**F. Dobbum: the Ronbo Watch.** *The Ronbo Watch* adds `ronbo_watch` (+15% defence at home) and Thenon's friendship. Then *The Watch Paid in Grain* (historical; stores −10, opinions with Thenon and Kradlon) or *A Watch of Our Own* (1,000 levies; slings and lanterns). *The Standing Stone* has Thenon guarantee Dobbum; *The Two Passes* builds forts in two states; *Slings and Hedges* gives 200 bows (the small folk's slings) and army experience. *Leaf and Cheese for the Dwarves* fires event 1 to Brundahrim, which may swear the passes shut again (guarantee) as the delving-holds tree's *The Ronbo Oath Kept* does. *The Orchard Gift* repeats the gift of 4A 1540 to Thenon. The capstone *Evil Does Not Enter* upgrades the spirit to `ronbo_watch_2` (+25% defence at home, +5% calm).

**G. Tirlan: the Old Promise.** *The Old Promise* adds `old_promise` and Hirolon's friendship. *The Harvest Share* (stores −10; a year of `fed_by_the_valleys` for Hirolon) and *The Cairn-Halls* (forts, flag `zin_tirlan_cairn_halls`). *Beer for the Halls*, *The Three Valleys* (stores +15, a workshop, a high road) and *A Stranger at the Saddle*, which fires event 2: a grey-robed almoner asks to build an almshouse in the valleys; sending him away costs a little calm and wins the giants' friendship, letting him build gives calm and one foothold to the Houses (`zin_afrit_add_footholds`, whose meaning the text never reveals). *The Saddle Road* and *The Warden Walks to Parim* (event 3 to Parim: supper, or a purchase of the barley) lead to the capstone *The Promise Kept* (`old_promise_2`).

### Idea lifecycle and the three-spirit limit

| Slot | Dobbum | Tirlan |
| --- | --- | --- |
| Moot | `old_households` or `every_hearth` | same |
| World | `gates_shut` or `travellers` | same |
| Guards | `ronbo_watch` → `ronbo_watch_2` | `old_promise` → `old_promise_2` |
| Temporary | `harvest_feast` (one year), `children_hidden` (one year) | same |

`small_folk_bread` and `fed_by_the_valleys` are given to other countries, not held by the small folk.

### Rules

- No claim, core or war goal; the small folk never declare war. Their army branch is defence (*A Watch of Our Own*, *Slings and Hedges*, the forts).
- Voice as accepted. The text never uses "hobbit" or the card's other borrowed words (K14); in English the people are "the small folk", and the communities are named. The text scan reports no finding on this tree's keys.
- Event 2 shows the Houses' public face only.

### Decision families (proposed, for the lead)

| Proposed decision | Visible when | Effect |
| --- | --- | --- |
| Send Grain to the Hungry (repeatable, 180-day cooldown) | stores 20 or more and a neighbour at war or in famine | stores −10; opinion with the neighbour |
| Sell Leaf at the Edge | `zin_small_folk_open_markets` | authority for stores; −5% calm for 90 days |

### AI behaviour

- Historical choices: *The Old Households*, *Leaf for the Guards*, *Stay Home*, *The Watch Paid in Grain*, *The Harvest Share*; event 1's oath (×2 historical) and event 2's refusal (×2 historical).
- *The Small Folk Go Out* is weighted ×2 after *A Friend Who Asks*.
- AI strategies: Dobbum befriends Thenon and Brundahrim; Tirlan befriends Hirolon.
- The weights are a first proposal; the probability auditor's audit-patch-compare cycle has not run (handoff).

### Icons

All catalog keys. Requested keys (proposed): `smoking_leaf` (drying sheds of broad leaves along a lane; for *The Hearth-Leaf*, *Pipes at Every Door*), `round_door_hearth` (a round green door with a bench and a pipe; for *The Warden of the Fields*, *Stay Home*), `giant_watch` (a giant's silhouette on a ridge above small fields; for *The Old Promise*, *The Promise Kept*). Until added, `healer_herbs`, `farm_sowing`, `banner_plain`, `giant_hammer` and `warden_crown` stand in.

### Focuses

| Key | Name | Prerequisites | Excl. | x,y | Days | Icon | Opens / available | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| `the_warden_of_the_fields` | The Warden of the Fields | — | — | 10,0 | 35 | `farm_sowing` | — | stab 0.05; zin_small_folk_stores = 20; tooltip | 100 |
| `the_householders_moot` | The Householders' Moot | the_warden_of_the_fields | — | 2,1 | 35 | `council_table` | — | pp 25 | 50 |
| `the_old_households` | The Old Households | the_householders_moot | every_hearth_a_voice | 1,2 | 35 | `charter_old` | — | spirit `old_households` | 30; ×2 if hist |
| `every_hearth_a_voice` | Every Hearth a Voice | the_householders_moot | the_old_households | 3,2 | 35 | `guild_hall` | — | spirit `every_hearth`; popularity light 0.1 | 20 |
| `the_moot_hall_mended` | The Moot Hall Mended | the_old_households / every_hearth_a_voice | — | 2,3 | 70 | `seal_wax` | — | pp 50; stab 0.05; bld infrastructure 1 @capital | 25 |
| `the_harvest` | The Harvest | the_warden_of_the_fields | — | 6,1 | 70 | `granary` | — | zin_small_folk_stores +10; res [zin_cat_granaries] 0.5 ×1; tooltip | 50 |
| `barley_and_beans` | Barley and Beans | the_harvest | — | 5,2 | 70 | `farm_sowing` | — | zin_small_folk_stores +10; bld industrial_complex 1 @capital | 35 |
| `orchards_and_bees` | Orchards and Bees | the_harvest | — | 7,2 | 70 | `sun_flowers` | — | zin_small_folk_stores +10; bld infrastructure 1 @random_owned | 35 |
| `the_full_granaries` | The Full Granaries | barley_and_beans + orchards_and_bees | — | 6,3 | 70 | `granary` | — | zin_small_folk_stores +15; pp 50 | 30 |
| `the_harvest_feast` | The Harvest Feast | the_full_granaries | — | 6,4 | 35 | `feast_table` | — | if zin_small_folk_stores > 39: timed `harvest_feast` 365d; zin_small_folk_stores -10 else: stab 0.05; tooltip | 30 |
| `the_hearth_leaf` | The Hearth-Leaf | the_warden_of_the_fields | — | 10,1 | 70 | `healer_herbs` | — | pp 50; bld industrial_complex 1 @random_owned | 40 |
| `leaf_for_the_guards` | Leaf for the Guards | the_hearth_leaf | leaf_for_the_markets | 9,2 | 35 | `handshake_oath` | — | if country Dobbum: if exists Thenon: opinion Thenon `watch_paid` both ways; if exists Brundahrim: opinion Brundahrim `small_folk_gifts` both ways; if country Tirlan: if exists Hirolon: opinion Hirolon `promise_honoured` both ways; pp 25 | 30; ×3 if hist |
| `leaf_for_the_markets` | Leaf for the Markets | the_hearth_leaf | leaf_for_the_guards | 11,2 | 35 | `market_stalls` | — | pp 75; stab -0.05; flag zin_small_folk_open_markets | 10; ×0.3 if hist |
| `pipes_at_every_door` | Pipes at Every Door | leaf_for_the_guards / leaf_for_the_markets | — | 10,3 | 70 | `lantern_chain` | — | bld industrial_complex 1 @capital; stab 0.05 | 25 |
| `the_world_beyond_the_hills` | The World Beyond the Hills | the_warden_of_the_fields | — | 14,1 | 35 | `map_unrolled` | — | pp 25 | 40 |
| `stay_home` | Stay Home | the_world_beyond_the_hills | a_friend_who_asks | 13,2 | 35 | `banner_plain` | — | spirit `gates_shut` | 40; ×3 if hist |
| `a_friend_who_asks` | A Friend Who Asks | the_world_beyond_the_hills | stay_home | 15,2 | 35 | `footprints_snow` | — | spirit `travellers` | 10; ×0.3 if hist |
| `the_gates_kept_shut` | The Gates Kept Shut | stay_home | — | 13,3 | 70 | `fort_wall` | — | bld bunker 1 @capital; stab 0.05 | 30 |
| `the_first_travellers` | The First Travellers | a_friend_who_asks | — | 15,3 | 70 | `traders_road` | — | res [zin_cat_scholarship] 1 ×1; pp 50 | 30 |
| `come_home_safe` | Come Home Safe | the_gates_kept_shut / the_first_travellers | — | 14,4 | 70 | `lantern_chain` | — | pp 75; stab 0.05 | 25 |
| `when_the_war_comes` | When the War Comes | the_warden_of_the_fields | — | 18,1 | 35 | `beacon` | avail: (at war or global_flag zin_war_of_last_crowns) | zin_small_folk_stores +10; ws 0.05 | 60 |
| `hide_the_children` | Hide the Children | when_the_war_comes | — | 17,2 | 35 | `ice_cavern` | — | timed `children_hidden` 365d | 40 |
| `bread_for_the_hungry` | Bread for the Hungry | when_the_war_comes | — | 19,2 | 70 | `alms_bread` | avail: zin_small_folk_stores > 19 | zin_small_folk_stores -20; stab 0.05; ws 0.05 | 40 |
| `the_small_folk_go_out` | The Small Folk Go Out | hide_the_children / bread_for_the_hungry | — | 18,3 | 70 | `caravan` | — | flag zin_small_folk_went_out; if is_subject true: OVERLORD: timed `small_folk_bread` 180d else: if exists Thenon: Thenon: timed `small_folk_bread` 180d | 30; ×2 if focus_done a_friend_who_asks |
| `the_ronbo_watch` | The Ronbo Watch | — | — | 6,6 | 35 | `pass_fort` | allow: country Dobbum | spirit `ronbo_watch`; if exists Thenon: opinion Thenon `watch_paid` both ways | 60 |
| `the_watch_paid_in_grain` | The Watch Paid in Grain | the_ronbo_watch | a_watch_of_our_own | 5,7 | 35 | `granary` | allow: country Dobbum | zin_small_folk_stores -10; stab 0.05; if exists Thenon: opinion Thenon `watch_paid` both ways; if exists Kradlon: opinion Kradlon `watch_paid` both ways | 40; ×3 if hist |
| `a_watch_of_our_own` | A Watch of Our Own | the_ronbo_watch | the_watch_paid_in_grain | 7,7 | 35 | `scout_lantern` | allow: country Dobbum | mp 1000; flag zin_small_folk_own_watch | 10; ×0.3 if hist |
| `the_standing_stone` | The Standing Stone | the_watch_paid_in_grain | — | 4,8 | 35 | `rune_stone` | allow: country Dobbum | if exists Thenon: Thenon: guarantee ROOT; stab 0.05 | 35 |
| `the_two_passes` | The Two Passes | the_watch_paid_in_grain / a_watch_of_our_own | — | 6,8 | 70 | `mountain_pass` | allow: country Dobbum | bld bunker 1 @capital; bld bunker 1 @random_owned | 30 |
| `slings_and_hedges` | Slings and Hedges | a_watch_of_our_own | — | 8,8 | 70 | `bow_archers` | allow: country Dobbum | zin_bows_equipment 200; army_xp 10 | 25 |
| `leaf_and_cheese_for_the_dwarves` | Leaf and Cheese for the Dwarves | the_standing_stone / the_two_passes | — | 5,9 | 35 | `tribute_chest` | allow: country Dobbum | if exists Brundahrim: event `leaf_and_cheese_sent` for Brundahrim; zin_small_folk_stores -5 | 35 |
| `the_orchard_gift` | The Orchard Gift | the_two_passes / slings_and_hedges | — | 7,9 | 35 | `sun_flowers` | allow: country Dobbum | if exists Thenon: opinion Thenon `orchard_gift` both ways; pp 50 | 30 |
| `evil_does_not_enter` | Evil Does Not Enter | leaf_and_cheese_for_the_dwarves / the_orchard_gift | — | 6,10 | 105 | `warden_crown` | allow: country Dobbum | swap `ronbo_watch`→`ronbo_watch_2`; stab 0.05 | 30 |
| `the_old_promise` | The Old Promise | — | — | 14,6 | 35 | `giant_hammer` | allow: country Tirlan | spirit `old_promise`; if exists Hirolon: opinion Hirolon `promise_honoured` both ways | 60 |
| `the_harvest_share` | The Harvest Share | the_old_promise | — | 13,7 | 35 | `granary` | allow: country Tirlan | zin_small_folk_stores -10; if exists Hirolon: Hirolon: timed `fed_by_the_valleys` 365d; if exists Hirolon: opinion Hirolon `promise_honoured` both ways | 50; ×2 if hist |
| `the_cairn_halls` | The Cairn-Halls | the_old_promise | — | 15,7 | 70 | `rune_stone` | allow: country Tirlan | bld bunker 1 @capital; flag zin_tirlan_cairn_halls | 30 |
| `beer_for_the_halls` | Beer for the Halls | the_harvest_share | — | 12,8 | 35 | `feast_table` | allow: country Tirlan | pp 50; stab 0.05 | 30 |
| `the_three_valleys` | The Three Valleys | the_harvest_share / the_cairn_halls | — | 14,8 | 70 | `farm_sowing` | allow: country Tirlan | zin_small_folk_stores +15; bld industrial_complex 1 @capital; bld infrastructure 1 @capital | 35 |
| `a_stranger_at_the_saddle` | A Stranger at the Saddle | the_cairn_halls | — | 16,8 | 35 | `courier_pilgrim` | allow: country Tirlan | event `a_stranger_at_the_saddle` | 30 |
| `the_saddle_road` | The Saddle Road | beer_for_the_halls / the_three_valleys | — | 13,9 | 70 | `roads_paved` | allow: country Tirlan | bld infrastructure 1 @capital; if exists Aenor: opinion Aenor `warden_at_court` both ways | 25 |
| `the_warden_walks_to_parim` | The Warden Walks to Parim | the_three_valleys / a_stranger_at_the_saddle | — | 15,9 | 35 | `palace_parim` | allow: country Tirlan | call zin_aenor_event_for_parim(event: warden_at_court) | 30 |
| `the_promise_kept` | The Promise Kept | the_saddle_road / the_warden_walks_to_parim | — | 14,10 | 105 | `warden_crown` | allow: country Tirlan | swap `old_promise`→`old_promise_2`; if exists Hirolon: opinion Hirolon `promise_honoured` both ways; stab 0.05 | 30 |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `old_households` | The Old Households | stability_factor 0.1 |
| `every_hearth` | Every Hearth a Voice | political_power_gain 0.1, stability_factor 0.05 |
| `gates_shut` | The Gates Kept Shut | drift_defence_factor 0.2, stability_factor 0.05 |
| `travellers` | Travellers Come Home | research_speed_factor 0.05, trade_opinion_factor 0.1 |
| `ronbo_watch` | The Ronbo Watch | army_core_defence_factor 0.15 |
| `ronbo_watch_2` | Evil Does Not Enter | army_core_defence_factor 0.25, stability_factor 0.05 |
| `old_promise` | The Old Promise | army_core_defence_factor 0.15 |
| `old_promise_2` | The Promise Kept | army_core_defence_factor 0.25, stability_factor 0.05 |
| `harvest_feast` | The Harvest Feast | stability_factor 0.1, political_power_gain 0.05 |
| `children_hidden` | The Children Hidden | stability_factor 0.1, war_support_factor 0.05 |
| `small_folk_bread` | Bread from the Small Folk | supply_consumption_factor -0.1, stability_factor 0.05 |
| `fed_by_the_valleys` | Fed by the Valleys | stability_factor 0.05, monthly_population 0.05 |

### Events

| n | Key | Title | Picture | Options (effects; AI) |
| ---: | --- | --- | --- | --- |
| 1 | `leaf_and_cheese_sent` | Leaf and Cheese from [FROM.GetName] | `generic_peace` | **Thank them and keep the passes as they are.** (if exists FROM: opinion FROM `small_folk_gifts` both ways; AI 40)<br>**Swear the passes shut for them again.** (guarantee FROM; if exists FROM: opinion FROM `small_folk_gifts` both ways; pp -25; AI 60; ×2 if hist) |
| 2 | `a_stranger_at_the_saddle` | A Stranger at the Saddle | `houses` | **Send him back over the Saddle with a loaf.** (stab -0.05; if is_subject true: opinion OVERLORD `promise_honoured` both ways; AI 50; ×2 if hist)<br>**Let the House build its almshouse.** (stab 0.05; call zin_afrit_add_footholds(value: 1); AI 50) |
| 3 | `warden_at_court` | A Warden of the Fields at Court | `court_feast` | **Give him supper and send him home.** (if exists FROM: opinion FROM `warden_at_court` both ways; AI 40)<br>**Buy the barley for the crown's granaries.** (pp -25; if exists FROM: opinion FROM `warden_at_court` both ways; FROM: pp 50; zin_small_folk_stores -10; AI 60) |

### Opinion modifiers

| Key | Name | Value |
| --- | --- | ---: |
| `watch_paid` | The Watch Paid in Grain | 20 |
| `small_folk_gifts` | Leaf and Cheese | 15 |
| `promise_honoured` | The Old Promise Honoured | 30 |
| `warden_at_court` | A Warden at Court | 15 |
| `orchard_gift` | The Orchard Gift | 20 |

### AI strategies

| Country | Type | Target | Value | When |
| --- | --- | --- | ---: | --- |
| Dobbum | befriend | Thenon | 20 | always |
| Dobbum | befriend | Brundahrim | 20 | always |
| Tirlan | befriend | Hirolon | 40 | always |

## Implementation notes

- **Stores display.** The stores are shown through tooltips on the focuses that change them; *Bread for the Hungry* shows the raw variable test in its requirement until a scripted-localisation readout exists (the format writes none).
- **Thenon's guarantee.** *The Standing Stone* runs `give_guarantee = ROOT` in Thenon's scope; if Thenon does not exist nothing happens.
- **Mechanic effects called:** `zin_aenor_event_for_parim` (event 3), `zin_afrit_add_footholds` (event 2).
- **Raw blocks:** none.

## Route coverage

| Required route (roster, task, K35) | Implemented | Status | Notes |
| --- | --- | --- | --- |
| Dobbum: the Watch | F | implemented | |
| Dobbum: the leaf trade | C | implemented | shared with Tirlan |
| Dobbum: staying home or going out | D, E | implemented | |
| Tirlan: the Old Promise with Hirolon | G | implemented | |
| Tirlan: the harvest | B, G (*The Harvest Share*, *The Three Valleys*) | implemented | |
| Tirlan: staying out of the world | D | implemented | |
| Expansion, offensive military | none | deliberately omitted | a people that never leaves home and never fights; recorded as a simplification against the skill's large-tree rule |

## Owner questions

1. Is Dobbum's people called Bykkwyn (the West Lands dossier) and Tirlan's Tirim (the Hirolon dossier) in text, or "the small folk" everywhere? The tree says "the small folk" and names only the realms.
2. May the small folk keep a Watch of their own (the tree's alternative to the Ronbo Watch), or must their guards always be others?

## Acceptance

1. The scratch compile reports no problem; `hoi4.focus_inspect` on the staged copy reports no error; the render shows no overlap or crossing.
2. After the lead's registration, Dobbum no longer appears in `shared_west_lands` and the coverage check passes.
