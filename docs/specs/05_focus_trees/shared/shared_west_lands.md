# Shared West Lands tree

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6.

## Purpose

Fourteen freeholds of the West Lands share one tree, `shared_west_lands`. It makes a small western lordship play like one: a freehold hall and its moot, horses, grain and timber, the old grudge against Aenor and the coin Parim offers to soften it, the Truce of the Grey Ford on its doorstep, the stranger's road south, and the West's great question. Branches open by people, ideology, overlord, coast and region (`allow_branch`), and the late branches open by the course the West chose at the Ford Council: the Crossing, our own shore, or the Western Relief. Text names the country with `[ROOT.GetName]` and `[ROOT.GetAdjective]`.

The tree implements the small courts' side of [the Western Crossing mechanic](../../04_mechanics/western_crossing.md) and gives small hooks into [Eindil's journey](../../04_mechanics/eindil_journey.md) and [Afrit's Hidden Council](../../04_mechanics/afrit_hidden_council.md). Gunwaith has its major tree ([../major/gunwaith.md](../major/gunwaith.md)); the tier B courts are in [../regional/west_lands.md](../regional/west_lands.md).

| Item | Value |
| --- | --- |
| Tree id | `shared_west_lands` (focus ids `zin_shared_west_lands_<key>`) |
| Tier | C (shared) |
| Countries (14) | Werlendor, Hky, Thenon, Argo, Lothoro, Saopon, Sobre, Canako, Oslinod, Pernogon, Forbo, Sarudon, Toples, Trilino (exactly the tier C list in [01_tiers_and_coverage.md](../01_tiers_and_coverage.md)) |
| Focuses | 65 (the tier C size of 40 to 70 applies to the tree; one country sees 36 to 49, by its branches and the West's route) |
| Grid | x 0–29, y 0–10 |
| Events | namespace `zin_shared_west_lands` |
| Spirits | `zin_shared_west_lands_<key>` |

All fourteen are freeholds of men (`zin_wild_freeholds`) at the start, with grudge 40, the start spirit `zin_west_old_claims` and opinion `zin_opinion_old_claims` ("Old Claims Remembered", −15) toward Aenor (start situation and Western Crossing specs).

**In the game today** (commit ca01fa3; checked 19 October 2026): all fourteen exist with ZIN tags, the people `zin_people_men` and the stance `zin_wild_freeholds`; none is a subject; Werlendor has 7 states, four have one. Every one runs the interim "Long Peace" tree (`zin_long_peace_*`), which this tree replaces for them. The game still starts on 1936.1.1 until the calendar spec ([../../00_foundation/01_start_and_calendar.md](../../00_foundation/01_start_and_calendar.md)) lands; dates here are 4A engine dates (start `1748.3.1`).

## Lore basis

- **Established:** two dozen kingdoms crowd the West Lands (working figure); every western court remembers Aenor's First Age conquests and claims; western banners fought at Dardan under their own commanders; the stranger was taken south by western travellers and made peace between rivals; western fleets crossed the sea, took Parim and later evacuated; some soldiers were stranded and joined Eindil's coalition without their kingdoms becoming his subjects.
- **Proposed (vault and specs):** the Truce of the Grey Ford (4A 1745); the Bridge of the Three Oaths; Aenoran tariffs and subsidies; grudge, unity, fleet, the Ford Council and the routes ([western crossing](../../04_mechanics/western_crossing.md)).
- **Proposed (this spec):** every focus, spirit, event and number; the freehold pacts; the league of councils.
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
| S. The Man on the Road South | 24–26 | 0–2 | `zin_eindil_awake` | Regard and renown |
| X. The Crossing | 9–12 | 6–10 | `zin_west_route_crossing` | Pledge, landing, stranded, coalition |
| D. Our Own Shore | 15–17 | 6–8 | `zin_west_route_divided` | Safety from the bigger crowns |
| K. The Western Relief | 19–21 | 6–8 | `zin_west_route_relief` | Sail as friends |
| O. Under a Greater Banner | 23–25 | 6–8 | `is_subject` | Life as a subject |
| L. The Town Council | 27–29 | 6–8 | ideology `light` | Council towns |

`allow_branch` conditions (compiled on each branch root; the root's `available` repeats the same condition, so a stale layout never lets a wrong country take a branch). "West Lands country" means a country with the economy spec's startup flag `zin_region_west_lands`.

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

One non-root focus carries its own `allow_branch` (S9): `the_war_kings_peace_kept` (`global_flag zin_eindil_war_king`), so the war-king is not named before that flag.

### The peaceful start

No focus in this tree creates a war goal or declares a war. A freehold goes to war only through the mechanic (the Call to Cross, the Relief) or through the diplomacy spec's causes. Everything open on 1 Thaw 4A 1748 is court, trade, levies and envoys.

### Notation

Effects and conditions use the compiler vocabulary ([00_format_and_compiler.md](../00_format_and_compiler.md)) and the S9 extensions. Shorthand in the tables:

| Shorthand | Compiles to |
| --- | --- |
| **grudge ±n self** | `call zin_west_add_grudge` (`value` n) on ROOT |
| **grudge ±n FROM** | `for_country FROM` → `call zin_west_add_grudge` (`value` n) |
| **grudge ≥ n** | `variable zin_west_grudge above n−1` |
| **unity ±n**, **fleet ±n** | `call zin_west_add_unity` (`value` n), `call zin_west_add_fleet` (`value` n) |
| **regard ±n**, **renown ±n** | `call zin_eindil_add_regard` (`value` n; on ROOT), `call zin_eindil_add_renown` (`value` n) |
| **LC +n** | `flag zin_lost_cause_member` (honorary crown of the Lost Cause, decision S3) plus `call zin_lost_cause_add_strength` (`value` n) |
| **join coalition** | `call zin_eindil_join_coalition` (does nothing if ROOT is already in) |
| **hist** | AI factor while `check zin_west_historical` is true |
| **research [c] b ×u** | `research` (categories [c], bonus b, uses u); categories are the warfare spec's `zin_cat_*` |

Days are 35 unless shown. Every AI value is a base weight; "×f at …" entries are `ai` modifiers.

### R. The Freehold Hall (every country)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_freehold_hall` | The Freehold Hall of [ROOT.GetName] | `council_table` | — | — | 1,0 | 35 | political_power 50 | 100 |
| `the_lords_moot` | The Lords' Moot | `council_table` | the_freehold_hall | — | 0,1 | 35 | stability 0.03 | 20 |
| `freehold_law` | Freehold Law | `charter_free` | the_freehold_hall | — | 2,1 | 35 | add_spirit freehold_law_spirit | 15 |
| `old_banners` | Old Banners | `banner_plain` | the_lords_moot or freehold_law | — | 1,2 | 35 | war_support 0.02; political_power 25; tooltip "[ROOT.GetAdjective] banners flew under their own commanders in the First Age." | 15 |
| `one_freehold` | One Freehold | `charter_free` | old_banners | — | 1,3 | 70 | political_power 75; stability 0.05 | 15 |

### E. Horses, Grain and Timber (every country)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `horses_and_grain` | Horses and Grain | `farm_sowing` | — | — | 4,0 | 35 | building industrial_complex 1 capital | 25 |
| `the_horse_fair` | The Horse Fair | `horse_cavalry` | horses_and_grain | — | 3,1 | 35 | add_spirit horse_fair | 12 |
| `timber_and_tar` | Timber and Tar | `timber_mill` | horses_and_grain | — | 5,1 | 35 | building infrastructure 1 random_owned; political_power 25 | 10 |
| `the_mill` | The Mill on the River | `granary` | the_horse_fair or timber_and_tar | — | 4,2 | 35 | building industrial_complex 1 random_owned | 10 |
| `market_roads` | Market Roads | `roads_paved` | the_mill | — | 4,3 | 35 | building infrastructure 1 random_owned; political_power 25 | 10 |
| `the_freehold_stores` | The Freehold Stores | `market_stalls` | market_roads | — | 4,4 | 70 | stability 0.05; add_spirit freehold_stores | 8 |

Building keys are the engine keys the economy spec keeps and renames (`industrial_complex` Guild Workshops, `dockyard` Shipwrights).

### W. The Freehold Levy (people `men`)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_freehold_levy` | The Freehold Levy | `levy_muster` | — | — | 7,0 | 35 | available: check zin_people_is_common_folk; manpower 2000; army_experience 5 | 15 |
| `hill_spears` | Hill Spears | `spear_levy` | the_freehold_levy | — | 6,1 | 35 | research [zin_cat_arms] 0.5 ×1 | 8 |
| `riders_of_the_freehold` | Riders of the Freehold | `horse_cavalry` | the_freehold_levy | — | 8,1 | 35 | research [zin_cat_mounts] 0.5 ×1 | 8 |
| `bowmen_of_the_hedges` | Bowmen of the Hedges | `bow_archers` | hill_spears or riders_of_the_freehold | — | 7,2 | 35 | research [zin_cat_bows] 0.5 ×1 | 8 |
| `the_muster_field` | The Muster Field | `levy_muster` | bowmen_of_the_hedges | — | 7,3 | 35 | manpower 3000; add_spirit muster_field | 8 |

### G. The Old Grudge (every country)

**Purpose:** what [ROOT.GetName] does with the West's old grievance: nurse it, take Parim's coin, or look to its own affairs. The choice moves `zin_west_grudge`, which sets the country's answer to the Call to Cross. **Mutual exclusions:** *Nurse the Grudge* / *Take Parim's Coin* / *Look to Our Own*.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_old_grudge` | The Old Grudge | `charter_old` | — | — | 12,0 | 35 | grudge +2 self; political_power 25 | 30 |
| `nurse_the_grudge` | Nurse the Grudge | `charter_old` | the_old_grudge | take_parims_coin, look_to_our_own | 10,1 | 35 | grudge +10 self | 30; ×3 at grudge ≥ 50; hist ×2 at grudge ≥ 40 |
| `take_parims_coin` | Take Parim's Coin | `coin_chest` | the_old_grudge | nurse_the_grudge, look_to_our_own | 12,1 | 35 | grudge −10 self; call zin_shared_west_lands_ask_parim (event freehold_seeks_coin, `zin_shared_west_lands.1`, to the country that owns Parim) | 20; ×3 at grudge below 35; hist ×0 |
| `look_to_our_own` | Look to Our Own | `charter_free` | the_old_grudge | nurse_the_grudge, take_parims_coin | 14,1 | 35 | add_spirit our_own_affairs | 30 |
| `songs_of_the_conquest` | Songs of the Conquest | `banner_league` | nurse_the_grudge | — | 10,2 | 35 | war_support 0.03; unity +1 | 15 |
| `the_grudge_spoken` | The Grudge Spoken Aloud | `banner_league` | songs_of_the_conquest | — | 10,3 | 35 | grudge +3 self; war_support 0.02 | 15 |
| `a_western_factor` | Parim's Factor in Our Market | `coin_chest` | take_parims_coin | — | 12,2 | 35 | political_power 50; tooltip "Parim's factor keeps an office in our market town." | 15 |
| `the_coin_and_the_grudge` | The Coin and the Grudge | `scroll_treaty` | a_western_factor | — | 12,3 | 35 | grudge −5 self; stability 0.03 | 15 |
| `the_freehold_first` | The Freehold First | `charter_free` | look_to_our_own | — | 14,2 | 35 | political_power 50 | 15 |
| `neighbours_first` | Neighbours First | `handshake_oath` | the_freehold_first | — | 14,3 | 35 | call zin_shared_west_lands_neighbour_pacts | 20 |
| `a_delegate_to_the_ford` | A Delegate to the Ford Council | `grey_ford` | the_grudge_spoken or the_coin_and_the_grudge or neighbours_first | — | 12,4 | 35 | available: global_flag zin_west_council; unity +2; political_power 25 | 50 |

### T. Between the Banks (borders Gunwaith or Girdon)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `between_the_banks` | Between the Banks | `grey_ford` | — | — | 17,0 | 35 | available: check zin_shared_west_lands_by_the_ford; political_power 25; tooltip "The Grey Ford is a day's ride away. Its truce is our peace too." | 20 |
| `neither_bank` | Neither Bank | `river_ford` | between_the_banks | — | 16,1 | 35 | stability 0.03; add_spirit neither_bank_spirit | 15 |
| `the_bridge_watch` | The Bridge Watch | `bridge_oaths` | between_the_banks | — | 18,1 | 35 | available: check zin_shared_west_lands_holds_three_oaths; building infrastructure 1 random_owned; political_power 25; tooltip "Two lordships quarrel at the bridge every bad harvest." | 15 |
| `grain_for_the_feud` | Grain for the Feud | `granary` | neither_bank or the_bridge_watch | — | 17,2 | 35 | available: global_flag zin_west_grey_ford_war; political_power 50; tooltip "Both banks pay well for grain." | 30 |

### H. The Houses of the First Light (every country)

The Afrit spec starts these countries at footholds 1 with cap 3, so one House (footholds 2) is within the cap.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `a_house_of_healing` | A House of Healing | `house_first_light` | — | — | 19,0 | 35 | available: not flag zin_afrit_houses_purged; not global_flag zin_afrit_revealed; call zin_afrit_add_footholds (`value` 1; the Afrit spec clamps it to the cap and its tooltip shows only the public name "Houses of the First Light"); stability 0.03; tooltip "The Houses of the First Light offer a hospital and a grain store." | 15; ×0 with flag zin_afrit_suspicious |

### C. The Western Shore (owns a coastal state)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_western_shore` | The Western Shore | `harbour_lake` | — | — | 21,0 | 35 | available: check zin_shared_west_lands_is_coastal; building naval_base 1 random_coastal | 20 |
| `fishing_villages` | Fishing Villages | `fishing_boats` | the_western_shore | — | 20,1 | 35 | political_power 25; add_spirit fishing_villages_spirit | 12 |
| `the_harbour` | The Harbour of [ROOT.GetName] | `shipwright_yard` | the_western_shore | — | 22,1 | 35 | building dockyard 1 random_coastal | 10 |
| `ships_for_the_council` | Ships for the Council | `ship_voyage` | fishing_villages or the_harbour | — | 21,2 | 35 | available: global_flag zin_west_council; fleet +2; political_power 25 | 15 |
| `the_shore_watch` | The Shore Watch | `fort_wall` | the_harbour | — | 22,2 | 35 | building coastal_bunker 1 random_coastal | 8 |
| `the_long_voyage` | Ready for the Long Voyage | `ship_voyage` | ships_for_the_council | — | 21,3 | 35 | available: `or` [global_flag zin_west_route_crossing, global_flag zin_west_route_relief]; fleet +2; navy_experience 5 | 30 |

### S. The Man on the Road South (`zin_eindil_awake`)

Hidden until a man has been found alive in the ice. The journey's own events decide where he walks; these focuses only let [ROOT.GetName] remember him. Text calls him "the Man from the Ice" or "the stranger" until `zin_eindil_named` (decision D4) and names no one.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_man_on_the_road_south` | The Man on the Road South | `traders_road` | — | — | 25,0 | 35 | available: global_flag zin_eindil_awake; renown +1; political_power 25 | 20 |
| `songs_on_the_road` | Songs on the Road | `traders_road` | the_man_on_the_road_south | — | 24,1 | 35 | regard +5 | 15 |
| `the_war_kings_peace_kept` | The War-King's Peace Kept | `banner_laid_down` | the_man_on_the_road_south | — | 26,1 | 35 | allow_branch and available: global_flag zin_eindil_war_king; unity +2; regard +5 | 30 |
| `heed_the_warning_from_the_east` | Heed the Warning | `scroll_sealed` | songs_on_the_road or the_war_kings_peace_kept | — | 25,2 | 35 | available: global_flag zin_eindil_named; flag zin_eindil_heeded (the journey's flag; the mechanic reads it for grudge drift and the relief route); grudge −10 self; regard +10 | 20; hist ×0 |

The warning focus never says what the warning is; per decision D3, any text that quotes it says only that "the king in Parim is not what the temples say".

### X. The Crossing (`zin_west_route_crossing`)

**Purpose:** the historical route for a small court: answer the Call to Cross with men or ships, go ashore beyond the sea, and live with what follows. Every focus waits for the mechanic's flags; none sets them.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_call_to_cross_heard` | The Call to Cross | `banner_league` | — | — | 11,6 | 35 | available: global_flag zin_west_route_crossing; political_power 25 | 100 |
| `pledge_the_freehold` | Pledge the Freehold | `levy_muster` | the_call_to_cross_heard | — | 10,7 | 35 | available: flag zin_west_pledged; manpower 2000; war_support 0.05 | 100 |
| `ships_not_men` | Ships, Not Men | `ship_voyage` | the_call_to_cross_heard | — | 12,7 | 35 | available: flag zin_west_ships_only; fleet +2; political_power 25 | 100 |
| `ashore_beyond_the_sea` | Ashore Beyond the Sea | `sword_shield` | pledge_the_freehold | — | 10,8 | 35 | available: global_flag zin_western_crossing; timed_spirit ashore 180 days | 100 |
| `those_who_stayed` | Those Who Stayed | `banner_laid_down` | ashore_beyond_the_sea | — | 9,9 | 35 | available: flag zin_west_stranded; stability 0.03 | 60 |
| `beside_old_foes` | Beside Old Foes | `lone_sword` | ashore_beyond_the_sea | — | 11,9 | 35 | available: flag zin_west_stranded; global_flag zin_eindil_returned; join coalition | 300 |
| `the_road_home` | The Road Home | `roads_paved` | those_who_stayed or beside_old_foes or ships_not_men | — | 11,10 | 35 | available: `or` [global_flag zin_afrit_dead, global_flag zin_eindil_crowned]; stability 0.05; political_power 50; tooltip "In this telling, some came home and some did not." | 60 |

### D. Our Own Shore (`zin_west_route_divided`)

**Purpose:** when the West keeps its own shore, the bigger crowns may look at their small neighbours (Gunwaith's *First Crown of the West*). These focuses help a small court stand together with others. Proposed by this spec as the counterweight to that line; no faction is formed.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `our_own_shore_kept` | Our Own Shore | `fort_wall` | — | — | 16,6 | 35 | available: global_flag zin_west_route_divided; stability 0.05 | 50 |
| `the_small_crowns_stand_together` | The Small Crowns Stand Together | `alliance_rings` | our_own_shore_kept | — | 15,7 | 35 | call zin_shared_west_lands_neighbour_pacts | 30 |
| `seek_a_guarantee` | Seek a Guarantee | `handshake_oath` | our_own_shore_kept | — | 17,7 | 35 | call zin_shared_west_lands_seek_guarantee (event guarantee_request, `zin_shared_west_lands.2`) | 30; ×3 if check zin_shared_west_lands_claimed_by_gunwaith |
| `the_western_peace_kept` | The Western Peace Kept | `olive_branch` | the_small_crowns_stand_together or seek_a_guarantee | — | 16,8 | 35 | stability 0.05; political_power 50 | 30 |

### K. The Western Relief (`zin_west_route_relief`)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `letters_of_the_relief` | Letters of the Relief | `scroll_sealed` | — | — | 20,6 | 35 | available: global_flag zin_west_route_relief; political_power 25 | 100 |
| `answer_the_lost_cause` | Answer the Lost Cause | `banner_league` | letters_of_the_relief | — | 19,7 | 35 | LC +2; regard +5 | 50 |
| `sail_as_friends` | Sail as Friends | `ship_voyage` | letters_of_the_relief | — | 21,7 | 35 | available: global_flag zin_war_of_last_crowns; fleet +2; army_experience 5 | 50 |
| `shields_beside_the_concord` | Shields Beside the Concord | `sword_shield` | answer_the_lost_cause or sail_as_friends | — | 20,8 | 35 | add_spirit shields_beside_the_concord_spirit | 50 |

### O. Under a Greater Banner (subjects)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `under_a_greater_banner` | Under a Greater Banner | `seal_wax` | — | — | 24,6 | 35 | available: is_subject; stability 0.05; political_power 25 | 50 |
| `tribute_and_levies` | Tribute and Levies | `tribute_chest` | under_a_greater_banner | — | 23,7 | 35 | call zin_shared_west_lands_pay_tribute (overlord +25 political power); manpower 1000 | 20 |
| `a_voice_in_the_hall` | A Voice in the Hall | `envoy` | under_a_greater_banner | — | 25,7 | 35 | political_power 50; call zin_shared_west_lands_seek_voice (autonomy score +10) | 15 |
| `the_charter_of_freedom` | The Charter of Freedom | `charter_old` | tribute_and_levies or a_voice_in_the_hall | — | 24,8 | 35 | add_spirit freedom_charter | 15 |

### L. The Town Council (ideology `light`)

No freehold starts here; a freehold whose government turns Light gains it.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_town_council` | The Town Council of [ROOT.GetName] | `guild_hall` | — | — | 28,6 | 35 | available: ideology light; stability 0.03; political_power 25 | 30 |
| `council_charters` | Council Charters | `charter_free` | the_town_council | — | 27,7 | 35 | add_spirit council_charters_spirit | 15 |
| `the_open_assembly` | The Open Assembly | `council_table` | the_town_council | — | 29,7 | 35 | stability 0.05 | 15 |
| `a_league_of_councils` | A League of Councils | `olive_branch` | council_charters or the_open_assembly | — | 28,8 | 35 | available: check zin_shared_west_lands_has_light_partner; call zin_shared_west_lands_offer_council_league (event council_league_offer, `zin_shared_west_lands.3`) | 20 |

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
| S. The Man on the Road South | 4 |
| X. The Crossing | 7 |
| D. Our Own Shore | 4 |
| K. The Western Relief | 4 |
| O. Under a Greater Banner | 4 |
| L. The Town Council | 4 |
| **Total** | **65** |

What one country sees (the tier C size applies to the tree; these are the views the renderer checks):

| Sample | Branches | Focuses |
| --- | --- | ---: |
| Inland freehold, divided route | R, E, W, G, H, S, D | 36 |
| Inland freehold, historical (crossing) route | R, E, W, G, H, S, X | 39 |
| Coastal freehold, historical route | R, E, W, G, H, C, S, X | 45 |
| Coastal freehold by the ford, historical route | R, E, W, G, T, H, C, S, X | 49 |

### Spirits

Keys compile to `zin_shared_west_lands_<key>`. Icons are idea crops of the named catalog key. All are permanent except `ashore` (180 days). Every modifier is in the 1.19.3 modifier documentation (checked 19 October 2026).

| Key | Name | Icon | Modifiers | Added by |
| --- | --- | --- | --- | --- |
| `freehold_law_spirit` | Freehold Law | `charter_free` | `drift_defence_factor` 0.10, `stability_factor` 0.02 | *Freehold Law* |
| `horse_fair` | The Horse Fair | `horse_cavalry` | `supply_consumption_factor` −0.03 | *The Horse Fair* |
| `freehold_stores` | The Freehold Stores | `market_stalls` | `consumer_goods_factor` −0.02 | *The Freehold Stores* |
| `muster_field` | The Muster Field | `levy_muster` | `army_morale_factor` 0.05 | *The Muster Field* |
| `our_own_affairs` | Our Own Affairs | `charter_free` | `stability_factor` 0.03, `political_power_gain` 0.05 | *Look to Our Own* |
| `neither_bank_spirit` | Neither Bank | `river_ford` | `drift_defence_factor` 0.10 | *Neither Bank* |
| `fishing_villages_spirit` | [ROOT.GetAdjective] Fishing Villages | `fishing_boats` | `consumer_goods_factor` −0.02 | *Fishing Villages* |
| `ashore` | Ashore Beyond the Sea | `sword_shield` | `army_org_factor` 0.05, `supply_consumption_factor` −0.05 | *Ashore Beyond the Sea*, 180 days |
| `shields_beside_the_concord_spirit` | Shields Beside the Concord | `sword_shield` | `army_defence_factor` 0.05, `army_morale_factor` 0.05 | *Shields Beside the Concord* |
| `freedom_charter` | The Charter of Freedom | `charter_old` | `stability_factor` 0.03, `political_power_gain` 0.05 | *The Charter of Freedom* |
| `council_charters_spirit` | Council Charters | `charter_free` | `political_power_gain` 0.05, `trade_opinion_factor` 0.10 | *Council Charters* |

### Events (namespace `zin_shared_west_lands`)

Every event is effect-triggered (no `trigger` or `mean_time_to_happen`). Pictures are keys that exist in the game today (`tools/content/data/presentation-cells.json`); none is gated.

| Id | Key | Title | To | Picture | Fired by | Text (gist) | Options |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `freehold_seeks_coin` | A Western Freehold Asks for Parim's Coin | the owner of Parim | `generic_court` | *Take Parim's Coin* | [FROM.GetName] would forget old wrongs for a share of Parim's silver. | **Pay** (AI 50; ×1.4 with global_flag zin_aurevan_crowned; ×0 if check zin_shared_west_lands_short_of_pp): political_power −25; `for_country FROM`: timed_spirit `zin_west_aenoran_gold` 180 days (the mechanic's idea, full id); grudge −5 FROM. **Refuse** (AI 50): grudge +5 FROM |
| 2 | `guarantee_request` | A Small Crown Asks for Protection | the guarantor (see effects) | `generic_court` | *Seek a Guarantee* | [FROM.GetName] fears the bigger crowns and asks for a shield. | **Stand behind them** (AI 50; ×2 if check zin_shared_west_lands_from_claimed_by_gunwaith; ×0 if check zin_shared_west_lands_at_war_with_from): call zin_shared_west_lands_guarantee_from. **Not our quarrel** (AI 50): nothing |
| 3 | `council_league_offer` | A League of Councils | the partner (see effects) | `generic_peace` | *A League of Councils* | The council of [FROM.GetName] offers a league: no war between us, open markets. | **Sign** (AI 60): call zin_shared_west_lands_sign_council_league. **Decline** (AI 40): nothing |

Requested picture (art phase; the events use the existing key until it is generated): `west_freehold_hall` (ungated; a freehold's timber hall with horses in the yard) for events 1 and 2.

### Text rules

- Each focus `desc` is one to three plain sentences, written in the data file from the focus's name, effects and branch purpose, and names the country with `[ROOT.GetName]` or `[ROOT.GetAdjective]`.
- No text names Afrit (compiler check 6); Aenor's god-king is "King Aurevan" or "the Deliverer" where text needs him.
- No text visible before `zin_eindil_awake` mentions the stranger. Before `zin_eindil_named`, he is only "the Man from the Ice" or "the stranger" (decision D4); "war-king" appears only behind `zin_eindil_war_king`. No focus names Eindil.

## Implementation

- Builder: the focus compiler `tools/content/modules/focus_compiler.mjs` ([00_format_and_compiler.md](../00_format_and_compiler.md)) reads the data below and writes every file in the builder's one transaction through the shared rewrite engine (`tools/content/apply.mts`).
- Data: `docs/design/focus/shared_west_lands.json` with `"tier": "shared"` and the fourteen countries. Names resolve to tags through `tools/content/data/countries.json` at build time.
- Today these countries run the interim Long Peace tree (`zin_long_peace_*`, written by `tools/content/modules/vanilla_removal.mjs`); the compiled tree replaces it for the fourteen, and the coverage check fails if a country keeps both.
- Research categories (`zin_cat_arms`, `zin_cat_mounts`, `zin_cat_bows`) come from the warfare spec ([01_warfare.md](../../03_gameplay/01_warfare.md), phase 3, before this tree's phase 6); building keys are the engine keys the economy spec re-themes. The compiler fails if a category is missing.
- Compiled to `common/national_focus/zin_shared_west_lands.txt`, `common/ideas/zin_focus_shared_west_lands.txt`, `events/zin_shared_west_lands.txt`, `common/scripted_effects/zin_shared_west_lands.txt`, `common/scripted_triggers/zin_shared_west_lands.txt`, `common/opinion_modifiers/zin_shared_west_lands.txt` (from the data's `opinion_modifiers` block, the mechanism the other tree specs use), `localisation/english/zin_focus_shared_west_lands_l_english.yml` (UTF-8 with BOM).
- No `raw` blocks. Targets the compiler cannot name (the owner of Parim, the guarantor, the league partner) and event effects outside its vocabulary are the tree-declared effects and triggers below.

### Tree-declared scripted effects

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_shared_west_lands_neighbour_pacts` | country | Up to two times: of the neighbours with `zin_region_west_lands` that are not Gunwaith, not at war with ROOT and without a pact with ROOT, the one with the fewest `num_owned_states` (temp-variable comparison; ties go to the first in engine tag order) gets `diplomatic_relation = { country = ROOT relation = non_aggression_pact active = yes }` |
| `zin_shared_west_lands_ask_parim` | country | Fires `zin_shared_west_lands.1` to the owner of the state with `zin_is_site_parim` (`random_state` on that site, then `OWNER`); nothing if no country owns it |
| `zin_shared_west_lands_seek_guarantee` | country | Picks the guarantor: of the countries with `zin_region_west_lands`, not Gunwaith, not ROOT and not at war with ROOT, the one with the most `num_owned_states` (ties as above); fires `zin_shared_west_lands.2` to it |
| `zin_shared_west_lands_offer_council_league` | country | Picks the partner: of the countries passing `zin_shared_west_lands_light_partner_of_root`, the one with the most `num_owned_states`; fires `zin_shared_west_lands.3` to it |
| `zin_shared_west_lands_pay_tribute` | country | `OVERLORD = { add_political_power = 25 }` |
| `zin_shared_west_lands_seek_voice` | country (the subject) | `add_autonomy_score = { value = 10 localization = zin_shared_west_lands_voice_tt }` (engine effect; it runs in the subject's own scope, as vanilla does) |
| `zin_shared_west_lands_guarantee_from` | guarantor (FROM = asker) | `give_guarantee = FROM` |
| `zin_shared_west_lands_sign_council_league` | partner (FROM = proposer) | `diplomatic_relation = { country = FROM relation = non_aggression_pact active = yes }`; `add_opinion_modifier` `zin_shared_west_lands_council_league` both ways |

### Tree-declared scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_shared_west_lands_is_coastal` | country | `any_owned_state = { is_coastal = yes }` |
| `zin_shared_west_lands_by_the_ford` | country | `is_neighbor_of` Gunwaith or Girdon |
| `zin_shared_west_lands_holds_three_oaths` | country | `any_owned_state = { zin_is_site_three_oaths = yes }` |
| `zin_shared_west_lands_claimed_by_gunwaith` | country | Gunwaith exists and `any_owned_state = { is_claimed_by = Gunwaith }` |
| `zin_shared_west_lands_from_claimed_by_gunwaith` | country | `FROM = { zin_shared_west_lands_claimed_by_gunwaith = yes }` |
| `zin_shared_west_lands_at_war_with_from` | country | `has_war_with = FROM` |
| `zin_shared_west_lands_short_of_pp` | country | `NOT = { has_political_power > 49 }` |
| `zin_shared_west_lands_light_partner_of_root` | country (candidate) | `has_country_flag = zin_region_west_lands`, `has_government = democratic`, not ROOT, `NOT = { has_war_with = ROOT }` |
| `zin_shared_west_lands_has_light_partner` | country | `any_other_country = { zin_shared_west_lands_light_partner_of_root = yes }` |

### Opinion modifiers

| Key | Value | Decay | Notes |
| --- | ---: | --- | --- |
| `zin_shared_west_lands_council_league` | +15 | none | Both ways after the league of councils |

### Calls and reads

| Owner | Names |
| --- | --- |
| [Western Crossing](../../04_mechanics/western_crossing.md) | effects `zin_west_add_grudge`, `zin_west_add_unity`, `zin_west_add_fleet`; trigger `zin_west_historical`; variable `zin_west_grudge`; flags `zin_west_council`, `zin_west_grey_ford_war`, `zin_west_route_crossing`, `zin_west_route_divided`, `zin_west_route_relief`, `zin_west_pledged`, `zin_west_ships_only`, `zin_western_crossing`, `zin_west_stranded`; idea `zin_west_aenoran_gold`; start spirit `zin_west_old_claims` |
| [Eindil's journey](../../04_mechanics/eindil_journey.md) | effects `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_join_coalition`; flags `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_eindil_heeded`, `zin_eindil_returned`, `zin_eindil_crowned`; site trigger `zin_is_site_three_oaths` |
| [Afrit](../../04_mechanics/afrit_hidden_council.md) | effect `zin_afrit_add_footholds`; flags `zin_afrit_houses_purged`, `zin_afrit_suspicious`, `zin_afrit_revealed`, `zin_aurevan_crowned`, `zin_afrit_dead` |
| [Diplomacy](../../03_gameplay/03_diplomacy_and_factions.md) | effect `zin_lost_cause_add_strength` |
| [Peoples](../../00_foundation/03_peoples.md) | trigger `zin_people_is_common_folk` |
| [Economy](../../03_gameplay/02_economy.md) | region flag `zin_region_west_lands` |
| [Key sites](../../01_map/02_key_sites.md) | `zin_is_site_parim` |
| Contract | `zin_war_of_last_crowns` |

Engine effects named: `add_autonomy_score`, `give_guarantee`, `diplomatic_relation`, `add_opinion_modifier`, `add_political_power`, `random_state`, `set_temp_variable`, `country_event`, `mark_focus_tree_layout_dirty`. Engine triggers named: `is_coastal`, `any_owned_state`, `any_other_country`, `is_neighbor_of`, `is_claimed_by`, `has_government`, `has_war_with`, `has_political_power`, `has_country_flag`. All are in the 1.19.3 documentation (checked 19 October 2026).

### `allow_branch` refresh

The route branches (X, D, K) and the stranger's branch (S) open on global flags set mid-game. `zin_west_set_route` and the journey effects that set `zin_eindil_awake` and `zin_eindil_war_king` call `mark_focus_tree_layout_dirty` for every country with `zin_region_west_lands` (dependency on both specs). Branches by ownership, overlord and ideology refresh through the compiler's shared `common/on_actions/zin_focus_layout.txt` (`on_ruling_party_change`, `on_puppet`, `on_release_as_puppet`, `on_subject_free`, `on_annex`, `on_peaceconference_ended`; decision E4). Every root repeats its condition in `available`, so a stale layout never lets a wrong country take a branch.

### Game rules and defines

None new. The tree reads `zin_west_historical` (which reads `zin_rule_west_route` and `zin_rule_historical_path`).

## AI

- Roots first: *The Freehold Hall* 100. Route roots (X, D, K) have 100 so the AI follows the West's course as soon as it is set; *Beside Old Foes* 300.
- Grudge choice: the factors in branch G make each AI follow its grudge. Under the historical rule most freeholds (grudge 40) take *Nurse the Grudge*, so by the Call to Cross (after the +5 of Aurevan's crowning and the council's grievances) they stand at 55 or more and pledge, as the mechanic's historical threshold (45) expects.
- *Take Parim's Coin* is never taken under the historical rule.
- *A House of Healing*: base 15; ×0 for a country with `zin_afrit_suspicious`.

## Acceptance

1. The compiler accepts `shared_west_lands.json`: 65 focuses; unique keys and positions; every prerequisite above its focus; exclusives symmetric; days multiples of 7 between 7 and 140; every icon and event picture a catalog key present in the game; every modifier in the 1.19.3 modifier documentation; every `call` and `check` resolves; no `raw` blocks. The coverage check maps each of the fourteen countries to this tree only.
2. The focus inspector and script validator report no errors; the renderer produces a full review image and one per sample in the "What one country sees" table with `allow_branch` applied; the visible counts match that table.
3. On 1 Thaw 4A 1748: branches S, X, D and K are hidden; no focus can create a war goal or join a war; no text names Afrit; no visible text mentions the stranger.
4. When `zin_west_route_crossing` is set, branch X appears for all fourteen within one day (layout refreshed).
5. Historical observer run (Linux; one in-game year at the end of phase 6, then the full historical run): at least ten of the fourteen take *Nurse the Grudge* by 1752; every freehold with `zin_west_pledged` takes *Pledge the Freehold*; every stranded freehold takes *Beside Old Foes* within 60 days of `zin_eindil_returned`.
6. Scenario: a freehold completes *Take Parim's Coin* while Aenor owns Parim; Aenor receives event 1; on **Pay**, the freehold carries `zin_west_aenoran_gold` for 180 days and its grudge has fallen by 15 in all.
7. Scenario: a subject completes *A Voice in the Hall*; its autonomy score rises by 10.

## Open questions

None remains open inside this spec. The owner's questions proceed on the proposal shown; they are listed in [OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md) under "regions: cold, west, tritons" 6.

1. **The freeholds.** Should any of the fourteen be a council town, a company hall or a horse clan instead? Proposal: all stay freeholds of men, as the roster has them; branch L gives any freehold that turns Light a council town's path.
2. **Parim's coin.** Should small courts ask Aenor for a subsidy themselves? Proposal: yes, through *Take Parim's Coin* and event 1; Aenor's own decision stays as well.

Settled here (proposed design): the league of small crowns on the divided route (branch D) stays as the counterweight to Gunwaith's *First Crown of the West*, as bilateral pacts and a guarantee, never a faction.
