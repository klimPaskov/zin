# Noris Focus Tree

**Status:** Draft. **Priority:** 4. **Phase:** 4.

## Purpose

The major focus tree for **Noris**, the desert crown of the East Lands (tree id `noris`, focus ids `zin_noris_<key>`, data file `docs/design/focus/noris.json`). It plays the eastern kings mechanic ([../../04_mechanics/eastern_kings.md](../../04_mechanics/eastern_kings.md)) from Furvior: the camel-rider clans under one throne, the Salt Road and the race for the caravan charters, the wells of the South Lands, the Noris Treaty's courtship of the eastern crowns, the riders of the sand, the temples' generous friends, and the one great question of the end of the age: **ride for the King of the East, shield the East against him, or make the East one realm under Furvior**.

Noris is a **rider kingdom**: clans, wells, horses and camels, long roads and hard marches. Its rival Stabilo ([stabilo.md](stabilo.md)) is a **merchant principality** of houses, banks and hired companies. The two trees share the road mechanic but never the same answers.

The tree has 112 focuses in ten branches, 30 columns wide (x 0 to 29).

## Lore basis

**Established** (vault): Noris is an eastern great power whose realm includes the Noris desert (working table); its seat is Furvior (working table); it leads the Noris Treaty with Gondolin and its rival is Stabilo (working table); Noris camel warriors are a tradition of men; the East Lands lie across the rift sea from the Magical Lands; the South Lands are the great desert of the East Lands and run off the southern map; the Hidden Council builds ties in eastern courts as a reserve seat; an eastern coalition invades the Magical Lands in the final war; Afrit takes command of an eastern host and is proclaimed King of the East, while states of the East still resist him; abandoned eastern troops join Eindil's coalition; eastern claims and grievances remain after the war.

**Proposed** (vault proposals this tree builds on): the caravan roads opening in 4A 600 to 780 and the rivalry with Stabilo they began; the eastern branch's courtship from about 4A 1300; the start on 1 Thaw 4A 1748; the play choices "Noris and Stabilo can fight each other, fight Aenor, or fight him"; the outcome "the East unites under one king who is not Afrit".

**Proposed here:** every focus, spirit, event and number; the three great clans (the royal House of Esiur, the rider clans of the Furan, the caravan houses of the Kersi), named after the proposed characters King Esiurth II, Rider-General Tumo Furan and Alodar Kersi; the Oasis-Keepers of the deep desert; the Tent Moot; the Indigo Guard; clan accord. Which eastern kings follow Afrit is **open** in the vault: the tree offers both answers and never states one as history. Before `zin_afrit_revealed` no text names Afrit; the King of the East is "the Deliverer" or "King Aurevan" through `zin_afrit_name`.

## Design

### The peaceful start

On 1 Thaw 4A 1748 every available focus is about the court, the clans, caravans, wells, envoys or the army's training. No focus before the route junction can create a war goal, a claim or a war. War content opens only from story flags (`zin_golden_king_dead`, `zin_war_of_last_crowns`, `zin_eastern_invasion`, `zin_east_turns_west`, `zin_afrit_king_of_east`, `zin_afrit_returned`, `zin_afrit_dead`, `zin_eindil_returned`) or from the mechanic's peace gates (the Caravan War gate).

### Clan accord (tree mechanic)

Noris is one crown over many tents. `zin_noris_clan_accord` (Noris, 0–100, start 45, proposed) measures how willingly the great clans ride for Furvior.

- Dynamic modifier `zin_noris_clans`: `stability_factor` = (accord − 50) ÷ 500 (−0.10 to +0.10); `conscription_factor` = (accord − 50) ÷ 1000 (−0.05 to +0.05).
- Monthly drift (`zin_noris_monthly`, called by the mechanic's monthly update): +0.2 with the spirit The Tent Moot; −0.1 with The Throne of Furvior; −0.3 while Noris has `zin_east_in_crisis`; +0.1 for each road charter above two.
- At 20 or below: event `zin_noris.20` (Unrest in the Tents) may fire, mean time 180 days. At 80 or more the first time: `zin_noris.21` (The Clans Ride as One).
- Accord also scales Muster of the Tents and Oaths of the Tents.

### Branch map

| # | Branch | Columns | Rows | Focuses | Opens | Drives |
| --- | --- | --- | --- | ---: | --- | --- |
| 1 | The Desert Throne | 0–5 | 0–6 | 15 | start | Clan accord; Throne or Moot; the junction |
| 2 | The Salt Road | 6–10 | 0–6 | 14 | start | Road influence, charters, caravan wealth |
| 3 | Wells of the South Lands | 11–14 | 0–5 | 10 | start | Wells, dry land, South Lands courts, the deep sand |
| 4 | The Noris Treaty | 15–20 | 0–6 | 14 | start | Lean, invitations, protection, the great kingdoms |
| 5 | Riders of the Sand | 21–25 | 0–6 | 14 | start; last two need story flags | Army, camel corps, the march with Stabilo |
| 6 | Temples and Gold | 26–29 | 0–4 | 8 | start | Footholds (`zin_afrit_add_footholds`), temple loans |
| 7 | The Deliverer's Sword | 1–5 | 8–13 | 10 | The Question of the East | Kneeling, the eastern host, spoils |
| 8 | The Shield of the East | 7–12 | 8–12 | 10 | The Question of the East | Refusal, the Free Crowns, aid to the elves |
| 9 | High King of the Sands | 16–20 | 8–12 | 9 | The Question of the East | Unification (`zin_east_united`) |
| 10 | Wars of the Roads | 22–28 | 7–10 | 7 | Riders of the Sand + story flags | The Caravan War; the rift coalition |

**The Question of the East** (column 14, row 7) joins the court, the road and the treaty: it needs Council of the Sands, The Greater Treaty or Furvior, Queen of Roads. Its three route focuses (row 8) are mutually exclusive.

### Notation used in the tables

- **Prerequisites:** `a + b` means a and b; `a / b` means a or b.
- **x,y:** grid column and row.
- **Effects** use the compiler vocabulary of [../00_format_and_compiler.md](../00_format_and_compiler.md): `political_power 50`, `stability 0.05`, `war_support 0.05`, `army_experience 10`, `manpower 10000`, `add_spirit k`, `swap_spirit old→new`, `remove_spirit k`, `timed_spirit k 365d`, `event zin_noris.n`, `event_for Name zin_x.n`, `flag f` (country flag), `building type level @where`, `research [categories] 50% ×uses`, `equipment type amount`, `popularity ideology value`, `for_country Name: …`, `call effect(args)`. Spirit keys are short; they compile to `zin_noris_<key>`.
- **Shorthands:** **Inf +n road** = `call zin_east_add_road_influence(road, n)`. **Lean +n on X** = `for_country X: call zin_east_add_lean(n)` (positive is toward Noris). **Rivalry +n** = `call zin_east_add_rivalry(n)`. **Accord +n** = `call zin_noris_add_accord(n)`. **Footholds ±n** = `call zin_afrit_add_footholds(n)` on Noris (Afrit spec; respects caps). **Bonus +n** = `variable zin_east_caravan_bonus add n`.
- **Where:** `@capital`; `@road_<key>` = a random owned state with `zin_is_site_road_<key>`; `@south_lands` = a random owned state with `zin_is_region_south_lands`; `@random_owned`.
- **Avail:** the focus's `available` conditions. Bypass is never used.
- **AI** is `ai.base` and its main factors. "hist" means the factor applies under the historical path (`zin_rule_historical_path` HISTORICAL, or `zin_rule_ai_east` DEFAULT following it). "client" means Noris has `zin_afrit_eastern_client`; "refuser" means `zin_afrit_refused_east`.

Equipment and technology categories are vanilla placeholders until the warfare spec replaces them; the content builder maps them. Camel riders are vanilla cavalry until then.

### Branch 1: The Desert Throne

**Purpose:** the court of Furvior and the clans that carry it. King Esiurth II must hold the royal House of Esiur, the rider clans of the Furan and the caravan houses of the Kersi together, and choose how: the **Throne of Furvior** (a strong crown, more political power, restless clans) or the **Tent Moot** (a council of clans, more riders, a weaker treasury). The branch ends in Council of the Sands, the way into the Question of the East. **Opens:** at start. **Mutual exclusions:** The Throne of Furvior / The Tent Moot. **Mechanic:** clan accord.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `desert_throne` | The Desert Throne | – | – | 2,0 | 70 | event zin_noris.1; political_power 50; accord +5 | 50 |
| `house_of_esiur` | The House of Esiur | desert_throne | – | 1,1 | 70 | add_spirit house_of_esiur | 20 |
| `gathering_of_the_clans` | The Gathering of the Clans | desert_throne | – | 4,1 | 70 | event zin_noris.2; accord +5 | 20 |
| `indigo_court` | The Indigo Court | house_of_esiur | – | 0,2 | 35 | political_power 50; stability 0.03 | 15 |
| `bride_from_the_tents` | A Bride from the Tents | house_of_esiur / gathering_of_the_clans | – | 2,2 | 70 | event zin_noris.3 | 15 |
| `oath_of_the_furan` | The Oath of the Furan | gathering_of_the_clans | – | 4,2 | 70 | accord +5; army_experience 10 | 15 |
| `kersi_caravan_houses` | The Kersi Caravan Houses | gathering_of_the_clans | – | 5,2 | 70 | Inf +5 salt; political_power 25; accord +5 | 15 |
| `throne_of_furvior` | The Throne of Furvior | indigo_court / bride_from_the_tents | tent_moot | 1,3 | 70 | add_spirit throne_of_furvior; accord −10 | 10; hist ×2 |
| `tent_moot` | The Tent Moot | bride_from_the_tents / oath_of_the_furan / kersi_caravan_houses | throne_of_furvior | 4,3 | 70 | add_spirit tent_moot; accord +15 | 10; ×2 if accord < 35 |
| `royal_tax_farms` | The Royal Tax Farms | throne_of_furvior | – | 0,4 | 70 | building industrial_complex 1 @capital; political_power 50 | 15 |
| `kings_law_in_the_sand` | The King's Law in the Sand | throne_of_furvior | – | 2,4 | 70 | stability 0.05; popularity dominion 0.05; accord −5 | 15 |
| `moot_at_the_wells` | The Moot at the Wells | tent_moot | – | 4,4 | 70 | accord +10; manpower 10000 | 15 |
| `one_crown_many_tents` | One Crown, Many Tents | royal_tax_farms / kings_law_in_the_sand / moot_at_the_wells | – | 2,5 | 70 | event zin_noris.4; accord +10 | 20 |
| `clan_marshals` | The Clan Marshals | moot_at_the_wells | – | 4,5 | 70 | add_spirit clan_marshals; army_experience 10 | 10 |
| `council_of_the_sands` | The Council of the Sands | one_crown_many_tents | – | 2,6 | 70 | political_power 75; stability 0.05; accord +5 | 20 |

### Branch 2: The Salt Road

**Purpose:** the caravans that made Furvior rich. Noris holds the Salt Road to Gondolin at start; this branch defends it and bids for the Rift Road (to the rift ports and the Magical Lands trade) and the Lake Road (to Mora and Ostoroth), and needles Stabilo's Gold Road. **Opens:** at start. **Mutual exclusions:** none. **Mechanic:** road influence, charters (`zin_east_road_<key>`), caravan wealth, `zin_east_caravan_bonus`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `salt_road` | The Salt Road | – | – | 8,0 | 70 | Inf +10 salt; political_power 25 | 40 |
| `master_of_caravans` | The Master of Caravans | salt_road | – | 7,1 | 70 | add_spirit master_of_caravans; Bonus +0.25 | 20 |
| `wells_of_mylunur` | The Wells of Mylunur | salt_road | – | 9,1 | 70 | event_for Mylunur zin_noris.5; Inf +5 salt | 20 |
| `caravanserais_of_the_north` | Caravanserais of the North | master_of_caravans | – | 6,2 | 70 | building infrastructure 1 @road_salt ×2; Inf +5 salt | 12 |
| `harbours_of_gondolin` | The Harbours of Gondolin | master_of_caravans / wells_of_mylunur | – | 8,2 | 70 | Lean +10 on Gondolin; for_country Gondolin: building industrial_complex 1 @capital | 12 |
| `claim_the_rift_road` | Claim the Rift Road | wells_of_mylunur | – | 10,2 | 70 | Inf +15 rift; Lean +10 on Delbiz Grasslands | 20; ×2 if the rift road is free |
| `salt_markets_of_furvior` | The Salt Markets of Furvior | caravanserais_of_the_north / harbours_of_gondolin | – | 7,3 | 70 | building industrial_complex 2 @capital | 15 |
| `down_the_lake_road` | Down the Lake Road | harbours_of_gondolin / claim_the_rift_road | – | 9,3 | 70 | Inf +15 lake; Lean +10 on Mora | 15 |
| `caravan_guilds` | The Caravan Guilds | salt_markets_of_furvior | – | 6,4 | 70 | add_spirit caravan_guilds; Bonus +0.25 | 12 |
| `rift_ports` | The Rift Ports | salt_markets_of_furvior / down_the_lake_road | – | 8,4 | 70 | building industrial_complex 1 @road_rift; event zin_noris.6 | 12 |
| `undercut_the_gold_road` | Undercut the Gold Road | down_the_lake_road | – | 10,4 | 35 | Inf +10 gold; Rivalry +5; political_power 25 | 8; hist ×0.5 |
| `gold_of_the_desert` | Gold of the Desert | caravan_guilds / rift_ports | – | 7,5 | 70 | building industrial_complex 1 @random_owned; political_power 50 | 12 |
| `masters_of_the_charters` | Masters of the Charters | rift_ports / undercut_the_gold_road | – | 9,5 | 70 | flag zin_noris_charter_masters; Bonus +0.5; tooltip "Caravans favour Furvior on every road." | 12 |
| `furvior_queen_of_roads` | Furvior, Queen of Roads | gold_of_the_desert + masters_of_the_charters | – | 8,6 | 70 | add_spirit queen_of_roads; Bonus +0.5; building industrial_complex 2 @random_owned | 12 |

### Branch 3: Wells of the South Lands

**Purpose:** the desert itself. Noris owns the Noris Desert and fourteen South Lands states. Dry land starves every army that crosses it; wells make roads and hold courts. The Oasis-Keepers (proposed: the wandering wardens of the deep wells) can make the South Lands courts lean to Furvior. An expedition looks into the deep sand that runs off the map; it never learns what lies beyond. **Opens:** at start. **Mutual exclusions:** none. **Mechanic:** `zin_east_wells_unlocked` and the decision Dig the Wells, `zin_east_dry_land` / `zin_east_wells`, the Sand Road, South Lands lean.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `wells_of_the_south` | The Wells of the South | – | – | 12,0 | 70 | flag zin_east_wells_unlocked (Dig the Wells); political_power 25 | 20 |
| `survey_the_noris_desert` | Survey the Noris Desert | wells_of_the_south | – | 11,1 | 35 | building infrastructure 1 @south_lands; research [support_tech] 50% ×1 | 12 |
| `oasis_keepers` | The Oasis-Keepers | wells_of_the_south | – | 13,1 | 70 | event zin_noris.7; call zin_noris_south_lean(10) | 12 |
| `cisterns_of_furvior` | The Cisterns of Furvior | survey_the_noris_desert | – | 11,2 | 70 | building infrastructure 2 @capital; stability 0.03 | 10 |
| `the_sand_road` | The Sand Road | oasis_keepers | – | 13,2 | 70 | Inf +15 sand | 12 |
| `desert_wardens` | The Desert Wardens | cisterns_of_furvior / the_sand_road | – | 12,3 | 70 | add_spirit desert_wardens | 12 |
| `into_the_deep_sand` | Into the Deep Sand | the_sand_road | – | 14,3 | 70 | event zin_east.35 | 5 |
| `water_rights_of_the_south` | Water Rights of the South | desert_wardens | – | 11,4 | 70 | call zin_noris_south_lean(10); political_power 50 | 10 |
| `salt_pans` | The Salt Pans | desert_wardens / into_the_deep_sand | – | 13,4 | 70 | building industrial_complex 1 @south_lands | 10 |
| `garden_in_the_sands` | A Garden in the Sands | water_rights_of_the_south / salt_pans | – | 12,5 | 70 | add_spirit garden_in_the_sands; call zin_east_wells_random; call zin_east_wells_random | 10 |

### Branch 4: The Noris Treaty

**Purpose:** diplomacy among the eastern crowns. The Treaty with Gondolin is old and warm; the branch opens envoys and gifts (the mechanic's Courts of the East decisions), courts Alerhia and Miaed, writes to Erco and Plutondo in Stabilo's backyard, and then asks how Furvior leads: **First Among the Eastern Crowns** (friendship, lean, stability) or **One Banner Over the Sands** (protection offers that turn friends into subjects). **Opens:** at start. **Mutual exclusions:** First Among the Eastern Crowns / One Banner Over the Sands. **Mechanic:** `zin_east_lean`, `zin_east_courts_noris`, `zin_noris_envoys`, `zin_noris_open_treaty`, `zin_noris_banner`, `zin_east_dominance`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `noris_treaty` | The Noris Treaty | – | – | 17,0 | 70 | flag zin_east_courts_noris (decision category); Lean +10 on Gondolin; political_power 25 | 40 |
| `friendship_with_gondolin` | Friendship with Gondolin | noris_treaty | – | 16,1 | 70 | event_for Gondolin zin_noris.8 | 20 |
| `envoys_to_the_eastern_courts` | Envoys to the Eastern Courts | noris_treaty | – | 18,1 | 35 | flag zin_noris_envoys (Court Gifts); political_power 25 | 20 |
| `treaty_council_at_furvior` | The Treaty Council at Furvior | friendship_with_gondolin | – | 15,2 | 70 | add_spirit treaty_council | 12 |
| `embassy_to_alerhia` | An Embassy to Alerhia | friendship_with_gondolin / envoys_to_the_eastern_courts | – | 17,2 | 70 | event_for Alerhia zin_noris.9 | 20 |
| `mora_and_the_lake_towns` | Mora and the Lake Towns | envoys_to_the_eastern_courts | – | 19,2 | 70 | Lean +15 on Mora; Lean +10 on Ernois; Lean +10 on Ostoroth | 12 |
| `open_the_treaty` | Open the Treaty | treaty_council_at_furvior / embassy_to_alerhia | – | 16,3 | 70 | flag zin_noris_open_treaty (Invite to the Treaty); political_power 50 | 20 |
| `passes_of_miaed` | The Passes of Miaed | embassy_to_alerhia / mora_and_the_lake_towns | – | 18,3 | 70 | event_for Miaed zin_noris.10 | 12 |
| `treaty_levies` | The Treaty Levies | open_the_treaty | – | 15,4 | 70 | add_spirit treaty_levies | 10 |
| `letters_to_erco_and_plutondo` | Letters to Erco and Plutondo | open_the_treaty / passes_of_miaed | – | 17,4 | 70 | Lean +10 on Erco; Lean +10 on Plutondo; Rivalry +2 | 10; hist ×0.5 |
| `gondolins_watch` | Gondolin's Watch on the North | mora_and_the_lake_towns / passes_of_miaed | – | 19,4 | 35 | event_for Gondolin zin_noris.14; flag zin_noris_northern_watch | 8; ×3 after `zin_zol_rising` |
| `first_among_the_eastern_crowns` | First Among the Eastern Crowns | treaty_levies / letters_to_erco_and_plutondo | banner_over_the_sands | 16,5 | 70 | call zin_noris_treaty_lean(10); stability 0.05; political_power 50 | 10; hist ×3; refuser ×2 |
| `banner_over_the_sands` | One Banner Over the Sands | letters_to_erco_and_plutondo / gondolins_watch | first_among_the_eastern_crowns | 18,5 | 70 | flag zin_noris_banner (Offer Protection); war_support 0.05; call zin_noris_treaty_lean(−5) | 10; ×5 with `zin_rule_ai_east` UNITE_WITHOUT_AFRIT |
| `the_greater_treaty` | The Greater Treaty | first_among_the_eastern_crowns / banner_over_the_sands | – | 17,6 | 70 | political_power 75; call zin_noris_treaty_gift | 15 |

### Branch 5: Riders of the Sand

**Purpose:** the army of a rider kingdom. Camel corps, the desert-fox doctrine, Rider-General Tumo Furan, forges at Furvior, forts on the march with Stabilo, the Indigo Guard. The last two focuses raise the host and need the war to be near. **Opens:** at start; The War Council needs `zin_golden_king_dead` or 4A 1752; The Host of Noris needs a war. **Mutual exclusions:** none. **Mechanic:** opens Wars of the Roads (The War Council is its root).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `riders_of_the_sand` | Riders of the Sand | – | – | 23,0 | 70 | army_experience 15; research [land_doctrine] 50% ×1 | 30 |
| `the_camel_corps` | The Camel Corps | riders_of_the_sand | – | 22,1 | 70 | add_spirit camel_corps; equipment infantry_equipment 1000 | 20 |
| `rider_general_tumo` | Rider-General Tumo Furan | riders_of_the_sand | – | 24,1 | 35 | call zin_noris_honour_tumo; army_experience 10 | 15 |
| `desert_fox_doctrine` | The Desert-Fox Doctrine | the_camel_corps | – | 21,2 | 70 | research [land_doctrine] 50% ×2 | 12 |
| `forges_of_furvior` | The Forges of Furvior | the_camel_corps / rider_general_tumo | – | 23,2 | 70 | building arms_factory 2 @capital | 15 |
| `forts_on_the_stabilo_march` | Forts on the Stabilo March | rider_general_tumo | – | 25,2 | 70 | call zin_noris_fortify_march | 8; ×2 if rivalry ≥ 60 |
| `the_long_ride` | The Long Ride | desert_fox_doctrine / forges_of_furvior | – | 22,3 | 70 | add_spirit long_ride | 12 |
| `muster_of_the_tents` | The Muster of the Tents | forges_of_furvior / forts_on_the_stabilo_march | – | 24,3 | 70 | if accord ≥ 50: manpower 15000; else manpower 8000 | 12 |
| `sun_and_steel` | Sun and Steel | the_long_ride | – | 21,4 | 70 | research [infantry_weapons] 50% ×2 | 10 |
| `the_indigo_guard` | The Indigo Guard | the_long_ride / muster_of_the_tents | – | 23,4 | 70 | add_spirit indigo_guard | 10 |
| `siege_trains` | Siege Trains | muster_of_the_tents | – | 25,4 | 70 | research [artillery] 50% ×1; equipment artillery_equipment 100 | 8 |
| `masters_of_the_desert_war` | Masters of the Desert War | sun_and_steel / the_indigo_guard | – | 22,5 | 70 | army_experience 25; add_spirit desert_war_masters | 10 |
| `the_war_council` | The War Council | the_indigo_guard / siege_trains | – | 24,5 | 35 | Avail: `zin_golden_king_dead` or after 1752.3.1; war_support 0.05; political_power 25 | 10; 0 hist before 1754.3.1 |
| `the_host_of_noris` | The Host of Noris | masters_of_the_desert_war + the_war_council | – | 23,6 | 70 | Avail: at war, or `zin_war_of_last_crowns`; manpower 20000; equipment infantry_equipment 2000 | 200 when available |

### Branch 6: Temples and Gold

**Purpose:** the Deliverer's generous friends in Furvior. Their temples are beloved; their loans are generous. The king may **welcome** them (stability and charity now, deeper footholds) or **count their gold** (political power, a watchful court, fewer footholds). Nothing here reveals anything: the court sees only priests and money. **Opens:** at start. **Mutual exclusions:** Welcome the Generous Friends / Count the Temple Gold. **Mechanic:** `zin_footholds` through `zin_afrit_add_footholds`; temple loans (`zin_east.30`); `zin_noris_audit` (no temple loans while set).

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `temples_and_gold` | Temples and Gold | – | – | 27,0 | 35 | event zin_noris.11; political_power 25 | 15 |
| `welcome_the_generous_friends` | Welcome the Generous Friends | temples_and_gold | count_the_temple_gold | 26,1 | 70 | Footholds +1; add_spirit temple_charity | 10; ×2 if `zin_east_in_crisis` |
| `count_the_temple_gold` | Count the Temple Gold | temples_and_gold | welcome_the_generous_friends | 28,1 | 70 | Footholds −1; flag zin_noris_audit; political_power 50; stability −0.02 | 10; ×2 if accord ≥ 60 |
| `houses_of_healing` | Houses of Healing | welcome_the_generous_friends | – | 26,2 | 70 | stability 0.05; political_power 25 | 10 |
| `the_kings_own_coffers` | The King's Own Coffers | count_the_temple_gold | – | 28,2 | 70 | building industrial_complex 1 @capital; political_power 25 | 10 |
| `the_temples_loans` | The Temples' Loans | houses_of_healing | – | 26,3 | 35 | event zin_east.30 (the offer arrives at once) | 8 |
| `eyes_on_the_priests` | Eyes on the Priests | the_kings_own_coffers | – | 28,3 | 70 | add_spirit watchful_court | 8 |
| `faith_and_treasury` | Faith and Treasury | the_temples_loans / eyes_on_the_priests | – | 27,4 | 70 | political_power 50; stability 0.03 | 8 |

### The Question of the East

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `question_of_the_east` | The Question of the East | council_of_the_sands / the_greater_treaty / furvior_queen_of_roads | – | 14,7 | 35 | Avail: check `zin_east_question_open` (`zin_afrit_king_of_east`, or `zin_eastern_invasion`, or `zin_golden_king_dead` after 1753.3.1); event zin_noris.12; tooltip "Opens three answers." | hist: 0 before `zin_afrit_king_of_east`, then 500; free: 100 when available |

### Branch 7: The Deliverer's Sword

**Purpose:** Noris rides for the King of the East. Before the proclamation, the route pledges Furvior to the generous friends (`zin_east_pledged`, footholds +1). After it, Noris kneels, sends riders to the eastern host, takes spoils across the rift and tribute from the Free Crowns, and marches west with the King. When the King falls, Noris must live with the debt. **Opens:** from The Question of the East, with footholds 3 or more. **Mutual exclusions:** the route focus excludes the Shield of the East and High King of the Sands. **Mechanic:** `zin_east_pledged`, `zin_afrit.51` and `zin_east_prepare_kneel`, `zin_east.52`, `zin_east_claim_rift`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `the_deliverers_sword` | The Deliverer's Sword | question_of_the_east | shield_of_the_east, high_king_of_the_sands | 3,8 | 70 | Avail: footholds ≥ 3; not refuser; flag zin_east_pledged; flag zin_noris_route_deliverer; Footholds +1; political_power 50 | hist: 1000 if client, else 0; free: 10 × footholds + bias ÷ 2 |
| `captains_of_the_temple` | Captains of the Temple | the_deliverers_sword | – | 2,9 | 70 | army_experience 15; political_power 25 | 50 |
| `envoys_to_zilin` | Envoys to the Zilin Hills | the_deliverers_sword | – | 4,9 | 35 | event zin_noris.13 | 50 |
| `kneel_to_the_king` | Kneel to the King of the East | captains_of_the_temple / envoys_to_zilin | – | 3,10 | 35 | Avail: `zin_afrit_king_of_east`; not `zin_afrit_dead`; not refuser; if not client: `country_event zin_afrit.51` (the Afrit spec's offer; its kneel option calls `zin_east_prepare_kneel`); add_spirit sword_of_the_east | 500 when available |
| `riders_for_the_host` | Riders for the Eastern Host | kneel_to_the_king | – | 1,11 | 70 | Avail: client; flag zin_noris_riders_for_host (counts as levies in `zin_east.52`); army_experience 20 | 60 |
| `promised_spoils` | Promised Spoils Beyond the Rift | kneel_to_the_king | – | 3,11 | 70 | Avail: client; `zin_eastern_invasion`; call zin_east_claim_rift; war_support 0.05 | 40 |
| `tribute_of_the_free_crowns` | Tribute of the Free Crowns | kneel_to_the_king | – | 5,11 | 70 | Avail: client; at war with a country with `zin_east_free_crown`; call zin_noris_claim_free_crown | 60 when available |
| `march_west_with_the_king` | March West with the King | riders_for_the_host / promised_spoils | – | 2,12 | 70 | Avail: `zin_afrit_returned`; add_spirit marching_west | 200 when available |
| `satrap_of_the_sands` | Satrap of the Sands | promised_spoils / tribute_of_the_free_crowns | – | 4,12 | 70 | Avail: `zin_afrit_claims_erdae`; political_power 100; stability 0.05 | 100 when available |
| `when_the_king_falls` | When the King Falls | march_west_with_the_king / satrap_of_the_sands | – | 3,13 | 35 | Avail: `zin_afrit_dead`; remove_spirit sword_of_the_east; remove_spirit marching_west; political_power 50; accord +10; tooltip "Furvior must answer for its oaths." | 500 when available |

### Branch 8: The Shield of the East

**Purpose:** Noris refuses the King of the East and leads the eastern crowns against him. Before the proclamation it closes its ears to the generous friends and guards the rift ports. After it, Noris becomes First of the Free Crowns, aids the elven realms across the rift, breaks the coalition with gold and threats, fights the Eastern Throne, and lets free riders serve the stranger's coalition. **Opens:** from The Question of the East. **Mutual exclusions:** the route focus excludes the other two routes. **Mechanic:** `zin_noris_route_shield` (bias −100, coalition weight −100), `zin_east_free_crowns_leader`, `zin_east_grant_free_cb`, `zin_east_offer_coalition_peace`, `zin_east_companies_with_eindil`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `shield_of_the_east` | The Shield of the East | question_of_the_east | the_deliverers_sword, high_king_of_the_sands | 10,8 | 70 | flag zin_noris_route_shield; Footholds −1; stability 0.03 | hist: 1000 if refuser or neither client nor refuser, else 0; free: 60 − 10 × footholds − bias ÷ 2 |
| `close_the_temple_houses` | Close the Temple Houses | shield_of_the_east | – | 8,9 | 35 | Avail: `zin_afrit_revealed` or has `zin_afrit_suspicious`; call zin_afrit_purge_houses | 100 when available |
| `letters_to_the_eastern_kings` | Letters to the Eastern Kings | shield_of_the_east | – | 10,9 | 35 | call zin_noris_treaty_lean(10); political_power 25 | 50 |
| `guard_the_rift_ports` | Guard the Rift Ports | shield_of_the_east | – | 12,9 | 70 | building bunker 1 @road_rift; building bunker 1 @road_rift | 30 |
| `first_of_the_free_crowns` | First of the Free Crowns | letters_to_the_eastern_kings | – | 9,10 | 70 | Avail: `zin_afrit_king_of_east`; not client; if not refuser: flag zin_afrit_refused_east; if no country has `zin_east_free_crowns_leader`: flag zin_east_free_crowns_leader and event zin_east.51; add_spirit free_crowns_banner | 500 when available |
| `aid_to_the_elder_groves` | Aid to the Elder Groves | letters_to_the_eastern_kings / guard_the_rift_ports | – | 11,10 | 70 | Avail: `zin_eastern_invasion`; not `zin_east_coalition_member`; call zin_noris_guarantee_rift; political_power −25 | 60 when available |
| `against_the_eastern_throne` | Against the Eastern Throne | first_of_the_free_crowns | – | 8,11 | 70 | Avail: `zin_afrit_king_of_east`; not `zin_afrit_dead`; call zin_east_grant_free_cb; war_support 0.10 | 100 when available |
| `break_the_coalition` | Break the Coalition | first_of_the_free_crowns / aid_to_the_elder_groves | – | 10,11 | 70 | Avail: `zin_eastern_invasion`; not `zin_east_coalition_member`; call zin_east_offer_coalition_peace; political_power −50 | 60 when available |
| `free_riders_for_the_coalition` | Free Riders for the Stranger | aid_to_the_elder_groves | – | 12,11 | 70 | Avail: `zin_eindil_returned`; flag zin_east_companies_with_eindil; army_experience 15 | 200 when available |
| `the_free_east` | The Free East | against_the_eastern_throne / break_the_coalition / free_riders_for_the_coalition | – | 10,12 | 70 | Avail: `zin_afrit_dead`, or no East Lands country is a member of the Worshipdom's faction; add_spirit free_east; tooltip "An outcome of this game, not history." | 100 when available |

### Branch 9: High King of the Sands

**Purpose:** the proposed outcome that the East unites under a king who is not Afrit, Noris's way: by riders and oaths. Furvior claims every road, crowns a High King, asks the great kingdoms for homage, takes protection-subjects, and fights both the King of the East and those who knelt to him. **Opens:** from The Question of the East when `zin_east_dominance` ≥ 12 or The Greater Treaty is done. **Mutual exclusions:** the route focus excludes the other two routes. **Mechanic:** `zin_noris_route_high_king` (bias −50; protection at lean 60), `zin_east_grant_high_king_cb`, `zin_east.73`, `zin_east_declare_united`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `high_king_of_the_sands` | High King of the Sands | question_of_the_east | the_deliverers_sword, shield_of_the_east | 18,8 | 70 | Avail: `zin_east_dominance` ≥ 12 or focus the_greater_treaty done; flag zin_noris_route_high_king; add_spirit high_kings_ambition | hist 0 (PLAUSIBLE 10); UNITE rule 1000 if chosen; free: dominance × 3 |
| `claim_every_road` | Claim Every Road | high_king_of_the_sands | – | 17,9 | 70 | call zin_east_add_all_roads(10); Rivalry +10 | 50 |
| `oaths_of_the_tents` | Oaths of the Tents | high_king_of_the_sands | – | 19,9 | 70 | Accord +10; if accord ≥ 50: manpower 15000; else manpower 10000 | 50 |
| `protectorate_of_the_sands` | The Protectorate of the Sands | claim_every_road | – | 16,10 | 70 | political_power 50; tooltip "Courts at lean 60 may be offered protection." | 40 |
| `crown_of_the_high_king` | The Crown of the High King | claim_every_road / oaths_of_the_tents | – | 18,10 | 70 | event zin_noris.15; political_power 100; stability 0.05 | 50 |
| `the_high_kings_due` | The High King's Due | oaths_of_the_tents | – | 20,10 | 70 | Avail: `zin_war_of_last_crowns` or `zin_afrit_king_of_east`; call zin_east_grant_high_king_cb; war_support 0.05 | 80 when available |
| `the_great_kingdoms_bend` | The Great Kingdoms Bend | protectorate_of_the_sands / crown_of_the_high_king | – | 17,11 | 70 | call zin_noris_ask_homage | 60 |
| `no_god_king_in_the_east` | No God-King in the East | crown_of_the_high_king / the_high_kings_due | – | 19,11 | 70 | Avail: `zin_afrit_king_of_east`; not `zin_afrit_dead`; call zin_east_grant_free_cb; war_support 0.05 | 100 when available |
| `one_east_under_furvior` | One East Under Furvior | the_great_kingdoms_bend / no_god_king_in_the_east | – | 18,12 | 70 | Avail: `zin_east_dominance` ≥ 50; not client; call zin_east_declare_united; remove_spirit high_kings_ambition; tooltip "An outcome of this game, not history." | 500 when available |

### Branch 10: Wars of the Roads

**Purpose:** the two wars the East can start on its own. **The Caravan War** with Stabilo, only through the mechanic's gate; it claims the Gold Road and ends in terms at the wells. **The rift coalition**: if Noris has joined the eastern coalition (`zin_east.42`), these focuses carry its riders across the rift, claim elven groves, turn west toward Parim with the host, and, when the cost is too high, bring the riders home (the vault's eastern formations that retreated east). **Opens:** The War Council; each line needs its story flags. **Mutual exclusions:** none. **Mechanic:** `zin_east_caravan_war_open`, `zin_cb_caravan_roads`, `zin_east_claim_road`, `zin_east.26`, `zin_east_coalition_member`, `zin_east_claim_rift`, `zin_east_turns_west`.

| Key | Name | Prerequisites | Exclusive with | x,y | Days | Effects | AI |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `close_the_roads_to_stabilo` | Close the Roads to Stabilo | the_war_council | – | 23,7 | 35 | Avail: check `zin_east_caravan_war_open`; call zin_diplo_grant_cb(cb=zin_cb_caravan_roads, target=Stabilo, days=365); Rivalry +5 | hist: 0 unless `zin_war_of_last_crowns` and (Noris client and Stabilo refuser, or the reverse), then 50; free: 20, ×3 at rivalry ≥ 90 |
| `seize_the_gold_road` | Seize the Gold Road | close_the_roads_to_stabilo | – | 22,8 | 70 | Avail: at war with Stabilo; call zin_east_claim_road(road=gold) | 100 when available |
| `the_caravan_peace` | The Caravan Peace | seize_the_gold_road | – | 23,9 | 35 | Avail: at war with Stabilo; check zin_noris_holds_gold_road; event_for Stabilo zin_east.26 | 200 when available |
| `answer_the_coalition` | Answer the Eastern Coalition | masters_of_the_desert_war / the_war_council | – | 27,7 | 35 | Avail: flag `zin_east_coalition_member`; war_support 0.05; army_experience 10 | 300 when available |
| `spoils_of_the_elder_groves` | Spoils of the Elder Groves | answer_the_coalition | – | 28,8 | 70 | Avail: at war with a Magical Lands realm; call zin_east_claim_rift | 80 when available |
| `the_road_to_parim` | The Road to Parim | answer_the_coalition / spoils_of_the_elder_groves | – | 27,9 | 70 | Avail: `zin_east_turns_west`; war_support 0.05; army_experience 15 | 80 when available |
| `bring_the_riders_home` | Bring the Riders Home | the_road_to_parim | – | 27,10 | 35 | Avail: at war with a Magical Lands or Middle Lands country; call zin_noris_withdraw_from_rift; manpower 10000; tooltip "Some companies will not come home." | 0 before `zin_zol_rising` or `zin_volgan_marches`; then 30, ×3 if Noris is a refuser |

## Implementation

### Files

| Path | Content |
| --- | --- |
| `docs/design/focus/noris.json` | Tree data (source of truth) |
| `common/national_focus/zin_noris.txt` | Compiled tree; `country = { factor = 0 modifier = { add = 10 zin_is_noris = yes } }` |
| `common/ideas/zin_focus_noris.txt` | Spirits below |
| `common/dynamic_modifiers/zin_noris.txt` | `zin_noris_clans` (declared by this tree) |
| `events/zin_noris.txt` | Namespace `zin_noris`; effect-triggered only |
| `common/scripted_effects/zin_noris.txt` | Tree effects below |
| `common/scripted_triggers/zin_noris.txt` | Tree triggers below |
| `localisation/english/zin_focus_noris_l_english.yml` | All text |

The mechanic's effects, triggers, decisions and events (`zin_east_*`, namespace `zin_east`) are only called here. Noris's ruler and councillors come from the characters spec; this tree adds no new character.

### Variables and flags

| Name | Kind | Meaning |
| --- | --- | --- |
| `zin_noris_clan_accord` | Noris variable, 0–100, start 45 | Clan accord |
| `zin_noris_accord_stab`, `zin_noris_accord_cons` | Noris variables | Inputs of `zin_noris_clans` |
| `zin_noris_route_deliverer`, `zin_noris_route_shield`, `zin_noris_route_high_king` | Noris flags | Route chosen (the mechanic reads the last two) |
| `zin_noris_audit` | Noris flag | No temple loans to Noris |
| `zin_noris_envoys`, `zin_noris_open_treaty`, `zin_noris_banner`, `zin_noris_charter_masters`, `zin_noris_northern_watch`, `zin_noris_riders_for_host` | Noris flags | Unlocks and markers |
| `zin_noris_accord_high_seen` | Noris flag | `zin_noris.21` fired once |

### Tree-declared scripted effects and triggers

| Name | Kind | Does |
| --- | --- | --- |
| `zin_noris_add_accord` (`value`) | effect | Adds, clamps 0–100, refreshes `zin_noris_clans` |
| `zin_noris_monthly` | effect | Accord drift; `zin_noris.20` and `.21` checks; called by `zin_east_monthly` |
| `zin_noris_south_lean` (`value`) | effect | `zin_east_add_lean(value)` on every `zin_east_is_south_court` court |
| `zin_noris_treaty_lean` (`value`) | effect | `zin_east_add_lean(value)` on every member of Noris's faction |
| `zin_noris_treaty_gift` | effect | Every Noris faction member: political power +25, opinion of Noris +10 |
| `zin_noris_honour_tumo` | effect | `add_skill_level` 1 to `zin_noris_tumo` if he serves Noris |
| `zin_noris_fortify_march` | effect | Bunker +1 in up to three Noris states that border a Stabilo state (fewest bunkers first, then state id) |
| `zin_noris_guarantee_rift` | effect | `give_guarantee` to the Magical Lands realm with the most `zin_is_site_rift_west` states that is at war with a coalition member |
| `zin_noris_ask_homage` | effect | `zin_east.73` to Alerhia, Miaed, Erco and Plutondo where they exist and are not Noris's subjects |
| `zin_noris_claim_free_crown` | effect | `add_state_claim` on the road states of the free crown at war with Noris that owns the most road states |
| `zin_noris_withdraw_from_rift` | effect | `white_peace` with every enemy whose capital is in the Magical or Middle Lands |
| `zin_noris_holds_gold_road` | trigger | Noris and its subjects control 3 or more `zin_is_site_road_gold` states |

### Spirits

Ids are `zin_noris_<key>`. Every modifier key exists in the game's modifier documentation.

| Key | Name | Modifiers | Added / removed |
| --- | --- | --- | --- |
| `house_of_esiur` | The House of Esiur | political_power_gain 0.10, stability_factor 0.02 | The House of Esiur; permanent |
| `throne_of_furvior` | The Throne of Furvior | political_power_factor 0.10, drift_defence_factor 0.10 | The Throne of Furvior; accord drift −0.1 a month while present |
| `tent_moot` | The Tent Moot | conscription_factor 0.05, stability_factor 0.03, political_power_gain -0.05 | The Tent Moot; accord drift +0.2 a month while present |
| `clan_marshals` | The Clan Marshals | experience_gain_army_factor 0.10, army_org_factor 0.03 | The Clan Marshals |
| `master_of_caravans` | The Master of Caravans | trade_opinion_factor 0.10, consumer_goods_factor -0.02 | The Master of Caravans (with Bonus +0.25) |
| `caravan_guilds` | The Caravan Guilds | production_speed_buildings_factor 0.05, consumer_goods_factor -0.02 | The Caravan Guilds (with Bonus +0.25) |
| `queen_of_roads` | Furvior, Queen of Roads | political_power_gain 0.10, production_factory_max_efficiency_factor 0.05, trade_opinion_factor 0.10 | Furvior, Queen of Roads (with Bonus +0.5) |
| `desert_wardens` | The Desert Wardens | attrition -0.10, heat_attrition_factor -0.25, supply_consumption_factor -0.05 | The Desert Wardens |
| `garden_in_the_sands` | A Garden in the Sands | monthly_population 0.10, stability_factor 0.03 | A Garden in the Sands |
| `treaty_council` | The Treaty Council | opinion_gain_monthly_factor 0.15, improve_relations_maintain_cost_factor -0.20 | The Treaty Council at Furvior |
| `treaty_levies` | The Treaty Levies | conscription_factor 0.05, army_defence_factor 0.03 | The Treaty Levies |
| `camel_corps` | The Camel Corps | cavalry_attack_factor 0.10, army_speed_factor 0.05, heat_attrition_factor -0.15 | The Camel Corps |
| `long_ride` | The Long Ride | army_speed_factor 0.05, org_loss_when_moving -0.10 | The Long Ride |
| `indigo_guard` | The Indigo Guard | army_morale_factor 0.05, army_attack_factor 0.05 | The Indigo Guard |
| `desert_war_masters` | Masters of the Desert War | experience_gain_army_factor 0.10, heat_attrition_factor -0.25, attrition -0.05 | Masters of the Desert War |
| `temple_charity` | The Temples' Charity | stability_factor 0.05, political_power_gain -0.03 | Welcome the Generous Friends; removed by Close the Temple Houses |
| `watchful_court` | A Watchful Court | enemy_operative_detection_chance_factor 0.15, stability_factor 0.02 | Eyes on the Priests |
| `sword_of_the_east` | Sword of the East | war_support_factor 0.10, army_attack_factor 0.05, political_power_gain 0.05 | Kneel to the King of the East; removed by When the King Falls or `zin_afrit_dead` |
| `marching_west` | Marching West | army_attack_factor 0.05, supply_consumption_factor -0.05 | March West with the King; removed by When the King Falls |
| `free_crowns_banner` | Banner of the Free Crowns | army_defence_factor 0.05, opinion_gain_monthly_factor 0.10 | First of the Free Crowns; replaced by The Free East |
| `free_east` | The Free East | stability_factor 0.08, drift_defence_factor 0.15 | The Free East (removes free_crowns_banner) |
| `high_kings_ambition` | The High King's Ambition | political_power_gain 0.10, justify_war_goal_time -0.25 | High King of the Sands; removed by One East Under Furvior |

The mechanic adds its own ideas to Noris when they apply (`zin_east_temple_loan`, `zin_east_coalition_ambition`, `zin_east_free_crowns`, `zin_east_shared_roads`, `zin_east_caravan_war_strain`, `zin_east_kings_debt`, `zin_east_vindicated`, `zin_east_united_crown`).

### Dynamic modifier

| Key | Modifiers (variable-valued) |
| --- | --- |
| `zin_noris_clans` | stability_factor = `zin_noris_accord_stab`; conscription_factor = `zin_noris_accord_cons` |

### Events (namespace `zin_noris`)

All are fired by focus, option or tree-effect calls; none has its own trigger. Text before `zin_afrit_revealed` never names Afrit.

| Id | Title | For | Fired by | Options (effects; AI) |
| --- | --- | --- | --- | --- |
| .1 | The Desert Throne | Noris | The Desert Throne | "Furvior first" (political_power 50; accord −5) / "The tents first" (accord +10); AI 50/50 |
| .2 | The Gathering of the Clans | Noris | The Gathering of the Clans | Honour the Furan riders (army_experience 10; accord +5) / Honour the Kersi caravan houses (Inf +5 salt; Inf +5 rift; accord +5) / Honour all, favour none (political_power −25; accord +10); AI 40/40/20 |
| .3 | A Bride from the Tents | Noris | A Bride from the Tents | A daughter of the Furan (accord +10) / A daughter of the Kersi (Inf +5 on every road) / A princess of Gondolin (Lean +20 on Gondolin; accord −5); AI 40/30/30 |
| .4 | One Crown, Many Tents | Noris | One Crown, Many Tents | The king rides from tent to tent and is cheered. "So it shall be" (stability 0.03) |
| .5 | The Wells of Mylunur | Mylunur | The Wells of Mylunur | Sell the well rights to Furvior (Lean +15; Noris Inf +5 salt) / The wells stay ours (Lean −5); AI chance = 50 + lean |
| .22 | Mylunur's Answer | Noris | option of .5 | Result text |
| .6 | The Rift Ports | Noris | The Rift Ports | Merchants of Aenor and pilgrims bound for the Zilin Hills crowd the quays. Tax the pilgrims (political_power 50; Worshipdom's opinion of Noris −10) / Welcome them (stability 0.02; Worshipdom's opinion +10); AI 50/50 |
| .7 | The Oasis-Keepers | Noris | The Oasis-Keepers | The keepers of the deep wells ask that their water rights be honoured. Honour them (political_power −25; call zin_noris_south_lean(5)) / Rule them (political_power 25; accord −5); AI 70/30 |
| .8 | Friendship with Gondolin | Gondolin | Friendship with Gondolin | Renew the Treaty (Lean +15; Noris ↔ Gondolin opinion +15) / Ask more of Furvior (Lean +5; Gondolin political_power 25); AI 70/30 |
| .23 | Gondolin's Answer | Noris | option of .8 | Result text |
| .9 | An Embassy from Furvior | Alerhia | An Embassy to Alerhia | Welcome the riders (Lean +15) / Hear both sides (Lean +5) / Postondoroth pays better (Lean −10); AI chance by lean: 40 + lean / 40 / 20 − lean |
| .24 | Alerhia's Answer | Noris | option of .9 | Result text |
| .10 | The Passes of Miaed | Miaed | The Passes of Miaed | Grant passage rights (Lean +15; Noris Inf +10 sand) / The passes are ours (Lean −5); AI chance = 50 + lean |
| .25 | Miaed's Answer | Noris | option of .10 | Result text |
| .11 | Temples and Gold | Noris | Temples and Gold | The temples offer to regild the great shrine of Furvior at their own cost. "Gladly" (stability 0.02) / "Furvior pays for its own shrines" (political_power −25; accord +3); AI 70/30 |
| .12 | The Question of the East | Noris | The Question of the East | Council debate; shows rivalry, dominance, coalition and footholds. "The king will answer" |
| .13 | Gifts from the Zilin Hills | Noris | Envoys to the Zilin Hills | Pilgrim envoys bring blessings and gold. "Accept the blessing" (political_power 75) |
| .14 | Gondolin's Watch | Gondolin | Gondolin's Watch on the North | Gondolin's captains are asked to watch the northern sea. "Keep the watch" (army_experience 5; flag) / "We see only fishing boats" (nothing). If `zin_zol_rising` is set, the text speaks of the dead on the northern shores; otherwise of strange ships nobody can name |
| .15 | The Crown of the High King | Noris | The Crown of the High King | The clans raise Esiurth on a shield above the wells of Furvior. "Long live the High King" (war_support 0.05; accord +5) |
| .20 | Unrest in the Tents | Noris | `zin_noris_monthly`, accord ≤ 20, mean time 180 days | Grant the clans' petition (political_power −50; accord +15) / Ride them down (accord +5; stability −0.05; war_support 0.03); AI 70/30 |
| .21 | The Clans Ride as One | Noris | `zin_noris_monthly`, accord ≥ 80 the first time | Flavour; manpower 5000 |

### Data checks for this tree

- 112 focuses; unique keys; unique (x,y); x from 0 to 29; every focus's y is greater than the y of each of its prerequisites.
- Exclusive pairs: throne_of_furvior / tent_moot; first_among_the_eastern_crowns / banner_over_the_sands; welcome_the_generous_friends / count_the_temple_gold; the three route focuses. The compiler makes them symmetric.
- Days are 35 or 70.
- `raw` blocks: none planned.
- Every `call` and `check` names an effect or trigger defined here, in the mechanic spec, the Afrit spec (`zin_afrit_add_footholds`, `zin_afrit_purge_houses`), or the diplomacy spec (`zin_diplo_grant_cb`).

## AI

### Historical route (4A 1748 to 4A 1760)

Under the historical path the AI follows the weights marked "hist". Which answer Noris gives the King of the East is not fixed: the historical AI kneels only if the Afrit spec's offer (with footholds and the mechanic's bias) made Noris a client, and otherwise shields the East. The windows below are targets for the test run.

| Window | Focuses (in order) | Story beats |
| --- | --- | --- |
| Thaw 1748 – Harvest 1748 | The Desert Throne, The Salt Road, The Noris Treaty | Peace; envoys and caravans |
| Fallowing 1748 – Ironfrost 1749 | The House of Esiur, The Master of Caravans, Riders of the Sand, The Wells of Mylunur | Rift Road contested |
| Rainwake 1749 – Deepwinter 1750 | Envoys to the Eastern Courts, Claim the Rift Road, The Gathering of the Clans, Friendship with Gondolin, Temples and Gold, then Welcome or Count (equal weights, ×2 for the pressure that applies) | Noris usually wins the Rift Road charter |
| Ironfrost 1750 – Mistfall 1750 | An Embassy to Alerhia, The Indigo Court, A Bride from the Tents, The Throne of Furvior | Mistfall: the Golden King dies |
| Longnight 1750 – Highsun 1752 | The King's Law in the Sand, The Royal Tax Farms, One Crown Many Tents, Open the Treaty, The Camel Corps, Rider-General Tumo Furan, The Forges of Furvior, The Wells of the South | Alerhia or Mylunur courted into the Treaty |
| Goldfield 1752 – Longnight 1753 | Council of the Sands, The Treaty Council, The Passes of Miaed, Caravanserais, Salt Markets, Down the Lake Road, Survey the Noris Desert, The Oasis-Keepers | Rivalry 50–60; Trouble at the Wells |
| 1754 | First Among the Eastern Crowns, Treaty Levies, The Desert-Fox Doctrine, The Long Ride, The Muster of the Tents, The War Council (after Thaw 1754), Desert Wardens | Envoys speak of the rift |
| 1755 | The Indigo Guard, Masters of the Desert War, The Host of Noris (on `zin_war_of_last_crowns`); Answer the Eastern Coalition if Noris joined | The coalition crosses the rift |
| 1756 | The Question of the East (after `zin_afrit_king_of_east`); The Deliverer's Sword → Kneel (client) **or** The Shield of the East → First of the Free Crowns, Letters to the Eastern Kings (refuser) | The King of the East is proclaimed |
| 1757 | Client: Riders for the Eastern Host, Promised Spoils. Refuser: Against the Eastern Throne, Break the Coalition, Free Riders for the Stranger (on `zin_eindil_returned`). Either: Bring the Riders Home once the dead and Volgan's hosts strike | Eindil returns |
| 1758 | Client: March West with the King. Refuser: Close the Temple Houses (after the reveal), Guard the Rift Ports | The King's host marches west |
| 1759–1760 | Client: When the King Falls. Refuser: The Free East. Remaining economy and wells focuses | Afrit dies; the East is divided |

The Caravan War line is taken under the historical path only if Noris and Stabilo stand on opposite sides of the King of the East after `zin_war_of_last_crowns`.

### Alternative routes

| Route | How the AI gets there | Key choices |
| --- | --- | --- |
| **Shield** (`zin_rule_ai_east` REFUSE_AFRIT, or FREE with low footholds) | Count the Temple Gold; First Among the Eastern Crowns; The Shield of the East as soon as the Question opens | Aid to the Elder Groves during the invasion; First of the Free Crowns |
| **High King** (`zin_rule_ai_east` UNITE_WITHOUT_AFRIT when Noris has the higher dominance; FREE with high dominance) | The Throne of Furvior; One Banner Over the Sands; protection offers to high-lean courts | High King of the Sands; The High King's Due in the war; One East Under Furvior when dominance ≥ 50 |
| **Deliverer** (FREE with footholds ≥ 4 and bias ≥ 30) | Welcome the Generous Friends; The Temples' Loans | The Deliverer's Sword before the proclamation; kneels at once |
| **Player** | Any order; the Question opens with the King of the East, the invasion, or after 1753 once the King is dead | War focuses still wait for story flags and the peace gates |

### General AI notes

- Before 4A 1750 the AI weights only court, road, wells, treaty and training focuses.
- The AI keeps clan accord above 30: below it, The Tent Moot, The Moot at the Wells and Oaths of the Tents get ×3.
- The AI never takes Undercut the Gold Road while rivalry is 70 or more under the historical path.

## Acceptance

1. The compiler accepts `noris.json`: 112 focuses, unique positions, prerequisites above their focuses, symmetric exclusions, days multiples of 7, no unknown modifier, effect or trigger.
2. The HOI4 Agent Tools focus inspector reports no errors; the focus renderer's review image shows ten readable branches within 30 columns.
3. On 1 Thaw 4A 1748 no available focus can create a war goal, a claim or a war (offline scan of every focus reachable without story flags).
4. The Question of the East is unavailable on day one and becomes available on `zin_afrit_king_of_east`, on `zin_eastern_invasion`, or after 1 Thaw 4A 1753 once `zin_golden_king_dead` is set.
5. Historical AI run: Noris takes exactly one route focus in 4A 1756; it is The Deliverer's Sword if and only if Noris is a client, else The Shield of the East; Noris does not fight Stabilo before `zin_war_of_last_crowns`.
6. UNITE_WITHOUT_AFRIT run where Noris has the higher dominance: Noris takes High King of the Sands and reaches The High King's Due.
7. Clan accord crossing 20 and 80 fires `zin_noris.20` and `.21` as specified; the dynamic modifier follows accord.
8. No text reachable before `zin_afrit_revealed` names Afrit (compiler secret check); no text uses "Sunhot" as a place.
9. All 22 spirits load; every modifier key is in the game's modifier documentation.

## Open questions

1. Are the three clans (the royal House of Esiur, the rider Furan, the caravan Kersi) acceptable, named after the proposed characters, or does the owner have Noris clans in mind?
2. Should the Oasis-Keepers be a people of their own (a South Lands nomad tradition flag), or stay a court faction of Noris?
3. Should Noris have a navy at all? The map gives it no coast today; Gondolin, its Treaty partner, is the "northern maritime crown" but also shows no coastal state in the province data.
4. Is "High King of the Sands" a good title for a Noris that unites the East, or should it use an older eastern title?
5. Should a Noris that kneels be able to break with the King of the East before his death (for example after he loses Parim), or must it stay until he falls?
