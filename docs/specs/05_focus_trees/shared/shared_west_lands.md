# Shared West Lands tree

**Status:** Draft. **Priority:** 6. **Phase:** 6.

## Purpose

Fourteen freeholds of the West Lands share one tree, `shared_west_lands`. It makes a small western lordship play like one: a freehold hall and its moot, horses, grain and timber, the old grudge against Aenor and the coin Parim offers to soften it, the Truce of the Grey Ford on its doorstep, the stranger's road south, and the West's great question. Branches open by people, ideology, overlord, coast and region (`allow_branch`), and the late branches open by the course the West chose at the Ford Council: the Crossing, our own shore, or the Western Relief. Text names the country with `[ROOT.GetName]` and `[ROOT.GetAdjective]`.

The tree implements the small courts' side of [the Western Crossing mechanic](../../04_mechanics/western_crossing.md) and gives small hooks into [Eindil's journey](../../04_mechanics/eindil_journey.md) and [Afrit's Hidden Council](../../04_mechanics/afrit_hidden_council.md). Gunwaith has its major tree ([../major/gunwaith.md](../major/gunwaith.md)); the tier B courts are in [../regional/west_lands.md](../regional/west_lands.md).

| Item | Value |
| --- | --- |
| Tree id | `shared_west_lands` (focus ids `zin_shared_west_lands_<key>`) |
| Tier | C (shared) |
| Countries (14) | Werlendor, Hky, Thenon, Argo, Lothoro, Saopon, Sobre, Canako, Oslinod, Pernogon, Forbo, Sarudon, Toples, Trilino |
| Focuses | 65 (a single country sees 35 to 50, by its branches and the West's route) |
| Grid | x 0–29, y 0–10 |
| Events | namespace `zin_shared_west_lands` |
| Spirits | `zin_shared_west_lands_<key>` |

All fourteen are freeholds of men (`zin_wild_freeholds`) at the start, with grudge 40, the start spirit `zin_west_old_claims` and opinion "Old Claims Remembered" (−15) toward Aenor.

## Lore basis

- **Established:** two dozen kingdoms crowd the West Lands (working figure); every western court remembers Aenor's First Age conquests and claims; western banners fought at Dardan under their own commanders; the stranger was taken south by western travellers and made peace between rivals; western fleets crossed the sea, took Parim and later evacuated; some soldiers were stranded and joined Eindil's coalition without their kingdoms becoming his subjects.
- **Proposed (vault and specs):** the Truce of the Grey Ford (4A 1745); the Bridge of the Three Oaths; Aenoran tariffs and subsidies; grudge, unity, fleet, the Ford Council and the routes ([western crossing](../../04_mechanics/western_crossing.md)).
- **Proposed (this spec):** every focus, spirit, event and number; the freehold league pacts; the councils' league.
- **Kept open:** who led the Crossing; who claimed the throne of men; which rulers made the stranger war-king; the stranded after the war ("in this telling"). Before `zin_eindil_awake` no visible focus mentions the stranger; before `zin_afrit_revealed` no text names Afrit.

## Design

### Branches

| Branch | Columns | Rows | Opens (`allow_branch` on the root) | Drives |
| --- | --- | --- | --- | --- |
| R. The Freehold Hall | 0–2 | 0–3 | every country | Court |
| E. Horses, Grain and Timber | 3–5 | 0–4 | every country | Economy |
| W. The Freehold Levy | 6–8 | 0–3 | people `men` | Army |
| G. The Old Grudge | 9–15 | 0–4 | every country | Grudge; Parim's coin; the Ford Council |
| T. Between the Banks | 16–18 | 0–2 | borders Gunwaith or Girdon | The truce on the doorstep |
| H. The Houses of the First Light | 19 | 0 | every country | Afrit's footholds (public face) |
| C. The Western Shore | 20–22 | 0–3 | owns a coastal state | Navy; ships for the council |
| S. The King Without a House | 24–26 | 0–2 | `zin_eindil_awake` | Regard and renown |
| X. The Crossing | 9–12 | 6–10 | `zin_west_route_crossing` | Pledge, landing, stranded, coalition |
| D. Our Own Shore | 15–17 | 6–8 | `zin_west_route_divided` | Safety from the bigger crowns |
| K. The Western Relief | 19–21 | 6–8 | `zin_west_route_relief` | Sail as friends |
| O. Under a Greater Banner | 23–25 | 6–8 | `is_subject` | Life as a subject |
| L. The Town Council | 27–29 | 6–8 | ideology `light` | Council towns |

`allow_branch` conditions (compiled on each branch root):

| Branch | Condition |
| --- | --- |
| W | `check zin_people_is_common_folk` |
| T | `check zin_shared_west_lands_by_the_ford` |
| C | `check zin_shared_west_lands_is_coastal` |
| S | `global_flag zin_eindil_awake` |
| X | `global_flag zin_west_route_crossing` |
| D | `global_flag zin_west_route_divided` |
| K | `global_flag zin_west_route_relief` |
| O | `is_subject` |
| L | `ideology light` |

### The peaceful start

No focus in this tree creates a war goal or declares a war. A freehold goes to war only through the mechanic (the Call to Cross, the Relief) or through the diplomacy spec's causes. Everything open on 1 Thaw 4A 1748 is court, trade, levies and envoys.

### Notation

Effects use the compiler vocabulary. **grudge ±n self** is `call zin_west_add_grudge (n)` on ROOT; **unity ±n**, **fleet ±n** call `zin_west_add_unity`, `zin_west_add_fleet`; **regard**, **renown** call `zin_eindil_add_regard` (ROOT) and `zin_eindil_add_renown`; **LC +n** is `flag zin_lost_cause_member` plus `call zin_lost_cause_add_strength (n)`; **join coalition** is `call zin_eindil_join_coalition`. "hist" is the AI factor while `zin_west_historical` is true. Days are 35 unless shown.

### R. The Freehold Hall (every country)

Icons: `council_table`, `charter_free`, `banner_plain`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_freehold_hall` | The Freehold Hall of [ROOT.GetName] | — | — | 1,0 | 35 | political_power 50 | 100 |
| `the_lords_moot` | The Lords' Moot | the_freehold_hall | — | 0,1 | 35 | stability 0.03 | 20 |
| `freehold_law` | Freehold Law | the_freehold_hall | — | 2,1 | 35 | add_spirit freehold_law | 15 |
| `old_banners` | Old Banners | the_lords_moot or freehold_law | — | 1,2 | 35 | war_support 0.02; political_power 25; tooltip "[ROOT.GetAdjective] banners flew under their own commanders in the First Age." | 15 |
| `one_freehold` | One Freehold | old_banners | — | 1,3 | 70 | political_power 75; stability 0.05 | 15 |

### E. Horses, Grain and Timber (every country)

Icons: `horse_cavalry`, `granary`, `timber_mill`, `roads_paved`, `market_stalls`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `horses_and_grain` | Horses and Grain | — | — | 4,0 | 35 | building industrial_complex 1 capital | 25 |
| `the_horse_fair` | The Horse Fair | horses_and_grain | — | 3,1 | 35 | add_spirit horse_fair | 12 |
| `timber_and_tar` | Timber and Tar | horses_and_grain | — | 5,1 | 35 | building infrastructure 1 random_owned; political_power 25 | 10 |
| `the_mill` | The Mill on the River | the_horse_fair or timber_and_tar | — | 4,2 | 35 | building industrial_complex 1 random_owned | 10 |
| `market_roads` | Market Roads | the_mill | — | 4,3 | 35 | building infrastructure 1 random_owned; political_power 25 | 10 |
| `the_freehold_stores` | The Freehold Stores | market_roads | — | 4,4 | 70 | stability 0.05; add_spirit freehold_stores | 8 |

### W. The Freehold Levy (people `men`)

Icons: `levy_muster`, `spear_levy`, `horse_cavalry`, `bow_archers`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_freehold_levy` | The Freehold Levy | — | — | 7,0 | 35 | manpower 2000; army_experience 5 | 15 |
| `hill_spears` | Hill Spears | the_freehold_levy | — | 6,1 | 35 | research [zin_cat_arms] 0.5 ×1 | 8 |
| `riders_of_the_freehold` | Riders of the Freehold | the_freehold_levy | — | 8,1 | 35 | research [zin_cat_mounts] 0.5 ×1 | 8 |
| `bowmen_of_the_hedges` | Bowmen of the Hedges | hill_spears or riders_of_the_freehold | — | 7,2 | 35 | research [zin_cat_bows] 0.5 ×1 | 8 |
| `the_muster_field` | The Muster Field | bowmen_of_the_hedges | — | 7,3 | 35 | manpower 3000; add_spirit muster_field | 8 |

### G. The Old Grudge (every country)

**Purpose:** what [ROOT.GetName] does with the West's old grievance: nurse it, take Parim's coin, or look to its own affairs. The choice moves `zin_west_grudge`, which sets the country's answer to the Call to Cross. **Mutual exclusions:** *Nurse the Grudge* / *Take Parim's Coin* / *Look to Our Own*.

Icons: `charter_old`, `coin_chest`, `banner_league`, `scroll_treaty`, `handshake_oath`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_old_grudge` | The Old Grudge | — | — | 12,0 | 35 | grudge +2 self; political_power 25 | 30 |
| `nurse_the_grudge` | Nurse the Grudge | the_old_grudge | take_parims_coin, look_to_our_own | 10,1 | 35 | grudge +10 self | 30; ×3 at grudge ≥ 50; hist ×2 at grudge ≥ 40 |
| `take_parims_coin` | Take Parim's Coin | the_old_grudge | nurse_the_grudge, look_to_our_own | 12,1 | 35 | grudge −10 self; event_for the Aenor realm that holds Parim: freehold_seeks_coin (zin_shared_west_lands.1) | 20; ×3 at grudge < 35; hist ×0 |
| `look_to_our_own` | Look to Our Own | the_old_grudge | nurse_the_grudge, take_parims_coin | 14,1 | 35 | add_spirit our_own_affairs | 30 |
| `songs_of_the_conquest` | Songs of the Conquest | nurse_the_grudge | — | 10,2 | 35 | war_support 0.03; unity +1 | 15 |
| `the_grudge_spoken` | The Grudge Spoken Aloud | songs_of_the_conquest | — | 10,3 | 35 | grudge +3 self; war_support 0.02 | 15 |
| `a_western_factor` | Parim's Factor in Our Market | take_parims_coin | — | 12,2 | 35 | political_power 50; tooltip "Parim's factor keeps an office in our market town." | 15 |
| `the_coin_and_the_grudge` | The Coin and the Grudge | a_western_factor | — | 12,3 | 35 | grudge −5 self; stability 0.03 | 15 |
| `the_freehold_first` | The Freehold First | look_to_our_own | — | 14,2 | 35 | political_power 50 | 15 |
| `neighbours_first` | Neighbours First | the_freehold_first | — | 14,3 | 35 | call zin_shared_west_lands_neighbour_pacts | 20 |
| `a_delegate_to_the_ford` | A Delegate to the Ford Council | the_grudge_spoken or the_coin_and_the_grudge or neighbours_first | — | 12,4 | 35 | available: global_flag zin_west_council; unity +2; political_power 25 | 50 |

### T. Between the Banks (borders Gunwaith or Girdon)

Icons: `grey_ford`, `bridge_oaths`, `granary`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `between_the_banks` | Between the Banks | — | — | 17,0 | 35 | political_power 25; tooltip "The Grey Ford is a day's ride away. Its truce is our peace too." | 20 |
| `neither_bank` | Neither Bank | between_the_banks | — | 16,1 | 35 | stability 0.03; add_spirit neither_bank | 15 |
| `the_bridge_watch` | The Bridge Watch | between_the_banks | — | 18,1 | 35 | available: check zin_shared_west_lands_holds_three_oaths; building infrastructure 1 random_owned; political_power 25; tooltip "Two lordships quarrel at the bridge every bad harvest." | 15 |
| `grain_for_the_feud` | Grain for the Feud | neither_bank or the_bridge_watch | — | 17,2 | 35 | available: global_flag zin_west_grey_ford_war; political_power 50; tooltip "Both banks pay well for grain." | 30 |

### H. The Houses of the First Light (every country)

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `a_house_of_healing` | A House of Healing | — | — | 19,0 | 35 | available: no flag zin_afrit_houses_purged; not global_flag zin_afrit_revealed; call zin_afrit_add_footholds (1) (clamped by the Afrit spec's caps); stability 0.03; tooltip "The Houses of the First Light offer a hospital and a grain store." | 15 |

Icon: `house_first_light`.

### C. The Western Shore (owns a coastal state)

Icons: `harbour_lake`, `fishing_boats`, `shipwright_yard`, `fort_wall`, `ship_voyage`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_western_shore` | The Western Shore | — | — | 21,0 | 35 | building naval_base 1 random_coastal | 20 |
| `fishing_villages` | Fishing Villages | the_western_shore | — | 20,1 | 35 | political_power 25; add_spirit fishing_villages | 12 |
| `the_harbour` | The Harbour of [ROOT.GetName] | the_western_shore | — | 22,1 | 35 | building dockyard 1 random_coastal | 10 |
| `ships_for_the_council` | Ships for the Council | fishing_villages or the_harbour | — | 21,2 | 35 | available: global_flag zin_west_council; fleet +2; political_power 25 | 15 |
| `the_shore_watch` | The Shore Watch | the_harbour | — | 22,2 | 35 | building coastal_bunker 1 random_coastal | 8 |
| `the_long_voyage` | Ready for the Long Voyage | ships_for_the_council | — | 21,3 | 35 | available: global_flag zin_west_route_crossing or global_flag zin_west_route_relief; fleet +2; navy_experience 5 | 30 |

### S. The King Without a House (`zin_eindil_awake`)

Hidden until a man has been found alive in the ice. The journey's own events decide where he walks; these focuses only let [ROOT.GetName] remember him.

Icons: `traders_road`, `banner_laid_down`, `scroll_sealed`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_man_on_the_road_south` | The Man on the Road South | — | — | 25,0 | 35 | renown +1; political_power 25 | 20 |
| `songs_on_the_road` | Songs on the Road | the_man_on_the_road_south | — | 24,1 | 35 | regard +5 | 15 |
| `the_war_kings_peace_kept` | The War-King's Peace Kept | the_man_on_the_road_south | — | 26,1 | 35 | available: global_flag zin_eindil_war_king; unity +2; regard +5 | 30 |
| `heed_the_warning_from_the_east` | Heed the Warning | songs_on_the_road or the_war_kings_peace_kept | — | 25,2 | 35 | available: global_flag zin_eindil_named; flag zin_eindil_heeded; grudge −10 self; regard +10 | 20; hist ×0 |

### X. The Crossing (`zin_west_route_crossing`)

**Purpose:** the historical route for a small court: answer the Call to Cross with men or ships, go ashore beyond the sea, and live with what follows. Every focus waits for the mechanic's flags; none sets them.

Icons: `banner_league`, `levy_muster`, `ship_voyage`, `banner_laid_down`, `lone_sword`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_call_to_cross_heard` | The Call to Cross | — | — | 11,6 | 35 | political_power 25 | 100 |
| `pledge_the_freehold` | Pledge the Freehold | the_call_to_cross_heard | — | 10,7 | 35 | available: flag zin_west_pledged; manpower 2000; war_support 0.05 | 100 |
| `ships_not_men` | Ships, Not Men | the_call_to_cross_heard | — | 12,7 | 35 | available: flag zin_west_ships_only; fleet +2; political_power 25 | 100 |
| `ashore_beyond_the_sea` | Ashore Beyond the Sea | pledge_the_freehold | — | 10,8 | 35 | available: global_flag zin_western_crossing; timed_spirit ashore 180 | 100 |
| `those_who_stayed` | Those Who Stayed | ashore_beyond_the_sea | — | 9,9 | 35 | available: flag zin_west_stranded; stability 0.03 | 60 |
| `beside_old_foes` | Beside Old Foes | ashore_beyond_the_sea | — | 11,9 | 35 | available: flag zin_west_stranded; global_flag zin_eindil_returned; join coalition | 300 |
| `the_road_home` | The Road Home | those_who_stayed or beside_old_foes or ships_not_men | — | 11,10 | 35 | available: global_flag zin_afrit_dead or global_flag zin_eindil_crowned; stability 0.05; political_power 50; tooltip "In this telling, some came home and some did not." | 60 |

### D. Our Own Shore (`zin_west_route_divided`)

**Purpose:** when the West keeps its own shore, the bigger crowns may look at their small neighbours (Gunwaith's *First Crown of the West*). These focuses help a small court stand together with others.

Icons: `fort_wall`, `alliance_rings`, `handshake_oath`, `olive_branch`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `our_own_shore_kept` | Our Own Shore | — | — | 16,6 | 35 | stability 0.05 | 50 |
| `the_small_crowns_stand_together` | The Small Crowns Stand Together | our_own_shore_kept | — | 15,7 | 35 | call zin_shared_west_lands_neighbour_pacts | 30 |
| `seek_a_guarantee` | Seek a Guarantee | our_own_shore_kept | — | 17,7 | 35 | call zin_shared_west_lands_seek_guarantee (event guarantee_request, zin_shared_west_lands.2) | 30; ×3 if Gunwaith holds claims on ROOT |
| `the_western_peace_kept` | The Western Peace Kept | the_small_crowns_stand_together or seek_a_guarantee | — | 16,8 | 35 | stability 0.05; political_power 50 | 30 |

### K. The Western Relief (`zin_west_route_relief`)

Icons: `scroll_sealed`, `banner_league`, `ship_voyage`, `sword_shield`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `letters_of_the_relief` | Letters of the Relief | — | — | 20,6 | 35 | political_power 25 | 100 |
| `answer_the_lost_cause` | Answer the Lost Cause | letters_of_the_relief | — | 19,7 | 35 | LC +2; regard +5 | 50 |
| `sail_as_friends` | Sail as Friends | letters_of_the_relief | — | 21,7 | 35 | available: global_flag zin_war_of_last_crowns; fleet +2; army_experience 5 | 50 |
| `shields_beside_the_concord` | Shields Beside the Concord | answer_the_lost_cause or sail_as_friends | — | 20,8 | 35 | add_spirit shields_beside_the_concord | 50 |

### O. Under a Greater Banner (subjects)

Icons: `tribute_chest`, `seal_wax`, `charter_old`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `under_a_greater_banner` | Under a Greater Banner | — | — | 24,6 | 35 | stability 0.05; political_power 25 | 50 |
| `tribute_and_levies` | Tribute and Levies | under_a_greater_banner | — | 23,7 | 35 | call zin_shared_west_lands_pay_tribute (overlord +25 political power); manpower 1000 | 20 |
| `a_voice_in_the_hall` | A Voice in the Hall | under_a_greater_banner | — | 25,7 | 35 | political_power 50; call zin_shared_west_lands_seek_voice (autonomy score +10 toward independence) | 15 |
| `the_charter_of_freedom` | The Charter of Freedom | tribute_and_levies or a_voice_in_the_hall | — | 24,8 | 35 | add_spirit freedom_charter | 15 |

### L. The Town Council (ideology `light`)

No freehold starts here; a freehold whose government turns Light gains it. Icons: `guild_hall`, `charter_free`, `olive_branch`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_town_council` | The Town Council of [ROOT.GetName] | — | — | 28,6 | 35 | stability 0.03; political_power 25 | 30 |
| `council_charters` | Council Charters | the_town_council | — | 27,7 | 35 | add_spirit council_charters | 15 |
| `the_open_assembly` | The Open Assembly | the_town_council | — | 29,7 | 35 | stability 0.05 | 15 |
| `a_league_of_councils` | A League of Councils | council_charters or the_open_assembly | — | 28,8 | 35 | available: check zin_shared_west_lands_has_light_partner; call zin_shared_west_lands_offer_council_league (event council_league_offer, zin_shared_west_lands.3) | 20 |

### Count

| Branch | Focuses |
| --- | ---: |
| R. The Freehold Hall | 5 |
| E. Horses, Grain and Timber | 6 |
| W. The Freehold Levy | 5 |
| G. The Old Grudge | 11 |
| T. Between the Banks | 4 |
| H. The Houses of the First Light | 1 |
| C. The Western Shore | 6 |
| S. The King Without a House | 4 |
| X. The Crossing | 7 |
| D. Our Own Shore | 4 |
| K. The Western Relief | 4 |
| O. Under a Greater Banner | 4 |
| L. The Town Council | 4 |
| **Total** | **65** |

A coastal freehold on the historical path sees R, E, W, G, H, C, S and X: 45 focuses (49 if it borders the ford).

### Spirits

Keys compile to `zin_shared_west_lands_<key>`.

| Key | Name | Modifiers | Added by |
| --- | --- | --- | --- |
| `freehold_law` | Freehold Law | `drift_defence_factor` 0.10, `stability_factor` 0.02 | *Freehold Law* |
| `horse_fair` | The Horse Fair | `supply_consumption_factor` −0.03 | *The Horse Fair* |
| `freehold_stores` | The Freehold Stores | `consumer_goods_factor` −0.02 | *The Freehold Stores* |
| `muster_field` | The Muster Field | `army_morale_factor` 0.05 | *The Muster Field* |
| `our_own_affairs` | Our Own Affairs | `stability_factor` 0.03, `political_power_gain` 0.05 | *Look to Our Own* |
| `neither_bank` | Neither Bank | `drift_defence_factor` 0.10 | *Neither Bank* |
| `fishing_villages` | [ROOT.GetAdjective] Fishing Villages | `consumer_goods_factor` −0.02 | *Fishing Villages* |
| `ashore` | Ashore Beyond the Sea | `army_org_factor` 0.05, `supply_consumption_factor` −0.05 | *Ashore Beyond the Sea*, 180 days |
| `shields_beside_the_concord` | Shields Beside the Concord | `army_defence_factor` 0.05, `army_morale_factor` 0.05 | *Shields Beside the Concord* |
| `freedom_charter` | The Charter of Freedom | `stability_factor` 0.03, `political_power_gain` 0.05 | *The Charter of Freedom* |
| `council_charters` | Council Charters | `political_power_gain` 0.05, `trade_opinion_factor` 0.10 | *Council Charters* |

### Events (namespace `zin_shared_west_lands`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `freehold_seeks_coin` | A Western Freehold Asks for Parim's Coin | Aenor realm | *Take Parim's Coin* | **Pay** (AI 50; 70 under Aurevan; ×0 below 50 political power): the realm −25 political power; FROM gets the mechanic's `zin_west_aenoran_gold` for 180 days; FROM grudge −5. **Refuse**: FROM grudge +5 |
| 2 | `guarantee_request` | A Small Crown Asks for Protection | the largest West Lands country other than Gunwaith not at war with FROM | *Seek a Guarantee* | **Stand behind them** (AI 50; ×2 if Gunwaith holds claims on FROM; ×0 at war): `give_guarantee` FROM. **Not our quarrel**: nothing |
| 3 | `council_league_offer` | A League of Councils | the largest other Light West Lands country | *A League of Councils* | **Sign** (AI 60): non-aggression pact; opinion modifier `zin_shared_west_lands_council_league` (+15) both ways. **Decline**: nothing |

## Implementation

- Data: `docs/design/focus/shared_west_lands.json` with `"tier": "shared"` and the fourteen countries.
- Compiled to `common/national_focus/zin_shared_west_lands.txt`, `common/ideas/zin_focus_shared_west_lands.txt`, `events/zin_shared_west_lands.txt`, `common/scripted_effects/zin_shared_west_lands.txt`, `common/scripted_triggers/zin_shared_west_lands.txt`, `common/opinion_modifiers/zin_shared_west_lands.txt`, `localisation/english/zin_focus_shared_west_lands_l_english.yml`.
- No `raw` blocks.

### Tree-declared scripted effects

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_shared_west_lands_neighbour_pacts` | country | `diplomatic_relation = { relation = non_aggression_pact active = yes }` with up to two neighbouring West Lands countries not at war with ROOT and not Gunwaith, smallest first |
| `zin_shared_west_lands_seek_guarantee` | country | Fires `zin_shared_west_lands.2` to the target named in the events table |
| `zin_shared_west_lands_offer_council_league` | country | Fires `zin_shared_west_lands.3` |
| `zin_shared_west_lands_pay_tribute` | country | `OVERLORD = { add_political_power = 25 }` |
| `zin_shared_west_lands_seek_voice` | country | `add_autonomy_score` +10 for ROOT (engine effect, overlord scope) |

### Tree-declared scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_shared_west_lands_is_coastal` | country | `any_owned_state = { is_coastal = yes }` |
| `zin_shared_west_lands_by_the_ford` | country | `is_neighbor_of` Gunwaith or Girdon |
| `zin_shared_west_lands_holds_three_oaths` | country | owns the state with `zin_is_site_three_oaths` |
| `zin_shared_west_lands_has_light_partner` | country | another West Lands country with a Light government exists, not at war with ROOT |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_shared_west_lands_council_league` | +15 | Both ways after the league of councils |

### Calls and reads

Western Crossing: `zin_west_add_grudge`, `zin_west_add_unity`, `zin_west_add_fleet`, `zin_west_historical`; flags `zin_west_council`, `zin_west_grey_ford_war`, `zin_west_route_crossing`, `zin_west_route_divided`, `zin_west_route_relief`, `zin_west_pledged`, `zin_west_ships_only`, `zin_western_crossing`, `zin_west_stranded`; idea `zin_west_aenoran_gold`. Journey: `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_join_coalition`; flags `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_eindil_heeded`, `zin_eindil_returned`; site trigger `zin_is_site_three_oaths`. Afrit: `zin_afrit_add_footholds`, `zin_afrit_houses_purged`. Diplomacy: `zin_lost_cause_add_strength`. Peoples: `zin_people_is_common_folk`.

### `allow_branch` refresh

The route branches (X, D, K) and the stranger's branch (S) open on global flags set mid-game. `zin_west_set_route` and the journey effect that sets `zin_eindil_awake` call `mark_focus_tree_layout_dirty` for every West Lands country (dependency on both specs). Branches by ownership, overlord and ideology refresh in `on_startup` and after peace deals.

### Game rules and defines

None new.

## AI

- Roots first: *The Freehold Hall* 100. Route roots (X, D, K) have 100 so the AI follows the West's course as soon as it is set; *Beside Old Foes* 300.
- Grudge choice: the factors in branch G make each AI follow its grudge. Under the historical rule most freeholds (grudge 40) take *Nurse the Grudge*, so by the Call to Cross (after the +5 of Aurevan's crowning and the council's grievances) they stand at 55 or more and pledge, as the mechanic expects.
- *Take Parim's Coin* is never taken under the historical rule.
- *A House of Healing*: base 15; ×0 for a country with `zin_afrit_suspicious`.

## Acceptance

1. The compiler accepts `shared_west_lands.json`: 65 focuses, unique keys and positions, prerequisites above their focuses, exclusives symmetric, days multiples of 7, no `raw` blocks; each of the fourteen countries maps to this tree only.
2. The focus inspector reports no errors; the renderer produces a full review image and one per sample country (a coastal freehold by the ford; an inland freehold) with `allow_branch` applied.
3. On 1 Thaw 4A 1748: branches S, X, D and K are hidden; no focus can create a war goal or join a war; no text names Afrit.
4. When `zin_west_route_crossing` is set, branch X appears for all fourteen within one day (layout refreshed).
5. Historical observer run: at least ten of the fourteen take *Nurse the Grudge* by 1752; every freehold with `zin_west_pledged` takes *Pledge the Freehold*; every stranded freehold takes *Beside Old Foes* within 60 days of `zin_eindil_returned`.
6. Every modifier in the spirits table exists in the game's modifier documentation.

## Open questions

1. **The freeholds.** All fourteen are freeholds with no lore beyond their names. Should any of them be a council town, a company hall or a horse clan instead?
2. **Parim's coin.** Should small courts be able to ask Aenor for a subsidy themselves, or only receive one through Aenor's decision?
3. **Our own shore.** Is a league of small crowns against Gunwaith's hegemony a good counterweight on the divided route?
