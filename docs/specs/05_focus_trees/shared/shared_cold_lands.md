# Shared Cold Lands tree

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6.

## Purpose

Twenty-three clan realms and free towns of the Cold Lands share one tree, `shared_cold_lands`. It makes a small Cold Lands country play like one: a steading hall and its moot, furs and iron, the Long Winters, the pull between Fandanar and Isengard, the cold coast, and the old tales of the far north. Branches open by people, ideology, overlord, coast and region (`allow_branch`), so a coastal free town, a subject of Coldor, a clan of the far north-west and a steading near the silent castle each read a different tree. Text names the country with `[ROOT.GetName]` and `[ROOT.GetAdjective]`.

The tree implements the clan side of [the Cold Lands mechanic](../../04_mechanics/cold_lands.md) (lean, winters, the Accord's invitations) and gives small hooks into [Eindil's journey](../../04_mechanics/eindil_journey.md), [the Western Crossing](../../04_mechanics/western_crossing.md) and [Afrit's Hidden Council](../../04_mechanics/afrit_hidden_council.md). The tier B trees of the region are in [../regional/cold_lands.md](../regional/cold_lands.md); Coldor's tree is [../major/coldor.md](../major/coldor.md).

| Item | Value |
| --- | --- |
| Tree id | `shared_cold_lands` (focus ids `zin_shared_cold_lands_<key>`) |
| Tier | C (shared) |
| Countries (23) | Worlond, Omar, Londor, Felkond, Orewele, Portogalor, Xison, Naepu, Poloto, Radeon, Wonderland, Celen, Neridor, Rion, Hendair, Hozoson, Holdon, Pertolor, Gaadon, Greenle, Agoron, Belor, Yeneldmore (exactly the tier C list in [01_tiers_and_coverage.md](../01_tiers_and_coverage.md)) |
| Focuses | 70 (the tier C size of 40 to 70 applies to the tree; one country sees 38 to 55, by its branches) |
| Grid | x 0–29, y 0–8 |
| Events | namespace `zin_shared_cold_lands` |
| Spirits | `zin_shared_cold_lands_<key>` |

**In the game today** (commit ca01fa3; checked 19 October 2026): all 23 exist with ZIN tags and the people `zin_people_men`. Holdon is Light with the stance `zin_light_council` (Free Council); the other 22 are Wild with `zin_wild_clans` (Clan Moot). None is a subject. Every one runs the interim "Long Peace" tree (`zin_long_peace_*`), which this tree replaces for them. The game still starts on 1936.1.1 until the calendar spec ([../../00_foundation/01_start_and_calendar.md](../../00_foundation/01_start_and_calendar.md)) lands; dates here are 4A engine dates (start `1748.3.1`, 1 Thaw 4A 1748), so the tree builds after the calendar.

## Lore basis

- **Established:** the Cold Lands are the largest and least known landmass; their tribes live there beside Coldor, Isengard, Horidor, the Yeti Lands and the Windwaith arm; Cold Lands tribes found Eindil alive in the ice, fed and sheltered him and entrusted him to western travellers; Horos keeps the Castle of Yeldenne in the Cold Lands; Aenoran voyages reached the Cold Lands in the First Age.
- **Proposed (vault):** the tribes, free towns and peoples live by trade, herding and hunting; Coldor's uniting of the interior in 4A 850 and Isengard's refusal.
- **Proposed (mechanics specs):** lean, the Long Winters, the Winter Moot, the Neck Road, the far north-west state list, the Mp'E approach states.
- **Proposed (this spec):** every focus, spirit and event, the league of free towns, the steading charters and every number.
- **Kept open:** which clan realm owns Eindil's ice (the map step records it); the castle's exact place; the nature of yeti and giants (the kin branch speaks only of "the kin of the high snows"). Before `zin_eindil_awake` no visible focus mentions a stranger; before `zin_afrit_revealed` no text names Afrit.

## Design

### Branches

| Branch | Columns | Rows | Opens (`allow_branch` on the root) | Drives |
| --- | --- | --- | --- | --- |
| R. The Steading Hall | 0–2 | 0–3 | every country | Court |
| E. Furs and Iron | 3–5 | 0–4 | every country | Economy; winter stores |
| W. The Clan Host | 6–8 | 0–3 | people `men` (`zin_people_is_common_folk`) | Army |
| L. Between the Two Halls | 9–15 | 0–4 | `zin_cold_is_clan_realm` (every country with a lean, Holdon included) | Lean; the Accord, the Iron Hall or the Free Steadings |
| H. The Houses of the First Light | 16 | 0 | every country | Afrit's footholds (public face) |
| C. The Cold Coast | 17–20 | 0–4 | owns a coastal state | Navy, trade, ships for the West, the black water |
| O. Under a Greater Crown | 21–23 | 0–3 | `is_subject` | Life as a subject |
| F. The Far Edge | 24–26 | 0–3 | owns a far north-west state | The far ice; the stranger (hidden until `zin_eindil_awake`) |
| Y. Near the Silent Castle | 27–29 | 0–2 | owns a Mp'E approach state or the Yeldenne landing | The castle in peace |
| T. The Free Towns | 0–2 | 5–7 | ideology `light` | Council towns |
| N. The Neck Road | 3–5 | 6–7 | owns a Neck Road state | Trade with the West |
| X. Word from the South | 9–13 | 6–8 | every country; root needs a story flag | The final war |
| V. The Long Winters | 15–17 | 5–8 | every country | Winter, stores and the moot |
| K. Kin of the High Snows | 24–26 | 6–7 | minor people `yeti` or `giants` | Kin units |

`allow_branch` conditions (compiled on each branch root; the root's `available` repeats the same condition, so a stale layout never lets a wrong country take a branch). Region and ownership tests use the economy spec's startup flag `zin_region_cold_lands` for the country and the generated state triggers for states.

| Branch | Condition |
| --- | --- |
| W | `check zin_people_is_common_folk` |
| L | `check zin_cold_is_clan_realm` |
| C | `check zin_shared_cold_lands_is_coastal` |
| O | `is_subject` |
| F | `check zin_shared_cold_lands_owns_far_ice` |
| Y | `check zin_shared_cold_lands_near_the_castle` |
| T | `ideology light` |
| N | `check zin_shared_cold_lands_on_the_neck` |
| K | `or` [`check zin_people_includes_yeti`, `check zin_people_includes_giants`] (peoples spec triggers; true only if the country table gives a minor people, which it does for none of the 23 today) |

Two non-root focuses carry their own `allow_branch` (S9: any condition): `the_man_from_the_ice` (`global_flag zin_eindil_awake`) and `songs_of_the_houseless_king` (`global_flag zin_eindil_war_king`; the characters spec allows the epithet "the King Without a House" only after that flag).

### The peaceful start

No focus in this tree creates a war goal, starts a border war or declares a war. The only military help abroad (`beside_the_heir`) needs `zin_eindil_returned`. Lost Cause membership (`send_spears_south`) needs `zin_gathering_dark` ≥ 50 or `zin_eindil_named`.

### Notation

Effects and conditions use the compiler vocabulary ([00_format_and_compiler.md](../00_format_and_compiler.md)) and the S9 extensions. Shorthand in the tables:

| Shorthand | Compiles to |
| --- | --- |
| **lean ±n self** | `call zin_cold_add_lean` (`value` n) on ROOT |
| **lean ±n FROM** | `for_country FROM` → `call zin_cold_add_lean` (`value` n) |
| **lean ≥ n**, **lean ≤ −n** | `variable zin_cold_lean above n−1`, `variable zin_cold_lean below −n+1` |
| **regard ±n**, **renown ±n** | `call zin_eindil_add_regard` (`value` n; on ROOT), `call zin_eindil_add_renown` (`value` n) |
| **LC +n** | `flag zin_lost_cause_member` (honorary crown of the Lost Cause, decision S3) plus `call zin_lost_cause_add_strength` (`value` n) |
| **aid host {m, e}** | `call zin_eindil_aid_host` (`manpower` m, `equipment` e) |
| **join coalition** | `call zin_eindil_join_coalition` |
| **friend** | `check zin_eindil_friend` (regard ≥ 25) |
| **unaligned** | `check zin_shared_cold_lands_unaligned` (not in a faction) |
| **dark ≥ n** | `variable global.zin_gathering_dark above n−1` |
| **hist** | AI factor while `check zin_cold_historical` is true |
| **research [c] b ×u** | `research` (categories [c], bonus b, uses u); categories are the warfare spec's `zin_cat_*` ([../../03_gameplay/01_warfare.md](../../03_gameplay/01_warfare.md)) |

Days are 35 unless shown. Every AI value is a base weight; "×f at …" entries are `ai` modifiers.

### R. The Steading Hall (every country)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_steading_hall` | The Steading Hall of [ROOT.GetName] | `council_table` | — | — | 1,0 | 35 | political_power 50 | 100 |
| `the_elders_speak` | The Elders Speak | `rune_stone` | the_steading_hall | — | 0,1 | 35 | stability 0.03 | 20 |
| `hearth_law` | Hearth Law | `rune_stone` | the_steading_hall | — | 2,1 | 35 | political_power 25; add_spirit hearth_law_spirit | 15 |
| `the_clan_moot_sits` | The Clan Moot Sits | `council_table` | the_elders_speak or hearth_law | — | 1,2 | 35 | event clan_moot (`zin_shared_cold_lands.1`) | 15 |
| `one_hearth` | One Hearth for the [ROOT.GetAdjective] Clans | `feast_table` | the_clan_moot_sits | — | 1,3 | 70 | political_power 75; stability 0.05 | 15 |

### E. Furs and Iron (every country)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `furs_and_iron` | Furs and Iron | `forge_anvil` | — | — | 4,0 | 35 | building industrial_complex 1 capital | 25 |
| `the_trading_post` | The Trading Post | `market_stalls` | furs_and_iron | — | 3,1 | 35 | political_power 25; add_spirit trading_post | 12 |
| `smithies` | The Smithies | `foundry_fire` | furs_and_iron | — | 5,1 | 35 | building arms_factory 1 capital | 10 |
| `sledge_tracks` | Sledge Tracks | `roads_paved` | the_trading_post or smithies | — | 4,2 | 35 | building infrastructure 1 random_owned | 10 |
| `winter_stores` | Winter Stores | `granary` | sledge_tracks | — | 4,3 | 35 | flag zin_cold_winter_stores (the mechanic halves the winter for this country); stability 0.03 | 20; hist ×2 |
| `fires_through_the_long_night` | Fires Through the Long Night | `foundry_fire` | winter_stores | — | 4,4 | 70 | building industrial_complex 1 random_owned; add_spirit long_night | 8 |

Building keys are the engine keys the economy spec keeps and renames (`industrial_complex` Guild Workshops, `arms_factory` Armouries, `dockyard` Shipwrights).

### W. The Clan Host (people `men`)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_clan_host` | The Clan Host | `levy_muster` | — | — | 7,0 | 35 | available: check zin_people_is_common_folk; army_experience 5; manpower 2000 | 15 |
| `snow_runners` | Snow-Runners | `footprints_snow` | the_clan_host | — | 6,1 | 35 | add_spirit snow_runners_trained | 10 |
| `bowmen_of_the_snow` | Bowmen of the Snow | `bow_archers` | the_clan_host | — | 8,1 | 35 | research [zin_cat_bows] 0.5 ×1 | 8 |
| `hill_wardens` | Hill Wardens | `levy_muster` | snow_runners or bowmen_of_the_snow | — | 7,2 | 35 | research [zin_cat_arms] 0.5 ×1; army_experience 5 | 8 |
| `the_muster_horn` | The Muster Horn | `war_drums` | hill_wardens | — | 7,3 | 35 | manpower 3000; add_spirit muster_horn | 8 |

### L. Between the Two Halls (clan realms)

**Purpose:** each realm with a lean chooses between the Winter Crown of Fandanar, the Iron Hall of Isengard and its own snow. The choice moves `zin_cold_lean` and opens the matching approach: a seat in the Northern Accord, Isengard's shield, or Fearno's Free Steadings. **Mutual exclusions:** *Friends of Fandanar* / *Guests of the Iron Hall* / *Our Own Snow*.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_two_halls` | Between the Two Halls | `two_crowns` | — | — | 12,0 | 35 | available: check zin_cold_is_clan_realm; political_power 25; tooltip "Fandanar sends envoys. The Iron Hall sends gifts. [ROOT.GetName] must answer one day." | 30 |
| `friends_of_fandanar` | Friends of Fandanar | `banner_league` | the_two_halls | guests_of_the_iron_hall, our_own_snow | 10,1 | 35 | lean +15 self | 30; ×3 at lean ≥ 20; ×0.2 at lean ≤ −20 |
| `guests_of_the_iron_hall` | Guests of the Iron Hall | `crown_iron` | the_two_halls | friends_of_fandanar, our_own_snow | 12,1 | 35 | lean −15 self | 30; ×3 at lean ≤ −20; ×0.2 at lean ≥ 20 |
| `our_own_snow` | Our Own Snow | `charter_free` | the_two_halls | friends_of_fandanar, guests_of_the_iron_hall | 14,1 | 35 | add_spirit own_snow | 30; ×3 at lean above −20 and below 20 |
| `envoys_to_fandanar` | Envoys to Fandanar | `envoy` | friends_of_fandanar | — | 10,2 | 35 | lean +10 self; political_power 25 | 15 |
| `a_place_in_the_accord` | A Place in the Accord | `banner_league` | envoys_to_fandanar | — | 10,3 | 35 | available: lean ≥ 50; unaligned; check zin_shared_cold_lands_accord_open; event_for Coldor accord_request (`zin_shared_cold_lands.2`) | 20 |
| `envoys_to_the_iron_hall` | Envoys to the Iron Hall | `envoy` | guests_of_the_iron_hall | — | 12,2 | 35 | lean −10 self; political_power 25 | 15 |
| `the_iron_halls_shield` | The Iron Hall's Shield | `crown_iron` | envoys_to_the_iron_hall | — | 12,3 | 35 | available: lean ≤ −50; exists Isengard; event_for Isengard shield_request (`zin_shared_cold_lands.3`) | 20 |
| `markets_for_all_comers` | Markets for All Comers | `market_stalls` | our_own_snow | — | 14,2 | 35 | political_power 50; add_spirit open_markets | 15 |
| `the_steading_endures` | The Steading Endures | `charter_free` | markets_for_all_comers | — | 14,3 | 35 | stability 0.05; call zin_shared_cold_lands_lean_toward_zero (`value` 10) | 15 |
| `answer_the_free_steadings` | Answer the Free Steadings | `handshake_oath` | the_steading_endures | — | 14,4 | 35 | available: check zin_shared_cold_lands_free_steadings_exist; unaligned; event_for Fearno steadings_join_request (`zin_shared_cold_lands.4`) | 20 |

On the historical path the AI picks by lean (the factors above): most clan realms start at lean 5 and take *Our Own Snow* or *Friends of Fandanar*; realms bordering Isengard (lean −20) take *Guests of the Iron Hall*; Holdon (lean 10) usually takes *Our Own Snow*. The joining focuses need leans that the historical path rarely reaches, so the factions stay small, as the mechanic intends.

### H. The Houses of the First Light (every country)

The Houses are the public face of the Deliverer's network: a hospital and a grain store that most people serve sincerely. The focus says only that. The Afrit spec starts these countries at footholds 1 with cap 3, so one House (footholds 2) is within the cap.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `a_house_of_healing` | A House of Healing | `house_first_light` | — | — | 16,0 | 35 | available: not flag zin_afrit_houses_purged; not global_flag zin_afrit_revealed; call zin_afrit_add_footholds (`value` 1; the Afrit spec clamps it to the cap and its tooltip shows only the public name "Houses of the First Light"); stability 0.03; tooltip "The Houses of the First Light offer a hospital and a grain store." | 15; ×0 with flag zin_afrit_suspicious |

### C. The Cold Coast (owns a coastal state)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_cold_coast` | The Cold Coast | `harbour_lake` | — | — | 18,0 | 35 | available: check zin_shared_cold_lands_is_coastal; building naval_base 1 random_coastal | 20 |
| `fishing_fleets` | Fishing Fleets | `fishing_boats` | the_cold_coast | — | 17,1 | 35 | political_power 25; add_spirit fishing_fleets_spirit | 12 |
| `the_harbour_wall` | The Harbour Wall | `fort_wall` | the_cold_coast | — | 19,1 | 35 | building coastal_bunker 1 random_coastal | 8 |
| `the_carrying_boats` | The Carrying Boats | `shipwright_yard` | fishing_fleets | — | 17,2 | 35 | building dockyard 1 random_coastal; navy_experience 5 | 10 |
| `ships_for_the_western_yards` | Ships for the Western Yards | `ship_voyage` | the_harbour_wall | — | 19,2 | 35 | available: global_flag zin_west_council; call zin_west_add_fleet (`value` 2); political_power 25 | 10 |
| `fishermens_tales` | Fishermen's Tales | `lighthouse` | the_carrying_boats or ships_for_the_western_yards | — | 18,3 | 35 | flag zin_shared_cold_lands_heard_fishermen; navy_experience 5; tooltip "Black ships, the old men say. Nobody at court believes them." | 8 |
| `against_the_black_water` | Against the Black Water | `black_isles` | fishermens_tales | — | 17,4 | 35 | available: global_flag zin_zol_rising; building coastal_bunker 1 random_coastal; building coastal_bunker 1 random_coastal; add_spirit black_water | 100 |
| `a_harbour_for_strangers` | A Harbour for Strangers | `harbour_lake` | fishermens_tales | — | 19,4 | 35 | flag zin_eindil_safe_harbour; stability 0.02 | 10; hist ×0 |

`zin_eindil_safe_harbour` is a proposed journey hook (contract additions register): in stage 6 (ports of call), *Resupply the ship* gets AI weight ×2 under the dynamic rule. It does nothing under the historical rule, so the historical betrayal of one port still happens.

### O. Under a Greater Crown (subjects)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `under_a_greater_crown` | Under a Greater Crown | `seal_wax` | — | — | 22,0 | 35 | available: is_subject; stability 0.05; political_power 25 | 50 |
| `tribute_of_furs` | Tribute of Furs | `tribute_chest` | under_a_greater_crown | — | 21,1 | 35 | call zin_shared_cold_lands_pay_tribute (overlord +25 political power); stability 0.02 | 20 |
| `levies_for_the_overlord` | Levies for the Overlord | `spear_levy` | under_a_greater_crown | — | 23,1 | 35 | manpower 2000; army_experience 5 | 15 |
| `a_voice_at_court` | A Voice at Court | `envoy` | tribute_of_furs or levies_for_the_overlord | — | 22,2 | 35 | political_power 50; call zin_shared_cold_lands_seek_voice (autonomy score +10) | 15 |
| `the_charter_of_the_steading` | The Charter of the Steading | `charter_old` | a_voice_at_court | — | 22,3 | 35 | add_spirit steading_charter | 15 |

### F. The Far Edge (owns a far north-west state)

**Purpose:** the clans at the edge of the world. In 4A 1748 this is a branch of hunting, ice paths and old ice. Once a man has been found alive in the ice (`zin_eindil_awake`), its hidden focus lets the clan remember him well. The journey's own events (stage 1) decide how the ice host treats him; this branch never replaces them.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_far_edge` | The Far Edge of the World | `ice_field` | — | — | 25,0 | 35 | available: check zin_shared_cold_lands_owns_far_ice; political_power 25 | 15 |
| `hunters_of_the_old_ice` | Hunters of the Old Ice | `wild_hunt` | the_far_edge | — | 24,1 | 35 | army_experience 5; add_spirit old_ice_hunters | 10 |
| `the_ice_paths` | The Ice Paths | `footprints_snow` | the_far_edge | — | 26,1 | 35 | building infrastructure 1 random_owned | 10 |
| `the_man_from_the_ice` | The Man from the Ice | `footprints_snow` | hunters_of_the_old_ice or the_ice_paths | — | 25,2 | 35 | allow_branch and available: global_flag zin_eindil_awake; renown +2; regard +5; political_power 25 | 30 |
| `songs_of_the_houseless_king` | Songs of the King Without a House | `traders_road` | the_man_from_the_ice | — | 25,3 | 35 | allow_branch and available: global_flag zin_eindil_war_king; regard +5; war_support 0.02 | 15 |

### Y. Near the Silent Castle (owns a Mp'E approach state or the Yeldenne landing)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_silent_castle` | The Silent Castle | `castle_ice` | — | — | 28,0 | 35 | available: check zin_shared_cold_lands_near_the_castle; stability 0.02; tooltip "A castle stands in the frozen north. Its lord does not ride out, and its light does not fail." | 15 |
| `leave_the_castle_be` | Leave the Castle Be | `handshake_oath` | the_silent_castle | — | 27,1 | 35 | available: exists Yeldenne; non_aggression Yeldenne; flag zin_shared_cold_lands_friends_of_the_hall | 20 |
| `watchers_on_the_snow` | Watchers on the Snow | `eye_watchful` | the_silent_castle | — | 29,1 | 35 | add_spirit snow_watch | 10 |
| `the_light_is_gone` | The Light Is Gone | `castle_ice` | leave_the_castle_be or watchers_on_the_snow | — | 28,2 | 35 | available: global_flag zin_horos_dead; stability 0.03; political_power 25; tooltip "The green light in the north is gone. Nobody knows what the castle keeps now." | 30 |

`zin_shared_cold_lands_friends_of_the_hall` is a proposed journey hook (contract additions register): when this country owns `zin_is_site_yeldenne_landing`, the AI weight of *Send guides inland* in *Landfall in the Frozen North* is ×2 under the dynamic rule (never under the historical rule). It adds no guide flag of its own, so the ambush formula is unchanged.

### T. The Free Towns (ideology `light`)

Holdon starts here. A clan realm whose government turns Light gains it.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_free_towns` | The Free Towns of [ROOT.GetName] | `guild_hall` | — | — | 1,5 | 35 | available: ideology light; stability 0.03; political_power 25 | 30 |
| `charters_of_the_coast_towns` | Charters of the Towns | `charter_free` | the_free_towns | — | 0,6 | 35 | add_spirit town_charters | 15 |
| `the_towns_council` | The Towns' Council | `council_table` | the_free_towns | — | 2,6 | 35 | stability 0.05 | 15 |
| `the_coast_league` | A League of Free Towns | `olive_branch` | charters_of_the_coast_towns or the_towns_council | — | 1,7 | 35 | available: check zin_shared_cold_lands_has_light_partner; call zin_shared_cold_lands_offer_coast_league (fires `zin_shared_cold_lands.5`) | 20 |

### N. The Neck Road (owns a Neck Road state)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_neck_steadings` | Steadings on the Neck | `traders_road` | — | — | 4,6 | 35 | available: check zin_shared_cold_lands_on_the_neck; building infrastructure 1 random_owned | 20 |
| `toll_posts_on_the_neck` | Toll-Posts on the Neck | `toll_house` | the_neck_steadings | — | 3,7 | 35 | available: global_flag zin_cold_neck_road; political_power 50; add_spirit neck_tolls | 20 |
| `traders_to_the_west` | Traders to the West | `caravan` | the_neck_steadings | — | 5,7 | 35 | political_power 25; add_spirit west_traders | 15 |

### X. Word from the South (every country)

**Purpose:** the clan's course when the War of the Last Crowns breaks out, the West crosses the sea or Zol's dead rise. **Mutual exclusion:** *Keep to the Snows* (historical) / *Send Spears South*. The vault says nothing of the clans in the final war; both courses are play.

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `word_from_the_south` | Word from the South | `banner_plain` | — | — | 11,6 | 35 | available: `or` [global_flag zin_war_of_last_crowns, global_flag zin_western_crossing, global_flag zin_zol_rising]; political_power 50 | 200 |
| `keep_to_the_snows` | Keep to the Snows | `snow_peak` | word_from_the_south | send_spears_south | 10,7 | 35 | add_spirit keep_to_the_snows_spirit | 40; hist ×100 |
| `send_spears_south` | Send Spears South | `spear_levy` | word_from_the_south | keep_to_the_snows | 12,7 | 35 | available: `or` [dark ≥ 50, global_flag zin_eindil_named]; LC +2 | 15; ×2 if friend; hist ×0 |
| `beside_the_heir` | Beside the Heir | `lone_sword` | send_spears_south | — | 12,8 | 35 | available: global_flag zin_eindil_returned; friend; aid host {500, zin_arms_equipment 200}; join coalition | 100 |

### V. The Long Winters (every country)

**Purpose:** the clan's side of the mechanic's yearly winter (`zin_cold_winter`): count the stores, keep the hearths warm, take bread from whoever offers it in a hard year, and speak at the Winter Moot. Proposed by this spec, from the Purpose's "the Long Winters".

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_long_winters` | The Long Winters | `ice_field` | — | — | 16,5 | 35 | political_power 25; tooltip "Every winter here is long. Some winters kill." | 30 |
| `count_the_stores` | Count the Stores | `granary` | the_long_winters | — | 15,6 | 35 | political_power 25; stability 0.02 | 15 |
| `furs_for_every_hearth` | Furs for Every Hearth | `herds` | the_long_winters | — | 17,6 | 35 | add_spirit winter_furs | 15 |
| `bread_from_any_hand` | Bread from Any Hand | `alms_bread` | count_the_stores | — | 15,7 | 35 | available: check zin_cold_winter_is_hard; stability 0.03; call zin_shared_cold_lands_lean_toward_zero (`value` 5) | 20 |
| `speak_at_the_winter_moot` | Speak at the Winter Moot | `council_table` | furs_for_every_hearth | — | 17,7 | 35 | political_power 50 | 15 |
| `when_the_thaw_comes` | When the Thaw Comes | `farm_sowing` | bread_from_any_hand or speak_at_the_winter_moot | — | 16,8 | 70 | add_spirit thaw_markets | 10 |

### K. Kin of the High Snows (minor people yeti or giants)

| Key | Name | Icon | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `kin_of_the_high_snows` | Kin of the High Snows | `snow_peak` | — | — | 25,6 | 35 | available: the K condition; political_power 25; stability 0.02 | 20 |
| `hunting_bands` | Hunting Bands of the Kin | `yeti_claw` | kin_of_the_high_snows | — | 24,7 | 35 | research [zin_cat_kin] 0.5 ×1 | 15 |
| `the_old_kin_muster` | The Old Kin Muster | `giant_hammer` | kin_of_the_high_snows | — | 26,7 | 35 | army_experience 10 | 15 |

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
| T. The Free Towns | 4 |
| N. The Neck Road | 3 |
| X. Word from the South | 4 |
| V. The Long Winters | 6 |
| K. Kin of the High Snows | 3 |
| **Total** | **70** |

What one country sees (the tier C size applies to the tree; these are the views the renderer checks):

| Sample | Branches | Focuses |
| --- | --- | ---: |
| Inland clan realm of men, no other branch | R, E, W, L, H, X, V | 38 |
| Coastal clan realm of men | R, E, W, L, H, C, X, V | 46 |
| Holdon (Light, coastal, lean 10) | R, E, W, L, H, C, T, X, V | 50 |
| Coastal far north-west clan realm near the castle | R, E, W, L, H, C, F, Y, X, V | 55 |

### Spirits

Keys compile to `zin_shared_cold_lands_<key>`. Names use `[ROOT.GetAdjective]` where shown. Icons are idea crops of the named catalog key. All are permanent. Every modifier is in the 1.19.3 modifier documentation (checked 19 October 2026).

| Key | Name | Icon | Modifiers | Added by |
| --- | --- | --- | --- | --- |
| `hearth_law_spirit` | Hearth Law | `rune_stone` | `drift_defence_factor` 0.10, `stability_factor` 0.02 | *Hearth Law* |
| `trading_post` | The Trading Post | `market_stalls` | `consumer_goods_factor` −0.02 | *The Trading Post* |
| `long_night` | Fires Through the Long Night | `foundry_fire` | `production_speed_buildings_factor` 0.05, `stability_factor` 0.02 | *Fires Through the Long Night* |
| `snow_runners_trained` | Snow-Runners | `footprints_snow` | `winter_attrition_factor` −0.10 | *Snow-Runners* |
| `muster_horn` | The Muster Horn | `war_drums` | `army_morale_factor` 0.05 | *The Muster Horn* |
| `own_snow` | Our Own Snow | `charter_free` | `drift_defence_factor` 0.15, `stability_factor` 0.03 | *Our Own Snow* |
| `open_markets` | Markets for All Comers | `market_stalls` | `trade_opinion_factor` 0.10 | *Markets for All Comers* |
| `fishing_fleets_spirit` | [ROOT.GetAdjective] Fishing Fleets | `fishing_boats` | `consumer_goods_factor` −0.02 | *Fishing Fleets* |
| `black_water` | Against the Black Water | `black_isles` | `coastal_bunker_effectiveness_factor` 0.15 | *Against the Black Water* |
| `steading_charter` | The Charter of the Steading | `charter_old` | `stability_factor` 0.03, `political_power_gain` 0.05 | *The Charter of the Steading* |
| `old_ice_hunters` | Hunters of the Old Ice | `wild_hunt` | `winter_attrition_factor` −0.10, `army_speed_factor` 0.02 | *Hunters of the Old Ice* |
| `snow_watch` | Watchers on the Snow | `eye_watchful` | `army_intel_factor` 0.10 | *Watchers on the Snow* |
| `town_charters` | Charters of the Towns | `charter_free` | `political_power_gain` 0.05, `trade_opinion_factor` 0.10 | *Charters of the Towns* |
| `neck_tolls` | Toll-Posts on the Neck | `toll_house` | `political_power_gain` 0.05 | *Toll-Posts on the Neck* |
| `west_traders` | Traders to the West | `caravan` | `trade_opinion_factor` 0.10 | *Traders to the West* |
| `keep_to_the_snows_spirit` | Keep to the Snows | `snow_peak` | `stability_factor` 0.05, `war_support_factor` −0.05 | *Keep to the Snows* |
| `winter_furs` | Furs for Every Hearth | `herds` | `winter_attrition_factor` −0.05, `stability_factor` 0.02 | *Furs for Every Hearth* |
| `thaw_markets` | When the Thaw Comes | `farm_sowing` | `consumer_goods_factor` −0.02, `monthly_population` 0.05 | *When the Thaw Comes* |

### Events (namespace `zin_shared_cold_lands`)

Every event is effect-triggered (no `trigger` or `mean_time_to_happen`). Pictures are keys that exist in the game today (`tools/content/data/presentation-cells.json`); none is gated.

| Id | Key | Title | To | Picture | Fired by | Text (gist) | Options |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `clan_moot` | The Clan Moot of [ROOT.GetName] | ROOT | `generic_court` | *The Clan Moot Sits* | The chiefs gather at the steading hall; the old and the young want different things. | **The elders' way** (AI 60): stability 0.03. **The young chiefs' way** (AI 40): army_experience 5; war_support 0.02 |
| 2 | `accord_request` | A Steading Asks for a Place in the Accord | Coldor | `generic_court` | *A Place in the Accord* | Envoys of [FROM.GetName] ask for a seat at Fandanar's table. | **Welcome them** (AI 70; ×0 if check zin_shared_cold_lands_at_war_with_from): call zin_shared_cold_lands_welcome_to_accord. **Not yet** (AI 30): lean −10 FROM |
| 3 | `shield_request` | A Steading Seeks the Iron Hall's Shield | Isengard | `generic_court` | *The Iron Hall's Shield* | [FROM.GetName] asks the Iron Hall to stand behind it. | **Stand behind them** (AI 70): call zin_shared_cold_lands_shield_steading. **Not our quarrel** (AI 30): lean +5 FROM |
| 4 | `steadings_join_request` | A Steading Asks to Join the Free Steadings | Fearno | `generic_wilds` | *Answer the Free Steadings* | [FROM.GetName] wants neither crown and asks to join the Free Steadings. | **Welcome them** (AI 80): invite FROM. **Not now** (AI 20): nothing |
| 5 | `coast_league_offer` | A League of Free Towns | the partner (see effects) | `generic_peace` | *A League of Free Towns* | The council of [FROM.GetName] offers a league of free towns: no war between us, open markets. | **Sign the league** (AI 60): call zin_shared_cold_lands_sign_town_league. **Decline** (AI 40): nothing |

Requested picture (art phase; the events use the existing key until it is generated): `cold_steading_moot` (ungated; a clan moot in a timber hall in the snow) for events 1 to 4.

### Text rules

- Each focus `desc` is one to three plain sentences, written in the data file from the focus's name, effects and branch purpose, and names the country with `[ROOT.GetName]` or `[ROOT.GetAdjective]`.
- No text names Afrit (compiler check 6). The Houses are only "the Houses of the First Light".
- No text visible before `zin_eindil_awake` mentions a stranger, a sleeper or a man in the ice. Before `zin_eindil_named`, Eindil is only "the Man from the Ice" or "the stranger" (decision D4); "the King Without a House" appears only behind `zin_eindil_war_king`. No focus names Eindil.

## Implementation

- Builder: the focus compiler `tools/content/modules/focus_compiler.mjs` ([00_format_and_compiler.md](../00_format_and_compiler.md)) reads the data below and writes every file in the builder's one transaction through the shared rewrite engine (`tools/content/apply.mts`). Nothing is hand-written.
- Data: `docs/design/focus/shared_cold_lands.json` with `"tier": "shared"` and the 23 countries above. Names resolve to tags through `tools/content/data/countries.json` at build time.
- Today every one of these countries runs the interim Long Peace tree (`zin_long_peace_*`, written by `tools/content/modules/vanilla_removal.mjs`). The compiled tree replaces it for these 23 countries; the coverage check fails if a country keeps both.
- Research categories (`zin_cat_bows`, `zin_cat_arms`, `zin_cat_kin`) and `zin_arms_equipment` come from the warfare spec ([01_warfare.md](../../03_gameplay/01_warfare.md), phase 3, before this tree's phase 6); the compiler fails if one is missing. Building keys are the engine keys the economy spec re-themes ([02_economy.md](../../03_gameplay/02_economy.md)).
- Compiled to `common/national_focus/zin_shared_cold_lands.txt`, `common/ideas/zin_focus_shared_cold_lands.txt`, `events/zin_shared_cold_lands.txt`, `common/scripted_effects/zin_shared_cold_lands.txt`, `common/scripted_triggers/zin_shared_cold_lands.txt`, `common/opinion_modifiers/zin_shared_cold_lands.txt` (from the data's `opinion_modifiers` block, the mechanism the other tree specs use), `localisation/english/zin_focus_shared_cold_lands_l_english.yml` (UTF-8 with BOM).
- No `raw` blocks. Conditions and targets outside the compiler's vocabulary (faction membership, the Light-partner search, opinion modifiers and guarantees in event options) are the tree-declared triggers and effects below; S9 allows any condition in `allow_branch` and FROM as a target of `for_country` and `invite`.

### Tree-declared scripted effects

| Effect | Scope | Does |
| --- | --- | --- |
| `zin_shared_cold_lands_lean_neighbours` (`value`) | country | `every_neighbor_country` with `zin_cold_is_clan_realm = yes`: `zin_cold_add_lean = { value = $value$ }`. Also called by the regional Cold Lands trees |
| `zin_shared_cold_lands_lean_toward_zero` (`value`) | country | Moves ROOT's `zin_cold_lean` toward 0 by `value`, never past 0, through `zin_cold_add_lean` |
| `zin_shared_cold_lands_pay_tribute` | country | `OVERLORD = { add_political_power = 25 }` |
| `zin_shared_cold_lands_seek_voice` | country (the subject) | `add_autonomy_score = { value = 10 localization = zin_shared_cold_lands_voice_tt }` (engine effect; it runs in the subject's own scope, as vanilla does) |
| `zin_shared_cold_lands_offer_coast_league` | country | Picks the partner: of the countries passing `zin_shared_cold_lands_light_partner_of_root`, the one with the most `num_owned_states` (temp-variable comparison; ties go to the first in engine tag order); fires `zin_shared_cold_lands.5` to it |
| `zin_shared_cold_lands_welcome_to_accord` | Coldor (FROM = asker) | `add_to_faction = FROM`; `add_opinion_modifier` `zin_cold_accord_kin` both ways |
| `zin_shared_cold_lands_shield_steading` | Isengard (FROM = asker) | `give_guarantee = FROM`; `zin_cold_add_defiance = { value = 2 }` |
| `zin_shared_cold_lands_sign_town_league` | partner (FROM = proposer) | `diplomatic_relation = { country = FROM relation = non_aggression_pact active = yes }`; `add_opinion_modifier` `zin_shared_cold_lands_town_league` both ways |

### Tree-declared scripted triggers

| Trigger | Scope | True when |
| --- | --- | --- |
| `zin_shared_cold_lands_is_coastal` | country | `any_owned_state = { is_coastal = yes }` |
| `zin_shared_cold_lands_unaligned` | country | `is_in_faction = no` |
| `zin_shared_cold_lands_owns_far_ice` | country | `any_owned_state = { zin_is_region_far_northwest = yes }` |
| `zin_shared_cold_lands_near_the_castle` | country | `any_owned_state` with `zin_is_region_mpe_approach = yes` or `zin_is_site_yeldenne_landing = yes` |
| `zin_shared_cold_lands_on_the_neck` | country | `any_owned_state = { zin_is_site_neck_road = yes }` |
| `zin_shared_cold_lands_accord_open` | any | Coldor exists and `is_faction_leader = yes` |
| `zin_shared_cold_lands_free_steadings_exist` | any | Fearno exists, `is_faction_leader = yes`, and has country flag `zin_regional_fearno_steadings_path` ([regional Cold Lands](../regional/cold_lands.md)) |
| `zin_shared_cold_lands_light_partner_of_root` | country (candidate) | `has_country_flag = zin_region_cold_lands` (economy spec), `has_government = democratic`, not ROOT, `NOT = { has_war_with = ROOT }` |
| `zin_shared_cold_lands_has_light_partner` | country | `any_other_country = { zin_shared_cold_lands_light_partner_of_root = yes }` |
| `zin_shared_cold_lands_at_war_with_from` | country | `has_war_with = FROM` |

### Opinion modifiers

| Key | Value | Decay | Notes |
| --- | ---: | --- | --- |
| `zin_shared_cold_lands_town_league` | +15 | none | Both ways after the league of free towns |

### Flags this tree sets

| Flag | Kind | Meaning |
| --- | --- | --- |
| `zin_shared_cold_lands_heard_fishermen` | country | Took *Fishermen's Tales* (flavour; read by nothing else) |
| `zin_shared_cold_lands_friends_of_the_hall` | country | Journey hook, see branch Y |
| `zin_cold_winter_stores` | country | Mechanic flag, set here by *Winter Stores* |
| `zin_eindil_safe_harbour` | country | Journey hook, see branch C |
| `zin_lost_cause_member` | country | Honorary crown of the Lost Cause (Aenor and diplomacy specs) |

### Calls and reads

| Owner | Names |
| --- | --- |
| [Cold Lands](../../04_mechanics/cold_lands.md) | effects `zin_cold_add_lean`, `zin_cold_add_defiance`; triggers `zin_cold_is_clan_realm`, `zin_cold_historical`, `zin_cold_winter_is_hard`; variable `zin_cold_lean`; flags `zin_cold_winter_stores`, `zin_cold_neck_road`; opinion `zin_cold_accord_kin`; site triggers `zin_is_region_far_northwest`, `zin_is_region_mpe_approach`, `zin_is_site_yeldenne_landing`, `zin_is_site_neck_road` |
| [Western Crossing](../../04_mechanics/western_crossing.md) | effect `zin_west_add_fleet`; flags `zin_west_council`, `zin_western_crossing` |
| [Eindil's journey](../../04_mechanics/eindil_journey.md) | effects `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_aid_host`, `zin_eindil_join_coalition`; trigger `zin_eindil_friend`; flags `zin_eindil_awake`, `zin_eindil_war_king`, `zin_eindil_named`, `zin_eindil_returned` |
| [Afrit](../../04_mechanics/afrit_hidden_council.md) | effect `zin_afrit_add_footholds`; flags `zin_afrit_houses_purged`, `zin_afrit_suspicious`, `zin_afrit_revealed` |
| [Diplomacy](../../03_gameplay/03_diplomacy_and_factions.md) | effect `zin_lost_cause_add_strength`; the Northern Accord faction and its joining rule |
| [Peoples](../../00_foundation/03_peoples.md) | triggers `zin_people_is_common_folk`, `zin_people_includes_yeti`, `zin_people_includes_giants` |
| [Economy](../../03_gameplay/02_economy.md) | region flag `zin_region_cold_lands` |
| Contract | `zin_gathering_dark`, `zin_horos_dead`, `zin_zol_rising`, `zin_war_of_last_crowns` |
| [Warfare](../../03_gameplay/01_warfare.md) | research categories `zin_cat_bows`, `zin_cat_arms`, `zin_cat_kin`; equipment `zin_arms_equipment` |

Engine effects named: `add_autonomy_score`, `add_to_faction`, `give_guarantee`, `diplomatic_relation`, `add_opinion_modifier`, `add_political_power`, `every_neighbor_country`, `set_temp_variable`, `country_event`, `mark_focus_tree_layout_dirty`. Engine triggers named: `is_coastal`, `any_owned_state`, `any_other_country`, `is_in_faction`, `is_faction_leader`, `has_government`, `has_war_with`, `has_country_flag`. All are in the 1.19.3 documentation (checked 19 October 2026).

### `allow_branch` refresh

Branch roots that depend on states owned (C, F, Y, N), overlord (O), ideology (T) or people (K) are evaluated when the tree loads and again when `mark_focus_tree_layout_dirty` runs. Every root repeats its condition in `available`, so a stale layout never lets a wrong country take a branch.

- The journey effects that set `zin_eindil_awake` and `zin_eindil_war_king` call `mark_focus_tree_layout_dirty` on every country with `zin_region_cold_lands` (dependency on the journey spec, as for Coldor's and the regional trees' hidden focuses).
- For ownership, overlord and government changes, `focus_compiler.mjs` writes one shared file, `common/on_actions/zin_focus_layout.txt`, that calls `mark_focus_tree_layout_dirty` for the countries concerned in `on_ruling_party_change`, `on_puppet`, `on_release_as_puppet`, `on_subject_free`, `on_annex` and `on_peaceconference_ended` (decision E4; all six on_actions exist in 1.19.3).

### Game rules and defines

None new. The tree reads `zin_cold_historical` (which reads `zin_rule_cold_isengard` and `zin_rule_historical_path`).

## AI

- Roots first: *The Steading Hall* 100, then economy and the two halls. *Word from the South* has 200 so the AI reacts when the world changes.
- Lean choice: the factors in branch L make each AI follow its lean. Under the free rule the same factors apply.
- Coastal realms build a naval base and a dockyard; they sell ships to the West only while the Ford Council sits.
- *A House of Healing*: base 15; ×0 for a country with `zin_afrit_suspicious`.
- Historical route (typical clan realm): 1748 steading hall, furs and iron, the two halls, the long winters; 1749–1751 hearth law, the lean choice, trading post, sledge tracks, winter stores, furs for every hearth; 1752–1754 the clan host and coast; 1755 word from the south, keep to the snows.

## Acceptance

1. The compiler accepts `shared_cold_lands.json`: 70 focuses; unique keys and positions; every prerequisite above its focus; exclusives symmetric; days multiples of 7 between 7 and 140; every icon and event picture a catalog key present in the game; every modifier in the 1.19.3 modifier documentation; every `call` and `check` resolves to a mechanic, peoples or tree-declared definition; no `raw` blocks. The coverage check maps each of the 23 countries to this tree and to no other.
2. The HOI4 Agent Tools focus inspector and script validator report no errors on the staged files. The renderer produces one review image with all branches visible and one per sample in the "What one country sees" table with `allow_branch` applied; the visible counts match that table.
3. On 1 Thaw 4A 1748: no focus can create a war goal or join a war; *The Man from the Ice* and *Songs of the King Without a House* are hidden; no text names Afrit or mentions a sleeper in the ice (compiler check 6, plus a localisation scan for "stranger", "sleeper" and "man" with "ice" outside the two hidden focuses).
4. Holdon sees branches L and T; a non-coastal clan realm does not see branch C; only owners of far north-west states see branch F; no country sees branch K.
5. Historical observer run (Linux; one in-game year from 1 Thaw 1748 at the end of phase 6, then the full historical run): by 1752 at least 15 of the 23 have taken their lean choice, matching the sign of their lean; none declares a war before `zin_war_of_last_crowns`; every surviving realm takes *Keep to the Snows* within 180 days of *Word from the South* opening.
6. Scenario: a clan realm at lean 55, not in a faction, completes *A Place in the Accord*; Coldor's AI accepts; the realm joins the Northern Accord with `zin_cold_accord_kin` both ways; Coldor's reach rises on its next monthly update.
7. Scenario: a subject completes *A Voice at Court*; its autonomy score rises by 10.
8. Scenario: set `zin_eindil_awake` by console effect; within one day the far-edge country sees *The Man from the Ice* (layout refreshed).

## Open questions

None remains open inside this spec. The owner's questions below proceed on the proposal shown; they are listed in [OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md) under "regions: cold, west, tritons" 3.

1. **The ice host.** Which of the 23 realms owns Eindil's ice, and should it get a tier B tree? Proposal: the map step records the owner (`zin_is_site_eindil_ice`); branch F works for any of them, and no tier B tree is added.
2. **The Houses in the Cold Lands.** Proposal: clan realms may welcome one House (*A House of Healing*), within the Afrit spec's footholds caps (start 1, cap 3).

Settled here (proposed design, no lore closed): Holdon keeps the free-towns identity of branch T, because it is the region's only Light realm; because the Cold Lands mechanic gives it a lean (10), it also sees branch L. The league of free towns (event 5) stays as a non-aggression pact with opinion, not a faction, and needs a second Light Cold Lands country. The Long Winters branch (V) is added to carry the Purpose's winters.
