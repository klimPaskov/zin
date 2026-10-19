# Triton's Islands regional focus trees

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier B).

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
- **Defaults.** Days 35 unless marked 70d; AI base 10 unless given; no `available` block unless given. Lines read `key` **Name** (x,y) ← prerequisites: effects. "a, b" means a **or** b; every name is a focus key of the same tree; "exclusive with" pairs are listed on both sides. ★ marks a focus whose effects are in its tree's "Key focuses" table. Each tree's `### Icons` table gives every focus its catalog icon (sprite `GFX_focus_zin_<key>`); event pictures are in the events tables (`GFX_zin_evt_<key>`, standard crop).
- **Effects** use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md): "research {cat} 0.5×1" is the `research` effect on a warfare category; "building X 1 random_coastal" is `building` with `where` `random_coastal`; "recruit `id`" is `call zin_regional_<name>_recruit {character: id}`; "event `k` to X" is `event_for`.
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

**A. The Speaker's Hall.**

- `the_speakers_hall` **The Speaker's Hall** (1,0) 70d: political power 75. AI 100.
- `the_island_assembly` **The Island Assembly** (0,1) ← the_speakers_hall: stability 0.03.
- `the_chart_masters` **The Chart-Masters** (2,1) ← the_speakers_hall: recruit `zin_regional_adel_ysmay`; political power 25.
- `the_federation_oath` **The Federation Oath** (1,2) 70d ← the_island_assembly, the_chart_masters: spirit `federation_of_the_north_isles`.
- `elections_of_the_isles` **Elections of the Isles** (2,2) ← the_chart_masters: event `isles_vote`.

**B. The Chart Hall.**

- `the_chart_hall` **The Chart Hall** (5,0): side chart; navy experience 5. AI 30.
- `new_soundings` **New Soundings** (4,1) ← the_chart_hall: research {zin_cat_galleys} 0.5×1.
- `charts_for_every_crown` **Charts for Every Crown** (6,1) ← the_chart_hall: political power 50.
- `the_great_chart` **The Great Chart** (5,2) 70d ← new_soundings, charts_for_every_crown: spirit `great_chart`.
- ★ `charts_for_the_west` **Charts for the West** (4,3) ← the_great_chart; exclusive with charts_kept_close.
- ★ `charts_kept_close` **Charts Kept Close** (6,3) ← the_great_chart; exclusive with charts_for_the_west.

**C. The Pupor Charter.**

- `the_pupor_charter` **The Pupor Charter** (9,0): piracy −3. AI 30.
- `envoys_to_pollos` **Envoys to Pollos** (8,1) ← the_pupor_charter: available Pollos exists; event `adel_envoys` to Pollos.
- `envoys_to_raerby` **Envoys to Raerby** (10,1) ← the_pupor_charter: available Raerby exists; event `adel_envoys` to Raerby.
- ★ `a_charter_of_the_isles` **A Charter of the Isles** (9,2) 70d ← envoys_to_pollos, envoys_to_raerby.
- `charter_patrols_of_adel` **Patrols of the North Isles** (9,3) ← a_charter_of_the_isles: piracy −5; navy experience 5.

**D. Ships of the North Isles.**

- `northern_yards` **The Northern Yards** (13,0): building dockyard 1 random_coastal. AI 20.
- `galleys_of_adel` **Galleys of Adel** (12,1) ← northern_yards: research {zin_cat_galleys} 0.5×1.
- `the_sea_wardens` **The Sea-Wardens** (14,1) ← northern_yards: recruit `zin_regional_adel_edda`; navy experience 10.
- `the_northern_squadron` **The Northern Squadron** (13,2) 70d ← galleys_of_adel, the_sea_wardens: spirit `northern_squadron`.
- `island_marines` **Island Marines** (13,3) ← the_northern_squadron: manpower 500; spirit `adel_marines`.

**E. Harbour of the Isles.**

- `harbour_of_adel` **The Harbour of Adel** (16,0): building naval_base 1 random_coastal. AI 20.
- `fisheries` **The Fisheries** (15,1) ← harbour_of_adel: political power 25.
- `the_rope_walks` **The Rope-Walks** (17,1) ← harbour_of_adel: building industrial_complex 1 capital.
- `stores_and_salt` **Stores and Salt** (16,2) ← fisheries, the_rope_walks: stability 0.03.

**F. Strangers.**

- `a_harbour_for_any_sail` **A Harbour for Any Sail** (18,0): safe harbour; stability 0.02. AI 10; hist ×0.
- `the_southern_ship` **The Southern Ship** (18,1) ← a_harbour_for_any_sail: `allow_branch` `check zin_tritons_ship_has_sailed`; renown +1; regard +5. AI 20.

**G. The Great War at Sea.**

- `the_great_war_at_sea` **The Great War at Sea** (9,5): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `the_charter_stays_neutral` **The Charter Stays Neutral** (8,6) ← the_great_war_at_sea; exclusive with charts_for_the_crossing: spirit `charter_neutral`. AI 40; hist ×100.
- `charts_for_the_crossing` **Charts for the Crossing** (10,6) ← the_great_war_at_sea; exclusive with the_charter_stays_neutral: available `zin_western_crossing`, not at war; `call zin_tritons_join_crossing`; fleet +3. AI 5; hist ×0.
- `pilots_for_the_living` **Pilots for the Living** (9,7) ← the_charter_stays_neutral, charts_for_the_crossing: available `zin_eindil_returned`, friend; join coalition; regard +5. AI 100.

### Icons

Every key is from the [icon catalog](../02_icon_catalog.md) (sprites `GFX_focus_zin_<key>`, `GFX_idea_zin_<key>`). Spirits use the icon of the focus that adds them; the start spirit `chart_hall_pride` uses `sea_charts`.

| Branch | Focus → icon |
| --- | --- |
| A | the_speakers_hall `council_table`; the_island_assembly `banner_plain`; the_chart_masters `sea_charts`; the_federation_oath `handshake_oath`; elections_of_the_isles `seal_wax` |
| B | the_chart_hall `sea_charts`; new_soundings `compass_rose`; charts_for_every_crown `coin_chest`; the_great_chart `map_unrolled`; charts_for_the_west `ship_voyage`; charts_kept_close `scroll_sealed` |
| C | the_pupor_charter `scroll_treaty`; envoys_to_pollos `envoy`; envoys_to_raerby `envoy`; a_charter_of_the_isles `banner_league`; charter_patrols_of_adel `galley_oars` |
| D | northern_yards `shipwright_yard`; galleys_of_adel `galley_oars`; the_sea_wardens `eye_watchful`; the_northern_squadron `warship_sail`; island_marines `levy_muster` |
| E | harbour_of_adel `harbour_lake`; fisheries `fishing_boats`; the_rope_walks `anchor_rope`; stores_and_salt `granary` |
| F | a_harbour_for_any_sail `harbour_lake`; the_southern_ship `ship_voyage` |
| G | the_great_war_at_sea `storm_sea`; the_charter_stays_neutral `olive_branch`; charts_for_the_crossing `sea_charts`; pilots_for_the_living `compass_rose` |

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

| Id | Key | Title | Picture | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `isles_vote` | The North Isles Vote | `generic_court` | Adel | *Elections of the Isles* | **The chart-masters win** (AI 60): political power 50. **The fishers win**: stability 0.03 |
| 2 | `adel_envoys` | Envoys from Adel | `generic_sea` | Pollos or Raerby | *Envoys to Pollos*, *Envoys to Raerby* | **Welcome them** (AI 80): opinion modifier `zin_regional_adel_friendship` (+15) both ways; the receiver gets flag `zin_tritons_charter_invited`. **Not now**: nothing |

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

**A. The Guild-Masters.**

- `the_guild_masters` **The Guild-Masters** (1,0) 70d: political power 75. AI 100.
- `the_market_court` **The Market Court** (0,1) ← the_guild_masters: stability 0.03.
- `hesos_ledger` **Hesos's Ledger** (2,1) ← the_guild_masters: political power 50.
- `the_league_charter` **The League Charter** (1,2) 70d ← the_market_court, hesos_ledger: swap spirit `the_market_isle` → `league_of_the_isles`.

**B. The Market of the Isles.**

- `market_of_the_isles` **The Market of the Isles** (4,0): building industrial_complex 1 capital. AI 25.
- `fish_fairs` **Fish Fairs** (3,1) ← market_of_the_isles: political power 25.
- `the_salt_pans_of_pollos` **The Salt Pans** (5,1) ← market_of_the_isles: political power 25.
- `pearl_divers` **Pearl Divers** (3,2) ← fish_fairs: political power 25.
- `buyers_from_every_crown` **Buyers from Every Crown** (4,2) ← fish_fairs, the_salt_pans_of_pollos: spirit `every_crown`.
- `the_counting_quay` **The Counting Quay** (4,3) ← buyers_from_every_crown: recruit `zin_regional_pollos_marra`; political power 25.

**C. The Charter Houses.**

- `call_the_charter_houses` **Call the Charter Houses** (9,0): side chart; piracy −3. AI 40.
- `invite_adel` **Invite Adel** (8,1) ← call_the_charter_houses: available Adel exists; event `charter_invite` to Adel.
- `invite_raerby` **Invite Raerby** (10,1) ← call_the_charter_houses: available Raerby exists; event `charter_invite` to Raerby.
- ★ `found_the_pupor_charter` **Found the Pupor Charter** (9,2) 70d ← invite_adel, invite_raerby.
- `the_charter_fleet` **The Charter Fleet** (9,3) ← found_the_pupor_charter: piracy −10; spirit `charter_fleet`. AI 30.
- `courts_of_the_charter` **Courts of the Charter** (9,4) ← the_charter_fleet: piracy −5; stability 0.03; event `charter_court`.

**D. Factors on the Mainland.**

- `mainland_factors` **Factors on the Mainland** (13,0): political power 25.
- `the_corogon_route` **The Corogon Route** (12,1) ← mainland_factors: available Corogon exists; political power 25; tooltip "Corogon's ships take our fish south."
- `ships_for_sale` **Ships for Sale** (14,1) ← mainland_factors: available `zin_west_council`; fleet +3; political power 50. AI 30; hist ×2.
- `the_sunward_route` **The Sunward Route** (12,2) ← the_corogon_route: political power 25; stability 0.02.
- `the_neutral_market` **The Neutral Market** (13,2) 70d ← the_corogon_route, ships_for_sale: spirit `neutral_market`.

**E. Guard of the Quays.**

- `quay_guard` **The Quay Guard** (16,0): manpower 300.
- `market_galleys` **Market Galleys** (15,1) ← quay_guard: building dockyard 1 random_coastal; research {zin_cat_galleys} 0.5×1.
- `the_harbour_chain` **The Harbour Chain** (17,1) ← quay_guard: building coastal_bunker 1 random_coastal.
- `league_captains` **League Captains** (16,2) ← market_galleys, the_harbour_chain: navy experience 10; recruit `zin_regional_pollos_teo`.

**F. Strangers.**

- `every_sail_welcome` **Every Sail Welcome** (18,0): safe harbour; stability 0.02. AI 10; hist ×0.
- `news_from_the_south` **News from the South** (18,1) ← every_sail_welcome: `allow_branch` `check zin_tritons_ship_has_sailed`; renown +1; regard +5. AI 20.

**G. The Great War at Sea.**

- `the_great_war_at_sea` **The Great War at Sea** (9,6): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `the_market_stays_open` **The Market Stays Open** (8,7) ← the_great_war_at_sea: spirit `open_market_in_war`. AI 50; hist ×10.
- `profit_from_the_crossing` **Profit from the Crossing** (10,7) ← the_great_war_at_sea: available `zin_western_crossing`; political power 100; fleet +3. AI 30.
- `ships_for_the_evacuation` **Ships for the Evacuation** (9,8) ← the_market_stays_open, profit_from_the_crossing: available `zin_west_evacuation`, not `zin_west_evacuated`; fleet +5. AI 60.

### Icons

Every key is from the [icon catalog](../02_icon_catalog.md) (sprites `GFX_focus_zin_<key>`, `GFX_idea_zin_<key>`). Spirits use the icon of the focus that adds them; the start spirit `the_market_isle` uses `market_stalls`.

| Branch | Focus → icon |
| --- | --- |
| A | the_guild_masters `guild_hall`; the_market_court `seal_royal`; hesos_ledger `ledger_coins`; the_league_charter `alliance_rings` |
| B | market_of_the_isles `market_stalls`; fish_fairs `fishing_boats`; the_salt_pans_of_pollos `granary`; pearl_divers `coin_chest`; buyers_from_every_crown `tribute_chest`; the_counting_quay `ledger_coins` |
| C | call_the_charter_houses `sea_charts`; invite_adel `envoy`; invite_raerby `envoy`; found_the_pupor_charter `banner_league`; the_charter_fleet `galley_oars`; courts_of_the_charter `scroll_sealed` |
| D | mainland_factors `envoy`; the_corogon_route `traders_road`; ships_for_sale `shipwright_yard`; the_sunward_route `ship_voyage`; the_neutral_market `olive_branch` |
| E | quay_guard `levy_muster`; market_galleys `galley_oars`; the_harbour_chain `strait_chain`; league_captains `warship_sail` |
| F | every_sail_welcome `harbour_lake`; news_from_the_south `ship_voyage` |
| G | the_great_war_at_sea `storm_sea`; the_market_stays_open `market_stalls`; profit_from_the_crossing `coin_chest`; ships_for_the_evacuation `anchor_rope` |

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

| Id | Key | Title | Picture | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `charter_invite` | An Invitation to the Pupor Charter | `generic_sea` | Adel or Raerby | *Invite Adel*, *Invite Raerby* | **Accept** (AI 70; ×0 for a corsair haven): flag `zin_tritons_charter_invited`; if the Charter exists: `zin_tritons_join_charter`. **Decline**: nothing |
| 2 | `charter_court` | The Charter Court Sits | `generic_court` | Pollos | *Courts of the Charter* | **Hang the corsairs** (AI 60): piracy −2. **Fine them**: political power 50 |

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

**A. The Captains' Council.**

- `captains_council` **The Captains' Council** (1,0) 70d: political power 75. AI 100.
- `the_speakers_wheel` **The Speaker's Wheel** (0,1) ← captains_council: stability 0.03.
- `the_old_captains` **The Old Captains** (2,1) ← captains_council: political power 25.
- `raers_compass` **Raer's Compass** (1,2) 70d ← the_speakers_wheel, the_old_captains: swap spirit `broker_captains` → `compass_of_raer`.
- `the_council_elects` **The Council Elects** (2,2) ← the_old_captains: event `raerby_vote`.

**B. Brokers of the Isles.**

- `brokers_of_the_isles` **Brokers of the Isles** (4,0): political power 25; side chart. AI 30.
- `arbiters_at_sea` **Arbiters at Sea** (3,1) ← brokers_of_the_isles: piracy −3; spirit `arbiters`; recruit `zin_regional_raerby_osk`.
- ★ `the_banks_dispute` **The Banks Dispute** (5,1) ← brokers_of_the_isles.
- `fishing_rights_registry` **A Registry of Fishing Rights** (3,2) ← arbiters_at_sea: stability 0.03; piracy −2.
- `the_moot_of_captains` **The Moot of Captains** (4,2) ← arbiters_at_sea, the_banks_dispute: stability 0.03; political power 25.
- `peace_of_the_pupor` **The Peace of the Pupor** (4,3) 70d ← the_moot_of_captains: piracy −10; spirit `peace_of_the_pupor_spirit`. AI 20.

**C. Envoys to the Mainland.**

- `envoys_to_the_mainland` **Envoys to the Mainland** (8,0): political power 25.
- `the_western_courts` **The Western Courts** (7,1) ← envoys_to_the_mainland: political power 25; tooltip "Raerby's captains carry letters for every court of the western shore."
- `a_word_for_parim` **A Word for Parim** (9,1) ← envoys_to_the_mainland: `call zin_aenor_event_for_parim {event: isles_envoy}` (the Aenor mechanic's `zin_aenor_event_for_parim` (decision F7): to the Aenor realm that holds Parim).
- `brokers_of_charters` **Brokers of Charters** (8,2) ← the_western_courts, a_word_for_parim: spirit `brokers_of_charters_spirit`; if the Pupor Charter exists: `call zin_tritons_join_charter`.
- `the_brokers_seal` **The Brokers' Seal** (8,3) 70d ← brokers_of_charters: political power 50; stability 0.03.

**D. The Raerby Fleet.**

- `raerby_yards` **The Raerby Yards** (12,0): building dockyard 1 random_coastal. AI 20.
- `fast_hulls` **Fast Hulls** (11,1) ← raerby_yards: research {zin_cat_galleys} 0.5×1.
- `the_broker_fleet` **The Broker Fleet** (13,1) ← raerby_yards: recruit `zin_regional_raerby_ilka`; navy experience 10.
- `the_long_patrol` **The Long Patrol** (12,2) 70d ← fast_hulls, the_broker_fleet: spirit `long_patrol`.
- `corsair_hunters` **Corsair Hunters** (12,3) ← the_long_patrol: piracy −5; navy experience 10.

**E. Harbour of Raerby.**

- `harbour_of_raerby` **The Harbour of Raerby** (15,0): building naval_base 1 random_coastal. AI 20.
- `rope_and_sail` **Rope and Sail** (14,1) ← harbour_of_raerby: building industrial_complex 1 capital.
- `the_exchange` **The Exchange** (16,1) ← harbour_of_raerby: political power 50.
- `raerby_stores` **Raerby's Stores** (15,2) ← rope_and_sail, the_exchange: stability 0.03.

**F. Strangers.**

- `every_sail_welcome` **Every Sail Welcome** (17,0): safe harbour; stability 0.02. AI 10; hist ×0.
- `a_southern_ship` **A Southern Ship** (17,1) ← every_sail_welcome: `allow_branch` `check zin_tritons_ship_has_sailed`; renown +1; regard +5. AI 20.

**G. The Great War at Sea.**

- `the_great_war_at_sea` **The Great War at Sea** (8,5): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `brokers_of_peace` **Brokers of Peace** (7,6) ← the_great_war_at_sea: spirit `brokers_of_peace_spirit`. AI 50; hist ×10.
- `ships_for_the_crossing` **Ships for the Crossing** (9,6) ← the_great_war_at_sea: available `zin_western_crossing`; fleet +3; political power 50. AI 20; hist ×0.5.
- `envoys_to_the_heir` **Envoys to the Heir** (8,7) ← brokers_of_peace, ships_for_the_crossing: available `zin_eindil_returned`; regard +10; if friend: join coalition. AI 100.

### Icons

Every key is from the [icon catalog](../02_icon_catalog.md) (sprites `GFX_focus_zin_<key>`, `GFX_idea_zin_<key>`). Spirits use the icon of the focus that adds them; the start spirit `broker_captains` uses `scroll_treaty`.

| Branch | Focus → icon |
| --- | --- |
| A | captains_council `council_table`; the_speakers_wheel `ship_voyage`; the_old_captains `banner_plain`; raers_compass `compass_rose`; the_council_elects `scroll_sealed` |
| B | brokers_of_the_isles `scroll_treaty`; arbiters_at_sea `handshake_oath`; the_banks_dispute `fishing_boats`; fishing_rights_registry `book_lore`; the_moot_of_captains `council_table`; peace_of_the_pupor `olive_branch` |
| C | envoys_to_the_mainland `envoy`; the_western_courts `crown_iron`; a_word_for_parim `palace_parim`; brokers_of_charters `charter_old`; the_brokers_seal `seal_wax` |
| D | raerby_yards `shipwright_yard`; fast_hulls `galley_oars`; the_broker_fleet `warship_sail`; the_long_patrol `storm_sea`; corsair_hunters `corsair_raider` |
| E | harbour_of_raerby `harbour_lake`; rope_and_sail `workshop_tools`; the_exchange `coin_chest`; raerby_stores `granary` |
| F | every_sail_welcome `harbour_lake`; a_southern_ship `ship_voyage` |
| G | the_great_war_at_sea `storm_sea`; brokers_of_peace `olive_branch`; ships_for_the_crossing `anchor_rope`; envoys_to_the_heir `envoy` |

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
| `peace_of_the_pupor_spirit` | The Peace of the Pupor | `stability_factor` 0.05, `trade_opinion_factor` 0.10 | *The Peace of the Pupor* |
| `brokers_of_charters_spirit` | Brokers of Charters | `trade_opinion_factor` 0.10, `political_power_gain` 0.05 | *Brokers of Charters* |
| `long_patrol` | The Long Patrol | `navy_org_factor` 0.05, `naval_speed_factor` 0.05 | *The Long Patrol* |
| `brokers_of_peace_spirit` | Brokers of Peace | `stability_factor` 0.05, `war_support_factor` −0.05 | *Brokers of Peace* |

### Events (namespace `zin_regional_raerby`)

| Id | Key | Title | Picture | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `raerby_vote` | The Captains Vote | `generic_court` | Raerby | *The Council Elects* | **The old captains** (AI 60): political power 50. **The young captains**: navy experience 10 |
| 2 | `isles_envoy` | Envoys from the Isles | `generic_peace` | Aenor realm | *A Word for Parim* | **Receive them** (AI 70): opinion +15 both ways. **Ignore them**: nothing |

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

**A. King Benan's Hall.**

- `king_benans_hall` **King Benan's Hall** (1,0) 70d: political power 75. AI 100.
- `the_royal_galleys` **The Royal Galleys** (0,1) ← king_benans_hall: research {zin_cat_galleys} 0.5×1.
- `the_island_clans` **The Island Clans** (2,1) ← king_benans_hall: stability 0.03.
- `the_crown_of_the_banks` **The Crown of the Banks** (1,2) 70d ← the_royal_galleys, the_island_clans: spirit `crown_of_the_banks`.

**B. The Southern Banks.**

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

**C. The Corsair Question.**

- `the_corsair_coves` **The Corsair Coves** (8,0): political power 25. AI 20.
- ★ `corsair_letters` **Letters for the Corsairs** (7,1) ← the_corsair_coves; exclusive with hang_the_corsairs.
- ★ `hang_the_corsairs` **Hang the Corsairs** (9,1) ← the_corsair_coves; exclusive with corsair_letters.
- `corsair_kings` **Corsair Kings** (7,2) 70d ← corsair_letters: piracy +10; spirit `corsair_kings_spirit`.
- `the_royal_peace_at_sea` **The King's Peace at Sea** (9,2) ← hang_the_corsairs: side chart; if the Pupor Charter exists: `call zin_tritons_join_charter`, else flag `zin_tritons_charter_invited`; political power 25.

**D. The Royal Galleys.**

- `galley_yards` **The Galley Yards** (12,0): building dockyard 1 random_coastal. AI 20.
- `the_royal_fleet` **The Royal Fleet** (11,1) ← galley_yards: recruit `zin_regional_nondondor_saric`; navy experience 10.
- `the_rams` **The Rams** (13,1) ← galley_yards: research {zin_cat_galleys} 0.5×1.
- `the_southern_squadron` **The Southern Squadron** (12,2) 70d ← the_royal_fleet, the_rams: spirit `southern_squadron`.

**E. The Harbour Town.**

- `the_harbour_town` **The Harbour Town** (15,0): building naval_base 1 random_coastal. AI 20.
- `salt_fish` **Salt Fish** (14,1) ← the_harbour_town: political power 25.
- `the_kings_market` **The King's Market** (16,1) ← the_harbour_town: building industrial_complex 1 capital.
- `royal_stores` **Royal Stores** (15,2) ← salt_fish, the_kings_market: stability 0.03.

**F. The Great War at Sea.**

- `the_great_war_at_sea` **The Great War at Sea** (8,5): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `the_banks_stay_quiet` **The Banks Stay Quiet** (7,6) ← the_great_war_at_sea: spirit `banks_quiet`. AI 50; hist ×10.
- `galleys_for_hire` **Galleys for Hire** (9,6) ← the_great_war_at_sea: available `zin_western_crossing`; fleet +3; political power 50. AI 20; hist ×0.
- `the_kings_galleys_for_the_living` **The King's Galleys for the Living** (8,7) ← the_banks_stay_quiet, galleys_for_hire: available `zin_eindil_returned`, friend; join coalition. AI 100.

**G. Strangers.**

- `harbour_for_strangers` **A Harbour for Strangers** (17,0): safe harbour; stability 0.02. Icon `harbour_lake`. AI 10; hist ×0.

### Icons

Every key is from the [icon catalog](../02_icon_catalog.md) (sprites `GFX_focus_zin_<key>`, `GFX_idea_zin_<key>`). Spirits use the icon of the focus that adds them; the start spirit `the_contested_banks` uses `fishing_boats`.

| Branch | Focus → icon |
| --- | --- |
| A | king_benans_hall `crown_iron`; the_royal_galleys `galley_oars`; the_island_clans `council_table`; the_crown_of_the_banks `sceptre` |
| B | the_southern_banks `fishing_boats`; patrol_the_banks `galley_oars`; fishers_of_the_banks `anchor_rope`; press_the_banks `seal_wax`; share_the_banks `scroll_treaty`; banks_war_galleys `warship_sail`; the_banks_accord_kept `olive_branch`; the_banks_by_right `war_council_map`; fishing_rights_charter `charter_old`; the_banks_by_force `war_drums` |
| C | the_corsair_coves `corsair_raider`; corsair_letters `scroll_sealed`; hang_the_corsairs `sword_shield`; corsair_kings `coin_chest`; the_royal_peace_at_sea `banner_league` |
| D | galley_yards `shipwright_yard`; the_royal_fleet `warship_sail`; the_rams `galley_oars`; the_southern_squadron `great_warship` |
| E | the_harbour_town `harbour_lake`; salt_fish `granary`; the_kings_market `market_stalls`; royal_stores `ledger_coins` |
| F | the_great_war_at_sea `storm_sea`; the_banks_stay_quiet `olive_branch`; galleys_for_hire `coin_chest`; the_kings_galleys_for_the_living `lone_sword` |
| G | harbour_for_strangers `harbour_lake` |

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

| Id | Key | Title | Picture | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `banks_claimed` | Nondondor Claims the Southern Banks | `generic_sea` | Seite Islands | *Press Our Claim to the Banks* | **Yield the banks** (AI 20): Nondondor political power +50; Seite stability −0.03; global flag `zin_tritons_banks_yielded`. **Our fathers fished there** (AI 80; hist): opinion modifier `zin_tritons_banks_quarrel` both ways |
| 2 | `banks_shared` | Nondondor Offers to Share the Banks | `generic_peace` | Seite Islands | *Share the Banks* | **Share them** (AI 70): `zin_tritons_make_banks_accord`. **We trust no king**: nothing |

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

**A. The Sea-Lords' Hall.**

- `sea_lords_hall` **The Sea-Lords' Hall** (1,0) 70d: political power 75. AI 100.
- `the_four_isles` **The Four Isles** (0,1) ← sea_lords_hall: stability 0.03.
- `orvaks_oath` **Orvak's Oath** (2,1) ← sea_lords_hall: recruit `zin_regional_halenor_gull`; political power 25.
- `the_storm_crown` **The Storm Crown** (1,2) 70d ← the_four_isles, orvaks_oath: spirit `storm_crown`.

**B. The Wreck-Right.**

- `the_wreck_right` **The Wreck-Right** (4,0): political power 25. AI 30.
- ★ `wreckers_of_the_storm_isles` **Wreckers of the Storm Isles** (3,1) ← the_wreck_right; exclusive with pilots_of_the_storms.
- ★ `pilots_of_the_storms` **Pilots of the Storms** (5,1) ← the_wreck_right; exclusive with wreckers_of_the_storm_isles.
- `false_lights` **False Lights** (3,2) ← wreckers_of_the_storm_isles: piracy +5; political power 50.
- `pilots_for_hire` **Pilots for Hire** (5,2) ← pilots_of_the_storms: political power 50.
- `the_corsair_harbours` **The Corsair Harbours** (3,3) 70d ← false_lights: spirit `corsair_harbours`.
- `pilots_for_the_west` **Pilots for the West** (5,3) ← pilots_for_hire: available `zin_west_council`; fleet +3; political power 25. AI 30; hist ×2.

**C. First of the Isles.**

- `first_of_the_isles` **First of the Isles** (8,0): political power 25. AI 20.
- ★ `envoys_to_the_lesser_isles` **Envoys to the Lesser Isles** (7,1) ← first_of_the_isles.
- `the_isles_protection` **The Isles' Protector** (9,1) ← first_of_the_isles: available `num_subjects` ≥ 1; spirit `isles_protector`.
- ★ `the_isles_by_the_sword` **The Isles by the Sword** (7,2) ← envoys_to_the_lesser_isles.
- `a_crown_over_the_isles` **A Crown Over the Isles** (8,2) 70d ← envoys_to_the_lesser_isles, the_isles_protection: available `num_subjects` ≥ 3; political power 100; stability 0.05. AI 20.

**D. The Storm Fleet.**

- `storm_yards` **The Storm Yards** (12,0): building dockyard 1 random_coastal. AI 20.
- `storm_galleys` **Storm Galleys** (11,1) ← storm_yards: research {zin_cat_galleys} 0.5×1.
- `the_storm_fleet` **The Storm Fleet** (13,1) ← storm_yards: recruit `zin_regional_halenor_rhea`; navy experience 10.
- `ships_that_ride_the_storm` **Ships That Ride the Storm** (12,2) 70d ← storm_galleys, the_storm_fleet: spirit `storm_riders`.
- `island_raiders` **Island Raiders** (12,3) ← ships_that_ride_the_storm: research {zin_cat_warships} 0.5×1.

**E. The Isles' Wealth.**

- `harbours_of_halenor` **Harbours of Halenor** (15,0): building naval_base 1 random_coastal. AI 20.
- `salvage_yards` **Salvage Yards** (14,1) ← harbours_of_halenor: political power 50.
- `the_storm_markets` **The Storm Markets** (16,1) ← harbours_of_halenor: building industrial_complex 1 capital.
- `rope_tar_and_timber` **Rope, Tar and Timber** (15,2) ← salvage_yards, the_storm_markets: building industrial_complex 1 random_owned.

**F. The Isle Levy.**

- `the_isle_levy` **The Isle Levy** (18,0): manpower 1,000.
- `sea_soldiers_of_the_storm` **Sea Soldiers of the Storm** (17,1) ← the_isle_levy: spirit `storm_sea_soldiers`.
- `isle_bows` **Bows of the Isles** (19,1) ← the_isle_levy: research {zin_cat_bows} 0.5×1.
- `the_storm_host` **The Storm Host** (18,2) ← sea_soldiers_of_the_storm, isle_bows: army experience 10.

**G. The Great War at Sea.**

- `the_great_war_at_sea` **The Great War at Sea** (8,5): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `the_storm_isles_apart` **The Storm Isles Keep Apart** (7,6) ← the_great_war_at_sea; exclusive with pilots_for_the_crossing: spirit `storm_isles_apart`. AI 40; hist ×100.
- `pilots_for_the_crossing` **Pilots for the Crossing** (9,6) ← the_great_war_at_sea; exclusive with the_storm_isles_apart: available `zin_western_crossing`, not at war; `call zin_tritons_join_crossing`; fleet +3. AI 10; hist ×0.
- `storm_pilots_for_the_living` **Storm Pilots for the Living** (8,7) ← the_storm_isles_apart, pilots_for_the_crossing: available `zin_eindil_returned`, friend; join coalition. AI 100.

### Icons

Every key is from the [icon catalog](../02_icon_catalog.md) (sprites `GFX_focus_zin_<key>`, `GFX_idea_zin_<key>`). Spirits use the icon of the focus that adds them; the start spirit `wreck_right` uses `shipwreck`.

| Branch | Focus → icon |
| --- | --- |
| A | sea_lords_hall `council_table`; the_four_isles `map_unrolled`; orvaks_oath `handshake_oath`; the_storm_crown `sceptre` |
| B | the_wreck_right `shipwreck`; wreckers_of_the_storm_isles `corsair_raider`; pilots_of_the_storms `compass_rose`; false_lights `lighthouse`; pilots_for_hire `coin_chest`; the_corsair_harbours `harbour_lake`; pilots_for_the_west `ship_voyage` |
| C | first_of_the_isles `banner_league`; envoys_to_the_lesser_isles `envoy`; the_isles_protection `charter_shield`; the_isles_by_the_sword `war_council_map`; a_crown_over_the_isles `crown_iron` |
| D | storm_yards `shipwright_yard`; storm_galleys `galley_oars`; the_storm_fleet `warship_sail`; ships_that_ride_the_storm `storm_sea`; island_raiders `great_warship` |
| E | harbours_of_halenor `harbour_lake`; salvage_yards `shipwreck`; the_storm_markets `market_stalls`; rope_tar_and_timber `timber_mill` |
| F | the_isle_levy `levy_muster`; sea_soldiers_of_the_storm `sword_shield`; isle_bows `bow_archers`; the_storm_host `war_drums` |
| G | the_great_war_at_sea `storm_sea`; the_storm_isles_apart `olive_branch`; pilots_for_the_crossing `compass_rose`; storm_pilots_for_the_living `lone_sword` |

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

| Id | Key | Title | Picture | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `protection_offer` | Halenor Offers Its Protection | `generic_sea` | a small isle | *Envoys to the Lesser Isles* | **Accept the Storm Lords' shield** (AI 20; ×2 at piracy ≥ 60; ×0 for a member of the Pupor Charter): Halenor `puppet`s the isle. **We keep our own freedom**: nothing |

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

**A. The Isle Moot.**

- `the_isle_moot` **The Isle Moot** (1,0) 70d: political power 75. AI 100.
- `elders_of_the_isles` **Elders of the Isles** (0,1) ← the_isle_moot: stability 0.03.
- `the_fishers_voice` **The Fishers' Voice** (2,1) ← the_isle_moot: political power 25.
- `the_moot_stone` **The Moot Stone** (1,2) 70d ← elders_of_the_isles, the_fishers_voice: swap spirit `isle_moot_custom` → `moot_stone`.

**B. Our Fathers' Banks.**

- `our_fathers_banks` **Our Fathers' Banks** (4,0): political power 25. AI 30.
- `boats_on_the_banks` **Boats on the Banks** (3,1) ← our_fathers_banks: political power 25.
- `watch_the_kings_galleys` **Watch the King's Galleys** (5,1) ← our_fathers_banks: available Nondondor exists; building coastal_bunker 1 random_coastal.
- ★ `defy_the_king` **Defy the King** (3,2) ← boats_on_the_banks, watch_the_kings_galleys; exclusive with seek_the_brokers.
- ★ `seek_the_brokers` **Seek the Brokers' Judgment** (5,2) ← boats_on_the_banks, watch_the_kings_galleys; exclusive with defy_the_king.
- `the_banks_fleet` **The Banks Fleet** (3,3) ← defy_the_king: spirit `banks_fleet`.
- `the_banks_accord_kept` **The Banks Accord** (5,3) ← seek_the_brokers, defy_the_king: available global flag `zin_tritons_banks_accord`; stability 0.05; piracy −2.
- `call_on_friends` **Call on Friends** (3,4) ← the_banks_fleet: available `variable zin_gathering_dark above 24`; `call zin_regional_seite_islands_ask_guarantee`. AI 20.

**C. The Isle Harbours.**

- `the_isle_harbours` **The Isle Harbours** (8,0): building naval_base 1 random_coastal. AI 20.
- `drying_racks` **Drying Racks** (7,1) ← the_isle_harbours: political power 25.
- `boatwrights` **Boatwrights** (9,1) ← the_isle_harbours: building dockyard 1 random_coastal.
- `the_isle_market` **The Isle Market** (8,2) ← drying_racks, boatwrights: building industrial_complex 1 capital.
- `stores_of_salt_fish` **Stores of Salt Fish** (8,3) ← the_isle_market: stability 0.03.

**D. The Isle Boats.**

- `isle_boats` **The Isle Boats** (12,0): research {zin_cat_galleys} 0.5×1. AI 15.
- `the_fishing_fleet_armed` **The Fishing Fleet Armed** (11,1) ← isle_boats: spirit `armed_fishers`.
- `the_moots_captain` **The Moot's Captain** (13,1) ← isle_boats: recruit `zin_regional_seite_islands_brann`; navy experience 5.
- `the_banks_squadron` **The Banks Squadron** (12,2) 70d ← the_fishing_fleet_armed, the_moots_captain: spirit `banks_squadron`.

**E. Charter or Coves.**

- `the_pupor_question` **The Pupor Question** (15,0): political power 25. AI 30.
- ★ `join_the_charter` **Join the Pupor Charter** (14,1) ← the_pupor_question; exclusive with the_free_coves.
- ★ `the_free_coves` **The Free Coves** (16,1) ← the_pupor_question; exclusive with join_the_charter.
- `charter_watch` **The Charter Watch** (14,2) ← join_the_charter: piracy −2; navy experience 5.
- `cove_raiders` **Cove Raiders** (16,2) ← the_free_coves: piracy +3; political power 50.

**F. The Great War at Sea.**

- `the_great_war_at_sea` **The Great War at Sea** (8,5): available `zin_war_of_last_crowns` or `zin_western_crossing`; political power 25. AI 200.
- `the_isles_keep_apart` **The Isles Keep Apart** (7,6) ← the_great_war_at_sea: spirit `isles_apart`. AI 50; hist ×10.
- `boats_for_the_crossing` **Boats for the Crossing** (9,6) ← the_great_war_at_sea: available `zin_western_crossing`; fleet +2; political power 25. AI 15; hist ×0.5.
- `fishers_for_the_living` **Fishers for the Living** (8,7) ← the_isles_keep_apart, boats_for_the_crossing: available `zin_eindil_returned`, friend; join coalition. AI 100.

**G. Strangers.**

- `harbour_for_strangers` **A Harbour for Strangers** (18,0): safe harbour; stability 0.02. Icon `harbour_lake`. AI 10; hist ×0.

### Icons

Every key is from the [icon catalog](../02_icon_catalog.md) (sprites `GFX_focus_zin_<key>`, `GFX_idea_zin_<key>`). Spirits use the icon of the focus that adds them; the start spirit `isle_moot_custom` uses `rune_stone`.

| Branch | Focus → icon |
| --- | --- |
| A | the_isle_moot `council_table`; elders_of_the_isles `banner_plain`; the_fishers_voice `fishing_boats`; the_moot_stone `rune_stone` |
| B | our_fathers_banks `fishing_boats`; boats_on_the_banks `anchor_rope`; watch_the_kings_galleys `fort_wall`; defy_the_king `sword_shield`; seek_the_brokers `handshake_oath`; the_banks_fleet `warship_sail`; the_banks_accord_kept `olive_branch`; call_on_friends `envoy` |
| C | the_isle_harbours `harbour_lake`; drying_racks `granary`; boatwrights `shipwright_yard`; the_isle_market `market_stalls`; stores_of_salt_fish `ledger_coins` |
| D | isle_boats `galley_oars`; the_fishing_fleet_armed `fishing_boats`; the_moots_captain `compass_rose`; the_banks_squadron `great_warship` |
| E | the_pupor_question `sea_charts`; join_the_charter `banner_league`; the_free_coves `corsair_raider`; charter_watch `eye_watchful`; cove_raiders `coin_chest` |
| F | the_great_war_at_sea `storm_sea`; the_isles_keep_apart `olive_branch`; boats_for_the_crossing `ship_voyage`; fishers_for_the_living `lone_sword` |
| G | harbour_for_strangers `harbour_lake` |

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

| Id | Key | Title | Picture | To | Trigger | Options |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `seite_petition` | The Seite Isles Ask Raerby to Judge the Banks | `generic_peace` | Raerby | *Seek the Brokers' Judgment* | **Judge the banks** (AI 80): Raerby `call zin_tritons_offer_banks_mediation` (asks Nondondor; the Seite side has already accepted). **Not our quarrel**: nothing |
| 2 | `shield_request` | The Seite Isles Ask for a Shield | `generic_sea` | the strongest other Triton's navy | *Call on Friends* | **Stand behind them** (AI 40; ×2 for a member of the Pupor Charter): `give_guarantee` the Seite Islands. **Not our quarrel**: nothing |

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

### Build

Every tree is compiled by `tools/content/modules/focus_compiler.mjs` ([compiler spec](../00_format_and_compiler.md)) from its data file, run by `tools/content/build.mjs` and written in the same transaction as every other module through `tools/content/apply.mts` (the shared atomic rewrite engine). Each compiled tree replaces the interim Long Peace tree (`zin_long_peace_*`) for its country: the country history's `load_focus_tree` names the new tree. No tree has a `raw` block. Country names (Pollos, Raerby, Nondondor, Seite Islands, Corogon) resolve to tags through `tools/content/data/countries.json` at build time.

### Files

For each tree `<t>` in `regional_adel`, `regional_pollos`, `regional_raerby`, `regional_nondondor`, `regional_halenor`, `regional_seite_islands`:

| Path | What | Written by |
| --- | --- | --- |
| `docs/design/focus/<t>.json` | Tree data, `"id": "<t>"`, `"tier": "regional"`, `"countries": ["<Name>"]` | source |
| `common/national_focus/zin_<t>.txt` | Compiled tree | focus compiler |
| `common/ideas/zin_focus_<t>.txt` | Spirits `zin_<t>_<key>`, the start spirit included | focus compiler |
| `events/zin_<t>.txt` | Events (namespace `zin_<t>`; effect-triggered only) | focus compiler |
| `common/scripted_effects/zin_<t>.txt` | Tree-declared effects below | focus compiler |
| `common/opinion_modifiers/zin_regional_adel.txt` | `zin_regional_adel_friendship` (+15, decay 0.5 a month), from the Adel tree's `opinion_modifiers` block | focus compiler |
| `localisation/english/zin_focus_<t>_l_english.yml` | All text | focus compiler |

**Start spirits.** Country histories come from the politics step, so each tree's start spirit (`zin_regional_adel_chart_hall_pride`, `zin_regional_pollos_the_market_isle`, `zin_regional_raerby_broker_captains`, `zin_regional_nondondor_the_contested_banks`, `zin_regional_halenor_wreck_right`, `zin_regional_seite_islands_isle_moot_custom`) is defined in the tree's ideas file and added on game start by the start situation module (`tools/content/modules/start_situation.mjs`, data `tools/content/data/start_situation.json`, `on_startup` in `common/on_actions/zin_start_situation.txt`; [start situation](../../02_lore/01_start_situation.md), "Builder module and data").

**Characters.** Rulers keep their generated ids `<TAG>_zin_ruler`; their names (the characters spec's four, and this spec's Sea-Lord Orvak Halen and Elder Tamsa of the Seite, localisation keys `zin_name_halenor_ruler` and `zin_name_seite_ruler`) and the named advisors and captains are entries in `tools/content/data/characters.json`, which `tools/content/modules/characters.mjs` writes to `common/characters/zin_rulers.txt` and `common/characters/zin_lore_characters.txt`. The advisors and captains are defined but not recruited at the start; their focuses recruit them. Advisor traits are the ideologies spec's `zin_adv_*`; navy leader traits (`spotter`, `blue_water_expert`, `inshore_fighter`, `seawolf`) are the engine's, re-localised by the warfare spec. Portraits are image-generated and wired by `tools/content/modules/portraits.mjs`.

### Identifiers created

| Tree | Focuses | Spirits | Events |
| --- | ---: | ---: | --- |
| Adel | 31 | 6 | `zin_regional_adel.1`–`.2` |
| Pollos | 31 | 6 | `zin_regional_pollos.1`–`.2` |
| Raerby | 31 | 7 | `zin_regional_raerby.1`–`.2` |
| Nondondor | 32 | 8 | `zin_regional_nondondor.1`–`.2` |
| Halenor | 33 | 9 | `zin_regional_halenor.1` |
| Seite Islands | 31 | 6 | `zin_regional_seite_islands.1`–`.2` |

### Tree-declared scripted effects

| Effect | Tree | Does |
| --- | --- | --- |
| `zin_regional_<name>_recruit` (`character`) | all six | `recruit_character` of the named proposed character |
| `zin_regional_halenor_offer_protection` | Halenor | Fires `zin_regional_halenor.1` to up to three Triton's countries with one state, no overlord and no faction, nearest Halenor's capital first |
| `zin_regional_halenor_wargoal_isle` | Halenor | `create_wargoal` `puppet_wargoal_focus` on the nearest such country |
| `zin_regional_seite_islands_ask_guarantee` | Seite Islands | Fires `zin_regional_seite_islands.2` to the Triton's country with the largest navy other than Nondondor and the Seite Islands, not at war with either |

### Shared names used

| Names | Owner |
| --- | --- |
| `zin_tritons_add_piracy`, `zin_tritons_set_side`, `zin_tritons_found_charter`, `zin_tritons_join_charter`, `zin_tritons_offer_banks_mediation`, `zin_tritons_make_banks_accord`, `zin_tritons_join_crossing`; trigger `zin_tritons_ship_has_sailed`; flags `zin_tritons_charter_invited`, `zin_tritons_charter_founded`, `zin_tritons_mediation_accepted`, `zin_tritons_banks_accord`, `zin_tritons_banks_yielded`; opinion modifier `zin_tritons_banks_quarrel`; event `zin_shared_tritons_islands.3` | the Pupor Ocean system of the [shared Triton's tree](../shared/shared_tritons_islands.md) (no 04_mechanics spec exists for the islands; the focus compiler writes these from the shared tree's data) |
| `zin_west_add_fleet`; flags `zin_west_council`, `zin_western_crossing`, `zin_west_evacuation`, `zin_west_evacuated`; `zin_gunwaith.5` | [Western Crossing](../../04_mechanics/western_crossing.md); [Gunwaith's tree](../major/gunwaith.md) |
| `zin_regional_corogon.3`, `zin_regional_corogon.4` | [West Lands trees](west_lands.md) (Corogon's embassy to Raerby and island routes to Pollos) |
| `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_join_coalition`, `zin_eindil_friend`; journey hook flag `zin_eindil_safe_harbour` | [Eindil's journey](../../04_mechanics/eindil_journey.md); contract additions register |
| `zin_aenor_is_realm`, `zin_is_site_parim` | [Aenor](../../04_mechanics/aenor_court_and_succession.md); key sites |
| `zin_light_council`, `zin_wild_clans`, `zin_adv_*` | [ideologies and politics](../../00_foundation/02_ideologies_and_politics.md) |
| `zin_lore.150` | [Fourth Age history for play](../../02_lore/04_fourth_age_history_for_play.md) |
| `zin_rules_is_historical`, `zin_rule_historical_path` | [defines and rules](../../00_foundation/05_defines_and_rules.md) |

### `allow_branch` roots

Each tree's southern-ship focus carries `allow_branch = check zin_tritons_ship_has_sailed`. The journey effect that advances `zin_eindil_stage` to 6 calls `mark_focus_tree_layout_dirty` for every Triton's Islands country (request to the journey spec).

### Game rules and defines

None new.

### Icons and pictures

Every focus names its icon in its tree's `### Icons` table; all are catalog keys and in the game today, so no new key is needed. Event pictures: `generic_sea` (most island events), `generic_court` (votes and courts), `generic_peace` (envoys, mediation). All art is image-generated.

## AI

- Weights and "hist" factors are in each section; war roots 200; coalition focuses 100.
- Under the free rule (`zin_rule_historical_path` FREE): chart house or haven weighs piracy (haven weight ×2 at piracy ≥ 60, chart house ×2 at piracy ≥ 40); Nondondor's *Press* vs *Share* weighs its opinion of the Seite Islands (press ×2 below 0); Halenor's wreckers vs pilots 30/30, ×2 for wreckers while no Charter exists.
- No island AI ever declares a war on the historical path; under the free rule Nondondor's and Halenor's war focuses keep weights of 5 to 10.

## Acceptance

1. The compiler builds the six trees with these counts: Adel 31, Pollos 31, Raerby 31, Nondondor 32, Halenor 33, Seite Islands 31. Keys and positions are unique, prerequisites sit above their focuses, exclusives are symmetric, days are multiples of 7, no tree has a `raw` block, and the HOI4 Agent Tools focus inspector and script validator pass; each tree renders cleanly.
2. On 1 Thaw 4A 1748: no focus in these trees can create a war goal or claim; no island is a chart house or a haven; no visible focus mentions the southern ship; no text names Afrit or Eindil (compiler secret scan); each island carries its start spirit.
3. Historical observer run, 4A 1748 to 1760 (one in-game year per phase from phase 3; the dates assume the 4A 1748 calendar): Pollos founds the Pupor Charter by the end of 1752 with at least Adel and Raerby as members; the banks accord is set by the end of 1753; piracy is below 25 by 1755; no island declares a war; every island takes its stand-apart focus within 180 days of the war root opening.
4. Scenario test: Nondondor presses the banks and the Seite Islands refuse: the quarrel modifier exists both ways; after both accept Raerby's mediation it is removed, `zin_regional_nondondor_the_contested_banks` is gone and the accord flag is set.
5. Scenario test: Halenor at `zin_gathering_dark` 45 under the free rule completes *The Isles by the Sword*: it gains a war goal on one small isle and no other.
6. Every modifier in the spirit tables exists in the 1.19.3 modifier documentation; every icon and picture is a catalog key.
7. None of the six countries loads the interim Long Peace tree.

## Open questions

1. **Rulers and the Southern Banks.** OPEN_QUESTIONS, "regions: cold, west, tritons" 8. Proceeds on the proposal: Sea-Lord Orvak Halen rules Halenor and Elder Tamsa the Seite Islands; the Seite Islands are Nondondor's rival on the banks, which needs no shared border (the effects name the two countries, not states).
2. **Island navigators in Lorien's crew.** OPEN_QUESTIONS, "regions: cold, west, tritons" 8. Proceeds on the vault: no text says which islands sent navigators, Adel included.
3. **Piracy and the Crossing.** OPEN_QUESTIONS, "regions: cold, west, tritons" 7 and 9. Proceeds on the proposal: the Pupor Ocean system as specified; the historical path drives piracy down; islands sail with the Crossing only in play.

Decided here (proposed): Halenor is an isle of wreckers turned pilots, and the Seite Islands are one people of fishing clans across four isles who meet at a moot stone.
