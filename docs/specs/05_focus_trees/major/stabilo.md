# Stabilo Focus Tree

**Status:** Draft. **Priority:** 4. **Phase:** 4.

## Purpose

The major focus tree for **Stabilo**, the merchant principality of the East Lands (tree id `stabilo`, focus ids `zin_stabilo_<key>`, data file `docs/design/focus/stabilo.json`). It plays the eastern kings mechanic ([../../04_mechanics/eastern_kings.md](../../04_mechanics/eastern_kings.md)) from Postondoroth: a prince and the great merchant houses, the **Ledger of the East** that makes half the eastern crowns Stabilo's debtors, the Gold and Sand Roads of the south, the Stabilo Pact with Drak and the southern kingdoms, the hired shield-companies, the temple accounts, and the great question of the end of the age: **finance the King of the East, pay for the crowns that refuse him, or buy the whole East**.

Stabilo is a **merchant principality**: contracts, credit and hired swords. Its rival Noris ([noris.md](noris.md)) is a **rider kingdom** of clans and wells. Noris wins the East by riding; Stabilo wins it by lending. Stabilo's own tree mechanic is the Ledger, a creditor's hold on other courts, which also competes with the temples' generous friends.

The tree has 111 focuses in ten branches, 30 columns wide (x 0 to 29).

## Lore basis

**Established** (vault): Stabilo is an eastern great power that competes with Noris for the southern trade routes (working table); its seat is Postondoroth (working table); it leads the Stabilo Pact with Drak and its rival is Noris (working table); the East Lands lie across the rift sea from the Magical Lands; the South Lands are the great desert of the East Lands and run off the southern map; the Hidden Council builds ties in eastern courts as a reserve seat, using commercial connections among other means; an eastern coalition invades the Magical Lands; Afrit takes command of an eastern host and is proclaimed King of the East, while states of the East still resist him; abandoned eastern troops join Eindil's coalition; eastern claims and grievances remain after the war.

**Proposed** (vault proposals this tree builds on): the caravan roads of 4A 600 to 780 and the rivalry they began; the eastern branch's courtship from about 4A 1300; the start on 1 Thaw 4A 1748; the choices "Noris and Stabilo can fight each other, fight Aenor, or fight him"; the outcome "the East unites under one king who is not Afrit".

**Proposed here:** every focus, spirit, event and number; the great houses (the Prince's own house, the House of Azano that keeps the treasury, the House of Shindor that keeps the companies) named after the proposed characters Prince Cereos, Lady Mylun Azano and General Hardfic Shindor; the Guild of Scales; the Ledger and its debts; the shield-companies. Which eastern kings follow Afrit is **open** in the vault: the tree offers both answers and never states one as history. Before `zin_afrit_revealed` no text names Afrit; the King of the East is "the Deliverer" or "King Aurevan" through `zin_afrit_name`.

## Design

### The peaceful start

On 1 Thaw 4A 1748 every available focus is about the houses, credit, caravans, envoys or hired companies. No focus before the route junction can create a war goal, a claim or a war. War content opens only from story flags (`zin_golden_king_dead`, `zin_war_of_last_crowns`, `zin_eastern_invasion`, `zin_east_turns_west`, `zin_afrit_king_of_east`, `zin_afrit_returned`, `zin_afrit_dead`, `zin_eindil_returned`) or from the mechanic's peace gates.

### The Ledger of the East (tree mechanic)

Postondoroth lends to princes. Every East Lands court except Noris and Stabilo carries `zin_stabilo_debt` (0–100), what it owes Stabilo's houses.

**Start debts (proposed):** Drak 20, Plutondo 10, Mostok 10, every other court 0.

**Decisions** (category `zin_east_ledger`, The Ledger of the East; visible to Stabilo with `zin_stabilo_ledger_open`; implemented in the mechanic's decision file). Targets: `zin_east_is_court`, not at war with Stabilo.

| Key | Requires | Cost | Effect | Cooldown | AI |
| --- | --- | ---: | --- | --- | --- |
| `zin_stabilo_lend` | target debt < 80 | 50 PP | `zin_stabilo.30` to the target: accept → timed idea `zin_stabilo_credit` (365 days), debt +15, lean +5 toward Stabilo; decline → nothing | 180 days per target | courts with lean −40 to +20, crisis first |
| `zin_stabilo_great_loan` | `zin_stabilo_loans_to_kings`; target owns 12+ states; debt < 60 | 100 PP | `zin_stabilo.30` (great loan text): accept → target political power +100, debt +30, lean +10 toward Stabilo | 365 days per target | the four great kingdoms first |
| `zin_stabilo_call_in_debt` | `zin_stabilo_collect`; debt ≥ 30 | 10 PP | `zin_stabilo.31` to the target: pay in gold (target political power −75, Stabilo +75, debt −30) / pay in kind (target sends 500 infantry equipment, debt −20) / default (debt to 0, lean −20, opinion of Stabilo −30; Stabilo gets `zin_stabilo.33`) | 180 days per target | when Stabilo's political power < 50 |
| `zin_stabilo_forgive_debt` | debt ≥ 20 | 25 PP | debt −20; lean +15 toward Stabilo; target opinion of Stabilo +20 | 365 days per target | before inviting a court to the Pact |

AI acceptance of `zin_stabilo.30`: 40, +30 with `zin_east_in_crisis`, +20 if stability < 40%, + (lean toward Stabilo) ÷ 2, −30 if the court owes the temples (`zin_east_owes_temples`). The mechanic's temple loan event offers a third option to borrow from Postondoroth instead (`zin_stabilo_add_debt(10)`).

**Interest and income.** `zin_stabilo_monthly` (called by the mechanic's monthly update):

- every court with debt 1–99 gains +0.2 debt a month (interest);
- `zin_stabilo_ledger_total` = the sum of all debts; dynamic modifier `zin_stabilo_ledger_income` on Stabilo: `political_power_gain` = total ÷ 2000 (at most 0.25), `trade_opinion_factor` = total ÷ 2500 (at most 0.20);
- a court at debt 90 or more fires `zin_stabilo.32` (A Debtor Cannot Pay) for Stabilo, once per court per 730 days: restructure (debt −30; lean +10 toward Stabilo) / press for payment (`zin_stabilo.31` with default weighted ×2; if a peace gate is open, a default gives Stabilo a claim on one road state of the court) / forgive (debt to 0; lean +25 toward Stabilo; Stabilo political power −50).

**What debt does elsewhere.** A court with debt 30 or more gets kneel bias −10 (−20 with Rivals of the Temple Banks; mechanic section 4). Debt is credit, never a subject relation; only the Prince of All Roads route turns deep debt into vassalage (Vassals by Contract).

### Branch map

| # | Branch | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| 1 | The Merchant Houses | 0–5 | 0–6 | 15 | start | Court: the Prince or the Council of Houses; the junction |
| 2 | The Ledger of the East | 6–10 | 0–6 | 13 | start | Debts, ledger income, rivalry with the temple banks |
| 3 | The Southern Roads | 11–15 | 0–5 | 12 | start | Gold and Sand Roads, wells, South Lands lean |
| 4 | The Stabilo Pact | 16–21 | 0–6 | 15 | start | Lean, invitations, protection, the southern kingdoms |
| 5 | The Shield-Companies | 22–26 | 0–6 | 14 | start; last two need story flags | Hired army, forts on the Noris march |
| 6 | The Temple Accounts | 27–29 | 0–4 | 8 | start | Footholds, temple loans, auditors |
| 7 | Treasurer of the East | 1–4 | 8–13 | 8 | The Reckoning of the East | Financing the King of the East |
| 8 | Paymaster of the Free Crowns | 7–11 | 8–12 | 9 | The Reckoning of the East | Refusal; paying the Free Crowns |
| 9 | The Prince of All Roads | 15–19 | 8–12 | 9 | The Reckoning of the East | Unification by purchase (`zin_east_united`) |
| 10 | Wars of the Roads | 22–28 | 7–10 | 7 | The Shield-Companies + story flags | The Caravan War; the rift coalition |

**The Reckoning of the East** (column 14, row 7) needs The Prince and the Houses, Creditor of Kings, Prince of the Caravans or The Greater Pact. Its three route focuses (row 8) are mutually exclusive.

### Notation used in the tables

- **Prerequisites:** `a + b` means a and b; `a / b` means a or b.
- **x,y:** grid column and row.
- **Effects** use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md) as in the Noris spec. Spirit keys compile to `zin_stabilo_<key>`.
- **Shorthands:** **Inf +n road** = `call zin_east_add_road_influence(road, n)`. **Lean +n on X** = `for_country X: call zin_east_add_lean(−n)`: in this tree a positive lean shorthand always means toward Stabilo. **Rivalry +n** = `call zin_east_add_rivalry(n)`. **Debt +n on X** = `for_country X: call zin_stabilo_add_debt(n)`. **Footholds ±n** = `call zin_afrit_add_footholds(n)` on Stabilo. **Bonus +n** = `variable zin_east_caravan_bonus add n`.
- **Where:** `@capital`; `@postondoroth` = the `zin_is_site_postondoroth` state; `@road_<key>`; `@random_owned`.
- **Avail:** the focus's `available` conditions. Bypass is never used.
- **AI:** "hist" = the historical path; "client" = Stabilo has `zin_afrit_eastern_client`; "refuser" = `zin_afrit_refused_east`.

### Branch 1: The Merchant Houses

**Purpose:** the court of Postondoroth. Prince Cereos rules, but the great houses pay for everything: the House of Azano (treasury), the House of Shindor (the companies) and the Guild of Scales (weights, measures and contracts). The prince must choose the **Prince's Purse** (a strong treasury under one hand) or the **Council of Houses** (an oligarchy that keeps the peace and spends slowly). **Opens:** at start. **Mutual exclusions:** The Prince's Purse / The Council of Houses. **Mechanic:** political power, stability; leads into the Reckoning.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_merchant_houses` | The Merchant Houses | – | – | 2,0 | 70 | event zin_stabilo.1; political_power 50 | 50 |
| `prince_of_postondoroth` | The Prince of Postondoroth | the_merchant_houses | – | 1,1 | 70 | add_spirit princes_household | 20 |
| `house_of_azano` | The House of Azano | the_merchant_houses | – | 3,1 | 35 | political_power 25; stability 0.02 | 20 |
| `seat_at_postondoroth` | The Seat at Postondoroth | prince_of_postondoroth | – | 0,2 | 70 | building industrial_complex 1 @postondoroth; political_power 25 | 15 |
| `contract_courts` | The Contract Courts | prince_of_postondoroth / house_of_azano | – | 2,2 | 70 | add_spirit contract_courts | 15 |
| `house_of_shindor` | The House of Shindor | house_of_azano | – | 4,2 | 35 | army_experience 10; political_power 25 | 12 |
| `guild_of_scales` | The Guild of Scales | house_of_azano | – | 5,2 | 70 | Inf +5 gold; Inf +5 sand | 12 |
| `princes_purse` | The Prince's Purse | seat_at_postondoroth / contract_courts | council_of_houses | 1,3 | 70 | add_spirit princes_purse | 10; hist ×2 |
| `council_of_houses` | The Council of Houses | contract_courts / house_of_shindor / guild_of_scales | princes_purse | 4,3 | 70 | add_spirit council_of_houses; popularity light 0.05 | 10; ×2 if stability < 40% |
| `minted_crowns` | The Minted Crowns | princes_purse | – | 0,4 | 70 | building industrial_complex 1 @capital; political_power 50 | 15 |
| `law_of_the_scales` | The Law of the Scales | princes_purse / council_of_houses | – | 2,4 | 70 | stability 0.05 | 15 |
| `the_houses_vote` | The Houses Vote | council_of_houses | – | 4,4 | 35 | event zin_stabilo.3 | 15 |
| `hall_of_the_golden_ledger` | The Hall of the Golden Ledger | minted_crowns / law_of_the_scales | – | 1,5 | 70 | building industrial_complex 1 @random_owned; political_power 25 | 12 |
| `the_pact_council_sits` | The Pact Council Sits | law_of_the_scales / the_houses_vote | – | 3,5 | 70 | political_power 50; call zin_stabilo_pact_lean(5) | 12 |
| `prince_and_houses` | The Prince and the Houses | hall_of_the_golden_ledger / the_pact_council_sits | – | 2,6 | 70 | event zin_stabilo.4; stability 0.05; political_power 75 | 20 |

### Branch 2: The Ledger of the East

**Purpose:** Stabilo's own mechanic. The bankers of Fudol open the Ledger, then lend to kings, insure caravans, collect debts in gold or iron, and set themselves against the temples' generous friends as the East's other creditor. **Opens:** at start. **Mutual exclusions:** none. **Mechanic:** `zin_stabilo_ledger_open`, `zin_stabilo_loans_to_kings`, `zin_stabilo_collect`, `zin_stabilo_rival_banks`, ledger income.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `ledger_of_the_east` | The Ledger of the East | – | – | 8,0 | 70 | flag zin_stabilo_ledger_open (Lend, Forgive a Debt); political_power 25 | 40 |
| `bankers_of_fudol` | The Bankers of Fudol | ledger_of_the_east | – | 7,1 | 70 | building industrial_complex 1 @capital | 20 |
| `letters_of_credit` | Letters of Credit | ledger_of_the_east | – | 9,1 | 70 | add_spirit letters_of_credit; Bonus +0.25 | 20 |
| `loans_to_the_kings` | Loans to the Kings | bankers_of_fudol | – | 6,2 | 70 | flag zin_stabilo_loans_to_kings (Great Loan) | 15 |
| `the_counting_houses` | The Counting Houses | bankers_of_fudol / letters_of_credit | – | 8,2 | 70 | political_power 50; stability 0.02 | 15 |
| `caravan_insurance` | Caravan Insurance | letters_of_credit | – | 10,2 | 70 | call zin_stabilo_insure_roads; Bonus +0.25 | 12 |
| `collect_the_debts` | Collect the Debts | loans_to_the_kings / the_counting_houses | – | 7,3 | 35 | flag zin_stabilo_collect (Call In a Debt) | 15 |
| `interest_of_peace` | The Interest of Peace | the_counting_houses / caravan_insurance | – | 9,3 | 70 | Rivalry −5; political_power 25 | 12; hist ×2 |
| `debts_paid_in_iron` | Debts Paid in Iron | collect_the_debts | – | 6,4 | 70 | call zin_stabilo_debt_tribute | 10 |
| `rivals_of_the_temple_banks` | Rivals of the Temple Banks | collect_the_debts / interest_of_peace | – | 8,4 | 70 | flag zin_stabilo_rival_banks; tooltip "Courts in Postondoroth's debt listen less to the temples' friends." | 10; ×2 with Audit the Temples |
| `credit_for_the_rift` | Credit for the Rift Ports | interest_of_peace | – | 10,4 | 70 | Inf +10 rift; Lean +10 on Delbiz Grasslands | 12 |
| `the_great_ledger` | The Great Ledger | debts_paid_in_iron / rivals_of_the_temple_banks / credit_for_the_rift | – | 8,5 | 70 | add_spirit great_ledger | 12 |
| `creditor_of_kings` | Creditor of Kings | the_great_ledger | – | 8,6 | 70 | political_power 100; call zin_stabilo_creditor | 15 |

### Branch 3: The Southern Roads

**Purpose:** the roads Stabilo was founded on. Stabilo holds the Gold Road at start and wants the Sand Road through the South Lands; it reaches west to Alerhia, buys the markets of The Moco, fortifies its caravanserais, and bids for the Rift Road. Its patrols open the wells; a caravan goes beyond the dunes. **Opens:** at start. **Mutual exclusions:** none. **Mechanic:** road influence, `zin_east_wells_unlocked`, South Lands lean.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_southern_roads` | The Southern Roads | – | – | 13,0 | 70 | Inf +10 gold; political_power 25 | 40 |
| `caravanserais_of_the_gold_road` | Caravanserais of the Gold Road | the_southern_roads | – | 12,1 | 70 | building infrastructure 1 @road_gold ×2; Inf +5 gold | 15 |
| `sand_road_charter` | The Sand Road Charter | the_southern_roads | – | 14,1 | 70 | Inf +15 sand | 20; ×2 if the sand road is free |
| `west_to_alerhia` | West to Alerhia | caravanserais_of_the_gold_road | – | 11,2 | 70 | Lean +10 on Alerhia; Lean +10 on Kersian; Lean +10 on Azano; Inf +5 gold | 15 |
| `wells_of_obmi` | The Wells of Obmi | caravanserais_of_the_gold_road / sand_road_charter | – | 13,2 | 70 | event_for Obmi zin_stabilo.5 | 12 |
| `desert_patrols` | Desert Patrols | sand_road_charter | – | 15,2 | 35 | flag zin_east_wells_unlocked (Dig the Wells); army_experience 5 | 15 |
| `markets_of_the_moco` | The Markets of The Moco | west_to_alerhia / wells_of_obmi | – | 12,3 | 70 | Lean +15 on The Moco; Inf +10 lake | 12 |
| `trade_of_the_south_lands` | Trade of the South Lands | wells_of_obmi / desert_patrols | – | 14,3 | 70 | call zin_stabilo_south_lean(10) | 12 |
| `a_bid_for_the_rift_road` | A Bid for the Rift Road | markets_of_the_moco | – | 11,4 | 70 | Inf +15 rift; Rivalry +3 | 10; hist ×0.5 |
| `fortified_caravanserais` | Fortified Caravanserais | markets_of_the_moco / trade_of_the_south_lands | – | 13,4 | 70 | building bunker 1 @road_gold ×2; add_spirit fortified_caravanserais | 10 |
| `beyond_the_dunes` | Beyond the Dunes | trade_of_the_south_lands | – | 15,4 | 70 | event zin_east.35 | 5 |
| `prince_of_the_caravans` | Prince of the Caravans | a_bid_for_the_rift_road / fortified_caravanserais / beyond_the_dunes | – | 13,5 | 70 | add_spirit prince_of_caravans; Bonus +0.5; building industrial_complex 2 @random_owned | 12 |

### Branch 4: The Stabilo Pact

**Purpose:** Stabilo's bloc in the south. Drak is the old partner; Plutondo, Erco, Oreton, Avalon and Miaed are the targets; Alerhia is contested with Noris (west of the Gold Road). The Pact can stay a **Pact of Equals** (friendship, stability) or become a **Pact Under the Prince** (protection contracts that make members subjects). **Opens:** at start. **Mutual exclusions:** The Pact of Equals / The Pact Under the Prince. **Mechanic:** `zin_east_lean`, `zin_east_courts_stabilo`, `zin_stabilo_envoys`, `zin_stabilo_open_pact`, `zin_stabilo_pact_under_prince`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `stabilo_pact` | The Stabilo Pact | – | – | 18,0 | 70 | flag zin_east_courts_stabilo (decision category); Lean +10 on Drak; political_power 25 | 40 |
| `friendship_of_drak` | The Friendship of Drak | stabilo_pact | – | 17,1 | 70 | event_for Drak zin_stabilo.6 | 20 |
| `envoys_of_the_pact` | Envoys of the Pact | stabilo_pact | – | 19,1 | 35 | flag zin_stabilo_envoys (Court Gifts); political_power 25 | 20 |
| `pact_council` | The Pact Council | friendship_of_drak | – | 16,2 | 70 | add_spirit pact_council | 12 |
| `prince_blozan` | A Letter to Prince Blozan | friendship_of_drak / envoys_of_the_pact | – | 18,2 | 70 | event_for Plutondo zin_stabilo.7 | 20 |
| `mines_of_erco` | The Mines of Erco | envoys_of_the_pact | – | 20,2 | 70 | event_for Erco zin_stabilo.8 | 15 |
| `open_the_pact` | Open the Pact | pact_council / prince_blozan | – | 17,3 | 70 | flag zin_stabilo_open_pact (Invite to the Pact); political_power 50 | 20 |
| `oreton_and_the_red_lands` | Oreton and the Red Lands | prince_blozan / mines_of_erco | – | 19,3 | 70 | Lean +15 on Oreton; Lean +10 on Avalon | 12 |
| `bargain_with_miaed` | A Bargain with Miaed | mines_of_erco | – | 21,3 | 70 | event_for Miaed zin_stabilo.9 | 12 |
| `pact_garrisons` | Pact Garrisons | open_the_pact | – | 16,4 | 70 | add_spirit pact_garrisons | 10 |
| `marriage_in_the_pact` | A Marriage in the Pact | open_the_pact / oreton_and_the_red_lands | – | 18,4 | 70 | event zin_stabilo.10 | 12 |
| `the_mountain_road` | The Mountain Road to Erco | oreton_and_the_red_lands / bargain_with_miaed | – | 20,4 | 70 | for_country Erco: building infrastructure 1 @capital; Lean +10 on Erco; Inf +5 sand | 10 |
| `pact_of_equals` | The Pact of Equals | pact_garrisons / marriage_in_the_pact | pact_under_the_prince | 17,5 | 70 | call zin_stabilo_pact_lean(10); stability 0.05; political_power 50 | 10; hist ×3; refuser ×2 |
| `pact_under_the_prince` | The Pact Under the Prince | marriage_in_the_pact / the_mountain_road | pact_of_equals | 19,5 | 70 | flag zin_stabilo_pact_under_prince (Offer Protection); war_support 0.05; call zin_stabilo_pact_lean(−5) | 10; ×5 with `zin_rule_ai_east` UNITE_WITHOUT_AFRIT |
| `the_greater_pact` | The Greater Pact | pact_of_equals / pact_under_the_prince | – | 18,6 | 70 | political_power 75; call zin_stabilo_pact_gift | 15 |

### Branch 5: The Shield-Companies

**Purpose:** Stabilo's army is hired. The House of Shindor holds the contracts of the shield-companies; the branch hires sellswords, builds the Arsenal of Fudol, fortifies the march with Noris, and turns hirelings into standing companies. The last two focuses fill the war chest and raise the Army of the Pact when the war is near. **Opens:** at start; The War Chest of the Pact needs `zin_golden_king_dead` or 4A 1752; The Army of the Pact needs a war. **Mutual exclusions:** none. **Mechanic:** opens Wars of the Roads.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `shield_companies` | The Shield-Companies | – | – | 24,0 | 70 | add_spirit shield_companies; army_experience 10 | 30 |
| `hire_the_sellswords` | Hire the Sellswords | shield_companies | – | 23,1 | 35 | manpower 10000; political_power −25 | 15 |
| `general_shindor` | General Hardfic Shindor | shield_companies | – | 25,1 | 35 | call zin_stabilo_honour_hardfic; army_experience 10 | 15 |
| `contracts_of_service` | Contracts of Service | hire_the_sellswords | – | 22,2 | 70 | add_spirit contracts_of_service | 12 |
| `arsenal_of_fudol` | The Arsenal of Fudol | hire_the_sellswords / general_shindor | – | 24,2 | 70 | building arms_factory 2 @capital | 15 |
| `forts_on_the_noris_march` | Forts on the Noris March | general_shindor | – | 26,2 | 70 | call zin_stabilo_fortify_march | 8; ×2 if rivalry ≥ 60 |
| `paid_in_full` | Paid in Full | contracts_of_service / arsenal_of_fudol | – | 23,3 | 70 | equipment infantry_equipment 1500 | 12 |
| `pikes_of_postondoroth` | The Pikes of Postondoroth | arsenal_of_fudol / forts_on_the_noris_march | – | 25,3 | 70 | research [infantry_weapons] 50% ×2 | 10 |
| `foreign_captains` | Foreign Captains | paid_in_full | – | 22,4 | 70 | research [land_doctrine] 50% ×1; army_experience 10 | 10 |
| `siege_engineers` | Siege Engineers | paid_in_full / pikes_of_postondoroth | – | 24,4 | 70 | research [artillery] 50% ×1; research [cat_fortification] 50% ×1 | 8 |
| `the_desert_shield` | The Desert Shield | pikes_of_postondoroth | – | 26,4 | 70 | add_spirit desert_shield | 10 |
| `standing_companies` | The Standing Companies | foreign_captains / siege_engineers | – | 23,5 | 70 | swap_spirit shield_companies→standing_companies | 10 |
| `war_chest_of_the_pact` | The War Chest of the Pact | siege_engineers / the_desert_shield | – | 25,5 | 35 | Avail: `zin_golden_king_dead` or after 1752.3.1; political_power 50; war_support 0.05 | 10; 0 hist before 1754.3.1 |
| `army_of_the_pact` | The Army of the Pact | standing_companies + war_chest_of_the_pact | – | 24,6 | 70 | Avail: at war, or `zin_war_of_last_crowns`; manpower 15000; equipment infantry_equipment 2500 | 200 when available |

### Branch 6: The Temple Accounts

**Purpose:** a merchant prince reads the temples' books. He may **partner** the temple banks (stability, relief houses, deeper footholds, their loans for his roads) or **audit** them (political power, auditors at court, fewer footholds, and debtors who owe Postondoroth rather than the temples). **Opens:** at start. **Mutual exclusions:** Partners of the Temple Banks / Audit the Temples. **Mechanic:** `zin_footholds` via `zin_afrit_add_footholds`; temple loans (`zin_east.30`); `zin_stabilo_audit` (no temple loans while set).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `temple_accounts` | The Temple Accounts | – | – | 28,0 | 35 | event zin_stabilo.11; political_power 25 | 15 |
| `partners_of_the_temple_banks` | Partners of the Temple Banks | temple_accounts | audit_the_temples | 27,1 | 70 | Footholds +1; add_spirit temple_partners | 10; ×2 if `zin_east_in_crisis` |
| `audit_the_temples` | Audit the Temples | temple_accounts | partners_of_the_temple_banks | 29,1 | 70 | Footholds −1; flag zin_stabilo_audit; political_power 50; stability −0.02 | 10; ×2 with `zin_stabilo_ledger_open` |
| `relief_houses_of_fudol` | The Relief Houses of Fudol | partners_of_the_temple_banks | – | 27,2 | 70 | stability 0.05 | 10 |
| `the_princes_auditors` | The Prince's Auditors | audit_the_temples | – | 29,2 | 70 | add_spirit princes_auditors | 10 |
| `temple_loans_for_the_roads` | Temple Loans for the Roads | relief_houses_of_fudol | – | 27,3 | 35 | event zin_east.30 (the offer arrives at once); Inf +5 gold; Inf +5 sand | 8 |
| `close_the_books_to_the_temples` | Close the Books to the Temples | the_princes_auditors | – | 29,3 | 70 | call zin_stabilo_debtor_lean(5); political_power 25 | 8 |
| `faith_and_interest` | Faith and Interest | temple_loans_for_the_roads / close_the_books_to_the_temples | – | 28,4 | 70 | political_power 50; stability 0.03 | 8 |

### The Reckoning of the East

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `reckoning_of_the_east` | The Reckoning of the East | prince_and_houses / creditor_of_kings / prince_of_the_caravans / the_greater_pact | – | 14,7 | 35 | Avail: check `zin_east_question_open`; event zin_stabilo.13; tooltip "Opens three answers." | hist: 0 before `zin_afrit_king_of_east`, then 500; free: 100 when available |

### Branch 7: Treasurer of the East

**Purpose:** Stabilo finances the King of the East. Before the proclamation it pledges itself to the generous friends; after it, Stabilo kneels with its ledgers open, pays the eastern host, turns the debts of refusing courts into claims, and mints the King's coin. When the King falls, the books must be closed. **Opens:** from the Reckoning, with footholds 3 or more. **Mutual exclusions:** the route focus excludes the other two routes. **Mechanic:** `zin_east_pledged`, `zin_afrit.51` and `zin_east_prepare_kneel`, `zin_east.52` (gold counts double with `zin_stabilo_pays_host`).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `treasurer_of_the_east` | Treasurer of the East | reckoning_of_the_east | paymaster_of_the_free_crowns, prince_of_all_roads | 3,8 | 70 | Avail: footholds ≥ 3; not refuser; flag zin_east_pledged; flag zin_stabilo_route_treasurer; Footholds +1; political_power 50 | hist: 1000 if client, else 0; free: 10 × footholds + bias ÷ 2 |
| `gold_for_the_deliverer` | Gold for the Deliverer | treasurer_of_the_east | – | 2,9 | 35 | political_power −50; for_country Worshipdom: political_power 100; tooltip "The temples will remember." | 50 |
| `contracts_with_the_temple` | Contracts with the Temple | treasurer_of_the_east | – | 4,9 | 70 | Bonus +0.25; political_power 25 | 50 |
| `kneel_with_open_ledgers` | Kneel with Open Ledgers | gold_for_the_deliverer / contracts_with_the_temple | – | 3,10 | 35 | Avail: `zin_afrit_king_of_east`; not `zin_afrit_dead`; not refuser; if not client: `country_event zin_afrit.51`; add_spirit treasury_of_the_east | 500 when available |
| `paymaster_of_the_host` | Paymaster of the Eastern Host | kneel_with_open_ledgers | – | 2,11 | 70 | Avail: client; flag zin_stabilo_pays_host; equipment infantry_equipment 2000 | 60 |
| `debts_of_the_refusers` | The Debts of the Refusers | kneel_with_open_ledgers | – | 4,11 | 70 | Avail: client; at war with a country with `zin_east_free_crown`; call zin_stabilo_seize_refuser_debts | 60 when available |
| `the_kings_mint` | The King's Mint | paymaster_of_the_host / debts_of_the_refusers | – | 3,12 | 70 | Avail: `zin_afrit_returned` or `zin_afrit_claims_erdae`; political_power 100; add_spirit kings_mint | 100 when available |
| `close_the_kings_books` | Close the King's Books | the_kings_mint | – | 3,13 | 35 | Avail: `zin_afrit_dead`; remove_spirit treasury_of_the_east; remove_spirit kings_mint; political_power 50; tooltip "Postondoroth must answer for its loans." | 500 when available |

### Branch 8: Paymaster of the Free Crowns

**Purpose:** Stabilo refuses the King of the East and pays for those who refuse with it. It closes the temple accounts, subsidises its debtors, arms the elven realms across the rift, buys off the coalition, leads or funds the Free Crowns, and lets its companies serve the stranger's coalition. **Opens:** from the Reckoning. **Mutual exclusions:** the route focus excludes the other two routes. **Mechanic:** `zin_stabilo_route_free` (bias −100, coalition weight −100), `zin_east_free_crowns_leader`, `zin_east_grant_free_cb`, `zin_east_offer_coalition_peace`, `zin_east_companies_with_eindil`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `paymaster_of_the_free_crowns` | Paymaster of the Free Crowns | reckoning_of_the_east | treasurer_of_the_east, prince_of_all_roads | 9,8 | 70 | flag zin_stabilo_route_free; Footholds −1; political_power 50 | hist: 1000 if refuser or neither client nor refuser, else 0; free: 60 − 10 × footholds − bias ÷ 2 |
| `close_the_temple_accounts` | Close the Temple Accounts | paymaster_of_the_free_crowns | – | 7,9 | 35 | Avail: `zin_afrit_revealed` or has `zin_afrit_suspicious`; call zin_afrit_purge_houses | 100 when available |
| `subsidies_for_the_courts` | Subsidies for the Courts | paymaster_of_the_free_crowns | – | 9,9 | 70 | call zin_stabilo_subsidise; political_power −50 | 50 |
| `arms_for_the_elder_groves` | Arms for the Elder Groves | paymaster_of_the_free_crowns | – | 11,9 | 70 | Avail: `zin_eastern_invasion`; not `zin_east_coalition_member`; call zin_stabilo_arm_the_groves | 60 when available |
| `the_free_crowns_purse` | The Free Crowns' Purse | subsidies_for_the_courts | – | 8,10 | 70 | Avail: `zin_afrit_king_of_east`; not client; if not refuser: flag zin_afrit_refused_east; if no country has `zin_east_free_crowns_leader`: flag zin_east_free_crowns_leader and event zin_east.51; add_spirit free_crowns_purse | 500 when available |
| `buy_off_the_coalition` | Buy Off the Coalition | subsidies_for_the_courts / arms_for_the_elder_groves | – | 10,10 | 70 | Avail: `zin_eastern_invasion`; not `zin_east_coalition_member`; call zin_east_offer_coalition_peace; call zin_stabilo_buy_off; political_power −75 | 60 when available |
| `war_for_the_free_crowns` | War for the Free Crowns | the_free_crowns_purse | – | 8,11 | 70 | Avail: `zin_afrit_king_of_east`; not `zin_afrit_dead`; call zin_east_grant_free_cb; war_support 0.10 | 100 when available |
| `companies_for_the_stranger` | Companies for the Stranger | buy_off_the_coalition | – | 10,11 | 70 | Avail: `zin_eindil_returned`; flag zin_east_companies_with_eindil; army_experience 15 | 200 when available |
| `the_free_roads` | The Free Roads | war_for_the_free_crowns / companies_for_the_stranger | – | 9,12 | 70 | Avail: `zin_afrit_dead`, or no East Lands country is a member of the Worshipdom's faction; add_spirit free_roads; tooltip "An outcome of this game, not history." | 100 when available |

### Branch 9: The Prince of All Roads

**Purpose:** the proposed outcome of a united East, Stabilo's way: by purchase. Postondoroth buys every charter, sells protection contracts, turns deep debtors into vassals, crowns the Ledger, asks the great kingdoms to sign, and refuses credit to the King of the East. **Opens:** from the Reckoning when `zin_east_dominance` ≥ 10 or The Greater Pact is done. **Mutual exclusions:** the route focus excludes the other two routes. **Mechanic:** `zin_stabilo_route_empire` (bias −50; protection at lean 60), `zin_east_grant_high_king_cb`, `zin_east.73`, `zin_east_declare_united`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `prince_of_all_roads` | The Prince of All Roads | reckoning_of_the_east | treasurer_of_the_east, paymaster_of_the_free_crowns | 17,8 | 70 | Avail: `zin_east_dominance` ≥ 10 or focus the_greater_pact done; flag zin_stabilo_route_empire; add_spirit princes_ambition | hist 0 (PLAUSIBLE 10); UNITE rule 1000 if chosen; free: dominance × 3 + total debt ÷ 50 |
| `buy_the_charters` | Buy the Charters | prince_of_all_roads | – | 16,9 | 70 | call zin_east_add_all_roads(10); Rivalry +10; political_power −50 | 50 |
| `protection_contracts` | Protection Contracts | prince_of_all_roads | – | 18,9 | 35 | political_power 25; tooltip "Courts at lean 60 may be offered protection." | 50 |
| `vassals_by_contract` | Vassals by Contract | buy_the_charters | – | 15,10 | 70 | call zin_stabilo_debt_vassals | 40 |
| `the_crowned_ledger` | The Crowned Ledger | buy_the_charters / protection_contracts | – | 17,10 | 70 | event zin_stabilo.12; political_power 100; stability 0.05 | 50 |
| `the_princes_due` | The Prince's Due | protection_contracts | – | 19,10 | 70 | Avail: `zin_war_of_last_crowns` or `zin_afrit_king_of_east`; call zin_east_grant_high_king_cb; war_support 0.05 | 80 when available |
| `the_great_kingdoms_sign` | The Great Kingdoms Sign | vassals_by_contract / the_crowned_ledger | – | 16,11 | 70 | call zin_stabilo_ask_homage | 60 |
| `no_credit_for_a_god_king` | No Credit for a God-King | the_crowned_ledger / the_princes_due | – | 18,11 | 70 | Avail: `zin_afrit_king_of_east`; not `zin_afrit_dead`; call zin_east_grant_free_cb; war_support 0.05 | 100 when available |
| `one_east_under_postondoroth` | One East Under Postondoroth | the_great_kingdoms_sign / no_credit_for_a_god_king | – | 17,12 | 70 | Avail: `zin_east_dominance` ≥ 50; not client; call zin_east_declare_united; remove_spirit princes_ambition; tooltip "An outcome of this game, not history." | 500 when available |

### Branch 10: Wars of the Roads

**Purpose:** Stabilo's two possible wars of its own. **The Caravan War** with Noris, only through the mechanic's gate, claims the Salt Road and ends in terms at Postondoroth. **The rift coalition**: if Stabilo joined the eastern coalition, its companies cross the rift, claim spoils for the Ledger, march toward Parim, and are called back when the dead and Volgan's hosts make the war unprofitable. **Opens:** The War Chest of the Pact; each line needs its story flags. **Mutual exclusions:** none. **Mechanic:** `zin_east_caravan_war_open`, `zin_cb_caravan_roads`, `zin_east_claim_road`, `zin_east.26`, `zin_east_coalition_member`, `zin_east_claim_rift`, `zin_east_turns_west`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `close_the_roads_to_noris` | Close the Roads to Noris | war_chest_of_the_pact | – | 23,7 | 35 | Avail: check `zin_east_caravan_war_open`; call zin_diplo_grant_cb(cb=zin_cb_caravan_roads, target=Noris, days=365); Rivalry +5 | hist: 0 unless `zin_war_of_last_crowns` and Noris and Stabilo stand on opposite sides of the King of the East, then 50; free: 15, ×3 at rivalry ≥ 90 |
| `seize_the_salt_road` | Seize the Salt Road | close_the_roads_to_noris | – | 22,8 | 70 | Avail: at war with Noris; call zin_east_claim_road(road=salt) | 100 when available |
| `terms_at_postondoroth` | Terms at Postondoroth | seize_the_salt_road | – | 23,9 | 35 | Avail: at war with Noris; check zin_stabilo_holds_salt_road; event_for Noris zin_east.26 | 200 when available |
| `answer_the_coalition` | Answer the Eastern Coalition | standing_companies / war_chest_of_the_pact | – | 27,7 | 35 | Avail: flag `zin_east_coalition_member`; war_support 0.05; army_experience 10 | 300 when available |
| `spoils_for_the_ledger` | Spoils for the Ledger | answer_the_coalition | – | 28,8 | 70 | Avail: at war with a Magical Lands realm; call zin_east_claim_rift; political_power 25 | 80 when available |
| `the_road_to_parim` | The Road to Parim | answer_the_coalition / spoils_for_the_ledger | – | 27,9 | 70 | Avail: `zin_east_turns_west`; war_support 0.05; army_experience 15 | 80 when available |
| `call_back_the_companies` | Call Back the Companies | the_road_to_parim | – | 27,10 | 35 | Avail: at war with a Magical Lands or Middle Lands country; call zin_stabilo_withdraw_from_rift; manpower 10000; tooltip "Some contracts will never be paid." | 0 before `zin_zol_rising` or `zin_volgan_marches`; then 40, ×3 if Stabilo is a refuser |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/focus/stabilo.json` | Tree data (source of truth) |
| `common/national_focus/zin_stabilo.txt` | Compiled tree; `country = { factor = 0 modifier = { add = 10 zin_is_stabilo = yes } }` |
| `common/ideas/zin_focus_stabilo.txt` | Spirits below, plus `zin_stabilo_credit` (the ledger's loan idea, given to debtors) |
| `common/dynamic_modifiers/zin_stabilo.txt` | `zin_stabilo_ledger_income` |
| `events/zin_stabilo.txt` | Namespace `zin_stabilo`; effect-triggered only |
| `common/scripted_effects/zin_stabilo.txt` | Tree effects below |
| `common/scripted_triggers/zin_stabilo.txt` | Tree triggers below |
| `localisation/english/zin_focus_stabilo_l_english.yml` | All text |

The ledger's decisions live in the mechanic's decision file under category `zin_east_ledger`. The mechanic's effects, triggers, decisions and events (`zin_east_*`) are only called here. Stabilo's ruler and councillors come from the characters spec; this tree adds no new character.

### Variables and flags

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_stabilo_debt` | variable on each East Lands court, 0–100 | Debt to Stabilo (start: Drak 20, Plutondo 10, Mostok 10) |
| `zin_stabilo_ledger_total` | Stabilo variable | Sum of all debts |
| `zin_stabilo_ledger_pp`, `zin_stabilo_ledger_trade` | Stabilo variables | Inputs of `zin_stabilo_ledger_income` |
| `zin_stabilo_route_treasurer`, `zin_stabilo_route_free`, `zin_stabilo_route_empire` | Stabilo flags | Route chosen (the mechanic reads the last two) |
| `zin_stabilo_audit` | Stabilo flag | No temple loans to Stabilo |
| `zin_stabilo_ledger_open`, `zin_stabilo_loans_to_kings`, `zin_stabilo_collect`, `zin_stabilo_rival_banks`, `zin_stabilo_envoys`, `zin_stabilo_open_pact`, `zin_stabilo_pact_under_prince`, `zin_stabilo_pays_host` | Stabilo flags | Unlocks and markers |
| `zin_stabilo_cannot_pay` | court flag, 730 days | Stops `zin_stabilo.32` repeating for that court |
| `zin_stabilo_bought_off` | court flag | Set by Buy Off the Coalition; raises the court's peace chance in `zin_east.45` by 20 |

### Tree-declared scripted effects and triggers

| Name | Kind | Does |
| --- | --- | --- |
| `zin_stabilo_add_debt` (`value`) | effect, court scope | Adds, clamps 0–100 |
| `zin_stabilo_monthly` | effect | Interest, ledger total, income values, `zin_stabilo.32` checks; called by `zin_east_monthly` |
| `zin_stabilo_south_lean` (`value`) | effect | `zin_east_add_lean(−value)` on every `zin_east_is_south_court` court |
| `zin_stabilo_pact_lean` (`value`) | effect | `zin_east_add_lean(−value)` on every member of Stabilo's faction |
| `zin_stabilo_pact_gift` | effect | Every Stabilo faction member: political power +25, opinion of Stabilo +10, debt −10 |
| `zin_stabilo_debtor_lean` (`value`) | effect | `zin_east_add_lean(−value)` on every court with debt ≥ 20 |
| `zin_stabilo_insure_roads` | effect | Influence +5 on every road whose charter Stabilo holds; +3 on the others |
| `zin_stabilo_debt_tribute` | effect | Every court with debt ≥ 40 sends 300 infantry equipment to Stabilo; its debt −10 |
| `zin_stabilo_creditor` | effect | Every court with debt ≥ 50: lean +10 toward Stabilo |
| `zin_stabilo_honour_hardfic` | effect | `add_skill_level` 1 to `zin_stabilo_hardfic` if he serves Stabilo |
| `zin_stabilo_fortify_march` | effect | Bunker +1 in up to three Stabilo states that border a Noris state |
| `zin_stabilo_subsidise` | effect | Every court with debt ≥ 20: debt −10, lean +10 toward Stabilo |
| `zin_stabilo_arm_the_groves` | effect | The Magical Lands realm with the most `zin_is_site_rift_west` states at war with a coalition member receives 1,000 infantry equipment from Stabilo's stockpile (`send_equipment` if available, else `add_equipment_to_stockpile` on the target and a matching removal) |
| `zin_stabilo_buy_off` | effect | Every coalition member with debt ≥ 30: debt −20 and its AI chance to make peace in `zin_east.45` +20 (country flag `zin_stabilo_bought_off`, read by that event) |
| `zin_stabilo_seize_refuser_debts` | effect | Every free crown at war with Stabilo with debt ≥ 30: `add_state_claim` on its road states |
| `zin_stabilo_debt_vassals` | effect | Every court with debt ≥ 70 and lean ≤ −40: `zin_east.71` (protection offer) |
| `zin_stabilo_ask_homage` | effect | `zin_east.73` to Alerhia, Miaed, Erco and Plutondo where they exist and are not Stabilo's subjects |
| `zin_stabilo_withdraw_from_rift` | effect | `white_peace` with every enemy whose capital is in the Magical or Middle Lands |
| `zin_stabilo_holds_salt_road` | trigger | Stabilo and its subjects control 3 or more `zin_is_site_road_salt` states |

### Spirits

Ids are `zin_stabilo_<key>`. Every modifier key exists in the game's modifier documentation.

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `princes_household` | The Prince's Household | political_power_gain 0.10, trade_opinion_factor 0.05 | The Prince of Postondoroth; permanent |
| `contract_courts` | The Contract Courts | stability_factor 0.03, consumer_goods_factor -0.02 | The Contract Courts |
| `princes_purse` | The Prince's Purse | political_power_factor 0.10, stability_factor -0.03 | The Prince's Purse |
| `council_of_houses` | The Council of Houses | stability_factor 0.08, political_power_gain -0.05 | The Council of Houses |
| `letters_of_credit` | Letters of Credit | trade_opinion_factor 0.10, consumer_goods_factor -0.02 | Letters of Credit (with Bonus +0.25) |
| `great_ledger` | The Great Ledger | political_power_gain 0.10, production_factory_max_efficiency_factor 0.05 | The Great Ledger |
| `fortified_caravanserais` | Fortified Caravanserais | army_core_defence_factor 0.05, supply_consumption_factor -0.05 | Fortified Caravanserais |
| `prince_of_caravans` | Prince of the Caravans | trade_opinion_factor 0.10, production_speed_buildings_factor 0.10, consumer_goods_factor -0.03 | Prince of the Caravans (with Bonus +0.5) |
| `pact_council` | The Pact Council | opinion_gain_monthly_factor 0.15, improve_relations_maintain_cost_factor -0.20 | The Pact Council |
| `pact_garrisons` | Pact Garrisons | army_core_defence_factor 0.05, army_defence_factor 0.03 | Pact Garrisons |
| `shield_companies` | The Shield-Companies | training_time_army_factor -0.10, experience_gain_army_factor 0.05 | The Shield-Companies; swapped by The Standing Companies |
| `standing_companies` | The Standing Companies | army_org_factor 0.05, training_time_army_factor -0.10, army_defence_factor 0.03 | The Standing Companies |
| `contracts_of_service` | Contracts of Service | army_morale_factor 0.05, land_reinforce_rate 0.02 | Contracts of Service |
| `desert_shield` | The Desert Shield | army_core_defence_factor 0.10, heat_attrition_factor -0.20 | The Desert Shield |
| `temple_partners` | Partners of the Temple Banks | stability_factor 0.05, political_power_gain -0.03 | Partners of the Temple Banks; removed by Close the Temple Accounts |
| `princes_auditors` | The Prince's Auditors | enemy_operative_detection_chance_factor 0.10, political_power_gain 0.05 | The Prince's Auditors |
| `treasury_of_the_east` | Treasury of the East | political_power_gain 0.10, war_support_factor 0.05, consumer_goods_factor -0.02 | Kneel with Open Ledgers; removed by Close the King's Books or `zin_afrit_dead` |
| `kings_mint` | The King's Mint | political_power_gain 0.15, stability_factor 0.03 | The King's Mint; removed by Close the King's Books |
| `free_crowns_purse` | The Free Crowns' Purse | opinion_gain_monthly_factor 0.15, political_power_gain 0.05 | The Free Crowns' Purse; replaced by The Free Roads |
| `free_roads` | The Free Roads | stability_factor 0.08, trade_opinion_factor 0.10 | The Free Roads (removes free_crowns_purse) |
| `princes_ambition` | The Prince's Ambition | political_power_gain 0.10, justify_war_goal_time -0.20 | The Prince of All Roads; removed by One East Under Postondoroth |
| `credit` | Credit from Postondoroth | political_power_gain 0.10, consumer_goods_factor -0.02 | On a debtor court, 365 days, from `zin_stabilo.30` (compiled id `zin_stabilo_credit`) |

The mechanic adds its own ideas to Stabilo when they apply (`zin_east_temple_loan`, `zin_east_coalition_ambition`, `zin_east_free_crowns`, `zin_east_shared_roads`, `zin_east_caravan_war_strain`, `zin_east_kings_debt`, `zin_east_vindicated`, `zin_east_united_crown`).

### Dynamic modifier

| Key | Modifiers (variable-valued) |
| --- | --- |
| `zin_stabilo_ledger_income` | political_power_gain = `zin_stabilo_ledger_pp`; trade_opinion_factor = `zin_stabilo_ledger_trade` |

### Events (namespace `zin_stabilo`)

All are fired by focus, decision, option or tree-effect calls; none has its own trigger. Text before `zin_afrit_revealed` never names Afrit.

| Id | Title | For | Fired by | Options (effects; AI) |
| --- | --- | --- | --- | --- |
| .1 | The Merchant Houses | Stabilo | The Merchant Houses | "The Prince keeps the keys" (political_power 50) / "The houses share the table" (stability 0.03); AI 60/40 |
| .3 | The Houses Vote | Stabilo | The Houses Vote | Vote for roads (Inf +5 on every road) / Vote for credit (Debt +5 on Drak; political_power 25) / Vote for companies (army_experience 10); AI 40/40/20 |
| .4 | The Prince and the Houses | Stabilo | The Prince and the Houses | The houses and the prince sign a charter of duties. "Sealed" (stability 0.03) |
| .5 | The Wells of Obmi | Obmi | The Wells of Obmi | Lease the wells to Postondoroth (Lean +15 toward Stabilo; Stabilo Inf +10 sand) / The wells are ours (lean −5 toward Stabilo); AI chance = 50 − lean |
| .21 | Obmi's Answer | Stabilo | option of .5 | Result text |
| .6 | The Friendship of Drak | Drak | The Friendship of Drak | Renew the Pact (Lean +15 toward Stabilo; Stabilo ↔ Drak opinion +15) / Ask Postondoroth to forgive our debt (debt −15; Lean +5 toward Stabilo); AI 60/40 |
| .22 | Drak's Answer | Stabilo | option of .6 | Result text |
| .7 | A Letter from Postondoroth | Plutondo | A Letter to Prince Blozan | Accept the Pact's friendship (Lean +15 toward Stabilo) / Ask for a loan first (Debt +10; political_power 50 for Plutondo) / Keep our distance (lean −5 toward Stabilo); AI by lean |
| .23 | Plutondo's Answer | Stabilo | option of .7 | Result text |
| .8 | The Mines of Erco | Erco | The Mines of Erco | Sell ore to the Pact (Lean +15 toward Stabilo; Erco political_power 25) / The mountains keep their own (lean −5 toward Stabilo); AI chance = 40 − lean |
| .24 | Erco's Answer | Stabilo | option of .8 | Result text |
| .9 | A Bargain with Miaed | Miaed | A Bargain with Miaed | Open the passes to Pact caravans (Lean +15 toward Stabilo; Stabilo Inf +10 sand) / The passes stay closed (lean −5 toward Stabilo); AI chance = 50 − lean |
| .25 | Miaed's Answer | Stabilo | option of .9 | Result text |
| .10 | A Marriage in the Pact | Stabilo | A Marriage in the Pact | A daughter of Drak's royal house (Lean +20 toward Stabilo on Drak) / A prince of Plutondo (Lean +20 toward Stabilo on Plutondo) / A daughter of the House of Azano (stability 0.03; political_power 25); AI 40/40/20 |
| .11 | The Temple Accounts | Stabilo | The Temple Accounts | The temple banks offer the prince a partnership in the caravan trade. "Consider it" (political_power 25) / "Send them the auditors' compliments" (stability −0.01; political_power 25) |
| .12 | The Crowned Ledger | Stabilo | The Crowned Ledger | The prince is crowned on the counting-table of Postondoroth. "Long live the Prince of All Roads" (war_support 0.05) |
| .13 | The Reckoning of the East | Stabilo | The Reckoning of the East | Council debate; shows rivalry, dominance, total debt and footholds. "The prince will answer" |
| .30 | A Loan from Postondoroth | target court | `zin_stabilo_lend`, `zin_stabilo_great_loan` | Accept (effects per decision) / Decline; AI as in the ledger section |
| .31 | Postondoroth Calls In a Debt | target court | `zin_stabilo_call_in_debt` | Pay in gold / Pay in kind / Default; AI: gold if political power ≥ 100, kind if it has 1,000 infantry equipment spare, else default |
| .32 | A Debtor Cannot Pay | Stabilo | `zin_stabilo_monthly`, a court at debt ≥ 90 | Restructure / Press for payment / Forgive; AI 60/20/20 |
| .33 | A Court Defaults | Stabilo | default option of .31 | Acknowledge; if a peace gate is open, a claim on one road state of the defaulter |

### Data checks for this tree

- 111 focuses; unique keys; unique (x,y); x from 0 to 29; every focus's y is greater than the y of each of its prerequisites.
- Exclusive pairs: princes_purse / council_of_houses; pact_of_equals / pact_under_the_prince; partners_of_the_temple_banks / audit_the_temples; the three route focuses. The compiler makes them symmetric.
- Days are 35 or 70.
- `raw` blocks: none planned.
- Every `call` and `check` names an effect or trigger defined here, in the mechanic spec, the Afrit spec (`zin_afrit_add_footholds`, `zin_afrit_purge_houses`), or the diplomacy spec (`zin_diplo_grant_cb`).

## AI

### Historical route (4A 1748 to 4A 1760)

Under the historical path the AI follows the weights marked "hist". Which answer Stabilo gives the King of the East is not fixed: it treasures him only if the Afrit spec's offer made Stabilo a client; otherwise it pays for the Free Crowns. The windows are targets for the test run.

| Window | Focuses (in order) | Story beats |
| --- | --- | --- |
| Thaw 1748 – Harvest 1748 | The Merchant Houses, The Ledger of the East, The Southern Roads | Peace; first loans (Drak, Mostok) |
| Fallowing 1748 – Ironfrost 1749 | The Stabilo Pact, The Bankers of Fudol, The Sand Road Charter, The Prince of Postondoroth | The Sand Road contested |
| Rainwake 1749 – Deepwinter 1750 | Letters of Credit, The Friendship of Drak, Envoys of the Pact, The Shield-Companies, The Temple Accounts, then Partners or Audit (Audit ×2 once the Ledger is open) | Stabilo usually wins the Sand Road charter |
| Ironfrost 1750 – Mistfall 1750 | A Letter to Prince Blozan, Loans to the Kings, The Counting Houses, The Prince's Purse | Mistfall: the Golden King dies; great loans to Alerhia or Plutondo |
| Longnight 1750 – Highsun 1752 | Minted Crowns, The Law of the Scales, Open the Pact, Caravanserais of the Gold Road, Hire the Sellswords, The Arsenal of Fudol, Desert Patrols | Plutondo or Oreton joins the Pact |
| Goldfield 1752 – Longnight 1753 | Collect the Debts, The Interest of Peace, The Mines of Erco, Oreton and the Red Lands, West to Alerhia, The Wells of Obmi, The Prince and the Houses | Rivalry 50–60; Trouble at the Wells |
| 1754 | The Pact of Equals, Pact Garrisons, Rivals of the Temple Banks, The Great Ledger, Contracts of Service, Paid in Full, The War Chest of the Pact (after Thaw 1754) | Envoys speak of the rift |
| 1755 | Creditor of Kings, Foreign Captains, The Standing Companies, The Army of the Pact (on `zin_war_of_last_crowns`); Answer the Eastern Coalition if Stabilo joined | The coalition crosses the rift |
| 1756 | The Reckoning of the East (after `zin_afrit_king_of_east`); Treasurer of the East → Kneel with Open Ledgers (client) **or** Paymaster of the Free Crowns → Subsidies for the Courts, The Free Crowns' Purse (refuser) | The King of the East is proclaimed |
| 1757 | Client: Paymaster of the Eastern Host, The Debts of the Refusers. Refuser: War for the Free Crowns, Buy Off the Coalition, Companies for the Stranger (on `zin_eindil_returned`). Either: Call Back the Companies once the dead and Volgan's hosts strike | Eindil returns |
| 1758 | Client: The King's Mint. Refuser: Close the Temple Accounts (after the reveal), Arms for the Elder Groves | The King's host marches west |
| 1759–1760 | Client: Close the King's Books. Refuser: The Free Roads. Remaining roads and ledger focuses | Afrit dies; the East is divided |

The Caravan War line is taken under the historical path only if Noris and Stabilo stand on opposite sides of the King of the East after `zin_war_of_last_crowns`.

### Alternative routes

| Route | How the AI gets there | Key choices |
| --- | --- | --- |
| **Paymaster** (`zin_rule_ai_east` REFUSE_AFRIT, or FREE with low footholds) | Audit the Temples; Rivals of the Temple Banks; The Pact of Equals; Paymaster as soon as the Reckoning opens | Arms for the Elder Groves and Buy Off the Coalition during the invasion |
| **Prince of All Roads** (`zin_rule_ai_east` UNITE_WITHOUT_AFRIT when Stabilo has the higher dominance; FREE with high dominance and total debt ≥ 200) | The Prince's Purse; The Pact Under the Prince; great loans to the four kingdoms | Vassals by Contract; The Prince's Due in the war; One East Under Postondoroth at dominance ≥ 50 |
| **Treasurer** (FREE with footholds ≥ 4 and bias ≥ 30) | Partners of the Temple Banks; Temple Loans for the Roads | Treasurer of the East before the proclamation; kneels at once |
| **Player** | Any order; the Reckoning opens with the King of the East, the invasion, or after 1753 once the King is dead | War focuses still wait for story flags and the peace gates |

### General AI notes

- Before 4A 1750 the AI weights only house, ledger, road, pact and hiring focuses.
- The AI lends to at most one court every 90 days and keeps 50 political power in reserve; it calls in debts only below 50 political power.
- The AI never takes A Bid for the Rift Road while rivalry is 70 or more under the historical path.

## Acceptance

1. The compiler accepts `stabilo.json`: 111 focuses, unique positions, prerequisites above their focuses, symmetric exclusions, days multiples of 7, no unknown modifier, effect or trigger.
2. The HOI4 Agent Tools focus inspector reports no errors; the focus renderer's review image shows ten readable branches within 30 columns.
3. On 1 Thaw 4A 1748 no available focus can create a war goal, a claim or a war (offline scan).
4. Start debts: Drak 20, Plutondo 10, Mostok 10; ledger income follows the total; interest adds 0.2 a month; `zin_stabilo.32` fires at 90 and not again for that court within 730 days.
5. The Reckoning of the East is unavailable on day one and opens on `zin_afrit_king_of_east`, on `zin_eastern_invasion`, or after 1 Thaw 4A 1753 once `zin_golden_king_dead` is set.
6. Historical AI run: Stabilo takes exactly one route focus in 4A 1756; it is Treasurer of the East if and only if Stabilo is a client, else Paymaster of the Free Crowns; Stabilo does not fight Noris before `zin_war_of_last_crowns`.
7. UNITE_WITHOUT_AFRIT run where Stabilo has the higher dominance: Stabilo takes The Prince of All Roads and reaches The Prince's Due.
8. No text reachable before `zin_afrit_revealed` names Afrit (compiler secret check); no text uses "Sunhot" as a place.
9. All 22 spirits load; every modifier key is in the game's modifier documentation.

## Open questions

1. Are the houses (the Prince's own, Azano, Shindor) and the Guild of Scales acceptable, named after the proposed characters, or does the owner have Stabilo's great families in mind?
2. Should Stabilo's lending compete openly with the temples (Rivals of the Temple Banks), or would the owner rather keep the Deliverer's friends unopposed in the East?
3. Postondoroth is today a victory point in Drak's land (map spec S5). If it stays there, should the tree gain a focus to buy or reclaim the old seat from Drak?
4. Is "The Prince of All Roads" a good title for a Stabilo that unites the East?
5. Should debt ever let Stabilo annex a court outright, or only make it a subject (as here)?
