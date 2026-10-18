# Shared Cold Lands tree

**Status:** Draft. **Priority:** 6. **Phase:** 6.

## Purpose

Twenty-three clan realms and free towns of the Cold Lands share one tree, `shared_cold_lands`. It makes a small Cold Lands country play like one: a steading hall and its moot, furs and iron, the Long Winters, the pull between Fandanar and Isengard, the cold coast, and the old tales of the far north. Branches open by people, ideology, overlord, coast and region (`allow_branch`), so a coastal free town, a subject of Coldor, a clan of the far north-west and a steading near the silent castle each read a different tree. Text names the country with `[ROOT.GetName]` and `[ROOT.GetAdjective]`.

The tree implements the clan side of [the Cold Lands mechanic](../../04_mechanics/cold_lands.md) (lean, winters, the Accord's invitations) and gives small hooks into [Eindil's journey](../../04_mechanics/eindil_journey.md), [the Western Crossing](../../04_mechanics/western_crossing.md) and [Afrit's Hidden Council](../../04_mechanics/afrit_hidden_council.md). The tier B trees of the region are in [../regional/cold_lands.md](../regional/cold_lands.md).

| Item | Value |
| --- | --- |
| Tree id | `shared_cold_lands` (focus ids `zin_shared_cold_lands_<key>`) |
| Tier | C (shared) |
| Countries (23) | Worlond, Omar, Londor, Felkond, Orewele, Portogalor, Xison, Naepu, Poloto, Radeon, Wonderland, Celen, Neridor, Rion, Hendair, Hozoson, Holdon, Pertolor, Gaadon, Greenle, Agoron, Belor, Yeneldmore |
| Focuses | 64 (a single country sees 30 to 50, by its branches) |
| Grid | x 0–29, y 0–8 |
| Events | namespace `zin_shared_cold_lands` |
| Spirits | `zin_shared_cold_lands_<key>` |

All 23 are realms of men at the start. Holdon is a Free Council (Light) town realm; the other 22 are clan realms (`zin_wild_clans`).

## Lore basis

- **Established:** the Cold Lands are the largest and least known landmass; their tribes live there beside Coldor, Isengard, Horidor, the Yeti Lands and the Windwaith arm; Cold Lands tribes found Eindil alive in the ice, fed and sheltered him and entrusted him to western travellers; Horos keeps the Castle of Yeldenne in the Cold Lands; Aenoran voyages reached the Cold Lands in the First Age.
- **Proposed (vault):** the tribes, free towns and peoples live by trade, herding and hunting; Coldor's uniting of the interior in 4A 850 and Isengard's refusal.
- **Proposed (mechanics specs):** lean, the Long Winters, the Winter Moot, the Neck Road, the far north-west state list, the Mp'E approach states.
- **Proposed (this spec):** every focus, spirit and event, the coast league, the steading charters and every number.
- **Kept open:** which clan realm owns Eindil's ice (the map step records it); the castle's exact place; the nature of yeti and giants (the kin branch speaks only of "the kin of the high snows"). Before `zin_eindil_awake` no visible focus mentions a stranger; before `zin_afrit_revealed` no text names Afrit.

## Design

### Branches

| Branch | Columns | Rows | Opens (`allow_branch` on the root) | Drives |
| --- | --- | --- | --- | --- |
| R. The Steading Hall | 0–2 | 0–3 | every country | Court |
| E. Furs and Iron | 3–5 | 0–4 | every country | Economy; winter stores |
| W. The Clan Host | 6–8 | 0–3 | people `men` (`zin_people_is_common_folk`) | Army |
| L. Between the Two Halls | 9–15 | 0–4 | `zin_cold_is_clan_realm` | Lean; the Accord, the Iron Hall or the Free Steadings |
| H. The Houses of the First Light | 16 | 0 | every country | Afrit's footholds (public face) |
| C. The Cold Coast | 17–20 | 0–4 | owns a coastal state | Navy, trade, ships for the West, the black water |
| O. Under a Greater Crown | 21–23 | 0–3 | `is_subject` | Life as a subject |
| F. The Far Edge | 24–26 | 0–3 | owns a far north-west state | The far ice; the stranger (hidden until `zin_eindil_awake`) |
| Y. Near the Silent Castle | 27–29 | 0–2 | owns a Mp'E approach state or the Yeldenne landing | The castle in peace |
| K. Kin of the High Snows | 24–26 | 6–7 | minor people `yeti` or `giants` | Kin units |
| T. The Free Towns | 0–2 | 5–7 | ideology `light` | Council towns |
| N. The Neck Road | 3–5 | 6–7 | owns a Neck Road state | Trade with the West |
| X. Word from the South | 9–13 | 6–8 | every country; root needs a story flag | The final war |

`allow_branch` conditions (compiled on each branch root):

| Branch | Condition |
| --- | --- |
| W | `check zin_people_is_common_folk` |
| L | `check zin_cold_is_clan_realm` |
| C | `check zin_shared_cold_lands_is_coastal` |
| O | `is_subject` |
| F | `check zin_shared_cold_lands_owns_far_ice` |
| Y | `check zin_shared_cold_lands_near_the_castle` |
| K | `check zin_people_includes_yeti` or `check zin_people_includes_giants` (minor peoples; never true at the start unless the owner assigns them) |
| T | `ideology light` |
| N | `check zin_shared_cold_lands_on_the_neck` |

The hidden focus `the_man_from_the_ice` (branch F) also carries `allow_branch = global_flag zin_eindil_awake`.

### The peaceful start

No focus in this tree creates a war goal, starts a border war or declares a war. The only military help abroad (`beside_the_heir`) needs `zin_eindil_returned`. Lost Cause membership needs `zin_gathering_dark` ≥ 50 or `zin_eindil_named`.

### Notation

Effects use the compiler vocabulary. **lean ±n self** is `call zin_cold_add_lean (n)` on ROOT; **regard**, **renown** call `zin_eindil_add_regard` (ROOT) and `zin_eindil_add_renown`; **LC +n** is `flag zin_lost_cause_member` plus `call zin_lost_cause_add_strength (n)`; **aid host {m, e}** is `call zin_eindil_aid_host {manpower m, equipment e}`; **join coalition** is `call zin_eindil_join_coalition`; **friend** is `check zin_eindil_friend`. "hist" is the AI factor while `zin_cold_historical` is true. Research categories are the warfare spec's `zin_cat_*`. Days are 35 unless shown.

### R. The Steading Hall (every country)

Icons: `council_table`, `rune_stone`, `feast_table`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_steading_hall` | The Steading Hall of [ROOT.GetName] | — | — | 1,0 | 35 | political_power 50 | 100 |
| `the_elders_speak` | The Elders Speak | the_steading_hall | — | 0,1 | 35 | stability 0.03 | 20 |
| `hearth_law` | Hearth Law | the_steading_hall | — | 2,1 | 35 | political_power 25; add_spirit hearth_law | 15 |
| `the_clan_moot_sits` | The Clan Moot Sits | the_elders_speak or hearth_law | — | 1,2 | 35 | event clan_moot (zin_shared_cold_lands.1) | 15 |
| `one_hearth` | One Hearth for the [ROOT.GetAdjective] Clans | the_clan_moot_sits | — | 1,3 | 70 | political_power 75; stability 0.05 | 15 |

### E. Furs and Iron (every country)

Icons: `market_stalls`, `forge_anvil`, `roads_paved`, `granary`, `foundry_fire`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `furs_and_iron` | Furs and Iron | — | — | 4,0 | 35 | building industrial_complex 1 capital | 25 |
| `the_trading_post` | The Trading Post | furs_and_iron | — | 3,1 | 35 | political_power 25; add_spirit trading_post | 12 |
| `smithies` | The Smithies | furs_and_iron | — | 5,1 | 35 | building arms_factory 1 capital | 10 |
| `sledge_tracks` | Sledge Tracks | the_trading_post or smithies | — | 4,2 | 35 | building infrastructure 1 random_owned | 10 |
| `winter_stores` | Winter Stores | sledge_tracks | — | 4,3 | 35 | flag zin_cold_winter_stores; stability 0.03 | 20; hist ×2 |
| `fires_through_the_long_night` | Fires Through the Long Night | winter_stores | — | 4,4 | 70 | building industrial_complex 1 random_owned; add_spirit long_night | 8 |

### W. The Clan Host (people `men`)

Icons: `levy_muster`, `footprints_snow`, `bow_archers`, `war_drums`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_clan_host` | The Clan Host | — | — | 7,0 | 35 | army_experience 5; manpower 2000 | 15 |
| `snow_runners` | Snow-Runners | the_clan_host | — | 6,1 | 35 | add_spirit snow_runners_trained | 10 |
| `bowmen_of_the_snow` | Bowmen of the Snow | the_clan_host | — | 8,1 | 35 | research [zin_cat_bows] 0.5 ×1 | 8 |
| `hill_wardens` | Hill Wardens | snow_runners or bowmen_of_the_snow | — | 7,2 | 35 | research [zin_cat_arms] 0.5 ×1; army_experience 5 | 8 |
| `the_muster_horn` | The Muster Horn | hill_wardens | — | 7,3 | 35 | manpower 3000; add_spirit muster_horn | 8 |

### L. Between the Two Halls (clan realms)

**Purpose:** each clan realm chooses between the Winter Crown of Fandanar, the Iron Hall of Isengard and its own snow. The choice moves `zin_cold_lean` and opens the matching approach: a seat in the Northern Accord, Isengard's shield, or Fearno's Free Steadings. **Mutual exclusions:** *Friends of Fandanar* / *Guests of the Iron Hall* / *Our Own Snow*.

Icons: `two_crowns`, `banner_league`, `crown_iron`, `envoy`, `charter_free`, `market_stalls`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_two_halls` | Between the Two Halls | — | — | 12,0 | 35 | political_power 25; tooltip "Fandanar sends envoys. The Iron Hall sends gifts. [ROOT.GetName] must answer one day." | 30 |
| `friends_of_fandanar` | Friends of Fandanar | the_two_halls | guests_of_the_iron_hall, our_own_snow | 10,1 | 35 | lean +15 self | 30; ×3 at lean ≥ 20; ×0.2 at lean ≤ −20 |
| `guests_of_the_iron_hall` | Guests of the Iron Hall | the_two_halls | friends_of_fandanar, our_own_snow | 12,1 | 35 | lean −15 self | 30; ×3 at lean ≤ −20; ×0.2 at lean ≥ 20 |
| `our_own_snow` | Our Own Snow | the_two_halls | friends_of_fandanar, guests_of_the_iron_hall | 14,1 | 35 | add_spirit own_snow | 30; ×3 at lean between −19 and 19 |
| `envoys_to_fandanar` | Envoys to Fandanar | friends_of_fandanar | — | 10,2 | 35 | lean +10 self; political_power 25 | 15 |
| `a_place_in_the_accord` | A Place in the Accord | envoys_to_fandanar | — | 10,3 | 35 | available: variable zin_cold_lean above 49; not in a faction; exists Coldor; event_for Coldor accord_request (zin_shared_cold_lands.2) | 20 |
| `envoys_to_the_iron_hall` | Envoys to the Iron Hall | guests_of_the_iron_hall | — | 12,2 | 35 | lean −10 self; political_power 25 | 15 |
| `the_iron_halls_shield` | The Iron Hall's Shield | envoys_to_the_iron_hall | — | 12,3 | 35 | available: variable zin_cold_lean below −49; exists Isengard; event_for Isengard shield_request (zin_shared_cold_lands.3) | 20 |
| `markets_for_all_comers` | Markets for All Comers | our_own_snow | — | 14,2 | 35 | political_power 50; add_spirit open_markets | 15 |
| `the_steading_endures` | The Steading Endures | markets_for_all_comers | — | 14,3 | 35 | stability 0.05; call zin_shared_cold_lands_lean_toward_zero (10) | 15 |
| `answer_the_free_steadings` | Answer the Free Steadings | the_steading_endures | — | 14,4 | 35 | available: check zin_shared_cold_lands_free_steadings_exist; not in a faction; event_for Fearno steadings_join_request (zin_shared_cold_lands.4) | 20 |

On the historical path the AI picks by lean (the factors above): most clan realms start at lean 5 and take *Our Own Snow* or *Friends of Fandanar*; realms bordering Isengard (lean −20) take *Guests of the Iron Hall*. The joining focuses need leans that the historical path rarely reaches, so the factions stay small, as the mechanic intends.

### H. The Houses of the First Light (every country)

The Houses are the public face of the Deliverer's network: a hospital and a grain store that most people serve sincerely. The focus says only that.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `a_house_of_healing` | A House of Healing | — | — | 16,0 | 35 | available: no flag zin_afrit_houses_purged; not global_flag zin_afrit_revealed; call zin_afrit_add_footholds (1) (clamped by the Afrit spec's caps); stability 0.03; tooltip "The Houses of the First Light offer a hospital and a grain store." | 15 |

Icon: `house_first_light`.

### C. The Cold Coast (owns a coastal state)

Icons: `harbour_lake`, `fishing_boats`, `fort_wall`, `shipwright_yard`, `black_isles`, `lighthouse`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_cold_coast` | The Cold Coast | — | — | 18,0 | 35 | building naval_base 1 random_coastal | 20 |
| `fishing_fleets` | Fishing Fleets | the_cold_coast | — | 17,1 | 35 | political_power 25; add_spirit fishing_fleets | 12 |
| `the_harbour_wall` | The Harbour Wall | the_cold_coast | — | 19,1 | 35 | building coastal_bunker 1 random_coastal | 8 |
| `the_carrying_boats` | The Carrying Boats | fishing_fleets | — | 17,2 | 35 | building dockyard 1 random_coastal; navy_experience 5 | 10 |
| `ships_for_the_western_yards` | Ships for the Western Yards | the_harbour_wall | — | 19,2 | 35 | available: global_flag zin_west_council; call zin_west_add_fleet (2); political_power 25 | 10 |
| `fishermens_tales` | Fishermen's Tales | the_carrying_boats or ships_for_the_western_yards | — | 18,3 | 35 | flag zin_shared_cold_lands_heard_fishermen; navy_experience 5; tooltip "Black ships, the old men say. Nobody at court believes them." | 8 |
| `against_the_black_water` | Against the Black Water | fishermens_tales | — | 17,4 | 35 | available: global_flag zin_zol_rising; building coastal_bunker 1 random_coastal, twice; add_spirit black_water | 100 |
| `a_harbour_for_strangers` | A Harbour for Strangers | fishermens_tales | — | 19,4 | 35 | flag zin_eindil_safe_harbour; stability 0.02 | 10; hist ×0 |

`zin_eindil_safe_harbour` is a proposed journey hook: in stage 6 (ports of call), *Resupply the ship* gets AI weight ×2 under the dynamic rule. It does nothing under the historical rule, so the historical betrayal of one port still happens.

### O. Under a Greater Crown (subjects)

Icons: `tribute_chest`, `spear_levy`, `seal_wax`, `charter_old`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `under_a_greater_crown` | Under a Greater Crown | — | — | 22,0 | 35 | stability 0.05; political_power 25 | 50 |
| `tribute_of_furs` | Tribute of Furs | under_a_greater_crown | — | 21,1 | 35 | call zin_shared_cold_lands_pay_tribute (overlord +25 political power); stability 0.02 | 20 |
| `levies_for_the_overlord` | Levies for the Overlord | under_a_greater_crown | — | 23,1 | 35 | manpower 2000; army_experience 5 | 15 |
| `a_voice_at_court` | A Voice at Court | tribute_of_furs or levies_for_the_overlord | — | 22,2 | 35 | political_power 50; call zin_shared_cold_lands_seek_voice (autonomy score +10 toward independence) | 15 |
| `the_charter_of_the_steading` | The Charter of the Steading | a_voice_at_court | — | 22,3 | 35 | add_spirit steading_charter | 15 |

### F. The Far Edge (owns a far north-west state)

**Purpose:** the clans at the edge of the world. In 4A 1748 this is a branch of hunting, ice paths and old ice. Once a man has been found alive in the ice (`zin_eindil_awake`), its hidden focus lets the clan remember him well. The journey's own events (stage 1) decide how the ice host treats him; this branch never replaces them.

Icons: `ice_field`, `wild_hunt`, `footprints_snow`, `traders_road`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_far_edge` | The Far Edge of the World | — | — | 25,0 | 35 | political_power 25 | 15 |
| `hunters_of_the_old_ice` | Hunters of the Old Ice | the_far_edge | — | 24,1 | 35 | army_experience 5; add_spirit old_ice_hunters | 10 |
| `the_ice_paths` | The Ice Paths | the_far_edge | — | 26,1 | 35 | building infrastructure 1 random_owned | 10 |
| `the_man_from_the_ice` | The Man from the Ice | hunters_of_the_old_ice or the_ice_paths | — | 25,2 | 35 | allow_branch: global_flag zin_eindil_awake; renown +2; regard +5; political_power 25 | 30 |
| `songs_of_the_houseless_king` | Songs of the King Without a House | the_man_from_the_ice | — | 25,3 | 35 | available: global_flag zin_eindil_war_king; regard +5; war_support 0.02 | 15 |

### Y. Near the Silent Castle (owns a Mp'E approach state or the Yeldenne landing)

Icons: `castle_ice`, `handshake_oath`, `eye_watchful`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_silent_castle` | The Silent Castle | — | — | 28,0 | 35 | stability 0.02; tooltip "A castle stands in the frozen north. Its lord does not ride out, and its light does not fail." | 15 |
| `leave_the_castle_be` | Leave the Castle Be | the_silent_castle | — | 27,1 | 35 | available: exists Yeldenne; non_aggression Yeldenne; flag zin_shared_cold_lands_friends_of_the_hall | 20 |
| `watchers_on_the_snow` | Watchers on the Snow | the_silent_castle | — | 29,1 | 35 | add_spirit snow_watch | 10 |
| `the_light_is_gone` | The Light Is Gone | leave_the_castle_be or watchers_on_the_snow | — | 28,2 | 35 | available: global_flag zin_horos_dead; stability 0.03; political_power 25; tooltip "The green light in the north is gone. Nobody knows what the castle keeps now." | 30 |

`zin_shared_cold_lands_friends_of_the_hall` is a proposed hook for the journey spec: when this country owns `zin_is_site_yeldenne_landing`, the AI weight of *Send guides inland* in *Landfall in the Frozen North* is ×2 under the dynamic rule (never under the historical rule). It adds no guide flag of its own.

### K. Kin of the High Snows (minor people yeti or giants)

Icons: `yeti_claw`, `giant_hammer`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `kin_of_the_high_snows` | Kin of the High Snows | — | — | 25,6 | 35 | political_power 25; stability 0.02 | 20 |
| `hunting_bands` | Hunting Bands of the Kin | kin_of_the_high_snows | — | 24,7 | 35 | research [zin_cat_kin] 0.5 ×1 | 15 |
| `the_old_kin_muster` | The Old Kin Muster | kin_of_the_high_snows | — | 26,7 | 35 | army_experience 10 | 15 |

### T. The Free Towns (ideology `light`)

Holdon starts here. Icons: `guild_hall`, `charter_free`, `council_table`, `olive_branch`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_free_towns` | The Free Towns of [ROOT.GetName] | — | — | 1,5 | 35 | stability 0.03; political_power 25 | 30 |
| `charters_of_the_coast_towns` | Charters of the Towns | the_free_towns | — | 0,6 | 35 | add_spirit town_charters | 15 |
| `the_towns_council` | The Towns' Council | the_free_towns | — | 2,6 | 35 | stability 0.05 | 15 |
| `the_coast_league` | A League of Free Towns | charters_of_the_coast_towns or the_towns_council | — | 1,7 | 35 | available: check zin_shared_cold_lands_has_light_partner; call zin_shared_cold_lands_offer_coast_league (event coast_league_offer, zin_shared_cold_lands.5, to the largest other Light Cold Lands country not at war with ROOT) | 20 |

### N. The Neck Road (owns a Neck Road state)

Icons: `traders_road`, `toll_house`, `caravan`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_neck_steadings` | Steadings on the Neck | — | — | 4,6 | 35 | building infrastructure 1 random_owned | 20 |
| `toll_posts_on_the_neck` | Toll-Posts on the Neck | the_neck_steadings | — | 3,7 | 35 | available: global_flag zin_cold_neck_road; political_power 50; add_spirit neck_tolls | 20 |
| `traders_to_the_west` | Traders to the West | the_neck_steadings | — | 5,7 | 35 | political_power 25; add_spirit west_traders | 15 |

### X. Word from the South (every country)

**Purpose:** the clan's course when the War of the Last Crowns breaks out, the West crosses the sea or Zol's dead rise. **Mutual exclusion:** *Keep to the Snows* (historical) / *Send Spears South*. The vault says nothing of the clans in the final war; both courses are play.

Icons: `banner_plain`, `spear_levy`, `lone_sword`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `word_from_the_south` | Word from the South | — | — | 11,6 | 35 | available: global_flag zin_war_of_last_crowns or global_flag zin_western_crossing or global_flag zin_zol_rising; political_power 50 | 200 |
| `keep_to_the_snows` | Keep to the Snows | word_from_the_south | send_spears_south | 10,7 | 35 | add_spirit keep_to_the_snows | 40; hist ×100 |
| `send_spears_south` | Send Spears South | word_from_the_south | keep_to_the_snows | 12,7 | 35 | available: variable zin_gathering_dark above 49 or global_flag zin_eindil_named; LC +2 | 15 + regard; hist ×0 |
| `beside_the_heir` | Beside the Heir | send_spears_south | — | 12,8 | 35 | available: global_flag zin_eindil_returned; friend; aid host {500, zin_arms_equipment 200}; join coalition | 100 |

### Count

| Branch | Focuses |
| --- | ---: |
| R. The Steading Hall | 5 |
| E. Furs and Iron | 6 |
| W. The Clan Host | 5 |
| L. Between the Two Halls | 11 |
| H. The Houses of the First Light | 1 |
| C. The Cold Coast | 8 |
| O. Under a Greater Crown | 5 |
| F. The Far Edge | 5 |
| Y. Near the Silent Castle | 4 |
| K. Kin of the High Snows | 3 |
| T. The Free Towns | 4 |
| N. The Neck Road | 3 |
| X. Word from the South | 4 |
| **Total** | **64** |

A coastal clan realm of men with no other branch sees R, E, W, L, H, C and X: 40 focuses. Holdon (Light, coastal) sees R, E, W, H, C, T and X: 33 focuses (it is not a clan realm, so branch L is closed to it).

### Spirits

Keys compile to `zin_shared_cold_lands_<key>`. Names use `[ROOT.GetAdjective]` where shown.

| Key | Name | Modifiers | Added by |
| --- | --- | --- | --- |
| `hearth_law` | Hearth Law | `drift_defence_factor` 0.10, `stability_factor` 0.02 | *Hearth Law* |
| `trading_post` | The Trading Post | `consumer_goods_factor` −0.02 | *The Trading Post* |
| `long_night` | Fires Through the Long Night | `production_speed_buildings_factor` 0.05, `stability_factor` 0.02 | *Fires Through the Long Night* |
| `snow_runners_trained` | Snow-Runners | `winter_attrition_factor` −0.10 | *Snow-Runners* |
| `muster_horn` | The Muster Horn | `army_morale_factor` 0.05 | *The Muster Horn* |
| `own_snow` | Our Own Snow | `drift_defence_factor` 0.15, `stability_factor` 0.03 | *Our Own Snow* |
| `open_markets` | Markets for All Comers | `trade_opinion_factor` 0.10 | *Markets for All Comers* |
| `fishing_fleets` | [ROOT.GetAdjective] Fishing Fleets | `consumer_goods_factor` −0.02 | *Fishing Fleets* |
| `black_water` | Against the Black Water | `coastal_bunker_effectiveness_factor` 0.15 | *Against the Black Water* |
| `steading_charter` | The Charter of the Steading | `stability_factor` 0.03, `political_power_gain` 0.05 | *The Charter of the Steading* |
| `old_ice_hunters` | Hunters of the Old Ice | `winter_attrition_factor` −0.10, `army_speed_factor` 0.02 | *Hunters of the Old Ice* |
| `snow_watch` | Watchers on the Snow | `army_intel_factor` 0.10 | *Watchers on the Snow* |
| `town_charters` | Charters of the Towns | `political_power_gain` 0.05, `trade_opinion_factor` 0.10 | *Charters of the Towns* |
| `neck_tolls` | Toll-Posts on the Neck | `political_power_gain` 0.05 | *Toll-Posts on the Neck* |
| `west_traders` | Traders to the West | `trade_opinion_factor` 0.10 | *Traders to the West* |
| `keep_to_the_snows` | Keep to the Snows | `stability_factor` 0.05, `war_support_factor` −0.05 | *Keep to the Snows* |

All are permanent.

### Events (namespace `zin_shared_cold_lands`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `clan_moot` | The Clan Moot of [ROOT.GetName] | ROOT | *The Clan Moot Sits* | **The elders' way** (AI 60): stability 0.03. **The young chiefs' way**: army experience 5; war support 0.02 |
| 2 | `accord_request` | A Steading Asks for a Place in the Accord | Coldor | *A Place in the Accord* | **Welcome them** (AI 70; ×0 if Coldor is at war with FROM): Coldor `add_to_faction` FROM; opinion `zin_cold_accord_kin` both ways. **Not yet**: FROM lean −10 |
| 3 | `shield_request` | A Steading Seeks the Iron Hall's Shield | Isengard | *The Iron Hall's Shield* | **Stand behind them** (AI 70): Isengard `give_guarantee` FROM; Isengard defiance +2. **Not our quarrel**: FROM lean +5 |
| 4 | `steadings_join_request` | A Steading Asks to Join the Free Steadings | Fearno | *Answer the Free Steadings* | **Welcome them** (AI 80): Fearno `add_to_faction` FROM. **Not now**: nothing |
| 5 | `coast_league_offer` | A League of Free Towns | target Light country | *A League of Free Towns* | **Sign the league** (AI 60): non-aggression pact with FROM; opinion +15 both ways (opinion modifier `zin_shared_cold_lands_town_league`). **Decline**: nothing |

## Implementation

- Data: `docs/design/focus/shared_cold_lands.json` with `"tier": "shared"` and the 23 countries above.
- Compiled to `common/national_focus/zin_shared_cold_lands.txt`, `common/ideas/zin_focus_shared_cold_lands.txt`, `events/zin_shared_cold_lands.txt`, `common/scripted_effects/zin_shared_cold_lands.txt`, `common/scripted_triggers/zin_shared_cold_lands.txt`, `common/opinion_modifiers/zin_shared_cold_lands.txt`, `localisation/english/zin_focus_shared_cold_lands_l_english.yml`.
- No `raw` blocks.

### Tree-declared scripted effects

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_shared_cold_lands_lean_neighbours` (`value`) | country | `every_neighbor_country` with `zin_cold_is_clan_realm`: `zin_cold_add_lean = { value = $value$ }`. Also called by the regional Cold Lands trees |
| `zin_shared_cold_lands_lean_toward_zero` (`value`) | country | Moves ROOT's `zin_cold_lean` toward 0 by `value` (never past 0) through `zin_cold_add_lean` |
| `zin_shared_cold_lands_pay_tribute` | country | `OVERLORD = { add_political_power = 25 }` |
| `zin_shared_cold_lands_seek_voice` | country | `OVERLORD = { add_autonomy_score = { value = 10 localization = … } }` targeting ROOT (engine `add_autonomy_score`) |
| `zin_shared_cold_lands_offer_coast_league` | country | Fires `zin_shared_cold_lands.5` to the largest other Light Cold Lands country not at war with ROOT |

### Tree-declared scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_shared_cold_lands_is_coastal` | country | `any_owned_state = { is_coastal = yes }` |
| `zin_shared_cold_lands_owns_far_ice` | country | `any_owned_state = { zin_is_region_far_northwest = yes }` |
| `zin_shared_cold_lands_near_the_castle` | country | `any_owned_state` with `zin_is_region_mpe_approach` or `zin_is_site_yeldenne_landing` |
| `zin_shared_cold_lands_on_the_neck` | country | `any_owned_state = { zin_is_site_neck_road = yes }` |
| `zin_shared_cold_lands_free_steadings_exist` | any | Fearno exists, `is_faction_leader`, and has flag `zin_regional_fearno_steadings_path` |
| `zin_shared_cold_lands_has_light_partner` | country | another country with `zin_region_cold_lands` and Light government exists and is not at war with ROOT |

### Opinion modifiers

| Key | Value | Notes |
| --- | ---: | --- |
| `zin_shared_cold_lands_town_league` | +15 | Both ways after the league of free towns |

### Calls and reads

Cold Lands mechanic: `zin_cold_add_lean`, `zin_cold_is_clan_realm`, `zin_cold_historical`, flags `zin_cold_winter_stores`, `zin_cold_neck_road`, opinion `zin_cold_accord_kin`, site triggers `zin_is_region_far_northwest`, `zin_is_region_mpe_approach`, `zin_is_site_yeldenne_landing`, `zin_is_site_neck_road`. Western Crossing: `zin_west_add_fleet`, flag `zin_west_council`. Journey: `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_aid_host`, `zin_eindil_join_coalition`, `zin_eindil_friend`. Afrit: `zin_afrit_add_footholds`, flag `zin_afrit_houses_purged`. Diplomacy: `zin_lost_cause_add_strength`. Peoples: `zin_people_is_common_folk`, `zin_people_includes_yeti`, `zin_people_includes_giants`.

### `allow_branch` refresh

Branch roots that depend on states owned (C, F, Y, N), overlord (O), ideology (T) or people (K) are evaluated at game start and again when `mark_focus_tree_layout_dirty` runs. The content builder adds `mark_focus_tree_layout_dirty = yes` to this tree's countries in `on_startup`, and the effects that set `zin_eindil_awake` (journey) and annex or transfer Cold Lands states in peace deals call it for the affected countries.

### Game rules and defines

None new. The tree reads `zin_cold_historical`.

## AI

- Roots first: *The Steading Hall* 100, then economy and the two halls. War roots have 200 so the AI reacts when the world changes.
- Lean choice: the factors in branch L make each AI follow its lean. Under the free rule, the same factors apply.
- Coastal realms build a naval base and a dockyard; they sell ships to the West only while the Ford Council sits.
- *A House of Healing*: base 15; ×0 for a country with `zin_afrit_suspicious`.
- Historical route (typical clan realm): 1748 steading hall, furs and iron, the two halls; 1749–1751 hearth law, the lean choice, trading post, sledge tracks, winter stores; 1752–1754 the clan host and coast; 1755 word from the south, keep to the snows.

## Acceptance

1. The compiler accepts `shared_cold_lands.json`: 64 focuses, unique keys and positions, prerequisites above their focuses, exclusives symmetric, days multiples of 7, no `raw` blocks; every one of the 23 countries maps to this tree and to no other.
2. The HOI4 Agent Tools focus inspector reports no errors; the renderer produces one review image with all branches visible and one per sample country (a coastal clan realm, Holdon, a far north-west clan realm) with `allow_branch` applied.
3. On 1 Thaw 4A 1748: no focus can create a war goal or join a war; *The Man from the Ice* is hidden; no text names Afrit or mentions a sleeper in the ice.
4. Holdon does not see branch L; a non-coastal clan realm does not see branch C; only owners of far north-west states see branch F.
5. Historical observer run: by 1752 at least 15 of the 23 have taken their lean choice, matching the sign of their lean; none declares a war before `zin_war_of_last_crowns`; every surviving realm takes *Keep to the Snows* within 180 days of *Word from the South* opening.
6. Scenario: a clan realm at lean 55, not in a faction, completes *A Place in the Accord*; Coldor's AI accepts and the realm joins the Northern Accord; Coldor's reach rises on its next update.
7. Every modifier in the spirits table exists in the game's modifier documentation.

## Open questions

1. **The ice host.** Which of these 23 realms owns Eindil's ice? The far-edge branch works for any of them, but the owner may want that realm to have its own tier B tree.
2. **Holdon.** Holdon is the only Light realm in this tree. Is a "free towns" identity right for it, or should it follow the clans?
3. **The Houses in the Cold Lands.** The Afrit spec starts the Cold Lands at footholds 0–1. Should clan realms be able to welcome a House at all?
4. **A coast league.** Is a league of free towns (Holdon with Windwaith) a welcome proposal, or should the Cold Lands stay a land of clans and crowns only?
