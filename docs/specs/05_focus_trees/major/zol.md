# Zol focus tree

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 4. **Phase:** 4.

## Purpose

Zol's tree is the strangest in ZIN. Zol has no body, no court and no people. His tree is not about ruling: it is about keeping a bodiless Old God present in Erdae under the Fading, deepening the service of servants nobody can name, waking the black islands, readying the deathless dead, and, if the hour comes, rising, taking a brief form and withdrawing. It has 97 focuses in eight branches. It drives the mechanic in [../../04_mechanics/zols_mistake.md](../../04_mechanics/zols_mistake.md) and uses the data format of [../00_format_and_compiler.md](../00_format_and_compiler.md).

Tree id `zol`; tier `major`; countries: Zol. Focus ids compile to `zin_zol_<key>`; spirits to `zin_zol_<key>`; events to namespace `zin_zol`.

## Lore basis

**Established** (see the mechanic spec for sources): Zol is the only Old God in Erdae; the Fading and Erdae's magic deny him a body and free use of his power; his power grows very slowly; Great Spirits, Lesser Spirits and New Gods serve and sustain him, identities unknown; without them he could fade out of Erdae; who administers Furviatlon is unknown; the wandering dead have no settled allegiance; his dead stir in the islands at the start, unseen by courts; late in the age they emerge through islands and straits; ordinary weapons cannot end them, potent magic can; his dead clash with Volgan's and later briefly join them against Eindil; he manifests once at great cost, breaks Horos's sword, is wounded by a shard and is forced back by Lorien and ancient spirits; he is not slain.

**Proposed:** every focus, spirit, event, number and name in this tree; the dates of the historical route (rising 4A 1755, manifestation and withdrawal 4A 1757); the "routes of power" of the Convergence branch (from the proposed chronicle explanation).

**Text rules for this tree.** No focus or event text names or describes a servant, says who keeps Furviatlon, says what feeding is, says Zol's magic differs by place, calls the wandering dead his, says Zol is destroyed, or states what remains of him after he withdraws. No text names Afrit. No text names Eindil unless its focus or event requires `zin_eindil_returned` or a later flag. Descriptions are short and cold: the voice of the north, not of a court.

**Leader and commanders (decision S4).** Zol is led by an emblem, *The Will of Zol* (character `zin_zol_will`, foundation spec; portrait the `zol_sigil` emblem, no traits that imply a person). The emblem says nothing about who administers the Mistake. Zol's armies have numbered hosts ("The First Host", "The Second Host"), never named commanders. No focus or event of this tree recruits, names or promotes a character.

**Spelling.** Documents write Šodolôrō (vault). Game text (focus names, descriptions, tooltips, event text in `zol.json`) writes **Šodolôro**, because the game font cannot draw ō (decision S11).

## Design overview

| Branch | Columns | Opens | Drives |
| --- | --- | --- | --- |
| A. The Servants | 0–6 | Start | Bonds of the three orders; servant decisions; concealed or open service |
| B. The Presence | 8–12 | Start | Power growth and the Fading; ends in the route choice |
| C. Furviatlon and Šodolôrō | 14–17 | Start | The faceless seat, the wastes, the wandering dead, muster sites |
| D. The Black Islands | 18–22 | Start | Waking islands, rumours, black hulls, the crossing |
| E. The Dead | 23–27 | Start (war focuses need the rising) | Hosts, the deathless spirit line, the returning fallen |
| F. The Rising | 7–12 | Route "The Appointed Hour" or "The Hastened Hour" | The rising, war targets, Volgan, the deathfield |
| G. The Long Patience | 13–16 | Route "The Long Patience" | Dormancy, a late rising or none |
| H. The Convergence | 17–20 | Branch C or D for the routes; rising for the rest | Convergence, manifestation, withdrawal, aftermath |

**Peaceful start.** Every focus a player can take before the rising is about presence, service, the seat, the islands or preparation inside the Mistake. The mechanic keeps the rule `set_rule = { can_not_declare_war = yes }` on Zol until `zin_zol_rise` clears it. No focus creates a wargoal before the rising: every war focus has `available` `{ "global_flag": "zin_zol_rising" }`.

**Route choice (B, row 5).** "The Appointed Hour", "The Hastened Hour" and "The Long Patience" are mutually exclusive. They set the earliest rising date (mechanic section 7).

**Grid.** Columns 0–27 (28 wide), rows 0–15. All positions are unique; every focus sits below all its prerequisites.

Notation: prerequisites `a + b` means both; `a | b` means either. `@site` is a building `where` key (capital or a key-site trigger `zin_is_site_<site>`). Effects use the compiler vocabulary; `call X(v)` is `{ "call": "X", "args": { "value": v } }`; `power +N` is `call zin_zol_add_mistake_power(N)`; `conv +N` is `call zin_zol_add_convergence(N)`; `bond great +N` is `call zin_zol_add_bond_great(N)` (likewise lesser, divine); `rising` is `{ "global_flag": "zin_zol_rising" }`.

## A. The Servants (columns 0–6)

**Purpose:** deepen the service of the three orders. Opens at the start. Mid-branch choice: keep the service hidden (fewer rumours) or let it be open (more power, more rumours). The last focus needs the rising.

| key | name | prerequisites | exclusive with | x,y | days | effects | AI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `servants_unseen` | Servants Unseen | — | — | 3,0 | 70 | political_power 25; flag `zin_zol_calls_open` (Call Upon decisions) | base 10; ×3 before 1749 |
| `the_great_who_serve` | The Great Who Serve | servants_unseen | — | 1,1 | 35 | bond great +1 | 10 |
| `the_lesser_multitude` | The Lesser Multitude | servants_unseen | — | 3,1 | 35 | bond lesser +1 | 10 |
| `gods_who_serve` | Gods Who Serve an Older God | servants_unseen | — | 5,1 | 35 | bond divine +1 | 10 |
| `old_strength_bent` | Old Strength Bent to Service | the_great_who_serve | — | 0,2 | 70 | bond great +1 | 8 |
| `labours_of_the_lesser` | Labours of the Lesser | the_lesser_multitude | — | 3,2 | 70 | bond lesser +1; political_power 50 | 8 |
| `reluctance_of_gods` | The Reluctance of Gods | gods_who_serve | — | 5,2 | 70 | event `reluctance_of_gods` | 8 |
| `the_tending` | The Tending | old_strength_bent | — | 1,3 | 70 | flag `zin_zol_tending` (Tend the Presence 25 PP, cooldown 90) | 6 |
| `orders_apart` | Orders Apart | old_strength_bent + labours_of_the_lesser | — | 2,3 | 70 | call zin_zol_add_fading_pressure(−0.02) | 8 |
| `the_divine_keep_silence` | The Divine Keep Their Silence | reluctance_of_gods | — | 6,3 | 70 | bond divine +1 | 6 |
| `a_concealed_allegiance` | A Concealed Allegiance | orders_apart \| reluctance_of_gods | service_without_shame | 3,4 | 70 | add_spirit `veiled_service`; flag `zin_zol_veiled` (rumour chance halved) | 10; historical ×5 |
| `service_without_shame` | Service Without Shame | orders_apart \| reluctance_of_gods | a_concealed_allegiance | 5,4 | 70 | add_spirit `open_service`; bond great +1; bond divine +1; call zin_zol_add_growth_bonus(0.03); rumour chance doubled | 10; historical ×0.2 |
| `the_great_bear_the_weight` | The Great Bear the Weight | the_tending | — | 0,4 | 70 | bond great +1; army_experience 10 | 5 |
| `when_servants_falter` | When Servants Falter | the_great_bear_the_weight | — | 0,5 | 70 | flag `zin_zol_bonds_steadfast` (falter chance halved; lost point returns after 180 days) | 5 |
| `service_without_end` | Service Without End | a_concealed_allegiance \| service_without_shame | — | 4,5 | 70 | call zin_zol_add_growth_bonus(0.05); bond lesser +1 | 8 |
| `the_whole_service` | The Whole Service | service_without_end + (the_great_bear_the_weight \| the_divine_keep_silence) | — | 3,6 | 70 | bond great +1; bond lesser +1; bond divine +1; power +3 | 6 |
| `servants_at_war` | Servants at War | the_whole_service | — | 3,7 | 70 | available rising; add_spirit `servants_at_war_spirit`; conv +5 | 15 if rising |

## B. The Presence (columns 8–12)

**Purpose:** the heart of the tree. Grow `zin_mistake_power`, ease the Fading, open the Expressions of the Presence, and choose the hour. Opens at the start. Row 5 is the route choice (mutually exclusive).

| key | name | prerequisites | exclusive with | x,y | days | effects | AI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `silence_of_the_north` | The Silence of the North | — | — | 10,0 | 70 | political_power 50; power +2 | 50 (first focus) |
| `it_grows_each_day` | It Grows Each Day | silence_of_the_north | — | 10,1 | 70 | call zin_zol_add_growth_bonus(0.05) | 20 |
| `against_the_fading` | Against the Fading | it_grows_each_day | — | 9,2 | 70 | call zin_zol_add_fading_pressure(−0.03) | 15 |
| `held_and_spent` | What Is Held, What Is Spent | it_grows_each_day | — | 11,2 | 70 | flag `zin_zol_expressions_open`; political_power 50 | 12 |
| `the_unanswering_magic` | The Unanswering Magic | against_the_fading | — | 9,3 | 70 | call zin_zol_add_fading_pressure(−0.02); power +2 | 10 |
| `a_presence_deepened` | A Presence Deepened | held_and_spent | — | 11,3 | 70 | call zin_zol_add_growth_bonus(0.05) | 10 |
| `older_than_kings` | Older Than Kings | the_unanswering_magic + a_presence_deepened | — | 10,4 | 70 | available `zin_mistake_power` ≥ 40; event `older_than_kings`; power +4; stability 0.05 | 15 |
| `the_appointed_hour` | The Appointed Hour | older_than_kings | the_hastened_hour, the_long_patience | 8,5 | 35 | flag `zin_zol_route_appointed`; power +3 | 10; ×10 with check `zin_zol_ai_route_appointed` |
| `the_hastened_hour` | The Hastened Hour | older_than_kings | the_appointed_hour, the_long_patience | 10,5 | 35 | flag `zin_zol_route_hastened`; call zin_zol_add_fading_pressure(0.03) | 5; ×20 with check `zin_zol_ai_route_hastened`; ×0 with `zin_zol_ai_route_appointed` |
| `the_long_patience` | The Long Patience | older_than_kings | the_appointed_hour, the_hastened_hour | 12,5 | 35 | flag `zin_zol_route_patience`; call zin_zol_add_growth_bonus(0.05) | 5; ×20 with check `zin_zol_ai_route_patience`; ×0 with `zin_zol_ai_route_appointed` |

## C. Furviatlon and Šodolôrō (columns 14–17)

**Purpose:** the seat and the land. Furviatlon is a seat with no keeper the game will name; Šodolôrō becomes a muster site; the black wastes turn hostile to intruders; the wandering dead stay their own. Opens at the start. Leads into the Convergence branch.

| key | name | prerequisites | exclusive with | x,y | days | effects | AI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `the_seat_at_furviatlon` | The Seat at Furviatlon | — | — | 15,0 | 70 | political_power 50; stability 0.05; tooltip "Who keeps the seat is not known." | 30 |
| `a_seat_without_a_face` | A Seat Without a Face | the_seat_at_furviatlon | — | 14,1 | 70 | add_spirit `faceless_seat` | 10 |
| `sodoloro` | Šodolôro | the_seat_at_furviatlon | — | 16,1 | 70 | flag `zin_zol_muster_sodoloro`; power +2 | 10 |
| `the_black_wastes` | The Black Wastes | a_seat_without_a_face | — | 14,2 | 70 | call zin_zol_harden_wastes | 8 |
| `the_wandering_dead` | The Wandering Dead | sodoloro | — | 16,2 | 35 | event `the_wanderers` | 8 |
| `the_seats_long_reach` | The Seat's Long Reach | the_black_wastes \| the_wandering_dead | — | 15,3 | 70 | political_power 75; call zin_zol_add_host_cap(2) | 8 |
| `the_unpeopled_land` | The Unpeopled Land | the_seats_long_reach | — | 14,4 | 70 | add_spirit `unpeopled_land` | 6 |
| `sodoloro_stirs` | Šodolôro Stirs | the_seats_long_reach | — | 16,4 | 70 | conv +5; power +3 | 8 |
| `the_seat_endures` | The Seat Endures | the_unpeopled_land \| sodoloro_stirs | — | 15,5 | 70 | swap_spirit [`faceless_seat`, `faceless_seat_2`]; building bunker 2 @capital | 8 |

## D. The Black Islands (columns 18–22)

**Purpose:** wake the black islands of the Ocean of Zol, choose whether the fishermen's tales spread, gather black hulls and prepare the crossing "through islands and straits". Opens at the start. The last two focuses need the rising.

| key | name | prerequisites | exclusive with | x,y | days | effects | AI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `the_black_islands` | The Black Islands | — | — | 20,0 | 70 | call zin_zol_wake_island(count 1) | 25 |
| `stirring_among_the_isles` | Stirring Among the Isles | the_black_islands | — | 19,1 | 70 | call zin_zol_wake_island(count 2) | 15 |
| `black_hulls` | Black Hulls | the_black_islands | — | 21,1 | 70 | equipment convoy_1 20 (the kept convoy equipment, "merchant cogs"); navy_experience 5 | 8 |
| `let_them_talk` | Let Them Talk | stirring_among_the_isles | keep_the_isles_dark | 18,2 | 35 | flag `zin_zol_isles_loud` (Wake an Island 12 PP, 15 days; rumour 50%) | 10; historical ×3 |
| `keep_the_isles_dark` | Keep the Isles Dark | stirring_among_the_isles | let_them_talk | 20,2 | 35 | flag `zin_zol_isles_dark` (Wake an Island 45 days; rumour 10%) | 10 |
| `the_outer_arc` | The Outer Arc | let_them_talk \| keep_the_isles_dark | — | 19,3 | 70 | call zin_zol_wake_island(count 2) | 12 |
| `hulls_without_living_crews` | Hulls Without Living Crews | black_hulls | — | 21,3 | 70 | equipment convoy_1 30; add_spirit `black_hulls_spirit` | 6 |
| `the_island_hosts` | The Island Hosts | the_outer_arc | — | 18,4 | 70 | flag `zin_zol_muster_islands` | 8 |
| `toward_the_straits` | Toward the Straits | the_outer_arc + hulls_without_living_crews | — | 21,4 | 70 | navy_experience 15; political_power 25 | 6 |
| `every_black_isle` | Every Black Isle | the_island_hosts + toward_the_straits | — | 19,5 | 70 | call zin_zol_wake_island(count all); conv +5; power +2 | 10 |
| `landing_grounds` | Landing Grounds | toward_the_straits | — | 22,5 | 70 | add_spirit `landing_grounds_spirit` | 5 |
| `the_black_fleet` | The Black Fleet | every_black_isle + landing_grounds | — | 20,6 | 70 | equipment convoy_1 40; navy_experience 25 | 5; ×3 if rising |
| `out_of_the_isles` | Out of the Isles | the_black_fleet | — | 19,7 | 35 | available rising; timed_spirit `out_of_the_isles_spirit` 180 | 15 if rising |
| `through_islands_and_straits` | Through Islands and Straits | the_black_fleet | — | 21,7 | 35 | available rising; timed_spirit `through_the_straits` 180 | 10 if rising |

## E. The Dead (columns 23–27)

**Purpose:** Zol's own dead, sustained by his death-magic. Open "Raise a Host", build the deathless spirit line, raise the return rate of the fallen, and gather grave arms. Pre-rising focuses work only inside the Mistake (host cap 4). Focuses from row 6 on that create forces need the rising. The wandering dead are never recruited here.

| key | name | prerequisites | exclusive with | x,y | days | effects | AI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `the_dead_of_zol` | The Dead of Zol | — | — | 25,0 | 70 | flag `zin_zol_hosts_open`; army_experience 10 | 15 |
| `not_as_elzons_dead` | Not as Elzon's Dead | the_dead_of_zol | — | 24,1 | 70 | add_spirit `deathless_1` | 12 |
| `the_fallen_return` | The Fallen Return | the_dead_of_zol | — | 26,1 | 70 | call zin_zol_add_return_rate(0.15) | 10; ×3 if rising |
| `shapes_broken_not_ended` | Shapes Broken, Not Ended | not_as_elzons_dead | — | 24,2 | 70 | swap_spirit [`deathless_1`, `deathless_2`] | 10; ×3 if rising |
| `no_hunger_no_cold` | No Hunger, No Cold | the_fallen_return | — | 26,2 | 70 | add_spirit `no_hunger` | 6 |
| `grave_arms` | Grave Arms | shapes_broken_not_ended \| no_hunger_no_cold | — | 25,3 | 70 | call zin_war_feed_deathless (one extra month of deathless bonds) | 8 |
| `the_first_host` | The First Host | shapes_broken_not_ended | — | 23,3 | 35 | call zin_zol_raise_host(count 2, free); event `first_host` | 10 |
| `the_grave_march` | The Grave March | no_hunger_no_cold | — | 27,3 | 70 | army_experience 25 (doctrines cost experience in 1.19.3) | 5 |
| `deathless_endurance` | Deathless Endurance | the_first_host + grave_arms | — | 24,4 | 70 | swap_spirit [`deathless_2`, `deathless_3`] | 10 |
| `the_tireless_march` | The Tireless March | grave_arms + the_grave_march | — | 26,4 | 70 | add_spirit `tireless` | 5 |
| `the_gathered_hosts` | The Gathered Hosts | deathless_endurance \| the_tireless_march | — | 25,5 | 70 | call zin_zol_add_host_cap(4) | 8 |
| `what_can_end_them` | What Can End Them | the_gathered_hosts | — | 24,6 | 70 | flag `zin_zol_knows_bane` (bane attack bonus 0.3 → 0.2); tooltip "Only potent magic can end them." | 5; ×4 if an enemy has potent magic |
| `the_dead_rise_armed` | The Dead Rise Armed | the_gathered_hosts | — | 26,6 | 35 | available rising; call zin_war_feed_deathless; call zin_zol_raise_host(count 2, free) (the mechanic adds each host's 200 manpower; the tree grants no manpower of its own, because Zol's recruitable manpower comes only from the mechanic) | 15 if rising |
| `the_great_host` | The Great Host | what_can_end_them \| the_dead_rise_armed | — | 25,7 | 70 | available rising; call zin_zol_raise_host(count 4, free); add_spirit `great_host`; army_experience 25 | 15 if rising |
| `death_marches_south` | Death Marches South | the_great_host | — | 25,8 | 35 | available rising + at_war; timed_spirit `death_marches` 365 | 10 |

## F. The Rising (columns 7–12)

**Purpose:** the war branch. Opens only after "The Appointed Hour" or "The Hastened Hour". "The Dead Rise" is available only when `zin_zol_can_rise` holds, and is bypassed if Zol has already risen by decision. Every other focus here needs the rising. Mutually exclusive pair: "The Brief Accord" or "Alone Against All".

| key | name | prerequisites | exclusive with | x,y | days | effects | AI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `the_dead_rise` | The Dead Rise | the_appointed_hour \| the_hastened_hour | — | 9,6 | 35 | available check `zin_zol_can_rise`; bypass rising; call zin_zol_rise | 1000 when available |
| `strike_while_they_sleep` | Strike While They Sleep | the_hastened_hour | — | 11,6 | 35 | available rising; timed_spirit `strike_while_they_sleep_spirit` 180 | 50 if rising |
| `southward_to_aenor` | Southward to Aenor | the_dead_rise | — | 8,7 | 35 | available rising; if not at_war_with Aenor: wargoal Aenor annex_everything; timed_spirit `against_the_middle_kingdom` 365 | 100 |
| `the_northern_shores` | The Northern Shores | the_dead_rise | — | 10,7 | 35 | available rising; if not at_war_with Lerendor: wargoal Lerendor annex_everything | HISTORICAL: 0; FREE: 5 |
| `the_edge_of_the_woods` | The Edge of the Elven Woods | the_dead_rise | — | 12,7 | 35 | available rising; call zin_zol_wargoal_elven_edge | HISTORICAL: 0; FREE: 3 |
| `two_darknesses_meet` | Two Darknesses Meet | southward_to_aenor | — | 8,8 | 35 | available rising + global_flag `zin_volgan_marches`; call zin_zol_tree_clash (Zol strikes first through the mechanic's `zin_zol_strike_volgan`; decisions F2, O4) | 50 |
| `the_land_made_waste` | The Land Made Waste | southward_to_aenor \| the_northern_shores \| the_edge_of_the_woods | — | 10,8 | 70 | available rising + at_war; call zin_zol_spread_deathfield; power +3 | 20 |
| `the_brief_accord` | The Brief Accord | two_darknesses_meet | alone_against_all | 7,9 | 35 | available global_flag `zin_eindil_returned` + not global_flag `zin_volgan_body_destroyed` + not global_flag `zin_black_compact`; flag `zin_zol_accord_sought` (Zol is ready to accept Volgan's offer `zin_dominion.14`; the Compact itself is offered only by Volgan, decision O4, and its acceptance sets `zin_black_compact`, N2) | 20; ×5 under `zin_rules_is_historical` |
| `alone_against_all` | Alone Against All | two_darknesses_meet | the_brief_accord | 9,9 | 35 | available rising; add_spirit `alone_against_all_spirit` | HISTORICAL: 0; FREE: 10 |
| `the_isles_hold` | The Isles Hold | the_land_made_waste | — | 11,9 | 70 | building bunker 2 @ocean_of_zol_island, three times (three owned island states) | 5 |
| `the_long_war_of_the_dead` | The Long War of the Dead | the_brief_accord \| alone_against_all | — | 8,10 | 70 | add_spirit `long_war`; call zin_zol_add_return_rate(0.10) | 10 |
| `what_the_war_leaves` | What the War Leaves | the_long_war_of_the_dead \| the_isles_hold | — | 9,11 | 70 | available rising; conv +10; event `what_the_war_leaves` | 10 |

## G. The Long Patience (columns 13–16)

**Purpose:** the dormant route. Zol waits while the living destroy each other. Opens only after "The Long Patience". Choice at row 9: "A Greater Hour" (rise from 4A 1760, stronger) or "The Unending Patience" (never rise this game unless attacked).

| key | name | prerequisites | exclusive with | x,y | days | effects | AI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `the_patient_dark` | The Patient Dark | the_long_patience | — | 14,6 | 70 | add_spirit `patience`; call zin_zol_add_growth_bonus(0.05) | 50 on route |
| `watch_from_the_north` | Watch from the North | the_patient_dark | — | 14,7 | 70 | power +4 | 30 |
| `the_unwatched_north` | The Unwatched North | watch_from_the_north | — | 13,8 | 70 | flag `zin_zol_unwatched` (no more rumours); call zin_world_add_gathering_dark(−3) | 20 |
| `deeper_service` | Deeper Service | watch_from_the_north | — | 15,8 | 70 | bond great +1; bond lesser +1; bond divine +1 | 25 |
| `a_greater_hour` | A Greater Hour | the_unwatched_north \| deeper_service | the_unending_patience | 14,9 | 70 | flag `zin_zol_greater_hour` (rising from 1760.1.1; on rising hosts ×1.5 and conv +20); event `a_greater_hour` | 20 |
| `the_unending_patience` | The Unending Patience | deeper_service | a_greater_hour | 16,9 | 70 | flag `zin_zol_unending` (never rises unless attacked); call zin_zol_add_growth_bonus(0.10); event `unending_patience` | 5; ×20 with check `zin_zol_ai_route_patience` |
| `the_late_rising` | The Late Rising | a_greater_hour | — | 14,10 | 35 | available rising; if not at_war_with Aenor: wargoal Aenor annex_everything; timed_spirit `against_the_middle_kingdom` 365 | 100 if rising |
| `a_presence_vast_and_quiet` | A Presence Vast and Quiet | the_unending_patience | — | 16,10 | 70 | power +10; swap_spirit [`patience`, `patience_2`] | 30 |

## H. The Convergence (columns 17–20)

**Purpose:** prepare the brief form and live with its cost. The first three focuses (the routes of power, proposed) can be taken before the rising; they open from the seat (C) and the islands (D). From row 10 the branch needs the rising; rows 12–15 follow the manifestation and the withdrawal. Manifestation itself is the decision "Come Forth", opened by "A Fraction of a God".

| key | name | prerequisites | exclusive with | x,y | days | effects | AI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `the_old_roads_of_power` | The Old Roads of Power | the_seat_endures | — | 17,7 | 70 | conv +10; event `old_roads` | 12 |
| `routes_beneath_the_isles` | Routes Beneath the Isles | every_black_isle | — | 20,8 | 70 | conv +10 | 12 |
| `a_road_toward_the_south` | A Road Toward the South | the_old_roads_of_power + routes_beneath_the_isles | — | 18,9 | 70 | conv +10 | 12 |
| `the_weight_of_the_dead` | The Weight of the Dead | a_road_toward_the_south | — | 17,10 | 70 | available rising; call zin_zol_add_convergence_rate(1) | 30 |
| `when_hosts_are_broken` | When Hosts Are Broken | a_road_toward_the_south | — | 19,10 | 70 | available rising; flag `zin_zol_breaking_attuned` | 25 |
| `a_fraction_of_a_god` | A Fraction of a God | the_weight_of_the_dead \| when_hosts_are_broken | — | 18,11 | 70 | available rising + `zin_zol_convergence` ≥ 60; flag `zin_zol_manifest_open` (decision Come Forth); power +3 | 40 |
| `the_cost_of_form` | The Cost of Form | a_fraction_of_a_god | — | 17,12 | 14 | available global_flag `zin_zol_manifested`; bypass global_flag `zin_zol_withdrawn`; call zin_zol_set_manifest_cost(2) | 200 when available |
| `the_presence_takes_form` | The Presence Takes Form | a_fraction_of_a_god | — | 19,12 | 14 | available global_flag `zin_zol_manifested`; bypass global_flag `zin_zol_withdrawn`; timed_spirit `presence_takes_form` 42 | 150 when available |
| `into_the_dark_again` | Into the Dark Again | the_cost_of_form \| the_presence_takes_form | — | 18,13 | 35 | available global_flag `zin_zol_withdrawn`; stability 0.1; political_power 50; call zin_zol_shorten_wound(180) | 100 when available |
| `wounded_not_slain` | Wounded, Not Slain | into_the_dark_again | — | 17,14 | 70 | call zin_zol_add_fading_pressure(−0.02); call zin_zol_add_growth_bonus(0.05); event `wounded_not_slain` | 30 |
| `the_mistake_endures` | The Mistake Endures | into_the_dark_again | — | 19,14 | 70 | building bunker 3 @capital; call zin_zol_add_host_cap(2) | 20 |
| `matters_for_another_age` | Matters for Another Age | wounded_not_slain + the_mistake_endures | — | 18,15 | 70 | available after 1760.3.1; flag `zin_zol_second_stirring_open`; power +5; event `another_age` | 20 |

Total: 17 + 10 + 9 + 14 + 15 + 12 + 8 + 12 = **97 focuses**.

## Spirits

Keys are local; compiled ids are `zin_zol_<key>`. The deathless line is `zin_zol_deathless_1` to `zin_zol_deathless_3`: a first spirit keyed `deathless` would equal the warfare sub-unit `zin_zol_deathless` (F3). Every modifier key is in the game's modifier documentation.

| key | name | modifiers | added / removed |
| --- | --- | --- | --- |
| `veiled_service` | Veiled Service | `political_power_factor` 0.1 | "A Concealed Allegiance"; permanent |
| `open_service` | Service Unhidden | `political_power_factor` 0.2 | "Service Without Shame"; permanent |
| `servants_at_war_spirit` | Servants at War | `army_org_factor` 0.1, `command_power_gain` 0.15 | "Servants at War"; removed at withdrawal |
| `faceless_seat` | A Seat Without a Face | `political_power_factor` 0.15, `drift_defence_factor` 0.5 | "A Seat Without a Face"; swapped by "The Seat Endures" |
| `faceless_seat_2` | The Seat Endures | `political_power_factor` 0.25, `drift_defence_factor` 1.0, `command_power_gain` 0.1 | "The Seat Endures"; permanent |
| `unpeopled_land` | The Unpeopled Land | `required_garrison_factor` −0.5, `resistance_damage_to_garrison` −0.5 | "The Unpeopled Land"; permanent |
| `black_hulls_spirit` | Black Hulls | `naval_invasion_capacity` 10, `naval_invasion_prep_speed` 0.25 | "Hulls Without Living Crews"; permanent |
| `landing_grounds_spirit` | Landing Grounds | `amphibious_invasion` 0.25, `naval_invasion_planning_bonus_speed` 0.25 | "Landing Grounds"; permanent |
| `out_of_the_isles_spirit` | Out of the Isles | `amphibious_invasion` 0.5, `army_attack_factor` 0.05 | timed 180 days |
| `through_the_straits` | Through Islands and Straits | `army_speed_factor` 0.1, `org_loss_when_moving` −0.2 | timed 180 days |
| `deathless_1` | The Deathless | `army_org_regain` 0.1, `land_reinforce_rate` 0.05, `experience_loss_factor` −0.25 | "Not as Elzon's Dead"; swapped |
| `deathless_2` | Shapes Broken, Not Ended | `army_org_regain` 0.2, `land_reinforce_rate` 0.1, `experience_loss_factor` −0.5, `army_defence_factor` 0.05 | "Shapes Broken, Not Ended"; swapped |
| `deathless_3` | Deathless Endurance | `army_org_regain` 0.3, `land_reinforce_rate` 0.15, `experience_loss_factor` −0.75, `army_defence_factor` 0.1, `army_morale_factor` 0.15 | "Deathless Endurance"; permanent |
| `no_hunger` | No Hunger, No Cold | `supply_consumption_factor` −0.3, `attrition` −0.3, `winter_attrition_factor` −0.5, `heat_attrition_factor` −0.25 | "No Hunger, No Cold"; permanent |
| `tireless` | The Tireless March | `org_loss_when_moving` −0.3, `army_speed_factor` 0.05 | "The Tireless March"; permanent |
| `great_host` | The Great Host | `army_attack_factor` 0.1, `breakthrough_factor` 0.1 | "The Great Host"; removed at withdrawal |
| `death_marches` | Death Marches South | `army_attack_factor` 0.1, `army_speed_factor` 0.05 | timed 365 days |
| `strike_while_they_sleep_spirit` | Strike While They Sleep | `army_attack_factor` 0.15, `breakthrough_factor` 0.1 | timed 180 days |
| `against_the_middle_kingdom` | Against the Middle Kingdom | `army_attack_factor` 0.1, `army_morale_factor` 0.1 | timed 365 days |
| `alone_against_all_spirit` | Alone Against All | `army_defence_factor` 0.1, `army_core_defence_factor` 0.1 | "Alone Against All"; permanent |
| `long_war` | The Long War of the Dead | `army_org_factor` 0.05, `land_reinforce_rate` 0.05 | "The Long War of the Dead"; removed at withdrawal |
| `patience` | The Patient Dark | `political_power_factor` 0.15, `drift_defence_factor` 0.5 | "The Patient Dark"; swapped |
| `patience_2` | A Presence Vast and Quiet | `political_power_factor` 0.3, `drift_defence_factor` 1.0, `max_command_power` 25 | "A Presence Vast and Quiet"; permanent |
| `presence_takes_form` | The Presence Takes Form | `army_attack_factor` 0.2, `breakthrough_factor` 0.15 | timed 42 days; removed at withdrawal |

The mechanic's own ideas (`zin_zol_without_a_body`, `zin_zol_the_dormancy`, `zin_zol_the_rising`, `zin_zol_form_taken`, `zin_zol_wounded`, `zin_zol_bane`, `zin_zol_forewarned`) are defined in the mechanic spec; their keys do not clash with the tree's.

## Events (namespace `zin_zol`)

Focus-fired only (no trigger, no mean time). Pictures are existing catalog keys (image-generated; no figure of Zol, no servant shown). `black_isles_lights` stands in where the wanted picture `mistake_wastes` (grey waste under a white sky, ungated) does not exist yet; the builder switches when it is generated.

| Key | Id | Title | Fired by | Picture | Text gist | Options |
| --- | --- | --- | --- | --- | --- | --- |
| `reluctance_of_gods` | `zin_zol.1` | The Reluctance of Gods | `reluctance_of_gods` | `black_isles_lights` | Some of the divine servants give less. No one can say why. | A "Press them." bond divine +1; call zin_zol_add_fading_pressure(0.01) (AI 70). B "Leave them their silence." power +2 (AI 30) |
| `older_than_kings` | `zin_zol.2` | Older Than Kings | `older_than_kings` | `black_isles_lights` | The north was old before the first crown of men. | A "The north remembers." (no further effect) |
| `the_wanderers` | `zin_zol.3` | Those Who Wander | `the_wandering_dead` | `grave_muster` | The dead walk the wastes. Whose they are is not known. | A "Let them wander." stability 0.02 (AI 60). B "Let the land keep them." power +2 (AI 40) |
| `first_host` | `zin_zol.4` | The First Host | `the_first_host` | `grave_muster` | Ranks stand in the black at Šodolôro, and do not tire. | A "Let them stand." |
| `old_roads` | `zin_zol.5` | The Old Roads of Power | `the_old_roads_of_power` | `black_isles_lights` | Paths long prepared lie open. How, and by whom, is not told. | A "Let them be kept." |
| `what_the_war_leaves` | `zin_zol.6` | What the War Leaves | `what_the_war_leaves` | `zol_rising` (gate `zin_zol_rising`; the focus needs it) | The war of the living has filled the fields with dead. The north is closer to them now. | A "So it gathers." |
| `a_greater_hour` | `zin_zol.7` | A Greater Hour | `a_greater_hour` | `black_isles_lights` | Not yet. Not for years. | A "We wait." |
| `unending_patience` | `zin_zol.8` | The Unending Patience | `the_unending_patience` | `black_isles_lights` | The north will not rise in this age unless it is struck. | A "Let the living have their age." |
| `wounded_not_slain` | `zin_zol.9` | Wounded, Not Slain | `wounded_not_slain` | `vast_shadow` (gate `zin_zol_manifested`; the focus needs `zin_zol_withdrawn`, which follows it) | He withdrew. He was wounded. He was not slain. | A "The dark is patient." |
| `another_age` | `zin_zol.10` | Matters for Another Age | `matters_for_another_age` | `black_isles_lights` | The age turns. The north is silent, and it waits. | A "Another age." |

Mechanic events (`zin_mistake.*`: rising, Volgan, manifestation, Lorien, withdrawal) are in the mechanic spec. The tree fires no `zin_mistake` event. It reaches the clash only through its own scripted effect `zin_zol_tree_clash` (below), which calls the mechanic's `zin_zol_strike_volgan`: a player Zol declares war on Volgan itself, and Volgan's pulse then sets `zin_volgan_zol_clash` (decisions F2 and O4; Volgan's `zin_dominion.13` stays the AI path).

## Historical AI route

Rule `zin_rule_dark_powers` = `HISTORICAL` (or `DEFAULT` following it) with `zin_rule_historical_path` = `HISTORICAL`; the tree reads the rules only through the mechanic's triggers `zin_zol_ai_route_appointed`, `_hastened` and `_patience` (R1). Dates are targets; the mechanic's catch-ups guarantee the flags.

| Phase | Window | Focuses in order | State at the end |
| --- | --- | --- | --- |
| 1. Silence | 1 Thaw 1748 – Rainwake 1750 | silence_of_the_north, the_seat_at_furviatlon, servants_unseen, the_black_islands, it_grows_each_day, the_great_who_serve, gods_who_serve, the_lesser_multitude, stirring_among_the_isles, let_them_talk, the_dead_of_zol, against_the_fading, held_and_spent | Power ≈ 42; 3 islands stir; bonds 2/3/2 |
| 2. Service | Rainwake 1750 – Thaw 1752 | a_seat_without_a_face, sodoloro, not_as_elzons_dead, the_outer_arc, old_strength_bent, labours_of_the_lesser, reluctance_of_gods (A), the_unanswering_magic, a_presence_deepened, orders_apart | Power ≈ 50; 5 islands; bonds 3/4/3 |
| 3. Preparation | Thaw 1752 – Sowing 1755 | a_concealed_allegiance, older_than_kings, the_appointed_hour, the_black_wastes, the_wandering_dead (A), the_seats_long_reach, the_island_hosts, black_hulls, hulls_without_living_crews, toward_the_straits, every_black_isle, the_unpeopled_land, the_seat_endures, the_old_roads_of_power, routes_beneath_the_isles, a_road_toward_the_south | Power ≈ 60; all islands stir; convergence 40; 4 hosts in the Mistake (decisions) |
| 4. The rising | 1 Sowing 1755 | The mechanic's decision `zin_zol_call_the_rising` ("The Dead Rise") on 1755.5.1 (then `the_dead_rise` is bypassed; the decision id differs from the focus id, F3); event "Whither the Dead" option A | `zin_zol_rising`; at war with Aenor and the Concord |
| 5. The war of the dead | Sowing 1755 – Rainwake 1757 | southward_to_aenor, the_weight_of_the_dead, two_darknesses_meet (A, war with Volgan), the_land_made_waste, when_hosts_are_broken, shapes_broken_not_ended, the_fallen_return, a_fraction_of_a_god, grave_arms, the_first_host, deathless_endurance | Hosts in the Middle Lands; convergence ≈ 85 |
| 6. The brief accord | after `zin_eindil_returned` (1757) | the_brief_accord, then Volgan's offer `zin_dominion.14`, which Zol accepts | `zin_black_compact` set; it ends (`zin_black_compact_ended`) when Volgan's body falls or Zol withdraws |
| 7. The form | within 7 days of `zin_volgan_body_destroyed` (1757) | Decision `zin_zol_come_forth`; the_presence_takes_form, the_cost_of_form | `zin_zol_manifested`; "One Finger"; Lorien rides; `zin_zol_withdrawn` in 1757 |
| 8. After | 1757 – 1760 | into_the_dark_again, wounded_not_slain, the_mistake_endures, the_long_war_of_the_dead (if still open, else skipped), the_gathered_hosts, matters_for_another_age (from 1760.3.1) | At peace; power ≈ 25 and growing; no war until 1770 |

The AI never takes `the_hastened_hour`, `the_long_patience`, `the_northern_shores`, `the_edge_of_the_woods`, `alone_against_all` or `service_without_shame` on this rule (weight 0 or ×0.2 as listed).

## Alternative routes

| Route | Choices | Result |
| --- | --- | --- |
| **The Hastened Hour** (rule `zin_rule_dark_powers` = `AGGRESSIVE`, or a player) | the_hastened_hour, the_dead_rise from 1 Thaw 1753, strike_while_they_sleep | Rising two years early with fewer hosts and more Fading pressure; the world meets the dead before Eindil returns. Not a great war at the start: the earliest date is five years in. |
| **The Long Patience → A Greater Hour** | the_long_patience, the_patient_dark, a_greater_hour, the_late_rising | No rising during the historical war; from 4A 1760 a stronger rising into a world worn out by the age. No manifestation unless the convergence is rebuilt. |
| **The Long Patience → The Unending Patience** (rule `zin_rule_dark_powers` = `RESTRAINED`, or a player) | the_unending_patience, a_presence_vast_and_quiet | Zol stays silent the whole game unless attacked; the War of the Last Crowns runs without his dead (the world systems spec must allow it). |
| **Northern shores / elven edge** | the_northern_shores or the_edge_of_the_woods, event "Whither the Dead" B or C | The dead strike Lerendor or a Magical Lands realm first. Gameplay only; not history. |
| **Alone Against All** | alone_against_all | No accord with Volgan; both dark powers fight each other until one is broken. |
| **Service Without Shame** | service_without_shame, let_them_talk | Faster growth, many rumours: forewarned countries resist the rising better. |
| **Keep the Isles Dark** | keep_the_isles_dark, a_concealed_allegiance | Slow waking, almost no rumours: the rising surprises everyone. |

## Implementation

### Files and builder

| Path | Written by | Content |
| --- | --- | --- |
| `docs/design/focus/zol.json` | authored data (source of truth) | This tree in the format of [../00_format_and_compiler.md](../00_format_and_compiler.md) |
| `common/national_focus/zin_zol.txt` | `tools/content/modules/focus_compiler.mjs` (new) | The compiled tree; `country = { factor = 0 modifier = { add = 10 original_tag = <Zol> } }`, the tag resolved from the name Zol at build time |
| `common/ideas/zin_focus_zol.txt` | focus compiler | The spirits above (`zin_zol_<key>`) |
| `events/zin_zol.txt` | focus compiler | Namespace `zin_zol`, the ten events above |
| `common/scripted_effects/zin_zol.txt` | focus compiler | The two tree-declared effects below |
| `localisation/english/zin_focus_zol_l_english.yml` | focus compiler | All text (UTF-8 with BOM; Windows-1252 characters only) |

The compiled tree replaces the interim "Long Peace" tree (`zin_long_peace_*`, written today by `tools/content/modules/vanilla_removal.mjs`) for Zol. The mechanic's files (`common/scripted_effects/zin_mistake.txt`, its triggers, ideas, dynamic modifiers, decisions, `events/zin_mistake.txt`, and `common/characters/zin_zol.txt` with the emblem leader and the numbered hosts) are written by the Zol's Mistake module of [../../04_mechanics/zols_mistake.md](../../04_mechanics/zols_mistake.md) (proposed `tools/content/modules/mech_zols_mistake.mjs`). This tree adds no character.

### Names the tree uses

| Name | Kind | Owner |
| --- | --- | --- |
| `zin_zol_add_bond_great` / `_lesser` / `_divine`, `zin_zol_add_mistake_power`, `zin_zol_add_convergence`, `zin_zol_add_growth_bonus`, `zin_zol_add_fading_pressure`, `zin_zol_add_return_rate`, `zin_zol_add_host_cap`, `zin_zol_add_convergence_rate`, `zin_zol_set_manifest_cost`, `zin_zol_wake_island`, `zin_zol_raise_host`, `zin_zol_harden_wastes`, `zin_zol_spread_deathfield`, `zin_zol_wargoal_elven_edge`, `zin_zol_rise`, `zin_zol_shorten_wound` | scripted effects (`call`) | Zol's Mistake |
| `zin_zol_can_rise` | scripted trigger (`check`) | Zol's Mistake |
| `zin_war_feed_deathless` | scripted effect: adds `zin_mistake_power` × 25 deathless bonds (capped before the rising) | warfare ([../../03_gameplay/01_warfare.md](../../03_gameplay/01_warfare.md)) |
| `zin_world_add_gathering_dark` | scripted effect | world systems |
| `zin_mistake_power`, `zin_zol_convergence` | variables (conditions) | contract; Zol's Mistake |
| `zin_zol_calls_open`, `zin_zol_tending`, `zin_zol_veiled`, `zin_zol_bonds_steadfast`, `zin_zol_expressions_open`, `zin_zol_route_appointed`, `zin_zol_route_hastened`, `zin_zol_route_patience`, `zin_zol_muster_sodoloro`, `zin_zol_isles_loud`, `zin_zol_isles_dark`, `zin_zol_muster_islands`, `zin_zol_hosts_open`, `zin_zol_knows_bane`, `zin_zol_unwatched`, `zin_zol_greater_hour`, `zin_zol_unending`, `zin_zol_breaking_attuned`, `zin_zol_manifest_open`, `zin_zol_second_stirring_open` | country flags set by this tree, read by the mechanic | the mechanic's flag table |
| `zin_zol_accord_sought` | country flag set by *The Brief Accord*: Zol's AI accepts Volgan's `zin_dominion.14` while it is set, and Volgan's AI raises its focus *The Black Compact* ×5 (proposed; read by the Zol's Mistake and Volgan specs) | this tree |
| `zin_zol_rising`, `zin_zol_manifested`, `zin_zol_withdrawn`, `zin_volgan_marches`, `zin_volgan_body_destroyed`, `zin_eindil_returned` | global flags (conditions) | shared contract |
| `zin_black_compact` | global flag set when Zol accepts Volgan's `zin_dominion.14` (decisions N2 and O4) | Volgan; Zol's Mistake |
| `zin_volgan_zol_clash` | global flag set by the clash (O4) | Volgan |
| `zin_is_site_ocean_of_zol_island` | state trigger (`@ocean_of_zol_island`) | key sites, Zol's Mistake |

### Tree-declared scripted effects (`common/scripted_effects/zin_zol.txt`)

| Effect | Does |
| --- | --- |
| `zin_zol_tree_clash` | If Volgan exists, is not at war with Zol and `zin_volgan_zol_clash` is not set: `zin_zol_strike_volgan` (Zol's mechanic: war goal on a bordering Volgan state, then `declare_war_on`). Volgan's `zin_dominion.13` stays the one clash event of decision O4 for the AI path |

### Compiler notes

- `call` arguments are passed as temporary variables (`value`, `count`, `days`), as the mechanic spec says; `count all` passes `-1`.
- "available `zin_mistake_power` ≥ 40" compiles to `{ "variable": { "name": "zin_mistake_power", "above": 39 } }`; "`zin_zol_convergence` ≥ 60" likewise.
- "if not at_war_with X" compiles to `{ "if": { "limit": [ { "not": [ { "at_war_with": "X" } ] } ], "then": [ … ] } }`; "after 1760.3.1" to `{ "after": "1760.3.1" }`.
- Route weights compile to `ai` modifiers on the mechanic's triggers `zin_zol_ai_route_*`, which alone read `zin_rule_dark_powers` (R1); "HISTORICAL: 0; FREE: n" weights elsewhere compile to factor 0 under `zin_rules_is_historical`.
- "building bunker 2 @ocean_of_zol_island, three times" is three `building` effects with `where` = the site key; each picks a different owned island state.
- Raw blocks: none.

### Icons

Every key is from the icon catalog ([../02_icon_catalog.md](../02_icon_catalog.md)); the sprites `GFX_focus_zin_<key>` and `GFX_idea_zin_<key>` exist in game today. No icon shows Zol, a servant or a keeper of the seat. Spirits use the icon of the focus that adds them.

| Branch | Focus → icon |
| --- | --- |
| A | servants_unseen `zol_sigil`; the_great_who_serve `order_great`; the_lesser_multitude `order_lesser`; gods_who_serve `order_divine`; old_strength_bent `order_great`; labours_of_the_lesser `order_lesser`; reluctance_of_gods `new_gods_light`; the_tending `ward_circle`; orders_apart `rune_stone`; the_divine_keep_silence `order_divine`; a_concealed_allegiance `scroll_sealed`; service_without_shame `banner_black`; the_great_bear_the_weight `order_great`; when_servants_falter `glyph_fading`; service_without_end `rune_stone`; the_whole_service `zol_sigil`; servants_at_war `dead_ranks_far` |
| B | silence_of_the_north `ashen_waste`; it_grows_each_day `zol_sigil`; against_the_fading `glyph_fading`; held_and_spent `ward_circle`; the_unanswering_magic `staff_arcane`; a_presence_deepened `zol_sigil`; older_than_kings `dead_crown`; the_appointed_hour `banner_black`; the_hastened_hour `bones_risen`; the_long_patience `ice_field` |
| C | the_seat_at_furviatlon `empty_throne`; a_seat_without_a_face `silent_throne`; sodoloro `ashen_waste`; the_black_wastes `ashen_waste`; the_wandering_dead `grave_field`; the_seats_long_reach `map_unrolled`; the_unpeopled_land `ice_field`; sodoloro_stirs `bones_risen`; the_seat_endures `fort_wall` |
| D | the_black_islands `black_isles`; stirring_among_the_isles `black_isles`; black_hulls `black_hulls`; let_them_talk `fishing_boats`; keep_the_isles_dark `storm_sea`; the_outer_arc `sea_charts`; hulls_without_living_crews `black_hulls`; the_island_hosts `dead_ranks_far`; toward_the_straits `strait_chain`; every_black_isle `black_isles`; landing_grounds `anchor_rope`; the_black_fleet `black_hulls`; out_of_the_isles `bones_risen`; through_islands_and_straits `strait_chain` |
| E | the_dead_of_zol `grave_host`; not_as_elzons_dead `grave_field`; the_fallen_return `bones_risen`; shapes_broken_not_ended `dead_ranks_far`; no_hunger_no_cold `ice_field`; grave_arms `forge_anvil`; the_first_host `dead_ranks_far`; the_grave_march `footprints_snow`; deathless_endurance `grave_host`; the_tireless_march `war_drums`; the_gathered_hosts `levy_muster`; what_can_end_them `potent_blade`; the_dead_rise_armed `bones_risen`; the_great_host `dead_ranks_far`; death_marches_south `banner_black` |
| F | the_dead_rise `bones_risen`; strike_while_they_sleep `storm_sea`; southward_to_aenor `war_council_map`; the_northern_shores `lighthouse`; the_edge_of_the_woods `forest_ancient`; two_darknesses_meet `ember_desert`; the_land_made_waste `ashen_waste`; the_brief_accord `black_compact`; alone_against_all `banner_black`; the_isles_hold `fort_wall`; the_long_war_of_the_dead `grave_field`; what_the_war_leaves `grave_field` |
| G | the_patient_dark `ice_field`; watch_from_the_north `eye_watchful`; the_unwatched_north `snow_peak`; deeper_service `zol_sigil`; a_greater_hour `rune_stone`; the_unending_patience `ice_cavern`; the_late_rising `bones_risen`; a_presence_vast_and_quiet `zol_sigil` |
| H | the_old_roads_of_power `rune_stone`; routes_beneath_the_isles `black_isles`; a_road_toward_the_south `map_unrolled`; the_weight_of_the_dead `grave_host`; when_hosts_are_broken `ward_circle`; a_fraction_of_a_god `zol_sigil`; the_cost_of_form `glyph_fading`; the_presence_takes_form `zol_sigil`; into_the_dark_again `ashen_waste`; wounded_not_slain `potent_blade`; the_mistake_endures `fort_wall`; matters_for_another_age `book_lore` |

## AI

Weights are in the tables. General rules:

- Before the rising, focuses with `available` rising are never picked; the AI fills time with branches A–E in the phase order above.
- Weights marked "if rising" multiply only after `zin_zol_rising`.
- After withdrawal, branches E and F war focuses get factor 0 until 1770.
- On rule FREE the AI picks the route by weights 10 / 5 / 5 (appointed, hastened, patience).

## Acceptance

Build checks (focus compiler and `npm test` in `tools/`):

1. `zol.json` compiles: 97 focuses, unique keys, unique positions in columns 0–27 and rows 0–15, every prerequisite and exclusive exists, every focus sits below its prerequisites, the three route focuses and the two pairs (`a_concealed_allegiance`/`service_without_shame`, `let_them_talk`/`keep_the_isles_dark`, `the_brief_accord`/`alone_against_all`, `a_greater_hour`/`the_unending_patience`) are mutually exclusive both ways, every `days` is a multiple of 7.
2. Every icon is a catalog key, every event picture a picture key; `vast_shadow` and `zol_rising` are used only by events whose focuses require their gate flags.
3. Every spirit modifier is in the 1.19.3 modifier documentation; every `call` and `check` resolves to the mechanic's, the warfare spec's, the world-systems spec's or this tree's scripted effects and triggers; no `raw` block.
4. Offline scan: no focus reachable without `zin_zol_rising` contains a `wargoal` or war effect; the earliest a route can set `zin_zol_rising` is 1 Thaw 4A 1753 (Hastened Hour).
5. Text scan: no focus, spirit or event text names a servant, a keeper of Furviatlon, Afrit, or (before `zin_eindil_returned`) Eindil; no game text contains ō (Šodolôro only); the compiler's secret check passes.
6. Zol's compiled tree and its events recruit no character; Zol's characters file (mechanic) holds only `zin_zol_will` and numbered hosts.
7. HOI4 Agent Tools focus inspector reports no errors; the focus renderer's review image shows eight readable branches.

Isolated Linux run:

8. One in-game year from 1 Thaw 4A 1748 (phase 3 rule): Zol uses this tree (not `zin_long_peace_*`), takes `silence_of_the_north` first, declares no war and gains no wargoal; `error.log` has no line from `zin_zol` files.
9. Historical observer run to 4A 1760 (PROGRAM observer run): Zol takes the Appointed Hour, rises in 4A 1755, takes the Brief Accord after `zin_eindil_returned` (`zin_black_compact` set), manifests and withdraws in 4A 1757, and takes Into the Dark Again.
10. Player route tests (console-driven in the Linux run, `zin_rule_dark_powers` set): Hastened Hour rises in 4A 1753; A Greater Hour rises from 4A 1760; The Unending Patience never sets `zin_zol_rising` without an attack on Zol.

## Open questions

Each proceeds on the proposal written into the design above; the owner's questions are gathered in [../../OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md), section "zol".

1. Tone: a cold, non-human tree with no court and numbered hosts. **Proceeds on:** decision S4 (emblem leader, numbered hosts); owner question "zol" 2.
2. Targets other than Aenor (the northern shores, the elven edge). **Proceeds on:** both kept as non-historical routes with AI weight 0 on the historical rule; owner question "zol" 3.
3. "The Unending Patience" as a player route against established history. **Proceeds on:** kept as a player route and the AI route under `zin_rule_dark_powers` = `RESTRAINED`, never the AI default; owner question "zol" 8.
4. "Service Without Shame" (non-canon idea-bank hook). **Proceeds on:** kept as a choice that states nothing about any servant's identity; owner question "zol" 9.
5. The "routes of power" of the Convergence branch (proposed chronicle explanation). **Proceeds on:** adopted, labelled proposed; owner question "zol" 10.
