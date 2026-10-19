# Volgan focus tree

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 4. **Phase:** 4.

## Purpose

Volgan's tree turns the ancient dark lord's century of hidden rebuilding into play. For the first years it is a tree of court, forges, oaths and secrets: Volgan grows his hosts behind the storms of the Dead Lands while the world laughs at Mirolon's warnings. When the War of the Last Crowns opens, or when Volgan chooses to break the veil early, the war branches carry him through the reconquest of Mirolon and the march north, the clash and compact with Zol, and either the established breaking of his body or the alternative ending, the Children of Volgan.

Tree id `volgan`; country Volgan (tier A, [01_tiers_and_coverage.md](../01_tiers_and_coverage.md)). 114 focuses. Mechanic: [Volgan and the Southern Dominion](../../04_mechanics/volgan_southern_dominion.md). Data format: [00_format_and_compiler.md](../00_format_and_compiler.md).

## Lore basis

**Established:** Volgan is a Great Spirit and the principal dark lord; seat Nafeher; Southern Dominion of Demon, Dolon and Nezer; rival Mirolon. His hosts include demons, orcs, goblins, ogres, monster clans, grave hosts and necromantic orders. The independent Dark Lands are not his by right. He invaded Mirolon in the First Age. In the Fourth Age he retakes Mirolon, marches north with a host greater than any since the First Age, fights Zol's dead and then briefly aligns with Zol against Eindil, strikes Eindil down once and loses his manifested body to the restored Eindil. Whether his spirit survives is open. He wants Glo. Children of Volgan is an alternative ending. The Nether is the King of Demons' seat; the Abyss is tied to Roka and the Necklace; their relationships to Volgan are open.

**Proposed:** every focus, spirit, event, number and date below; the names of Volgan's lieutenants (the Ember Herald, the Grave-Warden, Ghorvak of the Hundred Clubs); the Veil of Storms, the Black Compact and the Silent Throne.

**Kept open:** the King of Demons' obligations, Roka's fate and his people's name, the location of Dardan, the dead's taxonomy, and Volgan's final fate. The tree's text never states any of them. No text names Afrit: the Abyss branch speaks only of "a thief from the north". No text names Eindil before `zin_eindil_named`; every focus that speaks of him needs `zin_eindil_returned`, which comes later.

## Design

### Shape

| Columns | Branch | Opens | Drives |
| --- | --- | --- | --- |
| 0–2 | Forges in the Heat (economy) | Start | Industry |
| 5–7 | The Grave-Fields (musters) | Start | `zin_dominion_strength`, grave hosts |
| 9–11 | The Veil of Storms (secrecy) | Start | `zin_volgan_veil`; the war gate |
| 12–16 | The Court of Nafeher (politics) | Start | Strength, government, the claim on Mirolon |
| 17–19 | The Southern Dominion (members) | Start | `zin_dominion_oath` |
| 21–23 | The Nether | Start | `zin_nether_pact` |
| 24–26 | The Abyss | Start | Abyss-folk outcomes |
| 27–29 | Voices to the Dark Lands | Start | `zin_volgan_pact` |
| 9–13, rows 7–12 | The Old Conquest (war on Mirolon) | `zin_volgan_war_open` | Reconquest of Mirolon |
| 9–13, rows 13–21 | The March North | Mirolon taken | `zin_volgan_marches`, Children of Volgan |
| 13–16, rows 14–17 | The Two Darks | `zin_zol_rising`, `zin_eindil_returned` | Clash and Black Compact |
| 18–20, rows 18–22 | The Silent Throne | `zin_volgan_body_destroyed` | Aftermath |

The grid is 30 columns wide (x 0 to 29) and 23 rows deep (y 0 to 22).

### The peaceful start

Rows 0 to 6 hold no war. The only focuses that touch another country before the war are diplomacy (a false non-aggression offer to Mirolon, oaths, envoys) and one claim ("The Old Claim on Mirolon"), which the AI takes only from 1 Deepwinter 1754. War focuses need `zin_volgan_war_open`: either the world's `zin_war_of_last_crowns` or Volgan's own "Break the Veil", which needs 1 Deepwinter 1750 and strength 70.

### Notation

Prerequisites: "a and b" means both; "a or b" means either. Effects use the compiler vocabulary; `call X (v)` is `{ "call": "X", "args": { "value": v } }`; `check X` is `{ "check": "X" }`. Research categories are the warfare spec's `zin_cat_*` (the vanilla category in brackets is the fallback until warfare stage 2); equipment `zin_grave_arms_equipment` falls back to `infantry_equipment` until then. Doctrines cost experience in 1.19.3, so doctrine bonuses are written as army experience. "Strength" is `zin_volgan_add_dominion_strength`; "veil" is `zin_volgan_add_veil`; "pact" is `zin_volgan_add_nether_pact`; "oath" is `zin_volgan_add_oath`. Spirit keys compile to `zin_volgan_<key>`; event keys to `zin_volgan.<n>`. AI weight is the base; "hist" lists the factor under `zin_rule_historical_path`.

### Branch 1: Forges in the Heat

**Purpose:** Volgan's economy: ash mines, kilns and war-forges, the industry an unseen host needs. **Opens:** at the start. **Mechanic:** industry and equipment; "The Dominion at War" needs an open war.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `forges_in_the_heat` | Forges in the Heat | — | — | 1,0 | 70 | building industrial_complex 1 capital; political_power 25 | 15 |
| `ash_mines` | The Ash Mines | forges_in_the_heat | — | 0,1 | 35 | raw: `random_owned_state = { add_resource = { type = steel amount = 8 } }` (`steel` is the economy spec's Iron) | 10 |
| `bone_kilns` | The Bone Kilns | forges_in_the_heat | — | 2,1 | 35 | building arms_factory 1 capital | 10 |
| `roads_under_storms` | Roads Under the Storms | ash_mines | — | 0,2 | 35 | building infrastructure 1 random_owned (twice) | 8 |
| `war_forges` | War-Forges of Nafeher | bone_kilns | — | 2,2 | 70 | building arms_factory 2 capital | 10 |
| `heat_hardened_steel` | Heat-Hardened Steel | roads_under_storms and war_forges | — | 1,3 | 35 | research zin_cat_arms [infantry_weapons] bonus 0.5 uses 2 | 8 |
| `labour_never_tires` | Labour That Never Tires | heat_hardened_steel | — | 0,4 | 70 | add_spirit tireless_labour | 10 |
| `storm_harbours` | Harbours Behind the Storms | heat_hardened_steel | — | 2,4 | 35 | building naval_base 2 random_coastal; building dockyard 1 random_coastal | 5 |
| `iron_for_the_host` | Iron for the Host | labour_never_tires or storm_harbours | — | 1,5 | 35 | equipment zin_grave_arms_equipment 1500; building industrial_complex 1 random_owned | 10 |
| `siege_engines` | Siege Engines of the Old War | iron_for_the_host | — | 0,6 | 35 | research zin_cat_siege [artillery] bonus 0.5 uses 2 | 8 |
| `dominion_at_war` | The Dominion at War | iron_for_the_host | — | 2,6 | 35 | available: check zin_volgan_war_open; add_spirit dominion_war_economy | 20 at war |
| `forges_never_cool` | Forges That Never Cool | siege_engines or dominion_at_war | — | 1,7 | 70 | building arms_factory 2 capital | 10 |

### Branch 2: The Grave-Fields

**Purpose:** the grave musters that rebuild the hosts. **Opens:** at the start. **Mechanic:** strength, manpower, Grave Host divisions; opens the muster decisions (flag `zin_volgan_musters_open`). "The Great Muster" needs an open war because it spends the veil.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `grave_fields` | The Grave-Fields of the South | — | — | 6,0 | 35 | flag zin_volgan_musters_open; strength +2 | 30 |
| `old_barrows` | Wake the Old Barrows | grave_fields | — | 5,1 | 35 | manpower 10000; strength +3; veil −2 | 15 |
| `deep_barrows` | The Deep Barrows | grave_fields | — | 7,1 | 35 | call zin_volgan_spawn_grave_host (count 2, where capital); veil −1 | 15 |
| `bone_road` | The Bone Road | old_barrows | — | 5,2 | 35 | building infrastructure 1 capital; building infrastructure 1 random_owned | 8 |
| `grave_warden_order` | The Grave-Warden's Order | deep_barrows | — | 7,2 | 35 | add_spirit grave_wardens | 12 |
| `drowned_musters` | The Drowned Musters | bone_road and grave_warden_order | — | 6,3 | 35 | call zin_volgan_spawn_grave_host (count 2, where capital); strength +3 | 12 |
| `tireless_dead` | The Tireless Dead | drowned_musters | — | 5,4 | 70 | add_spirit tireless_dead_spirit | 10 |
| `hosts_without_number` | Hosts Without Number | drowned_musters | — | 7,4 | 70 | manpower 25000; research zin_cat_arms [infantry_weapons] bonus 0.5 uses 1 | 10 |
| `great_muster` | The Great Muster | tireless_dead and hosts_without_number | — | 6,5 | 70 | available: check zin_volgan_war_open; call zin_volgan_spawn_grave_host (count 6, where capital); strength +10; veil −100 | 50 at war |
| `bind_the_restless` | Bind the Restless | great_muster | — | 5,6 | 35 | add_spirit bound_restless; flag zin_volgan_bind_open (decision "Bind the Restless") | 15 |
| `a_host_greater` | A Host Greater Than the First Age | great_muster | — | 7,6 | 70 | available: variable zin_dominion_strength above 85; add_spirit host_of_first_age; call zin_world_add_gathering_dark (5) | 30 |

### Branch 3: The Veil of Storms

**Purpose:** hide the rebuilding and choose when the storm breaks. **Opens:** at the start. **Mechanic:** `zin_volgan_veil`; Mirolon's proof; the war gate. "Break the Veil" and "Wait for the Storm" are mutually exclusive: start the war early at the cost of surprise and the world's alarm, or wait for the world's own war and strike out of the storms. "The Storm Breaks" is the gate of every war branch.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `raise_the_veil` | The Veil of Storms | — | — | 10,0 | 35 | add_spirit veil_of_storms; veil +5 | 30 |
| `storm_coast_wardens` | Wardens of the Storm Coast | raise_the_veil | — | 9,1 | 35 | building coastal_bunker 1 random_coastal; veil +3 | 8 |
| `false_quiet` | The False Quiet | raise_the_veil | — | 11,1 | 35 | event_for Mirolon words_from_nafeher (zin_volgan.2) | 15 |
| `silence_the_watchers` | Silence the Watchers | storm_coast_wardens | — | 9,2 | 35 | flag zin_volgan_silence_open; political_power 25 | 12 |
| `whispers_in_parim` | Whispers in Parim | false_quiet | — | 11,2 | 35 | flag zin_volgan_whispers_parim (the "nursery tale" option of zin_dominion.5 gets +50 AI weight); veil +5 | 12 |
| `rites_of_the_storm` | Rites of the Storm | silence_the_watchers and whispers_in_parim | — | 10,3 | 70 | add_spirit storm_rites | 12 |
| `break_the_veil` | Break the Veil | rites_of_the_storm | wait_for_the_storm | 9,4 | 35 | available: check zin_volgan_may_break_veil; flag zin_volgan_veil_broken; remove_spirit veil_of_storms; remove_spirit storm_rites; veil −100; call zin_world_add_gathering_dark (8); war_support 0.15 | 0 (hist ×0; rule AI_FREE: 10 when strength ≥ 80) |
| `wait_for_the_storm` | Wait for the Storm | rites_of_the_storm | break_the_veil | 11,4 | 35 | add_spirit patience_of_ages | 100 |
| `storm_breaks` | The Storm Breaks | break_the_veil or wait_for_the_storm | — | 10,5 | 14 | available: check zin_volgan_war_open; remove_spirit patience_of_ages; war_support 0.1; political_power 50 | 200 |

### Branch 4: The Court of Nafeher

**Purpose:** Volgan's court: lieutenants, the necromantic orders and the warlords, the dread doctrine and the old claim on Mirolon. **Opens:** at the start. **Mechanic:** strength, government spirits; the exclusive choice between the necromantic orders (more and faster dead) and the warlords (harder living hosts). "The Old Claim on Mirolon" is the second gate of the Old Conquest.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `court_of_nafeher` | The Court of Nafeher | — | — | 14,0 | 70 | political_power 100; add_spirit court_of_nafeher_spirit | 100 |
| `voice_in_the_heat` | The Voice in the Heat | court_of_nafeher | — | 13,1 | 35 | stability 0.05; strength +2 | 15 |
| `patient_lord` | The Patient Lord | court_of_nafeher | — | 15,1 | 35 | veil +5; political_power 50 | 15 |
| `lieutenants_assemble` | The Lieutenants Assemble | voice_in_the_heat | — | 12,2 | 35 | event lieutenants (zin_volgan.1); army_experience 10 | 20 |
| `ledger_of_the_dead` | The Ledger of the Dead | voice_in_the_heat or patient_lord | — | 14,2 | 35 | strength +3; manpower 5000; veil −1 | 12 |
| `hidden_century` | The Hidden Century | patient_lord | — | 16,2 | 35 | army_experience 15; strength +2 | 10 |
| `rule_through_orders` | Rule Through the Orders | lieutenants_assemble and ledger_of_the_dead | rule_through_warlords | 13,3 | 70 | add_spirit orders_ascendant | 60 (hist ×2) |
| `rule_through_warlords` | Rule Through the Warlords | ledger_of_the_dead and hidden_century | rule_through_orders | 15,3 | 70 | add_spirit warlords_seated | 40 |
| `one_will` | One Will in Nafeher | rule_through_orders or rule_through_warlords | — | 14,4 | 70 | political_power 100; stability 0.1; strength +3 | 15 |
| `dread_doctrine` | The Dread Doctrine | one_will | — | 14,5 | 35 | popularity shadow 0.1; swap_spirit court_of_nafeher_spirit → throne_of_dread | 15 |
| `old_claim` | The Old Claim on Mirolon | dread_doctrine | — | 13,6 | 35 | claims_on Mirolon; veil −5; tooltip "Mirolon was Volgan's in the First Age." | 0 before 1754.1.1 (hist), else 20 |
| `dominion_endures` | The Dominion Endures | dread_doctrine | — | 15,6 | 70 | remove_spirit long_recovery; strength +5; army_experience 25 | 15 |

### Branch 5: The Southern Dominion

**Purpose:** bind Demon, Dolon and Nezer to Nafeher. **Opens:** at the start. **Mechanic:** `zin_dominion_oath`; tribute; the court decisions (flag `zin_volgan_court_open`); members' contribution to strength.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `southern_dominion` | The Southern Dominion | — | — | 18,0 | 35 | political_power 50; oath all +10 | 25 |
| `oath_of_demon` | The Oath of Demon | southern_dominion | — | 17,1 | 35 | oath Demon +15; event_for Demon summoned (zin_volgan.3) | 12 |
| `dolon_sworn_anew` | Dolon Sworn Anew | southern_dominion | — | 18,1 | 35 | oath Dolon +15; event_for Dolon summoned (zin_volgan.3) | 12 |
| `nezer_confederacy` | The Confederacy of Nezer | southern_dominion | — | 19,1 | 35 | oath Nezer +15; event_for Nezer summoned (zin_volgan.3) | 12 |
| `the_dominions_tribute` | The Dominion's Tribute | oath_of_demon and dolon_sworn_anew | — | 17,2 | 35 | add_spirit dominion_tribute | 12 |
| `hold_court_at_nafeher` | Hold Court at Nafeher | dolon_sworn_anew and nezer_confederacy | — | 19,2 | 35 | stability 0.05; flag zin_volgan_court_open | 12 |
| `netherborn_levies` | Demon's Netherborn Levies | the_dominions_tribute | — | 17,3 | 35 | manpower 8000; oath Demon −5 | 8 |
| `forges_of_dolon` | The Forges of Dolon | the_dominions_tribute and hold_court_at_nafeher | — | 18,3 | 35 | equipment zin_grave_arms_equipment 1000; for_country Dolon: building arms_factory 1 capital | 8 |
| `nezer_war_bands` | Nezer's War-Bands | hold_court_at_nafeher | — | 19,3 | 35 | army_experience 15; for_country Nezer: army_experience 10 | 8 |
| `one_dominion_under_nafeher` | One Dominion Under Nafeher | netherborn_levies and forges_of_dolon and nezer_war_bands | — | 18,4 | 70 | add_spirit one_dominion; oath all +10 | 15 |
| `dominion_war_council` | The Dominion War-Council | one_dominion_under_nafeher | — | 17,5 | 35 | event war_council (zin_volgan.4); strength +5 | 12 |
| `spoils_promised` | Spoils Promised | one_dominion_under_nafeher | — | 19,5 | 35 | oath all +15; flag zin_volgan_spoils_promised (Grant Spoils cooldown halved) | 10 |

### Branch 6: The Nether

**Purpose:** win Netherborn from the King of Demons' court. **Opens:** at the start. **Mechanic:** `zin_nether_pact`; the Nether Gate decisions. "Bargain" and "Bend" are mutually exclusive: the bargain is slow and can reach the full pact; bending the Nether gives manpower now, costs stability and caps the pact at 75, just above the gate pact. Text calls it "the bargain of this reign" and never states what the King owes Volgan.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `envoys_to_the_nether` | Envoys to the Nether | — | — | 22,0 | 35 | event nether_court (zin_volgan.5) | 20 |
| `bargain_with_the_king` | Bargain with the King of Demons | envoys_to_the_nether | bend_the_nether | 21,1 | 70 | flag zin_volgan_nether_bargain; add_spirit nether_bargain; pact +15 | 70 (hist ×2) |
| `bend_the_nether` | Bend the Nether to Nafeher | envoys_to_the_nether | bargain_with_the_king | 23,1 | 35 | flag zin_volgan_nether_bent; pact +10; manpower 15000; timed_spirit nether_unrest 365 | 30 |
| `netherborn_companies` | Netherborn Companies | bargain_with_the_king or bend_the_nether | — | 22,2 | 35 | available: variable zin_nether_pact above 39; add_spirit netherborn_companies_spirit | 15 |
| `old_portals` | The Old Portals | netherborn_companies | — | 21,3 | 35 | pact +10; tooltip "At 70, the gates open in war." | 12 |
| `fire_of_the_nether` | Fire of the Nether | netherborn_companies | — | 23,3 | 35 | research zin_cat_dark_rites [artillery] bonus 0.5 uses 1; strength +2 | 8 |
| `kings_due` | The King's Due | old_portals and fire_of_the_nether | — | 22,4 | 35 | event kings_due (zin_volgan.6) | 10 |
| `the_gates_opened` | The Gates Opened | kings_due | — | 22,5 | 35 | available: check zin_volgan_war_open and flag zin_volgan_gate_pact; add_spirit gates_opened | 30 at war |

### Branch 7: The Abyss

**Purpose:** reach into the Abyss, where the Abyss-folk live and something was once stolen. **Opens:** at the start. **Mechanic:** random outcome of the descent (zin_volgan.8 with weights 50/35/15); Abyss-Born companies and the Abyss Host at the march (flag `zin_volgan_abyss_march`). Texts never state Roka's fate and never name the thief's master.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `watchers_at_the_abyss` | Watchers at the Abyss | — | — | 25,0 | 35 | event abyss_watch (zin_volgan.7); political_power 25 | 10 |
| `descend_into_the_abyss` | Descend into the Abyss | watchers_at_the_abyss | — | 25,1 | 35 | event abyss_descent (zin_volgan.8) | 10 |
| `empty_setting` | The Empty Setting | descend_into_the_abyss | — | 24,2 | 35 | event empty_setting (zin_volgan.12); political_power 50 | 8 |
| `abyss_born_companies` | Abyss-Born Companies | descend_into_the_abyss | — | 26,2 | 35 | available: flag zin_volgan_abyss_answered; add_spirit abyss_born | 15 |
| `seal_the_depths` | Seal the Depths | empty_setting or abyss_born_companies | — | 25,3 | 35 | stability 0.05; strength +2; veil +3 | 8 |
| `lords_of_the_deep` | Lords of the Deep | seal_the_depths | — | 25,4 | 70 | available: flag zin_volgan_abyss_answered; flag zin_volgan_abyss_march; strength +3; tooltip "Two Abyss Host divisions join the march." (spawned by zin_volgan_begin_march, or by the next mechanic pulse if the march has begun) | 12 |

### Branch 8: Voices to the Dark Lands

**Purpose:** court the independent monsters of the Dark Lands, knowing most will refuse. **Opens:** at the start. **Mechanic:** `zin_volgan_pact` levels 1 to 3; the envoy decisions (flag `zin_volgan_envoys_open`); military access and a northern front at the march.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `voices_to_the_dark_lands` | Voices to the Dark Lands | — | — | 28,0 | 35 | flag zin_volgan_envoys_open; political_power 25 | 15 |
| `gifts_to_the_orc_holds` | Gifts to the Orc Holds | voices_to_the_dark_lands | — | 27,1 | 35 | call zin_volgan_court_dark_lands (target orcs) | 12 |
| `troll_forest_price` | The Troll Forest's Price | voices_to_the_dark_lands | — | 29,1 | 35 | call zin_volgan_court_dark_lands (target Troll Forest) | 10 |
| `goldoroth_question` | The Goldoroth Question | gifts_to_the_orc_holds | — | 27,2 | 35 | event_for Goldoroth envoy_from_the_south (zin_volgan.13) | 10 |
| `monster_clans` | The Monster Clans | troll_forest_price | — | 29,2 | 35 | manpower 10000; add_spirit monster_clans_spirit | 10 |
| `not_all_will_answer` | Not All Will Answer | goldoroth_question | — | 27,3 | 35 | political_power 50; flag zin_volgan_envoys_cheap (envoys cost 15 PP) | 8 |
| `pact_of_spoils` | The Pact of Spoils | goldoroth_question or monster_clans | — | 28,3 | 35 | flag zin_volgan_pact_of_spoils; call zin_volgan_tree_offer_spoils (every Dark Lands country at pact 1 gets `zin_dominion.8` again; acceptance raises it to 2) | 10 |
| `sworn_to_nafeher` | Sworn to Nafeher | not_all_will_answer and pact_of_spoils | — | 28,4 | 70 | available: check zin_volgan_war_open; call zin_volgan_tree_offer_oath (up to three countries at pact 2 get `zin_dominion.8`; acceptance raises them to 3) | 20 at war |
| `second_front_north` | A Second Front in the North | sworn_to_nafeher | — | 28,5 | 35 | available: global_flag zin_volgan_marches; call zin_volgan_raise_northern_front | 30 |

### Branch 9: The Old Conquest

**Purpose:** retake Mirolon, Volgan's First Age conquest. **Opens:** "The Storm Breaks" and "The Old Claim on Mirolon", with strength ≥ 50 (`zin_volgan_hosts_ready`). **Mechanic:** war goal on Mirolon; surprise spirits; `zin_mirolon_fallen`; the exclusive choice between holding Mirolon with a dead garrison or making it a client crown (which counts toward Children of Volgan).

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `old_conquest` | The Old Conquest | storm_breaks and old_claim | — | 11,7 | 14 | available: check zin_volgan_hosts_ready; wargoal Mirolon annex_everything | 500 |
| `out_of_the_storms` | Out of the Storms | old_conquest | — | 10,8 | 21 | available: at_war_with Mirolon; army_experience 20; if spirit `zin_dominion_out_of_the_storms` (the mechanic gave it at the declaration because the veil was intact): timed_spirit `zin_dominion_out_of_the_storms` 60 (refreshes it; full mechanic id, S9) | 50 |
| `storm_the_passes` | Storm the Passes | old_conquest | — | 12,8 | 21 | available: at_war_with Mirolon; timed_spirit pass_breakers 180; army_experience 10 | 50 |
| `gates_behind_the_passes` | Gates Behind the Passes | out_of_the_storms | — | 9,9 | 14 | available: flag zin_volgan_gate_pact; flag zin_volgan_free_gates (next two Nether Gate decisions cost no PP) | 20 |
| `the_lake_towns` | The Lake Towns | out_of_the_storms and storm_the_passes | — | 11,9 | 21 | timed_spirit lake_assault 180; army_experience 15 | 30 |
| `mirolon_retaken` | Mirolon Retaken | gates_behind_the_passes or the_lake_towns | — | 11,10 | 35 | available: check zin_volgan_mirolon_taken; cores_on Mirolon; strength +5; political_power 100 | 100 |
| `dead_garrison` | A Garrison of the Dead | mirolon_retaken | client_crown_of_mirolon | 10,11 | 14 | add_spirit dead_garrison_spirit | 60 |
| `client_crown_of_mirolon` | A Client Crown in Mirolon | mirolon_retaken | dead_garrison | 12,11 | 14 | available: check zin_volgan_mirolon_clientable; call zin_volgan_make_client (target Mirolon); oath all +5 | 40 |
| `passes_are_ours` | The Passes Are Ours | dead_garrison or client_crown_of_mirolon | — | 11,12 | 14 | army_experience 30; strength +5 | 50 |

### Branch 10: The March North

**Purpose:** the established march north and the alternative road to Children of Volgan. **Opens:** "The Passes Are Ours" with strength ≥ 70 (≥ 60 for the historical AI after 1 Rainwake 1755). **Mechanic:** `zin_volgan_begin_march` (`zin_volgan_marches`, war on Herez and the holder of Parim); Volgan as field marshal; client crowns; the Children of Volgan trigger.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `march_north` | The March North | passes_are_ours | — | 11,13 | 35 | available: check zin_volgan_great_host; call zin_volgan_begin_march | 500 |
| `volgan_takes_the_field` | Volgan Takes the Field | march_north | — | 10,14 | 14 | call zin_volgan_take_field | 100 |
| `southern_marches` | Through the Southern Marches | march_north | — | 12,14 | 21 | timed_spirit southern_marches_spirit 180 | 50 |
| `terror_before_the_host` | Terror Before the Host | volgan_takes_the_field | — | 9,15 | 35 | add_spirit terror_host | 30 |
| `road_to_parim` | The Road to Parim | volgan_takes_the_field and southern_marches | — | 11,15 | 21 | call zin_volgan_wargoal_parim; war_support 0.05 | 60 |
| `green_crystal` | The Green Crystal | southern_marches | — | 13,15 | 35 | event green_crystal (zin_volgan.14) | 20 |
| `break_concord_south` | Break the Concord's South | terror_before_the_host and road_to_parim | — | 10,16 | 35 | claims_on Herez; army_experience 20 | 30 |
| `client_crowns` | Client Crowns | road_to_parim | — | 12,16 | 35 | flag zin_volgan_client_crowns | 30 |
| `old_battlefields` | Wake the Old Battlefields | break_concord_south or client_crowns | — | 11,17 | 35 | flag zin_volgan_battlefields_open; strength +5 | 30 |
| `siege_of_parim` | The Siege of Parim | old_battlefields | — | 11,18 | 35 | available: check zin_volgan_tree_at_war_for_parim; timed_spirit siege_of_parim_spirit 180 | 50 |
| `throne_in_parim` | A Throne in Parim | siege_of_parim | — | 10,19 | 70 | available: check zin_volgan_tree_holds_parim; political_power 150; strength +10 | 100 |
| `children_of_volgan` | The Children of Volgan | throne_in_parim and client_crowns | — | 11,20 | 70 | available: check zin_volgan_children_ready; flag zin_volgan_children_proclaimed; add_spirit children_dominion | 500 |
| `monster_and_grave` | Rule by Monster and Grave | children_of_volgan | — | 12,21 | 35 | oath all +20; stability 0.1; strength +5 | 50 |

"Wake the Old Battlefields" speaks of "the fields where the First Age died" and never places Dardan.

### Branch 11: The Two Darks

**Purpose:** Volgan's meeting with Zol's dead: first the clash, then the Black Compact against Eindil. **Opens:** "The March North" and `zin_zol_rising`. **Mechanic:** `zin_volgan_zol_clash`, `zin_black_compact`. "The Dead Against the Dead" (historical) and "Leave the North to Its Dead" (try a truce with Zol) are mutually exclusive; both lead to the compact. "The Champion of Men" sits under "The Green Crystal" and readies Volgan for Eindil.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `dead_of_the_north` | The Dead of the North | march_north | — | 15,14 | 14 | available: global_flag zin_zol_rising; army_experience 10 | 40 |
| `dead_against_dead` | The Dead Against the Dead | dead_of_the_north | leave_north_to_its_dead | 14,15 | 21 | available: global_flag zin_volgan_zol_clash; timed_spirit clash_of_darks 180; army_experience 20 | 100 |
| `leave_north_to_its_dead` | Leave the North to Its Dead | dead_of_the_north | dead_against_dead | 16,15 | 35 | event_for Zol word_to_the_mistake (zin_volgan.15) | 0 (hist ×0), else 20 |
| `black_compact` | The Black Compact | dead_against_dead or leave_north_to_its_dead | — | 15,16 | 14 | available: global_flag zin_eindil_returned and check zin_volgan_tree_compact_open and not global_flag zin_black_compact; call zin_volgan_tree_offer_compact (fires `zin_dominion.14` for Zol; acceptance sets `zin_black_compact`) | 300; ×5 while Zol has `zin_zol_accord_sought` |
| `two_darks_one_field` | Two Darks, One Field | black_compact | — | 15,17 | 21 | available: global_flag zin_black_compact and not global_flag zin_black_compact_ended; add_spirit two_darks | 100 |
| `champion_of_men` | The Champion of Men | green_crystal | — | 13,17 | 14 | available: global_flag zin_eindil_returned; timed_spirit hunt_the_champion 180; event champion (zin_volgan.16) | 100 |

### Branch 12: The Silent Throne

**Purpose:** what the Dominion does when its master's body is gone. **Opens:** only when `zin_volgan_body_destroyed` is set. The root has `allow_branch` on that flag; `zin_volgan_destroy_body` calls `mark_focus_tree_layout_dirty`. **Mechanic:** replaces the mechanic spirit `zin_dominion_silent_throne`; the Steward (the Ember Herald) chooses between holding the Dead Lands and fighting on. Text never states whether Volgan's spirit lives.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `silent_throne` | The Silent Throne | — | — | 19,18 | 14 | allow_branch and available: global_flag zin_volgan_body_destroyed; call zin_volgan_steward_rule; political_power 100; stability 0.1 | 500 |
| `hold_the_dead_lands` | Hold the Dead Lands | silent_throne | host_fights_on | 18,19 | 35 | add_spirit retreat_south | 80 (hist ×2) |
| `host_fights_on` | The Host Fights On | silent_throne | hold_the_dead_lands | 20,19 | 35 | war_support 0.1; stability −0.1; strength +5 | 20 |
| `keep_the_oaths` | Keep the Oaths | hold_the_dead_lands | — | 18,20 | 35 | oath all +20 | 30 |
| `stewards_war` | The Steward's War | host_fights_on | — | 20,20 | 35 | timed_spirit steward_war 180; army_experience 20 | 30 |
| `what_remains` | What Remains of Volgan | keep_the_oaths or stewards_war | — | 19,21 | 35 | event what_remains (zin_volgan.17); remove_spirit zin_dominion_silent_throne | 30 |
| `dead_lands_endure` | The Dead Lands Endure | what_remains | — | 19,22 | 70 | add_spirit dead_lands_endure_spirit | 30 |

### Count

| Branch | Focuses |
| --- | ---: |
| Forges in the Heat | 12 |
| The Grave-Fields | 11 |
| The Veil of Storms | 9 |
| The Court of Nafeher | 12 |
| The Southern Dominion | 12 |
| The Nether | 8 |
| The Abyss | 6 |
| Voices to the Dark Lands | 9 |
| The Old Conquest | 9 |
| The March North | 13 |
| The Two Darks | 6 |
| The Silent Throne | 7 |
| **Total** | **114** |

## Spirits

Keys compile to `zin_volgan_<key>`. Mechanic spirits (`zin_dominion_*`) are listed in the mechanic spec. The mechanic reads six of these spirits by full id: `zin_volgan_veil_of_storms`, `zin_volgan_storm_rites`, `zin_volgan_host_of_first_age`, `zin_volgan_dominion_tribute`, `zin_volgan_one_dominion` and `zin_volgan_gates_opened`. The focuses that add them carry other keys (`raise_the_veil`, `rites_of_the_storm`, `a_host_greater`, `the_dominions_tribute`, `one_dominion_under_nafeher`, `the_gates_opened`), so no spirit id equals a focus id (F3).

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `long_recovery` | The Long Recovery | `army_org_factor` −0.05, `recruitable_population_factor` 0.05 | Start (added by `zin_dominion.1`); removed by "The Dominion Endures" |
| `storm_girt_realm` | The Storm-Girt Realm | `heat_attrition_factor` −0.5, `acclimatization_hot_climate_gain_factor` 0.5 | Start (added by `zin_dominion.1`); permanent |
| `court_of_nafeher_spirit` | The Court of Nafeher | `political_power_gain` 0.15 | "The Court of Nafeher"; swapped by "The Dread Doctrine" |
| `throne_of_dread` | The Throne of Dread | `political_power_gain` 0.25, `stability_factor` 0.05, `war_support_factor` 0.05 | "The Dread Doctrine"; permanent |
| `orders_ascendant` | The Orders Ascendant | `recruitable_population_factor` 0.1, `training_time_army_factor` −0.1 | "Rule Through the Orders" |
| `warlords_seated` | The Warlords Seated | `army_attack_factor` 0.05, `army_morale_factor` 0.1 | "Rule Through the Warlords" |
| `veil_of_storms` | The Veil of Storms | `civilian_intel_to_others` −15, `army_intel_to_others` −15 | "The Veil of Storms"; removed by "Break the Veil" or the march |
| `storm_rites` | Rites of the Storm | `attrition` −0.05 (veil +0.5 per month in the mechanic pulse) | "Rites of the Storm"; removed as above |
| `patience_of_ages` | The Patience of Ages | `political_power_gain` 0.1, `stability_factor` 0.05 | "Wait for the Storm"; removed by "The Storm Breaks" (and lengthens Out of the Storms to 180 days) |
| `grave_wardens` | The Grave-Wardens | `recruitable_population_factor` 0.1, `land_reinforce_rate` 0.02 | "The Grave-Warden's Order" |
| `tireless_dead_spirit` | The Tireless Dead | `attrition` −0.1, `no_supply_grace` 24, `out_of_supply_factor` −0.15 | "The Tireless Dead" |
| `bound_restless` | The Restless Bound | `recruitable_population_factor` 0.1, `army_org_factor` 0.05 | "Bind the Restless" |
| `host_of_first_age` | A Host Greater Than the First Age | `army_org_factor` 0.1, `army_attack_factor` 0.1, `army_defence_factor` 0.05 | "A Host Greater Than the First Age"; removed when the body breaks |
| `tireless_labour` | Labour That Never Tires | `production_speed_buildings_factor` 0.1, `industrial_capacity_factory` 0.05 | "Labour That Never Tires" |
| `dominion_war_economy` | The Dominion at War | `consumer_goods_factor` −0.05, `production_factory_max_efficiency_factor` 0.05 | "The Dominion at War" |
| `dominion_tribute` | The Dominion's Tribute | `political_power_gain` 0.1 (strength +0.1 per month in the pulse) | "The Dominion's Tribute" |
| `one_dominion` | One Dominion Under Nafeher | `subjects_autonomy_gain` −0.2, `stability_factor` 0.03 | "One Dominion Under Nafeher"; removed when the body breaks |
| `nether_bargain` | The Bargain of This Reign | `political_power_gain` −0.05, `recruitable_population_factor` 0.05 | "Bargain with the King of Demons" |
| `nether_unrest` | Unrest in the Nether | `stability_factor` −0.05 | "Bend the Nether"; 365 days |
| `netherborn_companies_spirit` | Netherborn Companies | `army_attack_factor` 0.05, `recruitable_population_factor` 0.05, `special_forces_cap` 0.05 | "Netherborn Companies" |
| `gates_opened` | The Gates Opened | `army_attack_factor` 0.05, `breakthrough_factor` 0.05 | "The Gates Opened"; removed when the body breaks |
| `abyss_born` | Abyss-Born Companies | `breakthrough_factor` 0.1, `army_defence_factor` 0.03 | "Abyss-Born Companies" |
| `monster_clans_spirit` | The Monster Clans | `army_attack_factor` 0.03, `breakthrough_factor` 0.05 | "The Monster Clans" |
| `pass_breakers` | Pass-Breakers | `army_attack_factor` 0.1, `army_attack_speed_factor` 0.1 | "Storm the Passes"; 180 days |
| `lake_assault` | The Lake Assault | `naval_invasion_planning_bonus_speed` 0.5, `army_attack_factor` 0.05 | "The Lake Towns"; 180 days |
| `dead_garrison_spirit` | A Garrison of the Dead | `required_garrison_factor` −0.25, `resistance_target_on_our_occupied_states` −0.1 | "A Garrison of the Dead" |
| `southern_marches_spirit` | Through the Southern Marches | `army_attack_factor` 0.1 | "Through the Southern Marches"; 180 days |
| `terror_host` | Terror Before the Host | `army_morale_factor` 0.1, `army_attack_against_major_factor` 0.05 | "Terror Before the Host" |
| `siege_of_parim_spirit` | The Siege of Parim | `army_attack_factor` 0.1, `breakthrough_factor` 0.1 | "The Siege of Parim"; 180 days |
| `children_dominion` | The Children of Volgan | `resistance_target_on_our_occupied_states` −0.15, `required_garrison_factor` −0.2, `political_power_gain` 0.2 | "The Children of Volgan" |
| `clash_of_darks` | The Dead Against the Dead | `army_defence_factor` 0.05, `army_attack_factor` 0.05 | "The Dead Against the Dead"; 180 days |
| `two_darks` | Two Darks, One Field | `army_attack_factor` 0.1, `army_defence_factor` 0.05 | "Two Darks, One Field"; removed by `zin_dominion.23` |
| `hunt_the_champion` | Hunt the Champion | `army_morale_factor` 0.1, `war_support_factor` 0.05 | "The Champion of Men"; 180 days |
| `retreat_south` | Hold the Dead Lands | `army_core_defence_factor` 0.2, `war_support_factor` 0.05 | "Hold the Dead Lands" |
| `steward_war` | The Steward's War | `army_org_factor` 0.05 | "The Steward's War"; 180 days |
| `dead_lands_endure_spirit` | The Dead Lands Endure | `stability_factor` 0.1, `political_power_gain` 0.1 | "The Dead Lands Endure" |

When `zin_volgan_destroy_body` runs, it also removes the spirits `host_of_first_age`, `one_dominion`, `gates_opened` and `two_darks`.

## Events (namespace `zin_volgan`)

All are fired by focus or option effects (no trigger, no mean time). Pictures are existing catalog keys; none shows Volgan's face or form (his appearance is an open question). Wanted pictures not yet generated: `nafeher_hall` (a dark hall at Nafeher in storm light, empty seat, ungated) for events 1, 3, 6 and 12, and `abyss_depths` (a stair into red-lit darkness, ungated) for events 7 and 9 to 11; the builder switches when they exist.

| Id | Key | Title | Trigger | Picture | Options (effects; AI weight) |
| --- | --- | --- | --- | --- | --- |
| 1 | `lieutenants` | The Lieutenants Assemble | Focus | `generic_court` | "Let them kneel." (recruit generals `zin_volgan_ember_herald`, `zin_volgan_grave_warden`, `zin_volgan_ghorvak`, characters of the mechanic) |
| 2 | `words_from_nafeher` | Words from Nafeher (to Mirolon) | Focus "The False Quiet" | `mirolon_passes` | "Accept the quiet." (non_aggression with Volgan; `zin_mirolon_add_proof` −5; Volgan veil +5; AI 30 if proof < 40, else 5) / "We know what the quiet hides." (`zin_mirolon_add_proof` +5; Volgan veil −2; AI 70) |
| 3 | `summoned` | Summoned to Nafeher (to a member) | Dominion focuses | `generic_court` | "We come." (oath +5; AI 80 if oath ≥ 40, else 40) / "We come, slowly." (oath −5, the member gains 25 PP; AI 20) |
| 4 | `war_council` | The War-Council | Focus | `generic_war` | "The Dominion marches as one." (flag `zin_volgan_war_council`: the members' AI joins every Volgan war; oath all +5) |
| 5 | `nether_court` | The Court in the Nether | Focus | `dead_lands_storm` | "Speak as a guest." (pact +5; AI 60) / "Speak as a master." (pact +10, stability −0.03; AI 40) |
| 6 | `kings_due` | The King's Due | Focus | `generic_court` | "Pay it." (−100 PP, pact +20; AI 70) / "The Dominion pays no one." (pact −10, strength +2; AI 30) |
| 7 | `abyss_watch` | Watchers at the Abyss | Focus | `dead_lands_storm` | "Watch, and wait." |
| 8 | `abyss_descent` | Into the Abyss (hidden) | Focus | none (hidden) | Fires 9, 10 or 11 with weights 50, 35, 15 |
| 9 | `abyss_answers` | The Depths Answer | 8 | `dead_lands_storm` | "Let them climb." (flag `zin_volgan_abyss_answered`) |
| 10 | `abyss_silent` | The Depths Are Silent | 8 | `dead_lands_storm` | "Another year, then." (+25 PP; call `zin_volgan_abyss_wait`, so the mechanic's decision "Descend Again" opens after 365 days) |
| 11 | `abyss_wrath` | The Depths Answer in Wrath | 8 | `dead_lands_storm` | "Seal the stair." (strength −2, −40 PP; call `zin_volgan_abyss_wait`, so "Descend Again" opens after 365 days) |
| 12 | `empty_setting` | The Empty Setting | Focus | `generic_court` | "A thief from the north, long ago. Let the thief's master keep his prize, for now." The text never names the master. |
| 13 | `envoy_from_the_south` | An Envoy from the South (to Goldoroth) | Focus | `southern_warning` | "Dondor would make fine spoils." (Goldoroth pact +1; AI 30, ×0 when the Dark Lands trigger `zin_goldoroth_refuses_masters` holds) / "Goldoroth bows to no spirit." (Volgan opinion −20; AI 70) |
| 14 | `green_crystal` | The Green Crystal | Focus | `dead_lands_storm` | If `zin_glo_with_eindil`: "Then take it from him." (flag `zin_volgan_seeks_glo`; call `zin_volgan_wargoal_on_bearer`) / otherwise "Watch the cold north for it." (flag `zin_volgan_seeks_glo`) |
| 15 | `word_to_the_mistake` | A Word to the Mistake (to Zol) | Focus "Leave the North to Its Dead" | `black_isles_lights` | "Let the south keep the south." (white peace with Volgan; AI by the Zol spec) / "The dead answer no one." |
| 16 | `champion` | The Champion of Men | Focus | `generic_war` | "Find him." |
| 17 | `what_remains` | What Remains of Volgan | Focus | `volgan_broken` (gate `zin_volgan_body_destroyed`; the focus needs it) | "Rule in his name." (stability +0.05; AI 60) / "Rule as he would." (war_support +0.05; AI 40). The text says no one living can say what remains. |

## Historical AI route

With `zin_rule_historical_path`, weights above make the AI follow this order. Dates are targets for the test run.

| Period | Focuses |
| --- | --- |
| Thaw 1748 to Longnight 1748 | court_of_nafeher, grave_fields, raise_the_veil, southern_dominion, forges_in_the_heat |
| 1749 | old_barrows, deep_barrows, voice_in_the_heat, patient_lord, envoys_to_the_nether, bargain_with_the_king, false_quiet |
| 1750 | storm_coast_wardens, lieutenants_assemble, ledger_of_the_dead, oath_of_demon, dolon_sworn_anew, nezer_confederacy, voices_to_the_dark_lands, gifts_to_the_orc_holds |
| 1751 | rule_through_orders, bone_kilns, grave_warden_order, bone_road, drowned_musters, silence_the_watchers, whispers_in_parim |
| 1752 | rites_of_the_storm, wait_for_the_storm, one_will, the_dominions_tribute, hold_court_at_nafeher, netherborn_companies, old_portals |
| 1753 | dread_doctrine, war_forges, ash_mines, roads_under_storms, heat_hardened_steel, tireless_dead, hosts_without_number |
| 1754 | old_claim (from Deepwinter), dominion_endures, one_dominion_under_nafeher (with its three steps), watchers_at_the_abyss, descend_into_the_abyss |
| Rainwake 1755 | storm_breaks (on `zin_war_of_last_crowns`), old_conquest, war declared on Mirolon |
| Rainwake to Emberleaf 1755 | out_of_the_storms, storm_the_passes, the_lake_towns, mirolon_retaken (when Mirolon falls), dead_garrison (Mirolon's court is in exile, so no client crown) |
| Mistfall 1755 | passes_are_ours, march_north (`zin_volgan_marches`) |
| 1756 | great_muster, volgan_takes_the_field, southern_marches, road_to_parim, dead_of_the_north, dead_against_dead, terror_before_the_host, client_crowns, dominion_at_war |
| 1757 | black_compact, two_darks_one_field, champion_of_men; then, after the body breaks: silent_throne, hold_the_dead_lands |
| 1758 to 1760 | keep_the_oaths, what_remains, dead_lands_endure; leftover economy, Nether and Abyss focuses (fire_of_the_nether, kings_due) when no war focus is open |

The AI never takes `break_the_veil` or `leave_north_to_its_dead` on the historical path. `old_claim` is held until 1754 so the claim does not stir the world early.

## Alternative routes

| Route | How | Result |
| --- | --- | --- |
| The early storm | Break the Veil after 1 Deepwinter 1750 with strength ≥ 70 | War on Mirolon years early; no surprise bonus; Gathering Dark +8 and the world warned. Mirolon may hold the passes. |
| The warlords' Dominion | Rule Through the Warlords | Harder, fewer hosts; better attack, worse recruitment |
| The bent Nether | Bend the Nether | Quick manpower; unrest; gate pact needs the other Nether focuses and the King's Due |
| A Mirolonese client crown | A Client Crown in Mirolon, possible only when Mirolon has no court in exile | One more subject toward Children of Volgan; members' oaths rise |
| The truce with the north | Leave the North to Its Dead | Avoid the clash with Zol if Zol accepts; compact still possible later |
| Children of Volgan | Keep the body intact (Eindil absent, dead, or never restored), take Parim, raise four client crowns, strength ≥ 60 | World systems set the ending |
| The host fights on | After the body breaks, The Host Fights On | Keep fighting with a broken host; high risk of members breaking away |

## Implementation

### Files and builder

| Path | Written by | Content |
| --- | --- | --- |
| `docs/design/focus/volgan.json` | authored data (source of truth) | id `volgan`, tier `major`, countries `["Volgan"]`, in the format of [00_format_and_compiler.md](../00_format_and_compiler.md) |
| `common/national_focus/zin_volgan.txt` | `tools/content/modules/focus_compiler.mjs` (new) | The compiled tree; `country` weight on `original_tag` = Volgan's tag, resolved from the name at build time |
| `common/ideas/zin_focus_volgan.txt` | focus compiler | The spirits above (`zin_volgan_<key>`) |
| `events/zin_volgan.txt` | focus compiler | Namespace `zin_volgan`, the 17 events above |
| `common/scripted_effects/zin_volgan.txt` | focus compiler | The tree's one declared effect, `zin_volgan_wargoal_on_bearer` (the `zin_volgan_tree_*` helpers are the mechanic's) |
| `localisation/english/zin_focus_volgan_l_english.yml` | focus compiler | All text (UTF-8 with BOM, Windows-1252 characters only) |

The compiled tree replaces the interim "Long Peace" tree (`zin_long_peace_*`, written today by `tools/content/modules/vanilla_removal.mjs`) for Volgan. The mechanic's files (`zin_dominion.*`: scripted effects and triggers, decisions, ideas, dynamic modifiers, characters, game rules, `events/zin_dominion.txt`) are written by the mechanic's module (proposed `tools/content/modules/mech_volgan_dominion.mjs`, [volgan_southern_dominion.md](../../04_mechanics/volgan_southern_dominion.md)). The tree adds no character: the three lieutenants are the mechanic's, hidden until event 1 recruits them.

**Start state.** Country history comes from the politics step, so the two start spirits `zin_volgan_long_recovery` and `zin_volgan_storm_girt_realm` are added by the mechanic's startup event `zin_dominion.1` together with the start values (strength 45 per decision V1, veil 85, Nether pact 20).

### Scripted effects and triggers

The helpers named `zin_volgan_tree_<key>` are **defined by the Volgan mechanic** for this tree's focuses (contract pattern; [volgan_southern_dominion.md](../../04_mechanics/volgan_southern_dominion.md) sections 7 and 8), because each one fires or tests the mechanic's own events and variables. The tree only calls them, so it never names a mechanic event in its own data (decision F2):

| Name | Kind | Does |
| --- | --- | --- |
| `zin_volgan_tree_offer_spoils` | effect (mechanic) | `every_country` with flag `zin_region_dark_lands` and `zin_volgan_pact` = 1: `country_event = { id = zin_dominion.8 }`; the mechanic's accept option raises the pact to 2 while Volgan has `zin_volgan_pact_of_spoils` |
| `zin_volgan_tree_offer_oath` | effect (mechanic) | The three Dark Lands countries at `zin_volgan_pact` = 2 with the highest opinion of Volgan: `country_event = { id = zin_dominion.8 }`; acceptance raises the pact to 3 (joins the Southern Dominion) |
| `zin_volgan_tree_offer_compact` | effect (mechanic) | Zol: `country_event = { id = zin_dominion.14 }`, the one offer of the Black Compact (decision O4; acceptance sets `zin_black_compact`, N2); does nothing if `zin_black_compact` is set |
| `zin_volgan_tree_at_war_for_parim` | trigger (mechanic) | Volgan is at war with the controller of the state where `zin_is_site_parim` holds |
| `zin_volgan_tree_holds_parim` | trigger (mechanic) | Volgan or one of its subjects controls the state where `zin_is_site_parim` holds |
| `zin_volgan_tree_compact_open` | trigger (mechanic) | Volgan's body intact, and Volgan and Zol both at war with the country that has character `zin_eindil` |

The tree declares one scripted effect of its own (`scripted_effects` block, written to `common/scripted_effects/zin_volgan.txt`); it fires no mechanic event:

| Name | Kind | Does |
| --- | --- | --- |
| `zin_volgan_wargoal_on_bearer` | effect (tree) | `create_wargoal` `annex_everything` on the country that has character `zin_eindil`, if Volgan or a subject borders it |

### Names the tree uses

| Name | Kind | Owner |
| --- | --- | --- |
| `zin_volgan_add_dominion_strength` ("strength"), `zin_volgan_add_veil` ("veil"), `zin_volgan_add_nether_pact` ("pact"), `zin_volgan_add_oath` ("oath"), `zin_volgan_court_dark_lands`, `zin_volgan_spawn_grave_host`, `zin_volgan_begin_march`, `zin_volgan_take_field`, `zin_volgan_raise_northern_front`, `zin_volgan_wargoal_parim`, `zin_volgan_make_client`, `zin_volgan_steward_rule`, `zin_volgan_abyss_wait` (timed flag for "Descend Again"), `zin_volgan_destroy_body` (removes the spirits named above and calls `mark_focus_tree_layout_dirty`) | scripted effects | the mechanic |
| `zin_volgan_war_open`, `zin_volgan_hosts_ready`, `zin_volgan_great_host`, `zin_volgan_may_break_veil`, `zin_volgan_mirolon_taken`, `zin_volgan_mirolon_clientable`, `zin_volgan_children_ready`, `zin_is_site_parim` | scripted triggers | the mechanic; key sites |
| `zin_mirolon_add_proof`, `zin_world_add_gathering_dark` | scripted effects | the mechanic; world systems |
| `zin_dominion_strength`, `zin_nether_pact`, `zin_volgan_pact` | variables (conditions) | contract; the mechanic |
| `zin_dominion_out_of_the_storms`, `zin_dominion_silent_throne` | mechanic spirits (full ids) | the mechanic |
| `zin_dominion.8`, `zin_dominion.14` | mechanic events, fired only through the mechanic's `zin_volgan_tree_*` helpers | the mechanic |
| `zin_war_of_last_crowns`, `zin_volgan_marches`, `zin_zol_rising`, `zin_volgan_zol_clash`, `zin_eindil_returned`, `zin_glo_with_eindil`, `zin_volgan_body_destroyed`, `zin_black_compact`, `zin_black_compact_ended` | global flags (conditions) | contract; the mechanic |
| `zin_volgan_musters_open`, `zin_volgan_silence_open`, `zin_volgan_whispers_parim`, `zin_volgan_veil_broken`, `zin_volgan_court_open`, `zin_volgan_nether_bargain`, `zin_volgan_nether_bent`, `zin_volgan_gate_pact`, `zin_volgan_abyss_answered`, `zin_volgan_abyss_march`, `zin_volgan_envoys_open`, `zin_volgan_client_crowns`, `zin_volgan_battlefields_open`, `zin_volgan_seeks_glo`, `zin_volgan_children_proclaimed` | country flags (Volgan) | the mechanic's flag list |
| `zin_volgan_bind_open` (opens "Bind the Restless"), `zin_volgan_spoils_promised` (halves the "Grant Spoils" cooldown), `zin_volgan_free_gates` (the next two Nether Gate decisions cost no PP), `zin_volgan_envoys_cheap` (envoys cost 15 PP), `zin_volgan_pact_of_spoils` (acceptance of `zin_dominion.8` raises pact 1 to 2), `zin_volgan_war_council` (Demon, Dolon and Nezer AI join every Volgan war) | country flags set by this tree, read by the mechanic's decisions, events and AI | this tree (reader: the mechanic) |
| `zin_shadow_dread`, `zin_shadow_horde` | stances | foundation ideologies spec |

### Compiler notes

- `oath all +N` compiles to `{ "call": "zin_volgan_add_oath", "args": { "target": "all", "value": N } }`; `oath Demon +N` passes the country.
- "variable zin_dominion_strength above 85" compiles to the variable condition; "0 before 1754.1.1 (hist)" to an AI modifier with `{ "before": "1754.1.1" }` and the foundation's historical-rule trigger.
- `building … capital`, `random_owned`, `random_coastal` are `where` keys; `building infrastructure 1 random_owned (twice)` is two effects.
- The Silent Throne root has `allow_branch` `{ "global_flag": "zin_volgan_body_destroyed" }` (S9).
- `raw` blocks: one (`ash_mines`, because `add_resource` has no compiler form). Limit ten.

### Icons

Every key is from the icon catalog ([02_icon_catalog.md](../02_icon_catalog.md)); the sprites `GFX_focus_zin_<key>` and `GFX_idea_zin_<key>` exist in game today. No icon shows Volgan's figure (his appearance is open). Spirits use the icon of the focus that adds them; the start spirits use `ember_desert` (`storm_girt_realm`) and `grave_field` (`long_recovery`).

| Branch | Focus → icon |
| --- | --- |
| 1 | forges_in_the_heat `forge_anvil`; ash_mines `mine_cart`; bone_kilns `foundry_fire`; roads_under_storms `roads_paved`; war_forges `forge_anvil`; heat_hardened_steel `foundry_fire`; labour_never_tires `workshop_tools`; storm_harbours `shipwright_yard`; iron_for_the_host `mine_cart`; siege_engines `siege_trebuchet`; dominion_at_war `war_council_map`; forges_never_cool `foundry_fire` |
| 2 | grave_fields `grave_field`; old_barrows `grave_host`; deep_barrows `bones_risen`; bone_road `roads_paved`; grave_warden_order `grave_host`; drowned_musters `bones_risen`; tireless_dead `dead_ranks_far`; hosts_without_number `dead_ranks_far`; great_muster `levy_muster`; bind_the_restless `ward_circle`; a_host_greater `banner_black` |
| 3 | raise_the_veil `storm_veil`; storm_coast_wardens `beacon`; false_quiet `olive_branch`; silence_the_watchers `scout_lantern`; whispers_in_parim `eye_watchful`; rites_of_the_storm `storm_veil`; break_the_veil `ember_desert`; wait_for_the_storm `storm_veil`; storm_breaks `war_drums` |
| 4 | court_of_nafeher `dead_crown`; voice_in_the_heat `seal_royal`; patient_lord `book_lore`; lieutenants_assemble `war_council_map`; ledger_of_the_dead `ledger_coins`; hidden_century `scroll_sealed`; rule_through_orders `staff_arcane`; rule_through_warlords `orc_axe`; one_will `sceptre`; dread_doctrine `dead_crown`; old_claim `map_unrolled`; dominion_endures `banner_black` |
| 5 | southern_dominion `banner_league`; oath_of_demon `demon_horn`; dolon_sworn_anew `handshake_oath`; nezer_confederacy `banner_plain`; the_dominions_tribute `tribute_chest`; hold_court_at_nafeher `council_table`; netherborn_levies `demon_horn`; forges_of_dolon `forge_anvil`; nezer_war_bands `war_drums`; one_dominion_under_nafeher `alliance_rings`; dominion_war_council `war_council_map`; spoils_promised `coin_chest` |
| 6 | envoys_to_the_nether `envoy`; bargain_with_the_king `scroll_treaty`; bend_the_nether `nether_gate`; netherborn_companies `demon_horn`; old_portals `nether_gate`; fire_of_the_nether `foundry_fire`; kings_due `tribute_chest`; the_gates_opened `nether_gate` |
| 7 | watchers_at_the_abyss `eye_watchful`; descend_into_the_abyss `abyss_stair`; empty_setting `abyss_stair`; abyss_born_companies `goblin_raiders`; seal_the_depths `ward_circle`; lords_of_the_deep `abyss_stair` |
| 8 | voices_to_the_dark_lands `envoy`; gifts_to_the_orc_holds `orc_axe`; troll_forest_price `troll_club`; goldoroth_question `crown_iron`; monster_clans `goblin_raiders`; not_all_will_answer `banner_plain`; pact_of_spoils `seal_wax`; sworn_to_nafeher `handshake_oath`; second_front_north `war_council_map` |
| 9 | old_conquest `banner_black`; out_of_the_storms `storm_veil`; storm_the_passes `pass_fort`; gates_behind_the_passes `nether_gate`; the_lake_towns `lake_town`; mirolon_retaken `crown_broken`; dead_garrison `grave_host`; client_crown_of_mirolon `crown_iron`; passes_are_ours `mountain_pass` |
| 10 | march_north `dead_ranks_far`; volgan_takes_the_field `war_drums`; southern_marches `roads_paved`; terror_before_the_host `bones_risen`; road_to_parim `palace_parim`; green_crystal `crystal_green`; break_concord_south `chain_broken`; client_crowns `crown_iron`; old_battlefields `grave_field`; siege_of_parim `siege_trebuchet`; throne_in_parim `throne_gold`; children_of_volgan `dead_crown`; monster_and_grave `troll_club` |
| 11 | dead_of_the_north `black_isles`; dead_against_dead `dead_ranks_far`; leave_north_to_its_dead `olive_branch`; black_compact `black_compact`; two_darks_one_field `black_compact`; champion_of_men `lone_sword` |
| 12 | silent_throne `silent_throne`; hold_the_dead_lands `fort_wall`; host_fights_on `banner_black`; keep_the_oaths `handshake_oath`; stewards_war `war_council_map`; what_remains `empty_throne`; dead_lands_endure `ember_desert` |

## AI

- Base weights are in the tables. Under `zin_rule_historical_path` the factors marked "hist" apply, and `break_the_veil` and `leave_north_to_its_dead` get factor 0.
- The AI prefers peace-time branches until `zin_volgan_war_open`; war focuses have weights of 300 to 500 so they are taken as soon as available.
- AI strategies are set by the mechanic (see its AI section).
- If Mirolon holds the passes (Mirolon's country flag `zin_mirolon_holds`, mechanic), the AI keeps mustering (Bind the Restless, Raise a Grave Host) and stays on the Old Conquest until Mirolon falls or a peace is made.

## Acceptance

Build checks (focus compiler and `npm test` in `tools/`):

1. `volgan.json` compiles: 114 focuses, unique keys and positions in columns 0–29 and rows 0–22, every prerequisite and exclusive exists, every focus sits below its prerequisites, the six exclusive pairs (Break the Veil / Wait for the Storm, the Orders / the Warlords, Bargain / Bend, Dead Garrison / Client Crown, the Dead Against the Dead / Leave the North, Hold the Dead Lands / The Host Fights On) are symmetric, every `days` is a multiple of 7, exactly one `raw` block.
2. Every icon is a catalog key and every event picture a picture key; `volgan_broken` is used only by event 17, whose focus needs `zin_volgan_body_destroyed`.
3. Every spirit modifier is in the 1.19.3 modifier documentation; every `call` and `check` resolves to the mechanic's, world systems' or this tree's effects and triggers; every research category is a warfare `zin_cat_*` key or its stated vanilla fallback.
4. Offline scan: no focus reachable on 1 Thaw 4A 1748 without `zin_volgan_war_open` has a `wargoal` or war effect; `old_claim` is the only claim; Break the Veil requires `zin_volgan_may_break_veil` (date ≥ 1750.1.1, strength ≥ 70).
5. Text scan: no Volgan tree text names Afrit, names Eindil without `zin_eindil_returned`, states Roka's fate, places Dardan or states Volgan's fate after his body breaks (compiler secret check plus a read of event 17).
6. HOI4 Agent Tools focus inspector reports no errors; the focus renderer shows the tree within 30 columns.

Isolated Linux run:

7. One in-game year from 1 Thaw 4A 1748: Volgan uses this tree (not `zin_long_peace_*`), starts with `zin_volgan_long_recovery` and `zin_volgan_storm_girt_realm`, takes `court_of_nafeher` first, declares no war; `error.log` has no line from `zin_volgan` files.
8. Historical observer run to 4A 1760 (PROGRAM observer run): Volgan completes `old_conquest` within 60 days of `zin_war_of_last_crowns`, `march_north` in 4A 1755 or early 1756, `black_compact` after `zin_eindil_returned` (`zin_black_compact` set), and `silent_throne` within 60 days of `zin_volgan_body_destroyed`.
9. A run with `zin_eindil` removed (console) reaches `children_of_volgan`.

## Open questions

Each proceeds on the proposal written into the design; the owner's questions are in [../../OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md), section "volgan and mirolon".

1. Should the Orders and the Warlords also change Volgan's stance? **Proceeds on:** no stance change; Volgan keeps `zin_shadow_dread` (owner question 9).
2. Historical Mirolon after its fall: a dead garrison while Mirolon's court is in exile. **Proceeds on:** the dead garrison; the client crown only when no court is in exile (owner question 5).
3. Can the King of Demons' demands turn the Nether against Volgan? **Proceeds on:** no; the Nether is Volgan's realm with the King's court as a pact (owner short list 5, question 8).
4. May the Abyss branch learn more of the necklace after `zin_afrit_revealed`? **Proceeds on:** no; event 12 stays the only Abyss text about the thief (owner question 11).
