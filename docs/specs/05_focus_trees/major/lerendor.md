# Lerendor Focus Tree

**Status:** Draft. **Priority:** 4. **Phase:** 4.

## Purpose

The major focus tree for **Lerendor**, the united crown of Lerendor and Lerenwaith (tree id `lerendor`, focus ids `zin_lerendor_<key>`, data file `docs/design/focus/lerendor.json`). It plays the Treaty of the Narrow Strait mechanic ([../../04_mechanics/lerendor_narrow_strait.md](../../04_mechanics/lerendor_narrow_strait.md)): the politics of two crowns under one throne, the fleets and tolls of the strait, the Leren Compact's lead over the North Lands, the Dark Lands across the straits, the watch against Zol's dead, and the one great choice: **honour Aenor, stand apart, or seize the strait**.

The tree has 127 focuses in nine branches, at most 30 columns wide.

## Lore basis

**Established** (vault): Lerendor and Lerenwaith are one crown; Sonargur is the working seat; Lerendor leads the Leren Compact and is Aenor's rival (working table); the North Lands lie across a narrow strait from the Middle Lands, and the Dark Lands lie between Lerendor and the Middle Lands across narrow straits; in the final war the northern lands withdraw from the old alliance with Aenor, and the North Lands are not one unanimous enemy; Zol's dead come from the black north through islands and straits and cannot be ended by ordinary weapons; northern companies join Eindil's temporary coalition without giving up their independence; competing northern interests remain after the war.

**Proposed** (vault proposals this tree builds on): the name Treaty of the Narrow Strait and its date 4A 512; the union of the crowns in 4A 411; the toll quarrel of 4A 1716; the start on 1 Thaw 4A 1748; the withdrawal in 4A 1755; the three routes and the outcome "Lerendor becomes master of the strait".

**Proposed here:** every focus, spirit, event, character and number; the Lerenwaith estates and the Admiralty as court parties; the Chain of Sonargur; the arbitration of Eekedor; the scholars of the dead and the old wards. The tree never states the outcome of the war or the post-war order as history. Before `zin_afrit_revealed` no text names Afrit; Aenor's new king is "King Aurevan".

## Design

### The peaceful start

On 1 Thaw 4A 1748 every available focus is about court, money, ships, envoys or watch-fires. No focus in the first two years can start a war or add a claim. War content opens only from story flags (`zin_golden_king_dead`, `zin_war_of_last_crowns`, `zin_zol_rising`, `zin_eindil_returned`, `zin_afrit_dead`, `zin_eindil_crowned`) or from the deliberate route choice, and even then the mechanic's peace gates apply.

### Branch map

| # | Branch | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| 1 | The Strait Treasury | 0–4 | 0–6 | 15 | start | Toll level, toll quarrel, economy |
| 2 | Fleets of the Strait | 5–9 | 0–6 | 14 | start | Navy; `zin_leren_holds_strait`; supremacy access |
| 3 | The Two Crowns | 10–16 | 0–7 | 21 | start | Union cohesion, court parties, the Question of the Strait |
| 4 | The Leren Compact | 17–22 | 0–6 | 15 | start | Lean, hegemony, Compact decisions |
| 5 | Across the Dark Straits | 23–26 | 0–6 | 11 | start | Dark Lands lean, protection, Goldoroth and Dondor |
| 6 | The Long Watch | 27–29 | 0–9 | 15 | start; war half needs `zin_zol_rising` | Defence against Zol's dead; `zin_leren_strait_barred` |
| 7 | Honour the Treaty | 5–9 | 8–14 | 13 | The Question of the Strait | Call to war, crown or realm, the old alliance |
| 8 | The North Stands Apart (historical) | 11–15 | 8–14 | 12 | The Question of the Strait | The withdrawal, armed neutrality, free companies |
| 9 | Mastery of the Strait | 17–22 | 8–15 | 11 | The Question of the Strait | Supremacy, R'en, the far shore, the Dark Shore |

The Question of the Strait (column 13, row 7) sits at the foot of the Two Crowns branch: the court must settle who leads it before it can answer for the realm. Its three route focuses (rows 8) are mutually exclusive.

### Notation used in the tables

- **Prerequisites:** `a + b` means a and b; `a / b` means a or b.
- **x,y:** grid column and row.
- **Effects** use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md): `political_power 50`, `stability 0.05`, `war_support 0.05`, `navy_experience 10`, `army_experience 10`, `manpower 10000`, `add_spirit k`, `swap_spirit old→new`, `timed_spirit k 365d`, `event zin_lerendor.n`, `event_for Name zin_x.n`, `flag f` (country flag), `building type level @where`, `research [categories] 50% ×uses`, `equipment type amount`, `guarantee Name`, `popularity ideology value`, `for_country Name: …`, `call effect(args)`. Spirit keys are short; they compile to `zin_lerendor_<key>`.
- **Avail:** the focus's `available` conditions. Bypass is never used.
- **Lean +n on X** is shorthand for `for_country X: call zin_leren_add_lean(n)`. **Standing +n** is `call zin_leren_add_strait_standing(n)`. **Cohesion +n** is `call zin_leren_add_union_cohesion(n)`.
- **AI** is the base `ai.base` and its main factors. "hist" means the factor applies when the AI runs the historical route (`zin_rule_leren_route = historical` or `zin_rule_historical_path`); "hon", "brk" and "sup" mean the honour, break and supremacy routes.

Equipment, technology categories and ship types are vanilla placeholders until the warfare spec replaces them; the content builder maps them.

### Branch 1: The Strait Treasury

**Purpose:** the wealth of the strait: wharves, guilds, forges, and the strait dues. It opens the toll quarrel with Aenor, the main peacetime lever on strait standing. **Opens:** at start. **Mutual exclusions:** Keep the Treaty Toll / Full Strait Dues. **Mechanic:** `zin_leren_toll_level`, the toll quarrel events `zin_leren.10`–`.13`, standing.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `strait_treasury` | The Strait Treasury | – | – | 2,0 | 70 | political_power 50; building industrial_complex 1 @capital | 30 |
| `toll_rolls` | Read the Toll Rolls | strait_treasury | – | 1,1 | 35 | event zin_leren.10 | 20; hist ×3 |
| `sonargur_wharves` | The Wharves of Sonargur | strait_treasury | – | 3,1 | 70 | building dockyard 1 @sonargur; building naval_base 1 @sonargur | 15 |
| `reopen_toll_quarrel` | Reopen the Toll Quarrel | toll_rolls | – | 0,2 | 70 | Avail: treaty in force (`zin_leren_treaty_in_force`); event_for Aenor zin_leren.11; tooltip "Parim will answer within weeks." | 20; hist ×3; hon ×0.3 |
| `merchant_guilds` | The Merchant Guilds of the Strait | toll_rolls / sonargur_wharves | – | 2,2 | 70 | add_spirit strait_merchants | 15 |
| `timber_of_lerenwaith` | Timber of Lerenwaith | sonargur_wharves | – | 4,2 | 70 | building dockyard 1 @random_coastal; cohesion +5 | 10 |
| `treaty_toll` | Keep the Treaty Toll | reopen_toll_quarrel | full_strait_dues | 0,3 | 35 | call zin_leren_set_toll_level(1); standing +10; stability 0.03 | 10; hon ×5; brk, sup ×0 |
| `full_strait_dues` | Full Strait Dues | reopen_toll_quarrel | treaty_toll | 1,3 | 35 | flag zin_leren_full_dues (permits toll level 3); call zin_leren_set_toll_level(2); political_power 50; standing -5 | 10; hist ×5; sup ×5; hon ×0 |
| `northern_fairs` | The Northern Fairs | merchant_guilds | – | 3,3 | 70 | building industrial_complex 1 @random_owned; call zin_lerendor_compact_lean(5) | 10 |
| `toll_houses` | Toll Houses on Both Shores | treaty_toll / full_strait_dues | – | 0,4 | 70 | add_spirit toll_houses; call zin_lerendor_recruit(zin_leren_tollmaster_brannoc) | 10 |
| `eekedor_bankers` | The Eekedor Bankers | northern_fairs | – | 2,4 | 70 | building industrial_complex 1 @capital; lean +10 on Eekedor | 10 |
| `forges_of_sonargur` | The Forges of Sonargur | timber_of_lerenwaith | – | 4,4 | 70 | building arms_factory 2 @capital; research [infantry_weapons] 50% ×1 | 10; ×2 after `zin_zol_rising` |
| `colleges_of_sonargur` | The Colleges of Sonargur | toll_houses / eekedor_bankers | – | 1,5 | 70 | research [industry] 50% ×2 | 8 |
| `strait_war_chest` | The Strait War Chest | eekedor_bankers / forges_of_sonargur | – | 3,5 | 70 | political_power 75; equipment infantry_equipment 1000; war_support 0.03 | 8; ×3 after `zin_war_of_last_crowns` |
| `northern_industry` | A Northern Industry | colleges_of_sonargur + strait_war_chest | – | 2,6 | 70 | building industrial_complex 2 @random_owned; building arms_factory 1 @random_owned; add_spirit northern_industry | 8 |

### Branch 2: Fleets of the Strait

**Purpose:** the navy that makes the strait Lerendor's. Two doctrines: the close-water Strait Watch or the open-sea Beyond the Strait. **Opens:** at start. **Mutual exclusions:** The Strait Watch / Beyond the Strait. **Mechanic:** `zin_leren_holds_strait` (Lerendor must hold the north shore), the Close the Strait decision (needs The Strait Watch or Close the Northern Seas), and supremacy access (Masters of the Strait Waters).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `fleets_of_the_strait` | Fleets of the Strait | – | – | 7,0 | 70 | navy_experience 15; building naval_base 2 @sonargur | 30 |
| `sea_lords` | Bind the Sea Lords | fleets_of_the_strait | – | 6,1 | 70 | event zin_lerendor.5; political_power 25 | 15 |
| `royal_dockyards` | The Royal Dockyards | fleets_of_the_strait | – | 8,1 | 70 | add_spirit royal_dockyards; building dockyard 1 @capital | 20 |
| `strait_pilots` | Pilots of the Narrow Strait | sea_lords | – | 5,2 | 35 | add_spirit strait_pilots | 15 |
| `galley_squadrons` | The Galley Squadrons | sea_lords / royal_dockyards | – | 7,2 | 70 | research [naval_equipment] 50% ×2; call zin_lerendor_lay_down_ships(2) | 15 |
| `great_ships` | Great Ships of the Line | royal_dockyards | – | 9,2 | 70 | research [naval_equipment] 50% ×1; building dockyard 1 @random_coastal | 10; sup ×2 |
| `strait_watch` | The Strait Watch | strait_pilots / galley_squadrons | beyond_the_strait | 6,3 | 70 | add_spirit strait_watch; research [naval_doctrine] 50% ×1; tooltip "Permits Close the Strait." | 15; hist, hon ×2 |
| `beyond_the_strait` | Beyond the Strait | galley_squadrons / great_ships | strait_watch | 8,3 | 70 | add_spirit blue_water; research [naval_doctrine] 50% ×1 | 10; sup ×3 |
| `chain_of_sonargur` | The Chain of Sonargur | strait_watch | – | 5,4 | 70 | building coastal_bunker 2 @sonargur; building naval_base 1 @sonargur | 10 |
| `leren_marines` | Marines of the Leren Shore | strait_watch / beyond_the_strait | – | 7,4 | 70 | research [marine_tech] 50% ×1; army_experience 10 | 8; sup ×2 |
| `lord_admiral` | A Lord Admiral of the Strait | beyond_the_strait / great_ships | – | 9,4 | 35 | call zin_lerendor_recruit(zin_leren_admiral_ostvar); navy_experience 10 | 15 |
| `fleet_in_being` | The Fleet in Being | chain_of_sonargur / leren_marines | – | 6,5 | 70 | add_spirit fleet_in_being | 10 |
| `convoy_lanes` | Guard the Convoy Lanes | leren_marines / lord_admiral | – | 8,5 | 70 | research [naval_equipment] 50% ×1; equipment convoy 50 | 10 |
| `masters_of_the_strait_waters` | Masters of the Strait Waters | fleet_in_being + convoy_lanes | – | 7,6 | 70 | navy_experience 25; add_spirit masters_of_the_strait; tooltip "Opens Mastery of the Strait without hegemony 40." | 10; sup ×3 |

### Branch 3: The Two Crowns

**Purpose:** crown-union politics. Lerendor and Lerenwaith share one throne but keep two laws, two sets of lords and two memories. The king must hold the union together and decide which party leads the court: the **Crown** (Sonargur's household, proud and resentful of Parim), the **Estates** (Lerenwaith's lords and free towns, who trade with Aenor and favour the treaty) or the **Admiralty** (the strait captains, who want the strait for Lerendor). The party is a leaning, not the final choice: it adjusts standing and AI route weights. The branch ends in **The Question of the Strait**. **Opens:** at start. **Mutual exclusions:** Endow the Temples / The Crown Over the Altar; Crown / Estates / Admiralty Ascendant. **Mechanic:** `zin_leren_union_cohesion`, standing, `zin_footholds` (through `zin_afrit_add_footholds`).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `two_crowns` | The Two Crowns of Leren | – | – | 13,0 | 70 | event zin_lerendor.1; political_power 50; cohesion +5 | 50 |
| `sonargur_household` | The Sonargur Household | two_crowns | – | 12,1 | 70 | add_spirit royal_household | 20 |
| `lerenwaith_estates` | Summon the Lerenwaith Estates | two_crowns | – | 14,1 | 70 | cohesion +10; stability 0.03 | 15; hon ×2 |
| `royal_progress` | The Royal Progress | sonargur_household | – | 11,2 | 35 | event zin_lerendor.2 | 15 |
| `crown_marriage` | A Marriage for the Heir | sonargur_household / lerenwaith_estates | – | 13,2 | 70 | event zin_lerendor.3 | 15 |
| `estates_council` | Seat the Estates in Council | lerenwaith_estates | – | 15,2 | 70 | add_spirit estates_in_council; cohesion +5 | 10; hon ×2 |
| `endow_the_temples` | Endow the Temples of the Deliverer | royal_progress | crown_over_altar | 10,3 | 35 | event zin_lerendor.4; stability 0.05; call zin_afrit_add_footholds(1); standing +5 | 10; hon ×2 |
| `crown_over_altar` | The Crown Over the Altar | royal_progress | endow_the_temples | 11,3 | 35 | political_power 75; stability -0.03; call zin_afrit_add_footholds(-1) | 10; hist ×1.5; sup ×2 |
| `one_throne` | One Throne, Two Laws | royal_progress + crown_marriage | – | 12,3 | 70 | cohesion +10; political_power 25 | 15 |
| `chancellor_of_lerenwaith` | The Chancellor of Lerenwaith | crown_marriage / estates_council | – | 14,3 | 35 | call zin_lerendor_recruit(zin_leren_chancellor_maelis); cohesion +5 | 10 |
| `estates_purse` | The Estates' Purse | estates_council | – | 16,3 | 70 | building industrial_complex 1 @random_owned; political_power 25 | 8 |
| `crown_ascendant` | The Crown Ascendant | one_throne | estates_ascendant, admiralty_ascendant | 11,4 | 70 | swap_spirit royal_household→crown_ascendant (add if missing); standing -5; cohesion -5 | 10; hist ×5; brk ×3 |
| `estates_ascendant` | The Estates Ascendant | one_throne / chancellor_of_lerenwaith | crown_ascendant, admiralty_ascendant | 13,4 | 70 | swap_spirit estates_in_council→estates_ascendant (add if missing); standing +10; cohesion +10 | 10; hon ×5 |
| `admiralty_ascendant` | The Admiralty Ascendant | chancellor_of_lerenwaith / estates_purse | crown_ascendant, estates_ascendant | 15,4 | 70 | add_spirit admiralty_ascendant; standing -5 | 10; sup ×5 |
| `kings_peace` | The King's Peace | crown_ascendant | – | 11,5 | 70 | stability 0.05; war_support 0.05; popularity dominion 0.10 | 15 |
| `estates_charters` | Charters for the Free Towns | estates_ascendant | – | 13,5 | 70 | building industrial_complex 1 @random_owned; popularity light 0.10; cohesion +10 | 15 |
| `prize_courts` | The Prize Courts | admiralty_ascendant | – | 15,5 | 70 | navy_experience 20; political_power 50 | 15 |
| `union_reforms` | The Union Reforms | kings_peace / estates_charters / prize_courts | – | 13,6 | 70 | event zin_lerendor.19; cohesion +10 | 20 |
| `common_law_of_leren` | The Common Law of Leren | union_reforms | – | 11,7 | 70 | stability 0.05; cohesion +10 | 8 |
| `question_of_the_strait` | The Question of the Strait | union_reforms | – | 13,7 | 35 | Avail: check zin_leren_question_open (`zin_golden_king_dead`, or after 1751.3.1, or standing ≥ 60 or ≤ -60); event zin_lerendor.20; tooltip "Opens the three routes." | 100 once available |
| `hall_of_two_crowns` | The Hall of Two Crowns | union_reforms | – | 15,7 | 70 | political_power 50; stability 0.03; cohesion +5 | 8 |

### Branch 4: The Leren Compact

**Purpose:** North Lands hegemony by diplomacy. Lerendor courts the 26 smaller crowns (Sensai, Molot, R'en, Mina, The Hold and the rest), draws them into the Compact and, on the hard road, offers them protection. **Opens:** at start; the Compact decision category appears with the first focus. **Mutual exclusions:** First Among Equals / One Banner for the North. **Mechanic:** `zin_leren_lean`, `zin_leren_hegemony`, the decisions `zin_leren_send_envoys`, `zin_leren_trade_charter`, `zin_leren_marriage_pact`, `zin_leren_invite_to_compact`, `zin_leren_offer_protection`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_leren_compact` | The Leren Compact | – | – | 19,0 | 70 | flag zin_leren_compact_open (decision category); political_power 25; lean +10 on Eekedor | 40 |
| `compact_council` | Convene the Compact Council | the_leren_compact | – | 18,1 | 70 | event zin_lerendor.6; add_spirit compact_council | 20 |
| `envoys_to_the_north` | Envoys to the Northern Crowns | the_leren_compact | – | 20,1 | 35 | flag zin_leren_envoys (unlocks `zin_leren_send_envoys`); political_power 25 | 20 |
| `eekedor_partnership` | The Eekedor Partnership | compact_council | – | 17,2 | 70 | lean +15 on Eekedor; political_power 25; for_country Eekedor: political_power 25 | 10 |
| `compact_tariff` | The Compact Tariff | compact_council / envoys_to_the_north | – | 19,2 | 70 | flag zin_leren_tariff (unlocks `zin_leren_trade_charter`); building industrial_complex 1 @capital | 15 |
| `sensai_question` | The Sensai Question | envoys_to_the_north | – | 21,2 | 70 | event_for Sensai zin_lerendor.7 | 15 |
| `marriages_across_the_north` | Marriages Across the North | eekedor_partnership / compact_tariff | – | 18,3 | 70 | flag zin_leren_marriages (unlocks `zin_leren_marriage_pact`); stability 0.02 | 12 |
| `molot_marches` | The Molot Marches | compact_tariff / sensai_question | – | 20,3 | 70 | event_for Molot zin_lerendor.8 | 12 |
| `mina_and_the_hold` | Mina and The Hold | sensai_question | – | 22,3 | 70 | lean +15 on Mina; lean +15 on The Hold | 15 |
| `open_the_compact` | Open the Compact to the Small Crowns | marriages_across_the_north / molot_marches | – | 19,4 | 70 | flag zin_leren_open_compact (unlocks `zin_leren_invite_to_compact`); political_power 50 | 20 |
| `gateway_talks` | Talks at the Gateway | molot_marches / mina_and_the_hold | – | 21,4 | 70 | lean +20 on R'en; standing -3 | 10; sup ×3 |
| `compact_fleet` | The Compact Fleet | open_the_compact | – | 18,5 | 70 | navy_experience 15; equipment convoy 25; for every Compact member: navy_experience 5 (via call zin_lerendor_compact_gift) | 10 |
| `compact_levies` | The Compact Levies | open_the_compact / gateway_talks | – | 20,5 | 70 | add_spirit compact_levies; if hegemony ≥ 20: manpower 10000, else manpower 5000 | 12 |
| `first_among_equals` | First Among Equals | compact_fleet / compact_levies | one_banner_for_the_north | 18,6 | 70 | call zin_lerendor_compact_lean(10); stability 0.05; political_power 50 | 10; hist, hon ×3 |
| `one_banner_for_the_north` | One Banner for the North | compact_levies | first_among_equals | 21,6 | 70 | flag zin_leren_one_banner (unlocks `zin_leren_offer_protection`); war_support 0.05; call zin_lerendor_compact_lean(-5) | 10; sup ×5 |

### Branch 5: Across the Dark Straits

**Purpose:** the Dark Lands coast across the straits. Lerendor charts the Sea of Darkness, chooses between Dondor's Dark Sea Accord and a bargain with Goldoroth, befriends the free human towns of Blackton, and hears that Volgan's agents court the orc holds. **Opens:** at start. **Mutual exclusions:** The Shield of Dondor / Bargain with Goldoroth. **Mechanic:** Dark Lands targets in the Compact decisions (`zin_leren_is_dark_shore`), protection, the Dark Shore war gate (Goldoroth at war with Dondor or Blackton, or `zin_war_of_last_crowns`).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `across_the_dark_straits` | Across the Dark Straits | – | – | 24,0 | 70 | flag zin_leren_dark_shore (Dark Lands coastal countries become Compact decision targets); political_power 25 | 10 |
| `sea_of_darkness_charts` | Charts of the Sea of Darkness | across_the_dark_straits | – | 23,1 | 35 | navy_experience 10; research [naval_doctrine] 30% ×1 | 10 |
| `friends_of_the_dark_sea_accord` | Friends of the Dark Sea Accord | across_the_dark_straits | – | 25,1 | 70 | lean +15 on Dondor; lean +10 on Belonton | 10 |
| `blackton_free_towns` | The Free Towns of Blackton | sea_of_darkness_charts | – | 23,2 | 70 | lean +20 on Blackton; political_power 25 | 10 |
| `watch_on_goldoroth` | Watch on Goldoroth | friends_of_the_dark_sea_accord / sea_of_darkness_charts | – | 25,2 | 70 | army_experience 10; flag zin_lerendor_watching_goldoroth | 10 |
| `shield_of_dondor` | The Shield of Dondor | friends_of_the_dark_sea_accord | bargain_with_goldoroth | 24,3 | 70 | guarantee Dondor; lean +15 on Dondor; lean -20 on Goldoroth | 10; hist, hon ×2 |
| `bargain_with_goldoroth` | Bargain with Goldoroth | watch_on_goldoroth | shield_of_dondor | 26,3 | 70 | event_for Goldoroth zin_lerendor.9; lean +25 on Goldoroth; lean -15 on Dondor | 5; sup ×3 |
| `whispers_in_the_dark_holds` | Whispers in the Dark Holds | watch_on_goldoroth | – | 25,4 | 35 | event zin_lerendor.10; flag zin_leren_heard_whispers | 10 |
| `dark_shore_protectorate` | The Dark Shore Protectorate | blackton_free_towns + (shield_of_dondor / bargain_with_goldoroth) | – | 23,5 | 70 | flag zin_leren_dark_protection (Dark Shore targets for `zin_leren_offer_protection` at lean 80, or 60 on supremacy); lean +10 on Blackton | 8; sup ×3 |
| `close_the_dark_straits` | Close the Dark Straits | whispers_in_the_dark_holds | – | 25,5 | 70 | building coastal_bunker 1 @random_coastal ×2; building naval_base 1 @random_coastal | 8 |
| `wardens_of_the_dark_straits` | Wardens of the Dark Straits | dark_shore_protectorate / close_the_dark_straits | – | 24,6 | 70 | navy_experience 15; political_power 50; if Goldoroth is at war with Dondor or Blackton and Shield of Dondor is done: wargoal Goldoroth puppet_wargoal_focus | 8; ×5 if Goldoroth attacks Dondor |

### Branch 6: The Long Watch

**Purpose:** Zol's dead from the north. In peace the branch builds watch-fires, keeps and muster rolls, listens to fishermen and sends scholars into old books; nothing in it knows the dead will rise. When `zin_zol_rising` is set its war half opens. Ordinary weapons cannot end Zol's dead (established), so the branch only buys time; Seek the Old Wards asks the world-systems mechanic for real magic. **Opens:** at start; The Dead Walk and everything below it need `zin_zol_rising`. **Mutual exclusions:** none. **Mechanic:** `zin_leren_strait_barred`, `zin_leren_seeks_wards`, `zin_leren.50`/`.51`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_long_watch` | The Long Watch | – | – | 28,0 | 70 | call zin_lerendor_recruit(zin_leren_marshal_hesk); army_experience 10 | 15 |
| `hear_the_fishermen` | Hear the Fishermen | the_long_watch | – | 27,1 | 35 | flag zin_leren_heard_fishermen (enables `zin_leren.50`); navy_experience 5 | 10 |
| `the_kings_army` | The King's Army | the_long_watch | – | 29,1 | 70 | research [land_doctrine] 50% ×1; army_experience 10 | 12 |
| `watchfires_on_the_capes` | Watch-Fires on the Capes | hear_the_fishermen | – | 27,2 | 70 | building coastal_bunker 1 @strait_north; building infrastructure 1 @random_owned | 10 |
| `muster_rolls` | Muster Rolls of the Two Crowns | the_kings_army | – | 29,2 | 70 | manpower 10000; cohesion +3 | 10 |
| `keeps_on_the_northern_shore` | Keeps on the Northern Shore | watchfires_on_the_capes / muster_rolls | – | 28,3 | 70 | building coastal_bunker 2 @random_coastal; add_spirit long_watch | 10 |
| `scholars_of_the_dead` | Scholars of the Dead | keeps_on_the_northern_shore | – | 27,4 | 70 | event zin_lerendor.11; political_power 25 | 8 |
| `leren_shieldwall` | The Leren Shieldwall | keeps_on_the_northern_shore / muster_rolls | – | 29,4 | 70 | add_spirit shieldwall; research [land_doctrine] 50% ×1 | 10 |
| `patrol_the_black_islands` | Patrol the Black Islands | scholars_of_the_dead / leren_shieldwall | – | 28,5 | 70 | navy_experience 10; if not fired: event zin_leren.50 | 8 |
| `the_dead_walk` | The Dead Walk | patrol_the_black_islands | – | 28,6 | 35 | Avail: global_flag zin_zol_rising; add_spirit dead_walk; manpower 10000 | 500 when available |
| `fire_and_salt` | Fire and Salt | the_dead_walk | – | 27,7 | 70 | add_spirit fire_and_salt; equipment infantry_equipment 1000 | 50 |
| `levy_of_the_north` | The Levy of the North | the_dead_walk | – | 29,7 | 70 | manpower 15000; equipment infantry_equipment 1500 | 50 |
| `seek_the_old_wards` | Seek the Old Wards | fire_and_salt | – | 27,8 | 70 | flag zin_leren_seeks_wards; political_power 50; tooltip "The wardens' old craft is sought. What it can still do is unknown." | 30 |
| `hold_the_capes` | Hold the Capes | levy_of_the_north | – | 29,8 | 70 | building coastal_bunker 2 @strait_north; tooltip "Counts toward barring the strait." | 40 |
| `the_watch_holds` | The Watch Holds | seek_the_old_wards / hold_the_capes | – | 28,9 | 70 | swap_spirit long_watch→watch_holds; war_support 0.05 | 40 |

### Branch 7: Honour the Treaty

**Purpose:** keep the old alliance. Lerendor renews the oaths of 512, guards Aenor's northern coast and answers when Aenor calls. After the Golden King's death it must decide what it is faithful to: **the crown of Parim**, whoever wears it, or **the realm**, Aenor's people, once Eindil is named or the truth is out. **Opens:** Honour the Treaty, from The Question of the Strait, when standing ≥ -30. **Mutual exclusions:** the route focus excludes the other two routes; Faithful to the Crown / Faithful to the Realm. **Mechanic:** `zin_leren_route_honour`, the call to war `zin_leren.20`, `zin_leren_treaty_honoured`, standing.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `honour_the_treaty` | Honour the Treaty | question_of_the_strait | stand_apart, master_of_the_strait | 7,8 | 70 | Avail: standing ≥ -30; flag zin_leren_route_honour; standing +15; call zin_leren_clear_grievances; add_spirit treaty_kept | route rule (see AI); free: 50 + standing |
| `renew_the_oaths` | Renew the Oaths of 512 | honour_the_treaty | – | 6,9 | 70 | event_for Aenor zin_lerendor.12 | 50 |
| `envoys_to_parim` | A Standing Embassy in Parim | honour_the_treaty | – | 8,9 | 35 | political_power 25; standing +5 | 30 |
| `joint_squadron` | The Joint Squadron | renew_the_oaths | – | 6,10 | 70 | navy_experience 20; building naval_base 1 @sonargur | 30 |
| `answer_the_lost_cause` | Answer the Lost Cause | envoys_to_parim | – | 8,10 | 70 | flag zin_leren_in_lost_cause (read by the Aenor spec); war_support 0.05; army_experience 10 | 30 |
| `faithful_to_the_crown` | Faithful to the Crown of Parim | joint_squadron / answer_the_lost_cause | faithful_to_the_realm | 5,11 | 70 | standing +10; call zin_afrit_add_footholds(1); political_power 50 | 20; ×0.1 if Faithful to the Realm is available |
| `shield_the_northern_coast` | Shield Aenor's Northern Coast | joint_squadron | – | 7,11 | 70 | navy_experience 15; flag zin_leren_guards_aenor_coast; tooltip "Leren squadrons patrol the strait for Aenor." | 30 |
| `faithful_to_the_realm` | Faithful to the Realm | answer_the_lost_cause | faithful_to_the_crown | 9,11 | 70 | Avail: global_flag zin_afrit_revealed, or (zin_eindil_named and zin_golden_king_dead); flag zin_lerendor_for_the_realm; call zin_afrit_add_footholds(-1); war_support 0.05 | 100 when available |
| `when_aenor_calls` | When Aenor Calls | shield_the_northern_coast | – | 7,12 | 35 | Avail: Aenor has a defensive war, or zin_war_of_last_crowns; event zin_leren.20 (if already honoured: war_support 0.10) | 500 when available |
| `the_crowns_fleet` | The Crown's Fleet | faithful_to_the_crown + when_aenor_calls | – | 5,13 | 70 | navy_experience 25; call zin_lerendor_lay_down_ships(2) | 40 |
| `relief_of_parim` | The Relief of Parim | when_aenor_calls | – | 7,13 | 70 | Avail: check zin_lerendor_parim_lost; army_experience 25; war_support 0.10; timed_spirit relief_host 365d | 100 when available |
| `northern_companies` | The Northern Companies | faithful_to_the_realm | – | 9,13 | 70 | Avail: global_flag zin_eindil_returned; flag zin_leren_companies_with_eindil (read by the Eindil spec); army_experience 15; manpower -5000 | 100 when available |
| `the_old_alliance_restored` | The Old Alliance Restored | the_crowns_fleet / relief_of_parim / northern_companies | – | 7,14 | 70 | Avail: Aenor exists; Lerendor not at war with Aenor; zin_eindil_crowned or zin_afrit_dead or Aenor not at war; standing +25; add_spirit old_alliance; tooltip "An outcome of this game, not history." | 50 |

### Branch 8: The North Stands Apart (historical)

**Purpose:** the historical route. The court counts its grievances, keeps out of Aenor's quarrels and, when the war comes, withdraws from the treaty. It then holds the North against Zol's dead, closes the strait to belligerents, shelters refugees, and lets free companies sail to Eindil's coalition without bending the knee. **Opens:** The North Stands Apart, from The Question of the Strait, when standing ≤ 30. **Mutual exclusions:** the route focus excludes the other two routes. **Mechanic:** `zin_leren_route_break`, `zin_leren_withdraw`, `zin_leren_withdrawal`, Close the Strait.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `stand_apart` | The North Stands Apart | question_of_the_strait | honour_the_treaty, master_of_the_strait | 13,8 | 70 | Avail: standing ≤ 30; flag zin_leren_route_break; standing -10; add_spirit the_north_apart | hist 1000; free: 50 − standing ÷ 2 |
| `count_the_grievances` | Count the Grievances | stand_apart | – | 12,9 | 35 | event zin_lerendor.13; political_power 50; war_support 0.03 | 40 |
| `the_neutral_north` | The Neutral North | stand_apart | – | 14,9 | 70 | stability 0.05; call zin_lerendor_compact_lean(5) | 40 |
| `withdraw_from_the_treaty` | Withdraw from the Treaty | count_the_grievances + the_neutral_north | – | 13,10 | 35 | Avail: not zin_leren_withdrawal; zin_war_of_last_crowns, or (zin_golden_king_dead and standing ≤ -60); call zin_leren_withdraw | hist: 0 before zin_war_of_last_crowns, 1000 after |
| `close_the_northern_seas` | Close the Northern Seas | withdraw_from_the_treaty | – | 11,11 | 70 | flag zin_leren_seas_closed (permits Close the Strait); building coastal_bunker 1 @sonargur; navy_experience 15 | 50 |
| `armed_neutrality` | Armed Neutrality | withdraw_from_the_treaty | – | 13,11 | 70 | add_spirit armed_neutrality; manpower 10000 | 60 |
| `no_crown_above_ours` | No Crown Above Ours | withdraw_from_the_treaty | – | 15,11 | 70 | political_power 100; popularity dominion 0.10; cohesion +5; stability 0.03 | 30 |
| `shelter_the_refugees` | Shelter the Refugees | close_the_northern_seas / armed_neutrality | – | 12,12 | 70 | Avail: zin_war_of_last_crowns; event zin_lerendor.17 | 40 |
| `hold_the_north_alone` | Hold the North Alone | armed_neutrality / no_crown_above_ours | – | 14,12 | 70 | Avail: zin_zol_rising; add_spirit hold_north | 200 when available |
| `free_companies` | Free Companies for the Coalition | shelter_the_refugees | – | 12,13 | 70 | Avail: zin_eindil_returned; event zin_lerendor.18; flag zin_leren_companies_with_eindil; army_experience 15 | 300 when available |
| `a_treaty_among_equals` | A Treaty Among Equals | hold_the_north_alone | – | 14,13 | 70 | Avail: zin_afrit_dead or zin_eindil_crowned; Aenor exists; event_for Aenor zin_lerendor.15; tooltip "An outcome of this game, not history." | 100 when available |
| `the_free_north` | The Free North | free_companies / a_treaty_among_equals | – | 13,14 | 70 | swap_spirit the_north_apart→free_north | 50 |

### Branch 9: Mastery of the Strait

**Purpose:** Leren supremacy. The Admiralty's dream: the treaty torn up, R'en's gateway in Leren hands, the far shore claimed, the Dark Lands coast paying tribute, and Lerendor proclaimed Sovereign of the Narrow Sea. Every war here waits for the treaty to be torn and the mechanic's peace gates. **Opens:** Mastery of the Strait, from The Question of the Strait, when hegemony ≥ 40 or Masters of the Strait Waters is done. **Mutual exclusions:** the route focus excludes the other two routes. **Mechanic:** `zin_leren_route_supremacy`, toll level 4, `zin_leren_claim_r_en`, `zin_leren_claim_far_shore`, `zin_leren_holds_strait`, `zin_leren_declare_supremacy`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `master_of_the_strait` | Mastery of the Strait | question_of_the_strait | honour_the_treaty, stand_apart | 20,8 | 70 | Avail: hegemony ≥ 40 or focus masters_of_the_strait_waters done; flag zin_leren_route_supremacy; standing -10; add_spirit strait_ambition | route rule; free: hegemony (×2 with Admiralty Ascendant) |
| `claim_both_shores` | Claim Both Shores | master_of_the_strait | – | 19,9 | 70 | war_support 0.05; political_power 50; tooltip "Claims follow once the treaty is torn." | 50 |
| `the_iron_toll` | The Iron Toll | master_of_the_strait | – | 21,9 | 35 | flag zin_leren_iron_toll (permits toll level 4); call zin_leren_set_toll_level(3); political_power 50; standing -10 | 50 |
| `tear_up_the_treaty` | Tear Up the Treaty | claim_both_shores + the_iron_toll | – | 20,10 | 35 | Avail: not zin_leren_withdrawal; zin_war_of_last_crowns, or (zin_golden_king_dead and standing ≤ -60); call zin_leren_withdraw | 1000 when available |
| `gateway_of_r_en` | The Gateway of R'en | tear_up_the_treaty | – | 19,11 | 70 | if lean on R'en ≥ 60: call zin_leren_offer_protection(R'en); else: call zin_leren_claim_r_en | 60 |
| `fleet_of_dominion` | A Fleet of Dominion | tear_up_the_treaty | – | 21,11 | 70 | call zin_lerendor_lay_down_ships(3); add_spirit fleet_of_dominion | 60 |
| `crown_of_the_strait` | Crown of the Strait | gateway_of_r_en / fleet_of_dominion | – | 20,12 | 70 | event zin_lerendor.16; political_power 100; stability 0.03 | 50 |
| `the_far_shore` | The Far Shore | crown_of_the_strait | – | 19,13 | 70 | Avail: zin_war_of_last_crowns; call zin_leren_claim_far_shore | 80 when available |
| `tribute_of_the_dark_shore` | Tribute of the Dark Shore | crown_of_the_strait | – | 21,13 | 70 | call zin_lerendor_dark_shore_tribute | 50 |
| `sovereign_of_the_narrow_sea` | Sovereign of the Narrow Sea | the_far_shore / tribute_of_the_dark_shore | – | 20,14 | 70 | Avail: check zin_leren_holds_strait; call zin_leren_declare_supremacy; swap_spirit strait_ambition→sovereign | 500 when available |
| `the_leren_hegemony` | The Leren Hegemony | sovereign_of_the_narrow_sea | – | 20,15 | 70 | Avail: hegemony ≥ 80; stability 0.05; war_support 0.05; for every Compact member: call zin_leren_offer_protection; tooltip "An outcome of this game, not history." | 100 when available |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/focus/lerendor.json` | Tree data (source of truth) |
| `common/national_focus/zin_lerendor.txt` | Compiled tree; `country = { factor = 0 modifier = { add = 10 zin_is_lerendor = yes } }` |
| `common/ideas/zin_focus_lerendor.txt` | Spirits below |
| `events/zin_lerendor.txt` | Namespace `zin_lerendor`; effect-triggered only |
| `common/scripted_effects/zin_lerendor.txt` | Tree effects below |
| `common/scripted_triggers/zin_lerendor.txt` | Tree triggers below |
| `common/characters/zin_lerendor.txt` | Four proposed characters |
| `localisation/english/zin_focus_lerendor_l_english.yml` | All text |

Mechanic effects, triggers, variables, decisions and events (`zin_leren_*`, namespace `zin_leren`) belong to the mechanic spec and are only called here.

### Tree-declared scripted effects and triggers

| Name | Kind | Does |
| --- | --- | --- |
| `zin_lerendor_recruit` (`character`) | effect | `recruit_character` for a proposed Leren character; no-op if already recruited |
| `zin_lerendor_lay_down_ships` (`count`) | effect | Adds `count` ship productions of the warfare spec's strait galley (placeholder: vanilla destroyer hull) with `add_equipment_production`, 1 dockyard each, 50% progress |
| `zin_lerendor_compact_lean` (`value`) | effect | `zin_leren_add_lean` on every member of Lerendor's faction except Lerendor |
| `zin_lerendor_compact_gift` | effect | navy_experience 5 to every Compact member |
| `zin_lerendor_dark_shore_tribute` | effect | For each `zin_leren_is_dark_shore` country: lean ≥ 40 → `zin_leren_offer_protection`; otherwise, if the Dark Shore war gate is open, `add_state_claim` on its coastal states |
| `zin_lerendor_parim_lost` | trigger | The `zin_is_site_parim` state is not controlled by Aenor or Aenor's allies |

`@strait_north` in building effects means a random owned state with `zin_is_site_strait_north`; `@sonargur` means `zin_is_site_sonargur`.

### Characters (proposed)

| Id | Name | Role | Traits (vanilla placeholders) | Recruited by |
| --- | --- | --- | --- | --- |
| `zin_leren_chancellor_maelis` | Maelis of Lerenwaith | political advisor, "Chancellor of Lerenwaith": stability_factor 0.05 | – | The Chancellor of Lerenwaith |
| `zin_leren_tollmaster_brannoc` | Brannoc the Toll-Master | political advisor, "Master of the Strait Dues": political_power_gain 0.10 | – | Toll Houses on Both Shores |
| `zin_leren_admiral_ostvar` | Ostvar Greysail | navy leader, skill 4 | `blockade_runner`, `navy_lion` placeholders mapped by the warfare spec | A Lord Admiral of the Strait |
| `zin_leren_marshal_hesk` | Torvald Hesk | field marshal, skill 3, "Marshal of the Long Watch" | `defensive_doctrine` | The Long Watch |

Portraits are image-generated (art spec). Lerendor's king stays the generated ruler until the owner names him.

### Spirits

Ids are `zin_lerendor_<key>`. All modifier keys exist in the game's modifier documentation (`production_speed_dockyard_factor` is the documented `production_speed_<Building>_factor` form).

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `strait_merchants` | Merchants of the Strait | consumer_goods_factor -0.03, production_speed_buildings_factor 0.05 | The Merchant Guilds of the Strait; permanent |
| `toll_houses` | Toll Houses on Both Shores | political_power_gain 0.10 | Toll Houses; removed if toll level is set to 0 |
| `northern_industry` | A Northern Industry | production_factory_max_efficiency_factor 0.05, production_factory_efficiency_gain_factor 0.05 | A Northern Industry |
| `royal_dockyards` | The Royal Dockyards | production_speed_dockyard_factor 0.10, industrial_capacity_dockyard 0.10 | The Royal Dockyards |
| `strait_pilots` | Pilots of the Narrow Strait | naval_speed_factor 0.05, naval_mines_effect_reduction 0.10, positioning 0.05 | Pilots of the Narrow Strait |
| `strait_watch` | The Strait Watch | naval_detection 0.15, spotting_chance 0.10, convoy_escort_efficiency 0.10 | The Strait Watch |
| `blue_water` | Beyond the Strait | navy_max_range_factor 0.15, naval_speed_factor 0.05, repair_speed_factor 0.10 | Beyond the Strait |
| `fleet_in_being` | The Fleet in Being | navy_org_factor 0.05, naval_retreat_chance 0.05 | The Fleet in Being |
| `masters_of_the_strait` | Masters of the Strait Waters | naval_hit_chance 0.03, experience_gain_navy_factor 0.10, ai_focus_naval_factor 0.25 | Masters of the Strait Waters |
| `royal_household` | The Sonargur Household | political_power_gain 0.15 | The Sonargur Household; swapped by The Crown Ascendant |
| `estates_in_council` | The Estates in Council | stability_factor 0.05, political_power_gain -0.05 | Seat the Estates in Council; swapped by The Estates Ascendant; while present, cohesion +0.2 per month (mechanic) |
| `crown_ascendant` | The Crown Ascendant | political_power_factor 0.10, war_support_factor 0.05, drift_defence_factor 0.10 | The Crown Ascendant |
| `estates_ascendant` | The Estates Ascendant | stability_factor 0.08, consumer_goods_factor -0.02 | The Estates Ascendant; counts as the estates' spirit for cohesion drift |
| `admiralty_ascendant` | The Admiralty Ascendant | experience_gain_navy_factor 0.15, production_speed_dockyard_factor 0.10, navy_org_factor 0.05 | The Admiralty Ascendant |
| `compact_council` | Council of the Compact | opinion_gain_monthly_factor 0.15, improve_relations_maintain_cost_factor -0.20 | Convene the Compact Council |
| `compact_levies` | The Compact Levies | conscription_factor 0.10 | The Compact Levies |
| `long_watch` | The Long Watch | coastal_bunker_effectiveness_factor 0.15, army_core_defence_factor 0.05 | Keeps on the Northern Shore; swapped by The Watch Holds |
| `watch_holds` | The Watch Holds | coastal_bunker_effectiveness_factor 0.25, army_core_defence_factor 0.10, war_support_factor 0.05 | The Watch Holds |
| `shieldwall` | The Leren Shieldwall | army_defence_factor 0.05, army_org_factor 0.05 | The Leren Shieldwall |
| `dead_walk` | The Dead Walk | war_support_factor 0.10, army_morale_factor 0.05, conscription_factor 0.10 | The Dead Walk; removed by the peace that ends Lerendor's war with Zol |
| `fire_and_salt` | Fire and Salt | army_attack_factor 0.05, attrition -0.05 | Fire and Salt |
| `treaty_kept` | The Treaty Kept | stability_factor 0.05, opinion_gain_monthly_factor 0.10 | Honour the Treaty; removed if `zin_leren_withdrawal` is ever set |
| `relief_host` | The Relief Host | army_attack_factor 0.10, army_morale_factor 0.10 | The Relief of Parim, 365 days |
| `old_alliance` | The Old Alliance | stability_factor 0.05, consumer_goods_factor -0.03 | The Old Alliance Restored; replaces treaty_kept |
| `the_north_apart` | The North Apart | drift_defence_factor 0.15, war_support_factor 0.03 | The North Stands Apart; swapped by The Free North |
| `armed_neutrality` | Armed Neutrality | army_core_defence_factor 0.10, war_support_factor 0.05 | Armed Neutrality |
| `hold_north` | Holding the North | army_defence_factor 0.10, coastal_bunker_effectiveness_factor 0.10 | Hold the North Alone |
| `free_north` | The Free North | stability_factor 0.08, drift_defence_factor 0.20, political_power_gain 0.10 | The Free North |
| `strait_ambition` | Ambition of the Strait | political_power_gain 0.10, experience_gain_navy_factor 0.10 | Mastery of the Strait; swapped by Sovereign of the Narrow Sea |
| `fleet_of_dominion` | A Fleet of Dominion | production_speed_dockyard_factor 0.15, naval_hit_chance 0.03, ai_focus_naval_factor 0.25 | A Fleet of Dominion |
| `sovereign` | Sovereign of the Narrow Sea | naval_hit_chance 0.05, navy_org_factor 0.10, political_power_gain 0.20 | Sovereign of the Narrow Sea |

### Events (namespace `zin_lerendor`)

All are fired by focus or option effects; none has its own trigger. Text before `zin_afrit_revealed` never names Afrit.

| Id | Title | For | Fired by | Options (effects; AI) |
| --- | --- | --- | --- | --- |
| .1 | The Two Crowns | Lerendor | The Two Crowns of Leren | "Two crowns, one throne" (cohesion +5) / "Sonargur leads" (political_power 50, cohesion -5); AI 70/30 |
| .2 | The Royal Progress | Lerendor | The Royal Progress | "To the towns of Lerenwaith" (cohesion +10) / "To the strait ports" (navy_experience 15); AI 60/40, sup 20/80 |
| .3 | A Marriage for the Heir | Lerendor | A Marriage for the Heir | "A daughter of a Lerenwaith house" (cohesion +10) / "A daughter of Eekedor's merchant houses" (lean +20 on Eekedor, political_power 25) / "A cousin of the Aenoran court" (standing +10; cohesion -5); AI 50/30/20, hon ×3 on the third |
| .4 | The Priests of the Deliverer | Lerendor | Endow the Temples | Flavour: the priests bless the union and preach loyalty to the old friendship with Parim. "So be it" |
| .5 | The Sea Lords Swear | Lerendor | Bind the Sea Lords | "Oaths to the crown" (political_power 25) / "Charters to the captains" (navy_experience 15, cohesion -3) |
| .6 | The Compact Council Meets | Lerendor | Convene the Compact Council | "Sonargur presides" (political_power 25) / "Eekedor presides this year" (lean +10 on Eekedor) |
| .7 | Sonargur Asks Sensai | Sensai | The Sensai Question | "Friendship with Sonargur" (lean +20; Lerendor ↔ Sensai opinion +15) / "Sensai answers to no crown" (lean -10); AI chance = 50 + lean |
| .21 | Sensai's Answer | Lerendor | option of .7 | Result text |
| .8 | The Molot March | Molot | The Molot Marches | "Settle the march" (lean +15; non-aggression pact with Lerendor) / "Keep the balance" (lean -5); AI chance = 40 + lean |
| .22 | Molot's Answer | Lerendor | option of .8 | Result text |
| .9 | A Leren Envoy | Goldoroth | Bargain with Goldoroth | "Trade and no raids" (non-aggression pact with Lerendor; lean +10) / "Orcs bargain with no one" (lean -10); AI 60/40 |
| .23 | Goldoroth's Answer | Lerendor | option of .9 | Result text |
| .10 | Whispers in the Dark Holds | Lerendor | Whispers in the Dark Holds | Leren traders report that agents from the Dead Lands court the orc holds; most of the holds laugh at them. "Note it and watch" (flag) / "Tell Parim" (standing +3; Aenor's court dismisses it). No reveal of Volgan's plans |
| .11 | What the Scholars Found | Lerendor | Scholars of the Dead | Old books say the dead of the north were never laid to rest by steel alone. "Keep the books" (research [land_doctrine] 30% ×1) / "Old wives' tales" (political_power 25) |
| .12 | The Oaths of 512 | Aenor | Renew the Oaths of 512 | "Renew them" (standing +10; Lerendor ↔ Aenor military access; Lerendor opinion +10) / "Parim has no time for northern oaths" (standing -10); AI 60/40, ×0.5 if Aenor's `zin_court_corruption` ≥ 60 |
| .24 | Parim Answers the Oaths | Lerendor | option of .12 | Result text |
| .13 | The Grievance Roll | Lerendor | Count the Grievances | The court reads two centuries of slights, from the toll of 1716 down. "Remember every one" (war_support 0.05) / "Remember, but trade" (political_power 25) |
| .14 | The Crown Has Fled | Lerendor | mechanic monthly check (Faithful to the Crown done, `zin_afrit_king_of_east` set) | "Stand with Aenor's people" (flag zin_lerendor_for_the_realm; standing +5) / "Our oath was to Aenor's king" (standing -10; Lerendor stays out of the eastern war); AI 80/20 |
| .15 | A Treaty Among Equals | Aenor | A Treaty Among Equals | "Sign as equals" (both: opinion +25; Lerendor flag zin_leren_new_treaty) / "Aenor signs no such thing" (both: opinion -15); AI 70/30 |
| .25 | Parim's Reply | Lerendor | option of .15 | Result text |
| .16 | The Crown of the Strait | Lerendor | Crown of the Strait | The king is crowned on the harbour chain of Sonargur. "Long live the Sovereign" (war_support 0.05) |
| .17 | Refugees at Sonargur | Lerendor | Shelter the Refugees | "Open the gates" (manpower 15000; stability -0.03) / "Feed them and send them on" (stability 0.02; political_power -25) |
| .18 | The Free Companies Sail | Lerendor | Free Companies for the Coalition | Northern volunteers sail to the stranger who breaks the dead. "Go as free men" (army_experience 10) |
| .19 | The Union Reforms | Lerendor | The Union Reforms | "More seats for Lerenwaith" (cohesion +10; political_power -25) / "One law from Sonargur" (political_power 50; cohesion -5) |
| .20 | The Question of the Strait | Lerendor | The Question of the Strait | Council debate; shows standing, hegemony and toll. "Let the king decide" |

### Data checks for this tree

- 127 focuses; unique keys; unique (x,y); x from 0 to 29; every focus's y is greater than every prerequisite's y.
- Every exclusive pair is listed on both sides; the compiler makes it symmetric.
- Days are 35 or 70.
- `raw` blocks: none planned (limit 10).
- Every `call` and `check` names an effect or trigger defined in the mechanic spec, this spec, or the shared contract (`zin_afrit_add_footholds` is a proposed contract addition).

## AI

### Historical route (4A 1748 to 4A 1760)

With `zin_rule_leren_route = historical` or `zin_rule_historical_path`, factors marked "hist" apply and the honour and supremacy route focuses get factor 0. Dates are targets for the test run.

| Window | Focuses (in order) | Story beats |
| --- | --- | --- |
| Thaw 1748 – Harvest 1748 | The Two Crowns of Leren, The Strait Treasury, Fleets of the Strait | Peace |
| Fallowing 1748 – Ironfrost 1749 | Read the Toll Rolls, Reopen the Toll Quarrel, Full Strait Dues | Aenor mocks the envoys; toll to Leren Dues (2) |
| Rainwake 1749 – Deepwinter 1750 | The Leren Compact, The Sonargur Household, The Royal Dockyards, Convene the Compact Council, Envoys to the Northern Crowns | Envoys to Mina, The Hold, Tolhon |
| Ironfrost 1750 – Mistfall 1750 | Summon the Lerenwaith Estates, The Royal Progress, A Marriage for the Heir, One Throne Two Laws, Bind the Sea Lords | Mistfall: the Golden King dies (`zin_leren.40`); King Aurevan's envoys (`zin_leren.41`, AI delays) |
| Longnight 1750 – Fallowing 1751 | The Galley Squadrons, The Crown Ascendant, The King's Peace, The Union Reforms, The Question of the Strait | Standing about -40 |
| Mistfall 1751 – Highsun 1752 | The North Stands Apart, Count the Grievances, The Neutral North, The Compact Tariff | Route fixed: break |
| Goldfield 1752 – Thaw 1753 | The Sensai Question, Mina and The Hold, Open the Compact, The Molot Marches | Two to four crowns join the Compact; hegemony 20–30 |
| Rainwake 1753 – Mistfall 1754 | The Long Watch, Hear the Fishermen, The Merchant Guilds, Pilots of the Narrow Strait, The Strait Watch, Watch-Fires on the Capes, The King's Army, Muster Rolls, Keeps on the Northern Shore | Fishermen's tales (`zin_leren.50`); Eindil's warning heard and dismissed (`zin_leren.45`) |
| Longnight 1754 – Thaw 1755 | The Compact Levies, Across the Dark Straits | Standing -60 to -75 |
| 1755, within 60 days of `zin_war_of_last_crowns` | Withdraw from the Treaty | `zin_leren_withdrawal`; Lerendor does not attack Aenor |
| 1755 – 1756 | Close the Northern Seas, Scholars of the Dead, Patrol the Black Islands, The Dead Walk, Armed Neutrality, Hold the North Alone, The Levy of the North, Fire and Salt, Shelter the Refugees | `zin_zol_rising`: Lerendor fights Zol on its coasts; closes the strait to belligerents |
| 1757 | Hold the Capes, Free Companies for the Coalition, Seek the Old Wards, The Watch Holds | `zin_eindil_returned`: free companies join Eindil's coalition |
| 1758 – 1760 | No Crown Above Ours, economy and Dark Shore focuses, A Treaty Among Equals (after `zin_afrit_dead`), The Free North | Lerendor ends the age independent |

### Alternative routes

| Route | How the AI gets there | Key choices |
| --- | --- | --- |
| **Honour** (`zin_rule_leren_route = honour`, or `free` with high standing) | The Estates Ascendant, Endow the Temples, Keep the Treaty Toll, A Marriage (Aenoran cousin), Honour the Treaty in 1751 | Renews the oaths; When Aenor Calls in 1755 joins Aenor's defence; Faithful to the Realm as soon as it is available, otherwise Faithful to the Crown (and `zin_lerendor.14` turns it to Aenor's people when the king goes east); The Relief of Parim when Parim falls; The Old Alliance Restored after the war |
| **Supremacy** (`zin_rule_leren_route = supremacy`, or `free` with hegemony ≥ 40) | The Admiralty Ascendant, The Crown Over the Altar, Full Strait Dues, Beyond the Strait, Talks at the Gateway, One Banner for the North; protection offers to high-lean crowns until hegemony ≥ 40 | Mastery of the Strait 1752–1753; Tear Up the Treaty at the war; R'en by protection or claim; The Far Shore during the war; Sovereign of the Narrow Sea once it holds the strait |
| **Player** | Any order; the Question opens after the King's death or 4A 1751 | A player can reach any route; war focuses still wait for story flags |

### General AI notes

- Before 4A 1750 the AI weights court, treasury, fleet and Compact focuses only; war-tagged focuses have no weight before their story flag.
- After `zin_zol_rising` the Long Watch war focuses take priority (weights 50–500).
- The AI never takes Bargain with Goldoroth on the historical route.

## Acceptance

1. The compiler accepts `lerendor.json`: 127 focuses, unique positions, prerequisites above their focuses, symmetric exclusions, days multiples of 7, no unknown modifier, effect or trigger.
2. The HOI4 Agent Tools focus inspector reports no errors; the focus renderer's review image shows nine readable branches within 30 columns.
3. On 1 Thaw 4A 1748, no available focus can create a wargoal, a claim or a war (offline scan of every focus reachable before 4A 1751 without story flags).
4. The Question of the Strait is unavailable on day one and becomes available after `zin_golden_king_dead` or on 1 Thaw 4A 1751.
5. Historical AI run: the AI takes The North Stands Apart, completes Withdraw from the Treaty within 60 days of `zin_war_of_last_crowns`, takes The Dead Walk within 60 days of `zin_zol_rising`, never declares war on Aenor, and ends 4A 1760 independent.
6. Honour-rule run: the AI takes Honour the Treaty and When Aenor Calls, and `zin_leren_treaty_honoured` is set.
7. Supremacy-rule run: the AI reaches Mastery of the Strait and Tear Up the Treaty; Sovereign of the Narrow Sea in at least one of five runs.
8. No text reachable before `zin_afrit_revealed` names Afrit (compiler secret check).
9. All 31 spirits load; every modifier key is in the game's modifier documentation.

## Open questions

1. Should the Leren king and his heir have lore names, so the marriage and coronation events can name them?
2. Are the Lerenwaith estates and the Admiralty acceptable as the court's parties, or does the owner have Leren factions in mind?
3. Should Faithful to the Crown be allowed to follow the king east (joining Afrit's eastern cause) as a dark alternative, or should the North never follow him?
4. Is a Leren crown of the strait (supremacy) acceptable as a proposed outcome, or should Lerendor's ambitions stay purely northern?
5. Should Sensai, the most populous North Lands crown, get its own rival route against Lerendor in its tier B tree?
