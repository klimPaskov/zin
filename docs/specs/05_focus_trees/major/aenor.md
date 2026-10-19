# Aenor focus tree

**Status:** Ready. Reviewed 19 October 2026 against CONVENTIONS "Status"; integrated 19 October 2026. **Priority:** 4. **Phase:** 4.

## Purpose

Aenor's tree is the deepest in ZIN: 140 focuses that carry the Middle Kingdom from the gilded, peaceful court of 4A 1748 through the Golden King's murder, the four-camp succession, the War of the Last Crowns and, on the historical path, Eindil's coronation in 4A 1760. It drives the systems of [../../04_mechanics/aenor_court_and_succession.md](../../04_mechanics/aenor_court_and_succession.md): `zin_court_corruption`, `zin_council_influence`, `zin_concord_loyalty`, the Lost Cause, the death clock and the succession camps. Data file: `docs/design/focus/aenor.json` (tree id `aenor`, tier `major`, countries `["Aenor"]`). The tree is loaded by original tag, so every Aenor civil-war breakaway uses it too. In the game today Aenor runs the interim Long Peace tree; this tree replaces it for Aenor when it is compiled.

## Lore basis

| Element | Status |
| --- | --- |
| The Golden King sells offices, rewards flatterers, keeps a strong army, founds the Lost Cause | established |
| The temples of the Deliverer and the King's councillors govern behind the throne | established; Houses of the First Light, Chancellor Merovan proposed |
| Aenor leads the Middle Kingdom Concord of 26 dominions; Selen's rangers, Kilinti's ents, Hiloron's giants, Hunhun's riders, Kingson behind the Great Wall, Asgard on Aenor Isle | established names; charters and Concord constitution proposed |
| Mirolon warned of the Dead Lands (4A 1736), fishermen saw black ships (4A 1744) | proposed dates for established dangers |
| The Golden King's murder, Aurevan's crowning, Eindil denounced, Afrit's flight east, westerners in Parim, Eindil hailed and crowned | established outline; dates proposed |
| The four succession camps | established; their mechanics proposed |
| Every focus, name, number, spirit and event below | **proposed** |

Open questions the tree never closes: the Golden King's name and heirs, Merovan's fate, whether the Lost Cause formally survives, what the Necklace of the Abyss does to Eindil, the Huhun/Hunhun spelling.

## Design

### Rules for the whole tree

- **Peaceful start.** The first-era branches (rows 0–6) are court, economy, Concord, Lost Cause, temples and army preparation. No first-era focus declares war except *Pacify the Bloody Forest*, a deliberate choice against a hostile enclave (AI weight 0 before the King's death).
- **War branches** unlock only from story flags (`zin_golden_king_dead`, `zin_war_of_last_crowns`, `zin_western_crossing`, `zin_leren_withdrawal`, `zin_volgan_marches`, `zin_zol_rising`, `zin_eindil_returned`) or a deliberate focus (*Mobilise the Realm*, *Restore the Charters by Force*).
- **The secret.** No focus or event text visible before `zin_afrit_revealed` names Afrit or calls the Deliverer a demon. The Faithful branch reads as a benevolent god-king's reign. Texts that change after the reveal use scripted localisation keyed on that flag.
- **The stranger's name.** Focus names are visible to every player at every date, so no focus name says "Eindil" or "son of Ein" before `zin_eindil_named` (decision D4). *Son of Ein, Son of Aen* is two-faced (decision D7): before `zin_eindil_named` it reads *The Hailed King's Claim*; its description uses scripted localisation on the same global flag.
- **Era gating.** Succession branches open by `zin_aenor_ruling_camp` (the mechanic's scripted triggers `zin_aenor_ruled_by_court`, `_faithful`, `_dominions`, `_host`, `_captains`). They are not mutually exclusive with each other, because the historical path passes through three of them in turn (Faithful, Captains' Regency, Host). A branch whose camp loses power stops: **every** focus of branches H, I, K and L carries its branch condition in `available` (H `check zin_aenor_ruled_by_court`; I `check zin_aenor_ruled_by_faithful`; K `check zin_aenor_ruled_by_host` or `flag zin_aenor_hailed_king`; L `check zin_aenor_ruled_by_captains`), and every focus of branch J after its root carries `not check zin_aenor_ruled_by_faithful`. The tables show the condition only on each root.

### Effect notation in the tables

Effects use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md), abbreviated:

- `political_power 50`, `stability 0.03`, `war_support 0.05`, `army_experience 10`, `navy_experience 10`, `manpower 5000` as in the vocabulary.
- `add_spirit k`, `remove_spirit k`, `swap_spirit k1→k2`, `timed_spirit k 365`. Keys without a `zin_` prefix are this tree's spirits (compiled `zin_aenor_<key>`); full ids (`zin_aenor_…`) are mechanic ideas from the mechanics spec, which the compiler accepts and checks (integration decision S9).
- `call name(v)` = `{ "call": "name", "args": { "value": v } }`. `call name{camp: host, value: 10}` passes named arguments (`call zin_aenor_delay_death_clock{days: 120}` passes `days`).
- Shorthand calls: `corruption(v)` = `call zin_aenor_add_court_corruption(v)`; `council(v)` = `call zin_aenor_add_council_influence(v)`; `loyalty_all(v)` = `call zin_aenor_add_concord_loyalty_all(v)`; `lost_cause(v)` = `call zin_aenor_add_lost_cause(v)`; `camp(c, v)` = `call zin_aenor_add_camp_support{camp: c, value: v}`.
- `building type level where`: `where` is `capital`, `random_owned`, `random_coastal` or a site key: `great_lake_ports` (trigger `zin_is_site_great_lake_ports`, requested from the key sites spec) or `great_wall` (`zin_is_site_great_wall`), resolved through the `zin_is_site_*` triggers of [../../01_map/02_key_sites.md](../../01_map/02_key_sites.md). Building types are the game's: `industrial_complex`, `arms_factory`, `dockyard`, `infrastructure`, `naval_base`, `bunker`, `coastal_bunker`.
- `research c b ×n` = `{ "research": { "categories": [c], "bonus": b, "uses": n } }`. `land_doctrine` is a doctrine category: in 1.19.3 the compiler writes `add_doctrine_cost_reduction` for it and `add_tech_bonus` for technology categories. `construction_tech` is the game's category, kept until the economy spec renames it; naval bonuses name the warfare spec's `zin_cat_galleys` (vanilla `naval_equipment` until the warfare stage replaces the technologies).
- `equipment arms n` = `{ "equipment": { "type": "zin_arms_equipment", "amount": n } }`, the warfare spec's arms archetype (vanilla `infantry_equipment` until the warfare stage lands).
- `event k` fires this tree's event `k`; `event_for Country k` fires it for that country.
- `for Country [ … ]` = `for_country`.
- `zin_aenor_*` effects named with `call` are the mechanic's, except the four the tree declares itself (Implementation).

AI notes give `base` and multipliers. "hist" means `zin_rule_historical_path = HISTORICAL` (at `PLAUSIBLE` the historical choice gets the historical-path spec's ×3 favour instead, [06_historical_path_and_ai.md](../../03_gameplay/06_historical_path_and_ai.md)); "alt" otherwise.

### Layout

| Rows | Columns | Branch | Focuses |
| --- | --- | --- | ---: |
| 0–5 | 0–4 | A. The Golden Court | 14 |
| 0–6 | 5–9 | B. The Wealth of the Realm | 14 |
| 0–6 | 10–14 | C. The Middle Kingdom Concord | 14 |
| 0–6 | 15–19 | D. The Lost Cause | 16 |
| 0–4 | 20–23 | E. The Temples | 10 |
| 0–5 | 24–28 | F. The Royal Army and the Great Wall | 13 |
| 8–12 | 0–2 | G. The King Endures | 6 |
| 8–12 | 4–8 | H. The Regency of Gold | 8 |
| 8–13 | 9–13 | I. The Deliverer's Crown | 10 |
| 8–12 | 15–19 | J. The Concord of Equals | 8 |
| 8–13 | 20–24 | K. The King Without a House | 10 |
| 8–10 | 26–28 | L. The Abandoned Throne | 4 |
| 15–18 | 10–18 | M. Aenor Beset | 10 |
| 20–21 | 13–15 | N. The Crown of Aen | 3 |
| | | **Total** | **140** |

Width: columns 0–28 (29). Every position is unique; every focus sits below all its prerequisites. Prerequisites are written `a, b` for "a and b" and `a | b` for "a or b".

### A. The Golden Court (columns 0–4)

**Purpose.** The King's court and treasury. **Opens:** at start. **Exclusions:** *The Sale of Offices* or *Audit the Royal Treasury*; *The Golden Jubilee* or *Reform the Court*. **Drives:** `zin_court_corruption`; feeds the Court camp.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| the_golden_court | The Golden Court | — | — | 2,0 | 35 | political_power 50; corruption(3); event court_feast | base 100; first focus hist |
| sale_of_offices | The Sale of Offices | the_golden_court | audit_treasury | 1,1 | 70 | timed_spirit offices_for_sale 365; corruption(8) | hist 100; alt 30 |
| audit_treasury | Audit the Royal Treasury | the_golden_court | sale_of_offices | 3,1 | 70 | available: not check zin_aenor_council_dominant; political_power −25; corruption(−10); event auditors_ledger | hist 0; alt 40, ×2 if corruption ≥ 75 |
| gilded_halls | Gild the Halls of Parim | sale_of_offices | — | 0,2 | 70 | add_spirit gilded_parim; corruption(5) | hist 80 |
| merchant_princes | The Merchant Princes | sale_of_offices | — | 1,2 | 70 | add_spirit merchant_houses; building industrial_complex 1 random_owned; corruption(3) | hist 60 |
| honest_ledgers | Honest Ledgers | audit_treasury | — | 3,2 | 70 | add_spirit honest_accounts; corruption(−5) | alt 50 |
| dismiss_flatterers | Dismiss the Flatterers | audit_treasury | — | 4,2 | 35 | political_power −50; stability 0.03; corruption(−5); council(−3) | alt 40 |
| royal_triumph | A Royal Triumph | gilded_halls | — | 0,3 | 35 | war_support 0.05; stability 0.03; corruption(3); lost_cause(−3) | hist 50 |
| golden_tribute | The Golden Tribute | merchant_princes | — | 1,3 | 70 | political_power 100; loyalty_all(−3); corruption(3) | hist 40 |
| royal_mint | The Royal Mint | honest_ledgers | — | 3,3 | 70 | building industrial_complex 2 capital; political_power 50 | alt 50 |
| court_of_accounts | The Court of Accounts | dismiss_flatterers | — | 4,3 | 70 | add_spirit royal_auditors; corruption(−8); council(−3) | alt 40 |
| crown_purse | The Crown's Purse | golden_tribute \| royal_mint \| court_of_accounts | — | 2,4 | 70 | political_power 75; stability 0.03 | 40 |
| golden_jubilee | The Golden Jubilee | crown_purse | reform_the_court | 1,5 | 35 | timed_spirit jubilee_celebrations 180; corruption(5) | hist 40; alt 10 |
| reform_the_court | Reform the Court | crown_purse | golden_jubilee | 3,5 | 70 | available: variable zin_court_corruption below 51; remove_spirit gilded_parim; corruption(−15); stability 0.05 | hist 0; alt 50 |

### B. The Wealth of the Realm (columns 5–9)

**Purpose.** The Great Lake ports, roads, industry and learning of a prosperous kingdom. **Opens:** at start. **Drives:** industry; the last focus is war preparation gated by story or by *Mobilise the Realm*.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| great_lake_ports | The Great Lake Ports | — | — | 7,0 | 70 | building naval_base 2 great_lake_ports; building infrastructure 1 great_lake_ports | hist 80 |
| roads_of_parim | The Roads of Parim | great_lake_ports | — | 5,1 | 70 | building infrastructure 1 capital; building infrastructure 1 random_owned (×2) | 60 |
| lake_shipwrights | Lake Shipwrights | great_lake_ports | — | 7,1 | 70 | building dockyard 2 great_lake_ports; navy_experience 10 | 30 |
| market_charters | Market Charters | great_lake_ports | — | 9,1 | 35 | building industrial_complex 1 random_owned; corruption(2) | 50 |
| canal_works | The Canal Works | roads_of_parim | — | 5,2 | 70 | research construction_tech 0.5 ×1; building infrastructure 1 random_owned (×2) | 50 |
| lake_fleet | The Lake Fleet | lake_shipwrights | — | 7,2 | 70 | add_spirit fleet_of_the_lake; research zin_cat_galleys 0.5 ×1 | 30 |
| sea_trade | Trade Across the Sea | market_charters | — | 9,2 | 70 | add_spirit sea_routes | 40 |
| royal_foundries | The Royal Foundries | canal_works | — | 5,3 | 70 | building industrial_complex 2 random_owned | 60 |
| guild_halls | The Guild Halls | lake_fleet \| sea_trade | — | 8,3 | 70 | building arms_factory 1 capital; building industrial_complex 1 random_coastal | 50 |
| eastern_caravans | The Eastern Caravans | sea_trade | — | 9,3 | 35 | political_power 25; event_for Noris caravan_envoys; event_for Stabilo caravan_envoys | 40 |
| arsenals_of_parim | The Arsenals of Parim | royal_foundries | — | 5,4 | 70 | building arms_factory 2 capital; equipment arms 1000 | 50 |
| universities | The Universities of Parim and Selen | guild_halls | — | 8,4 | 70 | add_spirit learned_halls; for Selen [ call zin_aenor_add_concord_loyalty(5) ] | 50 |
| kingdom_of_plenty | A Kingdom of Plenty | arsenals_of_parim, universities | — | 7,5 | 70 | add_spirit realm_of_plenty | 60 |
| kingdoms_armouries | The Kingdom's Armouries | kingdom_of_plenty | — | 7,6 | 70 | available: global_flag zin_golden_king_dead \| global_flag zin_war_of_last_crowns \| focus_done mobilise_the_realm; building arms_factory 3 random_owned | 80 once available |

### C. The Middle Kingdom Concord (columns 10–14)

**Purpose.** The 26 dominions and their charters. **Opens:** at start. **Exclusions:** *The Golden Charters* or *The Charters of Parim Renewed*. **Drives:** `zin_concord_loyalty`, the charter decisions, Concord Council, levies.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| middle_kingdom_concord | The Middle Kingdom Concord | — | — | 12,0 | 70 | political_power 25; loyalty_all(3); flag zin_aenor_charters_open (charter decisions visible) | hist 70 |
| convene_the_concord | Convene the Concord Council | middle_kingdom_concord | — | 11,1 | 35 | call zin_aenor_convene_concord_council | 50 |
| royal_envoys | Royal Envoys to the Dominions | middle_kingdom_concord | — | 13,1 | 35 | loyalty_all(3); flag zin_aenor_envoys (Realm panel shows exact loyalty) | 40 |
| golden_charters | The Golden Charters | convene_the_concord | charters_renewed | 10,2 | 70 | flag zin_aenor_golden_charters_open; political_power 50; corruption(5) | hist 70; alt 20 |
| charters_renewed | The Charters of Parim Renewed | convene_the_concord | golden_charters | 12,2 | 70 | flag zin_aenor_free_charters_open; loyalty_all(8); corruption(−3) | hist 0; alt 40, ×2 if average loyalty < 50 |
| wall_charter | The Wall Charter | royal_envoys | — | 14,2 | 35 | for Kingson [ call zin_aenor_add_concord_loyalty(10) ]; building bunker 1 great_wall | 30 |
| concord_levies | The Concord Levies | golden_charters | — | 10,3 | 70 | add_spirit levies_of_the_concord; loyalty_all(−3) | hist 40 |
| selen_accord | An Accord with Selen | charters_renewed \| royal_envoys | — | 12,3 | 70 | event_for Selen selen_accord; for Selen [ call zin_aenor_add_concord_loyalty(15) ] | 40; hist 20 |
| asgard_isle | The Isle of Asgard | royal_envoys | — | 13,3 | 35 | for Asgard [ call zin_aenor_add_concord_loyalty(10); building naval_base 1 capital ] | 20 |
| kingson_gate | The Gate of Kingson | wall_charter | — | 14,3 | 70 | for Kingson [ building bunker 2 capital ]; army_experience 5 | 20 |
| tribute_roads | The Tribute Roads | concord_levies | — | 10,4 | 70 | political_power 75; building infrastructure 1 random_owned; loyalty_all(−2) | hist 30 |
| peoples_of_the_concord | The Peoples of the Concord | selen_accord \| concord_levies | — | 12,4 | 70 | for Kilinti, Hiloron, Hunhun [ call zin_aenor_add_concord_loyalty(10) ]; army_experience 15 | 40 |
| common_army | The Common Army of the Concord | peoples_of_the_concord | — | 11,5 | 70 | add_spirit common_army_drill | 40 |
| concord_reborn | The Concord Reborn | common_army | — | 12,6 | 70 | add_spirit concord_renewed; loyalty_all(10) | 50 |

### D. The Lost Cause (columns 15–19)

**Purpose.** The King's league against the dark: court branch (columns 15–16), frontier companies (17–18), scholars (19). **Opens:** at start. **Drives:** `zin_aenor_lost_cause`, the death clock's delay, the King's Health decisions, `zin_lost_cause_shield`, `zin_lost_cause_with_eindil`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| oaths_of_the_lost_cause | The Oaths of the Lost Cause | — | — | 17,0 | 35 | political_power 25; lost_cause(5) | hist 90 |
| kings_league | The King's League | oaths_of_the_lost_cause | — | 15,1 | 70 | swap_spirit zin_aenor_lost_cause_court→league_of_the_king; corruption(3) | hist 90 |
| frontier_companies | The Frontier Companies | oaths_of_the_lost_cause | — | 17,1 | 70 | lost_cause(10); call zin_aenor_raise_frontier_company | hist 20; alt 50 |
| scholars_of_the_cause | The Scholars of the Cause | oaths_of_the_lost_cause | — | 19,1 | 70 | political_power 25; lost_cause(5) | hist 10 before 1751, 30 after |
| triumph_of_the_league | A Triumph for the League | kings_league | — | 15,2 | 35 | political_power 50; stability 0.03; lost_cause(−5); corruption(3); event league_triumph | hist 90 |
| honorary_crowns | Honorary Crowns | kings_league | — | 16,2 | 70 | event_for Lerendor, Gunwaith, Girdon, Coldor, Dondor honorary_crowns | hist 60 |
| rangers_of_selen | The Rangers of Selen | frontier_companies | — | 17,2 | 70 | event_for Selen rangers_of_selen; for Selen [ call zin_aenor_add_concord_loyalty(10) ]; lost_cause(5) | 40 |
| watchers_on_the_wall | Watchers on the Wall | frontier_companies | — | 18,2 | 70 | add_spirit wall_watch; lost_cause(5) | 30 |
| old_genealogies | The Old Genealogies | scholars_of_the_cause | — | 19,2 | 70 | flag zin_aenor_genealogies; lost_cause(5) | hist 30 after 1751 |
| black_ships | The Black Ships | rangers_of_selen | — | 17,3 | 35 | event black_ships; building coastal_bunker 1 random_coastal; lost_cause(3) | 30 |
| southern_warnings | Heed the Southern Warnings | rangers_of_selen \| watchers_on_the_wall | — | 18,3 | 35 | event southern_warnings; war_support 0.02; lost_cause(5) | 30 |
| the_kings_tasters | The King's Tasters | rangers_of_selen \| old_genealogies | — | 19,3 | 35 | available: check zin_aenor_king_alive; timed_spirit zin_aenor_kings_tasters 365; call zin_aenor_delay_death_clock{days: 120}; council(−5); the mechanic's King's Health decisions become visible (they test this focus) | hist 0; alt 30 |
| shield_of_the_concord | The Shield of the Concord | triumph_of_the_league \| honorary_crowns, black_ships \| southern_warnings | — | 16,4 | 70 | available: variable zin_aenor_lost_cause above 59; call zin_aenor_raise_lost_cause_shield; loyalty_all(5) | hist 0 before `zin_war_of_last_crowns`, 60 after; alt 50 |
| the_hidden_hand | The Hidden Hand | the_kings_tasters | — | 19,4 | 70 | flag zin_aenor_hidden_hand_seen; council(−5); if flag zin_aenor_audit_done then lost_cause(5); event hidden_hand | hist 0; alt 40 |
| proof_of_blood | Proof of Blood | old_genealogies | — | 18,5 | 70 | available: global_flag zin_eindil_named; flag zin_aenor_proof_of_blood; camp(host, 15) | 60 unless ruled by the Faithful (0) |
| lost_cause_reborn | The Lost Cause Reborn | shield_of_the_concord \| proof_of_blood | — | 17,6 | 70 | available: global_flag zin_eindil_named, not check zin_aenor_ruled_by_faithful; global_flag zin_lost_cause_with_eindil; lost_cause(15); camp(host, 20) | 100 once available |

### E. The Temples (columns 20–23)

**Purpose.** The Deliverer's temples and the Houses of the First Light: real benefits that raise `zin_council_influence`. **Opens:** at start. **Exclusions:** *The King's Own Counsel* or *One Faith, One Realm*. **Drives:** Temple Favour; the Faithful camp.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| temples_of_the_deliverer | The Temples of the Deliverer | — | — | 21,0 | 35 | stability 0.03; council(5) | hist 100 |
| houses_of_the_first_light | The Houses of the First Light | temples_of_the_deliverer | — | 20,1 | 70 | add_spirit first_light_houses; council(5) | hist 100 |
| temple_schools | The Temple Schools | temples_of_the_deliverer | — | 22,1 | 70 | add_spirit temple_scholars; council(5) | hist 60 |
| merovans_seals | The Chancellor's Seals | temples_of_the_deliverer | — | 23,1 | 35 | political_power 75; council(5); tooltip "Chancellor Merovan's authority grows." | hist 80 |
| royal_almoners | The Royal Almoners | houses_of_the_first_light | — | 20,2 | 70 | add_spirit almoners; council(3) | 40 |
| birth_rolls | The Birth Rolls | houses_of_the_first_light \| temple_schools | — | 21,2 | 70 | manpower 10000; timed_spirit counted_realm 730; council(5) | hist 60 |
| blessed_crown | The Blessed Crown | temple_schools | — | 22,2 | 70 | add_spirit crown_blessed; council(5) | hist 50 |
| kings_own_counsel | The King's Own Counsel | royal_almoners | one_faith_one_realm | 20,3 | 70 | available: not check zin_aenor_council_dominant \| flag zin_aenor_hidden_hand_seen; add_spirit own_counsel; council(−10) | hist 0; alt 30, ×3 with `zin_aenor_hidden_hand_seen` |
| feast_of_the_deliverer | The Feast of the Deliverer | birth_rolls \| blessed_crown | — | 21,3 | 35 | stability 0.05; council(5); event deliverer_feast | hist 70 |
| one_faith_one_realm | One Faith, One Realm | feast_of_the_deliverer, merovans_seals | kings_own_counsel | 22,4 | 70 | add_spirit blessed_realm; council(10) | hist 80 |

### F. The Royal Army and the Great Wall (columns 24–28)

**Purpose.** The King's strong army, the Wall and the coasts: preparation, not war. **Opens:** at start. **Exclusions:** *Commissions for Sale* or *Commissions by Merit*. **Drives:** army readiness; *Pacify the Bloody Forest* is the only first-era war goal; *Mobilise the Realm* is gated.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| royal_army | The Royal Army of Aenor | — | — | 26,0 | 70 | army_experience 10; research land_doctrine 0.5 ×1 | hist 60 |
| commissions_for_sale | Commissions for Sale | royal_army | commissions_by_merit | 24,1 | 35 | political_power 40; add_spirit bought_commissions; corruption(5) | hist 80; alt 30 |
| commissions_by_merit | Commissions by Merit | royal_army | commissions_for_sale | 25,1 | 70 | add_spirit merit_commissions; corruption(−3) | hist 0; alt 50 |
| great_wall | The Great Wall of Aenor | royal_army | — | 27,1 | 70 | building bunker 1 great_wall; army_experience 5 | 40 |
| golden_guard | The Golden Guard | commissions_for_sale \| commissions_by_merit | — | 24,2 | 70 | add_spirit guard_of_gold; call zin_aenor_raise_golden_guard | hist 50 |
| drill_fields | The Drill Fields | commissions_for_sale \| commissions_by_merit | — | 25,2 | 70 | add_spirit drilled_regiments | 40 |
| wall_garrisons | Garrisons of the Wall | great_wall | — | 27,2 | 70 | building bunker 1 great_wall; for Kingson [ call zin_aenor_add_concord_loyalty(5) ] | 30 |
| coastal_watch | Watch on the Coasts | great_wall | — | 28,2 | 70 | building coastal_bunker 1 random_coastal (×2) | 30 |
| pacify_bloody_forest | Pacify the Bloody Forest | golden_guard | — | 24,3 | 70 | available: not at_war, exists Bloody Forest; wargoal { target Bloody Forest, type annex_everything }; claims_on Cursed Lands | 0 before `zin_golden_king_dead`; 10 after |
| new_doctrine | A New Doctrine of War | golden_guard \| drill_fields | — | 26,3 | 70 | research land_doctrine 0.5 ×2; army_experience 10 | 50 |
| strait_fortresses | Fortresses on the Strait | coastal_watch | — | 28,3 | 70 | building naval_base 1 random_coastal; building coastal_bunker 2 random_coastal | 30; ×3 with `zin_leren_withdrawal` |
| kings_host | The King's Host | new_doctrine | — | 26,4 | 70 | add_spirit host_of_the_king; equipment arms 2000 | 50 |
| mobilise_the_realm | Mobilise the Realm | kings_host, strait_fortresses \| wall_garrisons | — | 27,5 | 70 | available: global_flag zin_golden_king_dead \| global_flag zin_war_of_last_crowns \| at_war; add_spirit realm_mobilised; war_support 0.05 | 100 once available |

### G. The King Endures (columns 0–2)

**Purpose.** The Golden King survives his murder. **Opens:** global `zin_golden_king_plot_exposed` while the King lives (King's Health decisions; not possible under the historical death rule). **Drives:** the Council's War and `zin_golden_king_survives`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| poison_in_the_cup | Poison in the Cup | — | — | 1,8 | 35 | available: global_flag zin_golden_king_plot_exposed, check zin_aenor_king_alive; add_spirit kings_awakening; corruption(−10) | 100 once available |
| arrest_the_chancellor | Arrest the Chancellor | poison_in_the_cup | — | 0,9 | 35 | council(−10); tooltip "Chancellor Merovan is removed from the King's council." | 100 |
| seize_the_ledgers | Seize the Houses' Ledgers | poison_in_the_cup | — | 2,9 | 70 | remove_spirit first_light_houses; council(−10); stability −0.03 | 60 |
| the_loyal_clergy | The Loyal Clergy | arrest_the_chancellor \| seize_the_ledgers | — | 1,10 | 70 | stability 0.05; council(−5) | 60 |
| the_kings_war | The King's War | arrest_the_chancellor | — | 0,11 | 35 | available: at_war; timed_spirit kings_war 365 | 100 if at war |
| golden_king_reborn | The Golden King Reborn | the_kings_war \| the_loyal_clergy | — | 1,12 | 70 | available: global_flag zin_golden_king_survives; add_spirit sobered_king; corruption(−20) | 100 |

### H. The Regency of Gold (columns 4–8)

**Purpose.** The Golden Court rules for an empty crown. **Opens:** `check zin_aenor_ruled_by_court`. **Drives:** Court support, buying loyalty, rival camps.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| regency_of_gold | The Regency of Gold | — | — | 6,8 | 35 | available: check zin_aenor_ruled_by_court; add_spirit gold_regency; remove_spirit zin_aenor_interregnum | 100 |
| buy_the_captains | Buy the Captains | regency_of_gold | — | 5,9 | 35 | army_experience 15; corruption(5); camp(court, 10) | 80 |
| ledger_of_heirs | The Ledger of Heirs | regency_of_gold | — | 7,9 | 70 | event ledger_of_heirs | 60 |
| a_golden_peace | A Golden Peace | buy_the_captains | — | 4,10 | 70 | non_aggression Lerendor; non_aggression Gunwaith; political_power 50 | 60 |
| crush_the_pretenders | Crush the Pretenders | buy_the_captains \| ledger_of_heirs | — | 6,10 | 70 | camp(faithful, −10); camp(dominions, −10); camp(host, −10); war_support 0.05 | 80 |
| gold_for_the_dominions | Gold for the Dominions | ledger_of_heirs | — | 8,10 | 70 | loyalty_all(8); corruption(5) | 60 |
| treasury_of_war | The Treasury of War | a_golden_peace \| crush_the_pretenders | — | 5,11 | 70 | add_spirit regency_war_chest; building arms_factory 2 random_owned | 60 |
| crown_kept_for_no_king | A Crown Kept for No King | crush_the_pretenders, gold_for_the_dominions \| treasury_of_war | — | 7,12 | 70 | stability 0.10; flag zin_aenor_regency_secure | 60 |

### I. The Deliverer's Crown (columns 9–13)

**Purpose.** Aurevan's reign over Aenor: the historical branch of 4A 1750–1756. All text reads as a beloved god-king's rule until the reveal. **Opens:** `check zin_aenor_ruled_by_faithful` (set with `zin_aurevan_crowned`). **Drives:** Council influence, suppression of rival camps, the denunciation of Eindil, eastern ties.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| first_of_his_name | First of His Name | — | — | 11,8 | 35 | available: check zin_aenor_ruled_by_faithful; add_spirit deliverer_crowned; remove_spirit zin_aenor_interregnum; council(10) | 100 |
| seals_of_government | The Seals of Government | first_of_his_name | — | 10,9 | 70 | add_spirit chancery; council(5) | 100 |
| silence_the_dissenters | Silence the Dissenters | first_of_his_name | — | 12,9 | 35 | camp(court, −15); camp(dominions, −15); camp(host, −15); stability −0.02 | 100 |
| temple_and_crown | Temple and Crown | seals_of_government | — | 9,10 | 70 | add_spirit altar_and_throne | 80 |
| deliverers_relief | The Deliverer's Relief | seals_of_government \| silence_the_dissenters | — | 11,10 | 70 | loyalty_all(8); council(5); stability 0.03 | 90 |
| friends_in_the_east | Friends in the East | silence_the_dissenters | — | 13,10 | 70 | political_power 25; event_for Noris eastern_friends; event_for Stabilo eastern_friends; event_for Alerhia eastern_friends | 70 |
| denounce_the_impostor | Denounce the Impostor | temple_and_crown | — | 10,11 | 35 | available: global_flag zin_eindil_named; camp(host, −20); flag zin_aenor_eindil_denounced; stability 0.03 | 100 once available |
| shield_of_deliverance | The Shield of Deliverance | deliverers_relief \| friends_in_the_east | — | 12,11 | 70 | add_spirit deliverance_shield; building bunker 2 capital | 60 |
| oaths_of_the_realm | The Oaths of the Realm | denounce_the_impostor \| shield_of_deliverance | — | 11,12 | 70 | add_spirit sworn_realm; loyalty_all(5); council(10) | 70 |
| hold_parim | Hold Parim for the Crown | oaths_of_the_realm | — | 11,13 | 70 | available: global_flag zin_war_of_last_crowns; building bunker 3 capital; manpower 20000 | 80 |

### J. The Concord of Equals (columns 15–19)

**Purpose.** The Free Dominions' camp rules Aenor, or a later government rebuilds the Concord by consent. **Opens:** `check zin_aenor_ruled_by_dominions`, or `check zin_aenor_free_dominions_exist` under any ruler except the Faithful. **Exclusions:** *Equal Tolls* or *Restore the Charters by Force*. **Drives:** Free Charters, re-entry of seceded dominions, the deliberate war option.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| concord_of_equals | The Concord of Equals | — | — | 17,8 | 35 | available: check zin_aenor_ruled_by_dominions \| (check zin_aenor_free_dominions_exist, not check zin_aenor_ruled_by_faithful); loyalty_all(10); flag zin_aenor_free_charters_open | 80 |
| speakers_council | The Speakers' Council | concord_of_equals | — | 16,9 | 70 | add_spirit speakers_concord; political_power 50 | 60 |
| letters_to_the_free | Letters to the Free Dominions | concord_of_equals | — | 18,9 | 35 | call zin_aenor_invite_free_dominions | 90 |
| common_defence | A Common Defence | speakers_council | — | 15,10 | 70 | add_spirit defence_pact | 60 |
| equal_tolls | Equal Tolls | speakers_council \| letters_to_the_free | restore_by_force | 17,10 | 70 | building industrial_complex 2 random_owned; loyalty_all(5) | 70 |
| restore_by_force | Restore the Charters by Force | letters_to_the_free | equal_tolls | 19,10 | 70 | flag zin_aenor_restore_by_force (unlocks *Restore the Charter of [Dominion]*); war_support 0.05; loyalty_all(−10) | 5; 0 with `zin_aenor_no_crown_by_force` |
| league_of_free_crowns | The League of Free Crowns | common_defence | — | 16,11 | 70 | event_for Mirolon league_invite; event_for Lerendor league_invite; event_for Gunwaith league_invite | 50 |
| the_concord_stands | The Concord Stands | league_of_free_crowns \| equal_tolls \| restore_by_force | — | 17,12 | 70 | add_spirit concord_stands; flag zin_aenor_concord_of_equals | 70 |

### K. The King Without a House (columns 20–24)

**Purpose.** Aenor follows Eindil as the Hailed King: the historical branch of 4A 1757–1760. Until his coronation Eindil stays Selen's general and leads the Host, not Aenor (decisions S2 and O1); Aenor hails him as its king-to-be and fights in his coalition. Only a realm that is itself his Host (the Host camp or its breakaway) has him as leader before the crown. **Opens:** `check zin_aenor_ruled_by_host` (or flag `zin_aenor_hailed_king`); also for a Host breakaway. **Drives:** Host support, the Lost Cause with Eindil, the free peoples' coalition, retaking Parim, the coronation.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| king_without_a_house | The King Without a House | — | — | 22,8 | 35 | available: check zin_aenor_ruled_by_host \| flag zin_aenor_hailed_king; add_spirit popular_host; remove_spirit captains_command | 100 |
| son_of_ein | Son of Ein, Son of Aen | king_without_a_house | — | 21,9 | 70 | available: global_flag zin_eindil_named; global_flag zin_lost_cause_with_eindil; loyalty_all(10); stability 0.05 | 100 |
| men_of_selen | The Men of Selen | king_without_a_house | — | 23,9 | 35 | event_for Selen men_of_selen; for Selen [ call zin_aenor_add_concord_loyalty(15) ] | 90 |
| call_the_free_peoples | Call the Free Peoples | son_of_ein | — | 20,10 | 70 | manpower 10000; flag zin_aenor_free_peoples; call zin_aenor_call_free_peoples (event free_peoples to every country at war with Volgan or Zol) | 80 |
| light_of_glo | The Light of Glo | son_of_ein \| men_of_selen | — | 22,10 | 70 | available: global_flag zin_glo_with_eindil; add_spirit glo_light | 100 |
| no_crown_by_force | No Crown Taken by Force | men_of_selen | — | 24,10 | 35 | call zin_aenor_set_charter_all{charter: free}; loyalty_all(10); flag zin_aenor_no_crown_by_force | 90 |
| the_last_alliance | The Last Alliance of Men | call_the_free_peoples | — | 21,11 | 70 | add_spirit last_alliance; if not global_flag zin_lost_cause_shield then call zin_aenor_raise_lost_cause_shield | 80 |
| dragon_banner | The Dragon Banner | light_of_glo | — | 23,11 | 35 | available: global_flag zin_eindil_returned; add_spirit banner_of_the_dragon | 100 |
| retake_parim | Retake Parim | the_last_alliance \| dragon_banner | — | 22,12 | 70 | available: check zin_aenor_parim_lost; bypass: not check zin_aenor_parim_lost; call zin_aenor_wargoal_on_parim_holder; war_support 0.10 | 100 |
| the_people_choose | The People Choose Their King | retake_parim | — | 22,13 | 35 | available: not check zin_aenor_parim_lost; stability 0.05; call zin_aenor_people_choose | 100 |

The coronation itself is the mechanic event zin_aenor.400; *The People Choose Their King* only hastens it.

### L. The Abandoned Throne (columns 26–28)

**Purpose.** Aenor after the god-king's flight east. **Opens:** `check zin_aenor_ruled_by_captains` (zin_aenor.300). **Drives:** recovery, breaking the temples' hold, sending for Eindil.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| abandoned_throne | The Abandoned Throne | — | — | 27,8 | 35 | available: check zin_aenor_ruled_by_captains; stability 0.08; remove_spirit deliverer_crowned; remove_spirit chancery; remove_spirit altar_and_throne; remove_spirit sworn_realm; remove_spirit blessed_realm | 100 |
| the_captains_rule | The Captains' Rule | abandoned_throne | — | 26,9 | 35 | add_spirit captains_command; army_experience 20 | 90 |
| open_temple_vaults | Open the Temple Vaults | abandoned_throne | — | 28,9 | 35 | political_power 100; equipment arms 3000; council(−30); remove_spirit first_light_houses | 80 |
| send_for_the_stranger | Send for the Stranger | the_captains_rule \| open_temple_vaults | — | 27,10 | 35 | available: global_flag zin_eindil_named; camp(host, 25); lost_cause(10) | 100 |

### M. Aenor Beset (columns 10–18, rows 15–18)

**Purpose.** The War of the Last Crowns: five fronts. **Opens:** global `zin_war_of_last_crowns`, `zin_western_crossing` or `zin_volgan_marches`. Any Aenor ruler may take it. **Drives:** defence on every front.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| aenor_beset | Aenor Beset | — | — | 14,15 | 35 | available: global_flag zin_war_of_last_crowns \| global_flag zin_western_crossing \| global_flag zin_volgan_marches; add_spirit realm_beset; war_support 0.10 | 100 |
| hold_the_western_shore | Hold the Western Shore | aenor_beset | — | 10,16 | 70 | building coastal_bunker 2 random_coastal (×2) | 80; ×2 with `zin_western_crossing` |
| the_strait_betrayed | The Strait Betrayed | aenor_beset | — | 12,16 | 70 | available: global_flag zin_leren_withdrawal; building coastal_bunker 1 random_coastal; building naval_base 1 random_coastal; navy_experience 15 | 80 |
| against_the_deathless | Against the Deathless Dead | aenor_beset | — | 14,16 | 70 | available: global_flag zin_zol_rising; army_experience 15; tooltip "Ordinary weapons break Zol's dead but cannot end them." | 80 |
| the_wall_holds | The Wall Holds | aenor_beset | — | 16,16 | 70 | building bunker 2 great_wall; for Kingson [ call zin_aenor_add_concord_loyalty(10) ] | 70 |
| the_southern_front | The Southern Front | aenor_beset | — | 18,16 | 70 | available: global_flag zin_volgan_marches; building bunker 2 random_owned; event_for Mirolon southern_aid | 70 |
| levy_of_the_lake | The Levy of the Lake | hold_the_western_shore \| the_strait_betrayed | — | 11,17 | 35 | add_spirit lake_levy; manpower 25000 | 90 |
| fortress_parim | Fortress Parim | hold_the_western_shore \| the_strait_betrayed \| against_the_deathless | — | 13,17 | 70 | building bunker 3 capital | 90 |
| a_common_cause | A Common Cause | the_wall_holds \| the_southern_front | — | 16,17 | 35 | add_spirit common_cause; flag zin_aenor_common_cause; call zin_aenor_offer_common_cause (event common_cause_offer to every country at war with Volgan or Zol) | 70 |
| last_stand | The Last Stand of the Middle Kingdom | levy_of_the_lake \| fortress_parim, a_common_cause | — | 14,18 | 70 | add_spirit final_stand | 90 |

The southern front builds in `random_owned` states by design: the key sites spec has no site for Aenor's southern marches, and the tree does not need one.

### N. The Crown of Aen (columns 13–15, rows 20–21)

**Purpose.** The reign after the coronation. **Opens:** global `zin_eindil_crowned` and `check zin_aenor_eindil_rules`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| a_kingdom_of_ruins | A Kingdom of Ruins | — | — | 13,20 | 70 | available: global_flag zin_eindil_crowned, check zin_aenor_eindil_rules; add_spirit kingdom_of_ruins; remove_spirit realm_beset; building infrastructure 2 capital | 100 |
| treaties_not_conquest | Treaties, Not Conquest | — | — | 15,20 | 70 | available: as above; add_spirit peace_of_treaties; call zin_aenor_set_charter_all{charter: free}; call zin_aenor_offer_treaties (event treaties to every country at war with Aenor except Volgan, Zol, the Worshipdom and its subjects) | 100 |
| the_fourth_age_ends | The Fourth Age Ends | a_kingdom_of_ruins, treaties_not_conquest | — | 14,21 | 70 | available: global_flag zin_eindil_crowned; swap_spirit kingdom_of_ruins→age_of_the_king; call zin_aenor_announce_fourth_age (event fourth_age_ends to every country) | 100 |

## Implementation

### Files

| File | Written by | Content |
| --- | --- | --- |
| `docs/design/focus/aenor.json` | hand-authored data (source of truth) | The tree in the compiler format |
| `common/national_focus/zin_aenor.txt` | `tools/content/modules/focus_compiler.mjs` | The 140 focuses; focus tree `country` filter on the original tag, so breakaways receive it |
| `common/ideas/zin_focus_aenor.txt` | same | The tree's 53 spirits (`zin_aenor_<key>`) |
| `events/zin_aenor.txt` | same | The tree's events, namespace `zin_aenor`, id base 500 (ids 500–519); the mechanic's `events/zin_aenor_court.txt` uses 1–499 in the same namespace (decision S9) |
| `common/scripted_effects/zin_aenor.txt` | same | The four tree-declared effects below |
| `common/opinion_modifiers/zin_aenor.txt` | same | The tree's opinion modifiers below |
| `localisation/english/zin_focus_aenor_l_english.yml` | same | All the tree's text, UTF-8 with BOM |

The compiler writes every file in the builder's one transaction through the shared rewrite engine (`tools/content/apply.mts`). Compiled, the tree replaces the interim Long Peace tree (`zin_long_peace_*`, written today by `tools/content/modules/vanilla_removal.mjs`) for Aenor and its breakaways. Every other `call` and `check` is the mechanic's: [aenor_court_and_succession.md](../../04_mechanics/aenor_court_and_succession.md) defines them in `common/scripted_effects/zin_aenor_court.txt` and `common/scripted_triggers/zin_aenor_court.txt`, written by that spec's builder module. The tree uses no `raw` block.

### Tree-declared scripted effects

| Effect | Does |
| --- | --- |
| `zin_aenor_call_free_peoples` | For every country at war with Volgan or Zol, not at war with ROOT and not ROOT's subject: `country_event = zin_aenor.518` |
| `zin_aenor_offer_common_cause` | For every country at war with Volgan or Zol and not at war with ROOT: `country_event = zin_aenor.519` |
| `zin_aenor_offer_treaties` | For every country at war with ROOT that is not Volgan, not Zol, not the Worshipdom and not a subject of the Worshipdom: `country_event = zin_aenor.516` |
| `zin_aenor_announce_fourth_age` | For every country: `country_event = zin_aenor.517` |

Countries are resolved by name to tags at build time; "at war with" is the engine trigger `has_war_with`.

### Opinion modifiers (tree-declared, proposed)

Written to `common/opinion_modifiers/zin_aenor.txt` by the pattern `zin_<tree>_opinion` recorded in [00_contract_additions.md](../../04_mechanics/00_contract_additions.md).

| Id | Value | Decay | Used by |
| --- | ---: | --- | --- |
| `zin_aenor_opinion_envoys_welcomed` | +20 | none | zin_aenor.502 "Welcome them" (both ways) |
| `zin_aenor_opinion_envoys_received` | +5 | none | zin_aenor.502 "Be wary" |
| `zin_aenor_opinion_honorary_crown` | +15 | none | zin_aenor.504 "Accept" |
| `zin_aenor_opinion_gifts_accepted` | +25 | none | zin_aenor.512 "Accept" |
| `zin_aenor_opinion_gifts_refused` | −10 | 1 per month | zin_aenor.512 "Refuse" |
| `zin_aenor_opinion_southern_aid` | +20 | none | zin_aenor.514 "Accept" |

### Flags the tree sets

All are country flags on the Aenor realm unless marked global. Tree-owned flags are named `zin_aenor_<name>`; the others are the mechanic's or the contract's.

| Flag | Set by | Read by |
| --- | --- | --- |
| `zin_aenor_charters_open` | *The Middle Kingdom Concord* | The mechanic's charter decisions (visible with it) |
| `zin_aenor_golden_charters_open` | *The Golden Charters* | Golden Charter decision (the mechanic names the focus; the flag is the same fact) |
| `zin_aenor_free_charters_open` | *The Charters of Parim Renewed*, *The Concord of Equals* | Free Charter decision; zin_aenor.503 |
| `zin_aenor_envoys` | *Royal Envoys to the Dominions* | The Realm panel shows exact loyalty ([07_interface/01_interface.md](../../07_interface/01_interface.md)) |
| `zin_aenor_genealogies` | *The Old Genealogies* | Record only |
| `zin_aenor_proof_of_blood` | *Proof of Blood* | Record only |
| `zin_aenor_audit_done` | zin_aenor.501 | *The Hidden Hand* (Lost Cause +5) |
| `zin_aenor_saw_black_ships` | zin_aenor.507 | Record only |
| `zin_aenor_hidden_hand_seen` (mechanic) | *The Hidden Hand* | The mechanic relabels Temple Favour |
| `zin_aenor_eindil_denounced` (mechanic) | *Denounce the Impostor* | The mechanic and Eindil's journey |
| `zin_aenor_regency_secure` | *A Crown Kept for No King* | Record only; the mechanic's `zin_aenor_regency_endures` is set by the mechanic |
| `zin_aenor_restore_by_force` | *Restore the Charters by Force* | The mechanic's *Restore the Charter of [Dominion]* |
| `zin_aenor_concord_of_equals` (mechanic outcome) | *The Concord Stands* | World systems' endings |
| `zin_aenor_free_peoples`, `zin_aenor_common_cause` | *Call the Free Peoples*, *A Common Cause* | Record only (the effects fire the offers) |
| `zin_aenor_no_crown_by_force` | *No Crown Taken by Force* | AI of *Restore the Charters by Force* |
| `zin_lost_cause_with_eindil` (global, mechanic) | *The Lost Cause Reborn* | Contract readers |
| `zin_lost_cause_member` (mechanic) | zin_aenor.504 on the accepting crown | The mechanic |

### Spirits

Compiled ids are `zin_aenor_<key>`. Keys are chosen not to collide with focus ids (their localisation keys would clash). The focus *Convene the Concord Council* is keyed `convene_the_concord` (`zin_aenor_convene_the_concord`) so that it does not equal the mechanic's decision `zin_aenor_concord_council` (F3).

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| offices_for_sale | Offices for Sale | `political_power_gain` +0.5, `stability_factor` −0.03 | *The Sale of Offices*; 365 days |
| gilded_parim | Gilded Parim | `stability_factor` +0.05, `consumer_goods_factor` +0.03 | *Gild the Halls of Parim*; removed by *Reform the Court* |
| merchant_houses | The Merchant Houses | `trade_opinion_factor` +0.20, `production_factory_max_efficiency_factor` +0.03 | *The Merchant Princes* |
| honest_accounts | Honest Accounts | `political_power_factor` +0.10, `consumer_goods_factor` −0.03 | *Honest Ledgers* |
| royal_auditors | The Royal Auditors | `stability_factor` +0.03, `production_factory_efficiency_gain_factor` +0.05 | *The Court of Accounts* |
| jubilee_celebrations | The Golden Jubilee | `stability_factor` +0.08, `political_power_gain` +0.25 | *The Golden Jubilee*; 180 days |
| fleet_of_the_lake | The Lake Fleet | `navy_org_factor` +0.05, `naval_speed_factor` +0.05 | *The Lake Fleet* |
| sea_routes | Trade Across the Sea | `trade_opinion_factor` +0.25 | *Trade Across the Sea* |
| learned_halls | The Universities | `research_speed_factor` +0.05 | *The Universities of Parim and Selen* |
| realm_of_plenty | A Kingdom of Plenty | `production_factory_max_efficiency_factor` +0.05, `global_building_slots_factor` +0.10 | *A Kingdom of Plenty* |
| levies_of_the_concord | The Concord Levies | `weekly_manpower` +300 | *The Concord Levies*; permanent |
| common_army_drill | The Common Army | `experience_gain_army_factor` +0.10, `army_org_factor` +0.03 | *The Common Army of the Concord* |
| concord_renewed | The Concord Reborn | `stability_factor` +0.05, `political_power_gain` +0.25 | *The Concord Reborn* |
| league_of_the_king | The King's League | `political_power_gain` +0.25, `war_support_factor` +0.05 | *The King's League* (replaces `zin_aenor_lost_cause_court`) |
| wall_watch | Watchers on the Wall | `civilian_intel_factor` +0.10, `army_defence_factor` +0.03 | *Watchers on the Wall* |
| first_light_houses | The Houses of the First Light | `monthly_population` +0.10, `recruitable_population_factor` +0.05, `stability_factor` +0.03 | *The Houses of the First Light*; removed by *Seize the Houses' Ledgers* or *Open the Temple Vaults* |
| temple_scholars | The Temple Schools | `research_speed_factor` +0.03 | *The Temple Schools* |
| almoners | The Royal Almoners | `stability_factor` +0.03, `consumer_goods_factor` −0.02 | *The Royal Almoners* |
| counted_realm | The Birth Rolls | `conscription_factor` +0.05 | *The Birth Rolls*; 730 days |
| crown_blessed | The Blessed Crown | `drift_defence_factor` +0.20, `political_power_factor` +0.05 | *The Blessed Crown* |
| blessed_realm | One Faith, One Realm | `stability_factor` +0.10, `drift_defence_factor` +0.25, `war_support_factor` −0.05 | *One Faith, One Realm*; removed by *The Abandoned Throne* |
| own_counsel | The King's Own Counsel | `political_power_factor` +0.10, `stability_factor` −0.03 | *The King's Own Counsel* |
| bought_commissions | Commissions for Sale | `army_org_factor` −0.05, `army_leader_cost_factor` −0.25 | *Commissions for Sale* |
| merit_commissions | Commissions by Merit | `army_leader_start_level` +1, `experience_gain_army_factor` +0.10 | *Commissions by Merit* |
| guard_of_gold | The Golden Guard | `army_core_defence_factor` +0.05 | *The Golden Guard* |
| drilled_regiments | The Drill Fields | `training_time_factor` −0.10 | *The Drill Fields* |
| host_of_the_king | The King's Host | `army_morale_factor` +0.05, `conscription_factor` +0.10 | *The King's Host* |
| realm_mobilised | The Realm Mobilised | `war_support_factor` +0.10, `conscription` +0.01 | *Mobilise the Realm* |
| kings_awakening | The King Awakes | `political_power_factor` +0.10, `stability_factor` +0.05 | *Poison in the Cup* |
| kings_war | The King's War | `army_attack_factor` +0.05, `war_support_factor` +0.10 | *The King's War*; 365 days |
| sobered_king | A Sobered King | `stability_factor` +0.10, `political_power_gain` +0.25 | *The Golden King Reborn* |
| gold_regency | The Regency of Gold | `political_power_gain` +0.5, `stability_factor` −0.05 | *The Regency of Gold* |
| regency_war_chest | The Treasury of War | `production_speed_arms_factory_factor` +0.10, `army_org_factor` +0.03 | *The Treasury of War* |
| deliverer_crowned | The Deliverer Crowned | `stability_factor` +0.10, `drift_defence_factor` +0.30 | *First of His Name*; removed by *The Abandoned Throne* |
| chancery | The Seals of Government | `political_power_factor` +0.15 | *The Seals of Government*; removed by *The Abandoned Throne* |
| altar_and_throne | Temple and Crown | `party_popularity_stability_factor` +0.10, `drift_defence_factor` +0.10 | *Temple and Crown*; removed by *The Abandoned Throne* |
| deliverance_shield | The Shield of Deliverance | `army_core_defence_factor` +0.05, `max_dig_in` +2 | *The Shield of Deliverance* |
| sworn_realm | The Oaths of the Realm | `war_support_factor` +0.05, `stability_factor` +0.05 | *The Oaths of the Realm*; removed by *The Abandoned Throne* |
| speakers_concord | The Speakers' Council | `stability_factor` +0.05, `political_power_gain` +0.25 | *The Speakers' Council* |
| defence_pact | A Common Defence | `army_defence_factor` +0.05, `experience_gain_army_factor` +0.05 | *A Common Defence* |
| concord_stands | The Concord Stands | `stability_factor` +0.10, `production_factory_max_efficiency_factor` +0.05 | *The Concord Stands* |
| popular_host | The Popular Host | `recruitable_population_factor` +0.10, `army_morale_factor` +0.10, `war_support_factor` +0.10 | *The King Without a House* |
| glo_light | The Light of Glo | `army_attack_factor` +0.05 (Glo's real power is in the magic systems spec) | *The Light of Glo* |
| banner_of_the_dragon | The Dragon Banner | `army_morale_factor` +0.05, `war_support_factor` +0.05 | *The Dragon Banner* |
| last_alliance | The Last Alliance of Men | `army_org_factor` +0.05, `opinion_gain_monthly_factor` +0.20 | *The Last Alliance of Men* |
| captains_command | The Captains' Command | `army_org_factor` +0.05, `political_power_factor` −0.10 | *The Captains' Rule*; removed by *The King Without a House* |
| realm_beset | Aenor Beset | `army_core_defence_factor` +0.10, `war_support_factor` +0.10 | *Aenor Beset*; removed by *A Kingdom of Ruins* |
| lake_levy | The Levy of the Lake | `conscription` +0.015 | *The Levy of the Lake* |
| common_cause | A Common Cause | `opinion_gain_monthly_factor` +0.25 | *A Common Cause* |
| final_stand | The Last Stand | `army_core_defence_factor` +0.10, `army_core_attack_factor` +0.05, `surrender_limit` +0.10 | *The Last Stand of the Middle Kingdom* |
| kingdom_of_ruins | A Kingdom of Ruins | `production_speed_buildings_factor` +0.15, `stability_factor` −0.05 | *A Kingdom of Ruins*; swapped by *The Fourth Age Ends* |
| peace_of_treaties | Treaties, Not Conquest | `stability_factor` +0.05, `justify_war_goal_time` +0.5 | *Treaties, Not Conquest* |
| age_of_the_king | The Age of the King | `stability_factor` +0.10, `political_power_gain` +0.5, `research_speed_factor` +0.05 | *The Fourth Age Ends* |

### Events (namespace `zin_aenor`, ids 500–519)

All fired by focus effects or tree-declared effects; none declares a mean time to happen. Pictures are catalog keys ([../02_icon_catalog.md](../02_icon_catalog.md)); a gated picture is used only where the focus that fires it requires the gate flag.

| Key (id) | Title | Fired by | For | Picture | Options |
| --- | --- | --- | --- | --- | --- |
| court_feast (500) | A Feast in the Golden Court | *The Golden Court* | Aenor | `court_feast` | Gild the tables (+25 PP, corruption +3; AI hist) / A modest feast (stability +0.02) |
| auditors_ledger (501) | The Auditors' Ledger | *Audit the Royal Treasury* | Aenor | `golden_court` | Publish it (corruption −5, stability −0.03) / Keep it quiet (+25 PP); either sets `zin_aenor_audit_done` (*The Hidden Hand* then adds Lost Cause +5) |
| caravan_envoys (502) | Envoys from Parim | *The Eastern Caravans* | Noris, Stabilo | `generic_peace` | Welcome them (`zin_aenor_opinion_envoys_welcomed` both ways) / Be wary (`zin_aenor_opinion_envoys_received` towards Aenor) |
| selen_accord (503) | An Accord with Parim | *An Accord with Selen* | Selen | `concord_council` | Accept (loyalty +10 more; Aenor army experience +5) / Ask for more (Free Charter set on Selen if Aenor has `zin_aenor_free_charters_open`, else loyalty −5) |
| honorary_crowns (504) | An Honour from Parim | *Honorary Crowns* | Lerendor, Gunwaith, Girdon, Coldor, Dondor | `generic_court` | Accept (flag `zin_lost_cause_member`; `zin_aenor_opinion_honorary_crown`) / Decline politely; AI accepts at opinion of Aenor ≥ 0 unless its government is Dominion or Shadow |
| league_triumph (505) | A Triumph for the League | *A Triumph for the League* | Aenor | `lost_cause_triumph` | OK: the treasury spent on banners and a parade |
| rangers_of_selen (506) | The Rangers Answer | *The Rangers of Selen* | Selen | `generic_wilds` | Send rangers (Selen loses 1,000 manpower; Aenor Lost Cause +5) / Keep them home (loyalty −5) |
| black_ships (507) | The Black Ships | *The Black Ships* | Aenor | `black_ships_tale` | Fishermen's tales (+10 PP) / Send a ship north (Lost Cause +5, −25 PP; sets `zin_aenor_saw_black_ships`) |
| southern_warnings (508) | Warnings from the South | *Heed the Southern Warnings* | Aenor | `southern_warning` | Laugh, as the court did in 4A 1736 (+25 PP, corruption +2) / Listen (Lost Cause +5; event_for Mirolon southern_aid) |
| hidden_hand (509) | The Hidden Hand | *The Hidden Hand* | Aenor | `generic_court` | The appointments follow a pattern no king set. OK (Temple Favour relabelled; never names who) |
| deliverer_feast (510) | The Feast of the Deliverer | *The Feast of the Deliverer* | Aenor | `houses` | OK: flavour; stability already granted |
| ledger_of_heirs (511) | The Ledger of Heirs | *The Ledger of Heirs* | Aenor | `thirty_days` (gate `zin_golden_king_dead`: branch H opens only after it) | Rule in the crown's name (Court +10) / Search the old rolls for an heir (Lost Cause +5; if `zin_eindil_named`, Host +10). Names no relative of the Golden King. |
| eastern_friends (512) | Gifts from Parim | *Friends in the East* | Noris, Stabilo, Alerhia | `generic_court` | Accept (`zin_aenor_opinion_gifts_accepted`) / Refuse (`zin_aenor_opinion_gifts_refused`) |
| men_of_selen (513) | The Men of Selen | *The Men of Selen* | Selen | `generic_war` | March with the Hailed King (Selen gives Aenor military access; loyalty +5) / Guard Selen first (loyalty −5) |
| southern_aid (514) | Aid from Aenor | *Heed the Southern Warnings* (option Listen) or *The Southern Front* | Mirolon | `mirolon_passes` | Accept (Aenor sends 2,000 arms with `send_equipment`; `zin_aenor_opinion_southern_aid`) / Decline |
| league_invite (515) | The League of Free Crowns | *The League of Free Crowns* | Mirolon, Lerendor, Gunwaith | `concord_council` | Join Aenor's faction (`add_to_faction` from Aenor) / Decline; AI joins when at war with Volgan or Zol |
| treaties (516) | Treaties, Not Conquest | `zin_aenor_offer_treaties` | each country it names | `generic_peace` | Accept peace (`white_peace` with Aenor) / Fight on |
| fourth_age_ends (517) | The Fourth Age Ends | `zin_aenor_announce_fourth_age` | every country | `crown_of_aen` (gate `zin_eindil_crowned`: the focus requires it) | OK. Says the King wears the Necklace of the Abyss and that its price is not known. |
| free_peoples (518) | The Free Peoples Are Called | `zin_aenor_call_free_peoples` | each country it names | `generic_war` | Fight beside Aenor (`add_to_faction` from Aenor if Aenor leads a faction, else military access both ways) / Stand alone; AI accepts unless at war with an ally of Aenor |
| common_cause_offer (519) | A Common Cause | `zin_aenor_offer_common_cause` | each country it names | `generic_war` | Open the roads (`give_military_access` to Aenor; Aenor gives it back) / Refuse |

`white_peace`, `add_to_faction`, `give_military_access`, `send_equipment`, `has_war_with` and `country_event` are 1.19.3 engine names.

### Icons

Every key is from the icon catalog ([../02_icon_catalog.md](../02_icon_catalog.md)); no new key is needed. Spirits use the icon of the focus that adds them. No icon shows the Deliverer, Eindil or Zol; *The Light of Glo* shows only the crystal.

| Branch | Focus → icon |
| --- | --- |
| A | the_golden_court `crown_gold`; sale_of_offices `seal_royal`; audit_treasury `ledger_coins`; gilded_halls `palace_parim`; merchant_princes `guild_hall`; honest_ledgers `seal_wax`; dismiss_flatterers `sceptre`; royal_triumph `war_drums`; golden_tribute `tribute_chest`; royal_mint `coin_chest`; court_of_accounts `council_table`; crown_purse `coin_chest`; golden_jubilee `feast_table`; reform_the_court `charter_old` |
| B | great_lake_ports `harbour_lake`; roads_of_parim `roads_paved`; lake_shipwrights `shipwright_yard`; market_charters `market_stalls`; canal_works `canal_lock`; lake_fleet `galley_oars`; sea_trade `ship_voyage`; royal_foundries `foundry_fire`; guild_halls `guild_hall`; eastern_caravans `caravan`; arsenals_of_parim `forge_anvil`; universities `university_hall`; kingdom_of_plenty `granary`; kingdoms_armouries `sword_shield` |
| C | middle_kingdom_concord `concord_circle`; convene_the_concord `council_table`; royal_envoys `envoy`; golden_charters `charter_golden`; charters_renewed `charter_old`; wall_charter `charter_wall`; concord_levies `levy_muster`; selen_accord `scroll_treaty`; asgard_isle `lighthouse`; kingson_gate `fort_wall`; tribute_roads `tribute_chest`; peoples_of_the_concord `banner_league`; common_army `spear_levy`; concord_reborn `alliance_rings` |
| D | oaths_of_the_lost_cause `handshake_oath`; kings_league `banner_league`; frontier_companies `scout_lantern`; scholars_of_the_cause `book_lore`; triumph_of_the_league `war_drums`; honorary_crowns `crown_iron`; rangers_of_selen `ranger_cloak`; watchers_on_the_wall `beacon`; old_genealogies `heir_rolls`; black_ships `black_hulls`; southern_warnings `ember_desert`; the_kings_tasters `healer_herbs`; shield_of_the_concord `charter_shield`; the_hidden_hand `eye_watchful`; proof_of_blood `scroll_sealed`; lost_cause_reborn `banner_plain` |
| E | temples_of_the_deliverer `temple_parim`; houses_of_the_first_light `house_first_light`; temple_schools `book_lore`; merovans_seals `seal_chancellor`; royal_almoners `alms_bread`; birth_rolls `birth_rolls`; blessed_crown `crown_radiant`; kings_own_counsel `seal_royal`; feast_of_the_deliverer `censer`; one_faith_one_realm `sun_veiled` |
| F | royal_army `sword_shield`; commissions_for_sale `coin_chest`; commissions_by_merit `scroll_sealed`; great_wall `fort_wall`; golden_guard `knight_lance`; drill_fields `spear_levy`; wall_garrisons `fort_wall`; coastal_watch `lighthouse`; pacify_bloody_forest `forest_ancient`; new_doctrine `war_council_map`; strait_fortresses `strait_chain`; kings_host `levy_muster`; mobilise_the_realm `war_drums` |
| G | poison_in_the_cup `healer_herbs`; arrest_the_chancellor `seal_chancellor`; seize_the_ledgers `ledger_coins`; the_loyal_clergy `hymn_choir`; the_kings_war `sword_shield`; golden_king_reborn `crown_gold` |
| H | regency_of_gold `regency_seals`; buy_the_captains `coin_chest`; ledger_of_heirs `heir_rolls`; a_golden_peace `olive_branch`; crush_the_pretenders `crown_broken`; gold_for_the_dominions `tribute_chest`; treasury_of_war `ledger_coins`; crown_kept_for_no_king `empty_throne` |
| I | first_of_his_name `crown_radiant`; seals_of_government `seal_chancellor`; silence_the_dissenters `confessional`; temple_and_crown `temple_parim`; deliverers_relief `alms_bread`; friends_in_the_east `caravan`; denounce_the_impostor `scroll_sealed`; shield_of_deliverance `palace_wards`; oaths_of_the_realm `handshake_oath`; hold_parim `palace_parim` |
| J | concord_of_equals `concord_circle`; speakers_council `council_table`; letters_to_the_free `scroll_treaty`; common_defence `alliance_rings`; equal_tolls `toll_house`; restore_by_force `siege_trebuchet`; league_of_free_crowns `banner_league`; the_concord_stands `charter_free` |
| K | king_without_a_house `crown_hailed`; son_of_ein `lone_sword`; men_of_selen `ranger_cloak`; call_the_free_peoples `beacon`; light_of_glo `crystal_green`; no_crown_by_force `charter_free`; the_last_alliance `alliance_rings`; dragon_banner `dragon_wing`; retake_parim `siege_trebuchet`; the_people_choose `banner_plain` |
| L | abandoned_throne `empty_throne`; the_captains_rule `war_council_map`; open_temple_vaults `reliquary`; send_for_the_stranger `envoy` |
| M | aenor_beset `fort_wall`; hold_the_western_shore `anchor_rope`; the_strait_betrayed `strait_chain`; against_the_deathless `dead_ranks_far`; the_wall_holds `fort_wall`; the_southern_front `pass_fort`; levy_of_the_lake `levy_muster`; fortress_parim `palace_parim`; a_common_cause `handshake_oath`; last_stand `sword_shield` |
| N | a_kingdom_of_ruins `quarry_stone`; treaties_not_conquest `olive_branch`; the_fourth_age_ends `crown_aen` |

## AI

### Historical route (under `zin_rule_historical_path`, 4A 1748–1760)

Approximate dates; 70-day focuses unless noted.

| Period | Focuses in order |
| --- | --- |
| Thaw 1748 – Harvest 1748 | the_golden_court (35), temples_of_the_deliverer (35), sale_of_offices, oaths_of_the_lost_cause (35), kings_league |
| Fallowing 1748 – Highsun 1749 | houses_of_the_first_light, triumph_of_the_league (35), great_lake_ports, merovans_seals (35), middle_kingdom_concord |
| Goldfield 1749 – Highsun 1750 | convene_the_concord (35), golden_charters, gilded_halls, royal_army, commissions_for_sale (35), birth_rolls |
| Highsun – Mistfall 1750 | temple_schools, blessed_crown; feast_of_the_deliverer in progress when the King dies |
| Longnight 1750 – 1751 | first_of_his_name (35), silence_the_dissenters (35), seals_of_government, deliverers_relief, feast_of_the_deliverer, one_faith_one_realm |
| 1751 – 1753 | temple_and_crown, friends_in_the_east, merchant_princes, golden_tribute, roads_of_parim, market_charters, honorary_crowns, shield_of_deliverance, scholars_of_the_cause, old_genealogies, concord_levies |
| 1754 | denounce_the_impostor (35; on `zin_eindil_named` and the warning), oaths_of_the_realm, golden_guard |
| 1755 | aenor_beset (35), hold_the_western_shore, the_strait_betrayed, hold_parim, mobilise_the_realm, against_the_deathless |
| 1756 (after zin_aenor.300) | abandoned_throne (35), the_captains_rule (35), open_temple_vaults (35), send_for_the_stranger (35), proof_of_blood, lost_cause_reborn |
| 1757 (Eindil hailed) | king_without_a_house (35), son_of_ein, men_of_selen (35), light_of_glo, dragon_banner (35), the_wall_holds |
| 1758 – 1759 | retake_parim, call_the_free_peoples, the_last_alliance, no_crown_by_force (35), fortress_parim, levy_of_the_lake (35), last_stand |
| 1760 | the_people_choose (35); after zin_aenor.400: a_kingdom_of_ruins, treaties_not_conquest, the_fourth_age_ends |

The historical AI never takes: audit_treasury, charters_renewed, commissions_by_merit, the_kings_tasters, the_hidden_hand, kings_own_counsel, pacify_bloody_forest before the King's death, restore_by_force, or branch G.

### Alternative routes

| Route | Choices | Leads to |
| --- | --- | --- |
| **The reformer** | audit_treasury → court_of_accounts; commissions_by_merit; the_kings_tasters → the_hidden_hand; kings_own_counsel; the King's Health decisions | Plot exposed, the Council's War, branch G, `zin_golden_king_survives` |
| **The shield of the Concord** | charters_renewed → selen_accord → concord_reborn; frontier_companies → southern_warnings → shield_of_the_concord | A strong Concord and a real Lost Cause before the war; Host support high when Eindil appears |
| **The Regency of Gold** | Gild everything, choose the Court at zin_aenor.201, branch H | `zin_aenor_regency_endures` if it survives to 1760 |
| **The Concord of Equals** | Choose the Dominions at zin_aenor.201, branch J | `zin_aenor_concord_of_equals` |
| **The Deliverer's kingdom** | Choose the Faithful and keep them in power past 1756 (Afrit spec permitting) | The Ashen Throne (Afrit spec, world systems) |
| **The early host** | Lost Cause scholars and frontier, shelter Eindil through the journey's warning event `zin_eindil.82` ("Shelter him", flag `zin_eindil_crown_shelters`; the journey owns this one warning, decision O4), back the Host when it rises | Aenor hails Eindil and fights beside his Host before 1757; he becomes its leader only at the coronation (O1), which still waits for `zin_afrit_dead` |

AI personalities outside the historical rule weigh by situation: corruption above 75 raises the reform focuses ×2; Volgan or Zol bordering an Aenor ally raises Lost Cause frontier focuses ×2; a Free Dominions league raises branch J ×2 and keeps *Restore the Charters by Force* at weight 5.

## Acceptance

1. The compiler builds `aenor.json` with 140 focuses and no errors; compiler checks 1–7 pass; the tree is 29 columns wide (x 0–28) and 22 rows deep (y 0–21); positions are unique; every focus sits below its prerequisites; the two-way exclusives (*The Sale of Offices* / *Audit the Royal Treasury*, *The Golden Jubilee* / *Reform the Court*, *The Golden Charters* / *The Charters of Parim Renewed*, *The King's Own Counsel* / *One Faith, One Realm*, *Commissions for Sale* / *Commissions by Merit*, *Equal Tolls* / *Restore the Charters by Force*) are symmetric; every cost is 35 or 70 days; the tree has 0 `raw` blocks.
2. Every focus icon and spirit icon is one of the catalog's 175 keys and every event picture one of its 52 picture keys with the right crop; `ledger_of_heirs` and `fourth_age_ends` pass the gated-picture check.
3. Every modifier in the spirits table exists in the game's `modifiers_documentation.md`; every `call` and `check` resolves to a scripted effect or trigger of the mechanic's files or of `common/scripted_effects/zin_aenor.txt`; every full mechanic idea id exists in `common/ideas/zin_aenor_court.txt`.
4. On 1 Thaw 4A 1748 no available focus declares war except *Pacify the Bloody Forest*, and its AI weight is 0; no root of branches G–N is available.
5. The secret check passes: no text reachable before `zin_afrit_revealed` names Afrit; before `zin_eindil_named` no text names Eindil.
6. The HOI4 Agent Tools focus inspector and script validator report no errors in the staged files; `hoi4_focus_render` draws branches A–N in the tabled columns.
7. Isolated Linux run, one in-game year from 1 Thaw 4A 1748 under the historical rule: AI Aenor completes *The Golden Court*, *The Temples of the Deliverer*, *The Sale of Offices*, *The Oaths of the Lost Cause* and *The King's League* in that order within ±120 days of the tabled period, and nobody is at war.
8. Long historical observer run (4A 1748–1760): AI Aenor takes *Denounce the Impostor* in 4A 1754, *Send for the Stranger* in 4A 1756 and *The People Choose Their King* before Eindil's coronation in 4A 1760.
9. A civil-war breakaway of Aenor shows the Aenor tree and can take its camp's branch root.
10. With `zin_golden_king_plot_exposed` forced, branch G opens; with the Court forced as ruling camp, branch H opens; with the Dominions forced, branch J opens; after the ruling camp changes, the old camp's branch focuses are unavailable.

## Open questions

Settled since the draft: the compiler accepts full mechanic idea ids and an event id base (decision S9), so the tree keeps `zin_aenor` with ids 500–519; *Pacify the Bloody Forest* stays as a player-only choice with AI weight 0 before the Golden King's death (decision D8); the tree keeps 140 focuses and branches L and N stay separate (proposed); *Friends in the East* only sends gifts and decides nothing about which courts later kneel, which each game decides (decision S1, owner short list 11).

Owner question still open ([OPEN_QUESTIONS.md](../../OPEN_QUESTIONS.md), aenor 10):

1. Should Alleria appear by name in Aenor's events before the palace battle? Proposal the work proceeds on: no; Aenor's events name only Selen and its rangers.
