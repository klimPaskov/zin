# Regional Trees: The Magical Lands

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier B).

## Purpose

This spec gives the five tier B elven realms of the Magical Lands their own focus trees: **Lccimio**, **The End**, **Herrodon**, **Andos Enda** and **Nolorim** ([../01_tiers_and_coverage.md](../01_tiers_and_coverage.md)). The Magical Forest ([../major/magical_forest.md](../major/magical_forest.md)) and the Worshipdom ([../major/worshipdom.md](../major/worshipdom.md)) have major trees; the fifteen other elven realms share [../shared/shared_magical_lands.md](../shared/shared_magical_lands.md).

Every tree plays the mechanic [The Elves of the Magical Lands, the Wall and the Dragons](../../04_mechanics/elves_wall_and_dragons.md) from a smaller realm's seat: the Kinship and the Kindred of the Woods, the Elven Refusal and the Wanderers, the Wall's customs quarrel, the pilgrim roads to the Zilin Hills, the old rivalry of Herrodon and Andos Enda, Nolorim's high passes, the dragons of Dragon Mountain, the eastern invasion across the rift, and (where a realm faces it) the black north of Zol's Mistake.

| Tree id | Country | Focuses | Grid | Events | Spirits |
| --- | --- | ---: | --- | --- | --- |
| `regional_lccimio` | Lccimio | 40 | x 0–21, y 0–9 | `zin_regional_lccimio` | `zin_regional_lccimio_<key>` |
| `regional_the_end` | The End | 39 | x 0–20, y 0–9 | `zin_regional_the_end` | `zin_regional_the_end_<key>` |
| `regional_herrodon` | Herrodon | 34 | x 0–18, y 0–8 | `zin_regional_herrodon` | `zin_regional_herrodon_<key>` |
| `regional_andos_enda` | Andos Enda | 36 | x 0–21, y 0–8 | `zin_regional_andos_enda` | `zin_regional_andos_enda_<key>` |
| `regional_nolorim` | Nolorim | 32 | x 0–18, y 0–8 | `zin_regional_nolorim` | `zin_regional_nolorim_<key>` |

## Lore basis

**Established** (vault): the elves of the Magical Lands were never conquered, not even by Elzon, and through the Third Age resisted him to defend their own lands; after Edran's failed attack on the Dead Lands the elven kingdoms sent no armies to help men, and this must not be rewritten as a new alliance in the final invasion; individual travellers, healers or independent figures may cooperate across peoples (*The Elven Refusal*). The Magical Lands lie east of the Middle Lands on the same landmass, with the Magical Forest, the Mushroom Forest, the Magic Mountains, Herrodon, Andos Enda and Nolorim; a long rift sea separates them from the East Lands (*Erdae and Its Regions*). Nolorim must stay a separate country (*Great Powers and Relations*). Dragons come chiefly from Dragon Mountain and form no country; elven powers can command them (*Peoples of Erdae*). Varner is a Lesser Spirit of the Magical Lands (*Varner*). In the final war an eastern coalition crosses seas and mountain approaches to threaten the Magical Lands (*The Fourth Age of Erdae*). The Great Wall of Aenor separates the Middle Lands from the Magical Lands (owner, 17 October 2026). The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace (owner, 18 October 2026).

**Working table (not fixed canon):** Herrodon and Andos Enda are rivals; the table also lists Andos Enda in Lerendor's Leren Compact (left open here).

**Proposed elsewhere and used here:** the Wall Accord of 4A 96; the pilgrim roads and the Worshipdom as a hermitage of about 4A 1520 (vault chronology); "Nolorim guards the high passes" (role proposed); the rulers Elder Lusmio, Warden Endaril, Queen Herrowyn, Speaker Andosiel and Pass-Warden Nolwe ([../../02_lore/02_characters.md](../../02_lore/02_characters.md)); every mechanic name of the elves spec (kinship, the Kindred, rivalry, the Feud of the Groves, the Wall grievance, the pass watch, the roost bond, the Wanderers, pilgrim-road policy).

**Proposed here:** every focus, spirit, event, advisor and number; Lccimio as "the Long Shore"; the Archive of the End; Herrodon as a crowned realm among councils and its "lost kin" in Sacomananos and Velakton; Andos Enda's federation of groves; all character names below.

**Kept open (no text closes them):** whether Andos Enda belongs to the Leren Compact; whether the black areas of the Magical Lands sheet belong to Zol's Mistake (the "black north" branch opens only where the map makes a realm face it); where Varner is; who keeps Dragon Mountain; whether the Mushroom Forest's mycids form a polity; how the elves fare against the eastern invasion. No text says the elves will march, links the Deliverer to Afrit before `zin_afrit_revealed`, or names Eindil before `zin_eindil_named`.

## Design

### Rules for every tree in this spec

- **Peaceful start.** Nothing available on 1 Thaw 4A 1748 declares war, creates a war goal or a claim. The start spirit `zin_elves_the_old_refusal` (justify war goal time +100%) stays. War branches sit in rows 6 and below and need `at_war` plus a non-elven enemy holding the realm's state, or `zin_eastern_invasion`. The only war goal in this spec is the Feud of the Groves, behind the mechanic's own gates (rivalry ≥ 90, after 1 Thaw 4A 1750, never by the historical AI).
- **The Refusal holds.** No focus here joins a human faction, sends volunteers or sets `zin_refusal_lifted`. Elves helping elves (the Kindred) and Wanderers (healers and wardens as individuals) are the only help that crosses borders.
- **Secret-safe text.** The Deliverer is `[zin_loc_deliverer]`; Eindil is `[zin_loc_eindil]`; focus names never contain either name.
- **Prerequisites.** Every prerequisite and exclusive names a focus key of the same tree: `a + b` is and, `a / b` is or; "excl" lists the focuses it excludes, and each pair is listed on both sides. A focus with no "←" in its entry has no prerequisite: every row-0 focus and every branch head in rows 6 and below. A branch head's gate is its `available` (and `allow_branch` where stated).
- **Entries** read ``- `key` Name (x,y; days; ← prerequisites; excl exclusives) `icon`: effects. AI.`` The icon is a key of the [icon catalog](../02_icon_catalog.md) (sprite `GFX_focus_zin_<key>`); each spirit uses the icon of the focus that adds it.
- **Days** are 35 unless marked 70; war focuses may be 21.
- **AI** is `ai.base`; "hist ×f" and "free ×f" are AI modifiers while `check zin_rules_is_historical` or `check zin_rules_is_free` holds; "march" = `check zin_rules_ai_branch_elves_march`. "AI 0; n when available" is base n with the focus's `available` as its gate. Research "[cat] 50% ×1" is the compiler's `research` effect (bonus 0.5, one use) on a warfare category.

### Notation

| Shorthand | Effect |
| --- | --- |
| kinship ±n | `call zin_elves_add_kinship(value = n)` |
| rivalry ±n | `call zin_elves_add_rivalry(value = n)` |
| grievance ±n | `call zin_elves_add_wall_grievance(value = n)` |
| bond ±n | `call zin_elves_add_roost_bond(value = n)` |
| pass watch ±n | `call zin_elves_add_pass_watch(value = n)` |
| goodwill X | `call zin_elves_goodwill(target = X)` (`zin_opinion_elven_goodwill` both ways) |
| roads n | `call zin_elves_set_pilgrim_roads(value = n)` (2 open, 1 tolled, 0 closed) |
| footholds ±n | `call zin_afrit_add_footholds(value = n)` on ROOT (respects the elven cap of 2) |
| join the Kindred | `call zin_elves_join_kindred` on ROOT (proposed elves effect: the accept option of `zin_elves.31`) |
| regard ±n, renown ±n | `call zin_eindil_add_regard(value = n)`, `call zin_eindil_add_renown(value = n)` |
| opinion X ±n (k) | `call zin_<tree>_opinion(who = X, modifier = k)` (tree-declared opinion modifier) |
| @boundary_groves | building location: the state with `zin_is_site_boundary_groves` |

---

## Lccimio

### Situation in 4A 1748

Lccimio is the Long Shore (proposed): fourteen provinces of orchards, wellsprings and white quays along the western coast of the rift sea, the second-largest elven realm after the Magical Forest. Its council of elder houses is presided over by Elder Lusmio, who has sat in it longer than Aenor has had its present dynasty. Lccimio's shipwrights build the only elven sails on the rift, and its merchants know the eastern quays. It is rich, patient and unhurried. Its houses remember Edran's folly and keep the Refusal; they also remember that the rift is narrow.

### Role

- **Historical path (proposed):** Lccimio watches the rift, sends healers abroad, keeps the pilgrim roads open, and hears eastern merchants talk of ships (4A 1752–1754). When the eastern coalition crosses (4A 1755) Lccimio is among the first realms struck. It joins the Kindred, defends its shore, and accepts the white peace the mechanic offers when the invader holds no Magical Lands state (`zin_elves.73`). How that war goes is left to play. After the reveal it closes the pilgrim roads.
- **Alternatives:** a forewarned Lccimio fortifies the shore early (*Shore Wardens*); a Lccimio that tolls the pilgrims; a Lccimio with the Open Houses' research bent.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Lccimio>_zin_ruler` | Elder Lusmio | Country leader, `zin_light_kinship` | — |
| `zin_regional_lccimio_saelith` | Saelith of the Long Shore | Political advisor | `zin_adv_sage` |
| `zin_regional_lccimio_ithiren` | Ithiren Wavecall | Political advisor | `zin_adv_envoy` |
| `zin_regional_lccimio_merael` | Merael Rootwarden | Political advisor | `zin_adv_road_warden` |
| `zin_regional_lccimio_caladhel` | Caladhel of the Quays | Corps commander, skill 3 | `ranger` |

### Tree `regional_lccimio` (40 focuses)

**A. The Elders of Lccimio** (x 0–2, rows 0–4). Exclusive: *The Old Houses Hold* / *The Open Houses*.
- `elders_of_lccimio` The Elders of Lccimio (1,0; 70) `elven_council`: political_power 50; event `elders_gather`. AI 40.
- `lusmios_counsel` Lusmio's Counsel (0,1; ← elders_of_lccimio) `book_lore`: add_spirit `lusmios_counsel_spirit`. AI 20.
- `houses_of_the_long_shore` Houses of the Long Shore (2,1; ← elders_of_lccimio) `tree_silver`: stability 0.05. AI 20.
- `the_patient_council` The Patient Council (1,2; ← lusmios_counsel + houses_of_the_long_shore) `council_table`: political_power 50. AI 15.
- `the_old_houses_hold` The Old Houses Hold (0,3; ← the_patient_council; excl the_open_houses) `forest_ancient`: add_spirit `old_houses`. AI 20; hist ×2.
- `the_open_houses` The Open Houses (2,3; ← the_patient_council; excl the_old_houses_hold) `elven_council`: add_spirit `open_houses`. AI 15.
- `council_of_the_long_shore` Council of the Long Shore (1,4; ← the_old_houses_hold / the_open_houses; 70) `elven_council`: political_power 75; stability 0.03. AI 15.

**B. Groves and Wellsprings** (x 4–6, rows 0–3).
- `groves_of_lccimio` Groves of Lccimio (5,0; 70) `forest_ancient`: building industrial_complex 1 @random_owned. AI 30.
- `wellsprings_of_the_shore` Wellsprings of the Shore (4,1; ← groves_of_lccimio) `tree_silver`: add_spirit `wellsprings`. AI 20.
- `orchard_roads` Orchard Roads (6,1; ← groves_of_lccimio) `roads_paved`: building infrastructure 1 @random_owned (twice). AI 15.
- `shipwrights_of_the_shore` Shipwrights of the Shore (4,2; ← wellsprings_of_the_shore) `shipwright_yard`: building dockyard 1 @random_coastal. AI 15.
- `grove_workshops` Grove Workshops (6,2; ← orchard_roads) `workshop_tools`: building industrial_complex 1 @random_owned. AI 15.
- `the_long_shore_prospers` The Long Shore Prospers (5,3; ← shipwrights_of_the_shore + grove_workshops; 70) `market_stalls`: add_spirit `long_shore_prospers`. AI 15.

**C. The Watch on the Rift** (x 7–9, rows 0–3). `allow_branch` and `available` on the head: check `zin_elves_is_rift_realm`.
- `watch_on_the_rift` The Watch on the Rift (8,0; 70) `lighthouse`: add_spirit `rift_watch`; navy_experience 5. AI 30.
- `beacons_of_lccimio` Beacons of Lccimio (7,1; ← watch_on_the_rift) `beacon`: building coastal_bunker 1 @random_coastal. AI 15.
- `elven_sails_of_the_shore` Elven Sails of the Shore (9,1; ← watch_on_the_rift) `warship_sail`: research [zin_cat_galleys] 50% ×1; building dockyard 1 @random_coastal. AI 15.
- `talk_on_the_eastern_quays` Talk on the Eastern Quays (8,2; ← beacons_of_lccimio / elven_sails_of_the_shore) `envoy`: Avail: after 1752.3.1 or global variable `zin_gathering_dark` above 29. event `eastern_quays`. AI 20.
- `shore_wardens` Shore Wardens (8,3; ← talk_on_the_eastern_quays; 70) `ranger_cloak`: manpower 3000; building coastal_bunker 1 @random_coastal. AI 10; ×5 with flag `zin_regional_lccimio_forewarned`.

**D. Kin of the Woods** (x 10–12, rows 0–2).
- `kin_of_the_woods` Kin of the Woods (11,0) `alliance_rings`: kinship +3; goodwill Magical Forest. AI 30.
- `answer_the_elder_moot` Answer the Elder Moot (10,1; ← kin_of_the_woods) `elven_council`: Avail: global variable `zin_elves_kinship` above 39. kinship +5; political_power 25. AI 20.
- `songs_with_the_forest` Songs with the Forest (12,1; ← kin_of_the_woods) `hymn_choir`: research [zin_cat_wards] 50% ×1. AI 20.
- `wardens_for_the_passes` Wardens for the Passes (10,2; ← answer_the_elder_moot) `mountain_pass`: Avail: exists Nolorim. pass watch +5; kinship +2. AI 15.
- `stand_with_the_kindred` Stand with the Kindred (12,2; ← songs_with_the_forest) `banner_league`: Avail: check `zin_elves_kindred_exists`; ROOT not in the Kindred. join the Kindred. AI 0; 300 when available.

**E. Healers, Not Hosts** (x 13–15, rows 0–2). The Refusal and the Wanderers.
- `healers_of_lccimio` Healers of Lccimio (14,0) `healer_herbs`: flag `zin_elves_wanderers_extra`; political_power 25. AI 25.
- `the_wizards_trail` The Wizard's Trail (13,1; ← healers_of_lccimio) `wizard_tower`: Avail: global variable `zin_gathering_dark` above 24, or global_flag `zin_eindil_named`, or global_flag `zin_zol_rising`. research [zin_cat_wards] 50% ×1; political_power 25. Text never says where Varner is. AI 15.
- `the_refusal_kept` The Refusal Kept (15,1; ← healers_of_lccimio) `banner_plain`: Avail: check `zin_elves_refusal_question_open`. stability 0.05; kinship +3. AI 10; hist ×5.
- `wardens_for_friends` Wardens for Friends (14,2; ← the_wizards_trail / the_refusal_kept) `ranger_cloak`: Avail: global_flag `zin_war_of_last_crowns`. political_power 50; army_experience 5. AI 30.

**F. Pilgrims on the Shore Road** (x 16–18, rows 0–2). `allow_branch` and `available` on the head: check `zin_elves_is_pilgrim_road_realm`. Exclusive: *Keep the Roads Open* / *Toll the Pilgrims*.
- `pilgrims_on_the_shore_road` Pilgrims on the Shore Road (17,0) `courier_pilgrim`: event `pilgrims_pass`. AI 20.
- `keep_the_roads_open` Keep the Roads Open (16,1; ← pilgrims_on_the_shore_road; excl toll_the_pilgrims) `traders_road`: roads 2; stability 0.02. AI 20; hist ×2.
- `toll_the_pilgrims` Toll the Pilgrims (18,1; ← pilgrims_on_the_shore_road; excl keep_the_roads_open) `toll_house`: roads 1; political_power 25. AI 10.
- `the_temple_on_the_road` The Temple on the Road (17,2; ← keep_the_roads_open / toll_the_pilgrims) `hermitage_hills`: Avail: global_flag `zin_afrit_revealed`. roads 0; footholds −1; stability 0.05. AI 0; 100 when available.

**G. Lccimio's Wardens** (x 19–21, rows 0–2). Army.
- `wardens_of_lccimio` Wardens of Lccimio (20,0; 70) `ranger_cloak`: research [zin_cat_bows] 50% ×1; army_experience 5. AI 25.
- `longbow_companies` Longbow Companies (19,1; ← wardens_of_lccimio) `elven_bow`: equipment zin_elven_arms_equipment 300. AI 15.
- `grove_riders` Grove Riders (21,1; ← wardens_of_lccimio) `white_deer`: research [zin_cat_mounts] 50% ×1. AI 10.
- `elder_wardens` Elder Wardens (20,2; ← longbow_companies + grove_riders; 70) `elven_bow`: add_spirit `elder_wardens_spirit`. AI 15.

**H. The Rift Burns** (x 7–11, rows 6–9). Head available when `at_war` and (global_flag `zin_eastern_invasion` or check `zin_elves_eastern_threat`).
- `the_rift_burns` The Rift Burns (9,6; no prerequisite; 21) `storm_sea`: war_support 0.10; army_experience 10. AI 0; 500 when available.
- `every_grove_a_fortress` Every Grove a Fortress (8,7; ← the_rift_burns; 21) `fort_wall`: building bunker 2 @random_coastal; manpower 3000. AI 100.
- `the_kin_ride_to_the_shore` The Kin Ride to the Shore (10,7; ← the_rift_burns; 21) `banner_league`: kinship +10; war_support 0.05. AI 100.
- `into_the_rift_sea` Into the Rift Sea (9,8; ← every_grove_a_fortress / the_kin_ride_to_the_shore; 70) `elven_bow`: timed_spirit `shore_holds` 365. AI 100.
- `the_shore_is_quiet` The Shore Is Quiet (9,9; ← into_the_rift_sea) `olive_branch`: Avail: check `zin_regional_lccimio_east_quiet` (not at war with any country with `zin_region_east_lands`). stability 0.10; kinship +5; remove_spirit `shore_holds`. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `talk_on_the_eastern_quays` | Talk on the Eastern Quays | beacons / sails; from 4A 1752 or Gathering Dark 30 | Event: warn the kin (kinship +3; `zin_regional_lccimio_forewarned`; the Magical Forest gets `zin_magical_forest_forewarned_east`) or profit (political power 50). Text tells of eastern courts building ships; it never names who stands behind them |
| `shore_wardens` | Shore Wardens | talk_on_the_eastern_quays | 3,000 manpower and a coastal fort; the AI rushes it when forewarned |
| `stand_with_the_kindred` | Stand with the Kindred | songs_with_the_forest; the Kindred exists | Joins the Kindred of the Woods (elves helping elves; the Refusal is untouched) |
| `healers_of_lccimio` | Healers of Lccimio | — | `zin_elves_wanderers_extra`: Lccimio may keep three Wanderer missions instead of two, each 10 political power cheaper |
| `the_temple_on_the_road` | The Temple on the Road | a pilgrim policy; `zin_afrit_revealed` | Closes the roads, footholds −1 |
| `the_rift_burns` | The Rift Burns | — (war gate) | War support +10%; the war branch opens |
| `the_shore_is_quiet` | The Shore Is Quiet | into_the_rift_sea | Peace spirit; kinship +5 once no East Lands enemy remains |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `lusmios_counsel_spirit` | Lusmio's Counsel | `research_speed_factor` 0.03, `stability_factor` 0.03 | `lusmios_counsel` |
| `old_houses` | The Old Houses Hold | `drift_defence_factor` 0.15, `stability_factor` 0.05 | `the_old_houses_hold` |
| `open_houses` | The Open Houses | `research_speed_factor` 0.05, `opinion_gain_monthly_factor` 0.10 | `the_open_houses` |
| `wellsprings` | Wellsprings of the Shore | `production_factory_efficiency_gain_factor` 0.05 | `wellsprings_of_the_shore` |
| `long_shore_prospers` | The Long Shore Prospers | `consumer_goods_factor` −0.03, `production_speed_buildings_factor` 0.05 | `the_long_shore_prospers` |
| `rift_watch` | The Watch on the Rift | `naval_detection` 0.10, `army_intel_factor` 0.05 | `watch_on_the_rift` |
| `elder_wardens_spirit` | Elder Wardens | `army_org_factor` 0.05, `army_defence_factor` 0.05 | `elder_wardens` |
| `shore_holds` | The Shore Holds | `army_defence_factor` 0.10, `army_core_defence_factor` 0.10 | timed, 365 days; removed by `the_shore_is_quiet` |

### Events (namespace `zin_regional_lccimio`)

| # | Key | Title | Picture | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `elders_gather` | The Elders Gather | `generic_wilds` | Lccimio | The Elders of Lccimio | "The old voices first." (stability 0.03) / "Let the young houses speak." (research bonus [zin_cat_wards] 25% ×1) |
| 2 | `eastern_quays` | Talk on the Eastern Quays | `generic_sea` | Lccimio | Talk on the Eastern Quays | "Warn the kin." (kinship +3; flag `zin_regional_lccimio_forewarned`; for_country Magical Forest: flag `zin_magical_forest_forewarned_east`; AI 70) / "Trade is trade." (political_power 50; AI 30) |
| 3 | `pilgrims_pass` | Pilgrims on the Shore Road | `hermitage` | Lccimio | Pilgrims on the Shore Road | One option. Text: pilgrims of `[zin_loc_deliverer]` pass through the orchards toward the Zilin Hills, polite and footsore |

### Historical AI route

| When | Focuses |
| --- | --- |
| 1748–1749 | elders_of_lccimio, groves_of_lccimio, kin_of_the_woods, watch_on_the_rift, lusmios_counsel, houses_of_the_long_shore, wellsprings_of_the_shore, pilgrims_on_the_shore_road, keep_the_roads_open |
| 1750–1752 | the_patient_council, the_old_houses_hold, healers_of_lccimio, orchard_roads, beacons_of_lccimio, elven_sails_of_the_shore, answer_the_elder_moot, songs_with_the_forest, wardens_of_lccimio |
| 1752–1754 | talk_on_the_eastern_quays (warn the kin), shore_wardens, the_refusal_kept, wardens_for_the_passes, council_of_the_long_shore, the_wizards_trail |
| 1755 onward | the war branch on `zin_eastern_invasion`; stand_with_the_kindred when raised; the_temple_on_the_road after the reveal; the rest |

---

## The End

### Situation in 4A 1748

The End is the realm at the end of the old roads (proposed), where the Magical Lands run out toward the rift and the cold sea: thirteen provinces and the largest elven population of the region. A Warden, Endaril, presides over its houses; the office is old and the Wardens have been few. The End keeps the Archive of the End, a library of rolls older than Aenor's crown that its scholars still copy by hand, and a watch of towers on its last shore. Its people are the most numerous elves of the Magical Lands, and the least eager to leave home.

### Role

- **Historical path (proposed):** The End watches the rift and its northern waters, copies its archive, and keeps the Refusal. If its shore faces the black north, its fishers tell of black ships and the Warden sends a boat (`zin_zol_forewarned`). It is struck by the eastern coalition in 4A 1755, joins the Kindred and defends its shore. After `zin_eindil_named`, its archive's rolls of the First Men add to the heir's renown.
- **Alternatives:** a Warden for life or Wardens by turns; an End that builds a great watch with its manpower.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<The End>_zin_ruler` | Warden Endaril | Country leader, `zin_light_kinship` | — |
| `zin_regional_the_end_telurin` | Archivist Telurin | Political advisor | `zin_adv_sage` |
| `zin_regional_the_end_ninaeth` | Ninaeth of the Last Shore | Political advisor | `zin_adv_elder` |
| `zin_regional_the_end_faelor` | Faelor Silversail | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_the_end_rhovain` | Rhovain of the Towers | Corps commander, skill 3 | `ranger` |

### Tree `regional_the_end` (39 focuses)

**A. The Warden's Seat** (x 0–2, rows 0–4). Exclusive: *A Warden for Life* / *Wardens by Turns*.
- `seat_of_the_warden` The Warden's Seat (1,0; 70) `elven_council`: political_power 50; event `the_warden_speaks`. AI 40.
- `endarils_watch` Endaril's Watch (0,1; ← seat_of_the_warden) `eye_watchful`: add_spirit `endarils_watch_spirit`. AI 20.
- `the_houses_of_the_end` The Houses of the End (2,1; ← seat_of_the_warden) `tree_silver`: stability 0.05. AI 20.
- `the_long_memory` The Long Memory (1,2; ← endarils_watch + the_houses_of_the_end) `book_lore`: political_power 50. AI 15.
- `wardens_for_life` A Warden for Life (0,3; ← the_long_memory; excl wardens_by_turns) `crown_iron`: add_spirit `warden_for_life`. AI 20; hist ×2.
- `wardens_by_turns` Wardens by Turns (2,3; ← the_long_memory; excl wardens_for_life) `elven_council`: add_spirit `wardens_by_turns_spirit`. AI 15.
- `the_end_endures` The End Endures (1,4; ← wardens_for_life / wardens_by_turns; 70) `forest_ancient`: political_power 75; stability 0.03. AI 15.

**B. Wellsprings of the End** (x 4–6, rows 0–3).
- `wellsprings_of_the_end` Wellsprings of the End (5,0; 70) `tree_silver`: building industrial_complex 1 @random_owned. AI 30.
- `deep_orchards` Deep Orchards (4,1; ← wellsprings_of_the_end) `farm_sowing`: add_spirit `deep_orchards_spirit`. AI 20.
- `stone_roads_of_the_end` Stone Roads of the End (6,1; ← wellsprings_of_the_end) `roads_paved`: building infrastructure 1 @random_owned (twice). AI 15.
- `essence_workshops` Essence Workshops (4,2; ← deep_orchards) `workshop_tools`: building industrial_complex 1 @random_owned. AI 15.
- `shipyards_of_the_end` Shipyards of the End (6,2; ← stone_roads_of_the_end) `shipwright_yard`: building dockyard 1 @random_coastal. AI 10.
- `the_end_provides` The End Provides (5,3; ← essence_workshops + shipyards_of_the_end; 70) `market_stalls`: add_spirit `end_provides`; building industrial_complex 1 @random_owned. AI 15.

**C. The Archive of the End** (x 7–9, rows 0–3).
- `archive_of_the_end` The Archive of the End (8,0) `university_hall`: research [zin_cat_wards] 50% ×1; political_power 25. AI 30.
- `first_age_rolls` Rolls of the First Age (7,1; ← archive_of_the_end) `book_lore`: research [zin_cat_wards] 50% ×1. AI 15.
- `star_readers` The Star-Readers (9,1; ← archive_of_the_end) `compass_rose`: add_spirit `star_readers_spirit`. AI 15.
- `lore_of_the_unbinding` Lore of the Unbinding (8,2; ← first_age_rolls + star_readers) `lantern_chain`: Avail: global variable `zin_gathering_dark` above 24, or global_flag `zin_zol_rising`, or global_flag `zin_eindil_named`. research [zin_cat_wards] 50% ×2. Text: copies of what the Third Age learned about lifting curses; it never says where Varner is. AI 20.
- `rolls_of_the_first_men` Rolls of the First Men (8,3; ← lore_of_the_unbinding) `heir_rolls`: Avail: global_flag `zin_eindil_named`. renown +5; regard +10. Description uses `[zin_loc_eindil]`. AI 0; 100 when available.

**D. The Last Shore** (x 10–12, rows 0–3). `allow_branch` and `available` on the head: check `zin_elves_is_rift_realm`.
- `watch_the_last_shore` Watch the Last Shore (11,0; 70) `lighthouse`: add_spirit `last_shore_watch`; navy_experience 5. AI 30.
- `beacon_towers` Beacon Towers (10,1; ← watch_the_last_shore) `beacon`: building coastal_bunker 1 @random_coastal. AI 15.
- `silver_sails` Silver Sails (12,1; ← watch_the_last_shore) `warship_sail`: research [zin_cat_galleys] 50% ×1. AI 10.
- `quays_of_the_end` Quays of the End (11,2; ← beacon_towers + silver_sails) `harbour_lake`: building naval_base 1 @random_coastal. AI 10.
- `merchants_whisper` Merchants Whisper (11,3; ← quays_of_the_end) `envoy`: Avail: after 1752.3.1 or global variable `zin_gathering_dark` above 29. event `merchants_whisper`. AI 20.

**E. Facing the Black North** (x 13–14, rows 0–2). `allow_branch` and `available` on the head: check `zin_regional_the_end_faces_the_mistake`.
- `eyes_on_the_black_north` Eyes on the Black North (13,0) `black_isles`: event `black_ships_seen`. AI 30.
- `wardens_of_the_black_shore` Wardens of the Black Shore (13,1; ← eyes_on_the_black_north) `fort_wall`: building coastal_bunker 1 @random_coastal; building bunker 1 @random_owned. AI 15.
- `the_edge_of_the_woods` The Edge of the Woods (13,2; ← wardens_of_the_black_shore) `dead_ranks_far`: Avail: global_flag `zin_zol_rising`. add_spirit `edge_of_the_woods`. AI 0; 200 when available.

**F. Kin and the Refusal** (x 15–17, rows 0–2).
- `with_the_kin` With the Kin (16,0) `alliance_rings`: kinship +3; goodwill Magical Forest. AI 30.
- `the_kindred_called` The Kindred Called (15,1; ← with_the_kin) `banner_league`: Avail: check `zin_elves_kindred_exists`; ROOT not in the Kindred. join the Kindred. AI 0; 300 when available.
- `healers_from_the_end` Healers from the End (17,1; ← with_the_kin) `healer_herbs`: flag `zin_elves_wanderers_extra`. AI 20.
- `the_end_keeps_the_refusal` The End Keeps the Refusal (16,2; ← the_kindred_called / healers_from_the_end) `banner_plain`: Avail: check `zin_elves_refusal_question_open`. stability 0.05; kinship +3. AI 10; hist ×5.

**G. Wardens of the End** (x 18–20, rows 0–2).
- `wardens_of_the_end` Wardens of the End (19,0; 70) `ranger_cloak`: research [zin_cat_bows] 50% ×1; army_experience 5. AI 25.
- `archers_of_the_end` Archers of the End (18,1; ← wardens_of_the_end) `elven_bow`: equipment zin_elven_arms_equipment 400. AI 15.
- `white_riders` White Riders (20,1; ← wardens_of_the_end) `white_deer`: research [zin_cat_mounts] 50% ×1. AI 10.
- `the_great_watch` The Great Watch (19,2; ← archers_of_the_end + white_riders; 70) `elven_bow`: add_spirit `great_watch`; manpower 3000. AI 15.

**H. The End Stands** (x 9–13, rows 6–9). Head available when `at_war` and (global_flag `zin_eastern_invasion` or check `zin_elves_eastern_threat`, or a non-elven enemy controls a state of The End).
- `the_end_stands` The End Stands (11,6; no prerequisite; 21) `banner_plain`: war_support 0.10; army_experience 10. AI 0; 500 when available.
- `hold_the_last_shore` Hold the Last Shore (10,7; ← the_end_stands; 21) `fort_wall`: building bunker 2 @random_coastal; manpower 4000. AI 100.
- `the_kin_ride_to_the_end` The Kin Ride to the End (12,7; ← the_end_stands; 21) `banner_league`: kinship +10. AI 100.
- `throw_them_back` Throw Them Back (11,8; ← hold_the_last_shore / the_kin_ride_to_the_end; 70) `elven_bow`: timed_spirit `the_end_holds` 365. AI 100.
- `the_last_shore_quiet` The Last Shore Is Quiet (11,9; ← throw_them_back) `olive_branch`: Avail: not at_war. stability 0.10; kinship +5; remove_spirit `the_end_holds`. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `eyes_on_the_black_north` | Eyes on the Black North | — (faces the Mistake) | Event: send a boat (it does not return; country flag `zin_zol_forewarned`, so The End gets `zin_zol_forewarned` when Zol rises) or disbelieve |
| `the_edge_of_the_woods` | The Edge of the Woods | wardens_of_the_black_shore; `zin_zol_rising` | Core defence spirit for the realm next to the Mistake |
| `rolls_of_the_first_men` | Rolls of the First Men | lore_of_the_unbinding; `zin_eindil_named` | Renown +5, regard +10: the archive's old rolls match what Lorien said |
| `merchants_whisper` | Merchants Whisper | quays_of_the_end | Event: eastern courts gather ships; warn the kin (kinship +3; the Magical Forest's `zin_magical_forest_forewarned_east`) or sell them timber |
| `the_kindred_called` | The Kindred Called | with_the_kin; the Kindred exists | Joins the Kindred |
| `the_great_watch` | The Great Watch | archers + riders | 3,000 manpower and a defensive spirit: The End's numbers as a watch, not a host |
| `the_end_stands` | The End Stands | — (war gate) | War support +10%; the war branch opens |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `endarils_watch_spirit` | Endaril's Watch | `army_intel_factor` 0.10, `stability_factor` 0.02 | `endarils_watch` |
| `warden_for_life` | A Warden for Life | `political_power_gain` 0.10, `drift_defence_factor` 0.10 | `wardens_for_life` |
| `wardens_by_turns_spirit` | Wardens by Turns | `stability_factor` 0.05, `opinion_gain_monthly_factor` 0.10 | `wardens_by_turns` |
| `deep_orchards_spirit` | Deep Orchards | `monthly_population` 0.05, `consumer_goods_factor` −0.02 | `deep_orchards` |
| `end_provides` | The End Provides | `production_speed_buildings_factor` 0.05 | `the_end_provides` |
| `star_readers_spirit` | The Star-Readers | `research_speed_factor` 0.05 | `star_readers` |
| `last_shore_watch` | Watch on the Last Shore | `naval_detection` 0.10 | `watch_the_last_shore` |
| `edge_of_the_woods` | The Edge of the Woods | `army_core_defence_factor` 0.10, `coastal_bunker_effectiveness_factor` 0.10 | `the_edge_of_the_woods`; removed on `zin_zol_withdrawn` |
| `great_watch` | The Great Watch | `army_defence_factor` 0.05, `army_core_defence_factor` 0.05 | `the_great_watch` |
| `the_end_holds` | The End Holds | `army_defence_factor` 0.10, `army_core_defence_factor` 0.10 | timed, 365 days |

### Events (namespace `zin_regional_the_end`)

| # | Key | Title | Picture | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `the_warden_speaks` | The Warden Speaks | `generic_wilds` | The End | The Warden's Seat | "For the archive." (research bonus [zin_cat_wards] 25% ×1) / "For the shore." (political_power 25) |
| 2 | `merchants_whisper` | Merchants Whisper | `generic_sea` | The End | Merchants Whisper | "Warn the kin." (kinship +3; for_country Magical Forest: flag `zin_magical_forest_forewarned_east`; AI 70) / "Sell them timber." (political_power 50; AI 30) |
| 3 | `black_ships_seen` | Black Ships off the Last Shore | `black_isles_lights` | The End | Eyes on the Black North | "Send a boat." (country flag `zin_zol_forewarned`; political_power −25; the boat does not return; AI 50) / "Fishers' tales." (AI 50). Text: lights among black islands; nothing more |

### Historical AI route

| When | Focuses |
| --- | --- |
| 1748–1749 | seat_of_the_warden, wellsprings_of_the_end, archive_of_the_end, with_the_kin, endarils_watch, the_houses_of_the_end, watch_the_last_shore, eyes_on_the_black_north (if shown) |
| 1750–1752 | the_long_memory, wardens_for_life, deep_orchards, first_age_rolls, star_readers, healers_from_the_end, beacon_towers, wardens_of_the_end |
| 1752–1754 | merchants_whisper, quays_of_the_end, lore_of_the_unbinding, the_end_keeps_the_refusal, archers_of_the_end, the_end_endures |
| 1755 onward | war branch; the_kindred_called when raised; rolls_of_the_first_men after `zin_eindil_named`; the shore branch on `zin_zol_rising` |

---

## Herrodon

### Situation in 4A 1748

Herrodon is a woodland crown: an elven realm whose houses long ago chose a queen (proposed), and kept choosing her line. Queen Herrowyn holds court in the great groves of the west of the Magical Lands. Herrodon's oldest quarrel is with Andos Enda, its eastern neighbour, a federation that never took a crown and never forgave Herrodon for wearing one; the two realms have argued over a stand of boundary groves for longer than either will say. Two small realms to Herrodon's west, Sacomananos and Velakton, sing Herrodon's songs but never took its crown (proposed); the Queen calls them her lost kin.

### Role

- **Historical path (proposed):** the rivalry simmers but never becomes war. Herrodon lets the groves grow wild, asks the Magical Forest to judge, and keeps the Refusal. When the eastern coalition crosses, Herrodon joins the Kindred. It courts the Keeper of the dragons but takes no dragon unless its woods are attacked.
- **Alternatives:** Herrodon honours every old slight and, after 1 Thaw 4A 1750 and at rivalry 90, starts the Feud of the Groves (a local war over one state, never on the historical path); Herrodon gathers its lost kin under one crown; Herrodon reconciles with Andos Enda for good.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Herrodon>_zin_ruler` | Queen Herrowyn | Country leader, `zin_light_kinship` | — |
| `zin_regional_herrodon_calaerin` | Calaerin of the Groves | Political advisor | `zin_adv_elder` |
| `zin_regional_herrodon_elaith` | Elaith Boundary-Keeper | Political advisor | `zin_adv_envoy` |
| `zin_regional_herrodon_thalorn` | Thalorn Bowmaster | Political advisor | `zin_adv_muster_master` |
| `zin_regional_herrodon_sirwen` | Sirwen of the Queen's Wardens | Corps commander, skill 3 | `ranger` |

### Tree `regional_herrodon` (34 focuses)

**A. The Woodland Crown** (x 0–2, rows 0–4). Exclusive: *A Crown Above the Houses* / *A Crown Among the Houses*.
- `the_woodland_crown` The Woodland Crown (1,0; 70) `crown_iron`: political_power 50; event `the_queens_court`. AI 40.
- `herrowyns_court` Herrowyn's Court (0,1; ← the_woodland_crown) `throne_gold`: political_power 25; stability 0.02. AI 20.
- `the_crowned_houses` The Crowned Houses (2,1; ← the_woodland_crown) `elven_council`: stability 0.05. AI 20.
- `the_queens_peace` The Queen's Peace (1,2; ← herrowyns_court + the_crowned_houses) `olive_branch`: add_spirit `queens_peace`. AI 15.
- `a_crown_above_the_houses` A Crown Above the Houses (0,3; ← the_queens_peace; excl a_crown_among_the_houses) `sceptre`: swap_spirit `queens_peace` → `crown_above`. AI 10.
- `a_crown_among_the_houses` A Crown Among the Houses (2,3; ← the_queens_peace; excl a_crown_above_the_houses) `elven_council`: swap_spirit `queens_peace` → `crown_among`; kinship +5. AI 15; hist ×2.
- `the_crown_of_herrodon` The Crown of Herrodon (1,4; ← a_crown_above_the_houses / a_crown_among_the_houses; 70) `crown_gold`: political_power 75. AI 15.

**B. The Boundary Groves** (x 4–6, rows 0–3). Exclusive: *Honour the Old Slights* / *Let the Groves Grow Wild*.
- `the_boundary_groves` The Boundary Groves (5,0) `forest_ancient`: event `markers_in_the_groves`. AI 30.
- `honour_the_old_slights` Honour the Old Slights (4,1; ← the_boundary_groves; excl let_the_groves_grow_wild) `banner_plain`: rivalry +10; war_support 0.05. AI 10; hist ×0.2; free ×2.
- `let_the_groves_grow_wild` Let the Groves Grow Wild (6,1; ← the_boundary_groves; excl honour_the_old_slights) `tree_silver`: rivalry −10; kinship +3. AI 20; hist ×3.
- `markers_of_stone` Markers of Stone (4,2; ← honour_the_old_slights) `rune_stone`: building bunker 1 @boundary_groves; rivalry +5. AI 15.
- `ask_the_forest_to_judge` Ask the Forest to Judge (6,2; ← let_the_groves_grow_wild) `scroll_treaty`: Avail: exists Magical Forest. event_for Magical Forest `herrodon_asks_judgement`. AI 20.
- `the_feud_of_the_groves` The Feud of the Groves (4,3; ← markers_of_stone) `banner_plain`: Avail: global variable `zin_elves_rivalry` above 89; after 1750.3.1; not at_war; Herrodon and Andos Enda not both in the Kindred. call `zin_elves_begin_feud(attacker = ROOT)`. AI 5; hist ×0; free ×2.
- `groves_shared` The Groves Shared (6,3; ← ask_the_forest_to_judge) `olive_branch`: Avail: global variable `zin_elves_rivalry` below 31; exists Andos Enda. event_for Andos Enda `groves_shared`. AI 30.

**C. The Lost Kin** (x 7–9, rows 0–2). Sacomananos and Velakton.
- `songs_of_the_western_groves` Songs of the Western Groves (8,0) `hymn_choir`: goodwill Sacomananos (if it exists); goodwill Velakton (if it exists). AI 20.
- `kin_bond_sacomananos` A Kin-Bond with Sacomananos (7,1; ← songs_of_the_western_groves) `handshake_oath`: Avail: exists Sacomananos; not at_war_with Sacomananos. non_aggression Sacomananos; kinship +2. AI 15.
- `kin_bond_velakton` A Kin-Bond with Velakton (9,1; ← songs_of_the_western_groves) `handshake_oath`: Avail: exists Velakton; not at_war_with Velakton. non_aggression Velakton; kinship +2. AI 15.
- `one_crown_of_the_woods` One Crown of the Woods (8,2; ← kin_bond_sacomananos + kin_bond_velakton; 70) `crown_iron`: Avail: global variable `zin_elves_kinship` above 59, or global_flag `zin_eastern_invasion`. event_for Sacomananos `under_one_crown`; event_for Velakton `under_one_crown`. AI 5; hist ×0.

**D. Dragons over the Groves** (x 10–12, rows 0–2).
- `wings_at_dusk` Wings at Dusk (11,0) `dragon_wing`: bond +2; political_power 25. AI 20.
- `gifts_to_the_keeper` Gifts to the Keeper (10,1; ← wings_at_dusk) `tribute_chest`: call `zin_regional_herrodon_court_keeper` (goodwill both ways with the country passing `zin_world_is_dragon_keeper`, if it is not Herrodon). AI 15.
- `roost_songs` Roost Songs (12,1; ← wings_at_dusk) `dragon_mountain`: bond +5. AI 15.
- `a_wing_for_herrodon` A Wing for Herrodon (11,2; ← gifts_to_the_keeper) `dragon_wing`: Avail: check `zin_elves_dragon_need`; the Keeper's opinion of Herrodon ≥ 50 or Herrodon is the Keeper (check `zin_regional_herrodon_keeper_friend`); global variable `zin_dragons_free` above 0; variable `zin_world_dragon_pacts` below 3. call `zin_elves_focus_dragon_pact`. AI 0; 100 when available.

**E. The Queen's Wardens** (x 13–15, rows 0–2).
- `queens_wardens` The Queen's Wardens (14,0; 70) `ranger_cloak`: research [zin_cat_bows] 50% ×1; army_experience 5. AI 25.
- `bows_of_herrodon` Bows of Herrodon (13,1; ← queens_wardens) `elven_bow`: equipment zin_elven_arms_equipment 300. AI 15.
- `grove_knights` Grove Knights (15,1; ← queens_wardens) `knight_lance`: research [zin_cat_mounts] 50% ×1. AI 10.
- `the_queens_host` The Queen's Host (14,2; ← bows_of_herrodon + grove_knights; 70) `elven_bow`: add_spirit `queens_host`. AI 15.

**F. Kin and the Wall** (x 16–18, rows 0–1).
- `kin_of_herrodon` Kin of Herrodon (17,0) `alliance_rings`: kinship +3; goodwill Magical Forest. AI 30.
- `stand_with_the_kindred` Stand with the Kindred (16,1; ← kin_of_herrodon) `banner_league`: Avail: check `zin_elves_kindred_exists`; ROOT not in the Kindred; not (Andos Enda in the Kindred and global variable `zin_elves_rivalry` above 59). join the Kindred. AI 0; 300 when available.
- `healers_of_herrodon` Healers of Herrodon (17,1; ← kin_of_herrodon) `healer_herbs`: flag `zin_elves_wanderers_extra`. AI 20.
- `customs_at_the_wall` Customs at the Wall (18,1; ← kin_of_herrodon) `charter_wall`: `allow_branch` and Avail: check `zin_elves_is_wall_realm`. grievance −5; add_spirit `wall_trade`. AI 20.

**G. The Groves Defended** (x 6–9, rows 6–8). Head available when `at_war` with a non-elven country that controls a Herrodon state, or global_flag `zin_eastern_invasion` and at war with an East Lands country.
- `the_groves_defended` The Groves Defended (8,6; no prerequisite; 21) `forest_ancient`: war_support 0.10; timed_spirit `groves_defended` 365. AI 0; 500 when available.
- `the_queen_rides` The Queen Rides (7,7; ← the_groves_defended; 21) `knight_lance`: army_experience 15. AI 100.
- `the_kin_answer` The Kin Answer (9,7; ← the_groves_defended; 21) `banner_league`: kinship +10. AI 100.
- `the_groves_quiet` The Groves Are Quiet (8,8; ← the_queen_rides / the_kin_answer) `olive_branch`: Avail: not at_war. stability 0.10; remove_spirit `groves_defended`. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `let_the_groves_grow_wild` | Let the Groves Grow Wild | the_boundary_groves | Rivalry −10; kinship +3; the historical road |
| `ask_the_forest_to_judge` | Ask the Forest to Judge | let_the_groves_grow_wild | Event to the Magical Forest; its arbitration is the mechanic's mediation (rivalry −15, kinship +5, goodwill) |
| `groves_shared` | The Groves Shared | ask_the_forest_to_judge; rivalry ≤ 30 | Event to Andos Enda: share the groves (rivalry −20; both lose the start opinion "Old Rivalry"; kinship +10) |
| `the_feud_of_the_groves` | The Feud of the Groves | markers_of_stone; rivalry ≥ 90; after 1 Thaw 4A 1750 | Runs the mechanic's feud (a `take_state` war goal on the nearest Andos Enda state; kinship −20; Gathering Dark +2). Never on the historical path |
| `one_crown_of_the_woods` | One Crown of the Woods | both kin-bonds; kinship ≥ 60 or the eastern invasion | Event to Sacomananos and Velakton: take Herrodon's crown as subject realms (Herrodon `puppet`s the accepting realm) or keep their own songs |
| `a_wing_for_herrodon` | A Wing for Herrodon | gifts_to_the_keeper; dragon need; the Keeper's favour | A Dragon Pact through a focus (`zin_elves_focus_dragon_pact`; counts against the pact limit) |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `queens_peace` | The Queen's Peace | `stability_factor` 0.05 | `the_queens_peace`; replaced by the next two |
| `crown_above` | A Crown Above the Houses | `political_power_gain` 0.15, `stability_factor` 0.03 | `a_crown_above_the_houses` |
| `crown_among` | A Crown Among the Houses | `stability_factor` 0.08, `drift_defence_factor` 0.10 | `a_crown_among_the_houses` |
| `queens_host` | The Queen's Host | `army_org_factor` 0.05, `army_morale_factor` 0.05 | `the_queens_host` |
| `wall_trade` | Customs at the Wall | `trade_opinion_factor` 0.10 | `customs_at_the_wall`; removed while `zin_elves_wall_roads_closed` |
| `groves_defended` | The Groves Defended | `army_defence_factor` 0.10, `army_core_defence_factor` 0.10 | timed, 365 days |

### Events (namespace `zin_regional_herrodon`)

| # | Key | Title | Picture | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `the_queens_court` | The Queen's Court | `generic_court` | Herrodon | The Woodland Crown | "The houses kneel." (political_power 25) / "The houses sit." (stability 0.03) |
| 2 | `markers_in_the_groves` | Markers in the Groves | `generic_wilds` | Herrodon | The Boundary Groves | "Set our markers." (rivalry +5; AI 40, hist ×0.5) / "Leave the groves to the trees." (rivalry −5; AI 60) |
| 3 | `herrodon_asks_judgement` | Herrodon Asks for Judgement | `generic_wilds` | Magical Forest | Ask the Forest to Judge | "We will judge." (rivalry −15; kinship +5; goodwill Herrodon and Andos Enda; AI 80) / "The rivals must settle it." (AI 20) |
| 4 | `groves_shared` | The Groves Shared | `generic_wilds` | Andos Enda | The Groves Shared | "Share the groves." (rivalry −20; both sides `remove_opinion_modifier` `zin_opinion_old_rivalry`; kinship +10; AI 60) / "Andos Enda remembers." (rivalry +5; AI 40) |
| 5 | `under_one_crown` | Under One Crown | `generic_court` | Sacomananos, Velakton | One Crown of the Woods | "Take Herrodon's crown." (Herrodon `puppet`s ROOT; AI 10 + opinion of Herrodon ÷ 4, ×2 if at war with an eastern invader) / "We keep our own songs." (AI the rest) |
| 6 | `an_answer_in_the_groves` | An Answer in the Groves | `generic_wilds` | Herrodon | every option of events 3, 4 and 5 (`event_for` Herrodon) | One option. Text names the answering realm and its answer; no effect |

### Historical AI route

1748–1750: the_woodland_crown, the_boundary_groves, kin_of_herrodon, queens_wardens, herrowyns_court, the_crowned_houses, let_the_groves_grow_wild, songs_of_the_western_groves, wings_at_dusk. 1750–1753: the_queens_peace, a_crown_among_the_houses, ask_the_forest_to_judge, healers_of_herrodon, customs_at_the_wall (if a wall realm), kin_bond_sacomananos, kin_bond_velakton, roost_songs, gifts_to_the_keeper, bows_of_herrodon. 1754 onward: the_crown_of_herrodon, groves_shared (if rivalry ≤ 30), war branch and the Kindred on their gates; never the feud or one crown.

---

## Andos Enda

### Situation in 4A 1748

Andos Enda is a federation of eastern groves (proposed): five provinces whose grove-speakers meet in a moot and choose a Speaker, today Andosiel. It holds no crown and thinks crowns vain, which is half of its quarrel with Herrodon; the other half is the boundary groves. Its woods face east, toward the rift. Ships from the north call at its rivers for timber, and Sonargur's merchants know its speakers by name. Whether that ever made Andos Enda part of Lerendor's Leren Compact is a question the elves do not answer for men.

### Role

- **Historical path (proposed):** Andos Enda forgives the old slights slowly, asks the Magical Forest's word, trades timber north, and stands apart from every human league. It joins the Kindred when the eastern coalition comes.
- **Alternatives:** the rivalry route (the Feud of the Groves from rivalry 90); one voice for the federation; reconciliation with Herrodon.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Andos Enda>_zin_ruler` | Speaker Andosiel | Country leader, `zin_light_kinship` | `zin_trait_elected_speaker` |
| `zin_regional_andos_enda_enduil` | Enduil Grove-Speaker | Political advisor | `zin_adv_elder` |
| `zin_regional_andos_enda_maerwen` | Maerwen Northwind | Political advisor | `zin_adv_envoy` |
| `zin_regional_andos_enda_taurin` | Taurin Resin-Wright | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_andos_enda_halvaril` | Halvaril of the Eastern Groves | Corps commander, skill 3 | `ranger` |

### Tree `regional_andos_enda` (36 focuses)

**A. The Speakers' Federation** (x 0–2, rows 0–4). Exclusive: *One Voice for Andos Enda* / *Every Grove Its Voice*.
- `the_speakers_federation` The Speakers' Federation (1,0; 70) `elven_council`: political_power 50; event `the_federal_moot`. AI 40.
- `andosiels_voice` Andosiel's Voice (0,1; ← the_speakers_federation) `envoy`: political_power 25. AI 20.
- `the_grove_speakers` The Grove-Speakers (2,1; ← the_speakers_federation) `council_table`: stability 0.05. AI 20.
- `the_federal_moot` The Federal Moot (1,2; ← andosiels_voice + the_grove_speakers) `elven_council`: add_spirit `federal_moot`. AI 15.
- `one_voice_for_andos_enda` One Voice for Andos Enda (0,3; ← the_federal_moot; excl every_grove_its_voice) `seal_royal`: swap_spirit `federal_moot` → `one_voice`. AI 10.
- `every_grove_its_voice` Every Grove Its Voice (2,3; ← the_federal_moot; excl one_voice_for_andos_enda) `tree_silver`: swap_spirit `federal_moot` → `every_grove`. AI 15; hist ×2.
- `the_federation_endures` The Federation Endures (1,4; ← one_voice_for_andos_enda / every_grove_its_voice; 70) `banner_league`: political_power 75. AI 15.

**B. The Old Rivalry** (x 4–6, rows 0–3). Exclusive: *Remember Every Slight* / *Forgive the Old Slights*.
- `a_slight_remembered` A Slight Remembered (5,0) `book_lore`: event `slight_remembered`. AI 30.
- `remember_every_slight` Remember Every Slight (4,1; ← a_slight_remembered; excl forgive_the_old_slights) `banner_plain`: rivalry +10; war_support 0.05. AI 10; hist ×0.2; free ×2.
- `forgive_the_old_slights` Forgive the Old Slights (6,1; ← a_slight_remembered; excl remember_every_slight) `olive_branch`: rivalry −10; kinship +3. AI 20; hist ×3.
- `answer_in_kind` Answer in Kind (4,2; ← remember_every_slight) `bow_archers`: rivalry +5; army_experience 5. AI 15.
- `seek_the_forests_word` Seek the Forest's Word (6,2; ← forgive_the_old_slights) `scroll_treaty`: Avail: exists Magical Forest. event_for Magical Forest `andos_enda_asks_judgement`. AI 20.
- `the_feud_of_the_groves` The Feud of the Groves (4,3; ← answer_in_kind) `banner_plain`: Avail: global variable `zin_elves_rivalry` above 89; after 1750.3.1; not at_war; Herrodon and Andos Enda not both in the Kindred. call `zin_elves_begin_feud(attacker = ROOT)`. AI 5; hist ×0; free ×2.
- `groves_shared_with_herrodon` The Groves Shared with Herrodon (6,3; ← seek_the_forests_word) `olive_branch`: Avail: global variable `zin_elves_rivalry` below 31; exists Herrodon. event_for Herrodon `groves_shared`. AI 30.

**C. Letters from the North** (x 7–9, rows 0–1). Trade and opinion only; no faction.
- `letters_from_sonargur` Letters from Sonargur (8,0) `scroll_sealed`: Avail: exists Lerendor. opinion Lerendor +15 (`northern_letters`) both ways; political_power 25. AI 20.
- `timber_for_leren_ships` Timber for Leren Ships (7,1; ← letters_from_sonargur) `timber_mill`: add_spirit `northern_timber`. AI 15.
- `the_elves_stand_apart` The Elves Stand Apart (9,1; ← letters_from_sonargur) `banner_plain`: add_spirit `stand_apart`. Description: the speakers write warmly to Sonargur and sign nothing. AI 15; hist ×2.

**D. The Eastern Woods** (x 10–12, rows 0–2).
- `eastern_woods` The Eastern Woods (11,0; 70) `forest_ancient`: building industrial_complex 1 @random_owned. AI 30.
- `resin_and_timber` Resin and Timber (10,1; ← eastern_woods) `timber_mill`: add_spirit `resin_trade`. AI 15.
- `grove_roads` Grove Roads (12,1; ← eastern_woods) `roads_paved`: building infrastructure 1 @random_owned (twice). AI 15.
- `the_woods_prosper` The Woods Prosper (11,2; ← resin_and_timber + grove_roads; 70) `workshop_tools`: building industrial_complex 1 @random_owned; add_spirit `woods_prosper`. AI 15.

**E. Kin and the Refusal** (x 13–15, rows 0–2).
- `kin_of_andos_enda` Kin of Andos Enda (14,0) `alliance_rings`: kinship +3; goodwill Magical Forest. AI 30.
- `stand_with_the_kindred` Stand with the Kindred (13,1; ← kin_of_andos_enda) `banner_league`: Avail: check `zin_elves_kindred_exists`; ROOT not in the Kindred; not (Herrodon in the Kindred and global variable `zin_elves_rivalry` above 59). join the Kindred. AI 0; 300 when available.
- `wanderers_of_andos_enda` Wanderers of Andos Enda (15,1; ← kin_of_andos_enda) `healer_herbs`: flag `zin_elves_wanderers_extra`. AI 20.
- `the_refusal_remembered` The Refusal Remembered (14,2; ← stand_with_the_kindred / wanderers_of_andos_enda) `banner_plain`: Avail: check `zin_elves_refusal_question_open`. stability 0.05; kinship +3. AI 10; hist ×5.

**F. Watch on the Eastern Water** (x 16–18, rows 0–1). `allow_branch` and `available` on the head: check `zin_elves_is_rift_realm`.
- `watch_the_eastern_water` Watch the Eastern Water (17,0) `lighthouse`: add_spirit `eastern_water_watch`. AI 25.
- `shore_beacons` Shore Beacons (16,1; ← watch_the_eastern_water) `beacon`: building coastal_bunker 1 @random_coastal. AI 15.
- `shore_levies` Shore Levies (18,1; ← watch_the_eastern_water) `levy_muster`: manpower 2000. AI 10; ×3 with `zin_magical_forest_forewarned_east` on the Magical Forest.

**G. The Speakers' Wardens** (x 19–21, rows 0–2).
- `speakers_wardens` The Speakers' Wardens (20,0; 70) `ranger_cloak`: research [zin_cat_bows] 50% ×1; army_experience 5. AI 25.
- `longbows_of_andos_enda` Longbows of Andos Enda (19,1; ← speakers_wardens) `elven_bow`: equipment zin_elven_arms_equipment 300. AI 15.
- `grove_scouts` Grove Scouts (21,1; ← speakers_wardens) `scout_lantern`: add_spirit `grove_scouts_spirit`. AI 10.
- `the_federal_host` The Federal Host (20,2; ← longbows_of_andos_enda + grove_scouts; 70) `elven_bow`: add_spirit `federal_host`. AI 15.

**H. The Federation Defends** (x 10–12, rows 6–8). Head available as Herrodon's war head.
- `the_federation_defends` The Federation Defends (11,6; no prerequisite; 21) `forest_ancient`: war_support 0.10; timed_spirit `federation_defends` 365. AI 0; 500 when available.
- `hold_the_eastern_groves` Hold the Eastern Groves (10,7; ← the_federation_defends; 21) `fort_wall`: building bunker 2 @random_owned. AI 100.
- `the_kin_answer` The Kin Answer (12,7; ← the_federation_defends; 21) `banner_league`: kinship +10. AI 100.
- `peace_in_the_woods` Peace in the Woods (11,8; ← hold_the_eastern_groves / the_kin_answer) `olive_branch`: Avail: not at_war. stability 0.10; remove_spirit `federation_defends`. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `forgive_the_old_slights` | Forgive the Old Slights | a_slight_remembered | Rivalry −10; kinship +3 (historical road) |
| `seek_the_forests_word` | Seek the Forest's Word | forgive_the_old_slights | Event to the Magical Forest: arbitration (rivalry −15, kinship +5) |
| `groves_shared_with_herrodon` | The Groves Shared with Herrodon | seek_the_forests_word; rivalry ≤ 30 | Event to Herrodon (Herrodon's tree uses the mirror event) |
| `the_feud_of_the_groves` | The Feud of the Groves | answer_in_kind; rivalry ≥ 90 | The mechanic's feud with Andos Enda as attacker; never on the historical path |
| `letters_from_sonargur` | Letters from Sonargur | — | Opinion with Lerendor; nothing else. No faction, no treaty |
| `the_elves_stand_apart` | The Elves Stand Apart | letters_from_sonargur | Drift defence and stability: the federation signs nothing |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `federal_moot` | The Federal Moot | `stability_factor` 0.05, `political_power_factor` −0.05 | `the_federal_moot`; replaced by the next two |
| `one_voice` | One Voice for Andos Enda | `political_power_gain` 0.10 | `one_voice_for_andos_enda` |
| `every_grove` | Every Grove Its Voice | `stability_factor` 0.08, `opinion_gain_monthly_factor` 0.10 | `every_grove_its_voice` |
| `northern_timber` | Timber for Leren Ships | `trade_opinion_factor` 0.10 | `timber_for_leren_ships` |
| `stand_apart` | The Elves Stand Apart | `drift_defence_factor` 0.15, `stability_factor` 0.03 | `the_elves_stand_apart` |
| `resin_trade` | Resin and Timber | `consumer_goods_factor` −0.02, `trade_opinion_factor` 0.05 | `resin_and_timber` |
| `woods_prosper` | The Woods Prosper | `production_speed_buildings_factor` 0.05 | `the_woods_prosper` |
| `eastern_water_watch` | Watch on the Eastern Water | `naval_detection` 0.10 | `watch_the_eastern_water` |
| `grove_scouts_spirit` | Grove Scouts | `recon_factor` 0.10 | `grove_scouts` |
| `federal_host` | The Federal Host | `army_org_factor` 0.05, `army_defence_factor` 0.05 | `the_federal_host` |
| `federation_defends` | The Federation Defends | `army_defence_factor` 0.10, `army_core_defence_factor` 0.10 | timed, 365 days |

### Events (namespace `zin_regional_andos_enda`)

| # | Key | Title | Picture | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `the_federal_moot` | The Grove-Speakers Meet | `generic_wilds` | Andos Enda | The Speakers' Federation | "The Speaker leads." (political_power 25) / "The groves decide." (stability 0.03) |
| 2 | `slight_remembered` | A Slight Remembered | `generic_wilds` | Andos Enda | A Slight Remembered | "Answer it." (rivalry +5; AI 40, hist ×0.5) / "Let it pass." (rivalry −3; AI 60) |
| 3 | `andos_enda_asks_judgement` | Andos Enda Asks for Judgement | `generic_wilds` | Magical Forest | Seek the Forest's Word | As Herrodon's event 3 |
| 4 | `groves_shared` | The Groves Shared | `generic_wilds` | Herrodon | The Groves Shared with Herrodon | As Herrodon's event 4, with the roles swapped |

### Historical AI route

1748–1750: the_speakers_federation, eastern_woods, a_slight_remembered, kin_of_andos_enda, speakers_wardens, andosiels_voice, the_grove_speakers, forgive_the_old_slights, letters_from_sonargur. 1750–1753: the_federal_moot, every_grove_its_voice, seek_the_forests_word, the_elves_stand_apart, timber_for_leren_ships, resin_and_timber, grove_roads, wanderers_of_andos_enda, watch_the_eastern_water (if a rift realm). 1754 onward: groves_shared_with_herrodon (if rivalry ≤ 30), the rest, war and Kindred on their gates.

---

## Nolorim

### Situation in 4A 1748

Nolorim is the smallest of the five: two high valleys of the southern frontier, a federation of pass-wardens under Pass-Warden Nolwe (role proposed; the name and separateness established). Its folk herd goats on the heights, quarry stone from the Magic Mountains' feet, and keep watchtowers on the high passes that lead into the Magical Lands. The towers are old and half-manned. Nobody has come through the passes in arms for a very long time, and the kin send fewer wardens every century.

### Role

- **Historical path (proposed):** Nolorim rebuilds its pass forts slowly with the kin's help, and the Magical Forest's wardens raise the watch further in 4A 1752–1753. When the eastern coalition comes "across seas and mountain approaches" (established), the passes are a front. If the Magical Forest sends Eindil on rather than sheltering him, Nolorim may become his host (journey spec) and has a small branch for that case.
- **Alternatives:** wardens first or valleys first; a Nolorim that becomes Eindil's guest-house; passes that hold or fall.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Nolorim>_zin_ruler` | Pass-Warden Nolwe | Country leader, `zin_light_kinship` | — |
| `zin_regional_nolorim_orlith` | Orlith Stonewatch | Political advisor | `zin_adv_road_warden` |
| `zin_regional_nolorim_celebren` | Celebren of the Heights | Political advisor | `zin_adv_elder` |
| `zin_regional_nolorim_vaeril` | Vaeril Cloudscout | Political advisor | `zin_adv_sage` |
| `zin_regional_nolorim_nimrael` | Nimrael of the High Towers | Corps commander, skill 3 | `hill_fighter` |

### Tree `regional_nolorim` (32 focuses)

**A. The Pass-Wardens** (x 0–2, rows 0–4). Exclusive: *Wardens First* / *Valleys First*.
- `pass_wardens_of_nolorim` The Pass-Wardens of Nolorim (1,0; 70) `pass_fort`: political_power 50; event `the_pass_wardens`. AI 40.
- `nolwes_watch` Nolwe's Watch (0,1; ← pass_wardens_of_nolorim) `eye_watchful`: pass watch +3; political_power 25. AI 20.
- `the_federated_valleys` The Federated Valleys (2,1; ← pass_wardens_of_nolorim) `elven_council`: stability 0.05. AI 20.
- `the_wardens_oath` The Wardens' Oath (1,2; ← nolwes_watch + the_federated_valleys) `handshake_oath`: add_spirit `wardens_oath`. AI 15.
- `wardens_first` Wardens First (0,3; ← the_wardens_oath; excl valleys_first) `ranger_cloak`: add_spirit `wardens_first_spirit`; pass watch +5. AI 15; hist ×2.
- `valleys_first` Valleys First (2,3; ← the_wardens_oath; excl wardens_first) `herds`: add_spirit `valleys_first_spirit`. AI 15.
- `nolorim_endures` Nolorim Endures (1,4; ← wardens_first / valleys_first; 70) `mountain_pass`: political_power 75; stability 0.03. AI 15.

**B. Stone in the Passes** (x 3–6, rows 0–3). Mechanic: `zin_elves_pass_watch` (every 20 points is a fort level in each pass state, up to 5; at 60 the high passes modifier strengthens).
- `stone_in_the_passes` Stone in the Passes (5,0; 70) `quarry_stone`: pass watch +10. AI 40.
- `watchtowers_on_the_heights` Watchtowers on the Heights (4,1; ← stone_in_the_passes) `pass_fort`: pass watch +5; add_spirit `heights_watch`. AI 20.
- `the_high_roads` The High Roads (6,1; ← stone_in_the_passes) `mountain_pass`: building infrastructure 1 @capital; pass watch +5. AI 15.
- `walls_across_the_passes` Walls Across the Passes (4,2; ← watchtowers_on_the_heights; 70) `fort_wall`: pass watch +10. AI 20.
- `the_magic_mountains_road` The Magic Mountains Road (6,2; ← the_high_roads) `snow_peak`: building infrastructure 1 @random_owned; political_power 25. AI 10.
- `beacons_to_the_kin` Beacons to the Kin (5,3; ← walls_across_the_passes / the_magic_mountains_road) `beacon`: kinship +5; pass watch +5. AI 15.

**C. Kin Who Send Wardens** (x 7–9, rows 0–2).
- `ask_the_kin` Ask the Kin (8,0) `envoy`: call `zin_regional_nolorim_ask_kin` (event `nolorim_asks_kin` to the three Magical Lands elven realms, other than the Magical Forest, with the highest opinion of Nolorim). AI 30.
- `wardens_from_the_forest` Wardens from the Forest (7,1; ← ask_the_kin) `tree_silver`: Avail: exists Magical Forest. event_for Magical Forest `nolorim_asks_the_forest`. AI 20.
- `kin_beacons` Kin Beacons (9,1; ← ask_the_kin) `beacon`: kinship +5. AI 15.
- `the_kindred_at_the_passes` The Kindred at the Passes (8,2; ← wardens_from_the_forest / kin_beacons) `banner_league`: Avail: check `zin_elves_kindred_exists`; ROOT not in the Kindred. join the Kindred. AI 0; 300 when available.

**D. Looking South and East** (x 10–12, rows 0–2).
- `eyes_on_the_south` Eyes on the South (11,0) `scout_lantern`: add_spirit `southern_eyes`. AI 25.
- `eastern_approaches` The Eastern Approaches (10,1; ← eyes_on_the_south) `map_unrolled`: Avail: after 1752.3.1 or global variable `zin_gathering_dark` above 29. event `herders_report`. AI 20.
- `southern_road_watch` The Southern Road Watch (12,1; ← eyes_on_the_south) `fort_wall`: building bunker 1 @capital. AI 15.
- `herders_of_the_heights` Herders of the Heights (11,2; ← eastern_approaches / southern_road_watch) `herds`: manpower 1000; add_spirit `herders`. AI 15.

**E. A Guest in the Passes** (x 13–15, rows 0–1). `available` on every focus: check `zin_eindil_is_host` (Nolorim is the host). Names are secret-safe; descriptions use `[zin_loc_eindil]`.
- `a_guest_in_the_passes` A Guest in the Passes (14,0) `scout_lantern`: regard +15; political_power 25. AI 0; 200 when available.
- `hide_the_guest` Hide the Guest (13,1; ← a_guest_in_the_passes) `ice_cavern`: regard +10; stability 0.03. AI 100.
- `the_mountain_paths` The Mountain Paths (15,1; ← a_guest_in_the_passes) `mountain_pass`: call `zin_eindil_add_delay(value = −30)`; regard +5. AI 100.

**F. Pass Companies** (x 16–18, rows 0–2).
- `pass_companies` Pass Companies (17,0; 70) `pass_fort`: army_experience 10; research [zin_cat_bows] 50% ×1. AI 25.
- `mountain_bows` Mountain Bows (16,1; ← pass_companies) `elven_bow`: equipment zin_elven_arms_equipment 200. AI 15.
- `stone_throwers` Stone-Throwers (18,1; ← pass_companies) `siege_trebuchet`: research [zin_cat_siege] 50% ×1. AI 10.
- `hold_every_pass` Hold Every Pass (17,2; ← mountain_bows + stone_throwers; 70) `fort_wall`: add_spirit `hold_every_pass_spirit`. AI 15.

**G. The Passes Hold** (x 7–9, rows 6–8). Head available when `at_war` with a non-elven country, or global_flag `zin_eastern_invasion`.
- `the_passes_hold` The Passes Hold (8,6; no prerequisite; 21) `pass_fort`: pass watch +10; war_support 0.10. AI 0; 500 when available.
- `no_road_through_nolorim` No Road Through Nolorim (7,7; ← the_passes_hold; 21) `fort_wall`: timed_spirit `no_road` 180. AI 100.
- `the_kin_send_more` The Kin Send More (9,7; ← the_passes_hold; 21) `banner_league`: kinship +5; manpower 1000. AI 100.
- `the_passes_quiet` The Passes Are Quiet (8,8; ← no_road_through_nolorim / the_kin_send_more) `olive_branch`: Avail: not at_war. stability 0.10. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `stone_in_the_passes` | Stone in the Passes | — | Pass watch +10 (fort level 2 at watch 40) |
| `walls_across_the_passes` | Walls Across the Passes | watchtowers_on_the_heights | Pass watch +10 |
| `wardens_from_the_forest` | Wardens from the Forest | ask_the_kin | Event to the Magical Forest: send wardens (pass watch +10; goodwill) or not |
| `eastern_approaches` | The Eastern Approaches | eyes_on_the_south; 4A 1752 or Gathering Dark 30 | Herders report strangers measuring the passes; for_country Magical Forest: flag `zin_magical_forest_forewarned_east` (its wardens focuses ×3) |
| `a_guest_in_the_passes` | A Guest in the Passes | — (Nolorim hosts Eindil) | Regard +15; opens the guest branch |
| `the_mountain_paths` | The Mountain Paths | a_guest_in_the_passes | The journey's accumulated delay −30 days |
| `the_passes_hold` | The Passes Hold | — (war gate) | Pass watch +10; war support |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `wardens_oath` | The Wardens' Oath | `army_core_defence_factor` 0.05, `stability_factor` 0.03 | `the_wardens_oath` |
| `wardens_first_spirit` | Wardens First | `army_org_factor` 0.05, `dig_in_speed_factor` 0.15 | `wardens_first` |
| `valleys_first_spirit` | Valleys First | `monthly_population` 0.05, `production_speed_buildings_factor` 0.05 | `valleys_first` |
| `heights_watch` | Watchtowers on the Heights | `army_intel_factor` 0.10, `recon_factor` 0.05 | `watchtowers_on_the_heights` |
| `southern_eyes` | Eyes on the South | `army_intel_factor` 0.05, `enemy_operative_detection_chance_factor` 0.10 | `eyes_on_the_south` |
| `herders` | Herders of the Heights | `recruitable_population_factor` 0.05 | `herders_of_the_heights` |
| `hold_every_pass_spirit` | Hold Every Pass | `army_defence_factor` 0.05, `max_dig_in` 2 | `hold_every_pass` |
| `no_road` | No Road Through Nolorim | `army_defence_factor` 0.10, `army_core_defence_factor` 0.10 | timed, 180 days |

### Events (namespace `zin_regional_nolorim`)

| # | Key | Title | Picture | To | Trigger | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `the_pass_wardens` | The Towers Count Their Wardens | `mirolon_passes` | Nolorim | The Pass-Wardens of Nolorim | "Light every tower." (pass watch +3) / "Rebuild the near towers first." (political_power 25) |
| 2 | `nolorim_asks_kin` | Nolorim Asks for Wardens | `generic_wilds` | three kin realms | Ask the Kin | "Send wardens." (Nolorim pass watch +5; kinship +2; the sender loses 500 manpower; AI 50, ×2 if a rift realm) / "We have our own shore." (AI 50) |
| 3 | `nolorim_asks_the_forest` | Nolorim Asks the Forest | `generic_wilds` | Magical Forest | Wardens from the Forest | "Send wardens." (pass watch +10; goodwill Nolorim; AI 70) / "Not this year." (AI 30) |
| 4 | `herders_report` | Herders Report | `mirolon_passes` | Nolorim | The Eastern Approaches | One option. for_country Magical Forest: flag `zin_magical_forest_forewarned_east`. Text: strangers with good boots measured the high road and paid for goat's milk in eastern coin |

### Historical AI route

1748–1750: pass_wardens_of_nolorim, stone_in_the_passes, ask_the_kin, nolwes_watch, the_federated_valleys, watchtowers_on_the_heights, eyes_on_the_south, pass_companies. 1750–1753: the_wardens_oath, wardens_first, wardens_from_the_forest, kin_beacons, walls_across_the_passes, the_high_roads, eastern_approaches, southern_road_watch, mountain_bows. 1754 onward: beacons_to_the_kin, nolorim_endures, hold_every_pass; war and guest branches on their gates.

---

## Implementation

### Build

Every tree is compiled by `tools/content/modules/focus_compiler.mjs` ([compiler spec](../00_format_and_compiler.md)) from its data file, run by `tools/content/build.mjs` and written in the same transaction as every other module through `tools/content/apply.mts` (the shared atomic rewrite engine). Each compiled tree replaces the interim Long Peace tree (`zin_long_peace_*`) for its country: the country history's `load_focus_tree` names the new tree.

### Files (per tree)

| Path | Content | Written by |
| --- | --- | --- |
| `docs/design/focus/regional_<name>.json` | Tree data: `"id": "regional_<name>"`, `"tier": "regional"`, `"countries": ["<Country>"]` | source |
| `common/national_focus/zin_regional_<name>.txt` | Compiled tree | focus compiler |
| `common/ideas/zin_focus_regional_<name>.txt` | Spirits `zin_regional_<name>_<key>` | focus compiler |
| `events/zin_regional_<name>.txt` | Events (effect-triggered only), namespace `zin_regional_<name>`, numbered as in the tables | focus compiler |
| `common/scripted_effects/zin_regional_<name>.txt`, `common/scripted_triggers/zin_regional_<name>.txt` | Tree-declared scripts below | focus compiler |
| `common/opinion_modifiers/zin_regional_andos_enda.txt` | Andos Enda's `zin_regional_andos_enda_northern_letters` (+15, decay 0.5 per month), from the tree's `opinion_modifiers` block | focus compiler |
| `common/ai_strategy/zin_regional_magical_lands.txt` | The strategies in the AI section, from each tree's `ai_strategies` block | focus compiler (`ai_strategies` block, F1) |
| `localisation/english/zin_focus_regional_<name>_l_english.yml` | Text | focus compiler |

Names: `lccimio`, `the_end`, `herrodon`, `andos_enda`, `nolorim`. No tree has a `raw` block.

### Characters

The five rulers keep their generated ids `<TAG>_zin_ruler` (tags resolved by name at build time); their names (from the [characters spec](../../02_lore/02_characters.md)) and the advisors and generals in each "Ruler and court" table are entries in `tools/content/data/characters.json`, which `tools/content/modules/characters.mjs` writes to `common/characters/zin_rulers.txt` and `common/characters/zin_lore_characters.txt`; every listed character is recruited by its country in the 4A 1748 history. Advisor traits are the ideologies spec's `zin_adv_*` traits; unit leader traits (`ranger`, `hill_fighter`) are the engine's, re-localised by the warfare spec. Portraits are image-generated through the art pipeline and wired by `tools/content/modules/portraits.mjs`. All names are proposed.

### Identifiers created

| Tree | Focuses | Spirits | Events | Tree scripts |
| --- | ---: | ---: | --- | --- |
| Lccimio | 40 | 8 | `zin_regional_lccimio.1`–`.3` | trigger `zin_regional_lccimio_east_quiet`; flag `zin_regional_lccimio_forewarned` |
| The End | 39 | 10 | `zin_regional_the_end.1`–`.3` | trigger `zin_regional_the_end_faces_the_mistake` |
| Herrodon | 34 | 6 | `zin_regional_herrodon.1`–`.6` | trigger `zin_regional_herrodon_keeper_friend`; effect `zin_regional_herrodon_court_keeper` |
| Andos Enda | 36 | 11 | `zin_regional_andos_enda.1`–`.4` | effect `zin_regional_andos_enda_opinion`; opinion modifier `zin_regional_andos_enda_northern_letters` |
| Nolorim | 32 | 8 | `zin_regional_nolorim.1`–`.4` | effect `zin_regional_nolorim_ask_kin` |

### Tree-declared scripted triggers and effects

| Name | Kind | Tree | Does / true when |
| --- | --- | --- | --- |
| `zin_regional_lccimio_east_quiet` | trigger | Lccimio | Not at war with any country that has `zin_region_east_lands` |
| `zin_regional_the_end_faces_the_mistake` | trigger | The End | `any_owned_state` with `zin_is_site_ocean_of_zol_coast`, or a neighbour state with `zin_is_region_zols_mistake` |
| `zin_regional_herrodon_keeper_friend` | trigger | Herrodon | Herrodon passes `zin_world_is_dragon_keeper`, or the Keeper `has_opinion` of Herrodon ≥ 50 |
| `zin_regional_herrodon_court_keeper` | effect | Herrodon | `zin_elves_goodwill` with the Keeper if the Keeper is not Herrodon |
| `zin_regional_nolorim_ask_kin` | effect | Nolorim | Fires event 2 to the three Magical Lands elven realms (not the Magical Forest, not Nolorim) with the highest opinion of Nolorim |
| `zin_regional_andos_enda_opinion` | effect (args `who`, `modifier`) | Andos Enda | The tree's opinion-modifier helper (`add_opinion_modifier` both ways) |

### Names other systems read or this spec needs

| Name | Kind | Owner | Use |
| --- | --- | --- | --- |
| `zin_elves_add_kinship`, `zin_elves_add_rivalry`, `zin_elves_add_wall_grievance`, `zin_elves_add_roost_bond`, `zin_elves_add_pass_watch`, `zin_elves_goodwill`, `zin_elves_set_pilgrim_roads`, `zin_elves_focus_dragon_pact` | scripted effects | [elves mechanic](../../04_mechanics/elves_wall_and_dragons.md) | Shorthands |
| `zin_elves_kindred_exists`, `zin_elves_refusal_question_open`, `zin_elves_is_rift_realm`, `zin_elves_is_pilgrim_road_realm`, `zin_elves_is_wall_realm`, `zin_elves_eastern_threat`, `zin_elves_dragon_need` | scripted triggers | elves mechanic | Gates |
| `zin_elves_kinship`, `zin_elves_rivalry`, `zin_elves_pass_watch`, `zin_elves_wall_roads_closed`, `zin_opinion_old_rivalry`, `zin_elves_the_old_refusal`, `zin_refusal_lifted`, `zin_is_site_boundary_groves` | variables, flag, opinion modifier, idea, site | elves mechanic | Read |
| `zin_elves_join_kindred` | scripted effect (proposed) | elves mechanic (contract additions register) | The accept option of `zin_elves.31` as an effect, so focuses can join the Kindred |
| `zin_elves_begin_feud` (arg `attacker`) | scripted effect (proposed) | elves mechanic (register) | The effect of the decision Settle the Feud of the Groves, so Herrodon's and Andos Enda's focuses can run it |
| `zin_elves_wanderers_extra` | country flag (proposed) | elves mechanic (register); read by its Wanderer decisions | Three active missions instead of two; each 10 political power cheaper |
| `zin_world_is_dragon_keeper`, `zin_dragons_free`, `zin_world_dragon_pacts` | trigger, variables | [magic and world systems](../../03_gameplay/04_magic_and_world_systems.md) | Herrodon's dragon branch |
| `zin_magical_forest_forewarned_east` | country flag | [Magical Forest tree](../major/magical_forest.md) | Set here on the Magical Forest through `for_country`; raises its AI's pass and shore focuses ×3 |
| `zin_zol_forewarned` | country flag | [Zol's Mistake](../../04_mechanics/zols_mistake.md) | Set by The End's event 3 |
| `zin_is_site_ocean_of_zol_coast` | state trigger (proposed, key sites) | map key sites (register) | The End's black-north branch |
| `zin_is_region_zols_mistake` | state trigger (proposed) | map key sites; today only in [shared_magical_lands.md](../shared/shared_magical_lands.md) | The End's black-north branch |
| `zin_eindil_is_host`, `zin_eindil_add_regard`, `zin_eindil_add_renown`, `zin_eindil_add_delay` | trigger, effects | [Eindil's journey](../../04_mechanics/eindil_journey.md) | Nolorim's guest branch, The End's rolls |
| `zin_afrit_add_footholds` | effect | [Afrit](../../04_mechanics/afrit_hidden_council.md) | Footholds |
| `zin_region_east_lands` | country flag | [economy](../../03_gameplay/02_economy.md) | Lccimio's peace check |
| `zin_rules_is_historical`, `zin_rules_is_free`, `zin_rules_ai_branch_elves_march` | scripted triggers | [defines and rules](../../00_foundation/05_defines_and_rules.md), elves mechanic | AI factors |
| `zin_loc_deliverer`, `zin_loc_eindil` | scripted localisation | [characters spec](../../02_lore/02_characters.md) | Secret-safe text |

### Raw blocks

None. Every condition is a compiler condition, a mechanic `check` or a tree-declared trigger.

### Icons and pictures

Every focus names its icon in its entry; all are catalog keys and in the game today, so no new focus icon is needed. Spirits use the icon of the focus that adds them; the three timed war spirits use their branch head's icon. Event pictures are in each events table: `generic_wilds` (groves, moots and arbitration; the catalog's fallback for the requested `elven_moot`), `generic_sea` (quays), `generic_court` (Herrodon's court), `black_isles_lights` (The End's event 3), `hermitage` (pilgrims), `mirolon_passes` (Nolorim's towers). All have the standard crop.

## AI

- Historical routes above apply under `check zin_rules_is_historical`; PLAUSIBLE (`zin_rule_historical_path`) halves the "hist" factors' distance from 1; FREE uses base weights.
- **The rivals never fight on the historical path.** Herrodon and Andos Enda take the forgiving branch heads (hist ×3) and ask the Magical Forest to judge; the feud focuses have hist ×0. Under FREE, the feud needs rivalry ≥ 90 and the AI weight is 5 ×2.
- **The Kindred.** Every tree's Kindred focus has weight 300 when available, so the realms join within weeks of its raising (mechanic acceptance: within 60 days of `zin_eastern_invasion`).
- **No march.** Nothing here sets `zin_refusal_lifted`. Under `zin_rule_ai_elves = MARCH` these realms may still use the mechanic's decision; the trees do not push them.
- **Strategies** (`common/ai_strategy/zin_regional_magical_lands.txt`): Herrodon and Andos Enda `befriend` the Magical Forest 30; Nolorim `befriend` the Magical Forest 40; Lccimio and The End `prepare_for_war` (defensive) toward the East Lands coalition leader only after `zin_eastern_invasion`.

## Acceptance

1. The compiler builds the five trees with these counts: Lccimio 40, The End 39, Herrodon 34, Andos Enda 36, Nolorim 32. Positions are unique, every focus sits below its prerequisites, exclusives are symmetric, days are multiples of 7, there is no `raw` block, and the HOI4 Agent Tools focus inspector and script validator pass.
2. On 1 Thaw 4A 1748 no focus available to the five realms declares war, creates a war goal or claim, joins a human faction or sets `zin_refusal_lifted` (compiler scan and scenario test).
3. Historical observer run, 4A 1748 to 1760 (the dates assume the 4A 1748 calendar): Herrodon and Andos Enda are never at war with each other; each of the five realms joins the Kindred within 60 days of its raising if it exists; Lccimio or The End takes its war branch head within 30 days of `zin_eastern_invasion`; no realm takes `the_feud_of_the_groves` or `one_crown_of_the_woods`.
4. Scenario test: Nolorim's branch B raises `zin_elves_pass_watch` by 35 in total (plus 3 from Nolwe's Watch and 5 from Wardens First), and pass forts follow the mechanic's floor(watch ÷ 20).
5. Scenario test: The End's event 3 "Send a boat" sets `zin_zol_forewarned`; when `zin_zol_rising` is set The End receives the Zol spec's forewarned idea.
6. *A Guest in the Passes* is unavailable unless `zin_eindil_is_host` is true for Nolorim.
7. Every modifier in the spirit tables exists in the 1.19.3 modifier documentation; every icon and picture is a catalog key; every called effect and trigger exists in the staged files.
8. The compiler's secret scan finds no "Afrit" in text reachable before `zin_afrit_revealed` and no "Eindil" in focus names or before `zin_eindil_named`; review finds no statement that the elves will march, no place for Varner and no settled Leren Compact membership for Andos Enda.
9. None of the five countries loads the interim Long Peace tree.

## Open questions

1. **Andos Enda and the Leren Compact.** OPEN_QUESTIONS, "elves" 1 and "regions: dark, magical, dead" 5. Proceeds on the proposal: friendly letters with Sonargur and no membership; no text settles the question.
2. **Herrodon's crown and its lost kin.** OPEN_QUESTIONS, "regions: dark, magical, dead" 6. Proceeds on the proposal: a crowned realm (a queen chosen once by its houses, then her line); Sacomananos and Velakton as lost kin; *One Crown of the Woods* kept, never on the historical path.
3. **The black north.** OPEN_QUESTIONS, owner's short list 4 and "regions: dark, magical, dead" 7. Proceeds on the proposal (the map today): the black areas belong to Zol's Mistake, and The End's branch E opens only where `zin_regional_the_end_faces_the_mistake` holds.
4. **Nolorim's passes and the guest branch.** OPEN_QUESTIONS, "elves" 8 and "regions: dark, magical, dead" 8. Proceeds on the proposal: the passes face the eastern mountain approach, and Nolorim keeps its small guest branch for the case the journey sends Eindil there.

Decided here (proposed): The End keeps an Archive of rolls older than Aenor's crown, and those rolls add renown and regard after `zin_eindil_named` (`rolls_of_the_first_men`). They name no new fact about the First Men.
