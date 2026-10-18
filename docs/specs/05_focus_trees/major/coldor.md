# Coldor focus tree

**Status:** Draft. **Priority:** 4. **Phase:** 4.

## Purpose

Coldor is the great crown of the frozen interior and the western ports of the Cold Lands. Its tree plays the Cold Lands as their own world: a queen's court pulled between the harbours and the steadings, iron and furs, the Northern Accord and its pull on two dozen clans, the old rivalry with Isengard, the yeti and the giants who answer to no crown, the silent castle in the frozen north, and the far north-west beyond the last steading. When the War of the Last Crowns breaks out far to the south, Coldor chooses whether the Cold Lands stand apart, sell their timber to the West, or send their White Companies to the living.

Tree id `coldor`; country Coldor (tier A, [01_tiers_and_coverage.md](../01_tiers_and_coverage.md)). 102 focuses. Mechanic: [The Cold Lands](../../04_mechanics/cold_lands.md); it touches [Eindil's journey](../../04_mechanics/eindil_journey.md), [Yeldenne and Glo](../../04_mechanics/yeldenne_and_glo.md) and [the Western Crossing](../../04_mechanics/western_crossing.md) only through their flags and effects. Data format: [00_format_and_compiler.md](../00_format_and_compiler.md).

## Lore basis

**Established:** the Cold Lands are the largest landmass, in the north-west, reaching off the map; Coldor is their great power, seat Fandanar, leader of the Northern Accord with Horidor, rival of Isengard (working table); the Yeti Lands and the Titanos ice giants live there, and their place in the order of beings is open; Eindil wakes in the Cold Lands without memory, is nursed by tribes and taken south by western travellers; Horos keeps the Castle of Yeldenne in the Cold Lands, where Afrit and Eindil come in the late Fourth Age.

**Proposed:** the uniting of the interior in 4A 850 and Isengard's refusal (vault proposal); Queen Vaestia, Chancellor Essen Hendair, Harbour-Master Alorio Siul and Marshal Grindok Azlen ([characters](../../02_lore/02_characters.md)); in this spec, every focus, spirit, event and number, the Winter Moot, the March Forts, the Neck Road, the White Companies, and Warden Ysolde of the Far Ice.

**Kept open:** the exact place of Eindil's ice and of the castle; what yeti and giants are; the Cold Lands' part in the final war (the vault is silent, so every route here is play). Before `zin_eindil_awake` no visible focus mentions the stranger; his focuses are hidden by `allow_branch`. No text names Afrit before `zin_afrit_revealed`; the party camped near the castle is "temple pilgrims with too many swords".

## Design

### Shape

| Columns | Rows | Branch | Opens | Drives |
| --- | --- | --- | --- | --- |
| 0–4 | 0–6 | A. The Winter Crown (court) | start | Political power; ports or steadings; lean |
| 5–7 | 0–6 | B. Iron and Furs (economy) | start | Industry; winter stores |
| 9–11 | 0–6 | C. The Western Ports (trade and navy) | start | Timber for the West; Windwaith; navy |
| 13–17 | 0–6 | D. The Northern Accord | start | Lean, reach, Accord decisions |
| 18–20 | 0–8 | E. The Isengard Question | start; war half gated | Defiance; the March Forts; Isengard sworn or subdued |
| 22–24 | 0–5 | F. The Old Peoples | start | Yeti and giant pacts |
| 26–28 | 0–5 | G. The Silent Castle | start; one part hidden until `zin_horos_dead` | Mp'E hooks |
| 0–4 | 7–11 | H. The Winter Army | start | Army |
| 27–29 | 6–10 | I. The Far Ice | start; one part hidden until `zin_eindil_awake` | The far north-west; journey hooks |
| 10–15 | 8–12 | J. The World Beyond the Ice | `zin_war_of_last_crowns` or `zin_western_crossing` | Coldor's course in the final war |

The grid is 30 columns wide (x 0 to 29) and 13 rows deep (y 0 to 12).

### The peaceful start

Every focus available in 4A 1748 is court, industry, ports, envoys, pacts or watch-fires. The March Forts border war needs 1 Thaw 1751 and a reason (`zin_cold_march_war_allowed`; under the historical rule, 1 Thaw 1752). The only full war, *Isengard Must Kneel*, needs the March Forts fought, Isengard still defiant, and the War of the Last Crowns or a Gathering Dark of 30. Coldor's war routes abroad open only with the War of the Last Crowns or the Western Crossing.

### Notation

Prerequisites: "a and b" means both; "a or b" means either. Effects use the compiler vocabulary; `call X (v)` is `{ "call": "X", "args": { "value": v } }`. Shorthand: **lean +n (Name)** is `for_country Name: call zin_cold_add_lean (n)`; **lean +n all** is `call zin_cold_add_lean_all (n)`; **defiance −n** is `call zin_cold_add_defiance (−n)`; **regard** and **renown** call `zin_eindil_add_regard` (on Coldor) and `zin_eindil_add_renown`. Spirit keys compile to `zin_coldor_<key>`; event keys to `zin_coldor.<n>`. Building `where` may be the site key `isengard_march` (`zin_is_site_isengard_march`, Coldor's side). AI is the base weight; "hist" is the factor under `zin_rule_historical_path` or `zin_rule_cold_isengard = historical`.

### Branch A: The Winter Crown

**Purpose:** Queen Vaestia's court at Fandanar, the memory of 850, and the quarrel between the ports and the steadings. **Opens:** at the start. **Mutual exclusions:** *Favour the Ports* (historical: trade, ships, the West) / *Favour the Steadings* (levies, winter hardiness). **Mechanic:** lean (*The Queen's Progress*); the start spirit `ports_against_interior` is replaced by the choice.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `winter_crown` | The Winter Crown of Fandanar | — | — | 2,0 | 70 | political_power 75; add_spirit winter_crown | 100 |
| `queens_council` | The Queen's Council | winter_crown | — | 1,1 | 35 | political_power 50; stability 0.03 | 20 |
| `crown_of_850` | The Crown of 850 | winter_crown | — | 3,1 | 35 | war_support 0.03; political_power 25; tooltip "The interior was made one in 850. Isengard remembers it too." | 15 |
| `chancellors_ledgers` | The Chancellor's Ledgers | queens_council | — | 0,2 | 35 | add_spirit chancellors_ledgers | 12 |
| `ports_and_steadings` | Ports and Steadings | queens_council or crown_of_850 | — | 2,2 | 35 | event ports_and_steadings (zin_coldor.1) | 15 |
| `marshals_counsel` | The Marshal's Counsel | crown_of_850 | — | 4,2 | 35 | army_experience 10; political_power 25 | 12 |
| `favour_the_ports` | Favour the Ports | chancellors_ledgers and ports_and_steadings | favour_the_steadings | 1,3 | 70 | swap_spirit ports_against_interior → ports_ascendant | 40; hist ×5 |
| `favour_the_steadings` | Favour the Steadings | ports_and_steadings and marshals_counsel | favour_the_ports | 3,3 | 70 | swap_spirit ports_against_interior → steadings_ascendant | 40; hist ×0 |
| `one_crown_of_ice` | One Crown of Ice | favour_the_ports or favour_the_steadings | — | 2,4 | 70 | political_power 100; stability 0.05 | 20 |
| `queens_progress` | The Queen's Progress | one_crown_of_ice | — | 1,5 | 35 | lean +5 all; stability 0.03 | 15 |
| `law_of_the_long_winter` | Law of the Long Winter | one_crown_of_ice | — | 3,5 | 35 | add_spirit law_of_the_long_winter | 12 |
| `high_crown_of_the_north` | High Crown of the North | queens_progress and law_of_the_long_winter | — | 2,6 | 70 | swap_spirit winter_crown → high_crown_of_the_north | 15 |

### Branch B: Iron and Furs

**Purpose:** the wealth of the interior: iron, furs, sledge roads, forges and halls of stone, and the stores that carry the steadings through the long winters. **Opens:** at the start. **Mechanic:** `zin_cold_winter_stores` halves the yearly winter modifier and the cost of feeding the steadings.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `iron_and_furs` | Iron and Furs | — | — | 6,0 | 70 | building industrial_complex 1 capital; political_power 25 | 25 |
| `deep_iron_mines` | The Deep Iron Mines | iron_and_furs | — | 5,1 | 35 | raw: `random_owned_state = { limit = { is_coastal = no } add_resource = { type = steel amount = 8 } }` | 10 |
| `the_fur_trade` | The Fur Trade | iron_and_furs | — | 7,1 | 35 | political_power 50; add_spirit fur_trade | 10 |
| `winter_stores` | Winter Stores | deep_iron_mines | — | 5,2 | 35 | flag zin_cold_winter_stores; stability 0.03 | 20; hist ×2 |
| `sledge_roads` | The Sledge Roads | the_fur_trade | — | 7,2 | 70 | building infrastructure 1 random_owned; building infrastructure 1 random_owned | 10 |
| `forges_of_fandanar` | The Forges of Fandanar | winter_stores or sledge_roads | — | 6,3 | 70 | building arms_factory 2 capital | 10 |
| `halls_of_stone` | Halls of Stone | forges_of_fandanar | — | 5,4 | 70 | building industrial_complex 1 random_owned | 8 |
| `hide_and_wool` | Hide and Wool | forges_of_fandanar | — | 7,4 | 35 | add_spirit hide_and_wool; equipment infantry_equipment 1000 | 8 |
| `fires_through_the_long_night` | Fires Through the Long Night | halls_of_stone and hide_and_wool | — | 6,5 | 70 | add_spirit long_night_fires | 8 |
| `northern_workshops` | The Northern Workshops | fires_through_the_long_night | — | 6,6 | 70 | building industrial_complex 2 random_owned | 8 |

### Branch C: The Western Ports

**Purpose:** Harbour-Master Alorio's ports on the western coast: trade with the West Lands and Aenor across the sea, the rivalry with Windwaith, the timber market that can supply a western fleet, and Coldor's squadrons. **Opens:** at the start. **Mechanic:** `zin_cold_timber_market` opens `zin_cold_sell_timber_west` (fleet for the West); `zin_cold.71` (the Harbour Compact with Windwaith).

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_western_ports` | The Western Ports | — | — | 10,0 | 35 | building naval_base 1 random_coastal; political_power 25 | 20 |
| `harbour_masters_charter` | The Harbour-Master's Charter | the_western_ports | — | 9,1 | 35 | add_spirit harbour_charter | 12; hist ×2 |
| `shipwrights_of_the_cold_coast` | Shipwrights of the Cold Coast | the_western_ports | — | 11,1 | 35 | building dockyard 1 random_coastal | 10 |
| `grain_from_the_west` | Grain from the West | harbour_masters_charter | — | 9,2 | 35 | stability 0.03; political_power 25 | 10 |
| `the_windwaith_question` | The Windwaith Question | shipwrights_of_the_cold_coast | — | 11,2 | 35 | event_for Windwaith windwaith_question (zin_cold.71) | 12 |
| `timber_for_the_west` | Timber for the West | grain_from_the_west or the_windwaith_question | — | 10,3 | 35 | flag zin_cold_timber_market; political_power 25 | 15; hist ×3 |
| `long_sea_road` | The Long Sea Road to Parim | timber_for_the_west | — | 9,4 | 35 | equipment convoy_1 15; political_power 25 | 8 |
| `coastal_watch` | The Coastal Watch | timber_for_the_west | — | 11,4 | 35 | building coastal_bunker 1 random_coastal; building naval_base 1 random_coastal | 8 |
| `northern_squadrons` | The Northern Squadrons | long_sea_road or coastal_watch | — | 10,5 | 70 | research [naval_equipment] 0.5 ×1; navy_experience 15; call zin_coldor_recruit (zin_coldor_harl) | 8 |
| `masters_of_the_cold_seas` | Masters of the Cold Seas | northern_squadrons | — | 10,6 | 70 | add_spirit cold_seas | 8 |

### Branch D: The Northern Accord

**Purpose:** the league with Horidor and its pull on the clans, the free towns and Fearno, up to a banner over the whole Cold Lands. **Opens:** at the start. *The Frozen Crown* needs reach ≥ 25 and *One Banner of the Ice* reach ≥ 60. **Mechanic:** `zin_cold_lean`, `zin_cold_accord_reach`; *Envoys to the Steadings* opens the Accord decisions; *Steading Charters* sets `zin_cold_cheap_envoys` (envoys cost 15 PP); *Open the Accord* opens the invitations.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `northern_accord` | The Northern Accord | — | — | 15,0 | 35 | political_power 50; lean +5 (Horidor) | 40 |
| `kinship_with_horidor` | Kinship with Horidor | northern_accord | — | 14,1 | 35 | lean +15 (Horidor); for_country Horidor: stability 0.03 | 15 |
| `envoys_to_the_steadings` | Envoys to the Steadings | northern_accord | — | 16,1 | 35 | flag zin_cold_accord_decisions; political_power 25 | 30 |
| `highland_roads` | Highland Roads | kinship_with_horidor | — | 13,2 | 70 | for_country Horidor: building infrastructure 1 capital; lean +5 (Horidor) | 8 |
| `winter_moot_gifts` | Gifts for the Winter Moot | kinship_with_horidor or envoys_to_the_steadings | — | 15,2 | 35 | lean +5 all | 15 |
| `steading_charters` | Steading Charters | envoys_to_the_steadings | — | 17,2 | 35 | flag zin_cold_cheap_envoys; lean +5 all | 12 |
| `open_the_accord` | Open the Accord | winter_moot_gifts | — | 15,3 | 35 | flag zin_cold_accord_open; political_power 25 | 20 |
| `the_fearno_question` | The Fearno Question | open_the_accord | — | 14,4 | 35 | event_for Fearno fearno_question (zin_coldor.2) | 12 |
| `the_coast_towns` | The Coast Towns | open_the_accord | — | 16,4 | 35 | lean +10 (Holdon); lean +10 (Wonderland) | 12 |
| `the_frozen_crown` | The Frozen Crown | the_fearno_question or the_coast_towns | — | 15,5 | 70 | available: variable zin_cold_accord_reach above 24; add_spirit frozen_crown | 15 |
| `one_banner_of_the_ice` | One Banner of the Ice | the_frozen_crown | — | 15,6 | 70 | available: variable zin_cold_accord_reach above 59; political_power 100; add_spirit one_banner | 15 |

### Branch E: The Isengard Question

**Purpose:** settle the rivalry with Isengard by the open hand or the iron hand. **Opens:** at the start. **Mutual exclusions:** *The Iron Hand* (historical) / *The Open Hand*. The March Forts border war needs `zin_cold_march_war_allowed`. *Isengard Must Kneel* is the only full war; never historical. *Isengard Swears* needs the mechanic's `zin_cold_isengard_sworn` (Isengard's answer to the charter, offered by focus on the Open Hand or by the mechanic on the Iron Hand once defiance is 30 or less). **Mechanic:** defiance; `zin_cold_start_march_war`; `zin_cold.30`, `.33`.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `isengard_question` | The Isengard Question | — | — | 19,0 | 35 | political_power 25 | 30 |
| `count_isengards_forts` | Count Isengard's Forts | isengard_question | — | 18,1 | 35 | army_experience 5; flag zin_coldor_forts_counted | 12 |
| `envoys_to_isengard` | Envoys to Isengard | isengard_question | — | 20,1 | 35 | defiance −5; for_country Isengard: political_power 25 | 12 |
| `border_forts_of_coldor` | Border Forts of Coldor | count_isengards_forts | — | 18,2 | 35 | building bunker 2 isengard_march | 10 |
| `marriage_across_the_march` | A Marriage Across the March | envoys_to_isengard | — | 20,2 | 35 | event_for Isengard marriage (zin_cold.33) | 12 |
| `the_iron_hand` | The Iron Hand | border_forts_of_coldor | the_open_hand | 18,3 | 35 | flag zin_cold_iron_hand; war_support 0.05 | 40; hist ×10 |
| `the_open_hand` | The Open Hand | marriage_across_the_march | the_iron_hand | 20,3 | 35 | flag zin_cold_open_hand; stability 0.03 | 40; hist ×0 |
| `the_march_forts` | The March Forts | the_iron_hand | — | 18,4 | 35 | available: check zin_cold_march_war_allowed, not at_war; call zin_cold_start_march_war | 100 |
| `charter_for_isengard` | A Charter for Isengard | the_open_hand | — | 20,4 | 35 | event_for Isengard winter_charter (zin_cold.30) | 30 |
| `isengard_swears` | Isengard Swears | charter_for_isengard or the_march_forts | — | 19,5 | 35 | available: global_flag zin_cold_isengard_sworn; political_power 100; stability 0.05 | 100 |
| `isengard_must_kneel` | Isengard Must Kneel | the_march_forts | — | 18,6 | 35 | available: flag zin_cold_march_war_fought, not global_flag zin_cold_isengard_sworn, (global_flag zin_war_of_last_crowns or variable zin_gathering_dark above 29), not at_war; flag zin_cold_conquest; wargoal Isengard puppet_wargoal_focus | 20; hist ×0 |
| `kin_of_the_north` | Kin of the North | isengard_swears | — | 20,6 | 35 | for_country Isengard: stability 0.05; lean +5 all | 30 |
| `walls_of_isengard` | The Walls of Isengard | isengard_must_kneel | — | 18,7 | 35 | available: at_war_with Isengard; timed_spirit walls_of_isengard 180 | 100 |
| `the_cold_lands_at_peace` | The Cold Lands at Peace | walls_of_isengard or kin_of_the_north | — | 19,8 | 70 | available: check zin_cold_isengard_settled; add_spirit cold_lands_at_peace; political_power 50 | 30 |

### Branch F: The Old Peoples

**Purpose:** envoys to the yeti of the hunting grounds and the giants of the Frost-King's hall, and the old pacts with peoples who answer to no crown. **Opens:** at the start. Level 1 of each pact is the people's answer to the envoys; levels 2 and 3 come from these focuses. **Mechanic:** `zin_cold_yeti_pact`, `zin_cold_giant_pact`; `zin_cold.51`, `.52`; at level 3, `zin_cold.50` (Hearth and Height). Text never ranks yeti or giants among the orders of being.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_old_peoples` | The Old Peoples of the Ice | — | — | 23,0 | 35 | political_power 25 | 15 |
| `the_hunting_grounds` | Envoys to the Hunting Grounds | the_old_peoples | — | 22,1 | 35 | event_for Yeti Lands hunting_grounds (zin_cold.51) | 12 |
| `the_frost_kings_hall` | Envoys to the Frost-King's Hall | the_old_peoples | — | 24,1 | 35 | event_for Titanos frost_kings_hall (zin_cold.52) | 12 |
| `gifts_of_salt_and_iron` | Gifts of Salt and Iron | the_hunting_grounds | — | 22,2 | 35 | available: variable zin_cold_yeti_pact above 0; call zin_cold_add_yeti_pact (1); lean +10 (Yeti Lands) | 10 |
| `the_giants_toll` | The Giants' Toll | the_frost_kings_hall | — | 24,2 | 35 | available: variable zin_cold_giant_pact above 0; call zin_cold_add_giant_pact (1); lean +10 (Titanos) | 10 |
| `the_old_pacts` | The Old Pacts | gifts_of_salt_and_iron or the_giants_toll | — | 23,3 | 35 | stability 0.03; political_power 25 | 10 |
| `trackers_in_the_snow` | Trackers in the Snow | the_old_pacts | — | 22,4 | 35 | available: variable zin_cold_yeti_pact above 1; add_spirit yeti_trackers | 10 |
| `giants_on_the_passes` | Giants on the Passes | the_old_pacts | — | 24,4 | 35 | available: variable zin_cold_giant_pact above 1; add_spirit giants_on_the_passes | 10 |
| `hearth_and_height` | Hearth and Height | trackers_in_the_snow or giants_on_the_passes | — | 23,5 | 70 | if variable zin_cold_yeti_pact above 1: call zin_cold_add_yeti_pact (1); if variable zin_cold_giant_pact above 1: call zin_cold_add_giant_pact (1) | 10 |

### Branch G: The Silent Castle

**Purpose:** how Coldor treats the castle in the frozen north: in peace, with guides and watch-fires, with a guard outside the hall, and, if the guardian falls, with a watch on Mp'E. **Opens:** at the start. *The Empty Hall* carries `allow_branch = global_flag zin_horos_dead`. **Mechanic:** flags `zin_cold_hall_respected`, `zin_cold_guides_north`, `zin_cold_watch_fires` (hooks into the journey's ambush and the Glo spec's forewarning, see the mechanic, section 6); `zin_cold.61` (A Crown Offers a Guard). Coldor never seeks Glo through this branch.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_silent_castle` | Legends of the Silent Castle | — | — | 27,0 | 35 | political_power 25; tooltip "Traders speak of a castle in the frozen north, and a light that does not fail." | 10 |
| `leave_the_hall_in_peace` | Leave the Hall in Peace | the_silent_castle | — | 26,1 | 35 | flag zin_cold_hall_respected; non_aggression Yeldenne; stability 0.02 | 15; hist ×2 |
| `northern_coast_watch` | The Northern Coast Watch | the_silent_castle | — | 28,1 | 35 | building coastal_bunker 1 random_coastal; navy_experience 5 | 10 |
| `guides_of_the_snow` | Guides of the Snow | leave_the_hall_in_peace | — | 26,2 | 35 | flag zin_cold_guides_north; army_experience 5 | 5; hist ×0 |
| `watch_fires_of_the_north` | Watch-Fires of the North | northern_coast_watch | — | 28,2 | 35 | flag zin_cold_watch_fires | 8 |
| `guard_outside_the_hall` | Stand Guard Outside the Hall | guides_of_the_snow or watch_fires_of_the_north | — | 27,3 | 35 | available: not global_flag zin_horos_dead, flag zin_cold_hall_respected; event_for Yeldenne guard_offer (zin_cold.61) | 8; hist ×0 |
| `the_empty_hall` | The Empty Hall | guides_of_the_snow or watch_fires_of_the_north | — | 27,4 | 35 | allow_branch: global_flag zin_horos_dead; event empty_hall (zin_coldor.3) | 20 |
| `a_watch_on_mpe` | A Watch on Mp'E | the_empty_hall | — | 27,5 | 35 | available: Yeldenne exists; guarantee Yeldenne; stability 0.03 | 15 |

### Branch H: The Winter Army

**Purpose:** Marshal Grindok's army of the snow: runners, peak wardens, war-sledges and the White Host. **Opens:** at the start (a second root at row 7). **Mechanic:** none beyond spirits and manpower.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_winter_army` | The Winter Army | — | — | 2,7 | 35 | army_experience 10; research [land_doctrine] 0.5 ×1 | 20 |
| `snow_runners` | The Snow-Runners | the_winter_army | — | 1,8 | 35 | add_spirit snow_runners | 10 |
| `grindoks_drill` | Marshal Grindok's Drill | the_winter_army | — | 3,8 | 35 | research [land_doctrine] 0.5 ×2 | 10 |
| `wardens_of_the_peaks` | Wardens of the Peaks | snow_runners | — | 0,9 | 35 | research [mountaineers_tech] 0.5 ×1 | 8 |
| `frost_hardened` | Frost-Hardened | snow_runners or grindoks_drill | — | 2,9 | 35 | equipment infantry_equipment 1500 | 8 |
| `the_iron_levy` | The Iron Levy | grindoks_drill | — | 4,9 | 35 | manpower 15000 | 10 |
| `war_sledges` | War-Sledges | wardens_of_the_peaks or frost_hardened | — | 1,10 | 35 | add_spirit war_sledges | 8 |
| `the_winter_host` | The Winter Host | frost_hardened or the_iron_levy | — | 3,10 | 70 | army_experience 25; manpower 10000 | 10 |
| `the_white_host` | The White Host | war_sledges and the_winter_host | — | 2,11 | 70 | add_spirit white_host | 15 |

### Branch I: The Far Ice

**Purpose:** the far north-west beyond the last steading: wardens, hunters, the White Road; and, once a man has been found alive in the ice, word of him, provisions for him and the tale of the King Without a House. **Opens:** the top four at the start. *Word from the Far Ice* and its children carry `allow_branch = global_flag zin_eindil_awake`. **Mechanic:** `zin_cold_chart_far_ice` (and with it the wardens' option in the journey's *Talk of a Man from the Ice*); `zin_cold_reward_ice_host`; regard and renown. The historical AI ignores the northern tales (journey) and takes none of the hidden focuses before 4A 1750.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `beyond_the_last_steading` | Beyond the Last Steading | — | — | 28,6 | 70 | call zin_cold_chart_far_ice; call zin_coldor_recruit (zin_coldor_ysolde) | 8 |
| `wardens_of_the_far_ice` | Wardens of the Far Ice | beyond_the_last_steading | — | 27,7 | 35 | add_spirit far_ice_wardens | 6 |
| `the_hunters_trade` | The Hunters' Trade | beyond_the_last_steading | — | 29,7 | 35 | political_power 25; lean +5 all | 6 |
| `the_white_road` | The White Road | wardens_of_the_far_ice or the_hunters_trade | — | 28,8 | 70 | building infrastructure 1 random_owned; building infrastructure 1 random_owned | 6 |
| `word_from_the_far_ice` | Word from the Far Ice | the_white_road | — | 28,9 | 35 | allow_branch: global_flag zin_eindil_awake; renown +2; political_power 25 | 20 |
| `provisions_for_the_stranger` | Provisions for the Stranger | word_from_the_far_ice | — | 27,10 | 35 | available: variable zin_eindil_stage below 3; regard +10; renown +2; call zin_cold_reward_ice_host (10) | 15; hist ×0 |
| `the_houseless_king` | The King Without a House | word_from_the_far_ice | — | 29,10 | 35 | available: global_flag zin_eindil_war_king; regard +5; war_support 0.02 | 10 |

### Branch J: The World Beyond the Ice

**Purpose:** Coldor's course when the south burns: stand apart (historical proposal), sell timber and ships to the West and perhaps join its Crossing, or send the White Companies to the living. **Opens:** *The World Beyond the Ice* needs `zin_war_of_last_crowns` or `zin_western_crossing`. **Mutual exclusions:** *The Cold Lands Stand Apart* / *Timber and Ships for the West* / *The White Companies*. *A Share of the Plunder* needs the Western Crossing and peace at home; *Answer the Heir's Call* needs `zin_eindil_returned`. **Mechanic:** route flags; `zin_cold_sell_timber`, `zin_cold_join_crossing`, `zin_cold_sail_white_companies`; the Lost Cause. None of these routes is history; the vault says nothing of the Cold Lands in the war.

| Key | Name | Prerequisites | Exclusive | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_world_beyond_the_ice` | The World Beyond the Ice | — | — | 13,8 | 35 | available: global_flag zin_war_of_last_crowns or global_flag zin_western_crossing; political_power 50 | 200 |
| `stand_apart` | The Cold Lands Stand Apart | the_world_beyond_the_ice | timber_and_ships, the_white_companies | 11,9 | 35 | flag zin_cold_route_apart; add_spirit stand_apart | 40; hist ×100 |
| `timber_and_ships` | Timber and Ships for the West | the_world_beyond_the_ice | stand_apart, the_white_companies | 13,9 | 35 | flag zin_cold_route_crossing; political_power 50 | 30; hist ×0 |
| `the_white_companies` | The White Companies | the_world_beyond_the_ice | stand_apart, timber_and_ships | 15,9 | 35 | flag zin_cold_route_companies; flag zin_lost_cause_member; call zin_lost_cause_add_strength (5) | 30, ×2 if Coldor's regard ≥ 25; hist ×0 |
| `close_the_ports_to_war` | Close the Ports to War | stand_apart | — | 10,10 | 35 | add_spirit neutral_ports | 30 |
| `the_winter_wall` | The Winter Wall | stand_apart | — | 12,10 | 35 | building bunker 1 capital; building coastal_bunker 1 random_coastal; add_spirit winter_wall | 30 |
| `the_cold_endures` | The Cold Endures | close_the_ports_to_war or the_winter_wall | — | 11,11 | 70 | stability 0.05; political_power 100 | 30 |
| `the_western_contracts` | The Western Contracts | timber_and_ships | — | 13,10 | 35 | call zin_cold_sell_timber; political_power 25 | 30 |
| `a_share_of_the_plunder` | A Share of the Plunder | the_western_contracts | — | 13,11 | 35 | available: global_flag zin_western_crossing, not at_war; call zin_cold_join_crossing | 10 |
| `answer_the_heirs_call` | Answer the Heir's Call | the_white_companies | — | 15,10 | 35 | available: global_flag zin_eindil_returned; call zin_cold_sail_white_companies | 100 |
| `the_white_companies_hold` | The White Companies Hold | answer_the_heirs_call | — | 15,11 | 35 | timed_spirit white_companies_abroad 365; army_experience 15 | 40 |
| `the_north_remembers` | The North Remembers | the_cold_endures or a_share_of_the_plunder or the_white_companies_hold | — | 13,12 | 35 | available: global_flag zin_eindil_crowned or global_flag zin_afrit_dead; political_power 50; stability 0.05 | 50 |

### Count

| Branch | Focuses |
| --- | ---: |
| A. The Winter Crown | 12 |
| B. Iron and Furs | 10 |
| C. The Western Ports | 10 |
| D. The Northern Accord | 11 |
| E. The Isengard Question | 14 |
| F. The Old Peoples | 9 |
| G. The Silent Castle | 8 |
| H. The Winter Army | 9 |
| I. The Far Ice | 7 |
| J. The World Beyond the Ice | 12 |
| **Total** | **102** |

## Spirits

Keys compile to `zin_coldor_<key>`. Mechanic spirits (`zin_cold_*`) are listed in the mechanic spec.

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `ports_against_interior` | Ports Against the Interior | `stability_factor` −0.03, `political_power_gain` −0.05 | Start (history); swapped by *Favour the Ports* or *Favour the Steadings* |
| `winter_crown` | The Winter Crown | `political_power_gain` 0.10 | *The Winter Crown of Fandanar*; swapped by *High Crown of the North* |
| `high_crown_of_the_north` | High Crown of the North | `political_power_gain` 0.15, `stability_factor` 0.05 | *High Crown of the North* |
| `chancellors_ledgers` | The Chancellor's Ledgers | `consumer_goods_factor` −0.02 | *The Chancellor's Ledgers* |
| `ports_ascendant` | The Ports Ascendant | `consumer_goods_factor` −0.03, `industrial_capacity_dockyard` 0.05, `stability_factor` 0.02 | *Favour the Ports* |
| `steadings_ascendant` | The Steadings Ascendant | `conscription_factor` 0.05, `winter_attrition_factor` −0.10 | *Favour the Steadings* |
| `law_of_the_long_winter` | Law of the Long Winter | `stability_factor` 0.05, `drift_defence_factor` 0.10 | *Law of the Long Winter* |
| `fur_trade` | The Fur Trade | `consumer_goods_factor` −0.02 | *The Fur Trade* |
| `hide_and_wool` | Hide and Wool | `winter_attrition_factor` −0.10 | *Hide and Wool* |
| `long_night_fires` | Fires Through the Long Night | `production_speed_buildings_factor` 0.10 | *Fires Through the Long Night* |
| `harbour_charter` | The Harbour-Master's Charter | `political_power_gain` 0.05, `consumer_goods_factor` −0.01 | *The Harbour-Master's Charter* |
| `cold_seas` | Masters of the Cold Seas | `navy_org_factor` 0.05, `naval_detection` 0.10 | *Masters of the Cold Seas* |
| `frozen_crown` | The Frozen Crown | `political_power_gain` 0.10, `winter_attrition_factor` −0.05 | *The Frozen Crown* |
| `one_banner` | One Banner of the Ice | `stability_factor` 0.05, `subjects_autonomy_gain` −0.10 | *One Banner of the Ice* |
| `walls_of_isengard` | The Walls of Isengard | `army_attack_factor` 0.10, `breakthrough_factor` 0.05 | *The Walls of Isengard*, 180 days |
| `cold_lands_at_peace` | The Cold Lands at Peace | `stability_factor` 0.05, `political_power_gain` 0.10 | *The Cold Lands at Peace* |
| `yeti_trackers` | Trackers in the Snow | `winter_attrition_factor` −0.10, `army_speed_factor` 0.03 | *Trackers in the Snow* |
| `giants_on_the_passes` | Giants on the Passes | `army_defence_factor` 0.05, `army_core_defence_factor` 0.05 | *Giants on the Passes* |
| `snow_runners` | The Snow-Runners | `winter_attrition_factor` −0.10, `army_speed_factor` 0.03 | *The Snow-Runners* |
| `war_sledges` | War-Sledges | `supply_consumption_factor` −0.05, `attrition` −0.05 | *War-Sledges* |
| `white_host` | The White Host | `army_org_factor` 0.05, `army_defence_factor` 0.05, `acclimatization_cold_climate_gain_factor` 0.25 | *The White Host* |
| `far_ice_wardens` | Wardens of the Far Ice | `winter_attrition_factor` −0.05, `stability_factor` 0.02 | *Wardens of the Far Ice* |
| `stand_apart` | The Cold Lands Stand Apart | `stability_factor` 0.05, `war_support_factor` −0.05 | *The Cold Lands Stand Apart* |
| `neutral_ports` | Ports Closed to War | `consumer_goods_factor` −0.02, `stability_factor` 0.03 | *Close the Ports to War* |
| `winter_wall` | The Winter Wall | `army_core_defence_factor` 0.10, `dig_in_speed_factor` 0.10 | *The Winter Wall* |
| `white_companies_abroad` | The White Companies Abroad | `army_morale_factor` 0.10, `war_support_factor` 0.05 | *The White Companies Hold*, 365 days |

## Events (namespace `zin_coldor`)

| Id | Key | Title | Trigger | Options (effects; AI weight) |
| --- | --- | --- | --- | --- |
| 1 | `ports_and_steadings` | Ports and Steadings | Focus | "The ports pay for the crown." (political power +50; AI 60, hist ×2) / "The steadings are the crown." (manpower +5,000, stability +2 %; AI 40) |
| 2 | `fearno_question` | Fandanar Asks for Friendship (to Fearno) | Focus | "Friends of the Winter Crown." (lean +20; opinion +20 both ways; AI chance lean + 50) / "Fearno stands alone." (lean −10) |
| 3 | `empty_hall` | The Empty Hall | Focus | If `zin_glo_sealed`: "No one passes the seal while we watch." (stability +2 %). Otherwise: "The castle is silent now." (political power +25). The text says only that the guardian is gone; it never says who struck him. |

Mechanic events fired by the tree: `zin_cold.30`, `.33`, `.51`, `.52`, `.61`, `.71` (texts in the mechanic file). Journey and Glo events that reach Coldor (`zin_eindil.11`, `zin_cold.60`) are owned by those specs.

## Historical AI route

With `zin_rule_historical_path` (or `zin_rule_cold_isengard = historical`), the weights above give this order. Dates are targets for the test run.

| Period | Focuses |
| --- | --- |
| Thaw to Longnight 1748 | winter_crown, northern_accord, queens_council, iron_and_furs, isengard_question, the_western_ports |
| 1749 | envoys_to_the_steadings, kinship_with_horidor, crown_of_850, ports_and_steadings, harbour_masters_charter, deep_iron_mines, winter_stores (the journey's *Talk of a Man from the Ice*: ignored) |
| 1750 | chancellors_ledgers, favour_the_ports, winter_moot_gifts, count_isengards_forts, border_forts_of_coldor, the_iron_hand |
| 1751 | one_crown_of_ice, open_the_accord, the_old_peoples, the_hunting_grounds, the_frost_kings_hall, grain_from_the_west, timber_for_the_west |
| 1752 | the_march_forts (from 1 Thaw), the_silent_castle, leave_the_hall_in_peace, gifts_of_salt_and_iron, the_giants_toll, the_old_pacts |
| 1753 | queens_progress, law_of_the_long_winter, the_fearno_question, the_coast_towns, shipwrights_of_the_cold_coast, the_windwaith_question, the_winter_army (timber sold in 1753 by decision) |
| 1754 | trackers_in_the_snow, giants_on_the_passes, high_crown_of_the_north, the_frozen_crown (if reach ≥ 25), snow_runners, grindoks_drill (timber sold again) |
| 1755 | the_world_beyond_the_ice (on `zin_war_of_last_crowns`), stand_apart, the_winter_wall, close_the_ports_to_war |
| 1756 | the_cold_endures, isengard_swears and kin_of_the_north (if Isengard has sworn), the_fur_trade, sledge_roads, forges_of_fandanar |
| 1757 to 1760 | the_cold_lands_at_peace (if sworn), economy and army leftovers; the_north_remembers (on `zin_afrit_dead` or `zin_eindil_crowned`) |

The AI never takes `favour_the_steadings`, `the_open_hand`, `isengard_must_kneel`, `guides_of_the_snow`, `guard_outside_the_hall`, `provisions_for_the_stranger`, `timber_and_ships` or `the_white_companies` on the historical path.

## Alternative routes

| Route | How | Result |
| --- | --- | --- |
| The Steadings | *Favour the Steadings* | More levies and winter hardiness; fewer ships and less trade |
| The Open Hand | *The Open Hand*, *A Marriage Across the March*, *A Charter for Isengard*, bread in hard winters | Isengard swears without a border war, usually in the 1750s |
| Isengard Must Kneel | Iron Hand, the March Forts, then the war focus once the world is at war | Isengard a Coldor subject; Coldor marked `zin_glo_conqueror` if it annexes |
| The Frozen Crown | Accord decisions, protection offers, reach 60 | Most of the Cold Lands under one banner |
| Friends of the Hall | *Leave the Hall in Peace*, *Guides of the Snow*, *Watch-Fires of the North*, *Stand Guard Outside the Hall* | Weaker ambush and a forewarned castle: a divergence in the race to Yeldenne |
| Timber and Ships | *Timber and Ships for the West*, *A Share of the Plunder* | Coldor joins the Western Crossing against Aenor |
| The White Companies | *The White Companies*, *Answer the Heir's Call* | Three Coldor divisions fight in Eindil's coalition |

## Implementation

- Data: `docs/design/focus/coldor.json` (id `coldor`, tier `major`, countries `["Coldor"]`).
- Compiled: `common/national_focus/zin_coldor.txt`, `common/ideas/zin_focus_coldor.txt`, `events/zin_coldor.txt`, `localisation/english/zin_focus_coldor_l_english.yml`.
- History: `history/countries/<Coldor tag>` adds spirit `ports_against_interior`; the mechanic sets the start values.
- `raw` blocks: one (`deep_iron_mines`). Limit is ten.
- `allow_branch` roots: `the_empty_hall` (`zin_horos_dead`) and `word_from_the_far_ice` (`zin_eindil_awake`). The effects that set those flags call `mark_focus_tree_layout_dirty` for Coldor.
- Icons from the shared catalog ([02_icon_catalog.md](../02_icon_catalog.md)); proposed new icons: `winter_crown`, `iron_and_furs`, `cold_harbour`, `northern_accord`, `march_forts`, `yeti_pact`, `giant_pact`, `silent_castle`, `far_ice`, `white_host`. All image-generated.

### Tree-declared scripted effects

`common/scripted_effects/zin_coldor.txt`:

| Name | Does |
| --- | --- |
| `zin_coldor_recruit` (`character`) | Recruits the named proposed character with its role |

### Characters (proposed)

| Id | Name | Role | Recruited by |
| --- | --- | --- | --- |
| `zin_coldor_harl` | Captain Harl of the Cold Coast | Navy leader, skill 3, trait `blue_water_expert` | *The Northern Squadrons* |
| `zin_coldor_ysolde` | Warden Ysolde of the Far Ice | Corps commander, skill 3, traits `winter_specialist`, `trickster` | *Beyond the Last Steading* |

The starting court (Queen Vaestia, Chancellor Essen Hendair, Harbour-Master Alorio Siul, Marshal Grindok Azlen) comes from the characters spec.

## AI

- Base weights are in the tables; "hist" factors apply under the historical rule.
- Peace-time branches first; the war focuses (`the_march_forts`, `walls_of_isengard`, `the_world_beyond_the_ice`, `answer_the_heirs_call`) have weights of 100 to 200 so the AI takes them when they open.
- Accord decisions, feeding and timber sales follow the mechanic's AI section.
- On `free`, the three final-war routes are weighted: stand apart 40; timber and ships 30, ×2 if Coldor favoured the ports; White Companies 30, ×2 at regard ≥ 25, ×2 in the Lost Cause.

## Acceptance

1. The compiler accepts `coldor.json`: 102 focuses, unique keys and positions, every prerequisite above its focus, exclusives symmetric, days multiples of 7 between 7 and 140, one raw block.
2. The HOI4 Agent Tools focus inspector reports no errors; the renderer shows the tree within 30 columns (x 0 to 29).
3. On 1 Thaw 1748: no war focus is available; no visible focus mentions the stranger, the ice or the war-king (branch I's lower half is hidden); no text names Afrit.
4. In the historical AI run: `the_iron_hand` by 1751; `the_march_forts` in 1752; `timber_for_the_west` before 1753; `stand_apart` within 120 days of `zin_war_of_last_crowns`; Coldor never declares a full war.
5. With `zin_rule_cold_isengard = open_hand`: `the_open_hand`, `charter_for_isengard` and, in at least one of three seeds, `isengard_swears` by 1760.
6. Every modifier in the spirits table exists in the game's modifier documentation.

## Open questions

1. Is *Favour the Ports* the right historical choice for Coldor's court, given that the timber sales to the West need the ports?
2. Should the Cold Lands stand apart in the final war (as proposed), or does the owner see Coldor in it?
3. Are Captain Harl and Warden Ysolde welcome as proposed characters?
4. Should Coldor be able to court the yeti and the giants at all (see the mechanic's open question)?
5. Is "the White Companies" a good name for a Cold Lands expedition, or should it carry a lore name?
