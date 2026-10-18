# Worshipdom focus tree

**Status:** Draft. **Priority:** 4. **Phase:** 4.

## Purpose

The Worshipdom is the playable hub of Afrit's Hidden Council. Its tree plays the Council's long game: build the Houses of the First Light, fill the four seats, ready the Golden King's death, crown the Deliverer, hunt the brother, flee east, return, and either die in the palace or reach the Ashen Throne. The tree drives the mechanics of [04_mechanics/afrit_hidden_council.md](../../04_mechanics/afrit_hidden_council.md) and uses its names. It has 116 focuses in 11 branches.

Every focus is visible to other players who open the Worshipdom's tree. Until `zin_afrit_revealed` is set, no focus text may name Afrit or show the plot. The tree therefore has two faces: a pious public face, and a true face that appears after the reveal.

## Lore basis

- **Established:** Afrit is worshipped as the Deliverer; ordinary people do not know the name Afrit. He rules Aenor through priests, relief houses and councillors; murders the Golden King and is crowned; reaches Yeldenne first and is wounded; abandons Aenor for an eastern kingship that not every eastern state accepts; returns, casts Eindil from a cliff, retakes Aenor and claims all Erdae; and dies in the palace after his artifacts are stripped. The Necklace of the Abyss is his. The Ashen Throne is one of the three endings.
- **Proposed (vault):** the public name Aurevan; the Worshipdom as a temple-state in the Zilin Hills and the visible hub; the four council duties; the Houses of the First Light; Chancellor Merovan; Sevrin; the Ring of Doors, Crown of Witnesses and Bracelet of the First Seal; the Thousand-Year Jubilee of 4A 1000; the *Night of a Thousand Oaths* (as an idea for Afrit's old ascension).
- **Proposed (this spec):** every focus name, the public chapter names, Ilvane and Corvel, the attunement of artifacts, the Eastern Throne as a cosmetic name, and all numbers.

The tree never states as history which eastern kings join Afrit, Merovan's fate, Sevrin's fate, or where Afrit's private refuge lies.

## Design

### The country at the start

| Item | Value |
| --- | --- |
| States | 3 (the Zilin Hills), capital Lenlakron |
| Ruler | `zin_aurevan`, shown as Aurevan the Deliverer |
| Advisors available | `zin_ilvane` (High Confessor), `zin_corvel` (Master of Couriers) |
| Ideology | Shadow (roster); party name "The Faithful of the Deliverer" (proposed; see open questions) |
| Spirit | `temple_state` |
| Army | 2 divisions of the Hermitage Guard; no navy |
| Wars, wargoals, claims | none |
| Bookmark text | "A temple-state of the Deliverer in the Zilin Hills. Its pilgrims and confessors walk every road in Erdae. Play the patient game." |

### Two faces

Names marked "public / *true*" in the tables use scripted localisation keyed on the global flag `zin_afrit_revealed`: other players and the hub both see the public face until the reveal. The hub learns the true meaning from private events and the Council panel. Descriptions follow the same rule. A focus with no true name has a single face, which is already mask-safe.

Rules that follow from the engine:

- **Locked focuses are readable from day one.** Every name, description and effect tooltip in every branch, including the late branches, must be mask-safe before the reveal. That is why branches G, H, I, K and U have pious public faces too.
- **Effect tooltips leak.** Effects that touch the plot, the veil, seats or artifacts show only mask-safe tooltips (see the mechanics spec, "Text secrecy rules"). Spirit names appear in tooltips, so every spirit name is mask-safe.
- **Event titles leak.** In this tree the compiler wraps every `event` effect that fires a private event (`zin_afrit.*` or a private `zin_worshipdom.*`) in `hidden_effect` and shows the focus's mask tooltip instead of the event title. This needs a tree-level compiler option `"private_events": true` (see open questions).

### Layout

Width 30 columns (x 0–29), depth 17 rows (y 0–16). Six roots let the player start any part of the Council at once.

| Branch | Columns | Rows | Focuses |
| --- | --- | --- | ---: |
| B The Houses of the First Light | 0–4 | 0–6 | 15 |
| C The Seat of Whispers | 6–10 | 0–6 | 13 |
| A The Hermitage | 11–15 | 0–6 | 13 |
| D The Seat of Seals | 17–21 | 0–7 | 18 |
| E The Seat of Censers | 22–24 | 0–6 | 10 |
| F The Seat of Relics | 26–29 | 0–8 | 14 |
| U Unmasked | 1–3 | 8–11 | 5 |
| H The Eastern Throne | 8–12 | 7–13 | 11 |
| G The Crowned Deliverer | 17–19 | 8–11 | 9 |
| K The Kingdom Behind the Throne | 21 | 8–11 | 4 |
| I The Ashen Throne | 13–15 | 14–16 | 4 |
| **Total** | | | **116** |

Positions were checked by script: all unique, every focus below all its prerequisites, every exclusive pair symmetric, every `days` a multiple of 7.

Every focus in branches G, H, I, K and U also requires not `zin_afrit_dead` (added by the compiler to `available`).

### A. The Hermitage

**Purpose:** the temple-state itself: roads, granaries, healers, a small guard, good relations with the elves around it. It is the peaceful heart of the tree and the first thing the AI does.
**Opens:** at the start (root).
**Drives:** the hub's economy and political power; the public image of a harmless temple-state.

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `zilin_hermitage` | The Hermitage of Zilin | - | - | 13, 0 | 35 | political_power 50; stability 0.03; event zin_worshipdom.1 | base 50; first focus in every route |
| `pilgrim_roads` | Mend the Pilgrim Roads | zilin_hermitage | - | 12, 1 | 35 | building infrastructure 1 capital; add_spirit pilgrim_roads | base 15 |
| `alms_of_the_faithful` | The Alms of the Faithful | zilin_hermitage | - | 14, 1 | 35 | political_power 75; call zin_afrit_add_veil {value: 3} | base 20; historical: by Highsun 1749 |
| `valley_granaries` | Granaries of the Three Valleys | pilgrim_roads | - | 11, 2 | 70 | building industrial_complex 1 random_owned; stability 0.02 | base 10 |
| `hermitage_scriptorium` | The Hermitage Scriptorium | (pilgrim_roads OR alms_of_the_faithful) | - | 13, 2 | 35 | add_spirit scriptorium | base 10 |
| `healers_of_zilin` | Healers of Zilin | alms_of_the_faithful | - | 15, 2 | 35 | add_spirit healers_of_zilin | base 10 |
| `temple_masons` | Temple Masons | valley_granaries | - | 11, 3 | 70 | building arms_factory 1 capital; building infrastructure 1 random_owned | base 8 |
| `letters_to_every_court` | Letters to Every Court | hermitage_scriptorium | - | 13, 3 | 35 | political_power 50; timed_spirit open_letters 365 days | base 10 |
| `the_open_door` | The Open Door | healers_of_zilin | - | 15, 3 | 35 | political_power 25; event zin_worshipdom.2 | base 10 |
| `guardians_of_the_hills` | Guardians of the Hills | temple_masons | - | 12, 4 | 70 | manpower 3000; equipment infantry_equipment 1000; army_experience 10; add_spirit guardians_of_the_hills | base 5; x3 after zin_war_of_last_crowns |
| `friends_among_the_elves` | Friends Among the Elves | the_open_door | - | 15, 4 | 35 | event_for Magical Forest zin_worshipdom.3 | base 10 |
| `hill_wardens` | Hill Wardens | guardians_of_the_hills | - | 12, 5 | 35 | building bunker 2 capital; building bunker 1 random_owned | base 5; x3 at war |
| `the_deliverers_peace` | The Deliverer's Peace | hill_wardens AND (friends_among_the_elves OR letters_to_every_court) | - | 13, 6 | 70 | add_spirit deliverers_peace; political_power 100 | base 10 |

### B. The Houses of the First Light

**Purpose:** spread the Deliverer's charity, and with it the network, across Erdae.
**Opens:** at the start (root). The root unlocks the decision *Open a House* (`zin_afrit_open_house`).
**Drives:** `zin_footholds` in every region; the foothold caps (`zin_worshipdom_cap4`, `zin_worshipdom_cap5`); the debt and famine decisions. *Houses Under the Sun* matters for the story: footholds among the Gala Elves let Afrit learn of Eindil in time.

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `houses_of_the_first_light` | The Houses of the First Light | - | - | 2, 0 | 70 | political_power 25; flag zin_worshipdom_houses_open (unlocks Open a House decisions); call zin_afrit_spread_footholds {region: Middle Lands, value: 1, count: 4, below: 2} | base 40; historical: second focus |
| `grain_of_charity` | Grain of Charity | houses_of_the_first_light | - | 1, 1 | 35 | political_power 25; call zin_afrit_spread_footholds {region: Middle Lands, value: 1, count: 6, below: 3} | base 15 |
| `physicians_of_the_houses` | Physicians of the Houses | houses_of_the_first_light | - | 3, 1 | 35 | call zin_afrit_spread_footholds {region: Middle Lands, value: 1, count: 3, below: 3}; for_country Selen: call zin_afrit_add_footholds {value: 1} | base 15 |
| `keepers_of_the_birth_rolls` | Keepers of the Birth Rolls | grain_of_charity | - | 0, 2 | 70 | call zin_afrit_raise_seat {seat: whispers, value: 1}; flag zin_worshipdom_birth_rolls (Hear Confession costs 25% less) | base 10 |
| `hospitals_of_parim` | The Hospitals of Parim | grain_of_charity AND physicians_of_the_houses | - | 2, 2 | 35 | political_power 50; for_country Aenor: call zin_aenor_add_council_influence {value: 5} | base 20; historical: 1750 |
| `chairs_at_the_universities` | Chairs at the Universities | physicians_of_the_houses | - | 4, 2 | 35 | political_power 25; call zin_afrit_raise_seat {seat: censers, value: 1}; for_country Selen: call zin_afrit_add_footholds {value: 1} | base 10 |
| `houses_in_the_north` | Houses in the North | keepers_of_the_birth_rolls | - | 0, 3 | 70 | call zin_afrit_spread_footholds {region: North Lands, value: 1, count: 5, below: 3}; for_country Lerendor: call zin_afrit_add_footholds {value: 1} | base 8 |
| `houses_across_the_sea` | Houses Across the Sea | hospitals_of_parim | - | 2, 3 | 70 | call zin_afrit_spread_footholds {region: West Lands, value: 1, count: 5, below: 3}; for_country Gunwaith: call zin_afrit_add_footholds {value: 1}; for_country Girdon: call zin_afrit_add_footholds {value: 1} | base 8 |
| `houses_on_the_caravan_roads` | Houses on the Caravan Roads | chairs_at_the_universities | - | 4, 3 | 70 | call zin_afrit_spread_footholds {region: East Lands, value: 1, count: 6, below: 4} | base 15 |
| `houses_of_the_islands` | Houses of the Islands | houses_in_the_north | - | 0, 4 | 35 | call zin_afrit_spread_footholds {region: Triton's Islands, value: 1, count: 4, below: 2}; call zin_afrit_spread_footholds {region: Islands of the South, value: 1, count: 3, below: 2} | base 5 |
| `houses_under_the_sun` | Houses Under the Sun | houses_across_the_sea | - | 2, 4 | 35 | call zin_afrit_spread_footholds {region: Lands of the Sun, value: 1, count: 4, below: 2}; for_country Gala Elves: call zin_afrit_add_footholds {value: 1} | base 10; x3 after zin_eindil_war_king; historical: 1751 |
| `the_famine_stores` | The Famine Stores | houses_on_the_caravan_roads | - | 4, 4 | 35 | political_power 25; flag zin_worshipdom_famine_stores (unlocks Open the Famine Stores) | base 8 |
| `the_great_almonry` | The Great Almonry | (houses_of_the_islands OR houses_under_the_sun) | - | 1, 5 | 70 | add_spirit great_almonry; flag zin_worshipdom_cap4 (footholds abroad may reach 4) | base 10 |
| `debts_of_gratitude` | Debts of Gratitude | (houses_under_the_sun OR the_famine_stores) | - | 3, 5 | 35 | political_power 50; flag zin_worshipdom_debts (unlocks Call In a Debt) | base 8 |
| `houses_without_number` | Houses Without Number | the_great_almonry AND debts_of_gratitude | - | 2, 6 | 70 | swap_spirit great_almonry -> houses_without_number; flag zin_worshipdom_cap5 (footholds abroad may reach 5) | base 10 |

### C. The Seat of Whispers

**Purpose:** the Council's couriers, confessors and agents, and the long courtship of the East Lands that becomes Afrit's reserve seat.
**Opens:** at the start (root).
**Drives:** `zin_afrit_seat_whispers`; intelligence decisions; the eastern caps (`zin_worshipdom_eastern_chapter`, `zin_worshipdom_eastern_reserve`); early warning of Eindil (`zin_worshipdom_western_ears`, `zin_worshipdom_early_warning`). Its end feeds the Eastern Throne branch.

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `seat_of_whispers` | The Couriers' Chapter / *The Seat of Whispers* | - | - | 8, 0 | 35 | call zin_afrit_raise_seat {seat: whispers, value: 1}; tooltip: Corvel may be hired as an advisor | base 25 |
| `pilgrim_couriers` | Pilgrim Couriers | seat_of_whispers | - | 7, 1 | 35 | add_spirit couriers | base 10 |
| `confessors_abroad` | Confessors at Foreign Courts | seat_of_whispers | - | 9, 1 | 35 | call zin_afrit_raise_seat {seat: whispers, value: 1}; flag zin_worshipdom_confessors (unlocks Hear Confession) | base 15 |
| `ears_in_sonargur` | Friends in Sonargur / *Ears in Sonargur* | pilgrim_couriers | - | 6, 2 | 35 | for_country Lerendor: call zin_afrit_add_footholds {value: 1}; event zin_worshipdom.4 | base 8 |
| `watchers_of_the_south` | Pilgrims to Mirolon / *Watchers of the South* | pilgrim_couriers | - | 8, 2 | 35 | for_country Mirolon: call zin_afrit_add_footholds {value: 1}; event zin_worshipdom.5 | base 5 |
| `the_eastern_chapter` | The Eastern Chapter / *The Eastern Branch* | confessors_abroad | - | 10, 2 | 70 | call zin_afrit_spread_footholds {region: East Lands, value: 1, count: 4, below: 4}; flag zin_worshipdom_eastern_chapter | base 20; historical: 1749 |
| `ledger_of_debts` | The Ledger of Debts | (ears_in_sonargur OR watchers_of_the_south) | - | 7, 3 | 35 | political_power 50; call zin_afrit_add_veil {value: 5} | base 10 |
| `gifts_to_eastern_kings` | Gifts to the Eastern Kings | the_eastern_chapter | - | 10, 3 | 35 | political_power -50; call zin_afrit_spread_footholds {region: East Lands, value: 1, count: 3, min: 3, below: 5} | base 15 |
| `merchants_gossip` | Merchants' Gossip / *Ears in the West* | ledger_of_debts | - | 6, 4 | 35 | flag zin_worshipdom_western_ears (zin_afrit.30 fires; Word from the Lands of the Sun arrives 15 days sooner) | base 5; x4 after zin_eindil_awake |
| `the_quiet_hands` | Hands of Mercy / *The Silent Knives* | ledger_of_debts | - | 8, 4 | 35 | flag zin_worshipdom_quiet_hands (unlocks Silence a Dissenter); call zin_afrit_add_veil {value: 3} | base 10 |
| `the_long_courtship` | The Long Courtship | gifts_to_eastern_kings | - | 10, 4 | 70 | call zin_afrit_spread_footholds {region: East Lands, value: 1, count: 10, min: 3, below: 5}; flag zin_worshipdom_eastern_reserve | base 15; historical: 1751 |
| `every_road_has_ears` | Every Road a Pilgrim Road / *Every Road Has Ears* | the_quiet_hands AND (merchants_gossip OR the_long_courtship) | - | 8, 5 | 70 | swap_spirit couriers -> every_road; call zin_afrit_raise_seat {seat: whispers, value: 1} | base 10 |
| `the_whisper_network` | The Pilgrim Network / *The Whisper Network* | every_road_has_ears | - | 8, 6 | 35 | political_power 75; flag zin_worshipdom_early_warning (Word from the Lands of the Sun arrives 15 days sooner, cumulative) | base 8 |

### D. The Seat of Seals

**Purpose:** the Council's hold on Aenor's government through Chancellor Merovan, and the Golden King's murder.
**Opens:** at the start (root). *Prayers for the King* waits until 1 Sowing 4A 1748 (`1748.6.1`) so the first months stay quiet. *A Vigil for the King* and *Pray for Patience* are mutually exclusive: strike, or stay the hand. *The Seals Will Pass* and *A Pliant Heir* are mutually exclusive: crown Aurevan, or crown a puppet.
**Drives:** `zin_afrit_seat_seals`; Aenor's `zin_council_influence` and `zin_court_corruption` (through the Aenor spec's effects); `zin_afrit_regicide_plot`; events `zin_afrit.10`, `.11`, `.15`; the commitment flags read by `zin_afrit.20`.

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `seat_of_seals` | Friends at the Golden Court / *The Seat of Seals* | - | - | 19, 0 | 35 | call zin_afrit_raise_seat {seat: seals, value: 1}; for_country Aenor: call zin_aenor_add_council_influence {value: 3} | base 40; historical: second focus |
| `counsel_for_the_chancellor` | Counsel for the Chancellor / *Merovan's Seals* | seat_of_seals | - | 18, 1 | 35 | call zin_afrit_raise_seat {seat: seals, value: 1}; flag zin_worshipdom_merovan (unlocks Steer the Court); event zin_worshipdom.6 | base 30 |
| `buy_the_offices` | Purchase of Offices / *Buy the Offices He Sells* | seat_of_seals | - | 20, 1 | 35 | political_power -50; for_country Aenor: call zin_aenor_add_council_influence {value: 5}, call zin_aenor_add_court_corruption {value: 5} | base 25 |
| `ministers_from_the_houses` | Ministers from the Houses | counsel_for_the_chancellor | - | 17, 2 | 35 | for_country Aenor: call zin_aenor_add_council_influence {value: 5} | base 20 |
| `the_councils_verdict` | Prayers for the King / *The Council's Verdict* | counsel_for_the_chancellor AND buy_the_offices | - | 19, 2 | 35 | available: after 1748.6.1; event zin_afrit.10; call zin_afrit_add_plot {value: 10} | base 30; historical: Mistfall 1748 |
| `feed_the_kings_appetite` | Gifts for the Golden Court / *Feed the King's Appetite* | buy_the_offices | - | 21, 2 | 35 | political_power -25; for_country Aenor: call zin_aenor_add_court_corruption {value: 5} | base 10 |
| `patrons_of_the_lost_cause` | Patrons of the Lost Cause / *Watch the Lost Cause* | ministers_from_the_houses | - | 17, 3 | 35 | call zin_afrit_add_veil {value: 5}; global_flag zin_afrit_lost_cause_watched | base 25; historical: 1749 |
| `a_vigil_for_the_king` | A Vigil for the King / *Choose the Instrument* | the_councils_verdict | pray_for_patience | 19, 3 | 35 | event zin_afrit.11 | base 30; 0 under rule DORMANT |
| `pray_for_patience` | Pray for Patience / *Stay the Hand* | the_councils_verdict | a_vigil_for_the_king | 20, 3 | 35 | flag zin_worshipdom_stay_hand; call zin_afrit_add_plot {value: -20}; call zin_afrit_add_veil {value: 10} | base 0; 50 under rule DORMANT |
| `hear_the_dominions` | Hear the Dominions / *Blame the King's Taxes* | feed_the_kings_appetite | - | 21, 3 | 35 | call zin_afrit_add_veil {value: 2}; call zin_worshipdom_blame_taxes (each Concord dominion: zin_aenor_add_concord_loyalty {value: -3}) | base 8 |
| `long_live_the_golden_king` | Long Live the Golden King / *Keep the Golden King* | pray_for_patience | - | 21, 4 | 35 | available: not zin_golden_king_dead; global_flag zin_afrit_kingdom_behind_throne; for_country Aenor: call zin_aenor_add_council_influence {value: 10}; call zin_afrit_add_veil {value: 10} | base 0; 50 under rule DORMANT |
| `remedies_of_the_royal_physicians` | Remedies of the Royal Physicians / *The Physician's Hand* | a_vigil_for_the_king | - | 18, 4 | 35 | call zin_afrit_add_plot {value: 15}; if flag zin_worshipdom_instrument_physician: call zin_afrit_add_plot {value: 10} | base 30 |
| `a_steady_hand_on_the_seals` | A Steady Hand on the Seals / *Secure the Seals* | a_vigil_for_the_king | - | 20, 4 | 35 | available: check zin_aenor_council_dominant; call zin_afrit_add_plot {value: 15} | base 30 |
| `blessing_of_the_kings_table` | Blessing of the King's Table / *Silence the Tasters* | remedies_of_the_royal_physicians AND patrons_of_the_lost_cause | - | 17, 5 | 35 | call zin_afrit_add_plot {value: 15}; call zin_afrit_add_veil {value: -3} | base 30 |
| `hymns_for_a_new_reign` | Hymns for the Crown / *Ready the Temples* | a_steady_hand_on_the_seals | - | 20, 5 | 35 | call zin_afrit_add_plot {value: 10}; flag zin_worshipdom_temples_ready | base 30 |
| `the_mistfall_vigil` | The Mistfall Vigil / *The Night of Mistfall* | blessing_of_the_kings_table AND hymns_for_a_new_reign | - | 19, 6 | 35 | available: zin_afrit_regicide_plot >= 80, not zin_afrit_regicide_exposed, not zin_golden_king_dead; event zin_afrit.15 | base 40; historical: done by Rainwake 1750 |
| `the_seals_will_pass` | Keepers of the Seals / *Commit to the Crown* | the_mistfall_vigil | a_pliant_heir | 18, 7 | 35 | flag zin_worshipdom_commit_crown (zin_afrit.20 crowns Aurevan without a choice) | base 40; 0 under rule DORMANT |
| `a_pliant_heir` | A Tutor for the Heir / *A Pliant Heir* | the_mistfall_vigil | the_seals_will_pass | 20, 7 | 35 | flag zin_worshipdom_commit_heir (zin_afrit.20 crowns a puppet heir) | base 5; 0 under HISTORICAL |

### E. The Seat of Censers

**Purpose:** worship and the public face. This is where the hub buys back its veil.
**Opens:** at the start (root).
**Drives:** `zin_afrit_seat_censers`; `zin_afrit_veil`; `zin_worshipdom_oaths_renewed` (Crown of Witnesses); `zin_worshipdom_proclamation_ready` (a smoother crowning); `zin_afrit_scholars_bought` (read by the Eindil spec).

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `seat_of_censers` | The Censer Chapter / *The Seat of Censers* | - | - | 23, 0 | 35 | call zin_afrit_raise_seat {seat: censers, value: 1}; tooltip: Ilvane may be hired as an advisor | base 25 |
| `hymns_of_deliverance` | Hymns of Deliverance | seat_of_censers | - | 22, 1 | 35 | add_spirit hymns; call zin_afrit_add_veil {value: 3} | base 15 |
| `miracles_at_the_wells` | Miracles at the Wells | seat_of_censers | - | 24, 1 | 35 | political_power 50; call zin_afrit_add_veil {value: 5} | base 15 |
| `tutors_for_princes` | Tutors for Princes | hymns_of_deliverance | - | 22, 2 | 70 | call zin_afrit_raise_seat {seat: censers, value: 1}; call zin_afrit_spread_footholds {region: any, value: 1, count: 4, min: 2, below: 4} | base 15 |
| `remember_the_jubilee` | Remember the Jubilee | miracles_at_the_wells | - | 24, 2 | 35 | for_country Aenor: stability 0.03, call zin_aenor_add_council_influence {value: 3} | base 10 |
| `renew_the_thousand_oaths` | Renew the Thousand Oaths | tutors_for_princes AND remember_the_jubilee | - | 23, 3 | 70 | political_power 50; call zin_afrit_add_veil {value: 10}; flag zin_worshipdom_oaths_renewed (Crown of Witnesses graces doubled in the realm Aurevan rules) | base 15 |
| `endow_the_genealogists` | Endow the Genealogists / *Quiet the Scholars* | renew_the_thousand_oaths | - | 22, 4 | 35 | call zin_afrit_add_veil {value: 5}; global_flag zin_afrit_scholars_bought | base 10; x3 after zin_eindil_named |
| `doctrine_of_deliverance` | The Doctrine of Deliverance | renew_the_thousand_oaths | - | 24, 4 | 35 | add_spirit doctrine_of_deliverance | base 10 |
| `the_radiant_face` | The Radiant Face / *The Veil of Aurevan* | endow_the_genealogists AND doctrine_of_deliverance | - | 23, 5 | 70 | add_spirit radiant_face (veil losses halved); call zin_afrit_add_veil {value: 15} | base 15; x3 when zin_afrit_veil < 50 |
| `a_god_for_an_empty_throne` | The Deliverer Guards the Crown / *A God for an Empty Throne* | the_radiant_face | - | 23, 6 | 35 | flag zin_worshipdom_proclamation_ready (crowning adds +10 council influence and Aenor stability 0.10); call zin_afrit_add_plot {value: 10} | base 15 |

### F. The Seat of Relics

**Purpose:** the artifacts, the unending thief, and the hunt for Glo and the brother.
**Opens:** at the start (root). The Yeldenne focuses become urgent (AI ×5) after `zin_afrit_knows_brother`.
**Drives:** `zin_afrit_seat_relics`; attunement flags and `zin_afrit_graces`; the thief decision; the voyage bonuses (`zin_worshipdom_ships_ready`, `zin_worshipdom_cold_maps`, `zin_worshipdom_hunters`); hiding the wound; the palace wards. The voyage itself is the decision `zin_afrit_northern_voyage`, so the AI and the historical path never depend on this branch.

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `seat_of_relics` | The Reliquary Chapter / *The Seat of Relics* | - | - | 27, 0 | 35 | call zin_afrit_raise_seat {seat: relics, value: 1} | base 15 |
| `the_reliquary_vaults` | The Reliquary Vaults | seat_of_relics | - | 26, 1 | 35 | call zin_afrit_raise_seat {seat: relics, value: 1}; event zin_worshipdom.7 | base 10 |
| `a_guest_who_does_not_age` | A Guest of the Reliquary / *The Unending Thief* | seat_of_relics | - | 28, 1 | 35 | event zin_worshipdom.8 (Sevrin joins as an advisor) | base 10 |
| `doors_in_the_hermitage_walls` | Doors in the Hermitage Walls / *Attune the Ring of Doors* | the_reliquary_vaults | - | 26, 2 | 35 | call zin_afrit_attune_artifact {artifact: ring} | base 10 |
| `oaths_in_gold` | Oaths in Gold / *Attune the Crown of Witnesses* | the_reliquary_vaults | - | 27, 2 | 35 | call zin_afrit_attune_artifact {artifact: crown} | base 10 |
| `the_first_seal` | The First Seal / *Attune the Bracelet of the First Seal* | a_guest_who_does_not_age | - | 28, 2 | 35 | call zin_afrit_attune_artifact {artifact: bracelet} | base 10 |
| `the_thiefs_errands` | The Thief's Errands | a_guest_who_does_not_age | - | 29, 2 | 35 | flag zin_worshipdom_thief (unlocks Send the Thief) | base 5 |
| `lamps_in_the_deep_vault` | Lamps in the Deep Vault / *The Necklace Wakes* | doors_in_the_hermitage_walls AND oaths_in_gold AND the_first_seal | - | 27, 3 | 70 | call zin_afrit_attune_artifact {artifact: necklace}; call zin_afrit_raise_seat {seat: relics, value: 1}; call zin_world_add_gathering_dark {value: 2} | base 15; historical: by 1752 |
| `rumours_of_a_green_light` | Rumours of a Green Light / *Seek Glo* | lamps_in_the_deep_vault | - | 27, 4 | 35 | flag zin_worshipdom_seeks_glo; event zin_worshipdom.9 | base 10; x5 after zin_eindil_named |
| `ships_for_the_northern_pilgrims` | Ships for the Northern Pilgrims / *Ships for the North* | rumours_of_a_green_light | - | 26, 5 | 35 | flag zin_worshipdom_ships_ready (ambush strength +1) | base 10; x5 after zin_afrit_knows_brother |
| `maps_of_the_cold_coast` | Maps of the Cold Coast | rumours_of_a_green_light | - | 28, 5 | 35 | flag zin_worshipdom_cold_maps (the voyage north takes 30 days, not 60) | base 10; x5 after zin_afrit_knows_brother |
| `hunters_on_the_ice` | Guides for the Ice / *The Ambush Prepared* | (ships_for_the_northern_pilgrims OR maps_of_the_cold_coast) | - | 27, 6 | 35 | flag zin_worshipdom_hunters (ambush strength +1) | base 10; x5 after zin_afrit_knows_brother |
| `rest_at_the_hermitage` | Rest at the Hermitage / *Hide the Wound* | hunters_on_the_ice | - | 27, 7 | 35 | if zin_afrit_wounded: call zin_worshipdom_hide_wound (removes idea zin_afrit_deliverer_rests from the realm Aurevan rules), call zin_afrit_add_veil {value: 5}; else political_power 50 | base 10; x5 when zin_afrit_wounded |
| `wards_of_the_palace` | Wards of the Palace | rest_at_the_hermitage | - | 27, 8 | 70 | add_spirit palace_wards; flag zin_worshipdom_palace_wards (each palace stage: Eindil side -10%) | base 10; x3 after zin_afrit_returned |

### G. The Crowned Deliverer

**Purpose:** rule Aenor openly as its god-king, silence dissent, prepare for the brother's warnings, and decide whether to stand in Parim.
**Opens:** after *The Seals Will Pass*, when `zin_aurevan_crowned` is set. *Parim Shall Not Fall* needs `zin_war_of_last_crowns` and is exclusive with *Roads to the Dawn*: stand, or prepare to flee.
**Drives:** Royal Edicts (`zin_worshipdom_edicts_of_arms`); Merovan's regency during the voyage (`zin_worshipdom_merovan_charge`); `zin_afrit_impostor_denounced` (read by the Eindil spec); `zin_afrit_stand_in_parim` (Ashen Throne path c).

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `first_of_his_name` | Blessings on the Throne / *First of His Name* | the_seals_will_pass | - | 18, 8 | 35 | available: zin_aurevan_crowned; add_spirit crowned_deliverer; political_power 100 | base 50 |
| `a_keeper_for_the_hermitage` | A Keeper for the Hermitage | first_of_his_name | - | 17, 9 | 35 | stability 0.05; event zin_worshipdom.11 | base 20 |
| `oaths_of_the_royal_army` | Blessing the Royal Army / *Oaths of the Royal Army* | first_of_his_name | - | 18, 9 | 35 | for_country Aenor: army_experience 15, war_support 0.05; flag zin_worshipdom_edicts_of_arms (unlocks Edict of Arms) | base 20 |
| `peace_for_the_realm` | Peace for the Realm / *Silence the Claimants* | first_of_his_name | - | 19, 9 | 35 | for_country Aenor: call zin_aenor_add_council_influence {value: 10}; call zin_afrit_add_veil {value: -5}; call zin_world_add_gathering_dark {value: 3} | base 20 |
| `the_chancellors_charge` | The Chancellor's Charge | a_keeper_for_the_hermitage | - | 17, 10 | 35 | flag zin_worshipdom_merovan_charge (Aenor loses no stability while the Deliverer is away at Yeldenne) | base 15; x5 after zin_afrit_knows_brother |
| `the_coronation_oaths` | Oaths of the Faithful / *The Coronation Oaths* | oaths_of_the_royal_army | - | 18, 10 | 35 | call zin_afrit_attune_artifact {artifact: crown}; for_country Aenor: stability 0.05 | base 15 |
| `denounce_the_impostor` | Denounce the Impostor | peace_for_the_realm | - | 19, 10 | 35 | available: zin_glo_with_eindil; call zin_afrit_add_veil {value: 10}; global_flag zin_afrit_impostor_denounced | base 40; historical: 1754 |
| `new_god_of_men` | New God of Men | the_chancellors_charge AND the_coronation_oaths | - | 17, 11 | 70 | swap_spirit crowned_deliverer -> new_god_of_men; for_country Aenor: stability 0.05 | base 15 |
| `parim_shall_not_fall` | Parim Shall Not Fall / *Stand in Parim* | (the_coronation_oaths OR denounce_the_impostor) | roads_to_the_dawn | 19, 11 | 35 | available: zin_war_of_last_crowns; global_flag zin_afrit_stand_in_parim; for_country Aenor: add_spirit parim_shall_not_fall, building bunker 2 site parim | base 0 HISTORICAL; 60 ASHEN; 20 FREE |

"Denounce the Impostor" names no one: the description reads "A stranger claims royal blood and slanders the Deliverer. The crown calls him what he is: an impostor." It is safe before the reveal.

### K. The Kingdom Behind the Throne

**Purpose:** the alternative in which the Council never takes the crown. It keeps ruling through the Golden King or a puppet heir.
**Opens:** after *A Pliant Heir* or *Long Live the Golden King*.
**Drives:** `zin_afrit_kingdom_behind_throne`; council influence; Royal Edicts without the crown (`zin_worshipdom_edicts_unc`); the world systems' proposed outcome of a surviving Golden Court (not an ending flag of this spec).

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_quiet_court` | The Quiet Court | (a_pliant_heir OR long_live_the_golden_king) | - | 21, 8 | 35 | for_country Aenor: call zin_aenor_add_council_influence {value: 15}; political_power 50; event zin_worshipdom.12 | base 50 when available |
| `keepers_of_the_crown` | Keepers of the Crown | the_quiet_court | - | 21, 9 | 35 | call zin_afrit_add_veil {value: 10}; flag zin_worshipdom_edicts_unc (Royal Edicts usable without the crown at double cost) | base 30 |
| `the_endless_regency` | A Wise Regency / *The Endless Regency* | keepers_of_the_crown | - | 21, 10 | 70 | for_country Aenor: call zin_aenor_add_council_influence {value: 15}; add_spirit endless_regency | base 30 |
| `a_kingdom_without_war` | A Kingdom Without War | the_endless_regency | - | 21, 11 | 70 | available: after 1755.1.1, not zin_afrit_revealed; call zin_afrit_add_veil {value: 20}; tooltip: counts toward the proposed outcome of a surviving Golden Court (world systems) | base 30 |

### H. The Eastern Throne

**Purpose:** the reserve seat becomes a kingdom: the flight east, the King of the East, the eastern host and the return.
**Opens:** *Roads to the Dawn* after *The Long Courtship*, once Aurevan is crowned or revealed. The rest opens on story flags set by the mechanic (`zin_afrit_abandoned_aenor`, `zin_afrit_king_of_east`, `zin_afrit_returned`). The beats themselves are events, so the historical path does not depend on these focuses; the focuses add strength and choices.
**Drives:** eastern acceptance (`zin_worshipdom_roads_east`, second embassy); `zin_afrit_raise_eastern_host`; `zin_afrit_return`; the cliff (`zin_afrit.61`). War goals appear only here and only after `zin_war_of_last_crowns` or `zin_afrit_king_of_east`.

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `roads_to_the_dawn` | Roads to the Dawn | the_long_courtship | parim_shall_not_fall | 10, 7 | 35 | available: zin_aurevan_crowned or zin_afrit_revealed; call zin_afrit_spread_footholds {region: East Lands, value: 1, count: 4, min: 3, below: 5}; flag zin_worshipdom_roads_east (eastern acceptance +20%) | base 30; historical: 1754 |
| `a_court_in_the_east` | Embassies to the Dawn / *A Court in the East* | roads_to_the_dawn | - | 10, 8 | 35 | available: zin_afrit_abandoned_aenor; call zin_worshipdom_second_embassy (every country with zin_afrit_refused_east gets zin_afrit.51 again at +25%) | base 50 |
| `king_of_the_east` | A Crown of Dawn / *King of the East* | a_court_in_the_east | - | 10, 9 | 35 | available: zin_afrit_king_of_east; add_spirit eastern_throne; political_power 100 | base 60 |
| `those_who_refused` | Letters to the Doubtful / *Those Who Refused* | king_of_the_east | - | 8, 10 | 35 | call zin_afrit_wargoal_refuser (wargoal on the East Lands refuser with the most states) | base 10 |
| `levies_of_the_caravan_kings` | Pilgrims from the Caravan Roads / *Levies of the Caravan Kings* | king_of_the_east | - | 9, 10 | 35 | call zin_afrit_raise_eastern_host {divisions: 6} | base 40 |
| `the_eastern_war_council` | Council of the Dawn / *The Eastern War Council* | king_of_the_east | - | 11, 10 | 35 | army_experience 25; event zin_afrit.54 (Aurevan takes the field-marshal role) | base 30 |
| `ships_of_the_eastern_seas` | Ships of the Eastern Seas | king_of_the_east | - | 12, 10 | 35 | navy_experience 20; timed_spirit eastern_fleets 365 days | base 15 |
| `the_host_of_the_east` | Gathering of the Faithful / *The Host of the East* | levies_of_the_caravan_kings AND the_eastern_war_council | - | 10, 11 | 70 | add_spirit host_of_the_east; call zin_afrit_raise_eastern_host {divisions: 6}; call zin_world_add_gathering_dark {value: 5} | base 40; historical: 1757 |
| `through_the_elven_woods` | Pilgrim Paths Through the Woods / *Strike the Magical Lands* | the_host_of_the_east | - | 9, 12 | 35 | available: zin_war_of_last_crowns; claims_on Magical Forest; wargoal {target: Magical Forest, type: take_state} | base 0 HISTORICAL; 15 FREE and ASHEN |
| `the_return` | The Pilgrims Return / *The Return from the East* | the_host_of_the_east | - | 11, 12 | 35 | available: zin_afrit_king_of_east and (zin_volgan_body_destroyed or zin_zol_withdrawn or after 1758.1.1); call zin_afrit_return | base 60; historical: early 1758 |
| `brother_against_brother` | The Field Before Parim / *Brother Against Brother* | the_return | - | 11, 13 | 35 | available: zin_afrit_returned and at war with the country that has zin_eindil; event zin_afrit.61 | base 60; historical: 1758 |

### U. Unmasked

**Purpose:** open worship and fear once the secret is out, or a deliberate unmasking when Afrit feels strong enough.
**Opens:** after *Houses Without Number*; *Cast Off the Mask* needs `zin_afrit_revealed`, or the crown, all four artifacts and Censers 4 or more (voluntary reveal). It is the hub's answer to an early reveal and a tool for the Ashen Throne.
**Drives:** `zin_afrit_reveal {voluntary: yes}`; *Raise the Faithful* civil wars; purge resistance (`zin_worshipdom_houses_fortified`).

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `cast_off_the_mask` | The Deliverer's Radiance / *Cast Off the Mask* | houses_without_number | - | 2, 8 | 35 | available: zin_afrit_revealed or (zin_aurevan_crowned, zin_afrit_artifacts = 4, zin_afrit_seat_censers >= 4); if not zin_afrit_revealed: call zin_afrit_reveal {voluntary: yes}; political_power 100 | base 0 HISTORICAL before reveal; 20 after reveal; 40 ASHEN |
| `the_faithful_rise` | The Faithful Gather / *The Faithful Rise* | cast_off_the_mask | - | 1, 9 | 35 | flag zin_worshipdom_faithful_rise (unlocks Raise the Faithful) | base 10 |
| `fear_and_worship` | Awe and Worship / *Fear and Worship* | cast_off_the_mask | - | 3, 9 | 35 | add_spirit fear_and_worship | base 20 |
| `servants_beyond_the_veil` | Wardens Unseen / *Servants Beyond the Veil* | the_faithful_rise AND fear_and_worship | - | 2, 10 | 70 | event zin_worshipdom.10; call zin_world_add_gathering_dark {value: 3} | base 15 |
| `every_house_a_fortress` | Every House a Refuge / *Every House a Fortress* | servants_beyond_the_veil | - | 2, 11 | 35 | flag zin_worshipdom_houses_fortified (a purge lowers footholds by 1, never below 2) | base 15 |

The public faces of this branch read as an ordinary flowering of worship. Its true names appear only after the reveal.

### I. The Ashen Throne

**Purpose:** the endgame. Afrit claims all Erdae, fortifies the palace, restores the old council everywhere, and reaches the Ashen Throne if he survives.
**Opens:** after *Brother Against Brother* (the return path) or *Parim Shall Not Fall* (the stand path). *Lord of All Erdae* needs `zin_afrit_claims_erdae`, or `zin_afrit_stand_in_parim` with Parim held after 1 Deepwinter 4A 1757.
**Drives:** palace wards (fewer successful palace stages for Eindil's side); footholds; the ending through `zin_afrit_ashen_throne_ready`.

| key | name (public / *after reveal*) | prerequisites | exclusive with | x, y | days | effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `lord_of_all_erdae` | Light Over All Erdae / *Lord of All Erdae* | (brother_against_brother OR parim_shall_not_fall) | - | 14, 14 | 35 | available: zin_afrit_claims_erdae or (zin_afrit_stand_in_parim, check zin_afrit_holds_parim, after 1757.1.1); call zin_afrit_claim_middle_lands; political_power 100 | base 60 when available |
| `the_gods_palace` | The God's Palace | lord_of_all_erdae | - | 13, 15 | 35 | if not spirit palace_wards: add_spirit palace_wards; else flag zin_worshipdom_palace_wards_2 (a further -5% per stage) | base 40 |
| `the_old_council_resumes` | The Houses Restored / *The Old Council Resumes* | lord_of_all_erdae | - | 15, 15 | 70 | call zin_afrit_spread_footholds {region: any, value: 1, count: 8, min: 2, below: 5}; add_spirit gods_court | base 40 |
| `the_ashen_throne` | The Radiant Throne / *The Ashen Throne* | the_gods_palace AND the_old_council_resumes | - | 14, 16 | 70 | available: check zin_afrit_ashen_throne_ready; call zin_world_reach_ending {ending: ashen_throne} | base 100 when available |

### Bypass rules

| Focus | Bypassed when |
| --- | --- |
| `a_vigil_for_the_king`, `remedies_of_the_royal_physicians`, `a_steady_hand_on_the_seals`, `blessing_of_the_kings_table`, `hymns_for_a_new_reign`, `the_mistfall_vigil` | `zin_golden_king_dead` (the plot is moot) |
| `the_seals_will_pass` | `zin_aurevan_crowned` (so the Crowned branch opens however the crowning came) |
| `a_pliant_heir` | `zin_afrit_kingdom_behind_throne` and `zin_golden_king_dead` |
| `rumours_of_a_green_light`, `ships_for_the_northern_pilgrims`, `maps_of_the_cold_coast`, `hunters_on_the_ice` | `zin_afrit_at_yeldenne` |
| `denounce_the_impostor` | `zin_afrit_revealed` |
| `roads_to_the_dawn`, `a_court_in_the_east` | `zin_afrit_king_of_east` |

### Spirits

Ideas compile to `zin_worshipdom_<key>`. All names are mask-safe.

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `temple_state` | The Temple-State of Zilin | `political_power_gain` 0.5, `stability_factor` 0.10, `recruitable_population_factor` -0.5, `opinion_gain_monthly_factor` 0.25 | Start; permanent |
| `pilgrim_roads` | The Pilgrim Roads | `civilian_intel_factor` 0.15, `production_speed_buildings_factor` 0.10, `trade_opinion_factor` 0.15 | *Mend the Pilgrim Roads* |
| `scriptorium` | The Hermitage Scriptorium | `research_speed_factor` 0.05 | *The Hermitage Scriptorium* |
| `healers_of_zilin` | Healers of Zilin | `monthly_population` 0.10, `recruitable_population_factor` 0.10 | *Healers of Zilin* |
| `open_letters` | Letters to Every Court | `improve_relations_maintain_cost_factor` -0.30, `opinion_gain_monthly_factor` 0.30 | *Letters to Every Court*; 365 days |
| `guardians_of_the_hills` | Guardians of the Hills | `army_defence_factor` 0.10, `dig_in_speed_factor` 0.20 | *Guardians of the Hills* |
| `deliverers_peace` | The Deliverer's Peace | `stability_factor` 0.05, `political_power_factor` 0.10, `ai_focus_peaceful_factor` 0.5 | *The Deliverer's Peace*; removed by `zin_afrit_flee_east` |
| `great_almonry` | The Great Almonry | `political_power_gain` 0.25, `opinion_gain_monthly_factor` 0.15, `improve_relations_maintain_cost_factor` -0.15 | *The Great Almonry*; swapped by *Houses Without Number* |
| `houses_without_number` | Houses Without Number | `political_power_gain` 0.5, `opinion_gain_monthly_factor` 0.30, `improve_relations_maintain_cost_factor` -0.25 | *Houses Without Number* |
| `couriers` | Pilgrim Couriers | `civilian_intel_factor` 0.20, `army_intel_factor` 0.10, `intel_network_gain_factor` 0.20 | *Pilgrim Couriers*; swapped by *Every Road Has Ears* |
| `every_road` | Every Road a Pilgrim Road | `civilian_intel_factor` 0.35, `army_intel_factor` 0.20, `intel_network_gain_factor` 0.40, `operation_cost` -0.20 | *Every Road Has Ears* |
| `hymns` | Hymns of Deliverance | `stability_factor` 0.05, `party_popularity_stability_factor` 0.10 | *Hymns of Deliverance* |
| `doctrine_of_deliverance` | The Doctrine of Deliverance | `political_power_factor` 0.10, `drift_defence_factor` 0.20 | *The Doctrine of Deliverance* |
| `radiant_face` | The Radiant Face | `drift_defence_factor` 0.20, `enemy_operative_detection_chance_factor` 0.25; veil losses halved (checked by `zin_afrit_add_veil`) | *The Radiant Face*; removed by the reveal |
| `palace_wards` | Wards of the Palace | `army_core_defence_factor` 0.10; palace stages -10% (with the flag) | *Wards of the Palace* or *The God's Palace* |
| `crowned_deliverer` | The Throne Blessed | `political_power_gain` 0.5, `opinion_gain_monthly_factor` 0.20 | *First of His Name*; swapped by *New God of Men* |
| `new_god_of_men` | New God of Men | `political_power_gain` 0.75, `opinion_gain_monthly_factor` 0.25, `stability_factor` 0.05 | *New God of Men*; removed by `zin_afrit_flee_east` |
| `parim_shall_not_fall` | Parim Shall Not Fall | `army_core_defence_factor` 0.15, `defensive_war_stability_factor` 0.20, `war_support_factor` 0.10 | Added to **Aenor** by *Parim Shall Not Fall*; removed if Aurevan leaves Aenor |
| `endless_regency` | A Wise Regency | `political_power_gain` 0.5, `stability_factor` 0.05 | *The Endless Regency*; removed by the reveal |
| `eastern_throne` | Banners of the Dawn | `command_power_gain` 0.2, `army_morale_factor` 0.05, `conscription` 0.01, `faction_trade_opinion_factor` 0.20 | *King of the East*; removed by `zin_afrit_die` |
| `eastern_fleets` | Ships of the Eastern Seas | `naval_invasion_capacity` 20, `invasion_preparation` -0.25 | *Ships of the Eastern Seas*; 365 days |
| `host_of_the_east` | The Gathered Faithful | `army_org_factor` 0.05, `army_attack_factor` 0.05, `training_time_army_factor` -0.15, `supply_consumption_factor` -0.05 | *The Host of the East*; removed by `zin_afrit_die` |
| `fear_and_worship` | Awe of the Faithful | `war_support_factor` 0.15, `stability_factor` 0.05, `resistance_growth` -0.20, `compliance_growth` 0.10 | *Fear and Worship* |
| `gods_court` | The God's Court | `political_power_gain` 1.0, `compliance_growth` 0.20, `required_garrison_factor` -0.20 | *The Old Council Resumes*; removed by `zin_afrit_die` |

Mechanic ideas (`zin_afrit_deliverer_rests`, `zin_afrit_unmasked`, `zin_afrit_necklace_drawn`, `zin_afrit_edict_of_arms`) and the dynamic modifiers `zin_afrit_houses` and `zin_afrit_graces` belong to the mechanics spec.

### Events (namespace `zin_worshipdom`)

All are fired by focuses. "Private" events go to the hub only.

| Id | Title | To | Fired by | Options |
| --- | --- | --- | --- | --- |
| .1 | Pilgrims at the Gate | hub | *The Hermitage of Zilin* | Feed them all (stability +0.02, -10 PP) / Bless them and send them home (+25 PP) |
| .2 | Envoys of Many Crowns | hub | *The Open Door* | Receive every envoy (opinion modifier `zin_worshipdom_open_door` +15 with all neighbours) / Receive the eastern envoys first (`zin_afrit_spread_footholds` East Lands +1, count 2; veil -2) |
| .3 | The Hermitage Asks for Quiet Borders | Magical Forest, public | *Friends Among the Elves* | Grant it (non-aggression pact with the Worshipdom; AI 70%) / The elves keep their own counsel (opinion of the Worshipdom -10; AI 30%) |
| .4 | The Mood of the Leren Court | hub, private | *Friends in Sonargur* | Feed their pride (Lerendor's `zin_strait_standing` -5 via the Lerendor spec's effect) / Counsel patience (+5) / Only listen (veil +2) |
| .5 | Report from the Passes | hub, private | *Pilgrims to Mirolon* | Warn Parim quietly (Aenor council influence +2, Mirolon opinion +10, veil -2) / Let the court laugh (veil +3) |
| .6 | A Letter from Merovan | hub, private | *Counsel for the Chancellor* | He serves well (+25 PP) / Remind him whom he serves (Aenor council influence +3) |
| .7 | The Reliquary Inventory | hub, private | *The Reliquary Vaults* | One option (+25 PP); lists the Necklace and the three lesser artifacts |
| .8 | The Guest Who Does Not Age | hub, private | `a_guest_who_does_not_age` | Give him a chair in the Council (`recruit_character` `zin_sevrin` as advisor) / Keep him on the road (*Send the Thief* cooldown halved; no advisor) |
| .9 | What the Council Knows of Yeldenne | hub, private | *Rumours of a Green Light* | Watch the castle (Word from the Lands of the Sun 10 days sooner) / Leave it until there is cause (+50 PP) |
| .10 | Servants Beyond the Veil | hub, private | *Servants Beyond the Veil* | Bind them to the hermitage (2 elite divisions "Bound Servants", template from the warfare spec) / Send them abroad (footholds +1 in 3 countries at 3+; Gathering Dark +2) |
| .11 | A Keeper for the Hermitage | hub | *A Keeper for the Hermitage* | One option; Ilvane keeps the hermitage while the Deliverer reigns |
| .12 | The Quiet Court | hub, private | *The Quiet Court* | Text by route: the King never knew (King kept) / a child on the throne (heir) |

Events of the story beats (`zin_afrit.*`) are listed in the mechanics spec.

### Historical AI route

Under `zin_rule_afrit` HISTORICAL the AI follows this order (dates are approximate completion dates, proposed). It does not wait idle: when a listed focus is not yet available it takes the next available one from the list, then fills gaps from the "filler" list.

| Order | Focus | By |
| ---: | --- | --- |
| 1 | `zilin_hermitage` | Rainwake 1748 |
| 2 | `seat_of_seals` | Sowing 1748 |
| 3 | `houses_of_the_first_light` | Goldfield 1748 |
| 4 | `counsel_for_the_chancellor` | Harvest 1748 |
| 5 | `buy_the_offices` | Fallowing 1748 |
| 6 | `the_councils_verdict` | Mistfall 1748 |
| 7 | `a_vigil_for_the_king` (instrument: physician) | Longnight 1748 |
| 8 | `ministers_from_the_houses` | Deepwinter 1749 |
| 9 | `remedies_of_the_royal_physicians` | Ironfrost 1749 |
| 10 | `patrons_of_the_lost_cause` | Thaw 1749 |
| 11 | `a_steady_hand_on_the_seals` | Rainwake 1749 |
| 12 | `alms_of_the_faithful` | Sowing 1749 |
| 13 | `seat_of_whispers` | Goldfield 1749 |
| 14 | `confessors_abroad` | Harvest 1749 |
| 15 | `blessing_of_the_kings_table` | Fallowing 1749 |
| 16 | `hymns_for_a_new_reign` | Emberleaf 1749 |
| 17 | `the_eastern_chapter` | Longnight 1749 |
| 18 | `seat_of_censers` | Deepwinter 1750 |
| 19 | `the_mistfall_vigil` (option "At Mistfall") | Thaw 1750 |
| 20 | `the_seals_will_pass` | Rainwake 1750 |
| 21–25 | `grain_of_charity`, `physicians_of_the_houses`, `hospitals_of_parim`, `hymns_of_deliverance`, `tutors_for_princes` | to Mistfall 1750 |
| — | *The Golden King dies; Aurevan is crowned (Mistfall 1750)* | |
| 26–31 | `first_of_his_name`, `peace_for_the_realm`, `gifts_to_eastern_kings`, `houses_across_the_sea`, `houses_under_the_sun`, `the_long_courtship` | Longnight 1750 – Goldfield 1751 |
| 32–39 | `seat_of_relics`, `the_reliquary_vaults`, `a_guest_who_does_not_age`, `oaths_of_the_royal_army`, `doors_in_the_hermitage_walls`, `oaths_in_gold`, `the_first_seal`, `lamps_in_the_deep_vault` | to Highsun 1752 |
| — | *Eindil is named (1752); Afrit learns of it 30 days later* | |
| 40–45 | `rumours_of_a_green_light`, `a_keeper_for_the_hermitage`, `the_chancellors_charge`, `ships_for_the_northern_pilgrims`, `maps_of_the_cold_coast`, `hunters_on_the_ice` | to early 1753 |
| — | *Decision: the Northern Voyage; Yeldenne; the wound (1753)* | |
| 46–52 | `rest_at_the_hermitage`, `the_coronation_oaths`, `denounce_the_impostor`, `roads_to_the_dawn`, `miracles_at_the_wells`, `remember_the_jubilee`, `renew_the_thousand_oaths` | 1753 – 1755 |
| — | *The reveal (1754–1756); the War of the Last Crowns (1755); the flight east (Thaw 1756)* | |
| 53–57 | `a_court_in_the_east`, `king_of_the_east`, `levies_of_the_caravan_kings`, `the_eastern_war_council`, `ships_of_the_eastern_seas` | 1756 |
| 58 | `the_host_of_the_east` | 1757 |
| 59–60 | `the_return`, `brother_against_brother` | early 1758 |
| 61–63 | `lord_of_all_erdae`, `wards_of_the_palace`, `the_gods_palace` | 1758 |
| — | *The palace battle; Afrit dies (1759)* | |

Filler (any order, historical AI): the rest of branches A, B, C and E. Never under HISTORICAL: `pray_for_patience`, `long_live_the_golden_king`, `a_pliant_heir`, branch K, `parim_shall_not_fall`, `through_the_elven_woods`, `cast_off_the_mask` before the reveal, `the_ashen_throne`.

### Alternative routes

| Route | Path | Mechanic result |
| --- | --- | --- |
| The Kingdom Behind the Throne | `the_councils_verdict` → `pray_for_patience` → `long_live_the_golden_king` → K branch; or `a_pliant_heir` → K branch | No crowning; the Council rules through a living King or a puppet heir |
| Stand in Parim (Ashen gamble) | G branch → `parim_shall_not_fall` → `lord_of_all_erdae` → I branch | Afrit never flees; Ashen Throne path (c) |
| The Unmasked God | B branch → `cast_off_the_mask` (voluntary) → U branch → `parim_shall_not_fall` | Early open rule with fear, civil wars of the faithful, servants |
| The Eastern Conqueror | H branch with `those_who_refused` and `through_the_elven_woods` | War on refusers and the Magical Forest |
| The Return | H branch → `brother_against_brother` → I branch | Historical path, but the palace may hold |
| Recovery after an early reveal | U branch first, then E branch for the veil is useless; build footholds back with B | Survive `zin_afrit_unmasked_early` |

Rule weights: `FREE` uses the base weights in the tables; `ASHEN` multiplies G, I and U by 3 and sets H's flight-related focuses to 0; `DORMANT` sets `a_vigil_for_the_king` to 0 and `pray_for_patience` and branch K to 50.

## Implementation

| Path | Content |
| --- | --- |
| `docs/design/focus/worshipdom.json` | Tree data: `id` `worshipdom`, `tier` `major`, `countries` `["Worshipdom"]`, 116 focuses, 24 spirits, 12 events |
| `common/national_focus/zin_worshipdom.txt` | Compiled tree; focus ids `zin_worshipdom_<key>` |
| `common/ideas/zin_focus_worshipdom.txt` | Spirits `zin_worshipdom_<key>` |
| `events/zin_worshipdom.txt` | Namespace `zin_worshipdom` |
| `common/scripted_effects/zin_worshipdom.txt` | Tree-local effects: `zin_worshipdom_blame_taxes`, `zin_worshipdom_hide_wound`, `zin_worshipdom_second_embassy` |
| `common/scripted_localisation/zin_worshipdom.txt` | Two-face entries `zin_wsd_<key>_name`, `zin_wsd_<key>_desc` for every focus with a true name (62 focuses) |
| `localisation/english/zin_focus_worshipdom_l_english.yml` | Public text and `_true` text, separate keys |

**Tree-local flags** (country, on the Worshipdom): `zin_worshipdom_houses_open`, `_birth_rolls`, `_cap4`, `_cap5`, `_famine_stores`, `_debts`, `_confessors`, `_eastern_chapter`, `_eastern_reserve`, `_western_ears`, `_quiet_hands`, `_early_warning`, `_merovan`, `_stay_hand`, `_temples_ready`, `_commit_crown`, `_commit_heir`, `_instrument_physician`, `_instrument_hunt`, `_instrument_fever`, `_oaths_renewed`, `_proclamation_ready`, `_thief`, `_seeks_glo`, `_ships_ready`, `_cold_maps`, `_hunters`, `_palace_wards`, `_palace_wards_2`, `_edicts_of_arms`, `_merovan_charge`, `_edicts_unc`, `_roads_east`, `_faithful_rise`, `_houses_fortified`. The mechanics spec reads them; they never leave the Worshipdom.

**Global flags set by the tree:** `zin_afrit_lost_cause_watched`, `zin_afrit_kingdom_behind_throne`, `zin_afrit_scholars_bought`, `zin_afrit_impostor_denounced`, `zin_afrit_stand_in_parim` (all defined in the mechanics spec).

**Icons** come from the icon catalog ([02_icon_catalog.md](../02_icon_catalog.md)). New icons this tree needs (image-generated): `hermitage_hills`, `house_first_light`, `courier_pilgrim`, `seal_chancellor`, `censer`, `reliquary`, `necklace_deep`, `crown_radiant`, `eastern_throne`, `mask_veiled`, `palace_wards`, `throne_ashen`. Icons must not show Afrit's demonic form on any focus reachable before the reveal.

**Raw blocks:** none planned.

**Filters:** A: industry, stability; B and C: political; D and E: political, stability; F: political; G: political, army; K: political; H: army, annexation; U: stability, army; I: political.

## AI

- Weights are in the tables; rule multipliers above. The compiler adds `ai_will_do` modifiers for "x3 / x5 after flag" notes.
- The AI never takes a focus that would cost the veil below 40 unless it is on the historical list.
- After `zin_afrit_dead` all G, H, I, K and U focuses are unavailable; the AI finishes A, B, C and E as filler.
- The AI takes `the_ashen_throne` at once when available, in every rule except HISTORICAL (where it is unavailable in practice).

## Acceptance

1. The tree compiles with all compiler checks passing: 116 focuses, unique keys and positions, prerequisites above, symmetric exclusives, days multiples of 7, all spirits' modifiers valid, all `call` and `check` names defined.
2. The HOI4 Agent Tools focus inspector reports no errors; the focus renderer's review image shows 30 columns or fewer and no overlapping lines through focus boxes.
3. The secrecy check passes: with `zin_afrit_revealed` unset, no public name, description, tooltip or spirit name contains "Afrit", "demon", "murder", "poison" or "plot".
4. With `zin_afrit_revealed` set by console, every two-face focus shows its true name (if scripted localisation works in focus names; otherwise recorded as an accepted difference).
5. Under HISTORICAL in a test run without players, the AI completes orders 1–20 before 1 Highsun 4A 1750, `the_seals_will_pass` before Mistfall 4A 1750, `the_long_courtship` before the end of 4A 1752, `king_of_the_east` in 4A 1756 and `brother_against_brother` in 4A 1758.
6. On 1 Thaw 4A 1748 no focus available to the Worshipdom gives a war goal, a claim or a declaration of war.
7. The Worshipdom cannot complete any focus of G, H, I, K or U after `zin_afrit_dead`.

## Open questions

1. Do you like the two-face approach (pious public names, true names after the reveal)? The alternative is plain names that hide nothing, shown only to the hub, which the engine cannot guarantee.
2. Should the tree keep `through_the_elven_woods` (*Strike the Magical Lands*: Afrit's host attacks the Magical Forest), or should the eastern invasion of the Magical Lands stay entirely with the eastern kings?
3. Are the public chapter names (the Couriers' Chapter, the Censer Chapter, the Reliquary Chapter, Friends at the Golden Court) right for the Worshipdom's open face?
4. Should *Remember the Jubilee* and *Renew the Thousand Oaths* tie the Fourth Age jubilee of 4A 1000 to the old *Night of a Thousand Oaths*, or keep the two apart?
5. After Afrit's death, should the Worshipdom get a short branch for the faithful without their god?
6. (For the compiler owner, not lore.) The tree needs two compiler features not yet in [00_format_and_compiler.md](../00_format_and_compiler.md): a `true_name` / `true_desc` field per focus that compiles to two-face scripted localisation, and a tree option `"private_events": true` that hides private event titles in tooltips. Without them the tree would need many `raw` blocks, which a major tree may not use.
