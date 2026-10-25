# Shared tree: the delving holds

**Status:** Proposed. Written 24 October 2026 by the shared-trees subagent while the owner was away; not yet reviewed by the lead or the owner. Every focus, spirit, event, number and name below that is not cited to the vault or the roster is proposed. **Priority:** 6. **Phase:** 6 (tier C).

## Purpose

One focus tree for the four dwarf holds of Aoaz: Kunhrim in the Great Wall range (Middle Lands), Hrakbrund in the High Mountains (North Lands), and Brundahrim and Gromkerm in the western ranges (West Lands). A hold is a small, rich, closed realm of one to three mountain states that sells iron, gold and black powder to the crowns of men at its outer gate and lets no man further in. The tree lets each hold decide who speaks for it, how it trades, how deep it delves, what its powder is for, how its axe-companies fight and whether the old grudge against elves is kept, and gives each hold its own branch where its lore differs: the Iron Charter of Kunhrim, the Hill Pact of Hrakbrund, the fire-hold of Brundahrim and the old hold of Gromkerm.

| Item | Value |
| --- | --- |
| Tree id | `shared_delving_holds` (focus ids `zin_shared_delving_holds_<key>`) |
| Tier | C, shared (01_tiers: 40 to 70 focuses); 69 focuses |
| Countries | Kunhrim (KUN), Hrakbrund (HRA), Brundahrim (BRU), Gromkerm (GRO); `focusTree` of each in `tools/content/data/world/roster.json` |
| What one hold sees | the 33 shared focuses and its own 9: 42 |
| Columns, rows | 0 to 25, 0 to 10 (shared rows 0 to 4, hold branches rows 6 to 10) |
| Events | namespace `zin_shared_delving_holds`, ids 1 to 4 |
| Spirits | 23 (`zin_shared_delving_holds_<key>`) |
| Data | `docs/design/focus/shared_delving_holds.json` |
| Built by | `tools/content/modules/focus_compiler.mjs` ([../00_format_and_compiler.md](../00_format_and_compiler.md)) |

### The exception to one shared tree per region

[01_tiers_and_coverage.md](../01_tiers_and_coverage.md) assigns one shared tree to each region. This tree spans three regions. The roster report accepts this exception ([docs/design/roster.md](../../../design/roster.md) section 5: "The dwarf tree breaks the tier spec's rule of one shared tree per region; the alternative is one module in each of three regional shared trees"), and this spec records it: the four holds share one people, one faith (the Deep Reckoning), one calendar (the Delving Count), one political form (the hold) and one secret (black powder), so one tree with four hold branches reads better than three dwarf modules scattered through the trees of men. The compiler's coverage check counts countries, not regions, so the exception needs no compiler change. The tiers spec's table must be regenerated with this tree (handoff).

### The holds at the start (roster and histories)

| Hold | Region | Capital | Ruler (characters file) | Overlord | Ideology at start | Note |
| --- | --- | --- | --- | --- | --- | --- |
| Kunhrim | Middle Lands | Hrakkerm | Stulmar of the Kramast, Lord of the Deep Hall | Aenor (chartered dominion, one charter-seat, K36) | Wild (Freeholds) | Iron Charter of 4A 3; Lamp Truce of 4A 96; Powder Compact of 4A 1612 |
| Hrakbrund | North Lands | Ilmahrim | Hradin Ilmord, Lord of the White Hall | none | Wild | High Gate; Hill Pact of 3A 806 with Heodwa; bombards for Sonargur since 4A 1612 |
| Brundahrim | West Lands | Hrennost | Hrokorn Durnast, Lord of the Deepest Hall | none | Wild | First powder of the West, 4A 1561; Ronbo Oath of 3A 904 |
| Gromkerm | West Lands | Hrunost | Stulmar Kunerm, Lord of Hrunost | none | Wild | Looting of the gate by Saopon's companies, 2A 1712; Kulolo iron contract of 4A 1530 |

## Lore basis

- **Established (owner decisions):** dwarves hold the great ranges of the West and North Lands and the Great Wall range (K22); the Great Wall of Aenor is a natural mountain range (K2); gunpowder weapons are common in some realms (K19); the Concord keeps 26 charter-seats held by 13 dominions, Kunhrim among them (K36); the dwarf card: dwarves dig gold and gems, fight with axes and hammers and never with bows, are proud and quarrelsome and do not like elves (bestiary card 44, as transcribed in `docs/lore/references/bestiary.md`).
- **Proposed in the roster and dossiers (used here, not invented here):** the four hold names, capitals and rulers; the Iron Charter, the Lamp Truce, the Powder Compact, the Western Gate and the Lunhrim Notch ([middle_lands.md](../../../lore/regions/middle_lands.md) 2.9, 3.7, 7; `history/middle_lands.json`); the High Gate, the Hill Pact and the bombards of Sonargur ([north_lands.md](../../../lore/regions/north_lands.md) 7, 11); the Outer Gates, the first powder at Hrennost, the Ronbo Oath, the looting of 2A 1712, the bowshot rule and the Kulolo contract ([west_lands.md](../../../lore/regions/west_lands.md) 7, 11; `history/west_lands.json`); each hold's divergences (`iron_withheld`, `hra_arm_sonargur`, `bru_arm_crossing`, `gro_bombards` and the rest).
- **Proposed here:** every focus, spirit, event, opinion modifier and number; the three councils of the hold (clan council, forge-masters, gate wardens); the powder choice (keep or sell); the hold's grudge choice and the elven envoy; the charter petition; Kunhrim's free-charter petition and its iron embargo as a focus; the Loso watch-forts; the weregild demanded of Saopon; the Kulolo gate-forts.
- **Kept open:** dwarf lifespans (no age is given, K18); the dwarves' own names for their faith's rites; whether any hold ever joins an elven league (the tree never makes it do so).

## Design

### How the tree reads

Every hold gets the root *The Deep Hall Speaks* and six shared branches. Each hold also gets its own branch (rows 6 to 10), opened by `allow_branch` with its `country` condition, which is fixed at game start (E4), so the other three hold branches are hidden for it. The hold branch heads have no prerequisite and are visible from the first day: a hold's identity (its charter, its pact, its forge, its gate) is its first problem, not a late reveal.

| Br. | Branch | Columns | Rows | Opens | Focuses | Role |
| --- | --- | --- | --- | --- | ---: | --- |
| — | Root | 13 | 0 | start | 1 | opening |
| A | The council of the hold | 1 to 5 | 1 to 4 | all | 8 | politics: three exclusive councils, each with an ideology and a staged spirit |
| B | The gate-trade | 7 to 9 | 1 to 4 | all | 5 | economy: open market or sworn buyers, the gate market |
| C | The deep halls | 11 to 13 | 1 to 4 | all | 5 | construction: mines, forges, deep roads, the second hold |
| D | The powder secret | 15 to 17 | 1 to 4 | all | 5 | special mechanic: keep or sell the powder, the bombard foundries |
| E | Axes and hammers | 19 to 21 | 1 to 4 | all | 5 | military: hammer companies, gate-forts, tunnel companies, the hold marches |
| F | The old grudge | 23 to 25 | 1 to 3 | all | 4 | diplomacy: keep or bury the grudge against elves |
| K | The Iron Charter | 0 to 4 | 6 to 10 | Kunhrim | 9 | the crown, the charter, the pass forts, the Lamp Truce |
| H | The Hill Pact | 7 to 11 | 6 to 10 | Hrakbrund | 9 | the pact with Heodwa, Sonargur's bombards, the Loso heights |
| B2 | The fire-hold | 14 to 18 | 6 to 10 | Brundahrim | 9 | the Ronbo Oath, powder for the West, the Crossing |
| G | The old hold | 21 to 25 | 6 to 10 | Gromkerm | 9 | Saopon's debt, the bowshot rule, bombards for one court |

### Route plans

**A. The council of the hold.** *The Clan Moot* (35 days) opens the first real choice of the tree, three mutually exclusive councils:

- *The Council of Clans* (Wild; historical): spirit `clan_council` (+5% calm, +10% drift defence), upgraded by *The Elders in the Deep* to `clan_council_2`. The safe, slow route; the AI's default and the historical one.
- *The Forge-Masters* (Dominion popularity +15%): spirit `forge_masters` (+10% armoury speed, −5% calm); *The Rule of the Forge-Lord* sets the government to Dominion (the High Crown stance: one lord rules from the forge-hall), swaps to `forge_lord_rule_spirit` and adds an armoury. The short-term power route: faster arms, less calm. Brundahrim's AI leans this way (the fire-hold's smiths).
- *The Wardens of the Gate* (Light popularity +15%): spirit `gate_wardens`; *The Charter of the Gate* sets the government to Light (a Free Council in which the gate-folk of men speak), swaps to `gate_charter` (+20% trade opinion, +10% building speed). The trade route; Gromkerm's AI avoids it (it trusts no court).

All three converge on *One Voice at the Gate* (75 authority). Tradeoff: each council changes the hold's ideology or keeps it, and its spirit occupies the political slot for the rest of the game.

**B. The gate-trade.** *The Outer Gate* (a workshop) opens *Sell to All Comers* (authority now, flag `zin_delving_open_market`) or *Sworn Buyers Only* (calm, flag `zin_delving_sworn_buyers`); *The Gate Market* and *Gold and Gems* build workshops and high roads at the gate and pay authority. The flags are the hooks of the gate-trade decision family proposed below.

**C. The deep halls.** *Delve Deeper*, *The Iron Seams* (armoury, arms research), *The Deep Roads* (two high roads), *The Great Forges* (armoury, armour research) and *The Halls Below the Halls* (105 days, needs both lines: a workshop, an armoury and 2,000 levies). This is the branch that changes the map: every focus builds in the hold's own states.

**D. The powder secret.** *The Powder Secret* (siege research +100%) opens the tree's special mechanic, a binding choice:

- *Keep the Secret*: spirit `powder_kept` (+10% siege attack, +5% defence), later `powder_kept_2` (+20%, +10%). The hold's own gate-forts get the bombards; no other country does.
- *Sell the Powder* (historical for all four holds): spirit `powder_trade` (+10% authority gain, +10% trade opinion), later `powder_trade_2`. It also unlocks each hold's buyer focus in its own branch (*Powder for the Pass Forts*, *Bombards for Sonargur*, *Fire for Whoever Pays*, *Fire for the Crossing*, *Bombards for One Court*), all of which fire event 2, `powder_offered`, to the buyer: the buyer pays 50 authority for 20 Cast Bronze Bombards (`zin_bombard_equipment_1`), learns black powder (the country flag `zin_gunpowder`, which opens the powder technologies to it, a siege research bonus and a redrawn technology tree) and owes the hold an opinion, and the hold gains 50 authority. This event is the trade route by which powder spreads beyond the black-powder realms (warfare spec 11.8).

*The Bombard Foundries* and *The Great Bombards* build an armoury, cast 20 bombards (`zin_bombard_equipment`, the hold's best) and upgrade whichever powder spirit the hold chose. Tradeoff: keeping the secret makes the hold a fortress that no court can buy; selling makes it rich and courted, and arms its neighbours.

**E. Axes and hammers.** Army experience and arms research, 500 arms and 2,000 levies (*The Hammer Companies*), forts in the capital's cities (*The Gate-Forts*), *The Tunnel Companies* (15 army experience, flag `zin_delving_tunnel_fighters`), and *The Hold Marches*, available only at war or once the War of the Last Crowns has begun (`zin_war_of_last_crowns`): a one-year spirit (+10% attack, +5% organisation), 3,000 levies and +10% will to war. Dwarves never use bows, so the branch never grants bows.

**F. The old grudge.** *The Old Grudge* opens a binding choice: *No Elf on Our Roads* (historical: elven Wall grievance +5 through `zin_elves_add_wall_grievance`, 50 authority, opinion −20 both ways with the Magical Forest) or *Bury the Grudge* (grievance −5, −5% calm, opinion +15 with the Magical Forest). *The Grudge Answered* fires event 3, *An Elf at the Gate*, whose AI follows the choice; its outcome sets `zin_delving_kept_grudge` or `zin_delving_grudge_eased`, which the middle-free tree's Dunelaeth event also sets.

**K. Kunhrim: the Iron Charter.** *The Iron Charter* adds the spirit `iron_charter` and Concord loyalty +5 (`zin_aenor_add_concord_loyalty`). Then a binding choice:

- *Iron for the Crown* (historical): swap to `crown_iron`, loyalty +10, 500 arms for Aenor, opinion +20 both ways with Aenor. It opens *Powder for the Pass Forts* (after *Sell the Powder*; event 2 for Kingson, loyalty +5) and *Packmen of the Notch*.
- *The Charter Reopened* (only while Kunhrim is a subject): fires event 1, *Kunhrim Asks to Reopen Its Charter*, to the Aenor realm holding Parim through `zin_aenor_event_for_parim`; Parim either refuses (Kunhrim loyalty −10 and the flag `zin_delving_charter_refused`) or grants the Free Charter (`zin_aenor_set_charter{charter: free}`, loyalty +10, Parim −50 authority). It opens *Iron Withheld*, available only after the Golden King's death: the hold closes its gate to the crown (spirit `iron_withheld_spirit`, loyalty −15, opinion −25 both ways with Aenor), the roster's `iron_withheld` divergence.

*The Lamp Truce* (non-aggression and opinion with Burrikkrit) and *The Kingson Road* (opinion with Kingson) lead to the capstone *Lords of the Great Wall*, which replaces whichever iron spirit the hold holds with `lords_of_the_range` and fortifies the capital.

**H. Hrakbrund: the Hill Pact.** *The White Hall* (walls research), then *The Hill Pact Renewed* (historical: spirit `hill_pact_spirit`, guarantee of the Heodwa Lands, opinion +30 both ways) or *Our Own Mountains* (spirit `own_mountains`). *The Road to Nuatax* builds high roads in Hrakbrund and in the Heodwa Lands; *Bombards for Sonargur* (after *Sell the Powder*) fires event 2 for Lerendor and moves Hrakbrund's lean 10 toward Sonargur (`zin_leren_add_lean`); *The Loso Heights* builds forts. *The Dwarves Come Down* (at war or in the last war) is the Hill Pact in action: a half-year spirit and 3,000 levies. *The Price of the North* takes 75 authority and moves the lean 5 back toward Parim (the hold sells to both shores). The capstone *Lords of the High Mountains* replaces the pact spirit with `white_hall_lords`.

**B2. Brundahrim: the fire-hold.** *Hrennost, the Fire-Hold* adds the spirit `fire_hold` and siege research. Then *The Ronbo Oath Kept* (historical: guarantee of Dobbum, opinion +30, flag `zin_delving_ronbo_oath`) or *The High Passes Opened* (authority, flag `zin_delving_passes_opened`). *Leaf and Cheese*, *Fire for Whoever Pays* (after *Sell the Powder*: event 2 for Kradlon and for Buldor) and *Saltpetre of the Dusty Mountains* lead to the West's question: *Fire for the Crossing* (available once the Ford Council has chosen the Crossing, `zin_west_route_crossing`, or once the West has crossed, `zin_western_crossing`: western unity +5 through `zin_west_add_unity` and event 2 for Gunwyn) or *No Fire Beyond the Sea* (unity −5, calm, authority). The capstone *The Fire-Hold Endures* upgrades the spirit to `fire_hold_2`.

**G. Gromkerm: the old hold.** *Hrunost, the Old Hold*, then *The Looting Remembered* (historical: opinion −25 both ways with Saopon, flag `zin_delving_looting_remembered`) or *The Kulolo Contract Renewed* (opinion +15). *The Names of the Guild Masters* fires event 4 to Saopon, which either pays the weregild (75 authority to Gromkerm, opinion +15, flag `zin_delving_weregild_paid`) or refuses (flag `zin_delving_kulolo_closed`). *The Bowshot Rule* adds the spirit `bowshot_rule`; *Iron Down the Kulolo* builds at the river; *Bombards for One Court* (after *Sell the Powder*) offers the siege bombards to Gunwyn alone; *The Gate-Forts of the Kulolo* adds an armoury. The capstone *The Old Hold Unbroken* swaps to `old_hold_unbroken_spirit`.

### Idea lifecycle and the three-spirit limit

A hold holds at most three tree spirits at once, plus the temporary war spirits (`hold_marches` one year, `dwarves_come_down` half a year):

| Slot | Kunhrim | Hrakbrund | Brundahrim | Gromkerm |
| --- | --- | --- | --- | --- |
| Council | `clan_council` → `clan_council_2`, or `forge_masters` → `forge_lord_rule_spirit`, or `gate_wardens` → `gate_charter` | same | same | same |
| Powder | `powder_kept` → `powder_kept_2`, or `powder_trade` → `powder_trade_2` | same | same | same |
| Hold | `iron_charter` → `crown_iron` or `iron_withheld_spirit` → `lords_of_the_range` | `hill_pact_spirit` or `own_mountains` → `white_hall_lords` | `fire_hold` → `fire_hold_2` | `bowshot_rule` → `old_hold_unbroken_spirit` |

The hold spirit is the hold's identity and the only one with a failure form (Kunhrim's `iron_withheld_spirit`, which costs Concord loyalty and Aenor's friendship).

### Rules

- **Text.** Names use `[ROOT.GetName]` in shared focuses and the hold's own name in its branch. Descriptions follow the accepted voice ([../../02_lore/09_voice_and_style.md](../../02_lore/09_voice_and_style.md)): whole sentences, British spelling, no modern words. The builder's text scan reports no finding on this tree's keys.
- **Powder words.** The text says "black powder", "powder" and "bombards". The banned-word data bans "gun", "gunpowder", "cannon" and "artillery" but not these words, and decision K19 makes powder common in some realms; the voice spec's sentence "until both are settled no text names a firearm" was written before the roster placed powder in the four holds, so this spec asks the owner to confirm "bombard" (owner question 1).
- **No bows.** No dwarf focus grants bows or bow research (the dwarf card).
- **Secrets.** No text names Afrit, the Hidden Council or Eindil; nothing is gated.
- **Peace.** No focus creates a claim, a core or a war goal. The holds are defenders and sellers; their wars come to them.

### Decision families (proposed, for the lead)

The focus format writes no decisions (decisions belong to mechanics modules). The tree sets the flags a future dwarf-holds decision category would read; until it exists, the focuses and events above carry the gameplay alone:

| Proposed decision | Visible when | Effect | AI |
| --- | --- | --- | --- |
| Open the Gate Market (repeatable, 180-day cooldown) | `zin_delving_open_market` | authority for trade opinion | when authority below 100 |
| Swear a Buyer at the Gate | `zin_delving_sworn_buyers` | opinion +15 with a chosen neighbour, both ways | befriend targets |
| Hire Kunhrim Packmen (Kunhrim's neighbours) | Kunhrim has `zin_delving_notch_packmen` | supply bonus over the Lunhrim Notch for a year | at war in the Middle Lands |
| Close the Gate | any hold at war or insulted | embargo of a named country (iron and powder) | when opinion below −50 |

### AI behaviour

- Every focus has an `ai` block; the historical modifiers use `zin_rules_is_historical`. Historical routes: Council of Clans, Sworn Buyers Only (Gromkerm doubly), Sell the Powder, No Elf on Our Roads, Iron for the Crown, the Hill Pact Renewed, the Ronbo Oath Kept, the Looting Remembered. Under the free rules the weights still favour these but leave every route open.
- The war focuses (*The Hold Marches*, *The Dwarves Come Down*) are available only at war or after `zin_war_of_last_crowns`, so the AI never wastes them in peace.
- *Iron Withheld* has a base weight of 10, multiplied by 5 when Parim refused the charter petition: the embargo follows a grievance.
- *Fire for the Crossing* is available only when the Crossing is the West's chosen course, so the AI cannot arm a crossing that is not coming.
- AI strategies: Kunhrim befriends Aenor (historical, until *Iron Withheld*); Hrakbrund protects the Heodwa Lands after the pact; Brundahrim protects Dobbum after the Ronbo Oath; Gromkerm antagonises Saopon after *The Looting Remembered*.
- The weights are a first proposal. The audit-patch-compare cycle of the probability auditor has not run (handoff).

### Icons

All icons are catalog keys ([../02_icon_catalog.md](../02_icon_catalog.md)); the catalog has no dwarf subjects, so the nearest keys stand in. Requested keys (proposed, not in the catalog; the closest key is used until they are added): `dwarf_hold_gate` (a carved gate in a mountain face; for *The Outer Gate*, *The White Hall*, *Hrunost, the Old Hold*), `powder_casks` (casks under oilcloth on a mule; for *Sell the Powder*, *The Powder Secret*), `bombard_casting` (a bombard in a foundry pit; for *The Bombard Foundries*, *The Great Bombards*), `dwarf_axe_hammer` (crossed axe and hammer; for *Axes and Hammers*, *The Hammer Companies*).

### Focuses

| Key | Name | Prerequisites | Excl. | x,y | Days | Icon | Opens / available | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| `the_deep_hall` | The Deep Hall Speaks | — | — | 13,0 | 35 | `forge_anvil` | — | pp 50; stab 0.05 | 100 |
| `the_clan_moot` | The Clan Moot | the_deep_hall | — | 3,1 | 35 | `council_table` | — | stab 0.05 | 60 |
| `council_of_clans` | The Council of Clans | the_clan_moot | the_forge_masters, the_gate_wardens | 1,2 | 35 | `charter_old` | — | spirit `clan_council`; popularity wild 0.1 | 40; ×2 if hist; ×1.5 if country Kunhrim; ×1.5 if country Gromkerm |
| `the_forge_masters` | The Forge-Masters | the_clan_moot | council_of_clans, the_gate_wardens | 3,2 | 35 | `foundry_fire` | — | spirit `forge_masters`; popularity dominion 0.15 | 20; ×2 if country Brundahrim; ×0.25 if hist |
| `the_gate_wardens` | The Wardens of the Gate | the_clan_moot | council_of_clans, the_forge_masters | 5,2 | 35 | `toll_house` | — | spirit `gate_wardens`; popularity light 0.15 | 20; ×0.25 if country Gromkerm; ×0.25 if hist |
| `elders_in_the_deep` | The Elders in the Deep | council_of_clans | — | 1,3 | 70 | `rune_stone` | — | swap `clan_council`→`clan_council_2`; stab 0.05 | 30 |
| `forge_lord_rule` | The Rule of the Forge-Lord | the_forge_masters | — | 3,3 | 70 | `crown_iron` | — | government dominion; swap `forge_masters`→`forge_lord_rule_spirit`; bld arms_factory 1 @capital | 30 |
| `charter_of_the_gate` | The Charter of the Gate | the_gate_wardens | — | 5,3 | 70 | `charter_free` | — | government light; swap `gate_wardens`→`gate_charter`; bld infrastructure 1 @capital | 30 |
| `one_voice_at_the_gate` | One Voice at the Gate | elders_in_the_deep / forge_lord_rule / charter_of_the_gate | — | 3,4 | 70 | `seal_wax` | — | pp 75 | 30 |
| `the_outer_gate` | The Outer Gate | the_deep_hall | — | 8,1 | 70 | `guild_hall` | — | bld industrial_complex 1 @capital | 40 |
| `sell_to_all_comers` | Sell to All Comers | the_outer_gate | sworn_buyers_only | 7,2 | 35 | `market_stalls` | — | pp 50; flag zin_delving_open_market | 20; ×0.25 if country Gromkerm |
| `sworn_buyers_only` | Sworn Buyers Only | the_outer_gate | sell_to_all_comers | 9,2 | 35 | `handshake_oath` | — | stab 0.05; flag zin_delving_sworn_buyers | 20; ×1.5 if hist; ×2 if country Gromkerm |
| `the_gate_market` | The Gate Market | sell_to_all_comers / sworn_buyers_only | — | 8,3 | 70 | `ledger_coins` | — | bld industrial_complex 1 @random_owned; bld infrastructure 1 @capital | 30 |
| `gold_and_gems` | Gold and Gems | the_gate_market | — | 8,4 | 70 | `coin_chest` | — | pp 75; bld industrial_complex 1 @capital | 25 |
| `delve_deeper` | Delve Deeper | the_deep_hall | — | 12,1 | 70 | `mine_cart` | — | bld industrial_complex 1 @capital | 40 |
| `the_iron_seams` | The Iron Seams | delve_deeper | — | 11,2 | 70 | `forge_anvil` | — | bld arms_factory 1 @capital; res [zin_cat_arms] 0.5 ×1 | 30 |
| `the_deep_roads` | The Deep Roads | delve_deeper | — | 13,2 | 70 | `roads_paved` | — | bld infrastructure 1 @random_owned; bld infrastructure 1 @capital | 30 |
| `the_great_forges` | The Great Forges | the_iron_seams | — | 11,3 | 70 | `foundry_fire` | — | bld arms_factory 1 @random_owned; res [zin_cat_armour] 0.5 ×1 | 25 |
| `the_halls_below_the_halls` | The Halls Below the Halls | the_great_forges + the_deep_roads | — | 12,4 | 105 | `ice_cavern` | — | bld industrial_complex 1 @capital; bld arms_factory 1 @capital; mp 2000 | 25 |
| `the_powder_secret` | The Powder Secret | the_deep_hall | — | 16,1 | 70 | `scroll_sealed` | — | res [zin_cat_siege] 1 ×1; tooltip | 50 |
| `keep_the_secret` | Keep the Secret | the_powder_secret | sell_the_powder | 15,2 | 35 | `fort_wall` | — | spirit `powder_kept` | 25; ×1.5 if country Gromkerm; ×0.5 if hist |
| `sell_the_powder` | Sell the Powder | the_powder_secret | keep_the_secret | 17,2 | 35 | `tribute_chest` | — | spirit `powder_trade` | 25; ×3 if hist |
| `the_bombard_foundries` | The Bombard Foundries | keep_the_secret / sell_the_powder | — | 16,3 | 70 | `siege_trebuchet` | — | bld arms_factory 1 @capital; zin_bombard_equipment 20 | 30 |
| `the_great_bombards` | The Great Bombards | the_bombard_foundries | — | 16,4 | 105 | `war_drums` | — | if spirit powder_kept: swap `powder_kept`→`powder_kept_2` else: swap `powder_trade`→`powder_trade_2`; res [zin_cat_siege] 1 ×1 | 25 |
| `axes_and_hammers` | Axes and Hammers | the_deep_hall | — | 20,1 | 70 | `sword_shield` | — | army_xp 10; res [zin_cat_arms] 0.5 ×1 | 35 |
| `the_hammer_companies` | The Hammer Companies | axes_and_hammers | — | 19,2 | 70 | `levy_muster` | — | zin_arms_equipment 500; mp 2000 | 25 |
| `the_gate_forts` | The Gate-Forts | axes_and_hammers | — | 21,2 | 70 | `pass_fort` | — | bld bunker 1 @capital; res [zin_cat_walls] 0.5 ×1 | 25 |
| `tunnel_fighters` | The Tunnel Companies | the_hammer_companies / the_gate_forts | — | 20,3 | 70 | `scout_lantern` | — | army_xp 15; flag zin_delving_tunnel_fighters | 25 |
| `the_hold_marches` | The Hold Marches | tunnel_fighters | — | 20,4 | 35 | `war_council_map` | avail: (at war or global_flag zin_war_of_last_crowns) | timed `hold_marches` 365d; mp 3000; ws 0.1 | 50 |
| `the_old_grudge` | The Old Grudge | the_deep_hall | — | 24,1 | 35 | `chain_broken` | — | ws 0.05 | 30 |
| `no_elf_on_our_roads` | No Elf on Our Roads | the_old_grudge | bury_the_grudge | 23,2 | 35 | `banner_plain` | — | call zin_elves_add_wall_grievance(value: 5); pp 50; if exists Magical Forest: opinion Magical Forest `old_grudge` both ways | 30; ×2 if hist |
| `bury_the_grudge` | Bury the Grudge | the_old_grudge | no_elf_on_our_roads | 25,2 | 35 | `olive_branch` | — | call zin_elves_add_wall_grievance(value: -5); stab -0.05; if exists Magical Forest: opinion Magical Forest `grudge_eased` both ways | 10; ×0.5 if hist |
| `the_grudge_answered` | The Grudge Answered | no_elf_on_our_roads / bury_the_grudge | — | 24,3 | 35 | `envoy` | — | event `an_elf_at_the_gate` | 25 |
| `the_iron_charter` | The Iron Charter | — | — | 2,6 | 35 | `charter_wall` | allow: country Kunhrim | spirit `iron_charter`; call zin_aenor_add_concord_loyalty(value: 5) | 60 |
| `iron_for_the_crown` | Iron for the Crown | the_iron_charter | the_charter_reopened | 1,7 | 70 | `tribute_chest` | allow: country Kunhrim | swap `iron_charter`→`crown_iron`; call zin_aenor_add_concord_loyalty(value: 10); if exists Aenor: Aenor: zin_arms_equipment 500; opinion Aenor `crown_iron_paid` both ways | 40; ×3 if hist |
| `the_charter_reopened` | The Charter Reopened | the_iron_charter | iron_for_the_crown | 3,7 | 35 | `charter_old` | allow: country Kunhrim; avail: is_subject true | call zin_aenor_event_for_parim(event: charter_petition) | 20; ×0.2 if hist |
| `powder_for_the_pass_forts` | Powder for the Pass Forts | iron_for_the_crown | — | 0,8 | 35 | `pass_fort` | allow: country Kunhrim; avail: focus_done sell_the_powder | if exists Kingson: event `powder_offered` for Kingson; call zin_aenor_add_concord_loyalty(value: 5) | 40; ×2 if hist |
| `packmen_of_the_notch` | Packmen of the Notch | iron_for_the_crown / the_charter_reopened | — | 2,8 | 70 | `mountain_pass` | allow: country Kunhrim | bld infrastructure 1 @random_owned; stab 0.05; flag zin_delving_notch_packmen | 30 |
| `iron_withheld` | Iron Withheld | the_charter_reopened | — | 4,8 | 35 | `chain_broken` | allow: country Kunhrim; avail: global_flag zin_golden_king_dead | remove `iron_charter`; remove `crown_iron`; spirit `iron_withheld_spirit`; call zin_aenor_add_concord_loyalty(value: -15); if exists Aenor: opinion Aenor `iron_refused` both ways | 10; ×5 if flag zin_delving_charter_refused |
| `the_lamp_truce` | The Lamp Truce | powder_for_the_pass_forts / packmen_of_the_notch | — | 1,9 | 35 | `lantern_chain` | allow: country Kunhrim | if exists Burrikkrit: non_aggression Burrikkrit; opinion Burrikkrit `lamp_truce` both ways; stab 0.05 | 30; ×2 if hist |
| `the_kingson_road` | The Kingson Road | packmen_of_the_notch / iron_withheld | — | 3,9 | 70 | `traders_road` | allow: country Kunhrim | bld infrastructure 1 @capital; if exists Kingson: opinion Kingson `kingson_road` both ways | 25 |
| `lords_of_the_great_wall` | Lords of the Great Wall | the_lamp_truce / the_kingson_road | — | 2,10 | 105 | `snow_peak` | allow: country Kunhrim | remove `iron_charter`; remove `crown_iron`; remove `iron_withheld_spirit`; spirit `lords_of_the_range`; bld bunker 1 @capital; pp 50 | 30 |
| `the_white_hall` | The White Hall | — | — | 9,6 | 35 | `snow_peak` | allow: country Hrakbrund | res [zin_cat_walls] 0.5 ×1; stab 0.05 | 60 |
| `the_hill_pact_renewed` | The Hill Pact Renewed | the_white_hall | our_own_mountains | 8,7 | 35 | `handshake_oath` | allow: country Hrakbrund | spirit `hill_pact_spirit`; if exists Heodwa Lands: guarantee Heodwa Lands; opinion Heodwa Lands `hill_pact` both ways | 50; ×3 if hist |
| `our_own_mountains` | Our Own Mountains | the_white_hall | the_hill_pact_renewed | 10,7 | 35 | `fort_wall` | allow: country Hrakbrund | spirit `own_mountains` | 10; ×0.2 if hist |
| `the_nuatax_road` | The Road to Nuatax | the_hill_pact_renewed | — | 7,8 | 70 | `roads_paved` | allow: country Hrakbrund | bld infrastructure 1 @random_owned; if exists Heodwa Lands: Heodwa Lands: bld infrastructure 1 @capital | 30 |
| `bombards_for_sonargur` | Bombards for Sonargur | the_hill_pact_renewed / our_own_mountains | — | 9,8 | 35 | `warship_sail` | allow: country Hrakbrund; avail: focus_done sell_the_powder | if exists Lerendor: event `powder_offered` for Lerendor; call zin_leren_add_lean(value: 10) | 40; ×2 if hist |
| `the_loso_heights` | The Loso Heights | our_own_mountains | — | 11,8 | 70 | `pass_fort` | allow: country Hrakbrund | bld bunker 1 @capital; bld bunker 1 @random_owned | 25 |
| `the_dwarves_come_down` | The Dwarves Come Down | the_nuatax_road / bombards_for_sonargur | — | 8,9 | 35 | `levy_muster` | allow: country Hrakbrund; avail: (at war or global_flag zin_war_of_last_crowns) | timed `dwarves_come_down` 180d; mp 3000 | 40 |
| `the_price_of_the_north` | The Price of the North | bombards_for_sonargur / the_loso_heights | — | 10,9 | 70 | `ledger_coins` | allow: country Hrakbrund | pp 75; call zin_leren_add_lean(value: -5) | 25 |
| `lords_of_the_high_mountains` | Lords of the High Mountains | the_dwarves_come_down / the_price_of_the_north | — | 9,10 | 105 | `crown_iron` | allow: country Hrakbrund | remove `hill_pact_spirit`; remove `own_mountains`; spirit `white_hall_lords`; bld arms_factory 1 @capital | 30 |
| `hrennost_the_fire_hold` | Hrennost, the Fire-Hold | — | — | 16,6 | 35 | `foundry_fire` | allow: country Brundahrim | spirit `fire_hold`; res [zin_cat_siege] 0.5 ×1 | 60 |
| `the_ronbo_oath_kept` | The Ronbo Oath Kept | hrennost_the_fire_hold | the_high_passes_opened | 15,7 | 35 | `mountain_pass` | allow: country Brundahrim | if exists Dobbum: guarantee Dobbum; opinion Dobbum `ronbo_oath` both ways; flag zin_delving_ronbo_oath | 50; ×3 if hist |
| `the_high_passes_opened` | The High Passes Opened | hrennost_the_fire_hold | the_ronbo_oath_kept | 17,7 | 35 | `traders_road` | allow: country Brundahrim | pp 50; flag zin_delving_passes_opened | 10; ×0.2 if hist |
| `leaf_and_cheese` | Leaf and Cheese | the_ronbo_oath_kept | — | 14,8 | 35 | `farm_sowing` | allow: country Brundahrim | pp 50; stab 0.05 | 30 |
| `fire_for_whoever_pays` | Fire for Whoever Pays | the_ronbo_oath_kept / the_high_passes_opened | — | 16,8 | 35 | `market_stalls` | allow: country Brundahrim; avail: focus_done sell_the_powder | if exists Kradlon: event `powder_offered` for Kradlon; if exists Buldor: event `powder_offered` for Buldor | 40; ×2 if hist |
| `saltpetre_of_the_dusty_mountains` | Saltpetre of the Dusty Mountains | the_high_passes_opened | — | 18,8 | 70 | `quarry_stone` | allow: country Brundahrim | bld industrial_complex 1 @random_owned; res [zin_cat_siege] 0.5 ×1 | 25 |
| `fire_for_the_crossing` | Fire for the Crossing | leaf_and_cheese / fire_for_whoever_pays | no_fire_beyond_the_sea | 15,9 | 35 | `ship_voyage` | allow: country Brundahrim; avail: (global_flag zin_west_route_crossing or global_flag zin_western_crossing) | call zin_west_add_unity(value: 5); if exists Gunwyn: event `powder_offered` for Gunwyn | 30 |
| `no_fire_beyond_the_sea` | No Fire Beyond the Sea | fire_for_whoever_pays / saltpetre_of_the_dusty_mountains | fire_for_the_crossing | 17,9 | 35 | `banner_laid_down` | allow: country Brundahrim | call zin_west_add_unity(value: -5); stab 0.05; pp 50 | 20 |
| `the_fire_hold_endures` | The Fire-Hold Endures | fire_for_the_crossing / no_fire_beyond_the_sea | — | 16,10 | 105 | `forge_anvil` | allow: country Brundahrim | swap `fire_hold`→`fire_hold_2`; bld arms_factory 1 @capital | 30 |
| `hrunost_the_old_hold` | Hrunost, the Old Hold | — | — | 23,6 | 35 | `rune_stone` | allow: country Gromkerm | res [zin_cat_walls] 0.5 ×1; stab 0.05 | 60 |
| `the_looting_remembered` | The Looting Remembered | hrunost_the_old_hold | the_kulolo_contract_renewed | 22,7 | 35 | `scroll_sealed` | allow: country Gromkerm | ws 0.05; flag zin_delving_looting_remembered; if exists Saopon: opinion Saopon `looting_remembered` both ways | 30; ×2 if hist |
| `the_kulolo_contract_renewed` | The Kulolo Contract Renewed | hrunost_the_old_hold | the_looting_remembered | 24,7 | 35 | `scroll_treaty` | allow: country Gromkerm | pp 50; if exists Saopon: opinion Saopon `kulolo_contract` both ways | 20 |
| `the_names_of_the_guild_masters` | The Names of the Guild Masters | the_looting_remembered | — | 21,8 | 35 | `envoy` | allow: country Gromkerm | if exists Saopon: event `weregild_demanded` for Saopon | 30 |
| `the_bowshot_rule` | The Bowshot Rule | the_looting_remembered / the_kulolo_contract_renewed | — | 23,8 | 70 | `fort_wall` | allow: country Gromkerm | spirit `bowshot_rule`; bld bunker 1 @capital | 30 |
| `iron_down_the_kulolo` | Iron Down the Kulolo | the_kulolo_contract_renewed | — | 25,8 | 70 | `harbour_lake` | allow: country Gromkerm | bld infrastructure 1 @random_owned; bld industrial_complex 1 @capital | 25 |
| `bombards_for_one_court` | Bombards for One Court | the_names_of_the_guild_masters / the_bowshot_rule | — | 22,9 | 35 | `siege_trebuchet` | allow: country Gromkerm; avail: focus_done sell_the_powder | if exists Gunwyn: event `powder_offered` for Gunwyn; flag zin_delving_one_court | 30 |
| `gate_forts_of_the_kulolo` | The Gate-Forts of the Kulolo | the_bowshot_rule / iron_down_the_kulolo | — | 24,9 | 70 | `pass_fort` | allow: country Gromkerm | bld arms_factory 1 @random_owned; army_xp 10 | 25 |
| `the_old_hold_unbroken` | The Old Hold Unbroken | bombards_for_one_court / gate_forts_of_the_kulolo | — | 23,10 | 105 | `crown_iron` | allow: country Gromkerm | if spirit bowshot_rule: swap `bowshot_rule`→`old_hold_unbroken_spirit` else: spirit `old_hold_unbroken_spirit`; pp 50 | 30 |

### Spirits

| Key | Name | Modifiers |
| --- | --- | --- |
| `clan_council` | The Council of Clans | stability_factor 0.05, drift_defence_factor 0.1 |
| `clan_council_2` | The Elders in the Deep | stability_factor 0.1, drift_defence_factor 0.15, political_power_gain 0.1 |
| `forge_masters` | The Forge-Masters' Voice | production_speed_arms_factory_factor 0.1, stability_factor -0.05 |
| `forge_lord_rule_spirit` | The Rule of the Forge-Lord | production_speed_arms_factory_factor 0.15, army_org_factor 0.05, political_power_gain 0.1, stability_factor -0.05 |
| `gate_wardens` | The Wardens of the Gate | trade_opinion_factor 0.1, political_power_gain 0.05 |
| `gate_charter` | The Charter of the Gate | trade_opinion_factor 0.2, production_speed_buildings_factor 0.1, stability_factor 0.05 |
| `powder_kept` | The Powder Kept | army_artillery_attack_factor 0.1, army_defence_factor 0.05 |
| `powder_kept_2` | The Great Bombards of the Hold | army_artillery_attack_factor 0.2, army_defence_factor 0.1 |
| `powder_trade` | The Powder Trade | political_power_gain 0.1, trade_opinion_factor 0.1 |
| `powder_trade_2` | Powder for the Crowns of Men | political_power_gain 0.15, trade_opinion_factor 0.15, production_speed_arms_factory_factor 0.1 |
| `iron_charter` | The Iron Charter | local_resources_factor 0.1, production_speed_arms_factory_factor 0.05 |
| `crown_iron` | Iron for the Crown | local_resources_factor 0.15, army_defence_factor 0.05 |
| `iron_withheld_spirit` | Iron Withheld | production_speed_arms_factory_factor 0.1, stability_factor 0.05 |
| `lords_of_the_range` | Lords of the Great Wall | local_resources_factor 0.15, army_core_defence_factor 0.1, production_speed_arms_factory_factor 0.1 |
| `hill_pact_spirit` | The Hill Pact | army_defence_factor 0.05, army_org_factor 0.05 |
| `own_mountains` | Our Own Mountains | army_core_defence_factor 0.1, drift_defence_factor 0.1 |
| `white_hall_lords` | Lords of the High Mountains | army_core_defence_factor 0.1, local_resources_factor 0.15, political_power_gain 0.1 |
| `fire_hold` | The Fire-Hold | army_artillery_attack_factor 0.05, production_speed_arms_factory_factor 0.05 |
| `fire_hold_2` | The Fire-Hold Endures | army_artillery_attack_factor 0.15, production_speed_arms_factory_factor 0.1, local_resources_factor 0.1 |
| `bowshot_rule` | The Bowshot Rule | army_core_defence_factor 0.1, max_dig_in 2 |
| `old_hold_unbroken_spirit` | The Old Hold Unbroken | army_core_defence_factor 0.15, max_dig_in 4, production_speed_arms_factory_factor 0.1 |
| `hold_marches` | The Hold Marches | army_attack_factor 0.1, army_org_factor 0.05 |
| `dwarves_come_down` | The Dwarves Come Down | army_defence_factor 0.1, army_attack_factor 0.05 |

### Events

| n | Key | Title | Picture | Options (effects; AI) |
| ---: | --- | --- | --- | --- |
| 1 | `charter_petition` | [FROM.GetName] Asks to Reopen Its Charter | `concord_council` | **The Iron Charter stands as it was sworn.** (FROM: call zin_aenor_add_concord_loyalty(value: -10); flag zin_delving_charter_refused; AI 50)<br>**Give the clans a free charter.** (pp -50; FROM: call zin_aenor_set_charter(charter: free); call zin_aenor_add_concord_loyalty(value: 10); AI 50; ×0.5 if check zin_aenor_king_alive) |
| 2 | `powder_offered` | [FROM.GetName] Offers Black Powder | `generic_court` | **Send the factors home.** (nothing; AI 30)<br>**Pay their price.** (pp -50; zin_bombard_equipment_1 20; flag zin_delving_powder_buyer; flag zin_gunpowder; redraw the technology tree; siege research bonus; opinion FROM `powder_bought` both ways; FROM: pp 50; AI 70) |
| 3 | `an_elf_at_the_gate` | An Elf at the Gate | `generic_wilds` | **Turn him away, courteously.** (flag zin_delving_kept_grudge; call zin_elves_add_wall_grievance(value: 5); AI 40; ×3 if focus_done no_elf_on_our_roads; ×0.2 if focus_done bury_the_grudge)<br>**Let him in and hear him out.** (flag zin_delving_grudge_eased; call zin_elves_add_wall_grievance(value: -10); pp -25; AI 40; ×3 if focus_done bury_the_grudge; ×0.2 if focus_done no_elf_on_our_roads) |
| 4 | `weregild_demanded` | [FROM.GetName] Asks the Price of the Looting | `generic_court` | **We pay nothing for an old crime.** (FROM: flag zin_delving_kulolo_closed; AI 50)<br>**Pay the weregild and be done with it.** (pp -75; opinion FROM `kulolo_contract` both ways; FROM: pp 75; flag zin_delving_weregild_paid; AI 50) |

### Opinion modifiers

| Key | Name | Value |
| --- | --- | ---: |
| `crown_iron_paid` | Iron for the Crown | 20 |
| `iron_refused` | Iron Withheld | -25 |
| `lamp_truce` | The Lamp Truce | 10 |
| `kingson_road` | The Kingson Road | 15 |
| `hill_pact` | The Hill Pact | 30 |
| `ronbo_oath` | The Ronbo Oath | 30 |
| `powder_bought` | Powder Bought and Paid For | 20 |
| `old_grudge` | The Old Grudge | -20 |
| `grudge_eased` | An Old Grudge Eased | 15 |
| `looting_remembered` | The Looting Remembered | -25 |
| `kulolo_contract` | The Kulolo Contract | 15 |

### AI strategies

| Country | Type | Target | Value | When |
| --- | --- | --- | ---: | --- |
| Kunhrim | befriend | Aenor | 30 | hist and not focus_done iron_withheld |
| Hrakbrund | protect | Heodwa Lands | 50 | focus_done the_hill_pact_renewed |
| Brundahrim | protect | Dobbum | 40 | focus_done the_ronbo_oath_kept |
| Gromkerm | antagonize | Saopon | 20 | flag zin_delving_looting_remembered |

## Implementation notes

- **Bombards.** The ruleset has no powder equipment yet (K19 says the ruleset carries black-powder equipment for these realms; `docs/specs/03_gameplay/01_warfare.md` still says no gunpowder). Until the warfare owner adds it, the tree grants `zin_catapult_equipment` and `zin_trebuchet_equipment` and the siege research category `zin_cat_siege`, and the powder spirits use `army_artillery_attack_factor`. When powder equipment exists, the lead swaps the equipment types in four places (*The Bombard Foundries* and event 2's purchase); the text needs no change.
- **Dig-in.** `max_dig_in` (bowshot spirits, 2 and 4) is on the engine's small integer scale (vanilla uses 1 to 5), a documented exception to the multiples-of-five rule.
- **Cross-tree hooks.** Event 2 is fired for Kingson, Lerendor, Kradlon, Buldor and Gunwyn; each call is wrapped in `exists`. The middle-free tree's Dunelaeth fires its own event 3 to Kunhrim, which also sets `zin_delving_grudge_eased`; the small-folk tree's Dobbum fires its event 1 to Brundahrim.
- **Mechanic effects called:** `zin_aenor_add_concord_loyalty`, `zin_aenor_set_charter`, `zin_aenor_event_for_parim` (Aenor court), `zin_elves_add_wall_grievance` (elves), `zin_leren_add_lean` (Narrow Strait), `zin_west_add_unity` (Western Crossing). Kunhrim's charter and loyalty effects assume Kunhrim stays a Concord dominion in the migrated Aenor tables (K36 gives it one charter-seat).
- **Raw blocks:** none.

## Route coverage

| Required route (roster and task) | Implemented | Status | Notes |
| --- | --- | --- | --- |
| The deep halls | branch C | implemented | five focuses, map changes in the hold's states |
| The gate-trade | branch B | implemented | open market or sworn buyers; decision family proposed |
| The powder secret | branch D and the buyer focuses | implemented | the black-powder equipment of the warfare spec (11.8): the foundries cast bombards, event 2 sells Cast Bronze Bombards and the powder flag |
| The Iron Charter | branch K | implemented | crown, petition, embargo, Lamp Truce, capstone |
| The Hill Pact | branch H | implemented | pact or own mountains; Sonargur's bombards |
| The old grudge against elves | branch F | implemented | keep or bury; elven envoy event; Dunelaeth hook |
| Country-specific branches | K, H, B2, G | implemented | nine focuses each |
| Politics | branch A | implemented | three councils with ideology changes |
| Military | branch E | implemented | no bows |
| Expansion | none | deliberately omitted | the holds never expand in the lore; their "expansion" is the deep halls and the buyers they arm. Recorded as a simplification against the skill's large-tree rule |

## Owner questions

1. May text name "bombards" and "black powder" for the dwarf holds (voice spec section 2.5 forbids naming a firearm until the realms are settled)?
2. Should the tree's political routes change a hold's ideology (Forge-Lord to Dominion, Charter of the Gate to Light), or should every hold stay Wild with only the spirit changing?
3. Is Kunhrim's "Iron Charter" a charter of its own in the Aenor mechanic (a sixth charter idea), or a name for its Old Charter? The tree keeps it as a tree spirit beside the mechanic's charter idea.
4. Does the Lamp Truce bind Burrikkrit to a non-aggression pact in game terms, as *The Lamp Truce* proposes?

## Acceptance

1. The scratch compile of this file through `analyseTrees` and `compileTree` reports no problem (handoff, compile evidence).
2. `hoi4.focus_inspect` on the staged copy reports no error; the render shows no overlap and no crossing connector.
3. In the Linux run, each hold sees the shared branches and its own branch only.
