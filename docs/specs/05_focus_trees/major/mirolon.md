# Mirolon focus tree

**Status:** Draft. **Priority:** 4. **Phase:** 4.

## Purpose

Mirolon is the free human realm of lakes, forests and coast that stands between Volgan's Dead Lands and the Middle Lands. Volgan conquered it in the First Age; it is free again, and it is the only power in 4A 1748 that takes his return seriously. Its tree is about watching, proving and preparing: scouting the Dead Lands, building the forts on the passes, warning courts that laugh, and finding friends. When the storm comes, Mirolon chooses between a last stand and a court in exile, and after Volgan's body breaks it can rise again.

Tree id `mirolon`; country Mirolon (tier A, [01_tiers_and_coverage.md](../01_tiers_and_coverage.md)). 83 focuses. Mechanic: [Volgan and the Southern Dominion](../../04_mechanics/volgan_southern_dominion.md) (Mirolon's proof and passes). Data format: [00_format_and_compiler.md](../00_format_and_compiler.md).

## Lore basis

**Established:** Mirolon lies in the Dead Lands and opposes Volgan (working table). Volgan invaded Mirolon in the latter First Age and made it the opening of his campaign against Aenor. In the Fourth Age he retakes Mirolon and marches north. Mirolon's political status differs between ages. The Grand Alliance of King Edran defeated Volgan at Dardan; its follow-up invasion of the Dead Lands failed against Elzon, and the elves blamed Aenor's king for their dead. The Elven Refusal still stands.

**Proposed (vault, *Fourth Age Chronology*):** Mirolon fortified its passes about 4A 1650; its envoy was laughed out of Parim in 4A 1736; at the start only Mirolon's scouts take the signs seriously; "if Mirolon holds the passes, Volgan's march north is delayed or broken" is one of the places where history can turn.

**Proposed (this spec):** every focus, spirit, event and number; Mirolon as an elective warden-realm whose High Warden is chosen for life by the pass-lords and the lake towns (it fits the map's Light ideology and `zin_light_wardens` stance and the vault's "human kingdom"); High Warden Maeric, Captain Selda Varrow and Scout-Master Hadric Thorne; the Warden League; the exile court; Mirolon's return after the body breaks.

**Kept open:** the place of Dardan, the King of Demons, what remains of Volgan. Mirolon's texts speak of "the fields where the First Age died" and never place Dardan. "Mirolon Rises Again" says the master of Nafeher has fallen, not that he is dead.

## Design

### Shape

| Columns | Branch | Opens | Drives |
| --- | --- | --- | --- |
| 0–4 | Lake and Coast (economy) | Start | Industry, supply |
| 5–7 | The Watch on the Passes | Start | `zin_mirolon_proof`, Volgan's veil |
| 9–10 | The Memory of the First Conquest | Start | War support, resistance |
| 11–15 | The Wardens' Hall (government) | Start | Stability, PP, the elective choice |
| 16–18 | Stone on the Passes | Start | `zin_mirolon_passes`, forts |
| 21–25 | Voices to the North (diplomacy) | Start | Allies: Herez, the Lost Cause, the Warden League, Gala |
| 5–9, rows 6–10 | The Army of the Passes | Hall or Memory | Army |
| 11–15, rows 7–12 | The Storm Comes (war) | At war with Volgan | Last stand or exile |
| 12–14, rows 13–16 | Mirolon Rises Again | `zin_volgan_body_destroyed` | Return |

The grid is 26 columns wide (x 0 to 25) and 17 rows deep (y 0 to 16).

### The peaceful start

Nothing in rows 0 to 6 is a war. Mirolon scouts, builds, argues in the Wardens' Hall and sends envoys. Only "The Storm Comes" branch is military in the strict sense, and it needs Volgan to be at war with Mirolon. "Carry the War South" is the only focus that can make Mirolon the attacker, and it needs Volgan's body to be destroyed first.

### Notation

As in the [Volgan tree](volgan.md): "a and b" means both, "a or b" either. "Proof" is `zin_mirolon_add_proof`; "passes" is `zin_mirolon_add_passes`; "veil" is `zin_volgan_add_veil` run in Volgan's scope (`for_country Volgan`). Spirit keys compile to `zin_mirolon_<key>`; events to `zin_mirolon.<n>`. AI is the base weight.

### Branch 1: Lake and Coast

**Purpose:** a small realm's economy: fisheries, harbours, timber, arms and granaries for a siege. **Opens:** at the start. **Mechanic:** industry; the exclusive choice between loans from Parim's bankers (more factories now, a lasting consumer-goods burden and a tie to the Golden Court) and Mirolon's own coin (slower, independent).

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `lake_and_coast` | Lake and Coast | — | — | 2,0 | 70 | building industrial_complex 1 capital; political_power 25 | 20 |
| `lake_fisheries` | The Lake Fisheries | lake_and_coast | — | 1,1 | 35 | add_spirit lake_fisheries | 10 |
| `coast_harbours` | Harbours of the Coast | lake_and_coast | — | 3,1 | 35 | building naval_base 2 random_coastal; building dockyard 1 random_coastal | 8 |
| `storm_pilots` | Storm Pilots | lake_fisheries | — | 0,2 | 35 | navy_experience 10; research naval bonus 0.5 uses 1 | 5 |
| `trade_with_the_north` | Trade with the North | lake_fisheries and coast_harbours | — | 2,2 | 35 | building industrial_complex 1 random_owned; political_power 25 | 10 |
| `coastal_watch_towers` | Coastal Watch-Towers | coast_harbours | — | 4,2 | 35 | building coastal_bunker 2 random_coastal; proof +2 | 8 |
| `forest_timber` | Timber of the Forests | trade_with_the_north | — | 1,3 | 35 | building industrial_complex 1 random_owned | 10 |
| `arms_of_the_lake` | Arms of the Lake Towns | trade_with_the_north and coastal_watch_towers | — | 3,3 | 35 | building arms_factory 1 capital | 12 |
| `siege_granaries` | Granaries Against the Siege | forest_timber and arms_of_the_lake | — | 2,4 | 35 | add_spirit siege_granaries | 12 |
| `parim_bankers` | Loans from Parim's Bankers | siege_granaries | own_coin | 1,5 | 35 | building industrial_complex 1 random_owned (twice); add_spirit parim_debts | 30 |
| `own_coin` | Mirolon's Own Coin | siege_granaries | parim_bankers | 3,5 | 35 | add_spirit own_coin | 70 |
| `war_footing` | A Realm on War Footing | parim_bankers or own_coin | — | 2,6 | 70 | building arms_factory 2 capital | 15 |

### Branch 2: The Watch on the Passes

**Purpose:** Mirolon's scouts and the evidence they gather. **Opens:** at the start. **Mechanic:** `zin_mirolon_proof` and Volgan's `zin_volgan_veil`; opens the scouting decisions (flag `zin_mirolon_watch_open`); sends Mirolon's warnings to Parim (`zin_dominion.5`). "Proof No Court Can Laugh At" needs proof ≥ 60.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `watch_on_the_passes` | The Watch on the Passes | — | — | 6,0 | 35 | flag zin_mirolon_watch_open; proof +3 | 60 |
| `scouts_beyond_the_heat` | Scouts Beyond the Heat | watch_on_the_passes | — | 5,1 | 35 | proof +5; for_country Volgan: veil −3 | 20 |
| `counting_the_fires` | Counting the Fires | watch_on_the_passes | — | 7,1 | 35 | proof +5; army_experience 5 | 15 |
| `scout_masters_school` | The Scout-Master's School | scouts_beyond_the_heat | — | 5,2 | 35 | raw: `recruit_character = zin_mirolon_hadric`; proof +3 | 15 |
| `signs_at_the_grave_fields` | Signs at the Grave-Fields | counting_the_fires | — | 7,2 | 35 | event grave_signs (zin_mirolon.2) | 15 |
| `ledger_of_warnings` | The Ledger of Warnings | scout_masters_school and signs_at_the_grave_fields | — | 6,3 | 70 | proof +10; event_for Aenor (zin_dominion.5) | 20 |
| `deep_patrols` | Deep Patrols | ledger_of_warnings | — | 5,4 | 35 | add_spirit deep_patrols; proof +5; for_country Volgan: veil −5 | 15 |
| `proof_no_court_can_laugh_at` | Proof No Court Can Laugh At | ledger_of_warnings | — | 7,4 | 70 | available: variable zin_mirolon_proof above 59; proof +15; remove_spirit unheeded_warnings; event_for Aenor (zin_dominion.5) | 50 (hist ×0) |
| `watch_never_sleeps` | The Watch Never Sleeps | deep_patrols or proof_no_court_can_laugh_at | — | 6,5 | 35 | add_spirit watch_never_sleeps | 12 |

### Branch 3: The Memory of the First Conquest

**Purpose:** Mirolon remembers being Volgan's first conquest; the memory hardens its people and its resistance. **Opens:** at the start. **Mechanic:** war support; resistance if occupied; makes the appeal to Gala more likely (flag `zin_mirolon_elves_remember`). Text never places Dardan.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `memory_of_the_first_conquest` | The Memory of the First Conquest | — | — | 9,0 | 35 | event archives (zin_mirolon.8); war_support 0.05 | 15 |
| `chronicles_of_the_alliance` | Chronicles of the Grand Alliance | memory_of_the_first_conquest | — | 9,1 | 35 | research land_doctrine bonus 0.5 uses 1 | 10 |
| `songs_of_the_occupied_years` | Songs of the Occupied Years | chronicles_of_the_alliance | — | 10,2 | 35 | stability 0.05; add_spirit occupied_years_remembered | 12 |
| `never_again` | Never Again | songs_of_the_occupied_years | — | 9,3 | 35 | war_support 0.1; army_experience 10 | 12 |
| `what_the_elves_remember` | What the Elves Remember | never_again | — | 10,4 | 35 | flag zin_mirolon_elves_remember; political_power 25 | 8 |

### Branch 4: The Wardens' Hall

**Purpose:** Mirolon's government: the High Warden, the pass-lords and the lake towns. **Opens:** at the start. **Mechanic:** stability and PP; the exclusive choice between a stronger elective crown (PP, war support) and a stronger assembly (stability).

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `wardens_hall` | The Wardens' Hall | — | — | 13,0 | 70 | political_power 75; stability 0.05 | 100 |
| `high_wardens_council` | The High Warden's Council | wardens_hall | — | 12,1 | 35 | event wardens_council (zin_mirolon.1); political_power 50 | 20 |
| `charter_of_the_lake_towns` | Charter of the Lake Towns | wardens_hall | — | 14,1 | 35 | add_spirit lake_charter | 15 |
| `seats_for_pass_lords` | Seats for the Pass-Lords | high_wardens_council | — | 11,2 | 35 | war_support 0.05; passes +5 | 15 |
| `the_wardens_law` | The Wardens' Law | high_wardens_council and charter_of_the_lake_towns | — | 13,2 | 35 | popularity light 0.05; stability 0.05 | 12 |
| `open_the_muster_rolls` | Open the Muster Rolls | charter_of_the_lake_towns | — | 15,2 | 35 | manpower 3000 | 12 |
| `elective_crown` | The Elective Crown | seats_for_pass_lords and the_wardens_law | warden_assembly | 12,3 | 70 | add_spirit warden_kingship | 60 |
| `warden_assembly` | The Assembly of Wardens | the_wardens_law and open_the_muster_rolls | elective_crown | 14,3 | 70 | add_spirit warden_assembly | 40 |
| `one_realm_one_watch` | One Realm, One Watch | elective_crown or warden_assembly | — | 13,4 | 35 | political_power 100; proof +5 | 20 |
| `mirolon_forests` | The Mirolon Forests | one_realm_one_watch | — | 12,5 | 35 | add_spirit forest_rangers | 12 |
| `last_free_realm` | The Last Free Realm of the South | one_realm_one_watch | — | 14,5 | 35 | war_support 0.1; political_power 25 | 12 |

### Branch 5: Stone on the Passes

**Purpose:** the forts that Volgan must break. **Opens:** at the start. **Mechanic:** `zin_mirolon_passes` (fort levels in pass states through `zin_mirolon_raise_pass_forts`); with passes ≥ 60, Mirolon cannot be caught unready; with passes ≥ 80 and proof ≥ 50 it gets "Hold the Passes" at war.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `stone_on_the_passes` | Stone on the Passes | — | — | 17,0 | 70 | passes +10 | 60 |
| `quarry_roads` | Quarry Roads | stone_on_the_passes | — | 16,1 | 35 | building infrastructure 1 at site mirolon_passes | 15 |
| `masons_guild` | The Masons' Guild | stone_on_the_passes | — | 18,1 | 35 | add_spirit masons_guild | 15 |
| `the_first_gate` | The First Gate | quarry_roads | — | 16,2 | 35 | passes +10 | 20 |
| `signal_towers` | Signal Towers | masons_guild | — | 18,2 | 35 | passes +5; proof +3 | 15 |
| `the_second_gate` | The Second Gate | the_first_gate and signal_towers | — | 17,3 | 70 | passes +15 | 20 |
| `fallback_lines` | Sunken Roads and Fallback Lines | the_second_gate | — | 16,4 | 35 | building bunker 1 capital; add_spirit fallback_lines | 12 |
| `the_iron_gate` | The Iron Gate | the_second_gate | — | 18,4 | 70 | available: variable zin_mirolon_passes above 49; passes +15 | 20 |
| `passes_are_shut` | The Passes Are Shut | fallback_lines and the_iron_gate | — | 17,5 | 35 | available: variable zin_mirolon_passes above 69; add_spirit passes_shut | 20 |

### Branch 6: Voices to the North

**Purpose:** find friends before the storm. **Opens:** at the start. **Mechanic:** events to Aenor, Herez, the free Dead Lands realms and the Gala Elves. "Ask the Lost Cause" and "The Warden League" are mutually exclusive: shelter under Aenor's league (if Parim will have Mirolon) or lead a league of the free south. A Wall of Realms needs either road.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `voices_to_the_north` | Voices to the North | — | — | 23,0 | 35 | political_power 25 | 30 |
| `envoy_to_parim` | An Envoy to Parim | voices_to_the_north | — | 21,1 | 35 | event_for Aenor (zin_dominion.5) | 30 |
| `friendship_with_herez` | Friendship with Herez | voices_to_the_north | — | 23,1 | 35 | event_for Herez herez_friendship (zin_mirolon.3) | 20 |
| `free_realms_of_the_dead_lands` | Free Realms of the Dead Lands | voices_to_the_north | — | 25,1 | 35 | event_for Olen, Luminor, Gelon, Mencnon, Bennen, Dra, Mirodor and Nan: league_invite (zin_mirolon.4) | 20 |
| `ask_the_lost_cause` | Ask the Lost Cause | envoy_to_parim | warden_league | 21,2 | 35 | event_for Aenor lost_cause_request (zin_mirolon.6) | 50, ×0.1 with flag zin_mirolon_parim_laughed |
| `southern_marches_pact` | The Southern Marches Pact | friendship_with_herez | — | 23,2 | 35 | available: flag zin_mirolon_herez_friend; event_for Herez marches_pact (zin_mirolon.5) | 15 |
| `warden_league` | The Warden League | free_realms_of_the_dead_lands | ask_the_lost_cause | 25,2 | 35 | faction "The Warden League"; invite every country with flag zin_mirolon_league_friend | 50 |
| `through_the_concord_doors` | Through the Concord's Doors | ask_the_lost_cause | — | 21,3 | 35 | available: flag zin_mirolon_lost_cause_friend; add_spirit concord_backing; equipment infantry_equipment 1000 | 20 |
| `appeal_to_gala` | An Appeal to Gala | southern_marches_pact | — | 23,3 | 35 | event_for Gala Elves appeal_to_gala (zin_mirolon.7) | 10 |
| `league_musters` | The League Musters | warden_league | — | 25,3 | 35 | add_spirit league_musters | 15 |
| `a_wall_of_realms` | A Wall of Realms | through_the_concord_doors or league_musters | — | 23,4 | 35 | war_support 0.1; proof +5 | 15 |
| `the_north_listens` | The North Listens | a_wall_of_realms | — | 23,5 | 35 | available: variable zin_mirolon_proof above 74; call zin_world_add_gathering_dark (3); every member of Aenor's faction: opinion of Mirolon +15; event_for Aenor (zin_dominion.5) with the guarantee option's AI weight ×3 | 20 |

### Branch 7: The Army of the Passes

**Purpose:** a small, defensive army that knows its ground. **Opens:** "One Realm, One Watch" or "Never Again". **Mechanic:** defensive doctrine, recruitment, two named leaders. "Every Hand a Warden" needs war with Volgan or proof ≥ 50.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `army_of_the_passes` | The Army of the Passes | one_realm_one_watch or never_again | — | 7,6 | 35 | army_experience 15 | 20 |
| `pass_warden_companies` | Pass Warden Companies | army_of_the_passes | — | 6,7 | 35 | manpower 4000; equipment infantry_equipment 500 | 15 |
| `levies_of_the_lake_towns` | Levies of the Lake Towns | army_of_the_passes | — | 8,7 | 35 | add_spirit lake_levies | 12 |
| `doctrine_of_the_narrows` | Doctrine of the Narrows | pass_warden_companies | — | 5,8 | 35 | research land_doctrine bonus 0.5 uses 2; add_spirit narrows_doctrine | 15 |
| `rangers_of_the_forests` | Rangers of the Forests | pass_warden_companies and levies_of_the_lake_towns | — | 7,8 | 35 | army_experience 15; manpower 2000 | 12 |
| `fire_against_the_dead` | Fire Against the Dead | levies_of_the_lake_towns | — | 9,8 | 35 | research artillery bonus 0.5 uses 1; add_spirit fire_against_dead | 12 |
| `captain_of_the_passes` | The Captain of the Passes | doctrine_of_the_narrows and rangers_of_the_forests | — | 6,9 | 35 | raw: `recruit_character = zin_mirolon_selda`; army_experience 10 | 15 |
| `arms_from_the_lake_forges` | Arms from the Lake Forges | rangers_of_the_forests and fire_against_the_dead | — | 8,9 | 35 | equipment infantry_equipment 1000 | 12 |
| `every_hand_a_warden` | Every Hand a Warden | captain_of_the_passes and arms_from_the_lake_forges | — | 7,10 | 70 | available: at_war_with Volgan or variable zin_mirolon_proof above 49; add_spirit every_hand | 20 |

### Branch 8: The Storm Comes

**Purpose:** fight the reconquest. **Opens:** a root with no prerequisite that is available only while Mirolon is at war with Volgan. **Mechanic:** the exclusive choice between "The Last Stand at the Passes" (strong defence, no exile) and "The Exile Court" (flag `zin_mirolon_exile_ready`: on capitulation Mirolon becomes a government in exile in Herez, Aenor or Gala); holding the passes for a year (`zin_mirolon_holds`); resistance under occupation.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_storm_comes` | The Storm Comes | — | — | 13,7 | 14 | available: at_war_with Volgan; war_support 0.15; event storm_comes (zin_mirolon.10) | 500 |
| `last_stand_at_the_passes` | The Last Stand at the Passes | the_storm_comes | the_exile_court | 12,8 | 14 | add_spirit last_stand | 50 if proof ≥ 50; hist ×0 |
| `the_exile_court` | The Exile Court | the_storm_comes | last_stand_at_the_passes | 14,8 | 14 | flag zin_mirolon_exile_ready; manpower 5000 | 50 if proof < 50; hist 100 |
| `burn_the_bridges` | Burn the Bridges | last_stand_at_the_passes | — | 11,9 | 14 | call zin_mirolon_scorch | 50 |
| `hold_every_stone` | Hold Every Stone | last_stand_at_the_passes or the_exile_court | — | 13,9 | 21 | timed_spirit hold_every_stone 180 | 100 |
| `evacuate_the_lake_towns` | Evacuate the Lake Towns | the_exile_court | — | 15,9 | 21 | manpower 10000; flag zin_mirolon_evacuated | 80 |
| `the_passes_held` | The Passes Held | burn_the_bridges and hold_every_stone | — | 12,10 | 35 | available: flag zin_mirolon_holds; add_spirit pride_of_the_passes; event passes_held (zin_mirolon.9) | 100 |
| `the_court_abroad` | The Court Abroad | evacuate_the_lake_towns | — | 15,10 | 35 | available: raw `is_government_in_exile = yes`; political_power 50; manpower 5000 | 100 |
| `the_hidden_mirolon` | The Hidden Mirolon | hold_every_stone or the_court_abroad | — | 14,11 | 35 | available: check zin_mirolon_occupied; call zin_mirolon_raise_resistance | 60 |
| `hope_from_the_north` | Hope from the North | the_passes_held or the_hidden_mirolon | — | 13,12 | 35 | available: global_flag zin_eindil_returned or global_flag zin_volgan_body_destroyed; war_support 0.1; army_experience 20 | 60 |

### Branch 9: Mirolon Rises Again

**Purpose:** return home when Volgan's body is broken, and decide what Mirolon becomes. **Opens:** "Hope from the North" and `zin_volgan_body_destroyed`. **Mechanic:** `zin_mirolon_restore` (asks the Steward to let Mirolon go, or gives Mirolon a war goal for its cores); the exclusive choice between carrying the war into the Dead Lands, as Edran's host once did and failed, and keeping a watch for the ages.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `mirolon_rises_again` | Mirolon Rises Again | hope_from_the_north | — | 13,13 | 35 | available: global_flag zin_volgan_body_destroyed; call zin_mirolon_restore; event mirolon_rises (zin_mirolon.11) | 500 |
| `rebuild_the_gates` | Rebuild the Gates | mirolon_rises_again | — | 12,14 | 35 | passes +20; building bunker 2 at site mirolon_passes | 50 |
| `bury_the_dead_of_two_ages` | Bury the Dead of Two Ages | mirolon_rises_again | — | 14,14 | 35 | stability 0.15 | 50 |
| `carry_the_war_south` | Carry the War South | rebuild_the_gates | a_watch_for_the_ages | 12,15 | 35 | event carry_war_south (zin_mirolon.12) | 10 |
| `a_watch_for_the_ages` | A Watch for the Ages | bury_the_dead_of_two_ages | carry_the_war_south | 14,15 | 35 | add_spirit watch_for_ages | 90 |
| `the_free_south` | The Free South | carry_the_war_south or a_watch_for_the_ages | — | 13,16 | 70 | political_power 100; stability 0.1; flag zin_mirolon_free_south | 50 |

### Count

| Branch | Focuses |
| --- | ---: |
| Lake and Coast | 12 |
| The Watch on the Passes | 9 |
| The Memory of the First Conquest | 5 |
| The Wardens' Hall | 11 |
| Stone on the Passes | 9 |
| Voices to the North | 12 |
| The Army of the Passes | 9 |
| The Storm Comes | 10 |
| Mirolon Rises Again | 6 |
| **Total** | **83** |

## Spirits

Keys compile to `zin_mirolon_<key>`. Mechanic spirits that reach Mirolon (`zin_dominion_caught_unready`, `zin_dominion_forewarned`, `zin_dominion_hold_the_passes`, `zin_dominion_heeded_warning`) are in the mechanic spec.

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `long_watch` | The Long Watch | `recon_factor` 0.1, `army_defence_factor` 0.05 | Start (history); permanent |
| `unheeded_warnings` | Unheeded Warnings | `political_power_gain` −0.1 | Start; removed by "Proof No Court Can Laugh At" or the mechanic at proof 75 |
| `lake_fisheries` | The Lake Fisheries | `monthly_population` 0.1, `stability_factor` 0.03 | "The Lake Fisheries" |
| `siege_granaries` | Granaries Against the Siege | `supply_consumption_factor` −0.1, `stability_factor` 0.03 | "Granaries Against the Siege" |
| `parim_debts` | Debts in Parim | `consumer_goods_factor` 0.03 | "Loans from Parim's Bankers"; permanent |
| `own_coin` | Mirolon's Own Coin | `political_power_gain` 0.05, `production_speed_buildings_factor` 0.05 | "Mirolon's Own Coin" |
| `deep_patrols` | Deep Patrols | `recon_factor` 0.05, `enemy_operative_detection_chance_factor` 0.15 | "Deep Patrols" |
| `watch_never_sleeps` | The Watch Never Sleeps | `recon_factor` 0.15, `land_night_attack` 0.1 | "The Watch Never Sleeps" |
| `occupied_years_remembered` | The Occupied Years Remembered | `war_support_factor` 0.1, `boost_resistance_factor` 0.2 | "Songs of the Occupied Years" |
| `lake_charter` | Charter of the Lake Towns | `stability_factor` 0.05, `production_speed_buildings_factor` 0.05 | "Charter of the Lake Towns" |
| `warden_kingship` | The Elective Crown | `political_power_gain` 0.15, `war_support_factor` 0.05 | "The Elective Crown" |
| `warden_assembly` | The Assembly of Wardens | `stability_factor` 0.1, `political_power_gain` 0.05 | "The Assembly of Wardens" |
| `forest_rangers` | Rangers of the Mirolon Forests | `recon_factor` 0.1, `terrain_penalty_reduction` 0.1 | "The Mirolon Forests" |
| `masons_guild` | The Masons' Guild | `production_speed_bunker_factor` 0.25, `production_speed_buildings_factor` 0.05 | "The Masons' Guild" |
| `fallback_lines` | Fallback Lines | `army_core_defence_factor` 0.05 | "Sunken Roads and Fallback Lines" |
| `passes_shut` | The Passes Are Shut | `army_defence_factor` 0.1, `max_dig_in` 5 | "The Passes Are Shut" |
| `concord_backing` | The Concord's Backing | `war_support_factor` 0.05, `army_defence_factor` 0.05 | "Through the Concord's Doors" |
| `league_musters` | The League Musters | `army_defence_factor` 0.05, `recruitable_population_factor` 0.05 | "The League Musters" |
| `lake_levies` | Levies of the Lake Towns | `recruitable_population_factor` 0.05, `training_time_army_factor` −0.05 | "Levies of the Lake Towns" |
| `narrows_doctrine` | Doctrine of the Narrows | `army_defence_factor` 0.05, `max_dig_in` 3 | "Doctrine of the Narrows" |
| `fire_against_dead` | Fire Against the Dead | `army_attack_factor` 0.05 | "Fire Against the Dead" |
| `every_hand` | Every Hand a Warden | `recruitable_population_factor` 0.1, `war_support_factor` 0.05 | "Every Hand a Warden" |
| `last_stand` | The Last Stand | `army_defence_factor` 0.15, `army_core_defence_factor` 0.1 | "The Last Stand at the Passes"; removed at peace |
| `hold_every_stone` | Hold Every Stone | `army_defence_factor` 0.1, `land_reinforce_rate` 0.02 | "Hold Every Stone"; 180 days |
| `pride_of_the_passes` | The Pride of the Passes | `war_support_factor` 0.1, `army_org_factor` 0.05 | "The Passes Held" |
| `southern_war` | The War Carried South | `army_attack_factor` 0.1, `war_support_factor` 0.05 | `zin_mirolon.12` option "Carry it south."; 180 days |
| `watch_for_ages` | A Watch for the Ages | `army_defence_factor` 0.1, `stability_factor` 0.05 | "A Watch for the Ages" |

## Events (namespace `zin_mirolon`)

| Id | Key | Title | Trigger | Options (effects; AI weight) |
| --- | --- | --- | --- | --- |
| 1 | `wardens_council` | The High Warden's Council | Focus | "Hear the pass-lords." (passes +5; AI 60) / "Hear the lake towns." (+50 PP; AI 40) |
| 2 | `grave_signs` | Signs at the Grave-Fields | Focus | "Send more scouts." (proof +5, Volgan veil −3; if veil ≥ 70, 20% chance of `zin_dominion.6` instead; AI 60) / "Write it down and wait." (proof +3; AI 40) |
| 3 | `herez_friendship` | Friendship with Mirolon (to Herez) | Focus | "Herez stands with Mirolon." (opinion +25 both ways; Mirolon flag zin_mirolon_herez_friend; AI 60, ×0.5 if Aenor's `zin_court_corruption` > 60) / "Herez answers to Parim." (AI 40) |
| 4 | `league_invite` | An Invitation from Mirolon (to a free Dead Lands realm) | Focus | "Stand with the wardens." (country flag zin_mirolon_league_friend; AI 40, ×2 if Light or Wild, ×0 if Shadow or a Volgan subject) / "We keep our own counsel." (AI 60) |
| 5 | `marches_pact` | The Southern Marches Pact (to Herez) | Focus | "If the storm comes, Herez will send men." (Herez flag zin_herez_marches_pact: Herez AI sends volunteers to Mirolon at war; AI 50) / "Herez cannot promise." (AI 50) |
| 6 | `lost_cause_request` | Mirolon Asks to Join the Lost Cause (to Aenor) | Focus | "Admit Mirolon." (Mirolon flag zin_mirolon_lost_cause_friend; Mirolon joins the Lost Cause as the Aenor spec defines it; AI 20 + proof / 2, ×0.5 if `zin_court_corruption` > 60) / "A frontier realm's fears are not ours." (Mirolon opinion of Aenor −15; AI 80) |
| 7 | `appeal_to_gala` | Mirolon Remembers (to the Gala Elves) | Focus | "Send rangers north." (Mirolon gets 500 infantry equipment and flag zin_gala_rangers_mirolon; AI 15, ×2 with zin_mirolon_elves_remember; Gala spec may override) / "The elves made their choice long ago." (AI 85) |
| 8 | `archives` | The Archives of the First Conquest | Focus | "Read it to the young." (war_support +0.02) |
| 9 | `passes_held` | The Passes Held (news) | Focus | "Mirolon stands." |
| 10 | `storm_comes` | The Storm Comes | Focus | "To the passes!" |
| 11 | `mirolon_rises` | Mirolon Rises Again | Focus | "Home." (stability +0.05). Text: the master of Nafeher has fallen; what remains of him no one can say. |
| 12 | `carry_war_south` | Into the Dead Lands? | Focus | "Carry it south." (war goal `annex_everything` on Volgan if not at war; timed_spirit southern_war 180; AI 20) / "Remember Edran's host." (+100 PP; flag zin_mirolon_declined_south; AI 80). The text recalls that the First Age invasion of the Dead Lands failed. |

The mechanic's events that reach Mirolon (`zin_dominion.2`, `.3`, `.6`, `.7`, `.10`, `.11`, `.20`, `.24`) are listed in the mechanic spec.

## Historical AI route

With `zin_rule_historical_path`. Dates are targets.

| Period | Focuses |
| --- | --- |
| Thaw to Longnight 1748 | wardens_hall, watch_on_the_passes, stone_on_the_passes, scouts_beyond_the_heat |
| 1749 | voices_to_the_north, envoy_to_parim (the Golden Court laughs: `zin_mirolon_parim_laughed`), quarry_roads, the_first_gate, counting_the_fires, high_wardens_council, masons_guild |
| 1750 | signal_towers, the_second_gate, scout_masters_school, signs_at_the_grave_fields, ledger_of_warnings, charter_of_the_lake_towns |
| 1751 | friendship_with_herez, seats_for_pass_lords, the_wardens_law, open_the_muster_rolls, elective_crown, free_realms_of_the_dead_lands |
| 1752 | one_realm_one_watch, the_iron_gate, fallback_lines, passes_are_shut, deep_patrols, warden_league |
| 1753 | league_musters, lake_and_coast, army_of_the_passes, pass_warden_companies, levies_of_the_lake_towns, memory_of_the_first_conquest, lake_fisheries, coast_harbours |
| 1754 | watch_never_sleeps, doctrine_of_the_narrows, rangers_of_the_forests, captain_of_the_passes, a_wall_of_realms, southern_marches_pact |
| Rainwake 1755 | the_storm_comes, the_exile_court, hold_every_stone, evacuate_the_lake_towns |
| Emberleaf 1755 | Mirolon capitulates; the court goes into exile (`zin_dominion.24`) |
| 1756 | the_court_abroad, the_hidden_mirolon |
| 1757 | hope_from_the_north; after the body breaks: mirolon_rises_again (the Steward lets Mirolon go) |
| 1758 to 1760 | rebuild_the_gates, bury_the_dead_of_two_ages, a_watch_for_the_ages, the_free_south; leftover economy |

On the historical path Mirolon never takes `proof_no_court_can_laugh_at`, `ask_the_lost_cause` (Parim laughed), `last_stand_at_the_passes` or `carry_the_war_south`. Its proof stays below 75, so `unheeded_warnings` remains: the vault's picture of a realm nobody believes.

## Alternative routes

| Route | How | Result |
| --- | --- | --- |
| The passes hold | Passes ≥ 80, proof ≥ 50 at war, Last Stand, Burn the Bridges, Hold Every Stone | `zin_mirolon_holds` after a year: Volgan loses strength and stalls; the march north is delayed or broken (vault's "where history can turn") |
| Shelter in the Lost Cause | Ask the Lost Cause when Parim did not laugh (lower court corruption) | Aenor's league protects Mirolon; the war draws Aenor in early |
| The Warden League | The Warden League with willing free realms | A small southern faction; better defence |
| Elven rangers | What the Elves Remember, then An Appeal to Gala | A chance of Gala help, despite the Refusal |
| The war carried south | Carry the War South after the body breaks | A non-canon invasion of the Dead Lands, with Edran's warning |
| The Golden Court's debt | Loans from Parim's Bankers | Faster industry, lasting consumer goods burden |

## Implementation

- Data: `docs/design/focus/mirolon.json` (id `mirolon`, tier `major`, countries `["Mirolon"]`).
- Compiled: `common/national_focus/zin_mirolon.txt`, `common/ideas/zin_focus_mirolon.txt`, `events/zin_mirolon.txt`, `localisation/english/zin_focus_mirolon_l_english.yml`.
- Scripted effects and triggers come from the mechanic (`zin_dominion.txt`): `zin_mirolon_add_proof`, `zin_mirolon_add_passes`, `zin_mirolon_scorch`, `zin_mirolon_raise_resistance`, `zin_mirolon_restore`, `zin_volgan_add_veil`, `zin_mirolon_occupied`, `zin_world_add_gathering_dark`.
- History: `history/countries/<Mirolon tag>`: spirits `long_watch`, `unheeded_warnings`; `zin_mirolon_proof` 15; `zin_mirolon_passes` 30; country leader `zin_mirolon_maeric` (replaces the generated ruler); characters `zin_mirolon_selda` and `zin_mirolon_hadric` defined but not recruited.
- Faction "The Warden League" (proposed name), created by `warden_league`; Mirolon leads.
- Building target "site mirolon_passes" uses `zin_is_site_mirolon_passes` (every pass state Mirolon controls).
- Tree flags: `zin_mirolon_elves_remember`, `zin_mirolon_herez_friend`, `zin_mirolon_lost_cause_friend`, `zin_mirolon_evacuated`, `zin_mirolon_declined_south`, `zin_mirolon_free_south` (Mirolon); `zin_mirolon_league_friend` (invitees); `zin_herez_marches_pact` (Herez); `zin_gala_rangers_mirolon` (Mirolon, set by Gala's answer).
- `raw` blocks: three (two `recruit_character`, one `is_government_in_exile` condition). Limit is ten.
- Icons from the shared catalog; proposed new icons: `pass_fort`, `scout_lantern`, `lake_town`, `warden_crown`, `exile_court`. All image-generated.

## AI

- Base weights are in the tables. Under `zin_rule_historical_path`: `proof_no_court_can_laugh_at` gets ×0 (the world is not convinced before the war); `ask_the_lost_cause` gets ×0.1 once Parim has laughed; `the_exile_court` 100 and `last_stand_at_the_passes` 0; `carry_the_war_south` 0.
- Mirolon's AI is defensive: it never declares war on Volgan before the body breaks. AI strategies and decision use are in the mechanic spec.
- Watch and Stone branches have the highest peace-time weights so proof and passes grow before 1755.

## Acceptance

1. The compiler accepts `mirolon.json`: 83 focuses, unique keys and positions, every prerequisite above its focus, exclusives symmetric, days multiples of 7, three raw blocks.
2. The HOI4 Agent Tools focus inspector reports no errors; the renderer shows the tree within 26 columns.
3. On 1 Thaw 1748 no focus starts a war; "The Storm Comes" is unavailable until Volgan is at war with Mirolon.
4. In the historical AI run Mirolon's passes reach at least 80 and proof between 50 and 74 before 1 Rainwake 1755, the Golden Court laughs at the envoy, Mirolon takes the Exile Court, falls in 1755, and returns after `zin_volgan_body_destroyed`.
5. In a test where Mirolon holds every pass state for 365 days of war, `zin_mirolon_holds` is set and "The Passes Held" becomes available.
6. No Mirolon text places Dardan, names Afrit or states Volgan's final fate.
7. Every modifier in the spirits table exists in the game's modifier documentation.

## Open questions

1. Is Mirolon a kingdom, a republic, or the elective warden-realm proposed here? Do you want to name its ruler?
2. Should Mirolon be able to join Aenor's Lost Cause at all, given the Golden Court laughed at its envoy in 4A 1736?
3. Does Mirolon hold lands on the Magical Lands sheet (map open question 4), and if so, should the tree treat them as a refuge for the exile court?
4. Should the Gala Elves ever answer Mirolon's appeal, or does the Elven Refusal rule it out entirely?
