# Shared Triton's Islands tree

**Status:** Draft. **Priority:** 6. **Phase:** 6.

## Purpose

Twenty-eight island lordships of Triton's Islands share one tree, `shared_tritons_islands`. It makes a one-state island play like one: an island hall, fish, salt and sail, boats and pilots, the old charts of the Pupor Ocean, and the question every island answers sooner or later: join the chart houses that keep the sea lanes, shelter corsairs in its coves, or keep to its own waters. Branches open by people, ideology, overlord and the West's course (`allow_branch`). Text names the country with `[ROOT.GetName]` and `[ROOT.GetAdjective]`.

Triton's Islands have no great power and no mechanics spec. This spec therefore also defines a small regional system, **the Pupor Ocean** (piracy, chart houses and corsair havens, the Pupor Charter and the Southern Banks), which this tree and the six tier B island trees ([../regional/tritons_islands.md](../regional/tritons_islands.md)) share. It lives in this tree's scripted effects and ideas, so it needs no on-action of its own.

| Item | Value |
| --- | --- |
| Tree id | `shared_tritons_islands` (focus ids `zin_shared_tritons_islands_<key>`) |
| Tier | C (shared) |
| Countries (28) | Fineger, Hiohon, Tses - The Vestes, Ziza, Aatah, Amarelo, Anbei, Arpos, Beemste, Benan, Bono, Cheko, Dani, Hesos, Kile Islands, Kim, Kusu, Lemo, Li, Mondeluz, Previous Dark, Santon, Sondor, The Cursed Square, The Lens, Tined, Urbolon, Windy Lands |
| Focuses | 52 (a single island sees 35 to 45, by its branches) |
| Grid | x 0–26, y 0–8 |
| Events | namespace `zin_shared_tritons_islands` |
| Spirits | `zin_shared_tritons_islands_<key>` |

All 28 are clan realms of men (`zin_wild_clans`), almost all with one state and a few thousand men under arms. Their numbers stay small: manpower effects here are hundreds, not thousands.

## Lore basis

- **Established:** Triton's Islands lie west of the West Lands and arc around the Pupor Ocean (drawn sheet "Tornado Islands"); Adel, Pollos, Raerby and Nondondor are there. In the First Age island peoples carried the Grand Alliance's supplies across Erdae's stormy seas. Lorien's crew for Eindil's voyage north included island navigators (which islands is not stated).
- **Proposed (vault):** the islanders charted the Pupor Ocean in 4A 702 and sold the charts to every crown; Senra of Triton's Islands, fleet captain of the Grand Alliance.
- **Proposed (start situation):** the islands live by fishing, piracy and charting; their tensions are piracy, fishing rights and naval frontiers (Nondondor).
- **Proposed (this spec):** the Pupor Ocean system (piracy, chart houses, corsair havens), the Pupor Charter, the Southern Banks, every focus, spirit, event and number.
- **Kept open:** which islands sent navigators with Lorien's ship; the islands' part in the War of the Last Crowns (the vault is silent; every war focus here is play). Before `zin_afrit_revealed` no text names Afrit. No focus names Eindil; the hidden *Southern Ship* focus speaks only of a fast ship with elves among its crew.

## The Pupor Ocean (regional system, proposed)

### Piracy

`zin_tritons_piracy` (global, 0–100, start 35) is how lawless the Pupor Ocean is. It changes only through `zin_tritons_add_piracy` (`value`), which every Triton's tree calls. The first call sets it to 35 if it is unset (global flag `zin_tritons_seas_init`), so no on-action is needed. Values clamp to 0–100. After each change the effect runs `zin_tritons_refresh_seas`.

| Band | Piracy | Chart houses get | Corsair havens get |
| --- | --- | --- | --- |
| Quiet seas | 0–24 | `open_lanes` | `lean_season` |
| Wary seas | 25–59 | — | — |
| Corsair seas | 60–100 | `harried_lanes` | `corsair_season` |

The band is stored in `zin_tritons_sea_band` (global; 0 quiet, 1 wary, 2 corsair).

### Chart houses and corsair havens

Every Triton's country is a **chart house** (country flag `zin_tritons_chart_house`), a **corsair haven** (country flag `zin_tritons_corsair_haven`) or neither. `zin_tritons_set_side` (`side` = chart, haven, none) sets one flag, clears the other and refreshes the band ideas. Only focuses set the side; nobody is either at the start.

### The Pupor Charter

**The Pupor Charter** (proposed name, faction-name key `zin_faction_pupor_charter`) is a defensive league of chart houses. `zin_tritons_found_charter` creates it with ROOT as leader (`create_faction`), sets global flag `zin_tritons_charter_founded` and country flag `zin_tritons_charter_leader`, adds every Triton's country that has flag `zin_tritons_charter_invited` and is not in another faction, makes ROOT a chart house and adds piracy −5. If the Charter already exists, the effect calls `zin_tritons_join_charter` instead. `zin_tritons_join_charter` fires `zin_shared_tritons_islands.2` to the Charter's leader. Corsair havens may not join. The Charter never declares wars; its focuses lower piracy.

### The Southern Banks

The fishing banks between Nondondor and the Seite Islands are disputed (proposed reading of Nondondor's "contested naval frontier"; the map step confirms the two are near each other, see open questions). The quarrel is an opinion modifier, `zin_tritons_banks_quarrel` (−20 both ways, decays 0.5 a month), never a war at the start. A mediator calls `zin_tritons_offer_banks_mediation`, which fires `zin_shared_tritons_islands.3` to each side that has not yet accepted. Each acceptance sets country flag `zin_tritons_mediation_accepted`; when both sides have it, `zin_tritons_make_banks_accord` runs: global flag `zin_tritons_banks_accord`; the quarrel modifier is removed both ways; a non-aggression pact between the two; piracy −3.

### Joining the Western Crossing

The diplomacy spec's joining rule `zin_faction_rule_join_crossing` admits Triton's Islands countries. `zin_tritons_join_crossing` (available only after `zin_western_crossing`) has the convener (`global.zin_west_convener`) add ROOT to the Crossing's faction and to its war against the Aenor realm, and sets ROOT's flag `zin_tritons_with_the_crossing`. The islands send ships, not landings: the calling focus adds fleet +3 (`zin_west_add_fleet`). Never on the historical path.

## Design

### Branches

| Branch | Columns | Rows | Opens (`allow_branch` on the root) | Drives |
| --- | --- | --- | --- | --- |
| R. The Island Hall | 0–2 | 0–2 | every country | Court |
| E. Fish, Salt and Sail | 3–5 | 0–4 | every country | Economy |
| N. The Island Boats | 6–8 | 0–3 | every country | Navy |
| W. The Island Levy | 9–11 | 0–1 | people `men` | A small levy |
| P. Charter or Coves | 12–17 | 0–3 | every country | Piracy; chart house, haven or neither |
| C. The Old Charts | 18–20 | 0–2 | every country | Charts; range |
| M. The Mainland Courts | 21–23 | 0–2 | every country | Trade; neutrality |
| H. The Houses of the First Light | 24 | 0 | every country | Afrit's footholds (public face) |
| S. A Harbour for Any Sail | 25 | 0–1 | every country; the second focus hidden until the voyage north | Journey hook |
| X. The Great War at Sea | 12–17 | 6–8 | every country; root needs a story flag | The final war |
| O. Under a Greater Flag | 18–20 | 6–8 | `is_subject` | Life as a subject |
| L. The Isle Council | 21–23 | 6–7 | ideology `light` | Council isles |

`allow_branch` conditions: W `check zin_people_is_common_folk`; O `is_subject`; L `ideology light`; the focus `the_southern_ship` `check zin_tritons_ship_has_sailed` (global `zin_eindil_stage` ≥ 6).

### The peaceful start

No focus in this tree creates a war goal. The only war an island can join is the Western Crossing (`sail_with_the_crossing`, after `zin_western_crossing`, never historical) and Eindil's coalition (`beside_the_heir`, after `zin_eindil_returned`).

### Notation

**piracy ±n** is `call zin_tritons_add_piracy (n)`; **side chart / haven** is `call zin_tritons_set_side {side}`; **fleet ±n** is `call zin_west_add_fleet (n)`; **regard**, **renown** call `zin_eindil_add_regard` (ROOT) and `zin_eindil_add_renown`; **join coalition** is `call zin_eindil_join_coalition`; **friend** is `check zin_eindil_friend`. "hist" is the AI factor while `zin_rules_is_historical` is true. Days are 35 unless shown.

### R. The Island Hall (every country)

Icons: `council_table`, `fishing_boats`, `handshake_oath`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_island_hall` | The Island Hall of [ROOT.GetName] | — | — | 1,0 | 35 | political_power 50 | 100 |
| `the_island_elders` | The Island Elders | the_island_hall | — | 0,1 | 35 | stability 0.03 | 20 |
| `hearth_and_harbour` | Hearth and Harbour | the_island_hall | — | 2,1 | 35 | political_power 25 | 15 |
| `the_islanders_oath` | The Islanders' Oath | the_island_elders or hearth_and_harbour | — | 1,2 | 70 | political_power 50; stability 0.03; add_spirit islanders_oath | 15 |

### E. Fish, Salt and Sail (every country)

Icons: `fishing_boats`, `market_stalls`, `shipwright_yard`, `granary`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `fish_salt_and_sail` | Fish, Salt and Sail | — | — | 4,0 | 35 | building industrial_complex 1 capital | 25 |
| `the_drying_sheds` | The Drying Sheds | fish_salt_and_sail | — | 3,1 | 35 | political_power 25; add_spirit drying_sheds | 12 |
| `the_salt_pans` | The Salt Pans | fish_salt_and_sail | — | 5,1 | 35 | political_power 25 | 10 |
| `the_boatyard` | The Boatyard | the_drying_sheds or the_salt_pans | — | 4,2 | 35 | building dockyard 1 random_coastal | 12 |
| `the_island_market` | The Island Market | the_boatyard | — | 4,3 | 35 | political_power 50 | 10 |
| `stores_against_the_storm` | Stores Against the Storm | the_island_market | — | 4,4 | 35 | stability 0.05 | 10 |

### N. The Island Boats (every country)

Icons: `harbour_lake`, `galley_oars`, `compass_rose`, `lighthouse`, `warship_sail`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_island_boats` | The Island Boats | — | — | 7,0 | 35 | building naval_base 1 random_coastal | 20 |
| `galleys_of_the_isle` | Galleys of the Isle | the_island_boats | — | 6,1 | 35 | research [zin_cat_galleys] 0.5 ×1 | 10 |
| `island_pilots` | Island Pilots | the_island_boats | — | 8,1 | 35 | navy_experience 10; add_spirit island_pilots | 10 |
| `the_sea_watch` | The Sea Watch | galleys_of_the_isle or island_pilots | — | 7,2 | 35 | building coastal_bunker 1 random_coastal | 8 |
| `the_isle_squadron` | The Isle Squadron | the_sea_watch | — | 7,3 | 70 | add_spirit isle_squadron | 8 |

### W. The Island Levy (people `men`)

Icons: `levy_muster`, `sword_shield`, `bow_archers`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_island_levy` | The Island Levy | — | — | 10,0 | 35 | manpower 500; army_experience 5 | 10 |
| `sea_soldiers` | Sea Soldiers | the_island_levy | — | 9,1 | 35 | add_spirit sea_soldiers_isle | 8 |
| `isle_bows` | Bows of the Isle | the_island_levy | — | 11,1 | 35 | research [zin_cat_bows] 0.5 ×1 | 8 |

### P. Charter or Coves (every country)

**Purpose:** the island's answer to the Pupor Ocean's piracy. **Mutual exclusions:** *Join the Pupor Charter* / *The Free Coves* / *Keep to Our Own Waters*.

Icons: `sea_charts`, `corsair_raider`, `fishing_boats`, `scroll_sealed`, `coin_chest`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_pupor_question` | The Pupor Question | — | — | 14,0 | 35 | political_power 25; tooltip "Some islands keep the sea lanes. Some shelter those who prey on them." | 30 |
| `join_the_pupor_charter` | Join the Pupor Charter | the_pupor_question | the_free_coves, keep_to_our_own_waters | 12,1 | 35 | side chart; piracy −2; if global_flag zin_tritons_charter_founded: call zin_tritons_join_charter, else flag zin_tritons_charter_invited | 30; ×2 at piracy ≥ 40; hist ×3 |
| `the_free_coves` | The Free Coves | the_pupor_question | join_the_pupor_charter, keep_to_our_own_waters | 14,1 | 35 | side haven; piracy +3 | 15; ×2 at piracy ≥ 60; hist ×0 |
| `keep_to_our_own_waters` | Keep to Our Own Waters | the_pupor_question | join_the_pupor_charter, the_free_coves | 16,1 | 35 | add_spirit own_waters | 30 |
| `charter_patrols` | Charter Patrols | join_the_pupor_charter | — | 12,2 | 35 | piracy −3; navy_experience 5 | 15 |
| `courts_of_the_charter` | A Pirate Trial | charter_patrols | — | 12,3 | 35 | stability 0.03; event pirate_trial (zin_shared_tritons_islands.1) | 15 |
| `the_cove_raiders` | The Cove Raiders | the_free_coves | — | 14,2 | 35 | piracy +3; navy_experience 10 | 15 |
| `sell_to_any_buyer` | Sell to Any Buyer | the_cove_raiders | — | 14,3 | 35 | political_power 50 | 15 |
| `fishers_not_fighters` | Fishers, Not Fighters | keep_to_our_own_waters | — | 16,2 | 35 | political_power 25; stability 0.02 | 15 |
| `the_quiet_isle` | The Quiet Isle | fishers_not_fighters | — | 16,3 | 35 | stability 0.05 | 15 |

### C. The Old Charts (every country)

Icons: `sea_charts`, `map_unrolled`, `compass_rose`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_old_charts` | The Old Charts | — | — | 19,0 | 35 | political_power 25; tooltip "Our forebears charted the Pupor Ocean and sold the charts to every crown." | 15 |
| `charts_for_sale` | Charts for Sale | the_old_charts | — | 18,1 | 35 | political_power 50 | 12 |
| `soundings_of_the_pupor` | Soundings of the Pupor | the_old_charts | — | 20,1 | 35 | navy_experience 10 | 10 |
| `the_chart_makers_guild` | The Chart-Makers' Guild | charts_for_sale or soundings_of_the_pupor | — | 19,2 | 35 | add_spirit chart_makers | 10 |

### M. The Mainland Courts (every country)

Icons: `envoy`, `crown_gold`, `olive_branch`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_mainland_courts` | The Mainland Courts | — | — | 22,0 | 35 | political_power 25 | 15 |
| `envoys_to_the_west` | Envoys to the Western Shore | the_mainland_courts | — | 21,1 | 35 | add_spirit mainland_trade | 10 |
| `a_word_from_parim` | A Word from Parim | the_mainland_courts | — | 23,1 | 35 | political_power 50; tooltip "Parim's tariffs reach even the islands." | 10 |
| `island_neutrality` | Island Neutrality | envoys_to_the_west or a_word_from_parim | — | 22,2 | 35 | add_spirit island_neutrality | 10 |

### H. The Houses of the First Light (every country)

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `a_house_of_healing` | A House of Healing | — | — | 24,0 | 35 | available: no flag zin_afrit_houses_purged; not global_flag zin_afrit_revealed; call zin_afrit_add_footholds (1) (clamped by the Afrit spec's caps); stability 0.03; tooltip "The Houses of the First Light offer a hospital and a grain store." | 15 |

Icon: `house_first_light`.

### S. A Harbour for Any Sail (every country)

Icons: `harbour_lake`, `ship_voyage`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `a_harbour_for_any_sail` | A Harbour for Any Sail | — | — | 25,0 | 35 | flag zin_eindil_safe_harbour; stability 0.02 | 10; hist ×0 |
| `the_southern_ship` | The Southern Ship | a_harbour_for_any_sail | — | 25,1 | 35 | allow_branch: check zin_tritons_ship_has_sailed; renown +1; regard +5; tooltip "A fast ship from the south called here, with elves among its crew." | 20 |

`zin_eindil_safe_harbour` is a proposed journey hook: in stage 6 (ports of call) *Resupply the ship* gets AI weight ×2 under the dynamic rule. It does nothing under the historical rule.

### X. The Great War at Sea (every country)

**Purpose:** what an island does when the West crosses and the world goes to war. **Mutual exclusion:** *The Isle Keeps Apart* (historical) / *Sail with the Crossing*. Selling ships and boats for the evacuation are trade, not war, and stay open to both.

Icons: `storm_sea`, `ship_voyage`, `banner_league`, `anchor_rope`, `lone_sword`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_great_war_at_sea` | The Great War at Sea | — | — | 14,6 | 35 | available: global_flag zin_war_of_last_crowns or global_flag zin_western_crossing; political_power 25 | 200 |
| `the_isle_keeps_apart` | The Isle Keeps Apart | the_great_war_at_sea | sail_with_the_crossing | 12,7 | 35 | add_spirit isle_apart | 40; hist ×100 |
| `ships_for_the_crossing` | Ships for the Crossing | the_great_war_at_sea | — | 14,7 | 35 | available: global_flag zin_western_crossing; fleet +2; political_power 50 | 20; hist ×0.5 |
| `sail_with_the_crossing` | Sail with the Crossing | the_great_war_at_sea | the_isle_keeps_apart | 16,7 | 35 | available: global_flag zin_western_crossing; not at_war; call zin_tritons_join_crossing; fleet +3 | 5; hist ×0 |
| `beside_the_heir` | Beside the Heir | the_great_war_at_sea | — | 13,8 | 35 | available: global_flag zin_eindil_returned; friend; join coalition | 100 |
| `boats_for_the_evacuation` | Boats for the Evacuation | ships_for_the_crossing or the_isle_keeps_apart | — | 15,8 | 35 | available: global_flag zin_west_evacuation; not global_flag zin_west_evacuated; fleet +3; political_power 25 | 50 |

### O. Under a Greater Flag (subjects)

Icons: `tribute_chest`, `seal_wax`, `charter_old`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `under_a_greater_flag` | Under a Greater Flag | — | — | 19,6 | 35 | stability 0.05 | 50 |
| `tribute_of_fish` | Tribute of Fish and Salt | under_a_greater_flag | — | 18,7 | 35 | call zin_shared_tritons_islands_pay_tribute (overlord +25 political power) | 20 |
| `a_voice_in_the_hall` | A Voice in the Hall | under_a_greater_flag | — | 20,7 | 35 | political_power 50; call zin_shared_tritons_islands_seek_voice (autonomy score +10 toward independence) | 15 |
| `the_old_freedoms` | The Old Freedoms of the Isle | tribute_of_fish or a_voice_in_the_hall | — | 19,8 | 35 | add_spirit old_freedoms | 15 |

### L. The Isle Council (ideology `light`)

No island in this tree starts Light; an island whose government turns Light gains it. Icons: `council_table`, `charter_free`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_isle_council` | The Isle Council | — | — | 22,6 | 35 | stability 0.03; political_power 25 | 30 |
| `council_of_harbours` | Council of Harbours | the_isle_council | — | 21,7 | 35 | add_spirit harbour_charters | 15 |
| `the_open_assembly` | The Open Assembly | the_isle_council | — | 23,7 | 35 | stability 0.05 | 15 |

### Count

| Branch | Focuses |
| --- | ---: |
| R. The Island Hall | 4 |
| E. Fish, Salt and Sail | 6 |
| N. The Island Boats | 5 |
| W. The Island Levy | 3 |
| P. Charter or Coves | 10 |
| C. The Old Charts | 4 |
| M. The Mainland Courts | 4 |
| H. The Houses of the First Light | 1 |
| S. A Harbour for Any Sail | 2 |
| X. The Great War at Sea | 6 |
| O. Under a Greater Flag | 4 |
| L. The Isle Council | 3 |
| **Total** | **52** |

A typical island (men, independent, Wild) sees R, E, N, W, P, C, M, H, S and X: 45 focuses.

### Spirits

Keys compile to `zin_shared_tritons_islands_<key>`. The four sea-band ideas are applied and removed only by `zin_tritons_refresh_seas`, on every Triton's country (tier B and C).

| Key | Name | Modifiers | Added by |
| --- | --- | --- | --- |
| `islanders_oath` | The Islanders' Oath | `drift_defence_factor` 0.10, `stability_factor` 0.02 | *The Islanders' Oath* |
| `drying_sheds` | The Drying Sheds | `consumer_goods_factor` −0.02 | *The Drying Sheds* |
| `island_pilots` | Island Pilots | `navy_max_range_factor` 0.10, `naval_speed_factor` 0.03 | *Island Pilots* |
| `isle_squadron` | The Isle Squadron | `navy_org_factor` 0.05, `naval_detection` 0.05 | *The Isle Squadron* |
| `sea_soldiers_isle` | Sea Soldiers | `amphibious_invasion` 0.10 | *Sea Soldiers* |
| `own_waters` | Our Own Waters | `stability_factor` 0.03, `drift_defence_factor` 0.10 | *Keep to Our Own Waters* |
| `chart_makers` | The Chart-Makers' Guild | `navy_max_range_factor` 0.10, `naval_detection` 0.05 | *The Chart-Makers' Guild* |
| `mainland_trade` | Trade with the Mainland | `trade_opinion_factor` 0.10 | *Envoys to the Western Shore* |
| `island_neutrality` | Island Neutrality | `stability_factor` 0.05, `war_support_factor` −0.05 | *Island Neutrality* |
| `isle_apart` | The Isle Keeps Apart | `stability_factor` 0.05, `war_support_factor` −0.05 | *The Isle Keeps Apart* |
| `old_freedoms` | The Old Freedoms | `stability_factor` 0.03, `political_power_gain` 0.05 | *The Old Freedoms of the Isle* |
| `harbour_charters` | Council of Harbours | `political_power_gain` 0.05, `trade_opinion_factor` 0.10 | *Council of Harbours* |
| `open_lanes` | Open Sea Lanes | `trade_opinion_factor` 0.10, `consumer_goods_factor` −0.02 | Chart houses in quiet seas |
| `harried_lanes` | Harried Sea Lanes | `trade_opinion_factor` −0.10, `stability_factor` −0.02 | Chart houses in corsair seas |
| `corsair_season` | Corsair Season | `convoy_raiding_efficiency_factor` 0.10, `navy_submarine_attack_factor` 0.10, `political_power_gain` 0.05 | Corsair havens in corsair seas |
| `lean_season` | A Lean Season in the Coves | `political_power_gain` −0.05, `stability_factor` −0.02 | Corsair havens in quiet seas |

### Events (namespace `zin_shared_tritons_islands`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `pirate_trial` | A Pirate Trial in [ROOT.GetName] | ROOT | *A Pirate Trial* and the tier B charter courts | **Hang them** (AI 60): piracy −2; stability 0.02. **Ransom them**: political power 50; piracy +1 |
| 2 | `charter_join_request` | An Island Asks to Join the Pupor Charter | Charter leader | `zin_tritons_join_charter` | **Welcome them** (AI 80; ×0 if FROM is a corsair haven): `add_to_faction` FROM. **Not now**: nothing |
| 3 | `banks_mediation` | Raerby Offers to Judge the Banks | Nondondor or the Seite Islands | `zin_tritons_offer_banks_mediation` | **Accept the judgment** (AI 60; Nondondor ×2 from 1 Thaw 1751; ×0.3 if Nondondor has completed `zin_regional_nondondor_the_banks_by_right`): flag `zin_tritons_mediation_accepted`; if the other side has it: `zin_tritons_make_banks_accord`. **Refuse**: mediator's opinion −10 (opinion modifier `zin_tritons_mediation_refused`) |

## Implementation

- Data: `docs/design/focus/shared_tritons_islands.json` with `"tier": "shared"` and the 28 countries.
- Compiled to `common/national_focus/zin_shared_tritons_islands.txt`, `common/ideas/zin_focus_shared_tritons_islands.txt`, `events/zin_shared_tritons_islands.txt`, `common/scripted_effects/zin_shared_tritons_islands.txt`, `common/scripted_triggers/zin_shared_tritons_islands.txt`, `common/opinion_modifiers/zin_shared_tritons_islands.txt`, `localisation/english/zin_focus_shared_tritons_islands_l_english.yml` (including the faction name `zin_faction_pupor_charter`).
- No `raw` blocks.

### Scripted effects (the Pupor Ocean and the tree)

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_tritons_add_piracy` (`value`) | any | Initialises `zin_tritons_piracy` to 35 once (global flag `zin_tritons_seas_init`); adds `value`; clamps 0–100; calls `zin_tritons_refresh_seas` |
| `zin_tritons_refresh_seas` | any | Sets `zin_tritons_sea_band`; on every country with `zin_region_tritons_islands`: removes the four band ideas, then adds the one matching its side and the band |
| `zin_tritons_set_side` (`side`) | country | Sets `zin_tritons_chart_house` or `zin_tritons_corsair_haven` (or clears both); a corsair haven leaves the Pupor Charter; refreshes |
| `zin_tritons_found_charter` | country | As in "The Pupor Charter" above |
| `zin_tritons_join_charter` | country | Fires `zin_shared_tritons_islands.2` to the Charter's leader |
| `zin_tritons_offer_banks_mediation` | country (mediator) | Fires `zin_shared_tritons_islands.3` to Nondondor and to the Seite Islands, skipping a side with `zin_tritons_mediation_accepted` |
| `zin_tritons_make_banks_accord` | any | Global flag `zin_tritons_banks_accord`; removes `zin_tritons_banks_quarrel` both ways; removes Nondondor's start spirit `zin_regional_nondondor_the_contested_banks`; non-aggression pact Nondondor–Seite Islands; piracy −3 |
| `zin_tritons_join_crossing` | country | As in "Joining the Western Crossing" above; needs `zin_western_crossing` and an existing Crossing faction |
| `zin_shared_tritons_islands_pay_tribute` | country | `OVERLORD = { add_political_power = 25 }` |
| `zin_shared_tritons_islands_seek_voice` | country | `add_autonomy_score` +10 for ROOT (engine effect, overlord scope) |

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_tritons_is_island_realm` | country | `has_country_flag = zin_region_tritons_islands` |
| `zin_tritons_ship_has_sailed` | any | `global.zin_eindil_stage` ≥ 6 |
| `zin_tritons_charter_exists` | any | global flag `zin_tritons_charter_founded` and the leader (flag `zin_tritons_charter_leader`) exists and leads a faction |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_tritons_banks_quarrel` | −20 | Nondondor ↔ Seite Islands; decays 0.5 a month; removed by the accord |
| `zin_tritons_mediation_refused` | −10 | Mediator → refuser; decays 1 a month |

### Calls and reads

Western Crossing: `zin_west_add_fleet`; flags `zin_western_crossing`, `zin_west_evacuation`, `zin_west_evacuated`; variable `zin_west_convener`; joining rule `zin_faction_rule_join_crossing`. Journey: `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_join_coalition`, `zin_eindil_friend`; variable `zin_eindil_stage`. Afrit: `zin_afrit_add_footholds`, `zin_afrit_houses_purged`. Rules: `zin_rules_is_historical`. Peoples: `zin_people_is_common_folk`. Economy: region flag `zin_region_tritons_islands`.

### Game rules and defines

None new.

## AI

- Roots first: *The Island Hall* 100. *The Great War at Sea* 200 when it opens.
- Charter or coves: on the historical path islands join the Charter (×3); under the free rule the weights follow piracy as tabled.
- *Sail with the Crossing* never under the historical rule; under the free rule weight 5, ×4 if its opinion of the convener is 50 or more.
- *A House of Healing*: base 15; ×0 for a country with `zin_afrit_suspicious`.
- Historical route (typical island): 1748 island hall, fish, the boats; 1749–1751 the Pupor question (Charter), the old charts, island pilots; 1752–1754 the mainland courts, charter patrols, the isle squadron; 1755 the great war at sea, the isle keeps apart; 1756 boats for the evacuation.

## Acceptance

1. The compiler accepts `shared_tritons_islands.json`: 52 focuses, unique keys and positions, prerequisites above their focuses, exclusives symmetric, days multiples of 7, no `raw` blocks; each of the 28 countries maps to this tree only.
2. The focus inspector reports no errors; the renderer produces a full review image and one for a sample island with `allow_branch` applied.
3. On 1 Thaw 4A 1748: no island is a chart house or a haven; no band idea is present; `zin_tritons_piracy` is unset and reads as 35 after the first change; no focus can create a war goal.
4. Scenario: three islands join the Charter, Pollos founds it: the faction exists with Pollos as leader and the three invited islands as members; a corsair haven cannot join.
5. Scenario: piracy driven to 70: chart houses carry `harried_lanes`, havens `corsair_season`; driven to 10: `open_lanes` and `lean_season`; islands that are neither carry no band idea.
6. Scenario: both Nondondor and the Seite Islands accept mediation: `zin_tritons_banks_accord` is set, the quarrel modifier is gone and the two have a non-aggression pact.
7. Historical observer run: no island declares a war; by 1755 piracy is below 25; every island takes *The Isle Keeps Apart* within 180 days of the war root opening.
8. Every modifier in the spirits table exists in the game's modifier documentation; every engine effect named exists in the effect documentation.

## Open questions

1. **Piracy.** The start situation names piracy as a living trade of the islands. Is a piracy level with chart houses and corsair havens the right shape for it, and should the historical path drive it down (as now) or leave it high?
2. **The Pupor Charter.** Is a defensive league of chart houses a welcome proposal, and is Pollos the right founder?
3. **The Southern Banks.** Are Nondondor and the Seite Islands neighbours on the final map? If not, which island is Nondondor's rival on its naval frontier?
4. **Island navigators.** Lorien's crew included island navigators. Should a Triton's island (rather than the Islands of the South) be named as their home?
5. **The islands in the war.** Should any island ever sail with the Western Crossing, or should the islands only sell ships?
