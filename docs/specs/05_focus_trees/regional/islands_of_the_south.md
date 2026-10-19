# Islands of the South Regional Trees

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier B).

## Purpose

This spec defines the four tier B focus trees of the Islands of the South: **Howan, Nara, Verde and Enhis Is Rond**, the four islands the vault names (*Erdae and Its Regions*). Each tree has a unique core and copies whole modules of the shared tree [../shared/shared_islands_of_the_south.md](../shared/shared_islands_of_the_south.md) (modules I1 to I9). The islands have no great-power mechanic. They matter because in 4A 1751 a storm carries a stranger to them, they shelter him, and they send him to Gala (established). The trees tie the islands to stage 4 of [Eindil's journey](../../04_mechanics/eindil_journey.md) (the wreck host, the reef, the shrine, "Stay and Rule Us"), to the ports of call of stage 6, to Lorien's counsel ([lands_of_the_sun.md](../../04_mechanics/lands_of_the_sun.md)), to the Deliverer's priests ([afrit_hidden_council.md](../../04_mechanics/afrit_hidden_council.md)) and, through their ships, to the [Western Crossing](../../04_mechanics/western_crossing.md).

## Lore basis

**Established** (vault): the Islands of the South form two arcs south of the West Lands; Howan, Nara, Verde and Enhis Is Rond are named there; Eindil's ship is carried there by storms; he lives among the islanders, helps them settle disputes and survive dangers, and hears of the long-lived elves farther south-west; the islanders' saying sends tales too old for any man to explain to Gala; Lorien's crew includes island navigators.

**Roster facts** (`tools/content/data/countries.json`): Howan is a western rice-island maritime republic (Light council); Nara is an island polity on Ancha, independent of the other southern islands (Light council); Verde and Enhis Is Rond are independent island realms (Wild freeholds); all four are realms of men with one state each.

**Proposed in the vault:** the reef of drowned voices (fisherfolk will not cross it at night; Eindil recovers children stranded there in a storm; afterwards the sea goes silent); the ruined shrine beneath the tide with an inscription naming Aen, which island priests repeat without understanding; "small, poor and hospitable".

**Proposed in other specs and used here:** Howan as the wreck host, Nara or Verde for the reef, the shrine site `zin_is_site_south_shrine` on Enhis Is Rond (journey spec); the rulers' names ([characters](../../02_lore/02_characters.md)); the journey's events `zin_eindil.41` to `.46`.

**Proposed here:** every focus, spirit, event and number; the island customs and offices below.

**Kept open:** the vault does not fix which island holds the reef and the shrine. This spec follows the journey spec's proposals (owner question, see Open questions), and the trees work wherever the sites end up. No text names the stranger before the journey's stage 8, when he names himself to the courts; no text says what the shrine's inscription means before then.

## Design

### Rules for every tree in this spec

- **The peaceful start.** No focus in these trees declares war, creates a war goal or claims land, at any date.
- **The stranger.** Until `zin_eindil_named` he is "the stranger" or `[zin_loc_eindil]`. Island text never uses his name before `zin_eindil_stage` ≥ 8 (the naming is not public news until he warns the courts). Help to him gives regard and renown; it never makes him faster than history (journey rule).
- **The secret.** Before `zin_afrit_revealed` the Deliverer's people are "priests from the north" or "healers of the Deliverer"; no text names Afrit (decision D3).
- **Shorthands** as in the shared tree: **Footholds ±n** = `call zin_afrit_add_footholds(value = n)` on ROOT; **Drift X +n** = `call zin_politics_add_drift(IDEOLOGY = X, VALUE = n)`; **Counsel +n** = `call zin_sun_add_gala_counsel(value = n)`; **Regard +n** = `call zin_eindil_add_regard(value = n)` on ROOT; **Renown +n** = `call zin_eindil_add_renown(value = n)`. **Stage** is the global variable `zin_eindil_stage`: "stage = 4" compiles to `variable global.zin_eindil_stage above 3` and `not` above 4; "stage ≥ n" to above n − 1. **hist ×f** is an `ai` modifier with factor f under `check zin_rules_is_historical`.
- **Days** are 70 unless marked 35d.
- **Copied modules.** A tree that copies I4 takes that module of `shared_islands_of_the_south` whole: the same keys (ids become `zin_regional_<name>_<key>`), the same effects, icons, days and inner prerequisites, `allow_branch` dropped unless stated. The module root sits where the copy line says, every other focus at its shared offset from the root; the root's prerequisite becomes the tree's root focus. Copied spirits are re-declared under the tree's prefix with the shared modifiers and take the icon of the shared focus that adds them; a copied spirit whose key equals a focus key of the tree takes the suffix `_spirit`, so focus and idea localisation keys never collide (Nara: `island_navigators_spirit`; Enhis Is Rond: `island_markets_spirit`). Events of a module are referenced by full id (`zin_shared_islands_of_the_south.n`).
- **Root.** Each tree's root sits at (10,0). The copied I9 sits with its root at (13,6) and uses rows 6 to 8 of columns 11 to 15 alone.
- **Rulers** keep `<TAG>_zin_ruler`; events use the namespace `zin_regional_<name>`.

### Overview

| Island | Tree | Ruler (proposed) | Ideology / stance | Journey role (proposed) | Focuses | Copied |
| --- | --- | --- | --- | --- | ---: | --- |
| Howan | `regional_howan` | Speaker Tich Howa | Light, `zin_light_council` | Wreck host (event 41); "Stay and Rule Us" likely | 34 | I3, I4, I9 |
| Nara | `regional_nara` | Elder Ancha | Light, `zin_light_council` | Reef island (event 42), with Verde | 35 | I2, I4, I7, I9 |
| Verde | `regional_verde` | Chief Lua Verd | Wild, `zin_wild_freeholds` | Reef island (alternative); navigators | 32 | I2, I4, I9 |
| Enhis Is Rond | `regional_enhis_is_rond` | Priest-Elder Enhis | Wild, `zin_wild_freeholds` | Shrine site owner (event 43) | 33 | I1, I4, I9 |

### Notation of the branch lists

`key` **Name** (x,y; ← prerequisites; ✕ exclusive with; days) `icon`: effects. AI: weight. `a / b` means a or b. Every prerequisite is a focus key of the same tree.

---

## Howan (`regional_howan`)

### Situation in 4A 1748

Howan is the westernmost of the southern isles, a rice island of stepped terraces and one deep harbour (roster). It is a maritime republic: its Speakers are chosen by the terrace villages and the harbour guilds, and Speaker Tich Howa presides (proposed). Howan sells rice to every ship that passes and keeps an old house by the harbour for the shipwrecked, because the western storms throw a wreck on its reefs almost every year (proposed). Its trade runs north to the West Lands coast. Nothing in 4A 1748 troubles it but the price of rice.

### Role

- **Historical path.** In Thaw 4A 1751 the storm takes the stranger's ship south, and Howan, the first landfall, shelters the castaways (journey event 41, proposed host). He lives among the islands for most of a year, mends quarrels, and leaves for Gala. Howan honours his choice when he will not stay to rule it (event 44).
- **Alternatives.** Howan can sell news of him to the Deliverer's priests (journey divergence: early hunters and a stronger ambush), or hold him to the offer and delay him. In the war it keeps out, hires hulls to the West, or sends ships to the stranger's host when he returns.
- **In the War of the Last Crowns** Howan is far from every front.

### Ruler

Speaker Tich Howa (`<Howan>_zin_ruler`), Light `zin_light_council`, trait `zin_trait_elected_speaker`. Howan holds elections.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: Howan, the Rice Isle | 10 | 0 | 1 | start |
| A. The Rice Terraces | 0–3 | 1–4 | 6 | start |
| B. The Speakers of Howan | 4–6 | 1–3 | 4 | start |
| C. The Western Harbour | 7–9 | 1–3 | 4 | start; one focus needs the West's crossing route |
| D. Castaways and Guests | 12–14 | 1–4 | 6 | start; three focuses read journey stages |
| E. Priests at the Quays (copy of I4) | 16–18 | 1–3 | 4 | start |
| F. Old Tales of the Isles (copy of I3) | 20–22 | 1–3 | 4 | start |
| G. The Storm Years (copy of I9) | 11–15 | 6–8 | 5 | `zin_war_of_last_crowns` |

- `howan_the_rice_isle` **Howan, the Rice Isle** (10,0) `harbour_lake`: political_power 50; stability 0.02. AI 100.

**A. The Rice Terraces.**

- `terraces_of_howan` **The Terraces of Howan** (1,1; ← howan_the_rice_isle) `farm_sowing`: add_spirit rice_terraces. AI 40.
- `the_water_stairs` **The Water Stairs** (0,2; ← terraces_of_howan) `canal_lock`: building infrastructure 1 @capital. AI 25.
- `rice_for_the_ships` **Rice for the Ships** (2,2; ← terraces_of_howan; 35d) `market_stalls`: political_power 50. AI 30.
- `the_granary_of_the_isles` **The Granary of the Isles** (1,3; ← the_water_stairs / rice_for_the_ships) `granary`: stability 0.05; manpower 300. AI 25.
- `the_harvest_festival` **The Harvest Festival** (3,3; ← rice_for_the_ships; 35d) `feast_table`: event zin_regional_howan.1. AI 20.
- `rice_merchants` **Rice Merchants** (2,4; ← the_granary_of_the_isles / the_harvest_festival) `coin_chest`: building industrial_complex 1 @capital. AI 20.

**B. The Speakers of Howan.**

- `the_speakers_house` **The Speakers' House** (5,1; ← howan_the_rice_isle) `council_table`: add_spirit speakers_house. AI 35.
- `free_elections_of_howan` **Free Elections of Howan** (4,2; ← the_speakers_house) `charter_free`: Drift light +5; stability 0.03. AI 25.
- `the_harbour_guilds` **The Harbour Guilds** (6,2; ← the_speakers_house) `guild_hall`: political_power 50. AI 25.
- `the_republic_of_howan` **The Republic of Howan** (5,3; ← free_elections_of_howan / the_harbour_guilds) `seal_wax`: swap_spirit speakers_house → republic_of_howan. AI 20.

**C. The Western Harbour.**

- `the_western_harbour` **The Western Harbour** (8,1; ← howan_the_rice_isle) `anchor_rope`: building naval_base 1 @capital. AI 30.
- `traders_to_the_west` **Traders to the West** (7,2; ← the_western_harbour) `ship_voyage`: political_power 50; add_spirit western_trade. AI 25.
- `ships_of_howan` **Ships of Howan** (9,2; ← the_western_harbour) `shipwright_yard`: building dockyard 1 @capital; navy_experience 5. AI 20.
- `hulls_for_the_west` **Hulls for the West** (8,3; ← traders_to_the_west / ships_of_howan; 35d) `galley_oars`: Avail: `global_flag` zin_west_route_crossing; not `global_flag` zin_western_crossing. call zin_west_add_fleet(value = 5); political_power 50. AI 40.

**D. Castaways and Guests.** Howan's house for the shipwrecked, and what it does when the stranger comes.

- `the_house_of_castaways` **The House of Castaways** (13,1; ← howan_the_rice_isle) `shipwreck`: stability 0.02; tooltip "Howan has kept a house for the shipwrecked for as long as there have been storms." AI 40; hist ×2.
- `the_rescue_boats` **The Rescue Boats** (12,2; ← the_house_of_castaways) `fishing_boats`: navy_experience 5; add_spirit rescue_boats. AI 25.
- `a_seat_by_the_fire` **A Seat by the Fire** (14,2; ← the_house_of_castaways; 35d) `feast_table`: Avail: stage = 4; check zin_eindil_is_host. Bypass: stage ≥ 5, or `global_flag` zin_eindil_lost. Regard +10; Renown +2; tooltip "A stranger from the wreck sits by our fire and asks the way to the old kingdom." AI 200 when available.
- `the_stranger_mends_our_quarrels` **Mending Old Quarrels** (12,3; ← the_rescue_boats / a_seat_by_the_fire) `olive_branch`: stability 0.05; if stage = 4 and check zin_eindil_is_host: Renown +3 and tooltip "The stranger among us helped the Speakers settle them." (established: he helped the islanders settle disputes). The description speaks only of the Speakers settling an old quarrel between the terraces and the harbour. AI 25.
- `honour_his_choice` **Honour His Choice** (14,3; ← a_seat_by_the_fire; 35d) `banner_laid_down`: Avail: stage ≥ 5. Bypass: `global_flag` zin_eindil_lost. Regard +5; political_power 25. AI 100 when available; hist ×2.
- `the_road_to_gala` **The Road to Gala** (13,4; ← the_stranger_mends_our_quarrels / honour_his_choice) `compass_rose`: Counsel +3; stability 0.02; tooltip "When the tales of men grow too old for any man to explain, carry them to Gala." AI 25.

**E. Priests at the Quays.** Copy of I4, root `priests_at_the_quays` at (17,1), prerequisite `howan_the_rice_isle`. Focuses: `priests_at_the_quays` (17,1), `welcome_the_healers` (16,2), `send_them_on_their_way` (18,2), `close_the_houses_of_the_isle` (17,3).

**F. Old Tales of the Isles.** Copy of I3, root `old_tales_of_the_isles` at (21,1), prerequisite `howan_the_rice_isle`. Focuses: `old_tales_of_the_isles` (21,1), `the_reef_singers` (20,2), `keepers_of_old_names` (22,2), `songs_for_strangers` (21,3).

**G. The Storm Years.** Copy of I9, root `the_storm_years` at (13,6), prerequisite `howan_the_rice_isle`. Focuses at the shared positions: (13,6), (11,7), (13,7), (15,7), (13,8).

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_house_of_castaways` | The House of Castaways | root | stability 0.02. AI 40; hist ×2 so the house exists before the storm year |
| `a_seat_by_the_fire` | A Seat by the Fire | the_house_of_castaways | Only for the stranger's host in stage 4; bypassed from stage 5 or when he is lost. Regard +10; Renown +2. AI 200 when available |
| `the_stranger_mends_our_quarrels` | Mending Old Quarrels | the_rescue_boats / a_seat_by_the_fire | stability 0.05; Renown +3 only when it completes while he is Howan's guest |
| `honour_his_choice` | Honour His Choice | a_seat_by_the_fire | From stage 5. Regard +5; political_power 25. AI 100; hist ×2 |
| `hulls_for_the_west` | Hulls for the West | traders_to_the_west / ships_of_howan | `zin_west_add_fleet` +5 while the West prepares its crossing |

### Spirits

| Key | Name | Modifiers | Icon | Source |
| --- | --- | --- | --- | --- |
| `rice_terraces` | The Rice Terraces | monthly_population 0.05, stability_factor 0.03 | `farm_sowing` | terraces_of_howan |
| `speakers_house` | The Speakers' House | stability_factor 0.03, political_power_gain 0.05 | `council_table` | the_speakers_house; replaced by republic_of_howan |
| `republic_of_howan` | The Republic of Howan | stability_factor 0.05, political_power_gain 0.05, drift_defence_factor 0.10 | `seal_wax` | the_republic_of_howan |
| `western_trade` | Trade With the West | trade_opinion_factor 0.10, consumer_goods_factor −0.02 | `ship_voyage` | traders_to_the_west |
| `rescue_boats` | The Rescue Boats | naval_detection 0.10, navy_org_factor 0.03 | `fishing_boats` | the_rescue_boats |
| copies | I3, I4, I9 spirits (`old_tales`, `healers_at_the_quays`, `far_from_the_war`) | as the shared tree | as the adding focus | copied modules |

### Events (namespace `zin_regional_howan`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | The Harvest Festival | Howan | the_harvest_festival | `generic_peace` | The terraces are cut and the boats come for rice. "Sell to every ship" (political_power 50) / "Fill the island's granary first" (stability 0.03). AI 50/50 |

The journey's events `zin_eindil.41` (Wreck on the Southern Isles), `.44` (Stay and Rule Us) and `.45` (Carry the Old Tales to Gala) reach Howan as the proposed wreck host; this tree does not duplicate them.

---

## Nara (`regional_nara`)

### Situation in 4A 1748

Nara is the island polity of Ancha, a long island of fishing villages ruled by a moot of elders (roster: independent of the other southern islands). Its eldest, called Elder Ancha after the island as Nara's eldest always is (proposed custom; the name is the characters spec's), speaks for the moot. Nara's fisherfolk will not cross the reef off its eastern point at night: drowned voices are said to call ships onto the rocks there (proposed island legend, placed here as one of the journey spec's two candidate islands). Nara is proud, poor and stubborn, and wants nothing from the wider world but fair prices for smoked fish.

### Role

- **Historical path.** During the stranger's year in the islands, a storm strands children on the reef and he brings them back (journey event 42 to Nara or Verde); the islanders say the sea went silent when he carried them ashore. Nara's tree then lets the fisherfolk cross the reef again.
- **Alternatives.** Nara can light the reef, train reef pilots, and send navigators to Gala's ships. In the war it keeps out or sends ships.

### Ruler

Elder Ancha (`<Nara>_zin_ruler`), Light `zin_light_council`, trait `zin_trait_elected_speaker`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: The Elders of Ancha | 10 | 0 | 1 | start |
| A. The Elders' Moot | 0–2 | 1–3 | 4 | start |
| B. The Reef of Drowned Voices | 5–7 | 1–4 | 5 | start; the last needs the journey's reef event |
| C. Fisherfolk of Ancha | 9–11 | 1–3 | 4 | start |
| D. The Guest-Right (copy of I2) | 13–15 | 1–4 | 6 | start |
| E. Priests at the Quays (copy of I4) | 17–19 | 1–3 | 4 | start |
| F. Ships and Navigators (copy of I7) | 21–23 | 1–4 | 6 | coast and people (kept) |
| G. The Storm Years (copy of I9) | 11–15 | 6–8 | 5 | `zin_war_of_last_crowns` |

- `the_elders_of_ancha` **The Elders of Ancha** (10,0) `council_table`: political_power 50; stability 0.02. AI 100.

**A. The Elders' Moot.**

- `the_elders_moot` **The Elders' Moot** (1,1; ← the_elders_of_ancha) `concord_circle`: add_spirit elders_moot. AI 40.
- `voices_of_the_villages` **Voices of the Villages** (0,2; ← the_elders_moot) `charter_free`: Drift light +3; stability 0.02. AI 25.
- `the_elders_law` **The Elders' Law** (2,2; ← the_elders_moot) `scroll_sealed`: political_power 50. AI 25.
- `the_eldest_speaks` **The Eldest Speaks** (1,3; ← voices_of_the_villages / the_elders_law) `sceptre`: swap_spirit elders_moot → eldest_speaks. AI 20.

**B. The Reef of Drowned Voices.**

- `the_reef_of_voices` **The Reef of Voices** (6,1; ← the_elders_of_ancha; 35d) `storm_sea`: event zin_regional_nara.1. AI 35.
- `no_boat_at_night` **No Boat at Night** (5,2; ← the_reef_of_voices) `anchor_rope`: add_spirit night_custom (the custom is honoured; the fleet is smaller but safe). AI 25.
- `lights_on_the_reef` **Lights on the Reef** (7,2; ← the_reef_of_voices) `lighthouse`: add_spirit reef_lights; building naval_base 1 @capital. AI 20.
- `the_reef_pilots` **The Reef Pilots** (6,3; ← no_boat_at_night / lights_on_the_reef) `sea_charts`: navy_experience 10; political_power 25. AI 20.
- `the_silent_reef` **The Silent Reef** (6,4; ← the_reef_pilots) `fishing_boats`: Avail: flag zin_eindil_reef_island (country flag set by the journey's event `zin_eindil.42` on the island that receives it). event zin_regional_nara.2; remove_spirit night_custom; stability 0.05; Renown +2. AI 100 when available.

**C. Fisherfolk of Ancha.**

- `fisherfolk_of_ancha` **Fisherfolk of Ancha** (10,1; ← the_elders_of_ancha) `fishing_boats`: political_power 25; add_spirit ancha_fisheries. AI 35.
- `smoked_fish_for_the_ships` **Smoked Fish for the Ships** (9,2; ← fisherfolk_of_ancha; 35d) `market_stalls`: political_power 50. AI 25.
- `the_net_menders` **The Net-Menders** (11,2; ← fisherfolk_of_ancha) `workshop_tools`: building industrial_complex 1 @capital. AI 20.
- `the_catch_of_ancha` **The Catch of Ancha** (10,3; ← smoked_fish_for_the_ships / the_net_menders) `granary`: stability 0.03; manpower 200. AI 20.

**D. The Guest-Right.** Copy of I2, root `the_guest_right` at (14,1), prerequisite `the_elders_of_ancha`. Focuses: `the_guest_right` (14,1), `island_feasts` (13,2), `shelter_for_the_wrecked` (15,2), `lamps_on_the_reefs` (13,3), `carry_it_to_gala` (15,3), `a_welcome_on_every_shore` (14,4).

**E. Priests at the Quays.** Copy of I4, root `priests_at_the_quays` at (18,1), prerequisite `the_elders_of_ancha`. Focuses: (18,1), (17,2), (19,2), (18,3).

**F. Ships and Navigators.** Copy of I7, root `island_navigators` at (22,1), prerequisite `the_elders_of_ancha`; its `allow_branch` (owns a coastal state and `people: men`) is kept. Focuses: `island_navigators` (22,1), `charts_of_the_southern_seas` (21,2), `galleys_of_the_isles` (23,2), `hulls_for_hire` (21,3), `navigators_for_gala` (23,3), `masters_of_the_southern_seas` (22,4). Its spirit is `island_navigators_spirit`.

**G. The Storm Years.** Copy of I9, root `the_storm_years` at (13,6), prerequisite `the_elders_of_ancha`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_reef_of_voices` | The Reef of Voices | root | event .1. AI 35 |
| `no_boat_at_night` | No Boat at Night | the_reef_of_voices | add_spirit night_custom |
| `lights_on_the_reef` | Lights on the Reef | the_reef_of_voices | add_spirit reef_lights; naval base +1 |
| `the_silent_reef` | The Silent Reef | the_reef_pilots | Only on the island that carries `zin_eindil_reef_island`. event .2; remove_spirit night_custom; stability 0.05; Renown +2. AI 100 when available |
| `navigators_for_gala` (I7) | Navigators for Gala | I7 | Counsel +3; Regard +5 while the stranger is at Gala (stage 5) |

### Spirits

| Key | Name | Modifiers | Icon | Source |
| --- | --- | --- | --- | --- |
| `elders_moot` | The Elders' Moot | stability_factor 0.03, drift_defence_factor 0.10 | `concord_circle` | the_elders_moot; replaced by eldest_speaks |
| `eldest_speaks` | The Eldest Speaks | stability_factor 0.05, political_power_gain 0.05, drift_defence_factor 0.10 | `sceptre` | the_eldest_speaks |
| `night_custom` | No Boat at Night | stability_factor 0.03, consumer_goods_factor 0.02 | `anchor_rope` | no_boat_at_night; removed by the_silent_reef |
| `reef_lights` | Lights on the Reef | naval_detection 0.15 | `lighthouse` | lights_on_the_reef |
| `ancha_fisheries` | Fisheries of Ancha | monthly_population 0.05, consumer_goods_factor −0.02 | `fishing_boats` | fisherfolk_of_ancha |
| copies | I2, I4, I7, I9 spirits (`guest_right`, `reef_lamps`, `healers_at_the_quays`, `island_navigators_spirit`, `southern_seas`, `far_from_the_war`) | as the shared tree | as the adding focus | copied modules |

### Events (namespace `zin_regional_nara`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | The Reef at Night | Nara | the_reef_of_voices | `generic_sea` | Young fishers want to cross the reef at night, where the catch is best. "Keep the old custom" (stability 0.02) / "Let the bold ones go" (political_power 25; manpower −100: one boat does not come back). AI 70/30. Text says only that voices are heard; it never says whose |
| .2 | The Silent Reef | Nara | the_silent_reef | `generic_sea` | Since the storm year, nobody has heard the voices. "Cross at night again" (political_power 25) / "Keep the custom anyway" (stability 0.03). AI 60/40. Text calls him "the stranger" and does not say how the sea went silent |

---

## Verde (`regional_verde`)

### Situation in 4A 1748

Verde is the green island: forested hills, deep bays and a clan hall where Chief Lua Verd sits among the heads of the island's families (proposed). Verde's great trees make the best hulls of the southern isles, and its navigators read the southern stars better than any (proposed). Its people sell timber, sail far, and keep to themselves.

### Role

- **Historical path.** Verde is the journey spec's other candidate for the reef of drowned voices; on the historical path it more often gives the stranger's crew its navigators (established that island navigators sailed with Lorien's ship). It calls at no war.
- **Alternatives.** Verde can sell timber to Gala's shipwrights or to the West's crossing fleet, and pilot passing ships (the journey's ports of call).

### Ruler

Chief Lua Verd (`<Verde>_zin_ruler`), Wild `zin_wild_freeholds`, trait `zin_trait_warband_chief`.

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: The Green Isle | 10 | 0 | 1 | start |
| A. The Chief's Hall | 0–2 | 1–3 | 4 | start |
| B. Green Woods and Timber | 5–7 | 1–4 | 6 | start; two focuses need Gala or the West |
| C. Navigators of Verde | 10–12 | 1–4 | 6 | start; two focuses read journey stages |
| D. The Guest-Right (copy of I2) | 14–16 | 1–4 | 6 | start |
| E. Priests at the Quays (copy of I4) | 18–20 | 1–3 | 4 | start |
| F. The Storm Years (copy of I9) | 11–15 | 6–8 | 5 | `zin_war_of_last_crowns` |

- `the_green_isle` **The Green Isle** (10,0) `forest_ancient`: political_power 50; stability 0.02. AI 100.

**A. The Chief's Hall.**

- `the_hall_of_verde` **The Hall of Verde** (1,1; ← the_green_isle) `banner_plain`: add_spirit hall_of_verde. AI 40.
- `oaths_of_the_families` **Oaths of the Families** (0,2; ← the_hall_of_verde) `handshake_oath`: manpower 300; army_experience 5. AI 25.
- `the_chiefs_gifts` **The Chief's Gifts** (2,2; ← the_hall_of_verde; 35d) `tribute_chest`: political_power 50. AI 25.
- `chief_of_all_verde` **Chief of All Verde** (1,3; ← oaths_of_the_families / the_chiefs_gifts) `crown_iron`: swap_spirit hall_of_verde → one_chief_of_verde. AI 20.

**B. Green Woods and Timber.**

- `the_green_woods` **The Green Woods** (6,1; ← the_green_isle) `forest_ancient`: political_power 25; stability 0.02. AI 35.
- `timber_for_the_yards` **Timber for the Yards** (5,2; ← the_green_woods) `timber_mill`: building industrial_complex 1 @capital. AI 25.
- `the_great_trees` **The Great Trees** (7,2; ← the_green_woods) `shipwright_yard`: building dockyard 1 @capital. AI 25.
- `timber_for_gala` **Timber for Gala** (5,3; ← timber_for_the_yards; 35d) `gala_sun`: Avail: exists Gala Elves. Counsel +3; political_power 50. AI 20.
- `timber_for_the_west` **Timber for the West** (7,3; ← the_great_trees; 35d) `galley_oars`: Avail: `global_flag` zin_west_route_crossing; not `global_flag` zin_western_crossing. call zin_west_add_fleet(value = 5); political_power 50. AI 30.
- `the_forest_law` **The Forest Law** (6,4; ← timber_for_gala / timber_for_the_west / timber_for_the_yards) `scroll_sealed`: add_spirit forest_law. AI 20.

**C. Navigators of Verde.**

- `navigators_of_verde` **Navigators of Verde** (11,1; ← the_green_isle) `compass_rose`: navy_experience 10; add_spirit verde_navigators. AI 35.
- `star_paths` **The Star Paths** (10,2; ← navigators_of_verde) `sea_charts`: research [zin_cat_galleys] 50% ×1. AI 25.
- `the_long_canoes` **The Long Canoes** (12,2; ← navigators_of_verde) `galley_oars`: building dockyard 1 @capital. AI 20.
- `pilots_for_passing_ships` **Pilots for Passing Ships** (10,3; ← star_paths; 35d) `lighthouse`: political_power 25; if stage = 6: Regard +10. AI 25; ×4 when stage = 6.
- `a_navigator_sails_north` **A Navigator Sails North** (12,3; ← star_paths / the_long_canoes) `ship_voyage`: Avail: stage ≥ 5; exists Gala Elves. Regard +10; manpower −100; tooltip "One of our navigators signs on with the King of Gala's ship." AI 100 when available; hist ×2.
- `the_navigators_guild` **The Navigators' Guild** (11,4; ← pilots_for_passing_ships / a_navigator_sails_north) `guild_hall`: swap_spirit verde_navigators → navigators_guild. AI 20.

**D. The Guest-Right.** Copy of I2, root `the_guest_right` at (15,1), prerequisite `the_green_isle`. Focuses: (15,1), (14,2), (16,2), (14,3), (16,3), (15,4).

**E. Priests at the Quays.** Copy of I4, root `priests_at_the_quays` at (19,1), prerequisite `the_green_isle`. Focuses: (19,1), (18,2), (20,2), (19,3).

**F. The Storm Years.** Copy of I9, root `the_storm_years` at (13,6), prerequisite `the_green_isle`.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `navigators_of_verde` | Navigators of Verde | root | navy_experience 10; add_spirit verde_navigators |
| `a_navigator_sails_north` | A Navigator Sails North | star_paths / the_long_canoes | From stage 5 while Gala exists. Regard +10; manpower −100. AI 100; hist ×2 |
| `pilots_for_passing_ships` | Pilots for Passing Ships | star_paths | Regard +10 while Lorien's ship is at sea (stage 6) |
| `timber_for_the_west` | Timber for the West | the_great_trees | `zin_west_add_fleet` +5 |
| `the_forest_law` | The Forest Law | any of the three timber focuses | add_spirit forest_law |

### Spirits

| Key | Name | Modifiers | Icon | Source |
| --- | --- | --- | --- | --- |
| `hall_of_verde` | The Hall of Verde | army_morale_factor 0.03, stability_factor 0.02 | `banner_plain` | the_hall_of_verde; replaced by one_chief_of_verde |
| `one_chief_of_verde` | Chief of All Verde | army_morale_factor 0.05, stability_factor 0.03, political_power_gain 0.05 | `crown_iron` | chief_of_all_verde |
| `forest_law` | The Forest Law | production_speed_buildings_factor 0.05, stability_factor 0.02 | `scroll_sealed` | the_forest_law |
| `verde_navigators` | Navigators of Verde | naval_speed_factor 0.05, navy_max_range_factor 0.10 | `compass_rose` | navigators_of_verde; replaced by navigators_guild |
| `navigators_guild` | The Navigators' Guild | naval_speed_factor 0.05, navy_max_range_factor 0.15, experience_gain_navy_factor 0.10 | `guild_hall` | the_navigators_guild |
| copies | I2, I4, I9 spirits (`guest_right`, `reef_lamps`, `healers_at_the_quays`, `far_from_the_war`) | as the shared tree | as the adding focus | copied modules |

Verde has no tree events; the journey's reef event (`zin_eindil.42`) may reach it.

---

## Enhis Is Rond (`regional_enhis_is_rond`)

### Situation in 4A 1748

Enhis Is Rond is the most peopled of the four named isles (roster manpower 0.7): a round, terraced island ruled by priest-elders (proposed). Off its southern shore a ruined shrine stands beneath the tide; at the lowest tides the priests walk down to it and chant the name carved over its door, as their fathers did (proposed island legend, placed here as the journey spec's proposed shrine site). The name is Aen. The priests do not know who Aen was; they only know the name is old and must not be forgotten. Priest-Elder Enhis keeps the rite.

### Role

- **Historical path.** During the stranger's year in the islands he finds the inscription naming Aen (journey event 43 to the shrine owner). It does not identify him, but it makes his search harder to abandon (established direction). The islanders' saying sends him on to Gala.
- **Later.** When, in the journey's stage 8, the stranger names himself as Eindil, son of Ein, grandson of Aen, the priests learn whose name they have chanted. The island can send its shrine-tale south to Gala, guard the shrine, or let the Deliverer's scholars copy it.

### Ruler

Priest-Elder Enhis (`<Enhis Is Rond>_zin_ruler`), Wild `zin_wild_freeholds`, trait `zin_trait_lawspeaker` (characters spec).

### Tree

| Branch | Columns | Rows | Focuses | Opens |
| --- | --- | --- | ---: | --- |
| Root: The Priest-Elders | 10 | 0 | 1 | start |
| A. The Old Rite | 0–2 | 1–3 | 4 | start |
| B. The Shrine Beneath the Tide | 4–8 | 1–5 | 9 | start, while the island holds the shrine site; three focuses read journey stages |
| C. The Most Peopled Isle | 10–12 | 1–3 | 4 | start |
| D. The Sea Provides (copy of I1) | 14–16 | 1–4 | 6 | coast (kept) |
| E. Priests at the Quays (copy of I4) | 18–20 | 1–3 | 4 | start |
| F. The Storm Years (copy of I9) | 11–15 | 6–8 | 5 | `zin_war_of_last_crowns` |

- `the_priest_elders` **The Priest-Elders** (10,0) `censer`: political_power 50; stability 0.02. AI 100.

**A. The Old Rite.**

- `the_old_rite` **The Old Rite** (1,1; ← the_priest_elders) `hymn_choir`: add_spirit old_rite. AI 40.
- `the_council_of_priests` **The Council of Priests** (0,2; ← the_old_rite) `council_table`: political_power 50. AI 25.
- `the_island_law` **The Island Law** (2,2; ← the_old_rite) `scroll_sealed`: stability 0.03. AI 25.
- `the_eldest_priest` **The Eldest Priest** (1,3; ← the_council_of_priests / the_island_law) `sceptre`: swap_spirit old_rite → eldest_priest. AI 20.

**B. The Shrine Beneath the Tide.**

- `the_shrine_beneath_the_tide` **The Shrine Beneath the Tide** (6,1; ← the_priest_elders; 35d) `island_shrine`: allow_branch: check zin_regional_enhis_is_rond_holds_shrine. event zin_regional_enhis_is_rond.1; political_power 25. AI 40.
- `the_low_tide_rite` **The Low-Tide Rite** (5,2; ← the_shrine_beneath_the_tide) `hymn_choir`: add_spirit low_tide_rite. AI 30.
- `divers_of_the_shrine` **Divers of the Shrine** (7,2; ← the_shrine_beneath_the_tide) `anchor_rope`: political_power 25; navy_experience 5. AI 25.
- `copy_the_inscription` **Copy the Inscription** (4,3; ← the_low_tide_rite / divers_of_the_shrine) `scroll_sealed`: research [industry] 50% ×1; tooltip "The priests copy a name they repeat but do not understand." AI 20.
- `scholars_at_the_shrine` **Scholars at the Shrine** (6,3; ← divers_of_the_shrine; 35d) `book_lore`: event zin_regional_enhis_is_rond.2 (scholars from the Deliverer's temples ask to copy the inscription). AI 25.
- `the_shrine_wardens` **The Shrine Wardens** (8,3; ← divers_of_the_shrine) `eye_watchful`: add_spirit shrine_wardens. AI 20.
- `the_stranger_reads_the_stones` **The Stranger Reads the Stones** (5,4; ← copy_the_inscription / scholars_at_the_shrine) `rune_stone`: Avail: stage ≥ 5 (stage 4, when event `zin_eindil.43` reaches the shrine owner, is over). Bypass: `global_flag` zin_eindil_lost. stability 0.03; Renown +2; tooltip "A stranger from the sea read the old stones with our priests and went away quiet." AI 100 when available.
- `carry_the_name_to_gala` **Carry the Name to Gala** (7,4; ← scholars_at_the_shrine / the_shrine_wardens; 35d) `ship_voyage`: Avail: exists Gala Elves. Counsel +5; political_power 25; tooltip "A tale too old for any man to explain goes south to Gala." AI 25.
- `the_name_is_answered` **The Name Is Answered** (6,5; ← the_stranger_reads_the_stones / carry_the_name_to_gala) `crown_aen`: Avail: stage ≥ 8 (he has named himself to the courts). Bypass: `global_flag` zin_eindil_lost. event zin_regional_enhis_is_rond.3; Regard +10; stability 0.05. AI 100 when available.

**C. The Most Peopled Isle.**

- `the_crowded_isle` **The Crowded Isle** (11,1; ← the_priest_elders) `levy_muster`: manpower 500. AI 35.
- `terraced_villages` **Terraced Villages** (10,2; ← the_crowded_isle) `farm_sowing`: building industrial_complex 1 @capital. AI 25.
- `the_island_levy` **The Island Levy** (12,2; ← the_crowded_isle) `spear_levy`: add_spirit island_levy. AI 20.
- `many_hands` **Many Hands** (11,3; ← terraced_villages / the_island_levy) `workshop_tools`: political_power 50; stability 0.03. AI 20.

**D. The Sea Provides.** Copy of I1, root `nets_and_boats` at (15,1), prerequisite `the_priest_elders`; its `allow_branch` (owns a coastal state) is kept. Focuses: `nets_and_boats` (15,1), `salt_pans` (14,2), `pearl_divers` (16,2), `boatwrights_of_the_isles` (14,3), `island_markets` (16,3), `the_fishing_fleets` (15,4). Its spirits are `island_markets_spirit` and `fishing_fleets`.

**E. Priests at the Quays.** Copy of I4, root `priests_at_the_quays` at (19,1), prerequisite `the_priest_elders`. Focuses: (19,1), (18,2), (20,2), (19,3).

**F. The Storm Years.** Copy of I9, root `the_storm_years` at (13,6), prerequisite `the_priest_elders`.

If the map places the shrine elsewhere, branch B hides and the island sees 24 of its 33 focuses; the tree still compiles with 33.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_shrine_beneath_the_tide` | The Shrine Beneath the Tide | root | allow_branch: the island holds the shrine site. event .1 (the low-tide rite). AI 40 |
| `scholars_at_the_shrine` | Scholars at the Shrine | divers_of_the_shrine | event .2: scholars from the Deliverer's temples ask to copy the inscription. AI 25 |
| `the_stranger_reads_the_stones` | The Stranger Reads the Stones | copy_the_inscription / scholars_at_the_shrine | From stage 5. stability 0.03; Renown +2. AI 100 when available |
| `the_name_is_answered` | The Name Is Answered | the_stranger_reads_the_stones / carry_the_name_to_gala | From stage 8. event .3; Regard +10; stability 0.05. AI 100 when available |
| `carry_the_name_to_gala` | Carry the Name to Gala | scholars_at_the_shrine / the_shrine_wardens | Counsel +5 |

### Spirits

| Key | Name | Modifiers | Icon | Source |
| --- | --- | --- | --- | --- |
| `old_rite` | The Old Rite | stability_factor 0.03, drift_defence_factor 0.10 | `hymn_choir` | the_old_rite; replaced by eldest_priest |
| `eldest_priest` | The Eldest Priest | stability_factor 0.05, drift_defence_factor 0.15, political_power_gain 0.05 | `sceptre` | the_eldest_priest |
| `low_tide_rite` | The Low-Tide Rite | stability_factor 0.03, research_speed_factor 0.02 | `island_shrine` | the_low_tide_rite |
| `shrine_wardens` | The Shrine Wardens | army_core_defence_factor 0.10, enemy_operative_detection_chance_factor 0.10 | `eye_watchful` | the_shrine_wardens |
| `island_levy` | The Island Levy | conscription_factor 0.05, recruitable_population_factor 0.03 | `spear_levy` | the_island_levy |
| copies | I1, I4, I9 spirits (`island_markets_spirit`, `fishing_fleets`, `healers_at_the_quays`, `far_from_the_war`) | as the shared tree | as the adding focus | copied modules |

### Events (namespace `zin_regional_enhis_is_rond`)

| Id | Title | For | Fired by | Picture | Options (AI) |
| --- | --- | --- | --- | --- | --- |
| .1 | The Low-Tide Rite | Enhis Is Rond | the_shrine_beneath_the_tide | `generic_sea` | At the lowest tide the priests walk down to the drowned shrine and chant the old name. "Keep the rite as our fathers did" (stability 0.02) / "Ask the old ones what the name means" (political_power 15; text: nobody knows). AI 60/40. Complements the lore spec's flavour event `zin_lore.201` and does not replace it |
| .2 | Scholars at the Shrine | Enhis Is Rond | scholars_at_the_shrine | `houses` | Scholars from the Deliverer's temples ask to copy the old inscription for their libraries. "Let them copy it" (Footholds +1; political_power 50) / "The shrine is ours" (stability 0.03). AI 50/50; hist 60/40. Text never names Afrit and never says why they want it |
| .3 | The Name Is Answered | Enhis Is Rond | the_name_is_answered | `generic_peace` | Word comes that the stranger has named himself in the courts of the north: Eindil, son of Ein, grandson of Aen. The priests at last know whose name they chanted. "Carve his name beside it" (stability 0.03) / "Send our priests to tell the world" (Renown +3). AI 50/50. Allowed text: the focus needs stage ≥ 8 |

---

## Implementation

### Builder and files (per tree)

The content builder's focus compiler, `tools/content/modules/focus_compiler.mjs` ([00_format_and_compiler.md](../00_format_and_compiler.md)), reads each tree's data file and writes these files in the builder's single transaction through the shared rewrite engine (`tools/content/apply.mts`). No file is hand-edited.

| Path | Content |
| --- | --- |
| `docs/design/focus/regional_<name>.json` | Tree data, `"tier": "regional"`, `"countries": ["<Island>"]` |
| `common/national_focus/zin_regional_<name>.txt` | Compiled tree; the tree's `country` block selects its island, so the interim Long Peace tree no longer applies to it |
| `common/ideas/zin_focus_regional_<name>.txt` | Spirits, including the re-declared copies |
| `events/zin_regional_<name>.txt` | Howan, Nara and Enhis Is Rond (Verde has none) |
| `common/scripted_triggers/zin_regional_enhis_is_rond.txt` | The shrine trigger below |
| `localisation/english/zin_focus_regional_<name>_l_english.yml` | All text |

Names: `howan`, `nara`, `verde`, `enhis_is_rond`. Copies use the tree data's `"copy"` block, the same builder step as the eastern trees: `"copy": [ { "from": "shared_islands_of_the_south", "module": "I4", "root_at": [17,1] } ]`. The compiler expands each copy with the offsets above and fails if a copied position collides with a tree focus.

### Tree-declared scripts

| Name | Kind | Does |
| --- | --- | --- |
| `zin_regional_enhis_is_rond_holds_shrine` | scripted trigger, country | `any_owned_state = { zin_is_site_south_shrine = yes }` |

### Names used from other systems

| Name | Kind | Owner |
| --- | --- | --- |
| `zin_eindil_stage` (global), `zin_eindil_named`, `zin_war_of_last_crowns`, `zin_afrit_revealed`, `zin_eindil_returned`, `zin_western_crossing` | contract variable and global flags | shared contract |
| `zin_eindil_is_host`, `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_aid_host`, `zin_eindil_lost`, `zin_is_site_south_shrine`, events `zin_eindil.41` to `.46` | triggers, effects, flag, site trigger, events | [Eindil's journey](../../04_mechanics/eindil_journey.md) |
| `zin_eindil_reef_island` | country flag, permanent | contract additions; set by `zin_eindil.42` (journey) |
| `zin_sun_add_gala_counsel` | scripted effect | [Lands of the Sun](../../04_mechanics/lands_of_the_sun.md) |
| `zin_west_add_fleet`, `zin_west_route_crossing` | scripted effect, global flag | [Western Crossing](../../04_mechanics/western_crossing.md) |
| `zin_afrit_add_footholds`, `zin_afrit_purge_houses`, `zin_afrit_suspicious` | scripted effects, country flag (copied I4) | [Afrit](../../04_mechanics/afrit_hidden_council.md) |
| `zin_politics_add_drift`, `zin_light_council`, `zin_wild_freeholds`, `zin_trait_elected_speaker`, `zin_trait_warband_chief` | effect, stances, traits | [ideologies and politics](../../00_foundation/02_ideologies_and_politics.md) |
| `zin_trait_lawspeaker`, `<TAG>_zin_ruler` names, `zin_loc_eindil` | trait, rulers, scripted localisation | [characters](../../02_lore/02_characters.md) |
| `zin_rules_is_historical` | scripted trigger | [defines and rules](../../00_foundation/05_defines_and_rules.md) |
| `zin_lore.201` | flavour event | [history for play](../../02_lore/04_fourth_age_history_for_play.md) |

### Current game state

Today the four islands run the interim Long Peace tree (`zin_long_peace_*`), their rulers carry generated names (`modules/characters.mjs`; the characters spec brings the named Speaker, Elder, Chief and Priest-Elder) and the game still starts in 1936 until the calendar spec ships. The trees need the journey, the Western Crossing, Lands of the Sun and Afrit systems: until a system ships, the compiler's name check fails on its calls, so these trees are built in phase 6 after those mechanics (phase 3), as the roadmap orders.

## AI

| Island | 4A 1748–1750 | 4A 1751 (the stranger's year) | 4A 1752–1756 | War |
| --- | --- | --- | --- | --- |
| Howan | House of Castaways (hist ×2), Terraces, Speakers' House | A Seat by the Fire; Mending Old Quarrels | Honour His Choice; Road to Gala; Hulls for the West if the West chooses to cross | Storm Years; keeps out; ships for the stranger's host if regard ≥ 25 |
| Nara | Elders' Moot, Reef of Voices, No Boat at Night | — | The Silent Reef if the reef event came to Nara; Navigators for Gala | as Howan |
| Verde | Hall, Green Woods, Navigators | — | A Navigator Sails North (hist ×2); Pilots for Passing Ships | as Howan |
| Enhis Is Rond | Old Rite, Shrine, Low-Tide Rite | Divers, Copy the Inscription | The Stranger Reads the Stones; Scholars at the Shrine; Carry the Name to Gala; The Name Is Answered after stage 8 | as Howan |

The journey's own events decide the historical choices (shelter, honour his choice); the trees only add regard and renown around them.

## Acceptance

1. The compiler builds the four trees with 34, 35, 32 and 33 focuses (copies expanded), unique positions, every focus below its prerequisites, every exclusive pair symmetric, days multiples of 7, and every icon in the catalog; the HOI4 Agent Tools focus inspector and script validator pass on the staged files.
2. Each of Howan, Nara, Verde and Enhis Is Rond is assigned exactly its tree (coverage check).
3. No focus of the four trees declares war or creates a war goal or claim (scan for `wargoal`, `claims_on`, `cores_on`, `declare_war`).
4. No text reachable before `zin_eindil_named` contains "Eindil"; the only text that names him (`zin_regional_enhis_is_rond.3`) is reachable only at `zin_eindil_stage` ≥ 8 (compiler secret scan; gated-text check).
5. Scripted test with forced variables: `a_seat_by_the_fire` is available only to the stranger's host in stage 4 and is bypassed at stage 5; `the_silent_reef` only on the island that carries `zin_eindil_reef_island`; `the_name_is_answered` only at stage ≥ 8.
6. No text names Afrit before `zin_afrit_revealed`; "Scholars at the Shrine" makes no charge (review).
7. No localisation key is shared by a focus and an idea of the same tree (build test).
8. On a historical observer run in the Linux run Howan takes A Seat by the Fire in 4A 1751 and Honour His Choice in 4A 1752; Verde takes A Navigator Sails North while the stranger is at Gala.
9. Every modifier in the spirits tables exists in the 1.19.3 modifier documentation.

## Open questions

All are owner questions already listed in [OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md) (regions: east, south isles, sun, 9 to 12; eindil and glo, 3). The work proceeds on the proposal given.

1. **Elder Ancha.** The characters spec names Nara's ruler "Elder Ancha", and the roster says Nara lies on the island of Ancha. Works on: a custom where Nara's eldest takes the island's name.
2. **The shrine's island.** The vault does not fix it. Works on: Enhis Is Rond holds `zin_is_site_south_shrine` (journey proposal; the key-sites table must place the site in Enhis Is Rond's state). If the map places it elsewhere, branch B hides.
3. **The reef's island.** Works on: the journey's event 42 reaches Nara or Verde; Nara's tree is written around the reef and reads `zin_eindil_reef_island`.
4. **The scholars at the shrine.** Works on: the Deliverer's scholars may ask to copy an inscription naming Aen before the reveal; the text hints at nothing.
5. **Island ships for the West.** Works on: Howan and Verde may add hulls to the Western Crossing's fleet (`zin_west_add_fleet`; the fleet already counts "island charters").
