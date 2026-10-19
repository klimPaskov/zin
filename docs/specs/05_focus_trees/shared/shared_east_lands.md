# Shared Tree: Courts of the East

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

The shared focus tree for the **24 tier C courts of the East Lands** (tree id `shared_east_lands`, focus ids `zin_shared_east_lands_<key>`, data file `docs/design/focus/shared_east_lands.json`). One tree serves every small eastern crown, road town and coastal lordship that is not a great power or a tier B kingdom. It plays the eastern kings mechanic ([../../04_mechanics/eastern_kings.md](../../04_mechanics/eastern_kings.md)) from below: a court that sits between Furvior and Postondoroth, keeps a road or a well, hears the temples' generous friends, and, when the age ends, must answer the eastern coalition and the King of the East.

The tree is also the **module library** for the nine tier B eastern trees ([../regional/east_lands.md](../regional/east_lands.md)). Its branches are labelled E1 to E10. A tier B tree copies a whole module into its own file under its own tree id, as [../01_tiers_and_coverage.md](../01_tiers_and_coverage.md) allows. The tier B trees also call this tree's scripted effects (`zin_shared_east_lands_road_infra`, `_halve_lean`, `_rift_goodwill`), so their names are fixed.

| Item | Value |
| --- | --- |
| Tree id | `shared_east_lands` |
| Tier | C (shared; size 40 to 70 focuses) |
| Countries (24) | Delbiz Grasslands, Mostok, Azano, The Moco, Cream, Ernois, Fosoco, Kersian, Eraver, Pornivior, Grova, Vigodor, Woqood, Arcon, Obmi, Furro, Hacsen, Oreton, Nethnu, Olor, Orato, Mylunur, Lorvens, Fladev |
| Focuses | 68 in eleven parts (root and modules E1 to E10) |
| Width | columns 0 to 29, rows 0 to 9 |
| Events | namespace `zin_shared_east_lands` (four events) |
| Spirits | `zin_shared_east_lands_<key>` (17) |
| Raw blocks | none |
| Builder | `tools/content/modules/focus_compiler.mjs` ([../00_format_and_compiler.md](../00_format_and_compiler.md)) |

## Lore basis

**Established** (vault): the East Lands lie across a long rift sea east of the Magical Lands and run off the eastern map; the South Lands are the great desert of the East Lands and run off the southern map; Noris (with Gondolin, the Noris Treaty) and Stabilo (with Drak, the Stabilo Pact) are rivals (working table); the Hidden Council builds ties in East Lands and South Lands courts as a reserve seat of power; in the final war an eastern coalition invades the Magical Lands and threatens the Middle Kingdom, its commanders seeking wealth, territory, revenge or deliverance from their own rulers' crises, some secretly tied to the Deliverer's networks; Afrit takes command of an eastern host and is proclaimed King of the East, though states of the East still resist him; abandoned eastern troops join Eindil's temporary coalition; claims and grievances remain after the war. In the First Age, allied men from eastern and southern lands served in Volgan's army (*Peoples of Erdae*); this does not mean every eastern people served him.

**Proposed in the vault:** the caravan roads (4A 600 to 780) and the rivalry they began; the eastern branch's courtship from about 4A 1300; the Houses of the First Light as the public face of the Deliverer's network.

**Proposed in the mechanic spec and used here:** the five roads, charters, influence, lean, rivalry, kneel bias, coalition weight, the Free Crowns, wells and dry land.

**Proposed here:** every focus, spirit, event and number; the route flag `zin_east_route_resist`; the audit flag `zin_east_court_audit`.

**Open and kept open:** which eastern kings join Afrit willingly; what becomes of the eastern invaders after Eindil's coronation; what lies beyond the eastern and southern map edges. No focus text states any of these. Who kneels is decided in each game by footholds, the kneel bias, crises and choices (decision S1).

## Design

### The peaceful start

On 1 Thaw 4A 1748 every available focus is about markets, roads, wells, temples, envoys, levies and coasts. No focus available at start creates a war goal, a claim or a war. The Question of the East (E9) opens only with the mechanic's junction trigger `zin_east_question_open`; Beyond the Rift (E10) needs the flag `zin_east_coalition_member`, which the mechanic sets no earlier than 30 days after `zin_war_of_last_crowns`. The only claims in the tree come from `zin_east_claim_rift` (coalition members at war) and `zin_east_grant_free_cb` (refusers while the King of the East reigns): both behind the mechanic's peace gates.

### Who sees what

`allow_branch` is evaluated when the tree is set up (and whenever the engine refreshes the layout), so it is used only for conditions fixed by the map and the start: region, coast, people and the start ideology. Conditions that change in play (being a subject, the story) use `available`, so the branch is shown to everyone and taken when it applies.

| Opens by | Condition | Module |
| --- | --- | --- |
| Region | every country of the tree (all are East Lands courts) | Root, E1, E3, E4, E5 |
| Region (South Lands) | `allow_branch`: `check zin_east_is_south_court` | E2 Wells of the South Lands |
| Region (roads) | `allow_branch`: `check zin_shared_east_lands_on_road` | the road half of E1 (`lords_of_the_road`, `caravanserais`) |
| Coast (Ocean of Zol) | `allow_branch`: `check zin_shared_east_lands_north_coast` | E6a The Northern Sea |
| Coast (rift sea) | `allow_branch`: `check zin_east_faces_rift` | E6b The Rift Shore |
| Ideology | `allow_branch`: ruling ideology Dominion or Wild / Light or Wild / Wild | the three heads of E7 |
| Overlord | `available`: `is_subject` | E8 Under a Protector |
| People | `allow_branch`: `people: men` (inside E2) | `riders_of_the_dunes` (camel and horse riders of the desert; the Noris camel warriors are a tradition of men, established) |
| Story | `available`: `check zin_east_question_open`; flag `zin_east_coalition_member` | E9, E10 |

Every court of the tree is a realm of men today, and every one is Wild (the game's `neutrality`), so all three heads of E7 show. The people condition exists so that a released or newly formed eastern country of another people does not get desert rider content.

### Text

Focus names and descriptions use `[ROOT.GetName]` and `[ROOT.GetAdjective]`, for example "Markets of the [ROOT.GetAdjective] Towns". Before `zin_afrit_revealed`, no text names Afrit, the Hidden Council or the eastern branch. The Deliverer is `[zin_loc_deliverer]` ("Aurevan the Deliverer" until the reveal, "Afrit" after it), his houses are the kindly **Houses of the First Light**, and his people are "the Deliverer's generous friends" or "the temples". No text in this tree speaks of Eindil or of a stranger: the companies that serve his coalition in E10 serve "another banner". The later E9 focuses speak of "a king in the East" and never say who he is; they become available only after the proclamation, when the world has heard the title (decision D3).

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
| E7 | The Old Customs | 25–29 | 1–3 | 7 | start; heads by ideology | drift through `zin_politics_add_drift`, government spirits |
| E8 | Under a Protector | 0–2 | 6–8 | 4 | subject | autonomy, overlord's road |
| E9 | The Question of the East | 9–18 | 6–9 | 11 | `zin_east_question_open` | `zin_east_pledged`, `zin_east_route_resist`, Free Crowns |
| E10 | Beyond the Rift | 23–25 | 6–8 | 5 | `zin_east_coalition_member` | coalition war, `zin_east_claim_rift`, `zin_east_companies_with_eindil` |

### Notation used in the tables

- **Prerequisites:** `a + b` means a and b; `a / b` means a or b.
- **x,y:** grid column and row.
- **Effects** use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md). Spirit keys are short and compile to `zin_shared_east_lands_<key>`. `allow_branch:` and `Avail:` list the focus's `allow_branch` and `available` conditions.
- **Shorthands:** **Lean +n** = `call zin_east_add_lean(value = n)` on ROOT (positive is toward Furvior, negative toward Postondoroth). **Footholds ±n** = `call zin_afrit_add_footholds(value = n)` on ROOT (Afrit spec; respects caps). **Debt ±n** = `call zin_stabilo_add_debt(value = n)` on ROOT (Stabilo tree). **Drift X +n** = `call zin_politics_add_drift(IDEOLOGY = X, VALUE = n)` (politics spec; the only way focuses move popularity).
- **Where:** `@capital`, `@random_owned`, `@random_coastal`; `@rift_east` = site key `rift_east` (a random owned state with `zin_is_site_rift_east`); `@zol_coast` = site key `ocean_of_zol_coast` (a random owned state with `zin_is_site_ocean_of_zol_coast`).
- **AI** is `ai.base`, then factor modifiers. **footholds**, **lean**, **bias** and **debt** are the variables `zin_footholds`, `zin_east_lean`, `zin_east_kneel_bias` and `zin_stabilo_debt` on ROOT; "≥ n" compiles to `{ "variable": { "name": …, "above": n−1 } }` and "≤ n" to its `not` form. **hist** = `check zin_rules_is_historical`. **refuse rule** = `check zin_rules_ai_branch_east_refuse_afrit` or `check zin_rules_ai_branch_east_unite_without_afrit` (the defines spec's wrapper pattern over `zin_rule_ai_east`). **client** = flag `zin_afrit_eastern_client`; **refuser** = flag `zin_afrit_refused_east`. "N when available" is a base of N; the weight only matters once the focus is available.
- **Research** categories are the warfare spec's `zin_cat_*` keys ([../../03_gameplay/01_warfare.md](../../03_gameplay/01_warfare.md); written by warfare stage 2 in phase 3, before this phase-6 tree) and the vanilla `industry` category. A build before stage 2 maps `zin_cat_arms`, `zin_cat_bows` and `zin_cat_mounts` to `infantry_weapons` and `zin_cat_galleys` to `naval_equipment`.

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
| `caravanserais` | Caravanserais of [ROOT.GetName] | lords_of_the_road | – | 0,3 | 70 | add_spirit caravanserai_trade | 25 | `caravan` |
| `tolls_at_the_gates` | Tolls at the Gates | lords_of_the_road / guild_of_factors | – | 2,3 | 35 | political_power 75 | 20 | `toll_house` |
| `workshops_of_the_towns` | Workshops of the Towns | guild_of_factors | – | 4,3 | 70 | building industrial_complex 1 @random_owned | 25 | `workshop_tools` |
| `richest_road_in_the_east` | The Richest Road in the East | caravanserais / tolls_at_the_gates / workshops_of_the_towns | – | 2,4 | 70 | building industrial_complex 1 @capital; political_power 50; stability 0.03 | 20 | `coin_chest` |

### E2. Wells of the South Lands

**Purpose:** water in the southern desert. Wells turn the mechanic's dry land (`zin_east_dry_land`: supply −25%, truck attrition +25%) into watered land. **Opens:** `allow_branch` on `the_dry_roads`: `check zin_east_is_south_court`. **Mechanic:** `zin_east_wells_unlocked` (opens the decision `zin_east_dig_wells`), `zin_east_wells_random`, `zin_east.35`. Today the South Lands courts of this tree are Mostok, Obmi and Oreton.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_dry_roads` | The Dry Roads | courts_of_the_east | – | 6,1 | 70 | allow_branch: check zin_east_is_south_court. flag zin_east_wells_unlocked; call zin_east_wells_random | 40 | `traders_road` |
| `diggers_of_wells` | Diggers of Wells | the_dry_roads | – | 5,2 | 70 | call zin_east_wells_random; call zin_east_wells_random | 30 | `workshop_tools` |
| `oasis_gardens` | Oasis Gardens | the_dry_roads | – | 7,2 | 70 | add_spirit oasis_gardens_spirit | 20 | `farm_sowing` |
| `riders_of_the_dunes` | Riders of the Dunes | diggers_of_wells | – | 5,3 | 70 | allow_branch: people men. research [zin_cat_mounts] 50% ×1; add_spirit dune_riders | 20 | `camel_rider` |
| `into_the_deep_sand` | Into the Deep Sand | oasis_gardens | – | 7,3 | 35 | call zin_shared_east_lands_deep_sand (fires the mechanic's `zin_east.35`; its text never says what lies beyond the map's edge) | 15 | `compass_rose` |

### E3. Between Furvior and Postondoroth

**Purpose:** a small court between the two great caravan powers. It may lean to Furvior, lean to Postondoroth, or serve no road. Leaning courts may ask to join the Noris Treaty or the Stabilo Pact; Postondoroth's bankers lend to friends. **Opens:** at start. **Mutual exclusions:** `lean_to_furvior` / `servant_of_no_road` / `lean_to_postondoroth`. **Mechanic:** `zin_east_add_lean`, `zin_stabilo_add_debt`, events `zin_shared_east_lands.1` and `.2` to the great powers. The mechanic's own invitations (`zin_east_invite_to_league`, `zin_east.70`) work alongside; asking is the small court's side of the same courtship (proposed; owner question in [../../OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md), "regions: east, south isles, sun" 2).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `envoys_from_both_roads` | Envoys From Both Roads | courts_of_the_east | – | 10,1 | 35 | political_power 25; tooltip "Riders from Furvior and bankers from Postondoroth both bring gifts." | 40 | `envoy` |
| `lean_to_furvior` | The Riders' Friendship | envoys_from_both_roads | servant_of_no_road, lean_to_postondoroth | 8,2 | 70 | Lean +25; political_power 25 | 10; ×3 lean ≥ 20; ×0.2 lean ≤ −20; ×2 check zin_shared_east_lands_borders_noris | `camel_rider` |
| `servant_of_no_road` | Servant of No Road | envoys_from_both_roads | lean_to_furvior, lean_to_postondoroth | 10,2 | 70 | call zin_shared_east_lands_halve_lean; stability 0.05 | 20; ×2 check zin_shared_east_lands_lean_balanced | `banner_plain` |
| `lean_to_postondoroth` | The Bankers' Friendship | envoys_from_both_roads | lean_to_furvior, servant_of_no_road | 12,2 | 70 | Lean −25; political_power 25 | 10; ×3 lean ≤ −20; ×0.2 lean ≥ 20; ×2 check zin_shared_east_lands_borders_stabilo | `ledger_coins` |
| `ask_for_the_treaty` | Ask for the Treaty | lean_to_furvior | – | 8,3 | 35 | Avail: check zin_shared_east_lands_can_ask_treaty. event_for Noris .1 | 20; hist ×0.5 | `scroll_treaty` |
| `the_open_road` | The Open Road | servant_of_no_road | – | 10,3 | 70 | add_spirit open_road | 20 | `roads_paved` |
| `ask_for_the_pact` | Ask for the Pact | lean_to_postondoroth | – | 12,3 | 35 | Avail: check zin_shared_east_lands_can_ask_pact. event_for Stabilo .2 | 20; hist ×0.5 | `scroll_treaty` |
| `riders_of_the_treaty` | Riders of the Treaty | ask_for_the_treaty | – | 9,4 | 70 | Avail: check zin_shared_east_lands_in_treaty. army_experience 10; research [zin_cat_mounts] 50% ×1 | 20 | `horse_cavalry` |
| `credit_from_postondoroth` | Credit From Postondoroth | ask_for_the_pact / lean_to_postondoroth | – | 11,4 | 35 | Avail: check zin_shared_east_lands_can_borrow. Debt +15; political_power 100 | 20; ×0 debt ≥ 50 | `coin_chest` |

### E4. The Generous Friends

**Purpose:** the temples of the Deliverer, the Houses of the First Light, and the friends who lend in his name. A court may welcome them (footholds +1) or count their gold (footholds −1, and the temples will not lend). After the reveal, or when the court is suspicious, it may close the Houses. **Opens:** at start. **Mutual exclusions:** `welcome_the_generous_friends` / `count_the_temple_gold`. **Mechanic:** `zin_afrit_add_footholds` (start 2, cap 3 for these courts; Afrit spec), `zin_east_court_audit` (read by the AI of `zin_east.30`), `zin_afrit_purge_houses`.

Text before `zin_afrit_revealed` speaks only of temples, Houses of the First Light, hospitals and loans. `count_the_temple_gold` is an audit of accounts, never an accusation.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `temples_of_the_deliverer` | Temples of the Deliverer | courts_of_the_east | – | 14,1 | 35 | stability 0.02; political_power 25 | 40 | `censer` |
| `welcome_the_generous_friends` | Welcome the Generous Friends | temples_of_the_deliverer | count_the_temple_gold | 13,2 | 70 | Footholds +1; add_spirit generous_friends | 20; ×2 footholds ≥ 2; ×1.5 footholds ≥ 3; ×1.5 flag zin_east_in_crisis; hist ×1.5; refuse rule ×0.3 | `house_first_light` |
| `count_the_temple_gold` | Count the Temple Gold | temples_of_the_deliverer | welcome_the_generous_friends | 15,2 | 70 | Footholds −1; flag zin_east_court_audit; political_power 50 | 20; ×2 ideology light; refuse rule ×3 | `ledger_coins` |
| `houses_of_healing` | Houses of Healing | welcome_the_generous_friends | – | 13,3 | 70 | add_spirit healing_houses | 30 | `healer_herbs` |
| `watch_the_quays` | Watch the Quays | count_the_temple_gold | – | 15,3 | 35 | add_spirit watchful_quays | 30 | `eye_watchful` |
| `close_the_houses` | Close the Houses | houses_of_healing / watch_the_quays | – | 14,4 | 35 | Avail: global_flag zin_afrit_revealed, or flag zin_afrit_suspicious; footholds ≥ 1. call zin_afrit_purge_houses; remove_spirit generous_friends | 40; ×0 not global_flag zin_afrit_revealed; ×2 refuser; ×0 client | `chain_broken` |

### E5. Levies of the East

**Purpose:** the court's guard and levies, horse and camel riders, bows, and small forts. **Opens:** at start. **Mechanic:** none.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_court_guard` | The [ROOT.GetAdjective] Guard | courts_of_the_east | – | 18,1 | 35 | army_experience 5; manpower 1000 | 30 | `spear_levy` |
| `drill_the_levies` | Drill the Levies | the_court_guard | – | 17,2 | 70 | add_spirit drilled_levies | 25 | `levy_muster` |
| `forts_on_the_marches` | Forts on the Marches | the_court_guard | – | 19,2 | 70 | building bunker 1 @capital; building bunker 1 @random_owned | 15; ×3 global_flag zin_war_of_last_crowns | `fort_wall` |
| `bows_of_the_east` | Bows of the East | drill_the_levies | – | 17,3 | 70 | research [zin_cat_bows] 50% ×1 | 20 | `bow_archers` |
| `horse_and_camel` | Horse and Camel | drill_the_levies / forts_on_the_marches | – | 19,3 | 70 | research [zin_cat_mounts] 50% ×1; army_experience 5 | 20 | `horse_cavalry` |
| `captains_of_the_court` | Captains of the Court | bows_of_the_east / horse_and_camel | – | 18,4 | 70 | army_experience 10; research [zin_cat_arms] 50% ×1 | 20 | `war_council_map` |

### E6. Coasts

**E6a. The Northern Sea.** The north coast of the East Lands faces the Ocean of Zol. Its fishermen are the first eastern witnesses of the black ships (start situation pressure 3). **Opens:** `allow_branch` on `fishers_of_the_north_sea`: `check zin_shared_east_lands_north_coast` (today Woqood, Orato, Fladev, Hacsen, Vigodor and Cream). Text before `zin_zol_rising` speaks only of strange ships and silent boats; it never says what they are. These courts are not added to the lore spec's `zin_lore.180`; this tree's event `.3` is their black-ships tale (proposed).

**E6b. The Rift Shore.** Courts on the rift sea trade with the elven shore across it. **Opens:** `allow_branch` on `rift_harbours`: `check zin_east_faces_rift` (today Delbiz Grasslands and Fosoco).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `fishers_of_the_north_sea` | Fishers of the Northern Sea | courts_of_the_east | – | 21,1 | 70 | allow_branch: check zin_shared_east_lands_north_coast. building dockyard 1 @zol_coast; navy_experience 5 | 25 | `fishing_boats` |
| `tales_of_black_ships` | Tales of Black Ships | fishers_of_the_north_sea | – | 21,2 | 35 | event .3 | 20 | `storm_sea` |
| `watch_fires_on_the_coast` | Watch-Fires on the Coast | tales_of_black_ships | – | 21,3 | 70 | building coastal_bunker 1 @zol_coast; flag zin_shared_east_lands_watch_fires | 10; ×4 global_flag zin_zol_rising | `beacon` |
| `ships_against_the_dead` | Ships Against the Dead | watch_fires_on_the_coast | – | 21,4 | 70 | Avail: global_flag zin_zol_rising. add_spirit north_sea_watch; research [zin_cat_galleys] 50% ×1 | 100 when available | `galley_oars` |
| `rift_harbours` | Harbours on the Rift | courts_of_the_east | – | 23,1 | 70 | allow_branch: check zin_east_faces_rift. building naval_base 1 @rift_east; political_power 25 | 25 | `harbour_lake` |
| `traders_across_the_rift` | Traders Across the Rift | rift_harbours | – | 23,2 | 70 | add_spirit rift_trade; call zin_shared_east_lands_rift_goodwill | 20; ×0 flag zin_east_coalition_member | `envoy` |
| `guard_the_rift_shore` | Guard the Rift Shore | traders_across_the_rift | – | 23,3 | 70 | building coastal_bunker 1 @rift_east; building bunker 1 @rift_east | 10; ×3 global_flag zin_eastern_invasion | `fort_wall` |

`zin_shared_east_lands_watch_fires` is a tree-local country flag (proposed reader: the Zol spec's AI may treat the court as forewarned).

### E7. The Old Customs

**Purpose:** how the court governs. A Wild freehold may stay as it is, turn toward a crown over its road lords (Dominion), or toward a council of the towns (Light). **Opens:** the root of the module at start; each head has its own `allow_branch` on the start ideology. **Mutual exclusions:** the three heads. **Mechanic:** `zin_politics_add_drift` only; no focus sets a government directly.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `the_old_customs` | The Old Customs of [ROOT.GetName] | courts_of_the_east | – | 27,1 | 35 | political_power 25; stability 0.02 | 30 | `charter_old` |
| `a_crown_over_the_road_lords` | A Crown Over the Road Lords | the_old_customs | the_free_council, the_freeholds_endure | 25,2 | 70 | allow_branch: ideology dominion or wild. Drift dominion +5; political_power 50 | 10; ×2 ideology dominion | `sceptre` |
| `the_free_council` | The Free Council | the_old_customs | a_crown_over_the_road_lords, the_freeholds_endure | 27,2 | 70 | allow_branch: ideology light or wild. Drift light +5; stability 0.03 | 10; ×3 ideology light | `council_table` |
| `the_freeholds_endure` | The Freeholds Endure | the_old_customs | a_crown_over_the_road_lords, the_free_council | 29,2 | 70 | allow_branch: ideology wild. Drift wild +3; stability 0.05 | 20; ×2 ideology wild | `charter_free` |
| `the_kings_law` | The King's Law | a_crown_over_the_road_lords | – | 25,3 | 70 | add_spirit kings_law | 20 | `seal_royal` |
| `council_of_the_towns` | Council of the Towns | the_free_council | – | 27,3 | 70 | add_spirit town_council | 20 | `concord_circle` |
| `the_free_lords` | The Free Lords | the_freeholds_endure | – | 29,3 | 70 | add_spirit free_lords | 20 | `banner_plain` |

### E8. Under a Protector

**Purpose:** a court that is someone's subject: Noris's or Stabilo's (protection offers, `zin_east.71`), a conqueror's, or the Worshipdom's after it kneels to the King of the East. Under decision S1 a kneeling court becomes a subject of the Worshipdom ("the Dominion of the East") with the autonomy state `zin_autonomy_eastern_client`, not a faction member, so E8 is how a client lives under its new overlord. **Opens:** `available` on `oath_to_the_protector`: `is_subject` (no `allow_branch`, because subject status changes in play). **Mutual exclusions:** `loyal_vassal` / `seek_more_freedom`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `oath_to_the_protector` | The Oath to the Protector | courts_of_the_east | – | 1,6 | 35 | Avail: is_subject. political_power 50 | 40 | `handshake_oath` |
| `loyal_vassal` | A Loyal House | oath_to_the_protector | seek_more_freedom | 0,7 | 70 | Avail: is_subject. timed_spirit protectors_favour 1095; call zin_shared_east_lands_loyal_house | 30; ×2 check zin_shared_east_lands_overlord_fond | `tribute_chest` |
| `seek_more_freedom` | Our Own Laws | oath_to_the_protector | loyal_vassal | 2,7 | 70 | Avail: is_subject. call zin_shared_east_lands_own_laws; stability 0.03 | 20; ×2 check zin_shared_east_lands_resents_overlord | `charter_free` |
| `the_protectors_due` | The Protector's Due | loyal_vassal / seek_more_freedom | – | 1,8 | 35 | stability 0.03; if subject_of Noris: Lean +10; if subject_of Stabilo: Lean −10 and Debt −10 | 30 | `ledger_coins` |

### E9. The Question of the East

**Purpose:** what a small court answers when the Deliverer's friends ask more than prayers. It may pledge itself to them (and so become a candidate to kneel when the King of the East comes), refuse any god-king and stand with the Free Crowns, or wait upon events. **Opens:** `question_of_the_east` is available only with `check zin_east_question_open` (`zin_afrit_king_of_east`, or `zin_eastern_invasion`, or `zin_golden_king_dead` after 1 Thaw 4A 1753). **Mutual exclusions:** the three route focuses. **Mechanic:** `zin_east_pledged` (kneel bias +100; the Afrit spec treats a pledged court with footholds 3 or more as an eastern candidate, proposed dependency named in the eastern kings spec); `zin_east_route_resist` (kneel bias −100, coalition weight −50, proposed dependency on the eastern kings mechanic); `zin_east_free_crown`, `zin_east_grant_free_cb`. Tier C courts may pledge (proposed; owner question in [../../OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md), "regions: east, south isles, sun" 2).

**Kneeling** is not a focus. The Afrit spec's `zin_afrit.51` asks each eastern candidate; a court that kneels gets `zin_afrit_eastern_client` and, under decision S1, becomes the Worshipdom's subject with `zin_autonomy_eastern_client`. This tree only shifts the odds (`zin_east_pledged`, `zin_east_route_resist`); which courts kneel is decided in each game.

Text is two-faced through scripted localisation. `faith_in_the_deliverers_friends` reads "The Houses of the First Light have been generous. When [zin_loc_deliverer] calls, [ROOT.GetName] will answer." Before the reveal this shows Aurevan the Deliverer; after it, Afrit. No text says which kings will kneel.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `question_of_the_east` | The Question of the East | temples_of_the_deliverer / envoys_from_both_roads / the_old_customs | – | 14,6 | 35 | Avail: check zin_east_question_open. political_power 50 | 200 when available | `two_crowns` |
| `faith_in_the_deliverers_friends` | Faith in the Deliverer's Friends | question_of_the_east | our_court_kneels_to_no_god, wait_upon_events | 10,7 | 70 | flag zin_east_pledged; Footholds +1 | 10; ×2 footholds ≥ 3; ×2 bias ≥ 20; ×0.5 bias ≤ −1; ×0 hist and not check zin_shared_east_lands_hist_pledger; ×0 refuse rule | `censer` |
| `our_court_kneels_to_no_god` | Our Court Kneels to No God | question_of_the_east | faith_in_the_deliverers_friends, wait_upon_events | 14,7 | 70 | flag zin_east_route_resist; Footholds −1; stability 0.03 | 20; ×2 bias ≤ −20; ×0.25 bias ≥ 50; ×2 ideology light; ×2 refuser; ×5 refuse rule | `banner_plain` |
| `wait_upon_events` | Wait Upon Events | question_of_the_east | faith_in_the_deliverers_friends, our_court_kneels_to_no_god | 18,7 | 35 | political_power 50; stability 0.05 | 40; hist ×1.5 | `scroll_sealed` |
| `gifts_for_the_king` | Gifts for the King in the East | faith_in_the_deliverers_friends | – | 9,8 | 35 | Avail: global_flag zin_afrit_king_of_east; client. add_spirit eastern_oath; political_power 25 | 100 when available | `tribute_chest` |
| `levies_for_the_host` | Levies for the Host | faith_in_the_deliverers_friends | – | 11,8 | 70 | Avail: global_flag zin_afrit_returned; client. manpower −2000; army_experience 15 | 80 when available | `levy_muster` |
| `when_the_king_falls` | When the King Falls | gifts_for_the_king / levies_for_the_host | – | 10,9 | 35 | Avail: global_flag zin_afrit_dead. remove_spirit eastern_oath; stability 0.05; political_power 50 | 500 when available | `crown_broken` |
| `stand_with_the_free_crowns` | Stand With the Free Crowns | our_court_kneels_to_no_god | – | 13,8 | 70 | Avail: check zin_east_free_crown. call zin_east_grant_free_cb; add_spirit free_crown_court | 100 when available | `banner_league` |
| `close_the_gates_to_the_host` | Close the Gates to the Host | our_court_kneels_to_no_god | – | 15,8 | 70 | Avail: global_flag zin_afrit_king_of_east. building bunker 2 @capital; war_support 0.05 | 60 when available | `fort_wall` |
| `the_crowns_vindicated` | The Crowns Vindicated | stand_with_the_free_crowns / close_the_gates_to_the_host | – | 14,9 | 35 | Avail: global_flag zin_afrit_dead. remove_spirit free_crown_court; political_power 75; stability 0.05 | 500 when available | `olive_branch` |
| `keep_our_own_counsel` | Keep Our Own Counsel | wait_upon_events | – | 18,8 | 70 | Avail: global_flag zin_afrit_king_of_east. add_spirit own_counsel | 60 when available | `eye_watchful` |

### E10. Beyond the Rift

**Purpose:** the court that joined the eastern coalition (`zin_east.42`). Its companies cross the rift, claim elven shores, turn west with the host, and, when the dead and Volgan's hosts make the war a ruin, come home or serve another banner (established: some eastern formations retreated east; abandoned eastern troops joined Eindil's coalition). **Opens:** `answer_the_coalition` needs flag `zin_east_coalition_member`. **Mechanic:** `zin_east_claim_rift`, `zin_east_turns_west`, `zin_east_companies_with_eindil` (read by the journey spec's "Call the Stranded Armies").

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI | Icon |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `answer_the_coalition` | Answer the Eastern Coalition | courts_of_the_east | – | 24,6 | 35 | Avail: flag zin_east_coalition_member. war_support 0.05; army_experience 10; remove_spirit rift_trade | 300 when available | `war_drums` |
| `spoils_across_the_rift` | Spoils Across the Rift | answer_the_coalition | – | 23,7 | 70 | Avail: check zin_shared_east_lands_at_war_magical. call zin_east_claim_rift | 80 when available | `map_unrolled` |
| `with_the_host_to_parim` | With the Host to Parim | answer_the_coalition | – | 25,7 | 70 | Avail: global_flag zin_east_turns_west. army_experience 10; war_support 0.05 | 80 when available | `war_council_map` |
| `bring_the_companies_home` | Bring the Companies Home | spoils_across_the_rift / with_the_host_to_parim | serve_the_strangers_coalition | 23,8 | 35 | Avail: check zin_shared_east_lands_at_war_west. call zin_shared_east_lands_withdraw; manpower 3000; tooltip "Some companies will not come home." | 30; ×0 not (global_flag zin_zol_rising or global_flag zin_volgan_marches); ×3 refuser | `banner_laid_down` |
| `serve_the_strangers_coalition` | Serve Another Banner | spoils_across_the_rift / with_the_host_to_parim | bring_the_companies_home | 25,8 | 35 | Avail: global_flag zin_eindil_returned; check zin_shared_east_lands_at_war_west. flag zin_east_companies_with_eindil; army_experience 10; tooltip "Our cut-off companies will fight on under those who stand against the dead." | 30; ×3 refuser; ×0 client | `banner_league` |

### Spirits

Ids `zin_shared_east_lands_<key>`. No spirit key equals a focus key (their localisation keys would collide). Every modifier key is in the 1.19.3 modifier documentation. Each spirit uses the icon of the focus that adds it (`GFX_idea_zin_<key>`).

| Key | Name | Icon | Modifiers | Added / removed |
| --- | --- | --- | --- | --- |
| `caravanserai_trade` | Caravanserais | `caravan` | trade_opinion_factor 0.10, consumer_goods_factor −0.02 | `caravanserais`; permanent |
| `oasis_gardens_spirit` | Oasis Gardens | `farm_sowing` | monthly_population 0.05, stability_factor 0.02 | `oasis_gardens`; permanent |
| `dune_riders` | Riders of the Dunes | `camel_rider` | heat_attrition_factor −0.20, cavalry_attack_factor 0.05 | `riders_of_the_dunes`; permanent |
| `open_road` | The Open Road | `roads_paved` | trade_opinion_factor 0.10, political_power_gain 0.05 | `the_open_road`; permanent (a court's habit, not a treaty clause) |
| `generous_friends` | The Generous Friends | `house_first_light` | stability_factor 0.03, political_power_gain −0.03 | `welcome_the_generous_friends`; removed by `close_the_houses` |
| `healing_houses` | Houses of Healing | `healer_herbs` | recruitable_population_factor 0.03, stability_factor 0.02 | `houses_of_healing`; permanent |
| `watchful_quays` | Watchful Quays | `eye_watchful` | enemy_operative_detection_chance_factor 0.15, drift_defence_factor 0.10 | `watch_the_quays`; permanent |
| `drilled_levies` | Drilled Levies | `levy_muster` | army_org_factor 0.05, experience_gain_army_factor 0.05 | `drill_the_levies`; permanent |
| `north_sea_watch` | The Northern Sea Watch | `galley_oars` | coastal_bunker_effectiveness_factor 0.10, naval_detection 0.10 | `ships_against_the_dead`; permanent |
| `rift_trade` | Trade Across the Rift | `envoy` | trade_opinion_factor 0.10, research_speed_factor 0.02 | `traders_across_the_rift`; removed by `answer_the_coalition` |
| `kings_law` | The King's Law | `seal_royal` | political_power_factor 0.10, stability_factor −0.02 | `the_kings_law`; permanent |
| `town_council` | Council of the Towns | `concord_circle` | stability_factor 0.05, opinion_gain_monthly_factor 0.10 | `council_of_the_towns`; permanent |
| `free_lords` | The Free Lords | `banner_plain` | production_speed_buildings_factor 0.05, conscription_factor 0.03 | `the_free_lords`; permanent |
| `protectors_favour` | The Protector's Favour | `tribute_chest` | stability_factor 0.03, political_power_gain 0.05 | `loyal_vassal`; timed, 1,095 days |
| `eastern_oath` | Oath to the King in the East | `tribute_chest` | war_support_factor 0.05, army_attack_factor 0.03 | `gifts_for_the_king`; removed by `when_the_king_falls` |
| `free_crown_court` | A Free Crown | `banner_league` | army_defence_factor 0.05, war_support_factor 0.05 | `stand_with_the_free_crowns`; removed by `the_crowns_vindicated` |
| `own_counsel` | Our Own Counsel | `eye_watchful` | drift_defence_factor 0.20, stability_factor 0.03 | `keep_our_own_counsel`; permanent |

The mechanic adds its own ideas when they apply (`zin_east_temple_loan`, `zin_east_coalition_ambition`, `zin_east_free_crowns`, `zin_east_kings_debt`, `zin_east_vindicated`).

### Events (namespace `zin_shared_east_lands`)

All are fired by focus effects or by options of these events. None has its own trigger. Options' AI is `ai_chance` as base and factors; the asking court is FROM.

| Id | Title | For | Fired by | Options (effects; AI) |
| --- | --- | --- | --- | --- |
| .1 | A Court Asks for the Treaty | Noris | `ask_for_the_treaty` | "Welcome them into the Treaty" (invite FROM; for_country FROM: Lean +10; event_for FROM .4; AI 40, ×1.5 check zin_shared_east_lands_asker_near, ×0.3 check zin_shared_east_lands_asker_near_rival, ×0 check zin_shared_east_lands_asker_guarded) / "Not yet" (for_country FROM: Lean −5; event_for FROM .4; AI 30) |
| .2 | A Court Asks for the Pact | Stabilo | `ask_for_the_pact` | "Welcome them into the Pact" (invite FROM; for_country FROM: Lean −10, Debt −5; event_for FROM .4; AI as .1) / "Not yet" (for_country FROM: Lean +5; event_for FROM .4; AI 30) |
| .3 | Tales of Black Ships | ROOT | `tales_of_black_ships` | Fishermen speak of dark sails among far islands that answer no hail. "Old fishermen's tales" (political_power 15) / "Send a boat to look" (navy_experience 5; text: the boat comes back with nothing to tell; nobody aboard will speak of it). AI 50/50. The text never says what the ships are |
| .4 | The Answer of [FROM.GetName] | the asking court | .1 or .2 | Result text only ("They welcome us" / "They ask us to wait"); one option |

**Pictures** (event catalog, [../02_icon_catalog.md](../02_icon_catalog.md)): .1, .2 and .4 `generic_court` until the requested key `desert_envoys` (envoys with camels and banners before a desert court's gate; no figure of a ruler; no gate) is added; .3 `black_ships_tale` (ungated). The catalog's `eastern_court` is gated on `zin_afrit_abandoned_aenor` and is not used.

## Implementation

### Files

| Path | Written by | Content |
| --- | --- | --- |
| `docs/design/focus/shared_east_lands.json` | authored data (source of truth) | Tree data, `"tier": "shared"`, `"countries"`: the 24 names above |
| `common/national_focus/zin_shared_east_lands.txt` | `tools/content/modules/focus_compiler.mjs` (new) | Compiled tree; `country = { factor = 0 modifier = { add = 10 original_tag = <tag> } … }` with one modifier per country, tags resolved from the names at build time |
| `common/ideas/zin_focus_shared_east_lands.txt` | focus compiler | The 17 spirits above |
| `events/zin_shared_east_lands.txt` | focus compiler | Namespace `zin_shared_east_lands`; four effect-triggered events |
| `common/scripted_effects/zin_shared_east_lands.txt` | focus compiler | Tree effects below |
| `common/scripted_triggers/zin_shared_east_lands.txt` | focus compiler | Tree triggers below |
| `localisation/english/zin_focus_shared_east_lands_l_english.yml` | focus compiler | All text (UTF-8 with BOM; Windows-1252 characters only) |

All are written in the builder's one transaction through the shared atomic rewrite engine (`tools/content/apply.mts`). The compiled tree replaces the interim "Long Peace" tree (`zin_long_peace_*`, written today by `tools/content/modules/vanilla_removal.mjs`) for the 24 courts.

### Tree-declared scripted triggers

| Name | Scope | True when |
| --- | --- | --- |
| `zin_shared_east_lands_on_road` | country | `any_owned_state` with `zin_is_site_road_salt`, `_gold`, `_rift`, `_lake` or `_sand` |
| `zin_shared_east_lands_north_coast` | country | `any_owned_state` with `zin_is_site_ocean_of_zol_coast` and `zin_is_region_east_lands` |
| `zin_shared_east_lands_borders_noris`, `_borders_stabilo` | country | `any_neighbor_country` with `zin_is_noris` / `zin_is_stabilo` |
| `zin_shared_east_lands_lean_balanced` | country | `zin_east_lean` above −15 and below 15 |
| `zin_shared_east_lands_can_ask_treaty` | country | a country with `zin_is_noris` exists and `is_faction_leader`; ROOT not `is_in_faction`; `zin_east_lean` above 39; not `has_war_with` Noris |
| `zin_shared_east_lands_can_ask_pact` | country | the same for Stabilo, with `zin_east_lean` below −39 |
| `zin_shared_east_lands_in_treaty`, `_in_pact` | country | `is_in_faction_with` Noris / Stabilo |
| `zin_shared_east_lands_can_borrow` | country | Stabilo exists with `has_country_flag = zin_stabilo_ledger_open`; not `has_war_with` Stabilo |
| `zin_shared_east_lands_overlord_fond` | country | `OVERLORD = { has_opinion = { target = ROOT value > 49 } }` |
| `zin_shared_east_lands_resents_overlord` | country | `has_opinion = { target = OVERLORD value < 0 }` |
| `zin_shared_east_lands_hist_pledger` | country | `zin_footholds` above 3 and `zin_east_kneel_bias` above 19 (the historical path's rare pledger) |
| `zin_shared_east_lands_at_war_magical` | country | `any_enemy_country` with `has_country_flag = zin_region_magical_lands` |
| `zin_shared_east_lands_at_war_west` | country | `any_enemy_country` with `zin_region_magical_lands` or `zin_region_middle_lands` |
| `zin_shared_east_lands_asker_near` | country (event) | FROM `is_neighbor_of` ROOT |
| `zin_shared_east_lands_asker_near_rival` | country (event) | FROM borders the other power (Stabilo when ROOT is Noris, else Noris) |
| `zin_shared_east_lands_asker_guarded` | country (event) | FROM `is_guaranteed_by` the other power |

### Tree-declared scripted effects

| Name | Scope | Does |
| --- | --- | --- |
| `zin_shared_east_lands_road_infra` | country | `add_building_construction` infrastructure +1 in a random owned road state; the capital if none (called by tier B trees too) |
| `zin_shared_east_lands_halve_lean` | court | `set_temp_variable` to `zin_east_lean`, `multiply_temp_variable` by −0.5, passes it to `zin_east_add_lean` (the mechanic's only write path; called by tier B trees too) |
| `zin_shared_east_lands_rift_goodwill` | court | `every_country` with `zin_region_magical_lands` that owns a `zin_is_site_rift_west` state: `add_opinion_modifier = { target = ROOT modifier = zin_east_court_gifts }` (the mechanic's +15 modifier; called by tier B trees too) |
| `zin_shared_east_lands_withdraw` | country | `white_peace` with every enemy that has `zin_region_magical_lands` or `zin_region_middle_lands` |
| `zin_shared_east_lands_deep_sand` | country | `country_event = { id = zin_east.35 }` (the mechanic's Into the Deep Sand) |
| `zin_shared_east_lands_loyal_house` | subject | `add_autonomy_ratio = { value = -0.10 localization = zin_shared_east_lands_loyal_house }` |
| `zin_shared_east_lands_own_laws` | subject | `add_autonomy_ratio = { value = 0.15 localization = zin_shared_east_lands_own_laws }` |

### Names this tree uses from other systems

| Name | Kind | Owner |
| --- | --- | --- |
| `zin_east_add_lean`, `zin_east_wells_random`, `zin_east_claim_rift`, `zin_east_grant_free_cb` | scripted effects | eastern kings |
| `zin_east_is_south_court`, `zin_east_faces_rift`, `zin_east_question_open`, `zin_east_free_crown`, `zin_is_noris`, `zin_is_stabilo`, `zin_is_region_east_lands`, `zin_is_site_road_<key>`, `zin_is_site_rift_east`, `zin_is_site_rift_west` | scripted triggers | eastern kings |
| `zin_east_lean`, `zin_east_kneel_bias`; `zin_east_coalition_member`, `zin_east_in_crisis`; `zin_east_turns_west`, `zin_eastern_invasion`; `zin_east_court_gifts`; `zin_east.35` | variables, flags, opinion modifier, event | eastern kings |
| `zin_stabilo_add_debt`, `zin_stabilo_debt`, `zin_stabilo_ledger_open` | effect, variable, flag | Stabilo tree |
| `zin_afrit_add_footholds`, `zin_afrit_purge_houses`; `zin_footholds`; `zin_afrit_suspicious`, `zin_afrit_eastern_client`, `zin_afrit_refused_east` | effects, variable, flags | Afrit |
| `zin_autonomy_eastern_client` | autonomy state (decision S1) | diplomacy |
| `zin_is_site_ocean_of_zol_coast` | site trigger | key sites (generated in `zin_sites.txt`) |
| `zin_politics_add_drift` | scripted effect | politics |
| `zin_rules_is_historical`, `zin_rules_ai_branch_east_refuse_afrit`, `zin_rules_ai_branch_east_unite_without_afrit` | scripted triggers | defines and rules |
| `zin_loc_deliverer` | scripted localisation | lore digest |
| `zin_region_<key>` | country flags | world systems |
| `zin_afrit_revealed`, `zin_afrit_king_of_east`, `zin_afrit_returned`, `zin_afrit_dead`, `zin_war_of_last_crowns`, `zin_zol_rising`, `zin_volgan_marches`, `zin_eindil_returned`, `zin_golden_king_dead` | global flags | shared contract |

### Shared names introduced here

| Name | Kind | Meaning | Reader |
| --- | --- | --- | --- |
| `zin_east_route_resist` | country flag | A tier B or C court refused any god-king (resist route) | Eastern kings mechanic: kneel bias −100 (its row "a tree's resist route flag"), coalition weight −50 |
| `zin_east_court_audit` | country flag | The court audited the temples | Eastern kings mechanic: `zin_east.30` "Accept the loan" AI 0 (its row "an audit flag from a tree") |

Both are already in the contract additions register. An earlier draft's separate north-coast site trigger is retired (contract retired list): the shared site trigger `zin_is_site_ocean_of_zol_coast` with the region test does the same.

### Engine names

Effects: `add_building_construction`, `add_autonomy_ratio`, `add_opinion_modifier`, `add_to_faction` (through `invite`), `white_peace`, `country_event`, `set_temp_variable`, `multiply_temp_variable`, `every_country`, `every_enemy_country`, `add_tech_bonus` (through `research`). Triggers: `any_owned_state`, `any_neighbor_country`, `any_enemy_country`, `is_faction_leader`, `is_in_faction`, `is_in_faction_with`, `has_war_with`, `has_opinion`, `is_neighbor_of`, `is_guaranteed_by`, `is_subject`, `is_subject_of`, `has_country_flag`, `has_global_flag`, `has_game_rule` (inside the rule wrappers). Buildings: `industrial_complex`, `infrastructure`, `dockyard`, `naval_base`, `bunker`, `coastal_bunker`. Every one exists in 1.19.3 (game documentation and `common/buildings/00_buildings.txt`). No on_action and no define.

### Data checks

- 68 focuses; positions unique; every focus below its prerequisites; `days` multiples of 7 between 35 and 70; exclusives symmetric.
- No `raw` block.
- No spirit key equals a focus key.
- Every icon is a catalog key in game today; every event picture exists and is ungated.
- The compiler's secret scan over the localisation file passes; two-faced text uses `[zin_loc_deliverer]`; no text contains "Eindil" or "stranger".
- No focus reachable on 1 Thaw 4A 1748 contains `wargoal`, `claims_on`, `cores_on`, `declare_war`, `add_state_claim` or a call that grants a cause.

## AI

- **Order.** Courts take the root, then E1, E3 and E5 at the weights above; road courts take the road half; South Lands courts dig wells first (AI 40).
- **Lean.** A court's first E3 choice follows its start lean: positive lean favours `lean_to_furvior`, negative favours `lean_to_postondoroth`, lean within ±15 favours `servant_of_no_road`. On the historical path asks to join a bloc are halved, so the blocs grow mostly through the great powers' own invitations (mechanic: each gains one or two members in 4A 1751 to 1754).
- **Temples.** Historical weights favour welcoming the friends where footholds are 2 or more, so the eastern network stays deep enough for the King of the East; Light courts audit.
- **The Question of the East.** Under the historical path pledging is rare (only footholds 4 and bias 20 or more); most courts wait upon events, and Light courts refuse. Which courts kneel is still decided by the Afrit spec's candidate rule and its historical auto-accept, never by this tree alone.
- **Coalition.** Members take every E10 focus when available; they come home only after the dead or Volgan's hosts are loose.
- **Rule `zin_rule_ai_east`.** REFUSE_AFRIT and UNITE_WITHOUT_AFRIT set pledging to 0 and multiply the resist route by 5.

## Acceptance

1. Every one of the 24 courts maps to this tree and to no other (compiler coverage check).
2. The compiled tree has 68 focuses with unique positions; the compiler, the HOI4 Agent Tools focus inspector and script validator pass; `npm test` in `tools/` passes.
3. On 1 Thaw 4A 1748 no available focus can create a war, a claim or a war goal (scan of the compiled file and the effects it calls).
4. `allow_branch` shows E2 only to South Lands courts (Mostok, Obmi, Oreton), E6a only to north-coast courts, E6b only to rift-coast courts; E8 can be taken only by subjects; a scenario test over all 24 courts lists the visible modules per court.
5. `the_dry_roads` sets `zin_east_wells_unlocked` and gives one owned dry state wells; `count_the_temple_gold` lowers footholds by one and sets `zin_east_court_audit`; `our_court_kneels_to_no_god` sets `zin_east_route_resist` (scripted tests).
6. On a historical observer run (4A 1748 to 4A 1760), no tier C court of this tree is at war before `zin_war_of_last_crowns`, and E9 is never available before `zin_east_question_open`. A court that kneels becomes a subject of the Worshipdom with `zin_autonomy_eastern_client` and can then take E8.
7. No text names Afrit before `zin_afrit_revealed`; no text names Eindil or a stranger (compiler secret scan).
8. Every modifier in the spirits table exists in the modifier documentation; every effect and trigger named exists in the effect and trigger documentation or in a spec's scripted file.
9. The isolated Linux run (one in-game year) logs no error line from a `zin_shared_east_lands` file.

## Open questions

Resolved here on labelled proposals; the two owner questions are in [../../OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md).

1. *Small courts asking to join the Noris Treaty or the Stabilo Pact.* Owner question ("regions: east, south isles, sun" 2). Proceeds on the proposal: they may ask (E3); the great power decides.
2. *Tier C courts pledging to the Deliverer's friends.* Owner question (same item). Proceeds on the proposal: they may pledge (E9), which makes them candidates only at footholds 3 or more.
3. *An autonomy effect in the compiler.* Resolved: E8 calls two tree-declared scripted effects that wrap `add_autonomy_ratio`; the tree has no `raw` block and needs no compiler change.
4. *The lore spec's "Black Ships" event for the north coast.* Resolved: this tree's event `.3` is the north-coast courts' tale; `zin_lore.180` keeps its own list (proposed).
