# Regional Trees: The Dark Lands

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier B).

## Purpose

This spec gives the six tier B countries of the Dark Lands their own focus trees: **Dondor**, **Blackton**, **Dulundur**, **Bordon**, **Dreson** and the **Troll Forest** ([../01_tiers_and_coverage.md](../01_tiers_and_coverage.md)). Goldoroth has its major tree ([../major/goldoroth.md](../major/goldoroth.md)); the seventeen other holds share [../shared/shared_dark_lands.md](../shared/shared_dark_lands.md).

Every tree here plays the region's mechanic, [The Dark Lands](../../04_mechanics/dark_lands.md), from below: the armed peace, Goldoroth's sway and the Iron Yoke, the Dark Sea Accord, the Free Moot, Volgan's envoys, the Sea of Darkness, the straits and Zol's dead on the shore. Each tree also meets the mechanic spec's minimum hooks ("Hooks for the regional and shared trees"):

| Tree | Required hook | Where |
| --- | --- | --- |
| Dondor | Resolve, the beacons, the invitations, a guarantor (Parim or Sonargur) | Branches C and D |
| Every hold (Dulundur, Bordon, Dreson, Troll Forest) | Defence against sway; a road to the Free Moot; an answer to Volgan's envoys either way | Each tree's defence, Moot and "Strangers from the South" branches |
| Blackton | A road to Lerendor's protection | Branch C |
| Troll Forest | Selling troll-kin (`zin_dark_trolls_for_pay`) | Branch B |

| Tree id | Country | Focuses | Grid | Events | Spirits |
| --- | --- | ---: | --- | --- | --- |
| `regional_dondor` | Dondor | 49 | x 0–22, y 0–9 | `zin_regional_dondor` | `zin_regional_dondor_<key>` |
| `regional_blackton` | Blackton | 39 | x 0–24, y 0–7 | `zin_regional_blackton` | `zin_regional_blackton_<key>` |
| `regional_dulundur` | Dulundur | 36 | x 0–23, y 0–9 | `zin_regional_dulundur` | `zin_regional_dulundur_<key>` |
| `regional_bordon` | Bordon | 31 | x 0–22, y 0–6 | `zin_regional_bordon` | `zin_regional_bordon_<key>` |
| `regional_dreson` | Dreson | 31 | x 0–22, y 0–8 | `zin_regional_dreson` | `zin_regional_dreson_<key>` |
| `regional_troll_forest` | Troll Forest | 30 | x 0–22, y 0–8 | `zin_regional_troll_forest` | `zin_regional_troll_forest_<key>` |

## Lore basis

**Established** (vault): the Dark Lands lie between Lerendor and the Middle Lands across narrow straits; they hold Bordon, Dreson, Dulundur, the Troll Forest, Dondor, Goldoroth and the Sea of Darkness (*Erdae and Its Regions*). Bordon, Dreson, Dulundur and the Troll Forest stay separate polities (*Great Powers and Relations*). Goldoroth is the expansionist power, seat Cocanoor, rival Dondor; Dondor, seat Notbuton, leads the Dark Sea Accord with Belonton (working table). Not all Dark Lands monsters serve Volgan; independent men, orcs, goblins, trolls, ogres, giants and demons live under separate rulers; orcs and goblins do not serve one master by nature (*Kingdoms Factions and Conflicts*, *The Second Age of Erdae*). Dondor Brutes are a people of men (*Peoples of Erdae*). Parts of the Dark Lands joined the Grand Alliance against Volgan; others served him (*The First Age of Erdae*). The great invasions of orcs and goblins had ceased in the Fourth Age (*The Fourth Age of Erdae*). Zol's dead move "through islands and straits"; ordinary weapons may break their shapes but cannot end them (*The Fourth Age of Erdae*). The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace (owner, 18 October 2026).

**Proposed elsewhere and used here:** Goldoroth's uniting about 4A 1450 and its wars with Dondor (vault chronology); Rovek of Dondor in the Grand Alliance (vault, *The First Age of Erdae*, proposed); the War of the Black Roads (vault, *The Second Age of Erdae*, proposed episode); the rulers King Dunmar, Lord Haclton, Troy the Old and Chiefs Bordag, Dresk and Dulgash ([../../02_lore/02_characters.md](../../02_lore/02_characters.md)); every mechanic name of the Dark Lands spec (sway, the Iron Yoke, tributary holds, the Free Moot, border tension, Accord resolve, the Dark Straits).

**Proposed here:** every focus, spirit, event, advisor and number; the Five Towns of Blackton and their Town Moot; Dulundur's Four Fires; Bordon as the Road-Hold of the Black Road; Dreson as the Fen-Hold; Troll Silver; all character names below.

**Kept open (no text closes them):** which holds are goblin or ogre holds (texts say "orc and goblin holds" for the region and never call a named hold goblin); where Dardan lies; the relation of Zol's dead to Volgan's; the exact place of the straits; whether the Sea of Darkness opens to the Ocean of Zol. No text names Afrit, tells the size of Volgan's hosts, or says fire ends Zol's dead.

## Design

### Rules for every tree in this spec

- **Peaceful start.** Nothing available on 1 Thaw 4A 1748 declares war, creates a war goal or a claim. War branches sit in rows 6 and below and need `at_war`, `zin_war_of_last_crowns`, `zin_volgan_marches` or `zin_zol_rising`. The only claims (Dondor's *The Counterstroke*, Dulundur's *Strike the Tributaries*) need an existing war with Goldoroth.
- **Secret-safe text.** Before `zin_afrit_revealed` no text names Afrit or calls the Deliverer dark; before `zin_eindil_named` Eindil is `[zin_loc_eindil]` ("the Man from the Ice"). Focus names never contain "Eindil".
- **Volgan's envoys** are "envoys from Nafeher" or "strangers from the south". No text says the holds serve Volgan.
- **Prerequisites.** A focus with no "←" in its entry has no prerequisite: every row-0 focus and every branch head in rows 6 and below. A branch head's gate is its `available` (and `allow_branch` where stated).
- **Days** are 35 unless a focus says 70; war focuses marked 21.
- **Spirit keys** never repeat a focus key of the same tree (focus and idea localisation keys would collide); where a spirit shares its focus's name the key ends in `_spirit`. A spirit takes the icon of the focus that adds it.
- **Key-focus tables** summarise; the branch lists are the definition. The backticked key after each focus's position is its catalog icon ([../02_icon_catalog.md](../02_icon_catalog.md), sprite `GFX_focus_zin_<key>`).
- **AI** is the focus's `ai.base` ("AI 0; n when available" compiles to base n: the AI can only pick a focus once its `available` holds); "hist" is the factor under `check zin_rules_is_historical`; "free" under `check zin_rules_is_free`; "south" when Goldoroth has `zin_goldoroth_southern_bargain` (`check zin_goldoroth_seeks_the_south`).

### Notation

| Shorthand | Effect |
| --- | --- |
| sway ±v | `call zin_goldoroth_add_sway(target = ROOT, value = v)` (caps and halving per the mechanic) |
| resolve ±v | `call zin_dark_add_accord_resolve(value = v)` |
| tension ±v | `call zin_dark_add_border_tension(value = v)` |
| pact ±v | `call zin_dark_add_volgan_pact(target = ROOT, value = v)` (never raises a country to 3) |
| lean ±v | `call zin_leren_add_lean(value = v)` on ROOT |
| gd ±v | `call zin_world_add_gathering_dark(value = v)` |
| opinion X ±v (k) | `call zin_regional_<tree>_opinion(who = X, modifier = k)`: tree-declared opinion modifier `zin_regional_<tree>_<k>` (see Implementation) |
| temper ±v | `for_country Goldoroth: call zin_goldoroth_add_temper(value = v)` |
| in no faction / in the Accord | tree triggers `zin_regional_<tree>_unbound` (`is_in_faction = no`, `is_subject = no`) and `zin_dark_is_accord_member` (mechanic) |
| join the Moot | `call zin_dark_join_free_moot` on ROOT (proposed mechanic effect: the accept option of `zin_dark.70`) |
| found the Moot | `call zin_dark_found_free_moot` on ROOT (proposed mechanic effect: the decision Call the Free Moot without its cost) |
| @capital, @random_owned, @random_coastal | building locations as in the compiler |

Prerequisites name exact focus keys of the same tree: `a + b` means both, `a / b` means either. Exclusive pairs are marked "excl" on both focuses.

---

## Dondor

### Situation in 4A 1748

Dondor is a kingdom of men in the northern Dark Lands, a hard country of salt marsh, beacon hills and one great walled town, Notbuton, on the Sea of Darkness (seat: working table; the rest proposed). Its people are the Dondor Brutes, broad, stubborn soldiers who have held the march against the orc kingdom of Goldoroth since Goldoroth's uniting three centuries ago. King Dunmar keeps the Dark Sea Accord with Belonton, an orc confederacy of the south: in the Dark Lands, neighbours choose sides by need, not by people. In 4A 1748 the march is in an armed peace. Raiders cross it in summer, blood-prices are paid in winter, and nobody calls it a war. Dondor holds one state and cannot stand alone; its strength is its walls, its Brutes and the friends it can call across the straits.

### Role

- **Historical path (proposed):** Dondor lights the beacons, petitions Parim (the Golden Court sends its blessing and nothing else), and calls on Sonargur, whose *Shield of Dondor* guarantees it. Because of that guarantee Goldoroth never takes *The Accord Must Break*. When Volgan marches (Mistfall 4A 1755), holds sworn to Nafeher (if any) strike Dondor's march; Dondor holds. When Zol's dead rise, Dondor watches the shore and accepts Goldoroth's truce against the dead if it is offered. Dondor exists in 4A 1760.
- **War of the Last Crowns:** a side theatre. Dondor defends the Accord and the Dark Sea; it never marches on the Middle Lands.
- **Alternatives:** a Dondor without friends can be stormed by Goldoroth; a strong Dondor can strike back across the march (*The Counterstroke*) once Goldoroth attacks it.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Dondor>_zin_ruler` | King Dunmar of Dondor | Country leader, `zin_dom_warlord` | — |
| `zin_regional_dondor_gethra` | Gethra Ironjaw, Beacon-Warden | Political advisor | `zin_adv_muster_master` |
| `zin_regional_dondor_wenna` | Wenna Saltbrow, Envoy to the Straits | Political advisor | `zin_adv_envoy` |
| `zin_regional_dondor_harl` | Old Harl of the Marches | Political advisor | `zin_adv_war_speaker` |
| `zin_regional_dondor_draga` | Captain Draga Hollin | Corps commander, skill 3 | `hill_fighter` |

Country flag `zin_tradition_dondor_brutes` (peoples spec) is set at start.

### Tree `regional_dondor` (49 focuses)

**A. The Brute-King's Hall** (x 0–4, rows 0–4). Government. Opens at start. Exclusive: *The King's Peace* / *The Brute Muster*.
- `the_brute_kings_hall` The Brute-King's Hall (2,0; 70) `crown_iron`: political_power 50; event `the_hall_assembles`. AI 40.
- `oath_of_the_brutes` The Oath of the Brutes (1,1; ← the_brute_kings_hall) `handshake_oath`: add_spirit `oath_of_the_brutes_spirit`. AI 20.
- `lords_of_the_marches` Lords of the Marches (3,1; ← the_brute_kings_hall) `banner_plain`: stability 0.05; political_power 25. AI 20.
- `rovek_remembered` Rovek Remembered (1,2; ← oath_of_the_brutes) `book_lore`: event `rovek_remembered`. AI 10.
- `the_kings_justice` The King's Justice (3,2; ← lords_of_the_marches) `seal_royal`: add_spirit `kings_justice`. AI 15.
- `the_kings_peace` The King's Peace (1,3; ← rovek_remembered / the_kings_justice; excl the_brute_muster) `olive_branch`: add_spirit `the_kings_peace_spirit`; tension −5. AI 20; hist ×3.
- `the_brute_muster` The Brute Muster (3,3; ← rovek_remembered / the_kings_justice; excl the_kings_peace) `levy_muster`: add_spirit `the_brute_muster_spirit`; war_support 0.05; tension +3. AI 15; free ×2.
- `crown_of_iron_and_salt` A Crown of Iron and Salt (2,4; ← the_kings_peace / the_brute_muster; 70) `crown_iron`: swap_spirit `kings_justice` → `crown_of_iron_and_salt_spirit`; political_power 50. AI 15.

**B. Notbuton and the Marches** (x 5–8, rows 0–4). Economy and walls. Opens at start.
- `harbour_of_notbuton` The Harbour of Notbuton (6,0; 70) `harbour_lake`: building naval_base 1 @capital; building dockyard 1 @capital. AI 30.
- `brute_forges` The Brute Forges (5,1; ← harbour_of_notbuton) `forge_anvil`: building arms_factory 1 @capital. AI 20.
- `salt_and_fish` Salt and Fish of the Dark Sea (7,1; ← harbour_of_notbuton) `fishing_boats`: add_spirit `dark_sea_fisheries`. AI 15.
- `walls_on_the_march` Walls on the March (5,2; ← brute_forges) `fort_wall`: building bunker 2 @capital. AI 20.
- `the_beacon_hills` The Beacon Hills (7,2; ← salt_and_fish) `beacon`: building coastal_bunker 1 @capital; flag `zin_regional_dondor_beacon_chain`; resolve +3. AI 20.
- `notbuton_stands` Notbuton Stands (6,3; ← walls_on_the_march + the_beacon_hills; 70) `pass_fort`: building bunker 2 @capital; add_spirit `notbuton_stands_spirit`. AI 20.
- `iron_from_the_holds` Iron Bought from the Holds (6,4; ← notbuton_stands) `caravan`: equipment zin_arms_equipment 500; call `zin_regional_dondor_iron_trade`. AI 10.

**C. The Dark Sea Accord** (x 9–13, rows 0–4). Diplomacy. Opens at start. Mechanic: resolve, the beacons, invitations, the Free Moot.
- `the_dark_sea_accord` The Dark Sea Accord (11,0) `banner_league`: resolve +5; political_power 25. AI 40.
- `light_the_sea_beacons` Light the Sea Beacons (10,1; ← the_dark_sea_accord) `beacon`: resolve +5; event_for Belonton `beacons_answered`. AI 25.
- `belontons_oath` Belonton's Oath (12,1; ← the_dark_sea_accord) `handshake_oath`: Avail: exists Belonton; check `zin_regional_dondor_belonton_in_accord`. event_for Belonton `oath_renewed`. AI 25.
- `custom_of_the_blood_price` The Custom of the Blood-Price (10,2; ← light_the_sea_beacons) `tribute_chest`: tension −10; political_power 25. AI 15; ×2 if tension ≥ 50.
- `doors_open_to_the_holds` Doors Open to the Holds (12,2; ← belontons_oath) `envoy`: call `zin_regional_dondor_invite_holds`. AI 15.
- `brothers_of_blackton` Brothers of Blackton (11,3; ← custom_of_the_blood_price / doors_open_to_the_holds) `handshake_oath`: Avail: exists Blackton; check `zin_regional_dondor_blackton_unbound`. event_for Blackton `the_accord_asks`. AI 15.
- `moot_and_accord` The Moot and the Accord (13,3; ← doors_open_to_the_holds) `alliance_rings`: Avail: global_flag `zin_dark_free_moot`. resolve +5; call `zin_regional_dondor_greet_moot`. AI 30 when available.
- `one_shore_one_watch` One Shore, One Watch (11,4; ← brothers_of_blackton; 70) `eye_watchful`: resolve +10; add_spirit `accord_watch`. AI 20.

**D. Friends Beyond the Straits** (x 14–18, rows 0–4). Guarantors and the wider world.
- `friends_beyond_the_straits` Friends Beyond the Straits (16,0) `envoy`: political_power 25. AI 40; hist ×2.
- `notbuton_asks_parim` Notbuton Asks Parim (15,1; ← friends_beyond_the_straits) `scroll_sealed`: Avail: exists Aenor; not flag `zin_dark_petitioned_parim`. event_for Aenor `zin_dark.30`; flag `zin_dark_petitioned_parim`. AI 50; hist ×2 (taken in 4A 1748).
- `notbuton_calls_on_the_north` Notbuton Calls on the North (17,1; ← friends_beyond_the_straits) `two_crowns`: Avail: exists Lerendor; not at_war_with Lerendor. event_for Lerendor `zin_dark.31`; lean +10. AI 40; hist ×2.
- `under_the_lost_causes_banner` Under the Lost Cause's Banner (15,2; ← notbuton_asks_parim) `banner_league`: Avail: check `zin_lost_cause_exists`; not flag `zin_lost_cause_member`. event_for Aenor `dondor_seeks_the_league`. AI 15.
- `ships_for_notbuton` Ships for Notbuton (17,2; ← notbuton_calls_on_the_north) `warship_sail`: Avail: check `zin_regional_dondor_leren_shield` (Lerendor guarantees Dondor, or `zin_leren_lean` above 29). add_spirit `leren_ship_masters`; lean +10. AI 20.
- `old_debts_of_the_alliance` Old Debts of the Alliance (16,3; ← under_the_lost_causes_banner / ships_for_notbuton) `scroll_treaty`: Avail: variable global `zin_gathering_dark` above 29 or global_flag `zin_golden_king_dead`. resolve +5; political_power 50. AI 20.
- `a_strangers_warning` A Stranger's Warning (16,4; ← old_debts_of_the_alliance) `scout_lantern`: Avail: global_flag `zin_eindil_named`; variable global `zin_eindil_stage` above 7. call `zin_eindil_add_regard(value = 25)` (Dondor then receives the journey's Warnings of the Heir); research [zin_cat_wards] 50% ×1. Description uses `[zin_loc_eindil]`. AI 10; hist ×0.

**E. The Brutes** (x 19–22, rows 0–4). Army.
- `brutes_of_dondor` The Brutes of Dondor (20,0; 70) `sword_shield`: army_experience 10; research [zin_cat_arms] 50% ×1. AI 30.
- `the_shield_line` The Shield-Line (19,1; ← brutes_of_dondor) `sword_shield`: research [zin_cat_armour] 50% ×1. AI 15.
- `riders_of_the_march` Riders of the March (21,1; ← brutes_of_dondor) `horse_cavalry`: research [zin_cat_mounts] 50% ×1. AI 10.
- `brute_companies` Brute Companies (19,2; ← the_shield_line) `war_drums`: add_spirit `brute_companies_spirit`. AI 15.
- `beacon_scouts` Beacon Scouts (21,2; ← riders_of_the_march) `scout_lantern`: army_experience 5; add_spirit `beacon_scouts_spirit`. AI 10.
- `muster_drill` The Muster Drill (20,3; ← brute_companies + beacon_scouts; 70) `levy_muster`: manpower 2000; flag `zin_regional_dondor_muster_drill`. AI 15; ×2 if tension ≥ 60.
- `the_unbroken_line` The Unbroken Line (20,4; ← muster_drill) `fort_wall`: research [zin_cat_walls] 50% ×1; add_spirit `unbroken_line`. AI 15.

**F. The Accord at War** (x 9–14, rows 6–9). Opens when the root is available: `at_war` and (at_war_with Goldoroth, or global_flag `zin_volgan_marches`, or global_flag `zin_war_of_last_crowns`).
- `the_accord_at_war` The Accord at War (12,6; no prerequisite) `banner_league`: war_support 0.10; resolve +10. AI 0; 300 when available.
- `every_beacon_lit` Every Beacon Lit (11,7; ← the_accord_at_war; 21) `beacon`: timed_spirit `every_beacon_lit_spirit` 180. AI 100.
- `hold_notbuton` Hold Notbuton (13,7; ← the_accord_at_war; 21) `fort_wall`: building bunker 2 @capital; manpower 3000. AI 100.
- `call_the_guarantors` Call the Guarantors (12,8; ← every_beacon_lit / hold_notbuton) `envoy`: event_for Lerendor `notbuton_burns`; event_for Aenor `notbuton_burns`. AI 100.
- `the_counterstroke` The Counterstroke (11,9; ← call_the_guarantors) `knight_lance`: Avail: at_war_with Goldoroth; check `zin_regional_dondor_cores_held`. call `zin_regional_dondor_claim_march`; army_experience 15. AI 20; hist ×0.
- `the_shield_holds` The Shield Holds (13,9; ← call_the_guarantors) `sword_shield`: army_experience 20; stability 0.05. AI 50.

**G. The Dead on the Shore** (x 18–22, rows 6–8). Opens on `zin_zol_rising`.
- `dead_on_the_dark_shore` Dead on the Dark Shore (20,6; no prerequisite) `black_hulls`: Avail: global_flag `zin_zol_rising`. building coastal_bunker 2 @capital; army_experience 5. AI 0; 200 when available.
- `stand_with_the_living` Stand with the Living (19,7; ← dead_on_the_dark_shore) `handshake_oath`: Avail: at_war_with Zol. flag `zin_regional_dondor_stands_with_living`; tension −10. AI 100.
- `fire_breaks_their_shapes` Fire Breaks Their Shapes (21,7; ← dead_on_the_dark_shore) `beacon`: add_spirit `shore_fires`. Description: "Fire breaks their shapes. It does not end them." AI 50.
- `the_strait_watch` The Strait Watch (20,8; ← stand_with_the_living / fire_breaks_their_shapes) `strait_chain`: building coastal_bunker 1 @capital; navy_experience 10; add_spirit `strait_watch`. AI 50.

**H. After the Storm** (x 1–3, rows 6–7). Peace after the great war.
- `the_accord_endures` The Accord Endures (2,6; no prerequisite) `banner_league`: Avail: after 1757.1.1; not at_war. resolve +10; political_power 50; stability 0.05. AI 0; 50 when available.
- `charter_of_the_dark_sea` A Charter of the Dark Sea (2,7; ← the_accord_endures; 70) `scroll_treaty`: Avail: global variable `zin_dark_accord_resolve` above 59. add_spirit `charter_of_the_dark_sea_spirit`; resolve +10. AI 50.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `notbuton_asks_parim` | Notbuton Asks Parim | friends_beyond_the_straits | Fires the mechanic's `zin_dark.30` to Aenor (blessing, guarantee, or the Lost Cause invitation) and sets `zin_dark_petitioned_parim`, so the once-per-game decision Petition Parim is spent |
| `notbuton_calls_on_the_north` | Notbuton Calls on the North | friends_beyond_the_straits | Fires `zin_dark.31` to Lerendor ("Ships for Notbuton" guarantees Dondor, resolve +10); Dondor's Leren lean +10 |
| `the_beacon_hills` | The Beacon Hills | salt_and_fish | Coastal fort; resolve +3; `zin_regional_dondor_beacon_chain` (the Accord decision Light the Sea Beacons cools down in 120 days, not 180) |
| `doors_open_to_the_holds` | Doors Open to the Holds | belontons_oath | Fires `zin_dark.20` (Invitation to the Accord) to the two eligible holds with the lowest sway |
| `moot_and_accord` | The Moot and the Accord | doors_open_to_the_holds; Free Moot exists | Resolve +5; Dondor and every Moot member gain opinion `zin_regional_dondor_same_shore` (+15) both ways |
| `muster_drill` | The Muster Drill | brute_companies + beacon_scouts | 2,000 manpower; `zin_regional_dondor_muster_drill` (Muster the Brutes cools down in 240 days, not 365) |
| `the_accord_at_war` | The Accord at War | none (war gate) | War support +10%; resolve +10 |
| `the_counterstroke` | The Counterstroke | call_the_guarantors; at war with Goldoroth; all Dondor cores held | State claims on every `zin_is_site_goldoroth_march` state; never taken by the historical AI |
| `stand_with_the_living` | Stand with the Living | dead_on_the_dark_shore; at war with Zol | `zin_regional_dondor_stands_with_living` (Dondor's AI accepts Goldoroth's truce against the dead, `zin_goldoroth.18`, at 100); tension −10 |
| `a_strangers_warning` | A Stranger's Warning | old_debts_of_the_alliance; `zin_eindil_named`, stage ≥ 8 | Eindil's regard of Dondor +25, so the journey's warnings reach Notbuton |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `oath_of_the_brutes_spirit` | The Oath of the Brutes | `war_support_factor` 0.05, `army_morale_factor` 0.05 | `oath_of_the_brutes`; permanent |
| `kings_justice` | The King's Justice | `stability_factor` 0.05, `political_power_gain` 0.10 | `the_kings_justice`; replaced by `crown_of_iron_and_salt_spirit` |
| `the_kings_peace_spirit` | The King's Peace | `stability_factor` 0.05, `production_speed_buildings_factor` 0.05 | `the_kings_peace`; permanent |
| `the_brute_muster_spirit` | The Brute Muster | `conscription_factor` 0.05, `army_attack_factor` 0.05 | `the_brute_muster`; permanent |
| `crown_of_iron_and_salt_spirit` | A Crown of Iron and Salt | `stability_factor` 0.08, `political_power_gain` 0.15, `army_core_defence_factor` 0.05 | `crown_of_iron_and_salt`; permanent |
| `dark_sea_fisheries` | Fisheries of the Dark Sea | `monthly_population` 0.05, `consumer_goods_factor` −0.03 | `salt_and_fish`; permanent |
| `notbuton_stands_spirit` | Notbuton Stands | `army_core_defence_factor` 0.10, `max_dig_in` 2 | `notbuton_stands`; permanent |
| `accord_watch` | One Shore, One Watch | `army_defence_factor` 0.05, `naval_detection` 0.10 | `one_shore_one_watch`; permanent |
| `leren_ship_masters` | Leren Ship-Masters | `naval_detection` 0.10, `navy_org_factor` 0.05 | `ships_for_notbuton`; removed if Dondor goes to war with Lerendor |
| `brute_companies_spirit` | Brute Companies | `army_attack_factor` 0.05, `army_org_factor` 0.05 | `brute_companies`; permanent |
| `beacon_scouts_spirit` | Beacon Scouts | `recon_factor` 0.10, `army_intel_factor` 0.10 | `beacon_scouts`; permanent |
| `unbroken_line` | The Unbroken Line | `army_core_defence_factor` 0.10, `dig_in_speed_factor` 0.20 | `the_unbroken_line`; permanent |
| `every_beacon_lit_spirit` | Every Beacon Lit | `army_defence_factor` 0.10, `war_support_factor` 0.05 | timed, 180 days |
| `shore_fires` | Fires on the Shore | `army_defence_factor` 0.05, `coastal_bunker_effectiveness_factor` 0.15 | `fire_breaks_their_shapes`; removed on `zin_zol_withdrawn` |
| `strait_watch` | The Strait Watch | `naval_detection` 0.15, `amphibious_invasion_defence` 0.20 | `the_strait_watch`; permanent |
| `charter_of_the_dark_sea_spirit` | A Charter of the Dark Sea | `stability_factor` 0.05, `army_defence_factor` 0.05, `trade_opinion_factor` 0.10 | `charter_of_the_dark_sea`; permanent |

### Events (namespace `zin_regional_dondor`)

| # | Key | Title | To | Trigger | Picture | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `the_hall_assembles` | The Hall Assembles | Dondor | The Brute-King's Hall | `generic_court` | "The King hears the marches." (stability 0.03; AI 50) / "The King hears the harbour." (political_power 25; AI 50) |
| 2 | `rovek_remembered` | Rovek Remembered | Dondor | Rovek Remembered | `generic_war` | One option, war_support 0.03. Text: the chronicles of Notbuton name a Rovek of Dondor among the free banners against Volgan; the holds tell it differently. Nothing claims that all Dondor joined |
| 3 | `beacons_answered` | Beacons on the Southern Hills | Belonton | Light the Sea Beacons | `generic_sea` | "Belonton lights its hills." (opinion Dondor +10 `beacon_kin`; resolve +2; AI 80) / "Belonton watches." (AI 20) |
| 4 | `oath_renewed` | The Oath Renewed | Belonton | Belonton's Oath | `generic_court` | "Keep the oath." (country flag `zin_dark_oath_sworn`; resolve +3; AI 70) / "The oath is old." (resolve −3; AI 30) |
| 5 | `the_accord_asks` | The Accord Asks | Blackton | Brothers of Blackton | `generic_sea` | "Stand with Notbuton." (for_country Dondor: invite Blackton (`add_to_faction`); resolve +5; AI 20 + Blackton's opinion of Dondor ÷ 2; ×0 if Blackton has `zin_regional_blackton_free_harbour`) / "Blackton trades with all." (opinion Dondor +5; AI the rest) |
| 6 | `dondor_seeks_the_league` | Notbuton Seeks the League | Aenor | Under the Lost Cause's Banner | `generic_court` | "Name Dondor an honorary crown." (for_country Dondor: flag `zin_lost_cause_member`; call `zin_lost_cause_add_strength(value = 2)`; event_for Dondor `answer_from_afar`; AI 20 + `zin_aenor_lost_cause` ÷ 2) / "Notbuton is far away." (AI 60 × (1 + `zin_court_corruption` ÷ 100)) |
| 7 | `notbuton_burns` | Notbuton Burns | Lerendor; Aenor | Call the Guarantors | `generic_war` | "Send help." (call `zin_regional_dondor_join_war`: `add_to_war` on Dondor's side against each of Dondor's enemies; event_for Dondor `answer_from_afar`; `zin_story_war` not set: this is joining, not declaring; AI Lerendor 20 + Dondor's lean ÷ 2, ×2 if it guarantees Dondor, ×0 if at war with Dondor; AI Aenor 10, ×3 if it guarantees Dondor) / "We cannot." (AI the rest) |
| 8 | `answer_from_afar` | An Answer from Afar | Dondor | Accepting options of 6 and 7 | `generic_sea` | One option, "Notbuton is not alone." (stability 0.03). Text: a friend beyond the straits has answered. Refusals send nothing |

### Historical AI route

| When | Focuses |
| --- | --- |
| 1748 | the_brute_kings_hall, friends_beyond_the_straits, notbuton_asks_parim, notbuton_calls_on_the_north, the_dark_sea_accord, light_the_sea_beacons |
| 1749 | harbour_of_notbuton, belontons_oath, brutes_of_dondor, oath_of_the_brutes, lords_of_the_marches |
| 1750–1752 | the_kings_justice, rovek_remembered, the_kings_peace, the_shield_line, brute_forges, walls_on_the_march, salt_and_fish, the_beacon_hills, custom_of_the_blood_price, doors_open_to_the_holds |
| 1753–1754 | notbuton_stands, ships_for_notbuton, crown_of_iron_and_salt, brute_companies, riders_of_the_march, beacon_scouts, muster_drill, brothers_of_blackton, old_debts_of_the_alliance |
| 1755–1757 | one_shore_one_watch, the_unbroken_line, moot_and_accord (if the Moot exists); war branch only if attacked; the shore branch on `zin_zol_rising` |
| 1757–1760 | the_accord_endures, charter_of_the_dark_sea |

---

## Blackton

### Situation in 4A 1748

Blackton is five walled towns of men on the coast of the Sea of Darkness: the Five Towns (proposed), each with its own harbour, salt-pans and guild, under Lord Haclton, who holds the harbour of the largest town and presides over the Town Moot. Blackton lives by trade between the forge-pits of the holds, the Leren ships of the north and the markets of the Middle Lands. It buys orc iron, sells salt, cloth and charts, and pays Goldoroth's corsairs when it must. It belongs to no faction. Goldoroth cannot bend it with gifts (its sway is capped at 40); only war could take it, and Lerendor would notice.

### Role

- **Historical path (proposed):** Blackton stays a free harbour. It trades with everyone, leans toward Sonargur, sends the southern envoys away and keeps out of the Accord. In the War of the Last Crowns it closes its gates and arms its merchantmen; when Zol's dead rise it lights shore lanterns.
- **Alternatives:** Blackton can join the Dark Sea Accord, accept Leren protection (becoming Lerendor's subject through `zin_leren.71`), become a town council (Light), or deal with Cocanoor.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Blackton>_zin_ruler` | Lord Haclton | Country leader, `zin_wild_freeholds` | — |
| `zin_regional_blackton_ilse` | Ilse Corran, Harbour-Reeve | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_blackton_tobin` | Tobin Greywater, Keeper of the Charts | Political advisor | `zin_adv_treasurer` |
| `zin_regional_blackton_aldo` | Aldo Fenwick, Master of the Walls | Political advisor | `zin_adv_muster_master` |
| `zin_regional_blackton_merrin` | Captain Merrin Vael | Navy leader, skill 2 | — |

### Tree `regional_blackton` (39 focuses)

**A. The Five Towns** (x 0–4, rows 0–4). Government. Exclusive: *The Lord's Charter* / *The Free Towns' Charter*.
- `the_five_towns` The Five Towns (2,0; 70) `guild_hall`: political_power 50; event `the_town_moot`. AI 40.
- `haclton_of_the_harbour` Haclton of the Harbour (1,1; ← the_five_towns) `seal_wax`: stability 0.03; political_power 25. AI 20.
- `the_town_moot_sits` The Town Moot Sits (3,1; ← the_five_towns) `council_table`: add_spirit `town_moot`. AI 20.
- `the_lords_charter` The Lord's Charter (1,2; ← haclton_of_the_harbour / the_town_moot_sits; excl the_free_towns_charter) `charter_old`: political_power 50; swap_spirit `town_moot` → `lords_charter`. AI 20; hist ×3.
- `the_free_towns_charter` The Free Towns' Charter (3,2; ← haclton_of_the_harbour / the_town_moot_sits; excl the_lords_charter) `charter_free`: popularity light +0.25; government light; call `zin_politics_set_stance(stance = zin_light_council)`; swap_spirit `town_moot` → `free_towns_charter`. AI 10; hist ×0.
- `walls_of_the_five_towns` Walls of the Five Towns (2,3; ← the_lords_charter / the_free_towns_charter) `fort_wall`: building bunker 1 @capital; building coastal_bunker 1 @random_coastal. AI 20.
- `a_freehold_among_holds` A Freehold Among the Holds (2,4; ← walls_of_the_five_towns; 70) `banner_plain`: add_spirit `freehold_among_holds`. AI 20.

**B. Salt, Iron and Sails** (x 5–8, rows 0–3). Economy.
- `salt_iron_and_sails` Salt, Iron and Sails (6,0; 70) `market_stalls`: building dockyard 1 @capital; political_power 25. AI 35.
- `the_salt_pans` The Salt-Pans (5,1; ← salt_iron_and_sails) `granary`: building industrial_complex 1 @random_owned. AI 20.
- `the_iron_market` The Iron Market (7,1; ← salt_iron_and_sails) `forge_anvil`: add_spirit `iron_market`; call `zin_regional_blackton_iron_trade`. AI 20.
- `charts_of_the_dark_sea` Charts of the Dark Sea (5,2; ← the_salt_pans) `sea_charts`: navy_experience 10; research [zin_cat_galleys] 50% ×1. AI 15.
- `harbour_of_the_five_towns` Harbour of the Five Towns (7,2; ← the_iron_market) `harbour_lake`: building naval_base 1 @capital; building dockyard 1 @random_coastal. AI 15.
- `merchant_houses` The Merchant Houses (6,3; ← charts_of_the_dark_sea + harbour_of_the_five_towns; 70) `coin_chest`: add_spirit `merchant_houses_spirit`; building industrial_complex 1 @random_owned. AI 15.

**C. The Northern Friend** (x 9–12, rows 0–3). Lerendor. Exclusive: *Under the Leren Banner* / *The Free Harbour*.
- `sails_to_sonargur` Sails to Sonargur (10,0) `ship_voyage`: Avail: exists Lerendor. lean +15; political_power 25. AI 30.
- `the_leren_quarter` The Leren Quarter (9,1; ← sails_to_sonargur) `guild_hall`: lean +10; add_spirit `leren_quarter`. AI 15.
- `strait_pilots` Strait Pilots (11,1; ← sails_to_sonargur) `strait_chain`: navy_experience 10; lean +5. AI 15.
- `ask_for_leren_ships` Ask for Leren Ships (10,2; ← the_leren_quarter / strait_pilots) `warship_sail`: Avail: exists Lerendor; not at_war_with Lerendor. event_for Lerendor `blackton_asks_for_ships`. AI 20.
- `under_the_leren_banner` Under the Leren Banner (9,3; ← ask_for_leren_ships; excl the_free_harbour) `two_crowns`: Avail: variable `zin_leren_lean` above 59. lean +20; flag `zin_regional_blackton_seeks_protection`. AI 10; hist ×0.2; ×3 if at war with Goldoroth.
- `the_free_harbour` The Free Harbour (11,3; ← ask_for_leren_ships; excl under_the_leren_banner) `anchor_rope`: add_spirit `free_harbour`; flag `zin_regional_blackton_free_harbour`. AI 20; hist ×3.

**D. Between Cocanoor and the Accord** (x 13–17, rows 0–3). The Dark Lands question. Exclusive: *With the Accord* / *The Coin of Cocanoor*.
- `between_two_shores` Between Two Shores (15,0) `scroll_treaty`: political_power 25. AI 30.
- `our_walls_our_own` Our Walls, Our Own (14,1; ← between_two_shores) `fort_wall`: sway −10. AI 20.
- `the_corsair_question` The Corsair Question (16,1; ← between_two_shores) `corsair_raider`: event `corsair_sails`. AI 20.
- `with_the_accord` With the Accord (14,2; ← our_walls_our_own; excl coin_of_cocanoor) `banner_league`: Avail: exists Dondor; check `zin_regional_blackton_unbound`. event_for Dondor `blackton_seeks_the_accord`. AI 10; hist ×0.5; ×3 if tension ≥ 70.
- `coin_of_cocanoor` The Coin of Cocanoor (16,2; ← the_corsair_question; excl with_the_accord) `coin_chest`: sway +10; opinion Goldoroth +15 (`good_customers`); equipment zin_arms_equipment 300; political_power 25. AI 5; hist ×0; free ×2.
- `neither_master_nor_tribute` Neither Master nor Tribute (15,3; ← with_the_accord / coin_of_cocanoor) `chain_broken`: add_spirit `between_two_shores_spirit`; tension −3. AI 20.

**E. Strangers from the South** (x 18–20, rows 0–2). Volgan's envoys. Exclusive: *Hang the Envoys* / *Southern Silver*.
- `strangers_in_the_harbour` Strangers in the Harbour (19,0) `envoy`: Avail: variable `zin_volgan_pact` above 0 or after 1750.1.1. event `strangers_in_the_harbour`; political_power 25. AI 30.
- `hang_the_envoys` Send Them Back in Chains (18,1; ← strangers_in_the_harbour; excl southern_silver) `chain_broken`: pact −1; opinion Volgan −15 (`chains_for_envoys`); stability 0.03. AI 30; hist ×3.
- `southern_silver` Southern Silver (20,1; ← strangers_in_the_harbour; excl hang_the_envoys) `coin_chest`: pact +1; political_power 50; flag `zin_dark_took_southern_gifts`. AI 10; hist ×0.
- `watchers_on_the_quay` Watchers on the Quay (19,2; ← hang_the_envoys / southern_silver) `eye_watchful`: add_spirit `quay_watch`. AI 20.

**F. The Town Companies** (x 21–24, rows 0–3). Army and navy.
- `town_companies` The Town Companies (22,0; 70) `spear_levy`: army_experience 10; research [zin_cat_bows] 50% ×1. AI 30.
- `crossbows_on_the_walls` Crossbows on the Walls (21,1; ← town_companies) `bow_archers`: research [zin_cat_bows] 50% ×1; building bunker 1 @capital. AI 15.
- `the_harbour_chain` The Harbour Chain (23,1; ← town_companies) `strait_chain`: building coastal_bunker 1 @capital. AI 15.
- `sea_companies` Sea Companies (22,2; ← crossbows_on_the_walls + the_harbour_chain) `galley_oars`: navy_experience 15; research [zin_cat_galleys] 50% ×1. AI 15.
- `militia_of_the_five_towns` Militia of the Five Towns (22,3; ← sea_companies; 70) `levy_muster`: manpower 3000; add_spirit `five_towns_militia`. AI 15.

**G. War and the Shore** (x 5–11, rows 6–7).
- `the_towns_close_their_gates` The Towns Close Their Gates (6,6; no prerequisite) `fort_wall`: Avail: at_war, or global_flag `zin_war_of_last_crowns`. war_support 0.10; building bunker 1 @capital. AI 0; 200 when available.
- `privateers_of_blackton` Privateers of Blackton (5,7; ← the_towns_close_their_gates) `corsair_raider`: Avail: at_war. navy_experience 15; timed_spirit `privateers` 365. AI 100.
- `the_five_towns_stand` The Five Towns Stand (7,7; ← the_towns_close_their_gates) `sword_shield`: timed_spirit `five_towns_stand` 365. AI 100.
- `dead_on_our_shore` Dead on Our Shore (10,6; no prerequisite) `black_hulls`: Avail: global_flag `zin_zol_rising`. building coastal_bunker 1 @random_coastal; army_experience 5. AI 0; 200 when available.
- `shore_lanterns` Shore Lanterns (10,7; ← dead_on_our_shore) `lighthouse`: add_spirit `shore_lanterns_spirit`. Description: the lanterns show where the dead come ashore; they do not stop them. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `ask_for_leren_ships` | Ask for Leren Ships | the_leren_quarter / strait_pilots | Event to Lerendor: a guarantee and lean +10, or (lean ≥ 60) Sonargur's protection through `zin_leren_offer_protection`, or nothing |
| `under_the_leren_banner` | Under the Leren Banner | ask_for_leren_ships; lean ≥ 60 | Lean +20; `zin_regional_blackton_seeks_protection` (Lerendor's AI may offer protection at lean 60, not 80) |
| `the_free_harbour` | The Free Harbour | ask_for_leren_ships | Spirit *The Free Harbour*; flag that keeps Blackton's AI out of every faction |
| `the_free_towns_charter` | The Free Towns' Charter | haclton / moot | Light government and the `zin_light_council` stance (elections every 48 months) |
| `our_walls_our_own` | Our Walls, Our Own | between_two_shores | Sway −10 (the mechanic's hold defence; Blackton's cap stays 40) |
| `the_corsair_question` | The Corsair Question | between_two_shores | Pay the Black-Sails (`zin_regional_blackton_paid_corsairs`: Goldoroth's AI weight for Corsair Raid on Blackton ×0.25 for 730 days) or arm the merchantmen |
| `with_the_accord` | With the Accord | our_walls_our_own | Event to Dondor; on acceptance Blackton joins the Dark Sea Accord |
| `hang_the_envoys` / `southern_silver` | — | strangers_in_the_harbour | Answer Volgan's envoys: pact −1 and Volgan's anger, or pact +1 and silver |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `town_moot` | The Town Moot | `stability_factor` 0.05, `political_power_factor` −0.05 | `the_town_moot_sits`; replaced by a charter |
| `lords_charter` | The Lord's Charter | `political_power_gain` 0.10, `stability_factor` 0.03 | `the_lords_charter` |
| `free_towns_charter` | The Free Towns' Charter | `stability_factor` 0.05, `trade_opinion_factor` 0.10 | `the_free_towns_charter` |
| `freehold_among_holds` | A Freehold Among the Holds | `drift_defence_factor` 0.15, `army_core_defence_factor` 0.05 | `a_freehold_among_holds` |
| `iron_market` | The Iron Market | `trade_opinion_factor` 0.10, `production_speed_arms_factory_factor` 0.05 | `the_iron_market` |
| `merchant_houses_spirit` | The Merchant Houses | `consumer_goods_factor` −0.03, `production_factory_efficiency_gain_factor` 0.05 | `merchant_houses` |
| `leren_quarter` | The Leren Quarter | `trade_opinion_factor` 0.05, `naval_detection` 0.05 | `the_leren_quarter` |
| `free_harbour` | The Free Harbour | `trade_opinion_factor` 0.10, `political_power_gain` 0.05 | `the_free_harbour` |
| `between_two_shores_spirit` | Between Two Shores | `drift_defence_factor` 0.10, `stability_factor` 0.03 | `neither_master_nor_tribute` |
| `quay_watch` | Watchers on the Quay | `enemy_operative_detection_chance_factor` 0.15, `civilian_intel_factor` 0.10 | `watchers_on_the_quay` |
| `five_towns_militia` | Militia of the Five Towns | `army_core_defence_factor` 0.10, `conscription_factor` 0.03 | `militia_of_the_five_towns` |
| `privateers` | Privateers of Blackton | `naval_damage_factor` 0.10, `navy_org_factor` 0.05 | timed, 365 days |
| `five_towns_stand` | The Five Towns Stand | `army_defence_factor` 0.10 | timed, 365 days |
| `shore_lanterns_spirit` | Shore Lanterns | `coastal_bunker_effectiveness_factor` 0.15, `naval_detection` 0.10 | `shore_lanterns`; removed on `zin_zol_withdrawn` |

### Events (namespace `zin_regional_blackton`)

| # | Key | Title | To | Trigger | Picture | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `the_town_moot` | The Town Moot | Blackton | The Five Towns | `generic_court` | "The lords speak first." (political_power 25; AI 60) / "The guilds speak first." (stability 0.03; AI 40) |
| 2 | `blackton_asks_for_ships` | Blackton Asks for Ships | Lerendor | Ask for Leren Ships | `generic_sea` | "Ships for Blackton." (guarantee Blackton; for_country Blackton: lean +10; event_for Blackton `an_answer_by_sea`; AI 30 + Blackton's lean ÷ 2) / "Under our banner." (if Blackton's lean ≥ 60 and Lerendor completed Across the Dark Straits: `zin_leren_offer_protection(target = Blackton)`; else guarantee Blackton; event_for Blackton `an_answer_by_sea`; AI 0 unless that condition holds, then 20, ×3 on the supremacy route) / "Not now." (Blackton lean −5; AI 40) |
| 3 | `corsair_sails` | Black Sails Off the Five Towns | Blackton | The Corsair Question | `generic_sea` | "Pay the Black-Sails." (political_power −50; flag `zin_regional_blackton_paid_corsairs` 730 days; opinion Goldoroth +10 `good_customers`; AI 40) / "Arm the merchantmen." (navy_experience 10; building coastal_bunker 1 @random_coastal; AI 60) |
| 4 | `blackton_seeks_the_accord` | Blackton Seeks the Accord | Dondor | With the Accord | `generic_court` | "Open the Accord to Blackton." (invite Blackton (`add_to_faction`); resolve +5; event_for Blackton `an_answer_by_sea`; AI 80) / "Notbuton keeps its own counsel." (AI 20) |
| 5 | `strangers_in_the_harbour` | Strangers in the Harbour | Blackton | Strangers in the Harbour | `southern_warning` | One option. Text: men from the south ask about ships, iron and the price of a harbour. They come "from Nafeher" and say little else |
| 6 | `an_answer_by_sea` | An Answer by Sea | Blackton | Accepting options of 2 and 4 | `generic_sea` | One option, "The harbour is safer." (stability 0.03). Text: an answer came by sea, and it was yes. Refusals send nothing |

### Historical AI route

| When | Focuses |
| --- | --- |
| 1748–1749 | the_five_towns, salt_iron_and_sails, sails_to_sonargur, the_town_moot_sits, haclton_of_the_harbour, the_lords_charter, the_salt_pans, the_iron_market |
| 1750–1752 | between_two_shores, our_walls_our_own, the_corsair_question, strangers_in_the_harbour, hang_the_envoys, the_leren_quarter, strait_pilots, town_companies, walls_of_the_five_towns |
| 1753–1755 | ask_for_leren_ships, the_free_harbour, charts_of_the_dark_sea, harbour_of_the_five_towns, merchant_houses, watchers_on_the_quay, crossbows_on_the_walls, the_harbour_chain, neither_master_nor_tribute (through with_the_accord only if tension ≥ 70) |
| 1755–1760 | war and shore branches on their gates; sea_companies, militia_of_the_five_towns, a_freehold_among_holds |

---

## Dulundur

### Situation in 4A 1748

Dulundur is the largest free hold of the Dark Lands: four valleys of orc clans under one hall, each valley with its own hearth, called together as the Four Fires (proposed) when Chief Dulgash speaks. It has iron in its hills and pride in its halls. Its chiefs remember that Goldoroth was made by warlords who swallowed holds like theirs, and they mean to stay unswallowed. Cocanoor sends gifts; Dulundur keeps them and owes nothing. The other holds watch it: if Dulundur bends, the inner Dark Lands are Goldoroth's.

### Role

- **Historical path (proposed):** Dulundur refuses the Iron Yoke, and calls the Free Moot once Goldoroth's unity reaches 30 or Goldoroth earns a cause against a hold. When the War of the Last Crowns opens (Rainwake 4A 1755) Goldoroth moves on the defiant holds; Dulundur fights with the Moot. How that war ends is left to play: no text states its outcome as history. Dulundur sends Volgan's envoys away.
- **Alternatives:** a Dulundur that strikes Goldoroth's tributaries; a Dulundur that takes the south's spoils (pact 2 needs Volgan's own focus); a Dulundur that bends to Cocanoor after a lost war.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Dulundur>_zin_ruler` | Chief Dulgash | Country leader, `zin_wild_tribes` | `zin_trait_warband_chief` |
| `zin_regional_dulundur_grushka` | Grushka of the Four Fires | Political advisor | `zin_adv_elder` |
| `zin_regional_dulundur_ozgar` | Ozgar Ironhand, Pit-Master | Political advisor | `zin_adv_treasurer` |
| `zin_regional_dulundur_brakka` | Brakka the Loud | Political advisor | `zin_adv_war_speaker` |
| `zin_regional_dulundur_ugmar` | Ugmar of the Hills | Corps commander, skill 3 | `hill_fighter` |

### Tree `regional_dulundur` (36 focuses)

**A. The Four Fires** (x 0–4, rows 0–3). Exclusive: *One Chief, One Hall* / *The Valleys Speak*.
- `the_four_fires` The Four Fires (2,0; 70) `war_drums`: political_power 50; event `the_four_fires`. AI 40.
- `chiefs_of_four_valleys` Chiefs of the Four Valleys (1,1; ← the_four_fires) `banner_plain`: stability 0.03; manpower 1000. AI 20.
- `dulgashs_law` Dulgash's Law (3,1; ← the_four_fires) `seal_royal`: add_spirit `dulgashs_law_spirit`. AI 20.
- `one_chief_one_hall` One Chief, One Hall (1,2; ← chiefs_of_four_valleys / dulgashs_law; excl the_valleys_speak) `crown_iron`: political_power 50; swap_spirit `dulgashs_law_spirit` → `one_hall`. AI 15; hist ×2.
- `the_valleys_speak` The Valleys Speak (3,2; ← chiefs_of_four_valleys / dulgashs_law; excl one_chief_one_hall) `council_table`: swap_spirit `dulgashs_law_spirit` → `valleys_speak`. AI 15.
- `pride_of_dulundur` The Pride of Dulundur (2,3; ← one_chief_one_hall / the_valleys_speak; 70) `orc_axe`: war_support 0.05; political_power 25. AI 20.

**B. Iron of the Hills** (x 5–8, rows 0–3).
- `iron_of_the_hills` Iron of the Hills (6,0; 70) `mine_cart`: building arms_factory 1 @capital. AI 30.
- `ore_roads` Ore Roads (5,1; ← iron_of_the_hills) `roads_paved`: building infrastructure 1 @random_owned (twice). AI 15.
- `the_deep_pits` The Deep Pits (7,1; ← iron_of_the_hills) `foundry_fire`: building industrial_complex 1 @random_owned; equipment zin_arms_equipment 300. AI 15.
- `iron_for_blackton` Iron for Blackton (5,2; ← ore_roads) `caravan`: Avail: exists Blackton. add_spirit `iron_trade`; opinion Blackton +15 (`iron_friends`) both ways. AI 10.
- `hall_forges` Hall Forges (7,2; ← the_deep_pits) `forge_anvil`: building arms_factory 1 @random_owned. AI 15.
- `the_hills_provide` The Hills Provide (6,3; ← iron_for_blackton + hall_forges; 70) `workshop_tools`: add_spirit `hills_provide`. AI 15.

**C. No Yoke for Dulundur** (x 9–12, rows 0–3). Defence against sway.
- `no_yoke` No Yoke for Dulundur (10,0) `chain_broken`: sway −10. AI 40; hist ×2.
- `send_back_the_gifts` Send Back the Gifts (9,1; ← no_yoke) `tribute_chest`: sway −5; flag `zin_dark_gifts_returned`; opinion Goldoroth −10 (`gifts_returned`). AI 20; hist ×2.
- `hill_forts` Hill Forts (11,1; ← no_yoke) `pass_fort`: building bunker 2 @capital. AI 20.
- `the_proud_hold` The Proud Hold (10,2; ← send_back_the_gifts + hill_forts; 70) `fort_wall`: add_spirit `proud_hold`; sway −10. AI 20.
- `hall_answers_no_one` The Hall Answers No One (10,3; ← the_proud_hold) `orc_axe`: Avail: flag `zin_dark_refused_yoke` or after 1752.1.1. war_support 0.10; building bunker 1 @capital. AI 30.

**D. The Free Moot** (x 13–16, rows 0–3).
- `speak_to_the_holds` Speak to the Holds (14,0) `envoy`: call `zin_regional_dulundur_kin_goodwill` (opinion `holds_kin` +10 with every free hold, both ways). AI 30.
- `the_moot_stone` The Moot Stone (13,1; ← speak_to_the_holds) `rune_stone`: Avail: not global_flag `zin_dark_free_moot`; check `zin_regional_dulundur_moot_allowed`. found the Moot. AI 0; 300 when available.
- `gifts_to_the_small_halls` Gifts to the Small Halls (15,1; ← speak_to_the_holds) `tribute_chest`: call `zin_regional_dulundur_steady_small_halls` (each free hold with sway ≥ 40: `zin_goldoroth_add_sway(target = it, value = −5)`); political_power −25. AI 15.
- `first_among_the_holds` First Among the Holds (14,2; ← the_moot_stone / gifts_to_the_small_halls) `banner_league`: Avail: flag `zin_dark_moot_member`. add_spirit `first_among_holds`. AI 30.
- `the_moot_rides` The Moot Rides (14,3; ← first_among_the_holds) `war_drums`: Avail: at_war, or check `zin_regional_dulundur_moot_threatened` (Goldoroth holds a live `zin_cb_hold_defiance` against a Moot member). war_support 0.05; army_experience 10. AI 100 when available.

**E. Strangers from the South** (x 17–19, rows 0–2). Exclusive: *Send Them South* / *The Price of Spoils*.
- `envoys_at_the_fires` Envoys at the Fires (18,0) `envoy`: Avail: variable `zin_volgan_pact` above 0 or after 1750.1.1. event `envoys_at_the_fires`. AI 30.
- `send_them_south` Send Them South (17,1; ← envoys_at_the_fires; excl the_price_of_spoils) `chain_broken`: pact −1; opinion Volgan −15 (`sent_south`); stability 0.03. AI 30; hist ×3.
- `the_price_of_spoils` The Price of Spoils (19,1; ← envoys_at_the_fires; excl send_them_south) `coin_chest`: pact +1; equipment zin_arms_equipment 300; flag `zin_dark_took_southern_gifts`. AI 10; hist ×0.
- `whispers_in_the_hills` Whispers in the Hills (18,2; ← send_them_south / the_price_of_spoils) `eye_watchful`: add_spirit `hill_watch`. AI 20.

**F. Warbands** (x 20–23, rows 0–2).
- `warbands_of_dulundur` Warbands of Dulundur (21,0; 70) `orc_axe`: army_experience 10; research [zin_cat_arms] 50% ×1. AI 30.
- `hill_runners` Hill Runners (20,1; ← warbands_of_dulundur) `bow_archers`: research [zin_cat_bows] 50% ×1. AI 15.
- `shields_of_the_valleys` Shields of the Four Valleys (22,1; ← warbands_of_dulundur) `sword_shield`: research [zin_cat_armour] 50% ×1. AI 15.
- `war_drums_of_dulundur` War-Drums of Dulundur (21,2; ← hill_runners + shields_of_the_valleys) `war_drums`: add_spirit `war_drums`. AI 15.

**G. The War for the Holds** (x 9–15, rows 6–9). Root available when at war with Goldoroth.
- `defy_cocanoor` Defy Cocanoor (12,6; no prerequisite) `orc_axe`: Avail: at_war_with Goldoroth. war_support 0.10; timed_spirit `defiance` 180. AI 0; 300 when available.
- `every_hall_a_fortress` Every Hall a Fortress (11,7; ← defy_cocanoor; 21) `fort_wall`: building bunker 2 @capital; manpower 2000. AI 100.
- `the_moot_answers` The Moot Answers (13,7; ← defy_cocanoor; 21) `banner_league`: Avail: flag `zin_dark_moot_member`. call `zin_regional_dulundur_rally_moot` (every Moot member not in the war gets `zin_dark.71` "The Moot Rides"). AI 100.
- `strike_the_tributaries` Strike the Tributaries (11,8; ← every_hall_a_fortress) `knight_lance`: Avail: at_war_with Goldoroth. call `zin_regional_dulundur_wargoal_tributaries` (`create_wargoal` `take_state` on one state of each Goldoroth tributary that borders Dulundur). AI 15; hist ×0.
- `peace_of_the_hills` Peace of the Hills (13,8; ← the_moot_answers) `olive_branch`: Avail: at_war_with Goldoroth; check `zin_regional_dulundur_cores_held`. event_for Goldoroth `peace_of_the_hills`. AI 50.
- `the_hold_endures` The Hold Endures (12,9; ← strike_the_tributaries / peace_of_the_hills) `banner_plain`: Avail: not at_war; after 1756.1.1. stability 0.10; remove_spirit `defiance`. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `no_yoke` | No Yoke for Dulundur | — | Sway −10 |
| `send_back_the_gifts` | Send Back the Gifts | no_yoke | Sway −5; `zin_dark_gifts_returned` (Goldoroth's Send Gifts of Black Iron gives +5 sway to Dulundur, not +10) |
| `the_moot_stone` | The Moot Stone | speak_to_the_holds; the Moot is allowed | Calls the Free Moot at no cost (`zin_dark_found_free_moot`); Dulundur is its founder |
| `gifts_to_the_small_halls` | Gifts to the Small Halls | speak_to_the_holds | Every free hold at sway 40 or more loses 5 sway |
| `send_them_south` | Send Them South | envoys_at_the_fires | Pact −1; Volgan's opinion −15 |
| `the_moot_answers` | The Moot Answers | defy_cocanoor; Moot member | Sends `zin_dark.71` to every Moot member not yet in the war |
| `strike_the_tributaries` | Strike the Tributaries | every_hall_a_fortress; at war with Goldoroth | War goals on Goldoroth's tributaries next to Dulundur; never on the historical path |
| `peace_of_the_hills` | Peace of the Hills | the_moot_answers; cores held | Event to Goldoroth offering white peace |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `dulgashs_law_spirit` | Dulgash's Law | `stability_factor` 0.05, `political_power_gain` 0.05 | `dulgashs_law`; replaced by the next two |
| `one_hall` | One Chief, One Hall | `political_power_gain` 0.10, `stability_factor` 0.05, `war_support_factor` 0.05 | `one_chief_one_hall` |
| `valleys_speak` | The Valleys Speak | `stability_factor` 0.08, `recruitable_population_factor` 0.05 | `the_valleys_speak` |
| `iron_trade` | Iron for Blackton | `trade_opinion_factor` 0.10 | `iron_for_blackton` |
| `hills_provide` | The Hills Provide | `production_speed_buildings_factor` 0.05, `production_speed_arms_factory_factor` 0.05 | `the_hills_provide` |
| `proud_hold` | The Proud Hold | `drift_defence_factor` 0.20, `army_core_defence_factor` 0.10 | `the_proud_hold` |
| `first_among_holds` | First Among the Holds | `army_core_defence_factor` 0.05, `opinion_gain_monthly_factor` 0.10 | `first_among_the_holds`; removed if Dulundur leaves the Moot |
| `hill_watch` | Whispers in the Hills | `enemy_operative_detection_chance_factor` 0.10, `army_intel_factor` 0.05 | `whispers_in_the_hills` |
| `war_drums` | War-Drums of Dulundur | `army_morale_factor` 0.05, `army_attack_factor` 0.05 | `war_drums_of_dulundur` |
| `defiance` | Defiance | `army_defence_factor` 0.10, `army_morale_factor` 0.05 | timed, 180 days; removed by `the_hold_endures` |

### Events (namespace `zin_regional_dulundur`)

| # | Key | Title | To | Trigger | Picture | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `the_four_fires` | The Four Fires Are Lit | Dulundur | The Four Fires | `generic_wilds` | "Let every valley speak." (stability 0.03) / "Let the Chief speak for all." (political_power 25) |
| 2 | `envoys_at_the_fires` | Envoys at the Fires | Dulundur | Envoys at the Fires | `southern_warning` | One option. Text: strangers from Nafeher speak of spoils in the north and old friendships. The chiefs laugh, or do not |
| 3 | `peace_of_the_hills` | Peace of the Hills | Goldoroth | Peace of the Hills | `generic_war` | "The hills are not worth it." (call `zin_regional_dulundur_white_peace` (`white_peace` with Dulundur); temper +5; event_for Dulundur `the_hills_answer`; AI 20 + 30 if Goldoroth's surrender progress ≥ 0.2, ×0 if Dulundur's war score is lower) / "Dulundur will kneel." (AI the rest) |
| 4 | `the_hills_answer` | The Hills Answer | Dulundur | Peace option of 3 | `generic_wilds` | One option, "The hills are ours." (stability 0.05). Text: Cocanoor has gone home |

### Historical AI route

| When | Focuses |
| --- | --- |
| 1748–1749 | the_four_fires, no_yoke, iron_of_the_hills, dulgashs_law, chiefs_of_four_valleys, send_back_the_gifts, speak_to_the_holds |
| 1750–1752 | one_chief_one_hall, envoys_at_the_fires, send_them_south, hill_forts, the_proud_hold, warbands_of_dulundur, ore_roads, the_deep_pits |
| 1752–1754 | hall_answers_no_one, the_moot_stone (when allowed), gifts_to_the_small_halls, first_among_the_holds, whispers_in_the_hills, pride_of_dulundur, hall_forges |
| 1755 onward | the_moot_rides, war branch on its gate (never `strike_the_tributaries`), then the rest of the economy and army |

---

## Bordon

### Situation in 4A 1748

Bordon is a single hold astride the Black Road (proposed name), the old track that runs from Cocanoor's forge-pits toward the coast and the human towns. Its chief, Bordag, takes a toll from every wagon of iron and every salt caravan, and keeps an inn-hall that is also a fortress. The road makes Bordon rich for a hold and impossible to defend: Goldoroth's trade passes through it, and Goldoroth's armies could too. Its elders remember that the road was fought over in an older age (the vault's proposed War of the Black Roads); they remember who won, and they are not sure it was them.

### Role

- **Historical path (proposed):** Bordon leans to Cocanoor's markets and, when the Iron Yoke is offered (4A 1752–1753), bends the knee and becomes a tributary hold under a light yoke. It turns back Volgan's envoys unless its overlord takes the Southern Bargain. It keeps the road in the War of the Last Crowns.
- **Alternatives:** a Bordon that stays its own hold, or asks Notbuton for the Accord; a tributary that slips the yoke while Cocanoor is busy.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Bordon>_zin_ruler` | Chief Bordag | Country leader, `zin_wild_tribes` | `zin_trait_warband_chief` |
| `zin_regional_bordon_krugg` | Tollmaster Krugg | Political advisor | `zin_adv_treasurer` |
| `zin_regional_bordon_nadra` | Nadra Roadwife | Political advisor | `zin_adv_road_warden` |
| `zin_regional_bordon_grimsh` | Grimsh the Envoy | Political advisor | `zin_adv_envoy` |

### Tree `regional_bordon` (31 focuses)

**A. The Road-Hold** (x 0–2, rows 0–3).
- `the_road_hold` The Road-Hold (1,0; 70) `traders_road`: political_power 50; event `the_road_hold`. AI 40.
- `bordags_tollmen` Bordag's Tollmen (0,1; ← the_road_hold) `toll_house`: add_spirit `tollmen`. AI 20.
- `the_old_road` The Old Road (2,1; ← the_road_hold) `roads_paved`: building infrastructure 1 @capital. AI 20.
- `road_hold_council` The Road-Hold Council (1,2; ← bordags_tollmen + the_old_road) `council_table`: stability 0.05. AI 15.
- `bordags_feast` Bordag's Feast (1,3; ← road_hold_council) `feast_table`: stability 0.03; political_power 25. AI 15.

**B. Tolls of the Black Road** (x 4–6, rows 0–3).
- `tolls_of_the_black_road` Tolls of the Black Road (5,0) `ledger_coins`: political_power 25. AI 30.
- `caravan_inns` Caravan Inns (4,1; ← tolls_of_the_black_road) `market_stalls`: building industrial_complex 1 @capital. AI 15.
- `road_forges` Road Forges (6,1; ← tolls_of_the_black_road) `forge_anvil`: building arms_factory 1 @capital. AI 15.
- `the_road_pays` The Road Pays (5,2; ← caravan_inns + road_forges; 70) `coin_chest`: add_spirit `road_pays`. AI 15.
- `milestones` Milestones of Iron (5,3; ← the_road_pays) `roads_paved`: building infrastructure 1 @capital. AI 10.

**C. The Bordon Question** (x 7–12, rows 0–2). Three-way exclusive at row 1.
- `the_bordon_question` The Bordon Question (9,0) `envoy`: political_power 25; event `cocanoor_asks`. AI 30.
- `markets_of_cocanoor` The Markets of Cocanoor (7,1; ← the_bordon_question; excl a_hold_of_our_own, ask_notbuton) `market_stalls`: sway +10; opinion Goldoroth +15 (`road_friends`); equipment zin_arms_equipment 300. AI 20; hist ×3.
- `a_hold_of_our_own` A Hold of Our Own (9,1; ← the_bordon_question; excl markets_of_cocanoor, ask_notbuton) `banner_plain`: sway −15; add_spirit `own_hold`. AI 15; hist ×0.3.
- `ask_notbuton` Ask Notbuton (11,1; ← the_bordon_question; excl markets_of_cocanoor, a_hold_of_our_own) `handshake_oath`: Avail: exists Dondor; check `zin_regional_bordon_unbound`. event_for Dondor `bordon_asks`. AI 10; hist ×0.3.
- `the_road_to_cocanoor` The Road to Cocanoor (7,2; ← markets_of_cocanoor) `caravan`: sway +10; political_power 25. AI 20.
- `walls_on_the_road` Walls on the Road (9,2; ← a_hold_of_our_own) `fort_wall`: building bunker 2 @capital; sway −5. AI 20.
- `brutes_on_the_road` Brutes on the Road (11,2; ← ask_notbuton) `sword_shield`: Avail: check `zin_dark_is_accord_member`. resolve +5; add_spirit `accord_road`. AI 20.

**D. Under the Iron Yoke** (x 13–16, rows 0–3). Root has no prerequisite; `allow_branch` and `available`: check `zin_dark_is_tributary`. Exclusive: *Wear the Light Yoke* / *Slip the Yoke*.
- `the_iron_tithe_paid` The Iron Tithe Paid (14,0) `tribute_chest`: stability 0.05; political_power 25. AI 100 when available.
- `road_wardens_for_cocanoor` Road-Wardens for Cocanoor (13,1; ← the_iron_tithe_paid) `spear_levy`: army_experience 10; opinion Goldoroth +10 (`road_friends`). AI 30.
- `a_voice_at_cocanoor` A Voice at Cocanoor (15,1; ← the_iron_tithe_paid) `council_table`: add_spirit `voice_at_cocanoor`. AI 30.
- `wear_the_light_yoke` Wear the Light Yoke (13,2; ← road_wardens_for_cocanoor / a_voice_at_cocanoor; excl slip_the_yoke) `charter_golden`: sway +10; political_power 50. AI 20; hist ×2.
- `slip_the_yoke` Slip the Yoke (15,2; ← road_wardens_for_cocanoor / a_voice_at_cocanoor; excl wear_the_light_yoke) `chain_broken`: Avail: Goldoroth at_war with a country other than Bordon, or global_flag `zin_volgan_body_destroyed`. call `zin_regional_bordon_gain_autonomy` (`add_autonomy_ratio` 0.20); sway −15. AI 10; hist ×0.
- `the_road_serves` The Road Serves (14,3; ← wear_the_light_yoke / slip_the_yoke) `roads_paved`: building infrastructure 1 @capital; political_power 50. AI 20.

**E. Strangers from the South** (x 17–19, rows 0–1). Exclusive: *Turn Them Back* / *Let Them Pass*.
- `envoys_on_the_road` Envoys on the Road (18,0) `envoy`: Avail: variable `zin_volgan_pact` above 0 or after 1750.1.1. event `envoys_on_the_road`. AI 30.
- `turn_them_back` Turn Them Back (17,1; ← envoys_on_the_road; excl let_them_pass) `chain_broken`: pact −1; opinion Volgan −15 (`turned_back`). AI 30; hist ×2; ×0.2 if tributary and south.
- `let_them_pass` Let Them Pass (19,1; ← envoys_on_the_road; excl turn_them_back) `traders_road`: pact +1; political_power 50; flag `zin_dark_took_southern_gifts`. AI 10; ×5 if tributary and south; hist ×0 unless south.

**F. The Moot and the Warband** (x 20–22, rows 0–2).
- `word_from_the_moot` Word from the Moot (20,0; no prerequisite) `rune_stone`: Avail: global_flag `zin_dark_free_moot`; not check `zin_dark_is_tributary`; not flag `zin_dark_moot_member`. join the Moot. AI 0; 20 when available; hist ×0.5.
- `warband_of_the_road` Warband of the Road (22,0; no prerequisite) `orc_axe`: army_experience 10; research [zin_cat_arms] 50% ×1. AI 20.
- `road_ambushes` Road Ambushes (22,1; ← warband_of_the_road) `goblin_raiders`: add_spirit `road_ambush`. AI 15.
- `bordon_at_war` Bordon at War (22,2; ← road_ambushes) `war_drums`: Avail: at_war. war_support 0.10; manpower 1000. AI 100 when available.

**G. After the Storm** (x 14, row 6).
- `the_road_after_the_war` The Road After the War (14,6; no prerequisite) `traders_road`: Avail: after 1757.1.1; not at_war. stability 0.05; political_power 50. AI 50 when available.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `markets_of_cocanoor` | The Markets of Cocanoor | the_bordon_question | Sway +10, Goldoroth's opinion +15, 300 arms; the historical road toward the yoke |
| `a_hold_of_our_own` | A Hold of Our Own | the_bordon_question | Sway −15 and a defensive spirit: the hold's defence against sway |
| `ask_notbuton` | Ask Notbuton | the_bordon_question | Event to Dondor; on acceptance Bordon joins the Dark Sea Accord |
| `the_iron_tithe_paid` | The Iron Tithe Paid | — (tributary only) | Opens the tributary branch when Bordon is under the Iron Yoke |
| `slip_the_yoke` | Slip the Yoke | road_wardens / voice | +20% autonomy toward leaving the yoke while Cocanoor is at war elsewhere or after Volgan's body breaks |
| `turn_them_back` / `let_them_pass` | — | envoys_on_the_road | Answers Volgan's envoys either way |
| `word_from_the_moot` | Word from the Moot | — | Joins an existing Free Moot (only while not a tributary) |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `tollmen` | Bordag's Tollmen | `political_power_gain` 0.10 | `bordags_tollmen` |
| `road_pays` | The Road Pays | `trade_opinion_factor` 0.10, `consumer_goods_factor` −0.03 | `the_road_pays` |
| `own_hold` | A Hold of Our Own | `drift_defence_factor` 0.15, `army_core_defence_factor` 0.05 | `a_hold_of_our_own` |
| `accord_road` | Brutes on the Road | `army_defence_factor` 0.05 | `brutes_on_the_road`; removed if Bordon leaves the Accord |
| `voice_at_cocanoor` | A Voice at Cocanoor | `political_power_gain` 0.05, `stability_factor` 0.03 | `a_voice_at_cocanoor`; removed if Bordon leaves the yoke |
| `road_ambush` | Road Ambushes | `army_core_defence_factor` 0.10 | `road_ambushes` |

### Events (namespace `zin_regional_bordon`)

| # | Key | Title | To | Trigger | Picture | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `the_road_hold` | Wagons on the Black Road | Bordon | The Road-Hold | `generic_peace` | "Raise the toll." (political_power 25) / "Keep the wagons coming." (stability 0.03) |
| 2 | `cocanoor_asks` | Cocanoor Asks | Bordon | The Bordon Question | `generic_court` | One option. Text: Cocanoor's tallymen count Bordon's wagons and ask, politely, who the road belongs to |
| 3 | `bordon_asks` | Bordon Asks for the Accord | Dondor | Ask Notbuton | `generic_court` | "Bordon stands with us." (invite Bordon (`add_to_faction`); resolve +5; AI 25, ×2 if tension ≥ 50) / "Bordon is too close to Cocanoor." (AI the rest) |
| 4 | `envoys_on_the_road` | Envoys on the Road | Bordon | Envoys on the Road | `southern_warning` | One option. Text: southern riders pay the toll in a coin nobody on the road has seen |

### Historical AI route

1748–1750: the_road_hold, tolls_of_the_black_road, bordags_tollmen, the_old_road, caravan_inns, road_forges, the_bordon_question, markets_of_cocanoor, the_road_to_cocanoor. 1750–1752: envoys_on_the_road, turn_them_back, the_road_pays, road_hold_council, warband_of_the_road. After the yoke: the_iron_tithe_paid, a_voice_at_cocanoor, road_wardens_for_cocanoor, wear_the_light_yoke, the_road_serves. Then the rest.

---

## Dreson

### Situation in 4A 1748

Dreson is a hold of the fens: reed islands, eel-weirs and peat fires, joined by paths only Dreson's own folk can walk (proposed). Chief Dresk rules from a hall raised on black piles over the water. The fens make Dreson poor and almost impossible to take; armies that try sink, sicken or lose their way. Cocanoor's gifts come by boat, and the reed-council debates them for weeks. Dreson trades eels, reeds and bog-iron, and smuggles whatever pays.

### Role

- **Historical path (proposed):** Dreson refuses the Iron Yoke and answers the Free Moot. In 4A 1755 Goldoroth turns on the defiant holds; the fens fight. Dreson sends Volgan's envoys away. The outcome is left to play.
- **Alternatives:** Dreson may bend the knee (its AI only does if its sway passes 60), take the south's coin, or turn smuggler-power on the Sea of Darkness if it holds a coast.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Dreson>_zin_ruler` | Chief Dresk | Country leader, `zin_wild_tribes` | `zin_trait_warband_chief` |
| `zin_regional_dreson_moss_eye` | Old Moss-Eye, Reed-Speaker | Political advisor | `zin_adv_elder` |
| `zin_regional_dreson_ylsa` | Ylsa Eel-Wife | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_dreson_harrok` | Harrok Fen-Walker | Political advisor | `zin_adv_muster_master` |
| `zin_regional_dreson_varga` | Varga Bog-Runner | Corps commander, skill 2 | `trickster` |

### Tree `regional_dreson` (31 focuses)

**A. The Fen-Hold** (x 0–2, rows 0–3).
- `the_fen_hold` The Fen-Hold (1,0; 70) `river_ford`: political_power 50; event `the_fen_hold`. AI 40.
- `dresks_reed_council` Dresk's Reed-Council (0,1; ← the_fen_hold) `council_table`: stability 0.03; political_power 25. AI 20.
- `the_eel_feasts` The Eel Feasts (2,1; ← the_fen_hold) `feast_table`: stability 0.03. AI 15.
- `fen_law` Fen Law (1,2; ← dresks_reed_council + the_eel_feasts) `scroll_sealed`: add_spirit `fen_law_spirit`. AI 15.
- `the_reed_crown` The Reed Crown (1,3; ← fen_law) `crown_broken`: political_power 50; stability 0.03. AI 15.

**B. Wealth of the Fens** (x 4–6, rows 0–3).
- `reed_and_eel` Reed and Eel (5,0; 70) `fishing_boats`: add_spirit `reed_and_eel_spirit`. AI 30.
- `peat_fires` Peat Fires (4,1; ← reed_and_eel) `foundry_fire`: building industrial_complex 1 @capital. AI 15.
- `fen_roads` Causeways (6,1; ← reed_and_eel) `roads_paved`: building infrastructure 1 @capital. AI 15.
- `bog_iron` Bog-Iron (5,2; ← peat_fires + fen_roads) `mine_cart`: building arms_factory 1 @capital; equipment zin_arms_equipment 300. AI 15.
- `eel_markets` Eel Markets (5,3; ← bog_iron) `market_stalls`: add_spirit `eel_markets_spirit`. AI 10.

**C. The Fens Swallow Armies** (x 8–10, rows 0–3). Defence against sway and war.
- `fens_swallow_armies` The Fens Swallow Armies (9,0) `river_ford`: add_spirit `fens_swallow_armies_spirit`; sway −5. AI 40.
- `hidden_paths` Hidden Paths (8,1; ← fens_swallow_armies) `footprints_snow`: building bunker 1 @capital. AI 15.
- `no_chains_in_the_fens` No Chains in the Fens (10,1; ← fens_swallow_armies) `chain_broken`: sway −10; opinion Goldoroth −5 (`no_chains`). AI 20; hist ×2.
- `the_drowned_road` The Drowned Road (9,2; ← hidden_paths + no_chains_in_the_fens; 70) `storm_sea`: swap_spirit `fens_swallow_armies_spirit` → `drowned_road`. AI 15.
- `dresons_answer` Dreson's Answer (9,3; ← the_drowned_road) `orc_axe`: Avail: flag `zin_dark_refused_yoke` or after 1752.1.1. war_support 0.10. AI 30.

**D. Reed Boats** (x 12–14, rows 0–2). `allow_branch`: check `zin_regional_dreson_is_coastal` (owns a coastal state).
- `reed_boats` Reed Boats (13,0) `galley_oars`: building dockyard 1 @random_coastal; navy_experience 10. AI 20.
- `fen_fishers_watch` The Fen-Fishers' Watch (12,1; ← reed_boats) `eye_watchful`: add_spirit `fen_fishers`. AI 15.
- `smugglers_of_the_fens` Smugglers of the Fens (14,1; ← reed_boats) `corsair_raider`: political_power 50; add_spirit `smugglers`. AI 15.
- `coast_beacons_of_dreson` Coast Beacons (13,2; ← fen_fishers_watch + smugglers_of_the_fens) `beacon`: building coastal_bunker 1 @random_coastal. AI 10.

**E. The Free Moot** (x 16–18, rows 0–2).
- `kin_of_the_moot` Kin of the Moot (17,0) `envoy`: call `zin_regional_dreson_kin_goodwill` (opinion `fen_kin` +10 with every free hold). AI 20.
- `answer_the_moot` Answer the Moot (16,1; ← kin_of_the_moot) `rune_stone`: Avail: global_flag `zin_dark_free_moot`; not flag `zin_dark_moot_member`; not check `zin_dark_is_tributary`. join the Moot. AI 0; 200 when available.
- `moot_scouts` Moot Scouts (18,1; ← kin_of_the_moot) `scout_lantern`: army_experience 5; add_spirit `fen_scouts`. AI 15.
- `the_fens_ride_with_the_moot` The Fens Ride with the Moot (17,2; ← answer_the_moot / moot_scouts) `war_drums`: Avail: flag `zin_dark_moot_member`. war_support 0.05; army_experience 10. AI 30.

**F. Strangers from the South** (x 20–22, rows 0–2). Exclusive: *Drown Their Gifts* / *Southern Coin*.
- `envoys_in_the_reeds` Envoys in the Reeds (21,0) `envoy`: Avail: variable `zin_volgan_pact` above 0 or after 1750.1.1. event `envoys_in_the_reeds`. AI 30.
- `drown_their_gifts` Drown Their Gifts (20,1; ← envoys_in_the_reeds; excl southern_coin) `storm_sea`: pact −1; opinion Volgan −15 (`gifts_drowned`). AI 30; hist ×3.
- `southern_coin` Southern Coin (22,1; ← envoys_in_the_reeds; excl drown_their_gifts) `coin_chest`: pact +1; political_power 50; flag `zin_dark_took_southern_gifts`. AI 10; hist ×0.
- `eyes_in_the_reeds` Eyes in the Reeds (21,2; ← drown_their_gifts / southern_coin) `eye_watchful`: add_spirit `reed_eyes`. AI 15.

**G. The Fens at War** (x 8–10, rows 6–8).
- `the_fens_rise` The Fens Rise (9,6; no prerequisite) `river_ford`: Avail: at_war. war_support 0.10; timed_spirit `fens_rise` 180. AI 0; 300 when available.
- `ambush_in_the_reeds` Ambush in the Reeds (8,7; ← the_fens_rise) `goblin_raiders`: army_experience 15. AI 100.
- `call_the_moot_to_the_fens` Call the Moot to the Fens (10,7; ← the_fens_rise) `banner_league`: Avail: flag `zin_dark_moot_member`. call `zin_regional_dreson_rally_moot` (as Dulundur's). AI 100.
- `peace_in_the_fens` Peace in the Fens (9,8; ← ambush_in_the_reeds / call_the_moot_to_the_fens) `olive_branch`: Avail: not at_war. stability 0.10. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `fens_swallow_armies` | The Fens Swallow Armies | — | Sway −5; spirit *The Fens Swallow Armies* (core defence, less attrition) |
| `no_chains_in_the_fens` | No Chains in the Fens | fens_swallow_armies | Sway −10; Goldoroth's opinion −5 |
| `the_drowned_road` | The Drowned Road | hidden_paths + no_chains | Doubles the fen defence spirit |
| `answer_the_moot` | Answer the Moot | kin_of_the_moot; Moot exists | Joins the Free Moot |
| `drown_their_gifts` / `southern_coin` | — | envoys_in_the_reeds | Answers Volgan's envoys either way |
| `call_the_moot_to_the_fens` | Call the Moot to the Fens | the_fens_rise | Sends `zin_dark.71` to every Moot member not in the war |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `fen_law_spirit` | Fen Law | `stability_factor` 0.05, `political_power_gain` 0.05 | `fen_law` |
| `reed_and_eel_spirit` | Reed and Eel | `monthly_population` 0.05, `consumer_goods_factor` −0.02 | `reed_and_eel` |
| `eel_markets_spirit` | Eel Markets | `trade_opinion_factor` 0.10 | `eel_markets` |
| `fens_swallow_armies_spirit` | The Fens Swallow Armies | `army_core_defence_factor` 0.10, `attrition` −0.05 | `fens_swallow_armies`; replaced by `drowned_road` |
| `drowned_road` | The Drowned Road | `army_core_defence_factor` 0.20, `attrition` −0.05, `max_dig_in` 2 | `the_drowned_road` |
| `fen_fishers` | The Fen-Fishers' Watch | `naval_detection` 0.10 | `fen_fishers_watch` |
| `smugglers` | Smugglers of the Fens | `trade_opinion_factor` 0.05, `political_power_gain` 0.05 | `smugglers_of_the_fens` |
| `fen_scouts` | Moot Scouts | `recon_factor` 0.10 | `moot_scouts` |
| `reed_eyes` | Eyes in the Reeds | `enemy_operative_detection_chance_factor` 0.10 | `eyes_in_the_reeds` |
| `fens_rise` | The Fens Rise | `army_defence_factor` 0.10, `attrition` −0.05 | timed, 180 days |

### Events (namespace `zin_regional_dreson`)

| # | Key | Title | To | Trigger | Picture | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `the_fen_hold` | The Hall on the Water | Dreson | The Fen-Hold | `generic_wilds` | "The reed-council debates." (stability 0.03) / "Dresk decides." (political_power 25) |
| 2 | `envoys_in_the_reeds` | Envoys in the Reeds | Dreson | Envoys in the Reeds | `southern_warning` | One option. Text: a boat from the south, strangers who do not like the water, and gifts wrapped against the damp |

### Historical AI route

1748–1750: the_fen_hold, fens_swallow_armies, reed_and_eel, dresks_reed_council, no_chains_in_the_fens, the_eel_feasts, peat_fires, fen_roads. 1750–1752: envoys_in_the_reeds, drown_their_gifts, hidden_paths, the_drowned_road, fen_law, kin_of_the_moot. 1752–1754: dresons_answer, answer_the_moot (when the Moot exists), bog_iron, moot_scouts, eyes_in_the_reeds, the boat branch if coastal. 1755 onward: war branch on its gate; the rest.

---

## The Troll Forest

### Situation in 4A 1748

The Troll Forest is the one realm of trolls in the Dark Lands: an old, dark wood whose paths seem to move, ruled by Troy the Old, who is older than any chief of the holds can count and speaks rarely (proposed). Nobody enters the forest uninvited; few are invited. The trolls trade little and want less, but they like silver, and in hard years their young brutes have been known to fight for anyone who pays. Cocanoor courts them; so, now and then, does Notbuton.

### Role

- **Historical path (proposed):** the Troll Forest sells troll-kin "for any coin" (`zin_dark_trolls_for_pay`), stays out of every faction, keeps its wood, and sends the southern envoys back lighter. It joins the Free Moot only if attacked.
- **Alternatives:** troll-kin bound to the Accord or to Cocanoor; young trolls who want war; a forest that answers the south.

### Ruler and court (proposed)

| Id | Name | Role | Traits |
| --- | --- | --- | --- |
| `<Troll Forest>_zin_ruler` | Troy the Old | Country leader, `zin_wild_tribes` | `zin_trait_warband_chief` |
| `zin_regional_troll_forest_grumbold` | Grumbold Mossback | Political advisor | `zin_adv_elder` |
| `zin_regional_troll_forest_skarr` | Skarr the Young | Political advisor | `zin_adv_war_speaker` |
| `zin_regional_troll_forest_brunn` | Brunn Silver-Counter | Political advisor | `zin_adv_treasurer` |

The mechanic's start spirit `zin_dark_forest_nobody_enters` and state modifier `zin_dark_troll_woods` stay; this tree adds to them.

### Tree `regional_troll_forest` (30 focuses)

**A. The Old One's Forest** (x 0–4, rows 0–4). Exclusive: *The Old Ways* / *The Young Ways*.
- `the_old_ones_forest` The Old One's Forest (2,0; 70) `forest_ancient`: political_power 50; event `troy_speaks`. AI 40.
- `troy_speaks` Troy Speaks (1,1; ← the_old_ones_forest) `book_lore`: stability 0.05. AI 20.
- `the_younger_trolls` The Younger Trolls (3,1; ← the_old_ones_forest) `troll_club`: manpower 1000; war_support 0.03. AI 20.
- `the_forest_law` The Forest Law (2,2; ← troy_speaks + the_younger_trolls) `scroll_sealed`: add_spirit `forest_law`. AI 15.
- `the_old_ways` The Old Ways (1,3; ← the_forest_law; excl the_young_ways) `forest_ancient`: add_spirit `old_ways`. AI 20; hist ×3.
- `the_young_ways` The Young Ways (3,3; ← the_forest_law; excl the_old_ways) `troll_club`: add_spirit `young_ways`. AI 10; free ×2.
- `the_forest_moot` The Forest Moot (2,4; ← the_old_ways / the_young_ways; 70) `council_table`: political_power 50; stability 0.05. AI 15.

**B. Troll Silver** (x 5–9, rows 0–3). Three-way exclusive at row 1.
- `troll_silver` Troll Silver (7,0) `coin_chest`: flag `zin_dark_trolls_for_pay`; political_power 25. AI 40.
- `kin_for_the_accord` Troll-Kin for the Accord (5,1; ← troll_silver; excl kin_for_cocanoor, kin_for_any_coin) `handshake_oath`: Avail: exists Dondor. event_for Dondor `troll_kin_offered`. AI 10.
- `kin_for_cocanoor` Troll-Kin for Cocanoor (7,1; ← troll_silver; excl kin_for_the_accord, kin_for_any_coin) `tribute_chest`: Avail: exists Goldoroth. event_for Goldoroth `troll_kin_offered`; sway +5. AI 10.
- `kin_for_any_coin` Troll-Kin for Any Coin (9,1; ← troll_silver; excl kin_for_the_accord, kin_for_cocanoor) `ledger_coins`: political_power 50; flag `zin_regional_troll_forest_any_coin`. AI 20; hist ×3.
- `troll_bands` Troll Bands (7,2; ← kin_for_the_accord / kin_for_cocanoor / kin_for_any_coin) `troll_club`: add_spirit `troll_bands_spirit`. AI 15.
- `the_silver_hoard` The Silver Hoard (7,3; ← troll_bands) `coin_chest`: political_power 50; equipment zin_troll_gear_equipment 200. AI 10.

**C. The Forest Nobody Enters** (x 11–13, rows 0–3). Defence against sway.
- `paths_that_wander` Paths That Wander (12,0) `forest_ancient`: building bunker 1 @capital; sway −10. AI 40.
- `stone_hides` Stone Hides (11,1; ← paths_that_wander) `troll_club`: research [zin_cat_armour] 50% ×1. AI 15.
- `old_trees_watch` The Old Trees Watch (13,1; ← paths_that_wander) `eye_watchful`: add_spirit `old_trees_watch_spirit`. AI 15.
- `nobody_enters` Nobody Enters (12,2; ← stone_hides + old_trees_watch; 70) `forest_ancient`: sway −10; add_spirit `deep_forest`. AI 20.
- `the_forest_answers_none` The Forest Answers None (12,3; ← nobody_enters) `troll_club`: Avail: flag `zin_dark_refused_yoke` or after 1752.1.1. war_support 0.10. AI 30.

**D. Strangers Under the Eaves** (x 15–17, rows 0–2). Exclusive: *Send Them Back Lighter* / *Stone for the South*.
- `strangers_under_the_eaves` Strangers Under the Eaves (16,0) `envoy`: Avail: variable `zin_volgan_pact` above 0 or after 1750.1.1. event `strangers_under_the_eaves`. AI 30.
- `send_them_back_lighter` Send Them Back Lighter (15,1; ← strangers_under_the_eaves; excl stone_for_the_south) `chain_broken`: pact −1; political_power 25 (their gifts stay); opinion Volgan −10 (`lighter_envoys`). AI 30; hist ×3.
- `stone_for_the_south` Stone for the South (17,1; ← strangers_under_the_eaves; excl send_them_back_lighter) `troll_club`: pact +1; equipment zin_troll_gear_equipment 200; flag `zin_dark_took_southern_gifts`. AI 10; hist ×0.
- `long_memories` Long Memories (16,2; ← send_them_back_lighter / stone_for_the_south) `book_lore`: stability 0.05; add_spirit `long_memories_spirit`. AI 15.

**E. Troll Brutes** (x 19–22, rows 0–2).
- `troll_brutes` Troll Brutes (20,0; 70) `troll_club`: equipment zin_troll_gear_equipment 200; army_experience 10. AI 30.
- `stone_clubs` Stone Clubs (19,1; ← troll_brutes) `troll_club`: research [zin_cat_arms] 50% ×1. AI 15.
- `hide_plates` Hide Plates (21,1; ← troll_brutes) `troll_club`: research [zin_cat_armour] 50% ×1. AI 15.
- `the_trolls_march` The Trolls March (20,2; ← stone_clubs + hide_plates) `war_drums`: add_spirit `trolls_march`. AI 15.

**F. The Forest at War** (x 11–13, rows 6–8).
- `the_forest_wakes` The Forest Wakes (12,6; no prerequisite) `forest_ancient`: Avail: at_war. war_support 0.10; timed_spirit `forest_wakes` 180. AI 0; 300 when available.
- `the_moot_and_the_forest` The Moot and the Forest (11,7; ← the_forest_wakes) `rune_stone`: Avail: global_flag `zin_dark_free_moot`; not flag `zin_dark_moot_member`. join the Moot. AI 100.
- `trolls_in_the_line` Trolls in the Line (13,7; ← the_forest_wakes) `troll_club`: army_experience 15; manpower 500. AI 100.
- `the_forest_endures` The Forest Endures (12,8; ← the_moot_and_the_forest / trolls_in_the_line) `forest_ancient`: Avail: not at_war. stability 0.10; remove_spirit `forest_wakes`. AI 100.

### Key focuses

| Key | Name | Prerequisites | Effects summary |
| --- | --- | --- | --- |
| `troll_silver` | Troll Silver | — | Sets `zin_dark_trolls_for_pay`: every Dark Lands country may take Hire the Troll-Kin without the opinion requirement |
| `kin_for_the_accord` | Troll-Kin for the Accord | troll_silver | Event to Dondor: hire troll bands (Dondor gets `zin_dark_troll_hirelings` for 365 days; the forest +50 PP and 300 arms) |
| `kin_for_cocanoor` | Troll-Kin for Cocanoor | troll_silver | The same offer to Goldoroth; sway +5 |
| `paths_that_wander` | Paths That Wander | — | Sway −10; a fort |
| `nobody_enters` | Nobody Enters | stone_hides + old_trees_watch | Sway −10; spirit *The Deep Forest* |
| `send_them_back_lighter` / `stone_for_the_south` | — | strangers_under_the_eaves | Answers Volgan's envoys either way |

### Spirits

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `forest_law` | The Forest Law | `stability_factor` 0.05, `political_power_gain` 0.05 | `the_forest_law` |
| `old_ways` | The Old Ways | `drift_defence_factor` 0.15, `stability_factor` 0.05 | `the_old_ways` |
| `young_ways` | The Young Ways | `war_support_factor` 0.10, `army_attack_factor` 0.05, `stability_factor` −0.03 | `the_young_ways` |
| `troll_bands_spirit` | Troll Bands | `experience_gain_army_factor` 0.10 | `troll_bands` |
| `old_trees_watch_spirit` | The Old Trees Watch | `recon_factor` 0.10, `enemy_operative_detection_chance_factor` 0.10 | `old_trees_watch` |
| `deep_forest` | The Deep Forest | `army_core_defence_factor` 0.10, `max_dig_in` 2 | `nobody_enters` |
| `long_memories_spirit` | Long Memories | `drift_defence_factor` 0.10 | `long_memories` |
| `trolls_march` | The Trolls March | `army_attack_factor` 0.05, `breakthrough_factor` 0.05 | `the_trolls_march` |
| `forest_wakes` | The Forest Wakes | `army_defence_factor` 0.10, `army_morale_factor` 0.05 | timed, 180 days |

### Events (namespace `zin_regional_troll_forest`)

| # | Key | Title | To | Trigger | Picture | Options |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `troy_speaks` | Troy the Old Speaks | Troll Forest | The Old One's Forest | `generic_wilds` | "Listen." (stability 0.03) / "Ask him about the south." (political_power 25). Text never states Troy's age or mortality |
| 2 | `troll_kin_offered` | Trolls for Hire | Dondor or Goldoroth | Troll-Kin for the Accord / for Cocanoor | `generic_wilds` | "Hire them." (timed idea `zin_dark_troll_hirelings` 365 days; the Troll Forest +50 PP and 300 `zin_arms_equipment` through the mechanic's `zin_dark.75`; Dondor: resolve +3; AI 70) / "Not trolls." (AI 30) |
| 3 | `strangers_under_the_eaves` | Strangers Under the Eaves | Troll Forest | Strangers Under the Eaves | `southern_warning` | One option. Text: the trolls let the strangers in, which is rare, and let them out, which is rarer |

### Historical AI route

1748–1750: the_old_ones_forest, troll_silver, paths_that_wander, troy_speaks, the_younger_trolls, kin_for_any_coin, troll_brutes. 1750–1753: strangers_under_the_eaves, send_them_back_lighter, the_forest_law, the_old_ways, stone_hides, old_trees_watch, nobody_enters, troll_bands. Then the rest; war branch only if attacked.

---

## Implementation

### Builder and files (per tree)

The content builder's focus compiler, `tools/content/modules/focus_compiler.mjs` ([00_format_and_compiler.md](../00_format_and_compiler.md)), reads each tree's data file and writes these files in the builder's one transaction through the shared rewrite engine (`tools/content/apply.mts`). Names: `dondor`, `blackton`, `dulundur`, `bordon`, `dreson`, `troll_forest`. The builder resolves country names to tags at build time. Each compiled tree's `country` block selects its owner, so the interim Long Peace tree no longer applies to it.

| Path | Content |
| --- | --- |
| `docs/design/focus/regional_<name>.json` | Tree data, `"tier": "regional"`, `"countries": ["<Name>"]` |
| `common/national_focus/zin_regional_<name>.txt` | Compiled tree |
| `common/ideas/zin_focus_regional_<name>.txt` | Spirits `zin_regional_<name>_<key>` |
| `events/zin_regional_<name>.txt` | Events, namespace `zin_regional_<name>` (effect-triggered only) |
| `common/scripted_effects/zin_regional_<name>.txt`, `common/scripted_triggers/zin_regional_<name>.txt` | Tree-declared logic below |
| `common/opinion_modifiers/zin_regional_<name>.txt` | Tree-declared opinion modifiers (from the tree data's `opinion_modifiers` block; same mechanism as Goldoroth's `zin_goldoroth_opinion`): every `(k)` named in the tree, value as written, decay 0.5 a month |
| `common/ai_strategy/zin_regional_<name>.txt` | The strategies under AI, from the tree data's `ai_strategies` block |
| `localisation/english/zin_focus_regional_<name>_l_english.yml` | Text |

### Tree-declared scripted effects

| Effect | Tree | Does |
| --- | --- | --- |
| `zin_regional_<tree>_opinion` (`who`, `modifier`) | every tree | `$who$ = { add_opinion_modifier = { target = ROOT modifier = zin_regional_<tree>_$modifier$ } }` (who's opinion of ROOT), and `add_opinion_modifier = { target = $who$ modifier = … }` too when the tree text says "both ways" (a second helper `zin_regional_<tree>_opinion_both`) |
| `zin_regional_dondor_join_war` | Dondor's event 7 | For every country at war with Dondor: `add_to_war = { targeted_alliance = <Dondor tag> enemy = <that country> hostility_reason = asked_to_join }` |
| `zin_regional_dulundur_white_peace` | Dulundur's event 3 | `white_peace = <Dulundur tag>` in Goldoroth's scope |
| `zin_regional_dondor_iron_trade` | Dondor | Every independent Dark Lands hold bordering Dondor: opinion of Dondor +10 (`iron_trade`) |
| `zin_regional_dondor_invite_holds` | Dondor | Fires `zin_dark.20` to up to two holds that meet the mechanic's invitation conditions, lowest `zin_goldoroth_sway` first |
| `zin_regional_dondor_greet_moot` | Dondor | Opinion `same_shore` (+15) both ways between Dondor and every country with `zin_dark_moot_member` |
| `zin_regional_dondor_claim_march` | Dondor | `add_state_claim` on every state with `zin_is_site_goldoroth_march` |
| `zin_regional_blackton_iron_trade` | Blackton | As Dondor's, for holds bordering Blackton |
| `zin_regional_dulundur_kin_goodwill`, `zin_regional_dreson_kin_goodwill` | Dulundur, Dreson | Opinion +10 both ways with every country passing `zin_dark_is_free_hold` |
| `zin_regional_dulundur_steady_small_halls` | Dulundur | `zin_goldoroth_add_sway(target = X, value = −5)` for every free hold X with sway ≥ 40 |
| `zin_regional_dulundur_rally_moot`, `zin_regional_dreson_rally_moot` | Dulundur, Dreson | Fires `zin_dark.71` to every Moot member not at war with ROOT's enemies |
| `zin_regional_dulundur_wargoal_tributaries` | Dulundur | `create_wargoal` `take_state` on one state of each Goldoroth tributary that borders ROOT |
| `zin_regional_bordon_gain_autonomy` | Bordon | `add_autonomy_ratio = { value = 0.2 }` |

### Tree-declared scripted triggers

| Trigger | Tree | True when |
| --- | --- | --- |
| `zin_regional_dulundur_moot_allowed` | Dulundur | The mechanic's conditions for Call the Free Moot: Goldoroth's unity ≥ 30, or Goldoroth holds `zin_cb_hold_defiance` against any hold, or Goldoroth is at war with a hold; ROOT is a free hold with pact ≤ 2 |
| `zin_regional_dreson_is_coastal` | Dreson | `any_owned_state = { is_coastal = yes }` |
| `zin_regional_dondor_belonton_in_accord` | Dondor | `<Belonton tag> = { is_in_faction_with = ROOT }` |
| `zin_regional_dondor_blackton_unbound` | Dondor | `<Blackton tag> = { is_in_faction = no is_subject = no }` |
| `zin_regional_dondor_leren_shield` | Dondor | `OR = { <Lerendor tag> = { has_guaranteed = ROOT } check_variable = { zin_leren_lean > 29 } }` |
| `zin_regional_dondor_cores_held`, `zin_regional_dulundur_cores_held` | Dondor, Dulundur | `all_core_state = { is_controlled_by = ROOT }` |
| `zin_regional_blackton_unbound`, `zin_regional_bordon_unbound` | Blackton, Bordon | `is_in_faction = no is_subject = no` |
| `zin_regional_dulundur_moot_threatened` | Dulundur | Goldoroth holds a war goal (the mechanic's `zin_cb_hold_defiance`) against a Moot member: `any_country = { has_country_flag = zin_dark_moot_member <Goldoroth tag> = { has_wargoal_against = PREV } }` |

### Flags other systems read

| Flag | Set by | Read by | Effect |
| --- | --- | --- | --- |
| `zin_dark_petitioned_parim` (country) | Dondor's *Notbuton Asks Parim*; the mechanic's decision Petition Parim | Dark Lands mechanic | The decision is unavailable once set; it sets the flag itself |
| `zin_regional_dondor_beacon_chain` | Dondor | Dark Lands mechanic | Light the Sea Beacons cools down in 120 days |
| `zin_regional_dondor_muster_drill` | Dondor | Dark Lands mechanic | Muster the Brutes cools down in 240 days |
| `zin_regional_dondor_stands_with_living` | Dondor | Goldoroth tree's `zin_goldoroth.18` | Dondor's AI accepts the truce against the dead at 100 |
| `zin_dark_oath_sworn` (country) | Dondor's event 4; the shared tree | Goldoroth tree's `zin_goldoroth.8` and `.19` | AI chance of "Take the gold" and "Leave the Accord" ×0.5 |
| `zin_dark_gifts_returned` (country) | Dulundur; the shared tree | Dark Lands mechanic | Send Gifts of Black Iron gives this target +5 sway, not +10 |
| `zin_regional_blackton_paid_corsairs` (730 days) | Blackton | Dark Lands mechanic AI | Goldoroth's Corsair Raid on Blackton ×0.25 |
| `zin_regional_blackton_seeks_protection` | Blackton | Lerendor mechanic | `zin_leren_offer_protection` may target Blackton at lean 60 |
| `zin_regional_blackton_free_harbour` | Blackton | Dondor's event 5; diplomacy AI | Blackton's AI declines every faction invitation |

### Mechanic names called (all defined elsewhere)

`zin_goldoroth_add_sway`, `zin_dark_add_accord_resolve`, `zin_dark_add_border_tension`, `zin_dark_add_volgan_pact`, `zin_dark_is_tributary`, `zin_dark_is_free_hold`, `zin_dark_is_hold`, `zin_dark.20`, `zin_dark.30`, `zin_dark.31`, `zin_dark.70`, `zin_dark.71`, `zin_dark.75` ([dark_lands.md](../../04_mechanics/dark_lands.md)); `zin_leren_add_lean`, `zin_leren_offer_protection` ([lerendor_narrow_strait.md](../../04_mechanics/lerendor_narrow_strait.md)); `zin_world_add_gathering_dark`; `zin_lost_cause_exists`, `zin_lost_cause_add_strength` ([diplomacy](../../03_gameplay/03_diplomacy_and_factions.md), [Aenor](../../04_mechanics/aenor_court_and_succession.md)); `zin_eindil_add_regard` ([eindil_journey.md](../../04_mechanics/eindil_journey.md)); `zin_politics_set_stance` ([politics](../../00_foundation/02_ideologies_and_politics.md)). Two new mechanic effects are needed: `zin_dark_found_free_moot` and `zin_dark_join_free_moot` (see contract additions in the report).

### Raw blocks

None: the guarantee, faction, core-control and war-joining checks live in the tree-declared scripts above.

### Characters

The rulers are the characters spec's `<TAG>_zin_ruler`. The advisors and leaders in each "Ruler and court" table are entries in `tools/content/data/characters.json` ([characters](../../02_lore/02_characters.md)), built by `tools/content/modules/characters.mjs` into `common/characters/zin_lore_characters.txt` and recruited by their country at the start (the characters spec's "Start" rule); no focus recruits them.

### Icons

All icons are catalog keys ([../02_icon_catalog.md](../02_icon_catalog.md)); none is new. Each event's picture is in its table: `generic_court`, `generic_wilds`, `generic_sea`, `generic_peace`, `generic_war` and `southern_warning` (envoy events).

### Current game state

All six countries run the interim Long Peace tree today; their rulers carry generated names until the characters spec ships, and the game still starts in 1936 until the calendar spec ships. The trees call the Dark Lands, Lerendor, Volgan, Aenor and journey systems, so they are built in phase 6 after those mechanics (phase 3).

## AI

- The historical routes above apply under `check zin_rules_is_historical`. Under PLAUSIBLE every "hist" factor f becomes 1 + (f − 1) ÷ 2; under FREE the trees follow the base weights.
- **Holds and the yoke.** On the historical path Bordon's tree raises its sway (Markets of Cocanoor, The Road to Cocanoor) so that the mechanic's acceptance chance makes it a tributary in 4A 1752–1753; Dulundur and Dreson lower theirs and refuse. This gives the mechanic's "one to three holds become tributaries; one or two refuse".
- **Moot.** Dulundur calls the Free Moot through *The Moot Stone* as soon as `zin_regional_dulundur_moot_allowed` is true (the mechanic's "Dulundur is the AI's first choice").
- **No early war.** No AI takes a war focus before its gate. Dondor's *The Counterstroke* and Dulundur's *Strike the Tributaries* have hist ×0.
- **AI strategies** (tree data `ai_strategies`): Dondor `befriend` Lerendor 30 and Belonton 50; Blackton `befriend` Lerendor 20; Dulundur, Dreson and the Troll Forest `befriend` each other 15 while the Moot exists.

## Acceptance

1. The compiler builds the six trees with 49, 39, 36, 31, 31 and 30 focuses, unique positions, every focus below its prerequisites, every exclusive pair written on both focuses, days multiples of 7 and every icon and event picture in the catalog; the HOI4 Agent Tools focus inspector and script validator pass on the staged files.
2. Scan: on 1 Thaw 4A 1748 no focus available to any of the six countries declares war, creates a war goal or adds a claim; the only claim and war-goal effects (`zin_regional_dondor_claim_march`, `zin_regional_dulundur_wargoal_tributaries`) sit behind `at_war_with` Goldoroth.
3. Every modifier in the spirit tables exists in the 1.19.3 modifier documentation; every called scripted effect and trigger exists in the staged files; no localisation key is shared by a focus and an idea of the same tree.
4. Scripted tests with forced flags and variables: *Notbuton Asks Parim* sets `zin_dark_petitioned_parim` and the decision Petition Parim becomes unavailable; *Troll Silver* sets `zin_dark_trolls_for_pay`; tributary-only focuses (Bordon's branch D) cannot be taken by a free Bordon, and Moot focuses cannot be taken by a tributary; Dulundur's *The Moot Stone* calls `zin_dark_found_free_moot` only when `zin_regional_dulundur_moot_allowed` holds.
5. The localisation check finds no "Afrit", no named hold called goblin, no size of Volgan's hosts, and no claim that fire ends Zol's dead in any `zin_regional_*` text of this spec.
6. One in-game year in the isolated Linux run from 1 Thaw 4A 1748 (historical rule): no Dark Lands war starts, the six trees load without errors in the log, and Dondor completes *Notbuton Asks Parim* and *Notbuton Calls on the North* in 4A 1748.

## Open questions

Owner questions are listed in [OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md) (regions: dark, magical, dead, 1 to 4); the work proceeds on the proposal given.

1. **Dondor's size.** (owner) Works on: Dondor keeps one state and survives through friends and walls.
2. **Bordon's road and Dreson's fens.** (owner) Works on: Bordon is the Road-Hold of a "Black Road" from Cocanoor to the coast (proposed); Dreson is a fen hold on the map's Dark Lands marsh.
3. **Historical yoke.** (owner) Works on: Bordon bends; Dulundur and Dreson refuse.
4. **Blackton's government and Rovek.** (owner) Works on: Blackton may become a council realm (Light) through *The Free Towns' Charter*; Dondor's chronicles may name Rovek of Dondor as legend.
5. **Troy the Old.** Settled: the tree never states his age or whether trolls die of age (the vault leaves it open), and needs nothing more.
