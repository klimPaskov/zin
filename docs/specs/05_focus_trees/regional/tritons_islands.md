# Triton's Islands regional focus trees

**Status:** Draft. **Priority:** 6. **Phase:** 6.

## Purpose

This spec gives the six tier B countries of Triton's Islands their own focus trees: Adel, Pollos, Raerby, Nondondor, Halenor and the Seite Islands. The other 28 island lordships use the shared tree [../shared/shared_tritons_islands.md](../shared/shared_tritons_islands.md). Triton's Islands have no great power and no mechanics spec; the shared tree spec defines the small regional system these trees use, **the Pupor Ocean**: piracy (`zin_tritons_piracy`), chart houses and corsair havens, the Pupor Charter and the Southern Banks.

Each tree gives its island a part in that system and in the wider story: Adel's chart hall and the charter the West asks for, Pollos's market and the Charter it founds, Raerby's brokers and arbiters, Nondondor's contested banks, Halenor's storm isles and wreck-right, and the Seite Isles' fishing moot. Each also meets the West's Crossing, Lorien's ship on its voyage north, and the great war at sea.

| Country | Tree id | States | Stance at start | Focuses |
| --- | --- | ---: | --- | ---: |
| Adel | `regional_adel` | 2 | `zin_light_council` | 31 |
| Pollos | `regional_pollos` | 1 | `zin_light_council` | 31 |
| Raerby | `regional_raerby` | 1 | `zin_light_council` | 31 |
| Nondondor | `regional_nondondor` | 1 | `zin_wild_clans` | 32 |
| Halenor | `regional_halenor` | 4 | `zin_wild_clans` | 33 |
| Seite Islands | `regional_seite_islands` | 4 | `zin_wild_clans` | 31 |

All six are realms of men with very small populations: manpower effects are hundreds, not thousands.

## Lore basis

**Established** (vault: *Erdae and Its Regions*, *The First Age of Erdae*, *The Fourth Age of Erdae*): Triton's Islands lie west of the West Lands and arc around the Pupor Ocean; Adel, Pollos, Raerby and Nondondor are there. In the First Age island peoples carried the Grand Alliance's supplies and escorts across Erdae's stormy seas. Lorien's crew for Eindil's voyage north included island navigators (which islands is not stated).

**Proposed (vault and earlier specs):** the Pupor charts of 4A 702; Senra of Triton's Islands; that the islands live by fishing, piracy and charting, with tensions of piracy, fishing rights and naval frontiers (start situation); the rulers Speaker Sanderz, Guild-Master Hesos Pol, Captain-Speaker Lemo Raer and King Benan of Nondondor ([characters](../../02_lore/02_characters.md)); Gunwaith's *Charts of the Pupor Ocean* and its charter event to Adel; the journey's ports of call in Triton's Islands.

**Proposed by this spec:** every focus, spirit, event and number; the rulers of Halenor (Sea-Lord Orvak Halen) and the Seite Islands (Elder Tamsa of the Seite); the named captains and advisors; the identities of each island (Adel's Chart Hall, Pollos's market, Raerby's brokers, Nondondor's banks, Halenor's storm isles and wreck-right, the Seite moot).

**Kept open (text never answers):** which islands sent navigators with Lorien; the islands' part in the War of the Last Crowns (the vault is silent; every war route here is play). No focus names Eindil. Before `zin_afrit_revealed` no text names Afrit.

## Design

### Conventions for every tree in this file

- **Ids.** Tree id `regional_<name>`; focus ids `zin_regional_<name>_<key>`; spirits `zin_regional_<name>_<key>`; events namespace `zin_regional_<name>`; characters `zin_regional_<name>_<person>`. Spirit keys never repeat a focus key of the same tree.
- **Defaults.** Days 35 unless marked 70d; AI base 10 unless given; no `available` block unless given. Lines read `key` **Name** (x,y) ← prerequisites: effects. "a, b" means a **or** b.
- **Shorthand.** **piracy ±n** is `call zin_tritons_add_piracy (n)`; **side chart / haven** is `call zin_tritons_set_side {side}`; **fleet ±n** is `call zin_west_add_fleet (n)`; **regard**, **renown** call `zin_eindil_add_regard` (ROOT) and `zin_eindil_add_renown`; **join coalition** is `call zin_eindil_join_coalition`; **friend** is `check zin_eindil_friend`; **safe harbour** is `flag zin_eindil_safe_harbour` (proposed journey hook: ×2 AI weight for *Resupply the ship* under the dynamic rule only).
- **Historical factor.** "hist ×f" applies while `zin_rules_is_historical` is true.
- **The southern ship.** Each tree has one focus with `allow_branch = check zin_tritons_ship_has_sailed` (journey stage ≥ 6): it speaks only of "a fast ship from the south, with elves among its crew".

### Peace gates (all trees in this file)

| Kind of focus | Earliest |
| --- | --- |
| Any war goal | Nondondor's *The Banks by Force* and Halenor's *The Isles by the Sword*: `zin_gathering_dark` ≥ 40 (≥ 50 for Nondondor) or `zin_war_of_last_crowns`; never historical |
| Joining the Western Crossing | `zin_western_crossing`; never historical |
| Joining Eindil's coalition | `zin_eindil_returned` and friend |

---

## Adel

**Tree** `regional_adel` · 2 states · Light (`zin_light_council`, elections every 48 months) · ruler **Speaker Sanderz** (proposed, characters spec) · 31 focuses · grid x 0–18, y 0–7.

### Situation in 4A 1748

Adel is the federation of the northern isles (roster), two states of harbours and chart rooms. Its Chart Hall (proposed) keeps the Pupor charts that the islanders drew in 4A 702 and sold to every crown, and its chart-masters are still the best in Erdae. An island assembly elects the Speaker; Sanderz holds the seat. Adel trades charts and soundings with the West Lands and with Aenor and has no quarrel with anyone.

### Role

- **Historical path (proposed):** Adel answers Gunwaith's request for a charter (`zin_gunwaith.5`) by selling charts and ships to the western fleet (+5), joins the Pupor Charter when Pollos founds it, and keeps the Charter neutral in the great war.
- **War of the Last Crowns:** neutral. Alternatives: sail its charts with the Crossing (play), or send pilots to the heir.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Adel tag>_zin_ruler` | Speaker Sanderz | Country leader, `zin_light_council` | characters spec (proposed) |
| `zin_regional_adel_ysmay` | Chart-Master Ysmay Corran | Political advisor, trait `zin_adv_sage`; recruited by *The Chart-Masters* | this spec (proposed) |
| `zin_regional_adel_edda` | Captain Edda Brine | Navy leader, skill 3, traits `spotter`, `blue_water_expert`; recruited by *The Sea-Wardens* | this spec (proposed) |

Start spirit (country history): `chart_hall_pride`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Speaker's Hall | 0–2 | 0–2 | start | Court; elections |
| B. The Chart Hall | 4–7 | 0–3 | start; exclusive at the end | Chart house; charts for the West or kept close |
| C. The Pupor Charter | 8–11 | 0–3 | start | Envoys; the Charter; patrols |
| D. Ships of the North Isles | 12–14 | 0–3 | start | Navy |
| E. Harbour of the Isles | 15–17 | 0–2 | start | Economy |
| F. Strangers | 18 | 0–1 | start; second focus hidden | Safe harbour; the southern ship |
| G. The Great War at Sea | 8–11 | 5–7 | `zin_war_of_last_crowns` or `zin_western_crossing` | Neutral charter, or charts for the Crossing |

**A. The Speaker's Hall.** Icons: `council_table`, `sea_charts`, `charter_free`.

- `the_speakers_hall` **The Speaker's Hall** (1,0) 70d: political power 75. AI 100.
- `the_island_assembly` **The Island Assembly** (0,1) ← the_speakers_hall: stability 0.03.
- `the_chart_masters` **The Chart-Masters** (2,1) ← the_speakers_hall: recruit `zin_regional_adel_ysmay`; political power 25.
- `the_federation_oath` **The Federation Oath** (1,2) 70d ← the_island_assembly, the_chart_masters: spirit `federation_of_the_north_isles`.
- `elections_of_the_isles` **Elections of the Isles** (2,2) ← the_chart_masters: event `isles_vote`.

**B. The Chart Hall.** Icons: `sea_charts`, `map_unrolled`, `compass_rose`, `scroll_sealed`.

- `the_chart_hall` **The Chart Hall** (5,0): side chart; navy experience 5. AI 30.
- `new_soundings` **New Soundings** (4,1) ← the_chart_hall: research {zin_cat_galleys} 0.5×1.
- `charts_for_every_crown` **Charts for Every Crown** (6,1) ← the_chart_hall: political power 50.
- `the_great_chart` **The Great Chart** (5,2) 70d ← new_soundings, charts_for_every_crown: spirit `great_chart`.
- ★ `charts_for_the_west` **Charts for the West** (4,3) ← the_great_chart; exclusive with charts_kept_close.
- ★ `charts_kept_close` **Charts Kept Close** (6,3) ← the_great_chart; exclusive with charts_for_the_west.

**C. The Pupor Charter.** Icons: `envoy`, `banner_league`, `galley_oars`.

- `the_pupor_charter` **The Pupor Charter** (9,0): piracy −3. AI 30.
- `envoys_to_pollos` **Envoys to Pollos** (8,1) ← the_pupor_charter: available Pollos exists; event `adel_envoys` to Pollos.
- `envoys_to_raerby` **Envoys to Raerby** (10,1) ← the_pupor_charter: available Raerby exists; event `adel_envoys` to Raerby.
- ★ `a_charter_of_the_isles` **A Charter of the Isles** (9,2) 70d ← envoys_to_pollos, envoys_to_raerby.
- `charter_patrols_of_adel` **Patrols of the North Isles** (9,3) ← a_charter_of_the_isles: piracy −5; navy experience 5.

**D. Ships of the North Isles.** Icons: `shipwright_yard`, `galley_oars`, `warship_sail`, `levy_muster`.

- `northern_yards` **The Northern Yards** (13,0): building dockyard 1 random_coastal. AI 20.
- `galleys_of_adel` **Galleys of Adel** (12,1) ← northern_yards: research {zin_cat_galleys} 0.5×1.
- `the_sea_wardens` **The Sea-Wardens** (14,1) ← northern_yards: recruit `zin_regional_adel_edda`; navy experience 10.
- `the_northern_squadron` **The Northern Squadron** (13,2) 70d ← galleys_of_adel, the_sea_wardens: spirit `northern_squadron`.
- `island_marines` **Island Marines** (13,3) ← the_northern_squadron: manpower 500; spirit `adel_marines`.

**E. Harbour of the Isles.** Icons: `harbour_lake`, `fishing_boats`, `anchor_rope`, `granary`.

- `harbour_of_adel` **The Harbour of Adel** (16,0): building naval_base 1 random_coastal. AI 20.
- `fisheries` **The Fisheries** (15,1) ← harbour_of_adel: political power 25.
- `the_rope_walks` **The Rope-Walks** (17,1) ← harbour_of_adel: building industrial_complex 1 capital.
- `stores_and_salt` **Stores and Salt** (16,2) ← fisheries, the_rope_walks: stability 0.03.

**F. Strangers.** Icons: `harbour_lake`, `ship_voyage`.

- `a_harbour_for_any_sail` **A Harbour for Any Sail** (18,0): safe harbour; stability 0.02. AI 10; hist ×0.
- `the_southern_ship` **The Southern Ship** (18,1) ← a_harbour_for_any_sail: `allow_branch` `check zin_tritons_ship_has_sailed`; renown +1; regard +5. AI 20.

**G. The Great War at Sea.** Icons: `storm_sea`, `sea_charts`, `ship_voyage`.

- `the_great_war_at_sea` **The Great War at Sea** (9,5): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `the_charter_stays_neutral` **The Charter Stays Neutral** (8,6) ← the_great_war_at_sea; exclusive with charts_for_the_crossing: spirit `charter_neutral`. AI 40; hist ×100.
- `charts_for_the_crossing` **Charts for the Crossing** (10,6) ← the_great_war_at_sea; exclusive with the_charter_stays_neutral: available `zin_western_crossing`, not at war; `call zin_tritons_join_crossing`; fleet +3. AI 5; hist ×0.
- `pilots_for_the_living` **Pilots for the Living** (9,7) ← the_charter_stays_neutral, charts_for_the_crossing: available `zin_eindil_returned`, friend; join coalition; regard +5. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `charts_for_the_west` | Charts for the West | the_great_chart | Exclusive with charts_kept_close. Available `zin_west_council`. Fleet +3; political power 50. AI 30; hist ×3 |
| `charts_kept_close` | Charts Kept Close | the_great_chart | Exclusive. Navy experience 10; stability 0.03. AI 20; hist ×0 |
| `a_charter_of_the_isles` | A Charter of the Isles | envoys_to_pollos, envoys_to_raerby | Available: not in a faction. `call zin_tritons_found_charter` (founds the Pupor Charter with Adel as leader, or asks to join if it exists). AI 15; hist ×0.5 (Pollos founds it on the historical path) |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `chart_hall_pride` | Keepers of the Charts | `navy_max_range_factor` 0.05, `trade_opinion_factor` 0.05 | Start (history); permanent |
| `federation_of_the_north_isles` | Federation of the North Isles | `political_power_gain` 0.10, `stability_factor` 0.05 | *The Federation Oath* |
| `great_chart` | The Great Chart | `navy_max_range_factor` 0.10, `naval_detection` 0.10 | *The Great Chart* |
| `northern_squadron` | The Northern Squadron | `navy_org_factor` 0.05, `naval_detection` 0.10 | *The Northern Squadron* |
| `adel_marines` | Island Marines | `amphibious_invasion` 0.10 | *Island Marines* |
| `charter_neutral` | The Charter Stays Neutral | `stability_factor` 0.05, `trade_opinion_factor` 0.05 | *The Charter Stays Neutral* |

### Events (namespace `zin_regional_adel`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `isles_vote` | The North Isles Vote | Adel | *Elections of the Isles* | **The chart-masters win** (AI 60): political power 50. **The fishers win**: stability 0.03 |
| 2 | `adel_envoys` | Envoys from Adel | Pollos or Raerby | *Envoys to Pollos*, *Envoys to Raerby* | **Welcome them** (AI 80): opinion modifier `zin_regional_adel_friendship` (+15) both ways; the receiver gets flag `zin_tritons_charter_invited`. **Not now**: nothing |

Adel also receives `zin_gunwaith.5` (*A Charter for the Western Fleet*) and the flavour event `zin_lore.150` (*Charts for Sale*).

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | the_speakers_hall, the_chart_hall, the_pupor_charter, harbour_of_adel |
| 1749–1750 | the_island_assembly, the_chart_masters, new_soundings, charts_for_every_crown, envoys_to_pollos, envoys_to_raerby |
| 1751–1752 | the_great_chart, the_federation_oath, northern_yards, fisheries, the_rope_walks |
| 1753–1754 | charts_for_the_west (once the council sits), galleys_of_adel, the_sea_wardens, the_northern_squadron, elections_of_the_isles |
| 1755 | the_great_war_at_sea, the_charter_stays_neutral |
| 1756–1760 | leftovers; pilots_for_the_living if Adel is the heir's friend |

---

## Pollos

**Tree** `regional_pollos` · 1 state · Light (`zin_light_council`, elections every 48 months) · ruler **Guild-Master Hesos Pol** (proposed, characters spec) · 31 focuses · grid x 0–18, y 0–8.

### Situation in 4A 1748

Pollos is the central trading league of the islands (roster): one state, one harbour and the busiest market of the Pupor Ocean. Its guild-masters elect a Guild-Master; Hesos Pol keeps the ledger now. Every island sells fish, salt, pearls and charts at Pollos, and every crown's factor buys there. Pollos suffers most when corsairs harry the lanes, so it talks more than anyone of a charter to keep them.

### Role

- **Historical path (proposed):** Pollos calls the chart houses together and founds the Pupor Charter (about 4A 1751), sets the Charter's fleet and courts against the corsairs, and sells ships to the West's Ford Council.
- **War of the Last Crowns:** the market stays open and profits from the Crossing; Pollos sells boats for the evacuation.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Pollos tag>_zin_ruler` | Guild-Master Hesos Pol | Country leader, `zin_light_council` | characters spec (proposed) |
| `zin_regional_pollos_marra` | Marra of the Quay | Political advisor, trait `zin_adv_merchant_prince`; recruited by *The Counting Quay* | this spec (proposed) |
| `zin_regional_pollos_teo` | Captain Teo Saltash | Navy leader, skill 2, trait `inshore_fighter`; recruited by *League Captains* | this spec (proposed) |

Start spirit (country history): `the_market_isle`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Guild-Masters | 0–2 | 0–2 | start | Court |
| B. The Market of the Isles | 3–6 | 0–3 | start | Trade |
| C. The Charter Houses | 7–11 | 0–4 | start | Founding the Pupor Charter; piracy |
| D. Factors on the Mainland | 12–14 | 0–2 | start | Trade with Corogon; ships for the West |
| E. Guard of the Quays | 15–17 | 0–2 | start | Navy |
| F. Strangers | 18 | 0–1 | start; second focus hidden | Safe harbour; the southern ship |
| G. The Great War at Sea | 7–11 | 6–8 | `zin_war_of_last_crowns` or `zin_western_crossing` | Profit; the evacuation |

**A. The Guild-Masters.** Icons: `guild_hall`, `ledger_coins`, `charter_free`.

- `the_guild_masters` **The Guild-Masters** (1,0) 70d: political power 75. AI 100.
- `the_market_court` **The Market Court** (0,1) ← the_guild_masters: stability 0.03.
- `hesos_ledger` **Hesos's Ledger** (2,1) ← the_guild_masters: political power 50.
- `the_league_charter` **The League Charter** (1,2) 70d ← the_market_court, hesos_ledger: swap spirit `the_market_isle` → `league_of_the_isles`.

**B. The Market of the Isles.** Icons: `market_stalls`, `fishing_boats`, `coin_chest`.

- `market_of_the_isles` **The Market of the Isles** (4,0): building industrial_complex 1 capital. AI 25.
- `fish_fairs` **Fish Fairs** (3,1) ← market_of_the_isles: political power 25.
- `the_salt_pans_of_pollos` **The Salt Pans** (5,1) ← market_of_the_isles: political power 25.
- `pearl_divers` **Pearl Divers** (3,2) ← fish_fairs: political power 25.
- `buyers_from_every_crown` **Buyers from Every Crown** (4,2) ← fish_fairs, the_salt_pans_of_pollos: spirit `every_crown`.
- `the_counting_quay` **The Counting Quay** (4,3) ← buyers_from_every_crown: recruit `zin_regional_pollos_marra`; political power 25.

**C. The Charter Houses.** Icons: `sea_charts`, `envoy`, `banner_league`, `galley_oars`, `scroll_sealed`.

- `call_the_charter_houses` **Call the Charter Houses** (9,0): side chart; piracy −3. AI 40.
- `invite_adel` **Invite Adel** (8,1) ← call_the_charter_houses: available Adel exists; event `charter_invite` to Adel.
- `invite_raerby` **Invite Raerby** (10,1) ← call_the_charter_houses: available Raerby exists; event `charter_invite` to Raerby.
- ★ `found_the_pupor_charter` **Found the Pupor Charter** (9,2) 70d ← invite_adel, invite_raerby.
- `the_charter_fleet` **The Charter Fleet** (9,3) ← found_the_pupor_charter: piracy −10; spirit `charter_fleet`. AI 30.
- `courts_of_the_charter` **Courts of the Charter** (9,4) ← the_charter_fleet: piracy −5; stability 0.03; event `charter_court`.

**D. Factors on the Mainland.** Icons: `envoy`, `traders_road`, `shipwright_yard`, `olive_branch`.

- `mainland_factors` **Factors on the Mainland** (13,0): political power 25.
- `the_corogon_route` **The Corogon Route** (12,1) ← mainland_factors: available Corogon exists; political power 25; tooltip "Corogon's ships take our fish south."
- `ships_for_sale` **Ships for Sale** (14,1) ← mainland_factors: available `zin_west_council`; fleet +3; political power 50. AI 30; hist ×2.
- `the_sunward_route` **The Sunward Route** (12,2) ← the_corogon_route: political power 25; stability 0.02.
- `the_neutral_market` **The Neutral Market** (13,2) 70d ← the_corogon_route, ships_for_sale: spirit `neutral_market`.

**E. Guard of the Quays.** Icons: `levy_muster`, `galley_oars`, `fort_wall`, `warship_sail`.

- `quay_guard` **The Quay Guard** (16,0): manpower 300.
- `market_galleys` **Market Galleys** (15,1) ← quay_guard: building dockyard 1 random_coastal; research {zin_cat_galleys} 0.5×1.
- `the_harbour_chain` **The Harbour Chain** (17,1) ← quay_guard: building coastal_bunker 1 random_coastal.
- `league_captains` **League Captains** (16,2) ← market_galleys, the_harbour_chain: navy experience 10; recruit `zin_regional_pollos_teo`.

**F. Strangers.** Icons: `harbour_lake`, `ship_voyage`.

- `every_sail_welcome` **Every Sail Welcome** (18,0): safe harbour; stability 0.02. AI 10; hist ×0.
- `news_from_the_south` **News from the South** (18,1) ← every_sail_welcome: `allow_branch` `check zin_tritons_ship_has_sailed`; renown +1; regard +5. AI 20.

**G. The Great War at Sea.** Icons: `storm_sea`, `coin_chest`, `anchor_rope`.

- `the_great_war_at_sea` **The Great War at Sea** (9,6): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `the_market_stays_open` **The Market Stays Open** (8,7) ← the_great_war_at_sea: spirit `open_market_in_war`. AI 50; hist ×10.
- `profit_from_the_crossing` **Profit from the Crossing** (10,7) ← the_great_war_at_sea: available `zin_western_crossing`; political power 100; fleet +3. AI 30.
- `ships_for_the_evacuation` **Ships for the Evacuation** (9,8) ← the_market_stays_open, profit_from_the_crossing: available `zin_west_evacuation`, not `zin_west_evacuated`; fleet +5. AI 60.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `found_the_pupor_charter` | Found the Pupor Charter | invite_adel, invite_raerby | Available: not in a faction; no global flag `zin_tritons_charter_founded`. `call zin_tritons_found_charter` (Pollos leads; every island with `zin_tritons_charter_invited` joins). AI 40; hist ×3 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `the_market_isle` | The Market Isle | `trade_opinion_factor` 0.10, `consumer_goods_factor` −0.02 | Start (history); swapped by *The League Charter* |
| `league_of_the_isles` | League of the Isles | `political_power_gain` 0.10, `trade_opinion_factor` 0.10 | *The League Charter* |
| `every_crown` | Buyers from Every Crown | `trade_opinion_factor` 0.15 | *Buyers from Every Crown* |
| `charter_fleet` | The Charter Fleet | `navy_org_factor` 0.05, `convoy_escort_efficiency` 0.10 | *The Charter Fleet* |
| `neutral_market` | The Neutral Market | `political_power_gain` 0.05, `trade_opinion_factor` 0.10 | *The Neutral Market* |
| `open_market_in_war` | The Market Stays Open | `consumer_goods_factor` −0.02, `stability_factor` 0.03 | *The Market Stays Open* |

### Events (namespace `zin_regional_pollos`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `charter_invite` | An Invitation to the Pupor Charter | Adel or Raerby | *Invite Adel*, *Invite Raerby* | **Accept** (AI 70; ×0 for a corsair haven): flag `zin_tritons_charter_invited`; if the Charter exists: `zin_tritons_join_charter`. **Decline**: nothing |
| 2 | `charter_court` | The Charter Court Sits | Pollos | *Courts of the Charter* | **Hang the corsairs** (AI 60): piracy −2. **Fine them**: political power 50 |

Corogon's `zin_regional_corogon.4` (*The Island Routes*) also reaches Pollos.

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | the_guild_masters, market_of_the_isles, call_the_charter_houses, mainland_factors |
| 1749–1750 | invite_adel, invite_raerby, fish_fairs, the_salt_pans_of_pollos, the_market_court, hesos_ledger |
| 1751 | found_the_pupor_charter, the_league_charter |
| 1752–1754 | the_charter_fleet, courts_of_the_charter, buyers_from_every_crown, the_corogon_route, ships_for_sale, quay_guard |
| 1755 | the_great_war_at_sea, the_market_stays_open, profit_from_the_crossing |
| 1756–1757 | ships_for_the_evacuation |

---

## Raerby

**Tree** `regional_raerby` · 1 state · Light (`zin_light_council`, elections every 48 months) · ruler **Captain-Speaker Lemo Raer** (proposed, characters spec) · 31 focuses · grid x 0–17, y 0–7.

### Situation in 4A 1748

Raerby is the eastern seafaring isle and the broker between the islands (roster). Its council of captains elects a Captain-Speaker; Lemo Raer holds the wheel. When two islands quarrel over a bank, a wreck or a debt, they send for Raerby's arbiters, and when the islands speak to a mainland court, a Raerby captain usually carries the letter. Raerby's own trade is small; its standing is large.

### Role

- **Historical path (proposed):** Raerby offers to judge the Southern Banks; the Seite Isles ask for its judgment and Nondondor accepts it, and the banks accord follows (about 4A 1751–1752). Raerby joins the Pupor Charter and keeps the peace of the Pupor.
- **War of the Last Crowns:** brokers of peace; envoys to the heir when he returns.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Raerby tag>_zin_ruler` | Captain-Speaker Lemo Raer | Country leader, `zin_light_council` | characters spec (proposed) |
| `zin_regional_raerby_osk` | Arbiter Osk Faran | Political advisor, trait `zin_adv_envoy`; recruited by *Arbiters at Sea* | this spec (proposed) |
| `zin_regional_raerby_ilka` | Captain Ilka Raer | Navy leader, skill 3, trait `blue_water_expert`; recruited by *The Broker Fleet* | this spec (proposed) |

Start spirit (country history): `broker_captains`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Captains' Council | 0–2 | 0–2 | start | Court; elections |
| B. Brokers of the Isles | 3–6 | 0–3 | start | Arbitration; the banks; piracy |
| C. Envoys to the Mainland | 7–10 | 0–3 | start | Diplomacy |
| D. The Raerby Fleet | 11–13 | 0–3 | start | Navy; corsair hunters |
| E. Harbour of Raerby | 14–16 | 0–2 | start | Economy |
| F. Strangers | 17 | 0–1 | start; second focus hidden | Safe harbour; the southern ship |
| G. The Great War at Sea | 7–10 | 5–7 | `zin_war_of_last_crowns` or `zin_western_crossing` | Peace brokers; envoys to the heir |

**A. The Captains' Council.** Icons: `council_table`, `compass_rose`, `ship_voyage`.

- `captains_council` **The Captains' Council** (1,0) 70d: political power 75. AI 100.
- `the_speakers_wheel` **The Speaker's Wheel** (0,1) ← captains_council: stability 0.03.
- `the_old_captains` **The Old Captains** (2,1) ← captains_council: political power 25.
- `raers_compass` **Raer's Compass** (1,2) 70d ← the_speakers_wheel, the_old_captains: swap spirit `broker_captains` → `compass_of_raer`.
- `the_council_elects` **The Council Elects** (2,2) ← the_old_captains: event `raerby_vote`.

**B. Brokers of the Isles.** Icons: `scroll_treaty`, `handshake_oath`, `olive_branch`, `fishing_boats`.

- `brokers_of_the_isles` **Brokers of the Isles** (4,0): political power 25; side chart. AI 30.
- `arbiters_at_sea` **Arbiters at Sea** (3,1) ← brokers_of_the_isles: piracy −3; spirit `arbiters`; recruit `zin_regional_raerby_osk`.
- ★ `the_banks_dispute` **The Banks Dispute** (5,1) ← brokers_of_the_isles.
- `fishing_rights_registry` **A Registry of Fishing Rights** (3,2) ← arbiters_at_sea: stability 0.03; piracy −2.
- `the_moot_of_captains` **The Moot of Captains** (4,2) ← arbiters_at_sea, the_banks_dispute: stability 0.03; political power 25.
- `peace_of_the_pupor` **The Peace of the Pupor** (4,3) 70d ← the_moot_of_captains: piracy −10; spirit `peace_of_the_pupor`. AI 20.

**C. Envoys to the Mainland.** Icons: `envoy`, `crown_gold`, `seal_wax`.

- `envoys_to_the_mainland` **Envoys to the Mainland** (8,0): political power 25.
- `the_western_courts` **The Western Courts** (7,1) ← envoys_to_the_mainland: political power 25; tooltip "Raerby's captains carry letters for every court of the western shore."
- `a_word_for_parim` **A Word for Parim** (9,1) ← envoys_to_the_mainland: event `isles_envoy` to the Aenor realm that holds Parim.
- `brokers_of_charters` **Brokers of Charters** (8,2) ← the_western_courts, a_word_for_parim: spirit `brokers_of_charters`; if the Pupor Charter exists: `call zin_tritons_join_charter`.
- `the_brokers_seal` **The Brokers' Seal** (8,3) 70d ← brokers_of_charters: political power 50; stability 0.03.

**D. The Raerby Fleet.** Icons: `shipwright_yard`, `galley_oars`, `warship_sail`, `corsair_raider`.

- `raerby_yards` **The Raerby Yards** (12,0): building dockyard 1 random_coastal. AI 20.
- `fast_hulls` **Fast Hulls** (11,1) ← raerby_yards: research {zin_cat_galleys} 0.5×1.
- `the_broker_fleet` **The Broker Fleet** (13,1) ← raerby_yards: recruit `zin_regional_raerby_ilka`; navy experience 10.
- `the_long_patrol` **The Long Patrol** (12,2) 70d ← fast_hulls, the_broker_fleet: spirit `long_patrol`.
- `corsair_hunters` **Corsair Hunters** (12,3) ← the_long_patrol: piracy −5; navy experience 10.

**E. Harbour of Raerby.** Icons: `harbour_lake`, `workshop_tools`, `coin_chest`, `granary`.

- `harbour_of_raerby` **The Harbour of Raerby** (15,0): building naval_base 1 random_coastal. AI 20.
- `rope_and_sail` **Rope and Sail** (14,1) ← harbour_of_raerby: building industrial_complex 1 capital.
- `the_exchange` **The Exchange** (16,1) ← harbour_of_raerby: political power 50.
- `raerby_stores` **Raerby's Stores** (15,2) ← rope_and_sail, the_exchange: stability 0.03.

**F. Strangers.** Icons: `harbour_lake`, `ship_voyage`.

- `every_sail_welcome` **Every Sail Welcome** (17,0): safe harbour; stability 0.02. AI 10; hist ×0.
- `a_southern_ship` **A Southern Ship** (17,1) ← every_sail_welcome: `allow_branch` `check zin_tritons_ship_has_sailed`; renown +1; regard +5. AI 20.

**G. The Great War at Sea.** Icons: `storm_sea`, `olive_branch`, `envoy`.

- `the_great_war_at_sea` **The Great War at Sea** (8,5): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `brokers_of_peace` **Brokers of Peace** (7,6) ← the_great_war_at_sea: spirit `brokers_of_peace`. AI 50; hist ×10.
- `ships_for_the_crossing` **Ships for the Crossing** (9,6) ← the_great_war_at_sea: available `zin_western_crossing`; fleet +3; political power 50. AI 20; hist ×0.5.
- `envoys_to_the_heir` **Envoys to the Heir** (8,7) ← brokers_of_peace, ships_for_the_crossing: available `zin_eindil_returned`; regard +10; if friend: join coalition. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `the_banks_dispute` | The Banks Dispute | brokers_of_the_isles | Available: Nondondor and the Seite Islands exist; no global flag `zin_tritons_banks_accord`. `call zin_tritons_offer_banks_mediation` (Raerby is the mediator; events to both sides). AI 30; hist ×3 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `broker_captains` | Brokers Between the Islands | `opinion_gain_monthly_factor` 0.10, `trade_opinion_factor` 0.05 | Start (history); swapped by *Raer's Compass* |
| `compass_of_raer` | Raer's Compass | `political_power_gain` 0.10, `stability_factor` 0.05, `opinion_gain_monthly_factor` 0.10 | *Raer's Compass* |
| `arbiters` | Arbiters at Sea | `opinion_gain_monthly_factor` 0.10 | *Arbiters at Sea* |
| `peace_of_the_pupor` | The Peace of the Pupor | `stability_factor` 0.05, `trade_opinion_factor` 0.10 | *The Peace of the Pupor* |
| `brokers_of_charters` | Brokers of Charters | `trade_opinion_factor` 0.10, `political_power_gain` 0.05 | *Brokers of Charters* |
| `long_patrol` | The Long Patrol | `navy_org_factor` 0.05, `naval_speed_factor` 0.05 | *The Long Patrol* |
| `brokers_of_peace` | Brokers of Peace | `stability_factor` 0.05, `war_support_factor` −0.05 | *Brokers of Peace* |

### Events (namespace `zin_regional_raerby`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `raerby_vote` | The Captains Vote | Raerby | *The Council Elects* | **The old captains** (AI 60): political power 50. **The young captains**: navy experience 10 |
| 2 | `isles_envoy` | Envoys from the Isles | Aenor realm | *A Word for Parim* | **Receive them** (AI 70): opinion +15 both ways. **Ignore them**: nothing |

The mediation itself uses the shared event `zin_shared_tritons_islands.3`. The Seite Islands' `zin_regional_seite_islands.1` and Corogon's `zin_regional_corogon.3` also reach Raerby.

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | captains_council, brokers_of_the_isles, envoys_to_the_mainland, harbour_of_raerby |
| 1749–1750 | arbiters_at_sea, the_banks_dispute, the_speakers_wheel, the_old_captains, the_western_courts, a_word_for_parim |
| 1751–1752 | fishing_rights_registry, the_moot_of_captains, brokers_of_charters, raers_compass, raerby_yards |
| 1753–1754 | peace_of_the_pupor, the_brokers_seal, fast_hulls, the_broker_fleet, the_long_patrol |
| 1755 | the_great_war_at_sea, brokers_of_peace |
| 1756–1760 | corsair_hunters, envoys_to_the_heir on `zin_eindil_returned` |

---

## Nondondor

**Tree** `regional_nondondor` · 1 state · Wild (`zin_wild_clans`) · ruler **King Benan of Nondondor** (proposed, characters spec) · 32 focuses · grid x 0–17, y 0–7.

### Situation in 4A 1748

Nondondor is the southern island kingdom with a contested naval frontier (roster). King Benan keeps royal galleys and calls the fishing banks south of his island his own; the Seite Isles fish the same banks and say the same (proposed: the Southern Banks). Boats are boarded and nets are cut, but nobody has drawn a sword. Some of Nondondor's captains also sail as corsairs when trade is lean, and the king has not yet decided whether to hang them or license them.

### Role

- **Historical path (proposed):** Nondondor presses its claim to the banks in 4A 1749; the Seite Isles refuse; Raerby's mediation is accepted and the banks accord follows (about 4A 1751–1752). The king hangs the corsairs and joins the Pupor Charter.
- **War of the Last Crowns:** the banks stay quiet; the royal galleys are for hire to the Crossing only in play.
- **Alternatives:** share the banks from the start; license corsairs (piracy up); or, late and gated, take the banks by right and by force.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Nondondor tag>_zin_ruler` | King Benan of Nondondor | Country leader, `zin_wild_clans` | characters spec (proposed) |
| `zin_regional_nondondor_saric` | Admiral Saric Benan | Navy leader, skill 3, traits `seawolf`, `inshore_fighter`; recruited by *The Royal Fleet* | this spec (proposed) |

Start spirit (country history): `the_contested_banks`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. King Benan's Hall | 0–2 | 0–2 | start | Court |
| B. The Southern Banks | 3–6 | 0–5 | start; exclusive; war half gated | The banks: press, share, accord, or claim |
| C. The Corsair Question | 7–10 | 0–2 | start; exclusive | Corsair haven or chart house |
| D. The Royal Galleys | 11–13 | 0–2 | start | Navy |
| E. The Harbour Town | 14–16 | 0–2 | start | Economy |
| F. The Great War at Sea | 7–10 | 5–7 | `zin_war_of_last_crowns` or `zin_western_crossing` | Late |
| G. Strangers | 17 | 0 | start | Safe harbour |

**A. King Benan's Hall.** Icons: `crown_iron`, `galley_oars`, `council_table`.

- `king_benans_hall` **King Benan's Hall** (1,0) 70d: political power 75. AI 100.
- `the_royal_galleys` **The Royal Galleys** (0,1) ← king_benans_hall: research {zin_cat_galleys} 0.5×1.
- `the_island_clans` **The Island Clans** (2,1) ← king_benans_hall: stability 0.03.
- `the_crown_of_the_banks` **The Crown of the Banks** (1,2) 70d ← the_royal_galleys, the_island_clans: spirit `crown_of_the_banks`.

**B. The Southern Banks.** Icons: `fishing_boats`, `galley_oars`, `scroll_treaty`, `war_council_map`.

- `the_southern_banks` **The Southern Banks** (4,0): political power 25. AI 30.
- `patrol_the_banks` **Patrol the Banks** (3,1) ← the_southern_banks: navy experience 5; piracy −2.
- `fishers_of_the_banks` **Fishers of the Banks** (5,1) ← the_southern_banks: political power 25; spirit `banks_fishers`.
- ★ `press_the_banks` **Press Our Claim to the Banks** (3,2) ← patrol_the_banks, fishers_of_the_banks; exclusive with share_the_banks.
- ★ `share_the_banks` **Share the Banks** (5,2) ← patrol_the_banks, fishers_of_the_banks; exclusive with press_the_banks.
- `banks_war_galleys` **Galleys on the Banks** (3,3) ← press_the_banks: spirit `banks_galleys`.
- `the_banks_accord_kept` **The Banks Accord** (5,3) ← share_the_banks, press_the_banks: available global flag `zin_tritons_banks_accord`; stability 0.05; piracy −2.
- ★ `the_banks_by_right` **The Banks by Right** (3,4) ← banks_war_galleys.
- `fishing_rights_charter` **A Charter of Fishing Rights** (5,4) ← the_banks_accord_kept: spirit `fishing_rights`.
- ★ `the_banks_by_force` **The Banks by Force** (3,5) ← the_banks_by_right.

**C. The Corsair Question.** Icons: `corsair_raider`, `scroll_sealed`, `banner_league`.

- `the_corsair_coves` **The Corsair Coves** (8,0): political power 25. AI 20.
- ★ `corsair_letters` **Letters for the Corsairs** (7,1) ← the_corsair_coves; exclusive with hang_the_corsairs.
- ★ `hang_the_corsairs` **Hang the Corsairs** (9,1) ← the_corsair_coves; exclusive with corsair_letters.
- `corsair_kings` **Corsair Kings** (7,2) 70d ← corsair_letters: piracy +10; spirit `corsair_kings_spirit`.
- `the_royal_peace_at_sea` **The King's Peace at Sea** (9,2) ← hang_the_corsairs: side chart; if the Pupor Charter exists: `call zin_tritons_join_charter`, else flag `zin_tritons_charter_invited`; political power 25.

**D. The Royal Galleys.** Icons: `shipwright_yard`, `warship_sail`, `galley_oars`.

- `galley_yards` **The Galley Yards** (12,0): building dockyard 1 random_coastal. AI 20.
- `the_royal_fleet` **The Royal Fleet** (11,1) ← galley_yards: recruit `zin_regional_nondondor_saric`; navy experience 10.
- `the_rams` **The Rams** (13,1) ← galley_yards: research {zin_cat_galleys} 0.5×1.
- `the_southern_squadron` **The Southern Squadron** (12,2) 70d ← the_royal_fleet, the_rams: spirit `southern_squadron`.

**E. The Harbour Town.** Icons: `harbour_lake`, `fishing_boats`, `market_stalls`, `granary`.

- `the_harbour_town` **The Harbour Town** (15,0): building naval_base 1 random_coastal. AI 20.
- `salt_fish` **Salt Fish** (14,1) ← the_harbour_town: political power 25.
- `the_kings_market` **The King's Market** (16,1) ← the_harbour_town: building industrial_complex 1 capital.
- `royal_stores` **Royal Stores** (15,2) ← salt_fish, the_kings_market: stability 0.03.

**F. The Great War at Sea.** Icons: `storm_sea`, `galley_oars`, `lone_sword`.

- `the_great_war_at_sea` **The Great War at Sea** (8,5): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `the_banks_stay_quiet` **The Banks Stay Quiet** (7,6) ← the_great_war_at_sea: spirit `banks_quiet`. AI 50; hist ×10.
- `galleys_for_hire` **Galleys for Hire** (9,6) ← the_great_war_at_sea: available `zin_western_crossing`; fleet +3; political power 50. AI 20; hist ×0.
- `the_kings_galleys_for_the_living` **The King's Galleys for the Living** (8,7) ← the_banks_stay_quiet, galleys_for_hire: available `zin_eindil_returned`, friend; join coalition. AI 100.

**G. Strangers.**

- `harbour_for_strangers` **A Harbour for Strangers** (17,0): safe harbour; stability 0.02. Icon `harbour_lake`. AI 10; hist ×0.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `press_the_banks` | Press Our Claim to the Banks | patrol_the_banks, fishers_of_the_banks | Exclusive with share_the_banks. Available: the Seite Islands exist. Event `banks_claimed` to the Seite Islands. AI 30; hist ×3 |
| `share_the_banks` | Share the Banks | patrol_the_banks, fishers_of_the_banks | Exclusive. Available: the Seite Islands exist. Event `banks_shared` to the Seite Islands. AI 30; hist ×0.3 |
| `the_banks_by_right` | The Banks by Right | banks_war_galleys | Available: the Seite Islands exist; no `zin_tritons_banks_accord`; `variable zin_gathering_dark above 39` or `zin_war_of_last_crowns`; not at war. `claims_on` the Seite Islands. AI 10; hist ×0 |
| `the_banks_by_force` | The Banks by Force | the_banks_by_right | Available: as above with `zin_gathering_dark` above 49; the Seite Islands not in a faction. `wargoal` the Seite Islands `puppet_wargoal_focus`. AI 5; hist ×0 |
| `corsair_letters` | Letters for the Corsairs | the_corsair_coves | Exclusive with hang_the_corsairs. Side haven; piracy +10. AI 15; hist ×0 |
| `hang_the_corsairs` | Hang the Corsairs | the_corsair_coves | Exclusive. Piracy −10; stability 0.03. AI 30; hist ×3 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `the_contested_banks` | The Contested Banks | `naval_detection` 0.05, `war_support_factor` 0.03 | Start (history); removed by `zin_tritons_make_banks_accord` |
| `crown_of_the_banks` | The Crown of the Banks | `political_power_gain` 0.10, `stability_factor` 0.05 | *The Crown of the Banks* |
| `banks_fishers` | Fishers of the Banks | `consumer_goods_factor` −0.02 | *Fishers of the Banks* |
| `banks_galleys` | Galleys on the Banks | `navy_screen_attack_factor` 0.05, `naval_speed_factor` 0.03 | *Galleys on the Banks* |
| `fishing_rights` | A Charter of Fishing Rights | `stability_factor` 0.03, `consumer_goods_factor` −0.02 | *A Charter of Fishing Rights* |
| `corsair_kings_spirit` | Corsair Kings | `convoy_raiding_efficiency_factor` 0.15, `navy_submarine_attack_factor` 0.10 | *Corsair Kings* |
| `southern_squadron` | The Southern Squadron | `navy_org_factor` 0.05, `navy_screen_attack_factor` 0.05 | *The Southern Squadron* |
| `banks_quiet` | The Banks Stay Quiet | `stability_factor` 0.05, `war_support_factor` −0.05 | *The Banks Stay Quiet* |

### Events (namespace `zin_regional_nondondor`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `banks_claimed` | Nondondor Claims the Southern Banks | Seite Islands | *Press Our Claim to the Banks* | **Yield the banks** (AI 20): Nondondor political power +50; Seite stability −0.03; global flag `zin_tritons_banks_yielded`. **Our fathers fished there** (AI 80; hist): opinion modifier `zin_tritons_banks_quarrel` both ways |
| 2 | `banks_shared` | Nondondor Offers to Share the Banks | Seite Islands | *Share the Banks* | **Share them** (AI 70): `zin_tritons_make_banks_accord`. **We trust no king**: nothing |

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | king_benans_hall, the_southern_banks, the_corsair_coves, galley_yards |
| 1749 | patrol_the_banks, fishers_of_the_banks, press_the_banks, the_royal_galleys |
| 1750 | hang_the_corsairs, banks_war_galleys, the_island_clans, the_harbour_town |
| 1751–1752 | the_royal_peace_at_sea, the_banks_accord_kept (after Raerby's mediation), the_crown_of_the_banks, the_royal_fleet |
| 1753–1754 | the_rams, the_southern_squadron, salt_fish, the_kings_market |
| 1755 | the_great_war_at_sea, the_banks_stay_quiet |
| 1756–1760 | royal_stores, leftovers |

The AI never takes `share_the_banks`, `the_banks_by_right`, `the_banks_by_force`, `corsair_letters` or `galleys_for_hire` on the historical path.

---

## Halenor

**Tree** `regional_halenor` · 4 states · Wild (`zin_wild_clans`) · ruler **Sea-Lord Orvak Halen** (proposed by this spec) · 33 focuses · grid x 0–19, y 0–7.

### Situation in 4A 1748

Halenor is the largest of the island realms: four isles where the Pupor's storms break (proposed: the Storm Isles), with more men than any other island. Its sea-lords meet under Orvak Halen and live by the wreck-right: what the storm throws on their shores is theirs (proposed). Their pilots know the storm-lanes better than anyone, and their grandfathers were wreckers who lit false lights. Halenor is at peace and has not decided which of those trades it will keep.

### Role

- **Historical path (proposed):** Halenor turns its storm-wisdom to piloting, hires its pilots to the West's fleet, and stays apart from the great war.
- **War of the Last Crowns:** apart. Alternatives: pilots for the Crossing (play).
- **Alternatives:** the wreckers' road (corsair haven, piracy up), or first of the isles (protection offered to the small isles; late and gated, a war goal on one of them).

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Halenor tag>_zin_ruler` | Sea-Lord Orvak Halen | Country leader, `zin_wild_clans` | this spec (proposed; the characters spec names no ruler) |
| `zin_regional_halenor_gull` | Old Gull, Keeper of the Wreck-Right | Political advisor, trait `zin_adv_elder`; recruited by *Orvak's Oath* | this spec (proposed) |
| `zin_regional_halenor_rhea` | Rhea Stormwake | Navy leader, skill 3, traits `seawolf`, `blue_water_expert`; recruited by *The Storm Fleet* | this spec (proposed) |

Start spirit (country history): `wreck_right`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Sea-Lords' Hall | 0–2 | 0–2 | start | Court |
| B. The Wreck-Right | 3–6 | 0–3 | start; exclusive | Wreckers (haven) or pilots (chart house) |
| C. First of the Isles | 7–10 | 0–2 | start; war focus gated | Protection of the small isles |
| D. The Storm Fleet | 11–13 | 0–3 | start | Navy |
| E. The Isles' Wealth | 14–16 | 0–2 | start | Economy |
| F. The Isle Levy | 17–19 | 0–2 | start | Army |
| G. The Great War at Sea | 7–10 | 5–7 | `zin_war_of_last_crowns` or `zin_western_crossing` | Late |

**A. The Sea-Lords' Hall.** Icons: `council_table`, `storm_sea`, `crown_iron`.

- `sea_lords_hall` **The Sea-Lords' Hall** (1,0) 70d: political power 75. AI 100.
- `the_four_isles` **The Four Isles** (0,1) ← sea_lords_hall: stability 0.03.
- `orvaks_oath` **Orvak's Oath** (2,1) ← sea_lords_hall: recruit `zin_regional_halenor_gull`; political power 25.
- `the_storm_crown` **The Storm Crown** (1,2) 70d ← the_four_isles, orvaks_oath: spirit `storm_crown`.

**B. The Wreck-Right.** Icons: `shipwreck`, `lighthouse`, `corsair_raider`, `compass_rose`.

- `the_wreck_right` **The Wreck-Right** (4,0): political power 25. AI 30.
- ★ `wreckers_of_the_storm_isles` **Wreckers of the Storm Isles** (3,1) ← the_wreck_right; exclusive with pilots_of_the_storms.
- ★ `pilots_of_the_storms` **Pilots of the Storms** (5,1) ← the_wreck_right; exclusive with wreckers_of_the_storm_isles.
- `false_lights` **False Lights** (3,2) ← wreckers_of_the_storm_isles: piracy +5; political power 50.
- `pilots_for_hire` **Pilots for Hire** (5,2) ← pilots_of_the_storms: political power 50.
- `the_corsair_harbours` **The Corsair Harbours** (3,3) 70d ← false_lights: spirit `corsair_harbours`.
- `pilots_for_the_west` **Pilots for the West** (5,3) ← pilots_for_hire: available `zin_west_council`; fleet +3; political power 25. AI 30; hist ×2.

**C. First of the Isles.** Icons: `banner_league`, `envoy`, `crown_iron`, `war_council_map`.

- `first_of_the_isles` **First of the Isles** (8,0): political power 25. AI 20.
- ★ `envoys_to_the_lesser_isles` **Envoys to the Lesser Isles** (7,1) ← first_of_the_isles.
- `the_isles_protection` **The Isles' Protector** (9,1) ← first_of_the_isles: available `num_subjects` ≥ 1; spirit `isles_protector`.
- ★ `the_isles_by_the_sword` **The Isles by the Sword** (7,2) ← envoys_to_the_lesser_isles.
- `a_crown_over_the_isles` **A Crown Over the Isles** (8,2) 70d ← envoys_to_the_lesser_isles, the_isles_protection: available `num_subjects` ≥ 3; political power 100; stability 0.05. AI 20.

**D. The Storm Fleet.** Icons: `shipwright_yard`, `galley_oars`, `warship_sail`, `storm_sea`.

- `storm_yards` **The Storm Yards** (12,0): building dockyard 1 random_coastal. AI 20.
- `storm_galleys` **Storm Galleys** (11,1) ← storm_yards: research {zin_cat_galleys} 0.5×1.
- `the_storm_fleet` **The Storm Fleet** (13,1) ← storm_yards: recruit `zin_regional_halenor_rhea`; navy experience 10.
- `ships_that_ride_the_storm` **Ships That Ride the Storm** (12,2) 70d ← storm_galleys, the_storm_fleet: spirit `storm_riders`.
- `island_raiders` **Island Raiders** (12,3) ← ships_that_ride_the_storm: research {zin_cat_warships} 0.5×1.

**E. The Isles' Wealth.** Icons: `harbour_lake`, `shipwreck`, `market_stalls`, `timber_mill`.

- `harbours_of_halenor` **Harbours of Halenor** (15,0): building naval_base 1 random_coastal. AI 20.
- `salvage_yards` **Salvage Yards** (14,1) ← harbours_of_halenor: political power 50.
- `the_storm_markets` **The Storm Markets** (16,1) ← harbours_of_halenor: building industrial_complex 1 capital.
- `rope_tar_and_timber` **Rope, Tar and Timber** (15,2) ← salvage_yards, the_storm_markets: building industrial_complex 1 random_owned.

**F. The Isle Levy.** Icons: `levy_muster`, `sword_shield`, `bow_archers`.

- `the_isle_levy` **The Isle Levy** (18,0): manpower 1,000.
- `sea_soldiers_of_the_storm` **Sea Soldiers of the Storm** (17,1) ← the_isle_levy: spirit `storm_sea_soldiers`.
- `isle_bows` **Bows of the Isles** (19,1) ← the_isle_levy: research {zin_cat_bows} 0.5×1.
- `the_storm_host` **The Storm Host** (18,2) ← sea_soldiers_of_the_storm, isle_bows: army experience 10.

**G. The Great War at Sea.** Icons: `storm_sea`, `compass_rose`, `lone_sword`.

- `the_great_war_at_sea` **The Great War at Sea** (8,5): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `the_storm_isles_apart` **The Storm Isles Keep Apart** (7,6) ← the_great_war_at_sea; exclusive with pilots_for_the_crossing: spirit `storm_isles_apart`. AI 40; hist ×100.
- `pilots_for_the_crossing` **Pilots for the Crossing** (9,6) ← the_great_war_at_sea; exclusive with the_storm_isles_apart: available `zin_western_crossing`, not at war; `call zin_tritons_join_crossing`; fleet +3. AI 10; hist ×0.
- `storm_pilots_for_the_living` **Storm Pilots for the Living** (8,7) ← the_storm_isles_apart, pilots_for_the_crossing: available `zin_eindil_returned`, friend; join coalition. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `wreckers_of_the_storm_isles` | Wreckers of the Storm Isles | the_wreck_right | Exclusive with pilots_of_the_storms. Side haven; piracy +5; spirit `wreckers`. AI 20; hist ×0 |
| `pilots_of_the_storms` | Pilots of the Storms | the_wreck_right | Exclusive. Side chart; piracy −5; spirit `storm_pilots`. AI 30; hist ×5 |
| `envoys_to_the_lesser_isles` | Envoys to the Lesser Isles | first_of_the_isles | `call zin_regional_halenor_offer_protection` (event `protection_offer` to up to three Triton's countries with one state, no overlord and no faction, nearest Halenor's capital first). AI 15; hist ×0 |
| `the_isles_by_the_sword` | The Isles by the Sword | envoys_to_the_lesser_isles | Available: `variable zin_gathering_dark above 39` or `zin_war_of_last_crowns`; not at war. `call zin_regional_halenor_wargoal_isle` (`puppet_wargoal_focus` on the nearest one-state Triton's country with no overlord and no faction). AI 5; hist ×0 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `wreck_right` | The Wreck-Right | `political_power_gain` 0.05, `naval_detection` 0.05 | Start (history); permanent |
| `storm_crown` | The Storm Crown | `political_power_gain` 0.10, `stability_factor` 0.05 | *The Storm Crown* |
| `wreckers` | Wreckers of the Storm Isles | `political_power_gain` 0.05, `convoy_raiding_efficiency_factor` 0.05 | *Wreckers of the Storm Isles* |
| `storm_pilots` | Pilots of the Storms | `navy_max_range_factor` 0.10, `naval_speed_factor` 0.05 | *Pilots of the Storms* |
| `corsair_harbours` | The Corsair Harbours | `convoy_raiding_efficiency_factor` 0.10, `navy_submarine_attack_factor` 0.10 | *The Corsair Harbours* |
| `isles_protector` | The Isles' Protector | `political_power_gain` 0.05, `naval_detection` 0.05 | *The Isles' Protector* |
| `storm_riders` | Ships That Ride the Storm | `navy_org_factor` 0.05, `naval_speed_factor` 0.05 | *Ships That Ride the Storm* |
| `storm_sea_soldiers` | Sea Soldiers of the Storm | `amphibious_invasion` 0.10, `army_morale_factor` 0.03 | *Sea Soldiers of the Storm* |
| `storm_isles_apart` | The Storm Isles Keep Apart | `stability_factor` 0.05, `war_support_factor` −0.05 | *The Storm Isles Keep Apart* |

### Events (namespace `zin_regional_halenor`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `protection_offer` | Halenor Offers Its Protection | a small isle | *Envoys to the Lesser Isles* | **Accept the Storm Lords' shield** (AI 20; ×2 at piracy ≥ 60; ×0 for a member of the Pupor Charter): Halenor `puppet`s the isle. **We keep our own freedom**: nothing |

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | sea_lords_hall, the_wreck_right, harbours_of_halenor, the_isle_levy |
| 1749–1750 | pilots_of_the_storms, the_four_isles, orvaks_oath, pilots_for_hire, storm_yards, first_of_the_isles |
| 1751–1752 | the_storm_crown, salvage_yards, the_storm_markets, storm_galleys, the_storm_fleet |
| 1753–1754 | pilots_for_the_west (once the council sits), ships_that_ride_the_storm, rope_tar_and_timber, sea_soldiers_of_the_storm |
| 1755 | the_great_war_at_sea, the_storm_isles_apart |
| 1756–1760 | leftovers |

The AI never takes the wreckers' line, `envoys_to_the_lesser_isles`, `the_isles_by_the_sword` or `pilots_for_the_crossing` on the historical path.

---

## Seite Islands

**Tree** `regional_seite_islands` · 4 states · Wild (`zin_wild_clans`) · ruler **Elder Tamsa of the Seite** (proposed by this spec) · 31 focuses · grid x 0–18, y 0–7.

### Situation in 4A 1748

The Seite Islands are four small isles of fishing clans who meet at a moot stone (proposed). Few people live there, and they have fished the banks south of Nondondor since before any king claimed them (proposed: the Southern Banks). Elder Tamsa speaks for the moot. The Seite Isles have boats, nets and long memories, and no wish to be anyone's subjects.

### Role

- **Historical path (proposed):** the Seite Isles refuse Nondondor's claim to the banks (the quarrel), then ask Raerby to judge; the banks accord follows. They join the Pupor Charter and keep apart from the great war.
- **War of the Last Crowns:** apart. Alternatives: boats for the Crossing (trade), fishers for the living.
- **Alternatives:** defy the king and seek a stronger friend; or shelter corsairs in the free coves.

### Court and characters

| Id | Name | Role | Source |
| --- | --- | --- | --- |
| `<Seite Islands tag>_zin_ruler` | Elder Tamsa of the Seite | Country leader, `zin_wild_clans` | this spec (proposed; the characters spec names no ruler) |
| `zin_regional_seite_islands_brann` | Captain Brann of the Banks | Navy leader, skill 2, trait `inshore_fighter`; recruited by *The Moot's Captain* | this spec (proposed) |

Start spirit (country history): `isle_moot_custom`.

### Tree

| Branch | Columns | Rows | Opens | Drives |
| --- | --- | --- | --- | --- |
| A. The Isle Moot | 0–2 | 0–2 | start | Court |
| B. Our Fathers' Banks | 3–6 | 0–4 | start; exclusive | Defy the king or seek the brokers |
| C. The Isle Harbours | 7–10 | 0–3 | start | Economy |
| D. The Isle Boats | 11–13 | 0–2 | start | Navy |
| E. Charter or Coves | 14–16 | 0–2 | start; exclusive | Piracy; chart house or haven |
| F. The Great War at Sea | 7–10 | 5–7 | `zin_war_of_last_crowns` or `zin_western_crossing` | Late |
| G. Strangers | 18 | 0 | start | Safe harbour |

**A. The Isle Moot.** Icons: `rune_stone`, `council_table`, `fishing_boats`.

- `the_isle_moot` **The Isle Moot** (1,0) 70d: political power 75. AI 100.
- `elders_of_the_isles` **Elders of the Isles** (0,1) ← the_isle_moot: stability 0.03.
- `the_fishers_voice` **The Fishers' Voice** (2,1) ← the_isle_moot: political power 25.
- `the_moot_stone` **The Moot Stone** (1,2) 70d ← elders_of_the_isles, the_fishers_voice: swap spirit `isle_moot_custom` → `moot_stone`.

**B. Our Fathers' Banks.** Icons: `fishing_boats`, `fort_wall`, `olive_branch`, `handshake_oath`.

- `our_fathers_banks` **Our Fathers' Banks** (4,0): political power 25. AI 30.
- `boats_on_the_banks` **Boats on the Banks** (3,1) ← our_fathers_banks: political power 25.
- `watch_the_kings_galleys` **Watch the King's Galleys** (5,1) ← our_fathers_banks: available Nondondor exists; building coastal_bunker 1 random_coastal.
- ★ `defy_the_king` **Defy the King** (3,2) ← boats_on_the_banks, watch_the_kings_galleys; exclusive with seek_the_brokers.
- ★ `seek_the_brokers` **Seek the Brokers' Judgment** (5,2) ← boats_on_the_banks, watch_the_kings_galleys; exclusive with defy_the_king.
- `the_banks_fleet` **The Banks Fleet** (3,3) ← defy_the_king: spirit `banks_fleet`.
- `the_banks_accord_kept` **The Banks Accord** (5,3) ← seek_the_brokers, defy_the_king: available global flag `zin_tritons_banks_accord`; stability 0.05; piracy −2.
- `call_on_friends` **Call on Friends** (3,4) ← the_banks_fleet: available `variable zin_gathering_dark above 24`; `call zin_regional_seite_islands_ask_guarantee`. AI 20.

**C. The Isle Harbours.** Icons: `harbour_lake`, `fishing_boats`, `shipwright_yard`, `market_stalls`, `granary`.

- `the_isle_harbours` **The Isle Harbours** (8,0): building naval_base 1 random_coastal. AI 20.
- `drying_racks` **Drying Racks** (7,1) ← the_isle_harbours: political power 25.
- `boatwrights` **Boatwrights** (9,1) ← the_isle_harbours: building dockyard 1 random_coastal.
- `the_isle_market` **The Isle Market** (8,2) ← drying_racks, boatwrights: building industrial_complex 1 capital.
- `stores_of_salt_fish` **Stores of Salt Fish** (8,3) ← the_isle_market: stability 0.03.

**D. The Isle Boats.** Icons: `galley_oars`, `fishing_boats`, `compass_rose`.

- `isle_boats` **The Isle Boats** (12,0): research {zin_cat_galleys} 0.5×1. AI 15.
- `the_fishing_fleet_armed` **The Fishing Fleet Armed** (11,1) ← isle_boats: spirit `armed_fishers`.
- `the_moots_captain` **The Moot's Captain** (13,1) ← isle_boats: recruit `zin_regional_seite_islands_brann`; navy experience 5.
- `the_banks_squadron` **The Banks Squadron** (12,2) 70d ← the_fishing_fleet_armed, the_moots_captain: spirit `banks_squadron`.

**E. Charter or Coves.** Icons: `sea_charts`, `corsair_raider`, `banner_league`.

- `the_pupor_question` **The Pupor Question** (15,0): political power 25. AI 30.
- ★ `join_the_charter` **Join the Pupor Charter** (14,1) ← the_pupor_question; exclusive with the_free_coves.
- ★ `the_free_coves` **The Free Coves** (16,1) ← the_pupor_question; exclusive with join_the_charter.
- `charter_watch` **The Charter Watch** (14,2) ← join_the_charter: piracy −2; navy experience 5.
- `cove_raiders` **Cove Raiders** (16,2) ← the_free_coves: piracy +3; political power 50.

**F. The Great War at Sea.** Icons: `storm_sea`, `fishing_boats`, `lone_sword`.

- `the_great_war_at_sea` **The Great War at Sea** (8,5): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `the_isles_keep_apart` **The Isles Keep Apart** (7,6) ← the_great_war_at_sea: spirit `isles_apart`. AI 50; hist ×10.
- `boats_for_the_crossing` **Boats for the Crossing** (9,6) ← the_great_war_at_sea: available `zin_western_crossing`; fleet +2; political power 25. AI 15; hist ×0.5.
- `fishers_for_the_living` **Fishers for the Living** (8,7) ← the_isles_keep_apart, boats_for_the_crossing: available `zin_eindil_returned`, friend; join coalition. AI 100.

**G. Strangers.**

- `harbour_for_strangers` **A Harbour for Strangers** (18,0): safe harbour; stability 0.02. Icon `harbour_lake`. AI 10; hist ×0.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `defy_the_king` | Defy the King | boats_on_the_banks, watch_the_kings_galleys | Exclusive with seek_the_brokers. War support 0.05; if Nondondor exists: opinion modifier `zin_tritons_banks_quarrel` both ways. AI 30; hist ×1 |
| `seek_the_brokers` | Seek the Brokers' Judgment | boats_on_the_banks, watch_the_kings_galleys | Exclusive. Available: Raerby exists; no `zin_tritons_banks_accord`. Flag `zin_tritons_mediation_accepted`; event `seite_petition` to Raerby. AI 30; hist ×3 |
| `join_the_charter` | Join the Pupor Charter | the_pupor_question | Exclusive with the_free_coves. Side chart; piracy −3; if the Charter exists: `call zin_tritons_join_charter`, else flag `zin_tritons_charter_invited`. AI 30; hist ×3 |
| `the_free_coves` | The Free Coves | the_pupor_question | Exclusive. Side haven; piracy +5. AI 10; hist ×0 |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `isle_moot_custom` | The Moot of the Isles | `stability_factor` 0.05, `political_power_gain` −0.05 | Start (history); swapped by *The Moot Stone* |
| `moot_stone` | The Moot Stone | `political_power_gain` 0.05, `stability_factor` 0.05 | *The Moot Stone* |
| `banks_fleet` | The Banks Fleet | `navy_org_factor` 0.05, `naval_detection` 0.05 | *The Banks Fleet* |
| `armed_fishers` | The Fishing Fleet Armed | `naval_detection` 0.05, `navy_screen_defence_factor` 0.05 | *The Fishing Fleet Armed* |
| `banks_squadron` | The Banks Squadron | `navy_org_factor` 0.05 | *The Banks Squadron* |
| `isles_apart` | The Isles Keep Apart | `stability_factor` 0.05, `war_support_factor` −0.05 | *The Isles Keep Apart* |

### Events (namespace `zin_regional_seite_islands`)

| Id | Key | Title | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- |
| 1 | `seite_petition` | The Seite Isles Ask Raerby to Judge the Banks | Raerby | *Seek the Brokers' Judgment* | **Judge the banks** (AI 80): Raerby `call zin_tritons_offer_banks_mediation` (asks Nondondor; the Seite side has already accepted). **Not our quarrel**: nothing |
| 2 | `shield_request` | The Seite Isles Ask for a Shield | the strongest other Triton's navy | *Call on Friends* | **Stand behind them** (AI 40; ×2 for a member of the Pupor Charter): `give_guarantee` the Seite Islands. **Not our quarrel**: nothing |

### Tree-declared effect

`zin_regional_seite_islands_ask_guarantee`: fires `zin_regional_seite_islands.2` (*The Seite Isles Ask for a Shield*) to the Triton's country with the largest navy other than Nondondor and the Seite Islands, not at war with either.

### Historical AI route

| Period | Focuses |
| --- | --- |
| 1748 | the_isle_moot, our_fathers_banks, the_isle_harbours, the_pupor_question |
| 1749 | boats_on_the_banks, watch_the_kings_galleys, elders_of_the_isles, the_fishers_voice (Nondondor's claim refused) |
| 1750 | seek_the_brokers, join_the_charter, drying_racks, boatwrights |
| 1751–1752 | the_banks_accord_kept (after the accord), the_moot_stone, charter_watch, the_isle_market, isle_boats |
| 1753–1754 | stores_of_salt_fish, the_fishing_fleet_armed, the_moots_captain, the_banks_squadron |
| 1755 | the_great_war_at_sea, the_isles_keep_apart |

The AI never takes `defy_the_king`, `the_free_coves` or `call_on_friends` on the historical path.

---

## Implementation

### Files

For each tree `<t>` in `regional_adel`, `regional_pollos`, `regional_raerby`, `regional_nondondor`, `regional_halenor`, `regional_seite_islands`:

| Path | What |
| --- | --- |
| `docs/design/focus/<t>.json` | Tree data, `"tier": "regional"`, `"countries": ["<Name>"]` |
| `common/national_focus/zin_<t>.txt` | Compiled tree |
| `common/ideas/zin_focus_<t>.txt` | Spirits |
| `events/zin_<t>.txt` | Events |
| `common/scripted_effects/zin_<t>.txt`, `common/scripted_triggers/zin_<t>.txt` | Tree-declared effects and triggers |
| `common/opinion_modifiers/zin_<t>.txt` | `zin_regional_adel_friendship` (+15, Adel tree) |
| `localisation/english/zin_focus_<t>_l_english.yml` | All text, including the proposed ruler names of Halenor and the Seite Islands (`zin_name_halenor_ruler`, `zin_name_seite_ruler`) |
| `history/countries/<tag>` (generated) | Start spirit; rulers for Halenor and the Seite Islands; recruited characters |

### Tree-declared scripted effects

| Effect | Tree | Does |
| --- | --- | --- |
| `zin_regional_<name>_recruit` (`character`) | all | Recruits the named proposed character |
| `zin_regional_halenor_offer_protection` | Halenor | Fires `zin_regional_halenor.1` to up to three Triton's countries with one state, no overlord and no faction, nearest Halenor's capital first |
| `zin_regional_halenor_wargoal_isle` | Halenor | `create_wargoal` `puppet_wargoal_focus` on the nearest such country |
| `zin_regional_seite_islands_ask_guarantee` | Seite Islands | As above |

### Shared names used

From the Pupor Ocean system ([shared tree](../shared/shared_tritons_islands.md)): `zin_tritons_add_piracy`, `zin_tritons_set_side`, `zin_tritons_found_charter`, `zin_tritons_join_charter`, `zin_tritons_offer_banks_mediation`, `zin_tritons_make_banks_accord`, `zin_tritons_join_crossing`; triggers `zin_tritons_ship_has_sailed`; flags `zin_tritons_charter_invited`, `zin_tritons_charter_founded`, `zin_tritons_mediation_accepted`, `zin_tritons_banks_accord`, `zin_tritons_banks_yielded`; opinion modifier `zin_tritons_banks_quarrel`; event `zin_shared_tritons_islands.3`. From other specs: `zin_west_add_fleet`, flags `zin_west_council`, `zin_western_crossing`, `zin_west_evacuation`, `zin_west_evacuated`; `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_join_coalition`, `zin_eindil_friend`; journey hook flag `zin_eindil_safe_harbour`; `zin_rules_is_historical`.

### `allow_branch` roots

Each tree's southern-ship focus carries `allow_branch = check zin_tritons_ship_has_sailed`. The journey effect that advances `zin_eindil_stage` to 6 calls `mark_focus_tree_layout_dirty` for every Triton's Islands country (dependency).

### Game rules and defines

None new.

### Icons and pictures

Focus icons from the shared catalog; no new keys. Event pictures: `generic_sea` (most island events), `generic_court` (votes), `generic_peace` (envoys, mediation). All art is image-generated.

## AI

- Weights and "hist" factors are in each section; war roots 200; coalition focuses 100.
- Under the free rule: chart house or haven weighs piracy (haven weight ×2 at piracy ≥ 60, chart house ×2 at piracy ≥ 40); Nondondor's *Press* vs *Share* weighs its opinion of the Seite Islands (press ×2 below 0); Halenor's wreckers vs pilots 30/30, ×2 for wreckers while no Charter exists.
- No island AI ever declares a war on the historical path; under the free rule Nondondor's and Halenor's war focuses keep weights of 5 to 10.

## Acceptance

1. The compiler accepts the six trees: focus counts as tabled (31, 31, 31, 32, 33, 31); unique keys and positions; prerequisites above their focuses; exclusives symmetric; days multiples of 7; no `raw` blocks.
2. The focus inspector reports no errors; each tree renders cleanly.
3. On 1 Thaw 4A 1748: no focus in these trees can create a war goal; no island is a chart house or a haven; no visible focus mentions the southern ship; no text names Afrit or Eindil.
4. Historical observer run: Pollos founds the Pupor Charter by the end of 1752 with at least Adel and Raerby as members; the banks accord is set by the end of 1753; piracy is below 25 by 1755; no island declares a war; every island takes its stand-apart focus within 180 days of the war root opening.
5. Scenario: Nondondor presses the banks and the Seite Islands refuse: the quarrel modifier exists both ways; after both accept Raerby's mediation it is removed and the accord flag is set.
6. Scenario: Halenor at `zin_gathering_dark` 45 under the free rule completes *The Isles by the Sword*: it gains a war goal on one small isle and no other.
7. Every modifier in the spirit tables exists in the game's modifier documentation.

## Open questions

1. **Rulers.** Are Sea-Lord Orvak Halen (Halenor) and Elder Tamsa of the Seite welcome names?
2. **Halenor's storm isles.** Is an isle of wreckers turned pilots a good identity for the largest island realm?
3. **The Seite Isles.** Is a moot of fishing clans right, and is "Seite" read as one people across four isles?
4. **The Southern Banks.** Is the Seite Isles the right rival for Nondondor's contested naval frontier (map adjacency to be confirmed)?
5. **Adel and the charts.** Should Adel, as the chart-makers, also be the home of the island navigators in Lorien's crew?
