# Naval and air layers and doctrines

**Status:** Draft. Written 19 October 2026 as a wave-0 gap spec (master plan §7; inventory rows WE-034 and WE-035, with WE-049, 050, 092, 093, 118, 119, 163 to 166 and 195 as the layers they sit on). **Priority:** 3. **Phase:** 3. It is part of **stage 2 of the vanilla removal** ([06_vanilla_removal_and_zero_errors.md](../00_foundation/06_vanilla_removal_and_zero_errors.md) §5) and it extends [01_warfare.md](01_warfare.md) §7, §8 and §12.4.

## Purpose

The warfare spec names the sea and the sky in outline: four hulls, a dragon flight and griffin riders, the grand doctrines and tracks. It stops there. It does not say what a ship's modules are, how the designer works, what a port or a convoy does, which air missions exist, or what the 16 naval and air subdoctrines are. The art spec assumes 12 naval and 4 air subdoctrines, with three rewards each, and the inventory counts 25 vanilla ones in each folder. This spec fills the gap.

It does three things. It states what the naval and air layers become (hulls, ports, convoys, carriers; dragons, griffin riders and "the winged", the air missions, the eyries). It designs the equipment designer's slots and modules. It writes all the naval and air doctrine content: three naval grand doctrines with four milestones each, four tracks, twelve subdoctrines; two air grand doctrines with two milestones each, two tracks, four subdoctrines; the mastery that feeds them; and the starting choices. Every part is tied to the unit and equipment lists of the warfare spec.

## Lore basis

### Established (fixed)

| Fact | Source |
| --- | --- |
| Western fleets cross the much wider central sea and take the capital. The Fourth Age map is read with a wider central sea. | *War of the Last Crowns*, *Canon Policy* |
| The Dead Lands are hot, storm-girt and hard to reach by sea. | *Volgan's Dead Lands* |
| Cities grew around the Great Lake, ports expanded, and Aenor traded with the islands and the North and West Lands. | *The Fourth Age of Erdae* |
| Dragons come chiefly from Dragon Mountain and do not form a country. Elven powers can command them; Afrit can, through corruption. Eindil returns on a dragon. | *Peoples of Erdae*, *Fourth Age Canon Register* |
| Lerendor and the North Lands sit at the Narrow Strait; the old alliance is the Treaty of the Narrow Strait. | *Great Powers and Relations*, *War of the Last Crowns* |

### Proposed elsewhere in the vault (used, still proposals)

Lerendor's fleets guarding the strait; the Triton islanders' charts of the Pupor Ocean (4A 702); black ships among the islands of the Ocean of Zol (4A 1744); the Great Lake ports rebuilt in 4A 40 to 120; the Lantern Chain's wardens; the Wall as a guard against dragons.

### Proposed by this spec

The module catalogue, the fleet and port rules, the air missions, every doctrine name, reward and value, the start choices, the fleet templates, all identifiers. "The winged" is the player-facing name of the air arm (dragon flights and griffin riders together); it adds no creature to the vault. Griffins stay a proposed creature, present only under the sky rule `beasts`.

### Decisions applied

S6 (dragons use the air layer), R1 (the sky rule `zin_rule_skies` sits in `RULE_GROUP_ZIN`, default `dragons_only`), V2 (Timber feeds hulls, Gold flagship fittings), E6 (doctrines cost experience; trees compile doctrine boosts to `add_doctrine_cost_reduction`), F3 (no sub-unit id equals a focus or spirit id), N16, A9. Master plan P6 (air is dragons and the winged; modern systems are reshaped, not renamed).

### Start constraints

- No dragon is in any stockpile or wing at the start (warfare); no air doctrine has a unit to train on at the start, so none is taken.
- No ship, module, doctrine or fleet text readable before `zin_afrit_revealed` names Afrit. Bound demons' hulls do not exist.
- Zol starts with three corsairs in its own waters and no other ship, and uses `zin_gd_corsair_fleets` only. Nothing here links Zol's black ships to Volgan's raiders or states what the black ships are.
- No doctrine, module or mission explains the Fading or lifts a division's piercing toward the deathless armour (the deathless invariant of warfare §5).

## Design

### 1. What the naval and air layers become

| Vanilla concept | Erdae | Keys and notes |
| --- | --- | --- |
| Destroyers and light cruisers (screen ships) | **War Galleys** | Hull `zin_hull_galley`, sub-unit `zin_ship_galley`, type `screen_ship` |
| Heavy cruisers, battle cruisers, battleships (capital ships) | **Warships** and **Great Warships** | `zin_hull_warship`, `zin_hull_great_warship`; `zin_ship_warship`, `zin_ship_great_warship`; type `capital_ship` |
| Submarines | **Corsairs** (raiders) | `zin_hull_raider`, `zin_ship_raider`; type `submarine`; hidden raiders, stealth, convoy raiding |
| Carriers and carrier air wings | **none** | No hull, no sub-unit, no designer slot. Dragons do not fly from ships; the fourth doctrine track slot becomes the sea lanes |
| Transports and convoys | **Merchant Fleets** (cogs) | Key `convoy` kept; `convoy_0` cogs, `convoy_1` ocean cogs |
| Naval bases | **Harbours** | Building `naval_base` |
| Naval supply hubs | **Victualling Yards** | Building `naval_supply_hub` |
| Naval headquarters | **The Admiralty** | Building `naval_headquarters` |
| Naval mines | none | Not loadable (WE-188); the mine modifiers have no source |
| Radar | **Beacon Towers** | Building `radar_station`, unlocked by Beacon Craft ([07_industry_and_electronics_techs.md](07_industry_and_electronics_techs.md)) |
| Floating harbours, support and repair ships, naval bombers | none | Removed with their equipment |
| Naval invasion | **Landings** | Sea soldiers (`zin_men_sea_soldiers`) in cogs, helped by the Boarding Party module and `naval_invasion_capacity` |
| Aircraft, jets, rockets, transports, helicopters | **The winged** | Dragon flights (`zin_air_dragon_flight`, type `cas`) and, under `beasts`, griffin riders (`zin_air_griffin_riders`, type `fighter`) |
| Air bases | **Eyries** | Building `air_base` |
| Anti-aircraft guns | **Scorpion Towers** and scorpion companies | `anti_air_building`; `zin_support_scorpions` |
| Naval and air experience | **Fleet Valour**, **Sky Valour** | [08_institutions.md](08_institutions.md) §3 |

### 2. Ships and the designer

#### 2.1 Hulls

The base stats are the warfare spec's ([01_warfare.md](01_warfare.md) §7.1). They are for the bare hull with its default modules; the figures below are what a module adds or multiplies.

| Hull | Type | HP | Org | Speed (kn) | Range (km) | Ram (torpedo stat) | Light atk | Heavy atk | Armour | Timber / Iron / Gold |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `zin_hull_galley` | screen_ship | 40 | 40 | 22 | 500 | 10 | 3 | 0 | 1 | 2 / 0 / 0 |
| `zin_hull_warship` | capital_ship | 180 | 35 | 16 | 2,500 | 0 | 6 | 14 | 8 | 2 / 1 / 0 |
| `zin_hull_great_warship` | capital_ship | 320 | 35 | 14 | 3,000 | 0 | 8 | 24 | 14 | 3 / 1 / 1 |
| `zin_hull_raider` | submarine | 30 | 35 | 18 | 2,000 | 12 | 0 | 0 | 0 | 2 / 1 / 0 |

Each hull archetype carries `interface_category` (so the production screen lists it), `alias`, `year` (the Fourth Age year of its technology), `is_archetype = yes`, `is_buildable = no` (variants are built), `priority` and the `upgrades` list of §2.4. A ram is the torpedo stat: big damage in the first rounds at close range.

#### 2.2 Slots

The engine's fixed slots (a slot name starting `fixed_` is shown grouped, usually required). Four categories replace the vanilla thirty.

| Hull | `fixed_propulsion` | `fixed_armament` | `fixed_protection` | `fixed_crew` |
| --- | --- | --- | --- | --- |
| Galley | 1 (required) | 1 | 1 (required) | 1 |
| Warship | 1 (required) | 2 | 1 (required) | 1 |
| Great warship | 1 (required) | 3 | 1 (required) | 1 |
| Raider | 1 (required) | 1 | 1 (required) | 1 |

Module categories: `zin_propulsion`, `zin_armament`, `zin_protection`, `zin_crew`. A hull's `allowed_module_categories` per slot names exactly one of them. The designer window is the engine's ship designer (`equipmentdesignerview.gui`); it works because ZIN keeps the hull-and-module structure; it needs the Man the Guns expansion on the player's side, as the installed module file is limited to it (ZIN's file carries no DLC test; a player without the expansion sees fixed variants, which the history creates for every hull).

#### 2.3 The sixteen modules

`common/units/equipment/modules/zin_ship_modules.txt`. Each module has a `category`, an `abbreviation`, `add_stats` and `multiply_stats` (the engine's names), `can_convert_from` (the same category, `convert_cost_ic` 100) and an `sfx`. No module adds `fuel_consumption`. A tech gate is the warfare technology that lists it in `enable_equipment_modules` (warfare §11.6, matching row by row).

| Module | Category | Fits | Tech gate | Stats | Who |
| --- | --- | --- | --- | --- | --- |
| `zin_mod_oars` Oars | propulsion | galley, raider | `zin_tech_oared_galleys` | `naval_speed` ×+0.10, `naval_range` ×−0.25 | all coastal |
| `zin_mod_sails` Sails | propulsion | warship, great warship, raider | `zin_tech_sailing_warships` | `naval_range` ×+0.25 | all coastal |
| `zin_mod_oars_and_sail` Oars and Sail | propulsion | all | `zin_tech_war_galleys` | `naval_speed` ×+0.05, `naval_range` ×+0.10 | all coastal |
| `zin_mod_elven_sails` Elven Sails | propulsion | all | `zin_tech_elven_hulls` | `naval_speed` ×+0.10, `naval_range` ×+0.30 | elves |
| `zin_mod_black_sails` Black Sails | propulsion | raider | the Mistake's tide technologies | `naval_speed` ×+0.15, `sub_visibility` −0.10 | Zol |
| `zin_mod_ram` Ram | armament | galley, raider | `zin_tech_oared_galleys` | `torpedo_attack` +10, `naval_speed` ×−0.03 | all coastal |
| `zin_mod_ballista_battery` Ballista Battery | armament | galley, warship, great warship | `zin_tech_war_galleys` | `lg_attack` +3, `lg_armor_piercing` +3, `anti_air_attack` +1 | all coastal |
| `zin_mod_catapult_deck` Catapult Deck | armament | warship, great warship | `zin_tech_high_castled_warships` | `hg_attack` +6, `hg_armor_piercing` +4, `naval_speed` ×−0.03 | all coastal |
| `zin_mod_fire_pots` Fire-Pots | armament | galley, warship, raider | `zin_tech_fire_ships` | `lg_attack` +2, `torpedo_attack` +3, `reliability` −0.02 | all coastal |
| `zin_mod_archers_deck` Archers' Deck | armament | all | `zin_tech_oared_galleys` | `anti_air_attack` +2, `lg_attack` +1 | all coastal |
| `zin_mod_planking` Planking | protection | all | none (baseline) | `armor_value` +0 | all coastal |
| `zin_mod_bronze_sheathing` Bronze Sheathing | protection | galley, warship, great warship | `zin_tech_bronze_sheathing` | `armor_value` +3, `max_strength` +5, `naval_speed` ×−0.03 | all coastal |
| `zin_mod_warded_hull` Warded Hull | protection | warship, great warship | `zin_tech_warded_hulls` (after `zin_zol_rising`) | `armor_value` +2, `max_strength` ×+0.10, `naval_torpedo_damage_reduction_factor` −0.10 | men |
| `zin_mod_boarding_party` Boarding Party | crew | galley, warship | `zin_tech_boarding_parties` | `max_strength` ×−0.03; the hull counts toward `naval_invasion_capacity` | all coastal |
| `zin_mod_lookouts` Lookouts | crew | all | `zin_tech_harbour_works` | `surface_detection` +2, `sub_detection` +2 | all coastal |
| `zin_mod_rowers_benches` Rowers' Benches | crew | galley | `zin_tech_war_galleys` | `naval_speed` ×+0.08, `max_strength` ×−0.05 | all coastal |

Black Sails need no crew: the module is hidden until the Zol mechanic grants the technology, and the text says only "no oarsmen". The warded hull is the warfare spec's anti-boarding protection against the dead; it is ordinary craft, not potent magic.

**Default modules** (the history creates the variants; `ai_equipment` reuses them): galley = Oars, Ram, Planking, Rowers' Benches; warship = Sails, Ballista Battery ×2, Planking, Lookouts; great warship = Sails, Ballista Battery, Catapult Deck ×2, Planking, Lookouts; raider = Oars, Ram, Planking, Lookouts.

**What a design costs.** The engine's module XP costs stay (add 5, replace 6, convert 3, remove 1): a full redesign of a warship is about 25 **Fleet Valour**, so designs compete with doctrines for the same pool. Critical parts keep `on_fire` and `rudder_jammed` (warfare §7.2).

#### 2.4 Hull upgrades

`common/units/equipment/upgrades/zin_upgrades.txt` (naval part): five upgrades, each of 5 levels, costing Fleet Valour (`cost = naval`), listed on the hulls' `upgrades`. Values copy the vanilla ones, renamed.

| Upgrade | Stats per level | Hulls |
| --- | --- | --- |
| `zin_upgrade_battery` Heavier Bolts | `lg_attack` 0.04, `lg_armor_piercing` 0.05, `hg_attack` 0.04, `hg_armor_piercing` 0.05, `naval_speed` −0.01, `reliability` −0.005 | galley, warship, great warship |
| `zin_upgrade_ram` Iron-Shod Prows | `torpedo_attack` 0.075, `naval_speed` −0.01, `naval_range` −0.01 | galley, raider |
| `zin_upgrade_planking` Thicker Planking | `armor_value` 0.05, `naval_speed` −0.01 | warship, great warship |
| `zin_upgrade_rigging` Better Rigging | `naval_speed` 0.03, `naval_range` 0.05, `reliability` −0.005 | all |
| `zin_upgrade_seaworthiness` Seaworthy Hulls | `reliability` 0.015, `naval_range` −0.04 | all |

### 3. Ports, supply and fleets

- **Harbours** (`naval_base`) are the home of fleets: ships are supplied by the harbour's level, repair there, and a fleet needs a harbour within its range to rest. Rules unchanged (base cost 5,000, +1,000 per level). Names: a quay, a harbour, a mole, by size; coastal forts are Sea Forts.
- **Victualling Yards** (`naval_supply_hub`) extend range and cut at-sea supply use; **the Admiralty** (`naval_headquarters`) gives commanders a share of the experience of fleets in their region (`NAVAL_HEADQUARTERS_EXPERIENCE_SCALE`). Both stay with their engine rules; their text is Erdae's.
- **Task forces** keep the engine's missions, with Erdae names: Patrol, Strike, Raid the Lanes, Escort the Cogs, Support a Landing, Hold in Harbour. Naval training stays the engine's training mission (paying Fleet Valour at no fuel cost); Sea Trials ([08_institutions.md](08_institutions.md) §3.1) add a floor.
- **Merchant Fleets** (`convoy`). Cogs (`convoy_0`, Timber 1) carry trade, supply and landings. Ocean cogs (`convoy_1`) need `zin_tech_deep_water_hulls` and cross the central sea. A wide-sea trade or invasion needs many; raiding them is the Corsairs' trade. The Dead Lands' storm belt pulses damage on any fleet not of the Dead Lands (world systems spec), which `zin_tech_storm_rigging` halves.
- **Landings.** A naval invasion needs sea soldiers, cogs, a harbour in range and, for a crossing of the wide sea, `zin_tech_deep_water_hulls`. Boarding Party hulls and `naval_invasion_capacity` (techs and Landfall rewards) raise the cap. The western crossing of the Western Crossing mechanic uses exactly this path.
- **Lerendor's strait.** A closed-strait rule is the Lerendor mechanic's; this spec adds no sea-zone rule.
- **Zol's three corsairs** wait in the Ocean of Zol and cannot leave until `zin_zol_rising`; nothing here changes that.

### 4. The air layer

#### 4.1 The sky rule

`zin_rule_skies` (warfare §8; `RULE_GROUP_ZIN`; default `dragons_only`). Two scripted triggers, registered with the technology spec: `zin_rules_skies_present` (the rule is not `none`) and `zin_rules_skies_beasts` (the rule is `beasts`).

| Option | Dragon flights | Griffin riders | Eyries | Scorpions | Air doctrine folder | Air customs, Sky Valour |
| --- | --- | --- | --- | --- | --- | --- |
| `dragons_only` (default) | by grant | not present | buildable once a realm holds a flight | present | shown; dragons track only | shown |
| `beasts` | by grant | men may breed them (tech `zin_tech_eyries`) | buildable with Eyries tech or a flight | present | shown; both tracks | shown |
| `none` | not air wings; the timed idea `zin_war_dragon_ally` (warfare §6.3) | not present | not buildable | hidden | hidden | hidden |

#### 4.2 The units

| Sub-unit | Name | Type | Wing | Equipment | Categories | Notes |
| --- | --- | --- | ---: | --- | --- | --- |
| `zin_air_dragon_flight` | Dragon Flight | `cas` | 3 dragons | `zin_dragon_equipment` (granted, non-modular) | `category_cas` | Air attack 60, defence 150, agility 25, speed 220, range 900, ground attack 90, naval strike 30 (warfare §8). Never produced; never replaced; a country never holds more than `zin_dragon_flights × 3` dragons |
| `zin_air_griffin_riders` | Griffin Riders | `fighter` | 20 | `zin_griffin_equipment` (men, rule `beasts`) | `category_fighter` | Air attack 18, defence 14, agility 45, speed 150, range 300; 3 IC each |

The categories are this spec's addition to warfare §8 (the sub-units name them so that doctrine rewards and mastery find them). If the Linux run shows a non-modular granted air equipment cannot be deployed, the dragon becomes a one-slot airframe with one fixed module (warfare §6.3 fallback; same keys).

**"The winged"** is the name the interface gives the whole arm: the Council of Captains' third header, the air tab, the air alert. It is a text term only.

#### 4.3 Eyries

`air_base` is tech-gated by listing: in vanilla it needs no technology, so a replaced technology tree would unlock it everywhere. Four warfare technologies carry the unlock (a cross-check for warfare §11.7): `zin_tech_dragon_lore` level 3, `zin_tech_eyries` level 3, `zin_tech_griffin_harness` level 6, `zin_tech_sky_lances` level 10 (the building's cap is 10). A realm that was granted a flight has `zin_tech_dragon_lore` with the grant (warfare). Base cost 1,250; the state pass leaves none at the start.

#### 4.4 Air missions

The engine offers a mission only to wings whose equipment can do it (stats and types). The intended sets, with Erdae names:

| Engine mission | Erdae name | Dragon flight | Griffin riders |
| --- | --- | :---: | :---: |
| Air Superiority | Hold the Sky | yes (weak) | yes |
| Interception | Turn Back the Wings | yes | yes |
| Close Air Support | Support the Host | yes | no |
| Naval Strike | Strike the Ships | yes | no |
| Naval Patrol | Patrol the Waters | yes | yes |
| Air Recon | Scout the Land | yes | yes |
| Logistics Strike | Raid the Wagons | yes | no |
| Port Strike | Burn the Moorings | yes | no |
| Pilot Exercises | Wing Exercises | yes | yes |
| Strategic Bombing, Barrage, Nuclear, SAM, Air Supply, Kamikaze, Minelaying, Minesweeping | none | no | no |

Dragons have air bombing 0, no transport capacity, no mine capability, so the last row is unavailable by their stats. The Linux run opens the mission picker for a dragon flight; if it offers any of the last row, the equipment stat that allows it is zeroed and the check repeated (acceptance 5). Mission emblems are wings, talons and flames (interface spec). Air superiority matters less (`NMilitary.ENEMY_AIR_SUPERIORITY_IMPACT` −0.20, `…_SPEED_IMPACT` −0.15, warfare defines).

#### 4.5 What flights are for

A flight is a rare, strong support unit: ground attack 90 against the soft targets of a battle, naval strike against a fleet in range, a scout over a march. A realm can have at most ten (`zin_dragon_flights` 0 to 10); the world pool is six grants for the whole Fourth Age (world systems). Losing a dragon is losing the pact's gift. The doctrine tracks (§7) and Sky Valour exist so that a handful of dragons still has a doctrine to grow.

### 5. The doctrine system for sea and sky

The folders, grand doctrines, tracks and subdoctrines are the engine's. Each grand doctrine lists its tracks and one **milestone** per track (in track order), given when that track's rewards are all unlocked. A subdoctrine sits on one track, costs 100 experience of its folder's pool (`navy` or `air`), has activation effects and **three rewards** (named, in order), each unlocked by mastery. Mastery comes from the manpower of the units a track names, scaled by the track's multiplier, and from naval missions at the engine's weights (patrol 0.2, strike force 0.05, convoy raiding 0.3, convoy escort 0.2, training 0.1; `NAVAL_MISSION_MASTERY_GAIN_FACTORS`, `TRAINING_MASTERY_GAIN_FACTOR`). A reward needs 100 mastery (150 for the third here: `mastery = 150`), at most 40 a month (`MAX_MONTHLY_MASTERY_GAIN`), so a track's three rewards take at least 9 months of full gain. Unit-specific effects are written as sub-unit or category blocks in the doctrine (the unit ids of warfare §7 and §8), never as country modifiers.

**One vanilla assumption is corrected.** Warfare §12.4 names the fourth naval track `zin_track_sea_lanes` (convoy). A track's mastery comes from sub-units' manpower, and convoys are equipment with no crew, so a convoy track would never gain mastery. Here the sea lanes track draws on the galleys and raiders that escort and raid (`sub_units = { zin_ship_galley zin_ship_raider }`, multiplier 1.5), which also earns mission mastery from escort (0.2) and raiding (0.3).

**Folders.** `common/doctrines/folders/zin_doctrines.txt` keeps the engine's four folder keys (`land`, `naval`, `air`, `special_forces`): `naval` named "Sea Doctrine" with the tab and ledger art of the interface spec; `air` named "Doctrine of the Winged", `allowed = { zin_rules_skies_present }`; `special_forces` has `allowed = { always = no }`. No folder has a DLC condition.

### 6. Naval doctrines

#### 6.1 Tracks and mastery

| Track | Name | Mastery source | Multiplier |
| --- | --- | --- | ---: |
| `zin_track_galleys` | Galleys | `equipment = { screen_ship }` | 1.0 |
| `zin_track_warships` | Warships | `equipment = { capital_ship }` | 2.0 |
| `zin_track_raiders` | Raiders | `equipment = { submarine }` | 3.0 |
| `zin_track_sea_lanes` | Sea Lanes | `sub_units = { zin_ship_galley zin_ship_raider }` | 1.5 |

Each track has `name`, `background`, `icon` and `icon_frame` sprites from the interface spec. A track is always active.

#### 6.2 Grand doctrines and their milestones

Cost 100 Fleet Valour. The activation effects are the warfare spec's (§12.4) plus the unit blocks below. Milestones are in track order: galleys, warships, raiders, sea lanes.

| Grand doctrine | Activation | Milestones (galleys; warships; raiders; sea lanes) | Taken by |
| --- | --- | --- | --- |
| `zin_gd_command_of_the_sea` The Command of the Sea | `naval_damage_factor` 0.10, `positioning` 0.05; `zin_ship_warship` and `zin_ship_great_warship` `max_organisation` +10 | `screening_efficiency` 0.10, `naval_morale_factor` 0.05; `navy_capital_ship_attack_factor` 0.10, `positioning` 0.05; `naval_torpedo_reveal_chance_factor` −0.10, `navy_submarine_attack_factor` 0.10; `convoy_escort_efficiency` 0.10, `convoy_retreat_speed` 0.10 | Aenor, Lerendor and other great fleets |
| `zin_gd_oar_and_ram` Oar and Ram | `screening_efficiency` 0.10, `naval_speed_factor` 0.05, `naval_invasion_prep_speed` 0.10; `zin_ship_galley` `max_organisation` +10 | `naval_torpedo_hit_chance_factor` 0.10, `naval_speed_factor` 0.05; `navy_capital_ship_defence_factor` 0.10, `naval_morale_factor` 0.05; `naval_retreat_speed` 0.10, `sub_retreat_speed` 0.10; `naval_invasion_planning_bonus_speed` 0.10, `naval_supply_consumption_factor` −0.05 | Everyone else with a navy |
| `zin_gd_corsair_fleets` The Corsair Fleets | `convoy_raiding_efficiency_factor` 0.15, `naval_retreat_chance` 0.10; `zin_ship_raider` `max_organisation` +10 | `naval_detection` 0.05, `patrol_coordination` 0.10; `navy_max_range_factor` 0.10, `naval_critical_score_chance_factor` 0.10; `convoy_raiding_efficiency_factor` 0.10, `naval_torpedo_hit_chance_factor` 0.10; `naval_retreat_chance_after_initial_combat` 0.10, `convoy_retreat_speed` 0.15 | Triton's Islands, Zol, small raiding crowns |

`available` and `visible` are `always = yes` for the first two; the third is visible to everyone and the AI weights steer it. Zol's `ai_will_do` is 0 for the first two. A grand doctrine is chosen once; replacing it costs the engine's price.

#### 6.3 The twelve subdoctrines

Each: id `zin_sub_<key>`, a track, `xp_type = navy`, cost 100, `ai_will_do`, the activation effect and three rewards named `<id>_<reward>` (the engine's reward key). The unit block names the sub-unit; the effects use the engine's modifier and stat names. Names and reward names are working labels. Third rewards need 150 mastery.

| Subdoctrine (track) | Act | Reward 1 | Reward 2 | Reward 3 (150) |
| --- | --- | --- | --- | --- |
| `zin_sub_ram_and_grapple` Ram and Grapple (galleys) | `naval_torpedo_hit_chance_factor` 0.10; galley `torpedo_attack` 0.10 | Iron-Shod Prows: galley `torpedo_attack` 0.10, `max_strength` 0.05 | Grapnel Drill: galley `max_organisation` 5, `naval_torpedo_damage_reduction_factor` −0.10 | Boarders at the Rail: `naval_invasion_capacity` 5, `shore_bombardment_bonus` 0.10 |
| `zin_sub_coastal_watch` Coastal Watch (galleys) | `naval_detection` 0.10; galley `surface_detection` 0.10 | Harbour Chain Drill: `screening_efficiency` 0.05, galley `max_strength` 0.05 | Signal Fires: `patrol_coordination` 0.10, `naval_coordination` 0.10 | Home Waters: `naval_supply_consumption_factor` −0.10, `amphibious_invasion_defence` 0.10 |
| `zin_sub_oar_squadrons` Oar Squadrons (galleys) | galley `naval_speed` 0.05; `naval_retreat_speed` 0.10 | Rowers' Pride: galley `max_organisation` 5, `reliability` 0.05 | Swift Withdrawal: `naval_retreat_speed_after_initial_combat` 0.15 | Packs of Galleys: `screening_efficiency` 0.10, `naval_morale_factor` 0.05 |
| `zin_sub_line_of_battle` Line of Battle (warships) | `navy_capital_ship_attack_factor` 0.05; warship `max_organisation` 5 | Closed Ranks: `navy_capital_ship_defence_factor` 0.08 | Flagship Banners: `naval_morale_factor` 0.08 | Concentrated Volleys: `naval_light_gun_hit_chance_factor` 0.05; warship and great warship `hg_attack` 0.05 |
| `zin_sub_ballista_decks` Ballista Decks (warships) | warship `lg_attack` 0.10, `lg_armor_piercing` 0.10 | Long Bolts: warship and great warship `lg_armor_piercing` 0.10 | Catapult Fire: `hg_attack` 0.10, `hg_armor_piercing` 0.10 (both hulls) | Steady Aim: `naval_heavy_gun_hit_chance_factor` 0.10, `naval_light_gun_hit_chance_factor` 0.05 |
| `zin_sub_sea_castles` Sea Castles (warships) | great warship `max_strength` 0.10, `armor_value` 0.05 | Layered Timbers: both hulls `armor_value` 0.05 | Bastion Decks: `shore_bombardment_bonus` 0.15; both hulls `anti_air_attack` 0.10 | Fire Watch: both hulls `critical_receive_chance` −0.20 |
| `zin_sub_night_raiders` Night Raiders (raiders) | raider `sub_visibility` −0.10; `naval_night_attack` 0.10 | Dark Hulls: raider `sub_visibility` −0.10 | Strikes in the Dark: `naval_night_attack` 0.15 | Slip Away: `sub_retreat_speed` 0.15, `naval_retreat_chance_after_initial_combat` 0.10 |
| `zin_sub_corsair_packs` Corsair Packs (raiders) | `navy_submarine_attack_factor` 0.10; `convoy_raiding_efficiency_factor` 0.10 | Packs of Three: `convoy_raiding_efficiency_factor` 0.10 | Shared Lookouts: raider `surface_detection` 0.15 | Rally Cry: `naval_torpedo_hit_chance_factor` 0.10, raider `max_organisation` 5 |
| `zin_sub_dread_ships` Dread Ships (raiders) | `naval_enemy_retreat_chance` 0.05; raider `torpedo_attack` 0.05 | Pitch and Fire: raider `torpedo_attack` 0.10 | Terror of the Dark: `naval_enemy_retreat_chance` 0.10 | Burn the Quays: `shore_bombardment_bonus` 0.20 |
| `zin_sub_cog_escorts` Cog Escorts (sea lanes) | `convoy_escort_efficiency` 0.10, `convoy_retreat_speed` 0.10 | Lanes Learned: `convoy_escort_efficiency` 0.10 | Watch the Weather: `navy_weather_penalty` −0.10 | Sweeps: `naval_detection` 0.10; galley `sub_detection` 0.10 |
| `zin_sub_harbour_works` Harbour Works (sea lanes) | `naval_supply_consumption_factor` −0.10, `refit_speed` 0.20 | Victualling Yards: `naval_supply_consumption_factor` −0.10 | Quick Refit: `refit_speed` 0.20, `refit_ic_cost` −0.20 | Repair at Sea: `naval_repair_support_factor` 0.20 |
| `zin_sub_ocean_pilots` Ocean Pilots (sea lanes) | `navy_max_range_factor` 0.10, `naval_attrition` −0.05 | Star and Chart: `navy_max_range_factor` 0.10 | Storm Sense: `naval_attrition` −0.10, `navy_weather_penalty` −0.10 | Landfall: `naval_invasion_capacity` 5, `naval_invasion_planning_bonus_speed` 0.20 |

Each subdoctrine's text reads in a sailor's voice about one thing a fleet learns; no reward claims an invention. Mining and minelaying rewards of the vanilla trees have no counterpart.

**Exclusions.** The only `xor` is between Corsair Packs and Cog Escorts (a captain raids the lanes or guards them, not both at once).

**Unit tie.** Galley subdoctrines act on `zin_ship_galley` (hull `zin_hull_galley`, modules Oars, Ram, Rowers' Benches); warship subdoctrines on `zin_ship_warship` and `zin_ship_great_warship` (Ballista Battery, Catapult Deck, Bronze Sheathing); raider subdoctrines on `zin_ship_raider` (Oars, Ram, Fire-Pots, Lookouts, Black Sails); sea-lane subdoctrines on convoys, harbours and the galley and raider hulls together.

### 7. Air doctrines

Shown only while the sky rule is not `none` (the folder's `allowed`). Two tracks, two grand doctrines, four subdoctrines. The definitions always exist and the rule only hides them, so the replaced folders are never empty.

#### 7.1 Tracks and mastery

| Track | Name | Mastery source | Multiplier | Active when |
| --- | --- | --- | ---: | --- |
| `zin_track_dragons` | Dragons | `sub_units = { zin_air_dragon_flight }` | 25 (tuning start) | `zin_rules_skies_present` |
| `zin_track_griffins` | Griffins | `sub_units = { zin_air_griffin_riders }` | 10 (tuning start) | `zin_rules_skies_beasts` |

The air tracks' multipliers in vanilla are 8.0 for wings of 100 aircraft. A flight is three dragons, so the multiplier is high; the Linux run adjusts it so that a realm holding three flights completes a dragon subdoctrine's rewards within about 18 months of steady use (acceptance 7). `active` gates both selection and mastery gain.

#### 7.2 Grand doctrines and milestones

Cost 100 Sky Valour. Milestones in track order: dragons, griffins.

| Grand doctrine | Activation | Milestones | Available to |
| --- | --- | --- | --- |
| `zin_gd_wings_of_the_mountain` Wings of the Mountain | `air_attack_factor` 0.10, `air_cas_efficiency` 0.10; `category_cas` `air_agility` 0.05 | Dragons: `air_cas_efficiency` 0.10, `air_range_factor` 0.10. Griffins: `air_superiority_efficiency` 0.10 | A realm of elves or sun_elves, or holding a flight (`zin_dragon_flights` > 0), or with `zin_war_dragon_pact` |
| `zin_gd_griffin_eyries` Griffin Eyries | `air_agility_factor` 0.10, `air_range_factor` 0.10; `category_fighter` `air_attack` 0.05 | Dragons: `air_range_factor` 0.10. Griffins: `air_intercept_efficiency` 0.10, `air_escort_efficiency` 0.10 | Men, and only under `beasts` |

`ai_will_do`: 10 for the people's own, 1 otherwise, 0 where unavailable.

#### 7.3 The four subdoctrines

`xp_type = air`, cost 100, three rewards each (the third needs 150 mastery). The unit blocks use the categories of §4.2.

| Subdoctrine (track) | Act | Reward 1 | Reward 2 | Reward 3 (150) |
| --- | --- | --- | --- | --- |
| `zin_sub_fire_from_above` Fire From Above (dragons) | `category_cas` `air_ground_attack` 0.10 | Scorched Lines: `air_cas_efficiency` 0.10 | Strike the Wagons: `air_close_air_support_org_damage_factor` 0.10 | Near the Front: `air_cas_present_factor` 0.15 |
| `zin_sub_storm_riders` Storm Riders (dragons) | `category_cas` `naval_strike_attack` 0.15 | Over Grey Water: `naval_strike_targetting_factor` 0.15 | Through the Gale: `air_weather_penalty` −0.15 | Beacon-Guided: `air_nav_efficiency` 0.15 |
| `zin_sub_lance_wings` Lance Wings (griffins) | `category_fighter` `air_attack` 0.10 | Closed Wings: `air_superiority_efficiency` 0.10 | Close Formation: `category_fighter` `air_agility` 0.10 | Veteran Lances: `air_wing_xp_loss_when_killed_factor` −0.10, `air_mission_xp_gain_factor` 0.10 |
| `zin_sub_eyrie_scouts` Eyrie Scouts (griffins) | `air_interception_detect_factor` 0.10 | Watch Posts: `air_intercept_efficiency` 0.10 | Home Skies: `air_home_defence_factor` 0.15 | Wide Eyes: `air_superiority_detect_factor` 0.10, `spotting_chance` 0.10 |

Dragons are rare, so a dragon subdoctrine is chosen for the few; the reward values are strong on purpose (a flight is worth many). There is no `xor`. The dragon rewards never raise a flight's count (the world pool does), its life, or its piercing.

**Unit tie.** The dragon subdoctrines act on `zin_air_dragon_flight` and its equipment `zin_dragon_equipment` through `category_cas`; the griffin subdoctrines act on `zin_air_griffin_riders` and `zin_griffin_equipment` through `category_fighter`. Reward modifiers that are country-wide (`air_cas_efficiency`, `air_superiority_efficiency`, `air_intercept_efficiency`) only matter to realms that hold those wings.

### 8. Starting choices (the packages)

The politics step writes these through `start_packages.json` (the doctrine half is `warfare.mjs`'s, [01_warfare.md](01_warfare.md) §15.7). Subdoctrines are set in history without experience cost (`set_sub_doctrine`). Sub-doctrines give a track something to gain mastery in; the start Fleet Valour then pays for one more.

| Country group | Naval grand doctrine (warfare §13.3) | Naval subdoctrine at start | Air at start |
| --- | --- | --- | --- |
| Aenor, Lerendor | Command of the Sea | `zin_sub_line_of_battle` (warships) | none |
| Every other realm with a fleet | Oar and Ram | `zin_sub_oar_squadrons` (galleys) | none |
| Triton's Islands, other raiding crowns | Corsair Fleets | `zin_sub_corsair_packs` (raiders) | none |
| Zol | Corsair Fleets | `zin_sub_night_raiders` (raiders) | none |
| Realms without ships | none | none | none |
| Elven realms with a dragon pact (none at start) | — | — | Wings of the Mountain with `zin_sub_fire_from_above`, on the grant |

No realm has an air doctrine at the start (no flight exists). The first grant event ([04_magic_and_world_systems.md](04_magic_and_world_systems.md) dragons) calls `zin_inst_air_start` (below) which sets the grand doctrine and the first subdoctrine for the receiver.

### 9. The stage-2 folders (what this spec adds to warfare §15.2)

Each row is a disposition row of `tools/content/data/vanilla/dispositions.json`; the module writes the file; the data rows come from this spec.

| Vanilla path | Action | ZIN content | Data file section |
| --- | --- | --- | --- |
| `common/doctrines/folders`, `/grand_doctrines`, `/tracks` | replace | `zin_doctrines.txt` (naval and air parts) | `warfare/doctrines.json` `naval`, `air` |
| `common/doctrines/subdoctrines/sea`, `/air` | replace | `zin_sea_subdoctrines.txt` (12), `zin_air_subdoctrines.txt` (4) | same |
| `common/doctrines/subdoctrines/special_forces` | replace | `zin_special_forces.txt`: one hidden subdoctrine (see below) | same |
| `common/units/equipment/modules` | replace | `zin_ship_modules.txt` (16) | `warfare/naval.json` `modules` |
| `common/units/equipment/upgrades` | replace | `zin_upgrades.txt` (the five of §2.4 plus warfare's) | `warfare/naval.json` `upgrades` |
| `common/units/equipment` (hulls, convoy) | replace | `zin_equipment_naval.txt`, `zin_equipment_air.txt`, `zin_equipment_granted.txt` | `warfare/equipment.json` |
| `common/units` (ships, air) | replace | `zin_ships.txt`, `zin_air.txt` | `warfare/units.json` |
| `common/ai_navy/fleet`, `/goals`, `/taskforce` | replace | `zin_fleet.txt`, `zin_goals.txt`, `zin_taskforce.txt` (§10) | `warfare/naval.json` `ai` |
| `common/ai_equipment` | replace | naval designs in `zin_ai_equipment.txt` | `warfare/naval.json` `designs` |
| `gfx/interface/equipmentdesigner/graphic_db` | replace | `zin_graphic_db.txt`: the four hull blueprints, sixteen module icons, four slot icons, the dragon card | `warfare/naval.json` `graphics` |
| `interface/zin_doctrines.gfx` | add | The 16 subdoctrine icons, the 5 grand doctrine icons, the 6 track backgrounds, the reward strips (`reward_gfx`) | doctrines data |
| `localisation/english/zin_naval_air_l_english.yml` | add | All text of this spec | — |

**The hidden special-forces subdoctrine.** The special-forces folder must not be empty (vanilla removal rule 3), so `zin_sub_hidden_special_forces` exists. It needs a `track` that exists and a folder that accepts it: it names `zin_track_hidden_special` (defined in `tracks/zin_doctrines.txt`, `active = { always = no }`, no mastery sources) and has `visible = { always = no }`, `available = { always = no }`, `xp_type = army`, three empty-named rewards that carry no modifier. The `special_forces` folder has `allowed = { always = no }`. The Linux run checks the doctrine screen opens with no error line. (Warfare §12 and the inventory row WE-036 name the subdoctrine but not its track; this closes it.)

**Cross-checks for warfare** (changes the integrator applies):

| # | Place | Change |
| --- | --- | --- |
| 1 | §12.4 naval tracks | The sea lanes track is sourced from the galley and raider sub-units, not convoys (§5) |
| 2 | §8 air sub-units | Add `categories = { category_cas }` to the dragon flight and `category_fighter` to the griffin riders; both are engine categories, so no new unit tag |
| 3 | §11.7 Eyries | `enable_building = { building = air_base level = N }` on `zin_tech_dragon_lore` (3), `zin_tech_eyries` (3), `zin_tech_griffin_harness` (6), `zin_tech_sky_lances` (10) (§4.3) |
| 4 | §11.6 Galleys and Warships | Technology rows match §2.3's gate column; `zin_tech_harbour_works` lists `zin_mod_lookouts`, `zin_tech_boarding_parties` lists `zin_mod_boarding_party` |
| 5 | §3 equipment | The four hull archetypes carry `interface_category`, `alias`, `year`, `is_archetype`, `priority` and the §2.4 `upgrades`; hull archetypes are listed in `script_enum_equipment_bonus_type` (warfare acceptance 16) so that `equipment_bonus` blocks and the workshops of [08_institutions.md](08_institutions.md) §9 can name them |
| 6 | §13.3 packages | Add the subdoctrine column of §8 to `start_packages.json` |
| 7 | §12.3 and WE-036 | Adopt the hidden track `zin_track_hidden_special` (§9) |
| 8 | §6.3 dragons | `zin_war_grant_dragons` also calls `zin_inst_air_start` (below) when the receiver has no air grand doctrine |
| 9 | §8 skies | The two triggers `zin_rules_skies_present` and `zin_rules_skies_beasts` replace ad hoc `has_game_rule` tests everywhere |

`zin_inst_air_start` (scripted effect, country): if the receiver has no air grand doctrine, sets `zin_gd_wings_of_the_mountain` (or `zin_gd_griffin_eyries` for men under `beasts` with no flight) and the first subdoctrine of its track, with no experience cost, and adds 50 Sky Valour. It is called by the grant, so a realm that receives its first dragon has something to read in the air folder.

### 10. The naval AI

The engine's AI navy uses fleet templates (made of task force templates), goals (objective types with priority ranges) and task force templates (missions and compositions of **sub-unit names**). All three folders are replaced, so ZIN writes them in the engine's format with the Erdae sub-unit names (`zin_ship_galley`, `zin_ship_warship`, `zin_ship_great_warship`, `zin_ship_raider`).

**Task forces** (`zin_taskforce.txt`; `allowed` always, `ai_will_do` factor 1, `keep_updated` yes where noted):

| Template | Mission | Minimum | Optimal |
| --- | --- | --- | --- |
| `zin_strike_force` | `naval_strike` | 2 warships | 2 great warships, 4 warships, 6 galleys |
| `zin_patrol_squadron` | `naval_patrol` | 2 galleys | 6 galleys |
| `zin_coast_guard` | `naval_patrol` | 1 galley | 3 galleys |
| `zin_convoy_escort` | `convoy_escort` | 2 galleys | 4 galleys |
| `zin_raider_pack` | `convoy_raiding` | 2 raiders | 6 raiders |
| `zin_landing_cover` | `naval_invasion_support` | 2 galleys, 1 warship | 4 galleys, 2 warships |

**Fleets** (`zin_fleet.txt`):

| Fleet | Required task forces | Optional |
| --- | --- | --- |
| `zin_dominance_fleet` | `zin_strike_force` 1, `zin_patrol_squadron` 2 | one more of each |
| `zin_raiding_fleet` | `zin_raider_pack` 2 | `zin_raider_pack` 2 |
| `zin_escort_fleet` | `zin_convoy_escort` 2 | `zin_convoy_escort` 1 |
| `zin_landing_fleet` | `zin_landing_cover` 1 | `zin_patrol_squadron` 1 |

**Goals** (`zin_goals.txt`; objective types and priority ranges follow the engine's generic file, without `blocked_for` lists of vanilla tags and without mine sweeping): `naval_invasion_support` 4 to 14, `naval_invasion_defense` 15 to 25, `coast_defense` 1 to 16, `convoy_protection` 1 to 5, `convoy_raiding` 3 to 7, `naval_dominance` as the generic file.

**Designs** (`zin_ai_equipment.txt`, one per hull and people): men Oars and Sail on galleys and Sails on warships with Ballista Batteries and Bronze Sheathing once known; elves the same with Elven Sails and Archers' Decks; orcs Oars, Ram and Fire-Pots; raiders Oars, Ram, Lookouts (Zol: Black Sails). A realm with the Warded Hull module uses it on warships after the rising.

**Doctrine choice** (`ai_will_do`): each naval grand doctrine 10 for its group above, 1 elsewhere, 0 for Zol's first two. Subdoctrines: the start subdoctrine's track first; then the lowest unfilled track in the order warships, galleys, sea lanes, raiders for Command of the Sea realms; galleys, sea lanes, warships, raiders for Oar and Ram; raiders, sea lanes, galleys, warships for Corsair realms. Corsair Packs over Cog Escorts for raiding crowns, the reverse for the rest. The AI takes a doctrine when it has 100 Valour and nothing in the queue.

**Navy and sea behaviour.** Galleys patrol and escort; warships form the strike force; corsairs raid convoys (warfare AI). A West Lands AI builds ocean cogs and great warships only after the Western Crossing mechanic prepares the crossing. Zol keeps its three corsairs in its waters until the rising. No AI builds Black Sails unless it has the Zol technology.

**Air behaviour.** Elven AI uses dragon flights on close support in states it owns or borders, on naval strike when an enemy fleet is within range, and on wing exercises at peace; it never trades or lends a flight (`can_be_lend_leased` is `{ always = no }`, [08_institutions.md](08_institutions.md) §4). Under `beasts`, men with eyries keep griffins at 10 per cent of military production at war and none in peace (warfare). No AI builds an eyrie before it has a flight or the Eyries technology.

## Implementation

### Builder module and data

All files are written by `tools/content/modules/warfare.mjs` from `tools/content/data/warfare/` (warfare §15.2); this spec supplies these rows:

| Data file | Section | Content |
| --- | --- | --- |
| `doctrines.json` | `naval` | Three grand doctrines, four tracks, twelve subdoctrines, milestones, mastery |
| `doctrines.json` | `air` | Two grand doctrines, two tracks, four subdoctrines, milestones, mastery |
| `doctrines.json` | `special_forces` | The hidden track, subdoctrine and folder |
| `naval.json` | `modules`, `upgrades`, `slots`, `defaults` | §2 |
| `naval.json` | `ai`, `designs`, `graphics` | §10, §9 |
| `air.json` | `units`, `missions`, `eyries` | §4 |
| `start_packages.json` (export) | naval and air subdoctrine columns | §8 |

The doctrine row schema is `{ key, kind: grand|track|sub, folder, xpType, cost, name, tracks?, milestones?, track?, activation: { modifiers, blocks, equipment }, rewards?: [{ key, mastery?, modifiers, blocks }], mastery?: { multiplier, equipment, subUnits, categories }, available?, visible?, ai }`; the module validates keys, that milestone and track counts match, that every `blocks` target exists as a sub-unit or category, and that modifiers exist in `modifiers_documentation.md`.

### Scripted names

| Name | Kind | Scope | Meaning |
| --- | --- | --- | --- |
| `zin_inst_air_start` | scripted effect | country | Sets the first air doctrine for a first grant (§8) |
| `zin_rules_skies_present`, `zin_rules_skies_beasts` | scripted triggers | country | Sky rule tests ([07_industry_and_electronics_techs.md](07_industry_and_electronics_techs.md)) |

Both files: `common/scripted_effects/zin_naval_air.txt`, `common/scripted_triggers/zin_technologies.txt` (the latter owned by the technology module).

### Engine keys checked (game 1.19.3, 19 October 2026)

- **Doctrine fields** (`folder`, `name`, `description`, `icon`, `available`, `visible`, `xp_cost`, `xp_type`, `ai_will_do`, `tracks`, `milestones`, `track`, `allow_in_multiple_tracks`, `xor`, `reward_gfx`, `rewards`, `mastery` with `multiplier`, `sub_units`, `categories`, `equipment`, `active` on tracks; `allowed`, `tab_gfx`, `ledger`, `color_frame` on folders): from the installed `_documentation.md` files and the vanilla naval and air doctrines.
- **Naval and air modifiers and unit stats used in §6 and §7**: each appears in the installed `modifiers_documentation.md` or in the installed vanilla sea or air doctrines or ship modules (a mechanical check lists every name with its source).
- **Equipment fields:** `interface_category`, `alias`, `year`, `is_archetype`, `is_buildable`, `type`, `priority`, `upgrades`, `module_slots`, `module_count_limit`, `default_modules`, `resources`, `can_be_produced` (installed hull files). **Module fields:** `abbreviation`, `category`, `add_stats`, `multiply_stats`, `can_convert_from`, `sfx`, `parent` (installed module file).
- **AI navy:** mission keys `naval_strike`, `naval_patrol`, `convoy_escort`, `convoy_raiding`, `naval_invasion_support`; objective types as the installed generic goals.
- **Engine categories** `category_cas`, `category_fighter`; equipment types `screen_ship`, `capital_ship`, `submarine`, `cas`, `fighter`.

### Crash risks

- A track named by a grand doctrine but undefined, or a milestone count that differs from the track count, breaks the doctrine screen. The module checks both.
- A subdoctrine whose `track` does not exist crashes the screen (the hidden special-forces track, §9).
- A mastery source that is not a defined equipment type, sub-unit or category silently yields no mastery; the module checks that every source exists and has manpower.
- A module category not named in any hull slot hides the module; a hull slot naming a missing category hides the slot. The module checks both ways.
- A taskforce composition naming a vanilla ship type (`destroyer`, `battleship`) leaves the AI with nothing to build; the module checks every name is a ZIN sub-unit of type ship.
- `air_base` is unlocked everywhere if no technology lists it (§4.3).
- A hull archetype missing from `script_enum_equipment_bonus_type` makes an `equipment_bonus` block fail to load (warfare acceptance 16).

## AI

Described with each part: §10 (fleets, designs, doctrine choice), §4.5 and §10 (air), §8 (start choices). The probability tool compares named scenarios before and after implementation (acceptance 9).

## Acceptance

1. **Counts.** The doctrine data holds 3 naval and 2 air grand doctrines, 4 naval and 2 air tracks (plus the hidden one), 12 naval and 4 air subdoctrines (plus the hidden one), each with three rewards; each grand doctrine has one milestone per track in track order (12 + 4 milestone blocks). A builder test counts them and fails a short one.
2. **Keys.** Every `blocks` target is a defined sub-unit or category; every modifier exists in the documentation or in the vanilla doctrine and module files (mechanical check); every `mastery` source is defined; every `enable_ability`-style reference resolves.
3. **No vanilla.** No naval or air doctrine, module, hull, upgrade, fleet or taskforce key of the vanilla game loads (checks C1 and C2). No ZIN taskforce names a vanilla ship type. The Linux run's `error.log` has no "unknown sub unit", "unknown equipment module" or "unknown track" line (stage-2 budget).
4. **Designer.** The ship designer opens for a country with a harbour; each hull offers only its slots; each module is gated by its technology (a scenario test grants `zin_tech_war_galleys` and sees Ballista Battery and Rowers' Benches appear and nothing else); the default designs exist for every hull and the four peoples of §10.
5. **Air missions.** A granted dragon flight deploys at an eyrie; its mission picker offers exactly the missions of §4.4 for a dragon flight; no strategic bombing, air supply, minelaying or paradrop. With `none`, no air sub-unit, air technology, air folder or scorpion is visible; with `beasts`, Aenor can build griffins.
6. **Rule options.** One start per option of `zin_rule_skies` (three Linux runs): doctrine folder, customs, Sky Valour, eyries and the Eyries folder are present, partly present or absent as §4.1 says.
7. **Mastery.** In the Linux run, a country with three flights and the Dragon grand doctrine gains mastery in `zin_track_dragons`, finishing the first subdoctrine in 12 to 24 months; a country with galleys on escort gains in `zin_track_sea_lanes` (mission weight 0.2); a country with no ship gains none.
8. **Doctrine choice.** Each people sees at least one naval grand doctrine; Zol sees Corsair Fleets only; the air folder shows only to elves, dragon holders and (under `beasts`) men; no griffin doctrine is visible under `dragons_only` (builder test on `visible` and `available`).
9. **AI.** Four named scenarios (the probability tool): Lerendor with a navy at peace (prefers `zin_sub_line_of_battle` then `zin_sub_cog_escorts`), a corsair crown at war with a bigger fleet (prefers `zin_sub_corsair_packs`), a landlocked realm (no naval doctrine), an elven realm with two flights (prefers `zin_sub_fire_from_above`). A Linux observer run of 365 days shows AI fleets of the §10 templates forming and escorting cogs, and no AI with a vanilla ship type.
10. **The wide sea.** A West Lands naval invasion plan to Aenor's coast is invalid without `zin_tech_deep_water_hulls` and valid with it (shared with warfare acceptance 10).
11. **Start.** On 1 Thaw 4A 1748 no air doctrine, flight, eyrie or griffin exists; every country with ships has its §8 subdoctrine and no other naval subdoctrine; Zol has its three corsairs and Corsair Fleets; no Black Sails module is available to anyone but Zol after it has the tide technology (Linux run, console).
12. **No leak.** The names spec check T2 finds no "Afrit" in any text of this spec; no reward text explains the Fading, the black ships or Volgan's spirit.
13. **Inventory.** WE-034 and WE-035 are marked `done` (names, rewards, tracks, mastery, start); WE-092 notes the sixteen modules; WE-165 notes the AI templates; WE-195 is noted as removed with the track slot reassigned.

## Open questions

All proceed on the labelled proposal; the owner's answers go to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).

1. **No carriers.** Is it right that nothing replaces carriers (no ship that carries dragons)? **Proposal, in use:** yes; the lore has no such ship, and the fourth track becomes the sea lanes.
2. **"The winged".** Is this the right player-facing name for the air arm? **Proposal, in use:** yes, as a text term only.
3. **Dragon mastery multiplier.** 25 is a start value. **Proposal, in use:** tune in the Linux run (acceptance 7).
4. **Warded hulls and dark ships.** Dark powers use the same hull list; Black Sails are Zol's alone. **Proposal, in use:** as written; no text links Zol's black ships to Volgan's raiders.
5. **Griffin doctrines under `dragons_only`.** Hidden entirely (as written) or shown but locked? **Proposal, in use:** hidden.
6. **Mine warfare.** Absent. If the owner wants it later, it needs an Erdae form (chains, fire-rafts) and a mine technology. **Proposal, in use:** none.

## Names this spec registers

| Name | Kind | Scope | Meaning | Owner | Also used by |
| --- | --- | --- | --- | --- | --- |
| `zin_mod_<key>` (the sixteen of §2.3) | ship module | equipment | Ship modules | this spec | 01_warfare, 02_economy (workshops) |
| `zin_upgrade_<key>` (the five of §2.4) | equipment upgrade | equipment | Hull upgrades | this spec | 01_warfare |
| `zin_propulsion`, `zin_armament`, `zin_protection`, `zin_crew` | module category | equipment | The four module categories | this spec | 01_warfare |
| `zin_track_galleys`, `zin_track_warships`, `zin_track_raiders`, `zin_track_sea_lanes` | doctrine track | country | The four naval tracks (the first three and the fourth as warfare names them) | this spec | 01_warfare |
| `zin_track_dragons`, `zin_track_griffins` | doctrine track | country | The air tracks (named in warfare §12.4) | this spec | 01_warfare |
| `zin_track_hidden_special` | doctrine track | country | The hidden track of the special-forces folder | this spec | 01_warfare |
| `zin_sub_<key>` (the twelve naval and four air of §6.3, §7.3, and `zin_sub_hidden_special_forces`) | subdoctrine | country | Subdoctrines (the land ones are warfare's) | this spec | 01_warfare |
| `zin_strike_force`, `zin_patrol_squadron`, `zin_coast_guard`, `zin_convoy_escort`, `zin_raider_pack`, `zin_landing_cover` | AI task force | country | Naval AI task forces | this spec | 01_warfare |
| `zin_dominance_fleet`, `zin_raiding_fleet`, `zin_escort_fleet`, `zin_landing_fleet` | AI fleet | country | Naval AI fleets | this spec | 01_warfare |
| `zin_inst_air_start` | scripted effect | country | Sets the first air doctrine for a first dragon grant | this spec | 01_warfare, 04_magic_and_world_systems |
| `zin_rules_skies_beasts` | scripted trigger | country | The sky rule is `beasts` | [07_industry_and_electronics_techs.md](07_industry_and_electronics_techs.md) | this spec |
| The words "the winged", "Merchant Fleets", "Harbours", "Victualling Yards", "the Admiralty", "Eyries" | localisation | — | Player-facing names of the layers | this spec | 02_economy, 07_interface |
