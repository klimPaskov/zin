# Shared tree: the North Lands crowns

**Status:** Draft. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

One focus tree for the twenty-two small crowns of the North Lands. Each is a lordship of one to three states between two masters: Sonargur across its own waters and Parim across the strait. The tree lets a small crown lean to one of them or keep its own counsel, build its hearths and harbours, watch for the black ships, and decide what it owes anyone when the old alliance ends and Zol's dead come ashore. Branches open by coast, island, ideology, overlord, Compact membership, people and region, so a coastal freehold, an inland hill lordship and an island principality read differently.

It implements the small-crown side of the [Treaty of the Narrow Strait mechanic](../../04_mechanics/lerendor_narrow_strait.md) and defines the helper effects the North Lands tier B trees ([../regional/north_lands.md](../regional/north_lands.md)) call.

| Item | Value |
| --- | --- |
| Tree id | `shared_north_lands` (focus ids `zin_shared_north_lands_<key>`) |
| Tier | C |
| Countries | Belg, Goran, Heodwa Lands, Pertawn, Solenkovi, The Hold, Allegro, Mine Din, Nuatax, Ashorn, Cinargo, Ferlinon, Filit, Gil'dul, Gul'dur, Keredor-Hellekton, Low-ness Islands, Mustnom, Oirt, Stork, Thowson, Tolhon |
| Focuses | 55; columns 0–24 |
| Events | namespace `zin_shared_north_lands` |
| Spirits | `zin_shared_north_lands_<key>` |

### The countries at the start

All twenty-two are men, Wild (Freeholds), independent and at peace, with `zin_footholds` 1 (Afrit spec: "other countries of men in the North Lands").

| Country | States | Start lean (Lerendor spec) | Notes |
| --- | ---: | ---: | --- |
| The Hold | 3 | 15 | Mina's neighbour (proposed); joins the Compact on Lerendor's historical route |
| Belg | 3 | 10 | |
| Tolhon | 1 | 10 | Island principality; the drawn Dul and Dur names are its districts (roster) |
| Goran, Heodwa Lands, Pertawn, Solenkovi | 3 each | 5 | |
| Allegro, Mine Din, Nuatax | 2 each | 5 | |
| Ashorn, Cinargo, Ferlinon, Filit, Gil'dul, Gul'dur, Keredor-Hellekton, Low-ness Islands, Mustnom, Oirt, Stork, Thowson | 1 each | 5 | Low-ness Islands is an island realm (proposed reading of the name) |

## Lore basis

- **Established:** the North Lands lie north of the Middle Lands across a narrow strait; Lerendor leads the Leren Compact; in the final war rulers in the North Lands withdraw from Aenoran alliances, and the North Lands are not one unanimous enemy; Zol's dead come through islands and straits, and ordinary weapons cannot end them; northern companies join Eindil's coalition without surrendering their independence; competing northern interests remain after the war.
- **Proposed in the vault:** the Treaty of the Narrow Strait (4A 512); island fishermen's tales of black ships (4A 1744).
- **Proposed in the specs:** each crown's lean toward Sonargur or Parim; the Compact decisions; the withdrawal in 4A 1755.
- **Proposed here:** every focus, spirit, event and number; the request for a Compact seat and for Parim's shield.
- **Kept open:** whether a small crown withdraws from Aenoran alliances on its own (here it is the crown's choice, never history); anything about Zol's servants or who governs the Mistake; the post-war order of the North.

## Design

### How the tree reads

- **Every crown** gets the root, *Between Sonargur and Parim*, *Hearth and Harbour*, *The Houses* and *The North at War*.
- **Coastal crowns** (`check zin_shared_has_coast`) get *The Shore*; **inland crowns** (not coastal) get *Hills and Forests*; **island realms** (`check zin_shared_is_island_realm`) also get *Island Crowns*.
- **By ideology:** Wild crowns get *The Freeholders' Moot*; Light crowns *The Free Towns' Council*; Dominion crowns *A Lord's Hand*. (All start Wild; the others open after a change of government.)
- **By overlord:** a subject of Lerendor gets *Under the Leren Banner*; a Compact member that is not a subject (`check zin_shared_north_in_compact`) gets *The Compact Member*.
- **By people:** men get *Kin of the North*.
- **By region:** crowns bordering a Dark Lands country (`check zin_shared_borders_dark_lands`) get *Across the Dark Straits*.

Text uses `[ROOT.GetName]` and `[ROOT.GetAdjective]`.

### Rules

- **Peace.** No focus makes a war goal or a claim. *The North at War* opens only from `zin_zol_rising`, `zin_war_of_last_crowns`, `zin_leren_withdrawal` or being at war.
- **The secret.** No text names Afrit or the Hidden Council; Aenor's king after 4A 1750 is "the new king in Parim".
- **Eindil.** Focus text says "the Heir"; never "Eindil".
- **Zol.** The black sails are rumours; no text names a servant of Zol or shows Zol.
- **Lean.** Every lean change goes through `zin_leren_add_lean` on ROOT.

### Notation

As in [../regional/north_lands.md](../regional/north_lands.md#effect-notation): `lean(v)`, `lean ≥ n`, `ask_compact`, `ask_parim`, Shore, End; and the Middle Lands notation (`pp`, `stab`, `ws`, `spirit`, `swap`, `bld`, `res`, `footholds(v)`, `regard(v)`, `coalition`). `allow:` marks a branch's `allow_branch`.

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

| Br. | Key | Name | Prerequisites | Excl. | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| — | `crown_of_the_north` | **The Crown of [ROOT.GetName]** | — | — | 14,0 | 35 | pp 50; stab 0.02 | 100 |
| A | `look_to_sonargur` | **Look to Sonargur** | crown_of_the_north | look_to_parim, our_own_counsel | 0,1 | 35 | lean(15) | 10 + lean; hist as lean |
| A | `look_to_parim` | **Look to Parim** | crown_of_the_north | look_to_sonargur, our_own_counsel | 2,1 | 35 | lean(−15) | 10 − lean |
| A | `our_own_counsel` | **Our Own Counsel** | crown_of_the_north | look_to_sonargur, look_to_parim | 4,1 | 35 | spirit `own_counsel` | 20 |
| A | `ask_for_a_compact_seat` | Ask for a Seat in the Compact | look_to_sonargur | — | 0,2 | 35 | Avail: lean ≥ 50; ROOT in no faction; Lerendor leads a faction. ask_compact | 60; hist only after 1752.1.1 |
| A | `envoys_to_parim` | Envoys to Parim | look_to_parim | — | 2,2 | 35 | ask_parim | 40 |
| A | `join_the_free_crowns` | Join the Free Crowns | our_own_counsel | — | 4,2 | 35 | Avail: Sensai has `zin_sensai_free_crowns` and leads a faction; ROOT in no faction. join_faction_of Sensai | 40; hist 0 |
| A | `trade_with_both_shores` | Trade with Both Shores | look_to_sonargur / look_to_parim / our_own_counsel | — | 2,3 | 70 | spirit `two_shore_trade` | 20 |
| A | `a_crown_among_crowns` | A Crown Among Crowns | trade_with_both_shores | — | 2,4 | 70 | pp 50; stab 0.05 | 20 |
| B | `hearth_and_harbour` | **Hearth and Harbour** | crown_of_the_north | — | 7,1 | 70 | bld industrial_complex 1 @capital | 40 |
| B | `timber_rights` | Timber Rights | hearth_and_harbour | — | 6,2 | 70 | bld industrial_complex 1 @random_owned | 30 |
| B | `village_roads` | Village Roads | hearth_and_harbour | — | 8,2 | 70 | bld infrastructure 1 @random_owned ×2 | 20 |
| B | `northern_smithies` | Northern Smithies | timber_rights | — | 6,3 | 70 | bld arms_factory 1 @capital | 20 |
| B | `grain_and_fish` | Grain and Fish | village_roads | — | 8,3 | 35 | spirit `grain_and_fish` | 30 |
| B | `market_fairs` | Market Fairs | northern_smithies / grain_and_fish | — | 7,4 | 70 | spirit `market_fairs` | 20 |
| B | `a_prosperous_crown` | A Prosperous [ROOT.GetAdjective] Crown | market_fairs | — | 7,5 | 70 | bld industrial_complex 1 @random_owned; stab 0.03 | 20 |
| C | `boats_and_nets` | **Boats and Nets** | crown_of_the_north | — | 11,1 | 35 | allow: `check zin_shared_has_coast`. spirit `fisherfolk` | 40 |
| C | `harbour_works` | Harbour Works | boats_and_nets | — | 10,2 | 70 | bld naval_base 1 @random_coastal; bld dockyard 1 @random_coastal | 30 |
| C | `watch_the_waters` | Watch the Waters | boats_and_nets | — | 12,2 | 35 | Avail: not `zin_zol_rising`. event `black_sails_seen` | 20 |
| C | `shore_towers` | Shore Towers | harbour_works | — | 10,3 | 70 | bld coastal_bunker 1 @random_coastal ×2 | 15; ×4 after `zin_zol_rising` |
| C | `galleys_of_the_crown` | Galleys of the Crown | watch_the_waters | — | 12,3 | 70 | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 | 15 |
| C | `the_shore_watch` | The Shore Watch | shore_towers / galleys_of_the_crown | — | 11,4 | 70 | spirit `shore_watch` | 20 |
| D | `hill_holds` | **Hill Holds** | crown_of_the_north | — | 15,1 | 70 | allow: not `check zin_shared_has_coast`. bld bunker 1 @capital; res [zin_cat_walls] 0.5 ×1 | 30 |
| D | `forest_trails` | Forest Trails | hill_holds | — | 14,2 | 35 | spirit `forest_trails` | 20 |
| D | `mines_in_the_hills` | Mines in the Hills | hill_holds | — | 16,2 | 70 | bld industrial_complex 1 @random_owned | 30 |
| D | `the_upland_levy` | The Upland Levy | forest_trails / mines_in_the_hills | — | 15,3 | 70 | mp 2000; army_xp 5 | 15 |
| E | `island_crown` | **An Island Crown** | crown_of_the_north | — | 17,1 | 35 | allow: `check zin_shared_is_island_realm`. spirit `island_crown` | 40 |
| E | `island_pilots` | Island Pilots | island_crown | — | 17,2 | 70 | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 | 20 |
| E | `the_isle_keeps` | The Isle Keeps | island_pilots | — | 17,3 | 70 | bld coastal_bunker 1 @capital ×2 | 15 |
| F | `the_freeholders_moot` | **The Freeholders' Moot** | crown_of_the_north | — | 19,1 | 35 | allow: ideology `wild`. spirit `freeholders_moot` | 40 |
| F | `old_rights_kept` | Old Rights Kept | the_freeholders_moot | — | 19,2 | 70 | swap freeholders_moot→freeholders_moot_2 | 30 |
| F | `the_free_towns_council` | The Free Towns' Council | crown_of_the_north | — | 20,1 | 35 | allow: ideology `light`. spirit `free_towns` | 40 |
| F | `elected_wardens` | Elected Wardens | the_free_towns_council | — | 20,2 | 70 | pp 50; stab 0.03 | 30 |
| F | `a_lords_hand` | A Lord's Hand | crown_of_the_north | — | 21,1 | 35 | allow: ideology `dominion`. pp 75 | 40 |
| F | `the_lords_men` | The Lord's Men | a_lords_hand | — | 21,2 | 70 | spirit `lords_men` | 30 |
| G | `under_the_leren_banner` | **Under the Leren Banner** | crown_of_the_north | — | 22,1 | 35 | allow: `subject_of` Lerendor. spirit `leren_banner` | 60 |
| G | `leren_garrisons` | Leren Garrisons | under_the_leren_banner | — | 22,2 | 70 | bld bunker 1 @capital; if coastal: bld coastal_bunker 1 @random_coastal | 30 |
| G | `sonargurs_trust` | Sonargur's Trust | leren_garrisons | — | 22,3 | 70 | lean(10); pp 50 | 30 |
| G | `the_compact_member` | **The Compact Member** | crown_of_the_north | — | 24,1 | 35 | allow: `check zin_shared_north_in_compact`. lean(5); spirit `compact_member` | 60 |
| G | `compact_fleet_duty` | Compact Fleet Duty | the_compact_member | — | 24,2 | 70 | navy_xp 10 | 30 |
| G | `compact_levies` | Compact Levies | compact_fleet_duty | — | 24,3 | 70 | army_xp 10; mp −500; lean(5) | 30 |
| H | `kin_of_the_north` | Kin of the North | crown_of_the_north | — | 1,6 | 35 | allow: people `men`. mp 1000; stab 0.02 | 30 |
| H | `northern_levies` | Northern Levies | kin_of_the_north | — | 1,7 | 70 | mp 1000; res [zin_cat_arms] 0.5 ×1 | 15 |
| H | `across_the_dark_straits` | **Across the Dark Straits** | crown_of_the_north | — | 3,6 | 35 | allow: `check zin_shared_borders_dark_lands`. spirit `dark_strait_watch` | 40 |
| H | `traders_of_the_dark_shore` | Traders of the Dark Shore | across_the_dark_straits | — | 3,7 | 70 | spirit `dark_shore_trade` | 20 |
| H | `whispers_from_the_holds` | Whispers from the Holds | traders_of_the_dark_shore | — | 3,8 | 35 | event `whispers_from_the_holds` | 20 |
| I | `temples_and_almshouses` | Temples and Almshouses | crown_of_the_north | — | 5,6 | 35 | stab 0.03; footholds(1); event `the_almoners_in_the_north` | 20; hist 40 |
| I | `a_watchful_crown` | A Watchful Crown | temples_and_almshouses | — | 5,7 | 35 | Avail: `zin_afrit_revealed`, or ROOT has `zin_afrit_suspicious`. spirit `houses_watched` | 100 once available |
| J | `the_north_at_war` | **The North at War** | — | — | 12,6 | 35 | Avail: Shore. ws 0.10; spirit `north_at_war` | 100 |
| J | `beacons_on_the_capes` | Beacons on the Capes | the_north_at_war | — | 10,7 | 70 | Avail: `zin_zol_rising`; `check zin_shared_has_coast`. bld coastal_bunker 1 @random_coastal ×2 | 100 |
| J | `stand_apart_with_sonargur` | Stand Apart with Sonargur | the_north_at_war | keep_faith_with_parim | 12,7 | 35 | Avail: `zin_leren_withdrawal`. lean(10); stab 0.03 | 50 + lean; hist: lean ≥ 0 |
| J | `keep_faith_with_parim` | Keep Faith with Parim | the_north_at_war | stand_apart_with_sonargur | 14,7 | 35 | Avail: `zin_leren_withdrawal`; an Aenor realm holds Parim; ROOT not in Lerendor's faction. lean(−20); event_for that realm `a_northern_crown_keeps_faith` | 50 − lean; hist: lean < 0 |
| J | `against_the_deathless` | Against the Deathless | the_north_at_war | — | 10,8 | 70 | Avail: `zin_zol_rising`. army_xp 10; tooltip "Ordinary arms break Zol's dead; they do not end them." | 80 |
| J | `northern_companies` | Northern Companies | the_north_at_war | — | 12,8 | 70 | Avail: `zin_eindil_returned`. coalition; regard(10); army_xp 5 | 30 + regard; hist 40 |
| J | `the_shore_quiet` | The Shore Is Quiet | beacons_on_the_capes / stand_apart_with_sonargur / keep_faith_with_parim / against_the_deathless / northern_companies | — | 12,9 | 70 | Avail: End. stab 0.10; remove `north_at_war` | 100 |

**Total: 55 focuses.** A coastal Wild crown sees about 44; an inland one about 41.

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `own_counsel` | Our Own Counsel | `drift_defence_factor` 0.15, `political_power_gain` 0.05 |
| `two_shore_trade` | Trade with Both Shores | `trade_opinion_factor` 0.10 |
| `grain_and_fish` | Grain and Fish | `monthly_population` 0.05, `stability_factor` 0.02 |
| `market_fairs` | Market Fairs | `trade_opinion_factor` 0.10, `consumer_goods_factor` −0.02 |
| `fisherfolk` | Boats and Nets | `monthly_population` 0.03, `consumer_goods_factor` −0.01 |
| `shore_watch` | The Shore Watch | `naval_detection` 0.10, `coastal_bunker_effectiveness_factor` 0.10 |
| `forest_trails` | Forest Trails | `army_defence_factor` 0.05, `attrition` −0.05 |
| `island_crown` | An Island Crown | `naval_detection` 0.05, `army_core_defence_factor` 0.05 |
| `freeholders_moot` | The Freeholders' Moot | `stability_factor` 0.03, `political_power_gain` 0.05 |
| `freeholders_moot_2` | Old Rights Kept | `stability_factor` 0.05, `political_power_gain` 0.10, `drift_defence_factor` 0.10 |
| `free_towns` | The Free Towns' Council | `stability_factor` 0.05, `opinion_gain_monthly_factor` 0.10 |
| `lords_men` | The Lord's Men | `political_power_factor` 0.10, `stability_factor` −0.03 |
| `leren_banner` | Under the Leren Banner | `army_org_factor` 0.03, `stability_factor` 0.03 |
| `compact_member` | The Compact Member | `faction_trade_opinion_factor` 0.10 |
| `dark_strait_watch` | Across the Dark Straits | `army_intel_factor` 0.10 |
| `dark_shore_trade` | Traders of the Dark Shore | `trade_opinion_factor` 0.10 |
| `houses_watched` | A Watchful Crown | `drift_defence_factor` 0.20 |
| `north_at_war` | The North at War | `army_core_defence_factor` 0.10, `war_support_factor` 0.05 |

### Events (namespace `zin_shared_north_lands`)

All are fired by effects. `FROM` is the crown that asks.

| Key (id) | Title | To | Fired by | Options |
| --- | --- | --- | --- | --- |
| `a_crown_asks_to_join` (1) | [FROM.GetName] Asks for a Seat | Lerendor | `zin_north_ask_compact_seat` | **Welcome them to the Compact** (Lerendor `add_to_faction = FROM`; opinion modifier `zin_leren_compact_kin` both ways; FROM lean(10); AI 50 + FROM's lean ÷ 2; ×0 if FROM is guaranteed by an Aenor realm and the treaty stands) / **Not yet** (FROM lean(−5)) |
| `a_northern_crown_asks_for_a_shield` (2) | [FROM.GetName] Asks for Parim's Shield | the Aenor realm holding Parim | `zin_north_ask_parim_shield` | **Guarantee them** (guarantee FROM; FROM lean(−10); opinion +15 both ways; AI 40, +30 if Lerendor is on the supremacy route, −20 while the Golden King lives and `zin_court_corruption` ≥ 70) / **The North is Sonargur's affair** (FROM lean(5)) |
| `black_sails_seen` (3) | Black Sails Seen | ROOT | *Watch the Waters* | Fishermen tell of black sails among the far islands. **Old wives' tales** (nothing; AI hist 80) / **Send a boat to look** (pp −25; country flag `zin_zol_forewarned`, so the Zol mechanic gives ROOT its forewarned idea at the rising). The text never says what the sails are |
| `the_almoners_in_the_north` (4) | The Almoners in the North | ROOT | *Temples and Almshouses* | Flavour; **Welcome them** (stab 0.01) |
| `whispers_from_the_holds` (5) | Whispers from the Holds | ROOT | *Whispers from the Holds* | Traders say gifts come to the orc holds from the south. **Note it** (flag `zin_north_heard_whispers`) / **Tell Sonargur** (lean(3)). Reveals nothing of Volgan's plans |
| `a_northern_crown_keeps_faith` (6) | [FROM.GetName] Keeps Faith | Aenor realm | *Keep Faith with Parim* | **Accept their companies** (guarantee FROM; military access both ways; opinion +25; AI 70) / **Parim needs no northern swords** |

The mechanic-owned events `zin_leren.51` (the dead on the northern shore), `zin_leren.70` (Lerendor's invitation) and `zin_leren.71` (protection) and the flavour event `zin_lore.180` (black ships) also reach these crowns.

### Helper scripts (defined by this tree, used by the North Lands tier B trees)

| Name | Kind | Does |
| --- | --- | --- |
| `zin_north_ask_compact_seat` | scripted effect | If Lerendor exists, leads a faction and ROOT is in no faction: fires `zin_shared_north_lands.1` to Lerendor |
| `zin_north_ask_parim_shield` | scripted effect | Fires `zin_shared_north_lands.2` to the Aenor realm holding Parim (`zin_is_site_parim`); does nothing if none |
| `zin_shared_north_in_compact` | scripted trigger | ROOT `is_in_faction_with` Lerendor and is not a subject of Lerendor |
| `zin_shared_has_coast`, `zin_shared_is_island_realm`, `zin_shared_borders_dark_lands` | scripted triggers | Defined once for all shared trees (see [shared_concord_dominions.md](shared_concord_dominions.md#helper-scripts-defined-by-this-tree-used-by-the-middle-lands-tier-b-trees)) |

## Implementation

| Path | What |
| --- | --- |
| `docs/design/focus/shared_north_lands.json` | Tree data; `"tier": "shared"`, the twenty-two countries |
| `common/national_focus/zin_shared_north_lands.txt` | Compiled tree |
| `common/ideas/zin_focus_shared_north_lands.txt` | Spirits |
| `events/zin_shared_north_lands.txt` | Events 1–6 |
| `common/scripted_effects/zin_shared_north_lands.txt`, `common/scripted_triggers/zin_shared_north_lands.txt` | Helper scripts |
| `localisation/english/zin_focus_shared_north_lands_l_english.yml` | Text with `[ROOT.GetName]`, `[ROOT.GetAdjective]`, `[FROM.GetName]` |

**Advisors.** Each crown keeps three generated political advisors from the North Lands name pool: `zin_adv_road_warden`, `zin_adv_muster_master`, `zin_adv_merchant_prince` (Wild); a crown that turns Light swaps the muster-master for `zin_adv_envoy`.

**Icons:** `crown_iron`, `two_crowns`, `envoy`, `handshake_oath`, `banner_league`, `scroll_treaty`, `timber_mill`, `roads_paved`, `forge_anvil`, `granary`, `market_stalls`, `fishing_boats`, `harbour_lake`, `eye_watchful`, `lighthouse`, `galley_oars`, `fort_wall`, `mountain_pass`, `mine_cart`, `spear_levy`, `sea_charts`, `council_table`, `seal_royal`, `house_first_light`, `beacon`, `black_hulls`, `storm_sea`, `lone_sword`. Pictures: `generic_court`, `leren_envoys`, `black_ships_tale`, `houses`, `generic_sea`.

## AI

- **Historical:** root; B; A by start lean: crowns with lean ≥ 10 (The Hold, Belg, Tolhon) *Look to Sonargur*, the rest *Our Own Counsel*; *Ask for a Seat in the Compact* when lean reaches 50 after 4A 1752 (the Hold historically); C or D; *Watch the Waters* (disbelieve); J when available: *Stand Apart with Sonargur* for every crown with lean ≥ 0, *Keep Faith with Parim* for the rest; *Against the Deathless* and *Beacons on the Capes* after `zin_zol_rising`; *Northern Companies* in 4A 1757 for about half of them (AI 40).
- **Free:** lean decides A and J; *Join the Free Crowns* weight 40 when Sensai has founded it and lean is between −20 and 20.

## Acceptance

1. The compiler builds the tree with 55 focuses, unique positions, every focus below its prerequisites, symmetric exclusions and no `raw` blocks; all twenty-two countries map to it.
2. Tolhon sees *An Island Crown* and *The Shore*; an inland crown sees *Hills and Forests* and not *The Shore*; nobody sees *Under the Leren Banner* at the start.
3. On 1 Thaw 4A 1748 no available focus declares war or creates a claim or war goal; *The North at War* is unavailable.
4. A crown that takes *Watch the Waters* and sends a boat has `zin_zol_forewarned`; at `zin_zol_rising` the Zol mechanic gives it the forewarned idea.
5. *Ask for a Seat in the Compact* with Lerendor AI at lean 60 adds the crown to Lerendor's faction in about 80 % of tries; Lerendor's hegemony rises on the next monthly update.
6. Every modifier in the spirit table exists in the game's modifier documentation; the secret scan finds no "Afrit" and no "Eindil".
7. Historical observer run: by 1 Deepwinter 4A 1754 The Hold is in the Leren Compact; no crown of this tree is at war before `zin_war_of_last_crowns` or `zin_zol_rising`.

## Open questions

1. **Which crowns face the Ocean of Zol?** The shore focuses read `zin_shared_has_coast`; the Zol mechanic's rumour list is generated from coasts on the Ocean of Zol. Should the shore branch open only for that list?
2. **Small crowns and the withdrawal.** Here each crown chooses to stand apart or keep faith. Should the historical path make every North Lands crown stand apart with Sonargur?
3. **Low-ness Islands.** Is it an island realm (as its name suggests), and is Tolhon a single island?
4. **The Hold.** The Lerendor spec pairs it with Mina; is it a hill lordship (as proposed) or a coastal one?
