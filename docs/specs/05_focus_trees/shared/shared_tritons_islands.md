# Shared Triton's Islands tree

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6.

## Purpose

Twenty-eight island lordships of Triton's Islands share one tree, `shared_tritons_islands`. It makes a one-state island play like one: an island hall, fish, salt and sail, boats and pilots, the old charts of the Pupor Ocean, and the question every island answers sooner or later: join the chart houses that keep the sea lanes, shelter corsairs in its coves, or keep to its own waters. Branches open by people, ideology, overlord and the West's course (`allow_branch`). Text names the country with `[ROOT.GetName]` and `[ROOT.GetAdjective]`.

Triton's Islands have no great power and no mechanics spec. This spec therefore also defines a small regional system, **the Pupor Ocean** (piracy, chart houses and corsair havens, the Pupor Charter and the Southern Banks), which this tree and the six tier B island trees ([../regional/tritons_islands.md](../regional/tritons_islands.md)) share. It lives in this tree's scripted effects, triggers and ideas, so it needs no on-action of its own.

| Item | Value |
| --- | --- |
| Tree id | `shared_tritons_islands` (focus ids `zin_shared_tritons_islands_<key>`) |
| Tier | C (shared) |
| Countries (28) | Fineger, Hiohon, Tses - The Vestes, Ziza, Aatah, Amarelo, Anbei, Arpos, Beemste, Benan, Bono, Cheko, Dani, Hesos, Kile Islands, Kim, Kusu, Lemo, Li, Mondeluz, Previous Dark, Santon, Sondor, The Cursed Square, The Lens, Tined, Urbolon, Windy Lands (exactly the tier C list in [01_tiers_and_coverage.md](../01_tiers_and_coverage.md)) |
| Focuses | 52 (within the tier C size of 40 to 70; one island sees 45 to 52, by its branches) |
| Grid | x 0–25, y 0–8 |
| Events | namespace `zin_shared_tritons_islands` |
| Spirits | `zin_shared_tritons_islands_<key>` |

All 28 are clan realms of men (`zin_wild_clans`), almost all with one state and a few thousand men under arms. Their numbers stay small: manpower effects here are hundreds, not thousands.

**In the game today** (commit ca01fa3; checked 19 October 2026): all 28 exist with ZIN tags, the people `zin_people_men` and the stance `zin_wild_clans`; none is a subject; Fineger, Hiohon, Tses - The Vestes and Ziza have two states, the rest one. Every one runs the interim "Long Peace" tree (`zin_long_peace_*`), which this tree replaces for them. The game still starts on 1936.1.1 until the calendar spec ([../../00_foundation/01_start_and_calendar.md](../../00_foundation/01_start_and_calendar.md)) lands; dates here are 4A engine dates (start `1748.3.1`).

## Lore basis

- **Established:** Triton's Islands lie west of the West Lands and arc around the Pupor Ocean (drawn sheet "Tornado Islands"); Adel, Pollos, Raerby and Nondondor are there. In the First Age island peoples carried the Grand Alliance's supplies across Erdae's stormy seas. Lorien's crew for Eindil's voyage north included island navigators (which islands is not stated).
- **Proposed (vault):** the islanders charted the Pupor Ocean in 4A 702 and sold the charts to every crown; Senra of Triton's Islands, fleet captain of the Grand Alliance.
- **Proposed (start situation):** the islands live by fishing, piracy and charting; their tensions are piracy, fishing rights and naval frontiers (Nondondor).
- **Proposed (this spec):** the Pupor Ocean system (piracy, chart houses, corsair havens), the Pupor Charter, the Southern Banks, every focus, spirit, event and number.
- **Kept open:** which islands sent navigators with Lorien's ship; the islands' part in the War of the Last Crowns (the vault is silent; every war focus here is play). Before `zin_afrit_revealed` no text names Afrit. No focus names Eindil; the hidden *Southern Ship* focus speaks only of a fast ship with elves among its crew.

## The Pupor Ocean (regional system, proposed)

### Piracy

`zin_tritons_piracy` (global variable, 0–100, start 35) is how lawless the Pupor Ocean is. It changes only through `zin_tritons_add_piracy` (`value`), which every Triton's tree calls. The first call sets it to 35 if it is unset (global flag `zin_tritons_seas_init`), so no on-action is needed. Values clamp to 0–100. After each change the effect runs `zin_tritons_refresh_seas`. Before the first call the variable reads 0; every test this tree and the tier B trees make is "piracy ≥ 40" or higher, which gives the same answer for 0 as for 35.

| Band | Piracy | Chart houses get | Corsair havens get |
| --- | --- | --- | --- |
| Quiet seas | 0–24 | `open_lanes` | `lean_season` |
| Wary seas | 25–59 | — | — |
| Corsair seas | 60–100 | `harried_lanes` | `corsair_season` |

The band is stored in `zin_tritons_sea_band` (global; 0 quiet, 1 wary, 2 corsair).

### Chart houses and corsair havens

Every Triton's country is a **chart house** (country flag `zin_tritons_chart_house`), a **corsair haven** (country flag `zin_tritons_corsair_haven`) or neither. `zin_tritons_set_side` (`side` = chart, haven, none) sets one flag, clears the other and refreshes the band ideas. Only focuses set the side; nobody is either at the start.

### The Pupor Charter

**The Pupor Charter** (proposed name; faction template `zin_faction_pupor_charter`, name key `zin_faction_pupor_charter`) is a defensive league of chart houses. `zin_tritons_found_charter` creates it with ROOT as leader (`create_faction_from_template = zin_faction_pupor_charter`; the deprecated `create_faction` is not used), sets global flag `zin_tritons_charter_founded` and country flag `zin_tritons_charter_leader`, adds every Triton's country that has flag `zin_tritons_charter_invited` and is not in another faction (`add_to_faction`), makes ROOT a chart house and adds piracy −5. If the Charter already exists, the effect calls `zin_tritons_join_charter` instead. `zin_tritons_join_charter` fires `zin_shared_tritons_islands.2` to the Charter's leader. Corsair havens may not join (joining rule). The Charter never declares wars; its focuses lower piracy.

The template and its joining rule belong in the diplomacy spec's faction files (`common/factions/templates/zin_factions.txt`, `common/factions/rules/zin_joining_rules.txt`); proposed rules: joining `zin_faction_rule_join_pupor_charter` (`has_country_flag = zin_region_tritons_islands` and not `zin_tritons_corsair_haven`), `war_declaration_rule_faction_leader_only`, `call_to_war_rule_faction_leader_only`, `change_leader_rule_never`, vanilla peace rule, no manifest.

### The Southern Banks

The fishing banks between Nondondor and the Seite Islands are disputed (proposed reading of Nondondor's "contested naval frontier"; the working proposal of [OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md) "regions: cold, west, tritons" 8; if the final map does not make them neighbours, the builder still writes the quarrel, which works at any distance). The quarrel is an opinion modifier, `zin_tritons_banks_quarrel` (−20 both ways, decays 0.5 a month), never a war at the start. A mediator calls `zin_tritons_offer_banks_mediation`, which fires `zin_shared_tritons_islands.3` to each side that has not yet accepted. Each acceptance sets country flag `zin_tritons_mediation_accepted`; when both sides have it, `zin_tritons_make_banks_accord` runs: global flag `zin_tritons_banks_accord`; the quarrel modifier is removed both ways; Nondondor's start spirit `zin_regional_nondondor_the_contested_banks` is removed; a non-aggression pact between the two; piracy −3. Nondondor's tree may instead end the dispute by the Seite Islands yielding (global flag `zin_tritons_banks_yielded`, set by `zin_regional_nondondor.1`).

### Joining the Western Crossing

The diplomacy spec's joining rule `zin_faction_rule_join_crossing` admits Triton's Islands countries. `zin_tritons_join_crossing` (available only after `zin_western_crossing`) has the convener (`global.zin_west_convener`) add ROOT to the Crossing's faction (`add_to_faction`) and to its war against the Aenor realm (`add_to_war` with `targeted_alliance` the convener), and sets ROOT's flag `zin_tritons_with_the_crossing`. The islands send ships, not landings: the calling focus adds fleet +3 (`zin_west_add_fleet`). Never on the historical path.

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

`allow_branch` conditions: W `check zin_people_is_common_folk`; O `is_subject`; L `ideology light`; the focus `the_southern_ship` `check zin_tritons_ship_has_sailed` (global `zin_eindil_stage` ≥ 6). Each root's `available` repeats its condition, so a stale layout never lets a wrong country take a branch.

### The peaceful start

No focus in this tree creates a war goal. The only war an island can join is the Western Crossing (`sail_with_the_crossing`, after `zin_western_crossing`, never historical) and Eindil's coalition (`beside_the_heir`, after `zin_eindil_returned`).

### Notation

Effects and conditions use the compiler vocabulary ([00_format_and_compiler.md](../00_format_and_compiler.md)) and the S9 extensions. Shorthand in the tables:

| Shorthand | Compiles to |
| --- | --- |
| **piracy ±n** | `call zin_tritons_add_piracy` (`value` n) |
| **piracy ≥ n** | `variable global.zin_tritons_piracy above n−1` |
| **side chart / haven** | `call zin_tritons_set_side` (`side` chart / haven) |
| **fleet ±n** | `call zin_west_add_fleet` (`value` n) |
| **regard ±n**, **renown ±n** | `call zin_eindil_add_regard` (`value` n; on ROOT), `call zin_eindil_add_renown` (`value` n) |
| **join coalition** | `call zin_eindil_join_coalition` |
| **friend** | `check zin_eindil_friend` (regard ≥ 25) |
| **hist** | AI factor while `check zin_rules_is_historical` is true |
| **research [c] b ×u** | `research` (categories [c], bonus b, uses u); categories are the warfare spec's `zin_cat_*` |

Days are 35 unless shown. Every AI value is a base weight; "×f at …" entries are `ai` modifiers.

### R. The Island Hall (every country)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_island_hall` | The Island Hall of [ROOT.GetName] | `council_table` | — | — | 1,0 | 35 | political_power 50 | 100 |
| `the_island_elders` | The Island Elders | `council_table` | the_island_hall | — | 0,1 | 35 | stability 0.03 | 20 |
| `hearth_and_harbour` | Hearth and Harbour | `fishing_boats` | the_island_hall | — | 2,1 | 35 | political_power 25 | 15 |
| `the_islanders_oath` | The Islanders' Oath | `handshake_oath` | the_island_elders or hearth_and_harbour | — | 1,2 | 70 | political_power 50; stability 0.03; add_spirit islanders_oath | 15 |

### E. Fish, Salt and Sail (every country)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `fish_salt_and_sail` | Fish, Salt and Sail | `fishing_boats` | — | — | 4,0 | 35 | building industrial_complex 1 capital | 25 |
| `the_drying_sheds` | The Drying Sheds | `granary` | fish_salt_and_sail | — | 3,1 | 35 | political_power 25; add_spirit drying_sheds | 12 |
| `the_salt_pans` | The Salt Pans | `market_stalls` | fish_salt_and_sail | — | 5,1 | 35 | political_power 25 | 10 |
| `the_boatyard` | The Boatyard | `shipwright_yard` | the_drying_sheds or the_salt_pans | — | 4,2 | 35 | building dockyard 1 random_coastal | 12 |
| `the_island_market` | The Island Market | `market_stalls` | the_boatyard | — | 4,3 | 35 | political_power 50 | 10 |
| `stores_against_the_storm` | Stores Against the Storm | `granary` | the_island_market | — | 4,4 | 35 | stability 0.05 | 10 |

Building keys are the engine keys the economy spec keeps and renames (`industrial_complex` Guild Workshops, `dockyard` Shipwrights).

### N. The Island Boats (every country)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_island_boats` | The Island Boats | `harbour_lake` | — | — | 7,0 | 35 | building naval_base 1 random_coastal | 20 |
| `galleys_of_the_isle` | Galleys of the Isle | `galley_oars` | the_island_boats | — | 6,1 | 35 | research [zin_cat_galleys] 0.5 ×1 | 10 |
| `island_pilots` | Island Pilots | `compass_rose` | the_island_boats | — | 8,1 | 35 | navy_experience 10; add_spirit island_pilots_spirit | 10 |
| `the_sea_watch` | The Sea Watch | `lighthouse` | galleys_of_the_isle or island_pilots | — | 7,2 | 35 | building coastal_bunker 1 random_coastal | 8 |
| `the_isle_squadron` | The Isle Squadron | `warship_sail` | the_sea_watch | — | 7,3 | 70 | add_spirit isle_squadron | 8 |

### W. The Island Levy (people `men`)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_island_levy` | The Island Levy | `levy_muster` | — | — | 10,0 | 35 | available: check zin_people_is_common_folk; manpower 500; army_experience 5 | 10 |
| `sea_soldiers` | Sea Soldiers | `sword_shield` | the_island_levy | — | 9,1 | 35 | add_spirit sea_soldiers_isle | 8 |
| `isle_bows` | Bows of the Isle | `bow_archers` | the_island_levy | — | 11,1 | 35 | research [zin_cat_bows] 0.5 ×1 | 8 |

### P. Charter or Coves (every country)

**Purpose:** the island's answer to the Pupor Ocean's piracy. **Mutual exclusions:** *Join the Pupor Charter* / *The Free Coves* / *Keep to Our Own Waters*.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_pupor_question` | The Pupor Question | `sea_charts` | — | — | 14,0 | 35 | political_power 25; tooltip "Some islands keep the sea lanes. Some shelter those who prey on them." | 30 |
| `join_the_pupor_charter` | Join the Pupor Charter | `sea_charts` | the_pupor_question | the_free_coves, keep_to_our_own_waters | 12,1 | 35 | side chart; piracy −2; `if` check zin_tritons_charter_exists: call zin_tritons_join_charter, `else` flag zin_tritons_charter_invited | 30; ×2 at piracy ≥ 40; hist ×3 |
| `the_free_coves` | The Free Coves | `corsair_raider` | the_pupor_question | join_the_pupor_charter, keep_to_our_own_waters | 14,1 | 35 | side haven; piracy +3 | 15; ×2 at piracy ≥ 60; hist ×0 |
| `keep_to_our_own_waters` | Keep to Our Own Waters | `fishing_boats` | the_pupor_question | join_the_pupor_charter, the_free_coves | 16,1 | 35 | add_spirit own_waters | 30 |
| `charter_patrols` | Charter Patrols | `galley_oars` | join_the_pupor_charter | — | 12,2 | 35 | piracy −3; navy_experience 5 | 15 |
| `courts_of_the_charter` | A Pirate Trial | `scroll_sealed` | charter_patrols | — | 12,3 | 35 | stability 0.03; event pirate_trial (`zin_shared_tritons_islands.1`) | 15 |
| `the_cove_raiders` | The Cove Raiders | `corsair_raider` | the_free_coves | — | 14,2 | 35 | piracy +3; navy_experience 10 | 15 |
| `sell_to_any_buyer` | Sell to Any Buyer | `coin_chest` | the_cove_raiders | — | 14,3 | 35 | political_power 50 | 15 |
| `fishers_not_fighters` | Fishers, Not Fighters | `fishing_boats` | keep_to_our_own_waters | — | 16,2 | 35 | political_power 25; stability 0.02 | 15 |
| `the_quiet_isle` | The Quiet Isle | `island_shrine` | fishers_not_fighters | — | 16,3 | 35 | stability 0.05 | 15 |

### C. The Old Charts (every country)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_old_charts` | The Old Charts | `sea_charts` | — | — | 19,0 | 35 | political_power 25; tooltip "Our forebears charted the Pupor Ocean and sold the charts to every crown." | 15 |
| `charts_for_sale` | Charts for Sale | `map_unrolled` | the_old_charts | — | 18,1 | 35 | political_power 50 | 12 |
| `soundings_of_the_pupor` | Soundings of the Pupor | `compass_rose` | the_old_charts | — | 20,1 | 35 | navy_experience 10 | 10 |
| `the_chart_makers_guild` | The Chart-Makers' Guild | `map_unrolled` | charts_for_sale or soundings_of_the_pupor | — | 19,2 | 35 | add_spirit chart_makers | 10 |

### M. The Mainland Courts (every country)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_mainland_courts` | The Mainland Courts | `envoy` | — | — | 22,0 | 35 | political_power 25 | 15 |
| `envoys_to_the_west` | Envoys to the Western Shore | `envoy` | the_mainland_courts | — | 21,1 | 35 | add_spirit mainland_trade | 10 |
| `a_word_from_parim` | A Word from Parim | `crown_gold` | the_mainland_courts | — | 23,1 | 35 | political_power 50; tooltip "Parim's tariffs reach even the islands." | 10 |
| `island_neutrality` | Island Neutrality | `olive_branch` | envoys_to_the_west or a_word_from_parim | — | 22,2 | 35 | add_spirit island_neutrality_spirit | 10 |

### H. The Houses of the First Light (every country)

The Afrit spec starts these countries at footholds 1 with cap 3, so one House (footholds 2) is within the cap.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `a_house_of_healing` | A House of Healing | `house_first_light` | — | — | 24,0 | 35 | available: not flag zin_afrit_houses_purged; not global_flag zin_afrit_revealed; call zin_afrit_add_footholds (`value` 1; the Afrit spec clamps it to the cap and its tooltip shows only the public name "Houses of the First Light"); stability 0.03; tooltip "The Houses of the First Light offer a hospital and a grain store." | 15; ×0 with flag zin_afrit_suspicious |

### S. A Harbour for Any Sail (every country)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `a_harbour_for_any_sail` | A Harbour for Any Sail | `harbour_lake` | — | — | 25,0 | 35 | flag zin_eindil_safe_harbour; stability 0.02 | 10; hist ×0 |
| `the_southern_ship` | The Southern Ship | `ship_voyage` | a_harbour_for_any_sail | — | 25,1 | 35 | allow_branch and available: check zin_tritons_ship_has_sailed; renown +1; regard +5; tooltip "Sailors speak of a fast ship from the south, with elves among its crew." | 20 |

`zin_eindil_safe_harbour` is a proposed journey hook (contract additions register): in stage 6 (ports of call) *Resupply the ship* gets AI weight ×2 under the dynamic rule. It does nothing under the historical rule.

### X. The Great War at Sea (every country)

**Purpose:** what an island does when the West crosses and the world goes to war. **Mutual exclusion:** *The Isle Keeps Apart* (historical) / *Sail with the Crossing*. Selling ships and boats for the evacuation are trade, not war, and stay open to both.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_great_war_at_sea` | The Great War at Sea | `storm_sea` | — | — | 14,6 | 35 | available: `or` [global_flag zin_war_of_last_crowns, global_flag zin_western_crossing]; political_power 25 | 200 |
| `the_isle_keeps_apart` | The Isle Keeps Apart | `island_shrine` | the_great_war_at_sea | sail_with_the_crossing | 12,7 | 35 | add_spirit isle_apart | 40; hist ×100 |
| `ships_for_the_crossing` | Ships for the Crossing | `ship_voyage` | the_great_war_at_sea | — | 14,7 | 35 | available: global_flag zin_western_crossing; fleet +2; political_power 50 | 20; hist ×0.5 |
| `sail_with_the_crossing` | Sail with the Crossing | `banner_league` | the_great_war_at_sea | the_isle_keeps_apart | 16,7 | 35 | available: global_flag zin_western_crossing; `not` [at_war]; call zin_tritons_join_crossing; fleet +3 | 5; ×4 if check zin_tritons_likes_convener; hist ×0 |
| `beside_the_heir` | Beside the Heir | `lone_sword` | the_great_war_at_sea | — | 13,8 | 35 | available: global_flag zin_eindil_returned; friend; join coalition | 100 |
| `boats_for_the_evacuation` | Boats for the Evacuation | `anchor_rope` | ships_for_the_crossing or the_isle_keeps_apart | — | 15,8 | 35 | available: global_flag zin_west_evacuation; not global_flag zin_west_evacuated; fleet +3; political_power 25 | 50 |

### O. Under a Greater Flag (subjects)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `under_a_greater_flag` | Under a Greater Flag | `seal_wax` | — | — | 19,6 | 35 | available: is_subject; stability 0.05 | 50 |
| `tribute_of_fish` | Tribute of Fish and Salt | `tribute_chest` | under_a_greater_flag | — | 18,7 | 35 | call zin_shared_tritons_islands_pay_tribute (overlord +25 political power) | 20 |
| `a_voice_in_the_hall` | A Voice in the Hall | `envoy` | under_a_greater_flag | — | 20,7 | 35 | political_power 50; call zin_shared_tritons_islands_seek_voice (autonomy score +10) | 15 |
| `the_old_freedoms` | The Old Freedoms of the Isle | `charter_old` | tribute_of_fish or a_voice_in_the_hall | — | 19,8 | 35 | add_spirit old_freedoms | 15 |

### L. The Isle Council (ideology `light`)

No island in this tree starts Light; an island whose government turns Light gains it.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_isle_council` | The Isle Council | `council_table` | — | — | 22,6 | 35 | available: ideology light; stability 0.03; political_power 25 | 30 |
| `council_of_harbours` | Council of Harbours | `charter_free` | the_isle_council | — | 21,7 | 35 | add_spirit harbour_charters | 15 |
| `the_open_assembly` | The Open Assembly | `guild_hall` | the_isle_council | — | 23,7 | 35 | stability 0.05 | 15 |

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

What one island sees (the renderer checks these views):

| Sample | Branches | Focuses |
| --- | --- | ---: |
| Typical island (men, independent, Wild) | R, E, N, W, P, C, M, H, S, X | 45 |
| Subject island | as above, plus O | 49 |
| Light subject island | every branch | 52 |

### Spirits

Keys compile to `zin_shared_tritons_islands_<key>`. Icons are idea crops of the named catalog key. All are permanent; the four sea-band ideas are applied and removed only by `zin_tritons_refresh_seas`, on every Triton's country (tier B and C). Every modifier is in the 1.19.3 modifier documentation (checked 19 October 2026). `navy_submarine_attack_factor` applies to corsairs, which the warfare spec builds on the engine's submarine type (`zin_ship_raider`).

| Key | Name | Icon | Modifiers | Added by |
| --- | --- | --- | --- | --- |
| `islanders_oath` | The Islanders' Oath | `handshake_oath` | `drift_defence_factor` 0.10, `stability_factor` 0.02 | *The Islanders' Oath* |
| `drying_sheds` | The Drying Sheds | `granary` | `consumer_goods_factor` −0.02 | *The Drying Sheds* |
| `island_pilots_spirit` | Island Pilots | `compass_rose` | `navy_max_range_factor` 0.10, `naval_speed_factor` 0.03 | *Island Pilots* |
| `isle_squadron` | The Isle Squadron | `warship_sail` | `navy_org_factor` 0.05, `naval_detection` 0.05 | *The Isle Squadron* |
| `sea_soldiers_isle` | Sea Soldiers | `sword_shield` | `amphibious_invasion` 0.10 | *Sea Soldiers* |
| `own_waters` | Our Own Waters | `fishing_boats` | `stability_factor` 0.03, `drift_defence_factor` 0.10 | *Keep to Our Own Waters* |
| `chart_makers` | The Chart-Makers' Guild | `map_unrolled` | `navy_max_range_factor` 0.10, `naval_detection` 0.05 | *The Chart-Makers' Guild* |
| `mainland_trade` | Trade with the Mainland | `envoy` | `trade_opinion_factor` 0.10 | *Envoys to the Western Shore* |
| `island_neutrality_spirit` | Island Neutrality | `olive_branch` | `stability_factor` 0.05, `war_support_factor` −0.05 | *Island Neutrality* |
| `isle_apart` | The Isle Keeps Apart | `island_shrine` | `stability_factor` 0.05, `war_support_factor` −0.05 | *The Isle Keeps Apart* |
| `old_freedoms` | The Old Freedoms | `charter_old` | `stability_factor` 0.03, `political_power_gain` 0.05 | *The Old Freedoms of the Isle* |
| `harbour_charters` | Council of Harbours | `charter_free` | `political_power_gain` 0.05, `trade_opinion_factor` 0.10 | *Council of Harbours* |
| `open_lanes` | Open Sea Lanes | `sea_charts` | `trade_opinion_factor` 0.10, `consumer_goods_factor` −0.02 | Chart houses in quiet seas |
| `harried_lanes` | Harried Sea Lanes | `storm_sea` | `trade_opinion_factor` −0.10, `stability_factor` −0.02 | Chart houses in corsair seas |
| `corsair_season` | Corsair Season | `corsair_raider` | `convoy_raiding_efficiency_factor` 0.10, `navy_submarine_attack_factor` 0.10, `political_power_gain` 0.05 | Corsair havens in corsair seas |
| `lean_season` | A Lean Season in the Coves | `shipwreck` | `political_power_gain` −0.05, `stability_factor` −0.02 | Corsair havens in quiet seas |

### Events (namespace `zin_shared_tritons_islands`)

Every event is effect-triggered (no `trigger` or `mean_time_to_happen`). Pictures are keys that exist in the game today (`tools/content/data/presentation-cells.json`); none is gated.

| Id | Key | Title | To | Picture | Fired by | Text (gist) | Options |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `pirate_trial` | A Pirate Trial in [ROOT.GetName] | ROOT | `generic_sea` | *A Pirate Trial* and the tier B charter courts | Charter galleys bring in a corsair crew; the island must judge them. | **Hang them** (AI 60): piracy −2; stability 0.02. **Ransom them** (AI 40): political_power 50; piracy +1 |
| 2 | `charter_join_request` | An Island Asks to Join the Pupor Charter | Charter leader | `generic_sea` | `zin_tritons_join_charter` | [FROM.GetName] asks for a place among the chart houses. | **Welcome them** (AI 80; ×0 if check zin_tritons_from_is_haven): invite FROM. **Not now** (AI 20): nothing |
| 3 | `banks_mediation` | [FROM.GetName] Offers to Judge the Banks | Nondondor or the Seite Islands | `generic_sea` | `zin_tritons_offer_banks_mediation` | The brokers of [FROM.GetName] offer to judge the Southern Banks. | **Accept the judgment** (AI 60; Nondondor ×2 after `1751.3.1`; ×0.3 if check zin_tritons_banks_pressed): call zin_tritons_accept_mediation. **Refuse** (AI 40): call zin_tritons_refuse_mediation |

Requested picture (art phase; the events use the existing key until it is generated): `tritons_pirate_trial` (ungated; a corsair crew in chains on an island quay before chart-house galleys) for events 1 and 2.

### Text rules

- Each focus `desc` is one to three plain sentences, written in the data file from the focus's name, effects and branch purpose, and names the country with `[ROOT.GetName]` or `[ROOT.GetAdjective]`.
- No text names Afrit (compiler check 6). No text names Eindil; *The Southern Ship* speaks only of a fast ship with elves among its crew, and no text says which island sent navigators.

## Implementation

- Builder: the focus compiler `tools/content/modules/focus_compiler.mjs` ([00_format_and_compiler.md](../00_format_and_compiler.md)) reads the data below and writes every file, the Pupor Ocean effects included, in the builder's one transaction through the shared rewrite engine (`tools/content/apply.mts`).
- Data: `docs/design/focus/shared_tritons_islands.json` with `"tier": "shared"` and the 28 countries. Names (Nondondor, the Seite Islands, Raerby, Pollos) resolve to tags through `tools/content/data/countries.json` at build time.
- Today these countries run the interim Long Peace tree (`zin_long_peace_*`, written by `tools/content/modules/vanilla_removal.mjs`); the compiled tree replaces it for the 28, and the coverage check fails if a country keeps both.
- Research categories (`zin_cat_galleys`, `zin_cat_bows`) come from the warfare spec ([01_warfare.md](../../03_gameplay/01_warfare.md), phase 3, before this tree's phase 6). Building keys are the engine keys the economy spec re-themes. The country flag `zin_region_tritons_islands` is set on startup by the economy spec ([02_economy.md](../../03_gameplay/02_economy.md)). The tier B island trees call the Pupor effects; they are compiled after this tree in the same build, and the compiler resolves their `call` and `check` names against this tree's files.
- Compiled to `common/national_focus/zin_shared_tritons_islands.txt`, `common/ideas/zin_focus_shared_tritons_islands.txt`, `events/zin_shared_tritons_islands.txt`, `common/scripted_effects/zin_shared_tritons_islands.txt`, `common/scripted_triggers/zin_shared_tritons_islands.txt`, `common/opinion_modifiers/zin_shared_tritons_islands.txt` (from the data's `opinion_modifiers` block, the mechanism the other tree specs use), `localisation/english/zin_focus_shared_tritons_islands_l_english.yml` (UTF-8 with BOM; includes the faction name `zin_faction_pupor_charter`).
- The faction template `zin_faction_pupor_charter` and joining rule `zin_faction_rule_join_pupor_charter` are written with the diplomacy spec's faction files (see "The Pupor Charter").
- No `raw` blocks.

### Scripted effects (the Pupor Ocean and the tree)

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_tritons_add_piracy` (`value`) | any | Initialises `global.zin_tritons_piracy` to 35 once (global flag `zin_tritons_seas_init`); `add_to_variable`; `clamp_variable` 0–100; calls `zin_tritons_refresh_seas` |
| `zin_tritons_refresh_seas` | any | Sets `zin_tritons_sea_band`; on every country with `zin_region_tritons_islands`: `remove_ideas` the four band ideas, then `add_ideas` the one matching its side and the band |
| `zin_tritons_set_side` (`side`) | country | Dispatches to `zin_tritons_set_side_$side$` (three helper effects: `_chart`, `_haven`, `_none`), which set `zin_tritons_chart_house` or `zin_tritons_corsair_haven` (or clear both); a new corsair haven in the Pupor Charter `leave_faction`s; then refreshes |
| `zin_tritons_found_charter` | country | As in "The Pupor Charter" above |
| `zin_tritons_join_charter` | country | Fires `zin_shared_tritons_islands.2` to the Charter's leader (the country with `zin_tritons_charter_leader`) |
| `zin_tritons_offer_banks_mediation` | country (mediator) | Fires `zin_shared_tritons_islands.3` to Nondondor and to the Seite Islands, skipping a side with `zin_tritons_mediation_accepted` |
| `zin_tritons_accept_mediation` | country (a side; FROM = mediator) | Country flag `zin_tritons_mediation_accepted`; if the other side has it too, `zin_tritons_make_banks_accord` |
| `zin_tritons_refuse_mediation` | country (a side; FROM = mediator) | FROM gets opinion modifier `zin_tritons_mediation_refused` toward ROOT |
| `zin_tritons_make_banks_accord` | any | Global flag `zin_tritons_banks_accord`; `remove_opinion_modifier` `zin_tritons_banks_quarrel` both ways; `remove_ideas` `zin_regional_nondondor_the_contested_banks` on Nondondor; non-aggression pact Nondondor–Seite Islands (`diplomatic_relation`); piracy −3 |
| `zin_tritons_join_crossing` | country | As in "Joining the Western Crossing" above; needs `zin_western_crossing` and an existing Crossing faction |
| `zin_shared_tritons_islands_pay_tribute` | country | `OVERLORD = { add_political_power = 25 }` |
| `zin_shared_tritons_islands_seek_voice` | country (the subject) | `add_autonomy_score = { value = 10 localization = zin_shared_tritons_islands_voice_tt }` (engine effect; it runs in the subject's own scope, as vanilla does) |

### Scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_tritons_is_island_realm` | country | `has_country_flag = zin_region_tritons_islands` |
| `zin_tritons_ship_has_sailed` | any | `check_variable = { global.zin_eindil_stage > 5 }` |
| `zin_tritons_charter_exists` | any | global flag `zin_tritons_charter_founded`, and the country with flag `zin_tritons_charter_leader` exists and `is_faction_leader = yes` |
| `zin_tritons_from_is_haven` | country | `FROM = { has_country_flag = zin_tritons_corsair_haven }` |
| `zin_tritons_banks_pressed` | any | Nondondor exists and `has_completed_focus = zin_regional_nondondor_the_banks_by_right` |
| `zin_tritons_likes_convener` | country | `has_opinion = { target = var:global.zin_west_convener value > 49 }` |

### Opinion modifiers

| Key | Value | Decay | Notes |
| --- | ---: | --- | --- |
| `zin_tritons_banks_quarrel` | −20 | 0.5 a month | Nondondor ↔ Seite Islands; added by the tier B trees; removed by the accord |
| `zin_tritons_mediation_refused` | −10 | 1 a month | Mediator → refuser |

### Flags and variables

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_tritons_piracy`, `zin_tritons_sea_band` | global variables | Piracy and its band |
| `zin_tritons_seas_init` | global flag | Piracy initialised |
| `zin_tritons_chart_house`, `zin_tritons_corsair_haven` | country flags | The island's side |
| `zin_tritons_charter_founded` | global flag | The Pupor Charter exists |
| `zin_tritons_charter_leader`, `zin_tritons_charter_invited` | country flags | The Charter's leader; invited to join when it is founded |
| `zin_tritons_mediation_accepted` | country flag | Accepted the banks mediation |
| `zin_tritons_banks_accord`, `zin_tritons_banks_yielded` | global flags | The banks dispute ended by accord / by the Seite Islands yielding (the latter set by Nondondor's tree) |
| `zin_tritons_with_the_crossing` | country flag | Sailed with the Western Crossing |
| `zin_eindil_safe_harbour` | country flag | Journey hook, see branch S |

### Calls and reads

| Owner | Names |
| --- | --- |
| [Western Crossing](../../04_mechanics/western_crossing.md) | effect `zin_west_add_fleet`; flags `zin_western_crossing`, `zin_west_evacuation`, `zin_west_evacuated`; variable `zin_west_convener`; the Crossing faction |
| [Diplomacy](../../03_gameplay/03_diplomacy_and_factions.md) | joining rule `zin_faction_rule_join_crossing`; the Pupor Charter template and joining rule (requested) |
| [Eindil's journey](../../04_mechanics/eindil_journey.md) | effects `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_join_coalition`; trigger `zin_eindil_friend`; variable `zin_eindil_stage`; flag `zin_eindil_returned` |
| [Afrit](../../04_mechanics/afrit_hidden_council.md) | effect `zin_afrit_add_footholds`; flags `zin_afrit_houses_purged`, `zin_afrit_suspicious`, `zin_afrit_revealed` |
| [Defines and rules](../../00_foundation/05_defines_and_rules.md) | trigger `zin_rules_is_historical` |
| [Peoples](../../00_foundation/03_peoples.md) | trigger `zin_people_is_common_folk` |
| [Economy](../../03_gameplay/02_economy.md) | region flag `zin_region_tritons_islands` |
| [Regional Triton's trees](../regional/tritons_islands.md) | Nondondor's spirit `zin_regional_nondondor_the_contested_banks` and focus `zin_regional_nondondor_the_banks_by_right` |
| Contract | `zin_war_of_last_crowns` |

Engine effects named: `create_faction_from_template`, `add_to_faction`, `leave_faction`, `add_to_war`, `add_ideas`, `remove_ideas`, `set_variable`, `add_to_variable`, `clamp_variable`, `set_global_flag`, `set_country_flag`, `clr_country_flag`, `diplomatic_relation`, `add_opinion_modifier`, `remove_opinion_modifier`, `add_political_power`, `add_autonomy_score`, `country_event`, `mark_focus_tree_layout_dirty`. Engine triggers named: `has_country_flag`, `check_variable`, `is_faction_leader`, `has_completed_focus`, `has_opinion`. All are in the 1.19.3 documentation (checked 19 October 2026).

### `allow_branch` refresh

The journey effect that advances `zin_eindil_stage` to 6 calls `mark_focus_tree_layout_dirty` for every country with `zin_region_tritons_islands` (dependency, as in the regional island trees). Overlord and government changes refresh through the compiler's shared `common/on_actions/zin_focus_layout.txt` (decision E4, [../00_format_and_compiler.md](../00_format_and_compiler.md)). Every root repeats its condition in `available`.

### Game rules and defines

None new.

## AI

- Roots first: *The Island Hall* 100. *The Great War at Sea* 200 when it opens.
- Charter or coves: on the historical path islands join the Charter (×3); under the free rule the weights follow piracy as tabled.
- *Sail with the Crossing* never under the historical rule; under the free rule weight 5, ×4 if its opinion of the convener is 50 or more.
- *A House of Healing*: base 15; ×0 for a country with `zin_afrit_suspicious`.
- Historical route (typical island): 1748 island hall, fish, the boats; 1749–1751 the Pupor question (Charter), the old charts, island pilots; 1752–1754 the mainland courts, charter patrols, the isle squadron; 1755 the great war at sea, the isle keeps apart; 1756 boats for the evacuation.

## Acceptance

1. The compiler accepts `shared_tritons_islands.json`: 52 focuses; unique keys and positions; every prerequisite above its focus; exclusives symmetric; days multiples of 7 between 7 and 140; every icon and event picture a catalog key present in the game; every modifier in the 1.19.3 modifier documentation; every `call` and `check` resolves; no `raw` blocks. The coverage check maps each of the 28 countries to this tree only.
2. The focus inspector and script validator report no errors; the renderer produces a full review image and one per sample in the "What one island sees" table with `allow_branch` applied; the visible counts match that table.
3. On 1 Thaw 4A 1748: no island is a chart house or a haven; no band idea is present; `zin_tritons_piracy` is unset and reads 35 after the first change; no focus can create a war goal; *The Southern Ship* is hidden.
4. Scenario: three islands take *Join the Pupor Charter* before it exists, then Pollos founds it: the faction exists with Pollos as leader and the three invited islands as members; a corsair haven cannot join.
5. Scenario: piracy driven to 70: chart houses carry `harried_lanes`, havens `corsair_season`; driven to 10: `open_lanes` and `lean_season`; islands that are neither carry no band idea.
6. Scenario: both Nondondor and the Seite Islands accept mediation: `zin_tritons_banks_accord` is set, the quarrel modifier is gone and the two have a non-aggression pact.
7. Historical observer run (Linux; one in-game year at the end of phase 6, then the full historical run): no island declares a war; by 1755 piracy is below 25; every island takes *The Isle Keeps Apart* within 180 days of the war root opening.
8. Scenario: an island completes *A Voice in the Hall* as a subject; its autonomy score rises by 10.

## Open questions

None remains open inside this spec. The owner's questions proceed on the proposal shown; they are listed in [OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md) under "regions: cold, west, tritons" 7 to 9.

1. **Piracy.** Proposal: the piracy level with chart houses and corsair havens, as specified; the historical path drives it below 25 by 1755 (the Charter wins).
2. **The Southern Banks.** Proposal: Nondondor and the Seite Islands are neighbours and rivals; the quarrel works even if the map puts them apart.
3. **Island navigators.** Proposal: the vault does not say which islands sent navigators; no Triton's island is named, and *The Southern Ship* stays a memory any island may have.
4. **The islands in the war.** Proposal: islands sell ships on the historical path; *Sail with the Crossing* stays a free-rule choice (AI weight 0 under the historical rule).

Settled here (proposed design): the Pupor Charter is a defensive league of chart houses; Pollos founds it on the historical path (tier B tree).
