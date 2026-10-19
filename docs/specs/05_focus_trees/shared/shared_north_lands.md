# Shared tree: the North Lands crowns

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

One focus tree for the twenty-two small crowns of the North Lands. Each is a lordship of one to three states between two masters: Sonargur across its own waters and Parim across the strait. The tree lets a small crown lean to one of them or keep its own counsel, build its hearths and harbours, watch for the black ships, and decide what it owes anyone when the old alliance ends and Zol's dead come ashore. Branches open by coast, island, ideology, overlord, Compact membership, people and region, so a coastal freehold, an inland hill lordship and an island principality read differently.

It implements the small-crown side of the [Treaty of the Narrow Strait mechanic](../../04_mechanics/lerendor_narrow_strait.md) and defines the helper effects the North Lands tier B trees ([../regional/north_lands.md](../regional/north_lands.md)) call.

| Item | Value |
| --- | --- |
| Tree id | `shared_north_lands` (focus ids `zin_shared_north_lands_<key>`) |
| Tier | C (01_tiers: 40 to 70 focuses) |
| Countries | Belg, Goran, Heodwa Lands, Pertawn, Solenkovi, The Hold, Allegro, Mine Din, Nuatax, Ashorn, Cinargo, Ferlinon, Filit, Gil'dul, Gul'dur, Keredor-Hellekton, Low-ness Islands, Mustnom, Oirt, Stork, Thowson, Tolhon (exactly the tier C list of [../01_tiers_and_coverage.md](../01_tiers_and_coverage.md)) |
| Focuses | 55; columns 0–24, rows 0–9 |
| Events | namespace `zin_shared_north_lands`, ids 1–6 |
| Spirits | `zin_shared_north_lands_<key>` (18) |
| Built by | `tools/content/modules/focus_compiler.mjs` ([../00_format_and_compiler.md](../00_format_and_compiler.md)) from `docs/design/focus/shared_north_lands.json` |

### The countries at the start

All twenty-two are men, Wild (Freeholds), independent and at peace, with `zin_footholds` 1 (Afrit spec: "other countries of men in the North"). None is in a faction: the Leren Compact starts with Lerendor and Eekedor only, and Andos Enda stays outside it (decision S5).

| Country | States | Start lean (Lerendor spec) | Notes |
| --- | ---: | ---: | --- |
| The Hold | 3 | 15 | Mina's neighbour (proposed); joins the Compact on Lerendor's historical route |
| Belg | 3 | 10 | |
| Tolhon | 1 | 10 | Island principality in the roster; the drawn Dul and Dur names are its districts (roster) |
| Goran, Heodwa Lands, Pertawn, Solenkovi | 3 each | 5 | |
| Allegro, Mine Din, Nuatax | 2 each | 5 | |
| Ashorn, Cinargo, Ferlinon, Filit, Gil'dul, Gul'dur, Keredor-Hellekton, Low-ness Islands, Mustnom, Oirt, Stork, Thowson | 1 each | 5 | |

Whether a crown is coastal or an island realm is read from the map at run time (`zin_shared_has_coast`, `zin_shared_is_island_realm`); this spec assigns no country to those branches by name.

Today every one of these countries runs the interim "Long Peace" tree (`zin_long_peace_*`, written by `modules/vanilla_removal.mjs`). The compiled tree replaces it for these twenty-two.

## Lore basis

- **Established:** the North Lands lie north of the Middle Lands across a narrow strait; Lerendor leads the Leren Compact; in the final war rulers in the North Lands withdraw from Aenoran alliances, and the North Lands are not one unanimous enemy; Zol's dead come through islands and straits, and ordinary weapons cannot end them; northern companies join Eindil's coalition without surrendering their independence; competing northern interests remain after the war.
- **Proposed in the vault:** the Treaty of the Narrow Strait (4A 512); island fishermen's tales of black ships (4A 1744).
- **Proposed in the specs:** each crown's lean toward Sonargur or Parim, the Compact decisions and the withdrawal in 4A 1755 (Lerendor spec); footholds (Afrit spec); Sensai's Free Crowns of the North (North Lands regional file).
- **Proposed here:** every focus, spirit, event and number; the request for a Compact seat and for Parim's shield.
- **Kept open:** whether a small crown withdraws from Aenoran alliances on its own (here it is the crown's choice, never history); anything about Zol's servants or who governs the Mistake; the post-war order of the North. Text states none of these.

## Design

### How the tree reads

- **Every crown** gets the root, *Between Sonargur and Parim*, *Hearth and Harbour*, *The Houses* and *The North at War*.
- **Coastal crowns** (`check zin_shared_has_coast`) get *The Shore*; **inland crowns** (not coastal) get *Hills and Forests*; **island realms** (`check zin_shared_is_island_realm`) also get *Island Crowns*.
- **By ideology:** Wild crowns get *The Freeholders' Moot*; Light crowns *The Free Towns' Council*; Dominion crowns *A Lord's Hand*. (All start Wild; the others open after a change of government.)
- **By overlord:** a subject of Lerendor gets *Under the Leren Banner*; a Compact member that is not a subject (`check zin_shared_north_in_compact`) gets *The Compact Member*.
- **By people:** men get *Kin of the North*.
- **By region:** crowns bordering a Dark Lands country (`check zin_shared_borders_dark_lands`) get *Across the Dark Straits*.

`allow_branch` sits on each branch's first focus (decision S9 accepts any condition there). Text uses `[ROOT.GetName]` and `[ROOT.GetAdjective]`, never a country name except Sonargur, Parim and the Compact.

### Rules

- **Peace.** No focus makes a war goal, a claim or a core. *The North at War* opens only from `zin_zol_rising`, `zin_war_of_last_crowns`, `zin_leren_withdrawal` or being at war.
- **The secret.** No text names Afrit, the Hidden Council or Ilvane; Aenor's king after the Golden King's death is "the new king in Parim" (D3).
- **Eindil.** Focus, spirit and tooltip text is visible to everyone from the first day, so it never refers to Eindil: not by name, not as the Heir or the Man from the Ice (D4; nothing before `zin_eindil_awake`). It speaks only of "the coalition".
- **Zol.** The black sails are rumours; no text names a servant of Zol or shows Zol.
- **Lean.** Every lean change goes through `zin_leren_add_lean` on the crown whose lean changes.
- **Text.** Names are title-cased; each description is one to three plain sentences, Windows-1252 only.

### Notation

The Concord tree's notation ([shared_concord_dominions.md](shared_concord_dominions.md#notation)): `pp`, `stab`, `ws`, `army_xp`, `navy_xp`, `mp`, `spirit`, `swap`, `remove`, `bld`, `res`, `footholds(v)`, `regard(v)`, `coalition`, `aid`, `event k`, `allow:`, `Avail:`, `hist n`, and its argument convention. Plus, as in the North Lands regional file:

| Shorthand | Means |
| --- | --- |
| `lean(v)` | `call zin_leren_add_lean {value: v}` on ROOT (positive toward Sonargur) |
| `lean ≥ n`, `lean < n` | condition `{ "variable": { "name": "zin_leren_lean", "above": n − 1 } }`, or its `not` |
| `ask_compact` | `call zin_north_ask_compact_seat` (this tree) |
| `ask_parim` | `call zin_north_ask_parim_shield` (this tree) |
| `Shore` | `available`: any of the global flags `zin_zol_rising`, `zin_war_of_last_crowns`, `zin_leren_withdrawal`, or `at_war` |
| `End` | `available`: any of the global flags `zin_zol_withdrawn`, `zin_eindil_crowned`, `zin_afrit_dead`, or (not `at_war` and `after 1758.3.1`) |

Prerequisites: `a / b` means a or b. **Bold** names mark key focuses. Days are 35 or 70 (5 or 10 weeks).

### Layout

| Br. | Branch | Columns | Rows | Opens | Focuses |
| --- | --- | --- | --- | --- | ---: |
| — | Root | 14 | 0 | start | 1 |
| A | Between Sonargur and Parim | 0–4 | 1–4 | all | 8 |
| B | Hearth and Harbour | 6–8 | 1–5 | all | 7 |
| C | The Shore | 10–12 | 1–4 | allow: coast | 6 |
| D | Hills and Forests | 14–16 | 1–3 | allow: no coast | 4 |
| E | Island Crowns | 17 | 1–3 | allow: island | 3 |
| F | Moots, Councils and Lords | 19–21 | 1–2 | allow: by ideology | 6 |
| G | Banner and Compact | 22–24 | 1–3 | allow: by overlord or faction | 6 |
| H | Kin and Straits | 1–3 | 6–8 | allow: by people, by region | 5 |
| I | The Houses | 5 | 6–7 | all | 2 |
| J | The North at War | 10–14 | 6–9 | Shore | 7 |

### Focuses

| Br. | Key | Name | Prerequisites | Excl. | x,y | Days | Icon | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| — | `crown_of_the_north` | **The Crown of [ROOT.GetName]** | — | — | 14,0 | 35 | `crown_iron` | pp 50; stab 0.02 | 100 |
| A | `look_to_sonargur` | **Look to Sonargur** | crown_of_the_north | look_to_parim, our_own_counsel | 0,1 | 35 | `two_crowns` | lean(15) | 10; ×2 if lean ≥ 10; ×4 if lean ≥ 30; ×0.2 if lean < 0; hist: ×10 if lean ≥ 10, else 0 |
| A | `look_to_parim` | **Look to Parim** | crown_of_the_north | look_to_sonargur, our_own_counsel | 2,1 | 35 | `palace_parim` | lean(−15) | 10; ×2 if lean < −9; ×4 if lean < −29; ×0.2 if lean ≥ 10; hist 0 |
| A | `our_own_counsel` | **Our Own Counsel** | crown_of_the_north | look_to_sonargur, look_to_parim | 4,1 | 35 | `banner_plain` | spirit `own_counsel` | 20; hist: ×5 if lean < 10, else 0 |
| A | `ask_for_a_compact_seat` | Ask for a Seat in the Compact | look_to_sonargur | — | 0,2 | 35 | `banner_league` | Avail: lean ≥ 50; `check zin_north_can_ask_compact`. ask_compact | 60; hist 0 before 1752.1.1 |
| A | `envoys_to_parim` | Envoys to Parim | look_to_parim | — | 2,2 | 35 | `envoy` | Avail: not `check zin_aenor_parim_lost`. ask_parim | 40 |
| A | `join_the_free_crowns` | Join the Free Crowns | our_own_counsel | — | 4,2 | 35 | `alliance_rings` | Avail: `check zin_north_free_crowns_open`. join_faction_of Sensai | 40; ×0 if lean < −20 or lean ≥ 21; hist 0 |
| A | `trade_with_both_shores` | Trade with Both Shores | look_to_sonargur / look_to_parim / our_own_counsel | — | 2,3 | 70 | `handshake_oath` | spirit `two_shore_trade` | 20 |
| A | `a_crown_among_crowns` | A Crown Among Crowns | trade_with_both_shores | — | 2,4 | 70 | `seal_royal` | pp 50; stab 0.05 | 20 |
| B | `hearth_and_harbour` | **Hearth and Harbour** | crown_of_the_north | — | 7,1 | 70 | `workshop_tools` | bld industrial_complex 1 @capital | 40 |
| B | `timber_rights` | Timber Rights | hearth_and_harbour | — | 6,2 | 70 | `timber_mill` | bld industrial_complex 1 @random_owned | 30 |
| B | `village_roads` | Village Roads | hearth_and_harbour | — | 8,2 | 70 | `roads_paved` | bld infrastructure 1 @random_owned ×2 | 20 |
| B | `northern_smithies` | Northern Smithies | timber_rights | — | 6,3 | 70 | `forge_anvil` | bld arms_factory 1 @capital | 20 |
| B | `grain_and_fish` | Grain and Fish | village_roads | — | 8,3 | 35 | `granary` | spirit `grain_and_fish` | 30 |
| B | `market_fairs` | Market Fairs | northern_smithies / grain_and_fish | — | 7,4 | 70 | `market_stalls` | spirit `market_fairs` | 20 |
| B | `a_prosperous_crown` | A Prosperous [ROOT.GetAdjective] Crown | market_fairs | — | 7,5 | 70 | `coin_chest` | bld industrial_complex 1 @random_owned; stab 0.03 | 20 |
| C | `boats_and_nets` | **Boats and Nets** | crown_of_the_north | — | 11,1 | 35 | `fishing_boats` | allow: `check zin_shared_has_coast`. spirit `fisherfolk` | 40 |
| C | `harbour_works` | Harbour Works | boats_and_nets | — | 10,2 | 70 | `harbour_lake` | bld naval_base 1 @random_coastal; bld dockyard 1 @random_coastal | 30 |
| C | `watch_the_waters` | Watch the Waters | boats_and_nets | — | 12,2 | 35 | `black_hulls` | Avail: not global flag `zin_zol_rising`. event `black_sails_seen` | 20 |
| C | `shore_towers` | Shore Towers | harbour_works | — | 10,3 | 70 | `lighthouse` | bld coastal_bunker 1 @random_coastal ×2 | 15; ×4 if global flag `zin_zol_rising` |
| C | `galleys_of_the_crown` | Galleys of the Crown | watch_the_waters | — | 12,3 | 70 | `galley_oars` | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 | 15 |
| C | `the_shore_watch` | The Shore Watch | shore_towers / galleys_of_the_crown | — | 11,4 | 70 | `eye_watchful` | spirit `shore_watch` | 20 |
| D | `hill_holds` | **Hill Holds** | crown_of_the_north | — | 15,1 | 70 | `fort_wall` | allow: not `check zin_shared_has_coast`. bld bunker 1 @capital; res [zin_cat_walls] 0.5 ×1 | 30 |
| D | `forest_trails` | Forest Trails | hill_holds | — | 14,2 | 35 | `scout_lantern` | spirit `forest_trails` | 20 |
| D | `mines_in_the_hills` | Mines in the Hills | hill_holds | — | 16,2 | 70 | `mine_cart` | bld industrial_complex 1 @random_owned | 30 |
| D | `the_upland_levy` | The Upland Levy | forest_trails / mines_in_the_hills | — | 15,3 | 70 | `spear_levy` | mp 2000; army_xp 5 | 15 |
| E | `island_crown` | **An Island Crown** | crown_of_the_north | — | 17,1 | 35 | `island_shrine` | allow: `check zin_shared_is_island_realm`. spirit `island_crown` | 40 |
| E | `island_pilots` | Island Pilots | island_crown | — | 17,2 | 70 | `sea_charts` | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 | 20 |
| E | `the_isle_keeps` | The Isle Keeps | island_pilots | — | 17,3 | 70 | `fort_wall` | bld coastal_bunker 1 @capital ×2 | 15 |
| F | `the_freeholders_moot` | **The Freeholders' Moot** | crown_of_the_north | — | 19,1 | 35 | `council_table` | allow: ideology `wild`. spirit `freeholders_moot` | 40 |
| F | `old_rights_kept` | Old Rights Kept | the_freeholders_moot | — | 19,2 | 70 | `charter_old` | swap freeholders_moot→freeholders_moot_2 | 30 |
| F | `the_free_towns_council` | The Free Towns' Council | crown_of_the_north | — | 20,1 | 35 | `guild_hall` | allow: ideology `light`. spirit `free_towns` | 40 |
| F | `elected_wardens` | Elected Wardens | the_free_towns_council | — | 20,2 | 70 | `seal_wax` | pp 50; stab 0.03 | 30 |
| F | `a_lords_hand` | A Lord's Hand | crown_of_the_north | — | 21,1 | 35 | `sceptre` | allow: ideology `dominion`. pp 75 | 40 |
| F | `the_lords_men` | The Lord's Men | a_lords_hand | — | 21,2 | 70 | `seal_chancellor` | spirit `lords_men` | 30 |
| G | `under_the_leren_banner` | **Under the Leren Banner** | crown_of_the_north | — | 22,1 | 35 | `two_crowns` | allow: `subject_of` Lerendor. spirit `leren_banner` | 60 |
| G | `leren_garrisons` | Leren Garrisons | under_the_leren_banner | — | 22,2 | 70 | `pass_fort` | bld bunker 1 @capital; `if check zin_shared_has_coast`: bld coastal_bunker 1 @random_coastal | 30 |
| G | `sonargurs_trust` | Sonargur's Trust | leren_garrisons | — | 22,3 | 70 | `handshake_oath` | lean(10); pp 50 | 30 |
| G | `the_compact_member` | **The Compact Member** | crown_of_the_north | — | 24,1 | 35 | `banner_league` | allow: `check zin_shared_north_in_compact`. lean(5); spirit `compact_member` | 60 |
| G | `compact_fleet_duty` | Compact Fleet Duty | the_compact_member | — | 24,2 | 70 | `warship_sail` | navy_xp 10 | 30 |
| G | `compact_levies` | Compact Levies | compact_fleet_duty | — | 24,3 | 70 | `levy_muster` | army_xp 10; mp −500; lean(5) | 30 |
| H | `kin_of_the_north` | Kin of the North | crown_of_the_north | — | 1,6 | 35 | `snow_peak` | allow: people `men`. mp 1000; stab 0.02 | 30 |
| H | `northern_levies` | Northern Levies | kin_of_the_north | — | 1,7 | 70 | `spear_levy` | mp 1000; res [zin_cat_arms] 0.5 ×1 | 15 |
| H | `across_the_dark_straits` | **Across the Dark Straits** | crown_of_the_north | — | 3,6 | 35 | `storm_sea` | allow: `check zin_shared_borders_dark_lands`. spirit `dark_strait_watch` | 40 |
| H | `traders_of_the_dark_shore` | Traders of the Dark Shore | across_the_dark_straits | — | 3,7 | 70 | `caravan` | spirit `dark_shore_trade` | 20 |
| H | `whispers_from_the_holds` | Whispers from the Holds | traders_of_the_dark_shore | — | 3,8 | 35 | `scroll_sealed` | event `whispers_from_the_holds` | 20 |
| I | `temples_and_almshouses` | Temples and Almshouses | crown_of_the_north | — | 5,6 | 35 | `house_first_light` | stab 0.03; footholds(1); event `the_almoners_in_the_north` | 20; hist 40 |
| I | `a_watchful_crown` | A Watchful Crown | temples_and_almshouses | — | 5,7 | 35 | `eye_watchful` | Avail: global flag `zin_afrit_revealed`, or flag `zin_afrit_suspicious`. spirit `houses_watched` | 100 |
| J | `the_north_at_war` | **The North at War** | — | — | 12,6 | 35 | `beacon` | Avail: Shore. ws 0.10; spirit `north_at_war` | 100 |
| J | `beacons_on_the_capes` | Beacons on the Capes | the_north_at_war | — | 10,7 | 70 | `lighthouse` | Avail: global flag `zin_zol_rising`; `check zin_shared_has_coast`. bld coastal_bunker 1 @random_coastal ×2 | 100 |
| J | `stand_apart_with_sonargur` | Stand Apart with Sonargur | the_north_at_war | keep_faith_with_parim | 12,7 | 35 | `two_crowns` | Avail: global flag `zin_leren_withdrawal`. lean(10); stab 0.03 | 50; ×1.5 if lean ≥ 20; ×0.5 if lean < −20; hist: ×2 if lean ≥ 0, else 0 |
| J | `keep_faith_with_parim` | Keep Faith with Parim | the_north_at_war | stand_apart_with_sonargur | 14,7 | 35 | `seal_royal` | Avail: global flag `zin_leren_withdrawal`; not `check zin_aenor_parim_lost`; not `check zin_north_with_lerendor`. lean(−20); `call zin_north_keep_faith` | 50; ×1.5 if lean < −19; ×0.5 if lean ≥ 20; hist: ×2 if lean < 0, else 0 |
| J | `against_the_deathless` | Against the Deathless | the_north_at_war | — | 10,8 | 70 | `lone_sword` | Avail: global flag `zin_zol_rising`. army_xp 10; tooltip "Ordinary arms break Zol's dead; they do not end them." | 80 |
| J | `northern_companies` | Northern Companies | the_north_at_war | — | 12,8 | 70 | `alliance_rings` | Avail: global flag `zin_eindil_returned`. `if check zin_shared_bound_away_from_host`: aid; else coalition. regard(10); army_xp 5 | 30; ×2 if `check zin_eindil_friend`; ×0.3 if `check zin_eindil_resents`; hist: 40, ×0 if lean ≥ 20 |
| J | `the_shore_quiet` | The Shore Is Quiet | beacons_on_the_capes / stand_apart_with_sonargur / keep_faith_with_parim / against_the_deathless / northern_companies | — | 12,9 | 70 | `olive_branch` | Avail: End. stab 0.10; remove `north_at_war` | 100 |

**Total: 55 focuses.** A coastal Wild crown sees about 44; an inland one about 41.

### Spirits

Every modifier below is in the 1.19.3 `modifiers_documentation.md` (and `naval_detection`, `army_intel_factor`, `coastal_bunker_effectiveness_factor` appear in vanilla national spirits).

| Key | Name | Icon | Modifiers |
| --- | --- | --- | --- |
| `own_counsel` | Our Own Counsel | `banner_plain` | `drift_defence_factor` 0.15, `political_power_gain` 0.05 |
| `two_shore_trade` | Trade with Both Shores | `handshake_oath` | `trade_opinion_factor` 0.10 |
| `grain_and_fish` | Grain and Fish | `granary` | `monthly_population` 0.05, `stability_factor` 0.02 |
| `market_fairs` | Market Fairs | `market_stalls` | `trade_opinion_factor` 0.10, `consumer_goods_factor` −0.02 |
| `fisherfolk` | Boats and Nets | `fishing_boats` | `monthly_population` 0.03, `consumer_goods_factor` −0.01 |
| `shore_watch` | The Shore Watch | `eye_watchful` | `naval_detection` 0.10, `coastal_bunker_effectiveness_factor` 0.10 |
| `forest_trails` | Forest Trails | `scout_lantern` | `army_defence_factor` 0.05, `attrition` −0.05 |
| `island_crown` | An Island Crown | `island_shrine` | `naval_detection` 0.05, `army_core_defence_factor` 0.05 |
| `freeholders_moot` | The Freeholders' Moot | `council_table` | `stability_factor` 0.03, `political_power_gain` 0.05 |
| `freeholders_moot_2` | Old Rights Kept | `charter_old` | `stability_factor` 0.05, `political_power_gain` 0.10, `drift_defence_factor` 0.10 |
| `free_towns` | The Free Towns' Council | `guild_hall` | `stability_factor` 0.05, `opinion_gain_monthly_factor` 0.10 |
| `lords_men` | The Lord's Men | `seal_chancellor` | `political_power_factor` 0.10, `stability_factor` −0.03 |
| `leren_banner` | Under the Leren Banner | `two_crowns` | `army_org_factor` 0.03, `stability_factor` 0.03 |
| `compact_member` | The Compact Member | `banner_league` | `faction_trade_opinion_factor` 0.10 |
| `dark_strait_watch` | Across the Dark Straits | `storm_sea` | `army_intel_factor` 0.10 |
| `dark_shore_trade` | Traders of the Dark Shore | `caravan` | `trade_opinion_factor` 0.10 |
| `houses_watched` | A Watchful Crown | `eye_watchful` | `drift_defence_factor` 0.20 |
| `north_at_war` | The North at War | `beacon` | `army_core_defence_factor` 0.10, `war_support_factor` 0.05 |

All are permanent except `freeholders_moot` (swapped) and `north_at_war` (removed by *The Shore Is Quiet*).

### Events (namespace `zin_shared_north_lands`)

All are fired by effects; none has a trigger or mean time. `FROM` is the crown that asks. Every picture below exists in the game and is ungated.

| Key (id) | Title | To | Picture | Fired by | Options (effects; AI) |
| --- | --- | --- | --- | --- | --- |
| `a_crown_asks_to_join` (1) | [FROM.GetName] Asks for a Seat | Lerendor | `leren_envoys` | `zin_north_ask_compact_seat` | **Welcome them to the Compact**: `call zin_north_welcome_to_compact` (AI 50; ×1.6 if `check zin_north_from_lean_60`; ×0 if `check zin_north_from_shielded_by_parim`) / **Not yet**: for_country FROM lean(−5) (AI 20) |
| `a_northern_crown_asks_for_a_shield` (2) | [FROM.GetName] Asks for Parim's Shield | the Aenor realm holding Parim | `generic_court` | `zin_north_ask_parim_shield` | **Guarantee them**: `call zin_north_grant_parim_shield` (AI 40; ×1.75 if `check zin_north_lerendor_supremacy`; ×0.5 if `check zin_aenor_king_alive` and `check zin_north_parim_gilded`) / **The North is Sonargur's affair**: for_country FROM lean(5) (AI 40) |
| `black_sails_seen` (3) | Black Sails Seen | ROOT | `black_ships_tale` | *Watch the Waters* | Fishermen tell of black sails among the far islands. **Old wives' tales**: nothing (AI 80) / **Send a boat to look**: pp −25; flag `zin_zol_forewarned`, so the Zol mechanic gives ROOT its timed idea `zin_zol_forewarned` at the rising (AI 20). The text never says what the sails are |
| `the_almoners_in_the_north` (4) | The Almoners in the North | ROOT | `houses` | *Temples and Almshouses* | Flavour; **Welcome them**: stab 0.01 |
| `whispers_from_the_holds` (5) | Whispers from the Holds | ROOT | `generic_sea` | *Whispers from the Holds* | Traders say gifts come to the orc holds from the south. **Note it**: flag `zin_north_heard_whispers` (AI 60) / **Tell Sonargur**: lean(3) (AI 40). Reveals nothing of Volgan's plans |
| `a_northern_crown_keeps_faith` (6) | [FROM.GetName] Keeps Faith | the Aenor realm holding Parim | `generic_court` | `zin_north_keep_faith` | **Accept their companies**: `call zin_north_accept_northern_faith` (AI 70) / **Parim needs no northern swords**: nothing (AI 30) |

Mechanic events also reach these crowns: `zin_leren.51` (the dead on the northern shore, coastal crowns), `zin_leren.70` (Lerendor's invitation), `zin_leren.71` (protection), Zol's rumour `zin_mistake.2` (Ocean of Zol coasts) and the flavour event `zin_lore.180` (black ships).

### Opinion modifiers (proposed)

| Key | Value | Added by |
| --- | ---: | --- |
| `zin_opinion_parims_shield` | +15 | event 2, both ways |
| `zin_opinion_northern_faith` | +25 | event 6, both ways |

`zin_leren_compact_kin` (+15) is the Lerendor spec's modifier.

### Helper scripts

Tree-declared scripts go to `common/scripted_effects/zin_shared_north_lands.txt` and `common/scripted_triggers/zin_shared_north_lands.txt`; the generic `zin_shared_*` triggers come from the single file `common/scripted_triggers/zin_shared_trees.txt` defined in [shared_concord_dominions.md](shared_concord_dominions.md#helper-scripts). Script bodies name countries only through generated triggers (`zin_is_lerendor`, `zin_aenor_is_realm`) and flags, never tags.

**Used by the North Lands tier B trees** (names stable; listed in [00_contract_additions.md](../../04_mechanics/00_contract_additions.md)):

| Name | Kind | Does |
| --- | --- | --- |
| `zin_north_ask_compact_seat` | scripted effect | If ROOT satisfies `zin_north_can_ask_compact`: fires event 1 to Lerendor |
| `zin_north_ask_parim_shield` | scripted effect | Fires event 2 to the Aenor realm that holds Parim through the Aenor mechanic's `zin_aenor_event_for_parim` (decision F7) |
| `zin_shared_north_in_compact` | scripted trigger | ROOT `is_in_faction_with` the country satisfying `zin_is_lerendor` and is not its subject |
| `zin_shared_has_coast`, `zin_shared_is_island_realm`, `zin_shared_borders_dark_lands`, `zin_shared_bound_away_from_host` | scripted triggers | Defined once for all shared trees (Concord spec) |

**Local to this tree** (proposed):

| Name | Kind | Scope | Does |
| --- | --- | --- | --- |
| `zin_north_can_ask_compact` | scripted trigger | country | `is_in_faction = no`; the `zin_is_lerendor` country exists and `is_faction_leader = yes` |
| `zin_north_free_crowns_open` | scripted trigger | country | `is_in_faction = no`; a country with flag `zin_sensai_free_crowns` is a faction leader |
| `zin_north_with_lerendor` | scripted trigger | country | ROOT `is_in_faction_with` the `zin_is_lerendor` country |
| `zin_north_from_lean_60` | scripted trigger | Lerendor (event) | `FROM` has `zin_leren_lean` ≥ 60 |
| `zin_north_from_shielded_by_parim` | scripted trigger | Lerendor (event) | `zin_leren_treaty_in_force`, and a `zin_aenor_is_realm` country `has_guaranteed = FROM` |
| `zin_north_lerendor_supremacy` | scripted trigger | any | the `zin_is_lerendor` country has flag `zin_leren_route_supremacy` |
| `zin_north_parim_gilded` | scripted trigger | Aenor realm | `zin_court_corruption` ≥ 70 |
| `zin_north_welcome_to_compact` | scripted effect | Lerendor (event) | `add_to_faction = FROM`; `add_opinion_modifier` and `reverse_add_opinion_modifier` `zin_leren_compact_kin` with FROM; FROM lean +10 |
| `zin_north_grant_parim_shield` | scripted effect | Aenor realm (event) | `give_guarantee = FROM`; FROM lean −10; `zin_opinion_parims_shield` both ways |
| `zin_north_keep_faith` | scripted effect | crown | Fires event 6 to the Aenor realm that holds Parim through `zin_aenor_event_for_parim` (F7) |
| `zin_north_accept_northern_faith` | scripted effect | Aenor realm (event) | `give_guarantee = FROM`; military access both ways (`give_military_access` in each country); `zin_opinion_northern_faith` both ways |

Flags this tree sets that others read: `zin_zol_forewarned` (Zol mechanic), `zin_north_heard_whispers` (Lerendor mechanic and AI, contract additions).

## Implementation

| Path | Written by | What |
| --- | --- | --- |
| `docs/design/focus/shared_north_lands.json` | authored data, staged by the builder | Tree data: `"tier": "shared"`, the twenty-two country names, focuses, spirits, events, opinion modifiers and the tree's scripted effects and triggers above |
| `common/national_focus/zin_shared_north_lands.txt` | `modules/focus_compiler.mjs` | One `focus_tree` with the twenty-two generator-resolved tags in `country` |
| `common/ideas/zin_focus_shared_north_lands.txt` | same | The 18 spirits |
| `events/zin_shared_north_lands.txt` | same | Events 1–6 |
| `common/scripted_effects/zin_shared_north_lands.txt`, `common/scripted_triggers/zin_shared_north_lands.txt` | same | Helper scripts above |
| `common/opinion_modifiers/zin_shared_north_lands.txt` | same, from the tree's `opinion_modifiers` block (F1) | The two opinion modifiers |
| `localisation/english/zin_focus_shared_north_lands_l_english.yml` | same (UTF-8 with BOM) | Names, descriptions, tooltips and event text with `[ROOT.GetName]`, `[ROOT.GetAdjective]`, `[FROM.GetName]` |

Everything is applied in the builder's one transaction through `tools/content/apply.mts`. The compiler drops these twenty-two countries from the interim Long Peace tree. Raw blocks: none.

**Names this tree reads from other specs.** Lerendor: `zin_leren_add_lean`, `zin_leren_lean`, `zin_leren_treaty_in_force`, `zin_leren_withdrawal`, `zin_leren_route_supremacy`, `zin_leren_compact_kin`, `zin_is_lerendor`. Aenor: `zin_aenor_is_realm`, `zin_aenor_king_alive`, `zin_aenor_parim_lost`, `zin_court_corruption`. Sensai's tree: `zin_sensai_free_crowns`. Zol: `zin_zol_rising`, `zin_zol_withdrawn`, `zin_zol_forewarned`. Afrit: `zin_afrit_add_footholds`, `zin_afrit_suspicious`, `zin_afrit_revealed`, `zin_afrit_dead`. Eindil: `zin_eindil_add_regard`, `zin_eindil_join_coalition`, `zin_eindil_aid_host`, `zin_eindil_friend`, `zin_eindil_resents`, `zin_eindil_returned`, `zin_eindil_crowned`. World: `zin_war_of_last_crowns`, `zin_rules_is_historical`. Map: `zin_is_site_parim`, `zin_region_dark_lands`.

**Advisors.** None added. Each crown keeps the three generated councillors `modules/characters.mjs` gives it today, from the North Lands name pool: `zin_adv_road_warden`, `zin_adv_muster_master`, `zin_adv_merchant_prince` (Wild); a crown that turns Light swaps the muster-master for `zin_adv_envoy` (politics spec).

**Art.** Every icon is a catalog key in the game today ([../02_icon_catalog.md](../02_icon_catalog.md)); every event picture is an ungated key in the game today. No new art is needed.

## AI

- **Historical:** root; B; A by start lean: crowns with lean ≥ 10 (The Hold, Belg, Tolhon) *Look to Sonargur*, the rest *Our Own Counsel*; *Ask for a Seat in the Compact* when lean reaches 50 after 4A 1752 (the Hold historically); C or D; *Watch the Waters* (the AI disbelieves); J when available: *Stand Apart with Sonargur* for every crown with lean ≥ 0, *Keep Faith with Parim* for the rest; *Against the Deathless* and *Beacons on the Capes* after `zin_zol_rising`; *Northern Companies* from 4A 1757, except crowns with lean ≥ 20, which keep their companies home.
- **Free:** lean decides A and J; *Join the Free Crowns* when Sensai has founded it and lean is between −20 and 20.
- Before `zin_golden_king_dead` no AI strategy toward war is added.

## Acceptance

Build test (`npm test` in `tools/`):

1. The compiler builds the tree with 55 focuses, unique positions, every focus below its prerequisites, symmetric exclusions, days that are multiples of 7 within 1–20 weeks, catalog icons and no `raw` blocks; the coverage check maps exactly the twenty-two countries to it.
2. Every `call` and `check` resolves to a scripted effect or trigger in the built files; every spirit modifier is in the 1.19.3 modifier documentation.
3. The secret scan finds no "Afrit", "Hidden Council", "Ilvane", "Eindil", "the Heir" or "Man from the Ice" anywhere in this tree's localisation.

Isolated Linux run (one in-game year from 1 Thaw 4A 1748, decision S8) and scenario tests:

4. A crown whose capital is an island state sees *An Island Crown* and *The Shore*; an inland crown sees *Hills and Forests* and not *The Shore*; nobody sees *Under the Leren Banner* or *The Compact Member* at the start.
5. On 1 Thaw 4A 1748 no available focus declares war or creates a claim or war goal; *The North at War* is unavailable.
6. A crown that takes *Watch the Waters* and sends a boat has `zin_zol_forewarned`; at `zin_zol_rising` the Zol mechanic gives it the forewarned idea.
7. *Ask for a Seat in the Compact* with Lerendor AI at lean 60 adds the crown to Lerendor's faction in about 80 % of 20 seeded tries; Lerendor's hegemony rises on the next monthly update.
8. Long historical observer run (validation spec): by 1 Deepwinter 4A 1754 The Hold is in the Leren Compact; no crown of this tree is at war before `zin_war_of_last_crowns` or `zin_zol_rising`.

## Open questions

1. **Which crowns face the Ocean of Zol, and are Tolhon and Low-ness Islands islands?** Owner question ([OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md), "regions: middle and north" 10). Work proceeds on the proposal: *The Shore* opens for every coastal crown and *Island Crowns* for every crown whose capital is an island state, both read from the map; the Zol rumour list stays the Zol mechanic's.
2. **Small crowns and the withdrawal.** Owner question (same file, "regions: middle and north" 9 and "lerendor" 5). Work proceeds on the proposal: each crown chooses by lean; nothing makes the choice history.
3. **The Hold: hill or coast?** Settled by the map: `zin_shared_has_coast` decides which branch it sees; no design depends on the answer.
