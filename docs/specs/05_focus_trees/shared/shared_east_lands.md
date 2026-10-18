# Shared Tree: Courts of the East

**Status:** Draft. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

The shared focus tree for the **24 tier C courts of the East Lands** (tree id `shared_east_lands`, focus ids `zin_shared_east_lands_<key>`, data file `docs/design/focus/shared_east_lands.json`). One tree serves every small eastern crown, road town and coastal lordship that is not a great power or a tier B kingdom. It plays the eastern kings mechanic ([../../04_mechanics/eastern_kings.md](../../04_mechanics/eastern_kings.md)) from below: a court that sits between Furvior and Postondoroth, keeps a road or a well, hears the temples' generous friends, and, when the age ends, must answer the eastern coalition and the King of the East.

The tree is also the **module library** for the nine tier B eastern trees ([../regional/east_lands.md](../regional/east_lands.md)). Its branches are labelled E1 to E10. A tier B tree copies a whole module into its own file under its own tree id, as [../01_tiers_and_coverage.md](../01_tiers_and_coverage.md) allows.

| Item | Value |
| --- | --- |
| Tree id | `shared_east_lands` |
| Tier | C (shared) |
| Countries (24) | Delbiz Grasslands, Mostok, Azano, The Moco, Cream, Ernois, Fosoco, Kersian, Eraver, Pornivior, Grova, Vigodor, Woqood, Arcon, Obmi, Furro, Hacsen, Oreton, Nethnu, Olor, Orato, Mylunur, Lorvens, Fladev |
| Focuses | 68 in eleven parts (root and modules E1 to E10) |
| Width | columns 0 to 29, rows 0 to 9 |
| Events | namespace `zin_shared_east_lands` |
| Spirits | `zin_shared_east_lands_<key>` |

## Lore basis

**Established** (vault): the East Lands lie across a long rift sea east of the Magical Lands and run off the eastern map; the South Lands are the great desert of the East Lands and run off the southern map; Noris (with Gondolin, the Noris Treaty) and Stabilo (with Drak, the Stabilo Pact) are rivals (working table); the Hidden Council builds ties in East Lands and South Lands courts as a reserve seat of power; in the final war an eastern coalition invades the Magical Lands and threatens the Middle Kingdom, its commanders seeking wealth, territory, revenge or deliverance from their own rulers' crises, some secretly tied to the Deliverer's networks; Afrit takes command of an eastern host and is proclaimed King of the East, though states of the East still resist him; abandoned eastern troops join Eindil's temporary coalition; claims and grievances remain after the war. In the First Age, allied men from eastern and southern lands served in Volgan's army (*Peoples of Erdae*); this does not mean every eastern people served him.

**Proposed in the vault:** the caravan roads (4A 600 to 780) and the rivalry they began; the eastern branch's courtship from about 4A 1300.

**Proposed in the mechanic spec and used here:** the five roads, charters, influence, lean, rivalry, kneel bias, coalition weight, the Free Crowns, wells and dry land.

**Proposed here:** every focus, spirit, event and number; the route flag `zin_east_route_resist`; the audit flag `zin_east_court_audit`; the site trigger `zin_is_site_east_north_coast`.

**Open and kept open:** which eastern kings join Afrit willingly; what becomes of the eastern invaders after Eindil's coronation; what lies beyond the eastern and southern map edges. No focus text states any of these.

## Design

### The peaceful start

On 1 Thaw 4A 1748 every available focus is about markets, roads, wells, temples, envoys, levies and coasts. No focus available at start creates a war goal, a claim or a war. The Question of the East (E9) opens only with the mechanic's junction trigger `zin_east_question_open`; Beyond the Rift (E10) needs the flag `zin_east_coalition_member`, which the mechanic sets no earlier than 30 days after `zin_war_of_last_crowns`. The only claims in the tree come from `zin_east_claim_rift` (coalition members at war) and `zin_east_grant_free_cb` (refusers while the King of the East reigns): both behind the mechanic's peace gates.

### Who sees what

Branches open with `allow_branch` on the root's children, so one tree reads differently for a desert road-town, a north-coast fishing crown and a protected court.

| Opens by | Condition | Module |
| --- | --- | --- |
| Region | every country of the tree (all are East Lands courts) | Root, E1, E3, E4, E5, E9 |
| Region (South Lands) | `check zin_east_is_south_court` | E2 Wells of the South Lands |
| Region (roads) | `check zin_shared_east_lands_on_road` | the road half of E1 (`lords_of_the_road` and below) |
| Coast (Ocean of Zol) | `check zin_shared_east_lands_north_coast` | E6a The Northern Sea |
| Coast (rift sea) | `check zin_east_faces_rift` | E6b The Rift Shore |
| Ideology | ruling ideology Dominion or Wild / Light or Wild / Wild | the three heads of E7 |
| Overlord | `is_subject: true` | E8 Under a Protector |
| People | `people: men` and South Lands court | `riders_of_the_dunes` in E2 (camel and horse riders of the desert; the Noris camel warriors are a tradition of men, established) |
| Story | `zin_east_question_open`; `zin_east_coalition_member` | E9, E10 |

Every court of the tree is a realm of men today. The people condition exists so that a released or newly formed eastern country of another people does not get desert rider content; it then sees every other branch.

### Text

Focus names and descriptions use `[ROOT.GetName]` and `[ROOT.GetAdjective]`, for example "Markets of the [ROOT.GetAdjective] Towns". Before `zin_afrit_revealed`, no text names Afrit, the Hidden Council or the eastern branch; the Deliverer is `[zin_loc_deliverer]` and his people are "the Deliverer's generous friends" or "the temples". Before `zin_eindil_named`, Eindil is `[zin_loc_eindil]`; in this tree he is "the stranger".

### Module map

| Module | Name | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| Root | The Court of [ROOT.GetName] | 14 | 0 | 1 | start | — |
| E1 | Roads and Markets | 0–4 | 1–4 | 7 | start; road half by road | factories, infrastructure, trade |
| E2 | Wells of the South Lands | 5–7 | 1–3 | 5 | South Lands court | `zin_east_wells_unlocked`, wells, `zin_east.35` |
| E3 | Between Furvior and Postondoroth | 8–12 | 1–4 | 9 | start | `zin_east_lean`, joining the Treaty or the Pact, Stabilo debt |
| E4 | The Generous Friends | 13–15 | 1–4 | 6 | start | `zin_footholds`, `zin_east_court_audit`, purge |
| E5 | Levies of the East | 17–19 | 1–4 | 6 | start | army |
| E6 | Coasts (a: the Northern Sea, b: the Rift Shore) | 21, 23 | 1–4 | 7 | coast | navy, coastal forts, Zol's rumours, the rift trade |
| E7 | The Old Customs | 25–29 | 1–3 | 7 | ideology | drift through `zin_politics_add_drift`, government spirits |
| E8 | Under a Protector | 0–2 | 6–8 | 4 | subject | autonomy, overlord's road |
| E9 | The Question of the East | 9–18 | 6–9 | 11 | `zin_east_question_open` | `zin_east_pledged`, `zin_east_route_resist`, Free Crowns |
| E10 | Beyond the Rift | 23–25 | 6–8 | 5 | `zin_east_coalition_member` | coalition war, `zin_east_claim_rift`, `zin_east_companies_with_eindil` |

### Notation used in the tables

- **Prerequisites:** `a + b` means a and b; `a / b` means a or b.
- **x,y:** grid column and row.
- **Effects** use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md). Spirit keys are short and compile to `zin_shared_east_lands_<key>`.
- **Shorthands:** **Lean +n** = `call zin_east_add_lean(value = n)` on ROOT (positive is toward Furvior, negative toward Postondoroth). **Footholds ±n** = `call zin_afrit_add_footholds(value = n)` on ROOT (Afrit spec; respects caps). **Debt ±n** = `call zin_stabilo_add_debt(value = n)` on ROOT (Stabilo tree). **Drift X +n** = `call zin_politics_add_drift(IDEOLOGY = X, VALUE = n)` (politics spec; the only way focuses move popularity).
- **Where:** `@capital`, `@random_owned`, `@random_coastal`; `@rift_east` = a random owned state with `zin_is_site_rift_east`; `@north_coast` = a random owned state with `zin_is_site_east_north_coast`.
- **AI** is `ai.base` and its factors. **hist** = `check zin_rules_is_historical`. **refuse rule** = `check zin_rules_ai_branch_east_refuse_afrit` or `check zin_rules_ai_branch_east_unite_without_afrit`. **client** = flag `zin_afrit_eastern_client`; **refuser** = flag `zin_afrit_refused_east`.
- Research categories are the warfare spec's `zin_cat_*` keys and the vanilla `industry` category.

### Root

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `courts_of_the_east` | The Court of [ROOT.GetName] | – | – | 14,0 | 70 | political_power 50; stability 0.02 | 100 | `crown_iron` |

### E1. Roads and Markets

**Purpose:** the wealth of a small eastern court: its markets, its share of a caravan road, its workshops. **Opens:** at start; the road half (`lords_of_the_road`, `caravanserais`) needs `check zin_shared_east_lands_on_road` as `allow_branch` on `lords_of_the_road`. **Mechanic:** none beyond the court's own economy; road courts drift toward the charter holder through the mechanic, not through these focuses.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `market_of_the_court` | Markets of the [ROOT.GetAdjective] Towns | courts_of_the_east | – | 2,1 | 70 | building industrial_complex 1 @capital; political_power 25 | 40 | `market_stalls` |
| `lords_of_the_road` | Lords of the Road | market_of_the_court | – | 1,2 | 70 | allow_branch: check zin_shared_east_lands_on_road. call zin_shared_east_lands_road_infra; stability 0.02 | 30 | `traders_road` |
| `guild_of_factors` | The Factors' Guild | market_of_the_court | – | 3,2 | 70 | research [industry] 50% ×1; political_power 25 | 25 | `guild_hall` |
| `caravanserais` | Caravanserais of [ROOT.GetName] | lords_of_the_road | – | 0,3 | 70 | add_spirit caravanserais | 25 | `caravan` |
| `tolls_at_the_gates` | Tolls at the Gates | lords_of_the_road / guild_of_factors | – | 2,3 | 35 | political_power 75 | 20 | `toll_house` |
| `workshops_of_the_towns` | Workshops of the Towns | guild_of_factors | – | 4,3 | 70 | building industrial_complex 1 @random_owned | 25 | `workshop_tools` |
| `richest_road_in_the_east` | The Richest Road in the East | caravanserais / tolls_at_the_gates / workshops_of_the_towns | – | 2,4 | 70 | building industrial_complex 1 @capital; political_power 50; stability 0.03 | 20 | `coin_chest` |

### E2. Wells of the South Lands

**Purpose:** water in the southern desert. Wells turn the mechanic's dry land (`zin_east_dry_land`: supply −25%, truck attrition +25%) into watered land. **Opens:** `allow_branch` on `the_dry_roads`: `check zin_east_is_south_court`. **Mechanic:** `zin_east_wells_unlocked` (opens the decision `zin_east_dig_wells`), `zin_east_wells_random`, `zin_east.35`. Today the South Lands courts of this tree are Mostok, Obmi and Oreton.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_dry_roads` | The Dry Roads | courts_of_the_east | – | 6,1 | 70 | flag zin_east_wells_unlocked; call zin_east_wells_random | 40 | `traders_road` |
| `diggers_of_wells` | Diggers of Wells | the_dry_roads | – | 5,2 | 70 | call zin_east_wells_random; call zin_east_wells_random | 30 | `workshop_tools` |
| `oasis_gardens` | Oasis Gardens | the_dry_roads | – | 7,2 | 70 | add_spirit oasis_gardens | 20 | `farm_sowing` |
| `riders_of_the_dunes` | Riders of the Dunes | diggers_of_wells | – | 5,3 | 70 | allow_branch: people men. research [zin_cat_mounts] 50% ×1; add_spirit riders_of_the_dunes | 20 | `camel_rider` |
| `into_the_deep_sand` | Into the Deep Sand | oasis_gardens | – | 7,3 | 35 | event zin_east.35 (the text never says what lies beyond the map's edge) | 15 | `compass_rose` |

### E3. Between Furvior and Postondoroth

**Purpose:** a small court between the two great caravan powers. It may lean to Furvior, lean to Postondoroth, or serve no road. Leaning courts may ask to join the Noris Treaty or the Stabilo Pact; Postondoroth's bankers lend to friends. **Opens:** at start. **Mutual exclusions:** `lean_to_furvior` / `servant_of_no_road` / `lean_to_postondoroth`. **Mechanic:** `zin_east_add_lean`, `zin_stabilo_add_debt`, events `zin_shared_east_lands.1` and `.2` to the great powers.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `envoys_from_both_roads` | Envoys From Both Roads | courts_of_the_east | – | 10,1 | 35 | political_power 25; tooltip "Riders from Furvior and bankers from Postondoroth both bring gifts." | 40 | `envoy` |
| `lean_to_furvior` | The Riders' Friendship | envoys_from_both_roads | servant_of_no_road, lean_to_postondoroth | 8,2 | 70 | Lean +25; political_power 25 | 10 + lean ÷ 2 (minimum 1); ×2 if the court borders Noris; refuse rule ×1 | `camel_rider` |
| `servant_of_no_road` | Servant of No Road | envoys_from_both_roads | lean_to_furvior, lean_to_postondoroth | 10,2 | 70 | call zin_shared_east_lands_halve_lean; stability 0.05 | 20; ×2 if |lean| < 15 | `banner_plain` |
| `lean_to_postondoroth` | The Bankers' Friendship | envoys_from_both_roads | lean_to_furvior, servant_of_no_road | 12,2 | 70 | Lean −25; political_power 25 | 10 − lean ÷ 2 (minimum 1); ×2 if the court borders Stabilo | `ledger_coins` |
| `ask_for_the_treaty` | Ask for the Treaty | lean_to_furvior | – | 8,3 | 35 | Avail: exists Noris; Noris leads a faction; ROOT in no faction; `variable` zin_east_lean above 39; not at war with Noris. event_for Noris zin_shared_east_lands.1 | 20; hist ×0.5 | `scroll_treaty` |
| `the_open_road` | The Open Road | servant_of_no_road | – | 10,3 | 70 | add_spirit open_road | 20 | `roads_paved` |
| `ask_for_the_pact` | Ask for the Pact | lean_to_postondoroth | – | 12,3 | 35 | Avail: exists Stabilo; Stabilo leads a faction; ROOT in no faction; `variable` zin_east_lean below −39; not at war with Stabilo. event_for Stabilo zin_shared_east_lands.2 | 20; hist ×0.5 | `scroll_treaty` |
| `riders_of_the_treaty` | Riders of the Treaty | ask_for_the_treaty | – | 9,4 | 70 | Avail: in a faction with Noris. army_experience 10; research [zin_cat_mounts] 50% ×1 | 20 | `horse_cavalry` |
| `credit_from_postondoroth` | Credit From Postondoroth | ask_for_the_pact / lean_to_postondoroth | – | 11,4 | 35 | Avail: Stabilo has flag zin_stabilo_ledger_open; not at war with Stabilo. Debt +15; political_power 100 | 20; ×0 if debt ≥ 50 | `coin_chest` |

### E4. The Generous Friends

**Purpose:** the temples of the Deliverer and the friends who lend in his name. A court may welcome them (footholds +1) or count their gold (footholds −1, and the temples will not lend). After the reveal, or when the court is suspicious, it may close the Houses. **Opens:** at start. **Mutual exclusions:** `welcome_the_generous_friends` / `count_the_temple_gold`. **Mechanic:** `zin_afrit_add_footholds`, `zin_east_court_audit` (new; read by the AI of `zin_east.30`), `zin_afrit_purge_houses`.

Text before `zin_afrit_revealed` speaks only of temples, hospitals and loans. `count_the_temple_gold` is an audit of accounts, never an accusation.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `temples_of_the_deliverer` | Temples of the Deliverer | courts_of_the_east | – | 14,1 | 35 | stability 0.02; political_power 25 | 40 | `censer` |
| `welcome_the_generous_friends` | Welcome the Generous Friends | temples_of_the_deliverer | count_the_temple_gold | 13,2 | 70 | Footholds +1; add_spirit generous_friends | 20 + 10 × footholds; ×1.5 with `zin_east_in_crisis`; hist ×1.5; refuse rule ×0.3 | `house_first_light` |
| `count_the_temple_gold` | Count the Temple Gold | temples_of_the_deliverer | welcome_the_generous_friends | 15,2 | 70 | Footholds −1; flag zin_east_court_audit; political_power 50 | 20; ×2 if ruling ideology Light; refuse rule ×3 | `ledger_coins` |
| `houses_of_healing` | Houses of Healing | welcome_the_generous_friends | – | 13,3 | 70 | add_spirit houses_of_healing | 30 | `healer_herbs` |
| `watch_the_quays` | Watch the Quays | count_the_temple_gold | – | 15,3 | 35 | add_spirit watchful_quays | 30 | `eye_watchful` |
| `close_the_houses` | Close the Houses | houses_of_healing / watch_the_quays | – | 14,4 | 35 | Avail: `global_flag` zin_afrit_revealed, or flag zin_afrit_suspicious. call zin_afrit_purge_houses; remove_spirit generous_friends | 0 before the reveal; after it 40, ×2 refuser, ×0 client | `chain_broken` |

### E5. Levies of the East

**Purpose:** the court's guard and levies, horse and camel riders, bows, and small forts. **Opens:** at start. **Mechanic:** none.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_court_guard` | The [ROOT.GetAdjective] Guard | courts_of_the_east | – | 18,1 | 35 | army_experience 5; manpower 1000 | 30 | `spear_levy` |
| `drill_the_levies` | Drill the Levies | the_court_guard | – | 17,2 | 70 | add_spirit drilled_levies | 25 | `levy_muster` |
| `forts_on_the_marches` | Forts on the Marches | the_court_guard | – | 19,2 | 70 | building bunker 1 @capital; building bunker 1 @random_owned | 15; ×3 after `zin_war_of_last_crowns` | `fort_wall` |
| `bows_of_the_east` | Bows of the East | drill_the_levies | – | 17,3 | 70 | research [zin_cat_bows] 50% ×1 | 20 | `bow_archers` |
| `horse_and_camel` | Horse and Camel | drill_the_levies / forts_on_the_marches | – | 19,3 | 70 | research [zin_cat_mounts] 50% ×1; army_experience 5 | 20 | `horse_cavalry` |
| `captains_of_the_court` | Captains of the Court | bows_of_the_east / horse_and_camel | – | 18,4 | 70 | army_experience 10; research [zin_cat_arms] 50% ×1 | 20 | `war_council_map` |

### E6. Coasts

**E6a. The Northern Sea.** The north coast of the East Lands faces the Ocean of Zol. Its fishermen are the first eastern witnesses of the black ships (start situation pressure 3). **Opens:** `allow_branch` on `fishers_of_the_north_sea`: `check zin_shared_east_lands_north_coast` (today Woqood, Orato, Fladev, Hacsen, Vigodor and Cream). Text before `zin_zol_rising` speaks only of strange ships and silent boats; it never says what they are.

**E6b. The Rift Shore.** Courts on the rift sea trade with the elven shore across it. **Opens:** `allow_branch` on `rift_harbours`: `check zin_east_faces_rift` (today Delbiz Grasslands and Fosoco).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `fishers_of_the_north_sea` | Fishers of the Northern Sea | courts_of_the_east | – | 21,1 | 70 | allow_branch: check zin_shared_east_lands_north_coast. building dockyard 1 @north_coast; navy_experience 5 | 25 | `fishing_boats` |
| `tales_of_black_ships` | Tales of Black Ships | fishers_of_the_north_sea | – | 21,2 | 35 | event zin_shared_east_lands.3 | 20 | `storm_sea` |
| `watch_fires_on_the_coast` | Watch-Fires on the Coast | tales_of_black_ships | – | 21,3 | 70 | building coastal_bunker 1 @north_coast; flag zin_shared_east_lands_watch_fires | 10; ×4 after `zin_zol_rising` | `beacon` |
| `ships_against_the_dead` | Ships Against the Dead | watch_fires_on_the_coast | – | 21,4 | 70 | Avail: `global_flag` zin_zol_rising. add_spirit north_sea_watch; research [zin_cat_galleys] 50% ×1 | 100 when available | `galley_oars` |
| `rift_harbours` | Harbours on the Rift | courts_of_the_east | – | 23,1 | 70 | allow_branch: check zin_east_faces_rift. building naval_base 1 @rift_east; political_power 25 | 25 | `harbour_lake` |
| `traders_across_the_rift` | Traders Across the Rift | rift_harbours | – | 23,2 | 70 | add_spirit rift_trade; call zin_shared_east_lands_rift_goodwill | 20; ×0 while ROOT has `zin_east_coalition_member` | `envoy` |
| `guard_the_rift_shore` | Guard the Rift Shore | traders_across_the_rift | – | 23,3 | 70 | building coastal_bunker 1 @rift_east; building bunker 1 @rift_east | 10; ×3 after `zin_eastern_invasion` | `fort_wall` |

### E7. The Old Customs

**Purpose:** how the court governs. A Wild freehold may stay as it is, turn toward a crown over its road lords (Dominion), or toward a council of the towns (Light). **Opens:** the root of the module at start; each head has its own `allow_branch`. **Mutual exclusions:** the three heads. **Mechanic:** `zin_politics_add_drift` only; no focus sets a government directly.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_old_customs` | The Old Customs of [ROOT.GetName] | courts_of_the_east | – | 27,1 | 35 | political_power 25; stability 0.02 | 30 | `charter_old` |
| `a_crown_over_the_road_lords` | A Crown Over the Road Lords | the_old_customs | the_free_council, the_freeholds_endure | 25,2 | 70 | allow_branch: ideology dominion or wild. Drift dominion +5; political_power 50 | 10; ×2 if ruling ideology Dominion | `sceptre` |
| `the_free_council` | The Free Council | the_old_customs | a_crown_over_the_road_lords, the_freeholds_endure | 27,2 | 70 | allow_branch: ideology light or wild. Drift light +5; stability 0.03 | 10; ×3 if ruling ideology Light | `council_table` |
| `the_freeholds_endure` | The Freeholds Endure | the_old_customs | a_crown_over_the_road_lords, the_free_council | 29,2 | 70 | allow_branch: ideology wild. Drift wild +3; stability 0.05 | 20; ×2 if ruling ideology Wild | `charter_free` |
| `the_kings_law` | The King's Law | a_crown_over_the_road_lords | – | 25,3 | 70 | add_spirit kings_law | 20 | `seal_royal` |
| `council_of_the_towns` | Council of the Towns | the_free_council | – | 27,3 | 70 | add_spirit town_council | 20 | `concord_circle` |
| `the_free_lords` | The Free Lords | the_freeholds_endure | – | 29,3 | 70 | add_spirit free_lords | 20 | `banner_plain` |

### E8. Under a Protector

**Purpose:** a court that is already someone's subject: Noris's, Stabilo's (protection offers, `zin_east.71`), or a conqueror's. **Opens:** `allow_branch` on `oath_to_the_protector`: `is_subject: true`. **Mutual exclusions:** `loyal_vassal` / `seek_more_freedom`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `oath_to_the_protector` | The Oath to the Protector | courts_of_the_east | – | 1,6 | 35 | allow_branch: is_subject. political_power 50 | 40 | `handshake_oath` |
| `loyal_vassal` | A Loyal House | oath_to_the_protector | seek_more_freedom | 0,7 | 70 | add_spirit protectors_favour; raw `add_autonomy_ratio = { value = -0.10 localization = zin_shared_east_lands_loyal_house }` | 30; ×2 if overlord opinion of ROOT ≥ 50 | `tribute_chest` |
| `seek_more_freedom` | Our Own Laws | oath_to_the_protector | loyal_vassal | 2,7 | 70 | raw `add_autonomy_ratio = { value = 0.15 localization = zin_shared_east_lands_own_laws }`; stability 0.03 | 20; ×2 if ROOT's opinion of its overlord < 0 | `charter_free` |
| `the_protectors_due` | The Protector's Due | loyal_vassal / seek_more_freedom | – | 1,8 | 35 | stability 0.03; if subject of Noris: Lean +10; if subject of Stabilo: Lean −10 and Debt −10 | 30 | `ledger_coins` |

`add_autonomy_ratio` has no compiler effect yet; the two `raw` blocks are counted and reviewed. A compiler effect `{ "autonomy": n }` would remove them (see Open questions).

### E9. The Question of the East

**Purpose:** what a small court answers when the Deliverer's friends ask more than prayers. It may pledge itself to them (and so become a candidate to kneel when the King of the East comes), refuse any god-king and stand with the Free Crowns, or wait upon events. **Opens:** `question_of_the_east` is available only with `check zin_east_question_open` (`zin_afrit_king_of_east`, or `zin_eastern_invasion`, or `zin_golden_king_dead` after 1 Thaw 4A 1753). **Mutual exclusions:** the three route focuses. **Mechanic:** `zin_east_pledged` (kneel bias +100; the Afrit spec treats a pledged court with footholds 3 or more as an eastern candidate, proposed dependency); `zin_east_route_resist` (new: kneel bias −100, coalition weight −50, proposed dependency on the eastern kings mechanic); `zin_east_free_crown`, `zin_east_grant_free_cb`.

Text is two-faced. Before `zin_afrit_revealed`, `faith_in_the_deliverers_friends` reads "The temples have been generous. When the Deliverer's friends call, [ROOT.GetName] will answer." After it, the same focus reads through `[zin_loc_deliverer]`. No text says which kings will kneel.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `question_of_the_east` | The Question of the East | temples_of_the_deliverer / envoys_from_both_roads / the_old_customs | – | 14,6 | 35 | Avail: check zin_east_question_open. political_power 50 | 200 when available | `eastern_throne` |
| `faith_in_the_deliverers_friends` | Faith in the Deliverer's Friends | question_of_the_east | our_court_kneels_to_no_god, wait_upon_events | 10,7 | 70 | flag zin_east_pledged; Footholds +1 | 10 + 5 × footholds + kneel bias ÷ 5 (minimum 0); hist: 0 unless footholds ≥ 4 and kneel bias ≥ 20, then 30; refuse rule ×0 | `censer` |
| `our_court_kneels_to_no_god` | Our Court Kneels to No God | question_of_the_east | faith_in_the_deliverers_friends, wait_upon_events | 14,7 | 70 | flag zin_east_route_resist; Footholds −1; stability 0.03 | 20 − kneel bias ÷ 5 (minimum 1); ×2 if ruling ideology Light; ×2 refuser; refuse rule ×5 | `banner_plain` |
| `wait_upon_events` | Wait Upon Events | question_of_the_east | faith_in_the_deliverers_friends, our_court_kneels_to_no_god | 18,7 | 35 | political_power 50; stability 0.05 | 40; hist ×1.5 | `scroll_sealed` |
| `gifts_for_the_king` | Gifts for the King in the East | faith_in_the_deliverers_friends | – | 9,8 | 35 | Avail: `global_flag` zin_afrit_king_of_east; client. add_spirit eastern_oath; political_power 25 | 100 when available | `tribute_chest` |
| `levies_for_the_host` | Levies for the Host | faith_in_the_deliverers_friends | – | 11,8 | 70 | Avail: `global_flag` zin_afrit_returned; client. manpower −2000; army_experience 15 | 80 when available | `levy_muster` |
| `when_the_king_falls` | When the King Falls | gifts_for_the_king / levies_for_the_host | – | 10,9 | 35 | Avail: `global_flag` zin_afrit_dead. remove_spirit eastern_oath; stability 0.05; political_power 50 | 500 when available | `crown_broken` |
| `stand_with_the_free_crowns` | Stand With the Free Crowns | our_court_kneels_to_no_god | – | 13,8 | 70 | Avail: check zin_east_free_crown. call zin_east_grant_free_cb; add_spirit free_crown_court | 100 when available | `banner_league` |
| `close_the_gates_to_the_host` | Close the Gates to the Host | our_court_kneels_to_no_god | – | 15,8 | 70 | Avail: `global_flag` zin_afrit_king_of_east. building bunker 2 @capital; war_support 0.05 | 60 when available | `fort_wall` |
| `the_crowns_vindicated` | The Crowns Vindicated | stand_with_the_free_crowns / close_the_gates_to_the_host | – | 14,9 | 35 | Avail: `global_flag` zin_afrit_dead. remove_spirit free_crown_court; political_power 75; stability 0.05 | 500 when available | `olive_branch` |
| `keep_our_own_counsel` | Keep Our Own Counsel | wait_upon_events | – | 18,8 | 70 | Avail: `global_flag` zin_afrit_king_of_east. add_spirit own_counsel | 60 when available | `eye_watchful` |

### E10. Beyond the Rift

**Purpose:** the court that joined the eastern coalition (`zin_east.42`). Its companies cross the rift, claim elven shores, turn west with the host, and, when the dead and Volgan's hosts make the war a ruin, come home or serve the stranger's coalition (established: some eastern formations retreated east; abandoned eastern troops joined Eindil). **Opens:** `answer_the_coalition` needs flag `zin_east_coalition_member`. **Mechanic:** `zin_east_claim_rift`, `zin_east_turns_west`, `zin_east_companies_with_eindil`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `answer_the_coalition` | Answer the Eastern Coalition | courts_of_the_east | – | 24,6 | 35 | Avail: flag zin_east_coalition_member. war_support 0.05; army_experience 10 | 300 when available | `war_drums` |
| `spoils_across_the_rift` | Spoils Across the Rift | answer_the_coalition | – | 23,7 | 70 | Avail: check zin_shared_east_lands_at_war_magical. call zin_east_claim_rift | 80 when available | `map_unrolled` |
| `with_the_host_to_parim` | With the Host to Parim | answer_the_coalition | – | 25,7 | 70 | Avail: `global_flag` zin_east_turns_west. army_experience 10; war_support 0.05 | 80 when available | `war_council_map` |
| `bring_the_companies_home` | Bring the Companies Home | spoils_across_the_rift / with_the_host_to_parim | serve_the_strangers_coalition | 23,8 | 35 | Avail: at war with a country whose capital is in the Magical or Middle Lands. call zin_shared_east_lands_withdraw; manpower 3000; tooltip "Some companies will not come home." | 0 before `zin_zol_rising` or `zin_volgan_marches`; then 30, ×3 refuser | `banner_laid_down` |
| `serve_the_strangers_coalition` | Serve the Stranger's Coalition | spoils_across_the_rift / with_the_host_to_parim | bring_the_companies_home | 25,8 | 35 | Avail: `global_flag` zin_eindil_returned; at war with a country whose capital is in the Magical or Middle Lands. flag zin_east_companies_with_eindil; army_experience 10 | 30; ×3 refuser; ×0 client | `banner_league` |

### Spirits

Ids `zin_shared_east_lands_<key>`. Every modifier key exists in the game's modifier documentation.

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `caravanserais` | Caravanserais | trade_opinion_factor 0.10, consumer_goods_factor −0.02 | `caravanserais`; permanent |
| `oasis_gardens` | Oasis Gardens | monthly_population 0.05, stability_factor 0.02 | `oasis_gardens`; permanent |
| `riders_of_the_dunes` | Riders of the Dunes | heat_attrition_factor −0.20, cavalry_attack_factor 0.05 | `riders_of_the_dunes`; permanent |
| `open_road` | The Open Road | trade_opinion_factor 0.10, political_power_gain 0.05 | `the_open_road`; removed if ROOT joins the Noris Treaty or the Stabilo Pact |
| `generous_friends` | The Generous Friends | stability_factor 0.03, political_power_gain −0.03 | `welcome_the_generous_friends`; removed by `close_the_houses` or a purge |
| `houses_of_healing` | Houses of Healing | recruitable_population_factor 0.03, stability_factor 0.02 | `houses_of_healing`; permanent |
| `watchful_quays` | Watchful Quays | enemy_operative_detection_chance_factor 0.15, drift_defence_factor 0.10 | `watch_the_quays`; permanent |
| `drilled_levies` | Drilled Levies | army_org_factor 0.05, experience_gain_army_factor 0.05 | `drill_the_levies`; permanent |
| `north_sea_watch` | The Northern Sea Watch | coastal_bunker_effectiveness_factor 0.10, naval_detection 0.10 | `ships_against_the_dead`; permanent |
| `rift_trade` | Trade Across the Rift | trade_opinion_factor 0.10, research_speed_factor 0.02 | `traders_across_the_rift`; removed when ROOT is at war with a Magical Lands realm |
| `kings_law` | The King's Law | political_power_factor 0.10, stability_factor −0.02 | `the_kings_law`; permanent |
| `town_council` | Council of the Towns | stability_factor 0.05, opinion_gain_monthly_factor 0.10 | `council_of_the_towns`; permanent |
| `free_lords` | The Free Lords | production_speed_buildings_factor 0.05, conscription_factor 0.03 | `the_free_lords`; permanent |
| `protectors_favour` | The Protector's Favour | stability_factor 0.03, political_power_gain 0.05 | `loyal_vassal`; removed when ROOT is no longer a subject |
| `eastern_oath` | Oath to the King in the East | war_support_factor 0.05, army_attack_factor 0.03 | `gifts_for_the_king`; removed by `when_the_king_falls` or `zin_afrit_dead` (the mechanic's `zin_east_after_the_king`) |
| `free_crown_court` | A Free Crown | army_defence_factor 0.05, war_support_factor 0.05 | `stand_with_the_free_crowns`; removed by `the_crowns_vindicated` |
| `own_counsel` | Our Own Counsel | drift_defence_factor 0.20, stability_factor 0.03 | `keep_our_own_counsel`; permanent |

The mechanic adds its own ideas when they apply (`zin_east_temple_loan`, `zin_east_coalition_ambition`, `zin_east_free_crowns`, `zin_east_kings_debt`, `zin_east_vindicated`).

### Events (namespace `zin_shared_east_lands`)

All are fired by focus effects or by options of these events. None has its own trigger.

| Id | Title | For | Fired by | Options (effects; AI) |
| --- | --- | --- | --- | --- |
| .1 | A Court Asks for the Treaty | Noris | `ask_for_the_treaty` | "Welcome them into the Treaty" (`add_to_faction` FROM; FROM: Lean +10) / "Not yet" (FROM: Lean −5). AI chance of welcome: FROM's lean − 20, +20 if FROM borders Noris, −30 if FROM borders Stabilo, ×0 if Stabilo guarantees FROM. Fires .4 to FROM |
| .2 | A Court Asks for the Pact | Stabilo | `ask_for_the_pact` | "Welcome them into the Pact" (`add_to_faction` FROM; FROM: Lean −10; Debt −5 on FROM) / "Not yet" (FROM: Lean +5). AI as .1 with the sign of lean reversed and Noris for Stabilo. Fires .4 to FROM |
| .3 | Tales of Black Ships | ROOT | `tales_of_black_ships` | Fishermen speak of dark sails among far islands that answer no hail. "Old fishermen's tales" (political_power 15) / "Send a boat to look" (navy_experience 5; text: the boat comes back with nothing to tell; nobody aboard will speak of it). Before `zin_zol_rising` the text never says what the ships are |
| .4 | The Answer of [FROM.GetName] | the asking court | .1 or .2 | Result text only ("They welcome us" / "They ask us to wait") |

Pictures (event catalog): .1 and .2 `eastern_court`; .3 `black_ships_tale`; .4 `eastern_court`.

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/focus/shared_east_lands.json` | Tree data, `"tier": "shared"`, `"countries"`: the 24 names above |
| `common/national_focus/zin_shared_east_lands.txt` | Compiled tree; `country = { factor = 0 modifier = { add = 10 <tag list> } }` generated from the country list |
| `common/ideas/zin_focus_shared_east_lands.txt` | Spirits above |
| `events/zin_shared_east_lands.txt` | Namespace `zin_shared_east_lands`; effect-triggered only |
| `common/scripted_effects/zin_shared_east_lands.txt` | Tree effects below |
| `common/scripted_triggers/zin_shared_east_lands.txt` | Tree triggers below |
| `localisation/english/zin_focus_shared_east_lands_l_english.yml` | All text |

### Tree-declared scripted triggers and effects

| Name | Kind | Does |
| --- | --- | --- |
| `zin_shared_east_lands_on_road` | trigger, country | Owns a state with `zin_is_site_road_salt`, `_gold`, `_rift`, `_lake` or `_sand` |
| `zin_shared_east_lands_north_coast` | trigger, country | Owns a state with `zin_is_site_east_north_coast` |
| `zin_shared_east_lands_at_war_magical` | trigger, country | At war with a country that has `zin_region_magical_lands` |
| `zin_shared_east_lands_road_infra` | effect, country | Infrastructure +1 in a random owned road state; the capital if none |
| `zin_shared_east_lands_halve_lean` | effect, court | Computes −`zin_east_lean` ÷ 2 into a temp variable and passes it to `zin_east_add_lean` (the mechanic's only write path) |
| `zin_shared_east_lands_rift_goodwill` | effect, court | `add_opinion_modifier` `zin_east_court_gifts` from every Magical Lands realm that owns a `zin_is_site_rift_west` state toward ROOT (the mechanic's +15 opinion modifier) |
| `zin_shared_east_lands_withdraw` | effect, country | `white_peace` with every enemy whose capital is in the Magical or Middle Lands |

### New shared names

| Name | Kind | Meaning | Reader |
| --- | --- | --- | --- |
| `zin_east_route_resist` | country flag | A tier B or C court refused any god-king (resist route) | Eastern kings mechanic: kneel bias −100 (its row "a tree's resist route flag"), coalition weight −50 |
| `zin_east_court_audit` | country flag | The court audited the temples | Eastern kings mechanic: `zin_east.30` "Accept the loan" AI 0 (its row "an audit flag from a tree") |
| `zin_is_site_east_north_coast` | site trigger, state | East Lands coastal state on the Ocean of Zol (generated from the sea regions of that ocean) | This tree; Gondolin's tree; available to the Zol spec's rumours |

### Data checks

- 68 focuses; positions unique; every focus below its prerequisites; `days` multiples of 7.
- Two `raw` blocks (`add_autonomy_ratio` in E8).
- The compiler's secret scan over the localisation file passes; two-faced text uses `[zin_loc_deliverer]`.
- No focus reachable on 1 Thaw 4A 1748 contains `wargoal`, `claims_on`, `cores_on`, `declare_war`, `add_state_claim` or a call that grants a cause.

## AI

- **Order.** Courts take the root, then E1, E3 and E5 at the weights above; road courts take the road half; South Lands courts dig wells first (AI 40).
- **Lean.** A court's first E3 choice follows its start lean: positive lean favours `lean_to_furvior`, negative favours `lean_to_postondoroth`, lean within ±15 favours `servant_of_no_road`. On the historical path asks to join a bloc are halved, so the blocs grow mostly through the great powers' own invitations (mechanic: each gains one or two members in 4A 1751 to 1754).
- **Temples.** Historical weights favour welcoming the friends where footholds are 2 or more, so the eastern network stays deep enough for the King of the East; Light courts audit.
- **The Question of the East.** Under the historical path pledging is rare (only footholds 4 and bias 20 or more); most courts wait upon events, and Light courts refuse. Which courts kneel is still decided by the Afrit spec's candidate rule and its historical auto-accept, never by this tree alone.
- **Coalition.** Members take every E10 focus when available; they come home only after the dead or Volgan's hosts are loose.
- **Rule `zin_rule_ai_east`.** REFUSE_AFRIT and UNITE_WITHOUT_AFRIT set pledging to 0 and multiply the resist route by 5.

## Acceptance

1. Every one of the 24 courts maps to this tree and to no other (coverage check).
2. The compiled tree has 68 focuses with unique positions; the compiler and the HOI4 Agent Tools focus inspector pass.
3. On 1 Thaw 4A 1748 no available focus can create a war, a claim or a war goal (scan of the compiled file and the effects it calls).
4. `allow_branch` shows E2 only to South Lands courts, E6a only to north-coast courts, E6b only to rift-coast courts, E8 only to subjects; a scenario test over all 24 courts lists the visible modules per court.
5. `the_dry_roads` sets `zin_east_wells_unlocked` and gives one owned dry state wells; `count_the_temple_gold` lowers footholds by one and sets `zin_east_court_audit`.
6. On a historical observer run (4A 1748 to 4A 1760), no tier C court of this tree is at war before `zin_war_of_last_crowns`, and E9 is never available before `zin_east_question_open`.
7. No text names Afrit before `zin_afrit_revealed` (compiler secret scan).
8. Every modifier in the spirits table exists in the modifier documentation; every effect and trigger named exists in the effect and trigger documentation or in a spec's scripted file.

## Open questions

1. Do you accept that small eastern courts can ask to join the Noris Treaty or the Stabilo Pact on their own initiative, or should only Furvior and Postondoroth invite?
2. May a tier C court pledge itself to the Deliverer's friends (and so become a candidate to kneel), or should pledging stay with the great kingdoms and the two powers?
3. The compiler has no autonomy effect; E8 uses two `raw` blocks. Should the compiler gain `{ "autonomy": n }`?
4. Six courts face the Ocean of Zol on the map today (Woqood, Orato, Fladev, Hacsen, Vigodor, Cream). Should their fishermen also receive the lore spec's "Black Ships" flavour event (`zin_lore.180`), or is this tree's event enough?
