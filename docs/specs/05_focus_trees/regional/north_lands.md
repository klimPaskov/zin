# North Lands regional focus trees

**Status:** Draft. **Priority:** 6. **Phase:** 6 (tier B).

## Purpose

This spec gives each of the five tier B countries of the North Lands its own focus tree: Sensai, Mina, R'en, Molot and Eekedor. Lerendor, the united Leren crown, has the major tree ([../major/lerendor.md](../major/lerendor.md)); the twenty-two tier C crowns share [../shared/shared_north_lands.md](../shared/shared_north_lands.md), which also defines the helper effects these trees call.

The North Lands' one question is what the North owes Aenor. These trees play the smaller crowns' side of it through the [Treaty of the Narrow Strait mechanic](../../04_mechanics/lerendor_narrow_strait.md):

- each crown's `zin_leren_lean` (−100 Parim to +100 Sonargur) and Lerendor's hegemony;
- the Leren Compact, Parim's friendship, or a third way;
- R'en's gateway and the strait, the supremacy route's first target;
- the toll quarrel and its arbitration at Eekedor;
- the black ships and Zol's dead on the northern shore ([Zol's Mistake](../../04_mechanics/zols_mistake.md));
- the withdrawal from the old alliance in 4A 1755 and the northern companies in Eindil's coalition ([Eindil's journey](../../04_mechanics/eindil_journey.md)).

## Lore basis

**Established** (vault): the North Lands lie north of the Middle Lands across a narrow strait; Lerendor and Lerenwaith are one crown and lead the Leren Compact with Eekedor (working table); Eekedor, Molot and R'en are named North Lands polities; in the final war rulers in the North Lands withdraw from Aenoran alliances, and the North Lands are not one unanimous enemy; Zol's dead come from the black north through islands and straits and ordinary weapons cannot end them; northern companies join Eindil's temporary coalition without surrendering their independence; competing northern interests remain after the war. The start: the Golden King reigns, Eindil has not appeared, Afrit is unrevealed, Erdae seems at peace.

**Proposed in the vault, used here:** the Treaty of the Narrow Strait (4A 512); the union of the Leren crowns (4A 411); the toll quarrel of 4A 1716; island fishermen's tales of black ships (4A 1744); the withdrawal in 4A 1755.

**Proposed in the specs, used here:** the roster roles (Sensai the most populous crown, R'en the southern gateway between the Leren and Aenor seas, Molot the marcher state balancing Lerendor, Eekedor the eastern commercial republic); the start leans; the arbitration of Eekedor; rulers' names from [02_characters.md](../../02_lore/02_characters.md).

**Proposed here:** every focus, spirit, event, advisor and number; the Delvings of Mina; Sensai's timber halls and its Free Crowns of the North; the pilots of R'en; the margraves of Molot; Eekedor's counting houses.

**Kept open:** who wins the War of the Last Crowns and what treaty the North signs after it; whether the smaller crowns withdraw on their own or only through Lerendor (Lerendor spec's open question; here it is each crown's choice); anything about Zol's servants or who administers the Mistake.

## Design

### Rules for every tree in this file

1. **Peace at the start.** On 1 Thaw 4A 1748 every available focus is about courts, timber, mines, harbours, envoys, ledgers or watch-fires. No focus makes a war goal or a claim. War branches open only from `zin_zol_rising`, `zin_war_of_last_crowns`, `zin_leren_withdrawal`, `zin_eindil_returned` or being at war.
2. **The secret.** No text names Afrit or the Hidden Council. Aenor's new king is "King Aurevan" or "the new king in Parim".
3. **Eindil.** Focus text never contains "Eindil"; it says "the Heir".
4. **Zol.** The black ships are rumours; no text names a servant of Zol, an administrator of the Mistake, or Zol in a form. Before `zin_zol_rising` the shore branches give flags and forts, never a war.
5. **Lean.** Every change to a crown's lean goes through `zin_leren_add_lean` on that crown.

### Effect notation

As in [middle_lands.md](middle_lands.md#effect-notation), plus:

| Shorthand | Means |
| --- | --- |
| `lean(v)` | `call zin_leren_add_lean {value: v}` on ROOT (positive toward Sonargur) |
| `standing(v)` | `call zin_leren_add_strait_standing {value: v}` (does nothing once the treaty is ended) |
| `lean ≥ n` | `available`: ROOT's `zin_leren_lean` above n − 1 |
| `ask_compact` | `call zin_north_ask_compact_seat`: fires `zin_shared_north_lands.1` to Lerendor (shared spec) |
| `ask_parim` | `call zin_north_ask_parim_shield`: fires `zin_shared_north_lands.2` to the Aenor realm holding Parim (shared spec) |
| `Shore` | `available`: any of `zin_zol_rising`, `zin_war_of_last_crowns`, `zin_leren_withdrawal`, or `at_war` |
| `End` | `available`: any of `zin_zol_withdrawn`, `zin_eindil_crowned`, `zin_afrit_dead`, or (not `at_war` and after `1758.3.1`) |

Prerequisites: `a + b` and; `a / b` or. **Bold** names are key focuses. AI defaults as in the Middle Lands file; "hist" means `zin_rules_is_historical`.

---

## 1. Sensai

| Item | Value |
| --- | --- |
| Tree id | `regional_sensai` (focus ids `zin_regional_sensai_<key>`) |
| Country | Sensai (North Lands; 7 states; men; Wild, Freeholds; independent) |
| Focuses | 36; columns 0–17 |
| Events | `zin_regional_sensai` |
| Start values | `zin_leren_lean` −5; `zin_footholds` 1 |

### Situation in 4A 1748

Sensai is the most populous crown of the North Lands: seven states of forest, tar-pits and shipyards, ruled by Lady Agniya from the timber halls of her capital (proposed). Its great houses are proud and many; its timber builds half the North's ships, Lerendor's included. Sonargur courts Sensai and taxes its timber at the strait; Parim buys its tar and flatters its lady. Sensai answers, by its own saying, to no crown. The North is at peace, and Sensai means to stay rich in it.

### Role in the story

- **Historical path:** Lerendor's *The Sensai Question* (event `zin_lerendor.7`, 4A 1752–1753) may win friendship or meet refusal (AI chance 50 + lean). The historical AI takes the third way and keeps Sensai its own; when Zol's dead reach the northern shore (4A 1755) Sensai holds its coast; some of its companies join the Heir's coalition in 4A 1757.
- **War of the Last Crowns:** the North's largest reserve of men; the decisive vote between Sonargur and Parim.
- **Alternatives:** Sensai in the Leren Compact (Lerendor's hegemony leaps); Sensai as Parim's friend under an Aenoran guarantee; Sensai at the head of the Free Crowns of the North.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Sensai>_zin_ruler` | Lady Agniya of Sensai | Country leader | `zin_trait_lawspeaker` |
| `zin_regional_sensai_kesh` | Steward Borislav Kesh | Political advisor | `zin_adv_treasurer` |
| `zin_regional_sensai_orlan` | Ship-Master Veda Orlan | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_sensai_vel` | Hall-Speaker Dmitar Vel | Political advisor | `zin_adv_envoy` |
| `zin_regional_sensai_gord` | Voivode Stanek Gord | Corps commander | skill 3; `organizer`, `winter_specialist` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Pride of Sensai | 0–4 | start | 8 |
| B | Timber and Tar | 5–7 | start | 7 |
| C | The Sensai Host | 9–11 | start | 7 |
| D | Between Sonargur and Parim | 13–17 | start | 8 |
| E | The Northern Shore | 6–10 | Shore | 6 |

### Focuses

| Br. | Key | Name | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_pride_of_sensai` | **The Pride of Sensai** | — | — | 2,0 | 35 | pp 50; spirit `pride_of_sensai` |
| A | `the_timber_halls` | The Timber Halls | the_pride_of_sensai | — | 1,1 | 70 | pp 25; stab 0.03 |
| A | `the_lady_rides_out` | The Lady Rides Out | the_pride_of_sensai | — | 3,1 | 35 | event `the_ladys_progress` |
| A | `houses_of_sensai` | The Great Houses | the_timber_halls | — | 0,2 | 70 | spirit `great_houses` |
| A | `law_of_the_north_shore` | Law of the North Shore | the_timber_halls / the_lady_rides_out | — | 2,2 | 70 | stab 0.05 |
| A | `temples_in_the_halls` | Temples in the Halls | the_lady_rides_out | — | 4,2 | 35 | event `temples_in_the_halls` |
| A | `one_hall_many_hearths` | One Hall, Many Hearths | houses_of_sensai + law_of_the_north_shore | — | 1,3 | 70 | swap pride_of_sensai→pride_of_sensai_2 |
| A | `answers_to_no_crown` | **Sensai Answers to No Crown** | law_of_the_north_shore / temples_in_the_halls | — | 3,3 | 70 | spirit `no_crown_above`; flag `zin_sensai_no_crown` |
| B | `timber_and_tar` | **Timber and Tar** | — | — | 6,0 | 70 | bld industrial_complex 1 @capital |
| B | `the_great_forests` | The Great Forests | timber_and_tar | — | 5,1 | 70 | bld industrial_complex 1 @random_owned |
| B | `shipwrights_of_sensai` | Shipwrights of Sensai | timber_and_tar | — | 7,1 | 70 | bld dockyard 1 @random_coastal; res [zin_cat_galleys] 0.5 ×1 |
| B | `tar_and_rope` | Tar and Rope | the_great_forests | — | 5,2 | 35 | spirit `tar_and_rope` |
| B | `timber_for_the_world` | Timber for the World | shipwrights_of_sensai | — | 7,2 | 70 | spirit `timber_trade` |
| B | `iron_of_the_north` | Iron of the North | tar_and_rope / timber_for_the_world | — | 6,3 | 70 | bld arms_factory 1 @random_owned |
| B | `the_wealth_of_sensai` | The Wealth of Sensai | iron_of_the_north | — | 6,4 | 70 | bld industrial_complex 1 @random_owned ×2 |
| C | `the_sensai_host` | The Sensai Host | — | — | 10,0 | 70 | army_xp 10; res [zin_cat_arms] 0.5 ×1 |
| C | `many_hearths_muster` | The Many Hearths Muster | the_sensai_host | — | 9,1 | 70 | mp 3000; spirit `hearth_muster` |
| C | `shore_wardens` | Shore Wardens | the_sensai_host | — | 11,1 | 70 | bld coastal_bunker 1 @random_coastal |
| C | `axes_and_shields` | Axes and Shields | many_hearths_muster | — | 9,2 | 70 | res [zin_cat_arms] 0.5 ×1; res [zin_cat_armour] 0.5 ×1 |
| C | `the_fleet_of_sensai` | The Fleet of Sensai | shore_wardens | — | 11,2 | 70 | navy_xp 10; res [zin_cat_warships] 0.5 ×1 |
| C | `the_voivodes` | The Voivodes | axes_and_shields / the_fleet_of_sensai | — | 10,3 | 70 | spirit `voivodes` |
| C | `the_host_of_many` | The Host of Many | the_voivodes | — | 10,4 | 70 | swap hearth_muster→hearth_muster_2 (adds if missing) |
| D | `between_two_masters` | **Between Two Masters** | — | — | 15,0 | 35 | pp 25 |
| D | `friendship_with_sonargur` | Friendship with Sonargur | between_two_masters | parims_old_friend, a_third_way | 13,1 | 70 | lean(20); event_for Lerendor `sensai_friendship` |
| D | `parims_old_friend` | Parim's Old Friend | between_two_masters | friendship_with_sonargur, a_third_way | 15,1 | 70 | lean(−20); event_for the Aenor realm holding Parim `sensai_friendship_parim` |
| D | `a_third_way` | **A Third Way** | between_two_masters | friendship_with_sonargur, parims_old_friend | 17,1 | 70 | `call zin_regional_sensai_centre_lean` (lean moves halfway toward 0); spirit `third_way` |
| D | `a_seat_in_the_compact` | A Seat in the Compact | friendship_with_sonargur | — | 13,2 | 35 | Avail: lean ≥ 50; ROOT in no faction. ask_compact |
| D | `parims_guarantee` | Parim's Guarantee | parims_old_friend | — | 15,2 | 35 | ask_parim |
| D | `the_free_crowns_of_the_north` | **The Free Crowns of the North** | a_third_way | — | 17,2 | 70 | Avail: (`zin_golden_king_dead` or after 1751.3.1); ROOT in no faction; lean between −40 and 40. `faction` "The Free Crowns of the North" (template `zin_faction_free_north`); flag `zin_sensai_free_crowns` |
| D | `call_the_small_crowns` | Call the Small Crowns | the_free_crowns_of_the_north | — | 17,3 | 70 | `call zin_regional_sensai_call_crowns`; pp 25 |
| E | `the_shore_burns` | **The Shore Burns** | — | — | 8,6 | 35 | Avail: Shore. ws 0.10; spirit `shore_burns` |
| E | `fire_on_the_beaches` | Fire on the Beaches | the_shore_burns | — | 6,7 | 70 | Avail: `zin_zol_rising`. bld coastal_bunker 1 @random_coastal ×2; army_xp 10 |
| E | `stand_with_sonargur` | Stand with Sonargur | the_shore_burns | keep_faith_with_parim | 8,7 | 35 | Avail: `zin_leren_withdrawal`. lean(15); stab 0.03 |
| E | `keep_faith_with_parim` | Keep Faith with Parim | the_shore_burns | stand_with_sonargur | 10,7 | 35 | Avail: `zin_leren_withdrawal`; an Aenor realm holds Parim. lean(−20); event_for that realm `sensai_keeps_faith` |
| E | `northern_companies` | Northern Companies | fire_on_the_beaches / stand_with_sonargur | — | 7,8 | 70 | Avail: `zin_eindil_returned`. coalition; regard(10); army_xp 10 |
| E | `the_shore_holds` | The Shore Holds | stand_with_sonargur / keep_faith_with_parim | — | 9,8 | 70 | Avail: End. stab 0.10; remove `shore_burns` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `pride_of_sensai` | The Pride of Sensai | `political_power_gain` 0.10, `war_support_factor` 0.03 |
| `pride_of_sensai_2` | One Hall, Many Hearths | `political_power_gain` 0.15, `war_support_factor` 0.05, `stability_factor` 0.05 |
| `great_houses` | The Great Houses | `stability_factor` 0.03, `political_power_factor` 0.05 |
| `no_crown_above` | No Crown Above Ours | `drift_defence_factor` 0.20, `stability_factor` 0.03 |
| `tar_and_rope` | Tar and Rope | `production_speed_dockyard_factor` 0.10 |
| `timber_trade` | Timber for the World | `trade_opinion_factor` 0.15 |
| `hearth_muster` | The Many Hearths Muster | `conscription_factor` 0.05 |
| `hearth_muster_2` | The Host of Many | `conscription_factor` 0.10, `recruitable_population_factor` 0.05 |
| `voivodes` | The Voivodes | `army_org_factor` 0.05, `army_leader_start_level` 1 |
| `third_way` | A Third Way | `political_power_gain` 0.10, `drift_defence_factor` 0.10 |
| `shore_burns` | The Shore Burns | `army_core_defence_factor` 0.10, `coastal_bunker_effectiveness_factor` 0.15 |

### Events (`zin_regional_sensai`)

| Key (id) | Title | To | Options |
| --- | --- | --- | --- |
| `the_ladys_progress` (1) | The Lady Rides Out | Sensai | **Feast the great houses** (pp −25; stab 0.03) / **Hear the hearths** (pp 25) |
| `temples_in_the_halls` (2) | Temples in the Halls | Sensai | **Endow the almoners** (footholds(1); stab 0.02) / **The halls have their own priests** (nothing; AI hist 60) |
| `sensai_friendship` (3) | Sensai Offers Friendship | Lerendor | **Welcome it** (opinion +15 both ways; Sensai lean(5); AI 80) / **Sensai should ask for the Compact** (nothing) |
| `sensai_friendship_parim` (4) | Sensai Remembers Parim | Aenor realm | **Send gifts** (pp −25; opinion +15 both ways; AI 60) / **The North is far** |
| `free_crowns_invite` (5) | The Free Crowns of the North | each crown called | **Join the Free Crowns** (join Sensai's faction; AI 30 + 50 if lean between −20 and 20) / **We stand alone** |
| `sensai_keeps_faith` (6) | Sensai Keeps Faith | Aenor realm | **Accept the companies** (guarantee Sensai; military access both ways; opinion +25; AI 70) / **Parim needs no northern swords** |

### Tree scripts

| Name | Kind | Does |
| --- | --- | --- |
| `zin_regional_sensai_centre_lean` | scripted effect | Reads ROOT's lean and calls `zin_leren_add_lean` with minus half of it |
| `zin_regional_sensai_call_crowns` | scripted effect | Fires `free_crowns_invite` to every North Lands country (`zin_region_north_lands` flag) except Lerendor that is in no faction and has lean between −40 and 40 |

### AI

| Period | Historical route |
| --- | --- |
| 1748–1749 | the_pride_of_sensai, timber_and_tar, the_timber_halls, the_great_forests, shipwrights_of_sensai, between_two_masters |
| 1750–1751 | the_lady_rides_out, law_of_the_north_shore, tar_and_rope, timber_for_the_world, the_sensai_host |
| 1752–1754 | a_third_way (hist), houses_of_sensai, answers_to_no_crown, iron_of_the_north, many_hearths_muster, shore_wardens, one_hall_many_hearths |
| 1755–1756 | the_shore_burns, fire_on_the_beaches, stand_with_sonargur (hist), the_wealth_of_sensai |
| 1757– | northern_companies; the_shore_holds at the end |

Never hist: the_free_crowns_of_the_north, keep_faith_with_parim. Under `FREE`: friendship_with_sonargur if lean ≥ 10 after Lerendor's event; parims_old_friend if lean ≤ −10; the Free Crowns when Lerendor is on the supremacy route.

---

## 2. Mina

| Item | Value |
| --- | --- |
| Tree id | `regional_mina` |
| Country | Mina (North Lands; 4 states; men; Wild, Freeholds; independent) |
| Focuses | 32; columns 0–16 |
| Events | `zin_regional_mina` |
| Start values | lean 15; footholds 1 |

### Situation in 4A 1748

Mina is a crown of hills and mines: four states where the Delvings of Mina (proposed) give iron and stone that river barges carry to Sonargur's forges. Lord Etonar governs through a hill moot of reeves and smelt-masters. Mina leans toward Sonargur because Sonargur buys its iron, and it is friends with its neighbour The Hold. The North is quiet; the forges are busy.

### Role in the story

- **Historical path:** Lerendor's envoys win Mina early; it joins the Leren Compact in 4A 1752–1753 (Lerendor's historical route) and its iron arms the Long Watch. Its hill wardens hold the passes when the dead come, and some of its companies go to the Heir in 4A 1757.
- **War of the Last Crowns:** the iron of the North's defence.
- **Alternatives:** Mina sells to Parim and stays out of the Compact.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Mina>_zin_ruler` | Lord Etonar of Mina | Country leader | `zin_trait_caravan_broker` |
| `zin_regional_mina_marsh` | Delve-Reeve Ottila Marsh | Political advisor | `zin_adv_road_warden` |
| `zin_regional_mina_kolm` | Smelt-Master Ivar Kolm | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_mina_ruud` | Old Warden Hagen Ruud | Political advisor | `zin_adv_muster_master` |
| `zin_regional_mina_varn` | Captain Lisbet Varn | Corps commander | skill 2; `hill_fighter` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Lord of Mina | 0–2 | start | 6 |
| B | The Delvings | 4–8 | start | 8 |
| C | Hill Wardens | 9–11 | start | 6 |
| D | Sonargur's Friend | 13–16 | start | 7 |
| E | The Hills Arm | 5–9 | Shore | 5 |

### Focuses

| Br. | Key | Name | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_lord_of_mina` | **The Lord of Mina** | — | — | 1,0 | 35 | pp 50; spirit `lords_of_the_delvings` |
| A | `the_hill_moot` | The Hill Moot | the_lord_of_mina | — | 0,1 | 70 | stab 0.03; pp 25 |
| A | `chapels_in_the_hills` | Chapels in the Hills | the_lord_of_mina | — | 2,1 | 35 | event `chapel_in_the_hills` |
| A | `the_reeves_law` | The Reeves' Law | the_hill_moot | — | 0,2 | 70 | swap lords_of_the_delvings→lords_of_the_delvings_2 |
| A | `ledgers_of_iron` | Ledgers of Iron | chapels_in_the_hills | — | 2,2 | 70 | pp 50 |
| A | `mina_united` | Mina United | the_reeves_law / ledgers_of_iron | — | 1,3 | 70 | pp 50; stab 0.05 |
| B | `the_delvings` | **The Delvings** | — | — | 6,0 | 70 | bld industrial_complex 1 @capital |
| B | `deep_shafts` | Deep Shafts | the_delvings | — | 4,1 | 70 | bld industrial_complex 1 @random_owned; spirit `deep_shafts` |
| B | `river_barges` | River Barges | the_delvings | — | 6,1 | 70 | bld infrastructure 1 @random_owned ×2 |
| B | `smelting_halls` | Smelting Halls | the_delvings | — | 8,1 | 70 | bld arms_factory 1 @capital |
| B | `iron_for_sonargur` | Iron for Sonargur | deep_shafts / river_barges | iron_for_parim | 5,2 | 35 | lean(10); event_for Lerendor `iron_contract` |
| B | `iron_for_parim` | Iron for Parim | river_barges / smelting_halls | iron_for_sonargur | 7,2 | 35 | lean(−10); event_for the Aenor realm holding Parim `iron_contract` |
| B | `quarries_of_mina` | The Quarries of Mina | smelting_halls | — | 8,3 | 70 | bld industrial_complex 1 @random_owned |
| B | `the_iron_hills` | The Iron Hills | iron_for_sonargur / iron_for_parim | — | 6,3 | 70 | swap deep_shafts→deep_shafts_2 (adds if missing) |
| C | `hill_wardens` | **Hill Wardens** | — | — | 10,0 | 70 | army_xp 10; res [zin_cat_arms] 0.5 ×1 |
| C | `hill_companies` | Hill Companies | hill_wardens | — | 9,1 | 70 | res [zin_cat_arms] 0.5 ×1; spirit `hill_wardens` |
| C | `pikes_of_mina_iron` | Pikes of Mina Iron | hill_wardens | — | 11,1 | 70 | eq 1000; res [zin_cat_armour] 0.5 ×1 |
| C | `forts_in_the_passes` | Forts in the Passes | hill_companies | — | 9,2 | 70 | bld bunker 1 @random_owned ×2 |
| C | `the_mina_levy` | The Mina Levy | pikes_of_mina_iron | — | 11,2 | 70 | mp 2000 |
| C | `wardens_of_the_hills` | Wardens of the Hills | forts_in_the_passes / the_mina_levy | — | 10,3 | 70 | swap hill_wardens→hill_wardens_2 (adds if missing) |
| D | `sonargurs_friend` | Sonargur's Friend | — | — | 14,0 | 35 | lean(10) |
| D | `envoys_to_the_hold` | Envoys to The Hold | sonargurs_friend | — | 13,1 | 35 | Avail: exists The Hold. event_for The Hold `mina_envoys` |
| D | `a_seat_in_the_compact` | **A Seat in the Compact** | sonargurs_friend | mina_keeps_its_name | 15,1 | 35 | Avail: lean ≥ 50; ROOT in no faction. ask_compact |
| D | `the_hill_road_pact` | The Hill Road Pact | envoys_to_the_hold | — | 13,2 | 70 | spirit `hill_road_pact` |
| D | `compact_iron` | Compact Iron | a_seat_in_the_compact | — | 15,2 | 70 | Avail: in a faction with Lerendor. lean(10); bld arms_factory 1 @random_owned |
| D | `mina_keeps_its_name` | Mina Keeps Its Name | sonargurs_friend | a_seat_in_the_compact | 16,1 | 35 | spirit `own_counsel_mina` |
| D | `the_watch_shared` | The Watch Shared | the_hill_road_pact / compact_iron / mina_keeps_its_name | — | 14,3 | 70 | army_xp 5; spirit `shared_watch` |
| E | `the_hills_arm` | **The Hills Arm** | — | — | 7,5 | 35 | Avail: Shore. ws 0.10; spirit `hills_arm` |
| E | `iron_for_the_watch` | Iron for the Watch | the_hills_arm | — | 5,6 | 70 | eq 1500; if in a faction with Lerendor: `for_country Lerendor: equipment infantry_equipment 1000` |
| E | `hold_the_hills` | Hold the Hills | the_hills_arm | — | 7,6 | 70 | bld bunker 2 @capital |
| E | `miners_with_the_heir` | Miners with the Heir | the_hills_arm | — | 9,6 | 70 | Avail: `zin_eindil_returned`. coalition; regard(10) |
| E | `the_delvings_reopen` | The Delvings Reopen | iron_for_the_watch / hold_the_hills / miners_with_the_heir | — | 7,7 | 70 | Avail: End. stab 0.10; remove `hills_arm` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `lords_of_the_delvings` | Lords of the Delvings | `political_power_gain` 0.05, `stability_factor` 0.03 |
| `lords_of_the_delvings_2` | The Reeves' Law | `political_power_gain` 0.10, `stability_factor` 0.05 |
| `deep_shafts` | Deep Shafts | `production_factory_efficiency_gain_factor` 0.05 |
| `deep_shafts_2` | The Iron Hills | `production_factory_efficiency_gain_factor` 0.10, `production_factory_max_efficiency_factor` 0.03 |
| `hill_wardens` | Hill Companies | `army_defence_factor` 0.05 |
| `hill_wardens_2` | Wardens of the Hills | `army_defence_factor` 0.10, `dig_in_speed_factor` 0.10 |
| `hill_road_pact` | The Hill Road Pact | `trade_opinion_factor` 0.10 |
| `own_counsel_mina` | Mina Keeps Its Name | `drift_defence_factor` 0.15, `political_power_gain` 0.05 |
| `shared_watch` | The Watch Shared | `army_intel_factor` 0.10 |
| `hills_arm` | The Hills Arm | `army_core_defence_factor` 0.10, `war_support_factor` 0.05 |

### Events (`zin_regional_mina`)

| Key (id) | Title | To | Options |
| --- | --- | --- | --- |
| `chapel_in_the_hills` (1) | A Chapel in the Hills | Mina | **Let the almoners build** (footholds(1); stab 0.02; AI hist) / **The reeves say no** |
| `iron_contract` (2) | Iron from Mina | Lerendor or the Aenor realm | **Buy the iron** (buyer pp −25; Mina pp 50; opinion +10 both ways; AI 70) / **We have our own** (Mina lean moves 5 away from the refuser) |
| `mina_envoys` (3) | Envoys from Mina | The Hold | **Share the hill roads** (non-aggression with Mina; opinion +15 both ways; AI 70) / **The Hold keeps its roads** |

### AI

Historical: B, A, C; iron_for_sonargur (hist), sonargurs_friend, envoys_to_the_hold, the_hill_road_pact; a_seat_in_the_compact in 4A 1752 (Lerendor's invitation may come first; either way Mina joins); compact_iron; E when available; miners_with_the_heir in 1757. Never hist: iron_for_parim, mina_keeps_its_name.

---

## 3. R'en

| Item | Value |
| --- | --- |
| Tree id | `regional_r_en` |
| Country | R'en (North Lands; 3 states; men; Wild, Freeholds; independent) |
| Focuses | 36; columns 0–17 |
| Events | `zin_regional_r_en` |
| Start values | lean −25; footholds 1 |

### Situation in 4A 1748

R'en holds the southern gateway between the Leren sea and the Aenoran sea: three states of capes, harbours and pilots' towns on the Sea of R'en. Its harbour houses live on Aenoran trade; its pilots take ships through waters that only they know (proposed). R'en pays Sonargur's strait dues like everyone else and remembers being squeezed between the strait's two masters. Prince Renan wants one thing: that neither master ever needs his harbours badly enough to take them.

### Role in the story

- **Historical path:** R'en stays neutral and leans to Parim; when Lerendor withdraws from the treaty (4A 1755) and closes the strait to belligerents, R'en's harbours empty and its pilots sell passage; it holds its capes against the black hulls. On Lerendor's supremacy route (not history) R'en is the first target: protection or claims.
- **War of the Last Crowns:** the gateway every fleet wants.
- **Alternatives:** R'en under Parim's guarantee, under the Leren banner, or as an open gateway for every flag.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<R'en>_zin_ruler` | Prince Renan of R'en | Country leader | `zin_trait_port_master` |
| `zin_regional_r_en_varrel` | Pilot-Master Aske Varrel | Political advisor | `zin_adv_envoy` |
| `zin_regional_r_en_dross` | Harbour-Factor Ilma Dross | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_r_en_hale` | Gatekeeper Torun Hale | Political advisor | `zin_adv_muster_master` |
| `zin_regional_r_en_marrow` | Captain Sef Marrow | Navy leader | skill 3; `green_water_expert` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Gateway Court | 0–2 | start | 7 |
| B | Pilots and Harbours | 4–8 | start | 8 |
| C | The Gateway Forts | 9–11 | start | 7 |
| D | Between the Two Masters | 13–17 | start | 8 |
| E | When the Strait Closes | 6–10 | Shore | 6 |

### Focuses

| Br. | Key | Name | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_gateway_court` | **The Gateway Court** | — | — | 1,0 | 35 | pp 50; spirit `gateway_court` |
| A | `harbour_houses` | The Harbour Houses | the_gateway_court | — | 0,1 | 70 | stab 0.03 |
| A | `the_princes_peace` | The Prince's Peace | the_gateway_court | — | 2,1 | 35 | stab 0.03; pp 25 |
| A | `seats_for_the_harbour_houses` | Seats for the Harbour Houses | harbour_houses | — | 0,2 | 70 | swap gateway_court→gateway_court_2 |
| A | `temples_on_the_quay` | Temples on the Quay | the_princes_peace | — | 2,2 | 35 | event `temples_on_the_quay` |
| A | `neutral_waters` | **Neutral Waters** | seats_for_the_harbour_houses / temples_on_the_quay | — | 1,3 | 70 | spirit `neutral_waters`; flag `zin_r_en_neutral` |
| A | `the_gateway_endures` | The Gateway Endures | neutral_waters | — | 1,4 | 70 | pp 75; stab 0.05 |
| B | `pilots_of_the_gateway` | **Pilots of the Gateway** | — | — | 6,0 | 70 | navy_xp 5; spirit `gateway_pilots` |
| B | `harbour_dues` | Harbour Dues | pilots_of_the_gateway | — | 4,1 | 35 | pp 50; spirit `harbour_dues` |
| B | `quays_and_cranes` | Quays and Cranes | pilots_of_the_gateway | — | 6,1 | 70 | bld naval_base 1 @random_coastal; bld dockyard 1 @random_coastal |
| B | `the_aenoran_trade` | The Aenoran Trade | pilots_of_the_gateway | — | 8,1 | 70 | lean(−5); spirit `aenoran_trade` |
| B | `charts_of_the_two_seas` | Charts of the Two Seas | harbour_dues / quays_and_cranes | — | 5,2 | 70 | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 |
| B | `ropewalks` | Ropewalks | quays_and_cranes | — | 7,2 | 70 | bld industrial_complex 1 @capital |
| B | `the_warehouse_quarter` | The Warehouse Quarter | the_aenoran_trade | — | 8,2 | 70 | bld industrial_complex 1 @random_owned |
| B | `masters_of_the_gateway_waters` | Masters of the Gateway Waters | charts_of_the_two_seas + ropewalks | — | 6,3 | 70 | swap gateway_pilots→gateway_pilots_2 |
| C | `the_gateway_forts` | The Gateway Forts | — | — | 10,0 | 70 | bld coastal_bunker 1 @random_coastal |
| C | `sea_soldiers_of_r_en` | Sea Soldiers of R'en | the_gateway_forts | — | 9,1 | 70 | army_xp 10; res [zin_cat_arms] 0.5 ×1 |
| C | `towers_on_the_capes` | Towers on the Capes | the_gateway_forts | — | 11,1 | 70 | bld coastal_bunker 1 @random_coastal ×2 |
| C | `the_galley_watch` | The Galley Watch | sea_soldiers_of_r_en | — | 9,2 | 70 | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 |
| C | `chains_across_the_gateway` | Chains Across the Gateway | towers_on_the_capes | — | 11,2 | 70 | bld coastal_bunker 1 @capital; spirit `gateway_chains` |
| C | `the_harbour_levy` | The Harbour Levy | the_galley_watch / chains_across_the_gateway | — | 10,3 | 70 | mp 2000 |
| C | `the_gateway_bastion` | The Gateway Bastion | the_harbour_levy | — | 10,4 | 70 | bld bunker 1 @capital; bld coastal_bunker 1 @capital |
| D | `between_the_two_masters` | **Between the Two Masters** | — | — | 15,0 | 35 | pp 25 |
| D | `parims_friend` | Parim's Friend | between_the_two_masters | sonargurs_pilots, the_free_gateway | 13,1 | 70 | lean(−15); event_for the Aenor realm holding Parim `r_en_friendship` |
| D | `sonargurs_pilots` | Sonargur's Pilots | between_the_two_masters | parims_friend, the_free_gateway | 15,1 | 70 | lean(20); event_for Lerendor `r_en_overture` |
| D | `the_free_gateway` | The Free Gateway | between_the_two_masters | parims_friend, sonargurs_pilots | 17,1 | 70 | `call zin_regional_r_en_centre_lean`; spirit `free_gateway` |
| D | `a_shield_from_parim` | A Shield from Parim | parims_friend | — | 13,2 | 35 | ask_parim |
| D | `under_the_leren_banner` | Under the Leren Banner | sonargurs_pilots | — | 15,2 | 35 | Avail: lean ≥ 60. event_for Lerendor `r_en_asks_protection` |
| D | `open_to_every_flag` | Open to Every Flag | the_free_gateway | — | 17,2 | 70 | swap free_gateway→free_gateway_2 |
| D | `the_gateway_question` | The Gateway Question | a_shield_from_parim / under_the_leren_banner / open_to_every_flag | — | 15,3 | 70 | pp 50; stab 0.05 |
| E | `the_strait_closes` | **The Strait Closes** | — | — | 8,6 | 35 | Avail: Shore. ws 0.10; spirit `gateway_at_war` |
| E | `hold_the_gateway` | Hold the Gateway | the_strait_closes | — | 6,7 | 70 | bld coastal_bunker 1 @random_coastal ×2; mp 2000 |
| E | `a_price_for_passage` | A Price for Passage | the_strait_closes | — | 8,7 | 35 | Avail: `zin_leren_withdrawal`. pp 75; timed `wartime_pilots` 365 |
| E | `against_the_black_hulls` | Against the Black Hulls | the_strait_closes | — | 10,7 | 70 | Avail: `zin_zol_rising`. army_xp 10; navy_xp 10; bld coastal_bunker 1 @random_coastal |
| E | `gateway_companies` | Gateway Companies for the Heir | hold_the_gateway / a_price_for_passage | — | 7,8 | 70 | Avail: `zin_eindil_returned`. coalition; regard(10) |
| E | `the_gateway_reopens` | The Gateway Reopens | a_price_for_passage / against_the_black_hulls | — | 9,8 | 70 | Avail: End. stab 0.10; remove `gateway_at_war` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `gateway_court` | The Gateway Court | `trade_opinion_factor` 0.10, `political_power_gain` 0.05 |
| `gateway_court_2` | Seats for the Harbour Houses | `trade_opinion_factor` 0.15, `political_power_gain` 0.10 |
| `neutral_waters` | Neutral Waters | `drift_defence_factor` 0.10, `justify_war_goal_time` 0.25 |
| `gateway_pilots` | Pilots of the Gateway | `naval_speed_factor` 0.05, `navy_org_factor` 0.03 |
| `gateway_pilots_2` | Masters of the Gateway Waters | `naval_speed_factor` 0.10, `navy_org_factor` 0.05, `naval_detection` 0.10 |
| `harbour_dues` | Harbour Dues | `political_power_gain` 0.05 |
| `aenoran_trade` | The Aenoran Trade | `trade_opinion_factor` 0.15, `consumer_goods_factor` −0.02 |
| `gateway_chains` | Chains Across the Gateway | `coastal_bunker_effectiveness_factor` 0.15 |
| `free_gateway` | The Free Gateway | `drift_defence_factor` 0.15, `trade_opinion_factor` 0.10 |
| `free_gateway_2` | Open to Every Flag | `drift_defence_factor` 0.15, `trade_opinion_factor` 0.20, `political_power_gain` 0.05 |
| `gateway_at_war` | The Strait Closes | `coastal_bunker_effectiveness_factor` 0.15, `army_core_defence_factor` 0.10 |
| `wartime_pilots` | A Price for Passage | `trade_opinion_factor` 0.10, `political_power_gain` 0.10 |

### Events (`zin_regional_r_en`)

| Key (id) | Title | To | Options |
| --- | --- | --- | --- |
| `temples_on_the_quay` (1) | Temples on the Quay | R'en | **Bless the pilots' boats** (footholds(1); stab 0.02; AI hist) / **The sea keeps its own** |
| `r_en_friendship` (2) | The Gateway Looks to Parim | Aenor realm | **Welcome it** (opinion +15 both ways; AI 70) / **The North is Sonargur's affair** |
| `r_en_overture` (3) | R'en's Pilots Offer Service | Lerendor | **Accept** (opinion +15 both ways; Lerendor `zin_leren_hegemony` recomputes normally; AI 80) / **R'en should ask for protection** |
| `r_en_asks_protection` (4) | R'en Asks for Protection | Lerendor | **Take R'en under the banner** (`call zin_leren_offer_protection {target: R'en}`, which fires `zin_leren.71` to R'en; AI 70, ×2 on the supremacy route) / **Not now** |

### Tree scripts

`zin_regional_r_en_centre_lean`: as Sensai's, moves R'en's lean halfway toward 0.

### AI

Historical: A, B, C; the_free_gateway is not historical: the historical pick is parims_friend (R'en lives on Aenoran trade) and a_shield_from_parim (Parim's answer decides); E: the_strait_closes, a_price_for_passage, hold_the_gateway, against_the_black_hulls; gateway_companies in 1757. sonargurs_pilots and under_the_leren_banner hist 0; on Lerendor's supremacy route (any rule) R'en's AI takes hold_the_gateway first.

---

## 4. Molot

| Item | Value |
| --- | --- |
| Tree id | `regional_molot` |
| Country | Molot (North Lands; 2 states; men; Dominion, Warlordship; independent) |
| Focuses | 33; columns 0–16 |
| Events | `zin_regional_molot` |
| Start values | lean −20; footholds 1 |

### Situation in 4A 1748

Molot is the northern march: two states of towers and garrisons whose watch-fires look over cold water (proposed). Margrave Wokla's house has kept the march for generations and balanced Lerendor by courting Parim whenever Sonargur grew too strong. Molot's garrisons are the best drilled in the North after Lerendor's own. The margrave is a soldier at peace, and he likes the peace because it lets him choose his friends.

### Role in the story

- **Historical path:** Lerendor's *The Molot Marches* (event `zin_lerendor.8`, 4A 1752–1753; AI chance 40 + lean) mostly meets "keep the balance"; Molot plays both masters; in 4A 1755 it stands apart with the North when the treaty ends and holds its march when the dead come; some march companies ride to the Heir in 4A 1757.
- **War of the Last Crowns:** a hard fortress line on the northern shore.
- **Alternatives:** Molot sworn to Sonargur, or Molot keeping faith with Parim against the North.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Molot>_zin_ruler` | Margrave Wokla of Molot | Country leader | `zin_trait_warden_of_the_passes` |
| `zin_regional_molot_sobel` | Castellan Jarek Sobel | Political advisor | `zin_adv_muster_master` |
| `zin_regional_molot_wend` | Herald Elsa Wend | Political advisor | `zin_adv_envoy` |
| `zin_regional_molot_krell` | Quartermaster Bodo Krell | Political advisor | `zin_adv_treasurer` |
| `zin_regional_molot_vint` | Captain Harro Vint | Corps commander | skill 3; `old_guard`, `defensive_doctrine` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Margravate | 0–2 | start | 7 |
| B | The March Fortresses | 4–8 | start | 8 |
| C | The Balance of the North | 9–13 | start | 7 |
| D | The March Economy | 14–16 | start | 5 |
| E | The March at War | 6–10 | Shore | 6 |

### Focuses

| Br. | Key | Name | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_margravate` | **The Margravate** | — | — | 1,0 | 35 | pp 50; spirit `margraves_house` |
| A | `the_march_lords` | The March Lords | the_margravate | — | 0,1 | 70 | stab 0.03 |
| A | `the_margraves_court` | The Margrave's Court | the_margravate | — | 2,1 | 70 | pp 50 |
| A | `iron_discipline` | Iron Discipline | the_march_lords | — | 0,2 | 70 | spirit `iron_discipline` |
| A | `chapels_of_the_march` | Chapels of the March | the_margraves_court | — | 2,2 | 35 | event `chapels_of_the_march` |
| A | `the_margraves_word` | The Margrave's Word | iron_discipline / chapels_of_the_march | — | 1,3 | 70 | swap margraves_house→margraves_house_2 |
| A | `molot_stands_alone` | Molot Stands Alone | the_margraves_word | — | 1,4 | 70 | pp 75; stab 0.05 |
| B | `the_march_fortresses` | **The March Fortresses** | — | — | 6,0 | 70 | bld bunker 1 @capital; res [zin_cat_walls] 0.5 ×1 |
| B | `the_northern_towers` | The Northern Towers | the_march_fortresses | — | 4,1 | 70 | bld bunker 1 @random_owned ×2 |
| B | `garrison_drill` | Garrison Drill | the_march_fortresses | — | 6,1 | 70 | spirit `garrison_drill` |
| B | `sea_forts` | Sea Forts | the_march_fortresses | — | 8,1 | 70 | bld coastal_bunker 1 @random_coastal ×2 |
| B | `the_watch_fires` | The Watch-Fires | the_northern_towers / garrison_drill | — | 5,2 | 35 | spirit `watch_fires` |
| B | `march_engineers` | March Engineers | garrison_drill | — | 7,2 | 70 | res [zin_cat_walls] 0.5 ×1; res [zin_cat_siege] 0.5 ×1 |
| B | `the_long_garrison` | The Long Garrison | sea_forts | — | 8,2 | 70 | mp 2000 |
| B | `the_iron_march` | The Iron March | the_watch_fires + march_engineers | — | 6,3 | 70 | bld bunker 2 @capital; swap garrison_drill→garrison_drill_2 |
| C | `the_balance_of_the_north` | **The Balance of the North** | — | — | 11,0 | 35 | pp 25 |
| C | `envoys_to_sonargur` | Envoys to Sonargur | the_balance_of_the_north | — | 9,1 | 35 | lean(5); event_for Lerendor `molot_envoys` |
| C | `envoys_to_parim` | Envoys to Parim | the_balance_of_the_north | — | 11,1 | 35 | lean(−5); event_for the Aenor realm holding Parim `molot_envoys` |
| C | `swords_for_hire` | Swords for Hire | the_balance_of_the_north | — | 13,1 | 70 | spirit `march_mercenaries` |
| C | `play_one_against_the_other` | **Play One Against the Other** | envoys_to_sonargur + envoys_to_parim | oath_to_sonargur | 10,2 | 70 | Avail: lean between −40 and 40. spirit `balance_of_the_north` |
| C | `oath_to_sonargur` | An Oath to Sonargur | envoys_to_sonargur / swords_for_hire | play_one_against_the_other | 12,2 | 70 | Avail: lean ≥ 40; exists Lerendor. lean(20); `non_aggression` Lerendor |
| C | `the_balance_holds` | The Balance Holds | play_one_against_the_other / oath_to_sonargur | — | 11,3 | 70 | pp 50; stab 0.05 |
| D | `march_economy` | The March Economy | — | — | 15,0 | 70 | bld industrial_complex 1 @capital |
| D | `armouries_of_molot` | Armouries of Molot | march_economy | — | 14,1 | 70 | bld arms_factory 1 @capital |
| D | `march_roads` | March Roads | march_economy | — | 16,1 | 70 | bld infrastructure 1 @random_owned ×2 |
| D | `herds_of_the_march` | Herds of the March | armouries_of_molot | — | 14,2 | 35 | spirit `march_herds` |
| D | `march_provisions` | March Provisions | march_roads | — | 16,2 | 70 | bld industrial_complex 1 @random_owned |
| E | `the_march_holds` | **The March Holds** | — | — | 8,5 | 35 | Avail: Shore. ws 0.10; spirit `march_at_war` |
| E | `fire_the_beacons` | Fire the Beacons | the_march_holds | — | 6,6 | 70 | Avail: `zin_zol_rising`. bld coastal_bunker 1 @random_coastal ×2; army_xp 10 |
| E | `the_march_stands_apart` | The March Stands Apart | the_march_holds | the_march_with_parim | 8,6 | 35 | Avail: `zin_leren_withdrawal`. lean(10); stab 0.05 |
| E | `the_march_with_parim` | The March with Parim | the_march_holds | the_march_stands_apart | 10,6 | 35 | Avail: `zin_leren_withdrawal`; an Aenor realm holds Parim. lean(−20); event_for that realm `molot_offers_the_march` |
| E | `march_companies_with_the_heir` | March Companies with the Heir | fire_the_beacons / the_march_stands_apart | — | 7,7 | 70 | Avail: `zin_eindil_returned`. coalition; regard(10) |
| E | `the_watch_ends` | The Watch Ends | the_march_stands_apart / the_march_with_parim | — | 9,7 | 70 | Avail: End. stab 0.10; remove `march_at_war` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `margraves_house` | The Margrave's House | `political_power_gain` 0.10, `war_support_factor` 0.03 |
| `margraves_house_2` | The Margrave's Word | `political_power_gain` 0.15, `war_support_factor` 0.05, `stability_factor` 0.03 |
| `iron_discipline` | Iron Discipline | `army_org_factor` 0.05, `stability_factor` −0.02 |
| `garrison_drill` | Garrison Drill | `army_core_defence_factor` 0.10 |
| `garrison_drill_2` | The Iron March | `army_core_defence_factor` 0.15, `max_dig_in` 2 |
| `watch_fires` | The Watch-Fires | `army_intel_factor` 0.10 |
| `march_mercenaries` | Swords for Hire | `experience_gain_army_factor` 0.10, `political_power_gain` 0.05 |
| `balance_of_the_north` | The Balance of the North | `political_power_gain` 0.15, `opinion_gain_monthly_factor` 0.10 |
| `march_herds` | Herds of the March | `monthly_population` 0.05 |
| `march_at_war` | The March at War | `army_core_defence_factor` 0.15, `war_support_factor` 0.05 |

### Events (`zin_regional_molot`)

| Key (id) | Title | To | Options |
| --- | --- | --- | --- |
| `chapels_of_the_march` (1) | Chapels of the March | Molot | **The garrison may pray** (footholds(1); stab 0.02; AI hist) / **The march needs soldiers, not priests** (ws 0.02) |
| `molot_envoys` (2) | Envoys from the March | Lerendor or the Aenor realm | **Send gifts to the margrave** (sender of the event: pp 25; opinion +10 both ways; AI 60) / **Molot plays games** (opinion −5) |
| `molot_offers_the_march` (3) | Molot Offers the March | Aenor realm | **Accept** (guarantee Molot; military access both ways; opinion +25; AI 60) / **Parim needs no march lords** |

### AI

Historical: B, A, C with play_one_against_the_other (hist), D; E: the_march_holds, fire_the_beacons, the_march_stands_apart (hist), march_companies_with_the_heir in 1757. oath_to_sonargur hist 0; under `FREE` when lean ≥ 40 after Lerendor's event.

---

## 5. Eekedor

| Item | Value |
| --- | --- |
| Tree id | `regional_eekedor` |
| Country | Eekedor (North Lands; 1 state; men; Light, Free Council with elections; Leren Compact) |
| Focuses | 33; columns 0–15 |
| Events | `zin_regional_eekedor` |
| Start values | lean 60; footholds 1; in Lerendor's faction (the Leren Compact) |

### Situation in 4A 1748

Eekedor is the commercial republic of the North Lands' east shore: one rich state of counting houses and harbour exchanges, governed by a council of merchant houses that elects a Speaker every four years (last election 4A 1745). It is Lerendor's partner in the Leren Compact and lends to Sonargur; it also, quietly, lends to Parim's merchants (proposed). Its judges have a name for fairness, and the Lerendor spec proposes Eekedor as the seat where the toll quarrel could be arbitrated. Speaker Pertav Oirt wants the treaty to last, the toll to stay low and the ledgers to balance.

### Role in the story

- **Historical path:** Eekedor stays in the Compact; the toll quarrel is mocked in Parim (4A 1749) and never reaches its court; in 4A 1755 it follows Lerendor out of the treaty, keeps its houses neutral, finances the Long Watch and sends coin to the Heir's coalition in 4A 1757.
- **War of the Last Crowns:** the North's banker and convoy master.
- **Alternatives:** an impartial Eekedor that arbitrates the quarrel and saves the treaty's standing.

### Ruler and court

| Id | Name | Role | Traits / skill |
| --- | --- | --- | --- |
| `<Eekedor>_zin_ruler` | Speaker Pertav Oirt | Country leader | `zin_trait_elected_speaker` |
| `zin_regional_eekedor_holm` | Banker Saskia Holm | Political advisor | `zin_adv_merchant_prince` |
| `zin_regional_eekedor_vey` | Arbiter Ammon Vey | Political advisor | `zin_adv_sage` |
| `zin_regional_eekedor_arden` | Treasurer Clem Arden | Political advisor | `zin_adv_treasurer` |
| `zin_regional_eekedor_strand` | Fleet-Captain Wenna Strand | Navy leader | skill 2; `green_water_expert` |

### Branches

| Br. | Branch | Columns | Opens | Focuses |
| --- | --- | --- | --- | ---: |
| A | The Council of Eekedor | 0–2 | start | 6 |
| B | The Counting Houses | 4–8 | start | 8 |
| C | The Compact's Partner | 9–11 | start | 7 |
| D | The Arbitration Court | 13–15 | start | 6 |
| E | Ledgers at War | 5–9 | Shore | 6 |

### Focuses

| Br. | Key | Name | Prerequisites | Excl. | x,y | Days | Effects |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| A | `the_council_of_eekedor` | **The Council of Eekedor** | — | — | 1,0 | 35 | pp 50; spirit `merchant_council` |
| A | `the_houses_vote` | The Houses Vote | the_council_of_eekedor | — | 0,1 | 35 | stab 0.03 |
| A | `chapels_of_the_counting_houses` | Chapels of the Counting Houses | the_council_of_eekedor | — | 2,1 | 35 | event `a_gift_for_the_houses` |
| A | `open_ledgers` | Open Ledgers | the_houses_vote | — | 0,2 | 70 | swap merchant_council→merchant_council_2 |
| A | `the_speakers_chair` | The Speaker's Chair | chapels_of_the_counting_houses | — | 2,2 | 70 | pp 50; stab 0.03 |
| A | `a_republic_of_ledgers` | A Republic of Ledgers | open_ledgers / the_speakers_chair | — | 1,3 | 70 | pp 50; stab 0.05 |
| B | `the_counting_houses` | **The Counting Houses** | — | — | 6,0 | 70 | bld industrial_complex 1 @capital; spirit `counting_houses` |
| B | `bills_of_exchange` | Bills of Exchange | the_counting_houses | — | 4,1 | 70 | pp 75 |
| B | `the_harbour_exchange` | The Harbour Exchange | the_counting_houses | — | 6,1 | 70 | bld naval_base 1 @random_coastal; bld dockyard 1 @capital |
| B | `loans_to_sonargur` | Loans to Sonargur | the_counting_houses | — | 8,1 | 35 | lean(10); event_for Lerendor `eekedor_loan` |
| B | `loans_to_parims_merchants` | Loans to Parim's Merchants | bills_of_exchange | — | 4,2 | 35 | lean(−5); pp 50 |
| B | `insurance_for_cargoes` | Insurance for Cargoes | the_harbour_exchange | — | 6,2 | 70 | spirit `cargo_insurance` |
| B | `the_eekedor_mint` | The Eekedor Mint | loans_to_sonargur | — | 8,2 | 70 | bld industrial_complex 1 @capital |
| B | `wealth_of_the_east_shore` | Wealth of the East Shore | (loans_to_parims_merchants / the_eekedor_mint) + insurance_for_cargoes | — | 6,3 | 70 | swap counting_houses→counting_houses_2 |
| C | `the_compacts_partner` | The Compact's Partner | — | — | 10,0 | 35 | lean(5); pp 25 |
| C | `compact_harbour_rights` | Compact Harbour Rights | the_compacts_partner | — | 9,1 | 70 | navy_xp 10; bld naval_base 1 @random_coastal |
| C | `the_eastern_squadron` | The Eastern Squadron | the_compacts_partner | — | 11,1 | 70 | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 |
| C | `compact_tariffs` | Compact Tariffs | compact_harbour_rights | — | 9,2 | 70 | spirit `compact_tariffs` |
| C | `council_in_eekedor` | The Compact Council in Eekedor | the_eastern_squadron | — | 11,2 | 35 | Avail: in a faction with Lerendor. event_for Lerendor `council_in_eekedor` |
| C | `merchant_marines` | Merchant Marines | compact_tariffs / council_in_eekedor | — | 10,3 | 70 | army_xp 5; res [zin_cat_arms] 0.5 ×1 |
| C | `the_partnership_sealed` | **The Partnership Sealed** | merchant_marines | — | 10,4 | 70 | Avail: in a faction with Lerendor. spirit `partnership` |
| D | `the_arbitration_court` | **The Arbitration Court** | — | — | 14,0 | 35 | pp 25; flag `zin_eekedor_court_open` |
| D | `an_impartial_bench` | An Impartial Bench | the_arbitration_court | — | 13,1 | 70 | `call zin_regional_eekedor_impartial` (lean moves halfway toward 0, so the arbitration of `zin_leren.13` is near 50/50); spirit `impartial_bench` |
| D | `judges_of_the_strait` | Judges of the Strait | the_arbitration_court | — | 15,1 | 70 | pp 50; stab 0.03 |
| D | `the_law_merchant` | The Law Merchant | an_impartial_bench | — | 13,2 | 70 | spirit `law_merchant` |
| D | `offer_arbitration` | Offer Arbitration | judges_of_the_strait | — | 15,2 | 35 | Avail: `check zin_leren_treaty_in_force`; Lerendor has flag `zin_leren_toll_mocked` or spirit `zin_leren_grievance_1716`. event_for the Aenor realm holding Parim `eekedor_offers_arbitration` |
| D | `the_court_of_the_north` | The Court of the North | the_law_merchant / offer_arbitration | — | 14,3 | 70 | pp 50; stab 0.05 |
| E | `ledgers_at_war` | **Ledgers at War** | — | — | 7,6 | 35 | Avail: Shore. ws 0.05; spirit `war_ledgers` |
| E | `war_loans` | War Loans | ledgers_at_war | — | 5,7 | 70 | lean(5); `for_country Lerendor: political_power 50` if Lerendor exists |
| E | `convoy_the_compact` | Convoy the Compact | ledgers_at_war | — | 7,7 | 70 | navy_xp 10; res [zin_cat_galleys] 0.5 ×1 |
| E | `neutral_counting_houses` | Neutral Counting Houses | ledgers_at_war | — | 9,7 | 35 | Avail: `zin_leren_withdrawal`. spirit `neutral_houses` |
| E | `coin_for_the_coalition` | Coin for the Coalition | war_loans / convoy_the_compact | — | 6,8 | 70 | Avail: `zin_eindil_returned`. `call zin_eindil_aid_host {manpower: 0, equipment: infantry_equipment 500}`; regard(10) |
| E | `the_ledgers_balance` | The Ledgers Balance | convoy_the_compact / neutral_counting_houses | — | 8,8 | 70 | Avail: End. pp 100; stab 0.10; remove `war_ledgers` |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `merchant_council` | The Council of Merchant Houses | `stability_factor` 0.03, `political_power_gain` 0.05 |
| `merchant_council_2` | Open Ledgers | `stability_factor` 0.05, `political_power_gain` 0.10, `drift_defence_factor` 0.10 |
| `counting_houses` | The Counting Houses | `political_power_gain` 0.10, `trade_opinion_factor` 0.10 |
| `counting_houses_2` | Wealth of the East Shore | `political_power_gain` 0.15, `trade_opinion_factor` 0.15, `production_factory_max_efficiency_factor` 0.03 |
| `cargo_insurance` | Insurance for Cargoes | `consumer_goods_factor` −0.02 |
| `compact_tariffs` | Compact Tariffs | `faction_trade_opinion_factor` 0.10 |
| `partnership` | The Partnership Sealed | `opinion_gain_monthly_factor` 0.10, `political_power_gain` 0.05 |
| `impartial_bench` | An Impartial Bench | `opinion_gain_monthly_factor` 0.15 |
| `law_merchant` | The Law Merchant | `trade_opinion_factor` 0.10, `stability_factor` 0.03 |
| `war_ledgers` | Ledgers at War | `political_power_gain` 0.10, `consumer_goods_factor` −0.02 |
| `neutral_houses` | Neutral Counting Houses | `trade_opinion_factor` 0.15 |

### Events (`zin_regional_eekedor`)

| Key (id) | Title | To | Options |
| --- | --- | --- | --- |
| `a_gift_for_the_houses` (1) | A Gift for the Houses | Eekedor | The almoners ask the counting houses to fund a hospital. **Fund it** (pp −25; footholds(1); stab 0.03; AI hist) / **Charity is a private matter** |
| `eekedor_loan` (2) | A Loan from Eekedor | Lerendor | **Accept** (pp 50; Eekedor pp 25; opinion +10 both ways; AI 90) / **The crown owes no merchants** |
| `council_in_eekedor` (3) | The Compact Council in Eekedor | Lerendor | **Let it sit in Eekedor** (Eekedor lean(10); opinion +10; AI 50) / **Sonargur presides** (pp 25) |
| `eekedor_offers_arbitration` (4) | Eekedor Offers Arbitration | Aenor realm | **Accept the court** (`for_country Lerendor: call zin_leren_add_strait_standing {value: 5}`; opinion +10 between all three; AI 20 + (60 − `zin_court_corruption`) ÷ 2, minimum 5) / **Parim answers to no merchants** (Eekedor lean(5)) |

### Tree scripts

`zin_regional_eekedor_impartial`: moves Eekedor's lean halfway toward 0 through `zin_leren_add_lean`.

### AI

Historical: A, B, C first (loans_to_sonargur, compact_tariffs, council_in_eekedor), D: the_arbitration_court, judges_of_the_strait (an_impartial_bench and offer_arbitration hist 0); E: ledgers_at_war, convoy_the_compact, neutral_counting_houses, coin_for_the_coalition in 1757. Elections: the AI keeps the ruling party (politics spec).

---

## Implementation

### Files per tree

As in [middle_lands.md](middle_lands.md#files-per-tree), for the tree ids `regional_sensai`, `regional_mina`, `regional_r_en`, `regional_molot`, `regional_eekedor`. Character ids `zin_regional_<name>_<who>`; rulers keep `<TAG>_zin_ruler`.

### Names this file needs from other specs

| Name | Owner |
| --- | --- |
| `zin_leren_add_lean`, `zin_leren_add_strait_standing`, `zin_leren_offer_protection`, `zin_leren_treaty_in_force`, `zin_leren_withdrawal`, `zin_leren_toll_mocked`, `zin_leren_grievance_1716`, `zin_leren_lean`; events `zin_leren.13`, `zin_leren.51`, `zin_leren.70`, `zin_leren.71`; tree events `zin_lerendor.7`, `zin_lerendor.8` | Lerendor mechanic and tree |
| `zin_north_ask_compact_seat`, `zin_north_ask_parim_shield` | [shared_north_lands.md](../shared/shared_north_lands.md) |
| `zin_afrit_add_footholds` | Afrit |
| `zin_eindil_add_regard`, `zin_eindil_join_coalition`, `zin_eindil_aid_host` | Eindil's journey |
| `zin_zol_rising`, `zin_zol_withdrawn` | Zol's Mistake |
| `zin_region_north_lands` (country flag) | economy |

### New names this file adds

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_faction_free_north` | faction template (diplomacy spec) | "The Free Crowns of the North": a defensive league Sensai may found; rules `war_declaration_rule_faction_leader_only`, `call_to_war_rule_faction_leader_only`, `change_leader_rule_never`, `faction_peace_rule_no_puppeting`; no manifest |
| `zin_faction_rule_join_free_north` | faction joining rule | Capital in the North Lands; not Lerendor; not in Lerendor's faction; not Shadow; `zin_leren_lean` between −40 and 40 |
| `zin_sensai_no_crown`, `zin_sensai_free_crowns` | country flags | Sensai's choices; Lerendor's AI may read `zin_sensai_free_crowns` as a rival league |
| `zin_r_en_neutral` | country flag | R'en declared its waters neutral |
| `zin_eekedor_court_open` | country flag | Eekedor's arbitration court is open (readable by the Lerendor mechanic) |
| `zin_regional_<tree>` | event namespaces | One per tree (five) |

### Hegemony

The Free Crowns of the North is not the Leren Compact, so its members do not count toward `zin_leren_hegemony`. A crown that joins it is out of reach of `zin_leren_invite_to_compact` (the decision requires "target not in a faction").

### Text and art

Icons from the [catalog](../02_icon_catalog.md): `two_crowns`, `crown_iron`, `timber_mill`, `shipwright_yard`, `forge_anvil`, `mine_cart`, `quarry_stone`, `strait_chain`, `toll_house`, `lighthouse`, `sea_charts`, `galley_oars`, `warship_sail`, `harbour_lake`, `coin_chest`, `ledger_coins`, `guild_hall`, `scroll_treaty`, `seal_wax`, `envoy`, `handshake_oath`, `banner_league`, `banner_plain`, `alliance_rings`, `fort_wall`, `pass_fort`, `beacon`, `eye_watchful`, `spear_levy`, `sword_shield`, `house_first_light`, `black_hulls`, `storm_sea`, `lone_sword`. Event pictures: `generic_court`, `leren_envoys`, `strait_toll`, `houses`, `generic_sea`, `black_ships_tale`.

## Acceptance

1. Each of the five trees compiles with its tabled focus count, unique positions, every focus below its prerequisites, symmetric exclusions and no `raw` blocks.
2. On 1 Thaw 4A 1748 no available focus in these trees declares war, makes a claim or a war goal; *The Free Crowns of the North* is unavailable before `zin_golden_king_dead` or 1 Thaw 4A 1751.
3. Every lean change in these trees goes through `zin_leren_add_lean` (text scan of the compiled effects for direct `zin_leren_lean` writes finds none).
4. Every modifier in the spirit tables exists in `modifiers_documentation.md`; the secret scan finds no "Afrit" and no "Eindil" in these trees' text.
5. Historical observer run: Mina is in Lerendor's faction by 1 Deepwinter 4A 1754; Sensai and R'en are not; Molot takes *Play One Against the Other*; after `zin_zol_rising` every coastal tree's shore root becomes available within 1 day; after `zin_eindil_returned` at least two of the five crowns join the Heir's coalition.
6. Scripted test: Eekedor's *An Impartial Bench* at lean 60 leaves lean 30; Lerendor's `zin_leren.13` ruling chance falls from 65 % to about 57 %.
7. The HOI4 Agent Tools focus inspector reports no errors in the five compiled trees.

## Open questions

1. **The Free Crowns of the North.** Does the owner want a third northern league (Sensai's), or should the North have only the Compact and Parim's friends?
2. **Mina's mines.** Is "the Delvings of Mina" acceptable as proposed geography? (Dwarves are not implied; their homeland stays open.)
3. **R'en's history.** The historical pick here is Parim's friend. Should R'en instead stand apart with the North when the treaty ends?
4. **Molot's coast.** Does Molot face the Ocean of Zol, or another sea? Its shore focuses assume a northern coast.
5. **Eekedor's elections.** Should an election in Eekedor be able to bring a council that leaves the Compact?
